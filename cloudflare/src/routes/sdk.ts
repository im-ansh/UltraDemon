// UltraDemon — Edge Telemetry SDK (Client Tracking Script)
// Ultra-lightweight, zero external dependencies, 100% Sovereign.
// Automatically captures micro-hardware telemetry, active vs. idle dwell kinetics, and Core Web Vitals.

import { Hono } from 'hono';
import type { Env } from '../types';

export const sdkRouter = new Hono<{ Bindings: Env }>();

const TRACKER_JS = `(function(window, document) {
  'use strict';
  if (window.ultrademon && window.ultrademon._loaded) return;

  var currentScript = document.currentScript || (function() {
    var scripts = document.getElementsByTagName('script');
    return scripts[scripts.length - 1];
  })();

  var autoKey = currentScript ? (currentScript.getAttribute('data-key') || currentScript.getAttribute('data-api-key') || '') : '';
  var autoEndpoint = currentScript ? (currentScript.getAttribute('data-endpoint') || '') : '';

  var CONFIG = {
    apiKey: autoKey,
    endpoint: autoEndpoint || (window.location.origin + '/v1/analytics/capture'),
    distinctId: '',
    sessionId: '',
    sessionStart: Date.now(),
    maxScroll: 0,
    cwv: { lcp: 0, cls: 0, fid: 0, inp: 0, ttfb: 0 }
  };

  // ── Hardware & Kinetic State ──────────────────────────────────────────────
  var batteryInfo = { level: -1, charging: -1 };
  if (navigator.getBattery) {
    try {
      navigator.getBattery().then(function(b) {
        batteryInfo.level = Number(b.level.toFixed(2));
        batteryInfo.charging = b.charging ? 1 : 0;
      }).catch(function() {});
    } catch(e) {}
  }

  function getGpuRenderer() {
    try {
      var canvas = document.createElement('canvas');
      var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (gl) {
        var debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
        if (debugInfo) {
          return gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
        }
      }
    } catch(e) {}
    return '';
  }

  var cachedGpu = getGpuRenderer();

  // Kinetic Interaction & Idle Dwell Engine
  var KINETICS = {
    activeMs: 0,
    idleMs: 0,
    lastActionTime: Date.now(),
    mouseMoves: 0,
    clicks: 0,
    rageClicks: 0,
    tabSwitches: 0,
    lastClickTime: 0,
    lastClickEl: null
  };

  setInterval(function() {
    if (document.hidden) {
      KINETICS.idleMs += 1000;
    } else if (Date.now() - KINETICS.lastActionTime > 3000) {
      KINETICS.idleMs += 1000;
    } else {
      KINETICS.activeMs += 1000;
    }
  }, 1000);

  function markInteraction() {
    KINETICS.lastActionTime = Date.now();
  }

  window.addEventListener('mousemove', function() {
    KINETICS.mouseMoves++;
    markInteraction();
  }, { passive: true });

  window.addEventListener('keydown', markInteraction, { passive: true });
  window.addEventListener('touchstart', markInteraction, { passive: true });

  // Rage Clicks Detection (3 clicks within 600ms on same target)
  window.addEventListener('click', function(e) {
    markInteraction();
    KINETICS.clicks++;
    var now = Date.now();
    if (e.target === KINETICS.lastClickEl && (now - KINETICS.lastClickTime < 600)) {
      KINETICS.rageClicks++;
    }
    KINETICS.lastClickTime = now;
    KINETICS.lastClickEl = e.target;
  }, { passive: true });

  // Tab blur and visibility change
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) KINETICS.tabSwitches++;
  });
  window.addEventListener('blur', function() {
    KINETICS.tabSwitches++;
  });

  // Distinct Device / Visitor ID
  function getDistinctId() {
    var key = 'ud_distinct_id';
    var id = '';
    try {
      id = localStorage.getItem(key);
      if (!id) {
        id = 'ud_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
        localStorage.setItem(key, id);
      }
    } catch(e) {
      id = 'ud_fallback_' + Math.random().toString(36).substring(2, 10);
    }
    return id;
  }

  function getSessionId() {
    var key = 'ud_session_id';
    var id = '';
    try {
      id = sessionStorage.getItem(key);
      if (!id) {
        id = 'sess_' + Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
        sessionStorage.setItem(key, id);
      }
    } catch(e) {
      id = 'sess_mem_' + Math.random().toString(36).substring(2, 8);
    }
    return id;
  }

  CONFIG.distinctId = getDistinctId();
  CONFIG.sessionId = getSessionId();

  function getUtmParams() {
    var params = {};
    try {
      var search = new URLSearchParams(window.location.search);
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(function(k) {
        if (search.has(k)) params[k] = search.get(k);
      });
    } catch(e) {}
    return params;
  }

  function classifyActivity(activeMs, idleMs, mouseMoves, rageClicks, scrollDepth) {
    var total = activeMs + idleMs;
    var idleRatio = total > 0 ? (idleMs / total) : 0;
    if (rageClicks >= 2) return 'frustrated_rage';
    if (idleRatio > 0.8) return 'idle_lurking';
    if (scrollDepth > 45 && idleRatio > 0.4) return 'reading_deeply';
    if (mouseMoves > 60) return 'deep_working';
    return 'navigating';
  }

  // Core Send Event
  function sendEvent(eventName, properties) {
    var utm = getUtmParams();
    var durationMs = Date.now() - CONFIG.sessionStart;
    var totalDwell = KINETICS.activeMs + KINETICS.idleMs;
    var idleRatioPct = totalDwell > 0 ? Math.round((KINETICS.idleMs / totalDwell) * 100) : 0;
    var primActivity = classifyActivity(KINETICS.activeMs, KINETICS.idleMs, KINETICS.mouseMoves, KINETICS.rageClicks, CONFIG.maxScroll);

    var conn = navigator.connection || navigator.mozConnection || navigator.webkitConnection || {};

    var payload = {
      api_key: CONFIG.apiKey,
      event_name: eventName,
      distinct_id: CONFIG.distinctId,
      session_id: CONFIG.sessionId,
      timestamp: Date.now(),
      url: window.location.href,
      path: window.location.pathname,
      host: window.location.hostname,
      referrer: document.referrer || '',
      utm_source: utm.utm_source || '',
      utm_medium: utm.utm_medium || '',
      utm_campaign: utm.utm_campaign || '',
      utm_term: utm.utm_term || '',
      utm_content: utm.utm_content || '',
      screen_res: (window.screen.width || 0) + 'x' + (window.screen.height || 0),
      viewport_res: (window.innerWidth || 0) + 'x' + (window.innerHeight || 0),
      locale: navigator.language || '',
      timezone: (Intl && Intl.DateTimeFormat) ? Intl.DateTimeFormat().resolvedOptions().timeZone : '',
      connection_type: conn.effectiveType || '',
      network_downlink_mbps: conn.downlink || 0,
      network_rtt_ms: conn.rtt || 0,
      duration_ms: durationMs,
      scroll_depth: CONFIG.maxScroll,
      // Kinetic & Micro-Dwell Metrics
      active_time_ms: KINETICS.activeMs,
      idle_time_ms: KINETICS.idleMs,
      idle_ratio_pct: idleRatioPct,
      mouse_moves_count: KINETICS.mouseMoves,
      clicks_count: KINETICS.clicks,
      rage_clicks_count: KINETICS.rageClicks,
      tab_switches_count: KINETICS.tabSwitches,
      primary_activity: primActivity,
      // Insane Hardware Telemetry
      hardware_concurrency: navigator.hardwareConcurrency || 0,
      device_memory_gb: navigator.deviceMemory || 0,
      gpu_renderer: cachedGpu,
      battery_level: batteryInfo.level,
      battery_charging: batteryInfo.charging,
      pixel_ratio: window.devicePixelRatio || 1,
      color_depth: screen.colorDepth || 24,
      hdr_supported: (window.matchMedia && window.matchMedia('(dynamic-range: high)').matches) ? 1 : 0,
      touch_points: navigator.maxTouchPoints || 0,
      dark_mode: (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) ? 1 : 0,
      reduced_motion: (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) ? 1 : 0,
      // Core Web Vitals
      cwv_lcp: CONFIG.cwv.lcp,
      cwv_cls: CONFIG.cwv.cls,
      cwv_fid: CONFIG.cwv.fid,
      cwv_inp: CONFIG.cwv.inp,
      cwv_ttfb: CONFIG.cwv.ttfb,
      properties: properties || {}
    };

    var body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      try {
        var blob = new Blob([body], { type: 'application/json' });
        var sent = navigator.sendBeacon(CONFIG.endpoint, blob);
        if (sent) return;
      } catch(e) {}
    }

    try {
      fetch(CONFIG.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body,
        keepalive: true
      }).catch(function() {});
    } catch(e) {}
  }

  // Core Web Vitals via PerformanceObserver
  if (window.PerformanceObserver) {
    try {
      var lcpObs = new PerformanceObserver(function(entryList) {
        var entries = entryList.getEntries();
        if (entries.length > 0) {
          CONFIG.cwv.lcp = Math.round(entries[entries.length - 1].startTime);
        }
      });
      lcpObs.observe({ type: 'largest-contentful-paint', buffered: true });

      var clsObs = new PerformanceObserver(function(entryList) {
        entryList.getEntries().forEach(function(entry) {
          if (!entry.hadRecentInput) {
            CONFIG.cwv.cls = Number((CONFIG.cwv.cls + entry.value).toFixed(4));
          }
        });
      });
      clsObs.observe({ type: 'layout-shift', buffered: true });

      var navEntries = performance.getEntriesByType('navigation');
      if (navEntries.length > 0) {
        CONFIG.cwv.ttfb = Math.round(navEntries[0].responseStart - navEntries[0].requestStart);
      }
    } catch(e) {}
  }

  // Scroll Tracking
  function trackScroll() {
    var winHeight = window.innerHeight;
    var docHeight = Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    var scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    if (docHeight > winHeight) {
      var pct = Math.min(100, Math.round((scrollTop + winHeight) / docHeight * 100));
      if (pct > CONFIG.maxScroll) CONFIG.maxScroll = pct;
    }
  }
  window.addEventListener('scroll', trackScroll, { passive: true });

  // Autocapture clicks on elements with data-ud-event
  document.addEventListener('click', function(e) {
    var target = e.target;
    var trackingEl = target.closest('[data-ud-event]');
    if (trackingEl) {
      var evName = trackingEl.getAttribute('data-ud-event');
      sendEvent(evName, {
        tag: trackingEl.tagName.toLowerCase(),
        id: trackingEl.id || '',
        text: (trackingEl.innerText || '').substring(0, 50).trim()
      });
    }
  }, { passive: true });

  function triggerPageview() {
    sendEvent('$pageview', {
      title: document.title || '',
      url: window.location.href
    });
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    triggerPageview();
  } else {
    window.addEventListener('DOMContentLoaded', triggerPageview);
  }

  // Send heartbeat on unload
  window.addEventListener('pagehide', function() {
    sendEvent('$heartbeat', { session_duration_ms: Date.now() - CONFIG.sessionStart });
  });

  // Expose Public API
  window.ultrademon = {
    _loaded: true,
    init: function(apiKey, options) {
      if (apiKey) CONFIG.apiKey = apiKey;
      if (options && options.endpoint) CONFIG.endpoint = options.endpoint;
    },
    track: function(eventName, properties) {
      sendEvent(eventName, properties);
    },
    identify: function(userId, traits) {
      if (userId) {
        CONFIG.distinctId = String(userId);
        try { localStorage.setItem('ud_distinct_id', CONFIG.distinctId); } catch(e) {}
      }
      sendEvent('$identify', traits || {});
    },
    page: function(url, properties) {
      sendEvent('$pageview', Object.assign({ url: url || window.location.href }, properties || {}));
    },
    reset: function() {
      try {
        localStorage.removeItem('ud_distinct_id');
        sessionStorage.removeItem('ud_session_id');
      } catch(e) {}
      CONFIG.distinctId = getDistinctId();
      CONFIG.sessionId = getSessionId();
    }
  };

})(window, document);`;

sdkRouter.get('/ultrademon.js', (c) => {
  return c.text(TRACKER_JS, 200, {
    'Content-Type': 'application/javascript; charset=UTF-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    'Access-Control-Allow-Origin': '*',
  });
});

sdkRouter.get('/telemetry.js', (c) => {
  return c.text(TRACKER_JS, 200, {
    'Content-Type': 'application/javascript; charset=UTF-8',
    'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    'Access-Control-Allow-Origin': '*',
  });
});
