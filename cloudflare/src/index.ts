// UltraSearch — Main Cloudflare Worker Entry Point
// Routes all traffic, exports Durable Object, handles CORS.

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import type { Env } from './types';
import { searchRouter } from './routes/search';
import { keysRouter }   from './routes/keys';
import { mcpRouter }    from './routes/mcp';

// Re-export Durable Object (required by Cloudflare runtime)
export { RateLimiter } from './durable-objects/rate-limiter';

// ── App ───────────────────────────────────────────────────────────────────────

const app = new Hono<{ Bindings: Env }>();

// ── Global Middleware ─────────────────────────────────────────────────────────

app.use('*', cors({
  origin:  '*',
  allowMethods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'X-API-Key', 'Authorization'],
  exposeHeaders: ['X-RateLimit-Limit', 'X-RateLimit-Remaining', 'X-RateLimit-Reset'],
}));

app.use('*', logger());
app.use('*', prettyJSON());

// ── Routes ────────────────────────────────────────────────────────────────────

// Health
app.get('/', c => c.json({
  name:    c.env.APP_NAME,
  version: c.env.APP_VERSION,
  status:  'ok',
  docs:    'https://ultrasearch.dev/docs',
  mcp:     `${new URL(c.req.url).origin}/mcp`,
}));

app.get('/health', c => c.json({ status: 'ok', ts: new Date().toISOString() }));

// Plans (public — no auth required)
app.get('/v1/plans', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT * FROM plans')
    .all();
  return c.json({ plans: results });
});

// Mounted sub-routers
app.route('/v1/search', searchRouter);
app.route('/v1/keys',   keysRouter);
app.route('/v1/usage',  keysRouter);  // /v1/usage → keysRouter handles /usage path
app.route('/mcp',       mcpRouter);

// 404
app.notFound(c => c.json({ error: 'Not found', docs: 'https://ultrasearch.dev/docs' }, 404));

// 500
app.onError((err, c) => {
  console.error('Unhandled error:', err);
  return c.json({ error: 'Internal server error' }, 500);
});

// ── Export ────────────────────────────────────────────────────────────────────

export default app;
