const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT_DIR = path.join(__dirname, '..');
const MCA_IMG_DIR = path.join(ROOT_DIR, 'public/assets/images/courses/mca');
if (!fs.existsSync(MCA_IMG_DIR)) fs.mkdirSync(MCA_IMG_DIR, { recursive: true });

const images = [
  { url: 'https://stphilos.ac.in/wp-content/uploads/2025/01/p1.png', file: 'mca-prospectus-1.png' },
  { url: 'https://stphilos.ac.in/wp-content/uploads/2025/01/p2.png', file: 'mca-prospectus-2.png' },
  { url: 'https://stphilos.ac.in/wp-content/uploads/2025/01/p3.png', file: 'mca-prospectus-3.png' }
];

function downloadFile(url, dest) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(dest);
    https.get(url, { rejectUnauthorized: false, headers: { 'User-Agent': 'Mozilla/5.0' } }, response => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(true));
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        resolve(false);
      }
    }).on('error', () => {
      fs.unlink(dest, () => {});
      resolve(false);
    });
  });
}

async function run() {
  for (const img of images) {
    const dest = path.join(MCA_IMG_DIR, img.file);
    console.log(`Downloading ${img.file}...`);
    const ok = await downloadFile(img.url, dest);
    console.log(`  -> ${ok ? 'SUCCESS' : 'FAILED'}`);
  }
}

run();
