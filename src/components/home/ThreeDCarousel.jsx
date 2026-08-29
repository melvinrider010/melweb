import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Sparkles, X, MoveHorizontal, Maximize2 } from 'lucide-react';

export default function ThreeDCarousel({ items = [] }) {
  const count = items.length || 1;

  // Active integer index and smooth floating offset
  const [activeIndex, setActiveIndex] = useState(0);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [containerWidth, setContainerWidth] = useState(1200);

  // Animation and physics refs
  const currentOffsetRef = useRef(0);
  const targetOffsetRef = useRef(0);
  const animFrameId = useRef(null);
  const dragStartX = useRef(0);
  const dragDistanceX = useRef(0);
  const dragLastTime = useRef(0);
  const dragVelocity = useRef(0);
  const lastUserInteraction = useRef(Date.now());
  const containerRef = useRef(null);

  // Responsive breakpoints
  const isMobile = containerWidth < 640;
  const isTablet = containerWidth >= 640 && containerWidth < 1024;

  // Active card dimensions (wide cinematic landscape/editorial aspect ratio)
  const cardWidth = isMobile ? 270 : isTablet ? 340 : 420;
  const cardHeight = isMobile ? 180 : isTablet ? 225 : 275;

  // Horizontal card spacing along the arc
  const spacingX = isMobile ? 160 : isTablet ? 210 : 260;

  // Curve and depth parameters
  const archDrop = isMobile ? 8 : isTablet ? 12 : 16;
  const zDepthScale = isMobile ? 40 : isTablet ? 55 : 65;
  const maxVisibleOffset = isMobile ? 1.8 : isTablet ? 2.8 : 3.8;

  // Measure container width
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update target offset whenever activeIndex changes
  useEffect(() => {
    if (!isDragging) {
      targetOffsetRef.current = activeIndex;
    }
  }, [activeIndex, isDragging]);

  // Smooth animation loop: spring gliding to target offset
  useEffect(() => {
    let lastTime = performance.now();

    const updatePhysics = (time) => {
      const dt = Math.min((time - lastTime) / 16.67, 3);
      lastTime = time;

      if (!isDragging) {
        // Calculate shortest wrapped difference between currentOffset and targetOffset
        const diff = targetOffsetRef.current - currentOffsetRef.current;
        
        // Wrap diff to nearest modular distance
        let wrappedDiff = ((diff + count / 2) % count + count) % count - count / 2;

        if (Math.abs(wrappedDiff) > 0.001) {
          // Smooth spring-like lerp
          const step = wrappedDiff * (1 - Math.pow(0.82, dt));
          currentOffsetRef.current += step;
          // Modular wrap within [0, count]
          currentOffsetRef.current = ((currentOffsetRef.current % count) + count) % count;
          setCurrentOffset(currentOffsetRef.current);
        } else {
          currentOffsetRef.current = targetOffsetRef.current;
          setCurrentOffset(targetOffsetRef.current);
        }
      }

      animFrameId.current = requestAnimationFrame(updatePhysics);
    };

    animFrameId.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
    };
  }, [isDragging, count]);

  // Slow, refined autoplay (5.5 seconds)
  useEffect(() => {
    const timer = setInterval(() => {
      const timeSinceInteraction = Date.now() - lastUserInteraction.current;
      if (!isHovered && !isDragging && timeSinceInteraction > 5000) {
        setActiveIndex((prev) => (prev + 1) % count);
      }
    }, 5500);

    return () => clearInterval(timer);
  }, [isHovered, isDragging, count]);

  // Navigate next & previous
  const handlePrev = useCallback(() => {
    lastUserInteraction.current = Date.now();
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const handleNext = useCallback(() => {
    lastUserInteraction.current = Date.now();
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  // Pointer drag & touch swipe handlers
  const handlePointerDown = (e) => {
    setIsDragging(true);
    lastUserInteraction.current = Date.now();
    dragStartX.current = e.clientX;
    dragDistanceX.current = 0;
    dragLastTime.current = performance.now();
    dragVelocity.current = 0;
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const currentX = e.clientX;
    const deltaX = currentX - dragStartX.current;
    dragStartX.current = currentX;
    dragDistanceX.current += Math.abs(deltaX);

    const now = performance.now();
    const dt = Math.max(now - dragLastTime.current, 1);
    dragVelocity.current = -deltaX / dt;
    dragLastTime.current = now;

    // Convert pixel delta to modular offset shift
    const sensitivity = isMobile ? 0.005 : 0.0035;
    currentOffsetRef.current = ((currentOffsetRef.current - deltaX * sensitivity) % count + count) % count;
    setCurrentOffset(currentOffsetRef.current);
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);
    lastUserInteraction.current = Date.now();

    // Snap to nearest integer index taking momentum into account
    let snapIndex = Math.round(currentOffsetRef.current + dragVelocity.current * 80);
    snapIndex = ((snapIndex % count) + count) % count;
    setActiveIndex(snapIndex);
    targetOffsetRef.current = snapIndex;
  };

  // Click on a side image to glide it into center focus
  const handleCardClick = (index, offset) => {
    if (dragDistanceX.current > 8) return; // Ignore if user was dragging
    lastUserInteraction.current = Date.now();

    if (Math.abs(offset) < 0.3) {
      // Clicked active center photo -> open lightbox
      setSelectedImage(items[index]);
    } else {
      // Clicked side card -> smoothly transition it to active center
      setActiveIndex(index);
    }
  };

  return (
    <div className="w-full select-none space-y-6 sm:space-y-8">
      
      {/* 3D PARABOLIC CAROUSEL VIEWPORT (85-90% SECTION WIDTH) */}
      <div
        ref={containerRef}
        className="relative w-full max-w-[1380px] mx-auto overflow-hidden py-10 sm:py-14 flex items-center justify-center cursor-grab active:cursor-grabbing touch-none min-h-[360px] sm:min-h-[420px] lg:min-h-[460px]"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => {
          setIsHovered(false);
          handlePointerUp();
        }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        style={{
          perspective: `${isMobile ? 1000 : 1400}px`,
          touchAction: 'pan-y'
        }}
      >
        {/* Soft Radial Center Lighting */}
        <div className="absolute inset-0 bg-gradient-radial from-blue-600/15 via-transparent to-transparent opacity-70 pointer-events-none" />

        {/* 3D PRESERVE CONTAINER */}
        <div
          className="relative flex items-center justify-center w-full"
          style={{
            height: `${cardHeight + 40}px`,
            transformStyle: 'preserve-3d',
          }}
        >
          {items.map((item, index) => {
            // Calculate wrapped continuous offset relative to currentOffset
            let rawOffset = index - currentOffset;
            let offset = ((rawOffset + count / 2) % count + count) % count - count / 2;
            const absOffset = Math.abs(offset);

            // Filter out items beyond the field of view
            if (absOffset > maxVisibleOffset) return null;

            // 3D Parabolic Arc Transformations
            // 1. Horizontal arc positioning (spreads naturally across width)
            const posX = offset * spacingX * (1 - absOffset * 0.05);
            // 2. Subtle vertical curve drop
            const posY = Math.pow(absOffset, 1.55) * archDrop;
            // 3. Z-Depth: Active is at +60px, sides recede backward smoothly
            const posZ = 60 - Math.pow(absOffset, 1.4) * zDepthScale;
            // 4. Subtle 3D Y-axis inward rotation (8deg to 16deg)
            const rotY = -Math.sign(offset) * Math.min(18, Math.pow(absOffset, 0.9) * (isMobile ? 9 : 12));

            // Layered visual scaling and opacity
            const scale = Math.max(0.62, Math.min(1.0, 1.0 - absOffset * 0.12));
            const opacity = Math.max(0.28, Math.min(1.0, 1.0 - absOffset * 0.20));
            const zIndex = Math.round((10 - absOffset) * 10);
            const isCenter = absOffset < 0.45;

            return (
              <div
                key={item.id || index}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick(index, offset);
                }}
                className={`absolute rounded-2xl overflow-hidden transition-all duration-300 group cursor-pointer ${
                  isCenter 
                    ? 'ring-2 ring-[#FFD84A]/80 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,216,74,0.25)]' 
                    : 'border border-white/10 shadow-xl hover:border-white/30'
                }`}
                style={{
                  width: `${cardWidth}px`,
                  height: `${cardHeight}px`,
                  transform: `translate3d(${posX}px, ${posY}px, ${posZ}px) rotateY(${rotY}deg) scale(${scale})`,
                  opacity: opacity,
                  zIndex: zIndex,
                  backfaceVisibility: 'hidden',
                  willChange: 'transform, opacity',
                  backgroundColor: '#071A33'
                }}
              >
                {/* Real High-Res Campus Image */}
                <img
                  src={item.src}
                  alt={item.title || item.alt || `Campus Media ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  draggable={false}
                  loading="lazy"
                  decoding="async"
                />

                {/* Subtle Gradient Shadow Base */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/90 via-[#071A33]/20 to-transparent pointer-events-none" />

                {/* ACTIVE IMAGE DEDICATED INFORMATION PANEL */}
                {isCenter && (
                  <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5 flex items-end justify-between z-20 pointer-events-none animate-fadeIn">
                    <div className="space-y-1 max-w-[82%]">
                      <div className="flex items-center space-x-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FFD84A] animate-pulse" />
                        <span className="font-mono text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#FFD84A]">
                          {item.categoryLabel || item.category || 'CAMPUS EVENT'}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm sm:text-base lg:text-lg text-white leading-snug truncate">
                        {item.title || item.alt || `Campus Photograph ${index + 1}`}
                      </h4>
                    </div>

                    {/* Lightbox Trigger Icon */}
                    <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md text-white border border-white/10 shadow-sm shrink-0">
                      <Maximize2 className="w-4 h-4 text-[#FFD84A]" />
                    </div>
                  </div>
                )}

                {/* Inactive Card Category Watermark */}
                {!isCenter && (
                  <div className="absolute bottom-2.5 left-3 right-3 text-center">
                    <span className="font-mono text-[9px] font-bold text-slate-300/80 uppercase truncate block">
                      {item.category || 'GALLERY'}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* CONTROLS & PAGINATION BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between max-w-4xl mx-auto px-4 gap-4 text-xs font-sans">
        
        {/* Counter Display (e.g. 01 / 12) */}
        <div className="flex items-center space-x-2 font-mono font-bold text-slate-300">
          <span className="text-[#FFD84A] text-sm">
            {String(activeIndex + 1).padStart(2, '0')}
          </span>
          <span className="text-slate-600">/</span>
          <span>{String(count).padStart(2, '0')}</span>
        </div>

        {/* Elongated Pill Pagination Indicators */}
        <div className="flex items-center space-x-1.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                lastUserInteraction.current = Date.now();
                setActiveIndex(idx);
              }}
              aria-label={`View photo ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                activeIndex === idx 
                  ? 'w-7 bg-[#FFD84A] shadow-[0_0_10px_rgba(255,216,74,0.5)]' 
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
            />
          ))}
        </div>

        {/* Previous & Next Navigation Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrev}
            className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg border border-slate-700/80 transition-all duration-200 flex items-center space-x-1 font-bold text-xs shadow-xs"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">PREVIOUS</span>
          </button>
          <button
            onClick={handleNext}
            className="px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-white rounded-lg border border-slate-700/80 transition-all duration-200 flex items-center space-x-1 font-bold text-xs shadow-xs"
            aria-label="Next photograph"
          >
            <span className="hidden sm:inline">NEXT</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* DRAG HINT */}
      <div className="flex items-center justify-center space-x-2 text-slate-400 text-[11px] font-medium tracking-wide">
        <MoveHorizontal className="w-3.5 h-3.5 text-[#FFD84A] animate-pulse" />
        <span>Drag or click photographs to rearrange the 3D gallery</span>
      </div>

      {/* HIGH-RES LIGHTBOX MODAL */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-[#071A33]/95 backdrop-blur-md flex items-center justify-center p-4 sm:p-8 animate-fadeIn"
          onClick={() => setSelectedImage(null)}
        >
          <div
            className="relative max-w-5xl w-full bg-slate-900 border border-slate-700/80 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#071A33]">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#FFD84A]" />
                <span className="font-bold text-sm text-white truncate">
                  {selectedImage.title || selectedImage.alt || 'St. Philomena’s Campus Photograph'}
                </span>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Res Image View */}
            <div className="relative flex-1 bg-black flex items-center justify-center overflow-hidden min-h-[320px] max-h-[72vh]">
              <img
                src={selectedImage.src}
                alt={selectedImage.title || selectedImage.alt || 'Campus Media'}
                className="max-w-full max-h-full object-contain p-2"
              />
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-3.5 bg-[#071A33] text-slate-300 text-xs flex justify-between items-center border-t border-slate-800">
              <span>St. Philomena's College (Autonomous), Mysuru</span>
              {selectedImage.category && (
                <span className="uppercase text-[10px] tracking-wider text-[#FFD84A] font-bold bg-slate-800 px-2.5 py-1 rounded border border-[#FFD84A]/30">
                  {selectedImage.categoryLabel || selectedImage.category}
                </span>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
