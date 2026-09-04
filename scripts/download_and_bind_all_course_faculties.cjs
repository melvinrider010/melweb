const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT_DIR = path.join(__dirname, '..');
const FACULTY_DIR = path.join(ROOT_DIR, 'public/assets/faculty/computer-applications');
if (!fs.existsSync(FACULTY_DIR)) fs.mkdirSync(FACULTY_DIR, { recursive: true });

const MCA_FACULTY = [
  {
    id: 'fac_reena_mol',
    name: 'Mrs. Reena Mol V U',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'pg',
    programmeCode: 'MCA',
    qualification: 'MCA, M.Phil',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-16-at-16.26.47-768x1024.jpeg',
    localFile: '/assets/faculty/computer-applications/mca-reena-mol.jpg'
  },
  {
    id: 'fac_bindushree',
    name: 'Ms. Bindushree K',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'pg',
    programmeCode: 'MCA',
    qualification: 'MCA',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2024/06/1-2-960x1024.jpg',
    localFile: '/assets/faculty/computer-applications/mca-bindushree.jpg'
  },
  {
    id: 'fac_shiva_kumar_c',
    name: 'Mr. SHIVA KUMAR C',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'pg',
    programmeCode: 'MCA',
    qualification: 'MCA, NET',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2025/07/shivkumar-sir-217x300.jpg',
    localFile: '/assets/faculty/computer-applications/mca-shiva-kumar.jpg'
  },
  {
    id: 'fac_roshan_roy',
    name: 'Mr. Roshan Roy DSouza',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'pg',
    programmeCode: 'MCA',
    qualification: 'MCA',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2026/07/RoshanDSouza-1024x1024.jpg',
    localFile: '/assets/faculty/computer-applications/mca-roshan-roy.jpg'
  },
  {
    id: 'fac_harini',
    name: 'Ms. Harini',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'pg',
    programmeCode: 'MCA',
    qualification: 'MCA',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2026/01/WhatsApp-Image-2026-01-03-at-12.31.42-PM.jpeg',
    localFile: '/assets/faculty/computer-applications/mca-harini.jpg'
  }
];

const BCA_FACULTY = [
  {
    id: 'fac_gloriya',
    name: 'Mrs. E Gloriya Priyadarshini',
    designation: 'Head of the Department & Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'ug',
    programmeCode: 'BCA',
    qualification: 'M.Sc., M.Phil.',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2026/08/WhatsApp-Image-2026-08-07-at-1.09.28-PM-1-396x360.jpeg',
    localFile: '/assets/faculty/computer-applications/bca-gloriya.jpg'
  },
  {
    id: 'fac_syeda_masarath',
    name: 'Mrs. Syeda Masarath',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'ug',
    programmeCode: 'BCA',
    qualification: 'M.Sc. (CS), M.Phil.',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2025/08/WhatsApp-Image-2025-08-26-at-8.25.51-AM-396x360.jpeg',
    localFile: '/assets/faculty/computer-applications/bca-syeda-masarath.jpg'
  },
  {
    id: 'fac_archana_a',
    name: 'Ms. Archana A',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'ug',
    programmeCode: 'BCA',
    qualification: 'MCA',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2025/03/WhatsApp-Image-2025-03-25-at-9.13.02-PM-396x360.jpeg',
    localFile: '/assets/faculty/computer-applications/bca-archana.jpg'
  },
  {
    id: 'fac_sandra_agnes',
    name: 'Ms. J. Sandra Agnes',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'ug',
    programmeCode: 'BCA',
    qualification: 'MCA, M.Phil.',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2025/03/44-396x360.jpg',
    localFile: '/assets/faculty/computer-applications/bca-sandra-agnes.jpg'
  },
  {
    id: 'fac_manasa_e',
    name: 'Ms. Manasa E',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'ug',
    programmeCode: 'BCA',
    qualification: 'MCA',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2024/12/image-22-396x360.png',
    localFile: '/assets/faculty/computer-applications/bca-manasa.jpg'
  },
  {
    id: 'fac_lydia_anjalla',
    name: 'Ms. LYDIA ANJALLA',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'ug',
    programmeCode: 'BCA',
    qualification: 'MCA',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2024/12/image-16-396x360.png',
    localFile: '/assets/faculty/computer-applications/bca-lydia-anjalla.jpg'
  },
  {
    id: 'fac_harshitha_m',
    name: 'Ms. HARSHITHA M',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'ug',
    programmeCode: 'BCA',
    qualification: 'MCA',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2025/06/image-84-396x360.png',
    localFile: '/assets/faculty/computer-applications/bca-harshitha.jpg'
  },
  {
    id: 'fac_ajay_anthony',
    name: 'Mr. Ajay Anthony G',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'ug',
    programmeCode: 'BCA',
    qualification: 'MCA',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2024/05/3-396x340.png',
    localFile: '/assets/faculty/computer-applications/bca-ajay-anthony.jpg'
  },
  {
    id: 'fac_priyanka_mk',
    name: 'Ms. Priyanka MK',
    designation: 'Assistant Professor',
    departmentId: 'dept-bca',
    programmeType: 'ug',
    programmeCode: 'BCA',
    qualification: 'MCA',
    remoteImg: 'https://stphilos.ac.in/wp-content/uploads/2025/06/4-1-396x360.jpg',
    localFile: '/assets/faculty/computer-applications/bca-priyanka.jpg'
  }
];

