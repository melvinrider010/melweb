const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));

const richard = pages.find(p => p.slug === 'fr-richard-menezes');
const hencieta = pages.find(p => p.slug === 'ms-hencieta-fernandes');

console.log('=== FR RICHARD MENEZES WP PAGE ===');
console.log(richard ? richard.content.rendered : 'NOT FOUND');

console.log('\n=== MS HENCIETA FERNANDES WP PAGE ===');
console.log(hencieta ? hencieta.content.rendered : 'NOT FOUND');
