import express from 'express';
import Course from '../models/Course.js';
import User from '../models/User.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all courses with advanced filtering
// @route   GET /api/courses
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      search, 
      level,
      minPrice,
      maxPrice,
      isFree,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      page = 1, 
      limit = 12 
    } = req.query;
    
    let query = { isActive: true };
    
    // Category filter
    if (category && category !== 'All') {
      query.category = category;
    }
    
    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { instructor: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Level filter
    if (level && level !== 'All') {
      query.level = level;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.originalPrice = {};
      if (minPrice) query.originalPrice.$gte = parseInt(minPrice);
      if (maxPrice) query.originalPrice.$lte = parseInt(maxPrice);
    }

    // Free courses filter
    if (isFree === 'true') {
      query.isFree = true;
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === 'desc' ? -1 : 1;

    const courses = await Course.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Course.countDocuments(query);

    // Get categories for filter
    const categories = await Course.distinct('category', { isActive: true });
    const levels = await Course.distinct('level', { isActive: true });

    res.json({
      success: true,
      courses,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      total,
      filters: {
        categories,
        levels,
        priceRange: {
          min: 0,
          max: 500 // You can calculate this dynamically
        }
      }
    });

  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching courses',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Get featured courses (highly rated and popular)
// @route   GET /api/courses/featured
// @access  Public
router.get('/featured', async (req, res) => {
  try {
    const featuredCourses = await Course.find({ 
      isActive: true,
      'rating.average': { $gte: 4.0 },
      studentsEnrolled: { $gte: 100 }
    })
    .sort({ 'rating.average': -1, studentsEnrolled: -1 })
    .limit(6);

    res.json({
      success: true,
      courses: featuredCourses
    });

  } catch (error) {
    console.error('Get featured courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured courses'
    });
  }
});

// @desc    Get free courses
// @route   GET /api/courses/free
// @access  Public
router.get('/free', async (req, res) => {
  try {
    const freeCourses = await Course.find({ 
      isActive: true,
      isFree: true 
    })
    .sort({ studentsEnrolled: -1 })
    .limit(12);

    res.json({
      success: true,
      courses: freeCourses,
      total: freeCourses.length
    });

  } catch (error) {
    console.error('Get free courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching free courses'
    });
  }
});

// @desc    Get single course with detailed information
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Get related courses (same category)
    const relatedCourses = await Course.find({
      _id: { $ne: course._id },
      category: course.category,
      isActive: true
    }).limit(4);

    res.json({
      success: true,
      course,
      relatedCourses
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

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private
router.post('/:id/enroll', auth, async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is already enrolled
    const user = await User.findById(req.user._id);
    const alreadyEnrolled = user.enrolledCourses.some(
      enrolled => enrolled.courseId.toString() === req.params.id
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'You are already enrolled in this course'
      });
    }

    // For paid courses, you can add payment verification here
    if (!course.isFree) {
      // Add payment verification logic here
      // For now, we'll allow enrollment without payment for demo
      console.log(`Paid course enrollment: ${course.name} by ${user.name}`);
    }

    // Add to user's enrolled courses
    user.enrolledCourses.push({
      courseId: course._id,
      enrolledAt: new Date(),
      progress: 0,
      completed: false,
      lastAccessed: new Date()
    });

    await user.save();

    // Increment students count in course
    course.studentsEnrolled += 1;
    await course.save();

    res.json({
      success: true,
      message: `Successfully enrolled in "${course.name}"`,
      enrollment: {
        courseId: course._id,
        courseName: course.name,
        enrolledAt: new Date(),
        progress: 0
      }
    });

  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during enrollment',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// @desc    Update course progress
// @route   PUT /api/courses/:id/progress
// @access  Private
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { progress, completed } = req.body;
    
    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const user = await User.findById(req.user._id);
    const enrolledCourse = user.enrolledCourses.find(
      enrolled => enrolled.courseId.toString() === req.params.id
    );

    if (!enrolledCourse) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Update progress
    enrolledCourse.progress = progress;
    enrolledCourse.lastAccessed = new Date();
    
    if (completed !== undefined) {
      enrolledCourse.completed = completed;
      if (completed) {
        enrolledCourse.completedAt = new Date();
      }
    }

    await user.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      progress: enrolledCourse.progress,
      completed: enrolledCourse.completed
    });

  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating progress'
    });
  }
});

