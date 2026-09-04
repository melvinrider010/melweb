import sqlite3
import os
import json
import glob
from datetime import datetime

# Read SQLite DB
db_path = 'backend/database/database.sqlite'
db_info = {}
if os.path.exists(db_path):
    conn = sqlite3.connect(db_path)
    cur = conn.cursor()
    cur.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [t[0] for t in cur.fetchall()]
    db_info['tables'] = {}
    for t in tables:
        try:
            cur.execute(f'SELECT count(*) FROM "{t}"')
            cnt = cur.fetchone()[0]
            cur.execute(f'PRAGMA table_info("{t}")')
            cols = [c[1] for c in cur.fetchall()]
            
            # Sample first 5 rows
            cur.execute(f'SELECT * FROM "{t}" LIMIT 5')
            rows = cur.fetchall()
            
            db_info['tables'][t] = {
                "count": cnt,
                "columns": cols,
                "sample": rows
            }
        except Exception as e:
            db_info['tables'][t] = {"error": str(e)}
    conn.close()

print(json.dumps({k: {"count": v.get("count"), "cols": v.get("columns")} for k, v in db_info.get("tables", {}).items()}, indent=2))
