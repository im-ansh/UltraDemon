// UltraSearch & UltraMemory — Developer Console & Minimalist Landing Page UI
// Inspired by Supermemory and elite minimalist AI labs (Linear / Notion / Vercel editorial aesthetic).
// Theme: Pure White (#ffffff) & Monochrome. Zero gradients, zero purple/pink.
// Typography: Michelangelus Bold Italic (Uploaded Font Embedded via WOFF2 Data URI), Geist (Sans), Geist Mono (Numbers).
// Strict Design Rule: NO EMOJIS ANYWHERE. All icons are refined, minimalist grey SVGs.
// Strict Authentication Flow: Login/Signup required before creating and using API keys.

import { MICHELANGELUS_BOLD_ITALIC_WOFF2_B64, MICHELANGELUS_REGULAR_WOFF2_B64 } from './font-data';

export function renderLandingPage(origin: string, supabaseUrl: string, supabaseAnonKey: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="light scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UltraDemon — Sovereign Web Search &amp; Agent Memory Engine</title>
  <meta name="description" content="UltraDemon is building the sovereign edge engine for autonomous web search and structured agent memory. Sub-15ms recall, zero 3rd-party dependencies.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2309090b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M13 2L3 14h9l-1 8 10-12h-9l1-8z'/></svg>">
  
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
            serif: ['"Michelangelus"', 'Georgia', 'serif'],
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
      line-height: 1.6;
      text-align: start;
      overflow-wrap: break-word;
    }

    /* Serif Texts: Michelangelus Bold Italic */
    .font-serif, .serif-italic, .serif-text, em.serif {
      font-family: 'Michelangelus', Georgia, serif;
      font-weight: 700;
      font-style: italic;
      letter-spacing: -0.01em;
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

    /* Minimalist Border & Box Styling (Strictly Zero Gradients) */
    .border-subtle {
      border: 1px solid #e4e4e7;
    }
    .card-clean {
      background: #ffffff;
      border: 1px solid #e4e4e7;
      transition: border-color 0.15s ease, box-shadow 0.15s ease;
    }
    .card-clean:hover {
      border-color: #a1a1aa;
    }

    /* Code Scrollbar */
    .code-scroll::-webkit-scrollbar {
      height: 5px;
      width: 5px;
    }
    .code-scroll::-webkit-scrollbar-thumb {
      background: #d4d4d8;
      border-radius: 4px;
    }

    /* Minimal Grey Icon Default Styles */
    .icon-grey {
      display: inline-block;
      vertical-align: middle;
      color: #71717a;
      flex-shrink: 0;
    }
    .icon-grey:hover {
      color: #18181b;
    }
  </style>
</head>
<body class="min-h-screen bg-white text-neutral-950 antialiased selection:bg-black selection:text-white">

  <!-- Desktop Minimalist Left Sidebar + Main Content Layout -->
  <div class="min-h-screen flex flex-col lg:flex-row">
    
    <!-- Left Navigation Bar (Supermemory / Notion / Editorial Style) -->
    <aside class="w-full lg:w-64 lg:min-h-screen lg:fixed lg:top-0 lg:left-0 border-b lg:border-b-0 lg:border-r border-neutral-200 bg-white/95 backdrop-blur-md z-40 flex flex-col justify-between p-6">
      <div class="space-y-6">
        <!-- Brand Logo with Grey Vector Spark Icon -->
        <a href="/" class="flex items-center gap-2.5 group">
          <div class="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:bg-black group-hover:text-white group-hover:border-black transition">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <span class="font-extrabold text-base tracking-tight text-neutral-950 flex items-center gap-1">
            ultrademon
            <span class="font-serif text-xs font-bold italic text-neutral-500">engine</span>
          </span>
        </a>

        <!-- Status Tag with Minimal Pulse Indicator -->
        <div class="flex items-center gap-2 text-[11px] text-neutral-500 font-num">
          <span class="w-2 h-2 rounded-full bg-neutral-900 animate-pulse"></span>
          <span>D1 Edge Operational</span>
        </div>

        <!-- Sidebar Navigation Links with Minimalist Grey SVGs -->
        <nav class="flex flex-col space-y-1 text-xs font-medium text-neutral-600">
          <a href="#overview" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black transition">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span>Overview</span>
          </a>
          <a href="#memory" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black transition">
            <div class="flex items-center gap-2.5">
              <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/><path d="M12 2v20"/><path d="M8 8h8"/><path d="M7 13h10"/><path d="M9 18h6"/></svg>
              <span>UltraMemory</span>
            </div>
            <span class="font-num text-[10px] bg-neutral-100 text-neutral-900 border border-neutral-200 px-1.5 py-0.2 rounded font-bold">&lt;15ms</span>
          </a>
          <a href="#search" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black transition">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span>UltraSearch</span>
          </a>
          <a href="#benchmarks" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black transition">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
            <span>Benchmarks</span>
          </a>
          <a href="#console" class="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black transition">
            <div class="flex items-center gap-2.5">
              <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1-1-1.5 1.5L7 8l-1.5 1.5L4 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2h2v2h2l4-4 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 2-2z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              <span>API Keys</span>
            </div>
            <span class="font-num text-[10px] text-neutral-400">D1</span>
          </a>
          <a href="#crawler" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black transition">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
            <span>Crawler</span>
          </a>
          <a href="#mcp" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black transition">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
            <span>MCP Protocol</span>
          </a>
          <a href="#pricing" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-neutral-100 hover:text-black transition">
            <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
            <span>Pricing</span>
          </a>
        </nav>
      </div>

      <!-- Auth & Account Status in Left Sidebar -->
      <div class="pt-6 border-t border-neutral-200 space-y-3">
        <div id="sideAuthLoggedOut" class="space-y-2">
          <button onclick="openAuthModal('signin')" class="w-full py-2 text-xs font-semibold rounded-lg text-neutral-800 border border-neutral-200 hover:bg-neutral-100 transition cursor-pointer">
            Sign In
          </button>
          <button onclick="openAuthModal('signup')" class="w-full py-2 text-xs font-semibold rounded-lg bg-black text-white hover:bg-neutral-800 transition cursor-pointer shadow-xs">
            Create Account
          </button>
        </div>

        <div id="sideAuthLoggedIn" class="hidden space-y-2">
          <div class="p-2.5 rounded-xl bg-neutral-100 border border-neutral-200 text-xs">
            <div class="flex items-center gap-1.5 text-[10px] text-neutral-500 uppercase tracking-wider font-bold">
              <svg class="w-3 h-3 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <span>Signed In</span>
            </div>
            <div id="sideUserEmail" class="font-num font-semibold text-neutral-950 truncate mt-0.5"></div>
          </div>
          <button onclick="handleSignOut()" class="w-full py-1.5 text-xs text-neutral-600 hover:text-black border border-neutral-200 rounded-lg hover:bg-neutral-50 transition cursor-pointer">
            Sign Out
          </button>
        </div>

        <div class="text-[10px] text-neutral-400 font-num">
          Cloudflare Edge · 330+ Cities
        </div>
      </div>
    </aside>

    <!-- Main Editorial / Interactive Container -->
    <main class="flex-1 lg:ml-64 p-6 sm:p-12 lg:p-16 max-w-4xl">
      
      <!-- Top Release Pill with Clean Monospaced Minimalist Badge -->
      <section id="overview" class="mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-neutral-50 text-xs text-neutral-800 mb-6 font-num">
          <span class="w-1.5 h-1.5 rounded-full bg-neutral-900"></span>
          <span>ANNOUNCING ULTRADEMON 2.0</span>
          <span class="text-neutral-300">/</span>
          <span class="text-neutral-500 font-sans">SOVEREIGN EDGE PLATFORM</span>
        </div>

        <!-- Supermemory-inspired lowercase editorial hero headline -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-neutral-950 mb-6 leading-[1.12]">
          ultrademon is building the <span class="font-serif font-bold italic text-neutral-950 underline decoration-neutral-300 decoration-2 underline-offset-8">sovereign engine</span> for web search, agent memory, and continual context.
        </h1>

        <!-- Author / Timestamp meta line -->
        <div class="flex items-center gap-3 text-xs text-neutral-500 font-num mb-8 pb-4 border-b border-neutral-100">
          <span class="font-semibold text-neutral-900">Ansh</span>
          <span>·</span>
          <span>November 2026</span>
          <span>·</span>
          <span>Cloudflare Workers + D1 SQLite FTS5</span>
        </div>

        <!-- Action Row -->
        <div class="flex flex-wrap items-center gap-3 mb-10">
          <button onclick="handleProvisionKeyClick()" class="px-5 py-2.5 rounded-xl bg-black text-white hover:bg-neutral-800 text-xs font-semibold transition cursor-pointer shadow-xs flex items-center gap-2">
            <span>Get Started Free</span>
            <svg class="w-3.5 h-3.5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a href="/openapi.json" target="_blank" class="px-4 py-2.5 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-900 text-xs font-semibold transition flex items-center gap-1.5">
            <span class="font-num">/openapi.json</span>
          </a>
          <a href="#benchmarks" class="px-4 py-2.5 text-xs text-neutral-600 hover:text-black transition">
            View Latency Benchmark
          </a>
        </div>

        <!-- Minimalist System Architecture Flow Diagram with Grey SVGs -->
        <div class="card-clean p-6 rounded-2xl mb-12 bg-neutral-50/50">
          <div class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 mb-4 font-num">System Architecture &amp; Execution Topology</div>
          <div class="grid grid-cols-1 sm:grid-cols-4 gap-3 text-center text-xs">
            <div class="p-4 bg-white border border-neutral-200 rounded-xl">
              <div class="w-8 h-8 mx-auto rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/></svg>
              </div>
              <div class="font-bold text-neutral-950">AI Agent Fleet</div>
              <div class="text-[10px] text-neutral-500 mt-1">Claude, Cursor, LangChain</div>
            </div>
            <div class="p-4 bg-white border border-neutral-200 rounded-xl">
              <div class="w-8 h-8 mx-auto rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              </div>
              <div class="font-bold text-neutral-950">Sovereign Gateway</div>
              <div class="text-[10px] text-neutral-500 mt-1 font-num">REST / MCP / SSE</div>
            </div>
            <div class="p-4 bg-white border border-black rounded-xl">
              <div class="w-8 h-8 mx-auto rounded-lg bg-neutral-900 text-white flex items-center justify-center mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/><path d="M12 2v20"/><path d="M8 8h8"/><path d="M7 13h10"/><path d="M9 18h6"/></svg>
              </div>
              <div class="font-bold text-neutral-950">D1 SQLite FTS5</div>
              <div class="text-[10px] font-num text-neutral-900 font-bold">&lt; 15ms BM25 Edge Recall</div>
            </div>
            <div class="p-4 bg-white border border-neutral-200 rounded-xl">
              <div class="w-8 h-8 mx-auto rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-600 mb-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
              </div>
              <div class="font-bold text-neutral-950">Autonomous Index</div>
              <div class="text-[10px] text-neutral-500 mt-1 font-num">&lt; 40ms Web Search</div>
            </div>
          </div>
          <div class="text-[11px] text-neutral-500 text-center mt-3 font-serif font-bold italic">
            Zero third-party APIs. Zero external vector databases. 100% self-contained Cloudflare Anycast edge.
          </div>
        </div>

        <!-- Editorial Prose (Linear / Supermemory Essay Style) -->
        <div class="space-y-4 text-sm text-neutral-700 leading-relaxed max-w-3xl mb-12">
          <p>
            Current memory tools like Supermemory, Mem0, and centralized vector databases were designed around single-region cloud servers and heavy embedding pipelines. When an autonomous agent queries memory or web search in an interactive loop, centralized roundtrips cost <strong>350ms to 500ms</strong> per step.
          </p>
          <p>
            <strong>UltraDemon</strong> takes a radically different approach: running both full-text BM25 web search and structured agent memory directly inside <span class="font-semibold text-neutral-950">Cloudflare D1 SQLite with FTS5</span> across 330+ edge PoPs worldwide. 
          </p>
          <p class="font-serif font-bold italic text-base text-neutral-900 pl-4 border-l-2 border-black">
            &ldquo;The result: memory recall drops to under 15ms globally, with zero telemetry leakage and a single unified API key.&rdquo;
          </p>
        </div>
      </section>

      <!-- Three Pillars Section with Grey Minimalist SVGs -->
      <section class="mb-14">
        <h2 class="text-xs font-semibold uppercase tracking-wider text-neutral-500 font-num mb-6">Core Capabilities</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div class="card-clean p-5 rounded-xl">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
            <h3 class="text-sm font-bold text-neutral-950 mb-1.5">Autonomous Web Search</h3>
            <p class="text-xs text-neutral-600 leading-relaxed">
              Native edge crawler, HTMLRewriter extraction, and BM25 ranking on D1. Sub-40ms P50 latency with zero external search API dependencies.
            </p>
          </div>
          <div class="card-clean p-5 rounded-xl border-black">
            <div class="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/><path d="M12 2v20"/><path d="M8 8h8"/><path d="M7 13h10"/><path d="M9 18h6"/></svg>
            </div>
            <h3 class="text-sm font-bold text-neutral-950 mb-1.5">UltraMemory API</h3>
            <p class="text-xs text-neutral-600 leading-relaxed">
              Store agent facts, preferences, profiles, and conversations. Retrieve needles with BM25 in under 15ms at the Cloudflare edge.
            </p>
          </div>
          <div class="card-clean p-5 rounded-xl">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 mb-3">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5M3 12A9 3 0 0 0 21 12"/></svg>
            </div>
            <h3 class="text-sm font-bold text-neutral-950 mb-1.5">File &amp; Context Ingestion</h3>
            <p class="text-xs text-neutral-600 leading-relaxed">
              Ingest full text documents, Markdown, and source files with smart chunking and instant full-text indexing for agent lookup.
            </p>
          </div>
        </div>
      </section>

      <!-- Supermemory Latency Benchmark with Minimalist Bars & Tabular Metrics -->
      <section id="benchmarks" class="mb-16 pt-8 border-t border-neutral-200">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Speed &amp; Latency Benchmark</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mt-1">
            Our promise: the <span class="font-serif font-bold italic text-black">fastest agent memory</span> ever built.
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            End-to-end retrieval latency measured from global client locations.
          </p>
        </div>

        <!-- Metric Stat Cards Grid (Geist Mono Tabular Figures) -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 font-num">
          <div class="card-clean p-4 rounded-xl">
            <div class="text-[11px] text-neutral-500 mb-1">UltraMemory Recall</div>
            <div class="text-2xl font-bold text-neutral-950">&lt; 15<span class="text-xs font-sans font-normal text-neutral-500">ms</span></div>
            <div class="text-[10px] text-neutral-500 mt-1 font-sans">Edge D1 FTS5</div>
          </div>
          <div class="card-clean p-4 rounded-xl">
            <div class="text-[11px] text-neutral-500 mb-1">Supermemory (Cloud)</div>
            <div class="text-2xl font-bold text-neutral-400">380<span class="text-xs font-sans font-normal text-neutral-400">ms</span></div>
            <div class="text-[10px] text-neutral-400 mt-1 font-sans">Centralized Vector</div>
          </div>
          <div class="card-clean p-4 rounded-xl">
            <div class="text-[11px] text-neutral-500 mb-1">Edge Availability</div>
            <div class="text-2xl font-bold text-neutral-950">330+</div>
            <div class="text-[10px] text-neutral-500 mt-1 font-sans">PoP Cities</div>
          </div>
          <div class="card-clean p-4 rounded-xl">
            <div class="text-[11px] text-neutral-500 mb-1">Hot Cache Retrieval</div>
            <div class="text-2xl font-bold text-neutral-950">&lt; 5<span class="text-xs font-sans font-normal text-neutral-500">ms</span></div>
            <div class="text-[10px] text-neutral-500 mt-1 font-sans">Cloudflare KV</div>
          </div>
        </div>

        <!-- Latency Bar Visualizer -->
        <div class="card-clean p-6 rounded-2xl space-y-3 font-num text-xs bg-neutral-50/50">
          <div>
            <div class="flex justify-between font-bold text-neutral-950 mb-1">
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                <span>UltraMemory (D1 Edge FTS5)</span>
              </span>
              <span>14ms</span>
            </div>
            <div class="w-full h-3 bg-neutral-200 rounded-full overflow-hidden">
              <div class="h-full bg-black rounded-full" style="width: 4%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-neutral-600 mb-1">
              <span>Supermemory (Centralized Vector DB)</span>
              <span>380ms</span>
            </div>
            <div class="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div class="h-full bg-neutral-400 rounded-full" style="width: 79%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-neutral-600 mb-1">
              <span>Mem0 / Centralized SaaS</span>
              <span>420ms</span>
            </div>
            <div class="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div class="h-full bg-neutral-400 rounded-full" style="width: 87%"></div>
            </div>
          </div>
        </div>
      </section>

      <!-- Live UltraMemory Interactive Playground (Grey SVGs) -->
      <section id="memory" class="mb-16 pt-8 border-t border-neutral-200">
        <div class="mb-6">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-neutral-800 font-num mb-2">
            API #1 · ULTRAMEMORY
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Live Memory <span class="font-serif font-bold italic text-black">Playground</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            Store facts, preferences, profiles, or recall needles with sub-15ms BM25 ranking.
          </p>

          <!-- Quick Samples with Grey SVGs -->
          <div class="flex flex-wrap items-center gap-2 mt-3">
            <span class="text-xs text-neutral-400">Samples:</span>
            <button onclick="fillMemorySample('preference', 'User prefers clean minimalist monochrome design, strictly zero gradients, and Michelangelus font.', 'agent_ui')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 border border-neutral-200 transition cursor-pointer">
              <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24"/></svg>
              <span>Design Rule</span>
            </button>
            <button onclick="fillMemorySample('fact', 'Database infrastructure is deployed on Cloudflare D1 with SQLite FTS5 BM25 index.', 'backend_infra')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 border border-neutral-200 transition cursor-pointer">
              <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/></svg>
              <span>Database Architecture</span>
            </button>
            <button onclick="fillMemorySample('entity', 'UltraDemon: Sovereign web search and agent memory platform beating Supermemory.', 'product_core')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 border border-neutral-200 transition cursor-pointer">
              <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="16" height="16" x="4" y="4" rx="2"/></svg>
              <span>Product Profile</span>
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Store Memory Box -->
          <div class="card-clean p-5 rounded-2xl">
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
                <span class="text-xs font-bold text-neutral-950">Store Agent Memory</span>
              </div>
              <span class="text-[10px] font-num text-neutral-500">POST /v1/memory</span>
            </div>

            <form onsubmit="handleStoreMemory(event)" class="space-y-3">
              <div>
                <label class="block text-[11px] font-medium text-neutral-600 mb-1">Content to Remember</label>
                <textarea 
                  id="memContentInput"
                  rows="3"
                  placeholder="e.g. User prefers monochrome minimalism and Michelangelus bold italic typography."
                  required
                  class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-xs placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition resize-none font-medium"
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-2">
                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Memory Type</label>
                  <select id="memTypeInput" class="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-950 text-xs font-num focus:outline-none focus:bg-white focus:border-black transition">
                    <option value="fact" selected>fact</option>
                    <option value="preference">preference</option>
                    <option value="entity">entity</option>
                    <option value="document">document</option>
                    <option value="conversation">conversation</option>
                  </select>
                </div>
                <div>
                  <label class="block text-[11px] font-medium text-neutral-600 mb-1">Container Tag</label>
                  <input 
                    type="text" 
                    id="memContainerInput" 
                    value="default" 
                    placeholder="e.g. agent_prod"
                    class="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-950 text-xs font-num focus:outline-none focus:bg-white focus:border-black transition"
                  />
                </div>
              </div>

              <div class="flex items-center justify-between pt-1">
                <span class="text-[10px] text-neutral-400">Indexed into D1 FTS5</span>
                <button 
                  type="submit" 
                  id="storeMemBtn"
                  class="px-4 py-1.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Store Memory</span>
                  <span id="storeMemSpinner" class="hidden">
                    <svg class="w-3 h-3 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
                  </span>
                </button>
              </div>
            </form>

            <div id="storeMemAlert" class="mt-3 hidden p-2.5 rounded-lg text-xs font-num border"></div>
          </div>

          <!-- Recall / Query Box -->
          <div class="card-clean p-5 rounded-2xl">
            <div class="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100">
              <div class="flex items-center gap-2">
                <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                <span class="text-xs font-bold text-neutral-950">Recall / Query Memory</span>
              </div>
              <span class="text-[10px] font-num text-neutral-500">POST /v1/memory/query</span>
            </div>

            <form onsubmit="handleQueryMemory(event)" class="space-y-3">
              <div class="relative">
                <input 
                  type="text" 
                  id="memQueryInput" 
                  value="monochrome theme" 
                  placeholder="Recall query (e.g. design rules, database architecture)..."
                  class="w-full pl-8 pr-20 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-xs placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition font-medium"
                  required
                />
                <span class="absolute left-2.5 top-2.5 text-neutral-400">
                  <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/></svg>
                </span>
                <button 
                  type="submit" 
                  id="queryMemBtn"
                  class="absolute right-1 top-1 px-3 py-1 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
                >
                  <span>Recall</span>
                  <span id="queryMemSpinner" class="hidden">
                    <svg class="w-3 h-3 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
                  </span>
                </button>
              </div>

              <div class="flex items-center justify-between text-xs text-neutral-500">
                <div class="flex items-center gap-1.5">
                  <span class="text-[11px]">Container:</span>
                  <input 
                    type="text" 
                    id="memQueryContainer" 
                    placeholder="all" 
                    class="px-2 py-0.5 bg-neutral-50 border border-neutral-200 rounded text-neutral-900 text-xs font-num w-24 focus:outline-none focus:border-black"
                  />
                </div>
                <div id="memRecallLatencyBadge" class="hidden px-2 py-0.5 rounded bg-neutral-100 text-neutral-900 border border-neutral-300 font-num font-bold text-[10px]">
                  0ms
                </div>
              </div>
            </form>

            <div id="memResultsContainer" class="mt-3 pt-3 border-t border-neutral-100 space-y-2">
              <div class="text-center py-4 text-neutral-400 text-xs">
                Click <span class="font-semibold text-neutral-900">Recall</span> to test &lt;15ms edge retrieval.
              </div>
            </div>
          </div>
        </div>

        <!-- Stored Memories Table -->
        <div class="card-clean p-5 rounded-2xl mt-6">
          <div class="flex items-center justify-between mb-3 pb-2 border-b border-neutral-100">
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14a9 3 0 0 0 18 0V5"/></svg>
              <span class="text-xs font-bold text-neutral-950">Active Memories in Edge Storage</span>
            </div>
            <button onclick="refreshStoredMemories()" class="flex items-center gap-1 text-xs text-neutral-500 hover:text-black transition cursor-pointer">
              <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>
              <span>Refresh</span>
            </button>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs">
              <thead class="text-neutral-400 uppercase tracking-wider text-[10px] font-num">
                <tr>
                  <th class="pb-1.5">ID</th>
                  <th class="pb-1.5">Container</th>
                  <th class="pb-1.5">Type</th>
                  <th class="pb-1.5">Title / Content</th>
                  <th class="pb-1.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody id="memoriesTableBody" class="divide-y divide-neutral-100 font-num">
                <tr>
                  <td colspan="5" class="py-3 text-center text-neutral-400">Sign in to view your stored agent memories.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <!-- Live UltraSearch Interactive Playground (Grey SVGs) -->
      <section id="search" class="mb-16 pt-8 border-t border-neutral-200">
        <div class="mb-6">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-neutral-800 font-num mb-2">
            API #2 · ULTRASEARCH
          </div>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950">
            Live Search <span class="font-serif font-bold italic text-black">Playground</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            Query our sovereign BM25 web index running natively across Cloudflare edge.
          </p>

          <div class="flex flex-wrap items-center gap-2 mt-3">
            <span class="text-xs text-neutral-400">Try queries:</span>
            <button onclick="setQuery('What is Python?')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 border border-neutral-200 transition cursor-pointer">
              <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
              <span>What is Python?</span>
            </button>
            <button onclick="setQuery('Cloudflare Workers AI')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 border border-neutral-200 transition cursor-pointer">
              <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/></svg>
              <span>Cloudflare Workers AI</span>
            </button>
            <button onclick="setQuery('BM25 Ranking Algorithm')" class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neutral-100 hover:bg-neutral-200 text-xs text-neutral-800 border border-neutral-200 transition cursor-pointer">
              <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              <span>BM25 Ranking</span>
            </button>
          </div>
        </div>

        <div class="card-clean p-5 sm:p-6 rounded-2xl">
          <form id="searchForm" onsubmit="handleSearch(event)" class="space-y-3">
            <div class="relative">
              <input 
                type="text" 
                id="queryInput" 
                value="What is Python?" 
                placeholder="Search sovereign web index..."
                class="w-full pl-9 pr-24 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-xs placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition font-medium"
                required
              />
              <span class="absolute left-3 top-2.5 text-neutral-400">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.3-4.3"/></svg>
              </span>
              <button 
                type="submit" 
                id="searchBtn"
                class="absolute right-1 top-1 px-4 py-1.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center gap-1 cursor-pointer"
              >
                <span>Search</span>
                <span id="searchSpinner" class="hidden">
                  <svg class="w-3 h-3 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
                </span>
              </button>
            </div>

            <div class="flex flex-wrap items-center justify-between gap-2 text-xs text-neutral-600 pt-1">
              <div class="flex items-center gap-1.5">
                <span class="text-[11px]">Mode:</span>
                <div class="inline-flex rounded-lg bg-neutral-100 p-0.5 border border-neutral-200 font-num text-[11px]">
                  <button type="button" onclick="setMode(1)" id="modeBtn1" class="px-2 py-0.5 rounded text-white bg-black font-medium cursor-pointer">1: Instant</button>
                  <button type="button" onclick="setMode(2)" id="modeBtn2" class="px-2 py-0.5 rounded text-neutral-600 hover:text-black cursor-pointer">2: Standard</button>
                  <button type="button" onclick="setMode(3)" id="modeBtn3" class="px-2 py-0.5 rounded text-neutral-600 hover:text-black cursor-pointer">3: Deep</button>
                </div>
              </div>
              <div class="flex items-center gap-3">
                <label class="flex items-center gap-1.5 cursor-pointer text-[11px]">
                  <input type="checkbox" id="useCacheCheck" checked class="rounded border-neutral-300 text-black focus:ring-black">
                  <span>KV Hot Cache</span>
                </label>
                <div id="latencyBadge" class="hidden px-2 py-0.5 rounded bg-neutral-100 text-neutral-900 border border-neutral-300 font-num font-bold text-[10px]">
                  0ms
                </div>
              </div>
            </div>
          </form>

          <!-- Search Results -->
          <div id="resultsContainer" class="mt-4 pt-4 border-t border-neutral-100 space-y-3">
            <div class="text-center py-4 text-neutral-400 text-xs">
              Click <span class="font-semibold text-neutral-900">Search</span> above to test the autonomous search engine.
            </div>
          </div>
        </div>
      </section>

      <!-- Developer Console & API Key Manager -->
      <section id="console" class="mb-16 pt-8 border-t border-neutral-200">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Unified Developer Platform</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mt-1">
            API Keys &amp; <span class="font-serif font-bold italic text-black">Console</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            Your single API key unlocks both <strong>UltraSearch</strong> and <strong>UltraMemory</strong>. Gated by Supabase authentication.
          </p>
        </div>

        <!-- Auth Banner -->
        <div id="authPromptBanner" class="card-clean p-4 rounded-xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 bg-neutral-50">
          <div class="flex items-center gap-2.5">
            <svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <div class="text-xs">
              <span class="font-bold text-neutral-950">Authentication Required:</span>
              <span class="text-neutral-600"> Sign in or create an account to generate and manage keys.</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="openAuthModal('signin')" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-black text-white hover:bg-neutral-800 transition cursor-pointer">
              Sign In
            </button>
            <button onclick="openAuthModal('signup')" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-100 transition cursor-pointer">
              Create Account
            </button>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Generate Key Form -->
          <div class="card-clean p-5 rounded-2xl">
            <h3 class="text-xs font-bold text-neutral-950 mb-3 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1-1-1.5 1.5L7 8l-1.5 1.5L4 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2h2v2h2l4-4 1.5 1.5 1.5-1.5 1.5-1.5 2-2z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              <span>Generate Unified Key</span>
            </h3>

            <!-- Locked View -->
            <div id="createKeyLocked" class="p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center space-y-2">
              <div class="w-8 h-8 mx-auto rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <div class="text-xs font-bold text-neutral-950">Login Required</div>
              <p class="text-[11px] text-neutral-500">Sign in to generate keys.</p>
              <button onclick="openAuthModal('signin')" class="mt-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-black text-white cursor-pointer">Sign In</button>
            </div>

            <!-- Form -->
            <form id="createKeyForm" onsubmit="handleCreateKey(event)" class="space-y-3 hidden">
              <div>
                <label class="block text-[11px] font-medium text-neutral-600 mb-1">Account</label>
                <div id="keyUserAccountDisplay" class="px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-lg text-xs font-num font-semibold text-neutral-950 truncate"></div>
              </div>
              <div>
                <label class="block text-[11px] font-medium text-neutral-600 mb-1">Plan</label>
                <select id="newKeyPlan" class="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-950 text-xs font-num focus:outline-none focus:bg-white focus:border-black transition">
                  <option value="free">Free (100 req/day)</option>
                  <option value="pro" selected>Pro (10,000 req/day)</option>
                  <option value="ultra">Ultra (100,000 req/day)</option>
                  <option value="enterprise">Enterprise (Unlimited)</option>
                </select>
              </div>
              <div>
                <label class="block text-[11px] font-medium text-neutral-600 mb-1">Label (Optional)</label>
                <input 
                  type="text" 
                  id="newKeyLabel" 
                  placeholder="e.g. Agent Key" 
                  class="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-950 text-xs focus:outline-none focus:bg-white focus:border-black transition"
                />
              </div>
              <button 
                type="submit" 
                id="createKeyBtn"
                class="w-full py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <span>Generate Key</span>
                <span id="createKeySpinner" class="hidden">
                  <svg class="w-3 h-3 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
                </span>
              </button>
            </form>

            <div id="newKeyAlert" class="mt-3 p-3 bg-neutral-100 border border-neutral-300 rounded-xl hidden">
              <div class="text-[10px] font-bold text-neutral-950 mb-1 flex items-center gap-1">
                <svg class="w-3 h-3 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>Key Generated (Shown Once):</span>
              </div>
              <div class="flex items-center justify-between gap-1 bg-white border border-neutral-200 p-1.5 rounded font-mono text-xs">
                <span id="newKeyDisplay" class="truncate font-num"></span>
                <button onclick="copyToClipboard(document.getElementById('newKeyDisplay').innerText)" class="text-xs text-neutral-900 font-bold underline cursor-pointer">Copy</button>
              </div>
            </div>
          </div>

          <!-- Keys List & Usage -->
          <div class="md:col-span-2 space-y-4">
            <!-- Usage Card -->
            <div class="card-clean p-4 rounded-xl">
              <div class="flex items-center justify-between mb-2">
                <span class="text-xs font-bold text-neutral-950">Daily Quota Usage</span>
                <button onclick="refreshUsage()" class="flex items-center gap-1 text-xs text-neutral-500 hover:text-black cursor-pointer">
                  <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/></svg>
                  <span>Refresh</span>
                </button>
              </div>
              <div class="grid grid-cols-3 gap-2 font-num text-center">
                <div class="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                  <div class="text-[10px] text-neutral-500">Used</div>
                  <div id="statUsed" class="text-lg font-bold text-neutral-950">—</div>
                </div>
                <div class="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                  <div class="text-[10px] text-neutral-500">Limit</div>
                  <div id="statLimit" class="text-lg font-bold text-neutral-950">—</div>
                </div>
                <div class="bg-neutral-50 p-2.5 rounded-lg border border-neutral-200">
                  <div class="text-[10px] text-neutral-500">Remaining</div>
                  <div id="statRemaining" class="text-lg font-bold text-neutral-950">—</div>
                </div>
              </div>
            </div>

            <!-- Keys Table -->
            <div class="card-clean p-4 rounded-xl">
              <span class="text-xs font-bold text-neutral-950 block mb-2">Your API Keys</span>
              <div class="overflow-x-auto">
                <table class="w-full text-left text-xs">
                  <thead class="text-neutral-400 uppercase tracking-wider text-[10px] font-num">
                    <tr>
                      <th class="pb-1.5">Key</th>
                      <th class="pb-1.5">Plan</th>
                      <th class="pb-1.5">Label</th>
                      <th class="pb-1.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody id="keysTableBody" class="divide-y divide-neutral-100 font-num">
                    <tr>
                      <td colspan="4" class="py-3 text-center text-neutral-400">Sign in to view your keys.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Crawler Section with Grey SVGs -->
      <section id="crawler" class="mb-16 pt-8 border-t border-neutral-200">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Autonomous Ingestion</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mt-1">
            Edge Web <span class="font-serif font-bold italic text-black">Crawler</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            Fetch, parse HTML, and index any documentation or site directly into D1 SQLite BM25.
          </p>
        </div>

        <div class="card-clean p-5 rounded-2xl">
          <form onsubmit="handleCrawl(event)" class="space-y-3">
            <div class="grid grid-cols-1 sm:grid-cols-4 gap-2">
              <div class="sm:col-span-3">
                <label class="block text-[11px] font-medium text-neutral-600 mb-1">Target URL</label>
                <input 
                  type="url" 
                  id="crawlUrlInput" 
                  placeholder="https://docs.python.org/3/" 
                  required
                  class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-xs focus:outline-none focus:bg-white focus:border-black transition font-medium"
                />
              </div>
              <div>
                <label class="block text-[11px] font-medium text-neutral-600 mb-1">Depth</label>
                <select id="crawlDepthInput" class="w-full px-2.5 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-xs font-num focus:outline-none focus:bg-white focus:border-black transition">
                  <option value="0">0 (Single Page)</option>
                  <option value="1" selected>1 (Page + Links)</option>
                  <option value="2">2 (Deep Discovery)</option>
                </select>
              </div>
            </div>
            <div class="flex items-center justify-between pt-1">
              <span class="text-[10px] text-neutral-400">Cloudflare HTMLRewriter strips scripts and indexes raw text.</span>
              <button 
                type="submit" 
                id="crawlBtn"
                class="px-4 py-1.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <span>Crawl &amp; Index</span>
                <span id="crawlSpinner" class="hidden">
                  <svg class="w-3 h-3 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
                </span>
              </button>
            </div>
          </form>

          <div id="crawlResultBox" class="mt-3 p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-mono text-neutral-900 hidden">
            <div id="crawlStatusMsg" class="font-bold text-neutral-950 mb-1"></div>
            <pre id="crawlDetails" class="code-scroll max-h-36 overflow-y-auto text-[10px] text-neutral-700 font-num"></pre>
          </div>
        </div>
      </section>

      <!-- MCP Hub & Code Snippets -->
      <section id="mcp" class="mb-16 pt-8 border-t border-neutral-200">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Integrations</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mt-1">
            Model Context Protocol &amp; <span class="font-serif font-bold italic text-black">SDKs</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            Native MCP server for Claude Desktop, Cursor, Python, and TypeScript.
          </p>
        </div>

        <div class="card-clean p-5 rounded-2xl">
          <div class="flex flex-wrap gap-1.5 border-b border-neutral-200 pb-3 mb-4">
            <button onclick="switchTab('tabClaude')" id="btnTabClaude" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-black text-white cursor-pointer transition">Claude Desktop</button>
            <button onclick="switchTab('tabCursor')" id="btnTabCursor" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">Cursor</button>
            <button onclick="switchTab('tabPython')" id="btnTabPython" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">Python</button>
            <button onclick="switchTab('tabNode')" id="btnTabNode" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">TypeScript</button>
            <button onclick="switchTab('tabCurl')" id="btnTabCurl" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">cURL</button>
          </div>

          <div id="tabClaude" class="space-y-2">
            <p class="text-xs text-neutral-600">Add to <code class="text-neutral-900 font-num bg-neutral-100 px-1 py-0.5 rounded">claude_desktop_config.json</code>:</p>
            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">{
  "mcpServers": {
    "ultrademon": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-sse", "${origin}/mcp/sse"],
      "env": {
        "ULTRASEARCH_API_KEY": "us_your_key_here"
      }
    }
  }
}</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <div id="tabCursor" class="space-y-2 hidden">
            <p class="text-xs text-neutral-600">Add to <code class="text-neutral-900 font-num bg-neutral-100 px-1 py-0.5 rounded">.cursor/mcp.json</code>:</p>
            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">{
  "mcpServers": {
    "ultrademon": {
      "url": "${origin}/mcp",
      "headers": {
        "X-API-Key": "us_your_key_here"
      }
    }
  }
}</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <div id="tabPython" class="space-y-2 hidden">
            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">import requests

