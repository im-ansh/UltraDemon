const test = require('node:test');
const assert = require('node:assert');
const { Ultrademon, UltrademonError, ValidationError } = require('../dist/index.js');

test('Ultrademon SDK instantiation with default options', () => {
  const client = new Ultrademon({ apiKey: 'ud_live_test_123' });
  assert.ok(client);
  assert.ok(client.search);
  assert.ok(client.memory);
  assert.ok(client.telemetry);
  assert.ok(client.crawler);
  assert.ok(client.keys);
});

test('Search service validation', async () => {
  const client = new Ultrademon({ apiKey: 'ud_live_test_123' });
  await assert.rejects(
    async () => client.search.query({ query: '' }),
    (err) => {
      assert.ok(err instanceof ValidationError);
      assert.strictEqual(err.code, 'VALIDATION_ERROR');
      return true;
    }
  );
});

test('Memory service validation', async () => {
  const client = new Ultrademon({ apiKey: 'ud_live_test_123' });
  await assert.rejects(
    async () => client.memory.store({ content: '' }),
    (err) => err instanceof ValidationError
  );
  await assert.rejects(
    async () => client.memory.query({ query: '' }),
    (err) => err instanceof ValidationError
  );
});

test('Telemetry service validation', async () => {
  const client = new Ultrademon({ apiKey: 'ud_live_test_123' });
  await assert.rejects(
    async () => client.telemetry.capture({ eventName: '', distinctId: 'usr_1' }),
    (err) => err instanceof ValidationError
  );
  await assert.rejects(
    async () => client.telemetry.capture({ eventName: 'pageview', distinctId: '' }),
    (err) => err instanceof ValidationError
  );
});

test('Mocked API requests pass headers and parse JSON payload', async () => {
  let capturedUrl = '';
  let capturedHeaders = null;
  let capturedBody = null;

  const mockFetch = async (url, init) => {
    capturedUrl = url;
    capturedHeaders = init.headers;
    capturedBody = JSON.parse(init.body || '{}');

    return {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        query: capturedBody.query,
        mode: capturedBody.mode,
        total_results: 1,
        search_time_ms: 11,
        engine: 'UltraSearch D1 SQLite FTS5',
        results: [{ id: '1', title: 'Test Title', url: 'https://example.com' }],
      }),
    };
  };

  const client = new Ultrademon({
    apiKey: 'ud_live_mock_key',
    baseUrl: 'https://mock.ultrademon.test',
    fetch: mockFetch,
  });

  const res = await client.search.instant('Cloudflare Workers');
  assert.strictEqual(capturedUrl, 'https://mock.ultrademon.test/v1/search');
  assert.strictEqual(capturedHeaders.get('X-API-Key'), 'ud_live_mock_key');
  assert.strictEqual(capturedBody.query, 'Cloudflare Workers');
  assert.strictEqual(capturedBody.mode, 1);
  assert.strictEqual(res.search_time_ms, 11);
  assert.strictEqual(res.results.length, 1);
});

test('Memory store and recall with mock fetch', async () => {
  const mockFetch = async (url, init) => {
    const body = JSON.parse(init.body || '{}');
    if (url.endsWith('/v1/memory')) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          status: 'success',
          memory: {
            memory_id: 'mem_123',
            content: body.content,
            container_tag: body.container_tag,
            memory_type: body.memory_type,
            created_at: 1730000000,
          },
        }),
      };
    }
    if (url.endsWith('/v1/memory/query')) {
      return {
        ok: true,
        status: 200,
        headers: new Headers({ 'content-type': 'application/json' }),
        json: async () => ({
          query: body.query,
          container_tag: body.container_tag,
          total_matches: 1,
          latency_ms: 8,
          memories: [
            {
              memory_id: 'mem_123',
              content: 'User preferences test',
              score: -1.2,
              created_at: 1730000000,
            },
          ],
        }),
      };
    }
    throw new Error('Unhandled mock url: ' + url);
  };

  const client = new Ultrademon({
    apiKey: 'ud_live_test',
    baseUrl: 'https://mock.ultrademon.test',
    fetch: mockFetch,
  });

  const stored = await client.memory.store({
    content: 'User preferences test',
    containerTag: 'agent_prod',
  });
  assert.strictEqual(stored.memory_id, 'mem_123');
  assert.strictEqual(stored.container_tag, 'agent_prod');

  const recalled = await client.memory.query({
    query: 'preferences',
    containerTag: 'agent_prod',
  });
  assert.strictEqual(recalled.total_matches, 1);
  assert.strictEqual(recalled.latency_ms, 8);
});

test('Real-time key metrics endpoint', async () => {
  const mockFetch = async (url) => {
    assert.ok(url.endsWith('/v1/keys/metrics'));
    return {
      ok: true,
      status: 200,
      headers: new Headers({ 'content-type': 'application/json' }),
      json: async () => ({
        date: '2026-11-07',
        timestamp: Date.now(),
        combined_today: {
          total: 42,
          search: 20,
          memory: 15,
          metrics: 7,
          crawler: 0,
        },
        combined_history_7d: [],
        keys: [
          {
            key_id: 'key_prod_1',
            label: 'Production Bot',
            plan: 'pro',
            today_total: 42,
            today_search: 20,
            today_memory: 15,
            today_metrics: 7,
            today_crawler: 0,
            daily_limit: 10000,
            percent_used: 1,
          },
        ],
        recent_live_events: [],
      }),
    };
  };

  const client = new Ultrademon({
    apiKey: 'ud_live_test',
    baseUrl: 'https://mock.ultrademon.test',
    fetch: mockFetch,
  });

  const metrics = await client.keys.getMetrics();
  assert.strictEqual(metrics.combined_today.total, 42);
  assert.strictEqual(metrics.combined_today.search, 20);
  assert.strictEqual(metrics.combined_today.memory, 15);
  assert.strictEqual(metrics.combined_today.metrics, 7);
  assert.strictEqual(metrics.keys.length, 1);
  assert.strictEqual(metrics.keys[0].today_total, 42);
});

