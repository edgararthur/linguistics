import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';

type NewsCardProps = {
  title: string;
  description: string;
  date?: string;
  category?: string;
};

export default function NewsCard({ title, description, date = 'Coming Soon', category = 'News' }: NewsCardProps) {
  return (
    <div className="group bg-white rounded-2xl p-8 shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded-full group-hover:bg-yellow-100 group-hover:text-yellow-800 transition-colors duration-300">
          {category}
        </span>
        <div className="flex items-center text-gray-400 text-sm">
          <Calendar className="w-4 h-4 mr-2" />
          <span>{date}</span>
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-yellow-600 transition-colors duration-300">
        {title}
      </h3>
      
      <p className="text-gray-600 mb-6 flex-grow leading-relaxed">
        {description}
      </p>
      
      <div className="flex items-center text-yellow-600 font-bold text-sm group-hover:translate-x-2 transition-transform duration-300">
        Read Article <ArrowRight className="ml-2 w-4 h-4" />
      </div>
    </div>
  );
}
