import React, { useState } from 'react';
import { Download, ZoomIn, Eye, Sparkles, Building2 } from 'lucide-react';

export default function OrganogramView() {
  const [showFullImage, setShowFullImage] = useState(false);

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Bar */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-[#C9A84C]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#a88530]">
              Institutional Governance
            </span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0B1F4E]">
            College Administrative Organogram
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            Official organizational hierarchy of St. Philomena's College (Autonomous), Bannimantap, Mysuru.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setShowFullImage(true)}
            className="btn-gold px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
            <span>View Full Chart</span>
          </button>
          
          <a
            href="/assets/images/about/st_philos_official_organogram.png"
            download="St_Philomenas_College_Organogram.png"
            className="px-4 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-[#0B1F4E] border border-slate-300 flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download PNG</span>
          </a>
        </div>
      </div>

      {/* Main Visual Interactive Organogram Stage */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm overflow-x-auto">
        <div className="min-w-[1020px] max-w-[1280px] mx-auto space-y-6 text-center font-sans">
          
          {/* Top Title Banner with Official Crest */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-2xl font-serif font-extrabold text-[#058270] tracking-wide">
              Organogram
            </h3>
            
            <div className="text-right flex items-center space-x-3">
              <div className="space-y-0.5">
                <span className="block font-serif font-bold text-sm text-[#058270]">
                  St. Philomena's College (Autonomous)
                </span>
                <span className="block text-[11px] text-slate-500 font-medium">
                  Bannimantap, Mysore - 570015
                </span>
              </div>
              <img
                src="/assets/images/brand/crest_gold.png"
                alt="College Crest"
                className="w-12 h-12 object-contain"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/college-header-logo.png';
                }}
              />
            </div>
          </div>

          {/* =========================================================================
              TIER 1: APEX GOVERNANCE (MDES)
              ========================================================================= */}
          <div className="flex flex-col items-center">
            <div className="px-8 py-3 bg-[#0B1F4E] text-white rounded-full font-serif font-bold text-sm shadow-md border-2 border-white tracking-wide">
              MYSORE DIOCESAN EDUCATIONAL SOCIETY (MDES)
            </div>
            <div className="w-0.5 h-6 bg-slate-400" />
          </div>

          {/* =========================================================================
              TIER 2: GOVERNING BODY
              ========================================================================= */}
          <div className="flex flex-col items-center">
            <div className="w-64 py-2 bg-[#005b7f] text-white rounded font-bold text-xs shadow-sm">
              Governing Body
            </div>
            <div className="w-0.5 h-6 bg-slate-400" />
          </div>

          {/* =========================================================================
              TIER 3: RECTOR & CAMPUS ADMINISTRATION
              ========================================================================= */}
          <div className="relative flex justify-center items-center">
            
            {/* Left Branch: Campus Administration */}
            <div className="absolute right-[calc(50%+130px)] top-0 flex items-start">
              <div className="flex flex-col items-end">
                <div className="px-4 py-2 bg-[#7a431d] text-white rounded font-bold text-xs shadow-sm whitespace-nowrap">
                  Campus Administration
                </div>
                
                {/* Sub-branches under Campus Administration */}
                <div className="mt-3 flex flex-col space-y-1.5 items-end">
                  <span className="px-3 py-1 bg-[#c26a27] text-white rounded text-[11px] font-medium shadow-2xs whitespace-nowrap">
                    Infrastructure / Campus Maintenance
                  </span>
                  <span className="px-3 py-1 bg-[#c26a27] text-white rounded text-[11px] font-medium shadow-2xs whitespace-nowrap">
                    Admin Staff
                  </span>
                  <span className="px-3 py-1 bg-[#c26a27] text-white rounded text-[11px] font-medium shadow-2xs whitespace-nowrap">
                    Support Staff
                  </span>
                </div>
              </div>
              <div className="w-8 h-0.5 bg-slate-400 mt-4" />
            </div>

            {/* Center: Rector Box */}
            <div className="w-64 py-2 bg-[#005b7f] text-white rounded font-bold text-xs shadow-sm z-10">
              Rector
            </div>
          </div>

          <div className="w-0.5 h-6 bg-slate-400 mx-auto" />

          {/* =========================================================================
              TIER 4: PRINCIPAL & ACADEMIC COUNCILS / IQAC / RESEARCH
              ========================================================================= */}
          <div className="relative flex justify-center items-center">
            
            {/* Center: Principal Box */}
            <div className="w-64 py-2.5 bg-[#004759] text-white rounded font-bold text-sm shadow-md z-10">
              Principal
            </div>

            {/* Right Branch: Academic Council, IQAC, Research */}
            <div className="absolute left-[calc(50%+130px)] top-0 flex items-start">
              <div className="w-8 h-0.5 bg-slate-400 mt-4" />
              <div className="flex flex-col space-y-1.5 items-start">
                
                <span className="px-4 py-1.5 bg-[#7a431d] text-white rounded text-[11.5px] font-bold shadow-2xs whitespace-nowrap">
                  Academic Council
                </span>
                
                <span className="px-4 py-1.5 bg-[#7a431d] text-white rounded text-[11.5px] font-bold shadow-2xs whitespace-nowrap">
                  Planning and Evaluation Committee
                </span>

                <span className="px-4 py-1.5 bg-[#7a431d] text-white rounded text-[11.5px] font-bold shadow-2xs whitespace-nowrap">
                  IQAC
                </span>

                {/* Research Chain */}
                <div className="flex items-center space-x-2 pt-1">
                  <span className="px-3 py-1 bg-[#7a431d] text-white rounded text-[11px] font-bold shadow-2xs whitespace-nowrap">
                    Research Advisory Committee
                  </span>
                  <span className="text-slate-400 font-bold">→</span>
                  <span className="px-3 py-1 bg-[#7a431d] text-white rounded text-[11px] font-bold shadow-2xs whitespace-nowrap">
                    Research and Development Cell
                  </span>
                  <span className="text-slate-400 font-bold">→</span>
                  <span className="px-3 py-1 bg-[#7a431d] text-white rounded text-[11px] font-bold shadow-2xs whitespace-nowrap">
                    Intellectual Property Rights Cell
                  </span>
                </div>

              </div>
            </div>

          </div>

          <div className="w-0.5 h-8 bg-slate-400 mx-auto" />

          {/* =========================================================================
              TIER 5: HORIZONTAL DISTRIBUTION BUS LEADING TO 6 SPECIALIZED COLUMNS
              ========================================================================= */}
          <div className="relative pt-2">
            
            {/* Top Bus Line */}
            <div className="h-0.5 bg-slate-400 w-full" />

            {/* 6 Specialized Columns */}
            <div className="grid grid-cols-6 gap-3.5 pt-4 items-start text-center">
              
              {/* 1. VICE PRINCIPAL ADMINISTRATION (Deep Blue #1f4996) */}
              <div className="space-y-2">
                <div className="p-2.5 bg-[#1f4996] text-white rounded font-bold text-xs shadow-xs min-h-[48px] flex items-center justify-center">
                  Vice Principal Administration
                </div>
                <div className="w-0.5 h-3 bg-slate-300 mx-auto" />
                <div className="space-y-1 text-left">
                  {[
                    'Human Resources',
                    'Finance/Purchase Committee',
                    'Information Resources Centre',
                    'Consultation Training',
                    'Office Superintendent',
                    'Placements'
                  ].map((sub, idx) => (
                    <div key={idx} className="p-1.5 bg-[#1f4996] text-white rounded text-[11px] font-medium leading-tight shadow-2xs text-center">
                      {sub}
                    </div>
                  ))}
                </div>
              </div>

              {/* 2. VICE PRINCIPAL ACADEMICS (Green/Teal #058270) */}
              <div className="space-y-2">
                <div className="p-2.5 bg-[#058270] text-white rounded font-bold text-xs shadow-xs min-h-[48px] flex items-center justify-center">
                  Vice Principal Academics
                </div>
                <div className="w-0.5 h-3 bg-slate-300 mx-auto" />
                <div className="space-y-1 text-left">
                  {[
                    'Deans',
                    'HODs',
                    'Department/Program Coordinators',
                    'Faculty Members',
                    'Board of Studies'
                  ].map((sub, idx) => (
                    <div key={idx} className="p-1.5 bg-[#058270] text-white rounded text-[11px] font-medium leading-tight shadow-2xs text-center">
                      {sub}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3. POST GRADUATE DIRECTOR (Purple #6b218f) */}
              <div className="space-y-2">
                <div className="p-2.5 bg-[#6b218f] text-white rounded font-bold text-xs shadow-xs min-h-[48px] flex items-center justify-center">
                  Post Graduate Director
                </div>
                <div className="w-0.5 h-3 bg-slate-300 mx-auto" />
                <div className="space-y-1 text-left">
                  {[
                    'PG Coordinator',
                    'PG Deans',
                    'PG HODs',
                    'PG Faculty'
                  ].map((sub, idx) => (
                    <div key={idx} className="p-1.5 bg-[#6b218f] text-white rounded text-[11px] font-medium leading-tight shadow-2xs text-center">
                      {sub}
                    </div>
                  ))}
                </div>
              </div>

              {/* 4. CONTROLLER OF EXAMINATIONS (Orange #f07d18) */}
              <div className="space-y-2">
                <div className="p-2.5 bg-[#f07d18] text-white rounded font-bold text-xs shadow-xs min-h-[48px] flex items-center justify-center">
                  Controller of Examinations
                </div>
                <div className="w-0.5 h-3 bg-slate-300 mx-auto" />
                <div className="space-y-1 text-left">
                  {[
                    'Assistant Controller',
                    'Chief Superintendent',
                    'Board of Examiners',
                    'Examinations Committee',
                    'Malpractice Committee',
                    'Evaluation and Results'
                  ].map((sub, idx) => (
                    <div key={idx} className="p-1.5 bg-[#f07d18] text-white rounded text-[11px] font-medium leading-tight shadow-2xs text-center">
                      {sub}
                    </div>
                  ))}
                </div>
              </div>

              {/* 5. CELL / COMMITTEES (Magenta/Plum #911e61) */}
              <div className="space-y-2">
                <div className="p-2.5 bg-[#911e61] text-white rounded font-bold text-xs shadow-xs min-h-[48px] flex items-center justify-center">
                  Cell / Committees
                </div>
                <div className="w-0.5 h-3 bg-slate-300 mx-auto" />
                <div className="space-y-1 text-left">
                  {[
                    'Career Guidance Cell',
                    'Entrepreneur Development Cell',
                    'Skill Development Cell (SDC)',
                    'Women\'s Cell',
                    'ICT Cell',
                    'Data Analysis Centre',
                    'Competitive Examination Cell',
                    'International Students\' Cell',
                    'Counselling Centre',
                    'NIRF',
                    'AISHE'
                  ].map((sub, idx) => (
                    <div key={idx} className="p-1.5 bg-[#911e61] text-white rounded text-[11px] font-medium leading-tight shadow-2xs text-center">
                      {sub}
                    </div>
                  ))}
                </div>
              </div>

              {/* 6. HOSTELS (Pink #d92582) */}
              <div className="space-y-2">
                <div className="p-2.5 bg-[#d92582] text-white rounded font-bold text-xs shadow-xs min-h-[48px] flex items-center justify-center">
                  Hostels
                </div>
                <div className="w-0.5 h-3 bg-slate-300 mx-auto" />
                <div className="space-y-1 text-left">
                  {[
                    'Warden - Boys Hostel',
                    'Warden - Girls Hostel'
                  ].map((sub, idx) => (
                    <div key={idx} className="p-1.5 bg-[#d92582] text-white rounded text-[11px] font-medium leading-tight shadow-2xs text-center">
                      {sub}
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Official Poster Image Box */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-serif font-bold text-lg text-[#0B1F4E]">
            Official Institutional Organogram Chart
          </h3>
          <span className="text-xs text-slate-500 font-mono">
            St. Philomena's College (Autonomous), Mysuru
          </span>
        </div>

        <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-50 relative group cursor-pointer" onClick={() => setShowFullImage(true)}>
          <img
            src="/assets/images/about/st_philos_official_organogram.png"
            alt="St. Philomena's College Official Organogram"
            className="w-full h-auto object-contain mx-auto"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="bg-[#0B1F4E] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-lg flex items-center space-x-1.5">
              <ZoomIn className="w-4 h-4 text-[#FFD84A]" />
              <span>Click to Enlarge</span>
            </span>
          </div>
        </div>
      </div>

      {/* Modal Lightbox for Organogram Full-Screen Viewing */}
      {showFullImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowFullImage(false)}
        >
          <div className="relative max-w-6xl max-h-[90vh] bg-white rounded-2xl p-4 overflow-hidden shadow-2xl space-y-3" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b pb-2">
              <span className="font-serif font-bold text-base text-[#0B1F4E]">
                Official Organogram - St. Philomena's College (Autonomous)
              </span>
              <button
                onClick={() => setShowFullImage(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer"
              >
                ✕ Close
              </button>
            </div>
            
            <div className="overflow-auto max-h-[78vh] p-2">
              <img
                src="/assets/images/about/st_philos_official_organogram.png"
                alt="St. Philomena's College Full Organogram"
                className="w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
