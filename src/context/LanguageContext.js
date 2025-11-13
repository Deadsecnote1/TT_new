import React, { createContext, useContext, useState, useEffect } from 'react';

// Create Language Context
const LanguageContext = createContext();

// Language Provider Component
export const LanguageProvider = ({ children }) => {
  const [selectedLanguage, setSelectedLanguage] = useState('english');

  // Language configurations
  const languages = {
    'all': { 
      name: 'All Languages', 
      display: 'All Languages',
      icon: 'bi-globe',
      color: '#6c757d'
    },
    'sinhala': { 
      name: 'Sinhala', 
      display: 'සිංහල',
      icon: 'bi-circle-fill',
      color: '#FF5722'
    },
    'tamil': { 
      name: 'Tamil', 
      display: 'தமிழ்',
      icon: 'bi-circle-fill',
      color: '#9C27B0'
    },
    'english': { 
      name: 'English', 
      display: 'English',
      icon: 'bi-circle-fill',
      color: '#2196F3'
    }
  };

  // Initialize language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('selectedLanguage') || 'english';
    setSelectedLanguage(savedLanguage);
  }, []);

  // Set language
  const setLanguage = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem('selectedLanguage', language);
    
    // Dispatch custom event for other components
    window.dispatchEvent(new CustomEvent('languageChanged', { 
      detail: { language: language } 
    }));
  };

  // Get current language info
  const getCurrentLanguage = () => {
    return languages[selectedLanguage] || languages['all'];
  };

  // Get all available languages
  const getAvailableLanguages = () => {
    return languages;
  };

  // Check if showing all languages
  const isShowingAll = () => selectedLanguage === 'all';

  // Filter function for resources
  const shouldShowResource = (resourceLanguage) => {
    return resourceLanguage === selectedLanguage;
  };

  // Filter array of items by language
  const filterByLanguage = (items, getLanguage) => {
    return items.filter(item => {
      const itemLanguage = typeof getLanguage === 'function' 
        ? getLanguage(item) 
        : item[getLanguage] || item.language;
      return itemLanguage === selectedLanguage;
    });
  };

  // Get language indicator component props
  const getLanguageIndicator = (language) => {
    const langConfig = languages[language];
    if (!langConfig) return null;
    
    return {
      className: `language-indicator ${language}`,
      style: { backgroundColor: langConfig.color },
      title: langConfig.display
    };
  };

  // Count resources by language
  const countByLanguage = (resources) => {
    const counts = {
      all: 0,
      sinhala: 0,
      tamil: 0,
      english: 0
    };

    if (Array.isArray(resources)) {
      resources.forEach(resource => {
        const lang = resource.language || 'english';
        if (counts[lang] !== undefined) {
          counts[lang]++;
        }
        counts.all++;
      });
    } else if (typeof resources === 'object' && resources !== null) {
      Object.values(resources).forEach(resource => {
        if (Array.isArray(resource)) {
          resource.forEach(item => {
            const lang = item.language || 'english';
            if (counts[lang] !== undefined) {
              counts[lang]++;
            }
            counts.all++;
          });
        } else {
          const lang = resource.language || 'english';
          if (counts[lang] !== undefined) {
            counts[lang]++;
          }
          counts.all++;
        }
      });
    }

    return counts;
  };

  const value = {
    selectedLanguage,
    setLanguage,
    getCurrentLanguage,
    getAvailableLanguages,
    isShowingAll,
    shouldShowResource,
    filterByLanguage,
    getLanguageIndicator,
    countByLanguage,
    languages
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;