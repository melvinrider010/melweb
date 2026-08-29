import React from 'react';
import { Users, GraduationCap, Award, ExternalLink, Mail, Send, Download } from 'lucide-react';
import { ASSETS } from '../data/assets';

export default function AlumniPage() {
  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      <div className="bg-[#071A33] text-white p-8 sm:p-12 rounded-2xl border-l-8 border-[#FFC928] shadow-md space-y-4">
        <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest block">St. Philomena's Global Network</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-white">Alumni Association (SPCAA)</h1>
        <p className="text-slate-300 max-w-3xl text-xs sm:text-sm leading-relaxed">
          Connecting thousands of Philominites across the globe. Join the St. Philomena's College Alumni Association to participate in mentorship, scholarship support, and regional alumni chapters.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-slate-900">Alumni Registration Form</h2>
          <form onSubmit={(e) => { e.preventDefault(); alert("Thank you for registering with the St. Philomena's Alumni Network!"); }} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Full Name *</label>
                <input type="text" required placeholder="e.g. John D'Souza" className="w-full p-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:border-[#1C5496]" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email Address *</label>
                <input type="email" required placeholder="john@example.com" className="w-full p-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:border-[#1C5496]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Graduation Year</label>
                <input type="text" placeholder="e.g. 2018" className="w-full p-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:border-[#1C5496]" />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Degree / Course Completed</label>
                <input type="text" placeholder="e.g. B.Sc Physics" className="w-full p-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:border-[#1C5496]" />
              </div>
            </div>

            <button type="submit" className="btn-primary-blue px-6 py-2.5 rounded-md font-bold text-xs">
              Submit Alumni Registration
            </button>
          </form>
        </div>

        <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-slate-900">SPCAA Alumni Information</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Download official Alumni Association guidelines, chapter details, and annual report documents.
          </p>
          <a
            href={ASSETS.documents.general.brochure}
            download="spcaa-alumni-brochure.pdf"
            className="btn-gold px-5 py-2.5 rounded-md text-xs font-bold inline-flex items-center"
          >
            <Download className="w-4 h-4 mr-1.5" />
            <span>Download Alumni Brochure PDF</span>
          </a>
        </div>

      </div>

    </div>
  );
}
