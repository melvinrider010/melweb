const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const canonical20 = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'programs.json'), 'utf8'));

hierarchy.programmes = canonical20;

// Save hierarchy
fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));

console.log(`=== ACADEMICS HIERARCHY UPDATED WITH 20 CANONICAL PROGRAMMES ===`);
console.log(`Faculties: ${hierarchy.faculties.length}`);
console.log(`Departments: ${hierarchy.departments.length}`);
console.log(`Programmes: ${hierarchy.programmes.length} (8 UG, 12 PG)`);
console.log(`Faculty Members: ${hierarchy.faculty.length}`);
