import React from "react";
import rishabh from '../assets/rishabh.webp';

const About = () => {
    const teamMembers = [
        {
            name: "Rishabh Mishra",
            role: "Founder & CEO",
            bio: "Education enthusiast with 10+ years in EdTech",
            image: rishabh,
            isImage: true
        },
        {
            name: "Rohit Sharma",
            role: "Head of Curriculum",
            bio: "Former university professor and course designer",
            image: "https://documents.iplt20.com/ipl/IPLHeadshot2025/6.png",
            isImage: true
        },
        {
            name: "Bill Gates",
            role: "Student Success Manager",
            bio: "Dedicated to helping learners achieve their goals",
            image: "https://encrypted-tbn1.gstatic.com/licensed-image?q=tbn:ANd9GcTP4YR-X41aVqDYAGjW_Hs8GCzCLx4V6AKDixONcG61_u2pooyOcyqiOnmDFgfY_5xII2YBj7S0JwTZpFC9zVu1CESz0rhBdAB1Yn5NvCfmCuEucOUvl6QH044as8wKH35w1rUVFqbM3XhI",
            isImage: true
        },
        {
            name: "Richard Socher",
            role: "Tech Lead",
            bio: "Full-stack developer and learning platform expert",
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ536XdBTn7GZ-dd1qpEBntxGLDiI4HonBy4uFIQ8zcXsECUU9Se5x4RmPU3ta9jj6CStY&usqp=CAU",
            isImage: true
        }
    ];

    const stats = [
        { number: "50,000+", label: "Students Enrolled" },
        { number: "200+", label: "Expert Instructors" },
        { number: "500+", label: "Courses Available" },
        { number: "95%", label: "Satisfaction Rate" }
    ];

    return (
        <section className="w-full bg-white dark:bg-gray-900 py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Hero Section */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">
                        About <span className="text-pink-500">BOOKSY</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                        We're on a mission to make quality education accessible to everyone,
                        everywhere. Join thousands of learners who are transforming their
                        careers with our platform.
                    </p>
                </div>

                {/* Mission & Vision */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 mb-12 md:mb-16">
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 rounded-2xl transition-colors duration-300">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-xl md:text-2xl">🎯</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Mission</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            To democratize education by providing high-quality, affordable learning
                            opportunities that empower individuals to achieve their personal and
                            professional goals, regardless of their background or location.
                        </p>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 rounded-2xl transition-colors duration-300">
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-pink-100 dark:bg-pink-900 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-xl md:text-2xl">🔮</span>
                        </div>
                        <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-white mb-4">Our Vision</h3>
                        <p className="text-gray-600 dark:text-gray-300">
                            We envision a world where anyone, anywhere can transform their life
                            through accessible education. A future where learning has no boundaries
                            and everyone has the tools to reach their full potential.
                        </p>
                    </div>
                </div>

                {/* Stats Section */}
                <div className="bg-gradient-to-r from-pink-500 to-purple-600 rounded-2xl p-6 md:p-8 lg:p-12 mb-12 md:mb-16">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center text-white">
                                <div className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">{stat.number}</div>
                                <div className="text-pink-100 text-sm md:text-base">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Why Choose Us */}
                <div className="mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 md:mb-12">
                        Why Choose Booksy?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                        <div className="text-center p-4 md:p-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl md:text-2xl">🎓</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-3">Expert Instructors</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                Learn from industry professionals and experienced educators
                                who are passionate about sharing their knowledge.
                            </p>
                        </div>

                        <div className="text-center p-4 md:p-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl md:text-2xl">💻</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-3">Hands-on Projects</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                Apply your learning through real-world projects and build
                                a portfolio that showcases your skills to employers.
                            </p>
                        </div>

                        <div className="text-center p-4 md:p-6">
                            <div className="w-12 h-12 md:w-16 md:h-16 bg-pink-100 dark:bg-pink-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-xl md:text-2xl">🤝</span>
                            </div>
                            <h3 className="text-lg md:text-xl font-semibold mb-3">Lifetime Access</h3>
                            <p className="text-gray-600 dark:text-gray-300 text-sm md:text-base">
                                Once you enroll in a course, you have lifetime access to
                                the content, including future updates and improvements.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-12 md:mb-16">
                    <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 dark:text-white mb-8 md:mb-12">
                        Meet Our Team
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {teamMembers.map((member, index) => (
                            <div key={index} className="text-center bg-gray-50 dark:bg-gray-800 p-4 md:p-6 rounded-2xl transition-colors duration-300">
                                <div className="w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 xl:w-40 xl:h-40 rounded-full border-4 border-[#C6005C] overflow-hidden mx-auto mb-4 flex items-center justify-center bg-pink-100 dark:bg-pink-900">
                                    {member.isImage ? (
                                        <img
                                            src={member.image}
                                            alt={member.name}
                                            className="object-cover w-full h-full"
                                        />
                                    ) : (
                                        <span className="text-xl md:text-2xl">{member.image}</span>
                                    )}
                                </div>
                                <h3 className="text-lg md:text-xl font-semibold mb-2">{member.name}</h3>
                                <p className="text-pink-600 dark:text-pink-400 font-medium mb-2">{member.role}</p>
                                <p className="text-gray-600 dark:text-gray-300 text-xs md:text-sm">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CTA Section */}
                <div className="text-center bg-gray-900 dark:bg-gray-800 rounded-2xl p-6 md:p-8 lg:p-12 transition-colors duration-300">
                    <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
                        Ready to Start Your Learning Journey?
                    </h2>
                    <p className="text-gray-300 mb-6 max-w-2xl mx-auto text-sm md:text-base">
                        Join thousands of successful learners who have transformed their
                        careers with our courses. Your future starts here.
                    </p>
                    <button className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 md:px-8 py-3 rounded-lg transition duration-300">
                        Explore Courses
                    </button>
                </div>
            </div>
        </section>
    );
};

export default About;