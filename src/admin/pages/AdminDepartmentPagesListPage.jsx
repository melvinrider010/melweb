import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  ExternalLink,
  CheckCircle2, 
  X, 
  Users, 
  GraduationCap, 
  FileText, 
  Sparkles,
  Layers,
  ArrowUpDown,
  Filter,
  RefreshCw,
  Clock,
  ChevronRight,
  AlertCircle
} from 'lucide-react';
import * as deptService from '../../services/departmentsService';

export default function AdminDepartmentPagesListPage() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State for New Department
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addForm, setAddForm] = useState({
    name: '',
    slug: '',
    category: 'Science',
    head: '',
    short_description: '',
    status: 'draft'
  });

  const loadDepartments = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const data = await deptService.getAdminDepartments();
      setDepartments(Array.isArray(data) ? data : []);
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to fetch departments from server.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  // Filtered department list
  const filteredDepartments = departments.filter(d => {
    const q = searchTerm.toLowerCase();
    const matchesSearch = (
      (d.name || '').toLowerCase().includes(q) ||
      (d.slug || '').toLowerCase().includes(q) ||
      (d.category || '').toLowerCase().includes(q) ||
      (d.head || '').toLowerCase().includes(q) ||
      (d.id || '').toLowerCase().includes(q)
    );

    const matchesStatus = statusFilter === 'all' || (d.status || 'published') === statusFilter;
    const matchesCategory = categoryFilter === 'all' || (d.category || '').toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Toggle quick status
  const handleToggleStatus = async (dept) => {
    const newStatus = dept.status === 'published' ? 'draft' : 'published';
    try {
      if (newStatus === 'published') {
        await deptService.publishDepartment(dept.id);
        setSuccessMessage(`Department "${dept.name}" is now Published live.`);
      } else {
        await deptService.unpublishDepartment(dept.id);
        setSuccessMessage(`Department "${dept.name}" moved to Unpublished/Draft.`);
      }
      loadDepartments();
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to update department status.');
    }
  };

  // Delete department
  const handleDelete = async (dept) => {
    if (!window.confirm(`Are you sure you want to delete "${dept.name}" and all its content sections? This action cannot be undone.`)) {
      return;
    }
    try {
      await deptService.deleteDepartment(dept.id);
      setSuccessMessage(`Department "${dept.name}" deleted successfully.`);
      loadDepartments();
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to delete department.');
    }
  };

  // Create department
  const handleCreateDepartment = async (e) => {
    e.preventDefault();
    if (!addForm.name.trim()) return;

    setIsSubmitting(true);
    setErrorMessage('');
    try {
      const res = await deptService.createDepartment(addForm);
      setIsAddModalOpen(false);
      setAddForm({
        name: '',
        slug: '',
        category: 'Science',
        head: '',
        short_description: '',
        status: 'draft'
      });
      setSuccessMessage(`Created department "${addForm.name}". Opening editor...`);
      loadDepartments();
      if (res?.department?.id) {
        navigate(`/admin/department-pages/${res.department.id}/edit`);
      }
    } catch (err) {
      setErrorMessage(err?.message || 'Failed to create department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categories = Array.from(new Set(departments.map(d => d.category).filter(Boolean)));

  const publishedCount = departments.filter(d => (d.status || 'published') === 'published').length;
  const draftCount = departments.filter(d => d.status === 'draft' || d.status === 'unpublished').length;
  const totalFaculty = departments.reduce((acc, d) => acc + (d.faculty_count || 0), 0);
  const totalProgrammes = departments.reduce((acc, d) => acc + (d.programmes_count || 0), 0);

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. TOP HEADER & BREADCRUMBS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-slate-500 uppercase tracking-wider mb-1">
            <Link to="/admin" className="hover:text-blue-600">Admin</Link>
            <span>/</span>
            <span className="text-slate-900 font-bold">Departmental Pages</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-slate-900 tracking-tight flex items-center gap-2.5">
            <Building2 className="w-7 h-7 text-[#1C5496]" />
            <span>Departmental Pages</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Centralized section-based CMS management for all academic departments, faculty rosters, programs, and public department pages.
          </p>
        </div>

        <div className="flex items-center space-x-2.5">
          <button
            onClick={loadDepartments}
            disabled={isLoading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl transition-colors cursor-pointer"
            title="Refresh List"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center space-x-2 px-4 py-2.5 bg-[#18191f] hover:bg-slate-800 text-white rounded-xl text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Department</span>
          </button>
        </div>
      </div>

      {/* NOTIFICATIONS */}
      {successMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
          <button onClick={() => setSuccessMessage('')} className="p-1 text-emerald-600 hover:text-emerald-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button onClick={() => setErrorMessage('')} className="p-1 text-rose-600 hover:text-rose-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 2. STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block">Total Departments</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">{departments.length}</p>
          <span className="text-[10px] text-slate-400">All academic units</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-mono text-emerald-600 uppercase tracking-wider block">Published (Live)</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">{publishedCount}</p>
          <span className="text-[10px] text-slate-400">Accessible on website</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-mono text-amber-600 uppercase tracking-wider block">Draft / Offline</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">{draftCount}</p>
          <span className="text-[10px] text-slate-400">In draft mode</span>
        </div>

        <div className="bg-white border border-slate-200/80 p-5 rounded-2xl shadow-xs space-y-1">
          <span className="text-[11px] font-mono text-blue-600 uppercase tracking-wider block">Total Faculty</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono">{totalFaculty}</p>
          <span className="text-[10px] text-slate-400">Across all departments</span>
        </div>
      </div>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search departments by name, slug, head..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 transition-colors"
          />
        </div>

        {/* Status & Category Filters */}
        <div className="flex flex-wrap items-center gap-3 text-xs w-full md:w-auto justify-start md:justify-end">
          
          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'all' ? 'bg-[#18191f] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({departments.length})
            </button>
            <button
              onClick={() => setStatusFilter('published')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'published' ? 'bg-emerald-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Published ({publishedCount})
            </button>
            <button
              onClick={() => setStatusFilter('draft')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                statusFilter === 'draft' ? 'bg-amber-600 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Draft ({draftCount})
            </button>
          </div>

          {/* Category Dropdown */}
          {categories.length > 0 && (
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-xl px-3 py-1.5 focus:outline-none focus:border-slate-900"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          )}

        </div>
      </div>

      {/* 4. CENTRALIZED DEPARTMENTS TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/75 text-[11px] font-mono text-slate-500 uppercase tracking-wider">
                <th className="py-3.5 px-5 font-bold">Department</th>
                <th className="py-3.5 px-4 font-bold text-center">Programs</th>
                <th className="py-3.5 px-4 font-bold text-center">Faculty</th>
                <th className="py-3.5 px-4 font-bold text-center">Status</th>
                <th className="py-3.5 px-4 font-bold">Last Updated</th>
                <th className="py-3.5 px-5 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs text-slate-700">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-slate-400" />
                    Loading departmental records...
                  </td>
                </tr>
              ) : filteredDepartments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-slate-500">
                    <Building2 className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    No departments match your current filter criteria.
                  </td>
                </tr>
              ) : (
                filteredDepartments.map((dept) => {
                  const isPublished = (dept.status || 'published') === 'published';
                  const dateStr = dept.updated_at 
                    ? new Date(dept.updated_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                    : 'Sep 12, 2026';

                  return (
                    <tr 
                      key={dept.id} 
                      className="hover:bg-slate-50/70 transition-colors group"
                    >
                      {/* Department Name & Code */}
                      <td className="py-3.5 px-5">
                        <div className="space-y-0.5">
                          <Link 
                            to={`/admin/department-pages/${dept.id}/edit`}
                            className="font-bold text-slate-900 hover:text-blue-600 transition-colors text-sm flex items-center gap-1.5"
                          >
                            <span>{dept.name}</span>
                          </Link>
                          <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-mono">
                            <span>/departments/{dept.slug || dept.id}</span>
                            <span>•</span>
                            <span className="px-1.5 py-0.5 bg-slate-100 rounded text-[10px] text-slate-600 font-medium">
                              {dept.category || 'Science'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Programs Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-blue-50 text-blue-700 border border-blue-100">
                          <GraduationCap className="w-3 h-3" />
                          {dept.programmes_count || (dept.programmes?.length || 0)}
                        </span>
                      </td>

                      {/* Faculty Count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-50 text-amber-700 border border-amber-100">
                          <Users className="w-3 h-3" />
                          {dept.faculty_count || 0}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <button
                          onClick={() => handleToggleStatus(dept)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold font-mono transition-all cursor-pointer ${
                            isPublished
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                          }`}
                          title={`Click to switch to ${isPublished ? 'Draft' : 'Published'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span>{isPublished ? 'Published' : 'Draft'}</span>
                        </button>
                      </td>

                      {/* Last Updated */}
                      <td className="py-3.5 px-4 text-slate-500 font-mono text-[11px]">
                        <div>{dateStr}</div>
                        <div className="text-[10px] text-slate-400">{dept.last_updated_by || 'Admin'}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-5 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* Live Page link */}
                          <a
                            href={`/departments/${dept.slug || dept.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                            title="View Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Preview Draft link */}
                          <a
                            href={`/departments/${dept.slug || dept.id}?preview=1`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                            title="Preview Draft Page"
                          >
                            <Eye className="w-4 h-4" />
                          </a>

                          {/* Edit Button */}
                          <Link
                            to={`/admin/department-pages/${dept.id}/edit`}
                            className="inline-flex items-center space-x-1 px-3 py-1.5 bg-[#1C5496] hover:bg-blue-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </Link>

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(dept)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Delete Department"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* 5. ADD DEPARTMENT MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-[#1C5496]" />
                <h3 className="font-serif font-bold text-lg text-slate-900">Add New Department</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateDepartment} className="p-6 space-y-4 text-xs">
              
              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Department Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Department of Biotechnology"
                  value={addForm.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const autoSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setAddForm(prev => ({ ...prev, name, slug: prev.slug ? prev.slug : autoSlug }));
                  }}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">URL Slug *</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-slate-100 border border-r-0 border-slate-200 rounded-l-xl text-slate-500 font-mono text-[11px]">
                    /departments/
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="biotechnology"
                    value={addForm.slug}
                    onChange={(e) => setAddForm(prev => ({ ...prev, slug: e.target.value }))}
                    className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-r-xl focus:bg-white focus:border-slate-900 text-slate-900 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Faculty / Category</label>
                  <select
                    value={addForm.category}
                    onChange={(e) => setAddForm(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900 text-xs"
                  >
                    <option value="Science">Science</option>
                    <option value="Commerce">Commerce</option>
                    <option value="Management">Management</option>
                    <option value="Humanities">Humanities</option>
                    <option value="Languages">Languages</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="font-bold text-slate-700">Head of Department (HOD)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dr. John Doe"
                    value={addForm.head}
                    onChange={(e) => setAddForm(prev => ({ ...prev, head: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900 text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Short Description</label>
                <textarea
                  rows="2"
                  placeholder="Brief summary of department's academic mission..."
                  value={addForm.short_description}
                  onChange={(e) => setAddForm(prev => ({ ...prev, short_description: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-slate-900 text-slate-900 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-slate-700">Initial Status</label>
                <div className="flex items-center space-x-3 pt-1">
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={addForm.status === 'draft'}
                      onChange={() => setAddForm(prev => ({ ...prev, status: 'draft' }))}
                      className="text-slate-900 focus:ring-0"
                    />
                    <span className="text-slate-700 font-semibold">Draft (Recommended)</span>
                  </label>
                  <label className="flex items-center space-x-1.5 cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={addForm.status === 'published'}
                      onChange={() => setAddForm(prev => ({ ...prev, status: 'published' }))}
                      className="text-slate-900 focus:ring-0"
                    />
                    <span className="text-slate-700 font-semibold">Published Immediately</span>
                  </label>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#18191f] hover:bg-slate-800 text-white rounded-xl font-bold cursor-pointer transition-colors flex items-center space-x-1.5"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Create & Configure</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
