// UltraSearch — API Key Management (Cloudflare Edge)
// Generates, validates, and caches API keys using D1 + KV.

import type { Env, ApiKeyRecord } from '../types';

const KEY_PREFIX = 'us_';
const KEY_BODY_LEN = 32;
const B62 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

// ── Key Generation ──────────────────────────────────────────────────────────

function randomB62(len: number): string {
  const bytes = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(bytes, b => B62[b % 62]).join('');
}

export async function hashKey(plainKey: string, secret: string): Promise<string> {
  const data = new TextEncoder().encode(`${secret}:${plainKey}`);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
}

function randomHex(len: number): string {
  return Array.from(crypto.getRandomValues(new Uint8Array(len)), b =>
    b.toString(16).padStart(2, '0')
  ).join('').slice(0, len);
}

// ── Create Key ───────────────────────────────────────────────────────────────

export interface PlanSpec {
  plan_id: string;
  name: string;
  daily_limit: number;
  results_per_query: number;
  max_qps: number;
  semantic_search: boolean;
  realtime_news: boolean;
  features: string[];
}

export const PLAN_SPECS: Record<string, PlanSpec> = {
  free: {
    plan_id: 'free',
    name: 'Free Trial',
    daily_limit: 1000,
    results_per_query: 10,
    max_qps: 5,
    semantic_search: false,
    realtime_news: false,
    features: ['Instant BM25 (<15ms)', 'Basic Memory', 'Community Support'],
  },
  payg: {
    plan_id: 'payg',
    name: 'Pay-As-You-Go (100k Pack)',
    daily_limit: 100000,
    results_per_query: 25,
    max_qps: 50,
    semantic_search: true,
    realtime_news: true,
    features: ['100,000 API Requests for $20', 'Sub-15ms BM25', 'Full Memory Isolation', '50 QPS Burst'],
  },
  pro: {
    plan_id: 'pro',
    name: 'Pay-As-You-Go (100k Pack)',
    daily_limit: 100000,
    results_per_query: 25,
    max_qps: 50,
    semantic_search: true,
    realtime_news: true,
    features: ['100,000 API Requests for $20', 'Sub-15ms BM25', 'Full Memory Isolation', '50 QPS Burst'],
  },
  business: {
    plan_id: 'business',
    name: 'Business Scale',
    daily_limit: 500000,
    results_per_query: 50,
    max_qps: 150,
    semantic_search: true,
    realtime_news: true,
    features: ['High-Volume Request Pool', 'Autonomous Edge Crawler', 'Dedicated Edge Containers', 'Team Keys'],
  },
  ultra: {
    plan_id: 'ultra',
    name: 'Business Scale',
    daily_limit: 500000,
    results_per_query: 50,
    max_qps: 150,
    semantic_search: true,
    realtime_news: true,
    features: ['High-Volume Request Pool', 'Autonomous Edge Crawler', 'Dedicated Edge Containers', 'Team Keys'],
  },
  enterprise: {
    plan_id: 'enterprise',
    name: 'Enterprise Sovereign',
    daily_limit: -1,
    results_per_query: 100,
    max_qps: 200,
    semantic_search: true,
    realtime_news: true,
    features: ['Unlimited Edge Requests', 'Dedicated PoP Sharding', 'Custom D1 Storage Partitioning', '99.99% SLA'],
  },
};

export function getPlanSpec(planId?: string): PlanSpec {
  return PLAN_SPECS[(planId || 'free').toLowerCase()] || PLAN_SPECS.free;
}

// ── In-Isolate V8 Memory Cache (Level 0: <0.05ms) ───────────────────────────
export interface IsolateKeyEntry {
  record: ApiKeyRecord;
  cachedAt: number;
}
export const KEY_ISOLATE_CACHE = new Map<string, IsolateKeyEntry>();
export const KEY_ISOLATE_TTL_MS = 60_000; // 60s
export const MAX_ISOLATE_KEYS = 1000;

