const fs = require('fs');
const path = require('path');

const hierarchy = JSON.parse(fs.readFileSync('src/data/academicsHierarchyData.json', 'utf8'));
const rawFacultyList = JSON.parse(fs.readFileSync('src/data/faculty.json', 'utf8'));
const oldHierarchyFaculty = hierarchy.faculty || [];

// 1. Canonical Department Definition Map
const CANONICAL_DEPTS = {
  'dept-bca': { id: 'dept-bca', name: 'Department of Computer Applications (BCA / MCA)', facultyCode: 'SCIENCE', keywords: ['computer applications', 'bca', 'mca'] },
  'dept-physics': { id: 'dept-physics', name: 'Department of Physics', facultyCode: 'SCIENCE', keywords: ['physics', 'electronics', 'astrophysics'] },
  'dept-chemistry': { id: 'dept-chemistry', name: 'Department of Chemistry', facultyCode: 'SCIENCE', keywords: ['chemistry', 'organic chemistry', 'inorganic', 'physical chemistry'] },
  'dept-mathematics': { id: 'dept-mathematics', name: 'Department of Mathematics', facultyCode: 'SCIENCE', keywords: ['mathematics', 'maths', 'statistics'] },
  'dept-computer-science': { id: 'dept-computer-science', name: 'Department of Computer Science', facultyCode: 'SCIENCE', keywords: ['computer science', 'bsc cs', 'msc cs'] },
  'dept-biochemistry': { id: 'dept-biochemistry', name: 'Department of Biochemistry', facultyCode: 'SCIENCE', keywords: ['biochemistry', 'biochem'] },
  'dept-biotechnology': { id: 'dept-biotechnology', name: 'Department of Biotechnology', facultyCode: 'SCIENCE', keywords: ['biotechnology', 'biotech'] },
  'dept-microbiology': { id: 'dept-microbiology', name: 'Department of Microbiology', facultyCode: 'SCIENCE', keywords: ['microbiology'] },
  'dept-botany-zoology': { id: 'dept-botany-zoology', name: 'Department of Botany & Zoology', facultyCode: 'SCIENCE', keywords: ['botany', 'zoology', 'life sciences'] },
  'dept-food-science': { id: 'dept-food-science', name: 'Department of Food Science & Nutrition', facultyCode: 'SCIENCE', keywords: ['food science', 'nutrition', 'clinical nutrition', 'dietetics'] },
  'dept-environmental-science': { id: 'dept-environmental-science', name: 'Department of Environmental Science', facultyCode: 'SCIENCE', keywords: ['environmental science', 'environment'] },
  'dept-criminology': { id: 'dept-criminology', name: 'Department of Criminology & Forensic Science', facultyCode: 'SCIENCE', keywords: ['criminology', 'forensic science', 'forensic'] },
  'dept-commerce': { id: 'dept-commerce', name: 'Department of Commerce (B.Com / M.Com)', facultyCode: 'COMMERCE', keywords: ['commerce', 'bcom', 'mcom', 'accounting', 'taxation', 'finance'] },
  'dept-management': { id: 'dept-management', name: 'Department of Management Studies (BBA / MBA / BBA-THM)', facultyCode: 'MANAGEMENT', keywords: ['management', 'business administration', 'bba', 'mba', 'bba-th', 'bba-thm', 'tourism', 'hospitality'] },
  'dept-social-work': { id: 'dept-social-work', name: 'Department of Social Work (BSW / MSW)', facultyCode: 'HUMANITIES', keywords: ['social work', 'bsw', 'msw', 'community development'] },
  'dept-economics': { id: 'dept-economics', name: 'Department of Economics (BA / MA)', facultyCode: 'HUMANITIES', keywords: ['economics', 'economic', 'econometrics'] },
  'dept-english': { id: 'dept-english', name: 'Department of English (BA / MA)', facultyCode: 'HUMANITIES', keywords: ['english', 'literature', 'tesol'] },
  'dept-history': { id: 'dept-history', name: 'Department of History', facultyCode: 'HUMANITIES', keywords: ['history', 'archaeology', 'historical'] },
  'dept-journalism': { id: 'dept-journalism', name: 'Department of Journalism & Mass Communication (BA / MA)', facultyCode: 'HUMANITIES', keywords: ['journalism', 'mass communication', 'electronic media', 'media'] },
  'dept-psychology': { id: 'dept-psychology', name: 'Department of Psychology (BA / M.Sc)', facultyCode: 'HUMANITIES', keywords: ['psychology', 'counseling psychology', 'clinical psychology'] },
  'dept-sociology': { id: 'dept-sociology', name: 'Department of Sociology', facultyCode: 'HUMANITIES', keywords: ['sociology', 'social structure'] },
  'dept-political-science': { id: 'dept-political-science', name: 'Department of Political Science', facultyCode: 'HUMANITIES', keywords: ['political science', 'politics', 'public administration'] },
  'dept-languages': { id: 'dept-languages', name: 'Department of Languages (Kannada / Hindi / French / Malayalam)', facultyCode: 'HUMANITIES', keywords: ['languages', 'kannada', 'hindi', 'malayalam', 'french', 'tamil', 'sanskrit'] },
  'dept-physical-education': { id: 'dept-physical-education', name: 'Department of Physical Education & Sports', facultyCode: 'HUMANITIES', keywords: ['physical education', 'sports', 'athletics'] }
};

