import React, { useState, useEffect, useRef } from 'react';
import siteImages from '../../data/site_images.json';
import { gsap, ScrollTrigger } from '../../animations/gsapConfig';
import { motionTokens } from '../../animations/motionTokens';

export default function CampusBlocksSection() {
  const sectionRef = useRef(null);

  // The 6 REAL St. Philomena's Campus Destinations & Official Photographs
  const destinations = [
    {
      id: 'chapel',
      number: '01',
      eyebrow: 'SPIRITUAL SANCTUARY',
      title: 'CHAPEL',
      shortName: 'CHAPEL',
      image: '/media/gallery/campus/campus_chapel.jpg',
      alt: "St. Philomena's College Chapel",
      description: "A peaceful place of prayer and reflection, where the calm surroundings inspire faith, hope, and a deep sense of spiritual comfort."
    },
    {
      id: 'admin-block',
      number: '02',
      eyebrow: 'INSTITUTIONAL GOVERNANCE',
      title: 'ADMIN BLOCK',
      shortName: 'ADMIN',
      image: '/media/gallery/campus/campus_admin_block.jpg',
      alt: "St. Philomena's Administrative Quadrangle",
      description: "The Administrative Block serves as the central hub for academic coordination and institutional governance at St. Philomena’s College."
    },
    {
      id: 'science-block',
      number: '03',
      eyebrow: 'DISCOVERY & INNOVATION',
      title: 'SCIENCE BLOCK',
      shortName: 'SCIENCE',
      image: '/media/gallery/campus/campus_science_block.jpg',
      alt: "St. Philomena's Science Block",
      description: "A hub of discovery and innovation where curious minds explore science and push the boundaries of knowledge."
    },
    {
      id: 'library-block',
      number: '04',
      eyebrow: 'KNOWLEDGE RESOURCE',
      title: 'LIBRARY BLOCK',
      shortName: 'LIBRARY',
      image: '/media/gallery/campus/campus_library_block.jpg',
      alt: "Central Library & Resource Center",
      description: "The college library block is a peaceful space with a vast collection of books and resources, perfect for focused study and academic growth."
    },
    {
      id: 'pg-research',
      number: '05',
      eyebrow: 'POSTGRADUATE & RDC',
      title: 'PG & RESEARCH',
      shortName: 'PG & RESEARCH',
      image: '/media/gallery/campus/campus_pg_research_block.jpg',
      alt: "Postgraduate & Research Complex",
      description: "The PG & Research block fosters advanced learning and innovation through modern facilities & collaboration."
    },
    {
      id: 'indoor-stadium',
      number: '06',
      eyebrow: 'SPORTS & CULTURAL ARENA',
      title: 'INDOOR STADIUM',
      shortName: 'STADIUM',
      image: '/media/gallery/campus/campus_indoor_stadium.jpg',
      alt: "Indoor Sports & Cultural Stadium",
      description: "The indoor stadium is a versatile space, hosting both sports events and cultural activities, fostering creativity, teamwork, and physical fitness."
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);
  const [morphProgress, setMorphProgress] = useState(0);

  const activeDest = destinations[activeIndex];

  // Scroll-Driven Pinned Campus Stage (Scroll distance drives destination 01 -> 06)
  useEffect(() => {
    if (!sectionRef.current || motionTokens.isReducedMotion()) return;

    let ctx = gsap.context(() => {
      if (window.innerWidth >= 1024) {
        ScrollTrigger.create({
          trigger: sectionRef.current,
          start: 'top top',
          end: '+=450',
          pin: true,
          pinSpacing: true,
          scrub: 0.3,
          anticipatePin: 1,
          onUpdate: (self) => {
            const raw = self.progress * (destinations.length - 1);
            const index = Math.min(destinations.length - 1, Math.floor(raw));
            const subProgress = raw - index;

            setActiveIndex(index);
            setMorphProgress(subProgress);
          }
        });
      }
    }, sectionRef);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 150);

    return () => {
      clearTimeout(timer);
      ctx.revert();
    };
  }, [destinations.length]);

  const handleSelect = (idx) => {
    setActiveIndex(idx);
    setMorphProgress(0);
  };

  return (
    <section ref={sectionRef} className="bg-[#F8FAFC] border-y border-slate-200/80 relative overflow-hidden w-full">
      
      {/* Background Kinetic Dot Matrix Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#1C5496_1px,transparent_1px)] [background-size:28px_28px] opacity-[0.03] pointer-events-none" />      {/* VIEWPORT-FRIENDLY CONTAINER (NO VERTICAL CLIPPING) */}
      <div className="max-w-[1100px] mx-auto min-h-[85vh] py-8 sm:py-12 px-4 sm:px-6 flex flex-col justify-between relative z-10 space-y-6">
        
        {/* COMPACT SECTION HEADER */}
        <div className="text-center space-y-1 max-w-xl mx-auto shrink-0">
          <div className="inline-flex items-center space-x-2 text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#1C5496] font-sans">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928]" />
            <span>CAMPUS INFRASTRUCTURE</span>
          </div>
          <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-slate-900 tracking-tight leading-none">
            Discover Our Campus
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 font-sans font-medium">
            Six spaces. One campus. A legacy of learning.
          </p>
        </div>

        {/* CENTRAL HERO VISUAL STAGE */}
        <div className="relative my-auto space-y-2 max-w-[820px] mx-auto text-center shrink">
          
          {/* STEP INDICATOR */}
          <div className="inline-block px-3 py-0.5 bg-blue-50 border border-blue-200 text-[#1C5496] font-mono text-[11px] font-bold rounded-full">
            {activeDest.number} / 06
          </div>

          {/* MORPHING KINETIC TITLE */}
          <div className="relative z-20 -mb-4 sm:-mb-7 pointer-events-none select-none overflow-hidden">
            <h1
              key={activeDest.id}
              className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl xl:text-[68px] text-[#071A33] tracking-tight leading-none drop-shadow-xs truncate"
              style={{
                transform: `scale(${1 - morphProgress * 0.015}) skewX(${-morphProgress * 1.2}deg)`,
                letterSpacing: `${morphProgress * 0.03}em`,
                opacity: 1 - morphProgress * 0.12
              }}
            >
              {activeDest.title}
            </h1>
          </div>

          {/* FEATURED PHOTOGRAPH FRAME */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 aspect-[16/9] max-h-[280px] sm:max-h-[340px] lg:max-h-[380px] bg-slate-950 mx-auto w-full group z-10">
            <img
              key={activeDest.id}
              src={activeDest.image}
              alt={activeDest.alt}
              className="w-full h-full object-cover object-center transition-all duration-500 ease-out filter brightness-[0.98] group-hover:scale-102"
            />

            {/* Subtle Top Right Stamp */}
            <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[9px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full border border-slate-700/80 font-sans">
              ST. PHILOMENA'S COLLEGE · MYSURU
            </div>
          </div>

          {/* BELOW-PHOTO CONCISE DESCRIPTION & EYEBROW */}
          <div className="pt-1 space-y-1 max-w-[620px] mx-auto text-center font-sans">
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-[#1C5496] block">
              {activeDest.eyebrow}
            </span>
            <p className="text-xs sm:text-sm lg:text-base text-slate-700 leading-snug font-normal line-clamp-2">
              "{activeDest.description}"
            </p>
          </div>

        </div>

        {/* MINIMALIST BOTTOM NAVIGATION INDICATOR (WITH AMPLE BOTTOM PADDING) */}
        <div className="pt-3 pb-4 border-t border-slate-200/80 shrink-0">
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-3 max-w-3xl mx-auto">
            {destinations.map((d, idx) => {
              const isActive = activeIndex === idx;

              return (
                <button
                  key={d.id}
                  onClick={() => handleSelect(idx)}
                  className={`py-2 px-2 rounded-xl transition-all duration-300 text-center space-y-0.5 group border ${
                    isActive
                      ? 'bg-[#071A33] text-white border-[#FFC928] shadow-md -translate-y-0.5'
                      : 'bg-white text-slate-600 hover:text-slate-900 border-slate-200/80 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    <span className={`font-mono text-[9px] font-bold ${
                      isActive ? 'text-[#FFC928]' : 'text-slate-400'
                    }`}>
                      {d.number}
                    </span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#FFC928]" />}
                  </div>
                  <span className="block font-serif font-bold text-xs truncate">
                    {d.shortName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
