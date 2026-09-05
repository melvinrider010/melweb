import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Sliders, FileText, Calendar, Image as ImageIcon, 
  GraduationCap, Users, Building2, Award, ShieldCheck, FolderGit2, 
  Settings, UserCheck, History, Archive, CheckCircle2, Sparkles, Layers,
  BookOpen, HelpCircle, MessageSquare, HeartHandshake, ArrowRight
} from 'lucide-react';
import { useAuth } from '../lib/authContext';

export default function AdminSidebar() {
  const location = useLocation();
  const { user, isSuperAdmin, isHOD, userDepartmentId, userDepartmentName } = useAuth();

  // Navigation menu tailored for HODs vs Super Admins
  const hodMenuSections = [
    {
      title: "DEPARTMENT PORTAL",
      items: [
        { label: "Department Overview", path: "/admin/department-portal?tab=overview", icon: Building2, tabKey: "overview" },
        { label: "Syllabus & Regulations", path: "/admin/department-portal?tab=syllabus", icon: BookOpen, tabKey: "syllabus" },
        { label: "Faculty Directory", path: "/admin/department-portal?tab=faculty", icon: Users, tabKey: "faculty" },
        { label: "Department Documents", path: "/admin/department-portal?tab=documents", icon: FolderGit2, tabKey: "documents" }
      ]
    },
    {
      title: "CAMPUS FEEDS",
      items: [
        { label: "Department Notices", path: "/admin/notices", icon: FileText },
        { label: "Department Events", path: "/admin/events", icon: Calendar }
      ]
    }
  ];

  const adminMenuSections = [
    {
      title: "OVERVIEW",
      items: [
        { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
        { label: "Department Portal (HOD)", path: "/admin/department-portal", icon: Building2 }
      ]
    },
    {
      title: "CONTENT MANAGEMENT",
      items: [
        { label: "Hero Sliders", path: "/admin/sliders", icon: Sliders },
        { label: "Custom Pages", path: "/admin/pages", icon: BookOpen },
        { label: "Navigation Menus", path: "/admin/menus", icon: Layers },
        { label: "Notices & Announcements", path: "/admin/notices", icon: FileText },
        { label: "Campus Events", path: "/admin/events", icon: Calendar },
        { label: "Photo Gallery", path: "/admin/gallery", icon: ImageIcon }
      ]
    },
    {
      title: "ACADEMICS & FACULTY",
      items: [
        { label: "UG & PG Programmes", path: "/admin/programmes", icon: GraduationCap },
        { label: "Academic Departments", path: "/admin/departments", icon: Building2 },
        { label: "Faculty Directory", path: "/admin/faculty", icon: Users },
        { label: "Alumni Registrations", path: "/admin/alumni", icon: HeartHandshake }
      ]
    },
    {
      title: "QUALITY & REPOSITORY",
      items: [
        { label: "IQAC & NAAC Hub", path: "/admin/iqac", icon: Award },
        { label: "Media Library", path: "/admin/media", icon: ImageIcon },
        { label: "Documents Repository", path: "/admin/documents", icon: FolderGit2 }
      ]
    },
    {
      title: "SYSTEM & ACCESS",
      items: [
        { label: "Users & HOD Logins", path: "/admin/users", icon: UserCheck },
        { label: "Activity Logs", path: "/admin/logs", icon: History },
        { label: "System Settings", path: "/admin/settings", icon: Settings },
        { label: "Archive Status", path: "/admin/archive-status", icon: Archive },
        { label: "Data Verification", path: "/admin/verification", icon: CheckCircle2 }
      ]
    }
  ];

  const menuSections = isHOD ? hodMenuSections : adminMenuSections;

  const currentTabParam = new URLSearchParams(location.search).get('tab') || (location.pathname === '/admin/department-portal' ? 'overview' : null);

  return (
    <aside className="w-64 bg-[#0D1B2A] text-slate-300 min-h-screen border-r border-slate-800 flex flex-col shrink-0">
      
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-[#08121E]">
        <div className="p-2 rounded-xl btn-gold text-[#071A33]">
          <Layers className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <h2 className="font-bold text-white text-sm tracking-wide truncate">ST. PHILOMENA</h2>
          <span className="text-[10px] text-[#FFD84A] font-mono tracking-widest uppercase block truncate">
            {isHOD ? 'HOD PORTAL' : 'METRONIC CMS'}
          </span>
        </div>
      </div>

      {/* Active User Department Tag */}
      {isHOD && userDepartmentName && (
        <div className="mx-4 my-3 p-3 bg-blue-950/80 border border-[#C9A84C]/40 rounded-xl space-y-1">
          <span className="text-[9.5px] font-mono font-bold text-[#F0D98C] uppercase tracking-wider block">
            MY DEPARTMENT:
          </span>
          <p className="text-xs font-serif font-bold text-white leading-snug line-clamp-2">
            {userDepartmentName}
          </p>
        </div>
      )}

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-4 space-y-5 overflow-y-auto">
        {menuSections.map((sec, idx) => (
          <div key={idx} className="space-y-2">
            <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-3">{sec.title}</h3>
            <div className="space-y-1">
              {sec.items.map((item, iIdx) => {
                const Icon = item.icon;
                let isActive = false;
                if (item.tabKey) {
                  isActive = location.pathname === '/admin/department-portal' && (currentTabParam === item.tabKey || (item.tabKey === 'overview' && currentTabParam === 'page'));
                } else {
                  isActive = location.pathname === item.path;
                }

                return (
                  <Link
                    key={`${item.path}-${iIdx}`}
                    to={item.path}
                    className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-[#1C5496] text-white font-bold shadow-md border-l-4 border-[#FFC928]'
                        : 'hover:bg-slate-800/60 hover:text-white text-slate-400'
                    }`}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#FFD84A]' : 'text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Switch to Public Site */}
      <div className="p-4 border-t border-slate-800 bg-[#08121E] space-y-2">
        {isHOD && userDepartmentId && (
          <Link
            to={`/departments/${userDepartmentId.replace('dept-', '')}`}
            target="_blank"
            className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#1C5496]/40 hover:bg-[#1C5496] text-[#F0D98C] text-xs font-bold transition-colors"
          >
            <span>View Dept Page</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        )}
        <Link
          to="/"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition-colors"
        >
          <span>View Public Website</span>
          <Sparkles className="w-3.5 h-3.5 text-[#FFD84A]" />
        </Link>
      </div>

    </aside>
  );
}