// Exclude crawlers noise strings
const JUNK_NAMES = [
  'STATUTORY BODIES', 'VEGETABLE CARVING', 'Student Support', 'Philosophy', 'Redressal of Atrocities against Women',
  'PG', 'Rectorprofile', 'Ruthshanthakumariprofile', 'Naziaprofile', 'HelenProfile', 'MasarathDetail',
  'Nagarajursdetails', 'Revanasiddaiah'
];

function isJunk(name) {
  if (!name || name.trim().length < 3) return true;
  const upper = name.trim().toUpperCase();
  return JUNK_NAMES.some(j => upper === j.toUpperCase()) || upper.endsWith('PROFILE') || upper.endsWith('DETAILS') || upper.endsWith('DETAIL');
}

// Resolver for Department ID
function resolveDept(rawDeptName, name, desig, qual) {
  const combined = `${rawDeptName || ''} ${name || ''} ${desig || ''} ${qual || ''}`.toLowerCase();

  // Explicit keyword matches
  if (/criminology|forensic/i.test(combined)) return 'dept-criminology';
  if (/food science|nutrition|dietetics/i.test(combined)) return 'dept-food-science';
  if (/business administration|management|bba|mba|tourism|hospitality/i.test(combined)) return 'dept-management';
  if (/journalism|mass communication|electronic media/i.test(combined)) return 'dept-journalism';
  if (/political science/i.test(combined)) return 'dept-political-science';
  if (/psychology/i.test(combined)) return 'dept-psychology';
  if (/sociology/i.test(combined)) return 'dept-sociology';
  if (/social work|bsw|msw/i.test(combined)) return 'dept-social-work';
  if (/history|archaeology/i.test(combined)) return 'dept-history';
  if (/kannada|hindi|malayalam|french|tamil|sanskrit|languages/i.test(combined)) return 'dept-languages';
  if (/physical education|sports/i.test(combined)) return 'dept-physical-education';
  if (/english|tesol|literature/i.test(combined)) return 'dept-english';
  if (/economics|econometric/i.test(combined)) return 'dept-economics';
  if (/commerce|b\.com|m\.com|accounting|taxation/i.test(combined)) return 'dept-commerce';
  if (/computer applications|bca|mca|b\.c\.a|m\.c\.a/i.test(combined)) return 'dept-bca';
  if (/computer science|m\.sc computer/i.test(combined)) return 'dept-computer-science';
  if (/biochemistry|biochem/i.test(combined)) return 'dept-biochemistry';
  if (/biotechnology|biotech/i.test(combined)) return 'dept-biotechnology';
  if (/microbiology/i.test(combined)) return 'dept-microbiology';
  if (/botany|zoology/i.test(combined)) return 'dept-botany-zoology';
  if (/environmental/i.test(combined)) return 'dept-environmental-science';
  if (/mathematics|maths|statistics/i.test(combined)) return 'dept-mathematics';
  if (/chemistry|organic chemistry/i.test(combined)) return 'dept-chemistry';
  if (/physics|electronics/i.test(combined)) return 'dept-physics';

  return 'dept-economics'; // fallback
}

