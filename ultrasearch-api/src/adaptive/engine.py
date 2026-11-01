"""
UltraSearch — Adaptive Search Engine
The top-level orchestrator that:
  1. Classifies query → Mode 1 / 2 / 3
  2. Dispatches to the right handler
  3. Merges own-index results + external API results (hybrid mode)
  4. Returns a unified SearchResponse

Mode 1 — INSTANT  (50–150ms target)
  - Own index lookup only (BM25)
  - 5 results max
  - No page fetching

Mode 2 — STANDARD  (200–500ms target)
  - Own index (primary) + one fast external API (Brave/Serper)
  - Dedup + re-rank
  - 10–20 results
  - Optional: fetch top-3 pages for richer snippets

Mode 3 — DEEP RESEARCH  (1–5s+ target)
  - Multi-query expansion (3–5 sub-queries)
  - All external APIs + own index
  - Full page content extraction for top results
  - Cross-source deduplication
  - Source citation tracking
  - Structured synthesis output
"""

from __future__ import annotations

import asyncio
import time
from dataclasses import dataclass, field
from typing import Optional, Any

from .classifier import classify_query, SearchMode, ClassificationResult
from ..index.index import UltraSearchIndex, SearchHit
from ..search.engine import search as external_search


# ─── Unified Result Types ─────────────────────────────────────────────────────

@dataclass
class AdaptiveResult:
    url: str
    title: str
    snippet: str
    score: float
    source: str              # "own_index" | "brave" | "serper" | "exa" | "tavily"
    published_date: Optional[str] = None
    full_content: Optional[str] = None
    word_count: int = 0


@dataclass
class AdaptiveResponse:
    query: str
    mode: int                        # 1, 2, or 3
    mode_name: str                   # "instant" | "standard" | "deep"
    estimated_ms: str
    actual_ms: float
    cached: bool
    classifier_reason: str
    results: list[AdaptiveResult]
    total_results: int
    sources_used: list[str]
    sub_queries: list[str] = field(default_factory=list)   # Mode 3 only
    synthesis: Optional[str] = None                         # Mode 3 only


# ─── Mode Handlers ────────────────────────────────────────────────────────────

class InstantHandler:
    """
    Mode 1 — Instant (50–150ms)
    Hits only the own index. No external calls. Fastest possible.
    """

    def __init__(self, index: UltraSearchIndex):
        self.index = index

    async def search(self, query: str) -> list[AdaptiveResult]:
        # Run in thread pool to not block event loop
        hits = await asyncio.get_event_loop().run_in_executor(
            None,
            lambda: self.index.search(query, num_results=5, freshness_boost=False)
        )
        return [
            AdaptiveResult(
                url=h.url,
                title=h.title,
                snippet=h.snippet,
                score=h.score,
                source="own_index",
                word_count=h.word_count,
            )
            for h in hits
        ]


class StandardHandler:
    """
    Mode 2 — Standard (200–500ms)
    Own index + one fast external API. Re-ranks combined results.
    """

    def __init__(self, index: UltraSearchIndex):
        self.index = index

    async def search(self, query: str) -> list[AdaptiveResult]:
        # Fire own index + external search in parallel
        own_task = asyncio.get_event_loop().run_in_executor(
            None,
            lambda: self.index.search(query, num_results=10, freshness_boost=True)
        )
        ext_task = external_search(query, num_results=10, use_cache=True)

        own_hits, ext_response = await asyncio.gather(own_task, ext_task, return_exceptions=True)

        results: list[AdaptiveResult] = []
        seen_urls: set[str] = set()

        # Add own-index results (higher trust)
        if isinstance(own_hits, list):
            for h in own_hits:
                if h.url not in seen_urls:
                    seen_urls.add(h.url)
                    results.append(AdaptiveResult(
                        url=h.url,
                        title=h.title,
                        snippet=h.snippet,
                        score=h.score * 1.2,  # own index trust boost
                        source="own_index",
                        word_count=h.word_count,
                    ))

        # Merge external results
        if not isinstance(ext_response, Exception):
            for r in ext_response.results:
                if r.url not in seen_urls:
                    seen_urls.add(r.url)
                    results.append(AdaptiveResult(
                        url=r.url,
                        title=r.title,
                        snippet=r.snippet,
                        score=r.score,
                        source=r.source,
                    ))

        # Re-sort by final score
        results.sort(key=lambda r: r.score, reverse=True)
        return results[:20]


