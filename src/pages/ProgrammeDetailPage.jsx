import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  ArrowRight, 
  GraduationCap, 
  Clock, 
  BookOpen, 
  CheckCircle2, 
  Award, 
  Building2, 
  Briefcase, 
  FileText, 
  Sparkles, 
  Layers,
  Phone, 
  Mail, 
  ShieldCheck, 
  Download, 
  Users, 
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Send,
  HelpCircle
} from 'lucide-react';
import { 
  getProgrammeById, 
  getDepartmentById, 
  getFacultyByDepartmentId, 
  getProgrammeFaculty,
  getProgrammeSecondaryFaculty,
  getRelatedUgProgrammes, 
  getRelatedPgProgrammes, 
  getProgressionPathways,
  getDepartmentContinuumProgrammes
} from '../data/academicsHierarchyData';
import { getProgrammeByCode } from '../data/programmeDetailsData';
import FacultyAvatar from '../components/common/FacultyAvatar';

function getSubjectDepartmentLink(subjectName) {
  if (!subjectName) return '/departments';
  const s = subjectName.toLowerCase().trim();
  if (s.includes('physic')) return '/departments/dept-physics';
  if (s.includes('chemist') && !s.includes('biochem')) return '/departments/dept-chemistry';
  if (s.includes('math') || s.includes('statist')) return '/departments/dept-mathematics';
  if (s.includes('computer') || s.includes('bca') || s.includes('mca')) return '/departments/dept-computer-science';
  if (s.includes('biochem')) return '/departments/dept-biochemistry';
  if (s.includes('biotech')) return '/departments/dept-biotechnology';
  if (s.includes('microbio')) return '/departments/dept-microbiology';
  if (s.includes('botany') || s.includes('zool')) return '/departments/dept-botany-zoology';
  if (s.includes('food') || s.includes('nutrit')) return '/departments/dept-food-science';
  if (s.includes('environ')) return '/departments/dept-environmental-science';
  if (s.includes('crimin') || s.includes('forensic')) return '/departments/dept-criminology';
  if (s.includes('commerc') || s.includes('b.com') || s.includes('m.com')) return '/departments/dept-commerce';
  if (s.includes('management') || s.includes('bba') || s.includes('mba')) return '/departments/dept-management';
  if (s.includes('social work') || s.includes('bsw') || s.includes('msw')) return '/departments/dept-social-work';
  if (s.includes('econom')) return '/departments/dept-economics';
  if (s.includes('english')) return '/departments/dept-english';
  if (s.includes('history')) return '/departments/dept-history';
  if (s.includes('journalism') || s.includes('mass comm')) return '/departments/dept-journalism';
  if (s.includes('psycholog')) return '/departments/dept-psychology';
  if (s.includes('sociolog')) return '/departments/dept-sociology';
  if (s.includes('politi')) return '/departments/dept-political-science';
  if (s.includes('kannada') || s.includes('hindi') || s.includes('french') || s.includes('malayalam') || s.includes('language')) return '/departments/dept-languages';
  return '/departments';
}

