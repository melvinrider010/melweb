import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, Search, ExternalLink } from 'lucide-react';
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
      setScrolled(window.scrollY > 20);
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
    }, 140);
  };

  const handleNavClick = (item) => {
    if (item.megaKey) {
      setActiveMegaKey(activeMegaKey === item.megaKey ? null : item.megaKey);
    } else if (item.path) {
      setActiveMegaKey(null);
      navigate(item.path);
    }
  };

  // Complete desktop navigation items (All 11 items visible with smart responsive labels)
  const desktopNavItems = [
    { label: 'Home', shortLabel: 'Home', path: '/' },
    { label: 'About Us', shortLabel: 'About Us', path: '/about', megaKey: 'about' },
    { label: 'Academics', shortLabel: 'Academics', path: '/academics', megaKey: 'academics' },
    { label: 'Departments', shortLabel: 'Departments', path: '/departments', megaKey: 'departments' },
    { label: 'Admissions', shortLabel: 'Admissions', path: '/admissions', megaKey: 'admissions' },
    { label: 'Examinations', shortLabel: 'Exams', path: '/examinations', megaKey: 'examinations' },
    { label: 'Research', shortLabel: 'Research', path: '/research', megaKey: 'research' },
    { label: 'Student Support & Amenities', shortLabel: 'Student Support', path: '/student-support', megaKey: 'studentSupport' },
    { label: 'Mandatory Disclosure', shortLabel: 'Compliance', path: '/mandatory-disclosure', megaKey: 'compliance' },
    { label: 'Gallery', shortLabel: 'Gallery', path: '/gallery' },
    { label: 'Contact', shortLabel: 'Contact', path: '/contact' }
  ];

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={handleMouseLeave}
        className={`sticky top-0 z-40 transition-all duration-300 w-full max-w-full ${
          scrolled ? 'shadow-md bg-[#0F3B70] border-b border-[#FFC928]/30' : 'bg-[#1C5496] border-b border-blue-400/20'
        }`}
      >
        
        {/* LEVEL 1: COMPACT INSTITUTIONAL TOP UTILITY BAR */}
        <div className="bg-[#071A33] text-slate-200 text-xs py-1.5 px-3 sm:px-6 border-b border-slate-800 font-medium">
          <div className="max-w-[1720px] mx-auto flex justify-between items-center gap-2">
            
            {/* Top Quick Links - Scrollable on very small screens, always accessible */}
            <div className="flex items-center space-x-2 sm:space-x-3.5 overflow-x-auto no-scrollbar whitespace-nowrap text-[11px] sm:text-xs">
              <Link to="/iqac" className="hover:text-[#FFD84A] transition-colors font-bold text-slate-200 shrink-0">IQAC</Link>
              <span className="text-slate-700 shrink-0">|</span>
              <Link to="/iic" className="hover:text-[#FFD84A] transition-colors font-bold text-slate-200 shrink-0">IIC</Link>
              <span className="text-slate-700 shrink-0">|</span>
              <Link to="/nirf" className="hover:text-[#FFD84A] transition-colors font-bold text-slate-200 shrink-0">NIRF</Link>
              <span className="text-slate-700 shrink-0">|</span>
              <Link to="/naac" className="hover:text-[#FFD84A] transition-colors font-bold text-slate-200 shrink-0">NAAC B++</Link>
              <span className="text-slate-700 hidden lg:inline shrink-0">|</span>
              <Link to="/anthems" className="hover:text-[#FFD84A] transition-colors hidden lg:inline font-medium shrink-0">ANTHEMS</Link>
              <span className="text-slate-700 hidden lg:inline shrink-0">|</span>
              <a href="https://swayam.gov.in/" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFD84A] transition-colors hidden lg:inline font-medium shrink-0">SWAYAM ↗</a>
              <span className="text-slate-700 hidden sm:inline shrink-0">|</span>
              <Link to="/alumni" className="hover:text-[#FFD84A] transition-colors hidden sm:inline font-medium shrink-0">Alumni</Link>
              <span className="text-slate-700 hidden sm:inline shrink-0">|</span>
              <Link to="/contact" className="hover:text-[#FFD84A] transition-colors hidden sm:inline font-medium shrink-0">Contact</Link>
            </div>

            {/* Global Search Trigger */}
            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-md text-xs text-slate-200 transition-colors font-medium cursor-pointer shrink-0"
                title="Search Portal (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-[#FFD84A]" />
                <span className="hidden sm:inline">Search</span>
                <kbd className="hidden md:inline-block px-1.5 py-0.2 bg-slate-900 border border-slate-700 rounded text-[10px] font-mono text-slate-400">Ctrl+K</kbd>
              </button>
            </div>

          </div>
        </div>

        {/* LEVEL 2: MAIN BRAND & FLEXIBLE PRIMARY NAVIGATION BAR (NO OVERLAPPING) */}
        <div className="px-3 sm:px-6 py-2.5 w-full relative">
          <div className="max-w-[1720px] mx-auto flex justify-between items-center gap-3 w-full min-w-0">
            
            {/* Controlled Width Brand Logo & Title (Fixed Shrink-0, Never Overlapped) */}
            <Link to="/" onClick={() => setActiveMegaKey(null)} className="flex items-center space-x-2.5 group shrink-0 z-10 min-w-0">
              <img
                src="/assets/logo.png"
                alt="St. Philomena's Crest"
                className="h-10 sm:h-11 w-auto object-contain group-hover:scale-105 transition-transform shrink-0"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div className="shrink-0 min-w-0">
                <h1 className="font-serif font-bold text-sm sm:text-base xl:text-lg leading-tight tracking-wide text-white group-hover:text-[#FFD84A] transition-colors whitespace-nowrap">
                  St. Philomena's College
                </h1>
                <p className="text-[10px] sm:text-[11px] text-[#FFD84A] font-bold tracking-wider uppercase whitespace-nowrap">
                  (Autonomous), Mysuru · Est. 1946
                </p>
              </div>
            </Link>

            {/* Desktop Navigation Bar - Active only on wide screens (>=1360px) to guarantee zero overlap */}
            <nav className="hidden min-[1360px]:flex items-center justify-end flex-1 min-w-0 gap-1 2xl:gap-1.5" aria-label="Main Navigation">
              
              {/* All 11 Desktop Nav Items */}
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
                      className={`px-2 2xl:px-2.5 py-1.5 rounded-md text-[13px] 2xl:text-[14px] font-medium transition-all flex items-center whitespace-nowrap shrink-0 cursor-pointer ${
                        isMegaOpen
                          ? 'bg-[#071A33] text-[#FFD84A] shadow-xs'
                          : isRouteActive
                          ? 'bg-[#FFC928] text-[#071A33] shadow-xs font-bold'
                          : 'text-white hover:bg-white/10 hover:text-[#FFD84A]'
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.megaKey && (
                        <ChevronDown
                          className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 shrink-0 ${
                            isMegaOpen ? 'rotate-180 text-[#FFD84A]' : 'opacity-70'
                          }`}
                        />
                      )}
                    </button>
                  </div>
                );
              })}

            </nav>

            {/* Admissions 2026-27 CTA (Shown on extra-large screens >=1500px) */}
            <div className="hidden min-[1500px]:block shrink-0 ml-2">
              <Link
                to="/admissions"
                onClick={() => setActiveMegaKey(null)}
                className="btn-gold px-3.5 py-1.5 rounded-md text-xs font-bold shadow-xs inline-block whitespace-nowrap hover:scale-102 transition-transform"
              >
                Admissions 2026–27
              </Link>
            </div>

            {/* Tablet & Mobile Header Action Strip (<1360px) */}
            <div className="min-[1360px]:hidden flex items-center space-x-2 shrink-0">
              
              {/* Compact Admissions CTA for Tablet */}
              <Link
                to="/admissions"
                className="hidden sm:inline-flex btn-gold text-xs font-bold px-3 py-1.5 rounded-md shadow-xs whitespace-nowrap"
              >
                Admissions 2026–27
              </Link>

              {/* Mobile Drawer Trigger */}
              <button
                onClick={() => setMobileDrawerOpen(true)}
                className="p-2 rounded-md text-white hover:bg-white/10 focus:outline-none shrink-0 cursor-pointer flex items-center space-x-1 border border-white/20"
                aria-label="Open Navigation Menu"
              >
                <Menu className="w-5 h-5" />
                <span className="text-xs font-bold uppercase tracking-wider hidden sm:inline">Menu</span>
              </button>
            </div>

          </div>
        </div>

        {/* ANIMATED MEGA MENU OVERLAY CONTAINER */}
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
