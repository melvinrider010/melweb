const fs = require('fs');
const path = require('path');
const https = require('https');

// Check all crawled raw files in scripts/stphilos_raw/pages/
const rawDir = path.resolve(__dirname, 'stphilos_raw/pages');
const files = fs.readdirSync(rawDir);

console.log(`Checking ${files.length} raw files for IQAC sub-links...`);

files.forEach(f => {
  const text = fs.readFileSync(path.join(rawDir, f), 'utf8');
  if (text.includes('GREEN AUDIT') || text.includes('GENDER AUDIT') || text.includes('CRITERIA LEADER') || text.includes('Minutes of Meeting') || text.includes('AQAR 2023-24')) {
    console.log(`Match in ${f}`);
  }
});
