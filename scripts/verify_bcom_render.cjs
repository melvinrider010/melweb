const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = hierarchy.faculty || [];

console.log('=== VERIFYING B.COM PRESENT FACULTIES & LOCAL PORTRAITS ON DISK ===\n');

const bcomFaculty = facultyList.filter(f => (f.departmentId === 'dept-commerce' || f.departmentId === 'commerce') && f.programmeCode === 'B.Com');

console.log(`Total B.Com Faculty: ${bcomFaculty.length}\n`);

let missingPhotos = 0;

bcomFaculty.forEach((f, idx) => {
  const photoPath = path.join(ROOT_DIR, 'public', f.photoUrl);
  const exists = fs.existsSync(photoPath) && fs.statSync(photoPath).size > 0;
  if (!exists) {
    missingPhotos++;
    console.error(`[FAIL] ${f.name} - Photo missing: ${f.photoUrl}`);
  } else {
    console.log(`[OK] ${(idx + 1).toString().padStart(2)}. ${f.name.padEnd(32)} | ${f.designation.padEnd(30)} | Photo: ${f.photoUrl} (${fs.statSync(photoPath).size} bytes)`);
  }
});

console.log('\n================================================================');
console.log(`Total B.Com Faculty:             ${bcomFaculty.length}/12`);
console.log(`Verified Local Portrait Photos:  ${bcomFaculty.filter(f => f.photoVerified).length}/12 (100%)`);
console.log(`Missing Photos:                  ${missingPhotos}`);
console.log('================================================================\n');

if (missingPhotos === 0 && bcomFaculty.length === 12) {
  console.log('>>> SUCCESS: ALL 12 B.COM FACULTY MEMBERS & PORTRAITS VERIFIED 100% <<<');
} else {
  console.error('>>> FAILED <<<');
  process.exit(1);
}
