import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Maximize2,
  Calendar,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { EVENT_ALBUMS } from '../../data/eventAlbumsData';

export default function GallerySection() {
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const carouselRef = useRef(null);

  // Flattened high-impact event showcase items mapped to their parent album
  const carouselItems = React.useMemo(() => {
    const items = [];
    EVENT_ALBUMS.forEach(album => {
      // Pick top 2-3 vibrant photos from each event album
      const picks = [0, 1, 2].filter(idx => idx < album.images.length);
      picks.forEach(idx => {
        items.push({
          id: `${album.id}_${idx}`,
          image: album.images[idx],
          album: album,
          photoIndex: idx
        });
      });
    });
    return items;
  }, []);

  // Auto-slide carousel smoothly
  useEffect(() => {
    if (isPaused || activeAlbum) return;
    const interval = setInterval(() => {
      if (carouselRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 340, behavior: 'smooth' });
        }
      }
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused, activeAlbum]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -360, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 360, behavior: 'smooth' });
    }
  };

  const openAlbum = (album, photoIdx = 0) => {
    setActiveAlbum(album);
    setCurrentPhotoIndex(photoIdx);
    document.body.style.overflow = 'hidden';
  };

  const closeAlbum = () => {
    setActiveAlbum(null);
    setCurrentPhotoIndex(0);
    document.body.style.overflow = 'unset';
  };

  const nextPhoto = (e) => {
    e?.stopPropagation();
    if (!activeAlbum) return;
    setCurrentPhotoIndex((prev) => (prev + 1) % activeAlbum.images.length);
  };

  const prevPhoto = (e) => {
    e?.stopPropagation();
    if (!activeAlbum) return;
    setCurrentPhotoIndex((prev) => (prev - 1 + activeAlbum.images.length) % activeAlbum.images.length);
  };

  // Keyboard Navigation Support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!activeAlbum) return;
      if (e.key === 'Escape') closeAlbum();
      if (e.key === 'ArrowRight') nextPhoto();
      if (e.key === 'ArrowLeft') prevPhoto();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAlbum]);

  return (
    <section className="bg-[#071A33] text-white py-14 sm:py-18 px-4 sm:px-6 lg:px-8 border-y border-slate-800 relative overflow-hidden">
      
      {/* Background Subtle Pattern */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-[radial-gradient(#1C5496_1px,transparent_1px)] [background-size:2rem_2rem] opacity-15 pointer-events-none" 
      />

      <div className="max-w-[1440px] mx-auto space-y-8 relative z-10">
        
        {/* SECTION HEADER & CAROUSEL CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-slate-800 pb-5 gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest block font-sans">
              Campus Life & Events
            </span>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
              Event Photographs & Moments
            </h2>
          </div>

          {/* Carousel Left / Right Arrow Buttons */}
          <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-slate-900/90 hover:bg-[#C9A84C] text-white hover:text-[#071A33] border border-slate-700 hover:border-[#C9A84C] transition-all flex items-center justify-center cursor-pointer shadow-md"
              aria-label="Scroll Carousel Left"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-slate-900/90 hover:bg-[#C9A84C] text-white hover:text-[#071A33] border border-slate-700 hover:border-[#C9A84C] transition-all flex items-center justify-center cursor-pointer shadow-md"
              aria-label="Scroll Carousel Right"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* ================= PURE IMAGE CAROUSEL (NO TEXT / NO NUMBERS) ================= */}
        <div 
          ref={carouselRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex space-x-4 sm:space-x-6 overflow-x-auto no-scrollbar scroll-smooth py-2 px-1 cursor-grab active:cursor-grabbing"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {carouselItems.map((item) => (
            <div
              key={item.id}
              onClick={() => openAlbum(item.album, item.photoIndex)}
              className="w-[260px] sm:w-[320px] md:w-[360px] aspect-[16/10] rounded-2xl overflow-hidden shrink-0 shadow-lg border border-slate-800/80 hover:border-[#C9A84C] transition-all duration-300 transform hover:scale-[1.03] group cursor-pointer relative bg-slate-950"
              style={{ scrollSnapAlign: 'start' }}
            >
              {/* Pure Photograph without any overlay text */}
              <img
                src={item.image}
                alt="St. Philomena's College Event Photograph"
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-108 filter brightness-[0.96]"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/media/gallery/picture-gallery/athletic_day_2026.jpg';
                }}
              />

              {/* Hover Sleek Zoom / Expand Indicator */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-11 h-11 rounded-full bg-[#C9A84C] text-[#071A33] flex items-center justify-center shadow-xl transform scale-90 group-hover:scale-100 transition-transform">
                  <Maximize2 className="w-5 h-5" />
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ================= INTERACTIVE FULL-SCREEN EVENT ALBUM MODAL / LIGHTBOX ================= */}
      {activeAlbum && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn"
          onClick={closeAlbum}
        >
          {/* Modal Header Bar */}
          <div 
            className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#C9A84C] text-[#060f26] px-2 py-0.5 rounded">
                  {activeAlbum.categoryLabel}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Photo {currentPhotoIndex + 1} of {activeAlbum.images.length}
                </span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-xl text-white truncate">
                {activeAlbum.title}
              </h3>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={closeAlbum}
                className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors border border-white/20"
                aria-label="Close Viewer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Modal Center Stage (Large Photo + Navigation Arrows) */}
          <div 
            className="relative flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Previous Arrow */}
            <button
              onClick={prevPhoto}
              className="absolute left-4 sm:left-8 z-30 w-12 h-12 rounded-2xl bg-black/70 hover:bg-[#C9A84C] text-white hover:text-[#060f26] border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Main Featured Photo */}
            <div className="relative max-w-5xl max-h-[65vh] w-full h-full flex items-center justify-center">
              <img
                key={activeAlbum.images[currentPhotoIndex]}
                src={activeAlbum.images[currentPhotoIndex]}
                alt={`${activeAlbum.title} - Photo ${currentPhotoIndex + 1}`}
                className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-2xl animate-fadeIn"
              />
            </div>

            {/* Next Arrow */}
            <button
              onClick={nextPhoto}
              className="absolute right-4 sm:right-8 z-30 w-12 h-12 rounded-2xl bg-black/70 hover:bg-[#C9A84C] text-white hover:text-[#060f26] border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Bottom Filmstrip Thumbnail Tray */}
          <div 
            className="p-3 sm:p-4 bg-slate-950/90 border-t border-slate-800 overflow-x-auto no-scrollbar z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-center space-x-2 sm:space-x-3 min-w-max mx-auto px-4">
              {activeAlbum.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPhotoIndex(idx)}
                  className={`w-14 sm:w-18 h-10 sm:h-12 rounded-lg overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    idx === currentPhotoIndex
                      ? 'border-[#C9A84C] scale-110 shadow-lg ring-2 ring-[#C9A84C]/50'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
