const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const INVENTORY_DIR = path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));

const targetUrls = [
  // UG (8)
  { id: 'bcom', code: 'B.Com', type: 'ug', title: 'Bachelor of Commerce (B.Com)', url: 'https://stphilos.ac.in/b-com-2/', slug: 'b-com-2', deptId: 'dept-commerce', relatedPg: ['mcom'] },
  { id: 'bsc', code: 'B.Sc', type: 'ug', title: 'Bachelor of Science (B.Sc)', url: 'https://stphilos.ac.in/b-sc/', slug: 'b-sc', deptId: 'dept-physics', relatedPg: ['msc-physics', 'msc-chemistry', 'msc-mathematics'] },
  { id: 'bca', code: 'BCA', type: 'ug', title: 'Bachelor of Computer Applications (BCA)', url: 'https://stphilos.ac.in/bca/', slug: 'bca', deptId: 'dept-bca', relatedPg: ['mca'] },
  { id: 'ba', code: 'B.A', type: 'ug', title: 'Bachelor of Arts (B.A)', url: 'https://stphilos.ac.in/b-a/', slug: 'b-a', deptId: 'dept-english', relatedPg: ['ma-economics', 'ma-english', 'ma-journalism'] },
  { id: 'bsw', code: 'BSW', type: 'ug', title: 'Bachelor of Social Work (BSW)', url: 'https://stphilos.ac.in/bsw/', slug: 'bsw', deptId: 'dept-social-work', relatedPg: ['msw'] },
  { id: 'bvoc', code: 'B.Voc', type: 'ug', title: 'Bachelor of Vocation (B.Voc)', url: 'https://stphilos.ac.in/admissions/ug-courses/b-voc/', slug: 'b-voc', deptId: 'dept-vocational-studies', relatedPg: ['mca', 'ma-journalism'] },
  { id: 'bba-thm', code: 'BBA-TH', type: 'ug', title: 'BBA in Tourism & Hospitality Management (BBA-TH)', url: 'https://stphilos.ac.in/admissions/ug-courses/bachelor-of-tourism-and-hospitality-management/', slug: 'bachelor-of-tourism-and-hospitality-management', deptId: 'dept-management', relatedPg: ['mba'] },
  { id: 'bba', code: 'BBA', type: 'ug', title: 'Bachelor of Business Administration (BBA)', url: 'https://stphilos.ac.in/bba/', slug: 'bba', deptId: 'dept-management', relatedPg: ['mba'] },

  // PG (15)
  { id: 'msc-chemistry', code: 'M.Sc Chemistry', type: 'pg', title: 'M.Sc in Chemistry', url: 'https://stphilos.ac.in/admissions/pg-courses/m-sc-chemistry/', slug: 'm-sc-chemistry', deptId: 'dept-chemistry', relatedUg: ['bsc'] },
  { id: 'ma-economics', code: 'M.A Economics', type: 'pg', title: 'M.A in Economics', url: 'https://stphilos.ac.in/admissions/pg-courses/m-a-in-economics/', slug: 'm-a-in-economics', deptId: 'dept-economics', relatedUg: ['ba'] },
  { id: 'msc-physics', code: 'M.Sc Physics', type: 'pg', title: 'M.Sc in Physics', url: 'https://stphilos.ac.in/admissions/pg-courses/m-sc-physics/', slug: 'm-sc-physics', deptId: 'dept-physics', relatedUg: ['bsc'] },
  { id: 'msc-computer-science', code: 'M.Sc Computer Science', type: 'pg', title: 'M.Sc in Computer Science', url: 'https://stphilos.ac.in/admissions/pg-courses/m-sc-computer-science/', slug: 'm-sc-computer-science', deptId: 'dept-computer-science', relatedUg: ['bsc', 'bca'] },
  { id: 'msc-biochemistry', code: 'M.Sc Biochemistry', type: 'pg', title: 'M.Sc in Biochemistry', url: 'https://stphilos.ac.in/admissions/pg-courses/m-sc-biochemistry/', slug: 'm-sc-biochemistry', deptId: 'dept-biochemistry', relatedUg: ['bsc'] },
  { id: 'msc-mathematics', code: 'M.Sc Mathematics', type: 'pg', title: 'M.Sc in Mathematics', url: 'https://stphilos.ac.in/admissions/pg-courses/m-sc-mathematics/', slug: 'm-sc-mathematics', deptId: 'dept-mathematics', relatedUg: ['bsc'] },
  { id: 'msw', code: 'MSW', type: 'pg', title: 'Master of Social Work (MSW)', url: 'https://stphilos.ac.in/admissions/pg-courses/master-of-social-work/', slug: 'master-of-social-work', deptId: 'dept-social-work', relatedUg: ['bsw', 'ba'] },
  { id: 'ma-english', code: 'M.A English', type: 'pg', title: 'M.A in English', url: 'https://stphilos.ac.in/admissions/pg-courses/m-a-english/', slug: 'm-a-english', deptId: 'dept-english', relatedUg: ['ba'] },
  { id: 'mcom', code: 'M.Com', type: 'pg', title: 'Master of Commerce (M.Com)', url: 'https://stphilos.ac.in/admissions/pg-courses/m-com/', slug: 'm-com', deptId: 'dept-commerce', relatedUg: ['bcom'] },
  { id: 'msc-criminology', code: 'M.Sc Criminology & Forensic Science', type: 'pg', title: 'M.Sc in Criminology & Forensic Science', url: 'https://stphilos.ac.in/department-of-criminology-and-forensic-science/', slug: 'department-of-criminology-and-forensic-science', deptId: 'dept-criminology', relatedUg: ['ba', 'bsc'] },
  { id: 'ma-journalism', code: 'M.A Journalism', type: 'pg', title: 'M.A in Journalism & Mass Communication', url: 'https://stphilos.ac.in/admissions/pg-courses/m-a-mass-communication-journalism/', slug: 'm-a-mass-communication-journalism', deptId: 'dept-journalism', relatedUg: ['ba', 'bvoc'] },
  { id: 'msc-psychology', code: 'M.Sc Psychology', type: 'pg', title: 'M.Sc in Psychology', url: 'https://stphilos.ac.in/department-of-psychology/', slug: 'department-of-psychology', deptId: 'dept-psychology', relatedUg: ['ba', 'bsc'] },
  { id: 'msc-food-science', code: 'M.Sc Food Science & Nutrition', type: 'pg', title: 'M.Sc in Food Science & Nutrition', url: 'https://stphilos.ac.in/post-graduation-department-of-food-science-and-nutrition/', slug: 'post-graduation-department-of-food-science-and-nutrition', deptId: 'dept-food-science', relatedUg: ['bsc'] },
  { id: 'mca', code: 'MCA', type: 'pg', title: 'Master of Computer Applications (MCA)', url: 'https://stphilos.ac.in/mca/', slug: 'mca', deptId: 'dept-bca', relatedUg: ['bca', 'bsc'] },
  { id: 'mba', code: 'MBA', type: 'pg', title: 'Master of Business Administration (MBA)', url: 'https://stphilos.ac.in/mba/', slug: 'mba', deptId: 'dept-management', relatedUg: ['bba', 'bba-thm', 'bcom'] }
];

