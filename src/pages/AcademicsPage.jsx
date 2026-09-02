import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, FileText, ArrowRight, GraduationCap, Building2, ChevronRight, Sparkles, Layers, Globe, Compass } from 'lucide-react';
import { UG_PROGRAMMES_CATALOGUE } from '../data/ugProgrammesCatalogue';
import pgProgrammes from '../data/pg-programmes.json';
import CourseHoneycombSection from '../components/home/CourseHoneycombSection';
import NepRegulationsView from '../components/academics/NepRegulationsView';
import EContentView from '../components/academics/EContentView';
import SyllabusUGView from '../components/academics/SyllabusUGView';
import SyllabusPGView from '../components/academics/SyllabusPGView';
import OutcomesView from '../components/academics/OutcomesView';

// Map code from PG dataset to canonical detail route slug
function getPGProgrammeSlug(code) {
  const map = {
    'MSW': 'msw',
    'MSC-CHEM': 'msc-chem',
    'MSC-PHY': 'msc-phy',
    'MSC-MATH': 'msc-math',
    'MSC-CS': 'msc-cs',
    'MSC-BIOCHEM': 'msc-biochem',
    'MCOM': 'mcom',
    'MA-ENG': 'ma-eng',
    'MA-ECON': 'ma-econ',
    'MSC-CRIM': 'msc-crim',
    'MA-JMC': 'ma-jmc',
    'MSC-PSY': 'msc-psych',
    'MSC-FSN': 'msc-food',
    'MCA': 'mca',
    'MBA': 'mba'
  };
  const normalized = String(code).toUpperCase().trim();
  return map[normalized] || String(code).toLowerCase().replace(/[^a-z0-9-]/g, '');
}

