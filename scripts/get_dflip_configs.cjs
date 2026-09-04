const fs = require('fs');

const html = fs.readFileSync('scripts/ejournal_raw.html', 'utf8');

// Find all script tags or JSON objects containing dflip config
const matches = html.match(/var\s+(?:dflipBooks|option_[a-zA-Z0-9_]+|dflipSettings)\s*=\s*[\s\S]*?;\s*<\/script>/gi) || [];
console.log('Script matches count:', matches.length);
matches.forEach(m => console.log(m));

// Also let's extract all _df_thumb elements and their parent container
const thumbRegex = /<div class="_df_thumb[\s\S]*?<\/div>/gi;
const thumbs = html.match(thumbRegex) || [];
console.log('\nThumbnails count:', thumbs.length);
thumbs.forEach((t, i) => console.log(`[Thumb ${i+1}]`, t));
