import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  FileText, 
  Download, 
  CheckCircle2, 
  ExternalLink, 
  Eye, 
  Search, 
  Building2, 
  Award,
  Globe,
  Landmark,
  Scale,
  BookOpen
} from 'lucide-react';
import { COMPLIANCE_SECTIONS } from '../data/complianceData';

export default function MandatoryDisclosurePage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');

  const categories = ['All', 'MANDATORY DISCLOSURE', 'UGC MANDATORY DISCLOSURE', 'IMPORTANT LINKS & APPROVALS', 'GOVERNMENT & APEX REGULATORY PORTALS'];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-10">

        {/* 1. INSTITUTIONAL STATUTORY BANNER */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#1C5496] text-white font-mono font-bold text-xs px-3 py-1 rounded-md tracking-wider uppercase">
              Regulatory Compliance & Public Disclosure
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs px-3 py-1 rounded-md">
              UGC & AICTE Autonomous Directives
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs px-3 py-1 rounded-md flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> 100% Verified
            </span>
          </div>

          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
            Mandatory Disclosures & Statutory Compliance
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed font-sans">
            In compliance with directives issued by the University Grants Commission (UGC), All India Council for Technical Education (AICTE), Ministry of Education (MoE), and the University of Mysore, St. Philomena's College (Autonomous) makes all statutory approvals, accreditation certificates, institutional committees, code of ethics, and governance reports publicly accessible.
          </p>

          {/* Search and Category Filter */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search compliance documents, 2(f), 12(B), AICTE, UGC, policies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#1C5496] focus:bg-white transition-colors"
              />
            </div>

            <div className="sm:col-span-6 flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCat(cat)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    selectedCat === cat
                      ? 'bg-[#1C5496] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'All' ? 'All Sections' : cat.replace('& APEX REGULATORY', '')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. COMPLIANCE SECTIONS (FULL CONTENT PARITY) */}
        <div className="space-y-12">
          {COMPLIANCE_SECTIONS.filter(sec => selectedCat === 'All' || sec.category === selectedCat).map((sec, sIdx) => {
            const filteredItems = sec.items.filter(item => 
              item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              (item.subtitle && item.subtitle.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (item.dept && item.dept.toLowerCase().includes(searchTerm.toLowerCase())) ||
              (item.details && item.details.toLowerCase().includes(searchTerm.toLowerCase()))
            );

            if (filteredItems.length === 0) return null;

            return (
              <div key={sIdx} className="space-y-5 animate-fadeIn">
                
                {/* Section Header */}
                <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="space-y-0.5">
                    <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">
                      {sec.badge}
                    </span>
                    <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">
                      {sec.category}
                    </h2>
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full">
                    {filteredItems.length} Disclosures Listed
                  </span>
                </div>

                <p className="text-xs text-slate-500 font-sans -mt-2">
                  {sec.description}
                </p>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-1">
                  {filteredItems.map((item) => {
                    const isExternal = Boolean(item.externalUrl && !item.pdfUrl);

                    return (
                      <div
                        key={item.id}
                        className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#1C5496] hover:shadow-md transition-all flex flex-col justify-between group space-y-3"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="bg-blue-50 text-[#1C5496] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase">
                              {item.dept}
                            </span>
                            {item.date && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                {item.date}
                              </span>
                            )}
                          </div>

                          <h3 className="font-heading font-semibold text-sm sm:text-base text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
                            {item.title}
                          </h3>

                          {item.subtitle && (
                            <p className="text-[11px] text-slate-500 font-medium line-clamp-1">
                              {item.subtitle}
                            </p>
                          )}

                          {item.details && (
                            <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 font-sans pt-1">
                              {item.details}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                          {isExternal ? (
                            <a
                              href={item.externalUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="w-full py-2 px-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 inline-flex items-center justify-center transition-colors group-hover:border-[#1C5496]"
                            >
                              <span>Official Govt Portal</span>
                              <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-[#1C5496]" />
                            </a>
                          ) : (
                            <>
                              <Link
                                to={`/compliance/${item.slug}`}
                                className="w-full btn-primary-blue py-2 px-3 rounded-xl text-xs font-bold inline-flex items-center justify-center text-center shadow-xs"
                              >
                                <Eye className="w-3.5 h-3.5 mr-1.5" />
                                <span>View Document</span>
                              </Link>
                              <a
                                href={item.pdfUrl}
                                download={`${item.slug}.pdf`}
                                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors shrink-0"
                                title="Download PDF"
                              >
                                <Download className="w-3.5 h-3.5" />
                              </a>
                            </>
                          )}
                        </div>

                      </div>
                    );
                  })}
                </div>

              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
