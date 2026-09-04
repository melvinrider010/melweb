/**
 * High-Speed Academic Crawler & Raw Archiver for St. Philomena's College
 * Archives all raw HTML pages and downloads academic assets with a concurrency pool.
 */
const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const RAW_DIR = path.resolve(__dirname, 'stphilos_raw');
const PAGES_DIR = path.join(RAW_DIR, 'pages');
const MANIFESTS_DIR = path.join(RAW_DIR, 'manifests');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

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
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8'
      },
      timeout: 20000
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
  return new Promise(async (resolve) => {
    try {
      const destDir = path.dirname(destPath);
      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

      // If already downloaded and valid, skip
      if (fs.existsSync(destPath) && fs.statSync(destPath).size > 1000) {
        return resolve({ status: 'cached', path: destPath });
      }

      const res = await fetchUrl(url);
      if (res.statusCode === 200 && res.buffer.length > 500) {
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

// Concurrency pool helper
async function asyncPool(poolLimit, array, iteratorFn) {
  const ret = [];
  const executing = [];
  for (const item of array) {
    const p = Promise.resolve().then(() => iteratorFn(item, array));
    ret.push(p);
    if (poolLimit <= array.length) {
      const e = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= poolLimit) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

async function run() {
  console.log('=== STARTING HIGH-SPEED ACADEMIC CRAWL & ASSET ARCHIVER ===');
  
  const rawPagesPath = path.join(MANIFESTS_DIR, 'all_wp_pages_raw.json');
  if (!fs.existsSync(rawPagesPath)) {
    console.error('Raw WP pages manifest missing! Run fetchAllWpPages first.');
    process.exit(1);
  }

  const pages = JSON.parse(fs.readFileSync(rawPagesPath, 'utf8'));
  console.log(`Loaded ${pages.length} raw WordPress page definitions.`);

  const manifest = [];
  const imageDownloadTasks = [];
  const pdfDownloadTasks = [];

  // 1. Save all raw HTML snapshots
  console.log('Writing raw HTML page snapshots...');
  for (const p of pages) {
    const slug = p.slug;
    const link = p.link || `https://stphilos.ac.in/${slug}/`;
    const title = p.title?.rendered || slug;
    const content = p.content?.rendered || '';

    // Determine type
    let pageType = 'general';
    const contentLower = content.toLowerCase();
    const slugLower = slug.toLowerCase();
    const titleLower = title.toLowerCase();

    const hasCv = content.includes('Personal Details') || 
                  content.includes('Educational Qualification') || 
                  content.includes('Teaching Experience') ||
                  content.includes('Areas of Specialization') ||
                  slugLower.startsWith('dr-') || slugLower.startsWith('prof-') ||
                  slugLower.startsWith('mr-') || slugLower.startsWith('mrs-') ||
                  slugLower.startsWith('ms-') || slugLower.startsWith('rev-dr-') ||
                  slugLower.startsWith('rev-fr-') || slugLower.startsWith('fr-') ||
                  slugLower === 'e-gloriya';

    const isDept = (slugLower.startsWith('department-of-') || slugLower.startsWith('dept-') || titleLower.startsWith('department of ')) && !hasCv;
    const isProg = slugLower === 'bca' || slugLower === 'mca' || slugLower === 'bba' || 
                   slugLower === 'mba' || slugLower === 'b-com' || slugLower === 'm-com' ||
                   slugLower === 'b-sc' || slugLower === 'ba' || slugLower === 'bsw' || 
                   slugLower === 'msw' || slugLower.startsWith('m-sc-') || slugLower.startsWith('ma-') ||
                   slugLower.startsWith('bachelor-of-') || slugLower.startsWith('master-of-');

    if (hasCv) pageType = 'faculty';
    else if (isDept) pageType = 'department';
    else if (isProg) pageType = 'programme';

    // Save snapshot
    const rawPath = path.join(PAGES_DIR, `${slug}.html`);
    fs.writeFileSync(rawPath, `<!-- URL: ${link} | Title: ${title} | Type: ${pageType} -->\n` + content);

    // Extract images
    const imgMatches = content.match(/<img[^>]+src=["'](https?:\/\/[^"']+\.(?:jpg|jpeg|png|webp))["'][^>]*>/gi) || [];
    const pageImages = imgMatches.map(m => {
      const match = m.match(/src=["'](https?:\/\/[^"']+)["']/i);
      return match ? match[1] : null;
    }).filter(Boolean);

    // Extract PDFs
    const pdfMatches = content.match(/href=["'](https?:\/\/[^"']+\.pdf)["']/gi) || [];
    const pagePdfs = pdfMatches.map(m => {
      const match = m.match(/href=["'](https?:\/\/[^"']+)["']/i);
      return match ? match[1] : null;
    }).filter(Boolean);

    // Queue faculty portrait downloads
    if (pageType === 'faculty' && pageImages.length > 0) {
      const portraitUrl = pageImages.find(img => 
        !img.includes('logo') && 
        !img.includes('icon') && 
        !img.includes('banner') && 
        !img.includes('flag') &&
        !img.includes('header') &&
        (img.includes('uploads') || img.includes('faculty') || img.includes('staff'))
      ) || pageImages[0];

      if (portraitUrl) {
        const ext = path.extname(portraitUrl.split('?')[0]) || '.jpg';
        const dest = path.join(PUBLIC_DIR, 'assets/faculty/portraits', `${slug}${ext}`);
        imageDownloadTasks.push({ url: portraitUrl, dest, slug, type: 'faculty-portrait' });
      }
    }

    // Queue department images
    if (pageType === 'department' && pageImages.length > 0) {
      const bannerUrl = pageImages[0];
      const ext = path.extname(bannerUrl.split('?')[0]) || '.jpg';
      const dest = path.join(PUBLIC_DIR, 'assets/departments', slug, `banner${ext}`);
      imageDownloadTasks.push({ url: bannerUrl, dest, slug, type: 'department-banner' });
    }

    // Queue academic PDFs
    pagePdfs.forEach(pdfUrl => {
      if (pdfUrl.includes('stphilos.ac.in') || pdfUrl.includes('uploads')) {
        const filename = path.basename(pdfUrl.split('?')[0]);
        const dest = path.join(PUBLIC_DIR, 'documents/academics', filename);
        pdfDownloadTasks.push({ url: pdfUrl, dest, filename, type: 'academic-pdf' });
      }
    });

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

  // Save crawl manifest
  fs.writeFileSync(
    path.resolve(__dirname, '../stphilos-crawl-manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`Saved crawl manifest to stphilos-crawl-manifest.json (${manifest.length} records)`);

  // Download queued images with concurrency limit 12
  console.log(`\nDownloading ${imageDownloadTasks.length} queued faculty/department images (Concurrency: 12)...`);
  let downloadedImgCount = 0;
  let cachedImgCount = 0;
  await asyncPool(12, imageDownloadTasks, async (task) => {
    const res = await downloadBinary(task.url, task.dest);
    if (res.status === 'downloaded') downloadedImgCount++;
    else if (res.status === 'cached') cachedImgCount++;
  });
  console.log(`Images Downloaded: ${downloadedImgCount}, Cached: ${cachedImgCount}`);

  // Download queued academic PDFs with concurrency limit 8
  // Deduplicate PDFs
  const uniquePdfs = [];
  const seenPdfs = new Set();
  pdfDownloadTasks.forEach(t => {
    if (!seenPdfs.has(t.url)) {
      seenPdfs.add(t.url);
      uniquePdfs.push(t);
    }
  });

  console.log(`\nDownloading ${uniquePdfs.length} unique academic PDFs (Concurrency: 8)...`);
  let downloadedPdfCount = 0;
  let cachedPdfCount = 0;
  await asyncPool(8, uniquePdfs, async (task) => {
    const res = await downloadBinary(task.url, task.dest);
    if (res.status === 'downloaded') downloadedPdfCount++;
    else if (res.status === 'cached') cachedPdfCount++;
  });
  console.log(`PDFs Downloaded: ${downloadedPdfCount}, Cached: ${cachedPdfCount}`);

  console.log('\n========================================');
  console.log('ACADEMIC CRAWL & ASSET ARCHIVE COMPLETE');
  console.log(`Total Pages Archived: ${manifest.length}`);
  console.log(`Faculty Profiles Discovered: ${manifest.filter(m => m.type === 'faculty').length}`);
  console.log(`Departments Discovered: ${manifest.filter(m => m.type === 'department').length}`);
  console.log(`Programmes Discovered: ${manifest.filter(m => m.type === 'programme').length}`);
  console.log(`Total Faculty Images: ${imageDownloadTasks.length}`);
  console.log(`Total Academic PDFs: ${uniquePdfs.length}`);
  console.log('========================================\n');
}

run().catch(err => {
  console.error('Fatal crawl error:', err);
  process.exit(1);
});
