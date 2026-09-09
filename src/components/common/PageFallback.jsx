import React from 'react';

export default function PageFallback() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-4 py-16">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-3 border-slate-200 border-t-[#1C5496] animate-spin" />
        <div className="w-6 h-6 rounded-full border-2 border-transparent border-t-[#FFD84A] animate-spin absolute inset-0 m-auto" />
      </div>
      <p className="text-xs font-mono text-slate-500 uppercase tracking-wider">
        Loading St. Philomena's Portal...
      </p>
    </div>
  );
}