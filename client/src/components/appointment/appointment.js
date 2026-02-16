import React, { useState, useEffect } from "react";
import { FaUser, FaPhone, FaEnvelope, FaCalendar } from "react-icons/fa";
import "./appointment.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux"; // import useSelector
import { selectCounselor } from "../../redux/actions/counselorActions"; // adjust the path as needed
import { appointmentSubmitted } from "../../redux/actions/actions"; // adjust the path as needed
import { BASE_URL } from "../services/helper";

const timeSlots = ["10:00 AM", "12:00 PM", "02:00 PM", "04:00 PM"];

const Appointment = () => {
  const navigate2 = useNavigate();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [userdata, setUserdata] = useState({});
  const [availableSlots, setAvailableSlots] = useState(timeSlots); // add this state to manage available slots

  const [formData, setFormData] = useState({
    fullName: "",
    mobileNumber: "",
    emailAddress: "",
    appointmentDate: "",
    counselorName: "",
    appointmentSlot: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [previousAppointments, setPreviousAppointments] = useState([]);
  const [counselorAppointments, setCounselorAppointments] = useState([]);



  useEffect(() => {
    getUser();
  }, []);

  const [counselorsList, setCounselorsList] = useState([]);

  useEffect(() => {
    // Fetch counselors list
    const fetchCounselors = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/api/counselors`, {
          withCredentials: true,
        });
        setCounselorsList(response.data);
      } catch (error) {
        console.error("Error fetching counselors:", error);
        toast.error("Error fetching counselors list");
      }
    };
    fetchCounselors();
  }, []);

  useEffect(() => {
    if (!formData.counselorName || !formData.appointmentDate) {
      setAvailableSlots([]); // clear the available slots
      return;
    }

    // fetch booked slots from the backend
    const fetchBookedSlots = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/bookedSlots`, {
          params: {
            counselorName: formData.counselorName,
            appointmentDate: formData.appointmentDate,
          },
          withCredentials: true,
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching booked slots:", error);
        toast.error("Error fetching booked slots:");
      }
    };

    fetchBookedSlots().then((bookedSlots) => {
      if (bookedSlots) {
        const newAvailableSlots = timeSlots.filter(
          (slot) => !bookedSlots.includes(slot)
        );
        setAvailableSlots(newAvailableSlots);
      }
    });
  }, [formData.counselorName, formData.appointmentDate]);

  const getUser = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/login/success`, {
        withCredentials: true,
      });

      localStorage.setItem("token", response.data.token);
      setUserdata(response.data.user);

      // Fallback to localStorage if API doesn't return role (or returns client default)
      // But verify API response structure first in logs
      const role = response.data.user.role || localStorage.getItem("role");

      if (role === 'counselor') {
        fetchCounselorAppointments(response.data.user.person_name);
      } else {
        fetchPreviousAppointments();
      }

    } catch (error) {
      toast.error("Please Login First!");
      setTimeout(() => {
        navigate2("/login");
      }, 2000);
    }
  };

  const fetchPreviousAppointments = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/data`, {
        withCredentials: true,
      });
      console.log(response.data);
      setPreviousAppointments(response.data);
    } catch (error) {
      console.error("Error fetching previous appointments:", error);
    }
  };

  const fetchCounselorAppointments = async (counselorName) => {
    try {
      const response = await axios.get(`${BASE_URL}/counselor/appointments`, {
        params: { counselorName },
        withCredentials: true,
      });
      setCounselorAppointments(response.data);
    } catch (error) {
      console.error("Error fetching counselor appointments:", error);
      toast.error("Error fetching appointments");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === "counselorName") {
      dispatch(selectCounselor(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const today = new Date();
    const selectedDate = new Date(formData.appointmentDate);
    if (selectedDate < today) {
      alert("Please choose a date starting from today");
      return;
    }
    else if (formData.mobileNumber.length !== 10) {
      toast.error("Enter 10 digit number!");
      return;
    }
    const appointmentsOnSelectedDate = previousAppointments.filter(appointment => new Date(appointment.appointmentDate).toDateString() === selectedDate.toDateString());
    if (appointmentsOnSelectedDate.length >= 1) {
      toast.error(`You have already booked an appointment on this '${selectedDate.toDateString()}'!`);
      return;
    }
    setIsSubmitted(true);
    dispatch(appointmentSubmitted());
  };

  const handlePrint = () => {
    window.print();
  };

  // Use local variable for role check to include fallback
  const currentRole = userdata.role || localStorage.getItem("role");

  if (currentRole === 'counselor') {
    return (
      <div className="BODY">
        <div className="appointment">
          <div className="counselor-view-container">
            <div className="counselor-requests-box">
              <h2>Pending Appointment Requests</h2>
              {counselorAppointments.length > 0 ? (
                <table className="counselor-requests-table">
                  <thead>
                    <tr>
                      <th>Serial No</th>
                      <th>Patient Name</th>
                      <th>Mobile</th>
                      <th>Email</th>
                      <th>Date</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counselorAppointments.map((appointment, index) => (
                      <tr key={appointment.id}>
                        <td>{index + 1}</td>
                        <td>{appointment.fullName}</td>
                        <td>{appointment.mobileNumber}</td>
                        <td>{appointment.emailAddress}</td>
                        <td>{new Date(appointment.appointmentDate).toDateString()}</td>
                        <td>{appointment.appointmentSlot}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p style={{ textAlign: 'center', padding: '20px', color: '#666' }}>No pending appointment requests found.</p>
              )}
            </div>
          </div>
        </div>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="BODY">
      <div className="appointment">
        <div className="form">
          {!isSubmitted ? (
            <>
              <form onSubmit={handleSubmit}>
                <h2>Booking Appointment</h2>
                <div className="input-box">
                  <FaUser className="fa" />
                  <input
                    type="text"
                    value={userdata.person_name}
                    name="fullName"
                    placeholder="* Enter Full name"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-box">
                  <FaPhone className="fa" />
                  <input
                    type="number"
                    name="mobileNumber"
                    placeholder="* Enter Mobile Number"
                    onChange={handleInputChange}
                    pattern="[0-9]{10}"
                    required
                  />
                </div>

                <div className="input-box">
                  <FaEnvelope className="fa" />
                  <input
                    type="email"
                    name="emailAddress"
                    value={userdata.email}
                    placeholder="* Enter Email Address"
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="input-box">
                  <FaCalendar className="fa" />
                  <input
                    type="date"
                    name="appointmentDate"
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="input-box">
                  <select
                    name="counselorName"
                    onChange={(e) => handleInputChange(e)}
                    required
                    className="counselor-select"
                  >
                    <option value="" disabled selected>
                      * Choose Counsellor
                    </option>
                    {counselorsList.map((counselor) => (
                      <option key={counselor.id} value={counselor.name}>
                        {counselor.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="input-box">
                  <select
                    name="appointmentSlot"
                    onChange={(e) => handleInputChange(e)}
                    required
                    className="time-slot-select"
                  >
                    <option value="" disabled selected>
                      * Choose Time Slot
                    </option>
                    {!formData.counselorName || !formData.appointmentDate ? (
                      <option disabled style={{ color: "blue" }}>
                        Choose both date and counsellor name!
                      </option>
                    ) : availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))
                    ) : (
                      <option disabled style={{ color: "red" }}>
                        Time slot not available
                      </option>
                    )}
                  </select>
                </div>

                <div className="input-box">
                  <input type="submit" value="Submit" />
                </div>
              </form>
            </>
          ) : (
            navigate("/otherinfo", { state: { formData: formData } })
          )}
        </div>
        <div className="form2">
          <div className="previous-appointments">
            <h2>Previous Appointments</h2>
            {previousAppointments.length > 0 ? (
              <table className="previous-appointments-table">
                <thead>
                  <tr>
                    <th>Serial No</th>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Counselor</th>
                  </tr>
                </thead>
                <tbody>
                  {previousAppointments.map((appointment, index) => (
                    <tr key={appointment.id} className="appointment-item">
                      <td>{index + 1}</td>
                      <td>
                        {
                          new Date(appointment.appointmentDate)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td>{appointment.appointmentSlot}</td>
                      <td>
                        <div className="counselor-name">
                          {appointment.counselorName}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No previous appointments found.</p>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Appointment;
