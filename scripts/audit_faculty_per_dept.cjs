const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '../src/data');
const faculty = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));
const depts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'departments.json'), 'utf8'));

console.log('=== FACULTY PER DEPARTMENT AUDIT ===');
const deptMap = new Map();
depts.forEach(d => deptMap.set(d.id, { dept: d, count: 0, members: [] }));

const unmapped = [];

faculty.forEach(f => {
  if (deptMap.has(f.departmentId)) {
    const entry = deptMap.get(f.departmentId);
    entry.count++;
    entry.members.push(f);
  } else {
    unmapped.push(f);
  }
});

for (const [deptId, entry] of deptMap.entries()) {
  console.log(`\n[${deptId}] ${entry.dept.name} => ${entry.count} faculty members`);
  entry.members.slice(0, 5).forEach(m => console.log(`   - ${m.name} (${m.designation}) [Photo: ${m.photoVerified ? 'YES' : 'NO'}]`));
}

if (unmapped.length > 0) {
  console.log(`\nUnmapped faculty: ${unmapped.length}`);
}
