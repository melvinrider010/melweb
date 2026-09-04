const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

const sampleIds = [27445, 26537, 26540, 26519, 26396, 26385, 26382, 34436, 34352, 39012, 43315];

for (const id of sampleIds) {
  const p = pages.find(page => page.id === id);
  if (!p) continue;

  console.log('==================================================');
  console.log(`Page [${p.id}] "${p.title?.rendered}" (slug: ${p.slug})`);
  console.log(`Link: ${p.link}`);
  console.log(`Featured Media ID: ${p.featured_media}`);

  const html = p.content?.rendered || '';
  console.log('Content snippet (first 400 chars):');
  console.log(html.substring(0, 400));

  // Extract images
  const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
  console.log('Images inside content:', imgs);

  // Extract department mentions
  const deptMatches = html.match(/department\s*(?:of|:)?\s*([A-Za-z\s&,]+?)(?=<|\n|\r|\.|,|\/|;)/i);
  if (deptMatches) {
    console.log('Detected Department:', deptMatches[0]);
  }
}
