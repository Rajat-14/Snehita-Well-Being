import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { resetAppointment } from "../../redux/actions/actions";
import { BASE_URL } from "../services/helper";
import {
  FaUser,
  FaPhone,
  FaEnvelope,
  FaCalendar,
  FaIdCard,
  FaBook,
  FaDiagnoses,
  FaHospital,
  FaPage4,
  FaHourglass,
  FaGenderless,
  FaHome,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./userForm.css";
import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
import { FaPenToSquare, FaPerson } from "react-icons/fa6";

const GenInfo = () => {
  const [userdata, setUserdata] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const appointmentSubmitted = useSelector(
    (state) => state.appointmentSubmitted
  ); // get the state from the store
  const isFormSubmitted = useRef(false);

  useEffect(() => {
    if (!appointmentSubmitted && !isFormSubmitted.current) {
      navigate("/appointment");
    }
  }, [appointmentSubmitted, navigate]);

  const location = useLocation();
  const formData1 = location.state ? location.state.formData : {};
  const counselorName = useSelector((state) => state.counselorName);
  const [formData, setFormData] = useState({
    FullName: "",
    Age: "",
    Email: "",
    Gender: "",
    ModeOfReferal: "",
    Problem_Related_With: "",
    ProblemExtent: "",
    ProblemDescription: "",
    Duration_Of_Problem: "",
  });
  const navigate2 = useNavigate();
  const navigate3 = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/login/success`, {
        withCredentials: true,
      });
      console.log("logged issue", response.data);
      setUserdata(response.data.user);
    } catch (error) {
      navigate2("/*");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); // Start form submission

    const finalFormData = {
      ...formData,
      FullName: formData.FullName || userdata.person_name,
      Email: formData.Email || userdata.email,
      counselorName,
    };

    try {
      // Make both POST requests concurrently
      await Promise.all([
        axios.post(`${BASE_URL}/create`, formData1, {
          withCredentials: true,
        }),
        axios.post(`${BASE_URL}/send-email`, finalFormData, {
          withCredentials: true,
        }),
      ]);

      toast.success("Your appointment has been submitted successfully!", {
        autoClose: 2000, // Close toast after 2 seconds
      });
      isFormSubmitted.current = true;
      dispatch(resetAppointment());
      setTimeout(() => {
        navigate3("/AppointmentSubmitted", {
          state: { formData: finalFormData },
        });
      }, 2000); // Navigate to another pAge after 2 seconds
    } catch (error) {
      console.error("Error creating appointment:", error);
      // If any request fails, display an error messAge
      setIsSubmitting(false);
      toast.error(
        "An error occurred while submitting your appointment. Please try again.",
        {
          autoClose: 2000,
        }
      );
      setTimeout(() => {
        navigate3("/appointment");
      }, 2000);
    } finally {
      setIsSubmitting(false); // Stop form submission
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <div className="formContent">
          <form onSubmit={handleSubmit}>
            <h2>User Data Form</h2>
            <h3>
              🔒 Your Privacy is Our Priority 🔒
            </h3>
            <p style={{ fontStyle: "italic", color: "red"}}>
              We respect your privacy and handle your personal information with
              care. Your data stays safe with us, always.
            </p>
            <div className="inputRow">
              <div className="inputField">
                <FaUser className="icon" />
                <input
                  type="text"
                  value={userdata.person_name}
                  name="FullName"
                  placeholder="* Full Name"
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="inputField">
                <FaUser className="icon" />
                <input
                  type="number"
                  name="Age"
                  placeholder="* Age"
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>
            <div className="inputRow">
              <div className="inputField">
                <FaUser className="icon" />
                <input
                  type="text"
                  name="Email"
                  value={userdata.email}
                  placeholder="* Email"
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="inputField">
                <FaPerson className="icon" />
                <select name="Gender" onChange={handleInputChange} required>
                  <option value="" disabled selected>
                    * Gender
                  </option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
            </div>

            <div className="inputRow">
              <div className="inputField">
                <FaEnvelope className="icon" />
                <select
                  name="ModeOfReferal"
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled selected>
                    * Mode of referal
                  </option>
                  <option value="Self">Self</option>
                  <option value="Freind">Friend</option>
                  <option value="Faculty">Faculty</option>
                  <option value="Medical">Medical</option>
                </select>
              </div>

              <div className="inputField">
                <FaHospital className="icon" />
                <select
                  name="Problem_Related_With"
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled selected>
                    * Problem Related With
                  </option>
                  <option value="Academics">Academics</option>
                  <option value="Relationship">Relationship</option>
                  <option value="Faculties">Faculties</option>
                  <option value="Family">Family</option>
                  <option value="Finance">Finance</option>
                  <option value="Self">Self</option>
                  <option value="Health">Health</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>

            <div className="inputRow">
              <div className="inputField">
                <FaEnvelope className="icon" />
                <select
                  name="ProblemExtent"
                  onChange={handleInputChange}
                  required
                >
                  <option value="" disabled selected>
                    * Problem Extent
                  </option>
                  <option value="Moderate">Low</option>
                  <option value="Severe">Moderate</option>
                  <option value="Low">Severe</option>
                </select>
              </div>
              <div className="inputField">
                <FaHourglass className="icon" />
                <input
                  type="text"
                  name="Duration_Of_Problem"
                  placeholder=" Duration of Problem"
                  onChange={handleInputChange}
                />
              </div>
            </div>
            <div className="inputRow">
              <div className="inputField">
                <FaPenToSquare className="icon" />
                <textarea
                  name="ProblemDescription"
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
                  {isSubmitting && <div className="spinner"></div>}
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
