import React, { useState } from 'react';
import { Search, Mail, BookOpen, GraduationCap, User, Filter, X } from 'lucide-react';
import faculty from '../data/faculty.json';

export default function FacultyPage() {
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [activeProfile, setActiveProfile] = useState(null);

  const departments = ['All', ...new Set(faculty.map(f => f.department))];

  const filtered = faculty.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(search.toLowerCase()) ||
                          f.department.toLowerCase().includes(search.toLowerCase()) ||
                          f.designation.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || f.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      {/* Page Header */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Academic Directory</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">Faculty Directory</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          Search and explore the distinguished faculty members, researchers, and academic heads across St. Philomena's College (Autonomous).
        </p>

        {/* Search & Filters */}
        <div className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          {/* Search Box */}
          <div className="sm:col-span-7 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search faculty by name, designation, or department..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1C5496]"
            />
          </div>

          {/* Department Dropdown Filter */}
          <div className="sm:col-span-5 flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#1C5496] shrink-0" />
            <select
              value={selectedDept}
              onChange={(e) => setSelectedDept(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1C5496] font-semibold text-slate-800"
            >
              {departments.map((d) => (
                <option key={d} value={d}>
                  {d === 'All' ? 'All Departments' : `Dept of ${d}`}
                </option>
              ))}
            </select>
          </div>

        </div>
      </div>

      {/* Faculty Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map((member) => (
          <div key={member.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              
              {/* Photo */}
              <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-2 left-2 bg-[#071A33]/90 text-[#FFD84A] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {member.department}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 space-y-1.5 text-xs">
                <h3 className="font-serif font-bold text-base text-slate-900">{member.name}</h3>
                <p className="text-[#1C5496] font-bold text-xs">{member.designation}</p>
                <p className="text-[11px] text-slate-500 font-medium">Qual: {member.qualification}</p>
                
                {member.email && (
                  <p className="text-[11px] text-slate-600 flex items-center pt-1 truncate">
                    <Mail className="w-3 h-3 mr-1 text-[#1C5496] shrink-0" />
                    <span className="truncate">{member.email}</span>
                  </p>
                )}
              </div>

            </div>

            {/* Profile Action */}
            <div className="p-4 pt-0">
              <button
                onClick={() => setActiveProfile(member)}
                className="w-full bg-slate-100 hover:bg-blue-50 text-[#1C5496] py-2 rounded-lg text-xs font-bold transition-colors border border-slate-200"
              >
                View Profile Details
              </button>
            </div>

          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center text-slate-500 space-y-2">
          <p className="font-bold text-slate-800 text-base">No faculty members found matching criteria.</p>
          <p className="text-xs text-slate-400">Try clearing search terms or changing department filters.</p>
        </div>
      )}

      {/* Profile Modal */}
      {activeProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden space-y-4 p-6 relative">
            <button
              onClick={() => setActiveProfile(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center space-x-4">
              <img src={activeProfile.image} alt={activeProfile.name} className="w-20 h-20 rounded-full object-cover border-2 border-[#1C5496]" />
              <div>
                <h3 className="font-serif font-bold text-xl text-slate-900">{activeProfile.name}</h3>
                <p className="text-xs font-bold text-[#1C5496]">{activeProfile.designation}</p>
                <p className="text-xs text-slate-500">Dept. of {activeProfile.department}</p>
                <p className="text-xs text-slate-500">Qualification: {activeProfile.qualification}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs border-t border-slate-100 pt-4">
              <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px]">Academic Profile</span>
              <p className="text-slate-700 leading-relaxed">{activeProfile.profile}</p>
              <p className="text-slate-600 font-semibold pt-1">Official Contact: {activeProfile.email}</p>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveProfile(null)}
                className="btn-primary-blue px-4 py-2 rounded-md text-xs font-bold"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
