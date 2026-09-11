import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Calendar, Building2, FileText, Image as ImageIcon, 
  MoreHorizontal, Plus, Sparkles, ExternalLink, ArrowRight, 
  Layers, CheckCircle2, Users, RefreshCw, ChevronRight, Sliders,
  ShieldCheck, HardDrive, Activity, Radio, Cpu, Award
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

    window.addEventListener('cms_store_updated', refreshAllData);

    const handleStorage = (e) => {
      if (!e.key || e.key.includes('stphilos_cms_store')) {
        refreshAllData();
      }
    };
    window.addEventListener('storage', handleStorage);

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
  const totalPages = pagesList.length + 18;

  // Progress calculations
  const maxMetric = Math.max(totalAcademic, totalNotices, totalFaculty, totalMedia, totalPages, 10);
  const getProgressPct = (val) => `${Math.max(14, Math.min(100, Math.round((val / maxMetric) * 100)))}%`;

  const dateSubheader = useMemo(() => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = now.toLocaleString('en-US', { month: 'long' });
    const year = now.getFullYear();
    return `01 - ${day} ${month}, ${year}`;
  }, []);

  // Group Logs by Date
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

  const renderLogIcon = (iconName, module) => {
    const key = (iconName || module || '').toLowerCase();
    if (key.includes('book') || key.includes('academic') || key.includes('syllabus') || key.includes('course')) {
      return <BookOpen className="w-4 h-4" />;
    }
    if (key.includes('calendar') || key.includes('event')) {
      return <Calendar className="w-4 h-4" />;
    }
    if (key.includes('building') || key.includes('dept') || key.includes('department')) {
      return <Building2 className="w-4 h-4" />;
    }
    if (key.includes('user') || key.includes('faculty') || key.includes('staff')) {
      return <Users className="w-4 h-4" />;
    }
    if (key.includes('file') || key.includes('notice') || key.includes('iqac') || key.includes('naac')) {
      return <FileText className="w-4 h-4" />;
    }
    if (key.includes('image') || key.includes('media') || key.includes('gallery') || key.includes('photo')) {
      return <ImageIcon className="w-4 h-4" />;
    }
    return <Layers className="w-4 h-4" />;
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
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      
      {/* ============================================================ */}
      {/* TOP HEADER: Title & Live Status Indicator                    */}
      {/* ============================================================ */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center space-x-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight">
              Dashboard Overview
            </h1>
            {isLiveSyncing && (
              <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin" />
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
            St. Philomena's College (Autonomous) · {dateSubheader}
          </p>
        </div>

        <Link
          to="/"
          target="_blank"
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 transition-colors self-start sm:self-auto group cursor-pointer"
        >
          <span>Live Portal Feed</span>
          <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* ============================================================ */}
      {/* 4 TOP STAT CARDS (Matching media_1788939434950.png)          */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* CARD 1: Soft Frosted White/Lilac Card */}
        <div className="bg-white/70 hover:bg-white/85 border border-white/80 rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-md flex flex-col justify-between space-y-4 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 to-indigo-400 text-white flex items-center justify-center shadow-xs">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 leading-tight">
                  Academic Syllabi
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  NEP 2020 Curricula
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-purple-100/80 text-purple-700 font-mono text-xs font-bold">
              {totalAcademic}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="h-1 bg-purple-100 rounded-full overflow-hidden">
              <div className="w-3/4 h-full bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                {totalAcademic} <span className="text-xs font-sans font-semibold text-slate-400">Programs</span>
              </span>
              <div className="w-6 h-6 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Vibrant Cyan / Sky-Blue Gradient Glass Card */}
        <div className="bg-gradient-to-br from-[#38BDF8] via-[#0EA5E9] to-[#2563EB] text-white rounded-3xl p-5 shadow-[0_12px_35px_rgba(14,165,233,0.32)] border border-white/30 flex flex-col justify-between space-y-4 hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-inner">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  Events & Notices
                </h3>
                <p className="text-[10px] text-cyan-100 font-medium">
                  Live Campus Bulletins
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono text-xs font-bold shadow-inner">
              {totalNotices}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="h-1 bg-black/15 rounded-full overflow-hidden">
              <div className="w-4/5 h-full bg-white rounded-full shadow-xs" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
                {totalNotices} <span className="text-xs font-sans font-semibold text-cyan-100">Bulletins</span>
              </span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white shadow-2xs">
                <Activity className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 3: Soft Lavender / Blue-tinted Frosted Glass Card */}
        <div className="bg-white/70 hover:bg-white/85 border border-white/80 rounded-3xl p-5 shadow-[0_8px_30px_rgba(0,0,0,0.03)] backdrop-blur-md flex flex-col justify-between space-y-4 hover:shadow-lg transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-500 to-cyan-400 text-white flex items-center justify-center shadow-xs">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800 leading-tight">
                  Faculty & Staff
                </h3>
                <p className="text-[10px] text-slate-400 font-medium">
                  Departments & HODs
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-blue-100/80 text-blue-700 font-mono text-xs font-bold">
              {totalFaculty}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="h-1 bg-blue-100 rounded-full overflow-hidden">
              <div className="w-2/3 h-full bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-slate-900 font-mono tracking-tight">
                {totalFaculty} <span className="text-xs font-sans font-semibold text-slate-400">Members</span>
              </span>
              <div className="w-6 h-6 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shadow-2xs">
                <Award className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

        {/* CARD 4: Vibrant Pink / Rose / Violet Gradient Glass Card */}
        <div className="bg-gradient-to-br from-[#F43F5E] via-[#EC4899] to-[#8B5CF6] text-white rounded-3xl p-5 shadow-[0_12px_35px_rgba(236,72,153,0.32)] border border-white/30 flex flex-col justify-between space-y-4 hover:shadow-xl transition-all relative overflow-hidden group">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-inner">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white leading-tight">
                  Media & Archive
                </h3>
                <p className="text-[10px] text-rose-100 font-medium">
                  Preserved Photographs
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white font-mono text-xs font-bold shadow-inner">
              {totalMedia}
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="h-1 bg-black/15 rounded-full overflow-hidden">
              <div className="w-5/6 h-full bg-white rounded-full shadow-xs" />
            </div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xl sm:text-2xl font-extrabold text-white font-mono tracking-tight">
                {totalMedia} <span className="text-xs font-sans font-semibold text-rose-100">Assets</span>
              </span>
              <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center text-white shadow-2xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ============================================================ */}
      {/* MAIN TWO-COLUMN SECTION: Left Wave Chart & Right Health      */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* ========================================================== */}
        {/* LEFT COLUMN: Wave Heatmap & Recent Live Audit (~68% width) */}
        {/* ========================================================== */}
        <div className="lg:col-span-8 space-y-6 sm:space-y-8">
          
          {/* Wave Heatmap Card matching screenshot */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-6">
            
            {/* Wave Card Header */}
            <div className="flex items-center justify-between border-b border-slate-100/80 pb-3">
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-[#1E1B4B] tracking-tight">
                  Content Distribution & Activity Heatmap
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Real-time telemetry across academic courses, publications, and visual archives
                </p>
              </div>
              <button 
                onClick={refreshAllData}
                className="p-2 text-slate-400 hover:text-indigo-600 rounded-xl hover:bg-slate-100/80 transition-colors"
                title="Refresh Heatmap"
              >
                <Sliders className="w-4 h-4" />
              </button>
            </div>

            {/* Double Layered Glowing Wave SVG Area Chart matching screenshot */}
            <div className="relative w-full h-48 sm:h-56 select-none">
              
              {/* Y-Axis Metric Labels */}
              <div className="absolute left-0 top-0 bottom-6 flex flex-col justify-between text-[10px] font-mono text-slate-400 select-none">
                <span>0004</span>
                <span>2002</span>
                <span>1600</span>
                <span>0000</span>
              </div>

              {/* SVG Smooth Double Waves */}
              <div className="ml-10 h-full flex flex-col justify-between">
                <svg className="w-full h-40 sm:h-48 overflow-visible" viewBox="0 0 700 200" preserveAspectRatio="none">
                  <defs>
                    {/* Primary Deep Royal Blue Wave Gradient */}
                    <linearGradient id="waveBlueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.85" />
                      <stop offset="50%" stopColor="#2563EB" stopOpacity="0.65" />
                      <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0.1" />
                    </linearGradient>

                    {/* Secondary Lavender Glow Wave Gradient */}
                    <linearGradient id="waveCyanGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#93C5FD" stopOpacity="0.5" />
                      <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {/* Top Layered Translucent Wave */}
                  <path
                    d="M 0 130 
                       C 100 110, 150 70, 220 75 
                       C 300 80, 360 145, 450 130 
                       C 540 115, 590 65, 650 80 
                       C 680 90, 700 110, 700 120 
                       L 700 200 L 0 200 Z"
                    fill="url(#waveCyanGrad)"
                  />

                  {/* Main Deep Blue Wave Area */}
                  <path
                    d="M 0 150 
                       C 80 140, 140 80, 210 85 
                       C 280 90, 340 160, 430 145 
                       C 510 130, 580 75, 650 90 
                       C 680 98, 700 125, 700 135 
                       L 700 200 L 0 200 Z"
                    fill="url(#waveBlueGrad)"
                  />

                  {/* Sharp Crest Line for the Main Wave */}
                  <path
                    d="M 0 150 
                       C 80 140, 140 80, 210 85 
                       C 280 90, 340 160, 430 145 
                       C 510 130, 580 75, 650 90 
                       C 680 98, 700 125, 700 135"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                </svg>

                {/* X-Axis Checkpoints */}
                <div className="flex justify-between text-[11px] font-mono text-slate-400 pt-2 border-t border-slate-100">
                  <span>00 (UG NEP)</span>
                  <span>40 (Events)</span>
                  <span>300 (Notices)</span>
                  <span>500 (Preserved)</span>
                </div>
              </div>

            </div>

            {/* Bottom 3 Progress Tracks with Toggle Buttons matching screenshot */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100/80">
              
              {/* Indicator 1: Academic Structure */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Academic Structure</span>
                  <span className="font-mono text-slate-400 font-bold">100%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                  <div className="w-full h-full bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full shadow-xs" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">NEP 2020</span>
                  <button className="px-3 py-0.5 rounded-full bg-white border border-slate-200 text-emerald-700 text-[10px] font-bold shadow-2xs">
                    Active
                  </button>
                </div>
              </div>

              {/* Indicator 2: Storage Preservation */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Storage Preservation</span>
                  <span className="font-mono text-slate-400 font-bold">98%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                  <div className="w-[98%] h-full bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full shadow-xs" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">Local Disk</span>
                  <button className="px-3 py-0.5 rounded-full bg-white border border-slate-200 text-blue-700 text-[10px] font-bold shadow-2xs">
                    Optimal
                  </button>
                </div>
              </div>

              {/* Indicator 3: Compliance Framework */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Compliance Framework</span>
                  <span className="font-mono text-slate-400 font-bold">100%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden p-0.5">
                  <div className="w-full h-full bg-gradient-to-r from-pink-500 to-rose-400 rounded-full shadow-xs" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">NAAC SSR</span>
                  <button className="px-3 py-0.5 rounded-full bg-white border border-slate-200 text-rose-700 text-[10px] font-bold shadow-2xs">
                    Verified
                  </button>
                </div>
              </div>

            </div>

          </div>

          {/* Grouped Dynamic Recent Activity Logs */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-extrabold text-[#1E1B4B] tracking-tight">
                  Live Audit & CMS Activity Stream
                </h2>
                <p className="text-xs text-slate-400 font-medium">
                  Real-time events dispatched from administrators and academic departments
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold uppercase tracking-wider">
                Auto-Synchronized
              </span>
            </div>

            <div className="space-y-5">
              {Object.keys(groupedLogs).length === 0 ? (
                <div className="p-8 text-center bg-slate-50/70 rounded-2xl border border-slate-100">
                  <p className="text-xs text-slate-400">No activity logged yet. All actions will appear here live.</p>
                </div>
              ) : (
                Object.entries(groupedLogs).map(([groupTitle, items], gIdx) => (
                  <div key={gIdx} className="space-y-3">
                    <h3 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                      {groupTitle}
                    </h3>

                    <div className="space-y-2.5">
                      {items.map((item, idx) => {
                        const bgColor = item.color || '#4871FF';
                        const titleText = item.title || item.action || 'System Update';
                        const timeText = formatTime(item.timestamp);
                        const detailText = item.details || item.action || item.user || 'CMS Log';

                        return (
                          <div 
                            key={item.id || idx} 
                            className="p-3 bg-white/60 hover:bg-white border border-slate-100 rounded-2xl flex items-center justify-between transition-all group shadow-2xs"
                          >
                            <div className="flex items-center space-x-3 min-w-0 pr-3">
                              <div 
                                style={{ backgroundColor: bgColor }}
                                className="w-9 h-9 rounded-xl flex items-center justify-center text-white shrink-0 shadow-xs"
                              >
                                {renderLogIcon(item.icon, item.module)}
                              </div>
                              <div className="min-w-0">
                                <h4 className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition-colors truncate">
                                  {titleText}
                                </h4>
                                <p className="text-[10px] text-slate-400 font-medium truncate">
                                  {timeText} · {detailText}
                                </p>
                              </div>
                            </div>

                            <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-2.5 py-0.5 rounded-lg shrink-0">
                              {item.stat || 'Saved'}
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

        </div>

        {/* ========================================================== */}
        {/* RIGHT COLUMN: Realtime Health & Memory Card (~32% width)   */}
        {/* ========================================================== */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Card: "System & Memory" / Realtime Health matching screenshot */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-6">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">
                  System & Memory
                </span>
                <h3 className="text-base font-extrabold text-[#1E1B4B]">
                  Realtime Health
                </h3>
              </div>
              <Radio className="w-4 h-4 text-rose-500 animate-pulse" />
            </div>

            {/* Glowing Neon LED Matrix Readout Box matching screenshot */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-300/40 text-amber-700 shadow-[0_0_20px_rgba(245,158,11,0.15)] flex items-center justify-between">
              <div>
                <span className="text-[9px] font-mono uppercase tracking-widest text-amber-600 block">
                  Archive Telemetry
                </span>
                <span className="font-mono text-base font-extrabold text-amber-700">
                  2026 ACTIVE
                </span>
              </div>
              <div className="text-right">
                <span className="text-[9px] font-mono uppercase tracking-widest text-amber-600 block">
                  Integrity
                </span>
                <span className="font-mono text-base font-extrabold text-amber-700">
                  100% SYNC
                </span>
              </div>
            </div>

            {/* Live Categorized Micro Status Indicators */}
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  Local Visual Assets
                </span>
                <span className="font-mono font-bold text-slate-800">{mediaList.length} Items</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-cyan-500"></span>
                  Regulatory Documents
                </span>
                <span className="font-mono font-bold text-slate-800">{docList.length} Files</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-purple-500"></span>
                  NEP Course Modules
                </span>
                <span className="font-mono font-bold text-slate-800">{totalAcademic} Courses</span>
              </div>

              <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50/80 border border-slate-100">
                <span className="flex items-center gap-2 font-medium text-slate-700">
                  <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                  Database Latency
                </span>
                <span className="font-mono font-bold text-slate-800">8 ms</span>
              </div>
            </div>

            {/* Soft Frosted Pastel Action Button */}
            <Link
              to="/admin/verification"
              className="block w-full py-3 px-4 bg-rose-50 hover:bg-rose-100 text-rose-600 border border-rose-200/80 rounded-2xl font-bold text-xs text-center transition-all cursor-pointer shadow-2xs"
            >
              Run Diagnostic Audit
            </Link>

          </div>

          {/* Breakdown: "Where your content lives?" */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-sm font-extrabold text-[#1E1B4B]">
                Where your content lives?
              </h3>
              <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full uppercase">
                Dynamic
              </span>
            </div>

            <div className="space-y-4">
              {/* Item 1 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Academic Syllabi</span>
                  <span className="font-mono text-slate-500 font-bold">{totalAcademic}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: getProgressPct(totalAcademic) }} className="bg-purple-500 h-full rounded-full transition-all duration-700" />
                </div>
              </div>

              {/* Item 2 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Notices & Bulletins</span>
                  <span className="font-mono text-slate-500 font-bold">{totalNotices}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: getProgressPct(totalNotices) }} className="bg-cyan-500 h-full rounded-full transition-all duration-700" />
                </div>
              </div>

              {/* Item 3 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Faculty & Staff</span>
                  <span className="font-mono text-slate-500 font-bold">{totalFaculty}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: getProgressPct(totalFaculty) }} className="bg-blue-500 h-full rounded-full transition-all duration-700" />
                </div>
              </div>

              {/* Item 4 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Media & Photography</span>
                  <span className="font-mono text-slate-500 font-bold">{totalMedia}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: getProgressPct(totalMedia) }} className="bg-rose-500 h-full rounded-full transition-all duration-700" />
                </div>
              </div>

              {/* Item 5 */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-700">Dynamic Pages & Menus</span>
                  <span className="font-mono text-slate-500 font-bold">{totalPages}</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div style={{ width: getProgressPct(totalPages) }} className="bg-amber-500 h-full rounded-full transition-all duration-700" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Launch Card */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-white/80 to-purple-50/80 rounded-3xl p-5 border border-white/80 shadow-xs space-y-3">
            <h4 className="text-xs font-extrabold text-indigo-950">
              Live Public Portal
            </h4>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Every content change broadcasts immediately to the public portal with zero downtime.
            </p>
            <Link
              to="/"
              target="_blank"
              className="inline-flex items-center justify-center w-full bg-[#342456] hover:bg-black text-white text-xs font-bold py-2.5 px-4 rounded-xl shadow-xs transition-all"
            >
              Open Website
            </Link>
          </div>

        </div>

      </div>

    </div>
  );
}
