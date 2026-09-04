const https = require('https');
const fs = require('fs');

const url = 'https://stphilos.ac.in/e-journal/';

https.get(url, (res) => {
  let html = '';
  res.on('data', chunk => html += chunk);
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('HTML Length:', html.length);
    
    // Save raw HTML for inspection
    fs.writeFileSync('scripts/ejournal_raw.html', html, 'utf8');

    // Extract all links
    const links = [];
    const linkRegex = /href=[\"'](https?:\/\/[^\"']+)[\"']/gi;
    let m;
    while ((m = linkRegex.exec(html)) !== null) {
      links.push(m[1]);
    }
    
    console.log('Total Links:', links.length);
    const pdfs = links.filter(l => l.toLowerCase().endsWith('.pdf'));
    console.log('PDF Links:', pdfs);
    
    // Check for images
    const imgRegex = /src=[\"'](https?:\/\/[^\"']+)[\"']/gi;
    const imgs = [];
    while ((m = imgRegex.exec(html)) !== null) {
      imgs.push(m[1]);
    }
    console.log('Total Images:', imgs.length);

    // Look for content container
    const entryMatch = html.match(/<div class="[^"]*entry-content[^"]*"[\s\S]*?<\/div>/i) || html.match(/<article[\s\S]*?<\/article>/i);
    if (entryMatch) {
      console.log('Entry content excerpt:');
      console.log(entryMatch[0].slice(0, 1200));
    }
  });
}).on('error', (err) => {
  console.error('Fetch error:', err.message);
});
