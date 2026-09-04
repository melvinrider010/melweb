const fs = require('fs');
const hierarchy = JSON.parse(fs.readFileSync('src/data/academicsHierarchyData.json', 'utf8'));

console.log('Total faculty in hierarchy:', hierarchy.faculty.length);

const econFaculty = hierarchy.faculty.filter(f => f.departmentId === 'dept-economics');
console.log('\n--- 104 Faculty under dept-economics ---');
econFaculty.forEach((f, i) => {
  console.log(`[${i+1}] ${f.name} | Desig: ${f.designation} | DeptName: ${f.departmentName} | DeptSlug: ${f.departmentSlug} | Programme: ${f.programmeCode || f.programme}`);
});
