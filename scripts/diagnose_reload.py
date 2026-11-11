import os, re
from playwright.sync_api import sync_playwright

with open('backend/database/seeders/DatabaseSeeder.php', 'r', encoding='utf-8') as f:
    content = f.read()
m = re.search(r"'email'\s*=>\s*'admin@stphilos\.ac\.in'.*?'password_plain'\s*=>\s*'([^']+)'", content, re.DOTALL)
pwd = m.group(1) if m else ''

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page()

    page.on('console', lambda msg: print(f'[BROWSER CONSOLE] {msg.type}: {msg.text}'))
    page.on('requestfailed', lambda req: print(f'[REQ FAILED] {req.url}: {req.failure}'))
    page.on('response', lambda resp: print(f'[RESP {resp.status}] {resp.url}') if '/api/' in resp.url or '/auth/' in resp.url else None)

    page.goto('http://localhost:5173/admin/login')
    page.fill('#admin-email', 'admin@stphilos.ac.in')
    page.fill('#admin-password', pwd)
    page.click('button[type="submit"]')
    page.wait_for_url('**/admin', timeout=10000)
    print('Logged in, URL:', page.url)

    token = page.evaluate('sessionStorage.getItem("stphilos_auth_token")')
    print('SessionStorage token present:', bool(token))

    # Test F5 reload
    print('Triggering reload...')
    page.reload()
    page.wait_for_timeout(4000)
    print('After reload URL:', page.url)
    browser.close()