function getCombinationDepartmentLink(comb) {
  if (!comb) return '/departments';
  if (comb.deptSlug) {
    const slug = comb.deptSlug.replace(/^\/?departments\/?/, '');
    const dept = getDepartmentById(slug);
    return dept ? `/departments/${dept.id}` : `/departments/${slug}`;
  }
  if (comb.link) return comb.link;
  if (comb.to) return comb.to;

  const code = (comb.code || '').toUpperCase().trim();
  const sub = (comb.subjects || '').toLowerCase();

  // M.Sc specializations
  if (code.includes('CS') || sub.includes('computer')) return '/departments/dept-computer-science';
  if (code.includes('MATH') || sub.includes('math')) return '/departments/dept-mathematics';
  if (code.includes('PHYS') || code.includes('PHY') || sub.includes('physic')) return '/departments/dept-physics';
  if (code.includes('CHEM') || sub.includes('chemist')) return '/departments/dept-chemistry';
  if (code.includes('BIOCHEM') || code.includes('BCH') || sub.includes('biochem')) return '/departments/dept-biochemistry';
  if (code.includes('PSYCH') || code.includes('PSY') || sub.includes('psycholog')) return '/departments/dept-psychology';
  if (code.includes('FOOD') || code.includes('FSN') || sub.includes('food') || sub.includes('nutrition')) return '/departments/dept-food-science';
  if (code.includes('CRIM') || code.includes('CFS') || code.includes('CFP') || code.includes('BCC') || sub.includes('criminolog') || sub.includes('forensic')) return '/departments/dept-criminology';

  // M.A specializations
  if (code.includes('ENG') || sub.includes('english')) return '/departments/dept-english';
  if (code.includes('ECON') || sub.includes('econom')) return '/departments/dept-economics';
  if (code.includes('JMC') || sub.includes('journalism') || sub.includes('mass')) return '/departments/dept-journalism';

  // UG Combinations
  if (code === 'PCM' || code === 'PMC' || code === 'PME') return '/departments/dept-physics';
  if (code === 'CBZ' || code === 'CBM') return '/departments/dept-chemistry';
  if (code === 'BMB' || code === 'BTCZ' || code === 'BTCB') return '/departments/dept-biotechnology';
  if (code === 'BCC') return '/departments/dept-criminology';
  if (code === 'CFS') return '/departments/dept-criminology';
  if (code === 'FND' || code === 'FNC') return '/departments/dept-food-science';
  if (code === 'MEC') return '/departments/dept-environmental-science';
  if (code === 'ESP' || code === 'HEP') return '/departments/dept-economics';
  if (code === 'JPS') return '/departments/dept-journalism';
  if (code === 'ENSP') return '/departments/dept-english';

  return '/departments';
}

