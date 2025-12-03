import React, { useEffect, useRef } from 'react';
import NewsCard from './NewsCard';
import gsap from '../../utils/gsapConfig';

const newsItems = [
  {
    title: 'Annual Conference 2024',
    description: 'Join us for our annual conference focusing on linguistic diversity in West Africa. Call for papers is now open.',
    date: 'Aug 15, 2024',
    category: 'Event'
  },
  {
    title: 'New Research Publication',
    description: 'Latest research on Ghanaian language documentation now available in the LAG Journal. Featuring work from top scholars.',
    date: 'Jul 28, 2024',
    category: 'Research'
  },
  {
    title: 'Workshop Series: Computational Linguistics',
    description: 'Monthly workshops on computational linguistics starting next month. Learn Python for text analysis.',
    date: 'Sep 01, 2024',
    category: 'Workshop'
  }
];

export default function NewsSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.news-card', {
        y: 60,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <section className="py-24 bg-gray-50">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-bold text-gray-900 mb-4 tracking-tight">Latest Updates</h2>
            <p className="text-xl text-gray-600">Stay informed about our latest activities and research.</p>
          </div>
          <button className="hidden md:flex items-center text-yellow-600 font-bold hover:text-yellow-700 transition-colors interactive">
            View All News <span className="ml-2">→</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <div key={index} className="news-card interactive h-full">
              <NewsCard {...item} />
            </div>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <button className="bg-white border border-gray-200 text-gray-900 px-8 py-3 rounded-full font-bold hover:bg-gray-50 transition-colors interactive w-full">
            View All News
          </button>
        </div>
      </div>
    </section>
  );
}
