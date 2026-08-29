import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Building2, ArrowLeft, BookOpen, Users, Mail, CheckCircle2, FileText, Phone } from 'lucide-react';
import departments from '../data/departments.json';
import faculty from '../data/faculty.json';

export default function DepartmentDetailPage() {
  const { deptId } = useParams();
  const dept = departments.find(d => d.id === deptId) || departments[0];

  const deptFaculty = faculty.filter(f => 
    f.department.toLowerCase().includes(dept.name.replace('Department of ', '').toLowerCase()) ||
    dept.name.toLowerCase().includes(f.department.toLowerCase())
  );

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      {/* Back Button */}
      <Link to="/departments" className="inline-flex items-center text-xs font-bold text-[#1C5496] hover:underline">
        <ArrowLeft className="w-4 h-4 mr-1" />
        <span>Back to All Departments</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
        <div className="flex justify-between items-start">
          <span className="bg-blue-50 text-[#1C5496] font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">{dept.category}</span>
          <a href={dept.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
            Official Portal Page ↗
          </a>
        </div>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">{dept.name}</h1>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed max-w-4xl">{dept.description}</p>
        
        <div className="pt-2 flex flex-wrap gap-6 text-xs font-semibold text-slate-600 border-t border-slate-100 pt-4">
          <p><span className="text-slate-400">Head of Department:</span> {dept.head}</p>
          <p><span className="text-slate-400">Contact Email:</span> {dept.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Offered Programmes */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-2">Offered Academic Degrees</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {dept.programmes.map((prog, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-[#1C5496] shrink-0" />
                  <span className="text-xs font-bold text-slate-800">{prog}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Department Faculty Roster */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            <h2 className="font-serif font-bold text-xl text-slate-900 border-b border-slate-100 pb-2">Department Faculty Members</h2>
            {deptFaculty.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {deptFaculty.map((f) => (
                  <div key={f.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex items-center space-x-3">
                    <img src={f.image} alt={f.name} className="w-12 h-12 rounded-full object-cover shrink-0 border border-slate-300" />
                    <div>
                      <h4 className="font-serif font-bold text-sm text-slate-900">{f.name}</h4>
                      <p className="text-[11px] text-[#1C5496] font-semibold">{f.designation}</p>
                      <p className="text-[10px] text-slate-500">{f.qualification}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500">Contact the department office for complete faculty roster details.</p>
            )}
          </div>

        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#071A33] text-white p-6 rounded-2xl border border-slate-800 space-y-4">
            <h3 className="font-serif font-bold text-lg text-[#FFD84A]">Department Admissions</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Inquiries regarding UG and PG admissions into {dept.name} can be submitted via the college admissions office.
            </p>
            <Link to="/admissions" className="btn-gold w-full text-center py-2.5 block rounded-md font-bold text-xs">
              Apply Admissions 2026–27
            </Link>
          </div>
        </div>

      </div>

    </div>
  );
}
