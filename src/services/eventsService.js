import api from '../lib/api';
import cmsStore from '../lib/cmsStore';

/**
 * Public Events Service - Merges Server + Central CMS Store
 */
export async function getUpcomingEvents(filters = {}) {
  let backendEvents = [];
  try {
    const params = {};
    if (filters.level && filters.level !== 'all') params.level = filters.level;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.search && filters.search.trim() !== '') params.search = filters.search.trim();

    const response = await api.get('/events/upcoming', params);
    backendEvents = Array.isArray(response?.data) ? response.data : [];
  } catch (e) {
    backendEvents = [];
  }

  let localEvents = [];
  try {
    localEvents = cmsStore.getEvents ? cmsStore.getEvents() : [];
  } catch (e) {
    localEvents = [];
  }

  if (filters.category && filters.category !== 'all') {
    localEvents = localEvents.filter(e => (e.category || '').toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.search && filters.search.trim() !== '') {
    const q = filters.search.toLowerCase();
    localEvents = localEvents.filter(e => (e.title || '').toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q));
  }

  const mergedMap = new Map();
  backendEvents.forEach(e => mergedMap.set(String(e.id), e));
  localEvents.forEach(e => mergedMap.set(String(e.id), e));

  return Array.from(mergedMap.values());
}

export async function getPastEvents(filters = {}) {
  let backendEvents = [];
  try {
    const params = {};
    if (filters.level && filters.level !== 'all') params.level = filters.level;
    if (filters.category && filters.category !== 'all') params.category = filters.category;
    if (filters.search && filters.search.trim() !== '') params.search = filters.search.trim();

    const response = await api.get('/events/past', params);
    backendEvents = Array.isArray(response?.data) ? response.data : [];
  } catch (e) {
    backendEvents = [];
  }

  let localEvents = [];
  try {
    localEvents = cmsStore.getEvents ? cmsStore.getEvents() : [];
  } catch (e) {
    localEvents = [];
  }

  const mergedMap = new Map();
  backendEvents.forEach(e => mergedMap.set(String(e.id), e));
  // Filter past local events if date < today
  const today = new Date().toISOString().split('T')[0];
  localEvents.filter(e => e.date && e.date < today).forEach(e => mergedMap.set(String(e.id), e));

  return Array.from(mergedMap.values());
}

export async function getAllEvents() {
  let backendEvents = [];
  try {
    const response = await api.get('/events');
    backendEvents = Array.isArray(response?.data) ? response.data : [];
  } catch (e) {
    backendEvents = [];
  }

  let localEvents = [];
  try {
    localEvents = cmsStore.getEvents ? cmsStore.getEvents() : [];
  } catch (e) {
    localEvents = [];
  }

  const mergedMap = new Map();
  backendEvents.forEach(e => mergedMap.set(String(e.id), e));
  localEvents.forEach(e => mergedMap.set(String(e.id), e));

  return Array.from(mergedMap.values());
}

export async function getEventById(idOrSlug) {
  if (!idOrSlug) return null;

  try {
    const local = cmsStore.getEvents ? cmsStore.getEvents().find(e => String(e.id) === String(idOrSlug) || e.slug === idOrSlug) : null;
    if (local) return local;
  } catch (e) {
    // Continue
  }

  try {
    const response = await api.get(`/events/${encodeURIComponent(idOrSlug)}`);
    return response?.data || response || null;
  } catch (e) {
    return null;
  }
}
