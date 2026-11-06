import type { CaptureEventParams, VipTargetParams, VipTarget, VipTrace, CustomerProfileReport, AnalyticsOverview } from '../types';
export declare class TelemetryService {
    private readonly request;
    constructor(request: <T>(path: string, options?: RequestInit) => Promise<T>);
    /**
     * Capture a client event with sub-5ms edge ingestion and kinetic dwell tracking.
     *
     * @param params Event parameters (eventName, distinctId, properties, kineticDwell, hardware, clientIp)
     */
    capture(params: CaptureEventParams): Promise<{
        success: boolean;
        event_id: string;
        latency_ms: number;
    }>;
    /**
     * Register a VIP client target or specific IP address to watch in real time.
     */
    createVipTarget(params: VipTargetParams): Promise<VipTarget>;
    /**
     * Retrieve all currently active watched VIP targets.
     */
    getVipTargets(): Promise<VipTarget[]>;
    /**
     * Delete a VIP watch target.
     */
    deleteVipTarget(targetId: string): Promise<{
        success: boolean;
    }>;
    /**
     * Retrieve the real-time micro-trace stream for watched VIP targets.
     */
    getVipTraces(options?: {
        limit?: number;
    }): Promise<VipTrace[]>;
    /**
     * Synthesize or retrieve an Autonomous Customer Profile (ICP Blueprint).
     * Feature exclusive to UltraDemon (PostHog does not offer autonomous ICP clustering).
     *
     * @param options Horizon period: 'weekly' | 'monthly' | 'yearly' (default: 'monthly')
     */
    getCustomerProfile(options?: {
        period?: 'weekly' | 'monthly' | 'yearly';
    }): Promise<CustomerProfileReport>;
    /**
     * Force regenerate a fresh Autonomous Customer Profile report.
     */
    generateCustomerProfile(options?: {
        period?: 'weekly' | 'monthly' | 'yearly';
    }): Promise<CustomerProfileReport>;
    /**
     * Fetch 24-hour overview KPIs: live active visitors, pageviews, bounce rate, and Core Web Vitals.
     */
    getOverview(): Promise<AnalyticsOverview>;
    /**
     * Fetch granular dimension telemetry reports (pages, referrers, geo footprint, device breakdown, kinetic activity, and unmasked GPU silicon).
     */
    getReports(options?: {
        dimension?: string;
    }): Promise<Record<string, unknown>>;
}
