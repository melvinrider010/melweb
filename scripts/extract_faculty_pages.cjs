const fs = require('fs');
const path = require('path');

const pages = JSON.parse(fs.readFileSync(path.join(__dirname, 'historical_migration/raw_inventory/pages.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(__dirname, 'historical_migration/raw_inventory/media.json'), 'utf8'));

const mediaById = new Map(media.map(m => [m.id, m]));

// Let's find pages that have tables or grids of faculty or department descriptions
const extractedDeptData = [];

for (const p of pages) {
  const content = p.content?.rendered || '';
  const title = (p.title?.rendered || '').trim();
  const slug = p.slug;

  // Check if page contains faculty tables or lists
  if (/faculty|staff|teaching|prof|dr\.|mr\.|mrs\.|ms\.|assistant professor|associate professor|head of the department|hod/i.test(content) && content.length > 500) {
    
    // Extract images with surrounding names/titles
    const imgMatches = [];
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
    let m;
    while ((m = imgRegex.exec(content)) !== null) {
      imgMatches.push(m[1]);
    }

    extractedDeptData.push({
      pageId: p.id,
      title: title,
      slug: slug,
      link: p.link,
      imageCount: imgMatches.length,
      sampleImages: imgMatches.slice(0, 5)
    });
  }
}

console.log(`Found ${extractedDeptData.length} pages containing faculty / department staff information.`);
extractedDeptData.slice(0, 30).forEach(d => {
  console.log(`[${d.pageId}] ${d.title} (${d.slug}) - ${d.imageCount} imgs - ${d.link}`);
});

fs.writeFileSync(path.join(__dirname, 'extracted_faculty_pages.json'), JSON.stringify(extractedDeptData, null, 2));
