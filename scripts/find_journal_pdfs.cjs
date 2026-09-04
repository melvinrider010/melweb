const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const media = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'media.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));

console.log('=== SEARCHING FOR PHILOS BULLETIN & E-JOURNALS IN MEDIA & POSTS ===');

const foundMedia = [];
for (const m of media) {
  const url = (m.source_url || '').toLowerCase();
  const title = (m.title?.rendered || '').toLowerCase();
  const slug = (m.slug || '').toLowerCase();

  if (/bulletin|journal|magazine|newsletter|e-journal|philos/i.test(url) || /bulletin|journal|magazine|newsletter/i.test(title)) {
    if (url.endsWith('.pdf')) {
      foundMedia.push({
        id: m.id,
        title: m.title?.rendered,
        url: m.source_url,
        slug: m.slug
      });
    }
  }
}

console.log(`Found ${foundMedia.length} PDF publications matching bulletin/journal/magazine:`);
foundMedia.forEach(f => {
  console.log(` - [${f.id}] "${f.title}" => ${f.url}`);
});
