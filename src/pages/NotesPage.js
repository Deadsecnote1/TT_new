import React, { useMemo, useState, useEffect } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useLanguage } from '../context/LanguageContext';
import ResourceCard from '../components/common/ResourceCard';

const NotesPage = () => {
  const { gradeId } = useParams();
  const [searchParams] = useSearchParams();
  const selectedSubjectId = searchParams.get('subject');
  const { generateGradePageData } = useData();
  const { selectedLanguage, shouldShowResource } = useLanguage();
  const [uploadedFiles, setUploadedFiles] = useState([]);

  // Load uploaded files from localStorage
  useEffect(() => {
    const savedFiles = localStorage.getItem('teachingTorch_uploadedFiles');
    if (savedFiles) {
      const allFiles = JSON.parse(savedFiles);
      const notes = allFiles.filter(file => 
        file.grade === gradeId && file.resourceType === 'notes'
      );
      setUploadedFiles(notes);
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

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Helper function to format chapter names
  const formatChapterName = (chapterKey) => {
    if (chapterKey.includes('_')) {
      // Remove language suffix for display
      const baseName = chapterKey.split('_')[0];
      if (baseName.startsWith('ch')) {
        const chapterNum = baseName.replace('ch', '');
        return `Chapter ${chapterNum}`;
      }
      return baseName.charAt(0).toUpperCase() + baseName.slice(1).replace('-', ' ');
    }
    
    if (chapterKey.startsWith('ch')) {
      const chapterNum = chapterKey.replace('ch', '');
      return `Chapter ${chapterNum}`;
    }
    return chapterKey.charAt(0).toUpperCase() + chapterKey.slice(1).replace('-', ' ');
  };

  // Generate notes grid component
  const NotesGrid = ({ notes }) => {
    if (!notes || Object.keys(notes).length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-sticky text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No notes available</h5>
          <p className="text-muted">Short notes for this subject haven't been added yet.</p>
        </div>
      );
    }

    // Filter notes by language
    const filteredNotes = Object.entries(notes).filter(([noteKey, note]) => 
      shouldShowResource(note.language)
    );

    if (filteredNotes.length === 0) {
      return (
        <div className="text-center py-5">
          <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
          <h5 className="mt-3 text-muted">No notes found</h5>
          <p className="text-muted">
            No notes available in{' '}
            {selectedLanguage === 'sinhala' ? 'Sinhala' : 
             selectedLanguage === 'tamil' ? 'Tamil' : 
             selectedLanguage === 'english' ? 'English' : 'the selected language'}
            {' '}for this subject.
          </p>
        </div>
      );
    }

    return (
      <div className="notes-grid">
        <div className="row g-3">
          {filteredNotes.map(([noteKey, note]) => (
            <div key={noteKey} className="col-md-6 col-lg-4">
              <div className="note-card h-100" data-language={note.language}>
                <div className="card h-100">
                  <div className="card-body d-flex flex-column">
                    <div className="note-header mb-3">
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="note-icon">
                          <i className="bi bi-file-pdf text-danger" style={{ fontSize: '2rem' }}></i>
                        </div>
                      </div>
                    </div>

                    <div className="note-content flex-grow-1">
                      <h6 className="note-title mb-2">
                        {formatChapterName(note.chapter || noteKey)}
                      </h6>
                      <div className="note-meta mb-3">
                        <small className="text-muted d-block">{note.filename}</small>
                      </div>
                    </div>

                    <div className="note-actions mt-auto">
                      {note.driveLink || note.url ? (
                        <ResourceCard
                          resource={{
                            ...note,
                            driveLink: note.driveLink || note.url || note.path
                          }}
                          title={formatChapterName(note.chapter || noteKey)}
                          description={note.filename}
                          showViewButton={true}
                          showDownloadButton={true}
                        />
                      ) : (
                        <a 
                          href={`/${note.path}`} 
                          className="btn btn-primary btn-sm w-100" 
                          download
                        >
                          <i className="bi bi-download me-1"></i>Download Notes
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="notes-page">
      {/* Page Header */}
      <header className="grade-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">{grade.display} Short Notes</h1>
          <p className="lead">Quick reference notes for all chapters</p>
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
                Short Notes
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Language Filter Info */}
      {selectedLanguage !== 'all' && (
        <section className="py-2 bg-info bg-opacity-10">
          <div className="container">
            <div className="text-center">
              <small className="text-info">
                <i className="bi bi-filter me-1"></i>
                Showing notes in: <strong>
                  {selectedLanguage === 'sinhala' ? 'සිංහල (Sinhala)' : 
                   selectedLanguage === 'tamil' ? 'தமிழ் (Tamil)' : 
                   selectedLanguage === 'english' ? 'English' : 'All Languages'}
                </strong>
              </small>
            </div>
          </div>
        </section>
      )}

      {/* Notes Content */}
      <section className="py-5">
        <div className="container">
          {Object.keys(subjects).map(subjectId => {
            const subject = subjects[subjectId];
            const notes = subject.resources.notes || {};
            
            // Get uploaded notes for this subject
            const uploadedNotes = validUploadedFiles.filter(file => file.subject === subjectId);
            const uploadedNotesObj = {};
            uploadedNotes.forEach((file, index) => {
              uploadedNotesObj[`uploaded_${index}`] = {
                ...file,
                filename: file.title || file.name,
                language: file.languages?.[0] || 'english',
                chapter: file.description || 'Uploaded Note'
              };
            });
            
            // Merge notes
            const mergedNotes = { ...notes, ...uploadedNotesObj };

            // Filter by selected subject if specified
            if (selectedSubjectId && subjectId !== selectedSubjectId) {
              return null;
            }

            // Check if any notes match the filter
            const hasFilteredNotes = Object.values(mergedNotes).some(note => shouldShowResource(note.language));

            // Skip subject if no notes match filter
            if (!hasFilteredNotes) {
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
                      <small className="text-muted">Chapter-wise short notes</small>
                    </div>
                  </div>
                </div>

                <NotesGrid notes={mergedNotes} />
              </div>
            );
          })}

          {/* No Subjects Message */}
          {Object.keys(subjects).length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-sticky text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No notes available</h4>
              <p className="text-muted">Short notes for this grade haven't been added yet.</p>
            </div>
          )}

          {/* No Results for Filter */}
          {Object.keys(subjects).length > 0 && 
           !Object.values(subjects).some(subject => 
             Object.values(subject.resources.notes || {}).some(note => shouldShowResource(note.language))
           ) && (
            <div className="text-center py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="mt-3 text-muted">No notes found</h4>
              <p className="text-muted">
                No notes available in{' '}
                {selectedLanguage === 'sinhala' ? 'Sinhala' : 
                 selectedLanguage === 'tamil' ? 'Tamil' : 
                 selectedLanguage === 'english' ? 'English' : 'the selected language'}
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
    </div>
  );
};

export default NotesPage;