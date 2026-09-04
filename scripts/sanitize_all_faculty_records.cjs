const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const exactFaculty = JSON.parse(fs.readFileSync(path.join(__dirname, 'exact_official_cv_faculty.json'), 'utf8'));

console.log('=== SANITIZING AND POLISHING ALL FACULTY RECORDS ===');

function cleanDesignation(des) {
  let d = (des || '').trim();
  d = d.replace(/,\s*/g, ' & ');
  d = d.replace(/\s+/g, ' ');
  d = d.replace(/proffessor/gi, 'Professor');
  d = d.replace(/asst\.?\s*prof\.?/gi, 'Assistant Professor');
  d = d.replace(/assoc\.?\s*prof\.?/gi, 'Associate Professor');
  d = d.replace(/hod/gi, 'HOD');
  if (/assistant professor/i.test(d) && /hod/i.test(d)) {
    return 'HOD & Assistant Professor';
  }
  if (/associate professor/i.test(d) && /hod/i.test(d)) {
    return 'HOD & Associate Professor';
  }
  if (/associate professor/i.test(d)) return 'Associate Professor';
  if (/assistant professor/i.test(d)) return 'Assistant Professor';
  if (/professor/i.test(d)) return 'Professor';
  if (/director/i.test(d)) return 'Director of Physical Education & Sports';
  if (/instructor/i.test(d)) return 'Instructor';
  return d || 'Assistant Professor';
}

