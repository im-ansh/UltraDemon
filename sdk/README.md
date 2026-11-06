# UltraDemon Official TypeScript SDK

Official universal TypeScript/JavaScript SDK for UltraDemon: UltraSearch, UltraMemory, and UltraTelemetry.
Engineered natively for Cloudflare Workers, Node.js 18+, Bun, Deno, Next.js, and modern browsers with zero external runtime dependencies.

## Installation & CLI Usage

### Install as Library
```bash
npm install ultrademon
# or
pnpm add ultrademon
# or
bun add ultrademon
# or
yarn add ultrademon
```

### Run as CLI Command (Zero Installation)
```bash
# Instant search
npx ultrademon search "cloudflare workers edge" --limit 5

# Memory recall
npx ultrademon memory query "user preferences" --container fleet-alpha

# Store memory
npx ultrademon memory store "User prefers dark mode and concise responses" --container fleet-alpha

# Real-time metrics
npx ultrademon metrics

# Save API key locally
npx ultrademon config set-key us_your_key_here
```

## Quick Start

```typescript
import { Ultrademon } from 'ultrademon';

const client = new Ultrademon({
  apiKey: process.env.ULTRADEMON_API_KEY, // e.g. ud_live_...
  // Optional: override default gateway baseUrl
  // baseUrl: 'https://ultrasearch-api.aaronvanoss.workers.dev'
});
```

---

## 1. UltraSearch Engine

UltraDemon offers three execution tiers:

- **Mode 1 (Instant Recall, <15ms)**: Direct SQLite FTS5 query with lightweight projection, bypassing snippet tokenizers and large content payloads.
- **Mode 2 (Standard Hybrid)**: BM25 ranking combined with PageRank quality signals and freshness recency scoring.
- **Mode 3 (Deep Research)**: Multi-pass expansion and comprehensive document synthesis.

### Instant Search (<15ms)

```typescript
const instant = await client.search.instant('Cloudflare Workers SQLite', 5);
console.log(`P50 Latency: ${instant.search_time_ms}ms`);
for (const item of instant.results) {
  console.log(`- ${item.title}: ${item.url}`);
}
```

### Hybrid Standard & Deep Research

```typescript
// Mode 2: Standard Hybrid
const standard = await client.search.standard('autonomous AI agents BM25');

// Mode 3: Deep Research
const deep = await client.search.deep('high-speed vectorless memory architectures');

// Full Options
const custom = await client.search.query({
  query: 'distributed SQLite edge',
  mode: 2,
  numResults: 15,
  useCache: true,
  country: 'US',
});
```

### Autonomous Streaming Crawler

```typescript
// Queue and crawl documentation
const crawlJob = await client.crawler.crawl({
  url: 'https://developers.cloudflare.com/workers',
  depth: 2,
  maxPages: 25,
});

// View crawler and index statistics
const stats = await client.crawler.stats();
console.log(`Total indexed pages: ${stats.index.total_documents}`);
```

---

## 2. UltraMemory Lab

Sovereign, sub-15ms long-term agent memory stored inside Cloudflare D1 SQLite with full FTS5 indexing. Partitioned by dynamic container namespaces (`container_tag`).

### Store Knowledge

```typescript
const memory = await client.memory.store({
  content: 'User prefers concise responses with code examples and zero boilerplate.',
  memoryType: 'preference',
  containerTag: 'user_agent_42',
  metadata: { priority: 'high', environment: 'production' },
});
console.log(`Stored memory ID: ${memory.memory_id}`);
```

### Recall Knowledge (<15ms BM25)

```typescript
const recall = await client.memory.query({
  query: 'user preferences code style',
  containerTag: 'user_agent_42',
  limit: 5,
});

for (const match of recall.memories) {
  console.log(`[${match.score}] ${match.content}`);
}
```

### Container Namespace Management

```typescript
// List memories in container
const list = await client.memory.list({
  containerTag: 'user_agent_42',
  limit: 50,
});

// Delete specific memory
await client.memory.delete(memory.memory_id);

// Purge entire container namespace
await client.memory.deleteContainer('user_agent_42');
```

---

## 3. UltraTelemetry & Autonomous Customer Profiles (vs PostHog)

Replaces centralized tracking clusters (PostHog/Mixpanel) with sub-5ms edge event ingestion at 330+ Anycast PoPs, unmasked GPU silicon fingerprinting, kinetic dwell telemetry, and autonomous customer profile clustering.

### Event Capture & Kinetic Dwell

