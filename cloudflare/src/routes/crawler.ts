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
      message: result.status === 'indexed' ? '✅ Successfully crawled and indexed' : `⚠️ Crawl status: ${result.status}`,
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

// ── GET /v1/crawler/stats — Index & queue statistics ──────────────────────────
crawlerRouter.get('/crawler/stats', async (c) => {
  try {
    const docsRow = await c.env.DB.prepare('SELECT COUNT(*) as cnt FROM documents').first<{ cnt: number }>();
    const wordsRow = await c.env.DB.prepare('SELECT SUM(word_count) as words FROM documents').first<{ words: number }>();
    const domainsRow = await c.env.DB.prepare('SELECT COUNT(DISTINCT domain) as domains FROM documents').first<{ domains: number }>().catch(() => ({ domains: 0 }));
    const queueRow = await c.env.DB.prepare('SELECT COUNT(*) as queue_size FROM crawl_queue').first<{ queue_size: number }>();
    const pendingRow = await c.env.DB.prepare("SELECT COUNT(*) as pending FROM crawl_queue WHERE status = 'pending'").first<{ pending: number }>();

    return c.json({
      index: {
        total_documents: docsRow?.cnt ?? 0,
        total_words:     wordsRow?.words ?? 0,
        domains_covered: domainsRow?.domains ?? 0,
      },
      crawler_queue: {
        total_queued: queueRow?.queue_size ?? 0,
        pending:      pendingRow?.pending ?? 0,
      },
      engine: 'UltraSearch Autonomous Edge Index',
      status: 'healthy',
    });
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
});
