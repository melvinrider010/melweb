import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ArrowRight, ShieldCheck, Trophy, Users, BookOpen, Calendar, Building2, ExternalLink, FileText, CheckCircle2, Clock, MapPin, Download, Bell, Sparkles } from 'lucide-react';
import collegeInfo from '../data/college_info.json';
import siteImages from '../data/site_images.json';
import facilities from '../data/facilities.json';
import ugProgrammes from '../data/ug-programmes.json';
import pgProgrammes from '../data/pg-programmes.json';

import HeroSlider from '../components/home/HeroSlider';
import AnnouncementTicker from '../components/common/AnnouncementTicker';
import CampusBlocksSection from '../components/home/CampusBlocksSection';
import ManagementSection from '../components/home/ManagementSection';
import GallerySection from '../components/home/GallerySection';
import CourseHoneycombSection from '../components/home/CourseHoneycombSection';
import NoticesHubSection from '../components/home/NoticesHubSection';

export default function HomePage() {
  return (
    <div className="bg-[#f8f9fc] text-[#0B1F4E] overflow-hidden">
      
      {/* 1. CINEMATIC ACADEMIC HERO SLIDER */}
      <HeroSlider />

      {/* 2. MAIN HOMEPAGE CONTENT */}
      <div className="space-y-16 py-8">
        
        {/* 3. INSTITUTIONAL INTRODUCTION & HERITAGE */}
        <section className="max-w-[1440px] mx-auto px-4 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white p-6 sm:p-12 rounded-2xl border border-slate-200 shadow-sm">
            
            <div className="lg:col-span-7 space-y-5">
              <div className="section-heading text-start mb-4">
                <span className="sub-label">About St. Philomena's</span>
                <h2>A Legacy of Academic Excellence in Mysuru</h2>
                <div className="heading-line"></div>
              </div>
              
              <p className="text-slate-600 text-base leading-relaxed">
                Established on <strong className="text-[#0B1F4E]">October 9, 1946</strong> by His Excellency Most Rev. Dr. Rene Feuga, first Bishop of Mysore, under the stewardship of the <strong className="text-[#0B1F4E]">Mysore Diocesan Educational Society (MDES)</strong>. St. Philomena's College was founded with the vision of providing transformative higher education grounded in moral values, social responsibility, and intellectual rigor.
              </p>
              
              <p className="text-slate-600 text-base leading-relaxed">
                Conferred Autonomous status by the University Grants Commission (UGC) and affiliated to the University of Mysore, the institution offers comprehensive undergraduate, postgraduate, and doctoral degree programmes to over 3,000 students across physical sciences, life sciences, commerce, management, humanities, and vocational streams.
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-4">
                <Link
                  to="/about"
                  className="btn-navy px-6 py-3 rounded-lg text-sm font-bold shadow-sm"
                >
                  <span>Our Heritage & Milestones</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 rounded-2xl overflow-hidden shadow-xl border border-slate-200 min-h-[420px] sm:min-h-[480px] lg:h-full relative group bg-[#0B1F4E]">
              <img
                src="/media/heritage/st_philos_heritage_palace.jpg"
                alt="St. Philomena's College Campus & Historic Heritage Building"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-[0.98]"
                style={{ objectPosition: 'center 85%' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F4E]/90 via-transparent to-transparent flex flex-col justify-end p-6">
                <span className="font-serif font-extrabold text-2xl text-[#F0D98C]">EST. 1946</span>
                <span className="text-xs text-slate-200 font-serif italic tracking-wide">"Caritas in Scientia"</span>
              </div>
            </div>

          </div>
        </section>

        {/* 4. INTERACTIVE COURSE HONEYCOMB MATRIX (ACADEMIC STREAMS) */}
        <CourseHoneycombSection />

        {/* 5. DEDICATED NOTICES, EVENTS & ANNOUNCEMENTS HUB (IMMEDIATELY AFTER ACADEMIC STREAMS) */}
        <NoticesHubSection />

        {/* 6. CAMPUS & INFRASTRUCTURAL BLOCKS */}
        <CampusBlocksSection />

        {/* 7. MANAGEMENT & LEADERSHIP */}
        <ManagementSection />

        {/* 9. LIFE AT ST. PHILOMENA'S GALLERY PREVIEW */}
        <GallerySection />

        {/* 12. FULL-BLEED EDITORIAL CTA BANNER */}
        <section className="bg-gradient-to-r from-[#0B1F4E] via-[#0B1F4E] to-[#0B1F4E] text-white py-20 px-4 sm:px-8 text-center border-t-4 border-[#C9A84C]">
          <div className="max-w-3xl mx-auto space-y-5 relative z-10">
            <span className="inline-block bg-[#C9A84C]/20 border border-[#F0D98C]/40 text-[#F0D98C] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase shadow-xs">
              Admissions 2026–27 Open
            </span>
            <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              Begin Your Journey at <span className="text-[#F0D98C] italic font-normal">St. Philomena's</span>
            </h2>
            <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Applications are invited for UG & PG degree programmes under Autonomous curriculum. Experience holistic education rooted in heritage and driven by innovation.
            </p>
            <div className="pt-2 flex flex-wrap justify-center items-center gap-4">
              <a
                href="https://student.stphiloserp.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold px-8 py-3.5 rounded-lg text-sm font-bold shadow-xl"
              >
                <span>Apply Online 2026–27</span>
              </a>
              <Link
                to="/contact"
                className="px-8 py-3.5 rounded-lg text-sm font-bold bg-white/10 hover:bg-white/20 text-white border border-white/30 backdrop-blur-sm transition-all"
              >
                <span>Contact Admissions Desk</span>
              </Link>
            </div>
          </div>
        </section>

      </div>

    </div>
  );
}
