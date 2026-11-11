import api from './api.js';
import hierarchyData from '../data/academicsHierarchyData.json';
import honeycombData from '../data/honeycomb-programmes.json';
import alumniData from '../data/alumniData.json';
import noticesData from '../data/notices.json';
import eventsData from '../data/events.json';
import mediaData from '../data/media.json';
import slidersData from '../data/sliders.json';
import userData from '../data/users.json';
import logData from '../data/activity-logs.json';
import settingsData from '../data/settings.json';
import { initialMegaMenuData } from '../data/megaMenuData.js';
import { SYLLABUS_REGISTRY } from '../data/syllabusData.js';
import departmentAssetsManifest from '../data/departmentAssetsManifest.json';
import masterPagesData from '../data/masterPagesData.json';
import aboutData from '../data/aboutData.json';

const STORAGE_KEY = 'stphilos_cms_store_v11';
const REVISIONS_KEY = 'stphilos_cms_revisions_v11';

export const initialHeaderConfig = {
  topBar: {
    enabled: true,
    announcementText: "Admissions Open for Academic Year 2026–27 | UGC Autonomous Catholic College",
    announcementLink: "/admissions",
    phone: "+91 9008580707, 9008028258",
    showPhone: true,
    showContactDesk: true,
    contactDeskLabel: "Contact Desk",
    contactDeskLink: "/contact",
    showSearch: true
  },
  branding: {
    logoUrl: "/assets/images/logo/official_college_banner_logo_transparent.png",
    fallbackLogoUrl: "/assets/images/logo/official_college_banner_logo.png",
    altText: "St. Philomena's College (Autonomous), Mysuru",
    homeLink: "/"
  },
  ctaButton: {
    enabled: true,
    label: "Apply Online 2026–27",
    url: "https://student.stphiloserp.in/",
    target: "_blank"
  },
  navItems: [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT US', path: '/about', megaKey: 'about' },
    { label: 'ACADEMICS', path: '/academics', megaKey: 'academics' },
    { label: 'EXAMINATION', path: '/examinations', megaKey: 'examinations' },
    { label: 'RESOURCE', path: '/resources', megaKey: 'research' },
    { label: 'STUDENT SUPPORT', path: '/student-support', megaKey: 'studentSupport' },
    { label: 'MANDATORY DISCLOSURE', path: '/mandatory-disclosure', megaKey: 'compliance' },
    { label: 'IQAC', path: '/iqac', megaKey: 'iqac' },
    { label: 'ALUMNI', path: '/alumni' },
    { label: 'CONTACT US', path: '/contact' }
  ]
};

export const initialFooterConfig = {
  brand: {
    crestUrl: "/assets/images/logo/crest_gold_hd.png",
    fallbackCrestUrl: "/assets/images/logo/crest_white_hd.png",
    title: "St. Philomena's College",
    subtitle: "(Autonomous), Mysuru · Est. 1946",
    description: "Affiliated to the University of Mysore. A premier UGC Autonomous Catholic institution managed by the Mysore Diocesan Educational Society (MDES). Re-accredited by NAAC with Cycle III B++ Grade (2020)."
  },
  columns: [
    {
      title: "Academics",
      links: [
        { label: "UG Programmes (B.Sc, BCA, B.Com, BBA, BA, BSW, B.Voc)", path: "/academics" },
        { label: "PG Programmes (M.Sc, M.Com, MA, MSW, MCA, MBA)", path: "/academics" },
        { label: "Academic Departments", path: "/departments" },
        { label: "Searchable Faculty Directory", path: "/faculty" },
        { label: "Central Library & Syllabus", path: "/resources" }
      ]
    },
    {
      title: "Examinations",
      links: [
        { label: "Autonomous Exam Timetables", path: "/examinations" },
        { label: "End-Semester Results Portal", path: "/examinations" },
        { label: "Revaluation & Photocopy Forms", path: "/examinations" },
        { label: "Prospectus & Admissions 2026–27", path: "/admissions" }
      ]
    },
    {
      title: "Mandatory Disclosure",
      links: [
        { label: "UGC & AICTE Disclosures", path: "/compliance" },
        { label: "IQAC Quality Benchmarks", path: "/iqac" },
        { label: "Statutory Governing Bodies", path: "/compliance" },
        { label: "Student Grievance Committee", path: "/compliance" },
        { label: "RTI & Institutional Desk", path: "/contact" }
      ]
    }
  ],
  bottomBar: {
    copyrightText: "St. Philomena's College (Autonomous), Mysuru. All Rights Reserved.",
    links: [
      { label: "About MDES", path: "/about" },
      { label: "Privacy & Terms", path: "/compliance" },
      { label: "Contact Support", path: "/contact" },
      { label: "CMS Portal", path: "/admin/login" }
    ]
  },
  socialLinks: {
    facebook: "https://facebook.com",
    twitter: "https://twitter.com",
    instagram: "https://instagram.com",
    youtube: "https://youtube.com",
    linkedin: "https://linkedin.com"
  }
};

// 1. Initial State Seeding
function getInitialData() {
  const manifestMap = new Map((departmentAssetsManifest || []).map(m => [m.deptId, m]));

  const seededFaculty = (hierarchyData.faculty || []).map(f => ({
    ...f,
    status: f.status || 'published',
    origin: f.origin || 'imported',
    order: f.order || 0
  }));

  const seededDepartments = (hierarchyData.departments || []).map(d => {
    const manifest = manifestMap.get(d.id);
    return {
      ...d,
      photoUrl: manifest?.bannerRelPath || d.photoUrl || '/assets/banner-college.jpg',
      status: d.status || 'published',
      origin: d.origin || 'imported',
      order: d.order || 0
    };
  });

  // Build a map of honeycomb programmes
  const hcMap = new Map();
  (honeycombData || []).forEach(hc => {
    hcMap.set((hc.id || '').toLowerCase(), hc);
    hcMap.set((hc.code || '').toLowerCase(), hc);
  });

  const baseProgrammes = (hierarchyData.programmes || []).map(p => {
    const pKey = (p.id || '').toLowerCase();
    const pCodeKey = (p.code || '').toLowerCase();
    const hcMatch = hcMap.get(pKey) || hcMap.get(pCodeKey) || {};
    const isHc = p.is_featured_honeycomb !== undefined 
      ? Boolean(p.is_featured_honeycomb) 
      : (p.isFeaturedHoneycomb !== undefined ? Boolean(p.isFeaturedHoneycomb) : (hcMatch.id !== undefined));
    return {
      ...p,
      displayLines: p.displayLines || hcMatch.displayLines || [p.name || p.title || p.code],
      duration: p.duration || hcMatch.duration || '3 Years / 4 Years (NEP 2020)',
      is_featured_honeycomb: isHc,
      isFeaturedHoneycomb: isHc,
      status: p.status || 'published',
      origin: p.origin || 'imported',
      order: p.order || 0
    };
  });

  // Ensure all honeycomb items exist in baseProgrammes
  (honeycombData || []).forEach(hc => {
    const existing = baseProgrammes.find(p => 
      (p.id || '').toLowerCase() === (hc.id || '').toLowerCase() ||
      (p.code || '').toLowerCase() === (hc.code || '').toLowerCase()
    );
    if (!existing) {
      baseProgrammes.push({
        id: hc.id,
        code: hc.code,
        name: hc.title,
        title: hc.title,
        level: hc.type || 'ug',
        type: hc.type || 'ug',
        displayLines: hc.displayLines,
        duration: hc.duration,
        description: hc.description,
        link: hc.link,
        is_featured_honeycomb: true,
        isFeaturedHoneycomb: true,
        status: 'published',
        origin: 'imported',
        order: 0
      });
    }
  });

  const seededProgrammes = baseProgrammes;

  const seededPages = (masterPagesData || []).map(p => ({
    ...p,
    status: p.status || 'published',
    origin: p.origin || 'system'
  }));

  const seededSyllabuses = (hierarchyData.departments || []).map(dept => {
    const manifest = manifestMap.get(dept.id);
    const customSyl = SYLLABUS_REGISTRY[dept.slug] || SYLLABUS_REGISTRY[dept.id.replace('dept-', '')] || SYLLABUS_REGISTRY.bca;
    
    return {
      id: `syl-${dept.id}`,
      code: dept.code || dept.shortName || dept.name,
      slug: dept.slug || dept.id,
      title: `${dept.name} Autonomous Curriculum & Syllabus Scheme`,
      degree: dept.faculty || 'Autonomous Degree Curriculum (NEP 2020 / CBCS)',
      department: dept.name,
      deptSlug: dept.slug || dept.id,
      departmentId: dept.id,
      totalCredits: 144,
      semestersCount: 6,
      regulation: 'Autonomous NEP 2020 / CBCS Curriculum Scheme',
      localPdf: manifest?.syllabusRelPath || `/assets/departments/${dept.id}/syllabus/${dept.slug || dept.id}-official-syllabus.pdf`,
      semesters: customSyl?.semesters || [],
      status: 'published',
      lastModified: '2026-09-02'
    };
  });

  const seededDepartmentDocs = (hierarchyData.departments || []).map(dept => {
    const manifest = manifestMap.get(dept.id);
    return {
      id: `doc-${dept.id}`,
      title: `${dept.name} - Laboratory Manual & Department Regulations`,
      category: 'Lab Manual',
      year: '2026',
      departmentId: dept.id,
      department: dept.name,
      filename: `${dept.slug || dept.id}-lab-manual-and-regulations.pdf`,
      localPath: manifest?.docRelPath || `/assets/departments/${dept.id}/documents/${dept.slug || dept.id}-lab-manual-and-regulations.pdf`,
      fileSize: 1024 * 750,
      status: 'published',
      lastModified: '2026-09-02'
    };
  });

  const seededLeadership = (aboutData.administration || []).map((l, idx) => ({
    ...l,
    order: l.order !== undefined ? l.order : idx + 1,
    status: l.status || 'published',
    objectPosition: l.objectPosition || (
      l.id === 'president-mdes' || l.id === 'bishop-president' || (l.name || '').toLowerCase().includes('francis') ? '50% 12%'
      : l.id === 'rector' || (l.name || '').toLowerCase().includes('lourdu') ? '50% 18%'
      : '50% 15%'
    ),
    link: l.link || (
      l.id === 'rector' ? '/leadership/rector'
      : l.id === 'principal' ? '/leadership/principal'
      : l.id === 'president-mdes' ? '/leadership/bishop'
      : l.id === 'finance-officer' ? '/leadership/financial-officer'
      : l.id === 'pg-coordinator' ? '/leadership/pg-coordinator'
      : l.id === 'iqac-coord' ? '/leadership/iqac-coordinator'
      : null
    )
  }));

  return {
    faculty: seededFaculty,
    departments: seededDepartments,
    programmes: seededProgrammes,
    syllabuses: seededSyllabuses,
    departmentDocs: seededDepartmentDocs,
    pages: seededPages,
    leadership: seededLeadership,
    events: [...eventsData],
    notices: [...noticesData],
    documents: [],
    media: [...mediaData],
    sliders: [...slidersData],
    alumni: [...(alumniData.initialRegistrations || [])],
    menus: initialMegaMenuData || {},
    users: [...userData],
    logs: [...logData],
    settings: { ...settingsData },
    headerConfig: JSON.parse(JSON.stringify(initialHeaderConfig)),
    footerConfig: JSON.parse(JSON.stringify(initialFooterConfig)),
    conflicts: []
  };
}

