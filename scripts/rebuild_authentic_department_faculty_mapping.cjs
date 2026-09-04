const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'media.json'), 'utf8'));

const mediaById = new Map(media.map(m => [m.id, m]));
const mediaByUrl = new Map();
for (const m of media) {
  if (m.source_url) {
    mediaByUrl.set(m.source_url, m);
    mediaByUrl.set(m.source_url.toLowerCase(), m);
  }
}

function cleanText(html) {
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

// 1. Department Page Mapping
// Map official WordPress page slugs to our canonical departmentId
const DEPT_PAGE_SLUG_MAP = {
  // Computer Science & Applications
  'bca': 'dept-computer-science',
  'department-of-computer-science': 'dept-computer-science',
  'computer-science': 'dept-computer-science',
  'mca': 'dept-computer-science',
  'm-sc-computer-science': 'dept-computer-science',

  // Physics
  'physics': 'dept-physics',
  'department-of-physics': 'dept-physics',
  'm-sc-physics': 'dept-physics',

  // Chemistry
  'chemistry': 'dept-chemistry',
  'department-of-chemistry': 'dept-chemistry',
  'm-sc-chemistry': 'dept-chemistry',

  // Mathematics
  'mathematics': 'dept-mathematics',
  'department-of-mathematics': 'dept-mathematics',
  'm-sc-mathematics': 'dept-mathematics',

  // Biochemistry
  'biochemistry': 'dept-biochemistry',
  'department-of-biochemistry': 'dept-biochemistry',
  'm-sc-biochemistry': 'dept-biochemistry',

  // Biotechnology
  'biotechnology': 'dept-biotechnology',
  'department-of-biotechnology': 'dept-biotechnology',
  'm-sc-biotechnology': 'dept-biotechnology',

  // Microbiology
  'microbiology': 'dept-microbiology',
  'department-of-microbiology': 'dept-microbiology',

  // Botany & Zoology
  'botany': 'dept-botany-zoology',
  'zoology': 'dept-botany-zoology',
  'department-of-botany-and-zoology': 'dept-botany-zoology',

  // Food Science & Nutrition
  'post-graduation-department-of-food-science-and-nutrition': 'dept-food-science',
  'food-science-and-nutrition': 'dept-food-science',

  // Psychology
  'dept-of-m-sc-psychology': 'dept-psychology',
  'psychology': 'dept-psychology',
  'department-of-psychology': 'dept-psychology',

  // Environmental Science
  'department-of-environmental-science': 'dept-environmental-science',
  'environmental-science': 'dept-environmental-science',
  'environmental-science-2': 'dept-environmental-science',

  // Criminology & Forensic Science
  'department-of-criminology-and-forensic-science': 'dept-criminology',
  'criminology': 'dept-criminology',

  // Management (BBA / MBA)
  'bba': 'dept-management',
  'department-of-business-administration': 'dept-management',
  'mba': 'dept-management',
  'bba-tourism-and-hospitality-management': 'dept-management',

  // Commerce (B.Com / M.Com)
  'bcom': 'dept-commerce',
  'department-of-commerce': 'dept-commerce',
  'mcom': 'dept-commerce',
  'm-com': 'dept-commerce',

  // Social Work (BSW / MSW)
  'bsw': 'dept-social-work',
  'msw': 'dept-social-work',
  'department-of-social-work': 'dept-social-work',

  // Economics
  'department-of-economics': 'dept-economics',
  'economics': 'dept-economics',
  'm-a-economics': 'dept-economics',

  // English
  'english': 'dept-english',
  'department-of-english': 'dept-english',
  'm-a-english': 'dept-english',

  // Journalism & Mass Communication
  'm-a-mass-communication-journalism': 'dept-journalism',
  'department-of-journalism-and-mass-communication': 'dept-journalism',
  'journalism': 'dept-journalism',

  // Sociology
  'department-of-sociology': 'dept-sociology',
  'sociology': 'dept-sociology',

  // History
  'department-of-history': 'dept-history',
  'history': 'dept-history',

  // Political Science
  'department-of-political-science': 'dept-political-science',
  'political-science': 'dept-political-science',

  // Languages
  'kannada': 'dept-languages',
  'hindi': 'dept-languages',
  'department-of-kannada': 'dept-languages',
  'department-of-hindi': 'dept-languages',
  'christianity': 'dept-languages',
  'department-of-christianity': 'dept-languages',

  // Vocational Studies
  'b-voc': 'dept-vocational-studies',
  'bvoc': 'dept-vocational-studies'
};

const allWPItems = [...pages, ...posts];

// Set of invalid names / titles to filter out (non-faculty scraped content)
const INVALID_NAME_PATTERNS = [
  /^(?:Qualification|Delegate|Designation|Position|Department|College|Faculty|Staff|Sl\.?\s*No|Name|Photo|Image|Contact|Email|Phone|Mobile|Phone\s*No|Syllabus|Curriculum|About|Overview|Report|Notice|Schedule|Circular|Timetable|Exam|Feedback|Alumni|Parents|Students|Meeting|Talk|Workshop|Conference|Webinar|Seminar|Inauguration|Celebration|Industrial\s*Visit|Session|FDP|IQAC|NSS|NCC|YRC|Beary|Kannada\s*Rajyotsava|Manthan|Incredema|Flea\s*Market|Leadership\s*and\s*Skill|St\.?\s*Philomena|Autonomous|University\s*of\s*Mysore)$/i,
  /workshop|conference|seminar|programme|programme\s*for|symposium|celebration|exhibition|competition|tournament|match|championship|tournament|orientation|training|valedictory|felicitation|convocation|webinar|feedback|board\s*of\s*studies|academic\s*council/i
];

function isGenuineFacultyName(name) {
  if (!name || typeof name !== 'string') return false;
  const trimmed = name.trim();
  if (trimmed.length < 3 || trimmed.length > 50) return false;
  for (const pattern of INVALID_NAME_PATTERNS) {
    if (pattern.test(trimmed)) return false;
  }
  // Must contain letters and usually a honorific or normal name structure
  if (!/^[a-zA-Z\s.'’–-]+$/.test(trimmed)) return false;
  return true;
}

const authenticFacultyMap = new Map();

for (const item of allWPItems) {
  const slug = (item.slug || '').toLowerCase();
  const content = item.content?.rendered || '';
  const title = cleanText(item.title?.rendered);

  // Check if this page maps directly to a known department
  const deptId = DEPT_PAGE_SLUG_MAP[slug];

  if (deptId && content.length > 100) {
    // 1. Check for table rows in the department page
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rMatch;
    while ((rMatch = rowRegex.exec(content)) !== null) {
      const rowHtml = rMatch[1];
      const textCols = rowHtml.split(/<\/td>|<\/th>/i).map(cleanText).filter(Boolean);
      
      // Look for faculty name in columns
      for (let i = 0; i < textCols.length; i++) {
        const col = textCols[i];
        if (isGenuineFacultyName(col) && (col.startsWith('Dr') || col.startsWith('Mr') || col.startsWith('Mrs') || col.startsWith('Ms') || col.startsWith('Prof') || col.startsWith('Rev') || i > 0)) {
          // Found possible faculty name
          const name = col;
          let designation = textCols.find(c => /Professor|Lecturer|Head|HOD|Reader|Instructor|Faculty/i.test(c)) || 'Assistant Professor';
          let qualification = textCols.find(c => /Ph\.?D|M\.?Sc|M\.?A|MCA|MBA|M\.?Com|NET|KSET|SLET|M\.?Phil|B\.?Ed/i.test(c)) || 'Faculty Member';

          // Look for image in this row
          const imgMatch = rowHtml.match(/<img[^>]+src="([^">]+)"/i);
          let photoUrl = imgMatch ? imgMatch[1] : null;

          const facKey = name.toLowerCase().replace(/[^a-z]/g, '');
          if (facKey.length > 3 && !authenticFacultyMap.has(facKey)) {
            authenticFacultyMap.set(facKey, {
              name,
              designation,
              qualification,
              departmentId: deptId,
              photoUrl,
              officialProfileUrl: item.link
            });
          }
        }
      }
    }
  }

  // 2. Check individual faculty profile pages
  if (/^(?:dr|mr|mrs|ms|prof|rev)[-.]/i.test(slug) && isGenuineFacultyName(title)) {
    let matchedDept = null;
    for (const [pageSlug, mappedDeptId] of Object.entries(DEPT_PAGE_SLUG_MAP)) {
      if (new RegExp(pageSlug.replace(/-/g, '[-\\s]'), 'i').test(`${content} ${slug}`)) {
        matchedDept = mappedDeptId;
        break;
      }
    }

    if (matchedDept) {
      const facKey = title.toLowerCase().replace(/[^a-z]/g, '');
      let designation = 'Assistant Professor';
      const desMatch = content.match(/(?:Designation|Position)[:\s]+([^\n<]+)/i) ||
                       content.match(/(Head of the Department|Associate Professor|Assistant Professor|Professor|Lecturer)/i);
      if (desMatch) designation = cleanText(desMatch[1] || desMatch[0]);

      let qualification = 'M.Sc / M.A';
      const qualMatch = content.match(/(?:Qualification|Degrees)[:\s]+([^\n<]+)/i) ||
                        content.match(/(Ph\.?D\.?|M\.?Phil\.?|M\.?Sc\.?|M\.?A\.?|M\.?Com\.?|MCA|MBA|NET|KSET)/i);
      if (qualMatch) qualification = cleanText(qualMatch[1] || qualMatch[0]);

      let photoUrl = null;
      if (item.featured_media && mediaById.has(item.featured_media)) {
        photoUrl = mediaById.get(item.featured_media).source_url;
      }
      if (!photoUrl) {
        const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
        if (imgMatch) photoUrl = imgMatch[1];
      }

      if (!authenticFacultyMap.has(facKey)) {
        authenticFacultyMap.set(facKey, {
          name: title,
          designation,
          qualification,
          departmentId: matchedDept,
          photoUrl,
          officialProfileUrl: item.link
        });
      }
    }
  }
}

console.log(`Extracted ${authenticFacultyMap.size} genuine authentic faculty members distributed across departments.`);

// Convert to final faculty array
const finalFacultyList = [];
const depts = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'departments.json'), 'utf8'));

