const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const pages = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory/pages.json'), 'utf8'));

const p = pages.find(page => page.id === 757);

console.log('=== OFFICIAL PHYSICS DEPARTMENT CONTENT (PAGE ID 757) ===\n');
console.log(`Title: ${p.title?.rendered}`);
console.log(`URL:   ${p.link}`);
console.log(`Content:\n`);

function cleanHtml(html) {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/\n\s*\n/g, '\n')
    .trim();
}

console.log(cleanHtml(p.content?.rendered || ''));
