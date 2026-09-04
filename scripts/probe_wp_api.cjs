const https = require('https');

function check(url) {
  return new Promise((resolve) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        console.log(url);
        console.log(`  Status: ${res.statusCode}`);
        console.log(`  x-wp-total: ${res.headers['x-wp-total']}`);
        console.log(`  x-wp-totalpages: ${res.headers['x-wp-totalpages']}`);
        resolve({ url, status: res.statusCode, total: res.headers['x-wp-total'], pages: res.headers['x-wp-totalpages'], body: body.slice(0, 200) });
      });
    }).on('error', (err) => {
      console.error(url, err.message);
      resolve({ url, error: err.message });
    });
  });
}

async function main() {
  await check('https://stphilos.ac.in/wp-json/wp/v2/posts?per_page=1');
  await check('https://stphilos.ac.in/wp-json/wp/v2/pages?per_page=1');
  await check('https://stphilos.ac.in/wp-json/wp/v2/media?per_page=1');
  await check('https://stphilos.ac.in/wp-json/wp/v2/categories?per_page=100');
  await check('https://stphilos.ac.in/wp-json/wp/v2/tags?per_page=100');
  await check('https://stphilos.ac.in/sitemap.xml');
  await check('https://stphilos.ac.in/sitemap_index.xml');
  await check('https://stphilos.ac.in/wp-sitemap.xml');
}

main();
