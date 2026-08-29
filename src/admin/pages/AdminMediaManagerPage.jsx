import React, { useState } from 'react';
import mediaData from '../../data/media.json';
import { Search, Image as ImageIcon, ExternalLink, Download } from 'lucide-react';

export default function AdminMediaManagerPage() {
  const [search, setSearch] = useState('');

  const filtered = mediaData.filter(m => 
    m.filename.toLowerCase().includes(search.toLowerCase()) || 
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-slate-900">Media Library Manager</h1>
          <p className="text-xs text-slate-500">Managing {mediaData.length} archived high-resolution photographs and media assets.</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search media filename or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1C5496]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.slice(0, 32).map((item) => (
          <div key={item.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs group">
            <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden">
              <img src={item.localPath} alt={item.altText} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              <span className="absolute top-2 left-2 bg-slate-950/80 text-[#FFD84A] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                {item.category}
              </span>
            </div>
            <div className="p-3 space-y-1 text-xs">
              <p className="font-bold text-slate-900 truncate" title={item.filename}>{item.filename}</p>
              <p className="text-[10px] text-slate-500">Size: {Math.round(item.fileSize / 1024)} KB</p>
              <a href={item.originalUrl} target="_blank" rel="noopener noreferrer" className="text-[11px] text-blue-600 hover:underline flex items-center pt-1">
                <span>Original Source</span>
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
