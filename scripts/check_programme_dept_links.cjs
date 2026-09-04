const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const hierarchy = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'src/data/academicsHierarchyData.json'), 'utf8'));

console.log('=== PROGRAMMES IN HIERARCHY ===');
hierarchy.programmes.forEach(p => {
  console.log(`- ID: [${p.id}] Code: [${p.code}] Title: "${p.title}" Dept: [${p.departmentId}] DeptSlug: [${p.deptSlug}]`);
});

console.log('\n=== DEPARTMENTS IN HIERARCHY ===');
hierarchy.departments.forEach(d => {
  console.log(`- ID: [${d.id}] Slug: [${d.slug}] Name: "${d.name}" UG: ${JSON.stringify(d.ugProgrammes)} PG: ${JSON.stringify(d.pgProgrammes)}`);
});
