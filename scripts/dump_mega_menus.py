import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
from bs4 import BeautifulSoup

with open(r'D:\melvin colg\Stphilos\scripts\official_header.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

# Find all mega menu containers (in Elementor/HTMega/ElementsKit, each mega menu is inside a sub-menu or elementor-template)
print("=== DUMPING ALL MEGA MENU TEMPLATES / SECTIONS ===")

# In Elementor/ElementsKit, mega menus are rendered as sections inside menu items
# Let's find all menu items with mega menu content
for item in soup.find_all(['li', 'div'], class_=re.compile(r'menu-item-has-children|has-mega-menu|thim-ekits-menu__dropdown', re.I)):
    title_el = item.find(['a', 'span'], class_=re.compile(r'title|text|link', re.I))
    title = title_el.get_text(strip=True) if title_el else "Unknown"
    
    # Extract all headings, links, paragraphs, images inside this mega menu
    headings = [h.get_text(strip=True) for h in item.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'span'], class_=re.compile(r'heading|title', re.I)) if h.get_text(strip=True)]
    links = [{'text': a.get_text(strip=True), 'href': a.get('href')} for a in item.find_all('a') if a.get_text(strip=True)]
    paragraphs = [p.get_text(strip=True) for p in item.find_all(['p', 'div'], class_=re.compile(r'text-editor|description', re.I)) if p.get_text(strip=True)]
    imgs = [img.get('src') or img.get('data-src') for img in item.find_all('img') if img.get('src') or img.get('data-src')]
    
    print(f"\n==========================================")
    print(f"MENU: '{title}'")
    print(f"==========================================")
    print(f"Headings: {headings}")
    print(f"Paragraphs: {paragraphs}")
    print(f"Links count: {len(links)}")
    for l in links[:20]:
        print(f"   • {l['text']} -> {l['href']}")
    if len(links) > 20:
        print(f"   ... and {len(links)-20} more links")
    print(f"Images: {imgs}")
