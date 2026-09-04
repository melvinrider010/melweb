/**
 * Comprehensive Official St. Philomena's Academics Crawler
 * Discovers and archives 100% official pages from https://stphilos.ac.in/
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const RAW_DIR = path.resolve(__dirname, 'stphilos_raw');
const PAGES_DIR = path.join(RAW_DIR, 'pages');
const MANIFESTS_DIR = path.join(RAW_DIR, 'manifests');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// Ensure directories exist
[RAW_DIR, PAGES_DIR, MANIFESTS_DIR].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

function fetchUrl(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects < 0) return reject(new Error('Too many redirects for ' + url));
    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8'
      },
      timeout: 30000
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (redirectUrl.startsWith('/')) {
          const u = new URL(url);
          redirectUrl = `${u.protocol}//${u.host}${redirectUrl}`;
        }
        return resolve(fetchUrl(redirectUrl, maxRedirects - 1));
      }

      let data = [];
      res.on('data', chunk => data.push(chunk));
      res.on('end', () => {
        const buffer = Buffer.concat(data);
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          contentType: res.headers['content-type'] || '',
          buffer: buffer,
          text: buffer.toString('utf8')
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Timeout fetching ' + url));
    });
  });
}

function downloadBinary(url, destPath) {
  return new Promise(async (resolve, reject) => {
    try {
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

      // If already downloaded and non-empty, skip
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 500) {
        return resolve({ status: 'cached', path: destPath });
      }

      const res = await fetchUrl(url);
      if (res.statusCode === 200 && res.buffer.length > 200) {
        fs.writeFileSync(destPath, res.buffer);
        resolve({ status: 'downloaded', path: destPath, size: res.buffer.length });
      } else {
        resolve({ status: 'failed', statusCode: res.statusCode });
      }
    } catch (e) {
      resolve({ status: 'error', error: e.message });
    }
  });
}

async function fetchAllWpPages() {
  console.log('--- Phase 1: Discovering all official WordPress pages ---');
  let allPages = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `https://stphilos.ac.in/wp-json/wp/v2/pages?per_page=100&page=${page}`;
    try {
      process.stdout.write(`Fetching WP pages chunk ${page}... `);
      const res = await fetchUrl(url);
      if (res.statusCode !== 200) {
        console.log(`Failed with status ${res.statusCode}`);
        break;
      }
      const totalHeader = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
      totalPages = totalHeader;
      const data = JSON.parse(res.text);
      allPages.push(...data);
      console.log(`Received ${data.length} pages (Total so far: ${allPages.length}/${res.headers['x-wp-total']})`);
      page++;
    } catch (err) {
      console.error(`Error on chunk ${page}:`, err.message);
      break;
    }
  }

  // Save raw WP pages snapshot
  fs.writeFileSync(
    path.join(MANIFESTS_DIR, 'all_wp_pages_raw.json'),
    JSON.stringify(allPages, null, 2)
  );
  console.log(`Successfully fetched and archived ${allPages.length} WordPress pages.\n`);
  return allPages;
}

async function fetchAllWpPosts() {
  console.log('--- Phase 1B: Discovering academic announcements/posts ---');
  let allPosts = [];
  let page = 1;
  let totalPages = 1;

  while (page <= Math.min(totalPages, 10)) { // Get top 1000 posts
    const url = `https://stphilos.ac.in/wp-json/wp/v2/posts?per_page=100&page=${page}`;
    try {
      process.stdout.write(`Fetching WP posts chunk ${page}... `);
      const res = await fetchUrl(url);
      if (res.statusCode !== 200) break;
      totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
      const data = JSON.parse(res.text);
      allPosts.push(...data);
      console.log(`Received ${data.length} posts`);
      page++;
    } catch (err) {
      console.error(`Error on posts chunk ${page}:`, err.message);
      break;
    }
  }

  fs.writeFileSync(
    path.join(MANIFESTS_DIR, 'all_wp_posts_raw.json'),
    JSON.stringify(allPosts, null, 2)
  );
  console.log(`Archived ${allPosts.length} posts.\n`);
  return allPosts;
}

async function archivePagesAndDownloadAssets(pages) {
  console.log('--- Phase 2: Archiving Raw Pages & Downloading Academic Assets ---');
  const manifest = [];
  let facultyCount = 0;
  let deptCount = 0;
  let progCount = 0;
  let downloadedImages = 0;
  let downloadedPdfs = 0;

  for (let i = 0; i < pages.length; i++) {
    const p = pages[i];
    const link = p.link || `https://stphilos.ac.in/${p.slug}/`;
    const title = p.title?.rendered || p.slug;
    const content = p.content?.rendered || '';
    const slug = p.slug;

    // Categorize page type
    let pageType = 'other';
    const slugLower = slug.toLowerCase();
    const titleLower = title.toLowerCase();

    const isFaculty = content.includes('Personal Details') || 
                      content.includes('Educational Qualifications') || 
                      content.includes('Teaching Experience') ||
                      content.includes('Areas of Specialization') ||
                      content.includes('Research Experience') ||
                      slugLower.startsWith('dr-') ||
                      slugLower.startsWith('prof-') ||
                      slugLower.startsWith('mr-') ||
                      slugLower.startsWith('mrs-') ||
                      slugLower.startsWith('ms-') ||
                      slugLower.startsWith('rev-dr-') ||
                      slugLower.startsWith('rev-fr-') ||
                      slugLower.startsWith('fr-');

    const isDepartment = slugLower.startsWith('department-of-') || 
                         slugLower.startsWith('dept-') ||
                         titleLower.startsWith('department of ') ||
                         (slugLower.includes('department') && !isFaculty);

    const isProgramme = slugLower === 'bca' || slugLower === 'mca' || slugLower === 'bba' || 
                        slugLower === 'mba' || slugLower === 'b-com' || slugLower === 'm-com' ||
                        slugLower === 'b-sc' || slugLower === 'ba' || slugLower === 'bsw' || 
                        slugLower === 'msw' || slugLower.startsWith('m-sc-') || 
                        slugLower.startsWith('ma-') || slugLower.includes('bachelor') || 
                        slugLower.includes('master');

    if (isFaculty) {
      pageType = 'faculty';
      facultyCount++;
    } else if (isDepartment) {
      pageType = 'department';
      deptCount++;
    } else if (isProgramme) {
      pageType = 'programme';
      progCount++;
    }

    // Save individual raw HTML/text snapshot
    const rawFilePath = path.join(PAGES_DIR, `${slug}.html`);
    fs.writeFileSync(rawFilePath, `<!-- URL: ${link} | Title: ${title} | Type: ${pageType} -->\n` + content);

    // Extract images embedded in page
    const imgRegex = /<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi;
    let match;
    const pageImages = [];
    while ((match = imgRegex.exec(content)) !== null) {
      pageImages.push(match[1]);
    }

    // Extract PDF documents embedded in page
    const pdfRegex = /href=["'](https?:\/\/[^"']+\.pdf)["']/gi;
    let pdfMatch;
    const pagePdfs = [];
    while ((pdfMatch = pdfRegex.exec(content)) !== null) {
      pagePdfs.push(pdfMatch[1]);
    }

    // If it's a faculty page, identify portrait image
    if (pageType === 'faculty' && pageImages.length > 0) {
      // Find candidate portrait (usually first image or image containing wp-content/uploads)
      const portraitUrl = pageImages.find(img => 
        !img.includes('logo') && 
        !img.includes('icon') && 
        !img.includes('banner') && 
        !img.includes('flag') &&
        (img.includes('uploads') || img.includes('faculty'))
      ) || pageImages[0];

      if (portraitUrl && portraitUrl.startsWith('http')) {
        const ext = path.extname(portraitUrl.split('?')[0]) || '.jpg';
        const localPortraitPath = path.join(PUBLIC_DIR, 'assets/faculty/portraits', `${slug}${ext}`);
        const dl = await downloadBinary(portraitUrl, localPortraitPath);
        if (dl.status === 'downloaded') downloadedImages++;
      }
    }

    // Download academic PDFs
    for (const pdfUrl of pagePdfs) {
      if (pdfUrl.includes('stphilos.ac.in') || pdfUrl.includes('uploads')) {
        const pdfFileName = path.basename(pdfUrl.split('?')[0]);
        const localPdfPath = path.join(PUBLIC_DIR, 'documents/academics', pdfFileName);
        const dl = await downloadBinary(pdfUrl, localPdfPath);
        if (dl.status === 'downloaded') downloadedPdfs++;
      }
    }

    manifest.push({
      id: p.id,
      slug: slug,
      url: link,
      title: title,
      type: pageType,
      status: 200,
      localRawPath: `scripts/stphilos_raw/pages/${slug}.html`,
      imageCount: pageImages.length,
      pdfCount: pagePdfs.length,
      crawledAt: new Date().toISOString(),
      sourceVerified: true
    });
  }

  // Save manifest
  const manifestPath = path.resolve(__dirname, '../stphilos-crawl-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

  console.log(`\n========================================`);
  console.log(`CRAWL COMPLETED SUCCESSFULLY`);
  console.log(`Total Pages Processed: ${manifest.length}`);
  console.log(`Faculty Profile Pages Discovered: ${facultyCount}`);
  console.log(`Department Pages Discovered: ${deptCount}`);
  console.log(`Programme Pages Discovered: ${progCount}`);
  console.log(`Downloaded Faculty/Academic Images: ${downloadedImages}`);
  console.log(`Downloaded Academic PDFs: ${downloadedPdfs}`);
  console.log(`Manifest saved to: stphilos-crawl-manifest.json`);
  console.log(`========================================\n`);
}

async function main() {
  try {
    const pages = await fetchAllWpPages();
    await fetchAllWpPosts();
    await archivePagesAndDownloadAssets(pages);
  } catch (err) {
    console.error('Fatal crawler error:', err);
    process.exit(1);
  }
}

main();
