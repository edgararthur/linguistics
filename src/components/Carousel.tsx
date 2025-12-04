import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import gsap from '../utils/gsapConfig';
import videoBg from '../assets/18346428-hd_1920_1080_30fps.mp4';
import image2 from '../assets/LAG_2023.jpg';
import ugImage from '../assets/ug_campus.png';
import knustImage from '../assets/knust_campus.png';
import uccImage from '../assets/ucc_campus.png';

const slides = [
  {
    type: 'video',
    source: videoBg,
    title: 'Advancing Linguistic Research',
    description: 'Join us in exploring the diverse languages of Ghana'
  },
  {
    type: 'image',
    source: ugImage,
    title: 'University of Ghana, Legon',
    description: 'Premier center for linguistic studies and research excellence.'
  },
  {
    type: 'image',
    source: knustImage,
    title: 'KNUST',
    description: 'Bridging technology and linguistics for modern applications.'
  },
  {
    type: 'image',
    source: uccImage,
    title: 'University of Cape Coast',
    description: 'Leading the way in language education and teacher training.'
  },
  {
    type: 'image',
    source: image2,
    title: '15th LAG Conference 2023',
    description: 'Rethinking Language and Linguistics Research for Sustainable Development in the 21st Century'
  },
];

export default function Carousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 8000); // Longer duration for video
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
          className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
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
              className="w-full h-full object-cover transform scale-105 animate-slow-zoom"
            />
          )}
          <div className="absolute inset-0 bg-black bg-opacity-50" />
          <div
            ref={(el) => (textRefs.current[index] = el)}
            className="absolute inset-0 flex flex-col items-center justify-center text-white px-4 text-center"
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight leading-tight max-w-4xl">
              {slide.title}
            </h2>
            <p className="text-xl md:text-3xl max-w-2xl font-light">
              {slide.description}
            </p>
            <button className="mt-8 px-8 py-3 bg-yellow-500 text-black font-bold rounded-full hover:bg-yellow-400 transition-all transform hover:scale-105 interactive">
              Learn More
            </button>
          </div>
        </div>
      ))}

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-4 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 interactive ${index === currentSlide ? 'bg-yellow-500 w-8' : 'bg-white/50 hover:bg-white'
              }`}
          />
        ))}
      </div>

      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all z-20 interactive group"
      >
        <ChevronLeft className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 backdrop-blur-md p-3 rounded-full hover:bg-white/20 transition-all z-20 interactive group"
      >
        <ChevronRight className="h-8 w-8 text-white group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
