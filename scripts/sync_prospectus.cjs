const fs = require('fs');
const path = require('path');

const src = 'public/assets/documents/admission/Final-Copy-of-College-Prospectus.pdf';
const destDir = 'public/assets/documents/admissions';
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}
fs.copyFileSync(src, path.join(destDir, 'st-philomena-prospectus-2026-27.pdf'));
console.log('Synced prospectus to standard admissions path');
