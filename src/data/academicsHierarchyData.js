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
    'mca': 'dept-bca',
    'bba': 'dept-management',
    'mba': 'dept-management',
    'management-studies': 'dept-management',
    'commerce': 'dept-commerce',
    'bcom': 'dept-commerce',
    'mcom': 'dept-commerce'
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

  // 2. MCA: Returns strictly all 5 authentic MCA Present Faculties (PRESERVED GOLD STANDARD)
  if (code === 'MCA') {
    return FACULTY_MEMBERS.filter(f => 
      f.departmentId === 'dept-bca' && 
      (f.programmeCode === 'MCA' || f.programmeType === 'pg')
    );
  }

  // 3. BBA: Returns strictly BBA Undergraduate Faculty
  if (code === 'BBA') {
    return FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-management' || f.departmentId === 'management') && 
      f.programmeCode === 'BBA'
    );
  }

  // 4. MBA: Returns strictly MBA Postgraduate Faculty
  if (code === 'MBA') {
    return FACULTY_MEMBERS.filter(f => 
      (f.departmentId === 'dept-management' || f.departmentId === 'management') && 
      f.programmeCode === 'MBA'
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
  const progs = getLiveProgrammes();
  return progs.find(p => {
    const pId = (p.id || '').toLowerCase();
    const pSlug = (p.slug || '').toLowerCase();
    const pCode = (p.code || '').toLowerCase();
    const pName = (p.name || '').toLowerCase();
    return pId === key || pSlug === key || pCode === key || pName === key ||
           pId.replace(/[^a-z0-9]/g, '') === key.replace(/[^a-z0-9]/g, '') ||
           pCode.replace(/[^a-z0-9]/g, '') === key.replace(/[^a-z0-9]/g, '') ||
           pSlug.replace(/[^a-z0-9]/g, '') === key.replace(/[^a-z0-9]/g, '');
  }) || null;
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
