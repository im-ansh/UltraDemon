import type {
  StoreMemoryParams,
  StoredMemory,
  QueryMemoryParams,
  MemoryRecallResponse,
  MemoryStats,
} from '../types';
import { ValidationError } from '../errors';

export class MemoryService {
  constructor(
    private readonly request: <T>(path: string, options?: RequestInit) => Promise<T>
  ) {}

  /**
   * Store long-term knowledge into sovereign Cloudflare D1 SQLite FTS5.
   *
   * @param params Memory parameters (content, memoryType, containerTag, metadata)
   * @returns StoredMemory object with generated memory_id.
   */
  async store(params: StoreMemoryParams): Promise<StoredMemory> {
    if (!params.content || !params.content.trim()) {
      throw new ValidationError('Memory content cannot be empty.');
    }

    const res = await this.request<{ status: string; memory: StoredMemory; memory_id?: string }>('/v1/memory', {
      method: 'POST',
      body: JSON.stringify({
        content: params.content.trim(),
        memory_type: params.memoryType || 'fact',
        container_tag: params.containerTag || 'default',
        metadata: params.metadata || {},
      }),
    });

    return res.memory || {
      memory_id: res.memory_id || '',
      content: params.content,
      container_tag: params.containerTag || 'default',
      memory_type: params.memoryType || 'fact',
      metadata: params.metadata,
      created_at: Date.now(),
    };
  }

  /**
   * Recall long-term memories using sub-15ms edge BM25 matching.
   *
   * @param params Query parameters (query, containerTag, limit)
   * @returns MemoryRecallResponse with matching items ranked by relevance.
   */
  async query(params: QueryMemoryParams): Promise<MemoryRecallResponse> {
    if (!params.query || !params.query.trim()) {
      throw new ValidationError('Query parameter is required.');
    }

    return this.request<MemoryRecallResponse>('/v1/memory/query', {
      method: 'POST',
      body: JSON.stringify({
        query: params.query.trim(),
        container_tag: params.containerTag || 'default',
        limit: params.limit || 5,
      }),
    });
  }

  /**
   * List memories stored in an isolated container namespace or across all containers.
   */
  async list(options?: { containerTag?: string; limit?: number }): Promise<StoredMemory[]> {
    const params = new URLSearchParams();
    if (options?.containerTag) params.set('container_tag', options.containerTag);
    if (options?.limit) params.set('limit', String(options.limit));

    const qs = params.toString() ? `?${params.toString()}` : '';
    const res = await this.request<{ memories: StoredMemory[] }>(`/v1/memory${qs}`);
    return res.memories || [];
  }

  /**
   * Retrieve a specific memory by its ID.
   */
  async get(memoryId: string): Promise<StoredMemory> {
    if (!memoryId) throw new ValidationError('memoryId is required.');
    const res = await this.request<{ memory: StoredMemory }>(`/v1/memory/${encodeURIComponent(memoryId)}`);
    return res.memory;
  }

  /**
   * Delete a specific memory by ID.
   */
  async delete(memoryId: string): Promise<{ success: boolean; deleted_id: string }> {
    if (!memoryId) throw new ValidationError('memoryId is required.');
    return this.request<{ success: boolean; deleted_id: string }>(`/v1/memory/${encodeURIComponent(memoryId)}`, {
      method: 'DELETE',
    });
  }

  /**
   * Purge all memories inside a specific container namespace.
   */
  async deleteContainer(containerTag: string): Promise<{ success: boolean; container_tag: string }> {
    if (!containerTag) throw new ValidationError('containerTag is required.');
    return this.request<{ success: boolean; container_tag: string }>('/v1/memory', {
      method: 'DELETE',
      body: JSON.stringify({ container_tag: containerTag }),
    });
  }

  /**
   * Retrieve memory database statistics and index health.
   */
  async stats(): Promise<MemoryStats> {
    return this.request<MemoryStats>('/v1/memory/stats');
  }
}

