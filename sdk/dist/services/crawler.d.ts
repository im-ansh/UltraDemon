import type { CrawlParams, CrawlResult, CrawlerStats } from '../types';
export declare class CrawlerService {
    private readonly request;
    constructor(request: <T>(path: string, options?: RequestInit) => Promise<T>);
    /**
     * Submit a URL to the autonomous streaming crawler.
     * Cleans HTML, extracts markdown, and indexes pages into Cloudflare D1 SQLite FTS5 in real time.
     */
    crawl(params: CrawlParams): Promise<CrawlResult>;
    /**
     * Fetch live indexing and crawler queue metrics.
     */
    stats(): Promise<CrawlerStats>;
}
