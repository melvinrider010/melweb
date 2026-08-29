import { animatePageIn } from '../animations/pageTransitions';
import { useEffect, useRef } from 'react';
import React from 'react';
import { Calendar, Bell, Tag } from 'lucide-react';
import newsEvents from '../data/news_events.json';

// Animation wrapper
export default function NewsEventsPage() {
  const containerRef = useRef(null);
  useEffect(() => { animatePageIn(containerRef); }, []);
  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-12">
      
      <div className="bg-slate-950 text-white rounded-2xl p-8 sm:p-12 border-b-4 border-amber-500 shadow-xl">
        <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Campus Bulletin</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-5xl mt-2 mb-4">News, Notices & Events</h1>
        <p className="text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
          Stay updated with current institutional announcements, academic notices, upcoming seminars, and official circulars.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {newsEvents.map((item) => (
          <div key={item.id} className="bg-white border rounded-xl p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="bg-amber-100 text-amber-900 text-xs font-bold px-2.5 py-0.5 rounded">{item.type}</span>
                <span className="text-xs text-slate-500 flex items-center"><Calendar className="w-3.5 h-3.5 mr-1" />{item.date}</span>
              </div>
              <h2 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h2>
              <p className="text-xs text-slate-600 leading-relaxed mb-4">{item.summary}</p>
            </div>
            <div className="pt-4 border-t flex justify-between items-center text-xs">
              <span className="text-slate-500 font-semibold">{item.category}</span>
              <a href={item.link} className="text-blue-700 font-bold hover:underline">
                View Bulletin Details →
              </a>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
