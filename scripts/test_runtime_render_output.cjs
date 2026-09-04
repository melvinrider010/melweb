const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = hierarchy.faculty || [];
const programs = hierarchy.programmes || [];

console.log('=== RUNTIME RENDER OUTPUT AUDIT ===\n');

// Mock getProgrammeFaculty
function getProgrammeFaculty(progIdOrCode) {
  const code = progIdOrCode.toUpperCase();
  if (code === 'BCA') {
    return facultyList.filter(f => 
      f.departmentId === 'dept-bca' && 
      (f.programmeCode === 'BCA' || f.programmeType === 'ug' || f.id.includes('gloriya') || f.id.includes('syeda') || f.id.includes('archana') || f.id.includes('sandra') || f.id.includes('manasa') || f.id.includes('lydia') || f.id.includes('harshitha') || f.id.includes('ajay') || f.id.includes('priyanka'))
    );
  }
  if (code === 'MCA') {
    return facultyList.filter(f => 
      f.departmentId === 'dept-bca' && 
      (f.programmeCode === 'MCA' || f.programmeType === 'pg' || f.id.includes('reena') || f.id.includes('bindu') || f.id.includes('shiva') || f.id.includes('roshan') || f.id.includes('harini'))
    );
  }
  const prog = programs.find(p => (p.code || p.id).toUpperCase() === code);
  if (prog && Array.isArray(prog.facultyIds) && prog.facultyIds.length > 0) {
    const idSet = new Set(prog.facultyIds);
    const matched = facultyList.filter(f => idSet.has(f.id));
    if (matched.length > 0) return matched;
  }
  return facultyList.filter(f => f.departmentId === prog?.departmentId);
}

const testCourses = ['BCA', 'MCA', 'B.Com', 'B.Sc', 'BBA', 'BSW', 'M.Sc Chemistry', 'M.Sc Physics', 'MSW', 'MBA'];

testCourses.forEach(c => {
  const facs = getProgrammeFaculty(c);
  console.log(`Course: ${c.padEnd(16)} | Faculty Count: ${String(facs.length).padStart(2)} Faculty Members`);
  facs.slice(0, 3).forEach(f => console.log(`   - ${f.name} (${f.designation}) [Photo: ${f.photoUrl ? 'YES' : 'AVATAR'}]`));
  if (facs.length > 3) console.log(`   ... and ${facs.length - 3} more members.`);
  console.log('');
});