class DeepResearchHandler:
    """
    Mode 3 — Deep Research (1–5s+)
    Multi-query expansion, all sources, full page extraction, synthesis.
    """

    def __init__(self, index: UltraSearchIndex):
        self.index = index

    def _expand_queries(self, query: str) -> list[str]:
        """
        Generate 3–5 sub-queries from the main query.
        In production, use an LLM for this. Here we use heuristics.
        """
        sub_queries = [query]

        # Add "recent" variant
        if "recent" not in query.lower() and "2025" not in query and "2026" not in query:
            sub_queries.append(f"{query} 2025")

        # Add "overview" variant
        sub_queries.append(f"{query} overview guide")

        # Add "examples" variant
        if "example" not in query.lower():
            sub_queries.append(f"{query} examples case studies")

        # Add "comparison" variant if multiple entities
        if " vs " not in query.lower() and "compare" not in query.lower():
            sub_queries.append(f"{query} comparison analysis")

        return sub_queries[:5]

    async def search(self, query: str) -> tuple[list[AdaptiveResult], list[str]]:
        sub_queries = self._expand_queries(query)

        # Fan out: search ALL sub-queries across ALL sources
        tasks = []
        for sq in sub_queries:
            # Own index
            tasks.append(("own", sq, asyncio.get_event_loop().run_in_executor(
                None, lambda q=sq: self.index.search(q, num_results=10, freshness_boost=True)
            )))
            # External (all backends)
            tasks.append(("ext", sq, external_search(
                sq, num_results=10, use_cache=False, semantic=True
            )))

        # Execute all in parallel
        all_results = await asyncio.gather(*[t[2] for t in tasks], return_exceptions=True)

        seen_urls: set[str] = set()
        merged: list[AdaptiveResult] = []

        for (source_type, sq), result in zip([(t[0], t[1]) for t in tasks], all_results):
            if isinstance(result, Exception):
                continue

            if source_type == "own" and isinstance(result, list):
                for h in result:
                    if h.url not in seen_urls:
                        seen_urls.add(h.url)
                        merged.append(AdaptiveResult(
                            url=h.url, title=h.title, snippet=h.snippet,
                            score=h.score * 1.2, source="own_index",
                            word_count=h.word_count,
                        ))
            elif source_type == "ext" and hasattr(result, "results"):
                for r in result.results:
                    if r.url not in seen_urls:
                        seen_urls.add(r.url)
                        merged.append(AdaptiveResult(
                            url=r.url, title=r.title, snippet=r.snippet,
                            score=r.score, source=r.source,
                        ))

        # Sort by score
        merged.sort(key=lambda r: r.score, reverse=True)

        # Fetch full content for top 5 results (gives richer snippets)
        top5 = merged[:5]
        content_tasks = [self._fetch_full_content(r.url) for r in top5]
        contents = await asyncio.gather(*content_tasks, return_exceptions=True)
        for result, content in zip(top5, contents):
            if isinstance(content, str) and content:
                result.full_content = content[:3000]  # cap at 3000 chars

        return merged[:50], sub_queries

    async def _fetch_full_content(self, url: str) -> Optional[str]:
        """Fetch and extract text from a URL for deep research."""
        try:
            import httpx
            from ..crawler.crawler import parse_html, HEADERS
            async with httpx.AsyncClient(headers=HEADERS) as client:
                resp = await client.get(url, timeout=8.0, follow_redirects=True)
                if resp.status_code == 200:
                    _, _, text, _ = parse_html(resp.text, url)
                    return text[:5000]
        except Exception:
            pass
        return None


# ─── Adaptive Engine ─────────────────────────────────────────────────────────

class AdaptiveSearchEngine:
    """
    Top-level adaptive search engine.
    Automatically selects Mode 1 / 2 / 3 and dispatches to the right handler.
    """

    def __init__(self, index_path: str = "data/index.db"):
        self.index = UltraSearchIndex(db_path=index_path)
        self.instant  = InstantHandler(self.index)
        self.standard = StandardHandler(self.index)
        self.deep     = DeepResearchHandler(self.index)

        # Simple in-memory cache
        self._cache: dict[str, tuple[float, AdaptiveResponse]] = {}
        self._cache_ttl = 60.0  # seconds

    async def search(
        self,
        query: str,
        force_mode: Optional[int] = None,   # override auto-classification
        use_cache: bool = True,
    ) -> AdaptiveResponse:
        """
        Main search entry point. Classifies query, dispatches, returns results.
        """
        t_start = time.perf_counter()

        # Cache check
        cache_key = f"{query.lower().strip()}:{force_mode}"
        if use_cache:
            cached = self._cache.get(cache_key)
            if cached and (time.time() - cached[0]) < self._cache_ttl:
                resp = cached[1]
                resp.cached = True
                resp.actual_ms = round((time.perf_counter() - t_start) * 1000, 2)
                return resp

        # Classify
        classification: ClassificationResult = classify_query(query)
        mode = SearchMode(force_mode) if force_mode else classification.mode

        # Dispatch
        sub_queries: list[str] = [query]
        synthesis: Optional[str] = None

        if mode == SearchMode.INSTANT:
            results = await self.instant.search(query)
            mode_name = "instant"

        elif mode == SearchMode.STANDARD:
            results = await self.standard.search(query)
            mode_name = "standard"

        else:  # DEEP
            results, sub_queries = await self.deep.search(query)
            mode_name = "deep"
            # Basic synthesis (in production: feed to an LLM)
            synthesis = self._basic_synthesis(query, results[:5])

        actual_ms = round((time.perf_counter() - t_start) * 1000, 2)
        sources = list({r.source for r in results})

        response = AdaptiveResponse(
            query=query,
            mode=int(mode),
            mode_name=mode_name,
            estimated_ms=classification.estimated_ms,
            actual_ms=actual_ms,
            cached=False,
            classifier_reason=classification.reason,
            results=results,
            total_results=len(results),
            sources_used=sources,
            sub_queries=sub_queries if mode == SearchMode.DEEP else [],
            synthesis=synthesis,
        )

        # Store in cache
        if use_cache:
            self._cache[cache_key] = (time.time(), response)

        return response

    def _basic_synthesis(self, query: str, top_results: list[AdaptiveResult]) -> str:
        """
        Basic text synthesis from top results.
        In production: replace with an LLM call (GPT-4/Gemini/Claude).
        """
        if not top_results:
            return "No results found for this query."

        parts = [f"**Research Summary: {query}**\n"]
        parts.append(f"*Based on {len(top_results)} sources*\n")

        for i, r in enumerate(top_results[:5], 1):
            parts.append(f"\n**[{i}] {r.title}**")
            parts.append(f"Source: {r.url}")
            if r.full_content:
                parts.append(r.full_content[:500])
            elif r.snippet:
                parts.append(r.snippet)

        return "\n".join(parts)

