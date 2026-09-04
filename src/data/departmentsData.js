// Canonical Authentic Departments Directory for St. Philomena's College (Autonomous), Mysuru
import { DEPARTMENTS as CANONICAL_DEPTS, getDepartmentById as getCanonicalDeptById } from './academicsHierarchyData';

export const DEPARTMENTS = CANONICAL_DEPTS.map(d => ({
  id: d.slug,
  deptId: d.id,
  slug: d.slug,
  name: d.name,
  category: d.faculty,
  head: 'Head of the Department',
  headDesignation: 'Associate Professor / Assistant Professor',
  headEmail: `hod.${d.slug}@stphilos.ac.in`,
  tagline: 'Excellence in Pedagogy, Research, and Value-Based Education',
  bannerImage: d.photoUrl || '/assets/images/campus_quad.jpg',
  description: d.description,
  vision: d.vision,
  mission: d.mission,
  history: `The ${d.name} at St. Philomena's College (Autonomous), Mysuru has a distinguished legacy of academic excellence, comprehensive laboratory infrastructure, and research accomplishments.`,
  achievements: [
    'Consistent university distinctions and top semester academic performances.',
    'Active student participation in research workshops, internships, and symposiums.',
    'Strong career placements and direct admissions into prestigious postgraduate institutions.'
  ],
  futurePlans: [
    'To introduce advanced interdisciplinary research modules and skill-enhancement certificates.',
    'To strengthen industry-academia MoUs and specialized corporate internships.',
    'To host regional and national academic conferences in emerging disciplines.'
  ],
  programmes: [
    ...(d.ugProgrammes || []).map(code => ({ code, name: code.toUpperCase(), level: 'Undergraduate', duration: '3 / 4 Years' })),
    ...(d.pgProgrammes || []).map(code => ({ code, name: code.toUpperCase(), level: 'Postgraduate', duration: '2 Years' }))
  ],
  facilities: [
    'Departmental specialized reference archives and digital learning resources.',
    'Advanced state-of-the-art laboratory instrumentation suites.',
    'Audio-Visual smart seminar facilities for academic workshops.'
  ]
}));

export function getDepartmentById(idOrSlug) {
  if (!idOrSlug) return null;
  const canonical = getCanonicalDeptById(idOrSlug);
  if (canonical) {
    return DEPARTMENTS.find(d => d.slug === canonical.slug || d.deptId === canonical.id) || null;
  }
  const clean = String(idOrSlug).toLowerCase().trim();
  return DEPARTMENTS.find(d => d.id === clean || d.slug === clean || d.deptId === clean) || null;
}
