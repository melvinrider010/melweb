import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, FileText, ArrowRight, GraduationCap, Building2 } from 'lucide-react';
import ugProgrammes from '../data/ug-programmes.json';
import pgProgrammes from '../data/pg-programmes.json';

export default function AcademicsPage() {
  const [tab, setTab] = useState('ug');

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      {/* Header Banner */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Academic Excellence</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-slate-900 leading-tight">Academic Structure & Programmes</h1>
        <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          St. Philomena's College offers diverse undergraduate, postgraduate, and vocational degree programs aligned with the National Education Policy (NEP 2020) and Choice Based Credit System (CBCS).
        </p>

        {/* Stream Toggle Tabs */}
        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={() => setTab('ug')}
            className={`px-6 py-3 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              tab === 'ug'
                ? 'bg-[#1C5496] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Undergraduate Programmes (NEP)
          </button>
          <button
            onClick={() => setTab('pg')}
            className={`px-6 py-3 rounded-lg text-sm font-bold transition-all cursor-pointer ${
              tab === 'pg'
                ? 'bg-[#1C5496] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Postgraduate Programmes (M.Sc / M.Com / MA / MSW)
          </button>
        </div>
      </div>

      {/* UG Programmes List */}
      {tab === 'ug' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ugProgrammes.map((prog, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3.5">
                <span className="bg-blue-50 text-[#1C5496] font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider inline-block">{prog.code}</span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 leading-snug">{prog.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">{prog.overview}</p>
                <div className="pt-2 text-sm space-y-1.5 text-slate-700">
                  <p><span className="font-semibold text-slate-500">Duration:</span> {prog.duration}</p>
                  <p><span className="font-semibold text-slate-500">Eligibility:</span> {prog.eligibility}</p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link to="/admissions" className="btn-gold px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold">
                  Apply 2026–27
                </Link>
                <a href={prog.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1C5496] font-bold hover:underline">
                  Official Syllabus ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* PG Programmes List */}
      {tab === 'pg' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pgProgrammes.map((prog, idx) => (
            <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
              <div className="space-y-3.5">
                <span className="bg-emerald-50 text-emerald-800 font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider inline-block">{prog.code}</span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 leading-snug">{prog.title}</h3>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">Department: Dept. of {prog.department}</p>
                <div className="pt-2 text-sm space-y-1.5 text-slate-700">
                  <p><span className="font-semibold text-slate-500">Duration:</span> {prog.duration}</p>
                  <p><span className="font-semibold text-slate-500">Degree:</span> Master's Degree</p>
                </div>
              </div>

              <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                <Link to="/admissions" className="btn-gold px-4 sm:px-5 py-2.5 rounded-lg text-sm font-bold">
                  Apply 2026–27
                </Link>
                <a href={prog.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-[#1C5496] font-bold hover:underline">
                  PG Regulations ↗
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
