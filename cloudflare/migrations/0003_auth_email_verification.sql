-- UltraDemon Migration 0003: Mandatory Email Verification
-- Adds email_verified flag to users table.
-- When 0, users must click the verification link sent to their email before signing in.

ALTER TABLE users ADD COLUMN email_verified INTEGER NOT NULL DEFAULT 0;
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email, email_verified);

