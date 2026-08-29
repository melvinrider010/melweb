import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initScrollReveals = (containerRef) => {
  if (!containerRef || !containerRef.current) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = gsap.context(() => {
    const elements = containerRef.current.querySelectorAll('.reveal-on-scroll');

    elements.forEach((el) => {
      gsap.fromTo(
        el,
        { y: 40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });
  }, containerRef);

  return () => ctx.revert();
};
