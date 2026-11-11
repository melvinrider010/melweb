import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
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
  ChevronRight,
  Menu,
  Layout,
  Crown,
  ArrowRight
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
  'About Us': 'bg-sky-50 text-sky-700 border-sky-200',
  'Academics': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  'Examination': 'bg-amber-50 text-amber-700 border-amber-200',
  'Research': 'bg-purple-50 text-purple-700 border-purple-200',
  'Student Support': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Mandatory Disclosure': 'bg-rose-50 text-rose-700 border-rose-200',
  'IQAC & Quality': 'bg-teal-50 text-teal-700 border-teal-200',
  'General': 'bg-slate-100 text-slate-700 border-slate-200'
};

const getLiveUrl = (p) => {
  if (!p) return '/';
  if (p.slug === 'home') return '/';
  
  // Direct mapped tab routes for About Us section
  if (p.slug === 'vision-mission' || p.slug === 'vision') return '/about?tab=vision';
  if (p.slug === 'history') return '/about?tab=history';
  if (p.slug === 'coat-of-arms') return '/about?tab=coat-of-arms';
  if (p.slug === 'former-bishops') return '/about?tab=bishops';
  if (p.slug === 'former-principals') return '/about?tab=principals';
  if (p.slug === 'mdes') return '/about?tab=mdes';
  if (p.slug === 'organogram') return '/about?tab=organogram';
  if (p.slug === 'governing-body') return '/about?tab=governing-body';
  if (p.slug === 'leadership') return '/about?tab=leadership';

  const directRoutes = [
    'about', 'history', 'vision-mission', 'coat-of-arms', 'former-bishops', 'former-principals',
    'mdes', 'organogram', 'governing-body', 'statutory-bodies', 'leadership', 'rectors-message', 'principals-message',
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

      {/* NAVIGATION SUITE SWITCHER */}
      <div className="flex items-center space-x-1.5 bg-slate-100/80 p-1.5 rounded-2xl text-xs font-semibold w-fit">
        <button
          className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold shadow-xs inline-flex items-center space-x-1.5 cursor-default"
        >
          <Layers className="w-3.5 h-3.5 text-indigo-600" />
          <span>All Pages ({pages.length})</span>
        </button>
        <Link
          to="/admin/menus"
          className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center space-x-1.5"
        >
          <Menu className="w-3.5 h-3.5 text-slate-400" />
          <span>Mega-Menu Editor</span>
        </Link>
        <Link
          to="/admin/header-footer"
          className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center space-x-1.5"
        >
          <Layout className="w-3.5 h-3.5 text-slate-400" />
          <span>Header & Footer</span>
        </Link>
      </div>

      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              Metronic Pages Hub v22.4
            </span>
            <span className="text-slate-500 text-xs font-sans">
              {pages.length} Authoritative Institutional Pages
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#191d28] tracking-tight">
            All Pages & Mega-Menu Content Hub
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-3xl leading-relaxed">
            Exhaustive management center for all institutional landing pages, mega-headers, sub-menus, compliance dossiers, student amenities, and dynamic articles. Add, edit, write, or preview live across the entire college domain.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => handleOpenAdd(selectedCategory)}
            className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs inline-flex items-center space-x-2 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Page</span>
          </button>
        </div>
      </div>

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 hover:border-slate-300 transition-colors shadow-xs">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Pages</span>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">{pages.length}</p>
            <span className="text-[11px] text-slate-500 font-sans">across 8 hubs</span>
          </div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 hover:border-slate-300 transition-colors shadow-xs">
          <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">Published & Live</span>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
              {pages.filter(p => (p.status || 'published') === 'published').length}
            </p>
            <span className="text-[11px] text-emerald-600/80 font-sans">Active</span>
          </div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 hover:border-slate-300 transition-colors shadow-xs">
          <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider block">Drafts & Staging</span>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
              {pages.filter(p => p.status === 'draft').length}
            </p>
            <span className="text-[11px] text-amber-600/80 font-sans">Pending</span>
          </div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 hover:border-slate-300 transition-colors shadow-xs">
          <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-wider block">Mega-Menu Hubs</span>
          <div className="flex items-baseline space-x-2">
            <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono">8</p>
            <span className="text-[11px] text-indigo-600/80 font-sans">Hierarchies</span>
          </div>
        </div>
      </div>

      {/* 3. CATEGORY FILTER TABS (All Mega-Headers) */}
      <div className="bg-slate-100/80 border border-slate-200/60 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto text-xs font-sans">
        {CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat;
          const count = categoryCounts[cat] || 0;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                isSelected
                  ? 'bg-[#18191f] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              <span>{cat}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* 4. TOOLBAR & SEARCH */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by page title, slug, category, keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-end text-xs text-slate-500">
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>Status:</span>
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
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
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-2.5 py-1.5 text-xs text-slate-700 focus:outline-none focus:bg-white cursor-pointer"
            >
              <option value="order">Menu Hierarchy</option>
              <option value="title">Title (A-Z)</option>
              <option value="category">Category</option>
              <option value="date">Recently Updated</option>
            </select>
          </div>

          <span className="font-mono text-[11px] text-slate-400 pl-2">
            Showing {filteredPages.length} of {pages.length}
          </span>
        </div>
      </div>

      {/* 5. PAGES MASTER DATA TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">#</th>
                <th className="py-3.5 px-4 min-w-[240px]">Page Title & Summary</th>
                <th className="py-3.5 px-4">Mega Header / Hub</th>
                <th className="py-3.5 px-4 min-w-[180px]">Live Route</th>
                <th className="py-3.5 px-4">Parent Section</th>
                <th className="py-3.5 px-4">Last Modified</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[150px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 font-sans text-sm">
                    No pages matched the current filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredPages.map((p, idx) => {
                  const liveUrl = getLiveUrl(p);
                  const catColor = CATEGORY_COLORS[p.category] || CATEGORY_COLORS['General'];
                  return (
                    <tr key={p.id || idx} className="hover:bg-slate-50/70 transition-colors group">
                      
                      <td className="py-3.5 px-4 text-center font-mono text-slate-400 text-[11px]">
                        {p.order || idx + 1}
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="space-y-1">
                          <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors block text-sm">
                            {p.title}
                          </span>
                          {p.excerpt && (
                            <p className="text-[11px] text-slate-500 line-clamp-1 max-w-sm">
                              {p.excerpt}
                            </p>
                          )}
                          {(p.slug === 'leadership' || p.id === 'page-leadership') && (
                            <Link
                              to="/admin/leadership"
                              className="inline-flex items-center space-x-1.5 px-2 py-0.5 mt-1 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-[10px] font-bold transition-colors w-fit"
                            >
                              <Crown className="w-3 h-3 text-amber-600" />
                              <span>Manage Leaders Roster &rarr;</span>
                            </Link>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase border ${catColor}`}>
                          {p.category || 'General'}
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-600 text-[11px]">
                        <div className="flex items-center space-x-1.5">
                          <span className="text-slate-500 truncate max-w-[140px]">{liveUrl}</span>
                        </div>
                      </td>

                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        {p.parentSlug ? `/${p.parentSlug}` : <span className="text-slate-400">Root</span>}
                      </td>

                      <td className="py-3.5 px-4 font-mono text-slate-400 text-[11px]">
                        {p.lastUpdated || '2026-09-07'}
                      </td>

                      <td className="py-3.5 px-4 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase border ${
                          (p.status || 'published') === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
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
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors"
                            title="View on Live Website"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* 2. CMS Dynamic Preview Link */}
                          <a
                            href={liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
                            title="Preview Connected Live Page"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>

                          {/* 3. Revisions */}
                          <button
                            onClick={() => setHistoryModalPage(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
                            title="View Revisions"
                          >
                            <History className="w-3.5 h-3.5" />
                          </button>

                          {/* 4. Edit */}
                          <button
                            onClick={() => handleOpenEdit(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Edit Page"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* 5. Duplicate */}
                          <button
                            onClick={() => handleDuplicate(p)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
                            title="Duplicate Page"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          {/* 6. Delete */}
                          <button
                            onClick={() => handleDelete(p.id, p.title)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-4xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto my-auto text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block font-bold">
                  Metronic Page Builder & Content Author
                </span>
                <h3 className="font-extrabold text-2xl text-[#191d28] tracking-tight">
                  {editingPage ? `Edit: ${editingPage.title}` : 'Create New Site Page'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Direct Link to Leadership & Academic Heads Manager if editing Leadership page */}
            {editingPage && (editingPage.slug === 'leadership' || editingPage.id === 'page-leadership' || (editingPage.title && editingPage.title.toLowerCase().includes('leadership'))) && (
              <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-700 shrink-0">
                    <Crown className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-amber-950">Looking to add or edit Leaders & Academic Heads?</h4>
                    <p className="text-[11px] text-amber-800 leading-snug">
                      Individual officers (Principal, Rector, Deans, IQAC Coordinator, etc.) are managed in the dedicated Leadership Hub with photos, biographies, and reordering.
                    </p>
                  </div>
                </div>
                <Link
                  to="/admin/leadership"
                  className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
                >
                  <span>Open Leadership CMS</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-100 text-xs font-semibold gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'basic' ? 'border-[#18191f] text-[#18191f] font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                1. Page Info & Hierarchy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'content' ? 'border-[#18191f] text-[#18191f] font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
                }`}
              >
                2. Body Content & Media
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`py-2.5 px-4 border-b-2 transition-colors cursor-pointer ${
                  activeTab === 'seo' ? 'border-[#18191f] text-[#18191f] font-bold' : 'border-transparent text-slate-500 hover:text-slate-800'
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
                      <label className="text-slate-700 font-bold block">Page Title *</label>
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
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 text-sm focus:outline-none focus:bg-white focus:border-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold block">Mega-Header / Category *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                      >
                        {CATEGORIES.filter(c => c !== 'All').map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold block">URL Slug * (/pages/slug)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. campus-sustainability"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold block">Parent Section (Hierarchy)</label>
                      <select
                        value={formData.parentSlug}
                        onChange={(e) => setFormData({ ...formData, parentSlug: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
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
                      <label className="text-slate-700 font-bold block">Display Order in Menu</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value, 10) || 0 })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-slate-900"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold block">Publication Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                      >
                        <option value="published">Published (Live on Site)</option>
                        <option value="draft">Draft (Under Review)</option>
                        <option value="archived">Archived (Hidden)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-slate-700 font-bold block">Page Type Classification</label>
                      <select
                        value={formData.pageType}
                        onChange={(e) => setFormData({ ...formData, pageType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
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
                    <label className="text-slate-700 font-bold block">Featured Header Banner Image URL</label>
                    <input
                      type="text"
                      placeholder="/assets/images/campus/admin_quadrangle_heritage.jpg"
                      value={formData.featuredImage}
                      onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 font-mono focus:outline-none focus:bg-white focus:border-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold block">Excerpt / Executive Summary</label>
                    <textarea
                      rows={2}
                      placeholder="Brief 1-2 sentence executive summary for search engines, cards, and previews..."
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-700 font-bold block">Page Body Content (Markdown / Text) *</label>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formData.content.length} characters | {formData.content.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                    </div>
                    <textarea
                      rows={10}
                      required
                      placeholder="Write the complete content of the page here. Paragraphs separated by blank lines will be formatted automatically..."
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 font-sans text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: SEO */}
              {activeTab === 'seo' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold block">SEO Meta Title</label>
                    <input
                      type="text"
                      placeholder="Title tag for Google and browser tabs..."
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-slate-700 font-bold block">SEO Meta Description</label>
                    <textarea
                      rows={3}
                      placeholder="150-160 characters summary for Google/Bing search results..."
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      Search Engine Snippet Preview
                    </span>
                    <p className="text-blue-600 font-semibold text-sm truncate">
                      {formData.seoTitle || formData.title || 'Page Title'}
                    </p>
                    <p className="text-emerald-600 font-mono text-[11px] truncate">
                      https://stphilos.ac.in{formData.slug ? `/pages/${formData.slug}` : ''}
                    </p>
                    <p className="text-slate-500 text-xs line-clamp-2">
                      {formData.seoDescription || formData.excerpt || 'Page description preview...'}
                    </p>
                  </div>
                </div>
              )}

              {/* MODAL FOOTER */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
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
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-amber-700 font-bold cursor-pointer transition-colors"
                  >
                    Save as Draft
                  </button>

                  <button
                    type="submit"
                    className="bg-[#18191f] hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold shadow-xs cursor-pointer transition-all"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <History className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="font-extrabold text-lg text-[#191d28]">
                    Revision History
                  </h3>
                  <p className="text-xs text-slate-500 font-sans truncate max-w-xs">
                    {historyModalPage.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setHistoryModalPage(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {cmsStore.getRevisions('page', historyModalPage.id).length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <History className="w-8 h-8 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-500 italic">
                    No previous revisions recorded yet for this page.
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Revisions are saved automatically every time a page is updated.
                  </p>
                </div>
              ) : (
                cmsStore.getRevisions('page', historyModalPage.id).map((rev, rIdx) => (
                  <div key={rev.id || rIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-mono text-slate-800 font-bold block">
                        {new Date(rev.timestamp).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">Modified by {rev.user}</span>
                    </div>

                    <button
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="px-3 py-1.5 rounded-xl bg-[#18191f] hover:bg-black text-white font-bold text-xs inline-flex items-center space-x-1 cursor-pointer transition-colors shadow-xs"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Restore</span>
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setHistoryModalPage(null)}
                className="px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-700 cursor-pointer"
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
