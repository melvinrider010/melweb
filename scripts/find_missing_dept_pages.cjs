const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));

const targets = ['food', 'biochem', 'microbio', 'environmental', 'economic', 'commer', 'voc'];

for (const p of pages) {
  const slug = (p.slug || '').toLowerCase();
  const title = (p.title?.rendered || '').toLowerCase();
  const content = p.content?.rendered || '';

  for (const t of targets) {
    if ((slug.includes(t) || title.includes(t)) && content.includes('<table')) {
      console.log(`[Target: ${t}] [${p.id}] ${p.title?.rendered} (${slug}) - Table Length: ${content.length}`);
    }
  }
}
