import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import { extractYouTubeId, getYouTubeThumbnail, isYouTubeLink } from '../utils/youtube';
import { getEmbedUrl, isGoogleDriveLink } from '../utils/googleDrive';

const VideosPage = () => {
  const { gradeId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedSubjectId = searchParams.get('subject');
  const { generateGradePageData } = useData();
  const { selectedLanguage, shouldShowResource, getLanguageIndicator } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Load uploaded files from localStorage - MUST be before any conditional returns
  useEffect(() => {
    const savedFiles = localStorage.getItem('teachingTorch_uploadedFiles');
    if (savedFiles) {
      const allFiles = JSON.parse(savedFiles);
      const videos = allFiles.filter(file => 
        file.grade === gradeId && file.resourceType === 'videos'
      );
      setUploadedFiles(videos);
    }
  }, [gradeId]);

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
  
  // Filter uploaded files to only include those for existing subjects
  const validSubjectIds = Object.keys(subjects);
  const validUploadedFiles = uploadedFiles.filter(file => validSubjectIds.includes(file.subject));

  const handlePlayVideo = (video, videoUrl) => {
    const youtubeId = extractYouTubeId(videoUrl);
    if (youtubeId) {
      setActiveVideo({
        title: video.title,
        embedUrl: `https://www.youtube.com/embed/${youtubeId}?autoplay=1`
      });
      setShowPlayer(true);
      return;
    }

    if (isGoogleDriveLink(videoUrl)) {
      const embedUrl = getEmbedUrl(videoUrl);
      if (embedUrl) {
        setActiveVideo({
          title: video.title,
          embedUrl
        });
        setShowPlayer(true);
        return;
      }
    }

    // Fallback: open in new tab
    window.open(videoUrl, '_blank', 'noopener,noreferrer');
  };

  // Generate videos grid component
  const VideosGrid = ({ videos }) => {
    if (!videos || videos.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-youtube text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No video lessons available</h5>
          <p className="text-muted">Video lessons for this subject haven't been added yet.</p>
        </div>
      );
    }

    // Filter videos by language
    const filteredVideos = videos.filter(video => shouldShowResource(video.language));

    if (filteredVideos.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No videos found</h5>
          <p className="text-muted">
            No video lessons available in{' '}
            {selectedLanguage === 'sinhala' && 'Sinhala'}
            {selectedLanguage === 'tamil' && 'Tamil'}
            {selectedLanguage === 'english' && 'English'}
            {' '}for this subject.
          </p>
        </div>
      );
    }

    return (
      <div className="videos-grid">
        <div className="row g-4">
          {filteredVideos.map((video, index) => {
            const videoUrl = video.driveLink || video.url || video.youtubeUrl;
            const videoId = extractYouTubeId(videoUrl);
            const thumbnail = getYouTubeThumbnail(videoUrl);

            return (
              <div key={video.id || index} className="col-md-6 col-lg-4">
                <div className="video-card h-100" data-language={video.language}>
                  <div className="card h-100">
                    {/* Video Thumbnail */}
                    <div className="video-thumbnail position-relative">
                      {thumbnail ? (
                        <img 
                          src={thumbnail} 
                          alt={video.title}
                          className="card-img-top"
                          style={{ height: '200px', objectFit: 'cover' }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                      ) : null}
                      
                      {/* Fallback thumbnail */}
                      <div 
                        className="placeholder-thumbnail d-flex align-items-center justify-content-center bg-light"
                        style={{ 
                          height: '200px', 
                          display: thumbnail ? 'none' : 'flex'
                        }}
                      >
                        <i className="bi bi-play-circle text-muted" style={{ fontSize: '4rem' }}></i>
                      </div>

                      {/* Play overlay */}
                      <div className="play-overlay position-absolute top-50 start-50 translate-middle">
                        <div className="play-button bg-danger text-white rounded-circle d-flex align-items-center justify-content-center"
                             style={{ width: '60px', height: '60px' }}>
                          <i className="bi bi-play-fill" style={{ fontSize: '1.5rem', marginLeft: '4px' }}></i>
                        </div>
                      </div>

                      {/* Language badge */}
                      <div className="position-absolute top-0 end-0 m-2">
                        <span className="badge bg-dark bg-opacity-75 d-flex align-items-center">
                          <span 
                            className="language-indicator me-1"
                            {...getLanguageIndicator(video.language)}
                          ></span>
                          {video.language}
                        </span>
                      </div>
                    </div>

                    {/* Video Content */}
                    <div className="card-body d-flex flex-column">
                      <div className="video-content flex-grow-1">
                        <h6 className="video-title mb-2">{video.title}</h6>
                        
                        {video.chapter && (
                          <p className="text-muted mb-2">
                            <i className="bi bi-bookmark me-1"></i>
                            <small>{video.chapter}</small>
                          </p>
                        )}

                        {video.description && (
                          <p className="text-muted small mb-3">{video.description}</p>
                        )}

                        <div className="video-meta">
                          <small className="text-muted d-block">
                            <i className="bi bi-calendar me-1"></i>
                            Added: {new Date(video.addedDate).toLocaleDateString()}
                          </small>
                        </div>
                      </div>

                      {/* Video Actions */}
                      <div className="video-actions mt-3">
                        <button
                          className={`btn btn-sm w-100 ${isYouTubeLink(videoUrl) ? 'btn-danger' : 'btn-primary'}`}
                          onClick={() => handlePlayVideo(video, videoUrl)}
                        >
                          <i className="bi bi-play-circle me-1"></i>
                          Play Video
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="videos-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Video Lessons</h1>
          <p className="lead">Educational videos and tutorials</p>
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
                Video Lessons
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Language Filter Info */}
      <section className="py-2 bg-info bg-opacity-10">
        <div className="container">
          <div className="text-center">
            <small className="text-info">
              <i className="bi bi-filter me-1"></i>
              Showing videos in: <strong>
                {selectedLanguage === 'sinhala' && 'සිංහල (Sinhala)'}
                {selectedLanguage === 'tamil' && 'தமிழ் (Tamil)'}
                {selectedLanguage === 'english' && 'English'}
              </strong>
            </small>
          </div>
        </div>
      </section>

      {/* Videos Content */}
      <section className="py-5">
        <div className="container">
          {Object.keys(subjects).map(subjectId => {
            const subject = subjects[subjectId];
            const videos = subject.videos || [];
            
            // Get uploaded videos for this subject
            const uploadedVideos = validUploadedFiles.filter(file => file.subject === subjectId);
            const uploadedVideosFormatted = uploadedVideos.map(file => ({
              ...file,
              title: file.title || file.name,
              language: file.languages?.[0] || 'english',
              url: file.driveLink || file.youtubeUrl || file.url,
              addedDate: file.uploadDate
            }));
            
            // Merge videos
            const mergedVideos = [...videos, ...uploadedVideosFormatted];

            // Filter by selected subject if specified
            if (selectedSubjectId && subjectId !== selectedSubjectId) {
              return null;
            }

            // Check if any videos match the filter
            const hasFilteredVideos = mergedVideos.some(video => shouldShowResource(video.language));

            // Skip subject if no videos match filter
            if (!hasFilteredVideos) {
              return null;
            }

            return (
              <div key={subjectId} className="subject-section mb-5">
                <div className="subject-header mb-4">
                  <div className="d-flex align-items-center">
                    <div className="subject-icon-large me-3">
                      <i className={subject.icon} style={{ fontSize: '2.5rem', color: 'var(--primary)' }}></i>
                    </div>
                    <div>
                      <h3 className="mb-0">{subject.name}</h3>
                      <small className="text-muted">Educational video lessons</small>
                    </div>
                  </div>
                </div>

                <VideosGrid videos={mergedVideos} />
              </div>
            );
          })}

          {/* No Subjects Message */}
          {Object.keys(subjects).length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-youtube text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No video lessons available</h4>
              <p className="text-muted">Video lessons for this grade haven't been added yet.</p>
            </div>
          )}

          {/* No Results for Filter */}
          {Object.keys(subjects).length > 0 && 
           !Object.values(subjects).some(subject => 
             (subject.videos || []).some(video => shouldShowResource(video.language))
           ) && (
            <div className="text-center py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No videos found</h4>
              <p className="text-muted">
                No video lessons available in{' '}
                {selectedLanguage === 'sinhala' && 'Sinhala'}
                {selectedLanguage === 'tamil' && 'Tamil'}
                {selectedLanguage === 'english' && 'English'}
                {' '}for this grade.
              </p>
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

      {/* Video Player Modal */}
      {showPlayer && activeVideo && (
        <div
          className="modal fade show d-block"
          style={{
            backgroundColor: 'rgba(0,0,0,0.6)',
            position: 'fixed',
            inset: 0,
            zIndex: 1050
          }}
          onClick={() => setShowPlayer(false)}
        >
          <div
            className="modal-dialog modal-xl modal-dialog-centered"
            style={{ margin: '2rem auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="bi bi-play-circle text-danger me-2"></i>
                  {activeVideo.title}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPlayer(false)}
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body p-0">
                <div className="ratio ratio-16x9">
                  <iframe
                    title={activeVideo.title}
                    src={activeVideo.embedUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{ border: 'none' }}
                  ></iframe>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
 
      <style jsx>{`
        .video-thumbnail {
          position: relative;
          overflow: hidden;
          border-radius: 0.5rem;
          box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
        }

        .video-thumbnail img {
          transition: transform 0.3s ease;
        }

        .video-thumbnail:hover img {
          transform: scale(1.05);
        }

        .placeholder-thumbnail {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: 0.5rem;
          z-index: 1;
        }

        .play-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .play-button {
          position: relative;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .modal.show {
          display: block !important;
        }
      `}</style>
    </div>
  );
};

export default VideosPage;