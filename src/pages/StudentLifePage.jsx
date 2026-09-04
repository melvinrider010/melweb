import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Users, 
  ShieldCheck, 
  Heart, 
  GraduationCap, 
  Award, 
  Building2, 
  ArrowLeft, 
  ArrowRight,
  Download, 
  ExternalLink, 
  FileText, 
  Phone, 
  Mail, 
  Sparkles, 
  CheckCircle2, 
  Search,
  BookOpen,
  MapPin,
  ChevronRight,
  Share2,
  Calendar
} from 'lucide-react';
import studentSupportData from '../data/studentSupportData.json';
import PDFModalViewer from '../components/common/PDFModalViewer';

const CATEGORIES = [
  {
    key: 'Placement Cell & Welfare',
    title: 'Placement Cell & Welfare',
    desc: 'Career guidance, recruitment wings, student grievance redressal, welfare, and ethics',
    slugs: [
      'placement-cell',
      'student-grievance-redressal-committee',
      'anti-ragging',
      'womens-cell',
      'student-welfare-cell',
      'counselling-centre',
      'human-values-professional-ethics',
      'youth-red-cross-yrc'
    ]
  },
  {
    key: 'Amenities',
    title: 'Campus Amenities',
    desc: 'Central library, specialized laboratories, modern residential hostels, and auditoriums',
    slugs: [
      'library',
      'facilities',
      'business-lab',
      'computer-science-lab',
      'girls-hostel',
      'boys-hostel',
      'auditorium',
      'e-journal'
    ]
  },
  {
    key: 'Other Amenities',
    title: 'Other Amenities & Units',
    desc: 'Banking & ATM, historic quadrangle chapel, NCC, NSS, and indoor stadium sports arena',
    slugs: [
      'bank-atm',
      'chapel-hall-3',
      'ranger-and-rovers',
      'ncc',
      'nss',
      'indoor-stadium'
    ]
  }
];

