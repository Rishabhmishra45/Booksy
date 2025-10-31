import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const from = location.state?.from?.pathname || '/courses';

  // ✅ Backend URL from env variables - FIXED for Vite
  const API_URL = import.meta.env.PROD 
    ? import.meta.env.VITE_API_URL_PROD 
    : import.meta.env.VITE_API_URL_LOCAL;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        login(data.user, data.token);
        navigate(from, { replace: true });
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(`Network error. Please check if backend server is running on ${API_URL}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
            BOOKSY
          </Link>
          <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 text-sm">
            ← Back to Home
          </Link>
        </div>
      </nav>

      <div className="h-16 md:h-20"></div>

      <section className="w-full bg-white dark:bg-gray-900 min-h-[calc(100vh-4rem)] py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
              Welcome Back
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Sign in to access your courses
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter your password"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-pink-600 hover:bg-pink-700 disabled:bg-pink-400 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 text-sm sm:text-base"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                Don't have an account?{' '}
                <Link to="/signup" className="text-pink-600 hover:text-pink-700 font-semibold">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Login;