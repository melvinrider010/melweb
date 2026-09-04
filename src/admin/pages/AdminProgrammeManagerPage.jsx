import React, { useState } from 'react';
import { 
  GraduationCap, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  History, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Building2, 
  FileText, 
  Layers, 
  Clock, 
  ExternalLink,
  BookOpen
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';

export default function AdminProgrammeManagerPage() {
  const programmes = useCms(() => cmsStore.getProgrammes());
  const departments = useCms(() => cmsStore.getDepartments());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevelFilter, setSelectedLevelFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProg, setEditingProg] = useState(null);
  const [historyModalProg, setHistoryModalProg] = useState(null);

  const initialForm = {
    id: '',
    code: '',
    name: '',
    title: '',
    level: 'ug',
    departmentId: departments[0]?.id || 'dept-bca',
    duration: '3 Years (6 Semesters) / 4 Years NEP Honours',
    eligibility: '10+2 / Pre-University Equivalent in relevant stream',
    description: '',
    curriculumOverview: '',
    syllabusPdf: '/documents/academics/Syllabus-NEP.pdf',
    careerOutcomes: '',
    status: 'published',
    order: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredProgs = programmes.filter(p => {
    const matchesSearch = (
      (p.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (p.code || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesLevel = selectedLevelFilter === 'all' || p.level === selectedLevelFilter || p.type === selectedLevelFilter;
    return matchesSearch && matchesLevel;
  });

  const handleOpenAdd = () => {
    setEditingProg(null);
    setFormData(initialForm);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProg(p);
    setFormData({
      id: p.id || '',
      code: p.code || '',
      name: p.name || p.title || '',
      title: p.title || p.name || '',
      level: p.level || p.type || 'ug',
      departmentId: p.departmentId || departments[0]?.id || '',
      duration: p.duration || '3 Years / 4 Years NEP',
      eligibility: p.eligibility || '',
      description: p.description || '',
      curriculumOverview: p.curriculumOverview || '',
      syllabusPdf: p.syllabusPdf || '/documents/academics/Syllabus-NEP.pdf',
      careerOutcomes: Array.isArray(p.careerOutcomes) ? p.careerOutcomes.join('\n') : (p.careerOutcomes || ''),
      status: p.status || 'published',
      order: p.order || 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      title: formData.name,
      careerOutcomes: formData.careerOutcomes ? formData.careerOutcomes.split('\n').map(s => s.trim()).filter(Boolean) : []
    };

    await cmsStore.saveProgramme(payload);
    setIsModalOpen(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete / archive programme "${name}"?`)) {
      await cmsStore.deleteProgramme(id);
    }
  };

  const handleToggleStatus = async (progId) => {
    await cmsStore.toggleProgrammeStatus(progId);
  };

  const handleToggleHoneycomb = async (progId) => {
    await cmsStore.toggleProgrammeHoneycomb(progId);
  };

  const handleBulkSetStatus = async (stream, status) => {
    await cmsStore.bulkSetProgrammesStatus(stream, status);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08121E] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C5496] text-[#FFD84A] font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module · Academic Control
            </span>
            <span className="text-slate-400 text-xs">Live Stream & Degree Visibility</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Programmes & Courses Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Turn ON or OFF departments and individual courses across UG and PG streams. Toggle live website display and home honeycomb visibility instantly.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenAdd}
            className="btn-gold px-5 py-3 rounded-xl text-xs font-bold shadow-lg inline-flex items-center space-x-2 shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Programme</span>
          </button>
        </div>
      </div>

      {/* 2. STATS & QUICK BULK STREAM SWITCHES */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Stats Summary */}
        <div className="lg:col-span-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0D1B2A] border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Total Courses</span>
            <p className="text-xl font-bold text-white">{programmes.length}</p>
          </div>
          <div className="bg-[#0D1B2A] border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-blue-400 uppercase">UG Stream</span>
            <p className="text-xl font-bold text-blue-400">
              {programmes.filter(p => p.level === 'ug' || p.type === 'ug').length}
            </p>
          </div>
          <div className="bg-[#0D1B2A] border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-purple-400 uppercase">PG Stream</span>
            <p className="text-xl font-bold text-purple-400">
              {programmes.filter(p => p.level === 'pg' || p.type === 'pg').length}
            </p>
          </div>
          <div className="bg-[#0D1B2A] border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase">Live (ON)</span>
            <p className="text-xl font-bold text-emerald-400">
              {programmes.filter(p => (p.status || 'published') === 'published').length}
            </p>
          </div>
        </div>

        {/* Stream Master Controls */}
        <div className="lg:col-span-6 bg-[#0D1B2A] border border-slate-800 p-3.5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5 text-left w-full sm:w-auto">
            <span className="text-[10px] font-mono text-[#FFD84A] uppercase font-bold tracking-wider block">
              Stream Master Controls
            </span>
            <p className="text-xs text-slate-300">Quick bulk visibility toggle for entire streams</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-700 text-[11px]">
              <span className="text-blue-400 font-bold px-1.5">UG:</span>
              <button
                onClick={() => handleBulkSetStatus('ug', 'published')}
                className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                title="Turn all UG programmes ON"
              >
                All ON
              </button>
              <button
                onClick={() => handleBulkSetStatus('ug', 'draft')}
                className="px-2 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                title="Turn all UG programmes OFF"
              >
                All OFF
              </button>
            </div>

            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-700 text-[11px]">
              <span className="text-purple-400 font-bold px-1.5">PG:</span>
              <button
                onClick={() => handleBulkSetStatus('pg', 'published')}
                className="px-2 py-1 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                title="Turn all PG programmes ON"
              >
                All ON
              </button>
              <button
                onClick={() => handleBulkSetStatus('pg', 'draft')}
                className="px-2 py-1 bg-rose-600/80 hover:bg-rose-600 text-white rounded text-[10px] font-bold transition-colors cursor-pointer"
                title="Turn all PG programmes OFF"
              >
                All OFF
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search programmes by title, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Stream / Filter:</span>
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setSelectedLevelFilter('all')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedLevelFilter === 'all' ? 'bg-[#1C5496] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedLevelFilter('ug')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedLevelFilter === 'ug' ? 'bg-blue-600 text-white font-bold' : 'text-slate-400 hover:text-blue-300'
              }`}
            >
              Undergraduate (UG)
            </button>
            <button
              onClick={() => setSelectedLevelFilter('pg')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedLevelFilter === 'pg' ? 'bg-purple-600 text-white font-bold' : 'text-slate-400 hover:text-purple-300'
              }`}
            >
              Postgraduate (PG)
            </button>
          </div>
        </div>
      </div>

      {/* 4. PROGRAMMES DATA TABLE WITH LIVE ON/OFF TOGGLES */}
      <div className="bg-[#0D1B2A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08121E] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Code</th>
                <th className="py-3.5 px-4">Programme Title</th>
                <th className="py-3.5 px-4">Stream</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4 text-center">Honeycomb Grid</th>
                <th className="py-3.5 px-4 text-center">Status (ON / OFF)</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredProgs.map((p, idx) => {
                const isLive = (p.status || 'published') === 'published';
                const isHoneycomb = p.isFeaturedHoneycomb !== false;

                return (
                  <tr key={p.id || idx} className={`hover:bg-slate-800/40 transition-colors group ${!isLive ? 'opacity-60 bg-slate-950/40' : ''}`}>
                    
                    <td className="py-3 px-4 font-mono font-bold text-amber-400">
                      {p.code}
                    </td>

                    <td className="py-3 px-4 font-bold text-white group-hover:text-[#FFD84A] transition-colors">
                      <div>{p.name || p.title}</div>
                      <div className="text-[10px] font-normal text-slate-400">{p.duration || '3 Years / 4 Years NEP'}</div>
                    </td>

                    <td className="py-3 px-4 uppercase font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${
                        p.level === 'pg' || p.type === 'pg' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                      }`}>
                        {(p.level || p.type || 'UG').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-slate-400">
                      {p.departmentName || p.departmentId || 'Academic Department'}
                    </td>

                    {/* Honeycomb Showcase Switch */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleHoneycomb(p.id)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer ${
                          isHoneycomb
                            ? 'bg-[#1C5496]/40 text-[#FFD84A] border border-[#1C5496] hover:bg-[#1C5496]/60'
                            : 'bg-slate-800 text-slate-500 border border-slate-700 hover:text-slate-300'
                        }`}
                        title="Toggle Home Honeycomb Hexagon"
                      >
                        <Layers className="w-3 h-3" />
                        <span>{isHoneycomb ? 'HEX ON' : 'HEX OFF'}</span>
                      </button>
                    </td>

                    {/* Main Active Status Switch */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(p.id)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono transition-all cursor-pointer ${
                          isLive
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                        }`}
                        title={`Click to turn ${isLive ? 'OFF (Hide)' : 'ON (Publish)'}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                        <span>{isLive ? 'LIVE (ON)' : 'OFF (Draft)'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <a
                          href={`/academics/${(p.code || p.id).toLowerCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-[#FFD84A] transition-colors"
                          title="View Public Programme Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#1C5496] text-slate-400 hover:text-white transition-colors"
                          title="Edit Programme Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id, p.name || p.title)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
                          title="Delete Programme"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT PROGRAMME ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">
                  Metronic Programme Management
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  {editingProg ? `Edit Programme: ${editingProg.code}` : 'Add New Degree Programme'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold block">Programme Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bachelor of Computer Applications (BCA)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#1C5496]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Programme Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BCA / MBA / B.COM"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Degree Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  >
                    <option value="ug">Undergraduate (UG)</option>
                    <option value="pg">Postgraduate (PG)</option>
                    <option value="phd">Doctorate (Ph.D)</option>
                    <option value="certificate">Certificate / Diploma</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold block">Assigned Academic Department *</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Years (6 Semesters)"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Syllabus PDF Path (DearFlip Compatible)</label>
                  <input
                    type="text"
                    placeholder="/documents/academics/Syllabus.pdf"
                    value={formData.syllabusPdf}
                    onChange={(e) => setFormData({ ...formData, syllabusPdf: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold block">Eligibility Criteria</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Candidates must have passed 10+2 / Pre-University examination..."
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold block">Career & Academic Outcomes (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Software Developer&#10;Systems Analyst&#10;Cloud Solutions Architect"
                    value={formData.careerOutcomes}
                    onChange={(e) => setFormData({ ...formData, careerOutcomes: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none font-mono text-[11px]"
                  />
                </div>

              </div>

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
                  {editingProg ? 'Save Programme Changes' : 'Create Degree Programme'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
