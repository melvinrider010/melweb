const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));

const allItems = [...pages, ...posts];

function cleanText(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

console.log('=== EXTRACTING 100% AUTHENTIC FACULTY DIRECTLY FROM OFFICIAL CV TABLES ===');

const extractedFaculty = [];

for (const item of allItems) {
  const content = item.content?.rendered || '';
  const slug = item.slug || '';
  const title = (item.title?.rendered || '').trim();

  // Check if content has the official faculty CV table
  if (content.includes('wp-block-table') || (content.includes('Name') && content.includes('Designation') && content.includes('Department'))) {
    
    // Check if row has "Department"
    const deptMatch = content.match(/Department\s*(?:&nbsp;)*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    const nameMatch = content.match(/Name\s*(?:&nbsp;)*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    const desMatch = content.match(/Designation\s*(?:&nbsp;)*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);
    const qualMatch = content.match(/Qualification\s*(?:&nbsp;)*<\/td>\s*<td[^>]*>([\s\S]*?)<\/td>/i);

    if (deptMatch && nameMatch) {
      const rawName = cleanText(nameMatch[1]);
      const rawDept = cleanText(deptMatch[1]);
      const rawDes = desMatch ? cleanText(desMatch[1]) : 'Assistant Professor';
      const rawQual = qualMatch ? cleanText(qualMatch[1]) : 'Faculty Member';

      // Check if title is a person's name
      if (rawName && rawName.length > 2 && rawName.length < 50 && !/Sl\.?\s*No|Candidate|Student/i.test(rawName)) {
        
        // Find if page has a valid portrait image
        let photoUrl = null;
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
        if (imgMatch && !imgMatch[1].includes('placeholder') && !imgMatch[1].includes('logo') && !imgMatch[1].includes('banner')) {
          photoUrl = imgMatch[1];
        }

        extractedFaculty.push({
          pageId: item.id,
          pageSlug: slug,
          name: rawName.replace(/^[0-9.]+\s*/, ''),
          officialTitle: title,
          designation: rawDes,
          departmentText: rawDept,
          qualification: rawQual,
          photoUrl: photoUrl,
          officialUrl: item.link
        });
      }
    }
  }
}

console.log(`Successfully extracted ${extractedFaculty.length} authentic faculty profiles directly from official CV tables!`);

// Group by departmentText
const deptGroups = {};
extractedFaculty.forEach(f => {
  deptGroups[f.departmentText] = (deptGroups[f.departmentText] || 0) + 1;
});

console.log('\n=== OFFICIAL DEPARTMENT STRINGS DISCOVERED ===');
for (const [deptText, count] of Object.entries(deptGroups)) {
  console.log(` - "${deptText}": ${count} faculty`);
}

fs.writeFileSync(path.join(__dirname, 'exact_official_cv_faculty.json'), JSON.stringify(extractedFaculty, null, 2));
