import { gsap, ScrollTrigger } from './gsapConfig';
import { motionTokens } from './motionTokens';

export const initScrollAnimations = (containerRef) => {
  if (!containerRef || !containerRef.current) return;
  if (motionTokens.isReducedMotion()) return;

  const ctx = gsap.context(() => {
    // 1. Viewport Section Group Reveals
    const sections = containerRef.current.querySelectorAll('.reveal-on-scroll');
    sections.forEach((sec) => {
      gsap.fromTo(
        sec,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: motionTokens.durationNormal,
          ease: motionTokens.easeReveal,
          scrollTrigger: {
            trigger: sec,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 2. Section Heading Text Mask Reveals
    const textMasks = containerRef.current.querySelectorAll('.text-mask-reveal');
    textMasks.forEach((heading) => {
      gsap.fromTo(
        heading,
        { y: 100, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.0,
          ease: motionTokens.easeHero,
          scrollTrigger: {
            trigger: heading,
            start: 'top 88%',
            toggleActions: 'play none none none'
          }
        }
      );
    });

    // 3. Status Strip Stagger Reveal
    const statusItems = containerRef.current.querySelectorAll('.status-strip-item');
    if (statusItems.length > 0) {
      gsap.fromTo(
        statusItems,
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: motionTokens.staggerSmall,
          ease: motionTokens.easeReveal,
          scrollTrigger: {
            trigger: statusItems[0].parentElement,
            start: 'top 90%',
            toggleActions: 'play none none none'
          }
        }
      );
    }

    // 4. Statistics Counter Count-up
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
