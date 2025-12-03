import React from 'react';
import Carousel from '../Carousel'
import QuickLinks from '../QuickLinks';
import AboutSection from './AboutSection';
import NewsSection from './NewsSection';
import StatsAndTimeline from './StatsAndTimeline';

export default function HomePage() {
  return (
    <>
      <Carousel />
      <StatsAndTimeline />
      <AboutSection />
      <QuickLinks />
      <NewsSection />
    </>
  );
}