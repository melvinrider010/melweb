import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Sparkles, ArrowRight } from 'lucide-react';
import { cmsStore } from '../../lib/cmsStore';
import { gsap } from '../../animations/gsapConfig';
import { motionTokens } from '../../animations/motionTokens';

export default function HeroSlider() {
  const [slides, setSlides] = useState(cmsStore.getSliders());
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideRef = useRef(null);

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
    if (!slideRef.current || motionTokens.isReducedMotion()) return;

    let ctx = gsap.context(() => {
      gsap.fromTo(
        '.slider-card',
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' }
      );
    }, slideRef);

    const timer = setInterval(() => {
      nextSlide();
    }, 7000);

    return () => {
      clearInterval(timer);
      ctx.revert();
    };
  }, [currentIndex, slides]);

  if (!activeSlide) return null;

  return (
    <section ref={slideRef} className="relative min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] bg-gradient-blue text-white overflow-hidden border-b-4 border-[#FFC928] flex items-center">
      
      {/* LOCAL OFFICIAL HERO BACKGROUND VIDEO & POSTER FALLBACK */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/media/hero/campus-hero-poster.jpg"
          className="w-full h-full object-cover filter brightness-[0.70] scale-100 transition-transform duration-1000"
        >
          <source src="/media/hero/campus-hero.mp4" type="video/mp4" />
          {/* Fallback image if video element not supported */}
          <img
            src="/media/hero/campus-hero-poster.jpg"
            alt="St. Philomena's College Campus"
            className="w-full h-full object-cover"
          />
        </video>
        {/* Preserved Institutional Royal Navy / Blue Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#071A33] via-[#071A33]/40 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[#071A33]/30 pointer-events-none" />
      </div>

      {/* HERO MAIN CONTENT GRID */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 w-full relative z-10 py-12 sm:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
          
          {/* LEFT: HERO HEADLINES & CATEGORY */}
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-[#FFC928]/20 text-[#FFD84A] border border-[#FFC928]/40 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD84A]" />
              <span>{activeSlide.category}</span>
            </div>

            <h1 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-[64px] xl:text-[72px] leading-[1.06] text-white drop-shadow-2xl tracking-tight">
              {activeSlide.title}
            </h1>

            <p className="text-[#FFD84A] font-serif text-base sm:text-xl font-bold tracking-wide">
              {activeSlide.subtitle}
            </p>
          </div>

          {/* RIGHT: HERO INFORMATION CARD */}
          <div className="lg:col-span-5">
            <div className="slider-card bg-white/95 backdrop-blur-md text-[#071A33] p-6 sm:p-8 rounded-2xl shadow-2xl border-l-8 border-[#FFC928] space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFC928] block font-sans">Institutional Highlights</span>
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-[#071A33] leading-snug">{activeSlide.title}</h3>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">{activeSlide.description}</p>
              
              <div className="pt-2 flex items-center justify-between">
                <Link
                  to={activeSlide.ctaLink}
                  className="btn-gold text-xs sm:text-sm font-bold px-5 sm:px-6 py-2.5 sm:py-3 rounded-lg shadow-md flex items-center group transition-all"
                >
                  <span>{activeSlide.ctaText}</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/admissions"
                  className="text-xs font-bold text-[#071A33] hover:text-[#1C5496] transition-colors"
                >
                  Apply 2026–27 →
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* CAROUSEL LEFT / RIGHT ARROWS */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white border border-white/20 transition-all backdrop-blur-sm hidden sm:block cursor-pointer"
        aria-label="Previous Slide"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-slate-950/60 hover:bg-slate-950 text-white border border-white/20 transition-all backdrop-blur-sm hidden sm:block cursor-pointer"
        aria-label="Next Slide"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

    </section>
  );
}
