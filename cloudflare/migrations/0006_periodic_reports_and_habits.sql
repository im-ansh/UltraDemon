-- UltraDemon Migration 0006: Periodic Customer Dossiers, Daily Abilities & Circadian Habits

ALTER TABLE customer_profile_reports ADD COLUMN report_period TEXT NOT NULL DEFAULT 'monthly';
CREATE INDEX IF NOT EXISTS idx_icp_reports_period ON customer_profile_reports(project_id, report_period, generated_at DESC);

