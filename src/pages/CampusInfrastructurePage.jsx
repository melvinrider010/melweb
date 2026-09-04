import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  BookOpen, 
  Microscope, 
  Trophy, 
  Landmark, 
  GraduationCap, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Sparkles, 
  Layers, 
  ShieldCheck, 
  Home, 
  CreditCard, 
  Music, 
  TreePine, 
  Sun, 
  Droplet, 
  Activity, 
  Users, 
  ExternalLink, 
  Download,
  Clock,
  Phone,
  Mail,
  Maximize2,
  X
} from 'lucide-react';
import CampusBlocksSection from '../components/home/CampusBlocksSection';

export default function CampusInfrastructurePage() {
  const [activeTab, setActiveTab] = useState('all');
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const infrastructureCategories = [
    { id: 'all', label: 'All Infrastructure (18)' },
    { id: 'academic', label: 'Academic & Research Wings' },
    { id: 'labs', label: 'State-of-the-Art Labs' },
    { id: 'residential', label: 'Hostels & Residential' },
    { id: 'sports', label: 'Sports & Athletics' },
    { id: 'amenities', label: 'Campus Amenities' },
    { id: 'green', label: 'Green & Eco Campus' }
  ];

  const facilitiesList = [
    {
      id: 'admin-quad',
      category: 'academic',
      title: 'Main Administrative Quadrangle & Heritage Block',
      tag: 'Est. 1946 Heritage',
      image: '/media/heritage/st_philos_heritage_palace.jpg',
      features: ["Principal's Secretariat", 'COE Autonomous Exam Wing', 'Admissions & Information Center', 'Governing Body Chamber'],
      description: 'The monumental Gothic-inspired heritage quadrangle established in 1946, functioning as the administrative and autonomous governance heart of the institution.'
    },
    {
      id: 'science-complex',
      category: 'academic',
      title: 'Science & Biotechnology Research Complex',
      tag: 'DBT Star Supported',
      image: '/assets/images/campus/science_block_official.png',
      features: ['Instrumentation Center', 'Molecular Biology Suites', 'DST-FIST Research Labs', 'Smart AV Lecture Halls'],
      description: 'Multi-story research facility housing modern physics, chemistry, biotechnology, biochemistry, and microbiology laboratories with advanced analytical instruments.'
    },
    {
      id: 'central-library',
      category: 'academic',
      title: 'Central Digital Library & Research Commons',
      tag: '50,000+ Volumes',
      image: '/assets/images/campus/library_block_official.jpg',
      features: ['INFLIBNET / N-LIST Remote Access', 'OPAC Automated Circulation', 'E-Journals Research Lab', 'Quiet Reading Wings'],
      description: 'Expansive information resource hub housing over 50,000 print volumes, rare manuscripts, national and international peer-reviewed journals, and dedicated digital scholar workstations.'
    },
    {
      id: 'pg-research-block',
      category: 'academic',
      title: 'Postgraduate & Research Center (RDC)',
      tag: 'Autonomous PG Wing',
      image: '/assets/images/campus/pg_block_official.png',
      features: ['Research Development Cell (RDC)', 'Doctoral Workstations', 'Executive Seminar Halls', 'Industry Incubation Wing'],
      description: 'Dedicated complex for 15+ Master degree programmes, interdisciplinary research grants, patents, and faculty development initiatives.'
    },
    {
      id: 'computer-labs',
      category: 'labs',
      title: 'Central Computer Applications & AI Laboratories',
      tag: '300+ Workstations',
      image: '/assets/images/facilities/academic_lab.jpg',
      features: ['High-Speed 1 Gbps Fiber Wi-Fi', 'Linux & Windows Dual-Boot', 'AI / Cloud Development Suites', 'Cyber Security Testing Rig'],
      description: 'Six fully air-conditioned computing centers equipped with modern high-performance desktop systems, full-stack software stacks, and cloud connectivity.'
    },
    {
      id: 'business-lab',
      category: 'labs',
      title: 'Commerce & Management Business Laboratory',
      tag: 'Fintech & Analytics',
      image: '/assets/images/banners/hero_campus_main.jpg',
      features: ['Stock Market Live Terminal', 'Tally Prime & ERP 9', 'Corporate Case Study Cubicles', 'GST Simulation Software'],
      description: 'Practical simulation lab for B.Com, BBA, M.Com, and MBA scholars to gain real-world competencies in financial modeling, corporate taxation, and stock analytics.'
    },
    {
      id: 'science-labs',
      category: 'labs',
      title: 'Advanced Physical & Life Science Laboratories',
      tag: 'UGC Recognized',
      image: '/assets/images/facilities/academics_science_lab.jpg',
      features: ['Spectrophotometry Center', 'Optics & Solid State Physics Lab', 'Organic Synthesis Suite', 'Plant Tissue Culture Unit'],
      description: 'Precision laboratory spaces equipped with high-precision analytical equipment, rotary evaporators, and safety equipment supporting experimental curriculum.'
    },
    {
      id: 'girls-hostel',
      category: 'residential',
      title: "St. Philomena's Girls Residential Hostel",
      tag: 'On-Campus Living',
      image: '/assets/images/campus/about_building.jpg',
      features: ['24/7 CCTV & Security Guards', 'Hygienic Vegetarian & Non-Veg Dining', 'Solar Water Heating Systems', 'Study & Recreation Lounges'],
      description: 'Safe, comfortable, and well-maintained on-campus residential facility providing structured accommodation and pastoral care for female students.'
    },
    {
      id: 'boys-hostel',
      category: 'residential',
      title: "St. Philomena's Boys Residential Hostel",
      tag: 'Spacious Quad Living',
      image: '/assets/images/campus/campus_quadrangle.jpg',
      features: ['Spacious Ventilated Rooms', 'Nutritious Dining Mess', 'Direct Sports Ground Access', 'Wi-Fi Study Halls'],
      description: 'Structured residential living for outstation male scholars with dedicated wardens, recreational facilities, and athletic ground access.'
    },
    {
      id: 'indoor-stadium',
      category: 'sports',
      title: 'Indoor Sports Stadium & Fitness Arena',
      tag: 'State-Level Arena',
      image: '/assets/images/campus/indoor_stadium_official.png',
      features: ['Wooden Badminton Courts', 'Table Tennis Arena', 'Modern Multi-Gymnasium', 'Inter-Collegiate Host Facility'],
      description: 'Full-sized indoor sports facility hosting university basketball & badminton championships, table tennis tournaments, and physical fitness conditioning.'
    },
    {
      id: 'outdoor-grounds',
      category: 'sports',
      title: 'Athletics Grounds & Multi-Sport Track',
      tag: 'Outdoor Sports',
      image: '/assets/images/facilities/student_life_campus.jpg',
      features: ['Full-Size Football Pitch', 'Cricket Turf & Nets', '400m Athletics Track', 'Volleyball & Kho-Kho Courts'],
      description: 'Expansive lush green outdoor sports grounds facilitating inter-collegiate athletics, annual sports meets, and NCC parade drills.'
    },
    {
      id: 'auditorium',
      category: 'amenities',
      title: 'College Main Auditorium & AV Theatres',
      tag: '1,000+ Capacity',
      image: '/assets/images/facilities/campus_auditorium.jpg',
      features: ['Surround Sound Acoustics', 'Digital LED Stage Wall', 'Air-Conditioned Green Rooms', 'Conferences & Convocations'],
      description: 'Grand cultural and academic venue equipped with cutting-edge audio-visual acoustics for national symposia, convocation ceremonies, and Philo-Fest.'
    },
    {
      id: 'chapel',
      category: 'amenities',
      title: 'Historic College Chapel & Prayer Sanctuary',
      tag: 'Spiritual Heritage',
      image: '/media/gallery/campus/campus_chapel.jpg',
      features: ['Peaceful Sanctuary', 'Inter-Faith Reflection', 'Heritage Stained Glass', 'Daily Morning Solace'],
      description: 'A tranquil architectural landmark providing spiritual grounding, peace, and moral contemplation for students and faculty of all backgrounds.'
    },
    {
      id: 'bank-atm',
      category: 'amenities',
      title: 'Nationalized Bank Branch & 24/7 ATM Facility',
      tag: 'Financial Convenience',
      image: '/assets/images/banners/hero_campus.jpg',
      features: ['On-Campus Bank Branch', '24/7 ATM Cash Machine', 'Direct Fee Payment Counter', 'Scholarship Account Services'],
      description: 'Dedicated full-service on-campus bank branch providing seamless tuition fee transactions, scholarship disbursements, and ATM banking services.'
    },
    {
      id: 'cafeteria',
      category: 'amenities',
      title: 'Campus Cafeteria & Student Dining Commons',
      tag: 'Hygienic Dining',
      image: '/media/heritage/st_philos_heritage_palace.jpg',
      features: ['Nutritious Meals & Snacks', 'Fresh Juice & Bakery Counter', 'Clean Drinking Water Fountains', 'Spacious Seating Area'],
      description: 'Vibrant dining commons serving wholesome, hygienic vegetarian and non-vegetarian cuisine, snacks, and beverages at subsidized student rates.'
    },
    {
      id: 'green-campus',
      category: 'green',
      title: 'Eco-Friendly Green Campus & Solar Infrastructure',
      tag: 'Sustainability',
      image: '/assets/images/campus/about_building.jpg',
      features: ['Rooftop Solar Energy Arrays', 'Rainwater Harvesting Wells', 'Botanical Medicinal Garden', 'Zero Single-Use Plastic Policy'],
      description: 'Award-winning ecological campus featuring solar power generation, rainwater recharge facilities, lush landscaping, and green audit compliance.'
    }
  ];

  const filteredFacilities = activeTab === 'all' 
    ? facilitiesList 
    : facilitiesList.filter(f => f.category === activeTab);

  return (
    <div className="space-y-12 py-6 sm:py-10 text-[#071A33] animate-fadeIn">
      
      {/* 1. HERO BANNER */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="bg-gradient-blue text-white p-8 sm:p-12 rounded-3xl shadow-xl border border-slate-700/50 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 relative overflow-hidden">
          
          {/* Background Pattern */}
          <div className="absolute -right-16 -bottom-16 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="space-y-4 max-w-2xl relative z-10">
            <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest block font-mono">
              World-Class Infrastructure
            </span>
            <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-white leading-tight">
              Campus & Physical Infrastructure
            </h1>
            <p className="text-sm sm:text-base text-slate-200 leading-relaxed font-sans">
              Spread across a lush green 30+ acre landscape in Mysuru, St. Philomena's College blends majestic 1946 heritage architecture with advanced DST-FIST & DBT Star-supported research laboratories, digital libraries, and sports complexes.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono font-bold text-slate-200 backdrop-blur-xs border border-white/20">
                🏛️ 30+ Acres Lush Campus
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono font-bold text-[#FFD84A] backdrop-blur-xs border border-white/20">
                🔬 DBT Star College Laboratories
              </span>
              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono font-bold text-slate-200 backdrop-blur-xs border border-white/20">
                📚 50,000+ Library Volumes
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 relative z-10 w-full sm:w-auto">
            <a
              href="/gallery"
              className="btn-gold px-6 py-3 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-2 shadow-md"
            >
              <span>Explore Photo Gallery</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="/assets/compliance/mca-mba-infrastructure.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-white px-5 py-3 rounded-xl text-xs font-bold inline-flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Infrastructure Report</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. INTERACTIVE CAMPUS BLOCKS SHOWCASE (FROM HOMEPAGE) */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <CampusBlocksSection />
      </div>

      {/* 3. DETAILED FACILITIES & INFRASTRUCTURE CATALOGUE */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 space-y-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-slate-200 pb-4">
          <div>
            <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block font-mono">
              Comprehensive Facilities Index
            </span>
            <h2 className="font-serif font-extrabold text-2xl sm:text-4xl text-slate-900 mt-1">
              Explore Campus Wings & Facilities
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md">
            Click any facility card to enlarge high-resolution photographs and explore technical specifications.
          </p>
        </div>

        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {infrastructureCategories.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveTab(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#0B1F4E] text-[#F0D98C] shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 border border-slate-200'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredFacilities.map((fac) => (
            <div
              key={fac.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image Container */}
              <div 
                onClick={() => setSelectedPhoto(fac.image)}
                className="aspect-[16/10] bg-slate-900 relative overflow-hidden cursor-pointer"
              >
                <img
                  src={fac.image}
                  alt={fac.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = '/assets/banner-college.jpg';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                <span className="absolute top-3 left-3 bg-[#0B1F4E]/90 text-[#F0D98C] text-[10px] font-mono font-bold px-2.5 py-1 rounded-md uppercase tracking-wider backdrop-blur-xs border border-[#C9A84C]/40">
                  {fac.tag}
                </span>

                <span className="absolute bottom-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 className="w-3 h-3" />
                  <span>Preview</span>
                </span>
              </div>

              {/* Body Content */}
              <div className="p-6 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-2.5">
                  <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
                    {fac.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans">
                    {fac.description}
                  </p>
                </div>

                {/* Key Features Bullet List */}
                <div className="pt-3 border-t border-slate-100 space-y-1.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                    Key Highlights:
                  </span>
                  <div className="grid grid-cols-1 gap-1">
                    {fac.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-center space-x-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1C5496] shrink-0" />
                        <span className="font-medium">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>

      {/* 4. CAMPUS SUSTAINABILITY & AMENITIES MATRIX */}
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8">
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-sm space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[#1C5496] font-mono font-bold text-xs uppercase tracking-widest">
              Eco-Friendly & Smart Campus
            </span>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-slate-900">
              Campus Safety, Green Energy & Facilities
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-sans">
              Committed to ecological stewardship, student health, uninterrupted connectivity, and 24/7 campus security.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900">Solar Energy Grid</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Rooftop solar photovoltaic panels generating clean renewable electricity and powering solar water heaters across student hostels.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#1C5496] flex items-center justify-center">
                <Droplet className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900">Rainwater Harvesting</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Integrated rainwater harvesting wells and filtration sumps across all major academic blocks to recharge groundwater levels.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900">24/7 Security & CCTV</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Over 120+ high-definition CCTV security cameras and trained security personnel monitoring all gates, hostels, and corridors.
              </p>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Activity className="w-5 h-5" />
              </div>
              <h4 className="font-serif font-bold text-base text-slate-900">Health & First Aid Care</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                On-campus medical first aid room, registered health counselor, and tie-up with nearby multi-specialty hospitals for emergency care.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5. LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div 
          onClick={() => setSelectedPhoto(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
        >
          <div 
            onClick={(e) => e.stopPropagation()}
            className="relative max-w-4xl max-h-[90vh] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 flex flex-col items-center"
          >
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-3 right-3 z-10 p-2 bg-black/60 hover:bg-black/90 text-white rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="p-2 max-h-[80vh] flex items-center justify-center overflow-auto">
              <img
                src={selectedPhoto}
                alt="Facility Preview"
                className="max-w-full max-h-[75vh] object-contain rounded-lg"
                onError={(e) => {
                  e.target.src = '/assets/banner-college.jpg';
                }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
