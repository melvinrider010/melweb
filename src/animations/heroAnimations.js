import { gsap, ScrollTrigger } from './gsapConfig';
import { motionTokens } from './motionTokens';

export const initHeroAnimation = (containerRef) => {
  if (!containerRef || !containerRef.current) return;
  if (motionTokens.isReducedMotion()) return;

  const ctx = gsap.context(() => {
    // 1. Hero Intro Sequence
    const tl = gsap.timeline({ defaults: { ease: motionTokens.easeHero } });

    tl.fromTo(
      '.hero-bg-img',
      { opacity: 0, scale: 1.08 },
      { opacity: 1, scale: 1.0, duration: motionTokens.durationHero, ease: 'power2.out' }
    )
    .fromTo(
      '.hero-micro-label',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: motionTokens.easeReveal },
      '-=1.4'
    )
    .fromTo(
      '.hero-title-line',
      { y: 80, opacity: 0 },
      { y: 0, opacity: 1, duration: 1.1, stagger: motionTokens.staggerSmall, ease: motionTokens.easeHero },
      '-=1.0'
    )
    .fromTo(
      '.hero-subtitle',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: motionTokens.easeReveal },
      '-=0.7'
    )
    .fromTo(
      '.hero-description',
      { y: 25, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: motionTokens.easeReveal },
      '-=0.6'
    )
    .fromTo(
      '.hero-buttons',
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: motionTokens.easeReveal },
      '-=0.5'
    )
    .fromTo(
      '.hero-scroll-indicator',
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      '-=0.3'
    );

    // 2. Desktop Hero Parallax
    if (window.innerWidth >= 1024) {
      gsap.to('.hero-bg-img', {
        yPercent: -8,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });
    }
  }, containerRef);

  return () => ctx.revert();
};
