// UltraSearch — Auth Middleware (Cloudflare Workers)
// Extracts and validates API key from every request.
// Checks rate limits via Durable Objects.

import type { Context, Next } from 'hono';
import type { Env, ApiKeyRecord } from '../types';
import { validateApiKey, incrementUsage, createApiKey, getPlanSpec } from './api-keys';

// Attach validated key record to context
declare module 'hono' {
  interface ContextVariableMap {
    keyRecord: ApiKeyRecord;
    plainKey:  string;
  }
}

export async function authMiddleware(c: Context<{ Bindings: Env }>, next: Next) {
  const authStart = performance.now();

  // Extract key from X-API-Key header or Authorization: Bearer
  let plainKey = c.req.header('x-api-key') ?? '';
  const authHeader = c.req.header('authorization') ?? '';
  if (!plainKey && authHeader.toLowerCase().startsWith('bearer ')) {
    plainKey = authHeader.slice(7).trim();
  }

  const path = c.req.path;
  let record: ApiKeyRecord;

  // Case 1: No key provided — check for public playground endpoints
  if (!plainKey) {
    const isPublicEndpoint =
      path.startsWith('/v1/search') ||
      path.startsWith('/v1/memory') ||
      path.startsWith('/v1/crawl') ||
      path.startsWith('/v1/crawler') ||
      path.startsWith('/v1/usage');

    if (isPublicEndpoint) {
      record = {
        hashed_key: 'sandbox_public_guest_hash',
        key_id: 'key_public_sandbox',
        user_id: 'public_guest',
        plan: 'free',
        key_type: 'unified',
        label: 'Public Edge Sandbox',
        created_at: 1730000000000,
        revoked: false,
      };
      plainKey = 'us_guest_public_sandbox';
      c.header('X-Sandbox-Mode', 'public_edge_sandbox');
    } else {
      return c.json({
        error: 'API key required. You must first log in or sign up at the developer console to generate an API key.',
        requires_key: true,
      }, 401);
    }
  } else if (plainKey.startsWith('edge_sess_')) {
    // Case 2: Authenticated edge session token from web UI
    const session = await c.env.KEY_CACHE.get<{ id: string; email?: string; plan?: string }>(`sess:${plainKey}`, 'json');
    if (session && session.id) {
      let targetKeyType = 'unified';
      if (path.startsWith('/v1/search') || path.startsWith('/v1/crawl')) targetKeyType = 'search';
      else if (path.startsWith('/v1/memory')) targetKeyType = 'memory';
      else if (path.startsWith('/v1/analytics')) targetKeyType = 'telemetry';

      let keyRow = await c.env.DB.prepare(
        "SELECT * FROM api_keys WHERE user_id = ? AND revoked = 0 AND (key_type = 'unified' OR key_type = ?) ORDER BY created_at DESC LIMIT 1"
      ).bind(session.id, targetKeyType).first<ApiKeyRecord>();

      if (!keyRow) {
        keyRow = await c.env.DB.prepare(
          'SELECT * FROM api_keys WHERE user_id = ? AND revoked = 0 ORDER BY created_at DESC LIMIT 1'
        ).bind(session.id).first<ApiKeyRecord>();
      }

      if (keyRow) {
        // Authenticated edge sessions have full console permissions across demo apps
        record = { ...keyRow, key_type: 'unified' };
      } else {
        const newKey = await createApiKey(c.env, session.id, session.plan || 'free', 'Primary Workspace Key', 'unified');
        record = newKey.record;
      }
    } else {
      return c.json({ error: 'Session expired or invalid. Please sign in again.' }, 401);
    }
  } else {
    // Case 3: Standard API key validation
    try {
      record = await validateApiKey(c.env, plainKey);
    } catch (e: unknown) {
      return c.json({ error: (e as Error).message }, 403);
    }
  }

  // Check scope restrictions based on key_type
  if (record.key_type === 'memory' && (path.startsWith('/v1/search') || path.startsWith('/v1/crawl'))) {
    return c.json({
      error: 'This API key is scoped to UltraMemory API only. Please use a Unified or UltraSearch key for web search.',
      scope_restricted: true,
      key_type: 'memory',
    }, 403);
  }

  if (record.key_type === 'search' && path.startsWith('/v1/memory')) {
    return c.json({
      error: 'This API key is scoped to UltraSearch API only. Please use a Unified or UltraMemory key for agent memory.',
      scope_restricted: true,
      key_type: 'search',
    }, 403);
  }

  // Ultra-Fast Rate limit check (<0.01ms via isolate token bucket)
  const rateLimitResult = await checkRateLimit(c.env, record);
  if (!rateLimitResult.allowed) {
    return c.json({
      error: `Daily limit of ${rateLimitResult.limit} requests reached. Upgrade your plan or wait until midnight UTC.`,
      remaining: 0,
      reset_at: rateLimitResult.reset_at,
    }, 429);
  }

  // Determine service type from route path
  let service: 'search' | 'memory' | 'metrics' | 'crawler' | 'other' = 'other';
  if (path.startsWith('/v1/search')) service = 'search';
  else if (path.startsWith('/v1/memory')) service = 'memory';
  else if (path.startsWith('/v1/analytics')) service = 'metrics';
  else if (path.startsWith('/v1/crawl') || path.startsWith('/v1/crawler')) service = 'crawler';

  const startTime = Date.now();
  const authDurationUs = Math.round((performance.now() - authStart) * 1000);
  const planSpec = getPlanSpec(record.plan);

  // Attach to context for downstream handlers
  c.set('keyRecord', record);
  c.set('plainKey', plainKey);

  // Expose rich edge telemetry and rate limit headers
  c.header('X-RateLimit-Limit',     String(rateLimitResult.limit));
  c.header('X-RateLimit-Remaining', String(rateLimitResult.remaining));
  c.header('X-RateLimit-Reset',     rateLimitResult.reset_at);
  c.header('X-RateLimit-Tier',      planSpec.name);
  c.header('X-RateLimit-Max-QPS',   String(planSpec.max_qps));
  c.header('X-Auth-Latency-Us',     String(authDurationUs));
  const cfColo = (c.req.raw as unknown as { cf?: { colo?: string } })?.cf?.colo || 'EDGE';
  c.header('X-Edge-PoP',            cfColo);
  c.header('Server-Timing',         `auth;dur=${(authDurationUs / 1000).toFixed(2)};desc="Key Auth"`);

  const response = await next();

  // Track usage in D1 (non-blocking — fire and forget)
  const latencyMs = Date.now() - startTime;
  c.executionCtx.waitUntil(
    incrementUsage(c.env, record.hashed_key, {
      service,
      keyId: record.key_id,
      path: c.req.path,
      method: c.req.method,
      status: c.res.status,
      latencyMs,
    })
  );

  return response;
}

