import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// Handle GitHub Pages 404 redirect BEFORE React loads
(function() {
  if (typeof window !== 'undefined' && typeof sessionStorage !== 'undefined') {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath && (window.location.pathname === '/TT_new/index.html' || window.location.pathname === '/TT_new/')) {
      sessionStorage.removeItem('redirectPath');
      // Update URL immediately so React Router sees the correct path
      window.history.replaceState({}, '', redirectPath);
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
