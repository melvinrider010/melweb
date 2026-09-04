const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

const bcaFacultyNames = [
  "Gloriya Priyadarshini",
  "Syeda Masarath",
  "Archana A",
  "Sandra Agnes",
  "Manasa E",
  "Lydia Anjalla",
  "Harshitha M",
  "Ajay Anthony",
  "Priyanka MK"
];

console.log('=== SEARCHING FOR OFFICIAL CV PAGES & PORTRAITS FOR 9 BCA FACULTY ===\n');

for (const name of bcaFacultyNames) {
  console.log(`==================== [${name}] ====================`);
  const matches = pages.filter(p => {
    const title = p.title?.rendered || '';
    const slug = p.slug || '';
    const content = p.content?.rendered || '';
    const firstWord = name.split(' ')[0].toLowerCase();
    const lastWord = name.split(' ')[1] ? name.split(' ')[1].toLowerCase() : '';
    return title.toLowerCase().includes(firstWord) || slug.toLowerCase().includes(firstWord);
  });

  console.log(`Found ${matches.length} matching pages in inventory:`);
  matches.forEach(m => {
    console.log(`  Page ID: ${m.id} | Slug: ${m.slug} | Title: ${m.title?.rendered} | URL: ${m.link}`);
    const html = m.content?.rendered || '';
    const imgs = [...html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(img => img[1]);
    console.log(`    Images found inside content (${imgs.length}):`, imgs);
  });
  console.log('');
}