export default function AcademicsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab') || 'ug';
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    const currentTab = searchParams.get('tab') || 'ug';
    setTab(currentTab);
  }, [searchParams]);

  const handleTabChange = (newTab) => {
    setTab(newTab);
    setSearchParams({ tab: newTab });
  };

  // Partition UG catalogue into official sections matching stphilos.ac.in/ug/
  const ugDegrees = UG_PROGRAMMES_CATALOGUE.filter(p => p.category === 'UG Programs');
  const languageDegrees = UG_PROGRAMMES_CATALOGUE.filter(p => p.category === 'Languages');
  const foundationDegrees = UG_PROGRAMMES_CATALOGUE.filter(p => p.category === 'Foundation Courses');

  return (
    <div className="space-y-10 py-6 sm:py-10 text-[#071A33]">
      
      {/* 1. INTERACTIVE COURSE HONEYCOMB MATRIX CAROUSEL */}
      <CourseHoneycombSection />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-10">

        {/* 2. HEADER BANNER & DEGREE LEVEL TOGGLE */}
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Academic Excellence</span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-slate-900 leading-tight">Academic Structure & Programmes</h1>
          <p className="text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed font-sans">
            St. Philomena's College (Autonomous), Mysuru offers diverse undergraduate, postgraduate, vocational, and language degree programs aligned with the National Education Policy (NEP 2020) and Outcome Based Education (OBE).
          </p>

          {/* Academic Portal Navigation Tabs */}
          <div className="pt-2 flex flex-wrap gap-2 sm:gap-2.5">
            {[
              { id: 'ug', label: 'Undergraduate (UG)' },
              { id: 'pg', label: 'Postgraduate (PG)' },
              { id: 'nep', label: 'NEP Regulations' },
              { id: 'econtent', label: 'E-Content Portal' },
              { id: 'syllabus-ug', label: 'Syllabus UG' },
              { id: 'syllabus-pg', label: 'Syllabus PG' },
              { id: 'outcomes', label: 'Course Outcomes (OBE)' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => handleTabChange(t.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-[13px] font-bold transition-all cursor-pointer ${
                  tab === t.id
                    ? 'bg-[#1C5496] text-white shadow-md'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* 3. UG PROGRAMMES TAB (100% CONTENT PARITY WITH OFFICIAL SOURCE stphilos.ac.in/ug/) */}
        {tab === 'ug' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* SECTION 1: CORE UG PROGRAMS */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Core Bachelor Degrees</span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">UG PROGRAMS</h2>
                </div>
                <span className="bg-blue-50 text-[#1C5496] font-bold text-xs px-3 py-1 rounded-full border border-blue-200">
                  {ugDegrees.length} Degree Programmes
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {ugDegrees.map((prog) => (
                  <div
                    key={prog.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
                        <img
                          src={prog.image}
                          alt={prog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-[#071A33]/90 backdrop-blur-xs text-[#FFD84A] font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                          {prog.badge}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-2.5">
                        <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug line-clamp-2">
                          {prog.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-2">
                          {prog.overview}
                        </p>
                        <div className="text-[11px] text-slate-500 font-medium space-y-1 pt-1 border-t border-slate-100">
                          <p><span className="text-slate-400">Duration:</span> {prog.duration}</p>
                          <p><span className="text-slate-400">Dept:</span> {prog.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions (Apply Now + EXPLORE->) */}
                    <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 bg-slate-50/50">
                      <a
                        href="https://student.stphiloserp.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold text-center"
                      >
                        + Apply Now
                      </a>
                      <Link
                        to={prog.explorePath}
                        className="text-xs font-bold text-[#1C5496] group-hover:underline inline-flex items-center"
                      >
                        <span>EXPLORE →</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 2: LANGUAGES */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Classical & Modern Literatures</span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">LANGUAGES</h2>
                </div>
                <span className="bg-amber-50 text-amber-800 font-bold text-xs px-3 py-1 rounded-full border border-amber-200">
                  {languageDegrees.length} Language Disciplines
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {languageDegrees.map((prog) => (
                  <div
                    key={prog.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
                        <img
                          src={prog.image}
                          alt={prog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-[#071A33]/90 backdrop-blur-xs text-[#FFD84A] font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                          {prog.badge}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-2.5">
                        <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
                          {prog.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-2">
                          {prog.overview}
                        </p>
                        <div className="text-[11px] text-slate-500 font-medium space-y-1 pt-1 border-t border-slate-100">
                          <p><span className="text-slate-400">Curriculum:</span> {prog.duration}</p>
                          <p><span className="text-slate-400">Dept:</span> {prog.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions (Apply Now + EXPLORE->) */}
                    <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 bg-slate-50/50">
                      <a
                        href="https://student.stphiloserp.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold text-center"
                      >
                        + Apply Now
                      </a>
                      <Link
                        to={prog.explorePath}
                        className="text-xs font-bold text-[#1C5496] group-hover:underline inline-flex items-center"
                      >
                        <span>EXPLORE →</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SECTION 3: FOUNDATION COURSES */}
            <div className="space-y-6">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Ability & Skill Enhancement</span>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">FOUNDATION COURSES</h2>
                </div>
                <span className="bg-emerald-50 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                  {foundationDegrees.length} Value & Skill Modules
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {foundationDegrees.map((prog) => (
                  <div
                    key={prog.id}
                    className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Image */}
                      <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
                        <img
                          src={prog.image}
                          alt={prog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute top-2.5 left-2.5 bg-[#071A33]/90 backdrop-blur-xs text-[#FFD84A] font-mono text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                          {prog.badge}
                        </span>
                      </div>

                      {/* Card Content */}
                      <div className="p-5 space-y-2.5">
                        <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
                          {prog.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-2">
                          {prog.overview}
                        </p>
                        <div className="text-[11px] text-slate-500 font-medium space-y-1 pt-1 border-t border-slate-100">
                          <p><span className="text-slate-400">Type:</span> {prog.duration}</p>
                          <p><span className="text-slate-400">Dept:</span> {prog.department}</p>
                        </div>
                      </div>
                    </div>

                    {/* Card Actions (Apply Now + EXPLORE->) */}
                    <div className="p-5 pt-0 flex items-center justify-between gap-2 border-t border-slate-100 pt-3 bg-slate-50/50">
                      <a
                        href="https://student.stphiloserp.in/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold text-center"
                      >
                        + Apply Now
                      </a>
                      <Link
                        to={prog.explorePath}
                        className="text-xs font-bold text-[#1C5496] group-hover:underline inline-flex items-center"
                      >
                        <span>EXPLORE →</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 4. PG PROGRAMMES GRID */}
        {tab === 'pg' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
            {pgProgrammes.map((prog, idx) => {
              const slug = getPGProgrammeSlug(prog.code);
              return (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div className="space-y-3.5">
                    <span className="bg-emerald-50 text-emerald-800 font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider inline-block font-mono">{prog.code}</span>
                    <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 leading-snug">{prog.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                      {prog.overview || `Department: Dept. of ${prog.departments?.[0] || 'Postgraduate Studies'}`}
                    </p>
                    <div className="pt-2 text-xs space-y-1.5 text-slate-700">
                      <p><span className="font-semibold text-slate-400">Duration:</span> {prog.duration}</p>
                      <p><span className="font-semibold text-slate-400">Degree:</span> Master's Degree</p>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <a
                      href="https://student.stphiloserp.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-gold px-4 py-2 rounded-lg text-xs font-bold"
                    >
                      + Apply Now
                    </a>
                    <Link to={`/academics/${slug}`} className="text-xs text-[#1C5496] font-bold hover:underline inline-flex items-center">
                      <span>EXPLORE →</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 5. NEP REGULATIONS VIEW */}
        {tab === 'nep' && <NepRegulationsView />}

        {/* 6. E-CONTENT PORTAL VIEW */}
        {tab === 'econtent' && <EContentView />}

        {/* 7. SYLLABUS UG VIEW */}
        {tab === 'syllabus-ug' && <SyllabusUGView />}

        {/* 8. SYLLABUS PG VIEW */}
        {tab === 'syllabus-pg' && <SyllabusPGView />}

        {/* 9. OUTCOMES (OBE) VIEW */}
        {tab === 'outcomes' && <OutcomesView />}

      </div>
    </div>
  );
}
