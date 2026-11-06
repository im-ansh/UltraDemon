import type { StoreMemoryParams, StoredMemory, QueryMemoryParams, MemoryRecallResponse, MemoryStats } from '../types';
export declare class MemoryService {
    private readonly request;
    constructor(request: <T>(path: string, options?: RequestInit) => Promise<T>);
    /**
     * Store long-term knowledge into sovereign Cloudflare D1 SQLite FTS5.
     *
     * @param params Memory parameters (content, memoryType, containerTag, metadata)
     * @returns StoredMemory object with generated memory_id.
     */
    store(params: StoreMemoryParams): Promise<StoredMemory>;
    /**
     * Recall long-term memories using sub-15ms edge BM25 matching.
     *
     * @param params Query parameters (query, containerTag, limit)
     * @returns MemoryRecallResponse with matching items ranked by relevance.
     */
    query(params: QueryMemoryParams): Promise<MemoryRecallResponse>;
    /**
     * List memories stored in an isolated container namespace or across all containers.
     */
    list(options?: {
        containerTag?: string;
        limit?: number;
    }): Promise<StoredMemory[]>;
    /**
     * Retrieve a specific memory by its ID.
     */
    get(memoryId: string): Promise<StoredMemory>;
    /**
     * Delete a specific memory by ID.
     */
    delete(memoryId: string): Promise<{
        success: boolean;
        deleted_id: string;
    }>;
    /**
     * Purge all memories inside a specific container namespace.
     */
    deleteContainer(containerTag: string): Promise<{
        success: boolean;
        container_tag: string;
    }>;
    /**
     * Retrieve memory database statistics and index health.
     */
    stats(): Promise<MemoryStats>;
}
