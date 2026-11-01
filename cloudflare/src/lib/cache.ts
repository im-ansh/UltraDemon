// UltraSearch — KV Cache Layer
// Wraps Cloudflare KV for search result caching.
// Cache hit = sub-millisecond response globally.

import type { Env, SearchResponse } from '../types';

const CACHE_TTL_SECONDS = 60;   // 1 min for search results

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
): Promise<SearchResponse | null> {
  const key = buildCacheKey(query, params);
  return env.SEARCH_CACHE.get<SearchResponse>(key, 'json');
}

export async function setCachedSearch(
  env: Env,
  query: string,
  params: Record<string, unknown>,
  response: SearchResponse,
): Promise<void> {
  const key = buildCacheKey(query, params);
  await env.SEARCH_CACHE.put(key, JSON.stringify(response), {
    expirationTtl: CACHE_TTL_SECONDS,
  });
}

