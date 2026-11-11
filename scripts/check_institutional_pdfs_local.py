import json
import os
from urllib.parse import urlparse

with open('scripts/original_institutional_catalog.json', 'r', encoding='utf-8') as f:
    catalog = json.load(f)

print("=== CHECKING LOCAL PRESENCE OF ORIGINAL INSTITUTIONAL PDFS ===")

all_pdfs = set()
for item in catalog:
    for p in item.get('pdf_links', []):
        all_pdfs.add(p)

print(f"Total Unique Institutional PDFs in catalog: {len(all_pdfs)}")

missing_pdfs = []
found_pdfs = []

for pdf_url in sorted(all_pdfs):
    parsed = urlparse(pdf_url)
    rel_path = parsed.path.lstrip('/')
    filename = os.path.basename(rel_path)

    # Search in common local locations
    candidate_locations = [
        os.path.join('public', rel_path),
        os.path.join('public/assets/documents', filename),
        os.path.join('public/assets/documents/naac', filename),
        os.path.join('public/assets/documents/nirf', filename),
        os.path.join('public/assets/documents/iqac', filename),
        os.path.join('public/assets/documents/historical', filename),
        os.path.join('public/media/notices', filename),
    ]

    # Also recursive walk in public/assets/documents and public/media
    found = False
    found_at = None
    for loc in candidate_locations:
        if os.path.exists(loc) and os.path.getsize(loc) > 0:
            found = True
            found_at = loc
            break

    if not found:
        # Search anywhere in public/
        for root, _, files in os.walk('public'):
            if filename in files:
                full_p = os.path.join(root, filename)
                if os.path.getsize(full_p) > 0:
                    found = True
                    found_at = full_p
                    break

    if found:
        found_pdfs.append({'url': pdf_url, 'local_path': found_at, 'size': os.path.getsize(found_at)})
    else:
        missing_pdfs.append(pdf_url)

print(f"Already Local: {len(found_pdfs)}")
print(f"Missing Locally: {len(missing_pdfs)}")

if missing_pdfs:
    print("\nMissing PDFs to download:")
    for mp in missing_pdfs:
        print(f"  - {mp}")
