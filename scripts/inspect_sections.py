import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
from bs4 import BeautifulSoup

with open(r'D:\melvin colg\Stphilos\scripts\official_header.html', 'r', encoding='utf-8') as f:
    html = f.read()

soup = BeautifulSoup(html, 'html.parser')

print(f"Total HTML length: {len(html)} chars")

# Find all elementor sections
sections = soup.find_all('section', class_=re.compile(r'elementor-section', re.I))
print(f"Found {len(sections)} elementor sections:")

for s_idx, sec in enumerate(sections):
    sec_classes = sec.get('class', [])
    print(f"\n--- Section #{s_idx} ({' '.join(sec_classes[:4])}) ---")
    
    # Check widgets in this section
    widgets = sec.find_all('div', class_=re.compile(r'elementor-widget', re.I))
    print(f"   Widgets ({len(widgets)}):")
    for w in widgets:
        w_type = w.get('data-widget_type', 'unknown')
        w_text = w.get_text(separator=' | ', strip=True)
        # Find images in this widget
        w_imgs = [img.get('src') or img.get('data-src') for img in w.find_all('img')]
        # Find links in this widget
        w_links = [f"{a.get_text(strip=True)} -> {a.get('href')}" for a in w.find_all('a') if a.get_text(strip=True)]
        print(f"     [{w_type}]")
        if w_imgs:
            print(f"        Images: {w_imgs}")
        if w_text:
            print(f"        Text: {w_text[:120]}...")
        if w_links:
            print(f"        Links ({len(w_links)}): {w_links[:8]}")

