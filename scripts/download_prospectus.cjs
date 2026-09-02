const fs = require('fs');
const https = require('https');
const path = require('path');

const targetDir = path.join(__dirname, '../public/assets/documents/admission');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const url = 'https://stphilos.ac.in/wp-content/uploads/2025/04/Final-Copy-of-College-Prospectus.pdf';
const dest = path.join(targetDir, 'Final-Copy-of-College-Prospectus.pdf');
const file = fs.createWriteStream(dest);

https.get(url, (res) => {
  if (res.statusCode === 200) {
    res.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Downloaded official college prospectus (${fs.statSync(dest).size} bytes) to ${dest}`);
    });
  } else {
    console.error('Failed to download prospectus:', res.statusCode);
  }
}).on('error', (err) => {
  console.error('Error downloading prospectus:', err.message);
});
