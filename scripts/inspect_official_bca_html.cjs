const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

const bca = pages.find(p => p.slug === 'bca' || p.link?.includes('/bca/'));
console.log('=== OFFICIAL BCA PAGE FROM STPHILOS.AC.IN ===');
console.log('Title:', bca.title?.rendered);
console.log('Link:', bca.link);
console.log('\n--- Content HTML Snippet ---');
console.log(bca.content?.rendered);
