import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  FileText, 
  Search, 
  Megaphone, 
  Download, 
  ArrowRight, 
  ChevronRight, 
  X,
  Layers,
  ChevronDown,
  Archive,
  CheckCircle2
} from 'lucide-react';
import { getUpcomingEvents, getPastEvents, getSyncedNotices } from '../lib/eventsNoticesService';
import { animatePageIn } from '../animations/pageTransitions';

export default function NewsEventsPage() {
  const containerRef = useRef(null);
  const [levelFilter, setLevelFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'Upcoming Events', 'Notice', 'Announcement', 'Past Events'
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [storeTick, setStoreTick] = useState(0);

  useEffect(() => {
    animatePageIn(containerRef);
    const handleUpdate = () => setStoreTick((prev) => prev + 1);
    window.addEventListener('cms_store_updated', handleUpdate);
    return () => window.removeEventListener('cms_store_updated', handleUpdate);
  }, []);

  const upcomingEvents = useMemo(() => {
    return getUpcomingEvents({
      level: levelFilter,
      category: categoryFilter,
      search: searchQuery
    });
  }, [levelFilter, categoryFilter, searchQuery, storeTick]);

  const pastEvents = useMemo(() => {
    return getPastEvents({
      level: levelFilter,
      category: categoryFilter,
      search: searchQuery
    });
  }, [levelFilter, categoryFilter, searchQuery, storeTick]);

  const allNotices = useMemo(() => {
    return getSyncedNotices({
      level: levelFilter,
      category: categoryFilter,
      search: searchQuery
    });
  }, [levelFilter, categoryFilter, searchQuery, storeTick]);

  const categories = useMemo(() => {
    const cats = new Set([
      ...upcomingEvents.map((i) => i.category),
      ...pastEvents.map((i) => i.category),
      ...allNotices.map((i) => i.category)
    ].filter(Boolean));
    return ['all', ...Array.from(cats)];
  }, [upcomingEvents, pastEvents, allNotices]);

  // Combined items based on selected tab
  const filteredItems = useMemo(() => {
    if (typeFilter === 'Upcoming Events') {
      return upcomingEvents.map((e) => ({ ...e, type: 'Event', isUpcoming: true }));
    }
    if (typeFilter === 'Past Events') {
      return pastEvents.map((e) => ({ ...e, type: 'Event', isPast: true }));
    }
    if (typeFilter === 'Notice') {
      return allNotices.filter((n) => n.type === 'Notice' || n.type === 'Circular');
    }
    if (typeFilter === 'Announcement') {
      return allNotices.filter((n) => n.type === 'Announcement');
    }

    // 'all' tab: Combine active upcoming events + all notices (with deduplication on linked_event_id)
    const combined = [
      ...upcomingEvents.map((e) => ({ ...e, type: 'Event', isUpcoming: true })),
      ...allNotices.filter((n) => !n.linked_event_id) // include standalone notices
    ];

    // Sort descending by date
    return combined.sort((a, b) => {
      const dateA = a.event_date || a.date || '';
      const dateB = b.event_date || b.date || '';
      return dateB.localeCompare(dateA);
    });
  }, [typeFilter, upcomingEvents, pastEvents, allNotices]);

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-10 text-[#0B1F4E]">
      
      {/* HERO BANNER */}
      <div className="bg-[#164E8C] text-white rounded-3xl p-8 sm:p-14 border-b-4 border-[#C9A84C] shadow-2xl relative overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 filter blur-[1px]"
          style={{ backgroundImage: `url('/media/gallery/campus/campus_quadrangle_main.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#164E8C] via-[#164E8C]/90 to-transparent" />

        <div className="relative z-10 space-y-4 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-mono font-bold text-[#F0D98C] uppercase tracking-wider">
            <span>OFFICIAL INSTITUTIONAL REPOSITORY</span>
          </div>

          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-white tracking-tight leading-tight">
            News, Circulars & Campus Events
          </h1>

          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-sans">
            Access verified examination circulars, academic notifications, university seminars, placement schedules, and institutional announcements published by St. Philomena's College (Autonomous), Mysuru.
          </p>
        </div>
      </div>

      {/* FILTER CONTROLS */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* LEVEL SWITCHER (UG / PG / ALL) */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl shrink-0">
            {[
              { id: 'all', label: 'All Programmes' },
              { id: 'ug', label: 'Undergraduate (UG)' },
              { id: 'pg', label: 'Postgraduate (PG)' }
            ].map((lvl) => (
              <button
                key={lvl.id}
                onClick={() => setLevelFilter(lvl.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  levelFilter === lvl.id
                    ? 'bg-[#0B1F4E] text-[#F0D98C] shadow-xs'
                    : 'text-slate-600 hover:text-[#0B1F4E]'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          {/* SEARCH & CATEGORY */}
          <div className="flex items-center space-x-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search circulars, events..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#C9A84C]"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <div className="relative shrink-0">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-2 text-xs font-semibold text-slate-700 cursor-pointer"
              >
                <option value="all">All Categories</option>
                {categories.filter((c) => c !== 'all').map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* TYPE TABS */}
        <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pt-2 border-t border-slate-100">
          {[
            { id: 'all', label: 'All Updates' },
            { id: 'Upcoming Events', label: `Upcoming Events (${upcomingEvents.length})` },
            { id: 'Notice', label: 'Notices & Circulars' },
            { id: 'Announcement', label: 'Announcements' },
            { id: 'Past Events', label: `Old Events Archive (${pastEvents.length})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTypeFilter(tab.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                typeFilter === tab.id
                  ? 'bg-[#C9A84C] text-[#164E8C] border-[#C9A84C] shadow-xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* DOCUMENT CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => {
            const hasSub = Array.isArray(item.subEvents) && item.subEvents.length > 0;
            const itemDate = item.event_date || item.date;

            return (
              <div
                key={item.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:border-[#C9A84C] transition-all flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center space-x-1.5 flex-wrap gap-1">
                      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded uppercase ${
                        item.type === 'Notice' || item.type === 'Circular'
                          ? 'bg-blue-100 text-blue-800'
                          : item.type === 'Event'
                          ? item.isPast
                            ? 'bg-slate-100 text-slate-600'
                            : 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}>
                        {item.isPast ? 'PAST EVENT' : item.type}
                      </span>
                      {item.level && item.level !== 'all' && (
                        <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 uppercase">
                          {item.level}
                        </span>
                      )}
                      {hasSub && (
                        <span className="bg-amber-50 text-amber-900 border border-amber-200 text-[9px] font-mono font-bold px-1.5 py-0.2 rounded">
                          {item.subEvents.length} Sub-Events
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-slate-500 font-mono flex items-center shrink-0">
                      <Calendar className="w-3 h-3 mr-1 text-[#C9A84C]" />
                      {itemDate}
                    </span>
                  </div>

                  <span className="text-[10.5px] font-mono font-bold text-[#a88530] uppercase tracking-wider block">
                    {item.category}
                  </span>

                  <h2 className="font-serif font-bold text-base sm:text-lg text-[#0B1F4E] group-hover:text-[#a88530] transition-colors leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                    {item.summary || item.description}
                  </p>

                  {/* Sub-events preview if present */}
                  {hasSub && (
                    <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 text-[11px] space-y-1">
                      <span className="font-mono font-bold text-slate-600 uppercase text-[9.5px]">Program Tracks:</span>
                      <ul className="list-disc list-inside text-slate-700 space-y-0.5">
                        {item.subEvents.slice(0, 2).map((s) => (
                          <li key={s.id} className="truncate">
                            <span className="font-semibold">{s.title}</span> ({s.event_date})
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    {item.refNo || item.id}
                  </span>

                  <Link
                    to={`/news-events/${item.id}`}
                    className="btn-navy text-xs font-bold px-3 py-1.5 rounded-lg flex items-center shadow-xs group/btn"
                  >
                    <span>{item.type === 'Event' ? 'View Event' : 'View Circular'}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/btn:translate-x-1 transition-transform text-[#F0D98C]" />
                  </Link>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
            <Calendar className="w-10 h-10 text-[#C9A84C] mx-auto" />
            <p className="font-serif font-bold text-lg text-slate-800">No items found matching criteria</p>
            <p className="text-xs text-slate-500 font-sans">Try adjusting your level, category, or search filters.</p>
          </div>
        )}
      </div>

    </div>
  );
}
