import gsap from './gsapConfig';

export const fadeInUp = (element: string | Element, delay: number = 0) => {
  return gsap.fromTo(
    element,
    { opacity: 0, y: 50 },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      delay: delay,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: element,
        start: 'top 85%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

export const staggerChildren = (parent: string | Element, child: string, delay: number = 0) => {
  return gsap.fromTo(
    gsap.utils.toArray(child),
    { opacity: 0, y: 30 },
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.1,
      delay: delay,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: parent,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    }
  );
};

export const parallaxElement = (element: string | Element, speed: number = 0.5) => {
  return gsap.to(element, {
    y: (i, target) => -ScrollTrigger.maxScroll(window) * (parseFloat(target.dataset.speed) || speed),
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 0
    }
  });
};
