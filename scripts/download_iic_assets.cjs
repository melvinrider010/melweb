const fs = require('fs');
const https = require('https');
const path = require('path');

const docsDir = path.join(__dirname, '../public/assets/documents/iic');
const imgDir = path.join(__dirname, '../public/assets/images/iic');

if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });

const downloads = [
  { url: 'https://stphilos.ac.in/wp-content/uploads/2025/08/Institution-Innovation-Council-IIC-2025-26-1.pdf', dest: path.join(docsDir, 'Institution-Innovation-Council-IIC-2025-26.pdf') },
  { url: 'https://stphilos.ac.in/wp-content/uploads/2024/05/EstablismentCertificate.pdf', dest: path.join(docsDir, 'IIC-EstablismentCertificate.pdf') },
  { url: 'https://stphilos.ac.in/wp-content/uploads/2025/01/divya.jpg', dest: path.join(imgDir, 'dr-divyashree-iic-convenor.jpg') },
  { url: 'https://stphilos.ac.in/wp-content/uploads/2023/08/IMG_20230721_151151-scaled.jpg', dest: path.join(imgDir, 'iic-inauguration-event.jpg') }
];

downloads.forEach(item => {
  const file = fs.createWriteStream(item.dest);
  https.get(item.url, res => {
    if (res.statusCode === 200) {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded ${path.basename(item.dest)} (${fs.statSync(item.dest).size} bytes)`);
      });
    } else {
      console.error(`Failed ${item.url} -> ${res.statusCode}`);
    }
  }).on('error', err => console.error(err.message));
});
