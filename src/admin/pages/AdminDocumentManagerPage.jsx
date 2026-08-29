import React, { useState } from 'react';
import docData from '../../data/documents.json';
import { Search, FileText, Download, ExternalLink } from 'lucide-react';

export default function AdminDocumentManagerPage() {
  const [search, setSearch] = useState('');

  const filtered = docData.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) || 
    d.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-slate-900">Document Repository Manager</h1>
          <p className="text-xs text-slate-500">Managing {docData.length} public downloadable documents, syllabi & statutory files.</p>
        </div>

        <div className="relative w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search document title or category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:border-[#1C5496]"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <th className="p-4">Document Title</th>
              <th className="p-4">Category</th>
              <th className="p-4">Extension</th>
              <th className="p-4">Size</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.slice(0, 25).map((item) => (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="p-4 font-bold text-slate-900 max-w-xs truncate">{item.title}</td>
                <td className="p-4"><span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[11px]">{item.category}</span></td>
                <td className="p-4 font-mono font-bold text-slate-600 uppercase">{item.extension}</td>
                <td className="p-4 font-mono text-slate-500">{Math.round(item.fileSize / 1024)} KB</td>
                <td className="p-4">
                  <a href={item.originalUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline inline-flex items-center font-bold">
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
  );
}
