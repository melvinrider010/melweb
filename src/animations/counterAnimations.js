import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const initCounterAnimations = (containerRef) => {
  if (!containerRef || !containerRef.current) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const ctx = gsap.context(() => {
    const counters = containerRef.current.querySelectorAll('.counter-value');

    counters.forEach((counter) => {
      const targetVal = parseInt(counter.getAttribute('data-target') || '0', 10);
      if (!targetVal) return;

      const obj = { val: 0 };

      gsap.to(obj, {
        val: targetVal,
        duration: 1.8,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: counter,
          start: 'top 90%',
          toggleActions: 'play none none none'
        },
        onUpdate: () => {
          counter.innerText = Math.floor(obj.val).toString();
        }
      });
    });
  }, containerRef);

  return () => ctx.revert();
};
