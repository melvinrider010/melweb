const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));

const facPage = pages.find(p => p.id === 42657 || p.slug === 'faculty-2' || p.slug === 'faculty');
console.log('=== OFFICIAL FACULTY PAGE [42657] ===');
if (facPage) {
  console.log(`Title: ${facPage.title?.rendered}`);
  console.log(`Link: ${facPage.link}`);
  console.log(`Content Length: ${facPage.content?.rendered?.length}`);
  console.log(`Snippet:\n${facPage.content?.rendered?.substring(0, 3000)}`);
} else {
  console.log('NOT FOUND');
}
