import React, { useState, useEffect, useRef } from 'react';
import PublicationCard from './PublicationCard';
import gsap from '../../utils/gsapConfig';
import { Search, BookOpen } from 'lucide-react';

const publications = [
  {
    title: "Tone Systems in Ghanaian Languages: A Comparative Analysis",
    authors: "Dr. Kwame Mensah, Dr. Abena Osei",
    abstract: "This study examines the tonal patterns across major Ghanaian languages...",
    downloadUrl: "#",
    date: "March 2024"
  },
  {
    title: "Language Contact in Urban Ghana",
    authors: "Dr. Yaw Addo, Prof. Sarah Johnson",
    abstract: "An investigation into language mixing and code-switching in urban areas...",
    downloadUrl: "#",
    date: "February 2024"
  },
  {
    title: "Documentation of Endangered Ghanaian Languages",
    authors: "Prof. Emmanuel Kotey",
    abstract: "A comprehensive documentation project focusing on three endangered languages...",
    downloadUrl: "#",
    date: "January 2024"
  }
];

export default function PublicationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredPublications = publications.filter(pub => 
    pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pub.authors.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });

      gsap.from('.search-bar', { 
        y: 20, 
        opacity: 0, 
        duration: 0.8, 
        delay: 0.4 
      });
      
      gsap.from('.pub-card-wrapper', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.publications-list',
          start: 'top 80%',
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen" ref={containerRef}>
      {/* Hero Section */}
      <div className="bg-blue-900 text-white py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pattern-grid-lg"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center hero-content">
            <div className="inline-flex items-center justify-center p-3 bg-blue-800 rounded-xl mb-6">
              <BookOpen className="w-8 h-8 text-yellow-400" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Research & <span className="text-yellow-400">Publications</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Explore our collection of linguistic research, scholarly works, and academic papers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        <div className="mb-12 max-w-2xl mx-auto search-bar relative">
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Search className="w-6 h-6" />
          </div>
          <input
            type="text"
            placeholder="Search by title or author..."
            className="w-full pl-16 pr-6 py-4 rounded-2xl border-2 border-gray-200 focus:ring-4 focus:ring-blue-100 focus:border-blue-500 shadow-sm transition-all text-lg outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-6 publications-list">
          {filteredPublications.length > 0 ? (
            filteredPublications.map((pub) => (
              <div key={pub.title} className="pub-card-wrapper">
                <PublicationCard {...pub} />
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p className="text-xl">No publications found matching your search.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
