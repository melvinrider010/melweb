const fs = require('fs');
const path = require('path');

const faculty = JSON.parse(fs.readFileSync(path.join(__dirname, '../src/data/faculty.json'), 'utf8'));

console.log('=== SEARCHING FOR FR RICHARD MENEZES & ALL FACULTY ANOMALIES ===');

faculty.forEach((f, idx) => {
  // Check if name has prefix or title
  if (/richard|hencieta/i.test(f.name)) {
    console.log(`\n[${idx}] Found:`, f);
  }
});

console.log('\n=== FACULTY WITH COMMA IN DESIGNATION OR TYPOS IN QUALIFICATION ===');
faculty.forEach((f, idx) => {
  if (f.designation.includes(',') || /philophy|mth|msc\s*\(/i.test(f.qualification) || f.name.startsWith('Fr ') || f.name.startsWith('Rev ') || f.name.startsWith('Dr ')) {
    console.log(`[${idx}] Name: "${f.name}" | Desig: "${f.designation}" | Qual: "${f.qualification}" | Dept: ${f.departmentId}`);
  }
});
