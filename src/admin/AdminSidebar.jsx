import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Calendar, FileText, Users, Building2, 
  Image as ImageIcon, FolderGit2, Settings, ShieldCheck, LogOut, 
  ExternalLink, ChevronDown, Sparkles, X, ChevronRight
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
    { label: "Dashboard", path: "/admin", match: (p) => p === '/admin' },
    { label: "Pages & Menu", path: "/admin/pages", match: (p) => p.startsWith('/admin/pages') || p.startsWith('/admin/menus') },
    { label: "Events & Notices", path: "/admin/events", match: (p) => p.startsWith('/admin/events') || p.startsWith('/admin/notices') },
    { label: "Academics", path: "/admin/programmes", match: (p) => p.startsWith('/admin/programmes') || p.startsWith('/admin/faculty') },
    { label: "Departments", path: isHOD ? "/admin/department-portal" : "/admin/departments", match: (p) => p.startsWith('/admin/departments') || p.startsWith('/admin/department-portal') },
    { label: "Media & Sliders", path: "/admin/gallery", match: (p) => p.startsWith('/admin/gallery') || p.startsWith('/admin/sliders') || p.startsWith('/admin/media') },
    { label: "Documents", path: "/admin/documents", match: (p) => p.startsWith('/admin/documents') || p.startsWith('/admin/iqac') },
    { label: "Users & Roles", path: "/admin/users", match: (p) => p.startsWith('/admin/users') || p.startsWith('/admin/logs') },
    { label: "Settings", path: "/admin/settings", match: (p) => p === '/admin/settings' || p.startsWith('/admin/archive-status') || p.startsWith('/admin/verification') }
  ];

  const quickShortcuts = [
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
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed lg:static top-0 bottom-0 left-0 z-50
        w-72 sm:w-80 bg-[#121316] text-white flex flex-col justify-between
        p-7 sm:p-9 transition-transform duration-300 ease-in-out shrink-0
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        
        {/* Top: Profile Card matching screenshot */}
        <div className="space-y-8">
          
          {/* Close button for mobile */}
          <div className="flex justify-between items-center lg:hidden -mt-2 -mr-2">
            <span className="text-xs font-bold text-zinc-400 tracking-wider uppercase">Metronic CMS</span>
            <button 
              onClick={() => setMobileOpen(false)}
              className="p-2 text-zinc-400 hover:text-white rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Avatar + Notification Badge + Name & Email */}
          <div className="flex flex-col items-start pt-2">
            <div className="relative mb-4">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80"
                alt="Profile Avatar"
                className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white/10 shadow-lg"
              />
              {/* Red notification pill matching screenshot */}
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-[#eb4848] text-white text-[11px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-[#121316] shadow-sm animate-pulse">
                4
              </span>
            </div>

            <h2 className="text-xl font-extrabold text-white tracking-tight">
              {user?.name || 'Samantha'}
            </h2>
            <p className="text-xs text-[#71717a] font-medium tracking-tight mt-0.5">
              {user?.email || 'samantha@email.com'}
            </p>
            {isHOD && userDepartmentName && (
              <span className="mt-2 inline-block px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-300 text-[10px] font-bold border border-amber-500/20">
                {userDepartmentName}
              </span>
            )}
          </div>

          {/* Minimalist Bold Navigation matching reference design */}
          <nav className="space-y-5 pt-2">
            {navItems.map((item, idx) => {
              const isActive = item.match(location.pathname);
              return (
                <div key={idx}>
                  <Link
                    to={item.path}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className={`block transition-all duration-150 tracking-tight text-left ${
                      isActive
                        ? 'text-white font-extrabold text-[19px] sm:text-[20px]'
                        : 'text-[#71717a] hover:text-white font-medium text-[19px] sm:text-[20px]'
                    }`}
                  >
                    {item.label}
                  </Link>
                </div>
              );
            })}
          </nav>

          {/* Expandable Quick Shortcuts for nested managers */}
          <div className="pt-2">
            <button
              onClick={() => setShowSubMenu(!showSubMenu)}
              className="flex items-center text-xs font-semibold text-[#8e9099] hover:text-white transition-colors cursor-pointer space-x-1.5"
            >
              <span>All CMS Modules</span>
              <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showSubMenu ? 'rotate-180' : ''}`} />
            </button>
            {showSubMenu && (
              <div className="mt-2.5 pl-2 space-y-1.5 border-l border-zinc-800">
                {quickShortcuts.map((q, qIdx) => (
                  <Link
                    key={qIdx}
                    to={q.path}
                    onClick={() => setMobileOpen && setMobileOpen(false)}
                    className="block text-[12px] text-zinc-400 hover:text-white transition-colors"
                  >
                    {q.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Utility Actions */}
        <div className="pt-8 border-t border-zinc-800/80 space-y-3">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 hover:text-white text-xs font-semibold transition-all border border-zinc-800"
          >
            <span className="flex items-center space-x-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Public Website</span>
            </span>
            <ExternalLink className="w-3.5 h-3.5 text-zinc-500" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition-all cursor-pointer"
          >
            <span className="flex items-center space-x-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </span>
          </button>
        </div>

      </aside>
    </>
  );
}
