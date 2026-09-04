import urllib.request
import urllib.parse
import json
import os
import re
from bs4 import BeautifulSoup

urls = [
    {"slug": "placement-cell", "name": "Career and Placement Cell", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/placement-cell/"},
    {"slug": "student-grievance-redressal-committee", "name": "Grievance Redressal", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/student-grievance-redressal-committee/"},
    {"slug": "anti-ragging", "name": "Anti-Ragging", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/anti-ragging/"},
    {"slug": "womens-cell", "name": "Women's Cell", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/womens-cell/"},
    {"slug": "student-welfare-cell", "name": "Student Welfare Cell", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/student-welfare-cell/"},
    {"slug": "counselling-centre", "name": "Counselling Centre", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/counselling-centre/"},
    {"slug": "human-values-professional-ethics", "name": "Human Values And Professional Ethics", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/human-values-professional-ethics/"},
    {"slug": "youth-red-cross-yrc", "name": "Youth Redcross", "category": "Placement Cell & Welfare", "url": "https://stphilos.ac.in/youth-red-cross-yrc/"},
    
    {"slug": "library", "name": "Library", "category": "Amenities", "url": "https://stphilos.ac.in/library/"},
    {"slug": "college-magazine", "name": "College Magazine", "category": "Amenities", "url": "https://stphilos.ac.in/magazine/"},
    {"slug": "facilities", "name": "Physical Infrastructure", "category": "Amenities", "url": "https://stphilos.ac.in/facilities/"},
    {"slug": "business-lab", "name": "Business Lab", "category": "Amenities", "url": "https://stphilos.ac.in/business-lab/"},
    {"slug": "computer-science-lab", "name": "Computer Lab", "category": "Amenities", "url": "https://stphilos.ac.in/computer-science-lab/"},
    {"slug": "girls-hostel", "name": "Girls Hostel", "category": "Amenities", "url": "https://stphilos.ac.in/about-us-2/infrastructure/girls-hostel/"},
    {"slug": "boys-hostel", "name": "Boys Hostel", "category": "Amenities", "url": "https://stphilos.ac.in/about-us-2/infrastructure/boys-hostel/"},
    {"slug": "auditorium", "name": "Auditorium", "category": "Amenities", "url": "https://stphilos.ac.in/auditorium/"},
    {"slug": "e-journal", "name": "Philos Bulletin", "category": "Amenities", "url": "https://stphilos.ac.in/e-journal/"},
    
    {"slug": "bank-atm", "name": "Bank & ATM", "category": "Other Amenities", "url": "https://stphilos.ac.in/about-us-2/infrastructure/bank-atm/"},
    {"slug": "chapel-hall-3", "name": "Chapel", "category": "Other Amenities", "url": "https://stphilos.ac.in/chapel-hall-3/"},
    {"slug": "ranger-and-rovers", "name": "Ranger and Rovers", "category": "Other Amenities", "url": "https://stphilos.ac.in/ranger-and-rovers/"},
    {"slug": "ncc", "name": "NCC", "category": "Other Amenities", "url": "https://stphilos.ac.in/ncc/"},
    {"slug": "nss", "name": "NSS", "category": "Other Amenities", "url": "https://stphilos.ac.in/nss/"},
    {"slug": "indoor-stadium", "name": "Indoor Stadium", "category": "Other Amenities", "url": "https://stphilos.ac.in/indoor-stadium/"}
]

headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'}

os.makedirs('public/assets/student-support', exist_ok=True)
os.makedirs('public/documents/student-support', exist_ok=True)

def download_file(url, local_path):
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=25) as resp, open(local_path, 'wb') as f:
            f.write(resp.read())
        return True
    except Exception as e:
        print(f"Failed to download {url}: {e}")
        return False

scraped_data = {}

for item in urls:
    slug = item["slug"]
    print(f"\n--- Scraping {slug} ({item['url']}) ---")
    req = urllib.request.Request(item['url'], headers=headers)
    try:
        with urllib.request.urlopen(req, timeout=20) as resp:
            html = resp.read().decode('utf-8', errors='ignore')
    except Exception as e:
        print(f"Error fetching {item['url']}: {e}")
        html = ""

    soup = BeautifulSoup(html, 'html.parser')
    
    # Extract raw images from all potential attributes: src, data-src, data-lazy-src, srcset, data-orig-file
    raw_images = []
    for img in soup.find_all('img'):
        src = img.get('data-lazy-src') or img.get('data-src') or img.get('data-orig-file') or img.get('src') or ''
        srcset = img.get('srcset') or img.get('data-srcset') or ''
        
        candidates = [src]
        if srcset:
            parts = [p.strip().split(' ')[0] for p in srcset.split(',') if p.strip()]
            candidates.extend(parts)
            
        for cand in candidates:
            if cand and not cand.startswith('data:') and not any(x in cand.lower() for x in ['logo', 'icon', 'cropped-image-40', 'avatar', 'placeholder']):
                if cand.startswith('//'):
                    cand = 'https:' + cand
                elif cand.startswith('/'):
                    cand = urllib.parse.urljoin(item['url'], cand)
                if cand.startswith('http') and cand not in raw_images:
                    raw_images.append(cand)

    # Extract PDFs
    pdfs = []
    for a in soup.find_all('a', href=True):
        href = a['href']
        if href.lower().endswith('.pdf') or '.pdf?' in href.lower():
            if href.startswith('//'):
                href = 'https:' + href
            elif href.startswith('/'):
                href = urllib.parse.urljoin(item['url'], href)
            pdf_title = a.get_text(strip=True) or os.path.basename(href).split('?')[0]
            
            # Download PDF locally
            clean_filename = f"{slug}_{os.path.basename(href).split('?')[0]}"
            clean_filename = re.sub(r'[^a-zA-Z0-9_\-\.]', '_', clean_filename)
            local_pdf_path = os.path.join('public/documents/student-support', clean_filename)
            rel_pdf_path = f"/documents/student-support/{clean_filename}"
            
            if not os.path.exists(local_pdf_path):
                print(f"Downloading PDF: {href} -> {local_pdf_path}")
                if download_file(href, local_pdf_path):
                    pdfs.append({"title": pdf_title, "originalUrl": href, "localPath": rel_pdf_path})
                else:
                    pdfs.append({"title": pdf_title, "originalUrl": href, "localPath": href})
            else:
                pdfs.append({"title": pdf_title, "originalUrl": href, "localPath": rel_pdf_path})

    # Download genuine images locally
    local_images = []
    for idx, img_url in enumerate(raw_images[:8]): # Top 8 genuine images per page
        ext = os.path.splitext(urllib.parse.urlparse(img_url).path)[1] or '.jpg'
        if ext.lower() not in ['.jpg', '.jpeg', '.png', '.webp']:
            ext = '.jpg'
        img_name = f"{slug}_img_{idx+1}{ext}"
        local_img_path = os.path.join('public/assets/student-support', img_name)
        rel_img_path = f"/assets/student-support/{img_name}"
        
        if not os.path.exists(local_img_path):
            print(f"Downloading Image: {img_url} -> {local_img_path}")
            if download_file(img_url, local_img_path):
                local_images.append({"originalUrl": img_url, "localPath": rel_img_path})
            else:
                local_images.append({"originalUrl": img_url, "localPath": img_url})
        else:
            local_images.append({"originalUrl": img_url, "localPath": rel_img_path})

    # Clean body for content extraction
    for tag in soup(['header', 'footer', 'nav', 'script', 'style', 'noscript', 'aside']):
        tag.decompose()
        
    main_content = soup.find('div', class_=re.compile(r'entry-content|elementor|content|main')) or soup.find('main') or soup.find('body')
    
    sections = []
    tables_data = []
    
    if main_content:
        # Tables
        for tbl in main_content.find_all('table'):
            tbl_rows = []
            for tr in tbl.find_all('tr'):
                cells = [td.get_text(separator=' ', strip=True) for td in tr.find_all(['td', 'th'])]
                if cells:
                    tbl_rows.append(cells)
            if tbl_rows:
                tables_data.append(tbl_rows)
                
        # Structured sections
        current_heading = "Overview"
        current_content = []
        for elem in main_content.find_all(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'ul', 'ol', 'blockquote']):
            if elem.name.startswith('h'):
                if current_content:
                    sections.append({"heading": current_heading, "content": current_content})
                    current_content = []
                current_heading = elem.get_text(strip=True)
            elif elem.name == 'p':
                txt = elem.get_text(strip=True)
                if txt and len(txt) > 3 and not txt.startswith("Home") and not txt.startswith("Copyright"):
                    current_content.append({"type": "paragraph", "text": txt})
            elif elem.name in ['ul', 'ol']:
                items = [li.get_text(strip=True) for li in elem.find_all('li') if li.get_text(strip=True)]
                if items:
                    current_content.append({"type": "list", "items": items})
            elif elem.name == 'blockquote':
                txt = elem.get_text(strip=True)
                if txt:
                    current_content.append({"type": "quote", "text": txt})
        if current_content:
            sections.append({"heading": current_heading, "content": current_content})

    scraped_data[slug] = {
        "slug": slug,
        "name": item["name"],
        "category": item["category"],
        "url": item["url"],
        "title": soup.title.string.strip() if soup.title else item["name"],
        "sections": sections,
        "tables": tables_data,
        "images": local_images,
        "pdfs": pdfs
    }

with open('src/data/studentSupportData.json', 'w', encoding='utf-8') as f:
    json.dump(scraped_data, f, indent=2, ensure_ascii=False)

print("\n[ALL DONE] Full rich data and assets downloaded and stored in src/data/studentSupportData.json!")
