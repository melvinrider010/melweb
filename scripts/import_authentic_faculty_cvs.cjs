const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const INVENTORY_DIR = path.join(ROOT_DIR, 'scripts/historical_migration/raw_inventory');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));
const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));

console.log('=== STARTING OFFICIAL FACULTY CV EXTRACTION & NORMALIZATION ===\n');

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizePersonName(name) {
  return (name || '')
    .replace(/^(Dr\.?|Prof\.?|Mr\.?|Mrs\.?|Ms\.?|Rev\.?|Fr\.?|Sr\.?)\s+/i, '')
    .replace(/,\s*(Ph\.?D|M\.?Phil|M\.?Sc|M\.?A|M\.?Com|B\.?E|B\.?Tech|MCA|MBA|NET|SET|KSET|SLET).*$/i, '')
    .replace(/[^a-zA-Z0-9]/g, '')
    .toLowerCase();
}

// 1. INDEX ALL INDIVIDUAL CV PAGES FROM WORDPRESS INVENTORY
const individualCvPages = [];
for (const p of pages) {
  const html = p.content?.rendered || '';
  const title = p.title?.rendered || '';
  const slug = p.slug || '';
  const link = p.link || '';

  // Check if page contains the standard official St. Philomena's CV table
  if (/<table/i.test(html) && (/designation/i.test(html) || /qualification/i.test(html) || /conferences/i.test(html) || /papers presented/i.test(html))) {
    individualCvPages.push({
      id: p.id,
      slug: slug,
      title: cleanHtml(title),
      link: link,
      normName: normalizePersonName(cleanHtml(title)),
      html: html
    });
  }
}

console.log(`Discovered ${individualCvPages.length} individual CV pages in official WordPress database.\n`);

// 2. PARSE CV DATA FOR EVERY CANONICAL FACULTY MEMBER
let matchedProfilesCount = 0;
let missingProfilesCount = 0;