function cleanQualification(qual) {
  let q = (qual || '').trim();
  q = q.replace(/philophy/gi, 'Philosophy');
  q = q.replace(/mth\s*\(/gi, 'M.Th. (');
  q = q.replace(/\bm\.?com\.?\b/gi, 'M.Com.');
  q = q.replace(/\bm\.?sc\.?\b/gi, 'M.Sc.');
  q = q.replace(/\bm\.?a\.?\b/gi, 'M.A.');
  q = q.replace(/\bph\.?d\.?\b/gi, 'Ph.D.');
  q = q.replace(/persuing|persueing/gi, 'Pursuing');
  q = q.replace(/\bb\.?ed\.?\b/gi, 'B.Ed.');
  q = q.replace(/\bm\.?ed\.?\b/gi, 'M.Ed.');
  q = q.replace(/Masters in/gi, 'Masters in');
  q = q.replace(/\s+/g, ' ');
  return q || 'M.Sc.';
}

function mapDept(f) {
  const name = f.name.toLowerCase();
  const deptText = (f.departmentText || '').toLowerCase();

  // Specific overrides
  if (name.includes('richard menezes')) return 'dept-psychology';
  if (name.includes('hencieta fernandes')) return 'dept-computer-science';
  if (name.includes('kunal')) return 'dept-physics'; // Electronics
  if (name.includes('ranjith')) return 'dept-management'; // Bakery instructor / BBATH
  if (name.includes('peria nayagammal')) return 'dept-social-work'; // Sports & Physical Ed

  if (deptText.includes('biochem')) return 'dept-biochemistry';
  if (deptText.includes('economic')) return 'dept-economics';
  if (deptText.includes('physics')) return 'dept-physics';
  if (deptText.includes('chemistry')) return 'dept-chemistry';
  if (deptText.includes('mathematics') || deptText.includes('maths')) return 'dept-mathematics';
  if (deptText === 'bca' || deptText === 'mca' || deptText.includes('computer application')) return 'dept-bca';
  if (deptText.includes('computer science') || deptText.includes('cs') || deptText === 'pg') return 'dept-computer-science';
  if (deptText.includes('mba') || deptText.includes('bba') || deptText.includes('management') || deptText.includes('tourism') || deptText.includes('bbath')) return 'dept-management';
  if (deptText.includes('commerce') || deptText.includes('mcom') || deptText.includes('m.com')) return 'dept-commerce';
  if (deptText.includes('social work') || deptText.includes('msw') || deptText.includes('bsw')) return 'dept-social-work';
  if (deptText.includes('english')) return 'dept-english';
  if (deptText.includes('journalism') || deptText.includes('mass communication')) return 'dept-journalism';
  if (deptText.includes('biotech')) return 'dept-biotechnology';
  if (deptText.includes('microbio')) return 'dept-microbiology';
  if (deptText.includes('zoology') || deptText.includes('botany')) return 'dept-botany-zoology';
  if (deptText.includes('food science') || deptText.includes('nutrition')) return 'dept-food-science';
  if (deptText.includes('psychology')) return 'dept-psychology';
  if (deptText.includes('criminology') || deptText.includes('forensic')) return 'dept-criminology';
  if (deptText.includes('environmental')) return 'dept-environmental-science';
  if (deptText.includes('political')) return 'dept-political-science';
  if (deptText.includes('sociology')) return 'dept-sociology';
  if (deptText.includes('history')) return 'dept-history';
  if (deptText.includes('kannada') || deptText.includes('hindi') || deptText.includes('malayalam') || deptText.includes('christianity') || deptText.includes('tamil')) return 'dept-languages';
  if (deptText.includes('b.voc') || deptText.includes('bvoc') || deptText.includes('vocational') || deptText.includes('healthcare') || deptText.includes('media and entertainment')) return 'dept-vocational-studies';

  return 'dept-bca';
}

const cleanedFacultyList = [];
const seen = new Set();

for (const f of exactFaculty) {
  const normKey = f.name.toLowerCase().replace(/[^a-z]/g, '');
  if (seen.has(normKey)) continue;
  seen.add(normKey);

  const deptId = mapDept(f);
  const deptObj = hierarchy.departments.find(d => d.id === deptId);

  // Normalize name
  let cleanName = f.name.trim();
  cleanName = cleanName.replace(/\s+/g, ' ');
  if (cleanName.toLowerCase() === 'fr richard menezes') cleanName = 'Fr. Richard Menezes';
  if (cleanName.toLowerCase() === 'saritarawat') cleanName = 'Dr. Sarita Rawat';
  if (cleanName.toLowerCase() === 'dr.divakara n') cleanName = 'Dr. Divakara N';
  if (cleanName.toLowerCase() === 'mr.anand c') cleanName = 'Mr. Anand C';

  const cleanDes = cleanDesignation(f.designation);
  const cleanQual = cleanQualification(f.qualification);

  cleanedFacultyList.push({
    id: `fac_${normKey.substring(0, 25)}`,
    name: cleanName,
    designation: cleanDes,
    qualification: cleanQual,
    departmentId: deptId,
    officialProfileUrl: f.officialUrl || 'https://stphilos.ac.in/',
    photoUrl: null,
    photoVerified: false,
    bio: `${cleanName} is a faculty member (${cleanDes}) in the ${deptObj?.name || 'Department'} at St. Philomena's College (Autonomous), Mysuru.`
  });
}

// Preserve any verified portrait photos that exist
const existingFacMap = new Map((hierarchy.faculty || []).map(ef => [ef.id, ef]));
cleanedFacultyList.forEach(f => {
  if (existingFacMap.has(f.id)) {
    const ef = existingFacMap.get(f.id);
    if (ef.photoUrl && ef.photoVerified) {
      f.photoUrl = ef.photoUrl;
      f.photoVerified = true;
    }
  }
});

console.log(`Cleaned and polished ${cleanedFacultyList.length} faculty profiles.`);

// Save to academicsHierarchyData.json and faculty.json
hierarchy.faculty = cleanedFacultyList;
fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(cleanedFacultyList, null, 2));

console.log('\n=== POLISHED SAMPLES ===');
cleanedFacultyList.filter(f => /richard|hencieta|felan|sachin|gloriya/i.test(f.name)).forEach(f => {
  console.log(` - "${f.name}" | Desig: "${f.designation}" | Qual: "${f.qualification}" | Dept: [${f.departmentId}]`);
});
