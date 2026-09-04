const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const depts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'departments.json'), 'utf8'));
const progs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'programs.json'), 'utf8'));
const faculty = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));

console.log(`Current Departments: ${depts.length}`);
console.log(`Current Programs: ${progs.length}`);
console.log(`Current Faculty: ${faculty.length}`);

console.log('\n--- Sample Faculty ---');
faculty.slice(0, 10).forEach(f => console.log(JSON.stringify(f)));

console.log('\n--- Sample Departments ---');
depts.slice(0, 5).forEach(d => console.log(JSON.stringify({ id: d.id, name: d.name, faculty: d.faculty, programs: d.programs })));
