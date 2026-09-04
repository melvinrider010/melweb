const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));

console.log('=== SEPARATING BCA-MCA FROM B.SC COMPUTER SCIENCE & GENERAL B.SC ===');

// 1. Ensure Department of Computer Applications (BCA) is distinct from Department of Computer Science (B.Sc / M.Sc)
const deptBca = {
  id: 'dept-bca',
  name: 'Department of Computer Applications (BCA)',
  shortName: 'Computer Applications (BCA)',
  facultyId: 'faculty-science',
  slug: 'bca',
  description: 'The Department of Computer Applications (BCA) delivers comprehensive, industry-aligned technical education in full-stack web software, cloud systems, and application frameworks, offering direct progression to the AICTE-approved MCA degree.',
  officialUrl: 'https://stphilos.ac.in/bca/',
  photoUrl: '/media/departments/dept-computer-science.jpg',
  photoVerified: true,
  ugProgrammes: ['bca'],
  pgProgrammes: ['mca'],
  pathways: [
    {
      id: 'path-bca-mca',
      from: 'bca',
      to: 'mca',
      title: 'BCA → MCA (Master of Computer Applications)',
      description: 'Seamless academic progression from undergraduate application development to postgraduate enterprise systems, cloud architectures, and AI engineering.'
    }
  ]
};

const deptCs = {
  id: 'dept-computer-science',
  name: 'Department of Computer Science (B.Sc / M.Sc)',
  shortName: 'Computer Science (B.Sc)',
  facultyId: 'faculty-science',
  slug: 'computer-science',
  description: 'The Department of Computer Science offers foundational and research-oriented computing education through B.Sc Computer Science and M.Sc Computer Science degrees.',
  officialUrl: 'https://stphilos.ac.in/department-of-computer-science/',
  photoUrl: '/media/departments/dept-computer-science.jpg',
  photoVerified: true,
  ugProgrammes: ['bsc-cs'],
  pgProgrammes: ['msc-cs'],
  pathways: [
    {
      id: 'path-bsc-msc-cs',
      from: 'bsc-cs',
      to: 'msc-cs',
      title: 'B.Sc Computer Science → M.Sc Computer Science',
      description: 'Theoretical computing and algorithmic research pathway leading to core systems programming, scientific computing, and data science.'
    }
  ]
};

// Update Departments list
const existingDepts = hierarchy.departments.filter(d => d.id !== 'dept-computer-science' && d.id !== 'dept-bca');
hierarchy.departments = [deptBca, deptCs, ...existingDepts];

// Update faculty departmentIds list in faculty-science
const facScience = hierarchy.faculties.find(f => f.id === 'faculty-science');
if (facScience) {
  facScience.departmentIds = [
    'dept-bca',
    'dept-computer-science',
    'dept-physics',
    'dept-chemistry',
    'dept-mathematics',
    'dept-biochemistry',
    'dept-biotechnology',
    'dept-microbiology',
    'dept-botany-zoology',
    'dept-food-science',
    'dept-psychology',
    'dept-environmental-science',
    'dept-criminology'
  ];
}

// Ensure BCA programme is mapped to dept-bca
const progBca = hierarchy.programmes.find(p => p.id === 'bca');
if (progBca) {
  progBca.departmentId = 'dept-bca';
  progBca.department = 'Department of Computer Applications (BCA)';
  progBca.deptSlug = 'bca';
  progBca.relatedUgProgrammeIds = ['bvoc-it'];
  progBca.relatedPgProgrammeIds = ['mca'];
  progBca.progressionPathway = [
    {
      targetDegree: 'Master of Computer Applications (MCA)',
      targetId: 'mca',
      institution: "St. Philomena's College (Autonomous)",
      eligibilityNote: 'Direct eligibility for BCA graduates with 50%+ aggregate in degree.',
      careerAdvantage: 'Software Architect, Senior Full-Stack Engineer, AI Systems Lead.'
    }
  ];
}

// Ensure MCA is mapped to dept-bca
const progMca = hierarchy.programmes.find(p => p.id === 'mca');
if (progMca) {
  progMca.departmentId = 'dept-bca';
  progMca.department = 'Department of Computer Applications (BCA / MCA)';
  progMca.deptSlug = 'bca';
  progMca.relatedUgProgrammeIds = ['bca'];
  progMca.relatedPgProgrammeIds = [];
}

