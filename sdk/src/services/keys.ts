import type { CreateKeyParams, ApiKeyItem, UsageReport } from '../types';
import { ValidationError } from '../errors';

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

export class KeysService {
  constructor(
    private readonly request: <T>(path: string, options?: RequestInit) => Promise<T>
  ) {}

  /**
   * List all sovereign API keys for the authenticated account.
   */
  async list(): Promise<ApiKeyItem[]> {
    const res = await this.request<{ keys: ApiKeyItem[] }>('/v1/keys');
    return res.keys || [];
  }

  /**
   * Provision a new sovereign API key.
   */
  async create(params: CreateKeyParams = {}): Promise<ApiKeyItem & { plain_key: string }> {
    return this.request<ApiKeyItem & { plain_key: string }>('/v1/keys', {
      method: 'POST',
      body: JSON.stringify({
        label: params.label,
        plan: params.plan || 'free',
        key_type: params.keyType || 'unified',
      }),
    });
  }

  /**
   * Revoke an active API key by ID or plain key.
   */
  async revoke(keyIdOrPlain: string): Promise<{ success: boolean; message: string }> {
    if (!keyIdOrPlain) throw new ValidationError('API key identifier is required.');
    return this.request<{ success: boolean; message: string }>(`/v1/keys/${encodeURIComponent(keyIdOrPlain)}`, {
      method: 'DELETE',
    });
  }

  /**
   * Real-Time Daily Calls & Usage Metrics Dashboard.
   * Tracks requests made per day for each individual API key, separated across UltraSearch, UltraMemory, and UltraMetrics, plus combined totals.
   */
  async getMetrics(): Promise<UsageMetricsReport> {
    return this.request<UsageMetricsReport>('/v1/keys/metrics');
  }

  /**
   * Get quota and usage summary for the current active key.
   */
  async getUsage(): Promise<UsageReport> {
    return this.request<UsageReport>('/v1/usage');
  }
}
