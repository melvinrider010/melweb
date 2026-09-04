const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'media.json'), 'utf8'));

const mediaById = new Map(media.map(m => [m.id, m]));

const allItems = [...pages, ...posts];

console.log('=== DISCOVERING GENUINE FACULTY PROFILES ===');

const genuineFaculty = [];

for (const item of allItems) {
  const content = item.content?.rendered || '';
  const title = (item.title?.rendered || '').trim();
  const slug = (item.slug || '').toLowerCase();

  // Genuine faculty pages have:
  // 1. "Designation" or "Assistant Professor" or "Associate Professor" or "Head of the Department" or "Professor" in content
  // 2. AND "Qualification" or "M.Sc" or "Ph.D" or "M.A" or "MCA" or "MBA" in content
  // 3. AND title is a person's name (starts with Dr / Mr / Mrs / Ms / Prof / Rev or is a single person's name < 40 chars)
  // 4. AND is NOT a post about a workshop, competition, tournament, celebration, guest lecture, or event report.

  const isEventOrReport = /competition|tournament|match|workshop|celebration|lecture|talk|programme\s*on|inauguration|report\s*on|visit|fest|conference|meeting|webinar|alumni|feedback|distribution|circular|notice|time\s*table|admission/i.test(title);

  if (!isEventOrReport && /Assistant Professor|Associate Professor|Head of the Department|HOD|Professor|Lecturer|Dean|Director/i.test(content) && /Qualification|Educational Qualification|Degrees|M\.?Sc|Ph\.?D|M\.?A|MCA|MBA|NET|KSET/i.test(content)) {
    
    // Check if title is a person name
    if (title.length > 3 && title.length < 45 && !/Department|College|Session|Faculty Development|Autonomous|University/i.test(title)) {
      
      // Extract photo
      let photoUrl = null;
      if (item.featured_media && mediaById.has(item.featured_media)) {
        photoUrl = mediaById.get(item.featured_media).source_url;
      }
      if (!photoUrl) {
        // Look for image in content
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
        if (imgMatch && !imgMatch[1].includes('logo') && !imgMatch[1].includes('banner')) {
          photoUrl = imgMatch[1];
        }
      }

      genuineFaculty.push({
        id: item.id,
        slug: slug,
        title: title,
        link: item.link,
        photoUrl: photoUrl,
        contentLength: content.length,
        contentSnippet: content.substring(0, 300)
      });
    }
  }
}

console.log(`Discovered ${genuineFaculty.length} genuine faculty profile pages.`);
genuineFaculty.slice(0, 30).forEach(f => {
  console.log(`[${f.id}] "${f.title}" (${f.slug}) - Photo: ${f.photoUrl || 'NONE'} - Link: ${f.link}`);
});

fs.writeFileSync(path.join(__dirname, 'genuine_faculty_pages.json'), JSON.stringify(genuineFaculty, null, 2));
