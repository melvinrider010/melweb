import React, { useState } from 'react';
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
  FolderTree
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
      
      {/* 1. TOP HEADER & ACTIONS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#08121E] border border-slate-800 p-6 rounded-2xl shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#1C5496] text-[#FFD84A] font-mono text-[10px] font-bold uppercase tracking-wider">
              CMS Module 22.9
            </span>
            <span className="text-slate-400 text-xs">Dynamic Navigation Structure</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-extrabold text-white">
            Navigation & Mega-Menu Manager
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-sans">
            Customize top header mega-menus, reorder sub-headings, add internal pages or external portals without modifying code.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="btn-gold px-6 py-3 rounded-xl text-xs font-bold shadow-lg inline-flex items-center space-x-2 shrink-0 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Publish Menu Changes</span>
        </button>
      </div>

      {/* 2. MENU SECTION SELECTOR TABS */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        {Object.keys(currentMenuData).map((key) => (
          <button
            key={key}
            onClick={() => setSelectedMenuKey(key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer capitalize ${
              selectedMenuKey === key
                ? 'bg-[#1C5496] text-white shadow-md border border-[#FFD84A]/30'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {currentMenuData[key]?.title || key}
          </button>
        ))}
      </div>

      {/* 3. ACTIVE MEGA-MENU COLUMNS BUILDER */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-serif font-bold text-lg text-white">
            Editing Dropdown: <span className="text-[#FFD84A]">{activeMenu.title}</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">
            {activeMenu.columns?.length || 0} Columns Configured
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(activeMenu.columns || []).map((col, colIdx) => (
            <div
              key={colIdx}
              className="bg-[#0D1B2A] border border-slate-800 rounded-2xl p-5 space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* Column Heading */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-serif font-bold text-sm text-[#FFD84A]">
                    {col.heading || `Column ${colIdx + 1}`}
                  </span>
                  <span className="text-[10px] font-mono text-slate-500">
                    {col.links?.length || 0} Links
                  </span>
                </div>

                {/* Links List */}
                <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                  {(col.links || []).map((link, lIdx) => (
                    <div
                      key={lIdx}
                      className="p-2 rounded-lg bg-slate-900 border border-slate-800/80 flex items-center justify-between group hover:border-slate-700 text-xs"
                    >
                      <div className="space-y-0.5 overflow-hidden pr-2">
                        <span className="font-medium text-slate-200 block truncate">
                          {link.label}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500 block truncate">
                          {link.path}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteLink(colIdx, lIdx)}
                        className="p-1 rounded bg-slate-800 hover:bg-rose-600 text-slate-400 hover:text-white transition-colors shrink-0"
                        title="Remove link"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Add Link Trigger */}
              <div className="pt-3 border-t border-slate-800">
                <button
                  onClick={() => handleAddLink(colIdx)}
                  className="w-full py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold border border-slate-800 flex items-center justify-center space-x-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5 text-[#FFD84A]" />
                  <span>Add Sub-Link to this Column</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* ================= MODAL: ADD SUB-LINK ================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#0D1B2A] border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 text-slate-200">
            
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-serif font-bold text-base text-white">
                Add New Navigation Link
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveNewLink} className="space-y-3 text-xs">
              
              <div className="space-y-1">
                <label className="text-slate-400 font-bold block">Link Label *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Campus Facilities / IQAC"
                  value={newLink.label}
                  onChange={(e) => setNewLink({ ...newLink, label: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold block">Destination Path / URL *</label>
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
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none font-mono"
                />
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-gold px-5 py-2 rounded-xl font-bold"
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
