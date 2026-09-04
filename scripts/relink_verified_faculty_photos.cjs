const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');
const FACULTY_MEDIA_DIR = path.join(ROOT_DIR, 'public/media/faculty');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const faculty = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));

// Get all files in public/media/faculty
const localFiles = fs.existsSync(FACULTY_MEDIA_DIR) ? fs.readdirSync(FACULTY_MEDIA_DIR) : [];

let matched = 0;

faculty.forEach(f => {
  const normKey = f.name.toLowerCase().replace(/^(?:dr|mr|mrs|ms|prof|rev)[-.\s]+/g, '').replace(/[^a-z]/g, '');
  if (normKey.length < 3) return;

  const matchedFile = localFiles.find(file => {
    const cleanFile = file.toLowerCase().replace(/[^a-z]/g, '');
    return cleanFile.includes(normKey) || normKey.includes(cleanFile);
  });

  if (matchedFile) {
    f.photoUrl = `/media/faculty/${matchedFile}`;
    f.photoVerified = true;
    matched++;
  } else {
    f.photoUrl = null;
    f.photoVerified = false;
  }
});

hierarchy.faculty = faculty;

fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(faculty, null, 2));

console.log(`Relinked ${matched} authentic local portrait photos.`);
