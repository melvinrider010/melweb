import { gsap } from './gsapConfig';
import { motionTokens } from './motionTokens';

export const animatePageIn = (containerRef) => {
  if (!containerRef || !containerRef.current) return;
  if (motionTokens.isReducedMotion()) return;

  gsap.fromTo(
    containerRef.current,
    { opacity: 0, y: 15 },
    { opacity: 1, y: 0, duration: 0.4, ease: motionTokens.easeStandard }
  );
};
