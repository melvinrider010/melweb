import React from 'react';

/**
 * CollegeSection
 * Primary reusable container shell for departmental & internal page sections.
 * Replaces redundant inline section styling across STPHLOS templates.
 * 
 * @param {string} id - Optional HTML id for anchor linking
 * @param {string | React.ReactNode} title - Section heading
 * @param {string} eyebrow - Small uppercase category / tracker above heading
 * @param {string | React.ReactNode} description - Optional section subtitle / description
 * @param {React.ComponentType} icon - Optional heading icon
 * @param {React.ReactNode} badge - Optional badge displayed beside heading
 * @param {React.ReactNode} action - Optional header action (e.g. "View All", link, button)
 * @param {'default' | 'subtle' | 'plain'} variant - Container background style (default: 'default')
 * @param {React.ReactNode} children - Section content
 * @param {string} className - Optional class name override for container
 * @param {string} headerClassName - Optional class name override for header area
 */
export default function CollegeSection({
  id,
  title,
  eyebrow,
  description,
  icon: SectionIcon,
  badge,
  action,
  variant = 'default',
  children,
  className = '',
  headerClassName = ''
}) {
  const containerVariants = {
    default: 'bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs space-y-6',
    subtle: 'bg-slate-50/90 rounded-2xl sm:rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-2xs space-y-6',
    plain: 'space-y-6'
  };

  const hasHeader = title || eyebrow || description || SectionIcon || badge || action;

  return (
    <section 
      id={id}
      className={`${containerVariants[variant] || containerVariants.default} ${className}`}
    >
      {hasHeader && (
        <div className={`space-y-2 border-b border-slate-100 pb-4 ${headerClassName}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="space-y-1">
              {eyebrow && (
                <span className="text-xs font-mono uppercase tracking-wider text-[#1C5496] font-semibold block">
                  {eyebrow}
                </span>
              )}
              {title && (
                <div className="flex items-center gap-2.5">
                  {SectionIcon && (
                    <div 
                      aria-hidden="true"
                      className="w-7 h-7 rounded-lg bg-blue-50 text-[#1C5496] flex items-center justify-center shrink-0"
                    >
                      <SectionIcon className="w-4 h-4" />
                    </div>
                  )}
                  <h2 className="font-heading font-semibold text-xl sm:text-2xl text-slate-900 leading-snug">
                    {title}
                  </h2>
                  {badge && (
                    typeof badge === 'string' ? (
                      <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded ml-2">
                        {badge}
                      </span>
                    ) : (
                      <div className="ml-2">{badge}</div>
                    )
                  )}
                </div>
              )}
            </div>

            {action && (
              <div className="shrink-0">
                {action}
              </div>
            )}
          </div>

          {description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans max-w-3xl pt-1">
              {description}
            </p>
          )}
        </div>
      )}

      {children && (
        <div className="pt-1">
          {children}
        </div>
      )}
    </section>
  );
}
