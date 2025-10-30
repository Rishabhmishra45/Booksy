import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { DarkModeProvider } from './context/DarkModeContext';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import Navbar from './components/Navbar';
import Banner from './components/Banner';
import Footer from './components/Footer';
import About from './components/About';
import Contact from './components/Contact';
import FreeBook from './components/FreeBook';
import Courses from './components/Courses';
import Login from './components/Login';
import Signup from './components/Signup';

const Home = () => (
  <>
    <Banner />
    <FreeBook />
  </>
);

// Main Layout Component
const Layout = ({ children }) => {
  const location = useLocation();
  const hideFooter = location.pathname === '/login' || location.pathname === '/signup';

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {children}
      </main>

      {!hideFooter && <Footer />}
    </div>
  );
};

const App = () => {
  return (
    <DarkModeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />

            {/* Protected Routes - Login Required */}
            <Route
              path="/courses"
              element={
                <Layout>
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                </Layout>
              }
            />
          </Routes>
        </Router>
      </AuthProvider>
    </DarkModeProvider>
  );
};

export default App;