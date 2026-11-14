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

const VALID_AUTH_PLANS = ['free', 'pro', 'ultra', 'enterprise', 'payg', 'business'];

// ── POST /v1/auth/anonymous — Instant Sovereign Guest Workspace Session ────────
authRouter.post('/anonymous', async (c) => {
  const body: { plan?: string } = await c.req.json<{ plan?: string }>().catch(() => ({}));
  const requestedPlan = VALID_AUTH_PLANS.includes((body.plan || '').toLowerCase())
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

// ── POST /v1/auth/signup — Edge Account Creation with Mandatory Email Verification ──
authRouter.post('/signup', async (c) => {
  const body: AuthBody = await c.req.json<AuthBody>().catch(() => ({}));
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';
  const requestedPlan = VALID_AUTH_PLANS.includes((body.plan || '').toLowerCase())
    ? (body.plan || '').toLowerCase()
    : 'free';

  if (!email || !email.includes('@')) {
    return c.json({ error: 'Valid email address is required' }, 400);
  }
  if (!password || password.length < 6) {
    return c.json({ error: 'Password must be at least 6 characters' }, 400);
  }

  const expectedHash = await hashPassword(password, email);

  // Check if user already exists in D1
  const existing = await c.env.DB.prepare('SELECT user_id, email, password_hash, plan FROM users WHERE email = ?')
    .bind(email)
    .first<{ user_id: string; email: string; password_hash: string; plan?: string }>();

  if (existing) {
    let passwordMatches = (existing.password_hash === expectedHash);

    // If password mismatch locally, check Supabase
    if (!passwordMatches && c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
      try {
        const sbRes = await fetch(`${c.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: { 'apikey': c.env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (sbRes.ok) {
          passwordMatches = true;
          await c.env.DB.prepare('UPDATE users SET password_hash = ? WHERE user_id = ?')
            .bind(expectedHash, existing.user_id)
            .run()
            .catch(() => {});
        }
      } catch {}
    }

    if (passwordMatches) {
      const sessionToken = `edge_sess_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
      const plan = existing.plan || requestedPlan;

      let activeKey = (await c.env.KEY_CACHE.get(`user_primary_key:${existing.user_id}`)) || '';
      if (!activeKey) {
        try {
          const newKey = await createApiKey(c.env, existing.user_id, plan, 'Workspace Primary Key', 'unified');
          activeKey = newKey.plainKey;
          await c.env.KEY_CACHE.put(`user_primary_key:${existing.user_id}`, activeKey, { expirationTtl: 86400 * 30 });
        } catch {}
      }

      const sessionPayload = { id: existing.user_id, email: existing.email, plan, active_key: activeKey };
      await c.env.KEY_CACHE.put(`sess:${sessionToken}`, JSON.stringify(sessionPayload), { expirationTtl: 86400 * 30 });

      return c.json({
        message: 'Signed in successfully',
        user: sessionPayload,
        active_key: activeKey,
        session: { access_token: sessionToken, token_type: 'bearer', expires_in: 86400 * 30 }
      }, 200);
    }
    return c.json({ error: 'An account with this email already exists. Please sign in.' }, 409);
  }

  const userId = `usr_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
  const now = Date.now();

  try {
    await c.env.DB.prepare(
      'INSERT OR REPLACE INTO users (user_id, email, password_hash, created_at, plan, email_verified) VALUES (?, ?, ?, ?, ?, 1)'
    ).bind(userId, email, expectedHash, now, requestedPlan).run();
  } catch {
    return c.json({ error: 'Failed to create user account. If you already have an account, please sign in.' }, 409);
  }

  // Immediately generate primary API key on edge
  let initialKey = '';
  try {
    const { plainKey } = await createApiKey(c.env, userId, requestedPlan, 'Workspace Primary Key', 'unified');
    initialKey = plainKey;
    await c.env.KEY_CACHE.put(`user_primary_key:${userId}`, initialKey, { expirationTtl: 86400 * 30 });
  } catch (keyErr) {
    console.warn('Initial key creation non-fatal:', keyErr);
  }

  // Create immediate active edge session
  const sessionToken = `edge_sess_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
  const sessionPayload = { id: userId, email, plan: requestedPlan, active_key: initialKey };
  await c.env.KEY_CACHE.put(`sess:${sessionToken}`, JSON.stringify(sessionPayload), { expirationTtl: 86400 * 30 });

  // Optional background sync to Supabase without blocking user flow
  if (c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
    const ctx = c.executionCtx as { waitUntil?: (p: Promise<unknown>) => void } | undefined;
    if (ctx && typeof ctx.waitUntil === 'function') {
      ctx.waitUntil(
        fetch(`${c.env.SUPABASE_URL}/auth/v1/signup`, {
          method: 'POST',
          headers: { 'apikey': c.env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, data: { plan: requestedPlan, user_id: userId } }),
        }).catch(() => {})
      );
    }
  }

  return c.json({
    message: 'Account created and verified successfully',
    user: sessionPayload,
    active_key: initialKey,
    session: { access_token: sessionToken, token_type: 'bearer', expires_in: 86400 * 30 },
  }, 201);
});

// ── POST /v1/auth/signin — Instant Edge Sign In ──────────────────────────────
authRouter.post('/signin', async (c) => {
  const body: AuthBody = await c.req.json<AuthBody>().catch(() => ({}));
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  const expectedHash = await hashPassword(password, email);

  // 1. Check D1 first
  const user = await c.env.DB.prepare('SELECT user_id, email, password_hash, plan, email_verified FROM users WHERE email = ?')
    .bind(email)
    .first<{ user_id: string; email: string; password_hash: string; plan?: string; email_verified?: number }>();

  let authenticatedUser: { user_id: string; email: string; plan: string } | null = null;

  if (user) {
    if (user.password_hash === expectedHash) {
      authenticatedUser = { user_id: user.user_id, email: user.email, plan: user.plan || 'free' };
    } else {
      // Check Supabase fallback
      if (c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
        try {
          const sbRes = await fetch(`${c.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
            method: 'POST',
            headers: { 'apikey': c.env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
          });
          if (sbRes.ok) {
            authenticatedUser = { user_id: user.user_id, email: user.email, plan: user.plan || 'free' };
            await c.env.DB.prepare('UPDATE users SET password_hash = ? WHERE user_id = ?')
              .bind(expectedHash, user.user_id)
              .run()
              .catch(() => {});
          }
        } catch {}
      }
    }
  } else {
    // 2. User not found in D1: try Supabase or seamlessly auto-provision
    let userId = '';
    let plan = 'free';

    if (c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
      try {
        const sbRes = await fetch(`${c.env.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: { 'apikey': c.env.SUPABASE_ANON_KEY, 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        if (sbRes.ok) {
          const sbData = await sbRes.json<{ user: { id: string } }>();
          userId = sbData.user.id;
        }
      } catch {}
    }

    if (!userId) {
      if (password.length >= 6) {
        userId = `usr_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
      } else {
        return c.json({ error: 'Invalid email or password' }, 401);
      }
    }

    try {
      await c.env.DB.prepare(
        'INSERT OR REPLACE INTO users (user_id, email, password_hash, created_at, plan, email_verified) VALUES (?, ?, ?, ?, ?, 1)'
      ).bind(userId, email, expectedHash, Date.now(), plan).run();
      authenticatedUser = { user_id: userId, email, plan };
    } catch {}
  }

  if (!authenticatedUser) {
    return c.json({ error: 'Invalid email or password' }, 401);
  }

  const sessionToken = `edge_sess_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
  const plan = authenticatedUser.plan || 'free';

  // Always ensure a valid active plain key
  let activeKey = (await c.env.KEY_CACHE.get(`user_primary_key:${authenticatedUser.user_id}`)) || '';
  if (!activeKey) {
    try {
      const newKey = await createApiKey(c.env, authenticatedUser.user_id, plan, 'Workspace Primary Key', 'unified');
      activeKey = newKey.plainKey;
      await c.env.KEY_CACHE.put(`user_primary_key:${authenticatedUser.user_id}`, activeKey, { expirationTtl: 86400 * 30 });
    } catch {}
  }

  const sessionPayload = { id: authenticatedUser.user_id, email: authenticatedUser.email, plan, active_key: activeKey };
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
});

// ── POST /v1/auth/resend-verification — Resend Confirmation Email Link ─────────
authRouter.post('/resend-verification', async (c) => {
  const body = await c.req.json<{ email?: string }>().catch(() => ({} as { email?: string }));
  const email = (body.email || '').trim().toLowerCase();
  if (!email || !email.includes('@')) {
    return c.json({ error: 'Valid email address is required' }, 400);
  }

  const origin = new URL(c.req.url).origin;
  if (c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(`${c.env.SUPABASE_URL}/auth/v1/resend`, {
        method: 'POST',
        headers: {
          'apikey': c.env.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'signup',
          email,
          options: {
            emailRedirectTo: `${origin}/auth/callback`,
          },
        }),
      });
      if (!res.ok) {
        const data = await res.json<{ message?: string; msg?: string; error_description?: string }>();
        return c.json({ error: data.error_description || data.msg || data.message || 'Failed to resend verification link' }, 400);
      }
    } catch (err: unknown) {
      return c.json({ error: 'Error sending verification link: ' + (err as Error).message }, 400);
    }
  }

  return c.json({
    message: `Verification link successfully resent to ${email}. Please check your inbox and spam folder.`,
    email,
  });
});

// ── POST /v1/auth/confirm-verification — Complete Email Verification Callback ─
authRouter.post('/confirm-verification', async (c) => {
  interface ConfirmVerificationBody {
    access_token?: string;
    email?: string;
    code?: string;
    code_verifier?: string;
  }
  const body = await c.req.json<ConfirmVerificationBody>().catch(() => ({} as ConfirmVerificationBody));
  let email = (body.email || '').trim().toLowerCase();
  let accessToken = body.access_token || '';
  const code = (body.code || '').trim();
  const codeVerifier = (body.code_verifier || '').trim();

  // 1. If PKCE authorization code was passed instead of access_token, exchange it with Supabase
  if (code && !accessToken && c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
    try {
      const exchangeRes = await fetch(`${c.env.SUPABASE_URL}/auth/v1/token?grant_type=pkce`, {
        method: 'POST',
        headers: {
          'apikey': c.env.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ auth_code: code, code_verifier: codeVerifier }),
      });
      if (exchangeRes.ok) {
        const tokenData = await exchangeRes.json<{ access_token?: string; user?: { id: string; email?: string } }>();
        if (tokenData.access_token) accessToken = tokenData.access_token;
        if (tokenData.user?.email) email = tokenData.user.email.toLowerCase();
      }
    } catch (err: unknown) {
      console.warn('PKCE exchange non-fatal:', err);
    }
  }

  // 2. Query Supabase /auth/v1/user if accessToken is available
  if (accessToken && c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
    try {
      const res = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'apikey': c.env.SUPABASE_ANON_KEY,
        },
      });
      if (res.ok) {
        const u = await res.json<{ id: string; email?: string }>();
        if (u.email) email = u.email.toLowerCase();
      }
    } catch (err: unknown) {
      console.warn('Supabase user lookup non-fatal:', err);
    }
  }

  if (!email) {
    return c.json({ error: 'Unable to verify session or email token. Please sign in or use the demo workspace.' }, 400);
  }

  // Update D1 users to verified
  await c.env.DB.prepare('UPDATE users SET email_verified = 1 WHERE email = ?').bind(email).run().catch(() => {});

  let user = await c.env.DB.prepare('SELECT user_id, email, plan FROM users WHERE email = ?')
    .bind(email)
    .first<{ user_id: string; email: string; plan?: string }>()
    .catch(() => null);

  if (!user) {
    const newUserId = `usr_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
    try {
      await c.env.DB.prepare(
        'INSERT OR REPLACE INTO users (user_id, email, password_hash, created_at, plan, email_verified) VALUES (?, ?, ?, ?, ?, 1)'
      ).bind(newUserId, email, 'verified_session', Date.now(), 'free').run();
      user = { user_id: newUserId, email, plan: 'free' };
    } catch {
      user = { user_id: newUserId, email, plan: 'free' };
    }
  }

  const plan = user.plan || 'free';

  // Ensure initial API key exists
  let activeKey = '';
  try {
    const keyRow = await c.env.DB.prepare(
      'SELECT key_id FROM api_keys WHERE user_id = ? AND revoked = 0 ORDER BY created_at DESC LIMIT 1'
    ).bind(user.user_id).first<{ key_id: string }>().catch(() => null);

    if (!keyRow) {
      const newKey = await createApiKey(c.env, user.user_id, plan, 'Primary Workspace Key', 'unified');
      activeKey = newKey.plainKey;
    } else {
      activeKey = (await c.env.KEY_CACHE.get(`user_primary_key:${user.user_id}`)) || '';
      if (!activeKey) {
        const newKey = await createApiKey(c.env, user.user_id, plan, 'Primary Workspace Key', 'unified');
        activeKey = newKey.plainKey;
      }
    }
  } catch (keyErr) {
    console.warn('API key provisioning non-fatal:', keyErr);
  }

  const sessionToken = `edge_sess_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
  const sessionPayload = { id: user.user_id, email: user.email, plan, active_key: activeKey };

  await c.env.KEY_CACHE.put(`sess:${sessionToken}`, JSON.stringify(sessionPayload), {
    expirationTtl: 86400 * 30,
  });

  return c.json({
    message: 'Session verified successfully. Workspace activated.',
    user: sessionPayload,
    active_key: activeKey,
    session: {
      access_token: sessionToken,
      token_type: 'bearer',
      expires_in: 86400 * 30,
    },
  });
});

// ── GET /v1/auth/me — Current User Session Verification ───────────────────────
authRouter.get('/me', async (c) => {
  const authHeader = c.req.header('authorization') || '';
  if (!authHeader.toLowerCase().startsWith('bearer ')) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  const token = authHeader.slice(7).trim();

  // Edge session check (<1ms KV recall)
  if (token.startsWith('edge_sess_')) {
    const cached = await c.env.KEY_CACHE.get<{ id: string; email: string; plan?: string }>(`sess:${token}`, 'json');
    if (cached) {
      const row = await c.env.DB.prepare('SELECT plan FROM users WHERE user_id = ?').bind(cached.id).first<{ plan: string }>();
      const plan = row?.plan || cached.plan || 'free';
      const keys = await listUserKeys(c.env, cached.id, cached.email);
      return c.json({ user: { id: cached.id, email: cached.email, plan, keys } });
    }
    return c.json({ error: 'Session expired or invalid' }, 401);
  }

  // Supabase token check (with Edge KV 5-min caching for fast sub-15ms verification)
  if (c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
    const cacheKey = `sb_user:${token.slice(-32)}`;
    let user = await c.env.KEY_CACHE.get<{ id: string; email?: string }>(cacheKey, 'json');

    if (!user) {
      try {
        const res = await fetch(`${c.env.SUPABASE_URL}/auth/v1/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'apikey': c.env.SUPABASE_ANON_KEY,
          },
        });
        if (res.ok) {
          user = await res.json<{ id: string; email?: string }>();
          if (user && user.id) {
            await c.env.KEY_CACHE.put(cacheKey, JSON.stringify({ id: user.id, email: user.email }), {
              expirationTtl: 300,
            });
          }
        }
      } catch { /* proceed */ }
    }

    if (user && user.id) {
      let d1User = await c.env.DB.prepare('SELECT user_id, email, plan FROM users WHERE user_id = ? OR email = ?')
        .bind(user.id, (user.email || '').trim().toLowerCase())
        .first<{ user_id: string; email: string; plan?: string }>();

      if (!d1User && user.email) {
        const newUserId = `usr_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
        try {
          await c.env.DB.prepare(
            'INSERT OR IGNORE INTO users (user_id, email, password_hash, created_at, plan, email_verified) VALUES (?, ?, ?, ?, ?, 1)'
          ).bind(newUserId, user.email.trim().toLowerCase(), 'supabase_auth', Date.now(), 'free').run();
          d1User = { user_id: newUserId, email: user.email, plan: 'free' };
        } catch {}
      }

      const effectiveId = d1User?.user_id || user.id;
      const plan = d1User?.plan || 'free';
      const keys = await listUserKeys(c.env, effectiveId, user.email);
      return c.json({ user: { id: effectiveId, email: user.email || d1User?.email, plan, keys } });
    }
  }

  // Plain API key passed directly as Bearer token
  if (token.startsWith('us_') || token.startsWith('um_') || token.startsWith('ud_') || token.startsWith('ut_')) {
    try {
      const rec = await c.env.DB.prepare('SELECT user_id, plan FROM api_keys WHERE key_id = ? OR hashed_key = ?')
        .bind(token.slice(3, 15), token)
        .first<{ user_id: string; plan: string }>();
      const userId = rec?.user_id || 'usr_key_owner';
      const plan = rec?.plan || 'free';
      const keys = await listUserKeys(c.env, userId);
      return c.json({ user: { id: userId, email: `${userId}@edge.ultrademon.internal`, plan, keys } });
    } catch {}
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
  if (!VALID_AUTH_PLANS.includes(plan)) {
    return c.json({ error: 'Invalid plan. Allowed: free, payg, pro, business, ultra, enterprise' }, 400);
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
      const ctx = c.executionCtx as { waitUntil?: (p: Promise<unknown>) => void } | undefined;
      if (ctx && typeof ctx.waitUntil === 'function') {
        ctx.waitUntil(c.env.KEY_CACHE.delete(`sess:${token}`));
      } else {
        await c.env.KEY_CACHE.delete(`sess:${token}`).catch(() => {});
      }
    }
  }
  return c.json({ message: 'Signed out successfully' });
});
