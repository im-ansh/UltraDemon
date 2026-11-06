import type { SearchParams, SearchResponse } from '../types';
export declare class SearchService {
    private readonly request;
    constructor(request: <T>(path: string, options?: RequestInit) => Promise<T>);
    /**
     * Execute an UltraSearch query across the global Cloudflare Anycast edge network.
     *
     * @param params Search query parameters (mode, numResults, useCache, country)
     * @returns SearchResponse containing ranked results, BM25 score, and latency benchmarks.
     */
    query(params: SearchParams): Promise<SearchResponse>;
    /**
     * Mode 1: Instant Recall (<15ms).
     * Ultra-lightweight projection with zero SQLite snippet parsing or heavy content serialization.
     */
    instant(query: string, numResults?: number): Promise<SearchResponse>;
    /**
     * Mode 2: Standard Hybrid Recall.
     * BM25 full-text rank combined with PageRank quality multiplier and recency scoring.
     */
    standard(query: string, numResults?: number): Promise<SearchResponse>;
    /**
     * Mode 3: Deep Research.
     * Multi-pass semantic expansion and synthesis over edge crawled documents.
     */
    deep(query: string, numResults?: number): Promise<SearchResponse>;
}
