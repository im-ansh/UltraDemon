// UltraMemory — Sovereign Long-Term Memory & Knowledge Engine
// High-performance agent memory, file & context storage at the Cloudflare Edge
// Powered by D1 SQLite FTS5 BM25 with sub-15ms edge retrieval

import type { Env, MemoryRecord, MemoryQueryResult, MemoryQueryResponse, MemoryType } from '../types';

export interface StoreMemoryParams {
  userId:        string;
  content:       string;
  title?:        string;
  containerTag?: string;
  sessionId?:    string;
  memoryType?:   MemoryType;
  metadata?:     Record<string, unknown>;
  fileName?:     string;
  fileType?:     string;
  fileSize?:     number;
  ctx?:          { waitUntil?: (p: Promise<unknown>) => void };
}

export interface QueryMemoryParams {
  userId:        string;
  query:         string;
  containerTag?: string;
  sessionId?:    string;
  memoryType?:   string;
  limit?:        number;
  ctx?:          { waitUntil?: (p: Promise<unknown>) => void };
}

export interface ListMemoryParams {
  userId:        string;
  containerTag?: string;
  memoryType?:   string;
  sessionId?:    string;
  limit?:        number;
  offset?:       number;
}

// ── Multi-Tier Edge Caching & Supermemory Architecture ───────────────────────

interface CachedMemoryEntry {
  data: MemoryQueryResponse;
  expiresAt: number;
  version: number;
}

// Level 0: In-Isolate V8 Memory Cache (<0.05ms)
const ISOLATE_MEMORY_CACHE = new Map<string, CachedMemoryEntry>();
const MAX_ISOLATE_ENTRIES = 2000;

// Container version map for atomic invalidation
const ISOLATE_CONTAINER_VERSIONS = new Map<string, number>();

function fastHash(str: string): string {
  let h1 = 0xdeadbeef ^ 0;
  let h2 = 0x41c64e6d ^ 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
}

export async function getContainerVersion(env: Env, userId: string, containerTag?: string): Promise<number> {
  const tagKey = `${userId}:${containerTag || 'all'}`;
  const localVer = ISOLATE_CONTAINER_VERSIONS.get(tagKey);
  if (localVer !== undefined) {
    return localVer;
  }

  try {
    let kvVerStr: string | null = null;
    if (env.SEARCH_CACHE && typeof env.SEARCH_CACHE.get === 'function') {
      kvVerStr = await env.SEARCH_CACHE.get(`mem_v:${tagKey}`);
    }
    const ver = kvVerStr ? parseInt(kvVerStr, 10) : 1;
    ISOLATE_CONTAINER_VERSIONS.set(tagKey, ver);
    return ver;
  } catch {
    ISOLATE_CONTAINER_VERSIONS.set(tagKey, 1);
    return 1;
  }
}

export async function bumpContainerVersion(
  env: Env,
  userId: string,
  containerTag?: string,
  ctx?: { waitUntil?: (p: Promise<unknown>) => void }
): Promise<number> {
  const tag = containerTag || 'all';
  const tagKey = `${userId}:${tag}`;
  const currentVer = ISOLATE_CONTAINER_VERSIONS.get(tagKey) || 1;
  const nextVer = currentVer + 1;

  ISOLATE_CONTAINER_VERSIONS.set(tagKey, nextVer);

  // Invalidate global container queries as well
  if (tag !== 'all') {
    const allKey = `${userId}:all`;
    const currentAllVer = ISOLATE_CONTAINER_VERSIONS.get(allKey) || 1;
    ISOLATE_CONTAINER_VERSIONS.set(allKey, currentAllVer + 1);
    if (env.SEARCH_CACHE && typeof env.SEARCH_CACHE.put === 'function') {
      const p = env.SEARCH_CACHE.put(`mem_v:${allKey}`, String(currentAllVer + 1), { expirationTtl: 86400 * 30 });
      if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(p);
      else p.catch(() => {});
    }
  }

  // Non-blocking KV write to prevent latency spikes on storeMemory
  if (env.SEARCH_CACHE && typeof env.SEARCH_CACHE.put === 'function') {
    const p = env.SEARCH_CACHE.put(`mem_v:${tagKey}`, String(nextVer), { expirationTtl: 86400 * 30 });
    if (ctx && typeof ctx.waitUntil === 'function') ctx.waitUntil(p);
    else p.catch((e) => {
      console.warn('Failed to persist container version to KV:', e);
    });
  }

  return nextVer;
}

