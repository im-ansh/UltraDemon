"""
UltraSearch API — FastAPI REST Server
Endpoints:
  POST /v1/search          — main search endpoint
  GET  /v1/search          — alias (query param)
  POST /v1/keys            — provision a new API key
  GET  /v1/keys            — list keys for a user
  DELETE /v1/keys/{key}    — revoke a key
  GET  /v1/usage           — usage stats for current key
  GET  /health             — health check
  GET  /v1/plans           — list available plans
"""

from __future__ import annotations

import time
from typing import Optional, Annotated

try:
    from fastapi import FastAPI, Header, HTTPException, Query, Depends, Request
    from fastapi.middleware.cors import CORSMiddleware
    from fastapi.responses import JSONResponse
    from pydantic import BaseModel, Field
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False

from ..core.config import APP_NAME, APP_VERSION, APP_DESC, PLANS
from ..auth.api_keys import (
    create_key, validate_key, revoke_key, list_keys, get_usage
)
from ..search.engine import search as do_search, asdict


# ─── FastAPI App ──────────────────────────────────────────────────────────────

app = FastAPI(
    title=APP_NAME,
    version=APP_VERSION,
    description=APP_DESC,
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request / Response Models ────────────────────────────────────────────────

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Search query")
    num_results: int = Field(10, ge=1, le=100, description="Number of results (1–100)")
    semantic: bool = Field(False, description="Enable semantic/neural search (Pro+)")
    news_only: bool = Field(False, description="Return news articles only")
    use_cache: bool = Field(True, description="Use cached results when available")


class KeyCreateRequest(BaseModel):
    user_id: str = Field(..., description="Your user / account ID")
    plan: str = Field("free", description="Plan: free | pro | ultra | enterprise")
    label: str = Field("", description="Human-readable label for this key")


# ─── Auth Dependency ──────────────────────────────────────────────────────────

async def get_api_key(
    x_api_key: Annotated[Optional[str], Header()] = None,
    authorization: Annotated[Optional[str], Header()] = None,
):
    """Extract and validate the API key from headers."""
    key = x_api_key
    if not key and authorization:
        # Support: Authorization: Bearer us_xxxxx
        parts = authorization.split(" ", 1)
        if len(parts) == 2 and parts[0].lower() == "bearer":
            key = parts[1]

    if not key:
        raise HTTPException(
            status_code=401,
            detail="API key required. Pass X-API-Key: us_xxxx or Authorization: Bearer us_xxxx",
        )
    try:
        record = validate_key(key)
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))

    return {"key": key, "record": record}


# ─── Routes ───────────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "ok", "service": APP_NAME, "version": APP_VERSION}


@app.get("/v1/plans")
async def list_plans():
    """Return all available subscription plans."""
    return {
        "plans": {
            name: {
                "name": cfg.name,
                "daily_limit": cfg.daily_limit if cfg.daily_limit != -1 else "unlimited",
                "results_per_query": cfg.results_per_query,
                "semantic_search": cfg.semantic_search,
                "realtime_news": cfg.realtime_news,
                "image_search": cfg.image_search,
                "price_usd_per_month": cfg.price_usd_per_month,
                "features": cfg.features,
            }
            for name, cfg in PLANS.items()
        }
    }


@app.post("/v1/search")
async def search_post(
    body: SearchRequest,
    auth: dict = Depends(get_api_key),
):
    """
    🚀 UltraSearch — main search endpoint.

    Pass your API key in the `X-API-Key` header.
    """
    plan_cfg = PLANS[auth["record"]["plan"]]

    # Enforce plan limits on result count + feature flags
    num = min(body.num_results, plan_cfg.results_per_query)
    semantic = body.semantic and plan_cfg.semantic_search

    result = await do_search(
        query=body.query,
        num_results=num,
        use_cache=body.use_cache,
        semantic=semantic,
        news_only=body.news_only,
    )
    return _format_response(result)


@app.get("/v1/search")
async def search_get(
    q: str = Query(..., min_length=1, description="Search query"),
    n: int = Query(10, ge=1, le=100, description="Number of results"),
    auth: dict = Depends(get_api_key),
):
    """GET alias for search. Use POST for full options."""
    plan_cfg = PLANS[auth["record"]["plan"]]
    num = min(n, plan_cfg.results_per_query)
    result = await do_search(query=q, num_results=num)
    return _format_response(result)


@app.post("/v1/keys", status_code=201)
async def create_api_key(body: KeyCreateRequest):
    """
    Provision a new API key.

    ⚠️ The `plain_key` in the response is shown **once only** — store it safely.
    """
    try:
        record = create_key(
            user_id=body.user_id,
            plan=body.plan,
            label=body.label,
        )
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return {
        "message": "API key created. Save the plain_key — it will NOT be shown again.",
        "key": record,
        "plan": PLANS[body.plan].features,
    }


@app.get("/v1/keys")
async def get_keys(user_id: str = Query(..., description="Your user ID")):
    """List all API keys for a user (plain keys are never returned)."""
    return {"keys": list_keys(user_id)}


@app.delete("/v1/keys/{plain_key}")
async def delete_key(plain_key: str):
    """Revoke an API key immediately."""
    success = revoke_key(plain_key)
    if not success:
        raise HTTPException(status_code=404, detail="Key not found")
    return {"message": "Key revoked successfully"}


@app.get("/v1/usage")
async def usage(auth: dict = Depends(get_api_key)):
    """Return usage statistics for the current API key."""
    return get_usage(auth["key"])


# ─── Helpers ─────────────────────────────────────────────────────────────────

def _format_response(result) -> dict:
    return {
        "query": result.query,
        "search_time_ms": result.search_time_ms,
        "cached": result.cached,
        "backends_used": result.backends_used,
        "total_results": result.total_results,
        "results": [
            {
                "title": r.title,
                "url": r.url,
                "snippet": r.snippet,
                "source": r.source,
                "published_date": r.published_date,
                "score": r.score,
                **({"full_content": r.full_content} if r.full_content else {}),
            }
            for r in result.results
        ],
        "metadata": result.metadata,
    }


# ─── Entry point ──────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    from ..core.config import HOST, PORT, WORKERS, LOG_LEVEL
    uvicorn.run(
        "ultrasearch_api.src.api.server:app",
        host=HOST,
        port=PORT,
        workers=WORKERS,
        log_level=LOG_LEVEL,
    )

