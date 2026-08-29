import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Microscope, Laptop, HeartHandshake, Compass, ChevronRight } from 'lucide-react';
import { gsap } from '../../animations/gsapConfig';
import { motionTokens } from '../../animations/motionTokens';

// 4 Verified Academic Experience Pillars
const EXPERIENCE_PILLARS = [
  {
    id: 'research',
    num: '01',
    title: 'RESEARCH & INNOVATION',
    description: 'Question deeply. Explore boldly. Create knowledge that matters.',
    kineticWord: 'EXPLORE',
    icon: Microscope,
    image: '/assets/images/facilities/academics_science_lab.jpg',
    alt: "St. Philomena's Research & Science Laboratories",
    tags: ['UGC & DST Funded Projects', 'Seed Money Grants', 'Patent Guidance', 'Philo Mira Journal'],
    link: '/research',
    linkLabel: 'Explore Research Portal'
  },
  {
    id: 'practical',
    num: '02',
    title: 'PRACTICAL LEARNING',
    description: 'Turn concepts into experience through laboratories, projects, technology and hands-on learning.',
    kineticWord: 'LEARN',
    icon: Laptop,
    image: '/assets/images/facilities/academic_lab.jpg',
    alt: "State-of-the-art Computing and Practical Labs",
    tags: ['Biotechnology Suites', 'Computing Commons', 'NEP Project Pedagogy', 'Industry Internships'],
    link: '/academics',
    linkLabel: 'Explore Academic Curriculum'
  },
  {
    id: 'community',
    num: '03',
    title: 'COMMUNITY & SERVICE',
    description: 'Learn with others, contribute to society, and grow through meaningful service.',
    kineticWord: 'SERVE',
    icon: HeartHandshake,
    image: '/media/gallery/picture-gallery/anti_dowry_initiative.jpg',
    alt: "Student Community Outreach and Social Initiatives",
    tags: ['Social Outreach Cell', 'NSS & NCC Regiments', 'Youth Red Cross', 'Community Welfare'],
    link: '/student-support',
    linkLabel: 'Explore Student Support'
  },
  {
    id: 'values',
    num: '04',
    title: 'CHARACTER & VALUES',
    description: 'An education grounded in knowledge, responsibility, compassion and purpose.',
    kineticWord: 'CREATE',
    icon: Compass,
    image: '/media/gallery/campus/campus_quadrangle_main.jpg',
    alt: "Historic Quadrangle and Campus Heritage",
    tags: ['Caritas et Scientia (Est. 1946)', 'Faculty Mentorship', 'Interfaith Harmony', 'Ethical Leadership'],
    link: '/about',
    linkLabel: 'Explore College Heritage'
  }
];

// Verified Institutional Statistics
const INSTITUTIONAL_STATS = [
  { value: '1946', label: 'ESTABLISHED YEAR' },
  { value: 'AUTONOMOUS', label: 'INSTITUTION (UGC)' },
  { value: 'CYCLE III (B++)', label: 'NAAC ACCREDITATION' },
  { value: '14+', label: 'UG PROGRAMMES' }
];

