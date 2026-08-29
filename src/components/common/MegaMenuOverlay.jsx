import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Download, ChevronRight, Sparkles } from 'lucide-react';

export default function MegaMenuOverlay({ menuData, isOpen, onClose }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();

  // Automatically activate the tab corresponding to the current URL route
  useEffect(() => {
    if (menuData && menuData.tabs && menuData.tabs.length > 0) {
      const currentPath = location.pathname.toLowerCase();
      const currentTabParam = new URLSearchParams(location.search).get('tab');

      const foundIdx = menuData.tabs.findIndex((t) => {
        if (currentTabParam && t.id === currentTabParam) return true;
        if (t.ctaPath && (currentPath === t.ctaPath.toLowerCase() || currentPath.startsWith(t.ctaPath.toLowerCase()))) return true;
        if (t.path && (currentPath === t.path.toLowerCase() || currentPath.startsWith(t.path.toLowerCase()))) return true;
        if (t.links && t.links.some(l => l.path && (currentPath === l.path.toLowerCase() || currentPath.startsWith(l.path.toLowerCase())))) return true;
        return false;
      });

      if (foundIdx !== -1) {
        setActiveTabIdx(foundIdx);
      } else {
        setActiveTabIdx(0);
      }
    }
  }, [menuData?.title, location.pathname, location.search]);

  if (!menuData) return null;

  const isTabbed = menuData.type === 'tabbed' && Array.isArray(menuData.tabs);
  const activeTab = isTabbed ? menuData.tabs[activeTabIdx] || menuData.tabs[0] : null;

  const handleTabClick = (tab, idx) => {
    setActiveTabIdx(idx);
    const targetPath = tab.ctaPath || tab.path || (tab.id ? `/about?tab=${tab.id}` : '/about');
    onClose();
    navigate(targetPath);
  };

  return (
    <div className="absolute top-full left-0 right-0 w-full pointer-events-none z-50">
      <div
        role="region"
        aria-label={`${menuData.title} Sub-Navigation`}
        className={`mega-menu-panel bg-white text-[#071A33] border-t-2 border-[#1C5496] border-b border-slate-200 shadow-2xl rounded-b-2xl overflow-hidden pointer-events-auto ${
          isOpen ? 'mega-menu-open' : 'mega-menu-closed'
        }`}
        style={{
          width: 'min(1440px, calc(100% - 32px))',
          margin: '0 auto',
          boxSizing: 'border-box'
        }}
      >
        <div className="p-4 sm:p-6 max-h-[500px] overflow-y-auto box-border min-w-0">
          
          {/* HEADER BAR: SECTION LABEL + ACTION */}
          <div className="flex justify-between items-center border-b border-slate-100 pb-2.5 mb-4 min-w-0">
            <div className="flex items-center space-x-2 min-w-0 pr-2 overflow-hidden">
              <span className="w-2.5 h-2.5 rounded-full bg-[#D4AF37] shrink-0"></span>
              <span className="font-serif font-bold text-sm uppercase tracking-widest text-[#1C5496] shrink-0">
                {menuData.title}
              </span>
              {menuData.description && (
                <span className="hidden md:inline-block text-xs text-slate-500 border-l border-slate-200 pl-3 ml-2 truncate min-w-0">
                  {menuData.description}
                </span>
              )}
            </div>

            <Link
              to={menuData.path}
              onClick={onClose}
              className="text-sm font-bold text-[#1C5496] hover:text-[#0F3B70] flex items-center group shrink-0"
            >
              <span className="whitespace-nowrap">Explore Full Section</span>
              <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform text-[#D4AF37] shrink-0" />
            </Link>
          </div>

          {/* MODE A: INTERACTIVE 3-PANEL TABBED DASHBOARD (Research, About Us) */}
          {isTabbed ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start min-w-0">
              
              {/* Left Interactive Numbered Tabs Column */}
              <div 
                className="lg:col-span-4 space-y-1 pr-2 border-r border-slate-100 min-w-0"
                role="tablist"
                aria-label={`${menuData.title} Categories`}
              >
                <span className="font-serif font-bold text-xs text-slate-400 uppercase tracking-widest block mb-2 px-3">
                  Select Category
                </span>
                {menuData.tabs.map((tab, idx) => {
                  const isActive = activeTabIdx === idx;
                  return (
                    <button
                      key={tab.id || idx}
                      role="tab"
                      aria-selected={isActive}
                      aria-controls={`mega-tabpanel-${tab.id || idx}`}
                      tabIndex={0}
                      onMouseEnter={() => setActiveTabIdx(idx)}
                      onFocus={() => setActiveTabIdx(idx)}
                      onClick={() => handleTabClick(tab, idx)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleTabClick(tab, idx);
                        }
                      }}
                      className={`w-full mega-menu-tab-item text-left min-w-0 ${isActive ? 'active-tab' : ''}`}
                    >
                      {isActive && <div className="mega-menu-tab-indicator" />}
                      <span className="font-mono text-xs text-[#D4AF37] font-bold mr-2 shrink-0">
                        {tab.num}
                      </span>
                      <span className="truncate flex-1 min-w-0 text-sm" title={tab.label}>{tab.label}</span>
                      <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-[#1C5496] translate-x-1' : 'opacity-30'}`} />
                    </button>
                  );
                })}
              </div>

              {/* Center Dynamic Animated Content Column */}
              <div 
                id={`mega-tabpanel-${activeTab?.id || activeTabIdx}`}
                role="tabpanel"
                className="lg:col-span-4 px-2 space-y-3.5 min-h-[220px] min-w-0"
              >
                {activeTab && (
                  <div key={activeTab.id || activeTabIdx} className="mega-menu-content-transition space-y-3 min-w-0">
                    <div className="space-y-1.5 min-w-0">
                      <span className="text-xs font-bold text-[#D4AF37] uppercase tracking-wider block">
                        Category {activeTab.num} Overview
                      </span>
                      <h3 className="font-serif font-bold text-lg sm:text-xl text-slate-900 leading-snug">
                        {activeTab.heading}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed break-words">
                        {activeTab.description}
                      </p>
                    </div>

                    <Link
                      to={activeTab.ctaPath}
                      onClick={onClose}
                      className="btn-primary-blue px-4 py-2 text-sm font-bold inline-flex items-center shadow-xs"
                    >
                      <span>{activeTab.ctaText}</span>
                    </Link>

                    {/* Related Links */}
                    {activeTab.links && activeTab.links.length > 0 && (
                      <div className="pt-3 border-t border-slate-100 space-y-1.5 min-w-0">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                          Quick Resources
                        </span>
                        <ul className="space-y-1 min-w-0">
                          {activeTab.links.map((linkItem, linkIdx) => (
                            <li key={linkIdx} className="min-w-0">
                              {linkItem.isDownload ? (
                                <a
                                  href={linkItem.path}
                                  download
                                  onClick={onClose}
                                  className="mega-menu-item-link text-sm text-slate-700 font-medium hover:text-[#1C5496] min-w-0 py-1"
                                >
                                  <span className="flex items-center truncate min-w-0" title={linkItem.label}>
                                    <Download className="w-3.5 h-3.5 mr-1.5 text-[#1C5496] shrink-0" />
                                    <span className="truncate">{linkItem.label}</span>
                                  </span>
                                  <span className="hover-arrow text-[#1C5496] font-bold shrink-0 ml-1">↓</span>
                                </a>
                              ) : linkItem.isExternal || linkItem.path?.startsWith('http') ? (
                                <a
                                  href={linkItem.path}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={onClose}
                                  className="mega-menu-item-link text-sm text-slate-700 font-medium hover:text-[#1C5496] min-w-0 py-1"
                                >
                                  <span className="truncate min-w-0" title={linkItem.label}>{linkItem.label}</span>
                                  <span className="hover-arrow text-[#1C5496] font-bold shrink-0 ml-1">↗</span>
                                </a>
                              ) : (
                                <Link
                                  to={linkItem.path}
                                  onClick={onClose}
                                  className="mega-menu-item-link text-sm text-slate-700 font-medium hover:text-[#1C5496] min-w-0 py-1"
                                >
                                  <span className="truncate min-w-0" title={linkItem.label}>{linkItem.label}</span>
                                  <span className="hover-arrow text-[#1C5496] font-bold shrink-0 ml-1">→</span>
                                </Link>
                              )}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Right Dynamic Featured Institutional Story Panel */}
              <div className="lg:col-span-4 pl-1 min-w-0">
                {activeTab && activeTab.featured && (
                  <div key={activeTab.id || activeTabIdx} className="mega-menu-image-transition bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5 min-w-0">
                    {activeTab.featured.image && (
                      <div className="aspect-[16/9] rounded-lg overflow-hidden relative shadow-xs">
                        <img
                          src={activeTab.featured.image}
                          alt={activeTab.featured.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/85 via-transparent to-transparent flex items-end p-2.5">
                          <span className="text-xs font-bold text-[#FFD84A] uppercase tracking-wider truncate">
                            {activeTab.featured.subtitle}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <h4 className="font-serif font-bold text-base sm:text-lg text-slate-900 truncate" title={activeTab.featured.title}>
                        {activeTab.featured.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                        {activeTab.featured.description}
                      </p>
                    </div>

                    <Link
                      to={activeTab.featured.ctaPath}
                      onClick={onClose}
                      className="btn-gold w-full text-center py-2 block rounded-md font-bold text-sm"
                    >
                      {activeTab.featured.ctaText}
                    </Link>
                  </div>
                )}
              </div>

            </div>
          ) : (

            /* MODE B: DISTINCT CATEGORY EXPLORERS (Academics, Admissions, Examinations, Compliance, Resources, Student Support) */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start min-w-0">
              
              {/* Link Columns */}
              <div className={`lg:col-span-${menuData.featured ? '8' : '12'} grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${menuData.columns ? menuData.columns.length : 3} gap-4 sm:gap-6 min-w-0`}>
                {menuData.columns && menuData.columns.map((col, idx) => (
                  <div key={idx} className="space-y-2.5 min-w-0">
                    <div className="border-b border-[#D4AF37]/40 pb-1.5 min-w-0">
                      <h4 className="font-serif font-bold text-sm text-[#1C5496] uppercase tracking-wider truncate" title={col.heading}>
                        {col.heading}
                      </h4>
                    </div>

                    <ul className="space-y-1.5 text-sm min-w-0">
                      {col.items.map((item, itemIdx) => (
                        <li key={itemIdx} className="min-w-0">
                          {item.isDownload ? (
                            <a
                              href={item.path}
                              download
                              onClick={onClose}
                              className="mega-menu-item-link text-slate-700 font-medium hover:text-[#1C5496] min-w-0 py-1"
                            >
                              <span className="truncate flex items-center min-w-0" title={item.label}>
                                <Download className="w-3.5 h-3.5 mr-1.5 text-[#1C5496] shrink-0" />
                                <span className="truncate">{item.label}</span>
                              </span>
                              <span className="hover-arrow text-[#1C5496] font-bold text-sm shrink-0 ml-1">↓</span>
                            </a>
                          ) : item.isExternal || item.path?.startsWith('http') ? (
                            <a
                              href={item.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={onClose}
                              className="mega-menu-item-link text-slate-700 font-medium hover:text-[#1C5496] min-w-0 py-1"
                            >
                              <span className="truncate min-w-0" title={item.label}>{item.label}</span>
                              <span className="hover-arrow text-[#1C5496] font-bold text-sm shrink-0 ml-1">↗</span>
                            </a>
                          ) : (
                            <Link
                              to={item.path}
                              onClick={onClose}
                              className="mega-menu-item-link text-slate-700 font-medium hover:text-[#1C5496] min-w-0 py-1"
                            >
                              <span className="truncate min-w-0" title={item.label}>{item.label}</span>
                              <span className="hover-arrow text-[#1C5496] font-bold text-sm shrink-0 ml-1">→</span>
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Featured Panel */}
              {menuData.featured && (
                <div className="lg:col-span-4 bg-slate-50 rounded-xl p-3.5 border border-slate-200 space-y-2.5 min-w-0">
                  {menuData.featured.image && (
                    <div className="aspect-[16/9] rounded-lg overflow-hidden relative shadow-xs">
                      <img
                        src={menuData.featured.image}
                        alt={menuData.featured.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#071A33]/85 via-transparent to-transparent flex items-end p-2.5">
                        <span className="text-xs font-bold text-[#FFD84A] uppercase tracking-wider truncate">
                          {menuData.featured.subtitle}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="space-y-1 min-w-0">
                    <h4 className="font-serif font-bold text-base sm:text-lg text-slate-900 truncate" title={menuData.featured.title}>
                      {menuData.featured.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {menuData.featured.description}
                    </p>
                  </div>

                  <Link
                    to={menuData.featured.ctaPath}
                    onClick={onClose}
                    className="btn-primary-blue w-full text-center py-2 block rounded-md font-bold text-sm"
                  >
                    {menuData.featured.ctaText}
                  </Link>
                </div>
              )}

            </div>

          )}

        </div>
      </div>
    </div>
  );
}
