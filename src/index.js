import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Handle GitHub Pages 404 redirect BEFORE React loads
// This must run synchronously before React Router initializes
(function() {
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    try {
      const redirectPath = sessionStorage.getItem('redirectPath');
      const currentPath = window.location.pathname;
      
      // If we have a stored redirect path and we're at index.html, restore it
      if (redirectPath && (currentPath === '/TT_new/index.html' || currentPath === '/TT_new/')) {
        sessionStorage.removeItem('redirectPath');
        
        // Update URL immediately so React Router sees the correct path
        // Use replaceState to avoid page reload
        const fullPath = redirectPath;
        window.history.replaceState(null, '', fullPath);
        
        // Force a location update for React Router
        // This ensures React Router sees the correct path on initialization
        if (window.location.pathname !== fullPath) {
          window.location.replace(fullPath);
        }
      }
    } catch(e) {
      console.error('Error restoring redirect path:', e);
    }
  }
})();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

reportWebVitals();
