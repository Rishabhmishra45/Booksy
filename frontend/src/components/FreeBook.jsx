import React, { useEffect, useState } from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Cards from "./Cards";

function Freebook() {
  const [book, setBook] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFreeBooks();
  }, []);

  const fetchFreeBooks = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/courses?category=Free');
      
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
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    cssEase: "ease-in-out",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          initialSlide: 2
        }
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };

  return (
    <div className="mt-5 w-full bg-linear-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 py-12 md:py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12 md:mb-16">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-500 rounded-full mr-2"></div>
            <span className="text-pink-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Free Courses from Database
            </span>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-500 rounded-full ml-2"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6 leading-tight">
            Free <span className="text-pink-500">Offered Courses</span>
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
            Start your learning journey with our high-quality free courses from our database. 
            Learn from industry experts and build practical skills that employers value.
          </p>
        </div>

        {/* Slider Container */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 md:p-8 lg:p-10 mb-6 md:mb-8">
          <div className="slider-container">
            {loading ? (
              <div className="text-center py-8 md:py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-600 mx-auto mb-4"></div>
                <p className="text-gray-500 dark:text-gray-400">Loading free courses...</p>
              </div>
            ) : book.length > 0 ? (
              <Slider {...settings}>
                {book.map((item) => (
                  <div key={item._id} className="px-2 sm:px-3">
                    <div className="transform hover:scale-[1.02] transition-transform duration-300">
                      <Cards item={item} />
                    </div>
                  </div>
                ))}
              </Slider>
            ) : (
              <div className="text-center py-8 md:py-12">
                <div className="text-gray-400 dark:text-gray-500 text-4xl sm:text-6xl mb-4">📚</div>
                <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg">No free courses available at the moment.</p>
              </div>
            )}
          </div>
        </div>

        {/* Stats Section */}
        <div className="text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-xl sm:text-2xl font-bold text-pink-600 mb-1">{book.length}+</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Free Courses</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-xl sm:text-2xl font-bold text-pink-600 mb-1">100%</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Free Access</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-xl sm:text-2xl font-bold text-pink-600 mb-1">24/7</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Available</div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="text-xl sm:text-2xl font-bold text-pink-600 mb-1">Lifetime</div>
              <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">Access</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Freebook;