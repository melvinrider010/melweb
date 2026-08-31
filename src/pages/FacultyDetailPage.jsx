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

export default function FacultyDetailPage() {
  const { facultyId, deptId } = useParams();
  const faculty = getFacultyById(facultyId);

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
                <p className="flex items-center">
                  <GraduationCap className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  <span><strong>Qualification:</strong> {faculty.qualification}</span>
                </p>
                <p className="flex items-center">
                  <Briefcase className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  <span><strong>Experience:</strong> {faculty.experience}</span>
                </p>
                <p className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-[#1C5496] shrink-0" />
                  <span><strong>Email:</strong> <span className="font-mono text-slate-800">{faculty.email}</span></span>
                </p>
                <p className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-slate-400 shrink-0" />
                  <span><strong>Phone:</strong> {faculty.phone}</span>
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* 3. DETAILED PROFILE SECTIONS */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* Main 8 Columns */}
          <div className="lg:col-span-8 space-y-6">

            {/* Profile Statement */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-[#1C5496]" />
                <span>Biography & Academic Background</span>
              </h2>
              <p className="text-slate-700 text-xs sm:text-sm leading-relaxed font-sans">
                {faculty.profile}
              </p>
            </div>

            {/* Areas of Specialization */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                <Award className="w-5 h-5 mr-2 text-[#1C5496]" />
                <span>Areas of Specialization & Research Interests</span>
              </h2>
              <p className="text-slate-800 font-semibold text-xs sm:text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
                {faculty.specialization}
              </p>
            </div>

            {/* Subjects / Courses Taught */}
            {faculty.subjectsTaught && faculty.subjectsTaught.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-[#1C5496]" />
                  <span>Subjects & Courses Taught</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {faculty.subjectsTaught.map((subject, idx) => (
                    <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1C5496] shrink-0" />
                      <span className="text-xs font-bold text-slate-800">{subject}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Research Publications & Conferences */}
            {faculty.researchPublications && faculty.researchPublications.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-[#1C5496]" />
                  <span>Selected Publications & Papers</span>
                </h2>
                <ul className="space-y-3">
                  {faculty.researchPublications.map((pub, idx) => (
                    <li key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium leading-relaxed flex items-start space-x-2">
                      <span className="font-mono font-bold text-[#1C5496] shrink-0">[{idx + 1}]</span>
                      <span>{pub}</span>
                    </li>
                  ))}
                </ul>
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
