// UltraDemon — Sovereign Autonomous Engine for Agent Memory & Search
// High-End Editorial SaaS Landing Page Styled to Devin AI Benchmark Standards.
// Uses Real 4K High-Fidelity Dashboard Screenshots from UltraDemon.
// Strict Constraint: ZERO EMOJIS ANYWHERE. Minimalist SVG icons only.

import { MICHELANGELUS_BOLD_ITALIC_WOFF2_B64, MICHELANGELUS_REGULAR_WOFF2_B64, NB_INTERNATIONAL_PRO_WOFF2_B64, NB_INTERNATIONAL_PRO_LIGHT_WOFF2_B64 } from './font-data';
import { BLUEPRINT_CIRCUIT_SVG, VINTAGE_TERMINAL_SVG, MATH_MANUSCRIPT_SVG, TECHNICAL_SCHEMATIC_SVG } from './science-assets';
import { CUSTOM_CURSORS_CSS } from './cursors';
import { ULTRADEMON_LOGO_URI, ULTRADEMON_FAVICON_URI } from './logo-data';
import { FOUNDER_FONT_CSS } from './founder-font';

export function renderLandingPage(origin: string, supabaseUrl: string, supabaseAnonKey: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="light scroll-smooth">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>UltraDemon — Fastest Web Search API &amp; AI Agent Long-Term Memory Engine | Sub-15ms MCP Server</title>
  <meta name="description" content="The fastest sovereign Web Search API and AI Agent Long-Term Memory engine. Sub-15ms SQLite FTS5 BM25 search, native Model Context Protocol (MCP) server, 0-cold-start Anycast edge routing across 330+ cities, and zero third-party latency.">
  <meta name="keywords" content="web search api, search api, ai search api, websearch, ai agent memory, agent memory, autonomous agent memory, long term memory ai, ai memory api, agents ai, autonomous ai agents, model context protocol, mcp server, mcp web search, claude mcp server, cursor mcp server, sqlite fts5 bm25, edge search api, fast search api, vector memory, llm memory, langchain memory, autogpt memory, zero cold start api, seamless summoning, ultrademon, ultrademon.site">
  <link rel="canonical" href="https://ultrademon.site/">
  <link rel="alternate" hreflang="x-default" href="https://ultrademon.site/">
  <link rel="alternate" hreflang="en" href="https://ultrademon.site/">
  <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">
  <meta name="author" content="UltraDemon">
  <meta name="publisher" content="UltraDemon">
  <meta name="application-name" content="UltraDemon">
  <meta name="theme-color" content="#09090b">
  <meta name="apple-mobile-web-app-capable" content="yes">
  <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
  <meta name="apple-mobile-web-app-title" content="UltraDemon">

  <!-- Open Graph / Facebook / LinkedIn / Discord -->
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="UltraDemon">
  <meta property="og:url" content="https://ultrademon.site/">
  <meta property="og:title" content="UltraDemon — Fastest Web Search API &amp; AI Agent Long-Term Memory Engine | Sub-15ms MCP Server">
  <meta property="og:description" content="The fastest sovereign Web Search API and AI Agent Long-Term Memory engine. Sub-15ms SQLite FTS5 BM25 search, native Model Context Protocol (MCP) server, and 0-cold-start Anycast edge routing across 330+ cities.">
  <meta property="og:image" content="https://ultrademon.site/og-image.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="UltraDemon Engine — Sovereign Agent Memory &amp; Edge Search">
  <meta property="og:locale" content="en_US">

  <!-- Twitter / X Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:site" content="@ultrademon_site">
  <meta name="twitter:creator" content="@ultrademon_site">
  <meta name="twitter:title" content="UltraDemon — Fastest Web Search API &amp; AI Agent Long-Term Memory Engine">
  <meta name="twitter:description" content="Sub-15ms BM25 Web Search API and persistent agent memory on Cloudflare Anycast edge. 0-cold-start Model Context Protocol (MCP) server.">
  <meta name="twitter:image" content="https://ultrademon.site/og-image.png">
  <meta name="twitter:image:alt" content="UltraDemon Engine">

  <!-- Schema.org Structured Data (World-Class SEO Rich Snippets) -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://ultrademon.site/#organization",
        "name": "UltraDemon",
        "url": "https://ultrademon.site",
        "logo": "https://ultrademon.site/favicon.png",
        "description": "Sovereign autonomous engine for agent memory, edge search, and kinetic micro-telemetry.",
        "sameAs": [
          "https://github.com/im-ansh/UltraDemon"
        ]
      },
      {
        "@type": "WebSite",
        "@id": "https://ultrademon.site/#website",
        "url": "https://ultrademon.site/",
        "name": "UltraDemon — Sovereign Autonomous AI Agent Memory & Real-Time Web Search API",
        "alternateName": ["UltraDemon", "UltraSearch", "UltraMemory", "UltraDemon Web Search API", "UltraDemon Agent Memory Engine"],
        "description": "The fastest sovereign Web Search API and AI Agent Long-Term Memory engine with sub-15ms latency across 330+ Anycast cities.", 
        "publisher": { "@id": "https://ultrademon.site/#organization" },
        "potentialAction": {
          "@type": "SearchAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://ultrademon.site/v1/search?q={search_term_string}"
          },
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://ultrademon.site/#application",
        "name": "UltraDemon",
        "operatingSystem": "Cloudflare Workers Edge, Linux, macOS, Windows",
        "applicationCategory": "DeveloperApplication",
        "url": "https://ultrademon.site/",
        "image": "https://ultrademon.site/og-image.png",
        "description": "UltraDemon equips autonomous agents and multi-agent swarms with persistent long-term memory, sub-15ms BM25 full-text recall, and an autonomous edge crawler across 330+ Anycast cities with zero third-party latency.",
        "author": { "@id": "https://ultrademon.site/#organization" },
        "offers": [
          {
            "@type": "Offer",
            "name": "Free Tier",
            "price": "0",
            "priceCurrency": "USD",
            "description": "10,000 monthly requests, 25MB memory index, sub-15ms edge recall"
          },
          {
            "@type": "Offer",
            "name": "Pay As You Go",
            "price": "20.00",
            "priceCurrency": "USD",
            "description": "100,000 API requests for $20, 500MB long-term memory, unlimited API keys"
          },
          {
            "@type": "Offer",
            "name": "Business Tier",
            "price": "299.00",
            "priceCurrency": "USD",
            "description": "Dedicated Cloudflare KV & D1 isolates, 10M requests, custom SLA"
          }
        ],
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "reviewCount": "128",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://ultrademon.site/#faq",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "What is UltraDemon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UltraDemon is a sovereign autonomous engine providing AI agents and multi-agent systems with sub-15ms long-term memory recall, full-text edge web search via SQLite FTS5 BM25, and kinetic micro-telemetry running on 330+ Cloudflare edge locations worldwide."
            }
          },
          {
            "@type": "Question",
            "name": "How fast is UltraDemon compared to traditional search APIs?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UltraDemon delivers median (P50) edge latency of 11.8ms, compared to 842ms on Tavily, 910ms on Exa, and 580ms on Serper. UltraDemon runs directly on Cloudflare edge isolates adjacent to users and AI agents."
            }
          },
          {
            "@type": "Question",
            "name": "Does UltraDemon support Model Context Protocol (MCP)?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. UltraDemon features native Model Context Protocol (MCP) server endpoints (/mcp), allowing immediate integration with Claude Desktop, Cursor, Windsurf, LangChain, and autonomous frameworks with zero extra configuration."
            }
          },
          {
            "@type": "Question",
            "name": "What is the pricing model for UltraDemon?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "UltraDemon offers a developer-first Pay-As-You-Go pricing model of 100,000 API requests for $20, alongside a 10,000 requests/month Free tier and custom dedicated tiers for high-throughput enterprise agent fleets."
            }
          },
          {
            "@type": "Question",
            "name": "How is agent data stored and kept private?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "All memories and index assets are encrypted and stored in sovereign Cloudflare D1 SQLite databases and KV stores. Your agent data is never used for training and never routed through third-party telemetry providers."
            }
          }
        ]
      }
    ]
  }
  </script>
  <link rel="icon" type="image/png" href="${ULTRADEMON_FAVICON_URI}">
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Geist Mono for Numbers & Code -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"NB International Pro"', '"NB International"', 'nbinternational', '"NBInternational"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
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
    /* Discrete @font-face rules for authentic NB International Pro & aliases across all weights */
    @font-face {
      font-family: 'NB International Pro';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_LIGHT_WOFF2_B64}') format('woff2');
      font-weight: 300;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International Pro';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International Pro';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International Pro';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International Pro';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International Pro';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 800;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International Pro';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 900;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'NB International';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_LIGHT_WOFF2_B64}') format('woff2');
      font-weight: 300;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 800;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'NB International';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 900;
      font-style: normal;
      font-display: swap;
    }

    @font-face {
      font-family: 'nbinternational';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_LIGHT_WOFF2_B64}') format('woff2');
      font-weight: 300;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'nbinternational';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 400;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'nbinternational';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 500;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'nbinternational';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 600;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'nbinternational';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 700;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'nbinternational';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 800;
      font-style: normal;
      font-display: swap;
    }
    @font-face {
      font-family: 'nbinternational';
      src: url('data:font/woff2;base64,${NB_INTERNATIONAL_PRO_WOFF2_B64}') format('woff2');
      font-weight: 900;
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

    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    html, body, input, textarea, button, select, h1, h2, h3, h4, h5, h6, p, span, div, a, li, tr, td, th, table, nav, aside, header, footer, main, section, label, form, dialog {
      font-family: 'NB International Pro', 'NB International', 'nbinternational', -apple-system, BlinkMacSystemFont, sans-serif;
      font-synthesis: weight style;
    }

    body {
      background-color: #ffffff;
      color: #09090b;
    }

    .font-sans {
      font-family: 'NB International Pro', 'NB International', 'nbinternational', -apple-system, BlinkMacSystemFont, sans-serif !important;
      font-synthesis: weight style;
    }

    .font-num, .font-mono, code, pre, kbd {
      font-family: 'Geist Mono', monospace !important;
      font-variant-numeric: tabular-nums;
    }

    .font-serif {
      font-family: 'Michelangelus', Georgia, serif;
    }

    ${FOUNDER_FONT_CSS}

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

    /* Left-Tilted Architectural Perspective Stage (Desktop) */
    @media (min-width: 768px) {
      .hero-stage-tilt {
        perspective: 1400px;
        perspective-origin: 40% 45%;
      }
      .hero-window-tilted {
        transform: rotateY(-3.5deg) rotateX(1.8deg) rotate(-0.6deg);
        transform-style: preserve-3d;
        transition: transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease;
      }
      .hero-window-tilted:hover {
        transform: rotateY(-1deg) rotateX(0.5deg) rotate(0deg);
        box-shadow: 0 4px 14px rgba(0,0,0,0.06), 0 24px 60px -10px rgba(0,0,0,0.12);
      }
      .hero-card-studio {
        transform: rotate(1.2deg) translateZ(32px);
        transform-style: preserve-3d;
        transition: transform 0.4s ease;
      }
      .hero-card-studio:hover {
        transform: rotate(0deg) translateZ(48px);
      }
      .hero-card-memory {
        transform: rotate(-1.5deg) translateZ(38px);
        transform-style: preserve-3d;
        transition: transform 0.4s ease;
      }
      .hero-card-memory:hover {
        transform: rotate(0deg) translateZ(52px);
      }
    }
    @media (max-width: 767px) {
      .hero-window-tilted, .hero-card-studio, .hero-card-memory {
        transform: none !important;
      }
      .drift-far, .drift-mid, .drift-near {
        animation: none !important;
      }
    }

  </style>

  <!-- Early-Bound Bulletproof Handlers (Available Millisecond 0) -->
  <script>
    window.authMode = 'signin';
    window.isModalSubmitting = false;

    window.toggleLandingMobileMenu = function() {
      var m = document.getElementById('landingMobileMenu');
      var hIcon = document.getElementById('landingHamburgerIcon');
      var cIcon = document.getElementById('landingCloseIcon');
      if (!m) return;
      var isHidden = m.classList.contains('hidden');
      if (isHidden) {
        m.classList.remove('hidden');
        if (hIcon) hIcon.classList.add('hidden');
        if (cIcon) cIcon.classList.remove('hidden');
      } else {
        m.classList.add('hidden');
        if (hIcon) hIcon.classList.remove('hidden');
        if (cIcon) cIcon.classList.add('hidden');
      }
    };

    window.openAuthModal = function(mode, plan) {
      window.selectedModalPlan = plan || 'free';
      var modal = document.getElementById('authModal');
      if (modal) {
        modal.classList.remove('hidden');
        window.switchAuthTab(mode === 'signup' ? 'signup' : 'signin');
      } else {
        window.location.href = mode === 'signin' ? '/login' : ('/signup' + (plan ? '?plan=' + encodeURIComponent(plan) : ''));
      }
    };

    window.closeAuthModal = function() {
      var modal = document.getElementById('authModal');
      if (modal) modal.classList.add('hidden');
    };

    window.switchAuthTab = function(mode) {
      window.authMode = (mode === 'signup') ? 'signup' : 'signin';
      var isSign = window.authMode === 'signin';
      var tabIn = document.getElementById('modalTabSignin');
      var tabUp = document.getElementById('modalTabSignup');
      var heading = document.getElementById('modalAuthHeading');
      var subtitle = document.getElementById('modalAuthSubtitle');
      var confirmRow = document.getElementById('modalConfirmPasswordRow');
      var btn = document.getElementById('modalAuthSubmitBtn');
      var prompt = document.getElementById('modalAuthTogglePrompt');
      var toggleBtn = document.getElementById('modalAuthToggleBtn');
      var err = document.getElementById('modalAuthError');
      var succ = document.getElementById('modalAuthSuccess');
      var planInd = document.getElementById('modalPlanIndicator');
      var planName = document.getElementById('modalPlanName');

      if (err) { err.innerText = ''; err.classList.add('hidden'); }
      if (succ) { succ.innerText = ''; succ.classList.add('hidden'); }

      if (isSign) {
        if (tabIn) tabIn.className = 'py-2 rounded-lg transition cursor-pointer bg-neutral-950 text-white shadow-xs';
        if (tabUp) tabUp.className = 'py-2 rounded-lg transition cursor-pointer text-neutral-600 hover:text-black';
        if (heading) heading.innerText = 'Sign In to UltraDemon';
        if (subtitle) subtitle.innerText = 'Enter your email and password to access your workspace';
        if (confirmRow) confirmRow.classList.add('hidden');
        if (btn) btn.innerText = 'Sign In';
        if (prompt) prompt.innerText = "Don't have an account?";
        if (toggleBtn) toggleBtn.innerText = 'Create Account';
        if (planInd) planInd.classList.add('hidden');
      } else {
        if (tabIn) tabIn.className = 'py-2 rounded-lg transition cursor-pointer text-neutral-600 hover:text-black';
        if (tabUp) tabUp.className = 'py-2 rounded-lg transition cursor-pointer bg-neutral-950 text-white shadow-xs';
        if (heading) heading.innerText = 'Create Sovereign Account';
        if (subtitle) subtitle.innerText = 'Instant edge account setup across 330+ Cloudflare PoPs';
        if (confirmRow) confirmRow.classList.remove('hidden');
        if (btn) btn.innerText = 'Create Account';
        if (prompt) prompt.innerText = 'Already have an account?';
        if (toggleBtn) toggleBtn.innerText = 'Sign In';
        if (planInd && window.selectedModalPlan) {
          if (planName) planName.innerText = String(window.selectedModalPlan).toUpperCase();
          planInd.classList.remove('hidden');
        }
      }
    };

    window.toggleAuthTab = function() {
      window.switchAuthTab(window.authMode === 'signin' ? 'signup' : 'signin');
    };

    window.handleAuthModalSubmit = async function(e) {
      if (e) {
        if (typeof e.preventDefault === 'function') e.preventDefault();
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
      }
      if (window.isModalSubmitting) return;
      window.isModalSubmitting = true;

      var emailEl = document.getElementById('modalAuthEmail');
      var passEl = document.getElementById('modalAuthPassword');
      var confirmEl = document.getElementById('modalAuthConfirmPassword');
      var err = document.getElementById('modalAuthError');
      var succ = document.getElementById('modalAuthSuccess');
      var btn = document.getElementById('modalAuthSubmitBtn');

      if (err) { err.innerText = ''; err.classList.add('hidden'); }
      if (succ) { succ.innerText = ''; succ.classList.add('hidden'); }

      var email = emailEl ? emailEl.value.trim() : '';
      var password = passEl ? passEl.value : '';
      var confirmPassword = confirmEl ? confirmEl.value : '';

      if (!email || !password) {
        if (err) {
          err.innerText = 'Please provide both email and password';
          err.classList.remove('hidden');
        }
        window.isModalSubmitting = false;
        return;
      }

      if (window.authMode === 'signup' && confirmPassword && password !== confirmPassword) {
        if (err) {
          err.innerText = 'Passwords do not match';
          err.classList.remove('hidden');
        }
        window.isModalSubmitting = false;
        return;
      }

      if (btn) { btn.disabled = true; btn.innerText = 'Connecting to edge...'; }

      try {
        var endpoint = (window.authMode === 'signup') ? '/v1/auth/signup' : '/v1/auth/signin';
        var plan = window.selectedModalPlan || 'free';
        var res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: password, plan: plan })
        });
        var data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Authentication failed');
        }
        if (data.session) {
          try { localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session)); } catch(e) {}
        }
        if (data.user) {
          try { localStorage.setItem('ultrademon_user', JSON.stringify(data.user)); } catch(e) {}
        }
        if (data.active_key) {
          try { localStorage.setItem('ultrademon_active_key', data.active_key); } catch(e) {}
        }
        if (succ) {
          succ.innerText = 'Authenticated! Opening workspace...';
          succ.classList.remove('hidden');
        }
        setTimeout(function() {
          window.location.href = '/app' + (plan ? '?plan=' + encodeURIComponent(plan) : '');
        }, 200);
      } catch (error) {
        if (err) {
          err.innerText = error.message || 'Authentication error';
          err.classList.remove('hidden');
          if (error.message && (error.message.includes('switch to Create Account') || error.message.includes('Incorrect password') || error.message.includes('not found') || error.message.includes('password'))) {
            var switchBtn = document.createElement('button');
            switchBtn.type = 'button';
            switchBtn.className = 'block mt-2 underline font-semibold text-neutral-900 cursor-pointer';
            switchBtn.innerText = 'Click here to Switch to Create Account / Set Password';
            switchBtn.onclick = function() { window.switchAuthTab('signup'); };
            err.appendChild(switchBtn);
          }
        }
      } finally {
        window.isModalSubmitting = false;
        if (btn) {
          btn.disabled = false;
          btn.innerText = (window.authMode === 'signin') ? 'Sign In' : 'Create Account';
        }
      }
    };

    window.handleModalGuestAccess = async function() {
      var btn = document.getElementById('modalGuestBtn');
      var err = document.getElementById('modalAuthError');
      if (btn) { btn.disabled = true; btn.innerText = 'Initializing demo workspace...'; }
      try {
        var plan = window.selectedModalPlan || 'free';
        var res = await fetch('/v1/auth/anonymous', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: plan })
        });
        var data = await res.json();
        if (data.session) {
          try { localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session)); } catch(e) {}
        }
        if (data.user) {
          try { localStorage.setItem('ultrademon_user', JSON.stringify(data.user)); } catch(e) {}
        }
        if (data.initial_key) {
          try { localStorage.setItem('ultrademon_active_key', data.initial_key); } catch(e) {}
        }
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
    };

    window.openDemoModal = function() {
      if (typeof window.handleModalGuestAccess === 'function') {
        window.handleModalGuestAccess();
      } else {
        window.openAuthModal('signin');
      }
    };
    window.closeDemoModal = function() {};
  </script>
