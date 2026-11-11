import React, { useState, useEffect } from 'react';
import { Calendar, FileText, Download, ExternalLink, ShieldCheck, CheckCircle2, Loader2 } from 'lucide-react';
import { getNotices } from '../services/noticesService';
import { ASSETS } from '../data/assets';

export default function ExaminationsPage() {
  const [examNotices, setExamNotices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function loadExamNotices() {
      try {
        const data = await getNotices({ category: 'Examinations' });
        if (isMounted) {
          setExamNotices(data || []);
          setIsLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setExamNotices([]);
          setIsLoading(false);
        }
      }
    }
    loadExamNotices();

    const handleUpdate = () => {
      loadExamNotices();
    };
    window.addEventListener('cms_store_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => { 
      isMounted = false; 
      window.removeEventListener('cms_store_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return (
    <div className="space-y-10 py-10 px-4 sm:px-8 max-w-[1400px] mx-auto text-[#071A33]">
      
      {/* Header Banner */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4 border-l-8 border-[#1C5496]">
        <span className="text-[#1C5496] font-semibold text-xs uppercase tracking-widest block">Office of the Controller of Examinations (COE)</span>
        <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900">Autonomous Examination Portal</h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-3xl leading-relaxed">
          The Office of Controller of Examinations manages continuous internal assessments (CIA), autonomous end-semester examinations (ESE), valuation, revaluation, and degree grade transcript issuance for St. Philomena's College.
        </p>
      </div>

      {/* Quick Access Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <Calendar className="w-6 h-6 text-[#1C5496]" />
          <h3 className="font-heading font-semibold text-lg text-slate-900">Examination Timetables</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Download official timetables for UG & PG Theory & Practical end-semester examinations.</p>
          <a
            href={ASSETS.documents.examinations.timetable}
            download="end-semester-examination-timetable-2026.pdf"
            className="text-xs font-semibold text-[#1C5496] hover:underline flex items-center pt-2"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Download Timetables PDF</span>
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs border-l-4 border-l-[#FFC928]">
          <FileText className="w-6 h-6 text-[#1C5496]" />
          <h3 className="font-heading font-semibold text-lg text-slate-900">End-Semester Results Portal</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Access student marks cards, semester grade reports (SGPA/CGPA), and provisional certificate status.</p>
          <a
            href={ASSETS.documents.examinations.gradeReport}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-4 py-2 rounded-md text-xs font-semibold inline-block mt-2"
          >
            View Provisional Grade Report PDF
          </a>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 space-y-3 shadow-xs">
          <ShieldCheck className="w-6 h-6 text-[#1C5496]" />
          <h3 className="font-heading font-semibold text-lg text-slate-900">Revaluation & Photocopy</h3>
          <p className="text-xs text-slate-600 leading-relaxed">Guidelines and application forms for answer script photocopy, re-totalling, and revaluation.</p>
          <a
            href={ASSETS.documents.examinations.revaluationForm}
            download="revaluation-application-form-2026.pdf"
            className="text-xs font-semibold text-[#1C5496] hover:underline flex items-center pt-2"
          >
            <Download className="w-3.5 h-3.5 mr-1" />
            <span>Download Revaluation Form PDF</span>
          </a>
        </div>
      </div>

      {/* Examination Notices Table */}
      <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900 border-b border-slate-100 pb-3">Latest COE Examination Notifications</h2>
        <div className="space-y-3">
          {isLoading ? (
            <div className="p-8 text-center space-y-2">
              <Loader2 className="w-6 h-6 text-[#1C5496] animate-spin mx-auto" />
              <p className="text-xs text-slate-500">Loading COE Examination notices...</p>
            </div>
          ) : examNotices.length > 0 ? (
            examNotices.map((n) => (
              <div key={n.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    {n.isPinned && (
                      <span className="bg-amber-400 text-slate-950 font-bold text-[10px] px-2 py-0.5 rounded uppercase">PINNED</span>
                    )}
                    <span className="bg-blue-100 text-[#1C5496] font-semibold text-[10px] px-2 py-0.5 rounded">{n.category || 'Examinations'}</span>
                    <span className="text-[11px] text-slate-400 font-mono">{n.date || n.publishDate}</span>
                  </div>
                  <h4 className="font-heading font-semibold text-sm text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600">{n.summary}</p>
                </div>
                <a
                  href={n.link || `/news-events/${n.id}`}
                  className="btn-primary-blue px-4 py-2 rounded-md text-xs font-semibold shrink-0 flex items-center"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" />
                  <span>View Notification</span>
                </a>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-slate-500 text-xs">
              <p>No active examination notifications found.</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
