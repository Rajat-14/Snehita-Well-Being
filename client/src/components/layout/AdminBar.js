import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../admin/AdminContext';
import './AdminBar.css';

/**
 * AdminBar — floats at bottom of screen only when admin is logged in.
 * Shows current page hint + logout button. Completely invisible to non-admins.
 */
const AdminBar = () => {
  const { isAdmin, logout } = useAdmin();
  const navigate = useNavigate();

  if (!isAdmin) return null;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="admin-bar">
      <div className="admin-bar-inner">
        <span className="admin-bar-badge">🛡️ Admin Mode</span>
        <span className="admin-bar-hint">
          Navigate to <strong>About Us</strong>, <strong>Contact Us</strong> or <strong>Team</strong> to edit content
        </span>
        <button className="admin-bar-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default AdminBar;
