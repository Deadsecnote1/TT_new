import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { isGoogleDriveLink, extractFileId } from '../../utils/googleDrive';
import { isYouTubeLink, extractYouTubeId } from '../../utils/youtube';

// Subject Management Component
const SubjectManagement = ({ subjects, grades, addSubject, updateSubject, deleteSubject }) => {
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectId, setNewSubjectId] = useState('');
  const [newSubjectIcon, setNewSubjectIcon] = useState('bi-book');
  const [selectedGrades, setSelectedGrades] = useState([]);
  const [editingSubject, setEditingSubject] = useState(null);

  const commonIcons = [
    { value: 'bi-book', label: 'Book' },
    { value: 'bi-flask', label: 'Flask (Science)' },
    { value: 'bi-calculator', label: 'Calculator (Math)' },
    { value: 'bi-globe', label: 'Globe (English)' },
    { value: 'bi-clock-history', label: 'Clock (History)' },
    { value: 'bi-palette', label: 'Palette (Arts)' },
    { value: 'bi-music-note', label: 'Music' },
    { value: 'bi-code-slash', label: 'Code (IT)' },
    { value: 'bi-geo-alt', label: 'Geography' },
    { value: 'bi-heart', label: 'Health' },
    { value: 'bi-people', label: 'Social Studies' },
    { value: 'bi-lightbulb', label: 'General' }
  ];

  const handleGradeToggle = (gradeId) => {
    setSelectedGrades(prev => 
      prev.includes(gradeId) 
        ? prev.filter(g => g !== gradeId)
        : [...prev, gradeId]
    );
  };

  const handleAddSubject = () => {
    if (!newSubjectName.trim()) {
      alert('Please enter a subject name');
      return;
    }
    if (!newSubjectId.trim()) {
      alert('Please enter a subject ID (lowercase, no spaces, e.g., "physics", "chemistry")');
      return;
    }
    if (selectedGrades.length === 0) {
      alert('Please select at least one grade for this subject');
      return;
    }
    if (subjects[newSubjectId]) {
      alert('A subject with this ID already exists. Please use a different ID.');
      return;
    }

    addSubject(newSubjectId.toLowerCase().trim(), newSubjectName.trim(), newSubjectIcon, selectedGrades);
    setNewSubjectName('');
    setNewSubjectId('');
    setNewSubjectIcon('bi-book');
    setSelectedGrades([]);
    alert(`✅ Subject "${newSubjectName}" added successfully for selected grades!`);
  };

  const handleEditSubject = (subjectId) => {
    const subject = subjects[subjectId];
    setEditingSubject(subjectId);
    setNewSubjectName(subject.name);
    setNewSubjectIcon(subject.icon);
    setSelectedGrades([...subject.grades]);
  };

  const handleUpdateSubject = () => {
    if (!newSubjectName.trim()) {
      alert('Please enter a subject name');
      return;
    }
    if (selectedGrades.length === 0) {
      alert('Please select at least one grade for this subject');
      return;
    }

    updateSubject(editingSubject, {
      name: newSubjectName.trim(),
      icon: newSubjectIcon,
      grades: selectedGrades
    });
    setEditingSubject(null);
    setNewSubjectName('');
    setNewSubjectId('');
    setNewSubjectIcon('bi-book');
    setSelectedGrades([]);
    alert(`✅ Subject updated successfully!`);
  };

  const handleDeleteSubject = (subjectId) => {
    const subject = subjects[subjectId];
    if (window.confirm(`Are you sure you want to delete "${subject.name}"?\n\nThis will remove the subject from all grades. This action cannot be undone.`)) {
      deleteSubject(subjectId);
      alert(`✅ Subject "${subject.name}" deleted successfully!`);
    }
  };

  const cancelEdit = () => {
    setEditingSubject(null);
    setNewSubjectName('');
    setNewSubjectId('');
    setNewSubjectIcon('bi-book');
    setSelectedGrades([]);
  };

  return (
    <div className="row g-4">
      {/* Add/Edit Subject Form */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5>
              <i className="bi bi-plus-circle me-2"></i>
              {editingSubject ? 'Edit Subject' : 'Add New Subject'}
            </h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Subject Name <span className="text-danger">*</span></label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Physics, Chemistry, Biology"
                value={newSubjectName}
                onChange={(e) => setNewSubjectName(e.target.value)}
              />
            </div>

            {!editingSubject && (
              <div className="mb-3">
                <label className="form-label">Subject ID <span className="text-danger">*</span></label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g., physics, chemistry (lowercase, no spaces)"
                  value={newSubjectId}
                  onChange={(e) => setNewSubjectId(e.target.value.toLowerCase().replace(/\s+/g, ''))}
                />
                <small className="form-text text-muted">
                  Used internally. Lowercase, no spaces (e.g., "physics", "chemistry")
                </small>
              </div>
            )}

            <div className="mb-3">
              <label className="form-label">Icon</label>
              <select
                className="form-select"
                value={newSubjectIcon}
                onChange={(e) => setNewSubjectIcon(e.target.value)}
              >
                {commonIcons.map(icon => (
                  <option key={icon.value} value={icon.value}>
                    {icon.label}
                  </option>
                ))}
              </select>
              <small className="form-text text-muted">
                Preview: <i className={newSubjectIcon}></i>
              </small>
            </div>

            <div className="mb-3">
              <label className="form-label">Select Grades <span className="text-danger">*</span></label>
              <div className="border rounded p-3" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                {Object.keys(grades).map(gradeId => (
                  <div key={gradeId} className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id={`grade-${gradeId}`}
                      checked={selectedGrades.includes(gradeId)}
                      onChange={() => handleGradeToggle(gradeId)}
                    />
                    <label className="form-check-label" htmlFor={`grade-${gradeId}`}>
                      {grades[gradeId].display || grades[gradeId].name}
                    </label>
                  </div>
                ))}
              </div>
              <small className="form-text text-muted">
                {selectedGrades.length > 0 
                  ? `Selected: ${selectedGrades.map(g => grades[g]?.display || grades[g]?.name).join(', ')}`
                  : 'Select at least one grade where this subject should appear'}
              </small>
            </div>

            <div className="d-flex gap-2">
              {editingSubject ? (
                <>
                  <button 
                    className="btn btn-primary"
                    onClick={handleUpdateSubject}
                    disabled={!newSubjectName.trim() || selectedGrades.length === 0}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    Update Subject
                  </button>
                  <button 
                    className="btn btn-outline-secondary"
                    onClick={cancelEdit}
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancel
                  </button>
                </>
              ) : (
                <button 
                  className="btn btn-primary"
                  onClick={handleAddSubject}
                  disabled={!newSubjectName.trim() || !newSubjectId.trim() || selectedGrades.length === 0}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Subject
                </button>
              )}
            </div>

            <div className="alert alert-info mt-3 mb-0">
              <small>
                <i className="bi bi-info-circle me-1"></i>
                <strong>Important:</strong> The subject will only appear in the grades you select. 
                For example, if you add "Physics" and only select Grade 10, it will only show in Grade 10, not in other grades.
              </small>
            </div>
          </div>
        </div>
      </div>

      {/* Existing Subjects List */}
      <div className="col-md-6">
        <div className="card">
          <div className="card-header">
            <h5>
              <i className="bi bi-list-ul me-2"></i>
              Existing Subjects ({Object.keys(subjects).length})
            </h5>
          </div>
          <div className="card-body">
            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {Object.keys(subjects).length === 0 ? (
                <p className="text-muted text-center">No subjects added yet.</p>
              ) : (
                <div className="list-group">
                  {Object.keys(subjects).map(subjectId => {
                    const subject = subjects[subjectId];
                    return (
                      <div key={subjectId} className="list-group-item">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <div className="d-flex align-items-center mb-2">
                              <i className={`${subject.icon} me-2 text-primary`} style={{ fontSize: '1.5rem' }}></i>
                              <h6 className="mb-0">{subject.name}</h6>
                            </div>
                            <small className="text-muted d-block mb-1">
                              ID: <code>{subjectId}</code>
                            </small>
                            <small className="text-muted d-block">
                              Grades: {subject.grades.length > 0 
                                ? subject.grades.map(g => grades[g]?.display || grades[g]?.name).join(', ')
                                : 'None (will not appear anywhere)'
                              }
                            </small>
                          </div>
                          <div className="d-flex gap-1">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => handleEditSubject(subjectId)}
                              title="Edit subject"
                            >
                              <i className="bi bi-pencil"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDeleteSubject(subjectId)}
                              title="Delete subject"
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { getStats, exportData, subjects, grades, addSubject, updateSubject, deleteSubject } = useData();
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedGrade, setSelectedGrade] = useState('grade6');
  const [selectedSubject, setSelectedSubject] = useState('mathematics');
  const [selectedResourceType, setSelectedResourceType] = useState('textbook');
  const [selectedPaperType, setSelectedPaperType] = useState('term'); // 'term' or 'chapter'
  const [selectedPaperCategory, setSelectedPaperCategory] = useState('term1'); // For term papers: term1, term2, term3. For chapter papers: chapter name
  const [selectedLanguages, setSelectedLanguages] = useState(['english']);
  const [fileList, setFileList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);
  const [driveLink, setDriveLink] = useState('');
  const [resourceTitle, setResourceTitle] = useState('');
  const [resourceDescription, setResourceDescription] = useState('');
  const [schoolName, setSchoolName] = useState('');
  
  const stats = getStats();

  // Ensure selectedSubject exists in subjects, otherwise use first available
  useEffect(() => {
    if (subjects && Object.keys(subjects).length > 0) {
      if (!subjects[selectedSubject]) {
        setSelectedSubject(Object.keys(subjects)[0]);
      }
    }
  }, [subjects, selectedSubject]);

  // Load uploaded files from localStorage on component mount
  useEffect(() => {
    const savedFiles = localStorage.getItem('teachingTorch_uploadedFiles');
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
    
    const savedRecent = localStorage.getItem('teachingTorch_recentUploads');
    if (savedRecent) {
      setRecentUploads(JSON.parse(savedRecent));
    }
  }, []);

  // Check if admin is logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem('adminLoggedIn');
    if (!isLoggedIn) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    navigate('/');
  };

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    setFileList(files);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const files = Array.from(event.dataTransfer.files);
    setFileList(files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleLanguageToggle = (language) => {
    setSelectedLanguages(prev => 
      prev.includes(language) 
        ? prev.filter(lang => lang !== language)
        : [...prev, language]
    );
  };

  const saveToLocalStorage = (files) => {
    const currentFiles = JSON.parse(localStorage.getItem('teachingTorch_uploadedFiles') || '[]');
    const updatedFiles = [...currentFiles, ...files];
    localStorage.setItem('teachingTorch_uploadedFiles', JSON.stringify(updatedFiles));
    setUploadedFiles(updatedFiles);

    // Update recent uploads (keep last 10)
    const recentFiles = files.slice(0, 10);
    const currentRecent = JSON.parse(localStorage.getItem('teachingTorch_recentUploads') || '[]');
    const updatedRecent = [...recentFiles, ...currentRecent].slice(0, 10);
    localStorage.setItem('teachingTorch_recentUploads', JSON.stringify(updatedRecent));
    setRecentUploads(updatedRecent);
  };

  const handleAddDriveLink = () => {
    if (!driveLink.trim()) {
      alert('Please enter a Google Drive link or YouTube URL');
      return;
    }

    // Check if it's a video resource type
    if (selectedResourceType === 'videos') {
      // Allow YouTube links for videos
      if (!isYouTubeLink(driveLink) && !isGoogleDriveLink(driveLink)) {
        alert('Please enter a valid YouTube URL or Google Drive link.\n\nYouTube: https://www.youtube.com/watch?v=VIDEO_ID\nGoogle Drive: https://drive.google.com/file/d/FILE_ID/view');
        return;
      }
    } else {
      // For other resources, only Google Drive
      if (!isGoogleDriveLink(driveLink)) {
        alert('Please enter a valid Google Drive link.\n\nExample: https://drive.google.com/file/d/FILE_ID/view');
        return;
      }
    }

    if (selectedLanguages.length === 0) {
      alert('Please select at least one language');
      return;
    }

    if (!resourceTitle.trim()) {
      alert('Please enter a title for this resource');
      return;
    }

    // Extract file/video ID to verify
    let fileId = null;
    if (selectedResourceType === 'videos' && isYouTubeLink(driveLink)) {
      fileId = extractYouTubeId(driveLink);
      if (!fileId) {
        alert('Could not extract video ID from the YouTube URL. Please check the link format.');
        return;
      }
    } else {
      fileId = extractFileId(driveLink);
      if (!fileId) {
        alert('Could not extract file ID from the Google Drive link. Please check the link format.');
        return;
      }
    }

    // Process the resource
    const processedResource = {
      id: Date.now().toString() + Math.random(),
      driveLink: selectedResourceType === 'videos' && isYouTubeLink(driveLink) ? null : driveLink.trim(),
      youtubeUrl: selectedResourceType === 'videos' && isYouTubeLink(driveLink) ? driveLink.trim() : null,
      url: driveLink.trim(), // General URL field
      fileId: fileId,
      title: resourceTitle.trim(),
      description: resourceDescription.trim() || '',
      name: resourceTitle.trim(),
      grade: selectedGrade,
      subject: selectedSubject,
      resourceType: selectedResourceType,
      languages: selectedLanguages,
      uploadDate: new Date().toISOString(),
      addedBy: 'admin',
      // For papers, add paper type and category
      ...(selectedResourceType === 'papers' && {
        paperType: selectedPaperType,
        paperCategory: selectedPaperCategory,
        school: schoolName.trim() || 'Unknown School'
      })
    };

    // Save to localStorage
    saveToLocalStorage([processedResource]);
    
    // Success notification
    alert(`✅ Successfully added resource!\n\n` +
          `Title: ${resourceTitle}\n` +
          `Grade: ${selectedGrade}\n` +
          `Subject: ${selectedSubject}\n` +
          `Type: ${selectedResourceType}\n` +
          `Languages: ${selectedLanguages.join(', ')}\n\n` +
          `Make sure the Google Drive file is set to "Anyone with the link can view"`);
    
    // Reset form
    setDriveLink('');
    setResourceTitle('');
    setResourceDescription('');
    setSelectedLanguages(['english']);
    setSchoolName('');
    if (selectedResourceType === 'papers') {
      setSelectedPaperType('term');
      setSelectedPaperCategory('term1');
    }
  };

  const handleDeleteSelected = () => {
    if (window.confirm('Are you sure you want to delete all uploaded files? This action cannot be undone.')) {
      localStorage.removeItem('teachingTorch_uploadedFiles');
      localStorage.removeItem('teachingTorch_recentUploads');
      setUploadedFiles([]);
      setRecentUploads([]);
      alert('✅ All files deleted successfully!');
    }
  };

  const handleDeleteResource = (resourceId) => {
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      const updatedFiles = uploadedFiles.filter(file => file.id !== resourceId);
      localStorage.setItem('teachingTorch_uploadedFiles', JSON.stringify(updatedFiles));
      setUploadedFiles(updatedFiles);
      
      // Update recent uploads
      const updatedRecent = recentUploads.filter(file => file.id !== resourceId);
      localStorage.setItem('teachingTorch_recentUploads', JSON.stringify(updatedRecent));
      setRecentUploads(updatedRecent);
      
      alert('✅ Resource deleted successfully!');
    }
  };

  const handleRefresh = () => {
    // Reload from localStorage
    const savedFiles = localStorage.getItem('teachingTorch_uploadedFiles');
    if (savedFiles) {
      setUploadedFiles(JSON.parse(savedFiles));
    }
    
    const savedRecent = localStorage.getItem('teachingTorch_recentUploads');
    if (savedRecent) {
      setRecentUploads(JSON.parse(savedRecent));
    }
    
    alert('📁 File manager refreshed!');
  };

  // Group uploaded files by grade/subject/type
  const getFileGroups = () => {
    const groups = {};
    uploadedFiles.forEach(file => {
      const key = `${file.grade}/${file.subject}/${file.resourceType}`;
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(file);
    });
    return groups;
  };

  const fileGroups = getFileGroups();

  return (
    <div className="admin-dashboard">
      {/* Admin Header */}
      <header className="page-header">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center">
            <div className="flex-grow-1 text-center">
              <h1 className="display-4 fw-bold">Admin Dashboard</h1>
              <p className="lead">Teaching Torch Administration Panel</p>
            </div>
            <button onClick={handleLogout} className="btn btn-outline-light">
              <i className="bi bi-box-arrow-right me-2"></i>
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <section className="py-3 bg-light">
        <div className="container">
          <ul className="nav nav-tabs">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
                onClick={() => setActiveTab('overview')}
              >
                <i className="bi bi-speedometer2 me-2"></i>
                Overview
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'resources' ? 'active' : ''}`}
                onClick={() => setActiveTab('resources')}
              >
                <i className="bi bi-folder me-2"></i>
                Manage Resources
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'subjects' ? 'active' : ''}`}
                onClick={() => setActiveTab('subjects')}
              >
                <i className="bi bi-book me-2"></i>
                Manage Subjects
              </button>
            </li>
          </ul>
        </div>
      </section>

      {/* Dashboard Content */}
      <section className="py-5">
        <div className="container">
          {activeTab === 'overview' && (
            <>
              {/* Statistics Cards */}
              <div className="row g-4 mb-5">
                <div className="col-md-3">
                  <div className="card text-center h-100">
                    <div className="card-body">
                      <i className="bi bi-book text-primary" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3">{stats.totalGrades}</h3>
                      <p className="text-muted">Grade Levels</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card text-center h-100">
                    <div className="card-body">
                      <i className="bi bi-translate text-success" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3">{stats.totalLanguages}</h3>
                      <p className="text-muted">Languages</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card text-center h-100">
                    <div className="card-body">
                      <i className="bi bi-file-earmark text-info" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3">{uploadedFiles.length}</h3>
                      <p className="text-muted">Uploaded Files</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className="card text-center h-100">
                    <div className="card-body">
                      <i className="bi bi-clock text-warning" style={{ fontSize: '3rem' }}></i>
                      <h3 className="mt-3">24/7</h3>
                      <p className="text-muted">Access</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h5>Quick Actions</h5>
                    </div>
                    <div className="card-body">
                      <div className="d-grid gap-2">
                        <button 
                          onClick={exportData}
                          className="btn btn-primary"
                        >
                          <i className="bi bi-download me-2"></i>
                          Export All Data
                        </button>
                        <Link to="/" className="btn btn-secondary">
                          <i className="bi bi-house me-2"></i>
                          View Website
                        </Link>
                        <button 
                          className="btn btn-success"
                          onClick={() => setActiveTab('resources')}
                        >
                          <i className="bi bi-folder-plus me-2"></i>
                          Manage Resources ({uploadedFiles.length} files)
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-header">
                      <h5>Upload Summary</h5>
                    </div>
                    <div className="card-body">
                      {uploadedFiles.length > 0 ? (
                        <div>
                          <p>Total files uploaded: <strong>{uploadedFiles.length}</strong></p>
                          <p>Storage locations: <strong>{Object.keys(fileGroups).length}</strong></p>
                          <p>Recent uploads: <strong>{recentUploads.length}</strong></p>
                        </div>
                      ) : (
                        <p className="text-muted">No files uploaded yet. Use the Manage Resources tab to upload files.</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'resources' && (
            <div className="row g-4">
              {/* Upload Files Section */}
              <div className="col-md-8">
                <div className="card">
                  <div className="card-header">
                    <h5>
                      <i className="bi bi-cloud-upload me-2"></i>
                      Upload Files
                    </h5>
                  </div>
                  <div className="card-body">
                    {/* Selection Controls */}
                    <div className="row g-3 mb-4">
                      <div className="col-md-4">
                        <label className="form-label">Select Grade</label>
                        <select 
                          className="form-select"
                          value={selectedGrade}
                          onChange={(e) => setSelectedGrade(e.target.value)}
                        >
                          <option value="grade6">Grade 6</option>
                          <option value="grade7">Grade 7</option>
                          <option value="grade8">Grade 8</option>
                          <option value="grade9">Grade 9</option>
                          <option value="grade10">Grade 10</option>
                          <option value="grade11">Grade 11</option>
                          <option value="al">Advanced Level</option>
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Select Subject</label>
                        <select 
                          className="form-select"
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                        >
                          {Object.keys(subjects).map(subjectId => (
                            <option key={subjectId} value={subjectId}>
                              {subjects[subjectId].name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">Resource Type</label>
                        <select 
                          className="form-select"
                          value={selectedResourceType}
                          onChange={(e) => {
                            setSelectedResourceType(e.target.value);
                            // Reset paper-specific fields when changing resource type
                            if (e.target.value !== 'papers') {
                              setSelectedPaperType('term');
                              setSelectedPaperCategory('term1');
                              setSchoolName('');
                            }
                          }}
                        >
                          <option value="textbook">Textbook</option>
                          <option value="notes">Notes</option>
                          <option value="papers">Past Papers</option>
                          <option value="videos">Videos</option>
                        </select>
                      </div>
                    </div>

                    {/* Paper Type Selection (only for papers) */}
                    {selectedResourceType === 'papers' && (
                      <div className="row g-3 mb-4">
                        <div className="col-md-6">
                          <label className="form-label">Paper Type</label>
                          <select 
                            className="form-select"
                            value={selectedPaperType}
                            onChange={(e) => {
                              setSelectedPaperType(e.target.value);
                              // Reset category when changing paper type
                              if (e.target.value === 'term') {
                                setSelectedPaperCategory('term1');
                              } else {
                                setSelectedPaperCategory('chapter1');
                              }
                            }}
                          >
                            <option value="term">Term Papers</option>
                            <option value="chapter">Chapter Papers</option>
                          </select>
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            {selectedPaperType === 'term' ? 'Term' : 'Chapter'}
                          </label>
                          {selectedPaperType === 'term' ? (
                            <select 
                              className="form-select"
                              value={selectedPaperCategory}
                              onChange={(e) => setSelectedPaperCategory(e.target.value)}
                            >
                              <option value="term1">1st Term</option>
                              <option value="term2">2nd Term</option>
                              <option value="term3">3rd Term</option>
                            </select>
                          ) : (
                            <input
                              type="text"
                              className="form-control"
                              placeholder="e.g., Chapter 1, Chapter 2, etc."
                              value={selectedPaperCategory}
                              onChange={(e) => setSelectedPaperCategory(e.target.value)}
                            />
                          )}
                        </div>
                        <div className="col-md-12">
                          <label className="form-label">School Name (Optional)</label>
                          <input
                            type="text"
                            className="form-control"
                            placeholder="e.g., Royal College, Ananda College"
                            value={schoolName}
                            onChange={(e) => setSchoolName(e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {/* Language Selection */}
                    <div className="mb-4">
                      <label className="form-label">Select Language(s)</label>
                      <div className="d-flex gap-2">
                        <button
                          type="button"
                          className={`btn ${selectedLanguages.includes('sinhala') ? 'btn-danger' : 'btn-outline-danger'}`}
                          onClick={() => handleLanguageToggle('sinhala')}
                        >
                          සිංහල
                        </button>
                        <button
                          type="button"
                          className={`btn ${selectedLanguages.includes('tamil') ? 'btn-success' : 'btn-outline-success'}`}
                          onClick={() => handleLanguageToggle('tamil')}
                        >
                          தமிழ்
                        </button>
                        <button
                          type="button"
                          className={`btn ${selectedLanguages.includes('english') ? 'btn-primary' : 'btn-outline-primary'}`}
                          onClick={() => handleLanguageToggle('english')}
                        >
                          English
                        </button>
                      </div>
                    </div>

                    {/* Link Input (Google Drive or YouTube) */}
                    <div className="mb-4">
                      <label className="form-label">
                        <i className="bi bi-link-45deg me-2"></i>
                        {selectedResourceType === 'videos' ? 'YouTube URL or Google Drive Link' : 'Google Drive Link'} <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder={selectedResourceType === 'videos' 
                          ? "https://www.youtube.com/watch?v=VIDEO_ID or Google Drive link"
                          : "https://drive.google.com/file/d/FILE_ID/view"}
                        value={driveLink}
                        onChange={(e) => setDriveLink(e.target.value)}
                      />
                      <div className="form-text">
                        <small>
                          <i className="bi bi-info-circle me-1"></i>
                          {selectedResourceType === 'videos' 
                            ? 'Paste YouTube URL or Google Drive link. For YouTube: Use the full watch URL.'
                            : 'Paste the Google Drive share link here. Make sure the file is set to "Anyone with the link can view"'}
                        </small>
                      </div>
                      {driveLink && selectedResourceType === 'videos' && isYouTubeLink(driveLink) && (
                        <div className="alert alert-success mt-2 mb-0">
                          <small>
                            <i className="bi bi-youtube me-1"></i>
                            Valid YouTube URL detected! Video ID: {extractYouTubeId(driveLink)}
                          </small>
                        </div>
                      )}
                      {driveLink && selectedResourceType === 'videos' && !isYouTubeLink(driveLink) && !isGoogleDriveLink(driveLink) && (
                        <div className="alert alert-warning mt-2 mb-0">
                          <small>
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            Please enter a valid YouTube URL or Google Drive link
                          </small>
                        </div>
                      )}
                      {driveLink && selectedResourceType !== 'videos' && !isGoogleDriveLink(driveLink) && (
                        <div className="alert alert-warning mt-2 mb-0">
                          <small>
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            This doesn't look like a valid Google Drive link
                          </small>
                        </div>
                      )}
                      {driveLink && selectedResourceType !== 'videos' && isGoogleDriveLink(driveLink) && (
                        <div className="alert alert-success mt-2 mb-0">
                          <small>
                            <i className="bi bi-check-circle me-1"></i>
                            Valid Google Drive link detected! File ID: {extractFileId(driveLink)}
                          </small>
                        </div>
                      )}
                    </div>

                    {/* Resource Title */}
                    <div className="mb-4">
                      <label className="form-label">
                        <i className="bi bi-type me-2"></i>
                        Resource Title <span className="text-danger">*</span>
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="e.g., Grade 6 Mathematics Textbook - Sinhala"
                        value={resourceTitle}
                        onChange={(e) => setResourceTitle(e.target.value)}
                      />
                    </div>

                    {/* Resource Description (Optional) */}
                    <div className="mb-4">
                      <label className="form-label">
                        <i className="bi bi-card-text me-2"></i>
                        Description (Optional)
                      </label>
                      <textarea
                        className="form-control"
                        rows="3"
                        placeholder="Additional information about this resource..."
                        value={resourceDescription}
                        onChange={(e) => setResourceDescription(e.target.value)}
                      />
                    </div>

                    {/* Add Resource Button */}
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-primary"
                        onClick={handleAddDriveLink}
                        disabled={!driveLink.trim() || !resourceTitle.trim() || selectedLanguages.length === 0}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Add Resource
                      </button>
                      <button 
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setDriveLink('');
                          setResourceTitle('');
                          setResourceDescription('');
                          setSelectedLanguages(['english']);
                          setSchoolName('');
                          if (selectedResourceType === 'papers') {
                            setSelectedPaperType('term');
                            setSelectedPaperCategory('term1');
                          }
                        }}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Clear
                      </button>
                    </div>

                    {/* Instructions */}
                    <div className="alert alert-info mt-4">
                      <h6 className="mb-2">
                        <i className="bi bi-question-circle me-2"></i>
                        How to Add Resources:
                      </h6>
                      {selectedResourceType === 'videos' ? (
                        <ol className="mb-0 small">
                          <li><strong>For YouTube:</strong> Copy the video URL (e.g., https://www.youtube.com/watch?v=VIDEO_ID)</li>
                          <li><strong>For Google Drive:</strong> Upload video, share as "Anyone with the link", copy link</li>
                          <li>Paste the URL in the field above</li>
                          <li>Fill in title, description, and select language(s)</li>
                          <li>Click "Add Resource"</li>
                        </ol>
                      ) : (
                        <ol className="mb-0 small">
                          <li>Upload your PDF to Google Drive</li>
                          <li>Right-click the file → Share → Change to "Anyone with the link"</li>
                          <li>Copy the share link</li>
                          <li>Paste it in the field above</li>
                          <li>Fill in the title and select language(s)</li>
                          <li>Click "Add Resource"</li>
                        </ol>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* File Manager Section */}
              <div className="col-md-4">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5>
                      <i className="bi bi-folder me-2"></i>
                      File Manager
                    </h5>
                    <button className="btn btn-outline-primary btn-sm" onClick={handleRefresh}>
                      <i className="bi bi-arrow-clockwise"></i>
                    </button>
                  </div>
                  <div className="card-body">
                    <div className="file-list" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {uploadedFiles.length > 0 ? (
                        <div>
                          {uploadedFiles.slice().reverse().map((file) => (
                            <div key={file.id} className="d-flex justify-content-between align-items-center p-2 border-bottom">
                              <div className="flex-grow-1" style={{ minWidth: 0 }}>
                                <div className="d-flex align-items-center">
                                  <i className={`bi ${
                                    file.resourceType === 'textbook' ? 'bi-book' :
                                    file.resourceType === 'papers' ? 'bi-file-text' :
                                    file.resourceType === 'notes' ? 'bi-sticky' :
                                    'bi-play-circle'
                                  } me-2 text-primary`}></i>
                                  <small className="text-truncate" style={{ maxWidth: '150px' }} title={file.title || file.name}>
                                    {file.title || file.name}
                                  </small>
                                </div>
                                <small className="text-muted d-block">
                                  {file.grade} / {file.subject}
                                </small>
                              </div>
                              <button
                                className="btn btn-sm btn-outline-danger ms-2"
                                onClick={() => handleDeleteResource(file.id)}
                                title="Delete resource"
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted">
                          <i className="bi bi-folder-x" style={{ fontSize: '2rem' }}></i>
                          <p>No files uploaded yet</p>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 d-grid gap-2">
                      <button 
                        className="btn btn-outline-danger btn-sm" 
                        onClick={handleDeleteSelected}
                        disabled={uploadedFiles.length === 0}
                      >
                        <i className="bi bi-trash me-2"></i>
                        Delete All Files
                      </button>
                      <button className="btn btn-outline-info btn-sm" onClick={handleRefresh}>
                        <i className="bi bi-arrow-clockwise me-2"></i>
                        Refresh
                      </button>
                    </div>
                  </div>
                </div>

                {/* Recent Uploads - Removed to fix overlapping, info is in File Manager */}
              </div>
            </div>
          )}

          {activeTab === 'subjects' && (
            <SubjectManagement 
              subjects={subjects}
              grades={grades}
              addSubject={addSubject}
              updateSubject={updateSubject}
              deleteSubject={deleteSubject}
            />
          )}

          {/* Info Section */}
          <div className="alert alert-info mt-4">
            <h5><i className="bi bi-info-circle me-2"></i>Google Drive Integration</h5>
            <p className="mb-0">
              {activeTab === 'overview' ? 
                'This dashboard provides an overview of resources and platform statistics. Resources are stored as Google Drive links.' :
                activeTab === 'subjects' ?
                '🔹 Subjects are grade-specific. When you add a subject, select which grades it should appear in.\n🔹 A subject will only show up in the grades you select.\n🔹 You can update a subject\'s grade associations at any time.' :
                '🔹 Resources are stored as Google Drive share links in localStorage.\n🔹 Users can view PDFs directly in the browser or download them.\n🔹 Make sure all Google Drive files are set to "Anyone with the link can view" for public access.\n🔹 No backend server needed - everything works client-side!'
              }
            </p>
          </div>
        </div>
      </section>

      <style jsx>{`
        .upload-area {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .upload-area:hover {
          background-color: rgba(25, 135, 84, 0.05);
          border-color: var(--success) !important;
        }
        
        .nav-tabs .nav-link {
          color: #212529 !important;
          border: none;
          background: none;
        }
        
        .nav-tabs .nav-link.active {
          color: var(--primary) !important;
          background-color: var(--card-bg);
          border-bottom: 2px solid var(--primary);
          font-weight: 600;
        }
        
        .nav-tabs .nav-link:hover {
          color: var(--primary) !important;
          background-color: rgba(59, 130, 246, 0.08);
        }

        .recent-uploads {
          max-height: 200px;
          overflow-y: auto;
        }
      `}</style>
    </div>
  );
};

export default AdminDashboard;