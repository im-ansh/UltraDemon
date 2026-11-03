// UltraDemon — Dedicated Developer Workspace Application UI (/app & /dashboard)
// Pure White (#ffffff) & Monochrome. Zero gradients, zero purple/pink.
// Typography: Michelangelus Bold Italic (WOFF2 Data URI), Geist Sans, Geist Mono.
// Strict Design Rule: NO EMOJIS ANYWHERE. Minimalist grey SVGs only.

import { MICHELANGELUS_BOLD_ITALIC_WOFF2_B64, MICHELANGELUS_REGULAR_WOFF2_B64 } from './font-data';

export function renderAppDashboard(origin: string, supabaseUrl: string, supabaseAnonKey: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Developer Workspace — UltraDemon Engine</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2309090b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M13 2L3 14h9l-1 8 10-12h-9l1-8z'/></svg>">
  
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Geist"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            serif: ['"Michelangelus"', 'Georgia', 'serif'],
            mono: ['"Geist Mono"', 'monospace'],
            num: ['"Geist Mono"', 'monospace'],
          }
        }
      }
    }
  </script>

  <style>
    @font-face {
      font-family: 'Michelangelus';
      src: url('data:font/woff2;base64,${MICHELANGELUS_BOLD_ITALIC_WOFF2_B64}') format('woff2');
      font-weight: 700;
      font-style: italic;
    }
    @font-face {
      font-family: 'Michelangelus';
      src: url('data:font/woff2;base64,${MICHELANGELUS_REGULAR_WOFF2_B64}') format('woff2');
      font-weight: 400;
      font-style: normal;
    }
    body {
      font-family: 'Geist', sans-serif;
      background-color: #ffffff;
      color: #09090b;
    }
    .font-serif {
      font-family: 'Michelangelus', Georgia, serif;
    }
    .font-num {
      font-family: 'Geist Mono', monospace;
      font-variant-numeric: tabular-nums;
    }
    .card-clean {
      background: #ffffff;
      border: 1px solid #e4e4e7;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .card-clean:hover {
      border-color: #a1a1aa;
    }
    .code-scroll::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }
    .code-scroll::-webkit-scrollbar-thumb {
      background: #d4d4d8;
      border-radius: 4px;
    }
  </style>