// ── ID Generator ─────────────────────────────────────────────────────────────

function generateMemoryId(): string {
  const bytes = new Uint8Array(8);
  crypto.getRandomValues(bytes);
  const hex = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
  return `mem_${hex}`;
}

// ── Store Memory ─────────────────────────────────────────────────────────────

export async function storeMemory(env: Env, params: StoreMemoryParams): Promise<MemoryRecord> {
  const memoryId     = generateMemoryId();
  const now          = Date.now();
  const containerTag = params.containerTag?.trim() || 'default';
  const sessionId    = params.sessionId?.trim() || '';
  const memoryType   = params.memoryType || 'fact';
  const title        = params.title?.trim() || (params.content.slice(0, 60) + (params.content.length > 60 ? '...' : ''));
  const metadataJson = JSON.stringify(params.metadata || {});

  await env.DB.prepare(`
    INSERT INTO memories (
      memory_id, user_id, container_tag, session_id, memory_type,
      title, content, metadata_json, file_name, file_type, file_size,
      chunk_index, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    memoryId,
    params.userId,
    containerTag,
    sessionId,
    memoryType,
    title,
    params.content,
    metadataJson,
    params.fileName || null,
    params.fileType || null,
    params.fileSize || params.content.length,
    0,
    now,
    now,
  ).run();

  // Atomically bump container version to invalidate edge caches
  await bumpContainerVersion(env, params.userId, containerTag, params.ctx);

  return {
    memory_id:     memoryId,
    user_id:       params.userId,
    container_tag: containerTag,
    session_id:    sessionId,
    memory_type:   memoryType,
    title,
    content:       params.content,
    metadata_json: metadataJson,
    file_name:     params.fileName,
    file_type:     params.fileType,
    file_size:     params.fileSize || params.content.length,
    chunk_index:   0,
    created_at:    now,
    updated_at:    now,
  };
}

// ── Query / Recall Memories (Multi-Tier BM25) ────────────────────────────────

export async function queryMemories(env: Env, params: QueryMemoryParams): Promise<MemoryQueryResponse> {
  const t0 = performance.now();
  const limit = Math.min(params.limit || 10, 50);
  const containerTag = params.containerTag?.trim() || '';

  // Get current container version for instant cache invalidation
  const version = await getContainerVersion(env, params.userId, containerTag || 'all');
  const queryHash = fastHash(`${params.query}:${limit}:${params.memoryType || ''}:${params.sessionId || ''}`);
  const cacheKey = `mem:${params.userId}:${containerTag || 'all'}:v${version}:${queryHash}`;

  // 1. Level 0: In-Isolate V8 RAM Cache Check (<0.05ms)
  const cachedRam = ISOLATE_MEMORY_CACHE.get(cacheKey);
  if (cachedRam && cachedRam.expiresAt > Date.now() && cachedRam.version === version) {
    // True LRU promotion on hit
    ISOLATE_MEMORY_CACHE.delete(cacheKey);
    ISOLATE_MEMORY_CACHE.set(cacheKey, cachedRam);
    const duration = Math.round((performance.now() - t0) * 100) / 100;
    return {
      ...cachedRam.data,
      retrieval_time_ms: duration,
      cache_tier: 'RAM',
    };
  }

  // 2. Level 1: Global Edge KV Cache Check (<5ms)
  try {
    if (env.SEARCH_CACHE && typeof env.SEARCH_CACHE.get === 'function') {
      const kvCached = await env.SEARCH_CACHE.get<MemoryQueryResponse>(cacheKey, 'json');
      if (kvCached) {
        const duration = Math.round((performance.now() - t0) * 100) / 100;
        const result: MemoryQueryResponse = {
          ...kvCached,
          retrieval_time_ms: duration,
          cache_tier: 'KV',
        };
        if (ISOLATE_MEMORY_CACHE.has(cacheKey)) {
          ISOLATE_MEMORY_CACHE.delete(cacheKey);
        } else if (ISOLATE_MEMORY_CACHE.size >= MAX_ISOLATE_ENTRIES) {
          const firstKey = ISOLATE_MEMORY_CACHE.keys().next().value;
          if (firstKey) ISOLATE_MEMORY_CACHE.delete(firstKey);
        }
        ISOLATE_MEMORY_CACHE.set(cacheKey, {
          data: result,
          expiresAt: Date.now() + 120_000,
          version,
        });
        return result;
      }
    }
  } catch (err) {
    console.warn('KV memory cache read error:', err);
  }

  // 3. Level 2: D1 SQLite with FTS5 BM25 Engine
  // Clean and prepare FTS query
  const cleanTerms = params.query
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 0 && !['and', 'or', 'not', 'the', 'is', 'a'].includes(t.toLowerCase()))
    .map(t => `"${t}"*`);

  const ftsQuery = cleanTerms.length > 0 ? cleanTerms.join(' OR ') : `"${params.query.replace(/"/g, '""')}"`;

  let results: MemoryQueryResult[] = [];

  try {
    let querySql = `
      SELECT 
        m.memory_id,
        m.container_tag,
        m.session_id,
        m.memory_type,
        m.title,
        m.content,
        m.metadata_json,
        m.file_name,
        m.created_at,
        bm25(memories_fts, 5.0, 10.0, 1.0) AS rank
      FROM memories_fts f
      JOIN memories m ON m.rowid = f.rowid
      WHERE memories_fts MATCH ?
        AND (m.user_id = ? OR ? = 'public_guest')
    `;

    const binds: unknown[] = [ftsQuery, params.userId, params.userId];

    if (params.containerTag) {
      querySql += ' AND m.container_tag = ?';
      binds.push(params.containerTag);
    }
    if (params.sessionId) {
      querySql += ' AND m.session_id = ?';
      binds.push(params.sessionId);
    }
    if (params.memoryType) {
      querySql += ' AND m.memory_type = ?';
      binds.push(params.memoryType);
    }

    querySql += ' ORDER BY rank ASC LIMIT ?';
    binds.push(limit);

    const { results: rows } = await env.DB.prepare(querySql).bind(...binds).all<Record<string, unknown>>();

    results = (rows || []).map(r => {
      let meta: Record<string, unknown> = {};
      try {
        meta = JSON.parse(String(r.metadata_json || '{}'));
      } catch {}

      const rawRank = Number(r.rank || 0);
      const score = Math.round(Math.max(0.01, Math.min(0.99, 1 / (1 + Math.abs(rawRank)))) * 100) / 100;

      return {
        memory_id:     String(r.memory_id),
        container_tag: String(r.container_tag),
        session_id:    String(r.session_id),
        memory_type:   r.memory_type as MemoryType,
        title:         String(r.title),
        content:       String(r.content),
        metadata:      meta,
        file_name:     r.file_name ? String(r.file_name) : null,
        score,
        created_at:    new Date(Number(r.created_at)).toISOString(),
      };
    });
  } catch (err) {
    // Graceful fallback to LIKE search if FTS query parsing has an issue
    console.warn('FTS memory match error, using LIKE fallback:', err);
    let fallbackSql = `
      SELECT memory_id, container_tag, session_id, memory_type, title, content, metadata_json, file_name, created_at
      FROM memories
      WHERE user_id = ? AND (content LIKE ? OR title LIKE ?)
    `;
    const fallbackBinds: unknown[] = [params.userId, `%${params.query}%`, `%${params.query}%`];

    if (params.containerTag) {
      fallbackSql += ' AND container_tag = ?';
      fallbackBinds.push(params.containerTag);
    }
    fallbackSql += ' ORDER BY created_at DESC LIMIT ?';
    fallbackBinds.push(limit);

    const { results: rows } = await env.DB.prepare(fallbackSql).bind(...fallbackBinds).all<Record<string, unknown>>();

    results = (rows || []).map(r => ({
      memory_id:     String(r.memory_id),
      container_tag: String(r.container_tag),
      session_id:    String(r.session_id),
      memory_type:   r.memory_type as MemoryType,
      title:         String(r.title),
      content:       String(r.content),
      metadata:      JSON.parse(String(r.metadata_json || '{}')),
      file_name:     r.file_name ? String(r.file_name) : null,
      score:         0.85,
      created_at:    new Date(Number(r.created_at)).toISOString(),
    }));
  }

  const duration = Math.round((performance.now() - t0) * 100) / 100;
  const context = results.length > 0 
    ? results.map((m, idx) => `${idx + 1}. [${m.memory_type.toUpperCase()}] ${m.content}`).join('\n')
    : '';

  const response: MemoryQueryResponse = {
    query:             params.query,
    memories:          results,
    total:             results.length,
    retrieval_time_ms: duration,
    container_tag:     params.containerTag,
    context,
    cache_tier:        'D1',
  };

  // Cache in Level 0 RAM with true LRU eviction
  if (ISOLATE_MEMORY_CACHE.has(cacheKey)) {
    ISOLATE_MEMORY_CACHE.delete(cacheKey);
  } else if (ISOLATE_MEMORY_CACHE.size >= MAX_ISOLATE_ENTRIES) {
    const firstKey = ISOLATE_MEMORY_CACHE.keys().next().value;
    if (firstKey) ISOLATE_MEMORY_CACHE.delete(firstKey);
  }
  ISOLATE_MEMORY_CACHE.set(cacheKey, {
    data: response,
    expiresAt: Date.now() + 120_000,
    version,
  });

  // Non-blocking Tier 1 KV Edge write (never blocks sub-10ms response)
  if (env.SEARCH_CACHE && typeof env.SEARCH_CACHE.put === 'function') {
    const putPromise = env.SEARCH_CACHE.put(cacheKey, JSON.stringify(response), { expirationTtl: 3600 });
    if (params.ctx && typeof params.ctx.waitUntil === 'function') {
      params.ctx.waitUntil(putPromise);
    } else {
      putPromise.catch(kvErr => {
        console.warn('Non-blocking KV memory cache write non-fatal:', kvErr);
      });
    }
  }

  return response;
}

