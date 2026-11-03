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

  <!-- Immediate Head Script: Fast-Path Skip & Instant Curtain Bypass -->
  <script>
    (function() {
      try {
        if (sessionStorage.getItem('ultrademon_jacket_unzipped') === 'true') {
          document.write('<style id="fastSkipStyle">#jacketCurtain, #skipJacketBtn { display: none !important; }</style>');
        }
      } catch (e) {}

      window.skipJacket = function(e) {
        if (e && e.stopPropagation) e.stopPropagation();
        if (e && e.preventDefault) e.preventDefault();
        try {
          sessionStorage.setItem('ultrademon_jacket_unzipped', 'true');
        } catch (err) {}

        var curtain = document.getElementById('jacketCurtain');
        if (curtain) {
          curtain.style.pointerEvents = 'none';
          curtain.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
          curtain.style.opacity = '0';
          setTimeout(function() {
            if (curtain && curtain.parentNode) curtain.parentNode.removeChild(curtain);
          }, 200);
        }
        var btn = document.getElementById('skipJacketBtn');
        if (btn) btn.style.display = 'none';
        document.body.style.userSelect = '';
      };
      window.finishUnzip = window.skipJacket;
    })();
  </script>


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

    /* Custom Inverted Cursor (Cursor Hijack with Difference Blend) */
    .custom-cursor {
      position: fixed;
      top: 0;
      left: 0;
      width: 14px;
      height: 14px;
      background-color: #ffffff;
      border-radius: 50%;
      pointer-events: none !important;
      z-index: 99990;
      mix-blend-mode: difference;
      transition: width 0.22s cubic-bezier(0.16, 1, 0.3, 1), height 0.22s cubic-bezier(0.16, 1, 0.3, 1), transform 0.08s ease-out, opacity 0.2s ease;
      transform: translate(-50%, -50%);
      opacity: 0;
    }
    .custom-cursor.active {
      opacity: 1;
    }
    .custom-cursor.hovered {
      width: 48px;
      height: 48px;
    }
    .custom-cursor.clicked {
      transform: translate(-50%, -50%) scale(0.75);
    }
    @media (pointer: coarse) {
      .custom-cursor {
        display: none !important;
      }
    }

    /* Scroll-reveal animations - safe fallback so page is NEVER blank */
    .reveal-on-scroll {
      opacity: 1;
      transform: translateY(0);
      transition: opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal-ready .reveal-on-scroll:not(.is-revealed):not(#overview) {
      opacity: 0;
      transform: translateY(18px);
    }
    .reveal-ready .reveal-on-scroll.is-revealed {
      opacity: 1 !important;
      transform: translateY(0) !important;
    }

    /* Header Base (Sky Blue Hero State) */
    #mainHeader {
      background-color: rgba(56, 189, 248, 0.92);
      color: #ffffff;
      border-bottom: 1px solid rgba(255, 255, 255, 0.25);
      transition: background-color 0.2s ease, color 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease;
    }
    #mainHeader .nav-link {
      color: rgba(255, 255, 255, 0.9);
      transition: color 0.15s ease;
    }
    #mainHeader .nav-link:hover {
      color: #ffffff;
    }
    #mainHeader #brandName {
      color: #ffffff;
    }
    #mainHeader #logoEngine {
      color: rgba(255, 255, 255, 0.8);
    }
    #mainHeader #logoIconBox {
      background-color: rgba(255, 255, 255, 0.2);
      border: 1px solid rgba(255, 255, 255, 0.35);
      color: #ffffff;
    }
    #mainHeader #headerMemoryBadge {
      background-color: rgba(255, 255, 255, 0.2);
      color: #ffffff;
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
    #mainHeader #navSignInBtn {
      color: rgba(255, 255, 255, 0.9);
    }
    #mainHeader #navSignInBtn:hover {
      color: #ffffff;
    }
    #mainHeader #navSignUpBtn {
      background-color: #ffffff;
      color: #09090b;
    }

    /* Header Scrolled State (Pure White Background + Crisp Dark Text Theme) */
    #mainHeader.scrolled-light {
      background-color: rgba(255, 255, 255, 0.98) !important;
      color: #09090b !important;
      border-bottom: 1px solid #e4e4e7 !important;
      box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.05) !important;
    }
    #mainHeader.scrolled-light .nav-link {
      color: #52525b !important;
    }
    #mainHeader.scrolled-light .nav-link:hover {
      color: #09090b !important;
    }
    #mainHeader.scrolled-light #brandName {
      color: #09090b !important;
    }
    #mainHeader.scrolled-light #logoEngine {
      color: #71717a !important;
    }
    #mainHeader.scrolled-light #logoIconBox {
      background-color: #f4f4f5 !important;
      border-color: #e4e4e7 !important;
      color: #18181b !important;
    }
    #mainHeader.scrolled-light #headerMemoryBadge {
      background-color: #f4f4f5 !important;
      color: #18181b !important;
      border-color: #e4e4e7 !important;
    }
    #mainHeader.scrolled-light #navSignInBtn {
      color: #52525b !important;
    }
    #mainHeader.scrolled-light #navSignInBtn:hover {
      color: #09090b !important;
    }
    #mainHeader.scrolled-light #navSignUpBtn {
      background-color: #09090b !important;
      color: #ffffff !important;
    }
    #mainHeader.scrolled-light #navSignUpBtn:hover {
      background-color: #27272a !important;
    }

