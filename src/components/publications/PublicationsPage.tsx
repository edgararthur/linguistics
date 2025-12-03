import React, { useState, useEffect, useRef } from 'react';
import PublicationCard from './PublicationCard';
import gsap from '../../utils/gsapConfig';

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
      gsap.from('.pub-card-wrapper', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%',
        },
      });
    });
    return () => ctx.revert();
  }, [filteredPublications]); // Re-animate on search filter change (optional, maybe too jarring)

  // Actually, better to animate only on mount, or use Flip plugin for reordering (which I don't have).
  // Let's just animate on mount for now.

  useEffect(() => {
    const ctx = gsap.context(() => {
        gsap.from('.page-title', { y: -50, opacity: 0, duration: 1 });
        gsap.from('.search-bar', { scale: 0.9, opacity: 0, duration: 0.8, delay: 0.3 });
    });
    return () => ctx.revert();
  }, []);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 page-title">
          <h1 className="text-5xl font-bold text-gray-900 interactive">Publications</h1>
          <p className="mt-4 text-xl text-gray-600">
            Explore our research publications and scholarly works
          </p>
        </div>

        <div className="mb-8 max-w-2xl mx-auto search-bar">
          <input
            type="text"
            placeholder="Search publications..."
            className="w-full px-6 py-4 rounded-full border-2 border-gray-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent shadow-lg transition-shadow focus:shadow-xl interactive text-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="space-y-6">
          {filteredPublications.map((pub) => (
            <div key={pub.title} className="pub-card-wrapper">
                <PublicationCard {...pub} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}