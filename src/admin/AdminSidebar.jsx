import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Calendar, FileText, Users, Building2, 
  Image as ImageIcon, FolderGit2, Settings, ShieldCheck, LogOut, 
  ExternalLink, ChevronDown, Sparkles, X, ChevronRight, Layers, Bell, PanelTop
} from 'lucide-react';
import { useAuth } from '../lib/authContext';

export default function AdminSidebar({ mobileOpen, setMobileOpen }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isHOD, userDepartmentName, logout } = useAuth();
  const [showSubMenu, setShowSubMenu] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard, match: (p) => p === '/admin' },
    { label: "Pages & Menu", path: "/admin/pages", icon: Layers, match: (p) => p.startsWith('/admin/pages') || p.startsWith('/admin/menus') },
    { label: "Header & Footer", path: "/admin/header-footer", icon: PanelTop, match: (p) => p.startsWith('/admin/header-footer') || p.startsWith('/admin/layout') },
    { label: "Events & Notices", path: "/admin/events", icon: Calendar, match: (p) => p.startsWith('/admin/events') || p.startsWith('/admin/notices') },
    { label: "Academics", path: "/admin/programmes", icon: BookOpen, match: (p) => p.startsWith('/admin/programmes') || p.startsWith('/admin/faculty') },
    { label: "Departments", path: isHOD ? "/admin/department-portal" : "/admin/departments", icon: Building2, match: (p) => p.startsWith('/admin/departments') || p.startsWith('/admin/department-portal') },
    { label: "Media & Sliders", path: "/admin/gallery", icon: ImageIcon, match: (p) => p.startsWith('/admin/gallery') || p.startsWith('/admin/sliders') || p.startsWith('/admin/media') },
    { label: "Documents", path: "/admin/documents", icon: FileText, match: (p) => p.startsWith('/admin/documents') || p.startsWith('/admin/iqac') },
    { label: "Users & Roles", path: "/admin/users", icon: Users, match: (p) => p.startsWith('/admin/users') || p.startsWith('/admin/logs') },
    { label: "Settings", path: "/admin/settings", icon: Settings, match: (p) => p === '/admin/settings' || p.startsWith('/admin/archive-status') || p.startsWith('/admin/verification') }
  ];

  const quickShortcuts = [
    { label: "Header & Footer", path: "/admin/header-footer" },
    { label: "Hero Sliders", path: "/admin/sliders" },
    { label: "Menu Editor", path: "/admin/menus" },
    { label: "Notice Board", path: "/admin/notices" },
    { label: "Faculty Hub", path: "/admin/faculty" },
    { label: "Alumni Directory", path: "/admin/alumni" },
    { label: "IQAC Documents", path: "/admin/iqac" },
    { label: "Data Verification", path: "/admin/verification" },
    { label: "Archive Audit", path: "/admin/archive-status" }
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container matching deep violet/indigo frosted glass */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-64 sm:w-72 bg-gradient-to-b from-[#342456] via-[#281C44] to-[#1A1230] text-white flex flex-col justify-between h-full overflow-hidden
        px-4 sm:px-5 py-5 transition-transform duration-300 ease-in-out shrink-0 border-r border-white/10
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Top & Navigation Section */}
        <div className="space-y-4 overflow-y-auto no-scrollbar">
          
          {/* Close button for mobile */}
          <div className="flex justify-between items-center lg:hidden -mt-1 -mr-1">
            <span className="text-[11px] font-bold text-white/60 tracking-wider uppercase">Navigation</span>
            <button 
              onClick={() => setMobileOpen(false)}
              className="p-1.5 text-white/60 hover:text-white rounded-lg cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* College Header: Wide Logo & Centered Text Details */}
          <div className="space-y-2 pb-3 border-b border-white/10 text-center">
            <div className="flex justify-center">
              <img
                src="/assets/images/logo/dashboard_college_logo.png"
                alt="St. Philomena's College Logo"
                className="h-10 sm:h-11 w-auto max-w-full object-contain mx-auto filter drop-shadow-md brightness-105"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = "/assets/images/logo/college-logo.png";
                }}
              />
            </div>
            <div className="text-center">
              <h2 className="text-xs sm:text-[13px] font-extrabold text-white tracking-tight leading-snug">
                St. Philomena's College
              </h2>
              <p className="text-[10px] text-white/60 font-medium tracking-tight mt-0.5">
                (Autonomous), Mysuru · Est. 1946
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-1">
            {navItems.map((item) => {
              const active = item.match(location.pathname);
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs font-semibold transition-all duration-200
                    ${active 
                      ? 'bg-[#4871FF] text-white shadow-[0_4px_18px_rgba(72,113,255,0.45)]' 
                      : 'text-white/70 hover:text-white hover:bg-white/10'
                    }
                  `}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${active ? 'text-white' : 'text-white/60'}`} />
                  <span className="truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Collapsible Quick Shortcuts Drawer */}
          <div className="pt-2 border-t border-white/10">
            <button
              onClick={() => setShowSubMenu(!showSubMenu)}
              className="w-full flex items-center justify-between px-4 py-2 text-white/60 hover:text-white text-xs font-semibold rounded-xl hover:bg-white/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px] font-bold uppercase tracking-wider">Quick Actions</span>
              </div>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${showSubMenu ? 'rotate-180' : ''}`} />
            </button>

            {showSubMenu && (
              <div className="mt-1 space-y-0.5 pl-3 pr-1 py-1 bg-white/5 rounded-xl animate-fadeIn">
                {quickShortcuts.map((sc) => (
                  <Link
                    key={sc.path}
                    to={sc.path}
                    onClick={() => setMobileOpen(false)}
                    className="block px-3 py-1.5 text-[11px] text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors truncate"
                  >
                    {sc.label}
                  </Link>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom User Card Profile Pill */}
        <div className="pt-4 border-t border-white/10 space-y-3">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/15 flex items-center justify-between shadow-xs">
            <div className="flex items-center space-x-2.5 min-w-0">
              <div className="relative shrink-0">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80"
                  alt={user?.name || "Admin User"}
                  className="w-8 h-8 rounded-full object-cover ring-1 ring-white/30"
                />
                <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-amber-400 text-slate-950 font-mono text-[8px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  4
                </span>
              </div>
              <div className="min-w-0 pr-1">
                <p className="text-xs font-bold text-white truncate">
                  {user?.name || 'Administrator'}
                </p>
                <p className="text-[10px] text-white/60 font-medium truncate">
                  {isHOD && userDepartmentName ? userDepartmentName : (user?.role || 'Super Admin')}
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-white/50 hover:text-rose-300 hover:bg-rose-500/20 rounded-lg transition-colors cursor-pointer shrink-0"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-between text-[10px] text-white/40 px-1 font-mono">
            <span>St. Philomena's College</span>
            <span>v2.6 Live</span>
          </div>
        </div>

      </aside>
    </>
  );
}
