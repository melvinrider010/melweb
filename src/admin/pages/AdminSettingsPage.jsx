import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Settings, 
  Phone, 
  Mail, 
  MapPin, 
  Check, 
  Save, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Globe, 
  Calendar,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';
import { cmsStore } from '../../lib/cmsStore';
import collegeInfo from '../../data/college_info.json';
import settingsData from '../../data/settings.json';

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState(() => {
    const s = cmsStore.getSettings ? cmsStore.getSettings() : settingsData;
    return {
      collegeName: s.collegeName || collegeInfo.name || "St. Philomena's College (Autonomous), Mysuru",
      phone: s.phone || collegeInfo.phone || "+91 9008580707, 9008028258",
      mobile: s.mobile || collegeInfo.mobile || "+91 9008580707, 9008028258",
      email: s.email || collegeInfo.email || "stphilos1946@gmail.com",
      address: s.address || collegeInfo.location || "PB No. 2, Bannimantap, Mysuru - 570015, Karnataka, India",
      activeAcademicYear: s.activeAcademicYear || "2026-27",
      motto: s.motto || collegeInfo.tagline || "Caritas et Scientia (Love and Knowledge)",
      affiliation: s.affiliation || collegeInfo.affiliation || "Affiliated to the University of Mysore"
    };
  });

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleChange = (field, value) => {
    const updated = { ...formData, [field]: value };
    setFormData(updated);
    setIsSaved(false);
    // Realtime live sync across store and open tabs
    if (cmsStore.updateSettings) {
      cmsStore.updateSettings(updated);
    }
  };

  const handleSave = (e) => {
    e?.preventDefault();
    setIsSaving(true);
    
    if (cmsStore.updateSettings) {
      cmsStore.updateSettings(formData);
    }

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    }, 400);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-5xl">
      
      {/* Header Banner */}
      <div className="bg-white/70 border border-white/80 p-6 sm:p-8 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              System Configuration
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
              Live Sync Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight mt-1">
            Institutional Settings & Contact Info
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed mt-1">
            Update the official college phone number, support email, campus postal address, and active academic year broadcasted across the website footer and contact channels.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-[#342456] hover:bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md inline-flex items-center space-x-2 shrink-0 cursor-pointer transition-all disabled:opacity-50 self-start sm:self-auto"
        >
          {isSaving ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Saving Changes...</span>
            </>
          ) : isSaved ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Saved Successfully!</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </>
          )}
        </button>
      </div>

      {/* Success Notification Alert */}
      {isSaved && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-bold animate-fadeIn shadow-xs">
          <Check className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>Institutional contact information updated successfully! Changes are immediately live across the public footer.</span>
        </div>
      )}

      {/* Settings Form Grid */}
      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
        
        {/* Left Column: Form Fields (~65% width) */}
        <div className="lg:col-span-7 bg-white/70 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-6">
          <div className="flex items-center space-x-2.5 border-b border-slate-100 pb-3">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-[#1E1B4B]">
              General Institutional Information
            </h2>
          </div>

          <div className="space-y-4 text-xs">
            
            {/* Primary Phone Number Field (Target Field) */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                Official Phone Number (Shown in Website Footer) *
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+91 9008580707"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-400">
                This phone number appears in the footer contact block and triggers direct click-to-call on mobile devices.
              </p>
            </div>

            {/* Secondary Mobile / Admission Helpdesk */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                Secondary / Admission Desk Mobile
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={(e) => handleChange('mobile', e.target.value)}
                  placeholder="+91 9008580707"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* Official Email */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                Official College Email *
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-indigo-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  placeholder="stphilos1946@gmail.com"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                />
              </div>
            </div>

            {/* Physical Postal Address */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                Campus Postal Address *
              </label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-indigo-500 absolute left-3.5 top-3.5" />
                <textarea
                  rows={3}
                  required
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  placeholder="PB No. 2, Bannimantap, Mysuru - 570015, Karnataka, India"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition-all font-medium"
                />
              </div>
            </div>

            {/* Active Academic Year */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                Current Academic Calendar Year
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={formData.activeAcademicYear}
                  onChange={(e) => handleChange('activeAcademicYear', e.target.value)}
                  placeholder="2026-27"
                  className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600 transition-all"
                />
              </div>
            </div>

            {/* College Motto */}
            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                Institutional Motto / Tagline
              </label>
              <input
                type="text"
                value={formData.motto}
                onChange={(e) => handleChange('motto', e.target.value)}
                placeholder="Caritas et Scientia (Love and Knowledge)"
                className="w-full px-4 py-2.5 bg-white border border-slate-200/90 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600 transition-all font-medium"
              />
            </div>

          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full bg-[#342456] hover:bg-black text-white py-3 px-6 rounded-2xl text-xs font-bold shadow-md transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save Institutional Settings</span>
            </button>
          </div>
        </div>

        {/* Right Column: Realtime Live Footer Preview (~35% width) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Live Preview Card */}
          <div className="bg-gradient-to-b from-[#071536] via-[#0B1F4E] to-[#040b1e] rounded-3xl p-6 text-white border-2 border-[#C9A84C]/50 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#F0D98C] font-bold">
                Realtime Footer Preview
              </span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono">
                Live Output
              </span>
            </div>

            {/* Header branding in footer */}
            <div className="flex items-center space-x-3">
              <img
                src="/assets/images/logo/crest_gold_hd.png"
                alt="St. Philomena's Crest"
                className="h-11 w-auto object-contain filter drop-shadow-sm"
                onError={(e) => { e.currentTarget.src = '/assets/images/logo/crest_white_hd.png'; }}
              />
              <div>
                <h3 className="font-serif font-extrabold text-base text-white">
                  St. Philomena's College
                </h3>
                <p className="text-[10px] text-[#F0D98C] font-bold uppercase tracking-wider">
                  (Autonomous), Mysuru · Est. 1946
                </p>
              </div>
            </div>

            <p className="text-slate-300 text-[11px] leading-relaxed">
              Affiliated to the University of Mysore. A premier UGC Autonomous Catholic institution managed by MDES. Re-accredited with NAAC Cycle III B++ Grade.
            </p>

            {/* Contact details preview */}
            <div className="space-y-2.5 text-xs pt-1">
              
              {/* Phone */}
              <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                <Phone className="w-4 h-4 text-[#F0D98C] shrink-0" />
                <span className="font-mono font-bold text-white text-xs">
                  {formData.phone || '+91 9008580707'}
                </span>
              </div>

              {/* Email */}
              <div className="flex items-center space-x-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                <Mail className="w-4 h-4 text-[#F0D98C] shrink-0" />
                <span className="text-white text-xs truncate">
                  {formData.email || 'stphilos1946@gmail.com'}
                </span>
              </div>

              {/* Address */}
              <div className="flex items-start space-x-2.5 p-2 rounded-xl bg-white/5 border border-white/10">
                <MapPin className="w-4 h-4 text-[#F0D98C] shrink-0 mt-0.5" />
                <span className="text-slate-300 text-[11px] leading-relaxed">
                  {formData.address || 'PB No. 2, Bannimantap, Mysuru – 570015, Karnataka, India'}
                </span>
              </div>

            </div>

            <div className="pt-2 border-t border-white/10 text-center">
              <Link
                to="/"
                target="_blank"
                className="inline-flex items-center space-x-1.5 text-xs text-[#F0D98C] hover:underline"
              >
                <span>Check live site footer</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Guidance Info Card */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-5 shadow-xs backdrop-blur-md space-y-2 text-xs text-slate-600">
            <div className="flex items-center space-x-2 text-indigo-900 font-bold">
              <Info className="w-4 h-4 text-indigo-600" />
              <span>Where is this displayed?</span>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              The phone number and contact details saved here automatically synchronize across the <strong>Public Website Footer</strong>, the <strong>Contact Us</strong> page, and mobile quick-call widgets.
            </p>
          </div>

        </div>

      </form>

    </div>
  );
}
