import hierarchyData from './academicsHierarchyData.json';
import cmsStore from '../lib/cmsStore';

export const FACULTIES = hierarchyData.faculties || [];
export const DEPARTMENTS = hierarchyData.departments || [];
export const PROGRAMMES = hierarchyData.programmes || [];
export const FACULTY_MEMBERS = hierarchyData.faculty || [];

// Dynamic Accessors (CMS Live Synced)
export const getLiveDepartments = () => cmsStore?.getDepartments?.() || DEPARTMENTS;
export const getLiveFaculty = () => cmsStore?.getFaculty?.() || FACULTY_MEMBERS;
export const getLiveProgrammes = () => cmsStore?.getProgrammes?.() || PROGRAMMES;

export function getDepartmentById(deptIdOrSlug) {
  if (!deptIdOrSlug) return null;
  const raw = String(deptIdOrSlug).toLowerCase().trim();
  const clean = raw.replace(/^dept[-_]/, '');
  const withPrefix = `dept-${clean}`;
  
  const depts = getLiveDepartments();

  // 1. Direct ID, Slug, Code, or withPrefix match
  const exact = depts.find(d => {
    const dId = (d.id || '').toLowerCase();
    const dSlug = (d.slug || '').toLowerCase();
    const dCode = (d.code || '').toLowerCase();
    const dDeptId = (d.deptId || '').toLowerCase();
    return dId === raw || dId === clean || dId === withPrefix ||
           dSlug === raw || dSlug === clean || dSlug === withPrefix ||
           dDeptId === raw || dDeptId === clean || dDeptId === withPrefix ||
           dCode === raw || dCode === clean;
  });
  if (exact) return exact;

  // 2. Department Alias & Keyword Mapping
  const aliasMap = {
    'criminology-and-forensic-science': 'dept-criminology',
    'criminology': 'dept-criminology',
    'forensic': 'dept-criminology',
    'cfs': 'dept-criminology',
    'bsc-criminology': 'dept-criminology',
    'ug-criminology': 'dept-criminology',
    'criminology-forensic-science': 'dept-criminology',
    'food-science-and-nutrition': 'dept-food-science',
    'food-and-nutrition': 'dept-food-science',
    'food-science': 'dept-food-science',
    'journalism-and-mass-communication': 'dept-journalism',
    'mass-communication': 'dept-journalism',
    'journalism': 'dept-journalism',
    'botany': 'dept-botany-zoology',
    'zoology': 'dept-botany-zoology',
    'botany-and-zoology': 'dept-botany-zoology',
    'environmental-science': 'dept-environmental-science',
    'computer-science': 'dept-computer-science',
    'bca': 'dept-bca',
    'mca': 'dept-mca',
    'bba-th': 'dept-bba-th',
    'bbath': 'dept-bba-th',
    'bba-thm': 'dept-bba-th',
    'bba': 'dept-management',
    'mba': 'dept-mba',
    'management-studies': 'dept-management',
    'commerce': 'dept-commerce',
    'bcom': 'dept-commerce',
    'mcom': 'dept-pg-commerce',
    'english': 'dept-english',
    'ba-english': 'dept-english',
    'kannada': 'dept-kannada',
    'ba-kannada': 'dept-kannada',
    'hindi': 'dept-hindi',
    'ba-hindi': 'dept-hindi',
    'malayalam': 'dept-malayalam',
    'ba-malayalam': 'dept-malayalam',
    'urdu': 'dept-urdu',
    'ba-urdu': 'dept-urdu',
    'tamil': 'dept-tamil',
    'ba-tamil': 'dept-tamil',
    'french': 'dept-french',
    'ba-french': 'dept-french',
    'physics': 'dept-physics',
    'bsc-physics': 'dept-physics',
    'ug-physics': 'dept-physics',
    'chemistry': 'dept-chemistry',
    'bsc-chemistry': 'dept-chemistry',
    'ug-chemistry': 'dept-chemistry',
    'mathematics': 'dept-mathematics',
    'maths': 'dept-mathematics',
    'bsc-mathematics': 'dept-mathematics',
    'ug-mathematics': 'dept-mathematics',
    'botany': 'dept-botany',
    'bsc-botany': 'dept-botany',
    'ug-botany': 'dept-botany',
    'zoology': 'dept-zoology',
    'bsc-zoology': 'dept-zoology',
    'ug-zoology': 'dept-zoology',
    'environmental-science': 'dept-environmental-science',
    'bsc-environmental-science': 'dept-environmental-science',
    'ug-environmental-science': 'dept-environmental-science',
    'environmental-studies': 'dept-environmental-studies',
    'evs': 'dept-environmental-studies',
    'ug-environmental-studies': 'dept-environmental-studies',
    'life-skills': 'dept-life-skills',
    'life_skills': 'dept-life-skills',
    'lifeskills': 'dept-life-skills',
    'ug-life-skills': 'dept-life-skills',
    'iks': 'dept-iks',
    'indian-knowledge-system': 'dept-iks',
    'indian-knowledge-systems': 'dept-iks',
    'ug-iks': 'dept-iks',
    'computer-science': 'dept-computer-science',
    'bsc-computer-science': 'dept-computer-science',
    'ug-computer-science': 'dept-computer-science',
    'cs': 'dept-computer-science',
    'economics': 'dept-economics',
    'ba-economics': 'dept-economics',
    'ug-economics': 'dept-economics',
    'history': 'dept-history',
    'ba-history': 'dept-history',
    'ug-history': 'dept-history',
    'sociology': 'dept-sociology',
    'ba-sociology': 'dept-sociology',
    'ug-sociology': 'dept-sociology',
    'political-science': 'dept-political-science',
    'ba-political-science': 'dept-political-science',
    'ug-political-science': 'dept-political-science',
    'psychology': 'dept-psychology',
    'ba-psychology': 'dept-psychology',
    'bsc-psychology': 'dept-psychology',
    'ug-psychology': 'dept-psychology',
    'christianity': 'dept-christianity',
    'ba-christianity': 'dept-christianity',
    'ug-christianity': 'dept-christianity',
    'social-work': 'dept-social-work',
    'bsw': 'dept-social-work',
    'ug-social-work': 'dept-social-work',
    'biotechnology': 'dept-biotechnology',
    'bsc-biotechnology': 'dept-biotechnology',
    'ug-biotechnology': 'dept-biotechnology',
    'microbiology': 'dept-microbiology',
    'bsc-microbiology': 'dept-microbiology',
    'ug-microbiology': 'dept-microbiology',
    'biochemistry': 'dept-biochemistry',
    'bsc-biochemistry': 'dept-biochemistry',
    'ug-biochemistry': 'dept-biochemistry',
    'food-science': 'dept-food-science',
    'food-science-and-nutrition': 'dept-food-science',
    'food-science-nutrition': 'dept-food-science',
    'food-and-nutrition': 'dept-food-science',
    'bsc-food-science': 'dept-food-science',
    'ug-food-science': 'dept-food-science',
    'bvoc': 'dept-bvoc',
    'b-voc': 'dept-bvoc',
    'vocational': 'dept-bvoc',
    'vocational-studies': 'dept-bvoc',
    'dept-vocational-studies': 'dept-bvoc',
    'bvoc-healthcare': 'dept-bvoc',
    'bvoc-media-entertainment': 'dept-bvoc',
    'pg-biochemistry': 'dept-pg-biochemistry',
    'msc-biochemistry': 'dept-pg-biochemistry',
    'pg-chemistry': 'dept-pg-chemistry',
    'msc-chemistry': 'dept-pg-chemistry',
    'pg-commerce': 'dept-pg-commerce',
    'm-com': 'dept-pg-commerce',
    'pg-computer-science': 'dept-pg-computer-science',
    'msc-cs': 'dept-pg-computer-science',
    'msc-computer-science': 'dept-pg-computer-science',
    'pg-cfs': 'dept-pg-cfs',
    'pg-criminology': 'dept-pg-cfs',
    'msc-cfs': 'dept-pg-cfs',
    'msc-criminology': 'dept-pg-cfs',
    'pg-english': 'dept-pg-english',
    'ma-english': 'dept-pg-english',
    'pg-journalism': 'dept-pg-journalism',
    'ma-journalism': 'dept-pg-journalism',
    'pg-journalism-and-mass-communication': 'dept-pg-journalism',
    'pg-mathematics': 'dept-pg-mathematics',
    'msc-mathematics': 'dept-pg-mathematics',
    'pg-physics': 'dept-pg-physics',
    'msc-physics': 'dept-pg-physics',
    'pg-psychology': 'dept-pg-psychology',
    'msc-psychology': 'dept-pg-psychology',
    'pg-social-work': 'dept-pg-social-work',
    'msw': 'dept-pg-social-work',
    'pg-economics': 'dept-pg-economics',
    'ma-economics': 'dept-pg-economics',
    'pg-food-science': 'dept-pg-food-science',
    'msc-food-science': 'dept-pg-food-science',
    'pg-food-science-and-nutrition': 'dept-pg-food-science',
    'master-of-computer-applications': 'dept-mca',
    'master-of-business-administration': 'dept-mba',
    'pg-library': 'dept-pg-library',
    'post-graduate-library': 'dept-pg-library'
  };

  if (aliasMap[clean] || aliasMap[raw]) {
    const targetId = aliasMap[clean] || aliasMap[raw];
    const match = depts.find(d => d.id === targetId);
    if (match) return match;
  }

  // 3. Fallback search by partial department name
  return depts.find(d => {
    const dName = (d.name || '').toLowerCase();
    return dName.includes(clean) || (clean.length >= 4 && clean.includes(d.slug || ''));
  }) || null;
}

