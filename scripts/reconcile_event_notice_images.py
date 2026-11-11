import json
import os

with open('src/data/notices.json', 'r', encoding='utf-8') as f:
    notices = json.load(f)

with open('src/data/events.json', 'r', encoding='utf-8') as f:
    events = json.load(f)

cleared_notices = []
for n in notices:
    img = n.get('document_image')
    if img:
        p = os.path.join('public', img.lstrip('/'))
        if not os.path.exists(p):
            cleared_notices.append((n.get('id'), n.get('title'), img))
            n['document_image'] = None

cleared_events = []
for e in events:
    img = e.get('document_image')
    if img:
        p = os.path.join('public', img.lstrip('/'))
        if not os.path.exists(p):
            cleared_events.append((e.get('id'), e.get('title'), img))
            e['document_image'] = None

print(f"Cleared {len(cleared_notices)} missing notice images:")
for nid, ntitle, nimg in cleared_notices:
    print(f"  [{nid}] {ntitle} -> {nimg}")

print(f"Cleared {len(cleared_events)} missing event images:")
for eid, etitle, eimg in cleared_events:
    print(f"  [{eid}] {etitle} -> {eimg}")

with open('src/data/notices.json', 'w', encoding='utf-8') as f:
    json.dump(notices, f, indent=2)

with open('src/data/events.json', 'w', encoding='utf-8') as f:
    json.dump(events, f, indent=2)

print("Saved reconciled notices.json and events.json successfully.")
