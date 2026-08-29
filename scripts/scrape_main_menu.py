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

r = requests.get('https://stphilos.ac.in/', headers=HEADERS, timeout=20)
soup = BeautifulSoup(r.text, 'html.parser')

print("=== SEARCHING FOR MAIN MENU WITH 'About Us', 'Academics', 'Examination' ===")

for ul in soup.find_all(['ul', 'nav']):
    links = [a.get_text(strip=True) for a in ul.find_all('a') if a.get_text(strip=True)]
    if any('About' in l for l in links) or any('Academic' in l for l in links) or any('Examination' in l for l in links):
        print(f"\nFound Menu ({ul.name}, id='{ul.get('id')}', class='{ul.get('class')}'):")
        for a in ul.find_all('a'):
            href = a.get('href')
            text = a.get_text(strip=True)
            if text:
                print(f"   • '{text}' -> {href}")

# Let's also look for Elementor Mega Menu content containers (often divs with class ekit-mega-menu or thim-ekits-menu__dropdown)
print("\n=== SEARCHING FOR MEGA MENU DROPDOWN CONTENTS ===")
for dropdown in soup.find_all(class_=re.compile(r'dropdown|mega|sub-menu|content-container', re.I)):
    classes = dropdown.get('class', [])
    text = dropdown.get_text(separator=' | ', strip=True)
    if text and len(text) > 20:
        print(f"\nDropdown ({' '.join(classes[:3])}):")
        print(f"   Text: {text[:200]}...")
        links = [a.get_text(strip=True) for a in dropdown.find_all('a') if a.get_text(strip=True)]
        print(f"   Links: {links[:10]}")

# Also download the official banner logo
banner_url = 'https://stphilos.ac.in/wp-content/uploads/2025/04/Philosbanner.jpg'
banner_1024 = 'https://stphilos.ac.in/wp-content/uploads/2025/04/Philosbanner-1024x183.jpg'
white_logo = 'https://stphilos.ac.in/wp-content/uploads/2023/02/White_clglogo-1.png'
crest_logo = 'https://stphilos.ac.in/wp-content/uploads/2023/11/St-Philomenas-College-Mysore3.jpg'

for img_url in [banner_url, banner_1024, white_logo, crest_logo]:
    fname = os.path.basename(img_url)
    dest = os.path.join(r"D:\melvin colg\Stphilos\public\assets", fname)
    try:
        res = requests.get(img_url, headers=HEADERS, timeout=15)
        if res.status_code == 200:
            with open(dest, 'wb') as f:
                f.write(res.content)
            print(f"Downloaded official asset: {fname} ({len(res.content)} bytes)")
    except Exception as e:
        print(f"Failed to download {img_url}: {e}")
