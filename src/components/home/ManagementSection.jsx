import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Award, Sparkles } from 'lucide-react';
import leadership from '../../data/leadership.json';

// 4 Verified Institutional Leaders in Strict Order & Equal Stature
const LEADERSHIP_ROSTER = [
  {
    id: 'secretary',
    num: '01',
    roleTag: '01 / SECRETARY, MDES',
    shortRole: 'Secretary, MDES',
    name: 'Rev. Fr. Edward William Saldanha',
    designation: 'Secretary, Mysore Diocesan Educational Society (MDES)',
    image: '/media/management/secretary_edward_saldanha.jpg',
    objectPosition: '50% 0%',
    description: 'Leading institutional management, policy governance, and Catholic educational ministry across Mysore Diocese.',
    link: '/about?tab=mdes',
    linkLabel: 'View MDES Society',
    defaultRotation: -3
  },
  {
    id: 'rector',
    num: '02',
    roleTag: '02 / RECTOR & MANAGER',
    shortRole: 'Rector & Manager',
    name: 'Rev. Dr. Lourdu Prasad Joseph',
    designation: "Rector and Manager, St. Philomena's Educational Institutions",
    image: '/media/management/rector_lourdu_prasad.jpg',
    objectPosition: '50% 18%',
    description: 'Guiding collegiate vision, spiritual leadership, and infrastructure development across campus institutions.',
    link: '/about?tab=leadership',
    linkLabel: "Read Rector's Message",
    defaultRotation: 2
  },
  {
    id: 'principal',
    num: '03',
    roleTag: '03 / PRINCIPAL',
    shortRole: 'Principal',
    name: 'Dr. Ravi J.D. Saldanha',
    designation: "Principal, St. Philomena's College (Autonomous)",
    image: '/media/management/principal_ravi_saldanha.jpg',
    objectPosition: '50% 15%',
    description: 'Spearheading academic excellence, research initiatives, autonomous governance, and student distinction.',
    link: '/about?tab=leadership',
    linkLabel: "Read Principal's Message",
    defaultRotation: -2
  },
  {
    id: 'financial',
    num: '04',
    roleTag: '04 / FINANCIAL OFFICER',
    shortRole: 'Financial Officer',
    name: 'Rev. Fr. Roshan',
    designation: 'Financial Officer',
    image: '/media/management/finance_officer_roshan.jpg',
    objectPosition: '50% 20%',
    description: 'Administering fiscal planning, sustainable institutional growth, audits, and resource stewardship.',
    link: '/about?tab=leadership',
    linkLabel: 'Financial Administration',
    defaultRotation: 3
  }
];

