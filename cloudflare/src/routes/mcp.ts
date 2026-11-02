// UltraSearch — MCP Route (/mcp)
// Full Model Context Protocol server running on Cloudflare Workers edge.
// Compatible with Claude Desktop, Cursor, Windsurf, and any MCP client.
// Supports both HTTP POST (stateless) and SSE (streaming) transports.
// 100% Autonomous — powered by your own D1 FTS5 search index and web crawler.

import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import type { Env, MemoryType } from '../types';
import { runSearch } from '../lib/search-engine';
import { createApiKey, getUsage, validateApiKey } from '../lib/api-keys';
import { crawlAndIndexUrl } from '../lib/crawler';
import { storeMemory, queryMemories, listMemories, deleteMemory } from '../lib/memory-engine';

export const mcpRouter = new Hono<{ Bindings: Env }>();

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_INFO = {
  name:        'ultrasearch-ultramemory',
  version:     '1.0.0',
  description: 'UltraSearch & UltraMemory Sovereign Engine — <40ms Edge Search & <15ms Structured Memory for AI Agents',
};

// ── Tool Definitions ──────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'ultrasearch_web',
    description: 'Ultra-fast web search powered by your own Cloudflare D1 FTS5 index. Returns BM25-ranked passages, matched snippets, and PageRank scores. Latency: <50ms globally.',
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
    description: 'Deep multi-hop research search. Expands query into multi-angled sub-queries, cross-references sources across the index, and synthesizes structured evidence with citations.',
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
    name: 'ultramemory_store',
    description: 'Store structured long-term memory for an AI agent (fact, preference, profile, conversation, or document). Indexed instantly into edge D1 FTS5 for sub-15ms recall.',
    inputSchema: {
      type: 'object',
      properties: {
        content:       { type: 'string', description: 'The text content, fact, insight, or note to store in memory' },
        title:         { type: 'string', description: 'Optional short summary or title' },
        container_tag: { type: 'string', description: 'Namespace or container (e.g. agent_id, project_name, user_id)', default: 'default' },
        session_id:    { type: 'string', description: 'Optional session or chat identifier' },
        memory_type:   { type: 'string', description: 'Type of memory', enum: ['fact', 'preference', 'entity', 'document', 'file', 'conversation'], default: 'fact' },
        metadata:      { type: 'object', description: 'Optional arbitrary JSON metadata dictionary' },
      },
      required: ['content'],
    },
  },
  {
    name: 'ultramemory_query',
    description: 'Retrieve and recall relevant memories for an AI agent using BM25 ranking over edge SQLite FTS5. Sub-15ms latency globally.',
    inputSchema: {
      type: 'object',
      properties: {
        query:         { type: 'string', description: 'Search query or concept to recall from memory' },
        container_tag: { type: 'string', description: 'Filter by container/agent namespace' },
        session_id:    { type: 'string', description: 'Filter by session ID' },
        memory_type:   { type: 'string', description: 'Filter by memory type' },
        limit:         { type: 'integer', description: 'Number of relevant memories to retrieve', default: 5, minimum: 1, maximum: 20 },
      },
      required: ['query'],
    },
  },
  {
    name: 'ultramemory_list',
    description: 'List stored memories for the agent with pagination and container filtering.',
    inputSchema: {
      type: 'object',
      properties: {
        container_tag: { type: 'string', description: 'Filter by container tag' },
        memory_type:   { type: 'string', description: 'Filter by memory type' },
        limit:         { type: 'integer', description: 'Number of memories to return', default: 20, minimum: 1, maximum: 50 },
      },
    },
  },
  {
    name: 'ultramemory_delete',
    description: 'Delete a specific memory item by its memory_id.',
    inputSchema: {
      type: 'object',
      properties: {
        memory_id: { type: 'string', description: 'The unique ID of the memory to delete' },
      },
      required: ['memory_id'],
    },
  },
  {
    name: 'ultrasearch_crawl',
    description: 'Web Crawler: Fetch, parse, extract main content, and index any live URL or website directly into the UltraSearch index.',
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
    description: 'Check UltraSearch index statistics: total documents indexed, total words, domains covered, and crawler queue health.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'ultrasearch_usage',
    description: 'Check your UltraSearch API key quota and usage. Returns plan, daily limit, requests used today, remaining quota, and reset time.',
    inputSchema: { type: 'object', properties: {}, required: [] },
  },
  {
    name: 'ultrasearch_provision_key',
    description: 'Create a new UltraSearch API key. Returns the plain key ONCE — save it immediately.',
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
      message: res.status === 'indexed' ? `Successfully crawled and indexed ${url}` : `Status: ${res.status} (${res.error || ''})`,
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
    return { message: 'Key created. Save plain_key — shown ONCE.', plain_key: plainKey, ...record };
  }
  if (name === 'ultramemory_store') {
    let userId = 'default';
    if (apiKey) {
      try {
        const keyRec = await validateApiKey(env, apiKey);
        userId = keyRec.user_id;
      } catch { /* use default */ }
    }
    if (args.user_id) userId = String(args.user_id);

    const mem = await storeMemory(env, {
      userId,
      content: String(args.content),
      title: args.title ? String(args.title) : undefined,
      containerTag: args.container_tag ? String(args.container_tag) : undefined,
      sessionId: args.session_id ? String(args.session_id) : undefined,
      memoryType: args.memory_type ? (String(args.memory_type) as MemoryType) : undefined,
      metadata: (args.metadata as Record<string, unknown>) || undefined,
    });
    return {
      message: 'Memory stored successfully in edge index',
      memory_id: mem.memory_id,
      container_tag: mem.container_tag,
      title: mem.title,
      created_at: mem.created_at,
    };
  }
  if (name === 'ultramemory_query') {
    let userId = 'default';
    if (apiKey) {
      try {
        const keyRec = await validateApiKey(env, apiKey);
        userId = keyRec.user_id;
      } catch { /* use default */ }
    }
    if (args.user_id) userId = String(args.user_id);

    return queryMemories(env, {
      userId,
      query: String(args.query),
      containerTag: args.container_tag ? String(args.container_tag) : undefined,
      sessionId: args.session_id ? String(args.session_id) : undefined,
      memoryType: args.memory_type ? String(args.memory_type) : undefined,
      limit: args.limit ? Number(args.limit) : 5,
    });
  }
  if (name === 'ultramemory_list') {
    let userId = 'default';
    if (apiKey) {
      try {
        const keyRec = await validateApiKey(env, apiKey);
        userId = keyRec.user_id;
      } catch { /* use default */ }
    }
    if (args.user_id) userId = String(args.user_id);

    const res = await listMemories(env, {
      userId,
      containerTag: args.container_tag ? String(args.container_tag) : undefined,
      memoryType: args.memory_type ? String(args.memory_type) : undefined,
      limit: args.limit ? Number(args.limit) : 20,
    });
    return { count: res.memories.length, total: res.total, memories: res.memories };
  }
  if (name === 'ultramemory_delete') {
    let userId = 'default';
    if (apiKey) {
      try {
        const keyRec = await validateApiKey(env, apiKey);
        userId = keyRec.user_id;
      } catch { /* use default */ }
    }
    if (args.user_id) userId = String(args.user_id);

    const deleted = await deleteMemory(env, String(args.memory_id), userId);
    return { success: deleted, memory_id: args.memory_id };
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
