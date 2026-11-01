// UltraSearch — Cloudflare Workers Types
// Bindings available on every Worker request (100% Sovereign Search)

export interface Env {
  // D1 — SQLite database with native FTS5 & BM25 at the edge
  DB: D1Database;

  // KV — ultra-fast global key-value cache
  SEARCH_CACHE: KVNamespace;   // query → search results (60s TTL)
  KEY_CACHE: KVNamespace;      // hashed_key → plan metadata (5min TTL)

  // Durable Objects — stateful per-user rate limiting
  RATE_LIMITER: DurableObjectNamespace;

  // R2 — object storage for deep index archives & raw HTML
  INDEX_BUCKET: R2Bucket;

  // Vars (wrangler.toml [vars])
  APP_NAME:          string;
  APP_VERSION:       string;
  ENVIRONMENT:       string;
  SUPABASE_URL:      string;
  SUPABASE_ANON_KEY: string;

  // Security secret for signing and hashing API keys
  ULTRASEARCH_SECRET: string;
}

// Plan config shape
export interface Plan {
  plan_id:             string;
  daily_limit:         number;   // -1 = unlimited
  results_per_query:   number;
  semantic_search:     boolean;
  realtime_news:       boolean;
  image_search:        boolean;
  price_usd_per_month: number;
}

// A search result item
export interface SearchResult {
  title:           string;
  url:             string;
  snippet:         string;
  source:          string;
  score:           number;
  published_date?: string;
  full_content?:   string;
}

// Full search response shape
export interface SearchResponse {
  query:          string;
  results:        SearchResult[];
  total_results:  number;
  search_time_ms: number;
  cached:         boolean;
  backends_used:  string[];
  mode?:          number;
  metadata:       Record<string, unknown>;
}

// API key record (stored in D1, served from KV cache)
export interface ApiKeyRecord {
  hashed_key: string;
  key_id:     string;
  user_id:    string;
  plan:       string;
  label:      string;
  created_at: number;
  revoked:    boolean;
}
