const fs = require('fs');
const html = fs.readFileSync('scripts/scraped_academics/iic.html', 'utf8');

// Find member elements from WP Team Members plugin
const members = [];
const memberRegex = /<div class="tmm_member[^"]*">([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>/gis;
let match;
while ((match = memberRegex.exec(html)) !== null) {
  const block = match[1];
  const nameMatch = block.match(/<div class="tmm_fname">([^<]+)<\/div>/i);
  const lNameMatch = block.match(/<div class="tmm_lname">([^<]+)<\/div>/i);
  const titleMatch = block.match(/<div class="tmm_job">([^<]+)<\/div>/i);
  const descMatch = block.match(/<div class="tmm_desc">([\s\S]*?)<\/div>/i);
  const photoMatch = block.match(/<div class="tmm_photo"[^>]*style="[^"]*background:url\(([^)]+)\)/i);

  const fullName = ((nameMatch ? nameMatch[1] : '') + ' ' + (lNameMatch ? lNameMatch[1] : '')).trim();
  const title = titleMatch ? titleMatch[1].trim() : '';
  const desc = descMatch ? descMatch[1].replace(/<[^>]+>/g, '').trim() : '';
  const photo = photoMatch ? photoMatch[1].replace(/['"]/g, '') : '';

  if (fullName || title) {
    members.push({ fullName, title, desc, photo });
  }
}

// Find gallery images
const galleryMatches = html.match(/https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png)/gi) || [];
const iicGallery = [...new Set(galleryMatches.filter(u => u.includes('2024') || u.includes('2025') || u.includes('WhatsApp-Image') || u.includes('IMG_')))];

const data = {
  members,
  iicGallery
};

fs.writeFileSync('src/data/iic_team_gallery.json', JSON.stringify(data, null, 2));
console.log(`Extracted ${members.length} members and ${iicGallery.length} gallery images.`);
