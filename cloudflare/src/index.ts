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
import { memoryRouter }  from './routes/memory';
import { mcpRouter }     from './routes/mcp';
import { crawlerRouter } from './routes/crawler';
import { openapiRouter } from './routes/openapi';
import { authRouter }    from './routes/auth';
import { authMiddleware } from './lib/auth';
import { getUsage } from './lib/api-keys';
import { renderLandingPage } from './ui/landing';
import { renderAuthPage } from './ui/auth-pages';
import { renderAppDashboard } from './ui/app';
import { MICHELANGELUS_BOLD_ITALIC_B64 } from './ui/font';
import { HERO_BRAIN_WEBP_B64, HERO_LENS_WEBP_B64 } from './ui/hero-assets';
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

// Landing Page & Developer Platform UI
app.get('/', (c) => {
  const accept = c.req.header('accept') || '';
  const origin = new URL(c.req.url).origin;

  // Serve landing page and console to browsers
  if (accept.includes('text/html') || !accept.includes('application/json')) {
    c.header('Cache-Control', 'no-cache, no-store, must-revalidate');
    c.header('Pragma', 'no-cache');
    c.header('Expires', '0');
    return c.html(renderLandingPage(origin, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
  }

  // Fallback to JSON API info for curl / programmatic requests
  return c.json({
    name:        c.env.APP_NAME || 'UltraSearch API',
    version:     c.env.APP_VERSION || '1.0.0',
    engine:      'Autonomous SQLite FTS5 BM25 Edge Search Index',
    status:      'operational',
    web_console: origin,
    endpoints: {
      search:       `${origin}/v1/search`,
      memory:       `${origin}/v1/memory`,
      memory_query: `${origin}/v1/memory/query`,
      memory_file:  `${origin}/v1/memory/file`,
      keys:         `${origin}/v1/keys`,
      crawler:      `${origin}/v1/crawl`,
      stats:        `${origin}/v1/crawler/stats`,
      mcp:          `${origin}/mcp`,
      openapi:      `${origin}/openapi.json`,
      tools:        `${origin}/v1/tools`,
    },
    docs: 'https://github.com/im-ansh/UltraDemon',
  });
});

// Dedicated Auth Pages
app.get('/login', (c) => {
  const origin = new URL(c.req.url).origin;
  return c.html(renderAuthPage('login', origin, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
});

app.get('/signup', (c) => {
  const origin = new URL(c.req.url).origin;
  return c.html(renderAuthPage('signup', origin, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
});

// Dedicated Developer App / Dashboard Workspace
app.get('/app', (c) => {
  const origin = new URL(c.req.url).origin;
  return c.html(renderAppDashboard(origin, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
});

app.get('/dashboard', (c) => {
  const origin = new URL(c.req.url).origin;
  return c.html(renderAppDashboard(origin, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
});

app.get('/console', (c) => {
  const origin = new URL(c.req.url).origin;
  return c.html(renderAppDashboard(origin, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
});

app.get('/docs', (c) => {
  const origin = new URL(c.req.url).origin;
  return c.html(renderLandingPage(origin, c.env.SUPABASE_URL, c.env.SUPABASE_ANON_KEY));
});

// Health check
app.get('/health', c => c.json({ status: 'ok', ts: new Date().toISOString() }));

// Serve custom Michelangelus font directly from edge
app.get('/fonts/Michelangelus-BoldItalic.ttf', () => {
  const binaryString = atob(MICHELANGELUS_BOLD_ITALIC_B64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Response(bytes.buffer, {
    headers: {
      'Content-Type': 'font/ttf',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
});

// Serve 3D Hero Brand Assets directly from edge
app.get('/images/hero-brain.webp', () => {
  const binaryString = atob(HERO_BRAIN_WEBP_B64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Response(bytes.buffer, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
});

app.get('/images/hero-lens.webp', () => {
  const binaryString = atob(HERO_LENS_WEBP_B64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return new Response(bytes.buffer, {
    headers: {
      'Content-Type': 'image/webp',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
    },
  });
});

// Plans (public)
app.get('/v1/plans', async (c) => {
  const { results } = await c.env.DB
    .prepare('SELECT * FROM plans')
    .all();
  return c.json({ plans: results });
});

// Mounted sub-routers
app.route('/v1/auth',   authRouter);
app.route('/v1/search', searchRouter);
app.route('/v1/memory', memoryRouter);
app.route('/v1/keys',   keysRouter);
app.get('/v1/usage', authMiddleware, async (c) => {
  const plainKey = c.get('plainKey');
  try {
    const stats = await getUsage(c.env, plainKey);
    return c.json(stats);
  } catch (e: unknown) {
    return c.json({ error: (e as Error).message }, 404);
  }
});
app.route('/v1',        crawlerRouter);
app.route('/mcp',       mcpRouter);
app.route('/',          openapiRouter); // /openapi.json and /v1/tools

// 404 handler
app.notFound(c => c.json({
  error: 'Endpoint not found',
  available_endpoints: [
    '/',
    '/console',
    '/v1/search',
    '/v1/memory',
    '/v1/memory/query',
    '/v1/memory/file',
    '/v1/keys',
    '/v1/usage',
    '/v1/crawl',
    '/v1/crawler/stats',
    '/mcp',
    '/openapi.json',
    '/v1/tools'
  ]
}, 404));

// 500 handler
app.onError((err, c) => {
  console.error('Unhandled worker error:', err);
  return c.json({ error: 'Internal server error', message: err.message }, 500);
});

// ── Worker Export with Scheduled Cron Support ─────────────────────────────────

export default {
  fetch: app.fetch,

  // Scheduled background crawler job (every 15 mins)
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`[Crawler Cron] Running scheduled crawler tick at ${new Date(event.scheduledTime).toISOString()}`);
    ctx.waitUntil(processCrawlQueue(env, 15));
  },
};