```typescript
await client.telemetry.capture({
  eventName: 'editor_workbench_active',
  distinctId: 'usr_enterprise_99',
  properties: {
    feature: 'ultra_memory',
    plan: 'ultra',
  },
  kineticDwell: {
    activeDurationMs: 45000,
    idleDurationMs: 3200,
    scrollDepthPct: 85,
    primaryActivity: 'coding',
  },
  hardware: {
    cpuCores: 16,
    ramGb: 32,
    gpuRenderer: 'Apple M3 Pro',
    darkMode: true,
  },
});
```

### VIP Client & Specific IP Tracing

```typescript
// Add target to real-time watchlist
const vip = await client.telemetry.createVipTarget({
  targetType: 'ip',
  targetValue: '203.0.113.88',
  clientLabel: 'Acme Corp ($50k ARR)',
});

// Stream live micro-traces for watched targets
const traces = await client.telemetry.getVipTraces({ limit: 25 });
for (const trace of traces) {
  console.log(`[${trace.edge_pop}] VIP hit from ${trace.client_label}: ${trace.event_name}`);
}
```

### Autonomous Customer Profile (ICP Engine)

```typescript
// Generate weekly, monthly, or yearly dossier
const icp = await client.telemetry.getCustomerProfile({ period: 'monthly' });

if (icp.has_data) {
  console.log(`Persona: ${icp.persona_title}`);
  console.log(`Archetype: ${icp.persona_archetype}`);
  console.log(`Summary: ${icp.summary}`);
  console.log(`Hardware abilities:`, icp.ideal_customer_profile?.daily_abilities);
  console.log(`Circadian habits:`, icp.ideal_customer_profile?.daily_habits);
} else {
  console.log('Awaiting visitor telemetry to cluster power user profiles.');
}
```

---

## 4. Real-Time API Key Daily Calls & Usage Metrics

Track the exact number of requests made per day for each API key, separated across UltraSearch, UltraMemory, and UltraMetrics, alongside combined totals and rolling live event micro-streams.

```typescript
const metrics = await client.keys.getMetrics();

// 1. Combined calls today across all keys
console.log(`Combined calls today: ${metrics.combined_today.total}`);
console.log(`- UltraSearch calls: ${metrics.combined_today.search}`);
console.log(`- UltraMemory calls: ${metrics.combined_today.memory}`);
console.log(`- UltraMetrics calls: ${metrics.combined_today.metrics}`);

// 2. Per-API key granular metrics
for (const key of metrics.keys) {
  console.log(`\nKey: ${key.label} (${key.key_id}) [${key.key_type}]`);
  console.log(`  Combined today: ${key.today_total} / ${key.daily_limit}`);
  console.log(`  Search calls:   ${key.today_search}`);
  console.log(`  Memory calls:   ${key.today_memory}`);
  console.log(`  Metrics calls:  ${key.today_metrics}`);
  console.log(`  Quota used:     ${key.percent_used}%`);
}

// 3. Rolling live request stream
for (const ev of metrics.recent_live_events) {
  console.log(`[${ev.latency_ms}ms] ${ev.service.toUpperCase()} ${ev.method} ${ev.path} -> ${ev.status}`);
}
```

---

## 5. API Key Management & Quota Limits

```typescript
// Create new scoped or unified key
const newKey = await client.keys.create({
  label: 'Production Memory Worker',
  plan: 'pro',
  keyType: 'memory', // 'search' | 'memory' | 'telemetry' | 'unified'
});
console.log(`Generated Key: ${newKey.plain_key}`);

// List active keys
const keys = await client.keys.list();

// Check quota and remaining requests today
const quota = await client.usage();
console.log(`Requests today: ${quota.daily_requests_used} / ${quota.daily_requests_limit}`);
```

---

## Error Handling

All SDK errors inherit from `UltrademonError`:

```typescript
import {
  Ultrademon,
  AuthenticationError,
  RateLimitError,
  NotFoundError,
  ValidationError,
  UltrademonError,
} from 'ultrademon';

try {
  await client.search.query({ query: '' });
} catch (error) {
  if (error instanceof ValidationError) {
    console.error('Validation failure:', error.message);
  } else if (error instanceof AuthenticationError) {
    console.error('Invalid or revoked API key');
  } else if (error instanceof RateLimitError) {
    console.error('Daily quota exceeded. Upgrade tier in workspace.');
  } else if (error instanceof UltrademonError) {
    console.error(`Edge gateway error (${error.status}):`, error.message);
  }
}
```

---

## License

MIT License. Copyright (c) 2026 UltraDemon Engine.

