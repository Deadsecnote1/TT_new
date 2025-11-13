import React from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const Home = () => {
  const { grades } = useData();

  // Grade configurations for display
  const gradeConfigs = {
    'grade6': { number: '6', color: 'primary' },
    'grade7': { number: '7', color: 'primary' },
    'grade8': { number: '8', color: 'primary' },
    'grade9': { number: '9', color: 'primary' },
    'grade10': { number: '10', color: 'primary' },
    'grade11': { number: '11', color: 'primary' },
    'al': { number: 'A/L', color: 'success' }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <header className="hero-section">
        <div className="container text-center text-white">
          <div className="hero-content">
            <h1 className="display-4 fw-bold mb-3">Welcome to Teaching Torch</h1>
            <p className="lead mb-4">Free Educational Resources for Sri Lankan Students (Grades 6–A/L)</p>
            <div className="hero-buttons">
              <a href="#grades" className="btn btn-light btn-lg me-3">Explore Grades</a>
            </div>
          </div>
        </div>
      </header>

      {/* Grades Section */}
      <section className="py-5" id="grades">
        <div className="container">
          <h2 className="text-center mb-4 mb-md-5">Choose Your Grade</h2>
          <div className="row g-3 g-md-4">
            {/* Grade 6 */}
            <div className="col-6 col-md-4 col-sm-6">
              <Link to="/grade/grade6" className="grade-card">
                <div className="grade-icon">6</div>
                <h5>Grade 6</h5>
                <p className="text-muted">Foundation level subjects</p>
                <div className="btn btn-primary">View Resources</div>
              </Link>
            </div>

            {/* Grade 7 */}
            <div className="col-6 col-md-4 col-sm-6">
              <Link to="/grade/grade7" className="grade-card">
                <div className="grade-icon">7</div>
                <h5>Grade 7</h5>
                <p className="text-muted">Intermediate level content</p>
                <div className="btn btn-primary">View Resources</div>
              </Link>
            </div>

            {/* Grade 8 */}
            <div className="col-6 col-md-4 col-sm-6">
              <Link to="/grade/grade8" className="grade-card">
                <div className="grade-icon">8</div>
                <h5>Grade 8</h5>
                <p className="text-muted">Advanced concepts introduction</p>
                <div className="btn btn-primary">View Resources</div>
              </Link>
            </div>

            {/* Grade 9 */}
            <div className="col-6 col-md-4 col-sm-6">
              <Link to="/grade/grade9" className="grade-card">
                <div className="grade-icon">9</div>
                <h5>Grade 9</h5>
                <p className="text-muted">Pre-O/L preparation</p>
                <div className="btn btn-primary">View Resources</div>
              </Link>
            </div>

            {/* Grade 10 */}
            <div className="col-6 col-md-4 col-sm-6">
              <Link to="/grade/grade10" className="grade-card">
                <div className="grade-icon">10</div>
                <h5>Grade 10</h5>
                <p className="text-muted">O/L examination year</p>
                <div className="btn btn-primary">View Resources</div>
              </Link>
            </div>

            {/* Grade 11 */}
            <div className="col-6 col-md-4 col-sm-6">
              <Link to="/grade/grade11" className="grade-card">
                <div className="grade-icon">11</div>
                <h5>Grade 11</h5>
                <p className="text-muted">Post-O/L studies</p>
                <div className="btn btn-primary">View Resources</div>
              </Link>
            </div>

            {/* Advanced Level */}
            <div className="col-12 col-md-6 mx-auto">
              <Link to="/grade/al" className="grade-card advanced-level">
                <div className="grade-icon">A/L</div>
                <h5>Advanced Level</h5>
                <p className="text-muted">University preparation</p>
                <div className="btn btn-success">View Resources</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <h3 className="text-center mb-4 mb-md-5">Why Choose Teaching Torch?</h3>
          <div className="row g-3 g-md-4">
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="bi bi-download"></i>
                </div>
                <h5>Free Downloads</h5>
                <p>All resources are completely free to download and use for educational purposes.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="bi bi-translate"></i>
                </div>
                <h5>Multi-Language</h5>
                <p>Resources available in Sinhala, Tamil, and English to serve all Sri Lankan students.</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="feature-card text-center">
                <div className="feature-icon">
                  <i className="bi bi-phone"></i>
                </div>
                <h5>Mobile Friendly</h5>
                <p>Access your study materials anytime, anywhere on any device.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-5">
        <div className="container">
          <div className="row text-center g-3">
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <h3 className="text-primary">7</h3>
                <span>Grade Levels</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <h3 className="text-primary">3</h3>
                <span>Languages</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <h3 className="text-primary">100%</h3>
                <span>Free Content</span>
              </div>
            </div>
            <div className="col-6 col-md-3">
              <div className="stat-item">
                <h3 className="text-primary">24/7</h3>
                <span>Access</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;