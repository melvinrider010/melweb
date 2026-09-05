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
    attachmentUrl: '/documents/academics/TimeTable.pdf',
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
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08121E] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C5496] text-[#FFD84A] font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module 22.6
            </span>
            <span className="text-slate-400 text-xs">Institutional Notice Board</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Notices & Announcements Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Publish examination circulars, pin urgent notices to the home banner, attach PDF circulars with 3D Flipbook compatibility.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-5 py-3 rounded-xl text-xs font-bold shadow-lg inline-flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Create Notice</span>
        </button>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Notices</span>
          <p className="text-2xl font-bold text-white">{notices.length}</p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-amber-400 uppercase">Pinned Important</span>
          <p className="text-2xl font-bold text-amber-400">{notices.filter(n => n.isPinned).length}</p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-emerald-400 uppercase">Published Live</span>
          <p className="text-2xl font-bold text-emerald-400">{notices.filter(n => (n.status || 'published') === 'published').length}</p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-blue-400 uppercase">Categories</span>
          <p className="text-2xl font-bold text-blue-400">{categories.length}</p>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH */}
      <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search notices by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Category:</span>
          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none capitalize"
          >
            <option value="all">All Categories</option>
            {categories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* 4. NOTICES TABLE */}
      <div className="bg-[#0D1B2A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08121E] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Notice Title</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4">Attachment</th>
                <th className="py-3.5 px-4">Publish Date</th>
                <th className="py-3.5 px-4">Pinned</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredNotices.map((n, idx) => (
                <tr key={n.id || idx} className="hover:bg-slate-800/40 transition-colors group">
                  
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-2">
                      {n.isPinned && <Pin className="w-3.5 h-3.5 text-amber-400 shrink-0 fill-amber-400/20" />}
                      <span className="font-bold text-white group-hover:text-[#FFD84A] transition-colors">
                        {n.title}
                      </span>
                    </div>
                  </td>

                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase bg-slate-800 border border-slate-700 text-slate-300">
                      {n.category || 'General'}
                    </span>
                  </td>

                  <td className="py-3 px-4">
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
                      <span className="text-slate-500">—</span>
                    )}
                  </td>

                  <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                    {n.publishDate || n.date || '2026-09-02'}
                  </td>

                  <td className="py-3 px-4">
                    {n.isPinned ? (
                      <span className="text-amber-400 font-bold font-mono text-[10px]">PINNED</span>
                    ) : (
                      <span className="text-slate-500 font-mono text-[10px]">Standard</span>
                    )}
                  </td>

                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(n)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#1C5496] text-slate-400 hover:text-white transition-colors"
                        title="Edit Notice"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(n.id, n.title)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
                        title="Delete Notice"
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

      {/* ================= MODAL: ADD / EDIT NOTICE ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-lg text-white">
                {editingNotice ? 'Edit Notice / Circular' : 'Create New Notice'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-400 font-bold block">Notice Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Examination Time Table — November 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  >
                    {categories.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Publish Date</label>
                  <input
                    type="date"
                    value={formData.publishDate}
                    onChange={(e) => setFormData({ ...formData, publishDate: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
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
                <label className="text-slate-400 font-bold block">Notice Synopsis / Content</label>
                <textarea
                  rows={3}
                  placeholder="Detailed instructions or notice text..."
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="flex items-center space-x-3 p-3 bg-slate-900 rounded-xl border border-slate-800">
                <input
                  type="checkbox"
                  id="isPinned"
                  checked={formData.isPinned}
                  onChange={(e) => setFormData({ ...formData, isPinned: e.target.checked })}
                  className="w-4 h-4 rounded text-amber-500 accent-amber-500 cursor-pointer"
                />
                <label htmlFor="isPinned" className="text-slate-200 font-semibold cursor-pointer">
                  Pin this notice to the top ticker & homepage banner
                </label>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
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
