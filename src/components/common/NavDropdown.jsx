import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Download, ChevronRight, Sparkles, ExternalLink } from 'lucide-react';

export default function NavDropdown({ menuData, onClose, alignRight = false }) {
  const [activeTabIdx, setActiveTabIdx] = useState(0);
  const navigate = useNavigate();

  if (!menuData) return null;

  const isTabbed = menuData.type === 'tabbed' && Array.isArray(menuData.tabs) && menuData.tabs.length > 0;
  const activeTab = isTabbed ? menuData.tabs[activeTabIdx] || menuData.tabs[0] : null;

  const handleTabClick = (tab, idx) => {
    setActiveTabIdx(idx);
    const targetPath = tab.ctaPath || tab.path || (tab.id ? `${menuData.path || '/about'}?tab=${tab.id}` : menuData.path || '/about');
    onClose();
    navigate(targetPath);
  };

  const handleLinkClick = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <div
      role="region"
      aria-label={`${menuData.title} Dropdown`}
      className={`nav-dropdown absolute top-[calc(100%+8px)] ${
        alignRight ? 'right-0' : 'left-0'
      } w-[420px] sm:w-[480px] lg:w-[540px] max-w-[90vw] bg-[#071A33] text-white rounded-2xl shadow-2xl border border-slate-700/90 p-4 sm:p-5 z-50 animate-fadeIn space-y-3.5`}
      style={{
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.85), 0 0 25px rgba(28, 84, 150, 0.25)'
      }}
    >
      {/* 1. SECTION HEADER BAR */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center space-x-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FFD84A]" />
          <span className="font-serif font-bold text-sm text-white tracking-wide">
            {menuData.title}
          </span>
        </div>

        {menuData.path && (
          <Link
            to={menuData.path}
            onClick={onClose}
            className="text-[11px] font-bold text-[#FFD84A] hover:text-white transition-colors flex items-center space-x-1 font-sans"
          >
            <span>Explore All</span>
            <ArrowRight className="w-3 h-3" />
          </Link>
        )}
      </div>

      {/* 2. TABBED OR MULTI-COLUMN CONTENT */}
      {isTabbed ? (
        <div className="grid grid-cols-12 gap-3.5">
          
          {/* Left Column: Category Tabs (5 Cols) */}
          <div className="col-span-5 space-y-1 max-h-[300px] overflow-y-auto pr-1 border-r border-slate-800/80">
            {menuData.tabs.map((tab, idx) => (
              <button
                key={tab.id || tab.label}
                onMouseEnter={() => setActiveTabIdx(idx)}
                onClick={() => handleTabClick(tab, idx)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-between ${
                  activeTabIdx === idx
                    ? 'bg-[#1C5496] text-[#FFD84A] font-bold shadow-xs'
                    : 'text-slate-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <span className="truncate">{tab.label}</span>
                <ChevronRight className={`w-3 h-3 shrink-0 ${activeTabIdx === idx ? 'text-[#FFD84A]' : 'opacity-40'}`} />
              </button>
            ))}
          </div>

          {/* Right Column: Active Tab Link List & Highlight (7 Cols) */}
          <div className="col-span-7 flex flex-col justify-between space-y-3 pl-1">
            <div className="space-y-1.5">
              <h4 className="font-serif font-bold text-xs sm:text-sm text-white line-clamp-1">
                {activeTab?.heading || activeTab?.label}
              </h4>
              <p className="text-[11px] text-slate-400 font-sans leading-relaxed line-clamp-2">
                {activeTab?.description}
              </p>
            </div>

            {/* Sub-links List */}
            {activeTab?.links && activeTab.links.length > 0 && (
              <div className="space-y-1 pt-2 border-t border-slate-800">
                {activeTab.links.slice(0, 4).map((link, lIdx) => (
                  link.isDownload ? (
                    <a
                      key={lIdx}
                      href={link.path}
                      download
                      className="text-[11.5px] text-slate-300 hover:text-[#FFD84A] flex items-center justify-between py-0.5 group"
                    >
                      <span className="truncate">{link.label}</span>
                      <Download className="w-3 h-3 text-[#FFD84A] shrink-0 opacity-70 group-hover:opacity-100" />
                    </a>
                  ) : (
                    <button
                      key={lIdx}
                      onClick={() => handleLinkClick(link.path)}
                      className="w-full text-left text-[11.5px] text-slate-300 hover:text-[#FFD84A] flex items-center justify-between py-0.5 group"
                    >
                      <span className="truncate">{link.label}</span>
                      <ArrowRight className="w-2.5 h-2.5 text-[#FFD84A] shrink-0 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all" />
                    </button>
                  )
                ))}
              </div>
            )}

            {/* Direct Action Link */}
            {activeTab?.ctaPath && (
              <div className="pt-1">
                <Link
                  to={activeTab.ctaPath}
                  onClick={onClose}
                  className="inline-flex items-center space-x-1 text-[11px] font-bold text-[#FFD84A] hover:underline"
                >
                  <span>{activeTab.ctaText || 'Open Section →'}</span>
                </Link>
              </div>
            )}

          </div>

        </div>
      ) : (
        /* Standard Non-Tabbed Link Grid */
        <div className="grid grid-cols-2 gap-2 max-h-[300px] overflow-y-auto">
          {menuData.items?.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleLinkClick(item.path)}
              className="text-left p-2 rounded-lg bg-slate-900/60 hover:bg-white/10 text-slate-200 hover:text-[#FFD84A] transition-all space-y-0.5"
            >
              <span className="block text-xs font-bold text-white">{item.label}</span>
              {item.description && (
                <span className="block text-[10px] text-slate-400 truncate">{item.description}</span>
              )}
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
