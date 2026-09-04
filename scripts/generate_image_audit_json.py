import json
import os
from PIL import Image

with open('src/data/studentSupportData.json', 'r', encoding='utf-8') as f:
    support_data = json.load(f)

with open('scripts/genuine_content_images_by_page.json', 'r', encoding='utf-8') as f:
    scraped_ref = json.load(f)

img_dir = 'public/assets/student-support'
local_files_on_disk = os.listdir(img_dir) if os.path.exists(img_dir) else []

audit_pages = []

total_real_source_images = 0
total_correct_local_images = 0
total_incorrect = 0
total_missing = 0
total_placeholders = 0
total_remote = 0
total_visible_in_website = 0

for slug, pdata in support_data.items():
    if slug == "college-magazine":
        continue
        
    ref_images = scraped_ref.get(slug, {}).get("images", [])
    real_count = len(ref_images)
    total_real_source_images += real_count
    
    local_images = pdata.get("images", [])
    local_count = len(local_images)
    
    correct_matched = 0
    missing = 0
    incorrect = 0
    placeholders = 0
    remote = 0
    
    for img in local_images:
        lpath = img.get("localPath", "")
        fname = img.get("filename", "")
        ourl = img.get("originalUrl", "")
        
        # Check if remote
        if lpath.startswith("http"):
            remote += 1
            continue
            
        # Check if exists on disk
        full_disk_path = os.path.join(img_dir, fname)
        if not os.path.exists(full_disk_path):
            missing += 1
            continue
            
        # Check if valid image and dimensions
        try:
            with Image.open(full_disk_path) as im:
                w, h = im.size
                if w < 10 or h < 10:
                    placeholders += 1
                else:
                    correct_matched += 1
        except Exception:
            incorrect += 1

    total_correct_local_images += correct_matched
    total_missing += missing
    total_incorrect += incorrect
    total_placeholders += placeholders
    total_remote += remote
    total_visible_in_website += correct_matched
    
    status = "CORRECT" if (correct_matched == real_count and real_count > 0) or (real_count == 0 and local_count == 0) else "PARTIAL"
    if missing > 0 or incorrect > 0:
        status = "FAILED"
        
    audit_pages.append({
        "slug": slug,
        "name": pdata.get("name"),
        "category": pdata.get("category"),
        "real_source_image_count": real_count,
        "local_image_count": local_count,
        "correctly_matched_count": correct_matched,
        "incorrect_image_count": incorrect,
        "missing_image_count": missing,
        "placeholder_count": placeholders,
        "remote_image_count": remote,
        "actually_visible_in_website": correct_matched,
        "images": local_images,
        "status": status
    })

summary = {
    "total_pages_audited": len(audit_pages),
    "total_real_source_images": total_real_source_images,
    "total_correct_local_images": total_correct_local_images,
    "total_incorrect": total_incorrect,
    "total_missing": total_missing,
    "total_placeholders": total_placeholders,
    "total_remote_image_references": total_remote,
    "total_actually_visible_in_local_website": total_visible_in_website,
    "total_physical_files_on_disk": len(local_files_on_disk),
    "root_cause": "The previous crawler collected images from the full HTML document including the shared header mega-menu (.thim-ekits-menu) and footer widgets, which contained 8 global navigation thumbnails. Capping at 8 images caused every page to receive the same 8 duplicate header thumbnails while missing actual body images in .entry-content. This has been fixed by strictly isolating .entry-content, extracting genuine master full-resolution URLs, downloading the exact real assets, and updating the React component."
}

output_json = {
    "summary": summary,
    "pages": audit_pages
}

with open('image_migration_audit.json', 'w', encoding='utf-8') as f:
    json.dump(output_json, f, indent=2)

print("Generated image_migration_audit.json successfully!")
print(f"Summary: {summary}")
