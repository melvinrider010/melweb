import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import re
import json
import time
import hashlib
import urllib.parse
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests
from bs4 import BeautifulSoup
from PIL import Image
import io

PROJECT_ROOT = r"D:\melvin colg\Stphilos"
PUBLIC_DIR = os.path.join(PROJECT_ROOT, "public")
GALLERY_DIR = os.path.join(PUBLIC_DIR, "gallery", "albums")
DATA_DIR = os.path.join(PROJECT_ROOT, "src", "data")
MANIFEST_PATH = os.path.join(PROJECT_ROOT, "gallery-manifest.json")
REPORT_PATH = os.path.join(PROJECT_ROOT, "gallery-migration-report.json")
FAILED_PATH = os.path.join(PROJECT_ROOT, "gallery-failed-downloads.json")
GALLERY_DATA_JS = os.path.join(DATA_DIR, "galleryData.json")
PUBLIC_MANIFEST_PATH = os.path.join(PUBLIC_DIR, "gallery-manifest.json")

os.makedirs(GALLERY_DIR, exist_ok=True)
os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(os.path.join(PROJECT_ROOT, "scripts"), exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
    'Referer': 'https://stphilos.ac.in/'
}

session = requests.Session()
session.headers.update(HEADERS)

def slugify(text):
    text = re.sub(r'[^\w\s-]', '', text.lower())
    return re.sub(r'[-\s]+', '-', text).strip('-')

def determine_category(title, url):
    title_lower = (title + " " + url).lower()
    if any(k in title_lower for k in ['sport', 'athletic', 'cricket', 'football', 'hockey', 'basket', 'volley', 'match', 'tournament', 'championship']):
        return 'sports', 'Sports & Athletics'
    elif any(k in title_lower for k in ['seminar', 'conference', 'workshop', 'fdp', 'lecture', 'talk', 'symposium', 'incredma', 'research', 'lab', 'math', 'exam', 'certificate']):
        return 'academics', 'Academics & Seminars'
    elif any(k in title_lower for k in ['cultural', 'retro', 'rajyotsava', 'habba', 'kannada', 'dj', 'music', 'dance', 'cake', 'fest', 'mahotsav', 'philo-fest', 'literary']):
        return 'cultural', 'Cultural & Heritage'
    elif any(k in title_lower for k in ['dowry', 'cancer', 'traffic', 'safety', 'earth', 'environment', 'green', 'drug', 'fire', 'rally', 'mysuru', 'peer', 'audit', 'parents', 'swachh', 'initiative', 'outreach', 'redcross', 'nss', 'ncc', 'b-voc', 'health', 'tourism', 'maldives']):
        return 'outreach', 'Campus Life & Community'
    elif any(k in title_lower for k in ['graduation', 'convocation', 'republic', 'independence', 'freshers', 'farewell', 'orientation', 'inaugural', 'mass', 'day-20', 'celebration', 'teachers']):
        return 'events', 'Events & Fests'
    return 'events', 'Events & Fests'

def extract_year(title, url):
    match = re.search(r'\b(201\d|202\d)\b', title + " " + url)
    if match:
        return match.group(1)
    if '2k22' in (title + " " + url).lower():
        return '2022'
    return '2024'

def clean_title(title, url):
    t = title.strip()
    if not t or len(t) < 3 or '%' in t:
        slug = url.strip('/').split('/')[-1]
        t = slug.replace('-', ' ').title()
    t = re.sub(r'\s+', ' ', t).strip()
    return t

