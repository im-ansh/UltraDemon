import type {
  CaptureEventParams,
  VipTargetParams,
  VipTarget,
  VipTrace,
  CustomerProfileReport,
  AnalyticsOverview,
} from '../types';
import { ValidationError } from '../errors';

export class TelemetryService {
  constructor(
    private readonly request: <T>(path: string, options?: RequestInit) => Promise<T>
  ) {}

  /**
   * Capture a client event with sub-5ms edge ingestion and kinetic dwell tracking.
   *
   * @param params Event parameters (eventName, distinctId, properties, kineticDwell, hardware, clientIp)
   */
  async capture(params: CaptureEventParams): Promise<{ success: boolean; event_id: string; latency_ms: number }> {
    if (!params.eventName || !params.eventName.trim()) {
      throw new ValidationError('eventName is required.');
    }
    if (!params.distinctId || !params.distinctId.trim()) {
      throw new ValidationError('distinctId is required.');
    }

    return this.request<{ success: boolean; event_id: string; latency_ms: number }>('/v1/analytics/capture', {
      method: 'POST',
      body: JSON.stringify({
        event: params.eventName.trim(),
        distinct_id: params.distinctId.trim(),
        properties: params.properties || {},
        kinetic_dwell: params.kineticDwell,
        hardware: params.hardware,
        client_ip: params.clientIp,
        user_agent: params.userAgent,
      }),
    });
  }

  /**
   * Register a VIP client target or specific IP address to watch in real time.
   */
  async createVipTarget(params: VipTargetParams): Promise<VipTarget> {
    if (!params.targetValue || !params.targetValue.trim()) {
      throw new ValidationError('targetValue is required.');
    }

    const res = await this.request<{ target: VipTarget }>('/v1/analytics/tracing/targets', {
      method: 'POST',
      body: JSON.stringify({
        target_type: params.targetType,
        target_value: params.targetValue.trim(),
        client_label: params.clientLabel || params.targetValue,
        notes: params.notes,
      }),
    });
    return res.target;
  }

  /**
   * Retrieve all currently active watched VIP targets.
   */
  async getVipTargets(): Promise<VipTarget[]> {
    const res = await this.request<{ targets: VipTarget[] }>('/v1/analytics/tracing/targets');
    return res.targets || [];
  }

  /**
   * Delete a VIP watch target.
   */
  async deleteVipTarget(targetId: string): Promise<{ success: boolean }> {
    if (!targetId) throw new ValidationError('targetId is required.');
    return this.request<{ success: boolean }>(`/v1/analytics/tracing/targets/${encodeURIComponent(targetId)}`, {
      method: 'DELETE',
    });
  }

  /**
   * Retrieve the real-time micro-trace stream for watched VIP targets.
   */
  async getVipTraces(options?: { limit?: number }): Promise<VipTrace[]> {
    const limit = options?.limit || 25;
    const res = await this.request<{ traces: VipTrace[] }>(`/v1/analytics/tracing/live?limit=${limit}`);
    return res.traces || [];
  }

  /**
   * Synthesize or retrieve an Autonomous Customer Profile (ICP Blueprint).
   * Feature exclusive to UltraDemon (PostHog does not offer autonomous ICP clustering).
   *
   * @param options Horizon period: 'weekly' | 'monthly' | 'yearly' (default: 'monthly')
   */
  async getCustomerProfile(options?: { period?: 'weekly' | 'monthly' | 'yearly' }): Promise<CustomerProfileReport> {
    const period = options?.period || 'monthly';
    return this.request<CustomerProfileReport>(`/v1/analytics/customer-profile?period=${encodeURIComponent(period)}`);
  }

  /**
   * Force regenerate a fresh Autonomous Customer Profile report.
   */
  async generateCustomerProfile(options?: { period?: 'weekly' | 'monthly' | 'yearly' }): Promise<CustomerProfileReport> {
    const period = options?.period || 'monthly';
    return this.request<CustomerProfileReport>(`/v1/analytics/customer-profile/generate?period=${encodeURIComponent(period)}`, {
      method: 'POST',
    });
  }

  /**
   * Fetch 24-hour overview KPIs: live active visitors, pageviews, bounce rate, and Core Web Vitals.
   */
  async getOverview(): Promise<AnalyticsOverview> {
    return this.request<AnalyticsOverview>('/v1/analytics/overview');
  }

  /**
   * Fetch granular dimension telemetry reports (pages, referrers, geo footprint, device breakdown, kinetic activity, and unmasked GPU silicon).
   */
  async getReports(options?: { dimension?: string }): Promise<Record<string, unknown>> {
    const dim = options?.dimension || 'all';
    return this.request<Record<string, unknown>>(`/v1/analytics/reports?dimension=${encodeURIComponent(dim)}`);
  }
}

