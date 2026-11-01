"""
UltraSearch API — Quick Demo Script
Run this to test everything works without a server.

Usage:
    cd ultrasearch-api
    python demo.py
"""

import asyncio
import sys
import os

# Add project to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from src.auth.api_keys import create_key, validate_key, get_usage
from src.search.engine import search


async def main():
    print("=" * 60)
    print("  ⚡ UltraSearch API — Demo")
    print("=" * 60)

    # ── Step 1: Create an API key ──────────────────────────────────────
    print("\n🔑 Creating API key...")
    record = create_key(user_id="demo-user-001", plan="pro", label="My Demo Key")
    plain_key = record["plain_key"]
    print(f"   Key created: {plain_key}")
    print(f"   Plan: {record['plan']} | Key ID: {record['key_id']}")

    # ── Step 2: Validate the key ──────────────────────────────────────
    print("\n✅ Validating key...")
    validated = validate_key(plain_key)
    print(f"   Valid! User: {validated['user_id']}, Plan: {validated['plan']}")

    # ── Step 3: Check usage ───────────────────────────────────────────
    print("\n📊 Checking usage...")
    usage = get_usage(plain_key)
    print(f"   Daily limit:  {usage['daily_limit']}")
    print(f"   Used today:   {usage['daily_requests']}")
    print(f"   Remaining:    {usage['remaining_today']}")

    # ── Step 4: Run a search (mock mode if no API keys set) ──────────
    print("\n🔍 Running search: 'latest AI agent frameworks 2025'")
    result = await search(
        query="latest AI agent frameworks 2025",
        num_results=5,
        use_cache=False,
    )
    print(f"   Time: {result.search_time_ms}ms | Backends: {result.backends_used}")
    print(f"   Results: {result.total_results}")
    for i, r in enumerate(result.results, 1):
        print(f"\n   [{i}] {r.title}")
        print(f"       {r.url}")
        print(f"       {r.snippet[:100]}...")

    print("\n" + "=" * 60)
    print("  ✅ All systems nominal! Start the server with:")
    print("     uvicorn src.api.server:app --reload --port 8000")
    print("\n  Or the MCP server with:")
    print("     python -m src.mcp.server --transport stdio")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(main())

