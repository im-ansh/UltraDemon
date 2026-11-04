-- UltraDemon Telemetry & Customer Profile Intelligence Engine Schema
-- Migration 0004: PostHog-Competitive Analytics, Visitor Tracking & Autonomous ICP Synthesis

-- ── 1. Granular Analytics & Tracker Events ────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_events (
  event_id           TEXT    PRIMARY KEY,
  project_id         TEXT    NOT NULL,
  distinct_id        TEXT    NOT NULL,
  session_id         TEXT    NOT NULL,
  event_name         TEXT    NOT NULL,
  timestamp          INTEGER NOT NULL,
  url                TEXT    NOT NULL DEFAULT '',
  path               TEXT    NOT NULL DEFAULT '',
  host               TEXT    NOT NULL DEFAULT '',
  referrer           TEXT    NOT NULL DEFAULT '',
  referring_domain   TEXT    NOT NULL DEFAULT '',
  utm_source         TEXT    NOT NULL DEFAULT '',
  utm_medium         TEXT    NOT NULL DEFAULT '',
  utm_campaign       TEXT    NOT NULL DEFAULT '',
  utm_term           TEXT    NOT NULL DEFAULT '',
  utm_content        TEXT    NOT NULL DEFAULT '',
  browser            TEXT    NOT NULL DEFAULT '',
  browser_version    TEXT    NOT NULL DEFAULT '',
  os                 TEXT    NOT NULL DEFAULT '',
  os_version         TEXT    NOT NULL DEFAULT '',
  device_type        TEXT    NOT NULL DEFAULT 'desktop', -- desktop, mobile, tablet
  device_brand       TEXT    NOT NULL DEFAULT '',
  device_model       TEXT    NOT NULL DEFAULT '',
  screen_res         TEXT    NOT NULL DEFAULT '',
  viewport_res       TEXT    NOT NULL DEFAULT '',
  locale             TEXT    NOT NULL DEFAULT '',
  timezone           TEXT    NOT NULL DEFAULT '',
  connection_type    TEXT    NOT NULL DEFAULT '',
  country            TEXT    NOT NULL DEFAULT '',
  city               TEXT    NOT NULL DEFAULT '',
  region             TEXT    NOT NULL DEFAULT '',
  postal_code        TEXT    NOT NULL DEFAULT '',
  latitude           REAL    DEFAULT 0.0,
  longitude          REAL    DEFAULT 0.0,
  colo               TEXT    NOT NULL DEFAULT '',        -- Cloudflare Anycast PoP (e.g. SIN, SFO, IAD)
  asn                INTEGER DEFAULT 0,
  isp                TEXT    NOT NULL DEFAULT '',
  duration_ms        INTEGER NOT NULL DEFAULT 0,
  scroll_depth       INTEGER NOT NULL DEFAULT 0,         -- 0 to 100%
  cwv_lcp            REAL    DEFAULT 0.0,                -- Largest Contentful Paint (ms)
  cwv_cls            REAL    DEFAULT 0.0,                -- Cumulative Layout Shift
  cwv_fid            REAL    DEFAULT 0.0,                -- First Input Delay (ms)
  cwv_inp            REAL    DEFAULT 0.0,                -- Interaction to Next Paint (ms)
  cwv_ttfb           REAL    DEFAULT 0.0,                -- Time to First Byte (ms)
  properties_json    TEXT    NOT NULL DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_events_proj_ts   ON analytics_events(project_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_events_distinct  ON analytics_events(project_id, distinct_id);
CREATE INDEX IF NOT EXISTS idx_events_name      ON analytics_events(project_id, event_name);
CREATE INDEX IF NOT EXISTS idx_events_session   ON analytics_events(project_id, session_id);
CREATE INDEX IF NOT EXISTS idx_events_path      ON analytics_events(project_id, path);
CREATE INDEX IF NOT EXISTS idx_events_country   ON analytics_events(project_id, country);
CREATE INDEX IF NOT EXISTS idx_events_ref_dom   ON analytics_events(project_id, referring_domain);

-- ── 2. Unified Visitor & Customer Profile Records ─────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_visitors (
  project_id                 TEXT    NOT NULL,
  distinct_id                TEXT    NOT NULL,
  first_seen_at              INTEGER NOT NULL,
  last_seen_at               INTEGER NOT NULL,
  total_sessions             INTEGER NOT NULL DEFAULT 1,
  total_events               INTEGER NOT NULL DEFAULT 1,
  total_duration_sec         INTEGER NOT NULL DEFAULT 0,
  primary_country            TEXT    NOT NULL DEFAULT '',
  primary_city               TEXT    NOT NULL DEFAULT '',
  primary_browser            TEXT    NOT NULL DEFAULT '',
  primary_os                 TEXT    NOT NULL DEFAULT '',
  primary_device             TEXT    NOT NULL DEFAULT 'desktop',
  screen_res                 TEXT    NOT NULL DEFAULT '',
  initial_referrer           TEXT    NOT NULL DEFAULT '',
  initial_utm_source         TEXT    NOT NULL DEFAULT '',
  initial_utm_campaign       TEXT    NOT NULL DEFAULT '',
  high_value_actions_count   INTEGER NOT NULL DEFAULT 0,
  customer_traits_json       TEXT    NOT NULL DEFAULT '{}',
  PRIMARY KEY (project_id, distinct_id)
);

CREATE INDEX IF NOT EXISTS idx_visitors_sessions ON analytics_visitors(project_id, total_sessions DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_events   ON analytics_visitors(project_id, total_events DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_lastseen ON analytics_visitors(project_id, last_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_visitors_actions  ON analytics_visitors(project_id, high_value_actions_count DESC);

-- ── 3. Autonomous Ideal Customer Profile (ICP) Reports ───────────────────────
CREATE TABLE IF NOT EXISTS customer_profile_reports (
  report_id                  TEXT    PRIMARY KEY,
  project_id                 TEXT    NOT NULL,
  generated_at               INTEGER NOT NULL,
  timeframe_days             INTEGER NOT NULL DEFAULT 30,
  total_visitors_analyzed    INTEGER NOT NULL DEFAULT 0,
  power_users_cluster_size   INTEGER NOT NULL DEFAULT 0,
  icp_persona_name           TEXT    NOT NULL,
  report_json                TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_icp_reports_proj ON customer_profile_reports(project_id, generated_at DESC);

