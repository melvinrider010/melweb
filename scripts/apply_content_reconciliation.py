import json
import sqlite3
import os
import re
import html
from urllib.parse import urlparse

def reconcile_all():
    print("======================================================================")
    print("APPLYING AUTHORITATIVE RECONCILIATION & CONTENT RESTORATION")
    print("======================================================================")

    # 1. Load Original Authoritative WordPress Datasets
    with open('scripts/all_wp_posts.json', 'r', encoding='utf-8') as f:
        wp_posts = json.load(f)
    print(f"Loaded {len(wp_posts)} original WordPress posts.")

    with open('scripts/original_institutional_catalog.json', 'r', encoding='utf-8') as f:
        catalog = json.load(f)
    print(f"Loaded {len(catalog)} original institutional catalog entries.")

    wp_posts_by_id = {p['id']: p for p in wp_posts}
    wp_posts_by_slug = {p['slug']: p for p in wp_posts}

    # Connect to SQLite
    db_path = 'backend/database/database.sqlite'
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    c = conn.cursor()

    # ---------------------------------------------------------
    # 2. Reconcile Notices
    # ---------------------------------------------------------
    c.execute("SELECT * FROM notices")
    db_notices = [dict(r) for r in c.fetchall()]
    print(f"Reconciling {len(db_notices)} notices in SQLite...")

    notices_updated = 0
    title_corrections = 0
    date_corrections = 0

    known_404_assets = {
        '/media/notices/2021/UG-NOTIV-MAKEUP-724x1024.jpg',
        '/media/notices/2021/PG-MAKE-UP-FEES_2-724x1024.jpg',
        '/media/notices/2021/PG-REVAL-FEES_3-825x1024.jpg',
        '/media/notices/2018/Untitled-300x200.jpg'
    }

    reconciled_notices_list = []

    for n in db_notices:
        nid = n['id']
        wp_id = None
        m = re.search(r'wp_(\d+)', str(nid))
        if m:
            wp_id = int(m.group(1))

        orig = wp_posts_by_id.get(wp_id) or wp_posts_by_slug.get(n.get('slug'))
        
        updated_fields = {}
        curr_title = n.get('title') or ''
        curr_date = n.get('date') or ''
        curr_doc_img = n.get('document_image') or ''
        curr_summary = n.get('summary') or ''

        if orig:
            # Decode authentic title
            raw_orig_title = orig.get('title', {}).get('rendered', '')
            clean_title = html.unescape(raw_orig_title).strip()
            # Clean residual HTML tags
            clean_title = re.sub(r'<[^>]+>', '', clean_title).strip()

            if clean_title and clean_title != curr_title:
                updated_fields['title'] = clean_title
                title_corrections += 1

            orig_date = orig.get('date', '').split('T')[0]
            if orig_date and orig_date != curr_date and orig_date != '1970-01-01':
                # Use authentic date
                updated_fields['date'] = orig_date
                date_corrections += 1

            # Check asset
            if curr_doc_img in known_404_assets:
                # Mark as 404 verified on original server
                if 'SOURCE NOT VERIFIED' not in curr_summary:
                    updated_fields['summary'] = (curr_summary + ' [SOURCE NOT VERIFIED - ASSET 404 ON ORIGINAL SERVER]').strip()
            elif curr_doc_img:
                # Verify local file presence
                local_f = os.path.join('public', curr_doc_img.lstrip('/'))
                if not (os.path.exists(local_f) and os.path.getsize(local_f) > 0):
                    # Check if file exists elsewhere in public/media/notices
                    fname = os.path.basename(curr_doc_img)
                    for r, d, fs in os.walk('public/media/notices'):
                        if fname in fs:
                            found_rel = '/' + os.path.relpath(os.path.join(r, fname), 'public').replace('\\', '/')
                            updated_fields['document_image'] = found_rel
                            break

        if updated_fields:
            notices_updated += 1
            updated_fields['updated_at'] = '2026-10-16 13:00:00'
            set_clause = ", ".join([f"{k} = ?" for k in updated_fields.keys()])
            vals = list(updated_fields.values()) + [nid]
            c.execute(f"UPDATE notices SET {set_clause} WHERE id = ?", vals)

        # Merge for json dump
        merged_n = dict(n)
        merged_n.update(updated_fields)
        reconciled_notices_list.append(merged_n)

    print(f"Notices Reconciled: {notices_updated} updated (Titles corrected: {title_corrections}, Dates corrected: {date_corrections})")

    # ---------------------------------------------------------
    # 3. Reconcile Events
    # ---------------------------------------------------------
    c.execute("SELECT * FROM events")
    db_events = [dict(r) for r in c.fetchall()]
    print(f"\nReconciling {len(db_events)} events in SQLite...")

    events_updated = 0
    event_title_corrections = 0
    reconciled_events_list = []

    for ev in db_events:
        eid = ev['id']
        wp_id = None
        m = re.search(r'wp_(\d+)', str(eid))
        if m:
            wp_id = int(m.group(1))

        orig = wp_posts_by_id.get(wp_id) or wp_posts_by_slug.get(ev.get('slug'))
        updated_fields = {}

        if orig:
            raw_orig_title = orig.get('title', {}).get('rendered', '')
            clean_title = html.unescape(raw_orig_title).strip()
            clean_title = re.sub(r'<[^>]+>', '', clean_title).strip()

            if clean_title and clean_title != (ev.get('title') or '').strip():
                updated_fields['title'] = clean_title
                event_title_corrections += 1

            orig_date = orig.get('date', '').split('T')[0]
            if orig_date and ev.get('event_date') != orig_date and orig_date != '1970-01-01':
                updated_fields['event_date'] = orig_date

        if updated_fields:
            events_updated += 1
            updated_fields['updated_at'] = '2026-10-16 13:00:00'
            set_clause = ", ".join([f"{k} = ?" for k in updated_fields.keys()])
            vals = list(updated_fields.values()) + [eid]
            c.execute(f"UPDATE events SET {set_clause} WHERE id = ?", vals)

        merged_ev = dict(ev)
        merged_ev.update(updated_fields)
        reconciled_events_list.append(merged_ev)

    print(f"Events Reconciled: {events_updated} updated (Titles corrected: {event_title_corrections})")

    # ---------------------------------------------------------
    # 4. Institutional Documents Verification & Registration
    # ---------------------------------------------------------
    print("\nRegistering / updating authentic institutional documents in SQLite...")
    
    institutional_records = [
        {
            'id': 'doc_nirf_2025_overall',
            'title': 'NIRF Institutional Data Report 2025 - Overall',
            'filename': 'OVERALL-DATA-St.Philomenas-Autonomous-College20250131-.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2025/02/OVERALL-DATA-St.Philomenas-Autonomous-College20250131-.pdf',
            'local_path': '/assets/documents/historical/2025/OVERALL-DATA-St.Philomenas-Autonomous-College20250131-.pdf',
            'category': 'NIRF',
            'year': '2025'
        },
        {
            'id': 'doc_nirf_2025_college',
            'title': 'NIRF Institutional Data Report 2025 - College Category',
            'filename': 'St.Philomenas-Autonomous-College20250127-.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2025/03/St.Philomenas-Autonomous-College20250127-.pdf',
            'local_path': '/assets/documents/historical/2025/St.Philomenas-Autonomous-College20250127-.pdf',
            'category': 'NIRF',
            'year': '2025'
        },
        {
            'id': 'doc_nirf_2025_management',
            'title': 'NIRF Institutional Data Report 2025 - Management Discipline',
            'filename': 'Management-St.Philomenas-Autonomous-College20250128-.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2025/03/Management-St.Philomenas-Autonomous-College20250128-.pdf',
            'local_path': '/assets/documents/historical/2025/Management-St.Philomenas-Autonomous-College20250128-.pdf',
            'category': 'NIRF',
            'year': '2025'
        },
        {
            'id': 'doc_nirf_2025_sdg',
            'title': 'NIRF Institutional Data Report 2025 - Sustainable Development Goals (SDG)',
            'filename': 'SDG-St.Philomenas-Autonomous-College20250131-.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2025/03/SDG-St.Philomenas-Autonomous-College20250131-.pdf',
            'local_path': '/assets/documents/historical/2025/SDG-St.Philomenas-Autonomous-College20250131-.pdf',
            'category': 'NIRF',
            'year': '2025'
        },
        {
            'id': 'doc_nirf_2024',
            'title': 'NIRF Institutional Data Report 2024',
            'filename': 'St.Philomenas-Autonomous-College20240307-1-1.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2024/03/St.Philomenas-Autonomous-College20240307-1-1.pdf',
            'local_path': '/assets/documents/historical/2024/St.Philomenas-Autonomous-College20240307-1-1.pdf',
            'category': 'NIRF',
            'year': '2024'
        },
        {
            'id': 'doc_nirf_2022',
            'title': 'NIRF Institutional Data Report 2022',
            'filename': 'St.-Philominas-College-Bannimantap20220218-.pdf',
            'original_url': 'http://stphilos.ac.in/wp-content/uploads/2022/03/St.-Philominas-College-Bannimantap20220218-.pdf',
            'local_path': '/assets/documents/nirf/St-Philomenas-College-NIRF-2022.pdf',
            'category': 'NIRF',
            'year': '2022'
        },
        {
            'id': 'doc_nirf_2021',
            'title': 'NIRF Institutional Data Report 2021',
            'filename': 'St.-Philominas-College-Bannimantap20210305-1.pdf',
            'original_url': 'http://stphilos.ac.in/wp-content/uploads/2021/03/St.-Philominas-College-Bannimantap20210305-1.pdf',
            'local_path': '/assets/documents/nirf/St-Philomenas-College-NIRF-2021.pdf',
            'category': 'NIRF',
            'year': '2021'
        },
        {
            'id': 'doc_nirf_2019',
            'title': 'NIRF Institutional Data Report 2019',
            'filename': 'St.-Philominas-College-Bannimantap20190107-.pdf',
            'original_url': 'http://stphilos.ac.in/wp-content/uploads/2019/01/St.-Philominas-College-Bannimantap20190107-.pdf',
            'local_path': '/documents/academics/St.-Philominas-College-Bannimantap20190107-.pdf',
            'category': 'NIRF',
            'year': '2019'
        },
        {
            'id': 'doc_mandatory_disclosure_2025',
            'title': 'Mandatory Disclosure 2025',
            'filename': 'Mandatory-Disclosure-2025-16.04.2026-1.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2026/04/Mandatory-Disclosure-2025-16.04.2026-1.pdf',
            'local_path': '/assets/documents/historical/2026/Mandatory-Disclosure-2025-16.04.2026-1.pdf',
            'category': 'Compliance',
            'year': '2025'
        },
        {
            'id': 'doc_ugc_peer_team_report',
            'title': 'UGC Peer Team Compliance Report',
            'filename': 'Peer-Team-Report.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2026/01/Peer-Team-Report.pdf',
            'local_path': '/assets/documents/historical/2026/Peer-Team-Report.pdf',
            'category': 'Compliance',
            'year': '2024'
        },
        {
            'id': 'doc_calendar_2025_26',
            'title': 'Academic Calendar 2025-26',
            'filename': 'St-Philomine-Final-Print.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2025/10/St-Philomine-Final-Print.pdf',
            'local_path': '/assets/documents/historical/2025/St-Philomine-Final-Print.pdf',
            'category': 'Calendar',
            'year': '2025-26'
        },
        {
            'id': 'doc_calendar_2024_25',
            'title': 'Academic Calendar 2024-25',
            'filename': 'College-calendar.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2025/10/College-calendar.pdf',
            'local_path': '/assets/documents/historical/2025/College-calendar.pdf',
            'category': 'Calendar',
            'year': '2024-25'
        },
        {
            'id': 'doc_calendar_2022_23',
            'title': 'Academic Calendar 2022-23',
            'filename': 'Calendar-2022-23-2.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2023/08/Calendar-2022-23-2.pdf',
            'local_path': '/assets/documents/historical/2023/Calendar-2022-23-2.pdf',
            'category': 'Calendar',
            'year': '2022-23'
        },
        {
            'id': 'doc_naac_cycle_iii',
            'title': 'NAAC Cycle-III Accreditation Certificate',
            'filename': 'Naac-Certificate.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2019/02/Naac-Certificate.pdf',
            'local_path': '/documents/academics/Naac-Certificate.pdf',
            'category': 'NAAC/AQAR',
            'year': '2019'
        },
        {
            'id': 'doc_naac_ssr_final',
            'title': 'NAAC Self Study Report (SSR Final)',
            'filename': 'SSR-FINAL.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2019/06/SSR-FINAL.pdf',
            'local_path': '/documents/academics/SSR-FINAL.pdf',
            'category': 'NAAC/AQAR',
            'year': '2019'
        },
        {
            'id': 'doc_iqac_report_2024',
            'title': 'Final Activities Report of IQAC',
            'filename': 'Final-IQAC-Report.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2024/10/Final-IQAC-Report.pdf',
            'local_path': '/assets/documents/historical/2024/Final-IQAC-Report.pdf',
            'category': 'reports',
            'year': '2024'
        },
        {
            'id': 'doc_iqac_roadmap_2023_24',
            'title': 'Roadmap of IQAC 2023-24',
            'filename': 'Roadmap2023-2024.pdf',
            'original_url': 'https://stphilos.ac.in/wp-content/uploads/2024/08/Roadmap2023-2024.pdf',
            'local_path': '/assets/documents/historical/2024/Roadmap2023-2024.pdf',
            'category': 'reports',
            'year': '2023-24'
        }
    ]

    docs_registered = 0
    for doc in institutional_records:
        local_full = os.path.join('public', doc['local_path'].lstrip('/'))
        fsize = os.path.getsize(local_full) if os.path.exists(local_full) else 0

        c.execute("SELECT id FROM documents WHERE id = ?", (doc['id'],))
        existing = c.fetchone()
        if existing:
            c.execute("""
                UPDATE documents SET 
                    title = ?, filename = ?, original_url = ?, local_path = ?, category = ?, year = ?, file_size = ?, download_status = 'Downloaded', updated_at = datetime('now')
                WHERE id = ?
            """, (doc['title'], doc['filename'], doc['original_url'], doc['local_path'], doc['category'], doc['year'], fsize, doc['id']))
        else:
            c.execute("""
                INSERT INTO documents (id, title, filename, original_url, local_path, category, year, extension, file_size, download_status, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, 'pdf', ?, 'Downloaded', datetime('now'), datetime('now'))
            """, (doc['id'], doc['title'], doc['filename'], doc['original_url'], doc['local_path'], doc['category'], doc['year'], fsize))
        docs_registered += 1

    conn.commit()
    conn.close()
    print(f"Institutional Documents registered / updated in SQLite: {docs_registered}")

    # ---------------------------------------------------------
    # 5. Update Local JSON files (notices.json and events.json)
    # ---------------------------------------------------------
    print("\nSynchronizing local JSON stores with reconciled authentic records...")
    with open('src/data/notices.json', 'w', encoding='utf-8') as f:
        json.dump(reconciled_notices_list, f, indent=2, ensure_ascii=False)
    print("Updated src/data/notices.json.")

    with open('src/data/events.json', 'w', encoding='utf-8') as f:
        json.dump(reconciled_events_list, f, indent=2, ensure_ascii=False)
    print("Updated src/data/events.json.")

    print("\nReconciliation completed successfully!")

if __name__ == '__main__':
    reconcile_all()
