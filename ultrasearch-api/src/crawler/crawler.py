"""
UltraSearch — Async Web Crawler
The heart of the own-index system. Crawls the web at scale.

Architecture:
  - N worker coroutines run concurrently (configurable, default 50)
  - Each worker: get URL from frontier → fetch → parse → extract links → index
  - Uses httpx for fast async HTTP (no browser for most pages)
  - Falls back to Playwright (headless Chromium) for JS-heavy pages
  - Respects robots.txt, applies politeness delays
  - Near-duplicate detection via SimHash
  - Spam filtering before indexing

Usage:
    crawler = WebCrawler(index=my_index)
    await crawler.seed(["https://en.wikipedia.org", "https://news.ycombinator.com"])
    await crawler.run(workers=50, max_pages=1_000_000)
"""

from __future__ import annotations

import asyncio
import logging
import re
import time
import urllib.parse
from dataclasses import dataclass, field
from typing import Optional

try:
    import httpx
    HTTPX_OK = True
except ImportError:
    HTTPX_OK = False

try:
    from bs4 import BeautifulSoup
    BS4_OK = True
except ImportError:
    BS4_OK = False

from .frontier import URLFrontier, url_domain
from .robots import RobotsCache
from .dedup import SimHashIndex, simhash, is_spam

log = logging.getLogger("ultrasearch.crawler")


# ─── Crawled Document ────────────────────────────────────────────────────────

@dataclass
class CrawledDoc:
    url: str
    title: str
    text: str                     # plain text (stripped HTML)
    html: str                     # raw HTML (for link extraction)
    lang: str = "en"
    content_type: str = "text/html"
    status_code: int = 200
    crawled_at: float = field(default_factory=time.time)
    outlinks: list[str] = field(default_factory=list)
    simhash: int = 0
    spam_score: float = 0.0
    word_count: int = 0
    description: str = ""         # meta description


# ─── HTML Parser ─────────────────────────────────────────────────────────────

_BOILERPLATE_TAGS = {"nav", "header", "footer", "aside", "script",
                     "style", "noscript", "iframe", "form", "button"}


def parse_html(html: str, base_url: str) -> tuple[str, str, str, list[str]]:
    """
    Parse HTML → (title, description, text, outlinks).
    Strips boilerplate (nav, footer, ads) to keep only main content.
    """
    if not BS4_OK:
        # Fallback: regex-based extraction
        title = re.search(r"<title[^>]*>(.*?)</title>", html, re.IGNORECASE | re.DOTALL)
        title = title.group(1).strip() if title else ""
        text = re.sub(r"<[^>]+>", " ", html)
        text = re.sub(r"\s+", " ", text).strip()
        return title, "", text[:10000], []

    soup = BeautifulSoup(html, "html.parser")

    # Remove boilerplate
    for tag in soup.find_all(_BOILERPLATE_TAGS):
        tag.decompose()

    # Title
    title_tag = soup.find("title")
    title = title_tag.get_text(strip=True) if title_tag else ""

    # Meta description
    desc_tag = soup.find("meta", attrs={"name": re.compile(r"description", re.I)})
    description = ""
    if desc_tag and desc_tag.get("content"):
        description = desc_tag["content"].strip()[:500]

    # Main content (prefer <main>, <article>, then <body>)
    content = (
        soup.find("main") or
        soup.find("article") or
        soup.find(id=re.compile(r"(content|main|article)", re.I)) or
        soup.find(class_=re.compile(r"(content|main|article)", re.I)) or
        soup.body or
        soup
    )
    text = content.get_text(separator=" ", strip=True) if content else ""
    text = re.sub(r"\s+", " ", text).strip()

    # Extract outlinks
    outlinks = []
    for a_tag in soup.find_all("a", href=True):
        href = a_tag["href"].strip()
        try:
            absolute = urllib.parse.urljoin(base_url, href)
            parsed = urllib.parse.urlparse(absolute)
            if parsed.scheme in ("http", "https"):
                outlinks.append(absolute)
        except Exception:
            pass

    return title, description, text, outlinks


# ─── Fetcher ─────────────────────────────────────────────────────────────────

HEADERS = {
    "User-Agent": (
        "UltraSearchBot/1.0 (+https://ultrasearch.dev/bot; "
        "Respectful crawler, robots.txt compliant)"
    ),
    "Accept": "text/html,application/xhtml+xml,*/*;q=0.8",
    "Accept-Language": "en-US,en;q=0.5",
    "Accept-Encoding": "gzip, deflate, br",
}

# Content types we'll index
INDEXABLE_TYPES = {"text/html", "application/xhtml+xml", "text/plain"}

# Max response size: 5MB
MAX_RESPONSE_BYTES = 5 * 1024 * 1024


async def fetch_page(
    url: str,
    client: "httpx.AsyncClient",
    timeout: float = 10.0,
) -> Optional[tuple[int, str, str]]:
    """
    Fetch a URL. Returns (status_code, content_type, html) or None on error.
    """
    try:
        resp = await client.get(url, timeout=timeout, follow_redirects=True)
        ct = resp.headers.get("content-type", "").split(";")[0].strip().lower()
        if not any(ct.startswith(t) for t in INDEXABLE_TYPES):
            return None
        if len(resp.content) > MAX_RESPONSE_BYTES:
            return None
        return resp.status_code, ct, resp.text
    except Exception as e:
        log.debug(f"Fetch error {url}: {e}")
        return None


