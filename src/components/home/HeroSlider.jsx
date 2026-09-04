import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, ArrowRight, Play, Pause, X } from 'lucide-react';
import { cmsStore } from '../../lib/cmsStore';

export default function HeroSlider() {
  const [slides, setSlides] = useState(cmsStore.getSliders());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isCardVisible, setIsCardVisible] = useState(true);

  useEffect(() => {
    const handleUpdate = () => {
      setSlides(cmsStore.getSliders());
    };
    window.addEventListener('cms_store_updated', handleUpdate);
    return () => window.removeEventListener('cms_store_updated', handleUpdate);
  }, []);

  const activeSlide = slides[currentIndex] || slides[0];

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, [currentIndex, slides, isPaused]);

  if (!activeSlide) return null;

  return (
    <section 
      className="relative min-h-[580px] sm:min-h-[640px] lg:h-[88vh] bg-[#164E8C] text-white overflow-hidden border-b-4 border-[#C9A84C]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      
      {/* LOCAL OFFICIAL HERO BACKGROUND VIDEO & POSTER FALLBACK */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/hero/campus-hero-poster.jpg"
          className="w-full h-full object-cover filter brightness-[0.92] scale-100 transition-transform duration-1000"
        >
          <source src="/media/hero/campus-hero.mp4" type="video/mp4" />
          <img
            src="/media/hero/campus-hero-poster.jpg"
            alt="St. Philomena's College Campus"
            className="w-full h-full object-cover"
          />
        </video>
        
        {/* Subtle Scrim Overlays - Light & Clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#164E8C]/50 via-transparent to-black/20 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#164E8C]/40 via-transparent to-transparent pointer-events-none" />
      </div>

      {/* 12-COLUMN EDITORIAL SPLIT SHOWCASE */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 h-full flex items-center relative z-10 pt-12 pb-24 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 w-full items-center">
          
          {/* LEFT 7 COLS: HERO TITLE & MOTTO (LEFT CORNER, MIDDLE ALIGNED, REFINED & COMPACT) */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-2 sm:space-y-3 pl-14 sm:pl-20 lg:pl-24 pr-4">
            <h1 className="font-serif font-bold text-lg sm:text-xl md:text-2xl lg:text-3xl leading-snug text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] tracking-tight">
              {activeSlide.title}
            </h1>

            <p className="text-[#F0D98C] font-serif text-xs sm:text-sm font-medium tracking-wide drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
              {activeSlide.subtitle}
            </p>
          </div>

          {/* RIGHT 5 COLS: FLOATING FROSTED GLASS HIGHLIGHTS CARD */}
          <div className="lg:col-span-5 flex justify-end">
            {isCardVisible ? (
              <div className="bg-white/95 backdrop-blur-md text-[#0B1F4E] p-5 sm:p-7 rounded-2xl shadow-2xl border-l-8 border-[#C9A84C] space-y-3.5 animate-fadeIn w-full relative">
                
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="text-[11px] font-mono font-bold uppercase tracking-widest text-[#a88530] block">
                    Institutional Highlights
                  </span>
                  
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[11px] font-mono font-bold text-slate-400">
                      {currentIndex + 1} / {slides.length}
                    </span>
                    <button
                      onClick={() => setIsCardVisible(false)}
                      className="w-5 h-5 rounded hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                      aria-label="Close Highlights Card"
                      title="Close"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <h3 className="font-serif font-bold text-lg sm:text-xl text-[#0B1F4E] leading-snug">
                  {activeSlide.title}
                </h3>
                
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                  {activeSlide.description}
                </p>
                
                <div className="pt-2 flex items-center justify-between gap-3 border-t border-slate-100">
                  <Link
                    to={activeSlide.ctaLink}
                    className="btn-gold text-xs sm:text-sm font-bold px-4 py-2 sm:py-2.5 rounded-lg shadow-md flex items-center group transition-all"
                  >
                    <span>{activeSlide.ctaText}</span>
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <a
                    href="https://student.stphiloserp.in/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-[#0B1F4E] hover:text-[#a88530] transition-colors whitespace-nowrap"
                  >
                    Apply 2026–27 →
                  </a>
                </div>

              </div>
            ) : (
              <button
                onClick={() => setIsCardVisible(true)}
                className="bg-white/90 hover:bg-white text-[#0B1F4E] px-4 py-2 rounded-full text-xs font-bold shadow-xl backdrop-blur-md border border-[#C9A84C] flex items-center space-x-2 cursor-pointer transition-all hover:scale-105"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Show Highlights</span>
              </button>
            )}
          </div>

        </div>
      </div>

      {/* PREV / NEXT CHEVRON BUTTONS (POSITIONED SAFELY TO PREVENT TEXT OVERLAP) */}
      <button
        onClick={prevSlide}
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-[#C9A84C] text-white hover:text-[#164E8C] border border-white/20 transition-all backdrop-blur-sm hidden sm:flex items-center justify-center cursor-pointer shadow-xl"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 z-20 p-2 sm:p-2.5 rounded-full bg-black/60 hover:bg-[#C9A84C] text-white hover:text-[#164E8C] border border-white/20 transition-all backdrop-blur-sm hidden sm:flex items-center justify-center cursor-pointer shadow-xl"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* SLIDER PAGINATION DOTS */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center space-x-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            aria-label={`Go to slide ${idx + 1}`}
            className={`h-2 rounded-full transition-all cursor-pointer ${
              currentIndex === idx ? 'w-8 bg-[#C9A84C]' : 'w-2 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>

    </section>
  );
}
