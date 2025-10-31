import mongoose from 'mongoose';

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required'],
    trim: true,
    maxlength: [100, 'Course name cannot be more than 100 characters']
  },
  title: {
    type: String,
    required: [true, 'Course title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Course description is required'],
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  price: {
    type: String,
    required: [true, 'Price is required']
  },
  originalPrice: {
    type: Number,
    default: 0,
    min: 0
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['Free', 'Fiction', 'Technology', 'Science', 'Business', 'Development', 'Design']
  },
  image: {
    type: String,
    required: [true, 'Course image is required']
  },
  instructor: {
    type: String,
    default: 'BOOKSY Team',
    required: true
  },
  duration: {
    type: String,
    default: 'Self-paced'
  },
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced'],
    default: 'Beginner'
  },
  isFree: {
    type: Boolean,
    default: false
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  studentsEnrolled: {
    type: Number,
    default: 0
  },
  lessons: [{
    title: String,
    duration: String,
    videoUrl: String,
    resources: [String]
  }],
  requirements: [String],
  learningOutcomes: [String],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Category ke hisab se isFree set karo
courseSchema.pre('save', function(next) {
  if (this.category === 'Free') {
    this.isFree = true;
    this.price = 'Free';
    this.originalPrice = 0;
  }
  next();
});

// Custom validator for originalPrice
courseSchema.path('originalPrice').validate(function(value) {
  if (value === null || value === undefined) return true;
  return typeof value === 'number' && !isNaN(value) && value >= 0;
}, 'Original price must be a valid non-negative number');

export default mongoose.model('Course', courseSchema);