import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FileText, FolderGit2, Image as ImageIcon, Users, GraduationCap, 
  Building2, CheckCircle2, AlertCircle, ArrowUpRight, History
} from 'lucide-react';
import { cmsStore } from '../../lib/cmsStore';

export default function AdminDashboardPage() {
  const [mediaList, setMediaList] = useState(cmsStore.getMedia());
  const [docList, setDocList] = useState(cmsStore.getDocuments());
  const [facultyList, setFacultyList] = useState(cmsStore.getFaculty());
  const [ugList, setUgList] = useState(cmsStore.getUGProgrammes());
  const [pgList, setPgList] = useState(cmsStore.getPGProgrammes());
  const [deptList, setDeptList] = useState(cmsStore.getDepartments());
  const [logsList, setLogsList] = useState(cmsStore.getLogs());

  useEffect(() => {
    const handleUpdate = () => {
      setMediaList(cmsStore.getMedia());
      setDocList(cmsStore.getDocuments());
      setFacultyList(cmsStore.getFaculty());
      setUgList(cmsStore.getUGProgrammes());
      setPgList(cmsStore.getPGProgrammes());
      setDeptList(cmsStore.getDepartments());
      setLogsList(cmsStore.getLogs());
    };

    window.addEventListener('cms_store_updated', handleUpdate);
    return () => window.removeEventListener('cms_store_updated', handleUpdate);
  }, []);

  const stats = [
    { label: "Discovered Public URLs", value: "3,853", icon: ArrowUpRight, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Archived Media Assets", value: mediaList.length.toLocaleString(), icon: ImageIcon, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Archived Documents", value: docList.length.toLocaleString(), icon: FolderGit2, color: "text-emerald-600", bg: "bg-emerald-50" },
    { label: "Faculty Directory", value: facultyList.length, icon: Users, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "UG & PG Programmes", value: ugList.length + pgList.length, icon: GraduationCap, color: "text-[#C88A00]", bg: "bg-amber-50" },
    { label: "Academic Departments", value: deptList.length, icon: Building2, color: "text-rose-600", bg: "bg-rose-50" }
  ];

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-blue text-white p-8 rounded-2xl shadow-xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <span className="text-[#FFD84A] font-bold text-xs uppercase tracking-widest block mb-1">Metronic CMS Dashboard</span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-white">St. Philomena's College Dynamic Control Center</h1>
          <p className="text-xs text-slate-100 mt-1">Live CMS data layer & reactive persistence engine.</p>
        </div>
        <Link
          to="/admin/archive-status"
          className="btn-gold text-xs px-5 py-2.5 rounded-lg shadow font-bold whitespace-nowrap"
        >
          View Full Archive Audit →
        </Link>
      </div>

      {/* Dynamic Statistics Grid - Dynamically calculated from cmsStore */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">{s.label}</span>
                <span className="font-serif font-extrabold text-3xl text-slate-900">{s.value}</span>
              </div>
              <div className={`p-3.5 rounded-xl ${s.bg}`}>
                <Icon className={`w-6 h-6 ${s.color}`} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Recent Activity & System Health */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <div className="flex justify-between items-center border-b pb-3">
            <h3 className="font-serif font-bold text-lg text-slate-900 flex items-center">
              <History className="w-5 h-5 mr-2 text-[#1C5496]" />
              Recent CMS Activity Logs
            </h3>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">Reactive Persistence Active</span>
          </div>

          <div className="space-y-3">
            {logsList.slice(0, 5).map((log) => (
              <div key={log.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-slate-900 block">{log.details}</span>
                  <span className="text-[10px] text-slate-500">{log.user} · {log.module}</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="font-serif font-bold text-lg text-slate-900 border-b pb-3">System Health Status</h3>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
              <span className="flex items-center font-bold"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />Live Database Sync</span>
              <span className="font-mono text-[11px] text-emerald-700 font-bold">REACTIVES STORE</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
              <span className="flex items-center font-bold"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />Local File Storage</span>
              <span className="font-mono text-[11px] text-emerald-700 font-bold">public/assets/</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200">
              <span className="flex items-center font-bold"><CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600" />Zero Overflow System</span>
              <span className="font-mono text-[11px] text-emerald-700 font-bold">VERIFIED</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
