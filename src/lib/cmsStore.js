// Centralized CMS Store & Local Persistence Engine
import slidersData from '../data/sliders.json';
import noticesData from '../data/notices.json';
import eventsData from '../data/events.json';
import mediaData from '../data/media.json';
import docData from '../data/documents.json';
import facultyData from '../data/faculty.json';
import deptData from '../data/departments.json';
import ugData from '../data/ug-programmes.json';
import pgData from '../data/pg-programmes.json';
import userData from '../data/users.json';
import roleData from '../data/roles.json';
import logData from '../data/activity-logs.json';
import settingsData from '../data/settings.json';

const STORAGE_KEYS = {
  SLIDERS: 'stphilos_cms_sliders',
  NOTICES: 'stphilos_cms_notices',
  EVENTS: 'stphilos_cms_events',
  MEDIA: 'stphilos_cms_media',
  DOCUMENTS: 'stphilos_cms_documents',
  FACULTY: 'stphilos_cms_faculty',
  DEPARTMENTS: 'stphilos_cms_departments',
  UG_PROGRAMMES: 'stphilos_cms_ug',
  PG_PROGRAMMES: 'stphilos_cms_pg',
  USERS: 'stphilos_cms_users',
  ROLES: 'stphilos_cms_roles',
  LOGS: 'stphilos_cms_logs',
  SETTINGS: 'stphilos_cms_settings'
};

// Helper: Read or Initialize LocalStorage
function getItem(key, defaultVal) {
  try {
    const item = localStorage.getItem(key);
    if (!item) {
      localStorage.setItem(key, JSON.stringify(defaultVal));
      return defaultVal;
    }
    return JSON.parse(item);
  } catch (e) {
    return defaultVal;
  }
}

function setItem(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
    window.dispatchEvent(new Event('cms_store_updated'));
  } catch (e) {
    console.error('CMS Storage Error:', e);
  }
}

// Log Activity
function addActivityLog(user, action, module, details) {
  const logs = getItem(STORAGE_KEYS.LOGS, logData);
  const newLog = {
    id: `log_${Date.now()}`,
    user: user || 'admin@stphilos.ac.in',
    action,
    module,
    details,
    timestamp: new Date().toLocaleString()
  };
  setItem(STORAGE_KEYS.LOGS, [newLog, ...logs]);
}

