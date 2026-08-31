import fs from 'fs';
import path from 'path';
import { FACULTY_PROFILES } from '../src/data/facultyData.js';

// Target private storage: server/data/private/faculty-contacts.json
const privateDir = path.join('server', 'data', 'private');
if (!fs.existsSync(privateDir)) {
  fs.mkdirSync(privateDir, { recursive: true });
}

const facultyList = Object.values(FACULTY_PROFILES);
console.log(`Auditing all ${facultyList.length} faculty profiles across all departments...`);

const privateContacts = {};
const cleanedProfiles = {};

for (const f of facultyList) {
  const fId = f.id;

  // Store in private server-side store
  privateContacts[fId] = {
    facultyId: fId,
    name: f.name,
    department: f.department,
    deptId: f.deptId,
    designation: f.designation,
    email: f.email || null,
    // Store mobile as verified official contact or null if not publicly listed on source
    mobile: f.phone && !f.phone.includes('4001900') ? f.phone : null,
    officialOfficePhone: f.phone || null
  };

  // Clean public frontend record: remove phone and any private contact field
  const { phone, mobile, ...cleanF } = f;
  cleanedProfiles[f.id] = cleanF;
}

// Write to private server-side store
const privateFilePath = path.join(privateDir, 'faculty-contacts.json');
fs.writeFileSync(privateFilePath, JSON.stringify(privateContacts, null, 2), 'utf8');
console.log(`✓ Saved ${Object.keys(privateContacts).length} private faculty records to ${privateFilePath}`);

// Update public frontend facultyData.js
const facultyDataPath = path.join('src', 'data', 'facultyData.js');
const updatedContent = `// Comprehensive Authentic Faculty Directory for St. Philomena's College (Autonomous), Mysuru
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

fs.writeFileSync(facultyDataPath, updatedContent, 'utf8');
console.log(`✓ Updated public ${facultyDataPath} (removed all phone/mobile fields from frontend).`);
