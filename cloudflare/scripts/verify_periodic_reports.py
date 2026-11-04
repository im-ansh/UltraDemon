#!/usr/bin/env python3
import json
import urllib.request
import urllib.error
import sys

BASE_URL = "https://ultrasearch-api.aaronvanoss.workers.dev"

def test_api():
    print("=== 1. Testing GET /v1/analytics/customer-profile (Weekly, Monthly, Yearly) ===")
    periods = ["weekly", "monthly", "yearly"]
    
    for p in periods:
        url = f"{BASE_URL}/v1/analytics/customer-profile?period={p}"
        req = urllib.request.Request(url, headers={"User-Agent": "UltraDemon-Audit/2.0"})
        with urllib.request.urlopen(req) as resp:
            assert resp.status == 200, f"Failed GET for period {p}: status {resp.status}"
            data = json.loads(resp.read().decode('utf-8'))
            assert data.get("report_period") == p, f"Expected period {p}, got {data.get('report_period')}"
            
            icp = data.get("ideal_customer_profile", {})
            abilities = icp.get("daily_abilities", {})
            habits = icp.get("daily_habits", {})
            comparison = data.get("period_comparison", {})
            
            # Assert Daily Abilities
            assert "silicon_tier" in abilities, f"Missing silicon_tier in {p}"
            assert "hardware_concurrency" in abilities, f"Missing hardware_concurrency in {p}"
            assert "device_memory" in abilities, f"Missing device_memory in {p}"
            assert "display_fidelity" in abilities, f"Missing display_fidelity in {p}"
            assert "developer_runtimes" in abilities, f"Missing developer_runtimes in {p}"
            assert "network_profile" in abilities, f"Missing network_profile in {p}"
            
            # Assert Daily Habits
            assert "circadian_pattern" in habits, f"Missing circadian_pattern in {p}"
            assert "peak_productivity_window" in habits, f"Missing peak_productivity_window in {p}"
            assert "flow_state_focus_index" in habits, f"Missing flow_state_focus_index in {p}"
            assert "active_vs_idle" in habits, f"Missing active_vs_idle in {p}"
            assert "cross_device_handover" in habits, f"Missing cross_device_handover in {p}"
            
            # Assert Period Comparison
            assert "power_user_growth" in comparison, f"Missing power_user_growth in {p}"
            assert "retention_delta" in comparison, f"Missing retention_delta in {p}"
            
            print(f"  [PASS] {p.capitalize()} Dossier:")
            print(f"         Persona: {icp.get('persona_title')}")
            print(f"         Silicon: {abilities.get('silicon_tier')}")
            print(f"         Circadian: {habits.get('circadian_pattern')} ({habits.get('peak_productivity_window')})")
            print(f"         Flow State: {habits.get('flow_state_focus_index')}")
            print(f"         Handover: {habits.get('cross_device_handover')}")

    print("\n=== 2. Testing POST /v1/analytics/customer-profile/generate ===")
    gen_url = f"{BASE_URL}/v1/analytics/customer-profile/generate"
    post_body = json.dumps({"period": "weekly"}).encode('utf-8')
    post_req = urllib.request.Request(gen_url, data=post_body, headers={"Content-Type": "application/json", "User-Agent": "UltraDemon-Audit/2.0"})
    with urllib.request.urlopen(post_req) as resp:
        assert resp.status == 200
        gen_data = json.loads(resp.read().decode('utf-8'))
        assert gen_data.get("status") == "synthesized"
        assert gen_data.get("period") == "weekly"
        report = gen_data.get("report", {})
        assert report.get("report_period") == "weekly"
        print(f"  [PASS] Fresh generation returned: {report.get('report_id')}")

    print("\n=== 3. Testing Dashboard UI Elements for Daily Abilities & Habits ===")
    app_url = f"{BASE_URL}/app?tab=analytics"
    req_app = urllib.request.Request(app_url, headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"})
    with urllib.request.urlopen(req_app) as resp:
        html = resp.read().decode('utf-8')
        assert "icpPeriodWeekly" in html, "Missing icpPeriodWeekly button in HTML"
        assert "icpPeriodMonthly" in html, "Missing icpPeriodMonthly button in HTML"
        assert "icpPeriodYearly" in html, "Missing icpPeriodYearly button in HTML"
        assert "Daily Abilities &amp; Hardware Arsenal" in html or "Daily Abilities & Hardware Arsenal" in html, "Missing Abilities section"
        assert "Daily Habits &amp; Circadian Rhythm" in html or "Daily Habits & Circadian Rhythm" in html, "Missing Habits section"
        assert "icpAbilitySilicon" in html, "Missing icpAbilitySilicon in HTML"
        assert "icpAbilityCores" in html, "Missing icpAbilityCores in HTML"
        assert "icpHabitCircadian" in html, "Missing icpHabitCircadian in HTML"
        assert "icpHabitFlowIndex" in html, "Missing icpHabitFlowIndex in HTML"
        assert "icpHabitHandover" in html, "Missing icpHabitHandover in HTML"
        print("  [PASS] All periodic switcher, hardware abilities, and circadian habit UI elements verified live in app!")

    print("\nALL VERIFICATIONS PASSED SUCCESSFULLY!")

if __name__ == "__main__":
    test_api()
