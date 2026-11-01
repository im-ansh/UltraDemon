// UltraSearch — Main Cloudflare Worker Entry Point
// Routes all traffic, exports Durable Object & Scheduled Cron Crawler, handles CORS.
// 100% Autonomous — Zero external API dependencies.

import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { prettyJSON } from 'hono/pretty-json';
import type { Env } from './types';
import { searchRouter }  from './routes/search';
import { keysRouter }    from './routes/keys';
import { mcpRouter }     from './routes/mcp';
import { crawlerRouter } from './routes/crawler';
import { processCrawlQueue } from './lib/crawler';

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

// Health & System Info
app.get('/', c => c.json({
  name:    c.env.APP_NAME || 'UltraSearch API',
  version: c.env.APP_VERSION || '1.0.0',
  engine:  'Autonomous SQLite FTS5 BM25 Edge Search Index',
  status:  'operational',
  mcp:     `${new URL(c.req.url).origin}/mcp`,
  docs:    'https://github.com/im-ansh/Ultrademon',
}));

app.get('/health', c => c.json({ status: 'ok', ts: new Date().toISOString() }));

// Plans (public)
app.get('/v1/plans', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT * FROM plans')
    .all();
  return c.json({ plans: results });
});

// Mounted sub-routers
app.route('/v1/search', searchRouter);
app.route('/v1/keys',   keysRouter);
app.route('/v1/usage',  keysRouter);
app.route('/v1',        crawlerRouter);
app.route('/mcp',       mcpRouter);

// 404 handler
app.notFound(c => c.json({ error: 'Endpoint not found', available_endpoints: ['/v1/search', '/v1/keys', '/v1/crawl', '/v1/crawler/stats', '/mcp'] }, 404));

// 500 handler
app.onError((err, c) => {
  console.error('Unhandled worker error:', err);
  return c.json({ error: 'Internal server error', message: err.message }, 500);
});

// ── Worker Export with Scheduled Cron Support ─────────────────────────────────

export default {
  fetch: app.fetch,

  // Scheduled background crawler job (e.g. every 15-30 mins)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`[Crawler Cron] Running scheduled crawler tick at ${new Date(event.scheduledTime).toISOString()}`);
    ctx.waitUntil(processCrawlQueue(env, 15));
  },
};
