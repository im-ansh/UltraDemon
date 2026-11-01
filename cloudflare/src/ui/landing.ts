// UltraSearch — Developer Console & Landing Page UI
// High-performance, reactive developer platform served directly from Cloudflare Edge.
// Theme: Light, Pure White & Monochrome. Zero gradients, zero purple/pink.
// Typography: Michelangelus Bold Italic (Uploaded Font Embedded via WOFF2 Data URI), Geist (Sans), Geist Mono (Numbers).

import { MICHELANGELUS_BOLD_ITALIC_WOFF2_B64, MICHELANGELUS_REGULAR_WOFF2_B64 } from './font-data';

export function renderLandingPage(origin: string, supabaseUrl: string, supabaseAnonKey: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="light scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UltraSearch — Sovereign Web Search API & Index for AI Agents</title>
  <meta name="description" content="Ultra-fast, sub-50ms web search API for AI agents. 100% autonomous edge web crawler, BM25 full-text index on Cloudflare D1, and native Model Context Protocol (MCP) server.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>⚡</text></svg>">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Fonts: Geist Sans & Geist Mono -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  
  <!-- Supabase JS Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Geist"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
            serif: ['"Michelangelus"', 'serif'],
            mono: ['"Geist Mono"', '"JetBrains Mono"', 'monospace'],
            num: ['"Geist Mono"', 'monospace'],
          },
          colors: {
            neutral: {
              50: '#fafafa',
              100: '#f4f4f5',
              200: '#e4e4e7',
              300: '#d4d4d8',
              400: '#a1a1aa',
              500: '#71717a',
              600: '#52525b',
              700: '#3f3f46',
              800: '#27272a',
              900: '#18181b',
              950: '#09090b',
            }
          }
        }
      }
    }
  </script>

  <style>
    /* Direct Data-URI Embedded WOFF2 of the uploaded Michelangelus font */
    @font-face {
      font-family: 'Michelangelus';
      src: url('data:font/woff2;base64,${MICHELANGELUS_BOLD_ITALIC_WOFF2_B64}') format('woff2');
      font-weight: 700;
      font-style: italic;
      font-display: swap;
    }
    @font-face {
      font-family: 'Michelangelus';
      src: url('data:font/woff2;base64,${MICHELANGELUS_BOLD_ITALIC_WOFF2_B64}') format('woff2');
      font-weight: 600;
      font-style: italic;
      font-display: swap;
    }
    @font-face {
      font-family: 'Michelangelus';
      src: url('data:font/woff2;base64,${MICHELANGELUS_BOLD_ITALIC_WOFF2_B64}') format('woff2');
      font-weight: 400;
      font-style: italic;
      font-display: swap;
    }
    @font-face {
      font-family: 'Michelangelus';
      src: url('data:font/woff2;base64,${MICHELANGELUS_REGULAR_WOFF2_B64}') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'Michelangelus';
      src: url('data:font/woff2;base64,${MICHELANGELUS_BOLD_ITALIC_WOFF2_B64}') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }

    /* Base Typography: Light Monochrome Theme */
    html {
      color-scheme: light;
    }
    body {
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      background-color: #ffffff;
      color: #09090b;
      line-height: 1.5;
      text-align: start;
      overflow-wrap: break-word;
    }

    /* Serif Texts: Michelangelus Bold Italic */
    .font-serif, .serif-italic, .serif-text, em.serif {
      font-family: 'Michelangelus', 'Newsreader', 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
      font-weight: 700;
      font-style: italic;
      font-size-adjust: from-font;
    }

    /* Numbers: Geist Mono with Tabular Figures */
    .font-num, .num, [data-num], .tabular-num {
      font-family: 'Geist Mono', monospace;
      font-variant-numeric: tabular-nums;
      font-feature-settings: "tnum" 1;
    }

    /* Modern Text Wrapping */
    h1, h2, h3, h4, .text-balance {
      text-wrap: balance;
    }
    p, .text-pretty {
      text-wrap: pretty;
    }

    /* Clean Monochrome Card (Zero Gradients) */
    .card-mono {
      background: #ffffff;
      border: 1px solid #e4e4e7;
      transition: all 0.2s ease;
    }
    .card-mono:hover {
      border-color: #a1a1aa;
      box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.05);
    }

    /* Code Scrollbar */
    .code-scroll::-webkit-scrollbar {
      height: 6px;
      width: 6px;
    }
    .code-scroll::-webkit-scrollbar-thumb {
      background: #d4d4d8;
      border-radius: 4px;
    }
  </style>
