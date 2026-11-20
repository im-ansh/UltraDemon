// UltraDemon — Dedicated Legal Pages (Privacy Policy & Terms of Use)
// Sovereign Edge Platform, 100% Autonomous, Zero-Telemetry Architecture.
// Typography: Geist Sans, Michelangelus Bold Italic, Geist Mono.
// Strict Design Rule: NO EMOJIS ANYWHERE. Minimalist grey SVGs only.

import { MICHELANGELUS_BOLD_ITALIC_WOFF2_B64, MICHELANGELUS_REGULAR_WOFF2_B64, NB_INTERNATIONAL_PRO_WOFF2_B64 } from './font-data';
import { CUSTOM_CURSORS_CSS } from './cursors';
import { ULTRADEMON_LOGO_URI, ULTRADEMON_FAVICON_URI } from './logo-data';

function getLegalHeader(origin: string, activePage: 'privacy' | 'terms'): string {
  return `
  <!-- Navigation Header -->
  <header class="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <a href="/" class="flex items-center gap-2.5 group flex-shrink-0">
        <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon Logo" class="w-7 h-7 object-contain select-none shrink-0" />
        <span class="font-normal text-base tracking-tight text-neutral-950 flex items-center gap-1">
          ultrademon
          <span class="font-serif text-xs font-bold italic text-neutral-500">engine</span>
        </span>
      </a>

      <!-- Quick Links -->
      <nav class="hidden sm:flex items-center gap-5 md:gap-7 text-xs font-medium text-neutral-600">
        <a href="/#pricing" class="hover:text-black transition">Pricing</a>
        <a href="/#memory" class="hover:text-black transition flex items-center gap-1.5">
          <span>Memory</span>
          <span class="font-num text-[9px] bg-neutral-100 text-neutral-700 border border-neutral-300 px-1 py-0.2 rounded font-semibold">&lt;15ms</span>
        </a>
        <a href="/#search" class="hover:text-black transition">Search</a>
        <a href="/#benchmarks" class="hover:text-black transition">Benchmarks</a>
        <a href="/privacy" class="hover:text-black transition ${activePage === 'privacy' ? 'text-black font-semibold' : ''}">Privacy</a>
        <a href="/terms" class="hover:text-black transition ${activePage === 'terms' ? 'text-black font-semibold' : ''}">Terms</a>
      </nav>

      <!-- Auth Actions -->
      <div class="flex items-center gap-3">
        <a href="/login" class="px-3 py-1.5 text-xs font-medium text-neutral-700 hover:text-black transition">
          Sign In
        </a>
        <a href="/signup" class="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-black text-white hover:bg-neutral-800 transition shadow-xs">
          Create Account
        </a>
      </div>
    </div>
  </header>
  `;
}

function getLegalFooter(): string {
  return `
  <!-- Footer -->
  <footer class="border-t border-neutral-200 bg-neutral-50/60 py-12 text-xs text-neutral-500 font-num">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div>
        <span>UltraDemon Platform · Cloudflare Workers Edge + D1 SQLite FTS5</span>
      </div>
      <div class="flex items-center gap-6">
        <a href="/#pricing" class="hover:text-black transition">Pricing</a>
        <a href="/privacy" class="hover:text-black transition">Privacy Policy</a>
        <a href="/terms" class="hover:text-black transition">Terms of Use</a>
        <a href="/openapi.json" target="_blank" class="hover:text-black transition">/openapi.json</a>
        <a href="https://github.com/im-ansh/UltraDemon" target="_blank" class="hover:text-black transition">GitHub</a>
      </div>
    </div>
  </footer>
  `;
}

