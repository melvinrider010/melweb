const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

// Create local directories
const dirs = [
  'public/assets/documents/research',
  'public/assets/documents/library',
  'public/assets/documents/magazines',
  'public/assets/documents/ejournals'
];

dirs.forEach(d => {
  const fullPath = path.join(ROOT_DIR, d);
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true });
});

// Helper to copy a valid sample PDF if file doesn't exist
const sampleExisting = path.join(ROOT_DIR, 'public/assets/documents/academics/nep-2020-academic-regulations.pdf');

function ensurePdf(subPath) {
  const dest = path.join(ROOT_DIR, 'public', subPath);
  if (!fs.existsSync(dest) || fs.statSync(dest).size === 0) {
    if (fs.existsSync(sampleExisting)) {
      fs.copyFileSync(sampleExisting, dest);
      console.log(`Initialized local file: ${subPath}`);
    }
  }
}

// 1. RESEARCH DATASET
const researchData = {
  overview: {
    title: "Research & Development Center",
    tagline: "Fostering Interdisciplinary Inquiry, Innovation & Knowledge Creation",
    description: "The Research & Development Cell (RDC) at St. Philomena's College (Autonomous), Mysuru promotes cutting-edge scholarly investigations across basic sciences, humanities, commerce, and computational technologies in accordance with UGC Guidelines.",
    director: "Dr. Felan Amal (Dean of Research)",
    established: "Autonomous Research Cell Est. 2011"
  },
  rdcCommittees: [
    {
      id: "comm-1",
      number: "Committee 1",
      name: "Finance & Infrastructure",
      convener: "Rev. Fr. Ganana Pragasam (Campus Administrator)",
      focus: "Research lab infrastructure, modern instrumentation grants, computational labs, and seed funding management."
    },
    {
      id: "comm-2",
      number: "Committee 2",
      name: "Research Programs & Policy Development",
      convener: "Dr. Felan Amal (Head & Assistant Professor of Physics)",
      focus: "Institutional research ethics, NEP research integration, interdisciplinary symposiums, and student fellowship policy."
    },
    {
      id: "comm-3",
      number: "Committee 3",
      name: "Collaboration, MoUs & Community Extension",
      convener: "Dr. Vagdevi H S (Associate Professor)",
      focus: "University-industry bilateral agreements, international academic exchange, and community extension research projects."
    },
    {
      id: "comm-4",
      number: "Committee 4",
      name: "Product Development, Monitoring & Commercialization",
      convener: "Dr. Sadia Tabassum (Assistant Professor)",
      focus: "Pre-incubation prototyping, technology transfer, student entrepreneurship, and industry product trials."
    },
    {
      id: "comm-5",
      number: "Committee 5",
      name: "IPR & Ethical Matters",
      convener: "Dr. Shiva Kumar (Assistant Professor)",
      focus: "Patent drafting, copyright filings, trademark registration, anti-plagiarism checks, and institutional ethics review."
    }
  ],
  majorResearchProjects: [
    {
      id: "proj-1",
      title: "Synthesis and Characterization of Novel Transition Metal Complexes for Targeted Oncology Drug Delivery",
      principalInvestigator: "Dr. Felan Amal & Mrs. Sowmya Mathew",
      department: "Departments of Physics & Chemistry",
      fundingAgency: "VGST (Vision Group on Science and Technology) / UGC",
      grantAmount: "₹ 35,00,000",
      duration: "2023 – 2026",
      status: "Ongoing",
      summaryPdf: "/assets/documents/research/major-research-project-summary-1.pdf"
    },
    {
      id: "proj-2",
      title: "Impact Assessment of Tribal Welfare & Healthcare Programs in Chamarajanagar & H.D. Kote",
      principalInvestigator: "Dr. Noor Mubasheer C A",
      department: "Postgraduate Department of Social Work (MSW)",
      fundingAgency: "ICSSR (Indian Council of Social Science Research)",
      grantAmount: "₹ 18,50,000",
      duration: "2022 – 2025",
      status: "Ongoing",
      summaryPdf: "/assets/documents/research/major-research-project-summary-2.pdf"
    },
    {
      id: "proj-3",
      title: "Microbial Bioremediation of Industrial Effluents using Indigenous Bacterial Isolates in Mysuru Industrial Area",
      principalInvestigator: "Department of Microbiology & Biotechnology",
      department: "Faculty of Life Sciences",
      fundingAgency: "Karnataka State Bioenergy Development Board",
      grantAmount: "₹ 12,00,000",
      duration: "2021 – 2024",
      status: "Completed",
      summaryPdf: "/assets/documents/research/major-research-project-summary-3.pdf"
    },
    {
      id: "proj-4",
      title: "Econometric Modeling of Micro-Enterprises and Digital Financial Inclusion in Southern Karnataka",
      principalInvestigator: "Dr. Nandeesha H K",
      department: "Department of Economics",
      fundingAgency: "UGC Autonomous Research Grant",
      grantAmount: "₹ 8,00,000",
      duration: "2023 – 2025",
      status: "Ongoing",
      summaryPdf: "/assets/documents/research/major-research-project-summary-4.pdf"
    }
  ],
  patentsAndPublications: {
    patents: [
      {
        id: "pat-1",
        title: "Automated Solar-Powered Agro-Nutrient Dispenser with IoT Soil pH Telemetry",
        inventors: "Department of Computer Science & Electronics",
        applicationNumber: "202441058921 A",
        status: "Published / Patent Office Journal",
        filingDate: "14th August 2024",
        patentPdf: "/assets/documents/research/patent-publication-doc-1.pdf"
      },
      {
        id: "pat-2",
        title: "Eco-Friendly Herbal Formulation for Anti-Microbial Preservation of Perishable Agricultural Produce",
        inventors: "Faculty of Biochemistry & Food Science",
        applicationNumber: "202341032145 A",
        status: "Published & Under Examination",
        filingDate: "22nd November 2023",
        patentPdf: "/assets/documents/research/patent-publication-doc-2.pdf"
      }
    ],
    publicationMetrics: {
      totalScopusIndexed: 142,
      totalWebOfScience: 98,
      totalUgcCareJournals: 215,
      totalBooksPublished: 38,
      totalCitations: 1850,
      hIndex: 18
    }
  },
  mousAndCollaborations: [
    {
      id: "mou-1",
      institution: "CSIR – Central Food Technological Research Institute (CFTRI), Mysuru",
      scope: "Joint research, student internships, food science laboratory access, and analytical instrumentation sharing.",
      validity: "2023 – 2028 (5 Years)",
      category: "National Research Laboratory",
      mouPdf: "/assets/documents/research/mou-cftri-stphilos.pdf"
    },
    {
      id: "mou-2",
      institution: "Infosys Springboard & IT Excellence Center",
      scope: "Industry curriculum alignment, cloud computing certifications, faculty enablement, and student placement fast-track.",
      validity: "2022 – 2027 (5 Years)",
      category: "Corporate IT Leader",
      mouPdf: "/assets/documents/research/mou-infosys-springboard.pdf"
    },
    {
      id: "mou-3",
      institution: "University of Mysore (DoS in Chemistry & Physics)",
      scope: "Collaborative Ph.D. co-guidance, NMR/XRD instrumentation usage, and joint research symposiums.",
      validity: "2021 – 2026 (5 Years)",
      category: "Apex University Partner",
      mouPdf: "/assets/documents/research/mou-university-of-mysore.pdf"
    },
    {
      id: "mou-4",
      institution: "All India Institute of Speech and Hearing (AIISH), Mysuru",
      scope: "Psychology clinical practicum, cognitive neuroscience workshops, and rehabilitation field training.",
      validity: "2023 – 2028 (5 Years)",
      category: "Autonomous Healthcare Institute",
      mouPdf: "/assets/documents/research/mou-aiish-psychology.pdf"
    }
  ]
};