console.log('=== AUDITING & EXTRACTING ALL 23 OFFICIAL PROGRAMME PAGES ===');

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

const extractedProgrammes = [];

for (const target of targetUrls) {
  const page = pages.find(p => p.slug === target.slug || p.link?.includes(target.slug) || p.link === target.url);
  const rawHtml = page ? page.content?.rendered || '' : '';
  const cleanText = cleanHtml(rawHtml);

  console.log(`\n------------------------------------------------------------`);
  console.log(`[${target.type.toUpperCase()}] ${target.title} (${target.code})`);
  console.log(`Official URL: ${target.url}`);
  console.log(`Page Found in Inventory: ${page ? `YES (ID: ${page.id})` : 'NO'}`);
  console.log(`Content Length: ${cleanText.length}`);
  if (cleanText.length > 0) {
    console.log(`Snippet: ${cleanText.substring(0, 180)}...`);
  }

  extractedProgrammes.push({
    ...target,
    pageId: page ? page.id : null,
    hasRawContent: cleanText.length > 0,
    rawText: cleanText
  });
}

fs.writeFileSync(path.join(__dirname, 'extracted_23_programmes_audit.json'), JSON.stringify(extractedProgrammes, null, 2));
console.log(`\n=== AUDIT COMPLETE: 23/23 PROGRAMMES MAPPED ===`);
