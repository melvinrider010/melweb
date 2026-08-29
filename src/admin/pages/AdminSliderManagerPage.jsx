import React, { useState } from 'react';
import sliderData from '../../data/sliders.json';
import { Sliders, Plus, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';

export default function AdminSliderManagerPage() {
  const [slides, setSlides] = useState(sliderData);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title) return;
    const newSlide = {
      id: `sld_${Date.now()}`,
      category: category || "HERITAGE & EXCELLENCE",
      title: title,
      subtitle: "St. Philomena's College (Autonomous)",
      description: "Transformative higher education in Mysuru.",
      image: "/assets/images/hero_campus_main.jpg",
      ctaText: "Explore Academics",
      ctaLink: "/academics",
      status: "published",
      priority: slides.length + 1
    };
    setSlides([...slides, newSlide]);
    setTitle('');
    setCategory('');
  };

  const handleDelete = (id) => {
    setSlides(slides.filter(s => s.id !== id));
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="font-serif font-bold text-2xl text-slate-900">Hero Slider Manager</h1>
          <p className="text-xs text-slate-500">Manage public homepage cinematic hero photography & captions.</p>
        </div>
      </div>

      {/* Add Slider Form */}
      <form onSubmit={handleAdd} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="font-bold text-sm text-slate-900 border-b pb-2">Add New Hero Slide</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Slide Category / Badge</label>
            <input
              type="text"
              placeholder="e.g. ESTABLISHED 1946"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:border-[#1C5496]"
            />
          </div>
          <div>
            <label className="block text-slate-600 font-semibold mb-1">Slide Main Headline</label>
            <input
              type="text"
              placeholder="e.g. Legacy of Academic Excellence"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2.5 bg-slate-50 border rounded-lg focus:outline-none focus:border-[#1C5496]"
            />
          </div>
        </div>
        <button type="submit" className="btn-gold px-5 py-2 rounded-lg text-xs font-bold inline-flex items-center">
          <Plus className="w-4 h-4 mr-1" />
          <span>Publish Slide</span>
        </button>
      </form>

      {/* Slider Table */}
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider">
              <th className="p-4">Priority</th>
              <th className="p-4">Category</th>
              <th className="p-4">Title</th>
              <th className="p-4">Status</th>
              <th className="p-4">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {slides.map((s, idx) => (
              <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                <td className="p-4 font-mono font-bold text-slate-500">#{idx + 1}</td>
                <td className="p-4"><span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded text-[10px]">{s.category}</span></td>
                <td className="p-4 font-bold text-slate-900">{s.title}</td>
                <td className="p-4">
                  <span className="inline-flex items-center font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[10px]">
                    <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-600" />
                    Published
                  </span>
                </td>
                <td className="p-4">
                  <button onClick={() => handleDelete(s.id)} className="text-rose-600 hover:text-rose-800 font-bold">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
