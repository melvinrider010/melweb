import React, { useEffect, useRef, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  ArrowLeft, 
  Printer, 
  Download, 
  Share2, 
  FileText, 
  ShieldCheck, 
  ChevronRight, 
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Layers,
  Paperclip
} from 'lucide-react';
import { cmsStore } from '../lib/cmsStore';
import { getEventById } from '../lib/eventsNoticesService';
import { animatePageIn } from '../animations/pageTransitions';
import ViewAsBookButton from '../components/common/ViewAsBookButton';

export default function NoticeDetailPage() {
  const { id, slug } = useParams();
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    animatePageIn(containerRef);
    window.scrollTo(0, 0);
  }, [id, slug]);

  const targetKey = id || slug || 'congratulations-25';

  // Find item by checking events first, then notices
  const { item, isEvent } = useMemo(() => {
    const event = getEventById(targetKey);
    if (event) {
      return { item: event, isEvent: true };
    }
    const notices = cmsStore.getNotices();
    const foundNotice = notices.find(
      (n) => n.id === targetKey || n.slug === targetKey || n.linked_event_id === targetKey
    );
    if (foundNotice) {
      return { item: foundNotice, isEvent: foundNotice.type === 'Event' };
    }
    return { item: notices[0] || event, isEvent: false };
  }, [targetKey]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: item.title,
        text: item.summary || item.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const hasSubEvents = Array.isArray(item.subEvents) && item.subEvents.length > 0;
  const hasAttachments = Array.isArray(item.attachments) && item.attachments.length > 0;
  const displayDate = item.displayDate || item.event_date || item.date;
  const itemVenue = item.location || item.venue;
  const itemTime = item.time_range || item.time;

  return (
    <div ref={containerRef} className="bg-[#f8f9fc] min-h-screen text-[#0B1F4E] pb-20">
      
      {/* 1. CINEMATIC TOP BANNER (MATCHING AUTHENTIC INSTITUTIONAL DESIGN) */}
      <div className="relative bg-[#0B1F4E] text-white py-14 sm:py-20 px-4 sm:px-8 border-b-4 border-[#C9A84C] overflow-hidden">
        
        {/* Campus Quadrangle Background with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-25 filter blur-[1px]"
          style={{ backgroundImage: `url('/media/gallery/campus/campus_quadrangle_main.jpg')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4E] via-[#0B1F4E]/80 to-transparent" />

        <div className="max-w-[1200px] mx-auto relative z-10 space-y-4">
          
          {/* Breadcrumb matching user request: Home > Blog > Events / Notices */}
          <nav aria-label="Breadcrumb" className="flex items-center space-x-2 text-xs text-slate-300 font-sans">
            <Link to="/" className="hover:text-[#F0D98C] transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <Link to="/news-events" className="hover:text-[#F0D98C] transition-colors">Notices & Events</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[#F0D98C] font-semibold truncate max-w-xs sm:max-w-md">{item.title}</span>
          </nav>

          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-xs font-mono font-bold text-[#F0D98C] uppercase tracking-wider">
              <span>{isEvent ? 'EVENT' : (item.type || 'NOTICE')}</span>
              <span>·</span>
              <span>{item.category}</span>
            </div>
            
            <h1 className="font-serif font-extrabold text-3xl sm:text-5xl text-white tracking-tight uppercase">
              {isEvent ? 'CAMPUS EVENT' : 'OFFICIAL CIRCULAR'}
            </h1>
          </div>

        </div>
      </div>

      {/* 2. MAIN DOCUMENT VIEWER CONTAINER */}
      <div className="max-w-[1100px] mx-auto px-4 sm:px-6 -mt-8 relative z-20 space-y-8">
        
        {/* TOP ACTION CONTROLS */}
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200 shadow-sm print:hidden">
          <Link
            to="/news-events"
            className="btn-navy text-xs font-bold px-4 py-2 rounded-lg flex items-center shadow-xs"
          >
            <ArrowLeft className="w-4 h-4 mr-1.5" />
            <span>All Bulletins</span>
          </Link>

          <div className="flex items-center space-x-2">
            <button
              onClick={handlePrint}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center cursor-pointer border border-slate-300"
            >
              <Printer className="w-3.5 h-3.5 mr-1.5 text-[#0B1F4E]" />
              <span>Print</span>
            </button>

            <button
              onClick={handleShare}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all flex items-center cursor-pointer border border-slate-300"
            >
              <Share2 className="w-3.5 h-3.5 mr-1.5 text-[#0B1F4E]" />
              <span>Share</span>
            </button>

            {item.documentPdf && (
              <ViewAsBookButton
                pdfUrl={item.documentPdf}
                title={item.title}
                label="View Document"
                variant="blue"
              />
            )}
          </div>
        </div>

        {/* 3. AUTHENTIC OFFICIAL LETTERHEAD DOCUMENT PAPER (PRINT-READY) */}
        <div className="bg-white rounded-2xl border border-slate-300/90 shadow-2xl p-6 sm:p-12 md:p-16 space-y-8 print:border-none print:shadow-none print:p-0">
          
          {/* INSTITUTIONAL HEADER & DUAL CRESTS */}
          <div className="border-b-2 border-red-800/80 pb-6 text-center space-y-2 relative">
            <div className="max-w-2xl mx-auto flex items-center justify-center">
              <img
                src="/assets/college-header-logo.png"
                alt="St. Philomena's College Autonomous Logo"
                className="h-16 sm:h-20 object-contain mx-auto"
              />
            </div>

            <div className="space-y-0.5 text-[#8B0000] font-serif font-bold text-xs sm:text-sm tracking-wide">
              <p className="uppercase">Mysore Diocesan Educational Society (Regd.)</p>
              <p className="font-extrabold text-base sm:text-xl text-[#B22222]">
                St. Philomena's College (Autonomous)
              </p>
              <p className="text-slate-700 font-sans text-[11px] sm:text-xs font-normal">
                Affiliated to the University of Mysore · Approved by AICTE & Reaccredited by NAAC
              </p>
              <p className="text-slate-500 font-sans text-[10px] sm:text-[11px] font-normal">
                Bannimantap, Mysuru – 570015, Karnataka, India
              </p>
            </div>
          </div>

          {/* DOCUMENT REFERENCE METADATA STRIP */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-4 text-xs font-mono text-slate-700 gap-2">
            <div>
              <span className="font-bold text-[#0B1F4E]">Ref No: </span>
              <span className="bg-slate-100 px-2 py-0.5 rounded border border-slate-300 font-bold text-slate-800">
                {item.refNo || `SPC/ADMIN/2026/${item.id.toUpperCase()}`}
              </span>
            </div>

            <div>
              <span className="font-bold text-[#0B1F4E]">Date: </span>
              <span className="font-semibold text-slate-800">{displayDate}</span>
            </div>
          </div>

          {/* DOCUMENT TITLE */}
          <div className="text-center py-2 space-y-2">
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#0B1F4E] leading-tight">
              {item.title}
            </h2>
            <div className="w-24 h-1 bg-[#C9A84C] mx-auto rounded-full" />
          </div>

          {/* EVENT META (VENUE & TIME IF APPLICABLE) */}
          {(itemVenue || itemTime) && (
            <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-4 flex flex-wrap items-center justify-around gap-4 text-xs font-sans text-amber-900">
              {itemVenue && (
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0" />
                  <span className="font-bold">{itemVenue}</span>
                </div>
              )}
              {itemTime && (
                <div className="flex items-center space-x-2 font-mono">
                  <Clock className="w-4 h-4 text-[#C9A84C] shrink-0" />
                  <span className="font-bold">{itemTime}</span>
                </div>
              )}
            </div>
          )}

          {/* DOCUMENT SCAN OR PHOTO DISPLAY */}
          {item.documentImage && (
            <div className="rounded-xl overflow-hidden border border-slate-300 shadow-md bg-slate-100 max-w-2xl mx-auto">
              <img
                src={item.documentImage}
                alt={item.title}
                className="w-full h-auto object-contain max-h-[600px] mx-auto"
              />
              <div className="bg-slate-900 text-slate-300 text-[11px] font-mono text-center py-1.5 px-4 border-t border-slate-700">
                Official Institutional Release · St. Philomena's College (Autonomous)
              </div>
            </div>
          )}

          {/* DOCUMENT BODY CONTENT */}
          <div className="space-y-4 text-slate-800 text-sm sm:text-base leading-relaxed font-sans max-w-3xl mx-auto">
            {Array.isArray(item.content) ? (
              item.content.map((paragraph, pIdx) => (
                <p key={pIdx} className="leading-relaxed text-justify">
                  {paragraph}
                </p>
              ))
            ) : (
              <p className="leading-relaxed text-justify">{item.description || item.summary}</p>
            )}
          </div>

          {/* SUB-EVENTS / PROGRAM TRACKS ACCORDION BLOCK (IF EVENT HAS SUB-EVENTS) */}
          {hasSubEvents && (
            <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 max-w-3xl mx-auto">
              <div className="flex items-center space-x-2 border-b border-slate-200 pb-3">
                <Layers className="w-5 h-5 text-[#C9A84C]" />
                <h3 className="font-serif font-bold text-base text-[#0B1F4E]">
                  Program Schedule & Detailed Sub-Events ({item.subEvents.length})
                </h3>
              </div>

              <div className="space-y-3">
                {item.subEvents.map((sub, idx) => (
                  <div key={sub.id || idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h4 className="font-serif font-bold text-sm text-[#0B1F4E]">
                        {sub.title}
                      </h4>
                      <span className="text-[11px] font-mono font-bold bg-[#0B1F4E] text-[#F0D98C] px-2.5 py-0.5 rounded shrink-0">
                        {sub.event_date}
                      </span>
                    </div>

                    {sub.description && (
                      <p className="text-xs text-slate-600 font-sans leading-relaxed">
                        {sub.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 font-sans pt-1">
                      {(sub.time_range || sub.time) && (
                        <div className="flex items-center space-x-1 font-mono">
                          <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                          <span>{sub.time_range || sub.time}</span>
                        </div>
                      )}
                      {(sub.location || sub.venue) && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" />
                          <span>{sub.location || sub.venue}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ATTACHMENTS LIST */}
          {hasAttachments && (
            <div className="bg-blue-50/70 border border-blue-200 rounded-xl p-5 space-y-3 max-w-3xl mx-auto">
              <div className="flex items-center space-x-2 font-serif font-bold text-sm text-[#0B1F4E]">
                <Paperclip className="w-4 h-4 text-[#0B1F4E]" />
                <span>Official Attachments & Circular Documents</span>
              </div>
              <div className="space-y-2">
                {item.attachments.map((att, attIdx) => (
                  <div key={attIdx} className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 text-xs">
                    <span className="font-bold text-slate-800 truncate pr-2">{att.title}</span>
                    <ViewAsBookButton
                      pdfUrl={att.url}
                      title={att.title}
                      label="View"
                      size="xs"
                      variant="blue"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SIGNATURE & OFFICIAL SEAL BLOCK */}
          <div className="pt-8 border-t-2 border-slate-200 flex flex-col sm:flex-row items-end justify-between gap-6">
            <div className="text-xs text-slate-500 font-sans space-y-1">
              <div className="flex items-center space-x-1.5 text-emerald-700 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Digitally Verified Institutional Document</span>
              </div>
              <p>St. Philomena's College (Autonomous), Bannimantap, Mysuru</p>
            </div>

            <div className="text-right space-y-1">
              <div className="font-serif font-bold text-sm text-[#0B1F4E] whitespace-pre-line">
                {item.signatory || "Rev. Dr. Bernard Prakash Barnis\nPrincipal"}
              </div>
              <div className="text-xs text-slate-600 font-mono">
                {item.department || "Office of the Principal"}
              </div>
            </div>
          </div>

        </div>

        {/* 4. OTHER RECENT BULLETINS */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6 shadow-sm print:hidden">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="font-serif font-bold text-lg text-[#0B1F4E]">Other Recent Bulletins</h3>
            <Link to="/news-events" className="text-xs font-bold text-[#0B1F4E] hover:text-[#a88530]">
              View All Notices & Events →
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {cmsStore.getNotices()
              .filter((n) => n.id !== item.id && n.linked_event_id !== item.id)
              .slice(0, 3)
              .map((other) => (
                <Link
                  key={other.id}
                  to={`/news-events/${other.id}`}
                  className="p-4 rounded-xl bg-slate-50 hover:bg-white border border-slate-200/80 hover:border-[#C9A84C] hover:shadow-md transition-all space-y-2 block group"
                >
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded uppercase">
                      {other.type}
                    </span>
                    <span className="text-slate-500">{other.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-xs sm:text-sm text-[#0B1F4E] group-hover:text-[#a88530] transition-colors line-clamp-2">
                    {other.title}
                  </h4>
                  <p className="text-xs text-slate-500 font-sans line-clamp-2">
                    {other.summary}
                  </p>
                </Link>
              ))}
          </div>
        </div>

      </div>

    </div>
  );
}
