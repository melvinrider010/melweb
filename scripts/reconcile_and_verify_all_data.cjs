const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));
const programs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'programs.json'), 'utf8'));
const departments = hierarchy.departments || [];

console.log('================================================================');
console.log('       CANONICAL RECONCILIATION & EXACT SOURCE AUDIT REPORT     ');
console.log('================================================================\n');

// 1. DEPARTMENT AUDIT
console.log('=== 1. ALL CANONICAL DEPARTMENTS IN DATASET ===');
const deptSummary = departments.map((d, index) => {
  const dId = d.deptId || d.id;
  const matchingFaculty = facultyList.filter(f => f.departmentId === dId);
  return {
    index: index + 1,
    id: dId,
    name: d.name,
    slug: d.slug,
    facultySchool: d.category || d.faculty,
    officialUrl: d.officialDepartmentUrl || `https://stphilos.ac.in/${d.slug}/`,
    facultyCount: matchingFaculty.length,
    facultyIds: matchingFaculty.map(f => f.id)
  };
});

deptSummary.forEach(d => {
  console.log(`[${d.index.toString().padStart(2)}] ${d.id.padEnd(28)} | ${d.name.padEnd(50)} | Faculty: ${String(d.facultyCount).padStart(2)} | URL: ${d.officialUrl}`);
});

console.log(`\nTotal Unique Departments in Array: ${deptSummary.length}`);
const uniqueDeptIds = new Set(departments.map(d => d.deptId || d.id));
console.log(`Total Unique Department IDs: ${uniqueDeptIds.size}`);

// 2. PROGRAMME AUDIT
console.log('\n=== 2. ALL CANONICAL PROGRAMMES IN DATASET ===');
const ugPrograms = programs.filter(p => p.type === 'ug');
const pgPrograms = programs.filter(p => p.type === 'pg');

console.log(`UG Programmes (${ugPrograms.length}):`);
ugPrograms.forEach((p, idx) => console.log(`  [UG ${idx + 1}] ${p.code.padEnd(8)} | ${p.title.padEnd(45)} | Dept: ${p.departmentId.padEnd(24)} | URL: ${p.officialUrl}`));

console.log(`\nPG Programmes (${pgPrograms.length}):`);
pgPrograms.forEach((p, idx) => console.log(`  [PG ${idx + 1}] ${p.code.padEnd(22)} | ${p.title.padEnd(40)} | Dept: ${p.departmentId.padEnd(24)} | URL: ${p.officialUrl}`));

// 3. FACULTY & PHOTO AUDIT
console.log('\n=== 3. FACULTY & PHOTO VERIFICATION AUDIT ===');
const uniqueFacultyIds = new Set(facultyList.map(f => f.id));
const verifiedPhotos = facultyList.filter(f => f.photoVerified && f.photoUrl);
const nullPhotos = facultyList.filter(f => !f.photoVerified || !f.photoUrl);

console.log(`Total Faculty Records in JSON:       ${facultyList.length}`);
console.log(`Total Unique Faculty IDs:            ${uniqueFacultyIds.size}`);
console.log(`Verified Local Portrait Photographs: ${verifiedPhotos.length}`);
console.log(`Safe Initials Avatar Fallbacks:      ${nullPhotos.length}`);

// Check verified photo disk presence
let brokenPhotos = 0;
verifiedPhotos.forEach(f => {
  const fullPath = path.join(ROOT_DIR, 'public', f.photoUrl);
  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).size === 0) {
    console.error(`  ERROR: Missing photo for ${f.name} at ${f.photoUrl}`);
    brokenPhotos++;
  }
});
console.log(`Broken Photo Paths on Disk:          ${brokenPhotos}`);

// 4. CROSS-DEPARTMENT LEAKAGE TEST
console.log('\n=== 4. CROSS-DEPARTMENT LEAKAGE AUDIT ===');
let crossLeakage = 0;
let invalidDeptRefs = 0;

facultyList.forEach(f => {
  if (!uniqueDeptIds.has(f.departmentId)) {
    console.error(`  ERROR: Faculty "${f.name}" has invalid departmentId: "${f.departmentId}"`);
    invalidDeptRefs++;
  }
});

const sumDeptFaculties = deptSummary.reduce((acc, d) => acc + d.facultyCount, 0);
console.log(`Sum of all department faculty counts: ${sumDeptFaculties}`);
console.log(`Total faculty in database:           ${facultyList.length}`);
console.log(`Discrepancy (Sum - Total):           ${sumDeptFaculties - facultyList.length}`);

// 5. RECONCILIATION TABLE
console.log('\n================================================================');
console.log('                     EXACT RECONCILIATION TABLE                 ');
console.log('================================================================');
console.log('| Entity                    | Reported | Actual | Difference | Status |');
console.log('|---------------------------|----------|--------|------------|--------|');
console.log(`| Departments               | 24       | ${String(deptSummary.length).padEnd(6)} | ${String(24 - deptSummary.length).padEnd(10)} | ${deptSummary.length === 24 ? 'MATCH' : 'DIFF'}  |`);
console.log(`| UG programmes             | 8        | ${String(ugPrograms.length).padEnd(6)} | ${String(8 - ugPrograms.length).padEnd(10)} | ${ugPrograms.length === 8 ? 'MATCH' : 'DIFF'}  |`);
console.log(`| PG programmes             | 12       | ${String(pgPrograms.length).padEnd(6)} | ${String(12 - pgPrograms.length).padEnd(10)} | ${pgPrograms.length === 12 ? 'MATCH' : 'DIFF'}  |`);
console.log(`| Faculty                   | 138      | ${String(facultyList.length).padEnd(6)} | ${String(138 - facultyList.length).padEnd(10)} | ${facultyList.length === 138 ? 'MATCH' : 'DIFF'}  |`);
console.log(`| Verified faculty photos   | 14       | ${String(verifiedPhotos.length).padEnd(6)} | ${String(14 - verifiedPhotos.length).padEnd(10)} | ${verifiedPhotos.length === 14 ? 'MATCH' : 'DIFF'}  |`);
console.log('================================================================\n');

// 6. SAVE TO FILE
const reportData = {
  departments: deptSummary,
  ugPrograms,
  pgPrograms,
  facultyMetrics: {
    totalFaculty: facultyList.length,
    uniqueFaculty: uniqueFacultyIds.size,
    verifiedPhotos: verifiedPhotos.length,
    nullPhotos: nullPhotos.length,
    brokenPhotos
  },
  reconciliation: {
    departments: { reported: 24, actual: deptSummary.length, difference: 24 - deptSummary.length },
    ugPrograms: { reported: 8, actual: ugPrograms.length, difference: 8 - ugPrograms.length },
    pgPrograms: { reported: 12, actual: pgPrograms.length, difference: 12 - pgPrograms.length },
    faculty: { reported: 138, actual: facultyList.length, difference: 138 - facultyList.length },
    verifiedPhotos: { reported: 14, actual: verifiedPhotos.length, difference: 14 - verifiedPhotos.length }
  }
};

fs.writeFileSync(path.join(ROOT_DIR, 'scripts/reconciliation_report.json'), JSON.stringify(reportData, null, 2));
console.log('Reconciliation report saved to scripts/reconciliation_report.json');
