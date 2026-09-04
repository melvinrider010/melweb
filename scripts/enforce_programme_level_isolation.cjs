const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const DATA_DIR = path.join(ROOT_DIR, 'src/data');

const hierarchy = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), 'utf8'));
let facultyList = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'faculty.json'), 'utf8'));
let programmes = hierarchy.programmes || [];

console.log('=== ENFORCING PROGRAMME-LEVEL FACULTY ISOLATION & PURGING NON-PERSON RECORDS ===\n');

// 1. Purge non-person scraped artifact records
const nonPersonIds = new Set([
  'fac_total_grant_received_',
  'fac_vol__page_no__month___year',
  'fac_status',
  'fac_bachelor_of_social_work',
  'fac_bsw',
  'fac_mba',
  'fac_october___2023',
  'fac_b_voc_healthcare_technology',
  'fac_b_voc_media_and_entertainment',
  'fac_gloriya_priyadarshini_e', // duplicate of fac_e_gloriya_priyadarshini
  'fac_ranjith_c_v' // duplicate of fac_ranjith__c_v
]);

const initialCount = facultyList.length;
facultyList = facultyList.filter(f => !nonPersonIds.has(f.id));
console.log(`Purged ${initialCount - facultyList.length} non-person/duplicate records. Authentic Faculty Count: ${facultyList.length}\n`);

// 2. Map Management department faculty strictly by programme
facultyList.forEach(f => {
  if (f.departmentId === 'dept-management' || f.departmentId === 'management') {
    if (['fac_issac_george', 'fac_sadia_tabassum', 'fac_a__emille_surekha', 'fac_divyashree_n_', 'fac_radhika_h_j'].includes(f.id)) {
      f.programmeCode = 'MBA';
      f.programmeType = 'pg';
      f.programmeName = 'Master of Business Administration (MBA)';
    } else if (['fac_suhana_kulssum', 'fac_vishal_c_p', 'fac_ranjith__c_v', 'fac_rini_brown'].includes(f.id)) {
      f.programmeCode = 'BBA-TH';
      f.programmeType = 'ug';
      f.programmeName = 'Bachelor of Business Administration in Tourism & Hospitality Management';
    } else {
      f.programmeCode = 'BBA';
      f.programmeType = 'ug';
      f.programmeName = 'Bachelor of Business Administration (BBA)';
    }
  }

  // Commerce separation
  if (f.departmentId === 'dept-commerce' || f.departmentId === 'commerce') {
    if (['fac_viveka_marie_g'].includes(f.id)) {
      f.programmeCode = 'M.Com';
      f.programmeType = 'pg';
      f.programmeName = 'Master of Commerce (M.Com)';
    } else {
      f.programmeCode = 'B.Com';
      f.programmeType = 'ug';
      f.programmeName = 'Bachelor of Commerce (B.Com)';
    }
  }

  // Social Work separation
  if (f.departmentId === 'dept-social-work' || f.departmentId === 'social-work') {
    if (['fac_noor_mubasheer_c_a', 'fac_shirley_cynthia_anthony', 'fac_robin_k_j'].includes(f.id)) {
      f.programmeCode = 'MSW';
      f.programmeType = 'pg';
      f.programmeName = 'Master of Social Work (MSW)';
    } else {
      f.programmeCode = 'BSW';
      f.programmeType = 'ug';
      f.programmeName = 'Bachelor of Social Work (BSW)';
    }
  }

  // Mathematics separation
  if (f.departmentId === 'dept-mathematics' || f.departmentId === 'mathematics') {
    if (['fac_bharatha_kalegowda', 'fac_vanitha_a_', 'fac_ameena_firdose'].includes(f.id)) {
      f.programmeCode = 'M.Sc Mathematics';
      f.programmeType = 'pg';
    } else {
      f.programmeCode = 'B.Sc';
      f.programmeType = 'ug';
    }
  }

  // Physics separation
  if (f.departmentId === 'dept-physics' || f.departmentId === 'physics') {
    if (['fac_felan_amal', 'fac_akhil_e_j', 'fac_d_revannasiddaiah'].includes(f.id)) {
      f.programmeCode = 'M.Sc Physics';
      f.programmeType = 'pg';
    } else {
      f.programmeCode = 'B.Sc';
      f.programmeType = 'ug';
    }
  }

  // Chemistry separation
  if (f.departmentId === 'dept-chemistry' || f.departmentId === 'chemistry') {
    if (['fac_k__nandini', 'fac_a__shivakumar'].includes(f.id)) {
      f.programmeCode = 'M.Sc Chemistry';
      f.programmeType = 'pg';
    } else {
      f.programmeCode = 'B.Sc';
      f.programmeType = 'ug';
    }
  }

  // Economics separation
  if (f.departmentId === 'dept-economics' || f.departmentId === 'economics') {
    if (['fac_ashwini_k_j', 'fac_dr_seema_siddiqi'].includes(f.id)) {
      f.programmeCode = 'M.A Economics';
      f.programmeType = 'pg';
    } else {
      f.programmeCode = 'B.A';
      f.programmeType = 'ug';
    }
  }

  // English separation
  if (f.departmentId === 'dept-english' || f.departmentId === 'english') {
    if (['fac_jenifer_priya_m', 'fac_roopa_selveria_j'].includes(f.id)) {
      f.programmeCode = 'M.A English';
      f.programmeType = 'pg';
    } else {
      f.programmeCode = 'B.A';
      f.programmeType = 'ug';
    }
  }

  // Journalism separation
  if (f.departmentId === 'dept-journalism' || f.departmentId === 'journalism') {
    if (['fac_venugopal_gowda_m_k'].includes(f.id)) {
      f.programmeCode = 'M.A Journalism';
      f.programmeType = 'pg';
    } else {
      f.programmeCode = 'B.A';
      f.programmeType = 'ug';
    }
  }
});

