import urllib.request
import json
import re

url = 'http://127.0.0.1:8000/api/v1/auth/login'

with open('backend/database/seeders/DatabaseSeeder.php', 'r', encoding='utf-8') as f:
    content = f.read()

m = re.search(r"'email'\s*=>\s*'admin@stphilos\.ac\.in'.*?'password_plain'\s*=>\s*'([^']+)'", content, re.DOTALL)
if m:
    pwd = m.group(1)
    req = urllib.request.Request(
        url, 
        data=json.dumps({'email': 'admin@stphilos.ac.in', 'password': pwd}).encode('utf-8'),
        headers={'Content-Type': 'application/json', 'Accept': 'application/json'}
    )
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode('utf-8'))
            print('Login status:', resp.status)
            print('User:', data.get('user', {}).get('name'))
            print('Role:', data.get('user', {}).get('role'))
            print('Token issued:', bool(data.get('token') or data.get('access_token')))
    except urllib.error.HTTPError as e:
        print('Login HTTP Error:', e.code, e.read().decode('utf-8'))
else:
    print('Seed credentials not found')
