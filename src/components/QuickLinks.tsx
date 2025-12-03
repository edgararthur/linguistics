import React, { useRef, useEffect } from 'react';
import { BookOpen, Users, Calendar, FileText, ArrowRight } from 'lucide-react';
import gsap from '../utils/gsapConfig';

const links = [
  {
    title: 'Publications',
    description: 'Access our research papers, journals, and scholarly articles.',
    icon: BookOpen,
    href: '/publications',
    color: 'bg-blue-50 text-blue-600',
    hoverBorder: 'hover:border-blue-400'
  },
  {
    title: 'Membership',
    description: 'Join our growing community of linguists and researchers.',
    icon: Users,
    href: '/join',
    color: 'bg-green-50 text-green-600',
    hoverBorder: 'hover:border-green-400'
  },
  {
    title: 'Events',
    description: 'Stay updated with our conferences, workshops, and seminars.',
    icon: Calendar,
    href: '/events',
    color: 'bg-purple-50 text-purple-600',
    hoverBorder: 'hover:border-purple-400'
  },
  {
    title: 'Resources',
    description: 'Educational materials, tools, and archives for linguists.',
    icon: FileText,
    href: '/resources',
    color: 'bg-orange-50 text-orange-600',
    hoverBorder: 'hover:border-orange-400'
  }
];

export default function QuickLinks() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.quick-link-card', {
        y: 40,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 85%',
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="py-24 bg-white">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Quick Access</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Explore the key resources and sections of the Association.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {links.map((link) => (
            <a
              key={link.title}
              href={link.href}
              className={`quick-link-card group relative bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl ${link.hoverBorder} transition-all duration-300 flex flex-col h-full interactive overflow-hidden`}
            >
              <div className={`absolute top-0 right-0 w-20 h-20 ${link.color} rounded-bl-full opacity-20 -mr-4 -mt-4 transition-transform duration-500 group-hover:scale-150`} />
              
              <div className={`${link.color} w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <link.icon className="h-7 w-7" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                {link.title}
              </h3>
              
              <p className="text-gray-600 mb-8 flex-grow leading-relaxed">
                {link.description}
              </p>
              
              <div className="flex items-center text-gray-900 font-bold text-sm mt-auto group-hover:translate-x-2 transition-transform duration-300">
                Explore <ArrowRight className="ml-2 w-4 h-4" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
