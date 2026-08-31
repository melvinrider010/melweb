import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, X } from 'lucide-react';
import honeycombData from '../../data/honeycomb-programmes.json';

export default function CourseHoneycombSection() {
  const [filter, setFilter] = useState('ug'); // 'ug', 'pg', 'all'
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ side: 'right', vertical: 'center' });

  const activeCourse = hoveredCourse || selectedCourse;

  // Filter dataset
  const filteredCourses = honeycombData.filter((item) => {
    if (filter === 'all') return true;
    return item.type === filter;
  });

  // Calculate exact horizontal rows: 8 on top + 6 below for UG
  const getRowItems = (items, filterMode) => {
    const rows = [];
    let pattern = [8, 6];
    if (filterMode === 'ug') {
      pattern = [8, 6]; // Exactly 8 programmes in row 1, 6 in row 2
    } else if (filterMode === 'pg') {
      pattern = [8, 7]; // Exactly 8 in row 1, 7 in row 2
    } else {
      pattern = [8, 7, 7, 7]; // 29 items across 4 compact rows
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

  // Get dynamic index for editorial numbering
  let cumulativeIndex = 0;

  return (
    <section className="bg-[#FAF9F6] text-[#071A33] py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-y border-slate-200/80 relative overflow-hidden">
      
      {/* 1. GHOST / OUTLINE HONEYCOMB WATERMARK LAYER (EDGE-TO-EDGE, NON-INTERACTIVE) */}
      <div 
        aria-hidden="true" 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none"
      >
        {/* Seamless Architectural Honeycomb Pattern */}
        <svg 
          className="absolute inset-0 w-full h-full text-[#1C5496]" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern 
              id="ghost-honeycomb-matrix" 
              width="210" 
              height="181.86" 
              patternUnits="userSpaceOnUse"
            >
              {/* Hexagon 1 */}
              <path
                d="M 105 0 L 210 45.47 L 210 136.4 L 105 181.86 L 0 136.4 L 0 45.47 Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.08"
                fill="none"
              />
              {/* Hexagon 2 (Interlocking Offset) */}
              <path
                d="M 0 90.93 L 105 136.4 L 105 227.33 L 0 272.8 L -105 227.33 L -105 136.4 Z"
                stroke="currentColor"
                strokeWidth="1"
                strokeOpacity="0.06"
                fill="none"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#ghost-honeycomb-matrix)" />
        </svg>

        {/* Soft Vignette Masking to gracefully soften background edges */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#FAF9F6_95%)] opacity-80" />
      </div>

      <div className="max-w-[1600px] w-full mx-auto space-y-6 sm:space-y-8 relative z-10">
        
        {/* SECTION HEADER */}
        <div className="text-center space-y-2 max-w-3xl mx-auto">
          <span className="text-[#1C5496] font-bold text-xs sm:text-sm uppercase tracking-widest block font-sans">
            ACADEMICS
          </span>
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 tracking-tight">
            Explore Our Programmes
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans max-w-lg mx-auto">
            Choose your path. Discover where it can take you.
          </p>
        </div>

        {/* REFINED EDITORIAL CATEGORY FILTER */}
        <div className="flex justify-center pt-1 pb-2">
          <div 
            role="tablist" 
            aria-label="Programme Categories"
            className="inline-flex items-center space-x-5 sm:space-x-8 text-sm font-bold tracking-wider"
          >
            {[
              { id: 'ug', label: 'UNDERGRADUATE' },
              { id: 'pg', label: 'POSTGRADUATE' },
              { id: 'all', label: 'ALL PROGRAMMES' }
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
                      setSelectedCourse(null);
                      setHoveredCourse(null);
                    }}
                    className={`relative py-1.5 transition-all duration-200 uppercase whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'text-[#071A33] font-extrabold'
                        : 'text-slate-500 hover:text-[#071A33] font-medium'
                    }`}
                  >
                    <span>{tab.label}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#D4AF37] rounded-full animate-fadeIn" />
                    )}
                  </button>
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* EXACT 8 ON TOP + 6 BELOW INTERLOCKING HONEYCOMB GRID */}
        <div 
          key={filter}
          className="flex flex-col items-center justify-center pt-2 pb-4 w-full max-w-[1550px] mx-auto relative animate-fadeIn"
        >
          {rows.map((rowItems, rowIndex) => {
            return (
              <div
                key={rowIndex}
                className={`flex flex-wrap sm:flex-nowrap items-center justify-center gap-1.5 sm:gap-2 lg:gap-2.5 xl:gap-3 transition-all duration-300 ${
                  rowIndex > 0 ? '-mt-2 sm:-mt-3 lg:-mt-4 xl:-mt-5' : ''
                }`}
              >
                {rowItems.map((course, colIndex) => {
                  cumulativeIndex++;
                  const formattedNumber = String(cumulativeIndex).padStart(2, '0');
                  const isHovered = hoveredCourse?.id === course.id;
                  const isSelected = selectedCourse?.id === course.id;
                  const isActive = isHovered || isSelected;
                  const hasActive = Boolean(activeCourse);

                  return (
                    <div
                      key={course.id}
                      className={`relative group transition-all duration-200 ${
                        isActive 
                          ? 'z-30 scale-105' 
                          : hasActive 
                          ? 'opacity-75 scale-98 z-10' 
                          : 'z-10 opacity-100'
                      }`}
                      onMouseEnter={() => handleMouseEnter(course, colIndex, rowItems.length, rowIndex, rows.length)}
                      onMouseLeave={handleMouseLeave}
                      onClick={() => handleCourseClick(course)}
                    >
                      {/* Outer Hexagonal Border with generous safe height */}
                      <div
                        className="relative w-[110px] h-[130px] sm:w-[128px] sm:h-[150px] lg:w-[144px] lg:h-[168px] xl:w-[156px] xl:h-[182px] p-[1.5px] cursor-pointer transition-all duration-200 drop-shadow-xs group-hover:drop-shadow-md"
                        style={{
                          clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                        }}
                      >
                        {/* Outline Layer */}
                        <div
                          className={`absolute inset-0 transition-colors duration-200 ${
                            isActive
                              ? 'bg-[#D4AF37]'
                              : 'bg-slate-200/90 group-hover:bg-[#D4AF37]/90'
                          }`}
                        />

                        {/* Inner Hexagon Container with Dedicated Safe Zone */}
                        <div
                          className={`absolute inset-[1.5px] transition-all duration-200 flex flex-col items-center justify-center px-1.5 py-2.5 sm:px-2 sm:py-3 lg:px-2.5 lg:py-3.5 text-center ${
                            isActive
                              ? 'bg-[#071A33] text-white shadow-inner'
                              : 'bg-[#FDFBF7] group-hover:bg-[#FAF9F6] text-[#071A33]'
                          }`}
                          style={{
                            clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                          }}
                        >
                          {/* Gold Editorial Number (11-12px) */}
                          <span className="font-mono text-[10px] sm:text-[11px] lg:text-[12px] font-bold text-[#D4AF37] tracking-wider mb-0.5">
                            {formattedNumber}
                          </span>

                          {/* Hero Programme Abbreviation (22-26px) */}
                          <span
                            className={`font-serif font-extrabold leading-none transition-colors duration-200 tracking-tight my-0.5 ${
                              course.code.length > 5 
                                ? 'text-sm sm:text-base lg:text-lg xl:text-[20px]' 
                                : 'text-base sm:text-xl lg:text-[23px] xl:text-[26px]'
                            } ${isActive ? 'text-white' : 'text-[#071A33] group-hover:text-[#1C5496]'}`}
                          >
                            {course.code}
                          </span>

                          {/* Full Name Lines (13-15px readable supporting text) */}
                          <div className="mt-0.5 space-y-0.5 max-w-[94%]">
                            {course.displayLines.map((line, lIdx) => (
                              <span
                                key={lIdx}
                                className={`block text-[9.5px] sm:text-[11px] lg:text-[12.5px] xl:text-[13.5px] font-semibold leading-[1.18] break-words transition-colors duration-200 ${
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

                      {/* DESKTOP CONTEXTUAL HOVER DETAIL OVERLAY */}
                      {isActive && (
                        <div
                          className={`hidden md:block absolute z-50 w-[300px] lg:w-[330px] bg-[#071A33] text-white p-5 rounded-2xl border border-slate-700/80 shadow-2xl backdrop-blur-md pointer-events-auto transition-all duration-200 animate-fadeIn ${
                            popoverPos.side === 'left'
                              ? 'right-[104%]'
                              : 'left-[104%]'
                          } ${
                            popoverPos.vertical === 'top'
                              ? 'top-0'
                              : popoverPos.vertical === 'bottom'
                              ? 'bottom-0'
                              : 'top-1/2 -translate-y-1/2'
                          }`}
                        >
                          {/* Top Header Badge */}
                          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-2.5">
                            <span className="text-xs font-bold uppercase tracking-widest text-[#FFD84A]">
                              {course.type === 'ug' ? 'UNDERGRADUATE' : 'POSTGRADUATE'}
                            </span>
                            <span className="bg-blue-900/70 text-[#FFD84A] text-xs px-2 py-0.5 rounded font-mono font-bold border border-blue-700/50">
                              {formattedNumber} · {course.code}
                            </span>
                          </div>

                          {/* Programme Title */}
                          <h4 className="font-serif font-extrabold text-lg sm:text-xl text-white leading-snug">
                            {course.title}
                          </h4>

                          {/* Duration Badge */}
                          <div className="flex items-center space-x-1.5 text-xs text-slate-300 mt-1.5 font-medium">
                            <Clock className="w-3.5 h-3.5 text-[#FFD84A] shrink-0" />
                            <span>{course.duration}</span>
                          </div>

                          {/* Academic Overview Description */}
                          <p className="text-sm text-slate-300 leading-relaxed mt-2 line-clamp-3">
                            {course.description}
                          </p>

                          {/* Working Exploration Action */}
                          <div className="pt-3 mt-3 border-t border-slate-800 flex items-center justify-between">
                            <Link
                              to={course.link || `/academics/${course.id}`}
                              className="text-sm font-bold text-[#FFD84A] hover:text-[#FFC928] inline-flex items-center transition-colors group/link cursor-pointer"
                            >
                              <span>Explore Programme</span>
                              <ArrowRight className="w-4 h-4 ml-1.5 group-hover/link:translate-x-1 transition-transform" />
                            </Link>
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

        {/* MOBILE CONTEXTUAL DETAIL DRAWER */}
        {activeCourse && (
          <div className="block md:hidden max-w-md mx-auto bg-[#071A33] text-white p-5 rounded-2xl border border-slate-800 shadow-xl space-y-3 animate-fadeIn mt-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold uppercase tracking-widest text-[#FFD84A]">
                {activeCourse.type === 'ug' ? 'UNDERGRADUATE' : 'POSTGRADUATE'}
              </span>
              <button
                onClick={() => setSelectedCourse(null)}
                className="p-1 rounded text-slate-400 hover:text-white cursor-pointer"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="font-serif font-bold text-lg text-white">
              {activeCourse.title}
            </h3>

            <div className="flex items-center space-x-1.5 text-sm text-slate-300">
              <Clock className="w-4 h-4 text-[#FFD84A]" />
              <span>{activeCourse.duration}</span>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed">
              {activeCourse.description}
            </p>

            <div className="pt-2">
              <Link
                to={activeCourse.link || `/academics/${activeCourse.id}`}
                className="btn-gold px-4 py-2.5 rounded-lg text-sm font-bold inline-flex items-center w-full justify-center"
              >
                <span>Explore Programme</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Link>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
