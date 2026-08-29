import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initImageReveals = (containerRef) => {
  if (!containerRef || !containerRef.current) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = gsap.context(() => {
    const imageContainers = containerRef.current.querySelectorAll('.image-reveal-wrapper');

    imageContainers.forEach((wrapper) => {
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
        { clipPath: 'inset(8% 8% 8% 8%)', opacity: 0.2 },
        { clipPath: 'inset(0% 0% 0% 0%)', opacity: 1, duration: 1.2, ease: 'power3.out' }
      ).fromTo(
        img,
        { scale: 1.1 },
        { scale: 1.0, duration: 1.4, ease: 'power3.out' },
        '-=1.2'
      );
    });
  }, containerRef);

  return () => ctx.revert();
};
