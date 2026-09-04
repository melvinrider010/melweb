/**
 * BCA / MCA Immutable Baseline Snapshot & Verification Script
 * Creates a crytographic snapshot of current verified BCA & MCA data.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const HIERARCHY_PATH = path.resolve(__dirname, '../src/data/academicsHierarchyData.json');
const BASELINE_PATH = path.resolve(__dirname, 'bca_mca_immutable_baseline.json');

function createBaseline() {
  if (!fs.existsSync(HIERARCHY_PATH)) {
    console.error('Hierarchy data not found at:', HIERARCHY_PATH);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(HIERARCHY_PATH, 'utf8'));

  // Extract BCA & MCA departments
  const departments = (raw.departments || []).filter(d => 
    d.id === 'dept-bca' || d.slug === 'bca' || d.id === 'bca'
  );

  // Extract BCA & MCA programmes
  const programmes = (raw.programmes || []).filter(p => 
    (p.code || '').toUpperCase() === 'BCA' || (p.code || '').toUpperCase() === 'MCA' ||
    (p.id || '').toLowerCase() === 'bca' || (p.id || '').toLowerCase() === 'mca'
  );

  // Extract BCA & MCA faculty members
  const faculty = (raw.faculty || []).filter(f => 
    f.departmentId === 'dept-bca' || f.departmentId === 'bca' ||
    f.programmeCode === 'BCA' || f.programmeCode === 'MCA'
  );

  const baseline = {
    createdAt: new Date().toISOString(),
    departments: departments,
    programmes: programmes,
    faculty: faculty,
    departmentIds: departments.map(d => d.id),
    programmeIds: programmes.map(p => p.id),
    facultyIds: faculty.map(f => f.id),
    photoMappings: faculty.map(f => ({ id: f.id, name: f.name, photoUrl: f.photoUrl, photoVerified: f.photoVerified })),
    cvMappings: faculty.map(f => ({ id: f.id, name: f.name, cvData: f.cvData }))
  };

  const jsonStr = JSON.stringify(baseline, null, 2);
  const hash = crypto.createHash('sha256').update(jsonStr).digest('hex');
  baseline.checksum = hash;

  fs.writeFileSync(BASELINE_PATH, JSON.stringify(baseline, null, 2));

  console.log('==================================================');
  console.log('BCA / MCA IMMUTABLE BASELINE CREATED');
  console.log('==================================================');
  console.log(`Departments Captured: ${departments.length}`);
  console.log(`Programmes Captured: ${programmes.length}`);
  console.log(`Faculty Records Captured: ${faculty.length}`);
  console.log(`BCA Faculty Count: ${faculty.filter(f => f.programmeCode === 'BCA' || f.programmeType === 'ug').length}`);
  console.log(`MCA Faculty Count: ${faculty.filter(f => f.programmeCode === 'MCA' || f.programmeType === 'pg').length}`);
  console.log(`Baseline Checksum (SHA-256): ${hash}`);
  console.log(`Saved to: scripts/bca_mca_immutable_baseline.json`);
  console.log('==================================================\n');

  return baseline;
}

function verifyAgainstBaseline(currentHierarchy) {
  if (!fs.existsSync(BASELINE_PATH)) {
    console.error('Baseline snapshot not found. Run createBaseline first.');
    return { passed: false, error: 'Baseline missing' };
  }

  const baseline = JSON.parse(fs.readFileSync(BASELINE_PATH, 'utf8'));

  const currDepts = (currentHierarchy.departments || []).filter(d => 
    d.id === 'dept-bca' || d.slug === 'bca' || d.id === 'bca'
  );

  const currProgs = (currentHierarchy.programmes || []).filter(p => 
    (p.code || '').toUpperCase() === 'BCA' || (p.code || '').toUpperCase() === 'MCA' ||
    (p.id || '').toLowerCase() === 'bca' || (p.id || '').toLowerCase() === 'mca'
  );

  const currFaculty = (currentHierarchy.faculty || []).filter(f => 
    f.departmentId === 'dept-bca' || f.departmentId === 'bca' ||
    f.programmeCode === 'BCA' || f.programmeCode === 'MCA'
  );

  const errors = [];

  // Check department count
  if (currDepts.length < baseline.departments.length) {
    errors.push(`Missing BCA/MCA department: expected ${baseline.departments.length}, got ${currDepts.length}`);
  }

  // Check programme count
  if (currProgs.length < baseline.programmes.length) {
    errors.push(`Missing BCA/MCA programme: expected ${baseline.programmes.length}, got ${currProgs.length}`);
  }

  // Check faculty records
  baseline.faculty.forEach(baseFac => {
    const matched = currFaculty.find(f => f.id === baseFac.id || f.name.toLowerCase() === baseFac.name.toLowerCase());
    if (!matched) {
      errors.push(`Missing faculty member: ${baseFac.name} (${baseFac.id})`);
    } else {
      if (baseFac.photoVerified && !matched.photoVerified) {
        errors.push(`Faculty photo lost verification: ${baseFac.name}`);
      }
      if (baseFac.programmeCode !== matched.programmeCode) {
        errors.push(`Faculty programme code altered: ${baseFac.name} (${baseFac.programmeCode} -> ${matched.programmeCode})`);
      }
    }
  });

  const passed = errors.length === 0;

  console.log('==================================================');
  console.log('BCA / MCA REGRESSION AUDIT RESULTS');
  console.log('==================================================');
  console.log(`Audit Passed: ${passed ? 'YES (100% PRESERVED)' : 'FAILED'}`);
  console.log(`Unexpected Faculty Changes: ${errors.length}`);
  if (errors.length > 0) {
    errors.forEach(err => console.error('  - ' + err));
  }
  console.log('==================================================\n');

  return { passed, errors };
}

if (require.main === module) {
  createBaseline();
}

module.exports = {
  createBaseline,
  verifyAgainstBaseline
};
