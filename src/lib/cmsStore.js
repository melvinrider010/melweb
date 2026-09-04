import api from './api.js';
import hierarchyData from '../data/academicsHierarchyData.json';
import honeycombData from '../data/honeycomb-programmes.json';
import alumniData from '../data/alumniData.json';
import noticesData from '../data/notices.json';
import eventsData from '../data/events.json';
import mediaData from '../data/media.json';
import docData from '../data/documents.json';
import slidersData from '../data/sliders.json';
import userData from '../data/users.json';
import logData from '../data/activity-logs.json';
import settingsData from '../data/settings.json';
import { initialMegaMenuData } from '../data/megaMenuData.js';

const STORAGE_KEY = 'stphilos_cms_store_v7';
const REVISIONS_KEY = 'stphilos_cms_revisions_v7';

// 1. Initial State Seeding
function getInitialData() {
  const seededFaculty = (hierarchyData.faculty || []).map(f => ({
    ...f,
    status: f.status || 'published',
    origin: f.origin || 'imported',
    order: f.order || 0
  }));

  const seededDepartments = (hierarchyData.departments || []).map(d => ({
    ...d,
    status: d.status || 'published',
    origin: d.origin || 'imported',
    order: d.order || 0
  }));

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
    return {
      ...p,
      displayLines: p.displayLines || hcMatch.displayLines || [p.name || p.title || p.code],
      duration: p.duration || hcMatch.duration || '3 Years / 4 Years (NEP 2020)',
      isFeaturedHoneycomb: p.isFeaturedHoneycomb !== undefined ? p.isFeaturedHoneycomb : (hcMatch.id !== undefined),
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
        isFeaturedHoneycomb: true,
        status: 'published',
        origin: 'imported',
        order: 0
      });
    }
  });

  const seededProgrammes = baseProgrammes;

  const seededPages = [
    {
      id: 'page-about-college',
      title: "About St. Philomena's College",
      slug: 'about-college',
      parentSlug: '',
      pageType: 'general',
      featuredImage: '/assets/banner-college.jpg',
      excerpt: 'Autonomous College affiliated to University of Mysore with NAAC A+ accreditation.',
      content: 'Established in 1946 by His Excellency Rt. Rev. Dr. Rene Feuga, St. Philomena’s College is a premier autonomous institution in Mysuru, Karnataka.',
      seoTitle: "About Us | St. Philomena's College (Autonomous), Mysuru",
      seoDescription: 'Premier autonomous educational institution imparting value-based higher education since 1946.',
      status: 'published',
      origin: 'imported',
      publishDate: '2026-01-01',
      lastUpdated: '2026-09-02',
      order: 1
    },
    {
      id: 'page-academic-regulations',
      title: 'Academic Regulations & NEP Framework',
      slug: 'academic-regulations',
      parentSlug: 'academics',
      pageType: 'academic',
      featuredImage: '/assets/banner-college.jpg',
      excerpt: 'Comprehensive guidelines and examination ordinances under NEP 2020.',
      content: 'St. Philomena’s College implements the National Education Policy (NEP) guidelines with multi-disciplinary curriculum structures, skill enhancement courses, and continuous internal evaluations.',
      seoTitle: "Academic Regulations | St. Philomena's College",
      seoDescription: 'Autonomous curriculum guidelines and evaluation ordinances.',
      status: 'published',
      origin: 'imported',
      publishDate: '2026-01-01',
      lastUpdated: '2026-09-02',
      order: 2
    }
  ];

  return {
    faculty: seededFaculty,
    departments: seededDepartments,
    programmes: seededProgrammes,
    pages: seededPages,
    events: [...eventsData],
    notices: [...noticesData],
    documents: [...docData],
    media: [...mediaData],
    sliders: [...slidersData],
    alumni: [...(alumniData.initialRegistrations || [])],
    menus: initialMegaMenuData || {},
    users: [...userData],
    logs: [...logData],
    settings: { ...settingsData },
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
          return {
            ...initP,
            ...p,
            status: p.status !== undefined ? p.status : (initP.status || 'published'),
            isFeaturedHoneycomb: p.isFeaturedHoneycomb !== undefined ? p.isFeaturedHoneycomb : (initP.isFeaturedHoneycomb !== false)
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
      if (!parsed.alumni || !Array.isArray(parsed.alumni) || parsed.alumni.length === 0) {
        parsed.alumni = initial.alumni;
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
    console.error('Error saving CMS store to localStorage:', e);
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

function emitUpdate(shouldSave = true) {
  if (shouldSave) {
    saveCache(cache);
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('cms_store_updated'));
  }
}

// 3. Central CMS Store Object
export const cmsStore = {
  // Sync helper
  getSnapshot: () => ({ ...cache }),

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
    return cache.faculty;
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
    return record;
  },

  deleteDepartment: async (id, user = 'Administrator') => {
    const existing = (cache.departments || []).find(d => d.id === id);
    if (existing) {
      saveRevision('department', id, { ...existing, status: 'deleted' }, user);
      cache.departments = (cache.departments || []).filter(d => d.id !== id);
      emitUpdate();
      cmsStore.logActivity(`Deleted department ID: ${id}`, user);
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
    const item = list.find(p => p.id === id);
    if (!item) return null;
    const isCurrentlyActive = (item.status || 'published') === 'published';
    const updated = {
      ...item,
      status: isCurrentlyActive ? 'draft' : 'published',
      lastModified: new Date().toISOString()
    };
    saveRevision('programme', id, updated, user);
    cache.programmes = list.map(p => p.id === id ? updated : p);
    emitUpdate();
    cmsStore.logActivity(`Turned Course "${item.name || item.title || item.code}" ${isCurrentlyActive ? 'OFF (Draft)' : 'ON (Live)'}`, user);
    return updated;
  },

  toggleProgrammeHoneycomb: async (id, user = 'Administrator') => {
    const list = cache.programmes || [];
    const item = list.find(p => p.id === id);
    if (!item) return null;
    const isCurrentlyFeatured = item.isFeaturedHoneycomb !== false;
    const updated = {
      ...item,
      isFeaturedHoneycomb: !isCurrentlyFeatured,
      lastModified: new Date().toISOString()
    };
    saveRevision('programme', id, updated, user);
    cache.programmes = list.map(p => p.id === id ? updated : p);
    emitUpdate();
    cmsStore.logActivity(`Toggled Honeycomb Grid for "${item.code || item.name}" to ${!isCurrentlyFeatured ? 'ON (Shown)' : 'OFF (Hidden)'}`, user);
    return updated;
  },

  bulkSetProgrammesStatus: async (streamOrIds, newStatus = 'published', user = 'Administrator') => {
    const list = cache.programmes || [];
    cache.programmes = list.map(p => {
      let shouldUpdate = false;
      if (Array.isArray(streamOrIds)) {
        shouldUpdate = streamOrIds.includes(p.id);
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
    return cache.programmes;
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
    return record;
  },

  deletePage: async (id, user = 'Administrator') => {
    const existing = (cache.pages || []).find(p => p.id === id);
    if (existing) {
      saveRevision('page', id, { ...existing, status: 'deleted' }, user);
      cache.pages = (cache.pages || []).filter(p => p.id !== id);
      emitUpdate();
      cmsStore.logActivity(`Deleted page ID: ${id}`, user);
    }
    return cache.pages;
  },

  // ================= 5. NOTICES & ANNOUNCEMENTS =================
  getNotices: (filters = {}) => {
    let list = cache.notices || [];
    if (filters.category && filters.category !== 'all') {
      list = list.filter(n => (n.category || '').toLowerCase() === filters.category.toLowerCase());
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(n => (n.title && n.title.toLowerCase().includes(q)));
    }
    return list;
  },

  saveNotice: async (noticeItem, user = 'Administrator') => {
    const isNew = !noticeItem.id;
    const id = isNew ? `notice-${Date.now()}` : noticeItem.id;

    const record = {
      ...noticeItem,
      id,
      status: noticeItem.status || 'published',
      publishDate: noticeItem.publishDate || new Date().toISOString().split('T')[0]
    };

    if (isNew) {
      cache.notices = [record, ...(cache.notices || [])];
    } else {
      cache.notices = (cache.notices || []).map(n => n.id === id ? record : n);
    }

    emitUpdate();
    cmsStore.logActivity(`Saved notice: ${record.title}`, user);
    return record;
  },

  addNotice: (noticeItem) => {
    cache.notices = [noticeItem, ...(cache.notices || [])];
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
    return cache.notices;
  },

  // ================= 6. EVENTS MANAGEMENT =================
  getEvents: () => cache.events || [],

  saveEvent: async (eventItem, user = 'Administrator') => {
    const isNew = !eventItem.id;
    const id = isNew ? `event-${Date.now()}` : eventItem.id;
    const slug = eventItem.slug || eventItem.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const record = {
      ...eventItem,
      id,
      slug,
      status: eventItem.status || 'published',
      date: eventItem.date || new Date().toISOString().split('T')[0]
    };

    if (isNew) {
      cache.events = [record, ...(cache.events || [])];
    } else {
      cache.events = (cache.events || []).map(e => e.id === id ? record : e);
    }

    emitUpdate();
    cmsStore.logActivity(`Saved event: ${record.title}`, user);
    return record;
  },

  addEvent: (eventItem) => {
    cache.events = [eventItem, ...(cache.events || [])];
    emitUpdate();
  },

  updateEventsList: (list) => {
    cache.events = list;
    emitUpdate();
  },

  deleteEvent: async (id, user = 'Administrator') => {
    cache.events = (cache.events || []).filter(e => e.id !== id);
    emitUpdate();
    cmsStore.logActivity(`Deleted event ID: ${id}`, user);
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
    return record;
  },

  deleteSlider: async (id, user = 'Administrator') => {
    cache.sliders = (cache.sliders || []).filter(s => s.id !== id);
    emitUpdate();
    cmsStore.logActivity(`Deleted hero slide ID: ${id}`, user);
    return cache.sliders;
  },

  // ================= 10. MENUS & NAVIGATION =================
  getMenus: () => cache.menus || {},

  saveMenus: async (menuData, user = 'Administrator') => {
    saveRevision('menu', 'mega-menu', cache.menus, user);
    cache.menus = menuData;
    emitUpdate();
    cmsStore.logActivity(`Updated navigation mega-menus`, user);
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

  // ================= 11. REVISIONS & ROLLBACK =================
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
  getLogs: () => cache.logs || [],

  logActivity: (action, user = 'Administrator') => {
    const logItem = {
      id: `log-${Date.now()}`,
      action,
      user,
      timestamp: new Date().toISOString()
    };
    cache.logs = [logItem, ...(cache.logs || []).slice(0, 200)];
    emitUpdate();
  },

  // ================= 12. RESET TO OFFICIAL IMPORTER STATE =================
  resetToImportedState: () => {
    cache = getInitialData();
    emitUpdate();
  }
};

export default cmsStore;
