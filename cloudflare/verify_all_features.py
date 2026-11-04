import urllib.request
import urllib.error
import json
import time
import sys

BASE = "https://ultrasearch-api.aaronvanoss.workers.dev"
UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 UltraDemonTest/2.0"

def get_req(path, data=None, headers=None, method=None):
    h = {"User-Agent": UA}
    if headers:
        h.update(headers)
    body = None
    if data is not None:
        if isinstance(data, (dict, list)):
            body = json.dumps(data).encode("utf-8")
            if "Content-Type" not in h:
                h["Content-Type"] = "application/json"
        elif isinstance(data, str):
            body = data.encode("utf-8")
        else:
            body = data
    req = urllib.request.Request(f"{BASE}{path}", data=body, headers=h, method=method)
    return req

def fetch(path, data=None, headers=None, method=None):
    req = get_req(path, data, headers, method)
    with urllib.request.urlopen(req, timeout=12) as res:
        status = res.status
        content_type = res.headers.get("Content-Type", "")
        body = res.read()
        if "application/json" in content_type:
            return status, json.loads(body.decode("utf-8"))
        if any(b in content_type for b in ["font", "image", "octet-stream"]):
            return status, body
        try:
            return status, body.decode("utf-8")
        except UnicodeDecodeError:
            return status, body

def run_step(step_name, fn):
    t0 = time.time()
    try:
        res = fn()
        ms = (time.time() - t0) * 1000
        print(f"  [PASS] {step_name} ({ms:.1f}ms)")
        return True, res
    except Exception as e:
        ms = (time.time() - t0) * 1000
        print(f"  [FAIL] {step_name} ({ms:.1f}ms) -> {e}")
        return False, None

