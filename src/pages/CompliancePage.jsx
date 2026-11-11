import React from 'react';
import { Award, ShieldCheck, FileText, Download } from 'lucide-react';
import { ASSETS } from '../data/assets';

export default function CompliancePage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 space-y-10 text-[#071A33]">
      
      <div className="bg-[#071A33] text-white rounded-2xl p-8 sm:p-12 border-l-8 border-[#FFC928] shadow-md space-y-4">
        <span className="text-[#FFD84A] font-semibold text-xs uppercase tracking-widest block">Quality Assurance</span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white">IQAC, NAAC & Statutory Disclosures</h1>
        <p className="text-slate-300 max-w-3xl text-xs sm:text-sm leading-relaxed">
          Internal Quality Assurance Cell (IQAC), NAAC Accreditation (Cycle III B++ Grade), AQAR reports, NIRF rankings, and mandatory UGC public disclosures.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-xs space-y-6">
        <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900 border-b border-slate-100 pb-3">Mandatory Public Disclosures</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <a
            href={ASSETS.documents.mandatoryDisclosure.ugcCertificates}
            download="ugc-undertaking-certificate.pdf"
            className="p-4 border border-slate-200 rounded-xl hover:border-[#1C5496] transition-colors flex items-center justify-between bg-slate-50"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">UGC Undertaking Certificate</span>
              <span className="text-[10px] text-slate-500">Official UGC 2(F) & 12(B) Recognition</span>
            </div>
            <Download className="w-4 h-4 text-[#1C5496] shrink-0" />
          </a>

          <a
            href={ASSETS.documents.naac.certificate}
            download="naac-cycle-iii-accreditation-certificate.pdf"
            className="p-4 border border-slate-200 rounded-xl hover:border-[#1C5496] transition-colors flex items-center justify-between bg-slate-50"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">NAAC Accreditation Certificate</span>
              <span className="text-[10px] text-slate-500">Cycle III Grade B++ Certificate</span>
            </div>
            <Download className="w-4 h-4 text-[#1C5496] shrink-0" />
          </a>

          <a
            href={ASSETS.documents.iqac.aqar}
            download="aqar-quality-assurance-report-2025.pdf"
            className="p-4 border border-slate-200 rounded-xl hover:border-[#1C5496] transition-colors flex items-center justify-between bg-slate-50"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">Annual Quality Assurance Report (AQAR)</span>
              <span className="text-[10px] text-slate-500">IQAC Annual Report Submission</span>
            </div>
            <Download className="w-4 h-4 text-[#1C5496] shrink-0" />
          </a>

          <a
            href={ASSETS.documents.nirf.report}
            download="nirf-data-submission-report-2026.pdf"
            className="p-4 border border-slate-200 rounded-xl hover:border-[#1C5496] transition-colors flex items-center justify-between bg-slate-50"
          >
            <div className="space-y-0.5">
              <span className="text-xs font-bold text-slate-900 block">NIRF Institutional Data 2026</span>
              <span className="text-[10px] text-slate-500">NIRF Ministry of Education Submission</span>
            </div>
            <Download className="w-4 h-4 text-[#1C5496] shrink-0" />
          </a>
        </div>
      </div>

    </div>
  );
}
