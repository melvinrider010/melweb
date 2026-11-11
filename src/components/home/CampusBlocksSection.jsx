import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  BookOpen, 
  Microscope, 
  Trophy, 
  Landmark, 
  GraduationCap, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2,
  MapPin,
  Sparkles,
  ExternalLink
} from 'lucide-react';

const CAMPUS_SPACES = [
  {
    id: 'chapel',
    number: '01',
    eyebrow: 'Heritage & Spiritual Sanctuary',
    title: 'Chapel & Prayer Sanctuary',
    shortName: 'College Chapel',
    image: '/media/gallery/campus/campus_chapel.jpg',
    alt: "St. Philomena's College Historic Chapel",
    tag: 'Spiritual Sanctuary',
    link: '/chapel',
    features: ['Historic Sacred Architecture', 'Peaceful Meditation', 'Est. 1946 Heritage'],
    description: 'A serene sanctuary of prayer and contemplation, inspiring moral grounding, ethical purpose, and spiritual peace for students and faculty of all faiths.'
  },
  {
    id: 'admin-block',
    number: '02',
    eyebrow: 'Institutional Governance',
    title: 'Main Administrative Quadrangle',
    shortName: 'Admin Quadrangle',
    image: '/assets/images/campus/admin_quadrangle_heritage.jpg',
    objectPosition: 'center 85%',
    alt: "St. Philomena's Administrative Quadrangle Building",
    tag: 'Governance & Admissions',
    link: '/about',
    features: ["Principal's Office", 'COE Examination Center', 'Central Admissions Desk'],
    description: 'The historic architectural center coordinating autonomous academic operations, admissions guidance, and institutional governance under MDES stewardship.'
  },
  {
    id: 'science-block',
    number: '03',
    eyebrow: 'Discovery & Innovation',
    title: 'Science & Biotechnology Complex',
    shortName: 'Science Complex',
    image: '/assets/images/campus/science_block_official.png',
    alt: "St. Philomena's Science & Biotechnology Block Building",
    tag: 'DBT Star Supported',
    link: '/departments',
    features: ['Advanced Instrumentation Center', 'Biotechnology Suites', 'Chemistry & Physics Labs'],
    description: 'State-of-the-art laboratory infrastructure equipped with analytical instruments, supporting experiential scientific learning and undergraduate research.'
  },
  {
    id: 'library-block',
    number: '04',
    eyebrow: 'Knowledge & Research Commons',
    title: 'Central Library & Digital Commons',
    shortName: 'Central Library',
    image: '/assets/images/campus/library_block_official.jpg',
    alt: "Central Library & Information Resource Center Building",
    tag: '50,000+ Volumes',
    link: '/library',
    features: ['INFLIBNET / N-LIST Access', 'Digital Research Commons', 'Quiet Study Halls'],
    description: 'A rich repository of academic volumes, international peer-reviewed journals, and digital workstations supporting faculty and student scholarship.'
  },
  {
    id: 'pg-research',
    number: '05',
    eyebrow: 'Postgraduate & Doctoral Studies',
    title: 'PG & Research Center (RDC)',
    shortName: 'PG & Research Complex',
    image: '/assets/images/campus/pg_block_official.png',
    alt: "Postgraduate and Research Complex Building",
    tag: 'Master Degrees & RDC',
    link: '/research',
    features: ['Research Development Cell (RDC)', 'Smart Audio-Visual Theatres', 'Doctoral Workspaces'],
    description: 'Dedicated modern multi-story complex for postgraduate disciplines, interdisciplinary research grants, patents, and faculty development initiatives.'
  },
  {
    id: 'indoor-stadium',
    number: '06',
    eyebrow: 'Sports & Cultural Arena',
    title: 'Indoor Stadium & Athletics Arena',
    shortName: 'Indoor Stadium',
    image: '/assets/images/campus/indoor_stadium_official.png',
    alt: "Indoor Sports Stadium and Athletics Arena Building",
    tag: 'Athletics & Cultural Hub',
    link: '/indoor-stadium',
    features: ['Multi-Sport Wooden Courts', 'Inter-Collegiate Tournaments', 'Modern Fitness Gymnasium'],
    description: 'Full-sized indoor sports facility hosting state-level championships, university basketball & badminton tournaments, and vibrant cultural festivals.'
  }
];

