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
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module · Academic Control
            </span>
            <span className="text-slate-500 text-xs">Live Stream & Degree Visibility</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191d28] tracking-tight">
            Programmes & Courses Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Turn ON or OFF departments and individual courses across UG and PG streams. Toggle live website display and home honeycomb visibility instantly.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleOpenAdd}
            className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs inline-flex items-center space-x-2 shrink-0 cursor-pointer transition-all"
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
          <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Courses</span>
            <p className="text-xl sm:text-2xl font-extrabold text-[#191d28] font-mono">{programmes.length}</p>
          </div>
          <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block">UG Stream</span>
            <p className="text-xl sm:text-2xl font-extrabold text-blue-600 font-mono">
              {programmes.filter(p => p.level === 'ug' || p.type === 'ug').length}
            </p>
          </div>
          <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-[10px] font-mono text-purple-600 uppercase tracking-wider block">PG Stream</span>
            <p className="text-xl sm:text-2xl font-extrabold text-purple-600 font-mono">
              {programmes.filter(p => p.level === 'pg' || p.type === 'pg').length}
            </p>
          </div>
          <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">Live (ON)</span>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono">
              {programmes.filter(p => (p.status || 'published') === 'published').length}
            </p>
          </div>
        </div>

        {/* Stream Master Controls */}
        <div className="lg:col-span-6 bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="space-y-0.5 text-left w-full sm:w-auto">
            <span className="text-[10px] font-mono text-slate-700 uppercase font-bold tracking-wider block">
              Stream Master Controls
            </span>
            <p className="text-xs text-slate-500 font-medium">Quick bulk visibility toggle for entire streams</p>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto justify-start sm:justify-end">
            <div className="flex items-center space-x-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs text-[11px]">
              <span className="text-blue-600 font-bold px-1.5">UG:</span>
              <button
                onClick={() => handleBulkSetStatus('ug', 'published')}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                title="Turn all UG programmes ON"
              >
                All ON
              </button>
              <button
                onClick={() => handleBulkSetStatus('ug', 'draft')}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                title="Turn all UG programmes OFF"
              >
                All OFF
              </button>
            </div>

            <div className="flex items-center space-x-1 bg-white p-1.5 rounded-xl border border-slate-200 shadow-xs text-[11px]">
              <span className="text-purple-600 font-bold px-1.5">PG:</span>
              <button
                onClick={() => handleBulkSetStatus('pg', 'published')}
                className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                title="Turn all PG programmes ON"
              >
                All ON
              </button>
              <button
                onClick={() => handleBulkSetStatus('pg', 'draft')}
                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                title="Turn all PG programmes OFF"
              >
                All OFF
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search programmes by title, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="font-semibold">Stream / Filter:</span>
          <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setSelectedLevelFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedLevelFilter === 'all' ? 'bg-[#18191f] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedLevelFilter('ug')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedLevelFilter === 'ug' ? 'bg-[#18191f] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Undergraduate (UG)
            </button>
            <button
              onClick={() => setSelectedLevelFilter('pg')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedLevelFilter === 'pg' ? 'bg-[#18191f] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Postgraduate (PG)
            </button>
          </div>
        </div>
      </div>

      {/* 4. PROGRAMMES DATA TABLE WITH LIVE ON/OFF TOGGLES */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200/80">
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
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredProgs.map((p, idx) => {
                const isLive = (p.status || 'published') === 'published';
                const isHoneycomb = p.isFeaturedHoneycomb !== false;

                return (
                  <tr key={p.id || idx} className={`hover:bg-slate-50/70 transition-colors group ${!isLive ? 'opacity-60 bg-slate-50/50' : ''}`}>
                    
                    <td className="py-3.5 px-4 font-mono font-bold text-amber-600">
                      {p.code}
                    </td>

                    <td className="py-3.5 px-4 font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                      <div>{p.name || p.title}</div>
                      <div className="text-[10px] font-normal text-slate-500">{p.duration || '3 Years / 4 Years NEP'}</div>
                    </td>

                    <td className="py-3.5 px-4 uppercase font-mono text-[11px]">
                      <span className={`px-2.5 py-1 rounded-full font-bold ${
                        p.level === 'pg' || p.type === 'pg' ? 'bg-purple-50 text-purple-700 border border-purple-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {(p.level || p.type || 'UG').toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-500">
                      {p.departmentName || p.departmentId || 'Academic Department'}
                    </td>

                    {/* Honeycomb Showcase Switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleHoneycomb(p.id)}
                        className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer ${
                          isHoneycomb
                            ? 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100'
                            : 'bg-slate-100 text-slate-400 border border-slate-200 hover:text-slate-600'
                        }`}
                        title="Toggle Home Honeycomb Hexagon"
                      >
                        <Layers className="w-3 h-3" />
                        <span>{isHoneycomb ? 'HEX ON' : 'HEX OFF'}</span>
                      </button>
                    </td>

                    {/* Main Active Status Switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(p.id)}
                        className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono transition-all cursor-pointer ${
                          isLive
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                        }`}
                        title={`Click to turn ${isLive ? 'OFF (Hide)' : 'ON (Publish)'}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
                        <span>{isLive ? 'LIVE (ON)' : 'OFF (Draft)'}</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <a
                          href={`/academics/${(p.code || p.id).toLowerCase()}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-colors"
                          title="View Public Programme Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </a>

                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                          title="Edit Programme Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleDelete(p.id, p.name || p.title)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block font-bold">
                  Metronic Programme Management
                </span>
                <h3 className="font-extrabold text-xl text-[#191d28]">
                  {editingProg ? `Edit Programme: ${editingProg.code}` : 'Add New Degree Programme'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Programme Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Bachelor of Computer Applications (BCA)"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Programme Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. BCA / MBA / B.COM"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Degree Level *</label>
                  <select
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  >
                    <option value="ug">Undergraduate (UG)</option>
                    <option value="pg">Postgraduate (PG)</option>
                    <option value="phd">Doctorate (Ph.D)</option>
                    <option value="certificate">Certificate / Diploma</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Assigned Academic Department *</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Duration</label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Years (6 Semesters)"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Syllabus PDF Path (DearFlip Compatible)</label>
                  <input
                    type="text"
                    placeholder="/documents/academics/Syllabus.pdf"
                    value={formData.syllabusPdf}
                    onChange={(e) => setFormData({ ...formData, syllabusPdf: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Eligibility Criteria</label>
                  <textarea
                    rows={2}
                    placeholder="e.g. Candidates must have passed 10+2 / Pre-University examination..."
                    value={formData.eligibility}
                    onChange={(e) => setFormData({ ...formData, eligibility: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Career & Academic Outcomes (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="Software Developer&#10;Systems Analyst&#10;Cloud Solutions Architect"
                    value={formData.careerOutcomes}
                    onChange={(e) => setFormData({ ...formData, careerOutcomes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 font-mono text-[11px]"
                  />
                </div>

              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
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
