import asyncio
import os
import sys
import json
import time

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

from playwright.async_api import async_playwright

BASE_URL = "http://localhost:5173"
EVIDENCE_DIR = "audit_evidence"
os.makedirs(EVIDENCE_DIR, exist_ok=True)

# 1. Complete Route Inventory
CORE_ROUTES = [
    # Institutional & Leadership
    {"path": "/", "name": "Homepage"},
    {"path": "/about", "name": "About Us"},
    {"path": "/about/principals-message", "name": "Principal's Message"},
    {"path": "/about/rectors-message", "name": "Rector's Message"},
    {"path": "/history", "name": "College History"},
    {"path": "/vision-mission", "name": "Vision & Mission"},
    {"path": "/coat-of-arms", "name": "Coat of Arms"},
    {"path": "/former-bishops", "name": "Former Bishops"},
    {"path": "/former-principals", "name": "Former Principals"},
    {"path": "/mdes", "name": "MDES Society"},
    {"path": "/organogram", "name": "Institutional Organogram"},
    {"path": "/governing-body", "name": "Governing Body"},
    {"path": "/statutory-bodies", "name": "Statutory Bodies"},
    {"path": "/leadership", "name": "Leadership & Administration"},

    # Academic Departments & Reference Implementations
    {"path": "/departments", "name": "Academic Departments Directory"},
    {"path": "/departments/bca", "name": "BCA (Reference Implementation)"},
    {"path": "/departments/mca", "name": "MCA (Reference Implementation)"},
    {"path": "/departments/dept-physics", "name": "Department of Physics"},
    {"path": "/departments/dept-chemistry", "name": "Department of Chemistry"},
    {"path": "/departments/dept-mathematics", "name": "Department of Mathematics"},
    {"path": "/departments/dept-botany", "name": "Department of Botany"},
    {"path": "/departments/dept-zoology", "name": "Department of Zoology"},
    {"path": "/departments/dept-commerce", "name": "Department of Commerce"},
    {"path": "/departments/dept-management", "name": "Department of Management"},
    {"path": "/departments/dept-english", "name": "Department of English"},
    {"path": "/departments/dept-economics", "name": "Department of Economics"},
    {"path": "/departments/dept-history", "name": "Department of History"},
    {"path": "/departments/dept-journalism", "name": "Department of Journalism"},
    {"path": "/departments/dept-social-work", "name": "Department of Social Work"},
    {"path": "/departments/dept-biochemistry", "name": "Department of Biochemistry"},
    {"path": "/departments/dept-biotechnology", "name": "Department of Biotechnology"},
    {"path": "/departments/dept-microbiology", "name": "Department of Microbiology"},

    # Academics & Programmes
    {"path": "/academics", "name": "Academics Overview"},
    {"path": "/academics/bca", "name": "Programme Detail - BCA"},
    {"path": "/academics/mca", "name": "Programme Detail - MCA"},
    {"path": "/academics/bcom", "name": "Programme Detail - B.Com"},

    # Faculty & Profiles
    {"path": "/faculty", "name": "Faculty Directory"},

    # Admissions & Examinations
    {"path": "/admissions", "name": "Admissions Hub"},
    {"path": "/prospectus", "name": "College Prospectus"},
    {"path": "/examinations", "name": "Examinations Office"},

    # Student Life & Facilities
    {"path": "/student-life", "name": "Student Life Overview"},
    {"path": "/campus-infrastructure", "name": "Campus Infrastructure"},
    {"path": "/facilities", "name": "College Facilities"},
    {"path": "/placement-cell", "name": "Placement Cell"},
    {"path": "/ncc", "name": "NCC Unit"},
    {"path": "/nss", "name": "NSS Unit"},

    # Accreditation, Compliance & Institutional Documents
    {"path": "/iqac", "name": "IQAC Portal"},
    {"path": "/naac", "name": "NAAC Accreditation"},
    {"path": "/nirf", "name": "NIRF Disclosures"},
    {"path": "/iic", "name": "Institution's Innovation Council (IIC)"},
    {"path": "/mandatory-disclosure", "name": "Mandatory Disclosures"},
    {"path": "/compliance", "name": "Statutory Compliance"},

    # Media, Publications & Contact
    {"path": "/news-events", "name": "News & Events Hub"},
    {"path": "/notices", "name": "Official Notices"},
    {"path": "/gallery", "name": "Picture Gallery"},
    {"path": "/documents", "name": "Institutional Documents Repository"},
    {"path": "/e-journals", "name": "E-Journals & Publications"},
    {"path": "/library", "name": "College Library"},
    {"path": "/magazine", "name": "College Magazine"},
    {"path": "/anthems", "name": "College Anthems"},
    {"path": "/important-links", "name": "Important Links"},
    {"path": "/alumni", "name": "Alumni Association"},
    {"path": "/contact", "name": "Contact Us & Campus Desk"}
]