/* Light Blue Jacket Unzip Simulation */
    #jacketCurtain {
      perspective: 1200px;
    }
    .jacket-flap-left {
      background: linear-gradient(135deg, #0284c7 0%, #0ea5e9 40%, #38bdf8 80%, #7dd3fc 100%);
      box-shadow: inset 0 0 100px rgba(2, 132, 199, 0.3);
      transform-origin: left center;
    }
    .jacket-flap-right {
      background: linear-gradient(225deg, #0284c7 0%, #0ea5e9 40%, #38bdf8 80%, #7dd3fc 100%);
      box-shadow: inset 0 0 100px rgba(2, 132, 199, 0.3);
      transform-origin: right center;
    }
    .jacket-baffles {
      background-image: repeating-linear-gradient(
        0deg,
        transparent,
        transparent 78px,
        rgba(255, 255, 255, 0.35) 79px,
        rgba(0, 0, 0, 0.12) 81px
      );
    }
    .zipper-teeth-left {
      background-image: repeating-linear-gradient(
        0deg,
        #f8fafc 0px,
        #f8fafc 4px,
        #334155 4px,
        #334155 8px
      );
    }
    .zipper-teeth-right {
      background-image: repeating-linear-gradient(
        0deg,
        #334155 0px,
        #334155 4px,
        #f8fafc 4px,
        #f8fafc 8px
      );
    }

    /* Horizontal Side-Scroll Smooth Snap Track */
    .no-scrollbar::-webkit-scrollbar {
      display: none;
    }
    .no-scrollbar {
      -ms-overflow-style: none;
      scrollbar-width: none;
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

  <!-- Top-Right Skip Intro Button (Fixed in Corner with Absolute Highest Z-Index) -->
  <button 
    id="skipJacketBtn" 
    onclick="skipJacket(event); this.style.display='none'; var c=document.getElementById('jacketCurtain'); if(c){ c.style.pointerEvents='none'; c.style.opacity='0'; setTimeout(function(){ if(c.parentNode) c.parentNode.removeChild(c); }, 180); }" 
    class="fixed top-5 right-5 z-[9999999] px-4 py-2 rounded-full bg-black hover:bg-neutral-900 text-white text-xs font-num font-semibold shadow-2xl border-2 border-white flex items-center gap-1.5 transition cursor-pointer backdrop-blur-md hover:scale-105 active:scale-95"
    style="cursor: pointer;"
    title="Skip intro animation and access website directly"
  >
    <span>Skip Intro</span>
    <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6"/></svg>
  </button>

  <!-- Custom Inverted Cursor element (Cursor Hijack) -->
  <div id="customCursor" class="custom-cursor"></div>

  <!-- Interactive Light Blue Jacket Unzip Experience -->
  <div id="jacketCurtain" onclick="if(!event.target.closest('#zipperHandle')){ skipJacket(event); }" class="fixed inset-0 z-[99998] flex overflow-hidden select-none transition-opacity duration-500 cursor-pointer">
    <!-- Left Flap of the Jacket -->
    <div id="jacketLeft" class="relative w-1/2 h-full jacket-flap-left shadow-2xl will-change-transform flex flex-col justify-between p-6 sm:p-10 border-r border-[#0284c7]/50">
      <div class="absolute inset-0 pointer-events-none opacity-25 jacket-baffles"></div>
      
      <!-- Left Chest Badge -->
      <div class="relative z-10 flex items-center gap-3 pt-4">
        <div class="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white shadow-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
        </div>
        <div>
          <div class="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1">
            ultrademon
            <span class="font-serif text-xs font-bold italic text-sky-100">engine</span>
          </div>
          <div class="text-[10px] text-white/80 font-num font-semibold">SOVEREIGN EDGE EDITION</div>
        </div>
      </div>

      <!-- Left Teeth -->
      <div class="absolute top-0 right-0 bottom-0 w-2.5 pointer-events-none opacity-90 z-20 zipper-teeth-left"></div>
      
      <!-- Bottom Left Status Tag -->
      <div class="relative z-10 text-white/80 text-[11px] font-num hidden sm:flex items-center gap-2">
        <span class="w-2 h-2 rounded-full bg-white animate-pulse"></span>
        <span>SEALED APPARATUS · HOLD &amp; PULL DOWN TO UNZIP</span>
      </div>
    </div>

    <!-- Right Flap of the Jacket -->
    <div id="jacketRight" class="relative w-1/2 h-full jacket-flap-right shadow-2xl will-change-transform flex flex-col justify-between p-6 sm:p-10 border-l border-[#0284c7]/50">
      <div class="absolute inset-0 pointer-events-none opacity-25 jacket-baffles"></div>

      <!-- Right Shoulder Specs -->
      <div class="relative z-10 flex flex-col items-end pt-4 text-right">
        <span class="font-num text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-white border border-white/30 backdrop-blur-sm shadow-sm">D1 BM25 EDGE</span>
        <span class="text-[10px] text-white/80 font-num mt-1">&lt;15ms SOVEREIGN RECALL</span>
      </div>

      <!-- Right Teeth -->
      <div class="absolute top-0 left-0 bottom-0 w-2.5 pointer-events-none opacity-90 z-20 zipper-teeth-right"></div>

      <!-- Bottom Right Note -->
      <div class="relative z-10 text-right text-white/80 text-[11px] font-num hidden sm:block">
        CLOUDFLARE ANYCAST EDGE · 330+ CITIES
      </div>
    </div>

    <!-- Center Zipper Pull & Slider Component with Large Interactive Hit Area -->
    <div id="zipperHandle" class="absolute left-1/2 -translate-x-1/2 top-14 sm:top-16 z-30 flex flex-col items-center cursor-grab active:cursor-grabbing touch-none select-none will-change-transform">
      <!-- Invisible wide grab zone (240px wide corridor) -->
      <div id="zipperHitZone" class="absolute -inset-x-28 -inset-y-16 z-10 cursor-grab active:cursor-grabbing"></div>

      <!-- Metal Slider Housing -->
      <div class="w-8 h-10 rounded-sm bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-500 shadow-2xl border border-white/70 flex items-center justify-center relative">
        <div class="w-3.5 h-4.5 rounded-xs bg-neutral-800/60 border border-neutral-400"></div>
        <div class="absolute -left-1 top-2.5 w-1 h-5 bg-neutral-400 rounded-l-xs"></div>
        <div class="absolute -right-1 top-2.5 w-1 h-5 bg-neutral-400 rounded-r-xs"></div>
      </div>

      <!-- Slider Pull Tab Hinge -->
      <div class="w-3.5 h-3 bg-neutral-500 rounded-full border border-neutral-300 -mt-1.5 shadow-sm"></div>

      <!-- Heavy Metal Pull Tab -->
      <div class="w-7 h-16 rounded-b-xl bg-gradient-to-b from-neutral-200 via-neutral-300 to-neutral-500 shadow-2xl border border-white/60 flex flex-col items-center justify-between py-2 -mt-1 transition hover:brightness-110">
        <div class="w-3 h-3 rounded-full bg-neutral-700 shadow-inner"></div>
        <div class="text-[9px] font-black tracking-widest text-neutral-800 font-num">UD</div>
        <div class="w-4 h-1 bg-neutral-600/60 rounded-full"></div>
      </div>

      <!-- Floating Unzip Tag with Animated Arrow -->
      <div id="zipperTag" class="mt-4 px-3.5 py-1.5 rounded-full bg-black/90 hover:bg-black backdrop-blur-md text-white text-[11px] font-semibold tracking-wide font-num shadow-2xl flex items-center gap-2 border border-white/30 whitespace-nowrap animate-bounce cursor-pointer">
        <svg class="w-3.5 h-3.5 text-sky-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg>
        <span>HOLD &amp; PULL DOWN OR CLICK TO OPEN</span>
      </div>
      <button onclick="skipJacket(event)" class="mt-2.5 px-3 py-1 rounded-full bg-white/20 hover:bg-white/30 text-[11px] text-white border border-white/40 transition cursor-pointer font-num font-medium backdrop-blur-xs">
        Enter website directly &rarr;
      </button>
    </div>
  </div>

  <!-- Top Minimalist Centered Header -->
  <header id="mainHeader" class="sticky top-0 z-40 backdrop-blur-md">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <!-- Brand Logo with Grey Vector Spark Icon -->
      <a href="/" class="flex items-center gap-2.5 group flex-shrink-0">
        <div id="logoIconBox" class="w-7 h-7 rounded-lg bg-white/20 border border-white/30 flex items-center justify-center text-white transition">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
        <span id="brandName" class="font-extrabold text-base tracking-tight text-white flex items-center gap-1 transition-colors">
          ultrademon
          <span id="logoEngine" class="font-serif text-xs font-bold italic text-white/80">engine</span>
        </span>
      </a>

      <!-- Minimal Essential Nav Links -->
      <nav class="hidden md:flex items-center gap-8 text-xs font-medium">
        <a href="#memory" class="nav-link transition flex items-center gap-1.5">
          <span>Memory</span>
          <span id="headerMemoryBadge" class="font-num text-[9px] bg-white/20 text-white border border-white/40 px-1 py-0.2 rounded font-semibold backdrop-blur-xs">&lt;15ms</span>
        </a>
        <a href="#search" class="nav-link transition">Search</a>
        <a href="#benchmarks" class="nav-link transition">Benchmarks</a>
        <a href="#pricing" class="nav-link transition">Pricing</a>
      </nav>

      <!-- Nav Auth Buttons -->
      <div class="flex items-center gap-2.5 flex-shrink-0">
        <div id="navAuthLoggedOut" class="flex items-center gap-3">
          <a href="/login" id="navSignInBtn" class="px-2.5 py-1.5 text-xs font-medium transition cursor-pointer">
            Sign In
          </a>
          <a href="/signup" id="navSignUpBtn" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-white text-neutral-950 hover:bg-neutral-100 transition shadow-xs cursor-pointer">
            Create Account
          </a>
        </div>
        <div id="navAuthLoggedIn" class="hidden flex items-center gap-2">
          <div class="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200 text-xs font-num text-neutral-700">
            <svg class="w-3 h-3 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            <span id="navUserEmail" class="font-medium truncate max-w-[130px]"></span>
          </div>
          <a href="/app" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-black text-white hover:bg-neutral-800 transition shadow-xs flex items-center gap-1.5 cursor-pointer">
            <span>Workspace</span>
            <svg class="w-3 h-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </a>
          <button onclick="handleSignOut()" class="px-2.5 py-1.5 text-xs text-neutral-500 hover:text-black transition cursor-pointer">
            Sign Out
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Full-Width Hero Section Canvas (Light Blue Background with White Text) -->
  <section id="heroSection" class="relative w-full text-white pt-8 pb-16 overflow-hidden" style="background: linear-gradient(180deg, #38bdf8 0%, #7dd3fc 30%, #bae6fd 60%, #e0f2fe 82%, #f0f9ff 94%, #ffffff 100%);">
    <div id="heroTopSentinel" class="absolute top-0 left-0 w-full h-8 pointer-events-none"></div>
    <!-- Subtle background particles -->
    <div class="absolute inset-0 pointer-events-none opacity-10" style="background-image: radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px); background-size: 24px 24px;"></div>

    <div class="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <div id="overview" class="text-center mb-4">
        <!-- Top Release Pill & Re-Zip Jacket Button -->
        <div class="flex flex-wrap items-center justify-center gap-2.5 mb-6">
          <div class="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-white/40 bg-white/20 backdrop-blur-md text-xs text-white font-num shadow-sm">
            <span class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
            <span>ANNOUNCING ULTRADEMON 2.0</span>
            <span class="text-white/40">/</span>
            <span class="text-white/90 font-sans">SOVEREIGN EDGE PLATFORM</span>
          </div>
          <button onclick="rezipJacket()" class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 hover:bg-white/25 text-white text-xs font-num border border-white/30 transition cursor-pointer backdrop-blur-md shadow-sm" title="Re-seal and zip the jacket again">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/></svg>
            <span>Re-Zip Jacket</span>
          </button>
        </div>

        <!-- Supermemory-inspired editorial hero headline pairing Geist Sans and Michelangelus Serif Italic -->
        <h1 class="text-3xl sm:text-5xl lg:text-6xl tracking-tight text-white mb-6 leading-[1.18] max-w-3xl mx-auto drop-shadow-sm font-sans font-normal">
          ultrademon is building the <span class="font-serif font-bold italic text-white underline decoration-white/70 decoration-2 underline-offset-8">sovereign engine</span> for web search, agent memory, and <span class="font-serif font-bold italic text-white">continual context</span>.
        </h1>

        <p class="text-sm sm:text-base text-white/95 max-w-2xl mx-auto mb-8 font-sans leading-relaxed">
          Engineered on Cloudflare Workers edge nodes with D1 SQLite FTS5. Zero third-party LLM latency, zero cloud markups, and sub-15ms BM25 memory recall for autonomous AI agent fleets.
        </p>

        <!-- Author / Timestamp meta line in white -->
        <div class="flex items-center justify-center gap-3 text-xs text-white/80 font-num mb-8 pb-4 border-b border-white/20 max-w-xl mx-auto">
          <span class="font-semibold text-white">Ansh</span>
          <span>·</span>
          <span>November 2026</span>
          <span>·</span>
          <span>Cloudflare Workers + D1 SQLite FTS5</span>
        </div>

        <!-- Action Row (White buttons on blue background) -->
        <div class="flex flex-wrap items-center justify-center gap-3 mb-12">
          <button onclick="handleProvisionKeyClick()" class="px-5 py-2.5 rounded-xl bg-white text-neutral-950 hover:bg-neutral-100 text-xs font-semibold transition cursor-pointer shadow-lg flex items-center gap-2">
            <span>Get Started Free</span>
            <svg class="w-3.5 h-3.5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </button>
          <a href="/app" class="px-4 py-2.5 rounded-xl border border-white/40 hover:bg-white/15 text-white text-xs font-semibold transition flex items-center gap-2 cursor-pointer backdrop-blur-xs">
            <svg class="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 3v18"/><path d="M14 9l3 3-3 3"/></svg>
            <span>Launch Workspace</span>
          </a>
          <a href="/openapi.json" target="_blank" class="px-4 py-2.5 rounded-xl border border-white/30 hover:bg-white/10 text-white text-xs font-semibold transition flex items-center gap-1.5 backdrop-blur-xs">
            <span class="font-num">/openapi.json</span>
          </a>
          <a href="#benchmarks" class="px-4 py-2.5 text-xs text-white/90 hover:text-white underline decoration-white/40 transition">
            View Latency Benchmark
          </a>
        </div>

        <!-- System Architecture Flow Diagram with Translucent Glass Cards (Card Design Skill) -->
        <div class="p-6 sm:p-8 rounded-3xl mb-12 bg-white/15 backdrop-blur-md border border-white/30 text-white shadow-2xl">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
            <div class="text-[11px] font-semibold uppercase tracking-wider text-white/90 font-num flex items-center gap-2">
              <span class="w-2 h-2 rounded-full bg-emerald-300 animate-pulse"></span>
              <span>System Architecture &amp; Execution Topology</span>
            </div>
            <span class="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 border border-white/30 text-[10px] font-num text-white font-medium">
              CLOUDFLARE ANYCAST EDGE · 330+ CITIES
            </span>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-left">
            <!-- Node 1: AI Agent Fleet -->
            <div class="group relative p-5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:border-white/60 hover:bg-white/25 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between overflow-hidden">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[10px] font-num font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/30">STEP 01</span>
                  <span class="flex items-center gap-1 text-[10px] font-num text-white/80">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse"></span>
                    <span>Client Layer</span>
                  </span>
                </div>
                <div class="w-10 h-10 rounded-xl bg-white/25 border border-white/40 flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="16" height="16" x="4" y="4" rx="2"/><rect width="6" height="6" x="9" y="9" rx="1"/><path d="M15 2v2M15 20v2M2 15h2M2 9h2M20 15h2M20 9h2M9 2v2M9 20v2"/></svg>
                </div>
                <h3 class="text-sm font-normal text-white mb-1">AI Agent Fleet</h3>
                <p class="text-xs text-white/85 leading-relaxed">
                  Claude Desktop, Cursor, Windsurf, LangChain &amp; autonomous agent loops.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] font-num text-white/90">
                <span>Integration</span>
                <span class="font-bold text-white">Zero SDK Bloat</span>
              </div>
            </div>

            <!-- Node 2: Sovereign Gateway -->
            <div class="group relative p-5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:border-white/60 hover:bg-white/25 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between overflow-hidden">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[10px] font-num font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/30">STEP 02</span>
                  <span class="text-[10px] font-num text-white/80">Edge Ingress</span>
                </div>
                <div class="w-10 h-10 rounded-xl bg-white/25 border border-white/40 flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                </div>
                <h3 class="text-sm font-normal text-white mb-1">Sovereign Gateway</h3>
                <p class="text-xs text-white/85 leading-relaxed">
                  Anycast HTTP/3 edge routing with unified REST, MCP SSE streaming, and auth.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] font-num text-white/90">
                <span>Ingress</span>
                <span class="font-bold text-white">&lt;2ms Handshake</span>
              </div>
            </div>

            <!-- Node 3: D1 SQLite FTS5 (Hero Highlight Card) -->
            <div class="group relative p-5 rounded-2xl bg-white text-neutral-950 shadow-2xl border-2 border-white ring-4 ring-white/30 hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between overflow-hidden">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[10px] font-num font-bold tracking-wider px-2 py-0.5 rounded-md bg-neutral-950 text-white">STEP 03 · CORE</span>
                  <span class="flex items-center gap-1 text-[10px] font-num font-bold text-neutral-900">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span>&lt; 15ms</span>
                  </span>
                </div>
                <div class="w-10 h-10 rounded-xl bg-neutral-950 text-white flex items-center justify-center mb-3 group-hover:scale-105 transition-transform shadow-sm">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/><path d="M12 2v20"/><path d="M8 8h8"/><path d="M7 13h10"/><path d="M9 18h6"/></svg>
                </div>
                <h3 class="text-sm font-semibold text-neutral-950 mb-1">D1 SQLite FTS5</h3>
                <p class="text-xs text-neutral-600 leading-relaxed">
                  Compiled C SQLite engine with BM25 ranking across edge PoPs. Zero vector overhead.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] font-num text-neutral-950">
                <span class="text-neutral-500">Retrieval</span>
                <span class="font-bold text-neutral-950 font-num">&lt; 15ms BM25</span>
              </div>
            </div>

            <!-- Node 4: Autonomous Index -->
            <div class="group relative p-5 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 hover:border-white/60 hover:bg-white/25 hover:-translate-y-1 hover:shadow-2xl transition-all duration-200 flex flex-col justify-between overflow-hidden">
              <div>
                <div class="flex items-center justify-between mb-3">
                  <span class="text-[10px] font-num font-bold tracking-wider px-2 py-0.5 rounded-md bg-white/20 text-white border border-white/30">STEP 04</span>
                  <span class="text-[10px] font-num text-white/80">Real-Time</span>
                </div>
                <div class="w-10 h-10 rounded-xl bg-white/25 border border-white/40 flex items-center justify-center text-white mb-3 group-hover:scale-105 transition-transform">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20M2 12h20"/></svg>
                </div>
                <h3 class="text-sm font-normal text-white mb-1">Autonomous Index</h3>
                <p class="text-xs text-white/85 leading-relaxed">
                  Streaming edge crawler indexes HTML in real-time with full BM25 ranking and scoring.
                </p>
              </div>
              <div class="mt-4 pt-3 border-t border-white/20 flex items-center justify-between text-[11px] font-num text-white/90">
                <span>Search P50</span>
                <span class="font-bold text-white">&lt; 40ms Edge</span>
              </div>
            </div>
          </div>
          <div class="text-[11px] text-white/90 text-center mt-5 font-serif font-bold italic">
            Zero third-party APIs. Zero external vector databases. 100% self-contained Cloudflare Anycast edge.
          </div>
        </div>

        <!-- Editorial Prose in white -->
        <div class="space-y-4 text-sm text-white/90 leading-relaxed max-w-3xl mx-auto mb-4 text-left">
          <p>
            Current memory tools like Supermemory, Mem0, and centralized vector databases were designed around single-region cloud servers and heavy embedding pipelines. When an autonomous agent queries memory or web search in an interactive loop, centralized roundtrips cost <strong>350ms to 500ms</strong> per step.
          </p>
          <p>
            <strong>UltraDemon</strong> takes a radically different approach: running both full-text BM25 web search and structured agent memory directly inside <span class="font-semibold text-white">Cloudflare D1 SQLite with FTS5</span> across 330+ edge PoPs worldwide. 
          </p>
          <p class="font-serif font-bold italic text-base text-white pl-4 border-l-2 border-white">
            &ldquo;The result: memory recall drops to under 15ms globally, with zero telemetry leakage and a single unified API key.&rdquo;
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Centered Website Main Container (Transitions back into pure white background with black text) -->
  <main class="w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-20 bg-white text-neutral-950">

      <!-- Three Pillars Section with High-Fidelity Feature Cards (Card Design Skill) -->
      <section class="mb-16 reveal-on-scroll">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Core Capabilities</span>
          <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950 mt-1">
            Engineered Primitives for <span class="font-serif font-bold italic text-black">Autonomous Fleets</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            Three edge pillars purpose-built to replace centralized roundtrips and eliminate third-party AI dependencies.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Pillar 1: Autonomous Web Search -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-neutral-950 group-hover:text-white group-hover:border-neutral-950 transition-all duration-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-700 font-num mb-2.5">
                01 / SOVEREIGN SEARCH
              </span>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">
                Autonomous Web Search
              </h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Native edge crawler with streaming HTMLRewriter extraction and BM25 ranking on D1 SQLite. Sub-40ms P50 latency with zero external search API dependencies.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Throughput: 50 pgs/s</span>
              <a href="#search" class="font-bold text-neutral-900 hover:text-black flex items-center gap-1">
                <span>Explore Search</span>
                <span class="text-neutral-400">&rarr;</span>
              </a>
            </div>
          </div>

          <!-- Pillar 2: UltraMemory API (Featured Pillar) -->
          <div class="group relative bg-white rounded-2xl border-2 border-neutral-950 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-2xl transition-all duration-200 ring-4 ring-neutral-950/5 overflow-hidden">
            <div class="absolute top-4 right-4 px-2 py-0.5 text-[9px] font-bold bg-neutral-950 text-white rounded-full font-num">
              FEATURED
            </div>
            <div>
              <div class="w-12 h-12 rounded-xl bg-neutral-950 text-white flex items-center justify-center mb-5 group-hover:scale-105 transition-transform shadow-sm">
                <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/><path d="M12 2v20"/><path d="M8 8h8"/><path d="M7 13h10"/><path d="M9 18h6"/></svg>
              </div>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-900 font-num mb-2.5">
                02 / PERSISTENT MEMORY
              </span>
              <h3 class="text-base font-semibold tracking-tight text-neutral-950 mb-2">
                UltraMemory API
              </h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Store agent facts, preferences, profiles, and conversational turns. Retrieve needles with BM25 in under 15ms at 330+ Cloudflare edge locations worldwide.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Recall: &lt;15ms Global</span>
              <a href="#memory" class="font-bold text-neutral-900 hover:text-black flex items-center gap-1">
                <span>Try Playground</span>
                <span class="text-neutral-400">&rarr;</span>
              </a>
            </div>
          </div>

          <!-- Pillar 3: File & Context Ingestion -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="w-12 h-12 rounded-xl bg-neutral-100 border border-neutral-200 text-neutral-800 flex items-center justify-center mb-5 group-hover:scale-105 group-hover:bg-neutral-950 group-hover:text-white group-hover:border-neutral-950 transition-all duration-200">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5M3 12A9 3 0 0 0 21 12"/></svg>
              </div>
              <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[10px] font-bold text-neutral-700 font-num mb-2.5">
                03 / CONTEXT INGESTION
              </span>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">
                File &amp; Context Ingestion
              </h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Ingest full text documents, Markdown, and source files with smart recursive chunking and instant full-text indexing for autonomous agent codebases.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Chunking: Universal</span>
              <a href="#build" class="font-bold text-neutral-900 hover:text-black flex items-center gap-1">
                <span>View Blueprints</span>
                <span class="text-neutral-400">&rarr;</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Horizontal Side-Scroll Architecture Showcase -->
      <section id="sidescroll" class="mb-16 pt-8 border-t border-neutral-200 reveal-on-scroll">
        <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-6">
          <div>
            <div class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">The Architecture of UltraSpeed</div>
            <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950 mt-1">
              Edge Capabilities &amp; <span class="font-serif font-bold italic text-black">Execution Flow</span>
            </h2>
            <p class="text-xs text-neutral-600 mt-1">
              Interactive horizontal architecture rail. Slide through our edge-native stack.
            </p>
          </div>
          <!-- Side-scroll next/prev controls -->
          <div class="flex items-center gap-2">
            <button onclick="scrollFeatureTrack(-1)" class="p-2 rounded-lg border border-neutral-300 hover:border-black hover:bg-neutral-100 transition cursor-pointer text-neutral-700 hover:text-black" title="Scroll Left">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/></svg>
            </button>
            <button onclick="scrollFeatureTrack(1)" class="p-2 rounded-lg border border-neutral-300 hover:border-black hover:bg-neutral-100 transition cursor-pointer text-neutral-700 hover:text-black" title="Scroll Right">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        <!-- Horizontal Scroll Track with Elevated Architectural Rail Cards (Card Design Skill) -->
        <div id="featureScrollTrack" class="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-4 snap-x snap-mandatory">
          <!-- Card 1 -->
          <div class="min-w-[300px] sm:min-w-[340px] max-w-[340px] snap-start group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/><path d="M12 2v20"/><path d="M8 8h8"/><path d="M7 13h10"/><path d="M9 18h6"/></svg>
              </div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">01 / RETRIEVAL</span>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">Sub-15ms BM25 Recall</h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Direct SQLite FTS5 indices compiled on 330+ edge PoPs. Zero vector embedder overhead or remote database roundtrips.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Latency P50</span>
              <span class="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-bold text-neutral-950">&lt; 15ms</span>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="min-w-[300px] sm:min-w-[340px] max-w-[340px] snap-start group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
              </div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">02 / INGESTION</span>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">Autonomous Web Crawler</h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Recursive depth crawl directly inside Cloudflare Workers. Cleans HTML, extracts markdown, and indexes pages into FTS5 in real time.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Throughput</span>
              <span class="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-bold text-neutral-950">50 pgs / sec</span>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="min-w-[300px] sm:min-w-[340px] max-w-[340px] snap-start group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>
              </div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">03 / NAMESPACES</span>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">Agent Container Namespaces</h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Isolate memory namespaces dynamically using container_tag parameters. Partition memories by session, workspace, or agent role.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Isolation</span>
              <span class="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-bold text-neutral-950">Zero Leakage</span>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="min-w-[300px] sm:min-w-[340px] max-w-[340px] snap-start group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/></svg>
              </div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">04 / PROTOCOL</span>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">Native MCP Tool Server</h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Plug directly into Claude Desktop, Cursor, and Windsurf via Server-Sent Events (SSE). Grant your coding agents instant persistent recall.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Integration</span>
              <span class="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-bold text-neutral-950">One-Click SSE</span>
            </div>
          </div>

          <!-- Card 5 -->
          <div class="min-w-[300px] sm:min-w-[340px] max-w-[340px] snap-start group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="m21 2-2 2m-1.5 1.5L14 9l-1.5-1.5L11 9l-1-1-1.5 1.5L7 8l-1.5 1.5L4 8a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h2v2h2v2h2l4-4 1.5 1.5 1.5-1.5 1.5 1.5 1.5-1.5 2-2z"/><circle cx="17.5" cy="6.5" r="1.5"/></svg>
              </div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">05 / SECURITY</span>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">Scoped Keys (um_ / us_)</h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Issue scoped tokens restricted to Memory-only or Search-only operations. Protect customer privacy and limit agent blast radius.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Scopes</span>
              <span class="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-bold text-neutral-950">D1 + KV Enforced</span>
            </div>
          </div>

          <!-- Card 6 -->
          <div class="min-w-[300px] sm:min-w-[340px] max-w-[340px] snap-start group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 mb-4 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
              </div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">06 / ECONOMICS</span>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">90% Cost Reduction</h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Cut out embedding API costs and heavy vector database clusters. D1 SQLite edge tables scale automatically with predictable pricing.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Savings</span>
              <span class="px-2 py-0.5 rounded bg-neutral-100 border border-neutral-200 font-bold text-neutral-950">Up to 10x</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Supermemory Latency Benchmark with Minimalist Bars & Tabular Metrics -->
      <section id="benchmarks" class="mb-16 pt-8 border-t border-neutral-200 reveal-on-scroll">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Speed &amp; Latency Benchmark</span>
          <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950 mt-1">
            Our promise: the <span class="font-serif font-bold italic text-black">fastest agent memory</span> ever built.
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            End-to-end retrieval latency measured from global client locations.
          </p>
        </div>

        <!-- Metric Stat Cards Grid (Geist Mono Tabular Figures & High-Contrast Hierarchy) -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6 font-num">
          <!-- Featured Card: UltraMemory Recall -->
          <div class="group relative p-5 rounded-2xl bg-neutral-950 text-white border border-neutral-800 hover:-translate-y-1 hover:shadow-xl transition-all duration-200 flex flex-col justify-between font-num shadow-md overflow-hidden">
            <div>
              <span class="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1.5">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>UltraMemory Recall</span>
              </span>
              <div class="text-3xl sm:text-4xl font-extrabold text-white my-2 tracking-tight">
                &lt; 15<span class="text-sm font-sans font-normal text-neutral-400">ms</span>
              </div>
            </div>
            <div class="text-[11px] text-neutral-300 font-sans flex items-center justify-between border-t border-neutral-800 pt-2.5 mt-2">
              <span>Edge D1 FTS5</span>
              <span class="text-emerald-400 font-bold font-num text-[10px] uppercase px-1.5 py-0.2 rounded bg-emerald-950/60 border border-emerald-800/80">25x Faster</span>
            </div>
          </div>

          <!-- Comparison Card: Supermemory Cloud -->
          <div class="group relative p-5 rounded-2xl bg-white border border-neutral-200 hover:-translate-y-1 hover:shadow-md hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between font-num overflow-hidden">
            <div>
              <span class="text-[10px] uppercase font-bold text-neutral-400">Supermemory (Cloud)</span>
              <div class="text-3xl sm:text-4xl font-extrabold text-neutral-400 my-2 tracking-tight">
                380<span class="text-sm font-sans font-normal text-neutral-400">ms</span>
              </div>
            </div>
            <div class="text-[11px] text-neutral-400 font-sans border-t border-neutral-100 pt-2.5 mt-2">
              Centralized Vector DB
            </div>
          </div>

          <!-- Network Card: Edge Availability -->
          <div class="group relative p-5 rounded-2xl bg-white border border-neutral-200 hover:-translate-y-1 hover:shadow-md hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between font-num overflow-hidden">
            <div>
              <span class="text-[10px] uppercase font-bold text-neutral-500">Edge Coverage</span>
              <div class="text-3xl sm:text-4xl font-extrabold text-neutral-950 my-2 tracking-tight">
                330+
              </div>
            </div>
            <div class="text-[11px] text-neutral-500 font-sans border-t border-neutral-100 pt-2.5 mt-2">
              Global Anycast PoP Cities
            </div>
          </div>

          <!-- Cache Card: Hot Cache Retrieval -->
          <div class="group relative p-5 rounded-2xl bg-white border border-neutral-200 hover:-translate-y-1 hover:shadow-md hover:border-neutral-300 transition-all duration-200 flex flex-col justify-between font-num overflow-hidden">
            <div>
              <span class="text-[10px] uppercase font-bold text-neutral-500">Hot KV Cache</span>
              <div class="text-3xl sm:text-4xl font-extrabold text-neutral-950 my-2 tracking-tight">
                &lt; 5<span class="text-sm font-sans font-normal text-neutral-500">ms</span>
              </div>
            </div>
            <div class="text-[11px] text-neutral-500 font-sans border-t border-neutral-100 pt-2.5 mt-2">
              Cloudflare Distributed KV
            </div>
          </div>
        </div>

        <!-- Latency Bar Visualizer -->
        <div class="card-clean p-6 sm:p-7 rounded-2xl space-y-4 font-num text-xs bg-neutral-50/70 border border-neutral-200 hover:shadow-md transition-shadow">
          <div>
            <div class="flex justify-between font-bold text-neutral-950 mb-1.5">
              <span class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-neutral-800" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                <span>UltraMemory (D1 Edge FTS5)</span>
              </span>
              <span class="text-neutral-950 font-bold">14ms</span>
            </div>
            <div class="w-full h-3 bg-neutral-200 rounded-full overflow-hidden p-0.5">
              <div class="h-full bg-neutral-950 rounded-full" style="width: 4%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-neutral-600 mb-1.5">
              <span>Supermemory (Centralized Vector DB)</span>
              <span>380ms</span>
            </div>
            <div class="w-full h-2.5 bg-neutral-200 rounded-full overflow-hidden">
              <div class="h-full bg-neutral-400 rounded-full" style="width: 79%"></div>
            </div>
          </div>
          <div>
            <div class="flex justify-between text-neutral-600 mb-1.5">
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
      <section id="memory" class="mb-16 pt-8 border-t border-neutral-200 reveal-on-scroll">
        <div class="mb-6">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-neutral-800 font-num mb-2">
            API #1 · ULTRAMEMORY
          </div>
          <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950">
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
      <section id="search" class="mb-16 pt-8 border-t border-neutral-200 reveal-on-scroll">
        <div class="mb-6">
          <div class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-neutral-100 text-[10px] font-bold text-neutral-800 font-num mb-2">
            API #2 · ULTRASEARCH
          </div>
          <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950">
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

      <!-- Architectural Use Cases Section -->
      <section id="usecases" class="mb-16 pt-8 border-t border-neutral-200 reveal-on-scroll">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Architectural Pillars</span>
          <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950 mt-1">
            Engineered for <span class="font-serif font-bold italic text-black">Autonomous AI</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            Designed from day one to replace slow external vector databases and 3rd-party search APIs with zero-latency edge primitives.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Card 1 -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 2a4 4 0 0 0-4 4v1a4 4 0 0 0-3 3.87A4 4 0 0 0 4 14a4 4 0 0 0 2 3.46V18a4 4 0 0 0 4 4h4a4 4 0 0 0 4-4v-.54A4 4 0 0 0 20 14a4 4 0 0 0-1-3.13A4 4 0 0 0 16 7V6a4 4 0 0 0-4-4z"/></svg>
                </div>
                <span class="font-num text-[10px] text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 font-bold">&lt;15ms Recall</span>
              </div>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">Continual Learning &amp; Agent Memory</h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Prevent context window overflow and quadratic attention costs. Store user preferences, past tool results, and episodic dialogue state directly in edge SQLite FTS5 for sub-15ms recall.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Replaces: Pinecone, Weaviate, Supermemory</span>
              <svg class="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Card 2 -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="11" cy="11" r="8"/><path stroke-linecap="round" stroke-linejoin="round" d="m21 21-4.3-4.3"/></svg>
                </div>
                <span class="font-num text-[10px] text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 font-bold">Zero 3rd-Party Leaks</span>
              </div>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">Sovereign Web Grounding &amp; RAG</h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Ground LLM generations in verifiable, live-crawled web data. Never send proprietary user queries to external search brokers. Full PageRank and BM25 pass scoring on your terms.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Replaces: Tavily, Exa, Google Search API</span>
              <svg class="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Card 3 -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 9.4 7.55 4.24a1.78 1.78 0 0 0-2.5 1.55v12.42a1.78 1.78 0 0 0 2.5 1.55L16.5 14.6a1.78 1.78 0 0 0 0-3.2z"/><path stroke-linecap="round" stroke-linejoin="round" d="M21 12H17"/></svg>
                </div>
                <span class="font-num text-[10px] text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 font-bold">Real-Time Fluidity</span>
              </div>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">Low-Latency Voice &amp; Chat Assistants</h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Voice agents (ElevenLabs, LiveKit, Gemini Live) demand sub-100ms total conversational loops. UltraMemory’s 12ms edge recall guarantees zero dead air or voice hesitation.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Optimal for: ElevenLabs, LiveKit, Gemini Live</span>
              <svg class="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>

          <!-- Card 4 -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-400 transition-all duration-200 overflow-hidden">
            <div>
              <div class="flex items-center justify-between mb-4">
                <div class="w-11 h-11 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-800 group-hover:scale-105 group-hover:bg-neutral-900 group-hover:text-white transition-all">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>
                </div>
                <span class="font-num text-[10px] text-neutral-900 bg-neutral-100 px-2.5 py-0.5 rounded-full border border-neutral-200 font-bold">Namespaces</span>
              </div>
              <h3 class="text-base font-normal tracking-tight text-neutral-950 mb-2 group-hover:text-black">Multi-Tenant Knowledge Containers</h3>
              <p class="text-xs text-neutral-600 leading-relaxed mb-6">
                Partition memories securely by user ID, workspace ID, or agent role using <code class="bg-neutral-100 px-1 py-0.5 rounded font-num text-[11px]">container_tag</code>. Full multi-tenant isolation without provisioning separate databases.
              </p>
            </div>
            <div class="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between text-xs font-num">
              <span class="text-neutral-500 font-medium">Architecture: D1 Multi-Tenant Isolation</span>
              <svg class="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </div>
          </div>
        </div>
      </section>

      <!-- What People Can Build Section -->
      <section id="build" class="mb-16 pt-8 border-t border-neutral-200 reveal-on-scroll">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Production Blueprints</span>
          <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950 mt-1">
            What You Can <span class="font-serif font-bold italic text-black">Build Today</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            End-to-end architectures, workflows, and code snippets ready to deploy into production.
          </p>
        </div>

        <div class="card-clean p-5 sm:p-6 rounded-2xl space-y-6">
          <!-- Build Showcase Selector Tabs -->
          <div class="flex flex-wrap gap-2 border-b border-neutral-200 pb-3">
            <button onclick="switchBuildTab('buildFinance')" id="btnBuildFinance" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-black text-white cursor-pointer transition">Financial Analyst</button>
            <button onclick="switchBuildTab('buildCode')" id="btnBuildCode" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">Eternal Coding Copilot</button>
            <button onclick="switchBuildTab('buildSupport')" id="btnBuildSupport" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">Omnichannel CRM</button>
            <button onclick="switchBuildTab('buildResearch')" id="btnBuildResearch" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">Deep Research Bot</button>
          </div>

          <!-- Showcase 1: Financial Filing Analyst -->
          <div id="buildFinance" class="space-y-4">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-normal text-neutral-950">Autonomous SEC &amp; Earnings Intelligence Agent</h3>
                <p class="text-xs text-neutral-600">Continuously indexes SEC 10-K filings and earnings call transcripts into D1; answers complex margin trend queries in &lt;30ms.</p>
              </div>
              <span class="self-start sm:self-auto font-num text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-200 px-2 py-0.5 rounded font-semibold">Crawl + Memory + Search</span>
            </div>

            <!-- Architecture Flow Pill -->
            <div class="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-num flex flex-wrap items-center gap-2 text-neutral-700">
              <span class="font-bold text-black">Workflow:</span>
              <span>1. Crawler ingests SEC 10-K HTML</span>
              <span>→</span>
              <span>2. UltraSearch parses &amp; indexes text</span>
              <span>→</span>
              <span>3. Agent stores key valuation metrics in UltraMemory</span>
              <span>→</span>
              <span>4. Sub-15ms retrieval on user prompts</span>
            </div>

            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">import requests

