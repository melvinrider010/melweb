import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ChevronDown, Menu, X, Search, Phone, ExternalLink, Sparkles } from 'lucide-react';
import collegeInfo from '../../data/college_info.json';
import { MEGA_MENU_DATA } from '../../data/megaMenuData';
import cmsStore from '../../lib/cmsStore';
import MegaMenuOverlay from './MegaMenuOverlay';
import MobileNavDrawer from './MobileNavDrawer';
import SearchModal from './SearchModal';

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [activeMegaKey, setActiveMegaKey] = useState(null);
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const [megaMenus, setMegaMenus] = useState(() => {
    try {
      const stored = cmsStore.getMenus ? cmsStore.getMenus() : null;
      if (stored && Object.keys(stored).length > 0) return stored;
    } catch (e) {}
    return MEGA_MENU_DATA;
  });

  const [headerConfig, setHeaderConfig] = useState(() => {
    try {
      return cmsStore.getHeaderConfig ? cmsStore.getHeaderConfig() : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      try {
        const stored = cmsStore.getMenus ? cmsStore.getMenus() : null;
        if (stored && Object.keys(stored).length > 0) setMegaMenus(stored);
      } catch (e) {}
      try {
        if (cmsStore.getHeaderConfig) {
          setHeaderConfig({ ...cmsStore.getHeaderConfig() });
        }
      } catch (e) {}
    };
    window.addEventListener('cms_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cms_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

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

  const topBar = headerConfig?.topBar || {};
  const showTopBar = topBar.enabled !== false;
  const announcementText = topBar.announcementText;
  const announcementLink = topBar.announcementLink;
  const topPhone = topBar.phone || collegeInfo.phone || '+91 9008580707, 9008028258';
  const showContactDesk = topBar.showContactDesk !== false;
  const contactDeskLabel = topBar.contactDeskLabel || 'Contact Desk';
  const contactDeskLink = topBar.contactDeskLink || '/contact';
  const showSearch = topBar.showSearch !== false;

  const branding = headerConfig?.branding || {};
  const logoUrl = branding.logoUrl || '/assets/images/logo/official_college_banner_logo_transparent.png';
  const fallbackLogoUrl = branding.fallbackLogoUrl || '/assets/images/logo/official_college_banner_logo.png';
  const altText = branding.altText || "St. Philomena's College (Autonomous), Mysuru";
  const homeLink = branding.homeLink || '/';

  const cta = headerConfig?.ctaButton || {};
  const showCta = cta.enabled !== false;
  const ctaLabel = cta.label || 'Apply Online 2026–27';
  const ctaUrl = cta.url || 'https://student.stphiloserp.in/';
  const ctaTarget = cta.target || '_blank';

  const navItems = (headerConfig?.navItems && Array.isArray(headerConfig.navItems) && headerConfig.navItems.length > 0)
    ? headerConfig.navItems
    : desktopNavItems;

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={handleMouseLeave}
        className="sticky top-0 z-40 w-full max-w-full shadow-md transition-all duration-300"
      >
        
        {/* =========================================================================
            TIER 1: TOP INSTITUTIONAL UTILITY BAR (#0B1F4E Universal Gradient)
            ========================================================================= */}
        {showTopBar && (
          <div className="bg-gradient-to-r from-[#061330] via-[#0B1F4E] to-[#061330] text-slate-200 text-[11px] sm:text-xs py-1.5 px-3 sm:px-8 border-b border-white/10 font-medium">
            <div className="max-w-[1720px] mx-auto flex justify-between items-center gap-2">
              
              {/* Optional Announcement Banner */}
              <div className="min-w-0 pr-2">
                {announcementText ? (
                  <div className="flex items-center space-x-2 text-[11px] text-slate-300 truncate">
                    <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
                    {announcementLink ? (
                      <Link to={announcementLink} className="hover:text-[#F0D98C] transition-colors truncate font-medium">
                        {announcementText}
                      </Link>
                    ) : (
                      <span className="truncate">{announcementText}</span>
                    )}
                  </div>
                ) : (
                  <div className="hidden sm:block"></div>
                )}
              </div>

              {/* Quick Contact & Search */}
              <div className="flex items-center space-x-3 shrink-0">
                {topBar.showPhone !== false && topPhone && (
                  <a href={`tel:${topPhone.split(/[,/]/)[0].trim().replace(/\s+/g, '')}`} className="hidden sm:flex items-center space-x-1.5 text-slate-300 hover:text-[#F0D98C] transition-colors">
                    <Phone className="w-3 h-3 text-[#C9A84C]" />
                    <span className="font-mono font-bold">{topPhone.split(/[,/]/)[0].trim()}</span>
                  </a>
                )}
                {topBar.showPhone !== false && showContactDesk && <span className="text-slate-600 hidden sm:inline">|</span>}
                {showContactDesk && (
                  <Link to={contactDeskLink} className="hover:text-[#F0D98C] transition-colors text-slate-300">
                    {contactDeskLabel}
                  </Link>
                )}
                {showSearch && (
                  <button
                    onClick={() => setSearchModalOpen(true)}
                    className="flex items-center space-x-1.5 px-2.5 py-0.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-md text-xs text-slate-200 transition-colors font-medium cursor-pointer"
                    title="Search Portal (Ctrl + K)"
                  >
                    <Search className="w-3 h-3 text-[#F0D98C]" />
                    <span className="hidden sm:inline">Search</span>
                    <kbd className="hidden md:inline-block px-1 bg-black/40 border border-white/20 rounded text-[9px] font-mono text-slate-300">Ctrl+K</kbd>
                  </button>
                )}
              </div>

            </div>
          </div>
        )}

        {/* =========================================================================
            TIER 2: BRAND IDENTITY & ACTION BAR (Crisp White #FFFFFF)
            ========================================================================= */}
        <div className="bg-white px-3 sm:px-8 py-2 sm:py-2.5 border-b border-slate-200/80">
          <div className="max-w-[1720px] mx-auto flex justify-between items-center gap-4">
            
            {/* Official College Header Brand Logo */}
            <Link 
              to={homeLink} 
              onClick={() => setActiveMegaKey(null)} 
              className="flex items-center group shrink min-w-0 py-1"
            >
              <img
                src={logoUrl}
                alt={altText}
                className="h-12 sm:h-14 md:h-16 lg:h-18 w-auto max-w-[80vw] sm:max-w-[620px] object-contain drop-shadow-2xs group-hover:scale-[1.01] transition-transform duration-200"
                onError={(e) => { e.target.src = fallbackLogoUrl; }}
              />
            </Link>

            {/* Right Action Tools (Admissions CTA + Mobile Trigger) */}
            <div className="flex items-center space-x-3 sm:space-x-4 shrink-0">
              {/* Gold Admissions CTA Button */}
              {showCta && (
                <a
                  href={ctaUrl}
                  target={ctaTarget}
                  rel={ctaTarget === '_blank' ? 'noopener noreferrer' : undefined}
                  onClick={() => setActiveMegaKey(null)}
                  className="btn-gold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold shadow-md whitespace-nowrap"
                >
                  <span>{ctaLabel}</span>
                </a>
              )}

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
            TIER 3: DEDICATED FULL-WIDTH PRIMARY NAVIGATION BAR (#0B1F4E Universal Gradient)
            ========================================================================= */}
        <nav 
          className="hidden min-[1100px]:block bg-gradient-to-r from-[#061330] via-[#0B1F4E] to-[#091b42] border-b-2 border-[#C9A84C] text-white overflow-x-auto no-scrollbar shadow-xs" 
          aria-label="Main Navigation"
        >
          <div className="w-full mx-auto px-2 sm:px-4 lg:px-6 xl:px-8 flex items-center justify-center min-w-max">
            
            <div className="flex items-center justify-center space-x-0.5 xl:space-x-1 2xl:space-x-1.5">
              {navItems.map((item) => {
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
                      className={`px-2.5 lg:px-3 xl:px-3.5 2xl:px-4 py-2.5 lg:py-3 text-[13.5px] xl:text-[14px] 2xl:text-[15px] font-semibold tracking-normal transition-all flex items-center whitespace-nowrap cursor-pointer relative ${
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
                          className={`w-3.5 h-3.5 ml-1 transition-transform duration-200 shrink-0 ${
                            isMegaOpen ? 'rotate-180 text-[#F0D98C]' : 'opacity-75 text-slate-300'
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
        {activeMegaKey && (megaMenus[activeMegaKey] || MEGA_MENU_DATA[activeMegaKey]) && (
          <div onMouseEnter={() => handleMouseEnter(activeMegaKey)}>
            <MegaMenuOverlay
              menuData={megaMenus[activeMegaKey] || MEGA_MENU_DATA[activeMegaKey]}
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
