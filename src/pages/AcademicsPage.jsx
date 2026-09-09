import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { BookOpen, CheckCircle2, FileText, ArrowRight, GraduationCap, Building2, ChevronRight, Sparkles, Layers, Globe, Compass } from 'lucide-react';
import { UG_PROGRAMMES_CATALOGUE } from '../data/ugProgrammesCatalogue';
import { getPGProgrammes } from '../services/programmesService';
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
  const [pgProgrammes, setPgProgrammes] = useState([]);
  const [isLoadingPg, setIsLoadingPg] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadPg() {
      try {
        const data = await getPGProgrammes();
        if (isMounted) {
          setPgProgrammes(data || []);
          setIsLoadingPg(false);
        }
      } catch (err) {
        if (isMounted) {
          setPgProgrammes([]);
          setIsLoadingPg(false);
        }
      }
    }
    loadPg();
    return () => { isMounted = false; };
  }, []);

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

        {/* 4. PG PROGRAMMES TAB (STRUCTURED: MCA, MBA, M.COM, M.SC COMBINATIONS, M.A COMBINATIONS, MSW) */}
        {tab === 'pg' && (
          <div className="space-y-12 animate-fadeIn">
            
            {/* SUB-CATEGORY FILTER PILLS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs font-bold font-mono text-[#1C5496] uppercase tracking-wider block">Postgraduate Degrees</span>
                <h3 className="font-serif font-bold text-lg text-slate-900">Explore Master Degree Streams</h3>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {[
                  { id: 'all', label: 'All PG (15)' },
                  { id: 'mca', label: 'MCA' },
                  { id: 'mba', label: 'MBA' },
                  { id: 'mcom', label: 'M.Com' },
                  { id: 'msc', label: 'M.Sc (8 Combinations)' },
                  { id: 'ma', label: 'M.A (3 Combinations)' },
                  { id: 'msw', label: 'MSW' }
                ].map((pill) => (
                  <a
                    key={pill.id}
                    href={`#pg-group-${pill.id}`}
                    className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-slate-100 text-slate-700 hover:bg-[#0B1F4E] hover:text-[#F0D98C] transition-all border border-slate-200 shadow-2xs"
                  >
                    {pill.label}
                  </a>
                ))}
              </div>
            </div>

            {/* 1. PROFESSIONAL & TECHNICAL PROGRAMMES: MCA, MBA, M.COM */}
            <div id="pg-group-mca" className="space-y-6 scroll-mt-24">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">IT, Management & Commerce</span>
                  <h2 className="font-serif font-bold text-2xl text-slate-900">MCA, MBA & M.COM PROGRAMMES</h2>
                </div>
                <span className="bg-blue-50 text-[#1C5496] font-bold text-xs px-3 py-1 rounded-full border border-blue-200">
                  3 Professional Degrees
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pgProgrammes.filter(p => ['MCA', 'MBA', 'MCOM'].includes(p.code)).map((prog, idx) => {
                  const slug = getPGProgrammeSlug(prog.code);
                  return (
                    <div key={idx} id={`pg-group-${prog.code.toLowerCase()}`} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="bg-[#0B1F4E] text-[#F0D98C] font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider font-mono">
                            {prog.code}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 font-semibold">{prog.duration}</span>
                        </div>
                        <h3 className="font-serif font-bold text-xl text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
                          {prog.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                          {prog.overview}
                        </p>
                        <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 space-y-1">
                          <p><span className="text-slate-400 font-medium">Eligibility:</span> {prog.eligibility}</p>
                          <p><span className="text-slate-400 font-medium">Department:</span> {prog.departments?.join(', ')}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href="https://student.stphiloserp.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gold px-3.5 py-1.5 rounded-lg text-xs font-bold"
                        >
                          + Apply Now
                        </a>
                        <Link to={`/academics/${slug}`} className="text-xs text-[#1C5496] font-bold hover:underline inline-flex items-center">
                          <span>EXPLORE SYLLABUS →</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. M.SC - MASTER OF SCIENCE (ALL 8 M.SC COMBINATIONS) */}
            <div id="pg-group-msc" className="space-y-6 scroll-mt-24">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Pure, Applied & Interdisciplinary Sciences</span>
                  <h2 className="font-serif font-bold text-2xl text-slate-900">M.SC PROGRAMMES (ALL 8 SPECIALIZATIONS)</h2>
                </div>
                <span className="bg-emerald-50 text-emerald-800 font-bold text-xs px-3 py-1 rounded-full border border-emerald-200">
                  8 M.Sc Combinations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {pgProgrammes.filter(p => p.code.startsWith('MSC-')).map((prog, idx) => {
                  const slug = getPGProgrammeSlug(prog.code);
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3.5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
                      <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                          <span className="bg-emerald-100 text-emerald-900 font-bold text-[11px] px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">
                            {prog.code.replace('MSC-', 'M.Sc ')}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500 font-semibold">{prog.duration}</span>
                        </div>
                        <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug line-clamp-2">
                          {prog.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                          {prog.overview}
                        </p>
                        <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 space-y-0.5">
                          <p className="line-clamp-1"><span className="text-slate-400 font-medium">Dept:</span> {prog.departments?.join(', ')}</p>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href="https://student.stphiloserp.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold"
                        >
                          Apply
                        </a>
                        <Link to={`/academics/${slug}`} className="text-xs text-[#1C5496] font-bold hover:underline inline-flex items-center">
                          <span>EXPLORE →</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 3. M.A - MASTER OF ARTS (ALL 3 M.A COMBINATIONS) */}
            <div id="pg-group-ma" className="space-y-6 scroll-mt-24">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Humanities, Media & Social Sciences</span>
                  <h2 className="font-serif font-bold text-2xl text-slate-900">M.A PROGRAMMES (ALL 3 SPECIALIZATIONS)</h2>
                </div>
                <span className="bg-amber-50 text-amber-900 font-bold text-xs px-3 py-1 rounded-full border border-amber-200">
                  3 M.A Combinations
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {pgProgrammes.filter(p => p.code.startsWith('MA-')).map((prog, idx) => {
                  const slug = getPGProgrammeSlug(prog.code);
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between group">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="bg-amber-100 text-amber-950 font-bold text-xs px-2.5 py-0.5 rounded uppercase tracking-wider font-mono">
                            {prog.code.replace('MA-', 'M.A ')}
                          </span>
                          <span className="text-[11px] font-mono text-slate-500 font-semibold">{prog.duration}</span>
                        </div>
                        <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
                          {prog.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans line-clamp-3">
                          {prog.overview}
                        </p>
                        <div className="pt-2 text-[11px] text-slate-500 border-t border-slate-100 space-y-1">
                          <p><span className="text-slate-400 font-medium">Department:</span> {prog.departments?.join(', ')}</p>
                          <p className="line-clamp-1"><span className="text-slate-400 font-medium">Eligibility:</span> {prog.eligibility}</p>
                        </div>
                      </div>

                      <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                        <a
                          href="https://student.stphiloserp.in/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn-gold px-3.5 py-1.5 rounded-lg text-xs font-bold"
                        >
                          + Apply Now
                        </a>
                        <Link to={`/academics/${slug}`} className="text-xs text-[#1C5496] font-bold hover:underline inline-flex items-center">
                          <span>EXPLORE SYLLABUS →</span>
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 4. MSW - MASTER OF SOCIAL WORK */}
            <div id="pg-group-msw" className="space-y-6 scroll-mt-24">
              <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Social Sciences & Human Development</span>
                  <h2 className="font-serif font-bold text-2xl text-slate-900">MSW - MASTER OF SOCIAL WORK</h2>
                </div>
                <span className="bg-purple-50 text-purple-900 font-bold text-xs px-3 py-1 rounded-full border border-purple-200">
                  Professional Social Work
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pgProgrammes.filter(p => p.code === 'MSW').map((prog, idx) => {
                  const slug = getPGProgrammeSlug(prog.code);
                  return (
                    <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-5 shadow-xs hover:shadow-lg transition-all flex flex-col justify-between md:col-span-2 group">
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        <div className="lg:col-span-8 space-y-3">
                          <div className="flex items-center space-x-2">
                            <span className="bg-purple-100 text-purple-950 font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider font-mono">
                              MSW
                            </span>
                            <span className="text-xs font-mono text-slate-500 font-semibold">{prog.duration}</span>
                          </div>
                          <h3 className="font-serif font-bold text-2xl text-slate-900 group-hover:text-[#1C5496] transition-colors">
                            {prog.title}
                          </h3>
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                            {prog.overview}
                          </p>
                          <div className="pt-2 text-xs text-slate-600 space-y-1">
                            <p><strong className="text-slate-800">Eligibility:</strong> {prog.eligibility}</p>
                            <p><strong className="text-slate-800">Career Outcomes:</strong> {prog.outcomes}</p>
                          </div>
                        </div>

                        <div className="lg:col-span-4 bg-purple-50/60 p-5 rounded-xl border border-purple-100 flex flex-col justify-between space-y-4">
                          <div className="space-y-2">
                            <h4 className="font-bold text-xs uppercase tracking-wider text-purple-900">Key Specializations</h4>
                            <ul className="text-xs text-purple-950 space-y-1.5 list-disc list-inside">
                              <li>Community Development</li>
                              <li>Medical & Psychiatric Social Work</li>
                              <li>Human Resource Management (HRM)</li>
                            </ul>
                          </div>
                          <div className="pt-2 flex items-center gap-2">
                            <a
                              href="https://student.stphiloserp.in/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-gold px-4 py-2 rounded-lg text-xs font-bold text-center flex-1"
                            >
                              + Apply Now
                            </a>
                            <Link to={`/academics/${slug}`} className="btn-navy px-4 py-2 rounded-lg text-xs font-bold text-center flex-1">
                              <span>Explore</span>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

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
