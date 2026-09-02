import React, { useState } from 'react';
import { GraduationCap, Search, ChevronRight, Download, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import PDFViewerEmbed from '../common/PDFViewerEmbed';

export default function SyllabusPGView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPdf, setSelectedPdf] = useState({
    title: 'MCA - Master of Computer Applications (AICTE Approved)',
    url: '/assets/documents/academics/MCA.pdf'
  });

  const pgSyllabusList = [
    { code: 'MCA', dept: 'Computer Applications', degree: 'MCA (AICTE Approved)', semesters: 'Sem I to IV (CBCS Curricula)', credits: '88 Credits', localPdf: '/assets/documents/academics/MCA.pdf', slug: 'mca' },
    { code: 'MBA', dept: 'Management Studies', degree: 'MBA (AICTE Approved)', semesters: 'Sem I to IV (2024-25 Format)', credits: '104 Credits', localPdf: '/assets/documents/academics/MBA-SYLLABUS-QUESTION-PAPER-FORMAT-2024-25.pdf', slug: 'mba' },
    { code: 'M.Sc-CRFS', dept: 'Criminology & Forensic Science', degree: 'M.Sc (Autonomous)', semesters: '2024 BOS Approved Syllabus', credits: '80 Credits', localPdf: '/assets/documents/academics/M.Sc-CRFS-SYLLABUS-2024-BOS.pdf', slug: 'msc-crim' },
    { code: 'M.Sc-PSY', dept: 'Psychology', degree: 'M.Sc (Autonomous)', semesters: 'PG Curriculum Scheme', credits: '80 Credits', localPdf: '/assets/documents/academics/PG-Curriculum-Psychology.pdf', slug: 'msc-psych' },
    { code: 'M.Sc-FSN', dept: 'Food Science & Nutrition', degree: 'M.Sc (Autonomous)', semesters: 'PG Master Scheme & Labs', credits: '84 Credits', localPdf: '/assets/documents/academics/PG-FOOD-SCIENCE.pdf', slug: 'msc-food' }
  ];

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
            Choice Based Credit System (CBCS) syllabus regulations, core papers, hard-core/soft-core electives, open electives, and downloadable PDFs for Master degree programs.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <span className="bg-emerald-50 text-emerald-800 font-mono font-bold text-xs px-3.5 py-1.5 rounded-xl border border-emerald-200">
            Official Master Syllabi Stored
          </span>
        </div>
      </div>

      {/* Embedded Live Syllabus Viewer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-serif font-bold text-lg text-[#0B1F4E] flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#1C5496]" />
            <span>Interactive PG Syllabus Document Viewer: <span className="text-[#1C5496] font-bold">{selectedPdf.title}</span></span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Click Any Row Below to Switch Syllabus
          </span>
        </div>

        <PDFViewerEmbed
          src={selectedPdf.url}
          title={selectedPdf.title}
          height="800px"
          badge="Postgraduate Syllabus"
        />
      </div>

      {/* PG Syllabi Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="font-serif font-bold text-sm sm:text-base text-[#0B1F4E]">
            Select Master Degree Syllabus to View or Download
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by PG discipline or degree code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse font-sans">
            <thead>
              <tr className="bg-[#0B1F4E] text-white font-serif uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Code</th>
                <th className="py-3 px-6">Postgraduate Discipline</th>
                <th className="py-3 px-6">Approved Degree</th>
                <th className="py-3 px-6">Structure</th>
                <th className="py-3 px-6">Credits</th>
                <th className="py-3 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((s, idx) => {
                const isCurrent = selectedPdf.url === s.localPdf;
                return (
                  <tr 
                    key={idx} 
                    className={`transition-colors cursor-pointer ${
                      isCurrent ? 'bg-emerald-50/80 font-semibold' : 'hover:bg-slate-50'
                    }`}
                    onClick={() => setSelectedPdf({ title: `${s.dept} (${s.code}) Syllabus`, url: s.localPdf })}
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#1C5496]">{s.code}</td>
                    <td className="py-3.5 px-6 font-serif font-bold text-slate-900">{s.dept}</td>
                    <td className="py-3.5 px-6 text-slate-600">{s.degree}</td>
                    <td className="py-3.5 px-6 text-slate-600 font-mono text-xs">{s.semesters}</td>
                    <td className="py-3.5 px-6 text-slate-600 font-mono text-xs">{s.credits}</td>
                    <td className="py-3.5 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setSelectedPdf({ title: `${s.dept} (${s.code}) Syllabus`, url: s.localPdf })}
                          className="px-2.5 py-1.5 bg-[#0B1F4E] hover:bg-[#1C5496] text-white rounded-md text-xs font-bold inline-flex items-center space-x-1 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View</span>
                        </button>
                        <a
                          href={s.localPdf}
                          download
                          className="px-2.5 py-1.5 bg-[#FFD84A] hover:bg-[#ffcd1f] text-slate-900 rounded-md text-xs font-bold inline-flex items-center space-x-1 transition-colors shadow-2xs cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-900" />
                          <span>PDF</span>
                        </a>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
