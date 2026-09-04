import React, { useState } from 'react';
import { Target, FileText, BookOpen, Download } from 'lucide-react';
import PDFViewerEmbed from '../common/PDFViewerEmbed';
import ViewAsBookButton from '../common/ViewAsBookButton';

export default function OutcomesView() {
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

  const [selectedDoc, setSelectedDoc] = useState(attainmentDocs[0]);

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

        {selectedDoc.isPdf && (
          <ViewAsBookButton
            pdfUrl={selectedDoc.file}
            title={selectedDoc.title}
            label="Open Manual (3D Book)"
            size="md"
          />
        )}
      </div>

      {/* SIDE-BY-SIDE SPLIT VIEW: Reports List (Left) + Interactive Live Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Searchable Reports List (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[750px]">
          
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between shrink-0">
            <h3 className="font-serif font-bold text-sm text-[#0B1F4E]">
              OBE Manual & Attainment Reports
            </h3>
            <span className="text-[11px] font-mono text-slate-500 font-semibold">
              {attainmentDocs.length} Reports
            </span>
          </div>

          {/* List of Reports */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
            {attainmentDocs.map((doc, idx) => {
              const isSelected = selectedDoc?.title === doc.title;
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-4 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-amber-50/90 border-l-4 border-[#C9A84C]'
                      : 'hover:bg-slate-50 border-l-4 border-transparent'
                  }`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <span className="font-mono font-bold text-[10px] text-[#C9A84C] bg-amber-100/70 px-2 py-0.5 rounded uppercase tracking-wider block w-max">
                      {doc.dept}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">
                      {doc.title}
                    </h4>
                  </div>

                  <div className="shrink-0 flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                    {doc.isPdf ? (
                      <ViewAsBookButton
                        pdfUrl={doc.file}
                        title={doc.title}
                        size="sm"
                        className="text-xs px-3 py-1.5"
                      />
                    ) : (
                      <a
                        href={doc.file}
                        download
                        className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1 cursor-pointer"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download</span>
                      </a>
                    )}
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
                  {selectedDoc.title}
                </h3>
              </div>
            </div>

            {selectedDoc.isPdf ? (
              <ViewAsBookButton
                pdfUrl={selectedDoc.file}
                title={selectedDoc.title}
                label="Open 3D Flipbook"
                size="sm"
              />
            ) : (
              <a
                href={selectedDoc.file}
                download
                className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold inline-flex items-center space-x-1"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Report</span>
              </a>
            )}
          </div>

          {/* Embedded Interactive Viewer or Docx Card */}
          <div className="flex-1 w-full relative bg-slate-900 overflow-hidden flex items-center justify-center">
            {selectedDoc.isPdf ? (
              <PDFViewerEmbed
                src={selectedDoc.file}
                title={selectedDoc.title}
                height="100%"
                badge="Outcome Based Education"
              />
            ) : (
              <div className="p-8 text-center space-y-4 max-w-md">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-[#FFD84A]">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-white font-serif font-bold text-lg">{selectedDoc.title}</h3>
                <p className="text-xs text-slate-300">This departmental attainment dataset is stored in DOCX format. Click below to download the official verified report.</p>
                <a
                  href={selectedDoc.file}
                  download
                  className="btn-gold px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Attainment Report</span>
                </a>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