</head>
<body class="min-h-screen bg-white text-neutral-950 flex flex-col lg:flex-row antialiased selection:bg-black selection:text-white">

  <!-- Left Sidebar Navigation -->
  <aside class="w-full lg:w-64 lg:min-h-screen lg:fixed lg:top-0 lg:left-0 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white z-40 flex flex-col justify-between p-5">
    <div class="space-y-6">
      <!-- Brand Logo -->
      <a href="/" class="flex items-center gap-2.5 group">
        <div class="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:bg-black group-hover:text-white group-hover:border-black transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span class="font-extrabold text-base tracking-tight text-neutral-950 flex items-center gap-1">
          ultrademon
          <span class="font-serif text-xs font-bold italic text-neutral-500">workspace</span>
        </span>
      </a>

      <!-- User Profile & Plan Badge -->
      <div class="p-3 bg-neutral-50 border border-neutral-200 rounded-xl space-y-1.5">
        <div class="flex items-center justify-between">
          <div class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold">Account</div>
          <span id="userPlanBadge" class="px-2 py-0.5 rounded text-[10px] font-bold uppercase font-num bg-neutral-200 text-neutral-800">
            Free
          </span>
        </div>
        <div id="userEmailDisplay" class="font-num text-xs font-semibold text-neutral-900 truncate">
          Loading...
        </div>
      </div>

      <!-- App Navigation Links -->
      <nav class="flex flex-col space-y-1 text-xs font-medium text-neutral-600">
        <button onclick="setAppView('overview')" id="nav-overview" class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-black text-white cursor-pointer transition text-left">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          <span>Overview</span>
        </button>

        <button onclick="setAppView('keys')" id="nav-keys" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left">
          <div class="flex items-center gap-2.5">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1-1-1.5 1.5L7 8l-1.5 1.5L4 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2h2v2h2l4-4 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 2-2z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
            <span>API Keys</span>
          </div>
          <span id="keysCountBadge" class="font-num text-[10px] text-neutral-400">0</span>
        </button>

        <button onclick="setAppView('memory')" id="nav-memory" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left">
          <div class="flex items-center gap-2.5">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/></svg>
            <span>UltraMemory</span>
          </div>
          <span class="font-num text-[10px] bg-neutral-100 text-neutral-900 border border-neutral-200 px-1.5 rounded font-bold">&lt;15ms</span>
        </button>

        <button onclick="setAppView('search')" id="nav-search" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left">
          <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span>UltraSearch Studio</span>
        </button>

        <button onclick="setAppView('crawler')" id="nav-crawler" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left">
          <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          <span>Web Crawler</span>
        </button>

        <button onclick="setAppView('membership')" id="nav-membership" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left">
          <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span>Memberships &amp; Quotas</span>
        </button>

        <button onclick="setAppView('integrations')" id="nav-integrations" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left">
          <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
          <span>Integrations &amp; MCP</span>
        </button>
      </nav>
    </div>

    <!-- Bottom Actions -->
    <div class="pt-6 border-t border-neutral-200 space-y-2">
      <a href="/" class="w-full py-1.5 px-3 text-xs text-neutral-600 hover:text-black hover:bg-neutral-100 rounded-lg transition flex items-center gap-2">
        <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7"/></svg>
        <span>Back to Landing Page</span>
      </a>
      <button onclick="handleAppSignOut()" class="w-full py-1.5 px-3 text-xs text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2 cursor-pointer">
        <svg class="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>
        <span>Sign Out</span>
      </button>
    </div>
  </aside>

  <!-- Main Content Workspace Area -->
  <main class="flex-1 lg:ml-64 p-6 sm:p-10 lg:p-12 max-w-5xl">
    
    <!-- Top Bar -->
    <header class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-neutral-200">
      <div>
        <h1 id="viewHeaderTitle" class="text-2xl font-extrabold text-neutral-950 tracking-tight flex items-center gap-2">
          Workspace Overview
        </h1>
        <p id="viewHeaderDesc" class="text-xs text-neutral-500 mt-0.5">
          Live edge telemetry, database metrics, and active sovereign API keys.
        </p>
      </div>

      <!-- Quick Active Key Pill -->
      <div class="flex items-center gap-2 bg-neutral-50 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs">
        <span class="text-[10px] text-neutral-400 uppercase font-bold">Active Key:</span>
        <span id="topActiveKeyLabel" class="font-mono text-neutral-900 font-semibold truncate max-w-[120px]">None</span>
        <button onclick="copyActiveKey()" id="topCopyBtn" class="text-neutral-500 hover:text-black cursor-pointer hidden">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
      </div>
    </header>

    <!-- SECTION 1: OVERVIEW -->
    <section id="view-overview" class="space-y-6">
      <!-- 4 Top Metric Cards (Card Design Skill) -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Daily Requests -->
        <div class="group relative bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300 transition-all duration-200 overflow-hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">Daily Requests</span>
            <div class="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold font-num text-neutral-950 tracking-tight" id="metricUsed">0</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Quota Limit</span>
            <span class="font-bold text-neutral-900" id="metricLimit">100</span>
          </div>
        </div>

        <!-- Active Keys -->
        <div class="group relative bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300 transition-all duration-200 overflow-hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">Active Keys</span>
            <div class="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1-1-1.5 1.5L7 8l-1.5 1.5L4 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2h2v2h2l4-4 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 2-2z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold font-num text-neutral-950 tracking-tight" id="metricKeys">0</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Edge Bound</span>
            <span class="font-bold text-neutral-900">D1 SQLite</span>
          </div>
        </div>

        <!-- Stored Memories -->
        <div class="group relative bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300 transition-all duration-200 overflow-hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">Stored Memories</span>
            <div class="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold font-num text-neutral-950 tracking-tight" id="metricMemories">0</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Recall Latency</span>
            <span class="font-bold text-emerald-600">&lt;15ms</span>
          </div>
        </div>

        <!-- Indexed Pages -->
        <div class="group relative bg-white rounded-2xl border border-neutral-200 p-5 flex flex-col justify-between hover:-translate-y-1 hover:shadow-lg hover:border-neutral-300 transition-all duration-200 overflow-hidden">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">Indexed Pages</span>
            <div class="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
            </div>
          </div>
          <div class="text-3xl font-extrabold font-num text-neutral-950 tracking-tight" id="metricIndexed">369</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Algorithm</span>
            <span class="font-bold text-neutral-900">BM25 Edge</span>
          </div>
        </div>
      </div>

      <!-- Quick Start Snippet Card -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-neutral-950">Quick Start: Sovereign cURL Test</h2>
          <span class="text-[10px] bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded font-num text-neutral-700">Sub-15ms Recall</span>
        </div>
        <div class="relative">
          <pre class="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll" id="overviewCodeSnippet"># Query sovereign agent memory
