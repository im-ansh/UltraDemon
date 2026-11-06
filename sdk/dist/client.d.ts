import type { UltrademonOptions, UsageReport } from './types';
import { SearchService } from './services/search';
import { MemoryService } from './services/memory';
import { TelemetryService } from './services/telemetry';
import { CrawlerService } from './services/crawler';
import { KeysService } from './services/keys';
export declare class Ultrademon {
    readonly search: SearchService;
    readonly memory: MemoryService;
    readonly telemetry: TelemetryService;
    readonly crawler: CrawlerService;
    readonly keys: KeysService;
    private readonly apiKey?;
    private readonly token?;
    private readonly baseUrl;
    private readonly timeoutMs;
    private readonly customFetch;
    constructor(options?: UltrademonOptions);
    /**
     * Shortcut to query key quota and daily request usage.
     */
    usage(): Promise<UsageReport>;
    /**
     * Internal HTTP execution wrapper with standard error classification and timeout.
     */
    private request;
}
