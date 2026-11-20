// UltraSearch — Cloudflare Edge Web Crawler
// 100% Autonomous Web Crawler and Document Ingestion Pipeline.
// Fetches, parses, strips boilerplate, extracts links, and indexes into D1 FTS5.

import type { Env } from '../types';

export interface CrawlResult {
  url:         string;
  domain:      string;
  title:       string;
  description: string;
  snippet:     string;
  content:     string;
  wordCount:   number;
  outlinks:    string[];
  status:      'indexed' | 'skipped' | 'failed';
  error?:      string;
}

const USER_AGENT = 'UltraSearchBot/1.0 (+https://ultrasearch.dev/bot; Autonomous Edge Crawler)';
const MAX_OUTLINKS = 50;

// ── Canonical URL helper ─────────────────────────────────────────────────────

export function getDomain(rawUrl: string): string {
  try {
    return new URL(rawUrl).hostname.toLowerCase();
  } catch {
    return '';
  }
}

export function cleanUrl(rawUrl: string, baseUrl?: string): string | null {
  try {
    const resolved = baseUrl ? new URL(rawUrl, baseUrl) : new URL(rawUrl);
    if (!['http:', 'https:'].includes(resolved.protocol)) return null;

    // Drop tracking parameters and anchors
    const stripParams = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'ref'];
    for (const p of stripParams) {
      resolved.searchParams.delete(p);
    }
    resolved.hash = '';

    // Remove trailing slash for consistency
    let clean = resolved.toString();
    if (clean.endsWith('/') && resolved.pathname !== '/') {
      clean = clean.slice(0, -1);
    }
    return clean;
  } catch {
    return null;
  }
}

// ── Streaming HTML Extractor using Cloudflare HTMLRewriter ───────────────────

export async function parseHtml(htmlResponse: Response, pageUrl: string): Promise<{
  title:       string;
  description: string;
  headings:    string[];
  textParts:   string[];
  outlinks:    string[];
}> {
  let title = '';
  let description = '';
  const headings: string[] = [];
  const textParts: string[] = [];
  const outlinks: string[] = [];

  const rewriter = new HTMLRewriter()
    .on('title', {
      text(chunk) {
        title += chunk.text;
      },
    })
    .on('meta[name="description" i], meta[property="og:description" i]', {
      element(el) {
        const desc = el.getAttribute('content');
        if (desc && !description) {
          description = desc.trim();
        }
      },
    })
    .on('h1, h2, h3', {
      text(chunk) {
        if (chunk.text.trim()) {
          headings.push(chunk.text.trim());
        }
      },
    })
    .on('p, article, main, section, li', {
      text(chunk) {
        const t = chunk.text.replace(/\s+/g, ' ');
        if (t.trim().length > 0) {
          textParts.push(t);
        }
      },
    })
    .on('a[href]', {
      element(el) {
        if (outlinks.length >= MAX_OUTLINKS) return;
        const href = el.getAttribute('href');
        if (href) {
          const resolved = cleanUrl(href, pageUrl);
          if (resolved && !outlinks.includes(resolved)) {
            // Avoid crawling audio, video, zip, pdf binary files
            if (!/\.(pdf|zip|tar|gz|exe|mp4|mp3|png|jpg|jpeg|gif|svg|webp)$/i.test(resolved)) {
              outlinks.push(resolved);
            }
          }
        }
      },
    });

  // Execute HTMLRewriter transformation
  await rewriter.transform(htmlResponse).text();

  return {
    title:       title.trim().replace(/\s+/g, ' '),
    description: description.replace(/\s+/g, ' '),
    headings,
    textParts,
    outlinks,
  };
}

// ── Hash for deduplication ───────────────────────────────────────────────────

export async function hashString(str: string): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return Array.from(new Uint8Array(buf))
    .slice(0, 16)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

// ── Crawl and Index a Single URL ─────────────────────────────────────────────

