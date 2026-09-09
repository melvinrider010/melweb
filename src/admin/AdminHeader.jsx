import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ShieldCheck, LogOut, Building2, Menu, Sparkles, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../lib/authContext';

export default function AdminHeader({ onToggleMobileMenu }) {
  const { user, isHOD, userDepartmentName, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="px-6 sm:px-8 pt-6 pb-4 flex items-center justify-between border-b border-slate-100/80 bg-white">
      
      {/* Left: Mobile Toggle & Search / Scope */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        {/* Mobile Menu Button */}
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 lg:hidden cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Brand Logo */}
        <img
          src="/assets/images/logo/dashboard_college_logo.png"
          alt="St. Philomena's College"
          className="h-7 sm:h-8 w-auto object-contain lg:hidden"
        />

        {isHOD && userDepartmentName ? (
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-[#0B1F4E] bg-amber-50 px-3.5 py-2 rounded-full border border-amber-200/80 shadow-2xs">
            <Building2 className="w-4 h-4 text-amber-600" />
            <span>Scope: {userDepartmentName}</span>
          </div>
        ) : (
          <div className="hidden sm:block relative w-52 sm:w-72 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search pages, files, events..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200/70 focus:border-blue-500 rounded-full text-xs font-medium focus:outline-none transition-all"
            />
          </div>
        )}
      </div>

      {/* Right: Live Sync Badge & Admin Indicator */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/80 px-3.5 py-1.5 rounded-full border border-emerald-200/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Sync Active</span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-slate-100/80 px-3 py-1.5 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden md:inline">{user?.role || 'College Admin'}</span>
        </div>
      </div>

    </header>
  );
}
