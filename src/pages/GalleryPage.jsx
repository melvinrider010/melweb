import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Calendar, 
  ExternalLink, 
  ArrowLeft, 
  ChevronLeft, 
  ChevronRight, 
  X, 
  Sparkles,
  Layers,
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle2,
  Maximize2,
  Loader2
} from 'lucide-react';
import galleryData from '../data/galleryData.json';
import { animatePageIn } from '../animations/pageTransitions';

const ALBUMS_PER_PAGE = 16;
const PHOTOS_PER_PAGE = 24;

export default function GalleryPage() {
  const containerRef = useRef(null);
  const { albumSlug } = useParams();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  // Progressive batch rendering state to keep DOM lightweight and 60fps smooth
  const [visibleAlbumCount, setVisibleAlbumCount] = useState(ALBUMS_PER_PAGE);
  const [visiblePhotoCount, setVisiblePhotoCount] = useState(PHOTOS_PER_PAGE);
  const albumSentinelRef = useRef(null);
  const photoSentinelRef = useRef(null);

  useEffect(() => {
    animatePageIn(containerRef);
  }, []);

  // Sync album selection with URL slug
  useEffect(() => {
    if (albumSlug) {
      const found = galleryData.albums.find(
        (a) => a.slug.toLowerCase() === albumSlug.toLowerCase() || a.id.toLowerCase() === albumSlug.toLowerCase()
      );
      if (found) {
        setSelectedAlbum(found);
        setVisiblePhotoCount(PHOTOS_PER_PAGE);
      } else {
        setSelectedAlbum(null);
      }
    } else {
      setSelectedAlbum(null);
      setVisibleAlbumCount(ALBUMS_PER_PAGE);
    }
  }, [albumSlug]);

  const categories = [
    { id: 'all', label: 'All Albums', count: galleryData.totalAlbums },
    { id: 'events', label: 'Events & Fests' },
    { id: 'academics', label: 'Academics & Seminars' },
    { id: 'sports', label: 'Sports & Athletics' },
    { id: 'cultural', label: 'Cultural & Heritage' },
    { id: 'outreach', label: 'Campus Life & Community' }
  ];

  const filteredAlbums = useMemo(() => {
    return galleryData.albums.filter((album) => {
      const matchesCategory = activeCategory === 'all' || album.category === activeCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = !query || 
        album.title.toLowerCase().includes(query) ||
        (album.year && album.year.includes(query)) ||
        (album.categoryLabel && album.categoryLabel.toLowerCase().includes(query)) ||
        album.slug.toLowerCase().includes(query);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Reset visible counts when filter/search changes
  useEffect(() => {
    setVisibleAlbumCount(ALBUMS_PER_PAGE);
  }, [activeCategory, searchQuery]);

  // Infinite scroll observer for Album Catalog
  useEffect(() => {
    if (selectedAlbum) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisibleAlbumCount((prev) => Math.min(prev + ALBUMS_PER_PAGE, filteredAlbums.length));
        }
      },
      { rootMargin: '400px' }
    );

    if (albumSentinelRef.current) {
      observer.observe(albumSentinelRef.current);
    }
    return () => observer.disconnect();
  }, [selectedAlbum, filteredAlbums.length]);

  // Infinite scroll observer for Photos inside Album View
  useEffect(() => {
    if (!selectedAlbum) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setVisiblePhotoCount((prev) => Math.min(prev + PHOTOS_PER_PAGE, selectedAlbum.images.length));
        }
      },
      { rootMargin: '400px' }
    );

    if (photoSentinelRef.current) {
      observer.observe(photoSentinelRef.current);
    }
    return () => observer.disconnect();
  }, [selectedAlbum]);

  const handleOpenAlbum = (album) => {
    setSelectedAlbum(album);
    setVisiblePhotoCount(PHOTOS_PER_PAGE);
    navigate(`/gallery/${album.slug}`);
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleBackToAlbums = () => {
    setSelectedAlbum(null);
    navigate('/gallery');
    window.scrollTo({ top: 150, behavior: 'smooth' });
  };

  const handleNextImage = useCallback(() => {
    if (!selectedAlbum || lightboxIndex === null) return;
    setZoomLevel(1);
    setLightboxIndex((prev) => (prev + 1) % selectedAlbum.images.length);
  }, [selectedAlbum, lightboxIndex]);

  const handlePrevImage = useCallback(() => {
    if (!selectedAlbum || lightboxIndex === null) return;
    setZoomLevel(1);
    setLightboxIndex((prev) => (prev - 1 + selectedAlbum.images.length) % selectedAlbum.images.length);
  }, [selectedAlbum, lightboxIndex]);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (lightboxIndex !== null) {
        if (e.key === 'Escape') {
          setLightboxIndex(null);
          setZoomLevel(1);
        }
        if (e.key === 'ArrowRight') handleNextImage();
        if (e.key === 'ArrowLeft') handlePrevImage();
        if (e.key === '+' || e.key === '=') setZoomLevel((z) => Math.min(z + 0.5, 3));
        if (e.key === '-') setZoomLevel((z) => Math.max(z - 0.5, 1));
        if (e.key === '0') setZoomLevel(1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, handleNextImage, handlePrevImage]);

  // Preload adjacent full-res images in Lightbox
  useEffect(() => {
    if (lightboxIndex !== null && selectedAlbum) {
      const len = selectedAlbum.images.length;
      const nextIdx = (lightboxIndex + 1) % len;
      const prevIdx = (lightboxIndex - 1 + len) % len;
      const nextImg = new Image();
      nextImg.src = selectedAlbum.images[nextIdx];
      const prevImg = new Image();
      prevImg.src = selectedAlbum.images[prevIdx];
    }
  }, [lightboxIndex, selectedAlbum]);

  // Touch Swipe for mobile lightbox
  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe) {
      handleNextImage();
    } else if (isRightSwipe) {
      handlePrevImage();
    }
  };

  // Helper to get WebP thumbnail path from image path
  const getThumbnailUrl = (album, imgIndex) => {
    if (album.thumbnails && album.thumbnails[imgIndex]) {
      return album.thumbnails[imgIndex];
    }
    const orig = album.images[imgIndex];
    if (!orig) return '';
    const parts = orig.split('/');
    const filename = parts[parts.length - 1];
    const base = filename.substring(0, filename.lastIndexOf('.'));
    return `/gallery/thumbs/${album.slug}/${base}.webp`;
  };

  const visibleAlbums = useMemo(() => {
    return filteredAlbums.slice(0, visibleAlbumCount);
  }, [filteredAlbums, visibleAlbumCount]);

  return (
    <div ref={containerRef} className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 space-y-8 text-[#071A33]">
      
      {/* INSTITUTIONAL HERO BANNER */}
      <div className="bg-[#071A33] text-white rounded-2xl p-6 sm:p-10 border-l-8 border-[#FFC928] shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD84A]" />
            <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest">
              Official Media Repository (100% Local Mirror)
            </span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            Institutional Picture Gallery
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Archive of <strong>{galleryData.totalAlbums} official photo albums</strong> and over <strong>{galleryData.totalImages?.toLocaleString()} high-resolution photographs</strong> capturing graduation ceremonies, national seminars, athletic meets, cultural fests, and student life at St. Philomena's College.
          </p>
        </div>
      </div>

      {/* ALBUM DRILLDOWN VIEW */}
      {selectedAlbum ? (
        <div className="space-y-6 animate-fadeIn">
          
          {/* Back & Breadcrumb Bar */}
          <div className="flex flex-wrap justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-xs gap-3">
            <button
              onClick={handleBackToAlbums}
              className="inline-flex items-center text-sm font-bold text-[#1C5496] hover:text-[#0F3B70] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to All {galleryData.totalAlbums} Picture Albums</span>
            </button>
            <div className="flex items-center space-x-3 text-xs sm:text-sm text-slate-500">
              <span className="bg-blue-50 text-[#1C5496] font-bold px-2.5 py-0.5 rounded">
                {selectedAlbum.categoryLabel}
              </span>
              <span>·</span>
              <span className="font-semibold text-slate-700">{selectedAlbum.images.length} Photos in Collection</span>
              {selectedAlbum.year && (
                <>
                  <span>·</span>
                  <span className="flex items-center gap-1 font-semibold text-slate-700">
                    <Calendar className="w-3.5 h-3.5 text-[#1C5496]" />
                    {selectedAlbum.year}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Album Title Header */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">Album Showcase</span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Local Media Verified (Optimized WebP)
              </span>
            </div>
            <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-slate-900">{selectedAlbum.title}</h2>
            <p className="text-sm text-slate-600">Click on any photograph below to view in full resolution or download.</p>
          </div>

          {/* Album Photo Grid with Optimized WebP Thumbnails & Lazy Windowing */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {selectedAlbum.images.slice(0, visiblePhotoCount).map((origUrl, imgIdx) => {
              const thumbUrl = getThumbnailUrl(selectedAlbum, imgIdx);
              return (
                <div
                  key={imgIdx}
                  onClick={() => {
                    setZoomLevel(1);
                    setLightboxIndex(imgIdx);
                  }}
                  className="aspect-square bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-md cursor-pointer group relative transition-transform duration-200 hover:scale-102"
                  style={{ contentVisibility: 'auto' }}
                >
                  <img
                    src={thumbUrl}
                    alt={`${selectedAlbum.title} photo ${imgIdx + 1}`}
                    className="w-full h-full object-cover group-hover:brightness-95 transition-all duration-200"
                    loading="lazy"
                    decoding="async"
                    onError={(e) => {
                      // Fallback to original image if thumb fails
                      if (e.target.src !== origUrl) {
                        e.target.src = origUrl;
                      }
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2 text-white text-xs font-bold">
                    <span>Photo #{imgIdx + 1}</span>
                    <Maximize2 className="w-3.5 h-3.5 text-white/90" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Sentinel for progressive photo batch loading */}
          {visiblePhotoCount < selectedAlbum.images.length && (
            <div ref={photoSentinelRef} className="py-8 flex justify-center items-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#1C5496]" />
            </div>
          )}

        </div>
      ) : (

        /* ALBUMS CATALOG VIEW */
        <div className="space-y-6">

          {/* FILTER & SEARCH CONTROL BAR */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
            
            {/* Search Input & Stats */}
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  placeholder="Search albums (e.g. Graduation, Cricket, Seminar, Rajyotsava, 2026)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1C5496] placeholder-slate-400 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-3 text-sm text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              <div className="text-sm text-slate-500 font-semibold flex items-center space-x-2">
                <Layers className="w-4 h-4 text-[#1C5496]" />
                <span>Showing <strong>{visibleAlbums.length}</strong> of <strong>{filteredAlbums.length}</strong> verified albums</span>
              </div>
            </div>

            {/* Category Pills */}
            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              {categories.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = cat.id === 'all' 
                  ? galleryData.totalAlbums 
                  : galleryData.albums.filter(a => a.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                      isActive
                        ? 'bg-[#1C5496] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

          </div>

          {/* ALBUMS GRID WITH FAST WEBP COVERS & PROGRESSIVE WINDOWING */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleAlbums.map((album) => {
              const coverThumb = album.cover || getThumbnailUrl(album, 0);
              const coverOrig = album.coverOriginal || album.images[0];
              return (
                <div
                  key={album.id}
                  onClick={() => handleOpenAlbum(album)}
                  className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1"
                  style={{ contentVisibility: 'auto' }}
                >
                  <div>
                    {/* Album Cover Thumbnail with explicit aspect ratio */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={coverThumb}
                        alt={album.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        loading="lazy"
                        decoding="async"
                        onError={(e) => {
                          if (e.target.src !== coverOrig) {
                            e.target.src = coverOrig;
                          }
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
                      
                      {/* Photo Count Badge */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between items-center text-white text-xs font-bold">
                        <span className="bg-[#071A33]/90 px-2.5 py-1 rounded-md backdrop-blur-xs border border-white/10 flex items-center gap-1.5 shadow-sm">
                          <ImageIcon className="w-3.5 h-3.5 text-[#FFD84A]" />
                          <span>{album.imageCount || album.images.length} Photos</span>
                        </span>
                        {album.year && (
                          <span className="bg-[#D4AF37] text-[#071A33] px-2 py-0.5 rounded font-mono font-bold text-[11px] shadow-sm">
                            {album.year}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Album Info */}
                    <div className="p-4 sm:p-5 space-y-2">
                      <span className="text-xs font-bold text-[#1C5496] uppercase tracking-wider block">
                        {album.categoryLabel}
                      </span>
                      <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug line-clamp-2" title={album.title}>
                        {album.title}
                      </h3>
                    </div>
                  </div>

                  {/* Card Bottom CTA */}
                  <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs sm:text-sm font-bold text-[#1C5496] group-hover:text-[#0F3B70]">
                    <span>View Photo Album</span>
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </div>

                </div>
              );
            })}
          </div>

          {/* Sentinel for progressive album batch loading */}
          {visibleAlbumCount < filteredAlbums.length && (
            <div ref={albumSentinelRef} className="py-8 flex justify-center items-center text-slate-400">
              <Loader2 className="w-6 h-6 animate-spin text-[#1C5496]" />
            </div>
          )}

        </div>
      )}

      {/* LIGHTBOX MODAL (ONLY LOADS FULL-RES ORIGINAL FOR ACTIVE PHOTO) */}
      {lightboxIndex !== null && selectedAlbum && (
        <div 
          className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn select-none"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          
          {/* Top Controls Bar */}
          <div className="flex justify-between items-center p-4 bg-slate-900/80 border-b border-slate-800 text-white z-20">
            <div className="flex items-center space-x-3">
              <span className="font-serif font-bold text-base sm:text-lg text-[#FFD84A] truncate max-w-xs sm:max-w-md">
                {selectedAlbum.title}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                ({lightboxIndex + 1} / {selectedAlbum.images.length})
              </span>
            </div>

            <div className="flex items-center space-x-2">
              {/* Zoom Controls */}
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.5, 3))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title="Zoom In (+)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.5, 1))}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                title="Zoom Out (-)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              {zoomLevel > 1 && (
                <button
                  onClick={() => setZoomLevel(1)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors cursor-pointer"
                  title="Reset Zoom (0)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}

              {/* Direct Local Download Button */}
              <a
                href={selectedAlbum.images[lightboxIndex]}
                download={`${selectedAlbum.slug}-photo-${lightboxIndex + 1}.jpg`}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors flex items-center space-x-1 cursor-pointer text-xs font-bold"
                title="Download High-Res Original"
              >
                <Download className="w-4 h-4 text-[#FFD84A]" />
                <span className="hidden sm:inline">Download</span>
              </a>

              {/* Close Button */}
              <button
                onClick={() => {
                  setLightboxIndex(null);
                  setZoomLevel(1);
                }}
                className="p-2 rounded-lg bg-red-900/60 hover:bg-red-800 text-white transition-colors cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Main Photo Display Stage */}
          <div className="relative flex-1 flex items-center justify-center p-2 sm:p-6 overflow-hidden">
            
            {/* Left Nav Button */}
            <button
              onClick={handlePrevImage}
              className="absolute left-2 sm:left-6 z-30 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 shadow-2xl transition-transform hover:scale-110 cursor-pointer"
              aria-label="Previous Photo"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* High-Resolution Full Size Image with smooth transform */}
            <div 
              className="relative max-w-full max-h-full flex items-center justify-center transition-transform duration-200"
              style={{
                transform: `scale(${zoomLevel})`,
                cursor: zoomLevel > 1 ? 'grab' : 'default'
              }}
            >
              <img
                src={selectedAlbum.images[lightboxIndex]}
                alt={`${selectedAlbum.title} full view`}
                className="max-h-[75vh] sm:max-h-[80vh] max-w-[90vw] object-contain rounded-lg shadow-2xl drop-shadow-2xl select-none"
                decoding="async"
              />
            </div>

            {/* Right Nav Button */}
            <button
              onClick={handleNextImage}
              className="absolute right-2 sm:right-6 z-30 p-3 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700/80 shadow-2xl transition-transform hover:scale-110 cursor-pointer"
              aria-label="Next Photo"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

          {/* Bottom Fast Thumbnail Strip */}
          <div className="p-3 bg-slate-900/90 border-t border-slate-800 overflow-x-auto z-20 flex justify-center">
            <div className="flex space-x-2 max-w-full overflow-x-auto py-1 px-4">
              {selectedAlbum.images.map((_, tIdx) => {
                const isCurrent = tIdx === lightboxIndex;
                const thumbUrl = getThumbnailUrl(selectedAlbum, tIdx);
                return (
                  <button
                    key={tIdx}
                    onClick={() => {
                      setZoomLevel(1);
                      setLightboxIndex(tIdx);
                    }}
                    className={`w-12 h-12 rounded-md overflow-hidden shrink-0 border-2 transition-all cursor-pointer ${
                      isCurrent ? 'border-[#FFD84A] scale-110' : 'border-transparent opacity-50 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={thumbUrl}
                      alt={`Thumbnail ${tIdx + 1}`}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
