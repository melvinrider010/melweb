import re
from playwright.sync_api import sync_playwright

with open('backend/database/seeders/DatabaseSeeder.php', 'r', encoding='utf-8') as f:
    content = f.read()
m = re.search(r"'email'\s*=>\s*'admin@stphilos\.ac\.in'.*?'password_plain'\s*=>\s*'([^']+)'", content, re.DOTALL)
pwd = m.group(1) if m else ''

with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page()
    page.goto('http://localhost:5173/admin/login')
    page.fill('#admin-email', 'admin@stphilos.ac.in')
    page.fill('#admin-password', pwd)
    page.click('button[type="submit"]')
    page.wait_for_url('**/admin', timeout=8000)

    page.goto('http://localhost:5173/admin/programmes')
    page.wait_for_selector('table tbody tr', timeout=8000)

    row = page.locator('table tbody tr').first
    btns = row.locator('button')
    for i in range(btns.count()):
        print(f'Button {i}:', btns.nth(i).inner_text().strip(), 'title:', btns.nth(i).get_attribute('title'))

    # Click button 0
    print('Clicking button 0...')
    btns.nth(0).click()
    page.wait_for_timeout(2000)
    print('After click Button 0:', row.locator('button').nth(0).inner_text().strip())

    browser.close()