/**
 * Get all authentic primary faculty members for a given Department (Dynamic Linking)
 */
export function getFacultyByDepartmentId(deptIdOrSlug) {
  if (!deptIdOrSlug) return [];
  const clean = String(deptIdOrSlug).toLowerCase().trim();
  const dept = getDepartmentById(clean);
  const targetId = dept ? (dept.deptId || dept.id) : clean;
  const facultyList = getLiveFaculty();
  
  if (targetId === 'dept-bca' || clean === 'bca') {
    return facultyList.filter(f => f.departmentId === 'dept-bca');
  }

  if (targetId === 'dept-management' || clean === 'bba' || clean === 'management') {
    return facultyList.filter(f => f.departmentId === 'dept-management');
  }

  if (targetId === 'dept-bba-th' || clean === 'bba-th' || clean === 'bbath' || clean === 'bba-thm') {
    return facultyList.filter(f => f.departmentId === 'dept-bba-th');
  }

  if (targetId === 'dept-commerce' || clean === 'commerce' || clean === 'bcom') {
    return facultyList.filter(f => f.departmentId === 'dept-commerce');
  }

  if (targetId === 'dept-english' || clean === 'english' || clean === 'ba-english') {
    return facultyList.filter(f => f.departmentId === 'dept-english');
  }

  if (targetId === 'dept-kannada' || clean === 'kannada' || clean === 'ba-kannada') {
    return facultyList.filter(f => f.departmentId === 'dept-kannada');
  }

  if (targetId === 'dept-hindi' || clean === 'hindi' || clean === 'ba-hindi') {
    return facultyList.filter(f => f.departmentId === 'dept-hindi');
  }

  if (targetId === 'dept-malayalam' || clean === 'malayalam' || clean === 'ba-malayalam') {
    return facultyList.filter(f => f.departmentId === 'dept-malayalam');
  }

  if (targetId === 'dept-urdu' || clean === 'urdu' || clean === 'ba-urdu') {
    return facultyList.filter(f => f.departmentId === 'dept-urdu');
  }

  if (targetId === 'dept-tamil' || clean === 'tamil' || clean === 'ba-tamil') {
    return facultyList.filter(f => f.departmentId === 'dept-tamil');
  }

  if (targetId === 'dept-french' || clean === 'french' || clean === 'ba-french') {
    return facultyList.filter(f => f.departmentId === 'dept-french');
  }

  if (targetId === 'dept-physics' || clean === 'physics' || clean === 'bsc-physics' || clean === 'ug-physics') {
    return facultyList.filter(f => f.departmentId === 'dept-physics');
  }

  if (targetId === 'dept-chemistry' || clean === 'chemistry' || clean === 'bsc-chemistry' || clean === 'ug-chemistry') {
    return facultyList.filter(f => f.departmentId === 'dept-chemistry');
  }

  if (targetId === 'dept-mathematics' || clean === 'mathematics' || clean === 'maths' || clean === 'bsc-mathematics' || clean === 'ug-mathematics') {
    return facultyList.filter(f => f.departmentId === 'dept-mathematics');
  }

  if (targetId === 'dept-botany' || clean === 'botany' || clean === 'bsc-botany' || clean === 'ug-botany') {
    return facultyList.filter(f => f.departmentId === 'dept-botany');
  }

  if (targetId === 'dept-zoology' || clean === 'zoology' || clean === 'bsc-zoology' || clean === 'ug-zoology') {
    return facultyList.filter(f => f.departmentId === 'dept-zoology');
  }

  if (targetId === 'dept-environmental-science' || clean === 'environmental-science' || clean === 'bsc-environmental-science' || clean === 'ug-environmental-science') {
    return facultyList.filter(f => f.departmentId === 'dept-environmental-science');
  }

  if (targetId === 'dept-computer-science' || clean === 'computer-science' || clean === 'bsc-computer-science' || clean === 'ug-computer-science' || clean === 'cs') {
    return facultyList.filter(f => f.departmentId === 'dept-computer-science');
  }

  if (targetId === 'dept-economics' || clean === 'economics' || clean === 'ba-economics' || clean === 'ug-economics') {
    return facultyList.filter(f => f.departmentId === 'dept-economics');
  }

  if (targetId === 'dept-history' || clean === 'history' || clean === 'ba-history' || clean === 'ug-history') {
    return facultyList.filter(f => f.departmentId === 'dept-history');
  }

  if (targetId === 'dept-sociology' || clean === 'sociology' || clean === 'ba-sociology' || clean === 'ug-sociology') {
    return facultyList.filter(f => f.departmentId === 'dept-sociology');
  }

  if (targetId === 'dept-political-science' || clean === 'political-science' || clean === 'ba-political-science' || clean === 'ug-political-science') {
    return facultyList.filter(f => f.departmentId === 'dept-political-science');
  }

  if (targetId === 'dept-criminology' || clean === 'criminology' || clean === 'criminology-and-forensic-science' || clean === 'cfs' || clean === 'bsc-criminology' || clean === 'ug-criminology') {
    return facultyList.filter(f => f.departmentId === 'dept-criminology');
  }

  if (targetId === 'dept-journalism' || clean === 'journalism' || clean === 'mass-communication' || clean === 'journalism-and-mass-communication' || clean === 'ba-journalism' || clean === 'ug-journalism' || clean === 'journalism-mass-communication') {
    return facultyList.filter(f => f.departmentId === 'dept-journalism');
  }

  if (targetId === 'dept-psychology' || clean === 'psychology' || clean === 'ba-psychology' || clean === 'bsc-psychology' || clean === 'ug-psychology') {
    return facultyList.filter(f => f.departmentId === 'dept-psychology');
  }

  if (targetId === 'dept-christianity' || clean === 'christianity' || clean === 'ba-christianity' || clean === 'ug-christianity') {
    return facultyList.filter(f => f.departmentId === 'dept-christianity');
  }

  if (targetId === 'dept-social-work' || clean === 'social-work' || clean === 'bsw' || clean === 'ug-social-work') {
    return facultyList.filter(f => f.departmentId === 'dept-social-work');
  }

  if (targetId === 'dept-biotechnology' || clean === 'biotechnology' || clean === 'bsc-biotechnology' || clean === 'ug-biotechnology') {
    return facultyList.filter(f => f.departmentId === 'dept-biotechnology');
  }

  if (targetId === 'dept-microbiology' || clean === 'microbiology' || clean === 'bsc-microbiology' || clean === 'ug-microbiology') {
    return facultyList.filter(f => f.departmentId === 'dept-microbiology');
  }

  if (targetId === 'dept-biochemistry' || clean === 'biochemistry' || clean === 'bsc-biochemistry' || clean === 'ug-biochemistry') {
    return facultyList.filter(f => f.departmentId === 'dept-biochemistry');
  }

  if (targetId === 'dept-food-science' || clean === 'food-science' || clean === 'food-science-and-nutrition' || clean === 'food-science-nutrition' || clean === 'food-and-nutrition' || clean === 'bsc-food-science' || clean === 'ug-food-science') {
    return facultyList.filter(f => f.departmentId === 'dept-food-science');
  }

  if (targetId === 'dept-bvoc' || clean === 'bvoc' || clean === 'b-voc' || clean === 'vocational' || clean === 'vocational-studies' || clean === 'dept-vocational-studies' || clean === 'bvoc-healthcare' || clean === 'bvoc-media-entertainment') {
    return facultyList.filter(f => f.departmentId === 'dept-bvoc');
  }

  if (targetId === 'dept-environmental-studies' || clean === 'environmental-studies' || clean === 'evs' || clean === 'ug-environmental-studies') {
    return facultyList.filter(f => f.departmentId === 'dept-environmental-studies');
  }

  if (targetId === 'dept-life-skills' || clean === 'life-skills' || clean === 'life_skills' || clean === 'lifeskills' || clean === 'ug-life-skills') {
    return facultyList.filter(f => f.departmentId === 'dept-life-skills');
  }

  if (targetId === 'dept-iks' || clean === 'iks' || clean === 'indian-knowledge-system' || clean === 'indian-knowledge-systems' || clean === 'ug-iks') {
    return facultyList.filter(f => f.departmentId === 'dept-iks');
  }

  if (targetId === 'dept-pg-biochemistry' || clean === 'pg-biochemistry' || clean === 'msc-biochemistry') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-biochemistry');
  }

  if (targetId === 'dept-pg-chemistry' || clean === 'pg-chemistry' || clean === 'msc-chemistry') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-chemistry');
  }

  if (targetId === 'dept-pg-commerce' || clean === 'pg-commerce' || clean === 'mcom' || clean === 'm-com') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-commerce');
  }

  if (targetId === 'dept-pg-computer-science' || clean === 'pg-computer-science' || clean === 'msc-cs' || clean === 'msc-computer-science') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-computer-science');
  }

  if (targetId === 'dept-pg-cfs' || clean === 'pg-cfs' || clean === 'pg-criminology' || clean === 'msc-cfs') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-cfs');
  }

  if (targetId === 'dept-pg-english' || clean === 'pg-english' || clean === 'ma-english') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-english');
  }

  if (targetId === 'dept-pg-journalism' || clean === 'pg-journalism' || clean === 'ma-journalism' || clean === 'pg-journalism-and-mass-communication') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-journalism');
  }

  if (targetId === 'dept-pg-mathematics' || clean === 'pg-mathematics' || clean === 'msc-mathematics') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-mathematics');
  }

  if (targetId === 'dept-pg-physics' || clean === 'pg-physics' || clean === 'msc-physics') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-physics');
  }

  if (targetId === 'dept-pg-psychology' || clean === 'pg-psychology' || clean === 'msc-psychology') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-psychology');
  }

  if (targetId === 'dept-pg-social-work' || clean === 'pg-social-work' || clean === 'msw') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-social-work');
  }

  if (targetId === 'dept-pg-economics' || clean === 'pg-economics' || clean === 'ma-economics') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-economics');
  }

  if (targetId === 'dept-pg-food-science' || clean === 'pg-food-science' || clean === 'msc-food-science' || clean === 'pg-food-science-and-nutrition') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-food-science');
  }

  if (targetId === 'dept-mca' || clean === 'mca' || clean === 'master-of-computer-applications') {
    return facultyList.filter(f => f.departmentId === 'dept-mca');
  }

  if (targetId === 'dept-mba' || clean === 'mba' || clean === 'master-of-business-administration') {
    return facultyList.filter(f => f.departmentId === 'dept-mba');
  }

  if (targetId === 'dept-pg-library' || clean === 'pg-library' || clean === 'post-graduate-library') {
    return facultyList.filter(f => f.departmentId === 'dept-pg-library');
  }

  return facultyList.filter(f => 
    f.departmentId === targetId || 
    (dept && f.departmentId === dept.id) || 
    (dept && f.departmentId === dept.slug) ||
    (f.departmentName && dept && f.departmentName.toLowerCase() === dept.name.toLowerCase())
  );
}

