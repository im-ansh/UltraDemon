// UltraSearch — Parallel Search Engine (Cloudflare Workers)
// Fans out to Brave, Serper, Exa, Tavily simultaneously from the edge.
// Uses Promise.allSettled — if one backend fails, others still return.

import type { Env, SearchResult, SearchResponse } from '../types';

const TIMEOUT_MS = 3000; // 3s timeout per backend

// ── Timeout wrapper ───────────────────────────────────────────────────────────

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// ── Backend Adapters ──────────────────────────────────────────────────────────

async function searchBrave(
  apiKey: string,
  query: string,
  count: number,
): Promise<SearchResult[]> {
  const url = new URL('https://api.search.brave.com/res/v1/web/search');
  url.searchParams.set('q', query);
  url.searchParams.set('count', String(count));
  url.searchParams.set('result_filter', 'web');

  const resp = await fetch(url.toString(), {
    headers: {
      'Accept': 'application/json',
      'X-Subscription-Token': apiKey,
    },
  });
  if (!resp.ok) throw new Error(`Brave ${resp.status}`);

  const data = await resp.json<{ web?: { results?: Array<{ title: string; url: string; description: string; age?: string }> } }>();
  return (data.web?.results ?? []).map(r => ({
    title:          r.title,
    url:            r.url,
    snippet:        r.description ?? '',
    source:         'brave',
    score:          0.85,
    published_date: r.age,
  }));
}

async function searchSerper(
  apiKey: string,
  query: string,
  count: number,
): Promise<SearchResult[]> {
  const resp = await fetch('https://google.serper.dev/search', {
    method: 'POST',
    headers: {
      'X-API-KEY': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ q: query, num: count }),
  });
  if (!resp.ok) throw new Error(`Serper ${resp.status}`);

  const data = await resp.json<{ organic?: Array<{ title: string; link: string; snippet: string }> }>();
  return (data.organic ?? []).map(r => ({
    title:   r.title,
    url:     r.link,
    snippet: r.snippet ?? '',
    source:  'serper',
    score:   0.9,
  }));
}

async function searchExa(
  apiKey: string,
  query: string,
  count: number,
  semantic: boolean,
): Promise<SearchResult[]> {
  const resp = await fetch('https://api.exa.ai/search', {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      numResults: count,
      type: semantic ? 'neural' : 'keyword',
    }),
  });
  if (!resp.ok) throw new Error(`Exa ${resp.status}`);

  const data = await resp.json<{ results?: Array<{ title: string; url: string; text?: string; publishedDate?: string; score?: number }> }>();
  return (data.results ?? []).map(r => ({
    title:          r.title,
    url:            r.url,
    snippet:        (r.text ?? '').slice(0, 300),
    source:         'exa',
    score:          r.score ?? 0.75,
    published_date: r.publishedDate,
  }));
}

async function searchTavily(
  apiKey: string,
  query: string,
  count: number,
): Promise<SearchResult[]> {
  const resp = await fetch('https://api.tavily.com/search', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      max_results: count,
      include_answer: false,
    }),
  });
  if (!resp.ok) throw new Error(`Tavily ${resp.status}`);

  const data = await resp.json<{ results?: Array<{ title: string; url: string; content: string; score?: number; published_date?: string }> }>();
  return (data.results ?? []).map(r => ({
    title:          r.title,
    url:            r.url,
    snippet:        (r.content ?? '').slice(0, 300),
    source:         'tavily',
    score:          r.score ?? 0.7,
    published_date: r.published_date,
  }));
}

// ── D1 Own Index Search ───────────────────────────────────────────────────────

