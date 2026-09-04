const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const faculty = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));

let adjusted = 0;
faculty.forEach(f => {
  if (f.photoVerified && f.photoUrl) {
    const absPath = path.join(ROOT_DIR, 'public', f.photoUrl.substring(1));
    if (!fs.existsSync(absPath) || fs.statSync(absPath).size === 0) {
      console.log(`Setting photoUrl to null for ${f.name} because local file not present (${f.photoUrl})`);
      f.photoUrl = null;
      f.photoVerified = false;
      adjusted++;
    }
  }
});

hierarchy.faculty = faculty;

fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(faculty, null, 2));

console.log(`Adjusted ${adjusted} records to null -> initials avatar.`);
