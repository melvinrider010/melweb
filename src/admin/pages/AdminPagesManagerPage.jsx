import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  History, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Globe, 
  Layers, 
  Sparkles,
  ExternalLink,
  Filter,
  BookOpen,
  FolderOpen,
  Tag,
  Calendar,
  Clock,
  ArrowUpRight,
  Copy,
  ChevronRight
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';

const CATEGORIES = [
  'All',
  'About Us',
  'Academics',
  'Examination',
  'Research',
  'Student Support',
  'Mandatory Disclosure',
  'IQAC & Quality',
  'General'
];

const CATEGORY_COLORS = {
  'About Us': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
  'Academics': 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  'Examination': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  'Research': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'Student Support': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Mandatory Disclosure': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
  'IQAC & Quality': 'bg-teal-500/10 text-teal-400 border-teal-500/20',
  'General': 'bg-slate-500/10 text-slate-400 border-slate-500/20'
};

const getLiveUrl = (p) => {
  if (!p) return '/';
  if (p.slug === 'home') return '/';
  
  const directRoutes = [
    'about', 'history', 'vision-mission', 'coat-of-arms', 'former-bishops', 'former-principals',
    'mdes', 'organogram', 'governing-body', 'statutory-bodies', 'rectors-message', 'principals-message',
    'academics', 'departments', 'faculty', 'prospectus', 'admissions', 'apply', 'applications',
    'examinations', 'research', 'student-life', 'student-support', 'facilities', 'infrastructure',
    'campus', 'business-lab', 'computer-science-lab', 'girls-hostel', 'boys-hostel', 'auditorium',
    'bank-atm', 'chapel', 'ranger-and-rovers', 'ncc', 'nss', 'indoor-stadium', 'resources',
    'iqac', 'naac', 'nirf', 'iic', 'mandatory-disclosure', 'compliance', 'alumni', 'gallery',
    'contact', 'documents', 'news-events', 'notices', 'events', 'anthems', 'library', 'magazine'
  ];

  if (directRoutes.includes(p.slug)) {
    return `/${p.slug}`;
  }

  if (p.category === 'Mandatory Disclosure') {
    return `/mandatory-disclosure/${p.slug}`;
  }

  if (p.category === 'Student Support') {
    return `/student-support/${p.slug}`;
  }

  return `/pages/${p.slug}`;
};

