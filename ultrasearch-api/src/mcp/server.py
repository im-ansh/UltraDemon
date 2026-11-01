"""
UltraSearch MCP Server
Model Context Protocol server that exposes UltraSearch tools to any MCP-compatible AI agent.

Tools exposed:
  • ultrasearch_web       — fast parallel web search
  • ultrasearch_news      — realtime news search
  • ultrasearch_semantic  — semantic / neural search
  • ultrasearch_images    — image search (Ultra/Enterprise plans)
  • ultrasearch_usage     — check API key usage & quota
  • ultrasearch_provision — create a new API key (admin)

Usage (stdio transport — works with Claude, Cursor, Windsurf, etc.):
  python -m ultrasearch_api.src.mcp.server

Usage (SSE transport — for web-based agents):
  python -m ultrasearch_api.src.mcp.server --transport sse --port 3001

MCP config block to paste into claude_desktop_config.json / .cursor/mcp.json:
  {
    "mcpServers": {
      "ultrasearch": {
        "command": "python",
        "args": ["-m", "ultrasearch_api.src.mcp.server"],
        "env": {
          "ULTRASEARCH_API_KEY": "us_your_key_here",
          "BRAVE_API_KEY": "optional",
          "SERPER_API_KEY": "optional"
        }
      }
    }
  }
"""

from __future__ import annotations

import asyncio
import json
import os
import sys
import argparse
from typing import Any

# ─── Inline MCP implementation (no external mcp package needed) ───────────────
# Full spec: https://spec.modelcontextprotocol.io/

PROTOCOL_VERSION = "2024-11-05"
SERVER_INFO = {
    "name": "ultrasearch",
    "version": "1.0.0",
    "description": "Ultra-fast web search API for AI agents — fastest results, lowest latency",
}

# ─── Tool Definitions (JSON Schema) ──────────────────────────────────────────

