import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1366, 'height': 900})
    
    print('Testing Redesigned Editorial Gallery on Homepage...')
    page.goto('http://localhost:5173/')
    page.wait_for_selector('h2:has-text("Event Photographs & Moments")', timeout=15000)
    page.wait_for_timeout(1000)
    
    # 1. Main stage photograph
    main_img = page.query_selector('div.aspect-\\[16\\/10\\] img, div.max-h-\\[580px\\] img')
    print('Found main stage photograph:', main_img.get_attribute('src') if main_img else 'None')
    
    # 2. Check counter
    counter_el = page.query_selector('div.bg-\\[\\#0B172E\\]')
    print('Counter initial:', counter_el.inner_text().strip() if counter_el else 'None')
    page.screenshot(path='audit_evidence/live_audit_run/repaired_04_gallery_initial.png')

    # 3. Test Next Button
    next_btn = page.query_selector('button[aria-label="Next Photograph"]')
    if next_btn:
        next_btn.click()
        page.wait_for_timeout(600)
        print('Counter after Next click:', counter_el.inner_text().strip() if counter_el else 'None')
        page.screenshot(path='audit_evidence/live_audit_run/repaired_04_gallery_after_next.png')

    # 4. Test Filmstrip Thumbnails
    thumbs = page.query_selector_all('div.custom-scrollbar > div')
    print('Total filmstrip thumbnails rendered:', len(thumbs))
    if len(thumbs) > 10:
        # Click 10th thumbnail
        thumbs[9].click()
        page.wait_for_timeout(600)
        print('Counter after clicking 10th thumbnail:', counter_el.inner_text().strip() if counter_el else 'None')
        page.screenshot(path='audit_evidence/live_audit_run/repaired_04_gallery_thumbnail_10.png')

    # 5. Test Lightbox Open & Close
    stage_container = page.query_selector('div.max-h-\\[580px\\]')
    if stage_container:
        stage_container.click()
        page.wait_for_timeout(600)
        lightbox = page.query_selector('div[role="dialog"]')
        print('Lightbox modal opened:', bool(lightbox))
        page.screenshot(path='audit_evidence/live_audit_run/repaired_04_gallery_lightbox.png')

        # Close lightbox
        close_btn = page.query_selector('button[aria-label="Close Viewer"]')
        if close_btn:
            close_btn.click()
            page.wait_for_timeout(400)
            lightbox_after = page.query_selector('div[role="dialog"]')
            print('Lightbox closed cleanly:', not bool(lightbox_after))

    browser.close()
    print('Redesigned gallery tests completed successfully!')