for (const fac of facultyList) {
  const normFacName = normalizePersonName(fac.name);
  const cleanId = fac.id.replace('fac_', '');

  // Match official individual profile page
  let matchedPage = individualCvPages.find(p => p.normName === normFacName);
  if (!matchedPage) {
    matchedPage = individualCvPages.find(p => p.slug.replace(/[^a-z0-9]/g, '').includes(cleanId) || cleanId.includes(p.slug.replace(/[^a-z0-9]/g, '')));
  }
  if (!matchedPage && fac.officialProfileUrl) {
    matchedPage = individualCvPages.find(p => p.link === fac.officialProfileUrl || p.slug === fac.officialProfileUrl.split('/').filter(Boolean).pop());
  }

  if (matchedPage) {
    matchedProfilesCount++;
    fac.officialProfileUrl = matchedPage.link;
    fac.officialCvSourceUrl = matchedPage.link;
    fac.sourceVerified = true;

    // Parse structured sections
    const html = matchedPage.html;
    const cv = {
      qualifications: [],
      specialization: [],
      teachingExperience: [],
      researchExperience: [],
      industryExperience: [],
      researchInterests: [],
      publications: [],
      conferencePresentations: [],
      seminarsAttended: [],
      workshops: [],
      resourcePerson: [],
      awards: [],
      projects: [],
      books: [],
      contact: {
        email: fac.email || `${cleanId}@stphilos.ac.in`,
        phone: fac.phone || '+91 821 4001500',
        intercom: null
      }
    };

    // Parse table rows
    const tableRows = [...html.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/gi)];
    let currentTableMode = 'general';

    for (const r of tableRows) {
      const rHtml = r[1];
      const cells = [...rHtml.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/gi)].map(c => cleanHtml(c[1]));
      if (cells.length === 0) continue;

      const fullRowText = cells.join(' ');

      // Check section transitions
      if (/details of seminars|conferences\/seminars\/workshops attended/i.test(fullRowText)) {
        currentTableMode = 'seminars';
        continue;
      } else if (/papers presented|papers published|various conferences/i.test(fullRowText)) {
        currentTableMode = 'papers';
        continue;
      } else if (/acted as a resource person/i.test(fullRowText)) {
        currentTableMode = 'resource';
        continue;
      } else if (/awards and recognition/i.test(fullRowText)) {
        currentTableMode = 'awards';
        continue;
      } else if (/major|minor research projects/i.test(fullRowText)) {
        currentTableMode = 'projects';
        continue;
      } else if (/books|chapters/i.test(fullRowText)) {
        currentTableMode = 'books';
        continue;
      }

      // Handle table modes
      if (currentTableMode === 'seminars') {
        if (cells.length >= 3 && !/sl\.?\s*no|conferences|name of/i.test(cells[0]) && cells[1].length > 2 && !/nill|nil/i.test(cells[1])) {
          cv.seminarsAttended.push({
            title: cells[1],
            institution: cells[2] || '',
            duration: cells[3] || ''
          });
        }
      } else if (currentTableMode === 'papers') {
        if (cells.length >= 3 && !/s\.?\s*no|title of|conference/i.test(cells[0]) && cells[1].length > 2 && !/nill|nil/i.test(cells[1])) {
          cv.conferencePresentations.push({
            title: cells[1],
            conferenceName: cells[2] || '',
            dates: cells[3] || ''
          });
        }
      } else if (currentTableMode === 'resource') {
        if (cells.length >= 3 && !/s\.?\s*no|college|topics/i.test(cells[0]) && cells[2].length > 2 && !/nill|nil/i.test(cells[2])) {
          cv.resourcePerson.push({
            institution: cells[1] || '',
            topic: cells[2] || '',
            date: cells[3] || ''
          });
        }
      } else if (currentTableMode === 'awards') {
        if (cells.length >= 2 && !/s\.?\s*no|awards/i.test(cells[0]) && cells[1].length > 2 && !/nill|nil/i.test(cells[1])) {
          cv.awards.push({
            award: cells[1],
            organization: cells[2] || '',
            date: cells[3] || ''
          });
        }
      } else {
        // General top metadata
        if (/qualification/i.test(fullRowText)) {
          const val = cells[cells.length - 1];
          if (val && !/qualification/i.test(val)) cv.qualifications.push(val);
        }
        if (/specialization/i.test(fullRowText)) {
          const val = cells[cells.length - 1];
          if (val && !/specialization/i.test(val)) cv.specialization.push(val);
        }
        if (/experience/i.test(fullRowText)) {
          const val = cells[cells.length - 1];
          if (val && !/experience/i.test(val)) cv.teachingExperience.push(val);
        }
        if (/email/i.test(fullRowText)) {
          const emailMatch = fullRowText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
          if (emailMatch) cv.contact.email = emailMatch[0];
        }
        if (/contact|mobile|phone/i.test(fullRowText)) {
          const phoneMatch = fullRowText.match(/\d{10}/);
          if (phoneMatch) cv.contact.phone = phoneMatch[0];
        }
      }
    }

    // Default fallback values if empty but known
    if (cv.qualifications.length === 0 && fac.qualification) {
      cv.qualifications.push(fac.qualification);
    }
    if (cv.teachingExperience.length === 0 && fac.experience) {
      cv.teachingExperience.push(fac.experience);
    }

    fac.cvData = cv;
    fac.bio = `${fac.name} is an esteemed member of the ${fac.department} at St. Philomena's College (Autonomous), Mysuru.`;
  } else {
    missingProfilesCount++;
    fac.officialProfileUrl = null;
    fac.officialCvSourceUrl = null;
    fac.sourceVerified = false;
    fac.cvData = {
      qualifications: fac.qualification ? [fac.qualification] : [],
      specialization: [],
      teachingExperience: fac.experience ? [fac.experience] : [],
      researchExperience: [],
      industryExperience: [],
      researchInterests: [],
      publications: [],
      conferencePresentations: [],
      seminarsAttended: [],
      workshops: [],
      resourcePerson: [],
      awards: [],
      projects: [],
      books: [],
      contact: {
        email: fac.email || `${cleanId}@stphilos.ac.in`,
        phone: fac.phone || '+91 821 4001500',
        intercom: null
      }
    };
    fac.bio = `${fac.name} is an esteemed member of the ${fac.department} at St. Philomena's College (Autonomous), Mysuru.`;
  }
}

console.log(`Matched Official Individual Profiles: ${matchedProfilesCount}`);
console.log(`Profiles without Individual Page:   ${missingProfilesCount}\n`);

// Save updated datasets
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(facultyList, null, 2));

hierarchy.faculty = facultyList;
fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));

console.log('=== CANONICAL FACULTY CV DATASETS SAVED SUCCESSFULLY ===');
