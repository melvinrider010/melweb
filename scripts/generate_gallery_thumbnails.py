import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import glob
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from PIL import Image

PROJECT_ROOT = r"D:\melvin colg\Stphilos"
ALBUMS_DIR = os.path.join(PROJECT_ROOT, "public", "gallery", "albums")
THUMBS_DIR = os.path.join(PROJECT_ROOT, "public", "gallery", "thumbs")

os.makedirs(THUMBS_DIR, exist_ok=True)

# Target specs:
# Card Thumbnail: max 480px width/height, WebP format, quality 75
MAX_THUMB_SIZE = (480, 480)
QUALITY = 75

def process_image(img_path):
    rel_path = os.path.relpath(img_path, ALBUMS_DIR)
    album_slug = os.path.dirname(rel_path)
    filename = os.path.basename(rel_path)
    base_name, _ = os.path.splitext(filename)
    
    thumb_album_dir = os.path.join(THUMBS_DIR, album_slug)
    os.makedirs(thumb_album_dir, exist_ok=True)
    
    thumb_path = os.path.join(thumb_album_dir, f"{base_name}.webp")
    
    # Check if already generated and valid
    if os.path.exists(thumb_path) and os.path.getsize(thumb_path) > 500:
        return {'status': 'existing', 'src': img_path, 'thumb': thumb_path}
        
    try:
        with Image.open(img_path) as im:
            # Handle orientation if EXIF present
            try:
                from PIL import ImageOps
                im = ImageOps.exif_transpose(im)
            except Exception:
                pass
                
            # Convert RGBA/P to RGB for clean WebP
            if im.mode in ('RGBA', 'LA', 'P'):
                im = im.convert('RGB')
            elif im.mode != 'RGB':
                im = im.convert('RGB')
                
            # Resize preserving aspect ratio (LANCZOS filter for crisp quality)
            im.thumbnail(MAX_THUMB_SIZE, Image.Resampling.LANCZOS)
            
            # Save optimized WebP
            im.save(thumb_path, 'WEBP', quality=QUALITY, method=4)
            
        return {'status': 'generated', 'src': img_path, 'thumb': thumb_path}
    except Exception as e:
        return {'status': 'error', 'src': img_path, 'error': str(e)}

def generate_all_thumbnails():
    start_time = time.time()
    print("==========================================", flush=True)
    print("STARTING GALLERY THUMBNAIL GENERATION", flush=True)
    print("==========================================", flush=True)
    
    all_images = glob.glob(os.path.join(ALBUMS_DIR, "*", "*.*"))
    # Filter valid extensions
    valid_exts = {'.jpg', '.jpeg', '.png', '.webp', '.gif', '.bmp'}
    images = [f for f in all_images if os.path.splitext(f)[1].lower() in valid_exts]
    
    total = len(images)
    print(f"Found {total} original images across album directories.", flush=True)
    print(f"Generating optimized 480px WebP thumbnails to {THUMBS_DIR} ...", flush=True)
    
    generated_count = 0
    existing_count = 0
    error_count = 0
    
    with ThreadPoolExecutor(max_workers=12) as executor:
        futures = {executor.submit(process_image, img): img for img in images}
        completed = 0
        for f in as_completed(futures):
            res = f.result()
            completed += 1
            if res['status'] == 'generated':
                generated_count += 1
            elif res['status'] == 'existing':
                existing_count += 1
            else:
                error_count += 1
                print(f"Error processing {res['src']}: {res.get('error')}", flush=True)
                
            if completed % 200 == 0 or completed == total:
                pct = (completed / total) * 100
                print(f"Progress: [{completed}/{total}] ({pct:.1f}%) | Generated: {generated_count}, Already Existed: {existing_count}, Errors: {error_count}", flush=True)
                
    elapsed = time.time() - start_time
    
    # Calculate sizes
    orig_total_bytes = sum(os.path.getsize(f) for f in images)
    thumb_files = glob.glob(os.path.join(THUMBS_DIR, "*", "*.webp"))
    thumb_total_bytes = sum(os.path.getsize(f) for f in thumb_files)
    
    print("\n" + "="*42, flush=True)
    print("THUMBNAIL GENERATION COMPLETE", flush=True)
    print("="*42, flush=True)
    print(f"Originals count:        {len(images)} ({orig_total_bytes / (1024*1024):.1f} MB)", flush=True)
    print(f"Thumbnails count:       {len(thumb_files)} ({thumb_total_bytes / (1024*1024):.1f} MB)", flush=True)
    if orig_total_bytes > 0:
        savings = (1 - (thumb_total_bytes / orig_total_bytes)) * 100
        print(f"Bandwidth / Memory saved: {savings:.1f}% reduction!", flush=True)
        print(f"Average thumbnail size:  {thumb_total_bytes / len(thumb_files) / 1024:.1f} KB", flush=True)
    print(f"Time elapsed:           {elapsed:.2f} seconds", flush=True)
    print("="*42 + "\n", flush=True)

if __name__ == "__main__":
    generate_all_thumbnails()
