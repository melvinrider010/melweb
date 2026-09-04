const fs = require('fs');
const path = require('path');

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'stphilos_raw/pages/iqac.json'), 'utf8'));
const html = raw.content.rendered;

// Find all <a> tags with their text and href
const linkMatches = [...html.matchAll(/<a[^>]+href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)];
console.log(`Total <a> links found: ${linkMatches.length}`);

linkMatches.forEach((m, idx) => {
  const href = m[1];
  const text = m[2].replace(/<[^>]+>/g, '').trim();
  if (text.length > 0) {
    console.log(`${idx + 1}. [${text}] => ${href}`);
  }
});
