const https = require('https');
const fs = require('fs');

https.get('https://stphilos.ac.in/', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    fs.writeFileSync('scripts/live_home.html', body);
    console.log('Downloaded homepage HTML, length:', body.length);
    
    // Find Notice board widget
    const idx = body.indexOf('NOTICE BOARD');
    if (idx !== -1) {
      console.log('Found NOTICE BOARD at index:', idx);
      const chunk = body.substring(idx - 200, idx + 4000);
      console.log('=== CHUNK ===');
      console.log(chunk);
    } else {
      console.log('NOTICE BOARD string not found, searching case-insensitive...');
      const match = body.match(/notice[\s_-]*board/i);
      console.log('Match:', match);
    }
  });
}).on('error', err => console.error(err));
