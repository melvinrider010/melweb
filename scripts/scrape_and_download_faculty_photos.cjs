const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DEPT_PAGES = [
  { dept: 'economics', url: 'https://stphilos.ac.in/economics/' },
  { dept: 'computer-science', url: 'https://stphilos.ac.in/bca/' },
  { dept: 'computer-science', url: 'https://stphilos.ac.in/department-of-computer-science/' },
  { dept: 'business-administration', url: 'https://stphilos.ac.in/bba/' },
  { dept: 'commerce', url: 'https://stphilos.ac.in/b-com/' },
  { dept: 'social-work', url: 'https://stphilos.ac.in/bsw/' },
  { dept: 'english', url: 'https://stphilos.ac.in/m-a-english/' },
  { dept: 'physics', url: 'https://stphilos.ac.in/physics/' },
  { dept: 'chemistry', url: 'https://stphilos.ac.in/chemistry/' },
  { dept: 'mathematics', url: 'https://stphilos.ac.in/mathematics/' },
  { dept: 'biotech', url: 'https://stphilos.ac.in/department-of-zoology-botany/' },
  { dept: 'journalism', url: 'https://stphilos.ac.in/journalism/' },
  { dept: 'psychology', url: 'https://stphilos.ac.in/psychology/' },
  { dept: 'criminology', url: 'https://stphilos.ac.in/department-of-criminology-and-forensic-science/' },
  { dept: 'food-science', url: 'https://stphilos.ac.in/food-science/' },
  { dept: 'kannada', url: 'https://stphilos.ac.in/department-of-hindi/' }
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
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

async function run() {
  console.log('Starting scan for authentic faculty photos from stphilos.ac.in...');
  
  for (const page of DEPT_PAGES) {
    try {
      console.log(`\nFetching ${page.dept} from ${page.url}...`);
      const html = await fetchHTML(page.url);
      
      // WordPress Team Members plugin typically stores photos in <div class="tmm_photo" style="background-image:url(...)"> or <img> tags
      // Let's regex match all tmm_member blocks or image URLs
      const memberRegex = /<div class="[^"]*tmm_member[^"]*"[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/gi;
      const bgRegex = /background-image:\s*url\((?:'|")?([^'")]+)(?:'|")?\)/gi;
      const imgRegex = /<img[^>]+src=["']([^"']+\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi;
      
      // Find all team member matches
      const tmmMatches = html.match(/tmm_photo[\s\S]*?tmm_text/gi) || [];
      console.log(`Found ${tmmMatches.length} raw team member snippets in ${page.dept}`);

      // Let's also look for all wp-content/uploads images in the page
      const uploadImages = [...html.matchAll(/https:\/\/stphilos\.ac\.in\/wp-content\/uploads\/[^\s"'<>]+\.(?:jpg|jpeg|png)/gi)].map(m => m[0]);
      console.log(`Found ${uploadImages.length} uploaded images on page`);
      
      // Let's extract names and photos
      const namePhotoRegex = /<div class="tmm_names">[\s\S]*?<div class="tmm_fname">([^<]+)<\/div>[\s\S]*?<div class="tmm_lname">([^<]+)<\/div>[\s\S]*?(?:background-image:\s*url\(['"]?([^'"]+)['"]?\)|src=['"]([^'"]+)['"])/gi;
      
      let match;
      let count = 0;
      while ((match = namePhotoRegex.exec(html)) !== null) {
        const fname = match[1].trim();
        const lname = match[2].trim();
        const photoUrl = match[3] || match[4];
        const fullName = `${fname} ${lname}`.trim();
        const slug = fullName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
        
        if (photoUrl && !photoUrl.includes('placeholder') && !photoUrl.includes('website.png')) {
          const destDir = path.join('public', 'assets', 'faculty', page.dept);
          if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
          
          const destFile = path.join(destDir, `${slug}.jpg`);
          console.log(`  Downloading photo for [${fullName}] -> ${destFile} from ${photoUrl}`);
          try {
            await downloadImage(photoUrl, destFile);
            count++;
          } catch (e) {
            console.error(`  Failed to download ${photoUrl}: ${e.message}`);
          }
        }
      }
      
      if (count === 0 && uploadImages.length > 0) {
        console.log(`  Sample uploaded image URLs for ${page.dept}:`);
        uploadImages.slice(0, 5).forEach(u => console.log('    ' + u));
      }
      
    } catch (err) {
      console.error(`Error processing ${page.url}: ${err.message}`);
    }
  }
  
  console.log('\nScan completed.');
}

run();
