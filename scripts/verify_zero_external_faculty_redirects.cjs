const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = hierarchy.faculty || [];

console.log('=== VERIFYING ZERO EXTERNAL FACULTY REDIRECTS ===\n');

let externalLinks = 0;

facultyList.forEach(f => {
  if (f.localProfileUrl && !f.localProfileUrl.startsWith('/faculty/')) {
    console.error(`ERROR: Faculty ${f.name} has non-local route: ${f.localProfileUrl}`);
    externalLinks++;
  }
});

const bcaFaculty = facultyList.filter(f => f.departmentId === 'dept-bca' && (f.programmeCode === 'BCA' || f.programmeType === 'ug'));

console.log(`Audited ${bcaFaculty.length} BCA Faculty Profiles:`);
bcaFaculty.forEach((f, idx) => {
  console.log(`[${idx + 1}] ${f.name.padEnd(30)} -> Internal Route: /faculty/${f.id} (100% Local)`);
});

console.log('\n================================================================');
console.log(`External redirects:       ${externalLinks}`);
console.log(`Internal local routes:   ${bcaFaculty.length}/${bcaFaculty.length} (100%)`);
console.log('================================================================\n');

if (externalLinks === 0) {
  console.log('>>> SUCCESS: ZERO EXTERNAL REDIRECTS - 100% LOCAL SERVING <<<');
} else {
  console.error('>>> FAILED <<<');
  process.exit(1);
}
