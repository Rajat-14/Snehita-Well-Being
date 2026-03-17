import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetAppointment } from "../../redux/actions/actions";
import { BASE_URL } from "../services/helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./userForm.css";
import TermsAndConditions from "./TermsAndConditions";

const GenInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loc = useLocation();

  const [userdata, setUserdata] = useState({});
  const [formData1, setFormData1] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  // Initial state strictly loading from localStorage to avoid sync issues
  const getSavedData = () => {
    try {
      const saved = localStorage.getItem("tempAppointmentData");
      if (saved) return JSON.parse(saved);
    } catch (e) { }
    return {};
  };

  const [formData, setFormData] = useState({
    Age: "",
    ModeOfReferal: "",
    Problem_Related_With: "",
    ProblemExtent: "",
    ProblemDescription: "",
    Duration_Of_Problem: "",
  });

  // Load Step 1 data
  useEffect(() => {
    const rawData = loc?.state?.formData || {};
    const savedData = getSavedData();

    // Combine location state with localstorage, giving priority to state just in case, but localStorage is the SSOT for form 2
    const combinedData = { ...savedData, ...rawData };

    setFormData1(combinedData);

    // Provide robust fallback to empty string so the select tags can reset properly
    setFormData(prev => ({
      ...prev,
      Age: combinedData.age || combinedData.Age || prev.Age || "",
      ModeOfReferal: combinedData.modeOfReferral || combinedData.ModeOfReferal || prev.ModeOfReferal || "",
      Problem_Related_With: combinedData.problemRelatedWith || combinedData.Problem_Related_With || prev.Problem_Related_With || "",
      ProblemExtent: combinedData.problemExtent || combinedData.ProblemExtent || prev.ProblemExtent || "",
      ProblemDescription: combinedData.problemDescription || combinedData.ProblemDescription || prev.ProblemDescription || "",
      Duration_Of_Problem: combinedData.durationPeriod || combinedData.Duration_Of_Problem || prev.Duration_Of_Problem || "",
    }));
  }, [loc]);

  // Load logged-in user
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/login/success`, {
          withCredentials: true,
        });
        setUserdata(response.data.user);
      } catch {
        navigate("/*");
      }
    };
    getUser();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Manual validation
    if (
      !formData.ModeOfReferal ||
      !formData.Problem_Related_With ||
      !formData.ProblemExtent
    ) {
      toast.error("Please select all required dropdown fields.");
      setIsSubmitting(false);
      return;
    }

    const finalAppointmentData = {
      fullName: formData1.fullName || userdata.person_name,
      mobileNumber: formData1.mobileNumber,
      email: formData1.email || userdata.email,
      appointmentDate: formData1.appointmentDate,
      counselorName: formData1.counselorName,
      timeSlot: formData1.timeSlot,

      age: formData.Age,
      gender: userdata.gender,
      modeOfReferral: formData.ModeOfReferal,
      problemRelatedWith: formData.Problem_Related_With,
      problemExtent: formData.ProblemExtent,
      problemDescription: formData.ProblemDescription,
      durationPeriod: formData.Duration_Of_Problem,
    };

    try {
      const createResponse = await axios.post(
        `${BASE_URL}/create`,
        finalAppointmentData,
        { withCredentials: true }
      );

      if (createResponse.status === 201) {
        toast.success("Appointment submitted successfully!", {
          autoClose: 2000,
        });

        localStorage.removeItem("tempAppointmentData"); // Clean up on success
        dispatch(resetAppointment());

        setTimeout(() => {
          navigate("/AppointmentSubmitted", {
            state: { formData: finalAppointmentData },
          });
        }, 1500);
      }
    } catch (error) {
      console.error("Submission error:", error);
      setIsSubmitting(false);

      if (error.response && error.response.status === 409) {
        toast.error(error.response.data.error || "Time slot already booked. Please choose another date and time.");
        localStorage.setItem("tempAppointmentData", JSON.stringify(finalAppointmentData));
        setTimeout(() => {
          navigate("/appointment");
        }, 2000);
      } else {
        toast.error("Submission failed. Please try again.");
      }
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <div className="formContent">
          <form onSubmit={handleSubmit}>
            <h2>User Data Form</h2>

            {/* ROW 1 */}
            <div className="inputRow">
              <div className="inputField" style={{ width: '100%' }}>
                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  placeholder="* Age"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            {/* ROW 2 */}
            <div className="inputRow">
              <div className="inputField" style={{ width: '100%' }}>
                <select
                  name="ModeOfReferal"
                  value={formData.ModeOfReferal}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    * Mode of Referral
                  </option>
                  <option value="Self">Self</option>
                  <option value="Friend">Friend</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Medical">Medical</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            {/* ROW 2b */}
            <div className="inputRow">
              <div className="inputField" style={{ width: '100%' }}>
                <select
                  name="Problem_Related_With"
                  value={formData.Problem_Related_With}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    * Problem Related With
                  </option>
                  <option value="Academics">Academics</option>
                  <option value="Relationship">Relationship</option>
                  <option value="Family">Family</option>
                  <option value="Finance">Finance</option>
                  <option value="Health">Health</option>
                  <option value="Lifestyle related">Lifestyle related</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* ROW 3 */}
            <div className="inputRow">
              <div className="inputField" style={{ width: '100%' }}>
                <select
                  name="ProblemExtent"
                  value={formData.ProblemExtent}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    * Problem Extent
                  </option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>
            </div>

            {/* ROW 4 */}
            <div className="inputRow">
              <div className="inputField" style={{ width: '100%' }}>
                <textarea
                  name="ProblemDescription"
                  value={formData.ProblemDescription}
                  placeholder="Problem Description"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* ROW 5 – Terms & Submit */}
            <div className="inputRow" style={{ flexDirection: 'column' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
                <input
                  type="checkbox"
                  id="terms"
                  required
                  style={{ width: 'auto', margin: 0, cursor: 'pointer' }}
                />
                <label htmlFor="terms" style={{ fontSize: '14px', cursor: 'pointer' }}>
                  I agree to the <span onClick={(e) => { e.preventDefault(); setShowTerms(true); }} style={{ color: 'blue', textDecoration: 'underline' }}>Terms and Conditions</span>
                </label>
              </div>
              <button
                type="submit"
                className="buttonSubmit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />

      {showTerms && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white', padding: '20px', borderRadius: '8px', maxWidth: '600px', width: '90%', maxHeight: '80vh', overflowY: 'auto', position: 'relative', marginTop: '80px'
          }}>
            <button
              type="button"
              onClick={() => setShowTerms(false)}
              style={{
                position: 'absolute', top: '20px', right: '10px', cursor: 'pointer', background: 'none', border: 'none', fontSize: '20px', fontWeight: 'bold'
              }}
            >
              &times;
            </button>
            <div style={{ marginTop: '20px', fontSize: '14px', lineHeight: '1.6', textAlign: 'left' }}>
              <TermsAndConditions />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenInfo;