// ── List Memories ────────────────────────────────────────────────────────────

export async function listMemories(env: Env, params: ListMemoryParams): Promise<{ memories: MemoryQueryResult[]; total: number }> {
  const limit  = Math.min(params.limit || 20, 100);
  const offset = params.offset || 0;

  let sql = 'SELECT memory_id, container_tag, session_id, memory_type, title, content, metadata_json, file_name, created_at FROM memories WHERE (user_id = ? OR ? = \'public_guest\')';
  const binds: unknown[] = [params.userId, params.userId];

  if (params.containerTag) {
    sql += ' AND container_tag = ?';
    binds.push(params.containerTag);
  }
  if (params.memoryType) {
    sql += ' AND memory_type = ?';
    binds.push(params.memoryType);
  }
  if (params.sessionId) {
    sql += ' AND session_id = ?';
    binds.push(params.sessionId);
  }

  sql += ' ORDER BY created_at DESC LIMIT ? OFFSET ?';
  binds.push(limit, offset);

  let countSql = 'SELECT COUNT(*) as cnt FROM memories WHERE (user_id = ? OR ? = \'public_guest\')';
  const countBinds: unknown[] = [params.userId, params.userId];
  if (params.containerTag) {
    countSql += ' AND container_tag = ?';
    countBinds.push(params.containerTag);
  }
  if (params.memoryType) {
    countSql += ' AND memory_type = ?';
    countBinds.push(params.memoryType);
  }
  if (params.sessionId) {
    countSql += ' AND session_id = ?';
    countBinds.push(params.sessionId);
  }

  // Atomic D1 batch execution: 1 network roundtrip for both items and total count
  const [dataBatch, countBatch] = await env.DB.batch([
    env.DB.prepare(sql).bind(...binds),
    env.DB.prepare(countSql).bind(...countBinds),
  ]);

  const rows = (dataBatch?.results || []) as Record<string, unknown>[];
  const countRow = (countBatch?.results?.[0] || {}) as { cnt?: number };

  const memories: MemoryQueryResult[] = rows.map(r => ({
    memory_id:     String(r.memory_id),
    container_tag: String(r.container_tag),
    session_id:    String(r.session_id),
    memory_type:   r.memory_type as MemoryType,
    title:         String(r.title),
    content:       String(r.content),
    metadata:      JSON.parse(String(r.metadata_json || '{}')),
    file_name:     r.file_name ? String(r.file_name) : null,
    score:         1.0,
    created_at:    new Date(Number(r.created_at)).toISOString(),
  }));

  return {
    memories,
    total: countRow?.cnt ?? memories.length,
  };
}

