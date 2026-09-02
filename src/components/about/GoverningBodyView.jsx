import React, { useState } from 'react';
import { ExternalLink, ShieldCheck, Users, Search, Building, Award, CheckCircle } from 'lucide-react';
import aboutData from '../../data/aboutData.json';

export default function GoverningBodyView() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('ALL');

  const members = aboutData.governingBody || [];

  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.designation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'CHAIR') return m.role.toLowerCase().includes('chair');
    if (activeFilter === 'NOMINEE') return m.role.toLowerCase().includes('nominee');
    if (activeFilter === 'INTERNAL') return m.category?.includes('Internal') || m.role.includes('Secretary');
    return true;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      
      {/* Header Banner */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#C9A84C]" />
            <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#a88530]">
              Statutory Governance
            </span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0B1F4E]">
            Governing Body & Statutory Council
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans">
            Apex decision-making statutory council constituted under UGC Autonomous Regulations to steer institutional governance, academic policies, and strategic development.
          </p>
        </div>

        <a
          href="https://stphilos.ac.in/statutory-bodies/"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold px-4 py-2 rounded-xl text-xs font-bold shadow-sm flex items-center space-x-1.5 shrink-0 self-start md:self-auto cursor-pointer"
        >
          <span>Official Portal</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-1.5 flex-wrap gap-y-1.5">
          {[
            { id: 'ALL', label: 'All Members (14)' },
            { id: 'CHAIR', label: 'President & Executive' },
            { id: 'NOMINEE', label: 'Statutory Nominees' },
            { id: 'INTERNAL', label: 'Internal Leadership' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeFilter === tab.id
                  ? 'bg-[#1C5496] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search member, role, or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Official Structured Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-[#1C5496]" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-[#0B1F4E]">
              Statutory Governing Body Members
            </h3>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-sans text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#0B1F4E] text-white font-serif uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 w-16 text-center">Sl. No.</th>
                <th className="py-3 px-6">Name of the Member</th>
                <th className="py-3 px-6 w-1/3">Designation / Profile</th>
                <th className="py-3 px-6 w-48 text-right">Governing Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredMembers.map((member) => (
                <tr
                  key={member.slNo}
                  className="hover:bg-slate-50/80 transition-colors group"
                >
                  <td className="py-3.5 px-4 text-center font-mono font-bold text-slate-500 bg-slate-50/50">
                    {member.slNo}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-serif font-bold text-slate-900 text-sm sm:text-[14.5px] group-hover:text-[#1C5496] transition-colors">
                      {member.name}
                    </div>
                    {member.category && (
                      <span className="inline-block mt-0.5 text-[10.5px] font-mono text-slate-500 font-medium">
                        {member.category}
                      </span>
                    )}
                  </td>
                  <td className="py-3.5 px-6 text-slate-700 leading-relaxed text-xs sm:text-[13px]">
                    {member.designation}
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-[11px] font-bold tracking-wide shadow-2xs ${
                        member.role === 'Chairperson'
                          ? 'bg-[#FFD84A]/30 text-amber-900 border border-amber-300 font-serif'
                          : member.role.includes('Nominee')
                          ? 'bg-blue-50 text-[#1C5496] border border-blue-200'
                          : member.role === 'Member Secretary'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-slate-100 text-slate-700 border border-slate-200'
                      }`}
                    >
                      {member.role}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
