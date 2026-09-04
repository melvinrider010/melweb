const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));

const allItems = [...pages, ...posts];

for (const item of allItems) {
  const content = item.content?.rendered || '';
  const title = item.title?.rendered || '';
  if (/hencieta|richard\s*menezes/i.test(content) || /hencieta|richard\s*menezes/i.test(title)) {
    console.log(`\nFound page/post: [${item.id}] "${title}" (${item.slug}) - ${item.link}`);
    console.log(`Content:\n${content.substring(0, 1500)}`);
  }
}
