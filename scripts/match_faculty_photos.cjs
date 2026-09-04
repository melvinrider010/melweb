const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const media = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'media.json'), 'utf8'));
const roster = JSON.parse(fs.readFileSync(path.join(__dirname, 'authentic_faculty_roster.json'), 'utf8'));

console.log(`Loaded ${media.length} total media items from stphilos.ac.in.`);

// Match faculty members with their official photos from media.json
let matchedCount = 0;

for (const fac of roster) {
  const nameParts = fac.name.toLowerCase()
    .replace(/^(?:dr|mr|mrs|ms|prof|rev)[-.\s]+/g, '')
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .filter(p => p.length > 2);

  if (nameParts.length === 0) continue;

  // Search media items where title, slug, or source_url matches name parts
  for (const m of media) {
    const mSlug = (m.slug || '').toLowerCase();
    const mUrl = (m.source_url || '').toLowerCase();
    const mTitle = (m.title?.rendered || '').toLowerCase();
    const mAlt = (m.alt_text || '').toLowerCase();

    const matchesAll = nameParts.every(part => mSlug.includes(part) || mUrl.includes(part) || mTitle.includes(part) || mAlt.includes(part));
    if (matchesAll) {
      fac.photoUrl = m.source_url;
      fac.photoVerified = true;
      matchedCount++;
      break;
    }
  }
}

console.log(`Matched ${matchedCount} / ${roster.length} faculty members with verified official photos from stphilos.ac.in media inventory!`);

fs.writeFileSync(path.join(__dirname, 'matched_authentic_faculty_roster.json'), JSON.stringify(roster, null, 2));

console.log('\nSample Matched Faculty:');
roster.filter(f => f.photoVerified).slice(0, 20).forEach(f => {
  console.log(` - ${f.name} (${f.designation}, ${f.departmentId}) => ${f.photoUrl}`);
});
