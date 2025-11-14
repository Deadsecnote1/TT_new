import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './context/DataContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

// Components
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import GradePage from './pages/GradePage';
import TextbooksPage from './pages/TextbooksPage';
import PapersPage from './pages/PapersPage';
import NotesPage from './pages/NotesPage';
import VideosPage from './pages/VideosPage';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/AdminDashboard';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/globals.css';
import './App.css';

// 404 Not Found Component
const NotFound = () => (
  <div className="container text-center py-5">
    <div className="row justify-content-center">
      <div className="col-md-6">
        <div className="error-page">
          <h1 className="display-1 text-primary">404</h1>
          <h2 className="mb-4">Page Not Found</h2>
          <p className="mb-4">The page you're looking for doesn't exist.</p>
          <a href="/" className="btn btn-primary">
            <i className="bi bi-house me-2"></i>
            Go Home
          </a>
        </div>
      </div>
    </div>
  </div>
);

function App() {
  // Handle GitHub Pages 404 redirect
  React.useEffect(() => {
    const redirectPath = sessionStorage.getItem('redirectPath');
    if (redirectPath && window.location.pathname === '/TT_new/index.html') {
      sessionStorage.removeItem('redirectPath');
      // Update the URL without reloading
      window.history.replaceState({}, '', redirectPath);
    }
  }, []);

  return (
    <ThemeProvider>
      <LanguageProvider>
        <DataProvider>
          <Router basename="/TT_new">
            <div className="App">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/grade/:gradeId" element={<GradePage />} />
                  <Route path="/grade/:gradeId/textbooks" element={<TextbooksPage />} />
                  <Route path="/grade/:gradeId/papers" element={<PapersPage />} />
                  <Route path="/grade/:gradeId/notes" element={<NotesPage />} />
                  <Route path="/grade/:gradeId/videos" element={<VideosPage />} />
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
        </DataProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

export default App;