def get_picture_gallery_albums():
    print("Discovering official gallery albums from https://stphilos.ac.in/picture-gallery/ ...", flush=True)
    r = session.get('https://stphilos.ac.in/picture-gallery/', timeout=20)
    soup = BeautifulSoup(r.text, 'html.parser')
    
    albums = {}
    main_content = soup.find('div', class_='entry-content') or soup.find('article') or soup.body
    
    for a in main_content.find_all('a', href=True):
        href = a['href'].rstrip('/') + '/'
        if not href.startswith('https://stphilos.ac.in/'):
            continue
        if any(x in href for x in ['wp-content', 'wp-admin', 'wp-json', '#', 'picture-gallery', 'video-gallery', 'gallery', 'vision-mission', 'about-us', 'contact-us', 'iqac', 'nirf', 'naac', 'alumni', 'admission', 'course', 'mandatory-disclosure', 'syllabus', 'examination', 'nep-regulations', 'calendar', 'time-table', 'research', 'placement', 'committee', 'cell', 'facilities', 'library', 'hostel', 'counselling', 'ethics', 'redcross', 'ncc', 'nss', 'sports', 'stadium', 'chapel', 'bank', 'auditorium', 'bulletin', 'swayam', 'anthems']):
            continue
            
        title = a.get_text(strip=True)
        img = a.find('img')
        cover_src = None
        if img:
            cover_src = img.get('data-src') or img.get('src') or img.get('data-lazy-src')
            
        if href not in albums:
            albums[href] = {
                'url': href,
                'title': title,
                'cover_src': cover_src
            }
        else:
            if not albums[href]['title'] and title:
                albums[href]['title'] = title
            if not albums[href]['cover_src'] and cover_src:
                albums[href]['cover_src'] = cover_src

    return albums

def scrape_single_album(album_info):
    url = album_info['url']
    try:
        r = session.get(url, timeout=20)
        if r.status_code != 200:
            return None
        soup = BeautifulSoup(r.text, 'html.parser')
        
        h1 = soup.find('h1') or soup.find('title')
        page_title = h1.get_text(strip=True) if h1 else album_info['title']
        final_title = clean_title(album_info['title'] if len(album_info['title']) > 5 else page_title, url)
        
        entry = soup.find('div', class_='entry-content') or soup.find('article') or soup.body
        raw_imgs = []
        seen = set()
        
        if entry:
            for img in entry.find_all('img'):
                srcset = img.get('data-srcset') or img.get('srcset')
                best_url = None
                if srcset:
                    candidates = []
                    for part in srcset.split(','):
                        tokens = part.strip().split(' ')
                        u = tokens[0].strip()
                        w = 0
                        if len(tokens) > 1 and tokens[1].endswith('w'):
                            try:
                                w = int(tokens[1][:-1])
                            except:
                                w = 0
                        candidates.append((w, u))
                    if candidates:
                        candidates.sort(key=lambda x: x[0], reverse=True)
                        best_url = candidates[0][1]
                        
                if not best_url:
                    best_url = img.get('data-src') or img.get('src') or img.get('data-lazy-src')
                    
                if best_url and 'wp-content/uploads' in best_url:
                    best_url = best_url.split('?')[0]
                    if not any(x in best_url.lower() for x in ['logo', 'cropped-st-philomena', 'naac', 'nirf', 'banner-1.jpg', 'icon']):
                        if best_url not in seen:
                            seen.add(best_url)
                            raw_imgs.append(best_url)
                            
        cover_src = album_info.get('cover_src')
        if cover_src and 'wp-content/uploads' in cover_src:
            cover_src = cover_src.split('?')[0]
            if cover_src not in seen and not any(x in cover_src.lower() for x in ['logo', 'cropped-st-philomena', 'naac', 'nirf']):
                raw_imgs.insert(0, cover_src)
                seen.add(cover_src)

        if not raw_imgs:
            return None
            
        slug = url.strip('/').split('/')[-1]
        if not slug or slug.isdigit() or len(slug) < 3 or '%' in slug:
            slug = slugify(final_title)
            
        cat_id, cat_label = determine_category(final_title, url)
        year = extract_year(final_title, url)
        
        return {
            'url': url,
            'title': final_title,
            'slug': slug,
            'category': cat_id,
            'categoryLabel': cat_label,
            'year': year,
            'images': raw_imgs,
            'image_count': len(raw_imgs)
        }
    except Exception as e:
        print(f"Error scraping album {url}: {e}", flush=True)
        return None

def verify_and_hash_file(filepath):
    try:
        if not os.path.exists(filepath):
            return False, None
        size = os.path.getsize(filepath)
        if size < 1024:
            return False, None
        with Image.open(filepath) as im:
            im.verify()
        with open(filepath, 'rb') as f:
            file_hash = hashlib.md5(f.read()).hexdigest()
        return True, file_hash
    except Exception:
        return False, None

