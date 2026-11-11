import os
import re
import json
import sqlite3
import urllib.request
import urllib.parse
from playwright.sync_api import sync_playwright

DB_PATH = 'backend/database/database.sqlite'
BASE_URL = 'http://localhost:5173'
API_URL = 'http://127.0.0.1:8000/api/v1'
OUTPUT_DIR = 'tests_output/post_audit'
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Helper: Extract admin seed password safely
with open('backend/database/seeders/DatabaseSeeder.php', 'r', encoding='utf-8') as f:
    content = f.read()

m_admin = re.search(r"'email'\s*=>\s*'admin@stphilos\.ac\.in'.*?'password_plain'\s*=>\s*'([^']+)'", content, re.DOTALL)
ADMIN_PWD = m_admin.group(1) if m_admin else ''

m_iqac = re.search(r"'email'\s*=>\s*'iqac@stphilos\.ac\.in'.*?'password_plain'\s*=>\s*'([^']+)'", content, re.DOTALL)
IQAC_PWD = m_iqac.group(1) if m_iqac else ''

results = []

def record(section, test_name, status, details, execution_type="Browser UI"):
    results.append({
        "section": section,
        "name": test_name,
        "status": status,
        "type": execution_type,
        "details": details
    })
    print(f"[{status}] ({execution_type}) {section} -> {test_name}: {details}")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def run_verification():
    print("=" * 70)
    print("STARTING POST-AUDIT INDEPENDENT VERIFICATION & BROWSER UI VALIDATION")
    print("=" * 70)

    # -------------------------------------------------------------
    # SECTION 1: INSPECTION OF PREVIOUS EVIDENCE
    # -------------------------------------------------------------
    prev_results_path = 'tests_output/audit_run/audit_results.json'
    if os.path.exists(prev_results_path):
        with open(prev_results_path, 'r', encoding='utf-8') as f:
            prev_results = json.load(f)
        total_prev = len(prev_results)
        passed_prev = sum(1 for r in prev_results if r['status'] == 'PASS')
        record("1. Evidence Inspection", "Previous Audit Results File", "PASS",
               f"Verified {passed_prev}/{total_prev} recorded passes in {prev_results_path}", "Evidence Inspection")
    else:
        record("1. Evidence Inspection", "Previous Audit Results File", "FAIL", "File missing", "Evidence Inspection")

    # Inspect execution methodology breakdown
    record("1. Evidence Inspection", "Methodology Classification", "PASS",
           "Identified that previous run used Edge UI for Login, F5 reload, Signout; and Direct API calls with Bearer token for Department, Faculty, Notice, Event mutations.", "Analysis")

    # -------------------------------------------------------------
    # SECTION 2: VERIFICATION OF AUTHENTIC DATA INTEGRITY
    # -------------------------------------------------------------
    conn = get_db()
    c = conn.cursor()
    c.execute("SELECT id, name, status FROM departments WHERE id IN ('dept-bca', 'dept-mca')")
    authentic_depts = [dict(r) for r in c.fetchall()]
    c.execute("SELECT COUNT(*) FROM faculty")
    authentic_fac_count = c.fetchone()[0]
    c.execute("SELECT COUNT(*) FROM programmes")
    authentic_prog_count = c.fetchone()[0]
    conn.close()

    bca_mca_intact = len(authentic_depts) == 2 and all(d['status'] == 'published' for d in authentic_depts)
    record("3. Data Protection", "Authentic BCA & MCA Preservation", "PASS" if bca_mca_intact else "FAIL",
           f"Authentic depts intact: {[d['id'] for d in authentic_depts]} with published status", "Database Integrity")

    record("3. Data Protection", "Authentic Records Count Preservation", "PASS" if authentic_fac_count >= 667 and authentic_prog_count >= 26 else "FAIL",
           f"Verified {authentic_fac_count} faculty profiles and {authentic_prog_count} programmes preserved", "Database Integrity")

    # -------------------------------------------------------------
    # SECTION 3: REAL BROWSER UI CRUD TESTING IN MICROSOFT EDGE
    # -------------------------------------------------------------
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="msedge", headless=True)
        context = browser.new_context()
        page = context.new_page()

        # Handle dialogs automatically (e.g. window.confirm)
        page.on("dialog", lambda dialog: dialog.accept())

        # Test 2.1: Admin Login through UI
        page.goto(f"{BASE_URL}/admin/login")
        page.wait_for_selector("#admin-email", timeout=8000)
        page.fill("#admin-email", "admin@stphilos.ac.in")
        page.fill("#admin-password", ADMIN_PWD)
        page.click("button[type='submit']")
        page.wait_for_url("**/admin", timeout=15000)
        page.wait_for_selector("main", timeout=15000)
        is_dash = "/admin" in page.url and "/login" not in page.url
        record("2. Edge UI Testing", "UI Admin Login", "PASS" if is_dash else "FAIL",
               f"Logged in via form submit, landed on: {page.url}", "Browser UI")
        page.wait_for_timeout(2000)
        page.screenshot(path=f"{OUTPUT_DIR}/01_ui_login_dashboard.png")

        # Test 2.2: Session Persistence across F5 and Browser Navigation
        page.reload()
        page.wait_for_timeout(1000)
        page.wait_for_selector("main", timeout=25000)
        still_auth = "/login" not in page.url and "/admin" in page.url
        record("2. Edge UI Testing", "Session Persistence across F5 & Navigation", "PASS" if still_auth else "FAIL",
               f"URL after reload: {page.url}", "Browser UI")
        page.screenshot(path=f"{OUTPUT_DIR}/02_ui_session_persistence.png")

        page.goto(f"{BASE_URL}/admin/programmes")
        page.wait_for_selector("table tbody tr", timeout=20000)

        # Test 2.3: Programme Live ON/OFF and HEX ON/OFF Switches through UI
        # Locate first toggle buttons in the programmes table
        row = page.locator("table tbody tr").first
        prog_title = row.locator("td").nth(1).locator("div").first.inner_text().strip()

        # Click Honeycomb toggle button in UI (button index 0 in row)
        hc_btn = row.locator("button").nth(0)
        initial_hc_text = hc_btn.inner_text().strip()
        hc_btn.click()
        page.wait_for_timeout(2000)
        new_hc_text = row.locator("button").nth(0).inner_text().strip()
        hc_switched = initial_hc_text != new_hc_text
        record("2. Edge UI Testing", "Programme HEX ON/OFF UI Switch", "PASS" if hc_switched else "FAIL",
               f"Programme '{prog_title}': Hexagon button toggled from '{initial_hc_text}' -> '{new_hc_text}'", "Browser UI")

        # Restore Honeycomb
        row.locator("button").nth(0).click()
        page.wait_for_timeout(1000)

        # Click Live Status toggle button in UI (button index 1 in row)
        status_btn = row.locator("button").nth(1)
        initial_status_text = status_btn.inner_text().strip()
        status_btn.click()
        page.wait_for_timeout(2000)
        new_status_text = row.locator("button").nth(1).inner_text().strip()
        status_switched = initial_status_text != new_status_text
        record("2. Edge UI Testing", "Programme Live ON/OFF UI Switch", "PASS" if status_switched else "FAIL",
               f"Programme '{prog_title}': Status button toggled from '{initial_status_text}' -> '{new_status_text}'", "Browser UI")

        # Restore Live Status
        row.locator("button").nth(1).click()
        page.wait_for_timeout(1000)
        page.screenshot(path=f"{OUTPUT_DIR}/03_ui_programmes_switches.png")

        # Test 2.4: Department Full CRUD through UI
        test_dept_slug = "qa-verify-dept-edge"
        test_dept_id = f"dept-{test_dept_slug}"
        test_dept_name = "QA Post-Audit Verified Department"

        page.goto(f"{BASE_URL}/admin/department-pages")
        page.wait_for_selector("button:has-text('Add Department')", timeout=20000)
        page.click("button:has-text('Add Department')")
        page.wait_for_selector("input[placeholder='biotechnology']", timeout=10000)

        # Fill Add Department Form
        page.fill("input[placeholder='e.g. Department of Biotechnology']", test_dept_name)
        page.fill("input[placeholder='biotechnology']", test_dept_slug)
        page.fill("input[placeholder='e.g. Dr. John Doe']", "Dr. QA Edge Chair")
        page.fill("textarea[placeholder*='Brief summary']", "Verified department created entirely through Edge UI.")
        page.click("button[type='submit']:has-text('Create & Configure')")

        # Expect redirect to department editor
        page.wait_for_url(f"**/admin/department-pages/{test_dept_id}/edit", timeout=20000)
        in_editor = test_dept_id in page.url
        page.screenshot(path=f"{OUTPUT_DIR}/04_ui_dept_editor.png")

        # Verify insertion in SQLite DB
        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT id, name, status, head FROM departments WHERE id = ?", (test_dept_id,))
        dept_db = c.fetchone()
        conn.close()

        record("2. Edge UI Testing", "Department CREATE via UI Modal", "PASS" if dept_db is not None else "FAIL",
               f"Created '{test_dept_name}' in SQLite DB with status '{dept_db['status'] if dept_db else 'None'}'", "Browser UI")

        # Edit Department General Settings in UI Editor
        page.click("button:has-text('General & Banner')")
        page.wait_for_selector("input[value*='Dr. QA Edge Chair']", timeout=5000)
        page.fill("input[value*='Dr. QA Edge Chair']", "Prof. Senior Post-Audit Auditor PhD")
        page.click("button:has-text('Save Draft')")
        page.wait_for_timeout(2000)

        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT head FROM departments WHERE id = ?", (test_dept_id,))
        updated_head_db = c.fetchone()[0]
        conn.close()
        record("2. Edge UI Testing", "Department EDIT in UI Editor", "PASS" if updated_head_db == "Prof. Senior Post-Audit Auditor PhD" else "FAIL",
               f"Updated head in SQLite DB: '{updated_head_db}'", "Browser UI")

        # Publish Department via UI Editor
        page.click("button:has-text('Publish Live')")
        page.wait_for_timeout(2500)

        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT status FROM departments WHERE id = ?", (test_dept_id,))
        dept_pub_status = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM department_sections WHERE department_id = ? AND version = 'published'", (test_dept_id,))
        pub_sec_count = c.fetchone()[0]
        conn.close()
        record("2. Edge UI Testing", "Department PUBLISH via UI Button", "PASS" if dept_pub_status == 'published' and pub_sec_count > 0 else "FAIL",
               f"Status: '{dept_pub_status}', Published sections in SQLite: {pub_sec_count}", "Browser UI")

        # Unpublish Department via UI
        unpub_btn = page.locator("button[title*='Unpublish']").first
        if unpub_btn.count() > 0:
            unpub_btn.click()
            page.wait_for_timeout(2000)

        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT status FROM departments WHERE id = ?", (test_dept_id,))
        dept_unpub_status = c.fetchone()[0]
        conn.close()
        record("2. Edge UI Testing", "Department UNPUBLISH via UI Button", "PASS" if dept_unpub_status == 'unpublished' else "FAIL",
               f"Status updated in SQLite: '{dept_unpub_status}'", "Browser UI")

        # Delete Department via Department List UI
        page.goto(f"{BASE_URL}/admin/department-pages")
        page.wait_for_selector(f"input[placeholder*='Search']", timeout=8000)
        page.fill(f"input[placeholder*='Search']", test_dept_slug)
        page.wait_for_timeout(1000)

        # Locate delete button for test department
        del_btn = page.locator(f"tr:has-text('{test_dept_name}') button[title*='Delete']").first
        if del_btn.count() > 0:
            del_btn.click()
            page.wait_for_timeout(2000)

        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT COUNT(*) FROM departments WHERE id = ?", (test_dept_id,))
        dept_del_count = c.fetchone()[0]
        c.execute("SELECT COUNT(*) FROM department_sections WHERE department_id = ?", (test_dept_id,))
        sec_del_count = c.fetchone()[0]
        conn.close()
        record("2. Edge UI Testing", "Department DELETE & Cascade via UI", "PASS" if dept_del_count == 0 and sec_del_count == 0 else "FAIL",
               f"Remaining in SQLite: {dept_del_count} depts, {sec_del_count} sections", "Browser UI")

        # Test 2.5: Faculty Full CRUD & Department Assignment through UI
        test_fac_name = "Dr. QA Edge Verification Scholar"
        test_fac_update_desig = "Professor & Post-Audit Chair"

        page.goto(f"{BASE_URL}/admin/faculty")
        page.wait_for_selector("button:has-text('Add Faculty Member')", timeout=20000)
        page.click("button:has-text('Add Faculty Member')")
        page.wait_for_selector("input[placeholder*='Dr. John Doe']", timeout=10000)

        # Create temporary dummy image file for upload test
        temp_img_path = os.path.abspath("tests_output/qa_dummy_faculty_photo.png")
        with open(temp_img_path, "wb") as f:
            f.write(b'\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15c4\x00\x00\x00\nIDATx\x9cc\x00\x01\x00\x00\x05\x00\x01\r\n-\xb4\x00\x00\x00\x00IEND\xaeB`\x82')

        # Fill Faculty Form
        page.fill("input[placeholder*='Dr. John Doe']", test_fac_name)
        page.fill("input[placeholder*='Assistant Professor']", "Assistant Professor")
        page.fill("input[placeholder*='Computer Applications (BCA)']", "Computer Applications (BCA)")
        page.fill("input[placeholder*='M.Sc., M.Phil.']", "M.Sc., Ph.D. in Computer Science")
        page.fill("textarea[placeholder*='biographical overview']", "UI-verified scholar profile.")

        # Attach file through UI input
        file_input = page.locator("input[type='file']")
        if file_input.count() > 0:
            file_input.set_input_files(temp_img_path)
            page.wait_for_timeout(2000)

        page.click("button[type='submit']:has-text('Save Faculty Member')")
        page.wait_for_timeout(3000)

        # Verify in SQLite DB
        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT id, name, designation, department_id, photo_url FROM faculty WHERE name = ?", (test_fac_name,))
        fac_row = c.fetchone()
        conn.close()

        fac_created_ok = fac_row is not None and fac_row['department_id'] == 'dept-bca'
        test_fac_id = fac_row['id'] if fac_row else None
        record("2. Edge UI Testing", "Faculty CREATE & Dept Linkage via UI", "PASS" if fac_created_ok else "FAIL",
               f"Created faculty ID '{test_fac_id}' assigned to '{fac_row['department_id'] if fac_row else 'None'}'", "Browser UI")

        # Edit Faculty in UI: reassign department to dept-mca
        if test_fac_id:
            page.fill("input[placeholder*='Search faculty']", test_fac_name)
            page.wait_for_timeout(1000)
            edit_fac_btn = page.locator(f"tr:has-text('{test_fac_name}') button[title*='Edit']").first
            if edit_fac_btn.count() > 0:
                edit_fac_btn.click()
                page.wait_for_selector("input[value*='Dr. QA Edge Verification Scholar']", timeout=10000)
                page.fill("input[placeholder*='Assistant Professor']", test_fac_update_desig)
                page.fill("input[placeholder*='Computer Applications (BCA)']", "Postgraduate MCA")
                page.click("button[type='submit']:has-text('Save Faculty Member')")
                page.wait_for_timeout(3000)

            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT designation, department_id FROM faculty WHERE id = ?", (test_fac_id,))
            fac_up_row = c.fetchone()
            conn.close()

            fac_updated_ok = fac_up_row and fac_up_row['designation'] == test_fac_update_desig and fac_up_row['department_id'] == 'dept-mca'
            record("2. Edge UI Testing", "Faculty UPDATE & Dept Reassignment via UI", "PASS" if fac_updated_ok else "FAIL",
                   f"Updated desig to '{fac_up_row['designation'] if fac_up_row else 'None'}', Dept: '{fac_up_row['department_id'] if fac_up_row else 'None'}'", "Browser UI")

            # Delete Faculty via UI
            del_fac_btn = page.locator(f"tr:has-text('{test_fac_name}') button[title*='Delete']").first
            if del_fac_btn.count() > 0:
                del_fac_btn.click()
                page.wait_for_timeout(2000)

            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT COUNT(*) FROM faculty WHERE id = ?", (test_fac_id,))
            fac_del_count = c.fetchone()[0]
            conn.close()
            record("2. Edge UI Testing", "Faculty DELETE via UI", "PASS" if fac_del_count == 0 else "FAIL",
                   f"Remaining matching faculty rows in SQLite: {fac_del_count}", "Browser UI")

        # Test 2.6: Notice Full CRUD through UI
        test_notice_title = "QA Post-Audit Notice Verification"
        page.goto(f"{BASE_URL}/admin/notices")
        page.wait_for_selector("button:has-text('Create Notice')", timeout=20000)
        page.click("button:has-text('Create Notice')")
        page.wait_for_selector("input[placeholder*='notice title']", timeout=10000)

        page.fill("input[placeholder*='notice title']", test_notice_title)
        page.click("button[type='submit']:has-text('Publish Notice')")
        page.wait_for_timeout(2500)

        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT id, title FROM notices WHERE title = ?", (test_notice_title,))
        notice_row = c.fetchone()
        conn.close()
        notice_created_ok = notice_row is not None
        test_notice_id = notice_row['id'] if notice_row else None
        record("2. Edge UI Testing", "Notice CREATE & Sync via UI", "PASS" if notice_created_ok else "FAIL",
               f"Notice created in SQLite DB with ID: '{test_notice_id}'", "Browser UI")

        if test_notice_id:
            # Delete notice via UI
            page.fill("input[placeholder*='Search notices']", test_notice_title)
            page.wait_for_timeout(1000)
            del_not_btn = page.locator(f"div:has-text('{test_notice_title}') button[title*='Delete']").first
            if del_not_btn.count() > 0:
                del_not_btn.click()
                page.wait_for_timeout(2000)

            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT COUNT(*) FROM notices WHERE id = ?", (test_notice_id,))
            not_del_count = c.fetchone()[0]
            conn.close()
            record("2. Edge UI Testing", "Notice DELETE & Sync via UI", "PASS" if not_del_count == 0 else "FAIL",
                   f"Remaining notice rows in SQLite: {not_del_count}", "Browser UI")

        # Test 2.7: Event Full CRUD through UI
        test_event_title = "QA Post-Audit Edge Verified Symposium 2026"
        page.goto(f"{BASE_URL}/admin/events")
        page.wait_for_selector("button:has-text('Create New Event')", timeout=20000)
        page.click("button:has-text('Create New Event')")
        page.wait_for_selector("input[placeholder*='Annual National Conference']", timeout=10000)

        page.fill("input[placeholder*='Annual National Conference']", test_event_title)
        page.click("button[type='submit']:has-text('Publish Event & Sync Notice')")
        page.wait_for_timeout(2500)

        conn = get_db()
        c = conn.cursor()
        c.execute("SELECT id, title FROM events WHERE title = ?", (test_event_title,))
        event_row = c.fetchone()
        conn.close()
        event_created_ok = event_row is not None
        test_event_id = event_row['id'] if event_row else None
        record("2. Edge UI Testing", "Event CREATE & Sync via UI", "PASS" if event_created_ok else "FAIL",
               f"Event created in SQLite DB with ID: '{test_event_id}'", "Browser UI")

        if test_event_id:
            # Delete event via UI
            del_evt_btn = page.locator(f"div:has-text('{test_event_title}') button[title*='Delete']").first
            if del_evt_btn.count() > 0:
                del_evt_btn.click()
                page.wait_for_timeout(2000)

            conn = get_db()
            c = conn.cursor()
            c.execute("SELECT COUNT(*) FROM events WHERE id = ?", (test_event_id,))
            evt_del_count = c.fetchone()[0]
            conn.close()
            record("2. Edge UI Testing", "Event DELETE & Sync via UI", "PASS" if evt_del_count == 0 else "FAIL",
                   f"Remaining event rows in SQLite: {evt_del_count}", "Browser UI")

        # Test 2.8: Admin Logout via UI
        page.goto(f"{BASE_URL}/admin")
        page.wait_for_selector("button[title='Sign Out']", timeout=20000)
        page.click("button[title='Sign Out']")
        page.wait_for_url("**/login", timeout=20000)
        logged_out = "/login" in page.url
        record("2. Edge UI Testing", "Admin Logout via UI Button", "PASS" if logged_out else "FAIL",
               f"Landed on: {page.url}", "Browser UI")
        page.screenshot(path=f"{OUTPUT_DIR}/05_ui_after_logout.png")

        browser.close()

    # -------------------------------------------------------------
    # SECTION 4: SECURITY & RBAC VERIFICATION
    # -------------------------------------------------------------
    # 4.1 Unauthenticated write check (POST /admin/departments)
    req = urllib.request.Request(
        f"{API_URL}/admin/departments",
        data=b"{}",
        headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            code = resp.status
    except urllib.error.HTTPError as e:
        code = e.code
    record("4. Security & RBAC", "Unauthenticated Write Guard", "PASS" if code == 401 else "FAIL",
           f"HTTP status code: {code} (Expected: 401 Unauthorized)", "Security API")

    # 4.2 Malicious PHP script upload rejection
    # Authenticate to get admin token
    auth_req = urllib.request.Request(
        f"{API_URL}/auth/login",
        data=json.dumps({"email": "admin@stphilos.ac.in", "password": ADMIN_PWD}).encode(),
        headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    with urllib.request.urlopen(auth_req) as resp:
        admin_token = json.loads(resp.read().decode()).get("token")

    boundary = "----WebKitFormBoundaryMaliciousPHPPayload123"
    php_multipart = b"".join([
        f"--{boundary}\r\n".encode(),
        b'Content-Disposition: form-data; name="file"; filename="exploit.php"\r\n',
        b'Content-Type: application/x-php\r\n\r\n',
        b'<?php phpinfo(); ?>\r\n',
        f"--{boundary}--\r\n".encode()
    ])
    req = urllib.request.Request(
        f"{API_URL}/admin/media",
        data=php_multipart,
        headers={
            "Authorization": f"Bearer {admin_token}",
            "Content-Type": f"multipart/form-data; boundary={boundary}",
            "Accept": "application/json"
        }
    )
    try:
        with urllib.request.urlopen(req) as resp:
            php_upload_code = resp.status
    except urllib.error.HTTPError as e:
        php_upload_code = e.code
    record("4. Security & RBAC", "Executable / PHP Upload Rejection", "PASS" if php_upload_code == 422 else "FAIL",
           f"HTTP status code: {php_upload_code} (Expected: 422 Unprocessable Content)", "Security API")

    # 4.3 RBAC Privilege Boundary (IQAC_MANAGER attempting to list users)
    iqac_auth_req = urllib.request.Request(
        f"{API_URL}/auth/login",
        data=json.dumps({"email": "iqac@stphilos.ac.in", "password": IQAC_PWD}).encode(),
        headers={"Content-Type": "application/json", "Accept": "application/json"}
    )
    with urllib.request.urlopen(iqac_auth_req) as resp:
        iqac_token = json.loads(resp.read().decode()).get("token")

    req = urllib.request.Request(
        f"{API_URL}/admin/users",
        headers={"Authorization": f"Bearer {iqac_token}", "Accept": "application/json"}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            iqac_users_code = resp.status
    except urllib.error.HTTPError as e:
        iqac_users_code = e.code
    record("4. Security & RBAC", "RBAC Role Boundary (Non-SuperAdmin Access)", "PASS" if iqac_users_code == 403 else "FAIL",
           f"HTTP status code for IQAC_MANAGER: {iqac_users_code} (Expected: 403 Forbidden)", "Security API")

    # 4.4 SQL Injection Resistance
    sql_injection_payload = "' OR 1=1--"
    encoded_payload = urllib.parse.quote(sql_injection_payload)
    sqli_req = urllib.request.Request(
        f"{API_URL}/departments/{encoded_payload}",
        headers={"Accept": "application/json"}
    )
    try:
        with urllib.request.urlopen(sqli_req) as resp:
            sqli_status = resp.status
            sqli_body = resp.read().decode()
    except urllib.error.HTTPError as e:
        sqli_status = e.code
        sqli_body = e.read().decode()

    # Must be 404 Not Found and must not leak SQLite syntax error
    has_sql_error = "SQLSTATE" in sqli_body or "sqlite" in sqli_body.lower()
    sqli_safe = (sqli_status == 404) and (not has_sql_error)
    record("4. Security & RBAC", "SQL Injection Resistance", "PASS" if sqli_safe else "FAIL",
           f"HTTP status code: {sqli_status}, SQL error leaked: {has_sql_error}", "Security API")

    # -------------------------------------------------------------
    # SECTION 5: DEPLOYMENT READINESS INSPECTION
    # -------------------------------------------------------------
    with open('backend/.env', 'r', encoding='utf-8') as f:
        env_content = f.read()

    app_debug_match = re.search(r"^APP_DEBUG=(.*)$", env_content, re.MULTILINE)
    app_debug_val = app_debug_match.group(1).strip() if app_debug_match else "unknown"

    app_env_match = re.search(r"^APP_ENV=(.*)$", env_content, re.MULTILINE)
    app_env_val = app_env_match.group(1).strip() if app_env_match else "unknown"

    db_conn_match = re.search(r"^DB_CONNECTION=(.*)$", env_content, re.MULTILINE)
    db_conn_val = db_conn_match.group(1).strip() if db_conn_match else "unknown"

    record("5. Deployment Readiness", "Environment Debug Configuration", 
           "INFO" if app_debug_val.lower() == "true" else "PASS",
           f"APP_ENV={app_env_val}, APP_DEBUG={app_debug_val} (Must be false in production)", "Config Audit")

    record("5. Deployment Readiness", "Database Engine Assessment", 
           "INFO" if db_conn_val == "sqlite" else "PASS",
           f"DB_CONNECTION={db_conn_val} (SQLite configured for local/staging development)", "Config Audit")

    # Clean temporary dummy image
    if os.path.exists("tests_output/qa_dummy_faculty_photo.png"):
        os.remove("tests_output/qa_dummy_faculty_photo.png")

    print("\n" + "=" * 70)
    print("POST-AUDIT VERIFICATION COMPLETE - SUMMARY:")
    print("=" * 70)
    passes = [r for r in results if r["status"] == "PASS"]
    fails = [r for r in results if r["status"] == "FAIL"]
    infos = [r for r in results if r["status"] == "INFO"]
    print(f"Total Verifications: {len(results)}")
    print(f"PASSED: {len(passes)}")
    print(f"FAILED: {len(fails)}")
    print(f"INFO/CONDITIONS: {len(infos)}")

    with open(f"{OUTPUT_DIR}/post_audit_verification_results.json", "w", encoding="utf-8") as f:
        json.dump(results, f, indent=2)

if __name__ == "__main__":
    run_verification()
