const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));

console.log('Departments (first 3):', hierarchy.departments.slice(0, 3));
console.log('Programmes (first 3):', hierarchy.programmes.slice(0, 3));
