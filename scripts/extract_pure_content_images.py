import urllib.request
import urllib.parse
import json
import os
import re
from bs4 import BeautifulSoup
from PIL import Image

urls = [
    {"slug": "placement-cell", "name": "Career and Placement Cell", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/placement-cell/"},
    {"slug": "student-grievance-redressal-committee", "name": "Grievance Redressal", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/student-grievance-redressal-committee/"},
    {"slug": "anti-ragging", "name": "Anti-Ragging", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/anti-ragging/"},
    {"slug": "womens-cell", "name": "Women's Cell", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/womens-cell/"},
    {"slug": "student-welfare-cell", "name": "Student Welfare Cell", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/student-welfare-cell/"},
    {"slug": "counselling-centre", "name": "Counselling Centre", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/counselling-centre/"},
    {"slug": "human-values-professional-ethics", "name": "Human Values And Professional Ethics", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/human-values-professional-ethics/"},
    {"slug": "youth-red-cross-yrc", "name": "Youth Redcross", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/youth-red-cross-yrc/"},
    
    {"slug": "library", "name": "Library", "category": "Amenities", "url": "https://stphilos.ac.in/library/"},
    {"slug": "facilities", "name": "Physical Infrastructure", "category": "Amenities", "url": "https://stphilos.ac.in/facilities/"},
    {"slug": "business-lab", "name": "Business Lab", "category": "Amenities", "url": "https://stphilos.ac.in/business-lab/"},
    {"slug": "computer-science-lab", "name": "Computer Lab", "category": "Amenities", "url": "https://stphilos.ac.in/computer-science-lab/"},
    {"slug": "girls-hostel", "name": "Girls Hostel", "category": "Amenities", "url": "https://stphilos.ac.in/about-us-2/infrastructure/girls-hostel/"},
    {"slug": "boys-hostel", "name": "Boys Hostel", "category": "Amenities", "url": "https://stphilos.ac.in/about-us-2/infrastructure/boys-hostel/"},
    {"slug": "auditorium", "name": "Auditorium", "category": "Amenities", "url": "https://stphilos.ac.in/auditorium/"},
    {"slug": "e-journal", "name": "Philos Bulletin", "category": "Amenities", "url": "https://stphilos.ac.in/e-journal/"},
    
    {"slug": "bank-atm", "name": "Bank & ATM", "category": "Other Amenities", "url": "https://stphilos.ac.in/about-us-2/infrastructure/bank-atm/"},
    {"slug": "chapel-hall-3", "name": "Chapel", "category": "Other Amenities", "url": "https://stphilos.ac.in/chapel-hall-3/"},
    {"slug": "ranger-and-rovers", "name": "Ranger and Rovers", "category": "Other Amenities", "url": "https://stphilos.ac.in/ranger-and-rovers/"},
    {"slug": "ncc", "name": "NCC", "category": "Other Amenities", "url": "https://stphilos.ac.in/ncc/"},
    {"slug": "nss", "name": "NSS", "category": "Other Amenities", "url": "https://stphilos.ac.in/nss/"},
    {"slug": "indoor-stadium", "name": "Indoor Stadium", "category": "Other Amenities", "url": "https://stphilos.ac.in/indoor-stadium/"}
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

def get_master_image_url(url):
    # Strip WordPress dimensions: -300x200, -1024x768, -768x576, etc.
    cleaned = re.sub(r'-\d+x\d+(\.[a-zA-Z]+)$', r'\1', url)
    # Also strip query parameters
    cleaned = cleaned.split('?')[0]
    return cleaned

genuine_content_images = {}

for item in urls:
    slug = item["slug"]
    req = urllib.request.Request(item['url'], headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error {slug}: {e}")
        html = ""

    soup = BeautifulSoup(html, 'html.parser')
    
    # Strictly isolate .entry-content or main article container
    entry = soup.find(class_=re.compile(r'entry-content'))
    if not entry:
        entry = soup.find('article') or soup.find('main')

    page_images = []
    
    if entry:
        for img in entry.find_all('img'):
            # Collect all candidate URLs from attributes
            attrs_to_check = ['data-orig-file', 'data-large-file', 'data-src', 'data-lazy-src', 'src', 'data-srcset', 'srcset']
            cands = []
            for a in attrs_to_check:
                val = img.get(a, '')
                if val and not val.startswith('data:'):
                    if ',' in val:
                        parts = [p.strip().split(' ')[0] for p in val.split(',') if p.strip()]
                        cands.extend(parts)
                    else:
                        cands.append(val)
                        
            for c in cands:
                if c.startswith('//'):
                    c = 'https:' + c
                elif c.startswith('/'):
                    c = urllib.parse.urljoin(item['url'], c)
                    
                if not c.startswith('http'):
                    continue
                    
                # Exclude logos, icons, avatars, plugin icons
                if any(x in c.lower() for x in ['logo', 'icon', 'cropped-image-40', 'avatar', 'placeholder', 'blank.gif', 'plugins/team-members/inc/img']):
                    continue
                    
                master = get_master_image_url(c)
                alt = img.get('alt', '')
                
                if master not in [x['masterUrl'] for x in page_images]:
                    page_images.append({
                        "masterUrl": master,
                        "sampleUrl": c,
                        "alt": alt
                    })
                    
        # Also check background images inside entry
        for elem in entry.find_all(style=re.compile(r'background(-image)?\s*:\s*url', re.I)):
            style = elem.get('style', '')
            bg_match = re.search(r'url\([\'"]?(https?://[^\'")]+)[\'"]?\)', style)
            if bg_match:
                bg_url = bg_match.group(1)
                master = get_master_image_url(bg_url)
                if not any(x in master.lower() for x in ['logo', 'icon', 'avatar']):
                    if master not in [x['masterUrl'] for x in page_images]:
                        page_images.append({
                            "masterUrl": master,
                            "sampleUrl": bg_url,
                            "alt": "Background Banner"
                        })

    genuine_content_images[slug] = {
        "slug": slug,
        "name": item["name"],
        "count": len(page_images),
        "images": page_images
    }
    print(f"\n==================================================")
    print(f"[{slug}] ({item['name']}): {len(page_images)} REAL CONTENT IMAGES FOUND")
    for idx, pi in enumerate(page_images):
        print(f"  {idx+1}. {pi['masterUrl']} (alt: '{pi['alt']}')")

with open('scripts/genuine_content_images_by_page.json', 'w', encoding='utf-8') as f:
    json.dump(genuine_content_images, f, indent=2)

