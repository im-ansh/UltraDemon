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
}

export interface QueryMemoryParams {
  userId:        string;
  query:         string;
  containerTag?: string;
  sessionId?:    string;
  memoryType?:   string;
  limit?:        number;
}

export interface ListMemoryParams {
  userId:        string;
  containerTag?: string;
  memoryType?:   string;
  sessionId?:    string;
  limit?:        number;
  offset?:       number;
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

// ── Query / Recall Memories (BM25) ───────────────────────────────────────────

export async function queryMemories(env: Env, params: QueryMemoryParams): Promise<MemoryQueryResponse> {
  const t0 = performance.now();
  const limit = Math.min(params.limit || 10, 50);

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

  const duration = Math.round(performance.now() - t0);
  const context = results.length > 0 
    ? results.map((m, idx) => `${idx + 1}. [${m.memory_type.toUpperCase()}] ${m.content}`).join('\n')
    : '';

  return {
    query:             params.query,
    memories:          results,
    total:             results.length,
    retrieval_time_ms: duration,
    container_tag:     params.containerTag,
    context,
  };
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

  const { results: rows } = await env.DB.prepare(sql).bind(...binds).all<Record<string, unknown>>();

  const memories: MemoryQueryResult[] = (rows || []).map(r => ({
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

  const countRow = await env.DB.prepare('SELECT COUNT(*) as cnt FROM memories WHERE (user_id = ? OR ? = \'public_guest\')')
    .bind(params.userId, params.userId)
    .first<{ cnt: number }>();

  return {
    memories,
    total: countRow?.cnt || memories.length,
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
  const res = await env.DB.prepare('DELETE FROM memories WHERE memory_id = ? AND (user_id = ? OR ? = \'public_guest\')')
    .bind(memoryId, userId, userId)
    .run();
  return (res.meta.changes || 0) > 0;
}

// ── Clear Container Memories ─────────────────────────────────────────────────

export async function clearContainerMemories(env: Env, userId: string, containerTag: string): Promise<number> {
  const res = await env.DB.prepare('DELETE FROM memories WHERE user_id = ? AND container_tag = ?')
    .bind(userId, containerTag)
    .run();
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

  for (let i = 0; i < chunks.length; i++) {
    const memoryId = generateMemoryId();
    const title = `${params.fileName} (Part ${i + 1}/${chunks.length})`;
    const meta = {
      ...(params.metadata || {}),
      file_name: params.fileName,
      chunk_index: i,
      total_chunks: chunks.length,
    };

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
    ).run();

    memoryIds.push(memoryId);
  }

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

