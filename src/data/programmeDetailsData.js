// Comprehensive Academic Programme Dataset for St. Philomena's College (Autonomous), Mysuru
// Fully localized - No external redirects

export const PROGRAMME_DETAILS = {
  // ==================== UNDERGRADUATE PROGRAMMES ====================
  'bca': {
    id: 'bca',
    aliases: ['bca', 'b-c-a', 'bachelor-of-computer-applications'],
    code: 'BCA',
    title: 'Bachelor of Computer Applications (BCA)',
    shortTitle: 'Computer Applications',
    degree: 'Bachelor of Computer Applications',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Science & Information Technology',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination (PUC) with Mathematics / Computer Science / Accountancy / Commerce or equivalent examination recognized by the University of Mysore with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Computer Science & Applications',
    deptId: 'dept_cs',
    overview: 'The Bachelor of Computer Applications (BCA) at St. Philomena\'s College is an intensive, industry-aligned undergraduate program designed to bridge the gap between academic theory and practical software engineering. Built upon NEP 2020 guidelines and outcome-based education (OBE), the curriculum empowers students with rigorous mastery in core programming, cloud architectures, artificial intelligence fundamentals, database engineering, web full-stack ecosystems, and mobile application frameworks.',
    objectives: [
      'Equip students with deep algorithmic thinking, software architecture principles, and hands-on coding proficiency.',
      'Develop modern full-stack development skills across frontend, backend, database, and cloud deployments.',
      'Prepare graduates for competitive roles in high-growth tech companies and prestigious postgraduate degrees (MCA, M.Sc CS, MS in Computing).'
    ],
    disciplines: [
      {
        name: 'Core Software Engineering',
        desc: 'Object-Oriented Programming (Java, C++, Python), Data Structures & Algorithms, Operating Systems, Software Architecture.'
      },
      {
        name: 'Web & Cloud Technologies',
        desc: 'React.js, Node.js, RESTful APIs, Cloud Computing Platforms (AWS/Azure), Microservices, and Containerization basics.'
      },
      {
        name: 'Data Systems & Intelligence',
        desc: 'Relational DBMS (MySQL/PostgreSQL), NoSQL (MongoDB), Data Warehousing, Machine Learning foundations, and Big Data concepts.'
      },
      {
        name: 'Networking & Cyber Security',
        desc: 'TCP/IP Protocol Suite, Information Security, Cryptography basics, Ethical Hacking principles, and Network Administration.'
      }
    ],
    curriculumHighlights: [
      'State-of-the-art Computing Labs with high-speed fiber internet and dedicated Linux/Windows environments.',
      'Mandatory Capstone Industry Project & Internship in Semesters 5 and 6.',
      'Value-added certifications in DevOps, Cybersecurity, and AI Prompt Engineering.',
      'Active coding clubs, hackathons, and technical symposia organised by the PhiloTech student forum.'
    ],
    careerOpportunities: [
      'Full-Stack Web Developer',
      'Software Engineer / Application Developer',
      'Cloud & DevOps Engineer',
      'Database Administrator & Data Analyst',
      'Cybersecurity Associate',
      'Quality Assurance & Test Automation Specialist',
      'Higher Studies: MCA, M.Sc Computer Science, MBA in IT'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['pmc', 'msc-cs', 'mca', 'bvoc']
  },

  'bcom': {
    id: 'bcom',
    aliases: ['bcom', 'b-com', 'b.com', 'bachelor-of-commerce'],
    code: 'B.Com',
    title: 'Bachelor of Commerce (B.Com)',
    shortTitle: 'Commerce & Financial Studies',
    degree: 'Bachelor of Commerce',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Commerce & Management',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination (Commerce or Science stream) or equivalent examination recognized by the University of Mysore with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Commerce & Financial Management',
    deptId: 'dept_commerce',
    overview: 'The Bachelor of Commerce (B.Com) program at St. Philomena\'s College offers an authoritative curriculum in corporate accounting, financial analysis, direct & indirect taxation, auditing standards, banking technology, and corporate laws. Aligned with NEP 2020, the program equips aspiring commerce professionals with analytical skills and practical compliance training indispensable for global financial markets.',
    objectives: [
      'Provide comprehensive command over Indian Accounting Standards (Ind-AS), IFRS, and Corporate Financial Reporting.',
      'Develop sharp expertise in Income Tax, Goods & Services Tax (GST) computation, filing, and business statutory compliance.',
      'Serve as an accelerated launchpad for professional qualifications including CA (ICAI), CMA, CS, and ACCA.'
    ],
    disciplines: [
      {
        name: 'Corporate Accounting & Reporting',
        desc: 'Advanced Financial Accounting, Corporate Accounting, Cost & Management Accounting, Auditing Practices.'
      },
      {
        name: 'Taxation & Regulatory Framework',
        desc: 'Direct Taxes & Corporate Taxation, GST Laws & Return Filing, Company Law, Business Jurisprudence.'
      },
      {
        name: 'Financial Markets & Investment',
        desc: 'Security Analysis & Portfolio Management, Financial Institutions & Markets, International Banking, Fintech.'
      },
      {
        name: 'Business Analytics & Digital Commerce',
        desc: 'Tally Prime with GST, Advanced Excel for Financial Modeling, E-Commerce Strategy, Business Data Analytics.'
      }
    ],
    curriculumHighlights: [
      'Hands-on Tally Prime & Computerized Accounting Lab training.',
      'Integrated coaching support for CA Foundation & Inter and ACCA modules.',
      'Annual Commerce Fest "PhiloCom" and corporate executive lecture series.',
      'Mandatory 6-week corporate finance and audit firm internships.'
    ],
    careerOpportunities: [
      'Financial Analyst & Equity Research Associate',
      'Corporate Accountant & Internal Auditor',
      'Tax Consultant & GST Compliance Specialist',
      'Investment & Retail Banking Officer',
      'Credit & Risk Management Analyst',
      'Higher Studies: M.Com, MBA (Finance), CA, CMA, CS, CFA'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bba', 'mcom', 'mba', 'bba-th']
  },

  'bba': {
    id: 'bba',
    aliases: ['bba', 'b-b-a', 'bachelor-of-business-administration'],
    code: 'BBA',
    title: 'Bachelor of Business Administration (BBA)',
    shortTitle: 'Business Administration',
    degree: 'Bachelor of Business Administration',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Management & Business Studies',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination in any stream (Commerce, Science, or Arts) with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Business Administration (BBA/MBA)',
    deptId: 'dept_bba',
    overview: 'The Bachelor of Business Administration (BBA) is an executive-oriented managerial undergraduate program designed to cultivate agile business leaders, strategic thinkers, and visionary entrepreneurs. Combining rigorous management theories with experiential learning, business simulations, and live corporate case studies, BBA students master marketing, human capital management, corporate finance, and operations management.',
    objectives: [
      'Inculcate strategic managerial capabilities, entrepreneurial mindset, and corporate leadership virtues.',
      'Provide deep functional expertise across Marketing, Human Resource Management, Financial Decision-Making, and Supply Chains.',
      'Foster persuasive communication, team leadership, negotiation, and corporate presentation skills.'
    ],
    disciplines: [
      {
        name: 'Strategic Management & Leadership',
        desc: 'Principles of Management, Organizational Behavior, Business Ethics, Strategic Planning & Business Simulation.'
      },
      {
        name: 'Marketing & Digital Branding',
        desc: 'Consumer Behavior, Digital & Social Media Marketing, Brand Management, Product Strategy & Retail Operations.'
      },
      {
        name: 'Financial & Operational Management',
        desc: 'Financial Management, Working Capital Planning, Supply Chain & Logistics, Operations Research.'
      },
      {
        name: 'Human Capital & Global Business',
        desc: 'HR Analytics, Performance Management, International Business Environment, Entrepreneurship & Startup Venture Creation.'
      }
    ],
    curriculumHighlights: [
      'Business Incubation Support via the Institution\'s Innovation Council (IIC).',
      'Industrial visits to top manufacturing hubs and multinational corporate centers.',
      'Harvard-style case pedagogy and live simulation workshops.',
      'Summer corporate internship with mandatory project dissertation.'
    ],
    careerOpportunities: [
      'Business Development Manager',
      'Digital Marketing & Brand Executive',
      'HR Associate & Talent Acquisition Specialist',
      'Financial Management Trainee',
      'Operations & Logistics Coordinator',
      'Startup Founder & Entrepreneur',
      'Higher Studies: MBA, PGDM, M.Com, International Masters'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bba-th', 'bcom', 'mba', 'mcom']
  },

  'bba-th': {
    id: 'bba-th',
    aliases: ['bba-th', 'bba_th', 'bbath', 'bthm', 'bba-tourism', 'tourism-and-hospitality'],
    code: 'BBA-TH',
    title: 'BBA in Tourism & Hospitality Management',
    shortTitle: 'Tourism & Hospitality',
    degree: 'Bachelor of Business Administration (Tourism & Hospitality)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Tourism, Travel & Hospitality Management',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination in any stream with minimum 45% aggregate (40% for SC/ST/Cat-I candidates).',
    department: 'Department of Business Administration & Hospitality Studies',
    deptId: 'dept_bba',
    overview: 'The BBA in Tourism & Hospitality Management (BBA-TH) is a specialised professional program designed for the thriving global travel, airline, luxury resort, and hospitality sectors. Located in the heritage tourism capital of Mysuru, the course blends executive business administration with specialized training in destination marketing, hotel operations, airline ticketing (GDS), eco-tourism, and event management.',
    objectives: [
      'Equip students with end-to-end knowledge of global tourism geography, airline ticketing, and itinerary planning.',
      'Provide hands-on operational mastery in front office, food & beverage management, guest relations, and resort operations.',
      'Prepare graduates for high-profile managerial roles across international hotel chains, airlines, tour operators, and MICE organizations.'
    ],
    disciplines: [
      {
        name: 'Travel & Tourism Operations',
        desc: 'Global Tourism Geography, Itinerary Planning, GDS Airline Ticketing (Amadeus/Sabre), Tour Packaging & Travel Agency Ops.'
      },
      {
        name: 'Hospitality & Resort Management',
        desc: 'Front Office Management, Housekeeping Operations, Food & Beverage Services, Luxury Resort & Cruise Management.'
      },
      {
        name: 'Events & MICE Industry',
        desc: 'Convention & Exhibition Planning, Event Logistics, Protocol Management, Corporate Hospitality.'
      },
      {
        name: 'Tourism Marketing & Eco-Heritage',
        desc: 'Heritage & Cultural Tourism, Ecotourism & Sustainable Practices, Hospitality Marketing, Destination Branding.'
      }
    ],
    curriculumHighlights: [
      'Comprehensive on-the-job training in premier 5-star hotel properties and luxury resorts.',
      'International and national educational field study tours.',
      'Global Distribution Systems (GDS) ticketing and travel software lab training.',
      'Foreign language foundation modules (French / German / Spanish electives).'
    ],
    careerOpportunities: [
      'Hotel & Luxury Resort Operations Manager',
      'Airline Cabin Crew & Airport Ground Operations Officer',
      'International Tour Operations & Travel Consultant',
      'Event & Wedding Planner (MICE Specialist)',
      'Cruise Line Guest Relations Officer',
      'Heritage & Eco-Tourism Project Officer',
      'Higher Studies: MBA in Hospitality, Masters in Tourism Administration (MTA)'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bba', 'bcom', 'mba']
  },

  'esp': {
    id: 'esp',
    aliases: ['esp', 'ba-esp', 'ba_esp', 'economics-sociology-political-science'],
    code: 'ESP',
    title: 'B.A. in Economics, Sociology & Political Science (ESP)',
    shortTitle: 'Economics • Sociology • Political Science',
    degree: 'Bachelor of Arts (B.A. Honours)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Humanities & Social Sciences',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination in Arts, Science, or Commerce stream or equivalent examination recognized by the University of Mysore with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Humanities & Social Sciences',
    deptId: 'dept_humanities',
    overview: 'The ESP (Economics, Sociology, and Political Science) combination is one of the most prestigious and intellectually stimulating Bachelor of Arts degrees at St. Philomena\'s College. Designed for students aspiring toward civil services, public policy, diplomatic careers, social research, and corporate consulting, ESP provides a holistic lens to analyze macroeconomic systems, social structures, constitutional law, and international diplomacy.',
    objectives: [
      'Develop analytical proficiency in macroeconomic trends, development economics, monetary policy, and public finance.',
      'Cultivate deep sociological insights into social stratification, gender studies, urban sociology, and community research methodologies.',
      'Master political philosophy, comparative governance, the Indian Constitution, public administration, and international relations.',
      'Provide systematic orientation and critical thinking required for UPSC Civil Services, KPSC (KAS), and public sector examinations.'
    ],
    disciplines: [
      {
        name: 'Economics (Major / Discipline I)',
        desc: 'Microeconomics, Macroeconomics, Indian Economy & Policy Reforms, Development Economics, Monetary Economics, Public Finance, and Econometric Foundations.'
      },
      {
        name: 'Sociology (Major / Discipline II)',
        desc: 'Principles of Sociology, Indian Society & Social Change, Sociological Thinkers, Research Methodology, Rural & Urban Sociology, and Gender Studies.'
      },
      {
        name: 'Political Science (Major / Discipline III)',
        desc: 'Political Theory & Ideologies, Indian Constitution & Institutional Governance, Comparative Politics, Public Administration, and International Relations & Foreign Policy.'
      }
    ],
    curriculumHighlights: [
      'Dedicated Civil Services & Competitive Exam study circle mentoring.',
      'Field survey research, participatory rural appraisal (PRA), and community ethnographic studies.',
      'Annual Mock Parliament and Model United Nations (MUN) simulations.',
      'Guest lectures by distinguished economists, civil servants, and social scientists.'
    ],
    careerOpportunities: [
      'Civil Services & State Administrative Services (IAS, IPS, IFS, KAS)',
      'Public Policy Analyst & Legislative Assistant (LAMP Fellow)',
      'Economic & Market Research Associate',
      'Non-Governmental Organisation (NGO) & UN Development Officer',
      'Political Consultant & Survey Researcher',
      'Journalist, Editorialist & Content Strategist',
      'Higher Studies: M.A. Economics, M.A. Political Science, M.A. Sociology, MSW, Law (LL.B)'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ehp', 'ensp', 'jps', 'bsw', 'ma-econ']
  },

  'pmc': {
    id: 'pmc',
    aliases: ['pmc', 'bsc-pmc', 'bsc_pmc', 'physics-mathematics-computer-science'],
    code: 'PMC',
    title: 'B.Sc. in Physics, Mathematics & Computer Science (PMC)',
    shortTitle: 'Physics • Math • Computer Science',
    degree: 'Bachelor of Science (B.Sc. Honours)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Physical & Mathematical Sciences',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination with Physics and Mathematics as optional subjects with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Physical & Mathematical Sciences',
    deptId: 'dept_physics',
    overview: 'The PMC (Physics, Mathematics, and Computer Science) combination is an elite scientific B.Sc. program bridging pure physical theories, mathematical modeling, and modern computational algorithms. It provides the ideal interdisciplinary foundation for emerging fields such as computational physics, data science, scientific computing, quantum algorithms, and software development.',
    objectives: [
      'Master theoretical and experimental physics alongside advanced computational simulations.',
      'Develop strong mathematical rigor in calculus, linear algebra, differential equations, and numerical analysis.',
      'Build modern software programming and algorithm design skills in C++, Python, and Java.'
    ],
    disciplines: [
      {
        name: 'Physics',
        desc: 'Mechanics, Quantum Physics, Electrodynamics, Solid State Physics, Optics, Nuclear Physics, and Experimental Laboratory Instrumentation.'
      },
      {
        name: 'Mathematics',
        desc: 'Calculus, Real Analysis, Abstract Algebra, Differential Equations, Numerical Methods, Vector Calculus, and Linear Algebra.'
      },
      {
        name: 'Computer Science',
        desc: 'Data Structures, Object-Oriented Programming, Database Systems, Linux OS, Scientific Computing, and Python for Data Analysis.'
      }
    ],
    curriculumHighlights: [
      'Advanced Darkroom Optics, Electronics, and Computational Simulation Labs.',
      'Collaborative projects combining physical sensors with IoT programming.',
      'Preparation for JAM (IITs), TIFR, JEST, GATE, and CSIR-NET entrance exams.',
      'Active student memberships in national scientific societies.'
    ],
    careerOpportunities: [
      'Scientific Programmer & Computational Analyst',
      'Data Scientist & Quantitative Research Associate',
      'Software Developer & Systems Engineer',
      'Optics & Electronics Hardware Specialist',
      'Research Assistant at National Labs (ISRO, DRDO, IISc)',
      'Higher Studies: M.Sc Physics, M.Sc CS, M.Sc Mathematics, MCA, Data Science'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['pcm', 'bca', 'msc-cs', 'msc-phy', 'msc-math']
  },

  'bch': {
    id: 'bch',
    aliases: ['bch', 'bsc-bch', 'bsc_bch', 'biochemistry-chemistry-nutrition'],
    code: 'BCH',
    title: 'B.Sc. in Biochemistry, Chemistry & Human Nutrition (BCH)',
    shortTitle: 'Biochem • Chem • Human Nutrition',
    degree: 'Bachelor of Science (B.Sc. Honours)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Chemical & Life Sciences',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination with Chemistry and Biology / Life Science subjects with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Biotechnology & Biochemistry',
    deptId: 'dept_biotech',
    overview: 'The BCH (Biochemistry, Chemistry, and Human Nutrition) combination offers an applied life science curriculum centered on molecular biology, chemical synthesis, metabolic biochemistry, dietetics, and therapeutic clinical nutrition. It produces skilled scientific specialists equipped for careers in clinical diagnostics, dietetics, food science, pharmaceuticals, and biomedical research.',
    objectives: [
      'Understand cellular biochemistry, enzymology, metabolic pathways, and molecular genetics.',
      'Master organic synthesis, analytical spectroscopy, and pharmaceutical chemistry principles.',
      'Gain practical clinical expertise in therapeutic diet planning, clinical nutrition assessment, and food analysis.'
    ],
    disciplines: [
      {
        name: 'Biochemistry',
        desc: 'Biomolecules, Enzymology, Metabolism of Carbohydrates/Lipids/Proteins, Molecular Biology, Clinical Biochemistry, and Immunology.'
      },
      {
        name: 'Chemistry',
        desc: 'Organic Synthesis, Reaction Mechanisms, Stereochemistry, Coordination Chemistry, Physical Chemistry, and Spectroscopy.'
      },
      {
        name: 'Human Nutrition & Dietetics',
        desc: 'Nutritional Biochemistry, Human Physiology, Therapeutic Dietetics, Community Nutrition, Food Processing, and Quality Control.'
      }
    ],
    curriculumHighlights: [
      'Clinical nutrition internships at major multi-specialty hospitals in Mysuru and Bengaluru.',
      'State-of-the-art analytical chemistry and molecular biology instrumentation laboratories.',
      'Community nutritional assessment camps and dietary counseling workshops.',
      'Hands-on training in spectrophotometry, chromatography, and electrophoresis.'
    ],
    careerOpportunities: [
      'Clinical Dietitian & Hospital Nutritionist',
      'Biochemical Laboratory Analyst & Diagnostics Specialist',
      'Quality Control & Assurance Officer (Pharma & Food Industries)',
      'Research Assistant in Molecular Biology & Drug Discovery',
      'Food Safety Officer & FSSAI Compliance Analyst',
      'Higher Studies: M.Sc Biochemistry, M.Sc Food Science & Nutrition, M.Sc Chemistry'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['cbz', 'msc-biochem', 'msc-food', 'msc-chem']
  },

  'pcm': {
    id: 'pcm',
    aliases: ['pcm', 'bsc-pcm', 'bsc_pcm', 'physics-chemistry-mathematics'],
    code: 'PCM',
    title: 'B.Sc. in Physics, Chemistry & Mathematics (PCM)',
    shortTitle: 'Physics • Chemistry • Mathematics',
    degree: 'Bachelor of Science (B.Sc. Honours)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Physical & Chemical Sciences',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination with Physics, Chemistry, and Mathematics with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Physics, Chemistry & Mathematics',
    deptId: 'dept_physics',
    overview: 'The PCM combination is the foundational cornerstone of classical scientific higher education. Covering theoretical and experimental physics, organic and inorganic chemistry, and pure and applied mathematics, PCM builds profound analytical problem-solving, mathematical deduction, and scientific experimentation capabilities.',
    objectives: [
      'Develop comprehensive theoretical grasp and experimental expertise across classical mechanics, thermodynamics, and electromagnetism.',
      'Master molecular synthesis, analytical techniques, chemical thermodynamics, and spectroscopy.',
      'Cultivate advanced mathematical problem-solving across real analysis, differential equations, and abstract algebra.'
    ],
    disciplines: [
      {
        name: 'Physics',
        desc: 'Mechanics, Heat & Thermodynamics, Wave Optics, Electromagnetism, Quantum Mechanics, Nuclear Physics, Solid State Physics.'
      },
      {
        name: 'Chemistry',
        desc: 'Inorganic Chemistry, Organic Reaction Mechanisms, Physical Chemistry, Chemical Kinetics, Spectroscopy, Analytical Chemistry.'
      },
      {
        name: 'Mathematics',
        desc: 'Differential & Integral Calculus, Real Analysis, Linear Algebra, Group Theory, Differential Equations, Numerical Analysis.'
      }
    ],
    curriculumHighlights: [
      'Comprehensive physics and chemistry laboratory training with precision instruments.',
      'Coaching for national competitive entrance exams: IIT-JAM, CSIR-NET, TIFR, JEST.',
      'Undergraduate research seed money grants for outstanding faculty-mentored projects.',
      'Science exhibition symposiums and intercollegiate paper presentations.'
    ],
    careerOpportunities: [
      'Scientific Research Assistant & Laboratory Officer',
      'Quality Control Analyst in Chemical & Material Industries',
      'Data & Quantitative Analyst',
      'Science Educator & Academic Lecturer',
      'Technical Officer in Defense & Space Organizations (ISRO, DRDO, BARC)',
      'Higher Studies: M.Sc Physics, M.Sc Chemistry, M.Sc Mathematics, Integrated Ph.D.'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['pmc', 'cbz', 'msc-phy', 'msc-chem', 'msc-math']
  },

  'cbz': {
    id: 'cbz',
    aliases: ['cbz', 'bsc-cbz', 'bsc_cbz', 'chemistry-botany-zoology'],
    code: 'CBZ',
    title: 'B.Sc. in Chemistry, Botany & Zoology (CBZ)',
    shortTitle: 'Chemistry • Botany • Zoology',
    degree: 'Bachelor of Science (B.Sc. Honours)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Natural & Biological Sciences',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination with Chemistry and Biology / Botany / Zoology with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Natural & Life Sciences',
    deptId: 'dept_biotech',
    overview: 'The CBZ combination is the quintessential life sciences undergraduate program. Blending botanical sciences, zoological physiology, ecology, genetics, and molecular chemistry, the curriculum immerses students in biodiversity conservation, plant biotechnology, animal physiology, environmental toxicology, and organic synthesis.',
    objectives: [
      'Explore plant taxonomy, plant tissue culture, physiology, phytochemistry, and economic botany.',
      'Master animal diversity, developmental biology, cell biology, genetics, immunology, and physiology.',
      'Understand organic and analytical chemistry principles applied to natural products and biochemical compounds.'
    ],
    disciplines: [
      {
        name: 'Chemistry',
        desc: 'Organic Reaction Mechanisms, Biomolecules, Analytical Chemistry, Inorganic Chemistry, Stereochemistry, Spectroscopy.'
      },
      {
        name: 'Botany',
        desc: 'Plant Diversity, Microbiology, Plant Anatomy & Physiology, Genetics & Plant Breeding, Plant Biotechnology, Ecology.'
      },
      {
        name: 'Zoology',
        desc: 'Non-Chordata & Chordata, Animal Physiology & Endocrinology, Developmental Biology, Molecular Genetics, Evolution, Applied Zoology.'
      }
    ],
    curriculumHighlights: [
      'Botanical garden, herbarium, and zoological specimen museum on campus.',
      'Field botanical expeditions to Western Ghats biodiversity hotspots.',
      'Hands-on tissue culture, microtomy, and dissection simulation software.',
      'Active environmental conservation club and bird-watching forum.'
    ],
    careerOpportunities: [
      'Botanical & Zoological Research Officer',
      'Environmental Impact Assessment & Wildlife Conservationist',
      'Quality Analyst in Biotech, Pharma & Agricultural Firms',
      'Forest & Wildlife Services (IFS / State Forest Services)',
      'Clinical Diagnostic & Pathology Lab Technician',
      'Higher Studies: M.Sc Botany, M.Sc Zoology, M.Sc Chemistry, M.Sc Biotechnology, M.Sc Environmental Science'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bch', 'pcm', 'msc-chem', 'msc-biochem']
  },

  'jps': {
    id: 'jps',
    aliases: ['jps', 'ba-jps', 'ba_jps', 'journalism-psychology-sociology'],
    code: 'JPS',
    title: 'B.A. in Journalism, Psychology & Sociology (JPS)',
    shortTitle: 'Journalism • Psych • Sociology',
    degree: 'Bachelor of Arts (B.A. Honours)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Media, Behavioral & Social Sciences',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination in any stream with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Journalism, Media & Psychology',
    deptId: 'dept_humanities',
    overview: 'The JPS (Journalism, Psychology, and Sociology) combination provides a dynamic blend of modern media communication, human behavioral science, and social theory. Students learn to decipher social trends, analyze human cognitive processes, conduct investigative journalism, create digital media content, and champion human welfare.',
    objectives: [
      'Master print, broadcast, and digital journalism, news reporting, feature writing, and media ethics.',
      'Understand core psychological theories of cognitive behavior, developmental stages, abnormal psychology, and counseling foundations.',
      'Examine sociological structures, media impact on society, cultural dynamics, and social research methods.'
    ],
    disciplines: [
      {
        name: 'Journalism & Mass Media',
        desc: 'Reporting & Editing, Digital Media Production, Broadcast Journalism, Media Laws & Ethics, Advertising & PR, Photography.'
      },
      {
        name: 'Psychology',
        desc: 'General Psychology, Developmental Psychology, Social Psychology, Abnormal Psychology, Counseling Foundations, Experimental Psych Lab.'
      },
      {
        name: 'Sociology',
        desc: 'Sociological Theory, Indian Society, Sociology of Media, Gender & Society, Social Research Methodologies, Urban Sociology.'
      }
    ],
    curriculumHighlights: [
      'Campus Media Production Studio and community newsletter publishing.',
      'Psychology experimentation laboratory with psychometric testing kits.',
      'Internships with prominent news agencies, TV channels, digital publications, and mental health NGOs.',
      'Workshops by senior journalists, clinical psychologists, and social activists.'
    ],
    careerOpportunities: [
      'Journalist, News Reporter & Sub-Editor',
      'Content Strategist & Digital Media Producer',
      'Public Relations & Corporate Communications Specialist',
      'Counseling Assistant & HR Behavioral Specialist',
      'Social Worker & NGO Program Officer',
      'Market & Consumer Research Analyst',
      'Higher Studies: M.A. Journalism (MA JMC), M.Sc Psychology, MSW, M.A. Sociology'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['esp', 'ensp', 'ehp', 'msc-psych', 'ma-jmc', 'msw']
  },

  'ehp': {
    id: 'ehp',
    aliases: ['ehp', 'ba-ehp', 'ba_ehp', 'economics-history-political-science'],
    code: 'EHP',
    title: 'B.A. in Economics, History & Political Science (EHP)',
    shortTitle: 'Economics • History • Political Science',
    degree: 'Bachelor of Arts (B.A. Honours)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Humanities & Historical Studies',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination in any discipline with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Humanities & Social Sciences',
    deptId: 'dept_humanities',
    overview: 'The EHP combination is the gold standard for students targeting competitive public examinations, civil services (UPSC/KAS), heritage management, and historical research. It provides a deep chronological and structural understanding of economic theory, Indian and world history, archaeology, constitutional frameworks, and governance.',
    objectives: [
      'Gain deep knowledge of ancient, medieval, modern Indian history, freedom struggle, and world civilizations.',
      'Master economic theories, fiscal policies, and economic history of developing nations.',
      'Understand constitutional governance, administrative machinery, and international geopolitical dynamics.'
    ],
    disciplines: [
      {
        name: 'Economics',
        desc: 'Micro & Macroeconomics, Economic History of India, Development Economics, Public Finance, Monetary Economics.'
      },
      {
        name: 'History & Archaeology',
        desc: 'History of Ancient & Medieval India, Modern Indian National Movement, History of Mysore & Karnataka, World Civilizations, Tourism & Heritage.'
      },
      {
        name: 'Political Science',
        desc: 'Political Theory, Indian Constitution, Public Administration, State & Local Governance, International Relations.'
      }
    ],
    curriculumHighlights: [
      'Archaeological site visits, numismatic exhibitions, and historical archive tours.',
      'Regular UPSC/KPSC mock exam drills and current affairs debate forums.',
      'Heritage preservation workshops in collaboration with state museums.'
    ],
    careerOpportunities: [
      'Civil Services (IAS, IPS, KAS) & Government Officers',
      'Archaeological & Museum Curator / Heritage Manager',
      'Policy Analyst & Public Affairs Consultant',
      'Archivist & Historical Research Scholar',
      'Higher Studies: M.A. History, M.A. Economics, M.A. Political Science, Law (LL.B)'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['esp', 'ensp', 'jps', 'ma-econ']
  },

  'ensp': {
    id: 'ensp',
    aliases: ['ensp', 'ba-ensp', 'ba_ensp', 'english-sociology-political-science'],
    code: 'EnSP',
    title: 'B.A. in English, Sociology & Political Science (EnSP)',
    shortTitle: 'English • Sociology • Political Science',
    degree: 'Bachelor of Arts (B.A. Honours)',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Humanities & Literary Studies',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination in any discipline with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of English & Humanities',
    deptId: 'dept_english',
    overview: 'The EnSP combination unites literary criticism, creative writing, sociological enquiry, and political governance. It nurtures articulate communicators, analytical thinkers, and socially conscious graduates ready for careers in journalism, civil services, publishing, international diplomacy, and creative industries.',
    objectives: [
      'Cultivate critical reading, literary interpretation, and creative writing in British, Postcolonial, and Indian English literature.',
      'Analyze sociological realities, social justice issues, community structures, and research methodologies.',
      'Master political philosophy, public policy, human rights, and global affairs.'
    ],
    disciplines: [
      {
        name: 'English Literature',
        desc: 'British Literature, Postcolonial Literature, Indian Writing in English, Literary Criticism, Linguistics & Phonetics, Creative Writing.'
      },
      {
        name: 'Sociology',
        desc: 'Sociological Concepts, Indian Social Institutions, Social Stratification, Sociology of Culture, Research Methodology.'
      },
      {
        name: 'Political Science',
        desc: 'Political Theory, Indian Government & Politics, Public Administration, International Relations, Human Rights.'
      }
    ],
    curriculumHighlights: [
      'Literary festivals, poetry slams, and theatre dramatisation workshops.',
      'Creative writing publications in the college journal "Philo Mira".',
      'Debating and MUN competitive delegations.'
    ],
    careerOpportunities: [
      'Publishing Editor, Content Strategist & Copywriter',
      'Civil Services & Administrative Careers',
      'Corporate Communications & PR Executive',
      'NGO & Humanitarian Advocacy Specialist',
      'Higher Studies: M.A. English, M.A. Political Science, M.A. Sociology, MSW, Law'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['esp', 'ehp', 'jps', 'ma-eng']
  },

  'bsw': {
    id: 'bsw',
    aliases: ['bsw', 'bachelor-of-social-work'],
    code: 'BSW',
    title: 'Bachelor of Social Work (BSW)',
    shortTitle: 'Social Work',
    degree: 'Bachelor of Social Work',
    level: 'Undergraduate (NEP 2020)',
    type: 'ug',
    stream: 'Social Sciences & Human Services',
    duration: '3 Years (6 Semesters) / 4 Years Honours (NEP 2020)',
    eligibility: 'Pass in 10+2 / Pre-University Examination in any stream with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Social Work',
    deptId: 'dept_socialwork',
    overview: 'The Bachelor of Social Work (BSW) is a professional, field-intensive degree committed to human empowerment, social justice, and community development. Combining classroom lectures with mandatory concurrent field work placements in NGOs, hospitals, rural villages, and correctional institutions, BSW prepares transformative social change agents.',
    objectives: [
      'Understand principles of social case work, group work, and community organization.',
      'Master social legislation, human rights frameworks, child protection, and medical social work.',
      'Gain intensive practical field experience through weekly agency placements and rural camps.'
    ],
    disciplines: [
      {
        name: 'Social Work Methods',
        desc: 'Social Case Work (Work with Individuals), Social Group Work, Community Organization, Social Action, Social Work Research.'
      },
      {
        name: 'Human Behavior & Society',
        desc: 'Human Growth & Development, Social Problems & Legislation, Health & Sanitation, Gender & Development.'
      },
      {
        name: 'Field Practicum',
        desc: 'Concurrent Field Work (2 days/week), Rural Social Work Camp, Block Placement Internships in Reputed NGOs.'
      }
    ],
    curriculumHighlights: [
      '10-day Rural Immersion Living Camp in tribal and rural areas.',
      'Concurrent field work with 50+ partner NGOs, hospitals, and child welfare committees.',
      'Disaster management and psychological first aid training.'
    ],
    careerOpportunities: [
      'Community Development Project Officer',
      'Medical & Psychiatric Social Work Assistant',
      'Child Welfare & Protection Officer',
      'Corporate Social Responsibility (CSR) Associate',
      'NGO Program Manager & Grant Coordinator',
      'Higher Studies: Master of Social Work (MSW), M.A. Development Studies'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['msw', 'esp', 'jps']
  },

  'bvoc': {
    id: 'bvoc',
    aliases: ['bvoc', 'b-voc', 'b.voc', 'bachelor-of-vocation'],
    code: 'B.Voc',
    title: 'Bachelor of Vocation (B.Voc)',
    shortTitle: 'Vocational Studies',
    degree: 'Bachelor of Vocation',
    level: 'Undergraduate (NSQF Aligned)',
    type: 'ug',
    stream: 'Vocational & Skill-Based Technologies',
    duration: '3 Years (6 Semesters)',
    eligibility: 'Pass in 10+2 / Pre-University Examination or NSQF Level 4 certification in any stream.',
    department: 'Department of Vocational Studies & Digital Media',
    deptId: 'dept_cs',
    overview: 'The Bachelor of Vocation (B.Voc) is a government-recognized, industry-integrated degree aligned with the National Skills Qualifications Framework (NSQF). It offers specialized vocational streams in Digital Media Production, Software Development, and Healthcare Technologies with multiple exit options (Certificate, Diploma, Advanced Diploma, Degree).',
    objectives: [
      'Impart job-ready technical and vocational competencies in digital media and IT.',
      'Deliver 60% hands-on skill training alongside 40% general education curriculum.',
      'Ensure immediate industrial placement readiness upon graduation.'
    ],
    disciplines: [
      {
        name: 'Digital Media & Production',
        desc: 'Video Editing, Sound Engineering, 2D/3D Animation, VFX, Digital Cinematography, Graphic Design (Adobe Creative Cloud).'
      },
      {
        name: 'Information Technology & Web',
        desc: 'Web Design, Full-Stack Coding, Mobile App Dev, UI/UX Prototyping, IT Support & Networking.'
      }
    ],
    curriculumHighlights: [
      'Dedicated digital editing suites, multi-camera studios, and sound design lab.',
      'Industrial on-the-job training in media production houses and software firms.',
      'Sector Skill Council (SSC) assessment and recognized certifications.'
    ],
    careerOpportunities: [
      'Digital Video Editor & Colorist',
      'Graphic Designer & Motion Artist',
      'Broadcast Studio Technician',
      'Web & Mobile App Developer',
      'Media Production Coordinator'
    ],
    syllabusDoc: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bca', 'ma-jmc']
  },

  // ==================== POSTGRADUATE PROGRAMMES ====================
  'mca': {
    id: 'mca',
    aliases: ['mca', 'master-of-computer-applications'],
    code: 'MCA',
    title: 'Master of Computer Applications (MCA)',
    shortTitle: 'Master of Computer Applications',
    degree: 'Master of Computer Applications (AICTE Approved)',
    level: 'Postgraduate (CBCS / AICTE)',
    type: 'pg',
    stream: 'Computer Science & Software Engineering',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Passed BCA / Bachelor Degree in Computer Science Engineering or equivalent Degree. OR Passed B.Sc / B.Com / B.A. with Mathematics at 10+2 Level or at Graduation Level with at least 50% marks (45% for SC/ST/Cat-I) and valid PGCET / KMAT rank.',
    department: 'Department of Computer Science & Applications',
    deptId: 'dept_cs',
    overview: 'The Master of Computer Applications (MCA) at St. Philomena\'s College is an AICTE and UGC-approved flagship postgraduate program designed to cultivate enterprise software engineers, cloud solutions architects, and AI developers. The 2-year rigorous curriculum features advanced algorithms, distributed computing, cloud architecture, machine learning, and full-semester corporate internships.',
    objectives: [
      'Deliver advanced proficiency in cloud systems (AWS/GCP), microservices architectures, and full-stack software development.',
      'Incorporate state-of-the-art machine learning, deep neural networks, computer vision, and data engineering.',
      'Ensure high-impact corporate placements with top multinational technology corporations.'
    ],
    disciplines: [
      {
        name: 'Enterprise Software & Cloud',
        desc: 'Advanced Java, Spring Boot, Microservices Architecture, Cloud Computing (AWS/Docker/Kubernetes), DevOps, Agile Methodologies.'
      },
      {
        name: 'Artificial Intelligence & Data',
        desc: 'Machine Learning, Deep Learning, Natural Language Processing, Big Data Analytics with Spark, Python for Data Engineering.'
      },
      {
        name: 'Systems & Cyber Security',
        desc: 'Advanced Operating Systems, Network Security, Cryptography, Mobile Computing (Flutter/React Native), Full-Stack Web Technologies.'
      }
    ],
    curriculumHighlights: [
      'Full 4th Semester dedicated Industry Internship / Major Capstone Project.',
      'Advanced High-Performance Computing (HPC) and AI Research Labs.',
      'Regular industry hackathons, coding marathons, and placement masterclasses.'
    ],
    careerOpportunities: [
      'Senior Software Engineer / Full-Stack Architect',
      'AI & Machine Learning Engineer',
      'Cloud & DevOps Solutions Engineer',
      'Data Architect & Big Data Engineer',
      'Cybersecurity & Systems Specialist',
      'Research & Doctoral Studies (Ph.D.)'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bca', 'msc-cs', 'mba']
  },

  'mba': {
    id: 'mba',
    aliases: ['mba', 'master-of-business-administration'],
    code: 'MBA',
    title: 'Master of Business Administration (MBA)',
    shortTitle: 'Business Administration',
    degree: 'Master of Business Administration (AICTE Approved)',
    level: 'Postgraduate (CBCS / AICTE)',
    type: 'pg',
    stream: 'Management Studies',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Bachelor degree of minimum 3 years duration in any discipline with at least 50% marks in aggregate (45% for SC/ST/Cat-I) and valid PGCET / KMAT / CMAT / CAT / MAT entrance test rank.',
    department: 'Department of Management Studies (BBA/MBA)',
    deptId: 'dept_bba',
    overview: 'The Master of Business Administration (MBA) is an AICTE-approved premier postgraduate program designed to develop corporate executives, financial strategists, and innovative entrepreneurs. Featuring dual specializations in Finance, Marketing, Human Resource Management, and Business Analytics, the program incorporates case-method pedagogy, corporate consulting, and leadership simulations.',
    objectives: [
      'Develop strategic leadership, data-driven managerial decision-making, and ethical business stewardship.',
      'Provide dual functional mastery in high-demand domains: Finance, Marketing, HR, and Business Analytics.',
      'Facilitate direct corporate engagement through executive speaker series, live projects, and paid summer internships.'
    ],
    disciplines: [
      {
        name: 'Dual Specialization Streams',
        desc: 'Financial Management, Investment Banking, Digital Marketing, Consumer Analytics, Strategic HR, Business Analytics & Big Data.'
      },
      {
        name: 'Core Executive Disciplines',
        desc: 'Managerial Economics, Corporate Strategy, Operations & Supply Chain Management, Business Law, International Business.'
      }
    ],
    curriculumHighlights: [
      'Dual Specialization options enabling multi-dimensional career paths.',
      'Comprehensive 8-week corporate summer internship and dissertation.',
      'Executive mentorship by alumni holding leadership positions globally.'
    ],
    careerOpportunities: [
      'Investment Banker & Financial Analyst',
      'Brand & Digital Marketing Manager',
      'Human Resource Business Partner (HRBP)',
      'Management Consultant & Strategy Analyst',
      'Supply Chain & Operations Manager'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bba', 'mcom', 'mca', 'bba-th']
  },

  'mcom': {
    id: 'mcom',
    aliases: ['mcom', 'm-com', 'm.com', 'master-of-commerce'],
    code: 'M.Com',
    title: 'Master of Commerce (M.Com)',
    shortTitle: 'Commerce & Financial Management',
    degree: 'Master of Commerce',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Commerce & Corporate Finance',
    duration: '2 Years (4 Semesters)',
    eligibility: 'B.Com or BBA degree from a recognized University with minimum 45% aggregate marks (40% for SC/ST/Cat-I).',
    department: 'Department of Commerce & Financial Management',
    deptId: 'dept_commerce',
    overview: 'The Master of Commerce (M.Com) is an advanced postgraduate degree designed for careers in corporate financial management, equity research, international accounting, taxation consultancy, and academic research. The curriculum emphasizes international financial reporting standards (IFRS), advanced corporate taxation, security analysis, and econometric financial modeling.',
    objectives: [
      'Provide deep theoretical and empirical command over corporate finance, investment analysis, and financial derivatives.',
      'Equip students with research methodologies and statistical tools (SPSS, R, Python) for empirical financial research.',
      'Prepare candidates for UGC-NET / JRF qualification, Ph.D. research, and senior accounting roles.'
    ],
    disciplines: [
      {
        name: 'Financial Analysis & Markets',
        desc: 'Advanced Corporate Financial Management, Security Analysis & Portfolio Management, Financial Derivatives, International Finance.'
      },
      {
        name: 'Corporate Accounting & Tax Policy',
        desc: 'Accounting Theory & Ind-AS/IFRS, Corporate Tax Law & Planning, Strategic Cost Management, Forensic Accounting.'
      }
    ],
    curriculumHighlights: [
      'Financial Research Lab with statistical data modeling software.',
      'Specialized NET/SET coaching integrated into the curriculum.',
      'Mandatory research dissertation in the final semester.'
    ],
    careerOpportunities: [
      'Senior Financial Analyst & Portfolio Manager',
      'Corporate Tax & Compliance Consultant',
      'Audit Specialist & Risk Officer',
      'Assistant Professor / Lecturer in Higher Education',
      'Higher Studies: Ph.D. in Commerce / Finance'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bcom', 'mba', 'ma-econ']
  },

  'msc-cs': {
    id: 'msc-cs',
    aliases: ['msc-cs', 'msc_cs', 'msccs', 'm.sc-cs', 'msc-computer-science'],
    code: 'M.Sc CS',
    title: 'M.Sc. in Computer Science',
    shortTitle: 'Computer Science',
    degree: 'Master of Science in Computer Science',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Computer Science & AI',
    duration: '2 Years (4 Semesters)',
    eligibility: 'B.Sc in Computer Science / BCA / B.Sc with Mathematics / Computer Science / Electronics as optional subjects with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Computer Science & Applications',
    deptId: 'dept_cs',
    overview: 'The M.Sc. in Computer Science is a research-oriented postgraduate degree focusing on cutting-edge computational theories, machine learning algorithms, cybersecurity architectures, and big data systems. It is tailored for students seeking advanced technology roles in R&D labs, software enterprises, or doctoral programs.',
    objectives: [
      'Inculcate deep mathematical foundations of machine learning, algorithms, and cryptography.',
      'Train students in distributed systems, neural networks, cloud computing, and computer vision.',
      'Foster high-caliber computational research and peer-reviewed publications.'
    ],
    disciplines: [
      {
        name: 'Advanced Computing Theories',
        desc: 'Advanced Algorithms & Complexity, Theory of Computation, Machine Learning, Deep Neural Networks, NLP.'
      },
      {
        name: 'Distributed Systems & Security',
        desc: 'Cloud Computing, Big Data Architectures, Cyber Forensics & Cryptography, Computer Vision, IoT Systems.'
      }
    ],
    curriculumHighlights: [
      'High-Performance AI & Data Science computing facility.',
      'Faculty-mentored research publications in indexed journals.',
      'Semester 4 full-time major research dissertation / industrial project.'
    ],
    careerOpportunities: [
      'Machine Learning & AI Research Engineer',
      'Data Scientist & Analytics Architect',
      'Senior Systems & Cloud Engineer',
      'Cybersecurity & Forensics Analyst',
      'Doctoral Research Scholar (Ph.D.)'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bca', 'pmc', 'mca']
  },

  'msc-math': {
    id: 'msc-math',
    aliases: ['msc-math', 'msc_math', 'mscmath', 'm.sc-math', 'msc-mathematics'],
    code: 'M.Sc Math',
    title: 'M.Sc. in Mathematics',
    shortTitle: 'Mathematics',
    degree: 'Master of Science in Mathematics',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Mathematical Sciences',
    duration: '2 Years (4 Semesters)',
    eligibility: 'B.Sc degree with Mathematics as a major/optional subject securing minimum 45% aggregate in Mathematics (40% for SC/ST/Cat-I).',
    department: 'Department of Mathematics',
    deptId: 'dept_maths',
    overview: 'The M.Sc. in Mathematics provides rigorous postgraduate training in pure and applied mathematics. Covering real and complex analysis, abstract algebra, topology, differential equations, fluid mechanics, and numerical analysis, the course prepares students for research, data science, mathematical modeling, and academic careers.',
    objectives: [
      'Develop rigorous proofs, abstract mathematical structures, and functional analysis mastery.',
      'Apply computational mathematics and numerical simulations using MATLAB, Python, and LaTeX.',
      'Prepare graduates for CSIR-NET / JRF, GATE, NBHM, and doctoral research programs.'
    ],
    disciplines: [
      {
        name: 'Pure Mathematics',
        desc: 'Real & Complex Analysis, Abstract Algebra, Linear Algebra, Topology, Functional Analysis, Measure Theory.'
      },
      {
        name: 'Applied & Computational Mathematics',
        desc: 'Ordinary & Partial Differential Equations, Numerical Analysis, Fluid Mechanics, Graph Theory, Mathematical Modeling.'
      }
    ],
    curriculumHighlights: [
      'Computational Mathematics Lab equipped with MATLAB and Mathematica.',
      'Dedicated CSIR-NET / GATE problem-solving workshops.',
      'Individual research project and seminar presentations.'
    ],
    careerOpportunities: [
      'Quantitative Analyst & Actuarial Specialist',
      'Data Scientist & Cryptographic Analyst',
      'Operations Research Analyst',
      'Assistant Professor & Mathematics Educator',
      'Doctoral Research Scholar (Ph.D.)'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['pmc', 'pcm', 'msc-cs', 'msc-phy']
  },

  'msc-phy': {
    id: 'msc-phy',
    aliases: ['msc-phy', 'msc_phy', 'mscphy', 'm.sc-physics', 'msc-physics'],
    code: 'M.Sc Phys',
    title: 'M.Sc. in Physics',
    shortTitle: 'Physics',
    degree: 'Master of Science in Physics',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Physical Sciences',
    duration: '2 Years (4 Semesters)',
    eligibility: 'B.Sc degree with Physics and Mathematics as optional subjects securing minimum 45% aggregate in Physics (40% for SC/ST/Cat-I).',
    department: 'Department of Physics',
    deptId: 'dept_physics',
    overview: 'The M.Sc. in Physics is a comprehensive postgraduate program designed for theoretical and experimental physicists. The curriculum explores quantum mechanics, classical electrodynamics, solid-state physics, nuclear & particle physics, statistical mechanics, astrophysics, and advanced computational physics.',
    objectives: [
      'Master fundamental quantum, statistical, and relativistic physical theories.',
      'Acquire hands-on experimental proficiency with advanced spectroscopic, optical, and condensed matter setups.',
      'Prepare for prestigious research careers at national laboratories (BARC, ISRO, TIFR, DRDO) and Ph.D. programs.'
    ],
    disciplines: [
      {
        name: 'Theoretical Physics',
        desc: 'Quantum Mechanics, Classical Electrodynamics, Statistical Mechanics, Mathematical Physics, Condensed Matter Physics.'
      },
      {
        name: 'Experimental & Applied Physics',
        desc: 'Nuclear & Particle Physics, Solid State Electronics, Lasers & Non-Linear Optics, Computational Physics, Astrophysics.'
      }
    ],
    curriculumHighlights: [
      'Advanced PG research laboratory with UV-Vis, thin film deposition, and X-ray diffraction analysis.',
      'CSIR-NET / GATE coaching and seminar series.',
      'Faculty-guided experimental and theoretical dissertation.'
    ],
    careerOpportunities: [
      'Scientific Officer at National Research Laboratories (ISRO, DRDO, BARC)',
      'Optics & Semiconductor Hardware Specialist',
      'Data & Computational Modeling Analyst',
      'Physics Faculty / Academician',
      'Doctoral Research Fellow (Ph.D.)'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['pcm', 'pmc', 'msc-math', 'msc-chem']
  },

  'msc-chem': {
    id: 'msc-chem',
    aliases: ['msc-chem', 'msc_chem', 'mscchem', 'm.sc-chemistry', 'msc-chemistry'],
    code: 'M.Sc Chem',
    title: 'M.Sc. in Chemistry (Organic & General)',
    shortTitle: 'Chemistry',
    degree: 'Master of Science in Chemistry',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Chemical Sciences',
    duration: '2 Years (4 Semesters)',
    eligibility: 'B.Sc degree with Chemistry as a major/optional subject securing minimum 45% aggregate in Chemistry (40% for SC/ST/Cat-I).',
    department: 'Department of Chemistry',
    deptId: 'dept_chemistry',
    overview: 'The M.Sc. in Chemistry program at St. Philomena\'s College is renowned for its academic excellence, cutting-edge organic synthesis laboratories, and high placement record in pharmaceutical and chemical industries. Specializing in organic reaction mechanisms, spectroscopy, organometallics, and medicinal chemistry, the program equips chemists for global research.',
    objectives: [
      'Master multi-step organic synthesis, retrosynthetic analysis, and asymmetric catalysis.',
      'Attain deep analytical mastery in NMR, FTIR, Mass Spectrometry, UV-Vis, and HPLC instrumentation.',
      'Prepare graduates for high-value careers in pharmaceutical R&D, chemical synthesis, and CSIR-NET research.'
    ],
    disciplines: [
      {
        name: 'Organic & Medicinal Chemistry',
        desc: 'Advanced Organic Synthesis, Reaction Mechanisms, Stereochemistry, Natural Products, Medicinal Chemistry, Retrosynthesis.'
      },
      {
        name: 'Inorganic & Physical Chemistry',
        desc: 'Coordination Chemistry, Organometallics, Quantum Chemistry, Chemical Thermodynamics, Molecular Spectroscopy, Electrochemistry.'
      }
    ],
    curriculumHighlights: [
      'State-of-the-art synthetic organic chemistry lab with rotary evaporators, HPLC, and UV-Vis spectrophotometers.',
      'Collaborative R&D projects and industrial visits to leading pharma hubs in Mysuru/Bengaluru.',
      'Mandatory final-semester research project dissertation.'
    ],
    careerOpportunities: [
      'Medicinal & Synthetic Organic Chemist (Pharma R&D)',
      'Analytical Development Specialist (QC/QA)',
      'Chemical Process & Formulation Scientist',
      'Patent Analyst & Scientific Officer',
      'Higher Studies: Ph.D. in Chemical Sciences (India & Abroad)'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['pcm', 'cbz', 'bch', 'msc-biochem']
  },

  'msc-biochem': {
    id: 'msc-biochem',
    aliases: ['msc-biochem', 'msc_biochem', 'mscbiochem', 'm.sc-biochemistry', 'msc-biochemistry'],
    code: 'M.Sc Biochem',
    title: 'M.Sc. in Biochemistry',
    shortTitle: 'Biochemistry',
    degree: 'Master of Science in Biochemistry',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Biochemical & Molecular Sciences',
    duration: '2 Years (4 Semesters)',
    eligibility: 'B.Sc with Biochemistry / Chemistry / Biotechnology / Microbiology / Life Sciences with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Biotechnology & Biochemistry',
    deptId: 'dept_biotech',
    overview: 'The M.Sc. in Biochemistry explores the molecular architecture of life. Covering advanced enzymology, clinical biochemistry, genetic engineering, structural biology, immunology, and bioinformatics, this postgraduate degree trains scientists for clinical diagnostic labs, biopharmaceutical enterprises, and molecular research institutes.',
    objectives: [
      'Master protein chemistry, enzyme kinetics, metabolic regulations, and clinical diagnostics.',
      'Train in recombinant DNA technology, gene editing (CRISPR), and molecular biology techniques.',
      'Foster independent research skills through hands-on laboratory dissertations.'
    ],
    disciplines: [
      {
        name: 'Molecular & Cellular Biochemistry',
        desc: 'Advanced Enzymology, Molecular Biology, Genetic Engineering, Structural Biology, Bioinformatics, Signal Transduction.'
      },
      {
        name: 'Clinical & Applied Biochemistry',
        desc: 'Clinical Biochemistry & Diagnostics, Immunology, Biochemical Toxicology, Drug Metabolism, Plant Biochemistry.'
      }
    ],
    curriculumHighlights: [
      'Molecular biology suites equipped with PCR thermal cyclers, gel documentation, and electrophoresis.',
      'Hands-on clinical biochemistry testing and diagnostic protocols.',
      'Mandatory research dissertation in leading research institutes (CFTRI, IISc, DFRL).'
    ],
    careerOpportunities: [
      'Biopharmaceutical Research Scientist',
      'Clinical Diagnostic & Molecular Pathology Specialist',
      'Quality Control Scientist in Biotech Firms',
      'Bioinformatics & Drug Design Analyst',
      'Ph.D. Fellow in Molecular Biology & Biochemistry'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bch', 'cbz', 'msc-chem', 'msc-food']
  },

  'msc-psych': {
    id: 'msc-psych',
    aliases: ['msc-psych', 'msc_psych', 'mscpsych', 'm.sc-psychology', 'msc-psychology'],
    code: 'M.Sc Psych',
    title: 'M.Sc. in Psychology',
    shortTitle: 'Psychology',
    degree: 'Master of Science in Psychology',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Behavioral & Psychological Sciences',
    duration: '2 Years (4 Semesters)',
    eligibility: 'BA / B.Sc in Psychology or Bachelor degree in any discipline with Psychology as optional subject securing minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Psychology',
    deptId: 'dept_humanities',
    overview: 'The M.Sc. in Psychology offers an advanced clinical, cognitive, and counseling curriculum. It equips students with the scientific methodologies, psychotherapeutic tools, psychometric assessment skills, and ethical counseling techniques required for modern mental health, hospital, organizational, and educational environments.',
    objectives: [
      'Master clinical psychopathology, cognitive neuroscience, and psychological assessment methodologies.',
      'Develop practical counseling, psychotherapy (CBT, REBT), and crisis intervention proficiencies.',
      'Gain intensive clinical supervised internships in psychiatric hospitals and mental health centers.'
    ],
    disciplines: [
      {
        name: 'Clinical & Counseling Psychology',
        desc: 'Advanced Psychopathology, Psychotherapy & Counseling Techniques, Clinical Assessment, Neuropsychology, Child Psychology.'
      },
      {
        name: 'Organizational & Social Psychology',
        desc: 'Organizational Behavior & HR Psychology, Advanced Research Methods & Statistics (SPSS), Health Psychology, Positive Psychology.'
      }
    ],
    curriculumHighlights: [
      'Psychological Assessment & Psychometric Testing Laboratory.',
      'Supervised clinical internships in hospitals, mental health centers, and de-addiction centers.',
      'Community mental health awareness camps and crisis counseling workshops.'
    ],
    careerOpportunities: [
      'Clinical Psychologist & Mental Health Counselor',
      'Hospital & Rehabilitation Center Psychologist',
      'Corporate HR Behavioral & Wellness Specialist',
      'School & Educational Guidance Counselor',
      'Doctoral Research Scholar (Ph.D. / M.Phil in Clinical Psychology)'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['jps', 'msw']
  },

  'msc-food': {
    id: 'msc-food',
    aliases: ['msc-food', 'msc_food', 'mscfood', 'msc-fsn', 'msc-food-science-and-nutrition'],
    code: 'M.Sc Food',
    title: 'M.Sc. in Food Science & Nutrition',
    shortTitle: 'Food Science & Nutrition',
    degree: 'Master of Science in Food Science and Nutrition',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Food Technology & Clinical Nutrition',
    duration: '2 Years (4 Semesters)',
    eligibility: 'B.Sc in Food Science / Home Science / Nutrition / Biochemistry / Biotechnology / Chemistry / Life Sciences with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Food Science & Nutrition',
    deptId: 'dept_biotech',
    overview: 'The M.Sc. in Food Science and Nutrition is an advanced applied science program bridging food chemistry, industrial food processing, clinical therapeutic nutrition, and food safety regulations. Situated near leading national food institutes in Mysuru (CFTRI, DFRL), students receive top-tier research and industry exposure.',
    objectives: [
      'Master food chemistry, food microbiology, food preservation technology, and product development.',
      'Deliver advanced therapeutic dietetics and clinical nutrition counseling for specialized health conditions.',
      'Train in national and international food safety quality management systems (FSSAI, ISO 22000, HACCP).'
    ],
    disciplines: [
      {
        name: 'Food Science & Technology',
        desc: 'Food Chemistry, Food Microbiology & Safety, Food Processing & Preservation, Food Analysis & Instrumentation, Product Formulation.'
      },
      {
        name: 'Clinical & Public Health Nutrition',
        desc: 'Advanced Human Nutrition, Therapeutic Clinical Dietetics, Community Nutrition & Public Health, Institutional Food Service Mgmt.'
      }
    ],
    curriculumHighlights: [
      'Food Analysis and Experimental Nutrition Processing Laboratories.',
      'Hospital clinical dietetics internship at multi-specialty hospitals.',
      'Collaborative projects with food processing and dairy manufacturing units.'
    ],
    careerOpportunities: [
      'Chief Clinical Dietitian & Hospital Nutritionist',
      'Food Safety Officer & Quality Assurance Manager (FSSAI Auditor)',
      'Food Product Development Scientist (R&D)',
      'Public Health & Nutrition Program Specialist',
      'Higher Studies: Ph.D. in Food Science / Nutrition'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bch', 'msc-biochem']
  },

  'msc-crim': {
    id: 'msc-crim',
    aliases: ['msc-crim', 'msc_crim', 'msccrim', 'msc-criminology-and-forensic-science'],
    code: 'M.Sc Crim',
    title: 'M.Sc. in Criminology & Forensic Science',
    shortTitle: 'Criminology & Forensic Science',
    degree: 'Master of Science in Criminology and Forensic Science',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Forensic Science & Criminological Studies',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Bachelor degree in Science / Criminology / Law / Forensic Science / Medicine with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Criminology & Forensic Science',
    deptId: 'dept_humanities',
    overview: 'The M.Sc. in Criminology and Forensic Science is a premier specialized program preparing scientific investigators for criminal justice, law enforcement, and private security systems. Students receive rigorous training in crime scene investigation, forensic chemistry, toxicological analysis, questioned documents, ballistic identification, and cyber forensics.',
    objectives: [
      'Master crime scene reconstruction, physical evidence collection, and chain-of-custody protocols.',
      'Train in forensic chemical analysis, fingerprint examination, ballistics, and questioned documents.',
      'Develop cyber forensic capabilities for digital evidence recovery, malware analysis, and network forensics.'
    ],
    disciplines: [
      {
        name: 'Forensic Science & Investigation',
        desc: 'Crime Scene Investigation, Forensic Chemistry & Toxicology, Forensic Ballistics, Questioned Documents, Fingerprint Science, Forensic Biology & DNA.'
      },
      {
        name: 'Criminology & Cyber Forensics',
        desc: 'Theories of Crime, Criminal Law & Jurisprudence, Victimology & Correctional Admin, Cyber Forensics & Digital Investigation.'
      }
    ],
    curriculumHighlights: [
      'Simulated Indoor & Outdoor Crime Scene Investigation Labs.',
      'Field attachments with Forensic Science Laboratories (FSL), police departments, and correctional homes.',
      'Hands-on digital forensic toolkits (EnCase, FTK, Autopsy).'
    ],
    careerOpportunities: [
      'Forensic Scientist / Scientific Assistant (State & Central FSLs)',
      'Cyber Crime Investigator & Digital Forensics Analyst',
      'Private Investigation & Corporate Fraud Examiner',
      'Law Enforcement & Police Intelligence Officer',
      'Doctoral Research Scholar (Ph.D.)'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['msc-cs', 'msc-psych']
  },

  'ma-eng': {
    id: 'ma-eng',
    aliases: ['ma-eng', 'ma_eng', 'maeng', 'm.a-english', 'ma-english'],
    code: 'M.A Eng',
    title: 'M.A. in English Literature',
    shortTitle: 'English Literature',
    degree: 'Master of Arts in English',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Humanities & Literary Studies',
    duration: '2 Years (4 Semesters)',
    eligibility: 'BA degree with English as optional or major subject securing minimum 45% aggregate in English (40% for SC/ST/Cat-I).',
    department: 'Department of English',
    deptId: 'dept_english',
    overview: 'The M.A. in English Literature offers a rich exploration of British, American, Indian English, European, and Postcolonial literatures, critical theory, linguistics, and cultural studies. It develops advanced critical writing, rhetorical mastery, and pedagogical excellence.',
    objectives: [
      'Explore classical to contemporary global literatures and postcolonial narratives.',
      'Master critical theory: Structuralism, Post-structuralism, Psychoanalysis, Feminism, Eco-criticism, Cultural Studies.',
      'Prepare graduates for UGC-NET/JRF, teaching in higher education, publishing, and creative writing.'
    ],
    disciplines: [
      {
        name: 'Literary History & Canons',
        desc: 'Chaucer to Milton, Shakespeare & Drama, Romantic & Victorian Literature, Modern & Postmodern British Literature, American Literature.'
      },
      {
        name: 'Contemporary & Critical Theory',
        desc: 'Indian Writing in English & Translation, Postcolonial Literatures, Literary Criticism & Theory, Linguistics & ELT, Cultural Studies.'
      }
    ],
    curriculumHighlights: [
      'National literary seminars and intercollegiate paper presentations.',
      'Integrated UGC-NET / SET English preparation modules.',
      'Final-semester research dissertation in literature or critical theory.'
    ],
    careerOpportunities: [
      'Assistant Professor & Academic Lecturer',
      'Publishing Editor, Content Strategist & Author',
      'Corporate Communication Specialist',
      'Civil Services & Government Administration',
      'Higher Studies: Ph.D. in English Literature / Cultural Studies'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['ensp', 'ma-jmc']
  },

  'ma-econ': {
    id: 'ma-econ',
    aliases: ['ma-econ', 'ma_econ', 'maecon', 'm.a-economics', 'ma-economics'],
    code: 'M.A Econ',
    title: 'M.A. in Economics',
    shortTitle: 'Economics',
    degree: 'Master of Arts in Economics',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Economic & Development Studies',
    duration: '2 Years (4 Semesters)',
    eligibility: 'BA or B.Sc degree with Economics as optional or major subject with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Economics',
    deptId: 'dept_humanities',
    overview: 'The M.A. in Economics is a quantitative, policy-focused postgraduate degree. Providing advanced microeconomics, macroeconomic modeling, econometrics, public economics, international trade, and development theories, the program prepares economists for central banks, think tanks, corporate research, and government policy advisory.',
    objectives: [
      'Deliver advanced mathematical and econometric modeling skills (STATA, R, Python).',
      'Analyze macroeconomic policy, monetary frameworks, fiscal reforms, and international trade.',
      'Equip students for the Indian Economic Service (IES), RBI Grade B, UGC-NET, and doctoral research.'
    ],
    disciplines: [
      {
        name: 'Core Economic Theory',
        desc: 'Advanced Microeconomics, Macroeconomic Analysis, Public Economics, Monetary Economics, Development Economics.'
      },
      {
        name: 'Quantitative & Applied Economics',
        desc: 'Econometric Methods, Mathematical Economics, International Trade & Finance, Indian Economic Policy, Environmental Economics.'
      }
    ],
    curriculumHighlights: [
      'Econometrics and Data Modeling Computer Laboratory.',
      'Mentorship for Indian Economic Service (IES) and RBI competitive exams.',
      'Research dissertation addressing contemporary macroeconomic challenges.'
    ],
    careerOpportunities: [
      'Economic Policy Analyst & Think Tank Researcher',
      'Economist at Banks, Financial Institutions & RBI',
      'Data & Business Analytics Associate',
      'Assistant Professor / Economics Lecturer',
      'Higher Studies: Ph.D. in Economics'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['esp', 'ehp', 'mcom', 'mba']
  },

  'ma-jmc': {
    id: 'ma-jmc',
    aliases: ['ma-jmc', 'ma_jmc', 'majmc', 'm.a-jmc', 'ma-journalism-and-mass-communication'],
    code: 'M.A JMC',
    title: 'M.A. in Journalism & Mass Communication',
    shortTitle: 'Journalism & Mass Comm',
    degree: 'Master of Arts in Journalism and Mass Communication',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Media, Communication & Journalism',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Bachelor degree in any discipline from a recognized University with minimum 45% aggregate (40% for SC/ST/Cat-I).',
    department: 'Department of Journalism & Mass Communication',
    deptId: 'dept_humanities',
    overview: 'The M.A. in Journalism and Mass Communication (MA JMC) is a professional master\'s program in multimedia journalism, broadcast news production, digital content strategy, public relations, advertising, and communication research. It trains versatile media leaders for the rapidly evolving digital media ecosystem.',
    objectives: [
      'Develop mastery in multi-platform news reporting, investigative journalism, and documentary production.',
      'Train in professional video editing, audio podcasting, and digital studio operations.',
      'Impart strategic communication, crisis PR, and media governance capabilities.'
    ],
    disciplines: [
      {
        name: 'Print & Broadcast Journalism',
        desc: 'Advanced Reporting & Editing, Broadcast Journalism, Television News Production, Radio & Podcasting, Photojournalism.'
      },
      {
        name: 'Digital Media & Strategic PR',
        desc: 'Digital & Mobile Journalism, Public Relations & Corporate Communication, Advertising Strategy, Media Laws & Ethics, Communication Research.'
      }
    ],
    curriculumHighlights: [
      'Broadcast TV news production studio and podcasting recording suite.',
      'Internships with prominent national news channels, newspapers, and digital portals.',
      'Student-produced documentary films and digital news portal.'
    ],
    careerOpportunities: [
      'Television News Anchor & Broadcast Journalist',
      'Investigative Reporter & Chief Sub-Editor',
      'Digital Media Strategist & Content Lead',
      'Corporate Communications & PR Director',
      'Documentary Filmmaker & Media Producer'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['jps', 'bvoc', 'ma-eng']
  },

  'msw': {
    id: 'msw',
    aliases: ['msw', 'master-of-social-work'],
    code: 'MSW',
    title: 'Master of Social Work (MSW)',
    shortTitle: 'Social Work',
    degree: 'Master of Social Work',
    level: 'Postgraduate (CBCS)',
    type: 'pg',
    stream: 'Social Sciences & Human Development',
    duration: '2 Years (4 Semesters)',
    eligibility: 'Bachelor degree in any discipline with minimum 45% aggregate marks (40% for SC/ST/Cat-I).',
    department: 'Department of Social Work',
    deptId: 'dept_socialwork',
    overview: 'The Master of Social Work (MSW) at St. Philomena\'s College is an acclaimed professional postgraduate program offering specialized tracks in Community Development (CD), Medical & Psychiatric Social Work (MPSW), and Human Resource Management (HRM). With 50% practical field education, graduates excel in clinical settings, international NGOs, and corporate CSR wings.',
    objectives: [
      'Train specialized social work professionals across Medical/Psychiatric, Community Development, and HRM sectors.',
      'Master clinical psychopathology, psychiatric social work, counseling, and hospital rehabilitation.',
      'Provide intensive concurrent field placements, rural social work camps, and corporate block placements.'
    ],
    disciplines: [
      {
        name: 'Community Development (CD Specialization)',
        desc: 'Rural & Urban Community Development, Tribal Development, Social Entrepreneurship, Disaster Management, NGO Governance.'
      },
      {
        name: 'Medical & Psychiatric Social Work (MPSW)',
        desc: 'Psychiatric Social Work, Hospital Social Work, Clinical Counseling, Mental Health Policy, Rehabilitation & Therapy.'
      },
      {
        name: 'Human Resource Management (HRM)',
        desc: 'Strategic HRM, Industrial Relations & Labor Laws, Organizational Development, Employee Welfare & Corporate CSR.'
      }
    ],
    curriculumHighlights: [
      'Over 500 hours of supervised concurrent field work in reputed medical institutions, psychiatric facilities, and NGOs.',
      'Annual 10-day intensive Rural Living and Community Development Camp.',
      'High placement conversion across corporate CSR, UN agencies, and healthcare organizations.'
    ],
    careerOpportunities: [
      'Psychiatric Social Worker & Clinical Counselor',
      'Medical Social Worker in Multi-Specialty Hospitals',
      'Corporate Social Responsibility (CSR) Manager',
      'HR Executive & Employee Relations Manager',
      'UN / International NGO Program Director'
    ],
    syllabusDoc: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf',
    regulationsDoc: '/assets/documents/academics/nep-2020-academic-regulations.pdf',
    relatedIds: ['bsw', 'esp', 'msc-psych']
  }
,
  'english': {
    "id": "english",
    "aliases": [
        "english",
        "ug-english",
        "optional-english",
        "ba-english",
        "eng"
    ],
    "code": "ENGLISH",
    "title": "English Language & Literary Studies (UG)",
    "shortTitle": "English Literature",
    "degree": "Bachelor of Arts in English Literature & General English",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages & Humanities",
    "duration": "3 Years (6 Semesters) / 4 Years Honours (NEP)",
    "eligibility": "Pass in 10+2 / Pre-University Examination (PUC) in Arts, Science, or Commerce stream recognized by University of Mysore.",
    "department": "Department of English & Languages",
    "deptSlug": "english",
    "deptId": "english",
    "image": "/assets/programmes/ug/english.jpg",
    "overview": "The Undergraduate English Programme at St. Philomena's College is an immersive exploration of British, Indian English, Post-Colonial, and World Literatures. The curriculum develops sharp critical thinking, creative writing proficiency, communicative phonetics, and cultural literacy.",
    "objectives": [
        "Equip students with deep literary analysis skills and historical understanding of literary movements.",
        "Develop advanced fluency in academic writing, professional communication, and creative expression.",
        "Prepare graduates for careers in publishing, journalism, civil services, content strategy, and higher academic research."
    ],
    "disciplines": [
        {
            "name": "British & World Literature",
            "desc": "From Elizabethan drama and Romantic poetry to Modernist and Post-Modernist global prose."
        },
        {
            "name": "Indian Writing in English & Translation",
            "desc": "Post-independence Indian fiction, Dalit writings, and regional literature in translation."
        },
        {
            "name": "Linguistics & Phonetics",
            "desc": "Morphology, syntax, acoustic phonetics, and communicative language teaching methodologies."
        },
        {
            "name": "Literary Criticism & Cultural Theory",
            "desc": "Structuralism, Post-colonialism, Feminist literary criticism, and Film Studies."
        }
    ],
    "curriculumHighlights": [
        "Annual National Literary Fest \"Philofest\" and inter-collegiate drama competitions.",
        "Creative Writing workshops mentored by published authors and journalists.",
        "Language Laboratory training with interactive phonetics software."
    ],
    "careerOpportunities": [
        "Journalism & Digital Media Publishing",
        "Content Strategy & Corporate Communications",
        "Civil Services & Administrative Careers",
        "Publishing Editor & Creative Writer",
        "Higher Studies: MA in English, Mass Communication, Law (LLB)"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "ba",
        "ma-eng",
        "jps"
    ]
},
  'kannada': {
    "id": "kannada",
    "aliases": [
        "kannada",
        "ug-kannada",
        "kan",
        "optional-kannada"
    ],
    "code": "KANNADA",
    "title": "Kannada Language & Classical Literature (UG)",
    "shortTitle": "Kannada Studies",
    "degree": "Bachelor of Arts / Language Discipline Core",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages & Regional Heritage",
    "duration": "3 Years (6 Semesters) / 4 Years Honours (NEP)",
    "eligibility": "Pass in 10+2 / Pre-University Examination with Kannada as a subject or mother tongue.",
    "department": "Department of Languages & Kannada",
    "deptSlug": "kannada",
    "deptId": "kannada",
    "image": "/assets/programmes/ug/kannada.jpg",
    "overview": "The Department of Kannada offers deep pedagogical immersion in Halegannada epics, Vachana Sahitya, Dasa Sahitya, modern Navodaya, Pragatisheela, and Bandaya literary movements.",
    "objectives": [
        "Foster deep appreciation for Kannada linguistic heritage, epigraphy, and classical poetics.",
        "Develop creative writing and translation skills from Kannada to English and vice-versa.",
        "Prepare students for KPSC/UPSC examinations, media broadcasting, and academic teaching."
    ],
    "disciplines": [
        {
            "name": "Classical Kannada (Halegannada)",
            "desc": "Study of Pampa, Ranna, and medieval poetic meters (Chhandassu)."
        },
        {
            "name": "Vachana & Bhakti Sahitya",
            "desc": "Philosophical and socio-cultural analysis of 12th-century Sharana literature."
        },
        {
            "name": "Modern Kannada Movements",
            "desc": "Navodaya, Navya, and Dalit-Bandaya literary paradigms and social critique."
        },
        {
            "name": "Kannada Journalism & Translation",
            "desc": "Practical news writing, scriptwriting, and literary translation."
        }
    ],
    "curriculumHighlights": [
        "Vachana Gayana and Sahitya Sammelana workshops.",
        "Manuscriptology and epigraphy field visits to historic heritage sites in Karnataka."
    ],
    "careerOpportunities": [
        "Kannada Media & Television Journalism",
        "Karnataka State Civil Services (KPSC / KAS)",
        "Language Translation & Subtitling",
        "School & College Pedagogy"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "ba",
        "esp",
        "english"
    ]
},
  'hindi': {
    "id": "hindi",
    "aliases": [
        "hindi",
        "ug-hindi",
        "hin"
    ],
    "code": "HINDI",
    "title": "Hindi Language & Literature (UG)",
    "shortTitle": "Hindi Studies",
    "degree": "Bachelor of Arts / Language Elective",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages & Humanities",
    "duration": "3 Years (6 Semesters)",
    "eligibility": "Pass in 10+2 / Pre-University Examination with Hindi as a subject or equivalent.",
    "department": "Department of Languages & Kannada",
    "deptSlug": "kannada",
    "deptId": "kannada",
    "image": "/assets/programmes/ug/hindi.jpg",
    "overview": "Comprehensive study of modern Hindi prose, classical Bhaktikal poetry (Kabir, Surdas, Tulsidas), functional Hindi (Prayojanmoolak Hindi), and commercial translation.",
    "objectives": [
        "Develop native fluency in spoken and written Hindi communication.",
        "Master administrative Hindi required for central government establishments and banking."
    ],
    "disciplines": [
        {
            "name": "Prachin & Madhyakalin Kavya",
            "desc": "Study of Kabir, Surdas, Tulsidas, and Meera Bhakti poetry."
        },
        {
            "name": "Modern Hindi Fiction & Drama",
            "desc": "Novels and plays by Premchand, Jaishankar Prasad, and Mohan Rakesh."
        },
        {
            "name": "Prayojanmoolak Hindi & Translation",
            "desc": "Official administrative correspondence, terminology, and translation techniques."
        }
    ],
    "curriculumHighlights": [
        "Hindi Diwas national symposia and debate competitions.",
        "Official language translation workshops."
    ],
    "careerOpportunities": [
        "Official Language Officer (Rajbhasha Adhikari) in Public Sector Banks",
        "Hindi Content Writer & Translator",
        "Media, Radio & Television Broadcasting"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "ba",
        "english",
        "kannada"
    ]
},
  'malayalam': {
    "id": "malayalam",
    "aliases": [
        "malayalam",
        "ug-malayalam"
    ],
    "code": "MALAYALAM",
    "title": "Malayalam Language & Cultural Studies (UG)",
    "shortTitle": "Malayalam Studies",
    "degree": "Language Elective Curriculum",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages",
    "duration": "2 to 3 Years",
    "eligibility": "Pass in 10+2 / Higher Secondary with Malayalam or recognized equivalent.",
    "department": "Department of Languages & Kannada",
    "deptSlug": "kannada",
    "deptId": "kannada",
    "image": "/assets/programmes/ug/malayalam.jpg",
    "overview": "Detailed study of Kerala literary traditions, modern poetry, short fiction, theatre, and linguistic syntax.",
    "objectives": [
        "Master literary appreciation of modern and classical Malayalam texts."
    ],
    "disciplines": [
        {
            "name": "Modern Malayalam Poetry",
            "desc": "Works of Kumaran Asan, Vallathol, and contemporary poets."
        },
        {
            "name": "Prose & Short Stories",
            "desc": "Analysis of Thakazhi, Basheer, and MT Vasudevan Nair."
        }
    ],
    "curriculumHighlights": [
        "Kerala cultural fest and literary discussions."
    ],
    "careerOpportunities": [
        "Media Journalism in Kerala Press",
        "Publishing & Translation"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "ba",
        "english",
        "tamil"
    ]
},
  'tamil': {
    "id": "tamil",
    "aliases": [
        "tamil",
        "ug-tamil"
    ],
    "code": "TAMIL",
    "title": "Tamil Classical Language & Literature (UG)",
    "shortTitle": "Tamil Studies",
    "degree": "Language Elective Curriculum",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages",
    "duration": "2 to 3 Years",
    "eligibility": "Pass in 10+2 / HSC with Tamil or recognized equivalent.",
    "department": "Department of Languages & Kannada",
    "deptSlug": "kannada",
    "deptId": "kannada",
    "image": "/assets/programmes/ug/tamil.jpg",
    "overview": "Exploration of Sangam poetry, Thirukkural moral philosophy, Silappadikaram epics, and modern Tamil fiction (Bharathiyar, Pudhumaipithan).",
    "objectives": [
        "Equip students with classical Tamil linguistic roots and modern writing competence."
    ],
    "disciplines": [
        {
            "name": "Sangam Literature & Poetics",
            "desc": "Akam and Puram poetic paradigms and Tolkappiyam grammar."
        },
        {
            "name": "Modern Tamil Literature",
            "desc": "Twentieth-century short fiction, modern drama, and journalistic prose."
        }
    ],
    "curriculumHighlights": [
        "Thiruvalluvar Day literary debates and poetry recitations."
    ],
    "careerOpportunities": [
        "Tamil Press & Digital Journalism",
        "State Administrative Services"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "ba",
        "kannada",
        "english"
    ]
},
  'urdu': {
    "id": "urdu",
    "aliases": [
        "urdu",
        "ug-urdu"
    ],
    "code": "URDU",
    "title": "Urdu Language & Ghazal Literature (UG)",
    "shortTitle": "Urdu Studies",
    "degree": "Bachelor of Arts / Language Elective",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages",
    "duration": "3 Years (6 Semesters)",
    "eligibility": "Pass in 10+2 / PUC with Urdu or equivalent qualification.",
    "department": "Department of Languages & Kannada",
    "deptSlug": "kannada",
    "deptId": "kannada",
    "image": "/assets/programmes/ug/urdu.jpg",
    "overview": "Rigorous exploration of Urdu classical poetry (Mir Taqi Mir, Mirza Ghalib, Allama Iqbal, Faiz Ahmed Faiz), Dastan prose, and Nastaliq calligraphy.",
    "objectives": [
        "Develop literary command over Urdu poetry, rhetoric, and modern fiction."
    ],
    "disciplines": [
        {
            "name": "Classical Urdu Ghazal",
            "desc": "Metrics, symbolism, and philosophical dimensions of Ghalib and Iqbal."
        },
        {
            "name": "Modern Urdu Afsana (Short Fiction)",
            "desc": "Narratives of Saadat Hasan Manto, Premchand, and Ismat Chughtai."
        }
    ],
    "curriculumHighlights": [
        "Annual Mehfil-e-Mushaira and calligraphy exhibitions."
    ],
    "careerOpportunities": [
        "Urdu Journalism & Media",
        "Translation & Cultural Heritage Documentation"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "ba",
        "persian",
        "arabic"
    ]
},
  'french': {
    "id": "french",
    "aliases": [
        "french",
        "ug-french"
    ],
    "code": "FRENCH",
    "title": "French Foreign Language & Francophone Studies (UG)",
    "shortTitle": "French Studies",
    "degree": "Foreign Language Elective (DELF A1/A2 Aligned)",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages",
    "duration": "2 to 3 Years",
    "eligibility": "Pass in 10+2 / PUC in any stream with interest in European languages.",
    "department": "Department of Languages & Kannada",
    "deptSlug": "kannada",
    "deptId": "kannada",
    "image": "/assets/programmes/ug/french.jpg",
    "overview": "DELF-aligned communicative French program covering oral fluency, listening comprehension, grammar, and Francophone cultural history.",
    "objectives": [
        "Achieve certified DELF A1/A2 communicative proficiency in French."
    ],
    "disciplines": [
        {
            "name": "Communicative French & Phonetics",
            "desc": "Conversational fluency, role-playing, and pronunciation mastery."
        },
        {
            "name": "Grammar & Professional Writing",
            "desc": "Sentence structures, business correspondence, and comprehension."
        }
    ],
    "curriculumHighlights": [
        "Francophonie Day celebrations and French cinema screenings."
    ],
    "careerOpportunities": [
        "International Tourism & Hospitality",
        "Multinational Corporations (MNCs)",
        "Foreign Embassies & Translation"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "bba-th",
        "english",
        "bba"
    ]
},
  'arabic': {
    "id": "arabic",
    "aliases": [
        "arabic",
        "ug-arabic"
    ],
    "code": "ARABIC",
    "title": "Arabic Classical & Modern Standard Language (UG)",
    "shortTitle": "Arabic Studies",
    "degree": "Bachelor of Arts / Language Elective",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages",
    "duration": "3 Years (6 Semesters)",
    "eligibility": "Pass in 10+2 / PUC with Arabic or equivalent examination.",
    "department": "Department of Languages & Kannada",
    "deptSlug": "kannada",
    "deptId": "kannada",
    "image": "/assets/programmes/ug/arabic.jpg",
    "overview": "Instruction in Modern Standard Arabic (MSA), classical Arabic grammar (Nahw & Sarf), commercial correspondence, and translation.",
    "objectives": [
        "Master written and conversational Arabic for academic and commercial applications."
    ],
    "disciplines": [
        {
            "name": "Modern Standard Arabic",
            "desc": "Daily conversational dialogues, reading comprehension, and news syntax."
        },
        {
            "name": "Classical Grammar & Literature",
            "desc": "Nahw, Sarf, rhetoric (Balaghah), and classical pre-Islamic and Islamic prose."
        }
    ],
    "curriculumHighlights": [
        "Arabic calligraphy workshops and translation labs."
    ],
    "careerOpportunities": [
        "Embassy Translator & Commercial Consultant",
        "Middle East Corporate Liaison"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "ba",
        "persian",
        "urdu"
    ]
},
  'persian': {
    "id": "persian",
    "aliases": [
        "persian",
        "ug-persian"
    ],
    "code": "PERSIAN",
    "title": "Persian Language & Indo-Persian Heritage (UG)",
    "shortTitle": "Persian Studies",
    "degree": "Language Elective Curriculum",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages",
    "duration": "2 to 3 Years",
    "eligibility": "Pass in 10+2 / PUC in any stream.",
    "department": "Department of Languages & Kannada",
    "deptSlug": "kannada",
    "deptId": "kannada",
    "image": "/assets/programmes/ug/persian.jpg",
    "overview": "Exploration of classical Persian poetry (Rumi, Hafiz, Saadi, Omar Khayyam), Indo-Persian historical manuscripts, and modern Farsi conversation.",
    "objectives": [
        "Learn manuscript reading and classical poetic appreciation in Persian."
    ],
    "disciplines": [
        {
            "name": "Classical Persian Poetry",
            "desc": "Gulistan of Saadi, Divan-e-Hafiz, and Masnavi of Rumi."
        },
        {
            "name": "Farsi Grammar & Indo-Persian Texts",
            "desc": "Mughal and Deccan court records, epigraphy, and basic spoken Farsi."
        }
    ],
    "curriculumHighlights": [
        "Manuscript preservation and archival study."
    ],
    "careerOpportunities": [
        "Historical Archives & Museum Curatorship",
        "Diplomatic & Academic Translation"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "ba",
        "urdu",
        "arabic"
    ]
},
  'environmental-studies': {
    "id": "environmental-studies",
    "aliases": [
        "environmental-studies",
        "evs",
        "environmental-science"
    ],
    "code": "EVS",
    "title": "Environmental Studies (Compulsory Ability Enhancement Course)",
    "shortTitle": "Environmental Studies",
    "degree": "Mandatory Ability Enhancement Course (AEC - NEP 2020)",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Interdisciplinary Science",
    "duration": "1 Semester (All UG Streams)",
    "eligibility": "Enrolled in any undergraduate degree programme at St. Philomena's College.",
    "department": "Department of Physical & Biological Sciences",
    "deptSlug": "chemistry",
    "deptId": "chemistry",
    "image": "/assets/programmes/ug/environmental-studies.jpg",
    "overview": "Mandatory interdisciplinary course empowering students with critical knowledge of ecological systems, biodiversity conservation, sustainable resource management, climate action, and environmental jurisprudence.",
    "objectives": [
        "Instill ecological awareness and environmental ethics in all undergraduate students.",
        "Equip learners with practical tools for waste management, water harvesting, and renewable energy adoption."
    ],
    "disciplines": [
        {
            "name": "Ecosystem Dynamics & Biodiversity",
            "desc": "Structure of terrestrial and aquatic biomes, biodiversity hotspots in India, and endangered species protection."
        },
        {
            "name": "Pollution Control & Climate Action",
            "desc": "Air, water, soil, and electronic waste management, global warming, carbon footprint reduction."
        },
        {
            "name": "Environmental Law & Policy",
            "desc": "The Environment (Protection) Act, National Green Tribunal (NGT), and community environmental activism."
        }
    ],
    "curriculumHighlights": [
        "Compulsory field study to local ecosystems (Chamundi Hills, Ranganathittu Bird Sanctuary, Kukkarahalli Lake).",
        "Campus plastic audit and green campus initiatives."
    ],
    "careerOpportunities": [
        "Environmental Impact Assessment (EIA) Support",
        "Corporate Sustainability & ESG Compliance",
        "NGOs and Conservation Agencies"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "bsc",
        "cbz",
        "life-skills"
    ]
},
  'life-skills': {
    "id": "life-skills",
    "aliases": [
        "life-skills",
        "value-education",
        "soft-skills"
    ],
    "code": "LIFE-SKILLS",
    "title": "Life Skills & Professional Value Education",
    "shortTitle": "Life Skills",
    "degree": "Mandatory Skill Enhancement Course (SEC - NEP 2020)",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Humanities & Value Education",
    "duration": "1 Semester (All UG Streams)",
    "eligibility": "Enrolled in any undergraduate degree programme at St. Philomena's College.",
    "department": "Department of Humanities & Social Sciences",
    "deptSlug": "humanities",
    "deptId": "humanities",
    "image": "/assets/programmes/ug/life-skills.jpg",
    "overview": "A transformative skill enhancement module designed to build emotional resilience, critical thinking, ethical leadership, effective interpersonal communication, and mental health awareness.",
    "objectives": [
        "Empower students with self-awareness, emotional intelligence, and stress management coping mechanisms.",
        "Develop strong workplace etiquette, conflict resolution skills, and empathy."
    ],
    "disciplines": [
        {
            "name": "Emotional Intelligence & Mindfulness",
            "desc": "Self-regulation, positive psychology, overcoming anxiety, and resilience building."
        },
        {
            "name": "Communication & Leadership",
            "desc": "Active listening, public speaking, assertive communication, and team leadership."
        },
        {
            "name": "Universal Human Values & Professional Ethics",
            "desc": "Constitutional values, gender sensitivity, digital ethics, and integrity in public life."
        }
    ],
    "curriculumHighlights": [
        "Interactive role-playing, group discussions, and personality development workshops.",
        "Guest sessions by professional clinical psychologists and corporate leaders."
    ],
    "careerOpportunities": [
        "Essential foundational competencies for all corporate and civil service career pathways."
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "ba",
        "bsw",
        "environmental-studies"
    ]
},
  'physical-education': {
    "id": "physical-education",
    "aliases": [
        "physical-education",
        "sports",
        "phy-ed"
    ],
    "code": "PHY-ED",
    "title": "Physical Education, Health & Sports Science",
    "shortTitle": "Physical Education",
    "degree": "Mandatory Co-Curricular Credit Course (NEP 2020)",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Health & Sports Science",
    "duration": "1 Semester (All UG Streams)",
    "eligibility": "Enrolled in any undergraduate degree programme at St. Philomena's College.",
    "department": "Department of Physical Education & Sports",
    "deptSlug": "humanities",
    "deptId": "humanities",
    "image": "/assets/programmes/ug/physical-education.jpg",
    "overview": "Comprehensive sports science and wellness training emphasizing physical fitness, yoga asanas, cardiovascular endurance, sports nutrition, and athletic discipline.",
    "objectives": [
        "Promote lifelong physical wellness and healthy lifestyle habits among college students.",
        "Develop sportsmanship, teamwork, and competitive athletic skills."
    ],
    "disciplines": [
        {
            "name": "Physical Fitness & Biomechanics",
            "desc": "Components of physical fitness: strength, speed, stamina, agility, and flexibility."
        },
        {
            "name": "Yoga & Stress Management",
            "desc": "Pranayama, classical asanas, meditation, and relaxation techniques."
        },
        {
            "name": "Sports Nutrition & First Aid",
            "desc": "Dietary planning for athletes, hydration strategies, and sports injury first-aid management."
        }
    ],
    "curriculumHighlights": [
        "Hands-on training in the multi-purpose indoor stadium, outdoor sports ground, and gymnasium.",
        "Annual Philomena Sports Meet and inter-collegiate tournament participation."
    ],
    "careerOpportunities": [
        "Fitness Training & Gym Management",
        "Yoga Instructor Certification",
        "Sports Administration & Coaching"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "bsc",
        "bca",
        "life-skills"
    ]
}
,
  'bsc': {
    "id": "bsc",
    "aliases": [
        "bsc",
        "b-sc",
        "bachelor-of-science",
        "b.sc"
    ],
    "code": "B.Sc",
    "title": "Bachelor of Science (B.Sc - Physical & Biological Sciences)",
    "shortTitle": "Bachelor of Science",
    "degree": "Bachelor of Science (NEP 2020)",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Physical, Chemical & Biological Sciences",
    "duration": "3 Years (6 Semesters) / 4 Years Honours (NEP)",
    "eligibility": "Pass in 10+2 / Pre-University Examination (PUC) with Science subjects (Physics, Chemistry, Mathematics / Biology / Biotechnology / Computer Science) with minimum 45% aggregate (40% for SC/ST).",
    "department": "Department of Physical & Biological Sciences",
    "deptSlug": "physics",
    "deptId": "physics",
    "image": "/assets/programmes/ug/b-sc.jpg",
    "overview": "The Bachelor of Science (B.Sc) at St. Philomena's College is an autonomous NEP 2020 multidisciplinary degree offering cutting-edge laboratory training across Physical Sciences (Physics, Chemistry, Mathematics, Computer Science, Electronics) and Biological Sciences (Biochemistry, Biotechnology, Botany, Zoology, Food Science & Nutrition).",
    "objectives": [
        "Provide rigorous theoretical knowledge and hands-on laboratory mastery in fundamental and applied sciences.",
        "Foster analytical scientific inquiry, data analysis, research methodology, and computational modeling.",
        "Prepare graduates for prestigious postgraduate research (M.Sc, Integrated Ph.D.) and high-growth industry careers in pharmaceuticals, data science, biotechnology, and analytics."
    ],
    "disciplines": [
        {
            "name": "Physical Sciences Combinations",
            "desc": "PCM (Physics, Chemistry, Maths), PMC (Physics, Maths, Computer Science), PME (Physics, Maths, Electronics), CME (Computer Science, Maths, Electronics)."
        },
        {
            "name": "Biological Sciences Combinations",
            "desc": "CBZ (Chemistry, Botany, Zoology), BCH (Biochemistry, Chemistry, Human Nutrition), BtCZ (Biotech, Chemistry, Zoology), BtCB (Biotech, Chemistry, Botany)."
        },
        {
            "name": "Advanced Laboratory Experiments",
            "desc": "Hands-on practicals in spectroscopy, chromatography, wet chemistry, digital electronics, and microbial cell culture."
        },
        {
            "name": "Research Project & Internship",
            "desc": "Mandatory undergraduate capstone research dissertation and industrial training in Semesters 5 and 6."
        }
    ],
    "curriculumHighlights": [
        "DBT Star College supported advanced instrumentation laboratories.",
        "DST-FIST funded research centers and high-precision analytical equipment.",
        "Active student scientific clubs: Newton Physics Club, Curie Chemistry Forum, Ramanujan Mathematics Society."
    ],
    "careerOpportunities": [
        "Scientific Research Assistant & Laboratory Analyst",
        "Pharmaceutical, Chemical & Quality Control Specialist",
        "Software Developer & Data Analyst (for PMC/CME graduates)",
        "Biotech & Food Quality Assurance Officer",
        "Higher Studies: M.Sc in Physics, Chemistry, Mathematics, Biotech, Data Science"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "pcm",
        "pmc",
        "cbz",
        "bch"
    ]
},
  'ba': {
    "id": "ba",
    "aliases": [
        "ba",
        "b-a",
        "bachelor-of-arts",
        "b.a"
    ],
    "code": "BA",
    "title": "Bachelor of Arts (BA - Humanities & Social Sciences)",
    "shortTitle": "Bachelor of Arts",
    "degree": "Bachelor of Arts (NEP 2020)",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Humanities & Social Sciences",
    "duration": "3 Years (6 Semesters) / 4 Years Honours (NEP)",
    "eligibility": "Pass in 10+2 / Pre-University Examination (PUC) in Arts, Science, or Commerce stream recognized by University of Mysore.",
    "department": "Department of Humanities & Social Sciences",
    "deptSlug": "humanities",
    "deptId": "humanities",
    "image": "/assets/programmes/ug/ba.jpg",
    "overview": "The Bachelor of Arts (BA) program provides a multi-disciplinary liberal arts education designed to develop critical inquiry, socio-economic analysis, historical understanding, philosophical clarity, and journalistic communication.",
    "objectives": [
        "Cultivate critical understanding of social structures, economic policies, governance, and human psychology.",
        "Develop sharp communicative, research, and argumentative writing skills.",
        "Equip students for competitive civil services (UPSC / KPSC), media journalism, public policy, and academic teaching."
    ],
    "disciplines": [
        {
            "name": "Economics & Public Policy",
            "desc": "Macroeconomics, development economics, Indian financial systems, and econometrics."
        },
        {
            "name": "Sociology & Social Transformation",
            "desc": "Sociological theories, Indian social problems, urban-rural development, and research methods."
        },
        {
            "name": "Political Science & Governance",
            "desc": "Indian constitution, political theory, international relations, and public administration."
        },
        {
            "name": "Journalism & Mass Media",
            "desc": "Print journalism, broadcast media, digital content creation, and public relations."
        }
    ],
    "curriculumHighlights": [
        "Comprehensive preparation and mentoring forum for UPSC / KPSC civil service aspirants.",
        "Field survey research in rural and urban development sectors.",
        "Active social science forums: Kautilya Economics Club and Philo Media Cell."
    ],
    "careerOpportunities": [
        "Civil Services (IAS / IPS / KAS) & Public Administration",
        "Print, Broadcast & Digital Media Journalism",
        "Policy Research & Non-Governmental Organizations (NGOs)",
        "Human Resources & Corporate Public Relations",
        "Higher Studies: MA in Economics, English, Mass Communication, MSW, Law (LLB)"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": [
        "esp",
        "jps",
        "bsw",
        "english"
    ]
},
  'telugu': {
    "id": "telugu",
    "aliases": ["telugu", "ug-telugu"],
    "code": "TELUGU",
    "title": "Telugu Language & Classical Literature (UG)",
    "shortTitle": "Telugu Studies",
    "degree": "Language Elective (UG)",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages",
    "duration": "2 to 3 Years",
    "eligibility": "Pass in 10+2 / PUC with Telugu as a subject or studied at secondary school level.",
    "department": "Department of Languages & Kannada",
    "deptSlug": "kannada",
    "deptId": "kannada",
    "image": "/assets/programmes/ug/kannada.jpg",
    "overview": "Rigorous curriculum covering classical and modern Telugu poetry, prose, drama, grammar, and literary criticism under NEP 2020 framework.",
    "objectives": [
      "Mastery of classical and modern Telugu literary texts and grammar.",
      "Develop translation and creative writing skills in Telugu."
    ],
    "disciplines": [
      { "name": "Classical Poetry & Prabandha Literature", "desc": "Nannaya, Tikkana, Errana and medieval Prabandha masterpieces." },
      { "name": "Modern Telugu Literature & Translation", "desc": "Gurajada Apparao, Sri Sri, modern prose, short stories, and translation." }
    ],
    "curriculumHighlights": [
      "Telugu Bhasha Dinotsavam and Sahiti Goshti literary workshops."
    ],
    "careerOpportunities": [
      "Content Writing, Regional Media & Journalism",
      "Civil Services Indian Language Paper",
      "Teaching and Regional Language Translation"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": ["kannada", "tamil", "english"]
  },
  'sanskrit': {
    "id": "sanskrit",
    "aliases": ["sanskrit", "ug-sanskrit"],
    "code": "SANSKRIT",
    "title": "Sanskrit Classical Literature & Vedic Studies (UG)",
    "shortTitle": "Sanskrit Studies",
    "degree": "Language Elective (UG)",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Languages",
    "duration": "2 to 3 Years",
    "eligibility": "Pass in 10+2 / PUC with Sanskrit / basic knowledge of Devanagari script.",
    "department": "Department of Languages & Kannada",
    "deptSlug": "kannada",
    "deptId": "kannada",
    "image": "/assets/programmes/ug/kannada.jpg",
    "overview": "Comprehensive instruction in classical Sanskrit literature, Paninian grammar, Subhashitas, Nataka, and philosophical treatises.",
    "objectives": [
      "Deep linguistic comprehension of classical Sanskrit drama and Subhashitas.",
      "Understanding Vedic ethos, Paninian Vyakarana, and Epics."
    ],
    "disciplines": [
      { "name": "Classical Drama & Kavya", "desc": "Kalidasa's Shakuntalam, Raghuvamsha, and Bhasa's plays." },
      { "name": "Grammar & Philosophical Texts", "desc": "Paninian sandhi, samasa, karaka, and Bhagavad Gita selections." }
    ],
    "curriculumHighlights": [
      "Sanskrit Day celebrations and Shloka recitation competitions."
    ],
    "careerOpportunities": [
      "Indology & Epigraphical Research",
      "Ayurvedic and Manuscriptology Translation",
      "Academic Teaching & Civil Services Elective"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": ["hindi", "kannada", "english"]
  },
  'constitution-of-india': {
    "id": "constitution-of-india",
    "aliases": ["constitution-of-india", "constitution", "indian-constitution"],
    "code": "CONSTITUTION",
    "title": "Constitution of India & Democratic Governance (Mandatory Foundation)",
    "shortTitle": "Constitution of India",
    "degree": "Mandatory Ability Enhancement Compulsory Course (AECC)",
    "level": "Undergraduate (NEP 2020)",
    "type": "ug",
    "stream": "Foundation",
    "duration": "1 Semester",
    "eligibility": "Mandatory for all 1st / 2nd Semester UG Degree Students.",
    "department": "Department of Humanities & Social Sciences",
    "deptSlug": "humanities",
    "deptId": "humanities",
    "image": "/assets/programmes/ug/environmental-studies.jpg",
    "overview": "Foundational course imparting deep constitutional literacy, fundamental rights, directive principles, parliamentary democracy, and civic duties.",
    "objectives": [
      "Instill profound knowledge of the Preamble, Fundamental Rights, and Duties.",
      "Understand the structure and powers of the Union and State Executive and Judiciary."
    ],
    "disciplines": [
      { "name": "Constitutional Philosophy & Fundamental Rights", "desc": "Historical making, Preamble, Articles 12-35, and Judicial Review." },
      { "name": "Union & State Governance Machinery", "desc": "President, Prime Minister, Parliament, Supreme Court, and Federalism." }
    ],
    "curriculumHighlights": [
      "Constitution Day (Samvidhan Divas) and Mock Youth Parliament."
    ],
    "careerOpportunities": [
      "UPSC / KPSC Public Service Examinations",
      "Legal Studies & Public Policy",
      "Civic Governance & Administrative Careers"
    ],
    "syllabusDoc": "/assets/documents/syllabus/ug-nep-syllabus-2026.pdf",
    "regulationsDoc": "/assets/documents/academics/nep-2020-academic-regulations.pdf",
    "relatedIds": ["ba", "esp", "environmental-studies"]
  }
};

// Normalized lookup function that resolves codes, IDs, and aliases
export function getProgrammeByCode(codeOrSlug) {
  if (!codeOrSlug) return null;
  const clean = String(codeOrSlug).trim().toLowerCase().replace(/[^a-z0-9-]/g, '');
  
  // Direct ID check
  if (PROGRAMME_DETAILS[clean]) {
    return PROGRAMME_DETAILS[clean];
  }

  // Alias / Code match check
  for (const prog of Object.values(PROGRAMME_DETAILS)) {
    if (prog.id === clean || prog.code.toLowerCase().replace(/[^a-z0-9-]/g, '') === clean) {
      return prog;
    }
    if (prog.aliases && prog.aliases.some(a => a.replace(/[^a-z0-9-]/g, '') === clean)) {
      return prog;
    }
  }

  // Fallback fuzzy match (e.g. "b-com" -> "bcom", "bba_th" -> "bba-th", "msc-chemistry" -> "msc-chem")
  const simplified = clean.replace(/-/g, '');
  for (const prog of Object.values(PROGRAMME_DETAILS)) {
    if (prog.id.replace(/-/g, '') === simplified) return prog;
    if (prog.code.toLowerCase().replace(/[^a-z0-9]/g, '') === simplified) return prog;
  }

  return null;
}
