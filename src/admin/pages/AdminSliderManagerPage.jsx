import React, { useState } from 'react';
import { 
  Sliders, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  ArrowUp, 
  ArrowDown, 
  ExternalLink, 
  Image as ImageIcon, 
  Layers, 
  X, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';
import api from '../../lib/api';

const PRESET_IMAGES = [
  { label: 'Campus Heritage Palace', url: '/media/heritage/st_philos_heritage_palace.jpg' },
  { label: 'Admin Quadrangle', url: '/assets/images/campus/admin_quadrangle_heritage.jpg' },
  { label: 'Campus Hero Poster', url: '/media/hero/campus-hero-poster.jpg' },
  { label: 'Sports Complex', url: '/media/campus/sports_complex.jpg' },
  { label: 'Indoor Stadium', url: '/assets/images/facilities/indoor_stadium.jpg' }
];

const PRESET_BADGES = [
  'ESTABLISHED 1946 · AUTONOMOUS MYSURU',
  'HERITAGE CAMPUS & INFRASTRUCTURE',
  'ACADEMIC EXCELLENCE & AUTONOMY',
  'INNOVATION, RESEARCH & SEED GRANTS',
  'SPORTS & HOLISTIC STUDENT LIFE',
  'ADMISSIONS 2026–27 OPEN'
];

export default function AdminSliderManagerPage() {
  const slides = useCms(() => cmsStore.getSliders());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const initialForm = {
    id: '',
    category: 'ESTABLISHED 1946 · AUTONOMOUS MYSURU',
    title: '',
    subtitle: "St. Philomena's College (Autonomous), Mysuru",
    description: 'Transformative higher education grounded in heritage, values, and innovation.',
    image: '/media/heritage/st_philos_heritage_palace.jpg',
    ctaText: 'Explore Academics',
    ctaLink: '/academics',
    status: 'published',
    priority: slides.length + 1
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenAdd = () => {
    setEditingSlide(null);
    setFormData({
      ...initialForm,
      priority: slides.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (slide) => {
    setEditingSlide(slide);
    setFormData({
      id: slide.id || '',
      category: slide.category || '',
      title: slide.title || '',
      subtitle: slide.subtitle || '',
      description: slide.description || '',
      image: slide.image || '/media/heritage/st_philos_heritage_palace.jpg',
      ctaText: slide.ctaText || 'Explore Academics',
      ctaLink: slide.ctaLink || '/academics',
      status: slide.status || 'published',
      priority: slide.priority || 1
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Slide headline is required.');
      return;
    }

    try {
      // 1. Save to central CMS Store & localStorage (immediately triggers window event for HeroSlider)
      await cmsStore.saveSlider(formData);

      // 2. Optionally attempt backend sync if logged in
      try {
        await api.post('/admin/sliders', formData);
      } catch (err) {
        // Silently continue if backend is standalone
      }

      setIsModalOpen(false);
      showToast(editingSlide ? 'Slide updated and published live!' : 'New slide published! It is now live on the homepage.');
    } catch (err) {
      alert('Failed to save slide: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDelete = async (id, title) => {
    if (window.confirm(`Are you sure you want to delete slide "${title}"? This will immediately remove it from the homepage.`)) {
      try {
        await cmsStore.deleteSlider(id);
        try {
          await api.delete(`/admin/sliders/${id}`);
        } catch (err) {
          // Continue
        }
        showToast(`Deleted slide "${title}"`);
      } catch (err) {
        alert('Failed to delete slide: ' + err.message);
      }
    }
  };

  const handleMove = async (index, direction) => {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= slides.length) return;

    const list = [...slides];
    const temp = list[index];
    list[index] = list[newIndex];
    list[newIndex] = temp;

    // Update priorities
    for (let i = 0; i < list.length; i++) {
      list[i] = { ...list[i], priority: i + 1 };
      await cmsStore.saveSlider(list[i]);
    }
    showToast('Slide order updated on homepage!');
  };

  const handleToggleStatus = async (slide) => {
    const newStatus = slide.status === 'published' ? 'draft' : 'published';
    const updated = { ...slide, status: newStatus };
    await cmsStore.saveSlider(updated);
    showToast(`Slide status changed to ${newStatus}`);
  };

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* SUCCESS TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-5 py-3.5 rounded-2xl shadow-2xl font-sans text-xs font-bold flex items-center space-x-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-white shrink-0" />
          <span>{toastMessage}</span>
          <a 
            href="/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="underline ml-2 bg-emerald-700 hover:bg-emerald-800 px-2.5 py-1 rounded-lg text-[11px]"
          >
            View Live Homepage →
          </a>
        </div>
      )}

      {/* 1. TOP HEADER & HERO INFO */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#08121E] border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C5496] text-[#FFD84A] font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module · Live Hero Showcase
            </span>
            <span className="text-slate-400 text-xs font-sans">
              {slides.length} Hero Slides Configured
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white tracking-tight">
            Hero Slider & Homepage Showcase
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl leading-relaxed">
            Manage public homepage cinematic photography, headline typography, institutional badges, and interactive call-to-action cards. Changes are published immediately to the live site.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs inline-flex items-center space-x-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Live Site</span>
          </a>

          <button
            onClick={handleOpenAdd}
            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold shadow-lg inline-flex items-center space-x-2 cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add New Slide</span>
          </button>
        </div>
      </div>

      {/* 2. STATS ROW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Slides</span>
          <p className="text-2xl sm:text-3xl font-bold text-white font-mono">{slides.length}</p>
        </div>

        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block">Live on Homepage</span>
          <p className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
            {slides.filter(s => (s.status || 'published') === 'published').length}
          </p>
        </div>

        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">Drafts (Hidden)</span>
          <p className="text-2xl sm:text-3xl font-bold text-[#FFD84A] font-mono">
            {slides.filter(s => s.status === 'draft').length}
          </p>
        </div>

        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-2xl space-y-1">
          <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-wider block">Rotation Cycle</span>
          <p className="text-2xl sm:text-3xl font-bold text-indigo-400 font-mono">7s</p>
        </div>
      </div>

      {/* 3. SLIDES MASTER TABLE */}
      <div className="bg-[#0D1B2A] border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="p-4 bg-[#08121E] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-[#FFD84A]" />
            <h3 className="font-serif font-bold text-sm text-white">Active Homepage Slider Queue</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Order in queue matches rotation sequence
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08121E]/60 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4 w-16 text-center">Order</th>
                <th className="py-3.5 px-4 w-28">Preview</th>
                <th className="py-3.5 px-4 min-w-[200px]">Headline & Subtitle</th>
                <th className="py-3.5 px-4 min-w-[160px]">Category Badge</th>
                <th className="py-3.5 px-4">CTA Button</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right min-w-[160px]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {slides.map((s, idx) => (
                <tr key={s.id || idx} className="hover:bg-slate-800/40 transition-colors group">
                  
                  {/* Order & Reorder Arrows */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center space-x-1 font-mono font-bold text-slate-400">
                      <span>#{idx + 1}</span>
                      <div className="flex flex-col ml-1">
                        <button
                          disabled={idx === 0}
                          onClick={() => handleMove(idx, -1)}
                          className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Up in Queue"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          disabled={idx === slides.length - 1}
                          onClick={() => handleMove(idx, 1)}
                          className="p-0.5 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                          title="Move Down in Queue"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </td>

                  {/* Thumbnail */}
                  <td className="py-3.5 px-4">
                    <div className="w-20 h-12 rounded-lg bg-slate-900 overflow-hidden border border-slate-700 relative shrink-0">
                      <img
                        src={s.image || '/media/heritage/st_philos_heritage_palace.jpg'}
                        alt={s.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = '/media/heritage/st_philos_heritage_palace.jpg';
                        }}
                      />
                    </div>
                  </td>

                  {/* Headline & Subtitle */}
                  <td className="py-3.5 px-4">
                    <div className="space-y-0.5 max-w-md">
                      <span className="font-bold text-white group-hover:text-[#FFD84A] transition-colors block text-sm">
                        {s.title}
                      </span>
                      {s.subtitle && (
                        <p className="text-[11px] text-[#F0D98C] truncate font-serif">
                          {s.subtitle}
                        </p>
                      )}
                      {s.description && (
                        <p className="text-[10px] text-slate-400 line-clamp-1">
                          {s.description}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="py-3.5 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase bg-[#1C5496]/20 text-[#FFD84A] border border-[#1C5496]/40 inline-block">
                      {s.category || 'EXCELLENCE'}
                    </span>
                  </td>

                  {/* CTA */}
                  <td className="py-3.5 px-4 font-mono text-[11px]">
                    <div className="space-y-0.5">
                      <span className="text-white font-bold">{s.ctaText || 'Explore'}</span>
                      <span className="text-slate-500 block truncate max-w-[120px]">{s.ctaLink || '/academics'}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(s)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono uppercase border cursor-pointer transition-colors ${
                        (s.status || 'published') === 'published'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20'
                      }`}
                      title="Click to toggle publish/draft"
                    >
                      {s.status || 'published'}
                    </button>
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <a
                        href="/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[#FFD84A] transition-colors"
                        title="View Live on Homepage"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </a>

                      <button
                        onClick={() => handleOpenEdit(s)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#1C5496] text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Edit Slide"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(s.id, s.title)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Delete Slide"
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

      {/* ================= MODAL: ADD / EDIT SLIDE ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto my-auto text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">
                  Metronic Hero Slider Studio
                </span>
                <h3 className="font-serif font-bold text-2xl text-white">
                  {editingSlide ? `Edit Slide: ${editingSlide.title}` : 'Publish New Hero Slide'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* Category / Badge */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Slide Category / Badge Text *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ESTABLISHED 1946 · AUTONOMOUS MYSURU"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#1C5496]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_BADGES.map(badge => (
                    <button
                      type="button"
                      key={badge}
                      onClick={() => setFormData({ ...formData, category: badge })}
                      className="px-2 py-0.5 rounded-md bg-slate-800 hover:bg-slate-700 text-[10px] font-mono text-slate-300 cursor-pointer"
                    >
                      {badge}
                    </button>
                  ))}
                </div>
              </div>

              {/* Main Headline */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Slide Main Headline *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Legacy of Academic Excellence in Mysuru"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm font-serif font-bold focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              {/* Subtitle / Motto */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Slide Subtitle / Secondary Motto</label>
                <input
                  type="text"
                  placeholder="e.g. St. Philomena's College (Autonomous), Mysuru"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              {/* Description for Frosted Glass Card */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Highlight Card Summary / Description</label>
                <textarea
                  rows={3}
                  placeholder="Brief descriptive highlight shown in the floating glass card on the homepage..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              {/* Background Media URL */}
              <div className="space-y-1.5">
                <label className="text-slate-300 font-bold block">Hero Background Image URL</label>
                <input
                  type="text"
                  placeholder="/media/heritage/st_philos_heritage_palace.jpg"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#1C5496]"
                />
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_IMAGES.map(img => (
                    <button
                      type="button"
                      key={img.url}
                      onClick={() => setFormData({ ...formData, image: img.url })}
                      className={`px-2 py-0.5 rounded-md text-[10px] font-mono cursor-pointer transition-colors ${
                        formData.image === img.url ? 'bg-[#1C5496] text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* CTA Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">CTA Button Label</label>
                  <input
                    type="text"
                    placeholder="e.g. Explore Academics"
                    value={formData.ctaText}
                    onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">CTA Target Link</label>
                  <input
                    type="text"
                    placeholder="e.g. /academics"
                    value={formData.ctaLink}
                    onChange={(e) => setFormData({ ...formData, ctaLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#1C5496]"
                  />
                </div>
              </div>

              {/* Status & Priority Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Publication Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-[#1C5496]"
                  >
                    <option value="published">Published (Live on Homepage)</option>
                    <option value="draft">Draft (Hidden)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-slate-300 font-bold block">Display Priority (1 = First Slide)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value, 10) || 1 })}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white font-mono focus:outline-none focus:border-[#1C5496]"
                  />
                </div>
              </div>

              {/* FOOTER BUTTONS */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-gold px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center space-x-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>{editingSlide ? 'Update & Publish Slide' : 'Publish to Live Homepage'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
