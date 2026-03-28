import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BASE_URL } from '../services/helper';
import './admin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('srikrishna.valepe@gmail.com');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  // If already logged in as admin, redirect to dashboard
  useEffect(() => {
    axios.get(`${BASE_URL}/api/admin/verify`, { withCredentials: true })
      .then(() => navigate('/'))
      .catch(() => {}); // not logged in, stay on page
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }
    setIsSubmitting(true);
    try {
      await axios.post(`${BASE_URL}/api/admin/login`, { email, password }, { withCredentials: true });
      toast.success('Admin login successful!');
      setTimeout(() => navigate('/'), 800);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-card">
        {/* Logo / header */}
        <div className="admin-login-header">
          <div className="admin-login-icon">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2C9.38 2 7.25 4.13 7.25 6.75C7.25 9.32 9.26 11.4 11.88 11.49C11.96 11.48 12.04 11.48 12.1 11.49C14.72 11.4 16.73 9.32 16.73 6.75C16.74 4.13 14.61 2 12 2Z" fill="currentColor"/>
              <path d="M17.08 14.15C14.29 12.29 9.74 12.29 6.93 14.15C5.66 15 4.96 16.15 4.96 17.38C4.96 18.61 5.66 19.75 6.92 20.59C8.32 21.53 10.16 22 12 22C13.84 22 15.68 21.53 17.08 20.59C18.34 19.74 19.04 18.6 19.04 17.36C19.03 16.13 18.34 14.99 17.08 14.15Z" fill="currentColor"/>
            </svg>
          </div>
          <h1>Admin Portal</h1>
          <p>Snehita Well-Being Cell</p>
        </div>

        <form onSubmit={handleLogin} className="admin-login-form">
          <div className="admin-field">
            <label htmlFor="admin-email">Email Address</label>
            <input
              id="admin-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
            />
          </div>
          <div className="admin-field">
            <label htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              required
            />
          </div>
          <button
            type="submit"
            className="admin-login-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="admin-spinner" />
            ) : (
              'Sign In as Admin'
            )}
          </button>
        </form>
      </div>
      <ToastContainer position="top-center" />
    </div>
  );
};

export default AdminLogin;
