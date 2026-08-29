import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ExternalLink, ShieldCheck, Award, GraduationCap, Building2 } from 'lucide-react';
import collegeInfo from '../../data/college_info.json';

export default function Footer() {
  return (
    <footer className="bg-[#071A33] text-white pt-14 pb-8 border-t-4 border-[#FFC928]">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 space-y-12">
        
        {/* Main Footer Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 border-b border-slate-800 pb-12 text-xs">
          
          {/* Brand & Identity Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <img
                src="/assets/logo.png"
                alt="St. Philomena's Crest"
                className="h-12 w-auto object-contain"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <div>
                <h3 className="font-serif font-bold text-lg text-white">St. Philomena's College</h3>
                <p className="text-[11px] text-[#FFC928] font-semibold uppercase tracking-wider">(Autonomous), Mysuru · Est. 1946</p>
              </div>
            </div>
            <p className="text-slate-400 leading-relaxed text-xs max-w-sm">
              Affiliated to the University of Mysore. A premier UGC Autonomous Catholic minority institution managed by the Mysore Diocesan Educational Society (MDES). Re-accredited by NAAC with Cycle III B++ Grade.
            </p>
            <div className="space-y-1.5 text-slate-300 text-xs">
              <p className="flex items-center"><Phone className="w-3.5 h-3.5 mr-2 text-[#FFC928] shrink-0" />{collegeInfo.phone}</p>
              <p className="flex items-center"><Mail className="w-3.5 h-3.5 mr-2 text-[#FFC928] shrink-0" />{collegeInfo.email}</p>
              <p className="flex items-start"><MapPin className="w-3.5 h-3.5 mr-2 text-[#FFC928] shrink-0 mt-0.5" />PB No. 2, Bannimantap, Mysuru – 570015, Karnataka, India</p>
            </div>
          </div>

          {/* Academics Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#FFC928] uppercase tracking-wider border-b border-slate-800 pb-1">Academics</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/academics" className="hover:text-[#FFC928] transition-colors">UG Programmes (B.Com, B.Sc, BCA, BA)</Link></li>
              <li><Link to="/academics" className="hover:text-[#FFC928] transition-colors">PG Programmes (M.Sc, M.Com, MA, MSW)</Link></li>
              <li><Link to="/departments" className="hover:text-[#FFC928] transition-colors">Academic Departments</Link></li>
              <li><Link to="/faculty" className="hover:text-[#FFC928] transition-colors">Searchable Faculty Directory</Link></li>
              <li><Link to="/resources" className="hover:text-[#FFC928] transition-colors">Central Library & Syllabus</Link></li>
            </ul>
          </div>

          {/* Examinations & Governance Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#FFC928] uppercase tracking-wider border-b border-slate-800 pb-1">Examinations</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/examinations" className="hover:text-[#FFC928] transition-colors">Autonomous Exam Timetables</Link></li>
              <li><Link to="/examinations" className="hover:text-[#FFC928] transition-colors">End-Semester Results Portal</Link></li>
              <li><Link to="/examinations" className="hover:text-[#FFC928] transition-colors">Revaluation & Photocopy Forms</Link></li>
              <li><Link to="/admissions" className="hover:text-[#FFC928] transition-colors">Prospectus & Admissions 2026–27</Link></li>
              <li><Link to="/student-support" className="hover:text-[#FFC928] transition-colors">Career & Placement Cell</Link></li>
            </ul>
          </div>

          {/* Institutional Compliance Column */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-[#FFC928] uppercase tracking-wider border-b border-slate-800 pb-1">Compliance & IQAC</h4>
            <ul className="space-y-2 text-slate-300">
              <li><Link to="/naac" className="hover:text-[#FFC928] transition-colors">NAAC Cycle III (B++) Accreditation</Link></li>
              <li><Link to="/iqac" className="hover:text-[#FFC928] transition-colors">IQAC Quality Policy & AQAR</Link></li>
              <li><Link to="/nirf" className="hover:text-[#FFC928] transition-colors">NIRF Rankings & Data Submission</Link></li>
              <li><Link to="/mandatory-disclosure" className="hover:text-[#FFC928] transition-colors">AICTE EOA & UGC 2(f)/12(B)</Link></li>
              <li><Link to="/mandatory-disclosure" className="hover:text-[#FFC928] transition-colors">Code of Conduct & Anti-Ragging</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Affiliated Links */}
        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} St. Philomena's College (Autonomous), Mysuru. All Rights Reserved.</p>
          <div className="flex flex-wrap items-center gap-3">
            <a href="https://uom.ac.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFC928] flex items-center">
              <span>University of Mysore</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            <span>·</span>
            <a href="https://ugc.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFC928] flex items-center">
              <span>UGC Portal</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
            <span>·</span>
            <a href="https://naac.gov.in" target="_blank" rel="noopener noreferrer" className="hover:text-[#FFC928] flex items-center">
              <span>NAAC</span>
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