export async function createApiKey(
  env: Env,
  userId: string,
  plan: string = 'free',
  label: string = '',
  keyType: 'unified' | 'memory' | 'search' | 'telemetry' | 'mcp' | 'summon' = 'unified',
): Promise<{ plainKey: string; record: ApiKeyRecord }> {
  const planSpec = getPlanSpec(plan);

  const prefix = keyType === 'memory' 
    ? 'um_' 
    : keyType === 'telemetry' 
      ? 'ut_' 
      : keyType === 'mcp'
        ? 'ud_mcp_'
        : keyType === 'summon'
          ? 'ud_summon_'
          : keyType === 'unified' 
            ? 'ud_' 
            : KEY_PREFIX;
  const plainKey = `${prefix}${randomB62(KEY_BODY_LEN)}`;
  const hashedKey = await hashKey(plainKey, env.ULTRASEARCH_SECRET);
  const keyId = randomHex(16);
  const now = Date.now();

  const defaultLabel = keyType === 'memory' 
    ? 'UltraMemory API Key' 
    : keyType === 'search' 
      ? 'UltraSearch API Key' 
      : keyType === 'telemetry'
        ? 'UltraMetrics Telemetry Key'
        : keyType === 'mcp'
          ? 'Custom MCP Sovereign Key'
          : keyType === 'summon'
            ? 'Seamless Summoning Edge Key'
            : 'Unified Sovereign Key';

  const record: ApiKeyRecord = {
    hashed_key: hashedKey,
    key_id:     keyId,
    user_id:    userId,
    plan:       planSpec.plan_id,
    key_type:   keyType,
    label:      label || defaultLabel,
    created_at: now,
    revoked:    false,
  };

  // Populate In-Isolate and KV cache proactively
  KEY_ISOLATE_CACHE.set(plainKey, { record, cachedAt: now });
  await env.KEY_CACHE.put(`key:${hashedKey}`, JSON.stringify(record), { expirationTtl: 300 });

  // Store in D1 (persistent)
  await env.DB
    .prepare(`
      INSERT INTO api_keys (hashed_key, key_id, user_id, plan, key_type, label, created_at, revoked)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `)
    .bind(hashedKey, keyId, userId, planSpec.plan_id, keyType, record.label, now)
    .run();

  return { plainKey, record };
}

// ── Validate Key ─────────────────────────────────────────────────────────────

export async function validateApiKey(
  env: Env,
  plainKey: string,
): Promise<ApiKeyRecord> {
  if (!plainKey.startsWith('us_') && !plainKey.startsWith('um_') && !plainKey.startsWith('ut_') && !plainKey.startsWith('ud_')) {
    throw new Error("Invalid API key format — must start with 'us_', 'um_', 'ut_', or 'ud_'");
  }

  const now = Date.now();

  // Tier 0: In-Isolate RAM Cache (0.01ms - 0.05ms)
  const memCached = KEY_ISOLATE_CACHE.get(plainKey);
  if (memCached && (now - memCached.cachedAt < KEY_ISOLATE_TTL_MS)) {
    if (memCached.record.revoked) {
      KEY_ISOLATE_CACHE.delete(plainKey);
      throw new Error('API key has been revoked');
    }
    return memCached.record;
  }

  const hashedKey = await hashKey(plainKey, env.ULTRASEARCH_SECRET);

  // Tier 1: Cloudflare KV Edge Cache (<15ms)
  const cacheKey = `key:${hashedKey}`;
  const cached = await env.KEY_CACHE.get<ApiKeyRecord>(cacheKey, 'json');
  if (cached) {
    if (cached.revoked) throw new Error('API key has been revoked');
    if (KEY_ISOLATE_CACHE.size >= MAX_ISOLATE_KEYS) {
      const oldest = KEY_ISOLATE_CACHE.keys().next().value;
      if (oldest) KEY_ISOLATE_CACHE.delete(oldest);
    }
    KEY_ISOLATE_CACHE.set(plainKey, { record: cached, cachedAt: now });
    return cached;
  }

  // Tier 2: D1 Database Query (Cache miss)
  const row = await env.DB
    .prepare('SELECT * FROM api_keys WHERE hashed_key = ?')
    .bind(hashedKey)
    .first<ApiKeyRecord>();

  if (!row) throw new Error('API key not found');
  if (row.revoked) throw new Error('API key has been revoked');

  // Populate KV cache (5 min TTL)
  await env.KEY_CACHE.put(cacheKey, JSON.stringify(row), { expirationTtl: 300 });

  // Populate In-Isolate cache
  KEY_ISOLATE_CACHE.set(plainKey, { record: row, cachedAt: now });

  return row;
}

