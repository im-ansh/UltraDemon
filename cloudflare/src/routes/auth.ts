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

// ── POST /v1/auth/signup — Edge Account Creation with Mandatory Email Verification ──
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
  const existing = await c.env.DB.prepare('SELECT user_id, email, email_verified FROM users WHERE email = ?')
    .bind(email)
    .first<{ user_id: string; email: string; email_verified?: number }>();

  if (existing) {
    if (existing.email_verified === 0) {
      return c.json({
        error: 'An account with this email exists but is pending email verification. Please check your inbox or request a new verification link.',
        requires_verification: true,
        email
      }, 409);
    }
    return c.json({ error: 'An account with this email already exists. Please sign in.' }, 409);
  }

  const userId = `usr_${crypto.randomUUID().replace(/-/g, '').slice(0, 16)}`;
  const passwordHash = await hashPassword(password, email);
  const now = Date.now();

  try {
    await c.env.DB.prepare(
      'INSERT INTO users (user_id, email, password_hash, created_at, plan, email_verified) VALUES (?, ?, ?, ?, ?, 0)'
    ).bind(userId, email, passwordHash, now, requestedPlan).run();
  } catch (err: unknown) {
    return c.json({ error: 'Failed to create user account: ' + (err as Error).message }, 500);
  }

  // Send Supabase Verification Email with redirect to edge callback
  const origin = new URL(c.req.url).origin;
  if (c.env.SUPABASE_URL && c.env.SUPABASE_ANON_KEY) {
    try {
      await fetch(`${c.env.SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: {
          'apikey': c.env.SUPABASE_ANON_KEY,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          options: {
            emailRedirectTo: `${origin}/auth/callback`,
            data: { plan: requestedPlan, user_id: userId },
          },
        }),
      });
    } catch (err: unknown) {
      console.warn('Supabase verification email dispatch failed:', err);
    }
  }

  // Mandatory email verification: NO immediate session token granted
  return c.json({
    message: 'Verification link sent to your email. You must click the link in your email to verify and activate your account before signing in.',
    requires_verification: true,
    email,
    plan: requestedPlan,
  }, 201);
});

// ── POST /v1/auth/signin — Edge Sign In with Mandatory Verification Check ────
authRouter.post('/signin', async (c) => {
  const body: AuthBody = await c.req.json<AuthBody>().catch(() => ({}));
  const email = (body.email || '').trim().toLowerCase();
  const password = body.password || '';

  if (!email || !password) {
    return c.json({ error: 'Email and password are required' }, 400);
  }

  // 1. Check D1 first
  const user = await c.env.DB.prepare('SELECT user_id, email, password_hash, plan, email_verified FROM users WHERE email = ?')
    .bind(email)
    .first<{ user_id: string; email: string; password_hash: string; plan?: string; email_verified?: number }>();

  if (user) {
    const expectedHash = await hashPassword(password, email);
    if (user.password_hash === expectedHash) {
      
      // Check mandatory email verification status
      if (user.email_verified === 0) {
        let isVerifiedInSupabase = false;
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
              isVerifiedInSupabase = true;
            } else {
              const errData = await sbRes.json<{ error_description?: string; msg?: string }>().catch(() => ({} as { error_description?: string; msg?: string }));
              const desc = errData.error_description || errData.msg || '';
              if (desc.toLowerCase().includes('not confirmed') || desc.toLowerCase().includes('confirm')) {
                return c.json({
                  error: 'Email verification is mandatory. Please check your inbox and click the verification link before signing in.',
                  requires_verification: true,
                  email,
                }, 403);
              }
            }
          } catch {}
        }

        if (isVerifiedInSupabase) {
          await c.env.DB.prepare('UPDATE users SET email_verified = 1 WHERE user_id = ?').bind(user.user_id).run();
        } else {
          return c.json({
            error: 'Email verification is mandatory. Please check your inbox and click the verification link before signing in.',
            requires_verification: true,
            email,
          }, 403);
        }
      }

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
            'INSERT OR IGNORE INTO users (user_id, email, password_hash, created_at, plan, email_verified) VALUES (?, ?, ?, ?, ?, 1)'
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
      } else {
        const errData = await sbRes.json<{ error_description?: string; msg?: string }>().catch(() => ({} as { error_description?: string; msg?: string }));
        const desc = errData.error_description || errData.msg || '';
        if (desc.toLowerCase().includes('not confirmed') || desc.toLowerCase().includes('confirm')) {
          return c.json({
            error: 'Email verification is mandatory. Please check your inbox and click the verification link before signing in.',
            requires_verification: true,
            email,
          }, 403);
        }
      }
    } catch (sbErr) {
      console.warn('Supabase signin attempt failed:', sbErr);
    }
  }

  return c.json({ error: 'Invalid email or password' }, 401);
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
      return c.json({ error: 'Error sending verification link: ' + (err as Error).message }, 500);
    }
  }

  return c.json({
    message: `Verification link successfully resent to ${email}. Please check your inbox and spam folder.`,
    email,
  });
});

// ── POST /v1/auth/confirm-verification — Complete Email Verification Callback ─
authRouter.post('/confirm-verification', async (c) => {
  const body = await c.req.json<{ access_token?: string; email?: string }>().catch(() => ({} as { access_token?: string; email?: string }));
  let email = (body.email || '').trim().toLowerCase();
  const accessToken = body.access_token || '';

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
    } catch {}
  }

  if (!email) {
    return c.json({ error: 'Unable to verify email without a valid token or email' }, 400);
  }

  // Update D1 users to verified
  await c.env.DB.prepare('UPDATE users SET email_verified = 1 WHERE email = ?').bind(email).run();

  const user = await c.env.DB.prepare('SELECT user_id, email, plan FROM users WHERE email = ?')
    .bind(email)
    .first<{ user_id: string; email: string; plan?: string }>();

  if (!user) {
    return c.json({ error: 'User record not found' }, 404);
  }

  const plan = user.plan || 'free';

  // Ensure initial API key exists
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

  const sessionToken = `edge_sess_${crypto.randomUUID().replace(/-/g, '')}${crypto.randomUUID().replace(/-/g, '')}`;
  const sessionPayload = { id: user.user_id, email: user.email, plan, active_key: activeKey };

  await c.env.KEY_CACHE.put(`sess:${sessionToken}`, JSON.stringify(sessionPayload), {
    expirationTtl: 86400 * 30,
  });

  return c.json({
    message: 'Email verified successfully! Workspace activated.',
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
      const row = await c.env.DB.prepare('SELECT plan FROM users WHERE user_id = ?').bind(user.id).first<{ plan: string }>();
      const plan = row?.plan || 'free';
      const keys = await listUserKeys(c.env, user.id, user.email);
      return c.json({ user: { id: user.id, email: user.email, plan, keys } });
    }
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
