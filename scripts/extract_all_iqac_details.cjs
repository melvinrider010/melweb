const fs = require('fs');
const path = require('path');
const https = require('https');

const raw = JSON.parse(fs.readFileSync(path.join(__dirname, 'stphilos_raw/pages/iqac.json'), 'utf8'));
const html = raw.content.rendered;

// Let's parse all sections
// 1. Team members
const memberBlocks = [...html.matchAll(/<div class="tmm_member"[\s\S]*?<div class="tmm_names">([\s\S]*?)<\/div>[\s\S]*?<div class="tmm_job">([\s\S]*?)<\/div>[\s\S]*?<div class="tmm_desc">([\s\S]*?)<\/div>/gi)];
console.log('Member blocks found:', memberBlocks.length);
const members = memberBlocks.map(m => ({
  name: m[1].replace(/<[^>]+>/g, '').trim(),
  role: m[2].replace(/<[^>]+>/g, '').trim(),
  desc: m[3].replace(/<[^>]+>/g, '').trim()
}));
console.log('Members:', members);

// 2. Events / Activity posts
const eventBlocks = [...html.matchAll(/<h2[^>]*>([\s\S]*?)<\/h2>[\s\S]*?<img[^>]+src="([^">]+)"[\s\S]*?<p>([\s\S]*?)<\/p>/gi)];
console.log('Event blocks found:', eventBlocks.length);
const events = eventBlocks.map(e => ({
  title: e[1].replace(/<[^>]+>/g, '').trim(),
  image: e[2],
  description: e[3].replace(/<[^>]+>/g, '').trim()
}));
console.log('Sample events:', events.slice(0, 3));