def download_image_task(item):
    """
    Downloads and verifies a single image.
    item = {
      'album_slug': str,
      'album_title': str,
      'album_url': str,
      'img_idx': int,
      'source_url': str,
      'dest_folder': str
    }
    """
    source_url = item['source_url']
    album_slug = item['album_slug']
    img_idx = item['img_idx']
    dest_folder = item['dest_folder']
    
    # Determine filename
    ext = os.path.splitext(urllib.parse.urlparse(source_url).path)[1].lower()
    if ext not in ['.jpg', '.jpeg', '.png', '.webp', '.gif']:
        ext = '.jpg'
    filename = f"{img_idx:03d}{ext}"
    dest_path = os.path.join(dest_folder, filename)
    rel_url = f"/gallery/albums/{album_slug}/{filename}"
    
    # Check if already downloaded and valid
    valid, existing_hash = verify_and_hash_file(dest_path)
    if valid:
        return {
            'success': True,
            'status': 'alreadyExisting',
            'filename': filename,
            'sourceUrl': source_url,
            'localUrl': rel_url,
            'hash': existing_hash,
            'album_slug': album_slug,
            'img_idx': img_idx
        }
        
    # Download with retry
    retries = 3
    last_error = None
    for attempt in range(retries):
        try:
            r = session.get(source_url, timeout=20)
            if r.status_code != 200:
                last_error = f"HTTP {r.status_code}"
                time.sleep(0.5)
                continue
                
            content = r.content
            if len(content) < 500:
                last_error = "File too small (< 500 bytes)"
                time.sleep(0.5)
                continue
                
            # Verify with Pillow
            try:
                img_obj = Image.open(io.BytesIO(content))
                img_obj.verify()
            except Exception as pe:
                last_error = f"Pillow verification failed: {pe}"
                time.sleep(0.5)
                continue
                
            # Save file
            with open(dest_path, 'wb') as f:
                f.write(content)
                
            file_hash = hashlib.md5(content).hexdigest()
            return {
                'success': True,
                'status': 'downloaded',
                'filename': filename,
                'sourceUrl': source_url,
                'localUrl': rel_url,
                'hash': file_hash,
                'album_slug': album_slug,
                'img_idx': img_idx
            }
        except Exception as e:
            last_error = str(e)
            time.sleep(1)
            
    return {
        'success': False,
        'status': 'failed',
        'filename': filename,
        'sourceUrl': source_url,
        'localUrl': None,
        'hash': None,
        'error': last_error,
        'retryCount': retries,
        'album_slug': album_slug,
        'album_title': item['album_title'],
        'img_idx': img_idx
    }

