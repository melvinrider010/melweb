const fs = require('fs');
const path = require('path');

const pagesDir = path.join(__dirname, 'stphilos_raw/pages');
const files = fs.readdirSync(pagesDir);

const rawPages = JSON.parse(fs.readFileSync(path.join(__dirname, 'stphilos_raw/manifests/all_wp_pages_raw.json'), 'utf8'));

// Build lookup by slug and link
const pageMap = new Map();
rawPages.forEach(p => {
  pageMap.set(p.slug.toLowerCase(), p);
  pageMap.set((p.link || '').toLowerCase().replace(/\/$/, ''), p);
});

// Find all pages that mention departments or programmes
const academicMatrix = [];

files.forEach(file => {
  const slug = file.replace(/\.html$/, '');
  const content = fs.readFileSync(path.join(pagesDir, file), 'utf8');
  
  // Look for department header or title
  const titleMatch = content.match(/<h[1-3][^>]*>(?:DEPARTMENT OF|POST GRADUATE DEPARTMENT OF|PG DEPARTMENT OF|DEPARTMENT)\s+([^<]+)<\/h[1-3]>/i) ||
                     content.match(/Title:\s*([^|]+)\s*\|\s*Type:\s*(?:department|programme)/i);

  // Look for faculty profile links
  const facultyLinks = [];
  const linkRegex = /href=["']https?:\/\/stphilos\.ac\.in\/([a-zA-Z0-9_\-]+)\/?["']/gi;
  let match;
  while ((match = linkRegex.exec(content)) !== null) {
    const fSlug = match[1].toLowerCase();
    const linkedPage = pageMap.get(fSlug);
    if (linkedPage) {
      const linkedContent = linkedPage.content?.rendered || '';
      if (linkedContent.includes('Personal Details') || 
          linkedContent.includes('Educational Qualification') || 
          linkedContent.includes('Teaching Experience') ||
          linkedContent.includes('Areas of Specialization') ||
          linkedContent.includes('Conference') ||
          linkedContent.includes('Publications') ||
          fSlug.startsWith('dr-') || fSlug.startsWith('prof-') || 
          fSlug.startsWith('mr-') || fSlug.startsWith('mrs-') || 
          fSlug.startsWith('ms-') || fSlug.startsWith('rev-') ||
          fSlug === 'e-gloriya' || fSlug.endsWith('detail') || fSlug.endsWith('details') || fSlug.endsWith('profile')) {
        if (!facultyLinks.includes(fSlug)) facultyLinks.push(fSlug);
      }
    }
  }

  if (titleMatch || facultyLinks.length > 0) {
    academicMatrix.push({
      slug: slug,
      title: titleMatch ? titleMatch[1].trim() : slug,
      facultyLinksCount: facultyLinks.length,
      facultySlugs: facultyLinks
    });
  }
});

console.log('Total Academic Pages with Discovered Structure/Faculty:', academicMatrix.length);
console.log('\nTop 25 Academic Pages by Linked Faculty Count:');
academicMatrix
  .sort((a, b) => b.facultyLinksCount - a.facultyLinksCount)
  .slice(0, 25)
  .forEach(m => {
    console.log(`- [${m.slug}] "${m.title}": ${m.facultyLinksCount} faculty profiles -> [${m.facultySlugs.slice(0, 4).join(', ')}...]`);
  });
