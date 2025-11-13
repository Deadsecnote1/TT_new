import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const { selectedLanguage, setLanguage, getAvailableLanguages, getCurrentLanguage } = useLanguage();
  const location = useLocation();
  const languages = getAvailableLanguages();
  
  // State for dropdown visibility
  const [showGradesDropdown, setShowGradesDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  
  // Refs for dropdown elements
  const gradesDropdownRef = useRef(null);
  const languageDropdownRef = useRef(null);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (gradesDropdownRef.current && !gradesDropdownRef.current.contains(event.target)) {
        setShowGradesDropdown(false);
      }
      if (languageDropdownRef.current && !languageDropdownRef.current.contains(event.target)) {
        setShowLanguageDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Check if link is active
  const isActive = (path) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark fixed-top" style={{ backgroundColor: 'var(--primary)' }}>
      <div className="container">
        {/* Brand */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div 
            className="logo-placeholder me-2 d-flex align-items-center justify-content-center"
            style={{ 
              width: '40px', 
              height: '40px', 
              backgroundColor: 'white',
              borderRadius: '50%',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: 'var(--primary)'
            }}
          >
            T
          </div>
          <span className="brand-text text-white fw-bold">Teaching Torch</span>
        </Link>

        {/* Mobile Toggle */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Navigation Content */}
        <div className="collapse navbar-collapse" id="navbarNav">
          {/* Main Navigation */}
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link text-white ${isActive('/') ? 'active fw-bold' : ''}`}
                to="/"
              >
                <i className="bi bi-house-fill me-1"></i>Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link text-white ${isActive('/about') ? 'active fw-bold' : ''}`}
                to="/about"
              >
                <i className="bi bi-info-circle-fill me-1"></i>About
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link text-white ${isActive('/contact') ? 'active fw-bold' : ''}`}
                to="/contact"
              >
                <i className="bi bi-envelope-fill me-1"></i>Contact
              </Link>
            </li>

            {/* Grades Dropdown */}
            <li className="nav-item dropdown" ref={gradesDropdownRef}>
              <button 
                className="nav-link dropdown-toggle text-white btn btn-link border-0" 
                type="button"
                onClick={() => {
                  setShowGradesDropdown(!showGradesDropdown);
                  setShowLanguageDropdown(false);
                }}
                aria-expanded={showGradesDropdown}
                style={{ background: 'none', padding: '0.5rem 0.75rem' }}
              >
                <i className="bi bi-book-fill me-1"></i>Grades
              </button>
              <ul className={`dropdown-menu ${showGradesDropdown ? 'show' : ''}`}>
                <li>
                  <Link 
                    className="dropdown-item" 
                    to="/grade/grade6"
                    onClick={() => setShowGradesDropdown(false)}
                  >
                    Grade 6
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    to="/grade/grade7"
                    onClick={() => setShowGradesDropdown(false)}
                  >
                    Grade 7
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    to="/grade/grade8"
                    onClick={() => setShowGradesDropdown(false)}
                  >
                    Grade 8
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    to="/grade/grade9"
                    onClick={() => setShowGradesDropdown(false)}
                  >
                    Grade 9
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    to="/grade/grade10"
                    onClick={() => setShowGradesDropdown(false)}
                  >
                    Grade 10
                  </Link>
                </li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    to="/grade/grade11"
                    onClick={() => setShowGradesDropdown(false)}
                  >
                    Grade 11
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <Link 
                    className="dropdown-item" 
                    to="/grade/al"
                    onClick={() => setShowGradesDropdown(false)}
                  >
                    <i className="bi bi-mortarboard-fill me-2 text-success"></i>Advanced Level
                  </Link>
                </li>
              </ul>
            </li>
          </ul>

          {/* Right Side Controls */}
          <ul className="navbar-nav">
            {/* Language Filter Dropdown */}
            <li className="nav-item dropdown" ref={languageDropdownRef}>
              <button 
                className="nav-link dropdown-toggle text-white btn btn-link border-0" 
                type="button"
                onClick={() => {
                  setShowLanguageDropdown(!showLanguageDropdown);
                  setShowGradesDropdown(false);
                }}
                aria-expanded={showLanguageDropdown}
                style={{ background: 'none', padding: '0.5rem 0.75rem' }}
              >
                <i className="bi bi-translate me-1"></i>
                <span id="currentLanguage">
                  {getCurrentLanguage().display}
                </span>
              </button>
              <ul className={`dropdown-menu dropdown-menu-end ${showLanguageDropdown ? 'show' : ''}`}>
                {Object.entries(languages)
                  .filter(([langKey]) => langKey !== 'all') // Remove 'all' option
                  .map(([langKey, langConfig]) => (
                  <li key={langKey}>
                    <button
                      className={`dropdown-item language-option ${selectedLanguage === langKey ? 'active' : ''}`}
                      onClick={() => {
                        setLanguage(langKey);
                        setShowLanguageDropdown(false);
                      }}
                    >
                      <i className={`${langConfig.icon} me-2`} 
                         style={{ color: langConfig.color }}></i>
                      {langConfig.display}
                    </button>
                  </li>
                ))}
              </ul>
            </li>

            {/* Theme Toggle */}
            <li className="nav-item">
              <button 
                className="nav-link btn btn-link text-white border-0" 
                id="themeToggle" 
                title="Toggle Dark Mode"
                onClick={toggleTheme}
                style={{ background: 'none', padding: '0.5rem 0.75rem' }}
              >
                <i className={`bi ${theme === 'dark' ? 'bi-sun-fill' : 'bi-moon-fill'}`} 
                   id="themeIcon"></i>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Custom Navbar Styles */}
      <style jsx>{`
        .navbar {
          background-color: var(--primary) !important;
          box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          z-index: 1030;
        }
        
        .navbar-brand .brand-text {
          font-size: 1.25rem;
          font-weight: 700;
        }
        
        .nav-link {
          color: rgba(255,255,255,0.9) !important;
          font-weight: 500;
          transition: all 0.3s ease;
          border-radius: 5px;
          margin: 0 2px;
        }
        
        .nav-link:hover {
          color: white !important;
          background-color: rgba(255,255,255,0.1);
        }
        
        .nav-link.active {
          color: white !important;
          background-color: rgba(255,255,255,0.2);
        }
        
        .dropdown-menu {
          border: none;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
          border-radius: 8px;
          margin-top: 0.5rem;
          background-color: white;
          min-width: 200px;
        }
        
        .dropdown-menu.show {
          display: block;
        }
        
        .dropdown-item {
          padding: 0.75rem 1rem;
          transition: all 0.2s ease;
          color: #212529;
        }
        
        .dropdown-item:hover, .dropdown-item:focus {
          background-color: var(--primary);
          color: white;
        }
        
        .dropdown-item.active {
          background-color: var(--primary);
          color: white;
        }
        
        .dropdown-divider {
          border-color: #dee2e6;
        }
        
        .navbar-toggler {
          border: 1px solid rgba(255,255,255,0.3);
        }
        
        .navbar-toggler:focus {
          box-shadow: 0 0 0 0.25rem rgba(255,255,255,0.25);
        }
        
        @media (max-width: 991.98px) {
          .navbar-nav {
            background-color: rgba(0,0,0,0.1);
            border-radius: 8px;
            padding: 0.5rem;
            margin-top: 0.5rem;
          }
          
          .dropdown-menu {
            position: static !important;
            float: none;
            width: 100%;
            margin-top: 0;
            background-color: rgba(255,255,255,0.95);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;