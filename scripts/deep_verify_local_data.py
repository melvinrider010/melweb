import os
import json
import re

# 1. Load studentSupportData.json
with open('src/data/studentSupportData.json', 'r', encoding='utf-8') as f:
    student_data = json.load(f)

# 2. Inspect physical files
img_files = os.listdir('public/assets/student-support') if os.path.exists('public/assets/student-support') else []
pdf_files = os.listdir('public/documents/student-support') if os.path.exists('public/documents/student-support') else []

print(f"Total entries in studentSupportData.json: {len(student_data)}")
print(f"Total image files in public/assets/student-support: {len(img_files)}")
print(f"Total PDF files in public/documents/student-support: {len(pdf_files)}")

# 3. Read App.jsx and check routes
with open('src/App.jsx', 'r', encoding='utf-8') as f:
    app_code = f.read()

# 4. Read StudentLifePage.jsx and check component data binding
with open('src/pages/StudentLifePage.jsx', 'r', encoding='utf-8') as f:
    page_code = f.read()

# 5. Read megaMenuData.js and check menu links
with open('src/data/megaMenuData.js', 'r', encoding='utf-8') as f:
    menu_code = f.read()

# 6. Trace each entity
entities_report = {}

for slug, data in student_data.items():
    # Check if slug is referenced in App.jsx
    route_in_app = f"student-support/{slug}" in app_code or f"student-support/:slug" in app_code or f'path="{slug}"' in app_code or f"path='{slug}'" in app_code
    
    # Check if slug is in megaMenuData.js
    in_mega_menu = slug in menu_code
    
    # Check images referenced in JSON and verify if they exist on disk
    json_images = data.get('images', [])
    valid_local_images = []
    external_images = []
    for img in json_images:
        path = img.get('localPath', '')
        orig = img.get('originalUrl', '')
        if path.startswith('/assets/student-support/'):
            fname = os.path.basename(path)
            if fname in img_files:
                valid_local_images.append(path)
            else:
                external_images.append((path, "MISSING_ON_DISK"))
        elif path.startswith('http'):
            external_images.append((path, "EXTERNAL_URL"))
            
    # Check PDFs referenced in JSON and verify if they exist on disk
    json_pdfs = data.get('pdfs', [])
    valid_local_pdfs = []
    external_pdfs = []
    for pdf in json_pdfs:
        path = pdf.get('localPath', '')
        orig = pdf.get('originalUrl', '')
        if path.startswith('/documents/student-support/'):
            fname = os.path.basename(path)
            if fname in pdf_files:
                valid_local_pdfs.append(path)
            else:
                external_pdfs.append((path, "MISSING_ON_DISK"))
        elif path.startswith('http'):
            external_pdfs.append((path, "EXTERNAL_URL"))

    # Content richness
    sections_count = len(data.get('sections', []))
    tables_count = len(data.get('tables', []))
    has_coordinator = bool(data.get('coordinator'))
    has_contact = bool(data.get('contact'))
    has_highlights = bool(data.get('highlights') or data.get('objectives'))
    
    entities_report[slug] = {
        "name": data.get('name'),
        "category": data.get('category'),
        "route_configured": route_in_app,
        "menu_linked": in_mega_menu,
        "sections_count": sections_count,
        "tables_count": tables_count,
        "has_coordinator": has_coordinator,
        "has_highlights": has_highlights,
        "json_images_count": len(json_images),
        "valid_local_images_count": len(valid_local_images),
        "external_images": external_images,
        "json_pdfs_count": len(json_pdfs),
        "valid_local_pdfs_count": len(valid_local_pdfs),
        "external_pdfs": external_pdfs
    }

print("\n--- Summary Table ---")
for slug, r in entities_report.items():
    print(f"{slug[:30]:30} | Sec:{r['sections_count']} | Tbl:{r['tables_count']} | Img:{r['valid_local_images_count']} | PDF:{r['valid_local_pdfs_count']} | Route:{r['route_configured']} | Menu:{r['menu_linked']}")

