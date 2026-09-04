const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

console.log('=== SEARCHING ALL 1,042 PAGES FOR FACULTY TABLES & CVs ===');

const facultyPages = [];

for (const p of pages) {
  const content = p.content?.rendered || '';
  const title = p.title?.rendered || '';
  const link = p.link || '';
  const slug = p.slug || '';

  // Check if page has CV / Faculty indicators
  if (/assistant professor|associate professor|head of the department|lecturer|faculty profile|curriculum vitae/i.test(content) ||
      /faculty|department|staff/i.test(slug)) {
    
    // Check if it's an individual faculty CV page (e.g. "Dr. XYZ" or "Mrs. ABC")
    const isPerson = /^(Dr|Prof|Mr|Mrs|Ms|Rev|Fr|Sr)\.?\s+/i.test(title.trim());
    
    facultyPages.push({
      id: p.id,
      slug: slug,
      title: title.trim(),
      link: link,
      isPerson: isPerson,
      hasTable: /<table/i.test(content),
      contentLen: content.length
    });
  }
}

console.log(`Found ${facultyPages.length} relevant pages.`);
console.log(`Individual Person Pages: ${facultyPages.filter(p => p.isPerson).length}`);
console.log(`Department / Table Pages: ${facultyPages.filter(p => !p.isPerson && p.hasTable).length}`);

// Sample individual person pages
console.log('\nSample Individual Person Pages (first 15):');
console.log(facultyPages.filter(p => p.isPerson).slice(0, 15).map(p => `[${p.id}] "${p.title}" (slug: ${p.slug}) - Link: ${p.link}`));

// Sample Department Pages
console.log('\nSample Department / Table Pages (first 15):');
console.log(facultyPages.filter(p => !p.isPerson).slice(0, 15).map(p => `[${p.id}] "${p.title}" (slug: ${p.slug}) - Link: ${p.link}`));
