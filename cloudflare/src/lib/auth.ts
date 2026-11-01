// UltraSearch — Auth Middleware (Cloudflare Workers)
// Extracts and validates API key from every request.
// Checks rate limits via Durable Objects.

import type { Context, Next } from 'hono';
import type { Env, ApiKeyRecord } from '../types';
import { validateApiKey, incrementUsage } from './api-keys';

// Attach validated key record to context
declare module 'hono' {
  interface ContextVariableMap {
    keyRecord: ApiKeyRecord;
    plainKey:  string;
  }
}

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  // Extract key from X-API-Key header or Authorization: Bearer
  let plainKey = c.req.header('x-api-key') ?? '';
  if (!plainKey) {
    const authHeader = c.req.header('authorization') ?? '';
    if (authHeader.toLowerCase().startsWith('bearer ')) {
      plainKey = authHeader.slice(7).trim();
    }
  }

  if (!plainKey) {
    return c.json({
      error: 'API key required. Pass X-API-Key: us_xxxx or Authorization: Bearer us_xxxx',
    }, 401);
  }

  // Validate key
  let record: ApiKeyRecord;
  try {
    record = await validateApiKey(c.env, plainKey);
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 403);
  }

  // Rate limit check via Durable Object
  const rateLimitResult = await checkRateLimit(c.env, record);
  if (!rateLimitResult.allowed) {
    return c.json({
      error: `Daily limit of ${rateLimitResult.limit} requests reached. Upgrade your plan or wait until midnight UTC.`,
      remaining: 0,
      reset_at: rateLimitResult.reset_at,
    }, 429);
  }

  // Track usage in D1 (non-blocking — fire and forget)
  c.executionCtx.waitUntil(
    incrementUsage(c.env, record.hashed_key)
  );

  // Attach to context for downstream handlers
  c.set('keyRecord', record);
  c.set('plainKey', plainKey);

  // Expose rate limit headers
  c.header('X-RateLimit-Limit',     String(rateLimitResult.limit));
  c.header('X-RateLimit-Remaining', String(rateLimitResult.remaining));
  c.header('X-RateLimit-Reset',     rateLimitResult.reset_at);

  await next();
}

// ── Rate Limit via Durable Object ────────────────────────────────────────────

interface RateLimitResult {
  allowed:  boolean;
  limit:    number;
  remaining: number;
  reset_at: string;
}

async function checkRateLimit(env: Env, record: ApiKeyRecord): Promise<RateLimitResult> {
  // Get plan daily limit from D1
  const planRow = await env.DB
    .prepare('SELECT daily_limit FROM plans WHERE plan_id = ?')
    .bind(record.plan)
    .first<{ daily_limit: number }>();

  const limit = planRow?.daily_limit ?? 100;

  // Unlimited plan — skip DO check
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1, reset_at: 'never' };
  }

  // Durable Object — one DO instance per user per day (globally consistent)
  const today = new Date().toISOString().slice(0, 10);
  const doId = env.RATE_LIMITER.idFromName(`${record.hashed_key}:${today}`);
  const stub = env.RATE_LIMITER.get(doId);

  const resp = await stub.fetch('https://internal/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ limit }),
  });

  return resp.json<RateLimitResult>();
}
