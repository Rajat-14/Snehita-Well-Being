import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import ManageAboutUs from "./ManageAboutUs";
import ManageCounselors from "./ManageCounselors";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("about");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="admin-dashboard-container">
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
        <div 
          className={`admin-nav-item ${activeTab === 'about' ? 'active' : ''}`}
          onClick={() => setActiveTab('about')}
        >
          Manage About Us
        </div>
        <div 
          className={`admin-nav-item ${activeTab === 'counselors' ? 'active' : ''}`}
          onClick={() => setActiveTab('counselors')}
        >
          Manage Counselors
        </div>
        <div className="admin-nav-item" onClick={() => navigate("/")}>
          View Public Site
        </div>
      </div>
      
      <div className="admin-content">
        {activeTab === 'about' && <ManageAboutUs />}
        {activeTab === 'counselors' && <ManageCounselors />}
      </div>
    </div>
  );
};

export default AdminDashboard;