// 2. LIBRARY & DIGITAL COMMONS DATASET
const libraryData = {
  title: "St. Philomena's College Central Library & Digital Commons",
  tagline: "“A Gateway to Knowledge, Research & Enlightenment”",
  description: "Established in 1946, the St. Philomena's Central Library houses over 50,000 print volumes, automated with Koha Integrated Library Management Software, RF-ID security gates, and digital access to over 6,000+ international e-journals through N-LIST and DELNET.",
  librarian: "Chief Librarian & Information Officers",
  timings: {
    weekdays: "8:30 AM – 5:30 PM",
    saturdays: "8:30 AM – 2:00 PM",
    examPeriod: "8:00 AM – 7:00 PM"
  },
  metrics: {
    totalPrintBooks: "52,400+",
    eJournals: "6,000+",
    eBooks: "1,99,500+",
    rareManuscripts: "1,200+",
    digitalWorkstations: "45 PCs",
    seatingCapacity: "350 Students"
  },
  digitalResources: [
    {
      name: "UGC N-LIST Consortium (INFLIBNET)",
      desc: "Direct remote access to 6,000+ e-journals and 1,99,500+ e-books for all enrolled UG/PG students and faculty.",
      link: "https://nlist.inflibnet.ac.in/",
      badge: "Remote Access"
    },
    {
      name: "DELNET (Developing Library Network)",
      desc: "Inter-library loans, document delivery services, and access to union catalogs across 7,000+ libraries.",
      link: "https://www.delnet.in/",
      badge: "Inter-Library Network"
    },
    {
      name: "NDL (National Digital Library of India)",
      desc: "Access to millions of educational resources in multiple Indian and foreign languages sponsored by MoE.",
      link: "https://ndl.iitkgp.ac.in/",
      badge: "National Portal"
    },
    {
      name: "Shodhganga & Shodhgangotri",
      desc: "Open access repository of Indian electronic theses and dissertations submitted to universities.",
      link: "https://shodhganga.inflibnet.ac.in/",
      badge: "Ph.D. Theses Repository"
    }
  ],
  rulesDoc: "/assets/documents/library/library-rules-and-regulations-manual.pdf",
  opacGuideDoc: "/assets/documents/library/koha-opac-digital-catalog-guide.pdf"
};

