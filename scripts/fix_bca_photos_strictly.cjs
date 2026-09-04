const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));

console.log('=== STRICT BCA FACULTY PHOTO REPAIR ===');

// 1. Delete the incorrect workshop/event image files for BCA
const bcaPhotoFiles = [
  'public/assets/faculty/computer-applications/bca-gloriya.jpg',
  'public/assets/faculty/computer-applications/bca-syeda-masarath.jpg',
  'public/assets/faculty/computer-applications/bca-archana.jpg',
  'public/assets/faculty/computer-applications/bca-sandra-agnes.jpg',
  'public/assets/faculty/computer-applications/bca-manasa.jpg',
  'public/assets/faculty/computer-applications/bca-lydia-anjalla.jpg',
  'public/assets/faculty/computer-applications/bca-harshitha.jpg',
  'public/assets/faculty/computer-applications/bca-ajay-anthony.jpg',
  'public/assets/faculty/computer-applications/bca-priyanka.jpg',
  'public/assets/faculty/computer-applications/bca-e_gloriya_priyadarshini.jpg',
  'public/assets/faculty/computer-applications/bca-j_sandra_agnes.jpg',
  'public/assets/faculty/computer-applications/bca-ajay_anthony_g.jpg',
  'public/assets/faculty/computer-applications/bca-priyanka_mk.jpg'
];

bcaPhotoFiles.forEach(fileRel => {
  const fullP = path.join(ROOT_DIR, fileRel);
  if (fs.existsSync(fullP)) {
    fs.unlinkSync(fullP);
    console.log(`Deleted incorrect event/workshop image: ${fileRel}`);
  }
});

// 2. Update the 9 BCA faculty records to have photoUrl = null, photoVerified = false
const bcaFacultyIds = new Set([
  'fac_e_gloriya_priyadarshini',
  'fac_syeda_masarath',
  'fac_archana_a',
  'fac_j_sandra_agnes',
  'fac_manasa_e',
  'fac_lydia_anjalla',
  'fac_harshitha_m',
  'fac_ajay_anthony_g',
  'fac_priyanka_mk'
]);

facultyList.forEach(f => {
  if (bcaFacultyIds.has(f.id) || (f.departmentId === 'dept-bca' && f.programmeCode === 'BCA')) {
    f.photoUrl = null;
    f.photoVerified = false;
    f.officialSourcePage = 'https://stphilos.ac.in/bca/';
    console.log(`Updated BCA Faculty: ${f.name} -> photoUrl: null, photoVerified: false (Clean Initials Avatar)`);
  }
});

hierarchy.faculty.forEach(f => {
  if (bcaFacultyIds.has(f.id) || (f.departmentId === 'dept-bca' && f.programmeCode === 'BCA')) {
    f.photoUrl = null;
    f.photoVerified = false;
    f.officialSourcePage = 'https://stphilos.ac.in/bca/';
  }
});

// Save updated JSON files
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(facultyList, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));

console.log('\n=== BCA FACULTY PHOTO REPAIR COMPLETED ===');
