import React from "react";

function Cards({ item }) {
  const handleImageError = (e) => {
    // Fallback image agar original image load nahi hoti
    e.target.src = "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg";
    e.target.alt = "Book Image";
  };

  return (
    <div className="my-3">
      <div className="card w-full bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl dark:hover:shadow-gray-700 hover:scale-105 duration-200 border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden transition-all">
        <figure className="h-48 sm:h-56 md:h-52 lg:h-48 xl:h-52 overflow-hidden bg-gray-50 dark:bg-gray-700">
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            onError={handleImageError}
            loading="lazy"
          />
        </figure>
        
        <div className="card-body p-4 sm:p-5 md:p-6 bg-white dark:bg-gray-800">
          <div className="flex items-start justify-between mb-3">
            <h2 className="card-title text-base sm:text-lg font-bold text-gray-800 dark:text-white flex-1 pr-2 line-clamp-2">
              {item.name}
            </h2>
            <div className={`badge ${item.category === 'Free' ? 'badge-success text-white bg-green-500' : item.category === 'Fiction' ? 'badge-info text-white bg-blue-500' : item.category === 'Technology' ? 'badge-warning text-white bg-orange-500' : item.category === 'Science' ? 'badge-primary text-white bg-purple-500' : 'badge-secondary text-white bg-pink-500'} text-xs px-2 py-1 font-semibold whitespace-nowrap ml-2`}>
              {item.category}
            </div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed line-clamp-2">
            {item.title}
          </p>
          
          <div className="card-actions justify-between items-center mt-2">
            <div className={`text-lg font-bold ${item.category === 'Free' ? 'text-green-600 dark:text-green-400' : 'text-pink-600 dark:text-pink-400'}`}>
              {item.price}
            </div>
            <button className={`px-3 py-2 sm:px-4 sm:py-2 rounded-full border-2 font-medium text-xs sm:text-sm transition duration-200 whitespace-nowrap ${
              item.category === 'Free' 
                ? 'border-green-500 text-green-500 dark:border-green-400 dark:text-green-400 hover:bg-green-500 dark:hover:bg-green-400 hover:text-white dark:hover:text-white' 
                : 'border-pink-500 text-pink-500 dark:border-pink-400 dark:text-pink-400 hover:bg-pink-500 dark:hover:bg-pink-400 hover:text-white dark:hover:text-white'
            }`}>
              {item.category === 'Free' ? 'Enroll Now' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cards;