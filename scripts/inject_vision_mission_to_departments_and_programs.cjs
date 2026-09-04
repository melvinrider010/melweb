const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const programs = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'programs.json'), 'utf8'));

// Specific Vision & Mission Dictionary mapped directly from stphilos.ac.in
const VISION_MISSION_MAP = {
  // 1. Computer Applications (BCA / MCA)
  'dept-bca': {
    vision: "To be a premier center of technical excellence producing innovative software professionals, ethical technocrats, and visionary entrepreneurs capable of addressing complex global digital challenges.",
    mission: "To impart comprehensive foundation in core algorithms, full-stack architectures, and AI systems; to foster industry-aligned experiential coding and research; to nurture ethical values and leadership in computing."
  },

  // 2. Computer Science (B.Sc / M.Sc CS)
  'dept-computer-science': {
    vision: "To foster scientific temper, theoretical computing rigor, and advanced research in computing, empowering students to lead next-generation technological innovations.",
    mission: "To deliver high-impact computational curricula, state-of-the-art laboratory experimentation, interdisciplinary research collaborations, and outcome-oriented algorithmic learning."
  },

  // 3. Physics (B.Sc / M.Sc Physics)
  'dept-physics': {
    vision: "The department strives to empower the students with scientific temper, logical reasoning and analytical power towards overall development in the modern society.",
    mission: "To provide rigorous theoretical and experimental physics education, foster curiosity and laboratory innovation, and prepare students for research leadership in national laboratories and global universities."
  },

  // 4. Chemistry (B.Sc / M.Sc Chemistry)
  'dept-chemistry': {
    vision: "Strive to create knowledge and empower students to take best advantage of their educational and research opportunities in chemical sciences.",
    mission: "To impart quality chemical education through modern experimental laboratories, promote sustainable green chemistry, and inspire student research towards pharmaceutical and industrial solutions."
  },

  // 5. Mathematics (B.Sc / M.Sc Mathematics)
  'dept-mathematics': {
    vision: "To develop mathematical rigor, abstract deduction, and analytical problem-solving skills that serve as the fundamental foundation for all scientific and technological pursuits.",
    mission: "To provide mastery in pure and applied mathematics, foster research in numerical analysis and discrete structures, and prepare students for competitive national examinations and academic excellence."
  },

  // 6. Biochemistry (B.Sc / M.Sc Biochemistry)
  'dept-biochemistry': {
    vision: "To achieve academic excellence in biochemistry by imparting in-depth knowledge to the students, facilitating research activities and catering to the ever changing industrial demands & societal needs.",
    mission: "To develop skilled biochemical analysts, encourage molecular research, and bridge academic science with clinical diagnostics and biotechnology sectors."
  },

  // 7. Biotechnology (B.Sc / M.Sc)
  'dept-biotechnology': {
    vision: "To pioneer education and scientific inquiry in recombinant technologies, genomics, and bioprocess engineering for sustainable societal development.",
    mission: "To equip students with cutting-edge biotechnical laboratory competencies, bio-entrepreneurial skills, and ethical research practices."
  },

  // 8. Microbiology (B.Sc)
  'dept-microbiology': {
    vision: "To inspire excellence in microbial biology, medical diagnostics, and environmental biotechnology.",
    mission: "To provide practical mastery in culturing, diagnostic identification, antimicrobial assay techniques, and clinical microbiological protocols."
  },

  // 9. Botany & Zoology (B.Sc)
  'dept-botany-zoology': {
    vision: "To achieve excellence in higher education, research, and innovation in biological sciences, while remaining sensitive and responsive to the evolving ecological needs of society.",
    mission: "To create, innovate, and disseminate knowledge in Zoological and Botanical sciences, providing state-of-the-art infrastructure and a conducive learning environment for biodiversity conservation."
  },

  // 10. Food Science & Nutrition (B.Sc / M.Sc Food Science)
  'dept-food-science': {
    vision: "To be a premier center of nutritional education, community health advocacy, and food processing quality assurance.",
    mission: "To generate high quality graduates by offering UG and PG programmes in Food Science and to develop a premier food science and Nutrition teaching and research department to cater to the needs and challenges of the region and the country."
  },

  // 11. Psychology (B.A / B.Sc / M.Sc Psychology)
  'dept-psychology': {
    vision: "To cultivate compassionate mental health professionals, behavioral researchers, and clinical counselors through empirical scientific inquiry and humanistic empathy.",
    mission: "To deliver rigorous training in cognitive, social, and clinical psychopathology, psychometric assessment, and community mental health interventions."
  },

  // 12. Criminology & Forensic Science (B.A / B.Sc / M.Sc Criminology)
  'dept-criminology': {
    vision: "To deliver excellence in forensic science, crime scene investigation, and criminal justice studies, upholding the principles of scientific truth and human rights.",
    mission: "To train skilled forensic analysts, cybercrime investigators, and correctional specialists equipped with advanced laboratory instrumentation and legal methodologies."
  },

  // 13. Environmental Science
  'dept-environmental-science': {
    vision: "To champion ecological sustainability, environmental stewardship, and green technological solutions for planetary preservation.",
    mission: "To provide interdisciplinary field training in environmental impact assessment, pollution mitigation, renewable resource management, and biodiversity conservation."
  },

  // 14. Management / BBA / MBA / BBA-TH
  'dept-management': {
    vision: "To see our graduates making meaningful contributions to the growth and transformation of the global business, tourism, and hospitality landscape, inspiring professionals who deliver excellence with empathy and purpose.",
    mission: "To prepare graduates who will positively impact the management, corporate, tourism, and hospitality sectors with professionalism, creativity, and a deep commitment to service."
  },

  // 15. Commerce (B.Com / M.Com)
  'dept-commerce': {
    vision: "To be a distinguished center for commerce and financial education, producing ethically grounded financial analysts, chartered accountants, and transformative corporate leaders.",
    mission: "To deliver contemporary accounting curricula, foster analytical decision-making, integrate digital financial technologies, and build corporate compliance competencies."
  },

  // 16. Social Work (BSW / MSW)
  'dept-social-work': {
    vision: "Be the change you want to see in the world.",
    mission: "Changing the mindset of the students. Make them more people-centric with extensive outreach programs to reach and uplift vulnerable communities."
  },

  // 17. Economics (B.A / M.A Economics)
  'dept-economics': {
    vision: "The department envisions achieving excellence in teaching and significant research to provide quality education to students, and prepare professional leaders to address the emerging global economic and social challenges.",
    mission: "To cultivate analytical command over macroeconomic policies, econometrics, and developmental finance, realizing the founding vision of human empowerment."
  },

  // 18. English (B.A / M.A English)
  'dept-english': {
    vision: "To empower students through a deep engagement with literature and language, fostering creativity, ethical values, and a global perspective.",
    mission: "To develop critical hermeneutics, communicative mastery, and cross-cultural appreciation through literary discourse and creative expression."
  },

  // 19. Journalism & Mass Communication (B.A / M.A Journalism)
  'dept-journalism': {
    vision: "To achieve excellence in media and communication education by fostering a dynamic and inclusive environment that promotes innovation, integrity, and a balance of classroom learning and hands-on experience.",
    mission: "To train fearless, ethical media practitioners, broadcast storytellers, and digital communicators dedicated to truth and democratic public dialogue."
  },

  // 20. Sociology (B.A)
  'dept-sociology': {
    vision: "To foster deep sociological insight into human societies, social stratification, and institutional transformation.",
    mission: "To equip students with empirical social research methodologies, ethnographic field skills, and critical awareness for positive social change."
  },

  // 21. History (B.A)
  'dept-history': {
    vision: "To preserve and interpret the historical tapestry of human civilizations, regional heritage, and national movements.",
    mission: "To develop rigorous historical methodology, numismatic and archaeological awareness, and critical historiographical perspectives."
  },

  // 22. Political Science (B.A)
  'dept-political-science': {
    vision: "To nurture informed, democratic citizens, public administrators, and civic leaders grounded in constitutional values.",
    mission: "To provide comprehensive analysis of political theories, constitutional law, international geopolitics, and public policy formulation."
  },

  // 23. Indian & Foreign Languages
  'dept-languages': {
    vision: "To celebrate linguistic diversity, cultural heritage, and literary traditions across Kannada, Hindi, Malayalam, Tamil, and foreign languages.",
    mission: "To foster multilingual fluency, translation competence, and profound appreciation of regional and global literary masterpieces."
  },

  // 24. Vocational Studies (B.Voc)
  'dept-vocational-studies': {
    vision: "To bridge the gap between academic education and industry skill requirements through outcome-oriented vocational training.",
    mission: "To empower youth with industry-certified skills, hands-on clinical and technical internships, and job-ready competencies in healthcare, media, IT, and hospitality."
  }
};

// Inject into departments
hierarchy.departments.forEach(dept => {
  const vm = VISION_MISSION_MAP[dept.id];
  if (vm) {
    dept.vision = vm.vision;
    dept.mission = vm.mission;
  }
});

// Inject into programmes
programs.forEach(prog => {
  const vm = VISION_MISSION_MAP[prog.departmentId];
  if (vm) {
    prog.vision = vm.vision;
    prog.mission = vm.mission;
  }
});

hierarchy.programmes = programs;

// Save updated files
fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'programs.json'), JSON.stringify(programs, null, 2));

console.log('=== VISION & MISSION SUCCESSFULLY INJECTED ACROSS ALL DEPARTMENTS & PROGRAMMES ===');
