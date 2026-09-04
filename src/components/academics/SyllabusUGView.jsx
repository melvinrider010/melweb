import React, { useState } from 'react';
import { BookMarked, Search, ChevronRight, FileText, Sparkles, BookOpen } from 'lucide-react';
import { useFlipbook } from '../../context/FlipbookContext';
import PDFViewerEmbed from '../common/PDFViewerEmbed';
import ViewAsBookButton from '../common/ViewAsBookButton';

export default function SyllabusUGView() {
  const [searchTerm, setSearchTerm] = useState('');
  const { openFlipbook } = useFlipbook();

  const ugSyllabusList = [
    { code: 'B.Sc-CS', dept: 'Computer Science', degree: 'B.Sc (Autonomous)', semesters: 'Sem V & VI (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/COMPUTER-SC-THIRD-YEAR.pdf', deptLink: '/departments/dept-computer-science' },
    { code: 'B.Sc-PHY', dept: 'Physics', degree: 'B.Sc (Autonomous)', semesters: 'Sem V & VI (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/Physics-NEP-V-and-VI-Semesters-2024-2025.pdf', deptLink: '/departments/dept-physics' },
    { code: 'B.Sc-CHEM', dept: 'Chemistry', degree: 'B.Sc (Autonomous)', semesters: 'Final Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/CHEMISTRY-FINAL-YEAR-REVISED.pdf', deptLink: '/departments/dept-chemistry' },
    { code: 'B.Sc-MATH', dept: 'Mathematics', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/MATHS-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-mathematics' },
    { code: 'B.Sc-BOT', dept: 'Botany', degree: 'B.Sc (Autonomous)', semesters: 'NEP OE & Core Curricula', credits: '160 Credits', localPdf: '/assets/documents/academics/Botany-OE-paper.pdf', deptLink: '/departments/dept-botany-zoology' },
    { code: 'B.Sc-ZOO', dept: 'Zoology', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/ZOOLOGY-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-botany-zoology' },
    { code: 'B.Sc-BIOCHEM', dept: 'Biochemistry', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/Biochemistry-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-biochemistry' },
    { code: 'B.Sc-BIOTECH', dept: 'Biotechnology', degree: 'B.Sc (Autonomous)', semesters: 'Sem III, IV, V & VI (NEP Approved)', credits: '160 Credits', localPdf: '/assets/documents/academics/BT-345-and-6-sem-biotech-approved-NEP-syllabus-24-25-1.pdf', deptLink: '/departments/dept-biotechnology' },
    { code: 'B.Sc-MICRO', dept: 'Microbiology', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/Microbiology-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-microbiology' },
    { code: 'B.Sc-FSN', dept: 'Food Science & Nutrition', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/FOOD-SC-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-food-science' },
    { code: 'B.Sc-CFS', dept: 'Criminology & Forensic Science', degree: 'B.Sc / B.A', semesters: 'Sem III, IV, V & VI (NEP)', credits: '160 Credits', localPdf: '/assets/documents/academics/criminology-sem-iii-and-IV-BA_B.Sc_.pdf', deptLink: '/departments/dept-criminology' },
    { code: 'B.Sc-PSY', dept: 'Psychology', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/PSYCHOLOGY-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-psychology' },
    { code: 'BCA', dept: 'Computer Applications', degree: 'BCA (Autonomous)', semesters: 'Third Year (NEP Curricula)', credits: '160 Credits', localPdf: '/assets/documents/academics/BCA-THIRD-YEAR.pdf', deptLink: '/departments/bca' },
    { code: 'B.Com', dept: 'Commerce & Accountancy', degree: 'B.Com (Autonomous)', semesters: 'Final Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/B.COM-FINAL-YEAR-REVISED.pdf', deptLink: '/departments/dept-commerce' },
    { code: 'BBA', dept: 'Business Administration', degree: 'BBA (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/BBA-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-management' },
    { code: 'BBA-TH', dept: 'Tourism & Hospitality', degree: 'BBA-TH (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/BBATH-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-management' },
    { code: 'BA-HIST', dept: 'History', degree: 'B.A (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/History-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-history' },
    { code: 'BA-ECON', dept: 'Economics', degree: 'B.A (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/ECONOMICS-REVISED-THIRD-YEAR.pdf', deptLink: '/departments/dept-economics' },
    { code: 'BA-SOC', dept: 'Sociology', degree: 'B.A (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/SOCIOLOGY-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-sociology' },
    { code: 'BA-POL', dept: 'Political Science', degree: 'B.A (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/POLITICAL-SCIENCE-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-political-science' },
    { code: 'BA-JOU', dept: 'Journalism', degree: 'B.A (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/JOURNALISM-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/dept-journalism' },
    { code: 'BSW', dept: 'Social Work', degree: 'BSW (Autonomous)', semesters: 'Sem V & VI (Revised NEP)', credits: '160 Credits', localPdf: '/assets/documents/academics/BSW-revised-NEP-5-6.pdf', deptLink: '/departments/dept-social-work' }
  ];

  const [selectedItem, setSelectedItem] = useState(ugSyllabusList[0]);

  const filtered = ugSyllabusList.filter(
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
            <BookMarked className="w-5 h-5 text-[#C9A84C]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#a88530]">
              Curriculum Archive
            </span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0B1F4E]">
            Undergraduate (UG) Syllabi & Course Matrix
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            Official Board of Studies (BOS) approved syllabi, course outcomes, and live document viewer for all UG departments.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-xs px-3.5 py-1.5 rounded-xl border border-blue-200">
            {ugSyllabusList.length} Official Syllabi Stored
          </span>
        </div>
      </div>

      {/* SIDE-BY-SIDE SPLIT VIEW: Syllabus List (Left) + Interactive Live Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Searchable Syllabus List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[820px]">
          
          {/* Header & Search */}
          <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-[#0B1F4E]">
                Select Department Syllabus
              </h3>
              <span className="text-[11px] font-mono text-slate-500 font-semibold">
                {filtered.length} of {ugSyllabusList.length}
              </span>
            </div>
            <div className="relative w-full">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search department or code..."
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
                      ? 'bg-blue-50/90 border-l-4 border-[#1C5496]'
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono font-bold text-xs text-[#1C5496] bg-blue-100/60 px-2 py-0.5 rounded">
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
        <div className="lg:col-span-7 sticky top-20 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[820px]">
          
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
              badge="Undergraduate Syllabus"
            />
          </div>

        </div>

      </div>

    </div>
  );
}
