const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DEPARTMENTS_URLS = [
  { dept: 'economics', url: 'https://stphilos.ac.in/economics/' },
  { dept: 'computer-science', url: 'https://stphilos.ac.in/bca/' },
  { dept: 'computer-science', url: 'https://stphilos.ac.in/department-of-computer-science/' },
  { dept: 'business-administration', url: 'https://stphilos.ac.in/bba/' },
  { dept: 'business-administration', url: 'https://stphilos.ac.in/department-of-bba-tourism-and-hospitality/' },
  { dept: 'commerce', url: 'https://stphilos.ac.in/b-com/' },
  { dept: 'commerce', url: 'https://stphilos.ac.in/department-of-commerce/' },
  { dept: 'commerce', url: 'https://stphilos.ac.in/m-com/' },
  { dept: 'social-work', url: 'https://stphilos.ac.in/bsw/' },
  { dept: 'social-work', url: 'https://stphilos.ac.in/m-s-w/' },
  { dept: 'english', url: 'https://stphilos.ac.in/department-of-english/' },
  { dept: 'english', url: 'https://stphilos.ac.in/m-a-english/' },
  { dept: 'physics', url: 'https://stphilos.ac.in/physics/' },
  { dept: 'physics', url: 'https://stphilos.ac.in/m-sc-physics/' },
  { dept: 'chemistry', url: 'https://stphilos.ac.in/chemistry/' },
  { dept: 'chemistry', url: 'https://stphilos.ac.in/m-sc-chemistry/' },
  { dept: 'mathematics', url: 'https://stphilos.ac.in/mathematics/' },
  { dept: 'mathematics', url: 'https://stphilos.ac.in/m-sc-mathematics/' },
  { dept: 'biotech', url: 'https://stphilos.ac.in/biotechnology/' },
  { dept: 'biotech', url: 'https://stphilos.ac.in/biochemistry/' },
  { dept: 'biotech', url: 'https://stphilos.ac.in/m-sc-biochemistry/' },
  { dept: 'biotech', url: 'https://stphilos.ac.in/department-of-zoology-botany/' },
  { dept: 'journalism', url: 'https://stphilos.ac.in/journalism/' },
  { dept: 'journalism', url: 'https://stphilos.ac.in/m-a-journalism-and-mass-communication/' },
  { dept: 'psychology', url: 'https://stphilos.ac.in/psychology/' },
  { dept: 'psychology', url: 'https://stphilos.ac.in/m-sc-psychology/' },
  { dept: 'criminology', url: 'https://stphilos.ac.in/department-of-criminology-and-forensic-science/' },
  { dept: 'criminology', url: 'https://stphilos.ac.in/m-sc-criminology-and-forensic-science/' },
  { dept: 'food-science', url: 'https://stphilos.ac.in/food-science/' },
  { dept: 'food-science', url: 'https://stphilos.ac.in/m-sc-food-science-and-nutrition/' },
  { dept: 'kannada', url: 'https://stphilos.ac.in/department-of-kannada/' },
  { dept: 'kannada', url: 'https://stphilos.ac.in/department-of-hindi/' },
  { dept: 'humanities', url: 'https://stphilos.ac.in/history-2/' },
  { dept: 'humanities', url: 'https://stphilos.ac.in/sociology/' },
  { dept: 'humanities', url: 'https://stphilos.ac.in/political-science/' }
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
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

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/^(dr\.|prof\.|mr\.|mrs\.|ms\.|rev\.|fr\.)\s*/i, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function run() {
  console.log('=== STARTING COMPLETE AUDIT & DOWNLOAD OF AUTHENTIC FACULTY PHOTOS ===');
  
  const facultyManifest = [];
  const visitedUrls = new Set();
  
  for (const item of DEPARTMENTS_URLS) {
    if (visitedUrls.has(item.url)) continue;
    visitedUrls.add(item.url);
    
    console.log(`\nInspecting [${item.dept}] -> ${item.url}`);
    try {
      const html = await fetchHTML(item.url);
      
      // Match each tmm_member block
      // <div class="tmm_member" ...> ... <div class="tmm_photo ... data-back="URL" ...> ... <div class="tmm_names"><span class="tmm_fname">First</span> <span class="tmm_lname">Last</span></div>
      const memberBlockRegex = /<div class="tmm_member"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi;
      const blocks = html.match(memberBlockRegex) || [];
      
      console.log(`  Found ${blocks.length} faculty member blocks on page.`);
      
      const destDir = path.join('public', 'assets', 'faculty', item.dept);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
      
      for (const block of blocks) {
        // Extract photo URL (either data-back, data-src, or src)
        const photoMatch = block.match(/data-back=["']([^"']+)["']/) || 
                           block.match(/style=["'][^"']*background-image:\s*url\(['"]?([^'"]+)['"]?\)/i) ||
                           block.match(/<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp))["']/i);
                           
        // Extract names
        const fnameMatch = block.match(/<span class="tmm_fname">([\s\S]*?)<\/span>/i);
        const lnameMatch = block.match(/<span class="tmm_lname">([\s\S]*?)<\/span>/i);
        const jobMatch = block.match(/<div class="tmm_job">([\s\S]*?)<\/div>/i);
        const linkMatch = block.match(/href=["'](https:\/\/stphilos\.ac\.in\/[^"']+)["']/i);
        
        let fname = fnameMatch ? fnameMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        let lname = lnameMatch ? lnameMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        let job = jobMatch ? jobMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        let profileUrl = linkMatch ? linkMatch[1] : '';
        
        let fullName = `${fname} ${lname}`.trim();
        if (!fullName) continue;
        
        let photoUrl = photoMatch ? photoMatch[1].trim() : null;
        
        if (photoUrl && (photoUrl.includes('website.png') || photoUrl.includes('default') || photoUrl.startsWith('data:'))) {
          photoUrl = null;
        }
        
        const slug = slugify(fullName);
        const ext = photoUrl && photoUrl.includes('.png') ? '.png' : '.jpg';
        const localFileName = `${slug}${ext}`;
        const localFilePath = path.join(destDir, localFileName);
        const publicPath = `/assets/faculty/${item.dept}/${localFileName}`;
        
        if (photoUrl) {
          console.log(`    Downloading photo for [${fullName}] (${job})`);
          console.log(`      Source: ${photoUrl}`);
          console.log(`      Local : ${localFilePath}`);
          try {
            await downloadImage(photoUrl, localFilePath);
            // Also copy as .jpg if it was .png or vice versa so both extensions resolve
            const altExt = ext === '.png' ? '.jpg' : '.png';
            fs.copyFileSync(localFilePath, path.join(destDir, `${slug}${altExt}`));
          } catch (e) {
            console.error(`      Download failed: ${e.message}`);
          }
        }
        
        facultyManifest.push({
          slug,
          name: fullName,
          designation: job,
          dept: item.dept,
          image: publicPath,
          sourcePhotoUrl: photoUrl,
          profileUrl
        });
      }
      
    } catch (e) {
      console.error(`  Error fetching ${item.url}: ${e.message}`);
    }
  }
  
  // Save manifest
  fs.writeFileSync('scripts/faculty_manifest.json', JSON.stringify(facultyManifest, null, 2), 'utf8');
  console.log(`\n=== DOWNLOAD COMPLETE. Total faculty recorded: ${facultyManifest.length} ===`);
}

run();
