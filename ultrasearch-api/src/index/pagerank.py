"""
UltraSearch — PageRank Calculator
Iterative PageRank on the crawled link graph.

Algorithm (simplified power iteration):
  PR(A) = (1-d) + d * Σ PR(T_i) / C(T_i)
  where:
    d = damping factor (0.85)
    T_i = pages linking to A
    C(T_i) = number of outlinks from T_i

Runs as a background task after every N new pages crawled.
Stores results back into the index for ranking signal.
"""

from __future__ import annotations

import asyncio
import logging
import math
import sqlite3
from collections import defaultdict
from typing import Optional

log = logging.getLogger("ultrasearch.pagerank")


class PageRankCalculator:
    """
    Iterative PageRank for the crawled web graph.
    Uses sparse matrix representation (adjacency lists).
    """

    def __init__(
        self,
        damping: float = 0.85,
        iterations: int = 20,
        tolerance: float = 1e-6,
    ):
        self.damping = damping
        self.iterations = iterations
        self.tolerance = tolerance

    def compute(
        self,
        links: dict[str, list[str]],  # {from_url: [to_url, ...]}
    ) -> dict[str, float]:
        """
        Compute PageRank for all URLs in the link graph.
        Returns {url: pagerank_score} (normalized so max score = 1.0).
        """
        all_nodes: set[str] = set(links.keys())
        for targets in links.values():
            all_nodes.update(targets)

        n = len(all_nodes)
        if n == 0:
            return {}

        node_list = list(all_nodes)
        node_idx = {url: i for i, url in enumerate(node_list)}

        # Initialize scores uniformly
        scores = {url: 1.0 / n for url in all_nodes}
        out_degree = {url: len(targets) for url, targets in links.items()}

        # Reverse index: who links to me?
        in_links: dict[str, list[str]] = defaultdict(list)
        for src, targets in links.items():
            for tgt in targets:
                in_links[tgt].append(src)

        # Power iteration
        for iteration in range(self.iterations):
            new_scores: dict[str, float] = {}
            delta = 0.0

            for url in all_nodes:
                # Sum of PageRank contributions from all pages linking here
                rank_sum = sum(
                    scores[src] / max(out_degree.get(src, 1), 1)
                    for src in in_links.get(url, [])
                )
                # Dangling node mass (pages with no outlinks)
                dangling_sum = sum(
                    scores[url2]
                    for url2 in all_nodes
                    if out_degree.get(url2, 0) == 0
                ) / n

                new_score = (1 - self.damping) / n + self.damping * (rank_sum + dangling_sum)
                new_scores[url] = new_score
                delta += abs(new_score - scores[url])

            scores = new_scores
            log.debug(f"PageRank iteration {iteration+1}, delta={delta:.8f}")

            if delta < self.tolerance:
                log.info(f"PageRank converged after {iteration+1} iterations")
                break

        # Normalize: scale so max score = 1.0
        max_score = max(scores.values()) if scores else 1.0
        return {url: s / max_score for url, s in scores.items()}


async def run_pagerank_job(
    index,          # UltraSearchIndex
    link_db_path: str = "data/links.db",
    min_docs: int = 1000,
) -> None:
    """
    Background job: compute PageRank from the link graph and update the index.
    Should be run periodically (e.g., every hour or every 10K new pages).
    """
    log.info("Starting PageRank computation job...")

    # Load link graph from DB
    try:
        conn = sqlite3.connect(link_db_path)
        links_raw = conn.execute("SELECT src, dst FROM links").fetchall()
        conn.close()
    except Exception as e:
        log.warning(f"Could not load link graph: {e}")
        return

    if len(links_raw) < min_docs:
        log.info(f"Too few links ({len(links_raw)}) for PageRank — skipping")
        return

    # Build adjacency list
    links: dict[str, list[str]] = defaultdict(list)
    for src, dst in links_raw:
        links[src].append(dst)

    # Compute (in thread pool to avoid blocking event loop)
    calculator = PageRankCalculator()
    loop = asyncio.get_event_loop()
    scores = await loop.run_in_executor(None, calculator.compute, dict(links))

    # Update index
    index.update_pagerank(scores)
    log.info(f"PageRank updated for {len(scores)} URLs")

