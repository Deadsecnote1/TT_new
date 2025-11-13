import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const AdminLogin = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Debug: Log when component mounts
  useEffect(() => {
    console.log('AdminLogin component mounted');
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Simple password check (in production, use proper authentication)
    if (password === 'admin123') {
      localStorage.setItem('adminLoggedIn', 'true');
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid password. Try: admin123');
    }
  };

  return (
    <div className="admin-login-page" style={{ paddingTop: '76px' }}>
      {/* Page Header */}
      <header className="page-header">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Admin Login</h1>
          <p className="lead">Access the Teaching Torch administration panel</p>
        </div>
      </header>

      {/* Login Form */}
      <section className="py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-4">
              <div className="card">
                <div className="card-body p-4">
                  <h3 className="card-title text-center mb-4">
                    <i className="bi bi-shield-lock me-2"></i>
                    Admin Access
                  </h3>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter admin password"
                        required
                      />
                      <div className="form-text">
                        <small className="text-muted">Default: admin123</small>
                      </div>
                    </div>

                    <button type="submit" className="btn btn-primary w-100">
                      <i className="bi bi-box-arrow-in-right me-2"></i>
                      Login
                    </button>
                  </form>

                  <div className="text-center mt-3">
                    <Link to="/" className="text-muted">
                      <i className="bi bi-arrow-left me-1"></i>
                      Back to Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminLogin;