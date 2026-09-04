const fs = require('fs');
const path = require('path');

const rawFaculty = JSON.parse(fs.readFileSync('src/data/faculty.json', 'utf8'));
const hierarchy = JSON.parse(fs.readFileSync('src/data/academicsHierarchyData.json', 'utf8'));

console.log('faculty.json length:', rawFaculty.length);
console.log('\n--- First 30 items in faculty.json ---');
rawFaculty.slice(0, 30).forEach((f, i) => {
  console.log(`[${i+1}] ${f.name} | Dept: ${f.department || f.departmentName || f.dept} | Desig: ${f.designation} | Qual: ${f.qualification}`);
});

console.log('\n--- Distinct Department values in faculty.json ---');
const rawDepts = {};
rawFaculty.forEach(f => {
  const d = f.department || f.departmentName || f.dept || f.departmentId || 'UNKNOWN';
  rawDepts[d] = (rawDepts[d] || 0) + 1;
});
console.log(JSON.stringify(rawDepts, null, 2));
