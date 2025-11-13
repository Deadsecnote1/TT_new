import React, { useState } from 'react';
import { getEmbedUrl, getDownloadUrl } from '../../utils/googleDrive';

/**
 * PDF Viewer Component
 * Displays PDFs from Google Drive in an embedded viewer
 */
const PDFViewer = ({ 
  driveLink, 
  title = 'PDF Viewer',
  showDownload = true,
  className = '',
  height = '600px'
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const embedUrl = getEmbedUrl(driveLink);
  const downloadUrl = getDownloadUrl(driveLink);

  const handleLoad = () => {
    setIsLoading(false);
    setError(null);
  };

  const handleError = () => {
    setIsLoading(false);
    setError('Failed to load PDF. Please try downloading instead.');
  };

  return (
    <div className={`pdf-viewer-container ${className}`}>
      {/* Header with title and download button */}
      <div className="pdf-viewer-header d-flex justify-content-between align-items-center mb-3 p-3 bg-light rounded">
        <h5 className="mb-0">
          <i className="bi bi-file-pdf text-danger me-2"></i>
          {title}
        </h5>
        {showDownload && (
          <a
            href={downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary btn-sm"
            download
          >
            <i className="bi bi-download me-1"></i>
            Download PDF
          </a>
        )}
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading PDF...</span>
          </div>
          <p className="mt-3 text-muted">Loading PDF viewer...</p>
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="alert alert-warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
          <div className="mt-2">
            <a
              href={downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-sm btn-primary"
              download
            >
              <i className="bi bi-download me-1"></i>
              Download PDF Instead
            </a>
          </div>
        </div>
      )}

      {/* PDF Embed */}
      <div className="pdf-viewer-wrapper" style={{ position: 'relative', height }}>
        <iframe
          src={embedUrl}
          title={title}
          className="pdf-iframe w-100 h-100 border rounded"
          style={{ minHeight: height }}
          onLoad={handleLoad}
          onError={handleError}
          allow="autoplay"
        />
      </div>

      {/* Alternative: Direct link if iframe fails */}
      <div className="mt-3 text-center">
        <small className="text-muted">
          Having trouble viewing?{' '}
          <a
            href={embedUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary"
          >
            Open in new tab
          </a>
        </small>
      </div>

      <style jsx>{`
        .pdf-viewer-container {
          background: var(--card-bg);
          border-radius: 10px;
          padding: 1rem;
        }

        .pdf-iframe {
          background: white;
        }

        .pdf-viewer-header {
          background-color: var(--bg-secondary) !important;
          border: 1px solid var(--border-color);
        }

        @media (max-width: 768px) {
          .pdf-viewer-wrapper {
            height: 400px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PDFViewer;