/**
 * Get all authentic primary faculty members for a specific Programme
 */
export function getProgrammeFaculty(progIdOrCode) {
  if (!progIdOrCode) return [];
  const prog = getProgrammeById(progIdOrCode);
  if (!prog) return [];

  const facultyList = getLiveFaculty();
  const code = (prog.code || prog.id || '').toUpperCase();

  // If programme has explicit faculty assigned in CMS
  if (prog.departmentId) {
    const deptFac = facultyList.filter(f => f.departmentId === prog.departmentId);
    if (deptFac.length > 0) return deptFac;
  }

  // 1. BCA: Returns strictly all verified BCA Present Faculties (PRESERVED GOLD STANDARD)
  if (code === 'BCA') {
    return FACULTY_MEMBERS.filter(f => 
      f.departmentId === 'dept-bca' && 
      (f.programmeCode === 'BCA' || f.programmeType === 'ug')
    );
  }

  // 2. MCA: Returns strictly all authentic MCA Faculty
  if (code === 'MCA') {
    return facultyList.filter(f => 
      f.departmentId === 'dept-mca' || 
      (f.departmentId === 'dept-bca' && (f.programmeCode === 'MCA' || f.programmeType === 'pg'))
    );
  }

  // 3. BBA: Returns strictly BBA Undergraduate Faculty
  if (code === 'BBA') {
    return facultyList.filter(f => 
      (f.departmentId === 'dept-management' || f.departmentId === 'management') && 
      f.programmeCode === 'BBA'
    );
  }

  // 4. MBA: Returns strictly MBA Postgraduate Faculty
  if (code === 'MBA') {
    return facultyList.filter(f => 
      f.departmentId === 'dept-mba' || 
      ((f.departmentId === 'dept-management' || f.departmentId === 'management') && f.programmeCode === 'MBA')
    );
  }

  // 5. BBA-TH / BBA-THM: Returns strictly BBA-TH Faculty
  if (code === 'BBA-TH' || code === 'BBA-THM' || code === 'BACHELOR-OF-TOURIS') {
    return FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-management' || f.departmentId === 'management') && 
      f.programmeCode === 'BBA-TH'
    );
  }

  // 6. B.Com: Returns strictly B.Com Faculty
  if (code === 'B.COM' || code === 'BCOM') {
    return FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-commerce' || f.departmentId === 'commerce') && 
      f.programmeCode === 'B.Com'
    );
  }

  // 7. M.Com: Returns strictly M.Com Faculty
  if (code === 'M.COM' || code === 'MCOM') {
    return FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-commerce' || f.departmentId === 'commerce') && 
      f.programmeCode === 'M.Com'
    );
  }

  // 8. BSW: Returns strictly BSW Faculty
  if (code === 'BSW') {
    return FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-social-work' || f.departmentId === 'social-work') && 
      f.programmeCode === 'BSW'
    );
  }

  // 9. MSW: Returns strictly MSW Faculty
  if (code === 'MSW' || code === 'MASTER-OF-SOCIAL-WORK') {
    return FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-social-work' || f.departmentId === 'social-work') && 
      f.programmeCode === 'MSW'
    );
  }

  // 10. Programmes with explicit primaryFacultyIds or facultyIds array
  const facultyIds = prog.primaryFacultyIds || prog.facultyIds;
  if (Array.isArray(facultyIds) && facultyIds.length > 0) {
    const idSet = new Set(facultyIds);
    const matched = FACULTY_MEMBERS.filter(f => idSet.has(f.id));
    if (matched.length > 0) return matched;
  }

  // 11. Fallback filtered by programmeCode / programmeType
  const progType = (prog.type || prog.level || '').toLowerCase().includes('pg') ? 'pg' : 'ug';
  const deptFaculty = getFacultyByDepartmentId(prog.departmentId || prog.deptSlug);
  const typeMatched = deptFaculty.filter(f => f.programmeType === progType || f.programmeCode === prog.code);
  return typeMatched.length > 0 ? typeMatched : deptFaculty;
}