export function renderPrivacyPage(origin: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy — UltraDemon Sovereign Edge Platform</title>
  <meta name="description" content="UltraDemon Privacy Policy. Sovereign autonomous engine architecture ensuring zero third-party data leakage and complete data ownership.">
  <link rel="canonical" href="https://ultrademon.site/privacy">
  <meta name="robots" content="index, follow">
  <link rel="icon" type="image/png" href="${ULTRADEMON_FAVICON_URI}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
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
    }
    .font-serif {
      font-family: 'Michelangelus', Georgia, serif;
    }
    .font-num {
      font-family: 'Geist Mono', monospace;
      font-variant-numeric: tabular-nums;
    }
    ${CUSTOM_CURSORS_CSS}
  </style>
  
  <!-- Vercel Web Analytics -->
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body class="min-h-screen bg-white text-neutral-950 flex flex-col justify-between selection:bg-black selection:text-white">

  ${getLegalHeader(origin, 'privacy')}

  <main class="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
    
    <!-- Hero / Title -->
    <div class="mb-10 pb-8 border-b border-neutral-200">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 font-num mb-4">
        <span class="w-1.5 h-1.5 rounded-full bg-black"></span>
        <span>SOVEREIGN ARCHITECTURE GUARANTEE</span>
        <span class="text-neutral-400">/</span>
        <span>VERSION 2.0</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-normal tracking-tight text-neutral-950 mb-3">
        Privacy Policy &amp; <span class="font-serif font-bold italic">Zero-Telemetry</span> Policy
      </h1>
      <p class="text-sm text-neutral-600 font-sans leading-relaxed">
        Last updated: November 2026. This policy governs how UltraDemon manages, isolates, and protects data across our global Cloudflare Workers edge nodes, D1 SQLite FTS5 database, and sovereign search index.
      </p>
    </div>

    <!-- Legal Sections -->
    <div class="space-y-10 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      
      <!-- Section 1 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">01</span>
          <span>Core Privacy Architecture &amp; Sovereign Guarantee</span>
        </h2>
        <p>
          Unlike centralized search engines and vector storage providers (e.g. OpenAI, Pinecone, Google), UltraDemon is engineered from the ground up on <strong>Cloudflare Anycast edge nodes across 330+ cities worldwide</strong>.
        </p>
        <p>
          We operate under a strict <strong>Zero-Telemetry Policy</strong>:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-neutral-600">
          <li>We do <strong>not sell, broker, or monetize</strong> developer or agent queries.</li>
          <li>We do <strong>not train foundational AI models</strong> on customer memory records, scraped documents, or conversation contexts.</li>
          <li>We do <strong>not track user identities</strong> across external websites or maintain behavioral advertising profiles.</li>
          <li>All BM25 query evaluations run ephemerally inside localized V8 isolates at the nearest edge PoP.</li>
        </ul>
      </section>

      <!-- Section 2 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">02</span>
          <span>Customer Memory Data &amp; SQLite FTS5 Storage</span>
        </h2>
        <p>
          When you store agent facts, preferences, entities, rules, or document chunks via <code class="px-1.5 py-0.5 rounded bg-neutral-100 font-num text-xs text-neutral-900">POST /v1/memory</code>:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-neutral-600">
          <li><strong>Tenant Isolation:</strong> Every memory row is cryptographically mapped to your unique <code class="px-1 py-0.5 bg-neutral-100 rounded text-xs font-num">user_id</code> and optional <code class="px-1 py-0.5 bg-neutral-100 rounded text-xs font-num">container_tag</code>. No cross-tenant access is permissible under any circumstances.</li>
          <li><strong>Storage Engine:</strong> Memories are persisted in SQLite D1 databases using compiled C FTS5 with BM25 ranking. Data is encrypted at rest using Cloudflare enterprise-grade encryption.</li>
          <li><strong>Right to Erasure &amp; Portability:</strong> Developers retain unconditional rights to delete single memories (<code class="px-1 py-0.5 bg-neutral-100 rounded text-xs font-num">DELETE /v1/memory/:id</code>) or wipe entire containers (<code class="px-1 py-0.5 bg-neutral-100 rounded text-xs font-num">DELETE /v1/memory?container_tag=:tag</code>). Deletions propagate immediately.</li>
        </ul>
      </section>

      <!-- Section 3 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">03</span>
          <span>Account Registration &amp; Mandatory Email Verification</span>
        </h2>
        <p>
          To maintain network integrity, prevent automated spam, and protect our edge crawler infrastructure, <strong>email verification via confirmation link is mandatory</strong> for all new developer accounts.
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-neutral-600">
          <li>Upon registration, an activation link is delivered to the provided email address via Supabase Auth.</li>
          <li>Developer consoles, production API key generation, and workspace sessions remain inactive until the verification link is confirmed.</li>
          <li>Passwords are securely hashed using Web Crypto SHA-256 with unique per-user salts. We never store plaintext passwords.</li>
        </ul>
      </section>

      <!-- Section 4 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">04</span>
          <span>API Key Security &amp; Scope Isolation</span>
        </h2>
        <p>
          UltraDemon utilizes cryptographically scoped API keys:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-neutral-600">
          <li><strong>UltraMemory Keys (<code class="px-1 py-0.5 bg-neutral-100 rounded font-num text-xs">um_*</code>):</strong> Restricted strictly to agent memory ingestion and recall. Denied access on all search and crawl endpoints.</li>
          <li><strong>UltraSearch Keys (<code class="px-1 py-0.5 bg-neutral-100 rounded font-num text-xs">us_*</code>):</strong> Restricted strictly to web search queries. Denied access on memory storage and recall.</li>
          <li><strong>Plaintext Keys:</strong> Displayed once upon creation and stored exclusively as SHA-256 hashes in Cloudflare D1 and KV.</li>
        </ul>
      </section>

      <!-- Section 5 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">05</span>
          <span>Zero Tracking &amp; Cookies</span>
        </h2>
        <p>
          UltraDemon uses no third-party tracking cookies, behavioral analytics SDKs, or external advertising scripts. Client sessions are managed via standard <code class="px-1 py-0.5 bg-neutral-100 rounded font-num text-xs">Authorization: Bearer &lt;token&gt;</code> headers and local browser storage.
        </p>
      </section>

      <!-- Section 6 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">06</span>
          <span>Contact &amp; Data Protection Officer</span>
        </h2>
        <p>
          For privacy inquiries, audit requests, or data deletion confirmations, reach our team via our public repository:
          <a href="https://github.com/im-ansh/UltraDemon" target="_blank" class="text-black font-semibold underline decoration-neutral-300 hover:decoration-black">github.com/im-ansh/UltraDemon</a>.
        </p>
      </section>

    </div>
  </main>

  ${getLegalFooter()}