// ── Rate Limit via Isolate Bucket & Durable Object ───────────────────────────

interface RateLimitResult {
  allowed:   boolean;
  limit:     number;
  remaining: number;
  reset_at:  string;
}

interface LocalRateBucket {
  count: number;
  date:  string;
}
const LOCAL_RATE_CACHE = new Map<string, LocalRateBucket>();

async function checkRateLimit(env: Env, record: ApiKeyRecord): Promise<RateLimitResult> {
  const planSpec = getPlanSpec(record.plan);
  const limit = planSpec.daily_limit;

  // Unlimited plan (Enterprise / Sovereign) — instant return in 0ms!
  if (limit === -1) {
    return { allowed: true, limit: -1, remaining: -1, reset_at: 'never' };
  }

  const today = new Date().toISOString().slice(0, 10);
  const resetAt = `${today}T00:00:00Z (next day)`;

  // Fast-Path: In-isolate sliding rate counter check (0.01ms)
  let bucket = LOCAL_RATE_CACHE.get(record.hashed_key);
  if (!bucket || bucket.date !== today) {
    bucket = { count: 0, date: today };
    LOCAL_RATE_CACHE.set(record.hashed_key, bucket);
  }
  bucket.count++;

  // Fast-path: If well under quota (< 80%), allow immediately without blocking cross-region DO!
  if (bucket.count < Math.floor(limit * 0.8)) {
    return {
      allowed: true,
      limit,
      remaining: Math.max(0, limit - bucket.count),
      reset_at: resetAt,
    };
  }

  // Near-quota check via Durable Object
  if (env.RATE_LIMITER) {
    try {
      const doId = env.RATE_LIMITER.idFromName(`${record.hashed_key}:${today}`);
      const stub = env.RATE_LIMITER.get(doId);

      const resp = await stub.fetch('https://internal/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ limit }),
      });

      const doResult = await resp.json<RateLimitResult>();
      if (bucket) bucket.count = limit - doResult.remaining;
      return doResult;
    } catch (doErr) {
      console.warn('DO rate limiter fallback to D1:', doErr);
    }
  }

  // Graceful D1 fallback
  const usage = await env.DB.prepare(
    'SELECT request_count FROM usage WHERE hashed_key = ? AND date = ?'
  ).bind(record.hashed_key, today).first<{ request_count: number }>();

  const currentCount = usage?.request_count ?? 0;
  const allowed = currentCount < limit;

  return {
    allowed,
    limit,
    remaining: Math.max(0, limit - currentCount),
    reset_at: resetAt,
  };
}

// ── Supabase User Verification ────────────────────────────────────────────────

export async function getSupabaseUser(
  env: Env,
  authHeader?: string,
): Promise<{ id: string; email?: string } | null> {
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token || token.startsWith('us_')) return null; // 'us_' is an UltraSearch API key

  // 1. Direct Edge Session check (<1ms KV recall)
  if (token.startsWith('edge_sess_')) {
    const session = await env.KEY_CACHE.get<{ id: string; email?: string }>(`sess:${token}`, 'json');
    if (session && session.id) return session;
    return null;
  }

  // 2. Supabase JWT verification
  const cacheKey = `sb_user:${token.slice(-32)}`;
  const cached = await env.KEY_CACHE.get<{ id: string; email?: string }>(cacheKey, 'json');
  if (cached) return cached;

  try {
    const res = await fetch(`${env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'apikey': env.SUPABASE_ANON_KEY,
      },
    });

    if (!res.ok) return null;
    const user = await res.json<{ id: string; email?: string }>();
    if (user && user.id) {
      await env.KEY_CACHE.put(cacheKey, JSON.stringify({ id: user.id, email: user.email }), {
        expirationTtl: 300, // 5 min cache
      });
      return { id: user.id, email: user.email };
    }
  } catch (err) {
    console.warn('Supabase auth verification failed:', err);
  }
  return null;
}

export const getAuthUser = getSupabaseUser;