BASE_URL = "${origin}"
HEADERS = {"X-API-Key": "us_your_key_here", "Content-Type": "application/json"}

# Store agent memory
requests.post(f"{BASE_URL}/v1/memory", headers=HEADERS, json={
    "content": "User prefers minimalist monochrome UI and Michelangelus font.",
    "container_tag": "agent_prod",
    "memory_type": "preference"
})

# Recall memory in &lt;15ms
memories = requests.post(f"{BASE_URL}/v1/memory/query", headers=HEADERS, json={
    "query": "UI preferences", "container_tag": "agent_prod"
}).json()
print("Recalled:", memories["results"])

# Search the web
search = requests.post(f"{BASE_URL}/v1/search", headers=HEADERS, json={
    "query": "What is Python?", "num_results": 5
}).json()
print("Search:", search["results"])</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <div id="tabNode" class="space-y-2 hidden">
            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">const API_KEY = "us_your_key_here";
const headers = { "X-API-Key": API_KEY, "Content-Type": "application/json" };

// Store Memory
await fetch("${origin}/v1/memory", {
  method: "POST",
  headers,
  body: JSON.stringify({ content: "Agent fact", container_tag: "agent_1" })
});

// Recall Memory (&lt;15ms)
const { results } = await fetch("${origin}/v1/memory/query", {
  method: "POST",
  headers,
  body: JSON.stringify({ query: "fact", container_tag: "agent_1" })
}).then(r => r.json());
console.log(results);</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <div id="tabCurl" class="space-y-2 hidden">
            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll"># Store memory
