// src/components/Banner.jsx
import React from "react";
import image from '../assets/image.png';

const Banner = () => {
    return (
        <section className="w-full bg-white dark:bg-gray-900 py-8 md:py-12 px-4 sm:px-5 lg:px-20 flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Left Content */}
            <div className="md:w-1/2 w-full px-2 sm:px-4 md:px-7 order-2 md:order-1">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white leading-tight">
                    Hello, welcome to your learning journey where you{" "}
                    <span className="text-pink-500 font-semibold">grow every day!!!</span>
                </h1>

                <p className="mt-4 sm:mt-6 text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    Discover a world of knowledge with our comprehensive learning platform.
                    Whether you're starting a new career or enhancing your skills, we provide
                    the tools and resources you need to succeed in today's competitive world.
                </p>

                {/* Email input and button */}
                <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <input
                        type="email"
                        placeholder="Enter your email to get started"
                        className="w-full sm:flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm sm:text-base bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    />
                    <button className="w-full sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-3 rounded-lg shadow-md transition duration-300">
                        Get Started
                    </button>
                </div>

                {/* Subheading */}
                <div className="mt-6 sm:mt-8 md:mt-10">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-2 sm:mb-3">
                        Premium Courses Available for Free
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                        Access high-quality courses across various domains including web development,
                        data science, digital marketing, and more. Learn from industry experts and
                        build practical skills that employers value.
                    </p>
                </div>
            </div>

            {/* Right Image */}
            <div className="md:w-1/2 w-full flex justify-center order-1">
                <img
                    src={image}
                    alt="Learning and Education Platform"
                    className="w-full max-w-md md:max-w-lg lg:max-w-xl h-auto object-contain"
                />
            </div>
        </section>
    );
};

export default Banner;