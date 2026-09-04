const fs = require('fs');

const html = fs.readFileSync('scripts/ejournal_raw.html', 'utf8');

// Find any JSON or JS variables containing df_ or option_
const regex = /option_df_(\d+)\s*=\s*({[\s\S]*?});/gi;
let m;
const configs = {};
while ((m = regex.exec(html)) !== null) {
  try {
    configs[m[1]] = JSON.parse(m[2]);
  } catch (e) {
    configs[m[1]] = m[2];
  }
}

console.log('Configs extracted count:', Object.keys(configs).length);
console.log(JSON.stringify(configs, null, 2));

// Also find all dflip-source attributes or embed source links
const sourceMatches = html.match(/data-source=\"[^\"]+\"/gi) || [];
console.log('\nData sources:', sourceMatches);
