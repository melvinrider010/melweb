import urllib.request
import urllib.parse
import json
import os
import re
from bs4 import BeautifulSoup

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

def extract_all_page_images(html, page_url):
    soup = BeautifulSoup(html, 'html.parser')
    
    # Common site-wide images to filter out
    sitewide_patterns = [
        'white_clglogo', 'logo', 'cropped-image-40', 'avatar', 'placeholder', 
        'img_3448', 'st-philomenas-college-mysore3', 'whatsapp-image-2025-04-08'
    ]
    
    candidates = {}
    
    for img in soup.find_all('img'):
        src = img.get('src', '')
        data_src = img.get('data-src', '')
        data_orig = img.get('data-orig-file', '')
        srcset = img.get('data-srcset') or img.get('srcset') or ''
        
        url_candidates = []
        if data_orig:
            url_candidates.append(data_orig)
        if data_src:
            url_candidates.append(data_src)
        if src and not src.startswith('data:'):
            url_candidates.append(src)
            
        if srcset:
            parts = [p.strip().split(' ') for p in srcset.split(',') if p.strip()]
            for p in parts:
                if p and p[0] and not p[0].startswith('data:'):
                    url_candidates.append(p[0])
                    
        for u in url_candidates:
            if u.startswith('//'):
                u = 'https:' + u
            elif u.startswith('/'):
                u = urllib.parse.urljoin(page_url, u)
                
            if not u.startswith('http'):
                continue
                
            # Filter sitewide
            if any(p in u.lower() for p in sitewide_patterns):
                continue
                
            # Master full resolution
            master_url = re.sub(r'-\d+x\d+(\.[a-zA-Z]+)$', r'\1', u)
            
            # Check if inside main content or where in page
            parent_classes = []
            cur = img.parent
            while cur and cur.name != '[document]':
                if cur.get('class'):
                    parent_classes.extend(cur.get('class'))
                cur = cur.parent
            parent_info = " ".join(parent_classes)
            
            if master_url not in candidates:
                candidates[master_url] = {
                    "masterUrl": master_url,
                    "sampleUrl": u,
                    "alt": img.get('alt', ''),
                    "parentClasses": parent_info
                }
                
    return list(candidates.values())

all_page_results = {}

for item in urls:
    slug = item["slug"]
    req = urllib.request.Request(item['url'], headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error {slug}: {e}")
        html = ""

    images = extract_all_page_images(html, item['url'])
    all_page_results[slug] = {
        "slug": slug,
        "name": item["name"],
        "url": item["url"],
        "count": len(images),
        "images": images
    }
    print(f"\n[{slug}] -> Found {len(images)} specific content images:")
    for img in images:
        print(f"   * {img['masterUrl']}")

with open('scripts/all_page_specific_images.json', 'w', encoding='utf-8') as f:
    json.dump(all_page_results, f, indent=2)