// ── Get Single Memory ────────────────────────────────────────────────────────

export async function getMemory(env: Env, memoryId: string, userId: string): Promise<MemoryQueryResult | null> {
  const row = await env.DB.prepare(`
    SELECT memory_id, container_tag, session_id, memory_type, title, content, metadata_json, file_name, created_at
    FROM memories
    WHERE memory_id = ? AND (user_id = ? OR ? = 'public_guest')
  `).bind(memoryId, userId, userId).first<Record<string, unknown>>();

  if (!row) return null;

  return {
    memory_id:     String(row.memory_id),
    container_tag: String(row.container_tag),
    session_id:    String(row.session_id),
    memory_type:   row.memory_type as MemoryType,
    title:         String(row.title),
    content:       String(row.content),
    metadata:      JSON.parse(String(row.metadata_json || '{}')),
    file_name:     row.file_name ? String(row.file_name) : null,
    score:         1.0,
    created_at:    new Date(Number(row.created_at)).toISOString(),
  };
}

// ── Delete Memory ────────────────────────────────────────────────────────────

export async function deleteMemory(env: Env, memoryId: string, userId: string): Promise<boolean> {
  const row = await env.DB.prepare('SELECT container_tag FROM memories WHERE memory_id = ? AND (user_id = ? OR ? = \'public_guest\')')
    .bind(memoryId, userId, userId)
    .first<{ container_tag: string }>();

  const res = await env.DB.prepare('DELETE FROM memories WHERE memory_id = ? AND (user_id = ? OR ? = \'public_guest\')')
    .bind(memoryId, userId, userId)
    .run();

  if ((res.meta.changes || 0) > 0) {
    await bumpContainerVersion(env, userId, row?.container_tag);
    return true;
  }
  return false;
}

