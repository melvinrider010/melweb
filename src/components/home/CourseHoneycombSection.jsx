import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, X, BookOpen, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';
import honeycombData from '../../data/honeycomb-programmes.json';

export default function CourseHoneycombSection() {
  const [filter, setFilter] = useState('ug'); // 'ug', 'pg', 'all'
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ side: 'right', vertical: 'center' });

  // Filter dataset
  const filteredCourses = honeycombData.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  // Balanced row distribution: 4+4 for UG, 5+5+5 for PG, 6+6+6+5 for ALL
  const getRowItems = (items, filterMode) => {
    const rows = [];
    let pattern = [4, 4];
    if (filterMode === 'ug') {
      pattern = [4, 4]; // 4 on top + 4 below for perfect hexagonal interlock
    } else if (filterMode === 'pg') {
      pattern = [5, 5, 5]; // 15 PG programmes in 3 balanced rows
    } else {
      pattern = [6, 6, 6, 5]; // 23 total programmes
    }

    let idx = 0;
    let pIdx = 0;

    while (idx < items.length) {
      const count = pattern[pIdx % pattern.length];
      rows.push(items.slice(idx, idx + count));
      idx += count;
      pIdx++;
    }
    return rows;
  };

  const rows = getRowItems(filteredCourses, filter);

  const handleMouseEnter = (course, colIdx, rowLength, rowIndex, totalRows) => {
    setHoveredCourse(course);
    const isRightSide = colIdx >= Math.floor(rowLength / 2);
    const isTopRow = rowIndex === 0;
    const isBottomRow = rowIndex === totalRows - 1;

    setPopoverPos({
      side: isRightSide ? 'left' : 'right',
      vertical: isTopRow ? 'top' : isBottomRow ? 'bottom' : 'center'
    });
  };

  const handleMouseLeave = () => {
    setHoveredCourse(null);
  };

  const handleCourseClick = (course) => {
    if (selectedCourse?.id === course.id) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(course);
    }
  };

  // Dynamic index for editorial numbering
  let cumulativeIndex = 0;

  return (
    <section className="bg-[#f8f9fc] text-[#0B1F4E] py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-y border-slate-200/80 relative">
      
      {/* 1. GHOST / OUTLINE HONEYCOMB WATERMARK LAYER */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        <svg 
          className="absolute inset-0 w-full h-full text-[#0B1F4E]" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern 
              id="ghost-honeycomb-matrix" 
              width="210" 
              height="181.86" 
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 105 0 L 210 45.47 L 210 136.4 L 105 181.86 L 0 136.4 L 0 45.47 Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.04"
                fill="none"
              />
              <path
                d="M 0 90.93 L 105 136.4 L 105 227.33 L 0 272.8 L -105 227.33 L -105 136.4 Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.03"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ghost-honeycomb-matrix)" />
        </svg>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#f8f9fc_95%)] opacity-80" />
      </div>

      <div className="max-w-[1440px] w-full mx-auto space-y-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <div className="section-heading mb-0">
            <span className="sub-label">Autonomous Degree Programmes</span>
            <h2>Explore Our Academic Streams</h2>
            <div className="heading-line"></div>
          </div>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans max-w-lg mx-auto">
            Choose your academic path across Science, Commerce, Management, Humanities & Vocational streams. Hover over any programme to view curriculum and specializations.
          </p>
        </div>

        {/* INTERACTIVE DEGREE LEVEL FILTER TABS */}
        <div className="flex justify-center pb-2">
          <div 
            role="tablist"
            className="inline-flex items-center space-x-2 sm:space-x-4 bg-white px-3 sm:px-5 py-1.5 rounded-full border border-slate-200 shadow-xs text-xs sm:text-sm font-sans"
          >
            {[
              { id: 'ug', label: 'Undergraduate' },
              { id: 'pg', label: 'Postgraduate' },
              { id: 'all', label: 'All Programmes' }
            ].map((tab, idx) => {
              const isActive = filter === tab.id;
              return (
                <React.Fragment key={tab.id}>
                  {idx > 0 && <span className="text-slate-300 select-none">|</span>}
                  <button
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => {
                      setFilter(tab.id);
                      setHoveredCourse(null);
                      setSelectedCourse(null);
                    }}
                    className={`relative py-1.5 px-2.5 rounded-full transition-all duration-200 uppercase font-semibold text-xs tracking-wider cursor-pointer ${
                      isActive
                        ? 'bg-[#0B1F4E] text-[#F0D98C] shadow-xs'
                        : 'text-slate-600 hover:text-[#0B1F4E] hover:bg-slate-100'
                    }`}
                  >
                    <span>{tab.label}</span>
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* BALANCED INTERLOCKING HONEYCOMB MATRIX */}
        <div 
          key={filter}
          className="flex flex-col items-center justify-center pt-2 pb-2 w-full mx-auto relative animate-fadeIn"
        >
          {rows.map((rowItems, rowIndex) => {
            return (
              <div
                key={rowIndex}
                className={`flex flex-wrap sm:flex-nowrap items-center justify-center gap-2 sm:gap-3 lg:gap-4 xl:gap-5 transition-all duration-300 ${
                  rowIndex > 0 ? '-mt-2 sm:-mt-3 lg:-mt-4' : ''
                }`}
              >
                {rowItems.map((course, colIdx) => {
                  cumulativeIndex++;
                  const formattedNumber = String(cumulativeIndex).padStart(2, '0');
                  const isHovered = hoveredCourse?.id === course.id;
                  const isSelected = selectedCourse?.id === course.id;
                  const isActive = isHovered || isSelected;

                  return (
                    <div
                      key={course.id}
                      className={`relative group transition-all duration-200 ${isActive ? 'z-40' : 'z-10'}`}
                      onMouseEnter={() => handleMouseEnter(course, colIdx, rowItems.length, rowIndex, rows.length)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleCourseClick(course)}
                    >
                      {/* Hexagonal Card */}
                      <div
                        className={`relative w-[115px] h-[132px] sm:w-[130px] sm:h-[150px] lg:w-[145px] lg:h-[168px] xl:w-[155px] xl:h-[178px] p-[2px] cursor-pointer transition-all duration-200 ${
                          isActive ? 'scale-105 drop-shadow-lg' : 'hover:scale-102 hover:drop-shadow-md drop-shadow-xs'
                        }`}
                        style={{
                          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                        }}
                      >
                        {/* Outline Layer */}
                        <div
                          className={`absolute inset-0 transition-colors duration-200 ${
                            isActive
                              ? 'bg-[#C9A84C]'
                              : 'bg-slate-300 group-hover:bg-[#C9A84C]'
                          }`}
                        />

                        {/* Inner Hexagon Container */}
                        <div
                          className={`absolute inset-[2px] transition-all duration-200 flex flex-col items-center justify-center px-1.5 py-2 sm:px-2 sm:py-3 text-center ${
                            isActive
                              ? 'bg-[#060f26] text-white shadow-inner'
                              : 'bg-white group-hover:bg-[#f8f9fc] text-[#0B1F4E]'
                          }`}
                          style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                          }}
                        >
                          {/* Gold Editorial Number */}
                          <span className={`font-mono text-[10px] sm:text-[11px] font-bold tracking-wider mb-0.5 ${isActive ? 'text-[#F0D98C]' : 'text-[#C9A84C]'}`}>
                            {formattedNumber}
                          </span>

                          {/* Hero Programme Abbreviation */}
                          <span
                            className={`font-serif font-extrabold leading-none transition-colors duration-200 tracking-tight my-0.5 ${
                              course.code.length > 5 
                                ? 'text-sm sm:text-base lg:text-lg' 
                                : 'text-base sm:text-xl lg:text-2xl'
                            } ${isActive ? 'text-white' : 'text-[#0B1F4E] group-hover:text-[#a88530]'}`}
                          >
                            {course.code}
                          </span>

                          {/* Full Name Lines */}
                          <div className="mt-0.5 space-y-0.5 max-w-[94%]">
                            {course.displayLines.map((line, lIdx) => (
                              <span
                                key={lIdx}
                                className={`block text-[9.5px] sm:text-[11px] lg:text-[12px] font-semibold leading-[1.18] break-words transition-colors duration-200 ${
                                  isActive
                                    ? 'text-slate-200'
                                    : 'text-slate-600 group-hover:text-slate-900'
                                }`}
                              >
                                {line}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* DESKTOP CONTEXTUAL HOVER DETAIL POPOVER */}
                      {isHovered && (
                        <div
                          onMouseEnter={() => setHoveredCourse(course)}
                          onMouseLeave={handleMouseLeave}
                          className={`hidden md:block absolute z-50 w-[320px] lg:w-[350px] bg-white text-[#0B1F4E] p-5 rounded-2xl border-2 border-[#C9A84C]/60 shadow-2xl pointer-events-auto transition-all duration-200 animate-fadeIn ${
                            popoverPos.side === 'left'
                              ? 'right-[105%] before:absolute before:-right-5 before:top-0 before:w-6 before:h-full'
                              : 'left-[105%] before:absolute before:-left-5 before:top-0 before:w-6 before:h-full'
                          } ${
                            popoverPos.vertical === 'top'
                              ? 'top-0'
                              : popoverPos.vertical === 'bottom'
                              ? 'bottom-0'
                              : 'top-1/2 -translate-y-1/2'
                          }`}
                        >
                          {/* Top Header Badge */}
                          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 gap-2">
                            <div className="flex items-center space-x-2">
                              <span className="badge-type badge-important text-[10px] px-2 py-0.5">
                                {course.type === 'ug' ? 'UNDERGRADUATE' : 'POSTGRADUATE'}
                              </span>
                            </div>
                            <span className="bg-[#060f26] text-[#F0D98C] text-xs px-2 py-0.5 rounded font-mono font-bold border border-[#C9A84C]/40">
                              {formattedNumber} · {course.code}
                            </span>
                          </div>

                          {/* Programme Title */}
                          <h4 className="font-serif font-extrabold text-lg text-[#0B1F4E] leading-snug">
                            {course.title}
                          </h4>

                          {/* Duration Badge */}
                          <div className="flex items-center space-x-1.5 text-xs text-slate-600 font-mono mt-1.5">
                            <Clock className="w-3.5 h-3.5 text-[#C9A84C] shrink-0" />
                            <span>{course.duration}</span>
                          </div>

                          {/* Academic Overview Description */}
                          <p className="text-xs text-slate-700 leading-relaxed font-sans mt-2.5 line-clamp-3">
                            {course.description}
                          </p>

                          {/* Action Buttons */}
                          <div className="pt-3.5 mt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                            <Link
                              to={course.link || `/academics/${course.id}`}
                              className="btn-navy text-xs font-bold px-3.5 py-2 rounded-lg inline-flex items-center group/link shrink-0"
                            >
                              <span>Explore Syllabus</span>
                              <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
                            <a
                              href="https://student.stphiloserp.in/"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn-gold text-xs font-bold px-3.5 py-2 rounded-lg inline-flex items-center shrink-0"
                            >
                              <span>Apply</span>
                            </a>
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        {/* MOBILE CONTEXTUAL DETAIL DRAWER (FOR TOUCH DEVICES) */}
        {selectedCourse && (
          <div className="block md:hidden max-w-md mx-auto bg-white text-[#0B1F4E] p-5 rounded-2xl border-2 border-[#C9A84C]/40 shadow-xl space-y-3 animate-fadeIn mt-2">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div className="flex items-center space-x-2">
                <span className="badge-type badge-important text-xs">
                  {selectedCourse.type === 'ug' ? 'UNDERGRADUATE' : 'POSTGRADUATE'}
                </span>
                <span className="text-[11px] font-mono font-bold text-slate-400">NEP 2020</span>
              </div>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center space-x-3">
              <span className="w-10 h-10 rounded-lg bg-[#060f26] text-[#F0D98C] font-serif font-extrabold text-base flex items-center justify-center border border-[#C9A84C]/40 shrink-0">
                {selectedCourse.code}
              </span>
              <h3 className="font-serif font-bold text-lg text-[#0B1F4E]">
                {selectedCourse.title}
              </h3>
            </div>

            <div className="flex items-center space-x-1.5 text-xs font-mono text-slate-600">
              <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>{selectedCourse.duration}</span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed font-sans">
              {selectedCourse.description}
            </p>

            <div className="pt-2 flex items-center space-x-2">
              <Link
                to={selectedCourse.link || `/academics/${selectedCourse.id}`}
                className="btn-navy text-xs font-bold px-4 py-2.5 rounded-lg inline-flex items-center justify-center flex-1"
              >
                <span>Explore Syllabus</span>
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Link>
              <a
                href="https://student.stphiloserp.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-xs font-bold px-4 py-2.5 rounded-lg inline-flex items-center justify-center"
              >
                <span>Apply</span>
              </a>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
