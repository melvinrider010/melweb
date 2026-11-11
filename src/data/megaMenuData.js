// Master MegaMenu Navigation Data for St. Philomena's College (Autonomous), Mysuru
// Rich Multi-Column Navigation with One Dedicated Feature Image per Dropdown

export const MEGA_MENU_DATA = {
  // 1. ABOUT US
  about: {
    title: "About Us",
    featuredCard: {
      image: "/media/heritage/st_philos_heritage_palace.jpg",
      tag: "Est. 1946 Heritage",
      title: "Historic Heritage Quadrangle",
      subtitle: "Rooted in Catholic educational tradition and value-based pedagogy since 1946.",
      link: "/about"
    },
    columns: [
      {
        heading: "History & Identity",
        links: [
          { label: "Vision and Mission", path: "/about?tab=vision" },
          { label: "Coat of Arms", path: "/about?tab=coat-of-arms" },
          { label: "Former Bishops", path: "/about?tab=bishops" },
          { label: "Former Principals", path: "/about?tab=principals" },
          { label: "MDES (Mysore Diocesan Educational Society)", path: "/about?tab=mdes" }
        ]
      },
      {
        heading: "Leadership & Governance",
        links: [
          { label: "Organogram", path: "/about?tab=organogram" },
          { label: "Governing Body", path: "/about?tab=governing-body" },
          { label: "Rector's Message", path: "/leadership/rector" },
          { label: "Principal's Message", path: "/leadership/principal" },
          { label: "Statutory Committees", path: "/compliance/college-committees" }
        ]
      }
    ]
  },

  // 2. ACADEMICS
  academics: {
    title: "Academics",
    featuredCard: {
      image: "/assets/images/campus/science_block_official.png",
      tag: "Autonomous Curriculum",
      title: "UG & PG Academic Programmes",
      subtitle: "NEP 2020 framework, honors pathways, and multidisciplinary subject combinations.",
      link: "/academics"
    },
    columns: [
      {
        heading: "Programmes & Degrees",
        links: [
          { label: "UG Programme", path: "/academics?tab=ug" },
          { label: "PG Programme", path: "/academics?tab=pg" },
          { label: "Course/Program Outcomes", path: "/academics?tab=outcomes" }
        ]
      },
      {
        heading: "Curriculum & Regulations",
        links: [
          { label: "NEP REGULATIONS", path: "/academics?tab=nep" },
          { label: "E-Content", path: "/academics?tab=econtent" },
          { label: "Syllabus UG", path: "/academics?tab=syllabus-ug" },
          { label: "Syllabus PG", path: "/academics?tab=syllabus-pg" }
        ]
      }
    ]
  },

  // 3. EXAMINATION
  examinations: {
    title: "Examination",
    featuredCard: {
      image: "/assets/images/campus/admin_quadrangle_heritage.jpg",
      tag: "Admissions 2026–27",
      title: "Admissions & COE Portal",
      subtitle: "Download official prospectus, fee schedule, and autonomous semester time tables.",
      link: "/prospectus"
    },
    columns: [
      {
        heading: "Admission",
        links: [
          { label: "Apply Online (ERP Portal)", path: "https://student.stphiloserp.in/", isExternal: true },
          { label: "Prospectus", path: "/prospectus" },
          { label: "Fees Structure", path: "/compliance/fee-structure" },
          { label: "Calendar", path: "/examinations" },
          { label: "Time Table", path: "/examinations" },
          { label: "Stakeholders Feedback", path: "/compliance/stakeholder-feedback" }
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
    featuredCard: {
      image: "/assets/images/campus/library_block_official.jpg",
      tag: "50,000+ Volumes",
      title: "Central Digital Library & RDC",
      subtitle: "Access INFLIBNET N-LIST e-journals, research grants, and peer-reviewed publications.",
      link: "/library"
    },
    columns: [
      {
        heading: "Publications & Media",
        links: [
          { label: "E Journal", path: "/e-journal" },
          { label: "Philo's Bulletin", path: "/e-journal" },
          { label: "Central Library & Digital Commons", path: "/library" },
          { label: "College Magazine", path: "/magazine" }
        ]
      },
      {
        heading: "Research & Development",
        links: [
          { label: "Major Research", path: "/research?tab=projects" },
          { label: "Patent and Publications", path: "/research?tab=patents" },
          { label: "MOU and Collaborations", path: "/research?tab=mou" },
          { label: "Research & Development Cell", path: "/research?tab=rdc" }
        ]
      }
    ]
  },

  // 5. STUDENT SUPPORT
  studentSupport: {
    title: "Student Support",
    featuredCard: {
      image: "/assets/images/campus/indoor_stadium_official.png",
      tag: "Student Life & Amenities",
      title: "Campus Welfare & Hostels",
      subtitle: "State-level indoor stadium, on-campus hostels, career placements, and healthcare.",
      link: "/infrastructure"
    },
    columns: [
      {
        heading: "Placement Cell & Welfare",
        links: [
          { label: "Career and Placement Cell", path: "/student-support/placement-cell" },
          { label: "Grievance Redressal", path: "/student-support/student-grievance-redressal-committee" },
          { label: "Anti-Ragging", path: "/student-support/anti-ragging" },
          { label: "Women's Cell", path: "/student-support/womens-cell" },
          { label: "Student Welfare Cell", path: "/student-support/student-welfare-cell" },
          { label: "Counselling Centre", path: "/student-support/counselling-centre" },
          { label: "Human Values And Professional Ethics", path: "/student-support/human-values-professional-ethics" },
          { label: "Youth Redcross", path: "/student-support/youth-red-cross-yrc" }
        ]
      },
      {
        heading: "Amenities",
        links: [
          { label: "Library", path: "/student-support/library" },
          { label: "College Magazine", path: "/magazine" },
          { label: "Physical Infrastructure", path: "/infrastructure" },
          { label: "Business Lab", path: "/student-support/business-lab" },
          { label: "Computer Lab", path: "/student-support/computer-science-lab" },
          { label: "Girls Hostel", path: "/student-support/girls-hostel" },
          { label: "Boys Hostel", path: "/student-support/boys-hostel" },
          { label: "Auditorium", path: "/student-support/auditorium" },
          { label: "Philos Bulletin", path: "/e-journal" }
        ]
      },
      {
        heading: "Other Amenities",
        links: [
          { label: "Bank & ATM", path: "/student-support/bank-atm" },
          { label: "Chapel", path: "/chapel" },
          { label: "Ranger and Rovers", path: "/student-support/ranger-and-rovers" },
          { label: "NCC", path: "/student-support/ncc" },
          { label: "NSS", path: "/student-support/nss" },
          { label: "Indoor Stadium", path: "/indoor-stadium" }
        ]
      }
    ]
  },

  // 6. MANDATORY DISCLOSURE
  compliance: {
    title: "Mandatory Disclosure",
    featuredCard: {
      image: "/assets/images/campus/about_building.jpg",
      tag: "Statutory Governance",
      title: "Mandatory Disclosure & UGC Norms",
      subtitle: "Institutional development plans, AICTE disclosures, and committee policies.",
      link: "/mandatory-disclosure"
    },
    columns: [
      {
        heading: "Mandatory Disclosure",
        links: [
          { label: "AICTE MCA/MBA Mandatory Disclosure", path: "/compliance/aicte-mca-mba-disclosure" },
          { label: "MCA/MBA Infrastructure", path: "/compliance/mca-mba-infrastructure" },
          { label: "Code Of Conduct & Ethics", path: "/compliance/code-of-conduct" },
          { label: "2 (F)", path: "/compliance/ugc-2f" },
          { label: "12(B)", path: "/compliance/ugc-12b" },
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
          { label: "Affiliations", path: "/compliance/affiliations" },
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
          { label: "LOA 2024", path: "/compliance/loa-2024" },
          { label: "EOA 2024-25", path: "/compliance/eoa-2024-25" },
          { label: "EOA 2025-26", path: "/compliance/eoa-2025-26" },
          { label: "EOA 2026-27", path: "/compliance/eoa-2026-27" },
          { label: "More Important Links & Portals →", path: "/important-links", isButton: true }
        ]
      }
    ]
  },

  // 7. IQAC
  iqac: {
    title: "IQAC",
    featuredCard: {
      image: "/assets/images/facilities/campus_auditorium.jpg",
      tag: "Academic Excellence",
      title: "Internal Quality Assurance Cell",
      subtitle: "NAAC Cycle III accreditation, NIRF ranking data, and institutional quality benchmarks.",
      link: "/iqac"
    },
    columns: [
      {
        heading: "Internal Quality Assurance Cell (IQAC)",
        links: [
          { label: "About IQAC", path: "/iqac" },
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

export const initialMegaMenuData = MEGA_MENU_DATA;
export default MEGA_MENU_DATA;
