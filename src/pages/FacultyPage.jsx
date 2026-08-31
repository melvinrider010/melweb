import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Mail, BookOpen, GraduationCap, User, Filter, ArrowRight, Building2, Briefcase } from 'lucide-react';
import { ALL_FACULTY } from '../data/facultyData';
import FacultyAvatar from '../components/common/FacultyAvatar';

export default function FacultyPage() {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');

  const departments = ['All', ...new Set(ALL_FACULTY.map(f => f.department))];

  const filtered = ALL_FACULTY.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                          f.department.toLowerCase().includes(search.toLowerCase()) ||
                          f.designation.toLowerCase().includes(search.toLowerCase()) ||
                          (f.specialization && f.specialization.toLowerCase().includes(search.toLowerCase()));
    const matchesDept = selectedDept === 'All' || f.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Academic Directory</span>
          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900">Faculty Directory</h1>
          <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-sans">
            Explore the distinguished faculty members, researchers, and academic heads across St. Philomena's College (Autonomous), Mysuru.
          </p>

          {/* Search & Filters */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
            
            {/* Search Box */}
            <div className="sm:col-span-7 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search faculty by name, department, designation, or specialization..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#1C5496] focus:bg-white transition-colors"
              />
            </div>

            {/* Department Dropdown Filter */}
            <div className="sm:col-span-5 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#1C5496] shrink-0" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#1C5496] font-semibold text-slate-800"
              >
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d === 'All' ? 'All Academic Departments' : d}
                  </option>
                ))}
              </select>
            </div>

          </div>

          <div className="text-xs text-slate-500 pt-1 font-mono">
            Showing <strong>{filtered.length}</strong> faculty members across campus.
          </div>
        </div>

        {/* Faculty Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((member) => (
            <div
              key={member.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-3">
                
                {/* Photo */}
                <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden flex items-center justify-center">
                  <FacultyAvatar
                    src={member.image}
                    name={member.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    fallbackSize="text-4xl"
                  />
                  <span className="absolute top-2 left-2 bg-[#071A33]/90 text-[#FFD84A] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                    {member.department.replace('Department of ', '')}
                  </span>
                </div>

                {/* Info */}
                <div className="p-4 space-y-2 text-xs">
                  <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#1C5496] transition-colors line-clamp-1">
                    {member.name}
                  </h3>
                  <p className="text-[#1C5496] font-bold text-xs line-clamp-1">{member.designation}</p>
                  <p className="text-[11px] text-slate-500 font-medium">Qual: {member.qualification}</p>
                  
                  {member.email && (
                    <p className="text-[11px] text-slate-600 flex items-center pt-1 truncate">
                      <Mail className="w-3 h-3 mr-1 text-[#1C5496] shrink-0" />
                      <span className="truncate">{member.email}</span>
                    </p>
                  )}
                </div>

              </div>

              {/* Profile Action Link */}
              <div className="p-4 pt-0">
                <Link
                  to={`/departments/${member.deptId}/faculty/${member.id}`}
                  className="w-full btn-primary-blue py-2 rounded-xl text-xs font-bold text-center block"
                >
                  View Faculty Profile →
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
