import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Handshake, Building, GraduationCap, Globe, ArrowRight } from 'lucide-react';
import gsap from '../../utils/gsapConfig';

const collaborationTypes = [
  {
    icon: Building,
    title: "Institutional Partnerships",
    description: "Partner with us for joint research projects, student exchanges, and academic collaborations.",
    link: "/contact"
  },
  {
    icon: GraduationCap,
    title: "Research Collaboration",
    description: "Join our research initiatives in language documentation, sociolinguistics, and more.",
    link: "/contact"
  },
  {
    icon: Globe,
    title: "Community Projects",
    description: "Participate in our community-based language preservation and education programs.",
    link: "/contact"
  }
];

export default function CollaboratePage() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-content', {
        y: 30,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out'
      });

      gsap.from('.collab-card', {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: '.collab-grid',
          start: 'top 80%',
        },
      });

      gsap.from('.cta-section', {
        scale: 0.95,
        opacity: 0,
        duration: 0.8,
        scrollTrigger: {
          trigger: '.cta-section',
          start: 'top 85%',
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Collaborate <span className="text-yellow-400">With Us</span>
            </h1>
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Join us in advancing linguistic research and preservation through meaningful partnerships.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 collab-grid">
          {collaborationTypes.map((type) => (
            <div key={type.title} className="collab-card group">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 h-full hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 flex flex-col">
                <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors duration-300">
                  <type.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{type.title}</h3>
                <p className="text-gray-600 mb-8 flex-grow leading-relaxed">{type.description}</p>
                <Link 
                  to={type.link}
                  className="inline-flex items-center font-bold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="cta-section">
          <div className="bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/3"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/3 translate-y-1/3"></div>
            
            <div className="relative z-10 p-12 text-center">
              <div className="inline-block p-4 bg-yellow-100 rounded-full mb-6">
                <Handshake className="h-10 w-10 text-yellow-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Start a Collaboration
              </h2>
              <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                Interested in collaborating with us? Fill out our collaboration inquiry
                form, and we'll get back to you to discuss potential opportunities.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-blue-500/30"
              >
                Contact Us Now
              </Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
