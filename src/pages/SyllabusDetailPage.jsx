import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  BookOpen, 
  FileText, 
  CheckCircle2, 
  GraduationCap, 
  Building2, 
  Layers, 
  Clock, 
  Award,
  Sparkles,
  ChevronRight,
  Printer
} from 'lucide-react';
import { getSyllabusByProgramme } from '../data/syllabusData';
import { getProgrammeByCode } from '../data/programmeDetailsData';

export default function SyllabusDetailPage() {
  const { programmeCode } = useParams();
  const syllabus = getSyllabusByProgramme(programmeCode);
  const prog = getProgrammeByCode(programmeCode);

  const [activeSemIndex, setActiveSemIndex] = useState(0);

  if (!syllabus) {
    return (
      <div className="max-w-[1200px] mx-auto py-16 px-4 sm:px-8 text-[#071A33] text-center space-y-6">
        <div className="bg-white p-10 rounded-2xl border border-slate-200 shadow-sm max-w-xl mx-auto space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-slate-900">Syllabus Not Found</h1>
          <p className="text-sm text-slate-600">
            Syllabus information for "<span className="font-mono font-semibold">{programmeCode}</span>" could not be loaded.
          </p>
          <Link to="/academics" className="btn-primary-blue px-6 py-2.5 rounded-lg text-sm font-bold inline-flex items-center justify-center">
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>Return to Academics</span>
          </Link>
        </div>
      </div>
    );
  }

  const activeSem = syllabus.semesters[activeSemIndex] || syllabus.semesters[0];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* 1. BREADCRUMBS & BACK NAVIGATION */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <div className="flex items-center space-x-3">
            <Link
              to={`/academics/${syllabus.slug}`}
              className="inline-flex items-center text-xs sm:text-sm font-bold text-[#1C5496] hover:text-[#071A33] transition-colors group cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
              <span>Back to {syllabus.code} Programme Details</span>
            </Link>
          </div>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 font-mono">
            <Link to="/academics" className="hover:text-[#1C5496]">ACADEMICS</Link>
            <span>/</span>
            <Link to={`/academics/${syllabus.slug}`} className="hover:text-[#1C5496]">{syllabus.code}</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold uppercase">SYLLABUS</span>
          </div>
        </div>

        {/* 2. SYLLABUS BANNER */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-[#1C5496] text-white font-mono font-extrabold text-xs sm:text-sm px-3 py-1 rounded-md tracking-wider">
              {syllabus.code}
            </span>
            <span className="bg-blue-50 text-[#1C5496] font-sans font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider border border-blue-100">
              Official Syllabus & Regulations
            </span>
            <span className="bg-emerald-50 text-emerald-800 font-sans font-semibold text-xs px-3 py-1 rounded-md border border-emerald-200/60 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Autonomous NEP 2020
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900 leading-tight">
              {syllabus.title}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base max-w-3xl leading-relaxed">
              Detailed semester-wise credit distribution, discipline specific core courses, laboratory practicals, skill enhancement modules, and continuous evaluation scheme.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-100">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Degree Awarded</span>
              <span className="font-serif font-bold text-sm text-slate-900">{syllabus.degree}</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Credits</span>
              <span className="font-serif font-bold text-sm text-[#1C5496]">{syllabus.totalCredits} Credits</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Total Duration</span>
              <span className="font-serif font-bold text-sm text-slate-900">{syllabus.semestersCount} Semesters</span>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Department</span>
              <span className="font-serif font-bold text-sm text-slate-900">{syllabus.department}</span>
            </div>
          </div>

          {/* Local Download Action */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <a
              href={syllabus.localPdf || '/assets/documents/academic-regulations.pdf'}
              download
              className="btn-primary-blue px-6 py-3 rounded-xl text-xs sm:text-sm font-bold inline-flex items-center shadow-md hover:shadow-lg transition-all"
            >
              <Download className="w-4 h-4 mr-2" />
              <span>Download Official Syllabus PDF (Local)</span>
            </a>
            <button
              onClick={() => window.print()}
              className="px-5 py-3 rounded-xl border border-slate-300 bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 inline-flex items-center transition-colors"
            >
              <Printer className="w-4 h-4 mr-2 text-slate-500" />
              <span>Print Scheme</span>
            </button>
          </div>
        </div>

        {/* 3. SEMESTER TAB SELECTOR & DETAILED BREAKDOWN */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main 8-Column Course Breakdown */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Semester Tabs */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <span className="font-serif font-bold text-base text-slate-900">Select Semester Curriculum</span>
                <span className="text-xs font-semibold text-slate-500">{syllabus.semesters.length} Semesters Total</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {syllabus.semesters.map((sem, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSemIndex(idx)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      activeSemIndex === idx
                        ? 'bg-[#1C5496] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {sem.sem}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Semester Table Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-4">
                <div>
                  <span className="text-xs font-bold text-[#1C5496] uppercase tracking-wider block">Course Structure</span>
                  <h2 className="font-serif font-bold text-2xl text-slate-900">{activeSem.sem}</h2>
                </div>
                <span className="bg-amber-50 text-amber-900 border border-amber-200 text-xs font-bold px-3 py-1 rounded-full">
                  Semester Credits: {activeSem.credits}
                </span>
              </div>

              {/* Course List */}
              <div className="space-y-3">
                {activeSem.courses.map((course, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-200/90 bg-slate-50/70 hover:bg-white hover:border-[#1C5496]/40 hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[11px] font-bold bg-slate-200/90 text-slate-800 px-2 py-0.5 rounded">
                          {course.code}
                        </span>
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                          {course.type}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                        {course.title}
                      </h4>
                    </div>

                    <div className="flex items-center space-x-4 shrink-0 sm:text-right">
                      <div className="text-left sm:text-right">
                        <span className="font-mono text-sm font-bold text-[#1C5496] block">
                          {course.credits} {course.credits === 1 ? 'Credit' : 'Credits'}
                        </span>
                        <span className="text-[10px] text-slate-500">
                          {course.type.includes('Lab') ? 'Practical' : 'Lecture / Tutorial'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Evaluation Scheme Notice */}
              <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-xl space-y-2 text-xs">
                <span className="font-bold text-[#1C5496] block uppercase tracking-wider">Evaluation & Assessment Scheme:</span>
                <p className="text-slate-700 leading-relaxed">
                  Continuous Internal Assessment (CIE): <strong>40 Marks</strong> (comprising two periodic mid-semester tests, assignment presentations, and lab records) + Semester End Examination (SEE): <strong>60 Marks</strong> conducted autonomously.
                </p>
              </div>

            </div>

          </div>

          {/* Sidebar 4 Columns */}
          <div className="lg:col-span-4 space-y-6">

            {/* Department Quick Link */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Academic Department</span>
              <h3 className="font-serif font-bold text-lg text-slate-900">{syllabus.department}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Faculty profiles, specialized labs, research projects, and departmental achievements.
              </p>
              <Link
                to={`/departments/${syllabus.deptSlug || 'economics'}`}
                className="w-full btn-primary-blue py-2.5 rounded-xl text-xs font-bold text-center block"
              >
                View Department & Faculty →
              </Link>
            </div>

            {/* Admissions Apply CTA */}
            <div className="bg-[#071A33] text-white p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#FFD84A] block">
                ADMISSIONS 2026–27
              </span>
              <h3 className="font-serif font-bold text-xl text-white">Enroll in {syllabus.code}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Applications for the upcoming 2026–27 academic batch are currently active. Apply online via the admissions portal.
              </p>
              <Link
                to="/admissions"
                className="btn-gold w-full py-2.5 rounded-xl text-xs font-bold text-center block"
              >
                Apply Admissions Now
              </Link>
            </div>

            {/* Back to Academics */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <Link
                to="/academics"
                className="text-xs font-bold text-[#1C5496] hover:underline"
              >
                ← View All Academic Programmes
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
