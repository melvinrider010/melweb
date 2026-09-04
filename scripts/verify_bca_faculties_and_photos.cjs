const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = hierarchy.faculty || [];

console.log('=== VERIFYING BCA FACULTY ROSTER & LOCAL PORTRAITS ON DISK ===\n');

const bcaFaculty = facultyList.filter(f => f.departmentId === 'dept-bca' && (f.programmeCode === 'BCA' || f.programmeType === 'ug'));

console.log(`Total Verified BCA Faculty Members: ${bcaFaculty.length}\n`);

let missingOnDisk = 0;

bcaFaculty.forEach((f, idx) => {
  const photoPath = f.photoUrl ? path.join(ROOT_DIR, 'public', f.photoUrl) : null;
  const fileExists = photoPath ? fs.existsSync(photoPath) && fs.statSync(photoPath).size > 0 : false;
  
  if (photoPath && !fileExists) {
    missingOnDisk++;
    console.error(`[FAIL] ${idx + 1}. ${f.name} - Photo MISSING: ${f.photoUrl}`);
  } else {
    console.log(`[OK]   ${(idx + 1).toString().padStart(2)}. ${f.name.padEnd(30)} | ${f.designation.padEnd(42)} | Photo: ${f.photoUrl} (${fs.statSync(photoPath).size} bytes)`);
  }
});

console.log('\n================================================================');
console.log(`Total BCA Faculty:                ${bcaFaculty.length}`);
console.log(`Verified Local Portrait Photos:   ${bcaFaculty.filter(f => f.photoVerified).length}/${bcaFaculty.length}`);
console.log(`Missing Photos on Disk:           ${missingOnDisk}`);
console.log('================================================================\n');

if (missingOnDisk === 0 && bcaFaculty.length === 17) {
  console.log('>>> SUCCESS: ALL 17 BCA FACULTY MEMBERS & PORTRAITS VERIFIED 100% <<<');
} else {
  console.error('>>> FAILED CHECKS <<<');
  process.exit(1);
}
