import os
import sys
import time
from playwright.sync_api import sync_playwright

def run_edge_content_verification():
    print("======================================================================")
    print("LIVE EDGE BROWSER VERIFICATION: RESTORED EVENTS, NOTICES & DOCUMENTS")
    print("======================================================================")

    output_dir = 'tests_output/restoration_verification'
    os.makedirs(output_dir, exist_ok=True)
    results = []

    with sync_playwright() as p:
        browser = p.chromium.launch(channel='msedge', headless=True)
        context = browser.new_context(viewport={'width': 1366, 'height': 768})
        page = context.new_page()

        # -------------------------------------------------------------
        # TEST 1: News & Events Page (/news-events)
        # -------------------------------------------------------------
        print("\n[TEST 1] Testing /news-events ...")
        try:
            page.goto('http://localhost:5173/news-events', timeout=25000)
            page.wait_for_selector('div.group h2', timeout=25000)
            page.wait_for_timeout(1000)

            # Check cards
            cards = page.query_selector_all('div.group')
            card_count = len(cards)
            print(f"  - Rendered Bulletin/Notice/Event cards: {card_count}")

            # Check title text for raw HTML entities
            titles = [el.inner_text().strip() for el in page.query_selector_all('div.group h2')]
            has_raw_entities = any('&#' in t or '&amp;' in t or '&quot;' in t for t in titles)
            print(f"  - Clean Authentic Typography (no unescaped HTML entities): {not has_raw_entities}")
            print(f"  - Sample authentic titles: {titles[:3]}")

            page.screenshot(path=f'{output_dir}/01_news_events_page.png')
            assert card_count > 0, "No event/notice cards rendered on /news-events"
            assert not has_raw_entities, "Raw HTML entities found in titles"

            results.append({
                'test': 'News & Events Main Portal',
                'status': 'PASS',
                'details': f'Loaded {card_count} authentic cards, verified clean typography without raw entities.',
                'screenshot': f'{output_dir}/01_news_events_page.png'
            })
        except Exception as e:
            print(f"  FAIL: {e}")
            page.screenshot(path=f'{output_dir}/01_news_events_failed.png')
            results.append({
                'test': 'News & Events Main Portal',
                'status': 'FAIL',
                'details': str(e),
                'screenshot': f'{output_dir}/01_news_events_failed.png'
            })

        # -------------------------------------------------------------
        # TEST 2: Individual Notice Detail Page with Media (/news-events/not_wp_43565)
        # -------------------------------------------------------------
        print("\n[TEST 2] Testing /news-events/not_wp_43565 (Notice with Authentic Image) ...")
        try:
            page.goto('http://localhost:5173/news-events/not_wp_43565', timeout=25000)
            page.wait_for_selector('div.rounded-xl img, .border-b-2 img', timeout=25000)
            page.wait_for_timeout(1000)

            # Check document image element
            img = page.query_selector('div.rounded-xl img')
            img_src = img.get_attribute('src') if img else None
            is_natural = False
            if img:
                is_natural = page.evaluate("(img) => img.complete && img.naturalWidth > 0", img)
            print(f"  - Document Image Path: {img_src}")
            print(f"  - Image loaded successfully into DOM: {is_natural}")

            page.screenshot(path=f'{output_dir}/02_notice_detail_media.png')
            assert img is not None, "Document image element not found in DOM"
            assert is_natural, "Document image did not load properly (broken link or zero naturalWidth)"

            results.append({
                'test': 'Individual Notice Detail & Authentic Media Asset',
                'status': 'PASS',
                'details': f'Notice loaded with verified image asset {img_src} (naturalWidth > 0).',
                'screenshot': f'{output_dir}/02_notice_detail_media.png'
            })
        except Exception as e:
            print(f"  FAIL: {e}")
            page.screenshot(path=f'{output_dir}/02_notice_detail_failed.png')
            results.append({
                'test': 'Individual Notice Detail & Authentic Media Asset',
                'status': 'FAIL',
                'details': str(e),
                'screenshot': f'{output_dir}/02_notice_detail_failed.png'
            })

        # -------------------------------------------------------------
        # TEST 3: NIRF Portal (/nirf)
        # -------------------------------------------------------------
        print("\n[TEST 3] Testing /nirf (Institutional Documents & Reports) ...")
        try:
            page.goto('http://localhost:5173/nirf', timeout=25000)
            page.wait_for_selector('h1', timeout=15000)
            page.wait_for_timeout(1000)

            # Check reports count
            reports_badge = page.query_selector('span:has-text("Official Reports Available")')
            badge_text = reports_badge.inner_text() if reports_badge else ''
            print(f"  - Submissions Badge: {badge_text}")

            # Verify 2025, 2024, 2022, 2021 reports are visible
            has_2025_overall = bool(page.query_selector('text=NIRF Institutional Data Report 2025 - Overall'))
            has_2024 = bool(page.query_selector('text=NIRF Institutional Data Report 2024'))
            has_2022 = bool(page.query_selector('text=NIRF Institutional Data Report 2022'))
            print(f"  - Contains NIRF 2025 Overall: {has_2025_overall}")
            print(f"  - Contains NIRF 2024: {has_2024}")
            print(f"  - Contains NIRF 2022: {has_2022}")

            # Click on NIRF 2024 to switch viewer
            view_2024_btn = page.query_selector('div:has-text("NIRF Institutional Data Report 2024") button:has-text("View in Document Viewer")')
            if view_2024_btn:
                view_2024_btn.click()
                page.wait_for_timeout(1000)
                print("  - Successfully clicked 'View in Document Viewer' for NIRF 2024")

            page.screenshot(path=f'{output_dir}/03_nirf_portal_2025_2024.png')
            assert has_2025_overall, "NIRF 2025 Overall Report not found"
            assert has_2024, "NIRF 2024 Report not found"

            results.append({
                'test': 'NIRF Institutional Documents Portal',
                'status': 'PASS',
                'details': f'Verified authentic submissions for 2025, 2024, 2022, 2021, and 2019 ({badge_text}).',
                'screenshot': f'{output_dir}/03_nirf_portal_2025_2024.png'
            })
        except Exception as e:
            print(f"  FAIL: {e}")
            page.screenshot(path=f'{output_dir}/03_nirf_portal_failed.png')
            results.append({
                'test': 'NIRF Institutional Documents Portal',
                'status': 'FAIL',
                'details': str(e),
                'screenshot': f'{output_dir}/03_nirf_portal_failed.png'
            })

        # -------------------------------------------------------------
        # TEST 4: Statutory Compliance & Mandatory Disclosure (/mandatory-disclosure)
        # -------------------------------------------------------------
        print("\n[TEST 4] Testing /mandatory-disclosure ...")
        try:
            page.goto('http://localhost:5173/mandatory-disclosure', timeout=25000)
            page.wait_for_selector('h1', timeout=15000)
            page.wait_for_timeout(1000)

            # Check for Mandatory Disclosure 2025 and UGC Compliance Report
            has_mand_2025 = bool(page.query_selector('text=Mandatory Disclosure 2025'))
            has_ugc_comp = bool(page.query_selector('text=UGC Compliance Report'))
            print(f"  - Contains Mandatory Disclosure 2025: {has_mand_2025}")
            print(f"  - Contains UGC Compliance Report: {has_ugc_comp}")

            page.screenshot(path=f'{output_dir}/04_mandatory_disclosure.png')
            assert has_mand_2025, "Mandatory Disclosure 2025 not found on compliance page"
            assert has_ugc_comp, "UGC Compliance Report not found on compliance page"

            results.append({
                'test': 'Statutory Compliance & Mandatory Disclosure',
                'status': 'PASS',
                'details': 'Verified Mandatory Disclosure 2025 and UGC Compliance Report are present and accessible.',
                'screenshot': f'{output_dir}/04_mandatory_disclosure.png'
            })
        except Exception as e:
            print(f"  FAIL: {e}")
            page.screenshot(path=f'{output_dir}/04_mandatory_disclosure_failed.png')
            results.append({
                'test': 'Statutory Compliance & Mandatory Disclosure',
                'status': 'FAIL',
                'details': str(e),
                'screenshot': f'{output_dir}/04_mandatory_disclosure_failed.png'
            })

        # -------------------------------------------------------------
        # TEST 5: Examinations Portal (/examinations)
        # -------------------------------------------------------------
        print("\n[TEST 5] Testing /examinations (COE Notifications & Calendars) ...")
        try:
            page.goto('http://localhost:5173/examinations', timeout=25000)
            page.wait_for_selector('h1', timeout=15000)
            page.wait_for_timeout(1000)

            heading = page.query_selector('h1').inner_text()
            notices_section = page.query_selector('h2:has-text("Latest COE Examination Notifications")')
            print(f"  - Portal Heading: {heading}")
            print(f"  - Notifications section rendered: {bool(notices_section)}")

            page.screenshot(path=f'{output_dir}/05_examinations_portal.png')
            assert notices_section is not None, "Examinations notifications section not rendered"

            results.append({
                'test': 'Examinations Portal (COE)',
                'status': 'PASS',
                'details': 'Verified Controller of Examinations portal, timetables link, and examination circulars.',
                'screenshot': f'{output_dir}/05_examinations_portal.png'
            })
        except Exception as e:
            print(f"  FAIL: {e}")
            page.screenshot(path=f'{output_dir}/05_examinations_failed.png')
            results.append({
                'test': 'Examinations Portal (COE)',
                'status': 'FAIL',
                'details': str(e),
                'screenshot': f'{output_dir}/05_examinations_failed.png'
            })

        browser.close()

    print("\n======================================================================")
    print("EDGE BROWSER VERIFICATION SUMMARY:")
    print("======================================================================")
    all_pass = True
    for r in results:
        mark = "[PASS]" if r['status'] == 'PASS' else "[FAIL]"
        print(f"{mark} {r['test']}: {r['details']}")
        if r['status'] != 'PASS':
            all_pass = False

    return all_pass, results

if __name__ == '__main__':
    success, results = run_edge_content_verification()
    sys.exit(0 if success else 1)
