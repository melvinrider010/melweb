import { animatePageIn } from '../animations/pageTransitions';
import { useEffect, useRef } from 'react';
﻿import React, { useState } from 'react';
import { Search, FileText, Download, Filter } from 'lucide-react';
import docsData from '../data/documents.json';

// Animation wrapper
export default function DocumentsPage() {
  const containerRef = useRef(null);
  useEffect(() => { animatePageIn(containerRef); }, []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'syllabus', 'examination', 'regulations', 'prospectus', 'policies', 'reports', 'other'];

  const filteredDocs = docsData.filter((doc) => {
    const matchesSearch = (doc.link_text || doc.document_name || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || doc.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      
      <div className="bg-slate-950 text-white rounded-2xl p-8 sm:p-12 border-b-4 border-amber-500 shadow-xl">
        <span className="text-amber-400 font-bold text-xs uppercase tracking-widest">Institutional Repository</span>
        <h1 className="font-serif font-extrabold text-3xl sm:text-5xl mt-2 mb-4">Searchable Document Hub</h1>
        <p className="text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
          Access over 553 downloadable institutional documents including Syllabi, Examination Schedules, NAAC AQAR Disclosures, Regulations, and Forms.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border rounded-xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search documents by keyword..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border rounded-lg text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
            <Filter className="w-4 h-4 text-slate-500 mr-1" />
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-xs px-3 py-1.5 rounded-full font-semibold capitalize transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-slate-950 shadow'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

        </div>

        <div className="text-xs text-slate-500 pt-2 border-t">
          Showing <strong>{filteredDocs.length}</strong> of <strong>{docsData.length}</strong> audited institutional documents.
        </div>
      </div>

      {/* Document Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.slice(0, 48).map((doc, idx) => (
          <div key={idx} className="bg-white border rounded-xl p-4 shadow-sm hover:border-amber-400 transition-colors flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{doc.file_type || 'PDF'}</span>
                <span className="text-[10px] text-amber-600 font-semibold capitalize">{doc.category}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-xs mb-2 leading-snug line-clamp-2">
                {doc.link_text || doc.document_name}
              </h3>
            </div>
            <a
              href={doc.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center text-xs text-blue-700 font-bold hover:underline"
            >
              <Download className="w-3.5 h-3.5 mr-1" /> Download File
            </a>
          </div>
        ))}
      </div>

    </div>
  );
}
