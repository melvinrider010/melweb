const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchHTML(res.headers.location));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

function downloadImage(url, destPath) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destPath);
    const client = url.startsWith('https') ? https : http;
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        file.close();
        return resolve(downloadImage(res.headers.location, destPath));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(true);
      });
    }).on('error', err => {
      fs.unlink(destPath, () => {});
      reject(err);
    });
  });
}

async function run() {
  console.log('Fetching raw HTML from https://stphilos.ac.in/ug/ ...');
  const html = await fetchHTML('https://stphilos.ac.in/ug/');
  
  // Save raw HTML for analysis
  fs.writeFileSync('scripts/ug_raw.html', html, 'utf8');
  console.log('Saved raw HTML to scripts/ug_raw.html');

  // Let's inspect the cards
  // WordPress usually renders course cards as:
  // <div class="...course-item..."> or <img> followed by <h6>TITLE</h6>
  const destDir = path.join('public', 'assets', 'programmes', 'ug');
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

  // Regex to match image + title patterns
  const cardRegex = /<img[^>]+(?:src|data-src)=["']([^"']+\.(?:jpg|jpeg|png|webp))["'][^>]*>[\s\S]*?<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi;
  
  let match;
  const cards = [];
  while ((match = cardRegex.exec(html)) !== null) {
    const imgUrl = match[1];
    const title = match[2].replace(/<[^>]+>/g, '').trim();
    if (title && !imgUrl.includes('logo') && !imgUrl.includes('cropped-image-40')) {
      cards.push({ title, imgUrl });
    }
  }

  console.log(`Found ${cards.length} programme cards with images:`);
  for (const c of cards) {
    console.log(`  - [${c.title}] -> ${c.imgUrl}`);
    const slug = c.title
      .toLowerCase()
      .replace(/\[.*?\]|\(.*?\)/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
      
    if (slug) {
      const destFile = path.join(destDir, `${slug}.jpg`);
      console.log(`    Downloading -> ${destFile}`);
      try {
        await downloadImage(c.imgUrl, destFile);
      } catch (e) {
        console.error(`    Error downloading ${c.imgUrl}: ${e.message}`);
      }
    }
  }
}

run();
