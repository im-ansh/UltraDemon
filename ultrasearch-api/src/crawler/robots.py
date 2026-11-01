"""
UltraSearch — Robots.txt Parser & Respect Layer
Fetches, caches, and enforces robots.txt rules per domain.
"""

import asyncio
import time
import urllib.parse
import urllib.robotparser
from typing import Optional
from collections import OrderedDict


class RobotsCache:
    """
    Async robots.txt fetcher with LRU cache.
    Caches parsed robots.txt for 24 hours per domain.
    """

    def __init__(self, user_agent: str = "UltraSearchBot/1.0", cache_ttl: int = 86400, max_size: int = 10000):
        self.user_agent = user_agent
        self.cache_ttl = cache_ttl
        self._cache: OrderedDict[str, tuple[float, Optional[urllib.robotparser.RobotFileParser]]] = OrderedDict()
        self._max_size = max_size
        self._lock = asyncio.Lock()

    async def can_fetch(self, url: str, client=None) -> bool:
        """Check if we're allowed to fetch this URL per robots.txt."""
        try:
            parsed = urllib.parse.urlparse(url)
            robots_url = f"{parsed.scheme}://{parsed.netloc}/robots.txt"
            domain = parsed.netloc

            parser = await self._get_parser(robots_url, domain, client)
            if parser is None:
                return True  # No robots.txt = allowed

            allowed = parser.can_fetch(self.user_agent, url)
            # Also check generic bot rules
            if not allowed:
                allowed = parser.can_fetch("*", url)
            return allowed
        except Exception:
            return True  # On error, assume allowed

    async def get_crawl_delay(self, domain: str) -> Optional[float]:
        """Get the Crawl-delay for a domain from robots.txt."""
        try:
            parser = await self._get_parser(f"https://{domain}/robots.txt", domain)
            if parser is None:
                return None
            delay = parser.crawl_delay(self.user_agent) or parser.crawl_delay("*")
            return float(delay) if delay else None
        except Exception:
            return None

    async def _get_parser(
        self,
        robots_url: str,
        domain: str,
        client=None,
    ) -> Optional[urllib.robotparser.RobotFileParser]:
        async with self._lock:
            cached = self._cache.get(domain)
            if cached and (time.time() - cached[0]) < self.cache_ttl:
                self._cache.move_to_end(domain)
                return cached[1]

        # Fetch robots.txt
        try:
            if client:
                resp = await client.get(robots_url, timeout=5.0)
                text = resp.text if resp.status_code == 200 else ""
            else:
                import httpx
                async with httpx.AsyncClient() as c:
                    resp = await c.get(robots_url, timeout=5.0)
                    text = resp.text if resp.status_code == 200 else ""

            parser = urllib.robotparser.RobotFileParser()
            parser.parse(text.splitlines())
        except Exception:
            parser = None

        async with self._lock:
            # LRU eviction
            if len(self._cache) >= self._max_size:
                self._cache.popitem(last=False)
            self._cache[domain] = (time.time(), parser)

        return parser

