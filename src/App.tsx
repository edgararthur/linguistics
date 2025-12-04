import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import HomePage from './components/home/HomePage';
import AboutPage from './components/about/AboutPage';
import LeadershipPage from './components/leadership/LeadershipPage';
import PublicationsPage from './components/publications/PublicationsPage';
import CollaboratePage from './components/collaborate/CollaboratePage';
import JoinPage from './components/join/JoinPage';
import MemberRegistrationForm from './components/join/MemberRegistrationForm';
import EventsPage from './components/events/EventsPage';
import MembershipPage from './components/membership/MembershipPage';
import PayDuesPage from './components/membership/PayDuesPage';
import ContactPage from './components/contact/ContactPage';

// Admin Imports
import AdminLayout from './admin/AdminLayout';
import Login from './admin/pages/Login';
import Dashboard from './admin/pages/Dashboard';
import Members from './admin/pages/Members';
import Leadership from './admin/pages/Leadership';
import Publications from './admin/pages/Publications';
import Events from './admin/pages/Events';
import Finance from './admin/pages/Finance';
import Communication from './admin/pages/Communication';
import Settings from './admin/pages/Settings';
import ProtectedRoute from './components/shared/ProtectedRoute';
import { ToastProvider } from './contexts/ToastContext';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Website Routes */}
            <Route element={<Layout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/leadership" element={<LeadershipPage />} />
              <Route path="/publications" element={<PublicationsPage />} />
              <Route path="/collaborate" element={<CollaboratePage />} />
              <Route path="/join" element={<JoinPage />} />
              <Route path="/register" element={<MemberRegistrationForm />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/membership" element={<MembershipPage />} />
              <Route path="/pay-dues" element={<PayDuesPage />} />
              <Route path="/contact" element={<ContactPage />} />
            </Route>

            {/* Admin Routes */}
            <Route path="/admin/login" element={<Login />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="members" element={<Members />} />
              <Route path="leadership" element={<Leadership />} />
              <Route path="publications" element={<Publications />} />
              <Route path="events" element={<Events />} />
              <Route path="finance" element={<Finance />} />
              <Route path="communication" element={<Communication />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;