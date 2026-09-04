const fs = require('fs');
const path = require('path');

const rawPage = JSON.parse(fs.readFileSync(path.join(__dirname, 'stphilos_raw/pages/iqac.json'), 'utf8'));
const content = rawPage.content.rendered;

// Extract headings
const headingMatches = [...content.matchAll(/<h([1-6])[^>]*>([\s\S]*?)<\/h\1>/gi)];
console.log('Headings:');
headingMatches.forEach(m => console.log(`  H${m[1]}: ${m[2].replace(/<[^>]+>/g, '').trim()}`));

// Extract tables
const tableMatches = [...content.matchAll(/<table[\s\S]*?<\/table>/gi)];
console.log(`\nTables count: ${tableMatches.length}`);

// Extract PDFs
const pdfMatches = [...content.matchAll(/href=["'](https?:\/\/[^"']+\.pdf)["']/gi)];
console.log(`\nPDFs count: ${pdfMatches.length}`);
pdfMatches.slice(0, 10).forEach(m => console.log('  PDF:', m[1]));

// Extract Images
const imgMatches = [...content.matchAll(/src=["'](https?:\/\/[^"']+\.(?:png|jpe?g|webp|gif))["']/gi)];
console.log(`\nImages count: ${imgMatches.length}`);
imgMatches.forEach(m => console.log('  IMG:', m[1]));
