const fs = require('fs');
const cheerio = require('cheerio');

const files = ['nep-regulations', 'pg-e-contents', 'syllabus-ug', 'syllabus-pg', 'obe-manual'];
const results = {};

files.forEach(name => {
  const html = fs.readFileSync('scripts/scraped_academics/' + name + '.html', 'utf8');
  const $ = cheerio.load(html);
  
  // Extract all links
  const links = [];
  $('a').each((i, el) => {
    const href = $(el).attr('href');
    const text = $(el).text().trim();
    if (href && (href.endsWith('.pdf') || href.includes('/wp-content/uploads/') || href.includes('drive.google.com') || href.includes('youtube.com') || href.includes('docs.google.com'))) {
      links.push({ text, href });
    }
  });

  // Extract tables
  const tables = [];
  $('table').each((tIdx, tEl) => {
    const tableData = [];
    $(tEl).find('tr').each((rIdx, rEl) => {
      const row = [];
      $(rEl).find('th, td').each((cIdx, cEl) => {
        const link = $(cEl).find('a').attr('href');
        const text = $(cEl).text().trim();
        row.push({ text, link });
      });
      if (row.length) tableData.push(row);
    });
    if (tableData.length) tables.push(tableData);
  });

  // Extract main headings
  const headings = [];
  $('h1, h2, h3, h4, h5, h6').each((i, el) => {
    const text = $(el).text().trim();
    if (text && !text.includes('Search') && !text.includes('Menu')) {
      headings.push(text);
    }
  });

  // Extract paragraphs in main content
  const paragraphs = [];
  $('.entry-content p, .elementor-widget-container p').each((i, el) => {
    const text = $(el).text().trim();
    if (text && text.length > 20) {
      paragraphs.push(text);
    }
  });

  results[name] = {
    headings: headings.slice(0, 15),
    paragraphs: paragraphs.slice(0, 10),
    links,
    tables
  };
});

fs.writeFileSync('src/data/academics_curriculum_raw.json', JSON.stringify(results, null, 2));
console.log('Parsed all 5 pages successfully!');
