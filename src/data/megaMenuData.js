// Complete Official Interactive Mega Menu Dataset for St. Philomena's College (Autonomous), Mysuru
// 100% Synced with official source https://stphilos.ac.in/
import { ASSETS } from './assets';

export const MEGA_MENU_DATA = {

  // 1. ABOUT US (Official Administration & Heritage)
  about: {
    title: 'About St. Philomena\'s College',
    path: '/about',
    type: 'tabbed',
    description: '78+ Years of Academic Excellence & Catholic Educational Ministry (Est. 1946)',
    tabs: [
      {
        id: 'history',
        num: '01',
        label: 'History & Founding Story',
        heading: 'A Bishop\'s Vision & A Maharaja\'s Munificence',
        description: 'Established on October 9, 1946 by Bishop Rene Feuga and declared open by His Highness Sri Jayachamarajendra Wodeyar, Maharaja of Mysore.',
        ctaText: 'Explore Our History →',
        ctaPath: '/about?tab=history',
        links: [
          { label: 'Foundation & Founding Story (1946)', path: '/about?tab=history' },
          { label: 'Vision, Mission & Core Values', path: '/about?tab=vision' },
          { label: 'College Coat of Arms & Crest', path: '/about?tab=coat-of-arms' },
          { label: 'College Anthem & Daily Prayer', path: '/anthems' }
        ],
        featured: {
          title: 'Founding Heritage 1946',
          subtitle: 'Caritas et Scientia',
          description: 'First private science degree college in erstwhile Mysore region.',
          image: '/media/gallery/campus/campus_quadrangle_main.jpg',
          ctaText: 'Read Founding Story →',
          ctaPath: '/about?tab=history'
        }
      },
      {
        id: 'admin',
        num: '02',
        label: 'Administration & Governance',
        heading: 'MDES Society & Institutional Governance',
        description: 'Governed by the Mysore Diocesan Educational Society (MDES) with eminent educationalists, administrators, and UGC statutory nominees.',
        ctaText: 'View Administration →',
        ctaPath: '/about?tab=mdes',
        links: [
          { label: 'MDES Educational Society', path: '/about?tab=mdes' },
          { label: 'Statutory Governing Body Council', path: '/about?tab=governing-body' },
          { label: 'Institutional Organogram', path: '/about?tab=organogram' },
          { label: 'Current Administration & Heads', path: '/about?tab=leadership' }
        ],
        featured: {
          title: 'MDES Governance',
          subtitle: 'Diocesan Educational Board',
          description: 'Autonomous governance upholding quality Catholic higher education.',
          image: '/media/management/secretary_edward_saldanha.jpg',
          ctaText: 'View MDES Society →',
          ctaPath: '/about?tab=mdes'
        }
      },
      {
        id: 'leadership',
        num: '03',
        label: 'Leadership Messages',
        heading: 'Executive Leadership & Historical Rosters',
        description: 'Messages from Rector & Manager Rev. Dr. Lourdu Prasad Joseph and Principal Dr. Ravi J.D. Saldanha, alongside historical Bishop and Principal rosters.',
        ctaText: 'Read Leadership Messages →',
        ctaPath: '/about?tab=leadership',
        links: [
          { label: 'Rector\'s Official Message', path: '/about?tab=leadership' },
          { label: 'Principal\'s Official Message', path: '/about?tab=leadership' },
          { label: 'Former Bishops of Mysore (1946–Present)', path: '/about?tab=bishops' },
          { label: 'Former Principals Roster', path: '/about?tab=principals' }
        ],
        featured: {
          title: 'Leadership Vision',
          subtitle: 'Office of the Principal',
          description: 'Guiding academic rigor, student distinction, and research advancements.',
          image: '/media/management/principal_ravi_saldanha.jpg',
          ctaText: 'Read Messages →',
          ctaPath: '/about?tab=leadership'
        }
      }
    ]
  },

  // 2. ACADEMICS (Curriculum, NEP Regulations, Syllabi)
  academics: {
    title: 'Academic Programmes & Curriculum',
    path: '/academics',
    type: 'explorer',
    columns: [
      {
        heading: 'Undergraduate (NEP 2020)',
        items: [
          { label: 'BCA (Computer Applications)', path: '/academics/bca' },
          { label: 'B.Com (Bachelor of Commerce)', path: '/academics/bcom' },
          { label: 'B.Sc (Physical & Biological Sciences)', path: '/academics/pcm' },
          { label: 'BBA & BTHM (Tourism & Hospitality)', path: '/academics/bba' },
          { label: 'BA (Humanities & Social Sciences)', path: '/academics/esp' },
          { label: 'BSW (Bachelor of Social Work)', path: '/academics/bsw' }
        ]
      },
      {
        heading: 'Postgraduate (CBCS)',
        items: [
          { label: 'M.Sc Chemistry & Biochemistry', path: '/academics/msc-chem' },
          { label: 'M.Sc Physics & Mathematics', path: '/academics/msc-phy' },
          { label: 'M.Sc Computer Science', path: '/academics/msc-cs' },
          { label: 'M.Com (Master of Commerce)', path: '/academics/mcom' },
          { label: 'MSW (Master of Social Work)', path: '/academics/msw' },
          { label: 'MA English & Economics', path: '/academics/ma-eng' }
        ]
      },
      {
        heading: 'Academic Resources & Syllabi',
        items: [
          { label: 'NEP 2020 Regulations Manual', path: '/assets/documents/academics/nep-2020-academic-regulations.pdf', isDownload: true },
          { label: 'Undergraduate NEP Syllabus', path: '/assets/documents/syllabus/ug-nep-syllabus-2026.pdf', isDownload: true },
          { label: 'Postgraduate CBCS Syllabus', path: '/assets/documents/syllabus/pg-cbcs-syllabus-2026.pdf', isDownload: true },
          { label: 'Course / Program Outcomes (OBE)', path: '/assets/documents/academics/obe-outcomes-manual.pdf', isDownload: true },
          { label: 'PG E-Content & Digital Notes', path: '/resources' }
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
        heading: 'Admissions & Forms',
        items: [
          { label: 'Official Prospectus 2026–27', path: '/assets/documents/admissions/st-philomena-prospectus-2026-27.pdf', isDownload: true },
          { label: 'Fee Structure Breakdown 2026–27', path: '/assets/documents/admissions/admissions-fee-structure-2026-27.pdf', isDownload: true },
          { label: 'UG Admission Application Form', path: '/assets/documents/admissions/ug-application-form-2026.pdf', isDownload: true },
          { label: 'Online Admission Application', path: '/admissions' }
        ]
      },
      {
        heading: 'Schedules & Compliance',
        items: [
          { label: 'Institutional Academic Calendar', path: '/assets/documents/examinations/academic-calendar-2026.pdf', isDownload: true },
          { label: 'UGC Fee Refund Policy', path: '/assets/documents/mandatory-disclosure/ugc-fee-refund-policy.pdf', isDownload: true },
          { label: 'State Scholarship Portal (SSP)', path: 'https://ssp.postmatric.karnataka.gov.in/', isExternal: true },
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
          { label: 'End-Semester Examination Timetable', path: '/assets/documents/examinations/end-semester-examination-timetable-2026.pdf', isDownload: true },
          { label: 'Latest COE Examination Notifications', path: '/examinations' },
          { label: 'Institutional Academic Calendar', path: '/assets/documents/examinations/academic-calendar-2026.pdf', isDownload: true },
          { label: 'Hall Ticket & Seating Arrangements', path: '/examinations' }
        ]
      },
      {
        heading: 'Results & Evaluation',
        items: [
          { label: 'Autonomous Semester Results Portal', path: '/examinations' },
          { label: 'Revaluation & Photocopy Form', path: '/assets/documents/examinations/revaluation-application-form-2026.pdf', isDownload: true },
          { label: 'Online Certificate DirectVerify', path: 'https://stphilos.directverify.in/student/', isExternal: true },
          { label: 'Autonomous Grading Ordinances', path: '/assets/documents/academics/nep-2020-academic-regulations.pdf', isDownload: true }
        ]
      },
      {
        heading: 'COE Grievance Redressal',
        items: [
          { label: 'Examination Grievance Committee', path: '/student-support' },
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
          { label: 'Research & Development Cell Policy', path: '/assets/documents/research/research-development-cell-policy.pdf', isDownload: true },
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
          { label: 'IIC Star Rating Certificate', path: '/assets/documents/iic/iic-star-rating-certificate-2025.pdf', isDownload: true },
          { label: 'National Innovation & Startup Policy (NISP)', path: '/assets/documents/iic/national-innovation-startup-policy.pdf', isDownload: true }
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
          { label: 'Student Grievance Redressal Cell', path: '/student-support' },
          { label: 'Anti-Ragging Committee & Helpline', path: '/assets/documents/mandatory-disclosure/anti-ragging-regulations-2026.pdf', isDownload: true },
          { label: 'Internal Complaints Committee (ICC/POSH)', path: '/assets/documents/mandatory-disclosure/icc-policy-document.pdf', isDownload: true },
          { label: 'Student Welfare & Counselling Centre', path: '/student-support' },
          { label: 'Human Values & Professional Ethics', path: '/assets/documents/mandatory-disclosure/code-of-conduct-ethics-manual.pdf', isDownload: true }
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
          { label: 'UGC 2(f) & 12(B) Recognition', path: '/compliance/ugc-2f' },
          { label: 'COPE & COE Guidelines', path: '/compliance/cope' },
          { label: 'UGC Autonomous Recognition', path: '/compliance/ugc-recognition' }
        ]
      },
      {
        heading: 'UGC Mandatory Disclosure',
        items: [
          { label: 'College Committees & Cells', path: '/compliance/college-committees' },
          { label: 'Statutory Governance Bodies', path: '/compliance/statutory-bodies' },
          { label: 'UGC Fee Refund Policy', path: '/compliance/ugc-refund-policy' },
          { label: 'Internal Complaints Committee (ICC)', path: '/compliance/internal-complaints-committee' },
          { label: 'Student Grievances Committee (SGRC)', path: '/compliance/student-grievance-committee' },
          { label: 'Fee Structure 2026–27', path: '/compliance/fee-structure' }
        ]
      },
      {
        heading: 'Approvals & Govt Portals',
        items: [
          { label: 'Autonomy Approval (UGC)', path: '/compliance/autonomy-approval' },
          { label: 'Institution\'s Innovation Council (IIC)', path: '/compliance/institution-innovation-council' },
          { label: 'AICTE EOA Reports (2024–27)', path: '/compliance/eoa-2026-27' },
          { label: 'UUCMS Karnataka Portal', path: 'https://uucms.karnataka.gov.in/Login/Index', isExternal: true },
          { label: 'Ministry of Education (MHRD)', path: 'https://www.education.gov.in/', isExternal: true },
          { label: 'University of Mysore (UoM)', path: 'https://uni-mysore.ac.in/', isExternal: true },
          { label: 'UTSAH / AISHE / KSHEC Portals', path: 'https://utsah.ugc.ac.in/', isExternal: true }
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