BASE = "${origin}"
HEADERS = {"X-API-Key": "us_your_key_here", "Content-Type": "application/json"}

# 1. Dispatch edge crawler to ingest latest financial filing
requests.post(f"{BASE}/v1/crawl", headers=HEADERS, json={
    "url": "https://www.sec.gov/edgar/searchedgar/companysearch",
    "depth": 1
})

# 2. Store extracted quarterly guidance into structured agent memory
requests.post(f"{BASE}/v1/memory", headers=HEADERS, json={
    "container_tag": "ticker_nvda",
    "memory_type": "fact",
    "title": "Q3 FY2026 Data Center Revenue Guidance",
    "content": "Data center revenue exceeded \\$30.8B, up 112% YoY. Gross margins guided at 75.0% for Q4.",
    "metadata": {"ticker": "NVDA", "quarter": "Q3-26", "analyst_consensus": "beat"}
})

# 3. Fast recall in your agent prompt (&lt;15ms)
memory = requests.post(f"{BASE}/v1/memory/query", headers=HEADERS, json={
    "query": "gross margin guidance data center",
    "container_tag": "ticker_nvda"
}).json()

print("Recalled Evidence:", memory["results"][0]["snippet"])</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <!-- Showcase 2: Eternal Coding Copilot -->
          <div id="buildCode" class="space-y-4 hidden">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-normal text-neutral-950">Sovereign Code Copilot with Eternal Repo Memory</h3>
                <p class="text-xs text-neutral-600">Indexes architectural decisions, PR review discussions, and team conventions so coding agents never repeat past mistakes.</p>
              </div>
              <span class="self-start sm:self-auto font-num text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-200 px-2 py-0.5 rounded font-semibold">GitHub Hook + D1 FTS5</span>
            </div>

            <div class="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-xs font-num flex flex-wrap items-center gap-2 text-neutral-700">
              <span class="font-bold text-black">Workflow:</span>
              <span>1. GitHub Action sends merged PR diff</span>
              <span>→</span>
              <span>2. UltraMemory stores architectural rule</span>
              <span>→</span>
              <span>3. Cursor/Windsurf queries memory on save</span>
              <span>→</span>
              <span>4. Copilot suggests rule-compliant diff</span>
            </div>

            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">// TypeScript / LangGraph Coding Agent Hook
