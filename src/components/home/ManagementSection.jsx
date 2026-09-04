import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight } from 'lucide-react';

const LEADERSHIP_ROSTER = [
  {
    id: 'bishop-president',
    name: 'Most Rev. Dr. Francis Serrao, S.J.',
    designation: 'Bishop of Mysore Diocese & President, MDES',
    image: '/assets/images/leadership/bishop_francis_serrao.jpg',
    objectPosition: '50% 12%',
    link: '/about?tab=mdes'
  },
  {
    id: 'rector',
    name: 'Rev. Dr. Lourdu Prasad Joseph',
    designation: 'Rector & Manager',
    image: '/media/management/rector_lourdu_prasad.jpg',
    objectPosition: '50% 18%',
    link: '/about?tab=leadership'
  },
  {
    id: 'principal',
    name: 'Dr. Ravi J.D. Saldanha',
    designation: 'Principal',
    image: '/media/management/principal_ravi_saldanha.jpg',
    objectPosition: '50% 15%',
    link: '/about?tab=leadership'
  },
  {
    id: 'financial',
    name: 'Rev. Fr. Roshan',
    designation: 'Financial Officer',
    image: '/media/management/finance_officer_roshan.jpg',
    objectPosition: '50% 20%',
    link: '/about?tab=leadership'
  }
];

export default function ManagementSection() {
  return (
    <section className="bg-slate-50 text-[#0B1F4E] py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80 relative overflow-hidden">
      
      <div className="max-w-[1440px] mx-auto space-y-10 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="section-heading mb-0">
            <span className="sub-label">Governance & Vision</span>
            <h2>Institutional Leadership</h2>
            <div className="heading-line"></div>
          </div>
          
          <p className="text-xs sm:text-sm text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed">
            Guiding St. Philomena's through academic excellence, institutional stewardship, and an enduring legacy of holistic education.
          </p>
        </div>

        {/* CLEAN, SYMMETRICAL 4-COLUMN LEADERSHIP GRID (STRAIGHT, FORMAL, NO TILT) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {LEADERSHIP_ROSTER.map((leader) => (
            <div
              key={leader.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-[#C9A84C] transition-all duration-300 flex flex-col overflow-hidden group"
            >
              {/* Portrait Image Container */}
              <div className="relative w-full h-[280px] sm:h-[300px] overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={leader.image}
                  alt={leader.name}
                  style={{ objectPosition: leader.objectPosition }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-103"
                />
                
                {/* Bottom subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#164E8C]/60 via-transparent to-transparent pointer-events-none" />
              </div>

              {/* Full Name & Designation Block (Zero Truncation) */}
              <div className="p-5 flex flex-col justify-center flex-1 text-center bg-white border-t border-slate-100 space-y-1.5">
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#0B1F4E] leading-snug break-words">
                  {leader.name}
                </h3>
                <p className="text-xs font-semibold text-[#a88530] font-sans leading-relaxed break-words">
                  {leader.designation}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTNOTE SUB-BAR */}
        <div className="pt-4 border-t border-slate-200 flex justify-end text-xs text-slate-500 font-sans">
          <Link
            to="/about?tab=leadership"
            className="text-[#0B1F4E] font-bold hover:text-[#a88530] transition-colors flex items-center space-x-1"
          >
            <span>Explore Complete Administrative Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
