import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../services/helper";
import "./AppointmentSubmitted.css";

const AppointmentSubmitted = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppointment = async () => {
      const state = location.state;
      if (!state || !state.appointmentId) {
        // Fallback to existing formData if available, else redirect
        if (state && state.formData) {
          setAppointment(state.formData);
          setLoading(false);
          return;
        }
        navigate("/");
        return;
      }

      try {
        const response = await axios.get(`${BASE_URL}/appointment/${state.appointmentId}`, { withCredentials: true });
        setAppointment(response.data);
      } catch (err) {
        console.error("Error fetching appointment:", err);
        setError("Failed to load appointment details.");
        // Fallback to formData if fetch fails but we have it? 
        if (state && state.formData) {
          setAppointment(state.formData);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAppointment();
  }, [location, navigate]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="submitted-container">Loading...</div>;
  if (error && !appointment) return <div className="submitted-container">{error}</div>;
  if (!appointment) return null;

  return (
    <div className="submitted-container">
      <h2>User Details</h2>
      <div className="submitted-data ">
        <p>
          <strong>Full Name:</strong> {appointment.fullName}
        </p>
        <p>
          <strong>Age:</strong> {appointment.age}
        </p>
        <p>
          <strong>Email:</strong> {appointment.email}
        </p>
        <p>
          <strong>Gender:</strong> {appointment.gender}
        </p>
        <p>
          <strong>ModeOfReferal:</strong> {appointment.modeOfReferral}
        </p>

        <p>
          <strong>Problem Related With:</strong> {appointment.problemRelatedWith}
        </p>
        <p>
          <strong>Problem Extent:</strong> {appointment.problemExtent}
        </p>
        <div className="label-content">
          <strong>Problem Description:</strong>
          <p>{appointment.problemDescription}</p>
        </div>

        <p>
          <strong>Duration of Problem:</strong> {appointment.durationPeriod}
        </p>
      </div>
      <div className="d-flex justify-content-center">
        <button className="print-button" onClick={handlePrint}>
          Print Details
        </button>
      </div>
    </div>
  );
};

export default AppointmentSubmitted;
