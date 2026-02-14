import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AppointmentSubmitted.css";
const AppointmentSubmitted = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const formData = location.state ? location.state.formData : {};
  const handlePrint = () => {
    window.print();
  };

  if (!location.state) {
    navigate("/"); // or wherever you want to redirect when state is not available
    return null;
  }

  return (
    <div className="submitted-container">
      <h2>User Details</h2>
      <div className="submitted-data ">
        <p>
          <strong>Full Name:</strong> {formData.FullName}
        </p>
        <p>
          <strong>Age:</strong> {formData.Age}
        </p>
        <p>
          <strong>Email:</strong> {formData.Email}
        </p>
        <p>
          <strong>Gender:</strong> {formData.Gender}
        </p>
        <p>
          <strong>ModeOfReferal:</strong> {formData.ModeOfReferal}
        </p>
      
        <p>
          <strong>Problem Related With:</strong> {formData.Problem_Related_With}
        </p>
        <p>
          <strong>Problem Extent:</strong> {formData.ProblemExtent}
        </p>
        <div className="label-content">
          <strong>Problem Description:</strong>
          <p>{formData.ProblemDescription}</p>
        </div>

        <p>
          <strong>Duration of Problem:</strong> {formData.Duration_Of_Problem}
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
