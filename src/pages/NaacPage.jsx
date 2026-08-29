import React from 'react';
import { Award, ShieldCheck, Download } from 'lucide-react';
import { ASSETS } from '../data/assets';

export default function NaacPage() {
  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      <div className="bg-[#071A33] text-white p-8 sm:p-12 rounded-2xl border-l-8 border-[#FFC928] shadow-md space-y-4">
        <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest block">National Assessment & Accreditation Council</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-white">NAAC Cycle III Accreditation (Grade B++)</h1>
        <p className="text-slate-300 max-w-3xl text-xs sm:text-sm leading-relaxed">
          St. Philomena's College (Autonomous), Mysuru has been re-accredited by NAAC with Cycle III Grade B++ (CGPA 2.84). Access official accreditation certificates, Self Study Reports (SSR), and Peer Team Evaluation documents.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">Official NAAC Accreditation Documents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <h4 className="font-serif font-bold text-sm text-slate-900">NAAC Cycle III Certificate & Grade Sheet</h4>
              <p className="text-xs text-slate-500">Official NAAC Accreditation Grade B++ Certificate</p>
            </div>
            <a
              href={ASSETS.documents.naac.certificate}
              download="naac-cycle-iii-accreditation-certificate.pdf"
              className="btn-primary-blue px-3.5 py-1.5 rounded-md text-xs font-bold shrink-0 flex items-center"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Download PDF</span>
            </a>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
            <div>
              <h4 className="font-serif font-bold text-sm text-slate-900">Self Study Report (SSR Cycle III)</h4>
              <p className="text-xs text-slate-500">Comprehensive institutional SSR report submitted to NAAC</p>
            </div>
            <a
              href={ASSETS.documents.naac.ssr}
              download="naac-self-study-report-ssr.pdf"
              className="btn-primary-blue px-3.5 py-1.5 rounded-md text-xs font-bold shrink-0 flex items-center"
            >
              <Download className="w-3.5 h-3.5 mr-1" />
              <span>Download PDF</span>
            </a>
          </div>
        </div>
      </div>

    </div>
  );
}
