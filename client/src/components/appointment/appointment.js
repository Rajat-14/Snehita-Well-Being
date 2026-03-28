import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Navigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../services/helper";
import ClientAppointment from "./ClientAppointment";
import CounselorDashboard from "./CounselorDashboard";
import { useAdmin } from "../admin/AdminContext";

const Appointment = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAdmin();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/login/success`, {
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("role", response.data.user.role);
      setUser(response.data.user);
    } catch (error) {
      toast.error("Please Login First!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  // Admin has no business here — redirect to home silently
  if (isAdmin) return <Navigate to="/" replace />;

  if (loading) return <div>Loading...</div>;

  if (!user) return null;

  if (user.role === "counselor") {
    return <CounselorDashboard user={user} />;
  } else {
    return <ClientAppointment user={user} />;
  }
};

export default Appointment;
