// UltraSearch — Keys Route (/v1/keys)

import { Hono } from 'hono';
import type { Env } from '../types';
import { createApiKey, listUserKeys, revokeApiKey, getUsage } from '../lib/api-keys';
import { authMiddleware, getSupabaseUser } from '../lib/auth';

export const keysRouter = new Hono<{ Bindings: Env }>();

// ── POST /v1/keys — create a new key ────────────────────────────────────────
keysRouter.post('/', async (c) => {
  const body = await c.req.json<{ user_id?: string; plan?: string; label?: string }>().catch(() => ({ user_id: undefined, plan: undefined, label: undefined }));
  const sbUser = await getSupabaseUser(c.env, c.req.header('authorization'));
  const userId = sbUser?.id || body.user_id;

  if (!userId) {
    return c.json({ error: 'user_id is required or authenticate with Supabase' }, 400);
  }

  try {
    const { plainKey, record } = await createApiKey(
      c.env,
      userId,
      body.plan ?? 'free',
      body.label ?? (sbUser?.email ? `Key for ${sbUser.email}` : ''),
    );
    return c.json({
      message: '✅ API key created. Save the plain_key — it will NOT be shown again.',
      plain_key: plainKey,
      key_id:    record.key_id,
      user_id:   record.user_id,
      plan:      record.plan,
      label:     record.label,
      created_at: new Date(record.created_at).toISOString(),
    }, 201);
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 400);
  }
});

// ── GET /v1/keys?user_id=... — list keys ────────────────────────────────────
keysRouter.get('/', async (c) => {
  const sbUser = await getSupabaseUser(c.env, c.req.header('authorization'));
  const userId = sbUser?.id || c.req.query('user_id');

  if (!userId) {
    return c.json({ error: 'user_id is required or authenticate with Supabase' }, 400);
  }
  const keys = await listUserKeys(c.env, userId);
  return c.json({ keys });
});

// ── DELETE /v1/keys/:key — revoke ───────────────────────────────────────────
keysRouter.delete('/:key', async (c) => {
  const key = c.req.param('key');
  try {
    await revokeApiKey(c.env, key);
    return c.json({ message: 'Key revoked successfully' });
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 404);
  }
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

