import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, Calendar, Building2, FileText, Image as ImageIcon, 
  MoreHorizontal, Plus, Sparkles, ExternalLink, ArrowRight, 
  Layers, CheckCircle2
} from 'lucide-react';
import { cmsStore } from '../../lib/cmsStore';

export default function AdminDashboardPage() {
  const [mediaList, setMediaList] = useState(cmsStore.getMedia());
  const [docList, setDocList] = useState(cmsStore.getDocuments());
  const [facultyList, setFacultyList] = useState(cmsStore.getFaculty());
  const [ugList, setUgList] = useState(cmsStore.getUGProgrammes());
  const [pgList, setPgList] = useState(cmsStore.getPGProgrammes());
  const [deptList, setDeptList] = useState(cmsStore.getDepartments());
  const [noticesList, setNoticesList] = useState(cmsStore.getNotices());
  const [pagesList, setPagesList] = useState(cmsStore.getPages ? cmsStore.getPages() : []);

  useEffect(() => {
    const handleUpdate = () => {
      setMediaList(cmsStore.getMedia());
      setDocList(cmsStore.getDocuments());
      setFacultyList(cmsStore.getFaculty());
      setUgList(cmsStore.getUGProgrammes());
      setPgList(cmsStore.getPGProgrammes());
      setDeptList(cmsStore.getDepartments());
      setNoticesList(cmsStore.getNotices());
      if (cmsStore.getPages) setPagesList(cmsStore.getPages());
    };

    window.addEventListener('cms_store_updated', handleUpdate);
    return () => window.removeEventListener('cms_store_updated', handleUpdate);
  }, []);

  const totalProgrammes = (ugList.length + pgList.length) || 28;
  const totalFaculty = facultyList.length || 142;
  const totalNotices = noticesList.length || 65;
  const totalMedia = mediaList.length || 85;
  const totalPages = pagesList.length || 120;

  // Bar chart sparkline heights (mimicking screenshot bar frequency)
  const barHeights = [
    24, 38, 28, 20, 32, 16, 26, 40, 22, 34, 18, 28, 
    22, 36, 19, 30, 42, 26, 32, 20, 28, 56, 30
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 lg:gap-10">
      
      {/* ============================================================ */}
      {/* LEFT / CENTER MAIN COLUMN (~65% width)                      */}
      {/* ============================================================ */}
      <div className="xl:col-span-8 space-y-8">
        
        {/* Header matching reference image */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#191d28] tracking-tight">
              Dashboard
            </h1>
            <p className="text-sm text-slate-400 font-medium mt-1">
              01 - 25 March, 2026
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
              const isHighlight = i === 21; // The prominent blue bar
              return (
                <div 
                  key={i} 
                  className="flex-1 flex flex-col justify-end items-center group cursor-pointer"
                >
                  <div
                    style={{ height: `${h}px` }}
                    className={`w-full max-w-[12px] sm:max-w-[14px] rounded-full transition-all duration-200 ${
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

        {/* Grouped Recent Feeds / Activities */}
        <div className="space-y-7">
          
          {/* Section: Today */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#191d28] tracking-tight">
                Today
              </h2>
              <button className="text-slate-300 hover:text-slate-500 p-1 cursor-pointer transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Row 1: Sky Blue Circular Icon */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-full bg-[#2ea5ff] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#191d28] group-hover:text-blue-600 transition-colors">
                      Academics & Syllabus Matrix
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      5:12 pm • BCA & B.Com Course Curriculum
                    </p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-extrabold text-[#191d28] tracking-tight">
                  +12 pages
                </span>
              </div>

              {/* Row 2: Purple Circular Icon */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-full bg-[#9f54e6] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#191d28] group-hover:text-purple-600 transition-colors">
                      Upcoming Campus Events
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      4:45 pm • Annual Diamond Jubilee Fest
                    </p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-extrabold text-[#191d28] tracking-tight">
                  Published
                </span>
              </div>

              {/* Row 3: Orange Circular Icon */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-full bg-[#ff9432] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#191d28] group-hover:text-amber-600 transition-colors">
                      Computer Science Faculty Roster
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      2:15 pm • HOD & Faculty Profiles Synced
                    </p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-extrabold text-[#191d28] tracking-tight">
                  18 Faculty
                </span>
              </div>
            </div>
          </div>

          {/* Section: Monday, 23 March 2026 */}
          <div className="space-y-4 pt-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#191d28] tracking-tight">
                Monday, 23 March 2026
              </h2>
              <button className="text-slate-300 hover:text-slate-500 p-1 cursor-pointer transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {/* Row 1: Coral Red Circular Icon */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-full bg-[#eb4848] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#191d28] group-hover:text-rose-600 transition-colors">
                      NAAC Self Study Report Criterion 3
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      11:30 am • Research Grants & Publications
                    </p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-extrabold text-[#191d28] tracking-tight">
                  PDF Live
                </span>
              </div>

              {/* Row 2: Emerald Green Circular Icon */}
              <div className="flex items-center justify-between group">
                <div className="flex items-center space-x-4">
                  <div className="w-11 h-11 rounded-full bg-[#20c978] flex items-center justify-center text-white shrink-0 shadow-xs">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#191d28] group-hover:text-emerald-600 transition-colors">
                      Convocation Photo Gallery Reel
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      9:15 am • 24 High-Resolution Assets
                    </p>
                  </div>
                </div>
                <span className="text-sm sm:text-base font-extrabold text-[#191d28] tracking-tight">
                  24 Assets
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* ============================================================ */}
      {/* RIGHT SIDEBAR COLUMN (~35% width)                           */}
      {/* ============================================================ */}
      <div className="xl:col-span-4 xl:pl-8 xl:border-l border-slate-100 flex flex-col justify-between space-y-8">
        
        {/* Top: "Where your content lives?" Breakdown */}
        <div className="space-y-6">
          <h2 className="text-lg font-extrabold text-[#191d28] tracking-tight">
            Where your content lives?
          </h2>

          <div className="space-y-5">
            
            {/* Breakdown item 1 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#191d28]">Academic Syllabi & Programmes</span>
                <span className="font-semibold text-slate-500">872.400</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#20c978] h-full rounded-full w-[45%]" />
              </div>
            </div>

            {/* Breakdown item 2 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#191d28]">Notices & Circulars</span>
                <span className="font-semibold text-slate-500">1.378.200</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#20c978] h-full rounded-full w-[70%]" />
              </div>
            </div>

            {/* Breakdown item 3 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#191d28]">Faculty & Staff Directory</span>
                <span className="font-semibold text-slate-500">928.500</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#20c978] h-full rounded-full w-[55%]" />
              </div>
            </div>

            {/* Breakdown item 4 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#191d28]">Campus Media & Gallery</span>
                <span className="font-semibold text-slate-500">420.700</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#20c978] h-full rounded-full w-[35%]" />
              </div>
            </div>

            {/* Breakdown item 5 */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-[#191d28]">Dynamic Pages & Menus</span>
                <span className="font-semibold text-slate-500">520.000</span>
              </div>
              <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className="bg-[#20c978] h-full rounded-full w-[40%]" />
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
