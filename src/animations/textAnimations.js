import { gsap } from './gsapConfig';
import { motionTokens } from './motionTokens';

export const initTextAnimations = (containerRef) => {
  if (!containerRef || !containerRef.current) return;
  if (motionTokens.isReducedMotion()) return;

  const ctx = gsap.context(() => {
    // Placeholder for modular text effects
  }, containerRef);

  return () => ctx.revert();
};
