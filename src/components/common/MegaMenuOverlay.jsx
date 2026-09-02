import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight } from 'lucide-react';

export default function MegaMenuOverlay({ menuData, isOpen, onClose }) {
  if (!menuData || !menuData.columns) return null;

  const colCount = menuData.columns.length;
  const gridColsClass = colCount === 3 
    ? 'grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10' 
    : 'grid-cols-1 md:grid-cols-2 gap-8 lg:gap-14';

  const containerWidth = colCount === 3 
    ? 'min(1440px, calc(100% - 32px))' 
    : 'min(1080px, calc(100% - 32px))';

  return (
    <div className="absolute top-full left-0 right-0 w-full pointer-events-none z-50">
      <div
        role="region"
        aria-label={`${menuData.title} Sub-Navigation`}
        className={`mega-menu-panel bg-white text-[#0B1F4E] border-t-2 border-[#C9A84C] border-b border-slate-200 shadow-2xl rounded-b-2xl overflow-hidden pointer-events-auto transition-all duration-200 ${
          isOpen ? 'mega-menu-open' : 'mega-menu-closed'
        }`}
        style={{
          width: containerWidth,
          margin: '0 auto',
          maxHeight: 'calc(100vh - 120px)',
          overflowY: 'auto'
        }}
      >
        <div className="p-6 sm:p-8 lg:p-10">
          
          <div className={`grid ${gridColsClass} items-start`}>
            {menuData.columns.map((col, idx) => (
              <div key={idx} className="space-y-3">
                
                {/* Column Heading */}
                {col.heading && (
                  <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C5496] border-b-2 border-[#1C5496]/20 pb-2 mb-3 flex items-center justify-between">
                    <span>{col.heading}</span>
                  </h3>
                )}

                {/* Clean Links List with Horizontal Dividers */}
                <div className="divide-y divide-slate-100 border-t border-slate-100">
                  {col.links.map((link, lIdx) => {
                    const isExternal = link.isExternal || link.path?.startsWith('http');

                    const linkContent = (
                      <div className="py-2.5 px-2 hover:bg-slate-50 text-[13.5px] sm:text-[14px] text-slate-800 hover:text-[#1C5496] font-medium transition-all flex items-center justify-between group cursor-pointer rounded-sm">
                        <span className="group-hover:translate-x-1.5 transition-transform">{link.label}</span>
                        {isExternal ? (
                          <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-70 ml-1.5 shrink-0" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-[#1C5496] transition-opacity shrink-0" />
                        )}
                      </div>
                    );

                    return (
                      <div key={lIdx}>
                        {isExternal ? (
                          <a
                            href={link.path}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={onClose}
                            className="block"
                          >
                            {linkContent}
                          </a>
                        ) : (
                          <Link
                            to={link.path}
                            onClick={onClose}
                            className="block"
                          >
                            {linkContent}
                          </Link>
                        )}
                      </div>
                    );
                  })}
                </div>

              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}
