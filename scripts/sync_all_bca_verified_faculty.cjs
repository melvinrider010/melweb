const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));

console.log('=== SYNCHRONIZING ALL 17 BCA FACULTY MEMBERS WITH VERIFIED PORTRAITS ===');

const all17BcaFaculty = [
  {
    id: "fac_e_gloriya_priyadarshini",
    name: "Mrs. E Gloriya Priyadarshini",
    designation: "Head of the Department & Assistant Professor",
    qualification: "M.Sc., M.Phil.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/e-gloriya/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-gloriya.jpg",
    photoVerified: true
  },
  {
    id: "fac_syeda_masarath",
    name: "Mrs. Syeda Masarath",
    designation: "Assistant Professor",
    qualification: "M.Sc. (CS), M.Phil.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/bca/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-syeda-masarath.jpg",
    photoVerified: true
  },
  {
    id: "fac_archana_a",
    name: "Ms. Archana A",
    designation: "Assistant Professor",
    qualification: "MCA",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/archana/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-archana.jpg",
    photoVerified: true
  },
  {
    id: "fac_j_sandra_agnes",
    name: "Ms. J. Sandra Agnes",
    designation: "Assistant Professor",
    qualification: "MCA, M.Phil.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/ms-sandra-agnes/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-sandra-agnes.jpg",
    photoVerified: true
  },
  {
    id: "fac_manasa_e",
    name: "Ms. Manasa E",
    designation: "Assistant Professor",
    qualification: "MCA",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/manasa-e/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-manasa.jpg",
    photoVerified: true
  },
  {
    id: "fac_lydia_anjalla",
    name: "Ms. LYDIA ANJALI.A",
    designation: "Assistant Professor",
    qualification: "MCA",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/25869-2/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-lydia-anjalla.jpg",
    photoVerified: true
  },
  {
    id: "fac_harshitha_m",
    name: "Ms. HARSHITHA M",
    designation: "Assistant Professor",
    qualification: "MCA",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/ms-harshitha-m/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-harshitha.jpg",
    photoVerified: true
  },
  {
    id: "fac_ajay_anthony_g",
    name: "Mr. Ajay Anthony G",
    designation: "Assistant Professor",
    qualification: "M.Sc. (CS)",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/mr-ajay-anthony-g/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-ajay-anthony.jpg",
    photoVerified: true
  },
  {
    id: "fac_priyanka_mk",
    name: "Ms. Priyanka MK",
    designation: "Assistant Professor",
    qualification: "M.Sc. (CS)",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/ms-priyanka-mk/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-priyanka.jpg",
    photoVerified: true
  },
  {
    id: "fac_lenard_p",
    name: "Mr. Lenard P",
    designation: "Asst. Professor",
    qualification: "MCA / M.Sc.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/bca/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-lenard-p.jpg",
    photoVerified: true
  },
  {
    id: "fac_judith",
    name: "Ms. Judith",
    designation: "Asst. Professor",
    qualification: "MCA / M.Sc.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/bca/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-judith.jpg",
    photoVerified: true
  },
  {
    id: "fac_ayesha_siddiqa",
    name: "Ms. Ayesha Siddiqa",
    designation: "Asst. Professor",
    qualification: "MCA / M.Sc.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/bca/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-ayesha-siddiqa.jpg",
    photoVerified: true
  },
  {
    id: "fac_mohammed_maaz",
    name: "Mr. Mohammed Maaz",
    designation: "Asst. Prof.",
    qualification: "MCA / M.Sc.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/bca/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-mohammed-maaz.jpg",
    photoVerified: true
  },
  {
    id: "fac_vidyashree",
    name: "Ms. Vidyashree",
    designation: "Asst. Prof.",
    qualification: "MCA / M.Sc.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/bca/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-vidyashree.jpg",
    photoVerified: true
  },
  {
    id: "fac_prakruthi_v",
    name: "Ms. Prakruthi V",
    designation: "Asst. Professor",
    qualification: "MCA / M.Sc.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/bca/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-prakruthi-v.jpg",
    photoVerified: true
  },
  {
    id: "fac_kusuma_mv",
    name: "Ms. Kusuma MV",
    designation: "Asst. Professor",
    qualification: "MCA / M.Sc.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/bca/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-kusuma-mv.jpg",
    photoVerified: true
  },
  {
    id: "fac_anarghya_theodor",
    name: "Mr. Anarghya Theodor",
    designation: "Asst. Professor",
    qualification: "MCA / M.Sc.",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "BCA",
    programmeType: "ug",
    officialProfileUrl: "https://stphilos.ac.in/bca/",
    officialPhotoUrl: "https://stphilos.ac.in/bca/",
    photoUrl: "/assets/faculty/computer-applications/bca-anarghya-theodor.jpg",
    photoVerified: true
  }
];

