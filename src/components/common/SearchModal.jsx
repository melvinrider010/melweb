import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Building2, User, FileText, Calendar, ArrowRight, ExternalLink } from 'lucide-react';
import { getProgrammes } from '../../services/programmesService';
import { getDepartments } from '../../services/departmentsService';
import { getNotices } from '../../services/noticesService';
import faculty from '../../data/faculty.json';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const [programmesList, setProgrammesList] = useState([]);
  const [departmentsList, setDepartmentsList] = useState([]);
  const [noticesList, setNoticesList] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      // Fetch live searchable datasets from API
      let isMounted = true;
      async function loadSearchData() {
        try {
          const [progs, depts, nots] = await Promise.all([
            getProgrammes(),
            getDepartments(),
            getNotices()
          ]);
          if (isMounted) {
            setProgrammesList(progs || []);
            setDepartmentsList(depts || []);
            setNoticesList(nots || []);
          }
        } catch (e) {
          // ignore background search cache failure
        }
      }
      loadSearchData();
      return () => { isMounted = false; };
    } else {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else window.dispatchEvent(new CustomEvent('open_search_modal'));
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.trim().toLowerCase();

  const matchedProgrammes = q
    ? (programmesList || []).filter(
        p => (p.title || p.name || '').toLowerCase().includes(q) || (p.code || '').toLowerCase().includes(q)
      )
    : [];

  const matchedDepartments = q
    ? (departmentsList || []).filter(d => (d.name || '').toLowerCase().includes(q) || (d.category || '').toLowerCase().includes(q))
    : [];

  const matchedFaculty = q
    ? faculty.filter(f => f.name.toLowerCase().includes(q) || (f.department || '').toLowerCase().includes(q) || (f.designation || '').toLowerCase().includes(q))
    : [];

  const matchedNotices = q
    ? (noticesList || []).filter(n => (n.title || '').toLowerCase().includes(q) || (n.category || '').toLowerCase().includes(q))
    : [];

  const handleSelect = (path) => {
    onClose();
    if (path.startsWith('http')) {
      window.open(path, '_blank');
    } else {
      navigate(path);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50">
          <Search className="w-5 h-5 text-[#1C5496] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search programmes, faculty, departments, notices, documents..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-900 focus:outline-none placeholder-slate-400 font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 rounded hover:bg-slate-200 text-slate-500">
              <X className="w-4 h-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono bg-white border rounded text-slate-500 shadow-xs">ESC</kbd>
        </div>

        {/* Results Container */}
        <div className="p-4 overflow-y-auto space-y-6 text-xs divide-y divide-slate-100">
          
          {!q && (
            <div className="py-6 text-center text-slate-500 space-y-2">
              <p className="font-semibold text-slate-700">Institutional Global Search Portal</p>
              <p className="text-[11px] text-slate-400">Type a keyword to search across St. Philomena's academic programmes, faculty, departments, and official circulars.</p>
              <div className="pt-2 flex flex-wrap justify-center gap-2">
                <button onClick={() => setQuery('B.Com')} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-md font-bold text-[11px]">B.Com</button>
                <button onClick={() => setQuery('Computer Science')} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-md font-bold text-[11px]">Computer Science</button>
                <button onClick={() => setQuery('Faculty')} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-md font-bold text-[11px]">Faculty</button>
                <button onClick={() => setQuery('Examination')} className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 text-blue-700 rounded-md font-bold text-[11px]">Examination</button>
              </div>
            </div>
          )}

          {/* Programmes */}
          {matchedProgrammes.length > 0 && (
            <div className="pt-3 space-y-2">
              <span className="font-serif font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center text-[#1C5496]">
                <BookOpen className="w-3.5 h-3.5 mr-1.5" /> Programmes ({matchedProgrammes.length})
              </span>
              <div className="space-y-1.5">
                {matchedProgrammes.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect('/academics')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{p.title}</p>
                      <p className="text-[11px] text-slate-500">Duration: {p.duration}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Departments */}
          {matchedDepartments.length > 0 && (
            <div className="pt-3 space-y-2">
              <span className="font-serif font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center text-[#1C5496]">
                <Building2 className="w-3.5 h-3.5 mr-1.5" /> Departments ({matchedDepartments.length})
              </span>
              <div className="space-y-1.5">
                {matchedDepartments.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => handleSelect(`/departments/${d.id}`)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{d.name}</p>
                      <p className="text-[11px] text-slate-500">Head: {d.head} · {d.category}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Faculty */}
          {matchedFaculty.length > 0 && (
            <div className="pt-3 space-y-2">
              <span className="font-serif font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center text-[#1C5496]">
                <User className="w-3.5 h-3.5 mr-1.5" /> Faculty Members ({matchedFaculty.length})
              </span>
              <div className="space-y-1.5">
                {matchedFaculty.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleSelect('/faculty')}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{f.name}</p>
                      <p className="text-[11px] text-slate-500">{f.designation} · Dept of {f.department}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notices */}
          {matchedNotices.length > 0 && (
            <div className="pt-3 space-y-2">
              <span className="font-serif font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center text-[#1C5496]">
                <Calendar className="w-3.5 h-3.5 mr-1.5" /> Notices & Circulars ({matchedNotices.length})
              </span>
              <div className="space-y-1.5">
                {matchedNotices.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => handleSelect(n.link)}
                    className="w-full text-left p-2.5 rounded-xl hover:bg-slate-50 flex items-center justify-between border border-transparent hover:border-slate-200 transition-colors"
                  >
                    <div>
                      <p className="font-bold text-slate-900">{n.title}</p>
                      <p className="text-[11px] text-slate-500">Date: {n.date} · {n.category}</p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {q && matchedProgrammes.length === 0 && matchedDepartments.length === 0 && matchedFaculty.length === 0 && matchedNotices.length === 0 && (
            <div className="py-8 text-center text-slate-500 space-y-1">
              <p className="font-bold text-slate-800">No matching institutional records found</p>
              <p className="text-[11px] text-slate-400">Try searching for broader terms like "B.Sc", "Commerce", "Exam", or "Faculty".</p>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex justify-between items-center text-[10px] text-slate-500">
          <span>St. Philomena's College (Autonomous), Mysuru</span>
          <button onClick={onClose} className="px-3 py-1 bg-white border border-slate-200 rounded font-bold text-slate-700 hover:bg-slate-100">Close</button>
        </div>

      </div>
    </div>
  );
}
