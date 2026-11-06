export interface UltrademonOptions {
    /**
     * UltraDemon API Key (format: ud_live_... or legacy key)
     */
    apiKey?: string;
    /**
     * Bearer session token (for user account operations)
     */
    token?: string;
    /**
     * Base URL for the UltraDemon gateway.
     * Defaults to https://ultrasearch-api.aaronvanoss.workers.dev
     */
    baseUrl?: string;
    /**
     * Request timeout in milliseconds (default: 30000)
     */
    timeoutMs?: number;
    /**
     * Custom fetch implementation (optional, defaults to globalThis.fetch)
     */
    fetch?: typeof fetch;
}
export type SearchMode = 1 | 2 | 3;
export interface SearchParams {
    /**
     * Search query text
     */
    query: string;
    /**
     * Search execution mode:
     * 1 = Instant Recall (<15ms, lightweight projection, zero snippet parsing)
     * 2 = Standard Hybrid (BM25 + PageRank & freshness ranking)
     * 3 = Deep Research (Comprehensive synthesis)
     */
    mode?: SearchMode;
    /**
     * Number of results to return (default: 10, max depends on plan)
     */
    numResults?: number;
    /**
     * Whether to leverage the global Cloudflare KV cache (default: true)
     */
    useCache?: boolean;
    /**
     * Optional ISO 2-letter country code filter
     */
    country?: string;
}
export interface SearchResultItem {
    id: string | number;
    url: string;
    title: string;
    snippet?: string;
    score?: number;
    published_date?: string;
    source?: string;
}
export interface SearchResponse {
    query: string;
    mode: SearchMode;
    total_results: number;
    search_time_ms: number;
    engine: string;
    cached?: boolean;
    results: SearchResultItem[];
}
export interface StoreMemoryParams {
    /**
     * Text content of the memory to index
     */
    content: string;
    /**
     * Memory classification (e.g. "preference", "fact", "summary", "conversation")
     */
    memoryType?: string;
    /**
     * Namespace container tag for isolating memories per user, agent, or workspace.
     * Default: "default"
     */
    containerTag?: string;
    /**
     * Arbitrary JSON metadata to attach to the memory
     */
    metadata?: Record<string, unknown>;
}
export interface StoredMemory {
    memory_id: string;
    container_tag: string;
    memory_type: string;
    content: string;
    metadata?: Record<string, unknown>;
    created_at: number;
}
export interface QueryMemoryParams {
    /**
     * Natural language query or semantic keywords
     */
    query: string;
    /**
     * Container namespace to filter against (default: "default")
     */
    containerTag?: string;
    /**
     * Maximum memories to recall (default: 5)
     */
    limit?: number;
}
export interface MemoryRecallItem {
    memory_id: string;
    container_tag: string;
    memory_type: string;
    content: string;
    metadata?: Record<string, unknown>;
    created_at: number;
    score: number;
}
export interface MemoryRecallResponse {
    query: string;
    container_tag: string;
    total_matches: number;
    latency_ms: number;
    memories: MemoryRecallItem[];
}
export interface MemoryStats {
    total_memories: number;
    unique_containers: number;
    engine: string;
    fts5_status: string;
}
export interface KineticDwellTelemetry {
    activeDurationMs?: number;
    idleDurationMs?: number;
    scrollDepthPct?: number;
    tabSwitches?: number;
    rageClicks?: number;
    primaryActivity?: 'navigating' | 'reading' | 'idle' | 'coding' | 'switching';
}
export interface HardwareFingerprint {
    cpuCores?: number;
    ramGb?: number;
    gpuRenderer?: string;
    screenDensity?: number;
    darkMode?: boolean;
}
export interface CaptureEventParams {
    /**
     * Event name (e.g. "pageview", "button_click", "api_key_created")
     */
    eventName: string;
    /**
     * Distinct anonymous or identified user ID
     */
    distinctId: string;
    /**
     * Custom event properties
     */
    properties?: Record<string, unknown>;
    /**
     * Kinetic dwell and active engagement metrics
     */
    kineticDwell?: KineticDwellTelemetry;
    /**
     * Client hardware capabilities (inferred or provided)
     */
    hardware?: HardwareFingerprint;
    /**
     * Client IP address (for VIP tracing or geo resolution)
     */
    clientIp?: string;
    /**
     * Client User-Agent string
     */
    userAgent?: string;
}
export interface VipTargetParams {
    /**
     * Type of watch target: "ip" | "distinct_id" | "email"
     */
    targetType: 'ip' | 'distinct_id' | 'email';
    /**
     * Target value (e.g. "203.0.113.88" or "user_vip_42")
     */
    targetValue: string;
    /**
     * Human-readable client label or ARR value (e.g. "Acme Corp ($50k ARR)")
     */
    clientLabel?: string;
    /**
     * Optional operational notes
     */
    notes?: string;
}
export interface VipTarget {
    target_id: string;
    target_type: 'ip' | 'distinct_id' | 'email';
    target_value: string;
    client_label: string;
    hits_traced: number;
    created_at: number;
}
export interface VipTrace {
    trace_id: string;
    target_id: string;
    client_label: string;
    event_name: string;
    client_ip: string;
    edge_pop: string;
    dwell_sec: number;
    activity_mode: string;
    timestamp: number;
    properties?: Record<string, unknown>;
}
export interface CustomerProfileReport {
    has_data: boolean;
    report_period: 'weekly' | 'monthly' | 'yearly';
    total_visitors_analyzed: number;
    repeat_customers_count: number;
    persona_title: string;
    persona_archetype: string;
    summary: string;
    power_user_cluster?: {
        cluster_size: number;
        repeat_visitor_rate_pct: number;
        avg_session_duration_minutes: number;
    };
    period_comparison?: {
        power_user_growth: string;
        retention_delta: string;
        dwell_time_delta: string;
        velocity_trend: string;
    };
    ideal_customer_profile?: {
        persona_title?: string;
        archetype?: string;
        icp_fit_score?: number;
        summary?: string;
        daily_abilities?: {
            silicon_tier?: string;
            hardware_concurrency?: string;
            device_memory?: string;
            display_fidelity?: string;
            developer_runtimes?: string[];
            network_profile?: string;
        };
        daily_habits?: {
            circadian_pattern?: string;
            peak_productivity_window?: string;
            flow_state_focus_index?: string;
            active_vs_idle?: string;
            uninterrupted_flow_duration?: string;
            multitasking_cadence?: string;
            frustration_profile?: string;
            cross_device_handover?: string;
        };
        defining_traits?: Array<{
            trait: string;
            detail: string;
            significance: string;
        }>;
        actionable_playbook?: Array<{
            objective: string;
            recommendation: string;
        }>;
    };
}
export interface AnalyticsOverview {
    active_visitors_now: number;
    metrics_24h: {
        pageviews: number;
        unique_visitors: number;
        avg_session_duration_sec: number;
        bounce_rate_pct: number;
        core_web_vitals?: {
            lcp_ms: number;
            cls: number;
            fid_ms?: number;
        };
    };
}
export interface CrawlParams {
    url: string;
    depth?: number;
    maxPages?: number;
}
export interface CrawlResult {
    url: string;
    pages_crawled: number;
    pages_indexed: number;
    duration_ms: number;
    status: string;
}
export interface CrawlerStats {
    index: {
        total_documents: number;
        total_words: number;
        domains_covered: number;
    };
    crawler_queue: {
        total_queued: number;
        pending: number;
    };
    engine: string;
    status: string;
}
export interface CreateKeyParams {
    label?: string;
    plan?: 'free' | 'pro' | 'ultra' | 'enterprise';
    keyType?: 'search' | 'memory' | 'telemetry' | 'universal';
}
export interface ApiKeyItem {
    key_id: string;
    plain_key?: string;
    label?: string;
    plan: string;
    key_type?: string;
    created_at: number;
}
export interface UsageReport {
    plan: string;
    daily_requests_used: number;
    daily_requests_limit: number;
    monthly_requests_used: number;
    monthly_requests_limit: number;
    active_keys_count: number;
}
