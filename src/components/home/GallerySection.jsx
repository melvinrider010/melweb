import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2,
  Calendar,
  Sparkles,
  ArrowRight,
  Layers,
  Image as ImageIcon,
  ExternalLink
} from 'lucide-react';
import carouselMoments from '../../data/carouselMomentsData.json';

export default function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeAlbumModal, setActiveAlbumModal] = useState(null);
  const [modalPhotoIndex, setModalPhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Drag & Touch support for main photograph
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const filmstripRef = useRef(null);

  const totalMoments = carouselMoments.length;
  const currentMoment = carouselMoments[currentIndex] || carouselMoments[0];

  // Auto-scroll the thumbnail filmstrip so active thumbnail is centered
  useEffect(() => {
    if (filmstripRef.current) {
      const activeThumb = filmstripRef.current.children[currentIndex];
      if (activeThumb) {
        const strip = filmstripRef.current;
        const scrollTarget = activeThumb.offsetLeft - (strip.clientWidth / 2) + (activeThumb.clientWidth / 2);
        strip.scrollTo({ left: scrollTarget, behavior: 'smooth' });
      }
    }
    setImageLoaded(false);
  }, [currentIndex]);

  // Next / Previous Navigation
  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % totalMoments);
  }, [totalMoments]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + totalMoments) % totalMoments);
  }, [totalMoments]);

  // Touch handlers for mobile swipe
  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeAlbumModal) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowRight') nextModalPhoto();
        if (e.key === 'ArrowLeft') prevModalPhoto();
      } else {
        if (e.key === 'ArrowLeft') handlePrev();
        if (e.key === 'ArrowRight') handleNext();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAlbumModal, handleNext, handlePrev]);

  // Auto-advance slideshow
  useEffect(() => {
    if (isPaused || activeAlbumModal) return;
    const interval = setInterval(() => {
      handleNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, activeAlbumModal, handleNext]);

  // Lightbox Modal Controls
  const openLightbox = (moment) => {
    setActiveAlbumModal(moment.album);
    setModalPhotoIndex(moment.photoIndex || 0);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setActiveAlbumModal(null);
    setModalPhotoIndex(0);
    document.body.style.overflow = 'unset';
  };

  const nextModalPhoto = (e) => {
    e?.stopPropagation();
    if (!activeAlbumModal) return;
    setModalPhotoIndex((prev) => (prev + 1) % activeAlbumModal.images.length);
  };

  const prevModalPhoto = (e) => {
    e?.stopPropagation();
    if (!activeAlbumModal) return;
    setModalPhotoIndex((prev) => (prev - 1 + activeAlbumModal.images.length) % activeAlbumModal.images.length);
  };

  return (
    <section className="bg-[#050E1B] text-white py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      
      {/* Background ambient lighting */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-blue-900/15 blur-[140px] pointer-events-none rounded-full" 
      />

      <div className="max-w-[1440px] mx-auto space-y-8 relative z-10">
        
        {/* ================= SECTION HEADER & METRICS ================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/10 pb-5 gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[#FFD84A] font-semibold text-xs uppercase tracking-widest block font-sans">
              Campus Life & Events
            </span>
            <h2 className="font-heading font-semibold text-2xl sm:text-3xl text-white tracking-tight leading-tight">
              Event Photographs & Moments
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Counter Badge */}
            <div className="bg-[#0B172E] border border-slate-700/80 rounded-full px-4 py-1.5 text-xs font-mono font-bold shadow-inner inline-flex items-center space-x-1.5">
              <span className="text-[#FFD84A]">
                {String(currentIndex + 1).padStart(2, '0')}
              </span>
              <span className="text-slate-500 font-normal">
                / {String(totalMoments).padStart(2, '0')}
              </span>
              <span className="text-slate-400 font-sans font-semibold text-[10px] uppercase tracking-wider ml-1">
                MOMENTS CAPTURED
              </span>
            </div>

            {/* Previous & Next Photograph Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="w-9 h-9 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-[#FFD84A] text-slate-300 hover:text-slate-950 hover:border-[#FFD84A] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md active:scale-95"
                aria-label="Previous Photograph"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
              </button>
              <button
                onClick={handleNext}
                className="w-9 h-9 rounded-full border border-slate-700 bg-slate-900/80 hover:bg-[#FFD84A] text-slate-300 hover:text-slate-950 hover:border-[#FFD84A] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md active:scale-95"
                aria-label="Next Photograph"
              >
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>

        {/* ================= EDITORIAL HERO STAGE (MAIN DISPLAY) ================= */}
        <div 
          className="relative w-full rounded-3xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl group cursor-pointer"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onClick={() => openLightbox(currentMoment)}
        >
          {/* Main Stage Photograph Area */}
          <div className="relative w-full aspect-[16/10] sm:aspect-[21/9] md:aspect-[2.35/1] max-h-[580px] overflow-hidden flex items-center justify-center bg-black">
            <img
              src={currentMoment.image}
              alt={currentMoment.album?.title || "St. Philomena's College Event Photograph"}
              className={`w-full h-full object-contain transition-all duration-700 ${
                imageLoaded ? 'opacity-100 scale-100' : 'opacity-90 scale-98'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = '/media/gallery/picture-gallery/athletic_day_2026.jpg';
              }}
            />

            {/* Cinematic Gradient Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />

            {/* Overlay Metadata Card (Bottom Left) */}
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-none">
              <div className="space-y-1.5 max-w-2xl text-left">
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-[#FFD84A] bg-[#071326]/80 px-2.5 py-0.5 rounded-full border border-[#FFD84A]/30 uppercase tracking-wider backdrop-blur-md">
                    {currentMoment.album?.categoryLabel || 'Campus Event'}
                  </span>
                  <span className="text-slate-400 text-xs font-mono">
                    {currentMoment.album?.images?.length || 1} Photos in Album
                  </span>
                </div>
                <h3 className="font-heading font-bold text-xl sm:text-2xl md:text-3xl text-white tracking-tight drop-shadow-md">
                  {currentMoment.album?.title}
                </h3>
              </div>

              {/* View Fullscreen Pill Button */}
              <div className="pointer-events-auto self-start sm:self-end">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openLightbox(currentMoment);
                  }}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-[#FFD84A] text-white hover:text-slate-950 border border-white/20 hover:border-[#FFD84A] backdrop-blur-md transition-all text-xs font-bold inline-flex items-center space-x-2 cursor-pointer shadow-lg active:scale-95"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Full Screen Lightbox</span>
                </button>
              </div>
            </div>

            {/* Hover Indicator */}
            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
              <div className="w-14 h-14 rounded-full bg-[#FFD84A] text-[#071326] flex items-center justify-center shadow-2xl transform scale-80 group-hover:scale-100 transition-transform duration-300">
                <Maximize2 className="w-6 h-6 stroke-[2.5]" />
              </div>
            </div>
          </div>
        </div>

        {/* ================= HORIZONTAL THUMBNAIL FILMSTRIP NAVIGATION ================= */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs text-slate-400 px-1 font-mono">
            <span>CHOOSE PHOTOGRAPH</span>
            <span>Showing all 86 verified college moments</span>
          </div>

          <div
            ref={filmstripRef}
            className="flex items-center space-x-3 overflow-x-auto pb-3 pt-1 px-1 custom-scrollbar scroll-smooth"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {carouselMoments.map((item, idx) => {
              const isActive = idx === currentIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => setCurrentIndex(idx)}
                  style={{ scrollSnapAlign: 'start' }}
                  className={`relative flex-none w-28 sm:w-36 md:w-44 aspect-[16/10] rounded-xl overflow-hidden cursor-pointer transition-all duration-300 select-none bg-slate-900 ${
                    isActive
                      ? 'ring-2 ring-[#FFD84A] scale-105 shadow-[0_0_20px_rgba(255,216,74,0.35)] opacity-100 z-10'
                      : 'opacity-55 hover:opacity-100 hover:scale-102 border border-slate-800'
                  }`}
                >
                  <img
                    src={item.image}
                    alt={item.album?.title || `Moment ${idx + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[9px] font-mono font-bold text-slate-300 truncate w-full">
                      {item.album?.title}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ================= FOOTER DIRECTORY CTA ================= */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-white/5">
          <p className="text-xs text-slate-400 font-sans">
            Photographs archived from official college ceremonies, sports championships, conferences and cultural fests.
          </p>
          <Link
            to="/gallery"
            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-2 shadow-md shrink-0"
          >
            <span>Explore Complete Picture Gallery</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

      </div>

      {/* ================= FULLSCREEN LIGHTBOX MODAL ================= */}
      {activeAlbumModal && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-between p-4 sm:p-8 animate-fadeIn"
        >
          {/* Top Bar */}
          <div className="w-full max-w-7xl flex items-center justify-between text-white z-20 pb-4 border-b border-white/10">
            <div className="space-y-0.5 text-left">
              <span className="text-[11px] font-mono text-[#FFD84A] uppercase tracking-wider">
                {activeAlbumModal.categoryLabel || 'Official Album'}
              </span>
              <h4 className="font-heading font-bold text-lg sm:text-xl text-white">
                {activeAlbumModal.title}
              </h4>
            </div>

            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-slate-400 bg-white/10 px-3 py-1 rounded-full">
                {modalPhotoIndex + 1} / {activeAlbumModal.images.length}
              </span>
              <button
                onClick={closeLightbox}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors border border-white/20"
                aria-label="Close Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Center Photograph with Nav Arrows */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative flex-1 w-full max-w-7xl flex items-center justify-center py-4 min-h-0"
          >
            {/* Prev Photo Arrow */}
            {activeAlbumModal.images.length > 1 && (
              <button
                onClick={prevModalPhoto}
                className="absolute left-2 sm:left-4 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-[#FFD84A] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
                aria-label="Previous Photo"
              >
                <ChevronLeft className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}

            <img
              src={activeAlbumModal.images[modalPhotoIndex]}
              alt={activeAlbumModal.title}
              className="max-w-full max-h-[calc(100vh-180px)] object-contain rounded-2xl shadow-2xl"
            />

            {/* Next Photo Arrow */}
            {activeAlbumModal.images.length > 1 && (
              <button
                onClick={nextModalPhoto}
                className="absolute right-2 sm:right-4 z-30 w-12 h-12 rounded-full bg-black/60 hover:bg-[#FFD84A] text-white hover:text-black border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
                aria-label="Next Photo"
              >
                <ChevronRight className="w-6 h-6 stroke-[2.5]" />
              </button>
            )}
          </div>

          {/* Bottom Thumbnails */}
          <div 
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl flex items-center justify-center space-x-2 overflow-x-auto py-2 px-4 no-scrollbar"
          >
            {activeAlbumModal.images.map((img, i) => (
              <div
                key={i}
                onClick={() => setModalPhotoIndex(i)}
                className={`w-14 h-10 rounded-lg overflow-hidden shrink-0 cursor-pointer border-2 transition-all ${
                  i === modalPhotoIndex ? 'border-[#FFD84A] scale-110 shadow-md' : 'border-white/20 opacity-50 hover:opacity-100'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>

        </div>
      )}

    </section>
  );
}
