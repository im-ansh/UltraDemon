-- UltraSearch Autonomous Search Engine & Web Index Schema
-- Native BM25 full-text indexing via SQLite FTS5 in Cloudflare D1
-- Zero external API dependencies (100% self-hosted)

-- ── 1. API Keys & Authorization ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_keys (
  hashed_key  TEXT    PRIMARY KEY,
  key_id      TEXT    NOT NULL UNIQUE,
  user_id     TEXT    NOT NULL,
  plan        TEXT    NOT NULL DEFAULT 'free',
  label       TEXT    NOT NULL DEFAULT '',
  created_at  INTEGER NOT NULL,
  revoked     INTEGER NOT NULL DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_keys_user   ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_keys_active ON api_keys(revoked, plan);

-- ── 2. Daily Rate Limiting & Analytics ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage (
  hashed_key    TEXT    NOT NULL,
  date          TEXT    NOT NULL,   -- YYYY-MM-DD UTC
  request_count INTEGER NOT NULL DEFAULT 0,
  last_used_at  INTEGER NOT NULL,
  PRIMARY KEY (hashed_key, date)
);

CREATE INDEX IF NOT EXISTS idx_usage_key ON usage(hashed_key);

-- ── 3. The Web Index: Documents Table ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS documents (
  doc_id          TEXT    PRIMARY KEY,
  url             TEXT    NOT NULL UNIQUE,
  domain          TEXT    NOT NULL,
  title           TEXT    NOT NULL DEFAULT '',
  description     TEXT    NOT NULL DEFAULT '',
  snippet         TEXT    NOT NULL DEFAULT '',
  content         TEXT    NOT NULL DEFAULT '',
  word_count      INTEGER NOT NULL DEFAULT 0,
  pagerank        REAL    NOT NULL DEFAULT 0.5,
  simhash         TEXT    NOT NULL DEFAULT '',
  crawled_at      INTEGER NOT NULL,
  last_indexed_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_docs_domain   ON documents(domain);
CREATE INDEX IF NOT EXISTS idx_docs_crawled  ON documents(crawled_at DESC);
CREATE INDEX IF NOT EXISTS idx_docs_pagerank ON documents(pagerank DESC);

-- ── 4. Full-Text Search Virtual Table (FTS5 with BM25) ────────────────────────
CREATE VIRTUAL TABLE IF NOT EXISTS documents_fts USING fts5(
  title,
  description,
  snippet,
  content,
  content='documents',
  content_rowid='rowid',
  tokenize='porter unicode61'
);

-- Triggers to keep FTS5 synchronized with documents table
CREATE TRIGGER IF NOT EXISTS docs_ai AFTER INSERT ON documents BEGIN
  INSERT INTO documents_fts(rowid, title, description, snippet, content)
  VALUES (new.rowid, new.title, new.description, new.snippet, new.content);
END;

CREATE TRIGGER IF NOT EXISTS docs_ad AFTER DELETE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, title, description, snippet, content)
  VALUES ('delete', old.rowid, old.title, old.description, old.snippet, old.content);
END;

CREATE TRIGGER IF NOT EXISTS docs_au AFTER UPDATE ON documents BEGIN
  INSERT INTO documents_fts(documents_fts, rowid, title, description, snippet, content)
  VALUES ('delete', old.rowid, old.title, old.description, old.snippet, old.content);
  INSERT INTO documents_fts(rowid, title, description, snippet, content)
  VALUES (new.rowid, new.title, new.description, new.snippet, new.content);
END;

-- ── 5. Crawler URL Frontier & Task Queue ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS crawl_queue (
  url             TEXT    PRIMARY KEY,
  domain          TEXT    NOT NULL,
  depth           INTEGER NOT NULL DEFAULT 0,
  priority        REAL    NOT NULL DEFAULT 1.0,
  status          TEXT    NOT NULL DEFAULT 'pending', -- pending, crawling, completed, failed
  discovered_from TEXT,
  error           TEXT,
  added_at        INTEGER NOT NULL,
  crawled_at      INTEGER
);

CREATE INDEX IF NOT EXISTS idx_crawl_status ON crawl_queue(status, priority DESC, depth ASC);
CREATE INDEX IF NOT EXISTS idx_crawl_domain ON crawl_queue(domain);

-- ── 6. Domain Authority & Crawl Politeness ───────────────────────────────────
CREATE TABLE IF NOT EXISTS domain_metadata (
  domain           TEXT    PRIMARY KEY,
  backlink_count   INTEGER NOT NULL DEFAULT 0,
  last_crawled_at  INTEGER NOT NULL DEFAULT 0,
  crawl_delay_ms   INTEGER NOT NULL DEFAULT 1000,
  robots_disallowed INTEGER NOT NULL DEFAULT 0
);

-- ── 7. Subscription Plans ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plans (
  plan_id             TEXT    PRIMARY KEY,
  daily_limit         INTEGER NOT NULL,  -- -1 = unlimited
  results_per_query   INTEGER NOT NULL,
  semantic_search     INTEGER NOT NULL DEFAULT 0,
  realtime_news       INTEGER NOT NULL DEFAULT 0,
  image_search        INTEGER NOT NULL DEFAULT 0,
  price_usd_per_month REAL    NOT NULL DEFAULT 0.0
);

INSERT OR IGNORE INTO plans VALUES ('free',       100,    10,  1, 1, 0,   0.0);
INSERT OR IGNORE INTO plans VALUES ('pro',        10000,  25,  1, 1, 0,  29.0);
INSERT OR IGNORE INTO plans VALUES ('ultra',      100000, 50,  1, 1, 1,  99.0);
INSERT OR IGNORE INTO plans VALUES ('enterprise', -1,     100, 1, 1, 1, 499.0);

-- ── 8. Starter Seed Corpus (Real foundational web index) ─────────────────────
INSERT OR IGNORE INTO documents (doc_id, url, domain, title, description, snippet, content, word_count, pagerank, crawled_at, last_indexed_at)
VALUES
(
  'seed-python-org',
  'https://www.python.org',
  'python.org',
  'Welcome to Python.org',
  'The official home of the Python Programming Language.',
  'Python is a high-level, general-purpose programming language. Its design philosophy emphasizes code readability with the use of significant indentation. Python is dynamically typed and garbage-collected.',
  'Python is an easy to learn, powerful programming language. It has efficient high-level data structures and a simple but effective approach to object-oriented programming. Python elegant syntax and dynamic typing, together with its interpreted nature, make it an ideal language for scripting and rapid application development in many areas on most platforms. Used widely for artificial intelligence, machine learning, data science, web development with Django and FastAPI.',
  120,
  1.0,
  1730457600000,
  1730457600000
),
(
  'seed-cloudflare-workers',
  'https://workers.cloudflare.com',
  'cloudflare.com',
  'Cloudflare Workers — Serverless Edge Computing Platform',
  'Deploy serverless code instantly across the globe to give it exceptional performance, reliability, and scale.',
  'Build serverless applications and deploy on Cloudflare global edge network. Ultra-low latency, 0ms cold starts, D1 SQL databases, Vectorize vector search, and KV storage in 330+ cities worldwide.',
  'Cloudflare Workers provides a serverless execution environment that allows you to create entirely new applications or augment existing ones without configuring or maintaining infrastructure. Powered by V8 isolates, Workers achieve sub-5ms cold starts globally. Includes native D1 SQLite database, KV key-value store, Vectorize vector database, and Workers AI for running machine learning models at the edge.',
  150,
  0.98,
  1730457600000,
  1730457600000
),
(
  'seed-ai-history',
  'https://en.wikipedia.org/wiki/History_of_artificial_intelligence',
  'wikipedia.org',
  'History of Artificial Intelligence — Wikipedia',
  'The history of artificial intelligence began in antiquity, with myths and stories of artificial beings endowed with intelligence.',
  'The history of artificial intelligence began in antiquity. The seeds of modern AI were planted by classical philosophers who attempted to describe the process of human thinking. The field of AI research was founded at a workshop at Dartmouth College in 1956.',
  'The Dartmouth workshop in 1956 was attended by John McCarthy, Marvin Minsky, Nathaniel Rochester, and Claude Shannon. In the 2010s, deep learning, neural networks, and GPUs brought dramatic advances in image classification, natural language processing, and speech recognition, leading to large language models like GPT, Claude, and Gemini in the 2020s.',
  180,
  0.95,
  1730457600000,
  1730457600000
),
(
  'seed-quantum-computing',
  'https://en.wikipedia.org/wiki/Quantum_computing',
  'wikipedia.org',
  'Quantum Computing — Wikipedia',
  'Quantum computing is a rapidly-emerging technology that harnesses the laws of quantum mechanics to solve problems too complex for classical computers.',
  'Quantum computing is a type of computation whose operations can harness the phenomena of quantum mechanics, such as superposition, interference, and entanglement. Devices that perform quantum computations are known as quantum computers.',
  'Unlike classical computers which encode information into binary bits (either 0 or 1), quantum computers calculate with qubits which can exist in superpositions of states. Shor algorithm can factor large integers exponentially faster than known classical algorithms, and Grover algorithm provides quadratic speedup for unstructured search. Leading systems are being developed by IBM, Google, Rigetti, and Quantinuum.',
  190,
  0.94,
  1730457600000,
  1730457600000
),
(
  'seed-fastapi',
  'https://fastapi.tiangolo.com',
  'fastapi.tiangolo.com',
  'FastAPI framework, high performance, easy to learn, fast to code',
  'FastAPI is a modern, fast (high-performance), web framework for building APIs with Python 3.8+ based on standard Python type hints.',
  'FastAPI framework, high performance, easy to learn, fast to code, ready for production. One of the fastest Python frameworks available, on par with NodeJS and Go. Automatic interactive API documentation with Swagger UI.',
  'FastAPI is built on Starlette for web parts and Pydantic for data validation. Features include automatic data validation, serialization, fast async execution with ASGI, and native OpenAPI generation. Used extensively by AI agent frameworks and modern microservices.',
  130,
  0.92,
  1730457600000,
  1730457600000
),
(
  'seed-mcp-spec',
  'https://spec.modelcontextprotocol.io',
  'modelcontextprotocol.io',
  'Model Context Protocol (MCP) Specification',
  'An open protocol that enables seamless integration between LLM applications and external data sources and tools.',
  'Model Context Protocol (MCP) is an open standard designed to enable AI assistants and agents to securely connect to external tools, data repositories, and prompt templates across different systems.',
  'MCP standardizes how applications provide context to LLMs. It defines client-host-server architectures, tool definitions with JSON Schema, resource templates, and prompt workflows. Supported by Claude Desktop, Cursor, Windsurf, and agentic platforms.',
  140,
  0.91,
  1730457600000,
  1730457600000
);

-- Seed initial frontier URLs to crawl
INSERT OR IGNORE INTO crawl_queue (url, domain, depth, priority, status, added_at)
VALUES
('https://news.ycombinator.com', 'news.ycombinator.com', 0, 1.0, 'pending', 1730457600000),
('https://en.wikipedia.org/wiki/Portal:Current_events', 'wikipedia.org', 0, 0.9, 'pending', 1730457600000),
('https://arxiv.org/list/cs.AI/recent', 'arxiv.org', 0, 0.9, 'pending', 1730457600000),
('https://docs.python.org/3/', 'python.org', 0, 0.8, 'pending', 1730457600000),
('https://developer.mozilla.org/en-US/', 'developer.mozilla.org', 0, 0.8, 'pending', 1730457600000);