curl -X POST "${origin}/v1/memory/query" \\
  -H "X-API-Key: us_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"query": "user preferences", "container_tag": "default"}'</pre>
          <button onclick="copyToClipboard(document.getElementById('overviewCodeSnippet').innerText)" class="absolute top-3 right-3 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
        </div>
      </div>
    </section>

    <!-- SECTION 2: API KEYS STUDIO -->
    <section id="view-keys" class="space-y-6 hidden">
      <!-- Create Key Form Card -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <h2 class="text-sm font-bold text-neutral-950">Generate New API Key</h2>
        <form onsubmit="handleAppCreateKey(event)" class="grid grid-cols-1 sm:grid-cols-4 gap-3">
          <div>
            <label class="block text-[11px] font-medium text-neutral-600 mb-1">Plan Tier</label>
            <select id="appKeyPlan" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-black font-num">
              <option value="free">Free (100 req/day)</option>
              <option value="pro">Pro (10,000 req/day)</option>
              <option value="ultra">Ultra (100,000 req/day)</option>
              <option value="enterprise">Enterprise (Unlimited)</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-neutral-600 mb-1">API Function / Scope</label>
            <select id="appKeyType" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-black font-num">
              <option value="memory" selected>UltraMemory API (um_*)</option>
              <option value="unified">Unified API (Search + Memory)</option>
              <option value="search">UltraSearch API (Search Only)</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-neutral-600 mb-1">Key Label</label>
            <input type="text" id="appKeyLabel" placeholder="e.g. Agent Memory Key" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-black" />
          </div>
          <div class="flex items-end">
            <button type="submit" id="btnCreateKeyApp" class="w-full py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
              <span>Create Key</span>
              <span id="spinnerCreateKeyApp" class="hidden">
                <svg class="w-3.5 h-3.5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
              </span>
            </button>
          </div>
        </form>

        <!-- Fresh Key Alert -->
        <div id="newKeyAlertApp" class="hidden p-4 rounded-xl bg-neutral-50 border border-neutral-300 space-y-1">
          <div class="flex items-center justify-between">
            <span class="text-xs font-bold text-neutral-950">API Key Created:</span>
            <span class="text-[10px] text-neutral-500 font-num">Save now — shown ONCE</span>
          </div>
          <div class="flex items-center justify-between bg-white p-2.5 rounded-lg border border-neutral-200 font-mono text-xs text-neutral-950">
            <span id="newKeyDisplayApp" class="font-bold select-all"></span>
            <button onclick="copyToClipboard(document.getElementById('newKeyDisplayApp').innerText)" class="px-2 py-1 bg-black text-white text-[10px] rounded hover:bg-neutral-800 cursor-pointer">Copy</button>
          </div>
        </div>
      </div>

      <!-- Keys Table Card -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <h2 class="text-sm font-bold text-neutral-950">Active API Keys</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b border-neutral-200 text-neutral-500 font-num">
                <th class="pb-2 font-medium">API Key / ID</th>
                <th class="pb-2 font-medium">Scope</th>
                <th class="pb-2 font-medium">Plan</th>
                <th class="pb-2 font-medium">Label</th>
                <th class="pb-2 font-medium">Created</th>
                <th class="pb-2 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody id="appKeysTableBody" class="divide-y divide-neutral-100 font-num">
              <tr><td colspan="6" class="py-4 text-center text-neutral-400">Loading keys...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SECTION 3: ULTRAMEMORY LAB & AGENT API STUDIO -->
    <section id="view-memory" class="space-y-6 hidden">
      <!-- Memory API Endpoints Quick Reference Card -->
      <div class="card-clean p-6 rounded-2xl space-y-4 bg-neutral-50/50">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-200 pb-3">
          <div>
            <span class="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Autonomous Agent Long-Term Memory</span>
            <h2 class="text-sm font-extrabold text-neutral-950 mt-0.5">UltraMemory API Reference</h2>
          </div>
          <div class="flex items-center gap-2">
            <span class="text-[10px] font-num bg-neutral-200 text-neutral-800 px-2 py-0.5 rounded font-bold">&lt;15ms BM25 Edge</span>
            <span class="text-[10px] font-num bg-neutral-900 text-white px-2 py-0.5 rounded font-bold">330+ Cities</span>
          </div>
        </div>

        <!-- Endpoints Grid -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div class="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
            <div class="flex items-center gap-1.5 font-bold font-mono text-[11px] text-neutral-900">
              <span class="px-1.5 py-0.2 rounded bg-neutral-900 text-white text-[9px]">POST</span>
              <span>/v1/memory</span>
            </div>
            <p class="text-[11px] text-neutral-600">Store memory, message turns, or batch array into D1 FTS5.</p>
          </div>
          <div class="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
            <div class="flex items-center gap-1.5 font-bold font-mono text-[11px] text-neutral-900">
              <span class="px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-900 text-[9px]">GET</span>
              <span>/v1/memory/recall?q=...</span>
            </div>
            <p class="text-[11px] text-neutral-600">Instant BM25 recall with ranked items and LLM prompt context.</p>
          </div>
          <div class="p-3 bg-white rounded-xl border border-neutral-200 space-y-1">
            <div class="flex items-center gap-1.5 font-bold font-mono text-[11px] text-neutral-900">
              <span class="px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-900 text-[9px]">GET</span>
              <span>/v1/memory/context?q=...</span>
            </div>
            <p class="text-[11px] text-neutral-600">Direct agent prompt context block for zero-overhead LLM injection.</p>
          </div>
        </div>

        <!-- Code Snippet Box -->
        <div class="relative">
          <div class="flex items-center justify-between text-[11px] text-neutral-400 font-num mb-1 px-1">
            <span>Agent Store &amp; Recall One-Liners (cURL / Python / Node)</span>
            <button onclick="copyToClipboard(document.getElementById('memQuickSnippet').innerText)" class="hover:text-black cursor-pointer underline text-[10px]">Copy</button>
          </div>
          <pre id="memQuickSnippet" class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-[11px] text-neutral-100 overflow-x-auto code-scroll"># 1. Store memory from agent
curl -X POST "${origin}/v1/memory" \\
  -H "X-API-Key: um_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"content": "User prefers Michelangelus font and monochrome UI", "container_tag": "agent_prod"}'

