const fs = require('fs');
const path = require('path');

const html = fs.readFileSync(path.join(__dirname, 'stphilos_raw/pages/iqac.html'), 'utf8');

// Find the section with NAAC CERTIFICATES, Minutes of Meeting, AQAR, Composition, Activities, Audits
const idx = html.indexOf('NAAC CERTIFICATES');
if (idx !== -1) {
  console.log(html.substring(idx - 200, idx + 4500));
} else {
  console.log('NAAC CERTIFICATES not found in iqac.html');
}
