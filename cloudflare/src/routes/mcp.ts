// UltraSearch — MCP Route (/mcp)
// Full Model Context Protocol server running on Cloudflare Workers edge.
// Compatible with Claude Desktop, Cursor, Windsurf, and any MCP client.
// Supports both HTTP POST (stateless) and SSE (streaming) transports.
// 100% Autonomous — powered by your own D1 FTS5 search index and web crawler.

import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import type { Env } from '../types';
import { runSearch } from '../lib/search-engine';
import { createApiKey, getUsage } from '../lib/api-keys';
import { crawlAndIndexUrl } from '../lib/crawler';

export const mcpRouter = new Hono<{ Bindings: Env }>();

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_INFO = {
  name:        'ultrasearch',
  version:     '1.0.0',
  description: 'UltraSearch Autonomous Search Engine & Web Index — <50ms edge search for AI agents',
};

// ── Tool Definitions ──────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'ultrasearch_web',
    description: '⚡ Ultra-fast web search powered by your own Cloudflare D1 FTS5 index. Returns BM25-ranked passages, matched snippets, and PageRank scores. Latency: <50ms globally.',
    inputSchema: {
      type: 'object',
      properties: {
        query:       { type: 'string', description: 'Search query to look up in the web index', minLength: 1, maxLength: 500 },
        num_results: { type: 'integer', description: 'Number of results (1–50)', default: 10, minimum: 1, maximum: 50 },
        mode:        { type: 'integer', description: 'Search mode: 1 (Instant <50ms), 2 (Standard), 3 (Deep Research)', enum: [1, 2, 3], default: 1 },
      },
      required: ['query'],
    },
  },
  {
    name: 'ultrasearch_research',
    description: '🔬 Deep multi-hop research search. Expands query into multi-angled sub-queries, cross-references sources across the index, and synthesizes structured evidence with citations.',
    inputSchema: {
      type: 'object',
      properties: {
        query:       { type: 'string', description: 'Complex research topic or analytical query' },
        num_results: { type: 'integer', description: 'Number of sources to retrieve (1–20)', default: 10, minimum: 1, maximum: 20 },
      },
      required: ['query'],
    },
  },
  {
    name: 'ultrasearch_crawl',
    description: '🕷️ Web Crawler: Fetch, parse, extract main content, and index any live URL or website directly into the UltraSearch index.',
    inputSchema: {
      type: 'object',
      properties: {
        url:   { type: 'string', description: 'Full URL to crawl and index (e.g. https://docs.python.org)' },
        depth: { type: 'integer', description: 'Crawl depth for discovering outgoing links (0 to 2)', default: 0, minimum: 0, maximum: 2 },
      },
      required: ['url'],
    },
  },
  {
    name: 'ultrasearch_index_stats',
    description: '📊 Check UltraSearch index statistics: total documents indexed, total words, domains covered, and crawler queue health.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'ultrasearch_usage',
    description: '📊 Check your UltraSearch API key quota and usage. Returns plan, daily limit, requests used today, remaining quota, and reset time.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'ultrasearch_provision_key',
    description: '🔑 Create a new UltraSearch API key. Returns the plain key ONCE — save it immediately.',
    inputSchema: {
      type: 'object',
      properties: {
        user_id: { type: 'string', description: 'Your unique user/account ID' },
        plan:    { type: 'string', description: 'Plan: free | pro | ultra | enterprise', enum: ['free', 'pro', 'ultra', 'enterprise'], default: 'free' },
        label:   { type: 'string', description: 'Label for this key', default: '' },
      },
      required: ['user_id'],
    },
  },
];

// ── Tool Handler ──────────────────────────────────────────────────────────────

