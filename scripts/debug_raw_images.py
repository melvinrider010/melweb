import urllib.request
import json
import re
from bs4 import BeautifulSoup

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

test_urls = [
    ("placement-cell", "https://stphilos.ac.in/placement-cell/"),
    ("facilities", "https://stphilos.ac.in/facilities/"),
    ("girls-hostel", "https://stphilos.ac.in/about-us-2/infrastructure/girls-hostel/"),
    ("ncc", "https://stphilos.ac.in/ncc/"),
    ("library", "https://stphilos.ac.in/library/")
]

for slug, url in test_urls:
    print(f"\n==================== {slug} ({url}) ====================")
    req = urllib.request.Request(url, headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error: {e}")
        continue
        
    soup = BeautifulSoup(html, 'html.parser')
    
    # Print all img tags with all attributes
    imgs = soup.find_all('img')
    print(f"Total <img> tags in page: {len(imgs)}")
    for idx, img in enumerate(imgs):
        print(f"  Img #{idx+1}:")
        for attr, val in img.attrs.items():
            print(f"    {attr}: {val}")
            
    # Print all elementor or div containers with background images
    bgs = soup.find_all(style=re.compile(r'url\(', re.I))
    print(f"Total elements with background-image: {len(bgs)}")
    for bg in bgs:
        print(f"  BG: {bg.get('class')} -> {bg.get('style')}")

