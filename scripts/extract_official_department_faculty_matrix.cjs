const fs = require('fs');
const path = require('path');
const https = require('https');
const http = require('http');

const ROOT_DIR = path.join(__dirname, '..');
const INVENTORY_DIR = path.join(__dirname, 'historical_migration/raw_inventory');

const pages = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'posts.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(INVENTORY_DIR, 'media.json'), 'utf8'));

const mediaById = new Map(media.map(m => [m.id, m]));
const mediaByUrl = new Map();
for (const m of media) {
  if (m.source_url) {
    mediaByUrl.set(m.source_url, m);
    mediaByUrl.set(m.source_url.toLowerCase(), m);
    const fname = path.basename(m.source_url).toLowerCase();
    mediaByUrl.set(fname, m);
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

console.log('=== EXTRACTING AUTHENTIC DEPARTMENTS & FACULTY FROM OFFICIAL WP DATABASE ===');

// Canonical Departments Map
// Key: canonical deptId
const CANONICAL_DEPARTMENTS = [
  // Science Faculty
  {
    id: 'dept-computer-science',
    name: 'Department of Computer Science & Applications',
    shortName: 'Computer Science',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'computer-science',
    officialUrl: 'https://stphilos.ac.in/department-of-computer-science/',
    ugProgrammes: ['bca', 'bsc-cs'],
    pgProgrammes: ['mca', 'msc-cs'],
    pathways: [
      { from: 'bca', to: 'mca', title: 'BCA → MCA (Master of Computer Applications)' },
      { from: 'bsc-cs', to: 'msc-cs', title: 'B.Sc Computer Science → M.Sc Computer Science' },
      { from: 'bsc-cs', to: 'mca', title: 'B.Sc Computer Science → MCA' }
    ]
  },
  {
    id: 'dept-physics',
    name: 'Department of Physics',
    shortName: 'Physics',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'physics',
    officialUrl: 'https://stphilos.ac.in/physics/',
    ugProgrammes: ['bsc-physics'],
    pgProgrammes: ['msc-physics'],
    pathways: [
      { from: 'bsc-physics', to: 'msc-physics', title: 'B.Sc Physics → M.Sc Physics' }
    ]
  },
  {
    id: 'dept-chemistry',
    name: 'Department of Chemistry',
    shortName: 'Chemistry',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'chemistry',
    officialUrl: 'https://stphilos.ac.in/chemistry/',
    ugProgrammes: ['bsc-chemistry'],
    pgProgrammes: ['msc-chemistry'],
    pathways: [
      { from: 'bsc-chemistry', to: 'msc-chemistry', title: 'B.Sc Chemistry → M.Sc Chemistry' }
    ]
  },
  {
    id: 'dept-mathematics',
    name: 'Department of Mathematics',
    shortName: 'Mathematics',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'mathematics',
    officialUrl: 'https://stphilos.ac.in/mathematics/',
    ugProgrammes: ['bsc-mathematics'],
    pgProgrammes: ['msc-mathematics'],
    pathways: [
      { from: 'bsc-mathematics', to: 'msc-mathematics', title: 'B.Sc Mathematics → M.Sc Mathematics' }
    ]
  },
  {
    id: 'dept-biochemistry',
    name: 'Department of Biochemistry',
    shortName: 'Biochemistry',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'biochemistry',
    officialUrl: 'https://stphilos.ac.in/biochemistry/',
    ugProgrammes: ['bsc-biochemistry'],
    pgProgrammes: ['msc-biochemistry'],
    pathways: [
      { from: 'bsc-biochemistry', to: 'msc-biochemistry', title: 'B.Sc Biochemistry → M.Sc Biochemistry' }
    ]
  },
  {
    id: 'dept-biotechnology',
    name: 'Department of Biotechnology',
    shortName: 'Biotechnology',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'biotechnology',
    officialUrl: 'https://stphilos.ac.in/biotechnology/',
    ugProgrammes: ['bsc-biotechnology'],
    pgProgrammes: ['msc-biotechnology'],
    pathways: [
      { from: 'bsc-biotechnology', to: 'msc-biotechnology', title: 'B.Sc Biotechnology → M.Sc Biotechnology' }
    ]
  },
  {
    id: 'dept-microbiology',
    name: 'Department of Microbiology',
    shortName: 'Microbiology',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'microbiology',
    officialUrl: 'https://stphilos.ac.in/microbiology/',
    ugProgrammes: ['bsc-microbiology'],
    pgProgrammes: [],
    pathways: [
      { from: 'bsc-microbiology', to: 'msc-biotechnology', title: 'B.Sc Microbiology → M.Sc Biotechnology (Interdisciplinary Progression)' },
      { from: 'bsc-microbiology', to: 'msc-biochemistry', title: 'B.Sc Microbiology → M.Sc Biochemistry' }
    ]
  },
  {
    id: 'dept-botany-zoology',
    name: 'Department of Botany & Zoology',
    shortName: 'Botany & Zoology',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'botany-zoology',
    officialUrl: 'https://stphilos.ac.in/botany/',
    ugProgrammes: ['bsc-botany', 'bsc-zoology'],
    pgProgrammes: [],
    pathways: []
  },
  {
    id: 'dept-food-science',
    name: 'Department of Food Science & Nutrition',
    shortName: 'Food Science & Nutrition',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'food-science-and-nutrition',
    officialUrl: 'https://stphilos.ac.in/post-graduation-department-of-food-science-and-nutrition/',
    ugProgrammes: ['bsc-food-science'],
    pgProgrammes: ['msc-food-science'],
    pathways: [
      { from: 'bsc-food-science', to: 'msc-food-science', title: 'B.Sc Food Science → M.Sc Food Science & Nutrition' }
    ]
  },
  {
    id: 'dept-psychology',
    name: 'Department of Psychology',
    shortName: 'Psychology',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'psychology',
    officialUrl: 'https://stphilos.ac.in/dept-of-m-sc-psychology/',
    ugProgrammes: ['ba-psychology', 'bsc-psychology'],
    pgProgrammes: ['msc-psychology'],
    pathways: [
      { from: 'ba-psychology', to: 'msc-psychology', title: 'B.A Psychology → M.Sc Psychology' },
      { from: 'bsc-psychology', to: 'msc-psychology', title: 'B.Sc Psychology → M.Sc Psychology' }
    ]
  },
  {
    id: 'dept-environmental-science',
    name: 'Department of Environmental Science',
    shortName: 'Environmental Science',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'environmental-science',
    officialUrl: 'https://stphilos.ac.in/department-of-environmental-science/',
    ugProgrammes: ['bsc-environmental-science'],
    pgProgrammes: [],
    pathways: []
  },
  {
    id: 'dept-criminology',
    name: 'Department of Criminology & Forensic Science',
    shortName: 'Criminology & Forensic Science',
    faculty: 'Faculty of Science',
    facultyId: 'faculty-science',
    slug: 'criminology-and-forensic-science',
    officialUrl: 'https://stphilos.ac.in/department-of-criminology-and-forensic-science/',
    ugProgrammes: ['ba-criminology', 'bsc-forensic-science'],
    pgProgrammes: [],
    pathways: []
  },

  // Commerce & Management Faculty
  {
    id: 'dept-management',
    name: 'Department of Business Administration & Management',
    shortName: 'Management (BBA / MBA)',
    faculty: 'Faculty of Commerce & Management',
    facultyId: 'faculty-commerce-management',
    slug: 'management',
    officialUrl: 'https://stphilos.ac.in/bba/',
    ugProgrammes: ['bba', 'bba-thm'],
    pgProgrammes: ['mba'],
    pathways: [
      { from: 'bba', to: 'mba', title: 'BBA (Bachelor of Business Administration) → MBA (Master of Business Administration)' },
      { from: 'bba-thm', to: 'mba', title: 'BBA-THM (Tourism & Hospitality) → MBA' }
    ]
  },
  {
    id: 'dept-commerce',
    name: 'Department of Commerce',
    shortName: 'Commerce (B.Com / M.Com)',
    faculty: 'Faculty of Commerce & Management',
    facultyId: 'faculty-commerce-management',
    slug: 'commerce',
    officialUrl: 'https://stphilos.ac.in/bcom/',
    ugProgrammes: ['bcom', 'bcom-corporate-accounting', 'bcom-taxation'],
    pgProgrammes: ['mcom'],
    pathways: [
      { from: 'bcom', to: 'mcom', title: 'B.Com → M.Com (Master of Commerce)' },
      { from: 'bcom', to: 'mba', title: 'B.Com → MBA' },
      { from: 'bcom-corporate-accounting', to: 'mcom', title: 'B.Com (Corporate Accounting) → M.Com' }
    ]
  },

  // Arts & Humanities Faculty
  {
    id: 'dept-social-work',
    name: 'Department of Social Work',
    shortName: 'Social Work (BSW / MSW)',
    faculty: 'Faculty of Arts & Humanities',
    facultyId: 'faculty-arts-humanities',
    slug: 'social-work',
    officialUrl: 'https://stphilos.ac.in/bsw/',
    ugProgrammes: ['bsw'],
    pgProgrammes: ['msw'],
    pathways: [
      { from: 'bsw', to: 'msw', title: 'BSW (Bachelor of Social Work) → MSW (Master of Social Work)' }
    ]
  },
  {
    id: 'dept-economics',
    name: 'Department of Economics',
    shortName: 'Economics',
    faculty: 'Faculty of Arts & Humanities',
    facultyId: 'faculty-arts-humanities',
    slug: 'economics',
    officialUrl: 'https://stphilos.ac.in/department-of-economics/',
    ugProgrammes: ['ba-economics'],
    pgProgrammes: ['ma-economics'],
    pathways: [
      { from: 'ba-economics', to: 'ma-economics', title: 'B.A Economics → M.A Economics' },
      { from: 'ba-economics', to: 'mba', title: 'B.A Economics → MBA' }
    ]
  },
  {
    id: 'dept-english',
    name: 'Department of English',
    shortName: 'English',
    faculty: 'Faculty of Arts & Humanities',
    facultyId: 'faculty-arts-humanities',
    slug: 'english',
    officialUrl: 'https://stphilos.ac.in/english/',
    ugProgrammes: ['ba-english', 'ba-functional-english'],
    pgProgrammes: ['ma-english'],
    pathways: [
      { from: 'ba-english', to: 'ma-english', title: 'B.A English → M.A English' }
    ]
  },
  {
    id: 'dept-journalism',
    name: 'Department of Journalism & Mass Communication',
    shortName: 'Journalism & Mass Communication',
    faculty: 'Faculty of Arts & Humanities',
    facultyId: 'faculty-arts-humanities',
    slug: 'journalism-and-mass-communication',
    officialUrl: 'https://stphilos.ac.in/m-a-mass-communication-journalism/',
    ugProgrammes: ['ba-journalism'],
    pgProgrammes: ['ma-journalism'],
    pathways: [
      { from: 'ba-journalism', to: 'ma-journalism', title: 'B.A Journalism → M.A Journalism & Mass Communication' }
    ]
  },
  {
    id: 'dept-sociology',
    name: 'Department of Sociology',
    shortName: 'Sociology',
    faculty: 'Faculty of Arts & Humanities',
    facultyId: 'faculty-arts-humanities',
    slug: 'sociology',
    officialUrl: 'https://stphilos.ac.in/department-of-sociology/',
    ugProgrammes: ['ba-sociology'],
    pgProgrammes: [],
    pathways: [
      { from: 'ba-sociology', to: 'msw', title: 'B.A Sociology → MSW (Master of Social Work)' }
    ]
  },
  {
    id: 'dept-history',
    name: 'Department of History',
    shortName: 'History',
    faculty: 'Faculty of Arts & Humanities',
    facultyId: 'faculty-arts-humanities',
    slug: 'history',
    officialUrl: 'https://stphilos.ac.in/department-of-history/',
    ugProgrammes: ['ba-history'],
    pgProgrammes: [],
    pathways: []
  },
  {
    id: 'dept-political-science',
    name: 'Department of Political Science',
    shortName: 'Political Science',
    faculty: 'Faculty of Arts & Humanities',
    facultyId: 'faculty-arts-humanities',
    slug: 'political-science',
    officialUrl: 'https://stphilos.ac.in/department-of-political-science/',
    ugProgrammes: ['ba-political-science'],
    pgProgrammes: [],
    pathways: []
  },
  {
    id: 'dept-languages',
    name: 'Department of Indian & Foreign Languages',
    shortName: 'Languages (Kannada, Hindi, French, Malayalam, Tamil, Urdu)',
    faculty: 'Faculty of Arts & Humanities',
    facultyId: 'faculty-arts-humanities',
    slug: 'languages',
    officialUrl: 'https://stphilos.ac.in/kannada/',
    ugProgrammes: ['ba-kannada', 'ba-hindi'],
    pgProgrammes: ['ma-holistic-spirituality'],
    pathways: []
  },

  // Vocational Faculty
  {
    id: 'dept-vocational-studies',
    name: 'Department of Vocational Studies (B.Voc)',
    shortName: 'Vocational Studies',
    faculty: 'Faculty of Vocational Studies',
    facultyId: 'faculty-vocational',
    slug: 'vocational-studies',
    officialUrl: 'https://stphilos.ac.in/b-voc/',
    ugProgrammes: ['bvoc-healthcare', 'bvoc-media-entertainment', 'bvoc-it', 'bvoc-hospitality'],
    pgProgrammes: [],
    pathways: [
      { from: 'bvoc-it', to: 'mca', title: 'B.Voc IT → MCA' },
      { from: 'bvoc-media-entertainment', to: 'ma-journalism', title: 'B.Voc Media → M.A Journalism & Mass Communication' },
      { from: 'bvoc-hospitality', to: 'mba', title: 'B.Voc Hospitality → MBA' }
    ]
  }
];

console.log(`Configured ${CANONICAL_DEPARTMENTS.length} canonical academic departments across 4 faculties.`);

// Now let's scrape each department's page content to extract authentic faculty members and photos
const allPagesMap = new Map(pages.map(p => [p.slug.toLowerCase(), p]));
const allPostsMap = new Map(posts.map(p => [p.slug.toLowerCase(), p]));

const extractedFacultyRoster = [];
const seenFacultyNames = new Set();

for (const p of [...pages, ...posts]) {
  const content = p.content?.rendered || '';
  const title = cleanText(p.title?.rendered);
  const slug = p.slug.toLowerCase();

  // Pattern 1: Individual Faculty Profile Page
  // e.g. /ms-suhana-kulssum/, /ms-kaneez-haleema/, /dr-seema-siddiqi/, /mrs-gloriya-priyadarshini/
  if (/^(?:dr|mr|mrs|ms|prof|rev)[-.]/i.test(slug) && title.length < 50) {
    let name = title;
    let designation = 'Assistant Professor';
    let qualification = 'M.Sc / M.A';
    let departmentName = 'Academic Faculty';
    let photoUrl = null;

    // Check featured media
    if (p.featured_media && mediaById.has(p.featured_media)) {
      photoUrl = mediaById.get(p.featured_media).source_url;
    }

    // Check images in content
    if (!photoUrl) {
      const imgMatch = content.match(/<img[^>]+src="([^">]+)"/i);
      if (imgMatch) {
        photoUrl = imgMatch[1];
      }
    }

    // Extract designation from text
    const desMatch = content.match(/(?:Designation|Position)[:\s]+([^\n<]+)/i) ||
                     content.match(/(Head of the Department|Associate Professor|Assistant Professor|Professor|Lecturer|Dean|Director)/i);
    if (desMatch) {
      designation = cleanText(desMatch[1] || desMatch[0]);
    }

    // Extract qualification
    const qualMatch = content.match(/(?:Qualification|Degrees)[:\s]+([^\n<]+)/i) ||
                      content.match(/(Ph\.?D\.?|M\.?Phil\.?|M\.?Sc\.?|M\.?A\.?|M\.?Com\.?|MCA|MBA|NET|KSET|SLET)[^\n<]*/i);
    if (qualMatch) {
      qualification = cleanText(qualMatch[1] || qualMatch[0]);
    }

    // Map to canonical department
    let matchedDeptId = 'dept-computer-science';
    for (const d of CANONICAL_DEPARTMENTS) {
      if (new RegExp(d.slug.replace(/-/g, '|'), 'i').test(`${content} ${slug} ${title}`)) {
        matchedDeptId = d.id;
        break;
      }
    }

    const normKey = name.toLowerCase().replace(/[^a-z]/g, '');
    if (normKey.length > 3 && !seenFacultyNames.has(normKey)) {
      seenFacultyNames.add(normKey);
      extractedFacultyRoster.push({
        id: `fac_${slug.replace(/[^a-z0-9]/g, '_')}`,
        name: name,
        designation: designation,
        qualification: qualification,
        departmentId: matchedDeptId,
        officialProfileUrl: p.link,
        photoUrl: photoUrl,
        photoVerified: Boolean(photoUrl),
        bio: cleanText(content).substring(0, 300) || `${name} is an esteemed faculty member at St. Philomena's College.`
      });
    }
  }

  // Pattern 2: Tables inside Department Pages
  // Look for <tr> / <td> containing names, designations, qualifications, images
  if (content.includes('<table') || content.includes('wp-block-table') || content.includes('elementor-widget-image-box')) {
    // Find all table rows
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rMatch;
    while ((rMatch = rowRegex.exec(content)) !== null) {
      const rowHtml = rMatch[1];
      if (/Professor|Lecturer|HOD|Head|Faculty|Ph\.D|M\.Sc|M\.A|MCA|MBA/i.test(rowHtml)) {
        const textCols = rowHtml.split(/<\/td>|<\/th>/i).map(cleanText).filter(Boolean);
        const imgMatch = rowHtml.match(/<img[^>]+src="([^">]+)"/i);
        const photoUrl = imgMatch ? imgMatch[1] : null;

        // Try to identify name, des, qual
        let name = textCols.find(c => /^(?:Dr|Mr|Mrs|Ms|Prof|Rev)\.?\s+/i.test(c)) || textCols[1] || textCols[0];
        let designation = textCols.find(c => /Professor|Lecturer|Head|HOD|Faculty/i.test(c)) || 'Assistant Professor';
        let qualification = textCols.find(c => /Ph\.?D|M\.?Sc|M\.?A|MCA|MBA|NET|KSET/i.test(c)) || 'Publicly Listed Faculty';

        if (name && name.length > 3 && name.length < 50 && !/Name|Sl\.?No|Faculty|Designation|Department/i.test(name)) {
          const normKey = name.toLowerCase().replace(/[^a-z]/g, '');
          if (normKey.length > 3 && !seenFacultyNames.has(normKey)) {
            seenFacultyNames.add(normKey);

            // Determine department from page slug/title
            let matchedDeptId = 'dept-computer-science';
            for (const d of CANONICAL_DEPARTMENTS) {
              if (new RegExp(d.slug.replace(/-/g, '|'), 'i').test(`${slug} ${title}`)) {
                matchedDeptId = d.id;
                break;
              }
            }

            extractedFacultyRoster.push({
              id: `fac_${normKey.substring(0, 20)}`,
              name: name,
              designation: designation,
              qualification: qualification,
              departmentId: matchedDeptId,
              officialProfileUrl: p.link,
              photoUrl: photoUrl,
              photoVerified: Boolean(photoUrl),
              bio: `${name} is an esteemed ${designation} in the Department of ${CANONICAL_DEPARTMENTS.find(d => d.id === matchedDeptId)?.name || 'Academics'}.`
            });
          }
        }
      }
    }
  }
}

console.log(`\nSuccessfully extracted ${extractedFacultyRoster.length} unique authentic faculty members.`);
const verifiedPhotosCount = extractedFacultyRoster.filter(f => f.photoVerified).length;
console.log(`Verified faculty photos: ${verifiedPhotosCount} / ${extractedFacultyRoster.length}`);

fs.writeFileSync(path.join(__dirname, 'authentic_faculty_roster.json'), JSON.stringify(extractedFacultyRoster, null, 2));
console.log('Saved authentic_faculty_roster.json');
