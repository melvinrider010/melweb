import React, { useState } from 'react';
import { BookMarked, Search, ChevronRight, Download, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import PDFViewerEmbed from '../common/PDFViewerEmbed';

export default function SyllabusUGView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPdf, setSelectedPdf] = useState({
    title: 'Computer Science - Sem V & VI (NEP Revised)',
    url: '/assets/documents/academics/COMPUTER-SC-THIRD-YEAR.pdf'
  });

  const ugSyllabusList = [
    { code: 'B.Sc-CS', dept: 'Computer Science', degree: 'B.Sc (Autonomous)', semesters: 'Sem V & VI (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/COMPUTER-SC-THIRD-YEAR.pdf', deptLink: '/departments/ug-computer-science' },
    { code: 'B.Sc-PHY', dept: 'Physics', degree: 'B.Sc (Autonomous)', semesters: 'Sem V & VI (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/Physics-NEP-V-and-VI-Semesters-2024-2025.pdf', deptLink: '/departments/ug-physics' },
    { code: 'B.Sc-CHEM', dept: 'Chemistry', degree: 'B.Sc (Autonomous)', semesters: 'Final Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/CHEMISTRY-FINAL-YEAR-REVISED.pdf', deptLink: '/departments/ug-chemistry' },
    { code: 'B.Sc-MATH', dept: 'Mathematics', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/MATHS-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/ug-mathematics' },
    { code: 'B.Sc-BOT', dept: 'Botany', degree: 'B.Sc (Autonomous)', semesters: 'NEP OE & Core Curricula', credits: '160 Credits', localPdf: '/assets/documents/academics/Botany-OE-paper.pdf', deptLink: '/departments/ug-botany' },
    { code: 'B.Sc-ZOO', dept: 'Zoology', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/ZOOLOGY-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/ug-zoology' },
    { code: 'B.Sc-BIOCHEM', dept: 'Biochemistry', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/Biochemistry-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/ug-biochemistry' },
    { code: 'B.Sc-BIOTECH', dept: 'Biotechnology', degree: 'B.Sc (Autonomous)', semesters: 'Sem III, IV, V & VI (NEP Approved)', credits: '160 Credits', localPdf: '/assets/documents/academics/BT-345-and-6-sem-biotech-approved-NEP-syllabus-24-25-1.pdf', deptLink: '/departments/ug-biotechnology' },
    { code: 'B.Sc-MICRO', dept: 'Microbiology', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/Microbiology-THIRD-YEAR-REVISED.pdf', deptLink: '/academics' },
    { code: 'B.Sc-FSN', dept: 'Food Science & Nutrition', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/FOOD-SC-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/msc-food' },
    { code: 'B.Sc-CFS', dept: 'Criminology & Forensic Science', degree: 'B.Sc / B.A', semesters: 'Sem III, IV, V & VI (NEP)', credits: '160 Credits', localPdf: '/assets/documents/academics/criminology-sem-iii-and-IV-BA_B.Sc_.pdf', deptLink: '/departments/msc-crim' },
    { code: 'B.Sc-PSY', dept: 'Psychology', degree: 'B.Sc (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/PSYCHOLOGY-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/msc-psych' },
    { code: 'BCA', dept: 'Computer Applications', degree: 'BCA (Autonomous)', semesters: 'Third Year (NEP Curricula)', credits: '160 Credits', localPdf: '/assets/documents/academics/BCA-THIRD-YEAR.pdf', deptLink: '/departments/ug-computer-applications' },
    { code: 'B.Com', dept: 'Commerce & Accountancy', degree: 'B.Com (Autonomous)', semesters: 'Final Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/B.COM-FINAL-YEAR-REVISED.pdf', deptLink: '/departments/ug-commerce' },
    { code: 'BBA', dept: 'Business Administration', degree: 'BBA (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/BBA-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/ug-business-administration' },
    { code: 'BBA-TH', dept: 'Tourism & Hospitality', degree: 'BBA-TH (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/BBATH-THIRD-YEAR-REVISED.pdf', deptLink: '/academics' },
    { code: 'BA-HIST', dept: 'History', degree: 'B.A (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/History-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/ug-history' },
    { code: 'BA-ECON', dept: 'Economics', degree: 'B.A (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/ECONOMICS-REVISED-THIRD-YEAR.pdf', deptLink: '/departments/ug-economics' },
    { code: 'BA-SOC', dept: 'Sociology', degree: 'B.A (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/SOCIOLOGY-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/ug-sociology' },
    { code: 'BA-POL', dept: 'Political Science', degree: 'B.A (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/POLITICAL-SCIENCE-THIRD-YEAR-REVISED.pdf', deptLink: '/academics' },
    { code: 'BA-JOU', dept: 'Journalism', degree: 'B.A (Autonomous)', semesters: 'Third Year (NEP Revised)', credits: '160 Credits', localPdf: '/assets/documents/academics/JOURNALISM-THIRD-YEAR-REVISED.pdf', deptLink: '/departments/ma-jmc' },
    { code: 'BSW', dept: 'Social Work', degree: 'BSW (Autonomous)', semesters: 'Sem V & VI (Revised NEP)', credits: '160 Credits', localPdf: '/assets/documents/academics/BSW-revised-NEP-5-6.pdf', deptLink: '/departments/ug-social-work' }
  ];

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
            Official Board of Studies (BOS) approved syllabi, course outcomes, and live document viewer for all 27 UG departments.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-xs px-3.5 py-1.5 rounded-xl border border-blue-200">
            {ugSyllabusList.length} Official Syllabi Stored
          </span>
        </div>
      </div>

      {/* Embedded Live Syllabus Viewer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-serif font-bold text-lg text-[#0B1F4E] flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#1C5496]" />
            <span>Interactive UG Syllabus Document Viewer: <span className="text-[#1C5496] font-bold">{selectedPdf.title}</span></span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Click Any Row Below to Switch Syllabus
          </span>
        </div>

        <PDFViewerEmbed
          src={selectedPdf.url}
          title={selectedPdf.title}
          height="800px"
          badge="Undergraduate Syllabus"
        />
      </div>

      {/* Structured Table with Search */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="font-serif font-bold text-sm sm:text-base text-[#0B1F4E]">
            Select Department Syllabus to View or Download
          </h3>
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by department or degree code..."
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
                <th className="py-3 px-6">Department Name</th>
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
                      isCurrent ? 'bg-blue-50/80 font-semibold' : 'hover:bg-slate-50'
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
