const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const urlsToFetch = [
  // Column 1: Placement Cell & Welfare
  { key: 'placement-cell', label: 'Career and Placement Cell', url: 'https://stphilos.ac.in/placement-cell/', localRoute: '/placement-cell', col: 'Placement Cell & Welfare' },
  { key: 'student-grievance-redressal-committee', label: 'Grievance Redressal', url: 'https://stphilos.ac.in/student-grievance-redressal-committee/', localRoute: '/student-grievance-redressal-committee', col: 'Placement Cell & Welfare' },
  { key: 'anti-ragging', label: 'Anti-Ragging', url: 'https://stphilos.ac.in/anti-ragging/', localRoute: '/anti-ragging', col: 'Placement Cell & Welfare' },
  { key: 'womens-cell', label: "Women's Cell", url: 'https://stphilos.ac.in/womens-cell/', localRoute: '/womens-cell', col: 'Placement Cell & Welfare' },
  { key: 'student-welfare-cell', label: 'Student Welfare Cell', url: 'https://stphilos.ac.in/student-welfare-cell/', localRoute: '/student-welfare-cell', col: 'Placement Cell & Welfare' },
  { key: 'counselling-centre', label: 'Counselling Centre', url: 'https://stphilos.ac.in/counselling-centre/', localRoute: '/counselling-centre', col: 'Placement Cell & Welfare' },
  { key: 'human-values-professional-ethics', label: 'Human Values And Professional Ethics', url: 'https://stphilos.ac.in/human-values-professional-ethics/', localRoute: '/human-values-professional-ethics', col: 'Placement Cell & Welfare' },
  { key: 'youth-red-cross-yrc', label: 'Youth Redcross', url: 'https://stphilos.ac.in/youth-red-cross-yrc/', localRoute: '/youth-red-cross-yrc', col: 'Placement Cell & Welfare' },

  // Column 2: Amenities
  { key: 'library', label: 'Library', url: 'https://stphilos.ac.in/library/', localRoute: '/library', col: 'Amenities' },
  { key: 'college-magazine', label: 'College Magazine', url: 'https://stphilos.ac.in/magazine/', localRoute: '/magazine', col: 'Amenities' },
  { key: 'facilities', label: 'Physical Infrastructure', url: 'https://stphilos.ac.in/facilities/', localRoute: '/facilities', col: 'Amenities' },
  { key: 'business-lab', label: 'Business Lab', url: 'https://stphilos.ac.in/business-lab/', localRoute: '/business-lab', col: 'Amenities' },
  { key: 'computer-science-lab', label: 'Computer Lab', url: 'https://stphilos.ac.in/computer-science-lab/', localRoute: '/computer-science-lab', col: 'Amenities' },
  { key: 'girls-hostel', label: 'Girls Hostel', url: 'https://stphilos.ac.in/about-us-2/infrastructure/girls-hostel/', localRoute: '/about-us-2/infrastructure/girls-hostel', col: 'Amenities' },
  { key: 'boys-hostel', label: 'Boys Hostel', url: 'https://stphilos.ac.in/about-us-2/infrastructure/boys-hostel/', localRoute: '/about-us-2/infrastructure/boys-hostel', col: 'Amenities' },
  { key: 'auditorium', label: 'Auditorium', url: 'https://stphilos.ac.in/auditorium/', localRoute: '/auditorium', col: 'Amenities' },
  { key: 'e-journal', label: 'Philos Bulletin', url: 'https://stphilos.ac.in/e-journal/', localRoute: '/e-journal', col: 'Amenities' },

  // Column 3: Other Amenities
  { key: 'bank-atm', label: 'Bank & ATM', url: 'https://stphilos.ac.in/about-us-2/infrastructure/bank-atm/', localRoute: '/about-us-2/infrastructure/bank-atm', col: 'Other Amenities' },
  { key: 'chapel-hall-3', label: 'Chapel', url: 'https://stphilos.ac.in/chapel-hall-3/', localRoute: '/chapel-hall-3', col: 'Other Amenities' },
  { key: 'ranger-and-rovers', label: 'Ranger and Rovers', url: 'https://stphilos.ac.in/ranger-and-rovers/', localRoute: '/ranger-and-rovers', col: 'Other Amenities' },
  { key: 'ncc', label: 'NCC', url: 'https://stphilos.ac.in/ncc/', localRoute: '/ncc', col: 'Other Amenities' },
  { key: 'nss', label: 'NSS', url: 'https://stphilos.ac.in/nss/', localRoute: '/nss', col: 'Other Amenities' },
  { key: 'indoor-stadium', label: 'Indoor Stadium', url: 'https://stphilos.ac.in/indoor-stadium/', localRoute: '/indoor-stadium', col: 'Other Amenities' }
];

