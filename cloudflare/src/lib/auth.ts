// UltraSearch — Auth Middleware (Cloudflare Workers)
// Extracts and validates API key from every request.
// Checks rate limits via Durable Objects.

import type { Context, Next } from 'hono';
import type { Env, ApiKeyRecord } from '../types';
import { validateApiKey, incrementUsage, getPlanSpec, KEY_ISOLATE_CACHE, KEY_ISOLATE_TTL_MS } from './api-keys';

// Attach validated key record to context
declare module 'hono' {
  interface ContextVariableMap {
    keyRecord: ApiKeyRecord;
    plainKey:  string;
  }
}

export function getSafeExecutionCtx(c: unknown): { waitUntil?: (p: Promise<unknown>) => void } | undefined {
  try {
    return (c as { executionCtx?: { waitUntil?: (p: Promise<unknown>) => void } }).executionCtx;
  } catch {
    return undefined;
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
    // Case 2: Authenticated edge session token from web UI (<0.05ms V8 RAM path)
    const cachedIsolate = KEY_ISOLATE_CACHE.get(plainKey);
    if (cachedIsolate && (Date.now() - cachedIsolate.cachedAt < KEY_ISOLATE_TTL_MS)) {
      record = cachedIsolate.record;
    } else {
      let session: { id: string; email?: string; plan?: string } | null = null;
      if (c.env.KEY_CACHE && typeof c.env.KEY_CACHE.get === 'function') {
        try {
          session = await c.env.KEY_CACHE.get<{ id: string; email?: string; plan?: string }>(`sess:${plainKey}`, 'json');
        } catch {}
      }
      if (session && session.id) {
        record = {
          hashed_key: `sess_hash_${session.id}`,
          key_id: `key_${session.id.slice(0, 12)}`,
          user_id: session.id,
          plan: session.plan || 'free',
          key_type: 'unified',
          label: 'Session Workspace Key',
          created_at: 1730000000000,
          revoked: false,
        };
        KEY_ISOLATE_CACHE.set(plainKey, { record, hashedKey: `sess_hash_${session.id}`, cachedAt: Date.now() });
      } else {
        return c.json({ error: 'Session expired or invalid. Please sign in again.' }, 401);
      }
    }
  } else if (plainKey.startsWith('eyJ')) {
    // Case 3: Supabase JWT from web client
    // Check isolate cache first to skip Supabase fetch + D1 query on warm isolates
    const jwtCached = KEY_ISOLATE_CACHE.get(plainKey);
    if (jwtCached && (Date.now() - jwtCached.cachedAt < KEY_ISOLATE_TTL_MS)) {
      record = jwtCached.record;
    } else {
      const sbUser = await getSupabaseUser(c.env, `Bearer ${plainKey}`);
      if (sbUser && sbUser.id) {
        const d1User = await c.env.DB.prepare('SELECT user_id, plan FROM users WHERE user_id = ? OR email = ?')
          .bind(sbUser.id, sbUser.email || '')
          .first<{ user_id: string; plan?: string }>();
        const plan = d1User?.plan || 'free';
        const userId = d1User?.user_id || sbUser.id;
        record = {
          hashed_key: `sb_hash_${userId}`,
          key_id: `key_${userId.slice(0, 12)}`,
          user_id: userId,
          plan,
          key_type: 'unified',
          label: 'Supabase Session Key',
          created_at: 1730000000000,
          revoked: false,
        };
        KEY_ISOLATE_CACHE.set(plainKey, { record, hashedKey: `sb_hash_${userId}`, cachedAt: Date.now() });
      } else {
        return c.json({ error: 'Supabase session expired or invalid. Please sign in again.' }, 401);
      }
    }
  } else {
    // Case 4: Standard API key validation
    try {
      const safeCtx = getSafeExecutionCtx(c);
      record = await validateApiKey(c.env, plainKey, safeCtx);
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
  const ctx = getSafeExecutionCtx(c);
  if (ctx && typeof ctx.waitUntil === 'function') {
    ctx.waitUntil(
      incrementUsage(c.env, record.hashed_key, {
        service,
        keyId: record.key_id,
        path: c.req.path,
        method: c.req.method,
        status: c.res.status,
        latencyMs,
      })
    );
  }

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

// In-isolate Supabase user cache (<0.05ms) — survives across requests in the same isolate
const SUPABASE_USER_CACHE = new Map<string, { user: { id: string; email?: string }; cachedAt: number }>();
const SUPABASE_USER_CACHE_TTL_MS = 120_000; // 2 min isolate TTL
const MAX_SUPABASE_CACHE_ENTRIES = 500;

export async function getSupabaseUser(
  env: Env,
  authHeader?: string,
): Promise<{ id: string; email?: string } | null> {
  if (!authHeader || !authHeader.toLowerCase().startsWith('bearer ')) return null;
  const token = authHeader.slice(7).trim();
  if (!token || token.startsWith('us_')) return null; // 'us_' is an UltraSearch API key

  // 1. Direct Edge Session check (<1ms KV recall)
  if (token.startsWith('edge_sess_')) {
    if (env.KEY_CACHE && typeof env.KEY_CACHE.get === 'function') {
      try {
        const session = await env.KEY_CACHE.get<{ id: string; email?: string }>(`sess:${token}`, 'json');
        if (session && session.id) return session;
      } catch {}
    }
    return null;
  }

  // 2. Supabase JWT verification
  const cacheKey = `sb_user:${token.slice(-32)}`;

  // Tier 0: In-isolate RAM cache (<0.05ms) — eliminates KV + Supabase fetch on warm isolates
  const ramCached = SUPABASE_USER_CACHE.get(cacheKey);
  if (ramCached && (Date.now() - ramCached.cachedAt < SUPABASE_USER_CACHE_TTL_MS)) {
    return ramCached.user;
  }

  // Tier 1: KV cache
  if (env.KEY_CACHE && typeof env.KEY_CACHE.get === 'function') {
    try {
      const cached = await env.KEY_CACHE.get<{ id: string; email?: string }>(cacheKey, 'json');
      if (cached) {
        // Warm up isolate cache on KV hit
        if (SUPABASE_USER_CACHE.size >= MAX_SUPABASE_CACHE_ENTRIES) {
          const oldest = SUPABASE_USER_CACHE.keys().next().value;
          if (oldest) SUPABASE_USER_CACHE.delete(oldest);
        }
        SUPABASE_USER_CACHE.set(cacheKey, { user: cached, cachedAt: Date.now() });
        return cached;
      }
    } catch {}
  }

  // Tier 2: Supabase remote verification (100-400ms — only on full cache miss)
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
      const userData = { id: user.id, email: user.email };

      // Populate isolate cache
      if (SUPABASE_USER_CACHE.size >= MAX_SUPABASE_CACHE_ENTRIES) {
        const oldest = SUPABASE_USER_CACHE.keys().next().value;
        if (oldest) SUPABASE_USER_CACHE.delete(oldest);
      }
      SUPABASE_USER_CACHE.set(cacheKey, { user: userData, cachedAt: Date.now() });

      // NON-BLOCKING: Populate KV cache (30 min TTL — JWTs have their own expiry)
      if (env.KEY_CACHE && typeof env.KEY_CACHE.put === 'function') {
        env.KEY_CACHE.put(cacheKey, JSON.stringify(userData), {
          expirationTtl: 1800,
        }).catch(() => {});
      }

      return userData;
    }
  } catch (err) {
    console.warn('Supabase auth verification failed:', err);
  }
  return null;
}

export const getAuthUser = getSupabaseUser;

