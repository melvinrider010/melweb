import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  ArrowLeft, 
  ArrowRight,
  BookOpen, 
  Users, 
  Mail, 
  Phone,
  CheckCircle2, 
  FileText, 
  Sparkles, 
  Award, 
  Target,
  Clock,
  GraduationCap,
  TrendingUp,
  ChevronRight
} from 'lucide-react';
import { 
  getDepartmentById, 
  getFacultyByDepartmentId, 
  getProgrammeById, 
  DEPARTMENTS 
} from '../data/academicsHierarchyData';
import FacultyAvatar from '../components/common/FacultyAvatar';
import useCms from '../lib/useCms';

export default function DepartmentDetailPage() {
  const { deptId } = useParams();
  const dept = getDepartmentById(deptId);
  const deptFaculty = useCms(() => dept ? getFacultyByDepartmentId(dept.id) : [], [deptId, dept?.id]);

  if (!dept) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-16 px-4 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-2xl font-serif font-bold text-slate-800">Academic Department Not Found</h2>
        <p className="text-sm text-slate-600">The department identifier "{deptId}" could not be located.</p>
        <Link to="/departments" className="mt-4 px-4 py-2 bg-[#1C5496] text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
          View All Departments
        </Link>
      </div>
    );
  }

  const ugList = (dept.ugProgrammes || []).map(id => getProgrammeById(id)).filter(Boolean);
  const pgList = (dept.pgProgrammes || []).map(id => getProgrammeById(id)).filter(Boolean);
  const pathways = dept.pathways || [];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* 1. BACK NAVIGATION BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <Link
            to="/departments"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#1C5496] hover:text-[#071A33] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Academic Departments</span>
          </Link>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 font-mono">
            <Link to="/departments" className="hover:text-[#1C5496]">DEPARTMENTS</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold uppercase">{dept.shortName || dept.id}</span>
          </div>
        </div>

        {/* 2. DEPARTMENT HERO BANNER */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-[#1C5496] text-white font-mono font-extrabold text-xs sm:text-sm px-3 py-1 rounded-md tracking-wider">
              {dept.faculty || 'St. Philomena’s College'}
            </span>
            <span className="bg-emerald-50 text-emerald-800 font-sans font-semibold text-xs px-3 py-1 rounded-md border border-emerald-200/60 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Autonomous Department
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {dept.photoUrl && dept.photoVerified && (
              <div className="md:col-span-5">
                <img
                  src={dept.photoUrl}
                  alt={dept.name}
                  className="w-full h-48 sm:h-56 object-cover rounded-2xl border border-slate-200 shadow-xs"
                />
              </div>
            )}
            <div className={`${dept.photoUrl && dept.photoVerified ? 'md:col-span-7' : 'md:col-span-12'} space-y-3`}>
              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
                {dept.name}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans max-w-4xl pt-1">
                {dept.description}
              </p>
            </div>
          </div>

          {/* Key Department Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty Roster</span>
              <span className="font-serif font-bold text-sm text-slate-900">{deptFaculty.length} Teaching Faculty</span>
              <span className="text-[11px] text-slate-500 block">Professors, Readers & Lecturers</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Degree Programmes</span>
              <span className="font-mono text-xs text-[#1C5496] block truncate">
                {ugList.length} UG Stream(s) • {pgList.length} PG Stream(s)
              </span>
              <span className="text-[11px] text-slate-500 block">Undergraduate & Master's</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Regulations</span>
              <span className="text-xs text-slate-800 font-serif font-bold block">Autonomous NEP 2020 / CBCS</span>
              <span className="text-[11px] text-slate-500 block">Affiliated to University of Mysore</span>
            </div>
          </div>
        </div>

        {/* 3. MAIN CONTENT (8 COLUMNS) & SIDEBAR (4 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main 8 Columns */}
          <div className="lg:col-span-8 space-y-8">

            {/* A. ACADEMIC PATHWAYS */}
            {pathways.length > 0 && (
              <div className="bg-gradient-to-br from-[#0B1F4E] to-[#1C5496] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-md space-y-4 border border-blue-900">
                <div className="flex items-center space-x-2.5 border-b border-white/10 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A84C] text-[#0B1F4E] flex items-center justify-center font-bold">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#F0D98C] font-bold block">
                      ACADEMIC CONTINUUM
                    </span>
                    <h2 className="font-serif font-bold text-lg sm:text-xl text-white">
                      Undergraduate to Postgraduate Progression Pathways
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {pathways.map((path, pIdx) => {
                    const targetProg = getProgrammeById(path.targetId || path.to);
                    return (
                      <div 
                        key={pIdx}
                        className="bg-white/10 backdrop-blur-md rounded-xl p-4 border border-white/15 space-y-2"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="font-serif font-bold text-sm text-[#F0D98C]">
                            {path.title}
                          </span>
                          {targetProg && (
                            <Link
                              to={`/academics/${targetProg.code.toLowerCase()}`}
                              className="text-xs font-bold text-white hover:underline inline-flex items-center"
                            >
                              <span>Explore Degree</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-1" />
                            </Link>
                          )}
                        </div>
                        {path.description && (
                          <p className="text-xs text-slate-200 leading-relaxed font-sans">
                            {path.description}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* B. VISION & MISSION */}
            {(dept.vision || dept.mission) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {dept.vision && (
                  <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 border-l-4 border-[#1C5496]">
                    <div className="flex items-center space-x-2 text-[#1C5496]">
                      <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                      <h3 className="font-serif font-bold text-lg text-slate-900">Departmental Vision</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans italic">
                      "{dept.vision}"
                    </p>
                  </div>
                )}
                {dept.mission && (
                  <div className="bg-white p-6 sm:p-7 rounded-2xl border border-slate-200/90 shadow-xs space-y-3 border-l-4 border-[#C9A84C]">
                    <div className="flex items-center space-x-2 text-amber-800">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <h3 className="font-serif font-bold text-lg text-slate-900">Departmental Mission</h3>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                      {dept.mission}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* C. PRESENT FACULTY ROSTER */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1C5496] flex items-center justify-center">
                    <Users className="w-4 h-4" />
                  </div>
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                    Faculty Members
                  </h2>
                </div>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {deptFaculty.length} Verified Staff
                </span>
              </div>

              {deptFaculty.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deptFaculty.map((fac) => (
                    <Link
                      key={fac.id}
                      to={`/faculty/${fac.id}`}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#1C5496] hover:shadow-md transition-all group flex items-start space-x-4 block"
                    >
                      <FacultyAvatar
                        src={fac.photoUrl || fac.image}
                        name={fac.name}
                        className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl object-cover object-top shrink-0 border border-slate-300 group-hover:scale-105 transition-transform shadow-xs"
                      />
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 group-hover:text-[#1C5496] transition-colors truncate">
                          {fac.name}
                        </h4>
                        <p className="text-xs text-[#1C5496] font-semibold truncate">
                          {fac.designation}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {fac.qualification}
                        </p>
                        <span className="text-[10px] text-[#1C5496] font-bold group-hover:underline inline-flex items-center pt-1">
                          View Full CV & Profile →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Official faculty profiles being cataloged from department archives.</p>
              )}
            </div>

          </div>

          {/* Sidebar 4 Columns */}
          <div className="lg:col-span-4 space-y-6">

            {/* UG Degrees */}
            {ugList.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Undergraduate Streams</span>
                <h3 className="font-serif font-bold text-base text-slate-900">UG Degrees in {dept.shortName}</h3>
                <div className="space-y-2.5">
                  {ugList.map((prog) => (
                    <Link
                      key={prog.id}
                      to={`/academics/${prog.code.toLowerCase()}`}
                      className="p-3 bg-slate-50 hover:bg-blue-50/70 rounded-xl border border-slate-200 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-serif font-bold text-xs text-slate-900 group-hover:text-[#1C5496] block">
                          {prog.code} — {prog.degree || prog.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {prog.duration}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-[#1C5496] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* PG Degrees */}
            {pgList.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Postgraduate Degrees</span>
                <h3 className="font-serif font-bold text-base text-slate-900">Master's Streams in {dept.shortName}</h3>
                <div className="space-y-2.5">
                  {pgList.map((prog) => (
                    <Link
                      key={prog.id}
                      to={`/academics/${prog.code.toLowerCase()}`}
                      className="p-3 bg-blue-50/60 hover:bg-blue-100/70 rounded-xl border border-blue-200/80 transition-colors flex items-center justify-between group"
                    >
                      <div>
                        <span className="font-serif font-bold text-xs text-[#0B1F4E] group-hover:text-[#1C5496] block">
                          {prog.code} — {prog.degree || prog.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {prog.duration}
                        </span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-[#1C5496] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Admissions Apply Card */}
            <div className="bg-[#071A33] text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#FFD84A] block">
                ADMISSIONS 2026–27
              </span>
              <h3 className="font-serif font-bold text-xl text-white">Apply to {dept.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Admissions for all UG and PG degree combinations offered by {dept.name} are open for 2026–27.
              </p>
              <a
                href="https://student.stphiloserp.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold w-full py-2.5 rounded-xl text-xs font-bold text-center block"
              >
                Apply for Admissions Now (ERP Portal)
              </a>
            </div>

            {/* Back to Academics */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-2">
              <Link to="/academics" className="text-xs font-bold text-[#1C5496] hover:underline block">
                ← Explore All Academic Programmes
              </Link>
              <Link to="/departments" className="text-xs font-bold text-slate-600 hover:underline block">
                Browse All Academic Departments
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
