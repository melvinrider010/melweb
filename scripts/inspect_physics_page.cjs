const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));

const physicsPage = pages.find(p => p.slug === 'physics');
console.log('=== PHYSICS PAGE CONTENT ===');
console.log(physicsPage ? physicsPage.content.rendered : 'NOT FOUND');
