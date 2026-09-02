const fs = require('fs');

const html = fs.readFileSync('scripts/scraped_academics/nirf.html', 'utf8');

// Extract all PDF links
const pdfRegex = /https?:\/\/[^\s"'<>]+\.pdf/gi;
const pdfs = [...new Set(html.match(pdfRegex) || [])];

// Extract all links with text
const linkRegex = /<a\s+[^>]*href=["']([^"']+)["'][^>]*>(.*?)<\/a>/gis;
const linkList = [];
let lMatch;
while ((lMatch = linkRegex.exec(html)) !== null) {
  const href = lMatch[1];
  const text = lMatch[2].replace(/<[^>]+>/g, '').trim();
  if (href.endsWith('.pdf') || href.includes('drive.google.com') || href.includes('/wp-content/uploads/')) {
    linkList.push({ text: text || href.split('/').pop(), href });
  }
}

// Extract dflip / embed
const dflipMatch = html.match(/source["']?\s*:\s*["']([^"']+)["']/i);
const dflip = dflipMatch ? dflipMatch[1].replace(/\\\//g, '/') : null;

// Extract all tables
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

// Extract paragraphs & headings
const headings = [];
const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis;
let hMatch;
while ((hMatch = headingRegex.exec(html)) !== null) {
  const text = hMatch[1].replace(/<[^>]+>/g, '').trim();
  if (text && text.length > 2) headings.push(text);
}

const pRegex = /<p[^>]*>(.*?)<\/p>/gis;
const paragraphs = [];
let pMatch;
while ((pMatch = pRegex.exec(html)) !== null) {
  const text = pMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length > 15) paragraphs.push(text);
}

const result = {
  headings,
  paragraphs: paragraphs.slice(0, 15),
  dflip,
  pdfs,
  linkList,
  tables
};

fs.writeFileSync('src/data/nirf_scraped_data.json', JSON.stringify(result, null, 2));
console.log('NIRF scraped successfully!');
