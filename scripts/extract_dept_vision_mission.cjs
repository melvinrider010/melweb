const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const INVENTORY_DIR = path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));

console.log('=== SEARCHING ALL WP PAGES FOR DEPARTMENT-SPECIFIC VISION & MISSION ===');

function cleanHtml(html) {
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

const deptVisionMission = [];

for (const page of pages) {
  const content = page.content?.rendered || '';
  const title = (page.title?.rendered || '').trim();
  const slug = page.slug;

  if (/vision/i.test(content) && /mission/i.test(content) && content.length > 300) {
    // Check if this page is a department or course page
    const text = cleanHtml(content);
    
    // Extract vision and mission snippets
    const vMatch = text.match(/vision[:\s–—]+([\s\S]{30,400}?)(?=mission|objective|goal|outcome|$)/i);
    const mMatch = text.match(/mission[:\s–—]+([\s\S]{30,500}?)(?=vision|objective|goal|outcome|faculty|$)/i);

    if (vMatch || mMatch) {
      console.log(`\n--------------------------------------------------`);
      console.log(`Page [${page.id}] "${title}" (slug: ${slug}) - Link: ${page.link}`);
      if (vMatch) console.log(`  VISION: ${vMatch[1].trim()}`);
      if (mMatch) console.log(`  MISSION: ${mMatch[1].trim()}`);
      
      deptVisionMission.push({
        id: page.id,
        title: title,
        slug: slug,
        link: page.link,
        vision: vMatch ? vMatch[1].trim() : null,
        mission: mMatch ? mMatch[1].trim() : null
      });
    }
  }
}

console.log(`\nFound ${deptVisionMission.length} pages with distinct Vision & Mission statements.`);
fs.writeFileSync(path.join(__dirname, 'department_vision_mission_inventory.json'), JSON.stringify(deptVisionMission, null, 2));