curl -X POST "${origin}/v1/memory" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: us_your_key_here" \\
  -d '{"content": "Agent context", "container_tag": "agent_1"}'

# Recall memory (&lt;15ms)
curl -X POST "${origin}/v1/memory/query" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: us_your_key_here" \\
  -d '{"query": "context", "container_tag": "agent_1"}'</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Plans with Minimalist Checkmarks -->
      <section id="pricing" class="mb-16 pt-8 border-t border-neutral-200">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Predictable Pricing</span>
          <h2 class="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 mt-1">
            Sovereign Access for <span class="font-serif font-bold italic text-black">Every Scale</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            Zero vendor markups. All plans include both UltraSearch and UltraMemory.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div class="card-clean p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="text-xs font-semibold text-neutral-500 mb-1">Free</div>
              <div class="text-2xl font-extrabold font-num text-neutral-950 mb-3">$0<span class="text-xs text-neutral-400 font-sans font-normal">/mo</span></div>
              <ul class="text-xs text-neutral-600 space-y-2 mb-4">
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span><strong class="font-num font-semibold text-neutral-900">100</strong> requests / day</span></li>
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>UltraMemory Recall (&lt;15ms)</span></li>
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>UltraSearch Mode 1</span></li>
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>KV Hot Cache</span></li>
              </ul>
            </div>
            <button onclick="handleProvisionKeyClick('free')" class="w-full py-1.5 text-center text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 cursor-pointer">Get Free Key</button>
          </div>

          <div class="card-clean p-5 rounded-2xl border-black relative flex flex-col justify-between shadow-xs">
            <div class="absolute -top-2.5 right-4 px-2 py-0.2 text-[9px] font-bold bg-black text-white rounded-full font-num">POPULAR</div>
            <div>
              <div class="text-xs font-semibold text-neutral-900 mb-1">Pro</div>
              <div class="text-2xl font-extrabold font-num text-neutral-950 mb-3">$29<span class="text-xs text-neutral-400 font-sans font-normal">/mo</span></div>
              <ul class="text-xs text-neutral-600 space-y-2 mb-4">
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span><strong class="font-num font-semibold text-neutral-900">10,000</strong> requests / day</span></li>
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>UltraMemory File Storage</span></li>
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>UltraSearch Mode 2 Standard</span></li>
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Full Edge Crawler Access</span></li>
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Unified MCP Server</span></li>
              </ul>
            </div>
            <button onclick="handleProvisionKeyClick('pro')" class="w-full py-1.5 text-center text-xs font-semibold rounded-lg bg-black hover:bg-neutral-800 text-white cursor-pointer shadow-xs">Choose Pro</button>
          </div>

          <div class="card-clean p-5 rounded-2xl flex flex-col justify-between">
            <div>
              <div class="text-xs font-semibold text-neutral-500 mb-1">Ultra</div>
              <div class="text-2xl font-extrabold font-num text-neutral-950 mb-3">$99<span class="text-xs text-neutral-400 font-sans font-normal">/mo</span></div>
              <ul class="text-xs text-neutral-600 space-y-2 mb-4">
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span><strong class="font-num font-semibold text-neutral-900">100,000</strong> requests / day</span></li>
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Multi-Agent Container Namespaces</span></li>
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>UltraSearch Mode 3 Deep</span></li>
                <li class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Priority Edge Execution</span></li>
              </ul>
            </div>
            <button onclick="handleProvisionKeyClick('ultra')" class="w-full py-1.5 text-center text-xs font-semibold rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 cursor-pointer">Choose Ultra</button>
          </div>
        </div>
      </section>

      <!-- Minimalist Footer with Grey Icon -->
      <footer class="pt-8 pb-12 border-t border-neutral-200 text-xs text-neutral-500 flex flex-col sm:flex-row items-center justify-between gap-3 font-num">
        <div class="flex items-center gap-2">
          <svg class="w-3.5 h-3.5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
          <span class="font-bold text-neutral-900">UltraDemon</span>
          <span class="font-serif font-bold italic text-neutral-500">engine</span>
          <span>·</span>
          <span>MIT License</span>
        </div>
        <div class="flex items-center gap-4 text-neutral-600">
          <a href="/openapi.json" target="_blank" class="hover:text-black">/openapi.json</a>
          <a href="/health" target="_blank" class="hover:text-black">/health</a>
          <a href="https://github.com/im-ansh/UltraDemon" target="_blank" class="hover:text-black">GitHub</a>
        </div>
      </footer>
    </main>
  </div>

  <!-- Auth Modal with Grey SVGs -->
  <div id="authModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs hidden">
    <div class="bg-white p-6 rounded-2xl w-full max-w-sm shadow-2xl relative border border-neutral-300">
      <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-neutral-400 hover:text-black transition cursor-pointer">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M18 6 6 18M6 6l12 12"/></svg>
      </button>
      
      <div class="flex items-center gap-2 mb-4">
        <div class="w-6 h-6 rounded bg-neutral-100 flex items-center justify-center text-neutral-700">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div>
          <h3 id="authModalTitle" class="text-base font-bold text-neutral-950">
            Sign In to <span class="font-serif font-bold italic text-black">UltraDemon</span>
          </h3>
          <p class="text-[11px] text-neutral-500">Unified credentials for Search &amp; Memory</p>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-1 p-1 bg-neutral-100 rounded-lg mb-4 text-xs font-medium">
        <button id="authTabSignIn" onclick="switchAuthMode('signin')" class="py-1.5 rounded-md font-semibold bg-black text-white transition cursor-pointer">Sign In</button>
        <button id="authTabSignUp" onclick="switchAuthMode('signup')" class="py-1.5 rounded-md font-semibold text-neutral-600 hover:text-black transition cursor-pointer">Sign Up</button>
      </div>

      <form id="authForm" onsubmit="handleAuthSubmit(event)" class="space-y-3">
        <div>
          <label class="block text-[11px] font-medium text-neutral-600 mb-1">Email</label>
          <input 
            type="email" 
            id="authEmail" 
            placeholder="dev@example.com" 
            required 
            class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-950 text-xs focus:outline-none focus:bg-white focus:border-black transition"
          />
        </div>
        <div>
          <label class="block text-[11px] font-medium text-neutral-600 mb-1">Password</label>
          <input 
            type="password" 
            id="authPassword" 
            placeholder="••••••••" 
            required 
            minlength="6"
            class="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-950 text-xs focus:outline-none focus:bg-white focus:border-black transition"
          />
        </div>

        <div id="authAlert" class="hidden p-2.5 rounded-lg text-[11px] font-medium"></div>

        <button 
          type="submit" 
          id="authSubmitBtn"
          class="w-full py-2 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-lg transition shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <span id="authSubmitText">Sign In</span>
          <span id="authSpinner" class="hidden">
            <svg class="w-3 h-3 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
          </span>
        </button>
      </form>

      <div class="mt-3 pt-3 border-t border-neutral-100 text-center text-[10px] text-neutral-400">
        Supabase Free Email Auth · Passwords encrypted with bcrypt
      </div>
    </div>
  </div>

  <!-- Client-side JavaScript with clean string construction and zero emojis -->
  <script>
    const SUPABASE_URL = "${supabaseUrl}";
    const SUPABASE_ANON_KEY = "${supabaseAnonKey}";
    const STORAGE_KEY = 'ultrasearch_local_keys';

    let supabase = null;
    let currentUser = null;
    let currentAuthMode = 'signin';
    let currentMode = 1;

    if (window.supabase) {
      supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }

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
        ? 'Sign In to <span class="font-serif font-bold italic text-black">UltraDemon</span>' 
        : 'Sign Up for <span class="font-serif font-bold italic text-black">UltraDemon</span>';
      document.getElementById('authSubmitText').innerText = isSignIn ? 'Sign In' : 'Sign Up';

      const tabIn = document.getElementById('authTabSignIn');
      const tabUp = document.getElementById('authTabSignUp');
      if (isSignIn) {
        tabIn.className = 'py-1.5 rounded-md font-semibold bg-black text-white transition cursor-pointer';
        tabUp.className = 'py-1.5 rounded-md font-semibold text-neutral-600 hover:text-black transition cursor-pointer';
      } else {
        tabIn.className = 'py-1.5 rounded-md font-semibold text-neutral-600 hover:text-black transition cursor-pointer';
        tabUp.className = 'py-1.5 rounded-md font-semibold bg-black text-white transition cursor-pointer';
      }
    }

    async function handleAuthSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      const alertBox = document.getElementById('authAlert');
      const spinner = document.getElementById('authSpinner');
      const submitBtn = document.getElementById('authSubmitBtn');

      if (!supabase) return;

      spinner.classList.remove('hidden');
      submitBtn.disabled = true;
      alertBox.classList.add('hidden');

      try {
        if (currentAuthMode === 'signup') {
          const { data, error } = await supabase.auth.signUp({ email, password });
          if (error) throw error;

          alertBox.className = 'p-2.5 rounded-lg text-[11px] font-medium bg-neutral-100 border border-neutral-300 text-neutral-900';
          alertBox.innerText = data.session 
            ? 'Account created and signed in!'
            : 'Account created! Please check your email for the confirmation link.';
          alertBox.classList.remove('hidden');

          if (data.session) {
            setTimeout(() => {
              closeAuthModal();
              document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
            }, 800);
          }
        } else {
          const { data, error } = await supabase.auth.signInWithPassword({ email, password });
          if (error) throw error;

          alertBox.className = 'p-2.5 rounded-lg text-[11px] font-medium bg-neutral-100 border border-neutral-300 text-neutral-900';
          alertBox.innerText = 'Signed in successfully!';
          alertBox.classList.remove('hidden');

          setTimeout(() => {
            closeAuthModal();
            document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
          }, 600);
        }
      } catch (err) {
        alertBox.className = 'p-2.5 rounded-lg text-[11px] font-medium bg-neutral-100 border border-neutral-300 text-red-600';
        alertBox.innerText = err.message || 'Authentication error';
        alertBox.classList.remove('hidden');
      } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
      }
    }

    async function handleSignOut() {
      if (supabase) await supabase.auth.signOut();
      localStorage.removeItem(STORAGE_KEY);
      updateAuthUI(null);
    }

    function handleProvisionKeyClick(plan) {
      if (currentUser) {
        if (plan && document.getElementById('newKeyPlan')) {
          document.getElementById('newKeyPlan').value = plan;
        }
        document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
      } else {
        openAuthModal('signup');
      }
    }

    function updateAuthUI(user) {
      currentUser = user;
      const sideLoggedOut = document.getElementById('sideAuthLoggedOut');
      const sideLoggedIn = document.getElementById('sideAuthLoggedIn');
      const sideEmail = document.getElementById('sideUserEmail');
      const banner = document.getElementById('authPromptBanner');
      const createKeyLocked = document.getElementById('createKeyLocked');
      const createKeyForm = document.getElementById('createKeyForm');
      const userAccountDisplay = document.getElementById('keyUserAccountDisplay');

      if (user) {
        sideLoggedOut.classList.add('hidden');
        sideLoggedIn.classList.remove('hidden');
        sideEmail.innerText = user.email || user.id;

        createKeyLocked.classList.add('hidden');
        createKeyForm.classList.remove('hidden');
        if (userAccountDisplay) userAccountDisplay.innerText = user.email || user.id;

        banner.innerHTML = '<div class=\"flex items-center gap-2\"><svg class=\"w-4 h-4 text-neutral-700\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" stroke-width=\"2.5\"><polyline points=\"20 6 9 17 4 12\"/></svg><div class=\"text-xs\"><span class=\"font-bold text-neutral-950\">Signed in:</span> <span class=\"text-neutral-600\">' + (user.email || user.id) + '</span></div></div><button onclick=\"handleSignOut()\" class=\"px-3 py-1 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-100 cursor-pointer\">Sign Out</button>';

        loadRemoteKeys(user.id);
        refreshStoredMemories();
      } else {
        sideLoggedOut.classList.remove('hidden');
        sideLoggedIn.classList.add('hidden');

        createKeyLocked.classList.remove('hidden');
        createKeyForm.classList.add('hidden');

        banner.innerHTML = '<div class=\"flex items-center gap-2\"><svg class=\"w-4 h-4 text-neutral-500\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" stroke-width=\"2\"><rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M7 11V7a5 5 0 0 1 10 0v4\"/></svg><div class=\"text-xs\"><span class=\"font-bold text-neutral-950\">Authentication Required:</span> <span class=\"text-neutral-600\">Sign in or create an account to generate and manage keys.</span></div></div><div class=\"flex items-center gap-2\"><button onclick=\"openAuthModal(\\'signin\\')\" class=\"px-3 py-1.5 text-xs font-semibold rounded-lg bg-black text-white hover:bg-neutral-800 cursor-pointer\">Sign In</button><button onclick=\"openAuthModal(\\'signup\\')\" class=\"px-3 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-100 cursor-pointer\">Create Account</button></div>';

        renderKeysTable();
        refreshUsage();
        renderMemoriesTable([]);
      }
    }

    async function loadRemoteKeys(userId) {
      try {
        const session = (await supabase.auth.getSession())?.data?.session;
        if (!session) return;
        const resp = await fetch('/v1/keys', {
          headers: { 'Authorization': 'Bearer ' + session.access_token }
        });
        const data = await resp.json();
        if (data.keys) {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data.keys));
          renderKeysTable();
          refreshUsage();
        }
      } catch (e) {
        renderKeysTable();
      }
    }

    function setMode(m) {
      currentMode = m;
      [1, 2, 3].forEach(i => {
        const btn = document.getElementById('modeBtn' + i);
        if (i === m) {
          btn.className = 'px-2 py-0.5 rounded text-white bg-black font-medium cursor-pointer';
        } else {
          btn.className = 'px-2 py-0.5 rounded text-neutral-600 hover:text-black cursor-pointer';
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
            ? 'px-3 py-1.5 text-xs font-semibold rounded-lg bg-black text-white cursor-pointer transition'
            : 'px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition';
        }
      });
    }

    function copyToClipboard(text) {
      navigator.clipboard.writeText(text);
      alert('Copied to clipboard');
    }

    function getActiveKey() {
      const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return keys.length > 0 ? keys[0].plain_key : '';
    }

    // ── UltraMemory Frontend ──────────────────────────────────────────────────

    function fillMemorySample(type, content, container) {
      document.getElementById('memTypeInput').value = type;
      document.getElementById('memContentInput').value = content;
      document.getElementById('memContainerInput').value = container;
    }

    async function handleStoreMemory(e) {
      e.preventDefault();
      if (!currentUser) {
        openAuthModal('signin');
        return;
      }
      const apiKey = getActiveKey();
      if (!apiKey) {
        alert('Please generate an API key in the Console first.');
        document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const content = document.getElementById('memContentInput').value.trim();
      const memoryType = document.getElementById('memTypeInput').value;
      const containerTag = document.getElementById('memContainerInput').value.trim() || 'default';

      const spinner = document.getElementById('storeMemSpinner');
      const submitBtn = document.getElementById('storeMemBtn');
      const alertBox = document.getElementById('storeMemAlert');

      spinner.classList.remove('hidden');
      submitBtn.disabled = true;
      alertBox.classList.add('hidden');

      try {
        const resp = await fetch('/v1/memory', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
          body: JSON.stringify({ content, memory_type: memoryType, container_tag: containerTag })
        });
        const data = await resp.json();

        if (resp.ok && data.memory_id) {
          alertBox.className = 'mt-3 p-2.5 rounded-lg text-xs font-num bg-neutral-100 border border-neutral-300 text-neutral-950 flex items-center justify-between';
          alertBox.innerHTML = '<span class=\"flex items-center gap-1.5\"><svg class=\"w-3.5 h-3.5 text-neutral-700\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" stroke-width=\"2.5\"><polyline points=\"20 6 9 17 4 12\"/></svg><span>Stored: <strong>' + data.memory_id + '</strong> [' + data.container_tag + ']</span></span><span class=\"text-[10px] text-neutral-500 font-sans\">Edge D1 FTS5</span>';
          alertBox.classList.remove('hidden');
          document.getElementById('memContentInput').value = '';
          refreshStoredMemories();
        } else {
          throw new Error(data.error || 'Failed to store memory');
        }
      } catch (err) {
        alertBox.className = 'mt-3 p-2.5 rounded-lg text-xs font-num bg-neutral-100 border border-neutral-300 text-red-600';
        alertBox.innerText = 'Error: ' + err.message;
        alertBox.classList.remove('hidden');
      } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
      }
    }

    async function handleQueryMemory(e) {
      e.preventDefault();
      if (!currentUser) {
        openAuthModal('signin');
        return;
      }
      const apiKey = getActiveKey();
      if (!apiKey) {
        alert('Please generate an API key in the Console first.');
        document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const query = document.getElementById('memQueryInput').value.trim();
      const containerTag = document.getElementById('memQueryContainer').value.trim();
      const spinner = document.getElementById('queryMemSpinner');
      const submitBtn = document.getElementById('queryMemBtn');
      const resultsDiv = document.getElementById('memResultsContainer');
      const latencyBadge = document.getElementById('memRecallLatencyBadge');

      if (!query) return;

      spinner.classList.remove('hidden');
      submitBtn.disabled = true;
      resultsDiv.innerHTML = '<div class=\"text-center py-4 text-neutral-400 text-xs\">Recalling from edge BM25...</div>';

      const t0 = performance.now();
      try {
        const resp = await fetch('/v1/memory/query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
          body: JSON.stringify({ query, container_tag: containerTag || undefined, limit: 5 })
        });
        const data = await resp.json();
        const duration = Math.round(performance.now() - t0);

        latencyBadge.innerText = (data.query_time_ms || duration) + 'ms (Edge D1 BM25)';
        latencyBadge.classList.remove('hidden');

        if (data.results && data.results.length > 0) {
          resultsDiv.innerHTML = data.results.map(r => 
            '<div class=\"p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs\">' +
              '<div class=\"flex items-center justify-between font-num text-[10px] text-neutral-500 mb-1\">' +
                '<span class=\"px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-800 uppercase font-semibold\">' + r.memory_type + '</span>' +
                '<span class=\"font-mono\">' + r.container_tag + '</span>' +
                '<span class=\"font-bold text-black\">Score: ' + (r.score || 0.9).toFixed(2) + '</span>' +
              '</div>' +
              '<p class=\"text-neutral-800\">' + r.content + '</p>' +
            '</div>'
          ).join('');
        } else {
          resultsDiv.innerHTML = '<div class=\"text-center py-3 text-neutral-400 text-xs\">No matching memories found in edge index.</div>';
        }
      } catch (err) {
        resultsDiv.innerHTML = '<div class=\"p-2.5 bg-neutral-100 border border-neutral-300 text-red-600 text-xs font-num\">Error: ' + err.message + '</div>';
      } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
      }
    }

    async function refreshStoredMemories() {
      const apiKey = getActiveKey();
      if (!currentUser || !apiKey) {
        renderMemoriesTable([]);
        return;
      }
      try {
        const resp = await fetch('/v1/memory?limit=25', { headers: { 'X-API-Key': apiKey } });
        const data = await resp.json();
        if (data.memories) renderMemoriesTable(data.memories);
      } catch {}
    }

    function renderMemoriesTable(memories) {
      const tbody = document.getElementById('memoriesTableBody');
      if (!currentUser) {
        tbody.innerHTML = '<tr><td colspan=\"5\" class=\"py-3 text-center text-neutral-400\">Sign in to view your memories.</td></tr>';
        return;
      }
      if (!memories || memories.length === 0) {
        tbody.innerHTML = '<tr><td colspan=\"5\" class=\"py-3 text-center text-neutral-400\">No memories stored yet.</td></tr>';
        return;
      }

      tbody.innerHTML = memories.map(m => 
        '<tr class=\"hover:bg-neutral-50\">' +
          '<td class=\"py-2 font-mono text-neutral-900\">' + m.memory_id + '</td>' +
          '<td class=\"py-2 font-mono text-neutral-600\">' + m.container_tag + '</td>' +
          '<td class=\"py-2\"><span class=\"px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-800 text-[10px] uppercase font-semibold\">' + m.memory_type + '</span></td>' +
          '<td class=\"py-2 text-neutral-900 truncate max-w-xs font-sans\">' + (m.title || m.content) + '</td>' +
          '<td class=\"py-2 text-right font-sans\"><button onclick=\"handleDeleteMemory(\\'' + m.memory_id + '\\')\" class=\"text-neutral-500 hover:text-black font-semibold cursor-pointer\">Delete</button></td>' +
        '</tr>'
      ).join('');
    }

    async function handleDeleteMemory(memoryId) {
      if (!confirm('Delete memory ' + memoryId + '?')) return;
      const apiKey = getActiveKey();
      if (!apiKey) return;
      try {
        await fetch('/v1/memory/' + memoryId, { method: 'DELETE', headers: { 'X-API-Key': apiKey } });
        refreshStoredMemories();
      } catch {}
    }

    // ── UltraSearch Frontend ──────────────────────────────────────────────────

    function setQuery(q) {
      document.getElementById('queryInput').value = q;
      const form = document.getElementById('searchForm');
      if (form) handleSearch(new Event('submit'));
    }

    async function handleSearch(e) {
      if (e && e.preventDefault) e.preventDefault();
      const query = document.getElementById('queryInput').value.trim();
      const useCache = document.getElementById('useCacheCheck').checked;
      const resultsDiv = document.getElementById('resultsContainer');
      const latencyBadge = document.getElementById('latencyBadge');
      const spinner = document.getElementById('searchSpinner');

      if (!query) return;

      if (!currentUser) {
        resultsDiv.innerHTML = '<div class=\"p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center space-y-2\"><div class=\"w-8 h-8 mx-auto rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600\"><svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" stroke-width=\"2\"><rect width=\"18\" height=\"11\" x=\"3\" y=\"11\" rx=\"2\" ry=\"2\"/><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M7 11V7a5 5 0 0 1 10 0v4\"/></svg></div><div class=\"text-xs font-bold text-neutral-950\">Authentication Required</div><p class=\"text-[11px] text-neutral-500\">Please log in or sign up before querying the index.</p><button onclick=\"openAuthModal(\\'signin\\')\" class=\"mt-2 px-3 py-1.5 text-xs font-semibold rounded bg-black text-white cursor-pointer\">Sign In</button></div>';
        openAuthModal('signin');
        return;
      }

      const apiKey = getActiveKey();
      if (!apiKey) {
        resultsDiv.innerHTML = '<div class=\"p-6 rounded-xl bg-neutral-50 border border-neutral-200 text-center space-y-2\"><div class=\"w-8 h-8 mx-auto rounded-full bg-neutral-200 flex items-center justify-center text-neutral-600\"><svg class=\"w-4 h-4\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" stroke-width=\"2\"><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1-1-1.5 1.5L7 8l-1.5 1.5L4 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2h2v2h2l4-4 1.5 1.5 1.5-1.5 1.5-1.5 2-2z\"/><circle cx=\"17.5\" cy=\"6.5\" r=\"1.5\"/></svg></div><div class=\"text-xs font-bold text-neutral-950\">API Key Required</div><p class=\"text-[11px] text-neutral-500\">Generate an API key in the Developer Console first.</p><button onclick=\"document.getElementById(\\'console\\').scrollIntoView({behavior:\\'smooth\\'})\" class=\"mt-2 px-3 py-1.5 text-xs font-semibold rounded bg-black text-white cursor-pointer\">Generate Key ↓</button></div>';
        document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      spinner.classList.remove('hidden');
      resultsDiv.innerHTML = '<div class=\"text-center py-4 text-neutral-400 text-xs\">Searching sovereign BM25 index...</div>';

      const t0 = performance.now();
      try {
        const resp = await fetch('/v1/search', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
          body: JSON.stringify({ query, num_results: 5, mode: currentMode, use_cache: useCache })
        });
        const data = await resp.json();
        const duration = Math.round(performance.now() - t0);

        if (resp.status === 401) {
          resultsDiv.innerHTML = '<div class=\"p-4 rounded-xl bg-neutral-100 text-center text-xs font-bold text-neutral-950\">Authentication Error: ' + (data.error || 'Invalid Key') + '</div>';
          return;
        }

        latencyBadge.innerText = (data.search_time_ms || duration) + 'ms' + (data.cached ? ' (KV Hit)' : '');
        latencyBadge.classList.remove('hidden');

        if (data.results && data.results.length > 0) {
          resultsDiv.innerHTML = data.results.map(r => 
            '<div class=\"p-3.5 rounded-xl bg-neutral-50 border border-neutral-200 hover:border-neutral-400 transition\">' +
              '<div class=\"flex items-center justify-between text-[10px] text-neutral-500 mb-1 font-num\">' +
                '<span class=\"truncate max-w-sm font-mono\">' + r.url + '</span>' +
                '<span class=\"bg-neutral-200 text-neutral-900 px-1.5 py-0.2 rounded font-semibold\">BM25: ' + (r.score || '0.95') + '</span>' +
              '</div>' +
              '<a href=\"' + r.url + '\" target=\"_blank\" class=\"text-xs font-bold text-neutral-950 hover:underline block mb-0.5\">' + r.title + '</a>' +
              '<p class=\"text-xs text-neutral-600 leading-relaxed\">' + r.snippet + '</p>' +
            '</div>'
          ).join('');
        } else {
          resultsDiv.innerHTML = '<div class=\"text-center py-4 text-neutral-400 text-xs\">No results found in current index. Crawl more URLs below!</div>';
        }
      } catch (err) {
        resultsDiv.innerHTML = '<div class=\"p-3 bg-neutral-100 border border-neutral-300 text-red-600 text-xs font-num\">Error: ' + err.message + '</div>';
      } finally {
        spinner.classList.add('hidden');
      }
    }

    async function handleCreateKey(e) {
      e.preventDefault();
      if (!currentUser) {
        openAuthModal('signin');
        return;
      }
      const plan = document.getElementById('newKeyPlan').value;
      const label = document.getElementById('newKeyLabel').value.trim();
      const spinner = document.getElementById('createKeySpinner');
      const submitBtn = document.getElementById('createKeyBtn');

      const session = (await supabase.auth.getSession())?.data?.session;
      if (!session) return;

      spinner.classList.remove('hidden');
      submitBtn.disabled = true;

      try {
        const resp = await fetch('/v1/keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + session.access_token },
          body: JSON.stringify({ plan, label })
        });
        const data = await resp.json();

        if (data.plain_key) {
          document.getElementById('newKeyDisplay').innerText = data.plain_key;
          document.getElementById('newKeyAlert').classList.remove('hidden');

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
          refreshStoredMemories();
        } else {
          alert('Error: ' + (data.error || 'Failed to create key'));
        }
      } catch (err) {
        alert('Request failed: ' + err.message);
      } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
      }
    }

    function renderKeysTable() {
      const tbody = document.getElementById('keysTableBody');
      if (!currentUser) {
        tbody.innerHTML = '<tr><td colspan=\"4\" class=\"py-3 text-center text-neutral-400\">Sign in to view your keys.</td></tr>';
        return;
      }
      const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (keys.length === 0) {
        tbody.innerHTML = '<tr><td colspan=\"4\" class=\"py-3 text-center text-neutral-400\">No keys generated yet.</td></tr>';
        return;
      }

      tbody.innerHTML = keys.map((k, idx) => 
        '<tr class=\"hover:bg-neutral-50\">' +
          '<td class=\"py-2 font-mono text-neutral-900\">' +
            '<span class=\"truncate max-w-[140px] inline-block\">' + (k.plain_key || 'Key: ' + k.key_id) + '</span>' +
            (k.plain_key ? ' <button onclick=\"copyToClipboard(\\'' + k.plain_key + '\\')\" class=\"text-neutral-400 hover:text-black cursor-pointer inline-flex items-center ml-1\"><svg class=\"w-3 h-3\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" stroke-width=\"2\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"/><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"/></svg></button>' : '') +
          '</td>' +
          '<td class=\"py-2\"><span class=\"px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-800 text-[10px] uppercase font-semibold\">' + k.plan + '</span></td>' +
          '<td class=\"py-2 text-neutral-600\">' + (k.label || 'Key') + '</td>' +
          '<td class=\"py-2 text-right\"><button onclick=\"revokeKey(\\'' + (k.plain_key || k.key_id) + '\\', ' + idx + ')\" class=\"text-neutral-500 hover:text-black font-semibold cursor-pointer\">Revoke</button></td>' +
        '</tr>'
      ).join('');
    }

    async function revokeKey(key, index) {
      if (!confirm('Are you sure you want to revoke this API key?')) return;
      try {
        const session = (await supabase.auth.getSession())?.data?.session;
        const headers = {};
        if (session) headers['Authorization'] = 'Bearer ' + session.access_token;
        await fetch('/v1/keys/' + key, { method: 'DELETE', headers });
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
      if (!currentUser || !key) {
        document.getElementById('statUsed').innerText = '—';
        document.getElementById('statLimit').innerText = '—';
        document.getElementById('statRemaining').innerText = '—';
        return;
      }
      try {
        const resp = await fetch('/v1/usage', { headers: { 'X-API-Key': key } });
        const data = await resp.json();
        if (data.daily_limit !== undefined) {
          document.getElementById('statUsed').innerText = data.requests_today || 0;
          document.getElementById('statLimit').innerText = data.daily_limit === 'unlimited' ? '∞' : data.daily_limit;
          document.getElementById('statRemaining').innerText = data.remaining === 'unlimited' ? '∞' : data.remaining;
        }
      } catch {}
    }

    async function handleCrawl(e) {
      e.preventDefault();
      if (!currentUser) {
        alert('Authentication required. Please log in or sign up first.');
        openAuthModal('signin');
        return;
      }
      const apiKey = getActiveKey();
      if (!apiKey) {
        alert('API key required. Please generate an API key in the console first.');
        document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
        return;
      }

      const url = document.getElementById('crawlUrlInput').value.trim();
      const depth = parseInt(document.getElementById('crawlDepthInput').value, 10);
      const spinner = document.getElementById('crawlSpinner');
      const resultBox = document.getElementById('crawlResultBox');
      const statusMsg = document.getElementById('crawlStatusMsg');
      const details = document.getElementById('crawlDetails');

      spinner.classList.remove('hidden');
      resultBox.classList.remove('hidden');
      statusMsg.innerText = 'Crawling and indexing into D1 FTS5...';
      details.innerText = '';

      try {
        const resp = await fetch('/v1/crawl', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-API-Key': apiKey },
          body: JSON.stringify({ url, depth })
        });
        const data = await resp.json();
        statusMsg.innerText = data.message || 'Crawl complete';
        details.innerText = JSON.stringify(data.document || data, null, 2);
      } catch (err) {
        statusMsg.innerText = 'Crawl Error';
        details.innerText = err.message;
      } finally {
        spinner.classList.add('hidden');
      }
    }

    window.addEventListener('DOMContentLoaded', async () => {
      if (supabase) {
        const { data: { session } } = await supabase.auth.getSession();
        updateAuthUI(session?.user || null);

        supabase.auth.onAuthStateChange((_event, session) => {
          updateAuthUI(session?.user || null);
        });
      } else {
        updateAuthUI(null);
      }
    });
  </script>
</body>
</html>`;
}
