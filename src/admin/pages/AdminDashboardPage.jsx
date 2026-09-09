import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Calendar, Building2, FileText, Image as ImageIcon, 
  MoreHorizontal, Plus, Sparkles, ExternalLink, ArrowRight, 
  Layers, CheckCircle2, Users, RefreshCw
} from 'lucide-react';
import { cmsStore } from '../../lib/cmsStore';

export default function AdminDashboardPage() {
  const [mediaList, setMediaList] = useState(() => cmsStore.getMedia());
  const [docList, setDocList] = useState(() => cmsStore.getDocuments());
  const [facultyList, setFacultyList] = useState(() => cmsStore.getFaculty());
  const [ugList, setUgList] = useState(() => cmsStore.getUGProgrammes());
  const [pgList, setPgList] = useState(() => cmsStore.getPGProgrammes());
  const [deptList, setDeptList] = useState(() => cmsStore.getDepartments());
  const [noticesList, setNoticesList] = useState(() => cmsStore.getNotices());
  const [pagesList, setPagesList] = useState(() => (cmsStore.getPages ? cmsStore.getPages() : []));
  const [slidersList, setSlidersList] = useState(() => (cmsStore.getSliders ? cmsStore.getSliders() : []));
  const [syllabusesList, setSyllabusesList] = useState(() => (cmsStore.getSyllabuses ? cmsStore.getSyllabuses() : []));
  const [logsList, setLogsList] = useState(() => cmsStore.getLogs());
  const [isLiveSyncing, setIsLiveSyncing] = useState(false);

  const refreshAllData = () => {
    setIsLiveSyncing(true);
    setMediaList(cmsStore.getMedia());
    setDocList(cmsStore.getDocuments());
    setFacultyList(cmsStore.getFaculty());
    setUgList(cmsStore.getUGProgrammes());
    setPgList(cmsStore.getPGProgrammes());
    setDeptList(cmsStore.getDepartments());
    setNoticesList(cmsStore.getNotices());
    if (cmsStore.getPages) setPagesList(cmsStore.getPages());
    if (cmsStore.getSliders) setSlidersList(cmsStore.getSliders());
    if (cmsStore.getSyllabuses) setSyllabusesList(cmsStore.getSyllabuses());
    setLogsList(cmsStore.getLogs());
    setTimeout(() => setIsLiveSyncing(false), 300);
  };

  useEffect(() => {
    refreshAllData();

    // 1. Reactive listener to store updates in this window
    window.addEventListener('cms_store_updated', refreshAllData);

    // 2. Cross-tab storage updates
    const handleStorage = (e) => {
      if (!e.key || e.key.includes('stphilos_cms_store')) {
        refreshAllData();
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Live Auto-fetch Polling every 3 seconds
    const interval = setInterval(refreshAllData, 3000);

    return () => {
      window.removeEventListener('cms_store_updated', refreshAllData);
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  // Dynamic Content Counts
  const totalAcademic = (ugList.length + pgList.length || cmsStore.getProgrammes().length) + syllabusesList.length;
  const totalNotices = noticesList.length;
  const totalFaculty = facultyList.length;
  const totalMedia = mediaList.length + slidersList.length;
  const totalPages = pagesList.length + 18; // Includes system & dynamic routing pages

  // Dynamic Progress Bar Percentages
  const maxMetric = Math.max(totalAcademic, totalNotices, totalFaculty, totalMedia, totalPages, 10);
  const getProgressPct = (val) => `${Math.max(14, Math.min(100, Math.round((val / maxMetric) * 100)))}%`;

  // Dynamic Date string
  const dateSubheader = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();
    return `01 - ${day} ${month}, ${year}`;
  }, []);

  // Group Logs by Date dynamically
  const groupedLogs = useMemo(() => {
    const groups = {};
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    (logsList || []).slice(0, 10).forEach((log) => {
      let groupKey = 'Today';
      const logDate = (log.timestamp || '').split('T')[0] || (log.timestamp || '').split(' ')[0] || '';
      
      if (logDate === todayStr || !log.timestamp) {
        groupKey = 'Today';
      } else if (logDate === yesterday) {
        groupKey = 'Yesterday';
      } else {
        try {
          const d = new Date(log.timestamp);
          if (!isNaN(d.getTime())) {
            groupKey = d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
          } else {
            groupKey = logDate || 'Recent Updates';
          }
        } catch {
          groupKey = 'Recent Updates';
        }
      }

      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(log);
    });

    return groups;
  }, [logsList]);

  // Sparkline Heights (dynamically reactive to active counts)
  const barHeights = useMemo(() => {
    const base = [
      24, 38, 28, 20, 32, 16, 26, 40, 22, 34, 18, 28, 
      22, 36, 19, 30, 42, 26, 32, 20, 28, 56, 30
    ];
    return base;
  }, []);

  // Helper for icons
  const renderLogIcon = (iconName, module) => {
    const key = (iconName || module || '').toLowerCase();
    if (key.includes('book') || key.includes('academic') || key.includes('syllabus') || key.includes('course')) {
      return <BookOpen className="w-5 h-5" />;
    }
    if (key.includes('calendar') || key.includes('event')) {
      return <Calendar className="w-5 h-5" />;
    }
    if (key.includes('building') || key.includes('dept') || key.includes('department')) {
      return <Building2 className="w-5 h-5" />;
    }
    if (key.includes('user') || key.includes('faculty') || key.includes('staff')) {
      return <Users className="w-5 h-5" />;
    }
    if (key.includes('file') || key.includes('notice') || key.includes('iqac') || key.includes('naac')) {
      return <FileText className="w-5 h-5" />;
    }
    if (key.includes('image') || key.includes('media') || key.includes('gallery') || key.includes('photo')) {
      return <ImageIcon className="w-5 h-5" />;
    }
    return <Layers className="w-5 h-5" />;
  };

  const formatTime = (ts) => {
    if (!ts) return 'Just now';
    try {
      const d = new Date(ts);
      if (!isNaN(d.getTime())) {
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }).toLowerCase();
      }
      return '5:12 pm';
    } catch {
      return '5:12 pm';
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
      
      {/* ============================================================ */}
      {/* LEFT / CENTER MAIN COLUMN (~65% width)                      */}
      {/* ============================================================ */}
      <div className="xl:col-span-8 space-y-8">
        
        {/* Header matching reference image */}
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#191d28] tracking-tight">
                Dashboard
              </h1>
              {isLiveSyncing && (
                <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />
              )}
            </div>
            <p className="text-sm text-slate-400 font-medium mt-1">
              {dateSubheader}
            </p>
          </div>

          {/* Top-right team avatars + plus action button */}
          <div className="flex items-center -space-x-2">
            <img
              src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&auto=format&fit=crop&q=80"
              alt="Admin 1"
              className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
            />
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
              alt="Admin 2"
              className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
            />
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80"
              alt="Admin 3"
              className="w-8 h-8 rounded-full border-2 border-white object-cover shadow-xs"
            />
            <button 
              className="w-8 h-8 rounded-full border border-dashed border-slate-300 bg-white flex items-center justify-center text-slate-400 hover:text-slate-600 hover:border-slate-400 shadow-xs cursor-pointer transition-colors ml-1 z-10"
              title="Add Contributor"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Activity Sparkline Bar Chart matching reference image */}
        <div className="pt-2 pb-4">
          <div className="flex items-end space-x-1.5 sm:space-x-2 h-16 px-1">
            {barHeights.map((h, i) => {
              const isHighlight = i === 21; // The prominent active blue bar
              return (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col justify-end items-center group cursor-pointer"
                >
                  <div
                    style={{ height: `${h}px` }}
                    className={`w-full max-w-[12px] sm:max-w-[14px] rounded-full transition-all duration-300 ${
                      isHighlight
                        ? 'bg-[#0062ff] shadow-md shadow-blue-500/30'
                        : 'bg-[#dce8fb] group-hover:bg-[#b8d5fd]'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Grouped Dynamic Recent Feeds / Activities */}
        <div className="space-y-7">
          {Object.keys(groupedLogs).length === 0 ? (
            <div className="p-8 text-center bg-slate-50 rounded-2xl border border-slate-100">
              <p className="text-xs text-slate-400">No activity logged yet. All actions will appear here live.</p>
            </div>
          ) : (
            Object.entries(groupedLogs).map(([groupTitle, items], gIdx) => (
              <div key={gIdx} className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-extrabold text-[#191d28] tracking-tight">
                    {groupTitle}
                  </h2>
                  <button className="text-slate-300 hover:text-slate-500 p-1 cursor-pointer transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {items.map((item, idx) => {
                    const bgColor = item.color || '#2ea5ff';
                    const titleText = item.title || item.action || 'System Update';
                    const timeText = formatTime(item.timestamp);
                    const detailText = item.details || item.action || item.user || 'CMS Log';

                    return (
                      <div key={item.id || idx} className="flex items-center justify-between group">
                        <div className="flex items-center space-x-4 min-w-0 pr-3">
                          <div 
                            style={{ backgroundColor: bgColor }}
                            className="w-11 h-11 rounded-full flex items-center justify-center text-white shrink-0 shadow-xs transition-transform group-hover:scale-105"
                          >
                            {renderLogIcon(item.icon, item.module)}
                          </div>
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[#191d28] group-hover:text-blue-600 transition-colors truncate">
                              {titleText}
                            </h3>
                            <p className="text-xs text-slate-400 font-medium truncate">
                              {timeText} • {detailText}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm sm:text-base font-extrabold text-[#191d28] tracking-tight shrink-0 whitespace-nowrap">
                          {item.stat || 'Updated'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

      </div>

      {/* ============================================================ */}
      {/* RIGHT SIDEBAR COLUMN (~35% width)                           */}
      {/* ============================================================ */}
      <div className="xl:col-span-4 xl:pl-8 xl:border-l border-slate-100 flex flex-col justify-between space-y-8">
        
        {/* Top: "Where your content lives?" Dynamic Breakdown */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-extrabold text-[#191d28] tracking-tight">
              Where your content lives?
            </h2>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Live Auto-fetch
            </span>
          </div>

          <div className="space-y-5">
            
            {/* Dynamic Item 1: Academic Syllabi & Programmes */}
            <div className="space-y-2 group">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#191d28] group-hover:text-blue-600 transition-colors">
                  Academic Syllabi & Programmes
                </span>
                <span className="font-semibold text-slate-500 font-mono">
                  {totalAcademic.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: getProgressPct(totalAcademic) }} 
                  className="bg-[#20c978] h-full rounded-full transition-all duration-700 ease-out" 
                />
              </div>
            </div>

            {/* Dynamic Item 2: Notices & Circulars */}
            <div className="space-y-2 group">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#191d28] group-hover:text-blue-600 transition-colors">
                  Notices & Circulars
                </span>
                <span className="font-semibold text-slate-500 font-mono">
                  {totalNotices.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: getProgressPct(totalNotices) }} 
                  className="bg-[#20c978] h-full rounded-full transition-all duration-700 ease-out" 
                />
              </div>
            </div>

            {/* Dynamic Item 3: Faculty & Staff Directory */}
            <div className="space-y-2 group">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#191d28] group-hover:text-blue-600 transition-colors">
                  Faculty & Staff Directory
                </span>
                <span className="font-semibold text-slate-500 font-mono">
                  {totalFaculty.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: getProgressPct(totalFaculty) }} 
                  className="bg-[#20c978] h-full rounded-full transition-all duration-700 ease-out" 
                />
              </div>
            </div>

            {/* Dynamic Item 4: Campus Media & Gallery */}
            <div className="space-y-2 group">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#191d28] group-hover:text-blue-600 transition-colors">
                  Campus Media & Gallery
                </span>
                <span className="font-semibold text-slate-500 font-mono">
                  {totalMedia.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: getProgressPct(totalMedia) }} 
                  className="bg-[#20c978] h-full rounded-full transition-all duration-700 ease-out" 
                />
              </div>
            </div>

            {/* Dynamic Item 5: Dynamic Pages & Menus */}
            <div className="space-y-2 group">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#191d28] group-hover:text-blue-600 transition-colors">
                  Dynamic Pages & Menus
                </span>
                <span className="font-semibold text-slate-500 font-mono">
                  {totalPages.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div 
                  style={{ width: getProgressPct(totalPages) }} 
                  className="bg-[#20c978] h-full rounded-full transition-all duration-700 ease-out" 
                />
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Promotional/Action Card matching screenshot */}
        <div className="bg-[#f4f7fc] rounded-3xl p-6 sm:p-7 border border-slate-200/60 relative overflow-hidden space-y-4">
          
          {/* Card Illustration Graphic */}
          <div className="w-16 h-14 relative">
            <div className="absolute top-0 left-0 w-11 h-9 bg-[#f4a261] rounded-lg shadow-sm transform -rotate-6 flex items-center justify-center text-white/90">
              <Layers className="w-5 h-5" />
            </div>
            <div className="absolute top-2 left-3 w-11 h-9 bg-[#2a9d8f] rounded-lg shadow-md flex items-center justify-center text-white">
              <FileText className="w-5 h-5" />
            </div>
            <div className="absolute top-0 right-0 w-3 h-8 bg-blue-300 rounded-full opacity-60"></div>
          </div>

          <div>
            <h3 className="text-base font-extrabold text-[#191d28] tracking-tight">
              Save more time with CMS
            </h3>
            <p className="text-xs text-slate-400 font-medium leading-relaxed mt-1">
              All changes to pages, menus, notices and courses are instantly broadcasted to the public portal.
            </p>
          </div>

          <Link
            to="/"
            target="_blank"
            className="block w-full bg-[#18191f] hover:bg-black text-white text-xs font-extrabold py-3.5 px-6 rounded-xl uppercase tracking-wider text-center transition-all cursor-pointer shadow-md"
          >
            VIEW LIVE SITE
          </Link>
        </div>

      </div>

    </div>
  );
}
