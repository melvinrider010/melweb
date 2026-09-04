const https = require('https');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = path.join(__dirname, 'raw_inventory');
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchJson(res.headers.location).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${url}`));
      }
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const total = parseInt(res.headers['x-wp-total'] || '0', 10);
          const totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
          const data = JSON.parse(body);
          resolve({ data, total, totalPages });
        } catch (e) {
          reject(e);
        }
      });
    }).on('error', reject);
  });
}

async function fetchAllPages(endpointName, totalExpectedPages) {
  console.log(`\nFetching ${endpointName}...`);
  const allItems = [];
  let page = 1;
  let totalPages = totalExpectedPages || 1;

  while (page <= totalPages) {
    const url = `https://stphilos.ac.in/wp-json/wp/v2/${endpointName}?per_page=100&page=${page}`;
    try {
      const res = await fetchJson(url);
      totalPages = res.totalPages;
      allItems.push(...res.data);
      console.log(`  [${endpointName}] Page ${page}/${totalPages} fetched (${res.data.length} items, total accumulated: ${allItems.length}/${res.total})`);
      page++;
      // Be polite to server
      await new Promise(r => setTimeout(r, 200));
    } catch (err) {
      console.error(`  [${endpointName}] Error on page ${page}:`, err.message);
      // retry once
      await new Promise(r => setTimeout(r, 1000));
      try {
        const res = await fetchJson(url);
        totalPages = res.totalPages;
        allItems.push(...res.data);
        console.log(`  [${endpointName}] Retry successful for page ${page}/${totalPages}`);
        page++;
      } catch (e2) {
        console.error(`  [${endpointName}] Retry failed on page ${page}:`, e2.message);
        break;
      }
    }
  }

  const outPath = path.join(OUTPUT_DIR, `${endpointName}.json`);
  fs.writeFileSync(outPath, JSON.stringify(allItems, null, 2));
  console.log(`Saved ${allItems.length} ${endpointName} items to ${outPath}`);
  return allItems;
}

async function main() {
  console.log('=== STARTING COMPLETE WORDPRESS REST API INVENTORY EXTRACTION ===');
  
  // 1. Categories & Tags
  console.log('\nFetching categories & tags...');
  const categoriesRes = await fetchJson('https://stphilos.ac.in/wp-json/wp/v2/categories?per_page=100');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'categories.json'), JSON.stringify(categoriesRes.data, null, 2));
  console.log(`Saved ${categoriesRes.data.length} categories.`);

  const tagsRes = await fetchJson('https://stphilos.ac.in/wp-json/wp/v2/tags?per_page=100');
  fs.writeFileSync(path.join(OUTPUT_DIR, 'tags.json'), JSON.stringify(tagsRes.data, null, 2));
  console.log(`Saved ${tagsRes.data.length} tags.`);

  // 2. Posts (all historical)
  await fetchAllPages('posts', 23);

  // 3. Pages
  await fetchAllPages('pages', 11);

  // 4. Media (all 9705 items)
  await fetchAllPages('media', 98);

  console.log('\n=== INVENTORY EXTRACTION COMPLETED SUCCESSFULLY ===');
}

main().catch(err => {
  console.error('Fatal error in inventory fetch:', err);
  process.exit(1);
});