</head>
<body class="min-h-screen bg-white text-neutral-950 selection:bg-black selection:text-white antialiased">

  <!-- Navbar -->
  <header class="sticky top-0 z-50 backdrop-blur-md bg-white/90 border-b border-neutral-200">
    <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <a href="/" class="flex items-center gap-2.5 group">
          <span class="text-xl">⚡</span>
          <span class="font-extrabold text-lg tracking-tight text-neutral-950 flex items-center gap-1.5">
            UltraSearch
            <span class="font-serif text-sm font-bold italic text-neutral-600">edge</span>
          </span>
        </a>
        <span class="px-2 py-0.5 text-[10px] font-semibold font-num bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-md">v1.0.0</span>
      </div>

      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-600">
        <a href="#playground" class="hover:text-black transition">Playground</a>
        <a href="#console" class="hover:text-black transition">Developer Console</a>
        <a href="#crawler" class="hover:text-black transition">Crawler</a>
        <a href="#mcp" class="hover:text-black transition">MCP Protocol</a>
        <a href="#pricing" class="hover:text-black transition">Pricing</a>
      </nav>

      <!-- Auth Bar in Navbar -->
      <div class="flex items-center gap-2.5">
        <div id="navAuthLoggedOut" class="flex items-center gap-2">
          <button onclick="openAuthModal('signin')" class="px-3.5 py-1.5 text-xs font-semibold text-neutral-700 hover:text-black border border-neutral-200 rounded-lg hover:bg-neutral-50 transition">
            Sign In
          </button>
          <button onclick="openAuthModal('signup')" class="px-4 py-1.5 text-xs font-semibold rounded-lg bg-black text-white hover:bg-neutral-800 transition shadow-xs">
            Sign Up
          </button>
        </div>

        <div id="navAuthLoggedIn" class="hidden flex items-center gap-2.5">
          <div class="flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-800">
            <span class="w-1.5 h-1.5 rounded-full bg-black"></span>
            <span id="navUserEmail" class="max-w-[150px] truncate font-num text-[11px]"></span>
          </div>
          <button onclick="handleSignOut()" class="px-3 py-1 text-xs font-medium text-neutral-600 hover:text-black border border-neutral-200 hover:border-neutral-400 rounded-lg transition">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Auth Modal (Sign In / Sign Up) -->
  <div id="authModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs hidden">
    <div class="bg-white p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl relative border border-neutral-300">
      <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-neutral-400 hover:text-black text-lg transition">✕</button>
      
      <div class="flex items-center gap-2.5 mb-6">
        <span class="text-2xl">⚡</span>
        <div>
          <h3 id="authModalTitle" class="text-lg font-bold text-neutral-950 flex items-center gap-1.5">
            Sign In to <span class="font-serif font-bold italic text-black">UltraSearch</span>
          </h3>
          <p class="text-xs text-neutral-500">Manage your sovereign search keys & usage quota</p>
        </div>
      </div>

      <!-- Tabs: Sign In vs Sign Up -->
      <div class="grid grid-cols-2 gap-1 p-1 bg-neutral-100 rounded-xl mb-5 text-xs border border-neutral-200">
        <button id="authTabSignIn" onclick="switchAuthMode('signin')" class="py-2 rounded-lg font-semibold bg-black text-white transition">Sign In</button>
        <button id="authTabSignUp" onclick="switchAuthMode('signup')" class="py-2 rounded-lg font-semibold text-neutral-600 hover:text-black transition">Create Account</button>
      </div>

      <!-- Auth Form -->
      <form id="authForm" onsubmit="handleAuthSubmit(event)" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1">Email Address</label>
          <input 
            type="email" 
            id="authEmail" 
            placeholder="developer@example.com" 
            required 
            class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-sm focus:outline-none focus:bg-white focus:border-black transition"
          />
        </div>
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1">Password</label>
          <input 
            type="password" 
            id="authPassword" 
            placeholder="••••••••" 
            required 
            minlength="6"
            class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-sm focus:outline-none focus:bg-white focus:border-black transition"
          />
        </div>

        <div id="authAlert" class="hidden p-3 rounded-xl text-xs font-medium"></div>

        <button 
          type="submit" 
          id="authSubmitBtn"
          class="w-full py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2"
        >
          <span id="authSubmitText">Sign In</span>
          <span id="authSpinner" class="hidden animate-spin font-num">⟳</span>
        </button>
      </form>

      <div class="mt-4 pt-4 border-t border-neutral-100 text-center text-[11px] text-neutral-500">
        Protected by Supabase Auth · Encrypted with bcrypt
      </div>
    </div>
  </div>

  <!-- Hero Section -->
  <section class="max-w-7xl mx-auto px-6 pt-16 pb-14 text-center">
    <!-- Live Status Pill -->
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 mb-8">
      <span class="w-2 h-2 rounded-full bg-black"></span>
      <span class="font-medium">Autonomous Edge Search Engine</span>
      <span class="text-neutral-400">·</span>
      <span class="font-num font-semibold text-neutral-900">330+</span> Cities
      <span class="text-neutral-400">·</span>
      <span class="font-num font-semibold text-neutral-900">&lt; 40ms</span> P50
    </div>

    <!-- Main Headline with Michelangelus Bold Italic Accent -->
    <h1 class="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight mb-5 max-w-4xl mx-auto leading-[1.1] text-neutral-950">
      The <span class="font-serif font-bold italic text-black underline decoration-neutral-300 decoration-2 underline-offset-4">Sovereign Web Search</span> Built for AI Agents
    </h1>

    <!-- Manifesto Quote in Michelangelus Bold Italic -->
    <div class="max-w-3xl mx-auto mb-8 space-y-3">
      <p class="font-serif font-bold italic text-lg sm:text-2xl text-neutral-800 tracking-tight">
        &ldquo;Zero 3rd-party APIs. Zero query telemetry leaks. Sub-50 millisecond edge intelligence.&rdquo;
      </p>
      <p class="text-base sm:text-lg text-neutral-600 max-w-2xl mx-auto text-pretty">
        Direct crawler, native BM25 ranking on Cloudflare D1, and Model Context Protocol (MCP) server for Claude Desktop, Cursor, and autonomous agent loops.
      </p>
    </div>

    <!-- Action Buttons (High-contrast Monochrome) -->
    <div class="flex flex-wrap items-center justify-center gap-3.5 mb-14">
      <a href="#playground" class="px-5 py-3 text-sm font-semibold rounded-xl bg-black text-white hover:bg-neutral-800 transition shadow-sm flex items-center gap-2">
        <span>⚡ Try Live Playground</span>
      </a>
      <a href="#console" class="px-5 py-3 text-sm font-semibold rounded-xl bg-white hover:bg-neutral-50 text-neutral-950 border border-neutral-300 transition flex items-center gap-2">
        <span>🔑 Provision API Key</span>
      </a>
      <a href="/openapi.json" target="_blank" class="px-4 py-3 text-sm font-num text-neutral-600 hover:text-black transition flex items-center gap-1.5">
        <span>/openapi.json</span>
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/></svg>
      </a>
    </div>

    <!-- Live Latency Benchmark Comparison Card (Monochrome Bars) -->
    <div class="card-mono max-w-3xl mx-auto p-6 rounded-2xl mb-12 text-left bg-neutral-50/60 border border-neutral-200">
      <div class="flex items-center justify-between mb-4">
        <div class="text-xs font-semibold uppercase tracking-wider text-neutral-700 flex items-center gap-2">
          <span>⚡ Live Search Latency Benchmark</span>
          <span class="px-2 py-0.5 rounded bg-black text-white text-[10px] font-num font-bold">P50 Speed</span>
        </div>
        <span class="font-serif font-bold italic text-xs text-neutral-800">10x to 25x faster</span>
      </div>

      <div class="space-y-3 font-num text-xs">
        <!-- UltraSearch -->
        <div>
          <div class="flex justify-between text-neutral-950 mb-1">
            <span class="font-bold flex items-center gap-1.5">
              <span>⚡ UltraSearch (D1 Edge + KV)</span>
              <span class="text-[10px] bg-neutral-200 text-neutral-800 px-1.5 py-0.2 rounded font-sans font-bold">Fastest</span>
            </span>
            <span class="font-bold text-black">34ms</span>
          </div>
          <div class="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
            <div class="h-full bg-black rounded-full" style="width: 7%"></div>
          </div>
        </div>

        <!-- Brave Search API -->
        <div>
          <div class="flex justify-between text-neutral-600 mb-1">
            <span>Brave Search API</span>
            <span>460ms</span>
          </div>
          <div class="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
            <div class="h-full bg-neutral-400 rounded-full" style="width: 55%"></div>
          </div>
        </div>

        <!-- Serper / Google API -->
        <div>
          <div class="flex justify-between text-neutral-600 mb-1">
            <span>Serper API (Google Scraper)</span>
            <span>640ms</span>
          </div>
          <div class="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
            <div class="h-full bg-neutral-400 rounded-full" style="width: 76%"></div>
          </div>
        </div>

        <!-- Tavily AI Search -->
        <div>
          <div class="flex justify-between text-neutral-600 mb-1">
            <span>Tavily AI Search</span>
            <span>820ms</span>
          </div>
          <div class="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
            <div class="h-full bg-neutral-400 rounded-full" style="width: 98%"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Live Stats Grid (All Numbers in Geist Mono, Clean Monochrome Cards) -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto text-left">
      <div class="card-mono p-5 rounded-xl">
        <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Edge Latency</div>
        <div class="text-3xl font-bold font-num text-neutral-950 flex items-baseline gap-1">
          <span>&lt; 40</span><span class="text-sm font-sans font-normal text-neutral-600">ms</span>
        </div>
        <div class="text-[11px] text-neutral-500 mt-1 font-serif font-bold italic">Global P50 query time</div>
      </div>
      <div class="card-mono p-5 rounded-xl">
        <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Ranking Model</div>
        <div class="text-2xl font-bold text-neutral-950 flex items-baseline gap-1.5">
          <span>BM25</span>
          <span class="text-xs font-num font-normal text-neutral-600">FTS5</span>
        </div>
        <div class="text-[11px] text-neutral-500 mt-1 font-serif font-bold italic">SQLite full text ranking</div>
      </div>
      <div class="card-mono p-5 rounded-xl">
        <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">Edge Network</div>
        <div class="text-3xl font-bold font-num text-neutral-950">
          <span>330+</span>
        </div>
        <div class="text-[11px] text-neutral-500 mt-1 font-serif font-bold italic">Cloudflare PoP cities</div>
      </div>
      <div class="card-mono p-5 rounded-xl">
        <div class="text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-1">KV Hot Cache</div>
        <div class="text-3xl font-bold font-num text-neutral-950 flex items-baseline gap-1">
          <span>&lt; 5</span><span class="text-sm font-sans font-normal text-neutral-600">ms</span>
        </div>
        <div class="text-[11px] text-neutral-500 mt-1 font-serif font-bold italic">Global replication cache</div>
      </div>
    </div>
  </section>

  <!-- Interactive Playground -->
  <section id="playground" class="max-w-7xl mx-auto px-6 py-14 border-t border-neutral-200">
    <div class="text-center mb-8">
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mb-2 text-neutral-950">
        Live Search <span class="font-serif font-bold italic text-black">Playground</span>
      </h2>
      <p class="text-neutral-600 text-sm max-w-xl mx-auto text-pretty">
        Search our autonomous edge index in real-time. Test sub-50ms execution and BM25 ranking.
      </p>

      <!-- Instant Query Suggestions Pills -->
      <div class="flex flex-wrap items-center justify-center gap-2 mt-4">
        <span class="text-xs text-neutral-500">Quick queries:</span>
        <button onclick="setQuery('What is Python?')" class="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 border border-neutral-200 transition">
          ⚡ What is Python?
        </button>
        <button onclick="setQuery('Cloudflare Workers AI')" class="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 border border-neutral-200 transition">
          🌐 Cloudflare Workers AI
        </button>
        <button onclick="setQuery('Autonomous AI Agents')" class="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 border border-neutral-200 transition">
          🤖 Autonomous AI Agents
        </button>
        <button onclick="setQuery('BM25 Ranking Algorithm')" class="px-3 py-1 rounded-full bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 border border-neutral-200 transition">
          📐 BM25 Ranking Algorithm
        </button>
      </div>
    </div>

    <div class="card-mono p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto shadow-xs">
      <!-- Search Input Form -->
      <form id="searchForm" onsubmit="handleSearch(event)" class="space-y-4">
        <div class="relative">
          <input 
            type="text" 
            id="queryInput" 
            value="What is Python?" 
            placeholder="Type a search query (e.g. What is Python?, Quantum computing, Cloudflare Workers...)"
            class="w-full pl-11 pr-28 py-3.5 bg-neutral-50 border border-neutral-300 rounded-xl text-neutral-950 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition font-medium text-sm"
            required
          />
          <span class="absolute left-3.5 top-3.5 text-neutral-400 text-base">🔍</span>
          <button 
            type="submit" 
            id="searchBtn"
            class="absolute right-2 top-2 px-5 py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center gap-1.5"
          >
            <span>Search</span>
            <span id="searchSpinner" class="hidden animate-spin font-num">⟳</span>
          </button>
        </div>

        <!-- Controls Bar -->
        <div class="flex flex-wrap items-center justify-between gap-4 pt-2 text-xs text-neutral-600 border-t border-neutral-100">
          <div class="flex items-center gap-2">
            <span>Search Mode:</span>
            <div class="inline-flex rounded-lg bg-neutral-100 p-0.5 border border-neutral-200">
              <button type="button" onclick="setMode(1)" id="modeBtn1" class="px-2.5 py-1 rounded-md text-white bg-black font-num font-medium">1: Instant</button>
              <button type="button" onclick="setMode(2)" id="modeBtn2" class="px-2.5 py-1 rounded-md text-neutral-600 hover:text-black font-num">2: Standard</button>
              <button type="button" onclick="setMode(3)" id="modeBtn3" class="px-2.5 py-1 rounded-md text-neutral-600 hover:text-black font-num">3: Deep</button>
            </div>
          </div>

          <div class="flex items-center gap-3">
            <label class="flex items-center gap-1.5 cursor-pointer">
              <input type="checkbox" id="useCacheCheck" checked class="rounded border-neutral-300 text-black focus:ring-black">
              <span>KV Hot Cache</span>
            </label>
            <div id="latencyBadge" class="hidden px-2 py-0.5 rounded-md bg-neutral-100 text-neutral-900 border border-neutral-300 font-num font-bold text-[11px]">
              0ms
            </div>
          </div>
        </div>
      </form>

      <!-- Results Area -->
      <div id="resultsContainer" class="mt-6 pt-6 border-t border-neutral-100 space-y-3.5">
        <div class="text-center py-6 text-neutral-500 text-sm">
          Click <span class="font-semibold text-neutral-900">"Search"</span> above or pick a suggested query to test the sovereign engine.
        </div>
      </div>

      <!-- Raw JSON View Toggle -->
      <div id="rawJsonBox" class="mt-6 hidden">
        <details class="text-xs">
          <summary class="cursor-pointer text-neutral-600 hover:text-black font-num py-2">View Raw JSON Response</summary>
          <pre id="jsonOutput" class="p-4 bg-neutral-900 border border-neutral-800 rounded-xl font-mono text-[11px] text-neutral-200 overflow-x-auto code-scroll max-h-96"></pre>
        </details>
      </div>
    </div>
  </section>

  <!-- Developer Console & API Key Manager -->
  <section id="console" class="max-w-7xl mx-auto px-6 py-14 border-t border-neutral-200">
    <div class="text-center mb-10">
      <span class="px-3 py-1 text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-full font-num">Developer Platform</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-2 text-neutral-950">
        API Keys & <span class="font-serif font-bold italic text-black">Developer Console</span>
      </h2>
      <p class="text-neutral-600 text-sm max-w-xl mx-auto text-pretty">
        Provision, monitor, and revoke your UltraSearch API keys directly stored in Cloudflare D1.
      </p>
    </div>

    <!-- Auth Status Banner -->
    <div id="authPromptBanner" class="card-mono p-4 sm:p-5 rounded-xl mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50 border border-neutral-200">
      <div class="flex items-center gap-3">
        <span class="text-xl">🔒</span>
        <div class="text-xs">
          <span class="font-semibold text-neutral-950">Sync your API keys across devices:</span>
          <span class="text-neutral-600"> Sign in with Supabase Auth to bind generated keys permanently to your verified email.</span>
        </div>
      </div>
      <button onclick="openAuthModal('signin')" class="px-4 py-2 text-xs font-semibold rounded-lg bg-black text-white hover:bg-neutral-800 transition whitespace-nowrap shadow-xs">
        Sign In / Sign Up
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Create Key Card -->
      <div class="card-mono p-6 rounded-2xl">
        <h3 class="text-base font-bold text-neutral-950 mb-4 flex items-center gap-2">
          <span>🔑</span> Generate New API Key
        </h3>
        <form onsubmit="handleCreateKey(event)" class="space-y-4">
          <div>
            <label class="block text-xs font-medium text-neutral-700 mb-1">User Identifier / Account</label>
            <input 
              type="text" 
              id="newKeyUserId" 
              placeholder="e.g. dev_agent_01" 
              required
              class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-sm focus:outline-none focus:bg-white focus:border-black transition"
            />
          </div>
          <div>
            <label class="block text-xs font-medium text-neutral-700 mb-1">Plan Tier</label>
            <select id="newKeyPlan" class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-sm focus:outline-none focus:bg-white focus:border-black transition font-num">
              <option value="free">Free (100 req/day)</option>
              <option value="pro" selected>Pro (10,000 req/day)</option>
              <option value="ultra">Ultra (100,000 req/day)</option>
              <option value="enterprise">Enterprise (Unlimited)</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-neutral-700 mb-1">Key Label (Optional)</label>
            <input 
              type="text" 
              id="newKeyLabel" 
              placeholder="e.g. Claude Desktop Assistant" 
              class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-sm focus:outline-none focus:bg-white focus:border-black transition"
            />
          </div>
          <button 
            type="submit" 
            class="w-full py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs"
          >
            Create API Key
          </button>
        </form>

        <!-- New Key Alert Box -->
        <div id="newKeyAlert" class="mt-4 p-3.5 bg-neutral-100 border border-neutral-300 rounded-xl hidden">
          <div class="text-[11px] font-semibold text-neutral-950 mb-1">✅ API Key Generated! (Shown once)</div>
          <div class="flex items-center justify-between gap-2 bg-white border border-neutral-200 p-2 rounded-lg font-mono text-xs text-neutral-950">
            <span id="newKeyDisplay" class="truncate font-num"></span>
            <button onclick="copyToClipboard(document.getElementById('newKeyDisplay').innerText)" class="text-xs text-neutral-900 hover:text-black font-semibold underline">Copy</button>
          </div>
        </div>
      </div>

      <!-- Active Keys List & Usage -->
      <div class="lg:col-span-2 space-y-6">
        <!-- Usage Overview -->
        <div class="card-mono p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-neutral-950 flex items-center gap-2">
              <span>📊</span> Quota & Rate Limit Monitor
            </h3>
            <button onclick="refreshUsage()" class="text-xs text-neutral-600 hover:text-black font-medium transition">⟳ Refresh</button>
          </div>
          
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div class="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <div class="text-xs text-neutral-500 mb-1">Requests Today</div>
              <div id="statUsed" class="text-2xl font-bold font-num text-neutral-950">—</div>
            </div>
            <div class="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <div class="text-xs text-neutral-500 mb-1">Daily Quota Limit</div>
              <div id="statLimit" class="text-2xl font-bold font-num text-neutral-950">—</div>
            </div>
            <div class="bg-neutral-50 p-3.5 rounded-xl border border-neutral-200">
              <div class="text-xs text-neutral-500 mb-1">Remaining Calls</div>
              <div id="statRemaining" class="text-2xl font-bold font-num text-neutral-950">—</div>
            </div>
          </div>

          <div>
            <div class="flex justify-between text-xs text-neutral-600 mb-1.5 font-num">
              <span>Daily Usage Meter</span>
              <span id="usagePercent">0%</span>
            </div>
            <div class="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div id="usageBar" class="h-full bg-black rounded-full transition-all duration-500" style="width: 0%"></div>
            </div>
          </div>
        </div>

        <!-- Stored Keys List -->
        <div class="card-mono p-6 rounded-2xl">
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-neutral-950 flex items-center gap-2">
              <span>🗄️</span> Your Active Keys
            </h3>
            <span id="keysStatusSubtext" class="text-xs text-neutral-500">Stored in your browser & account</span>
          </div>

          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-neutral-500 border-b border-neutral-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th class="pb-2">API Key</th>
                  <th class="pb-2">Plan</th>
                  <th class="pb-2">Label</th>
                  <th class="pb-2 text-right">Actions</th>
                </tr>
              </thead>
              <tbody id="keysTableBody" class="divide-y border-b border-neutral-200 divide-neutral-100">
                <tr>
                  <td colspan="4" class="py-4 text-center text-neutral-500">No keys generated yet. Use the form to create one.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Live Edge Crawler Controller -->
  <section id="crawler" class="max-w-7xl mx-auto px-6 py-14 border-t border-neutral-200">
    <div class="text-center mb-10">
      <span class="px-3 py-1 text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-full font-num">Autonomous Index</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-2 text-neutral-950">
        Autonomous Edge <span class="font-serif font-bold italic text-black">Crawler & Index</span>
      </h2>
      <p class="text-neutral-600 text-sm max-w-xl mx-auto text-pretty">
        Instruct the edge crawler to fetch, sanitize, and index any web domain into Cloudflare D1 FTS5.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- Crawl Form -->
      <div class="card-mono p-6 rounded-2xl lg:col-span-2">
        <h3 class="text-base font-bold text-neutral-950 mb-4 flex items-center gap-2">
          <span>🕷️</span> Ingest URL into Index
        </h3>
        <form onsubmit="handleCrawl(event)" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div class="sm:col-span-3">
              <label class="block text-xs font-medium text-neutral-700 mb-1">Target Website / Page URL</label>
              <input 
                type="url" 
                id="crawlUrlInput" 
                placeholder="https://docs.python.org/3/" 
                required
                class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-sm focus:outline-none focus:bg-white focus:border-black transition"
              />
            </div>
            <div>
              <label class="block text-xs font-medium text-neutral-700 mb-1">Crawl Depth</label>
              <select id="crawlDepthInput" class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-sm focus:outline-none focus:bg-white focus:border-black transition font-num">
                <option value="0">0 (Single Page)</option>
                <option value="1" selected>1 (Page + Outlinks)</option>
                <option value="2">2 (Deep Discovery)</option>
              </select>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <p class="text-[11px] text-neutral-500">Cloudflare HTMLRewriter strips scripts/styles and indexes clean text into D1 SQLite BM25.</p>
            <button 
              type="submit" 
              id="crawlBtn"
              class="px-5 py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center gap-1.5"
            >
              <span>Crawl & Index</span>
              <span id="crawlSpinner" class="hidden animate-spin font-num">⟳</span>
            </button>
          </div>
        </form>

        <div id="crawlResultBox" class="mt-4 p-4 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 hidden">
          <div id="crawlStatusMsg" class="font-bold text-neutral-950 mb-1"></div>
          <pre id="crawlDetails" class="code-scroll max-h-48 overflow-y-auto text-[11px] text-neutral-700 font-num"></pre>
        </div>
      </div>

      <!-- Live Index Stats Card -->
      <div class="card-mono p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between mb-4">
            <h3 class="text-base font-bold text-neutral-950 flex items-center gap-2">
              <span>📈</span> D1 Index Telemetry
            </h3>
            <button onclick="refreshCrawlerStats()" class="text-xs text-neutral-600 hover:text-black font-medium transition">⟳ Refresh</button>
          </div>
          <div class="space-y-3.5">
            <div class="flex justify-between items-center py-2 border-b border-neutral-100">
              <span class="text-xs text-neutral-600">Total Indexed Documents</span>
              <span id="crawlerDocCount" class="font-bold font-num text-sm text-neutral-950">...</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-neutral-100">
              <span class="text-xs text-neutral-600">Total Indexed Words</span>
              <span id="crawlerWordCount" class="font-bold font-num text-sm text-neutral-950">...</span>
            </div>
            <div class="flex justify-between items-center py-2 border-b border-neutral-100">
              <span class="text-xs text-neutral-600">Domains Covered</span>
              <span id="crawlerDomainCount" class="font-bold font-num text-sm text-neutral-950">...</span>
            </div>
            <div class="flex justify-between items-center py-2">
              <span class="text-xs text-neutral-600">Pending URL Queue</span>
              <span id="crawlerQueuePending" class="font-bold font-num text-sm text-neutral-950">...</span>
            </div>
          </div>
        </div>
        <div class="mt-4 pt-4 border-t border-neutral-100 text-[11px] text-neutral-500">
          Background Cron Triggers process queue every <span class="font-num text-neutral-900 font-semibold">15</span> minutes automatically at edge.
        </div>
      </div>
    </div>
  </section>

  <!-- Integration & MCP Hub -->
  <section id="mcp" class="max-w-7xl mx-auto px-6 py-14 border-t border-neutral-200">
    <div class="text-center mb-10">
      <span class="px-3 py-1 text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-full font-num">Agent Native</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-2 text-neutral-950">
        Model Context <span class="font-serif font-bold italic text-black">Protocol Hub</span>
      </h2>
      <p class="text-neutral-600 text-sm max-w-xl mx-auto text-pretty">
        Connect sovereign search directly to Claude Desktop, Cursor, Python, and TypeScript agents.
      </p>
    </div>

    <div class="card-mono p-6 sm:p-8 rounded-2xl max-w-4xl mx-auto">
      <!-- Tabs -->
      <div class="flex flex-wrap gap-2 border-b border-neutral-200 pb-3.5 mb-6">
        <button onclick="switchTab('tabClaude')" id="btnTabClaude" class="px-4 py-2 text-xs font-semibold rounded-lg bg-black text-white transition">Claude Desktop MCP</button>
        <button onclick="switchTab('tabCursor')" id="btnTabCursor" class="px-4 py-2 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition">Cursor MCP</button>
        <button onclick="switchTab('tabPython')" id="btnTabPython" class="px-4 py-2 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition">Python</button>
        <button onclick="switchTab('tabNode')" id="btnTabNode" class="px-4 py-2 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition">TypeScript</button>
        <button onclick="switchTab('tabCurl')" id="btnTabCurl" class="px-4 py-2 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition">cURL</button>
      </div>

      <!-- Tab Content: Claude Desktop -->
      <div id="tabClaude" class="space-y-4">
        <p class="text-xs text-neutral-600">Add this to your <code class="text-neutral-900 font-num bg-neutral-100 px-1.5 py-0.5 rounded">claude_desktop_config.json</code> to give Claude live web search capabilities:</p>
        <div class="relative">
          <pre class="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">{
  "mcpServers": {
    "ultrasearch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sse", "${origin}/mcp/sse"],
      "env": {
        "ULTRASEARCH_API_KEY": "us_your_key_here"
      }
    }
  }
}</pre>
          <button onclick="copyToClipboard(this.previousElementSibling.innerText)" class="absolute top-3 right-3 text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded transition">Copy</button>
        </div>
      </div>

      <!-- Tab Content: Cursor -->
      <div id="tabCursor" class="space-y-4 hidden">
        <p class="text-xs text-neutral-600">Add this to <code class="text-neutral-900 font-num bg-neutral-100 px-1.5 py-0.5 rounded">.cursor/mcp.json</code> in your project root:</p>
        <div class="relative">
          <pre class="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">{
  "mcpServers": {
    "ultrasearch": {
      "url": "${origin}/mcp",
      "headers": {
        "X-API-Key": "us_your_key_here"
      }
    }
  }
}</pre>
          <button onclick="copyToClipboard(this.previousElementSibling.innerText)" class="absolute top-3 right-3 text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded transition">Copy</button>
        </div>
      </div>

      <!-- Tab Content: Python -->
      <div id="tabPython" class="space-y-4 hidden">
        <p class="text-xs text-neutral-600">Query the autonomous search engine using Python:</p>
        <div class="relative">
          <pre class="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">import requests