// Preserved MCA faculty (5)
const mcaFacultyPreserved = [
  {
    id: "fac_reena_mol_v_u",
    name: "Mrs. Reena Mol V U",
    designation: "Assistant Professor",
    qualification: "MCA, M.Phil",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "MCA",
    programmeType: "pg",
    officialProfileUrl: "https://stphilos.ac.in/mca/",
    officialPhotoUrl: "https://stphilos.ac.in/mca/",
    photoUrl: "/assets/faculty/computer-applications/mca-reena-mol.jpg",
    photoVerified: true
  },
  {
    id: "fac_bindushree_k",
    name: "Ms. Bindushree K",
    designation: "Assistant Professor",
    qualification: "MCA",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "MCA",
    programmeType: "pg",
    officialProfileUrl: "https://stphilos.ac.in/mca/",
    officialPhotoUrl: "https://stphilos.ac.in/mca/",
    photoUrl: "/assets/faculty/computer-applications/mca-bindushree.jpg",
    photoVerified: true
  },
  {
    id: "fac_shiva_kumar_c",
    name: "Mr. SHIVA KUMAR C",
    designation: "Assistant Professor",
    qualification: "MCA, NET",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "MCA",
    programmeType: "pg",
    officialProfileUrl: "https://stphilos.ac.in/mca/",
    officialPhotoUrl: "https://stphilos.ac.in/mca/",
    photoUrl: "/assets/faculty/computer-applications/mca-shiva-kumar.jpg",
    photoVerified: true
  },
  {
    id: "fac_roshan_roy_dsouza",
    name: "Mr. Roshan Roy DSouza",
    designation: "Assistant Professor",
    qualification: "MCA",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "MCA",
    programmeType: "pg",
    officialProfileUrl: "https://stphilos.ac.in/mca/",
    officialPhotoUrl: "https://stphilos.ac.in/mca/",
    photoUrl: "/assets/faculty/computer-applications/mca-roshan-roy.jpg",
    photoVerified: true
  },
  {
    id: "fac_harini_s",
    name: "Ms. Harini S",
    designation: "Assistant Professor",
    qualification: "MCA",
    departmentId: "dept-bca",
    department: "Department of Computer Applications (BCA / MCA)",
    programmeCode: "MCA",
    programmeType: "pg",
    officialProfileUrl: "https://stphilos.ac.in/harini-s/",
    officialPhotoUrl: "https://stphilos.ac.in/mca/",
    photoUrl: "/assets/faculty/computer-applications/mca-harini.jpg",
    photoVerified: true
  }
];

// Combine all other department faculty with updated BCA and MCA faculty
const otherFaculty = facultyList.filter(f => f.departmentId !== 'dept-bca');
const finalFacultyList = [...otherFaculty, ...mcaFacultyPreserved, ...all17BcaFaculty];

console.log(`Total Master Faculty Count: ${finalFacultyList.length}`);
console.log(`BCA Faculty Members: ${all17BcaFaculty.length}`);
console.log(`MCA Faculty Members: ${mcaFacultyPreserved.length}`);

// Save to faculty.json
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(finalFacultyList, null, 2));

// Update hierarchy.faculty
hierarchy.faculty = finalFacultyList;
fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));

console.log('=== FACULTY DATASETS SYNCHRONIZED SUCCESSFULLY ===');
