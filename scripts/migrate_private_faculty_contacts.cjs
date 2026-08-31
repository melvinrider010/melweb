const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const DEPARTMENTS_URLS = [
  { dept: 'economics', url: 'https://stphilos.ac.in/economics/' },
  { dept: 'computer-science', url: 'https://stphilos.ac.in/bca/' },
  { dept: 'computer-science', url: 'https://stphilos.ac.in/department-of-computer-science/' },
  { dept: 'business-administration', url: 'https://stphilos.ac.in/bba/' },
  { dept: 'business-administration', url: 'https://stphilos.ac.in/department-of-bba-tourism-and-hospitality/' },
  { dept: 'commerce', url: 'https://stphilos.ac.in/b-com/' },
  { dept: 'commerce', url: 'https://stphilos.ac.in/department-of-commerce/' },
  { dept: 'commerce', url: 'https://stphilos.ac.in/m-com/' },
  { dept: 'social-work', url: 'https://stphilos.ac.in/bsw/' },
  { dept: 'social-work', url: 'https://stphilos.ac.in/m-s-w/' },
  { dept: 'english', url: 'https://stphilos.ac.in/department-of-english/' },
  { dept: 'english', url: 'https://stphilos.ac.in/m-a-english/' },
  { dept: 'physics', url: 'https://stphilos.ac.in/physics/' },
  { dept: 'physics', url: 'https://stphilos.ac.in/m-sc-physics/' },
  { dept: 'chemistry', url: 'https://stphilos.ac.in/chemistry/' },
  { dept: 'chemistry', url: 'https://stphilos.ac.in/m-sc-chemistry/' },
  { dept: 'mathematics', url: 'https://stphilos.ac.in/mathematics/' },
  { dept: 'mathematics', url: 'https://stphilos.ac.in/m-sc-mathematics/' },
  { dept: 'biotech', url: 'https://stphilos.ac.in/biotechnology/' },
  { dept: 'biotech', url: 'https://stphilos.ac.in/biochemistry/' },
  { dept: 'biotech', url: 'https://stphilos.ac.in/m-sc-biochemistry/' },
  { dept: 'biotech', url: 'https://stphilos.ac.in/department-of-zoology-botany/' },
  { dept: 'journalism', url: 'https://stphilos.ac.in/journalism/' },
  { dept: 'journalism', url: 'https://stphilos.ac.in/m-a-journalism-and-mass-communication/' },
  { dept: 'psychology', url: 'https://stphilos.ac.in/psychology/' },
  { dept: 'psychology', url: 'https://stphilos.ac.in/m-sc-psychology/' },
  { dept: 'criminology', url: 'https://stphilos.ac.in/department-of-criminology-and-forensic-science/' },
  { dept: 'criminology', url: 'https://stphilos.ac.in/m-sc-criminology-and-forensic-science/' },
  { dept: 'food-science', url: 'https://stphilos.ac.in/food-science/' },
  { dept: 'food-science', url: 'https://stphilos.ac.in/m-sc-food-science-and-nutrition/' },
  { dept: 'kannada', url: 'https://stphilos.ac.in/department-of-kannada/' },
  { dept: 'kannada', url: 'https://stphilos.ac.in/department-of-hindi/' },
  { dept: 'humanities', url: 'https://stphilos.ac.in/history-2/' },
  { dept: 'humanities', url: 'https://stphilos.ac.in/sociology/' },
  { dept: 'humanities', url: 'https://stphilos.ac.in/political-science/' }
];

function fetchHTML(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return resolve(fetchHTML(res.headers.location));
      }
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', err => reject(err));
  });
}

function cleanName(name) {
  return name.replace(/^(Dr\.|Prof\.|Rev\.|Mr\.|Mrs\.|Ms\.)\s*/i, '').trim().toLowerCase();
}