export async function crawlAndIndexUrl(
  env: Env,
  targetUrl: string,
  depth: number = 0,
  discoveredFrom?: string,
): Promise<CrawlResult> {
  const normalized = cleanUrl(targetUrl);
  if (!normalized) {
    return { url: targetUrl, domain: '', title: '', description: '', snippet: '', content: '', wordCount: 0, outlinks: [], status: 'failed', error: 'Invalid URL' };
  }

  const domain = getDomain(normalized);

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000); // 6s max per fetch

    const response = await fetch(normalized, {
      headers: {
        'User-Agent':      USER_AGENT,
        'Accept':          'text/html,application/xhtml+xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
    clearTimeout(timeout);

    if (!response.ok) {
      await env.DB.prepare('UPDATE crawl_queue SET status = ?, error = ?, crawled_at = ? WHERE url = ?')
        .bind('failed', `HTTP ${response.status}`, Date.now(), normalized)
        .run();
      return { url: normalized, domain, title: '', description: '', snippet: '', content: '', wordCount: 0, outlinks: [], status: 'failed', error: `HTTP ${response.status}` };
    }

    const contentType = response.headers.get('content-type') || '';
    if (!contentType.includes('text/html') && !contentType.includes('application/xhtml+xml')) {
      return { url: normalized, domain, title: '', description: '', snippet: '', content: '', wordCount: 0, outlinks: [], status: 'skipped', error: 'Not HTML' };
    }

    // Parse HTML
    const parsed = await parseHtml(response, normalized);
    const content = (parsed.headings.join(' ') + ' ' + parsed.textParts.join(' ')).replace(/\s+/g, ' ').trim();
    const wordCount = content.split(/\s+/).filter(Boolean).length;

    if (wordCount < 15) {
      return { url: normalized, domain, title: parsed.title, description: parsed.description, snippet: '', content: '', wordCount, outlinks: parsed.outlinks, status: 'skipped', error: 'Too little text' };
    }

    const snippet = parsed.description || content.slice(0, 280) + '...';
    const docId = await hashString(normalized);
    const simhash = await hashString(content.slice(0, 1000));
    const now = Date.now();

    // Check if doc already exists with same content hash
    const existing = await env.DB.prepare('SELECT doc_id FROM documents WHERE simhash = ?')
      .bind(simhash)
      .first<{ doc_id: string }>();

    if (existing && existing.doc_id !== docId) {
      // Duplicate page
      return { url: normalized, domain, title: parsed.title, description: parsed.description, snippet, content, wordCount, outlinks: parsed.outlinks, status: 'skipped', error: 'Duplicate content' };
    }

    // Upsert into D1 documents (FTS5 triggers automatically index into documents_fts)
    await env.DB.prepare(`
      INSERT INTO documents (doc_id, url, domain, title, description, snippet, content, word_count, pagerank, simhash, crawled_at, last_indexed_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0.5, ?, ?, ?)
      ON CONFLICT(doc_id) DO UPDATE SET
        title           = excluded.title,
        description     = excluded.description,
        snippet         = excluded.snippet,
        content         = excluded.content,
        word_count      = excluded.word_count,
        simhash         = excluded.simhash,
        last_indexed_at = excluded.last_indexed_at
    `).bind(
      docId,
      normalized,
      domain,
      parsed.title || normalized,
      parsed.description,
      snippet,
      content.slice(0, 20000), // Cap stored body text at 20KB for D1 efficiency
      wordCount,
      simhash,
      now,
      now
    ).run();

    // Enqueue unvisited outlinks (if within max crawl depth of 3)
    if (depth < 3 && parsed.outlinks.length > 0) {
      const queueInserts = parsed.outlinks.slice(0, 15).map(link => {
        const linkDomain = getDomain(link);
        return env.DB.prepare(`
          INSERT OR IGNORE INTO crawl_queue (url, domain, depth, priority, status, discovered_from, added_at)
          VALUES (?, ?, ?, ?, 'pending', ?, ?)
        `).bind(link, linkDomain, depth + 1, Math.max(0.1, 1.0 - (depth + 1) * 0.2), normalized, now);
      });

      // Batch execute in D1
      await env.DB.batch(queueInserts);
    }

    // Mark current URL as completed in queue
    await env.DB.prepare(`
      INSERT INTO crawl_queue (url, domain, depth, priority, status, discovered_from, added_at, crawled_at)
      VALUES (?, ?, ?, 1.0, 'completed', ?, ?, ?)
      ON CONFLICT(url) DO UPDATE SET status = 'completed', crawled_at = ?
    `).bind(normalized, domain, depth, discoveredFrom || null, now, now, now).run();

    return {
      url:         normalized,
      domain,
      title:       parsed.title || normalized,
      description: parsed.description,
      snippet,
      content,
      wordCount,
      outlinks:    parsed.outlinks,
      status:      'indexed',
    };
  } catch (err: unknown) {
    const errorMsg = (err as Error).message || 'Fetch error';
    await env.DB.prepare('UPDATE crawl_queue SET status = ?, error = ?, crawled_at = ? WHERE url = ?')
      .bind('failed', errorMsg, Date.now(), normalized)
      .run();
    return { url: normalized, domain, title: '', description: '', snippet: '', content: '', wordCount: 0, outlinks: [], status: 'failed', error: errorMsg };
  }
}

// ── Batch Process Pending Queue (Scheduled Cron or On-Demand) ────────────────

export async function processCrawlQueue(env: Env, batchSize: number = 5): Promise<number> {
  const { results: pending } = await env.DB.prepare(`
    SELECT url, depth, discovered_from
    FROM crawl_queue
    WHERE status = 'pending'
    ORDER BY priority DESC, depth ASC
    LIMIT ?
  `).bind(batchSize).all<{ url: string; depth: number; discovered_from: string }>();

  if (!pending || pending.length === 0) return 0;

  // Mark them as crawling (single atomic D1 batch instead of N sequential updates)
  await env.DB.batch(
    pending.map(p => env.DB.prepare('UPDATE crawl_queue SET status = "crawling" WHERE url = ?').bind(p.url))
  );

  // Crawl concurrently
  const tasks = pending.map(p => crawlAndIndexUrl(env, p.url, p.depth, p.discovered_from));
  const results = await Promise.allSettled(tasks);

  const indexedCount = results.filter(r => r.status === 'fulfilled' && r.value.status === 'indexed').length;
  return indexedCount;
}
