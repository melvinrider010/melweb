import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck, Award, GraduationCap, Building2 } from 'lucide-react';
import collegeInfo from '../../data/college_info.json';
import { cmsStore } from '../../lib/cmsStore';

export default function Footer() {
  const [settings, setSettings] = useState(() => (cmsStore.getSettings ? cmsStore.getSettings() : collegeInfo));
  const [footerConfig, setFooterConfig] = useState(() => {
    try {
      return cmsStore.getFooterConfig ? cmsStore.getFooterConfig() : null;
    } catch (e) {
      return null;
    }
  });

  useEffect(() => {
    const handleUpdate = () => {
      if (cmsStore.getSettings) {
        setSettings(cmsStore.getSettings());
      }
      if (cmsStore.getFooterConfig) {
        setFooterConfig({ ...cmsStore.getFooterConfig() });
      }
    };
    window.addEventListener('cms_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('cms_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const phone = settings.phone || collegeInfo.phone || '+91 9008580707, 9008028258';
  const email = settings.email || collegeInfo.email || 'stphilos1946@gmail.com';
  const address = settings.address || collegeInfo.location || 'PB No. 2, Bannimantap, Mysuru – 570015, Karnataka, India';

  const phoneNumbers = phone
    ? phone.split(/[,/]/).map(p => p.trim()).filter(Boolean)
    : ['+91 9008580707', '9008028258'];

  const brand = footerConfig?.brand || {};
  const crestUrl = brand.crestUrl || '/assets/images/logo/crest_gold_hd.png';
  const fallbackCrestUrl = brand.fallbackCrestUrl || '/assets/images/logo/crest_white_hd.png';
  const brandTitle = brand.title || "St. Philomena's College";
  const brandSubtitle = brand.subtitle || "(Autonomous), Mysuru · Est. 1946";
  const brandDescription = brand.description || "Affiliated to the University of Mysore. A premier UGC Autonomous Catholic institution managed by the Mysore Diocesan Educational Society (MDES). Re-accredited by NAAC with Cycle III B++ Grade (2020).";

  const columns = footerConfig?.columns || [
    {
      title: "Academics",
      links: [
        { label: "UG Programmes (B.Sc, BCA, B.Com, BBA, BA, BSW, B.Voc)", path: "/academics" },
        { label: "PG Programmes (M.Sc, M.Com, MA, MSW, MCA, MBA)", path: "/academics" },
        { label: "Academic Departments", path: "/departments" },
        { label: "Searchable Faculty Directory", path: "/faculty" },
        { label: "Central Library & Syllabus", path: "/resources" }
      ]
    },
    {
      title: "Examinations",
      links: [
        { label: "Autonomous Exam Timetables", path: "/examinations" },
        { label: "End-Semester Results Portal", path: "/examinations" },
        { label: "Revaluation & Photocopy Forms", path: "/examinations" },
        { label: "Prospectus & Admissions 2026–27", path: "/admissions" }
      ]
    },
    {
      title: "Mandatory Disclosure",
      links: [
        { label: "UGC & AICTE Disclosures", path: "/compliance" },
        { label: "IQAC Quality Benchmarks", path: "/iqac" },
        { label: "Statutory Governing Bodies", path: "/compliance" },
        { label: "Student Grievance Committee", path: "/compliance" },
        { label: "RTI & Institutional Desk", path: "/contact" }
      ]
    }
  ];

  const bottomBar = footerConfig?.bottomBar || {};
  const copyrightText = bottomBar.copyrightText || "St. Philomena's College (Autonomous), Mysuru. All Rights Reserved.";
  const bottomLinks = bottomBar.links || [
    { label: "About MDES", path: "/about" },
    { label: "Privacy & Terms", path: "/compliance" },
    { label: "Contact Support", path: "/contact" },
    { label: "CMS Portal", path: "/admin/login" }
  ];

  return (
    <footer className="bg-gradient-to-b from-[#071536] via-[#0B1F4E] to-[#040b1e] text-white pt-14 pb-8 border-t-4 border-[#C9A84C]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Main Footer Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-white/15 pb-12 text-xs">
          
          {/* Brand & Identity Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <img
                src={crestUrl}
                alt="St. Philomena's Crest"
                className="h-14 w-auto object-contain filter drop-shadow-sm"
                onError={(e) => { e.target.src = fallbackCrestUrl; }}
              />
              <div>
                <h3 className="font-heading font-bold text-lg sm:text-xl text-white">{brandTitle}</h3>
                <p className="text-[11px] text-[#F0D98C] font-semibold uppercase tracking-wider">{brandSubtitle}</p>
              </div>
            </div>
            <p className="text-slate-200 leading-relaxed text-xs max-w-sm">
              {brandDescription}
            </p>
            <div className="space-y-2 text-xs text-slate-200">
              <div className="flex items-center text-slate-200">
                <Phone className="w-3.5 h-3.5 mr-2.5 text-[#F0D98C] shrink-0" />
                <div className="flex flex-wrap items-center gap-1 font-mono font-medium">
                  {phoneNumbers.map((num, idx) => (
                    <React.Fragment key={idx}>
                      {idx > 0 && <span className="text-white/40 select-none px-0.5">,</span>}
                      <a
                        href={`tel:${num.replace(/\s+/g, '')}`}
                        className="text-white hover:text-[#F0D98C] transition-colors"
                      >
                        {num}
                      </a>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              <p className="flex items-center text-slate-200">
                <Mail className="w-3.5 h-3.5 mr-2.5 text-[#F0D98C] shrink-0" />
                <a href={`mailto:${email}`} className="text-white hover:text-[#F0D98C] transition-colors">
                  {email}
                </a>
              </p>
              <p className="flex items-start text-slate-200">
                <MapPin className="w-3.5 h-3.5 mr-2.5 text-[#F0D98C] shrink-0 mt-0.5" />
                <span className="text-slate-200">{address}</span>
              </p>
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {columns.map((col, cIdx) => (
            <div key={cIdx} className="space-y-3">
              <h4 className="font-heading font-semibold text-xs sm:text-sm text-[#F0D98C] uppercase tracking-wider border-b border-white/15 pb-1.5">
                {col.title}
              </h4>
              <ul className="space-y-2 text-slate-200">
                {(col.links || []).map((link, lIdx) => (
                  <li key={lIdx}>
                    {link.path?.startsWith('http') ? (
                      <a
                        href={link.path}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.path || '#'}
                        className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

        </div>

        {/* Bottom Copyright & Web Accreditation Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-300 gap-4 pt-2">
          <p className="text-slate-300">
            © {new Date().getFullYear()} {copyrightText}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-slate-300">
            {bottomLinks.map((item, idx) => (
              <React.Fragment key={idx}>
                {idx > 0 && <span className="text-slate-400 select-none">·</span>}
                <Link
                  to={item.path || '#'}
                  className={`hover:text-white transition-colors ${
                    item.label === 'CMS Portal' ? 'text-[11px] font-mono font-medium hover:text-[#F0D98C]' : ''
                  }`}
                >
                  {item.label}
                </Link>
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
