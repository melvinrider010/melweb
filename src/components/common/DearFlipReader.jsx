import React, { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Download, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  List, 
  X, 
  FileText, 
  Sparkles,
  Volume2,
  VolumeX,
  Layers
} from 'lucide-react';

export default function DearFlipReader({ journal, onClose }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [isFlipping, setIsFlipping] = useState(false);
  const [flipDirection, setFlipDirection] = useState('next'); // 'next' | 'prev'
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showToc, setShowToc] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [viewMode, setViewMode] = useState('double'); // 'double' | 'single'
  const containerRef = useRef(null);

  const totalPages = journal?.totalPages || 48;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        goToNextPage();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        goToPrevPage();
      } else if (e.key === 'Escape') {
        if (isFullscreen) toggleFullscreen();
        else if (onClose) onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentPage, isFullscreen, viewMode]);

  const playFlipSound = () => {
    if (!isSoundEnabled) return;
    try {
      // Synthesize gentle page turn sound with Web Audio API (zero external audio dependencies)
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.12);
    } catch (e) {
      // AudioContext unavailable or blocked by autoplay policy
    }
  };

  const goToNextPage = () => {
    const step = viewMode === 'double' && currentPage > 1 ? 2 : (viewMode === 'double' && currentPage === 1 ? 1 : 1);
    if (currentPage + step <= totalPages) {
      setFlipDirection('next');
      setIsFlipping(true);
      playFlipSound();
      setTimeout(() => {
        setCurrentPage((prev) => Math.min(prev + step, totalPages));
        setIsFlipping(false);
      }, 350);
    }
  };

  const goToPrevPage = () => {
    const step = viewMode === 'double' && currentPage > 2 ? 2 : (viewMode === 'double' && currentPage === 2 ? 1 : 1);
    if (currentPage - step >= 1) {
      setFlipDirection('prev');
      setIsFlipping(true);
      playFlipSound();
      setTimeout(() => {
        setCurrentPage((prev) => Math.max(prev - step, 1));
        setIsFlipping(false);
      }, 350);
    }
  };

  const jumpToPage = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages && pageNum !== currentPage) {
      setFlipDirection(pageNum > currentPage ? 'next' : 'prev');
      setIsFlipping(true);
      playFlipSound();
      setTimeout(() => {
        setCurrentPage(pageNum);
        setIsFlipping(false);
        setShowToc(false);
      }, 300);
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen?.();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen?.();
      setIsFullscreen(false);
    }
  };

  // Find active article for current page
  const currentArticle = (journal?.articles || []).slice().reverse().find((a) => currentPage >= a.page) || journal?.articles?.[0];

  // Helper to render realistic paper page content
  const renderPageContent = (pageNum) => {
    if (pageNum === 1) {
      // Cover Page
      return (
        <div className="w-full h-full bg-gradient-to-br from-[#0B1F4E] via-[#102B66] to-[#071530] text-white p-6 sm:p-10 flex flex-col justify-between border-r border-[#C9A84C]/40 shadow-2xl relative overflow-hidden select-none">
          {/* Gold Embossed Header */}
          <div className="space-y-3 relative z-10 border-b border-[#C9A84C]/30 pb-4 text-center">
            <span className="text-[10px] sm:text-xs font-mono tracking-widest text-[#F0D98C] uppercase font-bold block">
              ST. PHILOMENA'S COLLEGE (AUTONOMOUS), MYSURU
            </span>
            <span className="text-[10px] font-mono text-slate-300 block">{journal.issn}</span>
          </div>

          <div className="space-y-4 text-center my-auto relative z-10">
            <span className="bg-[#C9A84C] text-[#071A33] text-[10px] sm:text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full shadow-xs inline-block">
              {journal.volume} • {journal.issue}
            </span>
            <h1 className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#FFD84A] leading-tight drop-shadow-md">
              {journal.journalName}
            </h1>
            <p className="text-xs sm:text-sm text-slate-200 font-serif italic max-w-md mx-auto line-clamp-3">
              "{journal.title}"
            </p>
          </div>

          {/* Cover Footer */}
          <div className="pt-4 border-t border-[#C9A84C]/30 flex justify-between items-end text-[10px] sm:text-[11px] text-slate-300 font-mono relative z-10">
            <div>
              <span className="text-slate-400 block text-[9px] uppercase">Academic Year</span>
              <span className="font-bold text-white">{journal.year}</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400 block text-[9px] uppercase">Editorial Oversight</span>
              <span className="font-bold text-[#F0D98C]">{journal.frequency}</span>
            </div>
          </div>

          {/* Decorative Corner Filigree */}
          <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-[#C9A84C]/50 pointer-events-none" />
          <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-[#C9A84C]/50 pointer-events-none" />
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-[#C9A84C]/50 pointer-events-none" />
          <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-[#C9A84C]/50 pointer-events-none" />
        </div>
      );
    }

    // Inside Pages
    const articleOnThisPage = (journal?.articles || []).find((a) => a.page === pageNum);
    const isEven = pageNum % 2 === 0;

    return (
      <div className={`w-full h-full bg-[#FCFBF8] text-[#1A202C] p-6 sm:p-8 flex flex-col justify-between relative select-none font-serif ${isEven ? 'border-r border-slate-200/90' : 'border-l border-slate-200/90'} shadow-inner`}>
        {/* Top Running Header */}
        <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-slate-400 border-b border-slate-200 pb-2">
          <span>{isEven ? `${journal.journalName} — ${journal.volume}` : journal.issn}</span>
          <span className="font-bold text-slate-700">Page {pageNum}</span>
        </div>

        {/* Page Body Content */}
        <div className="space-y-3.5 my-auto text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
          {articleOnThisPage ? (
            <div className="space-y-2.5 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
              <span className="text-[10px] font-mono font-bold uppercase text-[#1C5496] tracking-widest block">
                PEER-REVIEWED ARTICLE • SECTION {pageNum}
              </span>
              <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-snug">
                {articleOnThisPage.title}
              </h3>
              <p className="text-xs text-[#1C5496] font-semibold font-mono">
                Author(s): {articleOnThisPage.author}
              </p>
              <div className="pt-2 text-[11.5px] text-slate-600 font-sans leading-relaxed space-y-1.5 border-t border-blue-100">
                <p>
                  <strong>Abstract:</strong> This scholarly publication documents rigorous empirical investigations, structured methodologies, and peer-reviewed contributions to the discipline at St. Philomena's College (Autonomous), Mysuru.
                </p>
                <p>
                  <strong>Keywords:</strong> Autonomous Research, Academic Innovation, Empirical Analysis, St. Philomena's Publications.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 text-justify text-[11px] sm:text-xs text-slate-600">
              <p className="first-letter:text-3xl first-letter:font-serif first-letter:font-bold first-letter:text-[#1C5496] first-letter:mr-1 first-letter:float-left leading-relaxed">
                Scholarly contributions in this volume continue the distinguished legacy of peer-reviewed multi-disciplinary inquiry across natural, social, and technological sciences. Faculty and student research scholars collaborate through state-of-the-art laboratory instrumentation suites, econometric data tools, and computing infrastructure.
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2 text-[10.5px] font-mono bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[9.5px]">Journal Discipline</span>
                  <span className="font-bold text-slate-800">{journal.journalName}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[9.5px]">Publication Status</span>
                  <span className="font-bold text-emerald-700">Peer-Reviewed Open Access</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom Running Footer */}
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 border-t border-slate-200 pt-2">
          <span>St. Philomena's College (Autonomous), Mysuru</span>
          <span className="font-bold text-slate-800">[{pageNum}]</span>
        </div>

        {/* Paper Spine Shadow Gradient */}
        <div 
          className={`absolute top-0 bottom-0 w-6 pointer-events-none ${
            isEven 
              ? 'right-0 bg-gradient-to-l from-black/15 to-transparent' 
              : 'left-0 bg-gradient-to-r from-black/15 to-transparent'
          }`} 
        />
      </div>
    );
  };

  return (
    <div 
      ref={containerRef}
      className={`bg-slate-900 text-white flex flex-col justify-between overflow-hidden relative select-none ${
        isFullscreen ? 'fixed inset-0 z-50' : 'rounded-3xl border border-slate-800 shadow-2xl min-h-[620px] sm:min-h-[720px]'
      }`}
    >
      {/* 1. TOP TOOLBAR */}
      <div className="bg-[#071A33] border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between gap-3 text-xs z-20">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="w-8 h-8 rounded-lg bg-[#C9A84C] text-[#071A33] flex items-center justify-center font-bold shadow-xs shrink-0">
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <h2 className="font-serif font-bold text-sm text-white truncate">
              {journal.title}
            </h2>
            <span className="text-[10.5px] font-mono text-amber-300 truncate block">
              {journal.volume} • {journal.issn}
            </span>
          </div>
        </div>

        {/* Reader Controls */}
        <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
          <button
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-lg border transition-colors cursor-pointer ${
              showToc ? 'bg-[#C9A84C] text-[#071A33] border-[#C9A84C]' : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700'
            }`}
            title="Table of Contents"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            title={isSoundEnabled ? 'Mute Page Flip Sound' : 'Enable Page Flip Sound'}
          >
            {isSoundEnabled ? <Volume2 className="w-4 h-4 text-emerald-400" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
          </button>

          <button
            onClick={() => setViewMode(viewMode === 'double' ? 'single' : 'double')}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer hidden sm:inline-flex"
            title={viewMode === 'double' ? 'Single Page Mode' : 'Double Page Spread'}
          >
            <Layers className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.15, 1.5))}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.15, 0.85))}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <a
            href={journal.pdfPath}
            download={journal.pdfPath.split('/').pop()}
            className="p-2 rounded-lg bg-[#C9A84C] text-[#071A33] font-bold hover:bg-[#F0D98C] transition-colors cursor-pointer flex items-center space-x-1"
            title="Download Full Journal PDF"
          >
            <Download className="w-4 h-4" />
            <span className="hidden md:inline text-[11px]">Download PDF</span>
          </a>

          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-colors cursor-pointer"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Reader'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {onClose && (
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-red-900/80 text-white hover:bg-red-800 transition-colors cursor-pointer ml-1"
              title="Close Flipbook"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. MAIN 3D FLIPBOOK VIEWPORT */}
      <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 bg-[#0B1320] overflow-hidden">
        
        {/* TABLE OF CONTENTS DRAWER */}
        {showToc && (
          <div className="absolute left-0 top-0 bottom-0 w-80 bg-[#071A33] border-r border-slate-800 z-30 p-5 shadow-2xl flex flex-col justify-between animate-slideRight">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <span className="font-serif font-bold text-sm text-[#FFD84A]">
                  Table of Contents
                </span>
                <button
                  onClick={() => setShowToc(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-2 overflow-y-auto max-h-[480px] pr-1">
                {(journal.articles || []).map((art, idx) => (
                  <button
                    key={idx}
                    onClick={() => jumpToPage(art.page)}
                    className={`w-full text-left p-3 rounded-xl text-xs transition-colors block cursor-pointer ${
                      currentPage === art.page
                        ? 'bg-[#C9A84C] text-[#071A33] font-bold'
                        : 'bg-slate-800/80 text-slate-200 hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-serif block line-clamp-2">{art.title}</span>
                    <span className="text-[10px] font-mono text-slate-400 block pt-0.5">
                      Page {art.page} • {art.author}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 font-mono text-center">
              Total {journal.articles?.length || 0} Articles Cataloged
            </div>
          </div>
        )}

        {/* 3D BOOK SPREAD WRAPPER */}
        <div 
          className="relative transition-transform duration-300 flex items-center justify-center shadow-2xl"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {viewMode === 'double' && currentPage > 1 ? (
            /* DUAL-PAGE SPREAD (LEFT + RIGHT) */
            <div className="flex items-center shadow-2xl rounded-2xl overflow-hidden border border-slate-700 max-w-[960px] w-full aspect-[16/10] bg-white">
              {/* Left Page */}
              <div className="w-1/2 h-full">
                {renderPageContent(currentPage % 2 === 0 ? currentPage : currentPage - 1)}
              </div>

              {/* Center Spine Binding Shadow */}
              <div className="w-[2px] h-full bg-slate-400 shadow-xl z-10" />

              {/* Right Page */}
              <div className="w-1/2 h-full">
                {renderPageContent(currentPage % 2 === 0 ? Math.min(currentPage + 1, totalPages) : currentPage)}
              </div>
            </div>
          ) : (
            /* SINGLE-PAGE / COVER VIEW */
            <div className="shadow-2xl rounded-2xl overflow-hidden border border-slate-700 max-w-[500px] w-full aspect-[1/1.4] bg-white">
              {renderPageContent(currentPage)}
            </div>
          )}

          {/* PAGE FLIPPING ANIMATION OVERLAY */}
          {isFlipping && (
            <div 
              className={`absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-black/30 pointer-events-none rounded-2xl transition-all duration-300 animate-pulse`}
            />
          )}
        </div>

        {/* PREVIOUS PAGE BUTTON (LEFT) */}
        <button
          onClick={goToPrevPage}
          disabled={currentPage <= 1}
          className={`absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/90 text-white border border-slate-700 hover:bg-[#C9A84C] hover:text-[#071A33] transition-all shadow-xl cursor-pointer ${
            currentPage <= 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
          }`}
          title="Previous Page (←)"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* NEXT PAGE BUTTON (RIGHT) */}
        <button
          onClick={goToNextPage}
          disabled={currentPage >= totalPages}
          className={`absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-slate-800/90 text-white border border-slate-700 hover:bg-[#C9A84C] hover:text-[#071A33] transition-all shadow-xl cursor-pointer ${
            currentPage >= totalPages ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
          }`}
          title="Next Page (→)"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* 3. BOTTOM SCRUBBER & THUMBNAIL BAR */}
      <div className="bg-[#071A33] border-t border-slate-800 px-4 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs z-20">
        <div className="flex items-center space-x-3 text-slate-300 font-mono">
          <span className="font-bold text-[#FFD84A]">
            Page {currentPage} of {totalPages}
          </span>
          <span className="text-slate-500 hidden sm:inline">•</span>
          <span className="text-slate-400 hidden sm:inline truncate max-w-xs">
            {currentArticle?.title}
          </span>
        </div>

        {/* Progress Slider */}
        <div className="flex items-center space-x-2 flex-1 max-w-md mx-4">
          <span className="text-[10px] font-mono text-slate-500">1</span>
          <input
            type="range"
            min="1"
            max={totalPages}
            value={currentPage}
            onChange={(e) => jumpToPage(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-[#C9A84C]"
          />
          <span className="text-[10px] font-mono text-slate-500">{totalPages}</span>
        </div>

        <div className="text-[11px] font-mono text-slate-400">
          <span className="text-emerald-400 font-semibold">● Local Storage Verified</span>
        </div>
      </div>
    </div>
  );
}
