#!/usr/bin/env node

/**
 * UltraDemon Sovereign Edge CLI
 * Official command-line interface for UltraSearch, UltraMemory, and UltraTelemetry.
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { Ultrademon } = require('../dist/index.js');

const VERSION = '1.0.0';
const CONFIG_DIR = path.join(os.homedir(), '.ultrademon');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

function loadConfig() {
  try {
    if (fs.existsSync(CONFIG_FILE)) {
      return JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf8'));
    }
  } catch {}
  return {};
}

function saveConfig(cfg) {
  try {
    if (!fs.existsSync(CONFIG_DIR)) {
      fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
    fs.writeFileSync(CONFIG_FILE, JSON.stringify(cfg, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Failed to write configuration:', err.message);
    return false;
  }
}

function printHelp() {
  console.log(`
UltraDemon Sovereign Edge CLI (v${VERSION})
Engineered on Cloudflare Workers edge nodes with D1 SQLite FTS5.

Usage:
  ultrademon <command> [options]
  npx ultrademon <command> [options]

Commands:
  search <query>             Search indexed web documents (BM25 Edge)
  memory query <query>       Recall agent structured memory (sub-15ms)
  memory store <text>        Persist semantic text into agent memory
  crawl <url>                Dispatch edge crawler into D1 SQLite FTS5
  usage                      Check API key daily quota and call limits
  metrics                    Real-time per-service call telemetry
  status                     Verify edge cluster connectivity and ping
  config set-key <apiKey>    Store sovereign API key in ~/.ultrademon/config.json
  config get-key             Show currently saved API key
  help, --help, -h           Show this manual
  version, --version, -v     Show CLI version

Options:
  --key <apiKey>             Override API key (or via ULTRADEMON_API_KEY env)
  --url <baseUrl>            Override edge gateway URL (default: official edge)
  --mode <standard|quick|deep> Search precision mode (default: standard)
  --container <tag>          Container namespace for memory (default: default)
  --limit <number>           Maximum results to return
  --json                     Output raw JSON payload

Examples:
  ultrademon search "autonomous AI agent workflows" --limit 5
  ultrademon memory store "User prefers dark mode and concise code" --container fleet-alpha
  ultrademon memory query "user preferences" --container fleet-alpha
  ultrademon crawl "https://example.com" --limit 50
  ultrademon usage
  ultrademon config set-key us_live_your_key_here
`);
}

function parseArgs(args) {
  const flags = {
    _: [],
    json: false,
    limit: undefined,
    mode: undefined,
    container: undefined,
    category: undefined,
    key: undefined,
    url: undefined,
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '--json') {
      flags.json = true;
    } else if (arg === '--help' || arg === '-h') {
      flags.help = true;
    } else if (arg === '--version' || arg === '-v') {
      flags.version = true;
    } else if (arg === '--key' && i + 1 < args.length) {
      flags.key = args[++i];
    } else if (arg === '--url' && i + 1 < args.length) {
      flags.url = args[++i];
    } else if (arg === '--mode' && i + 1 < args.length) {
      flags.mode = args[++i];
    } else if (arg === '--container' && i + 1 < args.length) {
      flags.container = args[++i];
    } else if (arg === '--category' && i + 1 < args.length) {
      flags.category = args[++i];
    } else if (arg === '--limit' && i + 1 < args.length) {
      flags.limit = parseInt(args[++i], 10);
    } else if (arg.startsWith('--')) {
      const parts = arg.slice(2).split('=');
      if (parts.length === 2) {
        flags[parts[0]] = parts[1];
      }
    } else {
      flags._.push(arg);
    }
  }

  return flags;
}

async function main() {
  const rawArgs = process.argv.slice(2);
  const flags = parseArgs(rawArgs);

  if (flags.help || flags._[0] === 'help' || flags._.length === 0) {
    printHelp();
    process.exit(0);
  }

  if (flags.version || flags._[0] === 'version') {
    console.log(`ultrademon v${VERSION} (Cloudflare Workers + D1 SQLite FTS5)`);
    process.exit(0);
  }

  const config = loadConfig();
  const apiKey = flags.key || process.env.ULTRADEMON_API_KEY || config.apiKey;
  const baseUrl = flags.url || process.env.ULTRADEMON_BASE_URL || config.baseUrl;

  const command = flags._[0];

  // Config command
  if (command === 'config') {
    const sub = flags._[1];
    if (sub === 'set-key') {
      const val = flags._[2];
      if (!val) {
        console.error('Error: Please provide an API key. Example: ultrademon config set-key us_your_key');
        process.exit(1);
      }
      config.apiKey = val;
      if (saveConfig(config)) {
        console.log('Saved API key to ' + CONFIG_FILE);
      }
      process.exit(0);
    } else if (sub === 'get-key') {
      console.log('Saved API key: ' + (config.apiKey || 'None'));
      process.exit(0);
    } else {
      console.error('Unknown config subcommand. Use: ultrademon config set-key <key>');
      process.exit(1);
    }
  }

  // Client initialization
  const client = new Ultrademon({
    apiKey: apiKey || '',
    baseUrl: baseUrl,
  });

  try {
    switch (command) {
      case 'search': {
        const query = flags._.slice(1).join(' ');
        if (!query) {
          console.error('Error: Please provide a search query. Example: ultrademon search "edge latency"');
          process.exit(1);
        }

        const res = await client.search.query({
          query: query,
          mode: flags.mode || 'standard',
          limit: flags.limit || 10,
        });

        if (flags.json) {
          console.log(JSON.stringify(res, null, 2));
          return;
        }

        console.log(`\n[UltraSearch] Query: "${res.query}" (${res.results?.length || 0} results in ${res.took_ms || 0}ms)`);
        console.log('------------------------------------------------------------');
        if (!res.results || res.results.length === 0) {
          console.log('No matching documents found.');
        } else {
          res.results.forEach((r, idx) => {
            console.log(`[${idx + 1}] ${r.title || 'Untitled'}`);
            console.log(`    URL:   ${r.url}`);
            if (r.snippet) console.log(`    MATCH: ${r.snippet}`);
            if (r.score !== undefined) console.log(`    BM25:  ${r.score.toFixed(4)}`);
            console.log('');
          });
        }
        break;
      }

      case 'memory': {
        const sub = flags._[1];
        if (sub === 'store') {
          const content = flags._.slice(2).join(' ');
          if (!content) {
            console.error('Error: Please provide content to store. Example: ultrademon memory store "user preferences"');
            process.exit(1);
          }

          const res = await client.memory.store({
            content: content,
            container_tag: flags.container || 'default',
            category: flags.category || 'general',
          });

          if (flags.json) {
            console.log(JSON.stringify(res, null, 2));
            return;
          }

          console.log(`\n[UltraMemory Store] Status: ${res.status.toUpperCase()}`);
          console.log(`  ID:        ${res.id}`);
          console.log(`  Container: ${res.container_tag}`);
          console.log(`  Created:   ${res.created_at}`);
          console.log(`  Content:   ${res.content}\n`);
        } else if (sub === 'query') {
          const query = flags._.slice(2).join(' ');
          if (!query) {
            console.error('Error: Please provide a memory query. Example: ultrademon memory query "user preferences"');
            process.exit(1);
          }

          const res = await client.memory.query({
            query: query,
            container_tag: flags.container || 'default',
            limit: flags.limit || 10,
          });

          if (flags.json) {
            console.log(JSON.stringify(res, null, 2));
            return;
          }

          console.log(`\n[UltraMemory Recall] Query: "${res.query}" (${res.memories?.length || 0} recalled in ${res.took_ms || 0}ms)`);
          console.log(`  Container: ${res.container_tag}`);
          console.log('------------------------------------------------------------');
          if (!res.memories || res.memories.length === 0) {
            console.log('No memories recalled for this container.');
          } else {
            res.memories.forEach((m, idx) => {
              console.log(`[${idx + 1}] (${m.category || 'general'}) Score: ${m.score?.toFixed(4) || 'N/A'}`);
              console.log(`    ${m.content}`);
              console.log(`    ID: ${m.id} | Timestamp: ${m.created_at || 'recent'}`);
              console.log('');
            });
          }
        } else {
          console.error('Unknown memory command. Use: ultrademon memory store <text> OR ultrademon memory query <query>');
          process.exit(1);
        }
        break;
      }

      case 'crawl': {
        const targetUrl = flags._[1];
        if (!targetUrl) {
          console.error('Error: Please provide a URL to crawl. Example: ultrademon crawl "https://example.com"');
          process.exit(1);
        }

        console.log(`[Crawler] Dispatching edge crawl for: ${targetUrl}`);
        const res = await client.crawler.crawl({
          url: targetUrl,
          max_pages: flags.limit || 20,
        });

        if (flags.json) {
          console.log(JSON.stringify(res, null, 2));
          return;
        }

        console.log(`\n[Crawler Result] Status: ${res.status}`);
        console.log(`  Pages Crawled: ${res.pages_crawled ?? 'N/A'}`);
        console.log(`  D1 SQLite FTS5: Indexed successfully.\n`);
        break;
      }

      case 'usage': {
        const res = await client.usage();
        if (flags.json) {
          console.log(JSON.stringify(res, null, 2));
          return;
        }

        console.log('\n[UltraDemon Quota & Usage]');
        console.log('------------------------------------------------------------');
        console.log(`  Plan Tier:     ${(res.plan || 'free').toUpperCase()}`);
        console.log(`  Requests Today: ${res.requests_today}`);
        console.log(`  Daily Limit:   ${res.limit}`);
        console.log(`  Remaining:     ${res.remaining}`);
        console.log(`  Reset In:      ${Math.round((res.reset_in_seconds || 0) / 60)} minutes\n`);
        break;
      }

      case 'metrics': {
        const res = await client.keys.getUsageMetrics();
        if (flags.json) {
          console.log(JSON.stringify(res, null, 2));
          return;
        }

        console.log('\n[UltraDemon Real-Time Daily Call Telemetry]');
        console.log('------------------------------------------------------------');
        console.log(`  Combined Calls Today: ${res.combined_total}`);
        console.log(`  UltraSearch Calls:    ${res.combined_search}`);
        console.log(`  UltraMemory Calls:    ${res.combined_memory}`);
        console.log(`  UltraMetrics Calls:   ${res.combined_metrics}`);
        console.log(`  Crawler Calls:        ${res.combined_crawler}`);
        console.log(`  Active Keys Tracked:  ${res.active_keys_count}\n`);
        break;
      }

      case 'status': {
        const start = Date.now();
        const res = await client.usage();
        const latency = Date.now() - start;

        if (flags.json) {
          console.log(JSON.stringify({ status: 'connected', latency_ms: latency, usage: res }, null, 2));
          return;
        }

        console.log('\n[UltraDemon Edge Engine Status]');
        console.log('------------------------------------------------------------');
        console.log('  Cluster:      Cloudflare Workers Edge (330+ Anycast PoPs)');
        console.log('  Database:     Cloudflare D1 SQLite with FTS5 BM25');
        console.log(`  Recall Ping:  ${latency}ms`);
        console.log(`  Key Status:   Active (Plan: ${(res.plan || 'free').toUpperCase()})\n`);
        break;
      }

      default:
        console.error(`Unknown command "${command}". Run "ultrademon --help" to see all commands.`);
        process.exit(1);
    }
  } catch (err) {
    if (flags.json) {
      console.error(JSON.stringify({ error: err.name, message: err.message }, null, 2));
    } else {
      console.error(`\nError (${err.name}): ${err.message}`);
      if (err.name === 'AuthenticationError') {
        console.error('Provide a valid key with --key or run: ultrademon config set-key <apiKey>\n');
      }
    }
    process.exit(1);
  }
}

main();

