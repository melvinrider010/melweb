import React, { useState } from 'react';
import { 
  FileText, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  Pin, 
  CheckCircle2, 
  X, 
  Calendar, 
  Paperclip, 
  Download,
  AlertCircle,
  Clock
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';
import ViewAsBookButton from '../../components/common/ViewAsBookButton';
import FileUploadZone from '../../components/common/FileUploadZone';

export default function AdminNoticesManagerPage() {
  const notices = useCms(() => cmsStore.getNotices());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNotice, setEditingNotice] = useState(null);

  const initialForm = {
    id: '',
    title: '',
    category: 'Examination',
    content: '',
    attachmentUrl: '',
    attachmentFileName: '',
    isPinned: false,
    publishDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'published'
  };

  const [formData, setFormData] = useState(initialForm);

  const categories = ['Examination', 'Admissions', 'IQAC', 'Academic', 'General', 'Events'];

  const filteredNotices = notices.filter(n => {
    const matchesSearch = (n.title || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategoryFilter === 'all' || (n.category || '').toLowerCase() === selectedCategoryFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const handleOpenAdd = () => {
    setEditingNotice(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (n) => {
    setEditingNotice(n);
    setFormData({
      id: n.id || '',
      title: n.title || '',
      category: n.category || 'General',
      content: n.content || n.description || '',
      attachmentUrl: n.attachmentUrl || n.pdf || n.url || '',
      isPinned: !!n.isPinned,
      publishDate: n.publishDate || n.date || new Date().toISOString().split('T')[0],
      expiryDate: n.expiryDate || '',
      status: n.status || 'published'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await cmsStore.saveNotice(formData);
    setIsModalOpen(false);
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete notice "${title}"?`)) {
      await cmsStore.deleteNotice(id);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module 22.6
            </span>
            <span className="text-slate-500 text-xs">Institutional Notice Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191d28] tracking-tight">
            Notices & Announcements Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium leading-relaxed max-w-2xl">
            Publish examination circulars, pin urgent notices to the home banner, attach PDF circulars with 3D Flipbook compatibility.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs inline-flex items-center space-x-2 shrink-0 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Create Notice</span>
        </button>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Notices</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">{notices.length}</p>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider block">Pinned Important</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">{notices.filter(n => n.isPinned).length}</p>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">Published Live</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">{notices.filter(n => (n.status || 'published') === 'published').length}</p>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-indigo-600 uppercase tracking-wider block">Categories</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-indigo-600 font-mono">{categories.length}</p>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search notices by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="font-semibold">Category:</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:bg-white cursor-pointer capitalize"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. NOTICES TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200/80">
              <tr>
                <th className="py-3.5 px-4">Notice Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Attachment</th>
                <th className="py-3.5 px-4">Publish Date</th>
                <th className="py-3.5 px-4">Pinned</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredNotices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 font-sans text-sm">
                    No notices found matching current filter.
                  </td>
                </tr>
              ) : (
                filteredNotices.map((n, idx) => (
                  <tr key={n.id || idx} className="hover:bg-slate-50/70 transition-colors group">
                    
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2">
                        {n.isPinned && <Pin className="w-3.5 h-3.5 text-amber-500 shrink-0 fill-amber-500/20" />}
                        <span className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                          {n.title}
                        </span>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-full font-mono text-[10px] font-bold uppercase bg-slate-100 border border-slate-200 text-slate-700">
                        {n.category || 'General'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {n.attachmentUrl || n.pdf ? (
                        <div className="flex items-center space-x-1.5">
                          <ViewAsBookButton
                            pdfUrl={n.attachmentUrl || n.pdf}
                            title={n.title}
                            label="View"
                            size="xs"
                            variant="primary"
                          />
                        </div>
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500 text-[11px]">
                      {n.publishDate || n.date || '2026-09-02'}
                    </td>

                    <td className="py-3.5 px-4">
                      {n.isPinned ? (
                        <span className="bg-amber-50 text-amber-700 border border-amber-200 font-bold font-mono text-[10px] px-2 py-0.5 rounded-full">PINNED</span>
                      ) : (
                        <span className="text-slate-400 font-mono text-[10px]">Standard</span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => handleOpenEdit(n)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Edit Notice"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(n.id, n.title)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                          title="Delete Notice"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT NOTICE ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-xl text-[#191d28]">
                {editingNotice ? 'Edit Notice / Circular' : 'Create New Notice'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-700 font-bold block">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Examination Time Table — November 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Publish Date</label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>
              </div>

              <div>
                <FileUploadZone
                  label="Notice Document / PDF Circular Attachment"
                  subLabel="Drag & drop official PDF circular here, or click to browse (up to 25MB)"
                  accept=".pdf,application/pdf"
                  type="pdf"
                  value={formData.attachmentUrl}
                  fileName={formData.attachmentFileName || (formData.attachmentUrl?.startsWith('data:') ? `${formData.title || 'Notice'}.pdf` : formData.attachmentUrl?.split('/').pop())}
                  onChange={({ dataUrl, fileName }) => {
                    setFormData(prev => ({
                      ...prev,
                      attachmentUrl: dataUrl,
                      attachmentFileName: fileName
                    }));
                  }}
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold block">Notice Synopsis / Content</label>
                <textarea
                  rows={3}
                  placeholder="Detailed instructions or notice text..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                />
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="isPinned" className="text-slate-700 font-semibold cursor-pointer">
                  Pin this notice to the top ticker & homepage banner
                </label>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="bg-[#18191f] hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold shadow-xs cursor-pointer transition-all"
                >
                  {editingNotice ? 'Save Notice' : 'Publish Notice'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
