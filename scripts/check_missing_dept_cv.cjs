const fs = require('fs');
const path = require('path');

const exact = JSON.parse(fs.readFileSync(path.join(__dirname, 'exact_official_cv_faculty.json'), 'utf8'));

console.log('=== CHECKING SPECIFIC DEPARTMENTS IN CV DATA ===');
exact.filter(f => /economic|biochem|history|environment/i.test(f.departmentText)).forEach(f => {
  console.log(`- ${f.name} | ${f.designation} | DeptText: "${f.departmentText}"`);
});
