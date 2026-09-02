const fs = require('fs');
const html = fs.readFileSync('scripts/scraped_academics/iic.html', 'utf8');

// Find the main article or elementor content
const mainContentMatch = html.match(/<article[^>]*>([\s\S]*?)<\/article>/i) || html.match(/<main[^>]*>([\s\S]*?)<\/main>/i) || html.match(/<div class="entry-content[^"]*">([\s\S]*?)<\/div>/i);

const contentHtml = mainContentMatch ? mainContentMatch[0] : html;

// Extract all paragraph texts
const pRegex = /<p[^>]*>(.*?)<\/p>/gis;
const paragraphs = [];
let pMatch;
while ((pMatch = pRegex.exec(contentHtml)) !== null) {
  const text = pMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length > 10) paragraphs.push(text);
}

// Extract iframe / dflip / pdf embeds
const dflipMatch = contentHtml.match(/source["']?\s*:\s*["']([^"']+)["']/i);
const pdfSource = dflipMatch ? dflipMatch[1].replace(/\\\//g, '/') : null;

// Extract images inside content
const contentImages = [];
const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
let im;
while ((im = imgRegex.exec(contentHtml)) !== null) {
  contentImages.push(im[1]);
}

// Extract list items
const liRegex = /<li[^>]*>(.*?)<\/li>/gis;
const listItems = [];
let liMatch;
while ((liMatch = liRegex.exec(contentHtml)) !== null) {
  const text = liMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (text.length > 5 && !text.includes('Home') && !text.includes('About')) {
    listItems.push(text);
  }
}

const detailed = {
  paragraphs,
  pdfSource,
  contentImages,
  listItems: listItems.slice(0, 50)
};

fs.writeFileSync('src/data/iic_detailed_parsed.json', JSON.stringify(detailed, null, 2));
console.log('Detailed IIC content parsed!');
