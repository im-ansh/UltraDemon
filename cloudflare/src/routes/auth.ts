// UltraSearch & UltraMemory — Edge Auth Router (/v1/auth)
// High-performance, zero-latency authentication on Cloudflare Workers edge.
// Supports instant sign-up without email confirmation delays, backed by D1 & KV.
// Also synchronizes transparently with Supabase when available.

import { Hono } from 'hono';
import type { Env } from '../types';
import { createApiKey, listUserKeys } from '../lib/api-keys';

export const authRouter = new Hono<{ Bindings: Env }>();

// Helper: Secure password hashing with Web Crypto SHA-256 and static salt
async function hashPassword(password: string, salt: string): Promise<string> {
  const enc = new TextEncoder();
  const data = enc.encode(`ultrademon_edge_salt_${salt}:${password}`);
  const hash = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

interface AuthBody {
  email?: string;
  password?: string;
  plan?: string;
}

// ── POST /v1/auth/anonymous — Instant Sovereign Guest Workspace Session ────────
authRouter.post('/anonymous', async (c) => {
  const body: { plan?: string } = await c.req.json<{ plan?: string }>().catch(() => ({}));
  const requestedPlan = ['free', 'pro', 'ultra', 'enterprise'].includes((body.plan || '').toLowerCase())
    ? (body.plan || '').toLowerCase()
    : 'free';

  const guestSuffix = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
  const userId = `usr_guest_${guestSuffix}`;
  const email = `guest_${guestSuffix}@edge.ultrademon.internal`;
  const now = Date.now();

  try {
    await c.env.DB.prepare(
      'INSERT INTO users (user_id, email, password_hash, created_at, plan) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, email, 'guest_account_no_password', now, requestedPlan).run();
  } catch (err: unknown) {
    console.warn('Guest user insert non-fatal:', err);
  }

  let initialKey = '';
  try {
    const { plainKey } = await createApiKey(
      c.env,
      userId,
      requestedPlan,
      'Guest Primary Key',
      'unified'
    );
    initialKey = plainKey;
  } catch (keyErr) {
    console.warn('Initial key creation for guest non-fatal:', keyErr);
  }

  const sessionToken = `edge_sess_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
  const sessionPayload = { id: userId, email, plan: requestedPlan, active_key: initialKey, is_guest: true };

  await c.env.KEY_CACHE.put(`sess:${sessionToken}`, JSON.stringify(sessionPayload), {
    expirationTtl: 86400 * 30, // 30 days
  });

  return c.json({
    message: 'Guest workspace initialized successfully',
    user: sessionPayload,
    initial_key: initialKey,
    session: {
      access_token: sessionToken,
      token_type: 'bearer',
      expires_in: 86400 * 30,
    },
  }, 201);
});

// ── POST /v1/auth/signup — Instant Edge Account Creation ──────────────────────
authRouter.post('/signup', async (c) => {
  const body: AuthBody = await c.req.json<AuthBody>().catch(() => ({}));
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  const requestedPlan = ['free', 'pro', 'ultra', 'enterprise'].includes((body.plan || '').toLowerCase())
    ? (body.plan || '').toLowerCase()
    : 'free';

  if (!email || !email.includes('@')) {
    return c.json({ error: 'Valid email address is required' }, 400);
  }
  if (!password || password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  // Check if user already exists in D1
  const existing = await c.env.DB.prepare('SELECT user_id, email FROM users WHERE email = ?')
    .bind(email)
    .first<{ user_id: string; email: string }>();

  if (existing) {
    return c.json({ error: 'An account with this email already exists. Please sign in.' }, 409);
  }

  const userId = `usr_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
  const passwordHash = await hashPassword(password, email);
  const now = Date.now();

  try {
    await c.env.DB.prepare(
      'INSERT INTO users (user_id, email, password_hash, created_at, plan) VALUES (?, ?, ?, ?, ?)'
    ).bind(userId, email, passwordHash, now, requestedPlan).run();
  } catch (err: unknown) {
    return c.json({ error: 'Failed to create user account: ' + (err as Error).message }, 500);
  }

  // Automatically provision initial Unified API Key for user
  let initialKey = '';
  try {
    const { plainKey } = await createApiKey(
      c.env,
      userId,
      requestedPlan,
      'Primary Workspace Key',
      'unified'
    );
    initialKey = plainKey;
  } catch (keyErr) {
    console.warn('Initial key creation non-fatal:', keyErr);
  }

  // Create edge session token valid for 30 days
  const sessionToken = `edge_sess_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
  const sessionPayload = { id: userId, email, plan: requestedPlan, active_key: initialKey };

  await c.env.KEY_CACHE.put(`sess:${sessionToken}`, JSON.stringify(sessionPayload), {
    expirationTtl: 86400 * 30, // 30 days
  });

  // Optional background sync with Supabase (fire and forget)
  if (c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
    c.executionCtx.waitUntil(
      fetch(`${c.env.SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': c.env.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      }).catch(err => console.warn('Supabase background signup sync non-fatal:', err))
    );
  }

  return c.json({
    message: 'Account created successfully',
    user: sessionPayload,
    initial_key: initialKey,
    session: {
      access_token: sessionToken,
      token_type: 'bearer',
      expires_in: 86400 * 30,
    },
  }, 201);
});

// ── POST /v1/auth/signin — Instant Edge Sign In ───────────────────────────────
authRouter.post('/signin', async (c) => {
  const body: AuthBody = await c.req.json<AuthBody>().catch(() => ({}));
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  // 1. Check D1 first
  const user = await c.env.DB.prepare('SELECT user_id, email, password_hash, plan FROM users WHERE email = ?')
    .bind(email)
    .first<{ user_id: string; email: string; password_hash: string; plan?: string }>();

  if (user) {
    const expectedHash = await hashPassword(password, email);
    if (user.password_hash === expectedHash) {
      const sessionToken = `edge_sess_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
      const plan = user.plan || 'free';

      // Ensure user has an active key in D1
      let activeKey = '';
      const keyRow = await c.env.DB.prepare(
        'SELECT key_id, label, plan FROM api_keys WHERE user_id = ? AND revoked = 0 ORDER BY created_at DESC LIMIT 1'
      ).bind(user.user_id).first<Record<string, unknown>>();

      if (!keyRow) {
        try {
          const newKey = await createApiKey(c.env, user.user_id, plan, 'Primary Workspace Key', 'unified');
          activeKey = newKey.plainKey;
        } catch {}
      }

      const sessionPayload = { id: user.user_id, email: user.email, plan, active_key: activeKey };

      await c.env.KEY_CACHE.put(`sess:${sessionToken}`, JSON.stringify(sessionPayload), {
        expirationTtl: 86400 * 30,
      });

      return c.json({
        message: 'Signed in successfully',
        user: sessionPayload,
        active_key: activeKey,
        session: {
          access_token: sessionToken,
          token_type: 'bearer',
          expires_in: 86400 * 30,
        },
      });
    } else {
      return c.json({ error: 'Invalid email or password' }, 401);
    }
  }

  // 2. Fallback to Supabase password verification if not found in D1
  if (c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
    try {
      const sbRes = await fetch(`${c.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: {
          'apikey': c.env.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (sbRes.ok) {
        const sbData = await sbRes.json<{ access_token: string; user: { id: string; email?: string } }>();
        const passwordHash = await hashPassword(password, email);
        c.executionCtx.waitUntil(
          c.env.DB.prepare(
            'INSERT OR IGNORE INTO users (user_id, email, password_hash, created_at, plan) VALUES (?, ?, ?, ?, ?)'
          ).bind(sbData.user.id, email, passwordHash, Date.now(), 'free').run()
        );

        return c.json({
          message: 'Signed in successfully via Supabase',
          user: { id: sbData.user.id, email: sbData.user.email || email, plan: 'free' },
          session: {
            access_token: sbData.access_token,
            token_type: 'bearer',
          },
        });
      }
    } catch (sbErr) {
      console.warn('Supabase signin attempt failed:', sbErr);
    }
  }

  return c.json({ error: 'Invalid email or password' }, 401);
});

// ── GET /v1/auth/me — Current User Session Verification ───────────────────────
authRouter.get('/me', async (c) => {
  const authHeader = c.req.header('authorization') || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7).trim();

  // Edge session check
  if (token.startsWith('edge_sess_')) {
    const cached = await c.env.KEY_CACHE.get<{ id: string; email: string; plan?: string }>(`sess:${token}`, 'json');
    if (cached) {
      const row = await c.env.DB.prepare('SELECT plan FROM users WHERE user_id = ?').bind(cached.id).first<{ plan: string }>();
      const plan = row?.plan || cached.plan || 'free';
      const keys = await listUserKeys(c.env, cached.id);
      return c.json({ user: { id: cached.id, email: cached.email, plan, keys } });
    }
    return c.json({ error: 'Session expired or invalid' }, 401);
  }

  // Supabase token check
  if (c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': c.env.SUPABASE_ANON_KEY,
        },
      });
      if (res.ok) {
        const user = await res.json<{ id: string; email?: string }>();
        const row = await c.env.DB.prepare('SELECT plan FROM users WHERE user_id = ?').bind(user.id).first<{ plan: string }>();
        return c.json({ user: { id: user.id, email: user.email, plan: row?.plan || 'free' } });
      }
    } catch { /* proceed */ }
  }

  return c.json({ error: 'Session expired or invalid' }, 401);
});

