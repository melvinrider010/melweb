import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Mail, 
  Phone, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  Award, 
  Building2, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Calendar,
  Layers
} from 'lucide-react';
import { getFacultyById, ALL_FACULTY } from '../data/facultyData';
import { getDepartmentById } from '../data/departmentsData';
import FacultyAvatar from '../components/common/FacultyAvatar';
import cmsStore from '../lib/cmsStore';
import useCms from '../lib/useCms';

export default function FacultyDetailPage() {
  const { facultyId, deptId } = useParams();
  const faculty = useCms(() => {
    const raw = getFacultyById(facultyId) || cmsStore.getFacultyById(facultyId);
    if (!raw) return null;
    return {
      ...raw,
      image: raw.photoUrl || raw.image,
      photoUrl: raw.photoUrl || raw.image
    };
  }, [facultyId]);

  if (!faculty) {
    return (
      <div className="max-w-[1200px] mx-auto py-16 px-4 sm:px-8 text-[#071A33] text-center space-y-6">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-slate-900">Faculty Profile Not Found</h1>
          <p className="text-sm text-slate-600">
            We could not find a faculty profile corresponding to "<span className="font-mono font-semibold">{facultyId}</span>".
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <Link to="/faculty" className="btn-primary-blue px-6 py-2.5 rounded-lg text-sm font-bold inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Explore Faculty Directory</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const dept = getDepartmentById(faculty.deptId);

  // Other colleagues in same department
  const colleagues = ALL_FACULTY
    .filter(f => f.deptId === faculty.deptId && f.id !== faculty.id)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* 1. BACK NAVIGATION & BREADCRUMBS */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="flex items-center space-x-3">
            <Link
              to={`/departments/${faculty.deptId}`}
              className="inline-flex items-center text-xs sm:text-sm font-bold text-[#1C5496] hover:text-[#071A33] transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to {faculty.department}</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 font-mono">
            <Link to="/departments" className="hover:text-[#1C5496]">DEPARTMENTS</Link>
            <span>/</span>
            <Link to={`/departments/${faculty.deptId}`} className="hover:text-[#1C5496] uppercase">{faculty.deptId}</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold uppercase">{faculty.name}</span>
          </div>
        </div>

        {/* 2. FACULTY HERO PROFILE CARD */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            
            {/* Local Photo */}
            <FacultyAvatar
              src={faculty.image}
              name={faculty.name}
              className="w-36 h-36 sm:w-48 sm:h-48 rounded-2xl overflow-hidden shadow-md border-4 border-slate-100 shrink-0 object-cover"
              fallbackSize="text-3xl sm:text-4xl"
            />

            {/* Core Info */}
            <div className="space-y-3 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-[#1C5496] text-white font-mono font-bold text-[11px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                  Verified Faculty
                </span>
                <Link
                  to={`/departments/${faculty.deptId}`}
                  className="bg-blue-50 text-[#1C5496] font-bold text-xs px-3 py-0.5 rounded hover:underline flex items-center"
                >
                  <Building2 className="w-3.5 h-3.5 mr-1" />
                  {faculty.department}
                </Link>
              </div>

              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900 leading-tight">
                {faculty.name}
              </h1>

              <p className="text-base sm:text-lg font-bold text-[#1C5496]">
                {faculty.designation}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600 pt-2 font-medium">
                {faculty.qualification && (
                  <p className="flex items-center">
                    <GraduationCap className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span><strong>Qualification:</strong> {faculty.qualification}</span>
                  </p>
                )}
                {faculty.experience && faculty.experience.trim() !== '' && (
                  <p className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                    <span><strong>Experience / Date of Joining:</strong> {faculty.experience}</span>
                  </p>
                )}
                {faculty.email && (
                  <p className="flex items-center sm:col-span-2">
                    <Mail className="w-4 h-4 mr-2 text-[#1C5496] shrink-0" />
                    <span><strong>Official Email:</strong> <span className="font-mono text-slate-800">{faculty.email}</span></span>
                  </p>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* 3. DETAILED PROFILE SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main 8 Columns */}
          <div className="lg:col-span-8 space-y-6">

            {/* Profile Statement */}
            {(faculty.profile || faculty.bio) && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                  <Sparkles className="w-5 h-5 mr-2 text-[#1C5496]" />
                  <span>Biography & Academic Background</span>
                </h2>
                <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-sans">
                  {faculty.profile || faculty.bio}
                </p>
              </div>
            )}

            {/* Areas of Specialization */}
            {faculty.specialization && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-[#1C5496]" />
                  <span>Areas of Specialization</span>
                </h2>
                <p className="text-slate-800 font-semibold text-xs sm:text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                  {faculty.specialization}
                </p>
              </div>
            )}

            {/* Academic Qualifications Table */}
            {faculty.cvData?.qualifications && faculty.cvData.qualifications.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-[#1C5496]" />
                  <span>Academic Qualifications</span>
                </h2>
                <div className="space-y-2">
                  {faculty.cvData.qualifications.map((q, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Conference & Seminar Papers Presented */}
            {faculty.cvData?.conferencePresentations && faculty.cvData.conferencePresentations.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span className="flex items-center">
                    <FileText className="w-5 h-5 mr-2 text-[#1C5496]" />
                    <span>Research Papers & Conference Presentations</span>
                  </span>
                  <span className="text-xs font-mono font-bold bg-blue-50 text-[#1C5496] px-2.5 py-0.5 rounded-full">
                    {faculty.cvData.conferencePresentations.length} Papers
                  </span>
                </h2>
                <div className="space-y-3">
                  {faculty.cvData.conferencePresentations.map((paper, idx) => (
                    <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                      <div className="flex items-start space-x-2">
                        <span className="font-mono font-bold text-xs text-[#1C5496] shrink-0">[{idx + 1}]</span>
                        <h4 className="font-semibold text-xs sm:text-sm text-slate-900">{paper.title}</h4>
                      </div>
                      {paper.conferenceName && (
                        <p className="text-xs text-slate-600 pl-5 italic font-sans">{paper.conferenceName}</p>
                      )}
                      {paper.dates && (
                        <p className="text-[11px] text-slate-400 pl-5 font-mono">{paper.dates}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seminars, Conferences & Workshops Attended */}
            {faculty.cvData?.seminarsAttended && faculty.cvData.seminarsAttended.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center justify-between">
                  <span className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-[#1C5496]" />
                    <span>Conferences, Seminars & Workshops Attended</span>
                  </span>
                  <span className="text-xs font-mono font-bold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">
                    {faculty.cvData.seminarsAttended.length} Attended
                  </span>
                </h2>
                <div className="space-y-2.5 max-h-[400px] overflow-y-auto pr-1">
                  {faculty.cvData.seminarsAttended.map((sem, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs flex items-start space-x-2">
                      <span className="font-mono font-bold text-slate-400 shrink-0">{idx + 1}.</span>
                      <div className="space-y-0.5">
                        <p className="font-semibold text-slate-800">{sem.title}</p>
                        {sem.institution && <p className="text-slate-500 italic">{sem.institution}</p>}
                        {sem.duration && <p className="text-[11px] text-slate-400 font-mono">{sem.duration}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Acted as Resource Person */}
            {faculty.cvData?.resourcePerson && faculty.cvData.resourcePerson.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                  <Layers className="w-5 h-5 mr-2 text-[#1C5496]" />
                  <span>Invited Lectures & Resource Person Details</span>
                </h2>
                <div className="space-y-2.5">
                  {faculty.cvData.resourcePerson.map((res, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <p className="font-bold text-slate-800">Topic: {res.topic}</p>
                      {res.institution && <p className="text-slate-600">Institution: {res.institution}</p>}
                      {res.date && <p className="text-[11px] text-slate-400 font-mono">Date: {res.date}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Awards & Recognitions */}
            {faculty.cvData?.awards && faculty.cvData.awards.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-[#C9A84C]" />
                  <span>Awards & Honors</span>
                </h2>
                <div className="space-y-2.5">
                  {faculty.cvData.awards.map((awd, idx) => (
                    <div key={idx} className="p-3.5 bg-amber-50/40 rounded-xl border border-amber-200/60 text-xs space-y-1">
                      <p className="font-bold text-slate-900">{awd.award}</p>
                      {awd.organization && <p className="text-slate-600">{awd.organization}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar 4 Columns */}
          <div className="lg:col-span-4 space-y-6">

            {/* Department Box */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Department Affiliation</span>
              <h3 className="font-serif font-bold text-lg text-slate-900">{faculty.department}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                St. Philomena's College (Autonomous), Bannimantap, Mysuru.
              </p>
              <Link
                to={`/departments/${faculty.deptId}`}
                className="w-full btn-primary-blue py-2.5 rounded-xl text-xs font-bold text-center block"
              >
                View Department Overview →
              </Link>
            </div>

            {/* Department Colleagues */}
            {colleagues.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h4 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                  Department Colleagues
                </h4>
                <div className="space-y-3">
                  {colleagues.map((col) => (
                    <Link
                      key={col.id}
                      to={`/departments/${col.deptId}/faculty/${col.id}`}
                      className="p-2.5 rounded-xl bg-slate-50 hover:bg-blue-50/60 border border-slate-200 transition-colors flex items-center space-x-3 group"
                    >
                      <FacultyAvatar src={col.image} name={col.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-300" fallbackSize="text-xs" />
                      <div className="min-w-0">
                        <span className="font-serif font-bold text-xs text-slate-900 group-hover:text-[#1C5496] block truncate">
                          {col.name}
                        </span>
                        <span className="text-[10px] text-slate-500 block truncate">
                          {col.designation}
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Directory Link */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <Link to="/faculty" className="text-xs font-bold text-[#1C5496] hover:underline">
                ← View Complete Faculty Directory
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
