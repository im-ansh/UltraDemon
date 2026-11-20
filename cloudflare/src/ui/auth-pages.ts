// UltraDemon — Dedicated Login, Sign-Up & Verification Callback UI
// Light Canvas (#f7f7f7) & Monochrome. Zero gradients.
// Typography: Michelangelus Bold Italic (WOFF2 Data URI), Geist Sans, Geist Mono.
// Strict Design Rule: NO EMOJIS ANYWHERE. Minimalist grey SVGs only.

import { MICHELANGELUS_BOLD_ITALIC_WOFF2_B64, MICHELANGELUS_REGULAR_WOFF2_B64, NB_INTERNATIONAL_PRO_WOFF2_B64, NB_INTERNATIONAL_PRO_LIGHT_WOFF2_B64 } from './font-data';
import { CUSTOM_CURSORS_CSS } from './cursors';
import { ULTRADEMON_LOGO_URI, ULTRADEMON_FAVICON_URI } from './logo-data';

export function renderAuthPage(initialMode: 'login' | 'signup', origin: string, supabaseUrl: string, supabaseAnonKey: string): string {
  const isLogin = initialMode === 'login';

  return `<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isLogin ? 'Sign In' : 'Create Account'} — UltraDemon Platform</title>
  <link rel="icon" type="image/png" href="${ULTRADEMON_FAVICON_URI}">
  
  <script src="https://cdn.tailwindcss.com"></script>
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
    .hidden {
      display: none !important;
    }
    * {
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    html, body, button, input, textarea, select, h1, h2, h3, h4, h5, h6, p, span, div, a, li, tr, td, th, table, nav, aside, header, footer, main, section, label, form, dialog {
      font-family: 'NB International Pro', 'NB International', 'nbinternational', -apple-system, BlinkMacSystemFont, sans-serif;
      font-synthesis: weight style;
    }
    body {
      background-color: #f7f7f7;
      color: #09090b;
    }
    .font-sans {
      font-family: 'NB International Pro', 'NB International', 'nbinternational', -apple-system, BlinkMacSystemFont, sans-serif !important;
      font-synthesis: weight style;
    }
    .font-serif {
      font-family: 'Michelangelus', Georgia, serif;
    }
    .font-num, .font-mono, code, pre, kbd {
      font-family: 'Geist Mono', monospace !important;
      font-variant-numeric: tabular-nums;
    }

    /* Shimmering Skeleton Loaders */
    @keyframes skeleton-shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    .skeleton {
      background: linear-gradient(90deg, #f1f1f4 25%, #e4e4e9 50%, #f1f1f4 75%);
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.5s ease-in-out infinite;
      border-radius: 6px;
      display: inline-block;
    }
    .skeleton-dark {
      background: linear-gradient(90deg, #1c1c20 25%, #2d2d32 50%, #1c1c20 75%);
      background-size: 200% 100%;
      animation: skeleton-shimmer 1.5s ease-in-out infinite;
      border-radius: 6px;
      display: inline-block;
    }

    ${CUSTOM_CURSORS_CSS}
  </style>
  
  <!-- Vercel Web Analytics -->
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body class="min-h-screen bg-[#f7f7f7] text-neutral-950 flex flex-col justify-between selection:bg-black selection:text-white">

  <!-- Top Simple Navigation -->
  <header class="p-6 border-b border-neutral-100 flex items-center justify-between max-w-5xl mx-auto w-full">
    <a href="/" class="flex items-center gap-2.5 group">
      <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon Logo" class="w-7 h-7 object-contain select-none shrink-0" />
      <span class="font-normal text-base tracking-tight text-neutral-950 flex items-center gap-1">
        ultrademon
        <span class="font-serif text-xs font-bold italic text-neutral-500">engine</span>
      </span>
    </a>

    <div class="flex items-center gap-6 text-xs text-neutral-500">
      <a href="/privacy" class="hover:text-black transition">Privacy</a>
      <a href="/terms" class="hover:text-black transition">Terms</a>
      <a href="/" class="hover:text-black font-medium transition flex items-center gap-1.5">
        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path stroke-linecap="round" stroke-linejoin="round" d="m15 19-7-7 7-7"/></svg>
        <span>Back to Website</span>
      </a>
    </div>
  </header>

  <!-- Auth Card Container -->
  <main class="flex-1 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-8 shadow-xs">
      
      <!-- Brand Header -->
      <div class="text-center mb-8">
        <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon Logo" class="w-12 h-12 object-contain mx-auto mb-3 select-none" />
        <h1 id="pageTitle" class="text-2xl font-normal tracking-tight text-neutral-950">
          ${isLogin ? 'Sign in to <span class="font-serif font-bold italic">UltraDemon</span>' : 'Create your <span class="font-serif font-bold italic">UltraDemon</span> account'}
        </h1>
        <p id="pageSubtitle" class="text-xs text-neutral-500 mt-1">
          ${isLogin ? 'Enter your credentials to access your developer console' : 'Instant edge account setup with mandatory email verification'}
        </p>
      </div>

      <!-- Mode Switcher Tabs -->
      <div id="tabSwitcher" class="grid grid-cols-2 gap-1 p-1 bg-neutral-100 rounded-xl mb-6 text-xs font-semibold">
        <button 
          id="tabSignIn" 
          onclick="setAuthMode('signin')" 
          class="py-2 rounded-lg transition cursor-pointer ${isLogin ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'}"
        >
          Sign In
        </button>
        <button 
          id="tabSignUp" 
          onclick="setAuthMode('signup')" 
          class="py-2 rounded-lg transition cursor-pointer ${!isLogin ? 'bg-black text-white shadow-xs' : 'text-neutral-600 hover:text-black'}"
        >
          Create Account
        </button>
      </div>

      <!-- Plan Indicator (If Selected) -->
      <div id="planBanner" class="hidden p-3 rounded-xl bg-neutral-50 border border-neutral-200 text-xs mb-4 flex items-center justify-between font-num">
        <span class="text-neutral-500">Selected Tier:</span>
        <span id="planName" class="font-bold text-neutral-950 uppercase px-2 py-0.5 bg-neutral-200 rounded text-[11px]">PRO</span>
      </div>

      <!-- Dedicated Verification Notice Box (Shown when email verification is pending) -->
      <div id="verifyNoticeCard" class="hidden p-6 rounded-2xl bg-neutral-50 border border-neutral-200 text-center space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-black text-white mx-auto flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </div>
        <div>
          <h2 class="text-base font-semibold text-neutral-950">Verify your email address</h2>
          <p class="text-xs text-neutral-600 mt-1.5 leading-relaxed">
            We've sent a verification link to <strong id="verifyTargetEmail" class="text-neutral-950 font-semibold font-num"></strong>.
          </p>
          <p class="text-xs text-neutral-500 mt-1 leading-relaxed">
            Please click the link in your email to verify your address and activate your sovereign workspace.
          </p>
        </div>

        <div id="resendStatus" class="hidden p-2.5 rounded-lg text-xs font-medium font-num"></div>

        <div class="space-y-2 pt-2">
          <button 
            type="button" 
            onclick="handleResendVerification()" 
            id="resendBtn"
            class="w-full py-2.5 px-4 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Resend Verification Link</span>
          </button>
          <button 
            type="button" 
            onclick="setAuthMode('signin'); document.getElementById('verifyNoticeCard').classList.add('hidden'); document.getElementById('authForm').classList.remove('hidden');" 
            class="w-full py-2 px-4 border border-neutral-200 hover:bg-neutral-100 text-neutral-700 font-medium text-xs rounded-xl transition cursor-pointer"
          >
            Return to Sign In
          </button>
        </div>
      </div>

      <!-- OAuth Social Sign In Providers -->
      <div class="space-y-2.5">
        <button 
          type="button" 
          onclick="handleOAuthSignIn('google'); return false;"
          id="btnOAuthGoogle"
          class="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 font-medium text-xs rounded-xl transition shadow-2xs flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <svg class="w-4 h-4 shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Continue with Google</span>
        </button>

        <button 
          type="button" 
          onclick="handleOAuthSignIn('github'); return false;"
          id="btnOAuthGithub"
          class="w-full py-2.5 px-4 bg-white hover:bg-neutral-50 text-neutral-900 border border-neutral-200 font-medium text-xs rounded-xl transition shadow-2xs flex items-center justify-center gap-2.5 cursor-pointer"
        >
          <svg class="w-4 h-4 shrink-0 fill-current" viewBox="0 0 24 24">
            <path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
          </svg>
          <span>Continue with GitHub</span>
        </button>
      </div>

      <div class="relative flex items-center justify-center my-3">
        <div class="border-t border-neutral-200 w-full"></div>
        <span class="bg-white px-2 text-[10px] uppercase font-mono text-neutral-400 absolute">or with email</span>
      </div>

      <!-- Auth Form -->
      <form id="authForm" onsubmit="event.preventDefault(); handleFormSubmit(event); return false;" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-neutral-700 mb-1.5">Email address</label>
          <input 
            type="email" 
            id="authEmail" 
            placeholder="name@company.com" 
            required 
            class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-xs placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition"
          />
        </div>

        <div>
          <div class="flex items-center justify-between mb-1.5">
            <label class="block text-xs font-medium text-neutral-700">Password</label>
            <span class="text-[11px] text-neutral-400 font-num">Min. 6 chars</span>
          </div>
          <input 
            type="password" 
            id="authPassword" 
            placeholder="••••••••••••" 
            required 
            minlength="6"
            class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-xs placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition"
          />
        </div>

        <div id="confirmPasswordRow" class="${isLogin ? 'hidden' : ''}">
          <label class="block text-xs font-medium text-neutral-700 mb-1.5">Confirm Password</label>
          <input 
            type="password" 
            id="authConfirmPassword" 
            placeholder="••••••••••••" 
            minlength="6"
            class="w-full px-3.5 py-2.5 bg-neutral-50 border border-neutral-200 rounded-xl text-neutral-950 text-xs placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-black transition"
          />
        </div>

        <!-- Alert Notification -->
        <div id="authAlert" class="hidden p-3 rounded-xl text-xs font-medium"></div>

        <!-- Submit Button -->
        <button 
          type="button" 
          onclick="handleFormSubmit(event); return false;"
          id="authSubmitBtn"
          class="w-full py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <span id="submitText">${isLogin ? 'Sign In to Workspace' : 'Create Sovereign Account'}</span>
          <span id="authSpinner" class="hidden skeleton-dark h-3.5 w-14 rounded"></span>
        </button>

        <div class="relative flex items-center justify-center my-3">
          <div class="border-t border-neutral-200 w-full"></div>
          <span class="bg-white px-2 text-[10px] uppercase font-mono text-neutral-400 absolute">or</span>
        </div>

        <!-- 1-Click Guest Access -->
        <button 
          type="button" 
          onclick="handleGuestAccess(); return false;"
          id="authGuestBtn"
          class="w-full py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 border border-neutral-200 font-semibold text-xs rounded-xl transition shadow-2xs flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue with 1-Click Demo Console</span>
        </button>
      </form>

      <!-- Security / Edge Guarantee Footer -->
      <div class="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-num">
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>Edge Web Crypto SHA-256</span>
        </span>
        <span>Instant Sovereign Access</span>
      </div>

    </div>
  </main>

  <!-- Footer with Legal Links -->
  <footer class="p-6 text-center text-xs text-neutral-500 font-num flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 border-t border-neutral-100">
    <span>UltraDemon Platform · Cloudflare Workers + D1 SQLite FTS5</span>
    <span class="hidden sm:inline text-neutral-300">·</span>
    <a href="/privacy" class="hover:text-black transition">Privacy Policy</a>
    <span class="hidden sm:inline text-neutral-300">·</span>
    <a href="/terms" class="hover:text-black transition">Terms of Use</a>
  </footer>

  <script>
    let mode = '${initialMode === 'login' ? 'signin' : 'signup'}';
    let currentPendingEmail = '';
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlan = (urlParams.get('plan') || '').toLowerCase();

    // If plan query is present, reflect it in UI
    if (selectedPlan && ['free', 'pro', 'ultra', 'enterprise'].includes(selectedPlan)) {
      const banner = document.getElementById('planBanner');
      const planName = document.getElementById('planName');
      if (banner && planName) {
        planName.innerText = selectedPlan.toUpperCase();
        banner.classList.remove('hidden');
      }
    }

    function setAuthMode(newMode) {
      mode = newMode;
      const isSign = mode === 'signin';
      document.getElementById('pageTitle').innerHTML = isSign 
        ? 'Sign in to <span class="font-serif font-bold italic">UltraDemon</span>' 
        : 'Create your <span class="font-serif font-bold italic">UltraDemon</span> account';
      document.getElementById('pageSubtitle').innerText = isSign
        ? 'Enter your credentials to access your developer console'
        : 'Instant edge account setup with mandatory email verification';
      document.getElementById('submitText').innerText = isSign ? 'Sign In to Workspace' : 'Create Sovereign Account';

      const tabIn = document.getElementById('tabSignIn');
      const tabUp = document.getElementById('tabSignUp');
      const confirmRow = document.getElementById('confirmPasswordRow');
      if (isSign) {
        tabIn.className = 'py-2 rounded-lg transition cursor-pointer bg-black text-white shadow-xs';
        tabUp.className = 'py-2 rounded-lg transition cursor-pointer text-neutral-600 hover:text-black';
        if (confirmRow) confirmRow.classList.add('hidden');
      } else {
        tabIn.className = 'py-2 rounded-lg transition cursor-pointer text-neutral-600 hover:text-black';
        tabUp.className = 'py-2 rounded-lg transition cursor-pointer bg-black text-white shadow-xs';
        if (confirmRow) confirmRow.classList.remove('hidden');
      }
      document.getElementById('authAlert').classList.add('hidden');
      document.getElementById('verifyNoticeCard').classList.add('hidden');
      document.getElementById('authForm').classList.remove('hidden');
    }
    window.setAuthMode = setAuthMode;

    async function handleFormSubmit(e) {
      if (e && e.preventDefault) e.preventDefault();
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      const alertBox = document.getElementById('authAlert');
      const spinner = document.getElementById('authSpinner');
      const submitBtn = document.getElementById('authSubmitBtn');

      if (!email || !password) {
        alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-neutral-100 border border-neutral-300 text-red-600';
        alertBox.innerText = 'Please enter both email and password';
        alertBox.classList.remove('hidden');
        return;
      }

      alertBox.classList.add('hidden');
      spinner.classList.remove('hidden');
      submitBtn.disabled = true;

      try {
        const endpoint = mode === 'signup' ? '/v1/auth/signup' : '/v1/auth/signin';
        const payload = { email, password };
        if (mode === 'signup' && selectedPlan) {
          payload.plan = selectedPlan;
        }

        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Authentication failed');
        }

        // Store session, user, and active key
        if (data.session) {
          localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session));
        }
        if (data.user) {
          localStorage.setItem('ultrademon_user', JSON.stringify(data.user));
        }
        if (data.active_key) {
          localStorage.setItem('ultrademon_active_key', data.active_key);
        }

        alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-neutral-100 border border-neutral-300 text-neutral-900 flex items-center gap-2';
        alertBox.innerHTML = '<svg class="w-4 h-4 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Signed in! Redirecting to workspace...</span>';
        alertBox.classList.remove('hidden');

        // Redirect to full app
        setTimeout(() => {
          const targetUrl = '/app' + (selectedPlan ? '?plan=' + encodeURIComponent(selectedPlan) : '');
          window.location.href = targetUrl;
        }, 300);

      } catch (err) {
        alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-neutral-100 border border-neutral-300 text-red-600';
        alertBox.innerText = err.message || 'Authentication error';
        alertBox.classList.remove('hidden');
        if (err.message && err.message.includes('switch to Create Account')) {
          const switchBtn = document.createElement('button');
          switchBtn.type = 'button';
          switchBtn.className = 'block mt-2 underline font-semibold text-neutral-900 cursor-pointer';
          switchBtn.innerText = 'Click here to Switch to Create Account';
          switchBtn.onclick = function() { setAuthMode('signup'); };
          alertBox.appendChild(switchBtn);
        }
      } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
      }
    }

    async function handleGuestAccess() {
      const guestBtn = document.getElementById('authGuestBtn');
      const alertBox = document.getElementById('authAlert');
      if (guestBtn) {
        guestBtn.disabled = true;
        guestBtn.innerText = 'Initializing demo workspace...';
      }
      try {
        const res = await fetch('/v1/auth/anonymous', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ plan: selectedPlan || 'free' })
        });
        const data = await res.json();
        if (data.session) {
          localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session));
        }
        if (data.user) {
          localStorage.setItem('ultrademon_user', JSON.stringify(data.user));
        }
        if (data.initial_key) {
          localStorage.setItem('ultrademon_active_key', data.initial_key);
        }
        window.location.href = '/app' + (selectedPlan ? '?plan=' + encodeURIComponent(selectedPlan) : '');
      } catch (e) {
        if (alertBox) {
          alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-neutral-100 border border-neutral-300 text-red-600';
          alertBox.innerText = 'Failed to initialize guest console: ' + e.message;
          alertBox.classList.remove('hidden');
        }
        if (guestBtn) {
          guestBtn.disabled = false;
          guestBtn.innerText = 'Continue with 1-Click Demo Console';
        }
      }
    }

    async function handleOAuthSignIn(provider) {
      const alertBox = document.getElementById('authAlert');
      if (alertBox) alertBox.classList.add('hidden');

      const btn = provider === 'google' ? document.getElementById('btnOAuthGoogle') : document.getElementById('btnOAuthGithub');
      const origText = btn ? btn.innerHTML : '';
      if (btn) btn.innerHTML = '<span class="skeleton h-3 w-28 rounded"></span>';

      try {
        const sbUrl = 'https://ljybwoxyokppujhgwgre.supabase.co';
        const sbKey = 'sb_publishable_4PMwPvFvADpJndmi4aBK9g_Rgr5hk9m';

        // 1. Preflight check to verify if the provider is enabled in Supabase
        try {
          const settingsRes = await fetch(sbUrl + '/auth/v1/settings', {
            headers: { 'apikey': sbKey }
          });
          if (settingsRes.ok) {
            const settings = await settingsRes.json();
            if (settings && settings.external && settings.external[provider] === false) {
              if (btn) btn.innerHTML = origText;
              if (alertBox) {
                alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-amber-50 border border-amber-200 text-amber-900 leading-relaxed';
                alertBox.innerHTML = '<strong>' + (provider === 'google' ? 'Google' : 'GitHub') + ' OAuth is not enabled in your Supabase project yet.</strong><br/>To enable it, open your Supabase Dashboard &rarr; Authentication &rarr; Providers &rarr; ' + (provider === 'google' ? 'Google' : 'GitHub') + ', toggle ON, and add your Client ID & Secret. You can also sign in directly with email & password or use the 1-Click Demo Console below.';
                alertBox.classList.remove('hidden');
              }
              return;
            }
          }
        } catch {}

        // 2. Generate standard RFC 7636 PKCE verifier & challenge
        const array = new Uint8Array(32);
        window.crypto.getRandomValues(array);
        const verifier = Array.from(array, dec => ('0' + dec.toString(16)).slice(-2)).join('');
        localStorage.setItem('ultrademon_pkce_verifier', verifier);

        const encoder = new TextEncoder();
        const data = encoder.encode(verifier);
        const hash = await window.crypto.subtle.digest('SHA-256', data);
        const challenge = btoa(String.fromCharCode(...new Uint8Array(hash)))
          .replace(/\\+/g, '-')
          .replace(/\\//g, '_')
          .replace(/=+$/, '');

        // 3. Redirect to Supabase authorize endpoint
        const redirectUrl = window.location.origin + '/auth/callback';
        const targetUrl = sbUrl + '/auth/v1/authorize?provider=' + encodeURIComponent(provider) +
          '&code_challenge=' + encodeURIComponent(challenge) +
          '&code_challenge_method=s256' +
          '&redirect_to=' + encodeURIComponent(redirectUrl);

        window.location.href = targetUrl;
      } catch (err) {
        if (btn) btn.innerHTML = origText;
        if (alertBox) {
          alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-neutral-100 border border-neutral-300 text-red-600';
          alertBox.innerText = 'OAuth failed: ' + (err.message || 'Check connection');
          alertBox.classList.remove('hidden');
        }
      }
    }

    async function handleResendVerification() {
      const email = currentPendingEmail || document.getElementById('authEmail').value.trim();
      const statusBox = document.getElementById('resendStatus');
      const resendBtn = document.getElementById('resendBtn');
      if (!email) {
        alert('Please enter your email address first.');
        return;
      }

      resendBtn.disabled = true;
      resendBtn.innerText = 'Sending...';

      try {
        const res = await fetch('/v1/auth/resend-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        });
        const data = await res.json();
        statusBox.className = 'p-2.5 rounded-lg text-xs font-medium bg-emerald-50 border border-emerald-200 text-emerald-800';
        statusBox.innerText = data.message || 'Verification link resent! Check your inbox.';
        statusBox.classList.remove('hidden');
      } catch (err) {
        statusBox.className = 'p-2.5 rounded-lg text-xs font-medium bg-red-50 border border-red-200 text-red-700';
        statusBox.innerText = err.message || 'Failed to resend email. Please try again.';
        statusBox.classList.remove('hidden');
      } finally {
        setTimeout(() => {
          resendBtn.disabled = false;
          resendBtn.innerText = 'Resend Verification Link';
        }, 3000);
      }
    }

    // Auto-redirect if already signed in
    window.addEventListener('DOMContentLoaded', async () => {
      const sess = localStorage.getItem('ultrademon_auth_session');
      if (sess) {
        try {
          const parsed = JSON.parse(sess);
          if (parsed && parsed.access_token) {
            const res = await fetch('/v1/auth/me', {
              headers: { 'Authorization': 'Bearer ' + parsed.access_token }
            });
            if (res.ok) {
              window.location.href = '/app';
            }
          }
        } catch {}
      }
    });
  </script>
</body>
</html>`;
}

