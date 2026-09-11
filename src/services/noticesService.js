import api from '../lib/api';
import cmsStore from '../lib/cmsStore';

const normalizeCategory = (cat) => {
  if (!cat) return '';
  const lower = String(cat).toLowerCase().trim();
  if (lower === 'examination' || lower === 'examinations') return 'examination';
  return lower;
};

const matchesCategory = (itemCategory, filterCategory) => {
  if (!filterCategory || filterCategory === 'all') return true;
  return normalizeCategory(itemCategory) === normalizeCategory(filterCategory);
};

const standardizeNotice = (n) => {
  const effectiveDate = n.date || n.publishDate || new Date().toISOString().split('T')[0];
  return {
    ...n,
    id: String(n.id),
    date: effectiveDate,
    publishDate: effectiveDate,
    type: n.type || 'Notice',
    category: n.category || 'General',
    status: n.status || 'published',
    summary: n.summary || n.content?.slice(0, 160) || n.title,
    link: n.link || n.attachmentUrl || `/news-events/${n.id}`
  };
};

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

  // Merge: Local CMS notices take precedence by ID
  const mergedMap = new Map();
  localNotices.map(standardizeNotice).forEach(n => mergedMap.set(n.id, n));
  backendNotices.map(standardizeNotice).forEach(n => {
    if (!mergedMap.has(n.id)) {
      mergedMap.set(n.id, n);
    }
  });

  let all = Array.from(mergedMap.values());

  // Apply filters
  if (filters.category && filters.category !== 'all') {
    all = all.filter(n => matchesCategory(n.category, filters.category));
  }
  if (filters.type && filters.type !== 'all') {
    const t = filters.type.toLowerCase();
    all = all.filter(n => (n.type || 'notice').toLowerCase() === t);
  }
  if (filters.search && filters.search.trim() !== '') {
    const q = filters.search.toLowerCase();
    all = all.filter(n => (n.title || '').toLowerCase().includes(q) || (n.summary || '').toLowerCase().includes(q) || (n.content || '').toLowerCase().includes(q));
  }

  // Sort: Pinned notices first, then date descending (newest first)
  all.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    const dateA = a.date || a.publishDate || '';
    const dateB = b.date || b.publishDate || '';
    return dateB.localeCompare(dateA);
  });

  return all;
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
