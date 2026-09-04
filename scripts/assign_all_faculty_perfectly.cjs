const fs = require('fs');

const hierarchy = JSON.parse(fs.readFileSync('src/data/academicsHierarchyData.json', 'utf8'));
const facultyList = hierarchy.faculty || [];

const JUNK = [
  'Anti Ragging', 'STATUTORY BODIES', 'VEGETABLE CARVING', 'Student Support', 'Philosophy', 
  'Redressal of Atrocities against Women', 'PG', 'Rectorprofile', 'Ruthshanthakumariprofile', 
  'Naziaprofile', 'HelenProfile', 'MasarathDetail', 'Nagarajursdetails', 'Revanasiddaiah'
];

const DEPT_DEFINITIONS = {
  'dept-bca': 'Department of Computer Applications (BCA / MCA)',
  'dept-physics': 'Department of Physics',
  'dept-chemistry': 'Department of Chemistry',
  'dept-mathematics': 'Department of Mathematics',
  'dept-computer-science': 'Department of Computer Science',
  'dept-biochemistry': 'Department of Biochemistry',
  'dept-biotechnology': 'Department of Biotechnology',
  'dept-microbiology': 'Department of Microbiology',
  'dept-botany-zoology': 'Department of Botany & Zoology',
  'dept-food-science': 'Department of Food Science & Nutrition',
  'dept-environmental-science': 'Department of Environmental Science',
  'dept-criminology': 'Department of Criminology & Forensic Science',
  'dept-commerce': 'Department of Commerce (B.Com / M.Com)',
  'dept-management': 'Department of Management Studies (BBA / MBA / BBA-THM)',
  'dept-social-work': 'Department of Social Work (BSW / MSW)',
  'dept-economics': 'Department of Economics (BA / MA)',
  'dept-english': 'Department of English (BA / MA)',
  'dept-history': 'Department of History',
  'dept-journalism': 'Department of Journalism & Mass Communication (BA / MA)',
  'dept-psychology': 'Department of Psychology (BA / M.Sc)',
  'dept-sociology': 'Department of Sociology',
  'dept-political-science': 'Department of Political Science',
  'dept-languages': 'Department of Languages (Kannada / Hindi / French / Malayalam)',
  'dept-physical-education': 'Department of Physical Education & Sports'
};

