const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
let facultyList = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));
let departments = hierarchy.departments || [];
let programmes = hierarchy.programmes || [];

console.log('=== FIXING PHYSICS DEPARTMENT & FACULTY ROSTER ===\n');

// 1. UPDATE PHYSICS DEPARTMENT OBJECT
let physicsDept = departments.find(d => d.id === 'dept-physics' || d.id === 'physics' || d.slug === 'physics');
if (!physicsDept) {
  physicsDept = { id: 'dept-physics', slug: 'physics' };
  departments.push(physicsDept);
}

physicsDept.id = 'dept-physics';
physicsDept.deptId = 'dept-physics';
physicsDept.slug = 'physics';
physicsDept.code = 'PHY';
physicsDept.name = 'Department of Physics';
physicsDept.shortName = 'Physics';
physicsDept.faculty = 'Faculty of Science';
physicsDept.officialUrl = 'https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/';
physicsDept.sourcePageUrl = 'https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/';
physicsDept.established = '1946';

physicsDept.description = "The Department of Physics was established in the year 1946, offering comprehensive undergraduate and postgraduate education, experimental laboratories, and University of Mysore recognized research programs.";
physicsDept.history = "Science education at St. Philomena's College began in 1946 under the vision of founder stalwarts Rev. Dr. N.T. Thomas, Prof. B.S. Rama Rao, Prof. B.R. Sitaram, S.R. Shankar Narayana, G. Shivaram Prasad, K.R. Jaganathaiah Setty, M.S. Jaganath, R.S. Nidhi, G. Rajalakshmi, and Mrs. Shobana Thomas. Over the decades, the department has produced eminent physicists, researchers, and university rank holders across India and internationally.";
physicsDept.vision = "To instill scientific temper, analytical reasoning, and experimental rigor in young minds, empowering them to address modern scientific challenges and contribute to technological advancement.";
physicsDept.mission = "To provide high-quality theoretical and laboratory education in classical, quantum, and applied physics; to foster research curiosity through lecture workshops and experimental projects; and to prepare students for national level competitive examinations and higher scientific pursuits.";

physicsDept.ugProgrammes = ['bsc'];
physicsDept.pgProgrammes = ['msc-physics'];
physicsDept.programmes = ['B.Sc (Physics Combinations: PCM, PMCS)', 'M.Sc Physics (Postgraduate Studies & Research)'];

physicsDept.achievements = [
  "Recognized Research Center by the University of Mysore for Doctoral Research in Physics.",
  "Nodal Centre for the Indian Institute of Remote Sensing (IIRS) outreach e-Learning Education Programme.",
  "Regular examination center for the National Graduate Physics Examination (NGPE).",
  "Organized Science Academies' National Refresher Courses in Experimental Physics and Quantum Mechanics.",
  "DST-FIST and DBT Star College supported Physics laboratories and Optics suites."
];

physicsDept.facilities = [
  "Advanced Optics, Spectroscopy, and Darkroom Experimental Suite.",
  "Modern Solid State Physics, Condensed Matter, and Electronics Laboratories.",
  "Departmental Computer & Computational Physics Center.",
  "Specialized departmental physics reference library and smart audio-visual lecture hall."
];

physicsDept.activities = [
  "Annual Lecture Workshops in association with Indian Academy of Sciences, Indian National Science Academy, and Indian Institute of Astrophysics.",
  "Physics Demonstration and Outreach exhibitions for PU and High School students in association with Bhramara Trust.",
  "Study tours and industrial visits to Raman Research Institute (RRI), IIA, and national laboratory facilities."
];