/**
 * Get authentic secondary / associated faculty for a specific Programme (e.g. MCA on BCA page, BCA on MCA page, MBA on BBA page)
 */
export function getProgrammeSecondaryFaculty(progIdOrCode) {
  if (!progIdOrCode) return { faculty: [], title: '' };
  const prog = getProgrammeById(progIdOrCode);
  if (!prog) return { faculty: [], title: '' };

  const code = (prog.code || prog.id || '').toUpperCase();

  if (code === 'BCA') {
    const mcaFaculty = FACULTY_MEMBERS.filter(f => 
      f.departmentId === 'dept-bca' && 
      (f.programmeCode === 'MCA' || f.programmeType === 'pg')
    );
    return {
      faculty: mcaFaculty,
      title: 'Department Postgraduate Faculty (MCA)'
    };
  }

  if (code === 'MCA') {
    const bcaFaculty = FACULTY_MEMBERS.filter(f => 
      f.departmentId === 'dept-bca' && 
      (f.programmeCode === 'BCA' || f.programmeType === 'ug')
    );
    return {
      faculty: bcaFaculty,
      title: 'Department Undergraduate Faculty (BCA)'
    };
  }

  if (code === 'BBA') {
    const associated = FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-management' || f.departmentId === 'management') && 
      (f.programmeCode === 'MBA' || f.programmeCode === 'BBA-TH')
    );
    return {
      faculty: associated,
      title: 'Associated Management & Postgraduate (MBA) Faculty'
    };
  }

  if (code === 'MBA') {
    const associated = FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-management' || f.departmentId === 'management') && 
      (f.programmeCode === 'BBA' || f.programmeCode === 'BBA-TH')
    );
    return {
      faculty: associated,
      title: 'Associated Undergraduate Management (BBA) Faculty'
    };
  }

  if (code === 'B.COM' || code === 'BCOM') {
    const mcom = FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-commerce' || f.departmentId === 'commerce') && 
      f.programmeCode === 'M.Com'
    );
    return {
      faculty: mcom,
      title: 'Associated Postgraduate Faculty (M.Com)'
    };
  }

  if (code === 'M.COM' || code === 'MCOM') {
    const bcom = FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-commerce' || f.departmentId === 'commerce') && 
      f.programmeCode === 'B.Com'
    );
    return {
      faculty: bcom,
      title: 'Associated Undergraduate Faculty (B.Com)'
    };
  }

  if (code === 'BSW') {
    const msw = FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-social-work' || f.departmentId === 'social-work') && 
      f.programmeCode === 'MSW'
    );
    return {
      faculty: msw,
      title: 'Associated Postgraduate Faculty (MSW)'
    };
  }

  if (code === 'MSW' || code === 'MASTER-OF-SOCIAL-WORK') {
    const bsw = FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-social-work' || f.departmentId === 'social-work') && 
      f.programmeCode === 'BSW'
    );
    return {
      faculty: bsw,
      title: 'Associated Undergraduate Faculty (BSW)'
    };
  }

  return { faculty: [], title: '' };
}

