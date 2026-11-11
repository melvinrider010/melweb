/**
 * Centralized STPHLOS Design Tokens & Style Constants
 * Aligned with St. Philomena's College brand identity and Metronic structural patterns.
 */

export const COLLEGE_COLORS = {
  navy: '#0B1F4E',       // Primary institutional navy
  royalBlue: '#1C5496',  // Accent / link royal blue
  gold: '#C9A84C',       // Accent / honor gold
  canvas: '#FAF9F6',     // Page canvas background
};

export const COLLEGE_CONTAINERS = {
  // Primary section shell replacing repetitive inline container declarations
  sectionShell: 'bg-white rounded-2xl sm:rounded-3xl border border-slate-200/90 p-6 sm:p-10 shadow-xs',
  // Standard card container
  cardBase: 'bg-white rounded-2xl border border-slate-200/80 shadow-xs transition-all',
  // Elevated card container with hover lift
  cardHover: 'bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-blue-300 transition-all',
  // Subtle surface container
  surfaceSubtle: 'bg-slate-50/80 rounded-2xl border border-slate-200/80 p-5 sm:p-6',
};

export const COLLEGE_TYPOGRAPHY = {
  pageTitle: 'font-heading font-bold text-2xl sm:text-3xl text-slate-900 tracking-tight leading-tight',
  sectionTitle: 'font-heading font-semibold text-xl sm:text-2xl text-slate-900 leading-snug',
  cardTitle: 'font-heading font-semibold text-base sm:text-card text-slate-900 leading-snug',
  body: 'font-sans font-normal text-base text-slate-700 leading-relaxed',
  eyebrow: 'text-xs font-mono uppercase tracking-wider text-[#1C5496] font-semibold',
  meta: 'text-xs text-slate-500 font-sans',
  button: 'text-sm font-semibold tracking-wide',
  tableHeader: 'text-xs font-mono uppercase tracking-wider text-slate-600 font-semibold',
  tableCell: 'text-sm text-slate-700 leading-relaxed font-sans'
};
