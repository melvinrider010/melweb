import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck, Award, GraduationCap, Building2 } from 'lucide-react';
import collegeInfo from '../../data/college_info.json';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-[#071536] via-[#0B1F4E] to-[#040b1e] text-white pt-14 pb-8 border-t-4 border-[#C9A84C]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Main Footer Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-white/15 pb-12 text-xs">
          
          {/* Brand & Identity Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <img
                src="/assets/images/logo/crest_gold_hd.png"
                alt="St. Philomena's Crest"
                className="h-14 w-auto object-contain filter drop-shadow-sm"
                onError={(e) => { e.target.src = '/assets/images/logo/crest_white_hd.png'; }}
              />
              <div>
                <h3 className="font-serif font-extrabold text-lg sm:text-xl text-white">St. Philomena's College</h3>
                <p className="text-[11px] text-[#F0D98C] font-bold uppercase tracking-wider">(Autonomous), Mysuru · Est. 1946</p>
              </div>
            </div>
            <p className="text-slate-200 leading-relaxed text-xs max-w-sm">
              Affiliated to the University of Mysore. A premier UGC Autonomous Catholic institution managed by the Mysore Diocesan Educational Society (MDES). Re-accredited by NAAC with Cycle III B++ Grade (2020).
            </p>
            <div className="space-y-2 text-xs text-slate-200">
              <p className="flex items-center text-slate-200">
                <Phone className="w-3.5 h-3.5 mr-2.5 text-[#F0D98C] shrink-0" />
                <a href="tel:+919008580707" className="text-white hover:text-[#F0D98C] font-mono font-bold transition-colors">
                  +91 9008580707
                </a>
              </p>
              <p className="flex items-center text-slate-200">
                <Mail className="w-3.5 h-3.5 mr-2.5 text-[#F0D98C] shrink-0" />
                <a href={`mailto:${collegeInfo.email}`} className="text-white hover:text-[#F0D98C] transition-colors">
                  {collegeInfo.email}
                </a>
              </p>
              <p className="flex items-start text-slate-200">
                <MapPin className="w-3.5 h-3.5 mr-2.5 text-[#F0D98C] shrink-0 mt-0.5" />
                <span className="text-slate-200">PB No. 2, Bannimantap, Mysuru – 570015, Karnataka, India</span>
              </p>
            </div>
          </div>

          {/* Academics Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#F0D98C] uppercase tracking-wider border-b border-white/15 pb-1.5">Academics</h4>
            <ul className="space-y-2 text-slate-200">
              <li><Link to="/academics" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">UG Programmes (B.Sc, BCA, B.Com, BBA, BA, BSW, B.Voc)</Link></li>
              <li><Link to="/academics" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">PG Programmes (M.Sc, M.Com, MA, MSW, MCA, MBA)</Link></li>
              <li><Link to="/departments" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">Academic Departments</Link></li>
              <li><Link to="/faculty" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">Searchable Faculty Directory</Link></li>
              <li><Link to="/resources" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">Central Library & Syllabus</Link></li>
            </ul>
          </div>

          {/* Examinations & Governance Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#F0D98C] uppercase tracking-wider border-b border-white/15 pb-1.5">Examinations</h4>
            <ul className="space-y-2 text-slate-200">
              <li><Link to="/examinations" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">Autonomous Exam Timetables</Link></li>
              <li><Link to="/examinations" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">End-Semester Results Portal</Link></li>
              <li><Link to="/examinations" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">Revaluation & Photocopy Forms</Link></li>
              <li><Link to="/admissions" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">Prospectus & Admissions 2026–27</Link></li>
            </ul>
          </div>

          {/* Mandatory Disclosures & Portals */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#F0D98C] uppercase tracking-wider border-b border-white/15 pb-1.5">Mandatory Disclosure</h4>
            <ul className="space-y-2 text-slate-200">
              <li><Link to="/compliance" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">UGC & AICTE Disclosures</Link></li>
              <li><Link to="/iqac" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">IQAC Quality Benchmarks</Link></li>
              <li><Link to="/compliance" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">Statutory Governing Bodies</Link></li>
              <li><Link to="/compliance" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">Student Grievance Committee</Link></li>
              <li><Link to="/contact" className="text-slate-200 hover:text-[#F0D98C] transition-colors inline-block">RTI & Institutional Desk</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Web Accreditation Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-300 gap-4 pt-2">
          <p className="text-slate-300">© {new Date().getFullYear()} St. Philomena's College (Autonomous), Mysuru. All Rights Reserved.</p>
          <div className="flex items-center space-x-4 text-slate-300">
            <Link to="/about" className="text-slate-300 hover:text-white transition-colors">About MDES</Link>
            <span className="text-slate-400">·</span>
            <Link to="/compliance" className="text-slate-300 hover:text-white transition-colors">Privacy & Terms</Link>
            <span className="text-slate-400">·</span>
            <Link to="/contact" className="text-slate-300 hover:text-white transition-colors">Contact Support</Link>
            <span className="text-slate-400">·</span>
            <Link to="/admin/login" className="text-slate-300 hover:text-[#F0D98C] transition-colors text-[11px] font-mono font-medium">CMS Portal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
