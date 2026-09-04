const fs = require('fs');

const html = fs.readFileSync('scripts/live_home.html', 'utf8');

// Find tab titles NOTICES, EXAMINATION, EVENTS together
const regex = /<div[^>]*>[\s\S]*?NOTICES[\s\S]*?EXAMINATION[\s\S]*?EVENTS[\s\S]*?<\/div>/i;
const match = html.match(regex);
if (match) {
  console.log('Found tabs widget:');
  console.log(match[0].slice(0, 3000));
} else {
  // search around pos 340000
  console.log('Looking around pos 330000..345000:');
  const chunk = html.substring(330000, 345000);
  // find any tab / notice-board classes
  const clean = chunk.match(/<section[\s\S]{1,5000}<\/section>/i);
  console.log(clean ? clean[0].slice(0, 3000) : chunk.slice(0, 3000));
}
