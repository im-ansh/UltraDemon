// UltraSearch — Keys Route (/v1/keys)

import { Hono } from 'hono';
import type { Env } from '../types';
import { createApiKey, listUserKeys, revokeApiKey, getUsage } from '../lib/api-keys';
import { authMiddleware, getSupabaseUser } from '../lib/auth';

export const keysRouter = new Hono<{ Bindings: Env }>();

interface CreateKeyBody {
  plan?: string;
  label?: string;
  key_type?: 'unified' | 'memory' | 'search';
}

// ── POST /v1/keys — create a new key ────────────────────────────────────────
keysRouter.post('/', async (c) => {
  const sbUser = await getSupabaseUser(c.env, c.req.header('authorization'));
  if (!sbUser) {
    return c.json({
      error: 'Authentication required. You must first log in or create an account with Supabase to generate an API key.',
      requires_auth: true,
    }, 401);
  }

  const body: CreateKeyBody = await c.req.json<CreateKeyBody>().catch(() => ({}));
  const keyType = (['unified', 'memory', 'search'].includes(body.key_type || '') ? body.key_type : 'unified') as 'unified' | 'memory' | 'search';

  try {
    const defaultLabel = keyType === 'memory' 
      ? 'UltraMemory API Key' 
      : keyType === 'search' 
        ? 'UltraSearch API Key' 
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
    return c.json({
      error: 'Authentication required. You must first log in or create an account with Supabase to view your API keys.',
      requires_auth: true,
    }, 401);
  }

  const keys = await listUserKeys(c.env, sbUser.id);
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

