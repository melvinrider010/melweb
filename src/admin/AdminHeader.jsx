import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, LogOut, Building2 } from 'lucide-react';
import { useAuth } from '../lib/authContext';

export default function AdminHeader() {
  const { user, isHOD, userDepartmentName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 px-6 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
      
      {/* Search Bar / Active Context */}
      <div className="flex items-center space-x-3">
        {isHOD && userDepartmentName ? (
          <div className="flex items-center space-x-2 text-xs font-bold text-[#0B1F4E] bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200/80 shadow-2xs">
            <Building2 className="w-4 h-4 text-[#a88530]" />
            <span>Scope: {userDepartmentName}</span>
          </div>
        ) : (
          <div className="relative w-64 sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search CMS datasets, files, faculty..."
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1C5496]"
            />
          </div>
        )}
      </div>

      {/* Admin Quick Profile & Logout */}
      <div className="flex items-center space-x-4">
        <div className="hidden md:flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Role: {user?.role || 'Administrator'}</span>
        </div>

        <div className="flex items-center space-x-3 border-l pl-4 border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#0B1F4E] text-[#FFD84A] flex items-center justify-center text-xs font-bold shadow-xs border border-[#C9A84C]/40">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-bold text-[#071A33] truncate max-w-[180px]">{user?.name || 'Administrator'}</span>
            <span className="block text-[10px] text-slate-500 truncate max-w-[180px]">{user?.email || 'admin@stphilos.ac.in'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-1 cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </header>
  );
}
