<h1 align="center">⚡ UltraSearch API</h1>
<p align="center">
  <strong>The fastest web search API built for AI agents & LLM pipelines</strong><br/>
  Own web index · BM25 ranking · Adaptive 3-mode search · Full MCP server
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.11+-blue?logo=python" />
  <img src="https://img.shields.io/badge/FastAPI-0.115-green?logo=fastapi" />
  <img src="https://img.shields.io/badge/MCP-2024--11--05-purple" />
  <img src="https://img.shields.io/badge/License-MIT-yellow" />
</p>

---

## What is UltraSearch?

UltraSearch is an **ultra-fast web search API** designed specifically for AI agents, LLM pipelines, and autonomous systems. It combines:

- ⚡ **Parallel fan-out** across Brave, Serper, Exa, and Tavily — races all backends and returns the fastest winner
- 🕷️ **Own web crawler** — builds your own index with BM25 ranking, PageRank, and SimHash deduplication
- 🧠 **Adaptive 3-mode engine** — automatically classifies every query and picks the right search depth
- 🔌 **Full MCP server** — plug directly into Claude, Cursor, Windsurf, or any MCP-compatible agent

---

## Adaptive Search Modes

| Mode | Latency Target | When it triggers | What it does |
|------|---------------|-----------------|--------------|
| **1 — Instant** | 50–150ms | Simple factual queries: "What is Python?", "Capital of Japan" | Own index BM25 lookup only |
| **2 — Standard** | 200–500ms | Moderate: "Compare Python vs JS", "History of AI" | Own index + fastest external API, merged & re-ranked |
| **3 — Deep Research** | 1–5s+ | Complex: "Write analysis of quantum computing", "Compare 20 companies" | Multi-query expansion, all sources, full-page extraction, synthesis |

The classifier runs in **< 1ms** and has been tested at **9/9 accuracy** on representative queries.

---

## Quick Start

```bash
git clone https://github.com/aaronvanoss/Ultrademon.git
cd Ultrademon/ultrasearch-api

# Install dependencies
pip install -r requirements.txt

# Copy env and add your API keys
cp .env.example .env

# Run the demo (works without API keys — uses mock mode)
python demo.py

# Start the REST API
uvicorn src.api.server:app --reload --port 8000

# Start the MCP server
python -m src.mcp.server
```

---

## REST API

### Create an API Key

```bash
curl -X POST http://localhost:8000/v1/keys \
  -H "Content-Type: application/json" \
  -d '{"user_id": "you", "plan": "pro", "label": "My key"}'
```

### Search

```bash
curl -X POST http://localhost:8000/v1/search \
  -H "X-API-Key: us_your_key_here" \
  -H "Content-Type: application/json" \
  -d '{"query": "latest AI agent frameworks 2025", "num_results": 10}'
```

### Check Usage

```bash
curl http://localhost:8000/v1/usage -H "X-API-Key: us_your_key_here"
```

Interactive docs: `http://localhost:8000/docs`

---

## MCP Server (for AI Agents)

Add to `claude_desktop_config.json` or `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "ultrasearch": {
      "command": "python",
      "args": ["-m", "src.mcp.server"],
      "cwd": "/path/to/ultrasearch-api",
      "env": {
        "ULTRASEARCH_API_KEY": "us_your_key_here",
        "BRAVE_API_KEY": "optional",
        "SERPER_API_KEY": "optional"
      }
    }
  }
}
```

### Available MCP Tools

| Tool | Description |
|------|-------------|
| `ultrasearch_web` | ⚡ Ultra-fast parallel web search |
| `ultrasearch_news` | 📰 Real-time news (cache bypassed) |
| `ultrasearch_semantic` | 🧠 Neural/semantic search (Pro+) |
| `ultrasearch_images` | 🖼️ Image search (Ultra+) |
| `ultrasearch_usage` | 📊 Check quota & usage |
| `ultrasearch_provision_key` | 🔑 Create new API keys |

---

## Own Web Crawler & Index

Build your own search index — no dependency on external APIs:

