import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
import requests
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

url = 'https://stphilos.ac.in/'
print(f"Fetching {url}...")
r = requests.get(url, headers=HEADERS, timeout=20)
print(f"Status: {r.status_code}, Length: {len(r.text)} bytes")

soup = BeautifulSoup(r.text, 'html.parser')

# 1. Find all header elements and logos
print("\n=== 1. HEADER & LOGOS ===")
headers = soup.find_all(['header', 'div'], class_=re.compile(r'header|nav|top-bar|thim', re.I))
img_tags = soup.find_all('img')
logos = []
for img in img_tags:
    src = img.get('src', '') or img.get('data-src', '')
    alt = img.get('alt', '')
    cls = img.get('class', [])
    if any(k in src.lower() or k in alt.lower() or k in str(cls).lower() for k in ['logo', 'crest', 'st-philomena', 'header', 'cropped']):
        logos.append({'src': src, 'alt': alt, 'class': cls, 'width': img.get('width'), 'height': img.get('height')})

print(f"Found {len(logos)} logo/header images:")
for l in logos:
    print(f"  Src: {l['src']}")
    print(f"  Alt: {l['alt']}, Class: {l['class']}, WxH: {l['width']}x{l['height']}")

# 2. Extract Top Utility Bar items
print("\n=== 2. TOP UTILITY BAR ===")
top_bar = soup.find(class_=re.compile(r'top-bar|header-info|thim-header-info|top_nav', re.I))
if top_bar:
    print("Found top bar HTML:")
    for a in top_bar.find_all('a'):
        print(f"  Link: '{a.get_text(strip=True)}' -> {a.get('href')}")
else:
    print("Searching for top utility links across page...")
    # Look for NIRF, NAAC, IQAC, Alumni, etc.
    for a in soup.find_all('a'):
        txt = a.get_text(strip=True)
        if any(txt.upper() == k for k in ['IQAC', 'NIRF', 'NAAC', 'IIC', 'SWAYAM', 'ALUMNI', 'ANTHEMS', 'RTI', 'PLACEMENT', 'NSS', 'NCC']):
            print(f"  Found utility link: '{txt}' -> {a.get('href')}")

# 3. Extract Main Navigation Menu
print("\n=== 3. MAIN NAVIGATION MENU & MEGA MENUS ===")
nav_menus = soup.find_all(['nav', 'ul'], class_=re.compile(r'menu|nav', re.I))
print(f"Found {len(nav_menus)} navigation containers.")

# Find primary menu
primary_menu = soup.find('ul', id=re.compile(r'primary|main|navigation', re.I)) or soup.find('ul', class_=re.compile(r'primary-menu|main-menu|thim-ekits-menu__nav', re.I))
if not primary_menu:
    # fallback: look for list items with About Us, Academics, etc.
    for ul in soup.find_all('ul'):
        texts = [li.get_text(strip=True) for li in ul.find_all('li', recursive=False)]
        if any('About' in t for t in texts) and any('Academic' in t for t in texts):
            primary_menu = ul
            break

if primary_menu:
    print("Primary menu identified!")
    menu_structure = []
    top_items = primary_menu.find_all('li', recursive=False)
    for top_li in top_items:
        top_a = top_li.find('a', recursive=False) or top_li.find('span', class_=re.compile(r'title|text', re.I))
        top_label = top_a.get_text(strip=True) if top_a else "UNKNOWN"
        top_href = top_a.get('href') if top_a and top_a.name == 'a' else "#"
        
        # Check submenus
        submenus = []
        sub_ul = top_li.find(['ul', 'div'], class_=re.compile(r'sub-menu|dropdown|mega|content', re.I))
        if sub_ul:
            # Check for column headings or list items
            sub_lis = top_li.find_all('li')
            for sli in sub_lis:
                if sli == top_li: continue
                sa = sli.find('a')
                if sa:
                    submenus.append({
                        'label': sa.get_text(strip=True),
                        'href': sa.get('href')
                    })
        menu_structure.append({
            'label': top_label,
            'href': top_href,
            'submenu_count': len(submenus),
            'submenus': submenus
        })
    print(json.dumps(menu_structure, indent=2))
else:
    print("Could not locate standard primary menu ul, dumping all top navigation links:")
    for a in soup.find_all('a', class_=re.compile(r'menu-item|nav-link', re.I)):
        print(f"  {a.get_text(strip=True)} -> {a.get('href')}")

# Save full header HTML for detailed inspection
header_tag = soup.find('header') or soup.find('div', id='masthead') or soup.find(class_=re.compile(r'site-header|header', re.I))
if header_tag:
    with open(r'D:\melvin colg\Stphilos\scripts\official_header.html', 'w', encoding='utf-8') as f:
        f.write(str(header_tag))
    print("\nSaved full header HTML to scripts/official_header.html")
