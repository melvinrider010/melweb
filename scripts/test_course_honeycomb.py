import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1366, 'height': 900})
    
    print('Testing Course Honeycomb on Homepage...')
    page.goto('http://localhost:5173/')
    page.wait_for_selector('h2', timeout=15000)
    page.wait_for_timeout(1000)
    
    # 1. Check default display
    showcase_h3 = page.query_selector('div.max-w-4xl h3')
    print('Initial showcase programme:', showcase_h3.inner_text() if showcase_h3 else 'None')
    page.screenshot(path='audit_evidence/live_audit_run/repaired_03_honeycomb_default.png')

    # 2. Hover over BCA
    bca_locator = page.locator('span:text-is("BCA")').first
    bca_locator.hover()
    page.wait_for_timeout(500)
    showcase_h3 = page.query_selector('div.max-w-4xl h3')
    print('After hovering BCA:', showcase_h3.inner_text() if showcase_h3 else 'None')
    page.screenshot(path='audit_evidence/live_audit_run/repaired_03_honeycomb_hover_bca.png')

    # 3. Hover over BSC
    bsc_locator = page.locator('span:text-is("BSC")').first
    bsc_locator.hover()
    page.wait_for_timeout(500)
    showcase_h3 = page.query_selector('div.max-w-4xl h3')
    print('After hovering BSC:', showcase_h3.inner_text() if showcase_h3 else 'None')
    page.screenshot(path='audit_evidence/live_audit_run/repaired_03_honeycomb_hover_bsc.png')

    # 4. Click BCA to pin
    bca_locator.click()
    page.wait_for_timeout(500)
    showcase_h3 = page.query_selector('div.max-w-4xl h3')
    unpin_btn = page.query_selector('button:has-text("Unpin")')
    print('After clicking BCA: Title =', showcase_h3.inner_text() if showcase_h3 else 'None', '| Unpin button visible:', bool(unpin_btn))
    page.screenshot(path='audit_evidence/live_audit_run/repaired_03_honeycomb_click_bca.png')

    # 5. Check Syllabus button link
    syllabus_link = page.query_selector('a:has-text("Explore Syllabus")')
    print('Syllabus destination URL:', syllabus_link.get_attribute('href') if syllabus_link else 'None')

    # 6. Check Apply Online button link
    apply_link = page.query_selector('a:has-text("Apply Online")')
    print('Apply destination URL:', apply_link.get_attribute('href') if apply_link else 'None')

    browser.close()
    print('Honeycomb interaction tests completed successfully!')
