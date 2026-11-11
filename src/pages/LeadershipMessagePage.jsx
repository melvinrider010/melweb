import React, { useEffect, useRef } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { 
  Quote, 
  ArrowLeft, 
  ChevronRight, 
  Award, 
  Building2, 
  GraduationCap, 
  Compass, 
  Share2,
  Calendar,
  CheckCircle2,
  BookOpen
} from 'lucide-react';
import { LEADERSHIP_MESSAGES, LEADERSHIP_ROSTER_LIST } from '../data/leadershipMessages';
import { animatePageIn } from '../animations/pageTransitions';
import cmsStore from '../lib/cmsStore';
import useCms from '../lib/useCms';

export default function LeadershipMessagePage({ defaultSlug }) {
  const { slug } = useParams();
  const pageRef = useRef(null);

  // Dynamic reactive leadership list from CMS
  const allLeadership = useCms(() => cmsStore.getLeadership());

  // Determine active key
  let currentKey = slug || defaultSlug || 'rector';

  // Normalize slug aliases
  if (currentKey.includes('rector')) currentKey = 'rector';
  else if (currentKey.includes('principal')) currentKey = 'principal';
  else if (currentKey.includes('bishop') || currentKey.includes('mdes')) currentKey = 'bishop';
  else if (currentKey.includes('financ') || currentKey.includes('roshan')) currentKey = 'financial-officer';
  else if (currentKey.includes('iqac') || currentKey.includes('thomas') || currentKey.includes('gunaseelan')) currentKey = 'iqac-coordinator';
  else if (currentKey.includes('pg') || currentKey.includes('noor') || currentKey.includes('mubasheer')) currentKey = 'pg-coordinator';

  const leader = LEADERSHIP_MESSAGES[currentKey];

  useEffect(() => {
    window.scrollTo(0, 0);
    animatePageIn(pageRef);
  }, [currentKey]);

  // If leader doesn't exist or is toggled inactive/hidden in CMS, redirect to main leadership directory
  const isCurrentLeaderActive = (() => {
    if (!allLeadership || allLeadership.length === 0) return true;
    const match = allLeadership.find(l => {
      const lid = (l.id || '').toLowerCase();
      const lname = (l.name || '').toLowerCase();
      if (currentKey === 'rector') return lid === 'rector' || lname.includes('lourdu');
      if (currentKey === 'principal') return lid === 'principal' || lname.includes('ravi');
      if (currentKey === 'bishop') return lid === 'president-mdes' || lid === 'bishop-president' || lname.includes('francis');
      if (currentKey === 'financial-officer') return lid === 'finance-officer' || lid === 'financial' || lname.includes('roshan');
      if (currentKey === 'iqac-coordinator') return lid === 'iqac-coord' || lname.includes('gunaseelan') || lname.includes('thomas');
      if (currentKey === 'pg-coordinator') return lid === 'pg-coordinator' || lname.includes('mubasheer') || lname.includes('noor');
      return lid === currentKey;
    });
    if (!match) return true;
    return match.status !== 'inactive' && match.status !== 'draft';
  })();

  if (!leader || !isCurrentLeaderActive) {
    return <Navigate to="/about?tab=leadership" replace />;
  }

  // Filter other leaders to exclude any who are marked inactive
  const inactiveKeys = new Set(
    (allLeadership || [])
      .filter(l => l.status === 'inactive' || l.status === 'draft')
      .map(l => {
        const lid = (l.id || '').toLowerCase();
        const lname = (l.name || '').toLowerCase();
        if (lid === 'rector' || lname.includes('lourdu')) return 'rector';
        if (lid === 'principal' || lname.includes('ravi')) return 'principal';
        if (lid === 'president-mdes' || lname.includes('francis')) return 'bishop';
        if (lid === 'finance-officer' || lname.includes('roshan')) return 'financial-officer';
        if (lid === 'iqac-coord' || lname.includes('gunaseelan')) return 'iqac-coordinator';
        if (lid === 'pg-coordinator' || lname.includes('mubasheer')) return 'pg-coordinator';
        return lid;
      })
  );

  const otherLeaders = LEADERSHIP_ROSTER_LIST.filter(l => l.slug !== leader.slug && !inactiveKeys.has(l.slug));

  return (
    <div ref={pageRef} className="min-h-screen bg-slate-50 text-[#0B1F4E] pt-24 pb-20">
      
      {/* 1. BREADCRUMB & TOP INSTITUTIONAL BAR */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          <nav className="flex items-center space-x-2 text-slate-500 font-sans">
            <Link to="/" className="hover:text-[#0B1F4E] transition-colors flex items-center">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <Link to="/about?tab=leadership" className="hover:text-[#0B1F4E] transition-colors">
              Governance & Vision
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[#0B1F4E] font-bold font-serif">{leader.designation}</span>
          </nav>

          <Link
            to="/about?tab=leadership"
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#0B1F4E] hover:text-[#a88530] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Administrative Directory</span>
          </Link>
        </div>
      </div>

      {/* 2. HERO BANNER */}
      <div className="bg-gradient-to-r from-[#071A33] via-[#0B1F4E] to-[#152e6d] text-white py-12 sm:py-16 px-4 sm:px-6 lg:px-8 shadow-inner relative overflow-hidden">
        {/* Subtle decorative background circle */}
        <div className="absolute right-0 -bottom-20 w-96 h-96 rounded-full bg-[#FFD84A]/5 blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-xs border border-white/15 text-xs font-bold uppercase tracking-wider text-[#FFD84A]">
              <Building2 className="w-3.5 h-3.5" />
              <span>{leader.office}</span>
            </div>

            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              {leader.theme}
            </h1>

            <p className="text-slate-300 text-xs sm:text-sm font-sans flex items-center gap-3">
              <span>{leader.institution}</span>
              <span className="w-1 h-1 rounded-full bg-[#FFD84A]" />
              <span className="text-[#FFD84A] font-semibold">{leader.tenure}</span>
            </p>
          </div>
        </div>
      </div>

      {/* 3. MAIN CONTENT: 2-COLUMN ACADEMIC LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT SIDEBAR: LEADER PORTRAIT & CREDENTIAL CARD (4 COLS) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden sticky top-28">
              
              {/* Leader Photo */}
              <div className="relative w-full aspect-[4/5] bg-slate-900 overflow-hidden">
                <img
                  src={leader.image}
                  alt={leader.name}
                  style={{ objectPosition: leader.objectPosition }}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4E]/80 via-transparent to-transparent" />
                
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-[#FFD84A] text-[#071A33] inline-block mb-1.5 shadow-xs">
                    Institutional Leader
                  </span>
                  <p className="text-xs text-slate-200 font-sans font-medium">{leader.office}</p>
                </div>
              </div>

              {/* Title & Info */}
              <div className="p-6 space-y-4 text-center border-t border-slate-100">
                <div className="space-y-1">
                  <h2 className="font-serif font-bold text-xl sm:text-2xl text-[#0B1F4E] leading-snug">
                    {leader.name}
                  </h2>
                  <p className="text-sm font-bold text-[#a88530] font-sans">
                    {leader.designation}
                  </p>
                  {leader.postNominal && (
                    <p className="text-xs text-slate-500 font-sans font-medium">
                      {leader.postNominal}
                    </p>
                  )}
                </div>

                {/* Strategic Highlights */}
                {leader.highlights && (
                  <div className="pt-4 border-t border-slate-100 text-left space-y-2.5">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      Core Institutional Tenets
                    </p>
                    <div className="space-y-2">
                      {leader.highlights.map((h, i) => (
                        <div key={i} className="flex items-start space-x-2 text-xs">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#0B1F4E] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-slate-500 font-medium">{h.label}: </span>
                            <span className="text-slate-900 font-bold">{h.value}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>

          {/* RIGHT COLUMN: OFFICIAL STATEMENT & LETTER (8 COLS) */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* White Paper / Letter Card */}
            <article className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 lg:p-12 shadow-sm space-y-8 relative">
              
              {/* Institutional Watermark / Crest Seal */}
              <div className="flex items-center justify-between pb-6 border-b border-slate-100">
                <div className="flex items-center space-x-3.5">
                  <img
                    src="/assets/images/logo/logo-main.png"
                    alt="St. Philomena's Official Crest"
                    className="w-12 h-12 object-contain"
                  />
                  <div>
                    <h3 className="font-serif font-bold text-sm sm:text-base text-[#0B1F4E] leading-tight">
                      St. Philomena’s College (Autonomous)
                    </h3>
                    <p className="text-[11px] text-slate-500 font-sans">
                      Mysuru, Karnataka · Est. 1946 · NAAC Cycle III Grade B++
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block text-right">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#a88530] block">
                    Official Message
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Academic Year 2025–26</span>
                </div>
              </div>

              {/* Callout / Pull Quote */}
              <div className="relative p-6 sm:p-7 rounded-2xl bg-amber-50/60 border-l-4 border-[#C9A84C] text-[#071A33] space-y-2">
                <Quote className="w-8 h-8 text-[#C9A84C]/40 absolute top-4 right-4" />
                <p className="font-serif italic text-base sm:text-lg leading-relaxed text-slate-900 font-medium">
                  "{leader.quote}"
                </p>
              </div>

              {/* Full Paragraphs */}
              <div className="prose prose-slate max-w-none space-y-5 text-slate-700 text-sm sm:text-base leading-relaxed font-sans">
                {leader.paragraphs.map((p, idx) => (
                  <p key={idx} className="text-justify leading-relaxed">
                    {p}
                  </p>
                ))}
              </div>

              {/* Official Valediction & Signature Block */}
              <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
                <div className="space-y-1">
                  <p className="text-xs uppercase tracking-widest text-slate-400 font-bold font-sans">
                    Cordially & In Service,
                  </p>
                  <p className="font-serif font-extrabold text-base sm:text-lg text-[#0B1F4E]">
                    {leader.signature.name}
                  </p>
                  <p className="text-xs font-bold text-[#a88530] font-sans">
                    {leader.signature.title}
                  </p>
                  <p className="text-xs text-slate-500 font-sans">
                    {leader.signature.institution}
                  </p>
                </div>

                <div className="px-4 py-2 rounded-lg bg-slate-50 border border-slate-200 text-right">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block">
                    College Motto
                  </span>
                  <span className="font-serif italic text-xs text-[#0B1F4E] font-bold">
                    Caritas in Scientia
                  </span>
                </div>
              </div>

            </article>

            {/* CROSS-NAVIGATION: EXPLORE OTHER INSTITUTIONAL LEADERS */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-lg text-[#0B1F4E]">
                  Other Institutional Leadership Messages
                </h3>
                <Link
                  to="/about?tab=leadership"
                  className="text-xs font-bold text-[#0B1F4E] hover:text-[#a88530] transition-colors flex items-center space-x-1"
                >
                  <span>View All</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {otherLeaders.map((other) => (
                  <Link
                    key={other.slug}
                    to={`/leadership/${other.slug}`}
                    className="bg-white rounded-xl border border-slate-200 p-4 hover:border-[#C9A84C] hover:shadow-md transition-all duration-200 group flex flex-col justify-between"
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden shrink-0 bg-slate-900 border border-slate-200">
                        <img
                          src={other.image}
                          alt={other.name}
                          style={{ objectPosition: other.objectPosition }}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-[#0B1F4E] truncate group-hover:text-[#a88530] transition-colors">
                          {other.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate font-sans">
                          {other.designation}
                        </p>
                      </div>
                    </div>

                    <div className="text-[11px] font-bold text-[#0B1F4E] group-hover:text-[#a88530] transition-colors flex items-center justify-end space-x-1 pt-2 border-t border-slate-100">
                      <span>Read Message</span>
                      <ChevronRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
}
