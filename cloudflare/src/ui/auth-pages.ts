// UltraDemon — Dedicated Login, Sign-Up & Verification Callback UI
// Pure White (#ffffff) & Monochrome. Zero gradients.
// Typography: Michelangelus Bold Italic (WOFF2 Data URI), Geist Sans, Geist Mono.
// Strict Design Rule: NO EMOJIS ANYWHERE. Minimalist grey SVGs only.

import { MICHELANGELUS_BOLD_ITALIC_WOFF2_B64, MICHELANGELUS_REGULAR_WOFF2_B64 } from './font-data';

export function renderAuthPage(initialMode: 'login' | 'signup', origin: string, supabaseUrl: string, supabaseAnonKey: string): string {
  const isLogin = initialMode === 'login';

  return `<!DOCTYPE html>
<html lang="en" class="light">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${isLogin ? 'Sign In' : 'Create Account'} — UltraDemon Platform</title>
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
  </style>
</head>
<body class="min-h-screen bg-white text-neutral-950 flex flex-col justify-between selection:bg-black selection:text-white">

  <!-- Top Simple Navigation -->
  <header class="p-6 border-b border-neutral-100 flex items-center justify-between max-w-5xl mx-auto w-full">
    <a href="/" class="flex items-center gap-2.5 group">
      <div class="w-7 h-7 rounded-lg bg-neutral-100 border border-neutral-200 flex items-center justify-center text-neutral-700 group-hover:bg-black group-hover:text-white group-hover:border-black transition">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
        </svg>
      </div>
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
        <div class="w-10 h-10 rounded-xl bg-neutral-100 border border-neutral-200 mx-auto flex items-center justify-center text-neutral-800 mb-3">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
          </svg>
        </div>
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

      <!-- Auth Form -->
      <form id="authForm" onsubmit="handleFormSubmit(event)" class="space-y-4">
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

        <!-- Alert Notification -->
        <div id="authAlert" class="hidden p-3 rounded-xl text-xs font-medium"></div>

        <!-- Submit Button -->
        <button 
          type="submit" 
          id="authSubmitBtn"
          class="w-full py-2.5 bg-black hover:bg-neutral-800 text-white font-semibold text-xs rounded-xl transition shadow-xs flex items-center justify-center gap-2 cursor-pointer mt-2"
        >
          <span id="submitText">${isLogin ? 'Sign In to Workspace' : 'Create Sovereign Account'}</span>
          <span id="authSpinner" class="hidden">
            <svg class="w-3.5 h-3.5 text-white animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
          </span>
        </button>
      </form>

      <!-- Security / Edge Guarantee Footer -->
      <div class="mt-6 pt-5 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400 font-num">
        <span class="flex items-center gap-1">
          <svg class="w-3.5 h-3.5 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path stroke-linecap="round" stroke-linejoin="round" d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
          <span>Edge Web Crypto SHA-256</span>
        </span>
        <span>Mandatory Email Verification</span>
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
      if (isSign) {
        tabIn.className = 'py-2 rounded-lg transition cursor-pointer bg-black text-white shadow-xs';
        tabUp.className = 'py-2 rounded-lg transition cursor-pointer text-neutral-600 hover:text-black';
      } else {
        tabIn.className = 'py-2 rounded-lg transition cursor-pointer text-neutral-600 hover:text-black';
        tabUp.className = 'py-2 rounded-lg transition cursor-pointer bg-black text-white shadow-xs';
      }
      document.getElementById('authAlert').classList.add('hidden');
      document.getElementById('verifyNoticeCard').classList.add('hidden');
      document.getElementById('authForm').classList.remove('hidden');
    }

    async function handleFormSubmit(e) {
      e.preventDefault();
      const email = document.getElementById('authEmail').value.trim();
      const password = document.getElementById('authPassword').value;
      const alertBox = document.getElementById('authAlert');
      const spinner = document.getElementById('authSpinner');
      const submitBtn = document.getElementById('authSubmitBtn');

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

        // 1. Mandatory Email Verification Required Handling
        if (data.requires_verification || res.status === 403) {
          currentPendingEmail = email;
          document.getElementById('authForm').classList.add('hidden');
          document.getElementById('verifyTargetEmail').innerText = email;
          document.getElementById('verifyNoticeCard').classList.remove('hidden');
          document.getElementById('pageTitle').innerHTML = 'Email Verification <span class="font-serif font-bold italic">Required</span>';
          document.getElementById('pageSubtitle').innerText = 'Please click the link in your email to activate your account.';
          return;
        }

        if (!res.ok) {
          throw new Error(data.error || 'Authentication failed');
        }

        // Store session and user
        localStorage.setItem('ultrademon_auth_session', JSON.stringify(data.session));
        localStorage.setItem('ultrademon_user', JSON.stringify(data.user));

        alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-neutral-100 border border-neutral-300 text-neutral-900 flex items-center gap-2';
        alertBox.innerHTML = '<svg class="w-4 h-4 text-neutral-950" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg><span>Signed in! Redirecting to workspace...</span>';
        alertBox.classList.remove('hidden');

        // Redirect to full app
        setTimeout(() => {
          const targetUrl = '/app' + (selectedPlan ? '?plan=' + encodeURIComponent(selectedPlan) : '');
          window.location.href = targetUrl;
        }, 500);

      } catch (err) {
        alertBox.className = 'p-3 rounded-xl text-xs font-medium bg-neutral-100 border border-neutral-300 text-red-600';
        alertBox.innerText = err.message || 'Authentication error';
        alertBox.classList.remove('hidden');
      } finally {
        spinner.classList.add('hidden');
        submitBtn.disabled = false;
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
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2309090b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M13 2L3 14h9l-1 8 10-12h-9l1-8z'/></svg>">
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Geist:wght@300;400;500;600;700;800;900&family=Geist+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
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
    }
  </style>
</head>
<body class="min-h-screen bg-white text-neutral-950 flex flex-col justify-between selection:bg-black selection:text-white">

  <!-- Simple Header -->
  <header class="p-6 border-b border-neutral-100 flex items-center justify-between max-w-5xl mx-auto w-full">
    <a href="/" class="flex items-center gap-2.5 group">
      <div class="w-7 h-7 rounded-lg bg-black text-white flex items-center justify-center">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
      </div>
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
        <div class="w-12 h-12 rounded-2xl bg-neutral-100 border border-neutral-200 mx-auto flex items-center justify-center text-neutral-800">
          <svg class="w-6 h-6 animate-spin text-neutral-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke-width="3" stroke-dasharray="32" stroke-linecap="round"/></svg>
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
          <a href="/login" class="py-2.5 px-4 bg-black text-white font-semibold text-xs rounded-xl hover:bg-neutral-800 transition">
            Go to Sign In
          </a>
          <a href="/signup" class="py-2 px-4 border border-neutral-200 text-neutral-700 font-medium text-xs rounded-xl hover:bg-neutral-50 transition">
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

      const accessToken = hashParams.get('access_token') || searchParams.get('access_token') || searchParams.get('code');
      const errorDesc = hashParams.get('error_description') || searchParams.get('error_description');

      if (errorDesc) {
        document.getElementById('verifyingState').classList.add('hidden');
        document.getElementById('errorMsg').innerText = errorDesc;
        document.getElementById('errorState').classList.remove('hidden');
        return;
      }

      try {
        const res = await fetch('/v1/auth/confirm-verification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ access_token: accessToken || '' })
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

        document.getElementById('verifyingState').classList.add('hidden');
        document.getElementById('successState').classList.remove('hidden');

        setTimeout(() => {
          window.location.href = '/app';
        }, 1200);

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
