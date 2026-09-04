import React, { useState } from 'react';
import { GraduationCap, Search, ChevronRight, FileText, BookOpen } from 'lucide-react';
import { useFlipbook } from '../../context/FlipbookContext';
import PDFViewerEmbed from '../common/PDFViewerEmbed';
import ViewAsBookButton from '../common/ViewAsBookButton';

export default function SyllabusPGView() {
  const [searchTerm, setSearchTerm] = useState('');
  const { openFlipbook } = useFlipbook();

  const pgSyllabusList = [
    { code: 'MCA', dept: 'Computer Applications', degree: 'MCA (AICTE Approved)', semesters: 'Sem I to IV (CBCS Curricula)', credits: '88 Credits', localPdf: '/assets/documents/academics/MCA.pdf', slug: 'mca' },
    { code: 'MBA', dept: 'Management Studies', degree: 'MBA (AICTE Approved)', semesters: 'Sem I to IV (2024-25 Format)', credits: '104 Credits', localPdf: '/assets/documents/academics/MBA-SYLLABUS-QUESTION-PAPER-FORMAT-2024-25.pdf', slug: 'mba' },
    { code: 'M.Sc-CRFS', dept: 'Criminology & Forensic Science', degree: 'M.Sc (Autonomous)', semesters: '2024 BOS Approved Syllabus', credits: '80 Credits', localPdf: '/assets/documents/academics/M.Sc-CRFS-SYLLABUS-2024-BOS.pdf', slug: 'msc-crim' },
    { code: 'M.Sc-PSY', dept: 'Psychology', degree: 'M.Sc (Autonomous)', semesters: 'PG Curriculum Scheme', credits: '80 Credits', localPdf: '/assets/documents/academics/PG-Curriculum-Psychology.pdf', slug: 'msc-psych' },
    { code: 'M.Sc-FSN', dept: 'Food Science & Nutrition', degree: 'M.Sc (Autonomous)', semesters: 'PG Master Scheme & Labs', credits: '84 Credits', localPdf: '/assets/documents/academics/PG-FOOD-SCIENCE.pdf', slug: 'msc-food' }
  ];

  const [selectedItem, setSelectedItem] = useState(pgSyllabusList[0]);

  const filtered = pgSyllabusList.filter(
    (s) =>
      s.dept.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-[#C9A84C]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#a88530]">
              Postgraduate Curricula
            </span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0B1F4E]">
            Postgraduate (PG) Syllabi & CBCS Schemes
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            Choice Based Credit System (CBCS) syllabus regulations, core papers, hard-core/soft-core electives, and downloadable PDFs for Master degree programs.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <span className="bg-emerald-50 text-emerald-800 font-mono font-bold text-xs px-3.5 py-1.5 rounded-xl border border-emerald-200">
            {pgSyllabusList.length} Official Master Syllabi Stored
          </span>
        </div>
      </div>

      {/* SIDE-BY-SIDE SPLIT VIEW: Syllabus List (Left) + Interactive Live Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Searchable Syllabus List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
          
          {/* Header & Search */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#0B1F4E]">
                Select Master Degree Syllabus
              </h3>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                {filtered.length} of {pgSyllabusList.length}
              </span>
            </div>
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search PG discipline or code..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496]"
              />
            </div>
          </div>

          {/* Scrollable List of Syllabus Cards */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
            {filtered.map((s, idx) => {
              const isSelected = selectedItem?.code === s.code;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedItem(s)}
                  className={`p-4 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-emerald-50/90 border-l-4 border-emerald-600'
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded">
                        {s.code}
                      </span>
                      <span className="text-[11px] font-medium text-slate-500">
                        {s.semesters}
                      </span>
                    </div>
                    <h4 className="font-serif font-bold text-sm text-slate-900 truncate">
                      {s.dept}
                    </h4>
                    <p className="text-[11px] text-slate-500 truncate">
                      {s.degree} · {s.credits}
                    </p>
                  </div>

                  <div className="shrink-0 flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                    <ViewAsBookButton
                      pdfUrl={s.localPdf}
                      title={`${s.dept} (${s.code}) - ${s.semesters}`}
                      size="sm"
                      className="text-xs px-3 py-1.5"
                    />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* RIGHT COLUMN: Interactive Live Viewer Preview (7 Cols) */}
        <div className="lg:col-span-7 sticky top-20 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
          
          {/* Header Bar */}
          <div className="p-4 bg-[#071324] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
            <div className="flex items-center space-x-2.5 overflow-hidden pr-3">
              <div className="w-7 h-7 rounded-lg bg-[#FFD84A] text-[#071A33] flex items-center justify-center shrink-0">
                <BookOpen className="w-3.5 h-3.5 font-bold" />
              </div>
              <div className="overflow-hidden">
                <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">
                  Active Document Preview
                </span>
                <h3 className="font-serif font-bold text-sm text-white truncate">
                  {selectedItem.dept} ({selectedItem.code})
                </h3>
              </div>
            </div>

            <ViewAsBookButton
              pdfUrl={selectedItem.localPdf}
              title={`${selectedItem.dept} (${selectedItem.code}) Syllabus`}
              label="Open 3D Flipbook"
              size="sm"
            />
          </div>

          {/* Embedded Interactive Viewer */}
          <div className="flex-1 w-full relative bg-slate-900 overflow-hidden">
            <PDFViewerEmbed
              src={selectedItem.localPdf}
              title={`${selectedItem.dept} (${selectedItem.code}) Syllabus`}
              height="100%"
              badge="Postgraduate Syllabus"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
