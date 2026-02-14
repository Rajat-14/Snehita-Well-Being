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

  useEffect(() => {
    getUser();
    fetchPreviousAppointments();
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

      console.log("response ", response);
      localStorage.setItem("token", response.data.token);
      console.log("logged issue", response);
      setUserdata(response.data.user);
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
    else if(formData.mobileNumber.length!==10)
    {
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
                    <option value="Deepak Phogat">Deepak Phogat</option>
                    <option value="Gargi Tiwari">Gargi Tiwari</option>
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
