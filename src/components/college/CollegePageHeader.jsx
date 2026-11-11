import React from 'react';
import CollegeBreadcrumb from './CollegeBreadcrumb';

/**
 * CollegePageHeader
 * Standardized institutional page header for St. Philomena's internal pages.
 * 
 * @param {string | React.ReactNode} title - Primary page title
 * @param {string | React.ReactNode} subtitle - Optional descriptive subtitle / overview
 * @param {string} eyebrow - Category / hierarchy tag (e.g. "School of Science", "Undergraduate")
 * @param {React.ReactNode | Array<{ label: string, href?: string }>} breadcrumb - Breadcrumb node or items array
 * @param {React.ComponentType} icon - Optional icon component
 * @param {React.ReactNode} badge - Optional status or accreditation badge
 * @param {React.ReactNode} actions - Optional quick actions / buttons on right side
 * @param {Array<{ label: string, value: string | number, icon?: React.ComponentType }>} stats - Optional quick metric items
 * @param {string} className - Optional class name override
 */
export default function CollegePageHeader({
  title,
  subtitle,
  eyebrow,
  breadcrumb,
  icon: HeaderIcon,
  badge,
  actions,
  stats,
  className = ''
}) {
  return (
    <header 
      className={`bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-8 lg:p-10 shadow-xs relative overflow-hidden space-y-6 ${className}`}
    >
      {/* Decorative Brand Accent (Top border highlight) */}
      <div 
        aria-hidden="true" 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#0B1F4E] via-[#1C5496] to-[#C9A84C]" 
      />

      {/* Breadcrumb Row */}
      {breadcrumb && (
        <div className="border-b border-slate-100 pb-3 -mt-1">
          {Array.isArray(breadcrumb) ? (
            <CollegeBreadcrumb items={breadcrumb} />
          ) : (
            breadcrumb
          )}
        </div>
      )}

      {/* Main Content Layout */}
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
        <div className="space-y-3 max-w-4xl flex-1">
          {/* Eyebrow & Badges */}
          {(eyebrow || badge) && (
            <div className="flex flex-wrap items-center gap-2">
              {eyebrow && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-bold tracking-wider uppercase bg-blue-50 text-[#1C5496] border border-blue-100/80">
                  {eyebrow}
                </span>
              )}
              {badge && (
                typeof badge === 'string' ? (
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200/60">
                    {badge}
                  </span>
                ) : badge
              )}
            </div>
          )}

          {/* Title with optional icon */}
          <div className="flex items-start gap-3">
            {HeaderIcon && (
              <div 
                aria-hidden="true"
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-gradient-to-br from-[#0B1F4E] to-[#1C5496] text-[#FFD84A] flex items-center justify-center shrink-0 shadow-xs mt-0.5"
              >
                <HeaderIcon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            )}
            <h1 className="font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight">
              {title}
            </h1>
          </div>

          {/* Subtitle / Description */}
          {subtitle && (
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-sans max-w-3xl pt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Action Controls */}
        {actions && (
          <div className="flex flex-wrap items-center gap-3 shrink-0 pt-2 lg:pt-0">
            {actions}
          </div>
        )}
      </div>

      {/* Quick Metrics / Stats Strip */}
      {stats && stats.length > 0 && (
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {stats.map((stat, idx) => {
            const StatIcon = stat.icon;
            return (
              <div 
                key={stat.label || idx}
                className="bg-slate-50/90 rounded-xl p-3 sm:p-3.5 border border-slate-200/70 flex items-center gap-3"
              >
                {StatIcon && (
                  <div className="w-8 h-8 rounded-lg bg-white text-[#1C5496] flex items-center justify-center shrink-0 shadow-2xs border border-slate-200/60">
                    <StatIcon className="w-4 h-4" />
                  </div>
                )}
                <div className="min-w-0 flex-1">
                  <div className="font-heading font-semibold text-base sm:text-card text-slate-900 leading-none truncate">
                    {stat.value}
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 uppercase tracking-wider truncate pt-1">
                    {stat.label}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </header>
  );
}
