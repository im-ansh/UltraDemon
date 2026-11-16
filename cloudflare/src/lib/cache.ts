// UltraSearch — High-Performance Multi-Tier Edge Cache Layer
// Tier 0: In-Isolate V8 Memory (<0.05ms RAM)
// Tier 1: Cloudflare KV Global Cache (<15ms Anycast)

import type { Env, SearchResponse } from '../types';

const KV_CACHE_TTL_SECONDS = 120; // 2 min for search results in KV
const ISOLATE_CACHE_TTL_MS = 60_000; // 60s in local isolate RAM
const MAX_ISOLATE_ENTRIES = 500;

interface IsolateSearchEntry {
  response: SearchResponse;
  ts: number;
}

const ISOLATE_SEARCH_CACHE = new Map<string, IsolateSearchEntry>();

function buildCacheKey(query: string, params: Record<string, unknown>): string {
  const normalized = query.toLowerCase().trim();
  const suffix = Object.entries(params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join('&');
  return `search:${normalized}:${suffix}`;
}

export async function getCachedSearch(
  env: Env,
  query: string,
  params: Record<string, unknown>,
): Promise<{ response: SearchResponse; cacheTier: 'RAM' | 'KV' } | null> {
  const key = buildCacheKey(query, params);

  // 1. Tier 0: In-Isolate Memory Cache (0.01ms - 0.05ms)
  const now = Date.now();
  const ramCached = ISOLATE_SEARCH_CACHE.get(key);
  if (ramCached && (now - ramCached.ts < ISOLATE_CACHE_TTL_MS)) {
    return {
      response: { ...ramCached.response },
      cacheTier: 'RAM',
    };
  }

  // 2. Tier 1: Cloudflare Anycast KV Cache (<15ms)
  try {
    if (env.SEARCH_CACHE && typeof env.SEARCH_CACHE.get === 'function') {
      const kvCached = await env.SEARCH_CACHE.get<SearchResponse>(key, 'json');
      if (kvCached) {
        // Warm up isolate cache for subsequent requests
        if (ISOLATE_SEARCH_CACHE.size >= MAX_ISOLATE_ENTRIES) {
          const oldest = ISOLATE_SEARCH_CACHE.keys().next().value;
          if (oldest) ISOLATE_SEARCH_CACHE.delete(oldest);
        }
        ISOLATE_SEARCH_CACHE.set(key, { response: kvCached, ts: now });
        return {
          response: kvCached,
          cacheTier: 'KV',
        };
      }
    }
  } catch (err) {
    console.warn('KV search cache read non-fatal:', err);
  }

  return null;
}

export async function setCachedSearch(
  env: Env,
  query: string,
  params: Record<string, unknown>,
  response: SearchResponse,
): Promise<void> {
  const key = buildCacheKey(query, params);
  const now = Date.now();

  // Populate Tier 0 (RAM)
  if (ISOLATE_SEARCH_CACHE.size >= MAX_ISOLATE_ENTRIES) {
    const oldest = ISOLATE_SEARCH_CACHE.keys().next().value;
    if (oldest) ISOLATE_SEARCH_CACHE.delete(oldest);
  }
  ISOLATE_SEARCH_CACHE.set(key, { response, ts: now });

  // Populate Tier 1 (KV)
  try {
    if (env.SEARCH_CACHE && typeof env.SEARCH_CACHE.put === 'function') {
      await env.SEARCH_CACHE.put(key, JSON.stringify(response), {
        expirationTtl: KV_CACHE_TTL_SECONDS,
      });
    }
  } catch (err) {
    console.warn('KV search cache write non-fatal:', err);
  }
}

export function clearIsolateSearchCache(): void {
  ISOLATE_SEARCH_CACHE.clear();
}