export default function AcademicExplorerSection() {
  const [activeIdx, setActiveIdx] = useState(0);
  const sectionRef = useRef(null);
  const activePillar = EXPERIENCE_PILLARS[activeIdx] || EXPERIENCE_PILLARS[0];

  // Subtle Scroll Reveal Animation
  useEffect(() => {
    if (!sectionRef.current || motionTokens.isReducedMotion()) return;

    let ctx = gsap.context(() => {
      gsap.fromTo(
        '.exp-header-elem',
        { y: 24, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none'
          }
        }
      );

      gsap.fromTo(
        '.exp-pillar-nav-item',
        { x: -20, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none'
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="bg-[#071A33] text-white py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-y border-slate-800/90 overflow-hidden relative"
      aria-label="Academic Experience"
    >
      {/* 1. ARCHITECTURAL BLUEPRINT GRID & RADIAL BACKGROUND */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        {/* Fine Architectural Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1C5496_1px,transparent_1px),linear-gradient(to_bottom,#1C5496_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.04]" />
        
        {/* Soft Radial Center Lighting */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[400px] bg-gradient-radial from-blue-700/10 via-transparent to-transparent rounded-full opacity-50" />
        
        {/* Circular Construction Arc */}
        <div className="absolute top-1/2 right-10 w-[700px] h-[700px] rounded-full border border-[#FFD84A]/5 pointer-events-none" />
      </div>

      <div className="max-w-[1480px] mx-auto space-y-12 sm:space-y-16 relative z-10">
        
        {/* 2. SECTION HEADER */}
        <div className="space-y-3 max-w-4xl">
          <div className="exp-header-elem inline-flex items-center space-x-2 px-3 py-1 bg-slate-900/90 border border-slate-700/80 rounded-full text-xs font-bold font-sans tracking-widest uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD84A] animate-pulse" />
            <span className="text-[#FFD84A]">ACADEMIC EXPERIENCE</span>
          </div>

          <h2 className="exp-header-elem font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl text-white tracking-tight leading-[1.06]">
            Where Curiosity Becomes Experience
          </h2>

          <p className="exp-header-elem text-slate-300 text-sm sm:text-base lg:text-lg leading-relaxed font-sans max-w-3xl">
            Learning at St. Philomena's extends beyond the classroom — through research, practical learning, community engagement, and the values that shape every Philomenite.
          </p>
        </div>

        {/* 3. MAIN INTERACTIVE EXPERIENCE COMPOSITION (SPLIT 2-COLUMN) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* LEFT: EDITORIAL PILLARS NAVIGATION SYSTEM (5 COLS) */}
          <div className="lg:col-span-5 space-y-3 sm:space-y-4">
            {EXPERIENCE_PILLARS.map((pillar, idx) => {
              const isActive = idx === activeIdx;
              const IconComponent = pillar.icon;

              return (
                <div
                  key={pillar.id}
                  onMouseEnter={() => setActiveIdx(idx)}
                  onClick={() => setActiveIdx(idx)}
                  onFocus={() => setActiveIdx(idx)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={isActive}
                  className={`exp-pillar-nav-item text-left p-4 sm:p-5 rounded-2xl transition-all duration-400 cursor-pointer relative overflow-hidden group border ${
                    isActive
                      ? 'bg-slate-900/95 border-[#FFD84A]/70 shadow-[0_10px_30px_rgba(0,0,0,0.6),0_0_20px_rgba(255,216,74,0.15)] ring-1 ring-[#FFD84A]/40'
                      : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900/70 hover:border-slate-700 opacity-65 hover:opacity-100'
                  }`}
                >
                  {/* Subtle Gold Left Accent Indicator */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-1 bg-[#FFD84A] transition-all duration-400 ${
                      isActive ? 'opacity-100 scale-y-100' : 'opacity-0 scale-y-50'
                    }`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      {/* Number & Tag */}
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs text-[#FFD84A]">
                          {pillar.num}
                        </span>
                        <span className="text-slate-500">/</span>
                        <span className="font-sans font-bold text-[11px] text-slate-300 uppercase tracking-wider">
                          PILLAR
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        className={`font-serif font-bold text-lg sm:text-xl transition-colors duration-300 ${
                          isActive ? 'text-[#FFD84A]' : 'text-white group-hover:text-slate-100'
                        }`}
                      >
                        {pillar.title}
                      </h3>

                      {/* Description */}
                      <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
                        {pillar.description}
                      </p>
                    </div>

                    {/* Arrow / Icon Indicator */}
                    <div
                      className={`p-2 rounded-xl border transition-all duration-300 shrink-0 ${
                        isActive
                          ? 'bg-[#1C5496] border-[#FFD84A]/50 text-[#FFD84A]'
                          : 'bg-slate-800/60 border-slate-700 text-slate-400 group-hover:text-white'
                      }`}
                    >
                      <ChevronRight
                        className={`w-4 h-4 transition-transform duration-300 ${
                          isActive ? 'translate-x-0.5 text-[#FFD84A]' : 'opacity-70'
                        }`}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* RIGHT: DYNAMIC IMMERSIVE VISUAL & KINETIC TYPOGRAPHY BACKDROP (7 COLS) */}
          <div className="lg:col-span-7 relative min-h-[380px] sm:min-h-[460px] lg:min-h-[500px] flex items-center justify-center">
            
            {/* KINETIC TYPOGRAPHY WATERMARK (Restrained, responsive clamp) */}
            <div 
              aria-hidden="true" 
              className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-0"
            >
              <span
                key={activePillar.kineticWord}
                className="font-serif font-extrabold text-[clamp(4.5rem,10vw,8.5rem)] text-white/5 uppercase tracking-widest transition-all duration-700 ease-out transform scale-105 animate-fadeIn leading-none whitespace-nowrap"
              >
                {activePillar.kineticWord}
              </span>
            </div>

            {/* DYNAMIC IMMERSIVE IMAGE CONTAINER */}
            <div className="relative w-full aspect-[16/10] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-slate-700/80 z-10 group bg-slate-900">
              
              {/* Active Image with subtle zoom */}
              <img
                key={activePillar.id}
                src={activePillar.image}
                alt={activePillar.alt}
                className="w-full h-full object-cover animate-fadeIn transition-transform duration-1000 ease-out scale-100 group-hover:scale-102"
              />

              {/* Seamless Bottom Gradient Shadow */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#071A33] via-[#071A33]/40 to-transparent pointer-events-none" />

              {/* ACTIVE PILLAR METADATA & EXPLORE ACTION BAR */}
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7 space-y-3 z-20">
                
                {/* Feature Tags Strip */}
                <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                  {activePillar.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2.5 py-1 rounded-md bg-slate-900/80 backdrop-blur-md border border-slate-700 text-[10px] sm:text-xs font-semibold text-slate-200 font-sans"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Bottom Action Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-slate-700/60">
                  <div className="space-y-0.5">
                    <span className="font-mono text-[10px] text-[#FFD84A] font-bold uppercase tracking-wider block">
                      {activePillar.num} · ST. PHILOMENA'S COLLEGE
                    </span>
                    <h4 className="font-serif font-bold text-base sm:text-lg text-white">
                      {activePillar.title}
                    </h4>
                  </div>

                  <Link
                    to={activePillar.link}
                    className="btn-gold px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center self-start sm:self-auto shadow-md hover:scale-102 transition-transform shrink-0"
                  >
                    <span>{activePillar.linkLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Link>
                </div>

              </div>

            </div>

          </div>

        </div>

        {/* 4. REFINED INSTITUTIONAL STATISTICS STRIP */}
        <div className="pt-8 sm:pt-10 border-t border-slate-800/80">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {INSTITUTIONAL_STATS.map((stat, sIdx) => (
              <div
                key={sIdx}
                className="space-y-1.5 p-4 sm:p-5 rounded-xl bg-slate-900/40 border border-slate-800/80 text-center lg:text-left"
              >
                <div className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#FFD84A] tracking-tight">
                  {stat.value}
                </div>
                <div className="font-sans font-bold text-[11px] sm:text-xs text-slate-300 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
