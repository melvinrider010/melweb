import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, X, BookOpen, Sparkles, CheckCircle2, ChevronRight, Layers, Loader2 } from 'lucide-react';
import { getProgrammes } from '../../services/programmesService';
import honeycombData from '../../data/honeycomb-programmes.json';
import cmsStore from '../../lib/cmsStore';

export default function CourseHoneycombSection() {
  const [filter, setFilter] = useState('ug'); // 'ug', 'pg', 'all'
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [popoverPos, setPopoverPos] = useState({ side: 'right', vertical: 'center' });

  // 1. Instant Synchronous Seeding from Store / JSON (0ms latency, zero flash of empty state)
  const [allProgrammes, setAllProgrammes] = useState(() => {
    try {
      const fromStore = cmsStore.getProgrammes ? cmsStore.getProgrammes() : null;
      if (fromStore && fromStore.length > 0) return fromStore;
    } catch (e) {}
    return honeycombData || [];
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function loadProgrammes() {
      try {
        const data = await getProgrammes();
        if (isMounted && Array.isArray(data) && data.length > 0) {
          const hcMap = new Map((honeycombData || []).map(hc => [(hc.code || hc.id || '').toUpperCase(), hc]));
          const merged = data.map(p => {
            const key = (p.code || p.id || '').toUpperCase();
            const hc = hcMap.get(key) || {};
            return {
              ...hc,
              ...p,
              id: p.id || hc.id || p.code,
              code: p.code || hc.code,
              type: (p.level || p.type || hc.type || 'ug').toLowerCase(),
              displayLines: p.displayLines || hc.displayLines || [p.title || p.name || p.code],
              duration: p.duration || hc.duration || '3 Years / 4 Years (NEP 2020)',
              description: p.overview || p.description || hc.description,
              link: p.link || hc.link || `/academics/${(p.slug || p.code || p.id).toLowerCase()}`
            };
          });
          setAllProgrammes(merged);
        }
      } catch (err) {
        // Retain pre-loaded programmes seamlessly
      }
    }
    loadProgrammes();
    return () => { isMounted = false; };
  }, []);

  // Filter dataset based on active status and honeycomb toggle
  const filteredCourses = allProgrammes
    .filter((item) => {
      const isDraft = item.status === 'draft' || item.status === 'inactive' || item.status === 'deleted';
      const isPublished = !isDraft && (item.status === 'published' || !item.status);
      const isHoneycombEnabled = item.isFeaturedHoneycomb !== false;

      if (!isPublished || !isHoneycombEnabled) return false;

      const itemType = (item.type || item.level || 'ug').toLowerCase();
      if (filter === 'all') return true;
      const isUG = itemType === 'ug' || itemType.startsWith('ug') || itemType.startsWith('undergrad');
      const isPG = itemType === 'pg' || itemType.startsWith('pg') || itemType.startsWith('postgrad');
      if (filter === 'ug') return isUG;
      if (filter === 'pg') return isPG;
      return true;
    })
    .map((p) => {
      const code = p.code || p.id || p.name || 'COURSE';
      const id = p.id || code;
      let displayLines = p.displayLines;
      if (!displayLines || !Array.isArray(displayLines) || displayLines.length === 0) {
        const titleWords = (p.title || p.name || code).split(' ');
        if (titleWords.length > 2) {
          displayLines = [
            titleWords.slice(0, Math.ceil(titleWords.length / 2)).join(' '),
            titleWords.slice(Math.ceil(titleWords.length / 2)).join(' ')
          ];
        } else {
          displayLines = [p.title || p.name || code];
        }
      }
      return {
        ...p,
        id,
        code,
        displayLines,
        type: (p.type || p.level || 'ug').toLowerCase(),
        title: p.title || p.name || code,
        duration: p.duration || '3 Years / 4 Years (NEP 2020)',
        description: p.description || p.overview || 'Comprehensive degree programme offering advanced curricular exploration, laboratory skills, and career pathways at St. Philomena’s College.',
        link: p.link || `/academics/${(p.slug || code || id).toLowerCase()}`
      };
    });

  // Build authentic interlocking honeycomb matrix (staggered rows with 9 proper blocks + transparent background blocks)
  const rows = useMemo(() => {
    const byCode = new Map();
    filteredCourses.forEach((c) => {
      const codeKey = (c.code || c.id || '').toUpperCase().replace(/[\s.-]/g, '');
      byCode.set(codeKey, c);
    });

    const getCourse = (key, fallbackIdx) => {
      return byCode.get(key) || filteredCourses[fallbackIdx] || null;
    };

    if (filter === 'ug') {
      // 9 Proper UG Blocks (matching user screenshot)
      const bcom = getCourse('BCOM', 0) || { id: 'bcom', code: 'BCOM', title: 'Bachelor of Commerce', displayLines: ['Bachelor of', 'Commerce (B.Com)'], link: '/academics/bcom', duration: '3 Years / 4 Years (NEP 2020)', description: 'Comprehensive commercial degree covering corporate accounting, GST taxation, banking operations, and financial markets.' };
      const bsc = getCourse('BSC', 1) || { id: 'bsc', code: 'BSC', title: 'Bachelor of Science (B.Sc)', displayLines: ['Bachelor of', 'Science (B.Sc)'], link: '/academics/bsc', duration: '3 Years / 4 Years (NEP 2020)', description: 'Diverse science specializations including Physics, Chemistry, Mathematics, Computer Science, and Biotechnology.' };
      const bca = getCourse('BCA', 2) || { id: 'bca', code: 'BCA', title: 'Bachelor of Computer Applications', displayLines: ['Bachelor of', 'Computer Applications'], link: '/academics/bca', duration: '3 Years / 4 Years (NEP 2020)', description: 'Comprehensive technology degree in software engineering, full-stack web development, Python, and AI applications.' };
      const ba = getCourse('BA', 3) || { id: 'ba', code: 'BA', title: 'Bachelor of Arts (Humanities)', displayLines: ['Bachelor of', 'Arts (Humanities)'], link: '/academics/ba', duration: '3 Years / 4 Years (NEP 2020)', description: 'Multidisciplinary humanities streams including Journalism, Economics, Political Science, and English Literature.' };
      const bsw = getCourse('BSW', 4) || { id: 'bsw', code: 'BSW', title: 'Bachelor of Social Work', displayLines: ['Bachelor of', 'Social Work'], link: '/academics/bsw', duration: '3 Years / 4 Years (NEP 2020)', description: 'Professional community service degree integrating fieldwork, NGO administration, social policy, counseling, and human rights advocacy.' };
      const bba = getCourse('BBA', 5) || { id: 'bba', code: 'BBA', title: 'Bachelor of Business Administration', displayLines: ['Bachelor of', 'Business Administration'], link: '/academics/bba', duration: '3 Years / 4 Years (NEP 2020)', description: 'Professional managerial training in marketing, financial management, HR, organizational leadership, and entrepreneurship.' };
      const bbath = getCourse('BBATH', 6) || { id: 'bba-th', code: 'BBA-TH', title: 'Tourism & Hospitality Mgmt', displayLines: ['Tourism &', 'Hospitality Mgmt'], link: '/academics/bba-th', duration: '3 Years / 4 Years (NEP 2020)', description: 'Specialized degree in global aviation, hotel management, eco-tourism, travel agency operations, and event management.' };
      const bvoc = getCourse('BVOC', 7) || { id: 'bvoc', code: 'BVOC', title: 'Bachelor of Vocation (B.Voc)', displayLines: ['Bachelor of', 'Vocation (B.Voc)'], link: '/academics/bvoc', duration: '3 Years (NSQF Level 7)', description: 'Hands-on vocational degrees in Digital Media & Animation, Healthcare Technology, and Software Development aligned with UGC NSQF.' };
      const lang = getCourse('LANG', 8) || { id: 'lang', code: 'LANG', title: 'Department of Languages & Literature', displayLines: ['Department of', 'Languages & Literature'], link: '/academics/departments/dept-languages', duration: 'Course-aligned', description: 'Language foundation and elective literature courses in English, Kannada, Hindi, French, Malayalam, and Urdu with digital language laboratory access.' };

      return [
        // Row 0: Ambient Crown (6 items, creates the top staggered honeycomb apex)
        [
          { type: 'bg', id: 'c-0', label: 'SPC', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' },
          { type: 'bg', id: 'c-1', label: 'COMMERCE', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'c-2', label: 'SCIENCE', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'c-3', label: 'ARTS', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'c-4', label: 'MANAGEMENT', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'c-5', label: 'TECH', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' }
        ],
        // Row 1: 7 items (2 BG on flanks, 3 PROPER BLOCKS in center, 2 BG on flanks)
        [
          { type: 'bg', id: 'r1-0', opacity: 'opacity-30 hidden md:block' },
          { type: 'bg', id: 'r1-1', label: 'ESTD 1946', icon: Sparkles, opacity: 'opacity-60' },
          { type: 'proper', course: bcom, displayCode: 'BCOM', displayLines: ['Bachelor of', 'Commerce (B.Com)'] },
          { type: 'proper', course: bsc, displayCode: 'BSC', displayLines: ['Bachelor of', 'Science (B.Sc)'] },
          { type: 'proper', course: bca, displayCode: 'BCA', displayLines: ['Bachelor of', 'Computer Applications'] },
          { type: 'bg', id: 'r1-5', label: 'NAAC A+', icon: CheckCircle2, opacity: 'opacity-60' },
          { type: 'bg', id: 'r1-6', opacity: 'opacity-30 hidden md:block' }
        ],
        // Row 2: 8 items (2 BG on flanks, 4 PROPER BLOCKS in center, 2 BG on flanks - offset by half width!)
        [
          { type: 'bg', id: 'r2-0', opacity: 'opacity-25 hidden lg:block' },
          { type: 'bg', id: 'r2-1', label: 'AUTONOMOUS', icon: BookOpen, opacity: 'opacity-60' },
          { type: 'proper', course: ba, displayCode: 'BA', displayLines: ['Bachelor of', 'Arts (Humanities)'] },
          { type: 'proper', course: bsw, displayCode: 'BSW', displayLines: ['Bachelor of', 'Social Work'] },
          { type: 'proper', course: bba, displayCode: 'BBA', displayLines: ['Bachelor of', 'Business Administration'] },
          { type: 'proper', course: bbath, displayCode: 'BBA-TH', displayLines: ['Tourism &', 'Hospitality Mgmt'] },
          { type: 'bg', id: 'r2-6', label: 'NEP 2020', icon: Layers, opacity: 'opacity-60' },
          { type: 'bg', id: 'r2-7', opacity: 'opacity-25 hidden lg:block' }
        ],
        // Row 3: 7 items (3 BG, 2 PROPER BLOCKS in center, 2 BG - aligned with Row 1!)
        [
          { type: 'bg', id: 'r3-0', opacity: 'opacity-30 hidden md:block' },
          { type: 'bg', id: 'r3-1', label: 'EXCELLENCE', opacity: 'opacity-55' },
          { type: 'bg', id: 'r3-2', label: 'SKILLS', icon: Layers, opacity: 'opacity-55' },
          { type: 'proper', course: bvoc, displayCode: 'BVOC', displayLines: ['Bachelor of', 'Vocation (B.Voc)'] },
          { type: 'proper', course: lang, displayCode: 'LANG', displayLines: ['Department of', 'Languages & Literature'] },
          { type: 'bg', id: 'r3-5', label: 'INNOVATION', icon: Sparkles, opacity: 'opacity-55' },
          { type: 'bg', id: 'r3-6', opacity: 'opacity-30 hidden md:block' }
        ],
        // Row 4: Ambient Base (6 items, completes the bottom interlocking skirt)
        [
          { type: 'bg', id: 'b-0', label: 'CAMPUS', opacity: 'opacity-25 hidden lg:block' },
          { type: 'bg', id: 'b-1', label: 'COMMUNITY', opacity: 'opacity-35 hidden sm:block' },
          { type: 'bg', id: 'b-2', label: 'HOLISTIC', icon: Sparkles, opacity: 'opacity-40' },
          { type: 'bg', id: 'b-3', label: 'LEADERSHIP', icon: BookOpen, opacity: 'opacity-40' },
          { type: 'bg', id: 'b-4', label: 'RESEARCH', opacity: 'opacity-35 hidden sm:block' },
          { type: 'bg', id: 'b-5', label: 'CAREERS', opacity: 'opacity-25 hidden lg:block' }
        ]
      ];
    } else if (filter === 'pg') {
      // 6 PG programmes: MCA, MBA, M.Com, M.Sc, M.A, MSW
      const mca = getCourse('MCA', 0);
      const mba = getCourse('MBA', 1);
      const mcom = getCourse('MCOM', 2);
      const msc = getCourse('MSC', 3);
      const ma = getCourse('MA', 4);
      const msw = getCourse('MSW', 5);

      return [
        // Row 0
        [
          { type: 'bg', id: 'pg-c0', label: 'SPC', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' },
          { type: 'bg', id: 'pg-c1', label: 'POSTGRADUATE', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'pg-c2', label: 'RESEARCH', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'pg-c3', label: 'AICTE', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'pg-c4', label: 'INNOVATION', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'pg-c5', label: 'UGC-CARE', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' }
        ],
        // Row 1 (7 items: 2 BG, 3 Proper, 2 BG)
        [
          { type: 'bg', id: 'pg-r1-0', opacity: 'opacity-30 hidden md:block' },
          { type: 'bg', id: 'pg-r1-1', label: 'ESTD 1946', icon: Sparkles, opacity: 'opacity-60' },
          { type: 'proper', course: mca, displayCode: 'MCA', displayLines: ['Master of', 'Computer Applications'] },
          { type: 'proper', course: mba, displayCode: 'MBA', displayLines: ['Master of', 'Business Administration'] },
          { type: 'proper', course: mcom, displayCode: 'M.COM', displayLines: ['Master of', 'Commerce (M.Com)'] },
          { type: 'bg', id: 'pg-r1-5', label: 'NAAC A+', icon: CheckCircle2, opacity: 'opacity-60' },
          { type: 'bg', id: 'pg-r1-6', opacity: 'opacity-30 hidden md:block' }
        ],
        // Row 2 (8 items: 2 BG, 3 Proper, 3 BG)
        [
          { type: 'bg', id: 'pg-r2-0', opacity: 'opacity-25 hidden lg:block' },
          { type: 'bg', id: 'pg-r2-1', label: 'AUTONOMOUS', icon: BookOpen, opacity: 'opacity-60' },
          { type: 'proper', course: msc, displayCode: 'M.SC', displayLines: ['Master of', 'Science (M.Sc)'] },
          { type: 'proper', course: ma, displayCode: 'M.A', displayLines: ['Master of', 'Arts (M.A)'] },
          { type: 'proper', course: msw, displayCode: 'MSW', displayLines: ['Master of', 'Social Work'] },
          { type: 'bg', id: 'pg-r2-5', label: 'CBCS / NEP', icon: Layers, opacity: 'opacity-60' },
          { type: 'bg', id: 'pg-r2-6', label: 'EXCELLENCE', opacity: 'opacity-45' },
          { type: 'bg', id: 'pg-r2-7', opacity: 'opacity-25 hidden lg:block' }
        ],
        // Row 3 (7 items BG)
        [
          { type: 'bg', id: 'pg-r3-0', opacity: 'opacity-30 hidden md:block' },
          { type: 'bg', id: 'pg-r3-1', label: 'PUBLICATIONS', opacity: 'opacity-50' },
          { type: 'bg', id: 'pg-r3-2', label: 'LABS', icon: Layers, opacity: 'opacity-50' },
          { type: 'bg', id: 'pg-r3-3', label: 'SEMINARS', opacity: 'opacity-50' },
          { type: 'bg', id: 'pg-r3-4', label: 'SYMPOSIUMS', opacity: 'opacity-50' },
          { type: 'bg', id: 'pg-r3-5', label: 'FELLOWSHIPS', icon: Sparkles, opacity: 'opacity-50' },
          { type: 'bg', id: 'pg-r3-6', opacity: 'opacity-30 hidden md:block' }
        ],
        // Row 4
        [
          { type: 'bg', id: 'pg-b0', label: 'PLACEMENTS', opacity: 'opacity-25 hidden lg:block' },
          { type: 'bg', id: 'pg-b1', label: 'ALUMNI', opacity: 'opacity-35 hidden sm:block' },
          { type: 'bg', id: 'pg-b2', label: 'FUTURE', icon: Sparkles, opacity: 'opacity-40' },
          { type: 'bg', id: 'pg-b3', label: 'GLOBAL', icon: BookOpen, opacity: 'opacity-40' },
          { type: 'bg', id: 'pg-b4', label: 'COMMUNITY', opacity: 'opacity-35 hidden sm:block' },
          { type: 'bg', id: 'pg-b5', label: 'CAREERS', opacity: 'opacity-25 hidden lg:block' }
        ]
      ];
    } else {
      // 'all' programmes: 15 programmes distributed across the 3 core rows with surrounding ambient cells
      const allProgs = [...filteredCourses];
      const r1Courses = allProgs.slice(0, 5);
      const r2Courses = allProgs.slice(5, 11);
      const r3Courses = allProgs.slice(11, 15);

      return [
        // Row 0
        [
          { type: 'bg', id: 'all-c0', label: 'SPC', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' },
          { type: 'bg', id: 'all-c1', label: 'UG & PG', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'all-c2', label: 'ACADEMICS', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'all-c3', label: 'AUTONOMOUS', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'all-c4', label: 'DISCIPLINES', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'all-c5', label: 'EXCELLENCE', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' }
        ],
        // Row 1 (7 items: 1 BG, 5 Proper, 1 BG)
        [
          { type: 'bg', id: 'all-r1-0', label: 'ESTD 1946', icon: Sparkles, opacity: 'opacity-60' },
          ...r1Courses.map((c) => ({
            type: 'proper',
            course: c,
            displayCode: (c.code || '').replace(/\./g, '').toUpperCase(),
            displayLines: c.displayLines
          })),
          { type: 'bg', id: 'all-r1-6', label: 'NAAC A+', icon: CheckCircle2, opacity: 'opacity-60' }
        ],
        // Row 2 (8 items: 1 BG, 6 Proper, 1 BG - offset!)
        [
          { type: 'bg', id: 'all-r2-0', label: 'NEP 2020', icon: Layers, opacity: 'opacity-60' },
          ...r2Courses.map((c) => ({
            type: 'proper',
            course: c,
            displayCode: (c.code || '').replace(/\./g, '').toUpperCase(),
            displayLines: c.displayLines
          })),
          { type: 'bg', id: 'all-r2-7', label: 'AUTONOMY', icon: BookOpen, opacity: 'opacity-60' }
        ],
        // Row 3 (7 items: 1 BG, 4 Proper, 2 BG)
        [
          { type: 'bg', id: 'all-r3-0', label: 'HOLISTIC', opacity: 'opacity-55' },
          ...r3Courses.map((c) => ({
            type: 'proper',
            course: c,
            displayCode: (c.code || '').replace(/\./g, '').toUpperCase(),
            displayLines: c.displayLines
          })),
          { type: 'bg', id: 'all-r3-5', label: 'SKILLS', icon: Layers, opacity: 'opacity-55' },
          { type: 'bg', id: 'all-r3-6', label: 'INNOVATION', icon: Sparkles, opacity: 'opacity-55' }
        ],
        // Row 4
        [
          { type: 'bg', id: 'all-b0', label: 'CAMPUS', opacity: 'opacity-25 hidden lg:block' },
          { type: 'bg', id: 'all-b1', label: 'COMMUNITY', opacity: 'opacity-35 hidden sm:block' },
          { type: 'bg', id: 'all-b2', label: 'FUTURE', icon: Sparkles, opacity: 'opacity-40' },
          { type: 'bg', id: 'all-b3', label: 'GLOBAL', icon: BookOpen, opacity: 'opacity-40' },
          { type: 'bg', id: 'all-b4', label: 'RESEARCH', opacity: 'opacity-35 hidden sm:block' },
          { type: 'bg', id: 'all-b5', label: 'CAREERS', opacity: 'opacity-25 hidden lg:block' }
        ]
      ];
    }
  }, [filteredCourses, filter]);

  const handleMouseEnter = (course, colIdx, rowLength, rowIndex, totalRows) => {
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
  };

  return (
    <section className="bg-[#f8f9fc] text-[#0B1F4E] py-12 sm:py-16 px-3 sm:px-6 lg:px-8 border-y border-slate-200/80 relative overflow-hidden">
      
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
                strokeOpacity="0.04"
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

        {/* AUTHENTIC INTERLOCKING HONEYCOMB MATRIX */}
        <div 
          key={filter}
          className="w-full overflow-x-auto custom-scrollbar-hidden py-4 px-1"
        >
          <div className="min-w-fit mx-auto flex flex-col items-center justify-center relative animate-fadeIn">
            {isLoading && rows.length === 0 ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 text-[#C9A84C] animate-spin" />
                <span className="text-xs font-mono text-slate-500 uppercase tracking-wider">Loading Academic Streams...</span>
              </div>
            ) : rows.length === 0 ? (
              <div className="py-10 px-6 text-center bg-white rounded-2xl border border-slate-200/80 shadow-xs max-w-md mx-auto space-y-2">
                <span className="inline-block p-2 rounded-full bg-slate-100 text-slate-500 font-mono text-xs font-bold uppercase">
                  Offline Showcase
                </span>
                <h3 className="font-serif font-bold text-base text-slate-800">No Programmes Currently Active</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  All degree programmes in this stream have been switched off or hidden from the Honeycomb grid in the Metronic Admin CMS.
                </p>
              </div>
            ) : (
              rows.map((rowItems, rowIndex) => {
                const isEvenRow = rowIndex % 2 === 1;
                return (
                  <div
                    key={rowIndex}
                    className={`flex flex-nowrap items-center justify-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5 transition-all duration-300 ${
                      rowIndex > 0 ? '-mt-5 sm:-mt-6 md:-mt-7 lg:-mt-8' : ''
                    }`}
                  >
                    {rowItems.map((cell, colIdx) => {
                      if (cell.type === 'bg') {
                        // Ambient / Decorative Transparent Background Block
                        const Icon = cell.icon;
                        return (
                          <div
                            key={cell.id}
                            className={`relative w-[110px] h-[126px] sm:w-[125px] sm:h-[144px] md:w-[138px] md:h-[158px] lg:w-[148px] lg:h-[170px] p-[1.5px] select-none pointer-events-none transition-all duration-300 ${cell.opacity || 'opacity-40'} ${cell.extra || ''}`}
                            style={{
                              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                            }}
                            aria-hidden="true"
                          >
                            {/* Translucent border layer */}
                            <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/35 via-slate-300/30 to-[#0B1F4E]/15" />

                            {/* Translucent glass inner layer */}
                            <div
                              className="absolute inset-[1.5px] bg-white/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-2 text-center"
                              style={{
                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                              }}
                            >
                              {Icon && <Icon className="w-4 h-4 text-[#C9A84C]/45 mb-0.5" />}
                              {cell.label ? (
                                <span className="text-[8.5px] sm:text-[9.5px] md:text-[10px] font-mono font-bold tracking-widest text-[#0B1F4E]/35 uppercase">
                                  {cell.label}
                                </span>
                              ) : (
                                <div className="w-1.5 h-1.5 rounded-full bg-[#C9A84C]/30" />
                              )}
                            </div>
                          </div>
                        );
                      }

                      // PROPER ACADEMIC PROGRAMME BLOCK
                      const course = cell.course;
                      if (!course) return null;

                      const displayCode = cell.displayCode || course.code || 'COURSE';
                      const displayLines = cell.displayLines || course.displayLines || [course.title || displayCode];
                      const isHovered = Boolean(hoveredCourse && (hoveredCourse.id === course.id || hoveredCourse.code === course.code));
                      const isSelected = Boolean(selectedCourse && (selectedCourse.id === course.id || selectedCourse.code === course.code));
                      const isActive = isHovered || isSelected;

                      return (
                        <div
                          key={course.id || course.code}
                          className={`relative group transition-all duration-200 ${isActive ? 'z-40' : 'z-20'}`}
                          onMouseEnter={() => handleMouseEnter(course, colIdx, rowItems.length, rowIndex, rows.length)}
                          onMouseLeave={handleMouseLeave}
                          onClick={() => handleCourseClick(course)}
                        >
                          {/* Hexagonal Card */}
                          <div
                            className={`relative w-[110px] h-[126px] sm:w-[125px] sm:h-[144px] md:w-[138px] md:h-[158px] lg:w-[148px] lg:h-[170px] p-[2px] cursor-pointer transition-all duration-300 ${
                              isActive ? 'scale-105 drop-shadow-xl z-30' : 'hover:scale-102 hover:drop-shadow-lg drop-shadow-xs'
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
                              className={`absolute inset-[2px] transition-all duration-200 flex flex-col items-center justify-center px-1.5 py-2 sm:px-2 sm:py-2.5 text-center ${
                                isActive
                                  ? 'bg-[#0B1F4E] text-white shadow-inner'
                                  : 'bg-white group-hover:bg-[#f8f9fc] text-[#0B1F4E]'
                              }`}
                              style={{
                                clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                              }}
                            >
                              {/* Hero Programme Abbreviation */}
                              <span
                                className={`font-serif font-black leading-none transition-colors duration-200 tracking-tight my-0.5 ${
                                  displayCode.length > 5 
                                    ? 'text-xs sm:text-sm md:text-base lg:text-lg' 
                                    : 'text-sm sm:text-base md:text-xl lg:text-2xl'
                                } ${isActive ? 'text-white' : 'text-[#0B1F4E] group-hover:text-[#a88530]'}`}
                              >
                                {displayCode}
                              </span>

                              {/* Full Name Lines */}
                              <div className="mt-0.5 space-y-0.5 max-w-[94%]">
                                {displayLines.map((line, lIdx) => (
                                  <span
                                    key={lIdx}
                                    className={`block text-[8.5px] sm:text-[9.5px] md:text-[10px] lg:text-[11px] font-semibold leading-[1.18] break-words transition-colors duration-200 ${
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
                          )}

                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
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
              <span className="w-10 h-10 rounded-lg bg-[#0B1F4E] text-[#F0D98C] font-serif font-extrabold text-base flex items-center justify-center border border-[#C9A84C]/40 shrink-0">
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
