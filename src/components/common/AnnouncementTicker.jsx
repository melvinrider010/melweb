import React, { useState, useEffect } from 'react';
import { Bell, ArrowRight } from 'lucide-react';
import { cmsStore } from '../../lib/cmsStore';

export default function AnnouncementTicker() {
  const [notices, setNotices] = useState(cmsStore.getNotices());

  useEffect(() => {
    const handleUpdate = () => {
      setNotices(cmsStore.getNotices());
    };
    window.addEventListener('cms_store_updated', handleUpdate);
    return () => window.removeEventListener('cms_store_updated', handleUpdate);
  }, []);

  // Limit ticker to the latest 8 most recent updates for smooth readable scrolling
  const recentNotices = notices.slice(0, 8);
  const tickerItems = [...recentNotices, ...recentNotices];

  return (
    <div className="bg-[#164E8C] text-white text-xs py-2 px-3 sm:px-6 border-b border-white/10 shadow-xs max-w-full overflow-hidden">
      <div className="max-w-[1720px] mx-auto grid grid-cols-[auto_1fr] items-center gap-3 w-full overflow-hidden">
        
        {/* Live Notification Indicator */}
        <div className="flex items-center font-bold tracking-wider uppercase shrink-0 z-10 bg-[#C9A84C] text-[#164E8C] text-[10px] sm:text-[11px] px-2 sm:px-3 py-1 rounded-md shadow-xs space-x-1 sm:space-x-1.5 whitespace-nowrap">
          <span className="live-dot"></span>
          <span className="hidden sm:inline">LATEST UPDATES</span>
          <span className="sm:hidden">UPDATES</span>
        </div>

        {/* Continuous Smooth Marquee Ticker */}
        <div className="overflow-hidden w-full relative">
          <div className="animate-marquee flex items-center space-x-8 whitespace-nowrap">
            {tickerItems.map((item, index) => (
              <a
                key={`${item.id}-${index}`}
                href={item.link || "/documents"}
                className="inline-flex items-center hover:text-[#F0D98C] font-medium text-slate-200 transition-colors whitespace-nowrap group"
              >
                <span className="bg-[#C9A84C]/20 text-[#F0D98C] border border-[#C9A84C]/40 text-[10px] font-bold px-2 py-0.5 rounded mr-2 uppercase tracking-wider">
                  {item.type || item.category || "NOTICE"}
                </span>
                <span className="group-hover:underline">{item.title}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline text-[#C9A84C] shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