```bash
# Seed with high-quality starter URLs (Wikipedia, HN, arXiv, Reuters...)
python -m src.distributed.jobs seed

# Start crawling (50 concurrent workers)
python -m src.distributed.jobs crawl --seed --workers 50 --max-pages 1000000

# Compute PageRank from the link graph
python -m src.distributed.jobs pagerank

# Check index stats
python -m src.distributed.jobs stats

# Test adaptive search
python -m src.distributed.jobs test --query "What is machine learning?"
```

### Crawler Features
- 🔍 **BM25 ranking** — industry-standard relevance scoring (same as Elasticsearch)
- 📊 **Iterative PageRank** — authority signal from the link graph
- 🔁 **SimHash deduplication** — 64-bit fingerprints, catches near-duplicate pages
- 🚫 **Spam detection** — heuristic scoring, keyword stuffing, suspicious TLDs
- 🤖 **robots.txt respect** — fetches and caches per domain, applies crawl delays
- ⏱️ **Politeness** — 1 req/domain/sec by default
- 💾 **Persistent frontier** — SQLite-backed, survives restarts
- 🌸 **Bloom filter** — 50M URL deduplication in ~12MB RAM

---

## Pricing Plans

| Plan | Price | Requests/day | Results/query | Semantic | Images |
|------|-------|-------------|---------------|----------|--------|
| Free | $0 | 100 | 5 | ❌ | ❌ |
| Pro | $29/mo | 10,000 | 20 | ✅ | ❌ |
| Ultra | $99/mo | 100,000 | 50 | ✅ | ✅ |
| Enterprise | $499/mo | Unlimited | 100 | ✅ | ✅ |

---

## Project Structure

```
ultrasearch-api/
├── src/
│   ├── core/
│   │   └── config.py          # Plans, rate limits, env vars
│   ├── auth/
│   │   └── api_keys.py        # Key gen (us_xxxx), SHA-256, validation, revocation
│   ├── search/
│   │   └── engine.py          # Parallel fan-out (Brave + Serper + Exa + Tavily)
│   ├── api/
│   │   └── server.py          # FastAPI REST: /v1/search, /v1/keys, /v1/usage
│   ├── mcp/
│   │   └── server.py          # MCP server — 6 tools, stdio + SSE transports
│   ├── crawler/
│   │   ├── frontier.py        # URL priority queue + 50M Bloom filter
│   │   ├── robots.py          # robots.txt parser + 24h LRU cache
│   │   ├── dedup.py           # SimHash + spam detection
│   │   └── crawler.py         # 50-worker async crawler
│   ├── index/
│   │   ├── index.py           # BM25 inverted index (SQLite WAL)
│   │   └── pagerank.py        # Iterative PageRank
│   ├── adaptive/
│   │   ├── classifier.py      # Query mode classifier (9/9 accuracy, <1ms)
│   │   └── engine.py          # 3-mode adaptive search orchestrator
│   └── distributed/
│       └── jobs.py            # CLI: seed / crawl / pagerank / stats / test
├── demo.py                    # Quickstart demo (runs without API keys)
├── requirements.txt
├── pyproject.toml
└── .env.example
```

---

## Architecture

```
AI Agent / Claude / Cursor
        │
        ▼  MCP tools/call OR REST /v1/search
┌─────────────────────────────┐
│     Adaptive Search Engine  │
│   Classifier → Mode 1/2/3   │
└────────┬────────────────────┘
         │
    ┌────┴──────────────┐
    │                   │
Own Index          External APIs
(BM25+PageRank)  (Brave/Serper/Exa/Tavily)
    │              parallel fan-out
    └────┬──────────────┘
         │ dedup + re-rank
         ▼
    Redis Cache (60s TTL)
         │
         ▼
    JSON Response
```

---

## Roadmap

- [x] REST API with API key auth
- [x] MCP server (stdio + SSE)
- [x] Parallel fan-out search engine
- [x] Own web crawler (50 workers, robots.txt, politeness)
- [x] BM25 inverted index
- [x] PageRank computation
- [x] SimHash near-duplicate detection
- [x] Spam filtering
- [x] Adaptive 3-mode search engine
- [x] Query complexity classifier
- [ ] **Cloudflare Workers + D1 + KV edge deployment** ← Next
- [ ] Playwright for JS-heavy pages
- [ ] Streaming search results
- [ ] LLM-powered answer synthesis (Mode 3)
- [ ] Dashboard UI

---

## License

MIT © 2026 Ansh Bhardwaj
