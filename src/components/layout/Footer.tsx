import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Linkedin, Mail, MapPin, Phone, Send } from 'lucide-react';
import gsap from '../../utils/gsapConfig';

export default function Footer() {
  const footerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.footer-column', {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top 90%',
        }
      });
    }, footerRef);
    return () => ctx.revert();
  }, []);

  return (
    <footer className="bg-gray-900 text-white py-16 relative overflow-hidden" ref={footerRef}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-500 rounded-full mix-blend-overlay filter blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 rounded-full mix-blend-overlay filter blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* About Column */}
          <div className="footer-column">
            <h3 className="text-2xl font-bold mb-6 text-yellow-500">LAG</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Promoting the scientific study of language and fostering linguistic research in Ghana and beyond since 1963.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 interactive">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 interactive">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-yellow-500 hover:text-gray-900 transition-all duration-300 transform hover:-translate-y-1 interactive">
                <Facebook className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-6 text-white">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-gray-400 hover:text-yellow-500 transition-colors interactive flex items-center"><span className="mr-2">›</span>About Us</Link></li>
              <li><Link to="/leadership" className="text-gray-400 hover:text-yellow-500 transition-colors interactive flex items-center"><span className="mr-2">›</span>Leadership</Link></li>
              <li><Link to="/publications" className="text-gray-400 hover:text-yellow-500 transition-colors interactive flex items-center"><span className="mr-2">›</span>Publications</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-yellow-500 transition-colors interactive flex items-center"><span className="mr-2">›</span>Events</Link></li>
              <li><Link to="/join" className="text-gray-400 hover:text-yellow-500 transition-colors interactive flex items-center"><span className="mr-2">›</span>Join Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-6 text-white">Contact Us</h3>
            <ul className="space-y-4">
              <li className="flex items-start space-x-3 text-gray-400">
                <MapPin className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-1" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=Department+of+Linguistics+University+of+Ghana+Legon" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-yellow-500 transition-colors interactive"
                >
                  Department of Linguistics,<br/>University of Ghana, Legon
                </a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <a href="mailto:info@laghana.org" className="hover:text-yellow-500 transition-colors interactive">info@laghana.org</a>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="h-5 w-5 text-yellow-500 flex-shrink-0" />
                <span>+233 20 000 0000</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="footer-column">
            <h3 className="text-lg font-semibold mb-6 text-white">Newsletter</h3>
            <p className="text-gray-400 mb-4 text-sm">Subscribe to receive updates on events and publications.</p>
            <form className="space-y-3" onSubmit={(e) => e.preventDefault()}>
              <div className="relative">
                <input 
                  type="email" 
                  aria-label="Email address"
                  placeholder="Your email address" 
                  className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 px-4 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all interactive"
                />
                <button 
                  type="submit" 
                  aria-label="Subscribe"
                  className="absolute right-2 top-2 bg-yellow-500 text-gray-900 p-1.5 rounded-md hover:bg-yellow-400 transition-colors interactive"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} Linguistics Association of Ghana. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}