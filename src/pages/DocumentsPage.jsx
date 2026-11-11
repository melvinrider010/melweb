import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, FileText, Filter, Loader2, AlertTriangle, ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import ViewAsBookButton from '../components/common/ViewAsBookButton';
import { animatePageIn } from '../animations/pageTransitions';
import { getDocuments } from '../services/documentsService';

export default function DocumentsPage() {
  const containerRef = useRef(null);
  useEffect(() => { animatePageIn(containerRef); }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  const [documents, setDocuments] = useState([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    lastPage: 1,
    perPage: 24,
    total: 0,
    from: 0,
    to: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const categories = ['All', 'syllabus', 'examination', 'regulations', 'prospectus', 'policies', 'reports', 'other'];

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const loadDocuments = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await getDocuments({
        category: selectedCategory,
        search: debouncedSearch,
        page: currentPage,
        per_page: 24
      });
      setDocuments(result.documents || []);
      setPagination(result.pagination || {
        currentPage: 1,
        lastPage: 1,
        perPage: 24,
        total: result.documents?.length || 0,
        from: 1,
        to: result.documents?.length || 0
      });
    } catch (err) {
      console.error('Failed to load documents from API:', err);
      setError('Unable to load documents from the repository. Please verify your connection.');
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, debouncedSearch, currentPage]);

  useEffect(() => {
    loadDocuments();
  }, [loadDocuments]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.lastPage) {
      setCurrentPage(newPage);
      if (containerRef.current) {
        containerRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  return (
    <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-8 py-12 space-y-8">
      
      <div className="bg-slate-950 text-white rounded-2xl p-8 sm:p-12 border-b-4 border-amber-500 shadow-xl">
        <span className="text-amber-400 font-semibold text-xs uppercase tracking-widest">Institutional Repository</span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl mt-2 mb-4">Searchable Document Hub</h1>
        <p className="text-slate-300 max-w-3xl text-sm sm:text-base leading-relaxed">
          Access over {pagination.total > 0 ? `${pagination.total.toLocaleString()}` : '1,280'} downloadable institutional documents including Syllabi, Examination Schedules, NAAC AQAR Disclosures, Regulations, and Forms.
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
                onClick={() => handleCategoryChange(cat)}
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

        <div className="text-xs text-slate-500 pt-2 border-t flex flex-wrap justify-between items-center gap-2">
          <span>
            {pagination.total > 0 ? (
              <>
                Showing <strong>{pagination.from}–{pagination.to}</strong> of <strong>{pagination.total.toLocaleString()}</strong> audited institutional documents.
              </>
            ) : (
              <>Showing <strong>0</strong> documents.</>
            )}
          </span>
          {pagination.lastPage > 1 && (
            <span className="text-slate-400">
              Page {pagination.currentPage} of {pagination.lastPage}
            </span>
          )}
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="bg-white p-16 rounded-2xl border border-slate-200 text-center space-y-4 shadow-sm">
          <Loader2 className="w-10 h-10 text-amber-500 animate-spin mx-auto" />
          <p className="font-serif font-bold text-base text-slate-800">Loading document repository...</p>
          <p className="text-xs text-slate-500">Accessing authoritative document records from the database</p>
        </div>
      ) : error ? (
        /* Error State */
        <div className="bg-red-50 border border-red-200 p-8 rounded-2xl text-center space-y-4 shadow-sm">
          <AlertTriangle className="w-10 h-10 text-red-600 mx-auto" />
          <h3 className="font-serif font-bold text-lg text-red-900">Unable to Load Documents</h3>
          <p className="text-xs text-red-700 max-w-md mx-auto">{error}</p>
          <button
            onClick={loadDocuments}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
      ) : documents.length === 0 ? (
        /* Empty State */
        <div className="bg-white border rounded-xl p-12 text-center space-y-4 shadow-sm">
          <FileText className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="font-serif font-bold text-base text-slate-800">No Documents Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No institutional documents match your search criteria "{searchTerm || selectedCategory}".
          </p>
          {(searchTerm || selectedCategory !== 'All') && (
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); setCurrentPage(1); }}
              className="btn-primary-blue px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>Reset Search & Filters</span>
            </button>
          )}
        </div>
      ) : (
        /* Document Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {documents.map((doc, idx) => (
            <div key={doc.id || idx} className="bg-white border rounded-xl p-4 shadow-sm hover:border-amber-400 transition-colors flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="bg-slate-100 text-slate-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">{doc.file_type || doc.extension || 'PDF'}</span>
                  <span className="text-[10px] text-amber-600 font-semibold capitalize">{doc.category}</span>
                </div>
                <h3 className="font-bold text-slate-900 text-xs mb-2 leading-snug line-clamp-2" title={doc.title || doc.link_text || doc.document_name}>
                  {doc.link_text || doc.document_name || doc.title}
                </h3>
                {doc.year && doc.year !== 'all' && (
                  <span className="text-[10px] text-slate-400 font-mono block">Academic Year: {doc.year}</span>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                <ViewAsBookButton
                  pdfUrl={doc.url}
                  title={doc.link_text || doc.document_name || doc.title}
                  label="View"
                  size="xs"
                  variant="blue"
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && !error && pagination.lastPage > 1 && (
        <div className="flex items-center justify-center gap-2 pt-6">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
              currentPage <= 1
                ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(5, pagination.lastPage) }, (_, i) => {
              let pageNum;
              if (pagination.lastPage <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.lastPage - 2) {
                pageNum = pagination.lastPage - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }

              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === pageNum
                      ? 'bg-amber-500 text-slate-950 shadow-sm font-extrabold'
                      : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= pagination.lastPage}
            className={`p-2.5 rounded-xl border text-xs font-bold flex items-center gap-1 transition-colors ${
              currentPage >= pagination.lastPage
                ? 'bg-slate-50 text-slate-300 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
            }`}
          >
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
