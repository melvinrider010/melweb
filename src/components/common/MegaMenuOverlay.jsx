import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight, ArrowRight } from 'lucide-react';

export default function MegaMenuOverlay({ menuData, isOpen, onClose }) {
  if (!menuData || !menuData.columns) return null;

  const colCount = menuData.columns.length;
  const hasFeatureCard = Boolean(menuData.featuredCard);

  // Dynamic grid configuration based on number of columns and feature image
  const containerWidth = hasFeatureCard
    ? colCount >= 3 
      ? 'min(1480px, calc(100% - 32px))' 
      : 'min(1240px, calc(100% - 32px))'
    : colCount === 3
    ? 'min(1440px, calc(100% - 32px))'
    : 'min(1080px, calc(100% - 32px))';

  const linksGridCols = colCount === 3
    ? 'grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8'
    : colCount === 2
    ? 'grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10'
    : 'grid-cols-1 gap-6';

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
        <div className="p-6 sm:p-8 lg:p-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
            
            {/* ================= LEFT: NAVIGATION COLUMNS ================= */}
            <div className={`${hasFeatureCard ? 'lg:col-span-8 xl:col-span-9' : 'lg:col-span-12'}`}>
              <div className={`grid ${linksGridCols} items-start`}>
                {menuData.columns.map((col, idx) => (
                  <div key={idx} className="space-y-3">
                    
                    {/* Column Heading */}
                    {col.heading && (
                      <h3 className="font-heading font-semibold text-base sm:text-lg text-[#1C5496] border-b-2 border-[#1C5496]/20 pb-2 mb-2.5 flex items-center justify-between">
                        <span>{col.heading}</span>
                      </h3>
                    )}

                    {/* Clean Links List */}
                    <div className="divide-y divide-slate-100 border-t border-slate-100">
                      {col.links && col.links.map((link, lIdx) => {
                        const isExternal = link.isExternal || link.path?.startsWith('http');

                        if (link.isButton) {
                          return (
                            <div key={lIdx} className="pt-2.5">
                              <Link
                                to={link.path}
                                onClick={onClose}
                                className="block w-full py-2 px-3.5 rounded-lg bg-[#0B1F4E] hover:bg-[#1C5496] text-[#F0D98C] hover:text-white font-semibold text-xs text-center border border-[#C9A84C]/40 shadow-xs hover:shadow-md transition-all cursor-pointer"
                              >
                                <span>{link.label}</span>
                              </Link>
                            </div>
                          );
                        }

                        const linkContent = (
                          <div className="py-2 px-2.5 hover:bg-slate-50 text-sm text-slate-700 hover:text-[#1C5496] font-medium transition-all flex items-center justify-between group cursor-pointer rounded-md">
                            <span className="group-hover:translate-x-1 transition-transform">{link.label}</span>
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

            {/* ================= RIGHT: SINGLE DEDICATED FEATURE IMAGE CARD ================= */}
            {hasFeatureCard && (
              <div className="lg:col-span-4 xl:col-span-3 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-slate-100 lg:pl-6 pt-4 lg:pt-0">
                <Link
                  to={menuData.featuredCard.link || '/'}
                  onClick={onClose}
                  className="group relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-200 bg-slate-900 aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/3] flex flex-col justify-end p-5 transition-all duration-300 cursor-pointer block"
                >
                  {/* Photo with zoom on hover */}
                  <img
                    src={menuData.featuredCard.image}
                    alt={menuData.featuredCard.title}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 filter brightness-[0.88] group-hover:brightness-[0.95]"
                    onError={(e) => {
                      e.target.src = '/assets/banner-college.jpg';
                    }}
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#164E8C] via-[#164E8C]/40 to-transparent pointer-events-none" />

                  {/* Top Tag */}
                  {menuData.featuredCard.tag && (
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-[#0B1F4E]/90 text-[#F0D98C] font-mono text-[10px] font-semibold px-2 py-0.5 rounded-md uppercase tracking-wider backdrop-blur-xs border border-[#C9A84C]/40 shadow-xs">
                        {menuData.featuredCard.tag}
                      </span>
                    </div>
                  )}

                  {/* Bottom Text and CTA */}
                  <div className="relative z-10 space-y-1">
                    <h4 className="font-heading font-semibold text-base text-white group-hover:text-[#F0D98C] transition-colors leading-snug">
                      {menuData.featuredCard.title}
                    </h4>
                    {menuData.featuredCard.subtitle && (
                      <p className="text-xs text-slate-200 leading-relaxed line-clamp-2">
                        {menuData.featuredCard.subtitle}
                      </p>
                    )}
                    <div className="pt-1 flex items-center text-xs font-semibold text-[#F0D98C] group-hover:translate-x-1 transition-transform space-x-1">
                      <span>Explore</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>

                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}
