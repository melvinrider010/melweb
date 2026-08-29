import React from 'react';
import { Sparkles, Award, ExternalLink, Download } from 'lucide-react';
import { ASSETS } from '../data/assets';

export default function IicPage() {
  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Ministry of Education Innovation Cell</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">Institution's Innovation Council (IIC)</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          The Institution's Innovation Council (IIC) at St. Philomena's College promotes student entrepreneurship, ideation hackathons, technology commercialization, and patent filing.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <Sparkles className="w-6 h-6 text-[#1C5496]" />
          <h3 className="font-serif font-bold text-lg text-slate-900">Innovation Activities</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Organizing annual hackathons, startup bootcamps, and interaction sessions with successful entrepreneurs.</p>
          <a href={ASSETS.documents.iic.rating} download="iic-star-rating-certificate-2025.pdf" className="text-xs font-bold text-[#1C5496] hover:underline flex items-center pt-1">
            <Download className="w-3.5 h-3.5 mr-1" /> Download IIC Report PDF
          </a>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <Award className="w-6 h-6 text-[#1C5496]" />
          <h3 className="font-serif font-bold text-lg text-slate-900">IIC Star Rating</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Consistently rated as a top-tier Innovation Council by MoE's Innovation Cell (MIC), Govt of India.</p>
          <a href={ASSETS.documents.iic.rating} download="iic-star-rating-certificate-2025.pdf" className="text-xs font-bold text-[#1C5496] hover:underline flex items-center pt-1">
            <Download className="w-3.5 h-3.5 mr-1" /> View Star Rating Certificate PDF
          </a>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <ExternalLink className="w-6 h-6 text-[#1C5496]" />
          <h3 className="font-serif font-bold text-lg text-slate-900">NISP Policy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Implementation of National Innovation and Start-up Policy (NISP) for faculty and student innovators.</p>
          <a href={ASSETS.documents.iic.nisp} download="national-innovation-startup-policy.pdf" className="text-xs font-bold text-[#1C5496] hover:underline flex items-center pt-1">
            <Download className="w-3.5 h-3.5 mr-1" /> Download NISP Policy PDF
          </a>
        </div>
      </div>
    </div>
  );
}
