import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
from bs4 import BeautifulSoup

with open(r'D:\melvin colg\Stphilos\scripts\official_header.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

print("=== ALL NAVIGATION MENUS IN HEADER ===")
navs = soup.find_all(['nav', 'ul', 'div'], class_=re.compile(r'menu|nav|ekit', re.I))

for i, nav in enumerate(navs):
    classes = nav.get('class', [])
    nav_id = nav.get('id', '')
    # only look at container ul or nav
    if nav.name in ['nav', 'ul']:
        items = [a.get_text(strip=True) for a in nav.find_all('a') if a.get_text(strip=True)]
        if items:
            print(f"\n--- Nav #{i} ({nav.name}, id='{nav_id}', class='{' '.join(classes)}') ---")
            print(f"Items ({len(items)}): {items[:15]}")

print("\n=== ALL IMAGES IN HEADER ===")
for img in soup.find_all('img'):
    print(f"Img: src={img.get('src') or img.get('data-src')}")
    print(f"     srcset={img.get('srcset') or img.get('data-srcset')}")
    print(f"     alt={img.get('alt')}, class={img.get('class')}")

print("\n=== ALL TEXT BLOCKS IN HEADER ===")
for div in soup.find_all(['div', 'section'], class_=re.compile(r'elementor-element', re.I)):
    # check if direct text
    text = div.get_text(strip=True)
    if len(text) > 0 and len(text) < 100:
        # print specific widgets
        widget_type = div.get('data-widget_type', '')
        if widget_type:
            print(f"Widget: {widget_type} -> '{text}'")

# Look at main menu links and hierarchy
print("\n=== DETAILED MENU HIERARCHY ===")
# Find all menu items with submenus
for li in soup.find_all('li', class_=re.compile(r'menu-item', re.I)):
    # Check if top-level
    parent_ul = li.find_parent('ul')
    is_top = parent_ul and 'sub-menu' not in parent_ul.get('class', [])
    a_tag = li.find('a')
    if a_tag and is_top:
        label = a_tag.get_text(strip=True)
        href = a_tag.get('href', '')
        # Check children sub-menu
        submenu = li.find('ul', class_=re.compile(r'sub-menu|dropdown', re.I))
        sub_items = []
        if submenu:
            for sub_li in submenu.find_all('li'):
                sub_a = sub_li.find('a')
                if sub_a:
                    sub_items.append({
                        'label': sub_a.get_text(strip=True),
                        'href': sub_a.get('href')
                    })
        print(f"Top-Level: '{label}' -> {href} ({len(sub_items)} sub-items)")
        for s in sub_items:
            print(f"   └── '{s['label']}' -> {s['href']}")
