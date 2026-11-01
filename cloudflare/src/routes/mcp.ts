// UltraSearch — MCP Route (/mcp)
// Full Model Context Protocol server running on Cloudflare Workers edge.
// Compatible with Claude Desktop, Cursor, Windsurf, and any MCP client.
// Supports both HTTP POST (stateless) and SSE (streaming) transports.

import { Hono } from 'hono';
import { streamSSE } from 'hono/streaming';
import type { Env } from '../types';
import { runSearch } from '../lib/search-engine';
import { createApiKey, getUsage } from '../lib/api-keys';

export const mcpRouter = new Hono<{ Bindings: Env }>();

const PROTOCOL_VERSION = '2024-11-05';
const SERVER_INFO = {
  name:        'ultrasearch',
  version:     '1.0.0',
  description: 'Ultra-fast web search API for AI agents — <200ms globally via Cloudflare edge',
};

// ── Tool Definitions ──────────────────────────────────────────────────────────

const TOOLS = [
  {
    name: 'ultrasearch_web',
    description: '⚡ Ultra-fast web search. Fans out to Brave, Serper, Exa & Tavily in parallel from Cloudflare edge (<200ms globally). Use for any question requiring current web data.',
    inputSchema: {
      type: 'object',
      properties: {
        query:       { type: 'string', description: 'Search query', minLength: 1, maxLength: 500 },
        num_results: { type: 'integer', description: 'Number of results (1–50)', default: 10, minimum: 1, maximum: 50 },
        use_cache:   { type: 'boolean', description: 'Use cached results (default: true)', default: true },
      },
      required: ['query'],
    },
  },
  {
    name: 'ultrasearch_news',
    description: '📰 Real-time news search. Returns breaking news and recent articles (no cache). Use for current events, stocks, sports, weather.',
    inputSchema: {
      type: 'object',
      properties: {
        query:       { type: 'string', description: 'News topic to search' },
        num_results: { type: 'integer', description: 'Number of articles (1–20)', default: 10, minimum: 1, maximum: 20 },
      },
      required: ['query'],
    },
  },
  {
    name: 'ultrasearch_semantic',
    description: '🧠 Semantic / neural web search. Finds conceptually relevant pages using embeddings — not just keyword matching. Best for research and multi-hop reasoning. Requires Pro+ plan.',
    inputSchema: {
      type: 'object',
      properties: {
        query:       { type: 'string', description: 'Natural language question or concept' },
        num_results: { type: 'integer', description: 'Results (1–20)', default: 10, minimum: 1, maximum: 20 },
      },
      required: ['query'],
    },
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
    return runSearch(env, String(args.query), Number(args.num_results ?? 10), false, false);
  }
  if (name === 'ultrasearch_news') {
    return runSearch(env, String(args.query), Number(args.num_results ?? 10), false, true);
  }
  if (name === 'ultrasearch_semantic') {
    return runSearch(env, String(args.query), Number(args.num_results ?? 10), true, false);
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
    // Send initial server info
    await stream.writeSSE({
      data: JSON.stringify({ jsonrpc: '2.0', method: 'notifications/initialized', params: {} }),
    });
    // Keep alive
    while (true) {
      await stream.writeSSE({ data: '{}', event: 'ping' });
      await stream.sleep(30_000);
    }
  });
});

// ── Health check ──────────────────────────────────────────────────────────────
mcpRouter.get('/health', (c) => c.json({ status: 'ok', ...SERVER_INFO }));
