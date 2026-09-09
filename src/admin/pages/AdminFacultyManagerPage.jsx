import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Upload, 
  GraduationCap, 
  Building2, 
  Mail, 
  Phone, 
  FileText, 
  BookOpen, 
  Sparkles,
  ExternalLink,
  RefreshCw,
  Loader2
} from 'lucide-react';
import api from '../../lib/api';
import { 
  getFaculty, 
  saveFaculty, 
  deleteFaculty 
} from '../../services/facultyService';
import { getDepartments } from '../../services/departmentsService';

export default function AdminFacultyManagerPage() {
  const [faculty, setFaculty] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionSuccess, setActionSuccess] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'academic' | 'publications'
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'uploading' | 'server'
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // Form State
  const initialForm = {
    id: '',
    name: '',
    designation: 'Assistant Professor',
    department: '',
    qualification: '',
    profile: '',
    photoUrl: '/assets/faculty/default-avatar.jpg',
    source_url: '',
  };

  const [formData, setFormData] = useState(initialForm);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [facultyData, deptsData] = await Promise.all([
        getFaculty(),
        getDepartments().catch(() => [])
      ]);
      setFaculty(facultyData);
      setDepartments(deptsData);
    } catch (err) {
      console.error('Failed to load faculty:', err);
      setError('Unable to load faculty members from server. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const cleanStr = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const filteredFaculty = faculty.filter(f => {
    const searchClean = cleanStr(searchTerm);
    const deptName = f.department || f.departmentName || '';
    const matchesSearch = !searchClean || (
      cleanStr(f.name).includes(searchClean) ||
      cleanStr(f.designation).includes(searchClean) ||
      cleanStr(deptName).includes(searchClean) ||
      cleanStr(f.qualification).includes(searchClean)
    );
    const matchesDept = selectedDeptFilter === 'all' || deptName === selectedDeptFilter || f.department_id === selectedDeptFilter;
    return matchesSearch && matchesDept;
  });

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setUploadStatus(null);
    const defaultDept = departments[0]?.name || 'Department of Computer Applications (BCA / MCA)';
    setFormData({
      ...initialForm,
      department: defaultDept
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (f) => {
    setEditingFaculty(f);
    setUploadStatus(null);
    setFormData({
      id: f.id || '',
      name: f.name || '',
      designation: f.designation || 'Assistant Professor',
      department: f.department || f.departmentName || departments[0]?.name || '',
      qualification: f.qualification || '',
      profile: f.profile || '',
      photoUrl: f.photo_url || f.photoUrl || f.image || f.photo || '/assets/faculty/default-avatar.jpg',
      source_url: f.source_url || '',
    });
    setActiveTab('basic');
    setIsModalOpen(true);
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        alert('Image file size exceeds 10MB limit. Please select a smaller photo.');
        return;
      }

      setUploadStatus('uploading');

      // Instant local preview
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({
          ...prev,
          photoUrl: uploadEvent.target.result,
        }));
      };
      reader.readAsDataURL(file);

      // Server Upload
      try {
        const uploadData = new FormData();
        uploadData.append('file', file);
        uploadData.append('category', 'faculty');
        uploadData.append('alt_text', formData.name ? `${formData.name} Profile Photo` : 'Faculty Photo');

        const res = await api.upload('/admin/media', uploadData);
        if (res && res.url) {
          setFormData((prev) => ({
            ...prev,
            photoUrl: res.url,
          }));
          setUploadStatus('server');
        }
      } catch (err) {
        console.error('Photo upload failed:', err);
        setUploadStatus(null);
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const payload = {
      id: formData.id || undefined,
      name: formData.name,
      designation: formData.designation,
      department: formData.department,
      qualification: formData.qualification,
      profile: formData.profile,
      photoUrl: formData.photoUrl,
      source_url: formData.source_url,
    };

    try {
      const saved = await saveFaculty(payload);
      setActionSuccess(`Faculty member "${formData.name}" successfully saved.`);
      setTimeout(() => setActionSuccess(null), 4000);

      // Refresh faculty list
      await loadData();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save faculty member:', err);
      const errMsg = err?.data?.message || err?.message || 'Server error while saving faculty.';
      setError(errMsg);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete faculty member "${name}"?`)) {
      return;
    }

    setDeletingId(id);
    try {
      await deleteFaculty(id);
      setActionSuccess(`Faculty member "${name}" deleted.`);
      setTimeout(() => setActionSuccess(null), 4000);
      setFaculty(prev => prev.filter(f => f.id !== id));
    } catch (err) {
      console.error('Failed to delete faculty member:', err);
      const errMsg = err?.data?.message || err?.message || 'Server error while deleting faculty member.';
      setError(errMsg);
    } finally {
      setDeletingId(null);
    }
  };

  const deptOptions = [...new Set([
    ...departments.map(d => d.name),
    ...faculty.map(f => f.department).filter(Boolean)
  ])];

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              Server Authoritative CMS
            </span>
            <span className="text-slate-500 text-xs font-mono">MySQL / Laravel API Synced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191d28] tracking-tight">
            Faculty Directory Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Add, update, transfer departments, edit academic CVs, and publish faculty profiles with instant server persistence.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={loadData}
            disabled={loading}
            className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold inline-flex items-center space-x-2 cursor-pointer transition-colors shadow-xs"
            title="Reload from server"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleOpenAdd}
            className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs inline-flex items-center space-x-2 shrink-0 cursor-pointer transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Faculty Member</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl text-xs font-bold flex items-center space-x-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-4 rounded-xl text-xs font-bold flex items-center justify-between animate-fadeIn">
          <div className="flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
          <button onClick={() => setError(null)} className="text-rose-600 hover:text-rose-900 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Authoritative Roster</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">{faculty.length}</p>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-emerald-600 uppercase tracking-wider block">Verified Records</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
            {faculty.filter(f => f.source_verified !== false).length}
          </p>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-amber-600 uppercase tracking-wider block">With Profiles</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-mono">
            {faculty.filter(f => f.profile && f.profile.trim() !== '').length}
          </p>
        </div>
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block">Active Departments</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-600 font-mono">{deptOptions.length}</p>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col md:flex-row gap-4 justify-between items-center shadow-xs">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, designation, dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          <div className="flex items-center space-x-1 text-xs text-slate-500">
            <Building2 className="w-3.5 h-3.5" />
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="bg-slate-50 border border-slate-200/80 rounded-xl px-3 py-1.5 text-xs text-slate-700 font-medium focus:outline-none focus:bg-white cursor-pointer"
            >
              <option value="all">All Departments ({deptOptions.length})</option>
              {deptOptions.map((deptName, idx) => (
                <option key={idx} value={deptName}>{deptName}</option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* 4. FACULTY DATA TABLE */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 text-center text-slate-400 space-y-3">
            <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
            <p className="text-xs font-mono">Loading authoritative faculty data from MySQL...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4">Faculty Member</th>
                  <th className="py-3.5 px-4">Department</th>
                  <th className="py-3.5 px-4">Designation</th>
                  <th className="py-3.5 px-4">Qualification</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredFaculty.slice(0, 100).map((f, idx) => {
                  const photo = f.photo_url || f.photoUrl || f.image || f.photo;
                  const isDeleting = deletingId === f.id;

                  return (
                    <tr key={f.id || idx} className="hover:bg-slate-50/70 transition-colors group">
                      
                      {/* Avatar + Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-200 bg-slate-100 shrink-0">
                            <img
                              src={photo || '/assets/faculty/default-avatar.jpg'}
                              alt={f.name}
                              className="w-full h-full object-cover object-top"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '/assets/images/logo/st_philos_official_crest.png';
                              }}
                            />
                          </div>
                          <div>
                            <span className="font-bold text-slate-900 block group-hover:text-blue-600 transition-colors">
                              {f.name}
                            </span>
                            <span className="text-[11px] text-slate-400 font-mono">
                              ID: {f.id || 'N/A'}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Department */}
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                          {f.department || f.departmentName || 'Unassigned'}
                        </span>
                      </td>

                      {/* Designation */}
                      <td className="py-3.5 px-4 text-slate-800 font-medium">
                        {f.designation || 'Faculty Member'}
                      </td>

                      {/* Qualification */}
                      <td className="py-3.5 px-4 text-slate-500">
                        {f.qualification || '—'}
                      </td>

                      {/* Action Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end space-x-1.5">
                          
                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(f)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-blue-600 transition-colors cursor-pointer"
                            title="Edit Faculty Details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(f.id, f.name)}
                            disabled={isDeleting}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer disabled:opacity-50"
                            title="Delete Faculty Member"
                          >
                            {isDeleting ? (
                              <Loader2 className="w-3.5 h-3.5 animate-spin text-rose-600" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>

                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="p-4 bg-slate-50/80 border-t border-slate-200/80 text-xs text-slate-500 flex items-center justify-between">
          <span>Showing {filteredFaculty.length} of {faculty.length} faculty records in MySQL</span>
          <span className="font-mono text-[11px] text-emerald-600 font-bold">Laravel Sanctum Authorized</span>
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT FACULTY ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto text-slate-800">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-blue-600 uppercase tracking-wider block font-bold">
                  Server-Authoritative Faculty CMS
                </span>
                <h3 className="font-extrabold text-xl text-[#191d28]">
                  {editingFaculty ? `Edit Faculty: ${editingFaculty.name}` : 'Add New Faculty Member'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Name */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-700 font-bold block">Faculty Full Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Dr. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                    />
                  </div>

                  {/* Designation */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">Designation</label>
                    <input
                      type="text"
                      placeholder="e.g. Assistant Professor / Head of Department"
                      value={formData.designation}
                      onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                    />
                  </div>

                  {/* Department */}
                  <div className="space-y-1">
                    <label className="text-slate-700 font-bold block">
                      Assigned Department
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Computer Applications (BCA)"
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                    />
                  </div>

                  {/* Qualification */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-700 font-bold block">Academic Qualifications</label>
                    <input
                      type="text"
                      placeholder="e.g. M.Sc., M.Phil., Ph.D., NET, KSET"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900"
                    />
                  </div>

                  {/* Biography / Profile Statement */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-700 font-bold block">Biography / Profile Summary</label>
                    <textarea
                      rows={4}
                      placeholder="Enter biographical overview, specialization, or research interests..."
                      value={formData.profile}
                      onChange={(e) => setFormData({ ...formData, profile: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 font-sans text-xs"
                    />
                  </div>

                  {/* Photograph Upload & Path */}
                  <div className="space-y-2 sm:col-span-2 bg-slate-50 p-4 rounded-2xl border border-slate-200">
                    <div className="flex items-center justify-between">
                      <label className="text-slate-700 font-bold block text-xs">
                        Faculty Photograph
                      </label>
                      {formData.photoUrl && formData.photoUrl !== '/assets/faculty/default-avatar.jpg' && (
                        <button
                          type="button"
                          onClick={() => setFormData({ ...formData, photoUrl: '/assets/faculty/default-avatar.jpg' })}
                          className="text-[11px] text-rose-600 hover:text-rose-800 transition-colors cursor-pointer font-medium"
                        >
                          Reset to Default Avatar
                        </button>
                      )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      {/* Preview Avatar with Badge */}
                      <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-slate-300 bg-white shrink-0 shadow-xs">
                        <img
                          src={formData.photoUrl || '/assets/faculty/default-avatar.jpg'}
                          alt="Faculty Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/assets/images/logo/st_philos_official_crest.png'; }}
                        />
                      </div>

                      {/* Upload Button + File Input + Direct URL Input */}
                      <div className="flex-1 w-full space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <label className="inline-flex items-center space-x-2 px-3.5 py-2 bg-[#18191f] hover:bg-black text-white text-xs font-bold rounded-xl cursor-pointer transition-all shadow-xs shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload Local Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handlePhotoUpload}
                              className="hidden"
                            />
                          </label>

                          {uploadStatus === 'uploading' && (
                            <span className="text-[11px] text-amber-600 flex items-center font-mono animate-pulse">
                              ⏳ Uploading to Server...
                            </span>
                          )}
                          {uploadStatus === 'server' && (
                            <span className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-lg font-mono font-bold flex items-center">
                              ✓ Stored on Server
                            </span>
                          )}
                        </div>

                        <input
                          type="text"
                          placeholder="Or enter image URL / local path (e.g. /media/faculty/photo.jpg)"
                          value={formData.photoUrl}
                          onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                          className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-900 text-xs focus:outline-none focus:border-slate-900"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Source URL */}
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-slate-700 font-bold block">Source URL / Reference Link</label>
                    <input
                      type="text"
                      placeholder="https://stphilos.ac.in/faculty-profile-url"
                      value={formData.source_url}
                      onChange={(e) => setFormData({ ...formData, source_url: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-slate-900 focus:outline-none focus:bg-white focus:border-slate-900 font-mono text-[11px]"
                    />
                  </div>

                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={saving}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#18191f] hover:bg-black text-white px-6 py-2.5 rounded-xl font-bold shadow-xs cursor-pointer inline-flex items-center space-x-2 transition-all"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingFaculty ? 'Save to Server' : 'Create in Database'}</span>
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
