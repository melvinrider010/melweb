import React from 'react';
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
  Compass,
  Phone,
  Mail,
  ShieldCheck,
  ChevronRight,
  Download,
  Users
} from 'lucide-react';
import { getProgrammeByCode, PROGRAMME_DETAILS } from '../data/programmeDetailsData';
import { getFacultyByDepartment } from '../data/facultyData';
import FacultyAvatar from '../components/common/FacultyAvatar';

export default function ProgrammeDetailPage() {
  const { programmeCode } = useParams();
  const prog = getProgrammeByCode(programmeCode);

  if (!prog) {
    return (
      <div className="max-w-[1200px] mx-auto py-16 px-4 sm:px-8 text-[#071A33] text-center space-y-6">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
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

  // Related programmes lookup
  const relatedList = (prog.relatedIds || [])
    .map(id => PROGRAMME_DETAILS[id])
    .filter(Boolean);

  // Department faculty lookup
  const deptFaculty = getFacultyByDepartment(prog.deptSlug || prog.department || prog.deptId);

  // Derived lists handling various key naming conventions
  const pedagogyList = prog.curriculumHighlights || prog.pedagogy || [];
  const careerList = prog.careerOpportunities || prog.careers || [];

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
            <span className="text-slate-800 font-bold">{prog.code}</span>
          </div>
        </div>

        {/* 2. PROGRAMME HERO HEADER BANNER */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-6">
          <div className="relative z-10 space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="bg-[#1C5496] text-white font-mono font-extrabold text-xs sm:text-sm px-3 py-1 rounded-md tracking-wider">
                {prog.code}
              </span>
              <span className="bg-blue-50 text-[#1C5496] font-sans font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider border border-blue-100">
                {prog.level}
              </span>
              <span className="bg-amber-50 text-amber-800 font-sans font-semibold text-xs px-3 py-1 rounded-md border border-amber-200/60">
                {prog.stream}
              </span>
            </div>

            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight tracking-tight">
              {prog.title}
            </h1>

            <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed font-sans max-w-3xl">
              {prog.overview}
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-100 relative z-10">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Duration</span>
              <div className="flex items-center space-x-1.5 text-slate-900 font-serif font-bold text-sm sm:text-base">
                <Clock className="w-4 h-4 text-[#1C5496]" />
                <span>{prog.duration}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Degree Title</span>
              <div className="flex items-center space-x-1.5 text-slate-900 font-serif font-bold text-sm sm:text-base">
                <GraduationCap className="w-4 h-4 text-[#1C5496]" />
                <span className="truncate">{prog.degree}</span>
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Department</span>
              <Link to={`/departments/${prog.deptSlug || 'economics'}`} className="flex items-center space-x-1.5 text-[#1C5496] font-serif font-bold text-sm sm:text-base hover:underline">
                <Building2 className="w-4 h-4" />
                <span className="truncate">{prog.department}</span>
              </Link>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">Framework</span>
              <div className="flex items-center space-x-1.5 text-emerald-800 font-serif font-bold text-sm sm:text-base">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Autonomous NEP</span>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to={`/academics/${prog.code.toLowerCase()}/syllabus`}
              className="btn-primary-blue px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center shadow-xs hover:shadow-md"
            >
              <FileText className="w-4 h-4 mr-2" />
              <span>Official Syllabus & Regulations ↗</span>
            </Link>
            <Link
              to={`/departments/${prog.deptSlug || 'economics'}`}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 inline-flex items-center"
            >
              <Building2 className="w-4 h-4 mr-2 text-slate-500" />
              <span>Visit Department Page →</span>
            </Link>
          </div>
        </div>

        {/* 3. MAIN BODY GRID: 8 COLUMNS LEFT (DETAILS) + 4 COLUMNS RIGHT (ADMISSIONS & QUICK NAV) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT 8 COLUMNS: CURRICULUM, OBJECTIVES, PEDAGOGY, CAREERS */}
          <div className="lg:col-span-8 space-y-8">

            {/* A. EDUCATIONAL OBJECTIVES & PROGRAMME OUTCOMES */}
            {prog.objectives && prog.objectives.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1C5496] flex items-center justify-center">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                    Educational Objectives & Learning Outcomes
                  </h2>
                </div>
                <ul className="space-y-3 pt-1">
                  {prog.objectives.map((obj, idx) => (
                    <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                      <CheckCircle2 className="w-4 h-4 text-[#1C5496] shrink-0 mt-0.5" />
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* B. CORE DISCIPLINES & SUBJECT DOMAINS */}
            {prog.disciplines && prog.disciplines.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                    Core Disciplines & Curriculum Pillars
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {prog.disciplines.map((disc, idx) => {
                    const title = typeof disc === 'string' ? disc : (disc.name || disc.title || `Pillar ${idx + 1}`);
                    const desc = typeof disc === 'string' ? '' : (disc.desc || disc.description || '');
                    return (
                      <div
                        key={idx}
                        className="p-4 rounded-xl bg-slate-50/80 border border-slate-200/90 hover:border-[#1C5496]/40 transition-colors space-y-1.5"
                      >
                        <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 flex items-center space-x-2">
                          <span className="w-2 h-2 rounded-full bg-[#1C5496] shrink-0" />
                          <span>{title}</span>
                        </h4>
                        {desc && (
                          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans pl-4">
                            {desc}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* C. PEDAGOGY & PRACTICAL EXPOSURE */}
            {pedagogyList.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                    Pedagogical Highlights & Practical Training
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  {pedagogyList.map((ped, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs sm:text-sm text-slate-700 font-medium flex items-start space-x-2.5">
                      <ChevronRight className="w-4 h-4 text-[#1C5496] shrink-0 mt-0.5" />
                      <span>{ped}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* D. CAREER PATHWAYS & INDUSTRY PROSPECTS */}
            {careerList.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
                    <Briefcase className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                    Career Opportunities & Professional Pathways
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {careerList.map((career, idx) => (
                    <span
                      key={idx}
                      className="bg-slate-100 text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* E. DEPARTMENT FACULTY MEMBERS */}
            {deptFaculty.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1C5496] flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                      Programme Faculty ({prog.department})
                    </h2>
                  </div>
                  <Link
                    to={`/departments/${prog.deptSlug || 'economics'}`}
                    className="text-xs font-bold text-[#1C5496] hover:underline"
                  >
                    View All Faculty →
                  </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                  {deptFaculty.slice(0, 4).map((fac) => (
                    <Link
                      key={fac.id}
                      to={`/departments/${fac.deptId}/faculty/${fac.id}`}
                      className="p-3.5 bg-slate-50 hover:bg-white hover:border-[#1C5496] hover:shadow-md border border-slate-200 rounded-2xl transition-all flex items-center space-x-3.5 group"
                    >
                      <FacultyAvatar 
                        src={fac.image} 
                        name={fac.name} 
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover object-top shrink-0 border border-slate-300 group-hover:scale-105 transition-transform shadow-xs" 
                      />
                      <div className="min-w-0 space-y-0.5">
                        <h4 className="font-serif font-bold text-sm text-slate-900 group-hover:text-[#1C5496] transition-colors truncate">
                          {fac.name}
                        </h4>
                        <p className="text-xs text-[#1C5496] font-semibold truncate">{fac.designation}</p>
                        <p className="text-[11px] text-slate-500 truncate">{fac.qualification}</p>
                        <span className="text-[10px] font-bold text-[#1C5496] group-hover:underline inline-flex items-center pt-0.5">
                          View Profile →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* F. CURRICULUM DOCUMENTS & SYLLABUS SECTION */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1C5496] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                  Curriculum Documents & Official Syllabus
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <Link
                  to={`/academics/${prog.code.toLowerCase()}/syllabus`}
                  className="p-4 rounded-xl bg-blue-50/70 hover:bg-blue-100/80 border border-blue-200 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="font-serif font-bold text-sm text-[#1C5496] block group-hover:underline">
                      View Full Semester Syllabus Scheme
                    </span>
                    <span className="text-[11px] text-slate-600 font-mono block">Interactive Course Structure</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#1C5496] group-hover:translate-x-1 transition-transform shrink-0 ml-2" />
                </Link>

                <a
                  href={prog.syllabusDoc || '/assets/documents/academic-regulations.pdf'}
                  download
                  className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 transition-colors flex items-center justify-between group"
                >
                  <div className="space-y-1">
                    <span className="font-serif font-bold text-sm text-slate-900 block group-hover:text-[#1C5496]">
                      Download Official Syllabus PDF
                    </span>
                    <span className="text-[11px] text-slate-500 font-mono block">NEP 2020 Manual</span>
                  </div>
                  <Download className="w-4 h-4 text-[#1C5496] group-hover:scale-110 transition-transform shrink-0 ml-2" />
                </a>
              </div>
            </div>

          </div>

          {/* RIGHT 4 COLUMNS: ADMISSIONS CTA & SIDEBAR */}
          <div className="lg:col-span-4 space-y-6">

            {/* 1. ADMISSIONS APPLY CARD */}
            <div className="bg-[#071A33] text-white p-6 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-800 shadow-xl space-y-5 relative overflow-hidden">
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#FFD84A] block">
                  ADMISSIONS 2026–27
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white">
                  Apply for {prog.code}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Join St. Philomena's College (Autonomous), Mysuru. Online and offline application forms are now open for the Academic Year 2026–27.
                </p>
              </div>

              <div className="p-3.5 bg-slate-900/90 rounded-xl border border-slate-700/80 space-y-2 text-xs">
                <span className="font-bold text-[#FFD84A] block uppercase text-[11px]">Eligibility Criteria:</span>
                <p className="text-slate-300 leading-relaxed text-[11.5px]">
                  {prog.eligibility}
                </p>
              </div>

              <div className="space-y-2.5 pt-2">
                <Link
                  to="/admissions"
                  className="btn-gold w-full text-center py-3 block rounded-xl font-bold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
                >
                  Apply Online (Admissions Portal)
                </Link>
                <Link
                  to="/contact"
                  className="w-full text-center py-2.5 block rounded-xl border border-slate-600 bg-slate-800/80 hover:bg-slate-800 text-xs font-semibold text-slate-200 transition-colors"
                >
                  Contact Admissions Helpdesk
                </Link>
              </div>
            </div>

            {/* 2. DEPARTMENT BOX */}
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">
                OFFERING DEPARTMENT
              </span>
              <h4 className="font-serif font-bold text-base text-slate-900">
                {prog.department}
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                St. Philomena's College (Autonomous), Bannimantap, Mysuru, Karnataka.
              </p>
              <Link
                to={`/departments/${prog.deptSlug || 'economics'}`}
                className="inline-flex items-center text-xs font-bold text-[#1C5496] hover:underline pt-1"
              >
                <span>Visit Department Overview Page</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Link>
            </div>

            {/* 3. RELATED PROGRAMMES */}
            {relatedList.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/90 p-6 shadow-xs space-y-4">
                <h4 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                  Related Programmes
                </h4>
                <div className="space-y-2.5">
                  {relatedList.map((rel) => (
                    <Link
                      key={rel.id}
                      to={`/academics/${rel.code.toLowerCase()}`}
                      className="p-3 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200/80 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-serif font-bold text-xs text-slate-900 group-hover:text-[#1C5496] block">
                          {rel.code} — {rel.degree}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {rel.level} • {rel.stream}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1C5496] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* 4. ALL PROGRAMMES LINK */}
            <div className="p-4 bg-slate-50 border border-slate-200/80 rounded-2xl text-center">
              <Link
                to="/academics"
                className="text-xs font-bold text-[#1C5496] hover:underline"
              >
                ← Back to All Academic Programmes
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
