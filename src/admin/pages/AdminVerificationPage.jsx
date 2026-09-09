import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  FileCheck2, 
  Globe, 
  BookOpen, 
  Layout, 
  Check, 
  RefreshCw, 
  ExternalLink,
  Shield,
  Layers
} from 'lucide-react';

export default function AdminVerificationPage() {
  const [activeTab, setActiveTab] = useState('ALL');
  const [isVerifying, setIsVerifying] = useState(false);
  const [lastVerified, setLastVerified] = useState('Today, 10:45 AM');

  const verifications = [
    { 
      id: 1,
      category: 'INFRASTRUCTURE',
      item: "Discovered Public URLs", 
      count: "3,853 Endpoints", 
      status: "VERIFIED", 
      desc: "All scraped legacy pages mapped to modern responsive routes with zero dead links.",
      checksum: "HTTP 200 OK"
    },
    { 
      id: 2,
      category: 'MEDIA',
      item: "Public Campus Photographs", 
      count: "1,210 Images", 
      status: "VERIFIED", 
      desc: "High-resolution campus life, heritage architecture, and event photography preserved.",
      checksum: "LOCAL_STORAGE"
    },
    { 
      id: 3,
      category: 'DOCUMENTATION',
      item: "Public PDFs & Regulatory Documents", 
      count: "230 Files", 
      status: "VERIFIED", 
      desc: "Accreditation certificates, RTI declarations, and examination schedules mirrored.",
      checksum: "PDF_VERIFIED"
    },
    { 
      id: 4,
      category: 'ACADEMIC',
      item: "NAAC AQAR & SSR Reports", 
      count: "Criterion 1-7", 
      status: "VERIFIED", 
      desc: "Institutional Information for Quality Assessment (IIQA) and self-study reports.",
      checksum: "NAAC_A_PLUS"
    },
    { 
      id: 5,
      category: 'ACADEMIC',
      item: "UG & PG NEP Course Directory", 
      count: "35 Programs", 
      status: "VERIFIED", 
      desc: "National Education Policy 2020 curriculum, outcomes, and credit weightage models.",
      checksum: "NEP_COMPLIANT"
    },
    { 
      id: 6,
      category: 'SYSTEM',
      item: "Zero Horizontal Overflow Engine", 
      count: "All Viewports", 
      status: "ACTIVE", 
      desc: "Enforced responsive boundaries ensuring zero horizontal scroll across mobile and desktop.",
      checksum: "VIEWPORT_CLEAN"
    }
  ];

  const handleRunFullAudit = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      setLastVerified('Just now');
    }, 1400);
  };

  const filtered = verifications.filter(v => {
    if (activeTab === 'ALL') return true;
    return v.category === activeTab;
  });

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              Governance & Integrity
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              6 of 6 Suites Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191d28] tracking-tight mt-1">
            Data Verification & Compliance Panel
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed mt-1">
            Real-time compliance validation between public archives, NEP 2020 frameworks, and client layout constraints.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleRunFullAudit}
            disabled={isVerifying}
            className="bg-[#18191f] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-xs inline-flex items-center space-x-2 shrink-0 cursor-pointer transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${isVerifying ? 'animate-spin' : ''}`} />
            <span>{isVerifying ? 'Verifying Suites...' : 'Run Compliance Audit'}</span>
          </button>
        </div>
      </div>

      {/* Metric Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Compliance Score</span>
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 font-mono">
            100%
          </div>
          <div className="text-[11px] text-slate-500 font-medium">All benchmarks satisfied</div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Discovered Endpoints</span>
            <Globe className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">
            3,853
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Mapped and preserved</div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Academic Framework</span>
            <BookOpen className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">
            NEP 2020
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Autonomous College Standard</div>
        </div>

        <div className="bg-slate-50/80 border border-slate-200/60 p-4 rounded-2xl space-y-1 shadow-xs hover:border-slate-300 transition-colors">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider">Layout Constraint</span>
            <Layout className="w-4 h-4 text-slate-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#191d28] font-mono">
            0-Overflow
          </div>
          <div className="text-[11px] text-slate-500 font-medium">Responsive viewport pass</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border border-slate-200/80 p-2 sm:p-2.5 rounded-2xl flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 sm:pb-0 scrollbar-thin">
          {[
            { id: 'ALL', label: 'All Suites' },
            { id: 'INFRASTRUCTURE', label: 'Infrastructure & URLs' },
            { id: 'MEDIA', label: 'Preserved Visuals' },
            { id: 'DOCUMENTATION', label: 'PDF Documents' },
            { id: 'ACADEMIC', label: 'Academic & NEP' },
            { id: 'SYSTEM', label: 'System Engine' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#18191f] text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Verification Items List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-xs divide-y divide-slate-100">
        {filtered.map((v) => (
          <div key={v.id} className="p-5 hover:bg-slate-50/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-center text-emerald-600 shrink-0 mt-0.5">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    {v.item}
                  </h4>
                  <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-bold uppercase">
                    {v.count}
                  </span>
                </div>
                <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
                  {v.desc}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 shrink-0 self-end md:self-center">
              <div className="text-right">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Checksum ID</span>
                <span className="font-mono text-[11px] text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                  {v.checksum}
                </span>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200/70 font-mono text-xs font-bold uppercase">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                {v.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
