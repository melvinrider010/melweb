import React from 'react';
import { Award, FileText, Download } from 'lucide-react';
import { ASSETS } from '../data/assets';

export default function NirfPage() {
  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">National Institutional Ranking Framework</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">NIRF Data & Institutional Submissions</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          St. Philomena's College (Autonomous) submits annual institutional data under the National Institutional Ranking Framework (NIRF), Ministry of Education, Government of India.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">NIRF Overall & College Category Data Reports</h2>
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
          <div>
            <h4 className="font-serif font-bold text-sm text-slate-900">NIRF Institutional Data Report 2026</h4>
            <p className="text-xs text-slate-500">Official data report submitted for NIRF College Ranking</p>
          </div>
          <a
            href={ASSETS.documents.nirf.report}
            download="nirf-data-submission-report-2026.pdf"
            className="btn-primary-blue px-4 py-2 rounded-md text-xs font-bold shrink-0 flex items-center"
          >
            <Download className="w-3.5 h-3.5 mr-1.5" />
            <span>Download Report PDF</span>
          </a>
        </div>
      </div>
    </div>
  );
}
