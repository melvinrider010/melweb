const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.resolve(__dirname, '../public/assets/events/iqac_posters');

function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    const file = fs.createWriteStream(destPath);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[DOWNLOADED] ${path.basename(destPath)} (${fs.statSync(destPath).size} bytes)`);
          resolve(true);
        });
      } else {
        file.close();
        if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
        console.error(`Failed ${res.statusCode} for ${url}`);
        resolve(false);
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(destPath)) fs.unlinkSync(destPath);
      resolve(false);
    });
  });
}

function fetchPage(slug) {
  return new Promise((resolve) => {
    https.get(`https://stphilos.ac.in/${slug}/`, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        const matches = [...raw.matchAll(/src=["'](https?:\/\/[^"']+\.(?:jpe?g|png|webp))["']/gi)];
        const imgUrls = matches.map(m => m[1]).filter(u => u.includes('uploads') && !u.includes('logo') && !u.includes('crest'));
        console.log(`Images for ${slug}:`, imgUrls);
        resolve({ slug, imgUrls, raw });
      });
    }).on('error', () => resolve({ slug, imgUrls: [] }));
  });
}

async function run() {
  const p1 = await fetchPage('international-day-of-the-seafarer');
  const p2 = await fetchPage('world-mosquito-day');
  const p3 = await fetchPage('an-awareness-and-vigilance-programme-on');
  const p4 = await fetchPage('international-olympic-day');
  const p5 = await fetchPage('national-flag-day');

  const events = JSON.parse(fs.readFileSync('src/data/iqacEvents.json', 'utf8'));

  const pages = [p1, p2, p3, p4, p5];
  for (const p of pages) {
    if (p.imgUrls.length > 0) {
      const bestUrl = p.imgUrls[0];
      const filename = `${p.slug}_poster${path.extname(bestUrl.split('?')[0]) || '.jpg'}`;
      const dest = path.join(targetDir, filename);
      await downloadFile(bestUrl, dest);

      // update event in iqacEvents
      const ev = events.find(x => x.slug === p.slug || x.id === p.slug);
      if (ev) {
        ev.posterUrl = `/assets/events/iqac_posters/${filename}`;
        console.log(`Updated ${p.slug} poster to /assets/events/iqac_posters/${filename}`);
      }
    }
  }

  fs.writeFileSync('src/data/iqacEvents.json', JSON.stringify(events, null, 2), 'utf8');
  console.log('Saved updated events to src/data/iqacEvents.json');
}

run();