/**
 * Get full Programme details by ID or Code
 */
export function getProgrammeById(progIdOrCode) {
  if (!progIdOrCode) return null;
  const key = String(progIdOrCode).toLowerCase().trim();
  
  const progAliases = {
    'ma-in-english': 'ma-english',
    'm-sc-psychology': 'msc',
    'bcom': 'b-com',
    'mcom': 'm-com',
    'bbathm': 'bba-thm',
    'msc-physics': 'm-sc-physics',
    'msc-chemistry': 'm-sc-chemistry',
    'msc-mathematics': 'm-sc-mathematics',
    'msc-biochemistry': 'm-sc-biochemistry',
    'msc-computer-science': 'm-sc-computer-science'
  };

  const lookupKey = progAliases[key] || key;
  const progs = getLiveProgrammes();
  return progs.find(p => {
    const pId = (p.id || '').toLowerCase();
    const pSlug = (p.slug || '').toLowerCase();
    const pCode = (p.code || '').toLowerCase();
    const pName = (p.name || '').toLowerCase();
    return pId === lookupKey || pSlug === lookupKey || pCode === lookupKey || pName === lookupKey ||
           pId === key || pSlug === key || pCode === key || pName === key ||
           pId.replace(/[^a-z0-9]/g, '') === lookupKey.replace(/[^a-z0-9]/g, '') ||
           pCode.replace(/[^a-z0-9]/g, '') === lookupKey.replace(/[^a-z0-9]/g, '') ||
           pSlug.replace(/[^a-z0-9]/g, '') === lookupKey.replace(/[^a-z0-9]/g, '');
  }) || null;
}

/**
 * Get Continuum / Degree Switcher options for any Department or Programme.
 * e.g. BCA <-> MCA, BBA <-> MBA <-> BBA-THM, B.Com <-> M.Com, BSW <-> MSW, B.Sc <-> M.Sc
 */
