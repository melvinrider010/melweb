const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

const bcaProfilePageIds = [810, 815, 21487, 5238, 25869, 25865, 25854, 25861];

for (const id of bcaProfilePageIds) {
  const p = pages.find(page => page.id === id);
  if (!p) {
    console.log(`Page ID ${id} not found.`);
    continue;
  }
  console.log('==================================================');
  console.log(`Page ID: ${p.id} | Slug: ${p.slug} | Title: ${p.title?.rendered}`);
  console.log(`URL: ${p.link}`);
  console.log(`Featured Media ID: ${p.featured_media}`);
  console.log(`Content HTML:`);
  console.log(p.content?.rendered);
}
