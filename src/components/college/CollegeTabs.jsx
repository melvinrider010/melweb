import React, { useRef } from 'react';

/**
 * CollegeTabs
 * Accessible segmented tab switcher inspired by Metronic tabs and customized for STPHLOS.
 * 
 * @param {Array<{ id: string, label: string, icon?: React.ComponentType, badge?: string | number, disabled?: boolean }>} tabs
 * @param {string} activeTab - ID of the active tab
 * @param {function} onChange - Callback when a tab is selected: (tabId) => void
 * @param {'pills' | 'line' | 'segmented'} variant - Visual variant (default: 'pills')
 * @param {string} className - Additional container classes
 */
export default function CollegeTabs({
  tabs = [],
  activeTab,
  onChange,
  variant = 'pills',
  className = ''
}) {
  const tabListRef = useRef(null);

  if (!tabs || tabs.length === 0) return null;

  // Keyboard accessibility: Left/Right arrows, Home, End
  const handleKeyDown = (e, index) => {
    const enabledTabs = tabs.filter(t => !t.disabled);
    const currentIndex = enabledTabs.findIndex(t => t.id === tabs[index].id);

    let nextIndex = -1;
    if (e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % enabledTabs.length;
    } else if (e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + enabledTabs.length) % enabledTabs.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = enabledTabs.length - 1;
    }

    if (nextIndex !== -1 && onChange) {
      e.preventDefault();
      const nextTab = enabledTabs[nextIndex];
      onChange(nextTab.id);
      // Focus target element
      const buttons = tabListRef.current?.querySelectorAll('[role="tab"]');
      if (buttons && buttons[nextIndex]) {
        buttons[nextIndex].focus();
      }
    }
  };

  // --- VARIANT 1: LINE (Underline tab strip) ---
  if (variant === 'line') {
    return (
      <div 
        ref={tabListRef}
        role="tablist" 
        className={`flex items-center space-x-6 sm:space-x-8 border-b border-slate-200 overflow-x-auto no-scrollbar ${className}`}
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTab;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onChange && onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`pb-3 pt-1 text-xs sm:text-sm font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer focus:outline-none ${
                isActive
                  ? 'border-[#1C5496] text-[#1C5496]'
                  : 'border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300'
              } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {TabIcon && <TabIcon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-100 text-[#1C5496]' : 'bg-slate-100 text-slate-600'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // --- VARIANT 2: SEGMENTED (Connected track container) ---
  if (variant === 'segmented') {
    return (
      <div
        ref={tabListRef}
        role="tablist"
        className={`inline-flex p-1 bg-slate-100/90 rounded-xl border border-slate-200/70 overflow-x-auto max-w-full ${className}`}
      >
        {tabs.map((tab, idx) => {
          const isActive = tab.id === activeTab;
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              role="tab"
              id={`tab-${tab.id}`}
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              disabled={tab.disabled}
              onClick={() => onChange && onChange(tab.id)}
              onKeyDown={(e) => handleKeyDown(e, idx)}
              className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1C5496] ${
                isActive
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/60'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50 border border-transparent'
              } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
            >
              {TabIcon && <TabIcon className="w-4 h-4" />}
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-100 text-[#1C5496]' : 'bg-slate-200 text-slate-700'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    );
  }

  // --- VARIANT 3: PILLS (Default STPHLOS Tab Standard) ---
  return (
    <div
      ref={tabListRef}
      role="tablist"
      className={`flex flex-wrap items-center gap-2 overflow-x-auto no-scrollbar py-1 ${className}`}
    >
      {tabs.map((tab, idx) => {
        const isActive = tab.id === activeTab;
        const TabIcon = tab.icon;

        return (
          <button
            key={tab.id}
            role="tab"
            id={`tab-${tab.id}`}
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            tabIndex={isActive ? 0 : -1}
            disabled={tab.disabled}
            onClick={() => onChange && onChange(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 flex items-center gap-2 whitespace-nowrap cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-[#1C5496]/40 ${
              isActive
                ? 'bg-[#0B1F4E] text-[#FFD84A] shadow-xs border border-[#0B1F4E]'
                : 'bg-white text-slate-700 hover:bg-slate-50 hover:text-slate-900 border border-slate-200 shadow-2xs'
            } ${tab.disabled ? 'opacity-40 cursor-not-allowed' : ''}`}
          >
            {TabIcon && <TabIcon className="w-4 h-4" />}
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                isActive ? 'bg-[#1C5496] text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
