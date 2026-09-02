import React, { useState } from 'react';
import { 
  Sparkles, 
  Award, 
  ExternalLink, 
  Download, 
  FileText, 
  CheckCircle2, 
  Target, 
  Lightbulb, 
  Rocket, 
  Users, 
  Calendar, 
  Building2,
  ShieldCheck,
  Eye
} from 'lucide-react';
import PDFViewerEmbed from '../components/common/PDFViewerEmbed';

export default function IicPage() {
  const [selectedPdf, setSelectedPdf] = useState({
    title: "Institution's Innovation Council (IIC) 2025–26 Official Council Composition",
    url: "/assets/documents/iic/Institution-Innovation-Council-IIC-2025-26.pdf",
    badge: "Official Council Roster"
  });

  const iicDocuments = [
    {
      title: "Institution Innovation Council (IIC) Structure 2025-26",
      desc: "Official list of internal and external faculty coordinators, student leads, and industry experts.",
      path: "/assets/documents/iic/Institution-Innovation-Council-IIC-2025-26.pdf",
      badge: "Council 2025-26"
    },
    {
      title: "IIC Establishment Certificate by Ministry of Education (MoE)",
      desc: "Formal certification granted by MoE's Innovation Cell (MIC), Government of India.",
      path: "/assets/documents/iic/IIC-EstablismentCertificate.pdf",
      badge: "MoE Certificate"
    }
  ];

  const objectives = [
    "To create an innovative and entrepreneurial ecosystem by encouraging and creating opportunities for students and faculty to transform their business ideas into reality.",
    "To foster a culture of innovation, research, and entrepreneurship at St. Philomena's College by empowering students and faculty with skills, resources, and opportunities.",
    "Create an innovation-conducive environment on campus that inspires multidisciplinary design thinking.",
    "Engage students and faculty in active ideation, problem-solving, and start-up incubation activities.",
    "Promote interdisciplinary research, patent filing (IPR), and technology commercialization.",
    "Build strong sustainable linkages with industry mentors, alumni entrepreneurs, incubators, and funding agencies."
  ];

  const initiatives = [
    {
      title: "Start-up & Entrepreneurship Events",
      desc: "Guiding student start-ups from early concept ideation to working prototype development and MVP deployment.",
      icon: Rocket
    },
    {
      title: "Workshops & Expert Seminars",
      desc: "Hands-on sessions on Design Thinking, Intellectual Property Rights (IPR), Innovation Management, and Business Planning.",
      icon: Lightbulb
    },
    {
      title: "National Celebration Activities",
      desc: "Observing benchmark innovation days including National Innovation Day, World IP Day, and National Start-up Day.",
      icon: Calendar
    },
    {
      title: "Idea Competitions & Hackathons",
      desc: "Inter-college innovation challenges encouraging students to pitch, validate, and refine impactful solutions.",
      icon: Sparkles
    },
    {
      title: "Industry & Mentor Networking",
      desc: "Direct roundtables connecting students with venture capitalists, successful angel investors, and startup mentors.",
      icon: Users
    },
    {
      title: "Incubation & Pre-Incubation Support",
      desc: "Providing seed mentoring, workspace infrastructure, and legal compliance guidance for campus enterprises.",
      icon: Building2
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
                Ministry of Education's Innovation Cell (MIC)
              </span>
              <span className="bg-amber-50 text-amber-800 badge-universal px-3 py-1 rounded-md">
                Govt. of India Initiative
              </span>
            </div>

            <h1 className="head-universal">
              Institution's Innovation Council (IIC)
            </h1>

            <p className="body-universal">
              The Institution's Innovation Council (IIC) at St. Philomena's College (Autonomous), Mysuru was established in alignment with the guidelines of the Ministry of Education's Innovation Cell (MIC), Government of India, to foster a vibrant ecosystem of innovation, ideation, entrepreneurship, and start-up creation.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <a
              href="/assets/documents/iic/Institution-Innovation-Council-IIC-2025-26.pdf"
              download="Institution-Innovation-Council-IIC-2025-26.pdf"
              className="btn-gold px-6 py-3 rounded-xl text-sm font-bold text-center flex items-center justify-center space-x-2 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download IIC Council Roster</span>
            </a>

            <a
              href="/assets/documents/iic/IIC-EstablismentCertificate.pdf"
              download="IIC-Establishment-Certificate.pdf"
              className="px-6 py-3 bg-[#0B1F4E] hover:bg-[#1C5496] text-white rounded-xl text-sm font-bold text-center flex items-center justify-center space-x-2 transition-colors cursor-pointer"
            >
              <Award className="w-4 h-4 text-[#FFD84A]" />
              <span>MoE Establishment Certificate</span>
            </a>
          </div>
        </div>

        {/* 2. Institutional Mandate & Context */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="subhead-universal">
            About the Ministry of Education's Innovation Council (IIC)
          </h2>
          <p className="body-universal">
            The Institution’s Innovation Council (IIC) is an initiative launched by the Ministry of Education’s Innovation Cell (MIC), Government of India in the year 2018, with the objective of systematically fostering the culture of innovation, entrepreneurship, and start-up ecosystems in Higher Educational Institutions (HEIs).
          </p>
          <p className="body-universal">
            The IIC framework mandates institutions to create a structured body within the campus to encourage idea generation, prototype development, innovation-based learning, start-up support, and IPR awareness among students and faculty.
          </p>
        </div>

        {/* 3. Key Objectives */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Strategic Vision</span>
              <h3 className="font-serif font-bold text-xl text-slate-900">Core Objectives & Mission</h3>
            </div>
            <Target className="w-6 h-6 text-[#C9A84C]" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {objectives.map((obj, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-[#1C5496] shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{obj}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 4. Strategic Initiatives Grid */}
        <div className="space-y-4">
          <div>
            <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Annual Calendar</span>
            <h3 className="font-serif font-bold text-2xl text-slate-900">Key Strategic Initiatives</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {initiatives.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="p-6 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3 flex flex-col justify-between hover:shadow-md transition-shadow">
                  <div className="space-y-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1C5496] flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <h4 className="font-serif font-bold text-base text-slate-900">{item.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. Leadership: Convenor Spotlight & Event Image */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Convenor Card */}
          <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 flex flex-col items-center text-center">
            <div className="relative">
              <img
                src="/assets/images/iic/dr-divyashree-iic-convenor.jpg"
                alt="Dr. Divyashree N"
                className="w-36 h-36 rounded-full object-cover border-4 border-[#1C5496] shadow-md"
              />
              <span className="absolute bottom-1 right-1 bg-[#FFD84A] text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded-full border border-slate-800 font-mono">
                Convenor
              </span>
            </div>

            <div className="space-y-1">
              <h4 className="font-serif font-bold text-lg text-slate-900">Dr. Divyashree N</h4>
              <p className="text-xs text-[#1C5496] font-bold">IIC Convenor</p>
              <p className="text-[11px] text-slate-500 font-mono">St. Philomena's College (Autonomous)</p>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
              Coordinating institutional innovation councils, MIC calendar activities, startup mentoring, and hackathons across science, humanities, and business faculties.
            </p>
          </div>

          {/* Event Showcase Card */}
          <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs flex flex-col">
            <div className="aspect-[16/9] sm:aspect-[21/9] bg-slate-900 relative overflow-hidden">
              <img
                src="/assets/images/iic/iic-inauguration-event.jpg"
                alt="IIC Campus Innovation Event"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 bg-[#071A33]/90 backdrop-blur-xs text-[#FFD84A] text-[11px] font-bold px-3 py-1 rounded-md border border-[#FFD84A]/30">
                IIC Flagship Innovation Event
              </div>
            </div>

            <div className="p-6 space-y-2">
              <h4 className="font-serif font-bold text-lg text-slate-900">
                Institution's Innovation Council Inaugural Assembly & Student Ideation Session
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Empowering budding entrepreneurs, student researchers, and faculty inventors with institutional incubation infrastructure, IP advisory, and government startup grant linkages.
              </p>
            </div>
          </div>

        </div>

        {/* 6. Embedded Full Document Viewer */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Statutory Compliance</span>
              <h3 className="font-serif font-bold text-xl text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-[#1C5496]" />
                <span>Interactive IIC Document Viewer: <span className="text-[#1C5496]">{selectedPdf.title}</span></span>
              </h3>
            </div>
            <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
              Full Document View
            </span>
          </div>

          <PDFViewerEmbed
            src={selectedPdf.url}
            title={selectedPdf.title}
            height="850px"
            badge={selectedPdf.badge}
          />
        </div>

        {/* 7. Official Document Selector Grid */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-5">
          <div className="border-b border-slate-200 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-serif font-bold text-xl text-slate-900">Official IIC Documents & Certifications</h3>
              <p className="text-xs text-slate-500">Click to view in document viewer or download locally.</p>
            </div>
            <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-xs px-3 py-1 rounded-md">
              {iicDocuments.length} Verified Files
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {iicDocuments.map((doc, idx) => {
              const isCurrent = selectedPdf.url === doc.path;
              return (
                <div 
                  key={idx} 
                  className={`p-5 rounded-xl border transition-all flex flex-col justify-between space-y-3 ${
                    isCurrent ? 'bg-blue-50/80 border-[#1C5496]' : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#1C5496] tracking-wider">{doc.badge}</span>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-slate-900 leading-snug">{doc.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed font-sans">{doc.desc}</p>
                  </div>

                  <div className="flex items-center space-x-2 pt-2 border-t border-slate-200/60">
                    <button
                      onClick={() => setSelectedPdf({ title: doc.title, url: doc.path, badge: doc.badge })}
                      className="px-3 py-1.5 bg-[#0B1F4E] hover:bg-[#1C5496] text-white rounded-lg text-xs font-bold flex items-center space-x-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>View in Viewer</span>
                    </button>
                    <a
                      href={doc.path}
                      download
                      className="px-3 py-1.5 bg-[#FFD84A] hover:bg-[#ffcd1f] text-slate-900 rounded-lg text-xs font-bold flex items-center space-x-1 shadow-2xs cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5 text-slate-900" />
                      <span>Download PDF</span>
                    </a>
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
