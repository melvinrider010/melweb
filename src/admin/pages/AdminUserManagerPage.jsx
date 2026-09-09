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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl text-slate-900">Users, HOD Accounts & Access Control</h1>
          <p className="text-xs text-slate-500">Manage institutional administrators and specific departmental HOD login accounts.</p>
        </div>
        <button
          onClick={handleOpenAdd}
          className="btn-navy px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 shadow-xs cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-[#FFD84A]" />
          <span>Provision New User / HOD</span>
        </button>
      </div>

      {/* 2. CREDENTIALS DIRECTORY BANNER */}
      <div className="bg-gradient-to-r from-[#061230] via-[#0B1F4E] to-[#091B42] text-white p-5 sm:p-6 rounded-2xl shadow-sm border-l-4 border-[#C9A84C] flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Lock className="w-4 h-4 text-[#F0D98C]" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#F0D98C]">Departmental Access Control</span>
          </div>
          <p className="text-xs text-slate-200">
            Department heads authenticate via their institutional email. Passwords are encrypted on the server and never stored in plain text.
          </p>
        </div>
        <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-mono font-bold px-3 py-1.5 rounded-xl shrink-0">
          24 Academic HODs Active
        </span>
      </div>

      {/* 3. FILTERS & SEARCH */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by name, email, department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-[#1C5496] shadow-2xs"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-bold">Filter Role:</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="p-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:border-[#1C5496] shadow-2xs"
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
      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="p-4 border-b font-bold text-sm text-slate-900 flex items-center justify-between">
          <span>Active User Directory & Department Associations ({filteredUsers.length})</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b text-slate-500 font-bold uppercase text-[10px] tracking-wider">
                <th className="p-4">User Name</th>
                <th className="p-4">Login Email</th>
                <th className="p-4">Role & Scope</th>
                <th className="p-4">Assigned Department</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((u) => {
                const isHodUser = u.role === 'HOD_DEPARTMENT';

                return (
                  <tr key={u.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 font-bold text-slate-900">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-[#0B1F4E] text-[#FFD84A] flex items-center justify-center font-bold text-[11px]">
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
                          className="text-slate-400 hover:text-[#1C5496] p-1 rounded"
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
                      <span className={`px-2.5 py-1 rounded-md font-bold text-[10px] uppercase tracking-wider ${
                        u.role === 'SUPER_ADMIN'
                          ? 'bg-purple-100 text-purple-800 border border-purple-200'
                          : u.role === 'HOD_DEPARTMENT'
                          ? 'bg-blue-100 text-blue-900 border border-blue-200'
                          : 'bg-amber-100 text-amber-900 border border-amber-200'
                      }`}>
                        {u.role.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700">
                      {isHodUser && u.departmentId ? (
                        <Link
                          to={`/admin/department-portal?deptId=${u.departmentId}`}
                          className="font-semibold text-[#1C5496] hover:underline inline-flex items-center space-x-1"
                        >
                          <Building2 className="w-3.5 h-3.5" />
                          <span>{u.departmentName || u.departmentId}</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic">Universal Site Oversight</span>
                      )}
                    </td>
                    <td className="p-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        ● {u.status || 'Active'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="p-1.5 rounded-lg text-slate-600 hover:bg-slate-200"
                          title="Edit Account"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        {u.role !== 'SUPER_ADMIN' && (
                          <button
                            onClick={() => handleDelete(u.id, u.name)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-5 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-slate-900">
                {editingUser ? 'Edit User Account' : 'Provision New HOD / Administrator'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">✕</button>
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#1C5496]"
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
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-mono focus:outline-none focus:border-[#1C5496]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role Type *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#1C5496]"
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
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 font-semibold focus:outline-none focus:border-[#1C5496]"
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
                    className="w-full p-2.5 bg-blue-50 border border-blue-300 rounded-lg text-[#0B1F4E] font-bold focus:outline-none focus:border-[#1C5496]"
                  >
                    {departments.map(d => (
                      <option key={d.id} value={d.id}>{d.name} ({d.shortName || d.code})</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-navy px-5 py-2 rounded-lg font-bold"
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
