import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, GraduationCap, Building2 } from 'lucide-react';

/**
 * CollegeDepartmentCard
 * Standardized academic department card component.
 * Displays department directory cards with authentic STPHLOS metadata and routing.
 * 
 * @param {Object} department - Department data object
 * @param {string} to - Custom destination override (default: canonical department link)
 * @param {'standard' | 'compact'} variant - Card layout variant (default: 'standard')
 * @param {string} className - Additional CSS classes
 */
export default function CollegeDepartmentCard({
  department = {},
  to,
  variant = 'standard',
  className = ''
}) {
  if (!department || (!department.name && !department.title && !department.id)) return null;

  const {
    id = '',
    name = '',
    title = '',
    slug = '',
    shortName = '',
    stream = '',
    category = '',
    description = '',
    overview = '',
    degrees = [],
    programs = [],
    facultyCount,
    faculty_count,
    image,
    photo_url
  } = department;

  const deptName = title || name || shortName;
  const deptDesc = overview || description;
  const deptStream = stream || category;
  const bannerImage = image || photo_url;
  
  // Resolve count safely without inventing stats
  const count = facultyCount ?? faculty_count;
  const degreeList = degrees.length > 0 ? degrees : programs;

  // Canonical destination
  const cleanSlug = slug || id.replace(/^dept-/, '');
  const destination = to || `/departments/${cleanSlug || id}`;

  // --- VARIANT 1: COMPACT ---
  if (variant === 'compact') {
    return (
      <Link
        to={destination}
        className={`p-4 rounded-2xl bg-white border border-slate-200/80 hover:border-[#1C5496]/60 hover:shadow-sm transition-all group flex items-center justify-between gap-4 ${className}`}
      >
        <div className="flex items-center space-x-3 min-w-0">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1C5496] flex items-center justify-center shrink-0 group-hover:bg-[#1C5496] group-hover:text-white transition-colors">
            <Building2 className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="font-heading font-semibold text-sm sm:text-base text-slate-900 group-hover:text-[#1C5496] transition-colors truncate">
              {deptName}
            </h4>
            {deptStream && (
              <span className="text-[11px] font-mono text-slate-500 uppercase tracking-wider block truncate">
                {deptStream}
              </span>
            )}
          </div>
        </div>
        <div className="text-slate-400 group-hover:text-[#1C5496] group-hover:translate-x-1 transition-all shrink-0">
          <ArrowRight className="w-4 h-4" />
        </div>
      </Link>
    );
  }

  // --- VARIANT 2: STANDARD ---
  return (
    <Link
      to={destination}
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-400/80 transition-all duration-200 flex flex-col justify-between overflow-hidden group ${className}`}
    >
      <div>
        {/* Optional Header Image */}
        {bannerImage && (
          <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
            <img
              src={bannerImage}
              alt={deptName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            {deptStream && (
              <div className="absolute top-3 left-3">
                <span className="bg-[#0B1F4E]/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2.5 py-1 rounded shadow-xs uppercase">
                  {deptStream}
                </span>
              </div>
            )}
          </div>
        )}

        <div className="p-5 sm:p-6 space-y-3">
          {/* Stream tag (if no banner image) */}
          {!bannerImage && deptStream && (
            <div className="flex items-center justify-between gap-2">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-blue-50 text-[#1C5496] border border-blue-100">
                {deptStream}
              </span>
            </div>
          )}

          {/* Department Name */}
          <h3 className="font-heading font-semibold text-base sm:text-card text-slate-900 group-hover:text-[#1C5496] transition-colors leading-snug">
            {deptName}
          </h3>

          {/* Short Description */}
          {deptDesc && (
            <p className="text-xs sm:text-sm text-slate-600 font-sans line-clamp-2 leading-relaxed">
              {deptDesc}
            </p>
          )}

          {/* Degree Continuum Tags */}
          {degreeList && degreeList.length > 0 && (
            <div className="pt-2 flex flex-wrap items-center gap-1.5">
              {degreeList.slice(0, 3).map((deg, idx) => (
                <span
                  key={typeof deg === 'string' ? deg : deg.code || idx}
                  className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                >
                  {typeof deg === 'string' ? deg : deg.code || deg.title}
                </span>
              ))}
              {degreeList.length > 3 && (
                <span className="text-[10px] font-mono text-slate-400">
                  +{degreeList.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Card Footer: Authentic metrics + CTA */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
        <div>
          {typeof count === 'number' && count > 0 ? (
            <span className="inline-flex items-center gap-1.5 text-slate-600 font-mono text-[11px]">
              <Users className="w-3.5 h-3.5 text-[#1C5496]" />
              <span>{count} Faculty</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
              <GraduationCap className="w-3.5 h-3.5 text-[#1C5496]" />
              <span>Academic Dept</span>
            </span>
          )}
        </div>

        <div className="text-[#1C5496] font-bold text-xs inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
          <span>Explore</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>
      </div>
    </Link>
  );
}
