const fs = require('fs');
const path = require('path');

const exact = JSON.parse(fs.readFileSync(path.join(__dirname, 'exact_official_cv_faculty.json'), 'utf8'));

const physics = exact.filter(f => /physics/i.test(f.departmentText));
console.log('=== EXACT AUTHENTIC PHYSICS FACULTY ===');
physics.forEach(p => console.log(` - ${p.name} | ${p.designation} | ${p.qualification} | ${p.departmentText} | Photo: ${p.photoUrl}`));
