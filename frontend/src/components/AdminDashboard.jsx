import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // New course form state
  const [newCourse, setNewCourse] = useState({
    name: '',
    title: '',
    description: '',
    price: '',
    originalPrice: '',
    category: 'Technology',
    image: '',
    instructor: 'BOOKSY Team',
    duration: 'Self-paced',
    level: 'Beginner',
    isFree: false,
    requirements: ['Basic knowledge required'],
    learningOutcomes: ['Learn new skills'],
    tags: ['popular']
  });

  // Check if admin is logged in
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken');
    if (!adminToken) {
      navigate('/admin/login');
      return;
    }
    
    // Verify token on component mount
    verifyAdminToken();
    
    // Fetch data based on active tab
    if (activeTab === 'courses') {
      fetchCourses();
    } else if (activeTab === 'dashboard') {
      fetchDashboard();
    }
  }, [activeTab, navigate]);

  const verifyAdminToken = async () => {
    try {
      const adminToken = localStorage.getItem('adminToken');
      const response = await fetch('http://localhost:5000/api/admin/verify', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Token verification failed');
      }
      
      const data = await response.json();
      if (!data.success) {
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
      }
    } catch (error) {
      console.error('Token verification error:', error);
      localStorage.removeItem('adminToken');
      navigate('/admin/login');
    }
  };

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        setMessage('❌ Admin token not found. Please login again.');
        navigate('/admin/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (response.status === 401) {
        setMessage('❌ Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setStats(data.dashboard);
      } else {
        setMessage(data.message || 'Failed to fetch dashboard');
      }
    } catch (error) {
      console.error('Fetch dashboard error:', error);
      setMessage('Error fetching dashboard data: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        setMessage('❌ Admin token not found. Please login again.');
        navigate('/admin/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/courses', {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      
      if (response.status === 401) {
        setMessage('❌ Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }
      
      if (!response.ok) {
        throw new Error('Failed to fetch courses');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCourses(data.courses);
      } else {
        setMessage(data.message || 'Failed to fetch courses');
      }
    } catch (error) {
      console.error('Fetch courses error:', error);
      setMessage('Error fetching courses: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        setMessage('❌ Admin token not found. Please login again.');
        navigate('/admin/login');
        return;
      }

      const response = await fetch('http://localhost:5000/api/admin/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          ...newCourse,
          originalPrice: newCourse.originalPrice || 0,
          rating: { average: 0, count: 0 },
          studentsEnrolled: 0,
          isActive: true
        }),
      });

      if (response.status === 401) {
        setMessage('❌ Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Course added successfully!');
        setShowAddModal(false);
        setNewCourse({
          name: '',
          title: '',
          description: '',
          price: '',
          originalPrice: '',
          category: 'Technology',
          image: '',
          instructor: 'BOOKSY Team',
          duration: 'Self-paced',
          level: 'Beginner',
          isFree: false,
          requirements: ['Basic knowledge required'],
          learningOutcomes: ['Learn new skills'],
          tags: ['popular']
        });
        fetchCourses(); // Refresh the list
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Add course error:', error);
      setMessage('❌ Error adding course: ' + error.message);
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      const adminToken = localStorage.getItem('adminToken');
      
      if (!adminToken) {
        setMessage('❌ Admin token not found. Please login again.');
        navigate('/admin/login');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });

      if (response.status === 401) {
        setMessage('❌ Session expired. Please login again.');
        localStorage.removeItem('adminToken');
        navigate('/admin/login');
        return;
      }

      const data = await response.json();

      if (data.success) {
        setMessage('✅ Course deleted successfully!');
        fetchCourses(); // Refresh the list
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (error) {
      console.error('Delete course error:', error);
      setMessage('❌ Error deleting course: ' + error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // Sample courses for demo if API fails
  const sampleCourses = [
    {
      _id: '1',
      name: 'Web Development',
      title: 'Complete Web Dev Course',
      category: 'Technology',
      price: '$99',
      studentsEnrolled: 1500,
      instructor: 'BOOKSY Team',
      image: 'https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149341898.jpg'
    },
    {
      _id: '2', 
      name: 'Python Programming',
      title: 'Python for Beginners',
      category: 'Technology',
      price: 'Free',
      studentsEnrolled: 2500,
      instructor: 'BOOKSY Team',
      image: 'https://img.freepik.com/free-vector/hand-drawn-flat-design-stack-books-illustration_23-2149350157.jpg'
    }
  ];

  const displayCourses = courses.length > 0 ? courses : sampleCourses;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Admin Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                BOOKSY <span className="text-pink-500">Admin</span>
              </h1>
              <button 
                onClick={() => navigate('/')}
                className="text-sm text-gray-600 dark:text-gray-300 hover:text-pink-600 dark:hover:text-pink-400"
              >
                ← Back to Site
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                Welcome, Admin
              </span>
              <button
                onClick={handleLogout}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg text-sm transition duration-300"
              >
                Logout
              </button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-8">
            {['dashboard', 'courses'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition duration-300 ${
                  activeTab === tab
                    ? 'border-pink-500 text-pink-600 dark:text-pink-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Message Alert */}
      {message && (
        <div className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4 ${
          message.includes('✅') ? 'bg-green-100 border-green-400 text-green-700' : 'bg-red-100 border-red-400 text-red-700'
        } border px-4 py-3 rounded relative`}>
          <span className="block sm:inline">{message}</span>
          <button 
            onClick={() => setMessage('')}
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
          >
            ×
          </button>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'dashboard' && (
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">Dashboard Overview</h2>
            
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-pink-100 dark:bg-pink-900">
                        <span className="text-2xl">📚</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Courses</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {stats?.totalCourses || displayCourses.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900">
                        <span className="text-2xl">👥</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Students</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {stats?.totalStudents?.toLocaleString() || '2,500+'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900">
                        <span className="text-2xl">👤</span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Users</p>
                        <p className="text-2xl font-bold text-gray-800 dark:text-white">
                          {stats?.totalUsers || '1,000+'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Courses */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Recent Courses</h3>
                  <div className="space-y-3">
                    {(stats?.recentCourses || displayCourses.slice(0, 5)).map((course, index) => (
                      <div key={course._id || index} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{course.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{course.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {course.studentsEnrolled?.toLocaleString() || '1,500'} students
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {course.createdAt ? new Date(course.createdAt).toLocaleDateString() : 'Recently added'}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === 'courses' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Course Management</h2>
              <button 
                onClick={() => setShowAddModal(true)}
                className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition duration-300 flex items-center gap-2"
              >
                <span>+</span>
                <span>Add New Course</span>
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600"></div>
              </div>
            ) : (
              /* Courses Table */
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Course
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Students
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Price
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {displayCourses.map((course) => (
                        <tr key={course._id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <img className="h-10 w-10 rounded-lg object-cover" src={course.image} alt={course.name} />
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {course.name}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                  {course.instructor}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              course.category === 'Free' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                            }`}>
                              {course.category}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {course.studentsEnrolled?.toLocaleString() || '0'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {course.price}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <button 
                              onClick={() => {
                                setSelectedCourse(course);
                                setShowEditModal(true);
                              }}
                              className="text-pink-600 hover:text-pink-900 dark:hover:text-pink-400 mr-3"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteCourse(course._id)}
                              className="text-red-600 hover:text-red-900 dark:hover:text-red-400"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Add Course Modal */}
        {showAddModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">Add New Course</h3>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleAddCourse} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Course Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCourse.name}
                      onChange={(e) => setNewCourse({...newCourse, name: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Web Development Bootcamp"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCourse.title}
                      onChange={(e) => setNewCourse({...newCourse, title: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Complete Web Development Course 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Price *
                    </label>
                    <input
                      type="text"
                      required
                      value={newCourse.price}
                      onChange={(e) => setNewCourse({...newCourse, price: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="$99 or Free"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Category *
                    </label>
                    <select
                      value={newCourse.category}
                      onChange={(e) => setNewCourse({...newCourse, category: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="Technology">Technology</option>
                      <option value="Science">Science</option>
                      <option value="Business">Business</option>
                      <option value="Free">Free</option>
                      <option value="Development">Development</option>
                      <option value="Design">Design</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      required
                      value={newCourse.image}
                      onChange={(e) => setNewCourse({...newCourse, image: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Instructor
                    </label>
                    <input
                      type="text"
                      value={newCourse.instructor}
                      onChange={(e) => setNewCourse({...newCourse, instructor: e.target.value})}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="BOOKSY Team"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description *
                  </label>
                  <textarea
                    required
                    value={newCourse.description}
                    onChange={(e) => setNewCourse({...newCourse, description: e.target.value})}
                    rows="3"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder="Course description..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg transition duration-300"
                  >
                    Add Course
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;