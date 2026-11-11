import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowRight, Maximize2 } from 'lucide-react';
import PersonInfoModal from '../about/PersonInfoModal';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';

const LEADERSHIP_ROSTER = [
  {
    id: 'bishop-president',
    name: 'Most Rev. Dr. Francis Serrao, S.J.',
    designation: 'Bishop of Mysore Diocese & President, MDES',
    image: '/assets/images/leadership/bishop_francis_serrao.jpg',
    objectPosition: '50% 12%',
    link: '/leadership/bishop',
    role: 'Bishop & President',
    biography: 'Most Rev. Dr. Francis Serrao, S.J., serves as the Bishop of Mysore and President of the Mysore Diocesan Educational Society (MDES), providing spiritual guardianship and visionary governance across 130 institutions.',
    hasMessage: false,
    actionText: 'View Institutional Society'
  },
  {
    id: 'rector',
    name: 'Rev. Dr. Lourdu Prasad Joseph',
    designation: 'Rector & Manager',
    image: '/media/management/rector_lourdu_prasad.jpg',
    objectPosition: '50% 18%',
    link: '/leadership/rector',
    role: 'Rector & Manager',
    biography: "Rector and Manager of St. Philomena's Educational Institutions, guiding the academic, spiritual, and infrastructural growth to ensure holistic student development.",
    hasMessage: true,
    actionText: 'Read Rector’s Message'
  },
  {
    id: 'principal',
    name: 'Dr. Ravi J.D. Saldanha',
    designation: 'Principal',
    image: '/media/management/principal_ravi_saldanha.jpg',
    objectPosition: '50% 15%',
    link: '/leadership/principal',
    role: 'Principal',
    biography: "Principal of St. Philomena's College (Autonomous), leading academic governance, research advancements, NEP curriculum implementations, and student excellence across faculties.",
    hasMessage: true,
    actionText: 'Read Principal’s Message'
  },
  {
    id: 'financial',
    name: 'Rev. Fr. Roshan',
    designation: 'Finance Officer',
    image: '/media/management/finance_officer_roshan.jpg',
    objectPosition: '50% 20%',
    link: '/leadership/financial-officer',
    role: 'Finance Officer',
    biography: "Finance Officer of St. Philomena's College, overseeing institutional financial administration, budgetary stewardship, and fiscal governance.",
    hasMessage: false,
    actionText: 'View Administration'
  }
];

export default function ManagementSection() {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [anchorElement, setAnchorElement] = useState(null);

  const liveLeadership = useCms(() => cmsStore.getLeadership());
  const activeRoster = LEADERSHIP_ROSTER.filter(staticL => {
    if (!liveLeadership || liveLeadership.length === 0) {
      const activeList = cmsStore.getActiveLeadership ? cmsStore.getActiveLeadership() : [];
      if (activeList.length === 0) return true;
      return activeList.some(l => 
        l.id === staticL.id || 
        (l.id === 'president-mdes' && staticL.id === 'bishop-president') ||
        (l.id === 'finance-officer' && staticL.id === 'financial')
      );
    }
    const match = liveLeadership.find(l => 
      l.id === staticL.id || 
      (l.id === 'president-mdes' && staticL.id === 'bishop-president') ||
      (l.id === 'finance-officer' && staticL.id === 'financial') ||
      (staticL.id === 'rector' && (l.id === 'rector' || (l.name || '').toLowerCase().includes('lourdu'))) ||
      (staticL.id === 'principal' && (l.id === 'principal' || (l.name || '').toLowerCase().includes('ravi'))) ||
      (staticL.id === 'bishop-president' && (l.id === 'president-mdes' || (l.name || '').toLowerCase().includes('francis'))) ||
      (staticL.id === 'financial' && (l.id === 'finance-officer' || (l.name || '').toLowerCase().includes('roshan')))
    );
    if (match) {
      return match.status !== 'inactive' && match.status !== 'draft';
    }
    return false;
  });

  const handleLeaderClick = (e, leader) => {
    e.preventDefault();
    e.stopPropagation();
    // Anchor directly to the specific image element within the clicked card
    const imgEl = e.currentTarget.querySelector('img') || e.currentTarget;
    setSelectedLeader(leader);
    setAnchorElement(imgEl);
  };

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

        {/* CLEAN, SYMMETRICAL 4-COLUMN LEADERSHIP GRID (CLICKABLE TO OPEN POPUP ANCHORED DIRECTLY TO THE IMAGE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {activeRoster.map((leader) => (
            <div
              key={leader.id}
              onClick={(e) => handleLeaderClick(e, leader)}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#C9A84C] hover:-translate-y-1 transition-all duration-300 flex flex-col overflow-hidden group cursor-pointer"
            >
              {/* Portrait Image Container */}
              <div className="relative w-full h-[280px] sm:h-[300px] overflow-hidden bg-slate-900 shrink-0">
                <img
                  src={leader.image}
                  alt={leader.name}
                  style={{ objectPosition: leader.objectPosition }}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Bottom subtle gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4E]/60 via-transparent to-transparent pointer-events-none" />

                {/* Hover overlay hint */}
                <div className="absolute inset-0 bg-[#0B1F4E]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
                  <span className="px-3.5 py-1.5 rounded-full bg-white/95 text-[#0B1F4E] font-bold text-xs shadow-md tracking-wide flex items-center space-x-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                    <Maximize2 className="w-3.5 h-3.5 text-[#a88530]" />
                    <span>View Info</span>
                  </span>
                </div>
              </div>

              {/* Full Name & Designation Block (Zero Truncation) */}
              <div className="p-5 flex flex-col justify-between flex-1 text-center bg-white border-t border-slate-100 space-y-3">
                <div className="space-y-1.5">
                  <h3 className="font-heading font-semibold text-base sm:text-card text-[#0B1F4E] leading-snug break-words group-hover:text-[#a88530] transition-colors">
                    {leader.name}
                  </h3>
                  <p className="text-xs font-medium text-[#a88530] font-sans leading-relaxed break-words">
                    {leader.designation}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100/80 flex items-center justify-center space-x-1 text-[11px] font-semibold text-[#0B1F4E] group-hover:text-[#a88530] transition-colors">
                  <Link
                    to={leader.link}
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center space-x-1 hover:underline"
                  >
                    <span>{leader.actionText}</span>
                    <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Physical Card-Anchored Popup */}
        {selectedLeader && anchorElement && (
          <PersonInfoModal
            person={selectedLeader}
            anchorElement={anchorElement}
            onClose={() => {
              setSelectedLeader(null);
              setAnchorElement(null);
            }}
          />
        )}

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
