const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));

console.log('=== SEARCHING ALL WP PAGES AND POSTS FOR FACULTY / STAFF TABLES ===');

const allItems = [...pages, ...posts];

for (const item of allItems) {
  const content = item.content?.rendered || '';
  const title = (item.title?.rendered || '').trim();
  const slug = item.slug;

  // Check if page contains faculty tables or staff list
  if ((content.includes('<table') || content.includes('wp-block-table')) && /faculty|staff|professor|lecturer|qualification|designation|hod/i.test(content)) {
    console.log(`\nPage ID: [${item.id}] "${title}" (slug: ${slug}) - Link: ${item.link}`);
    
    // Extract table rows
    const rowMatches = content.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi) || [];
    console.log(`  Found ${rowMatches.length} rows in table.`);
    rowMatches.slice(0, 4).forEach((row, rIdx) => {
      const cleanRow = row.replace(/<[^>]+>/g, ' | ').replace(/\s+/g, ' ').trim();
      console.log(`    Row ${rIdx + 1}: ${cleanRow}`);
    });
  }
}
