const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'live_ejournal_page.html'), 'utf8');

// Search for journal titles, headings, ISSN, links
const headings = [];
const hRegex = /<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
let m;
while ((m = hRegex.exec(html)) !== null) {
  headings.push(m[1].replace(/<[^>]+>/g, '').trim());
}

console.log('=== HEADINGS ON E-JOURNAL PAGE ===');
headings.filter(Boolean).forEach(h => console.log(` - ${h}`));

// Search for links
const links = [];
const linkRegex = /<a[^>]+href="([^">]+)"[^>]*>([\s\S]*?)<\/a>/gi;
while ((m = linkRegex.exec(html)) !== null) {
  const url = m[1];
  const text = m[2].replace(/<[^>]+>/g, '').trim();
  if (url && text && !url.includes('wp-admin') && !url.includes('#')) {
    links.push({ url, text });
  }
}

console.log('\n=== LINKS ON E-JOURNAL PAGE ===');
links.forEach(l => console.log(` - [${l.text}] -> ${l.url}`));
