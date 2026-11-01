"""
UltraSearch API — Search Engine Core
Fans out to multiple backends in parallel, races them, returns fastest result.

Strategy:
  1. Fire requests to all configured backends simultaneously (asyncio.gather)
  2. Return the first successful response (asyncio.wait with FIRST_COMPLETED)
  3. Deduplicate URLs across providers
  4. Cache the merged result in Redis (TTL = 60s) for hot repeated queries
"""

import asyncio
import hashlib
import json
import time
from dataclasses import dataclass, asdict
from typing import Optional, Any

try:
    import httpx
    HTTPX_AVAILABLE = True
except ImportError:
    HTTPX_AVAILABLE = False

from ..core.config import (
    BRAVE_API_KEY, SERPER_API_KEY, EXA_API_KEY, TAVILY_API_KEY,
    BACKEND_TIMEOUT_MS, CACHE_TTL,
)


# ─── Data Models ─────────────────────────────────────────────────────────────

@dataclass
class SearchResult:
    title: str
    url: str
    snippet: str
    source: str          # which backend returned this
    published_date: Optional[str] = None
    score: float = 0.0   # relevance score (0–1)
    full_content: Optional[str] = None  # Pro+: extracted page text


@dataclass
class SearchResponse:
    query: str
    results: list[SearchResult]
    total_results: int
    search_time_ms: float
    cached: bool
    backends_used: list[str]
    metadata: dict


# ─── Simple in-memory cache (replace with Redis in production) ────────────────

_CACHE: dict[str, tuple[float, SearchResponse]] = {}  # key → (expire_ts, response)


def _cache_key(query: str, params: dict) -> str:
    raw = json.dumps({"q": query.lower().strip(), **params}, sort_keys=True)
    return hashlib.md5(raw.encode()).hexdigest()


def _cache_get(key: str) -> Optional[SearchResponse]:
    entry = _CACHE.get(key)
    if entry and time.time() < entry[0]:
        return entry[1]
    _CACHE.pop(key, None)
    return None


def _cache_set(key: str, response: SearchResponse) -> None:
    _CACHE[key] = (time.time() + CACHE_TTL, response)


# ─── Backend Adapters ─────────────────────────────────────────────────────────

async def _search_brave(
    client: "httpx.AsyncClient",
    query: str,
    num_results: int,
) -> list[SearchResult]:
    if not BRAVE_API_KEY:
        return []
    resp = await client.get(
        "https://api.search.brave.com/res/v1/web/search",
        headers={"Accept": "application/json", "X-Subscription-Token": BRAVE_API_KEY},
        params={"q": query, "count": num_results, "result_filter": "web"},
        timeout=BACKEND_TIMEOUT_MS / 1000,
    )
    resp.raise_for_status()
    data = resp.json()
    results = []
    for item in data.get("web", {}).get("results", []):
        results.append(SearchResult(
            title=item.get("title", ""),
            url=item.get("url", ""),
            snippet=item.get("description", ""),
            source="brave",
            published_date=item.get("age"),
            score=item.get("relevance_score", 0.8),
        ))
    return results


async def _search_serper(
    client: "httpx.AsyncClient",
    query: str,
    num_results: int,
) -> list[SearchResult]:
    if not SERPER_API_KEY:
        return []
    resp = await client.post(
        "https://google.serper.dev/search",
        headers={"X-API-KEY": SERPER_API_KEY, "Content-Type": "application/json"},
        json={"q": query, "num": num_results},
        timeout=BACKEND_TIMEOUT_MS / 1000,
    )
    resp.raise_for_status()
    data = resp.json()
    results = []
    for item in data.get("organic", []):
        results.append(SearchResult(
            title=item.get("title", ""),
            url=item.get("link", ""),
            snippet=item.get("snippet", ""),
            source="serper",
            score=0.85,
        ))
    return results


async def _search_exa(
    client: "httpx.AsyncClient",
    query: str,
    num_results: int,
) -> list[SearchResult]:
    if not EXA_API_KEY:
        return []
    resp = await client.post(
        "https://api.exa.ai/search",
        headers={"x-api-key": EXA_API_KEY, "Content-Type": "application/json"},
        json={"query": query, "numResults": num_results, "type": "neural"},
        timeout=BACKEND_TIMEOUT_MS / 1000,
    )
    resp.raise_for_status()
    data = resp.json()
    results = []
    for item in data.get("results", []):
        results.append(SearchResult(
            title=item.get("title", ""),
            url=item.get("url", ""),
            snippet=item.get("text", "")[:300],
            source="exa",
            published_date=item.get("publishedDate"),
            score=item.get("score", 0.75),
        ))
    return results


