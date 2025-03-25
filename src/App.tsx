import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import LeadershipPage from './components/leadership/LeadershipPage';
import PublicationsPage from './components/publications/PublicationsPage';
import CollaboratePage from './components/collaborate/CollaboratePage';
import JoinPage from './components/join/JoinPage';
import EventsPage from './components/events/EventsPage';
import MembershipPage from './components/membership/MembershipPage';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/leadership" element={<LeadershipPage />} />
          <Route path="/publications" element={<PublicationsPage />} />
          <Route path="/collaborate" element={<CollaboratePage />} />
          <Route path="/join" element={<JoinPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/membership" element={<MembershipPage />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;