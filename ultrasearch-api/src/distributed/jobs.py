"""
UltraSearch — Crawler CLI & Background Scheduler
Entry points for running the crawler and index jobs.

Commands:
  python -m src.distributed.jobs crawl    — start the web crawler
  python -m src.distributed.jobs seed     — seed the frontier with starter URLs
  python -m src.distributed.jobs pagerank — run PageRank computation
  python -m src.distributed.jobs stats    — print index stats
  python -m src.distributed.jobs test     — run a test search
"""

from __future__ import annotations

import asyncio
import argparse
import logging
import sys
import os

# Ensure src is on path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from src.crawler.crawler import WebCrawler
from src.index.index import UltraSearchIndex
from src.index.pagerank import run_pagerank_job
from src.adaptive.engine import AdaptiveSearchEngine
from src.adaptive.classifier import classify_query

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("ultrasearch.jobs")


# ─── Seed URLs: high-quality starting points ──────────────────────────────────

DEFAULT_SEEDS = [
    # Reference / encyclopedic
    "https://en.wikipedia.org/wiki/Main_Page",
    "https://en.wikipedia.org/wiki/Portal:Technology",
    "https://en.wikipedia.org/wiki/Portal:Science",

    # Tech news (high update frequency)
    "https://news.ycombinator.com",
    "https://techcrunch.com",
    "https://arstechnica.com",
    "https://theverge.com",
    "https://wired.com",

    # Developer resources
    "https://developer.mozilla.org/en-US/",
    "https://docs.python.org/3/",
    "https://github.com/trending",
    "https://stackoverflow.com/questions?tab=frequent",

    # Research
    "https://arxiv.org/list/cs.AI/recent",
    "https://arxiv.org/list/cs.LG/recent",
    "https://papers.with.code.com",

    # General quality sources
    "https://reuters.com",
    "https://bbc.com/news/technology",
    "https://nature.com",
    "https://scientificamerican.com",
]


# ─── Jobs ────────────────────────────────────────────────────────────────────

async def cmd_seed(args) -> None:
    """Seed the frontier with starter URLs."""
    index = UltraSearchIndex(db_path=args.db)
    crawler = WebCrawler(index=index, db_path=args.frontier_db, max_depth=args.depth)
    seeds = DEFAULT_SEEDS if not args.urls else args.urls
    await crawler.seed(seeds)
    log.info(f"✅ Seeded {len(seeds)} URLs. Frontier size: {crawler.frontier.size}")


async def cmd_crawl(args) -> None:
    """Start the crawler."""
    log.info(f"Starting crawler: workers={args.workers}, max_pages={args.max_pages}")
    index = UltraSearchIndex(db_path=args.db)
    crawler = WebCrawler(
        index=index,
        workers=args.workers,
        max_pages=args.max_pages,
        max_depth=args.depth,
        db_path=args.frontier_db,
    )
    if args.seed:
        await crawler.seed(DEFAULT_SEEDS)

    try:
        await crawler.run()
    except KeyboardInterrupt:
        log.info("Crawler stopped by user")
    finally:
        s = crawler.stats
        log.info(f"""
Crawler stats:
  Fetched:    {s['fetched']}
  Indexed:    {s['indexed']}
  Spam skip:  {s['skipped_spam']}
  Dedup skip: {s['skipped_duplicate']}
  Robots skip:{s['skipped_robots']}
  Errors:     {s['errors']}
        """.strip())


async def cmd_pagerank(args) -> None:
    """Run PageRank computation on the crawled link graph."""
    index = UltraSearchIndex(db_path=args.db)
    await run_pagerank_job(index, link_db_path=args.frontier_db)
    log.info("✅ PageRank computation complete")


async def cmd_stats(args) -> None:
    """Print index statistics."""
    index = UltraSearchIndex(db_path=args.db)
    stats = index.stats()
    print("\n📊 UltraSearch Index Stats")
    print("─" * 40)
    for k, v in stats.items():
        print(f"  {k:<25} {v}")
    print()


async def cmd_test(args) -> None:
    """Run test searches across all 3 modes."""
    engine = AdaptiveSearchEngine(index_path=args.db)
    test_queries = {
        1: args.query or "What is Python?",
        2: args.query or "Compare Python vs JavaScript for web development",
        3: args.query or "Write a comprehensive analysis of quantum computing history",
    }

    for mode, query in test_queries.items():
        if args.mode and args.mode != mode:
            continue
        print(f"\n{'='*60}")
        print(f"Mode {mode} | Query: {query}")
        print('='*60)

        # Show classification
        cls = classify_query(query)
        print(f"Classifier: Mode {cls.mode.value} | Confidence: {cls.confidence:.0%}")
        print(f"Reason: {cls.reason}")

        result = await engine.search(query, force_mode=mode)
        print(f"\n⚡ {result.actual_ms}ms | {result.total_results} results | Sources: {result.sources_used}")

        for i, r in enumerate(result.results[:5], 1):
            print(f"\n[{i}] {r.title}")
            print(f"    {r.url}")
            print(f"    {r.snippet[:120]}...")

        if result.synthesis:
            print(f"\n📋 Synthesis:\n{result.synthesis[:400]}...")


# ─── CLI ─────────────────────────────────────────────────────────────────────

def main() -> None:
    parser = argparse.ArgumentParser(
        description="UltraSearch — Crawler & Index Jobs",
        formatter_class=argparse.RawDescriptionHelpFormatter,
    )
    parser.add_argument("--db",          default="data/index.db",    help="Index database path")
    parser.add_argument("--frontier-db", default="data/frontier.db", help="Frontier database path")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # seed
    p_seed = subparsers.add_parser("seed", help="Seed the frontier with starter URLs")
    p_seed.add_argument("--urls", nargs="*", help="Custom seed URLs (default: curated list)")
    p_seed.add_argument("--depth", type=int, default=5, help="Max crawl depth")

    # crawl
    p_crawl = subparsers.add_parser("crawl", help="Start the web crawler")
    p_crawl.add_argument("--workers",   type=int, default=50,        help="Concurrent workers")
    p_crawl.add_argument("--max-pages", type=int, default=1_000_000, help="Max pages to crawl")
    p_crawl.add_argument("--depth",     type=int, default=5,         help="Max crawl depth")
    p_crawl.add_argument("--seed",      action="store_true",         help="Auto-seed before crawling")

    # pagerank
    subparsers.add_parser("pagerank", help="Compute PageRank from link graph")

    # stats
    subparsers.add_parser("stats", help="Print index statistics")

    # test
    p_test = subparsers.add_parser("test", help="Run test searches")
    p_test.add_argument("--query", help="Custom test query")
    p_test.add_argument("--mode", type=int, choices=[1, 2, 3], help="Force a specific mode")

    args = parser.parse_args()

    cmd_map = {
        "seed":     cmd_seed,
        "crawl":    cmd_crawl,
        "pagerank": cmd_pagerank,
        "stats":    cmd_stats,
        "test":     cmd_test,
    }

    asyncio.run(cmd_map[args.command](args))


if __name__ == "__main__":
    main()

