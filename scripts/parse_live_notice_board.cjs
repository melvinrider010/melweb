const fs = require('fs');

const html = fs.readFileSync('scripts/live_home.html', 'utf8');

// Search for NOTICE BOARD
const noticeBoardPos = html.indexOf('NOTICE BOARD');
console.log('NOTICE BOARD pos:', noticeBoardPos);

if (noticeBoardPos !== -1) {
  console.log('=== HTML SNIPPET AROUND NOTICE BOARD ===');
  console.log(html.substring(noticeBoardPos - 100, noticeBoardPos + 2500));
}

// Let's also search for EXAMINATION and EVENTS tabs
const examPos = html.indexOf('EXAMINATION');
console.log('EXAMINATION pos:', examPos);
if (examPos !== -1) {
  console.log('=== HTML SNIPPET AROUND EXAMINATION ===');
  console.log(html.substring(examPos - 100, examPos + 1500));
}
