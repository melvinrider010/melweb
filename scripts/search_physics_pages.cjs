const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

console.log('=== SEARCHING FOR PHYSICS DEPARTMENT & FACULTY PAGES ===\n');

const matches = pages.filter(p => {
  const html = p.content?.rendered || '';
  const title = p.title?.rendered || '';
  const slug = p.slug || '';
  return /gunaseelan|eliezer|vishwas|chandana|impana|sachin c n|manimozhi/i.test(html) ||
         /physics/i.test(title) ||
         /physics/i.test(slug);
});

console.log(`Found ${matches.length} matching physics pages:`);
matches.forEach(m => {
  console.log(`ID: ${m.id} | Slug: ${m.slug} | Title: ${m.title?.rendered} | Link: ${m.link}`);
  const html = m.content?.rendered || '';
  if (/present staff|m\.?sc faculties|gunaseelan/i.test(html)) {
    console.log(`  >>> CONTAINS PHYSICS FACULTY ROSTER! <<<`);
    console.log(html.slice(0, 1500));
  }
});
