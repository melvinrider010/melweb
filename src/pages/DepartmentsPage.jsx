import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Building2, ArrowRight, BookOpen, Users, Mail } from 'lucide-react';
import departments from '../data/departments.json';

export default function DepartmentsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Science', 'Commerce & Management', 'Humanities & Social Sciences', 'Languages & Arts', 'Science & Technology'];

  const filtered = selectedCategory === 'All'
    ? departments
    : departments.filter(d => d.category === selectedCategory);

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      {/* Page Banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Academic Directory</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">Academic Departments</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          St. Philomena's College houses autonomous academic departments spanning Physical Sciences, Life Sciences, Commerce, Management, Social Sciences, Languages, and Research Centers.
        </p>

        {/* Category Filters */}
        <div className="pt-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-md text-xs font-bold transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#1C5496] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((dept) => (
          <div key={dept.id} className="bg-white rounded-xl border border-slate-200 p-6 space-y-4 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="bg-blue-50 text-[#1C5496] font-bold text-[10px] px-2.5 py-1 rounded-md uppercase">{dept.category}</span>
                <Building2 className="w-5 h-5 text-[#1C5496]" />
              </div>
              <h3 className="font-serif font-bold text-xl text-slate-900">{dept.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{dept.description}</p>
              
              <div className="pt-2 text-xs space-y-1 text-slate-700">
                <p className="font-semibold"><span className="text-slate-400">Head of Dept:</span> {dept.head}</p>
                <p className="font-semibold"><span className="text-slate-400">Contact Email:</span> {dept.email}</p>
              </div>

              {dept.programmes && (
                <div className="pt-2">
                  <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Offered Degrees</span>
                  <div className="flex flex-wrap gap-1.5">
                    {dept.programmes.map((prog, idx) => (
                      <span key={idx} className="bg-slate-100 text-slate-700 text-[10px] font-bold px-2 py-0.5 rounded">
                        {prog}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100">
              <Link
                to={`/departments/${dept.id}`}
                className="w-full btn-primary-blue py-2 rounded-md text-xs font-bold text-center block"
              >
                Explore Department →
              </Link>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
