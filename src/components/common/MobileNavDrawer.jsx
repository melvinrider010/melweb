import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, ChevronLeft, Search, Download } from 'lucide-react';
import { MEGA_MENU_DATA } from '../../data/megaMenuData';

export default function MobileNavDrawer({ isOpen, onClose, onOpenSearch }) {
  const [activeCategory, setActiveCategory] = useState(null);

  if (!isOpen) return null;

  const mainItems = [
    { label: 'HOME', path: '/' },
    { label: 'ABOUT US', key: 'about' },
    { label: 'ACADEMICS', key: 'academics' },
    { label: 'EXAMINATION', key: 'examinations' },
    { label: 'RESOURCE', key: 'research' },
    { label: 'STUDENT SUPPORT', key: 'studentSupport' },
    { label: 'MANDATORY DISCLOSURE', key: 'compliance' },
    { label: 'IQAC', key: 'iqac' },
    { label: 'ALUMNI', path: '/alumni' },
    { label: 'CONTACT US', path: '/contact' }
  ];

  const handleItemClick = (item) => {
    if (item.key && MEGA_MENU_DATA[item.key]) {
      setActiveCategory(MEGA_MENU_DATA[item.key]);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-fadeIn min-[1200px]:hidden">
      <div className="bg-[#060f26] text-white w-full max-w-sm h-full flex flex-col justify-between shadow-2xl border-l border-white/10 overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 bg-[#0B1F4E] border-b border-white/10 flex justify-between items-center">
          {activeCategory ? (
            <button
              onClick={() => setActiveCategory(null)}
              className="flex items-center text-xs font-bold text-[#F0D98C] hover:text-white"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              <span>Back to Main Menu</span>
            </button>
          ) : (
            <span className="font-serif font-bold text-sm text-[#F0D98C]">St. Philomena's Menu</span>
          )}

          <button
            onClick={onClose}
            className="p-1.5 rounded-md hover:bg-white/10 text-white"
            aria-label="Close Menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          
          {/* Search Trigger */}
          {!activeCategory && (
            <button
              onClick={() => { onClose(); onOpenSearch(); }}
              className="w-full flex items-center justify-center space-x-2 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-bold text-slate-200"
            >
              <Search className="w-4 h-4 text-[#FFD84A]" />
              <span>Search Portal (Ctrl + K)</span>
            </button>
          )}

          {/* Level 1: Main Menu List */}
          {!activeCategory && (
            <div className="space-y-1 text-xs font-bold">
              {mainItems.map((item) => (
                <div key={item.label}>
                  {item.path ? (
                    <Link
                      to={item.path}
                      onClick={onClose}
                      className="flex justify-between items-center p-3 rounded-lg hover:bg-white/10 text-slate-100 hover:text-[#FFD84A] transition-colors border-b border-slate-800/50"
                    >
                      <span>{item.label}</span>
                    </Link>
                  ) : (
                    <button
                      onClick={() => handleItemClick(item)}
                      className="w-full flex justify-between items-center p-3 rounded-lg hover:bg-white/10 text-slate-100 hover:text-[#FFD84A] transition-colors border-b border-slate-800/50 text-left"
                    >
                      <span>{item.label}</span>
                      <ChevronRight className="w-4 h-4 text-[#FFD84A]" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Level 2: Submenu Drilldown List */}
          {activeCategory && (
            <div className="space-y-4 text-xs animate-fadeIn">
              <div className="pb-2 border-b border-slate-800">
                <h3 className="font-serif font-bold text-base text-[#FFD84A]">{activeCategory.title}</h3>
                <Link
                  to={activeCategory.path}
                  onClick={onClose}
                  className="text-[11px] text-blue-300 font-semibold hover:underline block pt-1"
                >
                  Explore All {activeCategory.title} →
                </Link>
              </div>

              {/* Tabbed Layout (About Us, Research) */}
              {activeCategory.tabs && activeCategory.tabs.map((tab, idx) => (
                <div key={tab.id || idx} className="space-y-2">
                  <div className="flex justify-between items-center border-b border-slate-800 pb-1">
                    <Link
                      to={tab.ctaPath || `/about?tab=${tab.id}`}
                      onClick={onClose}
                      className="font-serif font-bold text-[11px] text-[#FFD84A] uppercase tracking-wider hover:underline flex-1 truncate"
                    >
                      {tab.num ? `${tab.num}. ` : ''}{tab.label || tab.heading}
                    </Link>
                    {tab.ctaPath && (
                      <Link
                        to={tab.ctaPath}
                        onClick={onClose}
                        className="text-[10px] text-blue-300 hover:text-[#FFD84A] font-semibold shrink-0 ml-2"
                      >
                        View →
                      </Link>
                    )}
                  </div>
                  {tab.links && tab.links.length > 0 && (
                    <div className="space-y-1 pl-2">
                      {tab.links.map((linkItem, linkIdx) => (
                        <div key={linkIdx}>
                          {linkItem.isDownload ? (
                            <a
                              href={linkItem.path}
                              download
                              onClick={onClose}
                              className="flex items-center justify-between py-1.5 text-slate-300 hover:text-white"
                            >
                              <span className="flex items-center truncate">
                                <Download className="w-3 h-3 mr-1.5 text-[#FFD84A] shrink-0" />
                                <span className="truncate">{linkItem.label}</span>
                              </span>
                              <span className="text-[10px] text-[#FFD84A] shrink-0 ml-1">PDF</span>
                            </a>
                          ) : linkItem.isExternal || linkItem.path?.startsWith('http') ? (
                            <a
                              href={linkItem.path}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={onClose}
                              className="flex items-center justify-between py-1.5 text-slate-300 hover:text-white"
                            >
                              <span className="truncate">{linkItem.label}</span>
                              <span className="text-[10px] text-[#FFD84A] shrink-0 ml-1">↗</span>
                            </a>
                          ) : (
                            <Link
                              to={linkItem.path}
                              onClick={onClose}
                              className="block py-1.5 text-slate-300 hover:text-[#FFD84A] truncate"
                            >
                              {linkItem.label}
                            </Link>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {/* Column-based Layout (Academics, Departments, Admissions, Examinations, Resources, Student Support, Compliance) */}
              {activeCategory.columns && activeCategory.columns.map((col, idx) => (
                <div key={idx} className="space-y-2">
                  <span className="font-serif font-bold text-[11px] text-[#FFD84A] uppercase tracking-wider block border-b border-slate-800 pb-1">
                    {col.heading}
                  </span>
                  <div className="space-y-1 pl-2">
                    {col.items && col.items.map((sub, subIdx) => (
                      <div key={subIdx}>
                        {sub.isDownload ? (
                          <a
                            href={sub.path}
                            download
                            onClick={onClose}
                            className="flex items-center justify-between py-1.5 text-slate-300 hover:text-white"
                          >
                            <span className="flex items-center truncate">
                              <Download className="w-3 h-3 mr-1.5 text-[#FFD84A] shrink-0" />
                              <span className="truncate">{sub.label}</span>
                            </span>
                            <span className="text-[10px] text-[#FFD84A] shrink-0 ml-1">PDF</span>
                          </a>
                        ) : sub.isExternal || sub.path?.startsWith('http') ? (
                          <a
                            href={sub.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="flex items-center justify-between py-1.5 text-slate-300 hover:text-white"
                          >
                            <span className="truncate">{sub.label}</span>
                            <span className="text-[10px] text-[#FFD84A] shrink-0 ml-1">↗</span>
                          </a>
                        ) : (
                          <Link
                            to={sub.path}
                            onClick={onClose}
                            className="block py-1.5 text-slate-300 hover:text-[#FFD84A] truncate"
                          >
                            {sub.label}
                          </Link>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer CTA */}
        <div className="p-4 bg-[#0F3B70] border-t border-slate-800">
          <a
            href="https://student.stphiloserp.in/"
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="btn-gold w-full text-center py-2.5 block rounded-md font-bold text-xs uppercase"
          >
            Apply Admissions 2026–27
          </a>
        </div>

      </div>
    </div>
  );
}
