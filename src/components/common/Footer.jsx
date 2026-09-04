import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck, Award, GraduationCap, Building2 } from 'lucide-react';
import collegeInfo from '../../data/college_info.json';

export default function Footer() {
  return (
    <footer className="bg-[#164E8C] text-white pt-14 pb-8 border-t-4 border-[#C9A84C]">
      <div className="max-w-[1720px] mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Main Footer Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-white/10 pb-12 text-xs">
          
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
            <p className="text-slate-300 leading-relaxed text-xs max-w-sm">
              Affiliated to the University of Mysore. A premier UGC Autonomous Catholic institution managed by the Mysore Diocesan Educational Society (MDES). Re-accredited by NAAC with Cycle III B++ Grade (2020).
            </p>
            <div className="space-y-2 text-slate-300 text-xs">
              <p className="flex items-center">
                <Phone className="w-3.5 h-3.5 mr-2.5 text-[#C9A84C] shrink-0" />
                <a href="tel:+919008580707" className="hover:text-[#F0D98C] font-mono font-bold transition-colors">
                  +91 9008580707
                </a>
              </p>
              <p className="flex items-center">
                <Mail className="w-3.5 h-3.5 mr-2.5 text-[#C9A84C] shrink-0" />
                <a href={`mailto:${collegeInfo.email}`} className="hover:text-[#F0D98C] transition-colors">
                  {collegeInfo.email}
                </a>
              </p>
              <p className="flex items-start"><MapPin className="w-3.5 h-3.5 mr-2.5 text-[#C9A84C] shrink-0 mt-0.5" />PB No. 2, Bannimantap, Mysuru – 570015, Karnataka, India</p>
            </div>
          </div>

          {/* Academics Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#F0D98C] uppercase tracking-wider border-b border-white/10 pb-1.5">Academics</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/academics" className="hover:text-[#F0D98C] transition-colors">UG Programmes (B.Sc, BCA, B.Com, BBA, BA, BSW, B.Voc)</Link></li>
              <li><Link to="/academics" className="hover:text-[#F0D98C] transition-colors">PG Programmes (M.Sc, M.Com, MA, MSW, MCA, MBA)</Link></li>
              <li><Link to="/departments" className="hover:text-[#F0D98C] transition-colors">Academic Departments</Link></li>
              <li><Link to="/faculty" className="hover:text-[#F0D98C] transition-colors">Searchable Faculty Directory</Link></li>
              <li><Link to="/resources" className="hover:text-[#F0D98C] transition-colors">Central Library & Syllabus</Link></li>
            </ul>
          </div>

          {/* Examinations & Governance Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#F0D98C] uppercase tracking-wider border-b border-white/10 pb-1.5">Examinations</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/examinations" className="hover:text-[#F0D98C] transition-colors">Autonomous Exam Timetables</Link></li>
              <li><Link to="/examinations" className="hover:text-[#F0D98C] transition-colors">End-Semester Results Portal</Link></li>
              <li><Link to="/examinations" className="hover:text-[#F0D98C] transition-colors">Revaluation & Photocopy Forms</Link></li>
              <li><Link to="/admissions" className="hover:text-[#F0D98C] transition-colors">Prospectus & Admissions 2026–27</Link></li>
            </ul>
          </div>

          {/* Mandatory Disclosures & Portals */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#F0D98C] uppercase tracking-wider border-b border-white/10 pb-1.5">Mandatory Disclosure</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/compliance" className="hover:text-[#F0D98C] transition-colors">UGC & AICTE Disclosures</Link></li>
              <li><Link to="/iqac" className="hover:text-[#F0D98C] transition-colors">IQAC Quality Benchmarks</Link></li>
              <li><Link to="/compliance" className="hover:text-[#F0D98C] transition-colors">Statutory Governing Bodies</Link></li>
              <li><Link to="/compliance" className="hover:text-[#F0D98C] transition-colors">Student Grievance Committee</Link></li>
              <li><Link to="/contact" className="hover:text-[#F0D98C] transition-colors">RTI & Institutional Desk</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Copyright & Web Accreditation Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-xs text-slate-400 gap-4 pt-2">
          <p>© {new Date().getFullYear()} St. Philomena's College (Autonomous), Mysuru. All Rights Reserved.</p>
          <div className="flex items-center space-x-4">
            <Link to="/about" className="hover:text-white transition-colors">About MDES</Link>
            <span>·</span>
            <Link to="/compliance" className="hover:text-white transition-colors">Privacy & Terms</Link>
            <span>·</span>
            <Link to="/contact" className="hover:text-white transition-colors">Contact Support</Link>
            <span>·</span>
            <Link to="/admin/login" className="text-slate-500 hover:text-white transition-colors text-[11px] font-mono">CMS Portal</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