// ── Render Dedicated Email Verification Callback Page (/auth/callback) ────────
export function renderAuthCallbackPage(origin: string): string {
  return `<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verifying Email — UltraDemon Platform</title>
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
    body {
      font-family: 'NB International Pro', -apple-system, BlinkMacSystemFont, sans-serif;
      background-color: #f7f7f7;
      color: #09090b;
    }
    input, textarea, button, select {
      font-family: 'NB International Pro', -apple-system, BlinkMacSystemFont, sans-serif;
      color: #09090b;
    }
    .font-serif {
      font-family: 'Michelangelus', Georgia, serif;
    }
    .font-num {
      font-family: 'Geist Mono', monospace;
    }
    ${CUSTOM_CURSORS_CSS}
  </style>
  
  <!-- Vercel Web Analytics -->
  <script>
    window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
  </script>
  <script defer src="/_vercel/insights/script.js"></script>
</head>
<body class="min-h-screen bg-[#f7f7f7] text-neutral-950 flex flex-col justify-between selection:bg-black selection:text-white">

  <!-- Simple Header -->
  <header class="p-6 border-b border-neutral-100 flex items-center justify-between max-w-5xl mx-auto w-full">
    <a href="/" class="flex items-center gap-2.5 group">
      <img src="${ULTRADEMON_LOGO_URI}" alt="UltraDemon Logo" class="w-7 h-7 object-contain select-none shrink-0" />
      <span class="font-normal text-base tracking-tight text-neutral-950 flex items-center gap-1">
        ultrademon
        <span class="font-serif text-xs font-bold italic text-neutral-500">engine</span>
      </span>
    </a>
    <a href="/" class="text-xs text-neutral-500 hover:text-black font-medium transition">Back to Home</a>
  </header>

  <!-- Center Card -->
  <main class="flex-1 flex items-center justify-center p-6">
    <div class="w-full max-w-md bg-white border border-neutral-200 rounded-3xl p-8 shadow-xs text-center space-y-5">
      
      <!-- In-Progress State -->
      <div id="verifyingState" class="space-y-4">
        <div class="w-full space-y-2.5 p-3">
          <div class="skeleton h-5 w-48 mx-auto rounded-lg"></div>
          <div class="skeleton h-3.5 w-64 mx-auto rounded"></div>
          <div class="skeleton h-3.5 w-52 mx-auto rounded"></div>
        </div>
        <h1 class="text-xl font-semibold text-neutral-950">Verifying your email address...</h1>
        <p class="text-xs text-neutral-500 leading-relaxed">
          Connecting to Cloudflare edge nodes and activating your workspace keys.
        </p>
      </div>

      <!-- Success State -->
      <div id="successState" class="hidden space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-black text-white mx-auto flex items-center justify-center shadow-md">
          <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <h1 class="text-xl font-semibold text-neutral-950">
          Email Verified <span class="font-serif font-bold italic">Successfully</span>
        </h1>
        <p class="text-xs text-neutral-600 leading-relaxed">
          Your account is active and your sovereign workspace keys are provisioned. Redirecting to console...
        </p>
        <a href="/app" class="inline-block px-5 py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition">
          Launch Workspace Now &rarr;
        </a>
      </div>

      <!-- Error State -->
      <div id="errorState" class="hidden space-y-4">
        <div class="w-12 h-12 rounded-2xl bg-red-50 border border-red-200 mx-auto flex items-center justify-center text-red-600">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        </div>
        <h1 class="text-xl font-semibold text-neutral-950">Verification Link Issue</h1>
        <p id="errorMsg" class="text-xs text-neutral-500 leading-relaxed">
          The link may have expired or was already used. Please request a new verification link.
        </p>
        <div class="pt-2 flex flex-col gap-2">
          <a href="/?auth=signin" class="py-2.5 px-4 bg-black text-white font-semibold text-xs rounded-xl hover:bg-neutral-800 transition">
            Go to Sign In
          </a>
          <a href="/?auth=signup" class="py-2 px-4 border border-neutral-200 text-neutral-700 font-medium text-xs rounded-xl hover:bg-neutral-50 transition">
            Create New Account
          </a>
        </div>
      </div>

    </div>
  </main>

  <!-- Footer -->
  <footer class="p-6 text-center text-xs text-neutral-400 font-num">
    UltraDemon Platform · Cloudflare Workers Edge + D1 SQLite FTS5
  </footer>

  <script>
    async function processVerification() {
      const hash = window.location.hash.substring(1);
      const hashParams = new URLSearchParams(hash);
      const searchParams = new URLSearchParams(window.location.search);

      const error = hashParams.get('error') || searchParams.get('error');
      const errorDesc = hashParams.get('error_description') || searchParams.get('error_description') || searchParams.get('msg') || searchParams.get('message');

      if (error || errorDesc) {
        document.getElementById('verifyingState').classList.add('hidden');
        document.getElementById('errorMsg').innerText = errorDesc || error || 'Authentication could not be completed';
        document.getElementById('errorState').classList.remove('hidden');
        return;
      }

      const accessToken = hashParams.get('access_token') || searchParams.get('access_token');
      const code = searchParams.get('code');
      const verifier = localStorage.getItem('ultrademon_pkce_verifier') || '';

      if (!accessToken && !code) {
        document.getElementById('verifyingState').classList.add('hidden');
        document.getElementById('errorMsg').innerText = 'No verification token or authorization code detected in URL.';
        document.getElementById('errorState').classList.remove('hidden');
        return;
      }

      try {
        const res = await fetch('/v1/auth/confirm-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            access_token: accessToken || '',
            code: code || '',
            code_verifier: verifier
          })
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Verification failed');
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

        // Clean up verifier
        localStorage.removeItem('ultrademon_pkce_verifier');

        document.getElementById('verifyingState').classList.add('hidden');
        document.getElementById('successState').classList.remove('hidden');

        setTimeout(() => {
          window.location.href = '/app';
        }, 1000);

      } catch (err) {
        document.getElementById('verifyingState').classList.add('hidden');
        document.getElementById('errorMsg').innerText = err.message || 'Verification could not be completed. Please request a new link.';
        document.getElementById('errorState').classList.remove('hidden');
      }
    }

    window.addEventListener('DOMContentLoaded', processVerification);
  </script>
</body>
</html>`;
}
