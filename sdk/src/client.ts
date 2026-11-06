import type { UltrademonOptions, UsageReport } from './types';
import {
  UltrademonError,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
} from './errors';
import { SearchService } from './services/search';
import { MemoryService } from './services/memory';
import { TelemetryService } from './services/telemetry';
import { CrawlerService } from './services/crawler';
import { KeysService } from './services/keys';

const DEFAULT_BASE_URL = 'https://ultrasearch-api.aaronvanoss.workers.dev';
const DEFAULT_TIMEOUT_MS = 30000;

export class Ultrademon {
  public readonly search: SearchService;
  public readonly memory: MemoryService;
  public readonly telemetry: TelemetryService;
  public readonly crawler: CrawlerService;
  public readonly keys: KeysService;

  private readonly apiKey?: string;
  private readonly token?: string;
  private readonly baseUrl: string;
  private readonly timeoutMs: number;
  private readonly customFetch: typeof fetch;

  constructor(options: UltrademonOptions = {}) {
    this.apiKey = options.apiKey;
    this.token = options.token;
    this.baseUrl = (options.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');
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
  async usage(): Promise<UsageReport> {
    return this.keys.getUsage();
  }

  /**
   * Internal HTTP execution wrapper with standard error classification and timeout.
   */
  private async request<T>(path: string, init: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    const headers = new Headers(init.headers || {});

    if (!headers.has('Content-Type') && init.body && typeof init.body === 'string') {
      headers.set('Content-Type', 'application/json');
    }

    if (this.apiKey && !headers.has('X-API-Key')) {
      headers.set('X-API-Key', this.apiKey);
    }

    if (this.token && !headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await this.customFetch(url, {
        ...init,
        headers,
        signal: controller.signal,
      });

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const data = isJson ? await response.json() : await response.text();

      if (!response.ok) {
        const errorMessage = (typeof data === 'object' && data !== null && 'error' in data)
          ? String((data as { error: unknown }).error)
          : (typeof data === 'string' ? data : `HTTP ${response.status} ${response.statusText}`);

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

        throw new UltrademonError(errorMessage, response.status, undefined, data);
      }

      return data as T;
    } catch (err: unknown) {
      if (err instanceof UltrademonError) {
        throw err;
      }
      if (err instanceof Error && err.name === 'AbortError') {
        throw new UltrademonError(`Request timed out after ${this.timeoutMs}ms`, 408, 'TIMEOUT');
      }
      throw new UltrademonError(
        (err as Error)?.message || 'An unknown network error occurred',
        undefined,
        'NETWORK_ERROR'
      );
    } finally {
      clearTimeout(timeout);
    }
  }
}

