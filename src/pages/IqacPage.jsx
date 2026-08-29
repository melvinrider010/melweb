import React from 'react';
import { Award, ShieldCheck, FileText, Download } from 'lucide-react';
import { ASSETS } from '../data/assets';

export default function IqacPage() {
  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Internal Quality Assurance Cell</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">IQAC Quality Portal & AQAR</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          The Internal Quality Assurance Cell (IQAC) of St. Philomena's College (Autonomous) ensures continuous quality enhancement in teaching-learning, curriculum design, research output, institutional governance, and stakeholder feedback.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <h3 className="font-serif font-bold text-lg text-slate-900">Annual Quality Assurance Reports (AQAR)</h3>
          <p className="text-xs text-slate-600 leading-relaxed">View submitted AQAR records for NAAC quality compliance across previous academic years.</p>
          <a
            href={ASSETS.documents.iqac.aqar}
            download="aqar-quality-assurance-report-2025.pdf"
            className="btn-primary-blue px-4 py-2 rounded-md text-xs font-bold inline-flex items-center"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Download AQAR Reports PDF</span>
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <h3 className="font-serif font-bold text-lg text-slate-900">Stakeholder Feedback Reports</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Structured feedback collected from students, parents, alumni, and employers on curriculum and infrastructure.</p>
          <a
            href={ASSETS.documents.iqac.feedback}
            download="stakeholder-feedback-report-2025.pdf"
            className="btn-gold px-4 py-2 rounded-md text-xs font-bold inline-flex items-center"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Download Feedback Action Report PDF</span>
          </a>
        </div>
      </div>

    </div>
  );
}
