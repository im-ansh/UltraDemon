#!/usr/bin/env python3
"""
UltraDemon Edge Latency Benchmark Suite
Tests every core API endpoint for real-world latency performance:
1. Total Client RTT (Round Trip Time)
2. Edge Compute Latency (Server-Timing / X-Engine-Latency-Ms / X-Memory-Latency-Ms)
3. Auth Overhead (X-Auth-Latency-Us)
4. Cache Tier (RAM, KV, MISS)
"""

import json
import time
import urllib.request
import urllib.error
import statistics
import sys
import re

BASE = "https://ultrasearch-api.aaronvanoss.workers.dev"

def timed_request(method, path, body=None, headers=None):
    """Make a request and return (status, total_rtt_ms, edge_compute_ms, auth_us, cache_status, data)."""
    url = f"{BASE}{path}"
    h = {"Content-Type": "application/json", "User-Agent": "UltraDemon-Bench/1.0"}
    if headers:
        h.update(headers)
    data = json.dumps(body).encode() if body else None
    req = urllib.request.Request(url, data=data, headers=h, method=method)
    
    start = time.perf_counter()
    try:
        with urllib.request.urlopen(req, timeout=15) as r:
            resp_body = r.read()
            total_rtt = (time.perf_counter() - start) * 1000
            
            # Extract edge headers
            edge_engine_ms = r.headers.get("X-Engine-Latency-Ms")
            edge_memory_ms = r.headers.get("X-Memory-Latency-Ms")
            auth_us = r.headers.get("X-Auth-Latency-Us")
            cache_status = r.headers.get("X-Cache-Status") or "NONE"
            server_timing = r.headers.get("Server-Timing") or ""
            
            edge_compute = None
            if edge_engine_ms:
                try: edge_compute = float(edge_engine_ms)
                except: pass
            elif edge_memory_ms:
                try: edge_compute = float(edge_memory_ms)
                except: pass
            elif server_timing:
                m = re.search(r'dur=([0-9.]+)', server_timing)
                if m:
                    try: edge_compute = float(m.group(1))
                    except: pass
            
            parsed = json.loads(resp_body) if resp_body else {}
            if edge_compute is None and isinstance(parsed, dict):
                edge_compute = parsed.get("search_time_ms") or parsed.get("retrieval_time_ms") or parsed.get("storage_time_ms")
            
            auth_us_val = float(auth_us) if auth_us else 0.0
            
            return r.status, total_rtt, edge_compute, auth_us_val, cache_status, parsed
    except urllib.error.HTTPError as e:
        total_rtt = (time.perf_counter() - start) * 1000
        try:
            resp_body = e.read()
            return e.code, total_rtt, None, 0.0, "ERR", json.loads(resp_body) if resp_body else {}
        except:
            return e.code, total_rtt, None, 0.0, "ERR", {}
    except Exception as e:
        total_rtt = (time.perf_counter() - start) * 1000
        return 0, total_rtt, None, 0.0, "ERR", {"error": str(e)}


def percentile(data, p):
    if not data:
        return 0.0
    s = sorted(data)
    k = (len(s) - 1) * (p / 100)
    f = int(k)
    c = f + 1 if f + 1 < len(s) else f
    d = k - f
    return s[f] + d * (s[c] - s[f])


def bench(label, method, path, body=None, headers=None, iterations=10):
    rtts = []
    edge_times = []
    auth_times = []
    statuses = []
    cache_hits = 0
    
    for i in range(iterations):
        status, rtt, edge_ms, auth_us, cache_status, _ = timed_request(method, path, body, headers)
        rtts.append(rtt)
        statuses.append(status)
        if edge_ms is not None:
            edge_times.append(edge_ms)
        if auth_us > 0:
            auth_times.append(auth_us)
        if "HIT" in cache_status:
            cache_hits += 1
        if i < iterations - 1:
            time.sleep(0.05)
    
    rtt_p50 = percentile(rtts, 50)
    edge_p50 = percentile(edge_times, 50) if edge_times else None
    edge_min = min(edge_times) if edge_times else None
    edge_str = f"EdgeP50={edge_p50:5.1f}ms (min={edge_min:4.1f}ms)" if edge_p50 is not None else "EdgeP50=   N/A  "
    
    ok_count = sum(1 for s in statuses if 200 <= s < 400)
    status_str = "OK" if ok_count == len(statuses) else f"{ok_count}/{len(statuses)}"
    cache_str = f"Cache={cache_hits}/{iterations}"
    
    print(f"  {label:44s}  {edge_str}  RTT_P50={rtt_p50:6.1f}ms  [{cache_str}] [{status_str}]")
    return {
        "label": label,
        "edge_p50": edge_p50,
        "edge_min": edge_min,
        "rtt_p50": rtt_p50,
        "cache_hits": cache_hits,
        "success": ok_count == len(statuses)
    }


