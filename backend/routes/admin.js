import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Admin credentials (in production, use environment variables)
const ADMIN_EMAIL = 'admin@booksy.com';
const ADMIN_PASSWORD = 'admin1234567';
const JWT_SECRET = process.env.JWT_SECRET || 'admin_secret_key_2024';

// Admin authentication middleware
const adminAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided'
      });
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Check if it's an admin token
    if (decoded.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Admin privileges required.'
      });
    }

    req.admin = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Invalid or expired token'
    });
  }
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return res.status(401).json({
        success: false,
        message: 'Invalid admin credentials'
      });
    }

    // Generate JWT token for admin
    const token = jwt.sign(
      { 
        id: 'admin-user-id',
        email: ADMIN_EMAIL,
        name: 'Admin User',
        role: 'admin'
      }, 
      JWT_SECRET, 
      { expiresIn: '24h' }
    );

    const adminUser = {
      id: 'admin-user-id',
      name: 'Admin User',
      email: ADMIN_EMAIL,
      role: 'admin'
    };

    res.json({
      success: true,
      message: 'Admin login successful',
      token,
      user: adminUser
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during admin login'
    });
  }
});

// @desc    Verify admin token
// @route   GET /api/admin/verify
// @access  Private (Admin)
router.get('/verify', adminAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Token is valid',
      user: req.admin
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token verification failed'
    });
  }
});

// @desc    Get all courses (admin view)
// @route   GET /api/admin/courses
// @access  Private (Admin)
router.get('/courses', adminAuth, async (req, res) => {
  try {
    console.log('📦 Fetching courses for admin...');
    
    const courses = await Course.find({}).sort({ createdAt: -1 });
    
    console.log(`✅ Found ${courses.length} courses`);
    
    res.json({
      success: true,
      courses: courses || []
    });
    
  } catch (error) {
    console.error('❌ Error fetching courses:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching courses',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @desc    Create new course
// @route   POST /api/admin/courses
// @access  Private (Admin)
router.post('/courses', adminAuth, async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      price,
      originalPrice,
      category,
      image,
      instructor,
      duration,
      level,
      isFree,
      requirements,
      learningOutcomes,
      tags
    } = req.body;

    console.log('📦 Creating new course with data:', req.body);

    // ✅ FIX: Proper price formatting
    const formatPrice = (priceValue) => {
      if (!priceValue || priceValue === 'Free' || priceValue === 'free') return 0;
      // Remove $ symbol and convert to number
      const numericValue = parseFloat(priceValue.toString().replace(/[$,]/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    };

    // Ensure free course logic is consistent
    const finalIsFree = Boolean(isFree) || category === 'Free';
    const finalPrice = finalIsFree ? 'Free' : price;
    const finalOriginalPrice = finalIsFree ? 0 : formatPrice(originalPrice);
    const finalCategory = finalIsFree ? 'Free' : category;

    const courseData = {
      name,
      title,
      description,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      category: finalCategory,
      image,
      instructor: instructor || 'BOOKSY Team',
      duration: duration || 'Self-paced',
      level: level || 'Beginner',
      isFree: finalIsFree,
      requirements: Array.isArray(requirements) ? requirements : ['Basic knowledge required'],
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : ['Learn new skills'],
      tags: Array.isArray(tags) ? tags : ['popular'],
      rating: { average: 0, count: 0 },
      studentsEnrolled: 0,
      isActive: true
    };

    console.log('✅ Processed course data:', courseData);

    const course = new Course(courseData);
    await course.save();

    console.log('🎉 Course created successfully:', course._id);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: course
    });

  } catch (error) {
    console.error('❌ Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating course',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Check course data format'
    });
  }
});

// @desc    Update course
// @route   PUT /api/admin/courses/:id
// @access  Private (Admin)
router.put('/courses/:id', adminAuth, async (req, res) => {
  try {
    const {
      name,
      title,
      description,
      price,
      originalPrice,
      category,
      image,
      instructor,
      duration,
      level,
      isFree,
      requirements,
      learningOutcomes,
      tags
    } = req.body;

    console.log('✏️ Updating course:', req.params.id);

    // ✅ FIX: Same price conversion as create
    const formatPrice = (priceValue) => {
      if (!priceValue || priceValue === 'Free' || priceValue === 'free') return 0;
      const numericValue = parseFloat(priceValue.toString().replace(/[$,]/g, ''));
      return isNaN(numericValue) ? 0 : numericValue;
    };

    // Ensure free course logic is consistent
    const finalIsFree = Boolean(isFree) || category === 'Free';
    const finalPrice = finalIsFree ? 'Free' : price;
    const finalOriginalPrice = finalIsFree ? 0 : formatPrice(originalPrice);
    const finalCategory = finalIsFree ? 'Free' : category;

    const updateData = {
      name,
      title,
      description,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      category: finalCategory,
      image,
      instructor,
      duration,
      level,
      isFree: finalIsFree,
      requirements: Array.isArray(requirements) ? requirements : [''],
      learningOutcomes: Array.isArray(learningOutcomes) ? learningOutcomes : [''],
      tags: Array.isArray(tags) ? tags : ['']
    };

    console.log('✅ Update data:', updateData);

    const course = await Course.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course updated successfully',
      course: course
    });

  } catch (error) {
    console.error('❌ Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating course',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Check course data format'
    });
  }
});

// @desc    Delete course
// @route   DELETE /api/admin/courses/:id
// @access  Private (Admin)
router.delete('/courses/:id', adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      message: 'Course deleted successfully',
      deletedCourse: course
    });

  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    console.log('📊 Fetching admin dashboard...');
    
    const totalCourses = await Course.countDocuments();
    
    // Total students enrolled
    const totalStudentsResult = await Course.aggregate([
      { $group: { _id: null, total: { $sum: "$studentsEnrolled" } } }
    ]);
    
    const popularCourses = await Course.find({})
      .sort({ studentsEnrolled: -1 })
      .limit(5);

    const recentCourses = await Course.find({})
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      dashboard: {
        totalCourses,
        totalStudents: totalStudentsResult[0]?.total || 0,
        totalUsers: 1500, // Temporary static data
        popularCourses,
        recentCourses
      }
    });
    
  } catch (error) {
    console.error('❌ Dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

export default router;