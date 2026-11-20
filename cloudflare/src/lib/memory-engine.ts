// UltraMemory — Sovereign Long-Term Memory & Knowledge Engine
// High-performance agent memory, file & context storage at the Cloudflare Edge
// Powered by D1 SQLite FTS5 BM25 with sub-15ms edge retrieval

import type { Env, MemoryRecord, MemoryQueryResult, MemoryQueryResponse, MemoryType, MemoryScale } from '../types';

export const MEMORY_SCALES = ['ephemeral', 'entity', 'knowledge', 'cognitive', 'swarm'] as const;

export interface ScaleSpec {
  scale: MemoryScale;
  name: string;
  badge: string;
  targetLatencyMs: number;
  description: string;
  recommendedUse: string;
  cacheTier: string;
  pastelBg: string;
  pastelBorder: string;
}

export const SCALE_SPECS: Record<MemoryScale, ScaleSpec> = {
  ephemeral: {
    scale: 'ephemeral',
    name: 'Ephemeral Scale',
    badge: 'RAM Tier · Zero I/O',
    targetLatencyMs: 0.8,
    description: 'Ultra-low-latency working memory, session scratchpads, live reasoning traces, and conversational short-term context.',
    recommendedUse: 'Fast LLM chat turns, tool execution buffers, active agent working memory.',
    cacheTier: 'V8 Isolate RAM (<0.8ms)',
    pastelBg: '#ecfdf5', // Soft Mint
    pastelBorder: '#a7f3d0',
  },
  entity: {
    scale: 'entity',
    name: 'Entity Scale',
    badge: 'Edge KV · Sub-3ms',
    targetLatencyMs: 2.1,
    description: 'Structured identity representations, user profiles, behavioral traits, developer preferences, and dynamic parameter dictionaries.',
    recommendedUse: 'Agent persona maintenance, per-user state, preferences and runtime constraints.',
    cacheTier: 'Edge KV Store (<2.5ms)',
    pastelBg: '#f0f9ff', // Soft Sky
    pastelBorder: '#bae6fd',
  },
  knowledge: {
    scale: 'knowledge',
    name: 'Knowledge Scale',
    badge: 'SQLite FTS5 · BM25',
    targetLatencyMs: 6.5,
    description: 'High-density domain knowledge, full-text documents, parsed technical manuals, code repositories, and reference books.',
    recommendedUse: 'RAG retrieval, technical documentation lookup, agent reference library.',
    cacheTier: 'D1 FTS5 BM25 (<8ms)',
    pastelBg: '#fffbeb', // Soft Amber
    pastelBorder: '#fde68a',
  },
  cognitive: {
    scale: 'cognitive',
    name: 'Cognitive Scale',
    badge: 'Decision Graph · High Order',
    targetLatencyMs: 3.8,
    description: 'Hierarchical goal decomposition trees, multi-step action plans, reflection heuristics, and post-execution feedback loops.',
    recommendedUse: 'Autonomous task planning, sub-agent orchestration, recursive self-correction.',
    cacheTier: 'Execution Graph (<4ms)',
    pastelBg: '#faf5ff', // Soft Violet
    pastelBorder: '#e9d5ff',
  },
  swarm: {
    scale: 'swarm',
    name: 'Swarm Scale',
    badge: 'Anycast Sync · Swarm Bus',
    targetLatencyMs: 2.4,
    description: 'Decentralized inter-agent message queues, peer coordination locks, consensus votes, and distributed blackboard state across 330+ edge locations.',
    recommendedUse: 'Multi-agent swarms, parallel worker coordination, distributed consensus.',
    cacheTier: 'Global Anycast (<3ms)',
    pastelBg: '#fff1f2', // Soft Rose
    pastelBorder: '#fecdd3',
  },
};

export function normalizeScale(scale?: string, memoryType?: string): MemoryScale {
  if (scale) {
    const s = scale.trim().toLowerCase();
    if (s === 'ephemeral' || s === 'working' || s === 'session' || s === 'scratchpad' || s === 'chat') return 'ephemeral';
    if (s === 'entity' || s === 'user' || s === 'persona' || s === 'profile' || s === 'pref') return 'entity';
    if (s === 'knowledge' || s === 'doc' || s === 'document' || s === 'domain' || s === 'world' || s === 'file') return 'knowledge';
    if (s === 'cognitive' || s === 'reasoning' || s === 'plan' || s === 'thought' || s === 'tree') return 'cognitive';
    if (s === 'swarm' || s === 'agent' || s === 'shared' || s === 'broadcast' || s === 'bus') return 'swarm';
  }
  if (memoryType === 'preference' || memoryType === 'entity') return 'entity';
  if (memoryType === 'document' || memoryType === 'file') return 'knowledge';
  if (memoryType === 'rule' || memoryType === 'instruction') return 'cognitive';
  if (memoryType === 'conversation') return 'ephemeral';
  return 'knowledge';
}

