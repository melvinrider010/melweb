// Centralized Data Logic & Sync Engine for Events, Sub-Events, and Notice Board
import { cmsStore } from './cmsStore';

/**
 * Helper to get current ISO date in YYYY-MM-DD
 */
export function getTodayDateString() {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Format a YYYY-MM-DD string into a human readable display string
 */
export function formatDisplayDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  } catch (e) {
    return dateStr;
  }
}

/**
 * Checks if an event qualifies as "Upcoming" at query-time:
 * 1. Event's own event_date (or end_date if present) >= todayStr
 * 2. OR any of its nested subEvents has subEvent.event_date >= todayStr
 */
export function isEventUpcoming(event, todayStr = getTodayDateString()) {
  if (!event) return false;
  const effectiveEndDate = event.end_date || event.event_date || event.date;
  if (effectiveEndDate && effectiveEndDate >= todayStr) {
    return true;
  }

  if (Array.isArray(event.subEvents) && event.subEvents.length > 0) {
    const hasUpcomingSubEvent = event.subEvents.some(
      (sub) => sub.event_date && sub.event_date >= todayStr
    );
    if (hasUpcomingSubEvent) return true;
  }

  return false;
}

/**
 * Gets the earliest upcoming date for sorting upcoming events ascendingly.
 */