function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https') ? https : http;
    client.get(url, { rejectUnauthorized: false, headers: { 'User-Agent': 'Mozilla/5.0' } }, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(true));
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        resolve(false);
      }
    }).on('error', err => {
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

async function run() {
  console.log('=== DOWNLOADING & LOCALIZING MCA & BCA FACULTY PHOTOS ===');

  const allFaculty = [...MCA_FACULTY, ...BCA_FACULTY];
  for (const f of allFaculty) {
    const fullDest = path.join(ROOT_DIR, 'public', f.localFile);
    if (!fs.existsSync(fullDest) || fs.statSync(fullDest).size === 0) {
      console.log(`Downloading photo for ${f.name}...`);
      const ok = await downloadFile(f.remoteImg, fullDest);
      console.log(`  -> ${ok ? 'SUCCESS' : 'FAILED, falling back'}`);
    } else {
      console.log(`Already exists locally: ${f.name}`);
    }
  }

  // Update faculty.json and academicsHierarchyData.json
  const facultyJsonPath = path.join(ROOT_DIR, 'src/data/faculty.json');
  let facultyList = JSON.parse(fs.readFileSync(facultyJsonPath, 'utf8'));

  // Remove existing MCA/BCA staff to avoid duplicates
  facultyList = facultyList.filter(f => f.departmentId !== 'dept-bca');

  // Insert our accurate MCA & BCA staff
  allFaculty.forEach(f => {
    const fullDest = path.join(ROOT_DIR, 'public', f.localFile);
    const exists = fs.existsSync(fullDest) && fs.statSync(fullDest).size > 0;
    facultyList.push({
      id: f.id,
      name: f.name,
      designation: f.designation,
      qualification: f.qualification,
      departmentId: f.departmentId,
      department: 'Department of Computer Applications (BCA / MCA)',
      programmeType: f.programmeType, // 'ug' or 'pg'
      programmeCode: f.programmeCode, // 'BCA' or 'MCA'
      photoUrl: exists ? f.localFile : null,
      photoVerified: exists
    });
  });

  fs.writeFileSync(facultyJsonPath, JSON.stringify(facultyList, null, 2));

  // Sync with academicsHierarchyData.json
  const hierarchyPath = path.join(ROOT_DIR, 'src/data/academicsHierarchyData.json');
  const hierarchy = JSON.parse(fs.readFileSync(hierarchyPath, 'utf8'));
  hierarchy.faculty = facultyList;
  fs.writeFileSync(hierarchyPath, JSON.stringify(hierarchy, null, 2));

  console.log(`=== UPDATED MASTER FACULTY WITH ${allFaculty.length} MCA & BCA STAFF ===`);
}

run();
