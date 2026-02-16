import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { BASE_URL } from "../services/helper";
import ClientAppointment from "./ClientAppointment";
import CounselorDashboard from "./CounselorDashboard";

const Appointment = () => {
  const navigate = useNavigate();
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
      localStorage.setItem("role", response.data.user.role); // Ensure role is updated in LS
      setUser(response.data.user);
    } catch (error) {
      //   console.error("Auth check failed:", error);
      toast.error("Please Login First!");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  if (!user) return null; // Or handle redirect

  if (user.role === 'counselor') {
    return <CounselorDashboard user={user} />;
  } else {
    return <ClientAppointment user={user} />;
  }
};

export default Appointment;
