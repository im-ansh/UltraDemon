// UltraSearch — Keys Route (/v1/keys)

import { Hono } from 'hono';
import type { Env } from '../types';
import { createApiKey, listUserKeys, revokeApiKey, getUsage, getApiKeyMetrics, hashKey } from '../lib/api-keys';
import { authMiddleware, getSupabaseUser } from '../lib/auth';

export const keysRouter = new Hono<{ Bindings: Env }>();

interface CreateKeyBody {
  plan?: string;
  label?: string;
  key_type?: 'unified' | 'memory' | 'search' | 'telemetry';
}

// ── POST /v1/keys — create a new key ────────────────────────────────────────
keysRouter.post('/', async (c) => {
  let sbUser = await getSupabaseUser(c.env, c.req.header('authorization'));
  if (!sbUser) {
    // Graceful edge guest auto-provisioning if unauthenticated
    const guestSuffix = crypto.randomUUID().replace(/-/g, '').slice(0, 8);
    const guestId = `usr_guest_${guestSuffix}`;
    const guestEmail = `guest_${guestSuffix}@edge.ultrademon.internal`;
    try {
      await c.env.DB.prepare(
        'INSERT INTO users (user_id, email, password_hash, created_at, plan) VALUES (?, ?, ?, ?, ?)'
      ).bind(guestId, guestEmail, 'guest_account_no_password', Date.now(), 'free').run();
    } catch {}
    sbUser = { id: guestId, email: guestEmail };
  }

  const body: CreateKeyBody = await c.req.json<CreateKeyBody>().catch(() => ({}));
  const keyType = (['unified', 'memory', 'search', 'telemetry'].includes(body.key_type || '') ? body.key_type : 'unified') as 'unified' | 'memory' | 'search' | 'telemetry';

  try {
    const defaultLabel = keyType === 'memory' 
      ? 'UltraMemory API Key' 
      : keyType === 'search' 
        ? 'UltraSearch API Key' 
        : keyType === 'telemetry'
          ? 'UltraMetrics Telemetry Key'
          : (sbUser.email ? `Unified Key for ${sbUser.email}` : 'Unified Key');

    const { plainKey, record } = await createApiKey(
      c.env,
      sbUser.id,
      body.plan ?? 'free',
      body.label?.trim() || defaultLabel,
      keyType,
    );
    return c.json({
      message: 'API key created. Save the plain_key — it will NOT be shown again.',
      plain_key: plainKey,
      key_id:    record.key_id,
      user_id:   record.user_id,
      plan:      record.plan,
      key_type:  record.key_type || 'unified',
      label:     record.label,
      created_at: new Date(record.created_at).toISOString(),
    }, 201);
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 400);
  }
});

// ── GET /v1/keys — list keys for authenticated user ─────────────────────────
keysRouter.get('/', async (c) => {
  const sbUser = await getSupabaseUser(c.env, c.req.header('authorization'));
  if (!sbUser) {
    return c.json({ keys: [] });
  }

  const keys = await listUserKeys(c.env, sbUser.id, sbUser.email);
  return c.json({ keys });
});

// ── DELETE /v1/keys/:key — revoke ───────────────────────────────────────────
keysRouter.delete('/:key', async (c) => {
  const sbUser = await getSupabaseUser(c.env, c.req.header('authorization'));
  if (!sbUser) {
    return c.json({
      error: 'Authentication required. You must first log in or create an account with Supabase to manage API keys.',
      requires_auth: true,
    }, 401);
  }

  const key = c.req.param('key');
  try {
    await revokeApiKey(c.env, key);
    return c.json({ message: 'Key revoked successfully' });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 404);
  }
});

// ── GET /v1/keys/metrics — real-time usage metrics per key & combined ─────────
keysRouter.get('/metrics', async (c) => {
  const sbUser = await getSupabaseUser(c.env, c.req.header('authorization'));
  const xApiKey = c.req.header('x-api-key');

  let singleHashedKey: string | undefined;
  if (xApiKey) {
    try {
      singleHashedKey = await hashKey(xApiKey, c.env.ULTRASEARCH_SECRET);
    } catch {}
  }

  const metrics = await getApiKeyMetrics(
    c.env,
    sbUser?.id,
    sbUser?.email,
    singleHashedKey
  );
  return c.json(metrics);
});

// ── GET /v1/usage — usage for current key ───────────────────────────────────
keysRouter.get('/usage', authMiddleware, async (c) => {
  const plainKey = c.get('plainKey');
  try {
    const stats = await getUsage(c.env, plainKey);
    return c.json(stats);
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 404);
  }
});

