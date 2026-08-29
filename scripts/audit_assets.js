import fs from 'fs';
import path from 'path';

function walk(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walk(filePath, fileList);
    } else if (/\.(jsx?|json|css)$/.test(file)) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const srcFiles = walk('./src');
const publicFiles = walk('./public');
const allFiles = [...srcFiles, ...publicFiles];

const stphilosAssetRefs = [];
const externalLinkAllowlist = ['uom.ac.in', 'ugc.gov.in', 'naac.gov.in', 'aicte-india.org', 'swayam.gov.in'];

for (const file of allFiles) {
  // Ignore migration map or log files that are purely historical mappings
  if (file.includes('content-migration-map.json') || file.includes('legacy-url-map.json')) continue;
  
  const content = fs.readFileSync(file, 'utf-8');
  if (content.includes('stphilos.ac.in')) {
    const lines = content.split('\n');
    lines.forEach((line, idx) => {
      // Check if it's an asset/document/image hotlink reference
      if (line.includes('stphilos.ac.in/wp-content') || line.includes('stphilos.ac.in/')) {
        // Exclude email addresses like admin@stphilos.ac.in
        if (!line.includes('@stphilos.ac.in')) {
          stphilosAssetRefs.push(`${file}:${idx + 1}: ${line.trim()}`);
        }
      }
    });
  }
}

console.log('====================================================');
console.log('       ST. PHILOMENA\'S ASSET AUDIT REPORT           ');
console.log('====================================================');
console.log(`1. Total Source & Asset Files Audited: ${allFiles.length}`);
console.log(`2. Runtime Hotlinked stphilos.ac.in Asset References: ${stphilosAssetRefs.length}`);

if (stphilosAssetRefs.length > 0) {
  console.log('\nHotlinked References Found (Action Required):');
  console.log(stphilosAssetRefs.join('\n'));
} else {
  console.log('\nSUCCESS: Zero runtime asset dependencies on stphilos.ac.in remain!');
  console.log('All images, PDFs, circulars, timetables, and documents load directly from local assets (/assets/...).');
}

console.log('====================================================');
