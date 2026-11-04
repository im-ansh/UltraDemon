-- UltraDemon Migration 0005: Insane Hardware, Kinetic Idle Telemetry & VIP Client IP Tracing Engine

-- ── 1. Add Insane Micro-Metrics to analytics_events ───────────────────────────
ALTER TABLE analytics_events ADD COLUMN client_ip              TEXT    NOT NULL DEFAULT '';
ALTER TABLE analytics_events ADD COLUMN is_vip_traced          INTEGER NOT NULL DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN vip_target_label       TEXT    NOT NULL DEFAULT '';
ALTER TABLE analytics_events ADD COLUMN active_time_ms         INTEGER NOT NULL DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN idle_time_ms           INTEGER NOT NULL DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN idle_ratio_pct         INTEGER NOT NULL DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN mouse_moves_count      INTEGER NOT NULL DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN clicks_count           INTEGER NOT NULL DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN rage_clicks_count      INTEGER NOT NULL DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN tab_switches_count     INTEGER NOT NULL DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN primary_activity       TEXT    NOT NULL DEFAULT 'navigating';
ALTER TABLE analytics_events ADD COLUMN hardware_concurrency   INTEGER DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN device_memory_gb       REAL    DEFAULT 0.0;
ALTER TABLE analytics_events ADD COLUMN gpu_renderer           TEXT    NOT NULL DEFAULT '';
ALTER TABLE analytics_events ADD COLUMN battery_level          REAL    DEFAULT -1.0;
ALTER TABLE analytics_events ADD COLUMN battery_charging       INTEGER DEFAULT -1;
ALTER TABLE analytics_events ADD COLUMN pixel_ratio            REAL    DEFAULT 1.0;
ALTER TABLE analytics_events ADD COLUMN color_depth            INTEGER DEFAULT 24;
ALTER TABLE analytics_events ADD COLUMN hdr_supported          INTEGER DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN touch_points           INTEGER DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN dark_mode              INTEGER DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN reduced_motion         INTEGER DEFAULT 0;
ALTER TABLE analytics_events ADD COLUMN network_downlink_mbps  REAL    DEFAULT 0.0;
ALTER TABLE analytics_events ADD COLUMN network_rtt_ms         INTEGER DEFAULT 0;

CREATE INDEX IF NOT EXISTS idx_events_client_ip   ON analytics_events(project_id, client_ip);
CREATE INDEX IF NOT EXISTS idx_events_vip_traced  ON analytics_events(project_id, is_vip_traced);
CREATE INDEX IF NOT EXISTS idx_events_activity    ON analytics_events(project_id, primary_activity);

-- ── 2. VIP Client & Target IP Watchlist ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS vip_watch_targets (
  target_id                  TEXT    PRIMARY KEY,
  project_id                 TEXT    NOT NULL,
  target_type                TEXT    NOT NULL, -- 'ip', 'distinct_id', 'email', 'domain'
  target_value               TEXT    NOT NULL, -- '203.0.113.42', 'usr_enterprise_acme', etc.
  label                      TEXT    NOT NULL, -- 'High-Paying Client: Acme Corp'
  tier                       TEXT    NOT NULL DEFAULT 'vip', -- 'vip', 'enterprise_prospect', 'high_paying'
  custom_api_key_id          TEXT    NOT NULL DEFAULT '',
  created_at                 INTEGER NOT NULL,
  last_traced_at             INTEGER NOT NULL DEFAULT 0,
  total_hits_traced          INTEGER NOT NULL DEFAULT 0,
  notes                      TEXT    NOT NULL DEFAULT ''
);

CREATE INDEX IF NOT EXISTS idx_vip_targets_val   ON vip_watch_targets(project_id, target_value);
CREATE INDEX IF NOT EXISTS idx_vip_targets_type  ON vip_watch_targets(project_id, target_type);
CREATE INDEX IF NOT EXISTS idx_vip_targets_last  ON vip_watch_targets(project_id, last_traced_at DESC);

-- ── 3. Dedicated High-Resolution VIP Trace Feed ──────────────────────────────
CREATE TABLE IF NOT EXISTS vip_client_traces (
  trace_id                   TEXT    PRIMARY KEY,
  project_id                 TEXT    NOT NULL,
  target_id                  TEXT    NOT NULL,
  target_label               TEXT    NOT NULL,
  event_id                   TEXT    NOT NULL,
  client_ip                  TEXT    NOT NULL,
  timestamp                  INTEGER NOT NULL,
  path                       TEXT    NOT NULL,
  url                        TEXT    NOT NULL,
  exact_device               TEXT    NOT NULL,
  gpu                        TEXT    NOT NULL,
  battery_status             TEXT    NOT NULL,
  active_vs_idle             TEXT    NOT NULL,
  full_trace_json            TEXT    NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_vip_traces_target ON vip_client_traces(project_id, target_id, timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_vip_traces_time   ON vip_client_traces(project_id, timestamp DESC);

