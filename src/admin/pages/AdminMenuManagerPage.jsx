import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Layers, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  ChevronRight, 
  Save, 
  RotateCcw, 
  X, 
  CheckCircle2,
  FolderTree,
  Menu,
  Layout
} from 'lucide-react';
import cmsStore from '../../lib/cmsStore';
import useCms from '../../lib/useCms';

export default function AdminMenuManagerPage() {
  const menus = useCms(() => cmsStore.getMenus());
  const [selectedMenuKey, setSelectedMenuKey] = useState('about');
  const [currentMenuData, setCurrentMenuData] = useState(() => JSON.parse(JSON.stringify(menus)));

  // Modal to add a new link
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetColIdx, setTargetColIdx] = useState(0);
  const [newLink, setNewLink] = useState({ label: '', path: '', isExternal: false });

  const activeMenu = currentMenuData[selectedMenuKey] || { title: selectedMenuKey, columns: [] };

  const handleAddLink = (colIdx) => {
    setTargetColIdx(colIdx);
    setNewLink({ label: '', path: '', isExternal: false });
    setIsModalOpen(true);
  };

  const handleSaveNewLink = (e) => {
    e.preventDefault();
    const updated = JSON.parse(JSON.stringify(currentMenuData));
    const targetCol = updated[selectedMenuKey].columns[targetColIdx];
    if (targetCol) {
      targetCol.links = targetCol.links || [];
      targetCol.links.push({ ...newLink });
      setCurrentMenuData(updated);
    }
    setIsModalOpen(false);
  };

  const handleDeleteLink = (colIdx, linkIdx) => {
    const updated = JSON.parse(JSON.stringify(currentMenuData));
    const targetCol = updated[selectedMenuKey].columns[colIdx];
    if (targetCol && targetCol.links) {
      targetCol.links.splice(linkIdx, 1);
      setCurrentMenuData(updated);
    }
  };

  const handleSaveAll = async () => {
    await cmsStore.saveMenus(currentMenuData);
    alert('Navigation mega-menus successfully saved and published live!');
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      
      {/* NAVIGATION SUITE SWITCHER */}
      <div className="flex items-center space-x-1.5 bg-slate-100/80 p-1.5 rounded-2xl text-xs font-semibold w-fit">
        <Link
          to="/admin/pages"
          className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center space-x-1.5"
        >
          <Layers className="w-3.5 h-3.5 text-slate-400" />
          <span>All Pages</span>
        </Link>
        <button
          className="px-4 py-2 rounded-xl bg-white text-indigo-900 font-bold shadow-xs inline-flex items-center space-x-1.5 cursor-default"
        >
          <Menu className="w-3.5 h-3.5 text-indigo-600" />
          <span>Mega-Menu Editor</span>
        </button>
        <Link
          to="/admin/header-footer"
          className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 transition-colors inline-flex items-center space-x-1.5"
        >
          <Layout className="w-3.5 h-3.5 text-slate-400" />
          <span>Header & Footer</span>
        </Link>
      </div>

      {/* 1. TOP HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200/80 p-6 sm:p-8 rounded-2xl shadow-xs">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module 22.9
            </span>
            <span className="text-slate-400 text-xs">Dynamic Navigation Structure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#191d28] tracking-tight">
            Navigation & Mega-Menu Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium max-w-2xl leading-relaxed">
            Customize top header mega-menus, reorder sub-headings, add internal pages or external portals without modifying code.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="bg-[#18191f] hover:bg-black text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-xs inline-flex items-center space-x-2 shrink-0 cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          <span>Publish Menu Changes</span>
        </button>
      </div>

      {/* 2. MENU SECTION SELECTOR TABS */}
      <div className="bg-slate-100/80 border border-slate-200/60 p-1.5 rounded-2xl flex flex-wrap gap-1.5 text-xs font-sans">
        {Object.keys(currentMenuData).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedMenuKey(key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
              selectedMenuKey === key
                ? 'bg-[#18191f] text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 font-semibold'
            }`}
          >
            {currentMenuData[key]?.title || key}
          </button>
        ))}
      </div>

      {/* 3. ACTIVE MEGA-MENU COLUMNS BUILDER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-base text-[#191d28]">
            Editing Dropdown: <span className="text-slate-900">{activeMenu.title}</span>
          </h2>
          <span className="text-xs font-mono text-slate-500">
            {activeMenu.columns?.length || 0} Columns Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeMenu.columns || []).map((col, colIdx) => (
            <div
              key={colIdx}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 space-y-4 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-colors"
            >
              <div className="space-y-3">
                {/* Column Heading */}
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <span className="font-bold text-sm text-[#191d28]">
                    {col.heading || `Column ${colIdx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {col.links?.length || 0} Links
                  </span>
                </div>

                {/* Links List */}
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {(col.links || []).map((link, lIdx) => (
                    <div
                      key={lIdx}
                      className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center justify-between group hover:border-slate-300 transition-colors text-xs"
                    >
                      <div className="space-y-0.5 overflow-hidden pr-2">
                        <span className="font-semibold text-slate-800 block truncate">
                          {link.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 block truncate">
                          {link.path}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteLink(colIdx, lIdx)}
                        className="p-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-colors shrink-0 cursor-pointer"
                        title="Remove link"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Link Trigger */}
              <div className="pt-3 border-t border-slate-100">
                <button
                  onClick={() => handleAddLink(colIdx)}
                  className="w-full py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 text-xs font-bold border border-slate-200 flex items-center justify-center space-x-1.5 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-slate-700" />
                  <span>Add Sub-Link to this Column</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL: ADD SUB-LINK ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-800">
            
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-base text-[#191d28]">
                Add New Navigation Link
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewLink} className="space-y-3 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-700 font-bold block">Link Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus Facilities / IQAC"
                  value={newLink.label}
                  onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-700 font-bold block">Destination Path / URL *</label>
                <input
                  type="text"
                  required
                  placeholder="/pages/campus-facilities or https://..."
                  value={newLink.path}
                  onChange={(e) => setNewLink({ 
                    ...newLink, 
                    path: e.target.value,
                    isExternal: e.target.value.startsWith('http')
                  })}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:border-slate-900 focus:bg-white font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#18191f] hover:bg-black text-white px-5 py-2 rounded-xl font-bold shadow-xs cursor-pointer transition-all"
                >
                  Add Link
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
