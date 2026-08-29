import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useLocation, Link } from 'react-router-dom';
import { 
  History, 
  Heart, 
  Shield, 
  Users, 
  GraduationCap, 
  Building, 
  Network, 
  FileText, 
  MessageSquare, 
  Award, 
  CheckCircle2, 
  ArrowRight,
  BookOpen,
  Calendar,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import aboutData from '../data/aboutData.json';
import { animatePageIn } from '../animations/pageTransitions';

export default function AboutPage() {
  const containerRef = useRef(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const location = useLocation();

  // Tab IDs: 'history', 'vision', 'coat-of-arms', 'bishops', 'principals', 'mdes', 'organogram', 'governing-body', 'leadership'
  const [activeTab, setActiveTab] = useState('history');

  useEffect(() => {
    animatePageIn(containerRef);
  }, []);

  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const path = location.pathname.toLowerCase();

    if (tabParam) {
      setActiveTab(tabParam);
    } else if (path.includes('vision') || path.includes('mission')) {
      setActiveTab('vision');
    } else if (path.includes('coat-of-arms') || path.includes('motto') || path.includes('crest')) {
      setActiveTab('coat-of-arms');
    } else if (path.includes('bishop')) {
      setActiveTab('bishops');
    } else if (path.includes('former-principals') || path.includes('roster')) {
      setActiveTab('principals');
    } else if (path.includes('mdes') || path.includes('admin')) {
      setActiveTab('mdes');
    } else if (path.includes('organogram')) {
      setActiveTab('organogram');
    } else if (path.includes('governing') || path.includes('statutory')) {
      setActiveTab('governing-body');
    } else if (path.includes('rector') || path.includes('principals-message') || path.includes('leadership')) {
      setActiveTab('leadership');
    } else {
      setActiveTab('history');
    }
  }, [location.pathname, searchParams]);

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchParams({ tab: tabId });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navTabs = [
    { id: 'history', label: 'History & Heritage', icon: History, short: 'History' },
    { id: 'vision', label: 'Vision & Mission', icon: Heart, short: 'Vision & Mission' },
    { id: 'coat-of-arms', label: 'Coat of Arms', icon: Shield, short: 'Coat of Arms' },
    { id: 'bishops', label: 'Former Bishops', icon: Award, short: 'Former Bishops' },
    { id: 'principals', label: 'Former Principals', icon: GraduationCap, short: 'Former Principals' },
    { id: 'mdes', label: 'MDES Society', icon: Building, short: 'MDES' },
    { id: 'organogram', label: 'Organogram', icon: Network, short: 'Organogram' },
    { id: 'governing-body', label: 'Governing Body', icon: FileText, short: 'Governing Body' },
    { id: 'leadership', label: 'Leadership Messages', icon: MessageSquare, short: 'Messages' }
  ];

  return (
    <div ref={containerRef} className="max-w-[1400px] mx-auto px-4 sm:px-8 py-10 space-y-8 text-[#071A33]">
      
      {/* INSTITUTIONAL HERO HEADER */}
      <div className="bg-[#071A33] text-white rounded-2xl p-6 sm:p-10 border-l-8 border-[#FFC928] shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-900/30 to-transparent pointer-events-none" />
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#FFD84A]" />
            <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest">
              Institutional Heritage · Est. 1946
            </span>
          </div>
          <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-white tracking-tight">
            About St. Philomena's College
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            A premier UGC Autonomous Catholic minority institution managed by the Mysore Diocesan Educational Society (MDES), affiliated with the University of Mysore, and re-accredited by NAAC with Cycle III Grade B++.
          </p>
        </div>
      </div>

      {/* HORIZONTAL INTERACTIVE NAVIGATION TABS */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-xl p-1.5 shadow-md">
        <div className="flex overflow-x-auto gap-1.5 no-scrollbar py-0.5">
          {navTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-xs font-bold whitespace-nowrap flex items-center space-x-2 transition-all shrink-0 ${
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

      {/* DYNAMIC TAB CONTENT PANELS */}
      <div className="transition-all duration-300">

        {/* 1. HISTORY & HERITAGE TAB */}
        {activeTab === 'history' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Story Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <span className="bg-blue-50 text-[#1C5496] font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                  Our Founding Story
                </span>
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900 leading-snug">
                  A Bishop’s Dream & A Maharaja’s Munificence
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  On <strong>October 9, 1946</strong>, St. Philomena's College was established in the royal city of Mysuru. <strong>His Excellency Most Rev. Dr. Rene Feuga</strong>, the first Bishop of Mysore, magnanimously vacated his own episcopal mansion to accommodate classrooms for the pioneering batch of 380 Philomenites.
                </p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  The College was declared open by <strong>His Highness Sri Jayachamarajendra Wodeyar</strong>, the Maharaja of Mysore—a rare honour and historic milestone as the very first private First Grade Science Degree College in the erstwhile Mysore Region.
                </p>
              </div>

              <div className="lg:col-span-5 space-y-3">
                <div className="rounded-xl overflow-hidden shadow-md border border-slate-200 aspect-[4/3] relative">
                  <img
                    src="/assets/images/campus/intro_heritage_building.jpg"
                    alt="Heritage Building St. Philomena's"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent flex items-end p-4">
                    <p className="text-xs font-bold text-[#FFD84A]">Historic Quadrangle Academic Block · Established 1946</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Milestones Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-slate-900">78+ Years of Academic Milestones</h3>
                <p className="text-xs text-slate-500">Key historical epochs shaping the evolution of St. Philomena's College.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-serif font-extrabold text-2xl text-[#1C5496] block">1946</span>
                  <h4 className="font-serif font-bold text-sm text-slate-900">Foundation & Inauguration</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Inaugurated by Maharaja Sri Jayachamarajendra Wodeyar and Bishop Rene Feuga as the first private degree science college in Mysore.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-serif font-extrabold text-2xl text-[#1C5496] block">2004</span>
                  <h4 className="font-serif font-bold text-sm text-slate-900">NAAC A+ Accreditation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Recognized with A+ Grade in Cycle I Accreditation by the National Assessment and Accreditation Council (NAAC).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-serif font-extrabold text-2xl text-[#1C5496] block">2011</span>
                  <h4 className="font-serif font-bold text-sm text-slate-900">UGC Autonomous Status</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Conferred Autonomous Status by the University Grants Commission, empowering curricular innovation and choice-based credit degrees.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-serif font-extrabold text-2xl text-[#1C5496] block">2026+</span>
                  <h4 className="font-serif font-bold text-sm text-slate-900">NEP & Research Innovation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Over 25 UG and 14 PG programmes, interdisciplinary science laboratories, and MoE Star-Rated Innovation Council.
                  </p>
                </div>
              </div>
            </div>

            {/* Illustrious Faculty Pioneers */}
            <div className="bg-slate-900 text-white rounded-2xl p-6 sm:p-8 space-y-4">
              <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest">Pioneering Faculty</span>
              <h3 className="font-serif font-bold text-xl text-white">Stalwarts Who Shaped Our Legacy</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-4xl">
                All through her fledgling years, the college’s future was shaped by educators of global renown. Among them were the doyen of modern Kannada literature <strong>Prof. Gopalakrishna Adiga</strong>, renowned space scientist and former ISRO Chairman <strong>Prof. U.R. Rao</strong>, and a distinguished galaxy of scholars.
              </p>
            </div>

          </div>
        )}

        {/* 2. VISION & MISSION TAB */}
        {activeTab === 'vision' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Vision & Mission Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Vision Card */}
              <div className="bg-white rounded-2xl border-t-4 border-t-[#FFC928] border border-slate-200 p-8 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Heart className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-600 uppercase tracking-widest block">Guiding Light</span>
                  <h3 className="font-serif font-extrabold text-2xl text-slate-900 mt-1">Our Institutional Vision</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100 italic">
                  "{aboutData.vision}"
                </p>
                <div className="pt-2">
                  <span className="text-xs font-bold text-[#1C5496] uppercase tracking-wider block mb-1">Motto</span>
                  <p className="font-serif font-bold text-base text-slate-900">Caritas et Scientia (Love in Knowledge)</p>
                </div>
              </div>

              {/* Mission Card */}
              <div className="bg-white rounded-2xl border-t-4 border-t-[#1C5496] border border-slate-200 p-8 shadow-xs space-y-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#1C5496] flex items-center justify-center">
                  <Award className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs font-bold text-[#1C5496] uppercase tracking-widest block">Core Purpose</span>
                  <h3 className="font-serif font-extrabold text-2xl text-slate-900 mt-1">Our Mission Statement</h3>
                </div>
                <ul className="space-y-2.5">
                  {aboutData.mission.map((item, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#1C5496] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Core Values Grid */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-slate-900">Our Core Institutional Values</h3>
                <p className="text-xs text-slate-500">The enduring pillars that guide every Philomenite educator, researcher, and graduate.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aboutData.coreValues.map((val, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-[#1C5496] transition-colors">
                    <span className="font-serif font-bold text-sm text-[#1C5496] block">{val.title}</span>
                    <p className="text-xs text-slate-600 leading-relaxed">{val.desc}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 3. COAT OF ARMS TAB */}
        {activeTab === 'coat-of-arms' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-4 flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-4">
                <img
                  src={aboutData.coatOfArms.image}
                  alt="St. Philomena's Official Crest"
                  className="h-44 w-auto object-contain drop-shadow-md"
                />
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">The College Crest</h3>
                  <p className="text-xs text-[#1C5496] font-bold tracking-widest uppercase">Caritas in Scientia</p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-4">
                <span className="bg-amber-100 text-amber-900 font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                  Heraldic Seal & Maxim
                </span>
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">
                  {aboutData.coatOfArms.motto}
                </h2>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                  {aboutData.coatOfArms.history}
                </p>
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 leading-relaxed">
                  <strong>Papal Maxim Meaning:</strong> {aboutData.coatOfArms.mottoMeaning}
                </div>
              </div>

            </div>

            {/* Heraldic Elements Breakdown */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-slate-900">Symbolism of the Crest</h3>
                <p className="text-xs text-slate-500">The profound meaning behind each heraldic icon in our institutional emblem.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData.coatOfArms.symbols.map((sym, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5 flex items-start space-x-3">
                    <span className="w-8 h-8 rounded-lg bg-[#1C5496] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      0{idx + 1}
                    </span>
                    <div>
                      <h4 className="font-serif font-bold text-sm text-slate-900">{sym.symbol}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed">{sym.meaning}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 4. FORMER BISHOPS OF MYSORE TAB */}
        {activeTab === 'bishops' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-serif font-extrabold text-2xl text-slate-900">Patron Bishops of Mysore</h2>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Official Source: stphilos.ac.in/former-bishops
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                The episcopal leadership and Patron Bishops of Mysore who founded and nurtured St. Philomena's College across generations.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutData.bishops.map((bishop, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={bishop.image}
                        alt={bishop.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#1C5496] shadow-sm shrink-0 bg-slate-100"
                        onError={(e) => { e.target.src = "/assets/images/campus/intro_heritage_building.jpg"; }}
                      />
                      <div>
                        <span className="bg-blue-50 text-[#1C5496] text-[11px] font-bold px-2.5 py-0.5 rounded font-mono">
                          {bishop.tenure}
                        </span>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 mt-1">{bishop.name}</h3>
                        <p className="text-xs text-[#D4AF37] font-bold">{bishop.role}</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                      {bishop.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 5. FORMER PRINCIPALS TAB */}
        {activeTab === 'principals' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-serif font-extrabold text-2xl text-slate-900">Former Principals Roster</h2>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Official Source: stphilos.ac.in/about-us-2/principles
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                A historical roll of honour of the distinguished educators and administrators who served as Principal of St. Philomena's College from 1946 to present.
              </p>
            </div>

            {/* Grid of Former Principals with Official Historical Portraits */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {aboutData.principals.map((p, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col">
                  <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5 bg-[#071A33]/90 text-[#FFD84A] text-[10px] font-mono font-bold px-2 py-0.5 rounded border border-[#FFD84A]/30">
                      {p.tenure}
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif font-bold text-base text-slate-900 leading-snug">{p.name}</h4>
                      <p className="text-xs text-[#1C5496] font-semibold pt-0.5">Principal · {p.tenure}</p>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-slate-100 line-clamp-3">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Complete Chronological Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs mt-6">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-serif font-bold text-base text-slate-900">Chronological Succession List</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#071A33] text-white">
                      <th className="p-3.5 font-bold uppercase tracking-wider">Sl. No.</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Name of the Principal</th>
                      <th className="p-3.5 font-bold uppercase tracking-wider">Tenure of Office</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {aboutData.principals.map((p, idx) => (
                      <tr key={idx} className="hover:bg-slate-50 transition-colors">
                        <td className="p-3.5 font-mono font-bold text-[#1C5496]">{p.num}</td>
                        <td className="p-3.5 font-serif font-bold text-slate-900 text-sm">{p.name}</td>
                        <td className="p-3.5 font-semibold text-slate-800">
                          <span className="bg-blue-50 text-[#1C5496] px-2.5 py-1 rounded-md text-[11px] font-bold font-mono">
                            {p.tenure}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* 6. MDES SOCIETY TAB */}
        {activeTab === 'mdes' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="bg-blue-50 text-[#1C5496] font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                  Governing Society
                </span>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Official Source: stphilos.ac.in/about-us-2/mdes
                </span>
              </div>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">
                {aboutData.mdes.title}
              </h2>
              <p className="text-xs font-mono text-slate-500 font-semibold">{aboutData.mdes.regNo}</p>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                {aboutData.mdes.description}
              </p>
            </div>

            {/* MDES Key Office Bearers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-[#1C5496] uppercase tracking-wider">President</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">{aboutData.mdes.president}</h4>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-[#1C5496] uppercase tracking-wider">Vice President</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">{aboutData.mdes.vicePresident}</h4>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-[#1C5496] uppercase tracking-wider">Secretary</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">{aboutData.mdes.secretary}</h4>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-[#1C5496] uppercase tracking-wider">Treasurer</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">{aboutData.mdes.treasurer}</h4>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-slate-900">Society Objectives & Mission</h3>
                <p className="text-xs text-slate-500">Core guiding principles governing all 130 MDES educational institutions.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {aboutData.mdes.objectives.map((obj, idx) => (
                  <div key={idx} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start space-x-3">
                    <CheckCircle2 className="w-5 h-5 text-[#1C5496] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 7. ORGANOGRAM TAB */}
        {activeTab === 'organogram' && (
          <div className="space-y-8 animate-fadeIn">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h2 className="font-serif font-extrabold text-2xl text-slate-900">Institutional Governance Organogram</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                Hierarchical administrative flowchart and governance structure of St. Philomena's College (Autonomous).
              </p>
            </div>

            {/* Hierarchical Organogram Visual Structure */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6 text-center">
              
              {/* Level 1: President & MDES */}
              <div className="max-w-md mx-auto p-4 bg-[#071A33] text-white rounded-xl shadow-md space-y-1">
                <span className="text-[10px] text-[#FFD84A] font-bold uppercase tracking-wider">Apex Governance</span>
                <h4 className="font-serif font-bold text-sm sm:text-base">Bishop of Mysore & President, MDES</h4>
                <p className="text-[11px] text-slate-300 font-medium">Most Rev. Dr. Francis Serrao SJ</p>
              </div>

              <div className="w-0.5 h-6 bg-[#1C5496] mx-auto" />

              {/* Level 2: Rector, Secretary & Governing Body */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                <div className="p-4 bg-blue-900 text-white rounded-xl shadow-xs space-y-0.5">
                  <span className="text-[10px] text-blue-200 font-bold uppercase">Executive Management</span>
                  <h4 className="font-serif font-bold text-sm">Secretary, MDES</h4>
                  <p className="text-[11px] text-blue-100">Rev. Fr. Edward William Saldanha</p>
                </div>
                <div className="p-4 bg-blue-900 text-white rounded-xl shadow-xs space-y-0.5">
                  <span className="text-[10px] text-blue-200 font-bold uppercase">Campus Leadership</span>
                  <h4 className="font-serif font-bold text-sm">Rector & Manager</h4>
                  <p className="text-[11px] text-blue-100">Rev. Dr. Lourdu Prasad Joseph</p>
                </div>
                <div className="p-4 bg-blue-900 text-white rounded-xl shadow-xs space-y-0.5">
                  <span className="text-[10px] text-blue-200 font-bold uppercase">Statutory Council</span>
                  <h4 className="font-serif font-bold text-sm">Governing Body</h4>
                  <p className="text-[11px] text-blue-100">UGC, Govt & UoM Nominees</p>
                </div>
              </div>

              <div className="w-0.5 h-6 bg-[#1C5496] mx-auto" />

              {/* Level 3: Principal & Executive Head */}
              <div className="max-w-md mx-auto p-4 bg-[#1C5496] text-white rounded-xl shadow-md space-y-1">
                <span className="text-[10px] text-[#FFD84A] font-bold uppercase tracking-wider">Executive Academic Head</span>
                <h4 className="font-serif font-bold text-sm sm:text-base">Principal</h4>
                <p className="text-[11px] text-blue-100">Dr. Ravi J.D. Saldanha</p>
              </div>

              <div className="w-0.5 h-6 bg-[#1C5496] mx-auto" />

              {/* Level 4: Academic & Administrative Sub-Wings */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-left">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-serif font-bold text-xs text-[#1C5496] uppercase">Financial Officer</h5>
                  <p className="text-[11px] font-bold text-slate-800">Rev. Fr. Roshan</p>
                  <p className="text-[10px] text-slate-500">Financial administration, budgets & institutional audits.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-serif font-bold text-xs text-[#1C5496] uppercase">Dean, Academic Affairs</h5>
                  <p className="text-[11px] font-bold text-slate-800">Prof. Anand C</p>
                  <p className="text-[10px] text-slate-500">Academic council, curricula design, NEP regulations & HODs.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-serif font-bold text-xs text-[#1C5496] uppercase">Vice Principal</h5>
                  <p className="text-[11px] font-bold text-slate-800">Mr. Ronald Prakash Cutinha</p>
                  <p className="text-[10px] text-slate-500">Campus administration, student affairs, examinations & operations.</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                  <h5 className="font-serif font-bold text-xs text-[#1C5496] uppercase">IQAC Coordinator</h5>
                  <p className="text-[11px] font-bold text-slate-800">Mr. A Thomas Gunaseelan</p>
                  <p className="text-[10px] text-slate-500">Quality benchmarks, NAAC accreditation, NIRF ranking & audits.</p>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* 8. GOVERNING BODY TAB */}
        {activeTab === 'governing-body' && (
          <div className="space-y-6 animate-fadeIn">
            
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-serif font-extrabold text-2xl text-slate-900">Governing Body & Statutory Council</h2>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Official Source: stphilos.ac.in/statutory-bodies
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                The apex decision-making statutory board constituted under UGC Autonomous guidelines to oversee academic, infrastructural, and financial policies.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {aboutData.governingBody.map((member, idx) => (
                <div key={idx} className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs flex justify-between items-start gap-4">
                  <div className="space-y-1">
                    <span className="bg-blue-50 text-[#1C5496] font-bold text-[10px] px-2.5 py-0.5 rounded uppercase tracking-wider">
                      {member.role}
                    </span>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-slate-900">{member.name}</h3>
                    <p className="text-xs text-slate-600">{member.designation}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 9. LEADERSHIP & ADMINISTRATION TAB */}
        {activeTab === 'leadership' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <h2 className="font-serif font-extrabold text-2xl text-slate-900">Current Administration & Academic Heads</h2>
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider font-mono">
                  Official Source: stphilos.ac.in/administration
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-600">
                The executive leadership team guiding the day-to-day administration, academic governance, and institutional excellence at St. Philomena's College.
              </p>
            </div>

            {/* Current Administration Full Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {aboutData.administration.map((person, idx) => {
                // Determine custom object-position to preserve full head and face for portrait photos
                const objectPosition = 
                  person.id === 'sec-mdes' || person.name.toLowerCase().includes('edward')
                    ? '50% 0%'
                    : person.id === 'rector' || person.name.toLowerCase().includes('lourdu')
                    ? '50% 12%'
                    : person.id === 'principal' || person.name.toLowerCase().includes('ravi')
                    ? '50% 10%'
                    : person.id === 'finance-officer' || person.name.toLowerCase().includes('roshan')
                    ? '50% 15%'
                    : '50% 10%';

                return (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col">
                    <div className="aspect-[4/5] sm:aspect-[3/4] bg-slate-900 relative overflow-hidden">
                      <img
                        src={person.assetPath}
                        alt={person.name}
                        style={{ objectPosition }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-2.5 left-2.5 bg-[#071A33]/90 text-[#FFD84A] text-[10px] font-bold px-2 py-0.5 rounded border border-[#FFD84A]/30 uppercase">
                        {person.role}
                      </div>
                    </div>
                    <div className="p-5 space-y-1.5 flex-1 flex flex-col justify-between">
                      <div>
                        <h4 className="font-serif font-bold text-base text-slate-900 leading-snug">{person.name}</h4>
                        <p className="text-xs text-[#1C5496] font-bold pt-0.5">{person.designation}</p>
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-slate-100">
                        {person.biography}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Rector's Message */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <img
                  src={aboutData.leadershipMessages.rector.image}
                  alt={aboutData.leadershipMessages.rector.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#1C5496] shadow-sm"
                />
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">{aboutData.leadershipMessages.rector.name}</h3>
                  <p className="text-xs text-[#1C5496] font-bold">{aboutData.leadershipMessages.rector.title}</p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="bg-blue-50 text-[#1C5496] font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                    Office of the Rector & Manager
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">stphilos.ac.in/rectors-message-2</span>
                </div>
                <h2 className="font-serif font-extrabold text-2xl text-slate-900">
                  {aboutData.leadershipMessages.rector.salutation}
                </h2>
                <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {aboutData.leadershipMessages.rector.text.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* Principal's Message */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-4 flex flex-col items-center text-center p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                <img
                  src={aboutData.leadershipMessages.principal.image}
                  alt={aboutData.leadershipMessages.principal.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#FFC928] shadow-sm"
                />
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">{aboutData.leadershipMessages.principal.name}</h3>
                  <p className="text-xs text-amber-700 font-bold">{aboutData.leadershipMessages.principal.title}</p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="bg-amber-50 text-amber-800 font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                    Office of the Principal
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 font-mono">stphilos.ac.in/principals-message</span>
                </div>
                <h2 className="font-serif font-extrabold text-2xl text-slate-900">
                  {aboutData.leadershipMessages.principal.salutation}
                </h2>
                <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {aboutData.leadershipMessages.principal.text.map((p, idx) => (
                    <p key={idx}>{p}</p>
                  ))}
                </div>
              </div>
            </div>

          </div>
        )}

      </div>

    </div>
  );
}
