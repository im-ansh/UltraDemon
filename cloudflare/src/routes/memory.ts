// UltraMemory — Sovereign Long-Term Memory & File Storage API Routes
// Endpoints for AI agents, swarms, and external apps to store, recall, list, and delete
// structured long-term memories and documents with sub-15ms edge latency.

import { Hono } from 'hono';
import type { Env, MemoryType, MemoryRecord } from '../types';
import { authMiddleware } from '../lib/auth';
import {
  storeMemory,
  queryMemories,
  listMemories,
  getMemory,
  deleteMemory,
  clearContainerMemories,
  ingestFileMemory,
  getMemoryStats,
} from '../lib/memory-engine';

export const memoryRouter = new Hono<{ Bindings: Env }>();

// All memory operations require an active API key (Unified or UltraMemory scope)
memoryRouter.use('*', authMiddleware);

// Helper: normalize container tag across query params and body keys
function extractContainerTag(body?: Record<string, unknown>, fallbackTag?: string): string {
  if (body) {
    const val = body.container_tag || body.container || body.tag || body.agent_id || body.agentId;
    if (typeof val === 'string' && val.trim()) return val.trim();
  }
  if (fallbackTag?.trim()) return fallbackTag.trim();
  return 'default';
}

// Helper: normalize text content from various agent payload styles
function extractContent(item: unknown): string {
  if (typeof item === 'string') return item.trim();
  if (item && typeof item === 'object') {
    const obj = item as Record<string, unknown>;
    const val = obj.content || obj.text || obj.memory || obj.message || obj.fact || obj.body || obj.data;
    if (typeof val === 'string') return val.trim();
    if (Array.isArray(obj.messages)) {
      return obj.messages
        .map((m: Record<string, unknown>) => `${m.role || 'user'}: ${m.content || ''}`)
        .join('\n')
        .trim();
    }
  }
  return '';
}

