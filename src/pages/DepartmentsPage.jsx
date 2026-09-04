import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, BookOpen, Users, Mail, GraduationCap } from 'lucide-react';
import { DEPARTMENTS, FACULTIES, getFacultyByDepartmentId } from '../data/academicsHierarchyData';

export default function DepartmentsPage() {
  const [selectedFaculty, setSelectedFaculty] = useState('all');

  const filtered = selectedFaculty === 'all'
    ? DEPARTMENTS
    : DEPARTMENTS.filter(d => d.facultyId === selectedFaculty);

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      {/* Page Banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Academic Directory</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">Academic Departments</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          St. Philomena's College houses 23 autonomous academic departments organized under 4 Faculties: Science, Commerce & Management, Arts & Humanities, and Vocational Studies.
        </p>

        {/* Faculty / School Filters */}
        <div className="pt-4 flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedFaculty('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              selectedFaculty === 'all'
                ? 'bg-[#1C5496] text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Departments ({DEPARTMENTS.length})
          </button>
          {FACULTIES.map((fac) => (
            <button
              key={fac.id}
              onClick={() => setSelectedFaculty(fac.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                selectedFaculty === fac.id
                  ? 'bg-[#1C5496] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {fac.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dept) => {
          const facList = getFacultyByDepartmentId(dept.id);
          const ugCount = (dept.ugProgrammes || []).length;
          const pgCount = (dept.pgProgrammes || []).length;

          return (
            <div 
              key={dept.id} 
              className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-[10.5px] px-2.5 py-1 rounded-md uppercase">
                    {dept.faculty}
                  </span>
                  <Building2 className="w-5 h-5 text-[#1C5496]" />
                </div>

                {dept.photoUrl && dept.photoVerified && (
                  <div className="h-36 overflow-hidden rounded-xl border border-slate-200">
                    <img
                      src={dept.photoUrl}
                      alt={dept.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
                  {dept.name}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {dept.description}
                </p>
                
                {/* Metrics */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                  <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                    {facList.length} Faculty
                  </span>
                  {ugCount > 0 && (
                    <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded font-bold">
                      {ugCount} UG Stream(s)
                    </span>
                  )}
                  {pgCount > 0 && (
                    <span className="bg-blue-50 text-blue-900 border border-blue-200 px-2 py-0.5 rounded font-bold">
                      {pgCount} PG Stream(s)
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <Link
                  to={`/departments/${dept.slug}`}
                  className="w-full btn-primary-blue py-2.5 rounded-xl text-xs font-bold text-center block"
                >
                  Explore Department & Faculty →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
}
