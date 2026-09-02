const fs = require('fs');
const html = fs.readFileSync('scripts/scraped_academics/prospectus.html', 'utf8');

const regex = /https?:\/\/[^\s"'<>]+\.pdf/gi;
const matches = [...new Set(html.match(regex) || [])];
console.log('PDF links found in prospectus.html:');
matches.forEach(m => console.log(m));

const dflipMatch = html.match(/source["']?\s*:\s*["']([^"']+)["']/i);
if (dflipMatch) {
  console.log('DFLIP source:', dflipMatch[1].replace(/\\\//g, '/'));
}

const allUrls = html.match(/https?:\/\/[^\s"'<>]+/gi) || [];
const prospectLinks = allUrls.filter(u => u.toLowerCase().includes('prospectus') || u.toLowerCase().includes('brochure') || u.toLowerCase().includes('admission'));
console.log('Prospectus-related URLs:');
prospectLinks.forEach(u => console.log(u));
