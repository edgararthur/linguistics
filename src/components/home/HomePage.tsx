import React from 'react';
import Carousel from '../Carousel'
import QuickLinks from '../QuickLinks';
import AboutSection from './AboutSection';
import NewsSection from './NewsSection';

export default function HomePage() {
  return (
    <>
      <Carousel />
      <AboutSection />
      <QuickLinks />
      <NewsSection />
    </>
  );
}