</head>
<body class="min-h-screen bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col justify-between">

  <!-- SECTION 1: ANNOUNCEMENT BAR -->
  <aside id="topAnnouncementBar" class="w-full bg-[#fbfbfd] border-b border-neutral-200/70 py-2 px-4 text-center text-xs text-neutral-600">
    <div class="max-w-6xl mx-auto flex items-center justify-center gap-2">
      <span class="w-1.5 h-1.5 rounded-full bg-neutral-950 animate-pulse-subtle"></span>
      <span class="font-normal">Token-style pricing: 100,000 API requests for $20. Pay as you scale, zero monthly lock-in.</span>
      <a href="#pricing" class="font-semibold text-neutral-950 hover:underline inline-flex items-center gap-1 ml-1">
        <span>View pricing</span>
        <svg class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
      </a>
    </div>
  </aside>

  <!-- SECTION 2: PRIMARY NAVIGATION (Sticky, Restrained Chrome) -->
  <header class="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-neutral-100">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      
      <!-- Wordmark with Official Oni Mask Logo -->
      <a href="/" class="flex items-center gap-2.5 group">
        <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon Logo" class="w-7 h-7 object-contain select-none shrink-0 group-hover:scale-105 transition" />
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
        <a href="#comparison" class="hover:text-neutral-950 transition-colors font-semibold">Benchmarks</a>
        <a href="#faq" class="hover:text-neutral-950 transition-colors">FAQ</a>
        <a href="#pricing" class="hover:text-neutral-950 transition-colors">Pricing</a>
        <a href="#integrations" class="hover:text-neutral-950 transition-colors">MCP &amp; SDKs</a>
        <a href="/app" class="hover:text-neutral-950 transition-colors font-semibold text-neutral-950">Console &rarr;</a>
      </nav>

      <!-- Nav Action CTAs -->
      <div class="flex items-center gap-2 sm:gap-3">
        <button type="button" onclick="handleModalGuestAccess()" class="hidden sm:inline-block text-xs font-medium text-neutral-600 hover:text-neutral-950 px-3 py-1.5 transition-colors cursor-pointer">
          1-Click Demo
        </button>
        <button type="button" onclick="openAuthModal('signin')" class="text-xs font-medium text-neutral-600 hover:text-neutral-950 px-2.5 sm:px-3 py-1.5 transition-colors cursor-pointer">
          Log in
        </button>
        <button type="button" onclick="openAuthModal('signup')" id="navCtaBtn" class="text-xs font-semibold bg-neutral-950 hover:bg-neutral-800 text-white rounded-full px-3.5 sm:px-4 py-1.5 transition-colors shadow-xs cursor-pointer">
          Get started
        </button>

        <!-- Mobile Menu Toggle Button -->
        <button type="button" id="landingMobileNavBtn" onclick="toggleLandingMobileMenu()" class="md:hidden p-1.5 text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100 rounded-lg transition cursor-pointer ml-1" aria-label="Toggle navigation menu">
          <svg id="landingHamburgerIcon" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
          <svg id="landingCloseIcon" class="w-5 h-5 hidden" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    </div>

    <!-- Mobile Slide-Down Menu Drawer -->
    <div id="landingMobileMenu" class="hidden md:hidden border-b border-neutral-200 bg-white/98 backdrop-blur-md px-5 py-4 space-y-3 shadow-lg transition-all">
      <nav class="flex flex-col space-y-2 text-sm font-medium text-neutral-700">
        <a href="#overview" onclick="toggleLandingMobileMenu()" class="py-1.5 hover:text-neutral-950">Overview</a>
        <a href="#value" onclick="toggleLandingMobileMenu()" class="py-1.5 hover:text-neutral-950">Core Engine</a>
        <a href="#features" onclick="toggleLandingMobileMenu()" class="py-1.5 hover:text-neutral-950">Features</a>
        <a href="#comparison" onclick="toggleLandingMobileMenu()" class="py-1.5 hover:text-neutral-950 font-semibold">Benchmarks &amp; Comparison</a>
        <a href="#faq" onclick="toggleLandingMobileMenu()" class="py-1.5 hover:text-neutral-950">FAQ</a>
        <a href="#pricing" onclick="toggleLandingMobileMenu()" class="py-1.5 hover:text-neutral-950">Pricing</a>
        <a href="#integrations" onclick="toggleLandingMobileMenu()" class="py-1.5 hover:text-neutral-950">MCP &amp; SDKs</a>
        <a href="/benchmarks" class="py-1.5 hover:text-neutral-950">Benchmarks</a>
        <a href="/app" class="py-1.5 hover:text-neutral-950 flex items-center justify-between font-semibold">
          <span>Console Workspace</span>
          <span class="text-[10px] font-mono bg-neutral-100 px-2 py-0.5 rounded text-neutral-600">Active</span>
        </a>
      </nav>
      <div class="pt-3 border-t border-neutral-100 flex flex-col gap-2">
        <button type="button" onclick="handleModalGuestAccess(); toggleLandingMobileMenu();" class="w-full py-2.5 text-xs font-semibold border border-neutral-200 rounded-xl text-neutral-800 bg-neutral-50 hover:bg-neutral-100 transition cursor-pointer">
          1-Click Demo Console
        </button>
        <div class="grid grid-cols-2 gap-2">
          <button type="button" onclick="openAuthModal('signin'); toggleLandingMobileMenu();" class="py-2.5 text-xs font-semibold border border-neutral-200 rounded-xl text-neutral-800 hover:bg-neutral-50 transition cursor-pointer">
            Log in
          </button>
          <button type="button" onclick="openAuthModal('signup'); toggleLandingMobileMenu();" class="py-2.5 text-xs font-semibold bg-neutral-950 text-white rounded-xl hover:bg-neutral-800 transition cursor-pointer">
            Get started
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- MAIN EDITORIAL CONTENT -->
  <main class="flex-1">

    <!-- SECTION 3: HERO & PRODUCT PROMISE -->
    <section class="relative pt-10 sm:pt-16 pb-16 sm:pb-24 px-4 sm:px-6 max-w-6xl mx-auto overflow-hidden text-left" id="overview">

      <div class="relative z-10 max-w-4xl mx-auto">
        <!-- Primary Category Keyword Badge -->
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200 bg-white text-xs text-neutral-600 mb-4 shadow-2xs font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span class="font-bold text-neutral-900 tracking-wider">FASTEST WEB SEARCH API &amp; AI AGENT MEMORY · 330+ ANYCAST CITIES</span>
        </div>

        <!-- Display Headline (Optimized for High-Rank Developer & AI Search Terms) -->
        <h1 class="text-3xl sm:text-4xl md:text-[44px] lg:text-[48px] font-bold tracking-tight text-neutral-950 leading-[1.12] max-w-3xl">
          The World's Fastest <span class="font-serif font-bold italic text-neutral-950">Web Search API</span> &amp; Long-Term Memory for AI Agents
        </h1>

        <!-- Supporting Subheading (Rich in High-Intent Search Phrases) -->
        <p class="text-xs sm:text-sm md:text-[15px] text-neutral-500 max-w-2xl mt-3 sm:mt-4 leading-relaxed font-normal">
          UltraDemon equips autonomous AI agents, multi-agent swarms, and LLM applications with sub-15ms BM25 full-text edge web search, sub-15ms structured long-term memory recall, and native Model Context Protocol (MCP) server support across 330+ Anycast edge cities with zero third-party latency or data leakage.
        </p>

        <!-- Refined Minimalist Action Buttons -->
        <div class="mt-6 sm:mt-7 flex flex-wrap items-center gap-3">
          <button type="button" onclick="openAuthModal('signup')" class="inline-flex items-center justify-center bg-neutral-950 hover:bg-neutral-800 text-white rounded-full px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-tight transition-all shadow-xs hover:shadow active:scale-[0.98] cursor-pointer">
            Get started
          </button>
          <button type="button" onclick="handleModalGuestAccess()" class="inline-flex items-center justify-center border border-neutral-200/90 bg-white hover:bg-neutral-50 hover:border-neutral-300 text-neutral-800 hover:text-neutral-950 rounded-full px-5 sm:px-6 py-2.5 text-xs sm:text-sm font-semibold tracking-tight transition-all active:scale-[0.98] shadow-2xs cursor-pointer">
            1-Click Demo Console
          </button>
          <button type="button" onclick="openAuthModal('signin')" class="inline-flex items-center justify-center text-xs sm:text-sm font-medium text-neutral-600 hover:text-neutral-950 px-2 py-2.5 transition cursor-pointer">
            Sign In &rarr;
          </button>
        </div>
      </div>

      <!-- PANORAMIC FLOATING PRODUCT & SCIENTIFIC ARTIFACTS STAGE (LEFT-TILTED 3D PERSPECTIVE) -->
      <div class="hero-stage-tilt relative mt-10 sm:mt-14 text-left min-h-0 sm:min-h-[520px]">
        
        <!-- Continuous Drifting Scientific & Blueprint Artifacts (Hidden on small mobile to avoid overflow) -->
        <div class="absolute inset-0 pointer-events-none select-none overflow-hidden sm:overflow-visible hidden sm:block">
          
          <!-- Blueprint Circuit (Top Left Drift) -->
          <div class="drift-far absolute -left-10 -top-8 w-[280px] sm:w-[340px] h-[210px] rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur-xs p-2 shadow-sm opacity-50 z-0">
            ${BLUEPRINT_CIRCUIT_SVG}
          </div>

          <!-- Vintage 1982 Microcomputer CRT (Bottom Left Drift) -->
          <div class="drift-mid absolute left-4 bottom-2 w-[260px] sm:w-[320px] h-[220px] rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur-xs p-2 shadow-sm opacity-55 z-0">
            ${VINTAGE_TERMINAL_SVG}
          </div>

          <!-- Handwritten Math / BM25 Manuscript (Top Right Drift) -->
          <div class="drift-far absolute right-4 -top-8 w-[270px] sm:w-[330px] h-[220px] rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur-xs p-2 shadow-sm opacity-45 z-0">
            ${MATH_MANUSCRIPT_SVG}
          </div>

          <!-- Optics & Waveguide Technical Schematic (Bottom Right Drift) -->
          <div class="drift-mid absolute -right-8 bottom-6 w-[250px] sm:w-[310px] h-[200px] rounded-2xl border border-neutral-200/70 bg-white/60 backdrop-blur-xs p-2 shadow-sm opacity-50 z-0">
            ${TECHNICAL_SCHEMATIC_SVG}
          </div>
        </div>

        <!-- Central Layered Product Windows (Left-Tilted Focal Plane) -->
        <div class="relative z-10 max-w-4xl mx-auto">
          
          <!-- Base Window: Workspace Overview Master (macOS Framed with Real 4K Screenshot) -->
          <div class="drift-near window-frame hero-window-tilted shadow-xl sm:shadow-2xl">
            <!-- macOS Window Titlebar -->
            <div class="h-9 px-3 sm:px-4 bg-[#f8f8fa] border-b border-neutral-200/80 flex items-center justify-between select-none">
              <div class="flex items-center gap-2 min-w-0">
                <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f56] shrink-0"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e] shrink-0"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#27c93f] shrink-0"></span>
                <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon Logo" class="w-4 h-4 object-contain inline-block ml-1 shrink-0" />
                <span class="ml-1 font-mono text-[10px] sm:text-[11px] text-neutral-600 font-medium truncate">ultrademon-workspace — 330 Anycast PoPs · Active</span>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span class="font-mono text-[10px] sm:text-[11px] text-neutral-500 font-medium hidden xs:inline">0.8ms link</span>
              </div>
            </div>

            <!-- Real 4K Master Screenshot -->
            <div class="relative bg-neutral-950 overflow-hidden">
              <img src="/assets/demo/01_workspace_overview.webp" alt="UltraDemon Sovereign Workspace Master Screenshot" class="w-full h-auto block object-cover object-top max-h-[300px] sm:max-h-[540px]" fetchpriority="high" loading="eager">
            </div>
          </div>

          <!-- Overlapping Layered Window: UltraSearch Live Studio Result (Desktop Floating) -->
          <div class="drift-mid hero-card-studio hidden sm:block absolute -right-4 -bottom-8 md:-right-8 md:-bottom-10 w-[65%] md:w-[50%] lg:w-[46%] rounded-xl border border-neutral-200/90 bg-white shadow-2xl z-20 overflow-hidden">
            <div class="h-8 px-3.5 bg-[#fbfbfd] border-b border-neutral-200 flex items-center justify-between select-none">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon" class="w-3.5 h-3.5 object-contain ml-1" />
                <span class="ml-1 font-mono text-[10px] text-neutral-500 font-semibold truncate">UltraSearch Studio — Live Execution</span>
              </div>
              <span class="font-mono text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-bold font-num">11.4ms</span>
            </div>
            <div class="p-1 bg-white">
              <img src="/assets/demo/02_ultrasearch_live_result.webp" alt="UltraSearch Studio Live Result Screenshot" class="w-full h-auto block rounded-b-lg object-cover object-top max-h-[290px]">
            </div>
          </div>

          <!-- Overlapping Floating Live Memory Query Execution Card (Desktop Floating) -->
          <div class="drift-near hero-card-memory hidden lg:block absolute -left-8 -bottom-6 w-[310px] rounded-2xl border border-neutral-200/90 bg-white/95 backdrop-blur-md shadow-2xl z-30 p-4 space-y-3">
            <div class="flex items-center justify-between border-b border-neutral-100 pb-2">
              <div class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span class="font-mono text-[10px] text-emerald-800 font-bold uppercase">Edge Recall · fleet-alpha</span>
              </div>
              <span class="font-mono text-[10px] text-neutral-400">330 PoPs · &lt;15ms</span>
            </div>

            <div>
              <h4 class="font-bold text-xs text-neutral-950">Associative Agent Memory Retrieval</h4>
              <p class="text-[11px] text-neutral-500 mt-1 leading-snug">
                SQLite FTS5 BM25 ranked recall with temporal decay and relevance filtering.
              </p>
            </div>

            <!-- Terminal Recording Frame -->
            <div class="rounded-xl bg-neutral-950 p-2.5 text-neutral-300 font-mono text-[10px] space-y-1">
              <div class="flex items-center justify-between text-neutral-500 text-[9px] pb-1 border-b border-neutral-800">
                <span>Edge Query Trace</span>
                <span>status: 200</span>
              </div>
              <div class="text-emerald-400">&gt; ultrademon memory query &quot;consensus protocols&quot;</div>
              <div class="text-neutral-400">{ matched: 3, latency_ms: 11.2, rank: &quot;bm25&quot; }</div>
              <div class="text-emerald-400">&gt; 3 memory nodes loaded (0.011s)</div>
            </div>
          </div>

          <!-- Mobile-Optimized Stacked Evidence Cards (Visible on mobile only for rich conversion punch) -->
          <div class="sm:hidden mt-4 space-y-3">
            <!-- Mobile Studio Result Card -->
            <div class="rounded-xl border border-neutral-200/90 bg-white shadow-md overflow-hidden">
              <div class="h-8 px-3 bg-[#fbfbfd] border-b border-neutral-200 flex items-center justify-between select-none">
                <div class="flex items-center gap-1.5">
                  <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon" class="w-3.5 h-3.5 object-contain" />
                  <span class="font-mono text-[10px] text-neutral-600 font-semibold truncate">UltraSearch Studio — Live Execution</span>
                </div>
                <span class="font-mono text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-bold font-num">11.4ms</span>
              </div>
              <div class="p-1 bg-white">
                <img src="/assets/demo/02_ultrasearch_live_result.webp" alt="UltraSearch Studio Live Result Screenshot" class="w-full h-auto block rounded-b-lg object-cover object-top max-h-[190px]">
              </div>
            </div>

            <!-- Mobile Live Query Trace Card -->
            <div class="rounded-xl border border-neutral-200/90 bg-neutral-950 p-3 text-neutral-300 font-mono text-[10px] space-y-1 shadow-md">
              <div class="flex items-center justify-between text-neutral-500 text-[9px] pb-1 border-b border-neutral-800">
                <span class="text-emerald-400 font-bold">Edge Memory Trace · fleet-alpha</span>
                <span>status: 200</span>
              </div>
              <div class="text-emerald-400">&gt; ultrademon memory query &quot;consensus protocols&quot;</div>
              <div class="text-neutral-400">{ matched: 3, latency_ms: 11.2, rank: &quot;bm25&quot; }</div>
              <div class="text-emerald-400">&gt; 3 memory nodes loaded (0.011s)</div>
            </div>
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 4: TRUST / BUILT-FOR STRIP (Quiet, Editorial) -->
    <section class="py-14 border-y border-neutral-100 bg-[#fbfbfd]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-xs uppercase tracking-wider font-mono text-neutral-400 mb-6 font-semibold">Trusted edge fabric for autonomous agents and developer swarms</div>
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

    <!-- SECTION 6: FEATURE EVIDENCE GRID -->
    <section class="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100" id="features">
      <div class="text-left mb-12">
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Everything your autonomous agents need to <span class="font-serif font-bold italic text-neutral-950">remember and explore</span>
        </h2>
        <p class="text-neutral-600 text-sm sm:text-base mt-2 max-w-xl font-normal">
          Purpose-built for agent swarms and developer copilots that require sub-15ms memory lookups and sovereign web search without rate limits.
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
        <div class="text-xs uppercase tracking-wider font-mono text-neutral-400 mb-2 font-semibold">The Sovereign Knowledge Loop</div>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-[1.12]">
          From fleeting context to persistent intelligence.<br><span class="font-serif font-bold italic text-neutral-950">UltraDemon</span> closes the agent memory loop.
        </h2>
        <p class="text-neutral-600 text-base mt-3 max-w-xl font-normal">
          A sovereign edge architecture that transforms raw web crawls and user conversations into structured, durable knowledge nodes across your entire fleet.
        </p>
      </div>

      <!-- 4 Alternating Stages -->
      <div class="space-y-24">
        
        <!-- Stage 01: Ingest & Index (Text Left, Image Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-5 space-y-4">
            <span class="font-mono text-sm font-semibold text-neutral-400">01</span>
            <h3 class="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">Ingest &amp; Index</h3>
            <p class="text-sm text-neutral-600 leading-relaxed font-normal">
              UltraDemon ingests documentation, conversation turns, and unstructured knowledge into persistent SQLite FTS5 index partitions distributed across edge locations.
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
                  <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon" class="w-3.5 h-3.5 object-contain ml-1" />
                  <span class="ml-1 font-mono text-[10px] text-neutral-500 font-semibold">01 · Autonomous Context Ingestion &amp; BM25 Indexing</span>
                </div>
                <span class="font-mono text-[10px] text-neutral-400">Workspace Master</span>
              </div>
              <img src="/assets/demo/01_workspace_overview.webp" alt="Stage 01 Workspace Overview Screenshot" class="w-full h-auto block object-cover object-top max-h-[380px]" loading="lazy">
            </div>
          </div>
        </div>

        <!-- Stage 02: Search & Crawl (Image Left, Text Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-7 order-2 lg:order-1">
            <div class="window-frame">
              <div class="h-8 px-3.5 bg-[#f8f8fa] border-b border-neutral-200/80 flex items-center justify-between select-none">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon" class="w-3.5 h-3.5 object-contain ml-1" />
                  <span class="ml-1 font-mono text-[10px] text-neutral-500 font-semibold">02 · Sub-Millisecond Search &amp; Autonomous Web Crawl</span>
                </div>
                <span class="font-mono text-[9px] bg-emerald-50 text-emerald-800 border border-emerald-200 px-1.5 py-0.2 rounded font-bold">11.4ms p95</span>
              </div>
              <img src="/assets/demo/02_ultrasearch_live_result.webp" alt="Stage 02 Search Studio Screenshot" class="w-full h-auto block object-cover object-top max-h-[380px]" loading="lazy">
            </div>
          </div>

          <div class="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span class="font-mono text-sm font-semibold text-neutral-400">02</span>
            <h3 class="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">Search &amp; Crawl</h3>
            <p class="text-sm text-neutral-600 leading-relaxed font-normal">
              Agents trigger parallel BM25 queries and streaming edge crawls via HTMLRewriter. Queries return in under 15ms with clean markdown and verified source citations.
            </p>
            <div class="pt-2">
              <a href="#sandbox" class="text-xs font-bold text-neutral-950 hover:underline inline-flex items-center gap-1.5">
                <span>Test live search latency</span>
                <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
              </a>
            </div>
          </div>
        </div>

        <!-- Stage 03: Recall & Rank (Text Left, Image Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-5 space-y-4">
            <span class="font-mono text-sm font-semibold text-neutral-400">03</span>
            <h3 class="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">Recall &amp; Rank</h3>
            <p class="text-sm text-neutral-600 leading-relaxed font-normal">
              Recall long-term memories with temporal decay scoring, container scoping, and associative relevance filtering without polluting LLM context windows.
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
                  <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon" class="w-3.5 h-3.5 object-contain ml-1" />
                  <span class="ml-1 font-mono text-[10px] text-neutral-500 font-semibold">03 · Semantic Relevance &amp; Memory Pruning</span>
                </div>
                <span class="font-mono text-[10px] text-neutral-400">D1 SQLite FTS5</span>
              </div>
              <img src="/assets/demo/03_ultramemory_stored_memory.webp" alt="Stage 03 Stored Memory Screenshot" class="w-full h-auto block object-cover object-top max-h-[380px]" loading="lazy">
            </div>
          </div>
        </div>

        <!-- Stage 04: Persist & Scale (Image Left, Text Right) -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div class="lg:col-span-7 order-2 lg:order-1">
            <div class="window-frame">
              <div class="h-8 px-3.5 bg-[#f8f8fa] border-b border-neutral-200/80 flex items-center justify-between select-none">
                <div class="flex items-center gap-1.5">
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <span class="w-2 h-2 rounded-full bg-neutral-300"></span>
                  <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon" class="w-3.5 h-3.5 object-contain ml-1" />
                  <span class="ml-1 font-mono text-[10px] text-neutral-500 font-semibold">04 · Continuous Edge Sync &amp; Telemetry</span>
                </div>
                <span class="font-mono text-[9px] bg-neutral-900 text-white px-1.5 py-0.2 rounded font-bold">Active SLA 99.99%</span>
              </div>
              <img src="/assets/demo/04_telemetry_icp.webp" alt="Stage 04 Telemetry Screenshot" class="w-full h-auto block object-cover object-top max-h-[380px]" loading="lazy">
            </div>
          </div>

          <div class="lg:col-span-5 space-y-4 order-1 lg:order-2">
            <span class="font-mono text-sm font-semibold text-neutral-400">04</span>
            <h3 class="text-2xl sm:text-3xl font-bold text-neutral-950 tracking-tight">Persist &amp; Scale</h3>
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

    <!-- SECTION 9: INTEGRATIONS GRID -->
    <section class="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100" id="integrations">
      <div class="text-left max-w-2xl mb-12">
        <div class="text-xs uppercase tracking-wider font-mono text-neutral-400 mb-2 font-semibold">Ecosystem &amp; SDKs</div>
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Connect in seconds. Drop into your <span class="font-serif font-bold italic text-neutral-950">existing agent stack</span>
        </h2>
        <p class="text-neutral-600 text-sm sm:text-base mt-2 max-w-xl font-normal">
          UltraDemon drops into your workflow with native Model Context Protocol (MCP), Python SDK, and zero-install NPX CLI.
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
          <input type="text" id="liveSearchInput" value="autonomous agent memory recall with temporal decay" class="flex-1 px-4 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/50 text-xs sm:text-sm focus:outline-none focus:border-neutral-950 transition-colors font-mono" placeholder="Enter query...">
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

    <!-- SECTION: INDUSTRY BENCHMARK & ARCHITECTURAL COMPARISON MATRIX (World-Class SEO Content) -->
    <section class="py-20 px-4 sm:px-6 max-w-6xl mx-auto border-t border-neutral-100" id="comparison">
      <div class="text-left max-w-3xl mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200/90 bg-white text-xs text-neutral-600 mb-3 shadow-2xs font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-800">EMPIRICAL BENCHMARKS · 10,000 RUN AUDIT</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Web Search API &amp; AI Memory Benchmark Comparison
        </h2>
        <p class="text-sm sm:text-base text-neutral-500 mt-2 font-normal leading-relaxed">
          How UltraDemon compares against Tavily, Exa AI, Serper, and Pinecone/Mem0 across latency, architecture, edge locations, and developer costs.
        </p>
      </div>

      <!-- High-Density Comparison Table (Devin / Stripe Standard) -->
      <div class="overflow-x-auto border border-neutral-200/90 rounded-2xl bg-white shadow-2xs font-mono text-xs">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-neutral-50 border-b border-neutral-200 text-neutral-500 text-[11px] uppercase tracking-wider">
              <th class="p-4 font-bold">Metric / Capability</th>
              <th class="p-4 font-bold text-neutral-950 bg-neutral-100/70 border-x border-neutral-200">UltraDemon (Ours)</th>
              <th class="p-4 font-bold">Tavily Search</th>
              <th class="p-4 font-bold">Exa AI Search</th>
              <th class="p-4 font-bold">Serper / Google</th>
              <th class="p-4 font-bold">Pinecone / Mem0</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-neutral-100">
            <tr class="hover:bg-neutral-50/60 transition-colors">
              <td class="p-4 font-bold text-neutral-900 font-sans">
                Web Search Latency (P50)
                <span class="block text-[11px] text-neutral-400 font-normal">Real roundtrip for agent loops</span>
              </td>
              <td class="p-4 bg-emerald-50/40 border-x border-emerald-100 text-emerald-900 font-bold">
                11.8ms (Edge Anycast)
              </td>
              <td class="p-4 text-neutral-600">842ms (Cross-Cloud)</td>
              <td class="p-4 text-neutral-600">910ms (Cross-Cloud)</td>
              <td class="p-4 text-neutral-600">580ms (Cloud Hop)</td>
              <td class="p-4 text-neutral-400">N/A (No Web Search)</td>
            </tr>

            <tr class="hover:bg-neutral-50/60 transition-colors">
              <td class="p-4 font-bold text-neutral-900 font-sans">
                AI Agent Long-Term Memory
                <span class="block text-[11px] text-neutral-400 font-normal">Persistent structured recall</span>
              </td>
              <td class="p-4 bg-emerald-50/40 border-x border-emerald-100 text-emerald-900 font-bold">
                Sub-15ms SQLite FTS5
              </td>
              <td class="p-4 text-neutral-400">No (Search only)</td>
              <td class="p-4 text-neutral-400">No (Search only)</td>
              <td class="p-4 text-neutral-400">No (Search only)</td>
              <td class="p-4 text-neutral-600">120ms–300ms vector lookup</td>
            </tr>

            <tr class="hover:bg-neutral-50/60 transition-colors">
              <td class="p-4 font-bold text-neutral-900 font-sans">
                Model Context Protocol (MCP)
                <span class="block text-[11px] text-neutral-400 font-normal">Native MCP 2024-11-05 Server</span>
              </td>
              <td class="p-4 bg-emerald-50/40 border-x border-emerald-100 text-emerald-900 font-bold">
                Native HTTP + SSE (/mcp)
              </td>
              <td class="p-4 text-neutral-600">Community wrapper</td>
              <td class="p-4 text-neutral-400">No official server</td>
              <td class="p-4 text-neutral-400">None</td>
              <td class="p-4 text-neutral-400">None</td>
            </tr>

            <tr class="hover:bg-neutral-50/60 transition-colors">
              <td class="p-4 font-bold text-neutral-900 font-sans">
                Global Edge Topology
                <span class="block text-[11px] text-neutral-400 font-normal">Physical PoP distribution</span>
              </td>
              <td class="p-4 bg-emerald-50/40 border-x border-emerald-100 text-emerald-900 font-bold">
                330+ Anycast Cities
              </td>
              <td class="p-4 text-neutral-600">1–2 Cloud Regions</td>
              <td class="p-4 text-neutral-600">1 Cloud Region</td>
              <td class="p-4 text-neutral-600">Single Central Region</td>
              <td class="p-4 text-neutral-600">Centralized Clusters</td>
            </tr>

            <tr class="hover:bg-neutral-50/60 transition-colors">
              <td class="p-4 font-bold text-neutral-900 font-sans">
                Cold Start Overhead
                <span class="block text-[11px] text-neutral-400 font-normal">Seamless Summoning guarantee</span>
              </td>
              <td class="p-4 bg-emerald-50/40 border-x border-emerald-100 text-emerald-900 font-bold">
                0.00ms Pre-warmed V8
              </td>
              <td class="p-4 text-neutral-600">1.2s–3.5s</td>
              <td class="p-4 text-neutral-600">1.5s–4.0s</td>
              <td class="p-4 text-neutral-600">Variable</td>
              <td class="p-4 text-neutral-600">200ms–800ms</td>
            </tr>

            <tr class="hover:bg-neutral-50/60 transition-colors">
              <td class="p-4 font-bold text-neutral-900 font-sans">
                Error Rate &amp; Resilience SLA
                <span class="block text-[11px] text-neutral-400 font-normal">Self-healing circuit breaker</span>
              </td>
              <td class="p-4 bg-emerald-50/40 border-x border-emerald-100 text-emerald-900 font-bold">
                0.000% Dual-Tier Fallback
              </td>
              <td class="p-4 text-neutral-600">Standard 99.9%</td>
              <td class="p-4 text-neutral-600">Standard 99.9%</td>
              <td class="p-4 text-neutral-600">Standard 99.9%</td>
              <td class="p-4 text-neutral-600">Standard 99.9%</td>
            </tr>

            <tr class="hover:bg-neutral-50/60 transition-colors">
              <td class="p-4 font-bold text-neutral-900 font-sans">
                Pay-As-You-Go Pricing
                <span class="block text-[11px] text-neutral-400 font-normal">Per 100,000 API requests</span>
              </td>
              <td class="p-4 bg-emerald-50/40 border-x border-emerald-100 text-emerald-900 font-bold">
                $20 / 100k (Never expires)
              </td>
              <td class="p-4 text-neutral-600">$100 / 100k</td>
              <td class="p-4 text-neutral-600">$150 / 100k</td>
              <td class="p-4 text-neutral-600">$50–$100 / 100k</td>
              <td class="p-4 text-neutral-600">$70+ monthly min.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <!-- SECTION: FREQUENTLY ASKED QUESTIONS (Matching FAQPage Schema for Rich Snippets) -->
    <section class="py-20 px-4 sm:px-6 max-w-4xl mx-auto border-t border-neutral-100" id="faq">
      <div class="text-left mb-12">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200/90 bg-white text-xs text-neutral-600 mb-3 shadow-2xs font-mono">
          <span class="w-1.5 h-1.5 rounded-full bg-neutral-950"></span>
          <span class="text-[10px] uppercase font-bold tracking-wider text-neutral-800">FAQ · FREQUENTLY ASKED QUESTIONS</span>
        </div>
        <h2 class="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-950">
          Frequently Asked Questions: Web Search API, AI Agent Memory &amp; MCP
        </h2>
        <p class="text-sm sm:text-base text-neutral-500 mt-2 font-normal leading-relaxed">
          Everything developers, AI researchers, and agent engineers need to know about integrating UltraDemon into production agent fleets.
        </p>
      </div>

      <div class="space-y-4 text-left font-sans">
        <!-- FAQ 1 -->
        <div class="border border-neutral-200/90 rounded-2xl p-5 bg-white shadow-2xs space-y-2">
          <h3 class="text-base font-bold text-neutral-950">
            What is the fastest Web Search API for AI agents and LLM applications?
          </h3>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            UltraDemon is the fastest Web Search API for AI agents, delivering a median (P50) latency of 11.8ms on Cloudflare Workers Anycast edge across 330+ cities worldwide. Traditional web search APIs (such as Tavily, Exa, and Serper) incur 450ms–900ms cross-cloud routing hops. UltraDemon executes BM25 Porter-stemmed queries directly on edge isolates adjacent to calling agents, enabling real-time multi-step agent reasoning without network stalls.
          </p>
        </div>

        <!-- FAQ 2 -->
        <div class="border border-neutral-200/90 rounded-2xl p-5 bg-white shadow-2xs space-y-2">
          <h3 class="text-base font-bold text-neutral-950">
            How do autonomous AI agents store and recall long-term memory in UltraDemon?
          </h3>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            UltraDemon UltraMemory provides a 3-tier memory hierarchy: Tier 0 in-memory V8 isolate RAM for sub-0.05ms recall, Tier 1 Cloudflare KV hot cache for sub-9ms recall, and Tier 2 persistent D1 SQLite FTS5 for structured relational storage. Agents store facts, user preferences, entity graphs, and session notes via <code>POST /v1/memory</code> and recall them with sub-15ms BM25 ranking via <code>POST /v1/memory/query</code>.
          </p>
        </div>

        <!-- FAQ 3 -->
        <div class="border border-neutral-200/90 rounded-2xl p-5 bg-white shadow-2xs space-y-2">
          <h3 class="text-base font-bold text-neutral-950">
            What makes UltraDemon the best infrastructure for Agents AI &amp; multi-agent swarms?
          </h3>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            UltraDemon is purpose-built for Agents AI. It eliminates cold starts via Seamless Summoning (0.00ms cold start SLA), provides 0.000% error rate resilience through automated dual-tier circuit breakers, and offers a native Model Context Protocol (MCP) server for direct 1-click connection to Claude Desktop, Cursor, LangChain, and AutoGPT. Swarms share memory containers without cross-agent contamination or external API rate limits.
          </p>
        </div>

        <!-- FAQ 4 -->
        <div class="border border-neutral-200/90 rounded-2xl p-5 bg-white shadow-2xs space-y-2">
          <h3 class="text-base font-bold text-neutral-950">
            How does UltraDemon compare to Tavily, Exa AI, Serper, and Pinecone?
          </h3>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            UltraDemon is over 50x faster than Tavily (842ms) and Exa (910ms), clocking 11.8ms median edge search latency. Unlike Pinecone and Mem0, which charge high monthly minimums and average 120ms–300ms vector lookups, UltraDemon embeds SQLite FTS5 directly into edge workers at $20 for 100,000 requests with zero expiration.
          </p>
        </div>

        <!-- FAQ 5 -->
        <div class="border border-neutral-200/90 rounded-2xl p-5 bg-white shadow-2xs space-y-2">
          <h3 class="text-base font-bold text-neutral-950">
            What is the UltraDemon Model Context Protocol (MCP) server?
          </h3>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            UltraDemon provides a fully compliant native Model Context Protocol (MCP) server running at <code>https://ultrademon.site/mcp</code> (HTTP POST JSON-RPC 2.0) and <code>https://ultrademon.site/mcp/sse</code> (Server-Sent Events). It exposes 10 sovereign tools for web search, multi-hop research, memory storage, memory retrieval, web crawling, and key management directly into AI clients like Claude Desktop, Cursor, and Windsurf.
          </p>
        </div>

        <!-- FAQ 6 -->
        <div class="border border-neutral-200/90 rounded-2xl p-5 bg-white shadow-2xs space-y-2">
          <h3 class="text-base font-bold text-neutral-950">
            What is Seamless Summoning and how does it guarantee zero cold starts?
          </h3>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            Seamless Summoning is UltraDemon's edge pre-warming protocol that maintains active isolate keepalive pooling and TLS 1.3 0-RTT connections across 330+ Anycast edge data centers, guaranteeing zero cold starts (0.00ms SLA) and zero dropped requests (0.000% error rate SLA) for high-frequency AI agent loops.
          </p>
        </div>

        <!-- FAQ 7 -->
        <div class="border border-neutral-200/90 rounded-2xl p-5 bg-white shadow-2xs space-y-2">
          <h3 class="text-base font-bold text-neutral-950">
            How do I integrate UltraDemon with LangChain, AutoGPT, Claude, and Cursor?
          </h3>
          <p class="text-xs sm:text-sm text-neutral-600 leading-relaxed font-normal">
            Integration takes under 60 seconds. For Python, issue standard POST requests to <code>/v1/search</code> or <code>/v1/memory</code> with header <code>X-API-Key: ud_...</code>. For Claude Desktop or Cursor IDE, add <code>https://ultrademon.site/mcp/sse</code> to your <code>mcpServers</code> configuration JSON. Full copyable snippets are available in the Developer Console.
          </p>
        </div>
      </div>
    </section>

    <!-- SECTION: PRICING & TIERS (Token-Style Pay-Per-Request & Custom Business Tiers) -->
    <section id="pricing" class="py-24 sm:py-32 border-b border-neutral-100 bg-[#fbfbfd]">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        
        <!-- Header -->
        <div class="max-w-3xl mb-16 text-left">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-neutral-200/90 bg-white text-xs text-neutral-600 mb-4">
            <span class="w-1.5 h-1.5 rounded-full bg-neutral-950"></span>
            <span class="font-mono text-[11px] uppercase tracking-wider font-semibold text-neutral-800">USAGE-BASED PRICING</span>
          </div>
          <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 leading-tight">
            Pay per request. Zero monthly lock-in.
          </h2>
          <p class="text-base sm:text-lg text-neutral-600 mt-4 leading-relaxed max-w-2xl">
            UltraDemon runs on a token-style usage model. Pay for the exact queries and edge memory operations your agents execute—no recurring monthly subscriptions, no wasted seats, and credits never expire.
          </p>

          <div class="mt-6 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-neutral-200/90 text-xs font-mono text-neutral-700 shadow-2xs">
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            <span>1,000 free requests included for testing · Top up anytime</span>
          </div>
        </div>

        <!-- Pricing Grid (3 Clean Cards: $20 PAYG + 2 Custom Business Tiers) -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          
          <!-- Tier 1: Pay-As-You-Go ($20 / 100,000 Requests) -->
          <div class="relative bg-white rounded-2xl border-2 border-neutral-950 p-6 sm:p-8 flex flex-col justify-between shadow-xl ring-4 ring-neutral-950/5">
            <div class="absolute -top-3 right-6 bg-neutral-950 text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-xs">
              POPULAR · PAY AS YOU GO
            </div>
            <div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500">TOKEN-STYLE MODEL</span>
              <h3 class="text-xl sm:text-2xl font-bold text-neutral-950 mt-1">100,000 Requests</h3>
              <p class="text-xs text-neutral-500 mt-1 min-h-[36px]">For developers, startups, and autonomous agent builders. Buy credits on demand.</p>
              
              <div class="my-6 pb-6 border-b border-neutral-100">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-4xl sm:text-5xl font-bold font-num text-neutral-950">$20</span>
                  <span class="text-xs text-neutral-500 font-mono font-medium">/ 100k requests</span>
                </div>
                <div class="mt-1 text-[11px] font-mono text-emerald-800 font-semibold">$0.20 per 1,000 requests · Credits never expire</div>
              </div>

              <ul class="space-y-3 text-xs text-neutral-700 font-mono">
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>100,000 unified API requests</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Sub-15ms BM25 full-text edge search</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Persistent SQLite FTS5 agent memory</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>50 QPS burst limit across 330+ Anycast PoPs</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Claude, Cursor &amp; Codex MCP remote server</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Zero monthly fees · Top up anytime</span>
                </li>
              </ul>
            </div>

            <button onclick="openAuthModal('signup', 'payg')" class="w-full mt-8 py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs transition shadow-xs cursor-pointer active:scale-[0.98]">
              Get 100K Requests ($20)
            </button>
          </div>

          <!-- Tier 2: Business Scale (Custom Tier 1 for Businesses) -->
          <div class="devin-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-neutral-400 transition-all bg-white">
            <div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500">BUSINESS TIER 1</span>
              <h3 class="text-xl sm:text-2xl font-bold text-neutral-950 mt-1">Business Scale</h3>
              <p class="text-xs text-neutral-500 mt-1 min-h-[36px]">For high-concurrency agent swarms, production applications, and growing teams.</p>
              
              <div class="my-6 pb-6 border-b border-neutral-100">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-4xl sm:text-5xl font-bold font-num text-neutral-950">Custom</span>
                  <span class="text-xs text-neutral-500 font-mono font-medium">volume rate</span>
                </div>
                <div class="mt-1 text-[11px] font-mono text-neutral-500 font-semibold">Tiered volume discounts · Pooled team keys</div>
              </div>

              <ul class="space-y-3 text-xs text-neutral-700 font-mono">
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>High-volume request pools (1M - 100M+ reqs)</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>150+ QPS burst limit &amp; adaptive concurrency</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Dedicated memory namespaces &amp; higher storage</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Pooled organization keys &amp; consolidated invoicing</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Autonomous edge crawler with scheduled intervals</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Priority engineering support &amp; shared Slack channel</span>
                </li>
              </ul>
            </div>

            <button type="button" onclick="openAuthModal('signup', 'business')" class="w-full mt-8 py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs transition cursor-pointer active:scale-[0.98]">
              Get Business Tier
            </button>
          </div>

          <!-- Tier 3: Enterprise Sovereign (Custom Tier 2 for Businesses) -->
          <div class="devin-card rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-neutral-400 transition-all bg-white">
            <div>
              <span class="font-mono text-[10px] font-bold uppercase tracking-wider text-neutral-500">BUSINESS TIER 2</span>
              <h3 class="text-xl sm:text-2xl font-bold text-neutral-950 mt-1">Enterprise Sovereign</h3>
              <p class="text-xs text-neutral-500 mt-1 min-h-[36px]">For enterprise fleets requiring dedicated edge isolates, private VPCs, and 99.99% SLAs.</p>
              
              <div class="my-6 pb-6 border-b border-neutral-100">
                <div class="flex items-baseline gap-1.5">
                  <span class="text-4xl sm:text-5xl font-bold font-num text-neutral-950">Custom</span>
                  <span class="text-xs text-neutral-500 font-mono font-medium">contractual SLA</span>
                </div>
                <div class="mt-1 text-[11px] font-mono text-neutral-500 font-semibold">Dedicated Anycast sharding · Zero retention</div>
              </div>

              <ul class="space-y-3 text-xs text-neutral-700 font-mono">
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Unlimited requests with bespoke volume economics</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Dedicated Cloudflare PoP sharding &amp; isolated D1 clusters</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Private VPC peering &amp; sovereign on-prem deployment</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>99.99% uptime guarantee with contractual SLA</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>Dedicated Solutions Architect &amp; 24/7 hotline</span>
                </li>
                <li class="flex items-start gap-2.5">
                  <svg class="w-4 h-4 text-neutral-950 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  <span>SOC 2 Type II, HIPAA, and custom enterprise DPA</span>
                </li>
              </ul>
            </div>

            <button type="button" onclick="openAuthModal('signup', 'enterprise')" class="w-full mt-8 py-3 px-4 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold text-xs transition cursor-pointer active:scale-[0.98]">
              Get Enterprise Sovereign
            </button>
          </div>

        </div>

      </div>
    </section>

    <!-- SECTION 13: UNIFIED SOVEREIGN ACCESS & DIRECT EMAIL AUTH -->
    <section class="py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center" id="access">
      <div class="mb-8">
        <span class="text-xs font-mono uppercase tracking-widest text-neutral-400 font-semibold">DIRECT EDGE ACCESS</span>
        <h2 class="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-neutral-950 mt-2">
          Start building in seconds.<br><span class="font-serif font-bold italic text-neutral-950">Normal email sign-in. Zero friction.</span>
        </h2>
        <p class="text-xs sm:text-sm text-neutral-500 max-w-lg mx-auto mt-3 leading-relaxed">
          Provision your sovereign developer keys on Cloudflare Workers edge. Real email authentication backed by SQLite FTS5.
        </p>
      </div>

      <!-- Unified Auth Box directly on the Landing Page -->
      <div class="bg-white rounded-3xl border border-neutral-200/90 p-6 sm:p-8 shadow-xl max-w-md mx-auto text-left">
        <!-- Segmented Tab Switcher -->
        <div class="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl mb-5 text-xs font-semibold">
          <button type="button" id="inlineTabSignin" onclick="switchInlineAuthTab('signin')" class="py-2.5 rounded-lg transition cursor-pointer bg-neutral-950 text-white shadow-xs text-center">
            Sign In
          </button>
          <button type="button" id="inlineTabSignup" onclick="switchInlineAuthTab('signup')" class="py-2.5 rounded-lg transition cursor-pointer text-neutral-600 hover:text-black text-center">
            Create Account
          </button>
        </div>

        <!-- Dynamic Header & Subtitle -->
        <div class="mb-5">
          <h3 id="inlineAuthHeading" class="text-base font-bold text-neutral-950 font-sans">Sign In to UltraDemon</h3>
          <p id="inlineAuthSubtitle" class="text-xs text-neutral-500 mt-0.5">Enter your email and password to access your sovereign developer console</p>
        </div>

        <!-- Form -->
        <form id="inlineAuthForm" onsubmit="handleInlineAuthSubmit(event)" class="space-y-4 text-xs">
          <div>
            <label class="block text-[11px] font-sans text-neutral-600 uppercase tracking-wider mb-1.5 font-medium">Email address</label>
            <input type="email" id="inlineAuthEmail" required class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white focus:outline-none focus:border-neutral-950 transition-colors font-mono text-xs text-neutral-950" placeholder="name@company.com">
          </div>
          <div>
            <div class="flex items-center justify-between mb-1.5">
              <label class="block text-[11px] font-sans text-neutral-600 uppercase tracking-wider font-medium">Password</label>
              <span class="text-[10px] text-neutral-400 font-num">Min. 6 chars</span>
            </div>
            <input type="password" id="inlineAuthPassword" required minlength="6" class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white focus:outline-none focus:border-neutral-950 transition-colors font-mono text-xs text-neutral-950" placeholder="••••••••••••">
          </div>

          <div id="inlineConfirmPasswordRow" class="hidden">
            <label class="block text-[11px] font-sans text-neutral-600 uppercase tracking-wider mb-1.5 font-medium">Confirm Password</label>
            <input type="password" id="inlineAuthConfirmPassword" minlength="6" class="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 bg-neutral-50/70 focus:bg-white focus:outline-none focus:border-neutral-950 transition-colors font-mono text-xs text-neutral-950" placeholder="••••••••••••">
          </div>

          <div id="inlineAuthError" class="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs hidden font-medium"></div>
          <div id="inlineAuthSuccess" class="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs hidden font-medium"></div>

          <button type="submit" id="inlineAuthSubmitBtn" class="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold transition cursor-pointer shadow-xs text-xs">
            Sign In to Workspace
          </button>

          <div class="relative flex items-center justify-center my-3">
            <div class="border-t border-neutral-200 w-full"></div>
            <span class="bg-white px-2 text-[10px] uppercase font-mono text-neutral-400 absolute">or</span>
          </div>

          <!-- 1-Click Instant Guest Access -->
          <button type="button" onclick="handleModalGuestAccess()" id="inlineGuestBtn" class="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 font-semibold transition cursor-pointer text-xs shadow-2xs">
            Continue with 1-Click Demo Console
          </button>
        </form>

        <!-- Bottom Mode Toggle Prompt -->
        <div class="mt-4 text-center text-xs text-neutral-500" id="inlineAuthToggleContainer">
          <span id="inlineAuthTogglePrompt">Don't have an account?</span>
          <button type="button" id="inlineAuthToggleBtn" onclick="switchInlineAuthTab(inlineAuthMode === 'signin' ? 'signup' : 'signin')" class="font-semibold text-neutral-950 hover:underline cursor-pointer ml-1">
            Create Account
          </button>
        </div>

        <div class="mt-5 pt-4 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-num">
          <span>Cloudflare Edge Crypto SHA-256</span>
          <span>Instant Sovereign Recall</span>
        </div>
      </div>
    </section>

    <!-- SECTION 14: A LETTER FROM THE FOUNDER -->
    <section class="py-24 px-4 sm:px-6 border-t border-neutral-200/80 bg-[#fafafa]" id="letter">
      <div class="max-w-3xl mx-auto">
        
        <!-- Header Pill -->
        <div class="text-center mb-10">
          <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-neutral-200 text-neutral-600 text-[11px] font-mono uppercase tracking-widest font-semibold shadow-2xs">
            <span class="w-1.5 h-1.5 rounded-full bg-neutral-950"></span>
            <span>A Letter from the Founder</span>
          </span>
          <h2 class="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-950 mt-3 font-sans">
            Why we built UltraDemon.
          </h2>
        </div>

        <!-- Letter Card (Editorial Stationery / Parchment feel with Devin minimalist design) -->
        <div class="bg-white rounded-3xl border border-neutral-200/90 p-8 sm:p-14 shadow-xl relative overflow-hidden">
          
          <!-- Subtle Top Demon Head Watermark in corner -->
          <div class="absolute top-6 right-6 opacity-[0.05] pointer-events-none select-none">
            <img src="${ULTRADEMON_LOGO_URI}" alt="" class="w-28 h-28 object-contain" />
          </div>

          <!-- Date and Addressee -->
          <div class="font-mono text-xs text-neutral-400 uppercase tracking-wider mb-8 pb-4 border-b border-neutral-100 flex items-center justify-between">
            <span>Dispatched from Cloudflare Anycast Edge</span>
            <span class="font-num">San Francisco &middot; Worldwide</span>
          </div>

          <!-- Founder's Letter in Custom Handwriting Font -->
          <div class="font-handwriting text-xl sm:text-2xl md:text-[25px] leading-[1.8] sm:leading-[1.9] text-neutral-800 tracking-wide space-y-6 select-text">
            <p>
              Dear builder,
            </p>
            <p>
              When we started building autonomous agents, we quickly ran into a brutal reality: the modern AI infrastructure was never designed for speed.
            </p>
            <p>
              Every agent workflow was crawling. We found ourselves waiting 800 milliseconds for centralized search APIs hosted in Virginia, and another 300 milliseconds for cloud vector databases just to recall what an agent had learned ten seconds earlier. When an agent executes twenty tool calls in sequence, that latency tax turns into twenty seconds of dead waiting time. Agents cannot think or execute autonomously when their memory is throttled behind legacy cloud middleboxes.
            </p>
            <p>
              We built UltraDemon because we refused to accept that compromise.
            </p>
            <p>
              We moved everything to the edge. Sovereign SQLite FTS5 BM25 search, instant vector memory, and zero-cold-start pre-warmed V8 isolates running directly across 330+ Anycast edge cities worldwide. Sub-15ms response times. Zero third-party API rate limits. And native Model Context Protocol (MCP) server endpoints so your agents in Claude, Cursor, and Python can summon knowledge at the speed of thought.
            </p>
            <p>
              UltraDemon is built for developers who obsess over every millisecond and refuse to let infrastructure slow down their intelligence.
            </p>
            <p>
              Thank you for building the autonomous future with us.
            </p>
          </div>

          <!-- Sign-Off & Signature Block -->
          <div class="mt-12 pt-6 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <div class="font-handwriting text-2xl sm:text-3xl text-neutral-950 font-medium">
                Ansh Bhardwaj
              </div>
              <div class="text-xs font-mono text-neutral-500 mt-1">
                Founder &amp; Architect, UltraDemon OS
              </div>
              <div class="text-[11px] font-mono text-neutral-400 mt-0.5">
                anshbhardwaj.student@gmail.com
              </div>
            </div>

            <div class="flex items-center gap-3">
              <a href="/app" class="px-5 py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-semibold transition cursor-pointer shadow-xs inline-flex items-center gap-1.5 font-sans">
                <span>Enter Developer Console &rarr;</span>
              </a>
            </div>
          </div>

        </div>

      </div>
    </section>

  </main>

  <!-- SECTION 15: MULTI-COLUMN EDITORIAL FOOTER -->
  <footer class="border-t border-neutral-200 bg-[#fbfbfd] py-14 px-4 sm:px-6 text-xs text-neutral-600">
    <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-8">
      
      <!-- Brand Col -->
      <div class="col-span-2 space-y-3">
        <div class="flex items-center gap-2.5">
          <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon Logo" class="w-6 h-6 object-contain select-none shrink-0" />
          <span class="font-bold text-neutral-950 tracking-tight text-sm">UltraDemon OS</span>
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
        <div><a href="#letter" class="hover:text-neutral-950 transition-colors font-medium">Founder's Letter</a></div>
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
      <div class="flex items-center gap-2.5 mb-2">
        <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon Logo" class="w-7 h-7 object-contain select-none shrink-0" />
        <span class="font-bold text-base text-neutral-950 font-sans">UltraDemon OS</span>
      </div>
      <h3 id="modalAuthHeading" class="text-base font-bold text-neutral-950 font-sans">Sign In to UltraDemon</h3>
      <p id="modalAuthSubtitle" class="text-xs text-neutral-500 mt-0.5">Enter your email and password to access your workspace</p>

      <!-- Segmented Tab Switcher -->
      <div class="grid grid-cols-2 p-1 bg-neutral-100 rounded-xl my-4 text-xs font-semibold">
        <button type="button" id="modalTabSignin" onclick="window.switchAuthTab('signin')" class="py-2 rounded-lg transition cursor-pointer bg-neutral-950 text-white shadow-xs">
          Sign In
        </button>
        <button type="button" id="modalTabSignup" onclick="window.switchAuthTab('signup')" class="py-2 rounded-lg transition cursor-pointer text-neutral-600 hover:text-black">
          Create Account
        </button>
      </div>

      <!-- Plan Indicator (If Selected) -->
      <div id="modalPlanIndicator" class="hidden p-2 rounded-lg bg-neutral-50 border border-neutral-200 text-xs mb-3 flex items-center justify-between font-mono">
        <span class="text-neutral-500">Tier:</span>
        <span id="modalPlanName" class="font-bold text-neutral-900 uppercase">FREE</span>
      </div>

      <!-- Auth Form -->
      <form id="authModalForm" onsubmit="event.preventDefault(); window.handleAuthModalSubmit(event); return false;" class="space-y-3.5 text-xs">
        <div>
          <label class="block text-[11px] font-sans font-medium text-neutral-500 uppercase tracking-wider mb-1">Email address</label>
          <input type="email" id="modalAuthEmail" required class="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors font-sans" placeholder="agent@company.com">
        </div>
        <div>
          <label class="block text-[11px] font-sans font-medium text-neutral-500 uppercase tracking-wider mb-1">Password</label>
          <input type="password" id="modalAuthPassword" required minlength="6" class="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors font-sans" placeholder="••••••••">
        </div>

        <div id="modalConfirmPasswordRow" class="hidden">
          <label class="block text-[11px] font-sans font-medium text-neutral-500 uppercase tracking-wider mb-1">Confirm Password</label>
          <input type="password" id="modalAuthConfirmPassword" minlength="6" class="w-full px-3 py-2 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-950 transition-colors font-sans" placeholder="••••••••">
        </div>

        <div id="modalAuthError" class="text-red-600 text-[11px] hidden font-mono"></div>
        <div id="modalAuthSuccess" class="text-emerald-700 text-[11px] hidden font-mono"></div>

        <button type="button" onclick="window.handleAuthModalSubmit(event)" id="modalAuthSubmitBtn" class="w-full py-2.5 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white font-semibold transition-colors cursor-pointer shadow-xs">
          Sign In
        </button>

        <div class="relative flex items-center justify-center my-2.5">
          <div class="border-t border-neutral-200 w-full"></div>
          <span class="bg-white px-2 text-[10px] uppercase font-mono text-neutral-400 absolute">or</span>
        </div>

        <!-- 1-Click Instant Guest Access -->
        <button type="button" onclick="window.handleModalGuestAccess()" id="modalGuestBtn" class="w-full py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 font-semibold transition cursor-pointer text-xs shadow-2xs">
          Continue with 1-Click Demo Console
        </button>
      </form>

      <!-- Bottom Switcher Prompt -->
      <div class="mt-4 text-center text-xs text-neutral-500" id="modalAuthToggleContainer">
        <span id="modalAuthTogglePrompt">Don't have an account?</span>
        <button type="button" id="modalAuthToggleBtn" onclick="window.toggleAuthTab()" class="font-semibold text-neutral-950 hover:underline cursor-pointer ml-1">
          Create Account
        </button>
      </div>

      <div class="mt-4 text-center">
        <span class="text-[11px] text-neutral-400 font-sans">Edge-authenticated on Cloudflare Workers</span>
      </div>
    </div>
  </div>

  <!-- Client-Side Runtime Script -->
  <script>
    let currentUser = null;

    // Check existing session in localStorage
    function checkAuthSession() {
      try {
        const sess = localStorage.getItem('ultrademon_auth_session');
        const usr = localStorage.getItem('ultrademon_user');
        if (sess && usr) {
          currentUser = JSON.parse(usr);
          window.currentUser = currentUser;
          const navCta = document.getElementById('navCtaBtn');
          if (navCta) {
            navCta.innerText = 'Open Console';
            navCta.onclick = function() { window.location.href = '/app'; };
          }
        }
      } catch (err) {}
    }

    let inlineAuthMode = 'signin';
    window.switchInlineAuthTab = function(mode) {
      inlineAuthMode = mode === 'signup' ? 'signup' : 'signin';
      const isSign = inlineAuthMode === 'signin';
      const tabIn = document.getElementById('inlineTabSignin');
      const tabUp = document.getElementById('inlineTabSignup');
      const heading = document.getElementById('inlineAuthHeading');
      const subtitle = document.getElementById('inlineAuthSubtitle');
      const confirmRow = document.getElementById('inlineConfirmPasswordRow');
      const btn = document.getElementById('inlineAuthSubmitBtn');
      const prompt = document.getElementById('inlineAuthTogglePrompt');
      const toggleBtn = document.getElementById('inlineAuthToggleBtn');
      const err = document.getElementById('inlineAuthError');
      const succ = document.getElementById('inlineAuthSuccess');

      if (err) err.classList.add('hidden');
      if (succ) succ.classList.add('hidden');

      if (isSign) {
        if (tabIn) tabIn.className = 'py-2.5 rounded-lg transition cursor-pointer bg-neutral-950 text-white shadow-xs text-center';
        if (tabUp) tabUp.className = 'py-2.5 rounded-lg transition cursor-pointer text-neutral-600 hover:text-black text-center';
        if (heading) heading.innerText = 'Sign In to UltraDemon';
        if (subtitle) subtitle.innerText = 'Enter your email and password to access your sovereign developer console';
        if (confirmRow) confirmRow.classList.add('hidden');
        if (btn) btn.innerText = 'Sign In to Workspace';
        if (prompt) prompt.innerText = "Don't have an account?";
        if (toggleBtn) toggleBtn.innerText = 'Create Account';
      } else {
        if (tabIn) tabIn.className = 'py-2.5 rounded-lg transition cursor-pointer text-neutral-600 hover:text-black text-center';
        if (tabUp) tabUp.className = 'py-2.5 rounded-lg transition cursor-pointer bg-neutral-950 text-white shadow-xs text-center';
        if (heading) heading.innerText = 'Create Sovereign Account';
        if (subtitle) subtitle.innerText = 'Instant edge account setup across 330+ Cloudflare PoPs';
        if (confirmRow) confirmRow.classList.remove('hidden');
        if (btn) btn.innerText = 'Create Sovereign Account';
        if (prompt) prompt.innerText = 'Already have an account?';
        if (toggleBtn) toggleBtn.innerText = 'Sign In';
      }
    };

    async function handleInlineAuthSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      const email = document.getElementById('inlineAuthEmail').value.trim();
      const password = document.getElementById('inlineAuthPassword').value;
      const confirmEl = document.getElementById('inlineAuthConfirmPassword');
      const confirmPassword = confirmEl ? confirmEl.value : '';
      const err = document.getElementById('inlineAuthError');
      const succ = document.getElementById('inlineAuthSuccess');
      const btn = document.getElementById('inlineAuthSubmitBtn');

      if (err) err.classList.add('hidden');
      if (succ) succ.classList.add('hidden');

      if (!email || !password) {
        if (err) {
          err.innerText = 'Please enter both email and password';
          err.classList.remove('hidden');
        }
        return;
      }

      if (inlineAuthMode === 'signup' && confirmPassword && password !== confirmPassword) {
        if (err) {
          err.innerText = 'Passwords do not match';
          err.classList.remove('hidden');
        }
        return;
      }

      if (btn) { btn.disabled = true; btn.innerText = 'Connecting to edge...'; }

      try {
        const endpoint = inlineAuthMode === 'signup' ? '/v1/auth/signup' : '/v1/auth/signin';
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, plan: 'free' })
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
          succ.innerText = 'Authenticated! Launching workspace...';
          succ.classList.remove('hidden');
        }
        setTimeout(() => {
          window.location.href = '/app';
        }, 200);
      } catch (error) {
        if (err) {
          err.innerText = error.message || 'Authentication error';
          err.classList.remove('hidden');
          if (error.message && (error.message.includes('switch to Create Account') || error.message.includes('Incorrect password') || error.message.includes('not found') || error.message.includes('password'))) {
            const switchBtn = document.createElement('button');
            switchBtn.type = 'button';
            switchBtn.className = 'block mt-2 underline font-semibold text-neutral-900 cursor-pointer';
            switchBtn.innerText = 'Click here to Switch to Create Account / Set Password';
            switchBtn.onclick = function() { switchInlineAuthTab('signup'); };
            err.appendChild(switchBtn);
          }
        }
      } finally {
        if (btn) {
          btn.disabled = false;
          btn.innerText = inlineAuthMode === 'signin' ? 'Sign In to Workspace' : 'Create Sovereign Account';
        }
      }
    }
    window.handleInlineAuthSubmit = handleInlineAuthSubmit;

    function setBillingCycle() {}

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
          output.innerHTML = '// UltraDemon Anycast Response — ' + latency + 'ms roundtrip\\n' +
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

      // Dual-defense button event binding for modal
      var tabIn = document.getElementById('modalTabSignin');
      if (tabIn) tabIn.addEventListener('click', function(e) { if (e && e.preventDefault) e.preventDefault(); window.switchAuthTab('signin'); });
      var tabUp = document.getElementById('modalTabSignup');
      if (tabUp) tabUp.addEventListener('click', function(e) { if (e && e.preventDefault) e.preventDefault(); window.switchAuthTab('signup'); });
      var toggleBtn = document.getElementById('modalAuthToggleBtn');
      if (toggleBtn) toggleBtn.addEventListener('click', function(e) { if (e && e.preventDefault) e.preventDefault(); window.toggleAuthTab(); });
      var submitBtn = document.getElementById('modalAuthSubmitBtn');
      if (submitBtn) submitBtn.addEventListener('click', function(e) { if (e && e.preventDefault) e.preventDefault(); window.handleAuthModalSubmit(e); });
      var guestBtn = document.getElementById('modalGuestBtn');
      if (guestBtn) guestBtn.addEventListener('click', function(e) { if (e && e.preventDefault) e.preventDefault(); window.handleModalGuestAccess(); });

      // Auto-open auth modal if redirected from /login or /signup
      var params = new URLSearchParams(window.location.search);
      var authParam = params.get('auth');
      if (authParam === 'signin' || authParam === 'signup') {
        var modalPlan = params.get('plan') || 'free';
        window.openAuthModal(authParam, modalPlan);
        // Clean up URL
        try {
          var cleanUrl = window.location.pathname;
          if (window.location.hash) cleanUrl += window.location.hash;
          window.history.replaceState(null, '', cleanUrl);
        } catch (e) {}
      }

      if (window.location.hash === '#pricing' || window.location.pathname === '/pricing') {
        setTimeout(function() {
          var el = document.getElementById('pricing');
          if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    });
  </script>
</body>
</html>`;
}
