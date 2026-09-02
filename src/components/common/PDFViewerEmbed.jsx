import React, { useState } from 'react';
import { Download, ExternalLink, Maximize2, Minimize2, FileText, Sparkles, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

export default function PDFViewerEmbed({ 
  src, 
  title = "Document Preview", 
  height = "88vh", 
  allowDownload = true,
  allowFullscreen = true,
  badge = "Official PDF Document"
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [viewHeight, setViewHeight] = useState(height);

  return (
    <div className={`bg-slate-950 rounded-2xl border border-slate-700 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
      isFullscreen 
        ? 'fixed inset-2 sm:inset-4 z-50 shadow-2xl bg-slate-950 flex flex-col h-[calc(100vh-2rem)]' 
        : 'w-full'
    }`}>
      {/* Top Controls Toolbar */}
      <div className="bg-[#071A33] px-4 sm:px-6 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 text-white">
        <div className="flex items-center space-x-3 overflow-hidden">
          <div className="p-2 bg-blue-900/50 rounded-lg border border-blue-700/50">
            <FileText className="w-5 h-5 text-[#FFD84A] shrink-0" />
          </div>
          <div className="truncate">
            <h4 className="font-serif font-bold text-sm sm:text-base text-white truncate">{title}</h4>
            <div className="flex items-center space-x-2 text-[11px] text-slate-300 font-mono">
              <span className="text-[#FFD84A] font-semibold">{badge}</span>
              <span>•</span>
              <span className="text-slate-400">Full Document View</span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2 shrink-0">
          {allowDownload && (
            <a
              href={src}
              download
              className="px-3.5 py-1.5 bg-[#FFD84A] hover:bg-[#ffcd1f] text-slate-900 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
              title="Download official PDF file"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download PDF</span>
            </a>
          )}

          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors flex items-center space-x-1 cursor-pointer"
            title="Open in new window / full tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Open in Tab</span>
          </a>

          {allowFullscreen && (
            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs transition-colors cursor-pointer"
              title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Document View"}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* Full Embedded PDF Viewer Container */}
      <div 
        className="w-full bg-slate-900 relative flex-1"
        style={{ 
          height: isFullscreen ? 'calc(100vh - 120px)' : (viewHeight.includes('px') || viewHeight.includes('vh') ? viewHeight : `${viewHeight}px`),
          minHeight: isFullscreen ? 'calc(100vh - 120px)' : '850px'
        }}
      >
        <iframe
          src={`${src}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
          title={title}
          className="w-full h-full min-h-[850px] border-0 block"
          style={{ height: '100%', minHeight: isFullscreen ? 'calc(100vh - 120px)' : '850px' }}
        />
      </div>

      {/* Viewer Footer Status Bar */}
      <div className="bg-[#071A33] px-4 py-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400 font-mono">
        <span>St. Philomena's College (Autonomous), Mysore · Digital PDF Commons</span>
        <a 
          href={src} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[#FFD84A] hover:underline"
        >
          Direct PDF Link ↗
        </a>
      </div>
    </div>
  );
}

