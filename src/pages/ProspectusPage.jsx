import React from 'react';
import { BookOpen, Download, ExternalLink, Award, FileText, CheckCircle2, ArrowRight, ShieldCheck, BookMarked } from 'lucide-react';
import PDFViewerEmbed from '../components/common/PDFViewerEmbed';
import ViewAsBookButton from '../components/common/ViewAsBookButton';

export default function ProspectusPage() {
  const prospectusPdf = '/assets/documents/admission/Final-Copy-of-College-Prospectus.pdf';
  const feeStructurePdf = '/assets/documents/academics/SKM_C30813010105381-2Fees-Structure.pdf';

  return (
    <div className="space-y-10 py-6 sm:py-10 text-[#071A33]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Header Banner */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-50 text-[#1C5496] badge-universal px-3 py-1 rounded-md">
                Admissions 2026–27
              </span>
              <span className="bg-amber-50 text-amber-800 badge-universal px-3 py-1 rounded-md">
                Official Prospectus
              </span>
            </div>

            <h1 className="head-universal">
              Institutional Prospectus & Information Handbook
            </h1>

            <p className="body-universal">
              Welcome to St. Philomena's College (Autonomous), Mysuru. Explore our official academic prospectus detailing undergraduate, postgraduate, and doctoral degree programmes, admission criteria, fee structures, and campus life.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="https://student.stphiloserp.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold px-6 py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <span>Apply Online 2026-27</span>
              <ArrowRight className="w-4 h-4" />
            </a>

            <ViewAsBookButton
              pdfUrl={prospectusPdf}
              title="St. Philomena's College Prospectus 2026-27"
              label="View Prospectus"
              variant="primary"
              size="lg"
            />
          </div>
        </div>

        {/* Official College Prospectus Viewer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center space-x-2.5">
              <BookMarked className="w-6 h-6 text-[#1C5496]" />
              <div>
                <h3 className="subhead-universal">
                  Official Institutional Prospectus 2026–27
                </h3>
                <p className="caption-universal">
                  St. Philomena's College (Autonomous), Mysuru · Complete Information Handbook
                </p>
              </div>
            </div>
          </div>

          <PDFViewerEmbed
            src={prospectusPdf}
            title="St. Philomena's College (Autonomous) - Official College Prospectus 2026–27"
            height="88vh"
            badge="Official Institutional Prospectus"
          />
        </div>

        {/* Quick Reference Admission Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="badge-universal text-[#1C5496]">Degree Offerings</span>
              <h4 className="font-bold text-slate-900">42+ Academic Programmes</h4>
              <p className="body-universal">
                Comprehensive B.A, B.Sc, B.Com, BBA, BCA, BSW, B.Voc, M.Sc, M.Com, MA, MSW, MCA, MBA, and Ph.D research programmes.
              </p>
            </div>
            <a href="/academics" className="text-xs font-bold text-[#1C5496] hover:underline flex items-center space-x-1 pt-2">
              <span>View Programmes Catalogue →</span>
            </a>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="badge-universal text-[#1C5496]">Financial Transparency</span>
              <h4 className="font-bold text-slate-900">Official Fee Structures</h4>
              <p className="body-universal">
                Download the complete statutory fee schedule approved by the Governing Body for all merit and management categories.
              </p>
            </div>
            <div className="pt-2">
              <ViewAsBookButton
                pdfUrl={feeStructurePdf}
                title="Official Fee Structure 2026-27"
                label="View Fee Structure"
                variant="minimal"
              />
            </div>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="badge-universal text-[#1C5496]">ERP Portal</span>
              <h4 className="font-bold text-slate-900">Online Admissions 2026-27</h4>
              <p className="body-universal">
                Submit your application, track admission merit list status, and complete online fee payment directly through St. Philomena's ERP.
              </p>
            </div>
            <a href="https://student.stphiloserp.in/" target="_blank" rel="noopener noreferrer" className="text-xs font-bold text-[#1C5496] hover:underline flex items-center space-x-1 pt-2">
              <span>Go to ERP Portal ↗</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
