// UltraSearch — Search Route (/v1/search)
// 100% Autonomous Search powered by D1 FTS5 BM25 Engine

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
    query:        string;
    num_results?: number;
    mode?:        1 | 2 | 3;
    use_cache?:   boolean;
  }>();

  if (!body.query?.trim()) {
    return c.json({ error: 'query is required' }, 400);
  }

  const record = c.get('keyRecord');
  const planRow = await c.env.DB
    .prepare('SELECT results_per_query FROM plans WHERE plan_id = ?')
    .bind(record.plan)
    .first<{ results_per_query: number }>();

  const numResults = Math.min(body.num_results ?? 10, planRow?.results_per_query ?? 10);
  const useCache   = body.use_cache ?? true;

  // Cache check
  const cacheParams = { n: numResults, mode: body.mode ?? 0 };
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
    body.mode,
  );

  // Cache the result (non-blocking)
  if (useCache) {
    c.executionCtx.waitUntil(
      setCachedSearch(c.env, body.query, cacheParams, result)
    );
  }

  return c.json(result);
});

// ── GET /v1/search?q=...&n=...&mode=... ───────────────────────────────────────
searchRouter.get('/', async (c) => {
  const query = c.req.query('q') ?? '';
  const n     = parseInt(c.req.query('n') ?? '10', 10);
  const modeParam = c.req.query('mode');
  const mode  = modeParam ? (parseInt(modeParam, 10) as 1 | 2 | 3) : undefined;

  if (!query.trim()) return c.json({ error: 'q parameter is required' }, 400);

  const record = c.get('keyRecord');
  const planRow = await c.env.DB
    .prepare('SELECT results_per_query FROM plans WHERE plan_id = ?')
    .bind(record.plan)
    .first<{ results_per_query: number }>();

  const numResults = Math.min(n, planRow?.results_per_query ?? 10);

  // Cache check
  const cacheParams = { n: numResults, mode: mode ?? 0 };
  const cached = await getCachedSearch(c.env, query, cacheParams);
  if (cached) {
    cached.cached = true;
    return c.json(cached);
  }

  const result = await runSearch(c.env, query, numResults, mode);
  c.executionCtx.waitUntil(setCachedSearch(c.env, query, cacheParams, result));
  return c.json(result);
});
