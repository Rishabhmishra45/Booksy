import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { LuSun } from "react-icons/lu";
import { LuMoon } from "react-icons/lu";
import { useDarkMode } from '../context/DarkModeContext';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { isDarkMode, toggleDarkMode } = useDarkMode();
    const toggleMenu = () => setIsOpen(!isOpen);

    return (
        <>
            <nav className="fixed top-0 left-0 w-full bg-white dark:bg-gray-900 shadow-lg dark:shadow-gray-800 z-50 transition-colors duration-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    {/* Logo */}
                    <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white transition-colors duration-300">
                        BOOKSY
                    </Link>

                    {/* Desktop Nav Links */}
                    <div className="hidden md:flex space-x-8 text-gray-700 dark:text-gray-300 font-medium transition-colors duration-300">
                        <Link to="/" className="hover:text-black dark:hover:text-white transition-colors duration-300">Home</Link>
                        <Link to="/about" className="hover:text-black dark:hover:text-white transition-colors duration-300">About</Link>
                        <Link to="/courses" className="hover:text-black dark:hover:text-white transition-colors duration-300">Courses</Link>
                        <Link to="/contact" className="hover:text-black dark:hover:text-white transition-colors duration-300">Contact</Link>
                    </div>

                    {/* Right Side */}
                    <div className="hidden md:flex items-center space-x-6">
                        {/* Search Box */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search"
                                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-gray-300 dark:focus:ring-gray-500 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white w-40 transition-colors duration-300"
                            />
                            <svg
                                className="absolute right-3 top-2.5 h-4 w-4 text-gray-400 dark:text-gray-500 transition-colors duration-300"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 18a7 7 0 100-14 7 7 0 000 14z" />
                            </svg>
                        </div>

                        {/* Dark Mode Toggle */}
                        <button 
                            onClick={toggleDarkMode}
                            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
                            aria-label="Toggle dark mode"
                        >
                            {isDarkMode ? (
                                // Sun icon for light mode
                                <LuSun className='h-6 w-6 text-yellow-500 transition-colors duration-300'/>
                            ) : (
                                // Moon icon for dark mode
                                <LuMoon className='h-6 w-6 text-gray-700 transition-colors duration-300' />
                            )}
                        </button>

                        {/* Login Button */}
                        <button className="bg-black dark:bg-white text-white dark:text-black px-4 py-2 rounded-md hover:bg-gray-900 dark:hover:bg-gray-200 text-sm transition-colors duration-300">
                            Login
                        </button>
                    </div>

                    {/* Hamburger Menu */}
                    <div className="md:hidden">
                        <button onClick={toggleMenu} className="text-gray-800 dark:text-white transition-colors duration-300">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Sidebar */}
            <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-xl transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-all duration-300 z-50 md:hidden`}>
                <div className="p-6 flex flex-col space-y-6">
                    <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-300">Menu</span>
                        <button onClick={toggleMenu} className="text-2xl text-gray-800 dark:text-white transition-colors duration-300">&times;</button>
                    </div>
                    
                    <Link to="/" onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-2 transition-colors duration-300">Home</Link>
                    <Link to="/about" onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-2 transition-colors duration-300">About</Link>
                    <Link to="/courses" onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-2 transition-colors duration-300">Courses</Link>
                    <Link to="/contact" onClick={toggleMenu} className="text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-2 transition-colors duration-300">Contact</Link>
                    
                    {/* Dark Mode Toggle for Mobile */}
                    <button 
                        onClick={() => {
                            toggleDarkMode();
                            toggleMenu();
                        }}
                        className="flex items-center space-x-3 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white py-2 transition-colors duration-300"
                    >
                        {isDarkMode ? (
                            <>
                                <LuSun className='h-6 w-6 text-yellow-500 transition-colors duration-300'/>
                                <span>Light Mode</span>
                            </>
                        ) : (
                            <>
                                <LuMoon className='h-6 w-6 text-gray-700 transition-colors duration-300'/>
                                <span>Dark Mode</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Backdrop */}
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden" onClick={toggleMenu}></div>
            )}

            {/* Spacer below fixed navbar */}
            <div className="h-16 md:h-20"></div>
        </>
    );
};

export default Navbar;