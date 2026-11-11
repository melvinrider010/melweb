import re

with open('temp_head_honeycomb.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Update PG fallbacks
old_pg = """    } else if (filter === 'pg') {
      // 6 PG programmes: MCA, MBA, M.Com, M.Sc, M.A, MSW
      const mca = getCourse('MCA', 0);
      const mba = getCourse('MBA', 1);
      const mcom = getCourse('MCOM', 2);
      const msc = getCourse('MSC', 3);
      const ma = getCourse('MA', 4);
      const msw = getCourse('MSW', 5);"""

new_pg = """    } else if (filter === 'pg') {
      // 6 PG programmes: MCA, MBA, M.Com, M.Sc, M.A, MSW
      const mca = getCourse('MCA', 0) || { id: 'mca', code: 'MCA', title: 'Master of Computer Applications', displayLines: ['Master of', 'Computer Applications'], link: '/departments/bca', duration: '2 Years (AICTE Approved)', description: 'Advanced computing degree specializing in cloud engineering, AI/ML systems, enterprise architecture, and cyber defense.' };
      const mba = getCourse('MBA', 1) || { id: 'mba', code: 'MBA', title: 'Master of Business Administration', displayLines: ['Master of', 'Business Administration'], link: '/departments/management', duration: '2 Years (AICTE Approved)', description: 'Elite business leadership program covering finance, marketing, HRM, analytics, strategic consulting, and corporate governance.' };
      const mcom = getCourse('MCOM', 2) || { id: 'mcom', code: 'M.Com', title: 'Master of Commerce', displayLines: ['Master of', 'Commerce (M.Com)'], link: '/departments/commerce', duration: '2 Years', description: 'Advanced financial accounting, taxation strategies, corporate restructuring, international trade, and investment portfolio analysis.' };
      const msc = getCourse('MSC', 3) || { id: 'msc', code: 'M.Sc', title: 'Master of Science', displayLines: ['Master of', 'Science (M.Sc)'], link: '/departments/physics', duration: '2 Years', description: 'Postgraduate scientific research and laboratory investigations in Physics, Chemistry, Mathematics, Computer Science, and Biosciences.' };
      const ma = getCourse('MA', 4) || { id: 'ma', code: 'M.A', title: 'Master of Arts', displayLines: ['Master of', 'Arts (M.A)'], link: '/departments/history', duration: '2 Years', description: 'Advanced humanities research degrees in English Literature, Journalism, Economics, and Mass Communication.' };
      const msw = getCourse('MSW', 5) || { id: 'msw', code: 'MSW', title: 'Master of Social Work', displayLines: ['Master of', 'Social Work'], link: '/departments/social-work', duration: '2 Years', description: 'Specialized clinical, psychiatric, and community development fieldwork preparing professional NGO and human relations leaders.' };"""

assert old_pg in text, 'old_pg not found'
text = text.replace(old_pg, new_pg, 1)

# 2. Update Mouse Handlers and activeCourse
old_mouse_handlers = """  const handleMouseEnter = (course, colIdx, rowLength, rowIndex, totalRows) => {
    setHoveredCourse(course);
    const isRightSide = colIdx >= Math.floor(rowLength / 2);
    const isTopRow = rowIndex === 0 || rowIndex === 1;
    const isBottomRow = rowIndex >= totalRows - 2;

    setPopoverPos({
      side: isRightSide ? 'left' : 'right',
      vertical: isTopRow ? 'top' : isBottomRow ? 'bottom' : 'center'
    });
  };

  const handleMouseLeave = () => {
    setHoveredCourse(null);
  };

  const handleCourseClick = (course) => {
    if (selectedCourse && (selectedCourse.id === course.id || selectedCourse.code === course.code)) {
      setSelectedCourse(null);
    } else {
      setSelectedCourse(course);
    }
  };"""

new_mouse_handlers = """  // Active course state: hovered course takes priority; otherwise selected/tapped course.
  const activeCourse = hoveredCourse || selectedCourse;

  const handleMouseEnter = (course, colIdx, rowLength, rowIndex, totalRows) => {
    setHoveredCourse(course);
    const mid = Math.floor(rowLength / 2);
    // colIdx < mid opens to left flank; colIdx >= mid opens to right flank
    const side = colIdx < mid ? 'left' : 'right';
    const isTopRow = rowIndex <= 1;
    const isBottomRow = rowIndex >= totalRows - 2;
    const vertical = isTopRow ? 'top' : isBottomRow ? 'bottom' : 'center';

    setPopoverPos({ side, vertical });
  };

  const handleMouseLeave = () => {
    setHoveredCourse(null);
  };

  const handleCourseClick = (course) => {
    if (selectedCourse && (selectedCourse.id === course.id || selectedCourse.code === course.code)) {
      setSelectedCourse(null);
      setHoveredCourse(null);
    } else {
      setSelectedCourse(course);
      setHoveredCourse(course);
    }
  };"""

assert old_mouse_handlers in text, 'old_mouse_handlers not found'
text = text.replace(old_mouse_handlers, new_mouse_handlers, 1)

# 3. Update Cell isActive check
old_cell_start = """                      // PROPER ACADEMIC PROGRAMME BLOCK
                      const course = cell.course;
                      if (!course) return null;

                      const displayCode = cell.displayCode || course.code || 'COURSE';
                      const displayLines = cell.displayLines || course.displayLines || [course.title || displayCode];
                      const isHovered = Boolean(hoveredCourse && (hoveredCourse.id === course.id || hoveredCourse.code === course.code));
                      const isSelected = Boolean(selectedCourse && (selectedCourse.id === course.id || selectedCourse.code === course.code));
                      const isActive = isHovered || isSelected;"""

new_cell_start = """                      // PROPER ACADEMIC PROGRAMME BLOCK
                      const course = cell.course;
                      if (!course) return null;

                      const displayCode = cell.displayCode || course.code || 'COURSE';
                      const displayLines = cell.displayLines || course.displayLines || [course.title || displayCode];
                      
                      // Active state: exactly ONE course is active at any time (hovered or selected)
                      const isCurrentCourseActive = Boolean(
                        activeCourse && (
                          (activeCourse.id && (activeCourse.id === course.id || activeCourse.id === course.code)) ||
                          (activeCourse.code && (activeCourse.code === course.code || activeCourse.code === course.id))
                        )
                      );
                      const isActive = isCurrentCourseActive;"""

assert old_cell_start in text, 'old_cell_start not found'
text = text.replace(old_cell_start, new_cell_start, 1)

# 4. Update the popup block inside the cell
old_popover_block = """                          {/* DESKTOP CONTEXTUAL HOVER DETAIL POPOVER */}
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
                                <span className="bg-[#0B1F4E] text-[#F0D98C] text-xs px-2.5 py-0.5 rounded font-mono font-bold border border-[#C9A84C]/40">
                                  {displayCode}
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
                          )}"""

new_popover_block = """                          {/* FLOATING HOVER / TAP DETAIL POPOVER (OVERLAY) */}
                          {isActive && (
                            <>
                              {/* Desktop Hover Floating Popover */}
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
                                  <div className="flex items-center space-x-2">
                                    <span className="bg-[#0B1F4E] text-[#F0D98C] text-xs px-2.5 py-0.5 rounded font-mono font-bold border border-[#C9A84C]/40">
                                      {displayCode}
                                    </span>
                                    {selectedCourse && (
                                      <button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedCourse(null);
                                          setHoveredCourse(null);
                                        }}
                                        className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                                        aria-label="Close"
                                      >
                                        <X className="w-3.5 h-3.5" />
                                      </button>
                                    )}
                                  </div>
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
                                    to={course.link || `/departments/${course.id}`}
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

                              {/* Mobile Tap Floating Popup Overlay */}
                              <div
                                className="block md:hidden fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fadeIn"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedCourse(null);
                                  setHoveredCourse(null);
                                }}
                              >
                                <div
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full max-w-[340px] bg-white text-[#0B1F4E] p-5 rounded-2xl border-2 border-[#C9A84C]/60 shadow-2xl pointer-events-auto animate-scaleUp text-left"
                                >
                                  {/* Top Header Badge */}
                                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-3 gap-2">
                                    <div className="flex items-center space-x-2">
                                      <span className="badge-type badge-important text-[10px] px-2 py-0.5">
                                        {course.type === 'ug' ? 'UNDERGRADUATE' : 'POSTGRADUATE'}
                                      </span>
                                      <span className="text-[10px] font-mono font-bold text-slate-400">NEP 2020</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <span className="bg-[#0B1F4E] text-[#F0D98C] text-xs px-2.5 py-0.5 rounded font-mono font-bold border border-[#C9A84C]/40">
                                        {displayCode}
                                      </span>
                                      <button
                                        onClick={() => {
                                          setSelectedCourse(null);
                                          setHoveredCourse(null);
                                        }}
                                        className="p-1 rounded text-slate-400 hover:text-slate-700 cursor-pointer"
                                        aria-label="Close"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
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
                                      to={course.link || `/departments/${course.id}`}
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
                              </div>
                            </>
                          )}"""

assert old_popover_block in text, 'old_popover_block not found'
text = text.replace(old_popover_block, new_popover_block, 1)

# 5. Remove the old mobile contextual drawer below honeycomb
old_mobile_drawer_marker = """        {/* MOBILE CONTEXTUAL DETAIL DRAWER (FOR TOUCH DEVICES) */}"""
idx_drawer = text.find(old_mobile_drawer_marker)
assert idx_drawer != -1, 'old_mobile_drawer_marker not found'

end_marker = """      </div>
    </section>"""
idx_end = text.find(end_marker, idx_drawer)
assert idx_end != -1, 'end_marker not found'

text = text[:idx_drawer] + text[idx_end:]

# Write to src/components/home/CourseHoneycombSection.jsx
with open('src/components/home/CourseHoneycombSection.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('SUCCESSFULLY RESTORED CourseHoneycombSection.jsx')
