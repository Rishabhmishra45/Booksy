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
    const { page = 1, limit = 50, search, category } = req.query;

    let query = {};
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }

    const courses = await Course.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    // Get categories for filter
    const categories = await Course.distinct('category');

    res.json({
      success: true,
      courses,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      filters: {
        categories
      }
    });

  } catch (error) {
    console.error('Get admin courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Create new course
// @route   POST /api/admin/courses
// @access  Private (Admin)
router.post('/courses', adminAuth, async (req, res) => {
  try {
    const courseData = req.body;

    console.log('Received course data:', courseData);

    // Validate required fields
    const requiredFields = ['name', 'title', 'description', 'price', 'category', 'image'];
    const missingFields = requiredFields.filter(field => !courseData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }

    // Set default values for optional fields
    const course = new Course({
      name: courseData.name,
      title: courseData.title,
      description: courseData.description,
      price: courseData.price,
      category: courseData.category,
      image: courseData.image,
      instructor: courseData.instructor || 'BOOKSY Team',
      duration: courseData.duration || 'Self-paced',
      level: courseData.level || 'Beginner',
      isFree: courseData.category === 'Free',
      originalPrice: courseData.originalPrice || 0,
      requirements: courseData.requirements || ['Basic knowledge required'],
      learningOutcomes: courseData.learningOutcomes || ['Learn new skills'],
      tags: courseData.tags || ['popular'],
      rating: { average: 0, count: 0 },
      studentsEnrolled: 0,
      isActive: true
    });

    const savedCourse = await course.save();
    console.log('Course saved successfully:', savedCourse._id);

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      course: savedCourse
    });

  } catch (error) {
    console.error('Create course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating course',
      error: error.message
    });
  }
});

// @desc    Update course
// @route   PUT /api/admin/courses/:id
// @access  Private (Admin)
router.put('/courses/:id', adminAuth, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { 
        ...req.body,
        isFree: req.body.category === 'Free' // Update isFree based on category
      },
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
      course
    });

  } catch (error) {
    console.error('Update course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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

// @desc    Get course by ID
// @route   GET /api/admin/courses/:id
// @access  Private (Admin)
router.get('/courses/:id', adminAuth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    res.json({
      success: true,
      course
    });

  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get dashboard statistics
// @route   GET /api/admin/dashboard
// @access  Private (Admin)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Total courses
    const totalCourses = await Course.countDocuments();
    
    // Total students enrolled
    const totalStudentsResult = await Course.aggregate([
      { $group: { _id: null, total: { $sum: '$studentsEnrolled' } } }
    ]);
    const totalStudents = totalStudentsResult[0]?.total || 0;

    // Total users
    const totalUsers = await User.countDocuments();

    // Recent courses (last 5)
    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name title category studentsEnrolled createdAt image');

    // Category distribution
    const categoryStats = await Course.aggregate([
      { 
        $group: { 
          _id: '$category', 
          count: { $sum: 1 },
          students: { $sum: '$studentsEnrolled' },
          avgRating: { $avg: '$rating.average' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Popular courses (most enrolled)
    const popularCourses = await Course.find()
      .sort({ studentsEnrolled: -1 })
      .limit(5)
      .select('name title category studentsEnrolled rating image');

    // Today's new courses
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newCoursesToday = await Course.countDocuments({
      createdAt: { $gte: today }
    });

    // Weekly growth
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    const coursesLastWeek = await Course.countDocuments({
      createdAt: { $gte: lastWeek }
    });

    res.json({
      success: true,
      dashboard: {
        totalCourses,
        totalStudents,
        totalUsers,
        newCoursesToday,
        coursesLastWeek,
        recentCourses,
        categoryStats,
        popularCourses
      }
    });

  } catch (error) {
    console.error('Get dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching dashboard data',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Bulk operations
// @route   POST /api/admin/courses/bulk
// @access  Private (Admin)
router.post('/courses/bulk', adminAuth, async (req, res) => {
  try {
    const { action, courseIds } = req.body;

    if (!action || !courseIds || !Array.isArray(courseIds)) {
      return res.status(400).json({
        success: false,
        message: 'Action and courseIds array are required'
      });
    }

    let result;
    switch (action) {
      case 'delete':
        result = await Course.deleteMany({ _id: { $in: courseIds } });
        break;
      case 'activate':
        result = await Course.updateMany(
          { _id: { $in: courseIds } },
          { $set: { isActive: true } }
        );
        break;
      case 'deactivate':
        result = await Course.updateMany(
          { _id: { $in: courseIds } },
          { $set: { isActive: false } }
        );
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action'
        });
    }

    res.json({
      success: true,
      message: `Bulk operation ${action} completed successfully`,
      result
    });

  } catch (error) {
    console.error('Bulk operation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during bulk operation',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get system health
// @route   GET /api/admin/health
// @access  Private (Admin)
router.get('/health', adminAuth, async (req, res) => {
  try {
    // Database connection check
    const dbStatus = 'connected'; // You can add actual DB ping here
    
    // Memory usage
    const memoryUsage = process.memoryUsage();
    
    // Uptime
    const uptime = process.uptime();

    res.json({
      success: true,
      health: {
        database: dbStatus,
        memory: {
          used: Math.round(memoryUsage.heapUsed / 1024 / 1024) + ' MB',
          total: Math.round(memoryUsage.heapTotal / 1024 / 1024) + ' MB'
        },
        uptime: Math.round(uptime) + ' seconds',
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({
      success: false,
      message: 'Health check failed'
    });
  }
});

export default router;