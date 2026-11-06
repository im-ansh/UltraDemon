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
    .hidden {
      display: none !important;
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
        <span class="font-normal text-base tracking-tight text-neutral-950 flex items-center gap-1">
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
          Active Workspace
        </div>
      </div>

      <!-- App Navigation Links -->
      <nav class="flex flex-col space-y-1 text-xs font-medium text-neutral-600" id="sidebarNav">
        <button type="button" onclick="setAppView('overview')" data-view-target="overview" id="nav-overview" class="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-black text-white cursor-pointer transition text-left">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
          <span>Overview</span>
        </button>

        <button type="button" onclick="setAppView('keys')" data-view-target="keys" id="nav-keys" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left text-neutral-600">
          <div class="flex items-center gap-2.5">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1-1-1.5 1.5L7 8l-1.5 1.5L4 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2h2v2h2l4-4 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 2-2z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
            <span>API Keys</span>
          </div>
          <span id="keysCountBadge" class="font-num text-[10px] text-neutral-400">0</span>
        </button>

        <button type="button" onclick="setAppView('memory')" data-view-target="memory" id="nav-memory" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left text-neutral-600">
          <div class="flex items-center gap-2.5">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/></svg>
            <span>UltraMemory</span>
          </div>
          <span class="font-num text-[10px] bg-neutral-100 text-neutral-900 border border-neutral-200 px-1.5 rounded font-bold">&lt;15ms</span>
        </button>

        <button type="button" onclick="setAppView('search')" data-view-target="search" id="nav-search" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left text-neutral-600">
          <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          <span>UltraSearch Studio</span>
        </button>

        <button type="button" onclick="setAppView('crawler')" data-view-target="crawler" id="nav-crawler" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left text-neutral-600">
          <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          <span>Web Crawler</span>
        </button>

        <button type="button" onclick="setAppView('membership')" data-view-target="membership" id="nav-membership" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left text-neutral-600">
          <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
          <span>Memberships &amp; Quotas</span>
        </button>

        <button type="button" onclick="setAppView('analytics')" data-view-target="analytics" id="nav-analytics" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left text-neutral-600">
          <div class="flex items-center gap-2.5">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            <span>Telemetry &amp; ICP</span>
          </div>
          <span class="font-num text-[9px] bg-neutral-900 text-white px-1.5 py-0.5 rounded font-semibold">vs PostHog</span>
        </button>

        <button type="button" onclick="setAppView('integrations')" data-view-target="integrations" id="nav-integrations" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black cursor-pointer transition text-left text-neutral-600">
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
      <button type="button" onclick="handleAppSignOut()" class="w-full py-1.5 px-3 text-xs text-red-600 hover:bg-red-50 rounded-lg transition flex items-center gap-2 cursor-pointer">
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
        <h1 id="viewHeaderTitle" class="text-2xl font-normal text-neutral-950 tracking-tight flex items-center gap-2">
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
        <button type="button" onclick="copyActiveKey()" id="topCopyBtn" class="text-neutral-500 hover:text-black cursor-pointer hidden">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
      </div>
    </header>

    <!-- Sovereign Engine Suite Switcher (Overview • Search • Memory • Metrics) -->
    <div class="mb-8 p-1.5 bg-neutral-100/90 border border-neutral-200/90 rounded-2xl flex items-center gap-1.5 shadow-2xs">
      <!-- 0. Overview Suite -->
      <button type="button" onclick="switchSuite('overview')" id="suiteBtn-overview" class="suite-tab-btn flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer bg-white text-neutral-950 shadow-xs border border-neutral-300">
        <svg class="w-3.5 h-3.5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
        <span class="font-bold">Overview</span>
      </button>

      <!-- 1. Search Suite -->
      <button type="button" onclick="switchSuite('search')" id="suiteBtn-search" class="suite-tab-btn flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer text-neutral-600 hover:text-black hover:bg-white/60 border border-transparent">
        <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
        <span class="font-bold">Search</span>
        <span class="text-[9px] bg-neutral-200/70 border border-neutral-300/50 px-1.5 py-0.2 rounded font-num text-neutral-700 hidden sm:inline">&lt;40ms Edge</span>
      </button>

      <!-- 2. Memory Suite -->
      <button type="button" onclick="switchSuite('memory')" id="suiteBtn-memory" class="suite-tab-btn flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer text-neutral-600 hover:text-black hover:bg-white/60 border border-transparent">
        <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/></svg>
        <span class="font-bold">Memory</span>
        <span class="text-[9px] bg-neutral-200/70 border border-neutral-300/50 px-1.5 py-0.2 rounded font-num text-neutral-700 hidden sm:inline">&lt;15ms BM25</span>
      </button>

      <!-- 3. Metrics Suite -->
      <button type="button" onclick="switchSuite('metrics')" id="suiteBtn-metrics" class="suite-tab-btn flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer text-neutral-600 hover:text-black hover:bg-white/60 border border-transparent">
        <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
        <span class="font-bold">Metrics</span>
        <span class="text-[9px] bg-neutral-900 text-white px-1.5 py-0.2 rounded font-num hidden sm:inline">vs PostHog</span>
      </button>
    </div>

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
          <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="metricUsed">0</div>
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
          <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="metricKeys">0</div>
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
          <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="metricMemories">0</div>
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
          <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="metricIndexed">0</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Algorithm</span>
            <span class="font-bold text-neutral-900">BM25 Edge</span>
          </div>
        </div>
      </div>

      <!-- Real-Time Request & Daily Call Telemetry Dashboard -->
      <div class="card-clean p-6 sm:p-8 rounded-3xl border-2 border-neutral-900 bg-white space-y-6 shadow-sm">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-100 pb-5">
          <div>
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-num font-bold tracking-wider uppercase mb-2">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Real-Time Edge Monitor · Sub-Millisecond</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-normal tracking-tight text-neutral-950">
              API Key Daily Calls &amp; <span class="font-serif font-bold italic">Real-Time Telemetry</span>
            </h2>
            <p class="text-xs text-neutral-500 mt-1 font-num">
              Track requests made per day for each individual API key, separated across UltraSearch, UltraMemory, and UltraMetrics, plus combined total.
            </p>
          </div>

          <div class="flex flex-wrap items-center gap-2.5">
            <!-- Auto-Refresh Toggle -->
            <label class="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 text-xs font-semibold text-neutral-700 cursor-pointer select-none">
              <input type="checkbox" id="realtimeAutoRefreshCheck" checked onchange="toggleRealtimeAutoRefresh(this.checked)" class="accent-black rounded cursor-pointer" />
              <span class="font-num text-[11px]">Live (3s)</span>
            </label>

            <!-- Manual Refresh Button -->
            <button type="button" onclick="loadRealtimeKeyMetrics(true)" id="btnRefreshKeyMetrics" class="px-3.5 py-1.5 rounded-xl border border-neutral-200 hover:bg-neutral-100 text-xs font-semibold text-neutral-800 transition cursor-pointer flex items-center gap-1.5 font-num shadow-2xs">
              <svg id="refreshKeyMetricsSpinner" class="w-3.5 h-3.5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Refresh</span>
            </button>
          </div>
        </div>

        <!-- 4 Top Real-Time KPI Cards (Combined & Service Breakdown) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- Card 1: Combined Calls Today -->
          <div class="p-4 rounded-2xl bg-neutral-950 text-white flex flex-col justify-between shadow-md relative overflow-hidden">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-400 font-num">Combined Calls Today</span>
              <span class="px-2 py-0.5 rounded-full bg-white/10 text-emerald-400 text-[10px] font-num font-bold">ALL KEYS</span>
            </div>
            <div class="text-3xl font-normal font-num tracking-tight" id="rtCombinedTotal">0</div>
            <div class="mt-3 pt-2 border-t border-white/10 text-[11px] font-num text-neutral-400 flex items-center justify-between">
              <span>Quota Used Today</span>
              <span id="rtCombinedQuotaPct" class="text-white font-bold font-num">0%</span>
            </div>
          </div>

          <!-- Card 2: UltraSearch Calls -->
          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-num">UltraSearch Calls</span>
              <span class="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-num font-semibold">&lt;40ms</span>
            </div>
            <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="rtCombinedSearch">0</div>
            <div class="mt-3 pt-2 border-t border-neutral-200 text-[11px] font-num text-neutral-500 flex items-center justify-between">
              <span>Share of Today</span>
              <span id="rtSearchShare" class="text-neutral-950 font-bold font-num">0%</span>
            </div>
          </div>

          <!-- Card 3: UltraMemory Calls -->
          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-num">UltraMemory Calls</span>
              <span class="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-num font-semibold">&lt;15ms</span>
            </div>
            <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="rtCombinedMemory">0</div>
            <div class="mt-3 pt-2 border-t border-neutral-200 text-[11px] font-num text-neutral-500 flex items-center justify-between">
              <span>Share of Today</span>
              <span id="rtMemoryShare" class="text-neutral-950 font-bold font-num">0%</span>
            </div>
          </div>

          <!-- Card 4: UltraMetrics Calls -->
          <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col justify-between">
            <div class="flex items-center justify-between mb-2">
              <span class="text-[10px] font-bold uppercase tracking-wider text-neutral-500 font-num">UltraMetrics Calls</span>
              <span class="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-800 text-[10px] font-num font-semibold">Sub-5ms</span>
            </div>
            <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="rtCombinedMetrics">0</div>
            <div class="mt-3 pt-2 border-t border-neutral-200 text-[11px] font-num text-neutral-500 flex items-center justify-between">
              <span>Share of Today</span>
              <span id="rtMetricsShare" class="text-neutral-950 font-bold font-num">0%</span>
            </div>
          </div>
        </div>

        <!-- Interactive 1-Click Test Request Bar (Simulate & Verify Live Ingestion) -->
        <div class="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span class="font-bold text-neutral-900 font-num">Interactive Edge Tester:</span>
            <span class="text-neutral-500">Emit live requests to verify real-time counter increment</span>
          </div>
          <div class="flex items-center gap-2 flex-wrap">
            <button type="button" onclick="testLiveRequest('search')" class="px-2.5 py-1 rounded-lg bg-white border border-neutral-300 hover:border-black text-[11px] font-semibold text-neutral-800 hover:text-black transition cursor-pointer font-num shadow-2xs">
              +1 Search Call
            </button>
            <button type="button" onclick="testLiveRequest('memory')" class="px-2.5 py-1 rounded-lg bg-white border border-neutral-300 hover:border-black text-[11px] font-semibold text-neutral-800 hover:text-black transition cursor-pointer font-num shadow-2xs">
              +1 Memory Call
            </button>
            <button type="button" onclick="testLiveRequest('metrics')" class="px-2.5 py-1 rounded-lg bg-white border border-neutral-300 hover:border-black text-[11px] font-semibold text-neutral-800 hover:text-black transition cursor-pointer font-num shadow-2xs">
              +1 Metrics Call
            </button>
          </div>
        </div>

        <!-- Per-API Key Granular Daily Calls Matrix Table -->
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-neutral-950">Per-API Key Request Matrix (Today's Calls Breakdown)</h3>
              <span class="text-[10px] font-num bg-neutral-100 text-neutral-700 border border-neutral-200 px-2 py-0.5 rounded font-semibold">Separate &amp; Combined</span>
            </div>
            <span class="text-[10px] text-neutral-400 font-num uppercase" id="rtLastUpdatedTime">Last sync: Just now</span>
          </div>

          <div class="overflow-x-auto border border-neutral-200 rounded-2xl bg-white shadow-2xs">
            <table class="w-full text-xs text-left">
              <thead>
                <tr class="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-num text-[11px]">
                  <th class="p-3 font-medium">API Key &amp; Label</th>
                  <th class="p-3 font-medium">Scope</th>
                  <th class="p-3 font-medium">Plan</th>
                  <th class="p-3 font-medium text-right bg-neutral-100/60 font-bold text-neutral-950">Combined Today</th>
                  <th class="p-3 font-medium text-right">Search Calls</th>
                  <th class="p-3 font-medium text-right">Memory Calls</th>
                  <th class="p-3 font-medium text-right">Metrics Calls</th>
                  <th class="p-3 font-medium text-right">Daily Limit</th>
                  <th class="p-3 font-medium text-right">Last Used</th>
                </tr>
              </thead>
              <tbody id="rtApiKeyTableBody" class="divide-y divide-neutral-100 font-num">
                <tr><td colspan="9" class="p-6 text-center text-neutral-400">Loading real-time API key metrics...</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 7-Day Daily Calls History & Service Proportions -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-neutral-950">7-Day Daily Call History (Combined &amp; Per Service)</h3>
            <span class="text-[10px] text-neutral-400 font-num uppercase">Past 7 Days UTC</span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5" id="rtHistoryStripContainer">
            <!-- 7 daily cards rendered dynamically -->
          </div>
        </div>

        <!-- Real-Time Incoming Request Micro-Trace Stream -->
        <div class="space-y-3 pt-2">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <span class="text-xs font-bold text-neutral-950 font-num">Real-Time Edge Request Micro-Stream</span>
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <span class="text-[10px] text-neutral-400 font-num uppercase">Rolling Live Feed (Last 25)</span>
          </div>
          <div id="rtRecentEventsContainer" class="space-y-2 max-h-[260px] overflow-y-auto pr-1">
            <div class="p-4 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl">No requests recorded yet today. Click an interactive test button above to emit live edge calls.</div>
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
          <button type="button" onclick="copyToClipboard(document.getElementById('overviewCodeSnippet').innerText)" class="absolute top-3 right-3 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
        </div>
      </div>
    </section>

    <!-- SECTION 2: API KEYS STUDIO -->
    <section id="view-keys" class="space-y-6 hidden">

      <!-- Create Key Form Card -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <h2 class="text-sm font-bold text-neutral-950">Generate New API Key</h2>
        <form onsubmit="event.preventDefault(); handleAppCreateKey(event); return false;" class="grid grid-cols-1 sm:grid-cols-4 gap-3">
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
              <option value="search">UltraSearch API (us_*)</option>
              <option value="memory" selected>UltraMemory API (um_*)</option>
              <option value="telemetry">UltraMetrics Telemetry (ut_*)</option>
              <option value="unified">Unified API (All 3 Engines)</option>
            </select>
          </div>
          <div>
            <label class="block text-[11px] font-medium text-neutral-600 mb-1">Key Label</label>
            <input type="text" id="appKeyLabel" placeholder="e.g. Agent Memory Key" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-900 focus:outline-none focus:bg-white focus:border-black" />
          </div>
          <div class="flex items-end">
            <button type="button" onclick="handleAppCreateKey(event); return false;" id="btnCreateKeyApp" class="w-full py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer">
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
            <button type="button" onclick="copyToClipboard(document.getElementById('newKeyDisplayApp').innerText)" class="px-2 py-1 bg-black text-white text-[10px] rounded hover:bg-neutral-800 cursor-pointer">Copy</button>
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
              <tr><td colspan="6" class="py-4 text-center text-neutral-400">No API keys generated yet.</td></tr>
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
            <h2 class="text-sm font-normal text-neutral-950 mt-0.5">UltraMemory API Reference</h2>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="quickCreateSuiteKey('memory')" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 cursor-pointer transition flex items-center gap-1.5 shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span>Create Memory Key</span>
            </button>
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
            <button type="button" onclick="copyToClipboard(document.getElementById('memQuickSnippet').innerText)" class="hover:text-black cursor-pointer underline text-[10px]">Copy</button>
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
        <form onsubmit="event.preventDefault(); handleAppStoreMemory(event); return false;" class="space-y-3">
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
          <button type="button" onclick="handleAppStoreMemory(event); return false;" id="btnStoreMemApp" class="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5 cursor-pointer">
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
        <form onsubmit="event.preventDefault(); handleAppQueryMemory(event); return false;" class="flex gap-2">
          <input type="text" id="appMemQuery" placeholder="Query memories..." required class="flex-1 px-3.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs" />
          <button type="button" onclick="handleAppQueryMemory(event); return false;" class="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl cursor-pointer">Recall</button>
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
              <tr><td colspan="5" class="py-4 text-center text-neutral-400">No stored memories yet.</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- SECTION 4: ULTRASEARCH STUDIO -->
    <section id="view-search" class="space-y-6 hidden">
      <!-- Search Suite Top KPI Strip -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="card-clean p-5 rounded-2xl flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">BM25 Edge P50</span>
            <span class="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-num font-bold">&lt;40ms</span>
          </div>
          <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight">38ms</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Anycast PoPs</span>
            <span class="font-bold text-neutral-900">330+ Cities</span>
          </div>
        </div>

        <div class="card-clean p-5 rounded-2xl flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">KV Cache Hit Rate</span>
            <span class="text-xs text-neutral-400 font-num">Speed</span>
          </div>
          <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight">94.8%</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Cache Recall</span>
            <span class="font-bold text-neutral-900">&lt;5ms</span>
          </div>
        </div>

        <div class="card-clean p-5 rounded-2xl flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">Engine Topology</span>
            <span class="text-xs text-neutral-400 font-num">C-Compiled</span>
          </div>
          <div class="text-2xl font-normal font-num text-neutral-950 tracking-tight">D1 SQLite FTS5</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Cloud Markup</span>
            <span class="font-bold text-neutral-900">Zero</span>
          </div>
        </div>

        <div class="card-clean p-5 rounded-2xl flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">Search Modes</span>
            <span class="text-xs text-neutral-400 font-num">Routing</span>
          </div>
          <div class="text-2xl font-normal font-num text-neutral-950 tracking-tight">Modes 1, 2, 3</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Deep Research</span>
            <span class="font-bold text-neutral-900">Supported</span>
          </div>
        </div>
      </div>

      <!-- Search API & SDK Management Card -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-neutral-950">UltraSearch API &amp; SDK Quickstart</h3>
              <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white font-num">&lt;40ms BM25 Edge</span>
            </div>
            <p class="text-xs text-neutral-500 mt-0.5">Direct BM25 web index queries with compiled SQLite FTS5. Zero third-party LLM latency, zero cloud markups.</p>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="quickCreateSuiteKey('search')" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 cursor-pointer transition flex items-center gap-1.5 shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span>Create Search Key</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <!-- TypeScript SDK -->
          <div>
            <div class="flex items-center justify-between mb-1 font-bold font-num text-neutral-700">
              <span>TypeScript / Node.js SDK</span>
              <button type="button" onclick="copySnippetCode('searchTsSnippet')" class="text-[10px] text-neutral-500 hover:text-black underline cursor-pointer">Copy</button>
            </div>
            <pre id="searchTsSnippet" class="p-3 bg-neutral-950 rounded-xl text-neutral-100 font-mono text-[10px] overflow-x-auto code-scroll">import { UltraSearch } from '@ultrademon/sdk';

const search = new UltraSearch({ apiKey: 'YOUR_SEARCH_KEY' });
const { results, latency_ms } = await search.query('LLM edge retrieval', {
  mode: 1 // 1: Instant &lt;50ms, 2: Standard, 3: Deep
});</pre>
          </div>

          <!-- Python SDK / REST -->
          <div>
            <div class="flex items-center justify-between mb-1 font-bold font-num text-neutral-700">
              <span>Python Backend / LangChain</span>
              <button type="button" onclick="copySnippetCode('searchPySnippet')" class="text-[10px] text-neutral-500 hover:text-black underline cursor-pointer">Copy</button>
            </div>
            <pre id="searchPySnippet" class="p-3 bg-neutral-950 rounded-xl text-neutral-100 font-mono text-[10px] overflow-x-auto code-scroll">import requests

res = requests.get("${origin}/v1/search",
    params={"q": "LLM edge retrieval", "mode": 1},
    headers={"X-API-Key": "YOUR_SEARCH_KEY"}).json()
print(f"Results in {res['latency_ms']}ms: {res['results']}")</pre>
          </div>
        </div>
      </div>

      <!-- Live Search Query Studio -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <h2 class="text-sm font-bold text-neutral-950">Test Sovereign Web Index</h2>
        <form onsubmit="event.preventDefault(); handleAppSearch(event); return false;" class="space-y-3">
          <div class="flex gap-2">
            <input type="text" id="appSearchQuery" value="What is Python?" placeholder="Search index..." required class="flex-1 px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-xs" />
            <button type="button" onclick="handleAppSearch(event); return false;" class="px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl cursor-pointer">Search</button>
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

      <!-- Web Crawler & URL Ingestion -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-neutral-950">Ingest URL into Sovereign Index</h2>
          <span class="text-[10px] bg-neutral-100 border border-neutral-200 px-2 py-0.5 rounded font-num text-neutral-700">Autonomous Edge Crawler</span>
        </div>
        <form onsubmit="event.preventDefault(); handleAppCrawl(event); return false;" class="space-y-3">
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div class="sm:col-span-2">
              <label class="block text-[11px] font-medium text-neutral-600 mb-1">Target URL</label>
              <input type="url" id="appCrawlUrlSearch" placeholder="https://docs.python.org" required class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono" />
            </div>
            <div>
              <label class="block text-[11px] font-medium text-neutral-600 mb-1">Depth</label>
              <select id="appCrawlDepthSearch" class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-num">
                <option value="0">Depth 0 (Exact URL only)</option>
                <option value="1">Depth 1 (URL + outgoing links)</option>
                <option value="2">Depth 2 (Deep recursive crawl)</option>
              </select>
            </div>
          </div>
          <button type="button" onclick="handleAppCrawl(event); return false;" id="btnCrawlAppSearch" class="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl cursor-pointer">
            Start Edge Crawl &amp; Index
          </button>
        </form>
        <div id="appCrawlResultSearch" class="hidden p-4 rounded-xl bg-neutral-50 border border-neutral-200 font-mono text-xs"></div>
      </div>
    </section>

    <!-- SECTION 5: WEB CRAWLER -->
    <section id="view-crawler" class="space-y-6 hidden">
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <h2 class="text-sm font-bold text-neutral-950">Ingest URL into Sovereign Index</h2>
        <form onsubmit="event.preventDefault(); handleAppCrawl(event); return false;" class="space-y-3">
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
          <button type="button" onclick="handleAppCrawl(event); return false;" id="btnCrawlApp" class="px-4 py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl cursor-pointer">
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
              <div class="text-3xl font-normal font-num text-neutral-950 my-3">$0<span class="text-xs font-sans text-neutral-400">/mo</span></div>
              <ul class="text-xs text-neutral-600 space-y-2 mb-6 font-num">
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>100 requests / day</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>UltraMemory &lt;15ms recall</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>KV Hot Cache</span></li>
              </ul>
            </div>
            <button type="button" onclick="upgradeTier('free')" class="w-full py-2.5 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 transition cursor-pointer">Select Free</button>
          </div>

          <!-- Pro -->
          <div class="group relative bg-white rounded-2xl border-2 border-neutral-950 p-6 flex flex-col justify-between shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-200 ring-4 ring-neutral-950/5" id="tierCardPro">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1 text-[10px] font-bold bg-neutral-950 text-white rounded-full font-num uppercase tracking-wider shadow-lg whitespace-nowrap border border-neutral-800">POPULAR</div>
            <div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-900 uppercase tracking-wider mb-2">PRODUCTION FLEET</span>
              <h3 class="text-base font-semibold text-neutral-950">Pro Tier</h3>
              <div class="text-3xl font-normal font-num text-neutral-950 my-3">$29<span class="text-xs font-sans text-neutral-400">/mo</span></div>
              <ul class="text-xs text-neutral-700 space-y-2 mb-6 font-num">
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span><strong class="font-bold">10,000</strong> requests / day</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>UltraMemory File Ingestion</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Full Crawler Access</span></li>
              </ul>
            </div>
            <button type="button" onclick="upgradeTier('pro')" class="w-full py-2.5 text-xs font-semibold rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white cursor-pointer shadow-md transition">Upgrade to Pro</button>
          </div>

          <!-- Ultra -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300 transition-all duration-200" id="tierCardUltra">
            <div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">MULTI-TENANT SCALE</span>
              <h3 class="text-base font-semibold text-neutral-950">Ultra Tier</h3>
              <div class="text-3xl font-normal font-num text-neutral-950 my-3">$99<span class="text-xs font-sans text-neutral-400">/mo</span></div>
              <ul class="text-xs text-neutral-600 space-y-2 mb-6 font-num">
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span><strong class="font-bold text-neutral-900">100,000</strong> requests / day</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Priority Edge Queue</span></li>
                <li class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Dedicated Containers</span></li>
              </ul>
            </div>
            <button type="button" onclick="upgradeTier('ultra')" class="w-full py-2.5 text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 transition cursor-pointer">Upgrade to Ultra</button>
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

    <!-- SECTION 8: TELEMETRY & CUSTOMER PROFILE (VS POSTHOG) -->
    <section id="view-analytics" class="space-y-6 hidden">
      <!-- Interactive Tracking Simulator & Live Event Emitter -->
      <div class="card-clean p-6 rounded-2xl space-y-5 bg-gradient-to-b from-neutral-50/80 to-white">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-200/80 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-neutral-950">Interactive Telemetry Simulator &amp; Event Emitter</h3>
              <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white font-num">Instant Verification</span>
            </div>
            <p class="text-xs text-neutral-500 mt-0.5">Test tracking and micro-metric capture in 1-click. Emits real-time edge events to verify KPIs, kinetic dwell, and VIP trace streams instantly.</p>
          </div>
          <div class="flex items-center gap-2">
            <span id="simulatorLastEmitStatus" class="text-[11px] font-mono text-emerald-700 font-semibold hidden bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg"></span>
          </div>
        </div>

        <!-- 3 Quick Simulation Presets -->
        <div>
          <span class="text-[11px] font-bold text-neutral-700 uppercase tracking-wider block mb-2 font-num">1-Click Telemetry Simulation Scenarios</span>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button type="button" onclick="emitSimulationEvent('deep_working')" class="p-3.5 bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-400 rounded-xl text-left transition cursor-pointer group shadow-2xs">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-bold text-neutral-900 group-hover:text-black">Active Power User</span>
                <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-800 font-num">65s Active</span>
              </div>
              <p class="text-[10px] text-neutral-500 leading-normal">Deep working session with Apple M3 Max GPU, 16 cores, Retina 2x, dark mode.</p>
            </button>

            <button type="button" onclick="emitSimulationEvent('vip_client')" class="p-3.5 bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-400 rounded-xl text-left transition cursor-pointer group shadow-2xs">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-bold text-emerald-950 group-hover:text-emerald-900">VIP Target Hit</span>
                <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-num">VIP Traced</span>
              </div>
              <p class="text-[10px] text-neutral-500 leading-normal">Triggers high-paying client trace for IP / account with deep micro-trace snapshot.</p>
            </button>

            <button type="button" onclick="emitSimulationEvent('idle_lurking')" class="p-3.5 bg-white hover:bg-neutral-50 border border-neutral-200 hover:border-neutral-400 rounded-xl text-left transition cursor-pointer group shadow-2xs">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-bold text-neutral-900 group-hover:text-black">Inactive Lurker</span>
                <span class="text-[9px] font-bold px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-800 font-num">85% Idle</span>
              </div>
              <p class="text-[10px] text-neutral-500 leading-normal">Simulates high inactive dwell without mouse movement and tab switching.</p>
            </button>
          </div>
        </div>

        <!-- Custom Event Emitter Strip -->
        <form onsubmit="event.preventDefault(); handleCustomSimulation(event); return false;" class="pt-2 border-t border-neutral-100 grid grid-cols-1 sm:grid-cols-5 gap-2.5 items-end">
          <div class="sm:col-span-2">
            <label class="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Custom Event Name</label>
            <input type="text" id="simEventName" value="feature_activated" required class="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black font-mono" />
          </div>
          <div>
            <label class="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Distinct ID</label>
            <input type="text" id="simDistinctId" value="usr_test_edge" required class="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black font-mono" />
          </div>
          <div>
            <label class="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Client IP (Optional)</label>
            <input type="text" id="simClientIp" placeholder="e.g. 203.0.113.88" class="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black font-mono" />
          </div>
          <div>
            <button type="button" onclick="handleCustomSimulation(event); return false;" id="btnEmitSimEvent" class="w-full py-1.5 px-3 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold cursor-pointer transition flex items-center justify-center gap-1.5 shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <span>Emit Event</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Telemetry API Key & SDK Quickstart Card -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-3">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-neutral-950">UltraMetrics Telemetry API &amp; SDK Quickstart</h3>
              <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white font-num">Sub-5ms Edge Ingest</span>
            </div>
            <p class="text-xs text-neutral-500 mt-0.5">Drop our 2.5KB script into any web app to capture kinetic dwell, unmasked GPU silicon, and autonomous customer profiles.</p>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="quickCreateSuiteKey('telemetry')" class="text-xs font-semibold px-3 py-1.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 cursor-pointer transition flex items-center gap-1.5 shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span>Create Telemetry Key</span>
            </button>
          </div>
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[11px] font-bold text-neutral-700 font-num">1-Line HTML &lt;script&gt; Embed Tag</span>
            <button type="button" onclick="copySnippetCode('snippetScriptTagTop')" class="text-xs font-semibold text-neutral-900 hover:underline cursor-pointer flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Copy Embed Tag</span>
            </button>
          </div>
          <pre id="snippetScriptTagTop" class="p-3 bg-neutral-950 rounded-xl text-neutral-100 font-mono text-[11px] overflow-x-auto code-scroll">&lt;script src="${origin}/sdk/ultrademon.js" data-key="YOUR_API_KEY" async&gt;&lt;/script&gt;</pre>
        </div>
      </div>

      <!-- Top Analytics KPI Grid -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Live Active Visitors -->
        <div class="card-clean p-5 rounded-2xl flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">Active Right Now</span>
            <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[10px] font-num font-semibold">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>LIVE</span>
            </div>
          </div>
          <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="telemetryActiveNow">--</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Global Edge PoPs</span>
            <span class="font-bold text-neutral-900">330+ Cities</span>
          </div>
        </div>

        <!-- 24h Pageviews -->
        <div class="card-clean p-5 rounded-2xl flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">24h Pageviews</span>
            <span class="text-xs text-neutral-400 font-num">Events</span>
          </div>
          <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="telemetryPageviews">--</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Unique Visitors</span>
            <span class="font-bold text-neutral-900" id="telemetryVisitors">--</span>
          </div>
        </div>

        <!-- Avg Session Duration -->
        <div class="card-clean p-5 rounded-2xl flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">Avg Session Length</span>
            <span class="text-xs text-neutral-400 font-num">Dwell</span>
          </div>
          <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="telemetryAvgDuration">--</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>Bounce Rate</span>
            <span class="font-bold text-neutral-900" id="telemetryBounceRate">--%</span>
          </div>
        </div>

        <!-- Core Web Vitals LCP -->
        <div class="card-clean p-5 rounded-2xl flex flex-col justify-between">
          <div class="flex items-center justify-between mb-3">
            <span class="text-[10px] text-neutral-500 uppercase tracking-wider font-bold font-num">Core Web Vitals</span>
            <span id="telemetryVitalsStatus" class="font-num text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 text-neutral-600 border border-neutral-200 font-semibold">PENDING</span>
          </div>
          <div class="text-3xl font-normal font-num text-neutral-950 tracking-tight" id="telemetryLcp">--ms</div>
          <div class="text-[11px] text-neutral-500 mt-2 font-num border-t border-neutral-100 pt-2 flex items-center justify-between">
            <span>CLS Score</span>
            <span class="font-bold text-neutral-900" id="telemetryCls">--</span>
          </div>
        </div>
      </div>

      <!-- Autonomous Customer Profile (ICP Engine) Card — Special Feature PostHog Doesn't Have -->
      <div class="card-clean p-6 sm:p-8 rounded-3xl border-2 border-neutral-900 relative overflow-hidden bg-white shadow-sm">
        <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-100">
          <div>
            <div class="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-neutral-900 text-white text-[10px] font-num font-bold tracking-wider uppercase mb-2">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Autonomous ICP Engine · Exclusive Advantage vs PostHog</span>
            </div>
            <h2 class="text-xl sm:text-2xl font-normal tracking-tight text-neutral-950">
              Ideal Customer Profile: <span id="icpPersonaTitle" class="font-serif font-bold italic">Synthesizing...</span>
            </h2>
            <p id="icpArchetype" class="text-xs text-neutral-500 mt-1 font-num">
              Clustering recurring visitors, high-affinity traits, and conversion patterns across edge telemetry.
            </p>
          </div>
          <div class="flex flex-wrap items-center gap-3 flex-shrink-0">
            <!-- Periodic Horizon Switcher -->
            <div class="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl border border-neutral-200">
              <button type="button" id="icpPeriodWeekly" onclick="switchProfilePeriod('weekly')" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition text-neutral-600 hover:text-neutral-900 cursor-pointer">Weekly (7D)</button>
              <button type="button" id="icpPeriodMonthly" onclick="switchProfilePeriod('monthly')" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition bg-neutral-900 text-white shadow-xs cursor-pointer">Monthly (30D)</button>
              <button type="button" id="icpPeriodYearly" onclick="switchProfilePeriod('yearly')" class="px-3 py-1.5 text-xs font-semibold rounded-lg transition text-neutral-600 hover:text-neutral-900 cursor-pointer">Yearly (365D)</button>
            </div>
            <div class="text-right hidden sm:block pl-2 border-l border-neutral-200">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider">ICP Fit Match</div>
              <div id="icpFitScore" class="font-num text-xl font-bold text-neutral-950">--%</div>
            </div>
            <button type="button" onclick="generateFreshICPReport()" id="btnRegenerateIcp" class="px-4 py-2 rounded-xl bg-neutral-900 hover:bg-black text-white text-xs font-semibold transition cursor-pointer flex items-center gap-2 shadow-xs">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Regenerate Blueprint</span>
            </button>
          </div>
        </div>

        <!-- Persona Narrative Summary & Timeframe Badge -->
        <div class="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 mb-6">
          <div class="flex items-center justify-between mb-2">
            <div class="text-[11px] font-bold text-neutral-900 uppercase font-num tracking-wide flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
              <span>Autonomous Persona Synthesis</span>
            </div>
            <span id="icpPeriodBadge" class="text-[10px] font-num uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-neutral-200 text-neutral-800 font-semibold">Dossier Pending</span>
          </div>
          <p id="icpSummaryText" class="text-xs text-neutral-700 leading-relaxed font-sans">
            Awaiting visitor telemetry data. Embed the Sovereign Telemetry SDK snippet or emit events to /v1/analytics/capture to automatically synthesize ideal customer traits, circadian habits, and daily hardware abilities.
          </p>
        </div>

        <!-- Period Evolution & Cohort Momentum Strip -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <div class="p-3.5 rounded-xl border border-neutral-200 bg-white">
            <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Power Cluster Size</div>
            <div class="flex items-baseline gap-2">
              <span id="icpPowerCluster" class="text-sm font-bold text-neutral-950 font-num">0 Users</span>
              <span id="icpGrowthTrend" class="text-[11px] font-num font-bold text-neutral-400">--</span>
            </div>
            <div class="text-[10px] text-neutral-400 font-num mt-0.5">Recurring core power cohort</div>
          </div>
          <div class="p-3.5 rounded-xl border border-neutral-200 bg-white">
            <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Repeat Visitor Ratio</div>
            <div class="flex items-baseline gap-2">
              <span id="icpRepeatRate" class="text-sm font-bold text-neutral-950 font-num">0% Repeat Rate</span>
              <span id="icpRetentionTrend" class="text-[11px] font-num font-bold text-neutral-400">--</span>
            </div>
            <div class="text-[10px] text-neutral-400 font-num mt-0.5">&ge;2 distinct multi-session visits</div>
          </div>
          <div class="p-3.5 rounded-xl border border-neutral-200 bg-white">
            <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Avg Dwell Velocity</div>
            <div class="flex items-baseline gap-2">
              <span id="icpAvgDwell" class="text-sm font-bold text-neutral-950 font-num">0m Avg Dwell</span>
              <span id="icpDwellTrend" class="text-[11px] font-num font-bold text-neutral-400">--</span>
            </div>
            <div class="text-[10px] text-neutral-400 font-num mt-0.5">Continuous workbench engagement</div>
          </div>
          <div class="p-3.5 rounded-xl border border-neutral-200 bg-white">
            <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Cohort Momentum</div>
            <div id="icpVelocityLabel" class="text-xs font-bold text-neutral-950 mt-1">Awaiting Traffic</div>
            <div class="text-[10px] text-neutral-400 font-num mt-0.5">High retention stability factor</div>
          </div>
        </div>

        <!-- Daily Abilities & Hardware Arsenal Matrix -->
        <div class="border-t border-neutral-100 pt-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="text-[10px] font-bold text-neutral-500 uppercase font-num tracking-wider">Physical Hardware &amp; Execution Environment</div>
              <h3 class="text-sm font-bold text-neutral-950">Daily Abilities &amp; Hardware Arsenal</h3>
            </div>
            <span class="text-[10px] text-neutral-400 font-num uppercase">Inferred Silicon Telemetry</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Silicon Architecture &amp; GPU</div>
              <div id="icpAbilitySilicon" class="text-xs font-bold text-neutral-950 mb-0.5 font-num">--</div>
              <div class="text-[11px] text-neutral-500 leading-tight">Hardware acceleration, compute silicon tier.</div>
            </div>
            <div class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Compute Concurrency</div>
              <div id="icpAbilityCores" class="text-xs font-bold text-neutral-950 mb-0.5 font-num">--</div>
              <div class="text-[11px] text-neutral-500 leading-tight">Hardware execution concurrency and physical CPU cores.</div>
            </div>
            <div class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Unified RAM Capacity</div>
              <div id="icpAbilityRam" class="text-xs font-bold text-neutral-950 mb-0.5 font-num">--</div>
              <div class="text-[11px] text-neutral-500 leading-tight">Device RAM capacity and memory pressure ceiling.</div>
            </div>
            <div class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Visual Fidelity &amp; Theme</div>
              <div id="icpAbilityDisplay" class="text-xs font-bold text-neutral-950 mb-0.5 font-num">--</div>
              <div class="text-[11px] text-neutral-500 leading-tight">Device pixel ratio, screen density, and dark/light preference.</div>
            </div>
            <div class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Target Dev Stack &amp; Runtimes</div>
              <div id="icpAbilityRuntimes" class="text-xs font-bold text-neutral-950 mb-0.5 font-num">--</div>
              <div class="text-[11px] text-neutral-500 leading-tight">Browser engines, IDE user agents, and client runtimes.</div>
            </div>
            <div class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Network &amp; Latency Affinity</div>
              <div id="icpAbilityNetwork" class="text-xs font-bold text-neutral-950 mb-0.5 font-num">--</div>
              <div class="text-[11px] text-neutral-500 leading-tight">Connection latency, protocol version, and Anycast edge hop.</div>
            </div>
          </div>
        </div>

        <!-- Daily Habits & Circadian Rhythm Analysis -->
        <div class="border-t border-neutral-100 pt-6 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <div class="text-[10px] font-bold text-neutral-500 uppercase font-num tracking-wider">Chronobiology &amp; Behavioral Kinetics</div>
              <h3 class="text-sm font-bold text-neutral-950">Daily Habits &amp; Circadian Rhythm</h3>
            </div>
            <span class="text-[10px] text-neutral-400 font-num uppercase">Interaction Kinetics</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <div class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Circadian Rhythm &amp; Peak Hours</div>
              <div id="icpHabitCircadian" class="text-xs font-bold text-neutral-950 mb-1 font-num">--</div>
              <div id="icpHabitPeakWindow" class="text-[11px] text-neutral-600 leading-tight mb-2 font-num">Awaiting data</div>
              <div class="text-[10px] text-neutral-400 font-num">Deep work execution window aligned with high-frequency deployments.</div>
            </div>
            <div class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Deep Flow State Focus Index</div>
              <div id="icpHabitFlowIndex" class="text-xs font-bold text-neutral-950 mb-1 font-num">--</div>
              <div id="icpHabitActiveIdle" class="text-[11px] text-neutral-600 leading-tight mb-2 font-num">Awaiting data</div>
              <div id="icpHabitDwellDuration" class="text-[10px] text-neutral-400 font-num">Uninterrupted focus duration per session.</div>
            </div>
            <div class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Multitasking Cadence</div>
              <div id="icpHabitMultitask" class="text-xs font-bold text-neutral-950 mb-1 font-num">--</div>
              <div class="text-[11px] text-neutral-600 leading-tight mb-2">Tab switches and cross-window transitions.</div>
              <div id="icpHabitFrustration" class="text-[10px] text-neutral-400 font-num">Rage click and fluency detection.</div>
            </div>
            <div class="p-3.5 rounded-xl border border-neutral-200 bg-neutral-50/50">
              <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">Cross-Device Handover</div>
              <div class="text-xs font-bold text-neutral-950 mb-1">--</div>
              <div id="icpHabitHandover" class="text-[11px] text-neutral-600 leading-tight mb-2">Cross-platform workflow transitions.</div>
              <div class="text-[10px] text-neutral-400 font-num">Mobile vs desktop triage handover pattern.</div>
            </div>
          </div>
        </div>

        <!-- 4 Key Common Traits Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6" id="icpTraitsGrid">
          <div class="p-4 rounded-xl border border-neutral-200 bg-white">
            <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">1. Technical Stack</div>
            <div id="icpTraitTech" class="text-xs font-bold text-neutral-950 mb-1">--</div>
            <div id="icpTraitTechSub" class="text-[11px] text-neutral-500 leading-tight">High affinity platforms and developer tools.</div>
          </div>
          <div class="p-4 rounded-xl border border-neutral-200 bg-white">
            <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">2. Geographic Density</div>
            <div id="icpTraitGeo" class="text-xs font-bold text-neutral-950 mb-1">--</div>
            <div id="icpTraitGeoSub" class="text-[11px] text-neutral-500 leading-tight">Concentrated tech hubs and edge colocation density.</div>
          </div>
          <div class="p-4 rounded-xl border border-neutral-200 bg-white">
            <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">3. Discovery Catalyst</div>
            <div id="icpTraitOrigin" class="text-xs font-bold text-neutral-950 mb-1">--</div>
            <div id="icpTraitOriginSub" class="text-[11px] text-neutral-500 leading-tight">Top referrers and organic acquisition channels.</div>
          </div>
          <div class="p-4 rounded-xl border border-neutral-200 bg-white">
            <div class="text-[10px] text-neutral-400 font-num uppercase tracking-wider mb-1">4. Stickiness Driver</div>
            <div id="icpTraitDriver" class="text-xs font-bold text-neutral-950 mb-1">--</div>
            <div id="icpTraitDriverSub" class="text-[11px] text-neutral-500 leading-tight">Key activation actions that correlate with long-term retention.</div>
          </div>
        </div>

        <!-- Actionable Recommendations Playbook -->
        <div class="border-t border-neutral-100 pt-5">
          <div class="text-xs font-bold text-neutral-950 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>Actionable Growth Playbook to Acquire 10x More Ideal Customers</span>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-3" id="icpPlaybookGrid">
            <div class="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center text-xs text-neutral-400 col-span-1 md:col-span-3">
              Actionable playbook recommendations will automatically synthesize once customer traffic is recorded.
            </div>
          </div>
        </div>
      </div>

      <!-- 2-Column Reports Breakdown (Pages & Referrers) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Top Pages Table -->
        <div class="card-clean p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-neutral-950">Top Visited Pages</h3>
            <span class="text-[10px] text-neutral-400 font-num uppercase">Path / Dwell</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead>
                <tr class="border-b border-neutral-200 text-neutral-500 font-num">
                  <th class="pb-2 font-medium">Path</th>
                  <th class="pb-2 font-medium text-right">Views</th>
                  <th class="pb-2 font-medium text-right">Visitors</th>
                  <th class="pb-2 font-medium text-right">Avg Dwell</th>
                </tr>
              </thead>
              <tbody id="telemetryPagesTableBody" class="divide-y divide-neutral-100 font-num">
                <tr><td colspan="4" class="py-4 text-center text-neutral-400">No page views recorded yet.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Traffic Origins & Referrers Table -->
        <div class="card-clean p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-neutral-950">Traffic Origins &amp; Referrers</h3>
            <span class="text-[10px] text-neutral-400 font-num uppercase">Source / Cohort</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead>
                <tr class="border-b border-neutral-200 text-neutral-500 font-num">
                  <th class="pb-2 font-medium">Referring Domain</th>
                  <th class="pb-2 font-medium text-right">Visits</th>
                  <th class="pb-2 font-medium text-right">Unique Users</th>
                </tr>
              </thead>
              <tbody id="telemetryReferrersTableBody" class="divide-y divide-neutral-100 font-num">
                <tr><td colspan="3" class="py-4 text-center text-neutral-400">No referrers recorded yet.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 2-Column Reports Breakdown (Geographic & Devices) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Geographic Footprint -->
        <div class="card-clean p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-neutral-950">Geographic &amp; Edge PoP Footprint</h3>
            <span class="text-[10px] text-neutral-400 font-num uppercase">Anycast PoPs</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead>
                <tr class="border-b border-neutral-200 text-neutral-500 font-num">
                  <th class="pb-2 font-medium">Location</th>
                  <th class="pb-2 font-medium">Edge PoP</th>
                  <th class="pb-2 font-medium text-right">Events</th>
                  <th class="pb-2 font-medium text-right">Visitors</th>
                </tr>
              </thead>
              <tbody id="telemetryGeoTableBody" class="divide-y divide-neutral-100 font-num">
                <tr><td colspan="4" class="py-4 text-center text-neutral-400">No geo telemetry recorded yet.</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Devices & Operating Systems -->
        <div class="card-clean p-6 rounded-2xl space-y-4">
          <div class="flex items-center justify-between">
            <h3 class="text-sm font-bold text-neutral-950">Devices &amp; Platforms</h3>
            <span class="text-[10px] text-neutral-400 font-num uppercase">OS / Browser</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-xs text-left">
              <thead>
                <tr class="border-b border-neutral-200 text-neutral-500 font-num">
                  <th class="pb-2 font-medium">Platform</th>
                  <th class="pb-2 font-medium">Browser</th>
                  <th class="pb-2 font-medium">Device</th>
                  <th class="pb-2 font-medium text-right">Events</th>
                </tr>
              </thead>
              <tbody id="telemetryDevicesTableBody" class="divide-y divide-neutral-100 font-num">
                <tr><td colspan="4" class="py-4 text-center text-neutral-400">No devices recorded yet.</td></tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Insane Micro-Metrics & Kinetic Dwell Telemetry -->
      <div class="card-clean p-6 rounded-2xl space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-neutral-950">Insane Micro-Metrics &amp; Kinetic Dwell Telemetry</h3>
              <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-neutral-900 text-white font-num">Sub-Millisecond Edge</span>
            </div>
            <p class="text-xs text-neutral-500 mt-0.5">Captures micro-metrics invisible to conventional trackers: active cursor interaction vs idle dwell, unmasked GPU silicon, battery telemetry, and Retina density.</p>
          </div>
          <div class="flex items-center gap-2 text-xs font-num flex-wrap">
            <span class="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-semibold border border-neutral-200/60" id="insaneAvgCores">-- Cores Avg</span>
            <span class="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-semibold border border-neutral-200/60" id="insaneAvgRam">-- GB RAM</span>
            <span class="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-semibold border border-neutral-200/60" id="insaneRetinaPct">--% Retina</span>
            <span class="px-2.5 py-1 rounded-lg bg-neutral-100 text-neutral-800 font-semibold border border-neutral-200/60" id="insaneDarkModePct">--% Dark Mode</span>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- User Kinetic Interaction & Activity Breakdown -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-neutral-900 font-num">Kinetic Interaction &amp; Inactive Dwell</span>
              <span class="text-[10px] text-neutral-400 font-num uppercase">Interaction Modes</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="border-b border-neutral-200 text-neutral-500 font-num">
                    <th class="pb-2 font-medium">Activity Classification</th>
                    <th class="pb-2 font-medium text-right">Active Dwell</th>
                    <th class="pb-2 font-medium text-right">Idle Dwell</th>
                    <th class="pb-2 font-medium text-right">Idle Ratio</th>
                    <th class="pb-2 font-medium text-right">Events</th>
                  </tr>
                </thead>
                <tbody id="insaneActivityTableBody" class="divide-y divide-neutral-100 font-num">
                  <tr><td colspan="5" class="py-4 text-center text-neutral-400">No kinetic activity recorded yet.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Unmasked GPU Fleet & Silicon Architecture -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-neutral-900 font-num">Unmasked GPU Silicon Fleet</span>
              <span class="text-[10px] text-neutral-400 font-num uppercase">WebGL Direct Debug</span>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="border-b border-neutral-200 text-neutral-500 font-num">
                    <th class="pb-2 font-medium">GPU Silicon / Renderer</th>
                    <th class="pb-2 font-medium text-right">Visitors</th>
                    <th class="pb-2 font-medium text-right">Adoption</th>
                  </tr>
                </thead>
                <tbody id="insaneGpuTableBody" class="divide-y divide-neutral-100 font-num">
                  <tr><td colspan="3" class="py-4 text-center text-neutral-400">No GPU telemetry recorded yet.</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <!-- VIP Client & Specific IP Tracing Engine -->
      <div class="card-clean p-6 rounded-2xl space-y-6">
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-100 pb-4">
          <div>
            <div class="flex items-center gap-2">
              <h3 class="text-sm font-bold text-neutral-950">VIP Client &amp; Specific IP Tracing Engine</h3>
              <span class="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 font-num">Enterprise Watchlist</span>
            </div>
            <p class="text-xs text-neutral-500 mt-0.5">Track specific high-value IP addresses, target accounts, or individual high-paying clients with custom API keys and real-time micro-trace telemetry.</p>
          </div>
          <div class="flex items-center gap-2">
            <button type="button" onclick="loadVipWatchTargets(); loadVipLiveTraces();" class="text-xs font-semibold px-3 py-1.5 rounded-lg border border-neutral-200 hover:bg-neutral-50 text-neutral-700 cursor-pointer transition flex items-center gap-1.5 font-num">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
              <span>Refresh Watchlist</span>
            </button>
          </div>
        </div>

        <!-- Add Watch Target Form -->
        <form onsubmit="event.preventDefault(); handleCreateVipTarget(event); return false;" class="bg-neutral-50/70 border border-neutral-200/80 p-4 rounded-xl space-y-3">
          <div class="text-xs font-bold text-neutral-800 font-num">Add Specific Client or IP Address to Watchlist</div>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <div>
              <label class="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Target Type</label>
              <select id="vipTargetType" class="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black">
                <option value="ip">IP Address</option>
                <option value="distinct_id">Distinct User ID</option>
                <option value="email">Client Email</option>
              </select>
            </div>
            <div class="sm:col-span-2">
              <label class="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Target Identifier (e.g. 203.0.113.88 or usr_enterprise)</label>
              <input id="vipTargetValue" type="text" placeholder="203.0.113.88" required class="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black font-mono" />
            </div>
            <div>
              <label class="block text-[10px] font-semibold text-neutral-500 uppercase tracking-wider mb-1">Client Label / Account</label>
              <input id="vipTargetLabel" type="text" placeholder="Acme Corp ($50k ARR)" class="w-full px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-lg text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black" />
            </div>
          </div>
          <div class="flex items-center justify-between pt-1">
            <span class="text-[11px] text-neutral-500">Matching visitors are automatically flagged on edge ingest and written to high-res micro-traces.</span>
            <button type="button" onclick="handleCreateVipTarget(event); return false;" id="btnCreateVipTarget" class="px-4 py-1.5 rounded-lg bg-neutral-950 text-white hover:bg-neutral-800 text-xs font-semibold cursor-pointer transition flex items-center gap-1.5 shadow-sm">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
              <span>Add Watch Target</span>
            </button>
          </div>
        </form>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <!-- Active Watched Targets Table -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-xs font-bold text-neutral-900 font-num">Active Watched Targets</span>
              <span class="text-[10px] text-neutral-400 font-num uppercase">Priority Watchlist</span>
            </div>
            <div class="overflow-x-auto border border-neutral-200/80 rounded-xl bg-white">
              <table class="w-full text-xs text-left">
                <thead>
                  <tr class="bg-neutral-50/70 border-b border-neutral-200 text-neutral-500 font-num">
                    <th class="p-2.5 font-medium">Target</th>
                    <th class="p-2.5 font-medium">Client / Label</th>
                    <th class="p-2.5 font-medium text-right">Hits Traced</th>
                    <th class="p-2.5 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody id="vipTargetsTableBody" class="divide-y divide-neutral-100 font-num">
                  <tr><td colspan="4" class="p-4 text-center text-neutral-400">No watched VIP clients registered.</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Real-Time VIP Client Trace Feed -->
          <div class="space-y-3">
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <span class="text-xs font-bold text-neutral-900 font-num">Live VIP Client Micro-Trace Stream</span>
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              </div>
              <span class="text-[10px] text-neutral-400 font-num uppercase">Sub-5ms Edge Ingest</span>
            </div>
            <div id="vipLiveTracesContainer" class="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              <div class="p-4 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl">No live traces recorded yet. Active VIP events will appear here in real time.</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 1-Line Embed Snippet & Integration Box -->
      <div class="card-clean p-6 rounded-2xl space-y-4">
        <div class="flex items-center justify-between">
          <div>
            <h3 class="text-sm font-bold text-neutral-950">Integration Snippet (Embed in Any Website or App)</h3>
            <p class="text-xs text-neutral-500 mt-0.5">Drop this lightweight 2.5KB script into your HTML &lt;head&gt; or install via npm/python to track visitors and synthesize customer profiles automatically.</p>
          </div>
        </div>

        <!-- HTML Snippet -->
        <div>
          <div class="flex items-center justify-between mb-1.5">
            <span class="text-[11px] font-bold text-neutral-700 font-num">1-Line HTML &lt;script&gt; Embed</span>
            <button type="button" onclick="copySnippetCode('snippetScriptTag')" class="text-xs font-semibold text-neutral-900 hover:underline cursor-pointer flex items-center gap-1">
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
              <span>Copy Embed Tag</span>
            </button>
          </div>
          <pre id="snippetScriptTag" class="p-3 bg-neutral-950 rounded-xl text-neutral-100 font-mono text-[11px] overflow-x-auto code-scroll">&lt;script src="${origin}/sdk/ultrademon.js" data-key="YOUR_API_KEY" async&gt;&lt;/script&gt;</pre>
        </div>

        <!-- Node & Python Snippets (Grid) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div>
            <span class="text-[11px] font-bold text-neutral-700 font-num block mb-1">TypeScript / React / Next.js SDK</span>
            <pre class="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 font-mono text-[10px] overflow-x-auto code-scroll">// Track custom actions &amp; identify users
window.ultrademon.track('created_project', { plan: 'pro' });
window.ultrademon.identify('usr_9281', { email: 'ceo@startup.com' });</pre>
          </div>
          <div>
            <span class="text-[11px] font-bold text-neutral-700 font-num block mb-1">Python Backend Telemetry</span>
            <pre class="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-800 font-mono text-[10px] overflow-x-auto code-scroll">import requests
requests.post("${origin}/v1/analytics/capture", json={
    "api_key": "YOUR_API_KEY",
    "event_name": "pipeline_complete",
    "distinct_id": "usr_9281"
})</pre>
          </div>
        </div>
      </div>
    </section>

  </main>

  <!-- Floating Minimalist Toast Notifications -->
  <div id="appToastContainer" class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none"></div>

  <!-- Client-side Workspace Script -->
  <script>
    const ORIGIN = "${origin}";
    const STORAGE_KEY = 'ultrasearch_local_keys';

    let currentSessionToken = null;
    let currentUser = null;
    let localKeys = [];

    // Immediate synchronous hydration from local storage (<0.5ms)
    try {
      let userCached = JSON.parse(localStorage.getItem('ultrademon_user') || 'null');
      if (!userCached || !userCached.email) {
        for (let i = 0; i < localStorage.length; i++) {
          const k = localStorage.key(i);
          if (k && (k.startsWith('sb-') || k.includes('supabase')) && k.endsWith('-auth-token')) {
            try {
              const sbData = JSON.parse(localStorage.getItem(k) || '{}');
              const sbUser = sbData.user || sbData.currentSession?.user || sbData.session?.user;
              if (sbUser && (sbUser.email || sbUser.id)) {
                userCached = {
                  id: sbUser.id,
                  email: sbUser.email || sbUser.id,
                  plan: 'free'
                };
                localStorage.setItem('ultrademon_user', JSON.stringify(userCached));
                break;
              }
            } catch {}
          }
        }
      }
      if (userCached) {
        currentUser = userCached;
        const emailEl = document.getElementById('userEmailDisplay');
        const planEl = document.getElementById('userPlanBadge');
        if (emailEl) emailEl.innerText = userCached.email || userCached.id || 'Active Workspace';
        if (planEl && userCached.plan) planEl.innerText = (userCached.plan || 'free').toUpperCase();
      }
    } catch {}

    // Immediate synchronous hydration from local storage (<0.5ms)
    try {
      const userCached = JSON.parse(localStorage.getItem('ultrademon_user') || 'null');
      if (userCached) {
        currentUser = userCached;
        const emailEl = document.getElementById('userEmailDisplay');
        const planEl = document.getElementById('userPlanBadge');
        if (emailEl) emailEl.innerText = userCached.email || userCached.id || 'Active Workspace';
        if (planEl && userCached.plan) planEl.innerText = userCached.plan.toUpperCase();
      }
    } catch {}

    // Sleek, non-blocking notification toast
    function showAppToast(msg, isError = false) {
      const container = document.getElementById('appToastContainer');
      if (!container) return;
      const toast = document.createElement('div');
      toast.className = 'px-4 py-2.5 rounded-xl text-xs font-semibold shadow-xl border pointer-events-auto transition-all duration-300 transform translate-y-2 opacity-0 ' +
        (isError ? 'bg-neutral-900 text-red-400 border-red-900' : 'bg-neutral-950 text-white border-neutral-800');
      toast.innerText = msg;
      container.appendChild(toast);
      requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
      });
      setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-y-2');
        setTimeout(() => toast.remove(), 300);
      }, 2600);
    }

    function getAuthToken() {
      // 0. Check URL hash for Supabase access_token (e.g. from email verification link or OAuth redirect)
      try {
        const hash = window.location.hash.substring(1);
        if (hash) {
          const hashParams = new URLSearchParams(hash);
          const hashToken = hashParams.get('access_token');
          if (hashToken) {
            localStorage.setItem('ultrademon_auth_session', JSON.stringify({ access_token: hashToken }));
            try {
              const cleanUrl = window.location.pathname + window.location.search;
              window.history.replaceState(null, '', cleanUrl);
            } catch {}
            return hashToken;
          }
        }
        const searchParams = new URLSearchParams(window.location.search);
        const qToken = searchParams.get('access_token') || searchParams.get('token');
        if (qToken) {
          localStorage.setItem('ultrademon_auth_session', JSON.stringify({ access_token: qToken }));
          return qToken;
        }
      } catch {}

      // 1. Direct Edge Session in ultrademon_auth_session
      const sess = localStorage.getItem('ultrademon_auth_session');
      if (sess) {
        try {
          const parsed = JSON.parse(sess);
          if (parsed && parsed.access_token) return parsed.access_token;
        } catch {}
      }

      // 2. Check Supabase auth token keys (sb-*-auth-token)
      try {
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('sb-') && key.endsWith('-auth-token')) {
            const parsed = JSON.parse(localStorage.getItem(key) || '{}');
            if (parsed && parsed.access_token) return parsed.access_token;
          }
        }
      } catch {}

      // 3. Fallback to active plain API key if available
      const activeKey = localStorage.getItem('ultrademon_active_key');
      if (activeKey) return activeKey;

      return null;
    }

    // Auto-initialize sovereign guest workspace if unauthenticated
    async function initGuestSession() {
      try {
        const res = await fetch('/v1/auth/anonymous', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'free' })
        });
        const data = await res.json();
        if (data.session && data.session.access_token) {
          localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session));
          localStorage.setItem('ultrademon_user', JSON.stringify(data.user));
          if (data.initial_key) {
            localStorage.setItem('ultrademon_active_key', data.initial_key);
            const saved = JSON.parse(localStorage.getItem('ultrademon_saved_plain_keys') || '{}');
            saved['primary_' + data.user.id] = data.initial_key;
            localStorage.setItem('ultrademon_saved_plain_keys', JSON.stringify(saved));
          }
          currentUser = data.user;
          const emailDisplay = document.getElementById('userEmailDisplay');
          const planBadge = document.getElementById('userPlanBadge');
          if (emailDisplay) emailDisplay.innerText = data.user.email || data.user.id || 'Active Workspace';
          if (planBadge) planBadge.innerText = (data.user.plan || 'free').toUpperCase();
          return data.session.access_token;
        }
      } catch (err) {
        console.warn('Anonymous session init non-fatal:', err);
      }
      return null;
    }

    function getActiveKey() {
      const direct = localStorage.getItem('ultrademon_active_key');
      if (direct) return direct;

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
      }
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = 'Bearer ' + token;
      }
      return headers;
    }

    function copyToClipboard(text) {
      if (!text) return;
      navigator.clipboard.writeText(text);
      showAppToast('Copied to clipboard');
    }

    function copyActiveKey() {
      const k = getActiveKey();
      if (k) {
        copyToClipboard(k);
      } else {
        showAppToast('No active key selected', true);
      }
    }

    function switchSuite(suite) {
      if (suite === 'overview') setAppView('overview');
      else if (suite === 'search') setAppView('search');
      else if (suite === 'memory') setAppView('memory');
      else if (suite === 'metrics') setAppView('analytics');
    }

    function updateSuiteSwitcher(suite) {
      const suites = ['overview', 'search', 'memory', 'metrics'];
      suites.forEach(s => {
        const btn = document.getElementById('suiteBtn-' + s);
        if (!btn) return;
        if (s === suite) {
          btn.className = 'suite-tab-btn flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer bg-white text-neutral-950 shadow-xs border border-neutral-300';
          const svg = btn.querySelector('svg');
          if (svg) svg.className = 'w-3.5 h-3.5 text-neutral-950';
        } else {
          btn.className = 'suite-tab-btn flex-1 py-2.5 px-3 sm:px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer text-neutral-600 hover:text-black hover:bg-white/60 border border-transparent';
          const svg = btn.querySelector('svg');
          if (svg) svg.className = 'w-3.5 h-3.5 text-neutral-400';
        }
      });
    }

    function setAppView(viewId) {
      const views = ['overview', 'keys', 'memory', 'search', 'crawler', 'membership', 'integrations', 'analytics'];
      views.forEach(id => {
        const viewEl = document.getElementById('view-' + id);
        if (viewEl) {
          if (id === viewId) {
            viewEl.classList.remove('hidden');
            viewEl.style.display = 'block';
          } else {
            viewEl.classList.add('hidden');
            viewEl.style.display = 'none';
          }
        }

        const navBtn = document.getElementById('nav-' + id);
        if (navBtn) {
          const svg = navBtn.querySelector('svg');
          if (id === viewId) {
            navBtn.classList.add('bg-black', 'text-white');
            navBtn.classList.remove('text-neutral-600', 'hover:bg-neutral-100', 'hover:text-black');
            if (svg) svg.classList.remove('text-neutral-400');
          } else {
            navBtn.classList.remove('bg-black', 'text-white');
            navBtn.classList.add('text-neutral-600', 'hover:bg-neutral-100', 'hover:text-black');
            if (svg) svg.classList.add('text-neutral-400');
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
        analytics: ['Telemetry & ICP Engine', 'PostHog-competitive edge analytics with autonomous Ideal Customer Profile synthesis.'],
      };
      if (titles[viewId]) {
        const t = document.getElementById('viewHeaderTitle');
        const d = document.getElementById('viewHeaderDesc');
        if (t) t.innerText = titles[viewId][0];
        if (d) d.innerText = titles[viewId][1];
      }

      if (viewId === 'overview') {
        updateSuiteSwitcher('overview');
      } else if (viewId === 'search' || viewId === 'crawler') {
        updateSuiteSwitcher('search');
      } else if (viewId === 'memory') {
        updateSuiteSwitcher('memory');
      } else if (viewId === 'analytics') {
        updateSuiteSwitcher('metrics');
      } else {
        updateSuiteSwitcher(null);
      }

      try {
        const u = new URL(window.location.href);
        u.searchParams.set('tab', viewId);
        window.history.replaceState(null, '', u.toString());
      } catch {}

      if (viewId === 'analytics') {
        loadAnalyticsDashboard();
      } else if (viewId === 'keys' || viewId === 'overview') {
        loadRealtimeKeyMetrics(false);
      }

      updateAllSuiteSnippets();

      if (window.innerWidth < 1024) {
        document.querySelector('main')?.scrollIntoView({ behavior: 'smooth' });
      }
    }

    async function quickCreateSuiteKey(suiteType) {
      const plan = 'free';
      const keyType = suiteType === 'search' ? 'search' : suiteType === 'memory' ? 'memory' : 'telemetry';
      const label = suiteType === 'search' ? 'UltraSearch API Key' : suiteType === 'memory' ? 'UltraMemory API Key' : 'UltraMetrics Telemetry Key';

      let token = getAuthToken();
      if (!token) token = await initGuestSession();

      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const res = await fetch('/v1/keys', {
          method: 'POST',
          headers,
          body: JSON.stringify({ plan, key_type: keyType, label })
        });
        const data = await res.json();
        if (data.plain_key) {
          const saved = JSON.parse(localStorage.getItem('ultrademon_saved_plain_keys') || '{}');
          saved[data.key_id] = data.plain_key;
          localStorage.setItem('ultrademon_saved_plain_keys', JSON.stringify(saved));
          localStorage.setItem('ultrademon_active_key', data.plain_key);

          localKeys.unshift({
            key_id: data.key_id,
            plain_key: data.plain_key,
            plan: data.plan || plan,
            key_type: data.key_type || keyType,
            label: data.label || label,
            created_at: Date.now()
          });

          renderAppKeysTable();
          updateAllSuiteSnippets();
          showAppToast('Created ' + label + ': ' + data.plain_key.slice(0, 14) + '...');
        } else {
          showAppToast('Error: ' + (data.error || 'Failed to create key'), true);
        }
      } catch (err) {
        showAppToast('Network error: ' + err.message, true);
      }
    }

    function updateAllSuiteSnippets() {
      const activeKey = getActiveKey() || 'YOUR_API_KEY';
      const NL = String.fromCharCode(10);
      const DQ = String.fromCharCode(34);
      const Q = String.fromCharCode(39);

      // Search snippets
      const sTs = document.getElementById('searchTsSnippet');
      if (sTs) {
        sTs.innerText = [
          "import { UltraSearch } from " + Q + "@ultrademon/sdk" + Q + ";",
          "",
          "const search = new UltraSearch({ apiKey: " + Q + activeKey + Q + " });",
          "const { results, latency_ms } = await search.query(" + Q + "LLM edge retrieval" + Q + ", {",
          "  mode: 1 // 1: Instant <50ms, 2: Standard, 3: Deep",
          "});"
        ].join(NL);
      }
      const sPy = document.getElementById('searchPySnippet');
      if (sPy) {
        sPy.innerText = [
          "import requests",
          "",
          "url = " + DQ + ORIGIN + "/v1/search" + DQ,
          "headers = {" + DQ + "X-API-Key" + DQ + ": " + DQ + activeKey + DQ + "}",
          "params = {" + DQ + "q" + DQ + ": " + DQ + "LLM edge retrieval" + DQ + ", " + DQ + "mode" + DQ + ": 1}",
          "res = requests.get(url, params=params, headers=headers).json()",
          "print(" + DQ + "Results:" + DQ + ", res)"
        ].join(NL);
      }

      // Memory snippet
      const mQuick = document.getElementById('memQuickSnippet');
      if (mQuick) {
        const payload = JSON.stringify({ content: "User prefers monochrome UI", container_tag: "agent_prod" });
        mQuick.innerText = [
          "# 1. Store memory from autonomous agent",
          "curl -X POST " + DQ + ORIGIN + "/v1/memory" + DQ + " -H " + DQ + "X-API-Key: " + activeKey + DQ + " -H " + DQ + "Content-Type: application/json" + DQ + " -d " + Q + payload + Q,
          "",
          "# 2. Recall memory in <15ms",
          "curl " + DQ + ORIGIN + "/v1/memory/recall?q=user+preferences&container_tag=agent_prod" + DQ + " -H " + DQ + "X-API-Key: " + activeKey + DQ
        ].join(NL);
      }

      // Telemetry embed snippets
      const tScriptTop = document.getElementById('snippetScriptTagTop');
      if (tScriptTop) {
        tScriptTop.innerText = '<script src="' + ORIGIN + '/sdk/ultrademon.js" data-key="' + activeKey + '" async><' + '/script>';
      }
      const tScript = document.getElementById('snippetScriptTag');
      if (tScript) {
        tScript.innerText = '<script src="' + ORIGIN + '/sdk/ultrademon.js" data-key="' + activeKey + '" async><' + '/script>';
      }
    }

    async function emitSimulationEvent(presetType) {
      const activeKey = getActiveKey();
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;
      else if (activeKey) headers['X-API-Key'] = activeKey;

      let payload = {};
      if (presetType === 'deep_working') {
        payload = {
          event_name: 'project_deployed',
          distinct_id: 'usr_devops_pro',
          path: '/deployments/production',
          url: 'https://ultrademon.com/deployments/production',
          active_time_ms: 65000,
          idle_time_ms: 12000,
          idle_ratio_pct: 15,
          primary_activity: 'deep_working',
          gpu_renderer: 'Apple M3 Max (38 cores)',
          hardware_concurrency: 16,
          device_memory_gb: 64,
          battery_level: 0.95,
          battery_charging: 1,
          pixel_ratio: 2.0,
          dark_mode: 1
        };
      } else if (presetType === 'vip_client') {
        payload = {
          client_ip: '198.51.100.77',
          distinct_id: 'usr_vip_enterprise_82',
          event_name: 'contract_annual_upgrade',
          path: '/checkout/enterprise',
          url: 'https://ultrademon.com/checkout/enterprise',
          active_time_ms: 95000,
          idle_time_ms: 15000,
          idle_ratio_pct: 13,
          primary_activity: 'deep_working',
          gpu_renderer: 'Apple M3 Pro',
          hardware_concurrency: 14,
          device_memory_gb: 36,
          battery_level: 1.0,
          battery_charging: 1,
          pixel_ratio: 2.0,
          dark_mode: 1
        };
      } else if (presetType === 'idle_lurking') {
        payload = {
          event_name: 'documentation_browse',
          distinct_id: 'usr_lurker_44',
          path: '/docs/edge-retrieval',
          url: 'https://ultrademon.com/docs/edge-retrieval',
          active_time_ms: 8000,
          idle_time_ms: 75000,
          idle_ratio_pct: 90,
          primary_activity: 'idle_lurking',
          gpu_renderer: 'Intel Iris Xe Graphics',
          hardware_concurrency: 8,
          device_memory_gb: 16,
          pixel_ratio: 1.0,
          dark_mode: 0,
          rage_clicks: 3
        };
      }

      const t0 = performance.now();
      try {
        const res = await fetch('/v1/analytics/capture', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        const elapsed = Math.round(performance.now() - t0);
        const data = await res.json();

        const statusEl = document.getElementById('simulatorLastEmitStatus');
        if (statusEl) {
          statusEl.classList.remove('hidden');
          statusEl.innerText = 'Captured in ' + elapsed + 'ms (' + (data.is_vip_traced ? '[VIP TRACED]' : 'Standard') + ')';
        }

        showAppToast('Simulated event [' + payload.event_name + '] captured in ' + elapsed + 'ms!');
        loadAnalyticsDashboard();
      } catch (err) {
        showAppToast('Simulation error: ' + err.message, true);
      }
    }

    async function handleCustomSimulation(e) {
      if (e && e.preventDefault) e.preventDefault();
      const eventName = (document.getElementById('simEventName')?.value || 'custom_event').trim();
      const distinctId = (document.getElementById('simDistinctId')?.value || 'usr_custom').trim();
      const clientIp = (document.getElementById('simClientIp')?.value || '').trim();

      const activeKey = getActiveKey();
      const token = getAuthToken();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;
      else if (activeKey) headers['X-API-Key'] = activeKey;

      const payload = {
        event_name: eventName,
        distinct_id: distinctId,
        path: '/' + eventName.replace(/_/g, '-'),
        active_time_ms: 45000,
        idle_time_ms: 10000,
        idle_ratio_pct: 18,
        primary_activity: 'deep_working',
        gpu_renderer: 'Apple M3 Pro'
      };
      if (clientIp) payload.client_ip = clientIp;

      const t0 = performance.now();
      try {
        const res = await fetch('/v1/analytics/capture', {
          method: 'POST',
          headers,
          body: JSON.stringify(payload)
        });
        const elapsed = Math.round(performance.now() - t0);
        const data = await res.json();

        const statusEl = document.getElementById('simulatorLastEmitStatus');
        if (statusEl) {
          statusEl.classList.remove('hidden');
          statusEl.innerText = 'Captured in ' + elapsed + 'ms (' + (data.is_vip_traced ? '[VIP TRACED]' : 'Standard') + ')';
        }

        showAppToast('Event [' + eventName + '] emitted in ' + elapsed + 'ms!');
        loadAnalyticsDashboard();
      } catch (err) {
        showAppToast('Emission error: ' + err.message, true);
      }
    }

    async function handleAppCreateKey(e) {
      if (e && e.preventDefault) e.preventDefault();
      const plan = document.getElementById('appKeyPlan')?.value || 'free';
      const keyType = document.getElementById('appKeyType')?.value || 'memory';
      const labelInput = document.getElementById('appKeyLabel');
      const label = labelInput ? labelInput.value.trim() : '';
      const spinner = document.getElementById('spinnerCreateKeyApp');

      let token = getAuthToken();
      if (!token) {
        token = await initGuestSession();
      }

      if (spinner) spinner.classList.remove('hidden');
      try {
        const headers = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = 'Bearer ' + token;

        const res = await fetch('/v1/keys', {
          method: 'POST',
          headers,
          body: JSON.stringify({ plan, key_type: keyType, label })
        });
        const data = await res.json();
        if (data.plain_key) {
          // 1. Show key in persistent alert box
          const disp = document.getElementById('newKeyDisplayApp');
          const alertBox = document.getElementById('newKeyAlertApp');
          if (disp) disp.innerText = data.plain_key;
          if (alertBox) alertBox.classList.remove('hidden');

          // 2. Persist in plain keys storage
          const saved = JSON.parse(localStorage.getItem('ultrademon_saved_plain_keys') || '{}');
          saved[data.key_id] = data.plain_key;
          localStorage.setItem('ultrademon_saved_plain_keys', JSON.stringify(saved));
          localStorage.setItem('ultrademon_active_key', data.plain_key);

          // 3. Prepend to local keys array
          localKeys.unshift({
            key_id: data.key_id,
            plain_key: data.plain_key,
            plan: data.plan || plan,
            key_type: data.key_type || keyType,
            label: data.label || label || 'Workspace Key',
            created_at: Date.now()
          });

          renderAppKeysTable();
          refreshTelemetry();
          if (labelInput) labelInput.value = '';
          showAppToast('API Key created: ' + data.plain_key.slice(0, 12) + '...');
        } else {
          showAppToast('Error: ' + (data.error || 'Failed to create key'), true);
        }
      } catch (err) {
        showAppToast('Network error: ' + err.message, true);
      } finally {
        if (spinner) spinner.classList.add('hidden');
      }
    }

    async function loadAppKeys() {
      const token = getAuthToken();
      const saved = JSON.parse(localStorage.getItem('ultrademon_saved_plain_keys') || '{}');
      const activePlain = localStorage.getItem('ultrademon_active_key') || '';

      if (token) {
        try {
          const res = await fetch('/v1/keys', {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          const data = await res.json();
          if (data.keys && Array.isArray(data.keys)) {
            localKeys = data.keys.map(k => ({
              ...k,
              plain_key: saved[k.key_id] || (activePlain && localKeys.length === 0 ? activePlain : '')
            }));
            localStorage.setItem(STORAGE_KEY, JSON.stringify(localKeys));
          }
        } catch {}
      }
      renderAppKeysTable();
    }

    function renderAppKeysTable() {
      const tbody = document.getElementById('appKeysTableBody');
      const countBadge = document.getElementById('keysCountBadge');
      const metric = document.getElementById('metricKeys');
      if (countBadge) countBadge.innerText = localKeys.length;
      if (metric) metric.innerText = localKeys.length;

      if (localKeys.length === 0) {
        if (tbody) tbody.innerHTML = '<tr><td colspan="6" class="py-4 text-center text-neutral-400">No API keys found. Generate one above!</td></tr>';
        const topLabel = document.getElementById('topActiveKeyLabel');
        if (topLabel) topLabel.innerText = 'None';
        document.getElementById('topCopyBtn')?.classList.add('hidden');
        return;
      }

      const active = localKeys[0];
      const topLabel = document.getElementById('topActiveKeyLabel');
      if (topLabel) topLabel.innerText = active.plain_key ? (active.plain_key.slice(0, 10) + '...') : active.key_id;
      document.getElementById('topCopyBtn')?.classList.remove('hidden');

      if (tbody) {
        tbody.innerHTML = localKeys.map(k => {
          const displayKey = k.plain_key || ('key_' + k.key_id);
          const isPlain = !!k.plain_key;
          const scopeBadge = k.key_type === 'memory'
            ? '<span class="px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold uppercase font-num">Memory API</span>'
            : (k.key_type === 'search'
              ? '<span class="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 text-[10px] font-bold uppercase font-num">Search API</span>'
              : (k.key_type === 'telemetry'
                ? '<span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase font-num">Telemetry</span>'
                : '<span class="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase font-num">Unified API</span>'));

          return '<tr class="hover:bg-neutral-50">' +
            '<td class="py-3 font-mono text-neutral-900">' +
              '<span class="truncate max-w-[160px] inline-block align-middle">' + displayKey + '</span>' +
              (isPlain ? ' <button type="button" onclick="copyToClipboard(&apos;' + k.plain_key + '&apos;)" class="text-neutral-400 hover:text-black cursor-pointer inline-flex items-center ml-1.5 p-1 rounded hover:bg-neutral-100" title="Copy Full Key"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg></button>' : '') +
            '</td>' +
            '<td class="py-3">' + scopeBadge + '</td>' +
            '<td class="py-3"><span class="px-2 py-0.5 rounded bg-neutral-100 text-neutral-900 text-[10px] font-bold uppercase font-num">' + (k.plan || 'free') + '</span></td>' +
            '<td class="py-3 text-neutral-600 font-sans">' + (k.label || 'Default') + '</td>' +
            '<td class="py-3 text-neutral-400 font-num">' + new Date(k.created_at || Date.now()).toLocaleDateString() + '</td>' +
            '<td class="py-3 text-right"><button type="button" onclick="revokeAppKey(&apos;' + (k.plain_key || k.key_id) + '&apos;)" class="text-neutral-400 hover:text-red-600 font-semibold cursor-pointer">Revoke</button></td>' +
          '</tr>';
        }).join('');
      }
      updateAllSuiteSnippets();
    }

    async function revokeAppKey(key) {
      if (!confirm('Are you sure you want to revoke this API key?')) return;
      const token = getAuthToken();
      const headers = {};
      if (token) headers['Authorization'] = 'Bearer ' + token;
      try {
        await fetch('/v1/keys/' + key, {
          method: 'DELETE',
          headers
        });
        showAppToast('Key revoked successfully');
        const saved = JSON.parse(localStorage.getItem('ultrademon_saved_plain_keys') || '{}');
        delete saved[key];
        localStorage.setItem('ultrademon_saved_plain_keys', JSON.stringify(saved));
        if (localStorage.getItem('ultrademon_active_key') === key) {
          localStorage.removeItem('ultrademon_active_key');
        }
        await loadAppKeys();
        await loadRealtimeKeyMetrics(true);
      } catch (err) {
        showAppToast('Revoke failed: ' + err.message, true);
      }
    }

    // ── Real-Time API Key Usage & Daily Calls Telemetry Logic ─────────────────
    let realtimeTimer = null;
    let isRealtimeAutoRefresh = true;

    async function loadRealtimeKeyMetrics(manual = false) {
      const spinner = document.getElementById('refreshKeyMetricsSpinner');
      if (manual && spinner) spinner.classList.add('animate-spin');

      try {
        const token = getAuthToken();
        const activeKey = getActiveKey();
        const headers = {};
        if (token) headers['Authorization'] = 'Bearer ' + token;
        if (activeKey) headers['X-API-Key'] = activeKey;

        const res = await fetch('/v1/keys/metrics', { headers });
        if (res.ok) {
          const data = await res.json();
          renderRealtimeMetrics(data);
        }
      } catch (err) {
        console.warn('Realtime key metrics fetch error:', err);
      } finally {
        if (manual && spinner) {
          setTimeout(() => spinner.classList.remove('animate-spin'), 300);
        }
      }
    }

    function renderRealtimeMetrics(data) {
      if (!data) return;

      const combined = data.combined_today || { total: 0, search: 0, memory: 0, metrics: 0, crawler: 0 };
      const totalCalls = combined.total || 0;
      const searchCalls = combined.search || 0;
      const memoryCalls = combined.memory || 0;
      const metricsCalls = combined.metrics || 0;

      // 1. Top KPI Cards
      const elTotal = document.getElementById('rtCombinedTotal');
      const elQuota = document.getElementById('rtCombinedQuotaPct');
      const elSearch = document.getElementById('rtCombinedSearch');
      const elSearchShare = document.getElementById('rtSearchShare');
      const elMemory = document.getElementById('rtCombinedMemory');
      const elMemoryShare = document.getElementById('rtMemoryShare');
      const elMetrics = document.getElementById('rtCombinedMetrics');
      const elMetricsShare = document.getElementById('rtMetricsShare');
      const elOverviewDaily = document.getElementById('metricUsed');

      if (elTotal) elTotal.innerText = totalCalls.toLocaleString();
      if (elSearch) elSearch.innerText = searchCalls.toLocaleString();
      if (elMemory) elMemory.innerText = memoryCalls.toLocaleString();
      if (elMetrics) elMetrics.innerText = metricsCalls.toLocaleString();
      if (elOverviewDaily) elOverviewDaily.innerText = totalCalls.toLocaleString();

      const searchSharePct = totalCalls > 0 ? Math.round((searchCalls / totalCalls) * 100) : 0;
      const memorySharePct = totalCalls > 0 ? Math.round((memoryCalls / totalCalls) * 100) : 0;
      const metricsSharePct = totalCalls > 0 ? Math.round((metricsCalls / totalCalls) * 100) : 0;

      if (elSearchShare) elSearchShare.innerText = searchSharePct + '%';
      if (elMemoryShare) elMemoryShare.innerText = memorySharePct + '%';
      if (elMetricsShare) elMetricsShare.innerText = metricsSharePct + '%';

      // Estimate quota percentage across keys
      let totalDailyQuota = 0;
      if (Array.isArray(data.keys)) {
        for (const k of data.keys) {
          if (typeof k.daily_limit === 'number' && k.daily_limit > 0) {
            totalDailyQuota += k.daily_limit;
          }
        }
      }
      if (totalDailyQuota > 0 && elQuota) {
        const pct = Math.min(100, Math.round((totalCalls / totalDailyQuota) * 100));
        elQuota.innerText = pct + '% (' + totalCalls + ' / ' + totalDailyQuota + ')';
      } else if (elQuota) {
        elQuota.innerText = totalCalls > 0 ? totalCalls + ' calls today' : '0%';
      }

      const syncTimeEl = document.getElementById('rtLastUpdatedTime');
      if (syncTimeEl) {
        syncTimeEl.innerText = 'Last sync: ' + new Date().toLocaleTimeString();
      }

      // 2. Per-API Key Granular Table
      const keyTableBody = document.getElementById('rtApiKeyTableBody');
      if (keyTableBody && Array.isArray(data.keys)) {
        if (data.keys.length === 0) {
          keyTableBody.innerHTML = '<tr><td colspan="9" class="p-6 text-center text-neutral-400">No active keys recorded. Generate one below!</td></tr>';
        } else {
          keyTableBody.innerHTML = data.keys.map(k => {
            const scopeBadge = k.key_type === 'memory'
              ? '<span class="px-2 py-0.5 rounded bg-black text-white text-[10px] font-bold uppercase font-num">Memory</span>'
              : (k.key_type === 'search'
                ? '<span class="px-2 py-0.5 rounded bg-neutral-200 text-neutral-800 text-[10px] font-bold uppercase font-num">Search</span>'
                : (k.key_type === 'telemetry'
                  ? '<span class="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 text-[10px] font-bold uppercase font-num">Metrics</span>'
                  : '<span class="px-2 py-0.5 rounded bg-neutral-100 text-neutral-700 text-[10px] font-bold uppercase font-num">Unified</span>'));

            const lastActiveStr = k.last_used_at 
              ? formatRelativeTime(new Date(k.last_used_at).getTime()) 
              : '<span class="text-neutral-400">Inactive</span>';

            const limitDisplay = typeof k.daily_limit === 'number' ? k.daily_limit.toLocaleString() : k.daily_limit;
            const pctUsed = k.percent_used || 0;

            return '<tr class="hover:bg-neutral-50 transition-colors">' +
              '<td class="p-3 font-sans">' +
                '<div class="font-bold text-neutral-900 text-xs">' + escapeHtml(k.label || 'API Key') + '</div>' +
                '<div class="font-mono text-[10px] text-neutral-400 truncate max-w-[130px]">' + escapeHtml(k.key_id) + '</div>' +
              '</td>' +
              '<td class="p-3">' + scopeBadge + '</td>' +
              '<td class="p-3"><span class="px-2 py-0.5 rounded bg-neutral-100 text-neutral-900 text-[10px] font-bold uppercase font-num">' + escapeHtml(k.plan) + '</span></td>' +
              '<td class="p-3 text-right bg-neutral-50/50">' +
                '<span class="font-bold text-neutral-950 font-num text-xs">' + (k.today_total || 0).toLocaleString() + '</span>' +
                (typeof k.daily_limit === 'number' ? '<div class="w-full bg-neutral-200 h-1 rounded-full mt-1 overflow-hidden"><div class="bg-black h-1 rounded-full" style="width: ' + pctUsed + '%"></div></div>' : '') +
              '</td>' +
              '<td class="p-3 text-right font-num text-xs">' +
                '<span class="px-2 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-800">' + (k.today_search || 0).toLocaleString() + '</span>' +
              '</td>' +
              '<td class="p-3 text-right font-num text-xs">' +
                '<span class="px-2 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-800">' + (k.today_memory || 0).toLocaleString() + '</span>' +
              '</td>' +
              '<td class="p-3 text-right font-num text-xs">' +
                '<span class="px-2 py-0.5 rounded bg-neutral-100 font-semibold text-neutral-800">' + (k.today_metrics || 0).toLocaleString() + '</span>' +
              '</td>' +
              '<td class="p-3 text-right font-num text-neutral-600 text-xs">' + limitDisplay + '</td>' +
              '<td class="p-3 text-right font-num text-neutral-600 text-[11px] whitespace-nowrap">' + lastActiveStr + '</td>' +
            '</tr>';
          }).join('');
        }
      }

      // 3. 7-Day Daily Call History Strip
      const historyContainer = document.getElementById('rtHistoryStripContainer');
      if (historyContainer && Array.isArray(data.combined_history_7d)) {
        historyContainer.innerHTML = data.combined_history_7d.map((day, idx) => {
          const isToday = idx === data.combined_history_7d.length - 1;
          const dayLabel = isToday ? 'Today' : day.date.slice(5);
          return '<div class="p-3 rounded-xl border ' + (isToday ? 'border-neutral-950 bg-neutral-950 text-white shadow-xs' : 'border-neutral-200 bg-white') + ' flex flex-col justify-between text-xs font-num">' +
            '<div class="flex items-center justify-between text-[10px] ' + (isToday ? 'text-neutral-400' : 'text-neutral-500') + ' uppercase font-bold">' +
              '<span>' + dayLabel + '</span>' +
              (isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>' : '') +
            '</div>' +
            '<div class="text-xl font-normal my-1.5 tracking-tight ' + (isToday ? 'text-white' : 'text-neutral-950') + '">' + day.total.toLocaleString() + '</div>' +
            '<div class="space-y-0.5 text-[9px] border-t ' + (isToday ? 'border-neutral-800 text-neutral-300' : 'border-neutral-100 text-neutral-500') + ' pt-1">' +
              '<div class="flex justify-between"><span>Search</span><span class="font-semibold">' + day.search + '</span></div>' +
              '<div class="flex justify-between"><span>Memory</span><span class="font-semibold">' + day.memory + '</span></div>' +
              '<div class="flex justify-between"><span>Metrics</span><span class="font-semibold">' + day.metrics + '</span></div>' +
            '</div>' +
          '</div>';
        }).join('');
      }

      // 4. Real-Time Micro-Stream
      const eventsContainer = document.getElementById('rtRecentEventsContainer');
      if (eventsContainer && Array.isArray(data.recent_live_events)) {
        if (data.recent_live_events.length === 0) {
          eventsContainer.innerHTML = '<div class="p-4 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl">No requests recorded yet today. Click an interactive test button above to emit live edge calls.</div>';
        } else {
          eventsContainer.innerHTML = data.recent_live_events.map(ev => {
            const sBadge = ev.service === 'search'
              ? 'bg-blue-50 text-blue-800 border-blue-200'
              : (ev.service === 'memory'
                ? 'bg-purple-50 text-purple-800 border-purple-200'
                : (ev.service === 'metrics'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  : 'bg-neutral-100 text-neutral-800 border-neutral-200'));

            const timeStr = new Date(ev.timestamp).toLocaleTimeString();
            return '<div class="p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50/70 transition flex items-center justify-between text-xs font-num gap-3">' +
              '<div class="flex items-center gap-2 min-w-0">' +
                '<span class="px-1.5 py-0.5 rounded text-[9px] font-bold border uppercase font-mono ' + sBadge + '">' + escapeHtml(ev.service) + '</span>' +
                '<span class="font-mono font-bold text-neutral-900 text-[11px] truncate">' + escapeHtml(ev.method) + ' ' + escapeHtml(ev.path) + '</span>' +
                '<span class="text-[10px] text-neutral-400 font-sans hidden sm:inline truncate">(' + escapeHtml(ev.label || 'Key') + ')</span>' +
              '</div>' +
              '<div class="flex items-center gap-3 flex-shrink-0">' +
                '<span class="text-[10px] text-emerald-600 font-bold">' + ev.latency_ms + 'ms</span>' +
                '<span class="px-1.5 py-0.2 rounded text-[10px] font-bold ' + (ev.status < 400 ? 'bg-neutral-100 text-neutral-800' : 'bg-red-50 text-red-700') + '">' + ev.status + '</span>' +
                '<span class="text-[10px] text-neutral-400">' + timeStr + '</span>' +
              '</div>' +
            '</div>';
          }).join('');
        }
      }
    }

    function toggleRealtimeAutoRefresh(enabled) {
      isRealtimeAutoRefresh = enabled;
      if (realtimeTimer) {
        clearInterval(realtimeTimer);
        realtimeTimer = null;
      }
      if (enabled) {
        realtimeTimer = setInterval(() => {
          if (!document.hidden) {
            loadRealtimeKeyMetrics(false);
          }
        }, 3000);
      }
    }

    async function testLiveRequest(service) {
      const activeKey = getActiveKey();
      const headers = { 'Content-Type': 'application/json' };
      if (activeKey) headers['X-API-Key'] = activeKey;
      else {
        const token = getAuthToken();
        if (token) headers['Authorization'] = 'Bearer ' + token;
      }

      try {
        if (service === 'search') {
          await fetch('/v1/search', {
            method: 'POST',
            headers,
            body: JSON.stringify({ query: 'Realtime Edge Benchmark', mode: 1, num_results: 3 })
          });
          showAppToast('Simulated +1 UltraSearch Request (<15ms Edge Recall)');
        } else if (service === 'memory') {
          await fetch('/v1/memory/query', {
            method: 'POST',
            headers,
            body: JSON.stringify({ query: 'agent prompt context', container_tag: 'default', limit: 2 })
          });
          showAppToast('Simulated +1 UltraMemory Request (BM25 Edge Recall)');
        } else if (service === 'metrics') {
          await fetch('/v1/analytics/capture', {
            method: 'POST',
            headers,
            body: JSON.stringify({ eventName: 'ping_realtime_test', distinctId: 'tester_live', properties: { test: true } })
          });
          showAppToast('Simulated +1 UltraMetrics Telemetry Ingest (Sub-5ms)');
        }
        await loadRealtimeKeyMetrics(true);
      } catch (err) {
        showAppToast('Test request failed: ' + err.message, true);
      }
    }

    function formatRelativeTime(timestamp) {
      const diffSec = Math.floor((Date.now() - timestamp) / 1000);
      if (diffSec < 10) return 'Just now';
      if (diffSec < 60) return diffSec + 's ago';
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return diffMin + 'm ago';
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return diffHour + 'h ago';
      return Math.floor(diffHour / 24) + 'd ago';
    }

    async function handleAppStoreMemory(e) {
      if (e && e.preventDefault) e.preventDefault();
      const memoryType = document.getElementById('appMemType')?.value || 'fact';
      const containerTag = document.getElementById('appMemContainer')?.value.trim() || 'default';
      const content = document.getElementById('appMemContent')?.value.trim();
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
          if (alertBox) {
            alertBox.className = 'p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-neutral-950 font-num text-xs';
            alertBox.innerText = 'Stored memory ID: ' + (mem.memory_id || 'saved') + timeMs;
            alertBox.classList.remove('hidden');
          }
          document.getElementById('appMemContent').value = '';
          loadStoredMemories();
          showAppToast('Memory stored into edge D1 FTS5' + timeMs);
        } else {
          throw new Error(data.error || 'Failed to store memory');
        }
      } catch (err) {
        if (alertBox) {
          alertBox.className = 'p-3 rounded-xl bg-neutral-100 border border-neutral-300 text-red-600 font-num text-xs';
          alertBox.innerText = 'Error: ' + err.message;
          alertBox.classList.remove('hidden');
        }
        showAppToast(err.message, true);
      }
    }

    async function handleAppQueryMemory(e) {
      if (e && e.preventDefault) e.preventDefault();
      const query = document.getElementById('appMemQuery')?.value.trim();
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
        if (timer) {
          timer.innerText = (data.retrieval_time_ms || duration) + 'ms';
          timer.classList.remove('hidden');
        }

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
          if (resultsDiv) resultsDiv.innerHTML = html;
        } else {
          if (resultsDiv) resultsDiv.innerHTML = '<div class="text-center py-4 text-neutral-400 text-xs">No memories matching query.</div>';
        }
      } catch (err) {
        if (resultsDiv) resultsDiv.innerHTML = '<div class="text-center py-4 text-red-600 text-xs font-num">Error: ' + err.message + '</div>';
      }
    }

    async function loadStoredMemories() {
      try {
        const res = await fetch('/v1/memory?limit=30', { headers: getAppAuthHeaders() });
        const data = await res.json();
        const tbody = document.getElementById('appMemoriesTableBody');
        const metric = document.getElementById('metricMemories');
        if (data.memories && data.memories.length > 0) {
          if (metric) metric.innerText = data.total || data.memories.length;
          if (tbody) {
            tbody.innerHTML = data.memories.map(m =>
              '<tr class="hover:bg-neutral-50">' +
                '<td class="py-2.5 font-mono text-neutral-900">' + m.memory_id + '</td>' +
                '<td class="py-2.5 font-mono text-neutral-600">' + m.container_tag + '</td>' +
                '<td class="py-2.5"><span class="px-1.5 py-0.5 rounded bg-neutral-100 text-[10px] uppercase font-bold">' + m.memory_type + '</span></td>' +
                '<td class="py-2.5 truncate max-w-xs text-neutral-900 font-sans">' + (m.title || m.content) + '</td>' +
                '<td class="py-2.5 text-right"><button type="button" onclick="deleteAppMem(&apos;' + m.memory_id + '&apos;)" class="text-neutral-400 hover:text-black cursor-pointer">Delete</button></td>' +
              '</tr>'
            ).join('');
          }
        } else {
          if (tbody) tbody.innerHTML = '<tr><td colspan="5" class="py-4 text-center text-neutral-400">No memories stored yet.</td></tr>';
        }
      } catch {}
    }

    async function deleteAppMem(id) {
      try {
        await fetch('/v1/memory/' + id, { method: 'DELETE', headers: getAppAuthHeaders() });
        showAppToast('Memory deleted');
        loadStoredMemories();
      } catch (err) {
        showAppToast('Failed to delete memory', true);
      }
    }

    async function handleAppSearch(e) {
      if (e && e.preventDefault) e.preventDefault();
      const query = document.getElementById('appSearchQuery')?.value.trim();
      const mode = parseInt(document.querySelector('input[name="appSearchMode"]:checked')?.value || '1', 10);
      const resultsDiv = document.getElementById('appSearchResults');

      if (!query) return;

      const t0 = performance.now();
      if (resultsDiv) resultsDiv.innerHTML = '<div class="text-center py-4 text-neutral-400 text-xs">Searching edge index...</div>';
      try {
        const res = await fetch('/v1/search', {
          method: 'POST',
          headers: getAppAuthHeaders(),
          body: JSON.stringify({ query, mode, num_results: 5 })
        });
        const data = await res.json();
        const duration = Math.round(performance.now() - t0);
        const reportedTime = data.search_time_ms !== undefined ? data.search_time_ms : duration;
        const modeBadgeText = mode === 1 ? 'Mode 1 (Instant <15ms)' : mode === 2 ? 'Mode 2 (Standard Hybrid)' : 'Mode 3 (Deep Research)';
        const scorePrefix = mode === 1 ? 'Instant BM25: ' : mode === 2 ? 'Hybrid BM25: ' : 'Deep BM25: ';

        if (data.results && data.results.length > 0) {
          if (resultsDiv) {
            let synthesisHtml = '';
            if (data.metadata?.synthesis) {
              synthesisHtml = '<div class="p-4 rounded-xl bg-neutral-900 text-white text-xs mb-3 space-y-2">' +
                '<div class="font-bold uppercase tracking-wider text-[10px] text-neutral-400 font-num">Deep Research Synthesis</div>' +
                '<div class="leading-relaxed whitespace-pre-line">' + escapeHtml(data.metadata.synthesis) + '</div>' +
              '</div>';
            }

            const headerHtml = '<div class="flex items-center justify-between text-xs font-num px-3.5 py-2 rounded-xl bg-neutral-100 border border-neutral-200 mb-3">' +
              '<div class="flex items-center gap-2">' +
                '<span class="w-2 h-2 rounded-full ' + (mode === 1 ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-900') + '"></span>' +
                '<span class="font-bold text-neutral-900">' + modeBadgeText + '</span>' +
              '</div>' +
              '<span class="font-bold text-neutral-900">' + reportedTime + 'ms Edge Latency</span>' +
            '</div>';

            const itemsHtml = data.results.map(r =>
              '<div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs space-y-1">' +
                '<div class="flex items-center justify-between text-[10px] text-neutral-500 font-num">' +
                  '<span class="truncate max-w-sm">' + r.url + '</span>' +
                  '<span class="font-bold text-neutral-900">' + scorePrefix + (r.score || 0.95).toFixed(2) + '</span>' +
                '</div>' +
                '<a href="' + r.url + '" target="_blank" class="font-bold text-neutral-950 hover:underline block">' + r.title + '</a>' +
                '<p class="text-neutral-600">' + r.snippet + '</p>' +
              '</div>'
            ).join('');

            resultsDiv.innerHTML = headerHtml + synthesisHtml + itemsHtml;
          }
        } else {
          if (resultsDiv) resultsDiv.innerHTML = '<div class="text-center py-4 text-neutral-400 text-xs">No results found for query.</div>';
        }
      } catch (err) {
        if (resultsDiv) resultsDiv.innerHTML = '<div class="text-center py-4 text-red-600 text-xs font-num">Search error: ' + err.message + '</div>';
      }
    }

    async function handleAppCrawl(e) {
      if (e && e.preventDefault) e.preventDefault();
      const url = (document.getElementById('appCrawlUrlSearch')?.value || document.getElementById('appCrawlUrl')?.value || '').trim();
      const depth = parseInt(document.getElementById('appCrawlDepthSearch')?.value || document.getElementById('appCrawlDepth')?.value || '0', 10);
      const box = document.getElementById('appCrawlResultSearch') || document.getElementById('appCrawlResult');

      if (!url) return;

      if (box) {
        box.innerText = 'Crawling and parsing URL into D1 FTS5...';
        box.classList.remove('hidden');
      }

      try {
        const res = await fetch('/v1/crawl', {
          method: 'POST',
          headers: getAppAuthHeaders(),
          body: JSON.stringify({ url, depth })
        });
        const data = await res.json();
        if (box) box.innerText = JSON.stringify(data, null, 2);
        showAppToast('Crawl completed');
      } catch (err) {
        if (box) box.innerText = 'Crawl error: ' + err.message;
        showAppToast('Crawl failed', true);
      }
    }

    async function upgradeTier(plan, silent = false) {
      let token = getAuthToken();
      if (!token) token = await initGuestSession();
      if (!token) return;

      try {
        const res = await fetch('/v1/auth/membership', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ plan })
        });
        const data = await res.json();
        if (data.plan) {
          const badge = document.getElementById('userPlanBadge');
          if (badge) badge.innerText = data.plan.toUpperCase();
          await loadAppKeys();
          refreshTelemetry();
          if (!silent) {
            showAppToast('Membership tier updated to ' + data.plan.toUpperCase());
          }
        }
      } catch (err) {
        if (!silent) showAppToast('Upgrade failed: ' + err.message, true);
      }
    }

    async function refreshTelemetry() {
      try {
        const res = await fetch('/v1/usage', { headers: getAppAuthHeaders() });
        const data = await res.json();
        if (data.daily_limit !== undefined) {
          const used = document.getElementById('metricUsed');
          const limit = document.getElementById('metricLimit');
          if (used) used.innerText = data.requests_today || 0;
          if (limit) limit.innerText = data.daily_limit === -1 || data.daily_limit === 'unlimited' ? '∞' : data.daily_limit;
        }
      } catch {}
      try {
        const cRes = await fetch('/v1/crawler/stats', { headers: getAppAuthHeaders() });
        const cData = await cRes.json();
        const indexed = document.getElementById('metricIndexed');
        if (indexed && cData.total_documents !== undefined) {
          indexed.innerText = cData.total_documents;
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
      localStorage.removeItem('ultrademon_active_key');
      window.location.href = '/login';
    }

    async function autoProvisionInitialKey(plan) {
      let token = getAuthToken();
      if (!token) token = await initGuestSession();
      if (!token) return;
      try {
        const res = await fetch('/v1/keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
          body: JSON.stringify({ plan: plan || 'free', label: 'Primary Edge Key' })
        });
        const data = await res.json();
        if (data.plain_key) {
          const saved = JSON.parse(localStorage.getItem('ultrademon_saved_plain_keys') || '{}');
          saved[data.key_id] = data.plain_key;
          localStorage.setItem('ultrademon_saved_plain_keys', JSON.stringify(saved));
          localStorage.setItem('ultrademon_active_key', data.plain_key);
          await loadAppKeys();
          refreshTelemetry();
        }
      } catch {}
    }

    // Export all global handlers to window immediately
    window.setAppView = setAppView;
    window.switchSuite = switchSuite;
    window.switchSuiteTab = switchSuite;
    window.switchProfilePeriod = switchProfilePeriod;
    window.generateFreshICPReport = generateFreshICPReport;
    window.handleAppCreateKey = handleAppCreateKey;
    window.copyToClipboard = copyToClipboard;
    window.copyActiveKey = copyActiveKey;
    window.revokeAppKey = revokeAppKey;
    window.handleAppStoreMemory = handleAppStoreMemory;
    window.handleAppQueryMemory = handleAppQueryMemory;
    window.loadStoredMemories = loadStoredMemories;
    window.deleteAppMem = deleteAppMem;
    window.handleAppSearch = handleAppSearch;
    window.handleAppCrawl = handleAppCrawl;
    window.upgradeTier = upgradeTier;
    window.refreshTelemetry = refreshTelemetry;
    window.handleAppSignOut = handleAppSignOut;
    window.showAppToast = showAppToast;
    window.quickCreateSuiteKey = quickCreateSuiteKey;
    window.copySnippetCode = copySnippetCode;
    window.emitSimulationEvent = emitSimulationEvent;
    window.handleCustomSimulation = handleCustomSimulation;
    window.loadVipWatchTargets = loadVipWatchTargets;
    window.handleCreateVipTarget = handleCreateVipTarget;
    window.deleteVipTarget = deleteVipTarget;
    window.loadVipLiveTraces = loadVipLiveTraces;
    window.renderCustomerProfileCard = renderCustomerProfileCard;
    window.generateFreshICPReport = generateFreshICPReport;
    window.switchProfilePeriod = switchProfilePeriod;
    window.escapeHtml = escapeHtml;
    window.loadRealtimeKeyMetrics = loadRealtimeKeyMetrics;
    window.toggleRealtimeAutoRefresh = toggleRealtimeAutoRefresh;
    window.testLiveRequest = testLiveRequest;

    // Immediate Synchronous State Hydration (Zero Latency Profile Display)
    function hydrateCachedState() {
      // 1. Direct user profile
      const userStr = localStorage.getItem('ultrademon_user');
      if (userStr) {
        try {
          currentUser = JSON.parse(userStr);
        } catch {}
      }

      // 2. Check Supabase auth cache if currentUser has no email
      if (!currentUser || !currentUser.email) {
        try {
          for (let i = 0; i < localStorage.length; i++) {
            const k = localStorage.key(i);
            if (k && (k.startsWith('sb-') || k.includes('supabase')) && k.endsWith('-auth-token')) {
              const sbData = JSON.parse(localStorage.getItem(k) || '{}');
              const sbUser = sbData.user || sbData.currentSession?.user || sbData.session?.user;
              if (sbUser && (sbUser.email || sbUser.id)) {
                currentUser = currentUser || {};
                currentUser.id = currentUser.id || sbUser.id;
                currentUser.email = sbUser.email || currentUser.email;
                currentUser.plan = currentUser.plan || 'free';
                localStorage.setItem('ultrademon_user', JSON.stringify(currentUser));
                break;
              }
            }
          }
        } catch {}
      }

      const emailDisplay = document.getElementById('userEmailDisplay');
      const planBadge = document.getElementById('userPlanBadge');
      if (emailDisplay) {
        if (currentUser && (currentUser.email || currentUser.id)) {
          emailDisplay.innerText = currentUser.email || currentUser.id;
        } else {
          emailDisplay.innerText = 'Active Workspace';
        }
      }
      if (planBadge) {
        planBadge.innerText = ((currentUser && currentUser.plan) || 'free').toUpperCase();
      }

      const activeKey = getActiveKey();
      const topLabel = document.getElementById('topActiveKeyLabel');
      const topCopyBtn = document.getElementById('topCopyBtn');
      if (activeKey && topLabel) {
        topLabel.innerText = activeKey.slice(0, 10) + '...';
        if (topCopyBtn) topCopyBtn.classList.remove('hidden');
      } else if (topLabel) {
        topLabel.innerText = 'None';
        if (topCopyBtn) topCopyBtn.classList.add('hidden');
      }

      const storedKeysStr = localStorage.getItem(STORAGE_KEY);
      if (storedKeysStr) {
        try {
          const parsed = JSON.parse(storedKeysStr);
          if (Array.isArray(parsed) && parsed.length > 0) {
            localKeys = parsed;
            renderAppKeysTable();
          }
        } catch {}
      }
    }

    // ── Telemetry & Autonomous Customer Profile Dashboard Logic ───────────────
    async function loadAnalyticsDashboard() {
      const token = getAuthToken();
      const activeKey = getActiveKey();
      const headers = {};
      if (token) headers['Authorization'] = 'Bearer ' + token;
      else if (activeKey) headers['X-API-Key'] = activeKey;

      // Update embed snippet with active key
      const snippetEl = document.getElementById('snippetScriptTag');
      if (snippetEl) {
        snippetEl.innerText = '<script src="' + ORIGIN + '/sdk/ultrademon.js" data-key="' + (activeKey || 'YOUR_API_KEY') + '" async><' + '/script>';
      }

      // 1. Overview KPIs
      try {
        const res = await fetch('/v1/analytics/overview', { headers });
        if (res.ok) {
          const data = await res.json();
          const activeNow = document.getElementById('telemetryActiveNow');
          const pageviews = document.getElementById('telemetryPageviews');
          const visitors = document.getElementById('telemetryVisitors');
          const avgDur = document.getElementById('telemetryAvgDuration');
          const bounce = document.getElementById('telemetryBounceRate');
          const lcp = document.getElementById('telemetryLcp');
          const cls = document.getElementById('telemetryCls');

          const vitalsStatus = document.getElementById('telemetryVitalsStatus');

          if (activeNow) activeNow.innerText = (data.active_visitors_now !== undefined && data.active_visitors_now !== null) ? data.active_visitors_now : '0';
          if (pageviews) pageviews.innerText = data.metrics_24h ? Number(data.metrics_24h.pageviews || 0).toLocaleString() : '0';
          if (visitors) visitors.innerText = data.metrics_24h ? Number(data.metrics_24h.unique_visitors || 0).toLocaleString() : '0';
          if (avgDur) {
            const sec = (data.metrics_24h && data.metrics_24h.avg_session_duration_sec) || 0;
            avgDur.innerText = Math.floor(sec / 60) + 'm ' + (sec % 60) + 's';
          }
          if (bounce) bounce.innerText = (data.metrics_24h && data.metrics_24h.bounce_rate_pct !== undefined ? data.metrics_24h.bounce_rate_pct : '0') + '%';
          if (lcp) lcp.innerText = ((data.metrics_24h && data.metrics_24h.core_web_vitals && data.metrics_24h.core_web_vitals.lcp_ms) || 0) + 'ms';
          if (cls) cls.innerText = (data.metrics_24h && data.metrics_24h.core_web_vitals && data.metrics_24h.core_web_vitals.cls !== undefined) ? data.metrics_24h.core_web_vitals.cls : '0.000';
          if (vitalsStatus) {
            const hasTraffic = data.metrics_24h && data.metrics_24h.pageviews > 0;
            vitalsStatus.innerText = hasTraffic ? 'GOOD' : 'PENDING';
            vitalsStatus.className = 'font-num text-[10px] px-1.5 py-0.5 rounded ' + (hasTraffic ? 'bg-emerald-50 text-emerald-800 border border-emerald-200' : 'bg-neutral-100 text-neutral-600 border border-neutral-200') + ' font-semibold';
          }
        }
      } catch (e) {
        console.warn('Overview telemetry fetch error:', e);
      }

      // 2. Customer Profile / ICP Engine (with periodic horizon support)
      await loadCustomerProfile(currentProfilePeriod);

      // 3. Reports: Pages, Referrers, Geo, Devices
      try {
        const res = await fetch('/v1/analytics/reports?dimension=all', { headers });
        if (res.ok) {
          const data = await res.json();
          renderAnalyticsReports(data);
        }
      } catch (e) {
        console.warn('Reports telemetry fetch error:', e);
      }

      // 4. VIP Watchlist & Live Micro-Traces
      loadVipWatchTargets();
      loadVipLiveTraces();
    }

    let currentProfilePeriod = 'monthly';

    function switchProfilePeriod(period) {
      if (currentProfilePeriod === period) return;
      currentProfilePeriod = period;
      updatePeriodSwitcherUI();
      loadCustomerProfile(period);
    }

    function updatePeriodSwitcherUI() {
      const periods = ['weekly', 'monthly', 'yearly'];
      periods.forEach(function(p) {
        const btn = document.getElementById('icpPeriod' + p.charAt(0).toUpperCase() + p.slice(1));
        if (btn) {
          if (p === currentProfilePeriod) {
            btn.className = 'px-3 py-1.5 text-xs font-semibold rounded-lg transition bg-neutral-900 text-white shadow-xs cursor-pointer';
          } else {
            btn.className = 'px-3 py-1.5 text-xs font-semibold rounded-lg transition text-neutral-600 hover:text-neutral-900 cursor-pointer';
          }
        }
      });
    }

    async function loadCustomerProfile(period) {
      period = period || currentProfilePeriod;
      const token = getAuthToken();
      const activeKey = getActiveKey();
      const headers = {};
      if (token) headers['Authorization'] = 'Bearer ' + token;
      else if (activeKey) headers['X-API-Key'] = activeKey;

      try {
        const res = await fetch('/v1/analytics/customer-profile?period=' + encodeURIComponent(period), { headers });
        if (res.ok) {
          const data = await res.json();
          renderCustomerProfileCard(data);
        }
      } catch (e) {
        console.warn('Customer profile fetch error:', e);
      }
    }

    function escapeHtml(str) {
      return String(str || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function renderCustomerProfileCard(data) {
      if (!data) return;
      const titleEl = document.getElementById('icpPersonaTitle');
      const archEl = document.getElementById('icpArchetype');
      const scoreEl = document.getElementById('icpFitScore');
      const sumEl = document.getElementById('icpSummaryText');
      const badgeEl = document.getElementById('icpPeriodBadge');
      const pCluster = document.getElementById('icpPowerCluster');
      const gTrend = document.getElementById('icpGrowthTrend');
      const rRate = document.getElementById('icpRepeatRate');
      const retTrend = document.getElementById('icpRetentionTrend');
      const aDwell = document.getElementById('icpAvgDwell');
      const dTrend = document.getElementById('icpDwellTrend');
      const vLabel = document.getElementById('icpVelocityLabel');

      if (data.has_data === false || !data.total_visitors_analyzed || data.total_visitors_analyzed === 0) {
        if (titleEl) titleEl.innerText = 'Awaiting Telemetry Data';
        if (archEl) archEl.innerText = 'No visitor traffic recorded yet · 0 Visitors Analyzed';
        if (scoreEl) scoreEl.innerText = '0%';
        if (sumEl) sumEl.innerText = 'No visitor events captured yet for this timeframe. Embed the Sovereign Telemetry SDK snippet or call /v1/analytics/capture to automatically profile ideal customer traits, circadian habits, and daily abilities.';
        if (badgeEl) badgeEl.innerText = (data.report_period ? data.report_period.toUpperCase() : 'CADENCE') + ' DOSSIER PENDING';

        if (pCluster) pCluster.innerText = '0 Users';
        if (rRate) rRate.innerText = '0% Repeat Rate';
        if (aDwell) aDwell.innerText = '0m Avg Dwell';
        if (gTrend) gTrend.innerText = '--';
        if (retTrend) retTrend.innerText = '--';
        if (dTrend) dTrend.innerText = '--';
        if (vLabel) vLabel.innerText = 'Awaiting Traffic';

        // Clear abilities
        ['icpAbilitySilicon', 'icpAbilityCores', 'icpAbilityRam', 'icpAbilityDisplay', 'icpAbilityRuntimes', 'icpAbilityNetwork'].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.innerText = '--';
        });

        // Clear habits
        ['icpHabitCircadian', 'icpHabitPeakWindow', 'icpHabitFlowIndex', 'icpHabitActiveIdle', 'icpHabitDwellDuration', 'icpHabitMultitask', 'icpHabitFrustration', 'icpHabitHandover'].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.innerText = '--';
        });

        // Clear traits
        ['icpTraitTech', 'icpTraitTechSub', 'icpTraitGeo', 'icpTraitGeoSub', 'icpTraitOrigin', 'icpTraitOriginSub', 'icpTraitDriver', 'icpTraitDriverSub'].forEach(function(id) {
          var el = document.getElementById(id);
          if (el) el.innerText = '--';
        });

        const playbookGrid = document.getElementById('icpPlaybookGrid');
        if (playbookGrid) {
          playbookGrid.innerHTML = '<div class="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center text-xs text-neutral-400 col-span-3">Actionable playbook recommendations will automatically synthesize once customer traffic is recorded.</div>';
        }
        updateAllSuiteSnippets();
        return;
      }

      const icp = data.ideal_customer_profile || {};
      if (titleEl) titleEl.innerText = icp.persona_title || data.persona_title || 'Identified Customer Profile';
      if (archEl) archEl.innerText = (icp.archetype || data.persona_archetype || 'Profile') + ' · ' + data.total_visitors_analyzed + ' Total Visitors Analyzed';
      if (scoreEl) scoreEl.innerText = (icp.icp_fit_score || data.icp_fit_score || 0) + '%';
      if (sumEl) sumEl.innerText = icp.summary || data.summary || '';
      if (badgeEl) badgeEl.innerText = data.period_label || (data.report_period ? data.report_period.toUpperCase() + ' EXECUTIVE DOSSIER' : 'MONTHLY STRATEGIC BLUEPRINT');

      // Evolution & Momentum Strip
      if (data.power_user_cluster) {
        if (pCluster) pCluster.innerText = data.power_user_cluster.cluster_size + ' Users';
        if (rRate) rRate.innerText = data.power_user_cluster.repeat_visitor_rate_pct + '% Repeat Rate';
        if (aDwell) aDwell.innerText = data.power_user_cluster.avg_session_duration_minutes + 'm Avg Dwell';
      }
      if (data.period_comparison) {
        if (gTrend) gTrend.innerText = data.period_comparison.power_user_growth;
        if (retTrend) retTrend.innerText = data.period_comparison.retention_delta;
        if (dTrend) dTrend.innerText = data.period_comparison.dwell_time_delta;
        if (vLabel) vLabel.innerText = data.period_comparison.velocity_trend;
      }

      // Daily Abilities
      const abilities = icp.daily_abilities;
      if (abilities) {
        const siliconEl = document.getElementById('icpAbilitySilicon');
        const coresEl = document.getElementById('icpAbilityCores');
        const ramEl = document.getElementById('icpAbilityRam');
        const displayEl = document.getElementById('icpAbilityDisplay');
        const runtimesEl = document.getElementById('icpAbilityRuntimes');
        const netEl = document.getElementById('icpAbilityNetwork');

        if (siliconEl) siliconEl.innerText = abilities.silicon_tier || '--';
        if (coresEl) coresEl.innerText = abilities.hardware_concurrency || '--';
        if (ramEl) ramEl.innerText = abilities.device_memory || '--';
        if (displayEl) displayEl.innerText = abilities.display_fidelity || '--';
        if (runtimesEl && Array.isArray(abilities.developer_runtimes)) {
          runtimesEl.innerText = abilities.developer_runtimes.slice(0, 2).join(' · ');
        }
        if (netEl) netEl.innerText = abilities.network_profile || '--';
      }

      // Daily Habits
      const habits = icp.daily_habits;
      if (habits) {
        const circEl = document.getElementById('icpHabitCircadian');
        const peakEl = document.getElementById('icpHabitPeakWindow');
        const flowEl = document.getElementById('icpHabitFlowIndex');
        const actIdleEl = document.getElementById('icpHabitActiveIdle');
        const dwellEl = document.getElementById('icpHabitDwellDuration');
        const multiEl = document.getElementById('icpHabitMultitask');
        const frustEl = document.getElementById('icpHabitFrustration');
        const handEl = document.getElementById('icpHabitHandover');

        if (circEl) circEl.innerText = habits.circadian_pattern || '--';
        if (peakEl) peakEl.innerText = habits.peak_productivity_window || '--';
        if (flowEl) flowEl.innerText = habits.flow_state_focus_index || '--';
        if (actIdleEl) actIdleEl.innerText = habits.active_vs_idle || '--';
        if (dwellEl) dwellEl.innerText = habits.uninterrupted_flow_duration || '--';
        if (multiEl) multiEl.innerText = habits.multitasking_cadence || '--';
        if (frustEl) frustEl.innerText = habits.frustration_profile || '--';
        if (handEl) handEl.innerText = habits.cross_device_handover || '--';
      }

      // 4 Defining Traits
      const traits = icp.defining_traits || [];
      if (traits[0]) {
        const el = document.getElementById('icpTraitTech');
        const sub = document.getElementById('icpTraitTechSub');
        if (el) el.innerText = traits[0].detail;
        if (sub) sub.innerText = traits[0].significance;
      }
      if (traits[1]) {
        const el = document.getElementById('icpTraitGeo');
        const sub = document.getElementById('icpTraitGeoSub');
        if (el) el.innerText = traits[1].detail;
        if (sub) sub.innerText = traits[1].significance;
      }
      if (traits[2]) {
        const el = document.getElementById('icpTraitOrigin');
        const sub = document.getElementById('icpTraitOriginSub');
        if (el) el.innerText = traits[2].detail;
        if (sub) sub.innerText = traits[2].significance;
      }
      if (traits[3]) {
        const el = document.getElementById('icpTraitDriver');
        const sub = document.getElementById('icpTraitDriverSub');
        if (el) el.innerText = traits[3].detail;
        if (sub) sub.innerText = traits[3].significance;
      }

      // Render Playbook
      const playbookGrid = document.getElementById('icpPlaybookGrid');
      if (playbookGrid && Array.isArray(icp.actionable_playbook)) {
        playbookGrid.innerHTML = icp.actionable_playbook.map(function(p, idx) {
          return '<div class="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">' +
            '<span class="font-bold text-neutral-900 block mb-1 font-num">' + (idx + 1) + '. ' + escapeHtml(p.objective) + '</span>' +
            '<p class="text-[11px] text-neutral-600 leading-relaxed">' + escapeHtml(p.recommendation) + '</p>' +
          '</div>';
        }).join('');
      }
      updateAllSuiteSnippets();
    }

    function renderAnalyticsReports(data) {
      if (!data) return;

      // Pages
      const pagesBody = document.getElementById('telemetryPagesTableBody');
      if (pagesBody && Array.isArray(data.top_pages)) {
        pagesBody.innerHTML = data.top_pages.map(function(p) {
          return '<tr class="hover:bg-neutral-50">' +
            '<td class="py-2 font-mono text-neutral-900 font-medium">' + escapeHtml(p.path) + '</td>' +
            '<td class="py-2 text-right font-bold text-neutral-900">' + p.views + '</td>' +
            '<td class="py-2 text-right text-neutral-600">' + p.unique_visitors + '</td>' +
            '<td class="py-2 text-right text-neutral-500">' + p.avg_time_sec + 's</td>' +
          '</tr>';
        }).join('') || '<tr><td colspan="4" class="py-3 text-center text-neutral-400">No page views recorded yet.</td></tr>';
      }

      // Referrers
      const refBody = document.getElementById('telemetryReferrersTableBody');
      if (refBody && Array.isArray(data.referrers)) {
        refBody.innerHTML = data.referrers.map(function(r) {
          return '<tr class="hover:bg-neutral-50">' +
            '<td class="py-2 font-medium text-neutral-900">' + escapeHtml(r.source) + '</td>' +
            '<td class="py-2 text-right font-bold text-neutral-900">' + r.visits + '</td>' +
            '<td class="py-2 text-right text-neutral-600">' + r.unique_visitors + '</td>' +
          '</tr>';
        }).join('') || '<tr><td colspan="3" class="py-3 text-center text-neutral-400">No referrers recorded yet.</td></tr>';
      }

      // Geo
      const geoBody = document.getElementById('telemetryGeoTableBody');
      if (geoBody && Array.isArray(data.geographic_footprint)) {
        geoBody.innerHTML = data.geographic_footprint.map(function(g) {
          return '<tr class="hover:bg-neutral-50">' +
            '<td class="py-2 font-medium text-neutral-900">' + escapeHtml((g.city ? g.city + ', ' : '') + g.country) + '</td>' +
            '<td class="py-2 text-neutral-500 font-mono">' + escapeHtml(g.edge_pop || 'EDGE') + '</td>' +
            '<td class="py-2 text-right font-bold text-neutral-900">' + g.events + '</td>' +
            '<td class="py-2 text-right text-neutral-600">' + g.visitors + '</td>' +
          '</tr>';
        }).join('') || '<tr><td colspan="4" class="py-3 text-center text-neutral-400">No geo telemetry recorded yet.</td></tr>';
      }

      // Devices
      const devBody = document.getElementById('telemetryDevicesTableBody');
      if (devBody && Array.isArray(data.devices_and_browsers)) {
        devBody.innerHTML = data.devices_and_browsers.map(function(d) {
          return '<tr class="hover:bg-neutral-50">' +
            '<td class="py-2 font-medium text-neutral-900">' + escapeHtml(d.os) + '</td>' +
            '<td class="py-2 text-neutral-600">' + escapeHtml(d.browser) + '</td>' +
            '<td class="py-2 text-neutral-500 uppercase text-[10px] font-semibold">' + escapeHtml(d.device_type) + '</td>' +
            '<td class="py-2 text-right font-bold text-neutral-900">' + d.event_count + '</td>' +
          '</tr>';
        }).join('') || '<tr><td colspan="4" class="py-3 text-center text-neutral-400">No devices recorded yet.</td></tr>';
      }

      // Insane Micro-Metrics
      if (data.insane_metrics) {
        renderInsaneMetrics(data.insane_metrics);
      }
    }

    function renderInsaneMetrics(metrics) {
      if (!metrics) return;

      // Summary badges
      if (metrics.hardware_summary) {
        const s = metrics.hardware_summary;
        const coresEl = document.getElementById('insaneAvgCores');
        const ramEl = document.getElementById('insaneAvgRam');
        const retinaEl = document.getElementById('insaneRetinaPct');
        const darkEl = document.getElementById('insaneDarkModePct');
        if (coresEl) coresEl.innerText = (s.avg_cpu_cores ? s.avg_cpu_cores : '0') + ' Cores Avg';
        if (ramEl) ramEl.innerText = (s.avg_ram_gb ? s.avg_ram_gb : '0') + ' GB RAM Avg';
        if (retinaEl) retinaEl.innerText = (s.retina_display_pct ? s.retina_display_pct : '0') + '% Retina';
        if (darkEl) darkEl.innerText = (s.dark_mode_pct ? s.dark_mode_pct : '0') + '% Dark Mode';
      }

      // Kinetic Activity Table
      const actBody = document.getElementById('insaneActivityTableBody');
      if (actBody && Array.isArray(metrics.user_activity_modes)) {
        actBody.innerHTML = metrics.user_activity_modes.map(function(m) {
          const actName = (m.primary_activity || 'navigating').replace(/_/g, ' ').toUpperCase();
          return '<tr class="hover:bg-neutral-50">' +
            '<td class="py-2 font-medium text-neutral-900"><span class="px-2 py-0.5 rounded text-[10px] bg-neutral-100 font-semibold">' + escapeHtml(actName) + '</span></td>' +
            '<td class="py-2 text-right text-neutral-700 font-mono">' + m.avg_active_sec + 's</td>' +
            '<td class="py-2 text-right text-neutral-700 font-mono">' + m.avg_idle_sec + 's</td>' +
            '<td class="py-2 text-right font-bold text-neutral-900 font-mono">' + m.avg_idle_pct + '%</td>' +
            '<td class="py-2 text-right text-neutral-600 font-mono">' + m.count + '</td>' +
          '</tr>';
        }).join('') || '<tr><td colspan="5" class="py-3 text-center text-neutral-400">No kinetic activity recorded yet.</td></tr>';
      }

      // GPU Fleet Table
      const gpuBody = document.getElementById('insaneGpuTableBody');
      if (gpuBody && Array.isArray(metrics.gpu_hardware_fleet)) {
        const total = metrics.gpu_hardware_fleet.reduce(function(acc, g) { return acc + (g.count || 0); }, 0) || 1;
        gpuBody.innerHTML = metrics.gpu_hardware_fleet.map(function(g) {
          const share = Math.round((g.count / total) * 100);
          return '<tr class="hover:bg-neutral-50">' +
            '<td class="py-2 font-medium text-neutral-900 font-mono text-[11px] truncate max-w-[200px]" title="' + escapeHtml(g.gpu) + '">' + escapeHtml(g.gpu) + '</td>' +
            '<td class="py-2 text-right font-bold text-neutral-900 font-mono">' + g.count + '</td>' +
            '<td class="py-2 text-right text-neutral-600 font-mono">' + share + '%</td>' +
          '</tr>';
        }).join('') || '<tr><td colspan="3" class="py-3 text-center text-neutral-400">No GPU telemetry recorded yet.</td></tr>';
      }
    }

    async function loadVipWatchTargets() {
      const token = getAuthToken();
      const activeKey = getActiveKey();
      const headers = {};
      if (token) headers['Authorization'] = 'Bearer ' + token;
      else if (activeKey) headers['X-API-Key'] = activeKey;

      try {
        const res = await fetch('/v1/analytics/tracing/targets', { headers });
        if (res.ok) {
          const data = await res.json();
          const tbody = document.getElementById('vipTargetsTableBody');
          if (tbody && Array.isArray(data.targets)) {
            if (data.targets.length === 0) {
              tbody.innerHTML = '<tr><td colspan="4" class="p-4 text-center text-neutral-400">No active watched clients yet. Add an IP or User ID above.</td></tr>';
            } else {
              tbody.innerHTML = data.targets.map(function(t) {
                return '<tr class="hover:bg-neutral-50">' +
                  '<td class="p-2.5 font-mono text-neutral-900 font-medium">' +
                    escapeHtml(t.target_value) +
                    '<span class="block text-[10px] text-neutral-400 uppercase font-sans">' + escapeHtml(t.target_type) + '</span>' +
                  '</td>' +
                  '<td class="p-2.5 font-medium text-neutral-800">' + escapeHtml(t.label || 'Client') + '</td>' +
                  '<td class="p-2.5 text-right font-bold text-neutral-900 font-mono">' + (t.total_hits_traced || 0) + '</td>' +
                  '<td class="p-2.5 text-right">' +
                    '<button type="button" onclick="deleteVipTarget(&apos;' + escapeHtml(t.target_id) + '&apos;)" class="text-neutral-400 hover:text-red-600 cursor-pointer text-xs font-semibold">Delete</button>' +
                  '</td>' +
                '</tr>';
              }).join('');
            }
          }
        }
      } catch (e) {
        console.warn('VIP targets fetch error:', e);
      }
    }

    async function handleCreateVipTarget(e) {
      if (e && e.preventDefault) e.preventDefault();
      const targetType = document.getElementById('vipTargetType')?.value || 'ip';
      const valInput = document.getElementById('vipTargetValue');
      const labelInput = document.getElementById('vipTargetLabel');
      const targetValue = (valInput ? valInput.value : '').trim();
      const label = (labelInput ? labelInput.value : '').trim();

      if (!targetValue) {
        showAppToast('Please enter an IP address or User ID to trace', true);
        return;
      }

      const token = getAuthToken();
      const activeKey = getActiveKey();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;
      else if (activeKey) headers['X-API-Key'] = activeKey;

      try {
        const res = await fetch('/v1/analytics/tracing/targets', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            target_type: targetType,
            target_value: targetValue,
            label: label || 'High-Paying Client'
          })
        });
        const data = await res.json();
        if (data.status === 'created') {
          showAppToast('Target ' + targetValue + ' added to VIP tracing!');
          if (valInput) valInput.value = '';
          if (labelInput) labelInput.value = '';
          loadVipWatchTargets();
        } else {
          showAppToast('Error: ' + (data.error || 'Failed to add target'), true);
        }
      } catch (err) {
        showAppToast('Network error: ' + err.message, true);
      }
    }

    async function deleteVipTarget(targetId) {
      const token = getAuthToken();
      const activeKey = getActiveKey();
      const headers = {};
      if (token) headers['Authorization'] = 'Bearer ' + token;
      else if (activeKey) headers['X-API-Key'] = activeKey;

      try {
        const res = await fetch('/v1/analytics/tracing/targets/' + encodeURIComponent(targetId), {
          method: 'DELETE',
          headers
        });
        if (res.ok) {
          showAppToast('VIP target removed from watchlist');
          loadVipWatchTargets();
        } else {
          showAppToast('Failed to delete target', true);
        }
      } catch (err) {
        showAppToast('Error: ' + err.message, true);
      }
    }

    async function loadVipLiveTraces() {
      const token = getAuthToken();
      const activeKey = getActiveKey();
      const headers = {};
      if (token) headers['Authorization'] = 'Bearer ' + token;
      else if (activeKey) headers['X-API-Key'] = activeKey;

      try {
        const res = await fetch('/v1/analytics/tracing/live?limit=15', { headers });
        if (res.ok) {
          const data = await res.json();
          const container = document.getElementById('vipLiveTracesContainer');
          if (container && Array.isArray(data.traces)) {
            if (data.traces.length === 0) {
              container.innerHTML = '<div class="p-4 text-center text-xs text-neutral-400 bg-neutral-50 rounded-xl">No VIP traces captured yet. Matching events will stream here live.</div>';
            } else {
              container.innerHTML = data.traces.map(function(tr) {
                const timeStr = new Date(tr.timestamp).toLocaleTimeString();
                return '<div class="p-3 bg-neutral-50/80 border border-neutral-200/60 rounded-xl text-xs space-y-1.5 transition hover:bg-neutral-100/60">' +
                  '<div class="flex items-center justify-between">' +
                    '<div class="flex items-center gap-1.5">' +
                      '<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>' +
                      '<span class="font-bold text-neutral-900">' + escapeHtml(tr.target_label || 'VIP Client') + '</span>' +
                    '</div>' +
                    '<span class="text-[10px] text-neutral-400 font-mono">' + timeStr + '</span>' +
                  '</div>' +
                  '<div class="flex items-center justify-between text-[11px] text-neutral-600 font-mono">' +
                    '<span>' + escapeHtml(tr.client_ip) + ' &bull; ' + escapeHtml(tr.path || '/') + '</span>' +
                    '<span class="font-semibold text-neutral-800">' + escapeHtml(tr.active_vs_idle || '') + '</span>' +
                  '</div>' +
                  '<div class="text-[10px] text-neutral-500 flex items-center justify-between border-t border-neutral-200/40 pt-1">' +
                    '<span class="truncate max-w-[200px]" title="' + escapeHtml(tr.gpu || '') + '">' + escapeHtml(tr.gpu || 'GPU Silicon') + '</span>' +
                    '<span>' + escapeHtml(tr.battery_status || tr.exact_device || 'Verified Edge') + '</span>' +
                  '</div>' +
                '</div>';
              }).join('');
            }
          }
        }
      } catch (e) {
        console.warn('VIP live traces fetch error:', e);
      }
    }

    async function generateFreshICPReport() {
      const btn = document.getElementById('btnRegenerateIcp');
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<svg class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg><span>Synthesizing...</span>';
      }

      const token = getAuthToken();
      const activeKey = getActiveKey();
      const headers = { 'Content-Type': 'application/json' };
      if (token) headers['Authorization'] = 'Bearer ' + token;
      else if (activeKey) headers['X-API-Key'] = activeKey;

      try {
        const res = await fetch('/v1/analytics/customer-profile/generate', {
          method: 'POST',
          headers,
          body: JSON.stringify({ period: currentProfilePeriod })
        });
        const data = await res.json();
        if (data.report) {
          renderCustomerProfileCard(data.report);
          showAppToast('Ideal Customer Profile freshly synthesized for ' + currentProfilePeriod + ' cadence!');
        } else {
          showAppToast('ICP generated successfully');
        }
      } catch (err) {
        showAppToast('Synthesis error: ' + err.message, true);
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg><span>Regenerate Blueprint</span>';
        }
      }
    }

    function copySnippetCode(elId) {
      const el = document.getElementById(elId);
      if (el) {
        copyToClipboard(el.innerText);
        showAppToast('Embed tag copied to clipboard!');
      }
    }

    // Initialize Workspace
    async function initWorkspace() {
      // 1. Direct event listener bindings for sidebar and switcher buttons (synchronous)
      document.querySelectorAll('#sidebarNav button[data-view-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          const target = btn.getAttribute('data-view-target');
          if (target) setAppView(target);
        });
      });

      ['overview', 'search', 'memory', 'metrics'].forEach(s => {
        const btn = document.getElementById('suiteBtn-' + s);
        if (btn) {
          btn.addEventListener('click', (e) => {
            e.preventDefault();
            switchSuite(s);
          });
        }
      });

      // 2. Synchronous hydration first (<1ms) - instantaneous local state render
      hydrateCachedState();

      // 3. Immediately activate target view from URL / hash so UI is interactive instantly
      const urlParams = new URLSearchParams(window.location.search);
      const hashTab = (window.location.hash || '').replace('#', '');
      const suiteParam = urlParams.get('suite');
      let targetTab = urlParams.get('tab') || hashTab;
      if (suiteParam === 'search') targetTab = 'search';
      else if (suiteParam === 'memory') targetTab = 'memory';
      else if (suiteParam === 'metrics') targetTab = 'analytics';

      if (targetTab && ['overview', 'keys', 'memory', 'search', 'crawler', 'membership', 'integrations', 'analytics'].includes(targetTab)) {
        setAppView(targetTab);
      } else {
        setAppView('overview');
      }
      updateAllSuiteSnippets();

      // 4. Authentication & Verification (in background)
      let token = getAuthToken();
      if (!token && !currentUser) {
        token = await initGuestSession();
      }

      if (token) {
        try {
          const res = await fetch('/v1/auth/me', {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          if (res.ok) {
            const data = await res.json();
            currentUser = data.user;
            localStorage.setItem('ultrademon_user', JSON.stringify(currentUser));
            const emailDisplay = document.getElementById('userEmailDisplay');
            const planBadge = document.getElementById('userPlanBadge');
            if (emailDisplay) emailDisplay.innerText = currentUser.email || currentUser.id || 'Active Workspace';
            if (planBadge) planBadge.innerText = (currentUser.plan || 'free').toUpperCase();
            if (data.user && Array.isArray(data.user.keys) && data.user.keys.length > 0) {
              const saved = JSON.parse(localStorage.getItem('ultrademon_saved_plain_keys') || '{}');
              const activePlain = localStorage.getItem('ultrademon_active_key') || '';
              localKeys = data.user.keys.map(k => ({
                ...k,
                plain_key: saved[k.key_id] || (activePlain && localKeys.length === 0 ? activePlain : '')
              }));
              localStorage.setItem(STORAGE_KEY, JSON.stringify(localKeys));
              renderAppKeysTable();
            }
          } else if (!currentUser) {
            token = await initGuestSession();
          }
        } catch (err) {
          console.warn('Session verification non-fatal:', err);
        }
      }

      const emailDisplay = document.getElementById('userEmailDisplay');
      if (emailDisplay) {
        if (currentUser && (currentUser.email || currentUser.id)) {
          emailDisplay.innerText = currentUser.email || currentUser.id;
        } else if (!emailDisplay.innerText || emailDisplay.innerText === 'Loading...') {
          emailDisplay.innerText = 'Active Workspace';
        }
      }

      const targetPlan = (urlParams.get('plan') || urlParams.get('upgrade') || '').toLowerCase();
      if (targetPlan && ['free', 'pro', 'ultra', 'enterprise'].includes(targetPlan)) {
        if (currentUser && currentUser.plan !== targetPlan) {
          await upgradeTier(targetPlan, true);
        }
      }

      await loadAppKeys();
      if (localKeys.length === 0) {
        await autoProvisionInitialKey(currentUser ? currentUser.plan : (targetPlan || 'free'));
      }
      loadStoredMemories();
      refreshTelemetry();
      loadRealtimeKeyMetrics(false);
      toggleRealtimeAutoRefresh(true);
      updateAllSuiteSnippets();
    }

    // Execute immediately or on DOM ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initWorkspace);
    } else {
      initWorkspace();
    }
  </script>
</body>
</html>`;
}
