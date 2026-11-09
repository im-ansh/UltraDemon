// UltraDemon — Sovereign Autonomous Engine for Agent Memory & Search
// High-End Editorial SaaS Landing Page Styled to Devin AI Benchmark Standards.
// Uses Real 4K High-Fidelity Dashboard Screenshots from UltraDemon.
// Strict Constraint: ZERO EMOJIS ANYWHERE. Minimalist SVG icons only.

import { MICHELANGELUS_BOLD_ITALIC_WOFF2_B64, MICHELANGELUS_REGULAR_WOFF2_B64, NB_INTERNATIONAL_PRO_WOFF2_B64 } from './font-data';
import { BLUEPRINT_CIRCUIT_SVG, VINTAGE_TERMINAL_SVG, MATH_MANUSCRIPT_SVG, TECHNICAL_SCHEMATIC_SVG } from './science-assets';
import { CUSTOM_CURSORS_CSS } from './cursors';

export function renderLandingPage(origin: string, supabaseUrl: string, supabaseAnonKey: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="light scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UltraDemon — Sovereign Autonomous Engine for Agent Memory &amp; Search</title>
  <meta name="description" content="UltraDemon gives autonomous agents sub-15ms long-term memory recall, full-text edge web search, and kinetic micro-telemetry across 330+ Cloudflare edge locations with zero third-party latency.">
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2309090b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polygon points='13 2 3 14 12 14 11 22 21 10 12 10 13 2'/></svg>">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Geist Mono for Numbers & Code -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Supabase JS Client -->
  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"NB International Pro"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
            serif: ['"Michelangelus"', 'Georgia', 'serif'],
            mono: ['"Geist Mono"', 'monospace'],
            num: ['"Geist Mono"', 'monospace'],
          },
          colors: {
            canvas: '#fbfbfd',
            line: '#e5e5eb',
            surface: '#f8f8fa',
          }
        }
      }
    }
  </script>

  <style>
    @font-face {
      font-family: 'NB International Pro';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 100 900;
      font-style: normal;
      font-display: swap;
    }
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

    body, input, textarea, button, select {
      font-family: 'NB International Pro', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #ffffff;
      color: #09090b;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    .font-num, .font-mono {
      font-family: 'Geist Mono', monospace;
      font-variant-numeric: tabular-nums;
    }

    .font-serif {
      font-family: 'Michelangelus', Georgia, serif;
    }

    ${CUSTOM_CURSORS_CSS}

    /* Guaranteed Modal Visibility Rules */
    #authModal.hidden {
      display: none !important;
    }
    #authModal:not(.hidden) {
      display: flex !important;
    }

    /* Devin-Grade Editorial Card Shadows & Borders */
    .devin-card {
      background: #ffffff;
      border: 1px solid #e5e5eb;
      box-shadow: 0 1px 3px rgba(0,0,0,0.02), 0 8px 24px rgba(0,0,0,0.03);
      transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .devin-card:hover {
      border-color: #d4d4d8;
      box-shadow: 0 1px 4px rgba(0,0,0,0.03), 0 12px 32px rgba(0,0,0,0.05);
    }

    .window-frame {
      border: 1px solid #e5e5eb;
      box-shadow: 0 2px 8px rgba(0,0,0,0.04), 0 20px 48px -10px rgba(0,0,0,0.08);
      border-radius: 1rem;
      background: #ffffff;
      overflow: hidden;
    }

    /* Code Block Scrollbars */
    ::-webkit-scrollbar {
      width: 5px;
      height: 5px;
    }
    ::-webkit-scrollbar-track {
      background: transparent;
    }
    ::-webkit-scrollbar-thumb {
      background: #d4d4d8;
      border-radius: 9999px;
    }

    @keyframes pulse-subtle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.55; transform: scale(0.96); }
    }
    .animate-pulse-subtle {
      animation: pulse-subtle 2.2s infinite ease-in-out;
    }

    /* Continuous Left-to-Right Flow Animations (Multi-Velocity Parallax) */
    @keyframes flowDriftFar {
      0% { transform: translate3d(-35px, 0, 0); }
      50% { transform: translate3d(45px, -10px, 0); }
      100% { transform: translate3d(-35px, 0, 0); }
    }
    @keyframes flowDriftMid {
      0% { transform: translate3d(40px, -5px, 0); }
      50% { transform: translate3d(-50px, 8px, 0); }
      100% { transform: translate3d(40px, -5px, 0); }
    }
    @keyframes flowDriftNear {
      0% { transform: translate3d(-20px, 4px, 0); }
      50% { transform: translate3d(30px, -6px, 0); }
      100% { transform: translate3d(-20px, 4px, 0); }
    }

    .drift-far {
      animation: flowDriftFar 32s ease-in-out infinite alternate;
      will-change: transform;
    }
    .drift-mid {
      animation: flowDriftMid 22s ease-in-out infinite alternate;
      will-change: transform;
    }
    .drift-near {
      animation: flowDriftNear 14s ease-in-out infinite alternate;
      will-change: transform;
    }

    @media (prefers-reduced-motion: reduce) {
      .drift-far, .drift-mid, .drift-near {
        animation: none !important;
      }
    }

    #demoModal.hidden { display: none !important; }
    #demoModal:not(.hidden) { display: flex !important; }
  </style>

  <!-- Early-Bound Bulletproof Handlers (Available Millisecond 0) -->
  <script>
    window.openAuthModal = function(mode, plan) {
      window.selectedModalPlan = plan || 'free';
      var modal = document.getElementById('authModal');
      if (modal) {
        modal.classList.remove('hidden');
        if (typeof window.switchAuthTab === 'function') {
          window.switchAuthTab(mode === 'signin' ? 'signin' : 'signup');
        }
      } else {
        window.location.href = mode === 'signin' ? '/login' : ('/signup' + (plan ? '?plan=' + encodeURIComponent(plan) : ''));
      }
    };
    window.closeAuthModal = function() {
      var modal = document.getElementById('authModal');
      if (modal) modal.classList.add('hidden');
    };
    window.openDemoModal = function() {
      var modal = document.getElementById('demoModal');
      if (modal) modal.classList.remove('hidden');
    };
    window.closeDemoModal = function() {
      var modal = document.getElementById('demoModal');
      if (modal) modal.classList.add('hidden');
    };
  </script>