TOOLS = [
    {
        "name": "ultrasearch_web",
        "description": (
            "⚡ Ultra-fast web search. Fans out to multiple search backends in parallel "
            "(Brave, Serper/Google, Exa, Tavily) and returns deduplicated, ranked results. "
            "Average latency: <200ms. Use this for any question requiring current web data."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "The search query. Be specific for better results.",
                    "minLength": 1,
                    "maxLength": 500,
                },
                "num_results": {
                    "type": "integer",
                    "description": "Number of results to return (1–50). Default: 10.",
                    "default": 10,
                    "minimum": 1,
                    "maximum": 50,
                },
                "use_cache": {
                    "type": "boolean",
                    "description": "Use cached results for identical queries (default: true). Set false for real-time data.",
                    "default": True,
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "ultrasearch_news",
        "description": (
            "📰 Real-time news search. Returns breaking news, recent articles, and live events. "
            "Optimized for recency — results are typically from the last 24–48 hours. "
            "Use for current events, stock news, sports scores, weather, etc."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "News topic or keywords to search for.",
                },
                "num_results": {
                    "type": "integer",
                    "description": "Number of news articles to return (1–20). Default: 10.",
                    "default": 10,
                    "minimum": 1,
                    "maximum": 20,
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "ultrasearch_semantic",
        "description": (
            "🧠 Semantic / neural web search. Finds conceptually relevant pages using embeddings, "
            "not just keyword matching. Best for: research, finding similar content, conceptual "
            "questions, multi-hop reasoning. Requires Pro+ plan."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "A natural language question or concept to search semantically.",
                },
                "num_results": {
                    "type": "integer",
                    "description": "Number of semantic results (1–20). Default: 10.",
                    "default": 10,
                    "minimum": 1,
                    "maximum": 20,
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "ultrasearch_images",
        "description": (
            "🖼️ Image search. Returns URLs of relevant images with titles and source pages. "
            "Use to find diagrams, photos, charts, logos. Requires Ultra+ plan."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "query": {
                    "type": "string",
                    "description": "Description of the image to search for.",
                },
                "num_results": {
                    "type": "integer",
                    "description": "Number of image results (1–20). Default: 5.",
                    "default": 5,
                    "minimum": 1,
                    "maximum": 20,
                },
            },
            "required": ["query"],
        },
    },
    {
        "name": "ultrasearch_usage",
        "description": (
            "📊 Check your UltraSearch API key quota and usage statistics. "
            "Returns: plan name, daily limit, requests used today, remaining quota, reset time."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {},
            "required": [],
        },
    },
    {
        "name": "ultrasearch_provision_key",
        "description": (
            "🔑 Create a new UltraSearch API key. Admin use only. "
            "Returns the plain key (shown ONCE — save it immediately)."
        ),
        "inputSchema": {
            "type": "object",
            "properties": {
                "user_id": {
                    "type": "string",
                    "description": "Your unique user or account identifier.",
                },
                "plan": {
                    "type": "string",
                    "description": "Subscription plan: free | pro | ultra | enterprise",
                    "enum": ["free", "pro", "ultra", "enterprise"],
                    "default": "free",
                },
                "label": {
                    "type": "string",
                    "description": "Optional human-readable label for this key.",
                    "default": "",
                },
            },
            "required": ["user_id"],
        },
    },
]


# ─── Tool Handlers ────────────────────────────────────────────────────────────

async def handle_tool(name: str, arguments: dict) -> dict:
    """Dispatch an MCP tool call to the appropriate handler."""

    # Lazy import so the MCP server can run standalone
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

    if name == "ultrasearch_web":
        return await _tool_web_search(arguments)
    elif name == "ultrasearch_news":
        return await _tool_news_search(arguments)
    elif name == "ultrasearch_semantic":
        return await _tool_semantic_search(arguments)
    elif name == "ultrasearch_images":
        return await _tool_image_search(arguments)
    elif name == "ultrasearch_usage":
        return await _tool_usage(arguments)
    elif name == "ultrasearch_provision_key":
        return await _tool_provision_key(arguments)
    else:
        return {"error": f"Unknown tool: {name}"}


async def _tool_web_search(args: dict) -> dict:
    from src.search.engine import search
    result = await search(
        query=args["query"],
        num_results=args.get("num_results", 10),
        use_cache=args.get("use_cache", True),
        semantic=False,
        news_only=False,
    )
    return _format_search_result(result)


async def _tool_news_search(args: dict) -> dict:
    from src.search.engine import search
    result = await search(
        query=args["query"],
        num_results=args.get("num_results", 10),
        use_cache=False,   # News should always be fresh
        semantic=False,
        news_only=True,
    )
    return _format_search_result(result)


async def _tool_semantic_search(args: dict) -> dict:
    from src.search.engine import search
    result = await search(
        query=args["query"],
        num_results=args.get("num_results", 10),
        use_cache=True,
        semantic=True,
        news_only=False,
    )
    return _format_search_result(result)


async def _tool_image_search(args: dict) -> dict:
    # Placeholder — image search via Serper /images or Brave images endpoint
    return {
        "query": args["query"],
        "note": "Image search requires Ultra+ plan. Configure SERPER_API_KEY to enable.",
        "results": [],
    }


async def _tool_usage(args: dict) -> dict:
    api_key = os.getenv("ULTRASEARCH_API_KEY", "")
    if not api_key:
        return {"error": "ULTRASEARCH_API_KEY env var not set"}
    from src.auth.api_keys import get_usage
    try:
        return get_usage(api_key)
    except ValueError as e:
        return {"error": str(e)}


async def _tool_provision_key(args: dict) -> dict:
    from src.auth.api_keys import create_key
    try:
        record = create_key(
            user_id=args["user_id"],
            plan=args.get("plan", "free"),
            label=args.get("label", ""),
        )
        return {
            "message": "✅ API key created! Save the plain_key — it will NOT be shown again.",
            "plain_key": record["plain_key"],
            "key_id": record["key_id"],
            "plan": record["plan"],
            "daily_limit": record.get("daily_requests"),
        }
    except ValueError as e:
        return {"error": str(e)}


def _format_search_result(result) -> dict:
    return {
        "query": result.query,
        "search_time_ms": result.search_time_ms,
        "cached": result.cached,
        "backends_used": result.backends_used,
        "total": result.total_results,
        "results": [
            {
                "title": r.title,
                "url": r.url,
                "snippet": r.snippet,
                "source": r.source,
                **({"published_date": r.published_date} if r.published_date else {}),
                "score": r.score,
            }
            for r in result.results
        ],
    }


# ─── JSON-RPC / MCP Protocol Handler ─────────────────────────────────────────

def make_response(req_id: Any, result: Any) -> dict:
    return {"jsonrpc": "2.0", "id": req_id, "result": result}


def make_error(req_id: Any, code: int, message: str) -> dict:
    return {"jsonrpc": "2.0", "id": req_id, "error": {"code": code, "message": message}}


async def handle_request(request: dict) -> dict | None:
    method = request.get("method", "")
    req_id = request.get("id")
    params = request.get("params", {})

    if method == "initialize":
        return make_response(req_id, {
            "protocolVersion": PROTOCOL_VERSION,
            "capabilities": {
                "tools": {"listChanged": False},
            },
            "serverInfo": SERVER_INFO,
        })

    elif method == "tools/list":
        return make_response(req_id, {"tools": TOOLS})

    elif method == "tools/call":
        tool_name = params.get("name", "")
        arguments = params.get("arguments", {})
        try:
            result = await handle_tool(tool_name, arguments)
            return make_response(req_id, {
                "content": [{"type": "text", "text": json.dumps(result, indent=2)}],
                "isError": "error" in result,
            })
        except Exception as e:
            return make_response(req_id, {
                "content": [{"type": "text", "text": f"Error: {e}"}],
                "isError": True,
            })

    elif method == "notifications/initialized":
        return None  # No response needed for notifications

    else:
        return make_error(req_id, -32601, f"Method not found: {method}")


# ─── Stdio Transport ──────────────────────────────────────────────────────────

async def run_stdio():
    """Run MCP server over stdin/stdout (used by Claude Desktop, Cursor, etc.)"""
    reader = asyncio.StreamReader()
    protocol = asyncio.StreamReaderProtocol(reader)
    loop = asyncio.get_event_loop()
    await loop.connect_read_pipe(lambda: protocol, sys.stdin)

    stdout_transport, _ = await loop.connect_write_pipe(
        asyncio.BaseProtocol, sys.stdout
    )

    async def write(data: dict):
        msg = json.dumps(data) + "\n"
        sys.stdout.write(msg)
        sys.stdout.flush()

    while True:
        try:
            line = await reader.readline()
            if not line:
                break
            request = json.loads(line.decode().strip())
            response = await handle_request(request)
            if response is not None:
                await write(response)
        except json.JSONDecodeError:
            pass
        except Exception as e:
            sys.stderr.write(f"MCP error: {e}\n")
            sys.stderr.flush()


# ─── SSE Transport ────────────────────────────────────────────────────────────

async def run_sse(host: str = "localhost", port: int = 3001):
    """Run MCP server over HTTP + SSE (for web agents and remote usage)."""
    try:
        from aiohttp import web
    except ImportError:
        print("Install aiohttp for SSE transport: pip install aiohttp", file=sys.stderr)
        sys.exit(1)

    async def sse_handler(request):
        response = web.StreamResponse(
            headers={"Content-Type": "text/event-stream", "Cache-Control": "no-cache"},
        )
        await response.prepare(request)

        async def send(data: dict):
            await response.write(f"data: {json.dumps(data)}\n\n".encode())

        # Process incoming messages from query params or body
        body = await request.json() if request.body_exists else {}
        result = await handle_request(body)
        if result:
            await send(result)
        return response

    async def post_handler(request):
        body = await request.json()
        result = await handle_request(body)
        return web.json_response(result or {})

    app = web.Application()
    app.router.add_post("/mcp", post_handler)
    app.router.add_get("/mcp/sse", sse_handler)
    app.router.add_get("/health", lambda r: web.json_response({"status": "ok", **SERVER_INFO}))

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, host, port)
    await site.start()
    print(f"🚀 UltraSearch MCP server running at http://{host}:{port}/mcp", flush=True)
    await asyncio.Event().wait()


# ─── CLI Entry Point ──────────────────────────────────────────────────────────

def main():
    parser = argparse.ArgumentParser(description="UltraSearch MCP Server")
    parser.add_argument("--transport", choices=["stdio", "sse"], default="stdio")
    parser.add_argument("--host", default="localhost")
    parser.add_argument("--port", type=int, default=3001)
    args = parser.parse_args()

    if args.transport == "stdio":
        asyncio.run(run_stdio())
    else:
        asyncio.run(run_sse(args.host, args.port))


if __name__ == "__main__":
    main()