export const cmsStore = {
  // 1. SLIDERS
  getSliders: () => getItem(STORAGE_KEYS.SLIDERS, slidersData),
  addSlider: (slide) => {
    const list = getItem(STORAGE_KEYS.SLIDERS, slidersData);
    const updated = [slide, ...list];
    setItem(STORAGE_KEYS.SLIDERS, updated);
    addActivityLog('admin@stphilos.ac.in', 'CREATE_SLIDER', 'Sliders', `Added slide "${slide.title}"`);
    return updated;
  },
  deleteSlider: (id) => {
    const list = getItem(STORAGE_KEYS.SLIDERS, slidersData);
    const updated = list.filter(s => s.id !== id);
    setItem(STORAGE_KEYS.SLIDERS, updated);
    addActivityLog('admin@stphilos.ac.in', 'DELETE_SLIDER', 'Sliders', `Deleted slide ID ${id}`);
    return updated;
  },

  // 2. NOTICES
  getNotices: () => getItem(STORAGE_KEYS.NOTICES, noticesData),
  addNotice: (notice) => {
    const list = getItem(STORAGE_KEYS.NOTICES, noticesData);
    const updated = [notice, ...list];
    setItem(STORAGE_KEYS.NOTICES, updated);
    addActivityLog('admin@stphilos.ac.in', 'CREATE_NOTICE', 'Notices', `Published notice "${notice.title}"`);
    return updated;
  },
  updateNoticesList: (list) => {
    setItem(STORAGE_KEYS.NOTICES, list);
    return list;
  },
  deleteNotice: (id) => {
    const list = getItem(STORAGE_KEYS.NOTICES, noticesData);
    const updated = list.filter(n => n.id !== id);
    setItem(STORAGE_KEYS.NOTICES, updated);
    addActivityLog('admin@stphilos.ac.in', 'DELETE_NOTICE', 'Notices', `Deleted notice ID ${id}`);
    return updated;
  },

  // 3. EVENTS
  getEvents: () => getItem(STORAGE_KEYS.EVENTS, eventsData),
  addEvent: (event) => {
    const list = getItem(STORAGE_KEYS.EVENTS, eventsData);
    const updated = [event, ...list];
    setItem(STORAGE_KEYS.EVENTS, updated);
    addActivityLog('admin@stphilos.ac.in', 'CREATE_EVENT', 'Events', `Created event "${event.title}"`);
    return updated;
  },
  updateEventsList: (list) => {
    setItem(STORAGE_KEYS.EVENTS, list);
    return list;
  },
  deleteEvent: (id) => {
    const list = getItem(STORAGE_KEYS.EVENTS, eventsData);
    const updated = list.filter(e => e.id !== id);
    setItem(STORAGE_KEYS.EVENTS, updated);
    addActivityLog('admin@stphilos.ac.in', 'DELETE_EVENT', 'Events', `Deleted event ID ${id}`);
    return updated;
  },

  // 4. FACULTY
  getFaculty: () => getItem(STORAGE_KEYS.FACULTY, facultyData),
  addFaculty: (member) => {
    const list = getItem(STORAGE_KEYS.FACULTY, facultyData);
    const updated = [member, ...list];
    setItem(STORAGE_KEYS.FACULTY, updated);
    addActivityLog('admin@stphilos.ac.in', 'ADD_FACULTY', 'Faculty', `Added faculty member "${member.name}"`);
    return updated;
  },
  deleteFaculty: (name) => {
    const list = getItem(STORAGE_KEYS.FACULTY, facultyData);
    const updated = list.filter(f => f.name !== name);
    setItem(STORAGE_KEYS.FACULTY, updated);
    addActivityLog('admin@stphilos.ac.in', 'DELETE_FACULTY', 'Faculty', `Removed faculty member "${name}"`);
    return updated;
  },

  // 5. MEDIA & DOCUMENTS
  getMedia: () => getItem(STORAGE_KEYS.MEDIA, mediaData),
  addMedia: (mediaItem) => {
    const list = getItem(STORAGE_KEYS.MEDIA, mediaData);
    const updated = [mediaItem, ...list];
    setItem(STORAGE_KEYS.MEDIA, updated);
    addActivityLog('admin@stphilos.ac.in', 'UPLOAD_MEDIA', 'Media Library', `Uploaded media file "${mediaItem.filename}"`);
    return updated;
  },
  getDocuments: () => getItem(STORAGE_KEYS.DOCUMENTS, docData),
  addDocument: (docItem) => {
    const list = getItem(STORAGE_KEYS.DOCUMENTS, docData);
    const updated = [docItem, ...list];
    setItem(STORAGE_KEYS.DOCUMENTS, updated);
    addActivityLog('admin@stphilos.ac.in', 'UPLOAD_DOCUMENT', 'Documents', `Uploaded document "${docItem.title}"`);
    return updated;
  },

  // 6. PROGRAMMES & DEPARTMENTS
  getDepartments: () => getItem(STORAGE_KEYS.DEPARTMENTS, deptData),
  getUGProgrammes: () => getItem(STORAGE_KEYS.UG_PROGRAMMES, ugData),
  getPGProgrammes: () => getItem(STORAGE_KEYS.PG_PROGRAMMES, pgData),
  addProgramme: (prog) => {
    const list = getItem(STORAGE_KEYS.UG_PROGRAMMES, ugData);
    const updated = [prog, ...list];
    setItem(STORAGE_KEYS.UG_PROGRAMMES, updated);
    addActivityLog('admin@stphilos.ac.in', 'ADD_PROGRAMME', 'Programmes', `Added programme "${prog.title}"`);
    return updated;
  },

  // 7. USERS & LOGS & SETTINGS
  getUsers: () => getItem(STORAGE_KEYS.USERS, userData),
  addUser: (user) => {
    const list = getItem(STORAGE_KEYS.USERS, userData);
    const updated = [user, ...list];
    setItem(STORAGE_KEYS.USERS, updated);
    addActivityLog('admin@stphilos.ac.in', 'CREATE_USER', 'Users', `Created user "${user.email}"`);
    return updated;
  },
  getLogs: () => getItem(STORAGE_KEYS.LOGS, logData),
  getSettings: () => getItem(STORAGE_KEYS.SETTINGS, settingsData),
  updateSettings: (newSettings) => {
    const current = getItem(STORAGE_KEYS.SETTINGS, settingsData);
    const updated = { ...current, ...newSettings };
    setItem(STORAGE_KEYS.SETTINGS, updated);
    addActivityLog('admin@stphilos.ac.in', 'UPDATE_SETTINGS', 'Settings', 'Updated website settings');
    return updated;
  }
};
