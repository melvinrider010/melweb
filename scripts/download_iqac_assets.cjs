const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.resolve(__dirname, '../public/documents/academics');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const docs = [
  'https://stphilos.ac.in/wp-content/uploads/2019/02/Naac-Certificate.pdf',
  'https://stphilos.ac.in/wp-content/uploads/2018/04/NAAC-2014-certificate.pdf',
  'https://stphilos.ac.in/wp-content/uploads/2022/01/2019-20.pdf',
  'https://stphilos.ac.in/wp-content/uploads/2022/01/2018-2019.pdf',
  'https://stphilos.ac.in/wp-content/uploads/2024/10/Final-IQAC-Report.pdf',
  'https://stphilos.ac.in/wp-content/uploads/2024/08/Roadmap2023-2024.pdf'
];

function downloadDoc(url) {
  return new Promise((resolve) => {
    const filename = path.basename(url);
    const dest = path.join(targetDir, filename);

    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[EXISTS] ${filename}`);
      return resolve(true);
    }

    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[DOWNLOADED] ${filename} (${fs.statSync(dest).size} bytes)`);
          resolve(true);
        });
      } else {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        console.error(`[FAILED ${res.statusCode}] ${url}`);
        resolve(false);
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.error(`[ERROR] ${err.message}`);
      resolve(false);
    });
  });
}

async function run() {
  for (const url of docs) {
    await downloadDoc(url);
  }
  console.log('All official IQAC documents cached locally.');
}

run();
