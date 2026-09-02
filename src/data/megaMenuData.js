// Master MegaMenu Navigation Data for St. Philomena's College (Autonomous), Mysuru
// Pure Typographic Multi-Column Navigation (No Images)

export const MEGA_MENU_DATA = {
  // 1. ABOUT US
  about: {
    title: "About Us",
    columns: [
      {
        heading: "History & Identity",
        links: [
          { label: "Vision and Mission", path: "/about?tab=history" },
          { label: "Coat of Arms", path: "/about?tab=history" },
          { label: "Former Bishops", path: "/about?tab=leadership" },
          { label: "Former Principals", path: "/about?tab=leadership" },
          { label: "MDES (Mysore Diocesan Educational Society)", path: "/about?tab=mdes" }
        ]
      },
      {
        heading: "Leadership & Governance",
        links: [
          { label: "Organogram", path: "/about?tab=organogram" },
          { label: "Governing Body", path: "/compliance/statutory-bodies" },
          { label: "Rector's Message", path: "/about?tab=leadership" },
          { label: "Principal's Message", path: "/about?tab=leadership" },
          { label: "Statutory Committees", path: "/compliance/college-committees" }
        ]
      }
    ]
  },

  // 2. ACADEMICS
  academics: {
    title: "Academics",
    columns: [
      {
        heading: "Academic Streams",
        links: [
          { label: "Undergraduate (UG) Programmes", path: "/academics?tab=ug" },
          { label: "Postgraduate (PG) Programmes", path: "/academics?tab=pg" },
          { label: "Doctoral & Research Studies", path: "/research" },
          { label: "Certificate & Value Added Courses", path: "/academics?tab=certificate" }
        ]
      },
      {
        heading: "Curriculum & Regulations",
        links: [
          { label: "NEP REGULATIONS", path: "/academics?tab=nep" },
          { label: "E-Content Portal", path: "/academics?tab=econtent" },
          { label: "Syllabus UG", path: "/academics?tab=syllabus-ug" },
          { label: "Syllabus PG", path: "/academics?tab=syllabus-pg" },
          { label: "Course/Program Outcomes", path: "/academics?tab=outcomes" }
        ]
      }
    ]
  },

  // 3. EXAMINATION
  examinations: {
    title: "Examination",
    columns: [
      {
        heading: "Admission",
        links: [
          { label: "Prospectus", path: "/prospectus" },
          { label: "Fees Structure", path: "/compliance/fee-structure" },
          { label: "Calendar", path: "/examinations" },
          { label: "Time Table", path: "/examinations" },
          { label: "Stakeholders Feedback", path: "/iqac" }
        ]
      },
      {
        heading: "Examination",
        links: [
          { label: "Examination Time Table", path: "/examinations" },
          { label: "Examination Notification", path: "/examinations" },
          { label: "Result Portal", path: "/examinations" },
          { label: "Revaluation & Grievances", path: "/compliance/student-grievance-committee" }
        ]
      }
    ]
  },

  // 4. RESOURCE (RESEARCH)
  research: {
    title: "Resource",
    columns: [
      {
        heading: "Publications & Media",
        links: [
          { label: "E Journal", path: "/research" },
          { label: "Philo's Bulletin", path: "/research" },
          { label: "Central Library & Digital Commons", path: "/resources" },
          { label: "College Magazine", path: "/resources" }
        ]
      },
      {
        heading: "Research & Development",
        links: [
          { label: "Major Research", path: "/research" },
          { label: "Patent and Publications", path: "/research" },
          { label: "MOU and Collaborations", path: "/research" },
          { label: "Research & Development Cell", path: "/research" }
        ]
      }
    ]
  },

  // 5. STUDENT SUPPORT
  studentSupport: {
    title: "Student Support",
    columns: [
      {
        heading: "Placement Cell & Welfare",
        links: [
          { label: "Career and Placement Cell", path: "/student-support" },
          { label: "Grievance Redressal", path: "/compliance/student-grievance-committee" },
          { label: "Anti-Ragging", path: "/compliance/anti-ragging-policy" },
          { label: "Women's Cell", path: "/student-support" },
          { label: "Student Welfare Cell", path: "/student-support" },
          { label: "Counselling Centre", path: "/student-support" },
          { label: "Human Values And Professional Ethics", path: "/compliance/code-of-conduct" },
          { label: "Youth Redcross", path: "/student-support" }
        ]
      },
      {
        heading: "Amenities",
        links: [
          { label: "Library", path: "/resources" },
          { label: "College Magazine", path: "/resources" },
          { label: "Physical Infrastructure", path: "/about?tab=infrastructure" },
          { label: "Business Lab", path: "/student-support" },
          { label: "Computer Lab", path: "/student-support" },
          { label: "Girls Hostel", path: "/student-support" },
          { label: "Boys Hostel", path: "/student-support" },
          { label: "Auditorium", path: "/student-support" },
          { label: "Philos Bulletin", path: "/research" }
        ]
      },
      {
        heading: "Other Amenities",
        links: [
          { label: "Bank & ATM", path: "/student-support" },
          { label: "Chapel", path: "/about?tab=history" },
          { label: "Ranger and Rovers", path: "/student-support" },
          { label: "NCC", path: "/student-support" },
          { label: "NSS", path: "/student-support" },
          { label: "Indoor Stadium", path: "/student-support" }
        ]
      }
    ]
  },

  // 6. MANDATORY DISCLOSURE
  compliance: {
    title: "Mandatory Disclosure",
    columns: [
      {
        heading: "Mandatory Disclosure",
        links: [
          { label: "AICTE MCA/MBA Mandatory Disclosure", path: "/compliance/aicte-mca-mba-disclosure" },
          { label: "MCA/MBA Infrastructure", path: "/compliance/mca-mba-infrastructure" },
          { label: "Code Of Conduct & Ethics", path: "/compliance/code-of-conduct" },
          { label: "2 (F)", path: "/compliance/ugc-recognition" },
          { label: "12(B)", path: "/compliance/ugc-recognition" },
          { label: "COPE", path: "/compliance/cope" },
          { label: "COE", path: "/compliance/coe" },
          { label: "UGC Recognition", path: "/compliance/ugc-recognition" }
        ]
      },
      {
        heading: "UGC Mandatory Disclosure",
        links: [
          { label: "College Committees/Cells", path: "/compliance/college-committees" },
          { label: "Statutory Bodies", path: "/compliance/statutory-bodies" },
          { label: "UGC Refund Policy", path: "/compliance/ugc-refund-policy" },
          { label: "Internal Complaints Commitee", path: "/compliance/internal-complaints-committee" },
          { label: "Student Grievances Committee", path: "/compliance/student-grievance-committee" },
          { label: "Affiliations", path: "/compliance/statutory-bodies" },
          { label: "Undertaking Certificate", path: "/compliance/undertaking-certificate" },
          { label: "Fee Structure", path: "/compliance/fee-structure" }
        ]
      },
      {
        heading: "Important Links",
        links: [
          { label: "Autonomy Approval", path: "/compliance/autonomy-approval" },
          { label: "Institution's Innovation Council", path: "/iic" },
          { label: "Institutional Development Plan", path: "/compliance/institutional-development-plan" },
          { label: "Divyangjan Policy", path: "/compliance/divyangjan-policy" },
          { label: "LOA 2024", path: "/compliance/autonomy-approval" },
          { label: "EOA 2024-25", path: "/compliance/eoa-2026-27" },
          { label: "EOA 2025-26", path: "/compliance/eoa-2026-27" },
          { label: "EOA 2026-27", path: "/compliance/eoa-2026-27" },
          { label: "Redressal Of Atrocities Against women", path: "/compliance/internal-complaints-committee" },
          { label: "AICTE Feedback For Faculty And Student", path: "/compliance/code-of-conduct" },
          { label: "Online Certificate Verification", path: "https://stphilos.directverify.in/student/", isExternal: true },
          { label: "UUCMS", path: "https://uucms.karnataka.gov.in/Login/Index", isExternal: true },
          { label: "MHRD", path: "https://www.education.gov.in/", isExternal: true },
          { label: "UOM", path: "https://uni-mysore.ac.in/", isExternal: true },
          { label: "UTSAH", path: "https://utsah.ugc.ac.in/", isExternal: true },
          { label: "AISHE", path: "https://aishe.gov.in/", isExternal: true },
          { label: "DCE", path: "https://dce.karnataka.gov.in/", isExternal: true },
          { label: "KSHEC", path: "https://kshec.karnataka.gov.in/", isExternal: true },
          { label: "Scholarship", path: "https://ssp.postmatric.karnataka.gov.in/homepage.aspx", isExternal: true },
          { label: "UGC Compliance", path: "/compliance/ugc-refund-policy" },
          { label: "AICTE Sholarship/ Fellowship", path: "/compliance/aicte-mca-mba-disclosure" }
        ]
      }
    ]
  },

  // 7. IQAC
  iqac: {
    title: "IQAC",
    columns: [
      {
        heading: "Internal Quality Assurance Cell (IQAC)",
        links: [
          { label: "IIC (Institution's Innovation Council)", path: "/iic" },
          { label: "NIRF", path: "/nirf" },
          { label: "NAAC", path: "/naac" },
          { label: "ANTHEMS", path: "/anthems" },
          { label: "SWAYAM", path: "https://swayam.gov.in/", isExternal: true },
          { label: "ALUMNI", path: "/alumni" }
        ]
      }
    ]
  }
};
