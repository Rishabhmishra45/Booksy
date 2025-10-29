import React, { useState } from "react";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission here
        console.log("Form submitted:", formData);
        alert("Thank you for your message! We'll get back to you soon.");
        setFormData({ name: "", email: "", subject: "", message: "" });
    };

    const contactMethods = [
        {
            icon: "📧",
            title: "Email Us",
            details: "support@edulearn.com",
            description: "Send us an email anytime"
        },
        {
            icon: "📞",
            title: "Call Us",
            details: "+1 (555) 123-4567",
            description: "Mon-Fri from 9am to 6pm"
        },
        {
            icon: "💬",
            title: "Live Chat",
            details: "Start Chat",
            description: "24/7 customer support"
        },
        {
            icon: "📍",
            title: "Visit Us",
            details: "123 Learning St, EduCity",
            description: "Feel free to visit our office"
        }
    ];

    const faqs = [
        {
            question: "How do I enroll in a course?",
            answer: "Simply browse our courses, click on your chosen course, and click the 'Enroll Now' button. You'll be guided through the registration process."
        },
        {
            question: "Are the courses really free?",
            answer: "We offer both free and premium courses. Our free courses provide complete learning experiences, while premium courses offer additional features and certifications."
        },
        {
            question: "Can I get a certificate?",
            answer: "Yes! We provide certificates of completion for all courses. Premium courses include verified certificates that you can share on LinkedIn."
        },
        {
            question: "What if I need help during my course?",
            answer: "We have dedicated instructors and teaching assistants ready to help. You can also connect with fellow students in our community forums."
        }
    ];

    return (
        <section className="w-full bg-white dark:bg-gray-900 py-8 md:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 md:mb-16">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">
                        Get in <span className="text-pink-500">Touch</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto px-4">
                        Have questions? We'd love to hear from you. Send us a message 
                        and we'll respond as soon as possible.
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
                    {/* Contact Information */}
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-6 md:mb-8">
                            Let's Start a Conversation
                        </h2>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 mb-8">
                            {contactMethods.map((method, index) => (
                                <div key={index} className="bg-gray-50 dark:bg-gray-800 p-4 md:p-6 rounded-2xl transition-colors duration-300">
                                    <div className="text-2xl mb-3">{method.icon}</div>
                                    <h3 className="font-semibold text-gray-800 dark:text-white mb-1">{method.title}</h3>
                                    <p className="text-pink-600 dark:text-pink-400 font-medium mb-1">{method.details}</p>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm">{method.description}</p>
                                </div>
                            ))}
                        </div>

                        {/* FAQ Section */}
                        <div>
                            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-4">
                                        <h4 className="font-semibold text-gray-800 dark:text-white mb-2">
                                            {faq.question}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm">
                                            {faq.answer}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-gray-50 dark:bg-gray-800 p-6 md:p-8 rounded-2xl transition-colors duration-300">
                        <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6">
                            Send us a Message
                        </h3>
                        
                        <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Full Name *
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                        placeholder="Your full name"
                                    />
                                </div>
                                
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Email Address *
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                        placeholder="your.email@example.com"
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Subject *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white transition-colors duration-300"
                                    placeholder="What is this regarding?"
                                />
                            </div>
                            
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows="4"
                                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none transition-colors duration-300"
                                    placeholder="Tell us how we can help you..."
                                ></textarea>
                            </div>
                            
                            <button
                                type="submit"
                                className="w-full bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-300"
                            >
                                Send Message
                            </button>
                            
                            <p className="text-gray-500 dark:text-gray-400 text-sm text-center">
                                We typically respond within 24 hours during business days.
                            </p>
                        </form>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-12 md:mt-16 bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 md:p-8 transition-colors duration-300">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-4 md:mb-6 text-center">
                        Visit Our Campus
                    </h3>
                    <div className="bg-white dark:bg-gray-700 p-6 md:p-8 rounded-xl text-center transition-colors duration-300">
                        <div className="w-full h-48 sm:h-64 bg-gradient-to-br from-pink-100 to-purple-100 dark:from-pink-900 dark:to-purple-900 rounded-lg flex items-center justify-center mb-4">
                            <span className="text-4xl sm:text-6xl">🗺️</span>
                        </div>
                        <p className="text-gray-600 dark:text-gray-300">
                            123 Learning Street, Education City, EC 12345
                        </p>
                        <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                            Open Monday - Friday, 9:00 AM - 6:00 PM
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Contact;