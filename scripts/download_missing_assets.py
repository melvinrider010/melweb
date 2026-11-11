import json
import sqlite3
import os
import urllib.request
import ssl
import time

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def download_missing_notice_assets():
    print("=== AUDITING & DOWNLOADING MISSING NOTICE & EVENT ASSETS ===")
    conn = sqlite3.connect('backend/database/database.sqlite')
    conn.row_factory = sqlite3.Row
    c = conn.cursor()
    c.execute("SELECT id, slug, title, document_image FROM notices WHERE document_image IS NOT NULL AND document_image != ''")
    notices_with_assets = [dict(r) for r in c.fetchall()]
    conn.close()

    print(f"Total notices with asset paths in DB: {len(notices_with_assets)}")

    missing = []
    found = 0
    for n in notices_with_assets:
        doc_img = n['document_image']
        # Remove leading slash
        clean_path = doc_img.lstrip('/')
        local_p = os.path.join('public', clean_path)
        if os.path.exists(local_p) and os.path.getsize(local_p) > 0:
            found += 1
        else:
            missing.append(n)

    print(f"Verified present locally: {found}")
    print(f"Missing locally: {len(missing)}")

    # Load original posts to get original image URLs
    with open('scripts/all_wp_posts.json', 'r', encoding='utf-8') as f:
        wp_posts = json.load(f)
    wp_by_id = {p['id']: p for p in wp_posts}
    wp_by_slug = {p['slug']: p for p in wp_posts}

    success_downloads = 0
    failed_downloads = 0

    for i, item in enumerate(missing):
        doc_img = item['document_image']
        # Original URL reconstruction:
        # Most /media/notices/2026/... correspond to https://stphilos.ac.in/wp-content/uploads/2026/...
        # Let's check original post content or featured media first!
        import re
        m = re.search(r'wp_(\d+)', item['id'])
        wp_id = int(m.group(1)) if m else None
        orig_post = wp_by_id.get(wp_id) or wp_by_slug.get(item['slug'])

        candidate_urls = []
        if doc_img.startswith('/media/notices/'):
            # Convert /media/notices/2026/xxx.jpg -> https://stphilos.ac.in/wp-content/uploads/2026/xxx.jpg
            sub = doc_img.replace('/media/notices/', '')
            candidate_urls.append(f"https://stphilos.ac.in/wp-content/uploads/{sub}")
        elif doc_img.startswith('/assets/'):
            candidate_urls.append(f"https://stphilos.ac.in/{doc_img.lstrip('/')}")
        
        # If orig_post has content images or featured media
        if orig_post:
            html = orig_post.get('content', {}).get('rendered', '')
            imgs = re.findall(r'src=[\'"]([^\'"]+)[\'"]', html)
            candidate_urls.extend(imgs)

        target_local_path = os.path.join('public', doc_img.lstrip('/'))
        os.makedirs(os.path.dirname(target_local_path), exist_ok=True)

        downloaded = False
        for curl in candidate_urls:
            if not curl.startswith('http'):
                continue
            req = urllib.request.Request(curl, headers={'User-Agent': 'Mozilla/5.0'})
            try:
                with urllib.request.urlopen(req, context=ctx, timeout=10) as resp:
                    if resp.status == 200:
                        content = resp.read()
                        if len(content) > 100:  # Valid non-empty file
                            with open(target_local_path, 'wb') as f:
                                f.write(content)
                            downloaded = True
                            success_downloads += 1
                            if (success_downloads % 20 == 0) or success_downloads <= 5:
                                print(f"[{success_downloads}] Downloaded: {curl} -> {target_local_path} ({len(content):,} bytes)")
                            break
            except Exception:
                continue

        if not downloaded:
            failed_downloads += 1

        if i % 50 == 0 and i > 0:
            print(f"Progress: processed {i}/{len(missing)} (Downloaded: {success_downloads}, Failed: {failed_downloads})")

    print(f"\nAsset Download Complete! Successfully downloaded: {success_downloads}, Unobtainable (404 on original): {failed_downloads}")

if __name__ == '__main__':
    download_missing_notice_assets()
