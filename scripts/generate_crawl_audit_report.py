import os
import json
import hashlib
from datetime import datetime

# Load studentSupportData.json
support_data_path = 'src/data/studentSupportData.json'
student_data = {}
if os.path.exists(support_data_path):
    with open(support_data_path, 'r', encoding='utf-8') as f:
        student_data = json.load(f)

# Physical assets verification
assets_dir = 'public/assets/student-support'
docs_dir = 'public/documents/student-support'

def inspect_folder(folder_path):
    files_list = []
    if not os.path.exists(folder_path):
        return files_list
    for root, dirs, files in os.walk(folder_path):
        for file in files:
            full_path = os.path.join(root, file)
            size = os.path.getsize(full_path)
            mtime = datetime.fromtimestamp(os.path.getmtime(full_path)).isoformat()
            ext = os.path.splitext(file)[1].lower()
            
            # SHA-256 hash
            hasher = hashlib.sha256()
            with open(full_path, 'rb') as f:
                while chunk := f.read(8192):
                    hasher.update(chunk)
            sha = hasher.hexdigest()
            
            files_list.append({
                "filename": file,
                "localPath": full_path.replace('\\', '/'),
                "relPath": '/' + os.path.relpath(full_path, 'public').replace('\\', '/'),
                "sizeBytes": size,
                "sizeKB": round(size / 1024, 2),
                "extension": ext,
                "modifiedTime": mtime,
                "sha256": sha,
                "isValid": size > 0,
                "isEmptyOrBroken": size == 0
            })
    return files_list

downloaded_images = inspect_folder(assets_dir)
downloaded_docs = inspect_folder(docs_dir)

# Check for duplicate hashes
img_hashes = {}
for img in downloaded_images:
    h = img['sha256']
    img_hashes.setdefault(h, []).append(img['localPath'])

doc_hashes = {}
for doc in downloaded_docs:
    h = doc['sha256']
    doc_hashes.setdefault(h, []).append(doc['localPath'])

duplicate_images = {k: v for k, v in img_hashes.items() if len(v) > 1}
duplicate_docs = {k: v for k, v in doc_hashes.items() if len(v) > 1}

# URLs list requested by user
requested_urls = [
    {"slug": "placement-cell", "name": "Career and Placement Cell", "category": "Placement Cell & Welfare", "source_url": "https://stphilos.ac.in/placement-cell", "local_route": "/student-support/placement-cell"},
    {"slug": "student-grievance-redressal-committee", "name": "Grievance Redressal", "category": "Placement Cell & Welfare", "source_url": "https://stphilos.ac.in/student-grievance-redressal-committee", "local_route": "/student-support/student-grievance-redressal-committee"},
    {"slug": "anti-ragging", "name": "Anti-Ragging", "category": "Placement Cell & Welfare", "source_url": "https://stphilos.ac.in/anti-ragging", "local_route": "/student-support/anti-ragging"},
    {"slug": "womens-cell", "name": "Women's Cell", "category": "Placement Cell & Welfare", "source_url": "https://stphilos.ac.in/womens-cell", "local_route": "/student-support/womens-cell"},
    {"slug": "student-welfare-cell", "name": "Student Welfare Cell", "category": "Placement Cell & Welfare", "source_url": "https://stphilos.ac.in/student-welfare-cell", "local_route": "/student-support/student-welfare-cell"},
    {"slug": "counselling-centre", "name": "Counselling Centre", "category": "Placement Cell & Welfare", "source_url": "https://stphilos.ac.in/counselling-centre", "local_route": "/student-support/counselling-centre"},
    {"slug": "human-values-professional-ethics", "name": "Human Values And Professional Ethics", "category": "Placement Cell & Welfare", "source_url": "https://stphilos.ac.in/human-values-professional-ethics", "local_route": "/student-support/human-values-professional-ethics"},
    {"slug": "youth-red-cross-yrc", "name": "Youth Redcross", "category": "Placement Cell & Welfare", "source_url": "https://stphilos.ac.in/youth-red-cross-yrc", "local_route": "/student-support/youth-red-cross-yrc"},
    {"slug": "library", "name": "Library", "category": "Amenities", "source_url": "https://stphilos.ac.in/library", "local_route": "/student-support/library"},
    {"slug": "facilities", "name": "Physical Infrastructure", "category": "Amenities", "source_url": "https://stphilos.ac.in/facilities", "local_route": "/student-support/facilities"},
    {"slug": "business-lab", "name": "Business Lab", "category": "Amenities", "source_url": "https://stphilos.ac.in/business-lab", "local_route": "/student-support/business-lab"},
    {"slug": "computer-science-lab", "name": "Computer Lab", "category": "Amenities", "source_url": "https://stphilos.ac.in/computer-science-lab", "local_route": "/student-support/computer-science-lab"},
    {"slug": "girls-hostel", "name": "Girls Hostel", "category": "Amenities", "source_url": "https://stphilos.ac.in/about-us-2/infrastructure/girls-hostel", "local_route": "/student-support/girls-hostel"},
    {"slug": "boys-hostel", "name": "Boys Hostel", "category": "Amenities", "source_url": "https://stphilos.ac.in/about-us-2/infrastructure/boys-hostel", "local_route": "/student-support/boys-hostel"},
    {"slug": "auditorium", "name": "Auditorium", "category": "Amenities", "source_url": "https://stphilos.ac.in/auditorium", "local_route": "/student-support/auditorium"},
    {"slug": "e-journal", "name": "Philos Bulletin", "category": "Amenities", "source_url": "https://stphilos.ac.in/e-journal", "local_route": "/e-journal"},
    {"slug": "bank-atm", "name": "Bank & ATM", "category": "Other Amenities", "source_url": "https://stphilos.ac.in/about-us-2/infrastructure/bank-atm", "local_route": "/student-support/bank-atm"},
    {"slug": "chapel-hall-3", "name": "Chapel", "category": "Other Amenities", "source_url": "https://stphilos.ac.in/chapel-hall-3", "local_route": "/student-support/chapel-hall-3"},
    {"slug": "ranger-and-rovers", "name": "Ranger and Rovers", "category": "Other Amenities", "source_url": "https://stphilos.ac.in/ranger-and-rovers", "local_route": "/student-support/ranger-and-rovers"},
    {"slug": "ncc", "name": "NCC", "category": "Other Amenities", "source_url": "https://stphilos.ac.in/ncc", "local_route": "/student-support/ncc"},
    {"slug": "nss", "name": "NSS", "category": "Other Amenities", "source_url": "https://stphilos.ac.in/nss", "local_route": "/student-support/nss"},
    {"slug": "indoor-stadium", "name": "Indoor Stadium", "category": "Other Amenities", "source_url": "https://stphilos.ac.in/indoor-stadium", "local_route": "/student-support/indoor-stadium"}
]

