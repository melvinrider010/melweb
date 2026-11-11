import re
import os

with open('src/data/megaMenuData.js', 'r', encoding='utf-8') as f:
    text = f.read()

paths = set(re.findall(r'path:\s*["\']([^"\']+)["\']', text))
print(f'Total navigation links extracted: {len(paths)}')

with open('src/App.jsx', 'r', encoding='utf-8') as f:
    app_text = f.read()

route_paths = set(re.findall(r'<Route\s+path=["\']([^"\']+)["\']', app_text))
print(f'Total defined routes in App.jsx: {len(route_paths)}')

unmatched = []
for p in sorted(paths):
    clean = p.split('?')[0].strip('/')
    if not clean:
        continue
    matched = False
    for r in route_paths:
        r_clean = r.strip('/')
        if r_clean == clean:
            matched = True
            break
        if ':' in r_clean:
            r_regex = '^' + re.sub(r':[^/]+', '[^/]+', r_clean) + '$'
            if re.match(r_regex, clean):
                matched = True
                break
        if r_clean.endswith('/*'):
            prefix = r_clean[:-2]
            if clean.startswith(prefix):
                matched = True
                break
    if not matched:
        unmatched.append(p)

print(f'Unmatched navigation paths: {len(unmatched)}')
for u in unmatched:
    print(' -', u)