export function getEffectiveUpcomingDate(event, todayStr = getTodayDateString()) {
  if (!event) return '9999-12-31';
  const parentDate = event.event_date || event.date;
  const parentEndDate = event.end_date || parentDate;

  if (parentEndDate >= todayStr && parentDate >= todayStr) {
    return parentDate;
  }

  // If parent date has passed but sub-event is future, find earliest future sub-event date
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

/**
 * Query Upcoming Events with dynamic query-time date filtering & sorting
 */
export function getUpcomingEvents(filters = {}, todayStr = getTodayDateString()) {
  const allEvents = cmsStore.getEvents();
  const { level = 'all', category = 'all', search = '' } = filters;

  return allEvents
    .filter((event) => {
      // 1. Dynamic date query-time comparison
      if (!isEventUpcoming(event, todayStr)) return false;

      // 2. Level filter (UG / PG / All)
      if (level !== 'all') {
        const itemLevel = event.level || 'all';
        if (itemLevel !== 'all' && itemLevel !== level) return false;
      }

      // 3. Category filter
      if (category !== 'all' && event.category !== category) return false;

      // 4. Search query
      if (search && search.trim() !== '') {
        const q = search.toLowerCase();
        const tMatch = (event.title || '').toLowerCase().includes(q);
        const sMatch = (event.description || event.summary || '').toLowerCase().includes(q);
        const vMatch = (event.location || event.venue || '').toLowerCase().includes(q);
        const cMatch = (event.category || '').toLowerCase().includes(q);
        const subMatch = (event.subEvents || []).some((sub) =>
          (sub.title || '').toLowerCase().includes(q) ||
          (sub.description || '').toLowerCase().includes(q)
        );
        if (!tMatch && !sMatch && !vMatch && !cMatch && !subMatch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = getEffectiveUpcomingDate(a, todayStr);
      const dateB = getEffectiveUpcomingDate(b, todayStr);
      return dateA.localeCompare(dateB);
    });
}

/**
 * Query Past / Archived Events
 */
export function getPastEvents(filters = {}, todayStr = getTodayDateString()) {
  const allEvents = cmsStore.getEvents();
  const { level = 'all', category = 'all', search = '' } = filters;

  return allEvents
    .filter((event) => {
      if (isEventUpcoming(event, todayStr)) return false;

      if (level !== 'all') {
        const itemLevel = event.level || 'all';
        if (itemLevel !== 'all' && itemLevel !== level) return false;
      }

      if (category !== 'all' && event.category !== category) return false;

      if (search && search.trim() !== '') {
        const q = search.toLowerCase();
        const tMatch = (event.title || '').toLowerCase().includes(q);
        const sMatch = (event.description || event.summary || '').toLowerCase().includes(q);
        if (!tMatch && !sMatch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = a.event_date || a.date || '';
      const dateB = b.event_date || b.date || '';
      return dateB.localeCompare(dateA); // Past sorted newest to oldest
    });
}

/**
 * Query Notices (both standalone notices and event-linked entries)
 */
export function getSyncedNotices(filters = {}) {
  const allNotices = cmsStore.getNotices();
  const { level = 'all', category = 'all', search = '', type = 'all' } = filters;

  return allNotices
    .filter((item) => {
      // Type Filter
      if (type !== 'all' && item.type !== type) return false;

      // Level Filter
      if (level !== 'all') {
        const itemLevel = item.level || 'all';
        if (itemLevel !== 'all' && itemLevel !== level) return false;
      }

      // Category Filter
      if (category !== 'all' && item.category !== category) return false;

      // Search Filter
      if (search && search.trim() !== '') {
        const q = search.toLowerCase();
        const tMatch = (item.title || '').toLowerCase().includes(q);
        const sMatch = (item.summary || '').toLowerCase().includes(q);
        const cMatch = (item.category || '').toLowerCase().includes(q);
        const tagMatch = (item.tags || []).some((t) => t.toLowerCase().includes(q));
        if (!tMatch && !sMatch && !cMatch && !tagMatch) return false;
      }

      return true;
    })
    .sort((a, b) => {
      const dateA = a.date || '';
      const dateB = b.date || '';
      return dateB.localeCompare(dateA);
    });
}

/**
 * Get Event by ID or Slug
 */
export function getEventById(idOrSlug) {
  const events = cmsStore.getEvents();
  return events.find((e) => e.id === idOrSlug || e.slug === idOrSlug) || null;
}

/**
 * Core Action 1: CREATE NEW EVENT -> Auto-generates Notice Board entry
 */
export function createEvent(eventData) {
  const timestamp = new Date().toISOString();
  const eventId = eventData.id || `evt-${Date.now()}`;
  const slug = eventData.slug || eventData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const dateStr = eventData.event_date || eventData.date || getTodayDateString();

  const newEvent = {
    id: eventId,
    slug,
    title: eventData.title,
    description: eventData.description || eventData.summary || '',
    summary: eventData.summary || eventData.description || '',
    event_date: dateStr,
    end_date: eventData.end_date || null,
    date: dateStr,
    displayDate: eventData.displayDate || formatDisplayDate(dateStr),
    time_range: eventData.time_range || eventData.time || '09:30 AM – 04:30 PM',
    time: eventData.time || eventData.time_range || '09:30 AM – 04:30 PM',
    location: eventData.location || eventData.venue || 'College Campus',
    venue: eventData.venue || eventData.location || 'College Campus',
    category: eventData.category || 'Conferences & Seminars',
    level: eventData.level || 'all',
    refNo: eventData.refNo || `SPC/EVT/${new Date().getFullYear()}/${Math.floor(100 + Math.random() * 900)}`,
    documentImage: eventData.documentImage || '/media/gallery/campus/campus_quadrangle_main.jpg',
    documentPdf: eventData.documentPdf || null,
    attachments: eventData.attachments || [],
    content: eventData.content || [eventData.description || eventData.summary || ''],
    subEvents: Array.isArray(eventData.subEvents) ? eventData.subEvents : [],
    signatory: eventData.signatory || 'Office of Principal & Event Coordinator',
    department: eventData.department || 'Office of Academic Affairs',
    created_at: timestamp,
    updated_at: timestamp
  };

  // 1. Add Event to Events collection
  cmsStore.addEvent(newEvent);

  // 2. Auto-generate corresponding Notice Board Entry
  const autoNoticeId = `notice-evt-${eventId}`;
  const autoTags = ['EVENT'];
  if (newEvent.category) {
    const catTag = newEvent.category.split(' ')[0].replace(/[^a-zA-Z]/g, '').toUpperCase();
    if (catTag) autoTags.push(catTag);
  }
  if (newEvent.level && newEvent.level !== 'all') {
    autoTags.push(newEvent.level.toUpperCase());
  }

  const autoNotice = {
    id: autoNoticeId,
    slug: newEvent.slug,
    type: 'Event',
    level: newEvent.level,
    title: newEvent.title,
    refNo: newEvent.refNo,
    date: newEvent.event_date,
    displayDate: newEvent.displayDate,
    category: newEvent.category,
    tags: autoTags,
    summary: newEvent.description || newEvent.summary,
    documentImage: newEvent.documentImage,
    content: newEvent.content,
    signatory: newEvent.signatory,
    department: newEvent.department,
    link: `/news-events/${newEvent.id}`,
    linked_event_id: newEvent.id,
    linked_sub_event_id: null,
    downloadable: !!newEvent.documentPdf,
    created_at: timestamp,
    updated_at: timestamp
  };

  cmsStore.addNotice(autoNotice);

  return newEvent;
}

/**
 * Core Action 2: ADD SUB-EVENT -> Updates Parent Event & Auto-Updates Notice Board
 */
export function addSubEvent(parentEventId, subEventData) {
  const events = cmsStore.getEvents();
  const eventIndex = events.findIndex((e) => e.id === parentEventId);

  if (eventIndex === -1) {
    throw new Error(`Parent Event with ID "${parentEventId}" not found.`);
  }

  const parent = { ...events[eventIndex] };
  const timestamp = new Date().toISOString();
  const subId = subEventData.id || `sub-${Date.now()}`;
  const subDate = subEventData.event_date || subEventData.date || parent.event_date;

  const newSubEvent = {
    id: subId,
    parent_event_id: parentEventId,
    title: subEventData.title,
    description: subEventData.description || '',
    event_date: subDate,
    displayDate: subEventData.displayDate || formatDisplayDate(subDate),
    time_range: subEventData.time_range || subEventData.time || '10:00 AM – 01:00 PM',
    time: subEventData.time || subEventData.time_range || '10:00 AM – 01:00 PM',
    location: subEventData.location || subEventData.venue || parent.location || 'College Campus',
    venue: subEventData.venue || subEventData.location || parent.venue || 'College Campus',
    attachments: subEventData.attachments || [],
    created_at: timestamp,
    updated_at: timestamp
  };

  parent.subEvents = [...(parent.subEvents || []), newSubEvent];
  parent.updated_at = timestamp;

  // Save updated parent event
  events[eventIndex] = parent;
  cmsStore.updateEventsList(events);

  // Auto-sync / update the Notice Board entry for this event
  const notices = cmsStore.getNotices();
  const noticeIndex = notices.findIndex((n) => n.linked_event_id === parentEventId);

  if (noticeIndex !== -1) {
    const updatedNotice = { ...notices[noticeIndex] };
    updatedNotice.updated_at = timestamp;
    updatedNotice.summary = `${parent.summary} (Includes Sub-Event: ${newSubEvent.title} on ${newSubEvent.event_date})`;
    notices[noticeIndex] = updatedNotice;
    cmsStore.updateNoticesList(notices);
  } else {
    // If no linked notice exists yet, create one
    const autoTags = ['EVENT'];
    if (parent.category) autoTags.push(parent.category.split(' ')[0].toUpperCase());
    const autoNotice = {
      id: `notice-evt-${parent.id}`,
      slug: parent.slug,
      type: 'Event',
      level: parent.level,
      title: parent.title,
      refNo: parent.refNo,
      date: parent.event_date,
      displayDate: parent.displayDate,
      category: parent.category,
      tags: autoTags,
      summary: `${parent.summary} (Includes Sub-Event: ${newSubEvent.title})`,
      documentImage: parent.documentImage,
      content: parent.content,
      signatory: parent.signatory,
      department: parent.department,
      link: `/news-events/${parent.id}`,
      linked_event_id: parent.id,
      linked_sub_event_id: newSubEvent.id,
      downloadable: !!parent.documentPdf,
      created_at: timestamp,
      updated_at: timestamp
    };
    cmsStore.addNotice(autoNotice);
  }

  return { parent, subEvent: newSubEvent };
}

/**
 * Core Action 3: DELETE EVENT -> Cleans up Event & Linked Notices
 */
export function deleteEvent(eventId) {
  const events = cmsStore.getEvents();
  const updatedEvents = events.filter((e) => e.id !== eventId);
  cmsStore.updateEventsList(updatedEvents);

  const notices = cmsStore.getNotices();
  const updatedNotices = notices.filter((n) => n.linked_event_id !== eventId);
  cmsStore.updateNoticesList(updatedNotices);

  return updatedEvents;
}

/**
 * Core Action 4: DELETE SUB-EVENT
 */
export function deleteSubEvent(parentEventId, subEventId) {
  const events = cmsStore.getEvents();
  const eventIndex = events.findIndex((e) => e.id === parentEventId);

  if (eventIndex !== -1) {
    const parent = { ...events[eventIndex] };
    parent.subEvents = (parent.subEvents || []).filter((s) => s.id !== subEventId);
    parent.updated_at = new Date().toISOString();
    events[eventIndex] = parent;
    cmsStore.updateEventsList(events);
  }
  return events;
}
