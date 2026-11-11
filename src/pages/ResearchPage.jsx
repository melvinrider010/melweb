import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { 
  BookOpen, 
  ShieldCheck, 
  Award, 
  FileText, 
  ExternalLink, 
  FlaskConical, 
  Building2, 
  Sparkles, 
  Download, 
  CheckCircle2, 
  ArrowRight,
  Lightbulb,
  Globe2,
  Cpu
} from 'lucide-react';
import { animatePageIn } from '../animations/pageTransitions';

export default function ResearchPage() {
  const containerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Tab IDs: 'rdc', 'projects', 'patents', 'iic', 'mou', 'facilities'
  const [activeTab, setActiveTab] = useState('rdc');

  useEffect(() => {
    animatePageIn(containerRef);
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const path = location.pathname.toLowerCase();

    if (tabParam) {
      setActiveTab(tabParam);
    } else if (path.includes('major-research') || path.includes('project')) {
      setActiveTab('projects');
    } else if (path.includes('patent') || path.includes('publication')) {
      setActiveTab('patents');
    } else if (path.includes('mou') || path.includes('collab')) {
      setActiveTab('mou');
    } else if (path.includes('research-development-cell') || path.includes('rdc') || path.includes('rd-cell')) {
      setActiveTab('rdc');
    } else if (path.includes('iic') || path.includes('innovation')) {
      setActiveTab('iic');
    } else if (path.includes('facilit') || path.includes('lab') || path.includes('instrument')) {
      setActiveTab('facilities');
    } else {
      setActiveTab('rdc');
    }
  }, [location.pathname, searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tabs = [
    { id: 'rdc', label: 'Research Cell (RDC)', icon: BookOpen },
    { id: 'projects', label: 'Major & Minor Projects', icon: FlaskConical },
    { id: 'patents', label: 'Patents & Publications', icon: Award },
    { id: 'iic', label: 'Innovation Council (IIC)', icon: Lightbulb },
    { id: 'mou', label: 'MOUs & Collaborations', icon: Globe2 },
    { id: 'facilities', label: 'Instrumentation & Labs', icon: Cpu }
  ];

  return (
    <div ref={containerRef} className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 space-y-8 text-[#071A33]">
      
      {/* INSTITUTIONAL HERO HEADER */}
      <div className="bg-[#071A33] text-white rounded-2xl p-6 sm:p-10 border-l-8 border-[#FFC928] shadow-xl relative overflow-hidden">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD84A]" />
            <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest">
              Scholarly Exploration & Innovation
            </span>
          </div>
          <h1 className="font-heading font-bold text-2xl sm:text-3xl text-white tracking-tight">
            Research & Innovation Portal
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            St. Philomena's College fosters advanced interdisciplinary research, doctoral guidance, patent registrations, and startup incubation supported by UGC, DST, VGST, and MoE Innovation Cell.
          </p>
        </div>
      </div>

      {/* HORIZONTAL INTERACTIVE NAVIGATION TABS */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-1.5 shadow-md">
        <div className="flex overflow-x-auto gap-1.5 no-scrollbar py-0.5">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap flex items-center space-x-2 transition-all shrink-0 ${
                  isActive
                    ? 'bg-[#1C5496] text-white shadow-sm'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-[#1C5496]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FFD84A]' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* DYNAMIC TAB PANELS */}
      <div className="transition-all duration-300">
        
        {/* 1. RDC TAB */}
        {activeTab === 'rdc' && (
          <div className="space-y-8 animate-fadeIn">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <span className="bg-blue-50 text-[#1C5496] font-semibold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                  Governance & Advisory
                </span>
                <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">
                  Research & Development Cell (RDC)
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  The Research & Development Cell coordinates institutional seed money grants, facilitates extramural research funding applications, enforces research ethics and anti-plagiarism norms, and publishes academic output across peer-reviewed platforms.
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <a
                    href="/assets/documents/research/research-development-cell-policy.pdf"
                    download
                    className="btn-primary-blue px-4 py-2 text-xs font-bold rounded-lg inline-flex items-center shadow-xs"
                  >
                    <Download className="w-3.5 h-3.5 mr-2" />
                    <span>Download RDC Policy Guidelines (PDF)</span>
                  </a>
                  <Link
                    to="/faculty"
                    className="btn-gold px-4 py-2 text-xs font-bold rounded-lg inline-flex items-center shadow-xs"
                  >
                    <span>View Faculty Research Profiles →</span>
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-4 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-3">
                <h3 className="font-heading font-semibold text-sm text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2">
                  RDC Focus Areas
                </h3>
                <ul className="space-y-2 text-xs text-slate-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1C5496] shrink-0 mt-0.5" />
                    <span>Seed funding for young faculty investigations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1C5496] shrink-0 mt-0.5" />
                    <span>Plagiarism check via Turnitin & Urkund</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1C5496] shrink-0 mt-0.5" />
                    <span>Ethical clearance committee (IEC)</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-[#1C5496] shrink-0 mt-0.5" />
                    <span>Annual institutional research stipend awards</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* 2. PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">Major & Minor Research Projects</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                High-impact scientific and socioeconomic investigations sponsored by national funding bodies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="bg-amber-100 text-amber-900 font-bold text-[10px] px-2.5 py-0.5 rounded">UGC Funded Major Project</span>
                <h3 className="font-heading font-semibold text-card text-slate-900">Nanomaterials for Solar Energy Conversion</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Synthesis of hybrid nano-photocatalysts for renewable green energy capture and water purification.</p>
                <div className="text-[11px] font-semibold text-[#1C5496] pt-2 border-t border-slate-100">
                  Principal Investigator: Dept. of Physics & Chemistry
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="bg-blue-100 text-[#1C5496] font-bold text-[10px] px-2.5 py-0.5 rounded">DST-SERB Project</span>
                <h3 className="font-heading font-semibold text-card text-slate-900">Bioactive Plant Metabolite Screening</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Pharmacological profiling of endemic Western Ghats flora for anti-inflammatory and microbial therapies.</p>
                <div className="text-[11px] font-semibold text-[#1C5496] pt-2 border-t border-slate-100">
                  Principal Investigator: Dept. of Biotechnology
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <span className="bg-green-100 text-green-900 font-bold text-[10px] px-2.5 py-0.5 rounded">ICSSR Grant</span>
                <h3 className="font-heading font-semibold text-card text-slate-900">Tribal Livelihood in Mysuru District</h3>
                <p className="text-xs text-slate-600 leading-relaxed">Socioeconomic impact assessment of government welfare schemes among indigenous communities.</p>
                <div className="text-[11px] font-semibold text-[#1C5496] pt-2 border-t border-slate-100">
                  Principal Investigator: Dept. of Social Work (MSW)
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. PATENTS & PUBLICATIONS TAB */}
        {activeTab === 'patents' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">Patents & Indexed Publications</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Intellectual property portfolio and peer-reviewed articles published in Scopus, Web of Science, and UGC CARE listed journals.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#FFC928]" />
                  <h3 className="font-heading font-semibold text-card text-slate-900">Published Patents</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Faculty and student innovators hold multiple patents in smart environmental sensors, automated food safety analysis, and chemical extraction techniques.
                </p>
                <ul className="space-y-2 text-xs text-slate-700 pt-2 border-t border-slate-100">
                  <li className="font-medium">· Indian Patent App No. 202341058291: Automated Water Purity Sensor</li>
                  <li className="font-medium">· Indian Patent App No. 202241031940: Herbal Food Preservative Formulation</li>
                </ul>
              </div>

              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-[#1C5496]" />
                  <h3 className="font-heading font-semibold text-card text-slate-900">Journal Publications</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Over 150+ research papers published in indexed international journals with average impact factors exceeding 3.5 across disciplines.
                </p>
                <div className="pt-2 border-t border-slate-100 flex gap-2">
                  <Link to="/resources" className="text-xs font-semibold text-[#1C5496] hover:underline flex items-center">
                    <span>Access Digital Library Databases →</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. IIC TAB */}
        {activeTab === 'iic' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-md uppercase">
                  MoE Innovation Cell (MIC)
                </span>
                <span className="text-xs font-semibold text-[#1C5496]">Star Rating Accredited</span>
              </div>
              <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">
                Institution's Innovation Council (IIC)
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                St. Philomena's IIC was established under the mandate of Ministry of Education (MoE), Government of India, to systematically foster the culture of Innovation and startup entrepreneurship among collegiate youth.
              </p>
              <div className="pt-2 flex gap-3">
                <Link to="/iic" className="btn-primary-blue px-4 py-2 text-xs font-semibold rounded-lg inline-block">
                  Visit Dedicated IIC Page →
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* 5. MOU TAB */}
        {activeTab === 'mou' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">Academic & Industry MOUs</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Strategic institutional linkages for collaborative research, faculty exchange, student internships, and curriculum benchmarking.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-semibold text-[#1C5496] uppercase">Research Institute Partner</span>
                <h4 className="font-heading font-semibold text-sm sm:text-base text-slate-900">CSIR-CFTRI, Mysuru</h4>
                <p className="text-xs text-slate-600">Joint project mentorship, food chemistry research internships, and analytical instrument usage.</p>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] font-semibold text-[#1C5496] uppercase">Industry Linkage</span>
                <h4 className="font-heading font-semibold text-sm sm:text-base text-slate-900">Infosys BPM & L&T Technology</h4>
                <p className="text-xs text-slate-600">Corporate skill enablement, data analytics internships, and campus placement drives.</p>
              </div>
            </div>
          </div>
        )}

        {/* 6. FACILITIES TAB */}
        {activeTab === 'facilities' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900">Central Instrumentation & Labs</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Cutting-edge analytical instruments and research cubicles available to student scholars and doctoral researchers.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="aspect-video bg-slate-100">
                  <img src="/assets/images/facilities/academics_science_lab.jpg" alt="Spectroscopy Lab" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-heading font-semibold text-sm sm:text-base text-slate-900">UV-Vis Spectrophotometer Lab</h4>
                  <p className="text-xs text-slate-600">High-precision optical density and chemical absorption profiling.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="aspect-video bg-slate-100">
                  <img src="/assets/images/facilities/academic_lab.jpg" alt="Biotech Lab" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-heading font-semibold text-sm sm:text-base text-slate-900">Plant Tissue Culture Facility</h4>
                  <p className="text-xs text-slate-600">Laminar airflow benches and controlled climate micropropagation chambers.</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
                <div className="aspect-video bg-slate-100">
                  <img src="/assets/images/facilities/research_conference_hall.jpg" alt="Computing Lab" className="w-full h-full object-cover" />
                </div>
                <div className="p-4 space-y-1">
                  <h4 className="font-heading font-semibold text-sm sm:text-base text-slate-900">High Performance Computing (HPC)</h4>
                  <p className="text-xs text-slate-600">Dedicated compute workstations for simulation and machine learning modeling.</p>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
