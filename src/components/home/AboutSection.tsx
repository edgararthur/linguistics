import React, { useEffect, useRef } from 'react';
import { fadeInUp } from '../../utils/animations';
import gsap from '../../utils/gsapConfig';

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const elements = sectionRef.current?.children;
      if (elements) {
        Array.from(elements).forEach((el, index) => {
          fadeInUp(el, index * 0.2);
        });
      }
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden relative">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-30">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-100 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"></div>
      </div>

      <div ref={sectionRef} className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <span className="inline-block py-1 px-3 rounded-full bg-yellow-100 text-yellow-800 text-sm font-bold mb-6 uppercase tracking-wider">
          Who We Are
        </span>
        
        <h2 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight text-gray-900 mb-8 interactive">
          Welcome to the Linguistics Association of Ghana
        </h2>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-10">
          We are a vibrant community dedicated to advancing the study and research of linguistics in Ghana. 
          We foster collaboration among scholars, promote the preservation of our rich linguistic heritage, 
          and drive conversations that shape the future of language in society.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="px-8 py-4 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-all transform hover:scale-105 interactive shadow-lg hover:shadow-yellow-500/30">
            Read Our Mission
          </button>
          <button className="px-8 py-4 bg-white text-gray-900 border-2 border-gray-200 font-bold rounded-full hover:border-yellow-500 hover:text-yellow-600 transition-all interactive">
            Meet Our Team
          </button>
        </div>
      </div>
    </section>
  );
}
