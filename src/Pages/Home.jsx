import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  ChevronRight,
  Instagram,
  Twitter,
  Youtube,
  MapPin,
  Mail,
  User,
  LogOut,
  Lock
} from "lucide-react";
import "../Styles/Home.css";

function Home() {
  const [activeAccordion, setActiveAccordion] = useState(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Failed to logout", error);
    }
  };

  const handleCourseAccess = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/courses' } });
    } else {
      navigate('/courses');
    }
  };

  const handleVideoAccess = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/videos' } });
    } else {
      navigate('/videos');
    }
  };

  const courses = [
    {
      title: "Web Development Cohort",
      description: "Master HTML, CSS, JavaScript, React and build real-world projects",
      image: "/images/web-dev.jpg",
      tag: "COMPLETE",
      modules: 24,
    },
    {
      title: "Python Logic Building Cohort",
      description: "Sharpen your problem-solving skills with Python. Master loops, conditions, recursion, and algorithms through hands-on challenges.",
      image: "/images/python.jpg",
      tag: "Complete",
      modules: 15,
    },
    {
      title: "Math for Python Developers",
      description: "Master essential math concepts like algebra, logic, probability, and linear algebra tailored for coding and real-world applications.",
      image: "/images/maths.jpg",
      tag: "CORE",
      modules: 18,
    }
  ];

  const steps = [
    {
      title: "Choose Your Course",
      description: "Browse our selection of expert-led courses and find the perfect match for your goals",
    },
    {
      title: "Learn at Your Pace",
      description: "Access course materials, live sessions, and hands-on projects to build your skills",
    },
    {
      title: "Get Certified & Connect",
      description: "Earn your certification and join our community of successful graduates",
    },
  ];

  const testimonials = [
    {
      name: "Mohit Singh",
      title: "Frontend Developer",
      avatar: "/images/mohit.jpg",
      quote: "I really like Yaseen's teaching style. Whenever I hit a roadblock, I just ask him for help, and things just click.",
    },
    {
      name: "Siddhanth raikar",
      title: "Frontend & JavaScript Enthusiast",
      avatar: "/images/siddhanth.jpeg",
      quote: "If I had the chance to learn from Yaseen two months earlier, I wouldn't have missed it for anything.",
    },
    {
      name: "Vetri",
      title: "Frontend Developer",
      avatar: "/placeholder.svg",
      quote: "Thanks to this course, I got my first freelance project and now I'm working with clients from around the world.",
    },
  ];

  const faqs = [
    {
      question: "Why should I choose LearnHub?",
      answer: "LearnHub offers personalized mentorship, practical projects, and a supportive community.",
    },
    {
      question: "Who will be teaching me?",
      answer: "All our courses are taught by experienced professionals who have worked at top tech companies.",
    },
    {
      question: "Is LearnHub suitable for beginners?",
      answer: "We have courses designed for all skill levels, from complete beginners to advanced developers.",
    },
  ];

  return (
    <div className="home-container">
      {/* Navigation */}
      <header className="header">
        <div className="header-content">
          <div className="logo">LearnHub</div>
          
          <nav className="nav-desktop">
            <div className="nav-background">
              <ul className="nav-list">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Home
                  </Link>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleCourseAccess}
                    className="nav-link nav-button"
                  >
                    Courses
                    {!isAuthenticated && <Lock className="lock-icon" />}
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    onClick={handleVideoAccess}
                    className="nav-link nav-button"
                  >
                    Videos
                    {!isAuthenticated && <Lock className="lock-icon" />}
                  </button>
                </li>
                {isAuthenticated && (
                  <li className="nav-item">
                    <Link to="/dashboard" className="nav-link">
                      Dashboard
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </nav>

          {/* Auth Section */}
          {isAuthenticated ? (
            <div className="auth-section">
              <Link 
                to="/dashboard" 
                className="user-profile"
              >
                <User className="user-icon" />
                <span className="username">{user.username || user.email.split('@')[0]}</span>
              </Link>
              <button 
                onClick={handleLogout}
                className="logout-button"
              >
                <LogOut className="logout-icon" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons">
              <Link 
                to="/login" 
                className="login-button"
              >
                Login
              </Link>
              <Link 
                to="/register" 
                className="register-button"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text-center">
            <button 
              onClick={() => !isAuthenticated ? navigate('/login') : null}
              className="enroll-badge"
            >
              Enroll Today
            </button>
            <h1 className="hero-title">Start Your Learning Journey With Us</h1>
            <p className="hero-subtitle">
              Join our courses and get firsthand knowledge from industry experts
            </p>
            <button 
              onClick={handleCourseAccess}
              className="browse-courses-btn"
            >
              Browse Courses 
              <ChevronRight className="chevron-icon" />
              {!isAuthenticated && <Lock className="lock-icon-inline" />}
            </button>
          </div>

          <div className="hero-image-section">
            <div className="hero-image-container">
              <img
                src="/images/yaseen.jpeg"
                alt="Course instructor"
                className="hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="steps-section">
        <div className="steps-content">
          <h2 className="steps-title">How It Works</h2>
          <div className="steps-grid">
            {steps.map((step, index) => (
              <div key={index} className="step-card">
                <div className="step-number">{index + 1}</div>
                <h3 className="step-title">{step.title}</h3>
                <p className="step-description">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section id="courses" className="courses-section">
        <div className="courses-content">
          <h2 className="courses-title">What You'll Learn With Us</h2>
          <div className="courses-grid">
            {courses.map((course, index) => (
              <div 
                key={index} 
                className="course-card"
                onClick={handleCourseAccess}
              >
                {!isAuthenticated && (
                  <div className="course-overlay">
                    <div className="overlay-content">
                      <Lock className="overlay-lock-icon" />
                      <p className="overlay-title">Login to access courses</p>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate('/login', { state: { from: '/courses' } });
                        }}
                        className="overlay-button"
                      >
                        Login Now
                      </button>
                    </div>
                  </div>
                )}
                <div className="course-image-container">
                  <img src={course.image} alt={course.title} className="course-image" />
                  <div className="course-tag">
                    {course.tag}
                  </div>
                </div>
                <div className="course-content">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-description">{course.description}</p>
                  <div className="course-footer">
                    <span className="course-modules">{course.modules} Modules</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCourseAccess();
                      }}
                      className="course-learn-more"
                    >
                      Learn more
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="testimonials-content">
          <h2 className="testimonials-title">What Our Students Say</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-header">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="testimonial-avatar"
                  />
                  <div className="testimonial-info">
                    <h4 className="testimonial-name">{testimonial.name}</h4>
                    <p className="testimonial-role">{testimonial.title}</p>
                  </div>
                </div>
                <blockquote className="testimonial-quote">"{testimonial.quote}"</blockquote>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faqs" className="faq-section">
        <div className="faq-content">
          <h2 className="faq-title">Frequently Asked Questions</h2>
          <div className="faq-container">
            {faqs.map((faq, index) => (
              <div key={index} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => toggleAccordion(index)}
                >
                  <span className="faq-question-text">{faq.question}</span>
                  <span className="faq-toggle">
                    {activeAccordion === index ? '−' : '+'}
                  </span>
                </button>
                {activeAccordion === index && (
                  <div className="faq-answer">
                    <div className="faq-answer-text">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-grid">
            <div className="footer-brand">
              <h3 className="footer-brand-title">LearnHub</h3>
              <p className="footer-brand-description">
                LearnHub is an initiative to personally mentor folks in the field of programming.
              </p>
            </div>
            
            <div className="footer-links">
              <h4 className="footer-links-title">Quick Links</h4>
              <ul className="footer-links-list">
                <li className="footer-link-item">
                  <Link to="/" className="footer-link">
                    Home
                  </Link>
                </li>
                <li className="footer-link-item">
                  <button 
                    onClick={handleCourseAccess}
                    className="footer-link footer-button"
                  >
                    Courses
                    {!isAuthenticated && <Lock className="footer-lock-icon" />}
                  </button>
                </li>
                <li className="footer-link-item">
                  <button 
                    onClick={handleVideoAccess}
                    className="footer-link footer-button"
                  >
                    Videos
                    {!isAuthenticated && <Lock className="footer-lock-icon" />}
                  </button>
                </li>
                <li className="footer-link-item">
                  {isAuthenticated ? (
                    <Link to="/dashboard" className="footer-link">
                      Dashboard
                    </Link>
                  ) : (
                    <Link to="/login" className="footer-link">
                      Login
                    </Link>
                  )}
                </li>
              </ul>
            </div>
            
            <div className="footer-contact">
              <h4 className="footer-contact-title">Contact</h4>
              <div className="footer-contact-info">
                <div className="contact-item">
                  <MapPin className="contact-icon" />
                  <span className="contact-text">123 Education Street, Learning City, 10001</span>
                </div>
                <div className="contact-item">
                  <Mail className="contact-icon" />
                  <a href="mailto:contact@learnhub.com" className="contact-email">
                    contact@learnhub.com
                  </a>
                </div>
              </div>
              <div className="social-links">
                <a href="#" className="social-link">
                  <Instagram className="social-icon" />
                </a>
                <a href="#" className="social-link">
                  <Twitter className="social-icon" />
                </a>
                <a href="#" className="social-link">
                  <Youtube className="social-icon" />
                </a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom">
            <p className="footer-copyright">
              © {new Date().getFullYear()} LearnHub. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;