import React, { useEffect, useRef } from 'react';
import gsap from '../../utils/gsapConfig';
import { Calendar, Users, BookOpen, Award } from 'lucide-react';

const stats = [
  { icon: Users, label: 'Active Members', value: 500, suffix: '+' },
  { icon: BookOpen, label: 'Publications', value: 120, suffix: '+' },
  { icon: Calendar, label: 'Annual Events', value: 15, suffix: '+' },
  { icon: Award, label: 'Years of Excellence', value: 25, suffix: '' },
];

const timelineEvents = [
  { year: '1998', title: 'Foundation', description: 'LAG was established to promote linguistic research in Ghana.' },
  { year: '2005', title: 'First International Conference', description: 'Hosted scholars from over 20 countries.' },
  { year: '2012', title: 'Journal Launch', description: 'Launch of the Ghanaian Journal of Linguistics.' },
  { year: '2023', title: 'Digital Transformation', description: 'Embracing digital tools for linguistic preservation.' },
];

export default function StatsAndTimeline() {
  const statsRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate stats
      gsap.from('.stat-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: statsRef.current,
          start: 'top 85%',
        },
      });

      // Animate numbers
      stats.forEach((_, i) => {
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stats[i].value,
          duration: 2.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 85%',
          },
          onUpdate: () => {
            const el = document.getElementById(`stat-val-${i}`);
            if (el) el.innerText = Math.floor(obj.val) + stats[i].suffix;
          },
        });
      });

      // Animate timeline
      gsap.from('.timeline-item', {
        opacity: 0,
        y: 30,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
        },
      });
      
      gsap.from('.timeline-line', {
        scaleY: 0,
        transformOrigin: 'top',
        duration: 1.5,
        ease: 'power3.inOut',
        scrollTrigger: {
          trigger: timelineRef.current,
          start: 'top 80%',
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Stats Section */}
        <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-32">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="stat-card group bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-yellow-400 transition-all duration-300 hover:shadow-xl interactive relative overflow-hidden"
              aria-label={`${stat.value}${stat.suffix} ${stat.label}`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-100 rounded-bl-full -mr-4 -mt-4 opacity-50 group-hover:bg-yellow-200 transition-colors duration-300" />
              
              <div className="relative z-10">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-white rounded-xl shadow-sm mb-6 group-hover:scale-110 transition-transform duration-300 text-yellow-600">
                  <stat.icon className="w-7 h-7" />
                </div>
                <h3 id={`stat-val-${index}`} className="text-5xl font-bold text-gray-900 mb-2 tracking-tight">0</h3>
                <p className="text-gray-600 font-medium text-lg">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Timeline Section */}
        <div ref={timelineRef} className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 tracking-tight">Our Journey</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tracing the evolution of linguistic scholarship in Ghana through key milestones.
            </p>
          </div>

          <div className="relative">
            {/* Center Line */}
            <div className="timeline-line absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-gray-200 rounded-full" />
            
            <div className="space-y-12 md:space-y-24">
              {timelineEvents.map((event, index) => (
                <div key={index} className={`timeline-item relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  
                  {/* Content Side */}
                  <div className="flex-1 w-full md:w-1/2 pl-8 md:pl-0 md:px-12">
                    <div className={`bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-2xl hover:border-yellow-400 transition-all duration-300 interactive group ${index % 2 === 0 ? 'text-left' : 'text-left md:text-right'}`}>
                      <span className="inline-block px-4 py-1 bg-yellow-100 text-yellow-800 font-bold rounded-full text-sm mb-4 group-hover:bg-yellow-500 group-hover:text-white transition-colors duration-300">
                        {event.year}
                      </span>
                      <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300">{event.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{event.description}</p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className="absolute left-0 md:left-1/2 transform -translate-x-1/2 w-4 h-4 md:w-6 md:h-6 bg-white border-4 border-yellow-500 rounded-full z-10 shadow-md" />
                  
                  {/* Empty Side for spacing */}
                  <div className="hidden md:block flex-1 w-1/2" />
                  
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
