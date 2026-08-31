import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  ArrowLeft, 
  Download, 
  FileText, 
  CheckCircle2, 
  ExternalLink, 
  Building2, 
  Calendar, 
  Award, 
  Share2, 
  Maximize2,
  Lock,
  Eye
} from 'lucide-react';
import { getComplianceDocBySlug, ALL_COMPLIANCE_DOCS } from '../data/complianceData';

export default function ComplianceDocumentPage() {
  const { docSlug } = useParams();
  const doc = getComplianceDocBySlug(docSlug);
  const [copied, setCopied] = useState(false);

  if (!doc) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center py-16 px-4 sm:px-8 bg-[#FAF9F6] text-[#071A33]">
        <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-md max-w-lg mx-auto text-center space-y-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h1 className="font-serif font-bold text-2xl text-slate-900">Document Not Found</h1>
          <p className="text-xs sm:text-sm text-slate-600">
            We could not locate a compliance disclosure document for "<span className="font-mono font-semibold">{docSlug}</span>".
          </p>
          <div className="pt-2">
            <Link to="/mandatory-disclosure" className="btn-primary-blue px-6 py-2.5 rounded-xl text-xs font-bold inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              <span>Back to Mandatory Disclosures</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Related compliance documents
  const relatedDocs = ALL_COMPLIANCE_DOCS
    .filter(d => d.slug !== doc.slug)
    .slice(0, 4);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* 1. BREADCRUMBS & TOP BAR */}
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200/80 pb-4">
          <Link
            to="/mandatory-disclosure"
            className="inline-flex items-center text-xs sm:text-sm font-bold text-[#1C5496] hover:text-[#071A33] transition-colors group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5 group-hover:-translate-x-1 transition-transform" />
            <span>Back to All Mandatory Disclosures</span>
          </Link>

          <div className="flex items-center space-x-2 text-xs font-semibold text-slate-500 font-mono">
            <Link to="/mandatory-disclosure" className="hover:text-[#1C5496]">COMPLIANCE</Link>
            <span>/</span>
            <span className="text-slate-800 font-bold uppercase">{doc.slug}</span>
          </div>
        </div>

        {/* 2. DOCUMENT HEADER BANNER */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#1C5496] text-white font-mono font-bold text-xs px-3 py-1 rounded-md tracking-wider">
                {doc.dept}
              </span>
              <span className="bg-emerald-50 text-emerald-800 font-sans font-semibold text-xs px-3 py-1 rounded-md border border-emerald-200 flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Official Statutory Document
              </span>
              {doc.date && (
                <span className="bg-slate-100 text-slate-700 font-sans text-xs px-3 py-1 rounded-md border border-slate-200">
                  {doc.date}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleShare}
                className="px-3.5 py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700 inline-flex items-center transition-colors"
                title="Copy share link"
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                <span>{copied ? 'Link Copied!' : 'Share Document'}</span>
              </button>
              <a
                href={doc.pdfUrl}
                download={`${doc.slug}.pdf`}
                className="btn-gold px-5 py-2 rounded-xl text-xs font-bold inline-flex items-center shadow-xs"
              >
                <Download className="w-4 h-4 mr-1.5" />
                <span>Download PDF</span>
              </a>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="font-serif font-extrabold text-2xl sm:text-3xl lg:text-4xl text-slate-900 leading-tight">
              {doc.title}
            </h1>
            {doc.subtitle && (
              <p className="text-base sm:text-lg font-serif italic text-[#1C5496]">
                {doc.subtitle}
              </p>
            )}
            <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed pt-1">
              {doc.details}
            </p>
          </div>
        </div>

        {/* 3. MAIN DOCUMENT VIEWER & SIDEBAR GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* PDF VIEWER (8 COLUMNS) */}
          <div className="lg:col-span-8 space-y-4">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
              
              {/* Viewer Top Toolbar */}
              <div className="bg-slate-900 text-white px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-[#FFD84A]" />
                  <span className="font-mono font-bold">{doc.slug}.pdf</span>
                  <span className="text-slate-400">|</span>
                  <span className="text-slate-300">St. Philomena's Institutional Repository</span>
                </div>
                <div className="flex items-center space-x-2">
                  <a
                    href={doc.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-slate-300 hover:text-white inline-flex items-center text-xs font-semibold"
                  >
                    <Maximize2 className="w-3.5 h-3.5 mr-1" />
                    <span>Open in Full Tab</span>
                  </a>
                </div>
              </div>

              {/* Embedded PDF Viewer */}
              <div className="w-full h-[650px] sm:h-[800px] bg-slate-100 relative">
                <iframe
                  src={`${doc.pdfUrl}#toolbar=1&navpanes=0`}
                  title={doc.title}
                  className="w-full h-full border-0"
                />
              </div>

              {/* Viewer Bottom Info Bar */}
              <div className="bg-slate-50 border-t border-slate-200 px-5 py-3 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
                <span>Certified Public Disclosure • Verified by St. Philomena's College (Autonomous)</span>
                <a
                  href={doc.pdfUrl}
                  download={`${doc.slug}.pdf`}
                  className="font-bold text-[#1C5496] hover:underline inline-flex items-center"
                >
                  <Download className="w-3.5 h-3.5 mr-1" />
                  <span>Download Offline Copy (.PDF)</span>
                </a>
              </div>

            </div>
          </div>

          {/* SIDEBAR (4 COLUMNS) */}
          <div className="lg:col-span-4 space-y-6">

            {/* Document Metadata Card */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                Document Details
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Issuing Authority:</span>
                  <span className="font-bold text-slate-800">{doc.dept}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Institution:</span>
                  <span className="font-semibold text-slate-800">St. Philomena's (Autonomous)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Format:</span>
                  <span className="font-mono font-bold text-slate-800">Adobe PDF Document</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Verification Status:</span>
                  <span className="text-emerald-700 font-bold flex items-center">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Verified & Active
                  </span>
                </div>
              </div>
            </div>

            {/* Related Compliance Documents */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <h3 className="font-serif font-bold text-base text-slate-900 border-b border-slate-100 pb-2">
                Related Disclosures
              </h3>
              <div className="space-y-2.5">
                {relatedDocs.map((rel) => (
                  <Link
                    key={rel.slug}
                    to={`/compliance/${rel.slug}`}
                    className="p-3 bg-slate-50 hover:bg-blue-50/70 rounded-xl border border-slate-200 transition-colors flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 min-w-0 pr-2">
                      <span className="font-serif font-bold text-xs text-slate-900 group-hover:text-[#1C5496] block truncate">
                        {rel.title}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono block truncate">
                        {rel.dept}
                      </span>
                    </div>
                    <Eye className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#1C5496] shrink-0" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Hub Link */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center">
              <Link to="/mandatory-disclosure" className="text-xs font-bold text-[#1C5496] hover:underline">
                ← View Complete Mandatory Disclosures Directory
              </Link>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
