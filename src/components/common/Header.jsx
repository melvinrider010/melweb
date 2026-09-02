import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, Search, Phone, ExternalLink, Award, Sparkles } from 'lucide-react';
import collegeInfo from '../../data/college_info.json';
import { MEGA_MENU_DATA } from '../../data/megaMenuData';
import MegaMenuOverlay from './MegaMenuOverlay';
import MobileNavDrawer from './MobileNavDrawer';
import SearchModal from './SearchModal';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMegaKey, setActiveMegaKey] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const hoverTimeoutRef = useRef(null);
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOpenSearch = () => setSearchModalOpen(true);
    window.addEventListener('open_search_modal', handleOpenSearch);
    return () => window.removeEventListener('open_search_modal', handleOpenSearch);
  }, []);

  // Close mega menu when clicking outside header
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (headerRef.current && !headerRef.current.contains(e.target)) {
        setActiveMegaKey(null);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  // Keyboard accessibility: Escape key closes mega menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setActiveMegaKey(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleMouseEnter = (key) => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    setActiveMegaKey(key);
  };

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveMegaKey(null);
    }, 150);
  };

  const handleNavClick = (item) => {
    if (item.megaKey) {
      setActiveMegaKey(activeMegaKey === item.megaKey ? null : item.megaKey);
    } else if (item.path) {
      setActiveMegaKey(null);
      navigate(item.path);
    }
  };

  // Exactly matching navigation structure with IQAC
  const desktopNavItems = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT US', path: '/about', megaKey: 'about' },
    { label: 'ACADEMICS', path: '/academics', megaKey: 'academics' },
    { label: 'EXAMINATION', path: '/examinations', megaKey: 'examinations' },
    { label: 'RESOURCE', path: '/resources', megaKey: 'research' },
    { label: 'STUDENT SUPPORT', path: '/student-support', megaKey: 'studentSupport' },
    { label: 'MANDATORY DISCLOSURE', path: '/mandatory-disclosure', megaKey: 'compliance' },
    { label: 'IQAC', path: '/iqac', megaKey: 'iqac' },
    { label: 'ALUMNI', path: '/alumni' },
    { label: 'CONTACT US', path: '/contact' }
  ];

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 z-40 w-full max-w-full shadow-md transition-all duration-300"
      >
        
        {/* =========================================================================
            TIER 1: TOP INSTITUTIONAL UTILITY BAR (Midnight Navy #060f26)
            ========================================================================= */}
        <div className="bg-[#060f26] text-slate-200 text-[11px] sm:text-xs py-1.5 px-3 sm:px-8 border-b border-white/10 font-medium">
          <div className="max-w-[1720px] mx-auto flex justify-between items-center gap-2">
            
            {/* Accreditation & Institutional Identity */}
            <div className="flex items-center space-x-2 sm:space-x-3 overflow-x-auto no-scrollbar whitespace-nowrap text-slate-300">
              <span className="font-semibold text-[#F0D98C] flex items-center">
                <Award className="w-3.5 h-3.5 mr-1 text-[#C9A84C]" />
                UGC Autonomous · NAAC Cycle III B++
              </span>
              <span className="text-slate-600 hidden md:inline">|</span>
              <span className="hidden md:inline">Affiliated to University of Mysore</span>
              <span className="text-slate-600 hidden lg:inline">|</span>
              <span className="hidden lg:inline text-slate-300">Govt. Aid No. 1951</span>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <Link to="/alumni" className="hover:text-[#F0D98C] transition-colors hidden sm:inline">Alumni Network</Link>
            </div>

            {/* Quick Contact & Search */}
            <div className="flex items-center space-x-3 shrink-0">
              <div className="hidden sm:flex items-center space-x-1 text-slate-300">
                <Phone className="w-3 h-3 text-[#C9A84C]" />
                <span>+91 821 2490728</span>
              </div>
              <span className="text-slate-600 hidden sm:inline">|</span>
              <Link to="/contact" className="hover:text-[#F0D98C] transition-colors text-slate-300">
                Contact Desk
              </Link>
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-xs text-slate-200 transition-colors font-medium cursor-pointer"
                title="Search Portal (Ctrl + K)"
              >
                <Search className="w-3 h-3 text-[#F0D98C]" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden md:inline-block px-1 bg-black/40 border border-white/20 rounded text-[9px] font-mono text-slate-300">Ctrl+K</kbd>
              </button>
            </div>

          </div>
        </div>

        {/* =========================================================================
            TIER 2: BRAND IDENTITY & ACTION BAR (Crisp White #FFFFFF)
            ========================================================================= */}
        <div className="bg-white px-3 sm:px-8 py-2 sm:py-2.5 border-b border-slate-200/80">
          <div className="max-w-[1720px] mx-auto flex justify-between items-center gap-4">
            
            {/* Official College Header Logo Banner */}
            <Link 
              to="/" 
              onClick={() => setActiveMegaKey(null)} 
              className="flex items-center group shrink min-w-0 py-0.5"
            >
              <img
                src="/assets/college-header-logo.png"
                alt="St. Philomena's College (Autonomous), Mysuru"
                className="h-12 sm:h-16 md:h-20 lg:h-22 w-auto max-w-[65vw] sm:max-w-none object-contain group-hover:opacity-95 transition-opacity"
              />
            </Link>

            {/* Right Action Tools (Admissions CTA + Mobile Trigger) */}
            <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
              
              {/* Admissions Helpline (Desktop) */}
              <div className="hidden xl:flex flex-col items-end pr-2 text-right">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Admissions Office</span>
                <span className="text-sm font-extrabold font-serif text-[#0B1F4E]">+91 821 4268800</span>
              </div>

              {/* Gold Admissions CTA Button */}
              <a
                href="https://student.stphiloserp.in/"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setActiveMegaKey(null)}
                className="btn-gold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-md whitespace-nowrap"
              >
                <span>Apply Online 2026–27</span>
              </a>

              {/* Mobile Drawer Trigger (Visible on screens < 1200px) */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="min-[1200px]:hidden p-2 sm:p-2.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0B1F4E] border border-slate-300 cursor-pointer flex items-center space-x-1.5"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5 text-[#0B1F4E]" />
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline text-[#0B1F4E]">Menu</span>
              </button>

            </div>

          </div>
        </div>

        {/* =========================================================================
            TIER 3: DEDICATED FULL-WIDTH PRIMARY NAVIGATION BAR (#0B1F4E Institutional Navy)
            ========================================================================= */}
        <nav 
          className="hidden min-[1100px]:block bg-[#0B1F4E] border-b-2 border-[#C9A84C] text-white overflow-x-auto no-scrollbar" 
          aria-label="Main Navigation"
        >
          <div className="max-w-[1720px] mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 flex items-center justify-between min-w-max gap-2">
            
            <div className="flex items-center space-x-0.5 xl:space-x-1 2xl:space-x-1.5">
              {desktopNavItems.map((item) => {
                const isMegaOpen = activeMegaKey === item.megaKey;
                const isRouteActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));

                return (
                  <div
                    key={item.label}
                    onMouseEnter={() => item.megaKey && handleMouseEnter(item.megaKey)}
                    className="relative shrink-0"
                  >
                    <button
                      onClick={() => handleNavClick(item)}
                      aria-expanded={isMegaOpen}
                      aria-haspopup={item.megaKey ? 'menu' : 'false'}
                      className={`px-2 xl:px-2.5 2xl:px-3 py-2.5 xl:py-3 text-[11.5px] xl:text-[12px] 2xl:text-[13px] font-bold tracking-wide transition-all flex items-center whitespace-nowrap cursor-pointer relative ${
                        isMegaOpen
                          ? 'text-[#F0D98C] bg-white/10'
                          : isRouteActive
                          ? 'text-[#F0D98C]'
                          : 'text-slate-100 hover:text-[#F0D98C] hover:bg-white/5'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.megaKey && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 ml-0.5 xl:ml-1 transition-transform duration-200 shrink-0 ${
                            isMegaOpen ? 'rotate-180 text-[#F0D98C]' : 'opacity-70 text-slate-300'
                          }`}
                        />
                      )}
                      {(isRouteActive || isMegaOpen) && (
                        <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#C9A84C]" />
                      )}
                    </button>
                  </div>
                );
              })}
            </div>

          </div>
        </nav>

        {/* =========================================================================
            ANIMATED MEGA MENU OVERLAY CONTAINER
            ========================================================================= */}
        {activeMegaKey && MEGA_MENU_DATA[activeMegaKey] && (
          <div onMouseEnter={() => handleMouseEnter(activeMegaKey)}>
            <MegaMenuOverlay
              menuData={MEGA_MENU_DATA[activeMegaKey]}
              isOpen={Boolean(activeMegaKey)}
              onClose={() => setActiveMegaKey(null)}
            />
          </div>
        )}

      </header>

      {/* MOBILE DRAWER SUBMENU SLIDE DRILLDOWN */}
      <MobileNavDrawer
        isOpen={mobileDrawerOpen}
        onClose={() => setMobileDrawerOpen(false)}
        onOpenSearch={() => setSearchModalOpen(true)}
      />

      {/* GLOBAL SEARCH MODAL */}
      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />
    </>
  );
}
