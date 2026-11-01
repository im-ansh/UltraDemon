"""
UltraSearch API — Core Configuration
Ultra-fast web search API for AI agents.
"""

import os
from dataclasses import dataclass, field
from typing import Optional

# ─── App Meta ────────────────────────────────────────────────────────────────
APP_NAME    = "UltraSearch API"
APP_VERSION = "1.0.0"
APP_DESC    = "The fastest web search API built for AI agents & LLM pipelines"

# ─── Server ──────────────────────────────────────────────────────────────────
HOST        = os.getenv("ULTRASEARCH_HOST", "0.0.0.0")
PORT        = int(os.getenv("ULTRASEARCH_PORT", "8000"))
WORKERS     = int(os.getenv("ULTRASEARCH_WORKERS", "4"))
LOG_LEVEL   = os.getenv("ULTRASEARCH_LOG_LEVEL", "info")

# ─── Redis (cache + rate-limit) ───────────────────────────────────────────────
REDIS_URL   = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CACHE_TTL   = int(os.getenv("CACHE_TTL_SECONDS", "60"))          # 1-minute hot cache
CACHE_MAX   = int(os.getenv("CACHE_MAX_RESULTS", "100"))         # LRU cap per key

# ─── Rate Limits ─────────────────────────────────────────────────────────────
RATE_LIMIT_FREE       = int(os.getenv("RATE_LIMIT_FREE", "100"))     # req / day
RATE_LIMIT_PRO        = int(os.getenv("RATE_LIMIT_PRO", "10000"))    # req / day
RATE_LIMIT_ULTRA      = int(os.getenv("RATE_LIMIT_ULTRA", "100000")) # req / day
RATE_LIMIT_ENTERPRISE = -1   # unlimited

# ─── API Key Settings ────────────────────────────────────────────────────────
API_KEY_PREFIX   = "us_"    # UltraSearch prefix
API_KEY_LEN      = 40       # total chars including prefix
API_KEY_SALT_LEN = 32       # random bytes for the key body

# ─── Search Backends ─────────────────────────────────────────────────────────
# UltraSearch fans out across multiple indices, picks fastest/best result
BRAVE_API_KEY    = os.getenv("BRAVE_API_KEY", "")
SERPER_API_KEY   = os.getenv("SERPER_API_KEY", "")
EXA_API_KEY      = os.getenv("EXA_API_KEY", "")
TAVILY_API_KEY   = os.getenv("TAVILY_API_KEY", "")

# Timeout per backend call (ms) — we race them and return first winner
BACKEND_TIMEOUT_MS = int(os.getenv("BACKEND_TIMEOUT_MS", "800"))

# ─── Secret (for signing API keys + JWTs) ────────────────────────────────────
SECRET_KEY = os.getenv("ULTRASEARCH_SECRET", "change-me-in-production-please")


@dataclass
class PlanConfig:
    name: str
    daily_limit: int                      # -1 = unlimited
    results_per_query: int = 10
    max_depth: int = 1                    # 1 = snippets, 2 = full page, 3 = deep
    semantic_search: bool = False
    realtime_news: bool = False
    image_search: bool = False
    price_usd_per_month: float = 0.0
    features: list[str] = field(default_factory=list)


PLANS: dict[str, PlanConfig] = {
    "free": PlanConfig(
        name="Free",
        daily_limit=RATE_LIMIT_FREE,
        results_per_query=5,
        max_depth=1,
        price_usd_per_month=0.0,
        features=["5 results/query", "100 req/day", "JSON snippets"],
    ),
    "pro": PlanConfig(
        name="Pro",
        daily_limit=RATE_LIMIT_PRO,
        results_per_query=20,
        max_depth=2,
        semantic_search=True,
        realtime_news=True,
        price_usd_per_month=29.0,
        features=["20 results/query", "10K req/day", "Semantic search", "News"],
    ),
    "ultra": PlanConfig(
        name="Ultra",
        daily_limit=RATE_LIMIT_ULTRA,
        results_per_query=50,
        max_depth=3,
        semantic_search=True,
        realtime_news=True,
        image_search=True,
        price_usd_per_month=99.0,
        features=["50 results/query", "100K req/day", "Full-page extraction", "Images"],
    ),
    "enterprise": PlanConfig(
        name="Enterprise",
        daily_limit=RATE_LIMIT_ENTERPRISE,
        results_per_query=100,
        max_depth=3,
        semantic_search=True,
        realtime_news=True,
        image_search=True,
        price_usd_per_month=499.0,
        features=["Unlimited", "Dedicated infra", "SLA 99.99%", "Custom endpoints"],
    ),
}

