// UltraSearch — OpenAPI 3.1 & Agent Tools Specification
// Allows any AI framework, GPT Action, LangChain, or agent to auto-discover and consume the API.

import { Hono } from 'hono';
import type { Env } from '../types';

export const openapiRouter = new Hono<{ Bindings: Env }>();

export function getOpenAPISpec(origin: string) {
  return {
    openapi: '3.1.0',
    info: {
      title: 'UltraSearch Sovereign Web Search API',
      version: '1.0.0',
      description: 'Ultra-fast, sub-50ms web search API for AI agents. 100% autonomous edge web crawler and BM25 full-text index on Cloudflare D1 with zero 3rd-party dependencies.',
      contact: {
        name: 'UltraSearch Support',
        url: 'https://github.com/im-ansh/UltraDemon',
      },
    },
    servers: [
      {
        url: origin,
        description: 'Cloudflare Edge Global Server (Anycast)',
      },
    ],
    paths: {
      '/v1/search': {
        post: {
          summary: 'Search the Autonomous Web Index',
          description: 'Executes BM25 keyword matching with PageRank boosting across the D1 edge index. Supports Mode 1 (Instant <50ms), Mode 2 (Standard), and Mode 3 (Deep Research).',
          operationId: 'searchWeb',
          security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['query'],
                  properties: {
                    query: {
                      type: 'string',
                      description: 'Search terms or natural language question',
                      example: 'What is Python?',
                    },
                    num_results: {
                      type: 'integer',
                      description: 'Number of results to return (1-50)',
                      default: 10,
                      minimum: 1,
                      maximum: 50,
                    },
                    mode: {
                      type: 'integer',
                      description: '1 = Instant (<50ms), 2 = Standard, 3 = Deep Research',
                      enum: [1, 2, 3],
                      default: 1,
                    },
                    use_cache: {
                      type: 'boolean',
                      description: 'Whether to use Cloudflare KV cache for repeated queries',
                      default: true,
                    },
                  },
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful search response',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      query: { type: 'string' },
                      results: {
                        type: 'array',
                        items: {
                          type: 'object',
                          properties: {
                            title: { type: 'string' },
                            url: { type: 'string' },
                            snippet: { type: 'string' },
                            source: { type: 'string' },
                            score: { type: 'number' },
                            published_date: { type: 'string' },
                            full_content: { type: 'string' },
                          },
                        },
                      },
                      total_results: { type: 'integer' },
                      search_time_ms: { type: 'number' },
                      cached: { type: 'boolean' },
                      mode: { type: 'integer' },
                    },
                  },
                },
              },
            },
            '401': { description: 'Missing or invalid API key' },
            '429': { description: 'Daily quota exceeded' },
          },
        },
        get: {
          summary: 'Search via Query Parameters',
          description: 'GET alias for /v1/search?q=...&n=...&mode=...',
          operationId: 'searchWebGet',
          security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
          parameters: [
            { name: 'q', in: 'query', required: true, schema: { type: 'string' } },
            { name: 'n', in: 'query', schema: { type: 'integer', default: 10 } },
            { name: 'mode', in: 'query', schema: { type: 'integer', enum: [1, 2, 3] } },
          ],
          responses: {
            '200': { description: 'Successful search response' },
          },
        },
      },
      '/v1/crawl': {
        post: {
          summary: 'Trigger Web Crawl & Ingestion',
          description: 'Fetches, parses, extracts text using Cloudflare HTMLRewriter, and indexes any URL into D1 FTS5 immediately.',
          operationId: 'crawlUrl',
          security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    url: { type: 'string', format: 'uri', example: 'https://docs.python.org/3/' },
                    depth: { type: 'integer', minimum: 0, maximum: 2, default: 0 },
                  },
                },
              },
            },
          },
          responses: {
            '200': { description: 'Crawl result with indexed document details' },
          },
        },
      },
      '/v1/keys': {
        post: {
          summary: 'Generate New API Key',
          description: 'Creates a new API key with the requested plan (free, pro, ultra, enterprise).',
          operationId: 'createKey',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['user_id'],
                  properties: {
                    user_id: { type: 'string', example: 'agent_user_1' },
                    plan: { type: 'string', enum: ['free', 'pro', 'ultra', 'enterprise'], default: 'free' },
                    label: { type: 'string', example: 'Claude Assistant Key' },
                  },
                },
              },
            },
          },
          responses: {
            '201': { description: 'API Key created with plain_key shown once' },
          },
        },
      },
      '/v1/usage': {
        get: {
          summary: 'Check API Quota & Usage',
          operationId: 'getUsage',
          security: [{ ApiKeyAuth: [] }, { BearerAuth: [] }],
          responses: {
            '200': { description: 'Current quota statistics' },
          },
        },
      },
      '/v1/crawler/stats': {
        get: {
          summary: 'Get Index & Crawler Queue Health',
          operationId: 'getCrawlerStats',
          responses: {
            '200': { description: 'Index document counts, word counts, and queue statistics' },
          },
        },
      },
    },
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'Pass your UltraSearch API key (e.g. us_...)',
        },
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          description: 'Pass your UltraSearch API key in Authorization header',
        },
      },
    },
  };
}

// ── GET /openapi.json ────────────────────────────────────────────────────────
openapiRouter.get('/openapi.json', (c) => {
  const origin = new URL(c.req.url).origin;
  return c.json(getOpenAPISpec(origin));
});

// ── GET /v1/tools — OpenAI / Anthropic format tool definition ─────────────────
openapiRouter.get('/v1/tools', (c) => {
  const origin = new URL(c.req.url).origin;
  return c.json({
    tools: [
      {
        type: 'function',
        function: {
          name: 'ultrasearch_web',
          description: 'Search the sovereign web index for real-time information, documentation, news, or technical questions with sub-50ms latency.',
          parameters: {
            type: 'object',
            properties: {
              query: {
                type: 'string',
                description: 'The search query or factual topic',
              },
              num_results: {
                type: 'integer',
                description: 'Number of results to return (default 5)',
                default: 5,
              },
              mode: {
                type: 'integer',
                description: '1 for Instant (<50ms), 2 for Standard, 3 for Deep Research',
                enum: [1, 2, 3],
                default: 1,
              },
            },
            required: ['query'],
          },
        },
      },
      {
        type: 'function',
        function: {
          name: 'ultrasearch_crawl',
          description: 'Direct the web crawler to fetch and index any webpage or documentation site into the search index in real time.',
          parameters: {
            type: 'object',
            properties: {
              url: {
                type: 'string',
                description: 'URL of the webpage to crawl and index',
              },
              depth: {
                type: 'integer',
                description: 'Crawl depth for outgoing links (0 for single page, 1 for page + links)',
                default: 0,
              },
            },
            required: ['url'],
          },
        },
      },
    ],
    endpoints: {
      search: `${origin}/v1/search`,
      crawl:  `${origin}/v1/crawl`,
      mcp:    `${origin}/mcp`,
    },
  });
});