url = "${origin}/v1/search"
headers = {
    "X-API-Key": "us_your_key_here",
    "Content-Type": "application/json"
}
payload = {
    "query": "What is Python?",
    "num_results": 5,
    "mode": 1  # 1 = Instant, 2 = Standard, 3 = Deep Research
}

resp = requests.post(url, json=payload, headers=headers)
print(resp.json())</pre>
          <button onclick="copyToClipboard(this.previousElementSibling.innerText)" class="absolute top-3 right-3 text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded transition">Copy</button>
        </div>
      </div>

      <!-- Tab Content: Node -->
      <div id="tabNode" class="space-y-4 hidden">
        <p class="text-xs text-neutral-600">TypeScript / Node.js fetch implementation:</p>
        <div class="relative">
          <pre class="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">const response = await fetch("${origin}/v1/search", {
  method: "POST",
  headers: {
    "X-API-Key": "us_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    query: "Quantum computing breakthroughs",
    num_results: 5,
    mode: 2
  })
});

const data = await response.json();
console.log(data);</pre>
          <button onclick="copyToClipboard(this.previousElementSibling.innerText)" class="absolute top-3 right-3 text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded transition">Copy</button>
        </div>
      </div>

      <!-- Tab Content: cURL -->
      <div id="tabCurl" class="space-y-4 hidden">
        <p class="text-xs text-neutral-600">Direct cURL execution:</p>
        <div class="relative">
          <pre class="p-4 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">curl -X POST "${origin}/v1/search" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: us_your_key_here" \\
  -d '{"query": "What is Python?", "num_results": 5}'</pre>
          <button onclick="copyToClipboard(this.previousElementSibling.innerText)" class="absolute top-3 right-3 text-xs bg-white/10 hover:bg-white/20 text-white px-2.5 py-1 rounded transition">Copy</button>
        </div>
      </div>
    </div>
  </section>

  <!-- Pricing Plans -->
  <section id="pricing" class="max-w-7xl mx-auto px-6 py-14 border-t border-neutral-200">
    <div class="text-center mb-10">
      <span class="px-3 py-1 text-xs font-semibold bg-neutral-100 text-neutral-800 border border-neutral-200 rounded-full font-num">Predictable Pricing</span>
      <h2 class="text-3xl sm:text-4xl font-extrabold tracking-tight mt-3 mb-2 text-neutral-950">
        Sovereign Search for <span class="font-serif font-bold italic text-black">Every Scale</span>
      </h2>
      <p class="text-neutral-600 text-sm max-w-xl mx-auto text-pretty">
        Predictable cost with zero third-party markups, designed for solo developers and enterprise autonomous fleets.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <!-- Free -->
      <div class="card-mono p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div class="text-sm font-semibold text-neutral-500 mb-1">Free</div>
          <div class="text-3xl font-extrabold text-neutral-950 mb-4 flex items-baseline gap-1 font-num">
            <span>$0</span>
            <span class="text-xs font-normal text-neutral-500 font-sans">/mo</span>
          </div>
          <ul class="text-xs text-neutral-700 space-y-2.5 mb-6">
            <li class="flex items-center gap-2"><span>✓</span> <span class="font-num font-semibold text-neutral-950">100</span> requests / day</li>
            <li class="flex items-center gap-2"><span>✓</span> <span class="font-num font-semibold text-neutral-950">10</span> results per query</li>
            <li class="flex items-center gap-2"><span>✓</span> Mode 1 Instant (<span class="font-num">50ms</span>)</li>
            <li class="flex items-center gap-2"><span>✓</span> KV Hot Cache (<span class="font-num">5ms</span>)</li>
          </ul>
        </div>
        <a href="#console" class="w-full py-2 text-center text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 transition">Get Free Key</a>
      </div>

      <!-- Pro (Featured with solid black border) -->
      <div class="card-mono p-6 rounded-2xl border-2 border-black relative flex flex-col justify-between shadow-sm">
        <div class="absolute -top-3 right-6 px-2.5 py-0.5 text-[10px] font-bold bg-black text-white rounded-full font-num">POPULAR</div>
        <div>
          <div class="text-sm font-semibold text-neutral-900 mb-1">Pro</div>
          <div class="text-3xl font-extrabold text-neutral-950 mb-4 flex items-baseline gap-1 font-num">
            <span>$29</span>
            <span class="text-xs font-normal text-neutral-500 font-sans">/mo</span>
          </div>
          <ul class="text-xs text-neutral-700 space-y-2.5 mb-6">
            <li class="flex items-center gap-2"><span>✓</span> <span class="font-num font-semibold text-neutral-950">10,000</span> requests / day</li>
            <li class="flex items-center gap-2"><span>✓</span> <span class="font-num font-semibold text-neutral-950">25</span> results per query</li>
            <li class="flex items-center gap-2"><span>✓</span> Mode 2 Standard Search</li>
            <li class="flex items-center gap-2"><span>✓</span> Full Edge Crawler Access</li>
            <li class="flex items-center gap-2"><span>✓</span> Full MCP Server Access</li>
          </ul>
        </div>
        <a href="#console" class="w-full py-2 text-center text-xs font-semibold rounded-lg bg-black hover:bg-neutral-800 text-white transition shadow-xs">Choose Pro</a>
      </div>

      <!-- Ultra -->
      <div class="card-mono p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div class="text-sm font-semibold text-neutral-500 mb-1">Ultra</div>
          <div class="text-3xl font-extrabold text-neutral-950 mb-4 flex items-baseline gap-1 font-num">
            <span>$99</span>
            <span class="text-xs font-normal text-neutral-500 font-sans">/mo</span>
          </div>
          <ul class="text-xs text-neutral-700 space-y-2.5 mb-6">
            <li class="flex items-center gap-2"><span>✓</span> <span class="font-num font-semibold text-neutral-950">100,000</span> requests / day</li>
            <li class="flex items-center gap-2"><span>✓</span> <span class="font-num font-semibold text-neutral-950">50</span> results per query</li>
            <li class="flex items-center gap-2"><span>✓</span> Mode 3 Deep Research</li>
            <li class="flex items-center gap-2"><span>✓</span> Batch URL Crawling</li>
            <li class="flex items-center gap-2"><span>✓</span> Priority Edge Execution</li>
          </ul>
        </div>
        <a href="#console" class="w-full py-2 text-center text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 transition">Choose Ultra</a>
      </div>

      <!-- Enterprise -->
      <div class="card-mono p-6 rounded-2xl flex flex-col justify-between">
        <div>
          <div class="text-sm font-semibold text-neutral-500 mb-1">Enterprise</div>
          <div class="text-3xl font-extrabold text-neutral-950 mb-4 flex items-baseline gap-1 font-num">
            <span>$499</span>
            <span class="text-xs font-normal text-neutral-500 font-sans">/mo</span>
          </div>
          <ul class="text-xs text-neutral-700 space-y-2.5 mb-6">
            <li class="flex items-center gap-2"><span>✓</span> <span class="font-num font-semibold text-neutral-950">Unlimited</span> Requests</li>
            <li class="flex items-center gap-2"><span>✓</span> <span class="font-num font-semibold text-neutral-950">100</span> results per query</li>
            <li class="flex items-center gap-2"><span>✓</span> Dedicated Crawl Capacity</li>
            <li class="flex items-center gap-2"><span>✓</span> Custom Domain Indexing</li>
            <li class="flex items-center gap-2"><span>✓</span> <span class="font-num">99.99%</span> SLA Guarantee</li>
          </ul>
        </div>
        <a href="mailto:support@ultrasearch.dev" class="w-full py-2 text-center text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-300 transition">Contact Us</a>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="border-t border-neutral-200 py-10 text-center text-xs text-neutral-500 bg-neutral-50/50">
    <div class="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <span class="font-bold text-neutral-900">⚡ UltraSearch</span>
        <span class="font-serif font-bold italic text-neutral-600">edge</span>
        <span>·</span>
        <span class="font-num">MIT License</span>
        <span>·</span>
        <span>100% Autonomous Web Search</span>
      </div>
      <div class="flex items-center gap-6 font-num text-neutral-600">
        <a href="/openapi.json" target="_blank" class="hover:text-black transition">/openapi.json</a>
        <a href="/health" target="_blank" class="hover:text-black transition">/health</a>
        <a href="https://github.com/im-ansh/UltraDemon" target="_blank" class="hover:text-black transition">GitHub Repo</a>
      </div>
    </div>
  </footer>

  <!-- Frontend Logic with Supabase Auth & Reactive State -->
  <script>
    const SUPABASE_URL = "${supabaseUrl}";
    const SUPABASE_ANON_KEY = "${supabaseAnonKey}";
    const STORAGE_KEY = 'ultrasearch_local_keys';

    let supabase = null;
    let currentUser = null;
    let currentAuthMode = 'signin';
    let currentMode = 1;

    // Initialize Supabase client
    if (window.supabase) {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

    // Modal controls
    function openAuthModal(mode) {
      currentAuthMode = mode;
      switchAuthMode(mode);
      document.getElementById('authAlert').classList.add('hidden');
      document.getElementById('authModal').classList.remove('hidden');
    }

    function closeAuthModal() {
      document.getElementById('authModal').classList.add('hidden');
    }

    function switchAuthMode(mode) {
      currentAuthMode = mode;
      const isSignIn = mode === 'signin';
      document.getElementById('authModalTitle').innerHTML = isSignIn 
        ? 'Sign In to <span class="font-serif font-bold italic text-black">UltraSearch</span>' 
        : 'Create an Account on <span class="font-serif font-bold italic text-black">UltraSearch</span>';
      document.getElementById('authSubmitText').innerText = isSignIn ? 'Sign In' : 'Sign Up';

      const tabIn = document.getElementById('authTabSignIn');
      const tabUp = document.getElementById('authTabSignUp');
      if (isSignIn) {
        tabIn.className = 'py-2 rounded-lg font-semibold bg-black text-white transition';
        tabUp.className = 'py-2 rounded-lg font-semibold text-neutral-600 hover:text-black transition';
      } else {
        tabIn.className = 'py-2 rounded-lg font-semibold text-neutral-600 hover:text-black transition';
        tabUp.className = 'py-2 rounded-lg font-semibold bg-black text-white transition';
      }
    }

    async function handleAuthSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      const alertBox = document.getElementById('authAlert');
      const spinner = document.getElementById('authSpinner');
      const submitBtn = document.getElementById('authSubmitBtn');

      if (!supabase) {
        alert('Supabase client failed to load');
        return;
      }

      spinner.classList.remove('hidden');
      submitBtn.disabled = true;
      alertBox.classList.add('hidden');

      try {
        if (currentAuthMode === 'signup') {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;

          alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-neutral-100 border border-neutral-300 text-neutral-900';
          alertBox.innerText = data.session 
            ? 'Account created and signed in successfully!'
            : 'Account created! Please check your email for the confirmation link.';
          alertBox.classList.remove('hidden');

          if (data.session) {
            setTimeout(() => closeAuthModal(), 1200);
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;

          alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-neutral-100 border border-neutral-300 text-neutral-900';
          alertBox.innerText = 'Signed in successfully!';
          alertBox.classList.remove('hidden');

          setTimeout(() => closeAuthModal(), 800);
        }
      } catch (err) {
        alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-neutral-100 border border-neutral-300 text-red-600';
        alertBox.innerText = err.message || 'Authentication error';
        alertBox.classList.remove('hidden');
      } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
      }
    }

    async function handleSignOut() {
      if (supabase) {
        await supabase.auth.signOut();
      }
    }

    function updateAuthUI(user) {
      currentUser = user;
      const loggedOutNav = document.getElementById('navAuthLoggedOut');
      const loggedInNav = document.getElementById('navAuthLoggedIn');
      const userEmailSpan = document.getElementById('navUserEmail');
      const banner = document.getElementById('authPromptBanner');
      const subtext = document.getElementById('keysStatusSubtext');
      const userIdInput = document.getElementById('newKeyUserId');

      if (user) {
        loggedOutNav.classList.add('hidden');
        loggedInNav.classList.remove('hidden');
        userEmailSpan.innerText = user.email || user.id;
        banner.classList.add('hidden');
        subtext.innerText = 'Synced with your Supabase account (' + (user.email || user.id) + ')';
        if (userIdInput && !userIdInput.value) {
          userIdInput.value = user.email || user.id;
        }
        loadRemoteKeys(user.id);
      } else {
        loggedOutNav.classList.remove('hidden');
        loggedInNav.classList.add('hidden');
        banner.classList.remove('hidden');
        subtext.innerText = 'Stored locally in this browser';
        renderKeysTable();
      }
    }

    async function loadRemoteKeys(userId) {
      try {
        const session = (await supabase.auth.getSession())?.data?.session;
        const headers = {};
        if (session) {
          headers['Authorization'] = 'Bearer ' + session.access_token;
        }
        const resp = await fetch('/v1/keys?user_id=' + encodeURIComponent(userId), { headers });
        const data = await resp.json();
        if (data.keys) {
          const localKeys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          const remoteKeyIds = new Set(data.keys.map(k => k.key_id));
          const merged = [...data.keys];
          localKeys.forEach(k => {
            if (!remoteKeyIds.has(k.key_id)) merged.push(k);
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          renderKeysTable();
        }
      } catch (e) {
        console.warn('Could not sync keys:', e);
        renderKeysTable();
      }
    }

    function setMode(m) {
      currentMode = m;
      [1, 2, 3].forEach(i => {
        const btn = document.getElementById('modeBtn' + i);
        if (i === m) {
          btn.className = 'px-2.5 py-1 rounded-md text-white bg-black font-num font-medium';
        } else {
          btn.className = 'px-2.5 py-1 rounded-md text-neutral-600 hover:text-black font-num';
        }
      });
    }

    function switchTab(tabId) {
      ['tabClaude', 'tabCursor', 'tabPython', 'tabNode', 'tabCurl'].forEach(id => {
        document.getElementById(id).classList.toggle('hidden', id !== tabId);
      });
      ['btnTabClaude', 'btnTabCursor', 'btnTabPython', 'btnTabNode', 'btnTabCurl'].forEach(id => {
        const isActive = id === 'btn' + tabId.charAt(0).toUpperCase() + tabId.slice(1);
        const btn = document.getElementById(id);
        if (btn) {
          btn.className = isActive 
            ? 'px-4 py-2 text-xs font-semibold rounded-lg bg-black text-white transition'
            : 'px-4 py-2 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black hover:bg-neutral-100 transition';
        }
      });
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard!');
    }

    function getActiveKey() {
      const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return keys.length > 0 ? keys[0].plain_key : '';
    }

    function setQuery(q) {
      document.getElementById('queryInput').value = q;
      const form = document.getElementById('searchForm');
      if (form) {
        handleSearch(new Event('submit'));
      }
    }

    async function handleSearch(e) {
      if (e && e.preventDefault) e.preventDefault();
      const query = document.getElementById('queryInput').value.trim();
      const useCache = document.getElementById('useCacheCheck').checked;
      const resultsDiv = document.getElementById('resultsContainer');
      const latencyBadge = document.getElementById('latencyBadge');
      const spinner = document.getElementById('searchSpinner');

      if (!query) return;

      spinner.classList.remove('hidden');
      resultsDiv.innerHTML = '<div class="text-center py-6 text-neutral-500 text-sm">Searching sovereign BM25 index across Cloudflare edge...</div>';

      const apiKey = getActiveKey();
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['X-API-Key'] = apiKey;

      const t0 = performance.now();
      try {
        const resp = await fetch('/v1/search', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            query,
            num_results: 5,
            mode: currentMode,
            use_cache: useCache
          })
        });

        const data = await resp.json();
        const duration = Math.round(performance.now() - t0);

        latencyBadge.innerText = (data.search_time_ms || duration) + 'ms' + (data.cached ? ' (KV Hit)' : '');
        latencyBadge.classList.remove('hidden');

        document.getElementById('rawJsonBox').classList.remove('hidden');
        document.getElementById('jsonOutput').innerText = JSON.stringify(data, null, 2);

        if (data.results && data.results.length > 0) {
          resultsDiv.innerHTML = data.results.map((r, i) => \`
            <div class="p-4 sm:p-5 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition">
              <div class="flex items-center justify-between text-[11px] text-neutral-500 mb-1.5 font-num">
                <span class="truncate max-w-md text-neutral-700 font-mono">\${r.url}</span>
                <span class="bg-neutral-200 text-neutral-900 px-2 py-0.5 rounded font-num font-semibold">BM25 Score: \${r.score || '0.95'}</span>
              </div>
              <a href="\${r.url}" target="_blank" class="text-base font-bold text-neutral-950 hover:underline transition block mb-1">
                \${r.title}
              </a>
              <p class="text-xs text-neutral-600 leading-relaxed text-pretty">\${r.snippet}</p>
            </div>
          \`).join('');
        } else {
          resultsDiv.innerHTML = '<div class="text-center py-6 text-neutral-500 text-sm">No results found for this query in the current index. Try crawling more sites below!</div>';
        }
      } catch (err) {
        resultsDiv.innerHTML = '<div class="p-4 bg-neutral-100 border border-neutral-300 rounded-xl text-red-600 text-xs font-num">Error: ' + err.message + '</div>';
      } finally {
        spinner.classList.add('hidden');
      }
    }

    async function handleCreateKey(e) {
      e.preventDefault();
      const userId = document.getElementById('newKeyUserId').value.trim();
      const plan = document.getElementById('newKeyPlan').value;
      const label = document.getElementById('newKeyLabel').value.trim();

      const headers = { 'Content-Type': 'application/json' };
      if (supabase) {
        const session = (await supabase.auth.getSession())?.data?.session;
        if (session) {
          headers['Authorization'] = 'Bearer ' + session.access_token;
        }
      }

      try {
        const resp = await fetch('/v1/keys', {
          method: 'POST',
          headers,
          body: JSON.stringify({ user_id: userId, plan, label })
        });
        const data = await resp.json();

        if (data.plain_key) {
          document.getElementById('newKeyDisplay').innerText = data.plain_key;
          document.getElementById('newKeyAlert').classList.remove('hidden');

          // Save to local storage
          const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
          keys.unshift({
            plain_key: data.plain_key,
            key_id: data.key_id,
            plan: data.plan,
            label: data.label || 'Default',
            created_at: new Date().toLocaleDateString()
          });
          localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
          renderKeysTable();
          refreshUsage();
        } else {
          alert('Error: ' + (data.error || 'Failed to create key'));
        }
      } catch (err) {
        alert('Request failed: ' + err.message);
      }
    }

    function renderKeysTable() {
      const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      const tbody = document.getElementById('keysTableBody');

      if (keys.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="py-4 text-center text-neutral-500">No keys generated yet. Use the form to create one.</td></tr>';
        return;
      }

      tbody.innerHTML = keys.map((k, idx) => \`
        <tr class="hover:bg-neutral-50">
          <td class="py-3 font-num text-neutral-950 flex items-center gap-2">
            <span class="truncate max-w-[140px] sm:max-w-[200px] font-mono">\${k.plain_key || (k.key_id ? 'Key ID: ' + k.key_id : 'us_••••••••')}</span>
            \${k.plain_key ? \`<button onclick="copyToClipboard('\${k.plain_key}')" class="text-neutral-500 hover:text-black" title="Copy Key">📋</button>\` : ''}
          </td>
          <td class="py-3">
            <span class="px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 border border-neutral-300 text-[10px] font-semibold uppercase font-num">\${k.plan}</span>
          </td>
          <td class="py-3 text-neutral-700">\${k.label || 'Key'}</td>
          <td class="py-3 text-right">
            <button onclick="revokeKey('\${k.plain_key || k.key_id}', \${idx})" class="text-neutral-600 hover:text-black font-semibold">Revoke</button>
          </td>
        </tr>
      \`).join('');
    }

    async function revokeKey(key, index) {
      if (!confirm('Are you sure you want to revoke this API key?')) return;
      try {
        await fetch('/v1/keys/' + key, { method: 'DELETE' });
        const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        keys.splice(index, 1);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(keys));
        renderKeysTable();
        refreshUsage();
      } catch (err) {
        alert('Failed to revoke: ' + err.message);
      }
    }

    async function refreshUsage() {
      const key = getActiveKey();
      if (!key) {
        document.getElementById('statUsed').innerText = '0';
        document.getElementById('statLimit').innerText = '100';
        document.getElementById('statRemaining').innerText = '100';
        document.getElementById('usagePercent').innerText = '0%';
        document.getElementById('usageBar').style.width = '0%';
        return;
      }

      try {
        const resp = await fetch('/v1/usage', {
          headers: { 'X-API-Key': key }
        });
        const data = await resp.json();

        if (data.daily_limit !== undefined) {
          const used = data.requests_today || 0;
          const limit = data.daily_limit;
          document.getElementById('statUsed').innerText = used;
          document.getElementById('statLimit').innerText = limit === 'unlimited' ? '∞' : limit;
          document.getElementById('statRemaining').innerText = data.remaining === 'unlimited' ? '∞' : data.remaining;

          if (limit !== 'unlimited' && limit > 0) {
            const pct = Math.min(100, Math.round((used / limit) * 100));
            document.getElementById('usagePercent').innerText = pct + '%';
            document.getElementById('usageBar').style.width = pct + '%';
          }
        }
      } catch {
        // silent fail
      }
    }

    async function handleCrawl(e) {
      e.preventDefault();
      const url = document.getElementById('crawlUrlInput').value.trim();
      const depth = parseInt(document.getElementById('crawlDepthInput').value, 10);
      const spinner = document.getElementById('crawlSpinner');
      const resultBox = document.getElementById('crawlResultBox');
      const statusMsg = document.getElementById('crawlStatusMsg');
      const details = document.getElementById('crawlDetails');

      spinner.classList.remove('hidden');
      resultBox.classList.remove('hidden');
      statusMsg.innerText = 'Crawling, parsing HTML and indexing into D1 FTS5...';
      details.innerText = '';

      const apiKey = getActiveKey();
      const headers = { 'Content-Type': 'application/json' };
      if (apiKey) headers['X-API-Key'] = apiKey;

      try {
        const resp = await fetch('/v1/crawl', {
          method: 'POST',
          headers,
          body: JSON.stringify({ url, depth })
        });
        const data = await resp.json();

        statusMsg.innerText = data.message || 'Crawl complete';
        details.innerText = JSON.stringify(data.document || data, null, 2);
        refreshCrawlerStats();
      } catch (err) {
        statusMsg.innerText = 'Crawl Error';
        details.innerText = err.message;
      } finally {
        spinner.classList.add('hidden');
      }
    }

    async function refreshCrawlerStats() {
      try {
        const resp = await fetch('/v1/crawler/stats');
        const data = await resp.json();
        if (data.index) {
          document.getElementById('crawlerDocCount').innerText = (data.index.total_documents || 0).toLocaleString();
          document.getElementById('crawlerWordCount').innerText = (data.index.total_words || 0).toLocaleString();
          document.getElementById('crawlerDomainCount').innerText = (data.index.domains_covered || 0).toLocaleString();
          document.getElementById('crawlerQueuePending').innerText = data.crawler_queue ? (data.crawler_queue.pending || 0).toLocaleString() : '0';
        }
      } catch {}
    }

    // Initialize Auth state listener
    window.addEventListener('DOMContentLoaded', async () => {
      renderKeysTable();
      refreshUsage();
      refreshCrawlerStats();

      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        updateAuthUI(session?.user || null);

        supabase.auth.onAuthStateChange((_event, session) => {
          updateAuthUI(session?.user || null);
        });
      }
    });
  </script>
</body>
</html>`;
}
