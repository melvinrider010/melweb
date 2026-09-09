import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  UserCheck, 
  ShieldCheck, 
  History, 
  Building2, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Key, 
  CheckCircle2, 
  ExternalLink,
  Lock,
  Copy,
  Check
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';

export default function AdminUserManagerPage() {
  const users = useCms(() => cmsStore.getUsers());
  const departments = useCms(() => cmsStore.getDepartments());

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [copiedEmail, setCopiedEmail] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    role: 'HOD_DEPARTMENT',
    departmentId: 'dept-bca',
    status: 'Active'
  });

  const filteredUsers = users.filter(u => {
    const matchesSearch = (
      (u.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.departmentName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleCopyEmail = (email) => {
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(''), 3000);
  };

  const handleOpenAdd = () => {
    setEditingUser(null);
    setFormData({
      id: '',
      name: '',
      email: '',
      role: 'HOD_DEPARTMENT',
      departmentId: departments[0]?.id || 'dept-bca',
      status: 'Active'
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (u) => {
    setEditingUser(u);
    setFormData({
      id: u.id || '',
      name: u.name || '',
      email: u.email || '',
      role: u.role || 'HOD_DEPARTMENT',
      departmentId: u.departmentId || departments[0]?.id || 'dept-bca',
      status: u.status || 'Active'
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const deptObj = departments.find(d => d.id === formData.departmentId);
    await cmsStore.saveUser({
      ...formData,
      departmentName: formData.role === 'HOD_DEPARTMENT' ? (deptObj?.name || 'Department') : null
    });
    setIsModalOpen(false);
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to remove user account "${name}"?`)) {
      await cmsStore.deleteUser(id);
    }
  };

  return (
    <div className="space-y-8">
      
      {/* 1. HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              Access Control & Auth
            </span>
            <span className="text-slate-400 text-xs font-sans">
              {users.length} Authorized Accounts
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191d28] tracking-tight">
            Users, HOD Accounts & Access Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Manage institutional administrators and specific departmental HOD login accounts with role-based access scopes.
          </p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs inline-flex items-center space-x-2 cursor-pointer transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Provision New User / HOD</span>
        </button>
      </div>

      {/* 2. CREDENTIALS DIRECTORY BANNER */}
      <div className="bg-slate-50/80 border border-slate-200/80 p-5 rounded-2xl shadow-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-slate-700" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#191d28]">Departmental Access Control</span>
          </div>
          <p className="text-xs text-slate-500">
            Department heads authenticate via their institutional email. Passwords are encrypted on the server and never stored in plain text.
          </p>
        </div>
        <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl shrink-0">
          24 Academic HODs Active
        </span>
      </div>

      {/* 3. FILTERS & SEARCH */}
      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl flex flex-col sm:flex-row gap-4 justify-between items-center shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-slate-900"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-bold">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:border-slate-900 focus:bg-white"
          >
            <option value="all">All Roles ({users.length})</option>
            <option value="SUPER_ADMIN">Super Admins</option>
            <option value="HOD_DEPARTMENT">Department HODs</option>
            <option value="IQAC_MANAGER">IQAC Coordinators</option>
            <option value="ACADEMIC_MANAGER">Academic Editors</option>
          </select>
        </div>
      </div>

      {/* 4. USERS TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="p-4 bg-slate-50/80 border-b border-slate-200/80 font-bold text-sm text-[#191d28] flex items-center justify-between">
          <span>Active User Directory & Department Associations ({filteredUsers.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase font-mono text-[10px] tracking-wider">
              <tr>
                <th className="p-4">User Name</th>
                <th className="p-4">Login Email</th>
                <th className="p-4">Role & Scope</th>
                <th className="p-4">Assigned Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredUsers.map((u) => {
                const isHodUser = u.role === 'HOD_DEPARTMENT';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="p-4 font-bold text-[#191d28]">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 border border-slate-200 text-slate-800 flex items-center justify-center font-bold text-[11px]">
                          {u.name?.charAt(0) || 'U'}
                        </div>
                        <span>{u.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-700 font-mono font-medium">
                      <div className="flex items-center space-x-1.5">
                        <span>{u.email}</span>
                        <button
                          onClick={() => handleCopyEmail(u.email)}
                          className="text-slate-400 hover:text-slate-800 p-1 rounded transition-colors cursor-pointer"
                          title="Copy email address"
                        >
                          {copiedEmail === u.email ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full font-bold font-mono text-[10px] uppercase tracking-wider ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-[#18191f] text-white'
                          : u.role === 'HOD_DEPARTMENT'
                          ? 'bg-slate-100 text-slate-700 border border-slate-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700">
                      {isHodUser && u.departmentId ? (
                        <Link
                          to={`/admin/department-portal?deptId=${u.departmentId}`}
                          className="font-semibold text-slate-900 hover:underline inline-flex items-center space-x-1"
                        >
                          <Building2 className="w-3.5 h-3.5 text-slate-500" />
                          <span>{u.departmentName || u.departmentId}</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic">Universal Site Oversight</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        ● {u.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                          title="Edit Account"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {u.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL: ADD / EDIT USER */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200 text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-xl text-[#191d28]">
                {editingUser ? 'Edit User Account' : 'Provision New HOD / Administrator'}
              </h3>
              <button 
                onClick={() => setIsModalOpen(false)} 
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Full Name / Designation *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. HOD - Physics"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Login Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="hod.physics@stphilos.ac.in"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-mono focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role Type *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
                  >
                    <option value="HOD_DEPARTMENT">Head of Department (HOD)</option>
                    <option value="SUPER_ADMIN">Super Administrator</option>
                    <option value="IQAC_MANAGER">IQAC Coordinator</option>
                    <option value="ACADEMIC_MANAGER">Academic Editor</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Account Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-semibold focus:outline-none focus:border-slate-900 focus:bg-white"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {formData.role === 'HOD_DEPARTMENT' && (
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Department Scope *</label>
                  <select
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:border-slate-900 focus:bg-white"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.shortName || d.code})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#18191f] hover:bg-black text-white px-5 py-2 rounded-xl font-bold shadow-xs cursor-pointer transition-all"
                >
                  Save Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
