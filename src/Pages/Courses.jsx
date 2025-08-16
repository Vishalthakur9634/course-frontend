import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Bell, 
  BookOpen, 
  MessageCircle, 
  Moon, 
  Sun,
  Home, 
  Bookmark,
  Search 
} from "react-feather";
import '../Styles/Cources.css';

const Course = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(true); // Default to dark mode
  const [activeTab, setActiveTab] = useState("courses");
  const [filteredCourses, setFilteredCourses] = useState([]);

  const courses = [
    {
      id: 1,
      title: "Frontend Masterclass",
      image: "/api/placeholder/400/300",
      progress: 27,
      category: "Web Development",
      instructor: "Sarah Chen",
      duration: "12 hours",
      students: 1250
    },
    {
      id: 2,
      title: "Algorithms & Data Structures",
      image: "/api/placeholder/400/300",
      progress: 0,
      category: "Computer Science",
      instructor: "Dr. Alex Kumar",
      duration: "18 hours",
      students: 890
    },
    {
      id: 3,
      title: "Full-Stack Bootcamp",
      image: "/api/placeholder/400/300",
      progress: 42,
      category: "Web Development",
      instructor: "Mike Rodriguez",
      duration: "35 hours",
      students: 2150
    },
    {
      id: 4,
      title: "Cloud Engineering",
      image: "/api/placeholder/400/300",
      progress: 8,
      category: "DevOps",
      instructor: "Emma Watson",
      duration: "22 hours",
      students: 675
    },
    {
      id: 5,
      title: "Blockchain Fundamentals",
      image: "/api/placeholder/400/300",
      progress: 15,
      category: "Web3",
      instructor: "James Liu",
      duration: "14 hours",
      students: 450
    },
    {
      id: 6,
      title: "Mobile App Development",
      image: "/api/placeholder/400/300",
      progress: 0,
      category: "App Development",
      instructor: "Rachel Green",
      duration: "28 hours",
      students: 1890
    },
  ];

  // Filter courses based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(course =>
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery]);

  // Initialize filtered courses
  useEffect(() => {
    setFilteredCourses(courses);
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const getProgressColor = (progress) => {
    if (progress === 0) return 'Not Started';
    if (progress < 25) return 'Just Started';
    if (progress < 50) return 'In Progress';
    if (progress < 75) return 'Almost There';
    return 'Nearly Complete';
  };

  return (
    <div className="min-h-screen">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-logo">
          L
        </div>
        <nav className="nav-container">
          <Link to="/" className="nav-button">
            <Home className="nav-icon" />
          </Link>
          <button
            onClick={() => setActiveTab("courses")}
            className={`nav-button ${activeTab === "courses" ? "active" : ""}`}
          >
            <BookOpen className="nav-icon" />
          </button>
          <button
            onClick={() => setActiveTab("bookmarks")}
            className={`nav-button ${activeTab === "bookmarks" ? "active" : ""}`}
          >
            <Bookmark className="nav-icon" />
          </button>
          <button
            onClick={() => setActiveTab("messages")}
            className={`nav-button ${activeTab === "messages" ? "active" : ""}`}
          >
            <MessageCircle className="nav-icon" />
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div className="main-layout">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <h1 className="header-title">LearnHub</h1>

            <div className="header-actions">
              <div className="search-container">
                <Search className="search-icon" />
                <input
                  type="search"
                  placeholder="Search courses..."
                  className="search-input"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <button className="header-button">
                <Bell className="header-icon" />
                <span className="notification-badge">3</span>
              </button>

              <button className="header-button" onClick={toggleTheme}>
                {darkMode ? <Sun className="header-icon" /> : <Moon className="header-icon" />}
              </button>

              <div className="avatar">
                J
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="main-content">
          <div className="welcome-section">
            <h2 className="welcome-title">Welcome Back, Jamie!</h2>
            <p className="welcome-subtitle">
              Continue your learning journey where you left off. You have {filteredCourses.length} courses available.
            </p>
          </div>

          {/* Stats Section */}
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">
                <BookOpen />
              </div>
              <div className="stat-info">
                <div className="stat-value">6</div>
                <div className="stat-label">Total Courses</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <MessageCircle />
              </div>
              <div className="stat-info">
                <div className="stat-value">24h</div>
                <div className="stat-label">Hours Learned</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">
                <Bookmark />
              </div>
              <div className="stat-info">
                <div className="stat-value">12</div>
                <div className="stat-label">Certificates</div>
              </div>
            </div>
          </div>

          {/* Course grid */}
          <div className="courses-header">
            <h3 className="courses-title">Your Courses</h3>
            <div className="course-filters">
              <button className="filter-btn active">All</button>
              <button className="filter-btn">In Progress</button>
              <button className="filter-btn">Completed</button>
              <button className="filter-btn">Not Started</button>
            </div>
          </div>

          <div className="course-grid">
            {filteredCourses.map((course, index) => (
              <div 
                key={course.id}
                className="course-card"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="course-image">
                  <img 
                    src={course.image} 
                    alt={course.title}
                    onError={(e) => {
                      e.target.src = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=300&fit=crop&crop=entropy&auto=format&q=60`;
                    }}
                  />
                  <div className="course-category">
                    {course.category}
                  </div>
                  <div className="course-overlay">
                    <div className="course-meta">
                      <span className="course-duration">{course.duration}</span>
                      <span className="course-students">{course.students} students</span>
                    </div>
                  </div>
                </div>
                
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-instructor">by {course.instructor}</p>
                  <div className="course-status">
                    <span className={`status-badge ${course.progress === 0 ? 'not-started' : course.progress === 100 ? 'completed' : 'in-progress'}`}>
                      {getProgressColor(course.progress)}
                    </span>
                  </div>
                </div>
                
                <div className="progress-section">
                  <div className="progress-header">
                    <span className="progress-label">Progress</span>
                    <span className="progress-value">{course.progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ width: `${course.progress}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="course-actions">
                  <button className="btn-primary">
                    {course.progress === 0 ? 'Start Learning' : course.progress === 100 ? 'Review' : 'Continue Learning'}
                  </button>
                  <button className="btn-secondary">
                    <MessageCircle className="btn-icon" />
                  </button>
                  <button className="btn-secondary">
                    <Bookmark className="btn-icon" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {filteredCourses.length === 0 && (
            <div className="no-results">
              <div className="no-results-icon">
                <Search />
              </div>
              <h3 className="no-results-title">No courses found</h3>
              <p className="no-results-text">
                Try adjusting your search terms or browse all courses.
              </p>
              <button 
                className="btn-primary"
                onClick={() => setSearchQuery("")}
              >
                Clear Search
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Course;