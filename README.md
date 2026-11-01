<h1 align="center">⚡ UltraSearch</h1>
<p align="center">
  <strong>The Sovereign Web Search Engine & API for AI Agents</strong><br/>
  Sub-50ms latency · Autonomous Edge Web Crawler · Cloudflare D1 BM25 Index · MCP Native
</p>

<p align="center">
  <a href="https://ultrasearch-api.aaronvanoss.workers.dev"><img src="https://img.shields.io/badge/Live_Console-Online-success?style=for-the-badge&logo=cloudflare" alt="Live Console" /></a>
  <a href="https://ultrasearch-api.aaronvanoss.workers.dev/openapi.json"><img src="https://img.shields.io/badge/OpenAPI-3.1-blue?style=for-the-badge" alt="OpenAPI" /></a>
  <a href="https://spec.modelcontextprotocol.io"><img src="https://img.shields.io/badge/MCP-2024--11--05-purple?style=for-the-badge" alt="MCP" /></a>
  <a href="https://github.com/im-ansh/UltraDemon/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge" alt="License" /></a>
</p>

---

## 🌐 Live Web Platform & Developer Console

Explore the interactive live platform deployed on Cloudflare Workers edge:

👉 **[https://ultrasearch-api.aaronvanoss.workers.dev](https://ultrasearch-api.aaronvanoss.workers.dev)**

- **Interactive Playground**: Test Mode 1 (Instant), Mode 2 (Standard), and Mode 3 (Deep Research) in real-time.
- **Developer Console**: Provision, copy, monitor, and revoke API keys with real-time rate limit tracking.
- **Edge Crawler Controller**: Tell the crawler to fetch, extract, and index any live URL into Cloudflare D1.
- **OpenAPI 3.1 Spec**: Ready for Postman, Swagger, and agent tool auto-discovery at [`/openapi.json`](https://ultrasearch-api.aaronvanoss.workers.dev/openapi.json).
- **Agent Function Tools**: OpenAI & Anthropic compatible tool definitions at [`/v1/tools`](https://ultrasearch-api.aaronvanoss.workers.dev/v1/tools).

---

## 🚀 Key Architectural Advantages

Unlike traditional search API aggregators that wrap Google or Brave, **UltraSearch is 100% self-hosted and autonomous**:

1. **Sub-40ms Edge Search**: SQLite FTS5 with BM25 ranking inside Cloudflare D1, replicated across 330+ edge cities.
2. **Sub-5ms Hot Cache**: Cloudflare KV hot query cache for high-frequency agentic loops.
3. **Autonomous Web Crawler**: Built with streaming `HTMLRewriter` (C++ speed), outlink discovery, and near-duplicate SimHash filtering.
4. **Adaptive 3-Mode Execution**:
   - **Mode 1 (Instant, <50ms)**: Direct BM25 keyword matching with highlight snippets.
   - **Mode 2 (Standard, 100–300ms)**: BM25 matching + on-demand domain exploration & re-ranking.
   - **Mode 3 (Deep Research, 1–3s)**: Multi-query expansion, multi-hop evidence retrieval, and structured synthesis with citations.
5. **Full MCP Server**: Zero-setup integration for Claude Desktop, Cursor, Windsurf, LangChain, AutoGen, and CrewAI.

---

## 🔌 API Endpoints

All endpoints support `X-API-Key: us_xxxx` and `Authorization: Bearer us_xxxx`.

| Endpoint | Method | Description |
| :--- | :--- | :--- |
| `/` | `GET` | Interactive Landing Page & Developer Console (HTML) / System Info (JSON) |
| `/v1/search` | `POST` / `GET` | Execute autonomous BM25 web search across the index |
| `/v1/keys` | `POST` / `GET` / `DELETE` | Provision, list, and revoke API keys |
| `/v1/usage` | `GET` | Real-time usage stats, daily limit, and remaining quota |
| `/v1/crawl` | `POST` | Trigger instant crawling and indexing of any URL |
| `/v1/crawler/stats` | `GET` | Check indexed document counts, word counts, and queue health |
| `/mcp` | `POST` & `GET /mcp/sse` | Model Context Protocol server (HTTP & SSE streaming) |
| `/v1/tools` | `GET` | OpenAI & Anthropic compatible function calling schema |
| `/openapi.json` | `GET` | Complete OpenAPI 3.1 specification |

---

## 💻 Quick Code Examples

### 1. cURL
```bash
curl -X POST "https://ultrasearch-api.aaronvanoss.workers.dev/v1/search" \
  -H "Content-Type: application/json" \
  -H "X-API-Key: us_your_key_here" \
  -d '{"query": "What is Python?", "num_results": 5, "mode": 1}'
```

### 2. Python
```python
import requests

resp = requests.post(
    "https://ultrasearch-api.aaronvanoss.workers.dev/v1/search",
    headers={"X-API-Key": "us_your_key_here"},
    json={"query": "Quantum computing breakthroughs", "num_results": 5, "mode": 2}
)
print(resp.json())
```

### 3. TypeScript / Node.js
```typescript
const response = await fetch("https://ultrasearch-api.aaronvanoss.workers.dev/v1/search", {
  method: "POST",
  headers: {
    "X-API-Key": "us_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: "Cloudflare Workers D1 architecture",
    num_results: 5,
    mode: 1
  })
});

const data = await response.json();
console.log(data);
```

### 4. Claude Desktop & Cursor MCP Config

Paste this into `claude_desktop_config.json` or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ultrasearch": {
      "url": "https://ultrasearch-api.aaronvanoss.workers.dev/mcp",
      "headers": {
        "X-API-Key": "us_your_key_here"
      }
    }
  }
}
```

---

## 🛠️ Deploying to Your Own Cloudflare Account

```bash
cd cloudflare
npm install
npx wrangler login

# 1. Apply D1 Database Migrations (creates FTS5 tables & seed knowledge)
npx wrangler d1 migrations apply ultrasearch-db --remote

# 2. Deploy to Cloudflare Edge
npx wrangler deploy
```

---

## 📁 Repository Structure

```
.
├── cloudflare/                  # 🌐 100% Autonomous Cloudflare Edge Deployment
│   ├── src/
│   │   ├── index.ts             # Main router & Cron Crawler scheduler
│   │   ├── ui/
│   │   │   └── landing.ts       # Developer Console & Landing Page SPA
│   │   ├── lib/
│   │   │   ├── crawler.ts       # Edge Web Crawler (HTMLRewriter, link extractor)
│   │   │   ├── search-engine.ts # SQLite FTS5 BM25 Engine & Query Classifier
│   │   │   ├── api-keys.ts      # Key provisioning, SHA-256 hashing, usage
│   │   │   ├── auth.ts          # Auth middleware & rate limiter
│   │   │   └── cache.ts         # Cloudflare KV cache (<5ms hits)
│   │   └── routes/
│   │       ├── search.ts        # POST/GET /v1/search
│   │       ├── keys.ts          # /v1/keys & /v1/usage
│   │       ├── crawler.ts       # POST /v1/crawl & GET /v1/crawler/stats
│   │       ├── mcp.ts           # MCP server (HTTP & SSE)
│   │       └── openapi.ts       # OpenAPI 3.1 & /v1/tools
│   ├── migrations/
│   │   └── 0001_init.sql        # D1 FTS5 Schema, Triggers, & Starter Corpus
│   ├── package.json             # Wrangler v4 + Hono
│   └── wrangler.toml            # Cloudflare bindings (D1, KV, Cron)
└── ultrasearch-api/             # 🐍 Local Python Async Crawler & Index Engine
```

---

## 📄 License

MIT © 2026 Ansh Bhardwaj

