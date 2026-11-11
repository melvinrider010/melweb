import React, { useState } from 'react';
import { Layers, FileText, BookOpen } from 'lucide-react';
import PDFViewerEmbed from '../common/PDFViewerEmbed';
import ViewAsBookButton from '../common/ViewAsBookButton';

export default function NepRegulationsView() {
  const complianceDocs = [
    { title: 'National Education Policy 2020 Statutes & Regulations', type: 'Primary Regulation PDF', path: '/assets/documents/academics/NEP-Statutes-2-HOURS-Exam-Final-22th-March-2022.pdf' },
    { title: 'NEP 2020 Academic Regulations & Framework', type: 'Curricular Framework PDF', path: '/assets/documents/academics/nep-2020-academic-regulations.pdf' },
    { title: 'Autonomous Academic Regulations & Statutes', type: 'Statutory Framework PDF', path: '/assets/documents/academic-regulations.pdf' },
    { title: 'BSW Revised NEP Regulations (Sem V & VI)', type: 'Departmental Regulation PDF', path: '/assets/documents/academics/BSW-revised-NEP-5-6.pdf' },
    { title: 'Physics NEP Framework & Curriculum (Sem V & VI)', type: 'Curricular Framework PDF', path: '/assets/documents/academics/Physics-NEP-V-and-VI-Semesters-2024-2025.pdf' }
  ];

  const [selectedDoc, setSelectedDoc] = useState(complianceDocs[0]);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Layers className="w-5 h-5 text-[#C9A84C]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#a88530]">
              National Education Policy Framework
            </span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0B1F4E]">
            NEP 2020 Regulations & Academic Framework
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            Autonomous curriculum structure and guidelines prescribed under UGC & Karnataka State Higher Education Council (KSHEC).
          </p>
        </div>

        <ViewAsBookButton
          pdfUrl={selectedDoc.path}
          title={selectedDoc.title}
          label="Open Regulations (3D Book)"
          size="md"
        />
      </div>

      {/* SIDE-BY-SIDE SPLIT VIEW: Regulations List (Left) + Interactive Live Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Searchable Regulations List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
          
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <h3 className="font-serif font-bold text-sm text-[#0B1F4E]">
              Statutory Regulations & Frameworks
            </h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              {complianceDocs.length} Documents
            </span>
          </div>

          {/* List of Documents */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
            {complianceDocs.map((doc, idx) => {
              const isSelected = selectedDoc?.path === doc.path;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-blue-50/90 border-l-4 border-[#1C5496]'
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="font-mono font-bold text-[10px] text-[#1C5496] bg-blue-100/60 px-2 py-0.5 rounded uppercase tracking-wider block w-max">
                      {doc.type}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                      {doc.title}
                    </h4>
                  </div>

                  <div className="shrink-0" onClick={(e) => e.stopPropagation()}>
                    <ViewAsBookButton
                      pdfUrl={doc.path}
                      title={doc.title}
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
                  Live Regulations Document
                </span>
                <h3 className="font-serif font-bold text-sm text-white truncate">
                  {selectedDoc.title}
                </h3>
              </div>
            </div>

            <ViewAsBookButton
              pdfUrl={selectedDoc.path}
              title={selectedDoc.title}
              label="Open 3D Flipbook"
              size="sm"
            />
          </div>

          {/* Embedded Interactive Viewer */}
          <div className="flex-1 w-full relative bg-slate-900 overflow-hidden">
            <PDFViewerEmbed
              src={selectedDoc.path}
              title={selectedDoc.title}
              height="100%"
              badge="Official Statutes PDF"
            />
          </div>

        </div>

      </div>

      {/* 4-Year Progressive Degree Framework Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { year: 'Year 1 (Sem I & II)', title: 'Undergraduate Certificate', credits: '40–44 Credits', desc: 'Core discipline fundamentals + Skill Development (SEC) + Value Added (VAC).' },
          { year: 'Year 2 (Sem III & IV)', title: 'Undergraduate Diploma', credits: '80–88 Credits', desc: 'Advanced major & minor discipline specialization with mandatory summer vocational internship.' },
          { year: 'Year 3 (Sem V & VI)', title: 'Bachelor Degree (B.A / B.Sc / B.Com)', credits: '120–132 Credits', desc: 'Complete major subject mastery, discipline electives, and career employability readiness.' },
          { year: 'Year 4 (Sem VII & VIII)', title: 'Bachelor Degree (Honours / Research)', credits: '160–176 Credits', desc: 'In-depth research methodology, dissertation thesis, and direct eligibility for Ph.D admission.' }
        ].map((stage, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="space-y-2">
              <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-[11px] px-2.5 py-1 rounded inline-block">
                {stage.year}
              </span>
              <h3 className="font-serif font-bold text-base text-slate-900 leading-snug">{stage.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{stage.desc}</p>
            </div>
            <div className="pt-3 border-t border-slate-100 text-xs font-bold text-[#1C5496] font-mono">
              {stage.credits}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
