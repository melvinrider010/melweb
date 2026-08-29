import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../lib/authContext';

export default function AdminHeader() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-slate-200 px-8 py-4 flex items-center justify-between shadow-xs">
      
      {/* Search Bar */}
      <div className="relative w-72">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Search CMS datasets, files, faculty..."
          className="w-full pl-9 pr-4 py-1.5 bg-slate-100 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-[#1C5496]"
        />
      </div>

      {/* Admin Quick Profile & Logout */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>System Status: Verified Live</span>
        </div>

        <div className="flex items-center space-x-3 border-l pl-4 border-slate-200">
          <div className="w-8 h-8 rounded-full bg-[#1C5496] text-white flex items-center justify-center text-xs font-bold shadow-sm">
            {user?.name ? user.name.charAt(0) : 'A'}
          </div>
          <div className="text-left hidden sm:block">
            <span className="block text-xs font-bold text-[#071A33]">{user?.name || 'Administrator'}</span>
            <span className="block text-[10px] text-slate-500">{user?.email || 'admin@stphilos.ac.in'}</span>
          </div>

          <button
            onClick={handleLogout}
            className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors ml-2"
            title="Sign Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

    </header>
  );
}
