import urllib.request
import ssl
import json
import time
import os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch_all_wp_posts():
    print("=== FETCHING ALL 2,299 WORDPRESS POSTS FROM STPHILOS.AC.IN ===")
    all_posts = []
    total_pages = 24  # 2,299 / 100 = 23 pages

    for page in range(1, total_pages + 1):
        url = f"https://stphilos.ac.in/wp-json/wp/v2/posts?per_page=100&page={page}"
        print(f"Fetching posts page {page}/{total_pages}...")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        retries = 3
        while retries > 0:
            try:
                with urllib.request.urlopen(req, context=ctx, timeout=20) as resp:
                    data = json.loads(resp.read().decode())
                    if not data:
                        break
                    all_posts.extend(data)
                    print(f"  Page {page}: received {len(data)} posts. Total so far: {len(all_posts)}")
                    break
            except Exception as e:
                retries -= 1
                print(f"  Page {page} attempt failed ({e}), retries left: {retries}")
                time.sleep(2)
        time.sleep(0.5)

    print(f"\nFinished fetching posts! Total retrieved: {len(all_posts)}")
    with open('scripts/all_wp_posts.json', 'w', encoding='utf-8') as f:
        json.dump(all_posts, f, indent=2)
    print("Saved to scripts/all_wp_posts.json successfully.")

if __name__ == '__main__':
    fetch_all_wp_posts()
