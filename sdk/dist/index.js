"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  AuthenticationError: () => AuthenticationError,
  CrawlerService: () => CrawlerService,
  KeysService: () => KeysService,
  MemoryService: () => MemoryService,
  NotFoundError: () => NotFoundError,
  RateLimitError: () => RateLimitError,
  SearchService: () => SearchService,
  TelemetryService: () => TelemetryService,
  Ultrademon: () => Ultrademon,
  UltrademonError: () => UltrademonError,
  ValidationError: () => ValidationError,
  default: () => index_default
});
module.exports = __toCommonJS(index_exports);

// src/errors.ts
var UltrademonError = class extends Error {
  status;
  code;
  details;
  constructor(message, status, code, details) {
    super(message);
    this.name = "UltrademonError";
    this.status = status;
    this.code = code;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
};
var AuthenticationError = class extends UltrademonError {
  constructor(message = "Authentication failed. Please verify your API key or bearer token.") {
    super(message, 401, "AUTHENTICATION_REQUIRED");
    this.name = "AuthenticationError";
  }
};
var RateLimitError = class extends UltrademonError {
  constructor(message = "Rate limit or monthly quota exceeded.") {
    super(message, 429, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
  }
};
var NotFoundError = class extends UltrademonError {
  constructor(message = "Requested resource was not found.") {
    super(message, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
};
var ValidationError = class extends UltrademonError {
  constructor(message, details) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
};

// src/services/search.ts
var SearchService = class {
  constructor(request) {
    this.request = request;
  }
  request;
  /**
   * Execute an UltraSearch query across the global Cloudflare Anycast edge network.
   *
   * @param params Search query parameters (mode, numResults, useCache, country)
   * @returns SearchResponse containing ranked results, BM25 score, and latency benchmarks.
   */
  async query(params) {
    if (!params.query || !params.query.trim()) {
      throw new ValidationError("Search query parameter is required and cannot be empty.");
    }
    return this.request("/v1/search", {
      method: "POST",
      body: JSON.stringify({
        query: params.query.trim(),
        mode: params.mode ?? 1,
        num_results: params.numResults ?? 10,
        use_cache: params.useCache ?? true,
        country: params.country
      })
    });
  }
  /**
   * Mode 1: Instant Recall (<15ms).
   * Ultra-lightweight projection with zero SQLite snippet parsing or heavy content serialization.
   */
  async instant(query, numResults = 10) {
    return this.query({ query, mode: 1, numResults });
  }
  /**
   * Mode 2: Standard Hybrid Recall.
   * BM25 full-text rank combined with PageRank quality multiplier and recency scoring.
   */
  async standard(query, numResults = 10) {
    return this.query({ query, mode: 2, numResults });
  }
  /**
   * Mode 3: Deep Research.
   * Multi-pass semantic expansion and synthesis over edge crawled documents.
   */
  async deep(query, numResults = 10) {
    return this.query({ query, mode: 3, numResults });
  }
};

// src/services/memory.ts
var MemoryService = class {
  constructor(request) {
    this.request = request;
  }
  request;
  /**
   * Store long-term knowledge into sovereign Cloudflare D1 SQLite FTS5.
   *
   * @param params Memory parameters (content, memoryType, containerTag, metadata)
   * @returns StoredMemory object with generated memory_id.
   */
  async store(params) {
    if (!params.content || !params.content.trim()) {
      throw new ValidationError("Memory content cannot be empty.");
    }
    const res = await this.request("/v1/memory", {
      method: "POST",
      body: JSON.stringify({
        content: params.content.trim(),
        memory_type: params.memoryType || "fact",
        container_tag: params.containerTag || "default",
        metadata: params.metadata || {}
      })
    });
    return res.memory || {
      memory_id: res.memory_id || "",
      content: params.content,
      container_tag: params.containerTag || "default",
      memory_type: params.memoryType || "fact",
      metadata: params.metadata,
      created_at: Date.now()
    };
  }
  /**
   * Recall long-term memories using sub-15ms edge BM25 matching.
   *
   * @param params Query parameters (query, containerTag, limit)
   * @returns MemoryRecallResponse with matching items ranked by relevance.
   */
  async query(params) {
    if (!params.query || !params.query.trim()) {
      throw new ValidationError("Query parameter is required.");
    }
    return this.request("/v1/memory/query", {
      method: "POST",
      body: JSON.stringify({
        query: params.query.trim(),
        container_tag: params.containerTag || "default",
        limit: params.limit || 5
      })
    });
  }
  /**
   * List memories stored in an isolated container namespace or across all containers.
   */
  async list(options) {
    const params = new URLSearchParams();
    if (options?.containerTag) params.set("container_tag", options.containerTag);
    if (options?.limit) params.set("limit", String(options.limit));
    const qs = params.toString() ? `?${params.toString()}` : "";
    const res = await this.request(`/v1/memory${qs}`);
    return res.memories || [];
  }
  /**
   * Retrieve a specific memory by its ID.
   */
  async get(memoryId) {
    if (!memoryId) throw new ValidationError("memoryId is required.");
    const res = await this.request(`/v1/memory/${encodeURIComponent(memoryId)}`);
    return res.memory;
  }
  /**
   * Delete a specific memory by ID.
   */
  async delete(memoryId) {
    if (!memoryId) throw new ValidationError("memoryId is required.");
    return this.request(`/v1/memory/${encodeURIComponent(memoryId)}`, {
      method: "DELETE"
    });
  }
  /**
   * Purge all memories inside a specific container namespace.
   */
  async deleteContainer(containerTag) {
    if (!containerTag) throw new ValidationError("containerTag is required.");
    return this.request("/v1/memory", {
      method: "DELETE",
      body: JSON.stringify({ container_tag: containerTag })
    });
  }
  /**
   * Retrieve memory database statistics and index health.
   */
  async stats() {
    return this.request("/v1/memory/stats");
  }
};

// src/services/telemetry.ts
var TelemetryService = class {
  constructor(request) {
    this.request = request;
  }
  request;
  /**
   * Capture a client event with sub-5ms edge ingestion and kinetic dwell tracking.
   *
   * @param params Event parameters (eventName, distinctId, properties, kineticDwell, hardware, clientIp)
   */
  async capture(params) {
    if (!params.eventName || !params.eventName.trim()) {
      throw new ValidationError("eventName is required.");
    }
    if (!params.distinctId || !params.distinctId.trim()) {
      throw new ValidationError("distinctId is required.");
    }
    return this.request("/v1/analytics/capture", {
      method: "POST",
      body: JSON.stringify({
        event: params.eventName.trim(),
        distinct_id: params.distinctId.trim(),
        properties: params.properties || {},
        kinetic_dwell: params.kineticDwell,
        hardware: params.hardware,
        client_ip: params.clientIp,
        user_agent: params.userAgent
      })
    });
  }
  /**
   * Register a VIP client target or specific IP address to watch in real time.
   */
  async createVipTarget(params) {
    if (!params.targetValue || !params.targetValue.trim()) {
      throw new ValidationError("targetValue is required.");
    }
    const res = await this.request("/v1/analytics/tracing/targets", {
      method: "POST",
      body: JSON.stringify({
        target_type: params.targetType,
        target_value: params.targetValue.trim(),
        client_label: params.clientLabel || params.targetValue,
        notes: params.notes
      })
    });
    return res.target;
  }
  /**
   * Retrieve all currently active watched VIP targets.
   */
  async getVipTargets() {
    const res = await this.request("/v1/analytics/tracing/targets");
    return res.targets || [];
  }
  /**
   * Delete a VIP watch target.
   */
  async deleteVipTarget(targetId) {
    if (!targetId) throw new ValidationError("targetId is required.");
    return this.request(`/v1/analytics/tracing/targets/${encodeURIComponent(targetId)}`, {
      method: "DELETE"
    });
  }
  /**
   * Retrieve the real-time micro-trace stream for watched VIP targets.
   */
  async getVipTraces(options) {
    const limit = options?.limit || 25;
    const res = await this.request(`/v1/analytics/tracing/live?limit=${limit}`);
    return res.traces || [];
  }
  /**
   * Synthesize or retrieve an Autonomous Customer Profile (ICP Blueprint).
   * Feature exclusive to UltraDemon (PostHog does not offer autonomous ICP clustering).
   *
   * @param options Horizon period: 'weekly' | 'monthly' | 'yearly' (default: 'monthly')
   */
  async getCustomerProfile(options) {
    const period = options?.period || "monthly";
    return this.request(`/v1/analytics/customer-profile?period=${encodeURIComponent(period)}`);
  }
  /**
   * Force regenerate a fresh Autonomous Customer Profile report.
   */
  async generateCustomerProfile(options) {
    const period = options?.period || "monthly";
    return this.request(`/v1/analytics/customer-profile/generate?period=${encodeURIComponent(period)}`, {
      method: "POST"
    });
  }
  /**
   * Fetch 24-hour overview KPIs: live active visitors, pageviews, bounce rate, and Core Web Vitals.
   */
  async getOverview() {
    return this.request("/v1/analytics/overview");
  }
  /**
   * Fetch granular dimension telemetry reports (pages, referrers, geo footprint, device breakdown, kinetic activity, and unmasked GPU silicon).
   */
  async getReports(options) {
    const dim = options?.dimension || "all";
    return this.request(`/v1/analytics/reports?dimension=${encodeURIComponent(dim)}`);
  }
};

// src/services/crawler.ts
var CrawlerService = class {
  constructor(request) {
    this.request = request;
  }
  request;
  /**
   * Submit a URL to the autonomous streaming crawler.
   * Cleans HTML, extracts markdown, and indexes pages into Cloudflare D1 SQLite FTS5 in real time.
   */
  async crawl(params) {
    if (!params.url || !params.url.trim()) {
      throw new ValidationError("Crawl target URL is required.");
    }
    return this.request("/v1/crawl", {
      method: "POST",
      body: JSON.stringify({
        url: params.url.trim(),
        depth: params.depth || 1,
        max_pages: params.maxPages || 10
      })
    });
  }
  /**
   * Fetch live indexing and crawler queue metrics.
   */
  async stats() {
    return this.request("/v1/crawler/stats");
  }
};

// src/services/keys.ts
var KeysService = class {
  constructor(request) {
    this.request = request;
  }
  request;
  /**
   * List all sovereign API keys for the authenticated account.
   */
  async list() {
    const res = await this.request("/v1/keys");
    return res.keys || [];
  }
  /**
   * Provision a new sovereign API key.
   */
  async create(params = {}) {
    return this.request("/v1/keys", {
      method: "POST",
      body: JSON.stringify({
        label: params.label,
        plan: params.plan || "free",
        key_type: params.keyType || "unified"
      })
    });
  }
  /**
   * Revoke an active API key by ID or plain key.
   */
  async revoke(keyIdOrPlain) {
    if (!keyIdOrPlain) throw new ValidationError("API key identifier is required.");
    return this.request(`/v1/keys/${encodeURIComponent(keyIdOrPlain)}`, {
      method: "DELETE"
    });
  }
  /**
   * Real-Time Daily Calls & Usage Metrics Dashboard.
   * Tracks requests made per day for each individual API key, separated across UltraSearch, UltraMemory, and UltraMetrics, plus combined totals.
   */
  async getMetrics() {
    return this.request("/v1/keys/metrics");
  }
  /**
   * Get quota and usage summary for the current active key.
   */
  async getUsage() {
    return this.request("/v1/usage");
  }
};

// src/client.ts
var DEFAULT_BASE_URL = "https://ultrasearch-api.aaronvanoss.workers.dev";
var DEFAULT_TIMEOUT_MS = 3e4;
var Ultrademon = class {
  search;
  memory;
  telemetry;
  crawler;
  keys;
  apiKey;
  token;
  baseUrl;
  timeoutMs;
  customFetch;
  constructor(options = {}) {
    this.apiKey = options.apiKey;
    this.token = options.token;
    this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    this.customFetch = options.fetch ?? globalThis.fetch;
    const requestFn = this.request.bind(this);
    this.search = new SearchService(requestFn);
    this.memory = new MemoryService(requestFn);
    this.telemetry = new TelemetryService(requestFn);
    this.crawler = new CrawlerService(requestFn);
    this.keys = new KeysService(requestFn);
  }
  /**
   * Shortcut to query key quota and daily request usage.
   */
  async usage() {
    return this.keys.getUsage();
  }
  /**
   * Internal HTTP execution wrapper with standard error classification and timeout.
   */
  async request(path, init = {}) {
    const url = `${this.baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
    const headers = new Headers(init.headers || {});
    if (!headers.has("Content-Type") && init.body && typeof init.body === "string") {
      headers.set("Content-Type", "application/json");
    }
    if (this.apiKey && !headers.has("X-API-Key")) {
      headers.set("X-API-Key", this.apiKey);
    }
    if (this.token && !headers.has("Authorization")) {
      headers.set("Authorization", `Bearer ${this.token}`);
    }
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);
    try {
      const response = await this.customFetch(url, {
        ...init,
        headers,
        signal: controller.signal
      });
      const contentType = response.headers.get("content-type") || "";
      const isJson = contentType.includes("application/json");
      const data = isJson ? await response.json() : await response.text();
      if (!response.ok) {
        const errorMessage = typeof data === "object" && data !== null && "error" in data ? String(data.error) : typeof data === "string" ? data : `HTTP ${response.status} ${response.statusText}`;
        if (response.status === 401 || response.status === 403) {
          throw new AuthenticationError(errorMessage);
        }
        if (response.status === 429) {
          throw new RateLimitError(errorMessage);
        }
        if (response.status === 404) {
          throw new NotFoundError(errorMessage);
        }
        if (response.status === 400) {
          throw new ValidationError(errorMessage, data);
        }
        throw new UltrademonError(errorMessage, response.status, void 0, data);
      }
      return data;
    } catch (err) {
      if (err instanceof UltrademonError) {
        throw err;
      }
      if (err instanceof Error && err.name === "AbortError") {
        throw new UltrademonError(`Request timed out after ${this.timeoutMs}ms`, 408, "TIMEOUT");
      }
      throw new UltrademonError(
        err?.message || "An unknown network error occurred",
        void 0,
        "NETWORK_ERROR"
      );
    } finally {
      clearTimeout(timeout);
    }
  }
};

// src/index.ts
var index_default = Ultrademon;
