import { gsap, ScrollTrigger } from './gsapConfig';
import { motionTokens } from './motionTokens';

export const initImageAnimations = (containerRef) => {
  if (!containerRef || !containerRef.current) return;
  if (motionTokens.isReducedMotion()) return;

  const ctx = gsap.context(() => {
    // 1. Clip-Path Inset Image Reveals
    const wrappers = containerRef.current.querySelectorAll('.image-reveal-wrapper');
    wrappers.forEach((wrapper) => {
      const img = wrapper.querySelector('img');
      if (!img) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: 'top 85%',
          toggleActions: 'play none none none'
        }
      });

      tl.fromTo(
        wrapper,
        { clipPath: 'inset(10% 10% 10% 10%)', opacity: 0.8 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: motionTokens.durationSlow, ease: motionTokens.easeReveal }
      ).fromTo(
        img,
        { scale: 1.08 },
        { scale: 1.0, duration: 1.4, ease: motionTokens.easeReveal },
        '-=1.2'
      );
    });

    // 2. Subtle Image Parallax (Max 1-2 per page)
    const parallaxImgs = containerRef.current.querySelectorAll('.parallax-img');
    if (window.innerWidth >= 1024) {
      parallaxImgs.forEach((pImg) => {
        gsap.to(pImg, {
          yPercent: 8,
          ease: 'none',
          scrollTrigger: {
            trigger: pImg.parentElement || pImg,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true
          }
        });
      });
    }
  }, containerRef);

  return () => ctx.revert();
};
