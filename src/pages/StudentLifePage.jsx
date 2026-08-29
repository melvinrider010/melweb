import React from 'react';
import { Users, ShieldCheck, Heart, GraduationCap, Award, Building2 } from 'lucide-react';
import facilities from '../data/facilities.json';

export default function StudentLifePage() {
  const studentFacilities = facilities.filter(f => 
    f.category === 'Accommodation' || 
    f.category === 'Sports & Fitness' || 
    f.category === 'Outreach & Service' || 
    f.category === 'Academic Support'
  );

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      {/* Header Banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
        <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Student Services & Amenities</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900">Student Support & Campus Facilities</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          St. Philomena's College provides comprehensive student welfare services, placement assistance, residential hostels, sports infrastructure, grievance cells, and active extension units (NCC, NSS, YRC).
        </p>
      </div>

      {/* Facilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {studentFacilities.map((fac) => (
          <div key={fac.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between">
            <div className="space-y-3">
              <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
                <img src={fac.image} alt={fac.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <span className="absolute top-2 left-2 bg-[#071A33]/90 text-[#FFD84A] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                  {fac.category}
                </span>
              </div>
              <div className="p-5 space-y-2">
                <h3 className="font-serif font-bold text-lg text-slate-900">{fac.name}</h3>
                <p className="text-[11px] text-[#1C5496] font-semibold">{fac.tagline}</p>
                <p className="text-xs text-slate-600 leading-relaxed">{fac.description}</p>
              </div>
            </div>
            
            {fac.details && (
              <div className="p-5 pt-0">
                <div className="border-t border-slate-100 pt-3 space-y-1">
                  {fac.details.map((d, idx) => (
                    <p key={idx} className="text-[11px] text-slate-600 flex items-center">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#1C5496] mr-2"></span>
                      {d}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

    </div>
  );
}