export function getDepartmentContinuumProgrammes(progOrDept) {
  if (!progOrDept) return { department: null, programmes: [], currentId: null };

  let currentProg = null;
  let targetDept = null;

  if (typeof progOrDept === 'object') {
    if (progOrDept.ugProgrammes || progOrDept.deptId || progOrDept.facilities) {
      targetDept = progOrDept;
    } else {
      currentProg = progOrDept;
      targetDept = getDepartmentById(progOrDept.departmentId || progOrDept.deptSlug || progOrDept.department);
    }
  } else {
    currentProg = getProgrammeById(progOrDept);
    if (currentProg) {
      targetDept = getDepartmentById(currentProg.departmentId || currentProg.deptSlug || currentProg.department);
    } else {
      targetDept = getDepartmentById(progOrDept);
    }
  }

  // Fallback lookup if department was not resolved
  if (!targetDept && currentProg) {
    const code = (currentProg.code || currentProg.id || '').toUpperCase();
    if (code.includes('BCA') || code.includes('MCA')) targetDept = getDepartmentById('dept-bca');
    else if (code.includes('BBA') || code.includes('MBA')) targetDept = getDepartmentById('dept-management');
    else if (code.includes('COM')) targetDept = getDepartmentById('dept-commerce');
    else if (code.includes('SW')) targetDept = getDepartmentById('dept-social-work');
    else if (currentProg.stream?.toLowerCase().includes('science') || code.includes('SC')) targetDept = getDepartmentById('dept-physics');
    else targetDept = getDepartmentById('dept-economics');
  }

  const rawUgIds = targetDept?.ugProgrammes || [];
  const rawPgIds = targetDept?.pgProgrammes || [];

  let ugs = rawUgIds.map(id => getProgrammeById(id)).filter(Boolean);
  let pgs = rawPgIds.map(id => getProgrammeById(id)).filter(Boolean);

  if (ugs.length === 0) {
    if (targetDept?.category === 'Science' || targetDept?.faculty?.toLowerCase().includes('science')) {
      const bsc = getProgrammeById('bsc');
      if (bsc) ugs.push(bsc);
    } else if (targetDept?.category === 'Humanities' || targetDept?.faculty?.toLowerCase().includes('humanities')) {
      const ba = getProgrammeById('ba');
      if (ba) ugs.push(ba);
    }
  }

  if (pgs.length === 0) {
    if (targetDept?.category === 'Science' || targetDept?.faculty?.toLowerCase().includes('science')) {
      const msc = getProgrammeById('msc');
      if (msc) pgs.push(msc);
    } else if (targetDept?.category === 'Humanities' || targetDept?.faculty?.toLowerCase().includes('humanities')) {
      const ma = getProgrammeById('ma');
      if (ma) pgs.push(ma);
    }
  }

  const seen = new Set();
  const allProgs = [...ugs, ...pgs].filter(p => {
    if (!p || !p.id) return false;
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  const currentId = currentProg?.id || (typeof progOrDept === 'string' ? progOrDept.toLowerCase() : null);

  const formattedProgrammes = allProgs.map(p => {
    const isCurrent = currentId ? (
      p.id.toLowerCase() === currentId ||
      (p.code && p.code.toLowerCase().replace(/[^a-z0-9]/g, '') === currentId.replace(/[^a-z0-9]/g, ''))
    ) : false;

    return {
      id: p.id,
      code: p.code || p.degree || p.id.toUpperCase(),
      title: p.title,
      type: p.type || (p.level?.toLowerCase().includes('post') ? 'pg' : 'ug'),
      level: p.level || (p.type === 'pg' ? 'Postgraduate' : 'Undergraduate'),
      link: `/academics/${(p.code || p.id).toLowerCase().replace(/\s+/g, '-')}`,
      isCurrent
    };
  });

  return {
    department: targetDept,
    deptLink: targetDept ? `/departments/${targetDept.slug || targetDept.id}` : '/departments',
    deptName: targetDept?.name || 'Department Hub',
    programmes: formattedProgrammes,
    currentId
  };
}

/**
 * Get related UG programmes for a course
 */
export function getRelatedUgProgrammes(programme) {
  if (!programme || !Array.isArray(programme.relatedUgProgrammeIds)) return [];
  return programme.relatedUgProgrammeIds
    .map(id => getProgrammeById(id))
    .filter(Boolean);
}

/**
 * Get related PG programmes for a course
 */
export function getRelatedPgProgrammes(programme) {
  if (!programme || !Array.isArray(programme.relatedPgProgrammeIds)) return [];
  return programme.relatedPgProgrammeIds
    .map(id => getProgrammeById(id))
    .filter(Boolean);
}

/**
 * Get verified Academic Progression Pathways for a programme
 */
export function getProgressionPathways(programme) {
  if (!programme) return [];
  if (Array.isArray(programme.progressionPathway) && programme.progressionPathway.length > 0) {
    return programme.progressionPathway;
  }
  const dept = getDepartmentById(programme.departmentId);
  if (dept && Array.isArray(dept.pathways)) {
    return dept.pathways.filter(path => path.from === programme.id);
  }
  return [];
}

/**
 * Get all faculties with nested departments, programmes, and faculty count
 */
export function getFullAcademicHierarchy() {
  return FACULTIES.map(fac => {
    const depts = fac.departmentIds
      .map(deptId => getDepartmentById(deptId))
      .filter(Boolean)
      .map(dept => {
        const ugs = (dept.ugProgrammes || []).map(id => getProgrammeById(id)).filter(Boolean);
        const pgs = (dept.pgProgrammes || []).map(id => getProgrammeById(id)).filter(Boolean);
        const facList = getFacultyByDepartmentId(dept.id);
        return {
          ...dept,
          ugList: ugs,
          pgList: pgs,
          facultyList: facList,
          facultyCount: facList.length
        };
      });
    return {
      ...fac,
      departments: depts
    };
  });
}

/**
 * Get the connected PG / Master's programme for a UG department,
 * or the connected UG programme for a PG department.
 */
export function getDepartmentRelatedProgrammes(deptOrId) {
  if (!deptOrId) return null;
  const raw = typeof deptOrId === 'object' ? (deptOrId.id || deptOrId.slug || deptOrId.code || '') : String(deptOrId);
  const clean = raw.toLowerCase().trim().replace(/^dept[-_]/, '');
  const withPrefix = `dept-${clean}`;

  const relatedMap = {
    // 1. COMMERCE (B.Com <-> M.Com)
    'commerce': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Com',
      title: 'M.Com (Master of Commerce)',
      fullTitle: 'Master of Commerce (M.Com)',
      buttonText: 'M.Com Programme',
      route: '/departments/dept-pg-commerce',
      deptId: 'dept-pg-commerce',
      description: "Advance your expertise in Corporate Accounting, Financial Analysis, Taxation, Banking & Auditing with St. Philomena's M.Com degree."
    },
    'bcom': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Com',
      title: 'M.Com (Master of Commerce)',
      fullTitle: 'Master of Commerce (M.Com)',
      buttonText: 'M.Com Programme',
      route: '/departments/dept-pg-commerce',
      deptId: 'dept-pg-commerce',
      description: "Advance your expertise in Corporate Accounting, Financial Analysis, Taxation, Banking & Auditing with St. Philomena's M.Com degree."
    },
    'pg-commerce': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.Com',
      title: 'B.Com (Bachelor of Commerce)',
      fullTitle: 'Bachelor of Commerce (B.Com)',
      buttonText: 'B.Com Programme',
      route: '/departments/dept-commerce',
      deptId: 'dept-commerce',
      description: 'Foundational degree in Accounting, Corporate Taxation, Financial Markets, Auditing and International Finance.'
    },
    'mcom': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.Com',
      title: 'B.Com (Bachelor of Commerce)',
      fullTitle: 'Bachelor of Commerce (B.Com)',
      buttonText: 'B.Com Programme',
      route: '/departments/dept-commerce',
      deptId: 'dept-commerce',
      description: 'Foundational degree in Accounting, Corporate Taxation, Financial Markets, Auditing and International Finance.'
    },

    // 2. COMPUTER APPLICATIONS (BCA <-> MCA)
    'bca': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'MCA',
      title: 'MCA (Master of Computer Applications)',
      fullTitle: 'Master of Computer Applications (MCA)',
      buttonText: 'MCA Programme',
      route: '/departments/mca',
      deptId: 'dept-mca',
      description: 'AICTE-approved 2-year postgraduate professional program in Software Architecture, AI, Distributed Computing & Cloud Technologies.'
    },
    'mca': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'BCA',
      title: 'BCA (Bachelor of Computer Applications)',
      fullTitle: 'Bachelor of Computer Applications (BCA)',
      buttonText: 'BCA Programme',
      route: '/departments/bca',
      deptId: 'dept-bca',
      description: 'Undergraduate curriculum in Full-Stack Development, Data Structures, Database Management, and Software Engineering.'
    },

    // 3. MANAGEMENT (BBA <-> MBA)
    'management': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'MBA',
      title: 'MBA (Master of Business Administration)',
      fullTitle: 'Master of Business Administration (MBA)',
      buttonText: 'MBA Programme',
      route: '/departments/mba',
      deptId: 'dept-mba',
      description: 'AICTE-approved premier business administration program in Finance, Marketing, Human Resources & Strategic Leadership.'
    },
    'bba': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'MBA',
      title: 'MBA (Master of Business Administration)',
      fullTitle: 'Master of Business Administration (MBA)',
      buttonText: 'MBA Programme',
      route: '/departments/mba',
      deptId: 'dept-mba',
      description: 'AICTE-approved premier business administration program in Finance, Marketing, Human Resources & Strategic Leadership.'
    },
    'bba-th': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'MBA',
      title: 'MBA (Master of Business Administration)',
      fullTitle: 'Master of Business Administration (MBA)',
      buttonText: 'MBA Programme',
      route: '/departments/mba',
      deptId: 'dept-mba',
      description: 'AICTE-approved premier business administration program in Finance, Marketing, Human Resources & Strategic Leadership.'
    },
    'mba': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'BBA',
      title: 'BBA (Bachelor of Business Administration)',
      fullTitle: 'Bachelor of Business Administration (BBA)',
      buttonText: 'BBA Programme',
      route: '/departments/bba',
      deptId: 'dept-management',
      description: 'Undergraduate degree program in Management Studies, Business Analytics, Entrepreneurship & Marketing.'
    },

    // 4. COMPUTER SCIENCE (B.Sc CS <-> M.Sc CS)
    'computer-science': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Sc CS',
      title: 'M.Sc. Computer Science',
      fullTitle: 'M.Sc. in Computer Science',
      buttonText: 'M.Sc CS Programme',
      route: '/departments/dept-pg-computer-science',
      deptId: 'dept-pg-computer-science',
      description: 'Advanced postgraduate curriculum in Machine Learning, Algorithmic Engineering, Big Data & Systems Design.'
    },
    'pg-computer-science': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.Sc CS',
      title: 'B.Sc. Computer Science',
      fullTitle: 'B.Sc. in Computer Science',
      buttonText: 'B.Sc CS Programme',
      route: '/departments/dept-computer-science',
      deptId: 'dept-computer-science',
      description: 'Undergraduate studies in Programming Fundamentals, Operating Systems, Algorithms and Computer Architecture.'
    },

    // 5. CHEMISTRY (B.Sc <-> M.Sc)
    'chemistry': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Sc Chem',
      title: 'M.Sc. Chemistry',
      fullTitle: 'M.Sc. in Chemistry',
      buttonText: 'M.Sc Chemistry Programme',
      route: '/departments/dept-pg-chemistry',
      deptId: 'dept-pg-chemistry',
      description: 'Advanced research and laboratory instruction in Organic, Inorganic, Physical & Analytical Chemistry.'
    },
    'pg-chemistry': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.Sc Chem',
      title: 'B.Sc. Chemistry',
      fullTitle: 'B.Sc. in Chemistry',
      buttonText: 'B.Sc Chemistry Programme',
      route: '/departments/dept-chemistry',
      deptId: 'dept-chemistry',
      description: 'Undergraduate laboratory instruction and chemical foundations in Organic, Physical and Inorganic Chemistry.'
    },

    // 6. PHYSICS (B.Sc <-> M.Sc)
    'physics': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Sc Physics',
      title: 'M.Sc. Physics',
      fullTitle: 'M.Sc. in Physics',
      buttonText: 'M.Sc Physics Programme',
      route: '/departments/dept-pg-physics',
      deptId: 'dept-pg-physics',
      description: 'Postgraduate instruction in Condensed Matter Physics, Nuclear Physics, Optics & Applied Electronics.'
    },
    'pg-physics': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.Sc Physics',
      title: 'B.Sc. Physics',
      fullTitle: 'B.Sc. in Physics',
      buttonText: 'B.Sc Physics Programme',
      route: '/departments/dept-physics',
      deptId: 'dept-physics',
      description: 'Undergraduate foundational principles in Classical Mechanics, Electromagnetism, Quantum Mechanics & Optics.'
    },

    // 7. MATHEMATICS (B.Sc <-> M.Sc)
    'mathematics': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Sc Math',
      title: 'M.Sc. Mathematics',
      fullTitle: 'M.Sc. in Mathematics',
      buttonText: 'M.Sc Mathematics Programme',
      route: '/departments/dept-pg-mathematics',
      deptId: 'dept-pg-mathematics',
      description: 'Advanced study in Pure and Applied Mathematics, Complex Analysis, Differential Equations & Topology.'
    },
    'pg-mathematics': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.Sc Math',
      title: 'B.Sc. Mathematics',
      fullTitle: 'B.Sc. in Mathematics',
      buttonText: 'B.Sc Mathematics Programme',
      route: '/departments/dept-mathematics',
      deptId: 'dept-mathematics',
      description: 'Undergraduate curriculum in Algebra, Real Analysis, Calculus, Numerical Methods and Discrete Mathematics.'
    },

    // 8. BIOCHEMISTRY (B.Sc <-> M.Sc)
    'biochemistry': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Sc Biochem',
      title: 'M.Sc. Biochemistry',
      fullTitle: 'M.Sc. in Biochemistry',
      buttonText: 'M.Sc Biochemistry Programme',
      route: '/departments/dept-pg-biochemistry',
      deptId: 'dept-pg-biochemistry',
      description: 'Postgraduate research and laboratory study in Molecular Biology, Enzymology, Clinical Chemistry & Immunology.'
    },
    'pg-biochemistry': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.Sc Biochem',
      title: 'B.Sc. Biochemistry',
      fullTitle: 'B.Sc. in Biochemistry',
      buttonText: 'B.Sc Biochemistry Programme',
      route: '/departments/dept-biochemistry',
      deptId: 'dept-biochemistry',
      description: 'Undergraduate foundation in Biomolecules, Cellular Metabolism, Biochemical Techniques & Bioenergetics.'
    },

    // 9. CRIMINOLOGY & FORENSIC SCIENCE (B.Sc <-> M.Sc)
    'criminology': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Sc CFS',
      title: 'M.Sc. Criminology & Forensic Science',
      fullTitle: 'M.Sc. in Criminology & Forensic Science',
      buttonText: 'M.Sc CFS Programme',
      route: '/departments/dept-pg-cfs',
      deptId: 'dept-pg-cfs',
      description: 'Elite postgraduate training in Crime Scene Investigation, Forensic Toxicology, Cyber Forensics & Criminal Law.'
    },
    'cfs': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Sc CFS',
      title: 'M.Sc. Criminology & Forensic Science',
      fullTitle: 'M.Sc. in Criminology & Forensic Science',
      buttonText: 'M.Sc CFS Programme',
      route: '/departments/dept-pg-cfs',
      deptId: 'dept-pg-cfs',
      description: 'Elite postgraduate training in Crime Scene Investigation, Forensic Toxicology, Cyber Forensics & Criminal Law.'
    },
    'pg-cfs': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.Sc CFS',
      title: 'B.Sc. Criminology & Forensic Science',
      fullTitle: 'B.Sc. in Criminology & Forensic Science',
      buttonText: 'B.Sc CFS Programme',
      route: '/departments/dept-criminology',
      deptId: 'dept-criminology',
      description: 'Pioneering undergraduate program in Forensic Ballistics, Criminal Justice, Forensic Medicine & Police Science.'
    },

    // 10. ENGLISH (B.A <-> M.A)
    'english': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.A English',
      title: 'M.A. English',
      fullTitle: 'M.A. in English Literature',
      buttonText: 'M.A English Programme',
      route: '/departments/dept-pg-english',
      deptId: 'dept-pg-english',
      description: 'Master of Arts in British, American, Indian and World Literatures, Literary Theory, Criticism and Linguistics.'
    },
    'pg-english': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.A English',
      title: 'B.A. English',
      fullTitle: 'B.A. in English Literature',
      buttonText: 'B.A English Programme',
      route: '/departments/dept-english',
      deptId: 'dept-english',
      description: 'Undergraduate studies in English Literature, Communicative English, Cultural Studies & Critical Analysis.'
    },

    // 11. ECONOMICS (B.A <-> M.A)
    'economics': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.A Economics',
      title: 'M.A. Economics',
      fullTitle: 'M.A. in Economics',
      buttonText: 'M.A Economics Programme',
      route: '/departments/dept-pg-economics',
      deptId: 'dept-pg-economics',
      description: 'Advanced postgraduate curriculum in Econometrics, Macroeconomic Policy, Development Economics & Public Finance.'
    },
    'pg-economics': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.A Economics',
      title: 'B.A. Economics',
      fullTitle: 'B.A. in Economics',
      buttonText: 'B.A Economics Programme',
      route: '/departments/dept-economics',
      deptId: 'dept-economics',
      description: 'Undergraduate foundational study in Microeconomics, Macroeconomics, Indian Economy & Statistical Methods.'
    },

    // 12. JOURNALISM (B.A <-> M.A)
    'journalism': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.A Journalism',
      title: 'M.A. Journalism & Mass Communication',
      fullTitle: 'M.A. in Journalism & Mass Communication',
      buttonText: 'M.A Journalism Programme',
      route: '/departments/dept-pg-journalism',
      deptId: 'dept-pg-journalism',
      description: 'Postgraduate instruction in Digital Journalism, Broadcast Media, Film Studies, Advertising & Public Relations.'
    },
    'pg-journalism': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.A Journalism',
      title: 'B.A. Journalism',
      fullTitle: 'B.A. in Journalism & Mass Communication',
      buttonText: 'B.A Journalism Programme',
      route: '/departments/dept-journalism',
      deptId: 'dept-journalism',
      description: 'Undergraduate reporting, news writing, media ethics, photojournalism and digital content creation.'
    },

    // 13. PSYCHOLOGY (B.A/B.Sc <-> M.Sc)
    'psychology': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Sc Psychology',
      title: 'M.Sc. Psychology',
      fullTitle: 'M.Sc. in Psychology',
      buttonText: 'M.Sc Psychology Programme',
      route: '/departments/dept-pg-psychology',
      deptId: 'dept-pg-psychology',
      description: 'Advanced postgraduate specialization in Clinical, Counselling, Organizational & Neuropsychology.'
    },
    'pg-psychology': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.Sc Psychology',
      title: 'B.Sc. / B.A. Psychology',
      fullTitle: 'B.Sc. / B.A. in Psychology',
      buttonText: 'B.Sc Psychology Programme',
      route: '/departments/dept-psychology',
      deptId: 'dept-psychology',
      description: 'Undergraduate foundations in General Psychology, Developmental Psychology, Social Psychology & Psychometry.'
    },

    // 14. SOCIAL WORK (BSW <-> MSW)
    'social-work': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'MSW',
      title: 'Master of Social Work (MSW)',
      fullTitle: 'Master of Social Work (MSW)',
      buttonText: 'MSW Programme',
      route: '/departments/dept-pg-social-work',
      deptId: 'dept-pg-social-work',
      description: "Master's program in Community Development, Medical & Psychiatric Social Work, and Human Resource Management."
    },
    'bsw': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'MSW',
      title: 'Master of Social Work (MSW)',
      fullTitle: 'Master of Social Work (MSW)',
      buttonText: 'MSW Programme',
      route: '/departments/dept-pg-social-work',
      deptId: 'dept-pg-social-work',
      description: "Master's program in Community Development, Medical & Psychiatric Social Work, and Human Resource Management."
    },
    'pg-social-work': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'BSW',
      title: 'Bachelor of Social Work (BSW)',
      fullTitle: 'Bachelor of Social Work (BSW)',
      buttonText: 'BSW Programme',
      route: '/departments/dept-social-work',
      deptId: 'dept-social-work',
      description: 'Undergraduate field-work intensive degree in Social Welfare, Community Organizing & NGO Management.'
    },
    'msw': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'BSW',
      title: 'Bachelor of Social Work (BSW)',
      fullTitle: 'Bachelor of Social Work (BSW)',
      buttonText: 'BSW Programme',
      route: '/departments/dept-social-work',
      deptId: 'dept-social-work',
      description: 'Undergraduate field-work intensive degree in Social Welfare, Community Organizing & NGO Management.'
    },

    // 15. FOOD SCIENCE & NUTRITION (B.Sc <-> M.Sc)
    'food-science': {
      type: 'pg',
      badge: "Master's Programme",
      code: 'M.Sc Food Science',
      title: 'M.Sc. Food Science & Nutrition',
      fullTitle: 'M.Sc. in Food Science & Nutrition',
      buttonText: 'M.Sc Food Science Programme',
      route: '/departments/dept-pg-food-science',
      deptId: 'dept-pg-food-science',
      description: 'Postgraduate research in Clinical Nutrition, Food Processing, Quality Assurance, Dietetics & Nutraceuticals.'
    },
    'pg-food-science': {
      type: 'ug',
      badge: 'Undergraduate Degree',
      code: 'B.Sc Food Science',
      title: 'B.Sc. Food Science & Nutrition',
      fullTitle: 'B.Sc. in Food Science & Nutrition',
      buttonText: 'B.Sc Food Science Programme',
      route: '/departments/dept-food-science',
      deptId: 'dept-food-science',
      description: 'Undergraduate curriculum in Food Microbiology, Nutritional Biochemistry, Food Safety & Diet Therapy.'
    }
  };

  return relatedMap[clean] || relatedMap[raw] || relatedMap[withPrefix] || null;
}
