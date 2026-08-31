// Canonical Master MegaMenu Navigation Data for St. Philomena's College (Autonomous), Mysuru
// 100% Content Parity with Official Source (stphilos.ac.in)
// All Links Route Internally to Local React Pages - Zero Direct File Downloads

export const MEGA_MENU_DATA = {
  // 1. ABOUT US (History, Leadership, Governance, Infrastructure, Policies)
  about: {
    title: 'About St. Philomena\'s College',
    path: '/about',
    type: 'tabbed',
    description: 'Explore eight decades of Catholic educational excellence, heritage, and autonomous academic governance.',
    tabs: [
      {
        id: 'history',
        num: '01',
        label: 'Our Heritage & History',
        heading: 'Heritage & Legacy (Est. 1946)',
        description: 'Founded by His Excellency Rt. Rev. Dr. Rene Feuga, Bishop of Mysore, with the blessing of His Highness Maharaja Jayachamarajendra Wadiyar.',
        ctaText: 'Read Full History →',
        ctaPath: '/about?tab=history',
        links: [
          { label: 'Founding Vision & Patron Saint', path: '/about?tab=history' },
          { label: 'Historical Timeline & Milestones', path: '/about?tab=history' },
          { label: 'The Iconic Gothic Cathedral Campus', path: '/about?tab=history' }
        ],
        featured: {
          title: 'A Legacy of 79 Years',
          subtitle: 'Founded in 1946',
          description: 'Pioneering higher education in Mysuru with NAAC B++ Accreditation.',
          image: '/media/gallery/campus/campus_chapel.jpg',
          ctaText: 'Explore Campus Heritage →',
          ctaPath: '/about?tab=history'
        }
      },
      {
        id: 'leadership',
        num: '02',
        label: 'Leadership & Management',
        heading: 'Visionary Leadership',
        description: 'Guided by the Catholic Diocese of Mysore and the Mysore Diocesan Educational Society (MDES).',
        ctaText: 'Meet Leadership →',
        ctaPath: '/about?tab=leadership',
        links: [
          { label: 'Bishop & Patron\'s Message', path: '/about?tab=leadership' },
          { label: 'Rector & Secretary\'s Office', path: '/about?tab=leadership' },
          { label: 'Principal & Vice Principals', path: '/about?tab=leadership' }
        ],
        featured: {
          title: 'MDES Governance',
          subtitle: 'Diocese of Mysore',
          description: 'Dedicated administration shaping global citizens through ethical values.',
          image: '/media/gallery/campus/campus_admin_block.jpg',
          ctaText: 'View Administration →',
          ctaPath: '/about?tab=leadership'
        }
      },
      {
        id: 'governance',
        num: '03',
        label: 'Statutory Governance',
        heading: 'Autonomous Academic Governance',
        description: 'Constitutional bodies ensuring pedagogical quality, curricular innovation, and financial integrity.',
        ctaText: 'View Governance Bodies →',
        ctaPath: '/compliance/statutory-bodies',
        links: [
          { label: 'Governing Body Council', path: '/compliance/statutory-bodies' },
          { label: 'Academic Council (NEP / CBCS)', path: '/compliance/statutory-bodies' },
          { label: 'Board of Studies (BOS) Panels', path: '/compliance/statutory-bodies' }
        ],
        featured: {
          title: 'UGC Autonomy',
          subtitle: 'Conferred Status',
          description: 'Empowered to design autonomous curricula and modern examination schemes.',
          image: '/media/gallery/campus/campus_quadrangle.jpg',
          ctaText: 'Explore Statutory Bodies →',
          ctaPath: '/compliance/statutory-bodies'
        }
      },
      {
        id: 'infrastructure',
        num: '04',
        label: 'Campus Infrastructure',
        heading: 'World-Class 28-Acre Campus',
        description: 'Modern science laboratories, digital library, indoor sports stadium, audio-visual auditoriums, and hostel complexes.',
        ctaText: 'Tour Facilities →',
        ctaPath: '/about?tab=infrastructure',
        links: [
          { label: 'Advanced Science & Research Labs', path: '/about?tab=infrastructure' },
          { label: 'Central Library & Digital Commons', path: '/resources' },
          { label: 'Indoor Stadium & Athletics Complex', path: '/student-support' }
        ],
        featured: {
          title: 'State-of-the-Art Labs',
          subtitle: 'DBT Star & DST-FIST',
          description: 'Cutting-edge instrumentation for physical, life, and computational sciences.',
          image: '/assets/images/facilities/academic_lab.jpg',
          ctaText: 'View Campus Gallery →',
          ctaPath: '/gallery'
        }
      }
    ]
  },

  // 2. ACADEMICS (Degree Programmes & Curriculum)
  academics: {
    title: 'Academic Structure & Programmes',
    path: '/academics',
    type: 'columns',
    columns: [
      {
        heading: 'Undergraduate Degrees (NEP)',
        items: [
          { label: 'B.Com [Bachelor of Commerce]', path: '/academics/bcom' },
          { label: 'B.Sc [Bachelor of Science]', path: '/academics/bsc' },
          { label: 'BCA [Bachelor of Computer Applications]', path: '/academics/bca' },
          { label: 'BA [Bachelor of Arts]', path: '/academics/ba' },
          { label: 'B.S.W [Bachelor of Social Work]', path: '/academics/bsw' },
          { label: 'B.Voc [Vocational Disciplines]', path: '/academics/bvoc' },
          { label: 'B.B.A.T.H [Tourism & Hospitality]', path: '/academics/bba-th' },
          { label: 'B.B.A [Business Administration]', path: '/academics/bba' }
        ]
      },
      {
        heading: 'Postgraduate Degrees (CBCS)',
        items: [
          { label: 'M.Sc (Chemistry, Physics, Maths)', path: '/academics/msc-chem' },
          { label: 'M.Sc Computer Science & Data', path: '/academics/msc-cs' },
          { label: 'M.Com & Corporate Finance', path: '/academics/mcom' },
          { label: 'MBA (AICTE Approved)', path: '/academics/mba' },
          { label: 'MCA (AICTE Approved)', path: '/academics/mca' },
          { label: 'MSW (Master of Social Work)', path: '/academics/msw' },
          { label: 'MA English & Economics', path: '/academics/ma-eng' }
        ]
      },
      {
        heading: 'Languages & Academic Resources',
        items: [
          { label: 'Kannada Language & Literature', path: '/academics/kannada' },
          { label: 'English Language & Literature', path: '/academics/english' },
          { label: 'Hindi / Malayalam / Tamil / Urdu', path: '/academics/hindi' },
          { label: 'French & Foreign Languages', path: '/academics/french' },
          { label: 'Autonomous Regulations Manual', path: '/compliance/autonomy-approval' },
          { label: 'Course Outcomes & OBE Framework', path: '/compliance/ugc-compliance-report' }
        ]
      }
    ],
    featured: {
      title: 'UG & PG Programme Directory',
      subtitle: 'NEP 2020 Multi-Disciplinary Degrees',
      description: 'Choice Based Credit System with outcome-based learning and research.',
      image: '/media/gallery/campus/campus_science_block.jpg',
      ctaText: 'Explore All Programmes →',
      ctaPath: '/academics'
    }
  },

  // 3. DEPARTMENTS (Academic Faculties)
  departments: {
    title: 'Academic Departments Directory',
    path: '/departments',
    type: 'columns',
    columns: [
      {
        heading: 'Science & Technology',
        items: [
          { label: 'Department of Computer Science', path: '/departments/computer-science' },
          { label: 'Department of Physics', path: '/departments/physics' },
          { label: 'Department of Chemistry', path: '/departments/chemistry' },
          { label: 'Department of Mathematics', path: '/departments/mathematics' },
          { label: 'Biotechnology & Biochemistry', path: '/departments/biotech' }
        ]
      },
      {
        heading: 'Commerce & Management',
        items: [
          { label: 'Commerce & Accountancy', path: '/departments/commerce' },
          { label: 'Business Administration (BBA)', path: '/departments/business-administration' },
          { label: 'Tourism & Hospitality', path: '/departments/business-administration' }
        ]
      },
      {
        heading: 'Humanities & Social Sciences',
        items: [
          { label: 'Department of Economics', path: '/departments/economics' },
          { label: 'Department of Social Work', path: '/departments/social-work' },
          { label: 'Department of English', path: '/departments/english' }
        ]
      }
    ],
    featured: {
      title: 'Department Directory',
      subtitle: 'Faculty & Lab Resources',
      description: 'Explore research faculty, specialized laboratories, and student outcomes.',
      image: '/assets/images/facilities/academic_lab.jpg',
      ctaText: 'View All Departments →',
      ctaPath: '/departments'
    }
  },

  // 4. ADMISSIONS (Official Prospectus, Fees Structure & Guidelines)
  admissions: {
    title: 'Admissions Portal 2026–27',
    path: '/admissions',
    type: 'admissions',
    columns: [
      {
        heading: 'Admissions & Guidelines',
        items: [
          { label: 'Official Prospectus 2026–27', path: '/admissions' },
          { label: 'Fee Structure Breakdown 2026–27', path: '/compliance/fee-structure' },
          { label: 'UG Admission Guidelines', path: '/admissions' },
          { label: 'Online Admission Application', path: '/admissions' }
        ]
      },
      {
        heading: 'Schedules & Compliance',
        items: [
          { label: 'Institutional Academic Calendar', path: '/examinations' },
          { label: 'UGC Fee Refund Policy', path: '/compliance/ugc-refund-policy' },
          { label: 'State Scholarship Portal (SSP)', path: 'https://ssp.postmatric.karnataka.gov.in/homepage.aspx', isExternal: true },
          { label: 'Stakeholders Feedback Process', path: '/iqac' }
        ]
      },
      {
        heading: 'Student Amenities & Hostel',
        items: [
          { label: 'On-Campus Boys & Girls Hostel', path: '/student-support' },
          { label: 'Admissions Helpdesk & Contact', path: '/contact' },
          { label: 'Campus Tour & Blocks', path: '/about?tab=history' }
        ]
      }
    ],
    featured: {
      title: 'Admissions 2026–27',
      subtitle: 'Merit & Quota Enrollment',
      description: 'Apply online for UG & PG degree programmes with merit scholarships.',
      image: '/media/gallery/campus/campus_admin_block.jpg',
      ctaText: 'Start Application →',
      ctaPath: '/admissions'
    }
  },

  // 5. EXAMINATIONS (Autonomous COE Portal)
  examinations: {
    title: 'Autonomous Examinations Portal (COE)',
    path: '/examinations',
    type: 'columns',
    columns: [
      {
        heading: 'Timetables & Notifications',
        items: [
          { label: 'End-Semester Examination Timetable', path: '/examinations' },
          { label: 'Latest COE Examination Notifications', path: '/examinations' },
          { label: 'Institutional Academic Calendar', path: '/examinations' },
          { label: 'Hall Ticket & Seating Arrangements', path: '/examinations' }
        ]
      },
      {
        heading: 'Results & Evaluation',
        items: [
          { label: 'Autonomous Semester Results Portal', path: '/examinations' },
          { label: 'Revaluation & Photocopy Guidelines', path: '/examinations' },
          { label: 'DirectVerify Credential Authentication', path: '/compliance/online-certificate-verification' },
          { label: 'Autonomous COE Evaluation Policy', path: '/compliance/coe' }
        ]
      },
      {
        heading: 'COE Grievance Redressal',
        items: [
          { label: 'Examination Grievance Committee', path: '/compliance/student-grievance-committee' },
          { label: 'Controller of Examinations Office', path: '/contact' }
        ]
      }
    ],
    featured: {
      title: 'Controller of Examinations',
      subtitle: 'Autonomous Evaluation System',
      description: 'Continuous internal assessment (CIA), semester-end exams, and results.',
      image: '/assets/images/facilities/research_conference_hall.jpg',
      ctaText: 'Access Exam Portal →',
      ctaPath: '/examinations'
    }
  },

  // 6. RESEARCH & RESOURCES (R&D Cell, Publications, E-Journals)
  research: {
    title: 'Research & Resources Portal',
    path: '/research',
    type: 'tabbed',
    description: 'Fostering interdisciplinary inquiry, doctoral guidance, patent filings, and industry collaborations.',
    tabs: [
      {
        id: 'rdc',
        num: '01',
        label: 'Research & Development Cell',
        heading: 'Research & Development Cell (RDC)',
        description: 'The RDC coordinates sponsored research projects, seed money grants for faculty, and interdisciplinary research initiatives.',
        ctaText: 'Explore R&D Cell →',
        ctaPath: '/research',
        links: [
          { label: 'Research & Development Cell Policy', path: '/research' },
          { label: 'Major & Minor Research Grants (UGC/DST)', path: '/research' },
          { label: 'Faculty Research Publications', path: '/faculty' }
        ],
        featured: {
          title: 'R&D Cell Policy',
          subtitle: 'Grants & Ethics Guidelines',
          description: 'Guidelines for seed funding, journal publications, and ethical clearance.',
          image: '/media/gallery/campus/campus_pg_research_block.jpg',
          ctaText: 'View RDC Details →',
          ctaPath: '/research'
        }
      },
      {
        id: 'patents',
        num: '02',
        label: 'Patents & Publications',
        heading: 'Intellectual Property & Publications',
        description: 'Faculty and research scholars publish in peer-reviewed Scopus and UGC-CARE listed journals, alongside active patent filings.',
        ctaText: 'View Publications →',
        ctaPath: '/research',
        links: [
          { label: 'Faculty Patent Filings & Grants', path: '/research' },
          { label: 'Philos Bulletin E-Journal', path: '/research' },
          { label: 'MOUs & Academic Collaborations', path: '/research' }
        ],
        featured: {
          title: 'Patents & IPR',
          subtitle: 'Innovation Disclosures',
          description: 'Institutional support for patent searches, drafting, and commercialization.',
          image: '/assets/images/facilities/academics_science_lab.jpg',
          ctaText: 'View IPR Portfolio →',
          ctaPath: '/research'
        }
      },
      {
        id: 'iic',
        num: '03',
        label: 'Institution\'s Innovation Council',
        heading: 'IIC & National Innovation Policy',
        description: 'Ministry of Education Innovation Cell (MIC) certified council promoting student entrepreneurship, hackathons, and startup incubations.',
        ctaText: 'View IIC Portal →',
        ctaPath: '/iic',
        links: [
          { label: 'Institution\'s Innovation Council (IIC)', path: '/iic' },
          { label: 'IIC Star Rating Certificate', path: '/compliance/institution-innovation-council' },
          { label: 'Institutional Development Plan (IDP)', path: '/compliance/institutional-development-plan' }
        ],
        featured: {
          title: 'Innovation Ecosystem',
          subtitle: 'MoE Innovation Cell (MIC)',
          description: 'Fostering student hackathons, pre-incubation, and entrepreneurship.',
          image: '/assets/images/facilities/academic_lab.jpg',
          ctaText: 'Explore IIC →',
          ctaPath: '/iic'
        }
      }
    ]
  },

  // 7. STUDENT SUPPORT & AMENITIES (Cells, NCC, NSS, Hostels, Stadium)
  studentSupport: {
    title: 'Student Support & Campus Amenities',
    path: '/student-support',
    type: 'columns',
    columns: [
      {
        heading: 'Welfare & Support Cells',
        items: [
          { label: 'Career Guidance & Placement Cell', path: '/student-support' },
          { label: 'Student Grievance Redressal (SGRC)', path: '/compliance/student-grievance-committee' },
          { label: 'Anti-Ragging Committee & Helpline', path: '/compliance/anti-ragging-policy' },
          { label: 'Internal Complaints Committee (ICC/POSH)', path: '/compliance/internal-complaints-committee' },
          { label: 'Student Welfare & Counselling Centre', path: '/student-support' },
          { label: 'Human Values & Professional Ethics', path: '/compliance/code-of-conduct' }
        ]
      },
      {
        heading: 'Youth Wings & Outreach',
        items: [
          { label: 'National Cadet Corps (NCC Army & Navy)', path: '/student-support' },
          { label: 'National Service Scheme (NSS)', path: '/student-support' },
          { label: 'Youth Red Cross (YRC)', path: '/student-support' },
          { label: 'Rangers & Rovers Youth Unit', path: '/student-support' },
          { label: 'Alumni Association (SPCAA)', path: '/alumni' }
        ]
      },
      {
        heading: 'Campus Amenities',
        items: [
          { label: 'Central Library & Reading Commons', path: '/resources' },
          { label: 'International Indoor Sports Stadium', path: '/student-support' },
          { label: 'Boys & Girls On-Campus Hostels', path: '/student-support' },
          { label: 'St. Philomena\'s Historic Chapel', path: '/about?tab=history' },
          { label: 'South Indian Bank & 24/7 ATM', path: '/student-support' },
          { label: 'College Auditorium & Quadrangle', path: '/student-support' }
        ]
      }
    ],
    featured: {
      title: 'Student Life & Amenities',
      subtitle: 'Vibrant Campus Community',
      description: 'Comprehensive welfare, sports facilities, career guidance, and NCC/NSS units.',
      image: '/media/gallery/campus/campus_indoor_stadium.jpg',
      ctaText: 'Explore Campus Life →',
      ctaPath: '/student-support'
    }
  },

  // 8. MANDATORY DISCLOSURE & IMPORTANT LINKS (Statutory & Government Portals)
  compliance: {
    title: 'Mandatory Disclosures & Statutory Compliance',
    path: '/mandatory-disclosure',
    type: 'columns',
    columns: [
      {
        heading: 'Mandatory Disclosures',
        items: [
          { label: 'AICTE MCA/MBA Mandatory Disclosure', path: '/compliance/aicte-mca-mba-disclosure' },
          { label: 'MCA/MBA Infrastructure', path: '/compliance/mca-mba-infrastructure' },
          { label: 'Code Of Conduct & Ethics', path: '/compliance/code-of-conduct' },
          { label: 'UGC 2(f) & 12(B) Recognition', path: '/compliance/ugc-recognition' },
          { label: 'COPE Continuing Education', path: '/compliance/cope' },
          { label: 'COE Examination Manual', path: '/compliance/coe' }
        ]
      },
      {
        heading: 'UGC Disclosures & Governance',
        items: [
          { label: 'College Committees & Cells', path: '/compliance/college-committees' },
          { label: 'Statutory Governance Bodies', path: '/compliance/statutory-bodies' },
          { label: 'UGC Fee Refund Policy', path: '/compliance/ugc-refund-policy' },
          { label: 'Internal Complaints Committee (ICC)', path: '/compliance/internal-complaints-committee' },
          { label: 'Student Grievances Committee (SGRC)', path: '/compliance/student-grievance-committee' },
          { label: 'Approved Fee Structure 2026–27', path: '/compliance/fee-structure' },
          { label: 'Autonomous Undertaking Certificate', path: '/compliance/undertaking-certificate' }
        ]
      },
      {
        heading: 'Approvals & Quality Reports',
        items: [
          { label: 'Autonomy Approval (UGC)', path: '/compliance/autonomy-approval' },
          { label: 'NAAC Cycle III (B++) Certificate', path: '/compliance/naac-certificate' },
          { label: 'NAAC Self Study Report (SSR)', path: '/compliance/naac-ssr' },
          { label: 'NIRF 2026 Data Submission Report', path: '/compliance/nirf' },
          { label: 'IQAC Annual Quality Report (AQAR)', path: '/compliance/iqac-aqar' },
          { label: 'Institution\'s Innovation Council (IIC)', path: '/compliance/institution-innovation-council' },
          { label: 'AICTE EOA Reports (2024–27)', path: '/compliance/eoa-2026-27' },
          { label: 'UUCMS Karnataka Portal', path: 'https://uucms.karnataka.gov.in/Login/Index', isExternal: true },
          { label: 'Ministry of Education (MHRD)', path: 'https://www.education.gov.in/', isExternal: true },
          { label: 'University of Mysore (UoM)', path: 'https://uni-mysore.ac.in/', isExternal: true }
        ]
      }
    ],
    featured: {
      title: 'Statutory Compliance Hub',
      subtitle: '100% Verified Disclosures',
      description: 'Accreditation certificates, UGC recognitions, AICTE approvals, and institutional policies.',
      image: '/media/gallery/campus/campus_chapel.jpg',
      ctaText: 'Explore Full Section →',
      ctaPath: '/mandatory-disclosure'
    }
  }
};