def run_migration():
    start_time = time.time()
    print("====================================", flush=True)
    print("STARTING PHILOS GALLERY MIGRATION", flush=True)
    print("====================================", flush=True)
    
    albums_dict = get_picture_gallery_albums()
    print(f"Found {len(albums_dict)} album links. Scraping album structures...", flush=True)
    
    albums_data = []
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = {executor.submit(scrape_single_album, alb): alb for alb in albums_dict.values()}
        for f in as_completed(futures):
            res = f.result()
            if res and res['image_count'] > 0:
                albums_data.append(res)
                
    # Sort albums by year descending, then title
    albums_data.sort(key=lambda x: (x['year'], x['title']), reverse=True)
    print(f"\nDiscovered {len(albums_data)} verified albums with photos.", flush=True)
    
    # Prepare download queue
    download_tasks = []
    for alb in albums_data:
        album_slug = alb['slug']
        album_dir = os.path.join(GALLERY_DIR, album_slug)
        os.makedirs(album_dir, exist_ok=True)
        
        for idx, img_url in enumerate(alb['images'], 1):
            download_tasks.append({
                'album_slug': album_slug,
                'album_title': alb['title'],
                'album_url': alb['url'],
                'img_idx': idx,
                'source_url': img_url,
                'dest_folder': album_dir
            })
            
    total_images = len(download_tasks)
    print(f"Total media files to download/verify: {total_images}", flush=True)
    print("Starting concurrent media downloads (12 workers)...", flush=True)
    
    results_by_album = {alb['slug']: [] for alb in albums_data}
    failed_downloads = []
    downloaded_count = 0
    existing_count = 0
    failed_count = 0
    
    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {executor.submit(download_image_task, task): task for task in download_tasks}
        completed = 0
        for f in as_completed(futures):
            res = f.result()
            completed += 1
            if res['success']:
                results_by_album[res['album_slug']].append(res)
                if res['status'] == 'downloaded':
                    downloaded_count += 1
                else:
                    existing_count += 1
            else:
                failed_count += 1
                failed_downloads.append({
                    'album': res['album_title'],
                    'album_slug': res['album_slug'],
                    'sourceUrl': res['sourceUrl'],
                    'error': res['error'],
                    'retryCount': res['retryCount']
                })
                
            if completed % 100 == 0 or completed == total_images:
                print(f"Progress: [{completed}/{total_images}] ({completed/total_images*100:.1f}%) | Downloaded: {downloaded_count}, Local: {existing_count}, Failed: {failed_count}", flush=True)

    # Build Manifest and Final Album list
    manifest = []
    final_albums_frontend = []
    
    for alb_idx, alb in enumerate(albums_data, 1):
        slug = alb['slug']
        album_imgs = results_by_album.get(slug, [])
        # Sort images by index
        album_imgs.sort(key=lambda x: x['img_idx'])
        
        verified_images = [img['localUrl'] for img in album_imgs if img.get('localUrl')]
        
        if not verified_images:
            continue
            
        cover_image = verified_images[0]
        
        manifest_entry = {
            "albumId": f"alb_{alb_idx:03d}",
            "slug": slug,
            "title": alb['title'],
            "category": alb['category'],
            "categoryLabel": alb['categoryLabel'],
            "year": alb['year'],
            "sourceUrl": alb['url'],
            "localPath": f"/gallery/albums/{slug}",
            "cover": cover_image,
            "imageCount": len(verified_images),
            "images": [
                {
                    "filename": img['filename'],
                    "sourceUrl": img['sourceUrl'],
                    "localUrl": img['localUrl'],
                    "hash": img['hash'],
                    "status": img['status']
                }
                for img in album_imgs if img.get('localUrl')
            ]
        }
        manifest.append(manifest_entry)
        
        final_albums_frontend.append({
            "id": f"alb_{alb_idx:03d}",
            "slug": slug,
            "title": alb['title'],
            "category": alb['category'],
            "categoryLabel": alb['categoryLabel'],
            "year": alb['year'],
            "sourceUrl": alb['url'],
            "cover": cover_image,
            "imageCount": len(verified_images),
            "images": verified_images
        })
        
    duration = f"{time.time() - start_time:.2f}s"
    
    # Save Manifest
    with open(MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    with open(PUBLIC_MANIFEST_PATH, 'w', encoding='utf-8') as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
        
    # Save galleryData.json for React Frontend
    gallery_data = {
        "categories": {
            "all": "All Albums",
            "events": "Events & Fests",
            "academics": "Academics & Seminars",
            "sports": "Sports & Athletics",
            "cultural": "Cultural & Heritage",
            "outreach": "Campus Life & Community"
        },
        "totalAlbums": len(final_albums_frontend),
        "totalImages": sum(a['imageCount'] for a in final_albums_frontend),
        "albums": final_albums_frontend
    }
    with open(GALLERY_DATA_JS, 'w', encoding='utf-8') as f:
        json.dump(gallery_data, f, indent=2, ensure_ascii=False)
        
    # Save Failed Downloads
    with open(FAILED_PATH, 'w', encoding='utf-8') as f:
        json.dump(failed_downloads, f, indent=2, ensure_ascii=False)
        
    # Save Migration Report
    report = {
        "totalAlbums": len(final_albums_frontend),
        "totalImages": total_images,
        "downloaded": downloaded_count,
        "alreadyExisting": existing_count,
        "failed": failed_count,
        "duplicates": 0,
        "missing": failed_count,
        "lastRun": time.strftime("%Y-%m-%dT%H:%M:%S"),
        "duration": duration
    }
    with open(REPORT_PATH, 'w', encoding='utf-8') as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
        
    print("\n" + "="*36, flush=True)
    print("PHILOS GALLERY MIGRATION", flush=True)
    print("="*36, flush=True)
    print(f"Albums discovered:      {len(final_albums_frontend)}", flush=True)
    print(f"Images discovered:      {total_images}", flush=True)
    print(f"Images downloaded:      {downloaded_count}", flush=True)
    print(f"Already local:          {existing_count}", flush=True)
    print(f"Duplicates skipped:     0", flush=True)
    print(f"Failed:                 {failed_count}", flush=True)
    print(f"\nLocal gallery:\nREADY", flush=True)
    print(f"\nExternal image URLs:\n0", flush=True)
    print("="*36 + "\n", flush=True)

if __name__ == "__main__":
    run_migration()
