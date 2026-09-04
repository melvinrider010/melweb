const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const exactFaculty = JSON.parse(fs.readFileSync(path.join(__dirname, 'exact_official_cv_faculty.json'), 'utf8'));

console.log('=== AUDITING ALL 106 OFFICIAL FACULTY RECORDS ===');

exactFaculty.forEach((f, idx) => {
  console.log(`[${idx + 1}] Name: "${f.name}" | DeptText: "${f.departmentText}" | Desig: "${f.designation}" | Qual: "${f.qualification}"`);
});