</body>
</html>`;
}

export function renderTermsPage(origin: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Use — UltraDemon Sovereign Edge Platform</title>
  <meta name="description" content="UltraDemon Terms of Use and API Service Agreement. Transparent developer billing at $20 per 100,000 API requests.">
  <link rel="canonical" href="https://ultrademon.site/terms">
  <meta name="robots" content="index, follow">
  <link rel="icon" type="image/png" href="${ULTRADEMON_FAVICON_URI}">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
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
    }
    .font-serif {
      font-family: 'Michelangelus', Georgia, serif;
    }
    .font-num {
      font-family: 'Geist Mono', monospace;
      font-variant-numeric: tabular-nums;
    }
    ${CUSTOM_CURSORS_CSS}
  </style>
  
  <!-- Vercel Web Analytics -->
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body class="min-h-screen bg-white text-neutral-950 flex flex-col justify-between selection:bg-black selection:text-white">

  ${getLegalHeader(origin, 'terms')}

  <main class="flex-1 max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 w-full">
    
    <!-- Hero / Title -->
    <div class="mb-10 pb-8 border-b border-neutral-200">
      <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-100 border border-neutral-200 text-xs text-neutral-700 font-num mb-4">
        <span class="w-1.5 h-1.5 rounded-full bg-black"></span>
        <span>DEVELOPER PLATFORM AGREEMENT</span>
        <span class="text-neutral-400">/</span>
        <span>VERSION 2.0</span>
      </div>
      <h1 class="text-3xl sm:text-4xl font-normal tracking-tight text-neutral-950 mb-3">
        Terms of <span class="font-serif font-bold italic">Use</span> &amp; Service Agreement
      </h1>
      <p class="text-sm text-neutral-600 font-sans leading-relaxed">
        Last updated: November 2026. Please review these Terms of Use carefully prior to deploying API keys, agent memory containers, or web search queries on the UltraDemon platform.
      </p>
    </div>

    <!-- Legal Sections -->
    <div class="space-y-10 text-xs sm:text-sm text-neutral-700 leading-relaxed">
      
      <!-- Section 1 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">01</span>
          <span>Acceptance &amp; Platform Scope</span>
        </h2>
        <p>
          By creating an account, provisioning API keys, or querying endpoints on <code class="px-1.5 py-0.5 rounded bg-neutral-100 font-num text-xs text-neutral-900">ultrademon.ai</code> or our Cloudflare Workers edge nodes, you agree to be bound by these Terms of Use. If you do not agree, do not access or use the platform.
        </p>
      </section>

      <!-- Section 2 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">02</span>
          <span>Account Registration &amp; Mandatory Verification</span>
        </h2>
        <p>
          You must provide an accurate, authorized email address when creating an account. 
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-neutral-600">
          <li><strong>Mandatory Verification:</strong> You must complete email verification by clicking the confirmation link sent to your inbox before your account is activated for workspace sessions or API key generation.</li>
          <li><strong>Credential Confidentiality:</strong> You are strictly responsible for maintaining the confidentiality of your API keys and tokens. Any requests made with your provisioned API keys are attributed to your account.</li>
        </ul>
      </section>

      <!-- Section 3 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">03</span>
          <span>Customer Data Ownership &amp; Intellectual Property</span>
        </h2>
        <p>
          You retain <strong>100% intellectual property ownership</strong> of all data submitted to UltraDemon:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-neutral-600">
          <li>All agent memories, documents, embeddings, guidelines, facts, and conversation transcripts remain your exclusive property.</li>
          <li>UltraDemon acquires no proprietary license, ownership claim, or training right over your data.</li>
          <li>You may export or permanently delete your stored memories at any time via our standard REST endpoints.</li>
        </ul>
      </section>

      <!-- Section 4 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">04</span>
          <span>Rate Limits, Quotas &amp; Subscription Tiers</span>
        </h2>
        <p>
          Access to UltraSearch and UltraMemory is governed by plan quotas:
        </p>
        <ul class="list-disc pl-5 space-y-1.5 text-neutral-600">
          <li><strong>Free Tier:</strong> 100 requests / day, up to 10 results per query.</li>
          <li><strong>Pro Tier ($29/mo):</strong> 10,000 requests / day, 25 results per query.</li>
          <li><strong>Ultra Tier ($99/mo):</strong> 100,000 requests / day, 50 results per query, real-time image &amp; news indexing.</li>
          <li><strong>Enterprise Tier ($499/mo):</strong> Unlimited requests, 100 results per query, dedicated D1 database replication.</li>
        </ul>
        <p>
          Automated rate limit enforcement is managed via Cloudflare Durable Objects. Requests exceeding plan quotas will return <code class="px-1.5 py-0.5 rounded bg-neutral-100 font-num text-xs">HTTP 429 Too Many Requests</code>.
        </p>
      </section>

      <!-- Section 5 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">05</span>
          <span>Acceptable Use &amp; Prohibited Activities</span>
        </h2>
        <p>You agree not to use UltraDemon to:</p>
        <ul class="list-disc pl-5 space-y-1.5 text-neutral-600">
          <li>Conduct denial of service (DoS) attacks or intentionally degrade edge network performance.</li>
          <li>Circumvent API key scoping restrictions or tamper with authentication headers.</li>
          <li>Submit malicious payloads, zero-day exploits, or malware to the streaming crawler.</li>
          <li>Violate third-party intellectual property rights or applicable telecommunication laws.</li>
        </ul>
      </section>

      <!-- Section 6 -->
      <section class="space-y-3">
        <h2 class="text-base sm:text-lg font-semibold text-neutral-950 flex items-center gap-2">
          <span class="font-num text-xs px-2 py-0.5 rounded bg-neutral-100 text-neutral-800 font-bold">06</span>
          <span>Service Availability &amp; Disclaimer of Warranties</span>
        </h2>
        <p>
          UltraDemon is provided on an "as is" and "as available" basis. While our edge network operates with high redundancy across 330+ Cloudflare PoPs, we do not warrant uninterrupted operation or zero error rates under all network partition scenarios.
        </p>
      </section>

    </div>
  </main>

  ${getLegalFooter()}

</body>
</html>`;
}
