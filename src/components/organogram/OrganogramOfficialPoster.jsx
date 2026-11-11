import React, { useRef, useState, useMemo } from 'react';
import { 
  Download, FileText, Image as ImageIcon, X, Maximize2, Minimize2, 
  Check, ShieldCheck, Printer, ArrowLeft
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { calculateOfficialPosterLayout } from './organogramPosterLayout';

export default function OrganogramOfficialPoster({
  nodes = [],
  title = "St. Philomena's College (Autonomous) Administrative Organogram",
  version = "1.2",
  onClose = null,
  onNodeClick = null,
  isModal = false
}) {
  const svgRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState('');

  // Calculate layout from raw nodes
  const layout = useMemo(() => {
    return calculateOfficialPosterLayout(nodes);
  }, [nodes]);

  // Helper to split text for SVG nodes that are multi-line
  const formatNodeTitle = (titleText, maxWidthChars = 24) => {
    if (!titleText) return [''];
    if (titleText.length <= maxWidthChars) return [titleText];
    
    // Split into 2 balanced lines
    const words = titleText.split(' ');
    let line1 = '';
    let line2 = '';
    
    words.forEach(word => {
      if ((line1 + ' ' + word).trim().length <= maxWidthChars && !line2) {
        line1 = (line1 + ' ' + word).trim();
      } else {
        line2 = (line2 + ' ' + word).trim();
      }
    });

    if (!line2) return [line1];
    return [line1, line2];
  };

  // Export as PNG (Standard 2x or Ultra-HD 4K 3x)
  const handleDownloadPng = async (scaleMultiplier = 2, filenameSuffix = '') => {
    if (!svgRef.current) return;
    setDownloading(true);
    try {
      const svgElement = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = layout.width * scaleMultiplier;
        canvas.height = layout.height * scaleMultiplier;
        const ctx = canvas.getContext('2d');
        
        // Fill pure white background
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw crisp SVG
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(blobURL);

        canvas.toBlob((blob) => {
          if (!blob) {
            setDownloading(false);
            return;
          }
          const link = document.createElement('a');
          link.download = `st_philos_organogram_v${version || 'official'}${filenameSuffix}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
          setDownloading(false);
          setDownloadSuccess('PNG exported successfully!');
          setTimeout(() => setDownloadSuccess(''), 3000);
        }, 'image/png');
      };
      image.src = blobURL;
    } catch (err) {
      console.error('PNG export failed:', err);
      setDownloading(false);
    }
  };

  // Export Print-Ready Landscape PDF
  const handleExportPdf = async () => {
    if (!svgRef.current) return;
    setDownloading(true);
    try {
      const svgElement = svgRef.current;
      const svgString = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);

      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement('canvas');
        const scale = 2.5;
        canvas.width = layout.width * scale;
        canvas.height = layout.height * scale;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(blobURL);

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        
        // Standard A3 landscape (420mm x 297mm) for high-definition chart poster
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'mm',
          format: 'a3'
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        
        // Margins: 10mm
        const margin = 10;
        const availableW = pageWidth - (margin * 2);
        const availableH = pageHeight - (margin * 2);

        const chartAspect = layout.width / layout.height;
        let printW = availableW;
        let printH = printW / chartAspect;

        if (printH > availableH) {
          printH = availableH;
          printW = printH * chartAspect;
        }

        const offsetX = margin + (availableW - printW) / 2;
        const offsetY = margin + (availableH - printH) / 2;

        pdf.addImage(imgData, 'JPEG', offsetX, offsetY, printW, printH);
        pdf.save(`st_philos_college_organogram_v${version || 'official'}.pdf`);
        
        setDownloading(false);
        setDownloadSuccess('Print-Ready PDF exported!');
        setTimeout(() => setDownloadSuccess(''), 3000);
      };
      image.src = blobURL;
    } catch (err) {
      console.error('PDF export failed:', err);
      setDownloading(false);
    }
  };

  // Export raw SVG vector file
  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    try {
      const svgString = new XMLSerializer().serializeToString(svgRef.current);
      const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
      const URL = window.URL || window.webkitURL || window;
      const link = document.createElement('a');
      link.download = `st_philos_organogram_v${version || 'official'}.svg`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
      setDownloadSuccess('Vector SVG exported!');
      setTimeout(() => setDownloadSuccess(''), 3000);
    } catch (err) {
      console.error('SVG export failed:', err);
    }
  };

  return (
    <div className={`w-full h-full flex flex-col bg-white overflow-hidden select-none ${isModal ? 'fixed inset-0 z-50' : 'relative'}`}>
      {/* =========================================================================
          TOP ACTION BAR (Completely Outside the Rendered Chart)
          ========================================================================= */}
      <header className="h-14 bg-slate-900 text-white px-4 sm:px-6 flex items-center justify-between border-b border-slate-800 shrink-0 z-10 shadow-sm">
        <div className="flex items-center space-x-3 min-w-0">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-slate-700"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Editor</span>
            </button>
          )}

          <div className="flex items-center space-x-2 truncate">
            <h2 className="text-sm font-bold text-white tracking-wide truncate">
              {title}
            </h2>
            <span className="text-[10px] font-mono font-bold bg-[#C9A84C]/20 text-[#E6CA65] border border-[#C9A84C]/40 px-2 py-0.5 rounded-full shrink-0">
              v{version} Official Publication
            </span>
          </div>
        </div>

        {/* Export and Action Buttons */}
        <div className="flex items-center space-x-2 shrink-0">
          {downloadSuccess && (
            <span className="text-xs text-emerald-400 font-semibold flex items-center space-x-1 animate-pulse">
              <Check className="w-3.5 h-3.5" />
              <span>{downloadSuccess}</span>
            </span>
          )}

          <button
            type="button"
            onClick={() => handleDownloadPng(2)}
            disabled={downloading}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors border border-slate-700 disabled:opacity-50"
            title="Download PNG at 2x resolution"
          >
            <ImageIcon className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span className="hidden md:inline">Download PNG</span>
          </button>

          <button
            type="button"
            onClick={() => handleDownloadPng(3.5, '_4K_HighRes')}
            disabled={downloading}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium cursor-pointer transition-colors border border-slate-700 disabled:opacity-50"
            title="Download 4K Ultra High-Resolution PNG for printing"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">High-Res PNG</span>
          </button>

          <button
            type="button"
            onClick={handleExportPdf}
            disabled={downloading}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#0B1F4E] hover:bg-[#152e6e] text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors border border-[#C9A84C]/50 shadow-xs disabled:opacity-50"
            title="Export Print-Ready PDF in landscape format"
          >
            <FileText className="w-3.5 h-3.5 text-[#C9A84C]" />
            <span>Export PDF</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={downloading}
            className="flex items-center space-x-1.5 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-xs font-medium cursor-pointer transition-colors border border-slate-700 disabled:opacity-50"
            title="Export SVG vector file"
          >
            <span className="font-mono text-[11px] font-bold">SVG</span>
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer transition-colors"
              title="Close Preview (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </header>

      {/* =========================================================================
          MAIN ORGANOGRAM CANVAS (Clean, Complete Fit-to-Page, Zero Scrolling)
          ========================================================================= */}
      <div 
        data-testid="organogram-poster-container"
        className="flex-1 w-full h-full min-h-0 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden bg-white"
      >
        <div className="w-full h-full max-w-full max-h-full flex items-center justify-center overflow-hidden">
          <svg
            ref={svgRef}
            id="official-organogram-svg"
            data-testid="official-organogram-svg"
            viewBox={layout.viewBox}
            preserveAspectRatio="xMidYMid meet"
            className="w-full h-full max-w-full max-h-full block select-none"
            style={{ shapeRendering: 'geometricPrecision' }}
          >
            {/* Pure White Background */}
            <rect width="100%" height="100%" fill="#FFFFFF" />

            {/* =========================================================================
                OFFICIAL COLLEGE HEADER (Matching Screenshot 2)
                ========================================================================= */}
            {/* Top-Left: "Organogram" Heading */}
            <text
              x="50"
              y="56"
              fontFamily="Georgia, 'Times New Roman', serif"
              fontSize="28"
              fontWeight="700"
              fill="#005B7F"
              letterSpacing="0.5"
            >
              Organogram
            </text>

            {/* Top-Right: College Crest / Shield & Address */}
            <g transform="translate(1310, 20)">
              {/* College Shield Emblem */}
              <image
                href="/assets/logo.png"
                x="55"
                y="0"
                width="52"
                height="52"
                preserveAspectRatio="xMidYMid meet"
              />
              <text
                x="80"
                y="66"
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="12.5"
                fontWeight="600"
                fill="#005B7F"
              >
                St. Philomena's College (Autonomous)
              </text>
              <text
                x="80"
                y="82"
                textAnchor="middle"
                fontFamily="system-ui, -apple-system, sans-serif"
                fontSize="11"
                fill="#005B7F"
              >
                Bannimantap, Mysore - 570015
              </text>
            </g>

            {/* =========================================================================
                CONNECTING LINES (Orthogonal Vector Paths)
                ========================================================================= */}
            <g stroke="#334155" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none">
              {layout.lines.map((pathD, idx) => (
                <path key={`line_${idx}`} d={pathD} />
              ))}
            </g>

            {/* =========================================================================
                ORGANISATIONAL NODES (Rendered with Exact Institutional Styling)
                ========================================================================= */}
            <g>
              {layout.nodes.map((node) => {
                const isOval = node.style.shape === 'oval';
                const lines = formatNodeTitle(node.title, isOval ? 28 : (node.layoutWidth < 170 ? 20 : 25));
                const centerX = node.layoutX + (node.layoutWidth / 2);
                const centerY = node.layoutY + (node.layoutHeight / 2);

                return (
                  <g
                    key={node.id}
                    onClick={() => onNodeClick && onNodeClick(node)}
                    className="cursor-pointer"
                  >
                    {/* Node Rectangle / Oval Shape */}
                    {isOval ? (
                      <rect
                        x={node.layoutX}
                        y={node.layoutY}
                        width={node.layoutWidth}
                        height={node.layoutHeight}
                        rx="23"
                        ry="23"
                        fill={node.style.bgColor}
                        stroke={node.style.borderColor || '#C9A84C'}
                        strokeWidth="2"
                      />
                    ) : (
                      <rect
                        x={node.layoutX}
                        y={node.layoutY}
                        width={node.layoutWidth}
                        height={node.layoutHeight}
                        rx="4"
                        ry="4"
                        fill={node.style.bgColor}
                        stroke={node.style.borderColor || '#FFFFFF'}
                        strokeWidth="1.2"
                      />
                    )}

                    {/* Node Text Content */}
                    <text
                      x={centerX}
                      y={centerY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={node.style.textColor || '#FFFFFF'}
                      fontFamily="system-ui, -apple-system, sans-serif"
                      fontSize={node.style.fontSize}
                      fontWeight={node.style.fontWeight || '500'}
                      letterSpacing="0.2"
                    >
                      {lines.length === 1 ? (
                        <tspan x={centerX} dy="0">
                          {lines[0]}
                        </tspan>
                      ) : (
                        <>
                          <tspan x={centerX} dy="-6">
                            {lines[0]}
                          </tspan>
                          <tspan x={centerX} dy="13">
                            {lines[1]}
                          </tspan>
                        </>
                      )}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}
