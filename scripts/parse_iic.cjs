const fs = require('fs');

const html = fs.readFileSync('scripts/scraped_academics/iic.html', 'utf8');

// Extract all PDF links
const pdfRegex = /https?:\/\/[^\s"'<>]+\.pdf/gi;
const pdfs = [...new Set(html.match(pdfRegex) || [])];

// Extract all Images
const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
const images = [];
let imgMatch;
while ((imgMatch = imgRegex.exec(html)) !== null) {
  images.push(imgMatch[1]);
}

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

// Extract headings & paragraphs
const headings = [];
const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gis;
let hMatch;
while ((hMatch = headingRegex.exec(html)) !== null) {
  const text = hMatch[1].replace(/<[^>]+>/g, '').trim();
  if (text && text.length > 2) headings.push(text);
}

const result = {
  headings,
  pdfs,
  tables,
  images: [...new Set(images)]
};

fs.writeFileSync('src/data/iic_scraped_data.json', JSON.stringify(result, null, 2));
console.log('IIC scraped successfully! Extracted ' + pdfs.length + ' PDFs, ' + tables.length + ' tables, ' + headings.length + ' headings.');
