const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const INVENTORY_DIR = path.join(__dirname, 'raw_inventory');
const ROOT_DIR = path.join(__dirname, '../..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'media.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'categories.json'), 'utf8'));

const categoryMap = new Map(categories.map(c => [c.id, c.name]));
const mediaById = new Map(media.map(m => [m.id, m]));

console.log(`Loaded ${posts.length} posts, ${media.length} media items, ${categories.length} categories.`);

// Check how many post images / PDFs exist
let totalPdfLinks = 0;
let totalImgLinks = 0;

for (const post of posts) {
  const content = post.content?.rendered || '';
  const pdfMatches = content.match(/href="([^"]+\.pdf[^"]*)"/gi) || [];
  const imgMatches = content.match(/src="([^"]+\.(?:jpg|jpeg|png|webp|gif)[^"]*)"/gi) || [];
  totalPdfLinks += pdfMatches.length;
  totalImgLinks += imgMatches.length;
}

console.log(`Found ${totalPdfLinks} PDF links and ${totalImgLinks} Image links inside post content.`);
