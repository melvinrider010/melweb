import os
import re
from playwright.sync_api import sync_playwright

with open('backend/database/seeders/DatabaseSeeder.php', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r"'email'\s*=>\s*'admin@stphilos\.ac\.in'.*?'password_plain'\s*=>\s*'([^']+)'", content, re.DOTALL)
pwd = m.group(1) if m else ''

os.makedirs('tests_output', exist_ok=True)

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page()

    # 1. Unauthenticated direct access to /admin
    page.goto('http://localhost:5173/admin')
    page.wait_for_timeout(2000)
    print('1. Direct /admin URL:', page.url)
    page.screenshot(path='tests_output/01_unauthenticated_direct_access.png')

    # 2. Invalid login test
    page.goto('http://localhost:5173/admin/login')
    page.wait_for_selector('#admin-email', timeout=5000)
    page.fill('#admin-email', 'admin@stphilos.ac.in')
    page.fill('#admin-password', 'wrongpassword123')
    page.click('button[type="submit"]')
    page.wait_for_timeout(2000)
    err = page.query_selector('.anim-shake, [role="alert"], .text-red-500, .bg-red-500\\/10')
    print('2. Invalid login error element found:', bool(err))
    if err:
        print('   Error text:', err.inner_text().strip())
    page.screenshot(path='tests_output/02_invalid_credentials_error.png')

    # 3. Valid login test
    page.fill('#admin-password', pwd)
    page.click('button[type="submit"]')
    page.wait_for_timeout(3000)
    print('3. After valid login URL:', page.url)
    print('   Page title:', page.title())
    page.screenshot(path='tests_output/03_dashboard_after_login.png')

    # 4. Check if dashboard loaded
    dash = page.query_selector('h1, h2, nav')
    print('4. Header text:', dash.inner_text() if dash else 'None')

    # 5. Reload test
    page.reload()
    page.wait_for_timeout(3000)
    print('5. After reload URL:', page.url)
    page.screenshot(path='tests_output/04_after_page_reload.png')

    browser.close()
