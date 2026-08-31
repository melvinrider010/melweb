const fs = require('fs');

const BSC_BA_PROGRAMMES = {
  'bsc': {
    id: 'bsc',
    aliases: ['bsc', 'b-sc', 'bachelor-of-science', 'b.sc'],
    code: 'B.Sc',
    title: 'Bachelor of Science (B.Sc - Physical & Biological Sciences)',
    shortTitle: 'Bachelor of Science',
    degree: 'Bachelor of Science (NEP 2020)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Physical, Chemical & Biological Sciences',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP)',
    eligibility: 'Pass in 10+2 / Pre-University Examination (PUC) with Science subjects (Physics, Chemistry, Mathematics / Biology / Biotechnology / Computer Science) with minimum 45% aggregate (40% for SC/ST).',
    department: 'Department of Physical & Biological Sciences',
    deptSlug: 'physics',
    deptId: 'physics',
    image: '/assets/programmes/ug/b-sc.jpg',
    overview: 'The Bachelor of Science (B.Sc) at St. Philomena\'s College is an autonomous NEP 2020 multidisciplinary degree offering cutting-edge laboratory training across Physical Sciences (Physics, Chemistry, Mathematics, Computer Science, Electronics) and Biological Sciences (Biochemistry, Biotechnology, Botany, Zoology, Food Science & Nutrition).',
    objectives: [
      'Provide rigorous theoretical knowledge and hands-on laboratory mastery in fundamental and applied sciences.',
      'Foster analytical scientific inquiry, data analysis, research methodology, and computational modeling.',
      'Prepare graduates for prestigious postgraduate research (M.Sc, Integrated Ph.D.) and high-growth industry careers in pharmaceuticals, data science, biotechnology, and analytics.'
    ],
    disciplines: [
      { name: 'Physical Sciences Combinations', desc: 'PCM (Physics, Chemistry, Maths), PMC (Physics, Maths, Computer Science), PME (Physics, Maths, Electronics), CME (Computer Science, Maths, Electronics).' },
      { name: 'Biological Sciences Combinations', desc: 'CBZ (Chemistry, Botany, Zoology), BCH (Biochemistry, Chemistry, Human Nutrition), BtCZ (Biotech, Chemistry, Zoology), BtCB (Biotech, Chemistry, Botany).' },
      { name: 'Advanced Laboratory Experiments', desc: 'Hands-on practicals in spectroscopy, chromatography, wet chemistry, digital electronics, and microbial cell culture.' },
      { name: 'Research Project & Internship', desc: 'Mandatory undergraduate capstone research dissertation and industrial training in Semesters 5 and 6.' }
    ],
    curriculumHighlights: [
      'DBT Star College supported advanced instrumentation laboratories.',
      'DST-FIST funded research centers and high-precision analytical equipment.',
      'Active student scientific clubs: Newton Physics Club, Curie Chemistry Forum, Ramanujan Mathematics Society.'
    ],
    careerOpportunities: [
      'Scientific Research Assistant & Laboratory Analyst',
      'Pharmaceutical, Chemical & Quality Control Specialist',
      'Software Developer & Data Analyst (for PMC/CME graduates)',
      'Biotech & Food Quality Assurance Officer',
      'Higher Studies: M.Sc in Physics, Chemistry, Mathematics, Biotech, Data Science'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['pcm', 'pmc', 'cbz', 'bch']
  },
  'ba': {
    id: 'ba',
    aliases: ['ba', 'b-a', 'bachelor-of-arts', 'b.a'],
    code: 'BA',
    title: 'Bachelor of Arts (BA - Humanities & Social Sciences)',
    shortTitle: 'Bachelor of Arts',
    degree: 'Bachelor of Arts (NEP 2020)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Humanities & Social Sciences',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP)',
    eligibility: 'Pass in 10+2 / Pre-University Examination (PUC) in Arts, Science, or Commerce stream recognized by University of Mysore.',
    department: 'Department of Humanities & Social Sciences',
    deptSlug: 'humanities',
    deptId: 'humanities',
    image: '/assets/programmes/ug/ba.jpg',
    overview: 'The Bachelor of Arts (BA) program provides a multi-disciplinary liberal arts education designed to develop critical inquiry, socio-economic analysis, historical understanding, philosophical clarity, and journalistic communication.',
    objectives: [
      'Cultivate critical understanding of social structures, economic policies, governance, and human psychology.',
      'Develop sharp communicative, research, and argumentative writing skills.',
      'Equip students for competitive civil services (UPSC / KPSC), media journalism, public policy, and academic teaching.'
    ],
    disciplines: [
      { name: 'Economics & Public Policy', desc: 'Macroeconomics, development economics, Indian financial systems, and econometrics.' },
      { name: 'Sociology & Social Transformation', desc: 'Sociological theories, Indian social problems, urban-rural development, and research methods.' },
      { name: 'Political Science & Governance', desc: 'Indian constitution, political theory, international relations, and public administration.' },
      { name: 'Journalism & Mass Media', desc: 'Print journalism, broadcast media, digital content creation, and public relations.' }
    ],
    curriculumHighlights: [
      'Comprehensive preparation and mentoring forum for UPSC / KPSC civil service aspirants.',
      'Field survey research in rural and urban development sectors.',
      'Active social science forums: Kautilya Economics Club and Philo Media Cell.'
    ],
    careerOpportunities: [
      'Civil Services (IAS / IPS / KAS) & Public Administration',
      'Print, Broadcast & Digital Media Journalism',
      'Policy Research & Non-Governmental Organizations (NGOs)',
      'Human Resources & Corporate Public Relations',
      'Higher Studies: MA in Economics, English, Mass Communication, MSW, Law (LLB)'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['esp', 'jps', 'bsw', 'english']
  }
};

let progContent = fs.readFileSync('src/data/programmeDetailsData.js', 'utf8');

const closingBraceIdx = progContent.lastIndexOf('};\n\n// Normalized lookup');
if (closingBraceIdx !== -1) {
  let toAppend = '';
  for (const [key, prog] of Object.entries(BSC_BA_PROGRAMMES)) {
    if (!progContent.includes(`'${key}': {`)) {
      toAppend += `,\n  '${key}': ${JSON.stringify(prog, null, 4)}`;
    }
  }
  progContent = progContent.substring(0, closingBraceIdx) + toAppend + '\n};\n\n' + progContent.substring(closingBraceIdx + 4);
  fs.writeFileSync('src/data/programmeDetailsData.js', progContent, 'utf8');
  console.log('Added bsc and ba to programmeDetailsData.js');
}
