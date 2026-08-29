import React from 'react';
import { ShieldCheck, FileText, Download, CheckCircle2 } from 'lucide-react';
import { ASSETS } from '../data/assets';

export default function MandatoryDisclosurePage() {
  const disclosures = [
    { title: "UGC Autonomous Approval Order & UGC 2(F)/12(B)", dept: "UGC", link: ASSETS.documents.mandatoryDisclosure.ugcCertificates, filename: "ugc-2f-12b-recognition-certificate.pdf" },
    { title: "AICTE MCA & MBA Extension of Approval (EOA)", dept: "AICTE", link: ASSETS.documents.mandatoryDisclosure.aicteEoa, filename: "aicte-extension-of-approval-2026.pdf" },
    { title: "Institutional Code of Conduct & Professional Ethics", dept: "Governing Body", link: ASSETS.documents.mandatoryDisclosure.codeOfConduct, filename: "code-of-conduct-ethics-manual.pdf" },
    { title: "Anti-Ragging Committee Regulations & Helpline", dept: "Compliance", link: ASSETS.documents.mandatoryDisclosure.antiRagging, filename: "anti-ragging-regulations-2026.pdf" },
    { title: "Internal Complaints Committee (ICC) Policy", dept: "Women Cell", link: ASSETS.documents.mandatoryDisclosure.iccPolicy, filename: "icc-policy-document.pdf" },
    { title: "UGC Fee Refund Policy Guidelines", dept: "Finance", link: ASSETS.documents.mandatoryDisclosure.feeRefund, filename: "ugc-fee-refund-policy.pdf" },
    { title: "RTI Act Public Information Officers List", dept: "Administration", link: ASSETS.documents.mandatoryDisclosure.rtiOfficers, filename: "rti-public-information-officers.pdf" }
  ];

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Statutory Compliance & Regulatory Data</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">Mandatory Institutional Disclosures</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Public statutory disclosures mandated by the University Grants Commission (UGC), All India Council for Technical Education (AICTE), and University of Mysore (UoM).
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3">Regulatory & Statutory Certificates</h2>
        <div className="space-y-3">
          {disclosures.map((item, idx) => (
            <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="space-y-1">
                <span className="bg-blue-100 text-[#1C5496] font-bold text-[10px] px-2 py-0.5 rounded">{item.dept}</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">{item.title}</h4>
              </div>
              <a
                href={item.link}
                download={item.filename}
                className="btn-primary-blue px-4 py-2 rounded-md text-xs font-bold shrink-0 flex items-center"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" />
                <span>Download Official PDF</span>
              </a>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
