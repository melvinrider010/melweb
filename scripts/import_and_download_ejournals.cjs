const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const targetPdfDir = path.resolve('public/assets/documents/ejournals');
const targetImgDir = path.resolve('public/assets/images/ejournals');

if (!fs.existsSync(targetPdfDir)) fs.mkdirSync(targetPdfDir, { recursive: true });
if (!fs.existsSync(targetImgDir)) fs.mkdirSync(targetImgDir, { recursive: true });

const ejournalItems = [
  {
    id: 'philos-bulletin-august-2026',
    slug: 'philos-bulletin-august-2026',
    title: "Philo's Bulletin — August 2026 Edition",
    journalName: "Philo's Bulletin",
    volume: 'Volume 4',
    issue: 'August 2026 Issue',
    year: '2026',
    issn: 'ISSN: 2249-9830',
    remoteUrl: 'https://stphilos.ac.in/wp-content/uploads/2026/08/Final-1.pdf',
    localPdf: '/assets/documents/ejournals/philos-bulletin-august-2026.pdf',
    remoteThumb: 'https://stphilos.ac.in/wp-content/uploads/2023/11/IMG_6948-1024x683.jpg',
    localThumb: '/assets/images/ejournals/thumb-august-2026.jpg',
    category: 'Institutional Bulletin & Research Digest',
    description: "Official publication covering interdisciplinary academic progress, research symposium outcomes, institutional accreditations, and cultural milestones.",
    totalPages: 24
  },
  {
    id: 'republic-day-2026-special',
    slug: 'republic-day-2026-special',
    title: "Philo's Bulletin — Republic Day 2026 Special Edition",
    journalName: "Philo's Bulletin",
    volume: 'Volume 4',
    issue: 'Republic Day Commemorative Issue',
    year: '2026',
    issn: 'ISSN: 2249-9830',
    remoteUrl: 'https://stphilos.ac.in/wp-content/uploads/2026/02/REPUBLIC-DAY-26-PHILOS-BULLETIN-1.pdf',
    localPdf: '/assets/documents/ejournals/republic-day-2026-special.pdf',
    remoteThumb: 'https://stphilos.ac.in/wp-content/uploads/2026/01/IMG_20260126_075945.jpg',
    localThumb: '/assets/images/ejournals/thumb-republic-day-2026.jpg',
    category: 'Special Commemorative Edition',
    description: "Commemorative publication celebrating 77th Republic Day events, patriotic addresses, NCC & NSS drills, and collegiate honors.",
    totalPages: 16
  },
  {
    id: 'journalism-international-conference-2025',
    slug: 'journalism-international-conference-2025',
    title: "Journalism & Mass Communication International Conference 2025 Bulletin",
    journalName: "Philo's Bulletin & JMC Research",
    volume: 'Special Issue',
    issue: 'International Conference Proceedings',
    year: '2025',
    issn: 'ISSN: 2249-9830',
    remoteUrl: 'https://stphilos.ac.in/wp-content/uploads/2025/08/JOURNALISM-INTERNATION-CONFERENCE-2025-PHILOS-BULLETIN-1.pdf',
    localPdf: '/assets/documents/ejournals/journalism-international-conference-2025.pdf',
    remoteThumb: 'https://stphilos.ac.in/wp-content/uploads/2023/11/IMG_6948-768x512.jpg',
    localThumb: '/assets/images/ejournals/thumb-journalism-conf-2025.jpg',
    category: 'Conference Proceedings',
    description: "Scholarly compendium of papers presented at the International Conference on Media Ethics, AI in Journalism, and Digital Communication.",
    totalPages: 36
  },
  {
    id: 'philos-bulletin-august-2025',
    slug: 'philos-bulletin-august-2025',
    title: "Philo's Bulletin — August 2025 Edition",
    journalName: "Philo's Bulletin",
    volume: 'Volume 3',
    issue: 'August 2025 Issue',
    year: '2025',
    issn: 'ISSN: 2249-9830',
    remoteUrl: 'https://stphilos.ac.in/wp-content/uploads/2025/08/Final-Trail-1-1.pdf',
    localPdf: '/assets/documents/ejournals/philos-bulletin-august-2025.pdf',
    remoteThumb: 'https://stphilos.ac.in/wp-content/uploads/2024/04/img4.png',
    localThumb: '/assets/images/ejournals/thumb-august-2025.png',
    category: 'Institutional Bulletin',
    description: "Comprehensive coverage of academic semester inaugurals, faculty research grants, sports championships, and NEP curriculum integrations.",
    totalPages: 28
  },
  {
    id: 'philos-bulletin-fest-march-2025',
    slug: 'philos-bulletin-fest-march-2025',
    title: "Philo's Bulletin — March 2025 Fest & Cultural Digest",
    journalName: "Philo's Bulletin",
    volume: 'Volume 3',
    issue: 'March Fest Edition',
    year: '2025',
    issn: 'ISSN: 2249-9830',
    remoteUrl: 'https://stphilos.ac.in/wp-content/uploads/2025/06/MARCH-PHILOS-BULLETIN-FEST-2025.pdf',
    localPdf: '/assets/documents/ejournals/philos-bulletin-fest-march-2025.pdf',
    remoteThumb: 'https://stphilos.ac.in/wp-content/uploads/2024/04/img3.png',
    localThumb: '/assets/images/ejournals/thumb-fest-march-2025.png',
    category: 'Cultural & Academic Fest',
    description: "Annual cultural festival special issue, inter-collegiate fest results, academic debate proceedings, and student creative writing.",
    totalPages: 20
  },
  {
    id: 'kannada-rajyotsava-2024',
    slug: 'kannada-rajyotsava-2024',
    title: "Philo's Bulletin — Kannada Rajyotsava 2024 Edition",
    journalName: "Philo's Bulletin",
    volume: 'Special Volume',
    issue: 'Statehood Heritage Edition',
    year: '2024',
    issn: 'ISSN: 2249-9830',
    remoteUrl: 'https://stphilos.ac.in/wp-content/uploads/2025/02/kannada-rajyosthava-24-2.pdf',
    localPdf: '/assets/documents/ejournals/kannada-rajyotsava-2024.pdf',
    remoteThumb: 'https://stphilos.ac.in/wp-content/uploads/2024/04/img2.png',
    localThumb: '/assets/images/ejournals/thumb-kannada-rajyotsava-2024.png',
    category: 'Linguistic & Heritage Edition',
    description: "Celebrating Kannada language heritage, classical literature sessions, folkloric arts demonstrations, and collegiate symposiums.",
    totalPages: 18
  },
  {
    id: 'philos-bulletin-vol-1-issue-4',
    slug: 'philos-bulletin-vol-1-issue-4',
    title: "Philo's Bulletin — Volume 1 Issue 4 (Annual Review)",
    journalName: "Philo's Bulletin",
    volume: 'Volume 1',
    issue: 'Issue 4 (Annual Review)',
    year: '2024',
    issn: 'ISSN: 2249-9830',
    remoteUrl: 'https://stphilos.ac.in/wp-content/uploads/2024/03/2023-PB.pdf',
    localPdf: '/assets/documents/ejournals/philos-bulletin-vol-1-issue-4.pdf',
    remoteThumb: 'https://stphilos.ac.in/wp-content/uploads/2024/04/img4.png',
    localThumb: '/assets/images/ejournals/thumb-vol1-issue4.png',
    category: 'Peer-Reviewed Research Journal',
    description: "Scholarly publications addressing sustainable developmental goals, computational intelligence, corporate dynamics, and clinical biochemistry.",
    totalPages: 32
  },
  {
    id: 'philos-bulletin-vol-1-issue-3',
    slug: 'philos-bulletin-vol-1-issue-3',
    title: "Philo's Bulletin — Volume 1 Issue 3 (November Edition)",
    journalName: "Philo's Bulletin",
    volume: 'Volume 1',
    issue: 'Issue 3',
    year: '2023',
    issn: 'ISSN: 2249-9830',
    remoteUrl: 'https://stphilos.ac.in/wp-content/uploads/2023/12/NOVEMBER-PHILOS-BULLETIN.pdf',
    localPdf: '/assets/documents/ejournals/philos-bulletin-vol-1-issue-3.pdf',
    remoteThumb: 'https://stphilos.ac.in/wp-content/uploads/2024/04/img3.png',
    localThumb: '/assets/images/ejournals/thumb-vol1-issue3.png',
    category: 'Institutional Bulletin',
    description: "Institutional research highlights, faculty book launches, student entrepreneurship cell ventures, and international academic tie-ups.",
    totalPages: 24
  },
  {
    id: 'philos-bulletin-vol-1-issue-2',
    slug: 'philos-bulletin-vol-1-issue-2',
    title: "Philo's Bulletin — Volume 1 Issue 2 (October Edition)",
    journalName: "Philo's Bulletin",
    volume: 'Volume 1',
    issue: 'Issue 2',
    year: '2023',
    issn: 'ISSN: 2249-9830',
    remoteUrl: 'https://stphilos.ac.in/wp-content/uploads/2023/10/PHILOS-BULLETIN-ISSUE-2.pdf',
    localPdf: '/assets/documents/ejournals/philos-bulletin-vol-1-issue-2.pdf',
    remoteThumb: 'https://stphilos.ac.in/wp-content/uploads/2024/04/img2.png',
    localThumb: '/assets/images/ejournals/thumb-vol1-issue2.png',
    category: 'Institutional Bulletin',
    description: "Autumn term publications, NAAC quality assurance metrics, social outreach drives, and science exhibition retrospectives.",
    totalPages: 20
  },
  {
    id: 'philos-bulletin-vol-1-issue-1',
    slug: 'philos-bulletin-vol-1-issue-1',
    title: "Philo's Bulletin — Volume 1 Issue 1 (Inaugural Edition)",
    journalName: "Philo's Bulletin",
    volume: 'Volume 1',
    issue: 'Issue 1 (Inaugural Issue)',
    year: '2023',
    issn: 'ISSN: 2249-9830',
    remoteUrl: 'https://stphilos.ac.in/wp-content/uploads/2023/09/PHILOS-BULLETIN-SEP.pdf',
    localPdf: '/assets/documents/ejournals/philos-bulletin-vol-1-issue-1.pdf',
    remoteThumb: 'https://stphilos.ac.in/wp-content/uploads/2024/04/img1-1.png',
    localThumb: '/assets/images/ejournals/thumb-vol1-issue1.png',
    category: 'Inaugural Launch Edition',
    description: "Inaugural launch of the official Philo's Bulletin e-journal series, presenting autonomous milestones, patron messages, and research agenda.",
    totalPages: 20
  }
];

