const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

const mcaPage = pages.find(p => p.slug === 'mca' || p.link?.includes('/mca/'));
const bcaPage = pages.find(p => p.slug === 'bca' || p.link?.includes('/bca/'));

console.log('=== MCA PAGE AUDIT ===');
if (mcaPage) {
  console.log('Title:', mcaPage.title?.rendered);
  console.log('Link:', mcaPage.link);
  // Extract all img src
  const imgMatches = [...(mcaPage.content?.rendered || '').matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  console.log('Images in MCA page:', imgMatches);
}

console.log('\n=== BCA PAGE AUDIT ===');
if (bcaPage) {
  console.log('Title:', bcaPage.title?.rendered);
  console.log('Link:', bcaPage.link);
  const imgMatches = [...(bcaPage.content?.rendered || '').matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  console.log('Images in BCA page:', imgMatches);
}
