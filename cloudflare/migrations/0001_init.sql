-- UltraSearch D1 Database Schema
-- Run: wrangler d1 migrations apply ultrasearch-db

-- ── API Keys ──────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS api_keys (
  hashed_key  TEXT    PRIMARY KEY,
  key_id      TEXT    NOT NULL UNIQUE,
  user_id     TEXT    NOT NULL,
  plan        TEXT    NOT NULL DEFAULT 'free',
  label       TEXT    NOT NULL DEFAULT '',
  created_at  INTEGER NOT NULL,
  revoked     INTEGER NOT NULL DEFAULT 0  -- 0 = active, 1 = revoked
);

CREATE INDEX IF NOT EXISTS idx_keys_user   ON api_keys(user_id);
CREATE INDEX IF NOT EXISTS idx_keys_active ON api_keys(revoked, plan);

-- ── Daily Usage Counters ───────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS usage (
  hashed_key    TEXT    NOT NULL,
  date          TEXT    NOT NULL,   -- YYYY-MM-DD UTC
  request_count INTEGER NOT NULL DEFAULT 0,
  last_used_at  INTEGER NOT NULL,
  PRIMARY KEY (hashed_key, date)
);

CREATE INDEX IF NOT EXISTS idx_usage_key ON usage(hashed_key);

-- ── Search Index (lightweight — heavy index stored in R2) ─────────────────────
CREATE TABLE IF NOT EXISTS documents (
  doc_id      TEXT    PRIMARY KEY,
  url         TEXT    NOT NULL UNIQUE,
  title       TEXT    NOT NULL DEFAULT '',
  description TEXT    NOT NULL DEFAULT '',
  snippet     TEXT    NOT NULL DEFAULT '',
  word_count  INTEGER NOT NULL DEFAULT 0,
  pagerank    REAL    NOT NULL DEFAULT 0.5,
  crawled_at  INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_docs_crawled  ON documents(crawled_at DESC);
CREATE INDEX IF NOT EXISTS idx_docs_pagerank ON documents(pagerank DESC);

-- ── Inverted Index (term → doc mapping) ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS postings (
  term        TEXT    NOT NULL,
  doc_id      TEXT    NOT NULL,
  tf          INTEGER NOT NULL DEFAULT 1,
  title_match INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (term, doc_id)
);

CREATE INDEX IF NOT EXISTS idx_postings_term ON postings(term);

-- ── Plans reference ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS plans (
  plan_id             TEXT    PRIMARY KEY,
  daily_limit         INTEGER NOT NULL,  -- -1 = unlimited
  results_per_query   INTEGER NOT NULL,
  semantic_search     INTEGER NOT NULL DEFAULT 0,
  realtime_news       INTEGER NOT NULL DEFAULT 0,
  image_search        INTEGER NOT NULL DEFAULT 0,
  price_usd_per_month REAL    NOT NULL DEFAULT 0.0
);

INSERT OR IGNORE INTO plans VALUES ('free',       100,    5,   0, 0, 0,   0.0);
INSERT OR IGNORE INTO plans VALUES ('pro',        10000,  20,  1, 1, 0,  29.0);
INSERT OR IGNORE INTO plans VALUES ('ultra',      100000, 50,  1, 1, 1,  99.0);
INSERT OR IGNORE INTO plans VALUES ('enterprise', -1,     100, 1, 1, 1, 499.0);
