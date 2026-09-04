const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const DEPARTMENTS = hierarchy.departments || [];
const FACULTY_MEMBERS = hierarchy.faculty || [];
const PROGRAMMES = hierarchy.programmes || [];

function getDepartmentById(deptIdOrSlug) {
  if (!deptIdOrSlug) return null;
  const raw = String(deptIdOrSlug).toLowerCase().trim();
  const clean = raw.replace(/^dept[-_]/, '');
  const withPrefix = `dept-${clean}`;
  
  return DEPARTMENTS.find(d => {
    const dId = (d.id || '').toLowerCase();
    const dSlug = (d.slug || '').toLowerCase();
    const dCode = (d.code || '').toLowerCase();
    const dDeptId = (d.deptId || '').toLowerCase();
    return dId === raw || dId === clean || dId === withPrefix ||
           dSlug === raw || dSlug === clean || dSlug === withPrefix ||
           dDeptId === raw || dDeptId === clean || dDeptId === withPrefix ||
           dCode === raw || dCode === clean;
  }) || null;
}

function getFacultyByDepartmentId(deptIdOrSlug) {
  if (!deptIdOrSlug) return [];
  const clean = String(deptIdOrSlug).toLowerCase().trim();
  const dept = getDepartmentById(clean);
  const targetId = dept ? (dept.deptId || dept.id) : clean;
  return FACULTY_MEMBERS.filter(f => 
    f.departmentId === targetId || 
    (dept && f.departmentId === dept.id) || 
    (dept && f.departmentId === dept.slug)
  );
}

console.log('=== VERIFYING PHYSICS DEPARTMENT FIX & BCA/MCA REGRESSION PROTECTION ===\n');

// 1. TEST PHYSICS DEPARTMENT LOOKUP
const physicsDept = getDepartmentById('dept-physics');
console.log(`[TEST 1] getDepartmentById('dept-physics'):`);
console.log(`  ID:   ${physicsDept?.id}`);
console.log(`  Name: ${physicsDept?.name}`);
console.log(`  URL:  ${physicsDept?.officialUrl}`);

assert(physicsDept !== null, 'Physics department should not be null');
assert(physicsDept.name === 'Department of Physics', 'Physics department name must be Department of Physics');
assert(physicsDept.id === 'dept-physics', 'Physics department ID must be dept-physics');
assert(!physicsDept.name.includes('Computer Applications'), 'Physics department must not include Computer Applications');
console.log('  -> PASS\n');

// 2. TEST SLUG LOOKUP (e.g. "physics")
const physicsBySlug = getDepartmentById('physics');
console.log(`[TEST 2] getDepartmentById('physics'):`);
console.log(`  Name: ${physicsBySlug?.name}`);
assert(physicsBySlug?.name === 'Department of Physics', 'Physics slug must resolve to Department of Physics');
console.log('  -> PASS\n');

// 3. TEST BCA LOOKUP & REGRESSION PROTECTION
const bcaDept = getDepartmentById('dept-bca');
console.log(`[TEST 3] getDepartmentById('dept-bca'):`);
console.log(`  ID:   ${bcaDept?.id}`);
console.log(`  Name: ${bcaDept?.name}`);
assert(bcaDept !== null, 'BCA department must not be null');
assert(bcaDept.name.includes('Computer Applications'), 'BCA department name must include Computer Applications');
console.log('  -> PASS (BCA Preserved 100%)\n');

// 4. TEST PHYSICS FACULTY ISOLATION
const physicsFaculty = getFacultyByDepartmentId('dept-physics');
console.log(`[TEST 4] getFacultyByDepartmentId('dept-physics') (${physicsFaculty.length} members):`);
physicsFaculty.forEach((f, idx) => {
  console.log(`   ${idx + 1}. ${f.name} (${f.designation}) [Prog: ${f.programmeCode || f.programmeType}]`);
  assert(f.departmentId === 'dept-physics' || f.departmentId === 'physics', 'Must belong strictly to physics');
  assert(!f.name.includes('Gloriya') && !f.name.includes('Reena Mol'), 'No BCA/MCA faculty in Physics');
});
console.log('  -> PASS (0 BCA/MCA faculty in Physics)\n');

// 5. TEST BCA FACULTY ISOLATION
const bcaFaculty = getFacultyByDepartmentId('dept-bca');
console.log(`[TEST 5] getFacultyByDepartmentId('dept-bca') (${bcaFaculty.length} members):`);
assert(bcaFaculty.length >= 22, 'BCA+MCA faculty must remain intact');
bcaFaculty.forEach(f => {
  assert(!f.name.includes('Thomas Gunaseelan') && !f.name.includes('Eliezer'), 'No Physics faculty in BCA');
});
console.log('  -> PASS (0 Physics faculty in BCA)\n');

console.log('================================================================');
console.log('>>> ALL ASSERTIONS PASSED: PHYSICS DEPARTMENT 100% VERIFIED <<<');
console.log('================================================================\n');
