import React from 'react';
import { X, Download, ExternalLink, FileText } from 'lucide-react';
import PDFViewerEmbed from './PDFViewerEmbed';

export default function PDFModalViewer({ isOpen, onClose, pdfUrl, title }) {
  if (!isOpen || !pdfUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col border border-slate-700 shadow-2xl overflow-hidden">
        {/* Modal Top Bar */}
        <div className="bg-[#071A33] px-5 py-3 border-b border-slate-700 flex items-center justify-between gap-3 text-white">
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <FileText className="w-5 h-5 text-[#FFD84A] shrink-0" />
            <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate">{title}</h3>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <a
              href={pdfUrl}
              download
              className="px-3 py-1.5 bg-[#FFD84A] hover:bg-[#ffcd1f] text-slate-900 rounded-lg text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-xs cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Download</span>
            </a>
            <a
              href={pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition-colors cursor-pointer"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs transition-colors cursor-pointer ml-1"
              title="Close Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Viewer Body */}
        <div className="flex-1 w-full bg-slate-950 relative overflow-hidden">
          <object
            data={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
            type="application/pdf"
            className="w-full h-full border-0"
          >
            <iframe
              src={`${pdfUrl}#toolbar=1&navpanes=1&scrollbar=1&view=FitH`}
              title={title}
              className="w-full h-full border-0"
            />
          </object>
        </div>
      </div>
    </div>
  );
}
