const fs = require('fs');
const path = require('path');
const { parseCvTables, cleanHtml } = require('./normalize_stphilos_data.cjs');

const samples = ['gunasheelandetails.html', 'e-gloriya.html', 'dr-sachin-c-n.html', 'dr-b-shyla.html', 'dr-issac-george.html', 'reena-moldetail.html'];

samples.forEach(file => {
  const filePath = path.join(__dirname, 'stphilos_raw/pages', file);
  if (!fs.existsSync(filePath)) {
    console.log(file, 'not found');
    return;
  }
  const html = fs.readFileSync(filePath, 'utf8');
  const cv = parseCvTables(html);
  console.log(`\n=================== CV PARSE: ${file} ===================`);
  console.log('Qualifications:', cv.qualifications.slice(0, 3));
  console.log('Teaching Exp:', cv.teachingExperience.slice(0, 3));
  console.log('Specialization:', cv.specialization.slice(0, 3));
  console.log('Conference Presentations:', cv.conferencePresentations.length);
  console.log('Seminars Attended:', cv.seminarsAttended.length);
  console.log('Journal Publications:', cv.journalPublications.length);
  console.log('Awards:', cv.awards.length);
  console.log('Contact:', cv.contact);
});