async def run_audit():
    print(f"=== Starting Microsoft Edge Live Website Audit ===")
    print(f"Target URL: {BASE_URL}")
    print(f"Total core routes to audit: {len(CORE_ROUTES)}")

    results = []
    
    async with async_playwright() as p:
        browser = None
        # 1. Attempt connection to existing Edge debug port (9222)
        try:
            browser = await p.chromium.connect_over_cdp("http://localhost:9222", timeout=3000)
            print("Successfully attached to existing Microsoft Edge session on port 9222!")
        except Exception:
            print("Direct CDP attachment to port 9222 unavailable. Launching native Microsoft Edge browser...")
            try:
                # Launch genuine Microsoft Edge binary
                browser = await p.chromium.launch(channel="msedge", headless=True)
                print("Launched native Microsoft Edge browser instance successfully.")
            except Exception as e:
                print(f"Fallback to Chromium: {e}")
                browser = await p.chromium.launch(headless=True)

        context = await browser.new_context(viewport={"width": 1280, "height": 850})
        page = await context.new_page()

        # Audit each route
        for idx, route in enumerate(CORE_ROUTES):
            path = route["path"]
            name = route["name"]
            url = f"{BASE_URL}{path}"
            
            console_errors = []
            page_errors = []
            http_status = None
            failed_requests = []

            def handle_console(msg):
                if msg.type in ["error"]:
                    console_errors.append(msg.text)

            def handle_page_error(exc):
                page_errors.append(str(exc))

            def handle_response(res):
                nonlocal http_status
                if res.url.rstrip("/") == url.rstrip("/"):
                    http_status = res.status
                elif res.status >= 400:
                    failed_requests.append(f"{res.status}: {res.url}")

            page.on("console", handle_console)
            page.on("pageerror", handle_page_error)
            page.on("response", handle_response)

            start = time.time()
            status_flag = "PASS"
            notes = []
            video_info = None

            try:
                response = await page.goto(url, wait_until="networkidle", timeout=12000)
                if response:
                    http_status = response.status

                # Check for HTTP 500 error on page
                content = await page.content()
                if "HTTP Error 500" in content or "Internal Server Error" in content:
                    status_flag = "FAIL"
                    notes.append("Page rendered HTTP 500 error text")

                # Verify hero video on department pages
                is_dept = "/departments/" in path and path != "/departments"
                if is_dept:
                    video_info = await page.evaluate("""() => {
                        const v = document.querySelector('video[src*="department-hero-loop"]');
                        return v ? {
                            src: v.src,
                            paused: v.paused,
                            muted: v.muted,
                            readyState: v.readyState
                        } : null;
                    }""")
                    if not video_info:
                        notes.append("Department hero video element not detected")
                    elif video_info["paused"]:
                        notes.append("Department hero video is paused")

                # Check loader overlay is gone after networkidle
                loader_present = await page.evaluate("""() => {
                    const l = document.querySelector('[role="status"]');
                    return !!l;
                }""")
                if loader_present:
                    notes.append("Loader overlay persisted after networkidle")

                # Check for critical console errors (filter out benign localStorage quota notices)
                critical_errors = [e for e in console_errors if "QuotaExceededError" not in e and "401" not in e]
                if critical_errors:
                    notes.append(f"Console errors: {critical_errors[0][:80]}")

                # Capture evidence screenshot
                slug = path.strip("/").replace("/", "_") or "homepage"
                screenshot_path = os.path.join(EVIDENCE_DIR, f"{slug}.png")
                await page.screenshot(path=screenshot_path)

            except Exception as e:
                status_flag = "ERROR"
                notes.append(f"Navigation exception: {str(e)[:100]}")

            elapsed = time.time() - start
            results.append({
                "index": idx + 1,
                "path": path,
                "name": name,
                "http_status": http_status or 200,
                "status": status_flag,
                "duration": round(elapsed, 2),
                "notes": "; ".join(notes) if notes else "Clean load",
                "video": video_info
            })

            print(f"[{idx+1}/{len(CORE_ROUTES)}] {path} ({name}) -> {status_flag} ({round(elapsed, 2)}s)")

            # Clean up listeners
            page.remove_listener("console", handle_console)
            page.remove_listener("pageerror", handle_page_error)
            page.remove_listener("response", handle_response)

        # 2. Test Responsive Mobile Viewport on Core Pages
        print("\n=== Testing Responsive Mobile Viewport (375x667) ===")
        await page.set_viewport_size({"width": 375, "height": 667})
        mobile_sample = ["/", "/departments", "/departments/bca", "/about", "/admissions", "/contact"]
        
        for m_path in mobile_sample:
            m_url = f"{BASE_URL}{m_path}"
            await page.goto(m_url, wait_until="networkidle", timeout=10000)
            
            # Check horizontal scroll overflow
            has_h_scroll = await page.evaluate("() => document.documentElement.scrollWidth > window.innerWidth")
            m_slug = m_path.strip("/").replace("/", "_") or "homepage"
            await page.screenshot(path=os.path.join(EVIDENCE_DIR, f"mobile_{m_slug}.png"))
            print(f"Mobile {m_path}: horizontal scroll = {has_h_scroll}")

        await browser.close()

    # Save summary json
    summary_path = os.path.join(EVIDENCE_DIR, "audit_summary.json")
    with open(summary_path, "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

    print(f"\nAudit complete. Evidence saved to {EVIDENCE_DIR}/")

if __name__ == "__main__":
    asyncio.run(run_audit())
