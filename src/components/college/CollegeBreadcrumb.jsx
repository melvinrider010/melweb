import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

/**
 * CollegeBreadcrumb
 * Accessible, semantic breadcrumb navigation matching Metronic UI patterns
 * and St. Philomena's institutional styling.
 * 
 * @param {Array<{ label: string, href?: string, icon?: React.ComponentType }>} items
 * @param {boolean} showHome - Whether to display home icon at the start (default: true)
 * @param {string} homeHref - Home link destination (default: '/')
 * @param {string} className - Optional class name override
 */
export default function CollegeBreadcrumb({
  items = [],
  showHome = true,
  homeHref = '/',
  className = ''
}) {
  if (!items || items.length === 0) return null;

  return (
    <nav aria-label="breadcrumb" className={`py-1.5 ${className}`}>
      <ol className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs font-sans text-slate-500">
        {showHome && (
          <li className="inline-flex items-center">
            <Link
              to={homeHref}
              className="inline-flex items-center text-slate-400 hover:text-[#1C5496] transition-colors p-0.5 rounded focus:outline-none focus:ring-1 focus:ring-[#1C5496]"
              title="Return to Home"
              aria-label="Home"
            >
              <Home className="w-3.5 h-3.5" />
            </Link>
          </li>
        )}

        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const ItemIcon = item.icon;

          return (
            <React.Fragment key={item.href || index}>
              {(showHome || index > 0) && (
                <li
                  role="presentation"
                  aria-hidden="true"
                  className="text-slate-300 flex items-center shrink-0 select-none"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </li>
              )}

              <li className="inline-flex items-center min-w-0 max-w-[220px] sm:max-w-xs md:max-w-md">
                {isLast || !item.href ? (
                  <span
                    aria-current="page"
                    className="font-semibold text-slate-800 truncate"
                    title={item.label}
                  >
                    {ItemIcon && <ItemIcon className="w-3.5 h-3.5 inline mr-1 text-[#1C5496]" />}
                    {item.label}
                  </span>
                ) : (
                  <Link
                    to={item.href}
                    className="text-slate-500 hover:text-[#1C5496] transition-colors truncate focus:outline-none focus:ring-1 focus:ring-[#1C5496] rounded px-0.5"
                    title={item.label}
                  >
                    {ItemIcon && <ItemIcon className="w-3.5 h-3.5 inline mr-1 text-slate-400" />}
                    {item.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
