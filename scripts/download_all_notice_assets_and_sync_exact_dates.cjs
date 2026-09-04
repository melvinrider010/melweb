const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'media.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'categories.json'), 'utf8'));

const categoryMap = new Map(categories.map(c => [c.id, c.name]));
const mediaById = new Map(media.map(m => [m.id, m]));

console.log(`Loaded ${posts.length} posts, ${media.length} media items.`);

// Download with quick timeout
function downloadFile(url, destPath) {
  return new Promise((resolve) => {
    const dir = path.dirname(destPath);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    if (fs.existsSync(destPath) && fs.statSync(destPath).size > 0) {
      return resolve({ url, destPath, status: 'already_exists', size: fs.statSync(destPath).size });
    }

    const client = url.startsWith('https') ? https : http;
    const req = client.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadFile(res.headers.location, destPath).then(resolve);
      }
      if (res.statusCode !== 200) {
        return resolve({ url, destPath, status: 'error', error: `HTTP ${res.statusCode}` });
      }

      const fileStream = fs.createWriteStream(destPath);
      res.pipe(fileStream);
      fileStream.on('finish', () => {
        fileStream.close(() => {
          resolve({ url, destPath, status: 'downloaded', size: fs.existsSync(destPath) ? fs.statSync(destPath).size : 0 });
        });
      });
      fileStream.on('error', (err) => {
        fs.unlink(destPath, () => {});
        resolve({ url, destPath, status: 'error', error: err.message });
      });
    });

    req.on('error', (err) => {
      fs.unlink(destPath, () => {});
      resolve({ url, destPath, status: 'error', error: err.message });
    });

    req.setTimeout(8000, () => {
      req.destroy();
      fs.unlink(destPath, () => {});
      resolve({ url, destPath, status: 'error', error: 'timeout' });
    });
  });
}

// Concurrent Pool Helper
async function mapConcurrent(items, limit, fn) {
  const results = [];
  let index = 0;
  async function worker() {
    while (index < items.length) {
      const i = index++;
      results[i] = await fn(items[i], i);
    }
  }
  const workers = Array(Math.min(limit, items.length)).fill(0).map(worker);
  await Promise.all(workers);
  return results;
}

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

