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

async function searchIndexFts5(
  env: Env,
  query: string,
  limit: number,
  requireAllTokens = true,
): Promise<SearchResult[]> {
  const ftsMatch = requireAllTokens ? prepareFts5Query(query) : prepareOrFts5Query(query);

  try {
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
        snippet(documents_fts, 2, '<b>', '</b>', '...', 25) as matched_snippet
      FROM documents_fts f
      JOIN documents d ON d.rowid = f.rowid
      WHERE documents_fts MATCH ?
      ORDER BY (bm25(documents_fts, 5.0, 2.5, 1.5, 0.5) * -1.0) + (d.pagerank * 0.4) DESC
      LIMIT ?
    `).bind(ftsMatch, limit).all<DbSearchResult>();

    if (!results || results.length === 0) {
      if (requireAllTokens) {
        // Fall back to OR query if strict AND yields 0 matches
        return searchIndexFts5(env, query, limit, false);
      }
      return [];
    }

    return results.map(r => ({
      title:          r.title || r.url,
      url:            r.url,
      snippet:        r.matched_snippet || r.snippet || r.description || r.content.slice(0, 250),
      source:         'ultrasearch-index',
      score:          Math.round(((r.bm25_score * -1.0) + (r.pagerank * 0.5) + 1.0) * 100) / 100,
      published_date: r.crawled_at ? new Date(r.crawled_at).toISOString() : undefined,
      full_content:   r.content ? r.content.slice(0, 3000) : undefined,
    }));
  } catch (err: unknown) {
    console.error('FTS5 search error:', err);
    return [];
  }
}

// ── Mode 1: Instant Search (<50ms) ───────────────────────────────────────────

async function executeInstantSearch(
  env: Env,
  query: string,
  count: number,
): Promise<SearchResult[]> {
  return searchIndexFts5(env, query, count, true);
}

// ── Mode 2: Standard Search (100–300ms) ───────────────────────────────────────

async function executeStandardSearch(
  env: Env,
  query: string,
  count: number,
): Promise<SearchResult[]> {
  const results = await searchIndexFts5(env, query, count, true);

  // If index has few results, inspect crawl queue or crawl relevant sites on-the-fly
  if (results.length < 3) {
    // Check if query mentions a specific domain or website
    const domainMatch = query.match(/([a-z0-9-]+\.(?:com|org|io|dev|net|edu))/i);
    if (domainMatch) {
      const targetUrl = `https://${domainMatch[1]}`;
      const crawled = await crawlAndIndexUrl(env, targetUrl, 0);
      if (crawled.status === 'indexed') {
        return searchIndexFts5(env, query, count, false);
      }
    }
  }

  return results;
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

  const searchTasks = subQueries.map(sq => searchIndexFts5(env, sq, Math.ceil(count / 2), false));
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
    `Synthesized from **${topResults.length} independent sources** retrieved from the UltraSearch index.\n`,
  ];

  topResults.slice(0, 5).forEach((item, idx) => {
    synthesisParts.push(`#### [${idx + 1}] ${item.title}`);
    synthesisParts.push(`- **URL:** ${item.url}`);
    synthesisParts.push(`- **Relevance Score:** ${item.score}`);
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
  const t0 = Date.now();
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

  const durationMs = Date.now() - t0;

  return {
    query,
    results,
    total_results:  results.length,
    search_time_ms: durationMs,
    cached:         false,
    backends_used:  ['ultrasearch-fts5-engine'],
    mode:           activeMode,
    metadata: {
      engine:        'UltraSearch Autonomous Edge Index',
      version:       '1.0.0',
      mode:          activeMode,
      mode_name:     activeMode === 1 ? 'instant' : activeMode === 2 ? 'standard' : 'deep_research',
      reason:        classification.reason,
      sub_queries:   subQueries,
      synthesis:     synthesis,
    },
  };
}
