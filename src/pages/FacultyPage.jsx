import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, GraduationCap, Filter, ArrowRight, Building2, BookOpen, RefreshCw, AlertCircle, Layers, Sparkles } from 'lucide-react';
import FacultyAvatar from '../components/common/FacultyAvatar';
import { getFaculty } from '../services/facultyService';
import { getDepartments } from '../services/departmentsService';

export default function FacultyPage() {
  const [allFaculty, setAllFaculty] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedFacultyCategory, setSelectedFacultyCategory] = useState('All');

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [facultyData, deptsData] = await Promise.all([
        getFaculty(),
        getDepartments().catch(() => [])
      ]);
      setAllFaculty(facultyData);
      setAllDepartments(deptsData);
    } catch (err) {
      console.error('Failed to load faculty directory:', err);
      setError('Unable to load faculty records from the server. Please check your connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const cleanStr = (s) => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  // Filter faculty by search, category, and department
  const filteredFaculty = useMemo(() => {
    const searchClean = cleanStr(search);
    return allFaculty.filter(f => {
      const deptName = f.department || f.departmentName || '';
      const progTitles = (f.programmes || []).map(p => `${p.code} ${p.title}`).join(' ');

      const matchesSearch = !searchClean || 
        cleanStr(f.name).includes(searchClean) ||
        cleanStr(deptName).includes(searchClean) ||
        cleanStr(f.designation).includes(searchClean) ||
        cleanStr(f.qualification).includes(searchClean) ||
        cleanStr(progTitles).includes(searchClean);

      const matchesDept = selectedDept === 'All' || 
        f.department_id === selectedDept || 
        deptName === selectedDept;

      const matchesCategory = selectedFacultyCategory === 'All' ||
        (f.facultyCategory && f.facultyCategory.toLowerCase().includes(selectedFacultyCategory.toLowerCase()));

      return matchesSearch && matchesDept && matchesCategory;
    });
  }, [allFaculty, search, selectedDept, selectedFacultyCategory]);

  // Group filtered faculty by Department -> Programme
  const groupedDepartments = useMemo(() => {
    // Group faculty members by department_id
    const deptMap = {};

    filteredFaculty.forEach(member => {
      const dId = member.department_id || member.departmentId || 'dept-general';
      const dName = member.department || member.departmentName || 'Academic Department';
      const dCategory = member.facultyCategory || 'Academics';

      if (!deptMap[dId]) {
        deptMap[dId] = {
          id: dId,
          name: dName,
          category: dCategory,
          programmeGroups: {}
        };
      }

      // Check programmes for this member
      const memberProgrammes = Array.isArray(member.programmes) && member.programmes.length > 0 
        ? member.programmes 
        : [{ code: 'GENERAL', title: 'Faculty Members' }];

      memberProgrammes.forEach(prog => {
        const pCode = prog.code || 'GENERAL';
        const pTitle = formatProgrammeHeading(pCode, prog.title);

        if (!deptMap[dId].programmeGroups[pCode]) {
          deptMap[dId].programmeGroups[pCode] = {
            code: pCode,
            title: pTitle,
            level: prog.level || (pCode.startsWith('M') ? 'pg' : 'ug'),
            faculty: []
          };
        }

        // Avoid adding duplicate in same programme group
        if (!deptMap[dId].programmeGroups[pCode].faculty.some(existing => existing.id === member.id)) {
          deptMap[dId].programmeGroups[pCode].faculty.push(member);
        }
      });
    });

    return Object.values(deptMap);
  }, [filteredFaculty]);

  const formatProgrammeHeading = (code, rawTitle) => {
    const canonicalTitles = {
      'BCA': 'BCA Faculty Members',
      'MCA': 'MCA Faculty Members',
      'BCOM': 'B.Com Faculty Members',
      'MCOM': 'M.Com Faculty Members',
      'BBA': 'BBA Faculty Members',
      'BBA-TH': 'BBA Tourism & Hospitality Management Faculty Members',
      'BTHM': 'BBA Tourism & Hospitality Management Faculty Members',
      'MBA': 'MBA Faculty Members',
      'BSW': 'BSW Faculty Members',
      'MSW': 'MSW Faculty Members',
      'BSC': 'B.Sc Faculty Members',
      'MSC-CHEM': 'M.Sc Chemistry Faculty Members',
      'MSC-PHY': 'M.Sc Physics Faculty Members',
      'MSC-MATH': 'M.Sc Mathematics Faculty Members',
      'MSC-BIOCHEM': 'M.Sc Biochemistry Faculty Members',
      'MSC-CRIM': 'M.Sc Criminology & Forensic Science Faculty Members',
      'MSC-PSY': 'M.Sc Psychology Faculty Members',
      'MSC-FSN': 'M.Sc Food Science & Nutrition Faculty Members',
      'MSC-CS': 'M.Sc Computer Science Faculty Members',
      'BA': 'B.A. Faculty Members',
      'MA-ENG': 'M.A. English Literature Faculty Members',
      'MA-ECON': 'M.A. Economics Faculty Members',
      'MA-JMC': 'M.A. Journalism & Mass Communication Faculty Members',
      'LANG': 'Language Faculty Members',
    };
    if (canonicalTitles[code]) return canonicalTitles[code];
    if (rawTitle && !rawTitle.toLowerCase().includes('faculty')) return `${rawTitle} Faculty Members`;
    return rawTitle || `${code} Faculty Members`;
  };

  const facultyCategories = ['All', 'Science', 'Commerce', 'Management', 'Arts', 'Humanities'];

  const departmentDropdownOptions = useMemo(() => {
    const list = [
      { id: 'All', name: 'All Academic Departments' }
    ];
    const seen = new Set();
    allFaculty.forEach(f => {
      const dId = f.department_id || f.departmentId;
      const dName = f.department || f.departmentName;
      if (dId && dName && !seen.has(dId)) {
        seen.add(dId);
        list.push({ id: dId, name: dName });
      }
    });
    return list;
  }, [allFaculty]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#071A33] py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1400px] mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xs space-y-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <span className="text-[#1C5496] font-bold text-xs uppercase tracking-widest block">Academic Directory</span>
              <h1 className="font-serif font-extrabold text-3xl sm:text-4xl lg:text-5xl text-slate-900 mt-1">Faculty Directory</h1>
              <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed font-sans mt-2">
                Explore the distinguished teaching faculty, research guides, and academic heads across St. Philomena's College (Autonomous), organized by department and academic programmes.
              </p>
            </div>
            <div className="shrink-0 bg-blue-50 border border-blue-200/80 rounded-2xl p-4 text-center">
              <span className="font-mono font-extrabold text-2xl sm:text-3xl text-[#1C5496] block">
                {filteredFaculty.length}
              </span>
              <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Active Faculty</span>
            </div>
          </div>

          {/* Search & Category Filter Controls */}
          <div className="pt-2 grid grid-cols-1 sm:grid-cols-12 gap-4 items-center border-t border-slate-100">
            
            {/* Search Box */}
            <div className="sm:col-span-6 relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by faculty name, qualification, department, or programme (e.g. BCA, MCA, BBA)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#1C5496] focus:bg-white transition-colors"
              />
            </div>

            {/* Department Dropdown Filter */}
            <div className="sm:col-span-6 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-[#1C5496] shrink-0" />
              <select
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#1C5496] font-semibold text-slate-800"
              >
                {departmentDropdownOptions.map((opt) => (
                  <option key={opt.id} value={opt.id}>
                    {opt.name}
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Quick Category Filters */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-bold text-slate-500 mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5 text-[#1C5496]" />
              <span>Division:</span>
            </span>
            {facultyCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedFacultyCategory(cat)}
                className={`text-xs px-3.5 py-1.5 rounded-full font-semibold transition-all ${
                  selectedFacultyCategory === cat
                    ? 'bg-[#1C5496] text-white shadow-xs font-bold'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="space-y-8 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-white rounded-3xl border border-slate-200 p-8 space-y-6">
                <div className="h-6 bg-slate-200 rounded w-1/3" />
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-64 bg-slate-100 rounded-2xl" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-8 text-center max-w-lg mx-auto space-y-4">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-lg text-rose-900">Unable to Load Faculty Directory</h3>
            <p className="text-xs text-rose-700">{error}</p>
            <button
              onClick={loadData}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold inline-flex items-center space-x-2 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Connection</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && groupedDepartments.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-lg mx-auto space-y-3">
            <GraduationCap className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-slate-900">No Faculty Found</h3>
            <p className="text-xs text-slate-500">
              No faculty members matched your filter or search criteria "{search || selectedDept}".
            </p>
            {(search || selectedDept !== 'All' || selectedFacultyCategory !== 'All') && (
              <button
                onClick={() => { setSearch(''); setSelectedDept('All'); setSelectedFacultyCategory('All'); }}
                className="btn-primary-blue px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 mt-2"
              >
                <span>Reset All Filters</span>
              </button>
            )}
          </div>
        )}

        {/* Hierarchical Grouped Faculty Display: Department -> Programme -> Faculty */}
        {!loading && !error && groupedDepartments.map((dept) => {
          const programmeKeys = Object.keys(dept.programmeGroups)
            .filter(k => dept.programmeGroups[k]?.faculty?.length > 0)
            .sort((a, b) => {
              const levelA = dept.programmeGroups[a]?.level === 'pg' ? 1 : 0;
              const levelB = dept.programmeGroups[b]?.level === 'pg' ? 1 : 0;
              return levelA - levelB;
            });
          if (programmeKeys.length === 0) return null;

          return (
            <div 
              key={dept.id} 
              className="bg-white rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-8"
            >
              {/* Department Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-5 border-b border-slate-100">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="bg-blue-50 text-[#1C5496] font-mono font-bold text-[11px] px-2.5 py-0.5 rounded uppercase">
                      {dept.category || 'Academic Department'}
                    </span>
                  </div>
                  <h2 className="font-serif font-bold text-2xl sm:text-3xl text-slate-900 leading-tight">
                    {dept.name}
                  </h2>
                </div>
                <Link
                  to={`/departments/${dept.id.replace(/^dept[-_]/, '')}`}
                  className="text-xs font-bold text-[#1C5496] hover:underline inline-flex items-center gap-1 shrink-0"
                >
                  <span>Department Overview</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Programme Subsections */}
              <div className="space-y-10">
                {programmeKeys.map((pCode) => {
                  const progGroup = dept.programmeGroups[pCode];
                  const facultyList = progGroup.faculty;
                  if (!facultyList || facultyList.length === 0) return null;

                  return (
                    <div key={pCode} className="space-y-4">
                      {/* Programme Badge & Heading */}
                      <div className="flex items-center justify-between gap-3 bg-slate-50/80 px-4 py-2.5 rounded-xl border border-slate-200/70">
                        <div className="flex items-center gap-2">
                          <BookOpen className="w-4 h-4 text-[#1C5496]" />
                          <h3 className="font-bold text-sm text-slate-900">
                            {progGroup.title}
                          </h3>
                        </div>
                        <span className="text-[11px] font-mono font-bold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                          {facultyList.length} {facultyList.length === 1 ? 'Member' : 'Members'}
                        </span>
                      </div>

                      {/* Faculty Cards Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {facultyList.map((member) => {
                          const photo = member.photo_url || member.photoUrl || member.image || member.photo;

                          return (
                            <div
                              key={`${dept.id}-${pCode}-${member.id}`}
                              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md hover:border-[#1C5496]/40 transition-all group flex flex-col justify-between"
                            >
                              <div className="space-y-3">
                                
                                {/* Photo */}
                                <div className="aspect-[4/3] bg-slate-900 relative overflow-hidden flex items-center justify-center">
                                  <FacultyAvatar
                                    src={photo}
                                    name={member.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                    fallbackSize="text-4xl"
                                  />
                                  <span className="absolute top-2 left-2 bg-[#071A33]/90 text-[#FFD84A] text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                                    {pCode}
                                  </span>
                                </div>

                                {/* Info */}
                                <div className="p-4 space-y-1.5 text-xs">
                                  <Link
                                    to={`/faculty/${encodeURIComponent(member.id)}`}
                                    className="font-serif font-bold text-base text-slate-900 group-hover:text-[#1C5496] transition-colors line-clamp-1 block hover:underline"
                                    title={member.name}
                                  >
                                    {member.name}
                                  </Link>
                                  <p className="text-[#1C5496] font-bold text-xs line-clamp-1">{member.designation || 'Faculty Member'}</p>
                                  {member.qualification && (
                                    <p className="text-[11px] text-slate-500 font-medium truncate" title={member.qualification}>
                                      Qual: {member.qualification}
                                    </p>
                                  )}
                                </div>

                              </div>

                              {/* Footer Action */}
                              <div className="p-4 pt-0 border-t border-slate-100 pt-3">
                                <Link
                                  to={`/faculty/${encodeURIComponent(member.id)}`}
                                  className="text-xs font-bold text-[#1C5496] hover:underline inline-flex items-center space-x-1"
                                >
                                  <span>View Profile</span>
                                  <ArrowRight className="w-3.5 h-3.5" />
                                </Link>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}

      </div>
    </div>
  );
}
