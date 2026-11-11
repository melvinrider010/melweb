import json
import sqlite3
import os
import re
from urllib.parse import urlparse

def run_reconciliation():
    print("======================================================================")
    print("SYSTEM RECONCILIATION & CONTENT FIDELITY AUDIT")
    print("======================================================================")

    # 1. Load Original Authoritative WordPress Datasets
    with open('scripts/all_wp_posts.json', 'r', encoding='utf-8') as f:
        wp_posts = json.load(f)
    print(f"Loaded {len(wp_posts)} original WordPress posts.")

    with open('scripts/all_wp_pages.json', 'r', encoding='utf-8') as f:
        wp_pages = json.load(f)
    print(f"Loaded {len(wp_pages)} original WordPress pages.")

    wp_posts_by_id = {p['id']: p for p in wp_posts}
    wp_posts_by_slug = {p['slug']: p for p in wp_posts}

    wp_pages_by_id = {p['id']: p for p in wp_pages}
    wp_pages_by_slug = {p['slug']: p for p in wp_pages}

    # 2. Load Local SQLite Database
    conn = sqlite3.connect('backend/database/database.sqlite')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    c.execute("SELECT * FROM notices")
    local_notices = [dict(r) for r in c.fetchall()]
    print(f"Loaded {len(local_notices)} local notices from SQLite.")

    c.execute("SELECT * FROM events")
    local_events = [dict(r) for r in c.fetchall()]
    print(f"Loaded {len(local_events)} local events from SQLite.")

    c.execute("SELECT * FROM documents")
    local_documents = [dict(r) for r in c.fetchall()]
    print(f"Loaded {len(local_documents)} local documents from SQLite.")

    conn.close()

    # 3. Analyze Notices vs Original Posts
    print("\n--- ANALYZING LOCAL NOTICES VS ORIGINAL WORDPRESS POSTS ---")
    matched_notices = 0
    title_mismatches = []
    missing_assets = []
    unmatched_notices = []

    for n in local_notices:
        nid = n['id']
        wp_id = None
        m = re.search(r'wp_(\d+)', nid)
        if m:
            wp_id = int(m.group(1))

        orig_post = wp_posts_by_id.get(wp_id) if wp_id else None
        if not orig_post and n.get('slug'):
            orig_post = wp_posts_by_slug.get(n['slug'])

        if orig_post:
            matched_notices += 1
            # Check title
            orig_title = orig_post.get('title', {}).get('rendered', '').strip()
            # Clean HTML entities from orig_title for comparison
            clean_orig_title = orig_title.replace('&#8211;', '–').replace('&#8217;', '’').replace('&#038;', '&').replace('&amp;', '&').replace('&quot;', '"').strip()
            local_title = (n.get('title') or '').strip()

            if clean_orig_title and local_title != clean_orig_title:
                title_mismatches.append({
                    'id': nid,
                    'wp_id': wp_id,
                    'local_title': local_title,
                    'orig_title': clean_orig_title,
                    'slug': n.get('slug')
                })

            # Check document image / asset
            doc_img = n.get('document_image')
            if doc_img:
                local_file = os.path.join('public', doc_img.lstrip('/'))
                if not os.path.exists(local_file):
                    missing_assets.append({
                        'id': nid,
                        'asset_path': doc_img,
                        'type': 'notice_image'
                    })
        else:
            unmatched_notices.append(n)

    print(f"Total Local Notices Checked: {len(local_notices)}")
    print(f"Matched with Authoritative WP Posts: {matched_notices} ({matched_notices/len(local_notices)*100:.1f}%)")
    print(f"Unmatched Local Notices: {len(unmatched_notices)}")
    print(f"Title Discrepancies Found: {len(title_mismatches)}")
    print(f"Missing Local Asset Files: {len(missing_assets)}")

    if title_mismatches:
        print("\nSample Title Discrepancies (first 10):")
        for m in title_mismatches[:10]:
            print(f"  [{m['id']}] Local: '{m['local_title']}' <=> Orig: '{m['orig_title']}'")

    # 4. Analyze Documents Table
    print("\n--- ANALYZING DOCUMENTS TABLE ---")
    doc_missing_files = []
    doc_verified_files = 0
    for d in local_documents:
        lpath = d.get('local_path')
        if lpath:
            full_path = os.path.join('public', lpath.lstrip('/'))
            if os.path.exists(full_path):
                doc_verified_files += 1
            else:
                doc_missing_files.append({
                    'id': d['id'],
                    'title': d['title'],
                    'original_url': d.get('original_url'),
                    'local_path': lpath
                })
        else:
            doc_missing_files.append({
                'id': d['id'],
                'title': d['title'],
                'original_url': d.get('original_url'),
                'local_path': 'None'
            })

    print(f"Total Documents: {len(local_documents)}")
    print(f"Verified Locally on Disk: {doc_verified_files}")
    print(f"Missing on Disk: {len(doc_missing_files)}")
    if doc_missing_files:
        print("Sample missing documents (first 5):")
        for md in doc_missing_files[:5]:
            print(f"  [{md['id']}] {md['title']} -> {md['original_url']} (Path: {md['local_path']})")

    # 5. Analyze Institutional Pages (NAAC, NIRF, IQAC, Mandatory Disclosure, Examinations, Admissions)
    print("\n--- ANALYZING INSTITUTIONAL PAGES & CURATED DOCUMENTS ---")
    institutional_findings = []

    # Check NIRF pages on WordPress
    nirf_wp_pages = [p for p in wp_pages if 'nirf' in p.get('slug', '').lower() or 'nirf' in p.get('title', {}).get('rendered', '').lower()]
    print(f"Original WordPress NIRF Pages discovered: {len(nirf_wp_pages)}")
    for np in nirf_wp_pages:
        print(f"  - [{np.get('slug')}] {np.get('title', {}).get('rendered')} -> {np.get('link')}")

    # Check NAAC pages on WordPress
    naac_wp_pages = [p for p in wp_pages if 'naac' in p.get('slug', '').lower() or 'naac' in p.get('title', {}).get('rendered', '').lower()]
    print(f"\nOriginal WordPress NAAC Pages discovered: {len(naac_wp_pages)}")
    for np in naac_wp_pages:
        print(f"  - [{np.get('slug')}] {np.get('title', {}).get('rendered')} -> {np.get('link')}")

    # Check IQAC pages on WordPress
    iqac_wp_pages = [p for p in wp_pages if 'iqac' in p.get('slug', '').lower() or 'iqac' in p.get('title', {}).get('rendered', '').lower()]
    print(f"\nOriginal WordPress IQAC Pages discovered: {len(iqac_wp_pages)}")
    for ip in iqac_wp_pages:
        print(f"  - [{ip.get('slug')}] {ip.get('title', {}).get('rendered')} -> {ip.get('link')}")

    # Check Calendar / Academic pages on WordPress
    cal_wp_pages = [p for p in wp_pages if 'calendar' in p.get('slug', '').lower()]
    print(f"\nOriginal WordPress Academic Calendar Pages discovered: {len(cal_wp_pages)}")
    for cp in cal_wp_pages:
        print(f"  - [{cp.get('slug')}] {cp.get('title', {}).get('rendered')} -> {cp.get('link')}")

    # Check Compliance / Mandatory Disclosure pages on WordPress
    comp_wp_pages = [p for p in wp_pages if any(k in p.get('slug', '').lower() for k in ['mandatory', 'compliance', 'ugc'])]
    print(f"\nOriginal WordPress Compliance / Mandatory Disclosure Pages: {len(comp_wp_pages)}")
    for cp in comp_wp_pages:
        print(f"  - [{cp.get('slug')}] {cp.get('title', {}).get('rendered')} -> {cp.get('link')}")

if __name__ == '__main__':
    run_reconciliation()
