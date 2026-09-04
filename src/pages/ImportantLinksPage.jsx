import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ExternalLink, 
  Search, 
  ShieldCheck, 
  FileText, 
  Globe, 
  Award, 
  GraduationCap, 
  Building2, 
  Scale, 
  BookOpen, 
  Landmark, 
  ArrowRight,
  CheckCircle2,
  Download
} from 'lucide-react';

export default function ImportantLinksPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('All');

  const categories = [
    {
      id: 'portals',
      name: 'Government & Regulatory Portals',
      icon: Globe,
      description: 'Official central and state higher education regulatory platforms.',
      items: [
        {
          title: 'UUCMS',
          subtitle: 'Unified University & College Management System',
          description: 'Karnataka State unified admissions, examination, and student lifecycle management portal.',
          url: 'https://uucms.karnataka.gov.in/Login/Index',
          isExternal: true,
          dept: 'Govt of Karnataka'
        },
        {
          title: 'MHRD / Ministry of Education',
          subtitle: 'Department of Higher Education, Govt of India',
          description: 'Apex national policies, higher education funding, and institution registries.',
          url: 'https://www.education.gov.in/',
          isExternal: true,
          dept: 'Govt of India'
        },
        {
          title: 'University of Mysore (UOM)',
          subtitle: 'Affiliating University',
          description: 'Parent university syllabus notifications, academic councils, and statute registries.',
          url: 'https://uni-mysore.ac.in/',
          isExternal: true,
          dept: 'Affiliating University'
        },
        {
          title: 'UTSAH',
          subtitle: 'Undertaking Transformative Strategies & Actions in Higher Education',
          description: 'UGC apex monitoring platform for qualitative institutional initiatives.',
          url: 'https://utsah.ugc.ac.in/',
          isExternal: true,
          dept: 'UGC Portal'
        },
        {
          title: 'AISHE',
          subtitle: 'All India Survey on Higher Education',
          description: 'National repository of higher education institutional data, staff, and student demographics.',
          url: 'https://aishe.gov.in/',
          isExternal: true,
          dept: 'Ministry of Education'
        },
        {
          title: 'DCE Karnataka',
          subtitle: 'Department of Collegiate Education',
          description: 'State higher education administration, grants-in-aid, and faculty regulatory orders.',
          url: 'https://dce.karnataka.gov.in/',
          isExternal: true,
          dept: 'Govt of Karnataka'
        },
        {
          title: 'KSHEC',
          subtitle: 'Karnataka State Higher Education Council',
          description: 'State curriculum frameworks, NEP guidelines, and quality advancement initiatives.',
          url: 'https://kshec.karnataka.gov.in/',
          isExternal: true,
          dept: 'Govt of Karnataka'
        }
      ]
    },
    {
      id: 'student-services',
      name: 'Student Services, Scholarships & Verification',
      icon: GraduationCap,
      description: 'Online degree verification, state scholarships, and fellowship schemes.',
      items: [
        {
          title: 'State Scholarship Portal (SSP)',
          subtitle: 'Post-Matric Scholarship System',
          description: 'Karnataka state financial assistance and welfare scholarship portal for eligible students.',
          url: 'https://ssp.postmatric.karnataka.gov.in/homepage.aspx',
          isExternal: true,
          dept: 'State Scholarship'
        },
        {
          title: 'Online Certificate & Degree Verification',
          subtitle: 'DirectVerify Portal for Employers & Embassies',
          description: 'Official 24/7 background certificate, transcript, and degree authentication system.',
          url: 'https://stphilos.directverify.in/student/',
          isExternal: true,
          dept: 'Verification'
        },
        {
          title: 'AICTE Scholarship / PG Fellowship',
          subtitle: 'Technical Education Grants & Support',
          description: 'National fellowship opportunities for MCA and MBA technical postgraduate students.',
          url: '/compliance/aicte-mca-mba-disclosure',
          isExternal: false,
          dept: 'AICTE'
        },
        {
          title: 'AICTE Online Feedback Portal',
          subtitle: 'Feedback for Students & Faculty',
          description: 'Statutory online feedback mechanism for academic and administrative continuous improvement.',
          url: '/compliance/code-of-conduct',
          isExternal: false,
          dept: 'AICTE'
        }
      ]
    },
    {
      id: 'institutional-policies',
      name: 'Institutional Policies & Committees',
      icon: Scale,
      description: 'Statutory welfare cells, code of ethics, and gender justice committees.',
      items: [
        {
          title: 'Redressal of Atrocities Against Women',
          subtitle: 'Internal Complaints Committee (ICC)',
          description: 'Zero-tolerance policy against gender discrimination and sexual harassment at the workplace.',
          url: '/compliance/internal-complaints-committee',
          isExternal: false,
          dept: 'ICC / POSH'
        },
        {
          title: 'UGC Compliance & Fee Refund Policy',
          subtitle: 'Statutory UGC Mandates',
          description: 'Strict adherence to UGC guidelines on student admissions, autonomy, and fee refunds.',
          url: '/compliance/ugc-refund-policy',
          isExternal: false,
          dept: 'UGC'
        },
        {
          title: 'Divyangjan Policy',
          subtitle: 'Differently-Abled Accessibility Charter',
          description: 'Barrier-free environment, accessible ramps, braille assistance, and inclusive facilities.',
          url: '/compliance/divyangjan-policy',
          isExternal: false,
          dept: 'Institutional'
        },
        {
          title: 'Institutional Development Plan (IDP)',
          subtitle: 'Strategic Roadmap 2024–2030',
          description: 'Long-term strategic blueprint for academic expansion, infrastructure, and research excellence.',
          url: '/compliance/institutional-development-plan',
          isExternal: false,
          dept: 'Strategic Planning'
        },
        {
          title: 'Institution’s Innovation Council (IIC)',
          subtitle: 'MoE Innovation Cell',
          description: 'Fostering campus entrepreneurship, intellectual property, startups, and innovation culture.',
          url: '/iic',
          isExternal: false,
          dept: 'IIC / MoE'
        }
      ]
    },
    {
      id: 'approvals',
      name: 'Statutory Approvals & Extensions',
      icon: ShieldCheck,
      description: 'Conferred autonomy, AICTE approvals, and extension of approvals.',
      items: [
        {
          title: 'UGC Autonomy Conferred Approval',
          subtitle: 'Autonomous Status Validation',
          description: 'Official grant of academic and administrative autonomy by the University Grants Commission.',
          url: '/compliance/autonomy-approval',
          isExternal: false,
          dept: 'UGC'
        },
        {
          title: 'AICTE Letter of Approval (LOA 2024)',
          subtitle: 'Technical Education Approval',
          description: 'Establishment and approval of AICTE professional postgraduate programmes.',
          url: '/compliance/autonomy-approval',
          isExternal: false,
          dept: 'AICTE'
        },
        {
          title: 'AICTE Extension of Approval (EOA 2024–25)',
          subtitle: 'Academic Year 2024–25 EOA',
          description: 'Approved intake and compliance report for MCA and MBA programmes.',
          url: '/compliance/eoa-2026-27',
          isExternal: false,
          dept: 'AICTE'
        },
        {
          title: 'AICTE Extension of Approval (EOA 2025–26)',
          subtitle: 'Academic Year 2025–26 EOA',
          description: 'Continued affiliation and sanction of postgraduate technical seats.',
          url: '/compliance/eoa-2026-27',
          isExternal: false,
          dept: 'AICTE'
        },
        {
          title: 'AICTE Extension of Approval (EOA 2026–27)',
          subtitle: 'Academic Year 2026–27 EOA',
          description: 'Current valid extension of approval order issued by the AICTE council.',
          url: '/compliance/eoa-2026-27',
          isExternal: false,
          dept: 'AICTE'
        }
      ]
    }
  ];

  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item => 
      (activeTab === 'All' || cat.id === activeTab) &&
      (
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.dept.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  })).filter(cat => cat.items.length > 0);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-10">

        {/* 1. HERO HEADER BANNER */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-[#1C5496] text-white font-mono font-bold text-xs px-3 py-1 rounded-md tracking-wider uppercase">
              Directory of Important Links & External Portals
            </span>
            <span className="bg-amber-50 text-amber-900 border border-amber-200 font-bold text-xs px-3 py-1 rounded-md">
              Govt & Regulatory Portals
            </span>
            <span className="bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs px-3 py-1 rounded-md flex items-center">
              <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-emerald-600" /> 100% Authentic & Verified
            </span>
          </div>

          <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 leading-tight">
            Important Links, Government Portals & Statutory Menus
          </h1>

          <p className="text-xs sm:text-sm text-slate-600 max-w-4xl leading-relaxed font-sans">
            Centralized directory of all regulatory, governmental, academic, verification, and policy portals governing St. Philomena's College (Autonomous), Mysuru. Access official external portals and internal statutory disclosures.
          </p>

          {/* Search and Tabs */}
          <div className="pt-4 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search UUCMS, MHRD, Scholarships, Verification, AICTE, UGC..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#1C5496] focus:bg-white transition-colors"
              />
            </div>

            <div className="sm:col-span-6 flex flex-wrap gap-1.5">
              <button
                onClick={() => setActiveTab('All')}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                  activeTab === 'All'
                    ? 'bg-[#1C5496] text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Links
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors cursor-pointer ${
                    activeTab === cat.id
                      ? 'bg-[#1C5496] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name.split('&')[0].trim()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. CATEGORIZED LINKS SECTIONS */}
        <div className="space-y-12">
          {filteredCategories.map((cat) => {
            const IconComponent = cat.icon;

            return (
              <div key={cat.id} className="space-y-5 animate-fadeIn">
                {/* Header */}
                <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-[#1C5496]/10 text-[#1C5496] flex items-center justify-center font-bold">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="font-serif font-bold text-xl sm:text-2xl text-slate-900">
                        {cat.name}
                      </h2>
                      <p className="text-xs text-slate-500 font-sans">
                        {cat.description}
                      </p>
                    </div>
                  </div>
                  <span className="bg-slate-100 text-slate-700 text-xs font-bold px-3 py-1 rounded-full font-mono">
                    {cat.items.length} Portals
                  </span>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
                  {cat.items.map((item, iIdx) => (
                    <div
                      key={iIdx}
                      className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-[#1C5496] hover:shadow-md transition-all flex flex-col justify-between group space-y-3"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="bg-blue-50 text-[#1C5496] font-mono text-[10px] font-bold px-2 py-0.5 rounded border border-blue-100 uppercase">
                            {item.dept}
                          </span>
                          {item.isExternal && (
                            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60">
                              External Portal ↗
                            </span>
                          )}
                        </div>

                        <h3 className="font-serif font-bold text-base text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
                          {item.title}
                        </h3>

                        <p className="text-xs font-semibold text-slate-700">
                          {item.subtitle}
                        </p>

                        <p className="text-xs text-slate-500 leading-relaxed font-sans line-clamp-3">
                          {item.description}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-100">
                        {item.isExternal ? (
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full py-2.5 px-3 bg-slate-50 hover:bg-[#1C5496] text-slate-800 hover:text-white border border-slate-200 hover:border-[#1C5496] rounded-xl text-xs font-bold inline-flex items-center justify-center transition-all group/btn shadow-xs"
                          >
                            <span>Open Official Portal</span>
                            <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                          </a>
                        ) : (
                          <Link
                            to={item.url}
                            className="w-full py-2.5 px-3 btn-primary-blue rounded-xl text-xs font-bold inline-flex items-center justify-center transition-all shadow-xs"
                          >
                            <span>View Institutional Disclosure</span>
                            <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                          </Link>
                        )}
                      </div>

                    </div>
                  ))}
                </div>

              </div>
            );
          })}
        </div>

        {/* 3. RETURN TO MANDATORY DISCLOSURES FOOTER */}
        <div className="p-6 bg-[#071A33] text-white rounded-2xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif font-bold text-base text-[#FFD84A]">
              Looking for Complete Statutory Approvals & Committees?
            </h3>
            <p className="text-xs text-slate-300 font-sans">
              View all 2(f), 12(B), AICTE MCA/MBA disclosures, IQAC reports, and code of ethics on the main compliance portal.
            </p>
          </div>
          <Link
            to="/mandatory-disclosure"
            className="btn-gold px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0"
          >
            Mandatory Disclosures Hub →
          </Link>
        </div>

      </div>
    </div>
  );
}
