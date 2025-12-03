import React, { useState, useEffect } from 'react';
import { BookOpen, Menu, X } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine styles based on scroll state and page location
  const isTransparent = isHomePage && !isScrolled;
  
  const navClasses = `fixed w-full z-50 transition-all duration-300 ${
    isTransparent 
      ? 'bg-transparent' 
      : 'bg-white shadow-lg'
  }`;

  const textClasses = isTransparent
    ? 'text-white hover:text-yellow-400'
    : 'text-gray-700 hover:text-blue-600';

  const logoClasses = isTransparent
    ? 'text-white'
    : 'text-blue-600';
    
  const logoTextClasses = isTransparent
    ? 'text-white'
    : 'text-gray-900';

  const mobileButtonClasses = isTransparent
    ? 'text-white hover:text-yellow-400'
    : 'text-gray-700 hover:text-blue-600';

  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Leadership', href: '/leadership' },
    { name: 'Publications', href: '/publications' },
    { name: 'Collaborate', href: '/collaborate' },
    { name: 'Join', href: '/join' },
  ];

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <BookOpen className={`h-8 w-8 transition-colors duration-300 ${logoClasses}`} />
            <span className={`ml-2 text-xl font-semibold transition-colors duration-300 ${logoTextClasses}`}>LAG</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-300 interactive ${textClasses}`}
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`transition-colors duration-300 interactive ${mobileButtonClasses}`}
              aria-label="Toggle menu"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg absolute w-full">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium interactive"
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
