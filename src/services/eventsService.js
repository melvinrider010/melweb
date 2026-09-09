import api from '../lib/api';
import cmsStore from '../lib/cmsStore';

/**
 * Public Events Service - Merges Server + Central CMS Store
 * Strictly partitions events by current date:
 * - Upcoming Events: effective date >= today
 * - Past Events: effective date < today
 */

export function getTodayDateString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

export function isEventUpcoming(event, todayStr = getTodayDateString()) {
  if (!event) return false;
  const effectiveEndDate = event.end_date || event.event_date || event.date;
  if (effectiveEndDate && effectiveEndDate >= todayStr) {
    return true;
  }
  if (Array.isArray(event.subEvents) && event.subEvents.length > 0) {
    return event.subEvents.some((sub) => sub.event_date && sub.event_date >= todayStr);
  }
  return false;
}

export function getEffectiveUpcomingDate(event, todayStr = getTodayDateString()) {
  if (!event) return '9999-12-31';
  const parentDate = event.event_date || event.date;
  const parentEndDate = event.end_date || parentDate;
  if (parentEndDate >= todayStr && parentDate >= todayStr) {
    return parentDate;
  }
  if (Array.isArray(event.subEvents) && event.subEvents.length > 0) {
    const futureSubDates = event.subEvents
      .map((s) => s.event_date)
      .filter((d) => d && d >= todayStr)
      .sort();
    if (futureSubDates.length > 0) {
      return futureSubDates[0];
    }
  }
  return parentDate || '9999-12-31';
}

export async function getUpcomingEvents(filters = {}) {
  const todayStr = getTodayDateString();
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

  // Filter local events: strictly UPCOMING (effective date >= today)
  localEvents = localEvents.filter(e => isEventUpcoming(e, todayStr));

  if (filters.level && filters.level !== 'all') {
    localEvents = localEvents.filter(e => (e.level || 'all') === 'all' || e.level === filters.level);
  }
  if (filters.category && filters.category !== 'all') {
    localEvents = localEvents.filter(e => (e.category || '').toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.search && filters.search.trim() !== '') {
    const q = filters.search.toLowerCase();
    localEvents = localEvents.filter(e => (e.title || '').toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q));
  }

  const mergedMap = new Map();
  // Backend events (strictly verified upcoming)
  backendEvents.forEach(e => {
    if (isEventUpcoming(e, todayStr)) {
      mergedMap.set(String(e.id), e);
    }
  });
  // Local events (strictly verified upcoming)
  localEvents.forEach(e => {
    if (isEventUpcoming(e, todayStr)) {
      mergedMap.set(String(e.id), e);
    }
  });

  const list = Array.from(mergedMap.values());
  // Sort ascending: nearest upcoming date first
  return list.sort((a, b) => {
    const dateA = getEffectiveUpcomingDate(a, todayStr);
    const dateB = getEffectiveUpcomingDate(b, todayStr);
    return dateA.localeCompare(dateB);
  });
}

export async function getPastEvents(filters = {}) {
  const todayStr = getTodayDateString();
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

  // Filter local events: strictly PAST (effective date < today)
  localEvents = localEvents.filter(e => !isEventUpcoming(e, todayStr));

  if (filters.level && filters.level !== 'all') {
    localEvents = localEvents.filter(e => (e.level || 'all') === 'all' || e.level === filters.level);
  }
  if (filters.category && filters.category !== 'all') {
    localEvents = localEvents.filter(e => (e.category || '').toLowerCase() === filters.category.toLowerCase());
  }
  if (filters.search && filters.search.trim() !== '') {
    const q = filters.search.toLowerCase();
    localEvents = localEvents.filter(e => (e.title || '').toLowerCase().includes(q) || (e.description || '').toLowerCase().includes(q));
  }

  const mergedMap = new Map();
  backendEvents.forEach(e => {
    if (!isEventUpcoming(e, todayStr)) {
      mergedMap.set(String(e.id), e);
    }
  });
  localEvents.forEach(e => {
    if (!isEventUpcoming(e, todayStr)) {
      mergedMap.set(String(e.id), e);
    }
  });

  const list = Array.from(mergedMap.values());
  // Sort descending: most recent completed event first
  return list.sort((a, b) => {
    const dateA = a.event_date || a.date || '';
    const dateB = b.event_date || b.date || '';
    return dateB.localeCompare(dateA);
  });
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
