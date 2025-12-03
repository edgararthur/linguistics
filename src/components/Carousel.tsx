import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from '../utils/gsapConfig';
import videoBg from '../assets/18346428-hd_1920_1080_30fps.mp4';

// High-quality Unsplash images optimized for web
const slides = [
  {
    type: 'video',
    source: videoBg,
    title: 'Advancing Linguistic Research',
    description: 'Join us in exploring the diverse languages of Ghana'
  },
  {
    type: 'image',
    source: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1920&q=80',
    title: '15th LAG Conference 2023',
    description: 'Rethinking Language and Linguistics Research for Sustainable Development in the 21st Century'
  },
  {
    type: 'image',
    source: 'https://images.unsplash.com/photo-1523805009345-7448845a9e53?auto=format&fit=crop&w=1920&q=80',
    title: 'Preserving Cultural Heritage',
    description: 'Documenting and analyzing the rich linguistic tapestry of Ghanaian traditions.'
  },
  {
    type: 'image',
    source: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1920&q=80',
    title: 'Empowering Future Linguists',
    description: 'Supporting students and researchers in their academic journey.'
  },
  {
    type: 'image',
    source: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=1920&q=80',
    title: 'Publications & Research',
    description: 'Discover our latest linguistic publications and scholarly works.'
  },
  {
    type: 'image',
    source: 'https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1920&q=80',
    title: 'Community Engagement',
    description: 'Bridging the gap between academic research and local communities.'
  },
  {
    type: 'image',
    source: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=1920&q=80',
    title: 'Linguistic Insights',
    description: 'Explore groundbreaking research that shapes the future of linguistics.'
  }
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // 5-second interval as requested
    return () => clearInterval(timer);
  }, [currentSlide]);

  useEffect(() => {
    // Animate text entrance
    const textContainer = textRefs.current[currentSlide];
    if (textContainer) {
      gsap.fromTo(
        textContainer.children,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.2, ease: 'power3.out' }
      );
    }
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      {slides.map((slide, index) => (
        <div
          key={index}
          ref={(el) => (slideRefs.current[index] = el)}
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {slide.type === 'video' ? (
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={slide.source} type="video/mp4" />
            </video>
          ) : (
            <img
              src={slide.source}
              alt={slide.title}
              loading={index === 0 ? "eager" : "lazy"}
              className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
            />
          )}
          <div className="absolute inset-0 bg-black/50" /> {/* Updated to Tailwind opacity syntax */}
          <div 
            ref={(el) => (textRefs.current[index] = el)}
            className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight max-w-4xl">
              {slide.title}
            </h2>
            <p className="text-xl md:text-3xl max-w-2xl font-light mb-8">
              {slide.description}
            </p>
            <button className="px-8 py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-all transform hover:scale-105 interactive focus:ring-4 focus:ring-yellow-300 focus:outline-none">
              Learn More
            </button>
          </div>
        </div>
      ))}
      
      {/* Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
            className={`h-3 rounded-full transition-all duration-300 interactive focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
              index === currentSlide ? 'bg-yellow-500 w-8' : 'bg-white/50 w-3 hover:bg-white'
            }`}
          />
        ))}
      </div>

      {/* Previous Button */}
      <button
        onClick={prevSlide}
        aria-label="Previous slide"
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all z-20 interactive group focus:outline-none focus:ring-2 focus:ring-white"
      >
        <ChevronLeft className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
      </button>

      {/* Next Button */}
      <button
        onClick={nextSlide}
        aria-label="Next slide"
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all z-20 interactive group focus:outline-none focus:ring-2 focus:ring-white"
      >
        <ChevronRight className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
