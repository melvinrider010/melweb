const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

const physicsPage = pages.find(p => p.slug === 'physics' || p.link === 'https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/');

console.log('=== INSPECTING OFFICIAL PHYSICS DEPARTMENT PAGE ===\n');
if (physicsPage) {
  console.log(`Title: ${physicsPage.title?.rendered}`);
  console.log(`Link:  ${physicsPage.link}`);
  console.log(`Content:\n`);
  console.log(physicsPage.content?.rendered);
} else {
  console.log('Physics page not found by slug/link.');
}