// Save structured JSON
const structuredData = {
  title: "Internal Quality Assurance Cell (IQAC)",
  established: "01/05/2004",
  officialUrl: "https://stphilos.ac.in/iqac/",
  crawledAt: new Date().toISOString(),
  localPath: "src/data/iqacData.json",
  overview: "Internal Quality Assurance Cell (IQAC) has been established on 01/05/2004 as a post-accreditation quality sustenance measure for performance evaluation, assessment and accreditation and quality upgradation of institutions of higher education. According to the National Assessment and Accreditation Council (NAAC), every accredited institution of higher education should establish Internal Quality Assurance Cell (IQAC) as a post-accreditation quality sustenance measure. The primary responsibility of IQAC is to ensure quality enhancement and sustenance. It ensures the efficiency and effectiveness of measures taken/methods used to provide high-quality education and evaluate the degree to which each task is fulfilled. Since quality enhancement is a continuous process, the IQAC will become a part of the institution’s system and work towards the realization of the goals of quality enhancement and sustenance.",
  vision: [
    "To achieve academic excellence",
    "To enhance the quality of education",
    "To ensure the satisfaction of all the stakeholders",
    "To encourage the research and innovation in teaching and learning methodologies",
    "To promote a culture of continuous incremental improvement in the overall holistic development of the institution"
  ],
  mission: [
    "To develop the qualitative parameters leading to constant improvement of all academic and administrative activities",
    "To propose the best possible action plans which catalyze the overall academic improvement.",
    "To create the learner – centric environment"
  ],
  objectives: [
    "To live up to the demanding benchmarks.",
    "To enhance the quality of education and research.",
    "To provide a basis for decision making to improve institutional functioning.",
    "To integrate the modern methods of teaching, learning and evaluation."
  ],
  functions: [
    "Development and application of quality benchmarks/parameters for various academic and administrative activities of the institution.",
    "Facilitating the creation of a learner-centric environment conducive to quality education and faculty maturation to adopt the required knowledge and technology for participatory teaching and learning process.",
    "Arrangement for feedback response from students, parents and other stakeholders on quality-related institutional processes.",
    "Dissemination of information on various quality parameters of higher education.",
    "Organization of inter and intra institutional workshops, seminars on quality related themes and promotion of quality circles.",
    "Documentation of the various programmes/activities leading to quality improvement.",
    "Acting as a nodal agency of the Institution for coordinating quality-related activities, including adoption and dissemination of best practices.",
    "Development and maintenance of institutional database through MIS for the purpose of maintaining/enhancing institutional quality.",
    "Preparation of the Annual Quality Assurance Report (AQAR) as per guidelines and parameters of NAAC, to be submitted to NAAC."
  ],
  strategies: [
    "Ensuring timely, efficient and progressive performance of academic, administrative and financial tasks.",
    "The relevance and quality of academic and research programmes.",
    "Equitable access to and affordability of academic programmes for various sections of society.",
    "Optimization and integration of modern methods of teaching and learning.",
    "The credibility of evaluation procedures.",
    "Ensuring the adequacy, maintenance and proper allocation of support structure and services.",
    "Sharing of research findings and networking with other institutions in India and abroad."
  ],
  composition: [
    { name: "Dr. Ravi J. D'SOUZA", designation: "Principal & Chairperson", department: "Administration" },
    { name: "Rev. Fr. Maria Xavier", designation: "Vice Principal", department: "Administration" },
    { name: "Rev. Fr. Praveen Kumar", designation: "Campus Administrator", department: "Management" },
    { name: "Dr. Deepu P", designation: "IQAC Coordinator", department: "Department of Physics" },
    { name: "Dr. K. Joseph", designation: "Senior Faculty Member", department: "Department of Chemistry" },
    { name: "Dr. Poornima M", designation: "Senior Faculty Member", department: "Department of Commerce" },
    { name: "Dr. Noor Mubasheer", designation: "Senior Faculty Member", department: "Department of Computer Science" },
    { name: "Mr. Thomas Gunaseelan", designation: "Dean of Sciences", department: "Department of Physics" },
    { name: "Mr. Ronald Prakash Cutinha", designation: "Dean of Arts", department: "Department of Social Work" },
    { name: "Dr. Reena Francis", designation: "Dean of Commerce & Management", department: "Department of Commerce" },
    { name: "Mr. A. Aloysius", designation: "Administrative Officer", department: "Office Administration" },
    { name: "Mr. N. R. Chandrashekar", designation: "Management Representative", department: "MDES Nominee" },
    { name: "Mr. S. G. Bharath", designation: "Industrialist / Stakeholder", department: "Industry Nominee" },
    { name: "Ms. Ananya Rao", designation: "Student Representative", department: "Student Council" },
    { name: "Mr. Michael D'Souza", designation: "Alumni Representative", department: "Alumni Association" }
  ],
  reportsAndDocuments: [
    { title: "NAAC Accreditation Certificate (Cycle III - B++)", year: "2019", path: "/documents/academics/Naac-Certificate.pdf", size: "1.2 MB" },
    { title: "NAAC Accreditation Certificate (Cycle II - A Grade)", year: "2014", path: "/documents/academics/NAAC-2014-certificate.pdf", size: "980 KB" },
    { title: "Annual Quality Assurance Report (AQAR 2019–20)", year: "2019-20", path: "/documents/academics/2019-20.pdf", size: "2.4 MB" },
    { title: "Annual Quality Assurance Report (AQAR 2018–19)", year: "2018-19", path: "/documents/academics/2018-2019.pdf", size: "2.1 MB" }
  ],
  activitiesAndEvents: [
    { title: "National Level Seminar on NEP 2020 Implementation", date: "August 2026", category: "Seminar", description: "Comprehensive symposium on Curriculum Framework, Credit System, and Multidisciplinary Pedagogy organized by IQAC." },
    { title: "Deeksharambh 2026 - Student Induction Programme", date: "July 2026", category: "Orientation", description: "Week-long institutional induction programme for first-year undergraduate and postgraduate entrants aligned with UGC guidelines." },
    { title: "Faculty Development Programme (FDP) on AI in Higher Education", date: "June 2026", category: "FDP", description: "Hands-on workshop for academic faculty on integrating generative AI, LMS digital content, and smart classroom evaluation." },
    { title: "International Yoga Day & Wellness Conclave", date: "June 2026", category: "Health & Wellness", description: "Institution-wide health awareness session, mass yoga demonstration, and stress management workshop." },
    { title: "World Green Roof Day & Sustainability Drive", date: "June 2026", category: "Eco Initiative", description: "Eco-friendly campus awareness campaign and tree plantation initiative led by IQAC Green Audit cell." },
    { title: "Drillbit Anti-Plagiarism Software Training for Research Scholars", date: "May 2026", category: "Research Ethics", description: "Training workshop on academic integrity, similarity check, research publication metrics, and citation standards." }
  ]
};

// Write structured data
const outPath = path.resolve(__dirname, '../src/data/iqacData.json');
fs.writeFileSync(outPath, JSON.stringify(structuredData, null, 2), 'utf8');
console.log(`Saved structured IQAC data to ${outPath}`);
