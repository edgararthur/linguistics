import React, { useEffect, useRef } from 'react';
import EventCard from './EventCard';
import gsap from '../../utils/gsapConfig';

const events = [
  {
    title: "Annual Linguistics Conference 2024",
    date: "June 15-17, 2024",
    location: "University of Ghana, Legon",
    description: "Join us for our flagship conference featuring keynote speakers from around the world...",
    registrationUrl: "#"
  },
  {
    title: "Workshop: Language Documentation Methods",
    date: "April 20, 2024",
    location: "Virtual Event",
    description: "Learn about modern techniques and tools for language documentation...",
    registrationUrl: "#"
  },
  {
    title: "Symposium on African Languages",
    date: "May 5, 2024",
    location: "KNUST, Kumasi",
    description: "A one-day symposium focusing on the preservation of African languages...",
    registrationUrl: "#"
  }
];

export default function EventsPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.event-card-wrapper', {
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
  }, []);

  return (
    <div className="py-12 bg-gray-50 min-h-screen">
      <div ref={containerRef} className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 interactive">Events</h1>
          <p className="mt-4 text-xl text-gray-600">
            Join us at our upcoming events and activities
          </p>
        </div>
        
        <div className="space-y-6">
          {events.map((event) => (
            <div key={event.title} className="event-card-wrapper">
              <EventCard {...event} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}