import React from 'react';
import NewsCard from './NewsCard';

const newsItems = [
  {
    title: 'Annual Conference 2024',
    description: 'Join us for our annual conference focusing on linguistic diversity in West Africa.'
  },
  {
    title: 'New Research Publication',
    description: 'Latest research on Ghanaian language documentation now available.'
  },
  {
    title: 'Workshop Series',
    description: 'Monthly workshops on computational linguistics starting next month.'
  }
];

export default function NewsSection() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold text-gray-700 mb-8 text-center">Latest News</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsItems.map((item, index) => (
            <NewsCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
