const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
const facultyList = hierarchy.faculty || [];

console.log('=== INSPECTING MANAGEMENT DEPARTMENT FACULTY ===\n');

const mgmtFaculty = facultyList.filter(f => f.departmentId === 'dept-management' || f.departmentId === 'management');
console.log(`Found ${mgmtFaculty.length} Management Faculty:`);

mgmtFaculty.forEach((f, idx) => {
  console.log(`[${idx + 1}] ${f.name} (${f.designation}) - ID: ${f.id} - Source: ${f.officialProfileUrl || 'N/A'}`);
  console.log(`     Specialization: ${f.cvData?.specialization || f.specialization || 'N/A'}`);
  console.log(`     Qualifications: ${f.cvData?.qualifications || f.qualification || 'N/A'}`);
  console.log('');
});
