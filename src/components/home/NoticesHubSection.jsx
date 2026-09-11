import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bell, 
  Calendar, 
  Search, 
  Clock, 
  MapPin, 
  ArrowRight, 
  ChevronDown, 
  X, 
  ChevronRight,
  Pause,
  Play,
  Layers,
  Loader2
} from 'lucide-react';
import { 
  getUpcomingEvents, 
  getPastEvents, 
  isEventUpcoming, 
  getTodayDateString 
} from '../../services/eventsService';
import { getNotices } from '../../services/noticesService';
import cmsStore from '../../lib/cmsStore';

export default function NoticesHubSection() {
  const [levelFilter, setLevelFilter] = useState('all'); // 'all', 'ug', 'pg'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNoticeTab, setActiveNoticeTab] = useState('notices'); // 'notices', 'examination', 'events'
  const [isPaused, setIsPaused] = useState(false);
  const [expandedEventIds, setExpandedEventIds] = useState({});
  const scrollContainerRef = useRef(null);

  const todayStr = useMemo(() => getTodayDateString(), []);

  // Initial events state strictly filtered for upcoming (effectiveDate >= today)
  const [rawEvents, setRawEvents] = useState(() => {
    try {
      const today = getTodayDateString();
      const stored = cmsStore.getEvents ? cmsStore.getEvents() : null;
      if (stored && stored.length > 0) {
        return stored.filter((e) => isEventUpcoming(e, today));
      }
    } catch (e) {}
    return [];
  });

  const [rawNotices, setRawNotices] = useState(() => {
    try {
      const stored = cmsStore.getNotices ? cmsStore.getNotices() : null;
      if (stored && stored.length > 0) return stored;
    } catch (e) {}
    return [];
  });

  const [pastEvents, setPastEvents] = useState(() => {
    try {
      const today = getTodayDateString();
      const stored = cmsStore.getEvents ? cmsStore.getEvents() : null;
      if (stored && stored.length > 0) {
        return stored.filter((e) => !isEventUpcoming(e, today));
      }
    } catch (e) {}
    return [];
  });

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      try {
        const [events, notices, past] = await Promise.all([
          getUpcomingEvents({ level: levelFilter, category: categoryFilter, search: searchQuery }),
          getNotices({ level: levelFilter, category: categoryFilter, search: searchQuery }),
          getPastEvents({ level: levelFilter, category: categoryFilter, search: searchQuery }),
        ]);
        if (isMounted) {
          if (events) setRawEvents(events);
          if (notices) setRawNotices(notices);
          if (past) setPastEvents(past);
          setIsLoading(false);
        }
      } catch (e) {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }
    loadData();

    const handleUpdate = () => {
      loadData();
    };
    window.addEventListener('cms_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => { 
      isMounted = false; 
      window.removeEventListener('cms_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, [levelFilter, categoryFilter, searchQuery]);

  // Left column: STRICTLY UPCOMING EVENTS ONLY (date >= today, no older events)
  const filteredEvents = useMemo(() => {
    return rawEvents.filter((e) => isEventUpcoming(e, todayStr));
  }, [rawEvents, todayStr]);

  // Right column: Notice Board with dynamic inclusion of past/completed events
  // When an event date is done (date < today), it dynamically moves to the Notice Board
  const filteredNotices = useMemo(() => {
    // Map past events into notice-compatible format for dynamic inclusion
    const concludedEventsAsNotices = pastEvents.map((evt) => ({
      id: `evt-done-${evt.id}`,
      title: evt.title,
      date: evt.event_date || evt.date,
      category: evt.category || 'Events',
      type: 'Event',
      linked_event_id: evt.id,
      link: `/news-events/${evt.id}`,
      tags: ['EVENT', 'CONCLUDED'],
      summary: evt.summary || evt.description,
      isConcludedEvent: true
    }));

    if (activeNoticeTab === 'examination') {
      const examList = rawNotices.filter((n) => {
        const cat = (n.category || '').toLowerCase();
        return (
          cat === 'examination' ||
          cat === 'examinations' ||
          /exam|timetable|time table|revaluation|makeup|supplementary|c1|c2|c3|convocation/i.test(
            `${n.title} ${n.category || ''}`
          )
        );
      });
      return examList.sort((a, b) => {
        if (b.isPinned !== a.isPinned) return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
        return (b.date || b.publishDate || '').localeCompare(a.date || a.publishDate || '');
      });
    } else if (activeNoticeTab === 'events') {
      // EVENTS Tab: Shows all concluded/past events plus event notices/circulars
      const seenEventIds = new Set();
      const list = [];

      // 1. Add event notices from notice board
      rawNotices
        .filter((n) =>
          n.type === 'Event' ||
          !!n.linked_event_id ||
          /event|seminar|conference|sports|cultural|workshop|meeting|job fair|council|celebration/i.test(
            `${n.title} ${n.category || ''}`
          )
        )
        .forEach((n) => {
          const key = n.linked_event_id ? String(n.linked_event_id) : String(n.id);
          seenEventIds.add(key);
          list.push(n);
        });

      // 2. Dynamically include past events whose dates have passed
      concludedEventsAsNotices.forEach((n) => {
        if (!seenEventIds.has(String(n.linked_event_id))) {
          seenEventIds.add(String(n.linked_event_id));
          list.push(n);
        }
      });

      // Sort newest to oldest completed
      return list.sort((a, b) => {
        if (b.isPinned !== a.isPinned) return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
        return (b.date || b.publishDate || '').localeCompare(a.date || a.publishDate || '');
      });
    } else {
      // Default 'notices': official circulars, notifications, plus past event announcements
      const seen = new Set();
      const combined = [];
      rawNotices.forEach((n) => {
        seen.add(n.id);
        combined.push(n);
      });
      // Concluded events also appear dynamically in latest notices
      concludedEventsAsNotices.slice(0, 5).forEach((n) => {
        if (!seen.has(n.id) && (!n.linked_event_id || !rawNotices.some((r) => r.linked_event_id === n.linked_event_id))) {
          combined.push(n);
        }
      });

      return combined.sort((a, b) => {
        if (b.isPinned !== a.isPinned) return (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0);
        return (b.date || b.publishDate || '').localeCompare(a.date || a.publishDate || '');
      });
    }
  }, [rawNotices, pastEvents, activeNoticeTab]);

  // Extract unique categories across all events and notices for dropdown
  const categories = useMemo(() => {
    const cats = new Set([
      ...filteredEvents.map((item) => item.category),
      ...pastEvents.map((item) => item.category),
      ...rawNotices.map((item) => item.category)
    ].filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [filteredEvents, pastEvents, rawNotices]);

  // Auto-scrolling Notice Board Ticker Effect
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || isPaused || filteredNotices.length <= 2) return;

    const interval = setInterval(() => {
      if (container.scrollTop + container.clientHeight >= container.scrollHeight - 5) {
        // Reset smoothly to top
        container.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        container.scrollBy({ top: 75, behavior: 'smooth' });
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, filteredNotices]);

  const resetFilters = () => {
    setLevelFilter('all');
    setCategoryFilter('all');
    setSearchQuery('');
  };

  const toggleEventSubEvents = (eventId, e) => {
    if (e) e.stopPropagation();
    setExpandedEventIds((prev) => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4">
      <div className="bg-white p-5 sm:p-8 rounded-2xl border border-slate-200/90 shadow-sm space-y-6">
        
        {/* TOP CONTROLS BAR: LIVE SEARCH + CATEGORY FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
          
          <div className="flex items-center space-x-2 text-xs font-bold text-slate-700">
            <span className="w-2 h-2 rounded-full bg-[#0B1F4E]"></span>
            <span>Official Announcements, Circulars & Event Feeds</span>
          </div>

          {/* SEARCH INPUT & CATEGORY DROPDOWN */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            
            {/* Live Search */}
            <div className="relative flex-1 sm:w-56">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search circulars, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-7 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Category Dropdown */}
            <div className="relative shrink-0">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-2.5 pr-7 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#C9A84C] cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.filter(c => c !== 'all').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>

          </div>

        </div>

        {/* ACTIVE FILTER STATUS */}
        {(levelFilter !== 'all' || categoryFilter !== 'all' || searchQuery) && (
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] pt-1">
            <span className="text-slate-400 font-medium">Active Filters:</span>
            {levelFilter !== 'all' && (
              <span className="inline-flex items-center bg-blue-50 text-[#0B1F4E] border border-blue-200 px-2 py-0.5 rounded font-bold">
                Level: {levelFilter.toUpperCase()}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setLevelFilter('all')} />
              </span>
            )}
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-bold">
                {categoryFilter}
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setCategoryFilter('all')} />
              </span>
            )}
            {searchQuery && (
              <span className="inline-flex items-center bg-slate-100 text-slate-700 border border-slate-300 px-2 py-0.5 rounded font-bold">
                "{searchQuery}"
                <X className="w-3 h-3 ml-1 cursor-pointer" onClick={() => setSearchQuery('')} />
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-[#a88530] hover:underline font-bold ml-auto cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* 2-COLUMN DUAL SHOWCASE (PERFECTLY FRAMED & SYMMETRICALLY ALIGNED) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          
          {/* ================= LEFT COLUMN: WHAT'S HAPPENING / UPCOMING EVENTS ================= */}
          <div className="flex flex-col space-y-4">
            
            {/* Column Section Heading */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a88530] block">
                WHAT'S HAPPENING
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#0B1F4E]">
                Upcoming Events
              </h3>
              <div className="w-12 h-0.5 bg-[#C9A84C]" />
            </div>

            {/* Structured Card Frame (Matching Notice Board) */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white border-r-4 border-r-[#C9A84C] flex flex-col flex-1">
              
              {/* Header Bar */}
              <div className="bg-[#0B1F4E] text-white px-5 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2 font-serif font-bold text-xs sm:text-sm tracking-wide">
                  <Calendar className="w-4 h-4 text-[#F0D98C]" />
                  <span>Campus Events & Seminars</span>
                </div>

                <Link
                  to="/news-events"
                  className="text-xs font-sans font-bold text-slate-200 hover:text-[#F0D98C] inline-flex items-center space-x-1 transition-colors"
                >
                  <span>View All</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>

              {/* Event Items Container (Fixed height h-[350px]) */}
              <div className="h-[350px] overflow-y-auto divide-y divide-slate-100 p-0 custom-scrollbar">
                {filteredEvents.length > 0 ? (
                  filteredEvents.map((event) => {
                    const eventDateStr = event.event_date || event.date;
                    let monthStr = 'SEP';
                    let dayStr = '01';
                    if (eventDateStr) {
                      const parts = String(eventDateStr).split('T')[0].split('-');
                      if (parts.length === 3) {
                        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                        monthStr = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                        dayStr = d.getDate();
                      }
                    }
                    const hasSubEvents = Array.isArray(event.subEvents) && event.subEvents.length > 0;
                    const isExpanded = !!expandedEventIds[event.id];

                    return (
                      <div key={event.id} className="divide-y divide-slate-50">
                        <div className="p-4 sm:p-4.5 flex items-start space-x-3.5 hover:bg-slate-50/80 transition-colors group">
                          {/* Left Date Square Badge */}
                          <div className="shrink-0 w-12 h-13 rounded-lg bg-[#0B1F4E] border border-[#C9A84C]/40 text-center flex flex-col items-center justify-center text-white shadow-2xs group-hover:border-[#C9A84C]">
                            <span className="text-[9.5px] font-bold text-[#F0D98C] font-mono tracking-wider leading-tight">
                              {monthStr}
                            </span>
                            <span className="text-base font-serif font-extrabold text-white leading-none mt-0.5">
                              {dayStr}
                            </span>
                          </div>

                          {/* Middle Content */}
                          <div className="space-y-1 flex-1 min-w-0">
                            <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                              <span className="bg-emerald-100 text-emerald-800 text-[9.5px] font-mono font-bold px-2 py-0.5 rounded uppercase">
                                {event.category}
                              </span>
                              {event.level && event.level !== 'all' && (
                                <span className="text-[9.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                                  {event.level}
                                </span>
                              )}
                              {hasSubEvents && (
                                <span className="bg-amber-100 text-amber-900 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded inline-flex items-center">
                                  <Layers className="w-2.5 h-2.5 mr-0.5" />
                                  {event.subEvents.length} {event.subEvents.length === 1 ? 'Sub-Event' : 'Sub-Events'}
                                </span>
                              )}
                            </div>

                            <Link
                              to={`/news-events/${event.id}`}
                              className="font-serif font-bold text-xs sm:text-sm text-[#0B1F4E] group-hover:text-[#a88530] transition-colors leading-snug line-clamp-2 block"
                            >
                              {event.title}
                            </Link>

                            {/* Venue & Time */}
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500 font-sans pt-0.5">
                              {(event.location || event.venue) && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-3 h-3 text-[#C9A84C] shrink-0" />
                                  <span className="truncate max-w-[150px]">{event.location || event.venue}</span>
                                </div>
                              )}
                              {(event.time_range || event.time) && (
                                <div className="flex items-center space-x-1 font-mono">
                                  <Clock className="w-3 h-3 text-[#C9A84C] shrink-0" />
                                  <span>{event.time_range || event.time}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Right Arrow / Toggle Sub-Events Button */}
                          {hasSubEvents ? (
                            <button
                              type="button"
                              onClick={(e) => toggleEventSubEvents(event.id, e)}
                              title={isExpanded ? "Collapse sub-events" : "Expand sub-events"}
                              aria-expanded={isExpanded}
                              className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 transition-all self-center cursor-pointer ${
                                isExpanded
                                  ? 'bg-[#0B1F4E] text-[#F0D98C] shadow-xs'
                                  : 'bg-slate-100 group-hover:bg-[#0B1F4E] text-slate-400 group-hover:text-[#F0D98C]'
                              }`}
                            >
                              <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                            </button>
                          ) : (
                            <Link
                              to={`/news-events/${event.id}`}
                              className="w-7 h-7 rounded-md bg-slate-100 group-hover:bg-[#0B1F4E] text-slate-400 group-hover:text-[#F0D98C] flex items-center justify-center shrink-0 transition-colors self-center"
                            >
                              <ChevronRight className="w-4 h-4" />
                            </Link>
                          )}
                        </div>

                        {/* Nested Sub-Events List (Expandable Row) */}
                        {hasSubEvents && isExpanded && (
                          <div className="bg-slate-50/90 px-4 sm:px-6 py-3 border-l-4 border-l-[#C9A84C] space-y-2 animate-fadeIn">
                            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 pb-1 border-b border-slate-200/60 flex items-center justify-between">
                              <span>Program Schedule / Sub-Events:</span>
                              <span className="text-[#a88530] font-semibold">{event.subEvents.length} Sessions</span>
                            </div>
                            <div className="space-y-2 pt-1">
                              {event.subEvents.map((sub) => (
                                <div
                                  key={sub.id}
                                  className="bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-2xs space-y-1"
                                >
                                  <div className="flex items-center justify-between gap-2">
                                    <h5 className="font-serif font-bold text-xs text-[#0B1F4E] leading-snug">
                                      {sub.title}
                                    </h5>
                                    <span className="text-[10px] font-mono font-bold text-[#a88530] shrink-0 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                                      {sub.event_date}
                                    </span>
                                  </div>
                                  {sub.description && (
                                    <p className="text-[11px] text-slate-600 font-sans leading-relaxed">
                                      {sub.description}
                                    </p>
                                  )}
                                  <div className="flex flex-wrap items-center gap-3 text-[10.5px] text-slate-500 font-sans pt-0.5">
                                    {(sub.time_range || sub.time) && (
                                      <div className="flex items-center space-x-1 font-mono">
                                        <Clock className="w-3 h-3 text-[#C9A84C]" />
                                        <span>{sub.time_range || sub.time}</span>
                                      </div>
                                    )}
                                    {(sub.location || sub.venue) && (
                                      <div className="flex items-center space-x-1">
                                        <MapPin className="w-3 h-3 text-[#C9A84C]" />
                                        <span>{sub.location || sub.venue}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center p-8 text-center space-y-2.5">
                    <Calendar className="w-7 h-7 text-[#C9A84C] mx-auto" />
                    <p className="text-xs text-slate-600 font-sans">
                      No upcoming events scheduled. Please check back soon.
                    </p>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* ================= RIGHT COLUMN: IMPORTANT UPDATES / LATEST NOTICES ================= */}
          <div className="flex flex-col space-y-4">
            
            {/* Column Section Heading */}
            <div className="space-y-1">
              <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a88530] block">
                IMPORTANT UPDATES
              </span>
              <h3 className="font-serif font-bold text-2xl text-[#0B1F4E]">
                Latest Notices
              </h3>
              <div className="w-12 h-0.5 bg-[#C9A84C]" />
            </div>

            {/* Structured Card Frame (Notice Board with 3 Tabs Matching stphilos.ac.in) */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white border-r-4 border-r-[#C9A84C] flex flex-col flex-1">
              
              {/* Header Bar with Live 3-Tabs */}
              <div className="bg-[#0B1F4E] text-white px-3 sm:px-5 py-2.5 flex flex-wrap items-center justify-between gap-2 shrink-0 border-b border-white/10">
                <div className="flex items-center space-x-2 font-serif font-bold text-xs sm:text-sm tracking-wide">
                  <span className="w-1.5 h-4.5 bg-[#C9A84C] rounded-full inline-block"></span>
                  <span>NOTICE BOARD</span>
                </div>

                {/* 3 Nav Tabs: NOTICES | EXAMINATION | EVENTS */}
                <div className="flex items-center space-x-1">
                  {[
                    { id: 'notices', label: 'NOTICES' },
                    { id: 'examination', label: 'EXAMINATION' },
                    { id: 'events', label: 'EVENTS' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveNoticeTab(tab.id)}
                      className={`px-2 sm:px-3 py-1 text-[10.5px] sm:text-[11px] font-bold tracking-wider rounded transition-all cursor-pointer ${
                        activeNoticeTab === tab.id
                          ? 'bg-[#0B1F4E] text-[#F0D98C] border-b-2 border-[#C9A84C] shadow-xs'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    title={isPaused ? "Resume Auto-Scroll" : "Pause Auto-Scroll"}
                    className="text-slate-300 hover:text-[#F0D98C] transition-colors p-1 cursor-pointer flex items-center space-x-1 text-[11px]"
                  >
                    {isPaused ? (
                      <Play className="w-3 h-3 text-[#F0D98C]" />
                    ) : (
                      <Pause className="w-3 h-3" />
                    )}
                  </button>
                </div>
              </div>

              {/* Auto-Scrolling Notice Items Container (Fixed height h-[350px]) */}
              <div
                ref={scrollContainerRef}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
                className="h-[350px] overflow-y-auto divide-y divide-slate-100 p-0 scroll-smooth custom-scrollbar"
              >
                {filteredNotices.length > 0 ? (
                  filteredNotices.map((notice, nIdx) => {
                    const isPinned = !!notice.isPinned;
                    const isImportant = isPinned || notice.tags?.includes('IMPORTANT') || notice.category === 'Examinations' || notice.category === 'Admissions' || notice.refNo?.includes('Appreciation');
                    const isEventLinked = !!notice.linked_event_id;
                    let dayStr = '01';
                    let monStr = 'SEP';
                    const noticeDate = notice.date || notice.publishDate;
                    if (noticeDate) {
                      const parts = String(noticeDate).split('T')[0].split('-');
                      if (parts.length === 3) {
                        const d = new Date(parseInt(parts[0], 10), parseInt(parts[1], 10) - 1, parseInt(parts[2], 10));
                        dayStr = String(d.getDate()).padStart(2, '0');
                        monStr = d.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                      }
                    }
                    const isRecent = isPinned || nIdx < 6 || (noticeDate && noticeDate >= '2026-08-01');

                    return (
                      <Link
                        key={notice.id}
                        to={notice.link || `/news-events/${notice.linked_event_id || notice.id}`}
                        className="p-3.5 sm:p-4 flex items-start space-x-3 hover:bg-slate-50/80 transition-colors group"
                      >
                        {/* Left Date Square Badge */}
                        <div className="shrink-0 w-11 h-12 rounded-lg bg-[#0B1F4E] border border-[#C9A84C]/40 text-center flex flex-col items-center justify-center text-white shadow-2xs group-hover:border-[#C9A84C]">
                          <span className="text-sm font-serif font-extrabold text-white leading-none">
                            {dayStr}
                          </span>
                          <span className="text-[9px] font-bold text-[#F0D98C] font-mono tracking-wider leading-tight mt-0.5">
                            {monStr}
                          </span>
                        </div>

                        {/* Middle Content */}
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                            {isPinned && (
                              <span className="bg-amber-500 text-slate-950 text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                                PINNED
                              </span>
                            )}
                            {isRecent && !isPinned && (
                              <span className="bg-[#C9A84C] text-[#0B1F4E] text-[9px] font-mono font-extrabold px-1.5 py-0.2 rounded uppercase tracking-wider">
                                NEW
                              </span>
                            )}
                            {isImportant && !isPinned && (
                              <span className="bg-red-100 text-red-700 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                                IMPORTANT
                              </span>
                            )}
                            <span className="bg-slate-100 text-slate-700 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded uppercase">
                              {notice.category || notice.type || 'NOTICE'}
                            </span>
                            {isEventLinked && (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8.5px] font-mono font-semibold px-1 py-0.2 rounded uppercase">
                                EVENT
                              </span>
                            )}
                          </div>

                          <h4 className="font-sans font-bold text-xs sm:text-[13px] text-slate-900 group-hover:text-[#0B1F4E] transition-colors leading-snug line-clamp-2">
                            {notice.title}
                          </h4>
                        </div>

                        <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#0B1F4E] group-hover:translate-x-0.5 transition-transform self-center shrink-0" />
                      </Link>
                    );
                  })
                ) : (
                  <div className="h-full flex items-center justify-center p-8 text-center text-slate-500 text-xs">
                    <p>No notices matching the selected filter criteria.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}