// Ensure B.Sc CS is in programmes
let progBscCs = hierarchy.programmes.find(p => p.id === 'bsc-cs');
if (!progBscCs) {
  progBscCs = {
    id: 'bsc-cs',
    code: 'B.Sc CS',
    title: 'B.Sc in Computer Science',
    degree: 'Bachelor of Science in Computer Science',
    level: 'Undergraduate',
    type: 'ug',
    stream: 'Science & Computing',
    duration: '3 Years (6 Semesters) / 4 Years (Honours)',
    departmentId: 'dept-computer-science',
    department: 'Department of Computer Science (B.Sc / M.Sc)',
    deptSlug: 'computer-science',
    eligibility: 'Pass in 10+2 / PUC with Mathematics and Physics / Computer Science.',
    overview: 'In-depth undergraduate Bachelor of Science degree combining mathematical foundations, theoretical computer science, compiler design, and algorithmic analysis.',
    officialUrl: 'https://stphilos.ac.in/department-of-computer-science/',
    relatedUgProgrammeIds: ['bsc-physics', 'bsc-mathematics'],
    relatedPgProgrammeIds: ['msc-cs'],
    progressionPathway: [
      {
        targetDegree: 'M.Sc in Computer Science',
        targetId: 'msc-cs',
        institution: "St. Philomena's College (Autonomous)",
        eligibilityNote: 'Direct progression for B.Sc Computer Science majors.',
        careerAdvantage: 'Computer Systems Researcher, Data Scientist, Systems Architect.'
      }
    ]
  };
  hierarchy.programmes.push(progBscCs);
}

// Ensure M.Sc CS is in programmes
let progMscCs = hierarchy.programmes.find(p => p.id === 'msc-cs');
if (!progMscCs) {
  progMscCs = {
    id: 'msc-cs',
    code: 'M.Sc CS',
    title: 'M.Sc in Computer Science',
    degree: 'Master of Science in Computer Science',
    level: 'Postgraduate',
    type: 'pg',
    stream: 'Science & Computing',
    duration: '2 Years (4 Semesters)',
    departmentId: 'dept-computer-science',
    department: 'Department of Computer Science (B.Sc / M.Sc)',
    deptSlug: 'computer-science',
    eligibility: 'B.Sc with Computer Science / Mathematics / Electronics with minimum 45% aggregate.',
    overview: 'Advanced postgraduate Master of Science degree in algorithms, distributed systems, high-performance computing, and machine learning research.',
    officialUrl: 'https://stphilos.ac.in/department-of-computer-science/',
    relatedUgProgrammeIds: ['bsc-cs'],
    relatedPgProgrammeIds: [],
    progressionPathway: []
  };
  hierarchy.programmes.push(progMscCs);
}

