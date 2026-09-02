import React, { useState, useEffect, useRef, useCallback } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  Download, 
  ExternalLink, 
  Grid, 
  BookOpen, 
  Volume2, 
  VolumeX, 
  Loader2, 
  Sparkles, 
  RotateCcw,
  BookMarked
} from 'lucide-react';

// Setup PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version || '3.11.174'}/pdf.worker.min.js`;

// Synthesize authentic realistic paper turn sound using Web Audio API
const playFlipSound = (soundEnabled) => {
  if (!soundEnabled) return;
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const bufferSize = ctx.sampleRate * 0.14;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
    }
    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1150;
    filter.Q.value = 1.4;
    const gainNode = ctx.createGain();
    gainNode.gain.setValueAtTime(0.28, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.005, ctx.currentTime + 0.14);
    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);
    whiteNoise.start();
  } catch (e) {
    // Audio context may be restricted before interaction
  }
};

export default function DearFlipViewer({ 
  pdfUrl, 
  images = [],
  title = "Institutional Prospectus 2026-27", 
  height = "880px" 
}) {
  const [pagesMap, setPagesMap] = useState({});
  const [totalPages, setTotalPages] = useState(0);
  const [currentSpread, setCurrentSpread] = useState(0);
  const [loading, setLoading] = useState(true);
  const [autoPlay, setAutoPlay] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showThumbs, setShowThumbs] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  const [isDragging, setIsDragging] = useState(false);
  const [dragProgress, setDragProgress] = useState(0);
  const [dragSide, setDragSide] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState(null);
  const [pageInputVal, setPageInputVal] = useState('1');

  const pdfDocRef = useRef(null);
  const containerRef = useRef(null);
  const bookStageRef = useRef(null);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const renderedPagesRef = useRef(new Set());

  // Render single page on-demand
  const renderSinglePage = useCallback(async (doc, pageNum) => {
    if (!doc || renderedPagesRef.current.has(pageNum) || pageNum > doc.numPages || pageNum < 1) return;
    
    renderedPagesRef.current.add(pageNum);
    try {
      const page = await doc.getPage(pageNum);
      const scale = 1.35;
      const viewport = page.getViewport({ scale });
      
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d', { alpha: false });
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      await page.render({ canvasContext: context, viewport }).promise;
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);

      setPagesMap(prev => ({
        ...prev,
        [pageNum]: dataUrl
      }));
    } catch (err) {
      console.warn(`Error rendering page ${pageNum}:`, err);
      renderedPagesRef.current.delete(pageNum);
    }
  }, []);

  // Fast initial load: Load metadata and immediately render first 4 pages
  useEffect(() => {
    let isCancelled = false;

    async function initPdf() {
      if (images && images.length > 0) {
        const map = {};
        images.forEach((img, i) => { map[i + 1] = img; });
        setPagesMap(map);
        setTotalPages(images.length);
        setLoading(false);
        return;
      }

      if (!pdfUrl) return;

      try {
        setLoading(true);
        const loadingTask = pdfjsLib.getDocument({
          url: pdfUrl,
          cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
          cMapPacked: true,
        });

        const doc = await loadingTask.promise;
        if (isCancelled) return;

        pdfDocRef.current = doc;
        const numPages = doc.numPages;
        setTotalPages(numPages);

        // Pre-render first 4 pages so Cover appears instantly
        await Promise.all([
          renderSinglePage(doc, 1),
          renderSinglePage(doc, 2),
          renderSinglePage(doc, 3),
          renderSinglePage(doc, 4)
        ]);

        if (!isCancelled) {
          setLoading(false);
        }

        // Pre-render remaining in background
        setTimeout(() => {
          if (!isCancelled && doc) {
            for (let i = 5; i <= Math.min(numPages, 16); i++) {
              renderSinglePage(doc, i);
            }
          }
        }, 800);

      } catch (err) {
        console.error("PDF.js init error:", err);
        setLoading(false);
      }
    }

    initPdf();

    return () => {
      isCancelled = true;
    };
  }, [pdfUrl, images, renderSinglePage]);

  // Pre-load adjacent pages on spread change
  useEffect(() => {
    if (!pdfDocRef.current) return;
    const doc = pdfDocRef.current;

    const leftNum = currentSpread === 0 ? 1 : (currentSpread - 1) * 2 + 2;
    const rightNum = leftNum + 1;

    renderSinglePage(doc, leftNum);
    renderSinglePage(doc, rightNum);
    renderSinglePage(doc, leftNum - 2);
    renderSinglePage(doc, leftNum - 1);
    renderSinglePage(doc, rightNum + 1);
    renderSinglePage(doc, rightNum + 2);
  }, [currentSpread, renderSinglePage]);

  const totalSpreads = Math.ceil((totalPages + 1) / 2);

  useEffect(() => {
    if (currentSpread === 0) {
      setPageInputVal('1');
    } else {
      const leftNum = (currentSpread - 1) * 2 + 2;
      setPageInputVal(`${leftNum}`);
    }
  }, [currentSpread]);

  const getSpreadPages = (spreadIdx) => {
    if (spreadIdx === 0) {
      return { 
        left: null, 
        right: { pageNumber: 1, imageUrl: pagesMap[1] || null } 
      };
    }
    const leftPageNum = (spreadIdx - 1) * 2 + 2;
    const rightPageNum = leftPageNum + 1;

    return {
      left: { pageNumber: leftPageNum, imageUrl: pagesMap[leftPageNum] || null },
      right: rightPageNum <= totalPages ? { pageNumber: rightPageNum, imageUrl: pagesMap[rightPageNum] || null } : null
    };
  };

  const flipNext = useCallback(() => {
    if (currentSpread < totalSpreads - 1 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('next');
      playFlipSound(soundEnabled);
      setTimeout(() => {
        setCurrentSpread(prev => prev + 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 500);
    }
  }, [currentSpread, totalSpreads, isFlipping, soundEnabled]);

  const flipPrev = useCallback(() => {
    if (currentSpread > 0 && !isFlipping) {
      setIsFlipping(true);
      setFlipDirection('prev');
      playFlipSound(soundEnabled);
      setTimeout(() => {
        setCurrentSpread(prev => prev - 1);
        setIsFlipping(false);
        setFlipDirection(null);
      }, 500);
    }
  }, [currentSpread, isFlipping, soundEnabled]);

  useEffect(() => {
    let interval;
    if (autoPlay && !isFlipping && !isDragging) {
      interval = setInterval(() => {
        if (currentSpread < totalSpreads - 1) {
          flipNext();
        } else {
          setCurrentSpread(0);
        }
      }, 4200);
    }
    return () => clearInterval(interval);
  }, [autoPlay, isFlipping, isDragging, currentSpread, totalSpreads, flipNext]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === ' ') {
        flipNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        flipPrev();
      } else if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [flipNext, flipPrev]);

  const handlePointerDown = (e, side) => {
    if (isFlipping) return;
    setIsDragging(true);
    setDragSide(side);
    dragStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const stageWidth = bookStageRef.current ? bookStageRef.current.clientWidth / 2 : 450;
    
    if (dragSide === 'right') {
      const progress = Math.min(1, Math.max(0, -dx / stageWidth));
      setDragProgress(progress);
    } else if (dragSide === 'left') {
      const progress = Math.min(1, Math.max(0, dx / stageWidth));
      setDragProgress(progress);
    }
  };

  const handlePointerUp = () => {
    if (!isDragging) return;
    setIsDragging(false);

    if (dragProgress > 0.28) {
      if (dragSide === 'right') flipNext();
      if (dragSide === 'left') flipPrev();
    }
    setDragProgress(0);
    setDragSide(null);
  };

  const jumpToPage = (pageNum) => {
    const p = Math.max(1, Math.min(totalPages, parseInt(pageNum) || 1));
    const targetSpread = p === 1 ? 0 : Math.floor((p - 2) / 2) + 1;
    if (targetSpread >= 0 && targetSpread < totalSpreads) {
      playFlipSound(soundEnabled);
      setCurrentSpread(targetSpread);
      setShowThumbs(false);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
      setIsFullscreen(false);
    }
  };

  const activeSpread = getSpreadPages(currentSpread);

  return (
    <div 
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      className={`bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 relative select-none ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none h-screen w-screen' : 'w-full'
      }`}
      style={{ minHeight: isFullscreen ? '100vh' : height }}
    >
      {/* 1. Header Toolbar */}
      <div className="bg-[#071A33]/90 backdrop-blur-md px-4 sm:px-6 py-3 border-b border-slate-800 flex items-center justify-between gap-3 text-white z-20">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="p-2 bg-amber-400/20 text-[#FFD84A] rounded-xl border border-amber-400/30 shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div className="truncate">
            <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate">{title}</h3>
            <div className="flex items-center space-x-2 text-[11px] text-slate-300 font-mono">
              <span className="text-[#FFD84A] font-bold">3D DearFlip Engine</span>
              <span>•</span>
              <span className="text-slate-400">
                {currentSpread === 0 
                  ? 'Cover Page (1)' 
                  : `Pages ${(currentSpread - 1) * 2 + 2}–${Math.min(totalPages, (currentSpread - 1) * 2 + 3)} of ${totalPages || '...'}`
                }
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
              soundEnabled ? 'bg-blue-900/60 text-[#FFD84A] border border-blue-600/40' : 'bg-slate-800 text-slate-400'
            }`}
            title={soundEnabled ? "Mute Flip Sound" : "Enable Realistic Flip Sound"}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setShowThumbs(!showThumbs)}
            className={`p-2 rounded-xl text-xs transition-colors cursor-pointer ${
              showThumbs ? 'bg-amber-400 text-slate-900 font-bold' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title="Thumbnails Grid Filmstrip"
          >
            <Grid className="w-4 h-4" />
          </button>

          <a
            href={pdfUrl}
            download="St-Philomenas-College-Prospectus-2026-27.pdf"
            className="px-3.5 py-1.5 bg-[#FFD84A] hover:bg-[#ffcd1f] text-slate-900 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>

          <button
            onClick={toggleFullscreen}
            className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
            title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen (F)"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* 2. Main 3D Book Stage */}
      <div 
        ref={bookStageRef}
        className="relative flex-1 bg-gradient-to-b from-slate-900 via-slate-950 to-[#040914] flex items-center justify-center p-3 sm:p-8 overflow-hidden"
        style={{ perspective: '2400px' }}
      >
        {/* Loading Spinner */}
        {loading && (
          <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-center z-40 space-y-4 text-white">
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-4 border-slate-700 border-t-[#FFD84A] animate-spin" />
              <BookOpen className="w-6 h-6 text-[#FFD84A] absolute inset-0 m-auto" />
            </div>
            <div className="text-center space-y-1">
              <h4 className="font-serif font-bold text-base text-white">Loading 3D Prospectus...</h4>
              <p className="text-xs text-slate-400 font-mono">Initializing pages...</p>
            </div>
          </div>
        )}

        {/* 3D Double-Sided Book Rig */}
        <div 
          className="relative flex items-center justify-center transition-transform duration-300 shadow-2xl rounded-2xl"
          style={{ 
            transform: `scale(${zoomLevel})`,
            maxWidth: '1080px',
            width: '100%',
            aspectRatio: currentSpread === 0 ? '1 / 1.414' : '2 / 1.414',
            transformStyle: 'preserve-3d'
          }}
        >
          {/* SPREAD 0: Cover */}
          {currentSpread === 0 ? (
            <div 
              onClick={flipNext}
              onPointerDown={(e) => handlePointerDown(e, 'right')}
              className="w-full max-w-[500px] aspect-[1/1.414] bg-white rounded-r-2xl shadow-2xl border border-slate-300 relative overflow-hidden cursor-pointer group transition-all duration-300 hover:shadow-amber-500/20"
            >
              {activeSpread.right && activeSpread.right.imageUrl ? (
                <img 
                  src={activeSpread.right.imageUrl} 
                  alt="Prospectus Cover" 
                  className="w-full h-full object-contain pointer-events-none"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center bg-[#0B1F4E] text-white p-8 space-y-3 text-center">
                  <BookOpen className="w-12 h-12 text-[#FFD84A]" />
                  <h3 className="font-serif font-bold text-xl text-white">{title}</h3>
                  <span className="text-xs text-blue-200 font-mono">St. Philomena's College (Autonomous)</span>
                </div>
              )}

              {/* Spine Shading */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-black/40 via-black/15 to-transparent pointer-events-none" />

              {/* Specular Sheen Overlay */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 pointer-events-none opacity-60" />

              {/* Corner Peel Trigger */}
              <div className="absolute top-0 right-0 w-14 h-14 bg-gradient-to-bl from-amber-400/80 via-amber-300/40 to-transparent pointer-events-none group-hover:w-20 group-hover:h-20 transition-all rounded-bl-3xl shadow-sm" />
              
              <div className="absolute bottom-4 right-5 bg-slate-950/85 backdrop-blur-xs text-[#FFD84A] text-[11px] font-mono font-bold px-3 py-1.5 rounded-full shadow-lg border border-[#FFD84A]/30">
                Click or Drag to Turn ➔
              </div>
            </div>
          ) : (
            /* DUAL-PAGE SPREAD */
            <div 
              className="w-full h-full flex items-center justify-center shadow-2xl rounded-2xl overflow-hidden bg-slate-900 border border-slate-700/80 relative"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* LEFT PAGE CONTAINER */}
              <div 
                onClick={flipPrev}
                onPointerDown={(e) => handlePointerDown(e, 'left')}
                className="w-1/2 h-full bg-white relative overflow-hidden border-r border-slate-200 flex items-center justify-center cursor-pointer group select-none"
              >
                {activeSpread.left && activeSpread.left.imageUrl ? (
                  <img 
                    src={activeSpread.left.imageUrl} 
                    alt={`Page ${activeSpread.left.pageNumber}`} 
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 space-y-2">
                    <Loader2 className="w-6 h-6 animate-spin text-[#1C5496]" />
                    <span className="text-[11px] font-mono">Loading Page {activeSpread.left?.pageNumber}...</span>
                  </div>
                )}

                {/* Left Spine Crease Shadow */}
                <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-black/40 via-black/10 to-transparent pointer-events-none" />
                
                {/* Left Page Number Badge */}
                <div className="absolute bottom-2 left-4 text-[10px] font-mono text-slate-400 bg-white/90 px-2 py-0.5 rounded shadow-2xs">
                  {activeSpread.left ? activeSpread.left.pageNumber : ''}
                </div>
              </div>

              {/* CENTER SPINE 3D GROOVE */}
              <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-4 bg-gradient-to-r from-black/35 via-slate-800 to-black/35 z-20 pointer-events-none shadow-md" />

              {/* RIGHT PAGE CONTAINER */}
              <div 
                onClick={flipNext}
                onPointerDown={(e) => handlePointerDown(e, 'right')}
                className="w-1/2 h-full bg-white relative overflow-hidden flex items-center justify-center cursor-pointer group select-none"
              >
                {activeSpread.right && activeSpread.right.imageUrl ? (
                  <img 
                    src={activeSpread.right.imageUrl} 
                    alt={`Page ${activeSpread.right.pageNumber}`} 
                    className="w-full h-full object-contain pointer-events-none"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-slate-50 text-slate-400 space-y-2">
                    {activeSpread.right ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin text-[#1C5496]" />
                        <span className="text-[11px] font-mono">Loading Page {activeSpread.right.pageNumber}...</span>
                      </>
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <span className="text-xs font-mono text-slate-400">End of Prospectus</span>
                        <h4 className="font-serif font-bold text-base text-slate-800">St. Philomena's College</h4>
                        <a 
                          href="https://student.stphiloserp.in/" 
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="btn-gold px-3 py-1.5 rounded-lg text-xs font-bold inline-block mt-2"
                        >
                          Apply 2026-27 ↗
                        </a>
                      </div>
                    )}
                  </div>
                )}

                {/* Right Spine Crease Shadow */}
                <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-black/40 via-black/10 to-transparent pointer-events-none" />
                
                {/* Right Page Number Badge */}
                <div className="absolute bottom-2 right-4 text-[10px] font-mono text-slate-400 bg-white/90 px-2 py-0.5 rounded shadow-2xs">
                  {activeSpread.right ? activeSpread.right.pageNumber : ''}
                </div>
              </div>

              {/* DYNAMIC 3D PAGE CURL TURNING FLAP */}
              {(isFlipping || (isDragging && dragProgress > 0)) && (
                <div 
                  className={`absolute inset-y-0 w-1/2 z-30 pointer-events-none transition-transform duration-500 ease-out ${
                    (flipDirection === 'next' || dragSide === 'right')
                      ? 'right-0 origin-left shadow-2xl'
                      : 'left-0 origin-right shadow-2xl'
                  }`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: isDragging 
                      ? (dragSide === 'right' 
                          ? `rotateY(${-dragProgress * 180}deg) translateZ(${dragProgress * 20}px)` 
                          : `rotateY(${dragProgress * 180}deg) translateZ(${dragProgress * 20}px)`)
                      : undefined
                  }}
                >
                  <div className={`w-full h-full relative ${
                    isFlipping 
                      ? (flipDirection === 'next' ? 'animate-flip-next' : 'animate-flip-prev') 
                      : ''
                  }`}>
                    <div className="w-full h-full bg-white relative overflow-hidden shadow-2xl">
                      <div className="absolute inset-0 bg-gradient-to-r from-black/25 via-transparent to-black/15 pointer-events-none" />
                      <div className="absolute inset-y-0 left-1/4 w-12 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
                    </div>
                  </div>
                </div>
              )}

            </div>
          )}
        </div>

        {/* Side Chevrons */}
        <button
          onClick={flipPrev}
          disabled={currentSpread === 0 || isFlipping}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3.5 sm:p-4 bg-slate-900/80 hover:bg-[#1C5496] disabled:opacity-20 text-white rounded-full backdrop-blur-md border border-slate-700 shadow-2xl transition-all hover:scale-110 z-30 cursor-pointer"
          title="Previous Page (◄)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={flipNext}
          disabled={currentSpread >= totalSpreads - 1 || isFlipping}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3.5 sm:p-4 bg-slate-900/80 hover:bg-[#1C5496] disabled:opacity-20 text-white rounded-full backdrop-blur-md border border-slate-700 shadow-2xl transition-all hover:scale-110 z-30 cursor-pointer"
          title="Next Page (►)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Filmstrip Thumbnails Drawer */}
        {showThumbs && (
          <div className="absolute inset-x-0 bottom-20 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-4 z-40 shadow-2xl max-h-52 overflow-x-auto custom-scrollbar">
            <div className="flex items-center space-x-3 pb-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => {
                const isCurrent = (currentSpread === 0 && pageNum === 1) || 
                  (currentSpread > 0 && (pageNum === (currentSpread - 1) * 2 + 2 || pageNum === (currentSpread - 1) * 2 + 3));
                const img = pagesMap[pageNum];
                return (
                  <div
                    key={pageNum}
                    onClick={() => jumpToPage(pageNum)}
                    className={`w-24 h-32 shrink-0 rounded-lg overflow-hidden border-2 cursor-pointer transition-all hover:scale-105 flex flex-col justify-between bg-slate-900 ${
                      isCurrent ? 'border-[#FFD84A] shadow-xl scale-105 ring-2 ring-amber-400/40' : 'border-slate-700 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {img ? (
                      <img src={img} alt={`Thumbnail ${pageNum}`} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-500 text-[10px] font-mono">
                        Page {pageNum}
                      </div>
                    )}
                    <div className="text-[9px] font-mono text-center bg-slate-900 text-white py-0.5">
                      Page {pageNum}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* 3. Floating Translucent HUD Bottom Dock */}
      <div className="bg-[#071A33]/90 backdrop-blur-md px-4 sm:px-6 py-3 border-t border-slate-800 flex items-center justify-between flex-wrap gap-3 text-white z-20">
        
        {/* Navigation & Slideshow Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setAutoPlay(!autoPlay)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
              autoPlay ? 'bg-amber-400 text-slate-900 shadow-md' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
            }`}
            title={autoPlay ? "Pause Slideshow" : "Auto-Play Slideshow"}
          >
            {autoPlay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{autoPlay ? "Pause" : "Auto-Play"}</span>
          </button>

          <button
            onClick={flipPrev}
            disabled={currentSpread === 0 || isFlipping}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 rounded-lg text-xs cursor-pointer"
            title="Previous Page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Direct Page Jump Input */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              jumpToPage(pageInputVal);
            }}
            className="flex items-center space-x-1"
          >
            <input
              type="text"
              value={pageInputVal}
              onChange={(e) => setPageInputVal(e.target.value)}
              className="w-10 bg-slate-900 border border-slate-700 text-center text-xs font-mono text-white rounded-md py-1 focus:border-amber-400 focus:outline-hidden"
              title="Jump to Page"
            />
            <span className="text-xs font-mono text-slate-400">/ {totalPages || '...'}</span>
          </form>

          <button
            onClick={flipNext}
            disabled={currentSpread >= totalSpreads - 1 || isFlipping}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 rounded-lg text-xs cursor-pointer"
            title="Next Page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Zoom & Fit Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setZoomLevel(Math.max(0.75, zoomLevel - 0.1))}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <span className="text-xs font-mono text-slate-300 w-12 text-center">
            {Math.round(zoomLevel * 100)}%
          </span>

          <button
            onClick={() => setZoomLevel(Math.min(1.4, zoomLevel + 0.1))}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-lg text-xs cursor-pointer"
            title="Reset to Fit Screen"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Bottom Helper Bar */}
        <div className="flex items-center space-x-3 text-xs font-mono text-slate-400">
          <span className="hidden md:inline">Drag corners or use ◄ ► arrows</span>
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#FFD84A] hover:underline flex items-center space-x-1"
          >
            <span>Raw PDF</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
}
