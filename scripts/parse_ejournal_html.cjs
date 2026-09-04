const fs = require('fs');

const html = fs.readFileSync('scripts/ejournal_raw.html', 'utf8');

// Find all occurrences of dflip or df_ or philos-bulletin
const dflipMatches = html.match(/class=\"[^\"]*dflip[^\"]*\"[\s\S]*?<\/div>/gi) || [];
console.log('dflip matches count:', dflipMatches.length);
dflipMatches.forEach((m, i) => console.log(`[${i+1}]`, m));

// Look for script tags containing dflip settings or pdf source
const scriptMatches = html.match(/<script[\s\S]*?dflip[\s\S]*?<\/script>/gi) || [];
console.log('\nScript tags with dflip:', scriptMatches.length);
scriptMatches.forEach((s, i) => console.log(`[Script ${i+1}]`, s.slice(0, 1000)));

// Search for any source URLs (source:, file:, pdf:)
const sourceMatches = html.match(/source[\'\"]?\s*:\s*[\'\"][^\'\"]+[\'\"]/gi) || [];
console.log('\nSource matches:', sourceMatches);

// Search for any wp-content/uploads PDF or image paths related to bulletin
const bulletinMatches = html.match(/https?:\/\/[^\s\"']*(?:bulletin|ejournal|e-journal|philos)[^\s\"']*/gi) || [];
console.log('\nBulletin related URLs:', Array.from(new Set(bulletinMatches)));