</head>
<body class="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col justify-between">

  <!-- SECTION 1: ANNOUNCEMENT BAR (Devin Style) -->
  <aside id="topAnnouncementBar" class="w-full bg-[#fbfbfd] border-b border-neutral-200/70 py-2 px-4 text-center text-xs text-neutral-600">
    <div class="max-w-6xl mx-auto flex items-center justify-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse-subtle"></span>
      <span class="font-normal">We're giving engineering teams 10,000 free autonomous edge queries with sub-15ms memory.</span>
      <a href="#pricing" class="font-semibold text-neutral-950 hover:underline inline-flex items-center gap-1 ml-1">
        <span>View pricing</span>
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </a>
    </div>
  </aside>

  <!-- SECTION 2: PRIMARY NAVIGATION (Sticky, Devin Restrained Chrome) -->
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-100">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      
      <!-- Wordmark -->
      <a href="/" class="flex items-center gap-2 group">
        <div class="w-6 h-6 rounded-md bg-neutral-950 flex items-center justify-center text-white">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
        </div>
        <span class="font-bold text-sm tracking-tight text-neutral-950 flex items-center gap-1">
          UltraDemon
          <span class="text-[10px] font-mono text-neutral-400 font-semibold px-1 py-0.5 rounded bg-neutral-100">OS</span>
        </span>
      </a>

      <!-- Center Links (Includes Pricing) -->
      <nav class="hidden md:flex items-center gap-6 text-xs text-neutral-600 font-medium">
        <a href="#overview" class="hover:text-neutral-950 transition-colors">Overview</a>
        <a href="#value" class="hover:text-neutral-950 transition-colors">Core Engine</a>
        <a href="#features" class="hover:text-neutral-950 transition-colors">Features</a>
        <a href="#pricing" class="hover:text-neutral-950 transition-colors">Pricing</a>
        <a href="#workflow" class="hover:text-neutral-950 transition-colors">Workflow</a>
        <a href="#integrations" class="hover:text-neutral-950 transition-colors">Integrations</a>
        <a href="/app" class="hover:text-neutral-950 transition-colors">Console</a>
      </nav>

      <!-- Nav Action CTAs (Devin Benchmark Standard) -->
      <div class="flex items-center gap-3">
        <a href="#demo" onclick="openDemoModal(); return false;" class="hidden sm:inline-block text-xs font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 transition-colors cursor-pointer">
          Book a demo
        </a>
        <a href="/login" onclick="openAuthModal('signin'); return false;" class="text-xs font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 transition-colors cursor-pointer">
          Log in
        </a>
        <a href="/signup" onclick="openAuthModal('signup'); return false;" id="navCtaBtn" class="text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 text-white rounded-full px-4 py-1.5 transition-colors shadow-xs cursor-pointer">
          Get started
        </a>
      </div>
    </div>
  </header>

  <!-- MAIN EDITORIAL CONTENT -->
  <main class="flex-1">

    <!-- SECTION 3: HERO & PRODUCT PROMISE (Devin Benchmark Layout with Flowing Scientific Elements) -->
    <section class="relative pt-12 sm:pt-20 pb-20 px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden text-left" id="overview">
      
      <!-- Eyebrow Wayfinding Label -->
      <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-neutral-200/90 bg-neutral-50/70 hover:bg-neutral-100/70 transition-colors text-xs text-neutral-600 mb-6 cursor-pointer" onclick="document.getElementById('value').scrollIntoView({ behavior: 'smooth' })">
        <span class="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse-subtle"></span>
        <span class="font-mono text-[11px] uppercase tracking-wider font-semibold text-neutral-700">Autonomous Software Engineer</span>
        <svg class="w-3 h-3 text-neutral-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </div>

      <!-- Display Headline (Iconic Left-Aligned Devin Style) -->
      <h1 class="text-4xl sm:text-5xl md:text-6xl lg:text-[68px] font-bold tracking-tight text-neutral-950 leading-[1.06] max-w-3xl">
        Meet UltraDemon, your team's <span class="font-serif font-bold italic text-neutral-950">autonomous software engineer</span>
      </h1>

      <!-- Supporting Paragraph (Controlled Measure, Left Aligned) -->
      <p class="text-base sm:text-lg text-neutral-600 max-w-[580px] mt-6 leading-relaxed font-normal">
        UltraDemon runs in the cloud or on your machine, tests in its own browser, and won't stop until your agents have sub-15ms long-term memory recall and full-text edge search across 330+ Cloudflare Anycast cities.
      </p>

      <!-- Action Buttons (Left Aligned Pill Buttons Matching Devin) -->
      <div class="mt-8 flex flex-wrap items-center gap-3">
        <a href="/signup" onclick="openAuthModal('signup'); return false;" class="bg-neutral-950 hover:bg-neutral-800 text-white rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer">
          <span>Get started</span>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
        <button onclick="openDemoModal()" class="border border-neutral-200/90 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-900 rounded-full px-5 py-2.5 text-xs sm:text-sm font-semibold transition-all cursor-pointer">
          Book a demo
        </button>
      </div>

      <!-- Proof Line -->
      <div class="mt-4 font-mono text-[11px] text-neutral-400 flex items-center gap-3">
        <span>Sub-15ms edge recall</span>
        <span>·</span>
        <span>Zero third-party data leakage</span>
        <span>·</span>
        <span>Native MCP protocol</span>
      </div>

      <!-- PANORAMIC FLOATING PRODUCT & SCIENTIFIC ARTIFACTS STAGE -->
      <div class="relative mt-12 sm:mt-16 text-left min-h-[540px]">
        
        <!-- Continuous Drifting Scientific & Blueprint Artifacts (Moving left to right across velocities) -->
        <div class="absolute inset-0 pointer-events-none select-none overflow-visible">
          
          <!-- Blueprint Circuit (Top Left Drift) -->
          <div class="drift-far absolute -left-10 -top-8 w-[280px] sm:w-[340px] h-[210px] rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur-xs p-2 shadow-sm opacity-55 z-0">
            ${BLUEPRINT_CIRCUIT_SVG}
          </div>

          <!-- Vintage 1982 Microcomputer CRT (Bottom Left Drift) -->
          <div class="drift-mid absolute left-4 bottom-2 w-[260px] sm:w-[320px] h-[220px] rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur-xs p-2 shadow-sm opacity-60 z-0">
            ${VINTAGE_TERMINAL_SVG}
          </div>

          <!-- Handwritten Math / BM25 Manuscript (Top Right Drift) -->
          <div class="drift-far absolute right-4 -top-8 w-[270px] sm:w-[330px] h-[220px] rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur-xs p-2 shadow-sm opacity-50 z-0">
            ${MATH_MANUSCRIPT_SVG}
          </div>

          <!-- Optics & Waveguide Technical Schematic (Bottom Right Drift) -->
          <div class="drift-mid absolute -right-8 bottom-6 w-[250px] sm:w-[310px] h-[200px] rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur-xs p-2 shadow-sm opacity-55 z-0">
            ${TECHNICAL_SCHEMATIC_SVG}
          </div>
        </div>

        <!-- Central Layered Product Windows (Focal Plane) -->
        <div class="relative z-10 max-w-4xl mx-auto">
          
          <!-- Base Window: Workspace Overview Master (macOS Framed with Real 4K Screenshot) -->
          <div class="drift-near window-frame">
            <!-- macOS Window Titlebar -->
            <div class="h-9 px-4 bg-[#f8f8fa] border-b border-neutral-200/80 flex items-center justify-between select-none">
              <div class="flex items-center gap-2">
                <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                <span class="ml-2 font-mono text-[11px] text-neutral-500 font-medium">ultrademon-workspace — 330 Anycast PoPs · Active</span>
              </div>
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="font-mono text-[11px] text-neutral-500 font-medium">Anycast Connected · 0.8ms link</span>
              </div>
            </div>

            <!-- Real 4K Master Screenshot -->
            <div class="relative bg-neutral-950 overflow-hidden">
              <img src="/assets/demo/01_workspace_overview.webp" alt="UltraDemon Sovereign Workspace Master Screenshot" class="w-full h-auto block object-cover object-top max-h-[540px]" fetchpriority="high" loading="eager">
            </div>
          </div>

          <!-- Overlapping Layered Window: UltraSearch Live Studio Result (Devin Style Overlay) -->
          <div class="drift-mid hidden sm:block absolute -right-4 -bottom-8 md:-right-8 md:-bottom-10 w-[65%] md:w-[50%] lg:w-[46%] rounded-xl border border-neutral-200/90 bg-white shadow-2xl z-20 overflow-hidden">
            <div class="h-8 px-3.5 bg-[#fbfbfd] border-b border-neutral-200 flex items-center justify-between select-none">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                <span class="ml-1.5 font-mono text-[10px] text-neutral-500 font-semibold truncate">UltraSearch Studio — Live Execution</span>
              </div>
              <span class="font-mono text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-bold font-num">11.4ms</span>
            </div>
            <div class="p-1 bg-white">
              <img src="/assets/demo/02_ultrasearch_live_result.webp" alt="UltraSearch Studio Live Result Screenshot" class="w-full h-auto block rounded-b-lg object-cover object-top max-h-[290px]">
            </div>
          </div>

          <!-- Overlapping Floating PR / Recording Card (Devin Screenshot Exact Feature) -->
          <div class="drift-near hidden lg:block absolute -left-8 -bottom-6 w-[290px] rounded-2xl border border-neutral-200/90 bg-white/95 backdrop-blur-md shadow-2xl z-30 p-4 space-y-3">
            <div class="flex items-center justify-between border-b border-neutral-100 pb-2">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="font-mono text-[10px] text-emerald-800 font-bold uppercase">PR Open · ultrademon #2922</span>
              </div>
              <span class="font-mono text-[10px] text-neutral-400">12 files · +814</span>
            </div>

            <div>
              <h4 class="font-bold text-xs text-neutral-950">Add enterprise Sovereign Memory</h4>
              <p class="text-[11px] text-neutral-500 mt-1 leading-snug">
                Sub-15ms SQLite FTS5 BM25 search across 330 Anycast edge locations.
              </p>
            </div>

            <!-- Terminal Recording Frame -->
            <div class="rounded-xl bg-neutral-950 p-2.5 text-neutral-300 font-mono text-[10px] space-y-1">
              <div class="flex items-center justify-between text-neutral-500 text-[9px] pb-1 border-b border-neutral-800">
                <span>Test recording on Anycast edge</span>
                <span>2/5</span>
              </div>
              <div class="text-emerald-400">&gt; curl -X POST /v1/memory/query</div>
              <div class="text-neutral-400">{ status: 200, latency_ms: 11.2 }</div>
              <div class="text-emerald-400">&gt; 5 passed (0.012s)</div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 4: TRUST / BUILT-FOR STRIP (Quiet, Editorial) -->
    <section class="py-14 border-y border-neutral-100 bg-[#fbfbfd]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-xs uppercase tracking-wider font-mono text-neutral-400 mb-6 font-semibold">Your team’s favorite autonomous infrastructure</div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 items-center">
          
          <div class="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors">
            <svg class="w-4 h-4 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/></svg>
            <span class="font-semibold text-xs tracking-tight">Cloudflare Workers</span>
          </div>

          <div class="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors">
            <svg class="w-4 h-4 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            <span class="font-semibold text-xs tracking-tight">Anthropic MCP</span>
          </div>

          <div class="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors">
            <svg class="w-4 h-4 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="m10 15 5-3-5-3v6Z"/></svg>
            <span class="font-semibold text-xs tracking-tight">OpenAI Swarms</span>
          </div>

          <div class="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors">
            <svg class="w-4 h-4 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2 2 7l10 5 10-5-10-5Z"/><path d="m2 17 10 5 10-5"/><path d="m2 12 10 5 10-5"/></svg>
            <span class="font-semibold text-xs tracking-tight">Cursor Agent</span>
          </div>

          <div class="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors">
            <svg class="w-4 h-4 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"/><line x1="4" y1="22" x2="4" y2="15"/></svg>
            <span class="font-semibold text-xs tracking-tight">Supabase Edge</span>
          </div>

          <div class="flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors">
            <svg class="w-4 h-4 text-neutral-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            <span class="font-semibold text-xs tracking-tight">Vercel AI SDK</span>
          </div>

        </div>
      </div>
    </section>

    <!-- SECTION 5: CORE VALUE PROPOSITION (The Architecture Contrast) -->
    <section class="py-20 px-4 sm:px-6 max-w-6xl mx-auto" id="value">
      <div class="text-left max-w-2xl mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Engineered for agents that refuse third-party latency.
        </h2>
        <p class="text-neutral-600 text-sm sm:text-base mt-3 leading-relaxed">
          Standard cloud architectures force autonomous agents into multi-region hops, external vector databases, and rate-limited scraper proxies. UltraDemon runs directly inside Cloudflare's Anycast edge across 330+ locations.
        </p>
      </div>

      <!-- Contrast Card Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
        
        <!-- Left: Centralized Cloud Lag (The Problem) -->
        <div class="p-6 sm:p-8 rounded-2xl border border-neutral-200 bg-[#fbfbfd] space-y-6 flex flex-col justify-between">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">Legacy Architecture</span>
              <span class="text-xs font-mono font-bold text-red-600 bg-red-50 border border-red-200 px-2 py-0.5 rounded-full">280ms p95</span>
            </div>
            <h3 class="text-lg font-bold text-neutral-950 tracking-tight">Centralized DB &amp; Proxy Bottlenecks</h3>
            <p class="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed">
              Every memory recall round-trips to us-east-1. Scrapers hit bot blockers and cloud captchas. Swarms spend 80% of runtime waiting on network I/O.
            </p>
          </div>
          
          <div class="space-y-2 pt-4 border-t border-neutral-200 font-mono text-xs text-neutral-500">
            <div class="flex justify-between"><span>Vector DB Hop (Virginia)</span><span class="text-neutral-900 font-num font-semibold">160ms</span></div>
            <div class="flex justify-between"><span>Third-party Scraper Proxy</span><span class="text-neutral-900 font-num font-semibold">420ms</span></div>
            <div class="flex justify-between"><span>Cold Start Penalty</span><span class="text-neutral-900 font-num font-semibold">+1,200ms</span></div>
          </div>
        </div>

        <!-- Right: UltraDemon Anycast Edge (The Solution) -->
        <div class="p-6 sm:p-8 rounded-2xl border border-neutral-950 bg-neutral-950 text-white space-y-6 flex flex-col justify-between shadow-xl">
          <div>
            <div class="flex items-center justify-between mb-4">
              <span class="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">UltraDemon Sovereign Mesh</span>
              <span class="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded-full">&lt;15ms p95</span>
            </div>
            <h3 class="text-lg font-bold text-white tracking-tight">Sovereign Edge In-Memory BM25</h3>
            <p class="text-xs sm:text-sm text-neutral-300 mt-2 leading-relaxed">
              Memories, full-text indexes, and search scrapers reside directly in memory at the edge PoP nearest to the client. Zero centralized bottlenecks.
            </p>
          </div>
          
          <div class="space-y-2 pt-4 border-t border-neutral-800 font-mono text-xs text-neutral-400">
            <div class="flex justify-between"><span>RAM L1 Local Cache</span><span class="text-emerald-400 font-num font-bold">0.8ms</span></div>
            <div class="flex justify-between"><span>D1 SQLite FTS5 Persistence</span><span class="text-emerald-400 font-num font-bold">11.4ms</span></div>
            <div class="flex justify-between"><span>Autonomous Edge Scraping</span><span class="text-emerald-400 font-num font-bold">142ms</span></div>
          </div>
        </div>

      </div>
    </section>

    <!-- SECTION 6: FEATURE EVIDENCE GRID ("Your team members’ favorite teammate") -->
    <section class="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100" id="features">
      <div class="text-left mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Your team members’ <span class="font-serif font-bold italic text-neutral-950">favorite teammate</span>
        </h2>
        <p class="text-neutral-600 text-sm sm:text-base mt-2 max-w-xl font-normal">
          Designed from the ground up for autonomous agent swarms that demand sub-15ms memory lookups and zero-leakage web search.
        </p>
      </div>

      <!-- Bento Grid: 2 Large Top Cards, 3 Varied Bottom Cards (Devin Style) -->
      <div class="space-y-6">
        
        <!-- Top Row: 2 Large Cards with Real 4K App Images -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          <!-- Card 1: Sub-15ms Anycast Memory Recall -->
          <div class="devin-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div class="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-5">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
              </div>
              <h3 class="text-lg font-bold text-neutral-950 tracking-tight">Sub-15ms Anycast Memory Recall</h3>
              <p class="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed font-normal">
                Structured long-term memory indexed with SQLite FTS5 BM25 directly across 330 Anycast edge locations. Instant associative recall without vector DB drift.
              </p>
            </div>
            
            <!-- Real Screenshot Preview -->
            <div class="mt-6 rounded-xl border border-neutral-200/90 overflow-hidden bg-neutral-50 shadow-sm">
              <img src="/assets/demo/03_ultramemory_stored_memory.webp" alt="UltraMemory Stored Memory Master Preview" class="w-full h-56 sm:h-64 object-cover object-top" loading="lazy">
            </div>
          </div>

          <!-- Card 2: Edge Web Search Studio -->
          <div class="devin-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div class="w-8 h-8 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-5">
                <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
              </div>
              <h3 class="text-lg font-bold text-neutral-950 tracking-tight">Edge Web Search Studio</h3>
              <p class="text-xs sm:text-sm text-neutral-600 mt-2 leading-relaxed font-normal">
                Real-time edge web search and autonomous scraping. Scrapes 8 sources simultaneously, parses markdown cleanly, and circumvents anti-bot blocks.
              </p>
            </div>
            
            <!-- Real Screenshot Preview -->
            <div class="mt-6 rounded-xl border border-neutral-200/90 overflow-hidden bg-neutral-50 shadow-sm">
              <img src="/assets/demo/02_ultrasearch_live_result.webp" alt="UltraSearch Studio Live Result Preview" class="w-full h-56 sm:h-64 object-cover object-top" loading="lazy">
            </div>
          </div>

        </div>

        <!-- Bottom Row: 3 Varied Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <!-- Card 3: Interactive API Sandbox -->
          <div class="devin-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div class="w-7 h-7 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>
              </div>
              <h4 class="text-base font-bold text-neutral-950 tracking-tight">Interactive API Sandbox</h4>
              <p class="text-xs text-neutral-600 mt-2 leading-relaxed">
                Test live endpoints, inspect headers, and calibrate prompt tokens directly in the developer workbench.
              </p>
            </div>
            <div class="mt-4 rounded-lg border border-neutral-200/80 overflow-hidden bg-neutral-50">
              <img src="/assets/demo/05_api_sandbox.webp" alt="API Sandbox Preview" class="w-full h-44 object-cover object-top" loading="lazy">
            </div>
          </div>

          <!-- Card 4: Telemetry & Kinetic ICP vs PostHog -->
          <div class="devin-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div class="w-7 h-7 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
              </div>
              <h4 class="text-base font-bold text-neutral-950 tracking-tight">Telemetry &amp; ICP Engine</h4>
              <p class="text-xs text-neutral-600 mt-2 leading-relaxed">
                PostHog-competitive real-time telemetry. Evaluates agent session patterns and synthesizes Ideal Customer Profiles.
              </p>
            </div>
            <div class="mt-4 rounded-lg border border-neutral-200/80 overflow-hidden bg-neutral-50">
              <img src="/assets/demo/04_telemetry_icp.webp" alt="Telemetry ICP Engine Preview" class="w-full h-44 object-cover object-top" loading="lazy">
            </div>
          </div>

          <!-- Card 5: Deterministic Audit Trails -->
          <div class="devin-card rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div class="w-7 h-7 rounded-md bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4">
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <h4 class="text-base font-bold text-neutral-950 tracking-tight">Deterministic Audit Trails</h4>
              <p class="text-xs text-neutral-600 mt-2 leading-relaxed">
                Cryptographic SHA-256 verification hashes for every recalled memory vector. Single-tenant zero data leakage.
              </p>
            </div>
            <div class="mt-4 p-3 rounded-lg border border-neutral-200/80 bg-[#fbfbfd] font-mono text-[10px] text-neutral-600 space-y-1.5">
              <div class="text-emerald-700 font-bold">VERIFIED HASH · AES-256-GCM</div>
              <div class="truncate text-neutral-400">0x8f2d...3a9c (Tenant: Acme)</div>
              <div class="text-neutral-500 pt-1 border-t border-neutral-200">Audit Status: 100% Deterministic</div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 7: FOUR-STAGE PRODUCT WORKFLOW (The Narrative Backbone with Real Master Screens) -->
    <section class="py-24 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100" id="workflow">
      <div class="text-left max-w-3xl mb-16">
        <div class="text-xs uppercase tracking-wider font-mono text-neutral-400 mb-2 font-semibold">The Engineering Workflow</div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.12]">
          From prompt to verified memory.<br><span class="font-serif font-bold italic text-neutral-950">UltraDemon</span> gets hard engineering work done.
        </h2>
        <p class="text-neutral-600 text-base mt-3 max-w-xl font-normal">
          A continuous edge loop that transforms noisy task requests into verified, durable memory artifacts and live web insights.
        </p>
      </div>

      <!-- 4 Alternating Stages (Devin Style) -->
      <div class="space-y-24">
        
        <!-- Stage 01: Understand and plan (Text Left, Image Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-5 space-y-4">
            <span class="font-mono text-sm font-semibold text-neutral-400">01</span>
            <h3 class="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">Understand and plan</h3>
            <p class="text-sm text-neutral-600 leading-relaxed font-normal">
              UltraDemon ingests codebase context, indexes namespace vectors, and builds a dependency memory graph across all active worker nodes with zero centralized database round-trips.
            </p>
            <div class="pt-2">
              <a href="#value" class="text-xs font-bold text-neutral-950 hover:underline inline-flex items-center gap-1.5">
                <span>Explore namespace architecture</span>
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            </div>
          </div>
          
          <div class="lg:col-span-7">
            <div class="window-frame">
              <div class="h-8 px-3.5 bg-[#f8f8fa] border-b border-neutral-200/80 flex items-center justify-between select-none">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="ml-2 font-mono text-[10px] text-neutral-500 font-semibold">01 · Codebase Indexing &amp; Namespace Setup</span>
                </div>
                <span class="font-mono text-[10px] text-neutral-400">Workspace Master</span>
              </div>
              <img src="/assets/demo/01_workspace_overview.webp" alt="Stage 01 Workspace Overview Screenshot" class="w-full h-auto block object-cover object-top max-h-[380px]" loading="lazy">
            </div>
          </div>
        </div>

        <!-- Stage 02: Code and test (Image Left, Text Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-7 order-2 lg:order-1">
            <div class="window-frame">
              <div class="h-8 px-3.5 bg-[#f8f8fa] border-b border-neutral-200/80 flex items-center justify-between select-none">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="ml-2 font-mono text-[10px] text-neutral-500 font-semibold">02 · Sub-Millisecond Search Execution</span>
                </div>
                <span class="font-mono text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">11.4ms p95</span>
              </div>
              <img src="/assets/demo/02_ultrasearch_live_result.webp" alt="Stage 02 Search Studio Screenshot" class="w-full h-auto block object-cover object-top max-h-[380px]" loading="lazy">
            </div>
          </div>

          <div class="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span class="font-mono text-sm font-semibold text-neutral-400">02</span>
            <h3 class="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">Code and test</h3>
            <p class="text-sm text-neutral-600 leading-relaxed font-normal">
              Agents trigger parallel BM25 searches and live edge web scrapes. The engine executes queries in under 15ms, returning clean markdown and citations with zero rate limits or bot captcha freezes.
            </p>
            <div class="pt-2">
              <a href="#sandbox" class="text-xs font-bold text-neutral-950 hover:underline inline-flex items-center gap-1.5">
                <span>Test live search latency</span>
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Stage 03: Review and refine (Text Left, Image Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-5 space-y-4">
            <span class="font-mono text-sm font-semibold text-neutral-400">03</span>
            <h3 class="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">Review and refine</h3>
            <p class="text-sm text-neutral-600 leading-relaxed font-normal">
              Browse structured agent memory nodes, prune expired conversation keys, and verify semantic relevance rankings in the interactive memory explorer.
            </p>
            <div class="pt-2">
              <a href="/app" class="text-xs font-bold text-neutral-950 hover:underline inline-flex items-center gap-1.5">
                <span>Inspect memory hierarchy</span>
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            </div>
          </div>

          <div class="lg:col-span-7">
            <div class="window-frame">
              <div class="h-8 px-3.5 bg-[#f8f8fa] border-b border-neutral-200/80 flex items-center justify-between select-none">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="ml-2 font-mono text-[10px] text-neutral-500 font-semibold">03 · Memory Node Inspector</span>
                </div>
                <span class="font-mono text-[10px] text-neutral-400">D1 SQLite FTS5</span>
              </div>
              <img src="/assets/demo/03_ultramemory_stored_memory.webp" alt="Stage 03 Stored Memory Screenshot" class="w-full h-auto block object-cover object-top max-h-[380px]" loading="lazy">
            </div>
          </div>
        </div>

        <!-- Stage 04: Automate and maintain (Image Left, Text Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-7 order-2 lg:order-1">
            <div class="window-frame">
              <div class="h-8 px-3.5 bg-[#f8f8fa] border-b border-neutral-200/80 flex items-center justify-between select-none">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="ml-2 font-mono text-[10px] text-neutral-500 font-semibold">04 · Telemetry, Cron Crawler &amp; ICP Engine</span>
                </div>
                <span class="font-mono text-[9px] bg-neutral-900 text-white px-1.5 py-0.2 rounded font-bold">Active SLA 99.99%</span>
              </div>
              <img src="/assets/demo/04_telemetry_icp.webp" alt="Stage 04 Telemetry Screenshot" class="w-full h-auto block object-cover object-top max-h-[380px]" loading="lazy">
            </div>
          </div>

          <div class="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span class="font-mono text-sm font-semibold text-neutral-400">04</span>
            <h3 class="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">Automate and maintain</h3>
            <p class="text-sm text-neutral-600 leading-relaxed font-normal">
              Autonomous background cron workers refresh edge caches every 15 minutes. Kinetic telemetry continuously monitors latency, cache hits, and persona profiles.
            </p>
            <div class="pt-2">
              <a href="/app" class="text-xs font-bold text-neutral-950 hover:underline inline-flex items-center gap-1.5">
                <span>View real-time telemetry</span>
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- SECTION 8: USE CASES & AUDIENCES -->
    <section class="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100" id="usecases">
      <div class="text-left max-w-2xl mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Built for teams shipping production autonomy
        </h2>
        <p class="text-neutral-600 text-sm sm:text-base mt-2">
          From developer IDE extensions to distributed enterprise swarms.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div class="devin-card p-6 rounded-2xl space-y-3">
          <div class="text-xs font-mono font-bold uppercase text-neutral-400">01 / Autonomous Coding Agents</div>
          <h3 class="text-lg font-bold text-neutral-950">Cursor &amp; Claude Copilots</h3>
          <p class="text-xs text-neutral-600 leading-relaxed">
            Supply agents with sub-15ms codebase recall and live web documentation search without polluting the LLM prompt context window.
          </p>
        </div>

        <div class="devin-card p-6 rounded-2xl space-y-3">
          <div class="text-xs font-mono font-bold uppercase text-neutral-400">02 / Production Swarms</div>
          <h3 class="text-lg font-bold text-neutral-950">Multi-Agent Swarm Sync</h3>
          <p class="text-xs text-neutral-600 leading-relaxed">
            Synchronize shared facts, tool outputs, and task dependencies across dozens of concurrent agents running simultaneously.
          </p>
        </div>

        <div class="devin-card p-6 rounded-2xl space-y-3">
          <div class="text-xs font-mono font-bold uppercase text-neutral-400">03 / Privacy-Conscious Labs</div>
          <h3 class="text-lg font-bold text-neutral-950">Sovereign Compliance</h3>
          <p class="text-xs text-neutral-600 leading-relaxed">
            Strict single-tenant database encryption with zero third-party telemetry, zero vendor training, and zero cloud log retention.
          </p>
        </div>

      </div>
    </section>

    <!-- SECTION 9: INTEGRATIONS GRID ("Connect once, deliver repeatedly") -->
    <section class="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100" id="integrations">
      <div class="text-left max-w-2xl mb-12">
        <div class="text-xs uppercase tracking-wider font-mono text-neutral-400 mb-2 font-semibold">Ecosystem &amp; SDKs</div>
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Connect once, deliver repeatedly with your <span class="font-serif font-bold italic text-neutral-950">favorite tools</span>
        </h2>
        <p class="text-neutral-600 text-sm sm:text-base mt-2 max-w-xl font-normal">
          UltraDemon drops into your existing agent stack with zero proxy layers and full protocol compatibility.
        </p>
      </div>

      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        
        <div class="devin-card p-4 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-mono text-xs">Cu</div>
            <div>
              <div class="text-xs font-bold text-neutral-950">Cursor IDE</div>
              <div class="text-[10px] text-neutral-500 font-mono">Editor MCP Link</div>
            </div>
          </div>
          <span class="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">Active</span>
        </div>

        <div class="devin-card p-4 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-mono text-xs">Cl</div>
            <div>
              <div class="text-xs font-bold text-neutral-950">Claude Desktop</div>
              <div class="text-[10px] text-neutral-500 font-mono">Native MCP Protocol</div>
            </div>
          </div>
          <span class="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">Active</span>
        </div>

        <div class="devin-card p-4 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-mono text-xs">Py</div>
            <div>
              <div class="text-xs font-bold text-neutral-950">Python SDK</div>
              <div class="text-[10px] text-neutral-500 font-mono">pip install ultrademon</div>
            </div>
          </div>
          <span class="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">v1.0.0</span>
        </div>

        <div class="devin-card p-4 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-mono text-xs">TS</div>
            <div>
              <div class="text-xs font-bold text-neutral-950">TypeScript SDK</div>
              <div class="text-[10px] text-neutral-500 font-mono">npm i ultrademon</div>
            </div>
          </div>
          <span class="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">v1.0.0</span>
        </div>

        <div class="devin-card p-4 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-mono text-xs">LC</div>
            <div>
              <div class="text-xs font-bold text-neutral-950">LangChain</div>
              <div class="text-[10px] text-neutral-500 font-mono">Community Retriever</div>
            </div>
          </div>
          <span class="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">Verified</span>
        </div>

        <div class="devin-card p-4 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-mono text-xs">CF</div>
            <div>
              <div class="text-xs font-bold text-neutral-950">Cloudflare Workers</div>
              <div class="text-[10px] text-neutral-500 font-mono">Anycast Edge Deploy</div>
            </div>
          </div>
          <span class="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">Native</span>
        </div>

        <div class="devin-card p-4 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-mono text-xs">Sb</div>
            <div>
              <div class="text-xs font-bold text-neutral-950">Supabase Auth</div>
              <div class="text-[10px] text-neutral-500 font-mono">Row-Level Tenancy</div>
            </div>
          </div>
          <span class="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">Built-In</span>
        </div>

        <div class="devin-card p-4 rounded-xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 font-bold font-mono text-xs">GH</div>
            <div>
              <div class="text-xs font-bold text-neutral-950">GitHub Actions</div>
              <div class="text-[10px] text-neutral-500 font-mono">CI/CD Sync Daemon</div>
            </div>
          </div>
          <span class="text-[9px] font-mono bg-neutral-100 text-neutral-600 px-1.5 py-0.5 rounded">Live</span>
        </div>

      </div>
    </section>

    <!-- SECTION 10: RECENTLY SHIPPED / CHANGELOG TABLE (Devin Style with Preview Thumbnail) -->
    <section class="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100" id="changelog">
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <!-- Left: Section Title & Thumbnail -->
        <div class="lg:col-span-4 space-y-4 text-left">
          <h2 class="text-3xl font-bold tracking-tight text-neutral-950">Recently shipped</h2>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed">
            Continuous deployments to 330+ Anycast edge cities with zero downtime and sub-second rollouts.
          </p>
          <div class="rounded-xl border border-neutral-200/90 overflow-hidden bg-neutral-100 shadow-sm mt-4">
            <img src="/assets/demo/04_telemetry_icp.webp" alt="Changelog Preview" class="w-full h-36 object-cover object-top" loading="lazy">
          </div>
          <div class="pt-2">
            <a href="/app" class="text-xs text-neutral-600 hover:text-neutral-950 font-bold inline-flex items-center gap-1">
              <span>View all releases</span>
              <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </a>
          </div>
        </div>

        <!-- Right: Sleek Activity Table -->
        <div class="lg:col-span-8 divide-y divide-neutral-200 border-t border-b border-neutral-200 text-xs">
          
          <div class="py-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 px-2 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <span class="font-mono text-neutral-400 text-[11px] w-20">Nov 2026</span>
              <span class="font-semibold text-neutral-950">Autonomous Cron Crawler Engine 2.0</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">Core</span>
              <span class="font-mono text-neutral-400">#21347ad</span>
            </div>
          </div>

          <div class="py-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 px-2 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <span class="font-mono text-neutral-400 text-[11px] w-20">Nov 2026</span>
              <span class="font-semibold text-neutral-950">SQLite FTS5 BM25 In-Memory L1 Caching</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">Memory</span>
              <span class="font-mono text-neutral-400">#6607b43</span>
            </div>
          </div>

          <div class="py-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 px-2 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <span class="font-mono text-neutral-400 text-[11px] w-20">Oct 2026</span>
              <span class="font-semibold text-neutral-950">Native Claude Desktop MCP Protocol Endpoint</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">Protocol</span>
              <span class="font-mono text-neutral-400">#73ed02d</span>
            </div>
          </div>

          <div class="py-4 flex items-center justify-between gap-4 hover:bg-neutral-50/50 px-2 rounded-lg transition-colors">
            <div class="flex items-center gap-3">
              <span class="font-mono text-neutral-400 text-[11px] w-20">Oct 2026</span>
              <span class="font-semibold text-neutral-950">Sub-15ms Anycast Edge Routing Calibration</span>
            </div>
            <div class="flex items-center gap-3">
              <span class="font-mono text-[10px] bg-neutral-100 text-neutral-600 px-2 py-0.5 rounded">Edge</span>
              <span class="font-mono text-neutral-400">#c575245</span>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 11: SECURITY & ENTERPRISE CONTROLS -->
    <section class="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100" id="security">
      <div class="text-left max-w-2xl mb-12">
        <div class="text-xs uppercase tracking-wider font-mono text-neutral-400 mb-2 font-semibold">Single-Tenant Governance</div>
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Enterprise security with <span class="font-serif font-bold italic text-neutral-950">fine-grained controls</span>
        </h2>
        <p class="text-neutral-600 text-sm sm:text-base mt-2 max-w-xl font-normal">
          Your search queries and agent memories remain strictly sovereign. We enforce hardware-isolated runtime boundaries across every Anycast node.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        <div class="space-y-3">
          <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 mb-3">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          </div>
          <h3 class="text-base font-bold text-neutral-950">Single-Tenant Edge Encryption</h3>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            AES-256-GCM encryption at rest and in transit. Your memories are partitioned by cryptographic tenant identifiers with zero shared state.
          </p>
        </div>

        <div class="space-y-3">
          <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 mb-3">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <h3 class="text-base font-bold text-neutral-950">Fine-Grained Scope RBAC</h3>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            Issue restricted API keys scoped exclusively to individual namespaces, memory read-only modes, or specific crawl domains.
          </p>
        </div>

        <div class="space-y-3">
          <div class="w-8 h-8 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-900 mb-3">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <h3 class="text-base font-bold text-neutral-950">Zero Model Training Policy</h3>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            Your data is never utilized for LLM training, evaluations, or shared analytics. Complete data portability with one-click purge APIs.
          </p>
        </div>

      </div>
    </section>

    <!-- SECTION 12: INTERACTIVE DEVELOPER SANDBOX -->
    <section class="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100" id="sandbox">
      <div class="text-left max-w-2xl mb-8">
        <div class="text-xs uppercase tracking-wider font-mono text-neutral-400 mb-2 font-semibold">Live Edge Latency Probe</div>
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Try the sub-15ms engine right now
        </h2>
        <p class="text-neutral-600 text-sm sm:text-base mt-2 font-normal">
          Benchmark our live Anycast endpoint from your browser. Measures real network roundtrip to the nearest Cloudflare PoP.
        </p>
      </div>

      <div class="devin-card p-6 sm:p-8 rounded-2xl space-y-6">
        <div class="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <input type="text" id="liveSearchInput" value="autonomous software engineer memory recall" class="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs sm:text-sm focus:outline-none focus:border-neutral-950 transition-colors font-mono" placeholder="Enter query...">
          <button id="btnRunLiveProbe" onclick="runLiveLandingProbe()" class="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs sm:text-sm font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs">
            <span>Send Edge Query</span>
            <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
          </button>
        </div>

        <div id="liveProbeOutput" class="p-4 rounded-xl bg-[#09090b] text-neutral-200 font-mono text-xs overflow-x-auto leading-relaxed border border-neutral-800 hidden">
          <!-- Dynamic JSON results -->
        </div>
      </div>
    </section>

    <!-- SECTION: PRICING & TIERS (Devin-Grade Editorial Pricing) -->
    <section id="pricing" class="py-24 sm:py-32 border-b border-neutral-100 bg-[#fbfbfd]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        
        <!-- Header -->
        <div class="max-w-3xl mb-16 text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200/90 bg-white text-xs text-neutral-600 mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-neutral-950"></span>
            <span class="font-mono text-[11px] uppercase tracking-wider font-semibold text-neutral-800">PRICING &amp; TIERS</span>
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
            Simple, transparent edge pricing.
          </h2>
          <p class="text-base sm:text-lg text-neutral-600 mt-4 leading-relaxed max-w-2xl">
            Deploy autonomous agent memory and BM25 edge search at global scale. No hidden ingress, egress, or cold start charges.
          </p>

          <!-- Billing Toggle -->
          <div class="mt-8 inline-flex items-center p-1 bg-neutral-200/70 rounded-full text-xs font-semibold select-none">
            <button id="billingBtnMonthly" onclick="setBillingCycle('monthly')" class="px-4 py-1.5 rounded-full bg-white text-neutral-950 shadow-xs transition cursor-pointer">Monthly</button>
            <button id="billingBtnAnnual" onclick="setBillingCycle('annual')" class="px-4 py-1.5 rounded-full text-neutral-600 hover:text-neutral-950 transition flex items-center gap-1.5 cursor-pointer">
              <span>Annual</span>
              <span class="px-1.5 py-0.2 rounded-full bg-neutral-950 text-white text-[10px] font-mono">SAVE 20%</span>
            </button>
          </div>
        </div>

        <!-- Pricing Grid (4 Clean Monochrome Cards) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          
          <!-- Card 1: Free / Developer -->
          <div class="devin-card rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-400 transition-all">
            <div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500">DEVELOPER</span>
              <h3 class="text-xl font-bold text-neutral-950 mt-1">Free Tier</h3>
              <p class="text-xs text-neutral-500 mt-1 min-h-[36px]">For individual engineers testing autonomous agents locally.</p>
              <div class="my-6">
                <span class="text-4xl font-normal font-num text-neutral-950 price-free">$0</span>
                <span class="text-xs text-neutral-400 font-mono">/month</span>
              </div>
              <ul class="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-5 font-mono">
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>100 queries / day</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>5 QPS burst limit</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Sub-15ms BM25 Search</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>100 stored memories</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Community support</span>
                </li>
              </ul>
            </div>
            <button onclick="openAuthModal('signup', 'free')" class="w-full mt-8 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs transition cursor-pointer">
              Get Started Free
            </button>
          </div>

          <!-- Card 2: Pro / Autonomous (Featured) -->
          <div class="relative bg-white rounded-2xl border-2 border-neutral-950 p-6 flex flex-col justify-between shadow-lg">
            <div class="absolute -top-3 right-6 bg-neutral-950 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full">
              TEAM FAVORITE
            </div>
            <div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500">AUTONOMOUS</span>
              <h3 class="text-xl font-bold text-neutral-950 mt-1">Pro Tier</h3>
              <p class="text-xs text-neutral-500 mt-1 min-h-[36px]">For engineering teams running autonomous agent swarms in production.</p>
              <div class="my-6">
                <span class="text-4xl font-normal font-num text-neutral-950 price-amount" data-monthly="29" data-annual="24">$29</span>
                <span class="text-xs text-neutral-400 font-mono">/month</span>
              </div>
              <ul class="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-5 font-mono">
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>10,000 queries / day</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>20 QPS burst limit</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Deep Research mode</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>10,000 isolated memories</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>330 Anycast Edge PoPs</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Priority email support</span>
                </li>
              </ul>
            </div>
            <button onclick="openAuthModal('signup', 'pro')" class="w-full mt-8 py-2.5 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs transition shadow-xs cursor-pointer">
              Start Pro Workspace
            </button>
          </div>

          <!-- Card 3: Ultra Engine -->
          <div class="devin-card rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-400 transition-all">
            <div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500">SCALE &amp; CRAWL</span>
              <h3 class="text-xl font-bold text-neutral-950 mt-1">Ultra Engine</h3>
              <p class="text-xs text-neutral-500 mt-1 min-h-[36px]">For high-concurrency swarms and continuous background edge crawling.</p>
              <div class="my-6">
                <span class="text-4xl font-normal font-num text-neutral-950 price-amount" data-monthly="99" data-annual="79">$99</span>
                <span class="text-xs text-neutral-400 font-mono">/month</span>
              </div>
              <ul class="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-5 font-mono">
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>50,000 queries / day</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>50 QPS high burst limit</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Kinetic ICP Telemetry</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Autonomous Edge Crawler (15m)</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Claude &amp; Cursor MCP Server</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Dedicated D1 replica</span>
                </li>
              </ul>
            </div>
            <button onclick="openAuthModal('signup', 'ultra')" class="w-full mt-8 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs transition cursor-pointer">
              Deploy Ultra Engine
            </button>
          </div>

          <!-- Card 4: Enterprise Sovereign -->
          <div class="devin-card rounded-2xl p-6 flex flex-col justify-between hover:border-neutral-400 transition-all">
            <div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500">SOVEREIGN</span>
              <h3 class="text-xl font-bold text-neutral-950 mt-1">Enterprise</h3>
              <p class="text-xs text-neutral-500 mt-1 min-h-[36px]">Custom infrastructure, sovereign VPC deployment, and zero token leakage.</p>
              <div class="my-6">
                <span class="text-4xl font-normal font-num text-neutral-950">Custom</span>
                <span class="text-xs text-neutral-400 font-mono">/annual</span>
              </div>
              <ul class="space-y-2.5 text-xs text-neutral-600 border-t border-neutral-100 pt-5 font-mono">
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Unlimited queries &amp; QPS</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Dedicated Anycast edge PoP</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Private VPC / On-Premise</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Custom fine-tuned vectors</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-3.5 h-3.5 text-neutral-950 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>99.99% SLA &amp; 24/7 hotline</span>
                </li>
              </ul>
            </div>
            <button onclick="openDemoModal()" class="w-full mt-8 py-2.5 px-4 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 font-semibold text-xs transition cursor-pointer">
              Contact Enterprise Sales
            </button>
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 13: FINAL CTA (Devin Centered Closing Statement) -->
    <section class="py-28 px-4 sm:px-6 max-w-4xl mx-auto text-center">
      <h2 class="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-neutral-950 leading-[1.08]">
        Stop deprioritizing.<br><span class="font-serif font-bold italic text-neutral-950">Do it all with UltraDemon</span>
      </h2>
      <p class="text-sm sm:text-base text-neutral-600 max-w-xl mx-auto mt-6 leading-relaxed font-normal">
        Sub-15ms agent memory, sovereign web scraping, and distributed telemetry. Deploy in under 60 seconds with your first API key.
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <a href="/signup" onclick="openAuthModal('signup'); return false;" class="bg-neutral-950 hover:bg-neutral-800 text-white rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all shadow-xs flex items-center gap-2 cursor-pointer">
          <span>Try UltraDemon</span>
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </a>
        <a href="/app" class="border border-neutral-200/90 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-900 rounded-full px-6 py-2.5 text-xs sm:text-sm font-semibold transition-all">
          Talk to sales
        </a>
      </div>
    </section>

  </main>

  <!-- SECTION 14: MULTI-COLUMN EDITORIAL FOOTER -->
  <footer class="border-t border-neutral-200 bg-[#fbfbfd] py-14 px-4 sm:px-6 text-xs text-neutral-600">
    <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
      
      <!-- Brand Col -->
      <div class="col-span-2 space-y-3">
        <div class="flex items-center gap-2">
          <div class="w-5 h-5 rounded bg-neutral-950 text-white flex items-center justify-center">
            <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
          </div>
          <span class="font-bold text-neutral-950 tracking-tight">UltraDemon OS</span>
        </div>
        <p class="text-[11px] text-neutral-500 max-w-sm leading-relaxed">
          The sovereign autonomous engine for agent memory, search, and edge telemetry. Runs across 330+ Cloudflare Anycast edge data centers worldwide.
        </p>
        <div class="font-mono text-[10px] text-neutral-400">
          &copy; 2026 UltraDemon Inc. All rights reserved.
        </div>
      </div>

      <!-- Links Col 1 -->
      <div class="space-y-2">
        <div class="font-bold text-neutral-950 font-mono text-[11px] uppercase tracking-wider mb-2">Product</div>
        <div><a href="#features" class="hover:text-neutral-950 transition-colors">UltraMemory</a></div>
        <div><a href="#features" class="hover:text-neutral-950 transition-colors">UltraSearch</a></div>
        <div><a href="#workflow" class="hover:text-neutral-950 transition-colors">Web Crawler</a></div>
        <div><a href="#sandbox" class="hover:text-neutral-950 transition-colors">API Sandbox</a></div>
      </div>

      <!-- Links Col 2 -->
      <div class="space-y-2">
        <div class="font-bold text-neutral-950 font-mono text-[11px] uppercase tracking-wider mb-2">Resources</div>
        <div><a href="/app" class="hover:text-neutral-950 transition-colors">Developer Console</a></div>
        <div><a href="#integrations" class="hover:text-neutral-950 transition-colors">Claude MCP Server</a></div>
        <div><a href="#integrations" class="hover:text-neutral-950 transition-colors">Python SDK</a></div>
        <div><a href="#integrations" class="hover:text-neutral-950 transition-colors">TypeScript SDK</a></div>
      </div>

      <!-- Links Col 3 -->
      <div class="space-y-2">
        <div class="font-bold text-neutral-950 font-mono text-[11px] uppercase tracking-wider mb-2">Legal</div>
        <div><a href="/privacy" class="hover:text-neutral-950 transition-colors">Privacy Policy</a></div>
        <div><a href="/terms" class="hover:text-neutral-950 transition-colors">Terms of Service</a></div>
        <div><a href="#security" class="hover:text-neutral-950 transition-colors">Security Whitepaper</a></div>
        <div><a href="mailto:support@ultrademon.ai" class="hover:text-neutral-950 transition-colors">Contact</a></div>
      </div>

    </div>
  </footer>

  <!-- AUTH MODAL (Early-Bound, z-[100], 100% Reliable Direct Edge Authentication) -->
  <div id="authModal" onclick="if(event.target === this) closeAuthModal();" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm hidden">
    <div class="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-sm w-full p-6 text-left relative" onclick="event.stopPropagation();">
      
      <!-- Close Button -->
      <button onclick="closeAuthModal()" class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors p-1 cursor-pointer">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>

      <!-- Modal Header -->
      <div class="flex items-center gap-2 mb-4">
        <div class="w-6 h-6 rounded-md bg-neutral-950 flex items-center justify-center text-white">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <span class="font-bold text-base text-neutral-950">UltraDemon OS</span>
      </div>

      <!-- Tab Switcher -->
      <div class="flex border-b border-neutral-200 mb-5">
        <button id="modalTabSignin" onclick="switchAuthTab('signin')" class="flex-1 pb-2 text-xs font-bold border-b-2 border-neutral-950 text-neutral-950 transition-colors cursor-pointer">
          Sign In
        </button>
        <button id="modalTabSignup" onclick="switchAuthTab('signup')" class="flex-1 pb-2 text-xs font-medium border-b-2 border-transparent text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer">
          Create Account
        </button>
      </div>

      <!-- Auth Form -->
      <form id="authModalForm" onsubmit="handleAuthModalSubmit(event)" class="space-y-4 text-xs">
        <div>
          <label class="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Email</label>
          <input type="email" id="modalAuthEmail" required class="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors font-mono" placeholder="agent@company.com">
        </div>
        <div>
          <label class="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Password</label>
          <input type="password" id="modalAuthPassword" required minlength="6" class="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors font-mono" placeholder="••••••••">
        </div>

        <div id="modalAuthError" class="text-red-600 text-[11px] hidden font-mono"></div>
        <div id="modalAuthSuccess" class="text-emerald-700 text-[11px] hidden font-mono"></div>

        <button type="submit" id="modalAuthSubmitBtn" class="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold transition-colors cursor-pointer shadow-xs">
          Sign In
        </button>

        <div class="relative flex items-center justify-center my-3">
          <div class="border-t border-neutral-200 w-full"></div>
          <span class="bg-white px-2 text-[10px] uppercase font-mono text-neutral-400 absolute">or</span>
        </div>

        <!-- 1-Click Instant Guest Access -->
        <button type="button" onclick="handleModalGuestAccess()" id="modalGuestBtn" class="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 font-semibold transition cursor-pointer text-xs shadow-2xs">
          Continue with 1-Click Demo Console
        </button>
      </form>

      <div class="mt-4 text-center">
        <a href="/login" class="text-[11px] text-neutral-500 hover:underline">Or use dedicated auth page</a>
      </div>
    </div>
  </div>

  <!-- BOOK A DEMO MODAL -->
  <div id="demoModal" onclick="if(event.target === this) closeDemoModal();" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm hidden">
    <div class="bg-white rounded-2xl border border-neutral-200 shadow-2xl max-w-md w-full p-6 text-left relative" onclick="event.stopPropagation();">
      <button onclick="closeDemoModal()" class="absolute top-4 right-4 text-neutral-400 hover:text-neutral-900 transition-colors p-1 cursor-pointer">
        <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div class="flex items-center gap-2 mb-2">
        <div class="w-6 h-6 rounded-md bg-neutral-950 flex items-center justify-center text-white">
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        </div>
        <span class="font-bold text-base text-neutral-950">Book an Architecture Demo</span>
      </div>
      <p class="text-xs text-neutral-500 mb-5 leading-relaxed">
        See sub-15ms agent memory and BM25 edge search running live across 330 Cloudflare Anycast cities.
      </p>
      <form onsubmit="handleDemoSubmit(event)" class="space-y-3.5 text-xs">
        <div>
          <label class="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Work Email</label>
          <input type="email" id="demoEmail" required class="w-full px-3 py-2 rounded-xl border border-neutral-200 font-mono text-xs focus:outline-none focus:border-neutral-950" placeholder="engineer@company.com">
        </div>
        <div>
          <label class="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Company / Organization</label>
          <input type="text" id="demoCompany" required class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-950" placeholder="Acme Autonomous AI">
        </div>
        <div>
          <label class="block text-[11px] font-mono text-neutral-500 uppercase tracking-wider mb-1">Estimated Daily Agent Queries</label>
          <select id="demoVolume" class="w-full px-3 py-2 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-950 font-num">
            <option value="10k-50k">10,000 – 50,000 queries / day</option>
            <option value="50k-500k">50,000 – 500,000 queries / day</option>
            <option value="500k+">500,000+ queries / day (High Scale)</option>
          </select>
        </div>
        <div id="demoSuccess" class="hidden p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-medium">
          Demo request confirmed! Launching your interactive sandbox...
        </div>
        <button type="submit" id="demoSubmitBtn" class="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold transition cursor-pointer shadow-xs">
          Schedule Live Architecture Demo
        </button>
      </form>
    </div>
  </div>

  <!-- Client-Side Runtime Script -->
  <script>
    let authMode = 'signin';
    let currentUser = null;

    // Check existing session in localStorage
    function checkAuthSession() {
      const sess = localStorage.getItem('ultrademon_auth_session');
      const usr = localStorage.getItem('ultrademon_user');
      if (sess && usr) {
        try {
          currentUser = JSON.parse(usr);
          window.currentUser = currentUser;
          const navCta = document.getElementById('navCtaBtn');
          if (navCta) {
            navCta.innerText = 'Open Console';
            navCta.onclick = function() { window.location.href = '/app'; };
          }
        } catch (err) {}
      }
    }

    window.switchAuthTab = function(mode) {
      authMode = mode;
      const tabIn = document.getElementById('modalTabSignin');
      const tabUp = document.getElementById('modalTabSignup');
      const btn = document.getElementById('modalAuthSubmitBtn');
      const err = document.getElementById('modalAuthError');
      const succ = document.getElementById('modalAuthSuccess');
      if (err) err.classList.add('hidden');
      if (succ) succ.classList.add('hidden');

      if (mode === 'signin') {
        if (tabIn) tabIn.className = 'flex-1 pb-2 text-xs font-bold border-b-2 border-neutral-950 text-neutral-950 transition-colors cursor-pointer';
        if (tabUp) tabUp.className = 'flex-1 pb-2 text-xs font-medium border-b-2 border-transparent text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer';
        if (btn) btn.innerText = 'Sign In';
      } else {
        if (tabUp) tabUp.className = 'flex-1 pb-2 text-xs font-bold border-b-2 border-neutral-950 text-neutral-950 transition-colors cursor-pointer';
        if (tabIn) tabIn.className = 'flex-1 pb-2 text-xs font-medium border-b-2 border-transparent text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer';
        if (btn) btn.innerText = 'Create Account';
      }
    };

    async function handleAuthModalSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      const email = document.getElementById('modalAuthEmail').value.trim();
      const password = document.getElementById('modalAuthPassword').value;
      const err = document.getElementById('modalAuthError');
      const succ = document.getElementById('modalAuthSuccess');
      const btn = document.getElementById('modalAuthSubmitBtn');

      if (err) err.classList.add('hidden');
      if (succ) succ.classList.add('hidden');

      if (!email || !password) {
        if (err) {
          err.innerText = 'Please provide both email and password';
          err.classList.remove('hidden');
        }
        return;
      }

      if (btn) { btn.disabled = true; btn.innerText = 'Connecting to edge...'; }

      try {
        const endpoint = authMode === 'signup' ? '/v1/auth/signup' : '/v1/auth/signin';
        const plan = window.selectedModalPlan || 'free';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, plan })
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Authentication failed');
        }
        if (data.session) {
          localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session));
        }
        if (data.user) {
          localStorage.setItem('ultrademon_user', JSON.stringify(data.user));
        }
        if (data.active_key) {
          localStorage.setItem('ultrademon_active_key', data.active_key);
        }
        if (succ) {
          succ.innerText = 'Authenticated! Opening workspace...';
          succ.classList.remove('hidden');
        }
        setTimeout(() => {
          window.location.href = '/app' + (plan ? '?plan=' + encodeURIComponent(plan) : '');
        }, 200);
      } catch (error) {
        if (err) {
          err.innerText = error.message || 'Authentication error';
          err.classList.remove('hidden');
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerText = authMode === 'signin' ? 'Sign In' : 'Create Account';
        }
      }
    }

    async function handleModalGuestAccess() {
      const btn = document.getElementById('modalGuestBtn');
      const err = document.getElementById('modalAuthError');
      if (btn) { btn.disabled = true; btn.innerText = 'Initializing demo workspace...'; }
      try {
        const plan = window.selectedModalPlan || 'free';
        const res = await fetch('/v1/auth/anonymous', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan })
        });
        const data = await res.json();
        if (data.session) localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session));
        if (data.user) localStorage.setItem('ultrademon_user', JSON.stringify(data.user));
        if (data.initial_key) localStorage.setItem('ultrademon_active_key', data.initial_key);
        window.location.href = '/app' + (plan ? '?plan=' + encodeURIComponent(plan) : '');
      } catch (e) {
        if (err) {
          err.innerText = 'Failed to init demo: ' + e.message;
          err.classList.remove('hidden');
        }
        if (btn) {
          btn.disabled = false;
          btn.innerText = 'Continue with 1-Click Demo Console';
        }
      }
    }

    async function handleDemoSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      const email = document.getElementById('demoEmail').value.trim();
      const succ = document.getElementById('demoSuccess');
      const btn = document.getElementById('demoSubmitBtn');

      if (btn) { btn.disabled = true; btn.innerText = 'Scheduling demo...'; }

      try {
        const res = await fetch('/v1/auth/anonymous', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: 'pro' })
        });
        const data = await res.json();
        if (data.session) localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session));
        if (data.user) localStorage.setItem('ultrademon_user', JSON.stringify(data.user));
        if (data.initial_key) localStorage.setItem('ultrademon_active_key', data.initial_key);

        if (succ) {
          succ.innerText = 'Demo scheduled for ' + email + '! Entering your interactive workspace...';
          succ.classList.remove('hidden');
        }
        setTimeout(() => {
          window.location.href = '/app?plan=pro';
        }, 700);
      } catch (err) {
        window.location.href = '/app';
      }
    }

    function setBillingCycle(cycle) {
      const btnMonthly = document.getElementById('billingBtnMonthly');
      const btnAnnual = document.getElementById('billingBtnAnnual');
      const priceElements = document.querySelectorAll('.price-amount');

      if (cycle === 'annual') {
        if (btnAnnual) btnAnnual.className = 'px-4 py-1.5 rounded-full bg-white text-neutral-950 shadow-xs transition flex items-center gap-1.5 cursor-pointer';
        if (btnMonthly) btnMonthly.className = 'px-4 py-1.5 rounded-full text-neutral-600 hover:text-neutral-950 transition cursor-pointer';
        priceElements.forEach(el => {
          const annualPrice = el.getAttribute('data-annual');
          if (annualPrice) el.innerText = '$' + annualPrice;
        });
      } else {
        if (btnMonthly) btnMonthly.className = 'px-4 py-1.5 rounded-full bg-white text-neutral-950 shadow-xs transition cursor-pointer';
        if (btnAnnual) btnAnnual.className = 'px-4 py-1.5 rounded-full text-neutral-600 hover:text-neutral-950 transition flex items-center gap-1.5 cursor-pointer';
        priceElements.forEach(el => {
          const monthlyPrice = el.getAttribute('data-monthly');
          if (monthlyPrice) el.innerText = '$' + monthlyPrice;
        });
      }
    }

    async function runLiveLandingProbe() {
      const input = document.getElementById('liveSearchInput');
      const output = document.getElementById('liveProbeOutput');
      const btn = document.getElementById('btnRunLiveProbe');
      const query = input ? input.value.trim() : 'autonomous agent memory';

      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<span>Probing Anycast...</span>';
      }

      const t0 = performance.now();
      try {
        const res = await fetch('/v1/search?q=' + encodeURIComponent(query) + '&limit=3');
        const t1 = performance.now();
        const latency = (t1 - t0).toFixed(1);
        const data = await res.json();

        if (output) {
          output.classList.remove('hidden');
          output.innerHTML = '// UltraDemon Anycast Response — ' + latency + 'ms roundtrip\n' +
            JSON.stringify({
              latency_ms: parseFloat(latency),
              status: res.status,
              edge_colo: res.headers.get('cf-ray') || 'Cloudflare Anycast',
              query: query,
              results_count: (data.results || []).length,
              results: data.results || data
            }, null, 2);
        }
      } catch (e) {
        if (output) {
          output.classList.remove('hidden');
          output.innerText = '// Error querying live endpoint: ' + e.message;
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = '<span>Send Edge Query</span><svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>';
        }
      }
    }

    document.addEventListener('DOMContentLoaded', function() {
      checkAuthSession();
      if (window.location.hash === '#pricing' || window.location.pathname === '/pricing') {
        setTimeout(function() {
          const el = document.getElementById('pricing');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    });
  </script>
</body>
</html>`;
}