async function handleTool(
  env: Env,
  name: string,
  args: Record<string, unknown>,
  apiKey?: string,
): Promise<unknown> {
  if (name === 'ultrasearch_web') {
    const mode = args.mode ? (Number(args.mode) as 1 | 2 | 3) : undefined;
    return runSearch(env, String(args.query), Number(args.num_results ?? 10), mode);
  }
  if (name === 'ultrasearch_research') {
    return runSearch(env, String(args.query), Number(args.num_results ?? 10), 3);
  }
  if (name === 'ultrasearch_crawl') {
    const url = String(args.url);
    const depth = Number(args.depth ?? 0);
    const res = await crawlAndIndexUrl(env, url, depth);
    return {
      message: res.status === 'indexed' ? `✅ Successfully crawled and indexed ${url}` : `⚠️ Status: ${res.status} (${res.error || ''})`,
      document: {
        title: res.title,
        url: res.url,
        wordCount: res.wordCount,
        snippet: res.snippet,
        outlinksDiscovered: res.outlinks.length,
      },
    };
  }
  if (name === 'ultrasearch_index_stats') {
    const [docsCount, wordsCount, domainsCount, queueCount] = await Promise.all([
      env.DB.prepare('SELECT COUNT(*) as cnt FROM documents').first<{ cnt: number }>(),
      env.DB.prepare('SELECT SUM(word_count) as words FROM documents').first<{ words: number }>(),
      env.DB.prepare('SELECT COUNT(*) as domains FROM (SELECT DISTINCT domain FROM documents)').first<{ domains: number }>(),
      env.DB.prepare('SELECT COUNT(*) as queue_size FROM crawl_queue').first<{ queue_size: number }>(),
    ]);
    return {
      total_documents: docsCount?.cnt ?? 0,
      total_words:     wordsCount?.words ?? 0,
      domains_covered: domainsCount?.domains ?? 0,
      pending_queue:   queueCount?.queue_size ?? 0,
    };
  }
  if (name === 'ultrasearch_usage') {
    if (!apiKey) return { error: 'ULTRASEARCH_API_KEY not configured in MCP env' };
    return getUsage(env, apiKey);
  }
  if (name === 'ultrasearch_provision_key') {
    const { plainKey, record } = await createApiKey(
      env,
      String(args.user_id),
      String(args.plan ?? 'free'),
      String(args.label ?? ''),
    );
    return { message: '✅ Key created! Save plain_key — shown ONCE.', plain_key: plainKey, ...record };
  }
  return { error: `Unknown tool: ${name}` };
}

// ── MCP Request Handler ───────────────────────────────────────────────────────

async function handleMCPRequest(
  env: Env,
  request: Record<string, unknown>,
  apiKey?: string,
): Promise<Record<string, unknown> | null> {
  const method = String(request.method ?? '');
  const id     = request.id;
  const params = (request.params ?? {}) as Record<string, unknown>;

  const ok  = (result: unknown) => ({ jsonrpc: '2.0', id, result });
  const err = (code: number, msg: string) => ({ jsonrpc: '2.0', id, error: { code, message: msg } });

  if (method === 'initialize') {
    return ok({ protocolVersion: PROTOCOL_VERSION, capabilities: { tools: {} }, serverInfo: SERVER_INFO });
  }
  if (method === 'tools/list') {
    return ok({ tools: TOOLS });
  }
  if (method === 'tools/call') {
    const toolName = String(params.name ?? '');
    const toolArgs = (params.arguments ?? {}) as Record<string, unknown>;
    try {
      const result = await handleTool(env, toolName, toolArgs, apiKey);
      const isError = typeof result === 'object' && result !== null && 'error' in result;
      return ok({ content: [{ type: 'text', text: JSON.stringify(result, null, 2) }], isError });
    } catch (e: unknown) {
      return ok({ content: [{ type: 'text', text: `Error: ${(e as Error).message}` }], isError: true });
    }
  }
  if (method === 'notifications/initialized') return null;

  return err(-32601, `Method not found: ${method}`);
}

// ── HTTP POST endpoint (stateless) ────────────────────────────────────────────
mcpRouter.post('/', async (c) => {
  const body = await c.req.json<Record<string, unknown>>();
  const apiKey = c.req.header('x-api-key') ?? c.req.header('authorization')?.replace(/^bearer /i, '');
  const response = await handleMCPRequest(c.env, body, apiKey);
  return c.json(response ?? {});
});

// ── SSE endpoint (streaming / persistent connection) ──────────────────────────
mcpRouter.get('/sse', (c) => {
  return streamSSE(c, async (stream) => {
    await stream.writeSSE({
      data: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }),
    });
    while (true) {
      await stream.writeSSE({ data: '{}', event: 'ping' });
      await stream.sleep(30_000);
    }
  });
});

// ── Health check ──────────────────────────────────────────────────────────────
mcpRouter.get('/health', (c) => c.json({ status: 'ok', ...SERVER_INFO }));
