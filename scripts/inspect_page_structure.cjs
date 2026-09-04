const fs = require('fs');
const path = require('path');

function inspectPage(filename) {
  const filePath = path.join(__dirname, 'stphilos_raw/pages', filename);
  if (!fs.existsSync(filePath)) {
    console.log(filename, 'not found');
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  console.log(`\n=================== ${filename} (${html.length} bytes) ===================`);
  
  // Headings
  const headings = html.match(/<h[1-6][^>]*>([\s\S]*?)<\/h[1-6]>/gi) || [];
  console.log('Headings:', headings.map(h => h.replace(/<[^>]+>/g, '').trim()).filter(Boolean));

  // Tables
  const tables = html.match(/<table[^>]*>([\s\S]*?)<\/table>/gi) || [];
  console.log('Tables Count:', tables.length);

  // Links
  const links = [];
  const linkRegex = /href=["'](https?:\/\/stphilos\.ac\.in\/[a-zA-Z0-9_\-\/]+)["']/gi;
  let match;
  while ((match = linkRegex.exec(html)) !== null) {
    if (!links.includes(match[1])) links.push(match[1]);
  }
  console.log('Internal Stphilos links:', links.slice(0, 10));
}

inspectPage('physics.html');
inspectPage('chemistry.html');
inspectPage('commerce.html');
inspectPage('management.html');
inspectPage('mca.html');
inspectPage('bca.html');
