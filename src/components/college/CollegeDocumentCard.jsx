import React from 'react';
import { FileText, Download, Calendar, HardDrive, Eye } from 'lucide-react';
import ViewAsBookButton from '../common/ViewAsBookButton';

/**
 * CollegeDocumentCard
 * Standardized institutional document card and list row.
 * Handles syllabi, regulatory filings, circulars, and departmental PDFs.
 * 
 * @param {Object} document - Document data object
 * @param {'card' | 'row'} layout - Display format (default: 'row')
 * @param {boolean} showPreview - Whether to display 3D/modal reader button (default: true)
 * @param {boolean} showDownload - Whether to display download button (default: true)
 * @param {function} onPreview - Optional custom preview callback
 * @param {function} onDownload - Optional custom download callback
 * @param {string} className - Additional CSS classes
 */
export default function CollegeDocumentCard({
  document = {},
  layout = 'row',
  showPreview = true,
  showDownload = true,
  onPreview,
  onDownload,
  className = ''
}) {
  if (!document || (!document.title && !document.document_name && !document.link_text)) {
    return null;
  }

  const {
    id,
    title = '',
    document_name = '',
    link_text = '',
    url,
    fileUrl,
    file_type,
    extension = '',
    file_size,
    size = '',
    year = '',
    category = '',
    description = '',
    date = ''
  } = document;

  const docTitle = title || document_name || link_text;
  const docUrl = url || fileUrl || '';
  const docExt = (file_type || extension || (docUrl.split('.').pop() || 'PDF')).toUpperCase();
  const docSize = file_size || size;

  // File type aesthetic styling
  const getFileTypeStyle = () => {
    switch (docExt) {
      case 'PDF':
        return {
          iconBg: 'bg-rose-50 text-rose-600 border border-rose-100',
          badge: 'bg-rose-50 text-rose-700 border-rose-200'
        };
      case 'XLS':
      case 'XLSX':
      case 'CSV':
        return {
          iconBg: 'bg-emerald-50 text-emerald-600 border border-emerald-100',
          badge: 'bg-emerald-50 text-emerald-700 border-emerald-200'
        };
      case 'DOC':
      case 'DOCX':
        return {
          iconBg: 'bg-blue-50 text-blue-600 border border-blue-100',
          badge: 'bg-blue-50 text-blue-700 border-blue-200'
        };
      default:
        return {
          iconBg: 'bg-slate-100 text-slate-700 border border-slate-200',
          badge: 'bg-slate-100 text-slate-700 border-slate-200'
        };
    }
  };

  const fileStyle = getFileTypeStyle();
  const isPdf = docExt === 'PDF' || docUrl.toLowerCase().endsWith('.pdf');

  // --- LAYOUT 1: ROW (Optimized for Department Curriculum & Lists) ---
  if (layout === 'row') {
    return (
      <div 
        className={`p-4 rounded-xl bg-slate-50/90 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-slate-300 hover:bg-white transition-all duration-200 ${className}`}
      >
        <div className="flex items-start sm:items-center space-x-3.5 min-w-0">
          <div 
            aria-hidden="true"
            className={`w-10 h-10 rounded-xl ${fileStyle.iconBg} flex items-center justify-center shrink-0 shadow-2xs font-mono font-bold text-xs`}
          >
            <FileText className="w-5 h-5" />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-0.5">
              <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border uppercase ${fileStyle.badge}`}>
                {docExt}
              </span>
              {category && (
                <span className="text-[10px] font-mono font-semibold text-slate-500 capitalize">
                  {category}
                </span>
              )}
              {year && year !== 'all' && (
                <span className="text-[10px] font-mono text-slate-400">
                  • AY: {year}
                </span>
              )}
            </div>

            <h4 
              className="font-heading font-semibold text-xs sm:text-sm text-slate-900 line-clamp-1" 
              title={docTitle}
            >
              {docTitle}
            </h4>

            {description && (
              <p className="text-[11px] text-slate-500 font-sans line-clamp-1 mt-0.5">
                {description}
              </p>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
          {showPreview && isPdf && docUrl && (
            <ViewAsBookButton
              pdfUrl={docUrl}
              title={docTitle}
              label="Preview"
              size="xs"
              variant="outline"
            />
          )}

          {showDownload && docUrl && (
            <a
              href={docUrl}
              download
              target="_blank"
              rel="noopener noreferrer"
              onClick={onDownload}
              className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-slate-200 hover:border-slate-800 text-slate-800 rounded-lg text-xs font-semibold transition-all shadow-2xs focus:outline-none focus:ring-1 focus:ring-slate-800"
              title={`Download ${docTitle}`}
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </a>
          )}
        </div>
      </div>
    );
  }

  // --- LAYOUT 2: CARD (Optimized for Multi-Column Document Grids) ---
  return (
    <div 
      className={`bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:border-blue-400/80 hover:shadow-sm transition-all duration-200 flex flex-col justify-between ${className}`}
    >
      <div className="space-y-3">
        {/* Card Header Tag Row */}
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded border uppercase ${fileStyle.badge}`}>
            {docExt}
          </span>
          {category && (
            <span className="text-[10px] font-mono font-semibold text-[#1C5496] capitalize bg-blue-50/80 px-2 py-0.5 rounded">
              {category}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 
          className="font-heading font-semibold text-sm sm:text-base text-slate-900 line-clamp-2 leading-snug"
          title={docTitle}
        >
          {docTitle}
        </h3>

        {/* Description / Summary */}
        {description && (
          <p className="text-xs text-slate-500 font-sans line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* Metadata Strip */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-400">
          {year && year !== 'all' && (
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{year}</span>
            </span>
          )}
          {docSize && (
            <span className="flex items-center gap-1">
              <HardDrive className="w-3 h-3" />
              <span>{docSize}</span>
            </span>
          )}
          {date && (
            <span>{date}</span>
          )}
        </div>
      </div>

      {/* Card Action Footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
        {showPreview && isPdf && docUrl && (
          <ViewAsBookButton
            pdfUrl={docUrl}
            title={docTitle}
            label="View"
            size="xs"
            variant="blue"
          />
        )}

        {showDownload && docUrl && (
          <a
            href={docUrl}
            download
            target="_blank"
            rel="noopener noreferrer"
            onClick={onDownload}
            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/80 rounded-lg text-xs font-bold transition-colors"
            title={`Download ${docTitle}`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>
        )}
      </div>
    </div>
  );
}
