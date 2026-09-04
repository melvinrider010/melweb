const fs = require('fs');
const path = require('path');

const slugs = [
  'cycle-iii-certificate',
  'minutes-of-the-meeting-atr',
  'mom-2021-22',
  'mom-atr-2022-23',
  'aqar-2023-24-meetings',
  'iqac-mom-2024-2025',
  'aqar-2018-2019',
  'aqar-2019-20',
  'aqar-2020-21',
  'aqar-2021-22',
  'aqar-2022-23',
  'aqar-2023-24',
  'composition-of-iqac',
  'criteria-leaders-sub-committe-members',
  'activity-list',
  '6-days-fdp-jan-2025',
  '6-days-fdp-2025',
  'six-day-faculty-development-programme-for-the-faculty-members-of-ug-pg-programmes',
  'green-audit-certificate-iso-17020',
  'road-map-of-iqac',
  'roadmap-2024-25',
  '2025-26-road-map',
  'gender-audit',
  'activities-report-of-iqac'
];

const rawDir = path.resolve(__dirname, 'stphilos_raw/pages');
const results = {};

slugs.forEach(slug => {
  const fileHtml = path.join(rawDir, slug + '.html');
  const fileJson = path.join(rawDir, slug + '.json');
  let content = '';
  if (fs.existsSync(fileHtml)) {
    content = fs.readFileSync(fileHtml, 'utf8');
  } else if (fs.existsSync(fileJson)) {
    content = JSON.parse(fs.readFileSync(fileJson, 'utf8')).content?.rendered || '';
  }

  // Extract PDFs
  const pdfs = [...content.matchAll(/href=["'](https?:\/\/[^"']+\.pdf)["']/gi)].map(m => m[1]);
  // Extract images
  const imgs = [...content.matchAll(/src=["'](https?:\/\/[^"']+\.(?:jpe?g|png|webp))["']/gi)].map(m => m[1]);

  results[slug] = {
    found: Boolean(content),
    contentLength: content.length,
    pdfs,
    imagesCount: imgs.length,
    sampleText: content.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().substring(0, 200)
  };
});

console.log('Results summary:');
Object.entries(results).forEach(([k, v]) => {
  console.log(`- ${k}: found=${v.found}, pdfs=${v.pdfs.length}, text="${v.sampleText.substring(0, 60)}..."`);
});