// 3. Update programmes with explicit primaryFacultyIds and associatedFacultyIds
programmes.forEach(prog => {
  const code = (prog.code || prog.id).toUpperCase();
  if (code === 'BCA') {
    prog.primaryFacultyIds = facultyList.filter(f => f.departmentId === 'dept-bca' && (f.programmeCode === 'BCA' || f.programmeType === 'ug')).map(f => f.id);
    prog.associatedFacultyIds = facultyList.filter(f => f.departmentId === 'dept-bca' && (f.programmeCode === 'MCA' || f.programmeType === 'pg')).map(f => f.id);
    prog.associatedTitle = 'Associated MCA Department Faculty';
  } else if (code === 'MCA') {
    prog.primaryFacultyIds = facultyList.filter(f => f.departmentId === 'dept-bca' && (f.programmeCode === 'MCA' || f.programmeType === 'pg')).map(f => f.id);
    prog.associatedFacultyIds = facultyList.filter(f => f.departmentId === 'dept-bca' && (f.programmeCode === 'BCA' || f.programmeType === 'ug')).map(f => f.id);
    prog.associatedTitle = 'Associated BCA Department Faculty';
  } else if (code === 'BBA') {
    prog.primaryFacultyIds = facultyList.filter(f => f.departmentId === 'dept-management' && f.programmeCode === 'BBA').map(f => f.id);
    prog.associatedFacultyIds = facultyList.filter(f => f.departmentId === 'dept-management' && (f.programmeCode === 'MBA' || f.programmeCode === 'BBA-TH')).map(f => f.id);
    prog.associatedTitle = 'Associated Management & MBA Faculty';
  } else if (code === 'MBA') {
    prog.primaryFacultyIds = facultyList.filter(f => f.departmentId === 'dept-management' && f.programmeCode === 'MBA').map(f => f.id);
    prog.associatedFacultyIds = facultyList.filter(f => f.departmentId === 'dept-management' && (f.programmeCode === 'BBA' || f.programmeCode === 'BBA-TH')).map(f => f.id);
    prog.associatedTitle = 'Associated Undergraduate Management Faculty';
  } else if (code === 'BBA-TH' || code === 'BBA-THM') {
    prog.primaryFacultyIds = facultyList.filter(f => f.departmentId === 'dept-management' && f.programmeCode === 'BBA-TH').map(f => f.id);
    prog.associatedFacultyIds = facultyList.filter(f => f.departmentId === 'dept-management' && f.programmeCode === 'BBA').map(f => f.id);
    prog.associatedTitle = 'Associated General Management Faculty';
  } else if (code === 'B.COM' || code === 'BCOM') {
    prog.primaryFacultyIds = facultyList.filter(f => f.departmentId === 'dept-commerce' && f.programmeCode === 'B.Com').map(f => f.id);
    prog.associatedFacultyIds = facultyList.filter(f => f.departmentId === 'dept-commerce' && f.programmeCode === 'M.Com').map(f => f.id);
    prog.associatedTitle = 'Associated Post-Graduate Commerce Faculty';
  } else if (code === 'M.COM' || code === 'MCOM') {
    prog.primaryFacultyIds = facultyList.filter(f => f.departmentId === 'dept-commerce' && f.programmeCode === 'M.Com').map(f => f.id);
    prog.associatedFacultyIds = facultyList.filter(f => f.departmentId === 'dept-commerce' && f.programmeCode === 'B.Com').map(f => f.id);
    prog.associatedTitle = 'Associated Undergraduate Commerce Faculty';
  } else if (code === 'BSW') {
    prog.primaryFacultyIds = facultyList.filter(f => f.departmentId === 'dept-social-work' && f.programmeCode === 'BSW').map(f => f.id);
    prog.associatedFacultyIds = facultyList.filter(f => f.departmentId === 'dept-social-work' && f.programmeCode === 'MSW').map(f => f.id);
    prog.associatedTitle = 'Associated Post-Graduate Social Work Faculty';
  } else if (code === 'MSW') {
    prog.primaryFacultyIds = facultyList.filter(f => f.departmentId === 'dept-social-work' && f.programmeCode === 'MSW').map(f => f.id);
    prog.associatedFacultyIds = facultyList.filter(f => f.departmentId === 'dept-social-work' && f.programmeCode === 'BSW').map(f => f.id);
    prog.associatedTitle = 'Associated Undergraduate Social Work Faculty';
  }
});

// Save updated datasets
fs.writeFileSync(path.join(DATA_DIR, 'faculty.json'), JSON.stringify(facultyList, null, 2));

hierarchy.faculty = facultyList;
hierarchy.programmes = programmes;
fs.writeFileSync(path.join(DATA_DIR, 'academicsHierarchyData.json'), JSON.stringify(hierarchy, null, 2));

console.log('=== PROGRAMME-LEVEL FACULTY ISOLATION ENFORCED SUCCESSFULLY ===');
