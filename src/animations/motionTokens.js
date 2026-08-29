// Standardized Motion Tokens for St. Philomena's College Website
export const motionTokens = {
  durationMicro: 0.3,
  durationFast: 0.5,
  durationNormal: 0.8,
  durationSlow: 1.2,
  durationHero: 1.8,
  easeStandard: 'power2.out',
  easeReveal: 'power3.out',
  easeHero: 'power4.out',
  staggerSmall: 0.08,
  staggerMedium: 0.15,
  isReducedMotion: () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
};
