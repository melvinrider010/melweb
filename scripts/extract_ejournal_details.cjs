const fs = require('fs');
const path = require('path');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));

const eJournalPage = pages.find(p => p.slug === 'e-journal' || p.link?.includes('e-journal'));

console.log('=== EXTRACTING ALL PDFS AND LINKS FROM E-JOURNAL PAGE ===');
const content = eJournalPage ? eJournalPage.content.rendered : '';

// Look for dflip shortcodes, href links, pdf links, images
const linkRegex = /href="([^">]+)"/gi;
const links = [];
let m;
while ((m = linkRegex.exec(content)) !== null) {
  links.push(m[1]);
}

const dflipMatches = content.match(/\[dflip[^\]]*\]/gi) || [];
const pdfMatches = content.match(/https?:\/\/[^"'\s<>]+\.pdf/gi) || [];

console.log(`Found ${links.length} href links.`);
console.log(`Found ${dflipMatches.length} dflip shortcodes.`);
console.log(`Found ${pdfMatches.length} PDF links directly in HTML.`);

console.log('\n--- Direct PDF Matches ---');
pdfMatches.forEach(p => console.log(` - ${p}`));

console.log('\n--- dflip Shortcodes ---');
dflipMatches.forEach(d => console.log(` - ${d}`));

console.log('\n--- All Links ---');
links.forEach(l => console.log(` - ${l}`));
