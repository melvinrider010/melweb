const fs = require('fs');

const html = fs.readFileSync('scripts/live_home.html', 'utf8');

// Search for 'PG MAKEUP EXAMINATION'
const pos = html.indexOf('PG MAKEUP EXAMINATION');
console.log('PG MAKEUP EXAMINATION pos:', pos);

if (pos !== -1) {
  console.log('=== HTML SECTION (pos - 1500 to pos + 4000) ===');
  console.log(html.substring(pos - 1500, pos + 4000));
}