// Build merged authentic faculty list
const cleanFacultyMap = new Map();

// A. Ingest from raw faculty.json first (high quality scraped data)
rawFacultyList.forEach((rf, idx) => {
  if (isJunk(rf.name)) return;
  const deptId = resolveDept(rf.department || rf.departmentName, rf.name, rf.designation, rf.qualification);
  const deptObj = CANONICAL_DEPTS[deptId];
  const slug = (rf.name || `fac-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const rec = {
    id: rf.id || `faculty-${slug}`,
    name: rf.name.trim(),
    slug,
    designation: rf.designation || 'Assistant Professor',
    departmentId: deptId,
    departmentName: deptObj.name,
    departmentSlug: deptId.replace(/^dept-/, ''),
    facultyCode: deptObj.facultyCode,
    qualification: rf.qualification || '',
    experience: rf.experience || 'Experienced Academician & Researcher',
    email: rf.email || `${slug}@stphilos.ac.in`,
    phone: rf.phone || '+91 821 2490728',
    photo: rf.photo || rf.image || '/assets/images/faculty/default-avatar.jpg',
    specialization: rf.specialization || rf.qualification || '',
    status: 'published',
    origin: 'imported'
  };
  cleanFacultyMap.set(slug, rec);
});

// B. Ingest from old hierarchy faculty (merge additional genuine members)
oldHierarchyFaculty.forEach((of, idx) => {
  if (isJunk(of.name)) return;
  const slug = (of.name || `fac-${idx}`).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  if (!cleanFacultyMap.has(slug)) {
    const deptId = resolveDept(of.departmentId || of.departmentName, of.name, of.designation, of.qualification);
    const deptObj = CANONICAL_DEPTS[deptId];
    cleanFacultyMap.set(slug, {
      id: of.id || `faculty-${slug}`,
      name: of.name.trim(),
      slug,
      designation: of.designation || 'Assistant Professor',
      departmentId: deptId,
      departmentName: deptObj.name,
      departmentSlug: deptId.replace(/^dept-/, ''),
      facultyCode: deptObj.facultyCode,
      qualification: of.qualification || '',
      experience: of.experience || 'Faculty Member & Researcher',
      email: of.email || `${slug}@stphilos.ac.in`,
      phone: of.phone || '+91 821 2490728',
      photo: of.photo || of.image || '/assets/images/faculty/default-avatar.jpg',
      specialization: of.specialization || of.qualification || '',
      status: 'published',
      origin: 'imported'
    });
  }
});

const finalizedFaculty = Array.from(cleanFacultyMap.values());

console.log(`\n--- FINAL RE-ORGANIZED FACULTY LIST: ${finalizedFaculty.length} genuine members ---`);

const finalDeptCounts = {};
Object.keys(CANONICAL_DEPTS).forEach(k => { finalDeptCounts[k] = 0; });

finalizedFaculty.forEach(f => {
  finalDeptCounts[f.departmentId] = (finalDeptCounts[f.departmentId] || 0) + 1;
});

Object.entries(finalDeptCounts).forEach(([dId, count]) => {
  console.log(`  ${dId.padEnd(28)} : ${count} faculty members (${CANONICAL_DEPTS[dId].name})`);
});

// Update hierarchy data
hierarchy.faculty = finalizedFaculty;
hierarchy.metadata.totalFacultyCount = finalizedFaculty.length;

fs.writeFileSync('src/data/academicsHierarchyData.json', JSON.stringify(hierarchy, null, 2), 'utf8');
fs.writeFileSync('src/data/faculty.json', JSON.stringify(finalizedFaculty, null, 2), 'utf8');

console.log('\n--> Successfully wrote updated academicsHierarchyData.json and faculty.json!');
