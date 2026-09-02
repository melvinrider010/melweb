import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Sparkles
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
    features: ['Multi-Sport Wooden Courts', 'Inter-Collegiate Tournaments', 'Modern Fitness Gymnasium'],
    description: 'Full-sized indoor sports facility hosting state-level championships, university basketball & badminton tournaments, and vibrant cultural festivals.'
  }
];

export default function CampusBlocksSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const activeSpace = CAMPUS_SPACES[activeIndex];

  // Auto-cycle every 6 seconds if not hovered
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % CAMPUS_SPACES.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + CAMPUS_SPACES.length) % CAMPUS_SPACES.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % CAMPUS_SPACES.length);
  };

  return (
    <section className="bg-white py-14 sm:py-18 border-y border-slate-200/80 relative overflow-hidden text-[#0B1F4E]">
      
      {/* Background Architectural Grid Pattern */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 bg-[linear-gradient(to_right,#0B1F4E_1px,transparent_1px),linear-gradient(to_bottom,#0B1F4E_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.02] pointer-events-none" 
      />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-100 pb-5 gap-4">
          <div className="space-y-1.5 max-w-2xl">
            <div className="section-heading text-start mb-0">
              <span className="sub-label">Campus & Infrastructure</span>
              <h2>Discover Our 28-Acre Campus</h2>
              <div className="heading-line"></div>
            </div>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-sans">
              Explore the perfect blend of historic heritage, modern scientific research suites, comprehensive digital libraries, and premier athletic infrastructure.
            </p>
          </div>

          {/* Carousel Arrows & Counter */}
          <div className="flex items-center space-x-3 shrink-0">
            <span className="text-xs font-mono font-bold text-slate-500">
              {String(activeIndex + 1).padStart(2, '0')} / {String(CAMPUS_SPACES.length).padStart(2, '0')}
            </span>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handlePrev}
                aria-label="Previous Facility"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-[#0B1F4E] text-[#0B1F4E] hover:text-white border border-slate-200 transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Facility"
                className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-[#0B1F4E] text-[#0B1F4E] hover:text-white border border-slate-200 transition-all flex items-center justify-center cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* DYNAMIC SPLIT SHOWCASE (HERO ON LEFT + INTERACTIVE CARDS ON RIGHT) */}
        <div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          
          {/* ================= LEFT: HERO SHOWCASE STAGE (7 COLS) ================= */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Image Stage Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-lg border border-slate-200 aspect-[16/10] bg-[#060f26] group">
              
              {/* Dynamic Image with Smooth Crossfade */}
              <img
                key={activeSpace.id}
                src={activeSpace.image}
                alt={activeSpace.alt}
                style={{ objectPosition: activeSpace.objectPosition || 'center center' }}
                className="w-full h-full object-cover transition-all duration-700 ease-out filter brightness-[0.92] group-hover:scale-102"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#060f26] via-[#060f26]/30 to-transparent pointer-events-none" />

              {/* Top Meta Badges */}
              <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between pointer-events-none">
                <span className="bg-[#060f26]/90 backdrop-blur-md border border-[#C9A84C]/50 text-[#F0D98C] font-mono text-[11px] font-bold px-2.5 py-1 rounded-md shadow-xs">
                  {activeSpace.number} · {activeSpace.tag}
                </span>

                <span className="bg-slate-900/80 backdrop-blur-md text-slate-300 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border border-slate-700">
                  St. Philomena's Campus
                </span>
              </div>

              {/* Overlay Title on Image */}
              <div className="absolute bottom-3.5 left-3.5 right-3.5 z-10 space-y-0.5">
                <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#F0D98C]">
                  {activeSpace.eyebrow}
                </span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-white leading-tight">
                  {activeSpace.title}
                </h3>
              </div>

            </div>

            {/* Dynamic Metadata & Feature Details Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-2xs space-y-3">
              
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                {activeSpace.description}
              </p>

              {/* Key Features Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-200/60">
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
                  onClick={() => setActiveIndex(idx)}
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
                    />
                    <span className="absolute bottom-0.5 right-0.5 bg-[#060f26]/90 text-[#F0D98C] font-mono text-[9px] font-bold px-1 rounded">
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
                    <h4 className={`font-serif font-bold text-xs sm:text-sm leading-snug truncate ${
                      isActive ? 'text-[#0B1F4E]' : 'text-slate-800 group-hover:text-[#0B1F4E]'
                    }`}>
                      {space.title}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-sans truncate">
                      {space.eyebrow}
                    </p>
                  </div>

                  {/* Indicator Arrow */}
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                    isActive
                      ? 'bg-[#0B1F4E] text-[#F0D98C]'
                      : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200 group-hover:text-slate-700'
                  }`}>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </section>
  );
}