export default function ProgrammeDetailPage() {
  const { programmeCode } = useParams();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Lookup programme from canonical relational store, with fallback to legacy code lookup
  const prog = getProgrammeById(programmeCode) || getProgrammeByCode(programmeCode);

  if (!prog) {
    return (
      <div className="min-h-[70vh] bg-[#FAF9F6] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">Programme Not Found</h1>
          <p className="text-sm text-slate-600">
            We could not find an academic programme corresponding to "<span className="font-mono font-semibold">{programmeCode}</span>".
          </p>
          <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/academics" className="btn-primary-blue px-6 py-2.5 rounded-lg text-sm font-bold inline-flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Explore All Programmes</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Relational Lookups
  const department = getDepartmentById(prog.departmentId || prog.deptSlug || prog.department);
  const continuum = getDepartmentContinuumProgrammes(prog);
  const relatedUgList = getRelatedUgProgrammes(prog);
  const relatedPgList = getRelatedPgProgrammes(prog);
  const pathways = getProgressionPathways(prog);

  // Group faculty using canonical selector
  const isMca = (prog.code || prog.id || '').toUpperCase() === 'MCA';
  const primaryFaculty = getProgrammeFaculty(prog.code || prog.id);
  const secondaryData = getProgrammeSecondaryFaculty(prog.code || prog.id);
  const secondaryFaculty = secondaryData.faculty || [];
  const secondaryTitle = secondaryData.title || '';

  // Prospectus slides
  const mcaSlides = [
    '/assets/images/courses/mca/mca-prospectus-1.png',
    '/assets/images/courses/mca/mca-prospectus-2.png',
    '/assets/images/courses/mca/mca-prospectus-3.png'
  ];

  // Derived lists
  const pedagogyList = prog.curriculumHighlights || prog.pedagogy || [
    'Outcome-Based Education (OBE) curriculum aligned with National Education Policy (NEP)',
    'Hands-on experimental lab sessions & continuous internal assessment (C1 & C2)',
    'Industry guest lectures, seminar workshops, and live software/fieldwork projects',
    'Interdisciplinary open electives and skill enhancement courses (SEC)'
  ];

  const careerList = prog.careerOpportunities || prog.careers || [
    'Direct Corporate Campus Placement',
    'Higher Postgraduate Research & Specialization',
    'Public Sector & Civil Services Examinations',
    'Entrepreneurship & Professional Consulting'
  ];

  const tabs = [
    { id: 'overview', label: `${prog.code || 'Course'} Overview` },
    { id: 'vision-mission', label: 'Vision and Mission' },
    { id: 'eligibility', label: 'Eligibility' },
    { id: 'admission', label: 'Admission Process' },
    { id: 'syllabus', label: 'Syllabus' }
  ];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* 1. BACK NAVIGATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <Link
            to="/academics"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#1C5496] hover:text-[#071A33] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to Academic Programmes</span>
          </Link>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 font-mono">
            <Link to="/academics" className="hover:text-[#1C5496]">ACADEMICS</Link>
            <span>/</span>
            <span className="uppercase text-[#1C5496]">{prog.type === 'ug' ? 'UNDERGRADUATE' : 'POSTGRADUATE'}</span>
            <span>/</span>
            <span className="text-slate-800 font-bold">{prog.code || prog.id}</span>
          </div>
        </div>

        {/* 2. OFFICIAL TOP HERO BANNER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Course Intro & Official Badges */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <span className="bg-[#1C5496] text-white font-mono font-extrabold text-xs sm:text-sm px-3 py-1 rounded-md tracking-wider">
                  {prog.code || prog.id.toUpperCase()}
                </span>
                <span className="bg-blue-50 text-[#1C5496] font-sans font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider border border-blue-100">
                  {prog.level}
                </span>
                <span className="bg-amber-50 text-amber-800 font-sans font-semibold text-xs px-3 py-1 rounded-md border border-amber-200/60">
                  {prog.stream}
                </span>
                {isMca && (
                  <span className="bg-emerald-50 text-emerald-800 font-mono font-bold text-xs px-3 py-1 rounded-md border border-emerald-200/60">
                    PGCET CODE: C477
                  </span>
                )}
              </div>

              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight tracking-tight uppercase">
                {prog.title}
              </h1>

              <p className="text-xs sm:text-sm text-slate-500 font-mono">
                Approved by AICTE & Affiliated to the University of Mysore • Re-accredited by NAAC with 'A+' Grade
              </p>

              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans max-w-3xl pt-1">
                {prog.overview}
              </p>

              {/* Department Degree Continuum Switcher Buttons */}
              {continuum.programmes.length > 0 && (
                <div className="bg-gradient-to-r from-blue-50/90 via-slate-50 to-amber-50/70 p-3.5 sm:p-4 rounded-2xl border border-blue-100/90 shadow-2xs space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <GraduationCap className="w-4 h-4 text-[#1C5496]" />
                      <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-slate-700">
                        {continuum.department?.shortName || continuum.department?.name || 'Department'} Degree Continuum:
                      </span>
                    </div>
                    {continuum.deptLink && (
                      <Link 
                        to={continuum.deptLink}
                        className="text-[11px] sm:text-xs font-bold text-[#1C5496] hover:text-[#071A33] inline-flex items-center group"
                      >
                        <span>Visit {continuum.department?.shortName || 'Department'} Hub</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
                    {continuum.programmes.map((p) => {
                      const isCurrent = p.isCurrent;
                      return isCurrent ? (
                        <div
                          key={p.id}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0B1F4E] text-[#FFD84A] border-2 border-[#C9A84C] font-mono font-extrabold text-xs sm:text-sm shadow-sm tracking-wide cursor-default select-none ring-2 ring-[#C9A84C]/30"
                          title={`Currently viewing ${p.title}`}
                        >
                          <span className="w-2 h-2 rounded-full bg-[#FFD84A] animate-pulse"></span>
                          <span>{p.code}</span>
                          <span className="text-[10px] uppercase font-sans font-semibold bg-[#C9A84C]/30 text-amber-200 px-1.5 py-0.5 rounded">
                            {p.type.toUpperCase()} • Current
                          </span>
                        </div>
                      ) : (
                        <Link
                          key={p.id}
                          to={p.link}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white hover:bg-[#1C5496] text-[#1C5496] hover:text-white border-2 border-slate-200 hover:border-[#1C5496] font-mono font-bold text-xs sm:text-sm shadow-2xs hover:shadow-sm transition-all duration-150 transform hover:-translate-y-0.5 group"
                          title={`Switch to ${p.title}`}
                        >
                          <BookOpen className="w-3.5 h-3.5 opacity-70 group-hover:text-white" />
                          <span>{p.code}</span>
                          <span className="text-[10px] uppercase font-sans font-semibold text-slate-500 group-hover:text-white/90 bg-slate-100 group-hover:bg-white/20 px-1.5 py-0.5 rounded transition-colors">
                            {p.type.toUpperCase()}
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quick Metrics Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Duration</span>
                  <div className="flex items-center space-x-1.5 text-slate-900 font-serif font-bold text-xs sm:text-sm">
                    <Clock className="w-4 h-4 text-[#1C5496]" />
                    <span>{prog.duration}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Department</span>
                  <Link 
                    to={`/departments/${department?.slug || prog.deptSlug || 'bca'}`} 
                    className="flex items-center space-x-1.5 text-[#1C5496] font-serif font-bold text-xs sm:text-sm hover:underline"
                  >
                    <Building2 className="w-4 h-4" />
                    <span className="truncate">{department?.name || prog.department}</span>
                  </Link>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80">
                  <span className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Regulations</span>
                  <div className="flex items-center space-x-1.5 text-emerald-800 font-serif font-bold text-xs sm:text-sm">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Autonomous OBE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Prospectus Showcase / Actions (As in Image 3) */}
            <div className="lg:col-span-4 bg-gradient-to-br from-[#071A33] to-[#1C5496] text-white rounded-2xl p-5 sm:p-6 space-y-4 shadow-lg border border-slate-800">
              {isMca ? (
                <div className="space-y-4">
                  <div className="relative rounded-xl overflow-hidden border border-white/20 shadow-md aspect-[4/3] bg-black/40">
                    <img
                      src={mcaSlides[currentSlide]}
                      alt="MCA Prospectus"
                      className="w-full h-full object-contain transition-all duration-300"
                    />
                    <div className="absolute inset-0 flex items-center justify-between px-2">
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev === 0 ? mcaSlides.length - 1 : prev - 1))}
                        className="bg-black/60 hover:bg-black/90 text-white p-1 rounded-full cursor-pointer"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setCurrentSlide((prev) => (prev === mcaSlides.length - 1 ? 0 : prev + 1))}
                        className="bg-black/60 hover:bg-black/90 text-white p-1 rounded-full cursor-pointer"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between border-b border-white/10 pb-2">
                      <span className="text-slate-300">Application Fees:</span>
                      <span className="font-mono font-bold text-[#FFD84A]">₹ 500/-</span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      <span className="font-bold text-white block">For More Details Contact:</span>
                      <span>Mrs. Reena Mol V U</span>
                      <span className="block font-mono text-[#FFD84A]">+91 93424 44123</span>
                    </div>
                  </div>

                  <div className="space-y-2 pt-1">
                    <a
                      href="https://student.stphiloserp.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-gold py-2.5 rounded-xl font-bold text-xs text-center block shadow-sm"
                    >
                      CLICK TO APPLY ONLINE (ERP PORTAL)
                    </a>
                    <a
                      href="https://student.stphiloserp.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-xs font-semibold text-center block border border-white/20"
                    >
                      ONLINE ADMISSION PORTAL
                    </a>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="font-mono text-[10px] text-[#FFD84A] uppercase font-bold tracking-widest block">
                      ADMISSIONS 2026–27
                    </span>
                    <h3 className="font-serif font-bold text-lg text-white">
                      Apply for {prog.code || prog.id.toUpperCase()}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Online admissions are open for the academic batch 2026–2027.
                    </p>
                  </div>

                  <div className="space-y-2 pt-2">
                    <a
                      href="https://student.stphiloserp.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full btn-gold py-2.5 rounded-xl font-bold text-xs text-center block shadow-md hover:scale-[1.02] transition-transform"
                    >
                      Apply Online Now
                    </a>
                    <Link
                      to="/prospectus"
                      className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-xl text-xs font-semibold text-center block border border-white/20"
                    >
                      Download Prospectus
                    </Link>
                  </div>
                </div>
              )}
            </div>

          </div>
        </div>

        {/* 3. TABBED CONTENT SECTION (AS SHOWN IN IMAGE 3) */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-xs overflow-hidden">
          
          {/* Tab Bar */}
          <div className="flex overflow-x-auto border-b border-slate-200 bg-slate-50/70 no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3.5 text-xs sm:text-sm font-bold whitespace-nowrap transition-all border-b-2 cursor-pointer ${
                  activeTab === tab.id
                    ? 'border-[#1C5496] text-[#1C5496] bg-white'
                    : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Body */}
          <div className="p-6 sm:p-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 max-w-4xl text-slate-700 text-xs sm:text-sm leading-relaxed font-sans">
                <div className="space-y-3">
                  <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900">About the Programme</h3>
                  <p className="text-slate-600 leading-relaxed">{prog.overview}</p>
                </div>

                {prog.history && (
                  <div className="space-y-2 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200/80">
                    <h4 className="font-serif font-bold text-sm text-[#1C5496] flex items-center space-x-1.5">
                      <GraduationCap className="w-4 h-4" />
                      <span>Department Background & History</span>
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{prog.history}</p>
                  </div>
                )}

                {/* Canonical Subject Combinations (e.g. for M.Sc / M.A / B.Sc / B.A) */}
                {Array.isArray(prog.combinations) && prog.combinations.length > 0 && (
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-slate-900">
                        Approved Subject Combinations (NEP 2020):
                      </h4>
                      <span className="text-[11px] font-sans text-slate-500 italic hidden sm:inline">
                        Click any subject to open its department page
                      </span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {prog.combinations.map((comb, idx) => {
                        const targetDeptUrl = getCombinationDepartmentLink(comb);
                        const subjectList = (comb.subjects || '').split(',').map(s => s.trim()).filter(Boolean);

                        return (
                          <div
                            key={idx}
                            className="p-3.5 bg-white hover:bg-blue-50/40 border border-slate-200 hover:border-[#1C5496] rounded-xl shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-2.5 group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-mono font-bold text-xs bg-[#1C5496] group-hover:bg-[#0B1F4E] text-white px-2.5 py-1 rounded transition-colors shrink-0 shadow-2xs">
                                {comb.code}
                              </span>
                              <Link
                                to={targetDeptUrl}
                                className="flex items-center space-x-1 text-[#1C5496] text-[11px] font-bold hover:underline transition-all"
                              >
                                <span>VIEW DEPT</span>
                                <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                              </Link>
                            </div>

                            {/* Clickable individual subject pills */}
                            <div className="flex flex-wrap gap-1.5 pt-0.5">
                              {subjectList.map((subj, sIdx) => {
                                const subjLink = getSubjectDepartmentLink(subj);
                                return (
                                  <Link
                                    key={sIdx}
                                    to={subjLink}
                                    className="px-2 py-0.5 bg-slate-100 hover:bg-[#1C5496] hover:text-white text-slate-800 text-[11px] font-medium rounded-md transition-colors border border-slate-200/80 hover:border-[#1C5496]"
                                    title={`Open Department of ${subj}`}
                                  >
                                    {subj}
                                  </Link>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 12 B.Sc Subject Combination Departments from Official Website */}
                {(prog.code === 'B.Sc' || prog.id === 'bsc') && (
                  <div className="space-y-4 pt-6 border-t border-slate-200/80">
                    <h4 className="font-serif font-bold text-base text-slate-900 border-b border-slate-200 pb-2">
                      Subject Combination Departments
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5 pt-1">
                      {[
                        { label: 'List of combinations with Physics', name: 'Department of Physics', to: '/departments/dept-physics' },
                        { label: 'List of combinations with Microbiology', name: 'Department of Microbiology', to: '/departments/dept-microbiology' },
                        { label: 'List of combinations with Chemistry', name: 'Department of Chemistry', to: '/departments/dept-chemistry' },
                        { label: 'List of combinations with Biochemistry', name: 'Department of Biochemistry', to: '/departments/dept-biochemistry' },
                        { label: 'List of combinations with Mathematics', name: 'Department of Mathematics', to: '/departments/dept-mathematics' },
                        { label: 'List of combinations with Biotechnology', name: 'Department of Biotechnology', to: '/departments/dept-biotechnology' },
                        { label: 'List of combinations with Botany', name: 'Department of Botany', to: '/departments/dept-botany-zoology' },
                        { label: 'List of combinations with Food & Nutrition', name: 'Department of Food & Nutrition', to: '/departments/dept-food-science' },
                        { label: 'List of combinations with Computer Science', name: 'Department of Computer Science', to: '/departments/dept-computer-science' },
                        { label: 'List of combinations with Environmental Science', name: 'Environmental Science', to: '/departments/dept-environmental-science' },
                        { label: 'List of combinations with Zoology', name: 'Department of Zoology', to: '/departments/dept-botany-zoology' },
                        { label: 'List of combinations with Criminology and Forensic Science', name: 'Criminology and Forensic Science', to: '/departments/dept-criminology' }
                      ].map((item, idx) => (
                        <div key={idx} className="space-y-1">
                          <p className="text-xs text-slate-700 font-serif font-medium">{item.label}</p>
                          <Link
                            to={item.to}
                            className="text-base font-bold text-blue-700 hover:text-[#1C5496] hover:underline block"
                          >
                            {item.name}
                          </Link>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Achievements */}
                {Array.isArray(prog.achievements) && prog.achievements.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-serif font-bold text-sm text-slate-900">Key Achievements:</h4>
                    <ul className="space-y-2 text-xs">
                      {prog.achievements.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2">
                          <Award className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                          <span className="text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Curriculum Highlights */}
                {Array.isArray(prog.curriculumHighlights) && prog.curriculumHighlights.length > 0 && (
                  <div className="space-y-2 pt-2">
                    <h4 className="font-serif font-bold text-sm text-slate-900">Curriculum Highlights:</h4>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {prog.curriculumHighlights.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2 bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="text-slate-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'vision-mission' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 border-l-4 border-[#1C5496]">
                  <div className="flex items-center space-x-2 text-[#1C5496]">
                    <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                    <h3 className="font-serif font-bold text-base text-slate-900">Academic Vision</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic font-sans">
                    "{prog.vision || department?.vision}"
                  </p>
                </div>

                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3 border-l-4 border-[#C9A84C]">
                  <div className="flex items-center space-x-2 text-amber-800">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <h3 className="font-serif font-bold text-base text-slate-900">Academic Mission</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {prog.mission || department?.mission}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'eligibility' && (
              <div className="space-y-4 max-w-4xl text-slate-700 text-xs sm:text-sm font-sans">
                <div className="bg-blue-50/50 p-5 rounded-2xl border border-blue-100 space-y-2">
                  <h4 className="font-serif font-bold text-sm text-[#1C5496]">Minimum Qualification Requirement:</h4>
                  <p className="text-slate-800 leading-relaxed">
                    {prog.eligibility}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'admission' && (
              <div className="space-y-4 max-w-4xl text-slate-700 text-xs sm:text-sm font-sans">
                <p>
                  Admissions for {prog.code} are conducted through entrance merit (e.g. PGCET / KMAT for PG courses, or 10+2 Merit for UG courses) as well as Management Institutional Quota.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#1C5496] uppercase block">Step 1</span>
                    <h5 className="font-bold text-slate-900 text-xs">Application Submission</h5>
                    <p className="text-[11px] text-slate-500">Submit online/offline form with academic credentials.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#1C5496] uppercase block">Step 2</span>
                    <h5 className="font-bold text-slate-900 text-xs">Document Verification</h5>
                    <p className="text-[11px] text-slate-500">Verification of marks cards and certificates.</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                    <span className="text-[10px] font-mono font-bold text-[#1C5496] uppercase block">Step 3</span>
                    <h5 className="font-bold text-slate-900 text-xs">Admission Confirmation</h5>
                    <p className="text-[11px] text-slate-500">Fee payment and enrollment onboarding.</p>
                  </div>
                </div>

                <div className="pt-3">
                  <a
                    href="https://student.stphiloserp.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-gold px-6 py-2.5 rounded-xl font-bold text-xs inline-flex items-center space-x-2 shadow-md hover:scale-[1.02] transition-transform"
                  >
                    <span>Apply Online on Official ERP Portal</span>
                    <span className="text-xs">↗</span>
                  </a>
                </div>
              </div>
            )}

            {activeTab === 'syllabus' && (
              <div className="space-y-4 max-w-4xl font-sans">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  The curriculum for {prog.title} is designed following the latest autonomous guidelines under University of Mysore.
                </p>
                <a
                  href="/assets/documents/syllabus/ug-nep-syllabus-2026.pdf"
                  download
                  className="btn-primary-blue px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Full Syllabus PDF</span>
                </a>
              </div>
            )}
          </div>

        </div>

        {/* 4. PRIMARY PROGRAMME FACULTY (SHOWN FIRST AS REQUESTED BY USER) */}
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">
                TEACHING FACULTY
              </span>
              <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900">
                {prog.code} Faculty Members
              </h2>
            </div>
            <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full font-mono">
              {primaryFaculty.length} Faculty Members
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8">
            {primaryFaculty.map((fac) => (
              <div
                key={fac.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-4 relative group overflow-hidden"
              >
                {/* Green accent line as shown in official screenshot */}
                <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-emerald-500/80 z-0 pointer-events-none" />

                {/* Arched portrait frame */}
                <Link to={`/faculty/${fac.id}`} className="relative z-10 p-1 bg-white rounded-t-full rounded-b-2xl shadow-sm block cursor-pointer">
                  <FacultyAvatar
                    src={fac.photoVerified ? fac.photoUrl : null}
                    name={fac.name}
                    className="w-32 h-36 sm:w-36 sm:h-40 rounded-t-full rounded-b-2xl object-cover object-top border-2 border-slate-100 bg-slate-50 group-hover:scale-105 transition-transform"
                  />
                </Link>

                <div className="space-y-1.5 w-full relative z-10 pt-1">
                  <Link to={`/faculty/${fac.id}`} className="block">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
                      {fac.name}
                    </h4>
                  </Link>
                  <p className="text-xs text-slate-500 italic font-sans">{fac.designation}</p>
                  {fac.qualification && (
                    <span className="inline-block text-[11px] font-mono text-slate-400 bg-slate-50 px-2.5 py-0.5 rounded border border-slate-100">
                      {fac.qualification}
                    </span>
                  )}
                </div>

                <Link
                  to={`/faculty/${fac.id}`}
                  className="relative z-10 text-xs text-slate-700 hover:text-white hover:bg-[#1C5496] transition-all py-1 px-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center space-x-1.5 font-semibold shadow-2xs group/btn cursor-pointer"
                  title="View Faculty Profile & CV"
                >
                  <FileText className="w-3.5 h-3.5 text-[#1C5496] group-hover/btn:text-white" />
                  <span className="text-[11px]">View Full Profile & CV</span>
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* 5. SECONDARY / ASSOCIATED DEGREE FACULTY (SHOWN BELOW AS REQUESTED BY USER) */}
        {secondaryFaculty.length > 0 && (
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="text-[#C9A84C] font-mono font-bold text-xs uppercase tracking-widest block">
                  ASSOCIATED DEPARTMENT FACULTY
                </span>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                  {secondaryTitle}
                </h2>
              </div>
              <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full font-mono">
                {secondaryFaculty.length} Faculty Members
              </span>
            </div>

            {/* Rendered with Arched Circular Portrait Card Styling matching Image 2 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {secondaryFaculty.map((fac) => (
                <div
                  key={fac.id}
                  className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs hover:shadow-md transition-all flex flex-col items-center text-center space-y-3 relative overflow-hidden group"
                >
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-emerald-600" />
                  
                  <FacultyAvatar
                    src={fac.photoVerified ? fac.photoUrl : null}
                    name={fac.name}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover object-top border-2 border-slate-200 bg-slate-50 shadow-xs group-hover:scale-105 transition-transform mt-2"
                  />

                  <div className="space-y-1 w-full">
                    <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 group-hover:text-emerald-700 transition-colors leading-snug">
                      {fac.name}
                    </h4>
                    <p className="text-xs text-slate-500 font-semibold">{fac.designation}</p>
                    {fac.qualification && (
                      <span className="inline-block text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded">
                        {fac.qualification}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