export default function AdminPagesManagerPage() {
  const pages = useCms(() => cmsStore.getPages());

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('order');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [historyModalPage, setHistoryModalPage] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'content' | 'seo'
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const initialForm = {
    id: '',
    title: '',
    slug: '',
    parentSlug: '',
    pageType: 'institutional',
    category: 'About Us',
    featuredImage: '/assets/images/campus/admin_quadrangle_heritage.jpg',
    excerpt: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    status: 'published',
    order: pages.length + 1
  };

  const [formData, setFormData] = useState(initialForm);

  // Filtered & Sorted Pages
  const filteredPages = useMemo(() => {
    let list = pages.filter(p => {
      // Category filter
      if (selectedCategory !== 'All') {
        const cat = p.category || 'General';
        if (cat !== selectedCategory) return false;
      }
      // Status filter
      if (selectedStatusFilter !== 'all') {
        const st = p.status || 'published';
        if (st !== selectedStatusFilter) return false;
      }
      // Search term
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase();
        const inTitle = (p.title || '').toLowerCase().includes(q);
        const inSlug = (p.slug || '').toLowerCase().includes(q);
        const inExcerpt = (p.excerpt || '').toLowerCase().includes(q);
        const inCat = (p.category || '').toLowerCase().includes(q);
        if (!inTitle && !inSlug && !inExcerpt && !inCat) return false;
      }
      return true;
    });

    list.sort((a, b) => {
      if (sortBy === 'order') return (a.order || 999) - (b.order || 999);
      if (sortBy === 'title') return (a.title || '').localeCompare(b.title || '');
      if (sortBy === 'category') return (a.category || '').localeCompare(b.category || '');
      if (sortBy === 'date') return new Date(b.lastUpdated || 0) - new Date(a.lastUpdated || 0);
      return 0;
    });

    return list;
  }, [pages, selectedCategory, selectedStatusFilter, searchTerm, sortBy]);

  // Category Counts
  const categoryCounts = useMemo(() => {
    const counts = { All: pages.length };
    CATEGORIES.forEach(c => {
      if (c !== 'All') {
        counts[c] = pages.filter(p => (p.category || 'General') === c).length;
      }
    });
    return counts;
  }, [pages]);

  const handleOpenAdd = (presetCategory = null) => {
    setEditingPage(null);
    setFormData({
      ...initialForm,
      category: presetCategory && presetCategory !== 'All' ? presetCategory : 'About Us',
      order: pages.length + 1
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPage(p);
    setFormData({
      id: p.id || '',
      title: p.title || '',
      slug: p.slug || '',
      parentSlug: p.parentSlug || '',
      pageType: p.pageType || 'institutional',
      category: p.category || 'General',
      featuredImage: p.featuredImage || '/assets/images/campus/admin_quadrangle_heritage.jpg',
      excerpt: p.excerpt || '',
      content: p.content || '',
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
      status: p.status || 'published',
      order: p.order || 1
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleDuplicate = async (p) => {
    const copyTitle = `${p.title} (Copy)`;
    const copySlug = `${p.slug}-copy-${Date.now().toString().slice(-4)}`;
    const newPage = {
      ...p,
      id: '',
      title: copyTitle,
      slug: copySlug,
      status: 'draft',
      order: (p.order || 0) + 1
    };
    await cmsStore.savePage(newPage);
    showToast(`Created duplicate page: ${copyTitle}`);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.slug) {
      alert('Page Title and URL Slug are required.');
      return;
    }
    await cmsStore.savePage(formData);
    setIsModalOpen(false);
    showToast(`Successfully saved "${formData.title}"!`);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete page "${title}"? This action can be undone via Revision History.`)) {
      await cmsStore.deletePage(id);
      showToast(`Deleted page "${title}"`);
    }
  };

  const handleRestoreRevision = async (revId) => {
    if (historyModalPage && revId) {
      await cmsStore.restoreRevision('page', historyModalPage.id, revId);
      setHistoryModalPage(null);
      showToast('Revision restored successfully!');
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl font-sans text-xs font-bold flex items-center space-x-2 animate-slideUp">
          <CheckCircle2 className="w-4 h-4 text-white" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#08121E] border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C5496] text-[#FFD84A] font-mono text-[10px] font-bold uppercase tracking-wider">
              Metronic Pages Hub v22.4
            </span>
            <span className="text-slate-400 text-xs font-sans">
              {pages.length} Authoritative Institutional Pages
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-extrabold text-white tracking-tight">
            All Pages & Mega-Menu Content Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-3xl leading-relaxed">
            Exhaustive management center for all institutional landing pages, mega-headers, sub-menus, compliance dossiers, student amenities, and dynamic articles. Add, edit, write, or preview live across the entire college domain.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => handleOpenAdd(selectedCategory)}
            className="btn-gold px-5 py-3 rounded-xl text-xs font-bold shadow-lg inline-flex items-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0D1B2A] border border-slate-800/90 p-4 rounded-2xl space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Pages</span>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl sm:text-3xl font-bold text-white font-mono">{pages.length}</p>
            <span className="text-[11px] text-slate-500 font-sans">across 8 hubs</span>
          </div>
        </div>

        <div className="bg-[#0D1B2A] border border-slate-800/90 p-4 rounded-2xl space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Published & Live</span>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
              {pages.filter(p => (p.status || 'published') === 'published').length}
            </p>
            <span className="text-[11px] text-emerald-600 font-sans">Active</span>
          </div>
        </div>

        <div className="bg-[#0D1B2A] border border-slate-800/90 p-4 rounded-2xl space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">Drafts & Staging</span>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl sm:text-3xl font-bold text-[#FFD84A] font-mono">
              {pages.filter(p => p.status === 'draft').length}
            </p>
            <span className="text-[11px] text-amber-500/70 font-sans">Pending</span>
          </div>
        </div>

        <div className="bg-[#0D1B2A] border border-slate-800/90 p-4 rounded-2xl space-y-1 hover:border-slate-700 transition-colors">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">Mega-Menu Hubs</span>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl sm:text-3xl font-bold text-indigo-400 font-mono">8</p>
            <span className="text-[11px] text-indigo-500 font-sans">Hierarchies</span>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY FILTER TABS (All Mega-Headers) */}
      <div className="bg-[#0D1B2A] border border-slate-800 p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto shadow-inner text-xs font-sans">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-2 rounded-xl whitespace-nowrap font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#1C5496] text-white shadow-md'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>{cat}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. TOOLBAR & SEARCH */}
      <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-md">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by page title, slug, category, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1C5496] transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <span>Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex items-center space-x-1.5">
            <span>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="order">Menu Hierarchy</option>
              <option value="title">Title (A-Z)</option>
              <option value="category">Category</option>
              <option value="date">Recently Updated</option>
            </select>
          </div>

          <span className="font-mono text-[11px] text-slate-500 pl-2">
            Showing {filteredPages.length} of {pages.length}
          </span>
        </div>
      </div>

      {/* 5. PAGES MASTER DATA TABLE */}
      <div className="bg-[#0D1B2A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08121E] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-4 px-4 w-12 text-center">#</th>
                <th className="py-4 px-4 min-w-[240px]">Page Title & Summary</th>
                <th className="py-4 px-4">Mega Header / Hub</th>
                <th className="py-4 px-4 min-w-[180px]">Live Route</th>
                <th className="py-4 px-4">Parent Section</th>
                <th className="py-4 px-4">Last Modified</th>
                <th className="py-4 px-4 text-center">Status</th>
                <th className="py-4 px-4 text-right min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-500 font-sans text-sm">
                    No pages matched the current filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredPages.map((p, idx) => {
                  const liveUrl = getLiveUrl(p);
                  const catColor = CATEGORY_COLORS[p.category] || CATEGORY_COLORS['General'];
                  return (
                    <tr key={p.id || idx} className="hover:bg-slate-800/40 transition-colors group">
                      
                      <td className="py-3.5 px-4 text-center font-mono text-slate-500 text-[11px]">
                        {p.order || idx + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="font-bold text-white group-hover:text-[#FFD84A] transition-colors block text-sm">
                            {p.title}
                          </span>
                          {p.excerpt && (
                            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-sm">
                              {p.excerpt}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase border ${catColor}`}>
                          {p.category || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-300 text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-slate-400 truncate max-w-[140px]">{liveUrl}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-400 font-mono text-[11px]">
                        {p.parentSlug ? `/${p.parentSlug}` : <span className="text-slate-600">Root</span>}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {p.lastUpdated || '2026-09-07'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border ${
                          (p.status || 'published') === 'published'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        }`}>
                          {p.status || 'published'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* 1. Live Site Link */}
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#1C5496] text-slate-400 hover:text-white transition-colors"
                            title="View on Live Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* 2. CMS Dynamic Preview Link */}
                          <a
                            href={`/pages/${p.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[#FFD84A] transition-colors"
                            title="Preview CMS Dynamic View"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>

                          {/* 3. Revisions */}
                          <button
                            onClick={() => setHistoryModalPage(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                            title="View Revisions"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. Edit */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#1C5496] text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Edit Page"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 5. Duplicate */}
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                            title="Duplicate Page"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* 6. Delete */}
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                            title="Delete Page"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT PAGE ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto my-auto text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">
                  Metronic Page Builder & Content Author
                </span>
                <h3 className="font-serif font-bold text-2xl text-white">
                  {editingPage ? `Edit: ${editingPage.title}` : 'Create New Site Page'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800 text-xs font-semibold gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'basic' ? 'border-[#FFD84A] text-[#FFD84A]' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Page Info & Hierarchy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'content' ? 'border-[#FFD84A] text-[#FFD84A]' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Body Content & Media
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'seo' ? 'border-[#FFD84A] text-[#FFD84A]' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                3. SEO & OpenGraph Meta
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-5 text-xs">
              
              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="text-slate-300 font-bold block">Page Title *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Campus Sustainability Initiatives"
                        value={formData.title}
                        onChange={(e) => {
                          const title = e.target.value;
                          const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                          setFormData({ 
                            ...formData, 
                            title, 
                            slug: formData.slug || slug,
                            seoTitle: formData.seoTitle || `${title} | St. Philomena's College`
                          });
                        }}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block">Mega-Header / Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                      >
                        {CATEGORIES.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block">URL Slug * (/pages/slug)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. campus-sustainability"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block">Parent Section (Hierarchy)</label>
                      <select
                        value={formData.parentSlug}
                        onChange={(e) => setFormData({ ...formData, parentSlug: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                      >
                        <option value="">None (Top-Level Page)</option>
                        <option value="about">About Us</option>
                        <option value="academics">Academics</option>
                        <option value="admissions">Admissions</option>
                        <option value="examinations">Examinations</option>
                        <option value="research">Research</option>
                        <option value="student-life">Student Life & Support</option>
                        <option value="mandatory-disclosure">Mandatory Disclosure</option>
                        <option value="iqac">Quality & IQAC</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block">Display Order in Menu</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block">Publication Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                      >
                        <option value="published">Published (Live on Site)</option>
                        <option value="draft">Draft (Under Review)</option>
                        <option value="archived">Archived (Hidden)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-300 font-bold block">Page Type Classification</label>
                      <select
                        value={formData.pageType}
                        onChange={(e) => setFormData({ ...formData, pageType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                      >
                        <option value="institutional">Institutional</option>
                        <option value="compliance">Compliance / Statutory</option>
                        <option value="amenity">Campus Amenity / Facility</option>
                        <option value="academic">Academic / Curriculum</option>
                        <option value="general">General Informational</option>
                      </select>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: CONTENT & WRITING */}
              {activeTab === 'content' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">Featured Header Banner Image URL</label>
                    <input
                      type="text"
                      placeholder="/assets/images/campus/admin_quadrangle_heritage.jpg"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#1C5496]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">Excerpt / Executive Summary</label>
                    <textarea
                      rows={2}
                      placeholder="Brief 1-2 sentence executive summary for search engines, cards, and previews..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-300 font-bold block">Page Body Content (Markdown / Text) *</label>
                      <span className="text-[10px] text-slate-500 font-mono">
                        {formData.content.length} characters | {formData.content.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <textarea
                      rows={10}
                      required
                      placeholder="Write the complete content of the page here. Paragraphs separated by blank lines will be formatted automatically..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496] font-sans text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">SEO Meta Title</label>
                    <input
                      type="text"
                      placeholder="Title tag for Google and browser tabs..."
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-300 font-bold block">SEO Meta Description</label>
                    <textarea
                      rows={3}
                      placeholder="150-160 characters summary for Google/Bing search results..."
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-1.5">
                    <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">
                      Search Engine Snippet Preview
                    </span>
                    <p className="text-blue-400 font-semibold text-sm truncate">
                      {formData.seoTitle || formData.title || 'Page Title'}
                    </p>
                    <p className="text-emerald-500 font-mono text-[11px] truncate">
                      https://stphilos.ac.in{formData.slug ? `/pages/${formData.slug}` : ''}
                    </p>
                    <p className="text-slate-400 text-xs line-clamp-2">
                      {formData.seoDescription || formData.excerpt || 'Page description preview...'}
                    </p>
                  </div>
                </div>
              )}

              {/* MODAL FOOTER */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, status: 'draft' });
                      setTimeout(() => {
                        const fakeEvent = { preventDefault: () => {} };
                        handleSave(fakeEvent);
                      }, 50);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-[#FFD84A] font-bold cursor-pointer transition-colors"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    {editingPage ? 'Save Page Changes' : 'Create & Publish Page'}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: REVISION HISTORY ================= */}
      {historyModalPage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2.5">
                <History className="w-5 h-5 text-[#FFD84A]" />
                <div>
                  <h3 className="font-serif font-bold text-lg text-white">
                    Revision History
                  </h3>
                  <p className="text-xs text-slate-400 font-sans truncate max-w-xs">
                    {historyModalPage.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryModalPage(null)}
                className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cmsStore.getRevisions('page', historyModalPage.id).length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <History className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400 italic">
                    No previous revisions recorded yet for this page.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    Revisions are saved automatically every time a page is updated.
                  </p>
                </div>
              ) : (
                cmsStore.getRevisions('page', historyModalPage.id).map((rev, rIdx) => (
                  <div key={rev.id || rIdx} className="p-3.5 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-mono text-slate-200 font-bold block">
                        {new Date(rev.timestamp).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">Modified by {rev.user}</span>
                    </div>

                    <button
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#1C5496] hover:bg-[#0B1F4E] text-white font-bold text-xs inline-flex items-center space-x-1 cursor-pointer transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setHistoryModalPage(null)}
                className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