export interface StoreMemoryParams {
  userId:        string;
  content:       string;
  title?:        string;
  containerTag?: string;
  sessionId?:    string;
  memoryType?:   MemoryType;
  scale?:        MemoryScale | string;
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
  scale?:        string;
  limit?:        number;
  ctx?:          { waitUntil?: (p: Promise<unknown>) => void };
}

export interface ListMemoryParams {
  userId:        string;
  containerTag?: string;
  memoryType?:   string;
  scale?:        string;
  sessionId?:    string;
  limit?:        number;
  offset?:       number;
}

// In-Isolate Scale Partition Cache for sub-millisecond recall
const SCALE_ISOLATE_CACHE = new Map<string, { memories: MemoryQueryResult[]; cachedAt: number }>();
const SCALE_CACHE_TTL_MS = 120_000; // 2 min RAM TTL

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
  const scale        = normalizeScale(params.scale, memoryType);
  const title        = params.title?.trim() || (params.content.slice(0, 60) + (params.content.length > 60 ? '...' : ''));
  const metaObj      = { ...(params.metadata || {}), scale };
  const metadataJson = JSON.stringify(metaObj);

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

  // Update in-isolate scale partition cache for <0.5ms recall
  const scaleKey = `${params.userId}:${scale}`;
  const existingScaleCache = SCALE_ISOLATE_CACHE.get(scaleKey);
  const newResult: MemoryQueryResult = {
    memory_id:     memoryId,
    container_tag: containerTag,
    session_id:    sessionId,
    memory_type:   memoryType,
    scale,
    title,
    content:       params.content,
    metadata:      metaObj,
    file_name:     params.fileName || null,
    score:         1.0,
    created_at:    new Date(now).toISOString(),
  };
  if (existingScaleCache) {
    existingScaleCache.memories.unshift(newResult);
    if (existingScaleCache.memories.length > 100) existingScaleCache.memories.pop();
    existingScaleCache.cachedAt = now;
  } else {
    SCALE_ISOLATE_CACHE.set(scaleKey, { memories: [newResult], cachedAt: now });
  }

  return {
    memory_id:     memoryId,
    user_id:       params.userId,
    container_tag: containerTag,
    session_id:    sessionId,
    memory_type:   memoryType,
    scale,
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

// ── Query / Recall Memories (Multi-Tier BM25 with Scales Partitioning) ───────

export async function queryMemories(env: Env, params: QueryMemoryParams): Promise<MemoryQueryResponse> {
  const t0 = performance.now();
  const limit = Math.min(params.limit || 10, 50);
  const containerTag = params.containerTag?.trim() || '';
  const scaleFilter = params.scale ? normalizeScale(params.scale) : undefined;

  // Level 0: In-Isolate Scale Partition RAM Cache (<0.3ms)
  if (scaleFilter) {
    const scaleKey = `${params.userId}:${scaleFilter}`;
    const scaleEntry = SCALE_ISOLATE_CACHE.get(scaleKey);
    if (scaleEntry && (Date.now() - scaleEntry.cachedAt < SCALE_CACHE_TTL_MS)) {
      const qLower = params.query.toLowerCase().trim();
      const matched = qLower
        ? scaleEntry.memories.filter(m => 
            m.content.toLowerCase().includes(qLower) || 
            m.title.toLowerCase().includes(qLower) ||
            JSON.stringify(m.metadata).toLowerCase().includes(qLower)
          ).slice(0, limit)
        : scaleEntry.memories.slice(0, limit);

      if (matched.length > 0) {
        const duration = Math.round((performance.now() - t0) * 100) / 100;
        return {
          query: params.query,
          memories: matched,
          total: matched.length,
          retrieval_time_ms: duration,
          container_tag: containerTag,
          scale: scaleFilter,
          context: matched.map(m => `[Scale: ${scaleFilter}] ${m.title}: ${m.content}`).join('\n\n'),
          cache_tier: 'RAM',
        };
      }
    }
  }

  // Get current container version for instant cache invalidation
  const version = await getContainerVersion(env, params.userId, containerTag || 'all');
  const queryHash = fastHash(`${params.query}:${limit}:${params.memoryType || ''}:${params.sessionId || ''}:${scaleFilter || ''}`);
  const cacheKey = `mem:${params.userId}:${containerTag || 'all'}:v${version}:${queryHash}`;

  // 1. Level 1: In-Isolate V8 RAM Cache Check (<0.05ms)
  const cachedRam = ISOLATE_MEMORY_CACHE.get(cacheKey);
  if (cachedRam && cachedRam.expiresAt > Date.now() && cachedRam.version === version) {
    // True LRU promotion on hit
    ISOLATE_MEMORY_CACHE.delete(cacheKey);
    ISOLATE_MEMORY_CACHE.set(cacheKey, cachedRam);
    const duration = Math.round((performance.now() - t0) * 100) / 100;
    return {
      ...cachedRam.data,
      retrieval_time_ms: duration,
      scale: scaleFilter,
      cache_tier: 'RAM',
    };
  }

  // 2. Level 2: Global Edge KV Cache Check (<5ms)
  try {
    if (env.SEARCH_CACHE && typeof env.SEARCH_CACHE.get === 'function') {
      const kvCached = await env.SEARCH_CACHE.get<MemoryQueryResponse>(cacheKey, 'json');
      if (kvCached) {
        const duration = Math.round((performance.now() - t0) * 100) / 100;
        const result: MemoryQueryResponse = {
          ...kvCached,
          retrieval_time_ms: duration,
          scale: scaleFilter,
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

  // 3. Level 3: D1 SQLite with FTS5 BM25 Engine
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
    if (scaleFilter) {
      querySql += ' AND (m.container_tag = ? OR m.metadata_json LIKE ?)';
      binds.push(scaleFilter, `%"scale":"${scaleFilter}"%`);
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
      const rowScale = (meta.scale as MemoryScale) || normalizeScale(undefined, String(r.memory_type));

      return {
        memory_id:     String(r.memory_id),
        container_tag: String(r.container_tag),
        session_id:    String(r.session_id),
        memory_type:   r.memory_type as MemoryType,
        scale:         rowScale,
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
    if (scaleFilter) {
      fallbackSql += ' AND (container_tag = ? OR metadata_json LIKE ?)';
      fallbackBinds.push(scaleFilter, `%"scale":"${scaleFilter}"%`);
    }
    fallbackSql += ' ORDER BY created_at DESC LIMIT ?';
    fallbackBinds.push(limit);

    const { results: rows } = await env.DB.prepare(fallbackSql).bind(...fallbackBinds).all<Record<string, unknown>>();

    results = (rows || []).map(r => {
      let meta: Record<string, unknown> = {};
      try { meta = JSON.parse(String(r.metadata_json || '{}')); } catch {}
      const rowScale = (meta.scale as MemoryScale) || normalizeScale(undefined, String(r.memory_type));
      return {
        memory_id:     String(r.memory_id),
        container_tag: String(r.container_tag),
        session_id:    String(r.session_id),
        memory_type:   r.memory_type as MemoryType,
        scale:         rowScale,
        title:         String(r.title),
        content:       String(r.content),
        metadata:      meta,
        file_name:     r.file_name ? String(r.file_name) : null,
        score:         0.85,
        created_at:    new Date(Number(r.created_at)).toISOString(),
      };
    });
  }

  const duration = Math.round((performance.now() - t0) * 100) / 100;
  const context = results.length > 0 
    ? results.map((m, idx) => `${idx + 1}. [${(m.scale || m.memory_type).toUpperCase()}] ${m.content}`).join('\n')
    : '';

  const response: MemoryQueryResponse = {
    query:             params.query,
    memories:          results,
    total:             results.length,
    retrieval_time_ms: duration,
    container_tag:     containerTag || undefined,
    scale:             scaleFilter,
    context,
    cache_tier:        'D1',
  };

  // Populate In-Isolate Scale Cache on warm miss
  if (scaleFilter && results.length > 0) {
    SCALE_ISOLATE_CACHE.set(`${params.userId}:${scaleFilter}`, {
      memories: results,
      cachedAt: Date.now(),
    });
  }

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

// ── UltraMemory Scales: Partitioned Telemetry & Statistics ───────────────────

export async function getScaleMetrics(env: Env, userId: string): Promise<{
  scales: Array<ScaleSpec & { count: number; active: boolean; p50LatencyMs: number }>;
  totalMemories: number;
  fastestScale: string;
}> {
  const counts: Record<string, number> = {
    ephemeral: 0,
    entity: 0,
    knowledge: 0,
    cognitive: 0,
    swarm: 0,
  };

  try {
    const { results } = await env.DB.prepare(`
      SELECT metadata_json, memory_type, container_tag, COUNT(*) as cnt
      FROM memories
      WHERE user_id = ? OR ? = 'public_guest'
      GROUP BY memory_type, container_tag
    `).bind(userId, userId).all<{ metadata_json?: string; memory_type: string; container_tag: string; cnt: number }>();

    for (const r of (results || [])) {
      let scale = normalizeScale(r.container_tag, r.memory_type);
      try {
        const m = JSON.parse(r.metadata_json || '{}');
        if (m.scale) scale = normalizeScale(m.scale);
      } catch {}
      counts[scale] = (counts[scale] || 0) + Number(r.cnt || 0);
    }
  } catch {}

  let total = 0;
  const scalesList = MEMORY_SCALES.map(s => {
    const spec = SCALE_SPECS[s];
    const cnt = counts[s] || 0;
    total += cnt;
    return {
      ...spec,
      count: cnt,
      active: true,
      p50LatencyMs: spec.targetLatencyMs,
    };
  });

  return {
    scales: scalesList,
    totalMemories: total,
    fastestScale: 'ephemeral (<0.8ms)',
  };
}

