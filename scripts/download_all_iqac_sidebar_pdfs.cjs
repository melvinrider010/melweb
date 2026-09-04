const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.resolve(__dirname, '../public/documents/academics');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Find all pdf links in the raw IQAC subpages
const rawDir = path.resolve(__dirname, 'stphilos_raw/pages');
const files = fs.readdirSync(rawDir);
const allPdfUrls = new Set();

files.forEach(f => {
  const content = fs.readFileSync(path.join(rawDir, f), 'utf8');
  const matches = [...content.matchAll(/href=["'](https?:\/\/[^"']+\.pdf)["']/gi)];
  matches.forEach(m => {
    if (m[1].includes('stphilos.ac.in') || m[1].includes('wp-content')) {
      allPdfUrls.add(m[1]);
    }
  });
});

console.log(`Found ${allPdfUrls.size} unique official PDF URLs across raw pages.`);

function downloadFile(url) {
  return new Promise((resolve) => {
    const filename = decodeURIComponent(path.basename(url)).replace(/\s+/g, '_');
    const dest = path.join(targetDir, filename);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve({ url, filename, status: 'EXISTS' });
    }

    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https:') ? https : require('http');
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve({ url, filename, status: 'DOWNLOADED' });
        });
      } else {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        resolve({ url, filename, status: `HTTP_${res.statusCode}` });
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve({ url, filename, status: err.message });
    });
  });
}

async function run() {
  const urls = Array.from(allPdfUrls);
  console.log(`Downloading ${urls.length} PDFs...`);
  let downloaded = 0;
  for (const u of urls) {
    const res = await downloadFile(u);
    if (res.status === 'DOWNLOADED' || res.status === 'EXISTS') {
      downloaded++;
    }
  }
  console.log(`Cached ${downloaded}/${urls.length} PDFs locally into public/documents/academics/`);
}

run();
