const https = require('https');
const fs = require('fs');
const path = require('path');

console.log('Fetching live HTML from https://stphilos.ac.in/e-journal/ ...');

https.get('https://stphilos.ac.in/e-journal/', { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log(`Received ${data.length} bytes of HTML.`);
    fs.writeFileSync(path.join(__dirname, 'live_ejournal_page.html'), data);

    // Extract all PDF links, dflip embeds, data-source, etc.
    const pdfMatches = data.match(/https?:\/\/[^"'\s<>]+\.pdf/gi) || [];
    const dflipBooks = data.match(/class="[^"]*_df_book[^"]*"[^>]*>/gi) || [];
    const dflipSources = data.match(/source="([^">]+)"/gi) || [];
    const dataSources = data.match(/data-source="([^">]+)"/gi) || [];

    console.log(`Found ${pdfMatches.length} PDF links.`);
    console.log(`Found ${dflipBooks.length} dflip books.`);
    console.log(`Found ${dflipSources.length} dflip sources.`);
    console.log(`Found ${dataSources.length} data-source attributes.`);

    console.log('\n--- PDF Matches ---');
    [...new Set(pdfMatches)].forEach(p => console.log(` - ${p}`));

    console.log('\n--- Data Sources ---');
    dataSources.forEach(d => console.log(` - ${d}`));

    console.log('\n--- dflip sources ---');
    dflipSources.forEach(d => console.log(` - ${d}`));
  });
}).on('error', err => {
  console.error('Error fetching live page:', err);
});