// ── Revoke Key ───────────────────────────────────────────────────────────────

export async function revokeApiKey(env: Env, plainKey: string): Promise<void> {
  KEY_ISOLATE_CACHE.delete(plainKey);
  const hashedKey = await hashKey(plainKey, env.ULTRASEARCH_SECRET);

  await env.DB
    .prepare('UPDATE api_keys SET revoked = 1 WHERE hashed_key = ?')
    .bind(hashedKey)
    .run();

  // Invalidate KV cache immediately
  await env.KEY_CACHE.delete(`key:${hashedKey}`);
}

// ── List Keys for User ────────────────────────────────────────────────────────

export async function listUserKeys(env: Env, userId: string, userEmail?: string): Promise<ApiKeyRecord[]> {
  if (userEmail) {
    const { results } = await env.DB
      .prepare(`
        SELECT key_id, user_id, plan, key_type, label, created_at, revoked 
        FROM api_keys 
        WHERE user_id = ? 
           OR user_id IN (SELECT user_id FROM users WHERE email = ?)
        ORDER BY created_at DESC
      `)
      .bind(userId, userEmail.trim().toLowerCase())
      .all<Omit<ApiKeyRecord, 'hashed_key'>>();
    return results as unknown as ApiKeyRecord[];
  }
  const { results } = await env.DB
    .prepare('SELECT key_id, user_id, plan, key_type, label, created_at, revoked FROM api_keys WHERE user_id = ? ORDER BY created_at DESC')
    .bind(userId)
    .all<Omit<ApiKeyRecord, 'hashed_key'>>();
  return results as unknown as ApiKeyRecord[];
}

// ── Usage Tracking ────────────────────────────────────────────────────────────

export type UsageService = 'search' | 'memory' | 'metrics' | 'crawler' | 'other';

export interface UsageIncrementOptions {
  service?: UsageService;
  keyId?: string;
  path?: string;
  method?: string;
  status?: number;
  latencyMs?: number;
}