function fetchHtml(url) {
  return new Promise((resolve) => {
    const proto = url.startsWith('https') ? https : http;
    const req = proto.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchHtml(res.headers.location).then(resolve);
      }
      if (res.statusCode !== 200) {
        console.warn(`[WARN HTTP ${res.statusCode}] ${url}`);
        return resolve('');
      }
      let html = '';
      res.on('data', chunk => html += chunk);
      res.on('end', () => resolve(html));
    });
    req.on('error', (e) => {
      console.warn(`[ERROR] ${url}: ${e.message}`);
      resolve('');
    });
    req.setTimeout(15000, () => {
      req.abort();
      console.warn(`[TIMEOUT] ${url}`);
      resolve('');
    });
  });
}

function cleanText(text) {
  if (!text) return '';
  return text
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<nav[\s\S]*?<\/nav>/gi, '')
    .replace(/<header[\s\S]*?<\/header>/gi, '')
    .replace(/<footer[\s\S]*?<\/footer>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "-")
    .replace(/&#038;/g, "&")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, ' ')
    .trim();
}

function extractImages(html) {
  const imgs = [];
  const imgRegex = /<img[^>]+src=[\"'](https?:\/\/[^\"']+)[\"'][^>]*>/gi;
  let m;
  while ((m = imgRegex.exec(html)) !== null) {
    const src = m[1];
    if (!src.includes('cropped-image-40') && !src.includes('logo') && !src.includes('icon')) {
      imgs.push(src);
    }
  }
  return Array.from(new Set(imgs));
}

function extractPdfs(html) {
  const pdfs = [];
  const linkRegex = /href=[\"'](https?:\/\/[^\"']+\.pdf)[\"']/gi;
  let m;
  while ((m = linkRegex.exec(html)) !== null) {
    pdfs.push(m[1]);
  }
  return Array.from(new Set(pdfs));
}

async function run() {
  console.log('====================================================');
  console.log('CRAWLING AND IMPORTING ALL 22 STUDENT SUPPORT & AMENITIES PAGES');
  console.log('====================================================\n');

  const scrapedResults = {};

  for (const item of urlsToFetch) {
    console.log(`Fetching: [${item.col}] -> ${item.label} (${item.url})`);
    const html = await fetchHtml(item.url);
    
    // Extract main entry content or fallback
    const entryMatch = html.match(/<div class="[^"]*entry-content[^"]*"[\s\S]*?<\/div>/i) || 
                       html.match(/<article[\s\S]*?<\/article>/i) ||
                       html.match(/<main[\s\S]*?<\/main>/i);
    
    const contentHtml = entryMatch ? entryMatch[0] : html;
    const plainText = cleanText(contentHtml);
    const images = extractImages(contentHtml);
    const pdfs = extractPdfs(contentHtml);

    // Title from HTML
    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const pageTitle = titleMatch ? titleMatch[1].replace(/–.*$/, '').replace(/\|.*$/, '').trim() : item.label;

    scrapedResults[item.key] = {
      key: item.key,
      label: item.label,
      column: item.col,
      url: item.url,
      localRoute: item.localRoute,
      pageTitle: pageTitle || item.label,
      textSnippet: plainText.slice(0, 1500),
      fullText: plainText,
      images: images.slice(0, 8),
      pdfs,
      hasContent: plainText.length > 50
    };

    console.log(`  -> Title: "${pageTitle}" | Text length: ${plainText.length} | Images: ${images.length} | PDFs: ${pdfs.length}`);
  }

  // Save scraped data to JSON
  fs.writeFileSync('src/data/studentSupportData.json', JSON.stringify(scrapedResults, null, 2), 'utf8');
  console.log('\n[SUCCESS] Wrote all 22 pages data to src/data/studentSupportData.json!');
}

run();
