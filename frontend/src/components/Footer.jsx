import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 dark:bg-gray-800 text-gray-300 dark:text-gray-400 py-10 px-4 sm:px-6 md:px-28 transition-colors duration-300">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10">
        {/* Logo & Description */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h2 className="text-2xl font-bold text-white dark:text-white mb-4">BOOKSY</h2>
          <p className="text-sm max-w-md dark:text-gray-300">
            Your trusted source to learn something new every day. Explore books, courses, and knowledge all in one place.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white dark:text-white mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-white dark:hover:text-white transition-colors duration-300 dark:text-gray-300">Home</Link></li>
            <li><Link to="/courses" className="hover:text-white dark:hover:text-white transition-colors duration-300 dark:text-gray-300">Courses</Link></li>
            <li><Link to="/contact" className="hover:text-white dark:hover:text-white transition-colors duration-300 dark:text-gray-300">Contact</Link></li>
            <li><Link to="/about" className="hover:text-white dark:hover:text-white transition-colors duration-300 dark:text-gray-300">About</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h3 className="text-lg font-semibold text-white dark:text-white mb-3">Categories</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/courses" className="hover:text-white dark:hover:text-white transition-colors duration-300 dark:text-gray-300">Free Courses</Link></li>
            <li><Link to="/courses" className="hover:text-white dark:hover:text-white transition-colors duration-300 dark:text-gray-300">Technology</Link></li>
            <li><Link to="/courses" className="hover:text-white dark:hover:text-white transition-colors duration-300 dark:text-gray-300">Business</Link></li>
            <li><Link to="/courses" className="hover:text-white dark:hover:text-white transition-colors duration-300 dark:text-gray-300">Science</Link></li>
          </ul>
        </div>

        {/* Newsletter */}
        <div className="sm:col-span-2 lg:col-span-1">
          <h3 className="text-lg font-semibold text-white dark:text-white mb-3">Subscribe</h3>
          <p className="text-sm mb-3 dark:text-gray-300">Get the latest updates and free resources.</p>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 px-3 py-2 text-sm rounded-lg sm:rounded-l-md sm:rounded-r-none bg-gray-800 dark:bg-gray-700 border border-gray-700 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500 text-white placeholder-gray-400 transition-colors duration-300"
            />
            <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 text-sm rounded-lg sm:rounded-r-md sm:rounded-l-none transition duration-300 whitespace-nowrap">
              Subscribe
            </button>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 dark:border-gray-600 mt-8 sm:mt-10 pt-6 text-sm text-center text-gray-500 dark:text-gray-400">
        &copy; {new Date().getFullYear()} BOOKSY. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;