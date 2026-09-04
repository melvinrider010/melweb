import React, { useState } from 'react';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  History, 
  RotateCcw, 
  CheckCircle2, 
  X, 
  Users, 
  GraduationCap, 
  FileText, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';

export default function AdminDepartmentManagerPage() {
  const departments = useCms(() => cmsStore.getDepartments());
  const faculty = useCms(() => cmsStore.getFaculty());
  const programmes = useCms(() => cmsStore.getProgrammes());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDept, setEditingDept] = useState(null);
  const [historyModalDept, setHistoryModalDept] = useState(null);
  const [activeTab, setActiveTab] = useState('general'); // 'general' | 'vision' | 'assignments'

  const initialForm = {
    id: '',
    name: '',
    code: '',
    slug: '',
    hodName: '',
    facultyName: 'Faculty of Science & Computer Applications',
    description: '',
    vision: '',
    mission: '',
    email: '',
    phone: '',
    office: '',
    image: '/assets/departments/default-dept.jpg',
    ugProgrammes: [],
    pgProgrammes: [],
    status: 'published',
    order: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const filteredDepts = departments.filter(d => {
    const matchesSearch = (
      (d.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.code || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.facultyName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = selectedStatusFilter === 'all' || (d.status || 'published') === selectedStatusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingDept(null);
    setFormData(initialForm);
    setActiveTab('general');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (d) => {
    setEditingDept(d);
    setFormData({
      id: d.id || '',
      name: d.name || '',
      code: d.code || '',
      slug: d.slug || '',
      hodName: d.hodName || '',
      facultyName: d.facultyName || 'Faculty of Science & Computer Applications',
      description: d.description || d.about || '',
      vision: d.vision || '',
      mission: d.mission || '',
      email: d.email || '',
      phone: d.phone || '',
      office: d.office || '',
      image: d.image || '/assets/departments/default-dept.jpg',
      ugProgrammes: Array.isArray(d.ugProgrammes) ? d.ugProgrammes : [],
      pgProgrammes: Array.isArray(d.pgProgrammes) ? d.pgProgrammes : [],
      status: d.status || 'published',
      order: d.order || 0
    });
    setActiveTab('general');
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await cmsStore.saveDepartment(formData);
    setIsModalOpen(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete / archive department "${name}"?`)) {
      await cmsStore.deleteDepartment(id);
    }
  };

  const handleToggleStatus = async (deptId) => {
    await cmsStore.toggleDepartmentStatus(deptId);
  };

  const handleBulkSetStatus = async (status) => {
    await cmsStore.bulkSetDepartmentsStatus(status);
  };

  const handleRestoreRevision = async (revId) => {
    if (historyModalDept && revId) {
      await cmsStore.restoreRevision('department', historyModalDept.id, revId);
      setHistoryModalDept(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08121E] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C5496] text-[#FFD84A] font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module · Academic Departments
            </span>
            <span className="text-slate-400 text-xs">Dynamic Institutional Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Academic Departments Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Turn ON or OFF academic departments, assign faculty rosters, link degree programmes, and control public visibility instantly.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-5 py-3 rounded-xl text-xs font-bold shadow-lg inline-flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Department</span>
        </button>
      </div>

      {/* 2. STATS & QUICK BULK MASTER CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Stats */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#0D1B2A] border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-slate-400 uppercase">Departments</span>
            <p className="text-xl font-bold text-white">{departments.length}</p>
          </div>
          <div className="bg-[#0D1B2A] border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-emerald-400 uppercase">Live (ON)</span>
            <p className="text-xl font-bold text-emerald-400">
              {departments.filter(d => (d.status || 'published') === 'published').length}
            </p>
          </div>
          <div className="bg-[#0D1B2A] border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-blue-400 uppercase">Faculty</span>
            <p className="text-xl font-bold text-blue-400">{faculty.length}</p>
          </div>
          <div className="bg-[#0D1B2A] border border-slate-800 p-3.5 rounded-xl space-y-1">
            <span className="text-[10px] font-mono text-amber-400 uppercase">Programmes</span>
            <p className="text-xl font-bold text-amber-400">{programmes.length}</p>
          </div>
        </div>

        {/* Bulk Controls */}
        <div className="lg:col-span-5 bg-[#0D1B2A] border border-slate-800 p-3.5 rounded-xl flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-[#FFD84A] uppercase font-bold tracking-wider block">
              Department Master Switch
            </span>
            <p className="text-xs text-slate-400">Bulk visibility control</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkSetStatus('published')}
              className="px-3 py-1.5 bg-emerald-600/80 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Turn All ON
            </button>
            <button
              onClick={() => handleBulkSetStatus('draft')}
              className="px-3 py-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Turn All OFF
            </button>
          </div>
        </div>

      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search departments by name, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1C5496]"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 text-xs text-slate-400">
          <span>Status:</span>
          <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedStatusFilter === 'all' ? 'bg-[#1C5496] text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatusFilter('published')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedStatusFilter === 'published' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400 hover:text-emerald-300'
              }`}
            >
              Live (ON)
            </button>
            <button
              onClick={() => setSelectedStatusFilter('draft')}
              className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                selectedStatusFilter === 'draft' ? 'bg-rose-600 text-white font-bold' : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              Draft (OFF)
            </button>
          </div>
        </div>

      </div>

      {/* 4. DEPARTMENTS GRID WITH LIVE ON/OFF TOGGLES */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDepts.map((dept, idx) => {
          const deptFacultyCount = faculty.filter(f => f.departmentId === dept.id || f.departmentId === dept.deptId).length;
          const isLive = (dept.status || 'published') === 'published';
          
          return (
            <div
              key={dept.id || idx}
              className={`bg-[#0D1B2A] border rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between shadow-md group ${
                isLive ? 'border-slate-800 hover:border-slate-700' : 'border-slate-800/40 opacity-60 bg-slate-950/40'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-[#1C5496]/20 text-[#FFD84A] border border-[#1C5496]/40">
                    {dept.code || dept.id}
                  </span>

                  {/* Live ON / OFF Switch */}
                  <button
                    onClick={() => handleToggleStatus(dept.id)}
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer ${
                      isLive
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border border-rose-500/40 hover:bg-rose-500/30'
                    }`}
                    title={`Click to turn ${isLive ? 'OFF (Draft)' : 'ON (Live)'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
                    <span>{isLive ? 'LIVE (ON)' : 'OFF (Draft)'}</span>
                  </button>
                </div>

                <h3 className="font-serif font-bold text-base text-white group-hover:text-[#FFD84A] transition-colors line-clamp-2">
                  {dept.name}
                </h3>

                <p className="text-xs text-slate-400 line-clamp-2 font-sans">
                  {dept.description || dept.about || 'Academic department offering specialized undergraduate and postgraduate curricula.'}
                </p>

                {/* Relationships Meta Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-800/80 text-[11px] font-mono text-slate-400">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-[#FFD84A]" />
                    <span>{deptFacultyCount} Faculty</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-400" />
                    <span>{(dept.ugProgrammes?.length || 0) + (dept.pgProgrammes?.length || 0)} Programmes</span>
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <a
                  href={`/departments/${dept.slug || dept.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#FFD84A] hover:underline font-bold inline-flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Live</span>
                </a>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setHistoryModalDept(dept)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors cursor-pointer"
                    title="View Revisions"
                  >
                    <History className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(dept)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#1C5496] text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Edit Department"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(dept.id, dept.name)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors cursor-pointer"
                    title="Delete Department"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= MODAL: ADD / EDIT DEPARTMENT ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">
                  Metronic Department Management
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  {editingDept ? `Edit Department: ${editingDept.name}` : 'Create New Academic Department'}
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
                
                {/* Department Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold block">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Department of Computer Science"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#1C5496]"
                  />
                </div>

                {/* Code & Slug */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Department Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS / COMMERCE"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. computer-science"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                {/* Faculty Group */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold block">Faculty Division</label>
                  <select
                    value={formData.facultyName}
                    onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  >
                    <option value="Faculty of Science & Computer Applications">Faculty of Science & Computer Applications</option>
                    <option value="Faculty of Commerce">Faculty of Commerce</option>
                    <option value="Faculty of Management Studies">Faculty of Management Studies</option>
                    <option value="Faculty of Humanities & Languages">Faculty of Humanities & Languages</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold block">Department Overview / About</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive description of the department..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                {/* Vision */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold block">Department Vision</label>
                  <textarea
                    rows={2}
                    placeholder="Vision statement..."
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                {/* Mission */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-400 font-bold block">Department Mission</label>
                  <textarea
                    rows={2}
                    placeholder="Mission statement..."
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                {/* Contact Email & Phone */}
                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Official Email</label>
                  <input
                    type="email"
                    placeholder="dept@stphilos.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-400 font-bold block">Status</label>
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
                  {editingDept ? 'Save Changes' : 'Create Department'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: REVISION HISTORY ================= */}
      {historyModalDept && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-[#FFD84A]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Revision History: {historyModalDept.name}
                </h3>
              </div>
              <button
                onClick={() => setHistoryModalDept(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cmsStore.getRevisions('department', historyModalDept.id).length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  No previous revisions recorded for this department.
                </p>
              ) : (
                cmsStore.getRevisions('department', historyModalDept.id).map((rev, rIdx) => (
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
                onClick={() => setHistoryModalDept(null)}
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
