const fs = require('fs');

const html = fs.readFileSync('scripts/live_home.html', 'utf8');

const regex = /notice\s*board/gi;
let match;
while ((match = regex.exec(html)) !== null) {
  console.log(`Found match at ${match.index}:`);
  console.log(html.substring(Math.max(0, match.index - 200), Math.min(html.length, match.index + 1500)));
}

// Search for 'PG MAKEUP'
const pgm = html.indexOf('PG MAKEUP');
if (pgm !== -1) {
  console.log('\nAround PG MAKEUP:');
  console.log(html.substring(Math.max(0, pgm - 500), Math.min(html.length, pgm + 2500)));
}
