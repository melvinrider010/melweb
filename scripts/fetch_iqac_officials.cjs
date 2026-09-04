const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.resolve(__dirname, '../public/assets/faculty/iqac');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function fetchPage(slug) {
  return new Promise((resolve) => {
    https.get('https://stphilos.ac.in/wp-json/wp/v2/pages?slug=' + slug, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          const data = JSON.parse(raw);
          if (data && data.length > 0) {
            console.log(`Fetched page: ${slug}`);
            fs.writeFileSync(`scripts/stphilos_raw/pages/${slug}.json`, JSON.stringify(data[0], null, 2));
            resolve(data[0]);
          } else {
            console.log(`No page found for slug: ${slug}`);
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    }).on('error', () => resolve(null));
  });
}

function downloadImage(url, filename) {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, filename);
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`Downloaded image: ${filename}`);
          resolve(`/assets/faculty/iqac/${filename}`);
        });
      } else {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        resolve(null);
      }
    }).on('error', () => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      resolve(null);
    });
  });
}

async function run() {
  const p1 = await fetchPage('gunasheelandetails');
  const p2 = await fetchPage('deepa-v');

  // Let's inspect iqac.json for the 3 team member cards and their photos
  const iqacRaw = JSON.parse(fs.readFileSync('scripts/stphilos_raw/pages/iqac.json', 'utf8'));
  const html = iqacRaw.content.rendered;

  const matches = [...html.matchAll(/<div class="tmm_member"[\s\S]*?<img[^>]+src="([^">]+)"[\s\S]*?<div class="tmm_names">([\s\S]*?)<\/div>[\s\S]*?<div class="tmm_job">([\s\S]*?)<\/div>/gi)];
  console.log('IQAC Team cards found in iqac.json:', matches.length);

  const team = [];
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i];
    const photoUrl = m[1];
    const name = m[2].replace(/<[^>]+>/g, '').trim();
    const role = m[3].replace(/<[^>]+>/g, '').trim();
    console.log(`- ${name} (${role}): ${photoUrl}`);

    const ext = path.extname(photoUrl.split('?')[0]) || '.jpg';
    const filename = `${name.toLowerCase().replace(/[^a-z0-9]/g, '_')}${ext}`;
    const localPath = await downloadImage(photoUrl, filename);

    team.push({
      name,
      role,
      photoUrl: localPath || `/assets/faculty/iqac/${filename}`,
      originalPhotoUrl: photoUrl
    });
  }

  fs.writeFileSync('scripts/iqac_officials.json', JSON.stringify(team, null, 2));
  console.log('Saved team to scripts/iqac_officials.json');
}

run();
