import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, UserCheck, BookOpen, FileText, Search, ExternalLink } from 'lucide-react';

export default function QuickPortalsBar() {
  const links = [
    { title: 'Examination Results', path: '/examinations#results', icon: GraduationCap },
    { title: 'Admissions 2026', path: '/admissions', icon: UserCheck },
    { title: 'E-Content & Syllabi', path: '/documents?category=syllabus', icon: BookOpen },
    { title: 'AQAR & NAAC', path: '/compliance', icon: FileText },
    { title: 'Document Center', path: '/documents', icon: Search }
  ];

  return (
    <div className="bg-slate-100 text-slate-800 border-b border-slate-200 py-3 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between text-xs gap-3">
        <span className="font-bold uppercase tracking-wider text-slate-600 text-[11px] flex items-center">
          <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
          Quick Access Portals:
        </span>
        <div className="flex flex-wrap items-center gap-6">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.title}
                to={link.path}
                className="font-semibold text-slate-800 hover:text-amber-600 transition-colors flex items-center group"
              >
                <Icon className="w-3.5 h-3.5 mr-1.5 text-slate-500 group-hover:text-amber-600 transition-colors" />
                {link.title}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