// ── Clear Container Memories ─────────────────────────────────────────────────

export async function clearContainerMemories(env: Env, userId: string, containerTag: string): Promise<number> {
  const res = await env.DB.prepare('DELETE FROM memories WHERE user_id = ? AND container_tag = ?')
    .bind(userId, containerTag)
    .run();

  await bumpContainerVersion(env, userId, containerTag);
  return res.meta.changes || 0;
}

// ── Ingest Document / File with Smart Chunking ────────────────────────────────

export async function ingestFileMemory(
  env: Env,
  params: {
    userId:        string;
    fileName:      string;
    fileContent:   string;
    fileType?:     string;
    containerTag?: string;
    metadata?:     Record<string, unknown>;
    ctx?:          { waitUntil?: (p: Promise<unknown>) => void };
  }
): Promise<{ chunks_stored: number; memory_ids: string[]; file_name: string }> {
  const containerTag = params.containerTag?.trim() || 'documents';
  const fileType     = params.fileType || 'text/plain';
  const content      = params.fileContent.trim();
  const chunkSize    = 1200; // ~300 words
  const overlap      = 150;
  
  const chunks: string[] = [];
  if (content.length <= chunkSize) {
    chunks.push(content);
  } else {
    let start = 0;
    while (start < content.length) {
      const end = Math.min(start + chunkSize, content.length);
      chunks.push(content.slice(start, end));
      if (end >= content.length) break;
      start += chunkSize - overlap;
    }
  }

  const memoryIds: string[] = [];
  const now = Date.now();

  const insertStmts: ReturnType<D1Database['prepare']>[] = [];
  for (let i = 0; i < chunks.length; i++) {
    const memoryId = generateMemoryId();
    const title = `${params.fileName} (Part ${i + 1}/${chunks.length})`;
    const meta = {
      ...(params.metadata || {}),
      file_name: params.fileName,
      chunk_index: i,
      total_chunks: chunks.length,
    };

    insertStmts.push(
      env.DB.prepare(`
        INSERT INTO memories (
          memory_id, user_id, container_tag, session_id, memory_type,
          title, content, metadata_json, file_name, file_type, file_size,
          chunk_index, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `).bind(
        memoryId,
        params.userId,
        containerTag,
        '',
        'file',
        title,
        chunks[i],
        JSON.stringify(meta),
        params.fileName,
        fileType,
        content.length,
        i,
        now,
        now,
      )
    );

    memoryIds.push(memoryId);
  }

  // Single atomic D1 batch — 1 roundtrip instead of N sequential writes
  if (insertStmts.length > 0) {
    await env.DB.batch(insertStmts);
  }

  // Atomically bump container version to invalidate edge caches
  await bumpContainerVersion(env, params.userId, containerTag, params.ctx);

  return {
    chunks_stored: chunks.length,
    memory_ids:    memoryIds,
    file_name:     params.fileName,
  };
}

