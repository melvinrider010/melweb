const fs = require('fs');
const https = require('https');
const path = require('path');

const raw = JSON.parse(fs.readFileSync('src/data/academics_curriculum_raw.json', 'utf8'));
const targetDir = path.join(__dirname, '../public/assets/documents/academics');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Collect unique file URLs
const urlMap = new Map();

Object.keys(raw).forEach(category => {
  const list = raw[category].links || [];
  list.forEach(item => {
    let url = item.href;
    if (url && (url.endsWith('.pdf') || url.endsWith('.docx') || url.endsWith('.doc'))) {
      const filename = path.basename(url.split('?')[0]);
      if (!urlMap.has(filename)) {
        urlMap.set(filename, { category, title: item.text, url });
      }
    }
  });
});

console.log(`Found ${urlMap.size} academic documents to download.`);

const downloadPromises = Array.from(urlMap.entries()).map(([filename, info]) => {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      console.log(`[EXISTS] ${filename}`);
      return resolve({ filename, ...info, localPath: `/assets/documents/academics/${filename}`, status: 'cached' });
    }

    const file = fs.createWriteStream(dest);
    https.get(info.url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[DOWNLOADED] ${filename} (${fs.statSync(dest).size} bytes)`);
          resolve({ filename, ...info, localPath: `/assets/documents/academics/${filename}`, status: 'downloaded' });
        });
      } else {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        console.warn(`[FAILED ${response.statusCode}] ${filename}`);
        resolve({ filename, ...info, localPath: info.url, status: 'remote_fallback' });
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.error(`[ERROR] ${filename}: ${err.message}`);
      resolve({ filename, ...info, localPath: info.url, status: 'error' });
    });
  });
});

Promise.all(downloadPromises).then((results) => {
  fs.writeFileSync('src/data/academics_downloaded_catalog.json', JSON.stringify(results, null, 2));
  console.log('Finished downloading academic documents!');
});