// 2. Load from LocalStorage or Seed Initial
function loadCache() {
  if (typeof window === 'undefined') return getInitialData();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      const initial = getInitialData();
      // If cached academics menu still had isImageCard, refresh it to initial clean typographic
      if (parsed.menus?.academics?.columns?.some(c => c.isImageCard)) {
        parsed.menus.academics = initialMegaMenuData.academics;
      }
      if (parsed.menus?.research?.columns?.[0]?.links?.some(l => l.label === 'E Journal' && l.path !== '/e-journal')) {
        parsed.menus.research = initialMegaMenuData.research;
      }
      if (parsed.menus?.studentSupport?.columns?.[1]?.links?.some(l => l.label === 'Philos Bulletin' && l.path !== '/e-journal')) {
        parsed.menus.studentSupport = initialMegaMenuData.studentSupport;
      }
      if (!parsed.programmes || !Array.isArray(parsed.programmes) || parsed.programmes.length === 0) {
        parsed.programmes = initial.programmes;
      } else {
        const initialProgMap = new Map(initial.programmes.map(p => [p.id, p]));
        parsed.programmes = parsed.programmes.map(p => {
          const initP = initialProgMap.get(p.id) || {};
          const isHc = p.is_featured_honeycomb !== undefined 
            ? Boolean(p.is_featured_honeycomb) 
            : (p.isFeaturedHoneycomb !== undefined ? Boolean(p.isFeaturedHoneycomb) : (initP.isFeaturedHoneycomb !== false));
          return {
            ...initP,
            ...p,
            status: p.status !== undefined ? p.status : (initP.status || 'published'),
            is_featured_honeycomb: isHc,
            isFeaturedHoneycomb: isHc
          };
        });
      }
      if (!parsed.departments || !Array.isArray(parsed.departments) || parsed.departments.length === 0) {
        parsed.departments = initial.departments;
      } else {
        const initialDeptMap = new Map(initial.departments.map(d => [d.id, d]));
        parsed.departments = parsed.departments.map(d => {
          const initD = initialDeptMap.get(d.id) || {};
          return {
            ...initD,
            ...d,
            status: d.status !== undefined ? d.status : (initD.status || 'published')
          };
        });
      }
      if (!parsed.faculty || !Array.isArray(parsed.faculty) || parsed.faculty.length === 0) {
        parsed.faculty = initial.faculty;
      } else {
        const cachedMap = new Map(parsed.faculty.map(f => [f.id || f.name, f]));
        const mergedFaculty = initial.faculty.map(initF => {
          const cached = cachedMap.get(initF.id) || cachedMap.get(initF.name);
          return cached ? { ...initF, ...cached } : initF;
        });
        const initialIdSet = new Set(initial.faculty.map(f => f.id));
        const initialNameSet = new Set(initial.faculty.map(f => (f.name || '').toLowerCase()));
        parsed.faculty.forEach(f => {
          if (!initialIdSet.has(f.id) && !initialNameSet.has((f.name || '').toLowerCase())) {
            mergedFaculty.push(f);
          }
        });
        parsed.faculty = mergedFaculty;
      }
      if (!parsed.syllabuses || !Array.isArray(parsed.syllabuses) || parsed.syllabuses.length === 0) {
        parsed.syllabuses = initial.syllabuses;
      }
      if (!parsed.departmentDocs || !Array.isArray(parsed.departmentDocs) || parsed.departmentDocs.length === 0) {
        parsed.departmentDocs = initial.departmentDocs;
      }
      if (!parsed.alumni || !Array.isArray(parsed.alumni) || parsed.alumni.length === 0) {
        parsed.alumni = initial.alumni;
      }
      if (!parsed.pages || !Array.isArray(parsed.pages) || parsed.pages.length < initial.pages.length) {
        const cachedPageMap = new Map((parsed.pages || []).map(p => [p.slug || p.id, p]));
        const mergedPages = initial.pages.map(initP => {
          const cached = cachedPageMap.get(initP.slug) || cachedPageMap.get(initP.id);
          return cached ? { ...initP, ...cached } : initP;
        });
        const initialSlugSet = new Set(initial.pages.map(p => p.slug));
        (parsed.pages || []).forEach(p => {
          if (p.slug && !initialSlugSet.has(p.slug)) {
            mergedPages.push(p);
          }
        });
        parsed.pages = mergedPages;
      }
      if (!parsed.leadership || !Array.isArray(parsed.leadership) || parsed.leadership.length === 0) {
        parsed.leadership = initial.leadership;
      } else {
        const cachedLeaderMap = new Map(parsed.leadership.map(l => [l.id, l]));
        const mergedLeadership = initial.leadership.map(initL => {
          const cached = cachedLeaderMap.get(initL.id);
          return cached ? { ...initL, ...cached } : initL;
        });
        const initialLeaderIdSet = new Set(initial.leadership.map(l => l.id));
        parsed.leadership.forEach(l => {
          if (l.id && !initialLeaderIdSet.has(l.id)) {
            mergedLeadership.push(l);
          }
        });
        parsed.leadership = mergedLeadership.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
      }
      if (!parsed.events || !Array.isArray(parsed.events)) {
        parsed.events = initial.events;
      } else {
        const cachedEventIds = new Set(parsed.events.map(e => String(e.id)));
        const missingInitialEvents = initial.events.filter(e => !cachedEventIds.has(String(e.id)));
        if (missingInitialEvents.length > 0) {
          parsed.events = [...missingInitialEvents, ...parsed.events];
        }
      }
      if (!parsed.settings || typeof parsed.settings !== 'object') {
        parsed.settings = { ...initial.settings };
      } else {
        parsed.settings = { ...initial.settings, ...parsed.settings };
        if (parsed.settings.phone === '+91 9008580707') {
          parsed.settings.phone = initial.settings.phone;
        }
        if (parsed.settings.mobile === '+91 9008580707') {
          parsed.settings.mobile = initial.settings.mobile;
        }
      }
      if (!parsed.headerConfig || typeof parsed.headerConfig !== 'object') {
        parsed.headerConfig = JSON.parse(JSON.stringify(initial.headerConfig));
      } else {
        parsed.headerConfig = { ...initial.headerConfig, ...parsed.headerConfig };
      }
      if (!parsed.footerConfig || typeof parsed.footerConfig !== 'object') {
        parsed.footerConfig = JSON.parse(JSON.stringify(initial.footerConfig));
      } else {
        parsed.footerConfig = { ...initial.footerConfig, ...parsed.footerConfig };
      }
      return { ...initial, ...parsed };
    }
  } catch (e) {
    console.warn('Error loading CMS store from localStorage:', e);
  }
  const initial = getInitialData();
  saveCache(initial);
  return initial;
}

function saveCache(data) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    // Gracefully handle browser storage quota without unhandled exceptions
    if (e?.name === 'QuotaExceededError' || e?.code === 22) {
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (_) {}
    }
  }
}

