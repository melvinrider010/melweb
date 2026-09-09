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
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module · Academic Departments
            </span>
            <span className="text-slate-500 text-xs">Dynamic Institutional Registry</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191d28] tracking-tight">
            Academic Departments Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Turn ON or OFF academic departments, assign faculty rosters, link degree programmes, and control public visibility instantly.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs inline-flex items-center space-x-2 shrink-0 cursor-pointer transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Department</span>
        </button>
      </div>

      {/* 2. STATS & QUICK BULK MASTER CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Stats */}
        <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Departments</span>
            <p className="text-xl sm:text-2xl font-extrabold text-[#191d28] font-mono">{departments.length}</p>
          </div>
          <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">Live (ON)</span>
            <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono">
              {departments.filter(d => (d.status || 'published') === 'published').length}
            </p>
          </div>
          <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block">Faculty</span>
            <p className="text-xl sm:text-2xl font-extrabold text-blue-600 font-mono">{faculty.length}</p>
          </div>
          <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
            <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider block">Programmes</span>
            <p className="text-xl sm:text-2xl font-extrabold text-amber-600 font-mono">{programmes.length}</p>
          </div>
        </div>

        {/* Bulk Controls */}
        <div className="lg:col-span-5 bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl shadow-xs flex items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono text-slate-700 uppercase font-bold tracking-wider block">
              Department Master Switch
            </span>
            <p className="text-xs text-slate-500 font-medium">Bulk visibility control</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleBulkSetStatus('published')}
              className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Turn All ON
            </button>
            <button
              onClick={() => handleBulkSetStatus('draft')}
              className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              Turn All OFF
            </button>
          </div>
        </div>

      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search departments by name, code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2 text-xs text-slate-500">
          <span className="font-semibold">Status:</span>
          <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setSelectedStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedStatusFilter === 'all' ? 'bg-[#18191f] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setSelectedStatusFilter('published')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedStatusFilter === 'published' ? 'bg-[#18191f] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Live (ON)
            </button>
            <button
              onClick={() => setSelectedStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedStatusFilter === 'draft' ? 'bg-[#18191f] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
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
              className={`bg-white border rounded-2xl p-5 space-y-4 transition-all flex flex-col justify-between shadow-xs hover:shadow-md group ${
                isLive ? 'border-slate-200/80 hover:border-slate-300' : 'border-slate-200/40 opacity-60 bg-slate-50/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-100 text-slate-700 border border-slate-200">
                    {dept.code || dept.id}
                  </span>

                  {/* Live ON / OFF Switch */}
                  <button
                    onClick={() => handleToggleStatus(dept.id)}
                    className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono transition-all cursor-pointer ${
                      isLive
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                        : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
                    }`}
                    title={`Click to turn ${isLive ? 'OFF (Draft)' : 'ON (Live)'}`}
                  >
                    <span className={`w-2 h-2 rounded-full ${isLive ? 'bg-emerald-500 animate-pulse' : 'bg-rose-400'}`} />
                    <span>{isLive ? 'LIVE (ON)' : 'OFF (Draft)'}</span>
                  </button>
                </div>

                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                  {dept.name}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 font-sans">
                  {dept.description || dept.about || 'Academic department offering specialized undergraduate and postgraduate curricula.'}
                </p>

                {/* Relationships Meta Badges */}
                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 text-[11px] font-mono text-slate-500">
                  <div className="flex items-center space-x-1.5">
                    <Users className="w-3.5 h-3.5 text-amber-500" />
                    <span>{deptFacultyCount} Faculty</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <GraduationCap className="w-3.5 h-3.5 text-blue-500" />
                    <span>{(dept.ugProgrammes?.length || 0) + (dept.pgProgrammes?.length || 0)} Programmes</span>
                  </div>
                </div>
              </div>

              {/* Actions Bar */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                <a
                  href={`/departments/${dept.slug || dept.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue-600 hover:underline font-bold inline-flex items-center space-x-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Live</span>
                </a>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => setHistoryModalDept(dept)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-amber-600 transition-colors cursor-pointer"
                    title="View Revisions"
                  >
                    <History className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleOpenEdit(dept)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit Department"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDelete(dept.id, dept.name)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block font-bold">
                  Metronic Department Management
                </span>
                <h3 className="font-extrabold text-xl text-[#191d28]">
                  {editingDept ? `Edit Department: ${editingDept.name}` : 'Create New Academic Department'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Department Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Department Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Department of Computer Science"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                {/* Code & Slug */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Department Code *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. CS / COMMERCE"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">URL Slug</label>
                  <input
                    type="text"
                    placeholder="e.g. computer-science"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                {/* Faculty Group */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Faculty Division</label>
                  <select
                    value={formData.facultyName}
                    onChange={(e) => setFormData({ ...formData, facultyName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  >
                    <option value="Faculty of Science & Computer Applications">Faculty of Science & Computer Applications</option>
                    <option value="Faculty of Commerce">Faculty of Commerce</option>
                    <option value="Faculty of Management Studies">Faculty of Management Studies</option>
                    <option value="Faculty of Humanities & Languages">Faculty of Humanities & Languages</option>
                  </select>
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Department Overview / About</label>
                  <textarea
                    rows={3}
                    placeholder="Comprehensive description of the department..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                {/* Vision */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Department Vision</label>
                  <textarea
                    rows={2}
                    placeholder="Vision statement..."
                    value={formData.vision}
                    onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                {/* Mission */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-slate-700 font-bold block">Department Mission</label>
                  <textarea
                    rows={2}
                    placeholder="Mission statement..."
                    value={formData.mission}
                    onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                {/* Contact Email & Status */}
                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Official Email</label>
                  <input
                    type="email"
                    placeholder="dept@stphilos.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-700 font-bold block">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
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
                  {editingDept ? 'Save Changes' : 'Create Department'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: REVISION HISTORY ================= */}
      {historyModalDept && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-4 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-amber-500" />
                <h3 className="font-extrabold text-base text-[#191d28]">
                  Revision History: {historyModalDept.name}
                </h3>
              </div>
              <button
                onClick={() => setHistoryModalDept(null)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 cursor-pointer"
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
                  <div key={rev.id || rIdx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-mono text-slate-800 font-bold block">
                        {new Date(rev.timestamp).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">By {rev.user}</span>
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
                onClick={() => setHistoryModalDept(null)}
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
