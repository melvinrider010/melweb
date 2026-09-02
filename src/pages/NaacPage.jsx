import React, { useState } from 'react';
import { 
  Award, 
  ShieldCheck, 
  Download, 
  FileText, 
  ExternalLink, 
  CheckCircle2, 
  BookOpen, 
  Calendar, 
  Building2, 
  Layers, 
  Sparkles,
  Search,
  ChevronRight
} from 'lucide-react';
import PDFViewerEmbed from '../components/common/PDFViewerEmbed';

export default function NaacPage() {
  const naacDocuments = [
    {
      id: 'cycle-3',
      title: 'NAAC Cycle III Certificate 2020',
      year: '2020',
      grade: 'Cycle III Certified',
      description: 'Official National Assessment and Accreditation Council (NAAC) Re-accreditation Certificate & Institutional Grade Sheet.',
      fileUrl: '/assets/documents/naac/SPC-MYS-NAAC-2020-Certificate.pdf',
      fileSize: '777 KB',
      badge: 'Current Cycle'
    },
    {
      id: 'ssr-2019',
      title: 'NAAC 2019 - Self Study Report (SSR Final)',
      year: '2019',
      grade: 'Institutional SSR',
      description: 'Comprehensive Institutional Self Study Report (SSR) detailing 7 Core Evaluative Criteria, quantitative metrics, and executive summaries.',
      fileUrl: '/assets/documents/naac/SSR-FINAL-2019.pdf',
      fileSize: '6.85 MB',
      badge: 'Core Submission'
    },
    {
      id: 'cycle-2',
      title: 'NAAC Cycle II Certificate 2014',
      year: '2014',
      grade: "'A' Grade (CGPA 3.58)",
      description: 'Official NAAC Re-accreditation Certificate awarding Grade "A" with Cumulative Grade Point Average of 3.58 on a 4-point scale.',
      fileUrl: '/assets/documents/naac/NAAC-2014-certificate.pdf',
      fileSize: '4.48 MB',
      badge: 'Cycle II'
    },
    {
      id: 'cycle-1',
      title: 'NAAC Cycle I Certificate 2004',
      year: '2004',
      grade: 'Accredited',
      description: 'First Institutional Accreditation Certificate conferred by NAAC Peer Team upon foundational performance assessment.',
      fileUrl: '/assets/documents/naac/Naac-Certificate-2004.pdf',
      fileSize: '15.52 MB',
      badge: 'Cycle I'
    }
  ];

  const [selectedDoc, setSelectedDoc] = useState(naacDocuments[0]);

  const naacCriteria = [
    {
      num: '01',
      title: 'Curricular Aspects',
      desc: 'Curriculum design, academic flexibility, feedback systems, and value-added courses aligned with NEP and industry requirements.'
    },
    {
      num: '02',
      title: 'Teaching-Learning & Evaluation',
      desc: 'Student-centric pedagogical methods, ICT integration, continuous internal assessments, and transparent outcome evaluation.'
    },
    {
      num: '03',
      title: 'Research, Innovations & Extension',
      desc: 'Promotion of multidisciplinary research, active MoUs, patent filings, incubation ecosystem, and community outreach.'
    },
    {
      num: '04',
      title: 'Infrastructure & Learning Resources',
      desc: 'State-of-the-art laboratories, automated digital library, sports complexes, hostels, ICT classrooms, and Wi-Fi campus.'
    },
    {
      num: '05',
      title: 'Student Support & Progression',
      desc: 'Placement drives, capability enhancement schemes, career counselling, scholarships, alumni engagement, and student grievance redressal.'
    },
    {
      num: '06',
      title: 'Governance, Leadership & Management',
      desc: 'Strategic leadership, institutional decentralization, financial audits, faculty empowerment, and IQAC quality initiatives.'
    },
    {
      num: '07',
      title: 'Institutional Values & Best Practices',
      desc: 'Green campus audits, renewable energy, inclusive gender equity, human values, and benchmark best practices.'
    }
  ];

  return (
    <div className="space-y-10 py-6 sm:py-10 text-[#071A33]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-10">

        {/* 1. Header Banner */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center space-x-2 flex-wrap gap-y-2">
              <span className="bg-blue-50 text-[#1C5496] badge-universal px-3 py-1 rounded-md">
                National Assessment & Accreditation Council (NAAC)
              </span>
              <span className="bg-amber-50 text-amber-800 badge-universal px-3 py-1 rounded-md">
                UGC Autonomous Institution
              </span>
            </div>

            <h1 className="head-universal">
              NAAC Accreditation & Quality Assurance
            </h1>

            <p className="body-universal">
              St. Philomena's College (Autonomous), Mysuru has continuously upheld stringent quality benchmarks across academic, research, and governance domains. Explore verified NAAC Accreditation Certificates across Cycle I, Cycle II, and Cycle III, along with the official Self Study Report (SSR).
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="/assets/documents/naac/SPC-MYS-NAAC-2020-Certificate.pdf"
              download="SPC-MYS-NAAC-2020-Certificate.pdf"
              className="btn-gold px-6 py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>Download Cycle III Certificate</span>
            </a>

            <a
              href="/assets/documents/naac/SSR-FINAL-2019.pdf"
              download="NAAC-SSR-FINAL-2019.pdf"
              className="px-6 py-3 bg-[#0B1F4E] hover:bg-[#1C5496] text-white rounded-xl text-sm font-bold text-center flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#FFD84A]" />
              <span>Download NAAC SSR (PDF)</span>
            </a>
          </div>
        </div>

        {/* 2. Official NAAC Accreditation Documents Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[#1C5496] badge-universal block">Official Submissions</span>
              <h3 className="subhead-universal">
                Click On The Below Links To View PDF File:
              </h3>
            </div>
            <span className="bg-blue-50 text-[#1C5496] badge-universal px-3 py-1 rounded-md">
              {naacDocuments.length} Official Reports Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {naacDocuments.map((doc) => {
              const isSelected = selectedDoc.id === doc.id;
              return (
                <div
                  key={doc.id}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isSelected 
                      ? 'bg-blue-50/90 border-[#1C5496] shadow-sm ring-1 ring-[#1C5496]/30' 
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="badge-universal text-[#1C5496]">
                        {doc.badge}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {doc.fileSize}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base sm:text-lg text-slate-900 leading-snug">
                      {doc.title}
                    </h4>

                    <p className="body-universal text-xs sm:text-sm">
                      {doc.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => setSelectedDoc(doc)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isSelected 
                          ? 'bg-[#1C5496] text-white shadow-xs' 
                          : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-300'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Currently Viewing' : 'View in Viewer'}</span>
                    </button>

                    <a
                      href={doc.fileUrl}
                      download={`${doc.id}.pdf`}
                      className="text-xs font-bold text-[#1C5496] hover:underline flex items-center space-x-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download PDF</span>
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. Embedded Full Document Viewer */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="subhead-universal flex items-center space-x-2">
              <Award className="w-5 h-5 text-[#1C5496]" />
              <span>Interactive Viewer: {selectedDoc.title}</span>
            </h3>
            <span className="badge-universal text-slate-500">
              Verified Official Document
            </span>
          </div>

          <PDFViewerEmbed
            src={selectedDoc.fileUrl}
            title={selectedDoc.title}
            height="88vh"
            badge={selectedDoc.badge}
          />
        </div>

        {/* 4. NAAC 7 Core Evaluative Criteria */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="space-y-1">
            <span className="text-[#1C5496] badge-universal">Accreditation Framework</span>
            <h2 className="subhead-universal">
              NAAC 7 Core Assessment Criteria
            </h2>
            <p className="body-universal text-xs sm:text-sm">
              The National Assessment and Accreditation Council evaluates higher education institutions across seven comprehensive evaluative criteria that reflect total educational quality.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {naacCriteria.map((c, idx) => (
              <div 
                key={idx} 
                className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:bg-blue-50/50 hover:border-blue-200 transition-all"
              >
                <div className="flex items-center space-x-2">
                  <span className="bg-[#1C5496] text-white font-mono font-bold text-xs px-2 py-0.5 rounded-md">
                    Criterion {c.num}
                  </span>
                </div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900">
                  {c.title}
                </h4>
                <p className="body-universal text-xs">
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Institutional Quality Assurance Linkages */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="badge-universal text-[#1C5496]">Quality Cell</span>
              <h4 className="font-bold text-slate-900">Internal Quality Assurance (IQAC)</h4>
              <p className="body-universal">
                Established May 1, 2004 to maintain continuous incremental improvement in teaching methodologies, research, and stakeholder feedback.
              </p>
            </div>
            <a href="/iqac" className="text-xs font-bold text-[#1C5496] hover:underline flex items-center space-x-1 pt-2">
              <span>View IQAC Portal →</span>
            </a>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="badge-universal text-[#1C5496]">National Ranking</span>
              <h4 className="font-bold text-slate-900">NIRF Submissions</h4>
              <p className="body-universal">
                Verified annual institutional submissions to the National Institutional Ranking Framework (NIRF), Ministry of Education, Govt. of India.
              </p>
            </div>
            <a href="/nirf" className="text-xs font-bold text-[#1C5496] hover:underline flex items-center space-x-1 pt-2">
              <span>View NIRF Data →</span>
            </a>
          </div>

          <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="badge-universal text-[#1C5496]">Innovation Cell</span>
              <h4 className="font-bold text-slate-900">MoE Innovation Council (IIC)</h4>
              <p className="body-universal">
                Institutional innovation ecosystem established in accordance with Ministry of Education's Innovation Cell (MIC), Govt. of India.
              </p>
            </div>
            <a href="/iic" className="text-xs font-bold text-[#1C5496] hover:underline flex items-center space-x-1 pt-2">
              <span>View IIC Council →</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
