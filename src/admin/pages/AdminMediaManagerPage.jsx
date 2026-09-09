import React, { useState, useMemo } from 'react';
import mediaData from '../../data/media.json';
import { 
  Search, 
  Image as ImageIcon, 
  ExternalLink, 
  Download, 
  Filter, 
  Copy, 
  Check, 
  Eye, 
  Maximize2, 
  FolderCheck, 
  HardDrive, 
  Layers, 
  X,
  Sparkles,
  Grid,
  List
} from 'lucide-react';

export default function AdminMediaManagerPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [activeMedia, setActiveMedia] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Extract unique categories
  const categories = useMemo(() => {
    const cats = Array.from(new Set(mediaData.map(m => m.category || 'General')));
    return ['ALL', ...cats.sort()];
  }, []);

  // Compute statistics
  const totalAssets = mediaData.length;
  const totalSizeBytes = useMemo(() => {
    return mediaData.reduce((acc, curr) => acc + (curr.fileSize || 0), 0);
  }, []);
  const totalSizeMB = (totalSizeBytes / (1024 * 1024)).toFixed(1);

  // Filtered assets
  const filtered = useMemo(() => {
    return mediaData.filter(m => {
      const matchSearch = 
        (m.filename && m.filename.toLowerCase().includes(search.toLowerCase())) ||
        (m.altText && m.altText.toLowerCase().includes(search.toLowerCase())) ||
        (m.category && m.category.toLowerCase().includes(search.toLowerCase()));
      
      const matchCategory = selectedCategory === 'ALL' || m.category === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [search, selectedCategory]);

  const handleCopyPath = (path, id) => {
    navigator.clipboard.writeText(path);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              Asset Storage Engine
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Synchronized
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191d28] tracking-tight mt-1">
            Media Library Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed mt-1">
            Curated archive of campus photography, historical memorabilia, and high-resolution digital visual assets.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-100/80 border border-slate-200/60 p-1 rounded-xl flex items-center">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              title="Grid View"
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'table' ? 'bg-white text-slate-900 shadow-xs font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Preserved Images</span>
            <ImageIcon className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">
            {totalAssets.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">100% verified local media</div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Categories</span>
            <FolderCheck className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">
            {categories.length - 1}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Categorized directories</div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Preserved Volume</span>
            <HardDrive className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">
            {totalSizeMB} <span className="text-sm font-sans font-medium text-slate-500">MB</span>
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Optimized WebP / JPEG / PNG</div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Active Filter Match</span>
            <Layers className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">
            {filtered.length.toLocaleString()}
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Ready for layout injection</div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-[#18191f] text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {cat === 'ALL' ? 'All Visuals' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search filename, category, caption..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-8 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Content Rendering: Grid vs Table */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filtered.slice(0, 48).map((item) => (
            <div 
              key={item.id} 
              className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div 
                className="aspect-[4/3] bg-slate-100 relative overflow-hidden cursor-pointer"
                onClick={() => setActiveMedia(item)}
              >
                <img 
                  src={item.localPath} 
                  alt={item.altText || item.filename} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  loading="lazy"
                  onError={(e) => {
                    e.currentTarget.src = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80";
                  }}
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="p-2 rounded-xl bg-white/90 text-slate-900 hover:bg-white transition-colors shadow-lg">
                    <Maximize2 className="w-4 h-4" />
                  </span>
                </div>
                <span className="absolute top-2.5 left-2.5 bg-[#18191f]/85 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded-lg uppercase tracking-wider">
                  {item.category || 'Visual'}
                </span>
                <span className="absolute bottom-2.5 right-2.5 bg-white/90 backdrop-blur-xs text-slate-700 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded shadow-xs">
                  {Math.round((item.fileSize || 0) / 1024)} KB
                </span>
              </div>

              <div className="p-3.5 space-y-2 text-xs">
                <p className="font-bold text-slate-900 truncate" title={item.filename}>
                  {item.filename}
                </p>
                <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => handleCopyPath(item.localPath, item.id)}
                    className="inline-flex items-center gap-1 text-slate-600 hover:text-slate-900 font-semibold cursor-pointer transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span className="text-emerald-600">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Path</span>
                      </>
                    )}
                  </button>

                  {item.originalUrl && (
                    <a 
                      href={item.originalUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      <span>Source</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200/80">
                  <th className="py-3 px-4">Preview</th>
                  <th className="py-3 px-4">Filename</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">File Size</th>
                  <th className="py-3 px-4">Local Asset Path</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filtered.slice(0, 50).map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/70 transition-colors group">
                    <td className="py-2.5 px-4">
                      <div 
                        onClick={() => setActiveMedia(item)}
                        className="w-12 h-10 rounded-lg overflow-hidden bg-slate-100 border border-slate-200 cursor-pointer relative"
                      >
                        <img 
                          src={item.localPath} 
                          alt={item.filename}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform" 
                          onError={(e) => {
                            e.currentTarget.src = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=120&q=80";
                          }}
                        />
                      </div>
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-900 max-w-xs truncate">
                      {item.filename}
                    </td>
                    <td className="py-2.5 px-4">
                      <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md font-mono text-[10px] font-bold uppercase">
                        {item.category || 'General'}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 font-mono text-slate-600">
                      {Math.round((item.fileSize || 0) / 1024)} KB
                    </td>
                    <td className="py-2.5 px-4 font-mono text-[11px] text-slate-500 max-w-xs truncate">
                      {item.localPath}
                    </td>
                    <td className="py-2.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => handleCopyPath(item.localPath, item.id)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer inline-flex items-center"
                        title="Copy Local Path"
                      >
                        {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => setActiveMedia(item)}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer inline-flex items-center"
                        title="Inspect"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Media Inspector Modal */}
      {activeMedia && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div>
                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase">
                  {activeMedia.category || 'Media Detail'}
                </span>
                <h3 className="text-xl font-extrabold text-[#191d28] mt-1 truncate max-w-md">
                  {activeMedia.filename}
                </h3>
              </div>
              <button
                onClick={() => setActiveMedia(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-200 max-h-80 flex items-center justify-center">
              <img 
                src={activeMedia.localPath} 
                alt={activeMedia.altText || activeMedia.filename}
                className="max-h-80 w-auto object-contain"
                onError={(e) => {
                  e.currentTarget.src = "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1000&q=80";
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">File Size</span>
                <span className="font-mono font-bold text-slate-800 text-sm">
                  {Math.round((activeMedia.fileSize || 0) / 1024)} KB
                </span>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/60">
                <span className="text-[10px] font-mono uppercase text-slate-400 block mb-1">Storage State</span>
                <span className="font-mono font-bold text-emerald-600 text-sm flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Local Preserved
                </span>
              </div>
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Local Resource URI</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={activeMedia.localPath}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-mono text-slate-700 text-xs"
                />
                <button
                  onClick={() => handleCopyPath(activeMedia.localPath, activeMedia.id)}
                  className="px-4 py-2 bg-[#18191f] text-white rounded-xl text-xs font-bold shrink-0 hover:bg-black transition-colors flex items-center gap-1.5"
                >
                  {copiedId === activeMedia.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  <span>Copy</span>
                </button>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              {activeMedia.originalUrl && (
                <a
                  href={activeMedia.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Original Source</span>
                </a>
              )}
              <button
                onClick={() => setActiveMedia(null)}
                className="px-5 py-2 bg-[#18191f] text-white rounded-xl text-xs font-bold hover:bg-black transition-colors"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
