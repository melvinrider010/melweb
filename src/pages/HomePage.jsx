import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, ShieldCheck, Trophy, Users, BookOpen, Calendar, Building2, ExternalLink, FileText, CheckCircle2 } from 'lucide-react';
import collegeInfo from '../data/college_info.json';
import noticesData from '../data/notices.json';
import siteImages from '../data/site_images.json';
import facilities from '../data/facilities.json';
import ugProgrammes from '../data/ug-programmes.json';
import pgProgrammes from '../data/pg-programmes.json';

import HeroSlider from '../components/home/HeroSlider';
import QuickAccessStrip from '../components/home/QuickAccessStrip';
import AnnouncementTicker from '../components/common/AnnouncementTicker';
import CampusBlocksSection from '../components/home/CampusBlocksSection';
import AcademicExplorerSection from '../components/home/AcademicExplorerSection';
import ManagementSection from '../components/home/ManagementSection';
import GallerySection from '../components/home/GallerySection';
import CourseHoneycombSection from '../components/home/CourseHoneycombSection';

export default function HomePage() {
  return (
    <div className="space-y-12 bg-[#F8FAFC] text-[#071A33] overflow-hidden">
      
      {/* 1. CINEMATIC ACADEMIC HERO SLIDER */}
      <HeroSlider />

      {/* 2. LIVE UPDATES TICKER */}
      <AnnouncementTicker />

      {/* 3. QUICK ACCESS STRIP */}
      <QuickAccessStrip />

      {/* 4. INSTITUTIONAL INTRODUCTION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8 py-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-xs">
          
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center space-x-2 bg-blue-50 text-[#1C5496] border border-blue-200 px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-bold uppercase tracking-wider font-sans">
              <ShieldCheck className="w-4 h-4 text-[#1C5496]" />
              <span>Autonomous Institutional Heritage</span>
            </div>
            
            <h2 className="font-serif font-extrabold text-3xl sm:text-5xl lg:text-6xl text-slate-900 leading-[1.05] tracking-tight">
              Seven Decades of Learning, Service & Transformation
            </h2>
            
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-sans max-w-2xl">
              Established on October 9, 1946 by His Excellency Most Rev. Dr. Rene Feuga, first Bishop of Mysore, under the management of the Mysore Diocesan Educational Society (MDES). St. Philomena's College was founded with the vision of providing transformative higher education grounded in ethical values and academic rigor.
            </p>
            
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed font-sans max-w-2xl">
              Affiliated to the University of Mysore and granted Autonomous status by the University Grants Commission (UGC), the institution educates over 3,000 undergraduate, postgraduate, and research scholars across diverse scientific, commercial, and humanities disciplines.
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="btn-primary-blue px-6 py-3 rounded-md text-sm sm:text-base font-bold inline-flex items-center"
              >
                <span>Read Our Institutional History</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
              <Link
                to="/compliance"
                className="text-sm font-bold text-[#1C5496] hover:underline"
              >
                UGC & NAAC Compliance →
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 rounded-xl overflow-hidden shadow-lg border border-slate-200 aspect-[4/3] relative group">
            <img
              src="/assets/images/intro_heritage_building.jpg"
              alt="St. Philomena's College Main Building"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute bottom-4 left-4 right-4 bg-[#071A33]/90 text-white p-4 rounded-lg shadow-md border-l-4 border-[#FFC928]">
              <span className="block font-serif font-bold text-xl text-[#FFD84A]">EST. 1946</span>
              <span className="text-xs text-slate-300 font-sans">Caritas et Scientia — Love and Knowledge</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. INSTITUTIONAL STATISTICS STRIP */}
      <section className="bg-[#071A33] text-white border-y border-slate-800 py-12 px-4 sm:px-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <span className="font-serif font-bold text-3xl sm:text-5xl text-[#FFD84A]">1946</span>
            <span className="block text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider font-sans">Established Year</span>
          </div>
          <div className="space-y-1">
            <span className="font-serif font-bold text-3xl sm:text-5xl text-[#FFD84A]">UGC Autonomous</span>
            <span className="block text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider font-sans">Institutional Status</span>
          </div>
          <div className="space-y-1">
            <span className="font-serif font-bold text-3xl sm:text-5xl text-[#FFD84A]">Univ. of Mysore</span>
            <span className="block text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider font-sans">Affiliated University</span>
          </div>
          <div className="space-y-1">
            <span className="font-serif font-bold text-3xl sm:text-5xl text-[#FFD84A]">Cycle III (B++)</span>
            <span className="block text-xs sm:text-sm font-semibold text-slate-300 uppercase tracking-wider font-sans">NAAC Accreditation</span>
          </div>
        </div>
      </section>

      {/* 6. INTERACTIVE COURSE HONEYCOMB SECTION */}
      <CourseHoneycombSection />

      {/* 7. ACADEMICS SECTION */}
      <AcademicExplorerSection />

      {/* 7. CAMPUS & OUR BLOCKS */}
      <CampusBlocksSection />

      {/* 8. RESEARCH & INNOVATION */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-200 pb-4 gap-4">
            <div>
              <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">R&D Cell & Innovation</span>
              <h2 className="font-serif font-extrabold text-2xl text-slate-900">Research & Academic Collaborations</h2>
            </div>
            <Link to="/research" className="text-xs font-bold text-[#1C5496] hover:underline flex items-center">
              <span>View RDC & Patents</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-serif font-bold text-base text-slate-900">Research & Development Cell</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Coordinates major & minor research grants funded by UGC, DST, and VGST. Facilitating faculty and postgraduate research publications.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-serif font-bold text-base text-slate-900">Institution's Innovation Council</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Recognized by the Ministry of Education Innovation Cell (MIC) to foster student startups, hackathons, and patent filings.</p>
            </div>
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-serif font-bold text-base text-slate-900">MOUs & Industry Partnerships</h3>
              <p className="text-xs text-slate-600 leading-relaxed">Active institutional MOUs with national research institutes, corporate sectors, and universities for internship and exchange programs.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. NOTICES & ANNOUNCEMENTS */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex justify-between items-center border-b border-slate-200 pb-4">
            <div>
              <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Circulars & Timetables</span>
              <h2 className="font-serif font-extrabold text-2xl text-slate-900">Official Notices & Circulars</h2>
            </div>
            <Link to="/examinations" className="btn-gold px-4 py-2 rounded-md text-xs font-bold">
              View All Notices
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {noticesData.map((n) => (
              <div key={n.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 flex justify-between items-start gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="bg-blue-100 text-[#1C5496] font-bold text-[10px] px-2 py-0.5 rounded">{n.category}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{n.date}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600 line-clamp-2">{n.summary}</p>
                </div>
                {n.link?.endsWith('.pdf') ? (
                  <a
                    href={n.link}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-xs font-bold text-[#1C5496] hover:underline pt-1 flex items-center"
                  >
                    <span>Download PDF →</span>
                  </a>
                ) : (
                  <Link to={n.link} className="shrink-0 text-xs font-bold text-[#1C5496] hover:underline pt-1">
                    View →
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 10. MANAGEMENT & LEADERSHIP */}
      <ManagementSection />

      {/* 11. CAMPUS GALLERY */}
      <GallerySection />

      {/* 12. CONTACT CTA */}
      <section className="max-w-[1400px] mx-auto px-4 sm:px-8">
        <div className="bg-[#071A33] text-white p-8 sm:p-12 rounded-2xl border border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="space-y-2 max-w-xl">
            <span className="text-[#FFC928] font-bold text-xs uppercase tracking-widest block">Admissions & Inquiries</span>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-white">Join St. Philomena's College (Autonomous)</h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Applications are invited for UG & PG degree programmes for Academic Year 2026–27. Contact our admissions desk or visit our campus in Mysuru.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 shrink-0">
            <Link to="/admissions" className="btn-gold px-6 py-3 rounded-md text-xs font-bold">
              Apply Online 2026–27
            </Link>
            <Link to="/contact" className="px-6 py-3 rounded-md text-xs font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20">
              Contact Desk
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
