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

  const tickerItems = [...notices, ...notices];

  return (
    <div className="bg-gradient-blue text-white text-xs py-2 px-4 border-b border-blue-400/20 shadow-xs max-w-full overflow-hidden">
      <div className="max-w-[1400px] mx-auto grid grid-cols-[auto_1fr] items-center gap-3 w-full overflow-hidden">
        
        <div className="flex items-center font-bold tracking-wider uppercase shrink-0 z-10 btn-gold text-[#071A33] text-[11px] px-3 py-1 rounded-md shadow-xs">
          <Bell className="w-3.5 h-3.5 mr-1.5 animate-pulse text-[#071A33]" />
          ALERTS
        </div>

        <div className="overflow-hidden w-full relative">
          <div className="animate-marquee flex items-center space-x-8 whitespace-nowrap">
            {tickerItems.map((item, index) => (
              <a
                key={`${item.id}-${index}`}
                href={item.link || "/documents"}
                className="inline-flex items-center hover:text-[#FFD84A] font-semibold text-slate-100 transition-colors whitespace-nowrap group"
              >
                <span className="bg-[#FFC928]/20 text-[#FFD84A] border border-[#FFC928]/30 text-[10px] font-bold px-2 py-0.5 rounded mr-2 uppercase tracking-wider">
                  {item.type || item.category || "NOTICE"}
                </span>
                <span className="group-hover:underline">{item.title}</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5 inline text-[#FFD84A] shrink-0 group-hover:translate-x-1 transition-transform" />
              </a>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
