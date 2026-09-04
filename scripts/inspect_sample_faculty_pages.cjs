const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));

const testPages = pages.filter(p => [27445, 26537, 26382, 34436, 43315].includes(p.id));

for (const p of testPages) {
  console.log(`\n=== [${p.id}] ${p.title.rendered} (${p.slug}) ===`);
  console.log(`Content: ${p.content.rendered}`);
}
