const fs = require('fs');
const path = require('path');
const https = require('https');

const targetDir = path.resolve(__dirname, '../public/assets/events/iqac_posters');
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https:') ? https : require('http');
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(raw));
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
    if (fs.existsSync(dest) && fs.statSync(dest).size > 1000) {
      return resolve(`/assets/events/iqac_posters/${filename}`);
    }

    const file = fs.createWriteStream(dest);
    const client = url.startsWith('https:') ? https : require('http');
    client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode === 200) {
        res.pipe(file);
        file.on('finish', () => {
          file.close();
          console.log(`[DOWNLOADED] ${filename} (${fs.statSync(dest).size} bytes)`);
          resolve(`/assets/events/iqac_posters/${filename}`);
        });
      } else {
        file.close();
        if (fs.existsSync(dest)) fs.unlinkSync(dest);
        console.log(`[FAILED ${res.statusCode}] ${url}`);
        resolve(null);
      }
    }).on('error', (err) => {
      file.close();
      if (fs.existsSync(dest)) fs.unlinkSync(dest);
      console.error(`[ERROR] ${err.message}`);
      resolve(null);
    });
  });
}

async function run() {
  console.log('Fetching official IQAC posts from WordPress REST API...');
  
  // Fetch category 5 or slug iqac, or search=iqac
  let posts = await fetchJson('https://stphilos.ac.in/wp-json/wp/v2/posts?per_page=50&search=IQAC');
  if (!posts || posts.length === 0) {
    posts = await fetchJson('https://stphilos.ac.in/wp-json/wp/v2/posts?per_page=50');
  }

  // Also fetch by specific slugs mentioned by user
  const specificSlugs = [
    'international-day-of-the-seafarer',
    'world-mosquito-day',
    'world-mosquito-day-2',
    'an-awareness-and-vigilance-programme-on',
    'national-flag-day',
    'national-flag-day-2',
    'international-olympic-day',
    'international-yoga-day-2026',
    'world-refugee-day-2',
    'world-food-safety',
    'world-green-roof-day',
    'global-running-day',
    'global-day'
  ];

  const fetchedPosts = Array.isArray(posts) ? [...posts] : [];

  for (const slug of specificSlugs) {
    if (!fetchedPosts.some(p => p.slug === slug)) {
      const pData = await fetchJson(`https://stphilos.ac.in/wp-json/wp/v2/posts?slug=${slug}`);
      if (pData && pData.length > 0) {
        fetchedPosts.push(pData[0]);
      }
    }
  }

  console.log(`Total posts retrieved: ${fetchedPosts.length}`);

  const processedEvents = [];

  for (let i = 0; i < fetchedPosts.length; i++) {
    const p = fetchedPosts[i];
    const title = p.title?.rendered ? p.title.rendered.replace(/&#8211;/g, '-').replace(/&#8217;/g, "'").replace(/&amp;/g, '&') : 'IQAC Event';
    const slug = p.slug || `iqac-event-${i+1}`;
    const dateStr = new Date(p.date || Date.now()).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
    const content = p.content?.rendered || '';

    // Extract image from content or featured media
    const imgMatches = [...content.matchAll(/src=["'](https?:\/\/[^"']+\.(?:jpe?g|png|webp))["']/gi)];
    let posterUrl = null;
    let localPosterPath = null;

    if (imgMatches.length > 0) {
      posterUrl = imgMatches[0][1];
      const filename = `${slug}_poster${path.extname(posterUrl.split('?')[0]) || '.jpg'}`;
      localPosterPath = await downloadImage(posterUrl, filename);
    }

    // Extract clean text
    const cleanText = content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

    processedEvents.push({
      id: slug,
      slug: slug,
      title: title,
      date: dateStr,
      author: "Mirium",
      tags: ["EVENTS", "FLASH NEWS", "IQAC"],
      posterUrl: localPosterPath || posterUrl || "/assets/college-crest-gold.png",
      content: content,
      description: cleanText || `Official observance and institutional quality documentation on ${title} organized under the Internal Quality Assurance Cell (IQAC).`,
      officialUrl: `https://stphilos.ac.in/${slug}/`
    });
  }

  // Save to iqacEvents.json
  const outPath = path.resolve(__dirname, '../src/data/iqacEvents.json');
  fs.writeFileSync(outPath, JSON.stringify(processedEvents, null, 2), 'utf8');
  console.log(`Successfully migrated ${processedEvents.length} full IQAC event posters to ${outPath}`);
}

run();
