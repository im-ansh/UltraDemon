#!/usr/bin/env python3
"""
Benchmark and Verification Suite for UltraMemory Scales and API Key Management
Tests:
1. Store memory across all 5 Scales: ephemeral, entity, knowledge, cognitive, swarm
2. Recall memories filtered by scale, measuring round-trip and server execution times
3. Retrieve scale statistics from /v1/memory/scales
4. Verify key revocation and permanent key deletion with password authentication
"""

import json
import time
import urllib.request
import urllib.error

BASE_URL = "https://ultrasearch-api.aaronvanoss.workers.dev"

def request_json(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    headers.setdefault("User-Agent", "UltraDemon-Bench/1.0 (Macintosh; Apple Silicon)")
    if data is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode("utf-8")
    else:
        body = None

    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    t0 = time.perf_counter()
    try:
        with urllib.request.urlopen(req) as resp:
            elapsed_ms = (time.perf_counter() - t0) * 1000
            content = resp.read().decode("utf-8")
            return resp.status, json.loads(content), elapsed_ms
    except urllib.error.HTTPError as e:
        elapsed_ms = (time.perf_counter() - t0) * 1000
        content = e.read().decode("utf-8")
        try:
            parsed = json.loads(content)
        except Exception:
            parsed = {"raw": content}
        return e.code, parsed, elapsed_ms

def main():
    print("==================================================")
    print("ULTRAMEMORY SCALES & API KEY VERIFICATION SUITE")
    print("==================================================")

    # 1. Authenticate / get session or use existing test key
    with open("provisioned_keys.json", "r") as f:
        cfg = json.load(f)
    api_key = cfg.get("unified_api_key") or cfg.get("memory_api_key")
    headers = {"X-API-Key": api_key}

    print(f"\n[1] Testing UltraMemory Scales Storage across 5 Tiers using key: {api_key[:12]}...")

    scales_to_test = [
        ("ephemeral", "V8 Isolate RAM Scratchpad: Reasoning token step 1482"),
        ("entity", "User Profile: Prefers Michelangelus bold italic serif and tabular Geist Mono figures"),
        ("knowledge", "Documentation RFC: UltraMemory partition scales reduce unindexed BM25 query latency"),
        ("cognitive", "Action Tree Heuristic: Break multi-agent tasks into sub-tasks with verification gates"),
        ("swarm", "Decentralized Blackboard State: Worker-4 acquired consensus lock on partition 7b"),
    ]

    stored_memories = {}

    for scale, content in scales_to_test:
        status, res, roundtrip = request_json(
            f"{BASE_URL}/v1/memory",
            method="POST",
            data={
                "content": content,
                "scale": scale,
                "container_tag": "scales_bench",
                "memory_type": "fact" if scale != "entity" else "preference"
            },
            headers=headers
        )
        assert status in (200, 201), f"Failed to store memory for scale {scale}: {res}"
        stored = res.get("memory", res)
        mem_id = stored.get("memory_id")
        stored_memories[scale] = mem_id
        server_ms = res.get("storage_time_ms", 0)
        print(f"  - [{scale.upper():<10}] Stored in {server_ms:.2f}ms (roundtrip: {roundtrip:.1f}ms) -> ID: {mem_id}")

    print("\n[2] Testing Partitioned Recall by Scale (Verifying Cache Tiers & Latency)...")

    for scale, _ in scales_to_test:
        query_word = "Reasoning" if scale == "ephemeral" else ("Michelangelus" if scale == "entity" else ("UltraMemory" if scale == "knowledge" else ("Heuristic" if scale == "cognitive" else "Blackboard")))
        status, res, roundtrip = request_json(
            f"{BASE_URL}/v1/memory/recall?q={query_word}&scale={scale}&container_tag=scales_bench",
            method="GET",
            headers=headers
        )
        assert status == 200, f"Failed recall for scale {scale}: {res}"
        retrieval_ms = res.get("retrieval_time_ms", 0)
        cache_tier = res.get("cache_tier", "D1")
        count = len(res.get("memories", []))
        print(f"  - [{scale.upper():<10}] Recalled {count} item(s) in {retrieval_ms:.2f}ms (roundtrip: {roundtrip:.1f}ms) [Cache: {cache_tier}]")
        assert count > 0, f"Expected at least 1 match for scale {scale}"

    print("\n[3] Testing /v1/memory/scales Category Metrics Telemetry...")
    status, stats, _ = request_json(f"{BASE_URL}/v1/memory/scales", method="GET", headers=headers)
    assert status == 200, f"Failed to fetch scales telemetry: {stats}"
    print(f"  - Total partitioned memories: {stats.get('total')}")
    print(f"  - Fastest scale: {stats.get('fastest_scale')}")
    scales_list = stats.get("scales", [])
    for sc in scales_list:
        print(f"    * {sc.get('scale'):<11} count: {sc.get('count'):<3} target: <{sc.get('targetLatencyMs')}ms [{sc.get('cacheTier')}]")

    print("\n[4] Testing API Key Revocation & Password-Guarded Permanent Deletion...")
    test_email = f"scale_test_{int(time.time())}@ultrademon.ai"
    test_password = "SecurePassword123!"

    # Create test account
    status, auth_res, _ = request_json(
        f"{BASE_URL}/v1/auth/signup",
        method="POST",
        data={"email": test_email, "password": test_password, "plan": "free"}
    )
    assert status in (200, 201), f"Failed to sign up test user: {auth_res}"
    user_token = auth_res.get("session", {}).get("access_token") or auth_res.get("token") or auth_res.get("user", {}).get("active_key")
    auth_headers = {"Authorization": f"Bearer {user_token}", "Content-Type": "application/json"}
    print(f"  - Created test user: {test_email}")

    # Create a secondary test API key
    status, key_res, _ = request_json(
        f"{BASE_URL}/v1/keys",
        method="POST",
        data={"label": "Ephemeral Delete Test Key", "key_type": "memory", "plan": "free"},
        headers=auth_headers
    )
    assert status in (200, 201), f"Failed to create test key: {key_res}"
    key_id = key_res.get("key_id")
    plain_key = key_res.get("plain_key")
    print(f"  - Created secondary API key: ID={key_id}, Plain={plain_key[:12]}...")

    # Test Revoke by key_id
    status, revoke_res, _ = request_json(
        f"{BASE_URL}/v1/keys/{key_id}",
        method="DELETE",
        headers=auth_headers
    )
    assert status == 200, f"Revoke failed: {revoke_res}"
    print(f"  - Successfully revoked key {key_id}: {revoke_res.get('message')}")

    # Test Permanent Deletion with INCORRECT password (Expect 401)
    status, wrong_pw_res, _ = request_json(
        f"{BASE_URL}/v1/keys/{key_id}/delete",
        method="POST",
        data={"password": "WrongPassword999!"},
        headers=auth_headers
    )
    assert status == 401, f"Expected 401 on incorrect password, got {status}: {wrong_pw_res}"
    print(f"  - Verified: Incorrect password rejected with 401 ('{wrong_pw_res.get('error')}')")

    # Test Permanent Deletion with CORRECT password (Expect 200)
    status, del_res, _ = request_json(
        f"{BASE_URL}/v1/keys/{key_id}/delete",
        method="POST",
        data={"password": test_password},
        headers=auth_headers
    )
    assert status == 200, f"Permanent key deletion failed: {del_res}"
    print(f"  - Verified: Key permanently deleted with correct password: {del_res.get('message')}")

    print("\n==================================================")
    print("ALL SCALES METRICS & TESTS VERIFIED SUCCESSFULLY!")
    print("==================================================")

if __name__ == "__main__":
    main()
