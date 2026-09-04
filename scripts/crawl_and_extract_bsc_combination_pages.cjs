const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const INVENTORY_DIR = path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));

console.log('=== CRAWLING & EXTRACTING 12 B.SC SUBJECT COMBINATION DEPARTMENTS ===\n');

const bscSubjects = [
  {
    key: 'physics',
    title: 'Department of Physics',
    label: 'List of combinations with Physics',
    deptId: 'dept-physics',
    slug: 'physics',
    link: 'https://stphilos.ac.in/admissions/ug-courses/b-sc/physics/'
  },
  {
    key: 'chemistry',
    title: 'Department of Chemistry',
    label: 'List of combinations with Chemistry',
    deptId: 'dept-chemistry',
    slug: 'chemistry',
    link: 'https://stphilos.ac.in/admissions/ug-courses/b-sc/chemistry/'
  },
  {
    key: 'mathematics',
    title: 'Department of Mathematics',
    label: 'List of combinations with Mathematics',
    deptId: 'dept-mathematics',
    slug: 'mathematics',
    link: 'https://stphilos.ac.in/admissions/ug-courses/b-sc/mathematics/'
  },
  {
    key: 'botany',
    title: 'Department of Botany',
    label: 'List of combinations with Botany',
    deptId: 'dept-botany-zoology',
    slug: 'botany',
    link: 'https://stphilos.ac.in/admissions/ug-courses/b-sc/botany/'
  },
  {
    key: 'computer-science',
    title: 'Department of Computer Science',
    label: 'List of combinations with Computer Science',
    deptId: 'dept-computer-science',
    slug: 'computer-science',
    link: 'https://stphilos.ac.in/admissions/ug-courses/bca-bachelor-of-computer-applications/'
  },
  {
    key: 'zoology',
    title: 'Department of Zoology',
    label: 'List of combinations with Zoology',
    deptId: 'dept-botany-zoology',
    slug: 'zoology',
    link: 'https://stphilos.ac.in/admissions/ug-courses/b-sc/zoology/'
  },
  {
    key: 'microbiology',
    title: 'Department of Microbiology',
    label: 'List of combinations with Microbiology',
    deptId: 'dept-microbiology',
    slug: 'microbiology',
    link: 'https://stphilos.ac.in/admissions/ug-courses/b-sc/microbiology/'
  },
  {
    key: 'biochemistry',
    title: 'Department of Biochemistry',
    label: 'List of combinations with Biochemistry',
    deptId: 'dept-biochemistry',
    slug: 'biochemistry',
    link: 'https://stphilos.ac.in/admissions/ug-courses/b-sc/biochemistry/'
  },
  {
    key: 'biotechnology',
    title: 'Department of Biotechnology',
    label: 'List of combinations with Biotechnology',
    deptId: 'dept-biotechnology',
    slug: 'biotechnology',
    link: 'https://stphilos.ac.in/admissions/ug-courses/b-sc/biotechnology/'
  },
  {
    key: 'food-and-nutrition',
    title: 'Department of Food & Nutrition',
    label: 'List of combinations with Food & Nutrition',
    deptId: 'dept-food-science',
    slug: 'food-and-nutrition',
    link: 'https://stphilos.ac.in/admissions/ug-courses/ba/food-and-nutrition/'
  },
  {
    key: 'environmental-science',
    title: 'Environmental Science',
    label: 'List of combinations with Environmental Science',
    deptId: 'dept-environmental-science',
    slug: 'environmental-science-2',
    link: 'https://stphilos.ac.in/environmental-science-2/'
  },
  {
    key: 'criminology',
    title: 'Criminology and Forensic Science',
    label: 'List of combinations with Criminology and Forensic Science',
    deptId: 'dept-criminology',
    slug: 'criminology-and-forensic-science',
    link: 'https://stphilos.ac.in/criminology-and-forensic-science/'
  }
];

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const extractedCombinations = [];

for (const sub of bscSubjects) {
  const matchingPage = pages.find(p => p.slug === sub.slug || p.link === sub.link || (p.link && p.link.includes(`/${sub.slug}/`)));
  
  let pageContent = '';
  let combinationsList = [];

  if (matchingPage) {
    const rawHtml = matchingPage.content?.rendered || '';
    pageContent = cleanHtml(rawHtml);
    
    // Extract combinations list if any
    const listItems = [...rawHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => cleanHtml(m[1]));
    combinationsList = listItems.filter(item => item.length > 3 && !/home|about|admission|courses|departments/i.test(item));
  }

  extractedCombinations.push({
    key: sub.key,
    label: sub.label,
    departmentName: sub.title,
    deptId: sub.deptId,
    slug: sub.slug,
    officialUrl: sub.link,
    localRoute: `/departments/${sub.deptId}`,
    combinations: combinationsList.slice(0, 8),
    contentSummary: pageContent.slice(0, 300)
  });

  console.log(`[${sub.key}] ${sub.label} -> ${sub.title}`);
  console.log(`  Local Route: ${extractedCombinations[extractedCombinations.length - 1].localRoute}`);
  console.log(`  Found Official Page: ${matchingPage ? 'YES' : 'NO'}\n`);
}

// Save to src/data/bscCombinationsData.json
fs.writeFileSync(path.join(DATA_DIR, 'bscCombinationsData.json'), JSON.stringify(extractedCombinations, null, 2));

console.log('=== B.SC COMBINATIONS DATA STORED LOCALLY SUCCESSFULLY ===');
