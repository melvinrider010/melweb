const fs = require('fs');
const path = require('path');

const pages = JSON.parse(fs.readFileSync(path.join(__dirname, 'historical_migration/raw_inventory/pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(__dirname, 'historical_migration/raw_inventory/posts.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(__dirname, 'historical_migration/raw_inventory/media.json'), 'utf8'));

const mediaById = new Map(media.map(m => [m.id, m]));

// Find all department and faculty pages
const deptPages = [];
const facultyPages = [];

const allItems = [...pages, ...posts];

for (const item of allItems) {
  const slug = item.slug || '';
  const title = (item.title?.rendered || '').trim();
  const content = item.content?.rendered || '';

  // Department pages
  if (/(?:department|dept)-of-|dept-of|post-graduation-department|department-of/i.test(slug) || (/department of/i.test(title) && !/feedback|meeting|invited/i.test(title))) {
    deptPages.push({ id: item.id, slug, title, link: item.link, content });
  }

  // Individual faculty pages
  if (/^(?:dr|mr|mrs|ms|prof|rev)-/i.test(slug) || (/^(?:Dr|Mr|Mrs|Ms|Prof|Rev)\.?\s+/i.test(title) && title.length < 50 && !/talk|workshop|lecture|celebration|meeting/i.test(title))) {
    facultyPages.push({ id: item.id, slug, title, link: item.link, content, featured_media: item.featured_media });
  }
}

console.log(`Identified ${deptPages.length} Department pages and ${facultyPages.length} Individual Faculty Profile pages.`);

fs.writeFileSync(path.join(__dirname, 'dept_pages_audit.json'), JSON.stringify(deptPages.map(d => ({ id: d.id, slug: d.slug, title: d.title, link: d.link })), null, 2));
fs.writeFileSync(path.join(__dirname, 'faculty_pages_audit.json'), JSON.stringify(facultyPages.map(f => ({ id: f.id, slug: f.slug, title: f.title, link: f.link })), null, 2));

console.log('Sample Department pages:');
deptPages.slice(0, 20).forEach(d => console.log(` - [${d.id}] ${d.title} (${d.slug})`));

console.log('\nSample Faculty pages:');
facultyPages.slice(0, 20).forEach(f => console.log(` - [${f.id}] ${f.title} (${f.slug})`));