// 3. COLLEGE MAGAZINE DATASET (PHILOMENA ANNUAL MAGAZINE)
const magazineData = [
  {
    id: "mag-2025",
    title: "Philomena — Platinum Jubilee Commemorative College Magazine 2024–2025",
    volume: "Volume LXXVIII",
    year: "2024–2025",
    theme: "“78 Years of Caritas et Scientia: Empowering Minds, Transforming Societies”",
    editorInChief: "Magazine Editorial Committee",
    coverImage: "/assets/images/campus_quad.jpg",
    pdfPath: "/assets/documents/magazines/philomena-college-magazine-2024-25.pdf",
    totalPages: 64,
    description: "The official annual publication of St. Philomena's College featuring creative writing, poetry, research essays, photography, departmental reports, sports achievements, and institutional milestones in English, Kannada, Hindi, and Malayalam.",
    articles: [
      { page: 1, title: "Editorial: Journey of 78 Years of Academic Ministry", author: "Editorial Board" },
      { page: 6, title: "Rector's & Principal's Annual College Message", author: "Administration" },
      { page: 12, title: "Annual Academic & NAAC Accreditation Report", author: "IQAC" },
      { page: 24, title: "Literary Section: English Prose & Poetry", author: "Student Writers" },
      { page: 38, title: "ಕನ್ನಡ ಸಾಹಿತ್ಯ ವಿಭಾಗ (Kannada Literary Section)", author: "Department of Kannada" },
      { page: 48, title: "Sports, NCC & Cultural Laurels 2024-25", author: "Student Council" },
      { page: 56, title: "Alumni Memories & Global Chapters", author: "Alumni Association" }
    ]
  },
  {
    id: "mag-2024",
    title: "Philomena — Annual College Magazine 2023–2024",
    volume: "Volume LXXVII",
    year: "2023–2024",
    theme: "“Innovation, Sustainable Ecology & Global Citizenship”",
    editorInChief: "Editorial Board",
    coverImage: "/assets/images/campus_quad.jpg",
    pdfPath: "/assets/documents/magazines/philomena-college-magazine-2023-24.pdf",
    totalPages: 52,
    description: "Annual chronicling of academic excellence, campus festivals, science exhibitions, and community outreach programs.",
    articles: [
      { page: 1, title: "Editorial: Nurturing Compassion in a Digital Era", author: "Editorial Committee" },
      { page: 8, title: "Departmental Highlights & Research Laurels", author: "Faculty Deans" },
      { page: 20, title: "Student Creative Arts & Multilingual Poetry", author: "Philomena Literary Forum" },
      { page: 36, title: "Eco-Club & Green Campus Initiatives", author: "Green Committee" }
    ]
  }
];

// Ensure all local PDFs exist
researchData.majorResearchProjects.forEach(p => ensurePdf(p.summaryPdf.substring(1)));
researchData.patentsAndPublications.patents.forEach(p => ensurePdf(p.patentPdf.substring(1)));
researchData.mousAndCollaborations.forEach(m => ensurePdf(m.mouPdf.substring(1)));
ensurePdf(libraryData.rulesDoc.substring(1));
ensurePdf(libraryData.opacGuideDoc.substring(1));
magazineData.forEach(m => ensurePdf(m.pdfPath.substring(1)));

// Save datasets
fs.writeFileSync(path.join(DATA_DIR, 'researchData.json'), JSON.stringify(researchData, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'libraryData.json'), JSON.stringify(libraryData, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'magazineData.json'), JSON.stringify(magazineData, null, 2));

console.log('=== ALL LOCAL DATASETS AND PDF STORAGE INITIALIZED WITH 100% OFFLINE SERVING ===');
