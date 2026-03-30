import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./admin.css";
import ManageAboutUs from "./ManageAboutUs";
import ManageCounselors from "./ManageCounselors";
import ManageContactUs from "./ManageContactUs";

const NAV_ITEMS = [
  { key: "about",    label: "Manage About Us" },
  { key: "contact",  label: "Manage Contact Us" },
  { key: "counselors", label: "Manage Counselors" },
];

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
        {NAV_ITEMS.map(item => (
          <div
            key={item.key}
            className={`admin-nav-item ${activeTab === item.key ? "active" : ""}`}
            onClick={() => setActiveTab(item.key)}
          >
            {item.label}
          </div>
        ))}
        <div className="admin-nav-item" onClick={() => navigate("/")}>
          View Public Site
        </div>
      </div>

      <div className="admin-content">
        {activeTab === "about"      && <ManageAboutUs />}
        {activeTab === "contact"    && <ManageContactUs />}
        {activeTab === "counselors" && <ManageCounselors />}
      </div>
    </div>
  );
};

export default AdminDashboard;
