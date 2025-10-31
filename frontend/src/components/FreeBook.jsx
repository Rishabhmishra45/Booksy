import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../../src/slider-styles.css";
import Slider from "react-slick";
import Cards from "./Cards";

function Freebook() {
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Get API URL based on environment - FIXED for Vite
  const API_URL = import.meta.env.PROD
    ? import.meta.env.VITE_API_URL_PROD
    : import.meta.env.VITE_API_URL_LOCAL;

  useEffect(() => {
    fetchFreeBooks();
  }, []);

  const fetchFreeBooks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/courses?category=Free`);

      if (!response.ok) {
        throw new Error('Failed to fetch free courses');
      }

      const data = await response.json();

      if (data.success) {
        setBook(data.courses);
      }
    } catch (error) {
      console.error('Error fetching free courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const settings = {
    dots: true,
    infinite: book.length > 3,
    speed: 800,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    cssEase: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
    beforeChange: (current, next) => setCurrentSlide(next),
    appendDots: dots => (
      <div className="mt-8">
        <ul className="flex justify-center space-x-2">{dots}</ul>
      </div>
    ),
    customPaging: i => (
      <div className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentSlide ? 'bg-pink-500 w-6' : 'bg-gray-300'
        }`}></div>
    ),
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          dots: true
        }
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true
        }
      }
    ]
  };

  // Custom arrow components
  const NextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <button
        className={`${className} hidden md:flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-10 before:hidden`}
        style={{ ...style, right: '-50px' }}
        onClick={onClick}
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );
  };

  const PrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
      <button
        className={`${className} hidden md:flex items-center justify-center w-10 h-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-300 z-10 before:hidden`}
        style={{ ...style, left: '-50px' }}
        onClick={onClick}
      >
        <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );
  };

  // Enhanced settings with custom arrows
  const enhancedSettings = {
    ...settings,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />
  };

  return (
    <div className="mt-8 w-full bg-linear-to-br from-gray-50 via-white to-blue-50/30 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/10 py-16 md:py-20 lg:py-24 relative overflow-visible">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Enhanced Header Section */}
        <div className="text-center mb-16 md:mb-20">
          <div className="inline-flex items-center justify-center px-4 py-2 bg-pink-50 dark:bg-pink-900/20 rounded-full border border-pink-100 dark:border-pink-800 mb-6">
            <div className="w-2 h-2 bg-pink-500 rounded-full mr-2 animate-pulse"></div>
            <span className="text-pink-600 dark:text-pink-400 font-semibold text-sm uppercase tracking-wider">
              Free Courses Collection
            </span>
            <div className="w-2 h-2 bg-pink-500 rounded-full ml-2 animate-pulse"></div>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Free <span className="text-transparent bg-clip-text bg-linear-to-r from-pink-500 to-purple-600">Premium Courses</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Kickstart your learning journey with our carefully curated free courses from our database.
            Gain industry-relevant skills and practical knowledge that sets you apart.
          </p>

          {/* Live Stats */}
          <div className="flex items-center justify-center space-x-6 mt-8">
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>Live from Database</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{book.length} Courses Available</span>
            </div>
          </div>
        </div>

        {/* Enhanced Slider Container */}
        <div className="relative mb-12 md:mb-16">
          <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/20 p-6 md:p-8 lg:p-10">
            {loading ? (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-lg">Loading premium free courses...</p>
              </div>
            ) : book.length > 0 ? (
              <div className="relative">
                <Slider {...enhancedSettings}>
                  {book.map((item, index) => (
                    <div key={item._id} className="px-3 lg:px-4 pb-2 pt-2">
                      <div className="transform hover:scale-[1.03] transition-all duration-500 ease-out hover:z-20 relative">
                        <div className="absolute -inset-2 bg-linear-to-r from-pink-500 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-20 blur transition-all duration-300"></div>
                        <Cards item={item} />
                      </div>
                    </div>
                  ))}
                </Slider>

                {/* Slide Counter */}
                <div className="flex justify-center items-center space-x-4 mt-8">
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {currentSlide + 1} / {book.length}
                  </span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => document.querySelector('.slick-prev')?.click()}
                      className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      ←
                    </button>
                    <button
                      onClick={() => document.querySelector('.slick-next')?.click()}
                      className="w-8 h-8 flex items-center justify-center bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors"
                    >
                      →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 dark:bg-gray-700 rounded-3xl mb-6">
                  <span className="text-3xl text-gray-400">📚</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-300 mb-2">
                  No Free Courses Available
                </h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  We're currently updating our free courses collection. Check back soon for new additions!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Stats Section */}
        <div className="text-center">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
            {[
              { value: `${book.length}+`, label: 'Free Courses', icon: '📚' },
              { value: '100%', label: 'Free Access', icon: '🎯' },
              { value: '24/7', label: 'Available', icon: '⏰' },
              { value: 'Lifetime', label: 'Access', icon: '∞' }
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/20 dark:border-gray-700/20 hover:shadow-xl hover:scale-105 transition-all duration-300 group"
              >
                <div className="text-2xl mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-2xl md:text-3xl font-bold bg-linear-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-12 md:mt-16">
          <p className="text-gray-500 dark:text-gray-400 text-sm mb-4">
            Ready to start learning?
          </p>
          <button className="bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            Explore All Courses
          </button>
        </div>
      </div>
    </div>
  );
}

export default Freebook;