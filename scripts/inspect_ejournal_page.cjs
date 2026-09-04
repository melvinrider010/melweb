const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'media.json'), 'utf8'));

const eJournalPage = pages.find(p => p.slug === 'e-journal' || p.link?.includes('e-journal'));
console.log('=== E-JOURNAL PAGE IN RAW WP INVENTORY ===');
if (eJournalPage) {
  console.log(`Title: ${eJournalPage.title?.rendered}`);
  console.log(`Link: ${eJournalPage.link}`);
  console.log(`Content:\n${eJournalPage.content?.rendered}`);
} else {
  console.log('Page not found in pages.json, searching posts...');
  const eJournalPost = posts.find(p => p.slug?.includes('journal') || p.content?.rendered?.includes('dflip'));
  if (eJournalPost) {
    console.log(`Found post: ${eJournalPost.title?.rendered} (${eJournalPost.slug})`);
  }
}
