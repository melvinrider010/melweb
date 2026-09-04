const fs = require('fs');

const html = fs.readFileSync('scripts/live_home.html', 'utf8');

// Find occurrences of NOTICES, EXAMINATION, EVENTS in text
const regex = /<div[^>]*class="[^"]*tab[^"]*"[^>]*>[\s\S]*?<\/div>/gi;
// Search for text "NOTICES" followed by "EXAMINATION"
let pos = 0;
while (true) {
  const nIdx = html.indexOf('NOTICES', pos);
  if (nIdx === -1) break;
  console.log(`\nFound 'NOTICES' at ${nIdx}:`);
  console.log(html.substring(Math.max(0, nIdx - 150), Math.min(html.length, nIdx + 1200)));
  pos = nIdx + 7;
}
