const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

const mgmtSlugs = [
  'ms-suhana-kulssum',
  'vishal-c-p',
  'mr-ranjith-c-v',
  'ms-priyanka-olivera',
  'dr-a-emille-surekha',
  'ms-radhika-h-j',
  'dr-sadia-tabassum',
  'dr-divyashree-n',
  'dr-issac-george',
  'ms-rini-brown'
];

for (const slug of mgmtSlugs) {
  const p = pages.find(page => page.slug === slug);
  if (!p) {
    console.log(`[NOT FOUND] ${slug}`);
    continue;
  }
  console.log(`==================== [${slug}] (${p.title?.rendered}) ====================`);
  const html = p.content?.rendered || '';
  const rows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
  rows.slice(0, 6).forEach(r => {
    const text = r[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`  ${text}`);
  });
  console.log('');
}