async function searchOwnIndex(
  env: Env,
  query: string,
  count: number,
): Promise<SearchResult[]> {
  // Tokenize query (simple whitespace split for edge)
  const terms = query.toLowerCase().split(/\s+/).filter(t => t.length > 2).slice(0, 10);
  if (terms.length === 0) return [];

  const placeholders = terms.map(() => '?').join(',');

  // Get matching doc_ids with aggregated tf score
  const { results: postingRows } = await env.DB
    .prepare(`
      SELECT doc_id, SUM(tf) as total_tf, MAX(title_match) as in_title
      FROM postings
      WHERE term IN (${placeholders})
      GROUP BY doc_id
      ORDER BY total_tf DESC, in_title DESC
      LIMIT ?
    `)
    .bind(...terms, count * 2)
    .all<{ doc_id: string; total_tf: number; in_title: number }>();

  if (postingRows.length === 0) return [];

  const docIds = postingRows.map(r => r.doc_id);
  const tfMap  = Object.fromEntries(postingRows.map(r => [r.doc_id, r.total_tf * (r.in_title ? 2.5 : 1)]));

  // Fetch document details
  const { results: docs } = await env.DB
    .prepare(`
      SELECT doc_id, url, title, snippet, pagerank
      FROM documents
      WHERE doc_id IN (${docIds.map(() => '?').join(',')})
    `)
    .bind(...docIds)
    .all<{ doc_id: string; url: string; title: string; snippet: string; pagerank: number }>();

  return docs
    .map(d => ({
      title:   d.title || d.url,
      url:     d.url,
      snippet: d.snippet,
      source:  'own_index',
      score:   (tfMap[d.doc_id] ?? 0) + d.pagerank * 0.2,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, count);
}

// ── Main Fan-Out Search ───────────────────────────────────────────────────────

export async function runSearch(
  env: Env,
  query: string,
  numResults: number = 10,
  semantic: boolean = false,
  newsOnly: boolean = false,
): Promise<SearchResponse> {
  const t0 = Date.now();
  const backendsUsed: string[] = [];
  const seen = new Set<string>();
  const allResults: SearchResult[] = [];

  // Fire ALL backends + own index in parallel
  const tasks: Array<Promise<SearchResult[]>> = [
    searchOwnIndex(env, query, numResults),
  ];
  const labels = ['own_index'];

  if (env.BRAVE_API_KEY) {
    tasks.push(withTimeout(searchBrave(env.BRAVE_API_KEY, query, numResults), TIMEOUT_MS));
    labels.push('brave');
  }
  if (env.SERPER_API_KEY) {
    tasks.push(withTimeout(searchSerper(env.SERPER_API_KEY, query, numResults), TIMEOUT_MS));
    labels.push('serper');
  }
  if (env.EXA_API_KEY) {
    tasks.push(withTimeout(searchExa(env.EXA_API_KEY, query, numResults, semantic), TIMEOUT_MS));
    labels.push('exa');
  }
  if (env.TAVILY_API_KEY) {
    tasks.push(withTimeout(searchTavily(env.TAVILY_API_KEY, query, numResults), TIMEOUT_MS));
    labels.push('tavily');
  }

  const settled = await Promise.allSettled(tasks);

  for (let i = 0; i < settled.length; i++) {
    const result = settled[i];
    if (result.status === 'fulfilled') {
      backendsUsed.push(labels[i]);
      for (const r of result.value) {
        if (!seen.has(r.url)) {
          seen.add(r.url);
          allResults.push(r);
        }
      }
    }
  }

  // No backends configured → mock mode
  if (allResults.length === 0) {
    for (let i = 1; i <= Math.min(numResults, 5); i++) {
      allResults.push({
        title:   `[MOCK] Result ${i} for: ${query}`,
        url:     `https://example.com/result-${i}`,
        snippet: `Configure BRAVE_API_KEY or SERPER_API_KEY to get live results. Mock result #${i}.`,
        source:  'mock',
        score:   1 - i * 0.1,
      });
    }
    backendsUsed.push('mock');
  }

  // Sort by score, cap at numResults
  allResults.sort((a, b) => b.score - a.score);
  const final = allResults.slice(0, numResults);

  return {
    query,
    results:        final,
    total_results:  final.length,
    search_time_ms: Date.now() - t0,
    cached:         false,
    backends_used:  backendsUsed,
    metadata:       { version: '1.0.0', semantic, news_only: newsOnly },
  };
}
