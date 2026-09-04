import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  Eye, 
  History, 
  RotateCcw, 
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
  ExternalLink
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';
import api from '../../lib/api';

export default function AdminFacultyManagerPage() {
  const faculty = useCms(() => cmsStore.getFaculty());
  const departments = useCms(() => cmsStore.getDepartments());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState(null);
  const [historyModalFaculty, setHistoryModalFaculty] = useState(null);
  const [activeTab, setActiveTab] = useState('basic'); // 'basic' | 'academic' | 'publications'
  const [uploadStatus, setUploadStatus] = useState(null); // null | 'uploading' | 'server' | 'local'

  // Form State
  const initialForm = {
    id: '',
    name: '',
    designation: 'Assistant Professor',
    departmentId: departments[0]?.id || 'dept-bca',
    departmentName: departments[0]?.name || '',
    qualification: '',
    experience: '',
    specialization: '',
    email: '',
    phone: '',
    office: '',
    photoUrl: '/assets/faculty/default-avatar.jpg',
    cvUrl: '',
    researchInterests: '',
    publications: '',
    achievements: '',
    status: 'published',
    order: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const cleanStr = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  const filteredFaculty = faculty.filter(f => {
    const searchClean = cleanStr(searchTerm);
    const matchesSearch = !searchClean || (
      cleanStr(f.name).includes(searchClean) ||
      cleanStr(f.designation).includes(searchClean) ||
      cleanStr(f.departmentName).includes(searchClean) ||
      cleanStr(f.qualification).includes(searchClean)
    );
    const matchesDept = selectedDeptFilter === 'all' || f.departmentId === selectedDeptFilter;
    const matchesStatus = selectedStatusFilter === 'all' || (f.status || 'published') === selectedStatusFilter;
    return matchesSearch && matchesDept && matchesStatus;
  });

  const handleOpenAdd = () => {
    setEditingFaculty(null);
    setUploadStatus(null);
    setFormData({
      ...initialForm,
      departmentId: departments[0]?.id || 'dept-bca',
      departmentName: departments[0]?.name || ''
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
      departmentId: f.departmentId || departments[0]?.id || '',
      departmentName: f.departmentName || '',
      qualification: f.qualification || '',
      experience: f.experience || '',
      specialization: f.specialization || '',
      email: f.email || '',
      phone: f.phone || '',
      office: f.office || '',
      photoUrl: f.photoUrl || f.image || f.photo || '/assets/faculty/default-avatar.jpg',
      cvUrl: f.cvUrl || '',
      researchInterests: Array.isArray(f.researchInterests) ? f.researchInterests.join(', ') : (f.researchInterests || ''),
      publications: Array.isArray(f.publications) ? f.publications.join('\n') : (f.publications || ''),
      achievements: Array.isArray(f.achievements) ? f.achievements.join('\n') : (f.achievements || ''),
      status: f.status || 'published',
      order: f.order || 0
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

      // 1. Instant local directory / data URI preview & offline fallback
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setFormData((prev) => ({
          ...prev,
          photoUrl: uploadEvent.target.result,
          image: uploadEvent.target.result,
          photo: uploadEvent.target.result
        }));
      };
      reader.readAsDataURL(file);

      // 2. Automated Server Storage & Database Media Record Creation
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
            image: res.url,
            photo: res.url
          }));
          setUploadStatus('server');
        } else {
          setUploadStatus('local');
        }
      } catch (err) {
        // Safe offline fallback: local storage and client directory store
        setUploadStatus('local');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const photo = formData.photoUrl || formData.image || formData.photo || '/assets/faculty/default-avatar.jpg';
    const payload = {
      ...formData,
      photoUrl: photo,
      image: photo,
      photo: photo,
      researchInterests: formData.researchInterests ? formData.researchInterests.split(',').map(s => s.trim()).filter(Boolean) : [],
      publications: formData.publications ? formData.publications.split('\n').map(s => s.trim()).filter(Boolean) : [],
      achievements: formData.achievements ? formData.achievements.split('\n').map(s => s.trim()).filter(Boolean) : []
    };

    await cmsStore.saveFaculty(payload);
    setIsModalOpen(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete / archive faculty member "${name}"?`)) {
      await cmsStore.deleteFaculty(id);
    }
  };

  const handleRestoreRevision = async (revId) => {
    if (historyModalFaculty && revId) {
      await cmsStore.restoreRevision('faculty', historyModalFaculty.id, revId);
      setHistoryModalFaculty(null);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* 1. TOP HEADER & METRICS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08121E] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C5496] text-[#FFD84A] font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module 22.1
            </span>
            <span className="text-slate-400 text-xs">Live Database Synced</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Faculty Directory Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Add, update, transfer departments, edit academic CVs, and publish faculty profiles with instant public reflection.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="btn-gold px-5 py-3 rounded-xl text-xs font-bold shadow-lg inline-flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Faculty Member</span>
        </button>
      </div>

      {/* 2. STATS OVERVIEW */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-slate-400 uppercase">Total Faculty</span>
          <p className="text-2xl font-bold text-white">{faculty.length}</p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-emerald-400 uppercase">Published Live</span>
          <p className="text-2xl font-bold text-emerald-400">
            {faculty.filter(f => (f.status || 'published') === 'published').length}
          </p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-amber-400 uppercase">Draft / Review</span>
          <p className="text-2xl font-bold text-amber-400">
            {faculty.filter(f => f.status === 'draft').length}
          </p>
        </div>
        <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl space-y-1">
          <span className="text-[11px] font-mono text-blue-400 uppercase">Departments</span>
          <p className="text-2xl font-bold text-blue-400">{departments.length}</p>
        </div>
      </div>

      {/* 3. FILTERS & SEARCH TOOLBAR */}
      <div className="bg-[#0D1B2A] border border-slate-800 p-4 rounded-xl flex flex-col md:flex-row gap-4 justify-between items-center">
        
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search by name, designation, dept..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#1C5496]"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap gap-3 items-center w-full md:w-auto">
          {/* Department Filter */}
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Building2 className="w-3.5 h-3.5" />
            <select
              value={selectedDeptFilter}
              onChange={(e) => setSelectedDeptFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Departments ({departments.length})</option>
              {departments.map(d => (
                <option key={d.id} value={d.id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <select
              value={selectedStatusFilter}
              onChange={(e) => setSelectedStatusFilter(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

      </div>

      {/* 4. FACULTY DATA TABLE */}
      <div className="bg-[#0D1B2A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-[#08121E] text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3.5 px-4">Faculty Member</th>
                <th className="py-3.5 px-4">Department</th>
                <th className="py-3.5 px-4">Designation</th>
                <th className="py-3.5 px-4">Qualification</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {filteredFaculty.slice(0, 50).map((f, idx) => (
                <tr key={f.id || idx} className="hover:bg-slate-800/40 transition-colors group">
                  
                  {/* Avatar + Name */}
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-slate-700 bg-slate-900 shrink-0">
                        <img
                          src={f.photoUrl || f.image || f.photo || '/assets/faculty/default-avatar.jpg'}
                          alt={f.name}
                          className="w-full h-full object-cover object-top"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = '/assets/images/logo/st_philos_official_crest.png';
                          }}
                        />
                      </div>
                      <div>
                        <span className="font-bold text-slate-100 block group-hover:text-[#FFD84A] transition-colors">
                          {f.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-mono">
                          ID: {f.id || 'N/A'} {f.origin === 'local_modified' && <span className="text-amber-400 font-bold ml-1">(Local Edit)</span>}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Department */}
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                      {f.departmentName || f.departmentId || 'Unassigned'}
                    </span>
                  </td>

                  {/* Designation */}
                  <td className="py-3 px-4 text-slate-200 font-medium">
                    {f.designation || 'Faculty Member'}
                  </td>

                  {/* Qualification */}
                  <td className="py-3 px-4 text-slate-400">
                    {f.qualification || '—'}
                  </td>

                  {/* Status Badge */}
                  <td className="py-3 px-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase ${
                      f.status === 'published' || !f.status
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : f.status === 'draft'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {f.status || 'published'}
                    </span>
                  </td>

                  {/* Action Buttons */}
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      
                      {/* Revision History */}
                      <button
                        onClick={() => setHistoryModalFaculty(f)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-amber-400 transition-colors"
                        title="View Version History & Rollback"
                      >
                        <History className="w-3.5 h-3.5" />
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => handleOpenEdit(f)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-[#1C5496] text-slate-400 hover:text-white transition-colors"
                        title="Edit Faculty Details"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(f.id, f.name)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors"
                        title="Delete / Archive Faculty"
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

        <div className="p-4 bg-[#08121E] border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between">
          <span>Showing {filteredFaculty.length} of {faculty.length} registered faculty members</span>
          <span className="font-mono text-[11px] text-[#FFD84A]">Auto-sync with Department Rosters Active</span>
        </div>
      </div>

      {/* ================= MODAL: ADD / EDIT FACULTY ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-2xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto my-auto text-slate-200">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-[#FFD84A] uppercase tracking-wider block">
                  Metronic Dynamic Content Management
                </span>
                <h3 className="font-serif font-bold text-xl text-white">
                  {editingFaculty ? `Edit Faculty: ${editingFaculty.name}` : 'Add New Faculty Member'}
                </h3>
              </div>

              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Tab Navigation */}
            <div className="flex border-b border-slate-800 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('basic')}
                className={`py-2 px-4 border-b-2 transition-colors ${
                  activeTab === 'basic' ? 'border-[#FFD84A] text-[#FFD84A]' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                1. Basic Info & Department
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('academic')}
                className={`py-2 px-4 border-b-2 transition-colors ${
                  activeTab === 'academic' ? 'border-[#FFD84A] text-[#FFD84A]' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                2. Qualifications & Experience
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('publications')}
                className={`py-2 px-4 border-b-2 transition-colors ${
                  activeTab === 'publications' ? 'border-[#FFD84A] text-[#FFD84A]' : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                3. Research & Publications
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              
              {/* TAB 1: BASIC INFO */}
              {activeTab === 'basic' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">Faculty Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Dr. John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    {/* Designation */}
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">Designation *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Associate Professor & HOD"
                        value={formData.designation}
                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#1C5496]"
                      />
                    </div>

                    {/* Department Dropdown (DYNAMIC RELATIONSHIP REQUIREMENT) */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-slate-400 font-bold block">
                        Assigned Academic Department * (Dynamic Linking)
                      </label>
                      <select
                        required
                        value={formData.departmentId}
                        onChange={(e) => {
                          const dept = departments.find(d => d.id === e.target.value);
                          setFormData({ 
                            ...formData, 
                            departmentId: e.target.value,
                            departmentName: dept ? dept.name : ''
                          });
                        }}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-[#1C5496]"
                      >
                        {departments.map(d => (
                          <option key={d.id} value={d.id}>
                            {d.name} ({d.code || d.id})
                          </option>
                        ))}
                      </select>
                      <p className="text-[10px] text-slate-500">
                        Selecting a department automatically updates the faculty roster on that department's live page.
                      </p>
                    </div>

                    {/* Photograph Upload & Path */}
                    <div className="space-y-2 sm:col-span-2 bg-slate-900/60 p-3.5 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <label className="text-slate-300 font-bold block text-xs">
                          Faculty Photograph
                        </label>
                        {formData.photoUrl && formData.photoUrl !== '/assets/faculty/default-avatar.jpg' && (
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, photoUrl: '/assets/faculty/default-avatar.jpg' })}
                            className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors cursor-pointer"
                          >
                            Reset to Default Avatar
                          </button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        {/* Preview Avatar with Badge */}
                        <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-[#1C5496] bg-slate-800 shrink-0 shadow-md">
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
                            <label className="inline-flex items-center space-x-2 px-3.5 py-2 bg-[#1C5496] hover:bg-[#2563eb] text-white text-xs font-bold rounded-lg cursor-pointer transition-all shadow-xs shrink-0">
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
                              <span className="text-[11px] text-amber-400 flex items-center font-mono animate-pulse">
                                ⏳ Uploading to Server Storage & Database...
                              </span>
                            )}
                            {uploadStatus === 'server' && (
                              <span className="text-[11px] text-emerald-400 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold flex items-center">
                                ✓ Stored in Server & Database
                              </span>
                            )}
                            {uploadStatus === 'local' && (
                              <span className="text-[11px] text-blue-300 bg-blue-950/80 border border-blue-800 px-2 py-0.5 rounded font-mono font-semibold flex items-center">
                                ✓ Cached in Local Directory
                              </span>
                            )}
                            {!uploadStatus && (
                              <span className="text-[11px] text-slate-500 hidden sm:inline">
                                PNG, JPG, WebP up to 10MB
                              </span>
                            )}
                          </div>

                          <input
                            type="text"
                            placeholder="Or enter image URL / local path (e.g. /assets/faculty/photo.jpg)"
                            value={formData.photoUrl}
                            onChange={(e) => setFormData({ ...formData, photoUrl: e.target.value })}
                            className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-white text-xs focus:outline-none focus:border-[#1C5496]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Email & Phone */}
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">Email Address</label>
                      <input
                        type="email"
                        placeholder="faculty@stphilos.ac.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">Contact Phone / Extension</label>
                      <input
                        type="text"
                        placeholder="+91 821 4001900"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                      />
                    </div>

                    {/* Status & Order */}
                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">Publication Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                      >
                        <option value="published">Published (Live on Website)</option>
                        <option value="draft">Draft (Admin Only)</option>
                        <option value="archived">Archived</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-slate-400 font-bold block">Display Order Weight</label>
                      <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                      />
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: QUALIFICATIONS & EXPERIENCE */}
              {activeTab === 'academic' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Academic Qualifications *</label>
                    <input
                      type="text"
                      placeholder="e.g. M.Sc., Ph.D., NET, KSET"
                      value={formData.qualification}
                      onChange={(e) => setFormData({ ...formData, qualification: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Teaching & Research Experience</label>
                    <input
                      type="text"
                      placeholder="e.g. 14 Years Teaching, 6 Years Research"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Primary Specialization</label>
                    <input
                      type="text"
                      placeholder="e.g. Condensed Matter Physics / Corporate Accounting"
                      value={formData.specialization}
                      onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">CV Document / Profile PDF Link</label>
                    <input
                      type="text"
                      placeholder="/documents/faculty/cv-dr-john-doe.pdf"
                      value={formData.cvUrl}
                      onChange={(e) => setFormData({ ...formData, cvUrl: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: RESEARCH & PUBLICATIONS */}
              {activeTab === 'publications' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Research Interests (Comma Separated)</label>
                    <input
                      type="text"
                      placeholder="Machine Learning, Data Mining, Quantum Computing"
                      value={formData.researchInterests}
                      onChange={(e) => setFormData({ ...formData, researchInterests: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Publications (One entry per line)</label>
                    <textarea
                      rows={4}
                      placeholder="1. Author, Title, Journal (2025)&#10;2. Author, Conference paper (2024)"
                      value={formData.publications}
                      onChange={(e) => setFormData({ ...formData, publications: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none font-mono text-[11px]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-slate-400 font-bold block">Achievements & Awards (One entry per line)</label>
                    <textarea
                      rows={3}
                      placeholder="1. Best Researcher Award 2025&#10;2. State Level Gold Medalist"
                      value={formData.achievements}
                      onChange={(e) => setFormData({ ...formData, achievements: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none font-mono text-[11px]"
                    />
                  </div>
                </div>
              )}

              {/* Modal Actions */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold cursor-pointer"
                >
                  Cancel
                </button>

                <div className="flex items-center space-x-2">
                  <button
                    type="submit"
                    className="btn-gold px-6 py-2.5 rounded-xl font-bold shadow-md cursor-pointer"
                  >
                    {editingFaculty ? 'Save & Publish Changes' : 'Create & Publish Faculty'}
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ================= MODAL: VERSION HISTORY & ROLLBACK ================= */}
      {historyModalFaculty && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-[#FFD84A]" />
                <h3 className="font-serif font-bold text-base text-white">
                  Revision History: {historyModalFaculty.name}
                </h3>
              </div>
              <button
                onClick={() => setHistoryModalFaculty(null)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cmsStore.getRevisions('faculty', historyModalFaculty.id).length === 0 ? (
                <p className="text-xs text-slate-400 italic text-center py-6">
                  No previous revisions recorded for this faculty member yet.
                </p>
              ) : (
                cmsStore.getRevisions('faculty', historyModalFaculty.id).map((rev, rIdx) => (
                  <div key={rev.id || rIdx} className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
                    <div className="space-y-0.5">
                      <span className="font-mono text-slate-300 font-bold block">
                        {new Date(rev.timestamp).toLocaleString()}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono">
                        By {rev.user} • Dept: {rev.snapshot?.departmentName || 'N/A'}
                      </span>
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
                onClick={() => setHistoryModalFaculty(null)}
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
