import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Course from '../models/Course.js';

dotenv.config();

const coursesData = [
  {
    name: "Web Development Bootcamp",
    title: "Complete Web Development Course 2024",
    description: "Learn full-stack web development with HTML, CSS, JavaScript, React, Node.js and MongoDB. Build real projects and become a professional web developer.",
    price: "$99",
    originalPrice: 199,
    category: "Technology",
    image: "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg",
    instructor: "BOOKSY Team",
    duration: "40 hours",
    level: "Beginner",
    isFree: false,
    rating: { average: 4.5, count: 1200 },
    studentsEnrolled: 2500,
    requirements: ["Basic computer knowledge", "No programming experience required"],
    learningOutcomes: ["Build full-stack web applications", "Understand modern web technologies", "Create responsive websites"],
    tags: ["web development", "javascript", "react", "nodejs"]
  },
  {
    name: "Python for Beginners",
    title: "Python Programming from Zero to Hero",
    description: "Master Python programming language with hands-on projects. Learn data science, automation, web development with Python.",
    price: "Free",
    originalPrice: 0,
    category: "Free",
    image: "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149350157.jpg",
    instructor: "BOOKSY Team",
    duration: "30 hours",
    level: "Beginner",
    isFree: true,
    rating: { average: 4.7, count: 3500 },
    studentsEnrolled: 15000,
    requirements: ["No prior experience needed"],
    learningOutcomes: ["Python programming fundamentals", "Build real-world applications", "Data analysis with Python"],
    tags: ["python", "programming", "beginners"]
  },
  {
    name: "Data Science Fundamentals",
    title: "Data Science and Machine Learning Course",
    description: "Learn data science, statistics, machine learning and data visualization. Work with real datasets and build ML models.",
    price: "$199",
    originalPrice: 299,
    category: "Science",
    image: "https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books_23-2149342941.jpg",
    instructor: "BOOKSY Team",
    duration: "60 hours",
    level: "Intermediate",
    isFree: false,
    rating: { average: 4.6, count: 800 },
    studentsEnrolled: 3200,
    requirements: ["Basic Python knowledge", "High school math"],
    learningOutcomes: ["Data analysis and visualization", "Machine learning algorithms", "Statistical analysis"],
    tags: ["data science", "machine learning", "python", "statistics"]
  },
  {
    name: "Digital Marketing Mastery",
    title: "Complete Digital Marketing Course 2024",
    description: "Learn SEO, social media marketing, Google Ads, email marketing and content strategy. Grow businesses online.",
    price: "$149",
    originalPrice: 249,
    category: "Business",
    image: "https://img.freepik.com/free-vector/stack-books-vector-illustration_460848-6878.jpg",
    instructor: "BOOKSY Team",
    duration: "35 hours",
    level: "Beginner",
    isFree: false,
    rating: { average: 4.4, count: 950 },
    studentsEnrolled: 4200,
    requirements: ["Basic internet knowledge"],
    learningOutcomes: ["Digital marketing strategies", "SEO optimization", "Social media marketing"],
    tags: ["digital marketing", "seo", "social media", "business"]
  },
  {
    name: "Mobile App Development",
    title: "React Native Mobile App Development",
    description: "Build cross-platform mobile apps for iOS and Android using React Native. Learn app deployment and monetization.",
    price: "$179",
    originalPrice: 279,
    category: "Technology",
    image: "https://img.freepik.com/free-vector/stack-colorful-books_1308-495.jpg",
    instructor: "BOOKSY Team",
    duration: "45 hours",
    level: "Intermediate",
    isFree: false,
    rating: { average: 4.5, count: 600 },
    studentsEnrolled: 1800,
    requirements: ["JavaScript knowledge", "React basics"],
    learningOutcomes: ["Build mobile apps", "Cross-platform development", "App store deployment"],
    tags: ["react native", "mobile development", "javascript"]
  },
  {
    name: "Graphic Design Fundamentals",
    title: "Learn Graphic Design from Scratch",
    description: "Master Adobe Photoshop, Illustrator and design principles. Create logos, banners, and professional designs.",
    price: "Free",
    originalPrice: 0,
    category: "Free",
    image: "https://img.freepik.com/free-vector/stack-books-realistic_1284-4730.jpg",
    instructor: "BOOKSY Team",
    duration: "25 hours",
    level: "Beginner",
    isFree: true,
    rating: { average: 4.3, count: 2100 },
    studentsEnrolled: 8900,
    requirements: ["Computer with internet", "No design experience needed"],
    learningOutcomes: ["Graphic design principles", "Adobe software skills", "Professional design projects"],
    tags: ["graphic design", "photoshop", "illustrator", "design"]
  },
  {
    name: "JavaScript Advanced Concepts",
    title: "Advanced JavaScript Mastery",
    description: "Deep dive into advanced JavaScript concepts like closures, prototypes, async programming and modern ES6+ features.",
    price: "$129",
    originalPrice: 199,
    category: "Technology",
    image: "https://img.freepik.com/free-vector/stack-books-concept-illustration_114360-2343.jpg",
    instructor: "BOOKSY Team",
    duration: "35 hours",
    level: "Advanced",
    isFree: false,
    rating: { average: 4.8, count: 450 },
    studentsEnrolled: 1200,
    requirements: ["Basic JavaScript knowledge", "Programming experience"],
    learningOutcomes: ["Advanced JavaScript patterns", "Async programming", "Modern ES6+ features"],
    tags: ["javascript", "advanced", "programming", "es6"]
  },
  {
    name: "Business Finance Basics",
    title: "Finance for Non-Finance Professionals",
    description: "Understand business finance, accounting principles, financial statements and investment basics for career growth.",
    price: "Free",
    originalPrice: 0,
    category: "Free",
    image: "https://img.freepik.com/free-vector/stack-books-illustration_1284-4682.jpg",
    instructor: "BOOKSY Team",
    duration: "20 hours",
    level: "Beginner",
    isFree: true,
    rating: { average: 4.2, count: 1800 },
    studentsEnrolled: 7500,
    requirements: ["No finance background needed"],
    learningOutcomes: ["Financial statement analysis", "Business finance basics", "Investment principles"],
    tags: ["finance", "business", "accounting", "investment"]
  }
];

const seedCourses = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Delete existing courses
    await Course.deleteMany({});
    console.log('✅ Existing courses deleted');

    // Insert new courses
    await Course.insertMany(coursesData);
    console.log('✅ Courses seeded successfully');

    // Show inserted courses
    const courses = await Course.find({});
    console.log(`📚 Total courses in database: ${courses.length}`);
    
    console.log('\n📋 Course List:');
    courses.forEach(course => {
      console.log(`- ${course.name} (${course.category}) - ${course.price}`);
    });

    console.log('\n🎉 Courses seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedCourses();