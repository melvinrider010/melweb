import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
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

// 3D Parallax Tilt Card for Vivid Motion Hero UI Animation
function GalleryCard({ item, index, onClick }) {
  const cardRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, isHovered: false });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Mild perspective tilt (+/- 5 deg)
    const rotateX = ((y - centerY) / centerY) * -5;
    const rotateY = ((x - centerX) / centerX) * 5;
    setTilt({ x: rotateX, y: rotateY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0, isHovered: false });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setTilt((prev) => ({ ...prev, isHovered: true }))}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      style={{
        scrollSnapAlign: 'start',
        transform: tilt.isHovered 
          ? `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale3d(1.025, 1.025, 1.025)` 
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: tilt.isHovered ? 'transform 0.1s ease-out' : 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)'
      }}
      className="w-[280px] sm:w-[360px] md:w-[420px] aspect-[16/10] rounded-[22px] overflow-hidden shrink-0 shadow-2xl border border-white/10 hover:border-[#FFD84A]/60 group cursor-pointer relative bg-slate-950 select-none transition-all duration-300"
    >
      {/* High-Resolution Event Photograph */}
      <img
        src={item.image}
        alt={item.album?.title || "St. Philomena's College Event Photograph"}
        loading="lazy"
        draggable={false}
        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108 filter brightness-[0.97]"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = '/media/gallery/picture-gallery/athletic_day_2026.jpg';
        }}
      />

      {/* Vivid Motion Hover Zoom & Soft Focus Overlay */}
      <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-[2.5px]">
        <div 
          className="w-12 h-12 rounded-full bg-[#E5C358] text-[#071326] flex items-center justify-center shadow-[0_4px_25px_rgba(229,195,88,0.6)] transform scale-80 group-hover:scale-100 transition-all duration-300"
          style={{
            transform: tilt.isHovered ? 'translateZ(30px) scale(1)' : 'translateZ(0px) scale(0.85)'
          }}
        >
          <Maximize2 className="w-5 h-5 stroke-[2.5]" />
        </div>
      </div>
    </div>
  );
}

export default function GallerySection() {
  const [activeAlbum, setActiveAlbum] = useState(null);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isScrubbing, setIsScrubbing] = useState(false);
  const [activeSlideIndex, setActiveSlideIndex] = useState(1);
  const [thumbWidthPercent, setThumbWidthPercent] = useState(22);
  const [thumbLeftPercent, setThumbLeftPercent] = useState(0);

  // Direct carousel dragging refs
  const carouselRef = useRef(null);
  const trackRef = useRef(null);
  const isDraggingCarousel = useRef(false);
  const startX = useRef(0);
  const scrollLeftStart = useRef(0);
  const dragDistance = useRef(0);

  // Curated 36 high-impact event showcase items matching Vivid Motion Hero UI
  const carouselItems = useMemo(() => {
    const items = [
      // Top curated items matching the user's screenshot (Incredema 2K26, Parade, etc.)
      {
        id: 'incredema_1',
        image: '/assets/gallery/albums/incredema-2026_1.jpg',
        album: {
          id: 'alb_incredema',
          title: 'Incredema 2K26 — National Level Management Fest',
          categoryLabel: 'Management Fest',
          images: [
            '/assets/gallery/albums/incredema-2026_1.jpg',
            '/assets/gallery/albums/incredema-2026_2.jpg',
            '/assets/gallery/albums/incredema-2026_3.jpg'
          ]
        },
        photoIndex: 0
      },
      {
        id: 'incredema_2',
        image: '/assets/gallery/albums/incredema-2026_2.jpg',
        album: {
          id: 'alb_incredema',
          title: 'Incredema 2K26 — Inaugural Stage Ceremony',
          categoryLabel: 'Management Fest',
          images: [
            '/assets/gallery/albums/incredema-2026_1.jpg',
            '/assets/gallery/albums/incredema-2026_2.jpg',
            '/assets/gallery/albums/incredema-2026_3.jpg'
          ]
        },
        photoIndex: 1
      },
      {
        id: 'incredema_3',
        image: '/assets/gallery/albums/incredema-2026_3.jpg',
        album: {
          id: 'alb_incredema',
          title: 'Incredema 2K26 — Valedictory & Delegates',
          categoryLabel: 'Management Fest',
          images: [
            '/assets/gallery/albums/incredema-2026_1.jpg',
            '/assets/gallery/albums/incredema-2026_2.jpg',
            '/assets/gallery/albums/incredema-2026_3.jpg'
          ]
        },
        photoIndex: 2
      },
      {
        id: 'republic_parade',
        image: '/gallery/albums/republic-day-2026/001.jpg',
        album: {
          id: 'alb_republic',
          title: 'Republic Day 2026 — NCC Ceremonial Parade',
          categoryLabel: 'National Celebration',
          images: [
            '/gallery/albums/republic-day-2026/001.jpg',
            '/gallery/albums/republic-day-2026/002.jpg',
            '/gallery/albums/republic-day-2026/003.jpg'
          ]
        },
        photoIndex: 0
      },
      {
        id: 'athletic_1',
        image: '/assets/gallery/albums/80th-annual-atenthic-day-2026_1.jpg',
        album: {
          id: 'alb_athletic',
          title: '80th Annual Athletic Meet 2026',
          categoryLabel: 'Sports & Athletics',
          images: [
            '/assets/gallery/albums/80th-annual-atenthic-day-2026_1.jpg',
            '/assets/gallery/albums/80th-annual-atenthic-day-2026_2.jpg',
            '/assets/gallery/albums/80th-annual-atenthic-day-2026_3.jpg'
          ]
        },
        photoIndex: 0
      },
      {
        id: 'athletic_2',
        image: '/assets/gallery/albums/80th-annual-atenthic-day-2026_2.jpg',
        album: {
          id: 'alb_athletic',
          title: '80th Annual Athletic Meet — Track & Field',
          categoryLabel: 'Sports & Athletics',
          images: [
            '/assets/gallery/albums/80th-annual-atenthic-day-2026_1.jpg',
            '/assets/gallery/albums/80th-annual-atenthic-day-2026_2.jpg',
            '/assets/gallery/albums/80th-annual-atenthic-day-2026_3.jpg'
          ]
        },
        photoIndex: 1
      },
      {
        id: 'desi_habba_1',
        image: '/assets/gallery/albums/desi-habba-literary-club-relaunch-2026_1.jpg',
        album: {
          id: 'alb_desi_habba',
          title: 'Desi Habba — Literary Club Fest 2026',
          categoryLabel: 'Cultural Fest',
          images: [
            '/assets/gallery/albums/desi-habba-literary-club-relaunch-2026_1.jpg',
            '/assets/gallery/albums/desi-habba-literary-club-relaunch-2026_2.jpg',
            '/assets/gallery/albums/desi-habba-literary-club-relaunch-2026_3.jpg'
          ]
        },
        photoIndex: 0
      },
      {
        id: 'graduation_1',
        image: '/assets/gallery/albums/graduation-day-2026_1.jpg',
        album: {
          id: 'alb_grad',
          title: 'Graduation Day Convocation 2026',
          categoryLabel: 'Convocation',
          images: [
            '/assets/gallery/albums/graduation-day-2026_1.jpg',
            '/assets/gallery/albums/graduation-day-2026_2.jpg',
            '/assets/gallery/albums/graduation-day-2026_3.jpg'
          ]
        },
        photoIndex: 0
      },
      {
        id: 'graduation_2',
        image: '/assets/gallery/albums/graduation-day-2026_2.jpg',
        album: {
          id: 'alb_grad',
          title: 'Graduation Day — Degree Conferment Ceremony',
          categoryLabel: 'Convocation',
          images: [
            '/assets/gallery/albums/graduation-day-2026_1.jpg',
            '/assets/gallery/albums/graduation-day-2026_2.jpg',
            '/assets/gallery/albums/graduation-day-2026_3.jpg'
          ]
        },
        photoIndex: 1
      },
      {
        id: 'book_expo_1',
        image: '/assets/gallery/albums/nava-karnataka-book-exhibition-2026_1.jpg',
        album: {
          id: 'alb_book',
          title: 'Nava Karnataka Book Exhibition',
          categoryLabel: 'Academic Exhibition',
          images: [
            '/assets/gallery/albums/nava-karnataka-book-exhibition-2026_1.jpg',
            '/assets/gallery/albums/nava-karnataka-book-exhibition-2026_2.jpg',
            '/assets/gallery/albums/nava-karnataka-book-exhibition-2026_3.jpg'
          ]
        },
        photoIndex: 0
      },
      {
        id: 'flea_market_1',
        image: '/assets/gallery/albums/flea-market-by-bba-department_1.jpg',
        album: {
          id: 'alb_flea',
          title: 'BBA Entrepreneurship Flea Market',
          categoryLabel: 'Student Venture',
          images: [
            '/assets/gallery/albums/flea-market-by-bba-department_1.jpg',
            '/assets/gallery/albums/flea-market-by-bba-department_2.jpg',
            '/assets/gallery/albums/flea-market-by-bba-department_3.jpg'
          ]
        },
        photoIndex: 0
      },
      {
        id: 'mba_freshers_1',
        image: '/assets/gallery/albums/mba-freshers-day-2026_1.jpg',
        album: {
          id: 'alb_mba',
          title: 'MBA Department Freshers Day',
          categoryLabel: 'Department Meet',
          images: [
            '/assets/gallery/albums/mba-freshers-day-2026_1.jpg',
            '/assets/gallery/albums/mba-freshers-day-2026_2.jpg',
            '/assets/gallery/albums/mba-freshers-day-2026_3.jpg'
          ]
        },
        photoIndex: 0
      }
    ];

    // Supplement with EVENT_ALBUMS images to achieve exactly 36 curated moments
    EVENT_ALBUMS.forEach((album) => {
      if (items.length >= 36) return;
      const picks = [0, 1, 2].filter((idx) => idx < album.images.length);
      picks.forEach((idx) => {
        if (items.length >= 36) return;
        items.push({
          id: `${album.id}_${idx}`,
          image: album.images[idx],
          album: album,
          photoIndex: idx
        });
      });
    });

    return items.slice(0, 36);
  }, []);

  // Update dynamic scroll and thumb metrics
  const updateScrollMetrics = useCallback(() => {
    if (carouselRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      const maxScroll = scrollWidth - clientWidth;
      
      // Proportional thumb width (bounded between 15% and 35%)
      const widthPct = Math.max(16, Math.min(35, (clientWidth / scrollWidth) * 100));
      setThumbWidthPercent(widthPct);

      if (maxScroll > 0) {
        const ratio = Math.max(0, Math.min(1, scrollLeft / maxScroll));
        const leftPct = ratio * (100 - widthPct);
        setThumbLeftPercent(leftPct);

        // Calculate active item index
        const itemWidth = 440; // width + gap
        const currentIdx = Math.min(carouselItems.length, Math.max(1, Math.round(scrollLeft / itemWidth) + 1));
        setActiveSlideIndex(currentIdx);
      } else {
        setThumbLeftPercent(0);
        setActiveSlideIndex(1);
      }
    }
  }, [carouselItems.length]);

  useEffect(() => {
    updateScrollMetrics();
    window.addEventListener('resize', updateScrollMetrics);
    return () => window.removeEventListener('resize', updateScrollMetrics);
  }, [updateScrollMetrics]);

  // Handle direct scrubbing & drag along the scrubber track
  const handleScrub = (clientX) => {
    if (trackRef.current && carouselRef.current) {
      const rect = trackRef.current.getBoundingClientRect();
      const clickX = Math.max(0, Math.min(rect.width, clientX - rect.left));
      const ratio = clickX / rect.width;
      const { scrollWidth, clientWidth } = carouselRef.current;
      const targetScroll = ratio * (scrollWidth - clientWidth);
      carouselRef.current.scrollTo({ left: targetScroll, behavior: isScrubbing ? 'auto' : 'smooth' });
    }
  };

  const handleTrackPointerDown = (e) => {
    setIsScrubbing(true);
    setIsPaused(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    handleScrub(e.clientX);
  };

  const handleTrackPointerMove = (e) => {
    if (isScrubbing) {
      handleScrub(e.clientX);
    }
  };

  const handleTrackPointerUp = (e) => {
    if (isScrubbing) {
      setIsScrubbing(false);
      setIsPaused(false);
      try {
        e.currentTarget.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }
  };

  // Direct Mouse Dragging on the Carousel track (Vivid Motion interaction)
  const handleCarouselPointerDown = (e) => {
    if (!carouselRef.current) return;
    isDraggingCarousel.current = true;
    dragDistance.current = 0;
    startX.current = e.clientX;
    scrollLeftStart.current = carouselRef.current.scrollLeft;
    setIsPaused(true);
  };

  const handleCarouselPointerMove = (e) => {
    if (!isDraggingCarousel.current || !carouselRef.current) return;
    const dx = e.clientX - startX.current;
    dragDistance.current = Math.abs(dx);
    carouselRef.current.scrollLeft = scrollLeftStart.current - dx;
    updateScrollMetrics();
  };

  const handleCarouselPointerUp = () => {
    isDraggingCarousel.current = false;
    setTimeout(() => {
      setIsPaused(false);
    }, 1000);
  };

  // Auto-play timer
  useEffect(() => {
    if (isPaused || activeAlbum || isScrubbing) return;
    const interval = setInterval(() => {
      if (carouselRef.current && !isDraggingCarousel.current) {
        const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 15) {
          carouselRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          carouselRef.current.scrollBy({ left: 420, behavior: 'smooth' });
        }
      }
    }, 4200);

    return () => clearInterval(interval);
  }, [isPaused, activeAlbum, isScrubbing]);

  const scrollLeft = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: -420, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (carouselRef.current) {
      carouselRef.current.scrollBy({ left: 420, behavior: 'smooth' });
    }
  };

  // Lightbox controllers
  const openAlbum = (album, photoIdx = 0) => {
    if (dragDistance.current > 8) return; // Prevent accidental click while dragging
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

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (activeAlbum) {
        if (e.key === 'Escape') closeAlbum();
        if (e.key === 'ArrowRight') nextPhoto();
        if (e.key === 'ArrowLeft') prevPhoto();
      } else {
        if (e.key === 'ArrowLeft') scrollLeft();
        if (e.key === 'ArrowRight') scrollRight();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeAlbum]);

  return (
    <section className="bg-[#06101E] text-white py-14 sm:py-18 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
      
      {/* Ambient background glow */}
      <div 
        aria-hidden="true" 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-blue-900/10 blur-[130px] pointer-events-none rounded-full" 
      />

      <div className="max-w-[1440px] mx-auto space-y-8 relative z-10">
        
        {/* ================= SECTION HEADER & TOP NAVIGATION ================= */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between border-b border-white/5 pb-5 gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest block font-sans">
              Campus Life & Events
            </span>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight leading-tight">
              Event Photographs & Moments
            </h2>
          </div>

          {/* Sleek circular navigation buttons matching screenshot */}
          <div className="flex items-center space-x-2.5 shrink-0 self-end sm:self-auto">
            <button
              onClick={scrollLeft}
              className="w-9 h-9 rounded-full border border-slate-700/80 bg-slate-900/60 hover:bg-[#FFD84A] text-slate-300 hover:text-slate-950 hover:border-[#FFD84A] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md active:scale-95"
              aria-label="Previous Slide"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            </button>
            <button
              onClick={scrollRight}
              className="w-9 h-9 rounded-full border border-slate-700/80 bg-slate-900/60 hover:bg-[#FFD84A] text-slate-300 hover:text-slate-950 hover:border-[#FFD84A] transition-all duration-300 flex items-center justify-center cursor-pointer shadow-md active:scale-95"
              aria-label="Next Slide"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* ================= HERO UI CAROUSEL WITH VELOCITY DRAGGING ================= */}
        <div 
          ref={carouselRef}
          onScroll={updateScrollMetrics}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onPointerDown={handleCarouselPointerDown}
          onPointerMove={handleCarouselPointerMove}
          onPointerUp={handleCarouselPointerUp}
          onPointerCancel={handleCarouselPointerUp}
          className="flex space-x-4 sm:space-x-6 overflow-x-auto no-scrollbar scroll-smooth py-3 px-1 cursor-grab active:cursor-grabbing"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {carouselItems.map((item, idx) => (
            <GalleryCard
              key={item.id}
              item={item}
              index={idx}
              onClick={() => openAlbum(item.album, item.photoIndex)}
            />
          ))}
        </div>

        {/* ================= HERO UI BOTTOM CONTROLS BAR ================= */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
          
          {/* Left: Counter Pill + MOMENTS CAPTURED */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="bg-[#0B172E] border border-slate-700/60 rounded-full px-3.5 py-1 text-xs font-mono font-bold shadow-inner inline-flex items-center space-x-1.5">
              <span className="text-[#FFD84A] font-bold">
                {String(activeSlideIndex).padStart(2, '0')}
              </span>
              <span className="text-slate-500 font-normal">
                / {String(carouselItems.length).padStart(2, '0')}
              </span>
            </div>
            <span className="text-[11px] text-slate-400 font-sans font-bold tracking-widest uppercase">
              Moments Captured
            </span>
          </div>

          {/* Center: Dynamic Scrubber Track with 7 Ticks & Dual-Dot Pill */}
          <div 
            ref={trackRef}
            onPointerDown={handleTrackPointerDown}
            onPointerMove={handleTrackPointerMove}
            onPointerUp={handleTrackPointerUp}
            onPointerCancel={handleTrackPointerUp}
            className="w-full sm:w-80 md:w-[440px] h-3.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-full relative cursor-grab active:cursor-grabbing backdrop-blur-md transition-all duration-200 p-0.5 group shadow-inner"
            title="Drag or click anywhere to scrub moments"
          >
            {/* 7 Vertical Tick Marks matching screenshot */}
            <div className="absolute inset-0 flex justify-between px-3.5 items-center pointer-events-none opacity-25">
              {[...Array(7)].map((_, i) => (
                <span key={i} className="w-[1px] h-1.5 bg-white rounded-full" />
              ))}
            </div>

            {/* Glowing Golden Sliding Pill with 2 Micro-dots */}
            <div 
              className={`h-full bg-gradient-to-r from-[#D4AF37] via-[#FFD84A] to-[#D4AF37] rounded-full transition-all shadow-[0_0_14px_rgba(255,216,74,0.6)] group-hover:brightness-110 relative flex items-center justify-center ${
                isScrubbing ? 'duration-0 scale-y-110' : 'duration-150'
              }`}
              style={{ 
                width: `${thumbWidthPercent}%`,
                left: `${thumbLeftPercent}%`
              }}
            >
              {/* Center Grip Micro-Dots •• */}
              <div className="flex space-x-1 items-center opacity-85 pointer-events-none">
                <span className="w-1 h-1 rounded-full bg-[#071326]" />
                <span className="w-1 h-1 rounded-full bg-[#071326]" />
              </div>
            </div>
          </div>

          {/* Right: Controls Keyboard Assist */}
          <div className="flex items-center space-x-2 text-[11px] font-sans text-slate-400">
            <span className="text-slate-500">Controls:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono shadow-xs">←</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300 text-[10px] font-mono shadow-xs">→</kbd>
            <span className="text-slate-400">or Drag Slider</span>
          </div>

        </div>

      </div>

      {/* ================= FULL-SCREEN EVENT ALBUM LIGHTBOX ================= */}
      {activeAlbum && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn"
          onClick={closeAlbum}
        >
          {/* Modal Header */}
          <div 
            className="p-4 sm:p-5 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between text-white z-20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-1 max-w-xl">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#FFD84A] text-[#071326] px-2 py-0.5 rounded">
                  {activeAlbum.categoryLabel || 'Campus Event'}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  Photo {currentPhotoIndex + 1} of {activeAlbum.images.length}
                </span>
              </div>
              <h3 className="font-serif font-bold text-base sm:text-xl text-white truncate">
                {activeAlbum.title}
              </h3>
            </div>

            <button
              onClick={closeAlbum}
              className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-colors border border-white/20"
              aria-label="Close Viewer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Center Photo */}
          <div 
            className="relative flex-1 flex items-center justify-center p-4 sm:p-8 min-h-0"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={prevPhoto}
              className="absolute left-4 sm:left-8 z-30 w-12 h-12 rounded-2xl bg-black/70 hover:bg-[#FFD84A] text-white hover:text-[#071326] border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            <div className="relative max-w-5xl max-h-[65vh] w-full h-full flex items-center justify-center">
              <img
                key={activeAlbum.images[currentPhotoIndex]}
                src={activeAlbum.images[currentPhotoIndex]}
                alt={`${activeAlbum.title} - Photo ${currentPhotoIndex + 1}`}
                className="max-w-full max-h-[65vh] object-contain rounded-xl shadow-2xl animate-fadeIn"
              />
            </div>

            <button
              onClick={nextPhoto}
              className="absolute right-4 sm:right-8 z-30 w-12 h-12 rounded-2xl bg-black/70 hover:bg-[#FFD84A] text-white hover:text-[#071326] border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-2xl"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>

          {/* Modal Filmstrip Tray */}
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
                      ? 'border-[#FFD84A] scale-110 shadow-lg ring-2 ring-[#FFD84A]/50'
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
