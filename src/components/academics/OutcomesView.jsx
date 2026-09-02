import React, { useState } from 'react';
import { Target, CheckCircle2, Award, BookOpen, Download, FileText, Sparkles, Eye } from 'lucide-react';
import PDFViewerEmbed from '../common/PDFViewerEmbed';

export default function OutcomesView() {
  const [selectedDoc, setSelectedDoc] = useState('/assets/documents/academics/OBE-13-04-2024.pdf');

  const attainmentDocs = [
    { title: 'Official Institutional OBE Manual 2024', dept: 'Autonomous Examination Board', file: '/assets/documents/academics/OBE-13-04-2024.pdf', isPdf: true },
    { title: 'PG Biochemistry 2021-23 POs & PSOs Attainment', dept: 'Biochemistry', file: '/assets/documents/academics/PG-BIOCHEM-2021-23-Batch-POs-PSOs-Attained.docx', isPdf: false },
    { title: 'M.Com 2021-23 Batch PO-PSOs Attainment', dept: 'Commerce', file: '/assets/documents/academics/M.Com-2021-23-Batch-PO-PSOs-Attained.docx', isPdf: false },
    { title: 'PG Chemistry 2021-23 Batch POs-PSOs Attainment', dept: 'Chemistry', file: '/assets/documents/academics/PG-Chemistry-2021-23-Batch-POs-PSOs-Attained.docx', isPdf: false },
    { title: 'PG Computer Science 2021-23 Batch POs-PSOs Attainment', dept: 'Computer Science', file: '/assets/documents/academics/PG-Computer-Science-2021-23-Batch-POs-PSOs-Attained.docx', isPdf: false },
    { title: 'PG Physics 2021-23 Batch POs-PSOs Attainment', dept: 'Physics', file: '/assets/documents/academics/PG-Physics-2021-23-Batch-POs-PSOs-Attained.docx', isPdf: false },
    { title: 'PG Economics 2021-23 Batch POs-PSOs Attainment', dept: 'Economics', file: '/assets/documents/academics/PG-ECONOMICS-2021-23-Batch-POs-PSOs-Attained.docx', isPdf: false },
    { title: 'M.A English 2021-23 Batch POs-PSOs Attainment', dept: 'English', file: '/assets/documents/academics/M.A-English-2021-23-Batch-POs-PSOs-Attained.docx', isPdf: false },
    { title: 'PG Journalism 2021-23 Batch POs & PSOs Attainment', dept: 'Journalism', file: '/assets/documents/academics/PG-JOURNALISM-2021-23-Batch-POs-PSOs-Attained.docx', isPdf: false },
    { title: 'PG Mathematics 2021-23 Batch POs-PSOs Attainment', dept: 'Mathematics', file: '/assets/documents/academics/PG-Maths-2021-23-Batch-POs-PSOs-Attained.docx', isPdf: false },
    { title: 'MSW 2021-23 Batch POs & PSOs Attainment', dept: 'Social Work', file: '/assets/documents/academics/MSW-2021-23-Batch-POs-PSOs-Attained.docx', isPdf: false }
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Target className="w-5 h-5 text-[#C9A84C]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#a88530]">
              Outcome Based Education (OBE)
            </span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0B1F4E]">
            Program Outcomes (POs) & Course Outcomes (COs)
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            Institutional graduate attributes, competency assessments, and official Outcome-Based Education (OBE) manual.
          </p>
        </div>

        <a
          href="/assets/documents/academics/OBE-13-04-2024.pdf"
          download
          className="btn-gold px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 shrink-0 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download OBE Manual (PDF)</span>
        </a>
      </div>

      {/* Embedded Interactive PDF Viewer */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-serif font-bold text-lg text-[#0B1F4E] flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#1C5496]" />
            <span>Interactive Outcome Based Education (OBE) Document Viewer</span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Official OBE Manual (April 2024 Edition)
          </span>
        </div>

        <PDFViewerEmbed
          src={selectedDoc}
          title="Outcome Based Education (OBE) Manual - St. Philomena's College (Autonomous)"
          height="820px"
          badge="Autonomous Manual"
        />
      </div>

      {/* Official PO-PSO Attainment Documentation Grid */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#0B1F4E]">Departmental PO & PSO Attainment Reports</h3>
            <p className="text-xs text-slate-500">Official verified assessment data for postgraduate cohorts.</p>
          </div>
          <span className="bg-emerald-50 text-emerald-800 font-mono font-bold text-xs px-3 py-1 rounded-md">
            10 Attainment Reports
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attainmentDocs.map((doc, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="space-y-0.5 truncate">
                <span className="text-[10px] font-mono font-bold uppercase text-[#1C5496] tracking-wider">{doc.dept}</span>
                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate">{doc.title}</h4>
              </div>
              <div className="flex items-center space-x-1.5 shrink-0">
                {doc.isPdf && (
                  <button
                    onClick={() => setSelectedDoc(doc.file)}
                    className="px-2.5 py-1.5 bg-[#0B1F4E] hover:bg-[#1C5496] text-white rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                )}
                <a
                  href={doc.file}
                  download
                  className="px-3 py-1.5 bg-[#FFD84A] hover:bg-[#ffcd1f] text-slate-900 rounded-lg text-xs font-bold shrink-0 flex items-center space-x-1 shadow-2xs cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>{doc.isPdf ? 'PDF' : 'DOC'}</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
