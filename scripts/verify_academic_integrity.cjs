const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const depts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'departments.json'), 'utf8'));
const progs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'programs.json'), 'utf8'));
const faculty = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));

console.log('=== ACADEMIC RELATIONAL SYSTEM INTEGRITY VERIFICATION REPORT ===\n');

// 1. Check Faculties
console.log(`[1] Faculties (Schools): ${hierarchy.faculties.length}`);
hierarchy.faculties.forEach(f => {
  console.log(`  - ${f.name} (${f.id}) => ${f.departmentIds.length} departments`);
});

// 2. Check Departments
console.log(`\n[2] Canonical Departments: ${depts.length}`);
const deptIds = new Set(depts.map(d => d.id));
let invalidDeptRefs = 0;

depts.forEach(d => {
  if (!d.facultyId) {
    console.error(`  ERROR: Department ${d.id} missing facultyId`);
    invalidDeptRefs++;
  }
});

// 3. Check Programmes
console.log(`\n[3] Programmes: ${progs.length} (UG: ${progs.filter(p => p.type === 'ug').length}, PG: ${progs.filter(p => p.type === 'pg').length})`);
let invalidProgDepts = 0;
let invalidPathways = 0;

progs.forEach(p => {
  if (!deptIds.has(p.departmentId)) {
    console.error(`  ERROR: Programme ${p.id} references invalid departmentId: ${p.departmentId}`);
    invalidProgDepts++;
  }
  if (p.progressionPathway && p.progressionPathway.length > 0) {
    p.progressionPathway.forEach(pathway => {
      const targetProg = progs.find(t => t.id === pathway.targetId);
      if (!targetProg) {
        console.error(`  ERROR: Programme ${p.id} has pathway referencing non-existent targetId: ${pathway.targetId}`);
        invalidPathways++;
      }
    });
  }
});

// 4. Check Faculty Members
console.log(`\n[4] Faculty Members: ${faculty.length}`);
let fakePhotos = 0;
let invalidFacultyDepts = 0;
let verifiedPhotosCount = 0;
let nullPhotoCount = 0;

faculty.forEach(f => {
  if (!deptIds.has(f.departmentId)) {
    console.error(`  ERROR: Faculty ${f.name} (${f.id}) references invalid departmentId: ${f.departmentId}`);
    invalidFacultyDepts++;
  }

  if (f.photoVerified) {
    if (!f.photoUrl || !fs.existsSync(path.join(ROOT_DIR, 'public', f.photoUrl.substring(1)))) {
      console.error(`  ERROR: Faculty ${f.name} marked photoVerified=true but file does not exist locally at ${f.photoUrl}`);
      fakePhotos++;
    } else {
      verifiedPhotosCount++;
    }
  } else {
    if (f.photoUrl !== null) {
      console.error(`  ERROR: Faculty ${f.name} photoVerified=false but photoUrl is not null: ${f.photoUrl}`);
      fakePhotos++;
    } else {
      nullPhotoCount++;
    }
  }
});

console.log(`  - Verified Authentic Portrait Photos (Local Files): ${verifiedPhotosCount}`);
console.log(`  - Null Photos (Initials Avatar Fallback): ${nullPhotoCount}`);
console.log(`  - Fake / Mismatched / Missing Photos: ${fakePhotos}`);

console.log('\n=== INTEGRITY SUMMARY ===');
console.log(`- Invalid Department References: ${invalidDeptRefs}`);
console.log(`- Invalid Programme Departments: ${invalidProgDepts}`);
console.log(`- Invalid Pathways: ${invalidPathways}`);
console.log(`- Invalid Faculty Departments: ${invalidFacultyDepts}`);
console.log(`- Fake / Broken Photo Files: ${fakePhotos}`);

if (invalidDeptRefs === 0 && invalidProgDepts === 0 && invalidPathways === 0 && invalidFacultyDepts === 0 && fakePhotos === 0) {
  console.log('\n>>> SUCCESS: ALL INTEGRITY AND AUTHENTICITY CHECKS PASSED (100%) <<<');
} else {
  console.error('\n>>> FAILED: INTEGRITY ISSUES FOUND <<<');
  process.exit(1);
}
