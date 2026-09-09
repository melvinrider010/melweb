import React, { useState, useEffect } from 'react';
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
  ChevronRight, 
  Download, 
  MapPin, 
  FolderGit2,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { 
  getFacultyByDepartmentId, 
  getProgrammeById, 
  getDepartmentContinuumProgrammes 
} from '../data/academicsHierarchyData';
import FacultyAvatar from '../components/common/FacultyAvatar';
import { getDepartments } from '../services/departmentsService';

export default function DepartmentDetailPage() {
  const { deptId } = useParams();
  const [dept, setDept] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    async function loadDepartment() {
      setIsLoading(true);
      setError(null);
      try {
        const list = await getDepartments();
        if (isMounted) {
          const raw = String(deptId || '').toLowerCase().trim();
          const clean = raw.replace(/^dept[-_]/, '');
          const withPrefix = `dept-${clean}`;
          
          const found = (list || []).find(d => {
            const dId = (d.id || '').toLowerCase();
            const dSlug = (d.slug || '').toLowerCase();
            const dCode = (d.code || '').toLowerCase();
            return dId === raw || dId === clean || dId === withPrefix ||
                   dSlug === raw || dSlug === clean || dSlug === withPrefix ||
                   dCode === raw || dCode === clean ||
                   d.name.toLowerCase().includes(clean);
          });

          if (found) {
            setDept(found);
          } else {
            setError(`The academic department "${deptId}" could not be located.`);
          }
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to retrieve department details.');
          setIsLoading(false);
        }
      }
    }
    loadDepartment();
    return () => { isMounted = false; };
  }, [deptId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-24 px-4 flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-10 h-10 text-[#1C5496] animate-spin mx-auto" />
        <h2 className="text-xl font-serif font-bold text-slate-800">Loading Department Profile...</h2>
        <p className="text-xs text-slate-500">Connecting to St. Philomena's academic repository</p>
      </div>
    );
  }

  if (error || !dept) {
    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-16 px-4 flex flex-col items-center justify-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
        <h2 className="text-2xl font-serif font-bold text-slate-800">Academic Department Not Found</h2>
        <p className="text-sm text-slate-600">{error || `The department identifier "${deptId}" could not be located.`}</p>
        <Link to="/departments" className="mt-4 px-4 py-2 bg-[#1C5496] text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition-colors">
          View All Departments
        </Link>
      </div>
    );
  }

  const deptFaculty = getFacultyByDepartmentId(dept.id);
  const deptSyllabuses = dept.syllabuses || [];
  const deptDocs = dept.departmentDocs || [];

  const ugList = (dept.ugProgrammes || []).map(id => getProgrammeById(id)).filter(Boolean);
  const pgList = (dept.pgProgrammes || []).map(id => getProgrammeById(id)).filter(Boolean);
  const continuum = getDepartmentContinuumProgrammes(dept);
  const pathways = dept.pathways || [];
  const facilities = Array.isArray(dept.facilities) ? dept.facilities : [];

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
            <span className="text-slate-800 font-bold uppercase">{dept.shortName || dept.code || dept.id}</span>
          </div>
        </div>

        {/* 2. DEPARTMENT HERO BANNER */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-[#0B1F4E] text-white font-mono font-extrabold text-xs sm:text-sm px-3.5 py-1 rounded-md tracking-wider">
              {dept.faculty || dept.facultyName || 'St. Philomena’s College'}
            </span>
            <span className="bg-emerald-50 text-emerald-800 font-sans font-semibold text-xs px-3 py-1 rounded-md border border-emerald-200/60 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Autonomous Academic Department
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {dept.photoUrl && (
              <div className="md:col-span-5">
                <img
                  src={dept.photoUrl}
                  alt={dept.name}
                  className="w-full h-48 sm:h-56 object-cover rounded-2xl border border-slate-200 shadow-xs"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            <div className={`${dept.photoUrl ? 'md:col-span-7' : 'md:col-span-12'} space-y-3`}>
              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
                {dept.name}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans max-w-4xl pt-1">
                {dept.description}
              </p>
            </div>
          </div>

          {/* Department Degree Continuum Switcher Strip */}
          {continuum.programmes.length > 0 && (
            <div className="bg-gradient-to-r from-blue-50/90 via-slate-50 to-amber-50/70 p-4 sm:p-5 rounded-2xl border border-blue-100/90 shadow-2xs space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center space-x-2">
                  <div className="w-7 h-7 rounded-lg bg-[#1C5496] text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1C5496] block">
                      DEPARTMENT DEGREE CONTINUUM & PROGRAMMES
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                      Explore Degrees Offered by {dept.shortName || dept.name}
                    </h3>
                  </div>
                </div>
                <span className="text-xs font-semibold text-slate-500 font-mono">
                  {continuum.programmes.length} Academic Degree{continuum.programmes.length > 1 ? 's' : ''}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                {continuum.programmes.map((p) => (
                  <Link
                    key={p.id}
                    to={p.link}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#0B1F4E] text-[#1C5496] hover:text-[#FFD84A] border-2 border-slate-200 hover:border-[#C9A84C] font-mono font-bold text-xs sm:text-sm shadow-2xs hover:shadow-md transition-all duration-150 transform hover:-translate-y-0.5 group"
                    title={`Explore ${p.title}`}
                  >
                    <BookOpen className="w-4 h-4 text-[#1C5496] group-hover:text-[#FFD84A] transition-colors" />
                    <span>{p.code}</span>
                    <span className="text-[10px] uppercase font-sans font-semibold text-slate-600 group-hover:text-amber-200 bg-slate-100 group-hover:bg-white/20 px-2 py-0.5 rounded transition-colors">
                      {p.level || p.type.toUpperCase()}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FFD84A] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Key Department Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty Staff</span>
              <span className="font-serif font-bold text-sm text-slate-900">{deptFaculty.length} Teaching Members</span>
              <span className="text-[11px] text-slate-500 block">Professors, Readers & Lecturers</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Curriculum Schemes</span>
              <span className="font-mono text-xs text-[#1C5496] block truncate">
                {deptSyllabuses.length > 0 ? `${deptSyllabuses.length} Syllabus Structure(s)` : `${ugList.length + pgList.length} Degree Streams`}
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

            {/* C. FACILITIES & LABORATORIES */}
            {facilities.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-800 flex items-center justify-center">
                    <Building2 className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-xl text-slate-900">Laboratories & Departmental Facilities</h3>
                    <p className="text-xs text-slate-500">Specialized infrastructure and equipment available to students</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5 pt-1">
                  {facilities.map((fac, fIdx) => (
                    <div key={fIdx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 flex items-start space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-slate-800 font-medium">{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* D. DEPARTMENT SYLLABUS & CURRICULUM SCHEMES */}
            {deptSyllabuses.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#1C5496] flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl text-slate-900">Syllabus & Course Regulations</h3>
                      <p className="text-xs text-slate-500">Autonomous curriculum outlines and semester schemes</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  {deptSyllabuses.map((syl) => (
                    <div key={syl.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="bg-[#0B1F4E] text-[#FFD84A] font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                            {syl.code}
                          </span>
                          <span className="text-xs font-serif font-bold text-slate-900">{syl.title}</span>
                        </div>
                        <p className="text-xs text-slate-600">{syl.degree} · {syl.regulation}</p>
                      </div>

                      <a
                        href={syl.localPdf || '/assets/documents/academic-regulations.pdf'}
                        download
                        className="btn-navy px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center space-x-1.5 shadow-2xs self-start sm:self-auto shrink-0"
                      >
                        <Download className="w-3.5 h-3.5 text-[#FFD84A]" />
                        <span>Download Syllabus PDF</span>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* E. PRESENT FACULTY ROSTER */}
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

            {/* Department Office & Contact Info */}
            {(dept.email || dept.phone || dept.office) && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-serif font-bold text-base text-slate-900 border-b pb-2 flex items-center">
                  <Building2 className="w-4 h-4 mr-2 text-[#0B1F4E]" />
                  <span>Department Contact Desk</span>
                </h3>
                <div className="space-y-2.5 text-xs text-slate-600">
                  {dept.office && (
                    <p className="flex items-start">
                      <MapPin className="w-4 h-4 mr-2 text-[#C9A84C] shrink-0 mt-0.5" />
                      <span>{dept.office}</span>
                    </p>
                  )}
                  {dept.email && (
                    <p className="flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-[#1C5496] shrink-0" />
                      <a href={`mailto:${dept.email}`} className="text-[#1C5496] hover:underline font-medium">
                        {dept.email}
                      </a>
                    </p>
                  )}
                  {dept.phone && (
                    <p className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-[#1C5496] shrink-0" />
                      <a href={`tel:${dept.phone}`} className="font-mono text-slate-800 hover:underline">
                        {dept.phone}
                      </a>
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Department Files & Lab Manuals */}
            {deptDocs.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Student Downloads</span>
                <h3 className="font-serif font-bold text-base text-slate-900">Departmental Files & Manuals</h3>
                <div className="space-y-2">
                  {deptDocs.map((d) => (
                    <a
                      key={d.id}
                      href={d.localPath || '/assets/documents/academic-regulations.pdf'}
                      download
                      className="p-3 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 flex items-center justify-between transition-colors group"
                    >
                      <div className="min-w-0 pr-2">
                        <span className="font-serif font-bold text-xs text-slate-900 block truncate group-hover:text-[#1C5496]">
                          {d.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          {d.category || 'PDF File'} · {d.year || '2026'}
                        </span>
                      </div>
                      <Download className="w-4 h-4 text-slate-400 group-hover:text-[#1C5496] shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* UG Degrees */}
            {ugList.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3.5">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Undergraduate Streams</span>
                <h3 className="font-serif font-bold text-base text-slate-900">UG Degrees in {dept.shortName || dept.name}</h3>
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
                <h3 className="font-serif font-bold text-base text-slate-900">Master's Streams in {dept.shortName || dept.name}</h3>
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
