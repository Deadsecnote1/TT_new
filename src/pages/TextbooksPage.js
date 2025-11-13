import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import ResourceCard from '../components/common/ResourceCard';

// Removed API_BASE_URL - using Google Drive links instead

const TextbooksPage = () => {
  const { gradeId } = useParams();
  const { generateGradePageData } = useData();
  const { selectedLanguage, shouldShowResource } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load uploaded files from localStorage
  useEffect(() => {
    fetchTextbooks();
  }, [gradeId]);

  const fetchTextbooks = () => {
    setIsLoading(true);
    try {
      const savedFiles = localStorage.getItem('teachingTorch_uploadedFiles');
      if (savedFiles) {
        const allFiles = JSON.parse(savedFiles);
        const textbooks = allFiles.filter(file => 
          file.grade === gradeId && file.resourceType === 'textbook'
        );
        setUploadedFiles(textbooks);
      }
    } catch (error) {
      console.error('Error loading textbooks:', error);
    }
    setIsLoading(false);
  };

  // Generate page data
  const pageData = useMemo(() => {
    return generateGradePageData(gradeId);
  }, [gradeId, generateGradePageData]);

  // Group uploaded textbooks by subject and language
  const getTextbooksBySubject = () => {
    const groupedTextbooks = {};

    uploadedFiles.forEach(file => {
      if (!groupedTextbooks[file.subject]) {
        groupedTextbooks[file.subject] = {};
      }
      
      file.languages.forEach(language => {
        if (!groupedTextbooks[file.subject][language]) {
          groupedTextbooks[file.subject][language] = [];
        }
        groupedTextbooks[file.subject][language].push(file);
      });
    });

    return groupedTextbooks;
  };

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
  const uploadedTextbooks = getTextbooksBySubject();

  // Removed formatFileSize - not needed for Google Drive links

  // Generate uploaded textbook component
  const UploadedTextbookDownload = ({ files, medium, language }) => {
    if (!files || files.length === 0) {
      return (
        <div className="text-center py-4">
          <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
          <p className="text-muted mt-2">No textbook available</p>
        </div>
      );
    }

    return (
      <div className="uploaded-textbooks">
        {files.map((file, index) => (
          <ResourceCard
            key={file.id || index}
            resource={file}
            title={file.title || file.name || file.originalName}
            description={file.description || `Uploaded: ${new Date(file.uploadDate).toLocaleDateString()}`}
            language={language}
            showViewButton={true}
            showDownloadButton={true}
            className="mb-3"
          />
        ))}
      </div>
    );
  };

  const allSubjects = subjects;

  if (isLoading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading textbooks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="textbooks-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Textbooks</h1>
          <p className="lead">
            {gradeId === 'al' ? 'Download A/L textbooks by stream' : 'Download textbooks in Sinhala, Tamil, and English'}
          </p>
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
              <li className="breadcrumb-item">
                <Link to={`/grade/${gradeId}`}>{grade.display}</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Textbooks
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Upload Status */}
      {uploadedFiles.length > 0 && (
        <section className="py-2 bg-success bg-opacity-10">
          <div className="container">
            <div className="text-center">
              <small className="text-success">
                <i className="bi bi-cloud-check me-1"></i>
                <strong>{uploadedFiles.length} uploaded textbook{uploadedFiles.length !== 1 ? 's' : ''}</strong> available for {grade.display}
                {uploadedFiles.some(f => f.downloadUrl) && ' | 🔗 Server files available for download'}
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Language Filter Info */}
      {selectedLanguage !== 'all' && (
        <section className="py-2 bg-info bg-opacity-10">
          <div className="container">
            <div className="text-center">
              <small className="text-info">
                <i className="bi bi-filter me-1"></i>
                Showing textbooks in: <strong>
                  {selectedLanguage === 'sinhala' && 'සිංහල (Sinhala)'}
                  {selectedLanguage === 'tamil' && 'தமிழ் (Tamil)'}
                  {selectedLanguage === 'english' && 'English'}
                </strong>
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Textbooks Content */}
      <section className="py-5">
        <div className="container">
          {Object.entries(allSubjects).map(([subjectId, subject]) => {
            const uploadedSubjectTextbooks = uploadedTextbooks[subjectId] || {};
            const hasUploadedTextbooks = Object.keys(uploadedSubjectTextbooks).length > 0;

            return (
              <div key={subjectId} className="subject-section mb-5">
                <div className="subject-header mb-4">
                  <div className="d-flex align-items-center">
                    <div className="subject-icon-large me-3">
                      <i className={subject.icon} style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
                    </div>
                    <div>
                      <h3 className="mb-0">{subject.name}</h3>
                      <small className="text-muted">
                        {hasUploadedTextbooks ? 
                          `${Object.values(uploadedSubjectTextbooks).flat().length} textbook${Object.values(uploadedSubjectTextbooks).flat().length !== 1 ? 's' : ''} available` :
                          'No textbooks uploaded yet'
                        }
                      </small>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Sinhala Textbooks */}
                  {shouldShowResource('sinhala') && (
                    <div className="col-md-4">
                      <div className="textbook-medium-card h-100">
                        <div className="card h-100">
                          <div className="card-header bg-danger text-white text-center">
                            <h5 className="mb-0">
                              <i className="bi bi-download me-2"></i>සිංහල (Sinhala)
                            </h5>
                          </div>
                          <div className="card-body">
                            {/* Uploaded Textbooks */}
                            {uploadedSubjectTextbooks.sinhala ? (
                              <div>
                                <small className="text-success d-block mb-2">
                                  <i className="bi bi-cloud-upload me-1"></i>Available Textbooks
                                </small>
                                <UploadedTextbookDownload 
                                  files={uploadedSubjectTextbooks.sinhala}
                                  medium="Sinhala" 
                                  language="sinhala"
                                />
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
                                <p className="text-muted mt-2">No textbook available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tamil Textbooks */}
                  {shouldShowResource('tamil') && (
                    <div className="col-md-4">
                      <div className="textbook-medium-card h-100">
                        <div className="card h-100">
                          <div className="card-header bg-purple text-white text-center" style={{ backgroundColor: 'var(--tamil)' }}>
                            <h5 className="mb-0">
                              <i className="bi bi-download me-2"></i>தமிழ் (Tamil)
                            </h5>
                          </div>
                          <div className="card-body">
                            {/* Uploaded Textbooks */}
                            {uploadedSubjectTextbooks.tamil ? (
                              <div>
                                <small className="text-success d-block mb-2">
                                  <i className="bi bi-cloud-upload me-1"></i>Available Textbooks
                                </small>
                                <UploadedTextbookDownload 
                                  files={uploadedSubjectTextbooks.tamil}
                                  medium="Tamil" 
                                  language="tamil"
                                />
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
                                <p className="text-muted mt-2">No textbook available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* English Textbooks */}
                  {shouldShowResource('english') && (
                    <div className="col-md-4">
                      <div className="textbook-medium-card h-100">
                        <div className="card h-100">
                          <div className="card-header bg-primary text-white text-center">
                            <h5 className="mb-0">
                              <i className="bi bi-download me-2"></i>English
                            </h5>
                          </div>
                          <div className="card-body">
                            {/* Uploaded Textbooks */}
                            {uploadedSubjectTextbooks.english ? (
                              <div>
                                <small className="text-success d-block mb-2">
                                  <i className="bi bi-cloud-upload me-1"></i>Available Textbooks
                                </small>
                                <UploadedTextbookDownload 
                                  files={uploadedSubjectTextbooks.english}
                                  medium="English" 
                                  language="english"
                                />
                              </div>
                            ) : (
                              <div className="text-center py-4">
                                <i className="bi bi-file-earmark text-muted" style={{ fontSize: '3rem' }}></i>
                                <p className="text-muted mt-2">No textbook available</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {/* No subjects for A/L without stream */}
          {gradeId === 'al' && (
            <div className="text-center py-5">
              <i className="bi bi-arrow-up text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">Select a Stream</h4>
              <p className="text-muted">Please select your A/L stream above to view available textbooks.</p>
            </div>
          )}
        </div>
      </section>

      {/* Back to Grade Button */}
      <section className="py-3 bg-light">
        <div className="container text-center">
          <Link to={`/grade/${gradeId}`} className="btn btn-outline-primary">
            <i className="bi bi-arrow-left me-2"></i>Back to {grade.display} Overview
          </Link>
        </div>
      </section>

      <style jsx>{`
        .textbook-medium-card .card {
          transition: all 0.3s ease;
        }

        .textbook-medium-card .card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        }

        .download-item {
          transition: all 0.3s ease;
          padding: 1rem;
          border-radius: 10px;
        }

        .download-item:hover {
          background-color: var(--bg-secondary);
        }

        .uploaded-textbooks {
          max-height: 400px;
          overflow-y: auto;
        }

        .subject-icon-large {
          min-width: 60px;
        }

        .subject-section {
          border-bottom: 1px solid var(--border-color);
          padding-bottom: 2rem;
        }

        .subject-section:last-child {
          border-bottom: none;
        }
      `}</style>
    </div>
  );
};

export default TextbooksPage;