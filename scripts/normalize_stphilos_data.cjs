/**
 * Comprehensive Normalizer for St. Philomena's College Academic Data
 * Parses raw scraped WordPress pages and generates the 100% canonical relational dataset.
 */
const fs = require('fs');
const path = require('path');

const RAW_DIR = path.resolve(__dirname, 'stphilos_raw');
const PAGES_DIR = path.join(RAW_DIR, 'pages');
const MANIFESTS_DIR = path.join(RAW_DIR, 'manifests');
const DATA_DIR = path.resolve(__dirname, '../src/data');
const PUBLIC_DIR = path.resolve(__dirname, '../public');

// HTML text helper
function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '')
    .replace(/<br\s*[\/]?>/gi, '\n')
    .replace(/<\/p>/gi, '\n\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#8211;/g, '–')
    .replace(/&#8217;/g, "'")
    .replace(/&#8216;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseCvTables(html) {
  const cvData = {
    qualifications: [],
    teachingExperience: [],
    researchExperience: [],
    administrativeExperience: [],
    specialization: [],
    researchInterests: [],
    publications: [],
    journalPublications: [],
    books: [],
    conferencePresentations: [],
    seminarsAttended: [],
    workshops: [],
    fdps: [],
    awards: [],
    resourcePerson: [],
    researchProjects: [],
    professionalMemberships: [],
    contact: {}
  };

  if (!html) return cvData;

  // Extract contact info
  const emailMatch = html.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/i);
  if (emailMatch) cvData.contact.email = emailMatch[1];

  const phoneMatch = html.match(/(?:\+91[\s-]?)?[6-9]\d{9}/);
  if (phoneMatch) cvData.contact.phone = phoneMatch[0];

  // Extract tables
  const tableRegex = /<table[^>]*>([\s\S]*?)<\/table>/gi;
  let tableMatch;
  while ((tableMatch = tableRegex.exec(html)) !== null) {
    const tableHtml = tableMatch[1];
    const rows = [];
    const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
    let rowMatch;
    while ((rowMatch = rowRegex.exec(tableHtml)) !== null) {
      const cells = [];
      const cellRegex = /<t[dh][^>]*>([\s\S]*?)<\/t[dh]>/gi;
      let cellMatch;
      while ((cellMatch = cellRegex.exec(rowMatch[1])) !== null) {
        cells.push(cleanHtml(cellMatch[1]));
      }
      if (cells.length > 0) rows.push(cells);
    }

    if (rows.length === 0) continue;

    const firstRowText = rows[0].join(' ').toLowerCase();

    // Check table type
    if (firstRowText.includes('degree') || firstRowText.includes('qualification') || firstRowText.includes('course')) {
      for (let r = 1; r < rows.length; r++) {
        const rowStr = rows[r].filter(c => c && c.length > 1).join(' - ');
        if (rowStr && !cvData.qualifications.includes(rowStr)) cvData.qualifications.push(rowStr);
      }
    } else if (firstRowText.includes('conference') || firstRowText.includes('paper') || firstRowText.includes('presentation')) {
      for (let r = 1; r < rows.length; r++) {
        const title = rows[r][1] || rows[r][0];
        const conf = rows[r][2] || rows[r][1] || '';
        const dates = rows[r][3] || rows[r][2] || '';
        if (title && title.length > 3) {
          cvData.conferencePresentations.push({ title, conferenceName: conf, dates });
        }
      }
    } else if (firstRowText.includes('seminar') || firstRowText.includes('workshop') || firstRowText.includes('attended')) {
      for (let r = 1; r < rows.length; r++) {
        const title = rows[r][1] || rows[r][0];
        const inst = rows[r][2] || '';
        const dur = rows[r][3] || '';
        if (title && title.length > 3) {
          cvData.seminarsAttended.push({ title, institution: inst, duration: dur });
        }
      }
    } else if (firstRowText.includes('award') || firstRowText.includes('honor') || firstRowText.includes('recognition')) {
      for (let r = 1; r < rows.length; r++) {
        const award = rows[r][1] || rows[r][0];
        const org = rows[r][2] || '';
        if (award && award.length > 3) {
          cvData.awards.push({ award, organization: org });
        }
      }
    } else if (firstRowText.includes('resource') || firstRowText.includes('lecture') || firstRowText.includes('topic')) {
      for (let r = 1; r < rows.length; r++) {
        const topic = rows[r][1] || rows[r][0];
        const inst = rows[r][2] || '';
        const dt = rows[r][3] || '';
        if (topic && topic.length > 3) {
          cvData.resourcePerson.push({ topic, institution: inst, date: dt });
        }
      }
    } else if (firstRowText.includes('journal') || firstRowText.includes('publication') || firstRowText.includes('isbn') || firstRowText.includes('issn')) {
      for (let r = 1; r < rows.length; r++) {
        const title = rows[r][1] || rows[r][0];
        const journal = rows[r][2] || '';
        const year = rows[r][3] || '';
        if (title && title.length > 3) {
          cvData.journalPublications.push({ title, journal, year });
        }
      }
    }
  }

  // Extract list items if tables were not used
  const listRegex = /<ul[^>]*>([\s\S]*?)<\/ul>/gi;
  let listMatch;
  while ((listMatch = listRegex.exec(html)) !== null) {
    const items = [];
    const itemRegex = /<li[^>]*>([\s\S]*?)<\/li>/gi;
    let itemMatch;
    while ((itemMatch = itemRegex.exec(listMatch[1])) !== null) {
      items.push(cleanHtml(itemMatch[1]));
    }
    // Context check
    const preText = html.substring(Math.max(0, listMatch.index - 150), listMatch.index).toLowerCase();
    if (preText.includes('qualification') || preText.includes('education')) {
      items.forEach(it => { if (it.length > 3 && !cvData.qualifications.includes(it)) cvData.qualifications.push(it); });
    } else if (preText.includes('specialization') || preText.includes('area')) {
      items.forEach(it => { if (it.length > 3 && !cvData.specialization.includes(it)) cvData.specialization.push(it); });
    } else if (preText.includes('experience') || preText.includes('teaching')) {
      items.forEach(it => { if (it.length > 3 && !cvData.teachingExperience.includes(it)) cvData.teachingExperience.push(it); });
    } else if (preText.includes('membership') || preText.includes('body')) {
      items.forEach(it => { if (it.length > 3 && !cvData.professionalMemberships.includes(it)) cvData.professionalMemberships.push(it); });
    }
  }

  return cvData;
}

function parseDepartmentContent(html, deptSlug, deptName) {
  const parsed = {
    description: '',
    history: '',
    vision: '',
    mission: '',
    objectives: [],
    facilities: [],
    achievements: [],
    futurePlans: [],
    bannerImage: `/assets/departments/${deptSlug}/banner.jpg`
  };

  if (!html) return parsed;

  const text = cleanHtml(html);

  // Vision
  const visionMatch = html.match(/(?:Vision|Departmental Vision)[\s\S]*?(?:<\/h[1-6]>|<\/strong>)([\s\S]*?)(?:<h[1-6]>|<strong>|Mission|$)/i);
  if (visionMatch) {
    const vClean = cleanHtml(visionMatch[1]);
    if (vClean.length > 15 && vClean.length < 500) parsed.vision = vClean;
  }

  // Mission
  const missionMatch = html.match(/(?:Mission|Departmental Mission)[\s\S]*?(?:<\/h[1-6]>|<\/strong>)([\s\S]*?)(?:<h[1-6]>|<strong>|Objective|History|$)/i);
  if (missionMatch) {
    const mClean = cleanHtml(missionMatch[1]);
    if (mClean.length > 15 && mClean.length < 800) parsed.mission = mClean;
  }

  // History / Overview
  const historyMatch = html.match(/(?:History|About the Department|Background)[\s\S]*?(?:<\/h[1-6]>|<\/strong>)([\s\S]*?)(?:<h[1-6]>|<strong>|Vision|Mission|$)/i);
  if (historyMatch) {
    const hClean = cleanHtml(historyMatch[1]);
    if (hClean.length > 30) parsed.history = hClean;
  }

  // Fallback description
  if (!parsed.description) {
    const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
    for (const p of paragraphs) {
      const cleanP = cleanHtml(p);
      if (cleanP.length > 60 && !cleanP.includes('Personal Details') && !cleanP.includes('Copyright')) {
        parsed.description = cleanP;
        break;
      }
    }
  }

  if (!parsed.description) {
    parsed.description = `The ${deptName} at St. Philomena's College (Autonomous), Mysuru fosters rigorous academic pedagogy, holistic development, and research excellence.`;
  }

  return parsed;
}

module.exports = {
  cleanHtml,
  parseCvTables,
  parseDepartmentContent
};
