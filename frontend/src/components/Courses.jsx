import React, { useState, useEffect } from "react";
import Cards from "./Cards";

const Courses = () => {
  const [books, setBooks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/courses');
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.courses);
      } else {
        setError(data.message || 'Failed to fetch courses');
      }
    } catch (err) {
      setError('Network error. Please check if backend server is running.');
      console.error('Fetch courses error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories
  const categories = ["All", ...new Set(books.map(book => book.category))];

  // Filter and sort books
  const filteredBooks = books.filter(book => {
    const matchesCategory = selectedCategory === "All" || book.category === selectedCategory;
    const matchesSearch = book.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         book.instructor.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Sort books based on selection
  const sortedBooks = [...filteredBooks].sort((a, b) => {
    switch (sortBy) {
      case "name":
        return a.name.localeCompare(b.name);
      case "price-low":
        return (a.originalPrice || 0) - (b.originalPrice || 0);
      case "price-high":
        return (b.originalPrice || 0) - (a.originalPrice || 0);
      case "rating":
        return (b.rating?.average || 0) - (a.rating?.average || 0);
      case "students":
        return (b.studentsEnrolled || 0) - (a.studentsEnrolled || 0);
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  });

  // Reset filters
  const resetFilters = () => {
    setSelectedCategory("All");
    setSearchTerm("");
    setSortBy("default");
  };

  if (loading) {
    return (
      <section className="w-full bg-white dark:bg-gray-900 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
        <div className="max-w-7xl mx-auto">
          {/* Skeleton Header */}
          <div className="text-center mb-12">
            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-64 mx-auto mb-4 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-96 mx-auto mb-2 animate-pulse"></div>
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-80 mx-auto animate-pulse"></div>
          </div>

          {/* Skeleton Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-10 bg-gray-200 dark:bg-gray-700 rounded-full w-24 animate-pulse"></div>
            ))}
          </div>

          {/* Skeleton Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div key={n} className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200 dark:bg-gray-700"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  <div className="flex justify-between">
                    <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16"></div>
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="w-full bg-white dark:bg-gray-900 min-h-screen py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            Connection Error
          </h2>
          <p className="text-red-600 dark:text-red-400 text-lg mb-4">{error}</p>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
            Please ensure your backend server is running on http://localhost:5000
          </p>
          <div className="flex gap-3 justify-center">
            <button 
              onClick={fetchCourses}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition duration-300 font-medium"
            >
              Try Again
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 px-6 py-3 rounded-lg transition duration-300 font-medium"
            >
              Refresh Page
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full bg-white dark:bg-gray-900 py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center justify-center mb-4">
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-500 rounded-full mr-2"></div>
            <span className="text-pink-600 font-semibold text-xs sm:text-sm uppercase tracking-wider">
              Online Learning Platform
            </span>
            <div className="w-2 h-2 sm:w-3 sm:h-3 bg-pink-500 rounded-full ml-2"></div>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6 leading-tight">
            Explore Our <span className="text-pink-500">Courses</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4 leading-relaxed">
            Discover {books.length}+ carefully curated courses designed to help you master new skills and advance your career journey.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 sm:p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search courses, instructors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category} {category !== 'All' && `(${books.filter(book => book.category === category).length})`}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Filter */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="default">Sort by: Latest</option>
                <option value="name">Sort by: Name</option>
                <option value="price-low">Sort by: Price: Low to High</option>
                <option value="price-high">Sort by: Price: High to Low</option>
                <option value="rating">Sort by: Highest Rated</option>
                <option value="students">Sort by: Most Popular</option>
              </select>
            </div>
          </div>

          {/* Active Filters Bar */}
          {(selectedCategory !== "All" || searchTerm || sortBy !== "default") && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>Active filters:</span>
                {selectedCategory !== "All" && (
                  <span className="bg-pink-100 dark:bg-pink-900 text-pink-800 dark:text-pink-200 px-2 py-1 rounded-full text-xs">
                    Category: {selectedCategory}
                  </span>
                )}
                {searchTerm && (
                  <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded-full text-xs">
                    Search: "{searchTerm}"
                  </span>
                )}
                {sortBy !== "default" && (
                  <span className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded-full text-xs">
                    Sorted by: {sortBy}
                  </span>
                )}
              </div>
              <button
                onClick={resetFilters}
                className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="text-center sm:text-left">
            <p className="text-gray-600 dark:text-gray-300">
              Showing <span className="font-semibold text-gray-800 dark:text-white">{sortedBooks.length}</span> of{" "}
              <span className="font-semibold text-gray-800 dark:text-white">{books.length}</span> courses
              {selectedCategory !== 'All' && (
                <span> in <span className="font-semibold text-pink-600 dark:text-pink-400">{selectedCategory}</span></span>
              )}
              {searchTerm && (
                <span> matching "<span className="font-semibold text-blue-600 dark:text-blue-400">{searchTerm}</span>"</span>
              )}
            </p>
          </div>
          
          {/* Quick Category Filters */}
          <div className="flex flex-wrap gap-2 justify-center sm:justify-end">
            {categories.slice(1, 5).map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition duration-300 ${
                  selectedCategory === category
                    ? "bg-pink-600 text-white"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {sortedBooks.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {sortedBooks.map((item) => (
              <Cards key={item._id} item={item} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-800 rounded-2xl">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-3">
              No courses found
            </h3>
            <p className="text-gray-600 dark:text-gray-300 max-w-md mx-auto mb-6">
              We couldn't find any courses matching your criteria. Try adjusting your filters or search terms.
            </p>
            <button
              onClick={resetFilters}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-lg transition duration-300 font-medium"
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Load More (Optional - for pagination) */}
        {sortedBooks.length > 0 && sortedBooks.length >= 8 && (
          <div className="text-center mt-12">
            <button className="border-2 border-pink-500 text-pink-500 dark:text-pink-400 hover:bg-pink-500 hover:text-white px-8 py-3 rounded-lg transition duration-300 font-medium">
              Load More Courses
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Courses;