export default function StudentLifePage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activePdf, setActivePdf] = useState(null);
  const [copied, setCopied] = useState(false);
  const [selectedImg, setSelectedImg] = useState(null);

  // Normalize slug if user accessed via /student-support/:slug, ?tab=xyz, or direct route like /placement-cell
  let currentSlug = slug || new URLSearchParams(location.search).get('tab');
  if (!currentSlug && location.pathname !== '/student-support' && location.pathname !== '/student-life') {
    const cleanPath = location.pathname.replace(/^\/+|\/+$/g, '');
    if (studentSupportData[cleanPath]) {
      currentSlug = cleanPath;
    } else {
      const lastSegment = cleanPath.split('/').pop();
      if (studentSupportData[lastSegment]) {
        currentSlug = lastSegment;
      }
    }
  }
  const currentItem = currentSlug ? studentSupportData[currentSlug] : null;

  // Flattened list of all items in menu order
  const allItems = Object.values(studentSupportData);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Find prev/next item
  const currentIndex = allItems.findIndex(i => i.slug === currentSlug);
  const prevItem = currentIndex > 0 ? allItems[currentIndex - 1] : null;
  const nextItem = currentIndex >= 0 && currentIndex < allItems.length - 1 ? allItems[currentIndex + 1] : null;

  // Filtered items for directory overview
  const filteredItems = allItems.filter(item => {
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch = searchQuery === '' || 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.tagline && item.tagline.toLowerCase().includes(searchQuery.toLowerCase())) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // If a specific item is selected, render the dedicated deep view
  if (currentItem) {
    const defaultThumbnail = currentItem.images && currentItem.images.length > 0 
      ? currentItem.images[0].localPath 
      : '/assets/images/campus/intro_heritage_building.jpg';

    return (
      <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1440px] mx-auto space-y-8">
          
          {/* 1. BREADCRUMBS & ACTIONS */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-600">
              <Link to="/" className="hover:text-[#0B1F4E] transition-colors">Home</Link>
              <span>/</span>
              <Link to="/student-support" className="hover:text-[#0B1F4E] transition-colors">Student Support</Link>
              <span>/</span>
              <span className="text-[#0B1F4E] font-bold">{currentItem.name}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="px-3.5 py-1.5 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 inline-flex items-center transition-colors shadow-2xs cursor-pointer"
                title="Share link"
              >
                <Share2 className="w-3.5 h-3.5 mr-1.5 text-[#0B1F4E]" />
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
              <Link
                to="/student-support"
                className="px-3.5 py-1.5 bg-[#0B1F4E] hover:bg-[#0B1F4E] text-white rounded-lg text-xs font-bold inline-flex items-center transition-colors shadow-xs"
              >
                <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
                <span>All Facilities</span>
              </Link>
            </div>
          </div>

          {/* 2. MAIN LAYOUT: SIDEBAR + DETAIL CONTENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* LEFT SIDEBAR: FAST CATEGORY NAVIGATION */}
            <aside className="lg:col-span-3 space-y-6 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs sticky top-24">
              <div className="space-y-1 border-b border-slate-100 pb-3">
                <span className="text-[11px] font-bold text-[#0B1F4E] uppercase tracking-wider block">Institutional Directory</span>
                <h3 className="font-serif font-bold text-base text-slate-900">Student Services & Amenities</h3>
              </div>

              <div className="space-y-6 text-xs max-h-[70vh] overflow-y-auto pr-1">
                {CATEGORIES.map((cat, cIdx) => (
                  <div key={cIdx} className="space-y-2">
                    <h4 className="font-bold text-slate-900 text-[11px] uppercase tracking-wider text-[#C9A84C] flex items-center justify-between">
                      <span>{cat.title}</span>
                    </h4>
                    <div className="space-y-1">
                      {cat.slugs.map((s) => {
                        const itemData = studentSupportData[s];
                        if (!itemData) return null;
                        const isCurrent = s === currentSlug;
                        return (
                          <Link
                            key={s}
                            to={`/student-support/${s}`}
                            className={`block py-2 px-2.5 rounded-lg font-medium transition-all ${
                              isCurrent 
                                ? 'bg-[#0B1F4E] text-[#F0D98C] font-bold shadow-xs' 
                                : 'text-slate-700 hover:bg-slate-50 hover:text-[#0B1F4E]'
                            }`}
                          >
                            <span className="line-clamp-1">{itemData.name}</span>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>

            {/* RIGHT MAIN CONTENT AREA */}
            <main className="lg:col-span-9 space-y-8">
              
              {/* HERO BANNER CARD */}
              <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs">
                <div className="relative aspect-[21/9] sm:aspect-[24/8] bg-slate-900 overflow-hidden">
                  <img 
                    src={defaultThumbnail} 
                    alt={currentItem.name} 
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent flex flex-col justify-end p-6 sm:p-8">
                    <div className="space-y-2 max-w-3xl">
                      <span className="bg-[#C9A84C] text-[#0B1F4E] font-mono font-bold text-[10px] sm:text-xs px-2.5 py-0.5 rounded uppercase tracking-wider inline-block">
                        {currentItem.category}
                      </span>
                      <h1 className="font-serif font-extrabold text-2xl sm:text-4xl text-white tracking-tight">
                        {currentItem.name}
                      </h1>
                      {currentItem.tagline && (
                        <p className="text-slate-200 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-sm">
                          {currentItem.tagline}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* COORDINATOR & KEY METRICS BAR */}
                <div className="p-6 bg-slate-50/70 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="space-y-1">
                    {currentItem.coordinator && (
                      <div className="flex items-center space-x-2 text-xs text-slate-800">
                        <Users className="w-4 h-4 text-[#0B1F4E] shrink-0" />
                        <span className="font-bold">Officer / In-Charge:</span>
                        <span>{currentItem.coordinator}</span>
                      </div>
                    )}
                    {currentItem.contact && (
                      <div className="flex items-center space-x-2 text-xs text-slate-600">
                        <Phone className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                        <span>{currentItem.contact}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    {currentItem.portalUrl && (
                      <a
                        href={currentItem.portalUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2 bg-[#0B1F4E] hover:bg-[#0B1F4E] text-white text-xs font-bold rounded-xl inline-flex items-center shadow-xs transition-colors"
                      >
                        <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                        <span>Online Redressal Form</span>
                      </a>
                    )}
                    {currentItem.pdfs && currentItem.pdfs.length > 0 && (
                      <button
                        onClick={() => setActivePdf(currentItem.pdfs[0])}
                        className="px-4 py-2 bg-[#C9A84C] hover:bg-[#b09038] text-[#0B1F4E] text-xs font-bold rounded-xl inline-flex items-center shadow-xs transition-colors cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5 mr-1.5" />
                        <span>View Document ({currentItem.pdfs.length})</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* HIGHLIGHTS & OBJECTIVES PILLS */}
              {(currentItem.highlights || currentItem.objectives) && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center space-x-2 border-b border-slate-100 pb-3">
                    <Sparkles className="w-5 h-5 text-[#C9A84C]" />
                    <span>{currentItem.highlights ? 'Key Highlights & Amenities' : 'Primary Objectives & Scope'}</span>
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {(currentItem.highlights || currentItem.objectives).map((point, pIdx) => (
                      <div key={pIdx} className="bg-slate-50 p-3.5 rounded-xl border border-slate-100 flex items-start space-x-3">
                        <CheckCircle2 className="w-4 h-4 text-[#0B1F4E] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-[13px] text-slate-700 leading-relaxed font-medium">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* SECTIONS FROM LIVE COLLEGE PORTAL */}
              {currentItem.sections && currentItem.sections.length > 0 && (
                <div className="space-y-6">
                  {currentItem.sections.map((sec, sIdx) => {
                    // Skip generic empty headings
                    if (!sec.content || sec.content.length === 0) return null;
                    const heading = sec.heading === 'Overview' || !sec.heading ? 'Detailed Information' : sec.heading;

                    return (
                      <div key={sIdx} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                        <h3 className="font-serif font-bold text-lg sm:text-xl text-[#0B1F4E] border-b border-slate-100 pb-3">
                          {heading}
                        </h3>
                        <div className="space-y-3 text-xs sm:text-sm text-slate-700 leading-relaxed">
                          {sec.content.map((cItem, cIdx) => {
                            if (typeof cItem === 'string') {
                              return <p key={cIdx}>{cItem}</p>;
                            }
                            if (cItem.type === 'paragraph') {
                              return <p key={cIdx}>{cItem.text}</p>;
                            }
                            if (cItem.type === 'list' && cItem.items) {
                              return (
                                <ul key={cIdx} className="space-y-2 my-2 pl-2">
                                  {cItem.items.map((li, lIdx) => (
                                    <li key={lIdx} className="flex items-start space-x-2">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#0B1F4E] mt-2 shrink-0"></span>
                                      <span>{li}</span>
                                    </li>
                                  ))}
                                </ul>
                              );
                            }
                            if (cItem.type === 'quote') {
                              return (
                                <blockquote key={cIdx} className="p-4 bg-slate-50 border-l-4 border-[#C9A84C] text-slate-800 italic rounded-r-xl">
                                  {cItem.text}
                                </blockquote>
                              );
                            }
                            return null;
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* COMMITTEE / OFFICIALS TABLE IF AVAILABLE */}
              {currentItem.tables && currentItem.tables.length > 0 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-[#0B1F4E]" />
                    <span>Committee Members & Designated Roles</span>
                  </h3>
                  <div className="overflow-x-auto rounded-xl border border-slate-200">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        {currentItem.tables[0][0] && (
                          <tr className="bg-[#0B1F4E] text-[#F0D98C]">
                            {currentItem.tables[0][0].map((th, thIdx) => (
                              <th key={thIdx} className="py-3 px-4 font-bold border-b border-white/10 uppercase tracking-wider">
                                {th}
                              </th>
                            ))}
                          </tr>
                        )}
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {currentItem.tables[0].slice(1).map((row, rIdx) => (
                          <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white hover:bg-slate-50' : 'bg-slate-50/60 hover:bg-slate-50'}>
                            {row.map((cell, cIdx) => (
                              <td key={cIdx} className="py-2.5 px-4 text-slate-800 font-medium">
                                {cIdx === 3 && cell === 'Coordinator' ? (
                                  <span className="bg-blue-100 text-[#0B1F4E] font-bold px-2 py-0.5 rounded text-[11px]">
                                    {cell}
                                  </span>
                                ) : (
                                  cell
                                )}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* PHOTO GALLERY SHOWCASE */}
              {currentItem.images && currentItem.images.length > 0 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <Building2 className="w-5 h-5 text-[#0B1F4E]" />
                    <span>Campus Infrastructure & Activity Gallery</span>
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {currentItem.images.map((img, iIdx) => (
                      <div 
                        key={iIdx} 
                        onClick={() => setSelectedImg(img.localPath)}
                        className="aspect-[4/3] rounded-xl overflow-hidden bg-slate-100 border border-slate-200 hover:shadow-md transition-all group cursor-pointer relative"
                      >
                        <img 
                          src={img.localPath} 
                          alt={`${currentItem.name} - Photo ${iIdx + 1}`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <Search className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* STATUTORY PDF ATTACHMENTS */}
              {currentItem.pdfs && currentItem.pdfs.length > 0 && (
                <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-serif font-bold text-lg text-slate-900 border-b border-slate-100 pb-3 flex items-center space-x-2">
                    <FileText className="w-5 h-5 text-[#0B1F4E]" />
                    <span>Official Reports, Forms & Document Downloads</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentItem.pdfs.map((pdf, pIdx) => (
                      <div key={pIdx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 hover:border-[#0B1F4E] transition-colors">
                        <div className="flex items-center space-x-3 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-xs text-slate-900 truncate">{pdf.title}</h4>
                            <span className="text-[10px] text-slate-500 uppercase font-mono">Official PDF Report</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1.5 shrink-0">
                          <button
                            onClick={() => setActivePdf(pdf)}
                            className="px-2.5 py-1.5 bg-[#0B1F4E] hover:bg-[#0B1F4E] text-[#F0D98C] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                            title="Preview Document"
                          >
                            View
                          </button>
                          <a
                            href={pdf.localPath || pdf.originalUrl}
                            download
                            className="p-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-slate-700 transition-colors"
                            title="Download PDF"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* PREVIOUS & NEXT FACILITY PAGINATION */}
              <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                {prevItem ? (
                  <Link
                    to={`/student-support/${prevItem.slug}`}
                    className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-[#0B1F4E] transition-colors group"
                  >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    <div className="text-left">
                      <span className="text-[10px] text-slate-400 block font-normal uppercase">Previous Service</span>
                      <span>{prevItem.name}</span>
                    </div>
                  </Link>
                ) : <div></div>}

                {nextItem ? (
                  <Link
                    to={`/student-support/${nextItem.slug}`}
                    className="flex items-center space-x-2 text-xs font-bold text-slate-700 hover:text-[#0B1F4E] transition-colors group text-right"
                  >
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-normal uppercase">Next Service</span>
                      <span>{nextItem.name}</span>
                    </div>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                ) : <div></div>}
              </div>

            </main>
          </div>

        </div>

        {/* PDF MODAL VIEWER */}
        {activePdf && (
          <PDFModalViewer
            isOpen={!!activePdf}
            onClose={() => setActivePdf(null)}
            pdfUrl={activePdf.localPath || activePdf.originalUrl}
            title={activePdf.title}
          />
        )}

        {/* IMAGE LIGHTBOX MODAL */}
        {selectedImg && (
          <div 
            onClick={() => setSelectedImg(null)}
            className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <div className="max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl shadow-2xl bg-black">
              <img src={selectedImg} alt="Preview" className="w-full h-full object-contain" />
            </div>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT DIRECTORY OVERVIEW PAGE (/student-support)
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 space-y-10">
      <div className="max-w-[1440px] mx-auto space-y-10">

        {/* HEADER HERO BANNER */}
        <div className="bg-white p-8 sm:p-12 rounded-3xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#0B1F4E] relative overflow-hidden">
          <div className="relative z-10 max-w-4xl space-y-3">
            <span className="text-[#0B1F4E] font-bold text-xs uppercase tracking-widest block font-mono">
              Campus Facilities & Institutional Support
            </span>
            <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-slate-900 tracking-tight">
              Student Support, Amenities & Campus Units
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Explore comprehensive career guidance, statutory welfare committees, student grievance cells, digital libraries, specialized computer & business laboratories, secure residential hostels, NCC, NSS, and indoor athletic stadium.
            </p>
          </div>
        </div>

        {/* FILTER BAR & SEARCH */}
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
          {/* Category Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {['All', 'Placement Cell & Welfare', 'Amenities', 'Other Amenities'].map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-[#0B1F4E] text-[#F0D98C] shadow-xs'
                    : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {cat === 'All' ? 'All Services (22)' : cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search facilities or cells..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#0B1F4E] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* DIRECTORY GRID (22 CARDS) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((fac) => {
            const thumbnail = fac.images && fac.images.length > 0 
              ? fac.images[0].localPath 
              : '/assets/images/campus/intro_heritage_building.jpg';

            return (
              <div 
                key={fac.slug}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="aspect-[16/10] bg-slate-900 relative overflow-hidden">
                    <img 
                      src={thumbnail} 
                      alt={fac.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90" 
                    />
                    <span className="absolute top-3 left-3 bg-[#0B1F4E]/90 text-[#F0D98C] text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wide backdrop-blur-xs">
                      {fac.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="font-serif font-bold text-lg text-slate-900 group-hover:text-[#0B1F4E] transition-colors line-clamp-1">
                      {fac.name}
                    </h3>
                    {fac.tagline && (
                      <p className="text-[11.5px] text-[#0B1F4E] font-semibold line-clamp-1">
                        {fac.tagline}
                      </p>
                    )}
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {fac.coordinator ? `Coordinator: ${fac.coordinator}. ` : ''}
                      {fac.sections && fac.sections[0] && fac.sections[0].content && typeof fac.sections[0].content[0] === 'string'
                        ? fac.sections[0].content[0]
                        : (fac.highlights ? fac.highlights.join(', ') : 'Comprehensive campus service and support facility for student scholars at St. Philomena.')}
                    </p>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <Link
                    to={`/student-support/${fac.slug}`}
                    className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-[#0B1F4E] text-[#0B1F4E] hover:text-[#F0D98C] border border-slate-200 hover:border-[#0B1F4E] font-bold text-xs text-center transition-all flex items-center justify-center space-x-1.5 group/btn"
                  >
                    <span>Explore Details & Documents</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
