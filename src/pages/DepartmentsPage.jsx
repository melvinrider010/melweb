import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, BookOpen, Users, Mail, GraduationCap, Loader2, AlertTriangle } from 'lucide-react';
import { getDepartments } from '../services/departmentsService';
import { FACULTIES, DEPARTMENTS, getFacultyByDepartmentId } from '../data/academicsHierarchyData';

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState('all');

  useEffect(() => {
    let isMounted = true;
    async function loadDepts() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getDepartments();
        if (isMounted) {
          // Merge API data with canonical metadata if present
          const list = (data && data.length > 0 ? data : DEPARTMENTS).map((d) => {
            const canonical = DEPARTMENTS.find(cd => cd.id === d.id || cd.slug === d.slug || cd.slug === d.id.replace(/^dept-/, ''));
            return {
              ...canonical,
              ...d,
              slug: d.slug || canonical?.slug || d.id.replace(/^dept-/, ''),
              faculty: d.category || canonical?.faculty || 'Academic Department',
              facultyId: canonical?.facultyId || d.category || 'all'
            };
          });
          setDepartments(list);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.message || 'Failed to load departments.');
          setIsLoading(false);
        }
      }
    }
    loadDepts();
    return () => { isMounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (selectedFaculty === 'all') return departments;
    return departments.filter(d => d.facultyId === selectedFaculty || (d.faculty && d.faculty.toLowerCase().includes(selectedFaculty.toLowerCase())));
  }, [departments, selectedFaculty]);

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
            All Departments ({departments.length > 0 ? departments.length : 23})
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
      {isLoading ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <Loader2 className="w-10 h-10 text-[#1C5496] animate-spin mx-auto" />
          <p className="font-serif font-bold text-base text-slate-800">Loading academic departments...</p>
          <p className="text-xs text-slate-500">Retrieving official departmental listings</p>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 p-8 rounded-2xl text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-red-600 mx-auto" />
          <p className="font-serif font-bold text-base text-red-900">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((dept) => {
            const facList = getFacultyByDepartmentId(dept.id);
            const ugCount = (dept.programmes || dept.ugProgrammes || []).filter(p => typeof p === 'string' ? !p.includes('pg') : p?.level === 'ug').length;
            const pgCount = (dept.programmes || dept.pgProgrammes || []).filter(p => typeof p === 'string' ? p.includes('pg') : p?.level === 'pg').length;
            const deptSlug = dept.slug || dept.id.replace(/^dept[-_]/, '');

            return (
              <div 
                key={dept.id} 
                className="bg-white rounded-2xl border border-slate-200/90 p-6 space-y-4 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-[10.5px] px-2.5 py-1 rounded-md uppercase">
                      {dept.category || dept.faculty || 'Academic Department'}
                    </span>
                    <Building2 className="w-5 h-5 text-[#1C5496]" />
                  </div>

                  {dept.photoUrl && (
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
                    {dept.description || "Committed to academic excellence, innovative pedagogy, and holistic student development at St. Philomena's College."}
                  </p>
                  
                  {/* Metrics */}
                  <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] font-mono">
                    <span className="bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-semibold">
                      {facList.length > 0 ? `${facList.length} Faculty` : 'Academic Faculty'}
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
                    to={`/departments/${deptSlug}`}
                    className="w-full btn-primary-blue py-2.5 rounded-xl text-xs font-bold text-center block"
                  >
                    Explore Department & Faculty →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
