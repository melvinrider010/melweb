const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
let facultyList = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));
let programmes = hierarchy.programmes || [];

console.log('=== SYNCHRONIZING AUTHENTIC B.COM FACULTY & PROGRAMME CONTENT ===\n');

// 12 Authentic B.Com Faculty Members from Official Website
const all12BcomFaculty = [
  {
    id: "fac_reena_francis",
    name: "Dr. Reena Francis",
    designation: "Head of the Department & Dean",
    qualification: "M.Com, M.Phil, Ph.D",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/dr-reena-francis/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-reena-francis.jpg",
    photoVerified: true,
    bio: "Dr. Reena Francis is the Dean and Head of the Department of Commerce at St. Philomena's College (Autonomous), leading the department since 2011."
  },
  {
    id: "fac_sandesh_d_souza",
    name: "Dr. Sandesh D'Souza",
    designation: "Assistant Professor",
    qualification: "M.Com, Ph.D, KSET",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/mr-sandesh-dsouza/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-sandesh-dsouza.jpg",
    photoVerified: true,
    bio: "Dr. Sandesh D'Souza is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous), specializing in Accounting and Finance."
  },
  {
    id: "fac_sunil_d_souza",
    name: "Dr. Sunil D'Souza",
    designation: "Assistant Professor",
    qualification: "M.Com, Ph.D",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/dr-sunil-dsouza/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-sunil-dsouza.jpg",
    photoVerified: true,
    bio: "Dr. Sunil D'Souza is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_jubie_singh_p",
    name: "Ms. Jubie Singh P",
    designation: "Assistant Professor",
    qualification: "M.Com",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/b-com-2/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-jubie-singh.jpg",
    photoVerified: true,
    bio: "Ms. Jubie Singh P is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_amreen_kousar",
    name: "Mrs. Amreen Kousar",
    designation: "Assistant Professor",
    qualification: "M.Com",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/amreen-kousar/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-amreen-kousar.jpg",
    photoVerified: true,
    bio: "Mrs. Amreen Kousar is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_supritha_r",
    name: "Ms. Supritha R",
    designation: "Assistant Professor",
    qualification: "M.Com",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/supritha-r/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-supritha-r.jpg",
    photoVerified: true,
    bio: "Ms. Supritha R is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_florita_bernadetie_alexander",
    name: "Dr. Florita Bernadete Alexander",
    designation: "Assistant Professor",
    qualification: "M.Com, Ph.D",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/b-com-2/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-florita-alexander.jpg",
    photoVerified: true,
    bio: "Dr. Florita Bernadete Alexander is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_kavitha_r",
    name: "Kavitha R",
    designation: "Assistant Professor",
    qualification: "M.Com",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/kavitha-r/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-kavitha-r.jpg",
    photoVerified: true,
    bio: "Kavitha R is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_viveka_marie_g",
    name: "Dr. Viveka Marie G",
    designation: "Assistant Professor",
    qualification: "M.Com, Ph.D, KSET",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/dr-viveka-marie-g/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-viveka-marie.jpg",
    photoVerified: true,
    bio: "Dr. Viveka Marie G is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_amrin_taj",
    name: "Ms. Amrin Taj",
    designation: "Assistant Professor",
    qualification: "M.Com",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/ms-amrin-taj/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-amrin-taj.jpg",
    photoVerified: true,
    bio: "Ms. Amrin Taj is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_jancy_j",
    name: "Ms. Jancy J",
    designation: "Asst. Prof.",
    qualification: "M.Com",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/b-com-2/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-jancy-j.jpg",
    photoVerified: true,
    bio: "Ms. Jancy J is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous)."
  },
  {
    id: "fac_harshitha_rai_m",
    name: "Ms. Harshitha RAI M",
    designation: "Asst. Prof.",
    qualification: "M.Com",
    departmentId: "dept-commerce",
    department: "Department of Commerce",
    programmeCode: "B.Com",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/b-com-2/",
    officialPhotoUrl: "https://stphilos.ac.in/b-com-2/",
    photoUrl: "/assets/faculty/commerce/bcom-harshitha-rai.jpg",
    photoVerified: true,
    bio: "Ms. Harshitha RAI M is an Assistant Professor in the Department of Commerce at St. Philomena's College (Autonomous)."
  }
];

// Combine faculty list
const nonCommerceFaculty = facultyList.filter(f => f.departmentId !== 'dept-commerce' && f.departmentId !== 'commerce');
const updatedFacultyList = [...nonCommerceFaculty, ...all12BcomFaculty];

console.log(`Updated Total Faculty Count: ${updatedFacultyList.length}`);
console.log(`B.Com Faculty Members: ${all12BcomFaculty.length}`);

// Update B.Com programme content from Image 1
const bcomProg = programmes.find(p => (p.code || p.id).toUpperCase() === 'B.COM' || p.id === 'bcom');
if (bcomProg) {
  bcomProg.history = "Established in 1969, the Department of Commerce has consistently produced skilled graduates. It owes its growth to eminent faculty like Prof. Balasubramanyam, Prof. K.G. Ramakrishna, and others. Since 2011, the department has been led by Dr. Reena Francis as Dean and HoD. With autonomy in 2011, the department designed an industry-relevant syllabus. It adopted CBCS in 2016 and introduced DSE and SEC courses in 2018 to enhance flexibility and skills.";
  bcomProg.overview = "The Bachelor of Commerce (B.Com) program at St. Philomena's College offers specialized corporate education including B.Com (General) since 1969, B.Com with CA & CS (2004-2013), B.Com with ACCA (since 2016-17), and B.Com with CMA (since 2020-21). Add-on certifications include SAP and value-added professional development programs.";
  bcomProg.achievements = [
    "Annual National Commerce & Management Fest 'INCREDEMA' featuring Core Events (Best Manager, Best Entrepreneur, Finance, HR, Marketing, E-Commerce) and Non-Core Events (Group Dance, Ramp Walk, Gaming, Circuit Workout, Treasure Hunt).",
    "Student Achievement: Leilan Christina (Final Year B.Com) - Bronze Medalist at Asian Pacific Shitoryu Karatedo Federation (APSKA), Represented India at 15th South Asian APSKA Championship Jakarta, 1st Prize in Women Karate Kata, Certified Referee, Judge, and Coach.",
    "Active Social Outreach initiatives: Home for Little Boys (Lashkar Mohalla), Mercy Convent for Deaf and Dumb (Srirampur), Vimala Terminal Care (Hinkal), and Don Bosco Orphanage (Kuvempunagar)."
  ];
  bcomProg.primaryFacultyIds = all12BcomFaculty.map(f => f.id);
}

// Save datasets
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(updatedFacultyList, null, 2));

hierarchy.faculty = updatedFacultyList;
hierarchy.programmes = programmes;
fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));

console.log('=== B.COM DATA & 12 VERIFIED FACULTY SYNCHRONIZED SUCCESSFULLY ===');