const SPECIFIC_ASSIGNMENTS = {
  'agnes-sylvia-d-souza-agnes': 'dept-chemistry',
  'dr-angelina': 'dept-microbiology',
  'ms-dorothy-p': 'dept-botany-zoology',
  'dr-prashanth-d-a': 'dept-history',
  'dr-sarita-rawat': 'dept-languages',
  'dr-vinod-gubbiveeranna': 'dept-biochemistry',
  'gloriya-priyadarshini-e': 'dept-computer-science',
  'florita-bernadetie-alexander': 'dept-commerce',
  'kunal-a': 'dept-physics',
  'mr-hanock-a': 'dept-bca',
  'mr-raghu-ram-p-s': 'dept-bca',
  'ms-deeksha-n': 'dept-bca',
  'ms-varshini-s': 'dept-commerce',
  'supritha-r': 'dept-commerce',
  'ms-supritha-r': 'dept-commerce',
  'ms-vasantha-raghavan': 'dept-computer-science',
  'ms-reena-mol-v-u': 'dept-bca',
  'rev-dr-jose-joseph-svd': 'dept-languages',
  'ms-reena-joyce-j': 'dept-english',
  'ms-v-gouri-sulakshana': 'dept-criminology',
  'sowmyashree-m': 'dept-mathematics',
  'sujatha-devi-b': 'dept-mathematics',
  'ms-durgambika-k': 'dept-languages',
  'dr-asha-ms': 'dept-botany-zoology',
  'ms-lydiya-vandana': 'dept-english',
  'ms-deepthi-mj': 'dept-biotechnology',
  'dr-b-s-shivashankar': 'dept-history',
  'dr-manjula-m': 'dept-languages',
  'dr-sandhya-n-c': 'dept-chemistry',
  'dr-sowmya-p': 'dept-economics',
  'dr-yamuna-b-raj-m-a-ph-d': 'dept-economics',
  'fathimunnisa-begum': 'dept-botany-zoology',
  'ms-fathimunnisa-begum': 'dept-botany-zoology',
  'lokesh': 'dept-languages',
  'manasa': 'dept-languages',
  'mk-usha': 'dept-chemistry',
  'mr-a-t-sadebose': 'dept-political-science',
  'mr-babu-p': 'dept-languages',
  'mr-kunal-a': 'dept-physics',
  'mr-leyander-lobo': 'dept-commerce',
  'mr-mahendra-v-p': 'dept-history',
  'mr-prajwal-nr': 'dept-journalism',
  'mr-rini-brown': 'dept-english',
  'ms-rini-brown': 'dept-english',
  'mr-vidhyadhar-sanjay-nair': 'dept-english',
  'mr-vidyadhar-sanjay-nair': 'dept-english',
  'mr-william-joseph-j': 'dept-english',
  'ms-alvira-afsar-sulthana-a': 'dept-botany-zoology',
  'ms-amrutha-shankpal-a': 'dept-psychology',
  'ms-vincy-s': 'dept-physics',
  'ms-mary-irene-j': 'dept-chemistry',
  'ms-meenakshi-giridhar': 'dept-mathematics',
  'ms-meghana-sd': 'dept-biochemistry',
  'ms-navya-p': 'dept-biochemistry',
  'ms-namitha-s-n': 'dept-commerce',
  'ms-shruthi-hr': 'dept-chemistry',
  'ms-sowmya-n': 'dept-biotechnology',
  'ms-neena-p-k': 'dept-botany-zoology',
  'dr-oshma-rosette-pinto': 'dept-psychology',
  'dr-praveen-saldanha': 'dept-social-work',
  'shashikala-c': 'dept-languages',
  'suhan-poovaiah': 'dept-management',
  'fr-richard-menezes': 'dept-management',
  'mr-ginson-george': 'dept-social-work',
  'kavitha-r': 'dept-mathematics',
  'mrs-mary-niveditha': 'dept-english',
  'mrs-rashmi-vincia': 'dept-sociology',
  'mrs-sowmya-mathew': 'dept-biochemistry',
  'dr-prakash-arulappa': 'dept-history',
  'prashanth-d-a': 'dept-history',
  'mrs-peria-nayagammal-s': 'dept-physical-education',
  'ms-rao-nandita-jayaprakash': 'dept-psychology',
  'sr-vimal-angeline': 'dept-english'
};

const cleanList = [];

facultyList.forEach(f => {
  if (!f.name || JUNK.some(j => f.name.toLowerCase().includes(j.toLowerCase()))) {
    return;
  }

  let slug = (f.slug || f.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  let targetDeptId = SPECIFIC_ASSIGNMENTS[slug] || f.departmentId;

  if (!DEPT_DEFINITIONS[targetDeptId]) {
    targetDeptId = 'dept-economics';
  }

  const deptName = DEPT_DEFINITIONS[targetDeptId];

  cleanList.push({
    ...f,
    id: f.id || `faculty-${slug}`,
    slug,
    departmentId: targetDeptId,
    departmentName: deptName,
    departmentSlug: targetDeptId.replace(/^dept-/, ''),
    status: 'published'
  });
});

console.log('--- RE-ORGANIZED FACULTY COUNT BY DEPARTMENT ---');
const counts = {};
Object.keys(DEPT_DEFINITIONS).forEach(k => counts[k] = 0);
cleanList.forEach(f => {
  counts[f.departmentId] = (counts[f.departmentId] || 0) + 1;
});

Object.entries(counts).forEach(([dId, count]) => {
  console.log(`  ${dId.padEnd(28)} : ${count.toString().padStart(2, ' ')} faculty | ${DEPT_DEFINITIONS[dId]}`);
});

console.log('\nTotal Genuine Assigned Faculty:', cleanList.length);

hierarchy.faculty = cleanList;
hierarchy.metadata.totalFacultyCount = cleanList.length;

fs.writeFileSync('src/data/academicsHierarchyData.json', JSON.stringify(hierarchy, null, 2), 'utf8');
fs.writeFileSync('src/data/faculty.json', JSON.stringify(cleanList, null, 2), 'utf8');

console.log('\n--> Successfully reorganized and saved all faculty to academicsHierarchyData.json and faculty.json!');
