import sqlite3
import json

db_path = 'backend/database/database.sqlite'
conn = sqlite3.connect(db_path)
cur = conn.cursor()

slugs = [
    "placement-cell",
    "student-grievance-redressal-committee",
    "anti-ragging",
    "womens-cell",
    "student-welfare-cell",
    "counselling-centre",
    "human-values-professional-ethics",
    "youth-red-cross-yrc",
    "library",
    "facilities",
    "business-lab",
    "computer-science-lab",
    "girls-hostel",
    "boys-hostel",
    "auditorium",
    "e-journal",
    "bank-atm",
    "chapel-hall-3",
    "ranger-and-rovers",
    "ncc",
    "nss",
    "indoor-stadium"
]

results = {}

for slug in slugs:
    results[slug] = {}
    
    # Check documents
    cur.execute("SELECT id, title, filename, original_url, local_path FROM documents WHERE original_url LIKE ? OR local_path LIKE ? OR title LIKE ?", 
                (f'%{slug}%', f'%{slug}%', f'%{slug}%'))
    doc_rows = cur.fetchall()
    results[slug]['documents_table'] = [{"id": r[0], "title": r[1], "filename": r[2], "original_url": r[3], "local_path": r[4]} for r in doc_rows]
    
    # Check media
    cur.execute("SELECT id, filename, original_url, local_path FROM media WHERE original_url LIKE ? OR local_path LIKE ? OR filename LIKE ?", 
                (f'%{slug}%', f'%{slug}%', f'%{slug}%'))
    media_rows = cur.fetchall()
    results[slug]['media_table'] = [{"id": r[0], "filename": r[1], "original_url": r[2], "local_path": r[3]} for r in media_rows]

    # Check departments
    cur.execute("SELECT id, name FROM departments WHERE id LIKE ? OR name LIKE ?", (f'%{slug}%', f'%{slug}%'))
    dept_rows = cur.fetchall()
    results[slug]['departments_table'] = [{"id": r[0], "name": r[1]} for r in dept_rows]

    # Check events
    cur.execute("SELECT id, slug, title FROM events WHERE slug LIKE ? OR title LIKE ? OR content LIKE ?", (f'%{slug}%', f'%{slug}%', f'%{slug}%'))
    event_rows = cur.fetchall()
    results[slug]['events_table_count'] = len(event_rows)

    # Check notices
    cur.execute("SELECT id, slug, title FROM notices WHERE slug LIKE ? OR title LIKE ? OR content LIKE ?", (f'%{slug}%', f'%{slug}%', f'%{slug}%'))
    notice_rows = cur.fetchall()
    results[slug]['notices_table_count'] = len(notice_rows)

conn.close()

print(json.dumps(results, indent=2))