export async function incrementUsage(
  env: Env,
  hashedKey: string,
  options?: UsageIncrementOptions
): Promise<void> {
  const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
  const now = Date.now();
  const service = options?.service || 'other';
  const isSearch = service === 'search' ? 1 : 0;
  const isMemory = service === 'memory' ? 1 : 0;
  const isMetrics = service === 'metrics' ? 1 : 0;
  const isCrawler = service === 'crawler' ? 1 : 0;

  try {
    // 1. Upsert daily counter in D1
    await env.DB
      .prepare(`
        INSERT INTO usage (hashed_key, date, request_count, search_count, memory_count, metrics_count, crawler_count, last_used_at)
        VALUES (?, ?, 1, ?, ?, ?, ?, ?)
        ON CONFLICT (hashed_key, date)
        DO UPDATE SET
          request_count = request_count + 1,
          search_count  = search_count + excluded.search_count,
          memory_count  = memory_count + excluded.memory_count,
          metrics_count = metrics_count + excluded.metrics_count,
          crawler_count = crawler_count + excluded.crawler_count,
          last_used_at  = excluded.last_used_at
      `)
      .bind(hashedKey, today, isSearch, isMemory, isMetrics, isCrawler, now)
      .run();

    // 2. Log real-time micro-event
    await env.DB
      .prepare(`
        INSERT INTO api_key_usage_events (hashed_key, key_id, service, path, method, status, latency_ms, timestamp, date)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        hashedKey,
        options?.keyId || null,
        service,
        options?.path || '/',
        options?.method || 'GET',
        options?.status || 200,
        options?.latencyMs || 0,
        now,
        today
      )
      .run();
  } catch (err) {
    console.warn('Non-fatal usage increment error:', err);
  }
}

export async function getUsage(
  env: Env,
  plainKey: string,
): Promise<Record<string, unknown>> {
  const hashedKey = await hashKey(plainKey, env.ULTRASEARCH_SECRET);
  const today = new Date().toISOString().slice(0, 10);

  const [keyRow, usageRow] = await Promise.all([
    env.DB.prepare('SELECT plan, label, created_at FROM api_keys WHERE hashed_key = ?').bind(hashedKey).first<{ plan: string; label: string; created_at: number }>(),
    env.DB.prepare('SELECT request_count, search_count, memory_count, metrics_count, crawler_count, last_used_at FROM usage WHERE hashed_key = ? AND date = ?').bind(hashedKey, today).first<{ request_count: number; search_count: number; memory_count: number; metrics_count: number; crawler_count: number; last_used_at: number }>(),
  ]);

  if (!keyRow) {
    return {
      plan:           'free',
      label:          'Edge Sandbox',
      daily_limit:    100,
      requests_today: usageRow?.request_count ?? 0,
      search_today:   usageRow?.search_count ?? 0,
      memory_today:   usageRow?.memory_count ?? 0,
      metrics_today:  usageRow?.metrics_count ?? 0,
      crawler_today:  usageRow?.crawler_count ?? 0,
      remaining:      Math.max(0, 100 - (usageRow?.request_count ?? 0)),
      last_used_at:   usageRow?.last_used_at ? new Date(usageRow.last_used_at).toISOString() : null,
      reset_at:       `${today}T00:00:00Z (next day)`,
    };
  }

  const planDetails = await env.DB
    .prepare('SELECT daily_limit FROM plans WHERE plan_id = ?')
    .bind(keyRow.plan)
    .first<{ daily_limit: number }>();

  const dailyLimit = planDetails?.daily_limit ?? 100;
  const used = usageRow?.request_count ?? 0;

  return {
    plan:           keyRow.plan,
    label:          keyRow.label,
    daily_limit:    dailyLimit === -1 ? 'unlimited' : dailyLimit,
    requests_today: used,
    search_today:   usageRow?.search_count ?? 0,
    memory_today:   usageRow?.memory_count ?? 0,
    metrics_today:  usageRow?.metrics_count ?? 0,
    crawler_today:  usageRow?.crawler_count ?? 0,
    remaining:      dailyLimit === -1 ? 'unlimited' : Math.max(0, dailyLimit - used),
    last_used_at:   usageRow?.last_used_at ? new Date(usageRow.last_used_at).toISOString() : null,
    reset_at:       `${today}T00:00:00Z (next day)`,
  };
}

export interface KeyMetricItem {
  key_id: string;
  label: string;
  plan: string;
  key_type: string;
  created_at: number;
  today_total: number;
  today_search: number;
  today_memory: number;
  today_metrics: number;
  today_crawler: number;
  daily_limit: number | string;
  percent_used: number;
  last_used_at: string | null;
  history_7d: Array<{
    date: string;
    total: number;
    search: number;
    memory: number;
    metrics: number;
    crawler: number;
  }>;
}

export interface UsageMetricsReport {
  date: string;
  timestamp: number;
  combined_today: {
    total: number;
    search: number;
    memory: number;
    metrics: number;
    crawler: number;
  };
  combined_history_7d: Array<{
    date: string;
    total: number;
    search: number;
    memory: number;
    metrics: number;
    crawler: number;
  }>;
  keys: KeyMetricItem[];
  recent_live_events: Array<{
    event_id: number;
    key_id: string | null;
    label: string | null;
    service: string;
    path: string;
    method: string;
    status: number;
    latency_ms: number;
    timestamp: number;
  }>;
}

export async function getApiKeyMetrics(
  env: Env,
  userId?: string,
  userEmail?: string,
  singleHashedKey?: string
): Promise<UsageMetricsReport> {
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  // Generate 7-day date window (oldest to newest)
  const last7Days: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now - i * 86400000);
    last7Days.push(d.toISOString().slice(0, 10));
  }
  const oldestDate = last7Days[0];

  // 1. Resolve keys to report on
  interface DbKeyRow {
    hashed_key: string;
    key_id: string;
    label: string;
    plan: string;
    key_type: string;
    created_at: number;
  }

  let keyRows: DbKeyRow[] = [];

  if (userId) {
    const { results } = await env.DB
      .prepare('SELECT hashed_key, key_id, label, plan, key_type, created_at FROM api_keys WHERE user_id = ? AND revoked = 0 ORDER BY created_at DESC')
      .bind(userId)
      .all<DbKeyRow>();
    if (results && results.length > 0) {
      keyRows = results;
    }
  }

  if (keyRows.length === 0 && singleHashedKey) {
    const single = await env.DB
      .prepare('SELECT hashed_key, key_id, label, plan, key_type, created_at FROM api_keys WHERE hashed_key = ?')
      .bind(singleHashedKey)
      .first<DbKeyRow>();
    if (single) {
      keyRows = [single];
    }
  }

  // Fallback: If no custom key found, include sandbox key so dashboard is never empty
  if (keyRows.length === 0) {
    keyRows = [{
      hashed_key: 'sandbox_public_guest_hash',
      key_id: 'key_public_sandbox',
      label: 'Edge Public Sandbox',
      plan: 'free',
      key_type: 'unified',
      created_at: now,
    }];
  }

  // 2. Fetch plan limits
  const { results: planRows } = await env.DB
    .prepare('SELECT plan_id, daily_limit FROM plans')
    .all<{ plan_id: string; daily_limit: number }>();
  const planLimits: Record<string, number> = {};
  if (planRows) {
    for (const p of planRows) {
      planLimits[p.plan_id] = p.daily_limit;
    }
  }

  // 3. For each key, query usage for the 7-day window
  const keyMetricItems: KeyMetricItem[] = [];
  const keyLabelsMap: Record<string, string> = {};

  // Aggregation buckets for combined 7 days
  const combinedHistoryBuckets: Record<string, { total: number; search: number; memory: number; metrics: number; crawler: number }> = {};
  for (const d of last7Days) {
    combinedHistoryBuckets[d] = { total: 0, search: 0, memory: 0, metrics: 0, crawler: 0 };
  }

  for (const k of keyRows) {
    keyLabelsMap[k.key_id] = k.label || k.key_id;

    interface UsageDbRow {
      date: string;
      request_count: number;
      search_count: number;
      memory_count: number;
      metrics_count: number;
      crawler_count: number;
      last_used_at: number;
    }

    const { results: usageRows } = await env.DB
      .prepare(`
        SELECT date, request_count, search_count, memory_count, metrics_count, crawler_count, last_used_at
        FROM usage
        WHERE hashed_key = ? AND date >= ?
        ORDER BY date ASC
      `)
      .bind(k.hashed_key, oldestDate)
      .all<UsageDbRow>();

    const usageByDate: Record<string, UsageDbRow> = {};
    let latestUsedAt: number | null = null;

    if (usageRows) {
      for (const row of usageRows) {
        usageByDate[row.date] = row;
        if (row.last_used_at && (!latestUsedAt || row.last_used_at > latestUsedAt)) {
          latestUsedAt = row.last_used_at;
        }
      }
    }

    const todayUsage = usageByDate[today];
    const todayTotal = todayUsage?.request_count ?? 0;
    const todaySearch = todayUsage?.search_count ?? 0;
    const todayMemory = todayUsage?.memory_count ?? 0;
    const todayMetrics = todayUsage?.metrics_count ?? 0;
    const todayCrawler = todayUsage?.crawler_count ?? 0;

    const limit = planLimits[k.plan] ?? 100;
    const percentUsed = limit === -1 ? 0 : Math.min(100, Math.round((todayTotal / limit) * 100));

    // Construct 7-day history for this key
    const history7d = last7Days.map(dateStr => {
      const u = usageByDate[dateStr];
      const tot = u?.request_count ?? 0;
      const srch = u?.search_count ?? 0;
      const mem = u?.memory_count ?? 0;
      const met = u?.metrics_count ?? 0;
      const crw = u?.crawler_count ?? 0;

      // Add to combined buckets
      combinedHistoryBuckets[dateStr].total += tot;
      combinedHistoryBuckets[dateStr].search += srch;
      combinedHistoryBuckets[dateStr].memory += mem;
      combinedHistoryBuckets[dateStr].metrics += met;
      combinedHistoryBuckets[dateStr].crawler += crw;

      return {
        date: dateStr,
        total: tot,
        search: srch,
        memory: mem,
        metrics: met,
        crawler: crw,
      };
    });

    keyMetricItems.push({
      key_id: k.key_id,
      label: k.label || 'API Key',
      plan: k.plan,
      key_type: k.key_type || 'unified',
      created_at: k.created_at,
      today_total: todayTotal,
      today_search: todaySearch,
      today_memory: todayMemory,
      today_metrics: todayMetrics,
      today_crawler: todayCrawler,
      daily_limit: limit === -1 ? 'Unlimited' : limit,
      percent_used: percentUsed,
      last_used_at: latestUsedAt ? new Date(latestUsedAt).toISOString() : null,
      history_7d: history7d,
    });
  }

  // 4. Combined totals today
  const combinedToday = {
    total: keyMetricItems.reduce((acc, k) => acc + k.today_total, 0),
    search: keyMetricItems.reduce((acc, k) => acc + k.today_search, 0),
    memory: keyMetricItems.reduce((acc, k) => acc + k.today_memory, 0),
    metrics: keyMetricItems.reduce((acc, k) => acc + k.today_metrics, 0),
    crawler: keyMetricItems.reduce((acc, k) => acc + k.today_crawler, 0),
  };

  const combinedHistory7d = last7Days.map(dateStr => ({
    date: dateStr,
    ...combinedHistoryBuckets[dateStr],
  }));

  // 5. Query recent live events (top 30)
  const hashedKeys = keyRows.map(k => k.hashed_key);
  const placeholders = hashedKeys.map(() => '?').join(',');

  interface EventDbRow {
    event_id: number;
    key_id: string | null;
    service: string;
    path: string;
    method: string;
    status: number;
    latency_ms: number;
    timestamp: number;
  }

  let recentEvents: EventDbRow[] = [];
  try {
    const { results } = await env.DB
      .prepare(`
        SELECT event_id, key_id, service, path, method, status, latency_ms, timestamp
        FROM api_key_usage_events
        WHERE hashed_key IN (${placeholders})
        ORDER BY timestamp DESC
        LIMIT 30
      `)
      .bind(...hashedKeys)
      .all<EventDbRow>();
    if (results) recentEvents = results;
  } catch (err) {
    console.warn('Recent events fetch non-fatal:', err);
  }

  return {
    date: today,
    timestamp: now,
    combined_today: combinedToday,
    combined_history_7d: combinedHistory7d,
    keys: keyMetricItems,
    recent_live_events: recentEvents.map(e => ({
      ...e,
      label: (e.key_id && keyLabelsMap[e.key_id]) || (e.key_id ? e.key_id.slice(0, 12) : 'Key'),
    })),
  };
}


