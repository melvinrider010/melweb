import sys
from playwright.sync_api import sync_playwright

sys.stdout.reconfigure(encoding='utf-8')
with sync_playwright() as p:
    browser = p.chromium.launch(channel='msedge', headless=True)
    page = browser.new_page(viewport={'width': 1366, 'height': 900})
    
    url_feedback = 'http://localhost:5173/news-events/not_wp_42405'
    print('Testing Students Feedback 2025:', url_feedback)
    page.goto(url_feedback)
    page.wait_for_selector('h2', timeout=10000)
    page.wait_for_timeout(1500)
    
    # Check for PDF viewer / iframe
    iframe = page.query_selector('iframe')
    print('Found PDF iframe:', bool(iframe))
    download_btn = page.query_selector('a:has-text("Download PDF")')
    print('Found Download PDF button:', bool(download_btn))
    
    # Check if raw string is gone
    body_text = page.inner_text('body')
    has_raw_scrape = 'Student_Feedback_Report_2025(1) (1) Download' in body_text
    print('Raw scrape string still in body text:', has_raw_scrape)

    page.screenshot(path='audit_evidence/live_audit_run/repaired_02_students_feedback_pdf.png')
    print('Captured screenshot to repaired_02_students_feedback_pdf.png')

    browser.close()