import { tool } from "ai";
import { z } from "zod";

const recallRepoRule = tool({
  description: "Recall team conventions and architectural decisions for this repo",
  parameters: z.object({ query: z.string() }),
  execute: async ({ query }) => {
    const res = await fetch("${origin}/v1/memory/query", {
      method: "POST",
      headers: {
        "X-API-Key": process.env.ULTRASEARCH_API_KEY!,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ query, container_tag: "monorepo-core", limit: 3 })
    });
    return await res.json();
  }
});</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <!-- Showcase 3: Omnichannel Customer CRM -->
          <div id="buildSupport" class="space-y-4 hidden">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-normal text-neutral-950">Omnichannel Customer Support &amp; Context Memory</h3>
                <p class="text-xs text-neutral-600">Preserves customer interaction context across Zendesk, Discord, and Live Chat. Agents recall preferences in &lt;15ms.</p>
              </div>
              <span class="self-start sm:self-auto font-num text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-200 px-2 py-0.5 rounded font-semibold">Vercel AI SDK + UltraMemory</span>
            </div>

            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">import { generateText } from "ai";
import { openai } from "@ai-sdk/openai";

// 1. Recall customer profile &amp; past order issues
const customerMemories = await fetch("${origin}/v1/memory/query", {
  method: "POST",
  headers: { "X-API-Key": process.env.ULTRASEARCH_API_KEY!, "Content-Type": "application/json" },
  body: JSON.stringify({
    query: "refund preference shipping address",
    container_tag: "customer_usr_98124"
  })
}).then(r => r.json());

