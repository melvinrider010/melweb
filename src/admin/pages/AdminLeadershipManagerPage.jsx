import React, { useState } from 'react';
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
  Sparkles,
  ExternalLink,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Eye,
  Shield,
  Award,
  Crown,
  Briefcase,
  LayoutGrid,
  ListFilter,
  Power,
  Check,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';
import { useAuth } from '../../lib/authContext';

const ROLE_CATEGORIES = [
  { id: 'all', label: 'All Roles' },
  { id: 'Management', label: 'Management & MDES' },
  { id: 'Executive', label: 'Executive Administration' },
  { id: 'Academics', label: 'Academic Heads & Deans' },
  { id: 'Quality Assurance', label: 'Quality & IQAC' },
  { id: 'Postgraduate', label: 'Postgraduate Studies' },
  { id: 'Administration', label: 'Administration' }
];

const OBJECT_POSITIONS = [
  { label: 'Upper Face (50% 12%)', value: '50% 12%' },
  { label: 'Standard Portrait (50% 15%)', value: '50% 15%' },
  { label: 'Chest/Head (50% 18%)', value: '50% 18%' },
  { label: 'Lower Portrait (50% 20%)', value: '50% 20%' },
  { label: 'Center (50% 50%)', value: '50% 50%' }
];

const PHOTO_PRESETS = [
  { label: 'Bishop Francis Serrao', path: '/assets/images/leadership/bishop_francis_serrao.jpg' },
  { label: 'Rector Lourdu Prasad', path: '/assets/images/leadership/lourdu-prasad-joseph.jpg' },
  { label: 'Principal Ravi J.D. Saldanha', path: '/assets/images/leadership/ravi-jd-saldanha.jpg' },
  { label: 'Finance Officer Fr. Roshan', path: '/assets/images/leadership/fr-roshan.jpg' },
  { label: 'Dean Anand C', path: '/assets/images/leadership/anand-c.jpg' },
  { label: 'IQAC A Thomas Gunaseelan', path: '/assets/images/leadership/thomas-gunaseelan.jpg' },
  { label: 'PG Coord Dr. Noor Mubasheer', path: '/assets/images/leadership/noor-mubasheer.jpg' },
  { label: 'Heritage Campus Default', path: '/assets/images/campus/intro_heritage_building.jpg' }
];

