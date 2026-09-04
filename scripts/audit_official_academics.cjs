const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');

// 1. Load Raw WP Inventory from stphilos.ac.in
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'media.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'categories.json'), 'utf8'));

const mediaById = new Map(media.map(m => [m.id, m]));
const mediaByUrl = new Map();
for (const m of media) {
  if (m.source_url) {
    mediaByUrl.set(m.source_url, m);
    const fname = path.basename(m.source_url).toLowerCase();
    mediaByUrl.set(fname, m);
  }
}

console.log('=== STEP 1: AUDITING OFFICIAL STPHILOS.AC.IN CONTENT INVENTORY ===');
console.log(`Total Pages: ${pages.length}`);
console.log(`Total Posts: ${posts.length}`);
console.log(`Total Media Items: ${media.length}`);
console.log(`Total Categories: ${categories.length}`);

// Let's audit existing data in src/data/
const existingDepts = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/departments.json'), 'utf8'));
const existingProgs = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/programs.json'), 'utf8'));
const existingFaculty = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/faculty.json'), 'utf8'));

console.log('\n=== CURRENT APPLICATION DATA COUNTS ===');
console.log(`Existing Departments: ${existingDepts.length}`);
console.log(`Existing Programs: ${existingProgs.length}`);
console.log(`Existing Faculty: ${existingFaculty.length}`);

// Let's analyze all pages to discover academic faculties, departments, courses, faculty profiles
const discoveredDepartments = [];
const discoveredFacultyProfiles = [];
const discoveredProgrammes = [];

// Helper to clean HTML text
function cleanText(html) {
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

// 2. Discover Department Pages on stphilos.ac.in
for (const page of pages) {
  const slug = page.slug || '';
  const title = cleanText(page.title?.rendered);
  const link = page.link || '';
  const content = page.content?.rendered || '';

  // Identify genuine department/course overview pages
  // e.g. /bca/, /bba/, /department-of-computer-science/, /m-a-mass-communication-journalism/, /physics/, /chemistry/, etc.
  const isDeptPage = 
    /department|dept|post-graduation-department|post-graduate-department/i.test(slug) ||
    /^(?:bca|bba|bcom|b-sc|ba|bsw|mba|mca|m-com|m-sc|m-a|msw|b-voc|bvoc)/i.test(slug) ||
    /^(?:physics|chemistry|mathematics|biochemistry|biotechnology|microbiology|botany|zoology|food-science|psychology|criminology|economics|sociology|history|english|kannada|hindi|christianity|environmental-science|social-work|journalism|tourism)/i.test(slug);

  if (isDeptPage) {
    // Extract faculty tables/grids from within department page HTML
    // St. Philomena's WP uses table or div layout for faculty members:
    // <tr><td><img src="..."></td><td>Name</td><td>Designation</td><td>Qualification</td></tr>
    // or similar patterns
    
    // Look for image tags
    const imgMatches = [];
    const imgRegex = /<img[^>]+src="([^">]+)"[^>]*>/gi;
    let m;
    while ((m = imgRegex.exec(content)) !== null) {
      imgMatches.push(m[1]);
    }

    discoveredDepartments.push({
      pageId: page.id,
      title: title,
      slug: slug,
      link: link,
      imageCount: imgMatches.length,
      featured_media: page.featured_media,
      featured_media_url: page.featured_media && mediaById.has(page.featured_media) ? mediaById.get(page.featured_media).source_url : null,
      images: imgMatches,
      rawContent: content
    });
  }
}

console.log(`\nDiscovered ${discoveredDepartments.length} potential department/programme pages.`);
fs.writeFileSync(path.join(__dirname, 'raw_discovered_departments.json'), JSON.stringify(discoveredDepartments.map(d => ({
  pageId: d.pageId,
  title: d.title,
  slug: d.slug,
  link: d.link,
  imageCount: d.imageCount,
  featured_media_url: d.featured_media_url
})), null, 2));

console.log('Saved raw_discovered_departments.json');
