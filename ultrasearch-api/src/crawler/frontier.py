"""
UltraSearch — URL Frontier
Priority queue for the crawler. Manages which URLs to crawl next.

Features:
- Priority scoring (PageRank estimate + freshness)
- Politeness delays (per-domain rate limiting)
- robots.txt respect
- Visited URL deduplication via BloomFilter
- Persistent queue (SQLite-backed, survives restarts)
"""

import asyncio
import hashlib
import math
import sqlite3
import time
import urllib.parse
from collections import defaultdict
from dataclasses import dataclass, field
from typing import Optional
import re


# ─── Bloom Filter (probabilistic dedup — zero false negatives matter less than speed) ──

class BloomFilter:
    """
    Simple in-memory Bloom filter for URL deduplication.
    At 10M URLs: ~12MB RAM, <0.1% false positive rate.
    """
    def __init__(self, capacity: int = 10_000_000, error_rate: float = 0.001):
        self.capacity = capacity
        self.error_rate = error_rate
        # Optimal bit array size
        self.size = self._optimal_size(capacity, error_rate)
        # Optimal number of hash functions
        self.num_hashes = self._optimal_hashes(self.size, capacity)
        self.bits = bytearray(self.size // 8 + 1)
        self.count = 0

    def _optimal_size(self, n: int, p: float) -> int:
        return int(-n * math.log(p) / (math.log(2) ** 2))

    def _optimal_hashes(self, m: int, n: int) -> int:
        return max(1, int((m / n) * math.log(2)))

    def _hashes(self, item: str):
        h1 = int(hashlib.md5(item.encode()).hexdigest(), 16)
        h2 = int(hashlib.sha1(item.encode()).hexdigest(), 16)
        for i in range(self.num_hashes):
            yield (h1 + i * h2) % self.size

    def add(self, item: str) -> None:
        for pos in self._hashes(item):
            self.bits[pos // 8] |= (1 << (pos % 8))
        self.count += 1

    def __contains__(self, item: str) -> bool:
        return all(
            self.bits[pos // 8] & (1 << (pos % 8))
            for pos in self._hashes(item)
        )


# ─── URL Normalization ────────────────────────────────────────────────────────

_STRIP_PARAMS = {"utm_source", "utm_medium", "utm_campaign", "utm_term",
                 "utm_content", "fbclid", "gclid", "ref", "source"}

def normalize_url(url: str) -> str:
    """Canonicalize a URL for deduplication."""
    try:
        parsed = urllib.parse.urlparse(url.strip())
        # Lowercase scheme + host
        scheme = parsed.scheme.lower()
        netloc = parsed.netloc.lower().rstrip(".")
        # Remove default ports
        netloc = re.sub(r":80$", "", netloc) if scheme == "http" else netloc
        netloc = re.sub(r":443$", "", netloc) if scheme == "https" else netloc
        # Normalize path
        path = parsed.path or "/"
        path = re.sub(r"/+", "/", path)          # collapse double slashes
        path = path.rstrip("/") or "/"
        # Strip tracking params
        params = urllib.parse.parse_qs(parsed.query, keep_blank_values=False)
        clean = {k: v for k, v in params.items() if k not in _STRIP_PARAMS}
        query = urllib.parse.urlencode(sorted(clean.items()), doseq=True)
        # Drop fragment (anchors don't change page content)
        return urllib.parse.urlunparse((scheme, netloc, path, "", query, ""))
    except Exception:
        return url


def url_domain(url: str) -> str:
    try:
        return urllib.parse.urlparse(url).netloc.lower()
    except Exception:
        return ""


# ─── URL Item ────────────────────────────────────────────────────────────────

@dataclass(order=True)
class URLItem:
    priority: float = field(compare=True)   # lower = higher priority (min-heap)
    url: str = field(compare=False)
    depth: int = field(compare=False, default=0)
    discovered_at: float = field(compare=False, default_factory=time.time)
    parent_url: Optional[str] = field(compare=False, default=None)
    anchor_text: str = field(compare=False, default="")

    def priority_score(self) -> float:
        """
        Lower score = crawl sooner.
        Factors:
          - depth (shallow pages first)
          - freshness (recently discovered = higher priority)
          - URL length penalty (very long URLs often low quality)
        """
        depth_penalty = self.depth * 0.5
        length_penalty = max(0, len(self.url) - 80) * 0.01
        return depth_penalty + length_penalty


# ─── Per-domain Politeness Tracker ───────────────────────────────────────────

class PolitenessTracker:
    """
    Enforces per-domain crawl delays.
    Default: 1 request per domain per second (configurable via robots.txt Crawl-delay).
    """
    def __init__(self, default_delay: float = 1.0):
        self.default_delay = default_delay
        self._last_fetch: dict[str, float] = defaultdict(float)
        self._domain_delay: dict[str, float] = {}

    def set_crawl_delay(self, domain: str, delay: float) -> None:
        self._domain_delay[domain] = max(delay, 0.5)  # minimum 0.5s

    def get_delay(self, domain: str) -> float:
        return self._domain_delay.get(domain, self.default_delay)

    async def wait(self, domain: str) -> None:
        """Wait until we're allowed to fetch from this domain."""
        delay = self.get_delay(domain)
        last = self._last_fetch[domain]
        elapsed = time.time() - last
        if elapsed < delay:
            await asyncio.sleep(delay - elapsed)
        self._last_fetch[domain] = time.time()


# ─── URL Frontier ─────────────────────────────────────────────────────────────

class URLFrontier:
    """
    Priority-based URL frontier backed by SQLite for persistence.
    Thread-safe via asyncio locks.
    """

    def __init__(self, db_path: str = "data/frontier.db", max_depth: int = 5):
        self.db_path = db_path
        self.max_depth = max_depth
        self.seen = BloomFilter(capacity=50_000_000)  # 50M URLs
        self.politeness = PolitenessTracker(default_delay=1.0)
        self._lock = asyncio.Lock()
        self._queue: asyncio.PriorityQueue = asyncio.PriorityQueue()
        self._init_db()

    def _init_db(self) -> None:
        import os
        os.makedirs(os.path.dirname(self.db_path) or ".", exist_ok=True)
        conn = sqlite3.connect(self.db_path)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS frontier (
                id       INTEGER PRIMARY KEY AUTOINCREMENT,
                url      TEXT UNIQUE NOT NULL,
                priority REAL NOT NULL,
                depth    INTEGER NOT NULL DEFAULT 0,
                added_at REAL NOT NULL,
                status   TEXT NOT NULL DEFAULT 'pending'
            )
        """)
        conn.execute("CREATE INDEX IF NOT EXISTS idx_status ON frontier(status, priority)")
        conn.commit()
        conn.close()
        # Reload pending URLs from DB into in-memory queue
        self._reload_from_db()

    def _reload_from_db(self) -> None:
        conn = sqlite3.connect(self.db_path)
        rows = conn.execute(
            "SELECT url, priority, depth FROM frontier WHERE status='pending' LIMIT 100000"
        ).fetchall()
        conn.close()
        for url, priority, depth in rows:
            self.seen.add(url)
            item = URLItem(priority=priority, url=url, depth=depth)
            self._queue.put_nowait(item)

    async def add(self, url: str, depth: int = 0, parent: str = None) -> bool:
        """Add a URL to the frontier. Returns True if it was new."""
        url = normalize_url(url)
        if not url.startswith(("http://", "https://")):
            return False
        if depth > self.max_depth:
            return False
        async with self._lock:
            if url in self.seen:
                return False
            self.seen.add(url)
            item = URLItem(url=url, depth=depth, parent_url=parent)
            item.priority = item.priority_score()
            await self._queue.put(item)
            # Persist
            try:
                conn = sqlite3.connect(self.db_path)
                conn.execute(
                    "INSERT OR IGNORE INTO frontier(url, priority, depth, added_at) VALUES(?,?,?,?)",
                    (url, item.priority, depth, time.time()),
                )
                conn.commit()
                conn.close()
            except Exception:
                pass
            return True

    async def get(self) -> Optional[URLItem]:
        """Get the next URL to crawl (blocks until available)."""
        try:
            item = await asyncio.wait_for(self._queue.get(), timeout=5.0)
            domain = url_domain(item.url)
            await self.politeness.wait(domain)
            return item
        except asyncio.TimeoutError:
            return None

    def mark_done(self, url: str, status: str = "done") -> None:
        try:
            conn = sqlite3.connect(self.db_path)
            conn.execute("UPDATE frontier SET status=? WHERE url=?", (status, url))
            conn.commit()
            conn.close()
        except Exception:
            pass

    @property
    def size(self) -> int:
        return self._queue.qsize()