// Interactive 3D Card with Tilt & Bottom Slide-Up Reveal
function LeaderCard({ leader, hoveredId, setHoveredId }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isTouchActive, setIsTouchActive] = useState(false);

  const isHovered = hoveredId === leader.id || isTouchActive;
  const isAnyHovered = hoveredId !== null;
  const isDimmed = isAnyHovered && !isHovered;

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      x: -(y * 4), // max 2deg tilt
      y: x * 4
    });
  };

  const handleMouseEnter = () => {
    setHoveredId(leader.id);
  };

  const handleMouseLeave = () => {
    setHoveredId(null);
    setTilt({ x: 0, y: 0 });
    setIsTouchActive(false);
  };

  const handleTouchToggle = () => {
    setIsTouchActive(!isTouchActive);
    setHoveredId(isTouchActive ? null : leader.id);
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleTouchToggle}
      className={`relative transition-all duration-500 ease-out will-change-transform ${
        isDimmed ? 'opacity-80 scale-[0.98]' : 'opacity-100'
      }`}
      style={{
        perspective: '1200px',
        transform: isHovered
          ? `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) rotate(0deg) scale(1.04) translateZ(25px)`
          : `perspective(1200px) rotate(${leader.defaultRotation}deg) scale(1)`,
        zIndex: isHovered ? 30 : 10
      }}
    >
      {/* Physical Photo Frame Container */}
      <div 
        className={`bg-white rounded-2xl border p-2 transition-all duration-500 overflow-hidden flex flex-col justify-between h-full ${
          isHovered
            ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/50 shadow-2xl'
            : 'border-slate-200/90 shadow-md hover:border-slate-300'
        }`}
      >
        {/* Top Portrait Image with Zero-Crop Individual Framing */}
        <div className="relative w-full h-[310px] sm:h-[330px] lg:h-[350px] rounded-xl overflow-hidden bg-slate-900 shrink-0">
          <img
            src={leader.image}
            alt={leader.name}
            style={{ objectPosition: leader.objectPosition }}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />

          {/* Subtle Base Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/15 to-transparent pointer-events-none" />

          {/* Permanent Floating Navy & Gold Role Label */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="font-mono text-[9px] sm:text-[10px] font-bold text-white bg-[#071A33]/90 px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10 flex items-center space-x-1.5 shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD84A] shrink-0" />
              <span>{leader.roleTag}</span>
            </span>
          </div>

          {/* DARK NAVY BOTTOM SLIDE-UP REVEAL PANEL ON HOVER */}
          <div 
            className={`absolute inset-x-0 bottom-0 bg-[#071A33]/95 backdrop-blur-md text-white p-4 sm:p-5 rounded-b-xl border-t border-[#D4AF37]/30 transition-all duration-400 ease-out z-20 flex flex-col justify-between space-y-3 ${
              isHovered 
                ? 'translate-y-0 opacity-100 pointer-events-auto' 
                : 'translate-y-full opacity-0 pointer-events-none'
            }`}
          >
            <div className="space-y-1.5">
              <span className="font-mono text-[9px] font-bold text-[#FFD84A] tracking-wider uppercase block">
                {leader.shortRole}
              </span>
              <h4 className="font-serif font-bold text-base sm:text-lg text-white leading-snug">
                {leader.name}
              </h4>
              <p className="text-[11px] text-slate-300 font-sans leading-relaxed line-clamp-3">
                {leader.description}
              </p>
            </div>

            <div className="pt-2 border-t border-white/10 flex items-center justify-between">
              <span className="text-[10px] font-mono text-slate-400">St. Philomena's</span>
              <Link
                to={leader.link}
                className="inline-flex items-center space-x-1 text-xs font-bold text-[#FFD84A] hover:text-white transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>{leader.linkLabel}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>

        {/* Visible Base Content Below Portrait */}
        <div className="p-3.5 sm:p-4 text-center space-y-1 bg-white">
          <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-900 leading-snug tracking-tight truncate">
            {leader.name}
          </h3>
          <p className="text-xs font-bold text-[#1C5496] font-sans truncate">
            {leader.designation}
          </p>
        </div>

      </div>
    </div>
  );
}

export default function ManagementSection() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section className="bg-[#FAF9F6] text-[#071A33] py-20 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-200/80 relative overflow-hidden">
      
      {/* 1. ATMOSPHERIC ARCHITECTURAL BLUEPRINT GRID & WATERMARK */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        {/* Architectural Fine Blueprint Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1C5496_1px,transparent_1px),linear-gradient(to_bottom,#1C5496_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.035]" />
        
        {/* Subtle Decorative Arc Watermarks */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1100px] h-[500px] rounded-full border border-[#1C5496]/5 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[380px] rounded-full border border-[#D4AF37]/5 pointer-events-none" />
      </div>

      <div className="max-w-[1480px] mx-auto space-y-12 sm:space-y-14 relative z-10">
        
        {/* 2. SECTION HEADER (CENTERED EDITORIAL) */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1 bg-[#071A33] text-white rounded-full text-xs font-bold font-sans tracking-widest uppercase shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD84A] animate-pulse" />
            <span>Governance & Vision</span>
          </div>
          
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-[44px] text-slate-900 tracking-tight leading-tight">
            Institutional Leadership
          </h2>
          
          <p className="text-sm sm:text-base text-slate-600 font-sans max-w-2xl mx-auto leading-relaxed">
            "Guiding St. Philomena's through academic excellence, institutional stewardship and a continuing legacy of learning."
          </p>
        </div>

        {/* 3. STRICT 4-COLUMN SINGLE ROW LEADERSHIP GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 xl:gap-7 items-stretch">
          {LEADERSHIP_ROSTER.map((leader) => (
            <LeaderCard
              key={leader.id}
              leader={leader}
              hoveredId={hoveredId}
              setHoveredId={setHoveredId}
            />
          ))}
        </div>

        {/* 4. FOOTNOTE SUB-BAR */}
        <div className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 font-sans gap-3">
          <div className="flex items-center space-x-2">
            <Shield className="w-4 h-4 text-[#D4AF37]" />
            <span>Managed by Mysore Diocesan Educational Society (MDES) · Established 1946</span>
          </div>
          <Link
            to="/about?tab=leadership"
            className="text-[#1C5496] font-bold hover:text-[#071A33] transition-colors flex items-center space-x-1"
          >
            <span>Explore Complete Administrative Directory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