// Ensure B.Voc programmes are clearly in programmes
const bvocPrograms = [
  {
    id: 'bvoc-healthcare',
    code: 'B.Voc Healthcare',
    title: 'B.Voc in Healthcare Technology',
    degree: 'Bachelor of Vocation in Healthcare Technology',
    level: 'Undergraduate (Vocational)',
    type: 'ug',
    stream: 'Vocational Studies',
    duration: '3 Years (6 Semesters)',
    departmentId: 'dept-vocational-studies',
    department: 'Department of Vocational Studies (B.Voc)',
    deptSlug: 'vocational-studies',
    eligibility: 'Pass in 10+2 / PUC in any stream.',
    overview: 'UGC-approved vocational program in medical laboratory technology, biomedical instrumentation, and clinical healthcare operations.',
    officialUrl: 'https://stphilos.ac.in/b-voc/',
    relatedUgProgrammeIds: ['bvoc-media-entertainment', 'bvoc-it', 'bvoc-hospitality'],
    relatedPgProgrammeIds: [],
    progressionPathway: []
  },
  {
    id: 'bvoc-media-entertainment',
    code: 'B.Voc Media',
    title: 'B.Voc in Media & Entertainment',
    degree: 'Bachelor of Vocation in Media & Entertainment',
    level: 'Undergraduate (Vocational)',
    type: 'ug',
    stream: 'Vocational Studies',
    duration: '3 Years (6 Semesters)',
    departmentId: 'dept-vocational-studies',
    department: 'Department of Vocational Studies (B.Voc)',
    deptSlug: 'vocational-studies',
    eligibility: 'Pass in 10+2 / PUC in any stream.',
    overview: 'Hands-on practical training in digital cinematography, audio engineering, video editing, and broadcast television studio production.',
    officialUrl: 'https://stphilos.ac.in/b-voc/',
    relatedUgProgrammeIds: ['bvoc-healthcare', 'ba-journalism'],
    relatedPgProgrammeIds: ['ma-journalism'],
    progressionPathway: [
      {
        targetDegree: 'M.A in Journalism & Mass Communication',
        targetId: 'ma-journalism',
        institution: "St. Philomena's College (Autonomous)",
        eligibilityNote: 'Direct progression for B.Voc Media graduates.',
        careerAdvantage: 'Senior Broadcast Producer, Media Director, Investigative Journalist.'
      }
    ]
  },
  {
    id: 'bvoc-it',
    code: 'B.Voc IT',
    title: 'B.Voc in Information Technology & Software',
    degree: 'Bachelor of Vocation in Information Technology',
    level: 'Undergraduate (Vocational)',
    type: 'ug',
    stream: 'Vocational Studies',
    duration: '3 Years (6 Semesters)',
    departmentId: 'dept-vocational-studies',
    department: 'Department of Vocational Studies (B.Voc)',
    deptSlug: 'vocational-studies',
    eligibility: 'Pass in 10+2 / PUC with Mathematics / Computer Science.',
    overview: 'Vocational training in cloud infrastructure, web development, network administration, and IT technical support operations.',
    officialUrl: 'https://stphilos.ac.in/b-voc/',
    relatedUgProgrammeIds: ['bca', 'bsc-cs'],
    relatedPgProgrammeIds: ['mca'],
    progressionPathway: [
      {
        targetDegree: 'Master of Computer Applications (MCA)',
        targetId: 'mca',
        institution: "St. Philomena's College (Autonomous)",
        eligibilityNote: 'Eligible for MCA admission upon graduation.',
        careerAdvantage: 'Full Stack Enterprise Engineer, Cloud Infrastructure Architect.'
      }
    ]
  },
  {
    id: 'bvoc-hospitality',
    code: 'B.Voc Hospitality',
    title: 'B.Voc in Hospitality Management',
    degree: 'Bachelor of Vocation in Hospitality Management',
    level: 'Undergraduate (Vocational)',
    type: 'ug',
    stream: 'Vocational Studies',
    duration: '3 Years (6 Semesters)',
    departmentId: 'dept-vocational-studies',
    department: 'Department of Vocational Studies (B.Voc)',
    deptSlug: 'vocational-studies',
    eligibility: 'Pass in 10+2 / PUC in any stream.',
    overview: 'Comprehensive hotel management, food & beverage service, culinary arts, front office operations, and hospitality business administration.',
    officialUrl: 'https://stphilos.ac.in/b-voc/',
    relatedUgProgrammeIds: ['bba-thm', 'bba'],
    relatedPgProgrammeIds: ['mba'],
    progressionPathway: [
      {
        targetDegree: 'Master of Business Administration (MBA)',
        targetId: 'mba',
        institution: "St. Philomena's College (Autonomous)",
        eligibilityNote: 'Eligible through PGCET / KMAT.',
        careerAdvantage: 'Hospitality General Manager, Tourism Director.'
      }
    ]
  }
];

for (const bvoc of bvocPrograms) {
  const existingIdx = hierarchy.programmes.findIndex(p => p.id === bvoc.id);
  if (existingIdx >= 0) {
    hierarchy.programmes[existingIdx] = bvoc;
  } else {
    hierarchy.programmes.push(bvoc);
  }
}

// Update faculty in BCA (HOD Mrs. E Gloriya Priyadarshini, etc.)
hierarchy.faculty.forEach(f => {
  if (f.departmentId === 'dept-computer-science') {
    // Keep BCA faculty in dept-bca
    if (/gloriya|masarath|archana|sandra|lydia|harshitha|ajay|priyanka|lenard|judith|suhana|shruthi|nayana/i.test(f.name)) {
      f.departmentId = 'dept-bca';
    }
  }
});

// Save updated files
fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'departments.json'), JSON.stringify(hierarchy.departments, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'programs.json'), JSON.stringify(hierarchy.programmes, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(hierarchy.faculty, null, 2));

console.log('=== SEPARATION COMPLETED SUCCESSFULLY ===');
console.log(`Total Departments: ${hierarchy.departments.length}`);
console.log(`Total Programmes: ${hierarchy.programmes.length}`);
console.log(`BCA Department: [${deptBca.id}] (${deptBca.name})`);
console.log(`B.Sc CS Department: [${deptCs.id}] (${deptCs.name})`);
