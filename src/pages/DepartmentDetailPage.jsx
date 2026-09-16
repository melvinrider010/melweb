import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
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
  AlertTriangle,
  Calendar,
  Bell,
  Eye,
  Edit3,
  ExternalLink
} from 'lucide-react';
import { 
  getFacultyByDepartmentId, 
  getProgrammeById, 
  getDepartmentContinuumProgrammes,
  getDepartmentRelatedProgrammes 
} from '../data/academicsHierarchyData';
import FacultyAvatar from '../components/common/FacultyAvatar';
import * as deptService from '../services/departmentsService';

export default function DepartmentDetailPage() {
  const { deptId } = useParams();
  const [searchParams] = useSearchParams();
  const isPreview = searchParams.get('preview') === '1';

  const [dept, setDept] = useState(null);
  const [sections, setSections] = useState([]);
  const [facultyList, setFacultyList] = useState([]);
  const [programmesList, setProgrammesList] = useState([]);
  const [noticesList, setNoticesList] = useState([]);
  const [eventsList, setEventsList] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    async function loadDepartment() {
      setIsLoading(true);
      setError(null);
      try {
        const res = await deptService.getDepartmentBySlugOrId(deptId, isPreview);
        
        if (isMounted && res?.department) {
          setDept(res.department);
          setSections(res.sections || []);
          setFacultyList(res.faculty || []);
          setProgrammesList(res.programmes || []);
          setNoticesList(res.notices || []);
          setEventsList(res.events || []);
          setIsLoading(false);
          return;
        }

        // Fallback to static list lookup if backend structure is different
        const list = await deptService.getDepartments();
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
            setSections(found.sections || []);
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
  }, [deptId, isPreview]);

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

  // Fallbacks for faculty / programmes if empty
  const activeFaculty = facultyList.length > 0 ? facultyList : getFacultyByDepartmentId(dept.id);
  const continuum = getDepartmentContinuumProgrammes(dept);
  const relatedProgramme = getDepartmentRelatedProgrammes(dept);

  // Filter only enabled sections
  const enabledSections = sections.filter(s => s.is_enabled !== false);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* PREVIEW ALERT BANNER */}
        {isPreview && (
          <div className="bg-amber-500 text-slate-950 p-4 rounded-2xl shadow-md border-2 border-amber-600 flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
            <div className="flex items-center space-x-3">
              <Eye className="w-6 h-6 shrink-0" />
              <div>
                <h4 className="font-bold text-sm">CMS Draft Preview Mode</h4>
                <p className="text-xs">You are viewing the unpublished draft changes for this department. These changes are NOT visible on the public website until published.</p>
              </div>
            </div>
            <Link
              to={`/admin/department-pages/${dept.id}/edit`}
              className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-950 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-colors shrink-0"
            >
              <Edit3 className="w-4 h-4" />
              <span>Return to CMS Editor</span>
            </Link>
          </div>
        )}

        {/* 1. HERO & IDENTITY CARD */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <Link 
              to="/departments" 
              className="inline-flex items-center space-x-2 text-xs font-bold text-[#1C5496] hover:text-blue-800 transition-colors uppercase tracking-wider"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Academic Directory</span>
            </Link>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#1C5496] border border-blue-200">
                {dept.faculty_category || dept.category || 'Academic Division'}
              </span>
              {dept.code && (
                <span className="px-2.5 py-1 rounded-full text-[11px] font-mono font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                  {dept.code}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {(dept.banner_image || dept.photoUrl) && (
              <div className="md:col-span-5 relative rounded-2xl overflow-hidden shadow-sm aspect-video sm:aspect-4/3 max-h-72">
                <img 
                  src={dept.banner_image || dept.photoUrl} 
                  alt={dept.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => { e.target.style.display = 'none'; }}
                />
              </div>
            )}
            <div className={`${(dept.banner_image || dept.photoUrl) ? 'md:col-span-7' : 'md:col-span-12'} space-y-3`}>
              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
                {dept.name}
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans max-w-4xl pt-1">
                {dept.short_description || dept.description}
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Faculty Members</span>
              <span className="font-serif font-bold text-sm text-slate-900">{activeFaculty.length} Teaching Scholars</span>
              <span className="text-[11px] text-slate-500 block">Professors, Readers & Lecturers</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Continuum</span>
                <span className="font-mono text-xs text-[#1C5496] block truncate font-semibold">
                  {relatedProgramme ? `${relatedProgramme.code} Available` : (programmesList.length > 0 ? `${programmesList.length} Active Programme(s)` : `${(dept.programmes || []).length} Degree Streams`)}
                </span>
                <span className="text-[11px] text-slate-500 block">Undergraduate & Postgraduate</span>
              </div>
              {relatedProgramme && (
                <Link 
                  to={relatedProgramme.route}
                  className="mt-1 text-[11px] font-bold text-[#1C5496] hover:text-blue-800 flex items-center gap-1 group"
                >
                  <span>Explore {relatedProgramme.buttonText}</span>
                  <ArrowRight className="w-3 h-3 text-[#FFD84A] group-hover:translate-x-0.5 transition-transform" />
                </Link>
              )}
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Academic Regulations</span>
              <span className="text-xs text-slate-800 font-serif font-bold block">Autonomous NEP 2020 / CBCS</span>
              <span className="text-[11px] text-slate-500 block">Affiliated to University of Mysore</span>
            </div>
          </div>
        </div>

        {/* 3. DYNAMIC SECTION RENDERING ENGINE */}
        {enabledSections.length > 0 ? (
          <div className="space-y-10">
            {enabledSections.map((section, idx) => (
              <DepartmentSectionRenderer
                key={section.id || idx}
                section={section}
                department={dept}
                facultyList={activeFaculty}
                programmesList={programmesList}
                noticesList={noticesList}
                eventsList={eventsList}
              />
            ))}
          </div>
        ) : (
          /* Fallback Standard Layout if no sections are defined yet */
          <div className="space-y-8">
            <div className="bg-white rounded-2xl p-8 border border-slate-200 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-100 pb-4">
                <h3 className="font-serif font-bold text-xl text-slate-900">About the Department</h3>
                {relatedProgramme && (
                  <Link
                    to={relatedProgramme.route}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-[#0B1F4E] to-[#1C5496] hover:from-[#1C5496] hover:to-[#0B1F4E] text-white rounded-xl shadow-xs hover:shadow-md transition-all group shrink-0 border border-blue-900/30"
                  >
                    <GraduationCap className="w-3.5 h-3.5 text-[#FFD84A]" />
                    <span className="text-xs font-bold font-serif">{relatedProgramme.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFD84A] group-hover:translate-x-1 transition-transform ml-0.5" />
                  </Link>
                )}
              </div>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans whitespace-pre-line">
                {dept.description}
              </p>

              {relatedProgramme && (
                <div className="mt-5 p-4 sm:p-5 bg-gradient-to-br from-blue-50/70 via-slate-50 to-blue-50/30 rounded-2xl border border-blue-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start sm:items-center space-x-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#0B1F4E] text-[#FFD84A] flex items-center justify-center shrink-0 shadow-xs">
                      <GraduationCap className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#0B1F4E] text-[#FFD84A]">
                          {relatedProgramme.badge}
                        </span>
                        <span className="text-xs text-[#1C5496] font-semibold">Academic Continuum</span>
                      </div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 mt-1">
                        {relatedProgramme.fullTitle}
                      </h4>
                      <p className="text-xs text-slate-600 font-sans mt-0.5 max-w-2xl leading-relaxed">
                        {relatedProgramme.description}
                      </p>
                    </div>
                  </div>
                  <Link
                    to={relatedProgramme.route}
                    className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-[#0B1F4E] hover:bg-[#1C5496] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm transition-all group shrink-0"
                  >
                    <span>{relatedProgramme.buttonText}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FFD84A] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

/**
 * Universal Section Renderer for Modular Department CMS Sections
 */
function DepartmentSectionRenderer({ section, department, facultyList, programmesList, noticesList, eventsList }) {
  const content = section.content || {};

  switch (section.type) {
    
    // --- 1. TEXT / OVERVIEW SECTION ---
    case 'text': {
      const isAboutSection = (content.heading || section.title || '').toLowerCase().includes('about') || section.id?.includes('about') || section.display_order === 1;
      const relatedProg = isAboutSection ? getDepartmentRelatedProgrammes(department) : null;

      return (
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div className="space-y-1">
              {content.subheading && (
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#1C5496] font-bold block">
                  {content.subheading}
                </span>
              )}
              <h2 className="font-serif font-bold text-2xl text-slate-900">
                {content.heading || section.title}
              </h2>
            </div>

            {relatedProg && (
              <Link
                to={relatedProg.route}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-[#0B1F4E] to-[#1C5496] hover:from-[#1C5496] hover:to-[#0B1F4E] text-white rounded-xl shadow-xs hover:shadow-md transition-all group shrink-0 border border-blue-900/30"
                title={`Navigate to ${relatedProg.fullTitle}`}
              >
                <div className="w-6 h-6 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-3.5 h-3.5 text-[#FFD84A]" />
                </div>
                <div className="text-left">
                  <span className="text-[9px] uppercase font-mono tracking-wider text-blue-200 block font-semibold leading-none">
                    {relatedProg.badge}
                  </span>
                  <span className="text-xs sm:text-sm font-bold font-serif leading-tight text-white block">
                    {relatedProg.buttonText}
                  </span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#FFD84A] group-hover:translate-x-1 transition-transform ml-0.5" />
              </Link>
            )}
          </div>

          <div className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans whitespace-pre-line space-y-3 pt-1">
            {content.body}
          </div>

          {relatedProg && (
            <div className="mt-5 p-4 sm:p-5 bg-gradient-to-br from-blue-50/70 via-slate-50 to-blue-50/30 rounded-2xl border border-blue-100/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start sm:items-center space-x-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0B1F4E] text-[#FFD84A] flex items-center justify-center shrink-0 shadow-xs mt-0.5 sm:mt-0">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#0B1F4E] text-[#FFD84A]">
                      {relatedProg.badge}
                    </span>
                    <span className="text-xs text-[#1C5496] font-semibold">
                      Academic Continuum
                    </span>
                  </div>
                  <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 mt-1">
                    {relatedProg.fullTitle}
                  </h4>
                  <p className="text-xs text-slate-600 font-sans mt-0.5 max-w-2xl leading-relaxed">
                    {relatedProg.description}
                  </p>
                </div>
              </div>
              <Link
                to={relatedProg.route}
                className="inline-flex items-center justify-center space-x-2 px-4 py-2 bg-[#0B1F4E] hover:bg-[#1C5496] text-white text-xs font-bold rounded-xl shadow-xs hover:shadow-sm transition-all group shrink-0 self-stretch sm:self-auto text-center"
              >
                <span>{relatedProg.buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#FFD84A] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          )}
        </section>
      );
    }

    // --- 2. CARDS / HIGHLIGHTS SECTION ---
    case 'cards':
      return (
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            {content.subheading && (
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#1C5496] font-bold block">
                {content.subheading}
              </span>
            )}
            <h2 className="font-serif font-bold text-2xl text-slate-900">
              {content.heading || section.title}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {(content.cards || []).map((card, cIdx) => (
              <div key={card.id || cIdx} className="p-6 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2.5">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0B1F4E] text-[#FFD84A] flex items-center justify-center font-bold">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-base text-slate-900">{card.title}</h4>
                    {card.subtitle && <p className="text-[11px] text-[#1C5496] font-semibold">{card.subtitle}</p>}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans pt-1">
                  {card.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      );

    // --- 3. PROGRAMMES ROSTER SECTION ---
    case 'programs':
      return (
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            {content.subheading && (
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#1C5496] font-bold block">
                {content.subheading}
              </span>
            )}
            <h2 className="font-serif font-bold text-2xl text-slate-900">
              {content.heading || 'Academic Programmes'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(programmesList || []).map((p) => (
              <Link
                key={p.code}
                to={`/academics/${p.code.toLowerCase()}`}
                className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-blue-500 hover:bg-white transition-all shadow-xs hover:shadow-md group flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#0B1F4E] text-[#FFD84A]">
                      {p.level?.toUpperCase() || 'UG'}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">{p.duration || '3-4 Years'}</span>
                  </div>
                  <h4 className="font-serif font-bold text-base text-slate-900 group-hover:text-blue-600 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {p.overview || p.eligibility || 'Autonomous academic curriculum scheme under NEP 2020.'}
                  </p>
                </div>
                
                <div className="pt-3 border-t border-slate-200/60 mt-3 flex items-center justify-between text-xs font-bold text-[#1C5496] group-hover:text-blue-700">
                  <span>Explore Programme</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </section>
      );

    // --- 4. FACULTY DIRECTORY SECTION ---
    case 'faculty':
      return (
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              {content.subheading && (
                <span className="text-[11px] font-mono uppercase tracking-widest text-[#1C5496] font-bold block">
                  {content.subheading}
                </span>
              )}
              <h2 className="font-serif font-bold text-2xl text-slate-900">
                {content.heading || 'Department Faculty'}
              </h2>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500">
              {facultyList.length} Active Scholar{facultyList.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {facultyList.map((f, fIdx) => (
              <div
                key={f.id || fIdx}
                className="bg-slate-50 rounded-2xl border border-slate-200/80 p-5 space-y-3 hover:shadow-sm transition-shadow flex flex-col items-center text-center"
              >
                <img
                  src={f.photo_url || f.photoUrl || '/assets/faculty/default-avatar.png'}
                  alt={f.name}
                  className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-xs"
                  onError={(e) => { e.currentTarget.src = '/assets/faculty/default-avatar.png'; }}
                />
                <div className="space-y-1">
                  <h4 className="font-serif font-bold text-sm text-slate-900 leading-snug">{f.name}</h4>
                  <p className="text-xs text-[#1C5496] font-semibold">{f.designation || 'Faculty Member'}</p>
                  <p className="text-[11px] text-slate-500 font-mono">{f.qualification || 'M.Sc., Ph.D.'}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      );

    // --- 5. FACILITIES SECTION ---
    case 'facilities':
      return (
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            {content.subheading && (
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#1C5496] font-bold block">
                {content.subheading}
              </span>
            )}
            <h2 className="font-serif font-bold text-2xl text-slate-900">
              {content.heading || 'Department Facilities & Laboratories'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {(content.items || []).map((item, idx) => (
              <div key={item.id || idx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="w-8 h-8 rounded-lg bg-[#1C5496] text-white flex items-center justify-center font-bold">
                  <Building2 className="w-4 h-4" />
                </div>
                <h4 className="font-serif font-bold text-sm text-slate-900">{item.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.description}</p>
              </div>
            ))}
          </div>
        </section>
      );

    // --- 6. DOCUMENTS & SYLLABUS SECTION ---
    case 'documents':
      return (
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4">
            {content.subheading && (
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#1C5496] font-bold block">
                {content.subheading}
              </span>
            )}
            <h2 className="font-serif font-bold text-2xl text-slate-900">
              {content.heading || 'Curriculum & Syllabi'}
            </h2>
          </div>

          <div className="space-y-3">
            {(content.documents || []).map((doc, dIdx) => (
              <div
                key={dIdx}
                className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between gap-4 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="font-bold text-xs sm:text-sm text-slate-900">{doc.title}</h5>
                    <p className="text-[11px] text-slate-500 font-sans">{doc.description || 'Official academic publication'}</p>
                  </div>
                </div>

                <a
                  href={doc.fileUrl || '#'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-900 text-slate-900 rounded-lg text-xs font-bold transition-all shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </a>
              </div>
            ))}
          </div>
        </section>
      );

    // --- 7. NOTICES & EVENTS SECTION ---
    case 'notices':
      return (
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="space-y-1 border-b border-slate-100 pb-4 flex items-center justify-between">
            <h2 className="font-serif font-bold text-2xl text-slate-900 flex items-center gap-2">
              <Bell className="w-5 h-5 text-amber-500" />
              <span>{content.heading || 'Department Notices & Circulars'}</span>
            </h2>
            <Link to="/notices" className="text-xs text-[#1C5496] font-bold hover:underline">
              View All Notices
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {noticesList.map((n) => (
              <div key={n.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-mono text-slate-400">{n.display_date || n.date}</span>
                <h4 className="font-bold text-xs text-slate-900 hover:text-blue-600 transition-colors line-clamp-2">
                  {n.title}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">{n.summary}</p>
              </div>
            ))}
          </div>
        </section>
      );

    // --- 8. CONTACT SECTION ---
    case 'contact':
      return (
        <section className="bg-[#0B1F4E] text-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 shadow-md space-y-6">
          <div className="space-y-1 border-b border-white/10 pb-4">
            <h2 className="font-serif font-bold text-2xl text-[#FFD84A]">
              {content.heading || 'Contact Department'}
            </h2>
            <p className="text-xs text-slate-300">Direct inquiries for admissions, syllabus, or academic administration.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            {content.email && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Email Desk</span>
                <a href={`mailto:${content.email}`} className="text-white hover:text-[#FFD84A] font-medium block">
                  {content.email}
                </a>
              </div>
            )}
            {content.phone && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Phone</span>
                <span className="text-white font-medium block">{content.phone}</span>
              </div>
            )}
            {content.office && (
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">Office Location</span>
                <span className="text-white font-medium block">{content.office}</span>
              </div>
            )}
          </div>
        </section>
      );

    default:
      return null;
  }
}
