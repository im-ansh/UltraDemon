// UltraSearch — Autonomous Search Engine (100% Self-Hosted)
// Uses native SQLite FTS5 with BM25 ranking, PageRank scoring,
// query classification, and dynamic edge crawler integration.
// ZERO 3rd-party search APIs required.

import type { Env, SearchResult, SearchResponse } from '../types';
import { crawlAndIndexUrl } from './crawler';

export interface SearchOptions {
  numResults?: number;
  mode?:        1 | 2 | 3;
  semantic?:    boolean;
  newsOnly?:    boolean;
  domain?:      string;
}

// ── Query Classifier ─────────────────────────────────────────────────────────

export function classifyQuery(query: string): { mode: 1 | 2 | 3; reason: string } {
  const q = query.toLowerCase().trim();
  const words = q.split(/\s+/).filter(Boolean);

  const deepTriggers = [
    'analysis', 'analyze', 'research', 'comprehensive', 'in-depth',
    'detailed report', 'compare and contrast', 'investigate', 'history of',
    'synthesize', 'timeline of', 'breakdown of',
  ];

  const standardTriggers = [
    'compare', 'vs', 'versus', 'difference between', 'how does',
    'how to', 'explain', 'pros and cons', 'overview', 'latest',
  ];

  if (deepTriggers.some(t => q.includes(t)) || words.length > 12) {
    return { mode: 3, reason: 'Detected deep research and comparative intent' };
  }

  if (standardTriggers.some(t => q.includes(t)) || words.length >= 5) {
    return { mode: 2, reason: 'Standard query with multi-faceted terms' };
  }

  return { mode: 1, reason: 'Short factual lookup' };
}

// ── Sanitize query string for SQLite FTS5 MATCH ──────────────────────────────

