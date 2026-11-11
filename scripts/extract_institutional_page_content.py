import json
import re

with open('scripts/all_wp_pages.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

pages_by_slug = {p['slug']: p for p in pages}

target_slugs = [
    # NIRF
    'nirf', 'nirf-2025', 'nirf-2025-2', 'nirf-2024', 'nirf-2020', 'nirf2019', 'nirf-overall-details', 'nirf-college-details', 'nirf-management-details', 'nirf-sdg-details',
    # NAAC
    'spcnaac', 'naac', 'naac_data',
    # IQAC
    'iqac', 'composition-of-iqac-2025-26', 'composition-of-iqac-2024-25', 'composition-of-iqac-2023-24', 'composition-of-iqac-2021-22', 'composition-of-iqac-2020-21', 'iqac-mom-2024-2025', 'activities-report-of-iqac', 'road-map-of-iqac',
    # Calendar & Exams
    'calendar', 'calendar-2025-26', 'calendar-2024-25', 'academic-calendar-2023-24', 'academic-calendar-2022-23', 'academic-calendar', 'exam-fees', 'practical-exam',
    # Mandatory & UGC
    'mandatory-disclosure', 'ugc-mandatory-disclosure', 'ugc-compliance-report', 'ugc-refund-compliance', 'ugc-recognition', 'ugc-grants',
    # Admissions
    'admission', 'pg-admission-process'
]

print("=== EXTRACTING ORIGINAL INSTITUTIONAL CONTENT & ATTACHMENTS ===")
institutional_catalog = []

for slug in target_slugs:
    p = pages_by_slug.get(slug)
    if not p:
        print(f"Slug not found in WP pages: {slug}")
        continue

    title = p.get('title', {}).get('rendered', '')
    link = p.get('link', '')
    html = p.get('content', {}).get('rendered', '')

    # Extract all links (.pdf, .doc, .docx, images, etc.)
    pdf_links = re.findall(r'href=[\'"]([^\'"]+\.pdf[^\'"]*)[\'"]', html, re.IGNORECASE)
    doc_links = re.findall(r'href=[\'"]([^\'"]+\.(?:docx?|xlsx?|pptx?)[^\'"]*)[\'"]', html, re.IGNORECASE)
    img_links = re.findall(r'src=[\'"]([^\'"]+\.(?:jpe?g|png|webp|gif)[^\'"]*)[\'"]', html, re.IGNORECASE)

    entry = {
        'slug': slug,
        'title': title,
        'url': link,
        'pdf_links': list(set(pdf_links)),
        'doc_links': list(set(doc_links)),
        'img_links': list(set(img_links)),
        'content_length': len(html)
    }
    institutional_catalog.append(entry)

    print(f"\n[{slug}] {title}")
    print(f"  URL: {link}")
    print(f"  PDFs ({len(pdf_links)}):")
    for pdf in set(pdf_links):
        print(f"    - {pdf}")
    if doc_links:
        print(f"  Docs ({len(doc_links)}):")
        for d in set(doc_links):
            print(f"    - {d}")

with open('scripts/original_institutional_catalog.json', 'w', encoding='utf-8') as f:
    json.dump(institutional_catalog, f, indent=2)

print("\nSaved to scripts/original_institutional_catalog.json")
