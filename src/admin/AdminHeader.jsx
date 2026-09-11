import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, ShieldCheck, LogOut, Building2, Menu, Sparkles, CheckCircle2, ChevronRight, Bell } from 'lucide-react';
import { useAuth } from '../lib/authContext';

export default function AdminHeader({ onToggleMobileMenu }) {
  const { user, isHOD, userDepartmentName, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="px-6 sm:px-8 py-3.5 flex items-center justify-between border-b border-white/50 bg-white/30 backdrop-blur-md">
      
      {/* Left: Mobile Menu Toggle & Search Pill */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 text-slate-700 hover:text-slate-900 rounded-xl hover:bg-white/60 lg:hidden cursor-pointer"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <img
          src="/assets/images/logo/dashboard_college_logo.png"
          alt="St. Philomena's College"
          className="h-7 sm:h-8 w-auto object-contain lg:hidden"
        />

        {isHOD && userDepartmentName ? (
          <div className="hidden sm:flex items-center space-x-2 text-xs font-bold text-indigo-900 bg-indigo-50/80 px-3.5 py-1.5 rounded-full border border-indigo-200/80 shadow-xs">
            <Building2 className="w-4 h-4 text-indigo-600" />
            <span>Scope: {userDepartmentName}</span>
          </div>
        ) : (
          <div className="hidden sm:block relative w-56 sm:w-72 md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search content, pages, files..."
              className="w-full pl-10 pr-4 py-2 bg-white/60 hover:bg-white/90 focus:bg-white border border-white/80 focus:border-indigo-400 rounded-full text-xs font-medium focus:outline-none transition-all shadow-xs"
            />
          </div>
        )}
      </div>

      {/* Right: Live Sync Badge, Live Site link, & Admin Role */}
      <div className="flex items-center space-x-3 sm:space-x-4">
        <div className="hidden sm:flex items-center space-x-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50/90 px-3.5 py-1.5 rounded-full border border-emerald-200/70 shadow-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          <span>Live Sync Active</span>
        </div>

        <Link
          to="/"
          target="_blank"
          className="hidden md:inline-flex items-center space-x-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100/80 px-3.5 py-1.5 rounded-full border border-indigo-200/60 transition-colors shadow-xs"
        >
          <span>Live Portal</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </Link>

        <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 bg-white/70 px-3 py-1.5 rounded-full border border-white/80 shadow-xs">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
          <span className="hidden md:inline">{user?.role || 'College Admin'}</span>
        </div>
      </div>

    </header>
  );
}
