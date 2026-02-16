import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resetAppointment } from "../../redux/actions/actions";
import { BASE_URL } from "../services/helper";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "./userForm.css";

const GenInfo = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loc = useLocation();

  const [userdata, setUserdata] = useState({});
  const [formData1, setFormData1] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    Age: "",
    Gender: "",
    ModeOfReferal: "",
    Problem_Related_With: "",
    ProblemExtent: "",
    ProblemDescription: "",
    Duration_Of_Problem: "",
  });

  // Load Step 1 data
  useEffect(() => {
    if (loc?.state?.formData) {
      setFormData1(loc.state.formData);
    } else {
      console.error("Missing Step 1 data");
    }
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
      !formData.Gender ||
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
      gender: formData.Gender,
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
      toast.error("Submission failed. Please try again.");
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
              <div className="inputField">
                <input
                  type="number"
                  name="Age"
                  value={formData.Age}
                  placeholder="* Age"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="inputField">
                <select
                  name="Gender"
                  value={formData.Gender}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    * Select Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            {/* ROW 2 */}
            <div className="inputRow">
              <div className="inputField">
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
                </select>
              </div>

              <div className="inputField">
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
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            {/* ROW 3 */}
            <div className="inputRow">
              <div className="inputField">
                <select
                  name="ProblemExtent"
                  value={formData.ProblemExtent}
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled>
                    * Problem Extent
                  </option>
                  <option value="Low">Low</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </div>

              <div className="inputField">
                <input
                  type="text"
                  name="Duration_Of_Problem"
                  value={formData.Duration_Of_Problem}
                  placeholder="Duration of Problem"
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* ROW 4 */}
            <div className="inputRow">
              <div className="inputField">
                <textarea
                  name="ProblemDescription"
                  value={formData.ProblemDescription}
                  placeholder="Problem Description"
                  onChange={handleInputChange}
                />
              </div>

              <div className="inputField">
                <button
                  type="submit"
                  className="buttonSubmit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default GenInfo;