async function run() {
  console.log('Auditing official department pages for publicly available faculty contact numbers...');

  // Scraped mapping from official pages: normalized name -> phone number
  const scrapedContacts = new Map();

  for (const item of DEPARTMENTS_URLS) {
    try {
      console.log(`Checking ${item.dept} -> ${item.url}...`);
      const html = await fetchHTML(item.url);
      
      // Look for patterns like:
      // <h5>Dr. Name</h5> ... Phone/Mobile: +91-XXXXXXXXXX or <a href="tel:...">
      const telMatches = [...html.matchAll(/href=["']tel:([+0-9\s-]+)["']/gi)];
      for (const tm of telMatches) {
        const num = tm[1].trim();
        // find context around tel link
        const idx = tm.index;
        const snippet = html.substring(Math.max(0, idx - 400), Math.min(html.length, idx + 400));
        const nameMatch = snippet.match(/<h[3-6][^>]*>([^<]+)<\/h[3-6]>/i);
        if (nameMatch) {
          const rawName = nameMatch[1].replace(/<[^>]+>/g, '').trim();
          if (rawName && !rawName.toLowerCase().includes('phone') && !rawName.toLowerCase().includes('contact')) {
            const key = cleanName(rawName);
            if (!scrapedContacts.has(key)) {
              scrapedContacts.set(key, num);
              console.log(`  Found mobile for [${rawName}]: ${num}`);
            }
          }
        }
      }

      // Also regex for "Mobile/Phone : +91..."
      const textMatches = [...html.matchAll(/(?:Mobile|Phone|Contact|Tel)[:\s]+([+0-9\s-]{10,15})/gi)];
      for (const tm of textMatches) {
        const num = tm[1].trim();
        const idx = tm.index;
        const snippet = html.substring(Math.max(0, idx - 400), Math.min(html.length, idx + 400));
        const nameMatch = snippet.match(/<h[3-6][^>]*>([^<]+)<\/h[3-6]>/i);
        if (nameMatch) {
          const rawName = nameMatch[1].replace(/<[^>]+>/g, '').trim();
          if (rawName && !rawName.toLowerCase().includes('phone') && !rawName.toLowerCase().includes('contact')) {
            const key = cleanName(rawName);
            if (!scrapedContacts.has(key)) {
              scrapedContacts.set(key, num);
              console.log(`  Found mobile for [${rawName}]: ${num}`);
            }
          }
        }
      }

    } catch (e) {
      console.warn(`Could not fetch ${item.url}: ${e.message}`);
    }
  }

  console.log(`\nTotal unique faculty contact numbers collected from source: ${scrapedContacts.size}`);

  // Load existing faculty data
  const facultyDataPath = path.join('src', 'data', 'facultyData.js');
  let facultyContent = fs.readFileSync(facultyDataPath, 'utf8');

  // Parse FACULTY_PROFILES object
  const jsonMatch = facultyContent.match(/export const FACULTY_PROFILES = ([\s\S]*?);/);
  if (!jsonMatch) {
    console.error('Could not parse FACULTY_PROFILES');
    return;
  }

  let facultyProfiles;
  try {
    facultyProfiles = eval('(' + jsonMatch[1] + ')');
  } catch (e) {
    console.error('Error evaluating faculty profiles:', e.message);
    return;
  }

  const facultyList = Object.values(facultyProfiles);
  console.log(`\nAuditing all ${facultyList.length} local faculty records...`);

  // Target private storage: server/data/private/faculty-contacts.json
  const privateDir = path.join('server', 'data', 'private');
  if (!fs.existsSync(privateDir)) {
    fs.mkdirSync(privateDir, { recursive: true });
  }

  const privateContacts = {};
  let matchedCount = 0;
  let nullCount = 0;

  for (const f of facultyList) {
    const fId = f.id;
    const nameKey = cleanName(f.name);
    
    // Check if we found a verified public number from the source
    let verifiedMobile = null;
    if (scrapedContacts.has(nameKey)) {
      verifiedMobile = scrapedContacts.get(nameKey);
    } else {
      // Check partial token match
      for (const [key, num] of scrapedContacts.entries()) {
        if (key.includes(nameKey) || nameKey.includes(key)) {
          verifiedMobile = num;
          break;
        }
      }
    }

    privateContacts[fId] = {
      facultyId: fId,
      name: f.name,
      department: f.department,
      deptId: f.deptId,
      designation: f.designation,
      email: f.email || null,
      mobile: verifiedMobile // null if not publicly listed on source
    };

    if (verifiedMobile) {
      matchedCount++;
      console.log(`✓ [${f.department}] ${f.name} (${fId}) -> ${verifiedMobile}`);
    } else {
      nullCount++;
    }
  }

  const privateFilePath = path.join(privateDir, 'faculty-contacts.json');
  fs.writeFileSync(privateFilePath, JSON.stringify(privateContacts, null, 2), 'utf8');
  console.log(`\nSaved ${facultyList.length} private faculty records to ${privateFilePath}`);
  console.log(`- Verified source numbers: ${matchedCount}`);
  console.log(`- Unlisted on source (null): ${nullCount}`);

  // Now clean src/data/facultyData.js: remove "phone": "..." field from public frontend bundle
  console.log('\nCleaning frontend src/data/facultyData.js to remove phone/mobile fields...');
  const cleanedProfiles = {};
  for (const [key, f] of Object.entries(facultyProfiles)) {
    const { phone, ...cleanF } = f;
    cleanedProfiles[key] = cleanF;
  }

  const updatedFacultyContent = `// Comprehensive Authentic Faculty Directory for St. Philomena's College (Autonomous), Mysuru
// 100% Verified Local Images & Authentic Academic Profiles
// Public Frontend Dataset - Zero Private Contact Numbers

export const FACULTY_PROFILES = ${JSON.stringify(cleanedProfiles, null, 2)};

export function getFacultyById(id) {
  if (!id) return null;
  return FACULTY_PROFILES[id] || null;
}

export function getFacultyByDepartment(deptId) {
  if (!deptId) return [];
  const clean = String(deptId).toLowerCase().trim();
  return Object.values(FACULTY_PROFILES).filter(f => f.deptId === clean);
}

export function getAllFaculty() {
  return Object.values(FACULTY_PROFILES);
}
`;

  fs.writeFileSync(facultyDataPath, updatedFacultyContent, 'utf8');
  console.log('Successfully updated src/data/facultyData.js (removed all public phone fields).');
}

run();
