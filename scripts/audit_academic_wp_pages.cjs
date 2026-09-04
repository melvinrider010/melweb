const fs = require('fs');
const path = require('path');

const pages = JSON.parse(fs.readFileSync(path.join(__dirname, 'historical_migration/raw_inventory/pages.json'), 'utf8'));
console.log(`Total WP Pages: ${pages.length}`);

// Find department / programme / faculty pages
const deptPages = [];
const progPages = [];

for (const p of pages) {
  const slug = p.slug || '';
  const title = (p.title?.rendered || '').trim();
  const link = p.link || '';
  const content = p.content?.rendered || '';

  if (/department|dept|faculty|physics|chemistry|mathematics|computer-science|commerce|management|english|kannada|hindi|history|economics|sociology|social-work|journalism|biochemistry|biotechnology|microbiology|botany|zoology|food-science|psychology|criminology|bba|bca|bcom|bsc|ba|bsw|mba|mca|mcom|msc|ma|msw/i.test(`${slug} ${title}`)) {
    deptPages.push({ id: p.id, slug, title, link, contentLength: content.length, hasImages: /<img/i.test(content) });
  }
}

console.log(`Found ${deptPages.length} relevant academic pages in raw WP pages inventory.`);
deptPages.slice(0, 30).forEach(dp => console.log(` - [${dp.id}] ${dp.title} (${dp.slug}) - ${dp.link}`));

fs.writeFileSync(path.join(__dirname, 'academic_wp_pages_audit.json'), JSON.stringify(deptPages, null, 2));
