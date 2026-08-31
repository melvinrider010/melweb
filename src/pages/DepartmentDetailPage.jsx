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
  GraduationCap
} from 'lucide-react';
import { getDepartmentById, DEPARTMENTS } from '../data/departmentsData';
import { getFacultyByDepartment } from '../data/facultyData';
import FacultyAvatar from '../components/common/FacultyAvatar';

export default function DepartmentDetailPage() {
  const { deptId } = useParams();
  const dept = getDepartmentById(deptId) || DEPARTMENTS[0];

  const deptFaculty = getFacultyByDepartment(dept.id);

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
            <span className="text-slate-800 font-bold uppercase">{dept.id}</span>
          </div>
        </div>

        {/* 2. DEPARTMENT HERO BANNER */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs relative overflow-hidden space-y-6">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-[#1C5496] text-white font-mono font-extrabold text-xs sm:text-sm px-3 py-1 rounded-md tracking-wider">
              {dept.category}
            </span>
            {dept.established && (
              <span className="bg-amber-50 text-amber-900 border border-amber-200 font-sans font-bold text-xs px-3 py-1 rounded-md">
                Est. {dept.established}
              </span>
            )}
            <span className="bg-emerald-50 text-emerald-800 font-sans font-semibold text-xs px-3 py-1 rounded-md border border-emerald-200/60 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Autonomous Department
            </span>
          </div>

          <div className="space-y-3">
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              {dept.name}
            </h1>
            <p className="text-base sm:text-lg font-serif italic text-[#1C5496]">
              "{dept.tagline || 'Excellence in Pedagogy, Research, and Value-Based Education'}"
            </p>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed max-w-4xl pt-1">
              {dept.description}
            </p>
          </div>

          {/* Key Department Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100 text-xs font-semibold text-slate-700">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Head of Department</span>
              <span className="font-serif font-bold text-sm text-slate-900">{dept.head}</span>
              <span className="text-[11px] text-slate-500 block">{dept.headDesignation}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Contact Email</span>
              <span className="font-mono text-xs text-[#1C5496] block truncate">{dept.headEmail}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Campus Phone / Extension</span>
              <span className="text-xs text-slate-800 block">{dept.phone}</span>
            </div>
          </div>
        </div>

        {/* 3. MAIN CONTENT (8 COLUMNS) & SIDEBAR (4 COLUMNS) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main 8 Columns */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Brief History */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-[#1C5496]" />
                <span>Brief History & Legacy</span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                {dept.history}
              </p>
            </div>

            {/* Achievements */}
            {dept.achievements && dept.achievements.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-[#1C5496]" />
                  <span>Key Achievements & Milestones</span>
                </h2>
                <div className="space-y-2.5">
                  {dept.achievements.map((ach, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#1C5496] shrink-0 mt-0.5" />
                      <span className="leading-relaxed font-medium">{ach}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Future Plan of Action */}
            {dept.futurePlans && dept.futurePlans.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-[#1C5496]" />
                  <span>Future Plan of Action</span>
                </h2>
                <ol className="space-y-2.5">
                  {dept.futurePlans.map((plan, idx) => (
                    <li key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 leading-relaxed font-medium flex items-start space-x-3">
                      <span className="font-mono font-bold text-[#1C5496] shrink-0 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">
                        {idx + 1}
                      </span>
                      <span>{plan}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {/* Present Faculty Roster */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 flex items-center">
                  <Users className="w-5 h-5 mr-2 text-[#1C5496]" />
                  <span>Present Faculty Members</span>
                </h2>
                <span className="bg-slate-100 text-slate-700 text-xs font-bold px-2.5 py-1 rounded-full">
                  {deptFaculty.length} Faculty Listed
                </span>
              </div>

              {deptFaculty.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {deptFaculty.map((fac) => (
                    <Link
                      key={fac.id}
                      to={`/departments/${dept.id}/faculty/${fac.id}`}
                      className="p-4 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-[#1C5496] hover:shadow-md transition-all group flex items-start space-x-4"
                    >
                      <FacultyAvatar
                        src={fac.image}
                        name={fac.name}
                        className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover object-top shrink-0 border border-slate-300 group-hover:scale-105 transition-transform shadow-xs"
                      />
                      <div className="min-w-0 space-y-1">
                        <h4 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#1C5496] transition-colors truncate">
                          {fac.name}
                        </h4>
                        <p className="text-xs text-[#1C5496] font-semibold truncate">
                          {fac.designation}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate">
                          {fac.qualification}
                        </p>
                        <span className="text-[11px] font-bold text-[#1C5496] group-hover:underline inline-flex items-center pt-1">
                          View Profile →
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-500">Contact the department office for complete faculty roster details.</p>
              )}
            </div>

            {/* Facilities & Laboratories */}
            {dept.facilities && dept.facilities.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900 border-b border-slate-100 pb-3 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-[#1C5496]" />
                  <span>Department Facilities & Laboratories</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {dept.facilities.map((fac, idx) => (
                    <div key={idx} className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 font-medium flex items-start space-x-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#1C5496] shrink-0 mt-0.5" />
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar 4 Columns */}
          <div className="lg:col-span-4 space-y-6">

            {/* Offered Academic Degrees */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest block">Degree Programmes</span>
              <h3 className="font-serif font-bold text-lg text-slate-900">Offered by {dept.name}</h3>
              <div className="space-y-2.5">
                {dept.programmes.map((prog, idx) => (
                  <Link
                    key={idx}
                    to={`/academics/${prog.code || 'esp'}`}
                    className="p-3 bg-slate-50 hover:bg-blue-50/70 rounded-xl border border-slate-200 transition-colors flex items-center justify-between group"
                  >
                    <div>
                      <span className="font-serif font-bold text-xs text-slate-900 group-hover:text-[#1C5496] block">
                        {prog.name}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {prog.level} • {prog.duration}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-[#1C5496] group-hover:translate-x-1 transition-all shrink-0 ml-2" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Admissions Apply Card */}
            <div className="bg-[#071A33] text-white p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
              <span className="font-mono text-[10px] uppercase font-bold tracking-widest text-[#FFD84A] block">
                ADMISSIONS 2026–27
              </span>
              <h3 className="font-serif font-bold text-xl text-white">Apply to {dept.name}</h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Admissions for all UG and PG degree combinations offered by {dept.name} are currently open for 2026–27.
              </p>
              <Link
                to="/admissions"
                className="btn-gold w-full py-2.5 rounded-xl text-xs font-bold text-center block"
              >
                Apply for Admissions Now
              </Link>
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
