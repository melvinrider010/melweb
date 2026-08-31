const fs = require('fs');

const NEW_PROGRAMMES = {
  'english': {
    id: 'english',
    aliases: ['english', 'ug-english', 'optional-english', 'ba-english', 'eng'],
    code: 'ENGLISH',
    title: 'English Language & Literary Studies (UG)',
    shortTitle: 'English Literature',
    degree: 'Bachelor of Arts in English Literature & General English',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Languages & Humanities',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP)',
    eligibility: 'Pass in 10+2 / Pre-University Examination (PUC) in Arts, Science, or Commerce stream recognized by University of Mysore.',
    department: 'Department of English & Languages',
    deptSlug: 'english',
    deptId: 'english',
    image: '/assets/programmes/ug/english.jpg',
    overview: 'The Undergraduate English Programme at St. Philomena\'s College is an immersive exploration of British, Indian English, Post-Colonial, and World Literatures. The curriculum develops sharp critical thinking, creative writing proficiency, communicative phonetics, and cultural literacy.',
    objectives: [
      'Equip students with deep literary analysis skills and historical understanding of literary movements.',
      'Develop advanced fluency in academic writing, professional communication, and creative expression.',
      'Prepare graduates for careers in publishing, journalism, civil services, content strategy, and higher academic research.'
    ],
    disciplines: [
      { name: 'British & World Literature', desc: 'From Elizabethan drama and Romantic poetry to Modernist and Post-Modernist global prose.' },
      { name: 'Indian Writing in English & Translation', desc: 'Post-independence Indian fiction, Dalit writings, and regional literature in translation.' },
      { name: 'Linguistics & Phonetics', desc: 'Morphology, syntax, acoustic phonetics, and communicative language teaching methodologies.' },
      { name: 'Literary Criticism & Cultural Theory', desc: 'Structuralism, Post-colonialism, Feminist literary criticism, and Film Studies.' }
    ],
    curriculumHighlights: [
      'Annual National Literary Fest "Philofest" and inter-collegiate drama competitions.',
      'Creative Writing workshops mentored by published authors and journalists.',
      'Language Laboratory training with interactive phonetics software.'
    ],
    careerOpportunities: [
      'Journalism & Digital Media Publishing',
      'Content Strategy & Corporate Communications',
      'Civil Services & Administrative Careers',
      'Publishing Editor & Creative Writer',
      'Higher Studies: MA in English, Mass Communication, Law (LLB)'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ba', 'ma-eng', 'jps']
  },
  'kannada': {
    id: 'kannada',
    aliases: ['kannada', 'ug-kannada', 'kan', 'optional-kannada'],
    code: 'KANNADA',
    title: 'Kannada Language & Classical Literature (UG)',
    shortTitle: 'Kannada Studies',
    degree: 'Bachelor of Arts / Language Discipline Core',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Languages & Regional Heritage',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP)',
    eligibility: 'Pass in 10+2 / Pre-University Examination with Kannada as a subject or mother tongue.',
    department: 'Department of Languages & Kannada',
    deptSlug: 'kannada',
    deptId: 'kannada',
    image: '/assets/programmes/ug/kannada.jpg',
    overview: 'The Department of Kannada offers deep pedagogical immersion in Halegannada epics, Vachana Sahitya, Dasa Sahitya, modern Navodaya, Pragatisheela, and Bandaya literary movements.',
    objectives: [
      'Foster deep appreciation for Kannada linguistic heritage, epigraphy, and classical poetics.',
      'Develop creative writing and translation skills from Kannada to English and vice-versa.',
      'Prepare students for KPSC/UPSC examinations, media broadcasting, and academic teaching.'
    ],
    disciplines: [
      { name: 'Classical Kannada (Halegannada)', desc: 'Study of Pampa, Ranna, and medieval poetic meters (Chhandassu).' },
      { name: 'Vachana & Bhakti Sahitya', desc: 'Philosophical and socio-cultural analysis of 12th-century Sharana literature.' },
      { name: 'Modern Kannada Movements', desc: 'Navodaya, Navya, and Dalit-Bandaya literary paradigms and social critique.' },
      { name: 'Kannada Journalism & Translation', desc: 'Practical news writing, scriptwriting, and literary translation.' }
    ],
    curriculumHighlights: [
      'Vachana Gayana and Sahitya Sammelana workshops.',
      'Manuscriptology and epigraphy field visits to historic heritage sites in Karnataka.'
    ],
    careerOpportunities: [
      'Kannada Media & Television Journalism',
      'Karnataka State Civil Services (KPSC / KAS)',
      'Language Translation & Subtitling',
      'School & College Pedagogy'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ba', 'esp', 'english']
  },
  'hindi': {
    id: 'hindi',
    aliases: ['hindi', 'ug-hindi', 'hin'],
    code: 'HINDI',
    title: 'Hindi Language & Literature (UG)',
    shortTitle: 'Hindi Studies',
    degree: 'Bachelor of Arts / Language Elective',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Languages & Humanities',
    duration: '3 Years (6 Semesters)',
    eligibility: 'Pass in 10+2 / Pre-University Examination with Hindi as a subject or equivalent.',
    department: 'Department of Languages & Kannada',
    deptSlug: 'kannada',
    deptId: 'kannada',
    image: '/assets/programmes/ug/hindi.jpg',
    overview: 'Comprehensive study of modern Hindi prose, classical Bhaktikal poetry (Kabir, Surdas, Tulsidas), functional Hindi (Prayojanmoolak Hindi), and commercial translation.',
    objectives: [
      'Develop native fluency in spoken and written Hindi communication.',
      'Master administrative Hindi required for central government establishments and banking.'
    ],
    disciplines: [
      { name: 'Prachin & Madhyakalin Kavya', desc: 'Study of Kabir, Surdas, Tulsidas, and Meera Bhakti poetry.' },
      { name: 'Modern Hindi Fiction & Drama', desc: 'Novels and plays by Premchand, Jaishankar Prasad, and Mohan Rakesh.' },
      { name: 'Prayojanmoolak Hindi & Translation', desc: 'Official administrative correspondence, terminology, and translation techniques.' }
    ],
    curriculumHighlights: [
      'Hindi Diwas national symposia and debate competitions.',
      'Official language translation workshops.'
    ],
    careerOpportunities: [
      'Official Language Officer (Rajbhasha Adhikari) in Public Sector Banks',
      'Hindi Content Writer & Translator',
      'Media, Radio & Television Broadcasting'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ba', 'english', 'kannada']
  },
  'malayalam': {
    id: 'malayalam',
    aliases: ['malayalam', 'ug-malayalam'],
    code: 'MALAYALAM',
    title: 'Malayalam Language & Cultural Studies (UG)',
    shortTitle: 'Malayalam Studies',
    degree: 'Language Elective Curriculum',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Languages',
    duration: '2 to 3 Years',
    eligibility: 'Pass in 10+2 / Higher Secondary with Malayalam or recognized equivalent.',
    department: 'Department of Languages & Kannada',
    deptSlug: 'kannada',
    deptId: 'kannada',
    image: '/assets/programmes/ug/malayalam.jpg',
    overview: 'Detailed study of Kerala literary traditions, modern poetry, short fiction, theatre, and linguistic syntax.',
    objectives: ['Master literary appreciation of modern and classical Malayalam texts.'],
    disciplines: [
      { name: 'Modern Malayalam Poetry', desc: 'Works of Kumaran Asan, Vallathol, and contemporary poets.' },
      { name: 'Prose & Short Stories', desc: 'Analysis of Thakazhi, Basheer, and MT Vasudevan Nair.' }
    ],
    curriculumHighlights: ['Kerala cultural fest and literary discussions.'],
    careerOpportunities: ['Media Journalism in Kerala Press', 'Publishing & Translation'],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ba', 'english', 'tamil']
  },
  'tamil': {
    id: 'tamil',
    aliases: ['tamil', 'ug-tamil'],
    code: 'TAMIL',
    title: 'Tamil Classical Language & Literature (UG)',
    shortTitle: 'Tamil Studies',
    degree: 'Language Elective Curriculum',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Languages',
    duration: '2 to 3 Years',
    eligibility: 'Pass in 10+2 / HSC with Tamil or recognized equivalent.',
    department: 'Department of Languages & Kannada',
    deptSlug: 'kannada',
    deptId: 'kannada',
    image: '/assets/programmes/ug/tamil.jpg',
    overview: 'Exploration of Sangam poetry, Thirukkural moral philosophy, Silappadikaram epics, and modern Tamil fiction (Bharathiyar, Pudhumaipithan).',
    objectives: ['Equip students with classical Tamil linguistic roots and modern writing competence.'],
    disciplines: [
      { name: 'Sangam Literature & Poetics', desc: 'Akam and Puram poetic paradigms and Tolkappiyam grammar.' },
      { name: 'Modern Tamil Literature', desc: 'Twentieth-century short fiction, modern drama, and journalistic prose.' }
    ],
    curriculumHighlights: ['Thiruvalluvar Day literary debates and poetry recitations.'],
    careerOpportunities: ['Tamil Press & Digital Journalism', 'State Administrative Services'],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ba', 'kannada', 'english']
  },
  'urdu': {
    id: 'urdu',
    aliases: ['urdu', 'ug-urdu'],
    code: 'URDU',
    title: 'Urdu Language & Ghazal Literature (UG)',
    shortTitle: 'Urdu Studies',
    degree: 'Bachelor of Arts / Language Elective',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Languages',
    duration: '3 Years (6 Semesters)',
    eligibility: 'Pass in 10+2 / PUC with Urdu or equivalent qualification.',
    department: 'Department of Languages & Kannada',
    deptSlug: 'kannada',
    deptId: 'kannada',
    image: '/assets/programmes/ug/urdu.jpg',
    overview: 'Rigorous exploration of Urdu classical poetry (Mir Taqi Mir, Mirza Ghalib, Allama Iqbal, Faiz Ahmed Faiz), Dastan prose, and Nastaliq calligraphy.',
    objectives: ['Develop literary command over Urdu poetry, rhetoric, and modern fiction.'],
    disciplines: [
      { name: 'Classical Urdu Ghazal', desc: 'Metrics, symbolism, and philosophical dimensions of Ghalib and Iqbal.' },
      { name: 'Modern Urdu Afsana (Short Fiction)', desc: 'Narratives of Saadat Hasan Manto, Premchand, and Ismat Chughtai.' }
    ],
    curriculumHighlights: ['Annual Mehfil-e-Mushaira and calligraphy exhibitions.'],
    careerOpportunities: ['Urdu Journalism & Media', 'Translation & Cultural Heritage Documentation'],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ba', 'persian', 'arabic']
  },
  'french': {
    id: 'french',
    aliases: ['french', 'ug-french'],
    code: 'FRENCH',
    title: 'French Foreign Language & Francophone Studies (UG)',
    shortTitle: 'French Studies',
    degree: 'Foreign Language Elective (DELF A1/A2 Aligned)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Languages',
    duration: '2 to 3 Years',
    eligibility: 'Pass in 10+2 / PUC in any stream with interest in European languages.',
    department: 'Department of Languages & Kannada',
    deptSlug: 'kannada',
    deptId: 'kannada',
    image: '/assets/programmes/ug/french.jpg',
    overview: 'DELF-aligned communicative French program covering oral fluency, listening comprehension, grammar, and Francophone cultural history.',
    objectives: ['Achieve certified DELF A1/A2 communicative proficiency in French.'],
    disciplines: [
      { name: 'Communicative French & Phonetics', desc: 'Conversational fluency, role-playing, and pronunciation mastery.' },
      { name: 'Grammar & Professional Writing', desc: 'Sentence structures, business correspondence, and comprehension.' }
    ],
    curriculumHighlights: ['Francophonie Day celebrations and French cinema screenings.'],
    careerOpportunities: ['International Tourism & Hospitality', 'Multinational Corporations (MNCs)', 'Foreign Embassies & Translation'],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bba-th', 'english', 'bba']
  },
  'arabic': {
    id: 'arabic',
    aliases: ['arabic', 'ug-arabic'],
    code: 'ARABIC',
    title: 'Arabic Classical & Modern Standard Language (UG)',
    shortTitle: 'Arabic Studies',
    degree: 'Bachelor of Arts / Language Elective',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Languages',
    duration: '3 Years (6 Semesters)',
    eligibility: 'Pass in 10+2 / PUC with Arabic or equivalent examination.',
    department: 'Department of Languages & Kannada',
    deptSlug: 'kannada',
    deptId: 'kannada',
    image: '/assets/programmes/ug/arabic.jpg',
    overview: 'Instruction in Modern Standard Arabic (MSA), classical Arabic grammar (Nahw & Sarf), commercial correspondence, and translation.',
    objectives: ['Master written and conversational Arabic for academic and commercial applications.'],
    disciplines: [
      { name: 'Modern Standard Arabic', desc: 'Daily conversational dialogues, reading comprehension, and news syntax.' },
      { name: 'Classical Grammar & Literature', desc: 'Nahw, Sarf, rhetoric (Balaghah), and classical pre-Islamic and Islamic prose.' }
    ],
    curriculumHighlights: ['Arabic calligraphy workshops and translation labs.'],
    careerOpportunities: ['Embassy Translator & Commercial Consultant', 'Middle East Corporate Liaison'],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ba', 'persian', 'urdu']
  },
  'persian': {
    id: 'persian',
    aliases: ['persian', 'ug-persian'],
    code: 'PERSIAN',
    title: 'Persian Language & Indo-Persian Heritage (UG)',
    shortTitle: 'Persian Studies',
    degree: 'Language Elective Curriculum',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Languages',
    duration: '2 to 3 Years',
    eligibility: 'Pass in 10+2 / PUC in any stream.',
    department: 'Department of Languages & Kannada',
    deptSlug: 'kannada',
    deptId: 'kannada',
    image: '/assets/programmes/ug/persian.jpg',
    overview: 'Exploration of classical Persian poetry (Rumi, Hafiz, Saadi, Omar Khayyam), Indo-Persian historical manuscripts, and modern Farsi conversation.',
    objectives: ['Learn manuscript reading and classical poetic appreciation in Persian.'],
    disciplines: [
      { name: 'Classical Persian Poetry', desc: 'Gulistan of Saadi, Divan-e-Hafiz, and Masnavi of Rumi.' },
      { name: 'Farsi Grammar & Indo-Persian Texts', desc: 'Mughal and Deccan court records, epigraphy, and basic spoken Farsi.' }
    ],
    curriculumHighlights: ['Manuscript preservation and archival study.'],
    careerOpportunities: ['Historical Archives & Museum Curatorship', 'Diplomatic & Academic Translation'],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ba', 'urdu', 'arabic']
  },
  'environmental-studies': {
    id: 'environmental-studies',
    aliases: ['environmental-studies', 'evs', 'environmental-science'],
    code: 'EVS',
    title: 'Environmental Studies (Compulsory Ability Enhancement Course)',
    shortTitle: 'Environmental Studies',
    degree: 'Mandatory Ability Enhancement Course (AEC - NEP 2020)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Interdisciplinary Science',
    duration: '1 Semester (All UG Streams)',
    eligibility: 'Enrolled in any undergraduate degree programme at St. Philomena\'s College.',
    department: 'Department of Physical & Biological Sciences',
    deptSlug: 'chemistry',
    deptId: 'chemistry',
    image: '/assets/programmes/ug/environmental-studies.jpg',
    overview: 'Mandatory interdisciplinary course empowering students with critical knowledge of ecological systems, biodiversity conservation, sustainable resource management, climate action, and environmental jurisprudence.',
    objectives: [
      'Instill ecological awareness and environmental ethics in all undergraduate students.',
      'Equip learners with practical tools for waste management, water harvesting, and renewable energy adoption.'
    ],
    disciplines: [
      { name: 'Ecosystem Dynamics & Biodiversity', desc: 'Structure of terrestrial and aquatic biomes, biodiversity hotspots in India, and endangered species protection.' },
      { name: 'Pollution Control & Climate Action', desc: 'Air, water, soil, and electronic waste management, global warming, carbon footprint reduction.' },
      { name: 'Environmental Law & Policy', desc: 'The Environment (Protection) Act, National Green Tribunal (NGT), and community environmental activism.' }
    ],
    curriculumHighlights: [
      'Compulsory field study to local ecosystems (Chamundi Hills, Ranganathittu Bird Sanctuary, Kukkarahalli Lake).',
      'Campus plastic audit and green campus initiatives.'
    ],
    careerOpportunities: [
      'Environmental Impact Assessment (EIA) Support',
      'Corporate Sustainability & ESG Compliance',
      'NGOs and Conservation Agencies'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bsc', 'cbz', 'life-skills']
  },
  'life-skills': {
    id: 'life-skills',
    aliases: ['life-skills', 'value-education', 'soft-skills'],
    code: 'LIFE-SKILLS',
    title: 'Life Skills & Professional Value Education',
    shortTitle: 'Life Skills',
    degree: 'Mandatory Skill Enhancement Course (SEC - NEP 2020)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Humanities & Value Education',
    duration: '1 Semester (All UG Streams)',
    eligibility: 'Enrolled in any undergraduate degree programme at St. Philomena\'s College.',
    department: 'Department of Humanities & Social Sciences',
    deptSlug: 'humanities',
    deptId: 'humanities',
    image: '/assets/programmes/ug/life-skills.jpg',
    overview: 'A transformative skill enhancement module designed to build emotional resilience, critical thinking, ethical leadership, effective interpersonal communication, and mental health awareness.',
    objectives: [
      'Empower students with self-awareness, emotional intelligence, and stress management coping mechanisms.',
      'Develop strong workplace etiquette, conflict resolution skills, and empathy.'
    ],
    disciplines: [
      { name: 'Emotional Intelligence & Mindfulness', desc: 'Self-regulation, positive psychology, overcoming anxiety, and resilience building.' },
      { name: 'Communication & Leadership', desc: 'Active listening, public speaking, assertive communication, and team leadership.' },
      { name: 'Universal Human Values & Professional Ethics', desc: 'Constitutional values, gender sensitivity, digital ethics, and integrity in public life.' }
    ],
    curriculumHighlights: [
      'Interactive role-playing, group discussions, and personality development workshops.',
      'Guest sessions by professional clinical psychologists and corporate leaders.'
    ],
    careerOpportunities: [
      'Essential foundational competencies for all corporate and civil service career pathways.'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ba', 'bsw', 'environmental-studies']
  },
  'physical-education': {
    id: 'physical-education',
    aliases: ['physical-education', 'sports', 'phy-ed'],
    code: 'PHY-ED',
    title: 'Physical Education, Health & Sports Science',
    shortTitle: 'Physical Education',
    degree: 'Mandatory Co-Curricular Credit Course (NEP 2020)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Health & Sports Science',
    duration: '1 Semester (All UG Streams)',
    eligibility: 'Enrolled in any undergraduate degree programme at St. Philomena\'s College.',
    department: 'Department of Physical Education & Sports',
    deptSlug: 'humanities',
    deptId: 'humanities',
    image: '/assets/programmes/ug/physical-education.jpg',
    overview: 'Comprehensive sports science and wellness training emphasizing physical fitness, yoga asanas, cardiovascular endurance, sports nutrition, and athletic discipline.',
    objectives: [
      'Promote lifelong physical wellness and healthy lifestyle habits among college students.',
      'Develop sportsmanship, teamwork, and competitive athletic skills.'
    ],
    disciplines: [
      { name: 'Physical Fitness & Biomechanics', desc: 'Components of physical fitness: strength, speed, stamina, agility, and flexibility.' },
      { name: 'Yoga & Stress Management', desc: 'Pranayama, classical asanas, meditation, and relaxation techniques.' },
      { name: 'Sports Nutrition & First Aid', desc: 'Dietary planning for athletes, hydration strategies, and sports injury first-aid management.' }
    ],
    curriculumHighlights: [
      'Hands-on training in the multi-purpose indoor stadium, outdoor sports ground, and gymnasium.',
      'Annual Philomena Sports Meet and inter-collegiate tournament participation.'
    ],
    careerOpportunities: [
      'Fitness Training & Gym Management',
      'Yoga Instructor Certification',
      'Sports Administration & Coaching'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bsc', 'bca', 'life-skills']
  }
};

// Read programmeDetailsData.js and inject NEW_PROGRAMMES
let progContent = fs.readFileSync('src/data/programmeDetailsData.js', 'utf8');

// Find insertion point inside PROGRAMME_DETAILS before export function
const closingBraceIdx = progContent.lastIndexOf('};\n\n// Normalized lookup');
if (closingBraceIdx !== -1) {
  let toAppend = '';
  for (const [key, prog] of Object.entries(NEW_PROGRAMMES)) {
    if (!progContent.includes(`'${key}': {`)) {
      toAppend += `,\n  '${key}': ${JSON.stringify(prog, null, 4)}`;
    }
  }
  progContent = progContent.substring(0, closingBraceIdx) + toAppend + '\n};\n\n' + progContent.substring(closingBraceIdx + 4);
  fs.writeFileSync('src/data/programmeDetailsData.js', progContent, 'utf8');
  console.log('Injected new UG programmes into programmeDetailsData.js');
}

// Update syllabusData.js with new programmes
let syllContent = fs.readFileSync('src/data/syllabusData.js', 'utf8');

const NEW_SYLLABUS = {
  'english': {
    programmeCode: 'ENGLISH',
    programmeName: 'English Language & Literary Studies (UG)',
    duration: '3 Years (6 Semesters)',
    regulationsYear: 'NEP 2020 Autonomous Regulations (2026)',
    pdfUrl: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    semesters: [
      {
        semester: 'Semester I',
        totalCredits: 22,
        courses: [
          { code: 'ENG-DSC-101', title: 'Introduction to Literature & Literary Forms', type: 'Discipline Specific Core (DSC)', credits: 4, cie: 40, see: 60, total: 100 },
          { code: 'ENG-DSC-102', title: 'Indian Writing in English (Poetry & Drama)', type: 'Discipline Specific Core (DSC)', credits: 4, cie: 40, see: 60, total: 100 },
          { code: 'ENG-AEC-101', title: 'Communicative English & Phonetics Lab', type: 'Ability Enhancement Course (AEC)', credits: 3, cie: 40, see: 60, total: 100 },
          { code: 'ENG-OE-101', title: 'Creative Writing & Content Creation', type: 'Open Elective (OE)', credits: 3, cie: 40, see: 60, total: 100 }
        ]
      },
      {
        semester: 'Semester II',
        totalCredits: 22,
        courses: [
          { code: 'ENG-DSC-201', title: 'British Literature: 16th to 18th Century', type: 'Discipline Specific Core (DSC)', credits: 4, cie: 40, see: 60, total: 100 },
          { code: 'ENG-DSC-202', title: 'Gender Studies & Post-Colonial Narratives', type: 'Discipline Specific Core (DSC)', credits: 4, cie: 40, see: 60, total: 100 },
          { code: 'ENG-SEC-201', title: 'Academic Writing & Research Methodology', type: 'Skill Enhancement Course (SEC)', credits: 3, cie: 40, see: 60, total: 100 }
        ]
      }
    ]
  },
  'kannada': {
    programmeCode: 'KANNADA',
    programmeName: 'Kannada Language & Classical Literature (UG)',
    duration: '3 Years (6 Semesters)',
    regulationsYear: 'NEP 2020 Autonomous Regulations (2026)',
    pdfUrl: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    semesters: [
      {
        semester: 'Semester I',
        totalCredits: 22,
        courses: [
          { code: 'KAN-DSC-101', title: 'Prachina Kannada Sahitya Charitre', type: 'Discipline Specific Core (DSC)', credits: 4, cie: 40, see: 60, total: 100 },
          { code: 'KAN-DSC-102', title: 'Halegannada Kavya & Chhandassu', type: 'Discipline Specific Core (DSC)', credits: 4, cie: 40, see: 60, total: 100 },
          { code: 'KAN-OE-101', title: 'Kannada Vyakarana & Translation', type: 'Open Elective (OE)', credits: 3, cie: 40, see: 60, total: 100 }
        ]
      }
    ]
  },
  'hindi': {
    programmeCode: 'HINDI',
    programmeName: 'Hindi Language & Literature (UG)',
    duration: '3 Years (6 Semesters)',
    regulationsYear: 'NEP 2020 Autonomous Regulations (2026)',
    pdfUrl: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    semesters: [
      {
        semester: 'Semester I',
        totalCredits: 22,
        courses: [
          { code: 'HIN-DSC-101', title: 'Madhyakalin Hindi Kavya (Bhakti Kal)', type: 'Discipline Specific Core (DSC)', credits: 4, cie: 40, see: 60, total: 100 },
          { code: 'HIN-DSC-102', title: 'Prayojanmoolak Hindi & Functional Grammar', type: 'Discipline Specific Core (DSC)', credits: 4, cie: 40, see: 60, total: 100 }
        ]
      }
    ]
  },
  'bvoc': {
    programmeCode: 'BVOC',
    programmeName: 'B.Voc (Bachelor of Vocational Courses)',
    duration: '3 Years (Multiple Exit: Diploma / Adv. Diploma / Degree)',
    regulationsYear: 'UGC NSQF Curriculum Framework (2026)',
    pdfUrl: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    semesters: [
      {
        semester: 'Semester I',
        totalCredits: 30,
        courses: [
          { code: 'BVOC-GEN-101', title: 'General Communication & Computing Basics', type: 'General Education', credits: 4, cie: 40, see: 60, total: 100 },
          { code: 'BVOC-SKL-101', title: 'Healthcare Technology / Media Production Foundation', type: 'Skill Domain Core', credits: 12, cie: 50, see: 50, total: 100 },
          { code: 'BVOC-PRJ-101', title: 'Industry Practical Internship I', type: 'Practical Field Training', credits: 14, cie: 50, see: 50, total: 100 }
        ]
      }
    ]
  }
};

const syllClosingIdx = syllContent.lastIndexOf('};\n\nexport function getSyllabusByProgramme');
if (syllClosingIdx !== -1) {
  let toAppend = '';
  for (const [key, syl] of Object.entries(NEW_SYLLABUS)) {
    if (!syllContent.includes(`'${key}': {`)) {
      toAppend += `,\n  '${key}': ${JSON.stringify(syl, null, 4)}`;
    }
  }
  syllContent = syllContent.substring(0, syllClosingIdx) + toAppend + '\n};\n\n' + syllContent.substring(syllClosingIdx + 4);
  fs.writeFileSync('src/data/syllabusData.js', syllContent, 'utf8');
  console.log('Injected new syllabi into syllabusData.js');
}