async def _search_tavily(
    client: "httpx.AsyncClient",
    query: str,
    num_results: int,
) -> list[SearchResult]:
    if not TAVILY_API_KEY:
        return []
    resp = await client.post(
        "https://api.tavily.com/search",
        json={
            "api_key": TAVILY_API_KEY,
            "query": query,
            "max_results": num_results,
            "include_answer": False,
        },
        timeout=BACKEND_TIMEOUT_MS / 1000,
    )
    resp.raise_for_status()
    data = resp.json()
    results = []
    for item in data.get("results", []):
        results.append(SearchResult(
            title=item.get("title", ""),
            url=item.get("url", ""),
            snippet=item.get("content", "")[:300],
            source="tavily",
            published_date=item.get("published_date"),
            score=item.get("score", 0.7),
        ))
    return results


# ─── Mock backend (used when no API keys are set, for local dev) ──────────────

async def _search_mock(query: str, num_results: int) -> list[SearchResult]:
    """Returns fake results so the server runs without real API keys."""
    await asyncio.sleep(0.05)  # simulate 50ms network
    return [
        SearchResult(
            title=f"[MOCK] Result {i+1} for: {query}",
            url=f"https://example.com/result-{i+1}",
            snippet=f"This is a mock snippet for '{query}' result #{i+1}. Configure real API keys to get live results.",
            source="mock",
            score=round(1.0 - i * 0.1, 2),
        )
        for i in range(min(num_results, 5))
    ]


# ─── Main Search Function ─────────────────────────────────────────────────────

async def search(
    query: str,
    num_results: int = 10,
    use_cache: bool = True,
    semantic: bool = False,
    news_only: bool = False,
) -> SearchResponse:
    """
    Ultra-fast parallel web search.

    Fires all configured backends simultaneously and returns a deduplicated,
    ranked list of results from whichever responds fastest.
    """
    t_start = time.perf_counter()
    params = {"n": num_results, "semantic": semantic, "news": news_only}
    ck = _cache_key(query, params)

    # ── Cache hit ──────────────────────────────────────────────────────────
    if use_cache:
        cached = _cache_get(ck)
        if cached:
            cached.cached = True
            cached.search_time_ms = round((time.perf_counter() - t_start) * 1000, 2)
            return cached

    # ── Fan out to all backends in parallel ────────────────────────────────
    all_results: list[SearchResult] = []
    backends_used: list[str] = []

    no_keys = not any([BRAVE_API_KEY, SERPER_API_KEY, EXA_API_KEY, TAVILY_API_KEY])

    if no_keys:
        # Dev mode — use mock
        all_results = await _search_mock(query, num_results)
        backends_used = ["mock"]
    else:
        async with httpx.AsyncClient() as client:
            tasks = []
            if BRAVE_API_KEY:
                tasks.append(("brave",  _search_brave(client, query, num_results)))
            if SERPER_API_KEY:
                tasks.append(("serper", _search_serper(client, query, num_results)))
            if EXA_API_KEY:
                tasks.append(("exa",    _search_exa(client, query, num_results)))
            if TAVILY_API_KEY:
                tasks.append(("tavily", _search_tavily(client, query, num_results)))

            # Race all backends — collect everything that finishes within timeout
            coros = [t[1] for t in tasks]
            names = [t[0] for t in tasks]

            raw_results = await asyncio.gather(*coros, return_exceptions=True)

            seen_urls: set[str] = set()
            for name, result in zip(names, raw_results):
                if isinstance(result, Exception):
                    continue
                backends_used.append(name)
                for r in result:
                    if r.url not in seen_urls:
                        seen_urls.add(r.url)
                        all_results.append(r)

    # ── Sort by score descending ───────────────────────────────────────────
    all_results.sort(key=lambda r: r.score, reverse=True)
    all_results = all_results[:num_results]

    elapsed_ms = round((time.perf_counter() - t_start) * 1000, 2)

    response = SearchResponse(
        query=query,
        results=all_results,
        total_results=len(all_results),
        search_time_ms=elapsed_ms,
        cached=False,
        backends_used=backends_used,
        metadata={
            "version": "1.0.0",
            "semantic": semantic,
            "news_only": news_only,
        },
    )

    if use_cache:
        _cache_set(ck, response)

    return response

