import type { SearchParams, SearchResponse } from '../types';
import { UltrademonError, ValidationError } from '../errors';

export class SearchService {
  constructor(
    private readonly request: <T>(path: string, options?: RequestInit) => Promise<T>
  ) {}

  /**
   * Execute an UltraSearch query across the global Cloudflare Anycast edge network.
   *
   * @param params Search query parameters (mode, numResults, useCache, country)
   * @returns SearchResponse containing ranked results, BM25 score, and latency benchmarks.
   */
  async query(params: SearchParams): Promise<SearchResponse> {
    if (!params.query || !params.query.trim()) {
      throw new ValidationError('Search query parameter is required and cannot be empty.');
    }

    return this.request<SearchResponse>('/v1/search', {
      method: 'POST',
      body: JSON.stringify({
        query: params.query.trim(),
        mode: params.mode ?? 1,
        num_results: params.numResults ?? 10,
        use_cache: params.useCache ?? true,
        country: params.country,
      }),
    });
  }

  /**
   * Mode 1: Instant Recall (<15ms).
   * Ultra-lightweight projection with zero SQLite snippet parsing or heavy content serialization.
   */
  async instant(query: string, numResults: number = 10): Promise<SearchResponse> {
    return this.query({ query, mode: 1, numResults });
  }

  /**
   * Mode 2: Standard Hybrid Recall.
   * BM25 full-text rank combined with PageRank quality multiplier and recency scoring.
   */
  async standard(query: string, numResults: number = 10): Promise<SearchResponse> {
    return this.query({ query, mode: 2, numResults });
  }

  /**
   * Mode 3: Deep Research.
   * Multi-pass semantic expansion and synthesis over edge crawled documents.
   */
  async deep(query: string, numResults: number = 10): Promise<SearchResponse> {
    return this.query({ query, mode: 3, numResults });
  }
}

