import React, { useState } from 'react';
import { 
  Award, 
  FileText, 
  Download, 
  ExternalLink, 
  BarChart3, 
  CheckCircle2, 
  TrendingUp, 
  GraduationCap, 
  BookOpen, 
  Users, 
  Eye 
} from 'lucide-react';
import PDFViewerEmbed from '../components/common/PDFViewerEmbed';

export default function NirfPage() {
  const nirfReports = [
    {
      year: "2022",
      title: "NIRF Institutional Data Report 2022",
      fileName: "St.-Philominas-College-Bannimantap20220218-.pdf",
      path: "/assets/documents/nirf/St-Philomenas-College-NIRF-2022.pdf",
      badge: "NIRF - 2022",
      desc: "Comprehensive institutional submission report submitted under National Institutional Ranking Framework (NIRF), Ministry of Education, Govt. of India."
    },
    {
      year: "2021",
      title: "NIRF Institutional Data Report 2021",
      fileName: "St.-Philominas-College-Bannimantap20210305-1.pdf",
      path: "/assets/documents/nirf/St-Philomenas-College-NIRF-2021.pdf",
      badge: "NIRF - 2021",
      desc: "Annual NIRF data submission encompassing student intake, faculty credentials, research output, capital expenditure, and student graduation outcomes."
    }
  ];

  const [selectedReport, setSelectedReport] = useState(nirfReports[0]);

  const nirfParameters = [
    {
      title: "Teaching, Learning & Resources (TLR)",
      desc: "Student strength including doctoral students, faculty-student ratio with emphasis on permanent faculty, faculty qualifications, experience, and financial resources utilization.",
      icon: GraduationCap,
      weight: "30%"
    },
    {
      title: "Research & Professional Practice (RPC)",
      desc: "Publications metrics in indexed journals, quality of publications, IPR and patents filed/published/granted, and sponsored research projects footprint.",
      icon: BookOpen,
      weight: "30%"
    },
    {
      title: "Graduation Outcomes (GO)",
      desc: "Metrics for university examination pass percentages, median salary of placed graduates, and number of students progressing to higher studies in premier institutions.",
      icon: TrendingUp,
      weight: "20%"
    },
    {
      title: "Outreach & Inclusivity (OI)",
      desc: "Percentage of students from other states/countries, percentage of women students and faculty, economically and socially challenged students (SC/ST/OBC), and facilities for physically challenged students.",
      icon: Users,
      weight: "10%"
    },
    {
      title: "Peer Perception (PR)",
      desc: "Institutional reputation and academic excellence surveyed among academic peers and employers across industry and higher education.",
      icon: Award,
      weight: "10%"
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
                Ministry of Education (MoE)
              </span>
              <span className="bg-amber-50 text-amber-800 badge-universal px-3 py-1 rounded-md">
                Govt. of India
              </span>
            </div>

            <h1 className="head-universal">
              National Institutional Ranking Framework (NIRF)
            </h1>

            <p className="body-universal">
              St. Philomena’s College (Autonomous), Mysuru participates in the National Institutional Ranking Framework (NIRF), Ministry of Education, Government of India. Below are the verified annual institutional data submissions, student intake metrics, faculty profiles, and graduation outcomes.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="/assets/documents/nirf/St-Philomenas-College-NIRF-2022.pdf"
              download="St-Philomenas-College-NIRF-2022.pdf"
              className="btn-gold px-6 py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download NIRF 2022 PDF</span>
            </a>

            <a
              href="/assets/documents/nirf/St-Philomenas-College-NIRF-2021.pdf"
              download="St-Philomenas-College-NIRF-2021.pdf"
              className="px-6 py-3 bg-[#0B1F4E] hover:bg-[#1C5496] text-white rounded-xl text-sm font-bold text-center flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <FileText className="w-4 h-4 text-[#FFD84A]" />
              <span>Download NIRF 2021 PDF</span>
            </a>
          </div>
        </div>

        {/* 2. Official PDF Document Links Grid (Matches stphilos.ac.in/nirf/) */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[#1C5496] badge-universal block">Official Submissions</span>
              <h3 className="subhead-universal">
                Click On The Below Links To View PDF File:
              </h3>
            </div>
            <span className="bg-blue-50 text-[#1C5496] badge-universal px-3 py-1 rounded-md">
              {nirfReports.length} Official Reports Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {nirfReports.map((report, idx) => {
              const isSelected = selectedReport.year === report.year;
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                    isSelected ? 'bg-blue-50/90 border-[#1C5496] shadow-sm' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-1 bg-[#1C5496] text-white text-xs font-mono font-bold rounded-md">
                        {report.badge}
                      </span>
                      <span className="text-[11px] font-mono text-slate-500">{report.fileName}</span>
                    </div>

                    <h4 className="font-serif font-bold text-lg text-slate-900 leading-snug">
                      {report.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed font-sans">
                      {report.desc}
                    </p>
                  </div>

                  <div className="flex items-center space-x-3 pt-3 border-t border-slate-200/80">
                    <button
                      onClick={() => setSelectedReport(report)}
                      className="px-4 py-2 bg-[#0B1F4E] hover:bg-[#1C5496] text-white rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{isSelected ? 'Currently Viewing' : 'View in Document Viewer'}</span>
                    </button>

                    <a
                      href={report.path}
                      download={report.fileName}
                      className="px-4 py-2 bg-[#FFD84A] hover:bg-[#ffcd1f] text-slate-900 rounded-xl text-xs font-bold flex items-center space-x-1.5 shadow-2xs cursor-pointer"
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

        {/* 3. Interactive Full Document Viewer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Institutional Disclosure</span>
              <h3 className="font-serif font-bold text-xl text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#1C5496]" />
                <span>Interactive NIRF Document Viewer: <span className="text-[#1C5496]">{selectedReport.title}</span></span>
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Full Document View
            </span>
          </div>

          <PDFViewerEmbed
            src={selectedReport.path}
            title={selectedReport.title}
            height="850px"
            badge={`Official NIRF ${selectedReport.year} Submission`}
          />
        </div>

        {/* 4. NIRF Evaluation Framework & Parameters */}
        <div className="space-y-4">
          <div>
            <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Ranking Methodology</span>
            <h3 className="font-serif font-bold text-2xl text-slate-900">NIRF Assessment Parameters</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {nirfParameters.map((param, idx) => {
              const Icon = param.icon;
              return (
                <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1C5496] flex items-center justify-center">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-md">
                        Weightage: {param.weight}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-base text-slate-900">{param.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{param.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
