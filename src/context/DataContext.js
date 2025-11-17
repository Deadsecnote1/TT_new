import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';

// Create Data Context
const DataContext = createContext();

// Initial State
const initialState = {
  grades: {},
  subjects: {},
  resources: {},
  videos: {},
  settings: {},
  loading: false,
  error: null
};

// Data Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'INITIALIZE_DATA':
      return { ...state, ...action.payload, loading: false };
    
    case 'ADD_TEXTBOOK':
      const { gradeId, subjectId, medium, fileData } = action.payload;
      return {
        ...state,
        resources: {
          ...state.resources,
          [gradeId]: {
            ...state.resources[gradeId],
            [subjectId]: {
              ...state.resources[gradeId]?.[subjectId],
              textbooks: {
                ...state.resources[gradeId]?.[subjectId]?.textbooks,
                [medium]: {
                  ...fileData,
                  language: medium,
                  uploadDate: new Date().toISOString()
                }
              }
            }
          }
        }
      };
    
    case 'ADD_PAPER':
      const { gradeId: gId, subjectId: sId, paperType, paperCategory, fileData: fData, schoolName, language } = action.payload;
      const paperInfo = {
        id: Date.now().toString() + Math.random(),
        ...fData,
        school: schoolName || 'Unknown School',
        language: language || 'english',
        uploadDate: new Date().toISOString()
      };
      
      const currentResources = state.resources[gId]?.[sId] || { papers: { terms: { term1: [], term2: [], term3: [] }, chapters: {} } };
      
      if (paperType === 'term') {
        return {
          ...state,
          resources: {
            ...state.resources,
            [gId]: {
              ...state.resources[gId],
              [sId]: {
                ...currentResources,
                papers: {
                  ...currentResources.papers,
                  terms: {
                    ...currentResources.papers.terms,
                    [paperCategory]: [...(currentResources.papers.terms[paperCategory] || []), paperInfo]
                  }
                }
              }
            }
          }
        };
      } else {
        return {
          ...state,
          resources: {
            ...state.resources,
            [gId]: {
              ...state.resources[gId],
              [sId]: {
                ...currentResources,
                papers: {
                  ...currentResources.papers,
                  chapters: {
                    ...currentResources.papers.chapters,
                    [paperCategory]: [...(currentResources.papers.chapters[paperCategory] || []), paperInfo]
                  }
                }
              }
            }
          }
        };
      }
    
    case 'ADD_VIDEO':
      const { gradeId: videoGradeId, subjectId: videoSubjectId, videoData } = action.payload;
      const video = {
        id: Date.now().toString(),
        ...videoData,
        language: videoData.language || 'english',
        addedDate: new Date().toISOString()
      };
      
      return {
        ...state,
        videos: {
          ...state.videos,
          [videoGradeId]: {
            ...state.videos[videoGradeId],
            [videoSubjectId]: [...(state.videos[videoGradeId]?.[videoSubjectId] || []), video]
          }
        }
      };
    
    case 'DELETE_RESOURCE':
      // Implementation for delete operations
      return state;
    
    case 'LOG_ACTIVITY':
      const newActivity = {
        message: action.payload,
        timestamp: new Date().toISOString(),
        id: Date.now()
      };
      
      const activities = state.settings.activities || [];
      const updatedActivities = [newActivity, ...activities].slice(0, 50);
      
      return {
        ...state,
        settings: {
          ...state.settings,
          activities: updatedActivities,
          lastUpdated: new Date().toISOString()
        }
      };
    
    case 'ADD_SUBJECT': {
      const { subjectId, subjectName, subjectIcon, subjectGrades, subjectPriorities } = action.payload;
      return {
        ...state,
        subjects: {
          ...state.subjects,
          [subjectId]: {
            name: subjectName,
            icon: subjectIcon || 'bi-book',
            grades: subjectGrades || [],
            priorities: subjectPriorities || {}
          }
        }
      };
    }
    
    case 'UPDATE_SUBJECT': {
      const { subjectId: updateSubjectId, updates } = action.payload;
      return {
        ...state,
        subjects: {
          ...state.subjects,
          [updateSubjectId]: {
            ...state.subjects[updateSubjectId],
            ...updates
          }
        }
      };
    }
    
    case 'DELETE_SUBJECT': {
      const { subjectId: deleteSubjectId } = action.payload;
      const newSubjects = { ...state.subjects };
      delete newSubjects[deleteSubjectId];
      return {
        ...state,
        subjects: newSubjects
      };
    }
    
    default:
      return state;
  }
};