// 2. DEFINE AUTHENTIC PHYSICS FACULTY ROSTER (UG & PG)
const physicsFacultyRoster = [
  // UG Physics Staff
  {
    id: "fac_thomas_gunaseelan",
    name: "Mr. Thomas Gunaseelan",
    designation: "HOD & Associate Professor",
    qualification: "M.Sc, M.Phil, PGDCA, (Ph.D)",
    departmentId: "dept-physics",
    department: "Department of Physics",
    programmeCode: "B.Sc",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/thomas-gunaseelan/",
    officialPhotoUrl: null,
    photoUrl: null,
    photoVerified: false,
    bio: "Mr. Thomas Gunaseelan is the Head of the Department and Associate Professor of Physics at St. Philomena's College (Autonomous), specializing in Crystallography, Condensed Matter Physics, and Computational Modeling."
  },
  {
    id: "fac_eliezer_vishwas",
    name: "Mr. Eliezer Vishwas",
    designation: "Assistant Professor & NCC Officer",
    qualification: "M.Sc, KSET",
    departmentId: "dept-physics",
    department: "Department of Physics",
    programmeCode: "B.Sc",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/",
    officialPhotoUrl: null,
    photoUrl: null,
    photoVerified: false,
    bio: "Mr. Eliezer Vishwas is an Assistant Professor of Physics and Associate NCC Officer at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_chandana",
    name: "Ms. Chandana",
    designation: "Assistant Professor",
    qualification: "M.Sc",
    departmentId: "dept-physics",
    department: "Department of Physics",
    programmeCode: "B.Sc",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/",
    officialPhotoUrl: null,
    photoUrl: null,
    photoVerified: false,
    bio: "Ms. Chandana is an Assistant Professor in the Department of Physics at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_impana_n",
    name: "Ms. Impana N",
    designation: "Assistant Professor",
    qualification: "M.Sc",
    departmentId: "dept-physics",
    department: "Department of Physics",
    programmeCode: "B.Sc",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/",
    officialPhotoUrl: null,
    photoUrl: null,
    photoVerified: false,
    bio: "Ms. Impana N is an Assistant Professor in the Department of Physics at St. Philomena's College (Autonomous)."
  },
  // PG M.Sc Physics Staff
  {
    id: "fac_felan_amal",
    name: "Dr. Felan Amal",
    designation: "Assistant Professor & Head (PG)",
    qualification: "M.Sc, Ph.D",
    departmentId: "dept-physics",
    department: "Department of Physics",
    programmeCode: "M.Sc Physics",
    programmeType: "pg",
    officialProfileUrl: "https://stphilos.ac.in/felan-amal/",
    officialPhotoUrl: null,
    photoUrl: null,
    photoVerified: false,
    bio: "Dr. Felan Amal is the Head of Postgraduate Studies and Research in Physics at St. Philomena's College (Autonomous), specializing in Theoretical and Condensed Matter Physics."
  },
  {
    id: "fac_sachin_c_n",
    name: "Dr. Sachin C N",
    designation: "Assistant Professor (PG)",
    qualification: "M.Sc, Ph.D",
    departmentId: "dept-physics",
    department: "Department of Physics",
    programmeCode: "M.Sc Physics",
    programmeType: "pg",
    officialProfileUrl: "https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/",
    officialPhotoUrl: null,
    photoUrl: null,
    photoVerified: false,
    bio: "Dr. Sachin C N is an Assistant Professor in the Postgraduate Department of Physics at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_chandana_s",
    name: "Ms. Chandana S",
    designation: "Assistant Professor (PG)",
    qualification: "M.Sc",
    departmentId: "dept-physics",
    department: "Department of Physics",
    programmeCode: "M.Sc Physics",
    programmeType: "pg",
    officialProfileUrl: "https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/",
    officialPhotoUrl: null,
    photoUrl: null,
    photoVerified: false,
    bio: "Ms. Chandana S is an Assistant Professor in the Postgraduate Department of Physics at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_r_manimozhi",
    name: "Dr. R Manimozhi",
    designation: "Assistant Professor (PG)",
    qualification: "M.Sc, Ph.D",
    departmentId: "dept-physics",
    department: "Department of Physics",
    programmeCode: "M.Sc Physics",
    programmeType: "pg",
    officialProfileUrl: "https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/",
    officialPhotoUrl: null,
    photoUrl: null,
    photoVerified: false,
    bio: "Dr. R Manimozhi is an Assistant Professor in the Postgraduate Department of Physics at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_akhil_e_j",
    name: "Mr. Akhil E J",
    designation: "Assistant Professor (PG)",
    qualification: "M.Sc, KSET",
    departmentId: "dept-physics",
    department: "Department of Physics",
    programmeCode: "M.Sc Physics",
    programmeType: "pg",
    officialProfileUrl: "https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/",
    officialPhotoUrl: null,
    photoUrl: null,
    photoVerified: false,
    bio: "Mr. Akhil E J is an Assistant Professor in the Postgraduate Department of Studies and Research in Physics at St. Philomena's College (Autonomous)."
  }
];

// Replace physics faculty in facultyList
const nonPhysicsFaculty = facultyList.filter(f => f.departmentId !== 'dept-physics' && f.departmentId !== 'physics');
const finalFacultyList = [...nonPhysicsFaculty, ...physicsFacultyRoster];

console.log(`Updated Total Faculty Count: ${finalFacultyList.length}`);
console.log(`Physics Faculty Count: ${physicsFacultyRoster.length} (UG: 4, PG: 5)`);

// Save updated files
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(finalFacultyList, null, 2));

hierarchy.faculty = finalFacultyList;
hierarchy.departments = departments;
fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));

console.log('=== PHYSICS DEPARTMENT & FACULTY SYNCHRONIZED SUCCESSFULLY ===');
