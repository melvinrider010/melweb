import React from 'react';
import { BookOpen, FileText, Download, Calendar, ExternalLink } from 'lucide-react';
import { ASSETS } from '../data/assets';

export default function ResourcesPage() {
  const resourceDocs = [
    { title: "Undergraduate NEP Syllabus 2026", cat: "Syllabus", link: ASSETS.documents.academics.ugSyllabus, fn: "ug-nep-syllabus-2026.pdf" },
    { title: "Postgraduate CBCS Syllabus 2026", cat: "Syllabus", link: ASSETS.documents.academics.pgSyllabus, fn: "pg-cbcs-syllabus-2026.pdf" },
    { title: "NEP 2020 Academic Regulations Manual", cat: "Regulations", link: ASSETS.documents.academics.nepRegulations, fn: "nep-2020-academic-regulations.pdf" },
    { title: "Institutional Admissions Prospectus 2026-27", cat: "Prospectus", link: ASSETS.documents.admissions.prospectus, fn: "st-philomena-prospectus-2026-27.pdf" },
    { title: "Academic Year Calendar & Holiday Schedule", cat: "Calendar", link: ASSETS.documents.examinations.academicCalendar, fn: "academic-calendar-2026.pdf" },
    { title: "Outcome-Based Education (OBE) Manual", cat: "OBE", link: ASSETS.documents.academics.obeManual, fn: "obe-outcomes-manual.pdf" }
  ];

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Digital Repository</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">Academic Resources & Documents Hub</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Access the central library catalog, syllabus repository, e-content modules, academic calendar, OBE outcomes manual, and downloadable college forms.
        </p>
      </div>

      {/* Document Grid */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">Official Downloadable Documents & Syllabi</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {resourceDocs.map((doc, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center gap-4">
              <div className="space-y-1 overflow-hidden">
                <span className="bg-blue-100 text-[#1C5496] font-bold text-[10px] px-2 py-0.5 rounded uppercase">{doc.cat}</span>
                <h4 className="font-serif font-bold text-xs text-slate-900 truncate" title={doc.title}>{doc.title}</h4>
              </div>
              <a
                href={doc.link}
                download={doc.fn}
                className="btn-primary-blue px-3.5 py-1.5 rounded-md text-xs font-bold shrink-0 flex items-center"
              >
                <Download className="w-3.5 h-3.5 mr-1" />
                <span>Download PDF</span>
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
