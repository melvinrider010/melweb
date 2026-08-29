import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap, Award, FileText, Calendar, BookOpen, Search, HelpCircle } from 'lucide-react';

export default function QuickAccessStrip() {
  const links = [
    { label: 'Admissions 2026', path: '/admissions', icon: GraduationCap },
    { label: 'Exam Results', path: '/examinations', icon: Award },
    { label: 'Academic Calendar', path: '/academics', icon: Calendar },
    { label: 'Syllabus Repository', path: '/academics', icon: BookOpen },
    { label: 'IQAC & NAAC', path: '/compliance', icon: Award },
    { label: 'Document Centre', path: '/documents', icon: FileText },
    { label: 'Contact', path: '/contact', icon: HelpCircle }
  ];

  return (
    <section className="bg-white border-y border-slate-200/80 py-4 px-4 sm:px-8 shadow-xs">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        <div className="flex items-center space-x-2 shrink-0">
          <span className="w-2 h-2 rounded-full bg-[#FFC928]"></span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#071A33]">Quick Access Portals:</span>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs font-semibold text-slate-700">
          {links.map((item, idx) => {
            const Icon = item.icon;
            return (
              <Link
                key={idx}
                to={item.path}
                className="inline-flex items-center space-x-1.5 py-1 px-3 rounded-md hover:bg-slate-100 hover:text-[#FFC928] transition-colors whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 text-[#FFC928]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
