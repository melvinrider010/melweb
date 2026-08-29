import sys
sys.stdout.reconfigure(encoding='utf-8')
import os
import shutil
import requests

PROJECT_ROOT = r"D:\melvin colg\Stphilos"
ANTHEMS_DIR = os.path.join(PROJECT_ROOT, "public", "anthems")
os.makedirs(ANTHEMS_DIR, exist_ok=True)

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Referer': 'https://stphilos.ac.in/anthems/'
}

files_to_download = [
    {
        'url': 'https://stphilos.ac.in/wp-content/uploads/2024/01/AUD-20240111-WA0003.mp3',
        'local_name': 'philos-anthem.mp3',
        'title': "Philo's College Anthem"
    },
    {
        'url': 'https://stphilos.ac.in/wp-content/uploads/2024/01/01-JAYA-BHARATHA-JANANIYA.mp3',
        'local_name': '01-JAYA-BHARATHA-JANANIYA.mp3',
        'title': "State & National Anthem (Jaya Bharatha Jananiya)"
    }
]

print("=== DOWNLOADING OFFICIAL ANTHEMS ASSETS ===")
for item in files_to_download:
    dest = os.path.join(ANTHEMS_DIR, item['local_name'])
    print(f"Downloading {item['title']} from {item['url']} ...")
    try:
        r = requests.get(item['url'], headers=HEADERS, timeout=30)
        if r.status_code == 200:
            with open(dest, 'wb') as f:
                f.write(r.content)
            print(f"  -> SUCCESS: {dest} ({len(r.content) / 1024 / 1024:.2f} MB)")
        else:
            print(f"  -> FAILED: HTTP {r.status_code}")
    except Exception as e:
        print(f"  -> ERROR: {e}")

# Copy existing official college-anthem.pdf to public/anthems/college-anthem.pdf as well
pdf_src = os.path.join(PROJECT_ROOT, "public", "assets", "documents", "general", "college-anthem.pdf")
pdf_dest = os.path.join(ANTHEMS_DIR, "college-anthem.pdf")
if os.path.exists(pdf_src):
    shutil.copy(pdf_src, pdf_dest)
    print(f"Copied official college-anthem.pdf to {pdf_dest} ({os.path.getsize(pdf_dest)} bytes)")
else:
    print(f"Source PDF not found at {pdf_src}")

print("\n=== VERIFYING PUBLIC/ANTHEMS DIRECTORY ===")
for f in os.listdir(ANTHEMS_DIR):
    fpath = os.path.join(ANTHEMS_DIR, f)
    print(f"  {f} ({os.path.getsize(f)} bytes)")
