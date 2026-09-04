import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  Award, 
  ShieldCheck, 
  FileText, 
  Download, 
  CheckCircle2, 
  Target, 
  Compass, 
  Users, 
  Calendar, 
  Layers, 
  Search, 
  Eye, 
  ArrowRight,
  ExternalLink,
  BookOpen,
  Sparkles,
  Building2,
  TreePine,
  HeartHandshake,
  Activity,
  FileCheck,
  X,
  Mail,
  Phone,
  Briefcase,
  GraduationCap,
  Globe,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Share2
} from 'lucide-react';
import iqacData from '../data/iqacData.json';
import iqacOfficials from '../data/iqacOfficials.json';
import iqacEvents from '../data/iqacEvents.json';
import ViewAsBookButton from '../components/common/ViewAsBookButton';

export default function IqacPage() {
  const [selectedSection, setSelectedSection] = useState('overview');
  const [activeOfficial, setActiveOfficial] = useState(null);
  const [activeEvent, setActiveEvent] = useState(null);

  const carouselRef = useRef(null);

  const scrollCarousel = (direction) => {
    if (carouselRef.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const scrollToSection = (sectionId) => {
    setSelectedSection(sectionId);
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1440px] mx-auto space-y-10">

        {/* ================= 1. INSTITUTIONAL IQAC HERO BANNER ================= */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#1C5496] text-white font-mono font-bold text-xs px-3 py-1 rounded-md tracking-wider uppercase">
              Internal Quality Assurance Cell (IQAC)
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs px-3 py-1 rounded-md font-mono">
              Established: {iqacData.established}
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs px-3 py-1 rounded-md flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> NAAC Post-Accreditation Quality Sustenance
            </span>
          </div>

          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
            Internal Quality Assurance Cell (IQAC)
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-5xl leading-relaxed font-sans">
            {iqacData.overview}
          </p>
        </div>

        {/* ================= 2. IQAC VISION & MISSION (EXACT SCREENSHOT PARITY) ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* IQAC Vision Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-3">
              <Sparkles className="w-5 h-5 text-[#C9A84C]" />
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                IQAC Vision
              </h3>
            </div>

            <ul className="space-y-3 pt-1">
              {iqacData.vision.map((v, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-[#C9A84C] mt-1.5 shrink-0" />
                  <span>{v}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* IQAC Mission Card */}
          <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center space-x-3">
              <Compass className="w-5 h-5 text-[#1C5496]" />
              <h3 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                IQAC Mission
              </h3>
            </div>

            <ul className="space-y-3 pt-1">
              {iqacData.mission.map((m, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-xs sm:text-sm text-slate-700 font-sans leading-relaxed">
                  <span className="w-2 h-2 rounded-full bg-[#1C5496] mt-1.5 shrink-0" />
                  <span>{m}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* ================= 3. IQAC LEADERSHIP OFFICERS (EXACT VISUAL PARITY) ================= */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="text-center space-y-1 max-w-2xl mx-auto">
            <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">
              Executive Leadership
            </span>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">
              IQAC Core Officers
            </h2>
            <p className="text-xs text-slate-500 font-sans">
              Key institutional coordinators managing quality audits, NAAC accreditations, and academic benchmarks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto pt-4">
            {iqacOfficials.map((officer, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-slate-200 shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group border-t-4 border-t-[#1C5496] hover:-translate-y-1"
              >
                <div className="p-6 text-center space-y-4 flex flex-col items-center">
                  
                  {/* Oval Portrait Image with Blue Accent (Matching Screenshot) */}
                  <div className="relative w-28 h-36 rounded-full overflow-hidden border-4 border-slate-100 shadow-md group-hover:scale-105 transition-transform bg-slate-100">
                    <img
                      src={officer.photoUrl}
                      alt={officer.name}
                      className="w-full h-full object-cover object-top"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = '/assets/college-crest-gold.png';
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#1C5496] transition-colors">
                      {officer.name}
                    </h3>
                    <p className="text-xs font-bold text-[#1C5496] tracking-wide uppercase font-mono">
                      {officer.role}
                    </p>
                    <p className="text-[11px] text-slate-500 font-sans">
                      {officer.department}
                    </p>
                  </div>

                </div>

                {/* View Details Trigger */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-center">
                  <button
                    onClick={() => setActiveOfficial(officer)}
                    className="text-xs font-bold text-[#1C5496] hover:text-[#0B1F4E] inline-flex items-center space-x-1.5 py-1 px-3 rounded-lg hover:bg-slate-200/60 transition-colors cursor-pointer"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>View Profile & CV Details →</span>
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ================= 3. TEAL IQAC EVENTS / POSTS CAROUSEL (EXACT SCREENSHOT PARITY) ================= */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="text-[#208b9e] font-mono font-bold text-xs uppercase tracking-widest block">
                Campus Observances & Highlights
              </span>
              <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">
                IQAC Events & Flash News
              </h2>
            </div>

            {/* Carousel Arrow Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={() => scrollCarousel('left')}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#208b9e] hover:text-white text-slate-700 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                title="Previous Events"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scrollCarousel('right')}
                className="w-10 h-10 rounded-full bg-slate-100 hover:bg-[#208b9e] hover:text-white text-slate-700 flex items-center justify-center transition-all shadow-xs cursor-pointer"
                title="Next Events"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Horizontal Scroll Rail with Teal Cards */}
          <div
            ref={carouselRef}
            className="flex items-stretch gap-6 overflow-x-auto pb-4 pt-2 no-scrollbar snap-x snap-mandatory"
          >
            {iqacEvents.map((event, idx) => (
              <div
                key={event.id || idx}
                className="w-[300px] sm:w-[340px] shrink-0 rounded-2xl bg-[#208b9e] text-white p-6 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between space-y-5 snap-start relative group"
              >
                <div className="space-y-4">
                  
                  {/* Red Category Badges (Matching Screenshot) */}
                  <div className="flex flex-wrap gap-1.5">
                    {event.tags && event.tags.map((tag, tIdx) => (
                      <span
                        key={tIdx}
                        className="bg-[#EA4335] text-white text-[10px] font-bold font-mono px-2 py-0.5 rounded-sm uppercase tracking-wider shadow-2xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h3 className="font-serif font-bold text-xl sm:text-2xl text-white group-hover:text-amber-200 transition-colors leading-snug">
                    {event.title}
                  </h3>

                  {/* Meta: Author & Date */}
                  <div className="flex items-center space-x-4 text-xs text-teal-100/90 font-medium">
                    <span className="flex items-center space-x-1">
                      <User className="w-3.5 h-3.5" />
                      <span>{event.author}</span>
                    </span>
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.date}</span>
                    </span>
                  </div>

                </div>

                {/* Read More Button (Matching Screenshot Pill) */}
                <div className="pt-2">
                  <button
                    onClick={() => setActiveEvent(event)}
                    className="w-full py-2 px-4 rounded-full border border-white/80 hover:bg-white hover:text-[#208b9e] text-white font-bold text-xs sm:text-sm text-center transition-all cursor-pointer shadow-xs"
                  >
                    Read More
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

        {/* ================= 4. TWO-COLUMN LAYOUT (SIDEBAR DIRECTORY + MAIN CONTENT) ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= LEFT SIDEBAR DIRECTORY (EXACT PARITY WITH SCREENSHOT) ================= */}
          <div className="lg:col-span-4 bg-white p-5 sm:p-6 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-6 sticky top-24">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#1C5496]">
                IQAC Directory & Quick Links
              </h3>
              <span className="text-[10px] font-mono bg-blue-50 text-[#1C5496] px-2 py-0.5 rounded font-bold">
                100% Local
              </span>
            </div>

            <div className="space-y-5 text-xs font-sans max-h-[calc(100vh-200px)] overflow-y-auto pr-1">
              
              {/* 1. NAAC CERTIFICATES */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider block font-mono text-[11px] text-[#C9A84C]">
                  NAAC CERTIFICATES:
                </span>
                <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                  {iqacData.naacCertificates.map((cert, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection('sec-naac')}
                      className="block text-left py-1 text-slate-600 hover:text-[#1C5496] hover:font-bold transition-all w-full cursor-pointer"
                    >
                      {cert.label} ({cert.year})
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. MINUTES OF MEETING */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider block font-mono text-[11px] text-[#1C5496]">
                  Minutes of Meeting
                </span>
                <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                  {iqacData.minutesOfMeeting.map((mom, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection('sec-mom')}
                      className="block text-left py-1 text-slate-600 hover:text-[#1C5496] hover:font-bold transition-all w-full cursor-pointer"
                    >
                      {mom.year}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. AQAR */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider block font-mono text-[11px] text-[#C9A84C]">
                  AQAR Reports
                </span>
                <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                  {iqacData.aqarReports.map((aqar, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection('sec-aqar')}
                      className="block text-left py-1 text-slate-600 hover:text-[#1C5496] hover:font-bold transition-all w-full cursor-pointer"
                    >
                      {aqar.year}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. COMPOSITION OF IQAC */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider block font-mono text-[11px] text-[#1C5496]">
                  Composition of IQAC
                </span>
                <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                  <button
                    onClick={() => scrollToSection('sec-composition')}
                    className="block text-left py-1 text-slate-600 hover:text-[#1C5496] hover:font-bold transition-all w-full cursor-pointer"
                  >
                    Members
                  </button>
                  <button
                    onClick={() => scrollToSection('sec-criteria')}
                    className="block text-left py-1 text-slate-600 hover:text-[#1C5496] hover:font-bold transition-all w-full cursor-pointer"
                  >
                    CRITERIA LEADER'S AND SUB-CRITERIA MEMBERS
                  </button>
                </div>
              </div>

              {/* 5. ACTIVITIES & FDPS */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider block font-mono text-[11px] text-[#C9A84C]">
                  College & IQAC Activities
                </span>
                <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                  {iqacData.activitiesAndFdps.map((act, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection('sec-fdp')}
                      className="block text-left py-1 text-slate-600 hover:text-[#1C5496] hover:font-bold transition-all w-full cursor-pointer"
                    >
                      {act.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. GREEN AUDIT CERTIFICATE */}
              <div className="pt-1">
                <button
                  onClick={() => scrollToSection('sec-audits')}
                  className="block text-left font-bold text-[#1C5496] hover:text-[#0B1F4E] uppercase text-[11.5px] py-1 transition-all cursor-pointer"
                >
                  GREEN AUDIT CERTIFICATE - ISO 17020
                </button>
              </div>

              {/* 7. ROADMAP */}
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider block font-mono text-[11px] text-[#C9A84C]">
                  Strategic Roadmap
                </span>
                <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                  {iqacData.auditsAndRoadmaps.roadmaps.map((rm, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection('sec-audits')}
                      className="block text-left py-1 text-slate-600 hover:text-[#1C5496] hover:font-bold transition-all w-full cursor-pointer"
                    >
                      {rm.year}
                    </button>
                  ))}
                </div>
              </div>

              {/* 8. GENDER AUDIT */}
              <div>
                <button
                  onClick={() => scrollToSection('sec-audits')}
                  className="block text-left font-bold text-[#1C5496] hover:text-[#0B1F4E] uppercase text-[11.5px] py-1 transition-all cursor-pointer"
                >
                  GENDER AUDIT REPORT
                </button>
              </div>

              {/* 9. ACTIVITIES REPORTS */}
              <div className="space-y-1.5 pt-1">
                <span className="font-bold text-slate-900 uppercase tracking-wider block font-mono text-[11px] text-[#C9A84C]">
                  Activities Reports
                </span>
                <div className="space-y-1 pl-2 border-l-2 border-slate-100">
                  {iqacData.auditsAndRoadmaps.activitiesReports.map((rep, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToSection('sec-reports')}
                      className="block text-left py-1 text-slate-700 hover:text-[#1C5496] font-semibold text-[11px] leading-tight transition-all w-full cursor-pointer"
                    >
                      {rep.title}
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>

          {/* ================= RIGHT MAIN CONTENT SECTIONS ================= */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* 1. VISION, MISSION & OBJECTIVES */}
            <div id="sec-overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Vision Card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3 border-t-4 border-[#C9A84C]">
                  <div className="flex items-center space-x-3">
                    <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                    <h3 className="font-serif font-bold text-lg text-slate-900">IQAC Vision</h3>
                  </div>
                  <ul className="space-y-2 pt-1">
                    {iqacData.vision.map((v, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 leading-relaxed font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C9A84C] mt-1.5 shrink-0" />
                        <span>{v}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Mission Card */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3 border-t-4 border-[#1C5496]">
                  <div className="flex items-center space-x-3">
                    <Compass className="w-5 h-5 text-[#1C5496]" />
                    <h3 className="font-serif font-bold text-lg text-slate-900">IQAC Mission</h3>
                  </div>
                  <ul className="space-y-2 pt-1">
                    {iqacData.mission.map((m, idx) => (
                      <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 leading-relaxed font-sans">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1C5496] mt-1.5 shrink-0" />
                        <span>{m}</span>
                      </li>
                    ))}
                  </ul>
                </div>

              </div>

              {/* Objectives */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
                  <Target className="w-5 h-5 text-[#1C5496]" />
                  <h3 className="font-serif font-bold text-lg text-slate-900">Objectives of IQAC</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {iqacData.objectives.map((obj, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-start space-x-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#1C5496] text-white flex items-center justify-center text-[11px] font-bold shrink-0 font-mono">
                        {idx + 1}
                      </span>
                      <p className="text-xs text-slate-800 font-medium leading-relaxed font-sans">{obj}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 2. NAAC ACCREDITATION CERTIFICATES */}
            <div id="sec-naac" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Accreditation Records</span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">NAAC Certificates</h3>
                </div>
                <Award className="w-6 h-6 text-[#C9A84C]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {iqacData.naacCertificates.map((cert, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-[#1C5496] hover:shadow-xs transition-all space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-[10px] px-2 py-0.5 rounded border border-blue-100">
                        {cert.year}
                      </span>
                      <h4 className="font-serif font-bold text-base text-slate-900 pt-1">{cert.label}</h4>
                      <p className="text-xs text-slate-600 font-medium">{cert.grade}</p>
                    </div>

                    <div className="pt-2">
                      <ViewAsBookButton
                        pdfUrl={cert.pdf}
                        title={`NAAC ${cert.label} (${cert.year})`}
                        label="View Certificate"
                        variant="blue"
                        className="w-full py-2 rounded-lg text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 3. MINUTES OF MEETING */}
            <div id="sec-mom" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Governance & Action Taken</span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">Minutes of Meeting (MoM)</h3>
                </div>
                <FileCheck className="w-6 h-6 text-[#1C5496]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {iqacData.minutesOfMeeting.map((mom, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white flex items-center justify-between group transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-xs text-[#1C5496]">{mom.year}</span>
                      <p className="text-xs text-slate-700 font-medium line-clamp-1">{mom.title}</p>
                    </div>
                    <div className="shrink-0 ml-2">
                      <ViewAsBookButton
                        pdfUrl={mom.pdf}
                        title={mom.title}
                        label="View"
                        size="xs"
                        variant="blue"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. AQAR REPORTS */}
            <div id="sec-aqar" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Annual Submissions</span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">Annual Quality Assurance Reports (AQAR)</h3>
                </div>
                <FileText className="w-6 h-6 text-[#C9A84C]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {iqacData.aqarReports.map((aqar, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-white flex items-center justify-between group transition-colors">
                    <div className="space-y-0.5">
                      <span className="font-mono font-bold text-xs text-[#C9A84C]">{aqar.year}</span>
                      <p className="text-xs text-slate-700 font-medium line-clamp-1">{aqar.title}</p>
                    </div>
                    <div className="shrink-0 ml-2">
                      <ViewAsBookButton
                        pdfUrl={aqar.pdf}
                        title={aqar.title}
                        label="View"
                        size="xs"
                        variant="blue"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. COMPOSITION OF IQAC & CRITERIA LEADERS */}
            <div id="sec-composition" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Committee Roster</span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">Composition of IQAC (Members)</h3>
                </div>
                <Users className="w-6 h-6 text-[#1C5496]" />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-slate-700 font-mono uppercase text-[10.5px] border-b border-slate-200">
                      <th className="py-2.5 px-3 font-bold">Sl.</th>
                      <th className="py-2.5 px-3 font-bold">Member Name</th>
                      <th className="py-2.5 px-3 font-bold">Role / Designation</th>
                      <th className="py-2.5 px-3 font-bold">Department / Affiliation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-sans">
                    {iqacData.composition.map((m, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-2.5 px-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                        <td className="py-2.5 px-3 font-bold text-slate-900">{m.name}</td>
                        <td className="py-2.5 px-3 text-[#1C5496] font-semibold">{m.designation}</td>
                        <td className="py-2.5 px-3 text-slate-600">{m.department}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 6. CRITERIA LEADERS AND SUB-CRITERIA MEMBERS */}
            <div id="sec-criteria" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">NAAC Quality Framework</span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">Criteria Leaders & Sub-Criteria Members</h3>
                </div>
                <Layers className="w-6 h-6 text-[#C9A84C]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {iqacData.criteriaLeaders.map((crit, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <span className="font-mono font-bold text-xs text-[#1C5496] block">{crit.criteria}</span>
                    <h4 className="font-serif font-bold text-sm text-slate-900">{crit.leader}</h4>
                    <span className="text-[11px] text-slate-500 block font-medium">{crit.department}</span>
                    <p className="text-xs text-slate-600 font-sans pt-1 leading-relaxed">{crit.focus}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* 7. COLLEGE & IQAC ACTIVITIES (FDPs) */}
            <div id="sec-fdp" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Faculty Development</span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">College & IQAC Activities / FDPs</h3>
                </div>
                <Calendar className="w-6 h-6 text-[#1C5496]" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {iqacData.activitiesAndFdps.map((act, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-3 flex flex-col justify-between">
                    <div className="space-y-1">
                      <span className="bg-amber-50 text-amber-900 border border-amber-200 font-mono text-[10px] font-bold px-2 py-0.5 rounded">
                        {act.date}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-slate-900 pt-1">{act.title}</h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-sans">{act.theme}</p>
                    </div>
                    <a
                      href={act.pdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary-blue w-full py-2 px-3 rounded-lg text-xs font-bold inline-flex items-center justify-center"
                    >
                      <Eye className="w-3.5 h-3.5 mr-1.5" />
                      <span>View Activity Report</span>
                    </a>
                  </div>
                ))}
              </div>
            </div>

            {/* 8. GREEN AUDIT & GENDER AUDIT & ROADMAPS */}
            <div id="sec-audits" className="space-y-6">
              
              {/* Green Audit */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3 border-l-4 border-emerald-600">
                <div className="flex items-center space-x-3">
                  <TreePine className="w-6 h-6 text-emerald-600" />
                  <h3 className="font-serif font-bold text-lg text-slate-900">{iqacData.auditsAndRoadmaps.greenAudit.title}</h3>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{iqacData.auditsAndRoadmaps.greenAudit.description}</p>
                <div className="pt-2">
                  <ViewAsBookButton
                    pdfUrl={iqacData.auditsAndRoadmaps.greenAudit.pdf}
                    title={iqacData.auditsAndRoadmaps.greenAudit.title}
                    label="View ISO 17020 Certificate"
                    variant="blue"
                    size="sm"
                  />
                </div>
              </div>

              {/* Gender Audit */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-3 border-l-4 border-[#C9A84C]">
                <div className="flex items-center space-x-3">
                  <HeartHandshake className="w-6 h-6 text-[#C9A84C]" />
                  <h3 className="font-serif font-bold text-lg text-slate-900">{iqacData.auditsAndRoadmaps.genderAudit.title} ({iqacData.auditsAndRoadmaps.genderAudit.period})</h3>
                </div>
                <p className="text-xs text-slate-600 font-sans leading-relaxed">{iqacData.auditsAndRoadmaps.genderAudit.description}</p>
                <div className="pt-2">
                  <ViewAsBookButton
                    pdfUrl={iqacData.auditsAndRoadmaps.genderAudit.pdf}
                    title={iqacData.auditsAndRoadmaps.genderAudit.title}
                    label="View Gender Audit Report"
                    variant="blue"
                    size="sm"
                  />
                </div>
              </div>

              {/* Roadmaps */}
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-lg text-slate-900">Strategic Roadmaps of IQAC</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {iqacData.auditsAndRoadmaps.roadmaps.map((rm, idx) => (
                    <div key={idx} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-2">
                      <span className="font-mono font-bold text-xs text-[#1C5496]">{rm.year}</span>
                      <div className="pt-1">
                        <ViewAsBookButton
                          pdfUrl={rm.pdf}
                          title={rm.title}
                          label="View Document"
                          size="xs"
                          variant="blue"
                          className="w-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* 9. ACTIVITIES REPORTS */}
            <div id="sec-reports" className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
              <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
                <div>
                  <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest block">Comprehensive Documentation</span>
                  <h3 className="font-serif font-bold text-xl text-slate-900">Activities Reports of the IQAC</h3>
                </div>
                <Activity className="w-6 h-6 text-[#1C5496]" />
              </div>

              <div className="space-y-4">
                {iqacData.auditsAndRoadmaps.activitiesReports.map((rep, idx) => (
                  <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="bg-blue-50 text-[#1C5496] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase">
                        {rep.period}
                      </span>
                      <h4 className="font-serif font-bold text-sm text-slate-900">{rep.title}</h4>
                      <p className="text-xs text-slate-600 font-sans leading-relaxed">{rep.description}</p>
                    </div>
                    <div className="shrink-0">
                      <ViewAsBookButton
                        pdfUrl={rep.pdf}
                        title={rep.title}
                        label="View Report"
                        variant="blue"
                        size="sm"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

      {/* ================= 5. INTERACTIVE OFFICER PROFILE & CV MODAL ================= */}
      {activeOfficial && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fadeIn"
          onClick={() => setActiveOfficial(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Top Accent Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-24 rounded-2xl overflow-hidden border-2 border-[#1C5496] shrink-0 bg-slate-100 shadow-sm">
                  <img
                    src={activeOfficial.photoUrl}
                    alt={activeOfficial.name}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div className="space-y-1">
                  <span className="bg-blue-50 text-[#1C5496] font-mono text-[10px] font-bold px-2.5 py-0.5 rounded border border-blue-100 uppercase">
                    {activeOfficial.role}
                  </span>
                  <h3 className="font-serif font-extrabold text-xl sm:text-2xl text-slate-900">
                    {activeOfficial.name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600">
                    {activeOfficial.designation} • {activeOfficial.department}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveOfficial(null)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Info */}
            <div className="space-y-4 text-xs sm:text-sm font-sans">
              
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2">
                <p className="text-slate-700 leading-relaxed">
                  {activeOfficial.bio}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase block">Qualification</span>
                  <p className="font-bold text-slate-900 text-xs">{activeOfficial.qualification}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 space-y-1">
                  <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase block">Experience</span>
                  <p className="font-bold text-slate-900 text-xs">{activeOfficial.experience}</p>
                </div>

                <div className="p-3 rounded-xl border border-slate-200 space-y-1 sm:col-span-2">
                  <span className="text-[10.5px] font-mono font-bold text-slate-400 uppercase block">Specialization</span>
                  <p className="font-bold text-slate-900 text-xs">{activeOfficial.specialization}</p>
                </div>
              </div>

              {/* Contact Tools */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 text-xs">
                <div className="flex items-center space-x-4 text-slate-600">
                  <span className="flex items-center space-x-1">
                    <Mail className="w-3.5 h-3.5 text-[#1C5496]" />
                    <span>{activeOfficial.email}</span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <Phone className="w-3.5 h-3.5 text-[#1C5496]" />
                    <span>{activeOfficial.phone}</span>
                  </span>
                </div>

                {activeOfficial.profilePath && (
                  <Link
                    to={activeOfficial.profilePath}
                    onClick={() => setActiveOfficial(null)}
                    className="btn-primary-blue py-2 px-4 rounded-xl text-xs font-bold inline-flex items-center"
                  >
                    <span>View Academic CV Record →</span>
                  </Link>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

      {/* ================= 6. INTERACTIVE EVENT ARTICLE READER MODAL (EXACT OFFICIAL LAYOUT) ================= */}
      {activeEvent && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn overflow-y-auto"
          onClick={() => setActiveEvent(null)}
        >
          <div
            className="bg-white rounded-2xl sm:rounded-3xl max-w-3xl w-full p-4 sm:p-8 shadow-2xl border border-slate-200 space-y-6 relative my-auto max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Bar: Breadcrumb + Close Button */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <nav className="text-xs text-slate-400 font-medium flex items-center space-x-1.5 font-sans">
                <span className="hover:text-slate-600">Home</span>
                <span>&gt;</span>
                <span className="hover:text-slate-600">Blog</span>
                <span>&gt;</span>
                <span className="text-[#1C5496] font-bold">Events</span>
              </nav>

              <button
                onClick={() => setActiveEvent(null)}
                className="p-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* High-Resolution Official Event Poster Image (Matching User Screenshot) */}
            <div className="rounded-2xl overflow-hidden shadow-lg border border-slate-200 bg-slate-50 flex items-center justify-center">
              <img
                src={activeEvent.posterUrl || activeEvent.imageUrl}
                alt={activeEvent.title}
                className="w-full max-h-[550px] object-contain bg-slate-100"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/college-crest-gold.png';
                }}
              />
            </div>

            {/* Title & Metadata */}
            <div className="space-y-3 pt-2">
              <h1 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900 leading-tight">
                {activeEvent.title}
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-slate-100 pb-4 text-slate-500 font-sans">
                <div className="flex items-center space-x-6">
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Posted by</span>
                    <span className="font-bold text-slate-800">{activeEvent.author || 'Mirium'}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] font-mono uppercase">Date</span>
                    <span className="font-bold text-slate-800">{activeEvent.date}</span>
                  </div>
                </div>

                {/* Share Badges */}
                <div className="flex items-center space-x-2 text-slate-400">
                  <span className="text-[11px] font-medium">Share:</span>
                  <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-blue-600 hover:text-white flex items-center justify-center text-xs transition-colors">f</button>
                  <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white flex items-center justify-center text-xs transition-colors">𝕏</button>
                  <button className="w-7 h-7 rounded-full bg-slate-100 hover:bg-red-600 hover:text-white flex items-center justify-center text-xs transition-colors">P</button>
                </div>
              </div>

              {/* Event Text Description */}
              {activeEvent.description && (
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans pt-2">
                  {activeEvent.description}
                </p>
              )}
            </div>

            {/* Author Profile Card (Matching User Screenshot) */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                <User className="w-6 h-6" />
              </div>
              <div className="space-y-0.5">
                <h4 className="font-bold text-sm text-slate-900">{activeEvent.author || 'Mirium'}</h4>
                <p className="text-xs text-slate-500 font-sans">
                  Internal Quality Assurance Cell (IQAC) Documentation Team
                </p>
              </div>
            </div>

            {/* Previous / Next Post Navigation */}
            <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 py-3 text-xs">
              <button
                onClick={() => {
                  const currIdx = iqacEvents.findIndex(x => x.id === activeEvent.id);
                  if (currIdx > 0) setActiveEvent(iqacEvents[currIdx - 1]);
                }}
                className="text-left space-y-0.5 group hover:text-[#1C5496] transition-colors"
              >
                <span className="text-[10px] text-slate-400 block font-mono">Previous post</span>
                <span className="font-bold text-slate-800 group-hover:text-[#1C5496] line-clamp-1">
                  {iqacEvents[Math.max(0, iqacEvents.findIndex(x => x.id === activeEvent.id) - 1)]?.title || 'Previous Event'}
                </span>
              </button>

              <button
                onClick={() => {
                  const currIdx = iqacEvents.findIndex(x => x.id === activeEvent.id);
                  if (currIdx < iqacEvents.length - 1) setActiveEvent(iqacEvents[currIdx + 1]);
                }}
                className="text-right space-y-0.5 group hover:text-[#1C5496] transition-colors"
              >
                <span className="text-[10px] text-slate-400 block font-mono">Next post</span>
                <span className="font-bold text-slate-800 group-hover:text-[#1C5496] line-clamp-1">
                  {iqacEvents[Math.min(iqacEvents.length - 1, iqacEvents.findIndex(x => x.id === activeEvent.id) + 1)]?.title || 'Next Event'}
                </span>
              </button>
            </div>

            {/* You May Also Like Section (Matching User Screenshot) */}
            <div className="space-y-3 pt-2">
              <h3 className="font-serif font-bold text-base text-slate-900">
                You may also like
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {iqacEvents
                  .filter(x => x.id !== activeEvent.id)
                  .slice(0, 3)
                  .map((rel, rIdx) => (
                    <button
                      key={rIdx}
                      onClick={() => setActiveEvent(rel)}
                      className="text-left space-y-2 group p-2 rounded-xl hover:bg-slate-50 transition-all border border-transparent hover:border-slate-200 cursor-pointer"
                    >
                      <div className="aspect-[16/10] rounded-lg overflow-hidden bg-slate-100 border border-slate-200 shadow-2xs">
                        <img
                          src={rel.posterUrl || rel.imageUrl}
                          alt={rel.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/college-crest-gold.png';
                          }}
                        />
                      </div>
                      <h4 className="font-serif font-bold text-xs text-slate-800 group-hover:text-[#1C5496] line-clamp-2 leading-snug">
                        {rel.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono block">
                        {rel.date}
                      </span>
                    </button>
                  ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="pt-2 flex justify-end">
              <button
                onClick={() => setActiveEvent(null)}
                className="btn-primary-blue py-2 px-5 rounded-xl text-xs font-bold cursor-pointer"
              >
                Close Article
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
