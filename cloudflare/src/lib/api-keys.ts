// UltraSearch — API Key Management (Cloudflare Edge)
// Generates, validates, and caches API keys using D1 + KV.

import type { Env, ApiKeyRecord } from '../types';

const KEY_PREFIX = 'us_';
const KEY_BODY_LEN = 32;
const B62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// ── Key Generation ──────────────────────────────────────────────────────────

function randomB62(len: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, b => B62[b % 62]).join('');
}

async function hashKey(plainKey: string, secret: string): Promise<string> {
  const data = new TextEncoder().encode(`${secret}:${plainKey}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

function randomHex(len: number): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(len)), b =>
    b.toString(16).padStart(2, '0')
  ).join('').slice(0, len);
}

// ── Create Key ───────────────────────────────────────────────────────────────

export async function createApiKey(
  env: Env,
  userId: string,
  plan: string = 'free',
  label: string = '',
  keyType: 'unified' | 'memory' | 'search' = 'unified',
): Promise<{ plainKey: string; record: ApiKeyRecord }> {
  // Validate plan exists in D1
  const planRow = await env.DB
    .prepare('SELECT plan_id FROM plans WHERE plan_id = ?')
    .bind(plan)
    .first();
  if (!planRow) throw new Error(`Unknown plan: ${plan}`);

  const prefix = keyType === 'memory' ? 'um_' : KEY_PREFIX;
  const plainKey = `${prefix}${randomB62(KEY_BODY_LEN)}`;
  const hashedKey = await hashKey(plainKey, env.ULTRASEARCH_SECRET);
  const keyId = randomHex(16);
  const now = Date.now();

  const record: ApiKeyRecord = {
    hashed_key: hashedKey,
    key_id:     keyId,
    user_id:    userId,
    plan,
    key_type:   keyType,
    label:      label || `${keyType === 'memory' ? 'UltraMemory' : keyType === 'search' ? 'UltraSearch' : 'Unified'} key`,
    created_at: now,
    revoked:    false,
  };

  // Store in D1 (persistent)
  await env.DB
    .prepare(`
      INSERT INTO api_keys (hashed_key, key_id, user_id, plan, key_type, label, created_at, revoked)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `)
    .bind(hashedKey, keyId, userId, plan, keyType, record.label, now)
    .run();

  return { plainKey, record };
}

// ── Validate Key ─────────────────────────────────────────────────────────────

export async function validateApiKey(
  env: Env,
  plainKey: string,
): Promise<ApiKeyRecord> {
  if (!plainKey.startsWith('us_') && !plainKey.startsWith('um_')) {
    throw new Error("Invalid API key format — must start with 'us_' or 'um_'");
  }

  const hashedKey = await hashKey(plainKey, env.ULTRASEARCH_SECRET);

  // Check KV cache first (5-min TTL — much faster than D1)
  const cacheKey = `key:${hashedKey}`;
  const cached = await env.KEY_CACHE.get<ApiKeyRecord>(cacheKey, 'json');
  if (cached) {
    if (cached.revoked) throw new Error('API key has been revoked');
    return cached;
  }

  // Cache miss — hit D1
  const row = await env.DB
    .prepare('SELECT * FROM api_keys WHERE hashed_key = ?')
    .bind(hashedKey)
    .first<ApiKeyRecord>();

  if (!row) throw new Error('API key not found');
  if (row.revoked) throw new Error('API key has been revoked');

  // Populate KV cache (5 min TTL)
  await env.KEY_CACHE.put(cacheKey, JSON.stringify(row), { expirationTtl: 300 });

  return row;
}

// ── Revoke Key ───────────────────────────────────────────────────────────────

export async function revokeApiKey(env: Env, plainKey: string): Promise<void> {
  const hashedKey = await hashKey(plainKey, env.ULTRASEARCH_SECRET);

  await env.DB
    .prepare('UPDATE api_keys SET revoked = 1 WHERE hashed_key = ?')
    .bind(hashedKey)
    .run();

  // Invalidate KV cache immediately
  await env.KEY_CACHE.delete(`key:${hashedKey}`);
}

// ── List Keys for User ────────────────────────────────────────────────────────

export async function listUserKeys(env: Env, userId: string): Promise<ApiKeyRecord[]> {
  const { results } = await env.DB
    .prepare('SELECT key_id, user_id, plan, key_type, label, created_at, revoked FROM api_keys WHERE user_id = ?')
    .bind(userId)
    .all<Omit<ApiKeyRecord, 'hashed_key'>>();
  return results as unknown as ApiKeyRecord[];
}

// ── Usage Tracking ────────────────────────────────────────────────────────────

export async function incrementUsage(env: Env, hashedKey: string): Promise<void> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const now = Date.now();

  // Upsert daily counter in D1
  await env.DB
    .prepare(`
      INSERT INTO usage (hashed_key, date, request_count, last_used_at)
      VALUES (?, ?, 1, ?)
      ON CONFLICT (hashed_key, date)
      DO UPDATE SET
        request_count = request_count + 1,
        last_used_at  = excluded.last_used_at
    `)
    .bind(hashedKey, today, now)
    .run();
}

export async function getUsage(
  env: Env,
  plainKey: string,
): Promise<Record<string, unknown>> {
  const hashedKey = await hashKey(plainKey, env.ULTRASEARCH_SECRET);
  const today = new Date().toISOString().slice(0, 10);

  const [keyRow, usageRow] = await Promise.all([
    env.DB.prepare('SELECT plan, label, created_at FROM api_keys WHERE hashed_key = ?').bind(hashedKey).first<{ plan: string; label: string; created_at: number }>(),
    env.DB.prepare('SELECT request_count, last_used_at FROM usage WHERE hashed_key = ? AND date = ?').bind(hashedKey, today).first<{ request_count: number; last_used_at: number }>(),
  ]);

  if (!keyRow) {
    return {
      plan:           'free',
      label:          'Edge Sandbox',
      daily_limit:    100,
      requests_today: usageRow?.request_count ?? 0,
      remaining:      Math.max(0, 100 - (usageRow?.request_count ?? 0)),
      last_used_at:   usageRow?.last_used_at ? new Date(usageRow.last_used_at).toISOString() : null,
      reset_at:       `${today}T00:00:00Z (next day)`,
    };
  }

  const planDetails = await env.DB
    .prepare('SELECT daily_limit FROM plans WHERE plan_id = ?')
    .bind(keyRow.plan)
    .first<{ daily_limit: number }>();

  const dailyLimit = planDetails?.daily_limit ?? 100;
  const used = usageRow?.request_count ?? 0;

  return {
    plan:           keyRow.plan,
    label:          keyRow.label,
    daily_limit:    dailyLimit === -1 ? 'unlimited' : dailyLimit,
    requests_today: used,
    remaining:      dailyLimit === -1 ? 'unlimited' : Math.max(0, dailyLimit - used),
    last_used_at:   usageRow?.last_used_at ? new Date(usageRow.last_used_at).toISOString() : null,
    reset_at:       `${today}T00:00:00Z (next day)`,
  };
}

