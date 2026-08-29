import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Image as ImageIcon } from 'lucide-react';
import ThreeDCarousel from './ThreeDCarousel';

// 12 Authentic, High-Resolution Local St. Philomena's College Photographs
const VERIFIED_GALLERY_MEDIA = [
  {
    id: 'precious_01',
    src: '/media/gallery/precious-memories/precious-memories-01.jpg',
    title: 'Graduation Day & Academic Convocation 2026',
    category: 'ACADEMICS',
    categoryLabel: '01 / PRECIOUS MEMORIES',
    year: '2026'
  },
  {
    id: 'athletic_meet',
    src: '/media/gallery/picture-gallery/athletic_day_2026.jpg',
    title: '80th Annual Athletic Meet & Sports Championship',
    category: 'SPORTS',
    categoryLabel: '02 / SPORTS & ATHLETICS',
    year: '2026'
  },
  {
    id: 'heritage_quadrangle',
    src: '/media/gallery/campus/campus_quadrangle_main.jpg',
    title: 'Historic Main Academic Quadrangle & Campus',
    category: 'HERITAGE',
    categoryLabel: '03 / CAMPUS HERITAGE',
    year: '1946'
  },
  {
    id: 'science_block',
    src: '/media/gallery/campus/campus_science_block.jpg',
    title: 'Advanced Science & Biotechnology Laboratories',
    category: 'RESEARCH',
    categoryLabel: '04 / SCIENCE BLOCK',
    year: '2025'
  },
  {
    id: 'precious_02',
    src: '/media/gallery/precious-memories/precious-memories-02.jpg',
    title: 'Annual Academic Honor & Distinction Ceremony',
    category: 'HONORS',
    categoryLabel: '05 / PRECIOUS MEMORIES',
    year: '2025'
  },
  {
    id: 'library_block',
    src: '/media/gallery/campus/campus_library_block.jpg',
    title: 'Central Library & Digital Information Science Wing',
    category: 'COMMONS',
    categoryLabel: '06 / KNOWLEDGE RESOURCE',
    year: '2025'
  },
  {
    id: 'precious_03',
    src: '/media/gallery/precious-memories/precious-memories-03.jpg',
    title: 'Campus Heritage & Student Leadership Gathering',
    category: 'COMMUNITY',
    categoryLabel: '07 / PRECIOUS MEMORIES',
    year: '2025'
  },
  {
    id: 'social_outreach',
    src: '/media/gallery/picture-gallery/anti_dowry_initiative.jpg',
    title: 'Social Justice & Anti-Dowry Youth Awareness Initiative',
    category: 'OUTREACH',
    categoryLabel: '08 / COMMUNITY OUTREACH',
    year: '2026'
  },
  {
    id: 'cooking_expo',
    src: '/media/gallery/picture-gallery/cooking_competition.jpg',
    title: 'Culinary Arts & Annual Hospitality Food Festival',
    category: 'STUDENT LIFE',
    categoryLabel: '09 / STUDENT TALENT',
    year: '2025'
  },
  {
    id: 'pg_block',
    src: '/media/gallery/campus/campus_pg_research_block.jpg',
    title: 'Postgraduate & Research Center International Wing',
    category: 'ACADEMICS',
    categoryLabel: '10 / POSTGRADUATE WING',
    year: '2025'
  },
  {
    id: 'chapel',
    src: '/media/gallery/campus/campus_chapel.jpg',
    title: 'St. Philomena’s Historic Campus Chapel',
    category: 'HERITAGE',
    categoryLabel: '11 / CAMPUS CHAPEL',
    year: '1946'
  },
  {
    id: 'academic_summit',
    src: '/media/events/national_seminar.jpg',
    title: 'National Academic Research Summit & Symposium',
    category: 'CONFERENCE',
    categoryLabel: '12 / ACADEMIC SUMMIT',
    year: '2026'
  }
];

export default function GallerySection() {
  return (
    <section className="bg-[#071A33] text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-800/80 overflow-hidden relative">
      
      {/* ATMOSPHERIC INSTITUTIONAL BLUEPRINT & RADIAL GLOW WATERMARK */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        {/* Fine Architectural Grid Lines */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1C5496_1px,transparent_1px),linear-gradient(to_bottom,#1C5496_1px,transparent_1px)] bg-[size:4.5rem_4.5rem] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_50%,#000_70%,transparent_100%)] opacity-[0.05]" />
        
        {/* Soft Radial Center Lighting */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[450px] bg-gradient-radial from-blue-700/10 via-transparent to-transparent rounded-full opacity-60 pointer-events-none" />
        
        {/* Circular Coordinate Arcs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] rounded-full border border-[#FFD84A]/5 pointer-events-none" />
      </div>

      <div className="max-w-[1480px] mx-auto space-y-8 sm:space-y-10 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end border-b border-slate-800/90 pb-6 gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-slate-900/90 border border-slate-700/80 rounded-full text-xs font-bold font-sans tracking-widest uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FFD84A] animate-pulse" />
              <span className="text-[#FFD84A]">Campus Media</span>
            </div>
            <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-white tracking-tight leading-tight">
              Campus Life & Event Photographs
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-xl">
              Capturing historic traditions, academic summits, sports achievements, and vibrant student moments at St. Philomena's College.
            </p>
          </div>

          <Link
            to="/gallery"
            className="btn-gold px-6 py-3 rounded-lg text-xs sm:text-sm font-bold inline-flex items-center shadow-lg hover:shadow-yellow-500/20 transition-all font-sans shrink-0 group"
          >
            <span>View Full Gallery</span>
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 3D PARABOLIC FLOWING CAROUSEL */}
        <div className="w-full">
          <ThreeDCarousel items={VERIFIED_GALLERY_MEDIA} />
        </div>

      </div>
    </section>
  );
}
