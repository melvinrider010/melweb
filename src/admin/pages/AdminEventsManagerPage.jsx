import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Plus, 
  Search, 
  Trash2, 
  Layers, 
  Clock, 
  MapPin, 
  CheckCircle2, 
  ArrowUpRight, 
  Sparkles,
  ChevronDown,
  ChevronRight,
  FileText,
  X,
  AlertCircle,
  Archive
} from 'lucide-react';
import { cmsStore } from '../../lib/cmsStore';
import { 
  createEvent, 
  addSubEvent, 
  deleteEvent, 
  deleteSubEvent, 
  getUpcomingEvents, 
  getPastEvents,
  isEventUpcoming 
} from '../../lib/eventsNoticesService';

export default function AdminEventsManagerPage() {
  const [storeTick, setStoreTick] = useState(0);
  const [tab, setTab] = useState('upcoming'); // 'upcoming', 'archived', 'all'
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubEventModalOpen, setIsSubEventModalOpen] = useState(false);
  const [selectedParentEvent, setSelectedParentEvent] = useState(null);
  const [expandedRows, setExpandedRows] = useState({});
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Form States for New Event
  const [eventForm, setEventForm] = useState({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    end_date: '',
    time_range: '09:30 AM – 04:30 PM',
    location: 'College Auditorium & AV Hall',
    category: 'Conferences & Seminars',
    level: 'all'
  });

  // Form States for New Sub-Event
  const [subEventForm, setSubEventForm] = useState({
    title: '',
    description: '',
    event_date: new Date().toISOString().split('T')[0],
    time_range: '10:00 AM – 01:00 PM',
    location: 'College Main Auditorium'
  });

  useEffect(() => {
    const handleUpdate = () => setStoreTick((prev) => prev + 1);
    window.addEventListener('cms_store_updated', handleUpdate);
    return () => window.removeEventListener('cms_store_updated', handleUpdate);
  }, []);

  const allEvents = useMemo(() => cmsStore.getEvents(), [storeTick]);
  const upcomingEvents = useMemo(() => getUpcomingEvents({ search, level: levelFilter }), [search, levelFilter, storeTick]);
  const pastEvents = useMemo(() => getPastEvents({ search, level: levelFilter }), [search, levelFilter, storeTick]);

  const displayedEvents = useMemo(() => {
    if (tab === 'upcoming') return upcomingEvents;
    if (tab === 'archived') return pastEvents;
    return allEvents.filter((e) => {
      const q = search.toLowerCase();
      const matchSearch = !q || (e.title || '').toLowerCase().includes(q) || (e.category || '').toLowerCase().includes(q);
      const matchLevel = levelFilter === 'all' || e.level === levelFilter;
      return matchSearch && matchLevel;
    });
  }, [tab, upcomingEvents, pastEvents, allEvents, search, levelFilter]);

  const handleCreateEventSubmit = (e) => {
    e.preventDefault();
    if (!eventForm.title.trim() || !eventForm.event_date) {
      alert('Please fill in required fields (Title and Event Date)');
      return;
    }

    const created = createEvent(eventForm);
    setFeedbackMsg(`✓ Event "${created.title}" published! Linked Notice Board entry was auto-generated.`);
    setIsCreateModalOpen(false);
    setEventForm({
      title: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      end_date: '',
      time_range: '09:30 AM – 04:30 PM',
      location: 'College Auditorium & AV Hall',
      category: 'Conferences & Seminars',
      level: 'all'
    });
    setTimeout(() => setFeedbackMsg(''), 6000);
  };

  const handleAddSubEventSubmit = (e) => {
    e.preventDefault();
    if (!selectedParentEvent || !subEventForm.title.trim()) {
      alert('Please provide a Sub-Event Title');
      return;
    }

    const result = addSubEvent(selectedParentEvent.id, subEventForm);
    setFeedbackMsg(
      `✓ Sub-Event added to "${result.parent.title}"! Notice Board synchronized automatically.`
    );
    setIsSubEventModalOpen(false);
    setSelectedParentEvent(null);
    setSubEventForm({
      title: '',
      description: '',
      event_date: new Date().toISOString().split('T')[0],
      time_range: '10:00 AM – 01:00 PM',
      location: 'College Main Auditorium'
    });
    setTimeout(() => setFeedbackMsg(''), 6000);
  };

  const handleDeleteEvent = (eventId, eventTitle) => {
    if (window.confirm(`Are you sure you want to delete "${eventTitle}"? This will also remove the auto-synced notice board entry.`)) {
      deleteEvent(eventId);
      setFeedbackMsg(`Deleted event "${eventTitle}" and cleaned up linked notice.`);
      setTimeout(() => setFeedbackMsg(''), 5000);
    }
  };

  const handleDeleteSubEvent = (parentEventId, subId, subTitle) => {
    if (window.confirm(`Delete sub-event "${subTitle}"?`)) {
      deleteSubEvent(parentEventId, subId);
      setFeedbackMsg(`Removed sub-event "${subTitle}".`);
      setTimeout(() => setFeedbackMsg(''), 5000);
    }
  };

  const toggleRow = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-[#0B1F4E] text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b-4 border-[#FFD84A]">
        <div>
          <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest block mb-1">
            Metronic CMS · Events & Synchronization Engine
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">
            Campus Events & Sub-Events Manager
          </h1>
          <p className="text-xs text-slate-200 mt-1">
            Query-time date evaluation with automatic real-time Notice Board synchronization.
          </p>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn-gold text-xs px-5 py-2.5 rounded-xl shadow-lg font-bold flex items-center space-x-1.5 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Event</span>
        </button>
      </div>

      {/* Live Feedback Alert */}
      {feedbackMsg && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 px-4 py-3 rounded-xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Controls & Filter Bar */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Status Tabs */}
          <div className="flex items-center space-x-1.5 p-1 bg-slate-100 rounded-xl shrink-0">
            {[
              { id: 'upcoming', label: `Upcoming Events (${upcomingEvents.length})` },
              { id: 'archived', label: `Old Events Archive (${pastEvents.length})` },
              { id: 'all', label: `All Events (${allEvents.length})` }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  tab === t.id
                    ? 'bg-[#0B1F4E] text-[#F0D98C] shadow-xs'
                    : 'text-slate-600 hover:text-[#0B1F4E]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Search & Level Filters */}
          <div className="flex items-center space-x-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-[#1C5496]"
              />
            </div>

            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="all">All Levels</option>
              <option value="ug">UG Only</option>
              <option value="pg">PG Only</option>
            </select>
          </div>
        </div>
      </div>

      {/* Events Table / Card List */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <th className="p-4 w-12"></th>
              <th className="p-4">Event Details</th>
              <th className="p-4">Category & Level</th>
              <th className="p-4">Event Date(s)</th>
              <th className="p-4">Sub-Events</th>
              <th className="p-4">Notice Sync</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {displayedEvents.length > 0 ? (
              displayedEvents.map((evt) => {
                const isUpcoming = isEventUpcoming(evt);
                const hasSub = Array.isArray(evt.subEvents) && evt.subEvents.length > 0;
                const isExpanded = !!expandedRows[evt.id];

                return (
                  <React.Fragment key={evt.id}>
                    <tr className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-4">
                        {hasSub && (
                          <button
                            onClick={() => toggleRow(evt.id)}
                            className="p-1 rounded hover:bg-slate-200 text-slate-500 cursor-pointer"
                            title={isExpanded ? "Collapse sub-events" : "Expand sub-events"}
                          >
                            <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                          </button>
                        )}
                      </td>
                      <td className="p-4 max-w-sm">
                        <div className="font-bold text-slate-900">{evt.title}</div>
                        <div className="text-[11px] text-slate-500 truncate">{evt.description || evt.summary}</div>
                        <div className="flex items-center space-x-3 text-[10.5px] text-slate-400 font-mono mt-1">
                          <span>{evt.refNo || evt.id}</span>
                          {(evt.location || evt.venue) && <span>· {evt.location || evt.venue}</span>}
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded uppercase block w-max">
                            {evt.category}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 uppercase">
                            Level: {evt.level || 'all'}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 font-mono font-semibold text-slate-700">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
                          <span>{evt.event_date}</span>
                        </div>
                        {evt.end_date && (
                          <div className="text-[10px] text-slate-400">to {evt.end_date}</div>
                        )}
                        <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded mt-1 inline-block ${
                          isUpcoming ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {isUpcoming ? 'UPCOMING' : 'ARCHIVED'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-slate-700">
                            {evt.subEvents?.length || 0}
                          </span>
                          <button
                            onClick={() => {
                              setSelectedParentEvent(evt);
                              setSubEventForm((prev) => ({ ...prev, event_date: evt.event_date }));
                              setIsSubEventModalOpen(true);
                            }}
                            className="px-2 py-1 bg-amber-50 hover:bg-amber-100 text-[#a88530] border border-amber-200 rounded text-[11px] font-bold flex items-center space-x-1 cursor-pointer"
                            title="Add sub-event"
                          >
                            <Plus className="w-3 h-3" />
                            <span>Add</span>
                          </button>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="bg-blue-50 text-blue-800 border border-blue-200 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase flex items-center w-max">
                          <CheckCircle2 className="w-3 h-3 mr-1 text-blue-600" />
                          <span>AUTO-SYNCED</span>
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDeleteEvent(evt.id, evt.title)}
                          className="p-1.5 hover:bg-red-50 text-slate-400 hover:text-red-600 rounded-lg transition-colors cursor-pointer"
                          title="Delete Event"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>

                    {/* Expandable Sub-Events Drawer in Table */}
                    {hasSub ? (
                      isExpanded && (
                        <tr className="bg-slate-50/70 border-b border-slate-200">
                          <td colSpan={7} className="p-4 pl-12">
                            <div className="space-y-2">
                              <span className="text-[10.5px] font-mono font-bold text-slate-500 uppercase">
                                Nested Sub-Events ({evt.subEvents.length}):
                              </span>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {evt.subEvents.map((sub) => (
                                  <div
                                    key={sub.id}
                                    className="bg-white p-3 rounded-lg border border-slate-200 shadow-2xs flex items-start justify-between gap-2"
                                  >
                                    <div>
                                      <h6 className="font-serif font-bold text-xs text-[#0B1F4E]">{sub.title}</h6>
                                      {sub.description && <p className="text-[11px] text-slate-600">{sub.description}</p>}
                                      <div className="flex items-center space-x-3 text-[10.5px] text-slate-500 font-mono mt-1">
                                        <span>📅 {sub.event_date}</span>
                                        <span>⏰ {sub.time_range || sub.time}</span>
                                        <span>📍 {sub.location || sub.venue}</span>
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleDeleteSubEvent(evt.id, sub.id, sub.title)}
                                      className="p-1 text-slate-400 hover:text-red-600 rounded cursor-pointer"
                                      title="Delete sub-event"
                                    >
                                      <X className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )
                    ) : null}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-slate-400 font-medium">
                  No events found in this view.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL 1: CREATE NEW EVENT */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Create New Campus Event</h3>
                <p className="text-[11px] text-slate-500">Will automatically create Notice Board circular entry.</p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEventSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Event Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. National Symposium on Cyber Security"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={eventForm.event_date}
                    onChange={(e) => setEventForm({ ...eventForm, event_date: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">End Date (Optional)</label>
                  <input
                    type="date"
                    value={eventForm.end_date}
                    onChange={(e) => setEventForm({ ...eventForm, end_date: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="Conferences & Seminars">Conferences & Seminars</option>
                    <option value="Cultural & Sports">Cultural & Sports</option>
                    <option value="Placements">Placements</option>
                    <option value="Academics">Academics</option>
                    <option value="Workshops">Workshops</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Programme Level</label>
                  <select
                    value={eventForm.level}
                    onChange={(e) => setEventForm({ ...eventForm, level: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                  >
                    <option value="all">All Programmes</option>
                    <option value="ug">UG Only</option>
                    <option value="pg">PG Only</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Range</label>
                  <input
                    type="text"
                    placeholder="09:30 AM – 04:30 PM"
                    value={eventForm.time_range}
                    onChange={(e) => setEventForm({ ...eventForm, time_range: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Venue / Location</label>
                  <input
                    type="text"
                    placeholder="College Auditorium & AV Hall"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({ ...eventForm, location: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Description / Summary</label>
                <textarea
                  rows={3}
                  placeholder="Provide details about keynote speakers, tracks, registration..."
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-5 py-2 rounded-lg font-bold shadow-md cursor-pointer"
                >
                  Publish & Sync Notice
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: ADD SUB-EVENT */}
      {isSubEventModalOpen && selectedParentEvent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-scaleUp">
            <div className="flex justify-between items-center border-b pb-3">
              <div>
                <h3 className="font-serif font-bold text-lg text-slate-900">Add Sub-Event / Track</h3>
                <p className="text-[11px] text-slate-500">
                  Parent: <span className="font-bold text-[#1C5496]">{selectedParentEvent.title}</span>
                </p>
              </div>
              <button
                onClick={() => setIsSubEventModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubEventSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Sub-Event / Session Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Keynote Address & Valedictory Session"
                  value={subEventForm.title}
                  onChange={(e) => setSubEventForm({ ...subEventForm, title: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 block mb-1">Date *</label>
                  <input
                    type="date"
                    required
                    value={subEventForm.event_date}
                    onChange={(e) => setSubEventForm({ ...subEventForm, event_date: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-400 mt-0.5 block">
                    (If date is in future, parent event re-emerges in Upcoming Events!)
                  </span>
                </div>

                <div>
                  <label className="font-bold text-slate-700 block mb-1">Time Range</label>
                  <input
                    type="text"
                    placeholder="10:00 AM – 01:00 PM"
                    value={subEventForm.time_range}
                    onChange={(e) => setSubEventForm({ ...subEventForm, time_range: e.target.value })}
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Location / Venue</label>
                <input
                  type="text"
                  placeholder="College Main Auditorium"
                  value={subEventForm.location}
                  onChange={(e) => setSubEventForm({ ...subEventForm, location: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Session Description</label>
                <textarea
                  rows={2}
                  placeholder="Session abstract, guest speakers, reporting details..."
                  value={subEventForm.description}
                  onChange={(e) => setSubEventForm({ ...subEventForm, description: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsSubEventModalOpen(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-600 font-bold hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-5 py-2 rounded-lg font-bold shadow-md cursor-pointer"
                >
                  Add Sub-Event & Auto-Sync
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
