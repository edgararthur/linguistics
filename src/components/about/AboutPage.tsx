import React, { useEffect, useRef } from 'react';
import Mission from './Mission';
import Values from './Values';
import History from './History';
import Vision from './Vision';
import gsap from '../../utils/gsapConfig';

export default function AboutPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.about-section', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.3,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="py-12 bg-gray-50">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 about-section">
          <h1 className="text-5xl font-bold text-gray-900 mb-4 interactive">About Us</h1>
          <p className="mt-4 text-xl text-gray-600">
            Advancing linguistic research and preservation in Ghana
          </p>
        </div>
        
        <div className="about-section"><Mission /></div>
        <div className="about-section"><Vision /></div>
        <div className="about-section"><Values /></div>
        <div className="about-section"><History /></div>
      </div>
    </div>
  );
}