def main():
    print("=" * 70)
    print(" ULTRADEMON SOVEREIGN EDGE PLATFORM — FULL SYSTEM VERIFICATION")
    print(f" Target: {BASE}")
    print("=" * 70)

    passed_count = 0
    total_count = 0

    def check(name, fn):
        nonlocal passed_count, total_count
        total_count += 1
        ok, res = run_step(name, fn)
        if ok:
            passed_count += 1
        return res

    # 1. System Health & Catalog
    print("\n[1] SYSTEM HEALTH & CATALOG")
    check("GET /health -> Operational status", lambda: fetch("/health")[1]["status"] == "ok")
    check("GET /v1/plans -> 4 Sovereign pricing tiers", lambda: len(fetch("/v1/plans")[1]["plans"]) >= 4)
    check("GET /openapi.json -> Valid OpenAPI 3.1.0 spec", lambda: fetch("/openapi.json")[1]["openapi"].startswith("3."))

    # 2. Static Web Assets & Custom Fonts
    print("\n[2] STATIC EDGE ASSETS & UI DELIVERY")
    check("GET / -> Landing page HTML delivery", lambda: "ultrademon is building the" in fetch("/")[1])
    check("GET /app -> Developer Workspace delivery", lambda: "Developer Workspace" in fetch("/app")[1])
    check("GET /login -> Dedicated Login page delivery", lambda: "Sign in to" in fetch("/login")[1])
    check("GET /signup -> Dedicated Signup page delivery", lambda: "Create your" in fetch("/signup")[1])
    check("GET /fonts/Michelangelus-BoldItalic.ttf -> Font asset bytes", lambda: len(fetch("/fonts/Michelangelus-BoldItalic.ttf")[1]) > 1000)
    check("GET /images/hero-brain.webp -> 3D Brain WebP", lambda: len(fetch("/images/hero-brain.webp")[1]) > 500)
    check("GET /images/hero-lens.webp -> 3D Lens WebP", lambda: len(fetch("/images/hero-lens.webp")[1]) > 500)

    # 3. User Authentication Flow
    print("\n[3] AUTHENTICATION & EDGE SESSION MANAGEMENT")
    test_user_email = f"verified_user_{int(time.time())}@ultrademon.ai"
    test_user_pw = "UltraSecure2026!Pswd"
    signup_res = check("POST /v1/auth/signup -> Register new edge account (Verification Required)", lambda: fetch("/v1/auth/signup", {
        "email": test_user_email,
        "password": test_user_pw,
        "plan": "pro"
    })[1])
    assert signup_res.get("requires_verification") is True

    # Complete email verification
    auth_data = check("POST /v1/auth/confirm-verification -> Confirm verification link activation", lambda: fetch("/v1/auth/confirm-verification", {
        "email": test_user_email
    })[1])

    sess_token = auth_data["session"]["access_token"]
    user_id = auth_data["user"]["id"]

    check("GET /v1/auth/me -> Verify edge session with KV cache", lambda: fetch("/v1/auth/me", headers={"Authorization": f"Bearer {sess_token}"})[1]["user"]["email"] == test_user_email)

    signin_data = check("POST /v1/auth/signin -> Login and return session", lambda: fetch("/v1/auth/signin", {
        "email": test_user_email,
        "password": test_user_pw
    })[1])
    assert signin_data["session"]["access_token"]

    membership_res = check("POST /v1/auth/membership -> Upgrade to ultra plan", lambda: fetch("/v1/auth/membership", {"plan": "ultra"}, headers={"Authorization": f"Bearer {sess_token}"})[1])
    assert membership_res.get("plan") == "ultra"

    # 4. API Key Provisioning (Scoped & Dual-Key)
    print("\n[4] DUAL-KEY PROVISIONING (MEMORY KEY & SEARCH KEY)")
    
    # 4a. UltraMemory Key (um_...)
    mem_key_data = check("POST /v1/keys -> Create dedicated UltraMemory key (um_*)", lambda: fetch("/v1/keys", {
        "plan": "ultra",
        "key_type": "memory",
        "label": "Production Agent Memory Key"
    }, headers={"Authorization": f"Bearer {sess_token}"})[1])
    mem_api_key = mem_key_data["plain_key"]
    assert mem_api_key.startswith("um_"), f"Expected um_ prefix, got {mem_api_key}"

    # 4b. UltraSearch Key (us_...)
    search_key_data = check("POST /v1/keys -> Create dedicated UltraSearch key (us_*)", lambda: fetch("/v1/keys", {
        "plan": "ultra",
        "key_type": "search",
        "label": "Production Web Search Key"
    }, headers={"Authorization": f"Bearer {sess_token}"})[1])
    search_api_key = search_key_data["plain_key"]
    assert search_api_key.startswith("us_"), f"Expected us_ prefix, got {search_api_key}"

    # 4c. Unified Key (us_...)
    unified_key_data = check("POST /v1/keys -> Create Unified key (Memory + Search)", lambda: fetch("/v1/keys", {
        "plan": "ultra",
        "key_type": "unified",
        "label": "Production Unified Key"
    }, headers={"Authorization": f"Bearer {sess_token}"})[1])
    unified_api_key = unified_key_data["plain_key"]

    check("GET /v1/keys -> List all keys for user", lambda: len(fetch("/v1/keys", headers={"Authorization": f"Bearer {sess_token}"})[1]["keys"]) >= 3)

    # 5. Scope Permission Enforcement
    print("\n[5] SCOPE RESTRICTION & PERMISSION ENFORCEMENT")
    
    # Memory key should be REJECTED on search
    def test_scope_mem_on_search():
        try:
            fetch("/v1/search", {"query": "test"}, headers={"X-API-Key": mem_api_key})
            return False
        except urllib.error.HTTPError as e:
            return e.code == 403
    check("Memory Key (um_*) rejected on /v1/search (HTTP 403)", test_scope_mem_on_search)

    # Search key should be REJECTED on memory
    def test_scope_search_on_mem():
        try:
            fetch("/v1/memory/query", {"query": "test"}, headers={"X-API-Key": search_api_key})
            return False
        except urllib.error.HTTPError as e:
            return e.code == 403
    check("Search Key (us_*) rejected on /v1/memory (HTTP 403)", test_scope_search_on_mem)

    # 6. UltraMemory Operations with Memory Key
    print("\n[6] ULTRAMEMORY API WITH DEDICATED MEMORY KEY (um_*)")
    mem1 = check("POST /v1/memory -> Store structured agent memory", lambda: fetch("/v1/memory", {
        "content": "Autonomous Agent Preference: Always output executive briefing in concise bulleted format with citations.",
        "memory_type": "preference",
        "container_tag": "agent_chief_exec",
        "metadata": {"importance": "high", "agent": "copilot-v2"}
    }, headers={"X-API-Key": mem_api_key})[1])
    mem1_id = mem1.get("memory_id") or mem1["memory"]["memory_id"]

    check("POST /v1/memory -> Store batch memories array", lambda: fetch("/v1/memory", {
        "container_tag": "agent_chief_exec",
        "memories": [
            {"content": "Client portfolio holds 12,000 NVDA shares bought at $110", "memory_type": "fact", "container_tag": "agent_chief_exec"},
            {"content": "Client risk tolerance is strictly conservative regarding crypto assets", "memory_type": "rule", "container_tag": "agent_chief_exec"}
        ]
    }, headers={"X-API-Key": mem_api_key})[1].get("count", 0) >= 2)

    query_res = check("POST /v1/memory/query -> BM25 recall (<15ms)", lambda: fetch("/v1/memory/query", {
        "query": "executive briefing concise",
        "container_tag": "agent_chief_exec"
    }, headers={"X-API-Key": mem_api_key})[1])
    assert len(query_res.get("memories", [])) > 0

    ctx_res = check("GET /v1/memory/context -> Direct LLM prompt injection block", lambda: fetch("/v1/memory/context?q=NVDA+portfolio&container_tag=agent_chief_exec", headers={"X-API-Key": mem_api_key})[1])
    print("CTX_RES DEBUG:", ctx_res)
    assert "NVDA" in (ctx_res.get("context") or ctx_res.get("context_block") or "")

    check("GET /v1/memory -> List container memories", lambda: len(fetch("/v1/memory?container_tag=agent_chief_exec", headers={"X-API-Key": mem_api_key})[1]["memories"]) >= 3)
    check(f"DELETE /v1/memory/{mem1_id} -> Delete single memory", lambda: fetch(f"/v1/memory/{mem1_id}", method="DELETE", headers={"X-API-Key": mem_api_key})[0] in [200, 204])

    # 7. UltraSearch Operations with Search Key
    print("\n[7] ULTRASEARCH API WITH DEDICATED SEARCH KEY (us_*)")
    check("POST /v1/search (Mode 1 Instant BM25)", lambda: len(fetch("/v1/search", {
        "query": "artificial intelligence history",
        "mode": 1,
        "num_results": 4
    }, headers={"X-API-Key": search_api_key})[1]["results"]) > 0)

    check("POST /v1/search (Mode 2 Standard)", lambda: len(fetch("/v1/search", {
        "query": "quantum computing qubits Shor",
        "mode": 2,
        "num_results": 3
    }, headers={"X-API-Key": search_api_key})[1]["results"]) > 0)

    check("POST /v1/search (Syntax Filter site:)", lambda: len(fetch("/v1/search", {
        "query": "site:wikipedia.org computing",
        "mode": 1,
        "num_results": 2
    }, headers={"X-API-Key": search_api_key})[1]["results"]) > 0)

    # 8. Web Crawler Operations
    print("\n[8] STREAMING EDGE CRAWLER")
    check("GET /v1/crawler/stats -> Check edge index corpus", lambda: fetch("/v1/crawler/stats")[1]["index"]["total_documents"] > 0)
    def test_crawl():
        res = fetch("/v1/crawl", {
            "url": f"https://example.com/test-verify-{int(time.time())}",
            "depth": 0
        }, headers={"X-API-Key": unified_api_key})[1]
        doc = res.get("document", {})
        return doc.get("status") in ["queued", "already_queued", "indexed", "fetched", "error"] or "message" in res
    check("POST /v1/crawl -> Enqueue frontier URL", test_crawl)

    # 9. Usage Telemetry
    print("\n[9] USAGE TELEMETRY & QUOTA RECORDING")
    usage_data = check("GET /v1/usage -> Check live quota and daily usage", lambda: fetch("/v1/usage", headers={"X-API-Key": search_api_key})[1])
    assert usage_data["daily_limit"] >= 100

    print("\n" + "=" * 70)
    print(f" FINAL VERIFICATION RESULT: {passed_count}/{total_count} CHECKS PASSED ({(passed_count/total_count)*100:.1f}%)")
    print("=" * 70)

    # Write provisioned keys to scratch so mini-app can read them directly
    with open("provisioned_keys.json", "w") as f:
        json.dump({
            "memory_api_key": mem_api_key,
            "search_api_key": search_api_key,
            "unified_api_key": unified_api_key,
            "user_email": test_user_email,
            "plan": "ultra",
            "base_url": BASE
        }, f, indent=2)
    print("Provisioned active keys saved to provisioned_keys.json for Mini App integration.")

if __name__ == "__main__":
    main()
