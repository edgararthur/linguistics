import React, { useState, useEffect, useRef } from 'react';
import { Search, Calendar as CalendarIcon, MapPin } from 'lucide-react';
import EventCard from './EventCard';
import gsap from '../../utils/gsapConfig';

const events = [
  {
    title: "Annual Linguistics Conference 2024",
    date: "June 15-17, 2024",
    location: "University of Ghana, Legon",
    description: "Join us for our flagship conference featuring keynote speakers from around the world. Topics include sociolinguistics, phonology, and language preservation.",
    registrationUrl: "#"
  },
  {
    title: "Workshop: Language Documentation Methods",
    date: "April 20, 2024",
    location: "Virtual Event",
    description: "Learn about modern techniques and tools for language documentation, including digital archiving and community engagement strategies.",
    registrationUrl: "#"
  },
  {
    title: "Symposium on African Languages",
    date: "May 5, 2024",
    location: "KNUST, Kumasi",
    description: "A one-day symposium focusing on the preservation of African languages in the digital age. Includes panel discussions and networking sessions.",
    registrationUrl: "#"
  }
];

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredEvents = events.filter(event => 
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Animate header elements
      gsap.from('.page-header', {
        y: -30,
        opacity: 0,
        duration: 1,
        ease: 'power3.out'
      });

      gsap.from('.search-container', {
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: 'back.out(1.7)'
      });

      // Animate cards
      gsap.from('.event-card-wrapper', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.events-grid',
          start: 'top 80%',
        },
      });
    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-blue-900 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-800 opacity-50 pattern-grid-lg"></div>
        {/* Decorative circles */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 -translate-x-1/2 -translate-y-1/2 animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/2 translate-y-1/2 animate-blob animation-delay-2000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center page-header">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 interactive">
            Upcoming Events
          </h1>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto leading-relaxed">
            Join the Linguistics Association of Ghana at our conferences, workshops, and seminars. Connect with fellow linguists and researchers.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        {/* Search Bar */}
        <div className="bg-white p-6 rounded-2xl shadow-xl mb-12 search-container max-w-3xl mx-auto border border-gray-100">
          <div className="relative">
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              aria-label="Search events"
              placeholder="Search events by title or location..."
              className="w-full pl-14 pr-6 py-4 rounded-xl border-2 border-gray-100 focus:border-yellow-500 focus:ring-4 focus:ring-yellow-100 transition-all outline-none text-lg text-gray-700 placeholder-gray-400 interactive"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Events Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20 events-grid">
            {filteredEvents.map((event, index) => (
              <div key={index} className="event-card-wrapper h-full">
                <EventCard {...event} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any events matching "{searchTerm}". Try adjusting your search terms.
            </p>
            <button 
              onClick={() => setSearchTerm('')}
              className="mt-6 text-yellow-600 font-semibold hover:text-yellow-700 interactive"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
