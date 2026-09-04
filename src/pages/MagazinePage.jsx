import React, { useState } from 'react';
import { 
  BookOpen, 
  Download, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  Search, 
  Layers, 
  FileText 
} from 'lucide-react';
import magazineData from '../data/magazineData.json';
import ViewAsBookButton from '../components/common/ViewAsBookButton';
import DearFlipReader from '../components/common/DearFlipReader';

export default function MagazinePage() {
  const [selectedMag, setSelectedMag] = useState(magazineData[0]);
  const [isReadingFlipbook, setIsReadingFlipbook] = useState(false);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-10">

        {/* 1. HERO BANNER */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-xs space-y-4 border-l-8 border-[#C9A84C]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#1C5496] text-white font-mono font-bold text-xs px-3 py-1 rounded-md tracking-wider">
              ACADEMIC COMMONS
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 font-sans font-bold text-xs px-3 py-1 rounded-md">
              Annual Institutional Magazine
            </span>
            <span className="bg-emerald-50 text-emerald-800 font-sans font-semibold text-xs px-3 py-1 rounded-md border border-emerald-200/60 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Multilingual Student & Faculty Publications
            </span>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              Philomena — Annual College Magazine
            </h1>
            <p className="text-slate-600 text-xs sm:text-sm lg:text-base max-w-4xl leading-relaxed font-sans pt-1">
              The prestigious annual literary and creative compendium of St. Philomena's College (Autonomous), Mysuru. Celebrating over seven decades of creative writing, essays, multilingual poetry, departmental reports, sports chronicles, and alumni milestones with 3D interactive book flipbook animation and direct local offline PDF storage.
            </p>
          </div>
        </div>

        {/* 2. INTERACTIVE DEARFLIP READER EMBED */}
        {isReadingFlipbook && selectedMag && (
          <div className="space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-serif font-bold text-lg text-slate-900">
                  Interactive 3D Magazine Reader Active
                </span>
              </div>
              <button
                onClick={() => setIsReadingFlipbook(false)}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-200 px-3 py-1.5 rounded-lg cursor-pointer"
              >
                ✕ Close Reader
              </button>
            </div>

            <DearFlipReader
              journal={selectedMag}
              onClose={() => setIsReadingFlipbook(false)}
            />
          </div>
        )}

        {/* 3. CURRENT COMMEMORATIVE EDITION */}
        {!isReadingFlipbook && selectedMag && (
          <div className="bg-gradient-to-br from-[#071A33] via-[#0B254E] to-[#1C5496] text-white rounded-3xl p-6 sm:p-10 shadow-xl border border-slate-800 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* 3D Cover */}
            <div className="lg:col-span-4 flex justify-center">
              <div 
                onClick={() => setIsReadingFlipbook(true)}
                className="w-56 sm:w-64 aspect-[1/1.4] bg-gradient-to-br from-[#102B66] to-[#061226] rounded-2xl border-2 border-[#C9A84C] p-6 shadow-2xl flex flex-col justify-between cursor-pointer hover:scale-105 hover:rotate-1 transition-all duration-300 relative group overflow-hidden"
              >
                <div className="text-center space-y-2 border-b border-[#C9A84C]/40 pb-3">
                  <span className="text-[9px] font-mono tracking-widest text-[#F0D98C] uppercase font-bold block">
                    ST. PHILOMENA'S COLLEGE
                  </span>
                  <span className="text-[10px] font-mono text-slate-300 block">{selectedMag.volume}</span>
                </div>

                <div className="text-center space-y-2 my-auto">
                  <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#FFD84A] leading-tight">
                    PHILOMENA
                  </h3>
                  <span className="text-xs text-slate-200 block italic">
                    {selectedMag.year}
                  </span>
                </div>

                <div className="text-center border-t border-[#C9A84C]/40 pt-3 text-[10px] text-slate-300 font-mono">
                  <span>Click to Open 3D Magazine 📖</span>
                </div>
              </div>
            </div>

            {/* Content & Actions */}
            <div className="lg:col-span-8 space-y-5">
              <div className="space-y-2">
                <span className="text-[#FFD84A] font-mono text-xs uppercase font-bold tracking-widest block">
                  FEATURED ANNUAL PUBLICATION
                </span>
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-white">
                  {selectedMag.title}
                </h2>
                <p className="text-amber-200 font-serif italic text-sm sm:text-base">
                  {selectedMag.theme}
                </p>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                  {selectedMag.description}
                </p>
              </div>

              {/* Table of Contents Teaser */}
              <div className="bg-black/30 rounded-2xl p-4 border border-white/10 space-y-2 text-xs">
                <span className="font-serif font-bold text-[#FFD84A] block">Contents & Editorial Highlights:</span>
                <div className="space-y-1.5">
                  {(selectedMag.articles || []).slice(0, 4).map((art, idx) => (
                    <div key={idx} className="flex items-start space-x-2 text-slate-200">
                      <span className="text-amber-400 font-mono">p.{art.page}</span>
                      <span className="truncate">{art.title} — <em className="text-slate-400">{art.author}</em></span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <ViewAsBookButton
                  pdfUrl={selectedMag.pdfPath}
                  title={selectedMag.title}
                  label="View Magazine"
                  variant="gold"
                  size="lg"
                />
              </div>
            </div>

          </div>
        )}

        {/* 4. MAGAZINE ARCHIVES */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">
              ANNUAL ARCHIVES
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">
              All College Magazine Editions
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {magazineData.map((mag) => (
              <div
                key={mag.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="bg-amber-100 text-amber-900 font-mono font-bold text-[10.5px] px-2.5 py-1 rounded-md uppercase">
                      {mag.volume}
                    </span>
                    <span className="text-[11px] font-mono text-slate-400 font-semibold">{mag.year}</span>
                  </div>

                  <h3 className="font-serif font-bold text-xl text-slate-900 leading-snug">
                    {mag.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {mag.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-end">
                  <ViewAsBookButton
                    pdfUrl={mag.pdfPath}
                    title={mag.title}
                    label="View"
                    variant="blue"
                    size="sm"
                    className="w-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
