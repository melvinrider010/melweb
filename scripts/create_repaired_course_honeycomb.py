new_code = '''import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, X, BookOpen, Sparkles, CheckCircle2, ChevronRight, Layers, Loader2, ExternalLink } from 'lucide-react';
import { getProgrammes } from '../../services/programmesService';
import honeycombData from '../../data/honeycomb-programmes.json';
import cmsStore from '../../lib/cmsStore';

export default function CourseHoneycombSection() {
  const [filter, setFilter] = useState('ug'); // 'ug', 'pg', 'all'
  const [hoveredCourse, setHoveredCourse] = useState(null);
  const [selectedCourse, setSelectedCourse] = useState(null);

  // 1. Instant Synchronous Seeding from Store / JSON
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
          const normalizeKey = (k) => String(k || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
          const serverMap = new Map(data.map(p => [normalizeKey(p.code || p.id), p]));

          const merged = (honeycombData || []).map(hc => {
            const key = normalizeKey(hc.code || hc.id);
            const serverItem = serverMap.get(key) || {};

            const isHoneycomb = serverItem.is_featured_honeycomb !== undefined 
              ? Boolean(serverItem.is_featured_honeycomb) 
              : (serverItem.isFeaturedHoneycomb !== undefined 
                  ? Boolean(serverItem.isFeaturedHoneycomb) 
                  : (hc.isFeaturedHoneycomb !== false));

            const progStatus = serverItem.status || hc.status || 'published';

            return {
              ...hc,
              ...serverItem,
              id: hc.id || serverItem.id || hc.code,
              code: hc.code || serverItem.code,
              type: (serverItem.level || serverItem.type || hc.type || 'ug').toLowerCase(),
              displayLines: hc.displayLines || [serverItem.title || serverItem.name || hc.code],
              duration: serverItem.duration || hc.duration || '3 Years / 4 Years (NEP 2020)',
              description: serverItem.overview || serverItem.description || hc.description,
              link: hc.link || serverItem.link || `/departments/${(serverItem.slug || serverItem.code || hc.id).toLowerCase()}`,
              status: progStatus,
              is_featured_honeycomb: isHoneycomb,
              isFeaturedHoneycomb: isHoneycomb
            };
          });
          setAllProgrammes(merged);
        }
      } catch (err) {
        // Retain pre-loaded programmes
      }
    }
    loadProgrammes();

    const handleCmsUpdate = () => {
      loadProgrammes();
    };
    window.addEventListener('cms_store_updated', handleCmsUpdate);

    return () => { 
      isMounted = false; 
      window.removeEventListener('cms_store_updated', handleCmsUpdate);
    };
  }, []);

  // Filter dataset based on active status and honeycomb toggle
  const filteredCourses = allProgrammes
    .filter((item) => {
      const isDraft = item.status === 'draft' || item.status === 'inactive' || item.status === 'deleted';
      const isPublished = !isDraft && (item.status === 'published' || !item.status);
      const isHoneycombEnabled = item.is_featured_honeycomb !== undefined 
        ? Boolean(item.is_featured_honeycomb) 
        : (item.isFeaturedHoneycomb !== false);

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
        link: p.link || `/departments/${(p.slug || code || id).toLowerCase()}`
      };
    });

  // Build authentic interlocking honeycomb matrix
  const rows = useMemo(() => {
    const byCode = new Map();
    filteredCourses.forEach((c) => {
      const codeKey = (c.code || c.id || '').toUpperCase().replace(/[\\s.-]/g, '');
      byCode.set(codeKey, c);
    });

    const getCourse = (key, fallbackIdx) => {
      return byCode.get(key) || filteredCourses[fallbackIdx] || null;
    };

    if (filter === 'ug') {
      const bcom = getCourse('BCOM', 0) || { id: 'bcom', code: 'BCOM', title: 'Bachelor of Commerce', displayLines: ['Bachelor of', 'Commerce (B.Com)'], link: '/departments/dept-bcom', duration: '3 Years / 4 Years (NEP 2020)', description: 'Comprehensive commercial degree covering corporate accounting, GST taxation, banking operations, and financial markets.' };
      const bsc = getCourse('BSC', 1) || { id: 'bsc', code: 'BSC', title: 'Bachelor of Science (B.Sc)', displayLines: ['Bachelor of', 'Science (B.Sc)'], link: '/departments/dept-physics', duration: '3 Years / 4 Years (NEP 2020)', description: 'Diverse science specializations including Physics, Chemistry, Mathematics, Computer Science, and Biotechnology.' };
      const bca = getCourse('BCA', 2) || { id: 'bca', code: 'BCA', title: 'Bachelor of Computer Applications', displayLines: ['Bachelor of', 'Computer Applications'], link: '/departments/dept-bca', duration: '3 Years / 4 Years (NEP 2020)', description: 'Comprehensive technology degree in software engineering, full-stack web development, Python, cloud computing, and AI applications.' };
      const ba = getCourse('BA', 3) || { id: 'ba', code: 'BA', title: 'Bachelor of Arts (Humanities)', displayLines: ['Bachelor of', 'Arts (Humanities)'], link: '/departments/dept-history', duration: '3 Years / 4 Years (NEP 2020)', description: 'Multidisciplinary humanities streams including Journalism, Economics, Political Science, and English Literature.' };
      const bsw = getCourse('BSW', 4) || { id: 'bsw', code: 'BSW', title: 'Bachelor of Social Work', displayLines: ['Bachelor of', 'Social Work'], link: '/departments/dept-social-work', duration: '3 Years / 4 Years (NEP 2020)', description: 'Professional community service degree integrating fieldwork, NGO administration, social policy, counseling, and human rights advocacy.' };
      const bba = getCourse('BBA', 5) || { id: 'bba', code: 'BBA', title: 'Bachelor of Business Administration', displayLines: ['Bachelor of', 'Business Administration'], link: '/departments/dept-management', duration: '3 Years / 4 Years (NEP 2020)', description: 'Professional managerial training in marketing, financial management, HR, organizational leadership, and entrepreneurship.' };
      const bbath = getCourse('BBATH', 6) || { id: 'bba-th', code: 'BBA-TH', title: 'Tourism & Hospitality Mgmt', displayLines: ['Tourism &', 'Hospitality Mgmt'], link: '/departments/dept-bba-th', duration: '3 Years / 4 Years (NEP 2020)', description: 'Specialized degree in global aviation, hotel management, eco-tourism, travel agency operations, and event management.' };
      const bvoc = getCourse('BVOC', 7) || { id: 'bvoc', code: 'BVOC', title: 'Bachelor of Vocation (B.Voc)', displayLines: ['Bachelor of', 'Vocation (B.Voc)'], link: '/departments/dept-bvoc', duration: '3 Years (NSQF Level 7)', description: 'Hands-on vocational degrees in Digital Media & Animation, Healthcare Technology, and Software Development aligned with UGC NSQF.' };
      const lang = getCourse('LANG', 8) || { id: 'lang', code: 'LANG', title: 'Department of Languages & Literature', displayLines: ['Department of', 'Languages & Literature'], link: '/departments/dept-english', duration: 'Course-aligned', description: 'Language foundation and elective literature courses in English, Kannada, Hindi, French, Malayalam, and Urdu with digital language laboratory access.' };

      return [
        // Row 0: Ambient Crown
        [
          { type: 'bg', id: 'c-0', label: 'SPC', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' },
          { type: 'bg', id: 'c-1', label: 'COMMERCE', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'c-2', label: 'SCIENCE', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'c-3', label: 'ARTS', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'c-4', label: 'MANAGEMENT', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'c-5', label: 'TECH', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' }
        ],
        // Row 1: 3 Center Proper Blocks
        [
          { type: 'bg', id: 'r1-0', opacity: 'opacity-30 hidden md:block' },
          { type: 'bg', id: 'r1-1', label: 'ESTD 1946', icon: Sparkles, opacity: 'opacity-60' },
          { type: 'proper', course: bcom, displayCode: 'BCOM', displayLines: ['Bachelor of', 'Commerce (B.Com)'] },
          { type: 'proper', course: bsc, displayCode: 'BSC', displayLines: ['Bachelor of', 'Science (B.Sc)'] },
          { type: 'proper', course: bca, displayCode: 'BCA', displayLines: ['Bachelor of', 'Computer Applications'] },
          { type: 'bg', id: 'r1-5', label: 'NAAC A+', icon: CheckCircle2, opacity: 'opacity-60' },
          { type: 'bg', id: 'r1-6', opacity: 'opacity-30 hidden md:block' }
        ],
        // Row 2: 4 Center Proper Blocks
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
        // Row 3: 2 Center Proper Blocks
        [
          { type: 'bg', id: 'r3-0', opacity: 'opacity-30 hidden md:block' },
          { type: 'bg', id: 'r3-1', label: 'EXCELLENCE', opacity: 'opacity-55' },
          { type: 'bg', id: 'r3-2', label: 'SKILLS', icon: Layers, opacity: 'opacity-55' },
          { type: 'proper', course: bvoc, displayCode: 'BVOC', displayLines: ['Bachelor of', 'Vocation (B.Voc)'] },
          { type: 'proper', course: lang, displayCode: 'LANG', displayLines: ['Department of', 'Languages & Literature'] },
          { type: 'bg', id: 'r3-5', label: 'INNOVATION', icon: Sparkles, opacity: 'opacity-55' },
          { type: 'bg', id: 'r3-6', opacity: 'opacity-30 hidden md:block' }
        ],
        // Row 4: Ambient Base
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
      const mca = getCourse('MCA', 0) || { id: 'mca', code: 'MCA', title: 'Master of Computer Applications', displayLines: ['Master of', 'Computer Applications'], link: '/departments/dept-pg-computer-science', duration: '2 Years (AICTE Approved)', description: 'Advanced master’s programme covering distributed systems, machine learning, cloud architectures, and full-stack software development.' };
      const mba = getCourse('MBA', 1) || { id: 'mba', code: 'MBA', title: 'Master of Business Administration', displayLines: ['Master of', 'Business Administration'], link: '/departments/dept-management', duration: '2 Years (AICTE Approved)', description: 'Premier management degree specializing in Corporate Finance, Marketing Strategy, Human Resources, and Data Analytics.' };
      const mcom = getCourse('MCOM', 2) || { id: 'mcom', code: 'M.COM', displayLines: ['Master of', 'Commerce (M.Com)'], title: 'Master of Commerce (M.Com)', link: '/departments/dept-commerce', duration: '2 Years', description: 'Advanced postgraduate curriculum in Corporate Accounting, Financial Analysis, International Trade, and Forensic Auditing.' };
      const msc = getCourse('MSC', 3) || { id: 'msc', code: 'M.SC', displayLines: ['Master of', 'Science (M.Sc)'], title: 'Master of Science (M.Sc)', link: '/departments/dept-pg-physics', duration: '2 Years', description: 'Postgraduate research programmes in Physics, Chemistry, Biochemistry, and Mathematics with advanced laboratory suites.' };
      const ma = getCourse('MA', 4) || { id: 'ma', code: 'M.A', displayLines: ['Master of', 'Arts (M.A)'], title: 'Master of Arts (M.A)', link: '/departments/dept-pg-economics', duration: '2 Years', description: 'Specialized humanities master degrees in Economics, English Literature, and Mass Communication & Journalism.' };
      const msw = getCourse('MSW', 5) || { id: 'msw', code: 'MSW', displayLines: ['Master of', 'Social Work'], title: 'Master of Social Work (MSW)', link: '/departments/dept-social-work', duration: '2 Years', description: 'Professional social work degree focusing on Medical & Psychiatric Social Work, Community Development, and HR Management.' };

      return [
        [
          { type: 'bg', id: 'pg-c0', label: 'SPC', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' },
          { type: 'bg', id: 'pg-c1', label: 'POSTGRADUATE', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'pg-c2', label: 'RESEARCH', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'pg-c3', label: 'AICTE', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'pg-c4', label: 'INNOVATION', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'pg-c5', label: 'UGC-CARE', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' }
        ],
        [
          { type: 'bg', id: 'pg-r1-0', opacity: 'opacity-30 hidden md:block' },
          { type: 'bg', id: 'pg-r1-1', label: 'ESTD 1946', icon: Sparkles, opacity: 'opacity-60' },
          { type: 'proper', course: mca, displayCode: 'MCA', displayLines: ['Master of', 'Computer Applications'] },
          { type: 'proper', course: mba, displayCode: 'MBA', displayLines: ['Master of', 'Business Administration'] },
          { type: 'proper', course: mcom, displayCode: 'M.COM', displayLines: ['Master of', 'Commerce (M.Com)'] },
          { type: 'bg', id: 'pg-r1-5', label: 'NAAC A+', icon: CheckCircle2, opacity: 'opacity-60' },
          { type: 'bg', id: 'pg-r1-6', opacity: 'opacity-30 hidden md:block' }
        ],
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
        [
          { type: 'bg', id: 'pg-r3-0', opacity: 'opacity-30 hidden md:block' },
          { type: 'bg', id: 'pg-r3-1', label: 'PUBLICATIONS', opacity: 'opacity-50' },
          { type: 'bg', id: 'pg-r3-2', label: 'LABS', icon: Layers, opacity: 'opacity-50' },
          { type: 'bg', id: 'pg-r3-3', label: 'SEMINARS', opacity: 'opacity-50' },
          { type: 'bg', id: 'pg-r3-4', label: 'SYMPOSIUMS', opacity: 'opacity-50' },
          { type: 'bg', id: 'pg-r3-5', label: 'FELLOWSHIPS', icon: Sparkles, opacity: 'opacity-50' },
          { type: 'bg', id: 'pg-r3-6', opacity: 'opacity-30 hidden md:block' }
        ],
        [
          { type: 'bg', id: 'pg-b0', label: 'CAMPUS', opacity: 'opacity-25 hidden lg:block' },
          { type: 'bg', id: 'pg-b1', label: 'COMMUNITY', opacity: 'opacity-35 hidden sm:block' },
          { type: 'bg', id: 'pg-b2', label: 'DISCOVERY', icon: Sparkles, opacity: 'opacity-40' },
          { type: 'bg', id: 'pg-b3', label: 'LEADERSHIP', icon: BookOpen, opacity: 'opacity-40' },
          { type: 'bg', id: 'pg-b4', label: 'RESEARCH', opacity: 'opacity-35 hidden sm:block' },
          { type: 'bg', id: 'pg-b5', label: 'CAREERS', opacity: 'opacity-25 hidden lg:block' }
        ]
      ];
    } else {
      // ALL: UG + PG Combined
      const r1Courses = filteredCourses.slice(0, 5);
      const r2Courses = filteredCourses.slice(5, 11);
      const r3Courses = filteredCourses.slice(11, 15);

      return [
        [
          { type: 'bg', id: 'all-c0', label: 'SPC', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' },
          { type: 'bg', id: 'all-c1', label: 'UG & PG', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'all-c2', label: 'ACADEMICS', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'all-c3', label: 'AUTONOMOUS', icon: BookOpen, opacity: 'opacity-45' },
          { type: 'bg', id: 'all-c4', label: 'DISCIPLINES', opacity: 'opacity-40 hidden sm:block' },
          { type: 'bg', id: 'all-c5', label: 'EXCELLENCE', icon: Sparkles, opacity: 'opacity-35 hidden lg:block' }
        ],
        [
          { type: 'bg', id: 'all-r1-0', label: 'ESTD 1946', icon: Sparkles, opacity: 'opacity-60' },
          ...r1Courses.map((c) => ({
            type: 'proper',
            course: c,
            displayCode: (c.code || '').replace(/\\./g, '').toUpperCase(),
            displayLines: c.displayLines
          })),
          { type: 'bg', id: 'all-r1-6', label: 'NAAC A+', icon: CheckCircle2, opacity: 'opacity-60' }
        ],
        [
          { type: 'bg', id: 'all-r2-0', label: 'NEP 2020', icon: Layers, opacity: 'opacity-60' },
          ...r2Courses.map((c) => ({
            type: 'proper',
            course: c,
            displayCode: (c.code || '').replace(/\\./g, '').toUpperCase(),
            displayLines: c.displayLines
          })),
          { type: 'bg', id: 'all-r2-7', label: 'AUTONOMY', icon: BookOpen, opacity: 'opacity-60' }
        ],
        [
          { type: 'bg', id: 'all-r3-0', label: 'HOLISTIC', opacity: 'opacity-55' },
          ...r3Courses.map((c) => ({
            type: 'proper',
            course: c,
            displayCode: (c.code || '').replace(/\\./g, '').toUpperCase(),
            displayLines: c.displayLines
          })),
          { type: 'bg', id: 'all-r3-5', label: 'SKILLS', icon: Layers, opacity: 'opacity-55' },
          { type: 'bg', id: 'all-r3-6', label: 'INNOVATION', icon: Sparkles, opacity: 'opacity-55' }
        ],
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

  // Extract proper courses for easy lookup and default display
  const properCourses = useMemo(() => {
    const list = [];
    rows.forEach(r => {
      r.forEach(cell => {
        if (cell.type === 'proper' && cell.course) {
          list.push(cell.course);
        }
      });
    });
    return list;
  }, [rows]);

  const defaultCourse = properCourses[0] || null;
  const activeCourse = hoveredCourse || selectedCourse || defaultCourse;

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
            Choose your academic path across Science, Commerce, Management, Humanities & Vocational streams. Select or hover over any programme to inspect curriculum and specializations.
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
                return (
                  <div
                    key={rowIndex}
                    className={`flex flex-nowrap items-center justify-center gap-2 sm:gap-2.5 md:gap-3 lg:gap-3.5 transition-all duration-300 ${
                      rowIndex > 0 ? '-mt-5 sm:-mt-6 md:-mt-7 lg:-mt-8' : ''
                    }`}
                  >
                    {rowItems.map((cell, colIdx) => {
                      if (cell.type === 'bg') {
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
                            <div className="absolute inset-0 bg-gradient-to-b from-[#C9A84C]/35 via-slate-300/30 to-[#0B1F4E]/15" />
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
                          key={cell.id || `cell-${rowIndex}-${colIdx}`}
                          className="relative group cursor-pointer transition-all duration-200"
                          onMouseEnter={() => setHoveredCourse(course)}
                          onMouseLeave={() => setHoveredCourse(null)}
                          onClick={() => handleCourseClick(course)}
                        >
                          {/* Hexagonal Card (Never covered by floating popovers!) */}
                          <div
                            className={`relative w-[110px] h-[126px] sm:w-[125px] sm:h-[144px] md:w-[138px] md:h-[158px] lg:w-[148px] lg:h-[170px] p-[2.5px] transition-all duration-300 ${
                              isActive ? 'scale-108 drop-shadow-2xl z-30' : 'hover:scale-104 hover:drop-shadow-lg drop-shadow-xs'
                            }`}
                            style={{
                              clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)'
                            }}
                          >
                            {/* Outline Layer */}
                            <div
                              className={`absolute inset-0 transition-colors duration-200 ${
                                isActive
                                  ? 'bg-gradient-to-b from-[#FFD84A] to-[#C9A84C]'
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
                                className={`font-heading font-bold leading-none transition-colors duration-200 tracking-tight my-0.5 ${
                                  displayCode.length > 5 
                                    ? 'text-xs sm:text-sm md:text-base lg:text-lg' 
                                    : 'text-sm sm:text-base md:text-xl lg:text-2xl'
                                } ${isActive ? 'text-[#FFD84A]' : 'text-[#0B1F4E] group-hover:text-[#a88530]'}`}
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
                                        ? 'text-slate-100'
                                        : 'text-slate-600 group-hover:text-slate-900'
                                    }`}
                                  >
                                    {line}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* DEDICATED ACADEMIC PROGRAMME SHOWCASE PANEL (ZERO OVERLAP WITH HONEYCOMB NODES) */}
        {activeCourse && (
          <div className="max-w-4xl mx-auto bg-white rounded-3xl border-2 border-[#C9A84C]/50 shadow-2xl p-6 sm:p-8 space-y-4 transition-all duration-300 animate-fadeIn">
            {/* Top Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-2.5">
                <span className="w-9 h-9 rounded-xl bg-[#0B1F4E] text-[#FFD84A] font-heading font-bold text-sm flex items-center justify-center border border-[#C9A84C]/40 shadow-xs">
                  {activeCourse.code}
                </span>
                <span className="badge-type badge-important text-xs px-2.5 py-0.5 rounded-full">
                  {activeCourse.type === 'ug' ? 'UNDERGRADUATE' : 'POSTGRADUATE'}
                </span>
                <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                  NEP 2020 · UGC AUTONOMOUS
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {selectedCourse && (
                  <button
                    onClick={() => setSelectedCourse(null)}
                    className="text-xs font-bold text-slate-500 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors flex items-center space-x-1 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Unpin</span>
                  </button>
                )}
              </div>
            </div>

            {/* Programme Title & Duration */}
            <div className="space-y-1">
              <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#0B1F4E] leading-snug">
                {activeCourse.title}
              </h3>
              <div className="flex items-center space-x-2 text-xs font-mono text-[#a88530]">
                <Clock className="w-4 h-4 text-[#C9A84C] shrink-0" />
                <span className="font-semibold">{activeCourse.duration}</span>
                <span>•</span>
                <span className="text-slate-500">Autonomous Curriculum Approved by Academic Council</span>
              </div>
            </div>

            {/* Curricular Description */}
            <p className="text-sm text-slate-700 leading-relaxed font-sans">
              {activeCourse.description}
            </p>

            {/* Action Buttons: Explore Syllabus & Apply Online */}
            <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-3">
                <Link
                  to={activeCourse.link || `/departments/${activeCourse.id}`}
                  className="btn-navy text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center space-x-1.5 shadow-sm group/link"
                >
                  <BookOpen className="w-4 h-4 mr-1 text-[#FFD84A]" />
                  <span>Explore Syllabus & Faculty</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover/link:translate-x-1 transition-transform" />
                </Link>

                <a
                  href="https://student.stphiloserp.in/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-gold text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center space-x-1.5 shadow-sm"
                >
                  <span>Apply Online 2026–27</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>

              <span className="text-[11px] font-sans text-slate-400 italic">
                {selectedCourse ? '📌 Pinned selection' : '💡 Hover or tap any hexagon to inspect other streams'}
              </span>
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
'''

with open('src/components/home/CourseHoneycombSection.jsx', 'w', encoding='utf-8') as f:
    f.write(new_code)

print('Written repaired CourseHoneycombSection.jsx successfully!')
