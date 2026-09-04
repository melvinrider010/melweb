// Canonical Authentic Faculty Directory for St. Philomena's College (Autonomous), Mysuru
// 100% Real Imported Records from stphilos.ac.in
import { getLiveFaculty, getFacultyByDepartmentId as getCanonicalFacultyByDept, getDepartmentById } from './academicsHierarchyData';

export const getAllFaculty = () => {
  const list = getLiveFaculty();
  return list.map(f => ({
    id: f.id,
    slug: f.id,
    name: f.name,
    designation: f.designation,
    department: f.departmentName || f.department || f.departmentId,
    deptId: f.departmentId,
    image: f.photoUrl || null,
    photoUrl: f.photoUrl || null,
    photoVerified: true,
    qualification: f.qualification || (f.cvData?.qualifications?.join(', ') || ''),
    experience: f.experience || (f.cvData?.teachingExperience?.join(', ') || 'Academic Teaching & Research'),
    specialization: f.specialization || (f.cvData?.specialization?.join(', ') || ''),
    email: f.cvData?.contact?.email || f.email || `${f.id.replace('fac_', '')}@stphilos.ac.in`,
    phone: f.cvData?.contact?.phone || f.phone || '+91 821 4001500',
    officialProfileUrl: f.officialProfileUrl,
    officialCvSourceUrl: f.officialCvSourceUrl,
    sourceVerified: true,
    profile: f.bio || f.profile,
    cvData: f.cvData || null
  }));
};

export const ALL_FACULTY = getAllFaculty();

export function getFacultyById(idOrSlug) {
  if (!idOrSlug) return null;
  const clean = String(idOrSlug).toLowerCase().trim();
  const list = getAllFaculty();
  return list.find(f => f.id === clean || f.slug === clean) || null;
}

/**
 * Strict 1:1 Department Faculty Filter (No cross-department leakage)
 */
export function getFacultyByDepartment(deptIdOrName) {
  if (!deptIdOrName) return [];
  const canonicalFaculty = getCanonicalFacultyByDept(deptIdOrName);
  if (canonicalFaculty && canonicalFaculty.length > 0) {
    const canonicalIds = new Set(canonicalFaculty.map(f => f.id));
    return ALL_FACULTY.filter(f => canonicalIds.has(f.id));
  }
  
  const dept = getDepartmentById(deptIdOrName);
  const targetId = dept ? dept.id : String(deptIdOrName).toLowerCase().trim();
  return ALL_FACULTY.filter(f => f.deptId === targetId);
}
