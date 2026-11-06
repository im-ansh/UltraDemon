import { Ultrademon } from './client';

export { Ultrademon };
export {
  UltrademonError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
} from './errors';
export type {
  UltrademonOptions,
  SearchMode,
  SearchParams,
  SearchResultItem,
  SearchResponse,
  StoreMemoryParams,
  StoredMemory,
  QueryMemoryParams,
  MemoryRecallItem,
  MemoryRecallResponse,
  MemoryStats,
  CaptureEventParams,
  KineticDwellTelemetry,
  HardwareFingerprint,
  VipTargetParams,
  VipTarget,
  VipTrace,
  CustomerProfileReport,
  AnalyticsOverview,
  CrawlParams,
  CrawlResult,
  CrawlerStats,
  CreateKeyParams,
  ApiKeyItem,
  UsageReport,
} from './types';
export type { UsageMetricsReport, KeyMetricItem } from './services/keys';
export { SearchService } from './services/search';
export { MemoryService } from './services/memory';
export { TelemetryService } from './services/telemetry';
export { CrawlerService } from './services/crawler';
export { KeysService } from './services/keys';

export default Ultrademon;
