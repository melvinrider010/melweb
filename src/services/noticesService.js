import api from '../lib/api';
import cmsStore from '../lib/cmsStore';

/**
 * Public Notices Service - Merges Server + Central CMS Store
 */
export async function getNotices(filters = {}) {
  let backendNotices = [];
  try {
    const params = {};
    if (filters.level && filters.level !== 'all') params.level = filters.level;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.type && filters.type !== 'all') params.type = filters.type;
    if (filters.search && filters.search.trim() !== '') params.search = filters.search.trim();

    const response = await api.get('/notices', params);
    backendNotices = Array.isArray(response?.data) ? response.data : [];
  } catch (e) {
    backendNotices = [];
  }

  // Retrieve locally published / custom notices from cmsStore
  let localNotices = [];
  try {
    localNotices = cmsStore.getNotices ? cmsStore.getNotices() : [];
  } catch (e) {
    localNotices = [];
  }

  if (filters.category && filters.category !== 'all') {
    localNotices = localNotices.filter(n => (n.category || '').toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.search && filters.search.trim() !== '') {
    const q = filters.search.toLowerCase();
    localNotices = localNotices.filter(n => (n.title || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q));
  }

  // Merge: Local CMS notices take precedence by ID, new ones prepended
  const mergedMap = new Map();
  backendNotices.forEach(n => mergedMap.set(String(n.id), n));
  localNotices.forEach(n => mergedMap.set(String(n.id), n));

  return Array.from(mergedMap.values());
}

export async function getNoticeById(idOrSlug) {
  if (!idOrSlug) return null;
  
  // Check cmsStore first
  try {
    const local = cmsStore.getNotices ? cmsStore.getNotices().find(n => String(n.id) === String(idOrSlug) || n.slug === idOrSlug) : null;
    if (local) return local;
  } catch (e) {
    // Continue
  }

  try {
    const response = await api.get(`/notices/${encodeURIComponent(idOrSlug)}`);
    return response?.data || response || null;
  } catch (e) {
    return null;
  }
}