// ── POST /v1/auth/membership — Manage & Upgrade Membership Tier ──────────────
authRouter.post('/membership', async (c) => {
  const authHeader = c.req.header('authorization') || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7).trim();
  let userId = '';

  if (token.startsWith('edge_sess_')) {
    const cached = await c.env.KEY_CACHE.get<{ id: string; email: string }>(`sess:${token}`, 'json');
    if (cached) userId = cached.id;
  } else if (c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'apikey': c.env.SUPABASE_ANON_KEY,
        },
      });
      if (res.ok) {
        const u = await res.json<{ id: string }>();
        if (u) userId = u.id;
      }
    } catch {}
  }

  if (!userId) return c.json({ error: 'Invalid session' }, 401);

  const body = await c.req.json<{ plan?: string }>().catch(() => ({ plan: undefined }));
  const plan = (body.plan || 'free').toLowerCase();
  if (!['free', 'pro', 'ultra', 'enterprise'].includes(plan)) {
    return c.json({ error: 'Invalid plan. Allowed: free, pro, ultra, enterprise' }, 400);
  }

  // Update users table in D1
  await c.env.DB.prepare('UPDATE users SET plan = ? WHERE user_id = ?')
    .bind(plan, userId)
    .run();

  // Update active API keys for this user in D1
  await c.env.DB.prepare('UPDATE api_keys SET plan = ? WHERE user_id = ? AND revoked = 0')
    .bind(plan, userId)
    .run();

  // Update session in KV
  if (token.startsWith('edge_sess_')) {
    const cached = await c.env.KEY_CACHE.get<{ id: string; email: string; plan?: string }>(`sess:${token}`, 'json');
    if (cached) {
      cached.plan = plan;
      await c.env.KEY_CACHE.put(`sess:${token}`, JSON.stringify(cached), { expirationTtl: 86400 * 30 });
    }
  }

  return c.json({
    message: `Plan upgraded successfully to ${plan.toUpperCase()}`,
    plan,
  });
});

// ── POST /v1/auth/signout — End Session ───────────────────────────────────────
authRouter.post('/signout', async (c) => {
  const authHeader = c.req.header('authorization') || '';
  if (authHeader.toLowerCase().startsWith('bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token.startsWith('edge_sess_')) {
      c.executionCtx.waitUntil(c.env.KEY_CACHE.delete(`sess:${token}`));
    }
  }
  return c.json({ message: 'Signed out successfully' });
});