// 2. Generate grounded response with customer context
const { text } = await generateText({
  model: openai("gpt-4o"),
  system: "You are an empathetic support agent with access to user memory.",
  prompt: "User context: " + JSON.stringify(customerMemories.results) + "\\n\\nUser Question: Can I expedite my delivery?"
});</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <!-- Showcase 4: Deep Research Bot -->
          <div id="buildResearch" class="space-y-4 hidden">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 class="text-sm font-normal text-neutral-950">Autonomous Multi-Angle Deep Research Bot</h3>
                <p class="text-xs text-neutral-600">Takes a research query, queries the sovereign index in Mode 3 (Deep Research), extracts citations, and synthesizes an authoritative report.</p>
              </div>
              <span class="self-start sm:self-auto font-num text-[10px] bg-neutral-100 text-neutral-800 border border-neutral-200 px-2 py-0.5 rounded font-semibold">UltraSearch Mode 3 + Citations</span>
            </div>

            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll"># Multi-Hop Autonomous Research in Python
import requests

query = "State-of-the-art speculative decoding in Edge LLM inference"

# Mode 3 executes multi-hop sub-query generation and passage ranking
res = requests.post(
    "${origin}/v1/search",
    headers={"X-API-Key": "us_your_key_here", "Content-Type": "application/json"},
    json={"query": query, "mode": 3, "num_results": 10}
).json()

print(f"Synthesized research sources ({len(res['results'])} citations):")
for r in res["results"]:
    print(f"- [{r['title']}]({r['url']}) (Score: {r['pagerank']})")
    print(f"  Snippet: {r['snippet']}\\n")</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Developer Console & API Key Manager -->
      <section id="console" class="mb-16 pt-8 border-t border-neutral-200 reveal-on-scroll">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Unified Developer Platform</span>
          <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950 mt-1">
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
            <h3 class="text-xs font-normal text-neutral-950 mb-3 flex items-center gap-1.5">
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
                <label class="block text-[11px] font-medium text-neutral-600 mb-1">API Function / Scope</label>
                <select id="newKeyType" class="w-full px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-neutral-950 text-xs font-num focus:outline-none focus:bg-white focus:border-black transition">
                  <option value="memory" selected>UltraMemory API (um_*)</option>
                  <option value="unified">Unified API (Search + Memory)</option>
                  <option value="search">UltraSearch API (Search Only)</option>
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
                      <th class="pb-1.5">Scope</th>
                      <th class="pb-1.5">Plan</th>
                      <th class="pb-1.5">Label</th>
                      <th class="pb-1.5 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody id="keysTableBody" class="divide-y divide-neutral-100 font-num">
                    <tr>
                      <td colspan="5" class="py-3 text-center text-neutral-400">Sign in to view your keys.</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Crawler Section with Grey SVGs -->
      <section id="crawler" class="mb-16 pt-8 border-t border-neutral-200 reveal-on-scroll">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Autonomous Ingestion</span>
          <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950 mt-1">
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

      <!-- Integrations & Multi-Framework SDKs -->
      <section id="integrations" class="mb-16 pt-8 border-t border-neutral-200 reveal-on-scroll">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Ecosystem</span>
          <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950 mt-1">
            Universal Integrations &amp; <span class="font-serif font-bold italic text-black">SDKs</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            Drop-in tools for Vercel AI SDK, Claude Desktop, Cursor, LangChain, LlamaIndex, Python, and TypeScript.
          </p>
        </div>

        <div class="card-clean p-5 rounded-2xl">
          <div class="flex flex-wrap gap-1.5 border-b border-neutral-200 pb-3 mb-4">
            <button onclick="switchTab('tabClaude')" id="btnTabClaude" class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-black text-white cursor-pointer transition">Claude Desktop</button>
            <button onclick="switchTab('tabCursor')" id="btnTabCursor" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">Cursor / Windsurf</button>
            <button onclick="switchTab('tabVercel')" id="btnTabVercel" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">Vercel AI SDK</button>
            <button onclick="switchTab('tabLangchain')" id="btnTabLangchain" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">LangChain</button>
            <button onclick="switchTab('tabLlama')" id="btnTabLlama" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">LlamaIndex</button>
            <button onclick="switchTab('tabPython')" id="btnTabPython" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">Python</button>
            <button onclick="switchTab('tabNode')" id="btnTabNode" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">TypeScript</button>
            <button onclick="switchTab('tabCurl')" id="btnTabCurl" class="px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition">cURL</button>
          </div>

          <!-- Claude Desktop MCP -->
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
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <!-- Cursor & Windsurf -->
          <div id="tabCursor" class="space-y-2 hidden">
            <p class="text-xs text-neutral-600">Add to <code class="text-neutral-900 font-num bg-neutral-100 px-1 py-0.5 rounded">.cursor/mcp.json</code> or Windsurf MCP Settings:</p>
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
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <!-- Vercel AI SDK -->
          <div id="tabVercel" class="space-y-2 hidden">
            <p class="text-xs text-neutral-600">Native tools for <code class="text-neutral-900 font-num bg-neutral-100 px-1 py-0.5 rounded">ai</code> npm package:</p>
            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">import { tool } from "ai";
import { z } from "zod";

const HEADERS = {
  "X-API-Key": process.env.ULTRASEARCH_API_KEY!,
  "Content-Type": "application/json"
};

// 1. Search Tool
export const searchWeb = tool({
  description: "Search the sovereign edge index with BM25 scoring",
  parameters: z.object({ query: z.string(), num_results: z.number().default(5) }),
  execute: async ({ query, num_results }) => {
    return await fetch("${origin}/v1/search", {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ query, num_results })
    }).then(r => r.json());
  }
});

// 2. Memory Recall Tool (&lt;15ms)
export const recallMemory = tool({
  description: "Recall structured agent memories in &lt;15ms",
  parameters: z.object({ query: z.string(), container_tag: z.string().default("default") }),
  execute: async ({ query, container_tag }) => {
    return await fetch("${origin}/v1/memory/query", {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify({ query, container_tag })
    }).then(r => r.json());
  }
});</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <!-- LangChain -->
          <div id="tabLangchain" class="space-y-2 hidden">
            <p class="text-xs text-neutral-600">Python LangChain / LangGraph Tools:</p>
            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">from langchain.tools import tool
import requests

HEADERS = {"X-API-Key": "us_your_key_here", "Content-Type": "application/json"}

@tool
def recall_memory(query: str, container_tag: str = "default") -> str:
    """Recall structured long-term agent memories in sub-15ms."""
    res = requests.post("${origin}/v1/memory/query", headers=HEADERS, json={
        "query": query, "container_tag": container_tag, "limit": 5
    }).json()
    return "\n".join([f"- {r['snippet']}" for r in res.get("results", [])])

@tool
def sovereign_search(query: str) -> str:
    """Search the autonomous edge web index."""
    res = requests.post("${origin}/v1/search", headers=HEADERS, json={
        "query": query, "num_results": 5, "mode": 1
    }).json()
    return "\n".join([f"[{r['title']}]({r['url']}): {r['snippet']}" for r in res.get("results", [])])</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <!-- LlamaIndex -->
          <div id="tabLlama" class="space-y-2 hidden">
            <p class="text-xs text-neutral-600">Custom LlamaIndex Retriever:</p>
            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll">from llama_index.core.schema import NodeWithScore, TextNode
import requests

class UltraDemonRetriever:
    def __init__(self, api_key: str):
        self.headers = {"X-API-Key": api_key, "Content-Type": "application/json"}

    def retrieve(self, query: str, container_tag: str = "default"):
        res = requests.post("${origin}/v1/memory/query", headers=self.headers, json={
            "query": query, "container_tag": container_tag, "limit": 5
        }).json()
        return [
            NodeWithScore(node=TextNode(text=r["content"]), score=r.get("bm25_score", 1.0))
            for r in res.get("results", [])
        ]</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <!-- Python -->
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
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <!-- TypeScript -->
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
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>

          <!-- cURL -->
          <div id="tabCurl" class="space-y-2 hidden">
            <div class="relative">
              <pre class="p-3 bg-neutral-950 border border-neutral-800 rounded-xl font-mono text-xs text-neutral-100 overflow-x-auto code-scroll"># 1. Store memory from agent (instant D1 FTS5 ingest)
curl -X POST "${origin}/v1/memory" \\
  -H "Content-Type: application/json" \\
  -H "X-API-Key: um_your_key_here" \\
  -d '{"content": "Agent context & user preference", "container_tag": "agent_1"}'

# 2. Ultrafast recall (&lt;15ms BM25 via GET)
curl "${origin}/v1/memory/recall?q=preference&container_tag=agent_1" \\
  -H "X-API-Key: um_your_key_here"

