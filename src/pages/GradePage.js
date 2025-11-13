import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';

const GradePage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData } = useData();

  // Generate page data
  const pageData = useMemo(() => {
    return generateGradePageData(gradeId);
  }, [gradeId, generateGradePageData]);

  if (!pageData.grade) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <h2>Grade Not Found</h2>
          <p>The requested grade does not exist.</p>
          <Link to="/" className="btn btn-primary">Go Home</Link>
        </div>
      </div>
    );
  }

  const { grade, subjects } = pageData;

  return (
    <div className="grade-page">
      {/* Grade Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Resources</h1>
          <p className="lead">Quick access to textbooks, papers, notes, and videos.</p>
        </div>
      </header>

      {/* Breadcrumb */}
      <section className="py-3 bg-light">
        <div className="container">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {grade.display}
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Resource Type Cards */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4 mb-5">
            <div className="col-md-3">
              <Link 
                to={`/grade/${gradeId}/textbooks`} 
                className="resource-type-card textbooks"
              >
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-book text-primary" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Textbooks</h5>
                    <p className="card-text">Downloadable PDF textbooks</p>
                  </div>
                </div>
              </Link>
            </div>
            
            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/papers`} className="resource-type-card papers">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-file-earmark-text text-info" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Exam Papers</h5>
                    <p className="card-text">Term & chapter papers</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/notes`} className="resource-type-card notes">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-sticky text-warning" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Short Notes</h5>
                    <p className="card-text">Chapter-wise summaries</p>
                  </div>
                </div>
              </Link>
            </div>

            <div className="col-md-3">
              <Link to={`/grade/${gradeId}/videos`} className="resource-type-card videos">
                <div className="card h-100 text-center">
                  <div className="card-body">
                    <div className="resource-type-icon mb-3">
                      <i className="bi bi-play-circle text-danger" style={{ fontSize: '3rem' }}></i>
                    </div>
                    <h5 className="card-title">Video Lessons</h5>
                    <p className="card-text">Educational videos</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Subjects Overview */}
          <div className="subjects-overview">
            <h3 className="mb-4 text-center">
              Available Subjects
            </h3>
            <div className="row g-4">
              {Object.entries(subjects).map(([subjectId, subject]) => (
                <div key={subjectId} className="col-lg-4 col-md-6">
                  <div className="subject-card h-100">
                    <div className="subject-icon">
                      <i className={subject.icon}></i>
                    </div>
                    <div className="subject-info">
                      <h5>{subject.name}</h5>
                      <div className="resource-links mt-3">
                        <Link 
                          to={`/grade/${gradeId}/textbooks?subject=${subjectId}`} 
                          className="btn btn-outline-primary btn-sm me-2"
                        >
                          <i className="bi bi-book me-1"></i>Textbooks
                        </Link>
                        <Link 
                          to={`/grade/${gradeId}/papers?subject=${subjectId}`} 
                          className="btn btn-outline-info btn-sm me-2"
                        >
                          <i className="bi bi-file-text me-1"></i>Papers
                        </Link>
                        <Link 
                          to={`/grade/${gradeId}/notes?subject=${subjectId}`} 
                          className="btn btn-outline-warning btn-sm"
                        >
                          <i className="bi bi-sticky me-1"></i>Notes
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-4 bg-light">
        <div className="container text-center">
          <h4 className="mb-3">Need More Resources?</h4>
          <p className="text-muted mb-4">
            Can't find what you're looking for? Contact our admin team to request additional materials.
          </p>
          <Link to="/contact" className="btn btn-primary">
            <i className="bi bi-envelope me-2"></i>Contact Us
          </Link>
        </div>
      </section>

      <style jsx>{`
        .resource-type-card {
          text-decoration: none;
          color: inherit;
          display: block;
          transition: all 0.3s ease;
        }

        .resource-type-card:hover {
          text-decoration: none;
          color: inherit;
          transform: translateY(-5px);
        }

        .resource-type-card .card {
          transition: all 0.3s ease;
          border: 2px solid transparent;
        }

        .resource-type-card:hover .card {
          border-color: var(--primary);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .subject-card {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 2rem 1.5rem;
          border: 2px solid var(--border-color);
          transition: all 0.3s ease;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .subject-card:hover {
          border-color: var(--primary);
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15);
        }

        .subject-icon {
          text-align: center;
          margin-bottom: 1.5rem;
        }

        .subject-icon i {
          font-size: 3.5rem;
          color: var(--primary);
        }

        .subject-info {
          text-align: center;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          width: 100%;
        }

        .subject-info h5 {
          margin-bottom: 1.5rem;
          font-size: 1.25rem;
        }

        .resource-links {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .stat-card {
          background: var(--card-bg);
          border-radius: 15px;
          padding: 2rem 1rem;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }

        .stats-summary {
          background: var(--card-bg);
          border-radius: 20px;
          padding: 2rem;
          box-shadow: 0 5px 20px rgba(0,0,0,0.05);
        }

        @media (max-width: 768px) {
          .resource-type-card .card {
            margin-bottom: 1rem;
          }

          .subject-card {
            padding: 1.5rem 1.25rem;
          }
        }
      `}</style>
    </div>
  );
};

export default GradePage;