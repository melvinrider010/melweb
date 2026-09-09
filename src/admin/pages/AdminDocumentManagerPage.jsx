import React, { useState } from 'react';
import docData from '../../data/documents.json';
import { Search, FileText, Download, ExternalLink } from 'lucide-react';

export default function AdminDocumentManagerPage() {
  const [search, setSearch] = useState('');

  const filtered = docData.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(docData.map(d => d.category))];

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* 1. TOP HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              Statutory Repository
            </span>
            <span className="text-slate-400 text-xs font-sans">
              {docData.length} Public Documents Indexed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191d28] tracking-tight">
            Document Repository Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Manage public downloadable documents, academic syllabi, regulatory compliances, and statutory institutional disclosures.
          </p>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Files</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">{docData.length}</p>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Categories</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">{categories.length}</p>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">Filtered Matches</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">{filtered.length}</p>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">Formats</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">PDF / DOCX</p>
        </div>
      </div>

      {/* 3. SEARCH BAR */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
          />
        </div>
        <span className="text-xs text-slate-500 font-mono">
          Showing top {Math.min(filtered.length, 50)} items
        </span>
      </div>

      {/* 4. TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="p-4">Document Title</th>
                <th className="p-4">Category</th>
                <th className="p-4">Extension</th>
                <th className="p-4">Size</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.slice(0, 50).map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="p-4 font-bold text-[#191d28] max-w-md truncate">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate">{item.title}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-100 text-slate-700 font-mono font-bold px-2.5 py-1 rounded-full text-[10px] border border-slate-200">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4 font-mono font-bold text-slate-600 uppercase">{item.extension}</td>
                  <td className="p-4 font-mono text-slate-500">{Math.round(item.fileSize / 1024)} KB</td>
                  <td className="p-4 text-right">
                    <a
                      href={item.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 hover:text-slate-900 inline-flex items-center font-bold text-[11px] transition-colors"
                    >
                      <Download className="w-3.5 h-3.5 mr-1" />
                      <span>Download</span>
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
