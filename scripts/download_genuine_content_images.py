import urllib.request
import urllib.parse
import json
import os
import re
import shutil
from PIL import Image

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

with open('scripts/genuine_content_images_by_page.json', 'r', encoding='utf-8') as f:
    scraped_data = json.load(f)

with open('src/data/studentSupportData.json', 'r', encoding='utf-8') as f:
    support_data = json.load(f)

output_dir = 'public/assets/student-support'

# Clean previous duplicate/wrong files in student-support directory
if os.path.exists(output_dir):
    shutil.rmtree(output_dir)
os.makedirs(output_dir, exist_ok=True)

download_report = {}

def download_image(url, save_path):
    # Try downloading master URL first, if fails try original URL
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=25) as resp:
            content = resp.read()
            with open(save_path, 'wb') as out:
                out.write(content)
                
        # Validate with PIL
        with Image.open(save_path) as img:
            w, h = img.size
            fmt = img.format
            return {"success": True, "width": w, "height": h, "format": fmt, "size": len(content)}
    except Exception as e:
        return {"success": False, "error": str(e)}

total_real_images = 0
total_downloaded = 0

for slug, page_info in scraped_data.items():
    images = page_info.get("images", [])
    local_images_list = []
    
    print(f"\nProcessing [{slug}] ({page_info['name']}): {len(images)} images")
    
    for idx, img_info in enumerate(images):
        total_real_images += 1
        m_url = img_info["masterUrl"]
        s_url = img_info.get("sampleUrl", m_url)
        
        # Clean local filename
        base_name = os.path.basename(urllib.parse.urlparse(m_url).path)
        ext = os.path.splitext(base_name)[1] or '.jpg'
        clean_base = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', os.path.splitext(base_name)[0])
        local_filename = f"{slug}_{idx+1:02d}_{clean_base}{ext}"
        local_file_path = os.path.join(output_dir, local_filename)
        rel_local_path = f"/assets/student-support/{local_filename}"
        
        # Download master image, fallback to sample URL if master 404
        res = download_image(m_url, local_file_path)
        if not res["success"]:
            print(f"  [Fallback to sample] {m_url} failed ({res['error']}), trying {s_url}")
            res = download_image(s_url, local_file_path)
            
        if res["success"]:
            total_downloaded += 1
            print(f"  [OK] [{idx+1}/{len(images)}] {local_filename} ({res['width']}x{res['height']}, {round(res['size']/1024, 1)} KB)")
            local_images_list.append({
                "filename": local_filename,
                "localPath": rel_local_path,
                "originalUrl": m_url,
                "alt": img_info.get("alt", "") or f"{page_info['name']} Photo {idx+1}",
                "width": res["width"],
                "height": res["height"],
                "sizeBytes": res["size"]
            })
        else:
            print(f"  ✗ FAILED: {m_url} -> {res.get('error')}")

    # Update support_data with the exact genuine local images
    if slug in support_data:
        support_data[slug]["images"] = local_images_list

    download_report[slug] = {
        "slug": slug,
        "name": page_info["name"],
        "source_image_count": len(images),
        "downloaded_count": len(local_images_list),
        "images": local_images_list
    }

# Save updated studentSupportData.json
with open('src/data/studentSupportData.json', 'w', encoding='utf-8') as f:
    json.dump(support_data, f, indent=2, ensure_ascii=False)

print("\n" + "=" * 60)
print(f"MIGRATION COMPLETE: {total_downloaded}/{total_real_images} genuine content images downloaded & verified!")
print("=" * 60)
