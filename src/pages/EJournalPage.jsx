import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Sparkles, 
  Calendar, 
  Award, 
  CheckCircle2, 
  FileText,
  Bookmark
} from 'lucide-react';
import ejournalsData from '../data/ejournals.json';
import ViewAsBookButton from '../components/common/ViewAsBookButton';
import PDFViewerEmbed from '../components/common/PDFViewerEmbed';

export default function EJournalPage() {
  const [selectedJournal, setSelectedJournal] = useState(ejournalsData[0]);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredJournals = ejournalsData.filter((j) => {
    const q = searchQuery.toLowerCase();
    return (
      j.title.toLowerCase().includes(q) ||
      j.journalName.toLowerCase().includes(q) ||
      j.volume.toLowerCase().includes(q) ||
      j.year.toLowerCase().includes(q) ||
      (j.category && j.category.toLowerCase().includes(q))
    );
  });

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">

        {/* 1. PAGE HERO BANNER */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-slate-200/90 shadow-sm relative overflow-hidden space-y-4">
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <span className="bg-[#1C5496] text-white font-mono font-extrabold text-xs px-3 py-1 rounded-md tracking-wider">
              OFFICIAL E-JOURNAL REPOSITORY
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 font-sans font-bold text-xs px-3 py-1 rounded-md">
              ISSN: 2249-9830
            </span>
            <span className="bg-emerald-50 text-emerald-800 font-sans font-semibold text-xs px-3 py-1 rounded-md border border-emerald-200/60 flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> Imported & Stored Locally
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl text-slate-900 leading-tight">
                Philo's Bulletin & Academic E-Journals
              </h1>
              <p className="text-slate-600 text-xs sm:text-sm lg:text-base max-w-3xl leading-relaxed font-sans">
                Official digital editions of the flagship <em>Philo’s Bulletin</em>, international conference proceedings, and collegiate research digests from St. Philomena's College (Autonomous), Mysuru.
              </p>
            </div>

            <div className="shrink-0 flex items-center space-x-3">
              <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-xs px-3.5 py-2 rounded-xl border border-blue-200">
                {ejournalsData.length} Published Issues
              </span>
            </div>
          </div>
        </div>

        {/* 2. SIDE-BY-SIDE SPLIT VIEW: E-Journals List (Left) + Interactive Live Viewer (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN: Searchable E-Journal Archive (5 Cols) */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[820px]">
            
            {/* Header & Search */}
            <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-[#0B1F4E]">
                  Select Bulletin / E-Journal
                </h3>
                <span className="text-[11px] font-mono text-slate-500 font-semibold">
                  {filteredJournals.length} of {ejournalsData.length} Editions
                </span>
              </div>
              <div className="relative w-full">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by title, volume, or year..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-[#1C5496]"
                />
              </div>
            </div>

            {/* Scrollable List of E-Journals */}
            <div className="flex-1 overflow-y-auto divide-y divide-slate-100 custom-scrollbar">
              {filteredJournals.map((journal) => {
                const isSelected = selectedJournal?.id === journal.id;
                return (
                  <div
                    key={journal.id}
                    onClick={() => setSelectedJournal(journal)}
                    className={`p-4 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-blue-50/90 border-l-4 border-[#1C5496]'
                        : 'hover:bg-slate-50 border-l-4 border-transparent'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                      {/* Thumbnail or Icon */}
                      <div className="w-12 h-16 rounded-lg bg-slate-900 border border-slate-200 overflow-hidden shrink-0 shadow-2xs relative">
                        {journal.localThumb ? (
                          <img
                            src={journal.localThumb}
                            alt={journal.title}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.target.style.display = 'none'; }}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0B254E] to-[#1C5496] text-[#FFD84A]">
                            <Bookmark className="w-5 h-5" />
                          </div>
                        )}
                      </div>

                      {/* Content */}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-[10px] text-[#1C5496] bg-blue-100/60 px-2 py-0.5 rounded">
                            {journal.volume}
                          </span>
                          <span className="text-[10px] font-medium text-slate-500 font-mono">
                            {journal.year}
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-slate-900 leading-snug truncate">
                          {journal.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">
                          {journal.category || journal.issue}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
                      <ViewAsBookButton
                        pdfUrl={journal.localPdf}
                        title={journal.title}
                        size="sm"
                        className="text-xs px-3 py-1.5"
                      />
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

          {/* RIGHT COLUMN: Interactive Live Viewer Preview (7 Cols) */}
          <div className="lg:col-span-7 sticky top-20 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[820px]">
            
            {/* Header Bar */}
            <div className="p-4 bg-[#071324] text-white flex items-center justify-between shrink-0 border-b border-slate-800">
              <div className="flex items-center space-x-2.5 overflow-hidden pr-3">
                <div className="w-7 h-7 rounded-lg bg-[#FFD84A] text-[#071A33] flex items-center justify-center shrink-0">
                  <BookOpen className="w-3.5 h-3.5 font-bold" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">
                    Active E-Journal Preview
                  </span>
                  <h3 className="font-serif font-bold text-sm text-white truncate">
                    {selectedJournal?.title}
                  </h3>
                </div>
              </div>

              <ViewAsBookButton
                pdfUrl={selectedJournal?.localPdf}
                title={selectedJournal?.title}
                label="Open 3D Flipbook"
                size="sm"
              />
            </div>

            {/* Embedded Interactive Viewer */}
            <div className="flex-1 w-full relative bg-slate-900 overflow-hidden">
              <PDFViewerEmbed
                src={selectedJournal?.localPdf}
                title={selectedJournal?.title}
                height="100%"
                badge="Official E-Journal"
              />
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