// ── User Memory Statistics ───────────────────────────────────────────────────

export async function getMemoryStats(env: Env, userId: string): Promise<{
  total_memories: number;
  last_stored_at: string | null;
  containers: { container_tag: string; count: number }[];
  memory_types: { memory_type: string; count: number }[];
}> {
  const [totalRow, containerRows, typeRows] = await Promise.all([
    env.DB.prepare('SELECT COUNT(*) as total_memories, MAX(created_at) as last_stored_at FROM memories WHERE user_id = ?')
      .bind(userId)
      .first<{ total_memories: number; last_stored_at: number | null }>(),
    env.DB.prepare('SELECT container_tag, COUNT(*) as count FROM memories WHERE user_id = ? GROUP BY container_tag ORDER BY count DESC LIMIT 10')
      .bind(userId)
      .all<{ container_tag: string; count: number }>(),
    env.DB.prepare('SELECT memory_type, COUNT(*) as count FROM memories WHERE user_id = ? GROUP BY memory_type')
      .bind(userId)
      .all<{ memory_type: string; count: number }>(),
  ]);

  return {
    total_memories: totalRow?.total_memories || 0,
    last_stored_at: totalRow?.last_stored_at ? new Date(totalRow.last_stored_at).toISOString() : null,
    containers: (containerRows.results || []) as { container_tag: string; count: number }[],
    memory_types: (typeRows.results || []) as { memory_type: string; count: number }[],
  };
}