export default function CampusBlocksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();

  const activeSpace = CAMPUS_SPACES[activeIndex];

  // Auto-cycle every 6 seconds if not hovered
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CAMPUS_SPACES.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [isPaused]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CAMPUS_SPACES.length) % CAMPUS_SPACES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CAMPUS_SPACES.length);
  };

  return (
    <section className="max-w-[1440px] mx-auto px-4 sm:px-8 py-4 sm:py-6 relative overflow-hidden">
      
      {/* Background Micro Grid */}
      <div 
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#071A33 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }}
      />

      <div className="space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div className="space-y-2">
            <span className="text-[#0B1F4E] font-mono font-semibold text-xs uppercase tracking-wider block">
              Campus & Infrastructure
            </span>
            <h2 className="font-heading font-semibold text-xl sm:text-2xl text-[#071A33] tracking-tight">
              Discover Our 28-Acre Campus
            </h2>
            <p className="text-sm text-slate-600 max-w-xl font-sans">
              Explore the perfect blend of historic heritage, modern scientific research suites, comprehensive digital libraries, and premier athletic infrastructure.
            </p>
          </div>

          {/* Controls & Nav Buttons */}
          <div className="flex items-center space-x-3 shrink-0">
            <span className="font-mono text-xs font-bold text-slate-500">
              {String(activeIndex + 1).padStart(2, '0')} / {String(CAMPUS_SPACES.length).padStart(2, '0')}
            </span>

            <div className="flex items-center space-x-1">
              <button
                onClick={handlePrev}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Previous Space"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                title="Next Space"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Dynamic Dual-Column Presentation Layout */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* ================= LEFT: HERO SHOWCASE STAGE (7 COLS) ================= */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Image Stage Container (Clickable to open page) */}
            <Link
              to={activeSpace.link}
              className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[16/10] bg-[#0B1F4E] group cursor-pointer block"
              title={`Click to open ${activeSpace.title} page`}
            >
              
              {/* Dynamic Image with Smooth Crossfade */}
              <img
                key={activeSpace.id}
                src={activeSpace.image}
                alt={activeSpace.alt}
                style={{ objectPosition: activeSpace.objectPosition || 'center center' }}
                className="w-full h-full object-cover transition-all duration-700 ease-out filter brightness-[0.92] group-hover:scale-103"
                onError={(e) => {
                  e.target.src = '/assets/banner-college.jpg';
                }}
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4E] via-[#0B1F4E]/30 to-transparent pointer-events-none" />

              {/* Top Meta Badges */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                <span className="bg-[#0B1F4E]/90 backdrop-blur-md border border-[#C9A84C]/50 text-[#F0D98C] font-mono text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                  {activeSpace.number} · {activeSpace.tag}
                </span>

                <span className="bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-700 flex items-center space-x-1">
                  <span>Open Page</span>
                  <ExternalLink className="w-3 h-3 ml-1 text-[#F0D98C]" />
                </span>
              </div>

              {/* Overlay Title on Image */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F0D98C]">
                  {activeSpace.eyebrow}
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight group-hover:text-[#F0D98C] transition-colors flex items-center justify-between">
                  <span>{activeSpace.title}</span>
                  <ArrowRight className="w-5 h-5 text-[#F0D98C] opacity-0 group-hover:opacity-100 transition-opacity" />
                </h3>
              </div>

            </Link>

            {/* Dynamic Metadata & Feature Details Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-3">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans flex-1">
                  {activeSpace.description}
                </p>
                <Link
                  to={activeSpace.link}
                  className="btn-navy text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center space-x-1.5 shadow-xs whitespace-nowrap self-start sm:self-auto shrink-0"
                >
                  <span>Explore {activeSpace.shortName}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Key Features Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-200/60">
                {activeSpace.features.map((feat, fIdx) => (
                  <span
                    key={fIdx}
                    className="px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-800 font-sans flex items-center shadow-2xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-[#C9A84C]" />
                    <span>{feat}</span>
                  </span>
                ))}
              </div>

            </div>

          </div>

          {/* ================= RIGHT: INTERACTIVE FACILITY CARDS LIST (5 COLS) ================= */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-2.5">
            {CAMPUS_SPACES.map((space, idx) => {
              const isActive = activeIndex === idx;

              return (
                <div
                  key={space.id}
                  onClick={() => {
                    if (isActive) {
                      navigate(space.link);
                    } else {
                      setActiveIndex(idx);
                    }
                  }}
                  className={`p-3 sm:p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex items-center space-x-3 group relative ${
                    isActive
                      ? 'bg-white border-[#C9A84C] shadow-sm ring-1 ring-[#C9A84C]/40 border-r-4 border-r-[#C9A84C]'
                      : 'bg-white border-slate-200 hover:bg-slate-50/90 hover:border-slate-300'
                  }`}
                >
                  {/* Thumbnail Preview */}
                  <div className="relative w-14 h-14 sm:w-15 sm:h-15 rounded-lg overflow-hidden shrink-0 border border-slate-200 bg-slate-900 shadow-2xs">
                    <img
                      src={space.image}
                      alt={space.shortName}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.target.src = '/assets/banner-college.jpg';
                      }}
                    />
                    <span className="absolute bottom-0.5 right-0.5 bg-[#0B1F4E]/90 text-[#F0D98C] font-mono text-[9px] font-bold px-1 rounded">
                      {space.number}
                    </span>
                  </div>

                  {/* Text Meta */}
                  <div className="flex-1 min-w-0 space-y-0.5">
                    <span className={`text-[10px] font-mono font-bold uppercase tracking-wider block ${
                      isActive ? 'text-[#a88530]' : 'text-slate-400'
                    }`}>
                      {space.tag}
                    </span>
                    <h4 className={`font-heading font-semibold text-xs sm:text-sm leading-snug truncate ${
                      isActive ? 'text-[#0B1F4E]' : 'text-slate-800 group-hover:text-[#0B1F4E]'
                    }`}>
                      {space.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-sans truncate">
                      {space.eyebrow}
                    </p>
                  </div>

                  {/* Indicator Arrow / Direct Link Button */}
                  <Link
                    to={space.link}
                    onClick={(e) => e.stopPropagation()}
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-[#0B1F4E] text-[#F0D98C] hover:bg-[#0B1F4E]'
                        : 'bg-slate-100 text-slate-400 group-hover:bg-[#0B1F4E] group-hover:text-[#F0D98C]'
                    }`}
                    title={`Open ${space.title} page`}
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
