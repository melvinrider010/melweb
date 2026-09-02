const fs = require('fs');

const files = ['nep-regulations', 'pg-e-contents', 'syllabus-ug', 'syllabus-pg', 'obe-manual'];
const results = {};

files.forEach(name => {
  const html = fs.readFileSync('scripts/scraped_academics/' + name + '.html', 'utf8');
  
  // Extract all PDF and doc links
  const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
  const links = [];
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = match[1];
    const rawText = match[2].replace(/<[^>]+>/g, '').trim();
    if (href.endsWith('.pdf') || href.includes('/wp-content/uploads/') || href.includes('drive.google.com') || href.includes('docs.google.com') || href.includes('youtube.com')) {
      if (rawText || href.endsWith('.pdf')) {
        links.push({ text: rawText || href.split('/').pop(), href });
      }
    }
  }

  // Extract table rows
  const tableRegex = /<table[^>]*>(.*?)<\/table>/gis;
  const tables = [];
  let tMatch;
  while ((tMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tMatch[1];
    const rowRegex = /<tr[^>]*>(.*?)<\/tr>/gis;
    const rows = [];
    let rMatch;
    while ((rMatch = rowRegex.exec(tableHtml)) !== null) {
      const rowHtml = rMatch[1];
      const cellRegex = /<(?:td|th)[^>]*>(.*?)<\/(?:td|th)>/gis;
      const cells = [];
      let cMatch;
      while ((cMatch = cellRegex.exec(rowHtml)) !== null) {
        const cellHtml = cMatch[1];
        const linkMatch = /href=["']([^"']+)["']/i.exec(cellHtml);
        const link = linkMatch ? linkMatch[1] : null;
        const text = cellHtml.replace(/<[^>]+>/g, '').trim();
        cells.push({ text, link });
      }
      if (cells.length > 0) {
        rows.push(cells);
      }
    }
    if (rows.length > 0) {
      tables.push(rows);
    }
  }

  results[name] = {
    totalLinks: links.length,
    links,
    tables
  };
});

fs.writeFileSync('src/data/academics_curriculum_raw.json', JSON.stringify(results, null, 2));
console.log('Extracted raw curriculum data successfully!');
