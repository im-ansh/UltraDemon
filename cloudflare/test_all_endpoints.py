import urllib.request
import json
import time

BASE = "https://ultrasearch-api.aaronvanoss.workers.dev"

def test(name, func):
    try:
        t0 = time.time()
        func()
        dt = (time.time() - t0) * 1000
        print(f"PASS: {name} ({dt:.1f}ms)")
        return True
    except Exception as e:
        print(f"FAIL: {name} -> {e}")
        return False

UA = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 UltraDemonTest/2.0"

def get_req(url, data=None, headers=None):
    h = {"User-Agent": UA}
    if headers:
        h.update(headers)
    return urllib.request.Request(url, data=data, headers=h)

# 1. Health
def t_health():
    with urllib.request.urlopen(get_req(f"{BASE}/health")) as r:
        assert r.status == 200
        data = json.loads(r.read())
        assert data.get("status") == "ok"

# 2. Plans
def t_plans():
    with urllib.request.urlopen(get_req(f"{BASE}/v1/plans")) as r:
        assert r.status == 200
        data = json.loads(r.read())
        assert len(data.get("plans", [])) >= 4

# 3. Public BM25 Search
def t_search():
    req = get_req(
        f"{BASE}/v1/search",
        data=json.dumps({"query": "Python", "num_results": 3, "mode": 1}).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as r:
        assert r.status == 200
        data = json.loads(r.read())
        assert "results" in data
        assert len(data["results"]) > 0

# 4. Public Memory Store
stored_id = None
def t_store_mem():
    global stored_id
    req = get_req(
        f"{BASE}/v1/memory",
        data=json.dumps({
            "content": "UltraDemon sovereign agent memory engine tested at Cloudflare edge",
            "memory_type": "fact",
            "container_tag": "test_agent"
        }).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as r:
        assert r.status in [200, 201]
        data = json.loads(r.read())
        mem_id = data.get("memory_id") or (data.get("memory") and data["memory"].get("memory_id"))
        assert mem_id is not None
        stored_id = mem_id

# 5. Public Memory Recall
def t_query_mem():
    req = get_req(
        f"{BASE}/v1/memory/query",
        data=json.dumps({"query": "UltraDemon"}).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as r:
        assert r.status == 200
        data = json.loads(r.read())
        items = data.get("memories") or data.get("results") or []
        assert len(items) > 0

# 6. List Memories
def t_list_mem():
    req = get_req(f"{BASE}/v1/memory?limit=10")
    with urllib.request.urlopen(req) as r:
        assert r.status == 200
        data = json.loads(r.read())
        assert "memories" in data

# 7. Crawler Stats
def t_crawler_stats():
    with urllib.request.urlopen(get_req(f"{BASE}/v1/crawler/stats")) as r:
        assert r.status == 200
        data = json.loads(r.read())
        total_docs = data.get("index", {}).get("total_documents") or data.get("total_documents")
        assert total_docs and total_docs > 0

# 8. Usage endpoint
def t_usage():
    with urllib.request.urlopen(get_req(f"{BASE}/v1/usage")) as r:
        assert r.status == 200
        data = json.loads(r.read())
        assert "daily_limit" in data

# 9. Auth Signup & Signin
session_token = None
test_email = f"test_{int(time.time())}@ultrademon.ai"
def t_auth():
    global session_token
    req = get_req(
        f"{BASE}/v1/auth/signup",
        data=json.dumps({"email": test_email, "password": "Password123!Secure"}).encode(),
        headers={"Content-Type": "application/json"}
    )
    with urllib.request.urlopen(req) as r:
        assert r.status in [200, 201]
        data = json.loads(r.read())
        assert "session" in data
        session_token = data["session"]["access_token"]
        assert "initial_key" in data

# 10. Auth Me
def t_auth_me():
    req = get_req(
        f"{BASE}/v1/auth/me",
        headers={"Authorization": f"Bearer {session_token}"}
    )
    with urllib.request.urlopen(req) as r:
        assert r.status == 200
        data = json.loads(r.read())
        assert data["user"]["email"] == test_email

# 11. Keys list with session token
def t_keys():
    req = get_req(
        f"{BASE}/v1/keys",
        headers={"Authorization": f"Bearer {session_token}"}
    )
    with urllib.request.urlopen(req) as r:
        assert r.status == 200
        data = json.loads(r.read())
        assert "keys" in data
        assert len(data["keys"]) >= 1

if __name__ == "__main__":
    print("Running All-App Test Suite on https://ultrasearch-api.aaronvanoss.workers.dev ...")
    results = [
        test("Health check (/health)", t_health),
        test("Subscription Plans (/v1/plans)", t_plans),
        test("Edge Search Public Sandbox (/v1/search)", t_search),
        test("Store Memory Public Sandbox (/v1/memory)", t_store_mem),
        test("Recall Memory BM25 Sandbox (/v1/memory/query)", t_query_mem),
        test("List Memories (/v1/memory)", t_list_mem),
        test("Edge Crawler Stats (/v1/crawler/stats)", t_crawler_stats),
        test("Usage Telemetry (/v1/usage)", t_usage),
        test("Auth Signup (/v1/auth/signup)", t_auth),
        test("Auth Session Verification (/v1/auth/me)", t_auth_me),
        test("Workspace Keys Resolution (/v1/keys)", t_keys),
    ]

    all_passed = all(results)
    print(f"Overall Result: {'100% SUCCESS - ALL TESTS PASSED' if all_passed else 'SOME TESTS FAILED'}")
