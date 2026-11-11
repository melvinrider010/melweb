import json

with open('scripts/all_wp_pages.json', 'r', encoding='utf-8') as f:
    pages = json.load(f)

pages_by_slug = {p['slug']: p for p in pages}

print("=== NIRF PAGES ON WORDPRESS ===")
for p in pages:
    if 'nirf' in p['slug'].lower():
        print(f"\n[{p['slug']}] {p.get('title', {}).get('rendered')}")
        content = p.get('content', {}).get('rendered', '')
        print("Content snippet:", content[:300].replace('\n', ' '))

print("\n=== CALENDAR PAGES ON WORDPRESS ===")
for p in pages:
    if 'calendar' in p['slug'].lower():
        print(f"\n[{p['slug']}] {p.get('title', {}).get('rendered')}")
        content = p.get('content', {}).get('rendered', '')
        print("Content snippet:", content[:300].replace('\n', ' '))

print("\n=== COMPLIANCE & MANDATORY DISCLOSURE PAGES ON WORDPRESS ===")
for p in pages:
    if any(k in p['slug'].lower() for k in ['mandatory', 'compliance']):
        print(f"\n[{p['slug']}] {p.get('title', {}).get('rendered')}")
        content = p.get('content', {}).get('rendered', '')
        print("Content snippet:", content[:300].replace('\n', ' '))
