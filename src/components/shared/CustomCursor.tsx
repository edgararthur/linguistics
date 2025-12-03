import React, { useEffect, useRef } from 'react';
import gsap from '../../utils/gsapConfig';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const followerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const follower = followerRef.current;
    
    if (!cursor || !follower) return;

    const moveCursor = (e: MouseEvent) => {
      gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.1,
        ease: 'power2.out'
      });
      gsap.to(follower, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.5,
        ease: 'power2.out'
      });
    };

    window.addEventListener('mousemove', moveCursor);

    const handleHover = () => {
      gsap.to(cursor, { scale: 0.5 });
      gsap.to(follower, { scale: 1.5, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderColor: 'transparent' });
    };

    const handleUnhover = () => {
      gsap.to(cursor, { scale: 1 });
      gsap.to(follower, { scale: 1, backgroundColor: 'transparent', borderColor: '#eab308' });
    };

    const links = document.querySelectorAll('a, button, .interactive');
    links.forEach(link => {
      link.addEventListener('mouseenter', handleHover);
      link.addEventListener('mouseleave', handleUnhover);
    });

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      links.forEach(link => {
        link.removeEventListener('mouseenter', handleHover);
        link.removeEventListener('mouseleave', handleUnhover);
      });
    };
  }, []);

  return (
    <>
      <div 
        ref={cursorRef} 
        className="fixed top-0 left-0 w-3 h-3 bg-yellow-500 rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 mix-blend-difference"
      />
      <div 
        ref={followerRef} 
        className="fixed top-0 left-0 w-10 h-10 border-2 border-yellow-500 rounded-full pointer-events-none z-50 transform -translate-x-1/2 -translate-y-1/2 transition-colors duration-300"
      />
    </>
  );
}