async function run() {
  console.log('=== EXTRACTING ASSETS & DOWNLOAD URLs FROM ALL 2,252 POSTS ===');

  // Collect all unique URLs to download
  const downloadsQueue = [];
  const urlToLocalMap = new Map();

  for (const post of posts) {
    const postYear = post.date ? post.date.substring(0, 4) : '2026';
    const content = post.content?.rendered || '';

    // 1. PDF links
    const pdfRegex = /href="([^"]+\.pdf[^"]*)"/gi;
    let pMatch;
    while ((pMatch = pdfRegex.exec(content)) !== null) {
      let rawUrl = pMatch[1].split('?')[0];
      if (!rawUrl.startsWith('http')) {
        rawUrl = `https://stphilos.ac.in${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
      }
      const filename = path.basename(rawUrl);
      const localRel = `/assets/documents/notices/${postYear}/${filename}`;
      const localAbs = path.join(ROOT_DIR, 'public', localRel.substring(1));
      urlToLocalMap.set(rawUrl, localRel);
      downloadsQueue.push({ url: rawUrl, dest: localAbs, type: 'pdf' });
    }

    // 2. Image links
    const imgRegex = /src="([^"]+\.(?:jpg|jpeg|png|webp|gif)[^"]*)"/gi;
    let iMatch;
    while ((iMatch = imgRegex.exec(content)) !== null) {
      let rawUrl = iMatch[1].split('?')[0];
      if (!rawUrl.startsWith('http')) {
        rawUrl = `https://stphilos.ac.in${rawUrl.startsWith('/') ? '' : '/'}${rawUrl}`;
      }
      const filename = path.basename(rawUrl);
      const localRel = `/media/notices/${postYear}/${filename}`;
      const localAbs = path.join(ROOT_DIR, 'public', localRel.substring(1));
      urlToLocalMap.set(rawUrl, localRel);
      downloadsQueue.push({ url: rawUrl, dest: localAbs, type: 'image' });
    }

    // 3. Featured Media
    if (post.featured_media && mediaById.has(post.featured_media)) {
      const fm = mediaById.get(post.featured_media);
      const rawUrl = fm.source_url;
      if (rawUrl) {
        const filename = path.basename(rawUrl).split('?')[0];
        const localRel = `/media/notices/${postYear}/${filename}`;
        const localAbs = path.join(ROOT_DIR, 'public', localRel.substring(1));
        urlToLocalMap.set(rawUrl, localRel);
        downloadsQueue.push({ url: rawUrl, dest: localAbs, type: 'image' });
      }
    }
  }

  // Deduplicate downloads by URL
  const uniqueDownloads = Array.from(
    new Map(downloadsQueue.map(item => [item.url, item])).values()
  );

  console.log(`Discovered ${uniqueDownloads.length} unique assets attached to posts to download locally.`);

  // Download all assets with 15 concurrent workers
  console.log('Downloading all notice assets locally...');
  let downloadedCount = 0;
  let alreadyExistsCount = 0;
  let errorCount = 0;

  await mapConcurrent(uniqueDownloads, 15, async (item, idx) => {
    const res = await downloadFile(item.url, item.dest);
    if (res.status === 'downloaded') downloadedCount++;
    else if (res.status === 'already_exists') alreadyExistsCount++;
    else errorCount++;

    if ((idx + 1) % 100 === 0 || idx === uniqueDownloads.length - 1) {
      console.log(`  Progress: ${idx + 1}/${uniqueDownloads.length} (New: ${downloadedCount}, Cached: ${alreadyExistsCount}, Failed: ${errorCount})`);
    }
  });

  console.log(`Downloaded ${downloadedCount} new assets, ${alreadyExistsCount} already cached, ${errorCount} failed/404.`);

  // --- BUILD NOTICES.JSON & EVENTS.JSON WITH EXACT DATES & LOCAL PATHS ---
  console.log('\n=== BUILDING NOTICES & EVENTS WITH EXACT DATES & LOCAL ASSET PATHS ===');

  const formattedNotices = [];
  const formattedEvents = [];

  for (const post of posts) {
    const rawDate = post.date ? post.date.substring(0, 10) : '2026-09-01';
    const dateObj = new Date(rawDate);
    const displayDate = !isNaN(dateObj.getTime())
      ? dateObj.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
      : rawDate;

    const title = cleanHtml(post.title?.rendered) || 'Untitled Post';
    const slug = post.slug || `post-${post.id}`;
    const contentHtml = post.content?.rendered || '';
    const plainContent = cleanHtml(contentHtml);

    const catNames = (post.categories || []).map(cid => categoryMap.get(cid)).filter(Boolean);
    const isEventCategory = catNames.some(c => /event|seminar|conference|sports|cultural|workshop|celebration|meeting|council/i.test(c));
    const isExamCategory = catNames.some(c => /exam|timetable|time table|revaluation|makeup|supplementary/i.test(c)) || /exam|timetable|revaluation|makeup/i.test(title);

    // Extract attached PDF or Image from content
    let localPdf = null;
    let localImg = null;

    const pdfMatch = contentHtml.match(/href="([^"]+\.pdf[^"]*)"/i);
    if (pdfMatch) {
      const rawPdfUrl = pdfMatch[1].split('?')[0];
      localPdf = urlToLocalMap.get(rawPdfUrl) || urlToLocalMap.get(`https://stphilos.ac.in${rawPdfUrl.startsWith('/') ? '' : '/'}${rawPdfUrl}`) || null;
    }

    const imgMatch = contentHtml.match(/src="([^"]+\.(?:jpg|jpeg|png|webp|gif)[^"]*)"/i);
    if (imgMatch) {
      const rawImgUrl = imgMatch[1].split('?')[0];
      localImg = urlToLocalMap.get(rawImgUrl) || urlToLocalMap.get(`https://stphilos.ac.in${rawImgUrl.startsWith('/') ? '' : '/'}${rawImgUrl}`) || null;
    }

    if (!localImg && post.featured_media && mediaById.has(post.featured_media)) {
      const fm = mediaById.get(post.featured_media);
      if (fm?.source_url) {
        localImg = urlToLocalMap.get(fm.source_url) || null;
      }
    }

    // Determine tags
    const tagsArr = [];
    if (isEventCategory) tagsArr.push('EVENT');
    if (isExamCategory) tagsArr.push('EXAMINATIONS');
    if (catNames.some(c => /circular/i.test(c))) tagsArr.push('CIRCULAR');
    if (rawDate >= '2026-08-01') tagsArr.push('IMPORTANT');
    if (tagsArr.length === 0) tagsArr.push('CIRCULAR');

    // Paragraphs
    const paragraphs = contentHtml
      .split(/<\/p>|<br\s*\/?>/i)
      .map(cleanHtml)
      .filter(p => p && p.length > 15);

    const summary = paragraphs[0] || plainContent.substring(0, 200) || title;

    const noticeItem = {
      id: `not_wp_${post.id}`,
      slug: slug,
      type: isEventCategory ? 'Event' : isExamCategory ? 'Examination' : 'Notice',
      level: 'all',
      title: title,
      refNo: `SPC/${rawDate.substring(0, 4)}/${post.id}`,
      date: rawDate,
      displayDate: displayDate,
      category: isExamCategory ? 'Examinations' : catNames[0] || 'General Notice',
      tags: tagsArr,
      summary: summary,
      documentImage: localImg,
      documentPdf: localPdf,
      content: paragraphs.length > 0 ? paragraphs : [summary],
      signatory: 'Principal / Registrar',
      department: catNames.find(c => /department|faculty|iqac/i.test(c)) || 'General Administration',
      link: localPdf || `/news-events/evt_wp_${post.id}`,
      downloadable: Boolean(localPdf),
      linked_event_id: isEventCategory ? `evt_wp_${post.id}` : null,
      linked_sub_event_id: null,
    };

    formattedNotices.push(noticeItem);

    if (isEventCategory) {
      const eventItem = {
        id: `evt_wp_${post.id}`,
        slug: slug,
        title: title,
        description: summary,
        summary: summary,
        event_date: rawDate,
        date: rawDate,
        end_date: null,
        displayDate: displayDate,
        time_range: '09:30 AM – 04:30 PM',
        time: '09:30 AM – 04:30 PM',
        location: 'College Campus / Auditorium',
        venue: 'College Campus / Auditorium',
        category: catNames[0] || 'Conferences & Seminars',
        level: 'all',
        refNo: `SPC/EVT/${rawDate.substring(0, 4)}/${post.id}`,
        documentImage: localImg,
        documentPdf: localPdf,
        signatory: 'Principal / Event Convenor',
        department: catNames.find(c => /department|faculty|iqac/i.test(c)) || 'Organizing Committee',
        content: paragraphs.length > 0 ? paragraphs : [summary],
        attachments: localPdf
          ? [{ title: `${title} Brochure / Circular`, url: localPdf, type: 'application/pdf' }]
          : localImg
          ? [{ title: `${title} Poster`, url: localImg, type: 'image/jpeg' }]
          : [],
        subEvents: []
      };

      formattedEvents.push(eventItem);
    }
  }

  // Sort by date descending
  formattedNotices.sort((a, b) => new Date(b.date) - new Date(a.date));
  formattedEvents.sort((a, b) => new Date(b.event_date || b.date) - new Date(a.event_date || a.date));

  fs.writeFileSync(path.join(DATA_DIR, 'notices.json'), JSON.stringify(formattedNotices, null, 2));
  fs.writeFileSync(path.join(DATA_DIR, 'events.json'), JSON.stringify(formattedEvents, null, 2));

  console.log(`\nSuccessfully saved:`);
  console.log(`  - ${formattedNotices.length} notices with exact dates & local paths in src/data/notices.json`);
  console.log(`  - ${formattedEvents.length} events with exact dates & local paths in src/data/events.json`);
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
