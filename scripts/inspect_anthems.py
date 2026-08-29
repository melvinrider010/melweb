import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import requests
from bs4 import BeautifulSoup

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
}

url = 'https://stphilos.ac.in/anthems/'
print(f"Fetching {url}...")
try:
    r = requests.get(url, headers=HEADERS, timeout=20)
    print(f"Status: {r.status_code}, Length: {len(r.text)} bytes")
    soup = BeautifulSoup(r.text, 'html.parser')
    
    print("\n=== PAGE TITLE ===")
    print(soup.title.string if soup.title else "No title")
    
    print("\n=== ANTHEM LINKS & ASSETS ===")
    for a in soup.find_all('a'):
        href = a.get('href', '')
        text = a.get_text(strip=True)
        if any(k in href.lower() or k in text.lower() for k in ['pdf', 'mp3', 'audio', 'video', 'anthem', 'philo', 'national', 'download']):
            print(f"  • '{text}' -> {href}")
            
    print("\n=== AUDIO / VIDEO / EMBEDS / IFRAMES ===")
    for tag in soup.find_all(['audio', 'video', 'iframe', 'embed', 'source']):
        print(f"  [{tag.name}] src={tag.get('src')} data={tag.get('data')}")
        
    print("\n=== MAIN CONTENT ELEMENTS ===")
    content = soup.find('div', class_='entry-content') or soup.find('main') or soup.find('article')
    if content:
        for el in content.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'p', 'div']):
            txt = el.get_text(strip=True)
            if txt and len(txt) < 300 and any(k in txt.lower() for k in ['anthem', 'philo', 'national', 'jana', 'rabindranath', 'prayer']):
                print(f"  <{el.name}> {txt}")
except Exception as e:
    print(f"Error: {e}")