// Revision Engine
function loadRevisions() {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(REVISIONS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function saveRevision(entityType, entityId, snapshot, user = 'Administrator') {
  if (typeof window === 'undefined' || !entityId) return;
  try {
    const revisions = loadRevisions();
    const key = `${entityType}:${entityId}`;
    revisions[key] = revisions[key] || [];
    revisions[key].unshift({
      id: `rev-${Date.now()}`,
      timestamp: new Date().toISOString(),
      user,
      snapshot: JSON.parse(JSON.stringify(snapshot))
    });
    // Cap at last 20 revisions per entity
    if (revisions[key].length > 20) {
      revisions[key] = revisions[key].slice(0, 20);
    }
    localStorage.setItem(REVISIONS_KEY, JSON.stringify(revisions));
  } catch (e) {
    console.warn('Failed to save revision:', e);
  }
}

let cache = loadCache();

// Cross-tab Synchronization Channel
let broadcastChannel = null;
if (typeof window !== 'undefined' && typeof window.BroadcastChannel !== 'undefined') {
  try {
    broadcastChannel = new BroadcastChannel('stphilos_cms_sync');
    broadcastChannel.onmessage = (event) => {
      if (event.data?.type === 'STORE_UPDATED') {
        cache = loadCache();
        window.dispatchEvent(new Event('cms_store_updated'));
      }
    };
  } catch (e) {
    // Continue if BroadcastChannel is restricted
  }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) {
      cache = loadCache();
      window.dispatchEvent(new Event('cms_store_updated'));
    }
  });
}

function emitUpdate(shouldSave = true) {
  if (shouldSave) {
    saveCache(cache);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cms_store_updated'));
    try {
      broadcastChannel?.postMessage({ type: 'STORE_UPDATED', timestamp: Date.now() });
    } catch (e) {
      // Ignore channel errors
    }
  }
}

/**
 * Background synchronizer with Laravel backend API
 */
export async function syncWithBackend() {
  if (typeof window === 'undefined') return;
  try {
    const settings = await api.get('/settings').catch(() => null);
    if (settings && typeof settings === 'object') {
      let changed = false;
      if (settings.headerConfig && typeof settings.headerConfig === 'object') {
        cache.headerConfig = { ...cache.headerConfig, ...settings.headerConfig };
        changed = true;
      }
      if (settings.footerConfig && typeof settings.footerConfig === 'object') {
        cache.footerConfig = { ...cache.footerConfig, ...settings.footerConfig };
        changed = true;
      }
      if (Array.isArray(settings.leadership) && settings.leadership.length > 0) {
        cache.leadership = settings.leadership;
        changed = true;
      }
      if (Array.isArray(settings.pages) && settings.pages.length > 0) {
        cache.pages = settings.pages;
        changed = true;
      }
      if (settings.menus && typeof settings.menus === 'object') {
        cache.menus = settings.menus;
        changed = true;
      }
      if (changed) {
        emitUpdate(true);
      }
    }

    const sliders = await api.get('/sliders').catch(() => null);
    if (Array.isArray(sliders) && sliders.length > 0) {
      cache.sliders = sliders;
      emitUpdate(true);
    }
  } catch (err) {
    // Graceful offline fallback
  }
}

if (typeof window !== 'undefined') {
  setTimeout(syncWithBackend, 60);
}

