import urllib.request, ssl, json, os

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def fetch_all_wp_pages():
    print("=== FETCHING ALL WORDPRESS PAGES FROM STPHILOS.AC.IN ===")
    all_pages = []
    page = 1
    while True:
        url = f"https://stphilos.ac.in/wp-json/wp/v2/pages?per_page=100&page={page}"
        print(f"Fetching page {page}: {url}")
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
                data = json.loads(resp.read().decode())
                if not data:
                    break
                all_pages.extend(data)
                print(f"  Got {len(data)} pages (Total so far: {len(all_pages)})")
                total_pages_header = resp.headers.get('X-WP-TotalPages')
                if total_pages_header and page >= int(total_pages_header):
                    break
                page += 1
        except Exception as e:
            print(f"  End of pages or error on page {page}: {e}")
            break

    print(f"\nTotal WordPress Pages fetched: {len(all_pages)}")
    with open('scripts/all_wp_pages.json', 'w', encoding='utf-8') as f:
        json.dump(all_pages, f, indent=2)

    # Print summary of interesting pages
    print("\nSample Pages:")
    for p in all_pages:
        slug = p.get('slug')
        title = p.get('title', {}).get('rendered', '')
        link = p.get('link')
        if any(k in slug.lower() for k in ['nirf', 'naac', 'iqac', 'exam', 'admission', 'calendar', 'document', 'mandatory', 'compliance', 'iic', 'notice', 'circular']):
            print(f"  [{slug}] {title} -> {link}")

if __name__ == '__main__':
    fetch_all_wp_pages()
