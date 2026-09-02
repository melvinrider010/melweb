import React, { useState } from 'react';
import { Video, Search, ExternalLink, BookOpen, Sparkles, FolderDown, Download } from 'lucide-react';

export default function EContentView() {
  const [searchTerm, setSearchTerm] = useState('');

  const officialDrives = [
    {
      title: 'Undergraduate (UG) Digital E-Content Commons',
      subtitle: 'Comprehensive lecture series, PPTs, study notes & question banks for all UG degrees',
      dept: 'UG Central Repository',
      link: 'https://drive.google.com/drive/folders/1DEYfNkS5FgzLXvogBHR9UejMx91zOMv0?usp=drive_link',
      type: 'Google Drive Archive'
    },
    {
      title: 'M.A English Postgraduate E-Content Commons',
      subtitle: 'Literary criticism, course modules, audio-visual lectures & critical essays',
      dept: 'M.A English',
      link: 'https://drive.google.com/drive/folders/1fXD0UedNKYDMqSQIoVsLfTArigvCJ_-U?usp=drive_link',
      type: 'Google Drive Archive'
    },
    {
      title: 'M.Sc Mathematics Postgraduate E-Content Commons',
      subtitle: 'Advanced algebra, topology, differential geometry & computational analysis notes',
      dept: 'M.Sc Mathematics',
      link: 'https://drive.google.com/drive/folders/0B-c-HkpsPidWfjVlS2wxajdjMUtwLXZtOHQ0UHRnb1Z6a2hLYkpBeUctb3E5c2JSY0JYRzg?resourcekey=0-nFtJOdXCvDPlr0ZyuSPi_g&usp=drive_link',
      type: 'Google Drive Archive'
    }
  ];

  const econtentModules = [
    { title: 'Data Structures & Algorithms E-Lecture Series', dept: 'Computer Science', type: 'Video & PPT Courseware', faculty: 'Dept. of Computer Science', link: 'https://drive.google.com/drive/folders/1DEYfNkS5FgzLXvogBHR9UejMx91zOMv0?usp=drive_link' },
    { title: 'Organic Chemistry Reaction Mechanisms & Spectroscopy', dept: 'Chemistry', type: 'Interactive Notes & Virtual Lab', faculty: 'Dept. of Chemistry', link: 'https://drive.google.com/drive/folders/1DEYfNkS5FgzLXvogBHR9UejMx91zOMv0?usp=drive_link' },
    { title: 'Quantum Mechanics & Solid State Physics Modules', dept: 'Physics', type: 'Digital E-Book & Simulation', faculty: 'Dept. of Physics', link: 'https://drive.google.com/drive/folders/1DEYfNkS5FgzLXvogBHR9UejMx91zOMv0?usp=drive_link' },
    { title: 'Corporate Financial Accounting & Direct Tax Law', dept: 'Commerce (M.Com)', type: 'Case Studies & Excel Models', faculty: 'Dept. of Commerce', link: 'https://drive.google.com/drive/folders/1DEYfNkS5FgzLXvogBHR9UejMx91zOMv0?usp=drive_link' },
    { title: 'Full Stack Web Architectures & Cloud Computing', dept: 'MCA', type: 'Hands-on Code Repos & Video', faculty: 'Dept. of MCA', link: 'https://drive.google.com/drive/folders/1DEYfNkS5FgzLXvogBHR9UejMx91zOMv0?usp=drive_link' },
    { title: 'Strategic Management & Global Business Case Studies', dept: 'MBA', type: 'Case Studies & Executive PPTs', faculty: 'Dept. of Management', link: 'https://drive.google.com/drive/folders/1DEYfNkS5FgzLXvogBHR9UejMx91zOMv0?usp=drive_link' },
    { title: 'Cognitive Psychology & Behavioral Neuroscience', dept: 'Psychology', type: 'Clinical Case Files & Audio', faculty: 'Dept. of Psychology', link: 'https://drive.google.com/drive/folders/1DEYfNkS5FgzLXvogBHR9UejMx91zOMv0?usp=drive_link' },
    { title: 'Food Chemistry, Preservation & Nutritional Biochemistry', dept: 'Food Science & Nutrition', type: 'Laboratory Protocols & Modules', faculty: 'Dept. of FSN', link: 'https://drive.google.com/drive/folders/1DEYfNkS5FgzLXvogBHR9UejMx91zOMv0?usp=drive_link' }
  ];

  const filtered = econtentModules.filter(
    (m) =>
      m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.dept.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Video className="w-5 h-5 text-[#C9A84C]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#a88530]">
              Digital Learning Commons
            </span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0B1F4E]">
            E-Content & Digital Courseware Portal
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            Official central digital repository hosted on Google Drive, faculty multimedia lectures, notes, and virtual learning materials.
          </p>
        </div>
      </div>

      {/* Official Central Cloud Drives */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {officialDrives.map((drive, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <span className="bg-blue-50 text-[#1C5496] font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded inline-block">
                {drive.dept}
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">{drive.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">{drive.subtitle}</p>
            </div>
            <a
              href={drive.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 text-center mt-2 cursor-pointer"
            >
              <FolderDown className="w-4 h-4" />
              <span>Open Cloud Repository</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        ))}
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search e-content modules by title, department, or keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496] focus:bg-white transition-all"
          />
        </div>
        <span className="text-xs font-bold text-slate-500 font-mono shrink-0">
          Showing {filtered.length} Modules
        </span>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((mod, idx) => (
          <div
            key={idx}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="bg-blue-50 text-[#1C5496] font-mono text-[10.5px] font-bold px-2.5 py-0.5 rounded border border-blue-200">
                  {mod.dept}
                </span>
                <span className="text-[11px] text-slate-400 font-medium">{mod.type}</span>
              </div>
              <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">{mod.title}</h3>
              <p className="text-xs text-slate-500 font-sans">Curated by: {mod.faculty}</p>
            </div>

            <a
              href={mod.link}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 text-center cursor-pointer"
            >
              <Video className="w-3.5 h-3.5" />
              <span>Access Digital Module</span>
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}
