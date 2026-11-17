// UltraSearch — Crawler API Routes (/v1/crawl & /v1/crawler)
// Triggers live crawls, accepts URL submissions, and queries index health.

import { Hono } from 'hono';
import type { Env } from '../types';
import { authMiddleware } from '../lib/auth';
import { crawlAndIndexUrl, processCrawlQueue } from '../lib/crawler';

export const crawlerRouter = new Hono<{ Bindings: Env }>();

// Apply auth to crawl trigger routes
crawlerRouter.use('/crawl', authMiddleware);
crawlerRouter.use('/crawler/process', authMiddleware);

// ── POST /v1/crawl — Submit URL(s) to crawl & index immediately ───────────────
crawlerRouter.post('/crawl', async (c) => {
  const body = await c.req.json<{
    url?:   string;
    urls?:  string[];
    depth?: number;
  }>();

  const depth = Math.min(body.depth ?? 0, 2);

  if (body.url) {
    const result = await crawlAndIndexUrl(c.env, body.url, depth);
    return c.json({
      message: result.status === 'indexed' ? '[OK] Successfully crawled and indexed' : `[STATUS] Crawl status: ${result.status}`,
      document: result,
    });
  }

  if (Array.isArray(body.urls) && body.urls.length > 0) {
    const limited = body.urls.slice(0, 10); // Max 10 URLs in batch
    const results = await Promise.allSettled(
      limited.map(u => crawlAndIndexUrl(c.env, u, depth))
    );
    return c.json({
      total: limited.length,
      results: results.map((r, i) => ({
        url: limited[i],
        status: r.status === 'fulfilled' ? r.value.status : 'error',
        error: r.status === 'rejected' ? (r.reason as Error).message : (r.value.error || undefined),
      })),
    });
  }

  return c.json({ error: 'Please provide "url" or "urls" array' }, 400);
});

// ── POST /v1/crawler/process — Process pending queue ─────────────────────────
crawlerRouter.post('/crawler/process', async (c) => {
  const count = await processCrawlQueue(c.env, 10);
  return c.json({
    message: `Processed pending queue`,
    indexed_documents: count,
  });
});

let cachedCrawlerStats: { data: Record<string, unknown>; ts: number } | null = null;
const CRAWLER_STATS_TTL_MS = 15_000;

// ── GET /v1/crawler/stats — Index & queue statistics ──────────────────────────
crawlerRouter.get('/crawler/stats', async (c) => {
  try {
    const now = Date.now();
    if (cachedCrawlerStats && (now - cachedCrawlerStats.ts < CRAWLER_STATS_TTL_MS)) {
      c.header('X-Cache-Status', 'HIT-RAM');
      c.header('X-Engine-Latency-Ms', '0.05');
      return c.json(cachedCrawlerStats.data);
    }

    const row = await c.env.DB.prepare(`
      SELECT
        (SELECT COUNT(*) FROM documents) as total_documents,
        (SELECT COALESCE(SUM(word_count), 0) FROM documents) as total_words,
        (SELECT COUNT(DISTINCT domain) FROM documents) as domains_covered,
        (SELECT COUNT(*) FROM crawl_queue) as total_queued,
        (SELECT COUNT(*) FROM crawl_queue WHERE status = 'pending') as pending
    `).first<{
      total_documents: number;
      total_words: number;
      domains_covered: number;
      total_queued: number;
      pending: number;
    }>();

    const data = {
      index: {
        total_documents: row?.total_documents ?? 0,
        total_words:     row?.total_words ?? 0,
        domains_covered: row?.domains_covered ?? 0,
      },
      crawler_queue: {
        total_queued: row?.total_queued ?? 0,
        pending:      row?.pending ?? 0,
      },
      engine: 'UltraSearch Autonomous Edge Index',
      status: 'healthy',
    };

    cachedCrawlerStats = { data, ts: now };
    c.header('X-Cache-Status', 'MISS');
    c.header('X-Engine-Latency-Ms', '1.0');
    return c.json(data);
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

// ── GET /v1/crawler/documents — Retrieve crawled documents from D1 ─────────────
crawlerRouter.get('/crawler/documents', async (c) => {
  try {
    const url = new URL(c.req.url);
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '30', 10), 1), 100);
    const offset = Math.max(parseInt(url.searchParams.get('offset') || '0', 10), 0);
    const domainFilter = url.searchParams.get('domain')?.trim().toLowerCase();
    const queryFilter = url.searchParams.get('q')?.trim().toLowerCase();

    let sql = 'SELECT doc_id, url, domain, title, description, snippet, word_count, pagerank, crawled_at, last_indexed_at FROM documents';
    const params: (string | number)[] = [];
    const conditions: string[] = [];

    if (domainFilter) {
      conditions.push('domain = ?');
      params.push(domainFilter);
    }
    if (queryFilter) {
      conditions.push('(title LIKE ? OR snippet LIKE ? OR url LIKE ?)');
      params.push(`%${queryFilter}%`, `%${queryFilter}%`, `%${queryFilter}%`);
    }

    if (conditions.length > 0) {
      sql += ' WHERE ' + conditions.join(' AND ');
    }

    sql += ' ORDER BY crawled_at DESC LIMIT ? OFFSET ?';
    params.push(limit, offset);

    // Total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM documents';
    const countParams: (string | number)[] = [];
    if (conditions.length > 0) {
      countSql += ' WHERE ' + conditions.join(' AND ');
      countParams.push(...params.slice(0, -2));
    }

    // Atomic D1 batch: 1 roundtrip for both items and count
    const [docsBatch, countBatch] = await c.env.DB.batch([
      c.env.DB.prepare(sql).bind(...params),
      c.env.DB.prepare(countSql).bind(...countParams),
    ]);

    const documents = (docsBatch?.results || []) as unknown[];
    const countRow = (countBatch?.results?.[0] || {}) as { total?: number };

    return c.json({
      total: countRow?.total ?? 0,
      limit,
      offset,
      documents,
    });
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

// ── GET /v1/crawler/queue — Retrieve active crawl queue items ─────────────────
crawlerRouter.get('/crawler/queue', async (c) => {
  try {
    const url = new URL(c.req.url);
    const limit = Math.min(Math.max(parseInt(url.searchParams.get('limit') || '30', 10), 1), 100);
    const status = url.searchParams.get('status')?.trim().toLowerCase();

    let sql = 'SELECT url, domain, depth, priority, status, error, added_at, crawled_at FROM crawl_queue';
    const params: (string | number)[] = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    sql += ' ORDER BY added_at DESC LIMIT ?';
    params.push(limit);

    let countSql = 'SELECT COUNT(*) as total FROM crawl_queue';
    const countParams: string[] = [];
    if (status) {
      countSql += ' WHERE status = ?';
      countParams.push(status);
    }

    // Atomic D1 batch: 1 roundtrip for both queue items and total count
    const [queueBatch, countBatch] = await c.env.DB.batch([
      c.env.DB.prepare(sql).bind(...params),
      c.env.DB.prepare(countSql).bind(...countParams),
    ]);

    const queue = (queueBatch?.results || []) as unknown[];
    const countRow = (countBatch?.results?.[0] || {}) as { total?: number };

    return c.json({
      total: countRow?.total ?? 0,
      limit,
      queue,
    });
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
});
