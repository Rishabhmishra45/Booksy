import React, { useState } from "react";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function Cards({ item }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleEnrollClick = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/courses' } });
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:5000/api/courses/${item._id}/enroll`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert(`🎉 ${data.message}`);
      } else {
        alert(`❌ ${data.message}`);
      }
    } catch (error) {
      alert('❌ Enrollment failed. Please try again.');
    }
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = (e) => {
    setImageError(true);
    e.target.src = "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg";
  };

  // Category colors mapping
  const getCategoryColors = (category) => {
    const colors = {
      'Free': { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', border: 'border-green-200 dark:border-green-700' },
      'Technology': { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', border: 'border-blue-200 dark:border-blue-700' },
      'Science': { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200', border: 'border-purple-200 dark:border-purple-700' },
      'Business': { bg: 'bg-orange-100 dark:bg-orange-900', text: 'text-orange-800 dark:text-orange-200', border: 'border-orange-200 dark:border-orange-700' },
      'Fiction': { bg: 'bg-pink-100 dark:bg-pink-900', text: 'text-pink-800 dark:text-pink-200', border: 'border-pink-200 dark:border-pink-700' },
      'Development': { bg: 'bg-indigo-100 dark:bg-indigo-900', text: 'text-indigo-800 dark:text-indigo-200', border: 'border-indigo-200 dark:border-indigo-700' },
      'Design': { bg: 'bg-rose-100 dark:bg-rose-900', text: 'text-rose-800 dark:text-rose-200', border: 'border-rose-200 dark:border-rose-700' }
    };
    return colors[category] || { bg: 'bg-gray-100 dark:bg-gray-900', text: 'text-gray-800 dark:text-gray-200', border: 'border-gray-200 dark:border-gray-700' };
  };

  const categoryColors = getCategoryColors(item.category);

  // Format number with commas
  const formatNumber = (num) => {
    return num?.toLocaleString() || '0';
  };

  return (
    <div className="group">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-xl dark:shadow-gray-900/20 dark:hover:shadow-gray-900/40 border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
        
        {/* Image Section */}
        <div className="relative overflow-hidden bg-gray-50 dark:bg-gray-700">
          <div className="aspect-w-16 aspect-h-9 h-48 sm:h-44 md:h-40 lg:h-44 xl:h-48">
            {!imageLoaded && !imageError && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-200 dark:bg-gray-600 animate-pulse">
                <div className="w-8 h-8 border-3 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
            <img 
              src={item.image} 
              alt={item.name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={handleImageLoad}
              onError={handleImageError}
              loading="lazy"
            />
          </div>
          
          {/* Category Badge */}
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold ${categoryColors.bg} ${categoryColors.text} ${categoryColors.border} border backdrop-blur-sm`}>
            {item.category}
          </div>

          {/* Free Badge */}
          {item.isFree && (
            <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-green-500 text-white text-xs font-semibold backdrop-blur-sm">
              FREE
            </div>
          )}

          {/* Rating Overlay */}
          {item.rating && item.rating.count > 0 && (
            <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-black/70 text-white px-2 py-1 rounded-full text-xs backdrop-blur-sm">
              <span className="text-yellow-400">★</span>
              <span>{item.rating.average}</span>
              <span className="text-gray-300">({formatNumber(item.rating.count)})</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="flex-1 p-4 sm:p-5 flex flex-col">
          {/* Course Title */}
          <h3 className="font-bold text-gray-800 dark:text-white line-clamp-2 text-sm sm:text-base mb-2 leading-tight group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
            {item.name}
          </h3>

          {/* Course Description */}
          <p className="text-gray-600 dark:text-gray-300 text-xs sm:text-sm line-clamp-2 mb-3 flex-1 leading-relaxed">
            {item.title}
          </p>

          {/* Instructor & Duration */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-3">
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>By {item.instructor}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
              <span>{item.duration}</span>
            </div>
          </div>

          {/* Level Badge */}
          <div className="flex items-center gap-2 mb-4">
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              item.level === 'Beginner' 
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : item.level === 'Intermediate'
                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
            }`}>
              {item.level}
            </span>
            
            {/* Students Count */}
            {item.studentsEnrolled > 0 && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {formatNumber(item.studentsEnrolled)} enrolled
              </span>
            )}
          </div>

          {/* Price & Action Button */}
          <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <span className={`text-lg font-bold ${
                item.isFree 
                  ? 'text-green-600 dark:text-green-400' 
                  : 'text-pink-600 dark:text-pink-400'
              }`}>
                {item.price}
              </span>
              {!item.isFree && item.originalPrice > 0 && (
                <span className="text-gray-500 dark:text-gray-400 text-sm line-through">
                  ${item.originalPrice}
                </span>
              )}
            </div>

            <button 
              onClick={handleEnrollClick}
              className={`px-3 sm:px-4 py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-300 transform hover:scale-105 active:scale-95 ${
                item.isFree 
                  ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-green-500/25' 
                  : 'bg-linear-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-pink-500/25'
              }`}
            >
              {item.isFree ? 'Enroll Free' : 'Enroll Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cards;