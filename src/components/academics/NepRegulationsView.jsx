import React, { useState } from 'react';
import { Layers, CheckCircle2, FileText, Download, Award, BookOpen, Eye } from 'lucide-react';
import PDFViewerEmbed from '../common/PDFViewerEmbed';
import PDFModalViewer from '../common/PDFModalViewer';

export default function NepRegulationsView() {
  const [selectedPdf, setSelectedPdf] = useState('/assets/documents/academics/NEP-Statutes-2-HOURS-Exam-Final-22th-March-2022.pdf');
  const [modalPdf, setModalPdf] = useState(null);

  const complianceDocs = [
    { title: 'National Education Policy 2020 Statutes & Regulations', type: 'Primary Regulation PDF', path: '/assets/documents/academics/NEP-Statutes-2-HOURS-Exam-Final-22th-March-2022.pdf' },
    { title: 'Official Institutional Fee Structure (UG & PG)', type: 'Statutory PDF Document', path: '/assets/documents/academics/SKM_C30813010105381-2Fees-Structure.pdf' },
    { title: 'Statutory Undertaking Certificate', type: 'Statutory PDF Document', path: '/assets/documents/academics/undertakingCertificate.pdf' },
    { title: 'AICTE Extension of Approval (EOA) 2025-26', type: 'Approval PDF Document', path: '/assets/documents/academics/EOA-Report-2025-26.pdf' },
    { title: "Institution's Innovation Council (IIC) Establishment", type: 'Establishment PDF Document', path: '/assets/documents/academics/EstablismentCertificate.pdf' }
  ];

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

        <a
          href="/assets/documents/academics/NEP-Statutes-2-HOURS-Exam-Final-22th-March-2022.pdf"
          download
          className="btn-gold px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 shrink-0 self-start md:self-auto cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download NEP Statutes (PDF)</span>
        </a>
      </div>

      {/* Embedded Interactive PDF Viewer (Exactly as on stphilos.ac.in/nep-regulations/) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="font-serif font-bold text-lg text-[#0B1F4E] flex items-center space-x-2">
            <FileText className="w-5 h-5 text-[#1C5496]" />
            <span>Interactive Regulations Document Viewer</span>
          </h3>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Interactive Page Flip / Scroll
          </span>
        </div>

        <PDFViewerEmbed
          src={selectedPdf}
          title="National Education Policy 2020 Regulations - St. Philomena's College (Autonomous)"
          height="820px"
          badge="Official Statutes PDF"
        />
      </div>

      {/* Statutory Regulations & Compliance Document Downloads */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
        <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
          <div>
            <h3 className="font-serif font-bold text-xl text-[#0B1F4E]">Statutory Documents & Additional Regulations</h3>
            <p className="text-xs text-slate-500">Click to preview in document viewer or download locally.</p>
          </div>
          <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-xs px-3 py-1 rounded-md">
            5 Stored Documents
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {complianceDocs.map((doc, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
              <div className="space-y-0.5 truncate">
                <span className="text-[10px] font-mono font-bold uppercase text-[#1C5496] tracking-wider">{doc.type}</span>
                <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate">{doc.title}</h4>
              </div>
              <div className="flex items-center space-x-1.5 shrink-0">
                <button
                  onClick={() => setSelectedPdf(doc.path)}
                  className="px-2.5 py-1.5 bg-[#0B1F4E] hover:bg-[#1C5496] text-white rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                  title="View in main viewer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View</span>
                </button>
                <a
                  href={doc.path}
                  download
                  className="px-2.5 py-1.5 bg-[#FFD84A] hover:bg-[#ffcd1f] text-slate-900 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-2xs cursor-pointer"
                  title="Download local file"
                >
                  <Download className="w-3.5 h-3.5 text-slate-900" />
                  <span>PDF</span>
                </a>
              </div>
            </div>
          ))}
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

      {/* Modal Viewer */}
      <PDFModalViewer
        isOpen={Boolean(modalPdf)}
        onClose={() => setModalPdf(null)}
        pdfUrl={modalPdf?.path}
        title={modalPdf?.title}
      />

    </div>
  );
}
