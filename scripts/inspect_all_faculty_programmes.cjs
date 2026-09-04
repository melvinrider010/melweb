const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));
const DATA_DIR = path.join(ROOT_DIR, 'src/data');
const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = hierarchy.faculty || [];

console.log('=== AUDITING PROGRAMME CODE IN FACULTY CV TABLES ===\n');

for (const fac of facultyList) {
  const normId = fac.id.replace('fac_', '');
  const p = pages.find(page => (page.slug || '').replace(/[^a-z0-9]/g, '').includes(normId) || (page.link === fac.officialProfileUrl));
  if (p) {
    const html = p.content?.rendered || '';
    const deptMatch = html.match(/department\s*&nbsp;*[:\s]*<\/td>[\s\S]*?<td[^>]*>([\s\S]*?)<\/td>/i);
    const deptStr = deptMatch ? deptMatch[1].replace(/<[^>]+>/g, ' ').replace(/&nbsp;/g, ' ').trim() : '';
    console.log(`[${fac.id}] ${fac.name.padEnd(28)} | Dept in CV: "${deptStr}" | Current Dept: ${fac.departmentId}`);
  }
}
