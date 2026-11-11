import urllib.request
import re

url = 'https://stphilos.ac.in/philo-mahothsav/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=15) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        uploads = set(re.findall(r'https?://[^\s"\'<>]+/wp-content/uploads/[^\s"\'<>]+', html))
        print(f"Total uploads on live philo-mahothsav: {len(uploads)}")
        for u in sorted(uploads):
            print(" ", u)
        
        # also print content area
        content_matches = re.findall(r'<article[^>]*>.*?</article>', html, re.DOTALL)
        if content_matches:
            print("\nArticle content snippet:")
            print(content_matches[0][:1500])
except Exception as e:
    print("Error:", e)
