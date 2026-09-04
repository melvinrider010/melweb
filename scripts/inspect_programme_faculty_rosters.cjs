const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

const programmeSlugs = [
  'bba',
  'mba',
  'b-com-2',
  'm-com',
  'bsw',
  'master-of-social-work',
  'm-sc-physics',
  'm-sc-chemistry',
  'm-sc-mathematics',
  'm-sc-computer-science',
  'm-a-in-economics',
  'm-a-english',
  'm-a-mass-communication-journalism'
];

console.log('=== INSPECTING RAW OFFICIAL PROGRAMME FACULTY ROSTERS ===\n');

for (const slug of programmeSlugs) {
  const p = pages.find(page => page.slug === slug || page.link.includes(`/${slug}/`));
  if (!p) {
    console.log(`[NOT FOUND] Slug: ${slug}`);
    continue;
  }
  console.log(`==================== [${slug.toUpperCase()}] (${p.title?.rendered}) ====================`);
  console.log(`URL: ${p.link}`);
  const html = p.content?.rendered || '';
  
  // Find tables and faculty mentions
  const tables = [...html.matchAll(/<table[^>]*>([\s\S]*?)<\/table>/gi)];
  console.log(`Found ${tables.length} tables in content.`);
  tables.forEach((t, idx) => {
    const rows = [...t[1].matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    console.log(`  Table ${idx + 1} (${rows.length} rows):`);
    rows.slice(0, 10).forEach(r => {
      const text = r[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').replace(/\s+/g, ' ').trim();
      if (text.length > 0) console.log(`    - ${text}`);
    });
  });
  console.log('');
}
