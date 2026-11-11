import React, { useEffect } from 'react';
import { useParams, Link, useNavigate, Navigate, useLocation } from 'react-router-dom';
import { 
  FileText, 
  ArrowLeft, 
  Calendar, 
  User, 
  Share2, 
  Clock, 
  CheckCircle2, 
  Sparkles,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import cmsStore from '../lib/cmsStore';
import useCms from '../lib/useCms';

export default function DynamicCmsPage({ defaultSlug } = {}) {
  const { slug } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const pages = useCms(() => cmsStore.getPages());

  const effectiveSlug = slug || defaultSlug || location.pathname.replace(/^\//, '');
  const cleanSlug = (effectiveSlug || '').toLowerCase().trim().replace(/^\//, '');

  // Core institutional routes: redirect to their canonical, fully-designed public pages
  const canonicalRouteMap = {
    'vision-mission': '/about?tab=vision',
    'vision': '/about?tab=vision',
    'mission': '/about?tab=vision',
    'history': '/about?tab=history',
    'about': '/about',
    'coat-of-arms': '/about?tab=coat-of-arms',
    'former-bishops': '/about?tab=bishops',
    'former-principals': '/about?tab=principals',
    'mdes': '/about?tab=mdes',
    'organogram': '/about?tab=organogram',
    'governing-body': '/about?tab=governing-body',
    'statutory-bodies': '/about?tab=statutory-bodies',
    'leadership': '/about?tab=leadership',
    'rectors-message': '/rectors-message',
    'principals-message': '/principals-message',
    'academics': '/academics',
    'admissions': '/admissions',
    'examinations': '/examinations',
    'research': '/research',
    'student-life': '/student-life',
    'student-support': '/student-life',
    'iqac': '/iqac',
    'naac': '/naac',
    'nirf': '/nirf',
    'alumni': '/alumni',
    'contact': '/contact',
    'gallery': '/gallery',
    'library': '/library',
    'magazine': '/magazine'
  };

  if (canonicalRouteMap[cleanSlug]) {
    return <Navigate to={canonicalRouteMap[cleanSlug]} replace />;
  }

  const page = pages.find(p => (p.slug || '').toLowerCase() === cleanSlug) || cmsStore.getPageBySlug(cleanSlug);

  useEffect(() => {
    if (page && page.seoTitle) {
      document.title = page.seoTitle;
    }
  }, [page]);

  if (!page) {
    return (
      <div className="min-h-[60vh] bg-[#FAF9F6] text-[#071A33] py-16 px-4 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-3xl font-serif font-extrabold text-slate-900">Custom Page Not Found</h2>
        <p className="text-sm text-slate-600 max-w-md text-center">
          The requested CMS page <code className="bg-slate-200 px-2 py-0.5 rounded text-xs font-mono">/pages/{cleanSlug}</code> has not been published or does not exist.
        </p>
        <Link
          to="/"
          className="btn-primary-blue py-2 px-5 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 mt-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8 animate-fadeIn">
      <div className="max-w-[1200px] mx-auto space-y-8">
        
        {/* 1. BREADCRUMB NAVIGATION */}
        <nav className="flex items-center space-x-2 text-xs text-slate-500 font-sans">
          <Link to="/" className="hover:text-[#1C5496] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/about" className="hover:text-[#1C5496] transition-colors">Pages</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="font-bold text-[#1C5496] truncate">{page.title}</span>
        </nav>

        {/* 2. HERO BANNER */}
        <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden space-y-6">
          
          {page.featuredImage && (
            <div className="w-full h-56 sm:h-72 bg-slate-900 relative overflow-hidden">
              <img
                src={page.featuredImage}
                alt={page.title}
                className="w-full h-full object-cover opacity-90"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/assets/banner-college.jpg';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#1C5496] text-white font-mono font-bold text-xs px-3 py-1 rounded-md uppercase tracking-wider">
                {page.pageType || 'Institutional Page'}
              </span>
              <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-3 py-1 rounded-md font-semibold flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Published Content
              </span>
            </div>

            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
              {page.title}
            </h1>

            {page.excerpt && (
              <p className="text-sm sm:text-base text-slate-600 font-sans leading-relaxed border-l-4 border-[#C9A84C] pl-4 py-1 italic">
                {page.excerpt}
              </p>
            )}

            <div className="flex items-center space-x-6 text-xs text-slate-500 font-mono pt-2 border-t border-slate-100">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Last Updated: {page.lastUpdated || '2026-09-02'}</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <User className="w-3.5 h-3.5 text-[#1C5496]" />
                <span>St. Philomena's College Documentation</span>
              </span>
            </div>
          </div>

        </div>

        {/* 3. MAIN BODY CONTENT */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-sm space-y-6">
          <div className="prose prose-slate max-w-none text-slate-800 text-sm sm:text-base leading-relaxed font-sans space-y-4">
            {page.content.split('\n\n').map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <Link
              to="/"
              className="inline-flex items-center text-xs font-bold text-[#1C5496] hover:underline space-x-1"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>

            <span className="text-[11px] font-mono text-slate-400">
              CMS Dynamic Route: /pages/{page.slug}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}
