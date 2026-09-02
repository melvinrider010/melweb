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
  Layers
} from 'lucide-react';
import { getUpcomingEvents, getSyncedNotices } from '../../lib/eventsNoticesService';

export default function NoticesHubSection() {
  const [levelFilter, setLevelFilter] = useState('all'); // 'all', 'ug', 'pg'
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [expandedEventIds, setExpandedEventIds] = useState({});
  const [storeTick, setStoreTick] = useState(0);
  const scrollContainerRef = useRef(null);

  // Reactive listener to CMS updates (new events, sub-events, notices)
  useEffect(() => {
    const handleStoreUpdate = () => setStoreTick((prev) => prev + 1);
    window.addEventListener('cms_store_updated', handleStoreUpdate);
    return () => window.removeEventListener('cms_store_updated', handleStoreUpdate);
  }, []);

  // Filter items for Upcoming Events (Left Column) with query-time date comparison
  const filteredEvents = useMemo(() => {
    return getUpcomingEvents({
      level: levelFilter,
      category: categoryFilter,
      search: searchQuery
    });
  }, [levelFilter, categoryFilter, searchQuery, storeTick]);

  // Filter items for Notice Board (Right Column)
  const filteredNotices = useMemo(() => {
    return getSyncedNotices({
      level: levelFilter,
      category: categoryFilter,
      search: searchQuery
    });
  }, [levelFilter, categoryFilter, searchQuery, storeTick]);

  // Extract unique categories across all events and notices for dropdown
  const categories = useMemo(() => {
    const allEvents = getUpcomingEvents({}, '1970-01-01');
    const allNotices = getSyncedNotices();
    const cats = new Set([
      ...allEvents.map((item) => item.category),
      ...allNotices.map((item) => item.category)
    ].filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [storeTick]);

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
        
        {/* TOP CONTROLS BAR: LEVEL SWITCHER + LIVE SEARCH + CATEGORY FILTER */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
          
          {/* LEVEL SWITCHER PILLS (UG / PG / ALL) */}
          <div className="flex items-center space-x-1 p-1 bg-slate-100/90 rounded-lg border border-slate-200/80 shrink-0">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 px-2 hidden sm:inline">
              Level:
            </span>
            {[
              { id: 'all', label: 'All Programmes' },
              { id: 'ug', label: 'UG' },
              { id: 'pg', label: 'PG' }
            ].map((lvl) => {
              const isActive = levelFilter === lvl.id;
              return (
                <button
                  key={lvl.id}
                  onClick={() => setLevelFilter(lvl.id)}
                  className={`px-3 py-1 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#0B1F4E] text-[#F0D98C] shadow-xs'
                      : 'text-slate-600 hover:text-[#0B1F4E] hover:bg-white/60'
                  }`}
                >
                  {lvl.label}
                </button>
              );
            })}
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
                    const dateObj = new Date(eventDateStr);
                    const monthStr = dateObj.toLocaleString('en-US', { month: 'short' }).toUpperCase();
                    const dayStr = dateObj.getDate();
                    const hasSubEvents = Array.isArray(event.subEvents) && event.subEvents.length > 0;
                    const isExpanded = !!expandedEventIds[event.id];

                    return (
                      <div key={event.id} className="divide-y divide-slate-50">
                        <div className="p-4 sm:p-4.5 flex items-start space-x-3.5 hover:bg-slate-50/80 transition-colors group">
                          {/* Left Date Square Badge */}
                          <div className="shrink-0 w-12 h-13 rounded-lg bg-[#060f26] border border-[#C9A84C]/40 text-center flex flex-col items-center justify-center text-white shadow-2xs group-hover:border-[#C9A84C]">
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

            {/* Structured Card Frame (Notice Board with Auto-Scroll) */}
            <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-xs bg-white border-r-4 border-r-[#C9A84C] flex flex-col flex-1">
              
              {/* Header Bar */}
              <div className="bg-[#0B1F4E] text-white px-5 py-3 flex items-center justify-between shrink-0">
                <div className="flex items-center space-x-2 font-serif font-bold text-xs sm:text-sm tracking-wide">
                  <Bell className="w-4 h-4 text-[#F0D98C] animate-pulse" />
                  <span>Notice Board</span>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsPaused(!isPaused)}
                    title={isPaused ? "Resume Auto-Scroll" : "Pause Auto-Scroll"}
                    className="text-slate-300 hover:text-[#F0D98C] transition-colors p-1 cursor-pointer flex items-center space-x-1 text-[11px]"
                  >
                    {isPaused ? (
                      <>
                        <Play className="w-3 h-3 text-[#F0D98C]" />
                        <span className="hidden sm:inline text-[10px]">Play</span>
                      </>
                    ) : (
                      <>
                        <Pause className="w-3 h-3" />
                        <span className="hidden sm:inline text-[10px]">Pause</span>
                      </>
                    )}
                  </button>

                  <Link
                    to="/news-events"
                    className="text-xs font-sans font-bold text-slate-200 hover:text-[#F0D98C] inline-flex items-center space-x-1 transition-colors"
                  >
                    <span>View All</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
                  </Link>
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
                  filteredNotices.map((notice) => {
                    const isImportant = notice.tags?.includes('IMPORTANT') || notice.category === 'Examinations' || notice.category === 'Admissions' || notice.refNo?.includes('Appreciation');
                    const isEventLinked = !!notice.linked_event_id;

                    return (
                      <Link
                        key={notice.id}
                        to={notice.link || `/news-events/${notice.linked_event_id || notice.id}`}
                        className="p-4 sm:p-4.5 block hover:bg-slate-50/80 transition-colors group space-y-1.5"
                      >
                        {/* Date */}
                        <div className="flex items-center space-x-1.5 text-[10.5px] font-mono text-slate-500">
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>{notice.displayDate || notice.date}</span>
                        </div>

                        {/* Title */}
                        <h4 className="font-sans font-bold text-xs sm:text-[13.5px] text-slate-900 group-hover:text-[#0B1F4E] transition-colors leading-snug">
                          {notice.title}
                        </h4>

                        {/* Badges Strip */}
                        <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                          {isImportant && (
                            <span className="bg-red-100 text-red-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              IMPORTANT
                            </span>
                          )}

                          <span className="bg-amber-100 text-amber-800 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                            {notice.type === 'Notice' ? 'CIRCULAR' : (notice.type || 'CIRCULAR').toUpperCase()}
                          </span>

                          {notice.category && (
                            <span className="bg-blue-50 text-blue-800 text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider">
                              {notice.category}
                            </span>
                          )}

                          {notice.level && notice.level !== 'all' && (
                            <span className="bg-slate-100 text-slate-700 text-[9px] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                              {notice.level}
                            </span>
                          )}

                          {isEventLinked && (
                            <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8.5px] font-mono font-semibold px-1.5 py-0.5 rounded-full uppercase">
                              EVENT SYNC
                            </span>
                          )}
                        </div>
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