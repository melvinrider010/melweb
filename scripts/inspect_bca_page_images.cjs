const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

const bca = pages.find(p => p.slug === 'bca');
const html = bca ? bca.content?.rendered || '' : '';

const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["'][^>]*>/gi)].map(m => m[0]);
console.log(`Found ${imgs.length} image tags on official BCA page:`);
imgs.forEach((img, idx) => console.log(`[${idx + 1}] ${img}\n`));