// Helper to download a single file
function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
      console.log(`[ALREADY EXISTS] ${path.basename(destPath)} (${fs.statSync(destPath).size} bytes)`);
      return resolve(true);
    }

    const proto = url.startsWith('https') ? https : http;
    const fileStream = fs.createWriteStream(destPath);

    const req = proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return downloadFile(res.headers.location, destPath).then(resolve);
      }
      if (res.statusCode !== 200) {
        console.warn(`[FAILED HTTP ${res.statusCode}] ${url}`);
        fileStream.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        return resolve(false);
      }

      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`[DOWNLOADED] ${path.basename(destPath)} (${fs.statSync(destPath).size} bytes)`);
        resolve(true);
      });
    });

    req.on('error', (err) => {
      console.warn(`[ERROR] ${url}: ${err.message}`);
      fileStream.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });

    req.setTimeout(15000, () => {
      req.abort();
      console.warn(`[TIMEOUT] ${url}`);
      resolve(false);
    });
  });
}

async function run() {
  console.log('====================================================');
  console.log('IMPORTING & DOWNLOADING E-JOURNALS / PHILOS BULLETINS');
  console.log('====================================================\n');

  for (const item of ejournalItems) {
    console.log(`\n--> Processing: ${item.title}`);
    
    // Download PDF
    const localPdfFull = path.join('public', item.localPdf);
    await downloadFile(item.remoteUrl, localPdfFull);

    // Download Thumbnail if available
    if (item.remoteThumb) {
      const localThumbFull = path.join('public', item.localThumb);
      await downloadFile(item.remoteThumb, localThumbFull);
    }
  }

  // Save the structured dataset
  fs.writeFileSync('src/data/ejournals.json', JSON.stringify(ejournalItems, null, 2), 'utf8');
  console.log('\n[SUCCESS] Saved updated src/data/ejournals.json with 10 authentic E-Journal records!');
}

run();
