const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));
const programs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'programs.json'), 'utf8'));
const departments = hierarchy.departments || [];

console.log('================================================================');
console.log('   FULL VERIFICATION: AUTHENTIC ACADEMIC CONTENT & ROSTERS      ');
console.log('================================================================\n');

let failedTests = 0;

// 1. VERIFY BCA PROGRAMME (CRITICAL USER REQUEST)
console.log('--- 1. BCA PROGRAMME AUDIT ---');
const bca = programs.find(p => p.id === 'bca' || p.code === 'BCA');
if (!bca) {
  console.error('FAILED: BCA programme record missing!');
  failedTests++;
} else {
  console.log(`Title:       ${bca.title}`);
  console.log(`Overview:    ${bca.overview.substring(0, 80)}...`);
  console.log(`History:     ${bca.history.substring(0, 80)}...`);
  console.log(`OfficialUrl: ${bca.officialUrl}`);
  
  // Faculty count
  const bcaFaculty = facultyList.filter(f => f.departmentId === 'dept-bca' && (f.programmeCode === 'BCA' || f.programmeType === 'ug'));
  console.log(`Verified BCA Faculty Count: ${bcaFaculty.length} (Expected: 9)`);
  bcaFaculty.forEach((f, idx) => console.log(`  [${idx + 1}] ${f.name} (${f.designation}) - Photo: ${f.photoUrl}`));
  
  if (bcaFaculty.length !== 9) {
    console.error(`FAILED: Expected 9 BCA faculty members, found ${bcaFaculty.length}`);
    failedTests++;
  } else {
    console.log('-> BCA Faculty Verification: PASSED (9/9 Verified Professors)\n');
  }
}

// 2. VERIFY MCA PROGRAMME
console.log('--- 2. MCA PROGRAMME AUDIT ---');
const mca = programs.find(p => p.id === 'mca' || p.code === 'MCA');
if (!mca) {
  console.error('FAILED: MCA programme record missing!');
  failedTests++;
} else {
  const mcaFaculty = facultyList.filter(f => f.departmentId === 'dept-bca' && (f.programmeCode === 'MCA' || f.programmeType === 'pg'));
  console.log(`Verified MCA Faculty Count: ${mcaFaculty.length} (Expected: 5)`);
  mcaFaculty.forEach((f, idx) => console.log(`  [${idx + 1}] ${f.name} (${f.designation}) - Photo: ${f.photoUrl}`));
  
  if (mcaFaculty.length !== 5) {
    console.error(`FAILED: Expected 5 MCA faculty members, found ${mcaFaculty.length}`);
    failedTests++;
  } else {
    console.log('-> MCA Faculty Verification: PASSED (5/5 Verified Professors)\n');
  }
}

// 3. VERIFY B.SC & B.A COMBINATIONS
console.log('--- 3. B.SC & B.A COMBINATIONS AUDIT ---');
const bsc = programs.find(p => p.id === 'bsc');
const ba = programs.find(p => p.id === 'ba');

console.log(`B.Sc Combinations (${bsc.combinations?.length || 0}):`);
bsc.combinations?.forEach(c => console.log(`  - [${c.code}] ${c.subjects}`));

console.log(`\nB.A Combinations (${ba.combinations?.length || 0}):`);
ba.combinations?.forEach(c => console.log(`  - [${c.code}] ${c.subjects}`));

if (!bsc.combinations || bsc.combinations.length < 5 || !ba.combinations || ba.combinations.length < 4) {
  console.error('FAILED: Missing subject combinations for B.Sc or B.A');
  failedTests++;
} else {
  console.log('-> Subject Combinations Verification: PASSED\n');
}

// 4. VERIFY ALL 20 PROGRAMMES HAVE OFFICIAL CONTENT
console.log('--- 4. ALL 20 PROGRAMMES CONTENT AUDIT ---');
programs.forEach((prog, idx) => {
  const hasOverview = prog.overview && prog.overview.length > 30;
  const hasEligibility = prog.eligibility && prog.eligibility.length > 20;
  const hasUrl = prog.officialUrl && prog.officialUrl.startsWith('https://stphilos.ac.in/');
  
  if (!hasOverview || !hasEligibility || !hasUrl) {
    console.error(`FAILED: Programme ${prog.code} missing required content fields!`);
    failedTests++;
  } else {
    console.log(`[${(idx + 1).toString().padStart(2)}] ${prog.code.padEnd(22)} | Overview: ${prog.overview.length} chars | Elig: OK | URL: ${prog.officialUrl}`);
  }
});

console.log('\n================================================================');
if (failedTests === 0) {
  console.log('>>> SUCCESS: ALL OFFICIAL PROGRAMMES & FACULTY VERIFIED 100% <<<');
} else {
  console.error(`>>> FAILED WITH ${failedTests} ERRORS <<<`);
  process.exit(1);
}
console.log('================================================================\n');
