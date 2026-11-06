import type { CrawlParams, CrawlResult, CrawlerStats } from '../types';
import { ValidationError } from '../errors';

export class CrawlerService {
  constructor(
    private readonly request: <T>(path: string, options?: RequestInit) => Promise<T>
  ) {}

  /**
   * Submit a URL to the autonomous streaming crawler.
   * Cleans HTML, extracts markdown, and indexes pages into Cloudflare D1 SQLite FTS5 in real time.
   */
  async crawl(params: CrawlParams): Promise<CrawlResult> {
    if (!params.url || !params.url.trim()) {
      throw new ValidationError('Crawl target URL is required.');
    }

    return this.request<CrawlResult>('/v1/crawl', {
      method: 'POST',
      body: JSON.stringify({
        url: params.url.trim(),
        depth: params.depth || 1,
        max_pages: params.maxPages || 10,
      }),
    });
  }

  /**
   * Fetch live indexing and crawler queue metrics.
   */
  async stats(): Promise<CrawlerStats> {
    return this.request<CrawlerStats>('/v1/crawler/stats');
  }
}