# ── Setup: Get a guest session for authenticated benchmarks ────────────────────
print("Setting up guest session for authenticated benchmarks...")
_, _, _, _, _, anon_data = timed_request("POST", "/v1/auth/anonymous", {"fingerprint": f"bench_{int(time.time())}"})
guest_token = anon_data.get("session", {}).get("access_token", "")
initial_key = anon_data.get("initial_key", "") or anon_data.get("user", {}).get("active_key", "")
if not guest_token:
    print("FATAL: Could not get guest session token")
    print("Response:", json.dumps(anon_data, indent=2))
    sys.exit(1)
print(f"  Guest token: {guest_token[:20]}...  Key: {initial_key[:12]}...")

auth_headers = {"Authorization": f"Bearer {guest_token}"}

# Create a key for key-authenticated endpoints
_, _, _, _, _, key_data = timed_request("POST", "/v1/keys", {"label": "bench_key", "scope": "unified"}, auth_headers)
api_key = key_data.get("plain_key", "") or initial_key
key_headers = {"X-API-Key": api_key} if api_key else auth_headers
print(f"  Using API key: {api_key[:12]}...")

ITERS = 5

print(f"\n{'='*120}")
print(f"  ULTRADEMON EDGE LATENCY BENCHMARK  |  Target: {BASE}")
print(f"  Promises: 11.8ms P50 Search · 8.4ms P50 Memory · Sub-15ms edge compute")
print(f"{'='*120}\n")

# ── 1. Health & Static Endpoints ──────────────────────────────────────────────
print("--- HEALTH & STATIC ---")
results = []
results.append(bench("GET  /health", "GET", "/health", iterations=ITERS))
results.append(bench("GET  /v1/plans", "GET", "/v1/plans", iterations=ITERS))

# ── 2. Search Endpoints (Promise: 11.8ms P50) ─────────────────────────────────
print("\n--- SEARCH (Landing Page Promise: 11.8ms P50) ---")
# Warm up cache once
timed_request("POST", "/v1/search", {"query": "python documentation", "num_results": 5, "mode": 1}, key_headers)
results.append(bench("POST /v1/search  (Mode 1, warm cached)", "POST", "/v1/search",
    {"query": "python documentation", "num_results": 5, "mode": 1},
    key_headers, ITERS))
results.append(bench("POST /v1/search  (Mode 1, uncached query)", "POST", "/v1/search",
    {"query": f"benchmark fresh {int(time.time())}", "num_results": 5, "mode": 1, "use_cache": False},
    key_headers, ITERS))
results.append(bench("POST /v1/search  (Mode 2, hybrid)", "POST", "/v1/search",
    {"query": "cloudflare workers edge", "num_results": 5, "mode": 2},
    key_headers, ITERS))
results.append(bench("GET  /v1/search/stats", "GET", "/v1/search/stats",
    headers=key_headers, iterations=ITERS))

# ── 3. Memory Endpoints (Promise: 8.4ms / Sub-10ms P50) ──────────────────────
print("\n--- MEMORY (Landing Page Promise: 8.4ms P50) ---")
results.append(bench("POST /v1/memory  (store)", "POST", "/v1/memory",
    {"content": "User prefers dark mode UI with monospace fonts", "type": "preference", "container_tag": "bench_agent"},
    key_headers, ITERS))
# Warm up query
timed_request("POST", "/v1/memory/query", {"query": "user preferences", "container_tag": "bench_agent", "limit": 5}, key_headers)
results.append(bench("POST /v1/memory/query  (BM25 recall, warm)", "POST", "/v1/memory/query",
    {"query": "user preferences", "container_tag": "bench_agent", "limit": 5},
    key_headers, ITERS))
results.append(bench("GET  /v1/memory  (list)", "GET", "/v1/memory?limit=10",
    headers=key_headers, iterations=ITERS))

# ── 4. Crawler Endpoints ─────────────────────────────────────────────────────
print("\n--- CRAWLER ---")
results.append(bench("GET  /v1/crawler/stats", "GET", "/v1/crawler/stats",
    headers=key_headers, iterations=ITERS))
results.append(bench("GET  /v1/crawler/documents?limit=10", "GET", "/v1/crawler/documents?limit=10",
    headers=key_headers, iterations=ITERS))
results.append(bench("GET  /v1/crawler/queue?limit=10", "GET", "/v1/crawler/queue?limit=10",
    headers=key_headers, iterations=ITERS))

# ── 5. Auth & Keys ───────────────────────────────────────────────────────────
print("\n--- AUTH & KEYS ---")
results.append(bench("GET  /v1/auth/me", "GET", "/v1/auth/me",
    headers=auth_headers, iterations=ITERS))
results.append(bench("GET  /v1/usage", "GET", "/v1/usage",
    headers=key_headers, iterations=ITERS))

print(f"\n{'='*120}")
print("  EDGE COMPUTE LATENCY SUMMARY")
print(f"{'='*120}")
for r in results:
    edge_p50 = f"{r['edge_p50']:.1f}ms" if r['edge_p50'] is not None else "N/A"
    print(f"  {r['label']:44s}  Edge Compute P50: {edge_p50:>8s}  |  Total Client RTT P50: {r['rtt_p50']:6.1f}ms")
print(f"{'='*120}\n")
