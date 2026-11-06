-- Migration 0007: API Key Real-Time Usage & Service-Specific Daily Metric Tracking
-- Enables granular per-key daily tracking for search, memory, and metrics, plus combined totals.

-- 1. Detailed request event logging per API key
CREATE TABLE IF NOT EXISTS api_key_usage_events (
  event_id     INTEGER PRIMARY KEY AUTOINCREMENT,
  hashed_key   TEXT NOT NULL,
  key_id       TEXT,
  service      TEXT NOT NULL, -- 'search' | 'memory' | 'metrics' | 'crawler' | 'other'
  path         TEXT NOT NULL,
  method       TEXT NOT NULL,
  status       INTEGER NOT NULL DEFAULT 200,
  latency_ms   INTEGER NOT NULL DEFAULT 0,
  timestamp    INTEGER NOT NULL,
  date         TEXT NOT NULL    -- YYYY-MM-DD UTC
);

CREATE INDEX IF NOT EXISTS idx_usage_events_key_date ON api_key_usage_events(hashed_key, date);
CREATE INDEX IF NOT EXISTS idx_usage_events_date ON api_key_usage_events(date);
CREATE INDEX IF NOT EXISTS idx_usage_events_time ON api_key_usage_events(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_usage_events_service ON api_key_usage_events(service, date);

-- 2. Add service breakdown columns to usage summary table
ALTER TABLE usage ADD COLUMN search_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usage ADD COLUMN memory_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usage ADD COLUMN metrics_count INTEGER NOT NULL DEFAULT 0;
ALTER TABLE usage ADD COLUMN crawler_count INTEGER NOT NULL DEFAULT 0;

