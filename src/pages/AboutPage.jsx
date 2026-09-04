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
import OrganogramView from '../components/about/OrganogramView';
import GoverningBodyView from '../components/about/GoverningBodyView';

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

      {/* 2-LINE BALANCED INTERACTIVE NAVIGATION TABS */}
      <div className="sticky top-20 z-30 bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl p-2 sm:p-2.5 shadow-md space-y-2">
        {/* Line 1: 5 Core Identity & Leadership Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-1.5 sm:gap-2">
          {navTabs.slice(0, 5).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 text-center cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1F4E] text-white shadow-sm ring-1 ring-[#0B1F4E]/20'
                    : 'bg-slate-50/90 text-slate-700 hover:bg-slate-100 hover:text-[#0B1F4E] border border-slate-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#FFD84A]' : 'text-slate-500'}`} />
                <span className="truncate">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Line 2: 4 Administration & Governance Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-1.5 sm:gap-2">
          {navTabs.slice(5).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center space-x-2 text-center cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1F4E] text-white shadow-sm ring-1 ring-[#0B1F4E]/20'
                    : 'bg-slate-50/90 text-slate-700 hover:bg-slate-100 hover:text-[#0B1F4E] border border-slate-200/70'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#FFD84A]' : 'text-slate-500'}`} />
                <span className="truncate">{tab.label}</span>
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
                <span className="bg-blue-50 text-[#0B1F4E] font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
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
                <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[4/3] sm:h-[340px] relative group bg-[#0B1F4E]">
                  <img
                    src="/assets/images/campus/intro_heritage_building.jpg"
                    alt="St. Philomena's College Historic Heritage Quadrangle Building (Est. 1946)"
                    className="w-full h-full object-cover object-bottom group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent flex flex-col justify-end p-4">
                    <p className="text-white font-serif font-bold text-sm">
                      St. Philomena's College
                    </p>
                    <p className="text-[#FFD84A] text-[10px] font-mono uppercase tracking-wider font-bold">
                      Historic Heritage Academic Block · Est. 1946
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Milestones Timeline */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-slate-900">{new Date().getFullYear() - 1946}+ Years of Academic Milestones</h3>
                <p className="text-xs text-slate-500">Key historical epochs shaping the evolution of St. Philomena's College.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-serif font-extrabold text-2xl text-[#0B1F4E] block">1946</span>
                  <h4 className="font-serif font-bold text-sm text-slate-900">Foundation & Inauguration</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Inaugurated by Maharaja Sri Jayachamarajendra Wodeyar and Bishop Rene Feuga as the first private degree science college in Mysore.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-serif font-extrabold text-2xl text-[#0B1F4E] block">2004</span>
                  <h4 className="font-serif font-bold text-sm text-slate-900">NAAC A+ Accreditation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Recognized with A+ Grade in Cycle I Accreditation by the National Assessment and Accreditation Council (NAAC).
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-serif font-extrabold text-2xl text-[#0B1F4E] block">2011</span>
                  <h4 className="font-serif font-bold text-sm text-slate-900">UGC Autonomous Status</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Conferred Autonomous Status by the University Grants Commission, empowering curricular innovation and choice-based credit degrees.
                  </p>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                  <span className="font-serif font-extrabold text-2xl text-[#0B1F4E] block">2026+</span>
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
            
            {/* 1. VISION SECTION (Institutional Navy Hero Banner) */}
            <div className="bg-[#0B1F4E] text-white rounded-2xl p-6 sm:p-10 shadow-lg border border-slate-800 relative overflow-hidden space-y-4">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/20 to-transparent pointer-events-none" />
              
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FFD84A]" />
                <span className="text-[#FFD84A] font-mono font-bold text-xs uppercase tracking-widest">
                  Guiding Institutional Light
                </span>
              </div>

              <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-[#F0D98C] tracking-tight">
                Vision
              </h2>

              <p className="text-sm sm:text-base lg:text-lg text-slate-100 font-sans font-medium leading-relaxed max-w-4xl pt-1">
                "The college is guided by the visionary zeal of providing value-based education to everyone irrespective of religion, caste, creed or sex by which the character is formed."
              </p>
            </div>

            {/* 2. MISSION SECTION (Clean White Institutional Block) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-sm space-y-6">
              
              <div className="border-b border-slate-100 pb-4 space-y-1.5">
                <div className="flex items-center space-x-2">
                  <Award className="w-5 h-5 text-[#0B1F4E]" />
                  <span className="text-xs font-bold text-[#0B1F4E] uppercase tracking-widest">Core Purpose</span>
                </div>
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">
                  Mission
                </h2>
              </div>

              <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-sans bg-slate-50 p-5 sm:p-6 rounded-xl border border-slate-200/80">
                At St. Philomena’s College, our mission is to holistically transform young men and women into intellectually curious, emotionally resilient, and socially responsible individuals. By fostering a dynamic learning environment where students live, learn, work, and play together, we nurture essential life skills, a spirit of unity, and a strong ethical foundation. Through disciplined inquiry, compassionate service, and unwavering integrity, we empower our students to emerge as leaders and changemakers—citizens committed to building a just, inclusive, and progressive society.
              </p>

              {/* Mission 4 Core Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 space-y-2">
                  <CheckCircle2 className="w-5 h-5 text-[#0B1F4E]" />
                  <h4 className="font-serif font-bold text-sm text-slate-900">Holistic Transformation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Nurturing intellectually curious, emotionally resilient, and socially conscious graduates.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-100 space-y-2">
                  <Users className="w-5 h-5 text-amber-700" />
                  <h4 className="font-serif font-bold text-sm text-slate-900">Collaborative Ecology</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A vibrant campus where students live, learn, work, and play together in unity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 space-y-2">
                  <Shield className="w-5 h-5 text-emerald-700" />
                  <h4 className="font-serif font-bold text-sm text-slate-900">Ethical Foundation</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Disciplined inquiry, compassionate community service, and unwavering integrity.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-purple-50/60 border border-purple-100 space-y-2">
                  <GraduationCap className="w-5 h-5 text-purple-700" />
                  <h4 className="font-serif font-bold text-sm text-slate-900">Global Leadership</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Empowering changemakers committed to building an inclusive and progressive society.
                  </p>
                </div>
              </div>

            </div>

            {/* 3. MOTTO SECTION */}
            <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#0B1F4E] uppercase tracking-wider block">
                  Institutional Motto
                </span>
                <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">
                  Motto
                </h3>
              </div>
              <div className="bg-[#0B1F4E] px-6 py-3.5 rounded-xl border border-[#C9A84C]/50 shadow-sm text-center">
                <span className="font-serif font-bold text-lg sm:text-xl text-[#F0D98C] tracking-wide">
                  "Caritas in Scientia"
                </span>
              </div>
            </div>

            {/* 4. CORE VALUES GRID */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="font-serif font-bold text-xl text-slate-900">Our Core Institutional Values</h3>
                <p className="text-xs text-slate-500">The enduring pillars that guide every Philomenite educator, researcher, and graduate.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aboutData.coreValues.map((val, idx) => (
                  <div key={idx} className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2 hover:border-[#0B1F4E] transition-colors">
                    <span className="font-serif font-bold text-sm text-[#0B1F4E] block">{val.title}</span>
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
              
              <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 sm:p-8 bg-slate-50/80 rounded-2xl border border-slate-200 text-center space-y-4">
                <div className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-center max-w-[320px]">
                  <img
                    src="/assets/images/about/coat_of_arms_hd.jpg"
                    alt="Official Coat of Arms of St. Philomena's College, Mysore"
                    className="w-full h-auto max-h-[320px] object-contain drop-shadow-sm hover:scale-103 transition-transform duration-300"
                    onError={(e) => { e.target.src = "/assets/images/about/coat_of_arms_hd.png"; }}
                  />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-slate-900">The College Crest</h3>
                  <p className="text-xs text-[#0B1F4E] font-mono font-bold tracking-widest uppercase">Caritas in Scientia</p>
                </div>
              </div>

              <div className="lg:col-span-7 space-y-4">
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
                    <span className="w-8 h-8 rounded-lg bg-[#0B1F4E] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
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
            
            {/* Official Page Banner & Introduction */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center space-x-2">
                <Award className="w-5 h-5 text-[#0B1F4E]" />
                <span className="text-xs font-bold text-[#0B1F4E] uppercase tracking-widest">Official Institutional Records</span>
              </div>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">Former Bishops of Mysore</h2>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                St. Philomena’s College, founded under the patronage of the Diocese of Mysore, stands at a defining epoch in its distinguished history. The legacy of the institution has been shaped and strengthened by the unwavering dedication of its Patron Bishops who have guided the College from its inception in 1946 through seven and a half decades of academic excellence.
              </p>
            </div>

            {/* Grid of Exact 5 Former Bishops from https://stphilos.ac.in/former-bishops/ */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aboutData.bishops.map((bishop, idx) => (
                <div key={idx} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between">
                  <div className="p-6 space-y-4">
                    <div className="flex items-center space-x-4">
                      <img
                        src={bishop.image}
                        alt={bishop.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-[#0B1F4E] shadow-sm shrink-0 bg-slate-100"
                        onError={(e) => { e.target.src = "/assets/images/campus/intro_heritage_building.jpg"; }}
                      />
                      <div>
                        <span className="bg-blue-50 text-[#0B1F4E] text-[11px] font-bold px-2.5 py-0.5 rounded font-mono">
                          {bishop.tenure}
                        </span>
                        <h3 className="font-serif font-bold text-base sm:text-lg text-slate-900 mt-1">{bishop.name}</h3>
                        <p className="text-xs text-[#D4AF37] font-bold">{bishop.role}</p>
                      </div>
                    </div>
                    
                    <p className="text-xs text-slate-600 leading-relaxed pt-3 border-t border-slate-100">
                      {bishop.description}
                    </p>

                    {bishop.fullBiography && (
                      <div className="pt-2 space-y-2">
                        {bishop.fullBiography.slice(1).map((para, pIdx) => (
                          <p key={pIdx} className="text-[11.5px] text-slate-500 leading-relaxed border-l-2 border-slate-200 pl-2.5">
                            {para}
                          </p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* 5. PRINCIPALS ROSTER TAB (PRESENT PRINCIPAL FIRST, FOLLOWED BY FORMER PRINCIPALS) */}
        {activeTab === 'principals' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Section Header */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center space-x-2">
                <GraduationCap className="w-5 h-5 text-[#0B1F4E]" />
                <span className="text-xs font-bold text-[#0B1F4E] uppercase tracking-widest">Academic Leadership Roll</span>
              </div>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">Principal in Office & Former Principals</h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                The distinguished academicians and visionary leaders who have steered St. Philomena's College from its inaugural year in 1946 to the present day.
              </p>
            </div>

            {/* 1. FEATURED SPOTLIGHT: PRESENT PRINCIPAL IN OFFICE */}
            <div className="bg-gradient-to-br from-[#071A33] to-[#0B2545] text-white rounded-2xl p-6 sm:p-8 border-2 border-[#FFC928]/60 shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-blue-600/15 to-transparent pointer-events-none" />
              
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center relative z-10">
                <div className="md:col-span-4 lg:col-span-3 flex justify-center">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border-3 border-[#FFD84A] shadow-md bg-slate-900">
                    <img
                      src="/assets/images/principals/ravi-jd-saldanha.jpg"
                      alt="Dr. Ravi J.D. Saldanha - Principal in Office"
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = "/assets/images/leadership/ravi-jd-saldanha.jpg"; }}
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-slate-950/85 py-1 text-center">
                      <span className="text-[10px] font-mono font-bold text-[#FFD84A] uppercase tracking-wider">
                        In Office · 2022–Present
                      </span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-8 lg:col-span-9 space-y-3">
                  <div className="inline-flex items-center space-x-2 bg-[#FFD84A]/20 border border-[#FFD84A]/40 px-3 py-1 rounded-full">
                    <span className="w-2 h-2 rounded-full bg-[#FFD84A] animate-pulse" />
                    <span className="text-[#FFD84A] text-xs font-mono font-bold uppercase tracking-wider">
                      Principal in Office
                    </span>
                  </div>

                  <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-white">
                    Dr. Ravi J.D. Saldanha
                  </h3>
                  
                  <p className="text-xs sm:text-sm text-[#F0D98C] font-semibold">
                    Principal, St. Philomena's College (Autonomous), Mysuru
                  </p>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
                    Leading the institution in its 80th milestone era, Dr. Ravi J.D. Saldanha directs academic governance, research advancements, NEP curriculum implementations, institutional autonomy compliance, and student excellence across all undergraduate and postgraduate faculties.
                  </p>

                  <div className="pt-2">
                    <button
                      onClick={() => handleTabChange('leadership')}
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-[#0B1F4E] hover:bg-[#2563eb] text-white text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>Read Principal's Official Message</span>
                      <ArrowRight className="w-3.5 h-3.5 ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. FORMER PRINCIPALS HEADER */}
            <div className="border-b border-slate-200 pb-2 pt-4">
              <h3 className="font-serif font-bold text-xl text-slate-900">Former Principals (1946–2022)</h3>
              <p className="text-xs text-slate-500">Distinguished former Principals in reverse-chronological succession (latest first).</p>
            </div>

            {/* Grid of Former Principals (Latest First at Top) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {[...aboutData.principals.filter(p => !p.isCurrent)].reverse().map((p, idx) => (
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
                      <p className="text-xs text-[#0B1F4E] font-semibold pt-0.5">Principal · {p.tenure}</p>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed pt-2 border-t border-slate-100 line-clamp-3">
                      {p.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Complete Chronological Succession Table */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs mt-6">
              <div className="p-4 bg-slate-50 border-b border-slate-200">
                <h3 className="font-serif font-bold text-base text-slate-900">Succession Roll of Honour</h3>
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
                    {[
                      aboutData.presentPrincipal,
                      ...([...aboutData.principals.filter(p => !p.isCurrent)].reverse())
                    ].map((p, idx) => (
                      <tr key={idx} className={`hover:bg-slate-50 transition-colors ${idx === 0 ? 'bg-amber-50/50 font-bold' : ''}`}>
                        <td className="p-3.5 font-mono text-[#0B1F4E]">
                          {idx === 0 ? '★ Present' : String(aboutData.principals.length - idx).padStart(2, '0')}
                        </td>
                        <td className="p-3.5 text-slate-900">
                          {p.name} {idx === 0 && <span className="ml-2 text-[10px] bg-[#071A33] text-[#FFD84A] px-2 py-0.5 rounded font-mono">In Office</span>}
                        </td>
                        <td className="p-3.5 font-mono text-slate-600">{p.tenure}</td>
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
            
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center gap-8">
              <div className="w-36 h-36 shrink-0 p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center">
                <img
                  src="/assets/images/logo/mdes_official_crest.png"
                  alt="Mysore Diocesan Educational Society (MDES) Official Crest"
                  className="max-h-full max-w-full object-contain drop-shadow-xs"
                />
              </div>
              <div className="space-y-2 flex-1 min-w-0">
                <span className="bg-blue-50 text-[#0B1F4E] font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider inline-block">
                  Governing Society
                </span>
                <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">
                  {aboutData.mdes.title}
                </h2>
                <p className="text-xs font-mono text-slate-500 font-semibold">{aboutData.mdes.regNo}</p>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                  {aboutData.mdes.description}
                </p>
              </div>
            </div>

            {/* MDES Key Office Bearers */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-[#0B1F4E] uppercase tracking-wider">President</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">{aboutData.mdes.president}</h4>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-[#0B1F4E] uppercase tracking-wider">Vice President</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">{aboutData.mdes.vicePresident}</h4>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-[#0B1F4E] uppercase tracking-wider">Secretary</span>
                <h4 className="font-serif font-bold text-sm text-slate-900">{aboutData.mdes.secretary}</h4>
              </div>
              <div className="p-5 bg-white rounded-xl border border-slate-200 space-y-1 shadow-xs">
                <span className="text-[10px] font-bold text-[#0B1F4E] uppercase tracking-wider">Treasurer</span>
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
                    <CheckCircle2 className="w-5 h-5 text-[#0B1F4E] shrink-0 mt-0.5" />
                    <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{obj}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* 7. ORGANOGRAM TAB */}
        {activeTab === 'organogram' && (
          <OrganogramView />
        )}

        {/* 8. GOVERNING BODY TAB */}
        {activeTab === 'governing-body' && (
          <GoverningBodyView />
        )}

        {/* 9. LEADERSHIP & ADMINISTRATION TAB */}
        {activeTab === 'leadership' && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* Header */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-2">
              <h2 className="font-serif font-extrabold text-2xl text-slate-900">Current Administration & Academic Heads</h2>
              <p className="text-xs sm:text-sm text-slate-600">
                The executive leadership team guiding the day-to-day administration, academic governance, and institutional excellence at St. Philomena's College.
              </p>
            </div>

            {/* Current Administration Full Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {aboutData.administration.map((person, idx) => {
                // Determine custom object-position to preserve full head and face for portrait photos
                const objectPosition = 
                  person.id === 'president-mdes' || person.id === 'bishop-president' || person.name.toLowerCase().includes('francis')
                    ? '50% 12%'
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
                        <p className="text-xs text-[#0B1F4E] font-bold pt-0.5">{person.designation}</p>
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
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#0B1F4E] shadow-sm"
                />
                <div>
                  <h3 className="font-serif font-bold text-base text-slate-900">{aboutData.leadershipMessages.rector.name}</h3>
                  <p className="text-xs text-[#0B1F4E] font-bold">{aboutData.leadershipMessages.rector.title}</p>
                </div>
              </div>

              <div className="lg:col-span-8 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="bg-blue-50 text-[#0B1F4E] font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                    Office of the Rector & Manager
                  </span>
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
