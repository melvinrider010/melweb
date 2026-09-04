const http = require('http');

http.get('http://localhost:5173/', (res) => {
  let body = '';
  res.on('data', chunk => body += chunk);
  res.on('end', () => {
    console.log('Homepage HTTP Status:', res.statusCode);
    console.log('Contains root element:', body.includes('<div id="root"></div>'));
    console.log('HTML size:', body.length, 'bytes');
  });
}).on('error', (err) => {
  console.error('Dev server error:', err.message);
});