# 3. Direct LLM prompt context injection
curl "${origin}/v1/memory/context?q=preference" \\
  -H "X-API-Key: um_your_key_here"</pre>
              <button onclick="copyToClipboard(this.previousElementSibling.innerText, this)" class="absolute top-2.5 right-2.5 text-[10px] bg-white/10 hover:bg-white/20 text-white px-2 py-0.5 rounded cursor-pointer">Copy</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Pricing Plans with Minimalist Checkmarks -->
      <section id="pricing" class="mb-16 pt-8 border-t border-neutral-200 reveal-on-scroll">
        <div class="mb-6">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-neutral-500 font-num">Predictable Pricing</span>
          <h2 class="text-2xl sm:text-3xl font-normal tracking-tight text-neutral-950 mt-1">
            Sovereign Access for <span class="font-serif font-bold italic text-black">Every Scale</span>
          </h2>
          <p class="text-xs text-neutral-600 mt-1">
            Zero vendor markups. All plans include both UltraSearch and UltraMemory.
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch pt-5">
          <!-- Free Tier Card -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300 transition-all duration-200">
            <div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">DEVELOPER HOBBY</span>
              <h3 class="text-base font-normal text-neutral-950">Free</h3>
              <div class="text-3xl font-extrabold font-num text-neutral-950 my-3">
                $0<span class="text-xs text-neutral-400 font-sans font-normal"> / mo</span>
              </div>
              <ul class="text-xs text-neutral-600 space-y-2.5 mb-6">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span><strong class="font-num font-semibold text-neutral-900">100</strong> requests / day</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>UltraMemory Recall (&lt;15ms)</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>UltraSearch Mode 1 Instant</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>KV Distributed Hot Cache</span>
                </li>
              </ul>
            </div>
            <button onclick="handleProvisionKeyClick('free')" class="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 transition cursor-pointer">
              Get Free Key
            </button>
          </div>

          <!-- Pro Tier Card (Featured Product Card) -->
          <div class="group relative bg-white rounded-2xl border-2 border-neutral-950 p-6 sm:p-7 flex flex-col justify-between shadow-xl hover:-translate-y-2 hover:shadow-2xl transition-all duration-200 ring-4 ring-neutral-950/5">
            <div class="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20 px-4 py-1 text-[10px] font-bold bg-neutral-950 text-white rounded-full font-num uppercase tracking-wider shadow-lg flex items-center gap-1.5 whitespace-nowrap border border-neutral-800">
              <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>MOST POPULAR</span>
            </div>
            <div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-900 uppercase tracking-wider mb-2">AUTONOMOUS PRODUCTION</span>
              <h3 class="text-base font-semibold text-neutral-950">Pro</h3>
              <div class="text-3xl font-extrabold font-num text-neutral-950 my-3">
                $29<span class="text-xs text-neutral-400 font-sans font-normal"> / mo</span>
              </div>
              <ul class="text-xs text-neutral-700 space-y-2.5 mb-6">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-950 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span><strong class="font-num font-bold text-neutral-950">10,000</strong> requests / day</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-950 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>UltraMemory File Storage &amp; Ingestion</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-950 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>UltraSearch Mode 2 Standard</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-950 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Full Edge Crawler Access</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-950 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Unified MCP Server (Claude/Cursor SSE)</span>
                </li>
              </ul>
            </div>
            <button onclick="handleProvisionKeyClick('pro')" class="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white transition shadow-md cursor-pointer flex items-center justify-center gap-2">
              <span>Choose Pro</span>
              <svg class="w-3.5 h-3.5 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>

          <!-- Ultra Tier Card -->
          <div class="group relative bg-white rounded-2xl border border-neutral-200 p-6 sm:p-7 flex flex-col justify-between hover:-translate-y-1.5 hover:shadow-xl hover:border-neutral-300 transition-all duration-200">
            <div>
              <span class="inline-block text-[10px] font-num font-bold text-neutral-500 uppercase tracking-wider mb-2">SCALE &amp; MULTI-TENANT</span>
              <h3 class="text-base font-normal text-neutral-950">Ultra</h3>
              <div class="text-3xl font-extrabold font-num text-neutral-950 my-3">
                $99<span class="text-xs text-neutral-400 font-sans font-normal"> / mo</span>
              </div>
              <ul class="text-xs text-neutral-600 space-y-2.5 mb-6">
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span><strong class="font-num font-semibold text-neutral-900">100,000</strong> requests / day</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Multi-Agent Container Namespaces</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>UltraSearch Mode 3 Deep Research</span>
                </li>
                <li class="flex items-center gap-2">
                  <svg class="w-4 h-4 text-neutral-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Priority Cloudflare Edge Execution</span>
                </li>
              </ul>
            </div>
            <button onclick="handleProvisionKeyClick('ultra')" class="w-full py-2.5 text-center text-xs font-semibold rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 transition cursor-pointer">
              Choose Ultra
            </button>
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
          <h3 id="authModalTitle" class="text-base font-normal text-neutral-950">
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

    function scrollToConsole() {
      document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
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

    function getAuthToken() {
      const edge = localStorage.getItem('ultrademon_auth_session');
      if (edge) {
        try {
          const parsed = JSON.parse(edge);
          if (parsed && parsed.access_token) return parsed.access_token;
        } catch {}
      }
      return null;
    }

    async function handleAuthSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      const alertBox = document.getElementById('authAlert');
      const spinner = document.getElementById('authSpinner');
      const submitBtn = document.getElementById('authSubmitBtn');

      spinner.classList.remove('hidden');
      submitBtn.disabled = true;
      alertBox.classList.add('hidden');

      try {
        if (currentAuthMode === 'signup') {
          // Instant Edge Account Creation (Bypasses email confirmation delays)
          const res = await fetch('/v1/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.error || 'Failed to create account');
          }

          localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session));
          localStorage.setItem('ultrademon_user', JSON.stringify(data.user));

          alertBox.className = 'p-2.5 rounded-lg text-[11px] font-medium bg-neutral-100 border border-neutral-300 text-neutral-900';
          alertBox.innerText = 'Account created successfully! You are now logged in.';
          alertBox.classList.remove('hidden');

          updateAuthUI(data.user);

          setTimeout(() => {
            closeAuthModal();
            document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
          }, 600);
        } else {
          // Sign In
          const res = await fetch('/v1/auth/signin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
          });
          const data = await res.json();
          if (!res.ok) {
            // Fallback to Supabase if available
            if (supabase) {
              const sb = await supabase.auth.signInWithPassword({ email, password });
              if (sb.error) throw new Error(data.error || sb.error.message);
              updateAuthUI(sb.data.user);
              data = { user: sb.data.user, session: sb.data.session };
            } else {
              throw new Error(data.error || 'Invalid credentials');
            }
          } else {
            localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session));
            localStorage.setItem('ultrademon_user', JSON.stringify(data.user));
            updateAuthUI(data.user);
          }

          alertBox.className = 'p-2.5 rounded-lg text-[11px] font-medium bg-neutral-100 border border-neutral-300 text-neutral-900';
          alertBox.innerText = 'Signed in successfully!';
          alertBox.classList.remove('hidden');

          setTimeout(() => {
            closeAuthModal();
            document.getElementById('console')?.scrollIntoView({ behavior: 'smooth' });
          }, 500);
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
      const token = getAuthToken();
      if (token) {
        fetch('/v1/auth/signout', {
          method: 'POST',
          headers: { 'Authorization': 'Bearer ' + token }
        }).catch(() => {});
      }
      if (supabase) {
        try { await supabase.auth.signOut(); } catch {}
      }
      localStorage.removeItem('ultrademon_auth_session');
      localStorage.removeItem('ultrademon_user');
      localStorage.removeItem(STORAGE_KEY);
      updateAuthUI(null);
    }

    function handleProvisionKeyClick(plan) {
      const userStr = localStorage.getItem('ultrademon_user');
      const token = getAuthToken();
      if (currentUser || userStr || token) {
        window.location.href = '/app' + (plan ? '?plan=' + encodeURIComponent(plan) : '');
      } else {
        window.location.href = '/signup' + (plan ? '?plan=' + encodeURIComponent(plan) : '');
      }
    }

    function scrollFeatureTrack(direction) {
      const track = document.getElementById('featureScrollTrack');
      if (track) {
        const card = track.querySelector('div');
        const scrollAmount = card ? (card.offsetWidth + 16) : 340;
        track.scrollBy({ left: direction * scrollAmount, behavior: 'smooth' });
      }
    }

    function updateAuthUI(user) {
      currentUser = user;
      const navLoggedOut = document.getElementById('navAuthLoggedOut');
      const navLoggedIn = document.getElementById('navAuthLoggedIn');
      const navEmail = document.getElementById('navUserEmail');
      const banner = document.getElementById('authPromptBanner');
      const createKeyLocked = document.getElementById('createKeyLocked');
      const createKeyForm = document.getElementById('createKeyForm');
      const userAccountDisplay = document.getElementById('keyUserAccountDisplay');

      if (user) {
        if (navLoggedOut) navLoggedOut.classList.add('hidden');
        if (navLoggedIn) navLoggedIn.classList.remove('hidden');
        if (navEmail) navEmail.innerText = user.email || user.id;

        if (createKeyLocked) createKeyLocked.classList.add('hidden');
        if (createKeyForm) createKeyForm.classList.remove('hidden');
        if (userAccountDisplay) userAccountDisplay.innerText = user.email || user.id;

        if (banner) {
          banner.innerHTML = '<div class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><div class="text-xs"><span class="font-bold text-neutral-950">Signed in:</span> <span class="text-neutral-600">' + (user.email || user.id) + '</span></div></div><div class="flex items-center gap-2"><a href="/app" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-black text-white hover:bg-neutral-800 transition cursor-pointer flex items-center gap-1.5 shadow-xs"><span>Open Developer Workspace</span><svg class="w-3 h-3 text-neutral-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg></a><button onclick="handleSignOut()" class="px-3 py-1.5 text-xs border border-neutral-300 rounded-lg hover:bg-neutral-100 cursor-pointer">Sign Out</button></div>';
        }

        loadRemoteKeys(user.id);
        refreshStoredMemories();
      } else {
        if (navLoggedOut) navLoggedOut.classList.remove('hidden');
        if (navLoggedIn) navLoggedIn.classList.add('hidden');

        if (createKeyLocked) createKeyLocked.classList.remove('hidden');
        if (createKeyForm) createKeyForm.classList.add('hidden');

        if (banner) {
          banner.innerHTML = '<div class="flex items-center gap-2"><svg class="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4"/></svg><div class="text-xs"><span class="font-bold text-neutral-950">Authentication Required:</span> <span class="text-neutral-600">Sign in or create an account to generate and manage keys.</span></div></div><div class="flex items-center gap-2"><a href="/login" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-black text-white hover:bg-neutral-800 cursor-pointer">Sign In</a><a href="/signup" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg border border-neutral-300 hover:bg-neutral-100 cursor-pointer">Create Account</a></div>';
        }

        renderKeysTable();
        refreshUsage();
        renderMemoriesTable([]);
      }
    }

    async function loadRemoteKeys(userId) {
      try {
        let authHeader = '';
        const token = getAuthToken();
        if (token) {
          authHeader = 'Bearer ' + token;
        } else if (supabase) {
          const session = (await supabase.auth.getSession())?.data?.session;
          if (session) authHeader = 'Bearer ' + session.access_token;
        }
        if (!authHeader) return;

        const resp = await fetch('/v1/keys', {
          headers: { 'Authorization': authHeader }
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
      ['tabClaude', 'tabCursor', 'tabVercel', 'tabLangchain', 'tabLlama', 'tabPython', 'tabNode', 'tabCurl'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', id !== tabId);
      });
      ['btnTabClaude', 'btnTabCursor', 'btnTabVercel', 'btnTabLangchain', 'btnTabLlama', 'btnTabPython', 'btnTabNode', 'btnTabCurl'].forEach(id => {
        const isActive = id === 'btn' + tabId.charAt(0).toUpperCase() + tabId.slice(1);
        const btn = document.getElementById(id);
        if (btn) {
          btn.className = isActive 
            ? 'px-3 py-1.5 text-xs font-semibold rounded-lg bg-black text-white cursor-pointer transition'
            : 'px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition';
        }
      });
    }

    function switchBuildTab(tabId) {
      ['buildFinance', 'buildCode', 'buildSupport', 'buildResearch'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.classList.toggle('hidden', id !== tabId);
      });
      ['btnBuildFinance', 'btnBuildCode', 'btnBuildSupport', 'btnBuildResearch'].forEach(id => {
        const isActive = id === 'btn' + tabId.charAt(0).toUpperCase() + tabId.slice(1);
        const btn = document.getElementById(id);
        if (btn) {
          btn.className = isActive
            ? 'px-3 py-1.5 text-xs font-semibold rounded-lg bg-black text-white cursor-pointer transition'
            : 'px-3 py-1.5 text-xs font-semibold rounded-lg text-neutral-600 hover:text-black cursor-pointer transition';
        }
      });
    }

    function copyToClipboard(text, btnElement) {
      navigator.clipboard.writeText(text);
      if (btnElement && btnElement.innerText) {
        const origText = btnElement.innerText;
        btnElement.innerText = 'Copied!';
        setTimeout(() => { btnElement.innerText = origText; }, 1400);
      } else {
        showToast('Copied to clipboard');
      }
    }

    function showToast(msg) {
      let t = document.getElementById('appToast');
      if (!t) {
        t = document.createElement('div');
        t.id = 'appToast';
        t.className = 'fixed bottom-6 right-6 z-[99999] px-4 py-2 rounded-xl bg-black text-white text-xs font-semibold shadow-2xl transition-all duration-300 font-num';
        document.body.appendChild(t);
      }
      t.innerText = msg;
      t.style.opacity = '1';
      t.style.transform = 'translateY(0)';
      setTimeout(() => {
        t.style.opacity = '0';
        t.style.transform = 'translateY(10px)';
      }, 1600);
    }

    function getActiveKey() {
      const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (keys.length > 0 && keys[0].plain_key) return keys[0].plain_key;
      const sess = localStorage.getItem('ultrademon_auth_session');
      if (sess) {
        try {
          const parsed = JSON.parse(sess);
          if (parsed && (parsed.active_key || parsed.initial_key)) return parsed.active_key || parsed.initial_key;
        } catch {}
      }
      return '';
    }

    function getApiHeaders() {
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

    // ── UltraMemory Frontend ──────────────────────────────────────────────────

    function fillMemorySample(type, content, container) {
      document.getElementById('memTypeInput').value = type;
      document.getElementById('memContentInput').value = content;
      document.getElementById('memContainerInput').value = container;
    }

    async function handleStoreMemory(e) {
      e.preventDefault();
      const content = document.getElementById('memContentInput').value.trim();
      const memoryType = document.getElementById('memTypeInput').value;
      const containerTag = document.getElementById('memContainerInput').value.trim() || 'default';

      const spinner = document.getElementById('storeMemSpinner');
      const submitBtn = document.getElementById('storeMemBtn');
      const alertBox = document.getElementById('storeMemAlert');

      if (!content) return;

      spinner.classList.remove('hidden');
      submitBtn.disabled = true;
      alertBox.classList.add('hidden');

      const t0 = performance.now();
      try {
        const resp = await fetch('/v1/memory', {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({ content, memory_type: memoryType, container_tag: containerTag })
        });
        const data = await resp.json();
        const duration = Math.round(performance.now() - t0);

        const memId = data.memory_id || (data.memory && data.memory.memory_id);
        if (resp.ok && memId) {
          const isGuest = !getActiveKey() && !getAuthToken();
          const tag = data.container_tag || (data.memory && data.memory.container_tag) || containerTag;
          alertBox.className = 'mt-3 p-2.5 rounded-lg text-xs font-num bg-neutral-100 border border-neutral-300 text-neutral-950 flex items-center justify-between';
          alertBox.innerHTML = '<span class="flex items-center gap-1.5"><svg class="w-3.5 h-3.5 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Stored: <strong>' + memId + '</strong> [' + tag + ']</span></span><span class="text-[10px] text-neutral-600 font-sans font-medium">' + (isGuest ? 'Edge Sandbox (' + duration + 'ms)' : 'D1 FTS5 (' + duration + 'ms)') + '</span>';
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
      const query = document.getElementById('memQueryInput').value.trim();
      const containerTag = document.getElementById('memQueryContainer').value.trim();
      const spinner = document.getElementById('queryMemSpinner');
      const submitBtn = document.getElementById('queryMemBtn');
      const resultsDiv = document.getElementById('memResultsContainer');
      const latencyBadge = document.getElementById('memRecallLatencyBadge');

      if (!query) return;

      spinner.classList.remove('hidden');
      submitBtn.disabled = true;
      resultsDiv.innerHTML = '<div class="text-center py-4 text-neutral-400 text-xs">Recalling from edge BM25...</div>';

      const t0 = performance.now();
      try {
        const resp = await fetch('/v1/memory/query', {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({ query, container_tag: containerTag || undefined, limit: 5 })
        });
        const data = await resp.json();
        const duration = Math.round(performance.now() - t0);

        latencyBadge.innerText = (data.query_time_ms || duration) + 'ms (Edge D1 BM25)';
        latencyBadge.classList.remove('hidden');

        const items = data.memories || data.results || [];
        if (items.length > 0) {
          resultsDiv.innerHTML = items.map(r => 
            '<div class="p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs">' +
              '<div class="flex items-center justify-between font-num text-[10px] text-neutral-500 mb-1">' +
                '<span class="px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-800 uppercase font-semibold">' + (r.memory_type || 'fact') + '</span>' +
                '<span class="font-mono">' + (r.container_tag || 'default') + '</span>' +
                '<span class="font-bold text-black">Score: ' + (r.score ? r.score.toFixed(2) : '1.00') + '</span>' +
              '</div>' +
              '<p class="text-neutral-800">' + (r.content || r.title || '') + '</p>' +
            '</div>'
          ).join('');
        } else {
          resultsDiv.innerHTML = '<div class="text-center py-4 text-neutral-500 text-xs bg-neutral-50 rounded-xl border border-neutral-200 p-3">No matching memories found in edge index for "' + query + '". Store a fact above to index it into D1!</div>';
        }
      } catch (err) {
        resultsDiv.innerHTML = '<div class="p-2.5 bg-neutral-100 border border-neutral-300 text-red-600 text-xs font-num">Error: ' + err.message + '</div>';
      } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
      }
    }

    async function refreshStoredMemories() {
      try {
        const resp = await fetch('/v1/memory?limit=25', { headers: getApiHeaders() });
        const data = await resp.json();
        if (data && data.memories) {
          renderMemoriesTable(data.memories);
        }
      } catch (err) {
        console.warn('refreshStoredMemories failed:', err);
      }
    }

    function renderMemoriesTable(memories) {
      const tbody = document.getElementById('memoriesTableBody');
      if (!tbody) return;
      if (!memories || memories.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="py-3 text-center text-neutral-400">No memories stored yet. Store one above to test live D1 storage!</td></tr>';
        return;
      }

      tbody.innerHTML = memories.map(m => 
        '<tr class="hover:bg-neutral-50">' +
          '<td class="py-2 font-mono text-neutral-900">' + m.memory_id + '</td>' +
          '<td class="py-2 font-mono text-neutral-600">' + m.container_tag + '</td>' +
          '<td class="py-2"><span class="px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-800 text-[10px] uppercase font-semibold">' + m.memory_type + '</span></td>' +
          '<td class="py-2 text-neutral-900 truncate max-w-xs font-sans">' + (m.title || m.content) + '</td>' +
          '<td class="py-2 text-right font-sans"><button data-id="' + m.memory_id + '" onclick="handleDeleteMemory(this.dataset.id)" class="text-neutral-500 hover:text-black font-semibold cursor-pointer">Delete</button></td>' +
        '</tr>'
      ).join('');
    }

    async function handleDeleteMemory(memoryId) {
      if (!confirm('Delete memory ' + memoryId + '?')) return;
      try {
        await fetch('/v1/memory/' + memoryId, { method: 'DELETE', headers: getApiHeaders() });
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
      const useCache = document.getElementById('useCacheCheck') ? document.getElementById('useCacheCheck').checked : true;
      const resultsDiv = document.getElementById('resultsContainer');
      const latencyBadge = document.getElementById('latencyBadge');
      const spinner = document.getElementById('searchSpinner');

      if (!query) return;

      spinner.classList.remove('hidden');
      resultsDiv.innerHTML = '<div class="text-center py-4 text-neutral-400 text-xs">Searching sovereign BM25 index...</div>';

      const t0 = performance.now();
      try {
        const resp = await fetch('/v1/search', {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({ query, num_results: 5, mode: currentMode, use_cache: useCache })
        });
        const data = await resp.json();
        const duration = Math.round(performance.now() - t0);

        if (!resp.ok) {
          resultsDiv.innerHTML = '<div class="p-4 rounded-xl bg-neutral-100 text-center text-xs font-medium text-neutral-950">Search Notice: ' + (data.error || 'Server error') + '</div>';
          return;
        }

        latencyBadge.innerText = (data.search_time_ms || duration) + 'ms' + (data.cached ? ' (KV Hit)' : ' (D1 BM25)');
        latencyBadge.classList.remove('hidden');

        if (data.results && data.results.length > 0) {
          resultsDiv.innerHTML = data.results.map(r => 
            '<div class="card-clean p-4 rounded-xl mb-2">' +
              '<div class="flex items-center justify-between text-neutral-400 text-[10px] font-num mb-1">' +
                '<span class="truncate max-w-xs text-neutral-600 font-mono">' + (r.url || 'edge://d1/indexed') + '</span>' +
                '<span class="font-bold text-neutral-900">BM25: ' + (r.score ? r.score.toFixed(2) : '1.00') + '</span>' +
              '</div>' +
              '<h3 class="font-normal text-xs text-neutral-950 hover:underline cursor-pointer mb-1">' + (r.title || 'Indexed Document') + '</h3>' +
              '<p class="text-neutral-600 text-xs line-clamp-2 leading-relaxed">' + (r.snippet || r.content || '') + '</p>' +
            '</div>'
          ).join('');
        } else {
          resultsDiv.innerHTML = '<div class="text-center py-6 text-neutral-400 text-xs">No edge results found for "' + query + '". Try another keyword like "Python", "Cloudflare", or "Workers".</div>';
        }
      } catch (err) {
        resultsDiv.innerHTML = '<div class="p-3 bg-neutral-100 border border-neutral-300 text-red-600 text-xs font-num">Edge search failed: ' + err.message + '</div>';
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
      const keyType = document.getElementById('newKeyType') ? document.getElementById('newKeyType').value : 'memory';
      const label = document.getElementById('newKeyLabel').value.trim();
      const spinner = document.getElementById('createKeySpinner');
      const submitBtn = document.getElementById('createKeyBtn');

      let authHeader = '';
      const token = getAuthToken();
      if (token) {
        authHeader = 'Bearer ' + token;
      } else if (supabase) {
        const session = (await supabase.auth.getSession())?.data?.session;
        if (session) authHeader = 'Bearer ' + session.access_token;
      }

      if (!authHeader) {
        openAuthModal('signin');
        return;
      }

      spinner.classList.remove('hidden');
      submitBtn.disabled = true;

      try {
        const resp = await fetch('/v1/keys', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': authHeader },
          body: JSON.stringify({ plan, key_type: keyType, label })
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
            key_type: data.key_type || keyType,
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
        tbody.innerHTML = '<tr><td colspan=\"5\" class=\"py-3 text-center text-neutral-400\">Sign in to view your keys.</td></tr>';
        return;
      }
      const keys = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (keys.length === 0) {
        tbody.innerHTML = '<tr><td colspan=\"5\" class=\"py-3 text-center text-neutral-400\">No keys generated yet.</td></tr>';
        return;
      }

      tbody.innerHTML = keys.map((k, idx) => {
        const scopeBadge = k.key_type === 'memory'
          ? '<span class=\"px-1.5 py-0.2 rounded bg-black text-white text-[9px] uppercase font-bold font-num\">Memory</span>'
          : (k.key_type === 'search'
            ? '<span class=\"px-1.5 py-0.2 rounded bg-neutral-200 text-neutral-800 text-[9px] uppercase font-semibold font-num\">Search</span>'
            : '<span class=\"px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-700 text-[9px] uppercase font-semibold font-num\">Unified</span>');

        return '<tr class=\"hover:bg-neutral-50\">' +
          '<td class=\"py-2 font-mono text-neutral-900\">' +
            '<span class=\"truncate max-w-[140px] inline-block\">' + (k.plain_key || 'Key: ' + k.key_id) + '</span>' +
            (k.plain_key ? ' <button data-key=\"' + k.plain_key + '\" onclick=\"copyToClipboard(this.dataset.key)\" class=\"text-neutral-400 hover:text-black cursor-pointer inline-flex items-center ml-1\"><svg class=\"w-3 h-3\" fill=\"none\" stroke=\"currentColor\" viewBox=\"0 0 24 24\" stroke-width=\"2\"><rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"/><path stroke-linecap=\"round\" stroke-linejoin=\"round\" d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"/></svg></button>' : '') +
          '</td>' +
          '<td class=\"py-2\">' + scopeBadge + '</td>' +
          '<td class=\"py-2\"><span class=\"px-1.5 py-0.2 rounded bg-neutral-100 text-neutral-800 text-[10px] uppercase font-semibold\">' + k.plan + '</span></td>' +
          '<td class=\"py-2 text-neutral-600\">' + (k.label || 'Key') + '</td>' +
          '<td class=\"py-2 text-right\"><button data-key=\"' + (k.plain_key || k.key_id) + '\" data-idx=\"' + idx + '\" onclick=\"revokeKey(this.dataset.key, parseInt(this.dataset.idx, 10))\" class=\"text-neutral-500 hover:text-black font-semibold cursor-pointer\">Revoke</button></td>' +
        '</tr>';
      }).join('');
    }

    async function revokeKey(key, index) {
      if (!confirm('Are you sure you want to revoke this API key?')) return;
      try {
        let authHeader = '';
        const token = getAuthToken();
        if (token) {
          authHeader = 'Bearer ' + token;
        } else if (supabase) {
          const session = (await supabase.auth.getSession())?.data?.session;
          if (session) authHeader = 'Bearer ' + session.access_token;
        }
        const headers = {};
        if (authHeader) headers['Authorization'] = authHeader;
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
      const url = document.getElementById('crawlUrlInput').value.trim();
      const depth = parseInt(document.getElementById('crawlDepthInput').value, 10);
      const spinner = document.getElementById('crawlSpinner');
      const resultBox = document.getElementById('crawlResultBox');
      const statusMsg = document.getElementById('crawlStatusMsg');
      const details = document.getElementById('crawlDetails');

      if (!url) return;

      spinner.classList.remove('hidden');
      resultBox.classList.remove('hidden');
      statusMsg.className = 'font-semibold text-neutral-900';
      statusMsg.innerText = 'Crawling and parsing ' + url + ' into D1 FTS5...';
      details.innerText = '';

      const t0 = performance.now();
      try {
        const resp = await fetch('/v1/crawl', {
          method: 'POST',
          headers: getApiHeaders(),
          body: JSON.stringify({ url, depth })
        });
        const data = await resp.json();
        const duration = Math.round(performance.now() - t0);

        if (resp.ok) {
          statusMsg.className = 'font-semibold text-neutral-950 flex items-center gap-1.5';
          statusMsg.innerHTML = '<svg class="w-3.5 h-3.5 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>' + (data.message || 'Crawl & Index Complete') + ' (' + duration + 'ms)</span>';
          details.innerText = JSON.stringify(data.document || data, null, 2);
        } else {
          statusMsg.className = 'font-semibold text-red-600';
          statusMsg.innerText = 'Crawl failed: ' + (data.error || 'Server error');
        }
      } catch (err) {
        statusMsg.className = 'font-semibold text-red-600';
        statusMsg.innerText = 'Crawl Error: ' + err.message;
      } finally {
        spinner.classList.add('hidden');
      }
    }


function skipJacket(e) {
      if (e) {
        if (e.stopPropagation) e.stopPropagation();
        if (e.preventDefault) e.preventDefault();
      }
      try {
        sessionStorage.setItem('ultrademon_jacket_unzipped', 'true');
      } catch (err) {}
      const curtain = document.getElementById('jacketCurtain');
      const skipBtn = document.getElementById('skipJacketBtn');
      if (skipBtn) skipBtn.style.display = 'none';
      if (curtain) {
        curtain.style.transition = 'opacity 0.25s ease';
        curtain.style.opacity = '0';
        curtain.style.pointerEvents = 'none';
        setTimeout(() => {
          curtain.style.display = 'none';
        }, 260);
      }
    }
    window.skipJacket = skipJacket;

    // 1. Interactive Sky Blue Jacket Unzip Physics (PointerEvents + Direct Manipulation)
    (function initJacketUnzip() {
      const curtain = document.getElementById('jacketCurtain');
      const handle = document.getElementById('zipperHandle');
      const flapLeft = document.getElementById('jacketLeft');
      const flapRight = document.getElementById('jacketRight');
      if (!curtain || !handle || !flapLeft || !flapRight) return;

      const hasUnzipped = sessionStorage.getItem('ultrademon_jacket_unzipped');
      if (hasUnzipped === 'true') {
        curtain.style.display = 'none';
        return;
      }

      let isDragging = false;
      let startY = 0;
      let currentY = 0;
      let isCompleted = false;
      let hasDraggedDown = false;

      function onPointerDown(e) {
        if (isCompleted) return;
        if (e.target.closest('#skipJacketBtn')) return;
        if (e.cancelable) e.preventDefault();

        isDragging = true;
        hasDraggedDown = false;

        const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
        startY = clientY - currentY;

        try {
          handle.setPointerCapture(e.pointerId);
        } catch (err) {}

        handle.style.transition = 'none';
        flapLeft.style.transition = 'none';
        flapRight.style.transition = 'none';
        curtain.style.transition = 'none';

        handle.classList.add('cursor-grabbing');
        handle.classList.remove('cursor-grab');
        document.body.style.userSelect = 'none';
      }

      function onPointerMove(e) {
        if (!isDragging || isCompleted) return;
        if (e.cancelable) e.preventDefault();

        const clientY = (e.touches && e.touches.length > 0) ? e.touches[0].clientY : e.clientY;
        const rawY = clientY - startY;
        currentY = Math.max(0, rawY);

        if (currentY > 8) {
          hasDraggedDown = true;
        }

        const maxTravel = Math.min(340, Math.max(180, window.innerHeight * 0.45));
        const progress = Math.min(1, currentY / maxTravel);

        handle.style.transform = 'translate3d(-50%, ' + currentY + 'px, 0)';
        flapLeft.style.transform = 'translate3d(-' + (progress * 105) + '%, 0, 0) rotateY(-' + (progress * 28) + 'deg)';
        flapRight.style.transform = 'translate3d(' + (progress * 105) + '%, 0, 0) rotateY(' + (progress * 28) + 'deg)';
        curtain.style.opacity = '' + Math.max(0.08, 1 - progress * 0.5);

        const tag = document.getElementById('zipperTag');
        if (tag) {
          if (progress > 0.12) {
            tag.classList.remove('animate-bounce');
            tag.innerHTML = '<span class="text-sky-300 font-bold">UNZIPPING... RELEASE TO OPEN</span>';
          } else {
            tag.classList.add('animate-bounce');
            tag.innerHTML = '<svg class="w-3.5 h-3.5 text-sky-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg><span>HOLD &amp; PULL DOWN TO UNZIP</span>';
          }
        }

        if (progress >= 0.22) {
          finishUnzip();
        }
      }

      function onPointerUp(e) {
        if (!isDragging || isCompleted) return;
        isDragging = false;

        try {
          handle.releasePointerCapture(e.pointerId);
        } catch (err) {}

        handle.classList.remove('cursor-grabbing');
        handle.classList.add('cursor-grab');
        document.body.style.userSelect = '';

        if (!hasDraggedDown || currentY < 15) {
          finishUnzip();
          return;
        }

        const maxTravel = Math.min(340, Math.max(180, window.innerHeight * 0.45));
        const progress = currentY / maxTravel;

        if (progress >= 0.18) {
          finishUnzip();
        } else {
          handle.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          flapLeft.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          flapRight.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
          curtain.style.transition = 'opacity 0.35s ease';

          handle.style.transform = 'translate3d(-50%, 0px, 0)';
          flapLeft.style.transform = 'translate3d(0%, 0, 0) rotateY(0deg)';
          flapRight.style.transform = 'translate3d(0%, 0, 0) rotateY(0deg)';
          curtain.style.opacity = '1';
          currentY = 0;

          const tag = document.getElementById('zipperTag');
          if (tag) {
            tag.classList.add('animate-bounce');
            tag.innerHTML = '<svg class="w-3.5 h-3.5 text-sky-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><path stroke-linecap="round" stroke-linejoin="round" d="M19 14l-7 7m0 0l-7-7m7 7V3"/></svg><span>HOLD &amp; PULL DOWN TO UNZIP</span>';
          }
        }
      }

      function finishUnzip() {
        if (isCompleted) return;
        isCompleted = true;
        isDragging = false;
        try {
          sessionStorage.setItem('ultrademon_jacket_unzipped', 'true');
        } catch (err) {}

        handle.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
        flapLeft.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
        flapRight.style.transition = 'transform 0.55s cubic-bezier(0.16, 1, 0.3, 1)';
        curtain.style.transition = 'opacity 0.55s ease';

        const endDistance = Math.max(window.innerHeight + 120, 800);
        handle.style.transform = 'translate3d(-50%, ' + endDistance + 'px, 0)';
        flapLeft.style.transform = 'translate3d(-115%, 0, 0) rotateY(-35deg)';
        flapRight.style.transform = 'translate3d(115%, 0, 0) rotateY(35deg)';
        curtain.style.opacity = '0';
        curtain.style.pointerEvents = 'none';

        setTimeout(() => {
          curtain.style.display = 'none';
        }, 600);
      }

      handle.addEventListener('pointerdown', onPointerDown);
      window.addEventListener('pointermove', onPointerMove, { passive: false });
      window.addEventListener('pointerup', onPointerUp);
      window.addEventListener('pointercancel', onPointerUp);

      curtain.addEventListener('click', (e) => {
        if (e.target.closest('#skipJacketBtn')) return;
        if (!hasDraggedDown) finishUnzip();
      });

      window.finishUnzip = finishUnzip;
    })();

    function rezipJacket() {
      try {
        sessionStorage.removeItem('ultrademon_jacket_unzipped');
      } catch (err) {}
      window.location.reload();
    }
    window.rezipJacket = rezipJacket;

    // 2. Dynamic Navbar Transition: Sky Blue in Hero -> Pure White with Black Text in Body
    (function initNavbarScroll() {
      const header = document.getElementById('mainHeader');
      if (!header) return;

      function updateNav() {
        const y = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || window.scrollY || 0;
        if (y > 20) {
          header.classList.add('scrolled-light');
        } else {
          header.classList.remove('scrolled-light');
        }
      }

      window.addEventListener('scroll', updateNav, { passive: true });
      document.addEventListener('scroll', updateNav, { passive: true });
      window.addEventListener('resize', updateNav, { passive: true });
      window.addEventListener('hashchange', () => {
        setTimeout(updateNav, 20);
        setTimeout(updateNav, 150);
        setTimeout(updateNav, 450);
      });
      window.addEventListener('load', updateNav);
      
      // Handle anchor clicks instantaneously
      document.addEventListener('click', (e) => {
        const a = e.target && e.target.closest && e.target.closest('a[href^="#"]');
        if (a) {
          setTimeout(updateNav, 30);
          setTimeout(updateNav, 200);
          setTimeout(updateNav, 600);
        }
      });

      updateNav();

      if ('IntersectionObserver' in window) {
        const sentinel = document.getElementById('heroTopSentinel');
        if (sentinel) {
          const obs = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
              const y = window.pageYOffset || document.documentElement.scrollTop || 0;
              if (entry.isIntersecting && y <= 20) {
                header.classList.remove('scrolled-light');
              } else if (y > 20 || !entry.isIntersecting) {
                header.classList.add('scrolled-light');
              }
            });
          }, { rootMargin: '-20px 0px 0px 0px' });
          obs.observe(sentinel);
        }
      }
    })();

    // 3. Side-Scroll Mouse Drag-to-Scroll & Card Step
    (function initDragScroll() {
      const track = document.getElementById('featureScrollTrack');
      if (!track) return;
      let isDown = false;
      let startX = 0;
      let scrollLeft = 0;

      track.addEventListener('mousedown', (e) => {
        isDown = true;
        track.classList.add('cursor-grabbing');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = track.scrollLeft;
      });
      track.addEventListener('mouseleave', () => {
        isDown = false;
        track.classList.remove('cursor-grabbing');
      });
      track.addEventListener('mouseup', () => {
        isDown = false;
        track.classList.remove('cursor-grabbing');
      });
      track.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (x - startX) * 1.5;
        track.scrollLeft = scrollLeft - walk;
      });
    })();

    // Custom Inverted Color Cursor Hijack (Difference Blend)
    (function initCustomCursor() {
      const cursor = document.getElementById('customCursor');
      if (!cursor) return;

      let mouseX = -100, mouseY = -100;
      let curX = -100, curY = -100;
      let isVisible = false;

      window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        if (!isVisible) {
          cursor.classList.add('active');
          curX = mouseX;
          curY = mouseY;
          isVisible = true;
        }
      });

      document.addEventListener('mouseleave', () => {
        cursor.classList.remove('active');
        isVisible = false;
      });

      function renderCursor() {
        if (isVisible) {
          curX += (mouseX - curX) * 0.35;
          curY += (mouseY - curY) * 0.35;
          cursor.style.transform = 'translate3d(' + curX + 'px, ' + curY + 'px, 0) translate(-50%, -50%)';
        }
        requestAnimationFrame(renderCursor);
      }
      requestAnimationFrame(renderCursor);

      // Interactive hover morph
      const interactiveSelector = 'a, button, input, select, textarea, pre, .card-clean, [role="button"], code';
      document.addEventListener('mouseover', (e) => {
        if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
          cursor.classList.add('hovered');
        }
      });
      document.addEventListener('mouseout', (e) => {
        if (e.target && e.target.closest && e.target.closest(interactiveSelector)) {
          cursor.classList.remove('hovered');
        }
      });
      document.addEventListener('mousedown', () => cursor.classList.add('clicked'));
      document.addEventListener('mouseup', () => cursor.classList.remove('clicked'));
    })();

    // Scroll-reveal animations observer
    (function initScrollReveal() {
      if (!('IntersectionObserver' in window)) return;
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-revealed');
          }
        });
      }, { threshold: 0.08 });

      function bind() {
        document.body.classList.add('reveal-ready');
        document.querySelectorAll('.reveal-on-scroll').forEach(el => observer.observe(el));
      }

      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bind);
      } else {
        bind();
      }
    })();

    async function initAuth() {
      // 1. Check local edge session
      const token = getAuthToken();
      if (token) {
        try {
          const res = await fetch('/v1/auth/me', {
            headers: { 'Authorization': 'Bearer ' + token }
          });
          if (res.ok) {
            const data = await res.json();
            if (data.user) {
              updateAuthUI(data.user);
              refreshStoredMemories();
              return;
            }
          }
        } catch {}
      }

      // 2. Check Supabase session fallback
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            updateAuthUI(session.user);
            refreshStoredMemories();
            return;
          }

          supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
              updateAuthUI(session.user);
              refreshStoredMemories();
            }
          });
        } catch {}
      }

      updateAuthUI(null);
      refreshStoredMemories();
    }

    if (document.readyState === 'loading') {
      window.addEventListener('DOMContentLoaded', initAuth);
    } else {
      initAuth();
    }
  </script>
</body>
</html>`;
}