# 2. Recall memory in &lt;15ms
curl "${origin}/v1/memory/recall?q=user+preferences&container_tag=agent_prod" \\
  -H "X-API-Key: um_your_key_here"</pre>
        </div>
      </div>

      <!-- Store Memory Form -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-neutral-950">Store Agent Memory</h2>
          <span class="text-[10px] bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded font-num text-neutral-700">D1 FTS5 Auto-Sync</span>
        </div>
        <form onsubmit="handleAppStoreMemory(event)" class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-[11px] font-medium text-neutral-600 mb-1">Memory Type</label>
              <select id="appMemType" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-num">
                <option value="fact">fact (Direct knowledge item)</option>
                <option value="preference">preference (User / agent setting)</option>
                <option value="document">document (Structured note or article)</option>
                <option value="conversation">conversation (Dialogue turn)</option>
                <option value="file">file (Code or raw asset)</option>
              </select>
            </div>
            <div>
              <label class="block text-[11px] font-medium text-neutral-600 mb-1">Container Namespace (Tag)</label>
              <input type="text" id="appMemContainer" value="default" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-num" />
            </div>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-neutral-600 mb-1">Memory Content</label>
            <textarea id="appMemContent" rows="3" placeholder="Enter text to store in long-term memory..." required class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:bg-white focus:border-black"></textarea>
          </div>
          <button type="submit" id="btnStoreMemApp" class="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer">
            <span>Store into Memory</span>
            <span id="spinnerStoreMemApp" class="hidden">
              <svg class="w-3.5 h-3.5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
            </span>
          </button>
        </form>
        <div id="alertStoreMemApp" class="hidden p-3 rounded-xl text-xs font-num"></div>
      </div>

      <!-- Query Memory Tester -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-neutral-950">Recall Memories (BM25 Match)</h2>
          <span id="appRecallTimer" class="hidden font-num text-[10px] bg-neutral-100 border border-neutral-300 text-neutral-900 px-2 py-0.5 rounded font-bold">0ms</span>
        </div>
        <form onsubmit="handleAppQueryMemory(event)" class="flex gap-2">
          <input type="text" id="appMemQuery" placeholder="Query memories..." required class="flex-1 px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs" />
          <button type="submit" class="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl cursor-pointer">Recall</button>
        </form>
        <div id="appMemResults" class="space-y-2 pt-2">
          <div class="text-center py-4 text-neutral-400 text-xs">Run a query to recall memories.</div>
        </div>
      </div>

      <!-- Memories Browser Table -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <h2 class="text-sm font-bold text-neutral-950">Stored Memories Explorer</h2>
        <div class="overflow-x-auto">
          <table class="w-full text-xs text-left">
            <thead>
              <tr class="border-b border-neutral-200 text-neutral-500 font-num">
                <th class="pb-2 font-medium">Memory ID</th>
                <th class="pb-2 font-medium">Container</th>
                <th class="pb-2 font-medium">Type</th>
                <th class="pb-2 font-medium">Content</th>
                <th class="pb-2 font-medium text-right">Delete</th>
              </tr>
            </thead>
            <tbody id="appMemoriesTableBody" class="divide-y divide-neutral-100 font-num">
              <tr><td colspan="5" class="py-4 text-center text-neutral-400">Loading stored memories...</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SECTION 4: ULTRASEARCH STUDIO -->
    <section id="view-search" class="space-y-6 hidden">
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <h2 class="text-sm font-bold text-neutral-950">Test Sovereign Web Index</h2>
        <form onsubmit="handleAppSearch(event)" class="space-y-3">
          <div class="flex gap-2">
            <input type="text" id="appSearchQuery" value="What is Python?" placeholder="Search index..." required class="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs" />
            <button type="submit" class="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl cursor-pointer">Search</button>
          </div>
          <div class="flex items-center gap-3 text-xs text-neutral-600 font-num">
            <span>Mode:</span>
            <label><input type="radio" name="appSearchMode" value="1" checked /> Mode 1 (Instant &lt;50ms)</label>
            <label><input type="radio" name="appSearchMode" value="2" /> Mode 2 (Standard)</label>
            <label><input type="radio" name="appSearchMode" value="3" /> Mode 3 (Deep Research)</label>
          </div>
        </form>
        <div id="appSearchResults" class="space-y-3 pt-4 border-t border-neutral-100">
          <div class="text-center py-4 text-neutral-400 text-xs">Execute a search to view BM25 ranked passages.</div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: WEB CRAWLER -->
    <section id="view-crawler" class="space-y-6 hidden">
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <h2 class="text-sm font-bold text-neutral-950">Ingest URL into Sovereign Index</h2>
        <form onsubmit="handleAppCrawl(event)" class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-medium text-neutral-600 mb-1">Target URL</label>
              <input type="url" id="appCrawlUrl" placeholder="https://docs.python.org" required class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono" />
            </div>
            <div>
              <label class="block text-[11px] font-medium text-neutral-600 mb-1">Depth</label>
              <select id="appCrawlDepth" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-num">
                <option value="0">Depth 0 (Exact URL only)</option>
                <option value="1">Depth 1 (URL + outgoing links)</option>
                <option value="2">Depth 2 (Deep recursive crawl)</option>
              </select>
            </div>
          </div>
          <button type="submit" id="btnCrawlApp" class="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl cursor-pointer">
            Start Edge Crawl &amp; Index
          </button>
        </form>
        <div id="appCrawlResult" class="hidden p-4 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-xs"></div>
      </div>
    </section>

    <!-- SECTION 6: MEMBERSHIPS & QUOTAS -->
    <section id="view-membership" class="space-y-6 hidden">
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <h2 class="text-sm font-bold text-neutral-950">Manage Membership Tier</h2>
        <p class="text-xs text-neutral-600">Select a plan to immediately expand your daily D1 execution quotas across all your API keys.</p>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 pt-5 items-stretch">
          <!-- Free -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300 transition-all duration-200" id="tierCardFree">
            <div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">DEVELOPER HOBBY</span>
              <h3 class="text-base font-semibold text-neutral-950">Free Tier</h3>
              <div class="text-3xl font-extrabold font-num text-neutral-950 my-3">$0<span class="text-xs font-sans text-neutral-400">/mo</span></div>
              <ul class="text-xs text-neutral-600 space-y-2 mb-6 font-num">
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>100 requests / day</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>UltraMemory &lt;15ms recall</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>KV Hot Cache</span></li>
              </ul>
            </div>
            <button onclick="upgradeTier('free')" class="w-full py-2.5 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 transition cursor-pointer">Select Free</button>
          </div>

          <!-- Pro -->
          <div class="group relative bg-white rounded-2xl border-2 border-neutral-950 p-6 flex flex-col justify-between shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-200 ring-4 ring-neutral-950/5" id="tierCardPro">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1 text-[10px] font-bold bg-neutral-950 text-white rounded-full font-num uppercase tracking-wider shadow-lg whitespace-nowrap border border-neutral-800">POPULAR</div>
            <div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-900 uppercase tracking-wider mb-2">PRODUCTION FLEET</span>
              <h3 class="text-base font-semibold text-neutral-950">Pro Tier</h3>
              <div class="text-3xl font-extrabold font-num text-neutral-950 my-3">$29<span class="text-xs font-sans text-neutral-400">/mo</span></div>
              <ul class="text-xs text-neutral-700 space-y-2 mb-6 font-num">
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span><strong class="font-bold">10,000</strong> requests / day</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>UltraMemory File Ingestion</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Full Crawler Access</span></li>
              </ul>
            </div>
            <button onclick="upgradeTier('pro')" class="w-full py-2.5 text-xs font-semibold rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white cursor-pointer shadow-md transition">Upgrade to Pro</button>
          </div>

          <!-- Ultra -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300 transition-all duration-200" id="tierCardUltra">
            <div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">MULTI-TENANT SCALE</span>
              <h3 class="text-base font-semibold text-neutral-950">Ultra Tier</h3>
              <div class="text-3xl font-extrabold font-num text-neutral-950 my-3">$99<span class="text-xs font-sans text-neutral-400">/mo</span></div>
              <ul class="text-xs text-neutral-600 space-y-2 mb-6 font-num">
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span><strong class="font-bold text-neutral-900">100,000</strong> requests / day</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Priority Edge Queue</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Dedicated Containers</span></li>
              </ul>
            </div>
            <button onclick="upgradeTier('ultra')" class="w-full py-2.5 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 transition cursor-pointer">Upgrade to Ultra</button>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 7: INTEGRATIONS -->
    <section id="view-integrations" class="space-y-6 hidden">
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <h2 class="text-sm font-bold text-neutral-950">Ecosystem SDK Integration Guides</h2>
        <div class="space-y-3">
          <div class="p-3 bg-neutral-50 rounded-xl border border-neutral-200">
            <h3 class="text-xs font-bold text-neutral-950 mb-1">Claude Desktop MCP Setup</h3>
            <pre class="p-3 bg-neutral-950 rounded-lg text-neutral-100 font-mono text-[11px] overflow-x-auto code-scroll">{
  "mcpServers": {
    "ultrademon": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sse", "${origin}/mcp/sse"],
      "env": { "ULTRASEARCH_API_KEY": "us_your_key_here" }
    }
  }
}</pre>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- Client-side Workspace Script -->
  <script>
    const ORIGIN = "${origin}";
    const STORAGE_KEY = 'ultrasearch_local_keys';

    let currentSessionToken = null;
    let currentUser = null;
    let localKeys = [];

    function getAuthToken() {
      const sess = localStorage.getItem('ultrademon_auth_session');
      if (sess) {
        try {
          const parsed = JSON.parse(sess);
          if (parsed && parsed.access_token) return parsed.access_token;
        } catch {}
      }
      return null;
    }

    function getActiveKey() {
      const sess = localStorage.getItem('ultrademon_auth_session');
      if (sess) {
        try {
          const parsed = JSON.parse(sess);
          if (parsed && (parsed.active_key || parsed.initial_key)) return parsed.active_key || parsed.initial_key;
        } catch {}
      }
      if (localKeys.length > 0 && localKeys[0].plain_key) return localKeys[0].plain_key;
      return '';
    }

    function getAppAuthHeaders() {
      const headers = { 'Content-Type': 'application/json' };
      const apiKey = getActiveKey();
      if (apiKey) {
        headers['X-API-Key'] = apiKey;
      } else {
        const token = getAuthToken();
        if (token) {
          headers['Authorization'] = 'Bearer ' + token;
        }
      }
      return headers;
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    }

    function copyActiveKey() {
      const k = getActiveKey();
      if (k) copyToClipboard(k);
    }

    function setAppView(viewId) {
      ['overview', 'keys', 'memory', 'search', 'crawler', 'membership', 'integrations'].forEach(id => {
        const viewEl = document.getElementById('view-' + id);
        if (viewEl) viewEl.classList.toggle('hidden', id !== viewId);

        const navBtn = document.getElementById('nav-' + id);
        if (navBtn) {
          if (id === viewId) {
            navBtn.className = 'flex items-center gap-2.5 px-3 py-2 rounded-lg bg-black text-white cursor-pointer transition text-left';
          } else {
            navBtn.className = 'flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left text-neutral-600';
          }
        }
      });

      const titles = {
        overview: ['Workspace Overview', 'Live edge telemetry, database metrics, and active sovereign API keys.'],
        keys: ['API Keys Studio', 'Create, manage, and revoke high-speed edge API keys.'],
        memory: ['UltraMemory Lab', 'Store, query, and browse agent structured long-term memory.'],
        search: ['UltraSearch Studio', 'Test live BM25 web search and multi-hop research queries.'],
        crawler: ['Web Crawler Control', 'Dispatch edge crawler tasks directly into D1 SQLite FTS5.'],
        membership: ['Memberships & Quotas', 'Manage your subscription tier and upgrade daily limits.'],
        integrations: ['Integrations & Protocol', 'Connect UltraDemon to Claude Desktop, Cursor, and Vercel AI SDK.'],
      };
      if (titles[viewId]) {
        document.getElementById('viewHeaderTitle').innerText = titles[viewId][0];
        document.getElementById('viewHeaderDesc').innerText = titles[viewId][1];
      }
    }

    async function handleAppCreateKey(e) {
      e.preventDefault();
      const plan = document.getElementById('appKeyPlan').value;
      const keyType = document.getElementById('appKeyType') ? document.getElementById('appKeyType').value : 'memory';
      const label = document.getElementById('appKeyLabel').value.trim();
      const spinner = document.getElementById('spinnerCreateKeyApp');
      const token = getAuthToken();
      if (!token) {
        window.location.href = '/login';
        return;
      }

      spinner.classList.remove('hidden');
      try {
        const res = await fetch('/v1/keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ plan, key_type: keyType, label })
        });
        const data = await res.json();
        if (data.plain_key) {
          document.getElementById('newKeyDisplayApp').innerText = data.plain_key;
          document.getElementById('newKeyAlertApp').classList.remove('hidden');
          await loadAppKeys();
          refreshTelemetry();
        } else {
          alert('Error: ' + (data.error || 'Failed to create key'));
        }
      } catch (err) {
        alert('Network error: ' + err.message);
      } finally {
        spinner.classList.add('hidden');
      }
    }

    async function loadAppKeys() {
      const token = getAuthToken();
      if (!token) return;
      try {
        const res = await fetch('/v1/keys', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        const data = await res.json();
        if (data.keys) {
          localKeys = data.keys;
          localStorage.setItem(STORAGE_KEY, JSON.stringify(localKeys));
          renderAppKeysTable();
        }
      } catch {}
    }

    function renderAppKeysTable() {
      const tbody = document.getElementById('appKeysTableBody');
      document.getElementById('keysCountBadge').innerText = localKeys.length;
      document.getElementById('metricKeys').innerText = localKeys.length;

      if (localKeys.length === 0) {
        tbody.innerHTML = '<tr><td colspan=\"6\" class=\"py-4 text-center text-neutral-400\">No API keys found. Generate one above!</td></tr>';
        document.getElementById('topActiveKeyLabel').innerText = 'None';
        document.getElementById('topCopyBtn').classList.add('hidden');
        return;
      }

      const active = localKeys[0];
      document.getElementById('topActiveKeyLabel').innerText = active.plain_key ? (active.plain_key.slice(0, 8) + '...') : active.key_id;
      document.getElementById('topCopyBtn').classList.remove('hidden');

      tbody.innerHTML = localKeys.map((k, idx) => {
        const scopeBadge = k.key_type === 'memory'
          ? '<span class=\"px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold uppercase font-num\">Memory API</span>'
          : (k.key_type === 'search'
            ? '<span class=\"px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 text-[10px] font-bold uppercase font-num\">Search API</span>'
            : '<span class=\"px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase font-num\">Unified API</span>');

        return '<tr class="hover:bg-neutral-50">' +
          '<td class="py-3 font-mono text-neutral-900">' +
            '<span class="truncate max-w-[150px] inline-block">' + (k.plain_key || 'Key: ' + k.key_id) + '</span>' +
            (k.plain_key ? ' <button data-key="' + k.plain_key + '" onclick="copyToClipboard(this.dataset.key)" class="text-neutral-400 hover:text-black cursor-pointer inline-flex items-center ml-1" title="Copy Key"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>' : '') +
          '</td>' +
          '<td class="py-3">' + scopeBadge + '</td>' +
          '<td class="py-3"><span class="px-2 py-0.5 rounded bg-neutral-100 text-neutral-900 text-[10px] font-bold uppercase font-num">' + k.plan + '</span></td>' +
          '<td class="py-3 text-neutral-600 font-sans">' + (k.label || 'Default') + '</td>' +
          '<td class="py-3 text-neutral-400">' + new Date(k.created_at || Date.now()).toLocaleDateString() + '</td>' +
          '<td class="py-3 text-right"><button data-key="' + (k.plain_key || k.key_id) + '" onclick="revokeAppKey(this.dataset.key)" class="text-neutral-400 hover:text-red-600 font-semibold cursor-pointer">Revoke</button></td>' +
        '</tr>';
      }).join('');
    }

    async function revokeAppKey(key) {
      if (!confirm('Are you sure you want to revoke this API key?')) return;
      const token = getAuthToken();
      await fetch('/v1/keys/' + key, {
        method: 'DELETE',
        headers: { 'Authorization': 'Bearer ' + token }
      });
      await loadAppKeys();
    }

    async function handleAppStoreMemory(e) {
      e.preventDefault();
      const memoryType = document.getElementById('appMemType').value;
      const containerTag = document.getElementById('appMemContainer').value.trim() || 'default';
      const content = document.getElementById('appMemContent').value.trim();
      const alertBox = document.getElementById('alertStoreMemApp');

      if (!content) return;

      try {
        const res = await fetch('/v1/memory', {
          method: 'POST',
          headers: getAppAuthHeaders(),
          body: JSON.stringify({ content, memory_type: memoryType, container_tag: containerTag })
        });
        const data = await res.json();
        if (data.memory || data.memory_id || data.status === 'success') {
          const mem = data.memory || data;
          const timeMs = data.storage_time_ms ? (' · stored in ' + data.storage_time_ms + 'ms') : '';
          alertBox.className = 'p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-950 font-num text-xs';
          alertBox.innerText = 'Stored memory ID: ' + (mem.memory_id || 'saved') + timeMs;
          alertBox.classList.remove('hidden');
          document.getElementById('appMemContent').value = '';
          loadStoredMemories();
        } else {
          throw new Error(data.error || 'Failed to store memory');
        }
      } catch (err) {
        alertBox.className = 'p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-red-600 font-num text-xs';
        alertBox.innerText = 'Error: ' + err.message;
        alertBox.classList.remove('hidden');
      }
    }

    async function handleAppQueryMemory(e) {
      e.preventDefault();
      const query = document.getElementById('appMemQuery').value.trim();
      const resultsDiv = document.getElementById('appMemResults');
      const timer = document.getElementById('appRecallTimer');

      if (!query) return;

      const t0 = performance.now();
      try {
        const res = await fetch('/v1/memory/recall?q=' + encodeURIComponent(query), {
          headers: getAppAuthHeaders()
        });
        const data = await res.json();
        const duration = Math.round(performance.now() - t0);
        timer.innerText = (data.retrieval_time_ms || duration) + 'ms';
        timer.classList.remove('hidden');

        if (data.memories && data.memories.length > 0) {
          let html = '';
          if (data.context) {
            html += '<div class="p-3 rounded-xl bg-neutral-900 text-neutral-100 font-mono text-[11px] mb-3">' +
              '<div class="text-neutral-400 text-[10px] uppercase font-bold mb-1">LLM Prompt Context Injected:</div>' +
              '<pre class="whitespace-pre-wrap font-mono">' + data.context + '</pre>' +
            '</div>';
          }
          html += data.memories.map(m =>
            '<div class="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">' +
              '<div class="flex items-center justify-between text-[10px] text-neutral-500 font-num mb-1">' +
                '<span class="uppercase font-bold text-neutral-900">' + m.memory_type + '</span>' +
                '<span>tag: ' + m.container_tag + ' · score: ' + (m.score || 1.0).toFixed(2) + '</span>' +
              '</div>' +
              '<p class="text-neutral-900 font-medium">' + m.content + '</p>' +
            '</div>'
          ).join('');
          resultsDiv.innerHTML = html;
        } else {
          resultsDiv.innerHTML = '<div class="text-center py-4 text-neutral-400 text-xs">No memories matching query.</div>';
        }
      } catch (err) {
        resultsDiv.innerHTML = '<div class="text-center py-4 text-red-600 text-xs font-num">Error: ' + err.message + '</div>';
      }
    }

    async function loadStoredMemories() {
      try {
        const res = await fetch('/v1/memory?limit=30', { headers: getAppAuthHeaders() });
        const data = await res.json();
        const tbody = document.getElementById('appMemoriesTableBody');
        if (data.memories && data.memories.length > 0) {
          document.getElementById('metricMemories').innerText = data.total || data.memories.length;
          tbody.innerHTML = data.memories.map(m =>
            '<tr class="hover:bg-neutral-50">' +
              '<td class="py-2.5 font-mono text-neutral-900">' + m.memory_id + '</td>' +
              '<td class="py-2.5 font-mono text-neutral-600">' + m.container_tag + '</td>' +
              '<td class="py-2.5"><span class="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] uppercase font-bold">' + m.memory_type + '</span></td>' +
              '<td class="py-2.5 truncate max-w-xs text-neutral-900 font-sans">' + (m.title || m.content) + '</td>' +
              '<td class="py-2.5 text-right"><button onclick="deleteAppMem(\'' + m.memory_id + '\')" class="text-neutral-400 hover:text-black cursor-pointer">Delete</button></td>' +
            '</tr>'
          ).join('');
        } else {
          tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-neutral-400">No memories stored yet.</td></tr>';
        }
      } catch {}
    }

    async function deleteAppMem(id) {
      try {
        await fetch('/v1/memory/' + id, { method: 'DELETE', headers: getAppAuthHeaders() });
        loadStoredMemories();
      } catch {}
    }

    async function handleAppSearch(e) {
      e.preventDefault();
      const query = document.getElementById('appSearchQuery').value.trim();
      const mode = parseInt(document.querySelector('input[name="appSearchMode"]:checked')?.value || '1', 10);
      const resultsDiv = document.getElementById('appSearchResults');

      if (!query) return;

      resultsDiv.innerHTML = '<div class="text-center py-4 text-neutral-400 text-xs">Searching edge index...</div>';
      try {
        const res = await fetch('/v1/search', {
          method: 'POST',
          headers: getAppAuthHeaders(),
          body: JSON.stringify({ query, mode, num_results: 5 })
        });
        const data = await res.json();
        if (data.results && data.results.length > 0) {
          resultsDiv.innerHTML = data.results.map(r =>
            '<div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">' +
              '<div class="flex items-center justify-between text-[10px] text-neutral-500 font-num">' +
                '<span class="truncate max-w-sm">' + r.url + '</span>' +
                '<span class="font-bold text-neutral-900">BM25: ' + (r.score || 0.95).toFixed(2) + '</span>' +
              '</div>' +
              '<a href="' + r.url + '" target="_blank" class="font-bold text-neutral-950 hover:underline block">' + r.title + '</a>' +
              '<p class="text-neutral-600">' + r.snippet + '</p>' +
            '</div>'
          ).join('');
        } else {
          resultsDiv.innerHTML = '<div class="text-center py-4 text-neutral-400 text-xs">No results found for query.</div>';
        }
      } catch (err) {
        resultsDiv.innerHTML = '<div class="text-center py-4 text-red-600 text-xs font-num">Search error: ' + err.message + '</div>';
      }
    }

    async function handleAppCrawl(e) {
      e.preventDefault();
      const url = document.getElementById('appCrawlUrl').value.trim();
      const depth = parseInt(document.getElementById('appCrawlDepth').value, 10);
      const box = document.getElementById('appCrawlResult');

      if (!url) return;

      box.innerText = 'Crawling and parsing URL into D1 FTS5...';
      box.classList.remove('hidden');

      try {
        const res = await fetch('/v1/crawl', {
          method: 'POST',
          headers: getAppAuthHeaders(),
          body: JSON.stringify({ url, depth })
        });
        const data = await res.json();
        box.innerText = JSON.stringify(data, null, 2);
      } catch (err) {
        box.innerText = 'Crawl error: ' + err.message;
      }
    }

    async function upgradeTier(plan) {
      const token = getAuthToken();
      if (!token) return;
      try {
        const res = await fetch('/v1/auth/membership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ plan })
        });
        const data = await res.json();
        if (data.plan) {
          alert('Membership tier updated to ' + data.plan.toUpperCase());
          document.getElementById('userPlanBadge').innerText = data.plan;
          await loadAppKeys();
          refreshTelemetry();
        }
      } catch (err) {
        alert('Upgrade failed: ' + err.message);
      }
    }

    async function refreshTelemetry() {
      try {
        const res = await fetch('/v1/usage', { headers: getAppAuthHeaders() });
        const data = await res.json();
        if (data.daily_limit !== undefined) {
          document.getElementById('metricUsed').innerText = data.requests_today || 0;
          document.getElementById('metricLimit').innerText = data.daily_limit === 'unlimited' ? '∞' : data.daily_limit;
        }
      } catch {}
    }

    function handleAppSignOut() {
      const token = getAuthToken();
      if (token) {
        fetch('/v1/auth/signout', { method: 'POST', headers: { 'Authorization': 'Bearer ' + token } }).catch(() => {});
      }
      localStorage.removeItem('ultrademon_auth_session');
      localStorage.removeItem('ultrademon_user');
      window.location.href = '/login';
    }

    async function autoProvisionInitialKey(plan) {
      const token = getAuthToken();
      if (!token) return;
      try {
        const res = await fetch('/v1/keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ plan: plan || 'free', label: 'Primary Edge Key' })
        });
        const data = await res.json();
        if (data.plain_key) {
          await loadAppKeys();
          refreshTelemetry();
        }
      } catch {}
    }

    // Initialize Workspace on Page Load
    window.addEventListener('DOMContentLoaded', async () => {
      const token = getAuthToken();
      if (!token) {
        window.location.href = '/login';
        return;
      }

      try {
        const res = await fetch('/v1/auth/me', {
          headers: { 'Authorization': 'Bearer ' + token }
        });
        if (!res.ok) {
          localStorage.removeItem('ultrademon_auth_session');
          window.location.href = '/login';
          return;
        }
        const data = await res.json();
        currentUser = data.user;
        document.getElementById('userEmailDisplay').innerText = currentUser.email || currentUser.id;
        document.getElementById('userPlanBadge').innerText = (currentUser.plan || 'free').toUpperCase();

        const urlParams = new URLSearchParams(window.location.search);
        const targetPlan = (urlParams.get('plan') || urlParams.get('upgrade') || '').toLowerCase();
        if (targetPlan && ['free', 'pro', 'ultra', 'enterprise'].includes(targetPlan)) {
          if (currentUser.plan !== targetPlan) {
            await upgradeTier(targetPlan);
          }
        }

        await loadAppKeys();
        if (localKeys.length === 0) {
          await autoProvisionInitialKey(currentUser.plan || targetPlan || 'free');
        }
        loadStoredMemories();
        refreshTelemetry();

        const targetTab = urlParams.get('tab');
        if (targetTab && ['overview', 'keys', 'memory', 'search', 'crawler', 'membership', 'integrations'].includes(targetTab)) {
          setAppView(targetTab);
        }
      } catch {
        window.location.href = '/login';
      }
    });
  </script>
</body>
</html>`;
}