// Data Provider Component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Get default data structure (stable function)
  const getDefaultData = useCallback(() => ({
    grades: {
      'grade6': { name: 'Grade 6', display: 'Grade 6', active: true },
      'grade7': { name: 'Grade 7', display: 'Grade 7', active: true },
      'grade8': { name: 'Grade 8', display: 'Grade 8', active: true },
      'grade9': { name: 'Grade 9', display: 'Grade 9', active: true },
      'grade10': { name: 'Grade 10', display: 'Grade 10', active: true },
      'grade11': { name: 'Grade 11', display: 'Grade 11', active: true },
      'al': { name: 'Advanced Level', display: 'A/L', active: true }
    },
    subjects: {
      'english': {
        name: 'English',
        icon: 'bi-globe',
        grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11', 'al'],
        priorities: {}
      },
      'science': {
        name: 'Science',
        icon: 'bi-flask',
        grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11', 'al'],
        priorities: {}
      },
      'mathematics': {
        name: 'Mathematics',
        icon: 'bi-calculator',
        grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11', 'al'],
        priorities: {}
      },
      'history': {
        name: 'History',
        icon: 'bi-clock-history',
        grades: ['grade6', 'grade7', 'grade8', 'grade9', 'grade10', 'grade11', 'al'],
        priorities: {}
      }
    },
    resources: {},
    videos: {},
    settings: {
      siteName: 'Teaching Torch',
      adminPassword: 'admin123',
      lastUpdated: new Date().toISOString(),
      activities: []
    }
  }), []);

  // Initialize data on mount only
  useEffect(() => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const savedData = localStorage.getItem('teachingTorchData');
      const dataVersion = localStorage.getItem('teachingTorchDataVersion') || '1.0.0';
      const currentVersion = '2.0.0'; // Increment this when you want to force refresh
      const forceRefresh = localStorage.getItem('teachingTorchForceRefresh') === 'true';
      const lastClearTime = localStorage.getItem('teachingTorchLastClearTime');
      const now = Date.now();
      
      // Check if we need to clear cache (version mismatch or force refresh)
      // Also clear if it's been more than 1 hour since last clear (helps with mobile caching)
      const shouldClearCache = dataVersion !== currentVersion || 
                               forceRefresh ||
                               (lastClearTime && (now - parseInt(lastClearTime)) > 3600000); // 1 hour
      
      if (shouldClearCache && savedData) {
        console.log('Clearing old cache due to version mismatch or force refresh');
        // Clear all teachingTorch related data
        localStorage.removeItem('teachingTorchData');
        localStorage.removeItem('teachingTorchForceRefresh');
        localStorage.removeItem('teachingTorch_uploadedFiles');
        localStorage.removeItem('teachingTorch_recentUploads');
        localStorage.setItem('teachingTorchLastClearTime', now.toString());
        // Don't reload here - let the cache-busting script in index.html handle it
      }
      
      const finalData = shouldClearCache ? null : savedData;
      
      if (finalData) {
        const parsedData = JSON.parse(finalData);
        
        // Migration: Ensure all subjects have priorities field for backward compatibility
        if (parsedData.subjects) {
          Object.keys(parsedData.subjects).forEach(subjectId => {
            if (!parsedData.subjects[subjectId].priorities) {
              parsedData.subjects[subjectId].priorities = {};
            }
          });
        }
        
        dispatch({ type: 'INITIALIZE_DATA', payload: parsedData });
      } else {
        const defaultData = getDefaultData();
        dispatch({ type: 'INITIALIZE_DATA', payload: defaultData });
        // Save default data with version
        localStorage.setItem('teachingTorchData', JSON.stringify(defaultData));
        localStorage.setItem('teachingTorchDataVersion', currentVersion);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      // If there's an error parsing, clear the corrupted data
      localStorage.removeItem('teachingTorchData');
      const defaultData = getDefaultData();
      dispatch({ type: 'INITIALIZE_DATA', payload: defaultData });
      localStorage.setItem('teachingTorchData', JSON.stringify(defaultData));
      localStorage.setItem('teachingTorchDataVersion', '2.0.0');
    }
  }, [getDefaultData]); // Only depend on getDefaultData

  // Save data whenever state changes (but not during initialization)
  useEffect(() => {
    if (!state.loading && Object.keys(state.grades).length > 0) {
      try {
        localStorage.setItem('teachingTorchData', JSON.stringify(state));
        localStorage.setItem('teachingTorchDataVersion', '2.0.0');
      } catch (error) {
        console.error('Error saving data:', error);
      }
    }
  }, [state.loading, state.grades, state.subjects, state.resources, state.videos, state.settings]);

  // Action creators
  const addTextbook = useCallback((gradeId, subjectId, medium, fileData) => {
    dispatch({
      type: 'ADD_TEXTBOOK',
      payload: { gradeId, subjectId, medium, fileData }
    });
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: `Added ${medium} textbook for ${state.subjects[subjectId]?.name} - ${state.grades[gradeId]?.display}`
    });
  }, [state.subjects, state.grades]);

  const addPaper = useCallback((gradeId, subjectId, paperType, paperCategory, fileData, schoolName = '', language = 'english') => {
    dispatch({
      type: 'ADD_PAPER',
      payload: { gradeId, subjectId, paperType, paperCategory, fileData, schoolName, language }
    });
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: `Added ${language} ${paperType} paper (${paperCategory}) from ${schoolName || 'Unknown School'}`
    });
  }, []);

  const addVideo = useCallback((gradeId, subjectId, videoData) => {
    dispatch({
      type: 'ADD_VIDEO',
      payload: { gradeId, subjectId, videoData }
    });
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: `Added ${videoData.language || 'english'} video: ${videoData.title}`
    });
  }, []);

  const logActivity = useCallback((message) => {
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: message
    });
  }, []);

  const addSubject = useCallback((subjectId, subjectName, subjectIcon, subjectGrades, subjectPriorities = {}) => {
    dispatch({
      type: 'ADD_SUBJECT',
      payload: { subjectId, subjectName, subjectIcon, subjectGrades, subjectPriorities }
    });
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: `Added subject: ${subjectName} for grades: ${subjectGrades.join(', ')}`
    });
  }, []);

  const updateSubject = useCallback((subjectId, updates) => {
    dispatch({
      type: 'UPDATE_SUBJECT',
      payload: { subjectId, updates }
    });
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: `Updated subject: ${state.subjects[subjectId]?.name || subjectId}`
    });
  }, [state.subjects]);

  const deleteSubject = useCallback((subjectId) => {
    const subjectName = state.subjects[subjectId]?.name || subjectId;
    dispatch({
      type: 'DELETE_SUBJECT',
      payload: { subjectId }
    });
    dispatch({
      type: 'LOG_ACTIVITY',
      payload: `Deleted subject: ${subjectName}`
    });
  }, [state.subjects]);

  // Utility functions
  const getSubjectsForGrade = useCallback((gradeId) => {
    // First, collect all subjects for this grade with their priorities
    const subjectEntries = [];
    Object.keys(state.subjects).forEach(subjectId => {
      const subject = state.subjects[subjectId];
      if (subject.grades.includes(gradeId)) {
        // Get priority for this grade (default to 999 if not set, so unprioritized subjects appear last)
        const priority = subject.priorities?.[gradeId] ?? 999;
        subjectEntries.push([subjectId, subject, priority]);
      }
    });
    
    // Sort by priority (lower number = higher priority, appears first)
    subjectEntries.sort((a, b) => {
      // First sort by priority
      if (a[2] !== b[2]) {
        return a[2] - b[2];
      }
      // If priorities are equal, sort alphabetically by name
      return a[1].name.localeCompare(b[1].name);
    });
    
    // Build object in sorted order (JavaScript preserves insertion order for string keys)
    const subjects = {};
    subjectEntries.forEach(([subjectId, subject]) => {
      subjects[subjectId] = subject;
    });
    
    return subjects;
  }, [state.subjects]);

  const getResources = useCallback((gradeId, subjectId) => {
    return state.resources[gradeId]?.[subjectId] || {
      textbooks: {},
      papers: { 
        terms: { term1: [], term2: [], term3: [] }, 
        chapters: {} 
      },
      notes: {}
    };
  }, [state.resources]);

  const getVideos = useCallback((gradeId, subjectId) => {
    return state.videos[gradeId]?.[subjectId] || [];
  }, [state.videos]);

  const getStats = useCallback(() => {
    const stats = {
      totalGrades: Object.keys(state.grades).length,
      totalSubjects: Object.keys(state.subjects).length,
      totalResources: 0,
      totalVideos: 0,
      languageBreakdown: {
        sinhala: 0,
        tamil: 0,
        english: 0
      }
    };

    // Count resources
    Object.keys(state.resources).forEach(gradeId => {
      Object.keys(state.resources[gradeId]).forEach(subjectId => {
        const resources = state.resources[gradeId][subjectId];
        
        // Count textbooks
        if (resources.textbooks) {
          Object.keys(resources.textbooks).forEach(medium => {
            stats.totalResources++;
            if (stats.languageBreakdown[medium] !== undefined) {
              stats.languageBreakdown[medium]++;
            }
          });
        }
        
        // Count papers
        if (resources.papers) {
          if (resources.papers.terms) {
            Object.keys(resources.papers.terms).forEach(term => {
              const termPapers = resources.papers.terms[term];
              if (Array.isArray(termPapers)) {
                termPapers.forEach(paper => {
                  stats.totalResources++;
                  if (paper.language && stats.languageBreakdown[paper.language] !== undefined) {
                    stats.languageBreakdown[paper.language]++;
                  }
                });
              }
            });
          }
          
          if (resources.papers.chapters) {
            Object.keys(resources.papers.chapters).forEach(chapter => {
              const chapterPapers = resources.papers.chapters[chapter];
              if (Array.isArray(chapterPapers)) {
                chapterPapers.forEach(paper => {
                  stats.totalResources++;
                  if (paper.language && stats.languageBreakdown[paper.language] !== undefined) {
                    stats.languageBreakdown[paper.language]++;
                  }
                });
              }
            });
          }
        }
      });
    });

    // Count videos
    Object.keys(state.videos).forEach(gradeId => {
      Object.keys(state.videos[gradeId]).forEach(subjectId => {
        state.videos[gradeId][subjectId].forEach(video => {
          stats.totalVideos++;
          if (video.language && stats.languageBreakdown[video.language] !== undefined) {
            stats.languageBreakdown[video.language]++;
          }
        });
      });
    });

    stats.totalLanguages = Object.keys(stats.languageBreakdown).length;

    return stats;
  }, [state.grades, state.subjects, state.resources, state.videos]);

  const generateGradePageData = useCallback((gradeId) => {
    const grade = state.grades[gradeId];
    const subjects = getSubjectsForGrade(gradeId);
    const pageData = {
      grade: grade,
      subjects: {}
    };

    Object.keys(subjects).forEach(subjectId => {
      const subject = subjects[subjectId];
      const resources = getResources(gradeId, subjectId);
      const videos = getVideos(gradeId, subjectId);

      pageData.subjects[subjectId] = {
        ...subject,
        resources,
        videos
      };
    });

    return pageData;
  }, [state.grades, getSubjectsForGrade, getResources, getVideos]);

  // Export data
  const exportData = useCallback(() => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `teaching-torch-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    logActivity('Data exported successfully');
  }, [state, logActivity]);

  // Import data
  const importData = useCallback((jsonData) => {
    try {
      const importedData = JSON.parse(jsonData);
      
      if (!importedData.grades || !importedData.subjects) {
        throw new Error('Invalid data format');
      }
      
      dispatch({ type: 'INITIALIZE_DATA', payload: importedData });
      logActivity('Data imported successfully');
      return true;
    } catch (error) {
      console.error('Import failed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Import failed: Invalid data format' });
      return false;
    }
  }, [logActivity]);

  // Context value
  const value = {
    // State
    ...state,
    
    // Actions
    addTextbook,
    addPaper,
    addVideo,
    logActivity,
    addSubject,
    updateSubject,
    deleteSubject,
    
    // Utilities
    getSubjectsForGrade,
    getResources,
    getVideos,
    getStats,
    generateGradePageData,
    exportData,
    importData,
    
    // State management
    dispatch
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use the data context
export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;