# ─── Web Crawler ─────────────────────────────────────────────────────────────

class WebCrawler:
    """
    Async multi-worker web crawler.
    """

    def __init__(
        self,
        index=None,                       # UltraSearchIndex instance
        frontier: Optional[URLFrontier] = None,
        workers: int = 50,
        max_pages: int = 1_000_000,
        max_depth: int = 5,
        db_path: str = "data/frontier.db",
    ):
        self.index = index
        self.frontier = frontier or URLFrontier(db_path=db_path, max_depth=max_depth)
        self.workers = workers
        self.max_pages = max_pages
        self.robots = RobotsCache()
        self.dedup = SimHashIndex()

        # Stats
        self.stats = {
            "fetched": 0,
            "indexed": 0,
            "skipped_robots": 0,
            "skipped_spam": 0,
            "skipped_duplicate": 0,
            "errors": 0,
            "started_at": None,
        }
        self._stop_event = asyncio.Event()

    async def seed(self, urls: list[str]) -> None:
        """Add seed URLs to the frontier."""
        for url in urls:
            await self.frontier.add(url, depth=0)
        log.info(f"Seeded {len(urls)} URLs into frontier")

    async def run(self) -> None:
        """Start crawling with N worker coroutines."""
        self.stats["started_at"] = time.time()
        log.info(f"Starting crawler: {self.workers} workers, max {self.max_pages} pages")

        limits = httpx.Limits(
            max_connections=self.workers * 2,
            max_keepalive_connections=self.workers,
        )
        async with httpx.AsyncClient(
            headers=HEADERS,
            limits=limits,
            http2=True,
            verify=False,  # Skip SSL cert validation for crawling speed
        ) as client:
            worker_tasks = [
                asyncio.create_task(self._worker(i, client))
                for i in range(self.workers)
            ]
            await asyncio.gather(*worker_tasks, return_exceptions=True)

        elapsed = time.time() - self.stats["started_at"]
        rate = self.stats["indexed"] / max(elapsed, 1)
        log.info(
            f"Crawler finished. Indexed: {self.stats['indexed']}, "
            f"Rate: {rate:.1f} pages/sec, Time: {elapsed:.1f}s"
        )

    async def stop(self) -> None:
        """Gracefully stop all workers."""
        self._stop_event.set()

    async def _worker(self, worker_id: int, client: "httpx.AsyncClient") -> None:
        """Single crawler worker coroutine."""
        log.debug(f"Worker {worker_id} started")
        while not self._stop_event.is_set():
            if self.stats["indexed"] >= self.max_pages:
                break

            item = await self.frontier.get()
            if item is None:
                await asyncio.sleep(0.5)
                continue

            try:
                doc = await self._process_url(item.url, item.depth, client)
                if doc:
                    # Discover and enqueue outlinks
                    for link in doc.outlinks:
                        await self.frontier.add(link, depth=item.depth + 1, parent=item.url)
                    self.frontier.mark_done(item.url, "done")
                else:
                    self.frontier.mark_done(item.url, "skipped")
            except Exception as e:
                self.stats["errors"] += 1
                log.warning(f"Worker {worker_id} error on {item.url}: {e}")
                self.frontier.mark_done(item.url, "error")

        log.debug(f"Worker {worker_id} done")

    async def _process_url(
        self,
        url: str,
        depth: int,
        client: "httpx.AsyncClient",
    ) -> Optional[CrawledDoc]:
        """Fetch, parse, filter, and index a single URL."""

        # 1. Robots check
        allowed = await self.robots.can_fetch(url, client)
        if not allowed:
            self.stats["skipped_robots"] += 1
            log.debug(f"Robots blocked: {url}")
            return None

        # 2. Apply crawl delay from robots.txt
        domain = url_domain(url)
        crawl_delay = await self.robots.get_crawl_delay(domain)
        if crawl_delay:
            self.frontier.politeness.set_crawl_delay(domain, crawl_delay)

        # 3. Fetch
        result = await fetch_page(url, client)
        self.stats["fetched"] += 1
        if result is None:
            return None

        status_code, content_type, html = result
        if status_code not in (200, 203):
            return None

        # 4. Parse
        title, description, text, outlinks = parse_html(html, url)
        if len(text.split()) < 30:
            return None  # Too little content

        # 5. Spam check
        sp = is_spam(text, url)
        if sp:
            self.stats["skipped_spam"] += 1
            return None

        # 6. Near-duplicate check
        fp = simhash(text)
        dup_id = self.dedup.add(url, fp)
        if dup_id:
            self.stats["skipped_duplicate"] += 1
            log.debug(f"Duplicate: {url} ~ {dup_id}")
            return None

        doc = CrawledDoc(
            url=url,
            title=title,
            text=text,
            html=html,
            content_type=content_type,
            status_code=status_code,
            outlinks=outlinks[:200],   # cap outlinks per page
            simhash=fp,
            word_count=len(text.split()),
            description=description,
        )

        # 7. Index the document
        if self.index:
            await asyncio.get_event_loop().run_in_executor(
                None, self.index.add_document, doc
            )
            self.stats["indexed"] += 1
            if self.stats["indexed"] % 1000 == 0:
                log.info(f"Indexed {self.stats['indexed']} pages...")

        return doc

