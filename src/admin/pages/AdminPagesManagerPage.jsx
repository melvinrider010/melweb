import React, { useState } from 'react';
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
  Image as ImageIcon,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';

export default function AdminPagesManagerPage() {
  const pages = useCms(() => cmsStore.getPages());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState(null);
  const [historyModalPage, setHistoryModalPage] = useState(null);
  const [activeTab, setActiveTab] = useState('content'); // 'content' | 'seo'

  const initialForm = {
    id: '',
    title: '',
    slug: '',
    parentSlug: '',
    pageType: 'general',
    featuredImage: '/assets/banner-college.jpg',
    excerpt: '',
    content: '',
    seoTitle: '',
    seoDescription: '',
    status: 'published',
    order: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredPages = pages.filter(p => {
    const matchesSearch = (
      (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.slug || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.excerpt || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = selectedStatusFilter === 'all' || (p.status || 'published') === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingPage(null);
    setFormData(initialForm);
    setActiveTab('content');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingPage(p);
    setFormData({
      id: p.id || '',
      title: p.title || '',
      slug: p.slug || '',
      parentSlug: p.parentSlug || '',
      pageType: p.pageType || 'general',
      featuredImage: p.featuredImage || '/assets/banner-college.jpg',
      excerpt: p.excerpt || '',
      content: p.content || '',
      seoTitle: p.seoTitle || '',
      seoDescription: p.seoDescription || '',
      status: p.status || 'published',
      order: p.order || 0
    });
    setActiveTab('content');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await cmsStore.savePage(formData);
    setIsModalOpen(false);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete page "${title}"?`)) {
      await cmsStore.deletePage(id);
    }
  };

  const handleRestoreRevision = async (revId) => {
    if (historyModalPage && revId) {
      await cmsStore.restoreRevision('page', historyModalPage.id, revId);
      setHistoryModalPage(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08121E] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C5496] text-[#FFD84A] font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module 22.4
            </span>
            <span className="text-slate-400 text-xs">Dynamic Hierarchical Pages</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            General Pages & Content Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Create custom landing pages, institutional policy articles, and compliance sections without modifying code or routes.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-5 py-3 rounded-xl text-xs font-bold shadow-lg inline-flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Page</span>
        </button>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Pages</span>
          <p className="text-2xl font-bold text-white">{pages.length}</p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-emerald-400 uppercase">Live Published</span>
          <p className="text-2xl font-bold text-emerald-400">
            {pages.filter(p => (p.status || 'published') === 'published').length}
          </p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-[#FFD84A] uppercase">Drafts</span>
          <p className="text-2xl font-bold text-[#FFD84A]">
            {pages.filter(p => p.status === 'draft').length}
          </p>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search pages by title, slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Status:</span>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
          >
            <option value="all">All Pages</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* 4. PAGES DATA TABLE */}
      <div className="bg-[#0D1B2A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08121E] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Page Title</th>
                <th className="py-3.5 px-4">Live URL Slug</th>
                <th className="py-3.5 px-4">Parent</th>
                <th className="py-3.5 px-4">Last Updated</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredPages.map((p, idx) => (
                <tr key={p.id || idx} className="hover:bg-slate-800/40 transition-colors group">
                  
                  <td className="py-3 px-4 font-bold text-white group-hover:text-[#FFD84A] transition-colors">
                    {p.title}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400">
                    /pages/{p.slug}
                  </td>

                  <td className="py-3 px-4 text-slate-400">
                    {p.parentSlug ? `/pages/${p.parentSlug}` : 'Root Page'}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {p.lastUpdated || '2026-09-02'}
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      {p.status || 'published'}
                    </span>
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <a
                        href={`/pages/${p.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[#FFD84A] transition-colors"
                        title="View Public Page"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => setHistoryModalPage(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors"
                        title="View Revisions"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#1C5496] text-slate-400 hover:text-white transition-colors"
                        title="Edit Page"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(p.id, p.title)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
                        title="Delete Page"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT PAGE ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">
                  Metronic Page Builder
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  {editingPage ? `Edit Page: ${editingPage.title}` : 'Create New Custom Page'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('content')}
                className={`py-2 px-4 border-b-2 transition-colors ${
                  activeTab === 'content' ? 'border-[#FFD84A] text-[#FFD84A]' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Page Content & Layout
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('seo')}
                className={`py-2 px-4 border-b-2 transition-colors ${
                  activeTab === 'seo' ? 'border-[#FFD84A] text-[#FFD84A]' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                2. SEO & OpenGraph Meta
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {activeTab === 'content' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-400 font-bold block">Page Title *</label>
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
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">URL Slug * (/pages/slug)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. campus-sustainability"
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">Parent Page (Hierarchy)</label>
                      <select
                        value={formData.parentSlug}
                        onChange={(e) => setFormData({ ...formData, parentSlug: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                      >
                        <option value="">None (Top-Level Page)</option>
                        <option value="about">About St. Philomena's</option>
                        <option value="academics">Academics</option>
                        <option value="admissions">Admissions</option>
                        <option value="iqac">Quality & IQAC</option>
                      </select>
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-400 font-bold block">Featured Header Banner Image</label>
                      <input
                        type="text"
                        placeholder="/assets/banner-college.jpg"
                        value={formData.featuredImage}
                        onChange={(e) => setFormData({ ...formData, featuredImage: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-400 font-bold block">Excerpt / Brief Summary</label>
                      <textarea
                        rows={2}
                        placeholder="Brief summary of the page for previews and cards..."
                        value={formData.excerpt}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-400 font-bold block">Page Body Content (Markdown / Text) *</label>
                      <textarea
                        rows={7}
                        required
                        placeholder="Write the full content of the page here..."
                        value={formData.content}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none font-sans text-xs leading-relaxed"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">Publication Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === 'seo' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">SEO Meta Title</label>
                    <input
                      type="text"
                      placeholder="Title tag for search engines..."
                      value={formData.seoTitle}
                      onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">SEO Meta Description</label>
                    <textarea
                      rows={3}
                      placeholder="150-160 characters summary for Google/Bing search results..."
                      value={formData.seoDescription}
                      onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-gold px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer"
                >
                  {editingPage ? 'Save Page Changes' : 'Create & Publish Page'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: REVISION HISTORY ================= */}
      {historyModalPage && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-[#FFD84A]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Revision History: {historyModalPage.title}
                </h3>
              </div>
              <button
                onClick={() => setHistoryModalPage(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cmsStore.getRevisions('page', historyModalPage.id).length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  No previous revisions recorded for this page.
                </p>
              ) : (
                cmsStore.getRevisions('page', historyModalPage.id).map((rev, rIdx) => (
                  <div key={rev.id || rIdx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-mono text-slate-300 font-bold block">
                        {new Date(rev.timestamp).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">By {rev.user}</span>
                    </div>

                    <button
                      onClick={() => handleRestoreRevision(rev.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#1C5496] hover:bg-[#0B1F4E] text-white font-bold text-xs inline-flex items-center space-x-1 cursor-pointer"
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
                className="px-4 py-2 rounded-xl bg-slate-800 text-xs font-bold text-slate-300"
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