// ── POST /v1/memory — Store Memory (Single or Batch) ─────────────────────────
async function handleStoreMemory(c: any) {
  const t0 = performance.now();
  const record = c.get('keyRecord');
  const queryTag = c.req.query('container_tag') || c.req.query('tag') || c.req.query('agent_id');

  const raw = await c.req.json().catch(() => null);
  if (!raw) {
    return c.json({ error: 'Valid JSON payload is required' }, 400);
  }

  // 1. Batch Array Ingestion: [ "Fact 1", "Fact 2" ] OR [ { content: "..." }, ... ]
  const isArray = Array.isArray(raw);
  const isMemoriesList = raw && Array.isArray(raw.memories);

  if (isArray || isMemoriesList) {
    const items: unknown[] = isArray ? raw : raw.memories;
    if (items.length === 0) {
      return c.json({ error: 'Array of memories must not be empty' }, 400);
    }

    const stored: MemoryRecord[] = [];
    const container = extractContainerTag(raw, queryTag);

    for (const item of items) {
      const text = extractContent(item);
      if (!text) continue;

      const obj = (typeof item === 'object' && item !== null) ? (item as Record<string, unknown>) : {};
      const title = typeof obj.title === 'string' ? obj.title : undefined;
      const memType = (['fact', 'preference', 'entity', 'document', 'file', 'conversation', 'rule', 'instruction'].includes(String(obj.memory_type || obj.type || '')) 
        ? (obj.memory_type || obj.type) 
        : 'fact') as MemoryType;
      const sessionId = typeof obj.session_id === 'string' ? obj.session_id : (typeof raw.session_id === 'string' ? raw.session_id : '');
      const metadata = (typeof obj.metadata === 'object' && obj.metadata !== null) ? (obj.metadata as Record<string, unknown>) : {};

      const memory = await storeMemory(c.env, {
        userId:       record.user_id,
        content:      text,
        title,
        containerTag: extractContainerTag(obj, container),
        sessionId,
        memoryType:   memType,
        metadata,
      });
      stored.push(memory);
    }

    const duration = Math.round(performance.now() - t0);
    return c.json({
      status: 'success',
      message: `Successfully stored ${stored.length} memories`,
      count: stored.length,
      memories: stored,
      storage_time_ms: duration,
      container_tag: container,
    }, 201);
  }

  // 2. Single Memory Ingestion
  const text = extractContent(raw);
  if (!text) {
    return c.json({
      error: 'content is required (accepts: content, text, memory, message, fact, or messages array)',
    }, 400);
  }

  const containerTag = extractContainerTag(raw, queryTag);
  const sessionId    = String(raw.session_id || raw.sessionId || raw.conversation_id || '');
  const rawType      = String(raw.memory_type || raw.type || (Array.isArray(raw.messages) ? 'conversation' : 'fact'));
  const memoryType   = (['fact', 'preference', 'entity', 'document', 'file', 'conversation', 'rule', 'instruction'].includes(rawType) 
    ? rawType 
    : 'fact') as MemoryType;
  const title        = typeof raw.title === 'string' && raw.title.trim() ? raw.title.trim() : undefined;
  const metadata     = typeof raw.metadata === 'object' && raw.metadata !== null ? raw.metadata : {};

  try {
    const memory = await storeMemory(c.env, {
      userId:       record.user_id,
      content:      text,
      title,
      containerTag,
      sessionId,
      memoryType,
      metadata,
    });

    const duration = Math.round(performance.now() - t0);

    return c.json({
      status: 'success',
      message: 'Memory stored successfully',
      memory_id: memory.memory_id,
      memory,
      storage_time_ms: duration,
    }, 201);
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
}

memoryRouter.post('/', handleStoreMemory);
memoryRouter.post('/store', handleStoreMemory);
memoryRouter.post('/add', handleStoreMemory);
memoryRouter.post('/remember', handleStoreMemory);

// ── Recall & Query Memory (BM25 Edge Retrieval) ──────────────────────────────
async function handleQueryMemory(c: any) {
  const record = c.get('keyRecord');
  let query = '';
  let containerTag = c.req.query('container_tag') || c.req.query('tag') || c.req.query('agent_id');
  let sessionId = c.req.query('session_id') || c.req.query('sessionId');
  let memoryType = c.req.query('memory_type') || c.req.query('type');
  let limit = parseInt(c.req.query('limit') || c.req.query('top_k') || '10', 10);
  const format = c.req.query('format') || 'json';

  // Read body if POST
  if (c.req.method === 'POST') {
    const body = await c.req.json().catch(() => ({}));
    query = String(body.query || body.q || body.text || body.search || body.prompt || body.input || '').trim();
    if (body.container_tag || body.container || body.tag || body.agent_id || body.agentId) {
      containerTag = String(body.container_tag || body.container || body.tag || body.agent_id || body.agentId);
    }
    if (body.session_id || body.sessionId) sessionId = String(body.session_id || body.sessionId);
    if (body.memory_type || body.type) memoryType = String(body.memory_type || body.type);
    if (body.limit || body.top_k) limit = parseInt(String(body.limit || body.top_k), 10);
  } else {
    // Read query from GET params
    query = String(c.req.query('q') || c.req.query('query') || c.req.query('text') || c.req.query('search') || '').trim();
  }

  if (!query) {
    return c.json({ error: 'query parameter is required (accepts q, query, text, or search)' }, 400);
  }

  try {
    const response = await queryMemories(c.env, {
      userId:       record.user_id,
      query,
      containerTag: containerTag || undefined,
      sessionId:    sessionId || undefined,
      memoryType:   memoryType || undefined,
      limit:        isNaN(limit) ? 10 : limit,
    });

    const cacheTier = response.cache_tier || 'D1';
    const cacheStatus = cacheTier === 'RAM' ? 'HIT-RAM' : cacheTier === 'KV' ? 'HIT-KV' : 'MISS';
    c.header('X-Cache-Status', cacheStatus);
    c.header('X-Memory-Latency-Ms', String(response.retrieval_time_ms));
    c.header('Server-Timing', `memory;dur=${response.retrieval_time_ms};desc="${cacheTier}"`);
    c.header('Cache-Control', 'private, max-age=60');

    if (format === 'text') {
      return c.text(response.context || 'No relevant memories found.');
    }

    return c.json(response);
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
}

// POST and GET recall aliases
memoryRouter.post('/query', handleQueryMemory);
memoryRouter.post('/search', handleQueryMemory);
memoryRouter.post('/recall', handleQueryMemory);
memoryRouter.get('/recall', handleQueryMemory);
memoryRouter.get('/search', handleQueryMemory);
memoryRouter.get('/query', handleQueryMemory);

// ── GET /v1/memory/context & POST /v1/memory/context — Direct LLM Prompt Context
async function handleContextMemory(c: any) {
  const record = c.get('keyRecord');
  let query = '';
  let containerTag = c.req.query('container_tag') || c.req.query('tag') || c.req.query('agent_id');
  let limit = parseInt(c.req.query('limit') || c.req.query('top_k') || '5', 10);

  if (c.req.method === 'POST') {
    const body = await c.req.json().catch(() => ({}));
    query = String(body.query || body.q || body.text || body.prompt || '').trim();
    if (body.container_tag || body.tag || body.agent_id) {
      containerTag = String(body.container_tag || body.tag || body.agent_id);
    }
    if (body.limit || body.top_k) limit = parseInt(String(body.limit || body.top_k), 10);
  } else {
    query = String(c.req.query('q') || c.req.query('query') || c.req.query('prompt') || '').trim();
  }

  if (!query) {
    return c.json({ error: 'query is required' }, 400);
  }

  const response = await queryMemories(c.env, {
    userId: record.user_id,
    query,
    containerTag: containerTag || undefined,
    limit: isNaN(limit) ? 5 : limit,
  });

  const cacheTier = response.cache_tier || 'D1';
  const cacheStatus = cacheTier === 'RAM' ? 'HIT-RAM' : cacheTier === 'KV' ? 'HIT-KV' : 'MISS';
  c.header('X-Cache-Status', cacheStatus);
  c.header('X-Memory-Latency-Ms', String(response.retrieval_time_ms));
  c.header('Server-Timing', `memory;dur=${response.retrieval_time_ms};desc="${cacheTier}"`);
  c.header('Cache-Control', 'private, max-age=60');

  return c.json({
    query,
    context: response.context || '',
    count: response.memories.length,
    retrieval_time_ms: response.retrieval_time_ms,
    cache_tier: response.cache_tier,
    container_tag: containerTag || 'default',
  });
}

memoryRouter.get('/context', handleContextMemory);
memoryRouter.post('/context', handleContextMemory);

// ── GET /v1/memory/stats — User Memory Statistics ─────────────────────────────
memoryRouter.get('/stats', async (c) => {
  const record = c.get('keyRecord');
  try {
    const stats = await getMemoryStats(c.env, record.user_id);
    return c.json(stats);
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

// ── GET /v1/memory — List or Search Memories ─────────────────────────────────
memoryRouter.get('/', async (c) => {
  // If ?q= or ?query= is provided, execute BM25 search
  const q = c.req.query('q') || c.req.query('query') || c.req.query('text');
  if (q?.trim()) {
    return handleQueryMemory(c);
  }

  const record = c.get('keyRecord');
  const containerTag = c.req.query('container_tag') || c.req.query('tag');
  const memoryType   = c.req.query('memory_type') || c.req.query('type');
  const sessionId    = c.req.query('session_id') || c.req.query('sessionId');
  const limit        = parseInt(c.req.query('limit') || '20', 10);
  const offset       = parseInt(c.req.query('offset') || '0', 10);

  try {
    const data = await listMemories(c.env, {
      userId:       record.user_id,
      containerTag: containerTag || undefined,
      memoryType:   memoryType || undefined,
      sessionId:    sessionId || undefined,
      limit,
      offset,
    });

    return c.json(data);
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

// ── GET /v1/memory/:id — Retrieve Single Memory ─────────────────────────────
memoryRouter.get('/:id', async (c) => {
  const record = c.get('keyRecord');
  const memoryId = c.req.param('id');

  const memory = await getMemory(c.env, memoryId, record.user_id);
  if (!memory) {
    return c.json({ error: 'Memory not found' }, 404);
  }

  return c.json({ memory });
});

// ── DELETE /v1/memory/:id — Delete Single Memory ────────────────────────────
memoryRouter.delete('/:id', async (c) => {
  const record = c.get('keyRecord');
  const memoryId = c.req.param('id');

  const success = await deleteMemory(c.env, memoryId, record.user_id);
  if (!success) {
    return c.json({ error: 'Memory not found' }, 404);
  }

  return c.json({ message: 'Memory deleted successfully', memory_id: memoryId });
});

// ── DELETE /v1/memory — Bulk Clear Container ─────────────────────────────────
memoryRouter.delete('/', async (c) => {
  const record = c.get('keyRecord');
  const containerTag = c.req.query('container_tag') || c.req.query('tag');

  if (!containerTag) {
    return c.json({ error: 'container_tag or tag query param is required to clear memories' }, 400);
  }

  const deletedCount = await clearContainerMemories(c.env, record.user_id, containerTag);
  return c.json({
    message: `Cleared memories in container "${containerTag}"`,
    deleted_count: deletedCount,
  });
});

// ── POST /v1/memory/file — Ingest Document / File ─────────────────────────────
memoryRouter.post('/file', async (c) => {
  const record = c.get('keyRecord');
  const body = await c.req.json<{
    file_name:     string;
    content:       string;
    file_type?:    string;
    container_tag?: string;
    tag?:          string;
    metadata?:     Record<string, unknown>;
  }>().catch(() => null);

  if (!body || !body.file_name?.trim() || !body.content?.trim()) {
    return c.json({ error: 'file_name and content are required' }, 400);
  }

  try {
    const result = await ingestFileMemory(c.env, {
      userId:       record.user_id,
      fileName:     body.file_name.trim(),
      fileContent:  body.content,
      fileType:     body.file_type,
      containerTag: body.container_tag || body.tag || 'documents',
      metadata:     body.metadata,
    });

    return c.json({
      message: `File "${body.file_name}" ingested and indexed across ${result.chunks_stored} chunks`,
      ...result,
    }, 201);
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
});