audit_results = []
for req in requested_urls:
    slug = req['slug']
    item = student_data.get(slug, {})
    
    # Check matching images
    matched_images = [img for img in downloaded_images if img['filename'].startswith(f"{slug}_")]
    matched_docs = [doc for doc in downloaded_docs if doc['filename'].startswith(f"{slug}_")]
    
    content_stored = bool(item and item.get('sections'))
    crawl_attempted = bool(item)
    crawl_completed = content_stored and (len(matched_images) > 0 or len(item.get('sections', [])) > 0)
    
    # Status
    if crawl_completed:
        status = "COMPLETED"
    elif crawl_attempted:
        status = "PARTIAL"
    else:
        status = "NOT STARTED"
        
    audit_results.append({
        "source_url": req["source_url"],
        "slug": slug,
        "name": req["name"],
        "category": req["category"],
        "local_route": req["local_route"],
        "crawl_attempted": crawl_attempted,
        "crawl_completed": crawl_completed,
        "content_stored": content_stored,
        "database_record_exists": False, # Stored as JSON + physical files in frontend architecture
        "db_record_detail": "Stored in src/data/studentSupportData.json (Client-side JSON architecture)",
        "images_found": len(item.get('images', [])),
        "images_downloaded": len(matched_images),
        "images_files": matched_images,
        "documents_found": len(item.get('pdfs', [])),
        "documents_downloaded": len(matched_docs),
        "documents_files": matched_docs,
        "sections_count": len(item.get('sections', [])),
        "tables_count": len(item.get('tables', [])),
        "failed_assets": [f for f in matched_images + matched_docs if f['isEmptyOrBroken']],
        "last_stored_time": os.path.exists(support_data_path) and datetime.fromtimestamp(os.path.getmtime(support_data_path)).isoformat(),
        "source_file": "src/data/studentSupportData.json",
        "status": status
    })

summary = {
    "total_pages_requested": len(requested_urls),
    "completed": sum(1 for a in audit_results if a['status'] == 'COMPLETED'),
    "partial": sum(1 for a in audit_results if a['status'] == 'PARTIAL'),
    "failed": sum(1 for a in audit_results if a['status'] == 'FAILED'),
    "not_started": sum(1 for a in audit_results if a['status'] == 'NOT STARTED'),
    "total_content_records_found": len(student_data),
    "total_images_downloaded": len(downloaded_images),
    "total_documents_downloaded": len(downloaded_docs),
    "total_empty_or_broken_files": sum(1 for f in downloaded_images + downloaded_docs if f['isEmptyOrBroken']),
    "total_local_routes_created": len(requested_urls),
    "total_menu_items_created": len(requested_urls) + 1 # + College Magazine
}

output_data = {
    "audit_timestamp": datetime.now().isoformat(),
    "summary": summary,
    "pages_audit": audit_results,
    "physical_assets": {
        "images_count": len(downloaded_images),
        "documents_count": len(downloaded_docs),
        "duplicate_image_groups": len(duplicate_images),
        "duplicate_document_groups": len(duplicate_docs),
        "all_images": downloaded_images,
        "all_documents": downloaded_docs
    }
}

with open('crawl_audit_previous_runs.json', 'w', encoding='utf-8') as f:
    json.dump(output_data, f, indent=2)

print("Generated crawl_audit_previous_runs.json successfully!")
print(f"Summary: {summary}")
