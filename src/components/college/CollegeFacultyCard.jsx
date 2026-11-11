import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, GraduationCap, ArrowRight, BookOpen } from 'lucide-react';
import FacultyAvatar from '../common/FacultyAvatar';

/**
 * CollegeFacultyCard
 * Unified institutional faculty card component.
 * Standardizes faculty presentation across Faculty Directory, Department Pages, and Course Continuum.
 * 
 * @param {Object} faculty - Faculty data object
 * @param {'grid' | 'horizontal' | 'compact'} layout - Display layout (default: 'grid')
 * @param {boolean} showEmail - Whether to display email address if available (default: true)
 * @param {boolean} showLink - Whether to render profile link if valid identifier exists (default: true)
 * @param {string} className - Additional CSS classes
 */
export default function CollegeFacultyCard({
  faculty = {},
  layout = 'grid',
  showEmail = true,
  showLink = true,
  className = ''
}) {
  if (!faculty || (!faculty.name && !faculty.id)) return null;

  const {
    name = '',
    designation = '',
    qualification = '',
    department = '',
    deptName = '',
    email = '',
    slug = '',
    id = '',
    photo_url,
    photoUrl,
    image,
    specialization = '',
    experience = ''
  } = faculty;

  const photo = photo_url || photoUrl || image;
  const deptDisplayName = deptName || department;
  const profileId = slug || id;
  const profileUrl = profileId ? `/faculty/${profileId}` : null;
  const canLink = showLink && Boolean(profileUrl);

  // --- LAYOUT 1: COMPACT (Optimized for Department Detail Faculty Grids) ---
  if (layout === 'compact') {
    const cardContent = (
      <div 
        className={`bg-slate-50/90 rounded-2xl border border-slate-200/80 p-5 space-y-3 transition-all duration-200 flex flex-col items-center text-center ${
          canLink ? 'hover:bg-white hover:border-[#1C5496]/50 hover:shadow-sm group cursor-pointer' : ''
        } ${className}`}
      >
        <FacultyAvatar
          src={photo}
          name={name}
          alt={name}
          className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-xs group-hover:ring-2 group-hover:ring-[#1C5496]/20 transition-all"
          fallbackSize="text-base"
        />

        <div className="space-y-1 w-full">
          <h4 className="font-heading font-semibold text-sm sm:text-base text-slate-900 group-hover:text-[#1C5496] transition-colors line-clamp-1">
            {name}
          </h4>
          {designation && (
            <p className="text-xs text-slate-600 font-sans line-clamp-1">
              {designation}
            </p>
          )}
          {qualification && (
            <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-50 text-amber-800 border border-amber-200/60 max-w-full truncate">
              {qualification}
            </span>
          )}
        </div>

        {canLink && (
          <div className="pt-2 text-xs font-semibold text-[#1C5496] group-hover:underline inline-flex items-center gap-1">
            <span>View Profile</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </div>
        )}
      </div>
    );

    return canLink ? (
      <Link to={profileUrl} className="block no-underline">
        {cardContent}
      </Link>
    ) : cardContent;
  }

  // --- LAYOUT 2: HORIZONTAL (Optimized for lists & continuum strips) ---
  if (layout === 'horizontal') {
    const cardContent = (
      <div 
        className={`bg-white rounded-2xl border border-slate-200/80 p-4 sm:p-5 flex items-center justify-between gap-4 transition-all duration-200 ${
          canLink ? 'hover:border-[#1C5496]/50 hover:shadow-sm group cursor-pointer' : ''
        } ${className}`}
      >
        <div className="flex items-center space-x-3.5 sm:space-x-4 min-w-0">
          <FacultyAvatar
            src={photo}
            name={name}
            alt={name}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl object-cover border border-slate-200 shrink-0"
            fallbackSize="text-sm"
          />
          <div className="min-w-0">
            <h4 className="font-heading font-semibold text-sm sm:text-base text-slate-900 group-hover:text-[#1C5496] transition-colors truncate">
              {name}
            </h4>
            {designation && (
              <p className="text-xs text-slate-600 font-sans truncate">
                {designation}
              </p>
            )}
            <div className="flex flex-wrap items-center gap-1.5 mt-1">
              {qualification && (
                <span className="text-[10px] font-mono font-semibold px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded truncate">
                  {qualification}
                </span>
              )}
              {deptDisplayName && (
                <span className="text-[10px] font-mono text-slate-400 truncate">
                  • {deptDisplayName}
                </span>
              )}
            </div>
          </div>
        </div>

        {canLink && (
          <div className="shrink-0 text-slate-400 group-hover:text-[#1C5496] transition-colors p-1">
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    );

    return canLink ? (
      <Link to={profileUrl} className="block no-underline">
        {cardContent}
      </Link>
    ) : cardContent;
  }

  // --- LAYOUT 3: GRID (Standard Rich Faculty Card for Faculty Directory) ---
  const cardContent = (
    <div 
      className={`bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between transition-all duration-200 ${
        canLink ? 'hover:shadow-md hover:border-blue-400/80 group cursor-pointer' : ''
      } ${className}`}
    >
      <div>
        {/* Top Image / Avatar container */}
        <div className="relative aspect-[4/3] w-full bg-gradient-to-b from-slate-100 to-slate-200 overflow-hidden flex items-center justify-center">
          <FacultyAvatar
            src={photo}
            name={name}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackSize="text-3xl"
          />
          
          {/* Department badge overlay */}
          {deptDisplayName && (
            <div className="absolute top-2.5 left-2.5">
              <span className="bg-[#0B1F4E]/90 backdrop-blur-xs text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded shadow-xs max-w-[180px] truncate block">
                {deptDisplayName}
              </span>
            </div>
          )}

          {/* Qualification badge overlay */}
          {qualification && (
            <div className="absolute bottom-2.5 right-2.5">
              <span className="bg-white/95 backdrop-blur-xs text-slate-800 text-[10px] font-mono font-semibold px-2 py-0.5 rounded shadow-xs border border-slate-200/70 max-w-[140px] truncate block">
                {qualification}
              </span>
            </div>
          )}
        </div>

        {/* Content Details */}
        <div className="p-4 sm:p-5 space-y-2">
          <h3 className="font-heading font-semibold text-base sm:text-card text-slate-900 group-hover:text-[#1C5496] transition-colors line-clamp-1">
            {name}
          </h3>

          {designation && (
            <p className="text-xs text-slate-600 font-sans font-medium line-clamp-1">
              {designation}
            </p>
          )}

          {specialization && (
            <div className="pt-1 flex items-start gap-1 text-[11px] text-slate-500 font-sans line-clamp-2">
              <BookOpen className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
              <span>{specialization}</span>
            </div>
          )}

          {experience && (
            <p className="text-[11px] font-mono text-slate-400">
              Exp: {experience}
            </p>
          )}
        </div>
      </div>

      {/* Card Footer Actions */}
      <div className="px-4 sm:px-5 py-3 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-xs">
        {showEmail && email ? (
          <a
            href={`mailto:${email}`}
            onClick={(e) => e.stopPropagation()}
            className="text-slate-500 hover:text-[#1C5496] inline-flex items-center gap-1.5 transition-colors max-w-[170px] truncate"
            title={email}
          >
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{email}</span>
          </a>
        ) : (
          <span className="text-slate-400 font-mono text-[11px]">Faculty Member</span>
        )}

        {canLink && (
          <div className="text-[#1C5496] font-semibold text-xs inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform shrink-0 ml-2">
            <span>Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        )}
      </div>
    </div>
  );

  return canLink ? (
    <Link to={profileUrl} className="block no-underline">
      {cardContent}
    </Link>
  ) : cardContent;
}