export default function AdminLeadershipManagerPage() {
  const { user } = useAuth();
  const userName = user?.name || user?.email || 'Administrator';

  // Reactive subscription to cmsStore leadership data
  const leaders = useCms(() => cmsStore.getLeadership());

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const initialForm = {
    id: '',
    name: '',
    designation: '',
    role: 'Administration',
    qualifications: '',
    email: '',
    phone: '',
    assetPath: '/assets/images/leadership/anand-c.jpg',
    objectPosition: '50% 15%',
    biography: '',
    link: '',
    order: '',
    status: 'active'
  };

  const [formData, setFormData] = useState(initialForm);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingLeader(null);
    setFormData({
      ...initialForm,
      order: leaders.length + 1,
      status: 'active'
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEdit = (leader) => {
    setEditingLeader(leader);
    const isAct = leader.status === 'active' || leader.status === 'published' || !leader.status;
    setFormData({
      id: leader.id || '',
      name: leader.name || '',
      designation: leader.designation || '',
      role: leader.role || 'Administration',
      qualifications: leader.qualifications || leader.qualification || '',
      email: leader.email || '',
      phone: leader.phone || '',
      assetPath: leader.assetPath || leader.imageUrl || '/assets/images/leadership/anand-c.jpg',
      objectPosition: leader.objectPosition || '50% 15%',
      biography: leader.biography || '',
      link: leader.link || '',
      order: leader.order !== undefined ? leader.order : leaders.length,
      status: isAct ? 'active' : 'inactive'
    });
    setIsModalOpen(true);
  };

  // Toggle Active / Inactive Status
  const handleToggleStatus = async (leader) => {
    try {
      const updated = await cmsStore.toggleLeadershipStatus(leader.id, userName);
      const isAct = updated.status === 'active' || updated.status === 'published';
      showToast(`${leader.name} is now ${isAct ? 'Active (Live)' : 'Inactive (Hidden from public site)'}.`);
    } catch (err) {
      console.error('Error toggling status:', err);
      showToast('Failed to update status.');
    }
  };

  // Save Form Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.designation.trim()) {
      showToast('Name and designation are required.');
      return;
    }

    setIsSaving(true);
    try {
      await cmsStore.saveLeadership({
        ...formData,
        imageUrl: formData.assetPath
      }, userName);

      showToast(editingLeader ? `Updated ${formData.name} successfully!` : `Added ${formData.name} to leadership roster!`);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving leader:', err);
      showToast('Failed to save leader. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  // Delete Handler
  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${name}" from Leadership & Administration?`)) {
      return;
    }
    setDeletingId(id);
    try {
      await cmsStore.deleteLeadership(id, userName);
      showToast(`Removed "${name}" from leadership.`);
    } catch (err) {
      console.error('Error deleting leader:', err);
      showToast('Failed to delete leader.');
    } finally {
      setDeletingId(null);
    }
  };

  // Move Order Up / Down
  const handleMoveOrder = async (index, direction) => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filteredLeaders.length) return;

    const reordered = [...filteredLeaders];
    const temp = reordered[index];
    reordered[index] = reordered[targetIndex];
    reordered[targetIndex] = temp;

    const orderedIds = reordered.map(l => l.id);
    await cmsStore.reorderLeadership(orderedIds, userName);
    showToast('Updated leadership display order.');
  };

  // Filtered List
  const filteredLeaders = leaders.filter(l => {
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || (
      (l.name && l.name.toLowerCase().includes(q)) ||
      (l.designation && l.designation.toLowerCase().includes(q)) ||
      (l.role && l.role.toLowerCase().includes(q)) ||
      (l.biography && l.biography.toLowerCase().includes(q)) ||
      (l.qualifications && l.qualifications.toLowerCase().includes(q))
    );

    const matchesRole = selectedRoleFilter === 'all' || 
      (l.role && l.role.toLowerCase() === selectedRoleFilter.toLowerCase());

    const isLeaderActive = (l.status === 'active' || l.status === 'published' || !l.status);
    const matchesStatus = selectedStatusFilter === 'all' || 
      (selectedStatusFilter === 'active' ? isLeaderActive : !isLeaderActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Calculate statistics
  const totalCount = leaders.length;
  const activeCount = leaders.filter(l => (l.status === 'active' || l.status === 'published' || !l.status)).length;
  const inactiveCount = totalCount - activeCount;
  const academicCount = leaders.filter(l => 
    (l.role && (l.role.toLowerCase().includes('academic') || l.role.toLowerCase().includes('postgraduate') || l.role.toLowerCase().includes('quality'))) ||
    (l.designation && (l.designation.toLowerCase().includes('dean') || l.designation.toLowerCase().includes('coordinator') || l.designation.toLowerCase().includes('head')))
  ).length;

  return (
    <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto pb-16">
      
      {/* 1. TOAST NOTIFICATION */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#071A33] text-white px-5 py-3 rounded-2xl shadow-2xl border border-white/20 flex items-center space-x-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-[#FFD84A]" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 2. TOP BANNER / HEADER */}
      <div className="bg-gradient-to-r from-[#19102E] via-[#2A1847] to-[#120B20] text-white p-6 sm:p-8 rounded-3xl border border-white/10 shadow-xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-[#C9A84C]/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-mono text-[#FFD84A] border border-white/10">
              <Crown className="w-3.5 h-3.5 text-[#FFD84A]" />
              <span>Executive Governance CMS</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight font-serif">
              Leadership & Academic Heads Manager
            </h1>
            <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
              Add, update, reorder, toggle status (Active / Inactive), or feature leaders and academic heads displayed on the public <span className="text-[#FFD84A] font-semibold">Leadership & Administration</span> page.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <a
              href="/about?tab=leadership"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all border border-white/15"
            >
              <Eye className="w-4 h-4 text-[#FFD84A]" />
              <span>Preview Live Page</span>
              <ExternalLink className="w-3 h-3 opacity-60" />
            </a>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#C9A84C] to-[#E5C158] hover:from-[#b3923b] hover:to-[#d4ae43] text-slate-950 text-xs font-extrabold shadow-lg shadow-[#C9A84C]/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Leader / Head</span>
            </button>
          </div>
        </div>

        {/* Quick KPI stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/10">
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
            <span className="text-[11px] text-white/60 uppercase font-mono block">Total Roster</span>
            <span className="text-xl font-extrabold text-white">{totalCount} Leaders</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
            <span className="text-[11px] text-white/60 uppercase font-mono block">Active on Website</span>
            <span className="text-xl font-extrabold text-emerald-400">{activeCount} Active</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
            <span className="text-[11px] text-white/60 uppercase font-mono block">Inactive / Hidden</span>
            <span className="text-xl font-extrabold text-amber-300">{inactiveCount} Inactive</span>
          </div>
          <div className="bg-white/5 rounded-2xl p-3.5 border border-white/5">
            <span className="text-[11px] text-white/60 uppercase font-mono block">Academic Heads / Deans</span>
            <span className="text-xl font-extrabold text-indigo-300">{academicCount} Heads</span>
          </div>
        </div>
      </div>

      {/* 3. SEARCH, FILTERS & CONTROLS */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, designation, role, degrees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/50 focus:border-[#C9A84C] text-slate-800 bg-slate-50/50"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter dropdowns & View toggle */}
        <div className="flex flex-wrap items-center gap-3">
          
          {/* Role Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40"
            >
              {ROLE_CATEGORIES.map(c => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]/40 font-semibold"
          >
            <option value="all">All Statuses ({totalCount})</option>
            <option value="active">Active Only ({activeCount})</option>
            <option value="inactive">Inactive Only ({inactiveCount})</option>
          </select>

          {/* View Mode Toggle */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 border border-slate-200/80">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'grid' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              title="Card Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-lg text-xs font-medium transition-all ${viewMode === 'table' ? 'bg-white shadow-xs text-slate-900 font-bold' : 'text-slate-500 hover:text-slate-900'}`}
              title="Table List View"
            >
              <ListFilter className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>

      {/* 4. CONTENT DISPLAY (GRID OR TABLE) */}
      {filteredLeaders.length === 0 ? (
        <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-4">
          <div className="w-14 h-14 bg-slate-100 rounded-full flex items-center justify-center mx-auto text-slate-400">
            <Users className="w-7 h-7" />
          </div>
          <div className="space-y-1">
            <h3 className="text-base font-bold text-slate-800">No leaders or academic heads found</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              {searchTerm || selectedRoleFilter !== 'all' || selectedStatusFilter !== 'all'
                ? "Try adjusting your search criteria or role/status filters to find what you're looking for."
                : "Get started by adding the first leader or administrator using the button below."}
            </p>
          </div>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl bg-[#071A33] text-white text-xs font-bold hover:bg-[#0c284e] transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Leader</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        
        /* === GRID VIEW === */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLeaders.map((leader, index) => {
            const photoUrl = leader.assetPath || leader.imageUrl || '/assets/images/leadership/anand-c.jpg';
            const pos = leader.objectPosition || '50% 15%';
            const isDeleting = deletingId === leader.id;
            const isActive = leader.status === 'active' || leader.status === 'published' || !leader.status;

            return (
              <div 
                key={leader.id || index}
                className={`bg-white rounded-2xl border overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col group relative ${
                  isActive ? 'border-slate-200/90 hover:border-[#C9A84C]/60' : 'border-amber-200/80 bg-amber-50/10'
                }`}
              >
                {/* Photo with Overlay Badges */}
                <div className="aspect-[4/5] bg-slate-900 relative overflow-hidden">
                  <img
                    src={photoUrl}
                    alt={leader.name}
                    style={{ objectPosition: pos }}
                    className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!isActive ? 'grayscale-30 opacity-85' : ''}`}
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = '/assets/images/campus/intro_heritage_building.jpg';
                    }}
                  />

                  {/* Order & Role Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    <span className="bg-[#071A33]/90 text-[#FFD84A] text-[10px] font-bold px-2 py-0.5 rounded border border-[#FFD84A]/30 uppercase tracking-wider backdrop-blur-xs">
                      {leader.role || 'Administration'}
                    </span>
                    <span className="bg-black/60 text-white/90 text-[9px] font-mono px-1.5 py-0.5 rounded">
                      Order: #{leader.order || index + 1}
                    </span>
                  </div>

                  {/* Status Badge on Photo (Clickable Quick Toggle) */}
                  <div className="absolute top-2.5 right-2.5">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(leader)}
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border cursor-pointer transition-all hover:scale-105 flex items-center space-x-1 ${
                        isActive 
                          ? 'bg-emerald-500 text-white border-emerald-400 shadow-xs' 
                          : 'bg-amber-600 text-white border-amber-400 shadow-xs'
                      }`}
                      title={`Click to mark as ${isActive ? 'Inactive' : 'Active'}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-amber-200'}`} />
                      <span>{isActive ? 'Active' : 'Inactive'}</span>
                    </button>
                  </div>

                  {/* Quick Reorder Floating buttons */}
                  <div className="absolute bottom-2.5 right-2.5 flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      disabled={index === 0}
                      onClick={() => handleMoveOrder(index, 'up')}
                      className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move higher on page"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      disabled={index === filteredLeaders.length - 1}
                      onClick={() => handleMoveOrder(index, 'down')}
                      className="p-1.5 rounded-lg bg-black/70 hover:bg-black text-white disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                      title="Move lower on page"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Details Section */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <div className="flex items-start justify-between gap-1">
                      <h4 className="font-serif font-bold text-slate-900 text-base leading-snug group-hover:text-[#0B1F4E] transition-colors">
                        {leader.name}
                      </h4>
                      {!isActive && (
                        <span className="shrink-0 text-[10px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 border border-amber-300">
                          Hidden
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#a88530] font-bold">
                      {leader.designation}
                    </p>
                    {leader.qualifications && (
                      <p className="text-[11px] text-slate-500 italic">
                        {leader.qualifications}
                      </p>
                    )}
                  </div>

                  {leader.biography && (
                    <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed pt-2 border-t border-slate-100">
                      {leader.biography}
                    </p>
                  )}

                  {/* Contact Snippets if provided */}
                  {(leader.email || leader.phone) && (
                    <div className="space-y-1 text-[11px] text-slate-500 pt-1">
                      {leader.email && (
                        <div className="flex items-center space-x-1.5 truncate">
                          <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{leader.email}</span>
                        </div>
                      )}
                      {leader.phone && (
                        <div className="flex items-center space-x-1.5 truncate">
                          <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                          <span className="truncate">{leader.phone}</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Footer: Edit Info, Active/Inactive Toggle, and Delete */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-1.5">
                    
                    {/* 1. Edit Info Button */}
                    <button
                      onClick={() => handleOpenEdit(leader)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit Info</span>
                    </button>

                    {/* Right-aligned cluster: Status Toggle + Delete */}
                    <div className="flex items-center space-x-1.5">
                      
                      {/* 2. Active / Inactive Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(leader)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                          isActive
                            ? 'bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-300 shadow-xs'
                            : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                        }`}
                        title={`Click to mark as ${isActive ? 'Inactive' : 'Active'}`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                        <span>{isActive ? 'Active' : 'Inactive'}</span>
                      </button>

                      {/* 3. Delete Button */}
                      <button
                        disabled={isDeleting}
                        onClick={() => handleDelete(leader.id, leader.name)}
                        className="inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-bold text-rose-500 hover:text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
                        title="Delete leader"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>{isDeleting ? '...' : 'Delete'}</span>
                      </button>

                    </div>

                  </div>

                </div>
              </div>
            );
          })}
        </div>
      ) : (

        /* === TABLE VIEW === */
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50/80 text-slate-500 uppercase font-mono text-[10px] tracking-wider border-b border-slate-200/80">
                <tr>
                  <th className="py-3.5 px-4 w-12 text-center">#</th>
                  <th className="py-3.5 px-4 w-16">Photo</th>
                  <th className="py-3.5 px-4 min-w-[200px]">Leader Name & Designation</th>
                  <th className="py-3.5 px-4">Role / Category</th>
                  <th className="py-3.5 px-4 min-w-[150px]">Contact Info</th>
                  <th className="py-3.5 px-4 text-center">Status Toggle</th>
                  <th className="py-3.5 px-4 text-center w-28">Order</th>
                  <th className="py-3.5 px-4 text-right min-w-[140px]">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-sans">
                {filteredLeaders.map((leader, index) => {
                  const photoUrl = leader.assetPath || leader.imageUrl || '/assets/images/leadership/anand-c.jpg';
                  const isActive = leader.status === 'active' || leader.status === 'published' || !leader.status;

                  return (
                    <tr key={leader.id || index} className={`hover:bg-slate-50/70 transition-colors ${!isActive ? 'bg-amber-50/20' : ''}`}>
                      
                      <td className="py-3 px-4 text-center font-mono text-slate-400 text-[11px]">
                        {leader.order || index + 1}
                      </td>

                      <td className="py-3 px-4">
                        <img 
                          src={photoUrl} 
                          alt={leader.name} 
                          className={`w-10 h-12 object-cover rounded-lg border border-slate-200 ${!isActive ? 'grayscale-30' : ''}`}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = '/assets/images/campus/intro_heritage_building.jpg';
                          }}
                        />
                      </td>

                      <td className="py-3 px-4">
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-900 block text-sm font-serif">
                            {leader.name}
                          </span>
                          <span className="text-xs text-[#a88530] font-semibold block">
                            {leader.designation}
                          </span>
                          {leader.qualifications && (
                            <span className="text-[11px] text-slate-400 block italic">
                              {leader.qualifications}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                          {leader.role || 'Administration'}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-[11px] text-slate-500">
                        {leader.email && <div className="truncate">{leader.email}</div>}
                        {leader.phone && <div>{leader.phone}</div>}
                        {!leader.email && !leader.phone && <span className="text-slate-400 italic">Not set</span>}
                      </td>

                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(leader)}
                          className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            isActive
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                          }`}
                          title={`Click to mark as ${isActive ? 'Inactive' : 'Active'}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                          <span>{isActive ? 'Active' : 'Inactive'}</span>
                        </button>
                      </td>

                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            disabled={index === 0}
                            onClick={() => handleMoveOrder(index, 'up')}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-20 cursor-pointer"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono text-xs text-slate-600 font-bold px-1">
                            {leader.order || index + 1}
                          </span>
                          <button
                            disabled={index === filteredLeaders.length - 1}
                            onClick={() => handleMoveOrder(index, 'down')}
                            className="p-1 rounded hover:bg-slate-100 text-slate-500 disabled:opacity-20 cursor-pointer"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center space-x-1.5">
                          
                          {/* Edit */}
                          <button
                            onClick={() => handleOpenEdit(leader)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 transition-colors cursor-pointer"
                            title="Edit Leader"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          {/* Quick Status Toggle */}
                          <button
                            onClick={() => handleToggleStatus(leader)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isActive 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100' 
                                : 'bg-amber-50 text-amber-800 border-amber-200 hover:bg-amber-100'
                            }`}
                            title={`Click to set ${isActive ? 'Inactive' : 'Active'}`}
                          >
                            <Power className="w-3.5 h-3.5" />
                          </button>

                          {/* Delete */}
                          <button
                            onClick={() => handleDelete(leader.id, leader.name)}
                            className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 transition-colors cursor-pointer"
                            title="Delete Leader"
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
      )}

      {/* ================= MODAL: ADD / EDIT LEADER ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl space-y-6 max-h-[92vh] overflow-y-auto my-auto text-slate-800">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-[#a88530] uppercase tracking-wider block font-bold">
                  Administration CMS Editor
                </span>
                <h3 className="font-extrabold text-2xl text-slate-900 tracking-tight font-serif">
                  {editingLeader ? `Edit: ${editingLeader.name}` : 'Add New Leader / Academic Head'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Row 1: Full Name & Official Designation */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Full Name with Honorific *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Ravi J.D. Saldanha"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Official Designation *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Principal / Dean of Academic Affairs / IQAC Coordinator"
                    value={formData.designation}
                    onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  />
                </div>
              </div>

              {/* Row 2: Role Category & Academic Qualifications */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Role / Governance Category</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] bg-white"
                  >
                    <option value="Executive">Executive Administration (Rector, Principal, Finance Officer)</option>
                    <option value="Academics">Academics (Deans, HODs, Academic Council)</option>
                    <option value="Quality Assurance">Quality Assurance (IQAC, NAAC, NIRF)</option>
                    <option value="Postgraduate">Postgraduate Studies & Research</option>
                    <option value="Management">Management & Governing Body</option>
                    <option value="Administration">General Administration & Officers</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Academic Qualifications / Degrees</label>
                  <input
                    type="text"
                    placeholder="e.g. M.Sc., Ph.D., Post-Doctoral Fellow"
                    value={formData.qualifications}
                    onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  />
                </div>
              </div>

              {/* Row 3: Portrait Photo URL & Preset Selector */}
              <div className="space-y-2 p-4 bg-slate-50 rounded-2xl border border-slate-200/80">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 flex items-center space-x-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#a88530]" />
                    <span>Portrait Photo URL / Asset Path</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">Suggested 3:4 or 4:5 ratio</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  {/* Photo Preview */}
                  <div className="w-20 h-24 bg-slate-900 rounded-xl overflow-hidden shrink-0 border-2 border-[#C9A84C]/50 shadow-xs relative">
                    <img 
                      src={formData.assetPath} 
                      alt="Preview" 
                      style={{ objectPosition: formData.objectPosition }}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = '/assets/images/campus/intro_heritage_building.jpg';
                      }}
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="text"
                      placeholder="/assets/images/leadership/your-photo.jpg or https://..."
                      value={formData.assetPath}
                      onChange={(e) => setFormData({ ...formData, assetPath: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] font-mono"
                    />

                    {/* Quick Preset Selector */}
                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] text-slate-500 font-bold uppercase shrink-0">Preset:</span>
                      <select
                        onChange={(e) => e.target.value && setFormData({ ...formData, assetPath: e.target.value })}
                        className="text-[11px] py-1 px-2 rounded-lg border border-slate-200 bg-white text-slate-600 focus:outline-none"
                        defaultValue=""
                      >
                        <option value="" disabled>Choose existing campus asset...</option>
                        {PHOTO_PRESETS.map((p, idx) => (
                          <option key={idx} value={p.path}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Object Position Alignment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Portrait Object Position (Face Alignment)</label>
                    <select
                      value={formData.objectPosition}
                      onChange={(e) => setFormData({ ...formData, objectPosition: e.target.value })}
                      className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-none"
                    >
                      {OBJECT_POSITIONS.map((o, idx) => (
                        <option key={idx} value={o.value}>{o.label}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-semibold text-slate-600">Dedicated Message Link (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. /leadership/principal or /leadership/rector"
                      value={formData.link}
                      onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                      className="w-full text-xs py-1.5 px-2.5 rounded-lg border border-slate-200 font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Row 4: Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Official Email</label>
                  <input
                    type="email"
                    placeholder="e.g. principal@stphilos.ac.in"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Office Phone / Extension</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 821 4001900 Ext. 101"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C]"
                  />
                </div>
              </div>

              {/* Row 5: Executive Biography / Profile Description */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700">Biography / Executive Overview</label>
                <textarea
                  rows={3}
                  placeholder="Provide a concise summary of their leadership role, institutional responsibilities, and achievements..."
                  value={formData.biography}
                  onChange={(e) => setFormData({ ...formData, biography: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] leading-relaxed"
                />
              </div>

              {/* Row 6: Order & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Display Order (Rank)</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] font-mono"
                  />
                  <span className="text-[10px] text-slate-400">Lower numbers appear first on the public website.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Display Status (Active / Inactive)</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#C9A84C] bg-white font-semibold"
                  >
                    <option value="active">Active (Visible on Public Website)</option>
                    <option value="inactive">Inactive (Hidden from Website)</option>
                  </select>
                </div>
              </div>

              {/* Modal Footer Buttons */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 rounded-xl bg-[#071A33] hover:bg-[#0c284e] text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center space-x-2"
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#FFD84A]" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FFD84A]" />
                      <span>{editingLeader ? 'Update Leader' : 'Add to Leadership'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
