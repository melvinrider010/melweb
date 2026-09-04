const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));

const slugsToInspect = [
  'library',
  'major-research',
  'patent-and-publications',
  'mou-and-collaborations',
  'research-development-cell',
  'college-magazine',
  'e-journal',
  'pg-e-contents',
  'facilities'
];

console.log('=== INSPECTING WP PAGES FOR ACADEMIC COMMONS & R&D ===');

slugsToInspect.forEach(slug => {
  const page = pages.find(p => p.slug === slug || p.link?.includes(slug));
  if (page) {
    console.log(`\n========================================`);
    console.log(`Page ID: [${page.id}] "${page.title?.rendered}" (${page.slug})`);
    console.log(`Link: ${page.link}`);
    console.log(`Content length: ${page.content?.rendered?.length}`);
    
    // Extract tables, headings, links
    const text = page.content?.rendered || '';
    const headings = (text.match(/<h[1-6][^>]*>[\s\S]*?<\/h[1-6]>/gi) || []).map(h => h.replace(/<[^>]+>/g, '').trim());
    const pdfs = text.match(/https?:\/\/[^"'\s<>]+\.pdf/gi) || [];
    const tables = text.match(/<table[\s\S]*?<\/table>/gi) || [];

    console.log(`Headings (${headings.length}):`, headings.slice(0, 8));
    console.log(`PDFs (${pdfs.length}):`, pdfs);
    console.log(`Tables (${tables.length})`);
    if (tables.length > 0) {
      const rows = (tables[0].match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || []).slice(0, 4);
      rows.forEach((r, idx) => console.log(`  Row ${idx+1}: ${r.replace(/<[^>]+>/g, ' | ').replace(/\s+/g, ' ')}`));
    }
  } else {
    console.log(`\nPage with slug "${slug}" not found in pages.json.`);
  }
});
