import os
import json
import sqlite3

def inspect_current_state():
    print("=== DATA FILES IN src/data ===")
    for f in sorted(os.listdir('src/data')):
        path = os.path.join('src/data', f)
        if os.path.isfile(path):
            size = os.path.getsize(path)
            print(f"{f}: {size:,} bytes")

    print("\n=== SQLITE DATABASE TABLES & ROW COUNTS ===")
    conn = sqlite3.connect('backend/database/database.sqlite')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name")
    tables = [r[0] for r in c.fetchall()]
    for t in tables:
        c.execute(f"SELECT COUNT(*) FROM {t}")
        cnt = c.fetchone()[0]
        print(f"Table '{t}': {cnt} rows")

    print("\n=== INSPECTING NOTICES TABLE ===")
    c.execute("PRAGMA table_info(notices)")
    cols = [r['name'] for r in c.fetchall()]
    print("Columns:", cols)
    c.execute("SELECT id, slug, title, category, date, document_image, link, downloadable FROM notices LIMIT 5")
    for r in c.fetchall():
        print(dict(r))

    print("\n=== INSPECTING EVENTS TABLE ===")
    c.execute("PRAGMA table_info(events)")
    cols = [r['name'] for r in c.fetchall()]
    print("Columns:", cols)
    c.execute("SELECT * FROM events LIMIT 3")
    for r in c.fetchall():
        print(dict(r))

    print("\n=== INSPECTING DOCUMENTS TABLE ===")
    if 'documents' in tables:
        c.execute("PRAGMA table_info(documents)")
        cols = [r['name'] for r in c.fetchall()]
        print("Columns:", cols)
        c.execute("SELECT * FROM documents LIMIT 3")
        for r in c.fetchall():
            print(dict(r))

    print("\n=== INSPECTING EVENT_ATTACHMENTS TABLE ===")
    if 'event_attachments' in tables:
        c.execute("PRAGMA table_info(event_attachments)")
        cols = [r['name'] for r in c.fetchall()]
        print("Columns:", cols)
        c.execute("SELECT * FROM event_attachments LIMIT 3")
        for r in c.fetchall():
            print(dict(r))

    conn.close()

    print("\n=== INSPECTING LEGACY-URL-MAP.JSON ===")
    if os.path.exists('src/data/legacy-url-map.json'):
        with open('src/data/legacy-url-map.json', 'r', encoding='utf-8') as f:
            legacy_map = json.load(f)
        print("Total legacy URL mappings:", len(legacy_map))
        print("Sample item 0:", json.dumps(legacy_map[0], indent=2))
        print("Sample item 1:", json.dumps(legacy_map[1], indent=2))

if __name__ == '__main__':
    inspect_current_state()


def probe_original_site():
    import urllib.request, ssl
    print("\n=== PROBING ORIGINAL SITE WP-JSON ===")
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    urls = [
        'https://stphilos.ac.in/wp-json/wp/v2/posts?per_page=5',
        'https://stphilos.ac.in/wp-json/wp/v2/pages?per_page=5',
        'https://stphilos.ac.in/wp-json/wp/v2/categories?per_page=20',
        'https://stphilos.ac.in/'
    ]

    for u in urls:
        print(f"\nProbing: {u}")
        req = urllib.request.Request(
            u,
            headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'}
        )
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=12) as resp:
                print(f"Status: {resp.status}, Content-Type: {resp.headers.get('Content-Type')}")
                if 'json' in resp.headers.get('Content-Type', ''):
                    data = json.loads(resp.read().decode())
                    if isinstance(data, list):
                        print(f"Returned list with {len(data)} items.")
                        if data:
                            first = data[0]
                            print("Sample item keys:", list(first.keys())[:10])
                            if 'title' in first:
                                print("Title rendered:", first['title'])
                    elif isinstance(data, dict):
                        print("Returned dict keys:", list(data.keys())[:10])
                else:
                    body = resp.read()
                    print(f"Returned HTML/Data: {len(body):,} bytes")
        except Exception as e:
            print(f"Error connecting to {u}: {e}")

if __name__ == '__main__':
    probe_original_site()


def fetch_categories():
    import urllib.request, ssl
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    url = 'https://stphilos.ac.in/wp-json/wp/v2/categories?per_page=100'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, context=ctx, timeout=15) as resp:
        cats = json.loads(resp.read().decode())
    print(f"\n=== WP CATEGORIES ON STPHILOS.AC.IN (Total {len(cats)}) ===")
    for c in sorted(cats, key=lambda x: x['count'], reverse=True):
        print(f"ID: {c['id']:<5} | Count: {c['count']:<5} | Slug: {c['slug']:<30} | Name: {c['name']}")

if __name__ == '__main__':
    fetch_categories()


def inspect_local_asset_storage():
    print("\n=== LOCAL ASSET DIRECTORIES ===")
    dirs_to_check = [
        'public',
        'public/media',
        'public/media/notices',
        'public/assets',
        'public/assets/documents',
        'public/assets/documents/historical',
        'backend/storage/app/public',
        'backend/storage/app/public/media',
        'backend/public/storage'
    ]
    for d in dirs_to_check:
        if os.path.exists(d):
            file_count = sum(len(files) for _, _, files in os.walk(d))
            print(f"Directory '{d}': EXISTS, total files: {file_count}")
        else:
            print(f"Directory '{d}': DOES NOT EXIST")

if __name__ == '__main__':
    inspect_local_asset_storage()


def inspect_sample_wp_posts():
    import urllib.request, ssl
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    print("\n=== FETCHING RAW WP POSTS FROM STPHILOS.AC.IN ===")
    for pid in [43565, 43562, 43548, 43551, 43533]:
        url = f'https://stphilos.ac.in/wp-json/wp/v2/posts/{pid}'
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        try:
            with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                data = json.loads(resp.read().decode())
                print(f"\n--- WP POST {pid} ---")
                print("Title rendered:", data.get('title', {}).get('rendered'))
                print("Slug:", data.get('slug'))
                print("Date:", data.get('date'))
                print("Link:", data.get('link'))
                content = data.get('content', {}).get('rendered', '')
                print("Content length:", len(content))
                print("Content snippet:", content[:250].replace('\n', ' '))
                print("Categories:", data.get('categories'))
                print("Featured Media ID:", data.get('featured_media'))
        except Exception as e:
            print(f"Error {pid}:", e)

if __name__ == '__main__':
    inspect_sample_wp_posts()


def inspect_media_43566():
    import urllib.request, ssl
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    url = 'https://stphilos.ac.in/wp-json/wp/v2/media/43566'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
            data = json.loads(resp.read().decode())
            print("\n=== MEDIA 43566 ===")
            print("Title rendered:", data.get('title', {}).get('rendered'))
            print("Source URL:", data.get('source_url'))
            print("MIME type:", data.get('mime_type'))
            print("Media details:", list(data.get('media_details', {}).keys()))
    except Exception as e:
        print("Media 43566 error:", e)

if __name__ == '__main__':
    inspect_media_43566()
