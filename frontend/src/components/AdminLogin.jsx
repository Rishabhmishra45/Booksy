import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

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
      const response = await fetch('http://localhost:5000/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('adminToken', data.token);
        localStorage.setItem('adminUser', JSON.stringify(data.user));
        navigate('/admin/dashboard');
      } else {
        setError(data.message || 'Admin login failed');
      }
    } catch (err) {
      setError('Network error. Please check if backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Navbar for admin login */}
      <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800 z-50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold text-gray-800 dark:text-white">
            BOOKSY <span className="text-pink-500">Admin</span>
          </div>
          <button 
            onClick={() => navigate('/')}
            className="text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors duration-300 text-sm"
          >
            ← Back to Site
          </button>
        </div>
      </nav>

      <div className="h-16 md:h-20"></div>

      {/* Admin Login Content */}
      <section className="w-full bg-linear-to-br from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 min-h-[calc(100vh-4rem)] py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 flex items-center justify-center">
        <div className="max-w-md w-full mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-pink-100 dark:bg-pink-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">👑</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-white mb-3">
              Admin Portal
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              Access the course management dashboard
            </p>
          </div>

          {/* Login Form */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
            {error && (
              <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="admin@booksy.com"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Admin Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm sm:text-base placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Enter admin password"
                />
              </div>

              {/* Demo Credentials */}
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                <p className="text-blue-700 dark:text-blue-300 text-xs sm:text-sm">
                  <strong>Demo Credentials:</strong><br />
                  Email: admin@booksy.com<br />
                  Password: admin1234567
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 disabled:from-pink-400 disabled:to-purple-500 text-white font-semibold py-3 px-6 rounded-lg transition duration-300 text-sm sm:text-base shadow-lg hover:shadow-pink-500/25"
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
                  'Access Admin Panel'
                )}
              </button>
            </form>

            {/* Security Notice */}
            <div className="mt-6 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-700 dark:text-yellow-300 text-xs text-center">
                ⚠️ Restricted access. Authorized personnel only.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default AdminLogin;