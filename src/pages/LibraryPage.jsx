import React from 'react';
import { 
  BookOpen, 
  Download, 
  ExternalLink, 
  Clock, 
  Layers, 
  FileText, 
  CheckCircle2, 
  Search, 
  ShieldCheck, 
  BookmarkCheck,
  Building2,
  Users
} from 'lucide-react';
import libraryData from '../data/libraryData.json';

export default function LibraryPage() {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-10">

        {/* 1. HERO BANNER */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#1C5496] text-white font-mono font-bold text-xs px-3 py-1 rounded-md tracking-wider">
              ACADEMIC COMMONS
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 font-sans font-bold text-xs px-3 py-1 rounded-md">
              Automated Koha ILMS & RFID
            </span>
            <span className="bg-emerald-50 text-emerald-800 font-sans font-semibold text-xs px-3 py-1 rounded-md border border-emerald-200/60 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> INFLIBNET N-LIST & DELNET Member
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900">
              {libraryData.title}
            </h1>
            <p className="text-amber-800 font-serif italic text-base sm:text-lg">
              {libraryData.tagline}
            </p>
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base max-w-4xl leading-relaxed font-sans pt-1">
              {libraryData.description}
            </p>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-100 text-center">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Print Books</span>
              <span className="font-serif font-extrabold text-xl text-[#1C5496]">{libraryData.metrics.totalPrintBooks}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">E-Journals</span>
              <span className="font-serif font-extrabold text-xl text-emerald-700">{libraryData.metrics.eJournals}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">E-Books</span>
              <span className="font-serif font-extrabold text-xl text-amber-700">{libraryData.metrics.eBooks}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Rare Works</span>
              <span className="font-serif font-extrabold text-xl text-indigo-700">{libraryData.metrics.rareManuscripts}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Workstations</span>
              <span className="font-serif font-extrabold text-xl text-slate-900">{libraryData.metrics.digitalWorkstations}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Reading Capacity</span>
              <span className="font-serif font-extrabold text-xl text-slate-900">{libraryData.metrics.seatingCapacity}</span>
            </div>
          </div>
        </div>

        {/* 2. DIGITAL COMMONS & ONLINE GATEWAYS */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">
              E-RESOURCES & DIGITAL DATABASES
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">
              National & International Digital Commons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {libraryData.digitalResources.map((res, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between space-y-4 hover:shadow-md transition-all">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-[10.5px] px-2.5 py-1 rounded-md uppercase">
                      {res.badge}
                    </span>
                    <BookmarkCheck className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">
                    {res.name}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {res.desc}
                  </p>
                </div>

                <a
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-blue py-2.5 px-4 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center space-x-2"
                >
                  <span>Access Portal Gateway</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* 3. TIMINGS & DOWNLOADABLE MANUALS (LOCAL OFFLINE PDFS) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Operating Hours */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
            <div className="flex items-center space-x-3 text-[#1C5496]">
              <Clock className="w-6 h-6" />
              <h3 className="font-serif font-bold text-xl text-slate-900">Library Operating Schedule</h3>
            </div>
            
            <div className="space-y-3 text-xs sm:text-sm font-sans divide-y divide-slate-100">
              <div className="flex justify-between py-2">
                <span className="text-slate-600 font-semibold">Monday to Friday:</span>
                <span className="font-mono font-bold text-slate-900">{libraryData.timings.weekdays}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600 font-semibold">Saturdays:</span>
                <span className="font-mono font-bold text-slate-900">{libraryData.timings.saturdays}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-slate-600 font-semibold">Semester Exam Duration:</span>
                <span className="font-mono font-bold text-emerald-700">{libraryData.timings.examPeriod}</span>
              </div>
            </div>
          </div>

          {/* Downloadable Library Manuals (Local Storage) */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 space-y-5 shadow-xs">
            <div className="flex items-center space-x-3 text-[#1C5496]">
              <FileText className="w-6 h-6" />
              <h3 className="font-serif font-bold text-xl text-slate-900">Official Local Library Manuals</h3>
            </div>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center gap-3">
                <div className="overflow-hidden">
                  <h4 className="font-serif font-bold text-xs text-slate-900">Library Rules & User Code of Conduct</h4>
                  <span className="text-[10px] text-slate-500 font-mono">PDF • Stored Locally</span>
                </div>
                <a
                  href={libraryData.rulesDoc}
                  download="library-rules-and-regulations-manual.pdf"
                  className="btn-primary-blue px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center gap-3">
                <div className="overflow-hidden">
                  <h4 className="font-serif font-bold text-xs text-slate-900">Koha Web OPAC Online Catalog User Guide</h4>
                  <span className="text-[10px] text-slate-500 font-mono">PDF • Stored Locally</span>
                </div>
                <a
                  href={libraryData.opacGuideDoc}
                  download="koha-opac-digital-catalog-guide.pdf"
                  className="btn-primary-blue px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 flex items-center space-x-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </a>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