// @desc    Get user's enrolled courses with detailed information
// @route   GET /api/courses/my-courses/enrolled
// @access  Private
router.get('/my-courses/enrolled', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: 'enrolledCourses.courseId',
        select: 'name title image category instructor duration level rating studentsEnrolled'
      })
      .select('enrolledCourses');

    // Calculate statistics
    const totalCourses = user.enrolledCourses.length;
    const completedCourses = user.enrolledCourses.filter(course => course.completed).length;
    const inProgressCourses = user.enrolledCourses.filter(course => !course.completed && course.progress > 0).length;
    const averageProgress = totalCourses > 0 
      ? user.enrolledCourses.reduce((sum, course) => sum + course.progress, 0) / totalCourses 
      : 0;

    res.json({
      success: true,
      enrolledCourses: user.enrolledCourses,
      statistics: {
        totalCourses,
        completedCourses,
        inProgressCourses,
        averageProgress: Math.round(averageProgress),
        notStarted: totalCourses - completedCourses - inProgressCourses
      }
    });

  } catch (error) {
    console.error('Get enrolled courses error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching enrolled courses'
    });
  }
});

// @desc    Get course progress
// @route   GET /api/courses/:id/progress
// @access  Private
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const enrolledCourse = user.enrolledCourses.find(
      enrolled => enrolled.courseId.toString() === req.params.id
    );

    if (!enrolledCourse) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    res.json({
      success: true,
      progress: enrolledCourse.progress,
      completed: enrolledCourse.completed,
      enrolledAt: enrolledCourse.enrolledAt,
      lastAccessed: enrolledCourse.lastAccessed,
      completedAt: enrolledCourse.completedAt
    });

  } catch (error) {
    console.error('Get course progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching course progress'
    });
  }
});

// @desc    Unenroll from course
// @route   DELETE /api/courses/:id/enroll
// @access  Private
router.delete('/:id/enroll', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const courseIndex = user.enrolledCourses.findIndex(
      enrolled => enrolled.courseId.toString() === req.params.id
    );

    if (courseIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    const course = await Course.findById(req.params.id);
    
    // Remove from user's enrolled courses
    user.enrolledCourses.splice(courseIndex, 1);
    await user.save();

    // Decrement students count (optional - you might not want to do this)
    // course.studentsEnrolled = Math.max(0, course.studentsEnrolled - 1);
    // await course.save();

    res.json({
      success: true,
      message: `Successfully unenrolled from "${course?.name || 'the course'}"`
    });

  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during unenrollment'
    });
  }
});

// @desc    Rate a course
// @route   POST /api/courses/:id/rate
// @access  Private
router.post('/:id/rate', auth, async (req, res) => {
  try {
    const { rating, review } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is enrolled and has completed the course
    const user = await User.findById(req.user._id);
    const enrolledCourse = user.enrolledCourses.find(
      enrolled => enrolled.courseId.toString() === req.params.id
    );

    if (!enrolledCourse) {
      return res.status(403).json({
        success: false,
        message: 'You must be enrolled in the course to rate it'
      });
    }

    // Update course rating (simplified - in real app, you'd have a separate ratings collection)
    const newRatingCount = course.rating.count + 1;
    const newRatingAverage = ((course.rating.average * course.rating.count) + rating) / newRatingCount;

    course.rating.average = parseFloat(newRatingAverage.toFixed(1));
    course.rating.count = newRatingCount;

    await course.save();

    res.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: {
        average: course.rating.average,
        count: course.rating.count,
        userRating: rating
      }
    });

  } catch (error) {
    console.error('Rate course error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while submitting rating'
    });
  }
});

// @desc    Search courses with suggestions
// @route   GET /api/courses/search/suggestions
// @access  Public
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const suggestions = await Course.find({
      $or: [
        { name: { $regex: q, $options: 'i' } },
        { title: { $regex: q, $options: 'i' } },
        { tags: { $in: [new RegExp(q, 'i')] } }
      ],
      isActive: true
    })
    .select('name title category image')
    .limit(5);

    res.json({
      success: true,
      suggestions
    });

  } catch (error) {
    console.error('Search suggestions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching search suggestions'
    });
  }
});

// @desc    Get course categories
// @route   GET /api/courses/categories/all
// @access  Public
router.get('/categories/all', async (req, res) => {
  try {
    const categories = await Course.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalStudents: { $sum: '$studentsEnrolled' },
          averageRating: { $avg: '$rating.average' }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({
      success: true,
      categories
    });

  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching categories'
    });
  }
});

export default router;