for (const [facKey, fac] of authenticFacultyMap.entries()) {
  let localPhoto = null;
  let photoVerified = false;

  if (fac.photoUrl) {
    const ext = path.extname(fac.photoUrl.split('?')[0]) || '.jpg';
    const safeName = `fac_${facKey.substring(0, 25)}`;
    const relLocal = `/media/faculty/${safeName}${ext}`;
    const absLocal = path.join(ROOT_DIR, 'public', relLocal.substring(1));

    if (fs.existsSync(absLocal) && fs.statSync(absLocal).size > 0) {
      localPhoto = relLocal;
      photoVerified = true;
    }
  }

  finalFacultyList.push({
    id: `fac_${facKey.substring(0, 25)}`,
    name: fac.name,
    designation: fac.designation,
    qualification: fac.qualification,
    departmentId: fac.departmentId,
    officialProfileUrl: fac.officialProfileUrl || 'https://stphilos.ac.in/',
    photoUrl: localPhoto,
    photoVerified: photoVerified,
    bio: `${fac.name} is an esteemed ${fac.designation} in the ${depts.find(d => d.id === fac.departmentId)?.name || 'Department'}.`
  });
}

// Re-seed hierarchy and faculty data
const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
hierarchy.faculty = finalFacultyList;

fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(finalFacultyList, null, 2));

console.log('=== DISTRIBUTION AFTER REBUILD ===');
const deptCounts = {};
depts.forEach(d => deptCounts[d.id] = 0);
finalFacultyList.forEach(f => {
  deptCounts[f.departmentId] = (deptCounts[f.departmentId] || 0) + 1;
});

for (const [deptId, count] of Object.entries(deptCounts)) {
  const d = depts.find(x => x.id === deptId);
  console.log(` - [${deptId}] ${d?.name || deptId}: ${count} faculty members`);
}