// 3. Central CMS Store Object
export const cmsStore = {
  // Sync helper
  getSnapshot: () => ({ ...cache }),
  syncWithBackend,

  init: () => {
    syncWithBackend();
  },

  reloadFromStorage: () => {
    cache = loadCache();
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cms_store_updated'));
    }
  },
  
  // ================= 1. FACULTY MANAGEMENT =================
  getFaculty: (filters = {}) => {
    let list = cache.faculty || [];
    if (filters.status && filters.status !== 'all') {
      list = list.filter(f => f.status === filters.status);
    }
    if (filters.departmentId && filters.departmentId !== 'all') {
      list = list.filter(f => f.departmentId === filters.departmentId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(f => 
        (f.name && f.name.toLowerCase().includes(q)) ||
        (f.designation && f.designation.toLowerCase().includes(q)) ||
        (f.qualification && f.qualification.toLowerCase().includes(q)) ||
        (f.departmentName && f.departmentName.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getFacultyById: (id) => {
    return (cache.faculty || []).find(f => f.id === id || f.slug === id);
  },

  getFacultyByDepartment: (deptIdOrSlug) => {
    if (!deptIdOrSlug) return [];
    const clean = String(deptIdOrSlug).toLowerCase().trim();
    return (cache.faculty || []).filter(f => 
      f.departmentId === clean || 
      (f.departmentId && f.departmentId.toLowerCase() === clean) ||
      (f.departmentSlug && f.departmentSlug.toLowerCase() === clean)
    );
  },

  saveFaculty: async (facultyItem, user = 'Administrator') => {
    const isNew = !facultyItem.id;
    const id = isNew ? `faculty-${Date.now()}` : facultyItem.id;
    const slug = facultyItem.slug || facultyItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    // Resolve Department Name
    const dept = (cache.departments || []).find(d => d.id === facultyItem.departmentId || d.deptId === facultyItem.departmentId);
    const departmentName = dept ? dept.name : (facultyItem.departmentName || '');

    const record = {
      ...facultyItem,
      id,
      slug,
      departmentName,
      status: facultyItem.status || 'published',
      origin: isNew ? 'local' : 'local_modified',
      lastModified: new Date().toISOString()
    };

    // Save revision for rollback
    saveRevision('faculty', id, record, user);

    const existingIndex = (cache.faculty || []).findIndex(f => 
      f.id === id || 
      (f.slug && record.slug && f.slug === record.slug) ||
      (f.name && record.name && f.name.toLowerCase().trim().replace(/^(dr\.?|mr\.?|ms\.?|mrs\.?|prof\.?|lt\.?)\s+/i, '') === record.name.toLowerCase().trim().replace(/^(dr\.?|mr\.?|ms\.?|mrs\.?|prof\.?|lt\.?)\s+/i, ''))
    );

    if (existingIndex >= 0) {
      const target = cache.faculty[existingIndex];
      cache.faculty[existingIndex] = { ...target, ...record, id: target.id || record.id };
    } else {
      cache.faculty = [record, ...(cache.faculty || [])];
    }

    emitUpdate();

    // Log Activity
    cmsStore.logActivity(`Saved faculty: ${record.name} (${departmentName})`, user);

    // Sync to backend database when server is active
    api.post('/admin/faculty', {
      id: record.id,
      name: record.name,
      designation: record.designation,
      department: record.departmentName || record.departmentId,
      qualification: record.qualification,
      profile: record.profile || record.bio || '',
      photoUrl: record.photoUrl
    }).catch(() => {
      // Offline fallback: data is securely saved in local directory and store cache
    });

    return record;
  },

  deleteFaculty: async (id, user = 'Administrator') => {
    const existing = (cache.faculty || []).find(f => f.id === id);
    if (existing) {
      saveRevision('faculty', id, { ...existing, status: 'deleted' }, user);
      cache.faculty = (cache.faculty || []).filter(f => f.id !== id);
      emitUpdate();
      cmsStore.logActivity(`Deleted faculty ID: ${id}`, user);
    }
    // Sync deletion to backend database
    api.delete(`/admin/faculty/${id}`).catch(() => {});
    return cache.faculty;
  },

  // ================= LEADERSHIP & ADMINISTRATION MANAGEMENT =================
  getLeadership: (filters = {}) => {
    let list = [...(cache.leadership || [])];
    if (filters.status && filters.status !== 'all') {
      if (filters.status === 'active' || filters.status === 'published') {
        list = list.filter(l => l.status !== 'inactive' && l.status !== 'draft');
      } else if (filters.status === 'inactive' || filters.status === 'draft') {
        list = list.filter(l => l.status === 'inactive' || l.status === 'draft');
      } else {
        list = list.filter(l => l.status === filters.status);
      }
    }
    if (filters.role && filters.role !== 'all') {
      list = list.filter(l => (l.role || '').toLowerCase() === filters.role.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(l =>
        (l.name && l.name.toLowerCase().includes(q)) ||
        (l.designation && l.designation.toLowerCase().includes(q)) ||
        (l.role && l.role.toLowerCase().includes(q))
      );
    }
    return list.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));
  },

  getActiveLeadership: () => {
    return cmsStore.getLeadership({ status: 'active' });
  },

  getLeaderById: (id) => {
    if (!id) return null;
    return (cache.leadership || []).find(l => l.id === id) || null;
  },

  toggleLeadershipStatus: async (id, user = 'Administrator') => {
    const list = [...(cache.leadership || [])];
    const item = list.find(l => l.id === id);
    if (!item) return null;
    const isCurrentlyActive = item.status === 'active' || item.status === 'published' || !item.status;
    const newStatus = isCurrentlyActive ? 'inactive' : 'active';
    const updated = {
      ...item,
      status: newStatus,
      lastModified: new Date().toISOString()
    };
    saveRevision('leadership', id, updated, user);
    cache.leadership = list.map(l => l.id === id ? updated : l);
    saveCache(cache);
    emitUpdate();
    cmsStore.logActivity(`Turned Leader "${item.name}" ${isCurrentlyActive ? 'OFF (Inactive/Hidden)' : 'ON (Active/Live)'}`, user);
    api.post('/admin/settings', { leadership: cache.leadership }).catch(() => {});
    return updated;
  },

  saveLeadership: async (item, user = 'Administrator') => {
    const isNew = !item.id;
    const id = isNew ? `leader-${Date.now()}` : item.id;
    const currentList = [...(cache.leadership || [])];
    const record = {
      ...item,
      id,
      order: item.order !== undefined && item.order !== '' ? Number(item.order) : (currentList.length + 1),
      status: item.status || 'active',
      role: item.role || 'Administration',
      assetPath: item.assetPath || item.imageUrl || '/assets/images/campus/intro_heritage_building.jpg',
      imageUrl: item.assetPath || item.imageUrl || '/assets/images/campus/intro_heritage_building.jpg',
      objectPosition: item.objectPosition || '50% 15%',
      lastModified: new Date().toISOString()
    };

    saveRevision('leadership', id, record, user);

    const existingIndex = currentList.findIndex(l => l.id === id);
    if (existingIndex >= 0) {
      currentList[existingIndex] = record;
    } else {
      currentList.push(record);
    }
    cache.leadership = currentList.sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    saveCache(cache);
    emitUpdate();
    cmsStore.logActivity(`Saved leader: ${record.name} (${record.designation})`, user);
    api.post('/admin/settings', { leadership: cache.leadership }).catch(() => {});
    return record;
  },

  deleteLeadership: async (id, user = 'Administrator') => {
    const existing = (cache.leadership || []).find(l => l.id === id);
    if (existing) {
      saveRevision('leadership', id, { ...existing, status: 'deleted' }, user);
      cache.leadership = (cache.leadership || []).filter(l => l.id !== id);
      saveCache(cache);
      emitUpdate();
      cmsStore.logActivity(`Deleted leader ID: ${id} (${existing.name})`, user);
      api.post('/admin/settings', { leadership: cache.leadership }).catch(() => {});
    }
    return cache.leadership;
  },

  reorderLeadership: async (orderedIds, user = 'Administrator') => {
    const idOrderMap = new Map(orderedIds.map((id, index) => [id, index + 1]));
    cache.leadership = (cache.leadership || []).map(l => ({
      ...l,
      order: idOrderMap.has(l.id) ? idOrderMap.get(l.id) : l.order
    })).sort((a, b) => (Number(a.order) || 0) - (Number(b.order) || 0));

    saveCache(cache);
    emitUpdate();
    cmsStore.logActivity(`Reordered leadership roster`, user);
    api.post('/admin/settings', { leadership: cache.leadership }).catch(() => {});
    return cache.leadership;
  },

  // ================= 2. DEPARTMENT MANAGEMENT =================
  getDepartments: (filters = {}) => {
    let list = cache.departments || [];
    if (filters.status && filters.status !== 'all') {
      list = list.filter(d => d.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(d => 
        (d.name && d.name.toLowerCase().includes(q)) ||
        (d.code && d.code.toLowerCase().includes(q)) ||
        (d.facultyName && d.facultyName.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getDepartmentById: (deptIdOrSlug) => {
    if (!deptIdOrSlug) return null;
    const raw = String(deptIdOrSlug).toLowerCase().trim();
    const clean = raw.replace(/^dept[-_]/, '');
    const withPrefix = `dept-${clean}`;
    return (cache.departments || []).find(d => {
      const dId = (d.id || '').toLowerCase();
      const dSlug = (d.slug || '').toLowerCase();
      const dCode = (d.code || '').toLowerCase();
      const dDeptId = (d.deptId || '').toLowerCase();
      return dId === raw || dId === clean || dId === withPrefix ||
             dSlug === raw || dSlug === clean || dSlug === withPrefix ||
             dDeptId === raw || dDeptId === clean || dDeptId === withPrefix ||
             dCode === raw || dCode === clean;
    }) || null;
  },

  saveDepartment: async (deptItem, user = 'Administrator') => {
    const isNew = !deptItem.id;
    const id = isNew ? `dept-${Date.now()}` : deptItem.id;
    const slug = deptItem.slug || deptItem.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const record = {
      ...deptItem,
      id,
      slug,
      status: deptItem.status || 'published',
      origin: isNew ? 'local' : 'local_modified',
      lastModified: new Date().toISOString()
    };

    saveRevision('department', id, record, user);

    if (isNew) {
      cache.departments = [record, ...(cache.departments || [])];
    } else {
      cache.departments = (cache.departments || []).map(d => d.id === id ? record : d);
    }

    emitUpdate();
    cmsStore.logActivity(`Saved department: ${record.name}`, user);

    // Sync to backend database
    try {
      if (isNew) {
        await api.post('/admin/departments', {
          name: record.name,
          slug: record.slug,
          category: record.category || record.faculty,
          head: record.head || record.hodName,
          short_description: record.short_description || record.tagline,
          description: record.description,
          banner_image: record.banner_image || record.bannerUrl,
          status: record.status || 'published'
        });
      } else {
        await api.put(`/admin/departments/${record.id}`, {
          name: record.name,
          slug: record.slug,
          category: record.category || record.faculty,
          head: record.head || record.hodName,
          short_description: record.short_description || record.tagline,
          description: record.description,
          banner_image: record.banner_image || record.bannerUrl,
          status: record.status || 'published'
        });
      }
      await api.post(`/admin/departments/${record.id}/publish`, {});
    } catch (e) {
      // Offline fallback: data safely maintained in cache
    }

    return record;
  },

  deleteDepartment: async (id, user = 'Administrator') => {
    const existing = (cache.departments || []).find(d => d.id === id);
    if (existing) {
      saveRevision('department', id, { ...existing, status: 'deleted' }, user);
      cache.departments = (cache.departments || []).filter(d => d.id !== id);
      emitUpdate();
      cmsStore.logActivity(`Deleted department ID: ${id}`, user);
      api.delete(`/admin/departments/${id}`).catch(() => {});
    }
    return cache.departments;
  },

  toggleDepartmentStatus: async (id, user = 'Administrator') => {
    const list = cache.departments || [];
    const item = list.find(d => d.id === id);
    if (!item) return null;
    const isCurrentlyActive = (item.status || 'published') === 'published';
    const updated = {
      ...item,
      status: isCurrentlyActive ? 'draft' : 'published',
      lastModified: new Date().toISOString()
    };
    saveRevision('department', id, updated, user);
    cache.departments = list.map(d => d.id === id ? updated : d);
    emitUpdate();
    cmsStore.logActivity(`Turned Department "${item.name}" ${isCurrentlyActive ? 'OFF (Draft)' : 'ON (Live)'}`, user);
    if (updated.status === 'published') {
      api.post(`/admin/departments/${id}/publish`, {}).catch(() => {});
    } else {
      api.post(`/admin/departments/${id}/unpublish`, {}).catch(() => {});
    }
    return updated;
  },

  bulkSetDepartmentsStatus: async (newStatus = 'published', user = 'Administrator') => {
    const list = cache.departments || [];
    cache.departments = list.map(d => {
      const updated = { ...d, status: newStatus, lastModified: new Date().toISOString() };
      saveRevision('department', d.id, updated, user);
      return updated;
    });
    emitUpdate();
    cmsStore.logActivity(`Bulk turned all departments ${newStatus === 'published' ? 'ON' : 'OFF'}`, user);
    return cache.departments;
  },

  // ================= 3. PROGRAMME MANAGEMENT =================
  getProgrammes: (filters = {}) => {
    let list = cache.programmes && cache.programmes.length > 0
      ? [...cache.programmes]
      : [...(hierarchyData.programmes || [])];

    if (filters.departmentId) {
      list = list.filter(p => p.departmentId === filters.departmentId);
    }
    if (filters.level && filters.level !== 'all') {
      const reqLvl = filters.level.toLowerCase();
      list = list.filter(p => {
        const pLvl = (p.level || p.type || '').toLowerCase();
        return pLvl === reqLvl || pLvl.includes(reqLvl);
      });
    }
    if (filters.status && filters.status !== 'all') {
      list = list.filter(p => (p.status || 'published') === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => 
        (p.name && p.name.toLowerCase().includes(q)) ||
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.code && p.code.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getUGProgrammes: () => {
    const list = cache.programmes && cache.programmes.length > 0 
      ? cache.programmes 
      : (hierarchyData.programmes || []);
    return list.filter(p => 
      (p.type || '').toLowerCase() === 'ug' || 
      (p.level || '').toLowerCase().includes('undergrad') ||
      (p.level || '').toLowerCase() === 'ug'
    );
  },

  getPGProgrammes: () => {
    const list = cache.programmes && cache.programmes.length > 0 
      ? cache.programmes 
      : (hierarchyData.programmes || []);
    return list.filter(p => 
      (p.type || '').toLowerCase() === 'pg' || 
      (p.level || '').toLowerCase().includes('postgrad') ||
      (p.level || '').toLowerCase() === 'pg'
    );
  },

  getProgrammeById: (progIdOrCode) => {
    if (!progIdOrCode) return null;
    const raw = String(progIdOrCode).toLowerCase().trim();
    const list = cache.programmes && cache.programmes.length > 0 
      ? cache.programmes 
      : (hierarchyData.programmes || []);
    return list.find(p => {
      const pId = (p.id || '').toLowerCase();
      const pCode = (p.code || '').toLowerCase();
      const pSlug = (p.slug || '').toLowerCase();
      return pId === raw || pCode === raw || pSlug === raw;
    }) || null;
  },

  saveProgramme: async (progItem, user = 'Administrator') => {
    const isNew = !progItem.id;
    const id = isNew ? `prog-${Date.now()}` : progItem.id;
    const code = progItem.code || progItem.name;
    const slug = progItem.slug || code.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const record = {
      ...progItem,
      id,
      code,
      slug,
      status: progItem.status || 'published',
      origin: isNew ? 'local' : 'local_modified',
      lastModified: new Date().toISOString()
    };

    saveRevision('programme', id, record, user);

    if (isNew) {
      cache.programmes = [record, ...(cache.programmes || [])];
    } else {
      cache.programmes = (cache.programmes || []).map(p => p.id === id ? record : p);
    }

    emitUpdate();
    cmsStore.logActivity(`Saved programme: ${record.name || record.title}`, user);
    return record;
  },

  deleteProgramme: async (id, user = 'Administrator') => {
    const existing = (cache.programmes || []).find(p => p.id === id);
    if (existing) {
      saveRevision('programme', id, { ...existing, status: 'deleted' }, user);
      cache.programmes = (cache.programmes || []).filter(p => p.id !== id);
      emitUpdate();
      cmsStore.logActivity(`Deleted programme ID: ${id}`, user);
    }
    return cache.programmes;
  },

  toggleProgrammeStatus: async (id, user = 'Administrator') => {
    const list = cache.programmes || [];
    const item = list.find(p => p.id === id || p.code === id);
    if (!item) return null;
    const isCurrentlyActive = (item.status || 'published') === 'published';
    const newStatus = isCurrentlyActive ? 'draft' : 'published';
    const updated = {
      ...item,
      status: newStatus,
      lastModified: new Date().toISOString()
    };
    saveRevision('programme', item.id, updated, user);
    cache.programmes = list.map(p => (p.id === item.id || p.code === item.code) ? updated : p);
    emitUpdate();
    cmsStore.logActivity(`Turned Course "${item.name || item.title || item.code}" ${isCurrentlyActive ? 'OFF (Draft)' : 'ON (Live)'}`, user);

    // Synchronize with Laravel Backend
    const code = item.code || item.id || id;
    try {
      const res = await api.post(`/admin/programmes/${encodeURIComponent(code)}/toggle-status`);
      if (res?.programme) {
        item.status = res.programme.status;
        cache.programmes = list.map(p => (p.id === item.id || p.code === item.code) ? { ...p, status: res.programme.status } : p);
        emitUpdate();
      }
    } catch (err) {
      console.warn('Backend toggle-status call failed:', err);
    }

    return updated;
  },

  toggleProgrammeHoneycomb: async (id, user = 'Administrator') => {
    const list = cache.programmes || [];
    const item = list.find(p => p.id === id || p.code === id);
    if (!item) return null;
    const isCurrentlyFeatured = item.is_featured_honeycomb !== undefined 
      ? Boolean(item.is_featured_honeycomb) 
      : (item.isFeaturedHoneycomb !== false);
    const newFeatured = !isCurrentlyFeatured;
    const updated = {
      ...item,
      is_featured_honeycomb: newFeatured,
      isFeaturedHoneycomb: newFeatured,
      lastModified: new Date().toISOString()
    };
    saveRevision('programme', item.id, updated, user);
    cache.programmes = list.map(p => (p.id === item.id || p.code === item.code) ? updated : p);
    emitUpdate();
    cmsStore.logActivity(`Toggled Honeycomb Grid for "${item.code || item.name}" to ${newFeatured ? 'ON (Shown)' : 'OFF (Hidden)'}`, user);

    // Synchronize with Laravel Backend
    const code = item.code || item.id || id;
    try {
      const res = await api.post(`/admin/programmes/${encodeURIComponent(code)}/toggle-honeycomb`);
      if (res?.programme) {
        const val = Boolean(res.programme.is_featured_honeycomb);
        item.is_featured_honeycomb = val;
        item.isFeaturedHoneycomb = val;
        cache.programmes = list.map(p => (p.id === item.id || p.code === item.code) ? { ...p, is_featured_honeycomb: val, isFeaturedHoneycomb: val } : p);
        emitUpdate();
      }
    } catch (err) {
      console.warn('Backend toggle-honeycomb call failed:', err);
    }

    return updated;
  },

  bulkSetProgrammesStatus: async (streamOrIds, newStatus = 'published', user = 'Administrator') => {
    const list = cache.programmes || [];
    cache.programmes = list.map(p => {
      let shouldUpdate = false;
      if (Array.isArray(streamOrIds)) {
        shouldUpdate = streamOrIds.includes(p.id) || streamOrIds.includes(p.code);
      } else if (streamOrIds === 'all') {
        shouldUpdate = true;
      } else {
        const lvl = (p.level || p.type || '').toLowerCase();
        shouldUpdate = lvl === streamOrIds.toLowerCase() || lvl.includes(streamOrIds.toLowerCase());
      }
      if (shouldUpdate) {
        const updated = { ...p, status: newStatus, lastModified: new Date().toISOString() };
        saveRevision('programme', p.id, updated, user);
        return updated;
      }
      return p;
    });
    emitUpdate();
    cmsStore.logActivity(`Bulk set programmes (${streamOrIds}) status to ${newStatus}`, user);

    if (typeof streamOrIds === 'string') {
      try {
        await api.post('/admin/programmes/bulk-status', {
          stream: streamOrIds,
          status: newStatus
        });
      } catch (err) {
        console.warn('Backend bulk-status call failed:', err);
      }
    }

    return cache.programmes;
  },

  syncProgrammesFromServer: async () => {
    try {
      const serverProgs = await api.get('/programmes');
      if (Array.isArray(serverProgs) && serverProgs.length > 0) {
        const normalizeKey = (k) => String(k || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
        const serverMap = new Map(serverProgs.map(sp => [normalizeKey(sp.code || sp.id), sp]));

        cache.programmes = (cache.programmes || []).map(cp => {
          const match = serverMap.get(normalizeKey(cp.code || cp.id));
          if (!match) return cp;
          const isHoneycomb = match.is_featured_honeycomb !== undefined 
            ? Boolean(match.is_featured_honeycomb) 
            : (match.isFeaturedHoneycomb !== undefined ? Boolean(match.isFeaturedHoneycomb) : cp.isFeaturedHoneycomb);

          return {
            ...cp,
            status: match.status !== undefined ? match.status : cp.status,
            is_featured_honeycomb: isHoneycomb,
            isFeaturedHoneycomb: isHoneycomb
          };
        });
        saveCache(cache);
        emitUpdate();
      }
    } catch (e) {
      // Retain offline cache
    }
  },

  // ================= 4. GENERAL PAGES MANAGEMENT =================
  getPages: (filters = {}) => {
    let list = cache.pages || [];
    if (filters.status && filters.status !== 'all') {
      list = list.filter(p => p.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(p => 
        (p.title && p.title.toLowerCase().includes(q)) ||
        (p.slug && p.slug.toLowerCase().includes(q))
      );
    }
    return list;
  },

  getPageBySlug: (slug) => {
    if (!slug) return null;
    const clean = String(slug).toLowerCase().trim().replace(/^\//, '');
    return (cache.pages || []).find(p => (p.slug || '').toLowerCase() === clean);
  },

  savePage: async (pageItem, user = 'Administrator') => {
    const isNew = !pageItem.id;
    const id = isNew ? `page-${Date.now()}` : pageItem.id;
    const slug = pageItem.slug || pageItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const record = {
      ...pageItem,
      id,
      slug,
      status: pageItem.status || 'published',
      origin: isNew ? 'local' : 'local_modified',
      lastUpdated: new Date().toISOString().split('T')[0]
    };

    saveRevision('page', id, record, user);

    if (isNew) {
      cache.pages = [record, ...(cache.pages || [])];
    } else {
      cache.pages = (cache.pages || []).map(p => p.id === id ? record : p);
    }

    emitUpdate();
    cmsStore.logActivity(`Saved custom page: ${record.title} (/pages/${record.slug})`, user);
    api.post('/admin/settings', { pages: cache.pages }).catch(() => {});
    return record;
  },

  deletePage: async (id, user = 'Administrator') => {
    const existing = (cache.pages || []).find(p => p.id === id);
    if (existing) {
      saveRevision('page', id, { ...existing, status: 'deleted' }, user);
      cache.pages = (cache.pages || []).filter(p => p.id !== id);
      emitUpdate();
      cmsStore.logActivity(`Deleted page ID: ${id}`, user);
      api.post('/admin/settings', { pages: cache.pages }).catch(() => {});
    }
    return cache.pages;
  },

  // ================= 5. NOTICES & ANNOUNCEMENTS =================
  getNotices: (filters = {}) => {
    let list = cache.notices || [];
    if (filters.category && filters.category !== 'all') {
      const targetCat = filters.category.toLowerCase().replace(/s$/, '');
      list = list.filter(n => {
        const itemCat = (n.category || '').toLowerCase().replace(/s$/, '');
        return itemCat === targetCat;
      });
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(n => (n.title && n.title.toLowerCase().includes(q)) || (n.summary && n.summary.toLowerCase().includes(q)));
    }
    return list;
  },

  saveNotice: async (noticeItem, user = 'Administrator') => {
    const isNew = !noticeItem.id;
    const id = isNew ? `not_${Date.now()}` : noticeItem.id;
    const effectiveDate = noticeItem.date || noticeItem.publishDate || new Date().toISOString().split('T')[0];

    const record = {
      ...noticeItem,
      id,
      date: effectiveDate,
      publishDate: effectiveDate,
      type: noticeItem.type || 'Notice',
      category: noticeItem.category || 'General',
      status: noticeItem.status || 'published',
      summary: noticeItem.summary || noticeItem.content?.slice(0, 160) || noticeItem.title,
      isPinned: !!noticeItem.isPinned,
      tags: noticeItem.tags || (noticeItem.isPinned ? ['IMPORTANT', 'PINNED'] : ['LATEST', 'NOTICE']),
      link: noticeItem.link || noticeItem.attachmentUrl || `/news-events/${id}`
    };

    if (isNew) {
      cache.notices = [record, ...(cache.notices || [])];
    } else {
      cache.notices = (cache.notices || []).map(n => n.id === id ? record : n);
    }

    emitUpdate();
    cmsStore.logActivity(`Saved notice: ${record.title}`, user);

    // Synchronize with Laravel Backend
    try {
      const payload = {
        id: record.id,
        title: record.title,
        type: record.type,
        category: record.category,
        date: record.date,
        displayDate: record.date,
        summary: record.summary,
        refNo: record.refNo || `STP/${(record.category || 'GEN').toUpperCase()}/${new Date().getFullYear()}`,
        link: record.link
      };
      if (isNew) {
        await api.post('/admin/notices', payload);
      } else {
        await api.put(`/admin/notices/${record.id}`, payload);
      }
    } catch (err) {
      console.warn('Backend saveNotice sync failed:', err);
    }

    return record;
  },

  addNotice: (noticeItem) => {
    const effectiveDate = noticeItem.date || noticeItem.publishDate || noticeItem.event_date || new Date().toISOString().split('T')[0];
    const record = {
      ...noticeItem,
      id: noticeItem.id || `notice-${Date.now()}`,
      date: effectiveDate,
      publishDate: effectiveDate,
      type: noticeItem.type || 'Notice',
      category: noticeItem.category || 'General',
      status: noticeItem.status || 'published',
      summary: noticeItem.summary || noticeItem.content?.slice?.(0, 160) || noticeItem.title,
      isPinned: !!noticeItem.isPinned,
      tags: noticeItem.tags || (noticeItem.isPinned ? ['IMPORTANT', 'PINNED'] : ['LATEST', 'NOTICE']),
      link: noticeItem.link || `/news-events/${noticeItem.id}`
    };
    cache.notices = [record, ...(cache.notices || [])];
    emitUpdate();
  },

  updateNoticesList: (list) => {
    cache.notices = list;
    emitUpdate();
  },

  deleteNotice: async (id, user = 'Administrator') => {
    cache.notices = (cache.notices || []).filter(n => n.id !== id);
    emitUpdate();
    cmsStore.logActivity(`Deleted notice ID: ${id}`, user);

    try {
      await api.delete(`/admin/notices/${id}`);
    } catch (err) {
      console.warn('Backend deleteNotice sync failed:', err);
    }

    return cache.notices;
  },

  // ================= 6. EVENTS MANAGEMENT =================
  getEvents: () => cache.events || [],

  saveEvent: async (eventItem, user = 'Administrator') => {
    const isNew = !eventItem.id;
    const id = isNew ? `evt_${Date.now()}` : eventItem.id;
    const slug = eventItem.slug || eventItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const eventDate = eventItem.date || eventItem.event_date || new Date().toISOString().split('T')[0];

    const record = {
      ...eventItem,
      id,
      slug,
      status: eventItem.status || 'published',
      date: eventDate,
      event_date: eventDate
    };

    if (isNew) {
      cache.events = [record, ...(cache.events || [])];
    } else {
      cache.events = (cache.events || []).map(e => e.id === id ? record : e);
    }

    emitUpdate();
    cmsStore.logActivity(`Saved event: ${record.title}`, user);

    // Synchronize with Laravel Backend
    try {
      const payload = {
        id: record.id,
        slug: record.slug,
        title: record.title,
        summary: record.summary || record.description || record.title,
        description: record.description || record.summary || record.title,
        event_date: eventDate,
        displayDate: eventDate,
        category: record.category || 'Event',
        location: record.location || 'College Campus',
        status: record.status || 'published'
      };
      if (isNew) {
        await api.post('/admin/events', payload);
      } else {
        await api.put(`/admin/events/${record.id}`, payload);
      }
    } catch (err) {
      console.warn('Backend saveEvent sync failed:', err);
    }

    return record;
  },

  deleteEvent: async (id, user = 'Administrator') => {
    cache.events = (cache.events || []).filter(e => e.id !== id);
    emitUpdate();
    cmsStore.logActivity(`Deleted event ID: ${id}`, user);

    try {
      await api.delete(`/admin/events/${id}`);
    } catch (err) {
      console.warn('Backend deleteEvent sync failed:', err);
    }

    return cache.events;
  },

  // ================= 7. DOCUMENTS REPOSITORY =================
  getDocuments: () => cache.documents || [],

  saveDocument: async (docItem, user = 'Administrator') => {
    const isNew = !docItem.id;
    const id = isNew ? `doc-${Date.now()}` : docItem.id;

    const record = {
      ...docItem,
      id,
      file_type: docItem.file_type || 'PDF',
      category: docItem.category || 'general'
    };

    if (isNew) {
      cache.documents = [record, ...(cache.documents || [])];
    } else {
      cache.documents = (cache.documents || []).map(d => d.id === id ? record : d);
    }

    emitUpdate();
    cmsStore.logActivity(`Saved document: ${record.document_name || record.link_text}`, user);
    return record;
  },

  deleteDocument: async (id, user = 'Administrator') => {
    cache.documents = (cache.documents || []).filter(d => d.id !== id);
    emitUpdate();
    cmsStore.logActivity(`Deleted document ID: ${id}`, user);
    return cache.documents;
  },

  // ================= 8. MEDIA LIBRARY =================
  getMedia: () => cache.media || [],

  saveMedia: async (mediaItem, user = 'Administrator') => {
    const isNew = !mediaItem.id;
    const id = isNew ? `media-${Date.now()}` : mediaItem.id;

    const record = {
      ...mediaItem,
      id,
      uploadedAt: new Date().toISOString()
    };

    if (isNew) {
      cache.media = [record, ...(cache.media || [])];
    } else {
      cache.media = (cache.media || []).map(m => m.id === id ? record : m);
    }

    emitUpdate();
    cmsStore.logActivity(`Uploaded media: ${record.name || record.title}`, user);
    return record;
  },

  deleteMedia: async (id, user = 'Administrator') => {
    cache.media = (cache.media || []).filter(m => m.id !== id);
    emitUpdate();
    cmsStore.logActivity(`Deleted media ID: ${id}`, user);
    return cache.media;
  },

  // ================= 9. SLIDERS MANAGEMENT =================
  getSliders: () => cache.sliders || [],

  saveSlider: async (sliderItem, user = 'Administrator') => {
    const isNew = !sliderItem.id;
    const id = isNew ? `sld_${Date.now()}` : sliderItem.id;

    const record = {
      ...sliderItem,
      id,
      status: sliderItem.status || 'published'
    };

    if (isNew) {
      cache.sliders = [...(cache.sliders || []), record];
    } else {
      cache.sliders = (cache.sliders || []).map(s => s.id === id ? record : s);
    }

    emitUpdate();
    cmsStore.logActivity(`Saved hero slide: ${record.title}`, user);

    // Sync to backend database
    api.post('/admin/sliders', {
      id: record.id,
      title: record.title,
      category: record.category || 'Academic',
      subtitle: record.subtitle,
      description: record.description,
      image: record.image || record.imageUrl,
      ctaText: record.ctaText || record.cta_text,
      ctaLink: record.ctaLink || record.cta_link,
      status: record.status || 'published',
      priority: record.priority || 1
    }).catch(() => {});

    return record;
  },

  deleteSlider: async (id, user = 'Administrator') => {
    cache.sliders = (cache.sliders || []).filter(s => s.id !== id);
    emitUpdate();
    cmsStore.logActivity(`Deleted hero slide ID: ${id}`, user);
    api.delete(`/admin/sliders/${id}`).catch(() => {});
    return cache.sliders;
  },

  // ================= 10. MENUS & NAVIGATION =================
  getMenus: () => cache.menus || {},

  saveMenus: async (menuData, user = 'Administrator') => {
    saveRevision('menu', 'mega-menu', cache.menus, user);
    cache.menus = menuData;
    emitUpdate();
    cmsStore.logActivity(`Updated navigation mega-menus`, user);
    api.post('/admin/settings', { menus: cache.menus }).catch(() => {});
    return cache.menus;
  },

  // ================= 10. ALUMNI REGISTRATIONS & DIRECTORY =================
  getAlumniSubmissions: (filters = {}) => {
    let list = cache.alumni && cache.alumni.length > 0
      ? [...cache.alumni]
      : [...(alumniData.initialRegistrations || [])];

    if (filters.status && filters.status !== 'all') {
      list = list.filter(a => (a.status || 'approved') === filters.status);
    }
    if (filters.course) {
      list = list.filter(a => (a.course || '').toLowerCase().includes(filters.course.toLowerCase()));
    }
    if (filters.mentorOnly) {
      list = list.filter(a => a.willingToMentor === 'Yes');
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(a => 
        (a.fullName && a.fullName.toLowerCase().includes(q)) ||
        (a.registrationNo && a.registrationNo.toLowerCase().includes(q)) ||
        (a.email && a.email.toLowerCase().includes(q)) ||
        (a.organisation && a.organisation.toLowerCase().includes(q)) ||
        (a.jobTitle && a.jobTitle.toLowerCase().includes(q)) ||
        (a.batchYear && a.batchYear.includes(q)) ||
        (a.city && a.city.toLowerCase().includes(q))
      );
    }
    return list;
  },

  saveAlumniRegistration: async (formData) => {
    const isNew = !formData.id;
    const year = new Date().getFullYear();
    const id = isNew ? `ALM-${year}-${Date.now().toString().slice(-4)}` : formData.id;
    const registrationNo = formData.registrationNo || `SPCAA-${year}-${Math.floor(1000 + Math.random() * 9000)}`;

    const record = {
      ...formData,
      id,
      registrationNo,
      status: formData.status || 'approved',
      submissionDate: formData.submissionDate || new Date().toISOString().split('T')[0],
      lastModified: new Date().toISOString()
    };

    if (isNew) {
      cache.alumni = [record, ...(cache.alumni || [])];
    } else {
      cache.alumni = (cache.alumni || []).map(a => a.id === id ? record : a);
    }

    emitUpdate();
    cmsStore.logActivity(`New Alumni Registration: ${record.fullName} (${record.registrationNo})`, 'Public Website');
    return record;
  },

  updateAlumniStatus: async (id, status, user = 'Administrator') => {
    const list = cache.alumni || [];
    const item = list.find(a => a.id === id);
    if (!item) return null;
    const updated = { ...item, status, lastModified: new Date().toISOString() };
    cache.alumni = list.map(a => a.id === id ? updated : a);
    emitUpdate();
    cmsStore.logActivity(`Updated Alumni ${item.fullName} status to ${status}`, user);
    return updated;
  },

  deleteAlumni: async (id, user = 'Administrator') => {
    const item = (cache.alumni || []).find(a => a.id === id);
    cache.alumni = (cache.alumni || []).filter(a => a.id !== id);
    emitUpdate();
    if (item) {
      cmsStore.logActivity(`Deleted Alumni Registration: ${item.fullName}`, user);
    }
    return cache.alumni;
  },

  // ================= 11. SYLLABUS & CURRICULUM MANAGEMENT =================
  getSyllabuses: (deptIdOrSlug = null) => {
    let list = cache.syllabuses || [];
    if (!deptIdOrSlug) return list;
    const clean = String(deptIdOrSlug).toLowerCase().trim().replace(/^dept[-_]/, '');
    return list.filter(s => {
      const sDept = String(s.departmentId || s.deptSlug || s.deptId || '').toLowerCase().replace(/^dept[-_]/, '');
      return sDept === clean || (s.slug && s.slug.toLowerCase() === clean);
    });
  },

  getSyllabusById: (idOrSlug) => {
    if (!idOrSlug) return null;
    const clean = String(idOrSlug).toLowerCase().trim();
    return (cache.syllabuses || []).find(s => 
      (s.id && s.id.toLowerCase() === clean) || 
      (s.slug && s.slug.toLowerCase() === clean) ||
      (s.code && s.code.toLowerCase() === clean)
    ) || null;
  },

  saveSyllabus: async (syllabusItem, user = 'Administrator', userDeptId = null) => {
    if (userDeptId) {
      const uClean = String(userDeptId).toLowerCase().replace(/^dept[-_]/, '');
      const tClean = String(syllabusItem.departmentId || syllabusItem.deptSlug || '').toLowerCase().replace(/^dept[-_]/, '');
      if (tClean && tClean !== uClean) {
        throw new Error(`Permission Denied: You are only authorized to manage syllabus for your assigned department.`);
      }
    }

    const isNew = !syllabusItem.id;
    const id = isNew ? `syl-${(syllabusItem.code || Date.now()).toString().toLowerCase().replace(/[^a-z0-9]+/g, '-')}` : syllabusItem.id;
    const record = {
      ...syllabusItem,
      id,
      status: syllabusItem.status || 'published',
      lastModified: new Date().toISOString()
    };

    const existingIndex = (cache.syllabuses || []).findIndex(s => s.id === id || (record.code && s.code && s.code.toLowerCase() === record.code.toLowerCase()));
    if (existingIndex >= 0) {
      cache.syllabuses[existingIndex] = { ...cache.syllabuses[existingIndex], ...record };
    } else {
      cache.syllabuses = [record, ...(cache.syllabuses || [])];
    }

    emitUpdate();
    cmsStore.logActivity(`Saved Syllabus: ${record.title || record.code}`, user);
    return record;
  },

  deleteSyllabus: async (id, user = 'Administrator', userDeptId = null) => {
    const existing = (cache.syllabuses || []).find(s => s.id === id);
    if (existing && userDeptId) {
      const uClean = String(userDeptId).toLowerCase().replace(/^dept[-_]/, '');
      const tClean = String(existing.departmentId || existing.deptSlug || '').toLowerCase().replace(/^dept[-_]/, '');
      if (tClean && tClean !== uClean) {
        throw new Error(`Permission Denied: You can only delete syllabus for your assigned department.`);
      }
    }
    cache.syllabuses = (cache.syllabuses || []).filter(s => s.id !== id);
    emitUpdate();
    cmsStore.logActivity(`Deleted Syllabus ID: ${id}`, user);
    return cache.syllabuses;
  },

  // ================= 12. DEPARTMENT DOCUMENTS & LAB FILES =================
  getDepartmentDocuments: (deptIdOrSlug = null) => {
    let list = cache.documents || [];
    if (!deptIdOrSlug) return list;
    const clean = String(deptIdOrSlug).toLowerCase().trim().replace(/^dept[-_]/, '');
    return list.filter(d => {
      const dDept = String(d.departmentId || d.department || d.category || '').toLowerCase().replace(/^dept[-_]/, '');
      return dDept === clean || dDept.includes(clean);
    });
  },

  saveDepartmentDocument: async (docItem, user = 'Administrator', userDeptId = null) => {
    if (userDeptId) {
      const uClean = String(userDeptId).toLowerCase().replace(/^dept[-_]/, '');
      const tClean = String(docItem.departmentId || docItem.department || '').toLowerCase().replace(/^dept[-_]/, '');
      if (tClean && tClean !== uClean) {
        throw new Error(`Permission Denied: You can only upload files for your assigned department.`);
      }
    }

    const isNew = !docItem.id;
    const id = isNew ? `doc-dept-${Date.now()}` : docItem.id;
    const record = {
      ...docItem,
      id,
      uploadedAt: new Date().toISOString(),
      downloadStatus: 'Downloaded'
    };

    const existingIndex = (cache.documents || []).findIndex(d => d.id === id);
    if (existingIndex >= 0) {
      cache.documents[existingIndex] = { ...cache.documents[existingIndex], ...record };
    } else {
      cache.documents = [record, ...(cache.documents || [])];
    }

    emitUpdate();
    cmsStore.logActivity(`Uploaded Department File: ${record.title}`, user);
    return record;
  },

  deleteDepartmentDocument: async (id, user = 'Administrator', userDeptId = null) => {
    const existing = (cache.documents || []).find(d => d.id === id);
    if (existing && userDeptId) {
      const uClean = String(userDeptId).toLowerCase().replace(/^dept[-_]/, '');
      const tClean = String(existing.departmentId || existing.department || '').toLowerCase().replace(/^dept[-_]/, '');
      if (tClean && tClean !== uClean) {
        throw new Error(`Permission Denied: You can only delete files from your assigned department.`);
      }
    }
    cache.documents = (cache.documents || []).filter(d => d.id !== id);
    emitUpdate();
    cmsStore.logActivity(`Deleted Department Document ID: ${id}`, user);
    return cache.documents;
  },

  // ================= 13. USER & HOD ACCESS DIRECTORY =================
  getUsers: () => cache.users || [...userData],

  saveUser: async (userItem, adminUser = 'Administrator') => {
    const isNew = !userItem.id;
    const id = isNew ? `usr_${Date.now()}` : userItem.id;
    const record = {
      ...userItem,
      id,
      status: userItem.status || 'Active',
      lastModified: new Date().toISOString()
    };

    const existingIndex = (cache.users || []).findIndex(u => u.id === id || (u.email && u.email.toLowerCase() === record.email.toLowerCase()));
    if (existingIndex >= 0) {
      cache.users[existingIndex] = { ...cache.users[existingIndex], ...record };
    } else {
      cache.users = [record, ...(cache.users || [])];
    }

    emitUpdate();
    cmsStore.logActivity(`Updated User Account: ${record.name} (${record.role})`, adminUser);
    return record;
  },

  deleteUser: async (id, adminUser = 'Administrator') => {
    cache.users = (cache.users || []).filter(u => u.id !== id);
    emitUpdate();
    cmsStore.logActivity(`Deleted User Account ID: ${id}`, adminUser);
    return cache.users;
  },

  // ================= 14. REVISIONS & ROLLBACK =================
  getRevisions: (entityType, entityId) => {
    const revisions = loadRevisions();
    return revisions[`${entityType}:${entityId}`] || [];
  },

  restoreRevision: async (entityType, entityId, revisionId, user = 'Administrator') => {
    const revs = cmsStore.getRevisions(entityType, entityId);
    const targetRev = revs.find(r => r.id === revisionId);
    if (!targetRev) return null;

    const snapshot = targetRev.snapshot;

    switch (entityType) {
      case 'faculty':
        return cmsStore.saveFaculty(snapshot, `Rollback by ${user}`);
      case 'department':
        return cmsStore.saveDepartment(snapshot, `Rollback by ${user}`);
      case 'programme':
        return cmsStore.saveProgramme(snapshot, `Rollback by ${user}`);
      case 'page':
        return cmsStore.savePage(snapshot, `Rollback by ${user}`);
      default:
        return null;
    }
  },

  // ================= 11. ACTIVITY LOGGING =================
  getLogs: () => {
    const list = cache.logs || [];
    if (list.length > 0) return list;
    
    // Seed initial realistic activity logs if list is currently empty
    const now = new Date();
    const todayStr = now.toISOString();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString();

    return [
      {
        id: 'seed-log-1',
        title: 'Academics & Syllabus Matrix',
        action: 'Updated BCA & B.Com Course Curriculum Matrix',
        details: 'BCA & B.Com Course Curriculum',
        user: 'admin@stphilos.ac.in',
        module: 'Academics',
        stat: '+12 pages',
        icon: 'book',
        color: '#2ea5ff',
        timestamp: todayStr
      },
      {
        id: 'seed-log-2',
        title: 'Upcoming Campus Events',
        action: 'Published Annual Diamond Jubilee Fest 2026 Announcement',
        details: 'Annual Diamond Jubilee Fest Live',
        user: 'admin@stphilos.ac.in',
        module: 'Events',
        stat: 'Published',
        icon: 'calendar',
        color: '#9f54e6',
        timestamp: todayStr
      },
      {
        id: 'seed-log-3',
        title: 'Computer Science Faculty Roster',
        action: 'Synchronized HOD & Faculty Profiles Directory',
        details: 'HOD & Faculty Profiles Synced',
        user: 'hod.cs@stphilos.ac.in',
        module: 'Faculty',
        stat: '18 Faculty',
        icon: 'building',
        color: '#ff9432',
        timestamp: todayStr
      },
      {
        id: 'seed-log-4',
        title: 'NAAC Self Study Report Criterion 3',
        action: 'Uploaded Research Grants & Publications Verification PDF',
        details: 'Research Grants & Publications',
        user: 'iqac@stphilos.ac.in',
        module: 'IQAC & NAAC',
        stat: 'PDF Live',
        icon: 'file',
        color: '#eb4848',
        timestamp: yesterday
      },
      {
        id: 'seed-log-5',
        title: 'Convocation Photo Gallery Reel',
        action: 'Added 24 High-Resolution Campus Assets to Diamond Jubilee Reel',
        details: '24 High-Resolution Assets',
        user: 'media@stphilos.ac.in',
        module: 'Media Gallery',
        stat: '24 Assets',
        icon: 'image',
        color: '#20c978',
        timestamp: yesterday
      }
    ];
  },

  logActivity: (action, user = 'Administrator', extra = {}) => {
    const actionStr = typeof action === 'string' ? action : (action?.action || action?.title || 'System Update');
    const actionUser = typeof action === 'object' && action.user ? action.user : user;
    const actionDetails = typeof action === 'object' && action.details ? action.details : actionStr;
    
    let module = (typeof action === 'object' && action.module) ? action.module : (extra.module || 'System');
    let stat = extra.stat || 'Updated';
    let icon = 'layers';
    let color = '#3b82f6';
    let title = (typeof action === 'object' && action.title) ? action.title : (extra.title || actionStr);

    const lower = actionStr.toLowerCase();
    if (lower.includes('syllabus') || lower.includes('programme') || lower.includes('course') || lower.includes('curriculum')) {
      module = 'Academics';
      title = extra.title || 'Academics & Syllabus Matrix';
      stat = lower.includes('save') || lower.includes('new') ? '+1 Course' : 'Updated';
      icon = 'book';
      color = '#2ea5ff';
    } else if (lower.includes('event') || lower.includes('fest') || lower.includes('calendar')) {
      module = 'Events';
      title = extra.title || 'Upcoming Campus Events';
      stat = 'Published';
      icon = 'calendar';
      color = '#9f54e6';
    } else if (lower.includes('faculty') || lower.includes('department') || lower.includes('hod') || lower.includes('staff')) {
      module = 'Faculty';
      title = extra.title || 'Department & Faculty Roster';
      stat = 'Synced';
      icon = 'building';
      color = '#ff9432';
    } else if (lower.includes('notice') || lower.includes('document') || lower.includes('report') || lower.includes('iqac') || lower.includes('naac')) {
      module = 'Notices & Docs';
      title = extra.title || 'Official College Notice';
      stat = lower.includes('pdf') ? 'PDF Live' : 'Published';
      icon = 'file';
      color = '#eb4848';
    } else if (lower.includes('media') || lower.includes('gallery') || lower.includes('photo') || lower.includes('slide')) {
      module = 'Media Gallery';
      title = extra.title || 'Campus Media Asset';
      stat = 'Assets Live';
      icon = 'image';
      color = '#20c978';
    } else if (lower.includes('page') || lower.includes('menu')) {
      module = 'Pages & Menus';
      title = extra.title || 'Dynamic Page Update';
      stat = lower.includes('new') || lower.includes('custom') ? '+1 Page' : 'Published';
      icon = 'book';
      color = '#2ea5ff';
    }

    const logItem = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      title,
      action: actionStr,
      details: actionDetails,
      user: actionUser,
      module,
      stat,
      icon,
      color,
      timestamp: new Date().toISOString()
    };

    const currentLogs = cmsStore.getLogs();
    cache.logs = [logItem, ...currentLogs.filter(l => l.id !== logItem.id).slice(0, 150)];
    emitUpdate();
    return logItem;
  },

  // ================= 12. INSTITUTIONAL SETTINGS & CONTACT =================
  getSettings: () => {
    return cache.settings || { ...settingsData };
  },

  updateSettings: (newSettings, user = 'Administrator') => {
    cache.settings = { ...(cache.settings || settingsData), ...newSettings };
    cmsStore.logActivity({
      action: 'Updated Institutional Contact & General Settings',
      module: 'Settings',
      title: 'Institutional Settings Updated',
      user,
      details: `Phone: ${newSettings.phone || cache.settings.phone || ''}`
    });
    emitUpdate();
    api.post('/admin/settings', newSettings).catch(() => {});
    return cache.settings;
  },

  // ================= 13. HEADER & FOOTER CUSTOMIZER =================
  getHeaderConfig: () => {
    return cache.headerConfig || JSON.parse(JSON.stringify(initialHeaderConfig));
  },

  updateHeaderConfig: async (newConfig, user = 'Administrator') => {
    cache.headerConfig = {
      ...(cache.headerConfig || initialHeaderConfig),
      ...newConfig
    };
    cmsStore.logActivity({
      action: 'Updated Public Website Header Configuration',
      module: 'Layout',
      title: 'Header Layout Updated',
      user,
      details: `CTA: ${cache.headerConfig.ctaButton?.label || 'Customized'}`
    });
    emitUpdate();
    try {
      await api.post('/admin/settings', { headerConfig: cache.headerConfig });
    } catch (e) {
      console.warn('Backend sync for headerConfig failed:', e);
    }
    return cache.headerConfig;
  },

  getFooterConfig: () => {
    return cache.footerConfig || JSON.parse(JSON.stringify(initialFooterConfig));
  },

  updateFooterConfig: async (newConfig, user = 'Administrator') => {
    cache.footerConfig = {
      ...(cache.footerConfig || initialFooterConfig),
      ...newConfig
    };
    cmsStore.logActivity({
      action: 'Updated Public Website Footer Configuration',
      module: 'Layout',
      title: 'Footer Layout Updated',
      user,
      details: `${cache.footerConfig.columns?.length || 3} Column Sections Configured`
    });
    emitUpdate();
    try {
      await api.post('/admin/settings', { footerConfig: cache.footerConfig });
    } catch (e) {
      console.warn('Backend sync for footerConfig failed:', e);
    }
    return cache.footerConfig;
  },

  resetHeaderFooterDefaults: (user = 'Administrator') => {
    cache.headerConfig = JSON.parse(JSON.stringify(initialHeaderConfig));
    cache.footerConfig = JSON.parse(JSON.stringify(initialFooterConfig));
    cmsStore.logActivity({
      action: 'Reset Header and Footer to Official Defaults',
      module: 'Layout',
      title: 'Header & Footer Reset',
      user,
      details: 'Restored original institutional layout defaults'
    });
    emitUpdate();
    api.post('/admin/settings', { 
      headerConfig: cache.headerConfig, 
      footerConfig: cache.footerConfig 
    }).catch(() => {});
    return { headerConfig: cache.headerConfig, footerConfig: cache.footerConfig };
  },

  // ================= 14. RESET TO OFFICIAL IMPORTER STATE =================
  resetToImportedState: () => {
    cache = getInitialData();
    emitUpdate();
  }
};

if (typeof window !== 'undefined') {
  setTimeout(() => {
    cmsStore.syncProgrammesFromServer?.().catch(() => {});
  }, 200);
}

export { useCms } from './useCms';
export default cmsStore;

