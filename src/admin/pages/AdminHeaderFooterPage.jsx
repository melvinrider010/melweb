import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  PanelTop, 
  Layers, 
  Save, 
  RotateCcw, 
  Check, 
  ExternalLink, 
  Eye, 
  Plus, 
  Trash2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  HelpCircle, 
  Info, 
  Layout, 
  CheckCircle2, 
  ChevronRight,
  Share2,
  Sliders,
  Type,
  Link as LinkIcon,
  RefreshCw,
  Search,
  Menu
} from 'lucide-react';
import cmsStore, { initialHeaderConfig, initialFooterConfig } from '../../lib/cmsStore';
import useCms from '../../lib/useCms';

export default function AdminHeaderFooterPage() {
  const [activeTab, setActiveTab] = useState('header'); // 'header' | 'footer' | 'preview'
  const [activeColIdx, setActiveColIdx] = useState(0);

  // Load from CMS Store
  const headerStore = useCms(() => cmsStore.getHeaderConfig());
  const footerStore = useCms(() => cmsStore.getFooterConfig());

  const [headerData, setHeaderData] = useState(() => JSON.parse(JSON.stringify(headerStore || initialHeaderConfig)));
  const [footerData, setFooterData] = useState(() => JSON.parse(JSON.stringify(footerStore || initialFooterConfig)));

  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // --- Header Update Handlers ---
  const handleTopBarChange = (field, value) => {
    const updated = {
      ...headerData,
      topBar: { ...headerData.topBar, [field]: value }
    };
    setHeaderData(updated);
    cmsStore.updateHeaderConfig(updated);
  };

  const handleBrandingChange = (field, value) => {
    const updated = {
      ...headerData,
      branding: { ...headerData.branding, [field]: value }
    };
    setHeaderData(updated);
    cmsStore.updateHeaderConfig(updated);
  };

  const handleCtaChange = (field, value) => {
    const updated = {
      ...headerData,
      ctaButton: { ...headerData.ctaButton, [field]: value }
    };
    setHeaderData(updated);
    cmsStore.updateHeaderConfig(updated);
  };

  const handleAddNavItem = () => {
    const label = prompt('Enter Navigation Item Label (e.g., ADMISSIONS, CAREERS):');
    if (!label) return;
    const path = prompt('Enter Route Path (e.g., /admissions, /careers):', '/');
    if (!path) return;

    const updated = {
      ...headerData,
      navItems: [...headerData.navItems, { label: label.trim().toUpperCase(), path: path.trim() }]
    };
    setHeaderData(updated);
    cmsStore.updateHeaderConfig(updated);
    triggerToast(`Added navigation item "${label}"`);
  };

  const handleDeleteNavItem = (idx) => {
    const item = headerData.navItems[idx];
    if (!window.confirm(`Remove "${item?.label}" from header navigation?`)) return;
    const updatedItems = headerData.navItems.filter((_, i) => i !== idx);
    const updated = { ...headerData, navItems: updatedItems };
    setHeaderData(updated);
    cmsStore.updateHeaderConfig(updated);
    triggerToast(`Removed navigation item`);
  };

  const handleMoveNavItem = (idx, direction) => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= headerData.navItems.length) return;
    const items = [...headerData.navItems];
    const temp = items[idx];
    items[idx] = items[targetIdx];
    items[targetIdx] = temp;
    const updated = { ...headerData, navItems: items };
    setHeaderData(updated);
    cmsStore.updateHeaderConfig(updated);
  };

  // --- Footer Update Handlers ---
  const handleFooterBrandChange = (field, value) => {
    const updated = {
      ...footerData,
      brand: { ...footerData.brand, [field]: value }
    };
    setFooterData(updated);
    cmsStore.updateFooterConfig(updated);
  };

  const handleFooterBottomChange = (field, value) => {
    const updated = {
      ...footerData,
      bottomBar: { ...footerData.bottomBar, [field]: value }
    };
    setFooterData(updated);
    cmsStore.updateFooterConfig(updated);
  };

  const handleFooterSocialChange = (network, value) => {
    const updated = {
      ...footerData,
      socialLinks: { ...(footerData.socialLinks || {}), [network]: value }
    };
    setFooterData(updated);
    cmsStore.updateFooterConfig(updated);
  };

  const handleColumnTitleChange = (colIdx, title) => {
    const cols = [...footerData.columns];
    if (!cols[colIdx]) return;
    cols[colIdx] = { ...cols[colIdx], title };
    const updated = { ...footerData, columns: cols };
    setFooterData(updated);
    cmsStore.updateFooterConfig(updated);
  };

  const handleAddFooterLink = (colIdx) => {
    const label = prompt('Enter Link Label:');
    if (!label) return;
    const path = prompt('Enter Destination URL / Path (e.g., /academics or https://...):', '/');
    if (!path) return;

    const cols = [...footerData.columns];
    cols[colIdx].links = cols[colIdx].links || [];
    cols[colIdx].links.push({ label: label.trim(), path: path.trim() });
    const updated = { ...footerData, columns: cols };
    setFooterData(updated);
    cmsStore.updateFooterConfig(updated);
    triggerToast(`Added link "${label}" to Column ${colIdx + 1}`);
  };

  const handleDeleteFooterLink = (colIdx, linkIdx) => {
    const cols = [...footerData.columns];
    cols[colIdx].links = cols[colIdx].links.filter((_, i) => i !== linkIdx);
    const updated = { ...footerData, columns: cols };
    setFooterData(updated);
    cmsStore.updateFooterConfig(updated);
    triggerToast(`Link removed`);
  };

  const handleMoveFooterLink = (colIdx, linkIdx, direction) => {
    const targetIdx = direction === 'up' ? linkIdx - 1 : linkIdx + 1;
    const cols = [...footerData.columns];
    const links = [...cols[colIdx].links];
    if (targetIdx < 0 || targetIdx >= links.length) return;
    const temp = links[linkIdx];
    links[linkIdx] = links[targetIdx];
    links[targetIdx] = temp;
    cols[colIdx].links = links;
    const updated = { ...footerData, columns: cols };
    setFooterData(updated);
    cmsStore.updateFooterConfig(updated);
  };

  const handleAddBottomLink = () => {
    const label = prompt('Enter Bottom Legal Link Label (e.g., Privacy & Terms):');
    if (!label) return;
    const path = prompt('Enter Destination URL / Path:', '/');
    if (!path) return;

    const links = [...(footerData.bottomBar?.links || []), { label: label.trim(), path: path.trim() }];
    const updated = {
      ...footerData,
      bottomBar: { ...footerData.bottomBar, links }
    };
    setFooterData(updated);
    cmsStore.updateFooterConfig(updated);
    triggerToast(`Added bottom link "${label}"`);
  };

  const handleDeleteBottomLink = (idx) => {
    const links = (footerData.bottomBar?.links || []).filter((_, i) => i !== idx);
    const updated = {
      ...footerData,
      bottomBar: { ...footerData.bottomBar, links }
    };
    setFooterData(updated);
    cmsStore.updateFooterConfig(updated);
    triggerToast(`Removed bottom link`);
  };

  // --- Save / Reset Actions ---
  const handleSaveAll = (e) => {
    e?.preventDefault();
    setIsSaving(true);
    cmsStore.updateHeaderConfig(headerData);
    cmsStore.updateFooterConfig(footerData);

    setTimeout(() => {
      setIsSaving(false);
      setIsSaved(true);
      triggerToast('Header and Footer configurations saved and live across the entire website!');
      setTimeout(() => setIsSaved(false), 3500);
    }, 400);
  };

  const handleResetDefaults = () => {
    if (!window.confirm('Reset Header and Footer back to official college defaults? Any custom links added will be restored.')) return;
    const reset = cmsStore.resetHeaderFooterDefaults();
    setHeaderData(JSON.parse(JSON.stringify(reset.headerConfig)));
    setFooterData(JSON.parse(JSON.stringify(reset.footerConfig)));
    triggerToast('Header and Footer restored to default institutional settings.');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn max-w-6xl pb-12">
      
      {/* 1. TOP HEADER & BREADCRUMBS BANNER */}
      <div className="bg-white/70 border border-white/80 p-6 sm:p-8 rounded-3xl shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              Layout Architecture
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-mono text-[10px] font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Broadcast Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#1E1B4B] tracking-tight mt-1">
            Header & Footer Customizer
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed mt-1">
            Manage top announcement ticker, brand logo, action CTA buttons, primary navigation items, and dynamic footer columns with live real-time preview.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
          <button
            onClick={handleResetDefaults}
            className="p-3 bg-white hover:bg-slate-50 text-slate-600 border border-slate-200/80 rounded-2xl text-xs font-bold shadow-2xs inline-flex items-center gap-1.5 cursor-pointer transition-all"
            title="Reset to Official Defaults"
          >
            <RotateCcw className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={handleSaveAll}
            disabled={isSaving}
            className="bg-[#342456] hover:bg-black text-white px-6 py-3 rounded-2xl text-xs font-bold shadow-md inline-flex items-center space-x-2 cursor-pointer transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Saving Changes...</span>
              </>
            ) : isSaved ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Saved Live!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toast Alert */}
      {toastMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200/80 rounded-2xl flex items-center space-x-3 text-emerald-800 text-xs font-bold animate-fadeIn shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 2. NAVIGATION SUITE TABS (Pages, Menus, Header & Footer) */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4">
        <div className="flex items-center space-x-1.5 bg-slate-100/80 p-1.5 rounded-2xl text-xs font-semibold">
          <Link
            to="/admin/pages"
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center space-x-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>All Pages</span>
          </Link>
          <Link
            to="/admin/menus"
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center space-x-1.5"
          >
            <Menu className="w-3.5 h-3.5 text-slate-400" />
            <span>Mega-Menu Editor</span>
          </Link>
          <button
            className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold shadow-xs inline-flex items-center space-x-1.5 cursor-default"
          >
            <Layout className="w-3.5 h-3.5 text-indigo-600" />
            <span>Header & Footer</span>
          </button>
        </div>

        {/* Section View Switcher */}
        <div className="flex items-center space-x-1 bg-white/80 border border-slate-200/80 p-1 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab('header')}
            className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center space-x-1.5 ${
              activeTab === 'header'
                ? 'bg-[#342456] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <PanelTop className="w-3.5 h-3.5" />
            <span>Header Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('footer')}
            className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center space-x-1.5 ${
              activeTab === 'footer'
                ? 'bg-[#342456] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>Footer Settings</span>
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`px-4 py-1.5 rounded-xl transition-all cursor-pointer inline-flex items-center space-x-1.5 ${
              activeTab === 'preview'
                ? 'bg-[#342456] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Interactive Live Preview</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SECTION A: HEADER CONFIGURATION EDITOR                                    */}
      {/* ========================================================================= */}
      {activeTab === 'header' && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          
          {/* Card 1: Top Utility Bar */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#1E1B4B]">Tier 1: Top Utility Bar</h2>
                  <p className="text-xs text-slate-400">Institutional announcement banner, direct phone hotline & search modal</p>
                </div>
              </div>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={headerData.topBar?.enabled !== false}
                  onChange={(e) => handleTopBarChange('enabled', e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
                <span className="text-xs font-bold text-slate-700">Enable Top Bar</span>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Announcement Ticker / Notice Text
                </label>
                <input
                  type="text"
                  value={headerData.topBar?.announcementText || ''}
                  onChange={(e) => handleTopBarChange('announcementText', e.target.value)}
                  placeholder="e.g. Admissions Open for Academic Year 2026–27 | UGC Autonomous Catholic College"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                />
                <p className="text-[10px] text-slate-400">Appears with a pulsing amber LED beacon on desktop devices.</p>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Announcement Target Link
                </label>
                <input
                  type="text"
                  value={headerData.topBar?.announcementLink || ''}
                  onChange={(e) => handleTopBarChange('announcementLink', e.target.value)}
                  placeholder="/admissions"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Top Bar Phone Hotline
                </label>
                <input
                  type="text"
                  value={headerData.topBar?.phone || ''}
                  onChange={(e) => handleTopBarChange('phone', e.target.value)}
                  placeholder="+91 9008580707, 9008028258"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Contact Desk Label
                </label>
                <input
                  type="text"
                  value={headerData.topBar?.contactDeskLabel || ''}
                  onChange={(e) => handleTopBarChange('contactDeskLabel', e.target.value)}
                  placeholder="Contact Desk"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Contact Desk Destination Link
                </label>
                <input
                  type="text"
                  value={headerData.topBar?.contactDeskLink || ''}
                  onChange={(e) => handleTopBarChange('contactDeskLink', e.target.value)}
                  placeholder="/contact"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Brand Logo & Identity */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#1E1B4B]">Tier 2: Brand Banner Logo & Admissions CTA</h2>
                <p className="text-xs text-slate-400">Main header brand crest banner and prominent golden action button</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Official Header Banner Logo URL
                </label>
                <input
                  type="text"
                  value={headerData.branding?.logoUrl || ''}
                  onChange={(e) => handleBrandingChange('logoUrl', e.target.value)}
                  placeholder="/assets/images/logo/official_college_banner_logo_transparent.png"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Logo Alternative Text (Accessibility)
                </label>
                <input
                  type="text"
                  value={headerData.branding?.altText || ''}
                  onChange={(e) => handleBrandingChange('altText', e.target.value)}
                  placeholder="St. Philomena's College (Autonomous), Mysuru"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              {/* Logo Preview Box */}
              <div className="md:col-span-2 p-4 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex items-center space-x-4">
                <div className="w-40 h-14 bg-white rounded-xl border border-slate-200 flex items-center justify-center p-2 shrink-0">
                  <img
                    src={headerData.branding?.logoUrl || '/assets/images/logo/official_college_banner_logo_transparent.png'}
                    alt="Logo Preview"
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => { e.target.src = '/assets/images/logo/college-logo.png'; }}
                  />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">Banner Logo Live Preview</h4>
                  <p className="text-[11px] text-slate-400">Rendered in the central brand header row with responsive scaling across mobile and 4K displays.</p>
                </div>
              </div>

              {/* CTA Button Settings */}
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Admissions CTA Button Label
                </label>
                <input
                  type="text"
                  value={headerData.ctaButton?.label || ''}
                  onChange={(e) => handleCtaChange('label', e.target.value)}
                  placeholder="Apply Online 2026–27"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  CTA Destination URL (Portal Link)
                </label>
                <input
                  type="text"
                  value={headerData.ctaButton?.url || ''}
                  onChange={(e) => handleCtaChange('url', e.target.value)}
                  placeholder="https://student.stphiloserp.in/"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Card 3: Tier 3 Primary Navigation Items */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Layers className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#1E1B4B]">Tier 3: Primary Navigation Bar Items</h2>
                  <p className="text-xs text-slate-400">Order, rename, or link top-level desktop navigation tabs to mega-menus</p>
                </div>
              </div>

              <button
                onClick={handleAddNavItem}
                className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Navigation Item</span>
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {headerData.navItems.map((item, idx) => (
                <div key={idx} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/50 p-2 rounded-xl transition-colors">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-6 h-6 rounded-lg bg-slate-100 text-slate-500 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 text-xs tracking-tight">{item.label}</span>
                        {item.megaKey && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[10px] font-mono font-bold border border-amber-200">
                            Mega: {item.megaKey}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] font-mono text-slate-400 truncate">{item.path}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleMoveNavItem(idx, 'up')}
                      disabled={idx === 0}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleMoveNavItem(idx, 'down')}
                      disabled={idx === headerData.navItems.length - 1}
                      className="p-1.5 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded-lg hover:bg-slate-100"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteNavItem(idx)}
                      className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg"
                      title="Delete Item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION B: FOOTER CONFIGURATION EDITOR                                    */}
      {/* ========================================================================= */}
      {activeTab === 'footer' && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          
          {/* Card 1: Footer Brand & Crest Column */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-6">
            <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
              <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#1E1B4B]">Footer Brand Column & Institutional Crest</h2>
                <p className="text-xs text-slate-400">Official crest logo, autonomous identity statement, and institutional accreditation notice</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Footer Crest Logo URL
                </label>
                <input
                  type="text"
                  value={footerData.brand?.crestUrl || ''}
                  onChange={(e) => handleFooterBrandChange('crestUrl', e.target.value)}
                  placeholder="/assets/images/logo/crest_gold_hd.png"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-mono text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Institution Display Title
                </label>
                <input
                  type="text"
                  value={footerData.brand?.title || ''}
                  onChange={(e) => handleFooterBrandChange('title', e.target.value)}
                  placeholder="St. Philomena's College"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Autonomous Subtitle & Est. Year
                </label>
                <input
                  type="text"
                  value={footerData.brand?.subtitle || ''}
                  onChange={(e) => handleFooterBrandChange('subtitle', e.target.value)}
                  placeholder="(Autonomous), Mysuru · Est. 1946"
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5 md:col-span-2">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Institutional Affiliation & NAAC Accreditation Statement
                </label>
                <textarea
                  rows={3}
                  value={footerData.brand?.description || ''}
                  onChange={(e) => handleFooterBrandChange('description', e.target.value)}
                  placeholder="Affiliated to the University of Mysore. A premier UGC Autonomous Catholic institution managed by MDES..."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Card 2: 3 Link Columns Manager */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <Layout className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#1E1B4B]">Footer Quick Link Columns</h2>
                  <p className="text-xs text-slate-400">Manage titles and links for Columns 2, 3, and 4 (Academics, Examinations, Mandatory Disclosure)</p>
                </div>
              </div>

              <div className="flex items-center space-x-1.5 bg-slate-100 p-1 rounded-xl text-xs font-bold">
                {footerData.columns.map((col, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveColIdx(idx)}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      activeColIdx === idx
                        ? 'bg-[#342456] text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Column {idx + 1}: {col.title}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Column Editor */}
            {footerData.columns[activeColIdx] && (
              <div className="space-y-5">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1 max-w-sm space-y-1">
                    <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                      Column {activeColIdx + 1} Heading Title
                    </label>
                    <input
                      type="text"
                      value={footerData.columns[activeColIdx].title}
                      onChange={(e) => handleColumnTitleChange(activeColIdx, e.target.value)}
                      className="w-full px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-900"
                    />
                  </div>

                  <button
                    onClick={() => handleAddFooterLink(activeColIdx)}
                    className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer transition-colors self-end"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Link</span>
                  </button>
                </div>

                <div className="border border-slate-100 rounded-2xl divide-y divide-slate-100 bg-white/60">
                  {(footerData.columns[activeColIdx].links || []).map((link, lIdx) => (
                    <div key={lIdx} className="p-3 flex items-center justify-between gap-3 text-xs hover:bg-white transition-colors">
                      <div className="min-w-0 pr-3">
                        <span className="font-bold text-slate-900 block truncate">{link.label}</span>
                        <span className="text-[11px] font-mono text-slate-400 truncate block">{link.path}</span>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0">
                        <button
                          onClick={() => handleMoveFooterLink(activeColIdx, lIdx, 'up')}
                          disabled={lIdx === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleMoveFooterLink(activeColIdx, lIdx, 'down')}
                          disabled={lIdx === footerData.columns[activeColIdx].links.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 rounded hover:bg-slate-100"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteFooterLink(activeColIdx, lIdx)}
                          className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                          title="Delete Link"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Card 3: Bottom Legal & Copyright Bar */}
          <div className="bg-white/70 border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_10px_35px_rgba(0,0,0,0.03)] backdrop-blur-md space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-9 h-9 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
                <div>
                  <h2 className="text-base font-extrabold text-[#1E1B4B]">Bottom Copyright & Policy Bar</h2>
                  <p className="text-xs text-slate-400">Copyright statement, legal policy links, and CMS Portal shortcut</p>
                </div>
              </div>

              <button
                onClick={handleAddBottomLink}
                className="px-3.5 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-xl text-xs font-bold inline-flex items-center space-x-1.5 cursor-pointer transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Legal Link</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Copyright Notice Text
                </label>
                <input
                  type="text"
                  value={footerData.bottomBar?.copyrightText || ''}
                  onChange={(e) => handleFooterBottomChange('copyrightText', e.target.value)}
                  placeholder="St. Philomena's College (Autonomous), Mysuru. All Rights Reserved."
                  className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
                />
              </div>

              {/* Bottom links list */}
              <div className="space-y-2 pt-2">
                <label className="block text-[11px] font-mono uppercase text-slate-500 font-bold">
                  Bottom Navigation Links
                </label>
                <div className="flex flex-wrap gap-2">
                  {(footerData.bottomBar?.links || []).map((link, idx) => (
                    <div key={idx} className="flex items-center space-x-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700">
                      <span>{link.label}</span>
                      <span className="text-[10px] font-mono text-slate-400">({link.path})</span>
                      <button
                        onClick={() => handleDeleteBottomLink(idx)}
                        className="text-slate-400 hover:text-rose-500 cursor-pointer"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* SECTION C: INTERACTIVE LIVE PREVIEW                                       */}
      {/* ========================================================================= */}
      {activeTab === 'preview' && (
        <div className="space-y-6 sm:space-y-8 animate-fadeIn">
          <div className="p-4 bg-indigo-50 border border-indigo-200/80 rounded-2xl flex items-center justify-between text-indigo-900 text-xs">
            <div className="flex items-center space-x-2.5">
              <Eye className="w-4 h-4 text-indigo-600 shrink-0" />
              <span>
                Below is the live accurate rendering of the <strong>Public Website Header</strong> and <strong>Footer</strong> with your current configuration.
              </span>
            </div>
            <Link
              to="/"
              target="_blank"
              className="font-bold underline hover:text-black inline-flex items-center space-x-1 shrink-0"
            >
              <span>View live website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Scaled Header Mockup Preview */}
          <div className="border border-slate-300 rounded-3xl overflow-hidden shadow-lg bg-white">
            <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-600 flex items-center justify-between">
              <span>Header Live Preview</span>
              <span className="text-[10px] font-mono text-slate-400">Responsive Layout View</span>
            </div>

            {/* Header Tier 1 */}
            {headerData.topBar?.enabled !== false && (
              <div className="bg-gradient-to-r from-[#061330] via-[#0B1F4E] to-[#061330] text-slate-200 text-xs py-1.5 px-6 border-b border-white/10 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-[11px]">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                  <span>{headerData.topBar?.announcementText}</span>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono font-bold">
                  <span>{headerData.topBar?.phone}</span>
                  <span>|</span>
                  <span className="font-sans font-normal">{headerData.topBar?.contactDeskLabel}</span>
                </div>
              </div>
            )}

            {/* Header Tier 2 */}
            <div className="bg-white px-6 py-3 border-b border-slate-200 flex justify-between items-center">
              <img
                src={headerData.branding?.logoUrl || '/assets/images/logo/official_college_banner_logo_transparent.png'}
                alt="Banner Logo"
                className="h-12 w-auto object-contain"
                onError={(e) => { e.target.src = '/assets/images/logo/official_college_banner_logo.png'; }}
              />
              {headerData.ctaButton?.enabled !== false && (
                <button className="bg-amber-400 hover:bg-amber-500 text-slate-900 px-4 py-2 rounded-lg text-xs font-bold shadow-xs">
                  {headerData.ctaButton?.label || 'Apply Online 2026–27'}
                </button>
              )}
            </div>

            {/* Header Tier 3 */}
            <div className="bg-gradient-to-r from-[#061330] via-[#0B1F4E] to-[#091b42] border-b-2 border-[#C9A84C] text-white px-6 py-2.5 overflow-x-auto flex items-center justify-center space-x-4 text-xs font-bold">
              {headerData.navItems.map((n, i) => (
                <span key={i} className="hover:text-amber-300 transition-colors whitespace-nowrap cursor-pointer">
                  {n.label}
                </span>
              ))}
            </div>
          </div>

          {/* Scaled Footer Mockup Preview */}
          <div className="border border-slate-300 rounded-3xl overflow-hidden shadow-lg bg-[#0B1F4E] text-white">
            <div className="px-4 py-2.5 bg-black/30 border-b border-white/10 text-xs font-bold text-amber-300 flex items-center justify-between">
              <span>Footer Live Preview</span>
              <span className="text-[10px] font-mono text-white/50">4-Column Grid View</span>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-4 gap-8 text-xs border-b border-white/15">
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={footerData.brand?.crestUrl || '/assets/images/logo/crest_gold_hd.png'}
                    alt="Crest"
                    className="h-12 w-auto object-contain"
                  />
                  <div>
                    <h4 className="font-serif font-bold text-base text-white">{footerData.brand?.title}</h4>
                    <p className="text-[10px] text-amber-300 font-bold uppercase">{footerData.brand?.subtitle}</p>
                  </div>
                </div>
                <p className="text-slate-300 text-[11px] leading-relaxed">
                  {footerData.brand?.description}
                </p>
              </div>

              {footerData.columns.map((col, idx) => (
                <div key={idx} className="space-y-2.5">
                  <h5 className="font-serif font-bold text-xs uppercase tracking-wider text-amber-300 border-b border-white/15 pb-1">
                    {col.title}
                  </h5>
                  <ul className="space-y-1.5 text-slate-200 text-[11px]">
                    {(col.links || []).map((l, li) => (
                      <li key={li} className="hover:text-amber-300 transition-colors cursor-pointer truncate">
                        • {l.label}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="px-8 py-3 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-300 gap-2">
              <span>© {new Date().getFullYear()} {footerData.bottomBar?.copyrightText}</span>
              <div className="flex items-center space-x-3">
                {(footerData.bottomBar?.links || []).map((l, li) => (
                  <span key={li} className="hover:text-white cursor-pointer">{l.label}</span>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
