import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  BookOpen, 
  Download, 
  Maximize2, 
  ExternalLink, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Image as ImageIcon,
  FileText
} from 'lucide-react';

/**
 * DearFlip 3D Flipbook & High-Res Document/Poster Modal
 * Supports both multi-page PDFs (via WebGL Flipbook) and high-res Posters/Images with pan & zoom.
 */
export default function DearFlipModal({ isOpen, onClose, pdfUrl, title, options = {} }) {
  const containerRef = useRef(null);
  const flipbookInstanceRef = useRef(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [imgError, setImgError] = useState(false);

  // Check if target source is an image format rather than a PDF
  const isImage = typeof pdfUrl === 'string' && (
    /\.(jpeg|jpg|png|webp|gif|svg)(\?.*)?$/i.test(pdfUrl) ||
    (pdfUrl.includes('/media/notices/') && !pdfUrl.endsWith('.pdf'))
  );

  useEffect(() => {
    setZoomLevel(1);
    setImgError(false);
  }, [pdfUrl, isOpen]);

  useEffect(() => {
    if (!isOpen || !pdfUrl) return;

    // If target is an image, we don't initialize PDF.js/DearFlip to prevent format crash
    if (isImage) {
      return;
    }

    // Configure global DearFlip defaults for PDFs
    if (window.DFLIP) {
      window.DFLIP.defaults = {
        ...(window.DFLIP.defaults || {}),
        webgl: true,
        hard: "none",
        direction: 1,
        duration: 800,
        soundEnable: true,
        scrollWheel: true,
        zoomRatio: 1.5,
        maxZoom: 3,
        pageMode: "auto",
        singlePageMode: "auto",
        controlsPosition: "bottom",
        enableDownload: true,
        enableSound: true,
        height: "100%",
        autoPlay: false,
        pdfWorkerSrc: "/dflip/js/libs/pdf.worker.min.js",
        soundPath: "/dflip/sound/",
        backgroundColor: "#0B1528",
        allControls: "altPrev,pageNumber,altNext,play,outline,thumbnail,zoomIn,zoomOut,fullScreen,more,download,pageMode,startPage,endPage,sound",
        moreControls: "download,pageMode,startPage,endPage,sound",
        ...options
      };
    }

    // Small timeout to allow DOM node to render with height/width
    const timer = setTimeout(() => {
      if (containerRef.current && window.$ && window.$.fn && window.$.fn.flipBook) {
        try {
          const $container = window.$(containerRef.current);
          
          // Clear any previous child nodes
          $container.empty();

          // Initialize DearFlip for PDF
          const dfOptions = {
            source: pdfUrl,
            webgl: true,
            height: "100%",
            backgroundColor: "#0B1528",
            ...options
          };

          const instance = $container.flipBook(pdfUrl, dfOptions);
          flipbookInstanceRef.current = instance;
        } catch (err) {
          console.error("Error initializing DearFlip:", err);
        }
      }
    }, 50);

    return () => {
      clearTimeout(timer);

      // Clean up DearFlip instance
      if (flipbookInstanceRef.current && typeof flipbookInstanceRef.current.dispose === 'function') {
        try {
          flipbookInstanceRef.current.dispose();
        } catch (e) {
          // ignore
        }
      }
      if (containerRef.current && window.$) {
        try {
          window.$(containerRef.current).empty();
        } catch (e) {
          // ignore
        }
      }
      flipbookInstanceRef.current = null;
    };
  }, [isOpen, pdfUrl, isImage, options]);

  // Global Escape key listener
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-slate-950/95 backdrop-blur-md flex flex-col justify-between animate-fadeIn"
      style={{ isolation: 'isolate' }}
    >
      {/* Top Header Bar */}
      <div className="h-16 px-4 sm:px-6 bg-[#071324] border-b border-slate-800/80 flex items-center justify-between text-white shrink-0 z-10 shadow-lg">
        
        <div className="flex items-center space-x-3 overflow-hidden pr-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#C9A84C] to-[#FFD84A] text-[#071A33] flex items-center justify-center shrink-0 shadow-sm">
            {isImage ? <ImageIcon className="w-4 h-4 font-bold" /> : <BookOpen className="w-4 h-4 font-bold" />}
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#FFD84A] block">
              {isImage ? "St. Philomena's Official Document / Poster Viewer" : "St. Philomena's 3D Flipbook Reader"}
            </span>
            <h3 className="font-serif font-bold text-sm sm:text-base text-slate-100 truncate">
              {title || "Institutional Document"}
            </h3>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2 shrink-0">
          {/* Zoom controls for image */}
          {isImage && (
            <div className="hidden md:flex items-center space-x-1 mr-2 bg-slate-800/80 rounded-lg p-1 border border-slate-700">
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 0.25, 3))}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-4 h-4" />
              </button>
              <span className="text-[11px] font-mono font-bold px-1 text-slate-300">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 0.25, 0.5))}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-4 h-4" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 rounded hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                title="Reset Zoom"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-semibold hidden sm:inline-flex items-center space-x-1.5"
            title={isImage ? "Open Full Image in new tab" : "Open Raw PDF in new tab"}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>{isImage ? "Full Image" : "Raw PDF"}</span>
          </a>

          <a
            href={pdfUrl}
            download
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors text-xs font-semibold inline-flex items-center space-x-1.5"
            title="Download file"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Download</span>
          </a>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white transition-colors text-xs font-bold inline-flex items-center space-x-1 cursor-pointer ml-2 border border-rose-500/30"
            title="Close Viewer (Esc)"
          >
            <X className="w-4 h-4" />
            <span className="hidden sm:inline">Close</span>
          </button>
        </div>

      </div>

      {/* Main Container */}
      <div className="flex-1 w-full h-[calc(100vh-64px)] relative bg-[#0B1528] overflow-auto flex items-center justify-center p-4">
        {isImage ? (
          <div className="w-full h-full flex items-center justify-center overflow-auto">
            {imgError ? (
              <div className="p-8 bg-slate-900 border border-slate-800 rounded-2xl text-center max-w-md space-y-3">
                <FileText className="w-12 h-12 mx-auto text-amber-400" />
                <h4 className="font-serif font-bold text-white text-base">Document Preview Unavailable</h4>
                <p className="text-xs text-slate-400">The requested circular scan could not be loaded directly.</p>
                <a
                  href={pdfUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary-blue inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold"
                >
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                  <span>Download / Open Directly</span>
                </a>
              </div>
            ) : (
              <div 
                className="transition-transform duration-150 ease-out max-h-full max-w-full flex items-center justify-center"
                style={{ transform: `scale(${zoomLevel})` }}
              >
                <img
                  src={pdfUrl}
                  alt={title || "Official Announcement"}
                  className="max-h-[calc(100vh-120px)] max-w-[90vw] object-contain rounded-lg shadow-2xl border border-slate-700/80 bg-slate-900"
                  onError={() => setImgError(true)}
                />
              </div>
            )}
          </div>
        ) : (
          <div
            ref={containerRef}
            id="dearflip-book-container"
            className="w-full h-full"
            style={{ minHeight: '400px' }}
          />
        )}
      </div>

    </div>
  );
}
