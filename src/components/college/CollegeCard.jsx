import React from 'react';
import { Link } from 'react-router-dom';

/**
 * CollegeCard
 * Generic reusable institutional card component inspired by Metronic card architecture
 * and tailored for St. Philomena's College.
 * 
 * @param {string | React.ReactNode} title - Card heading
 * @param {string | React.ReactNode} subtitle - Card subtitle
 * @param {string | React.ReactNode} description - Body text / summary
 * @param {React.ComponentType} icon - Card icon
 * @param {string} image - Card header image URL
 * @param {React.ReactNode} badge - Status or category badge
 * @param {React.ReactNode} footer - Card footer element
 * @param {string} to - React Router Link destination
 * @param {string} href - External URL destination
 * @param {function} onClick - Click handler
 * @param {'default' | 'bordered' | 'flat' | 'hover'} variant - Visual style (default: 'default')
 * @param {React.ReactNode} children - Custom card children
 * @param {string} className - Additional CSS classes
 */
export default function CollegeCard({
  title,
  subtitle,
  description,
  icon: CardIcon,
  image,
  badge,
  footer,
  to,
  href,
  onClick,
  variant = 'default',
  children,
  className = ''
}) {
  const variantStyles = {
    default: 'bg-white rounded-2xl border border-slate-200/80 shadow-xs',
    bordered: 'bg-white rounded-2xl border-2 border-slate-200/90 shadow-2xs',
    flat: 'bg-slate-50/80 rounded-2xl border border-slate-200/70',
    hover: 'bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400/80 transition-all duration-200'
  };

  const isInteractive = Boolean(to || href || onClick);
  const baseClasses = `flex flex-col justify-between overflow-hidden transition-all ${
    isInteractive ? (variant === 'hover' ? variantStyles.hover : `${variantStyles[variant] || variantStyles.default} hover:border-[#1C5496]/50 hover:shadow-sm cursor-pointer group`) : (variantStyles[variant] || variantStyles.default)
  } ${className}`;

  const cardInner = (
    <>
      {/* Optional Top Image */}
      {image && (
        <div className="relative aspect-video sm:aspect-[16/9] w-full overflow-hidden bg-slate-100 shrink-0">
          <img
            src={image}
            alt={typeof title === 'string' ? title : 'Card preview'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {badge && (
            <div className="absolute top-3 right-3">
              {badge}
            </div>
          )}
        </div>
      )}

      {/* Main Body */}
      <div className="p-5 sm:p-6 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Header Row (Badges / Icons) */}
          {(!image && badge) || CardIcon || subtitle ? (
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                {CardIcon && (
                  <div 
                    aria-hidden="true"
                    className="w-8 h-8 rounded-lg bg-blue-50 text-[#1C5496] flex items-center justify-center shrink-0"
                  >
                    <CardIcon className="w-4 h-4" />
                  </div>
                )}
                {subtitle && (
                  <span className="text-[11px] font-mono font-semibold uppercase tracking-wider text-slate-500">
                    {subtitle}
                  </span>
                )}
              </div>
              {!image && badge && (
                <div>{badge}</div>
              )}
            </div>
          ) : null}

          {/* Title */}
          {title && (
            <h3 className="font-heading font-semibold text-base sm:text-card text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
              {title}
            </h3>
          )}

          {/* Description */}
          {description && (
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans mt-2">
              {description}
            </p>
          )}

          {/* Custom Children */}
          {children && (
            <div className="mt-3">
              {children}
            </div>
          )}
        </div>

        {/* Footer */}
        {footer && (
          <div className="pt-3 border-t border-slate-100 mt-4 text-xs">
            {footer}
          </div>
        )}
      </div>
    </>
  );

  if (to) {
    return (
      <Link to={to} className={baseClasses}>
        {cardInner}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={baseClasses}>
        {cardInner}
      </a>
    );
  }

  if (onClick) {
    return (
      <div role="button" tabIndex={0} onClick={onClick} onKeyDown={(e) => e.key === 'Enter' && onClick(e)} className={baseClasses}>
        {cardInner}
      </div>
    );
  }

  return (
    <div className={baseClasses}>
      {cardInner}
    </div>
  );
}