function prepareFts5Query(query: string): string {
  // Strip special FTS5 operators to avoid syntax errors
  const clean = query.replace(/['"/*^:()\-+]/g, ' ').trim();
  const tokens = clean.split(/\s+/).filter(t => t.length > 1);

  if (tokens.length === 0) return '""';

  // Format as prefix match for each term (e.g., "python* AND script*")
  return tokens.map(t => `"${t}"*`).join(' AND ');
}

function prepareOrFts5Query(query: string): string {
  const clean = query.replace(/['"/*^:()\-+]/g, ' ').trim();
  const tokens = clean.split(/\s+/).filter(t => t.length > 1);
  if (tokens.length === 0) return '""';
  return tokens.map(t => `"${t}"*`).join(' OR ');
}

// ── D1 FTS5 BM25 Search ───────────────────────────────────────────────────────

interface DbSearchResult {
  doc_id:          string;
  url:             string;
  domain:          string;
  title:           string;
  description:     string;
  snippet:         string;
  content:         string;
  pagerank:        number;
  crawled_at:      number;
  bm25_score:      number;
  matched_snippet: string;
}

// ── In-Isolate Memory Cache for Mode 1 (Instant Search) ──────────────────────
interface MemoryCacheItem {
  results: SearchResult[];
  ts: number;
}
const INSTANT_CACHE = new Map<string, MemoryCacheItem>();
const MAX_INSTANT_CACHE_SIZE = 500;
const INSTANT_CACHE_TTL_MS = 60_000; // 60 seconds

// ── Mode 1: Instant Search (<15ms Edge Fast-Path) ────────────────────────────

async function executeInstantSearch(
  env: Env,
  query: string,
  count: number,
): Promise<SearchResult[]> {
  const normKey = `${query.toLowerCase().trim()}:${count}`;
  const memCached = INSTANT_CACHE.get(normKey);
  if (memCached && (Date.now() - memCached.ts < INSTANT_CACHE_TTL_MS)) {
    return memCached.results;
  }

  const ftsMatch = prepareFts5Query(query);

  try {
    // Fast lightweight projection:
    // 1. NO d.content (prevents massive SQLite overflow page transfers).
    // 2. NO snippet() windowing tokenizer overhead on D1.
    // 3. Direct BM25 scoring with exact title and URL priority.
    const { results } = await env.DB.prepare(`
      SELECT
        d.doc_id,
        d.url,
        d.domain,
        d.title,
        d.description,
        d.snippet,
        d.pagerank,
        d.crawled_at,
        bm25(documents_fts, 10.0, 5.0, 2.0, 0.2) as bm25_score
      FROM documents_fts f
      JOIN documents d ON d.rowid = f.rowid
      WHERE documents_fts MATCH ?
      ORDER BY (bm25(documents_fts, 10.0, 5.0, 2.0, 0.2) * -1.0) + (d.pagerank * 0.3) DESC
      LIMIT ?
    `).bind(ftsMatch, count).all<{
      doc_id: string;
      url: string;
      domain: string;
      title: string;
      description: string;
      snippet: string;
      pagerank: number;
      crawled_at: number;
      bm25_score: number;
    }>();

    let formatted: SearchResult[] = [];
    if (results && results.length > 0) {
      formatted = results.map(r => ({
        title: r.title || r.url,
        url: r.url,
        snippet: r.snippet || r.description || 'Fast indexed entry',
        source: 'ultrasearch-instant-d1',
        score: Math.round(((r.bm25_score * -1.0) + (r.pagerank * 0.3) + 0.85) * 100) / 100,
        published_date: r.crawled_at ? new Date(r.crawled_at).toISOString() : undefined,
      }));
    } else {
      const orMatch = prepareOrFts5Query(query);
      const { results: orResults } = await env.DB.prepare(`
        SELECT
          d.doc_id,
          d.url,
          d.domain,
          d.title,
          d.description,
          d.snippet,
          d.pagerank,
          d.crawled_at,
          bm25(documents_fts, 10.0, 5.0, 2.0, 0.2) as bm25_score
        FROM documents_fts f
        JOIN documents d ON d.rowid = f.rowid
        WHERE documents_fts MATCH ?
        ORDER BY (bm25(documents_fts, 10.0, 5.0, 2.0, 0.2) * -1.0) + (d.pagerank * 0.3) DESC
        LIMIT ?
      `).bind(orMatch, count).all<{
        doc_id: string;
        url: string;
        domain: string;
        title: string;
        description: string;
        snippet: string;
        pagerank: number;
        crawled_at: number;
        bm25_score: number;
      }>();

      if (orResults && orResults.length > 0) {
        formatted = orResults.map(r => ({
          title: r.title || r.url,
          url: r.url,
          snippet: r.snippet || r.description || 'Fast indexed entry',
          source: 'ultrasearch-instant-d1',
          score: Math.round(((r.bm25_score * -1.0) + (r.pagerank * 0.2) + 0.5) * 100) / 100,
          published_date: r.crawled_at ? new Date(r.crawled_at).toISOString() : undefined,
        }));
      }
    }

    if (INSTANT_CACHE.size >= MAX_INSTANT_CACHE_SIZE) {
      const first = INSTANT_CACHE.keys().next().value;
      if (first) INSTANT_CACHE.delete(first);
    }
    INSTANT_CACHE.set(normKey, { results: formatted, ts: Date.now() });

    return formatted;
  } catch (err) {
    console.error('Instant search error:', err);
    return [];
  }
}

// ── Mode 2: Standard Search (Comprehensive Hybrid Search) ────────────────────

async function executeStandardSearch(
  env: Env,
  query: string,
  count: number,
): Promise<SearchResult[]> {
  const cleanQ = query.toLowerCase().trim();
  const ftsMatch = prepareFts5Query(query);

  try {
    // Mode 2 performs thorough multi-factor search:
    // - Dynamic snippet highlight extraction with SQLite snippet()
    // - Retrieval of full document context (content)
    // - Multi-signal hybrid re-ranking (BM25 + exact title bonus + domain match + PageRank + freshness)
    const { results } = await env.DB.prepare(`
      SELECT
        d.doc_id,
        d.url,
        d.domain,
        d.title,
        d.description,
        d.snippet,
        d.content,
        d.pagerank,
        d.crawled_at,
        bm25(documents_fts, 5.0, 2.5, 1.5, 0.5) as bm25_score,
        snippet(documents_fts, 2, '<b>', '</b>', '...', 30) as matched_snippet
      FROM documents_fts f
      JOIN documents d ON d.rowid = f.rowid
      WHERE documents_fts MATCH ?
      ORDER BY (bm25(documents_fts, 5.0, 2.5, 1.5, 0.5) * -1.0) + (d.pagerank * 0.5) DESC
      LIMIT ?
    `).bind(ftsMatch, count * 2).all<DbSearchResult>();

    let rawList = results || [];

    if (rawList.length === 0) {
      const orMatch = prepareOrFts5Query(query);
      const orRes = await env.DB.prepare(`
        SELECT
          d.doc_id,
          d.url,
          d.domain,
          d.title,
          d.description,
          d.snippet,
          d.content,
          d.pagerank,
          d.crawled_at,
          bm25(documents_fts, 4.0, 2.0, 1.0, 0.5) as bm25_score,
          snippet(documents_fts, 2, '<b>', '</b>', '...', 30) as matched_snippet
        FROM documents_fts f
        JOIN documents d ON d.rowid = f.rowid
        WHERE documents_fts MATCH ?
        ORDER BY (bm25(documents_fts, 4.0, 2.0, 1.0, 0.5) * -1.0) + (d.pagerank * 0.4) DESC
        LIMIT ?
      `).bind(orMatch, count * 2).all<DbSearchResult>();
      rawList = orRes.results || [];
    }

    if (rawList.length < 3) {
      const domainMatch = query.match(/([a-z0-9-]+\.(?:com|org|io|dev|net|edu))/i);
      if (domainMatch) {
        const targetUrl = `https://${domainMatch[1]}`;
        const crawled = await crawlAndIndexUrl(env, targetUrl, 0);
        if (crawled.status === 'indexed') {
          return executeStandardSearch(env, query, count);
        }
      }
    }

    // Hybrid Re-ranking & Deduplication
    const ranked: SearchResult[] = rawList.map(r => {
      const titleLower = (r.title || '').toLowerCase();
      const domainLower = (r.domain || '').toLowerCase();
      let bonus = 0;
      if (titleLower.includes(cleanQ)) bonus += 0.85;
      if (domainLower.includes(cleanQ)) bonus += 0.40;
      if (r.crawled_at && Date.now() - r.crawled_at < 7 * 86400 * 1000) bonus += 0.20;

      const hybridScore = Math.round(((r.bm25_score * -1.0) + (r.pagerank * 0.6) + bonus + 1.25) * 100) / 100;
      return {
        title: r.title || r.url,
        url: r.url,
        snippet: r.matched_snippet || r.snippet || r.description || r.content.slice(0, 300),
        source: 'ultrasearch-hybrid-d1',
        score: hybridScore,
        published_date: r.crawled_at ? new Date(r.crawled_at).toISOString() : undefined,
        full_content: r.content ? r.content.slice(0, 3000) : undefined,
      };
    });

    ranked.sort((a, b) => b.score - a.score);
    return ranked.slice(0, count);
  } catch (err) {
    console.error('Standard search error:', err);
    return [];
  }
}

// ── Mode 3: Deep Research (1–3s) ─────────────────────────────────────────────

async function executeDeepResearch(
  env: Env,
  query: string,
  count: number,
): Promise<{ results: SearchResult[]; subQueries: string[]; synthesis: string }> {
  // Generate multi-angled research sub-queries
  const subQueries = [
    query,
    `${query} overview architecture`,
    `${query} analysis history`,
    `${query} documentation guide`,
  ];

  const searchTasks = subQueries.map(sq => executeStandardSearch(env, sq, Math.ceil(count / 2)));
  const settled = await Promise.allSettled(searchTasks);

  const seenUrls = new Set<string>();
  const merged: SearchResult[] = [];

  for (const res of settled) {
    if (res.status === 'fulfilled') {
      for (const item of res.value) {
        if (!seenUrls.has(item.url)) {
          seenUrls.add(item.url);
          merged.push(item);
        }
      }
    }
  }

  // Sort by relevance score
  merged.sort((a, b) => b.score - a.score);
  const topResults = merged.slice(0, count);

  // Structured multi-source evidence synthesis
  const synthesisParts: string[] = [
    `### Research Synthesis for: "${query}"\n`,
    `Synthesized from **${topResults.length} independent sources** retrieved from the UltraSearch index across Cloudflare edge PoPs.\n`,
  ];

  topResults.slice(0, 5).forEach((item, idx) => {
    synthesisParts.push(`#### [${idx + 1}] ${item.title}`);
    synthesisParts.push(`- **URL:** ${item.url}`);
    synthesisParts.push(`- **Hybrid BM25 Score:** ${item.score}`);
    synthesisParts.push(`- **Key Findings:** ${item.snippet}\n`);
  });

  return {
    results:    topResults,
    subQueries,
    synthesis:  synthesisParts.join('\n'),
  };
}

// ── Main Search Orchestrator ──────────────────────────────────────────────────

export async function runSearch(
  env: Env,
  query: string,
  numResults: number = 10,
  forceMode?: 1 | 2 | 3,
): Promise<SearchResponse> {
  const t0 = performance.now();
  const classification = classifyQuery(query);
  const activeMode = forceMode || classification.mode;

  let results: SearchResult[] = [];
  let subQueries: string[] | undefined;
  let synthesis: string | undefined;

  if (activeMode === 1) {
    results = await executeInstantSearch(env, query, numResults);
  } else if (activeMode === 2) {
    results = await executeStandardSearch(env, query, numResults);
  } else {
    const deepOutput = await executeDeepResearch(env, query, numResults);
    results = deepOutput.results;
    subQueries = deepOutput.subQueries;
    synthesis = deepOutput.synthesis;
  }

  // If index is still completely empty for this query, provide informative guidance
  if (results.length === 0) {
    results.push({
      title:   `No indexed results found for "${query}"`,
      url:     'https://ultrasearch.dev/docs/crawler',
      snippet: `UltraSearch runs on its own independent index. You can index this domain or URL anytime using POST /v1/crawl with { "url": "https://..." } or calling the ultrasearch_crawl tool.`,
      source:  'ultrasearch-engine',
      score:   0.0,
    });
  }

  const durationMs = Math.max(1, Math.round(performance.now() - t0));

  return {
    query,
    results,
    total_results:  results.length,
    search_time_ms: durationMs,
    cached:         false,
    backends_used:  [
      activeMode === 1 ? 'ultrasearch-instant-d1' : activeMode === 2 ? 'ultrasearch-hybrid-d1' : 'ultrasearch-deep-multi-hop'
    ],
    mode:           activeMode,
    metadata: {
      engine:        'UltraSearch Autonomous Edge Index',
      version:       '2.0.0',
      mode:          activeMode,
      mode_name:     activeMode === 1 ? 'instant' : activeMode === 2 ? 'standard' : 'deep_research',
      latency_tier:  activeMode === 1 ? 'sub-15ms edge' : activeMode === 2 ? 'standard-hybrid' : 'deep-multi-hop',
      reason:        classification.reason,
      sub_queries:   subQueries,
      synthesis:     synthesis,
    },
  };
}
