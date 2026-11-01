// UltraMemory — Sovereign Long-Term Memory & File Storage API Routes
// Endpoints for AI agents to store, recall, list, and delete structured memories & documents.

import { Hono } from 'hono';
import type { Env, MemoryType } from '../types';
import { authMiddleware } from '../lib/auth';
import {
  storeMemory,
  queryMemories,
  listMemories,
  getMemory,
  deleteMemory,
  clearContainerMemories,
  ingestFileMemory,
} from '../lib/memory-engine';

export const memoryRouter = new Hono<{ Bindings: Env }>();

// All memory operations require an active API key
memoryRouter.use('*', authMiddleware);

// ── POST /v1/memory — Store Memory ──────────────────────────────────────────
memoryRouter.post('/', async (c) => {
  const body = await c.req.json<{
    content:       string;
    title?:        string;
    container_tag?: string;
    session_id?:    string;
    memory_type?:   MemoryType;
    metadata?:     Record<string, unknown>;
  }>().catch(() => null);

  if (!body || !body.content?.trim()) {
    return c.json({ error: 'content is required' }, 400);
  }

  const record = c.get('keyRecord');

  try {
    const memory = await storeMemory(c.env, {
      userId:       record.user_id,
      content:      body.content.trim(),
      title:        body.title,
      containerTag: body.container_tag,
      sessionId:    body.session_id,
      memoryType:   body.memory_type,
      metadata:     body.metadata,
    });

    return c.json({
      message: 'Memory stored successfully',
      memory,
    }, 201);
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

// ── POST /v1/memory/query — Recall / Search Memories (BM25) ──────────────────
memoryRouter.post('/query', async (c) => {
  const body = await c.req.json<{
    query:         string;
    container_tag?: string;
    session_id?:    string;
    memory_type?:   string;
    limit?:        number;
  }>().catch(() => null);

  if (!body || !body.query?.trim()) {
    return c.json({ error: 'query is required' }, 400);
  }

  const record = c.get('keyRecord');

  try {
    const response = await queryMemories(c.env, {
      userId:       record.user_id,
      query:        body.query.trim(),
      containerTag: body.container_tag,
      sessionId:    body.session_id,
      memoryType:   body.memory_type,
      limit:        body.limit,
    });

    return c.json(response);
  } catch (err: unknown) {
    return c.json({ error: (err as Error).message }, 500);
  }
});

// Alias for search
memoryRouter.post('/search', async (c) => {
  const body = await c.req.json<{
    query:         string;
    container_tag?: string;
    session_id?:    string;
    memory_type?:   string;
    limit?:        number;
  }>().catch(() => null);

  if (!body || !body.query?.trim()) {
    return c.json({ error: 'query is required' }, 400);
  }

  const record = c.get('keyRecord');
  const response = await queryMemories(c.env, {
    userId:       record.user_id,
    query:        body.query.trim(),
    containerTag: body.container_tag,
    sessionId:    body.session_id,
    memoryType:   body.memory_type,
    limit:        body.limit,
  });

  return c.json(response);
});

// ── GET /v1/memory — List Memories ──────────────────────────────────────────
memoryRouter.get('/', async (c) => {
  const record = c.get('keyRecord');
  const containerTag = c.req.query('container_tag');
  const memoryType   = c.req.query('memory_type');
  const sessionId    = c.req.query('session_id');
  const limit        = parseInt(c.req.query('limit') || '20', 10);
  const offset       = parseInt(c.req.query('offset') || '0', 10);

  try {
    const data = await listMemories(c.env, {
      userId:       record.user_id,
      containerTag,
      memoryType,
      sessionId,
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
  const containerTag = c.req.query('container_tag');

  if (!containerTag) {
    return c.json({ error: 'container_tag query param is required to clear memories' }, 400);
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
      containerTag: body.container_tag || 'documents',
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

