import urllib.request
import urllib.parse
import json
import os
import re
from bs4 import BeautifulSoup
from PIL import Image
import io

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

def get_base_wp_image(url):
    # Strip WordPress resize suffix like -300x200, -1024x576, -768x432, -2048x1365
    return re.sub(r'-\d+x\d+(\.[a-zA-Z]+)$', r'\1', url)

raw_inspection = {}

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
    
    # Check site-wide common elements to remove
    for tag in soup(['header', 'footer', 'nav', 'aside', 'script', 'style', 'noscript']):
        tag.decompose()
        
    # Also remove common sidebar / widget areas that contain recent posts or footer thumbnails
    for sidebar in soup.find_all(class_=re.compile(r'sidebar|widget|recent-posts|footer|nav-menu')):
        sidebar.decompose()

    # Find main content container
    content_container = soup.find('div', class_=re.compile(r'entry-content|elementor-section-wrap|post-content')) or soup.find('article') or soup.find('main')
    
    discovered_images = []
    
    if content_container:
        # 1. <img> tags in content
        for img in content_container.find_all('img'):
            src = img.get('data-orig-file') or img.get('data-large-file') or img.get('data-src') or img.get('data-lazy-src') or img.get('src') or ''
            srcset = img.get('srcset') or img.get('data-srcset') or ''
            
            cands = []
            if src:
                cands.append(src)
            if srcset:
                # Get the largest URL in srcset
                parts = [p.strip().split(' ') for p in srcset.split(',') if p.strip()]
                for p in parts:
                    if p:
                        cands.append(p[0])
            
            for c in cands:
                if c.startswith('//'):
                    c = 'https:' + c
                elif c.startswith('/'):
                    c = urllib.parse.urljoin(item['url'], c)
                
                # Exclude logos, icons, avatars, admin bar, 1x1 gifs
                if not any(x in c.lower() for x in ['logo', 'icon', 'cropped-image-40', 'avatar', 'placeholder', 'blank.gif', 'data:image']):
                    base_url = get_base_wp_image(c)
                    if base_url not in [d['masterUrl'] for d in discovered_images]:
                        discovered_images.append({
                            "foundUrl": c,
                            "masterUrl": base_url,
                            "tag": "img",
                            "alt": img.get('alt', '')
                        })

        # 2. Linked images in content: <a href="...jpg">
        for a in content_container.find_all('a', href=True):
            href = a['href']
            if any(href.lower().endswith(ext) for ext in ['.jpg', '.jpeg', '.png', '.webp']):
                if href.startswith('//'):
                    href = 'https:' + href
                elif href.startswith('/'):
                    href = urllib.parse.urljoin(item['url'], href)
                base_url = get_base_wp_image(href)
                if not any(x in href.lower() for x in ['logo', 'icon', 'cropped-image-40', 'avatar']):
                    if base_url not in [d['masterUrl'] for d in discovered_images]:
                        discovered_images.append({
                            "foundUrl": href,
                            "masterUrl": base_url,
                            "tag": "a_href",
                            "alt": a.get_text(strip=True)
                        })

        # 3. Inline background-image styles in content
        for elem in content_container.find_all(style=re.compile(r'background(-image)?\s*:\s*url')):
            style = elem.get('style', '')
            bg_match = re.search(r'url\([\'"]?(https?://[^\'")]+)[\'"]?\)', style)
            if bg_match:
                bg_url = bg_match.group(1)
                base_url = get_base_wp_image(bg_url)
                if not any(x in bg_url.lower() for x in ['logo', 'icon', 'avatar']):
                    if base_url not in [d['masterUrl'] for d in discovered_images]:
                        discovered_images.append({
                            "foundUrl": bg_url,
                            "masterUrl": base_url,
                            "tag": "background_image",
                            "alt": ""
                        })

    raw_inspection[slug] = {
        "slug": slug,
        "name": item["name"],
        "url": item["url"],
        "real_content_images": discovered_images
    }
    print(f"[{slug}] Found {len(discovered_images)} genuine content images")
    for d in discovered_images:
        print(f"   -> {d['masterUrl']} (from {d['tag']})")

with open('scripts/raw_content_images_inspection.json', 'w', encoding='utf-8') as f:
    json.dump(raw_inspection, f, indent=2)

