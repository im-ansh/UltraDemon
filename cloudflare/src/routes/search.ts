// UltraSearch — Search Route (/v1/search)

import { Hono } from 'hono';
import type { Env } from '../types';
import { authMiddleware } from '../lib/auth';
import { runSearch } from '../lib/search-engine';
import { getCachedSearch, setCachedSearch } from '../lib/cache';

export const searchRouter = new Hono<{ Bindings: Env }>();

// Apply auth to all /v1/search routes
searchRouter.use('*', authMiddleware);

// ── POST /v1/search ──────────────────────────────────────────────────────────
searchRouter.post('/', async (c) => {
  const body = await c.req.json<{
    query: string;
    num_results?: number;
    semantic?: boolean;
    news_only?: boolean;
    use_cache?: boolean;
  }>();

  if (!body.query?.trim()) {
    return c.json({ error: 'query is required' }, 400);
  }

  const record = c.get('keyRecord');
  const planRow = await c.env.DB
    .prepare('SELECT results_per_query, semantic_search FROM plans WHERE plan_id = ?')
    .bind(record.plan)
    .first<{ results_per_query: number; semantic_search: number }>();

  const numResults = Math.min(body.num_results ?? 10, planRow?.results_per_query ?? 5);
  const semantic   = (body.semantic ?? false) && Boolean(planRow?.semantic_search);
  const useCache   = body.use_cache ?? true;

  // Cache check
  const cacheParams = { n: numResults, semantic, news: body.news_only ?? false };
  if (useCache) {
    const cached = await getCachedSearch(c.env, body.query, cacheParams);
    if (cached) {
      cached.cached = true;
      return c.json(cached);
    }
  }

  // Run search
  const result = await runSearch(
    c.env,
    body.query,
    numResults,
    semantic,
    body.news_only ?? false,
  );

  // Cache the result (non-blocking)
  if (useCache) {
    c.executionCtx.waitUntil(
      setCachedSearch(c.env, body.query, cacheParams, result)
    );
  }

  return c.json(result);
});

// ── GET /v1/search?q=...&n=... ───────────────────────────────────────────────
searchRouter.get('/', async (c) => {
  const query = c.req.query('q') ?? '';
  const n     = parseInt(c.req.query('n') ?? '10', 10);

  if (!query.trim()) return c.json({ error: 'q is required' }, 400);

  const record = c.get('keyRecord');
  const planRow = await c.env.DB
    .prepare('SELECT results_per_query FROM plans WHERE plan_id = ?')
    .bind(record.plan)
    .first<{ results_per_query: number }>();

  const numResults = Math.min(n, planRow?.results_per_query ?? 5);

  // Cache check
  const cached = await getCachedSearch(c.env, query, { n: numResults });
  if (cached) { cached.cached = true; return c.json(cached); }

  const result = await runSearch(c.env, query, numResults);
  c.executionCtx.waitUntil(setCachedSearch(c.env, query, { n: numResults }, result));
  return c.json(result);
});
