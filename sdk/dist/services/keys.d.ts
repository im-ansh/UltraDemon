import type { CreateKeyParams, ApiKeyItem, UsageReport } from '../types';
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
export declare class KeysService {
    private readonly request;
    constructor(request: <T>(path: string, options?: RequestInit) => Promise<T>);
    /**
     * List all sovereign API keys for the authenticated account.
     */
    list(): Promise<ApiKeyItem[]>;
    /**
     * Provision a new sovereign API key.
     */
    create(params?: CreateKeyParams): Promise<ApiKeyItem & {
        plain_key: string;
    }>;
    /**
     * Revoke an active API key by ID or plain key.
     */
    revoke(keyIdOrPlain: string): Promise<{
        success: boolean;
        message: string;
    }>;
    /**
     * Real-Time Daily Calls & Usage Metrics Dashboard.
     * Tracks requests made per day for each individual API key, separated across UltraSearch, UltraMemory, and UltraMetrics, plus combined totals.
     */
    getMetrics(): Promise<UsageMetricsReport>;
    /**
     * Get quota and usage summary for the current active key.
     */
    getUsage(): Promise<UsageReport>;
}
